import { useEffect, useRef, useState } from 'react'
import cases from '../data/cases.json'
import roles from '../data/roles.json'
import { STORAGE_LOCAL } from '../config'
import { apply, createState } from '../../shared/meeting.js'

function socketUrl() {
  if (import.meta.env.VITE_SYNC_URL) return import.meta.env.VITE_SYNC_URL
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}/ws`
}

function readLocal() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_LOCAL) || '')
    if (parsed && typeof parsed.rev === 'number' && parsed.votes) return parsed
  } catch {
    /* تُستخدم حالة جديدة */
  }
  return createState()
}

export function useMeeting(identity) {
  const [state, setState] = useState(null)
  const [onlineIds, setOnlineIds] = useState([])
  const [status, setStatus] = useState('connecting')
  const wsRef = useRef(null)
  const modeRef = useRef('connecting')
  const everRef = useRef(false)
  const identityRef = useRef(identity)
  identityRef.current = identity

  useEffect(() => {
    let stopped = false
    let retry
    const channel = new BroadcastChannel('nova-meeting')

    const enterLocal = () => {
      if (stopped || everRef.current || modeRef.current === 'local') return
      modeRef.current = 'local'
      setStatus('local')
      setOnlineIds([])
      setState(readLocal())
    }

    const onChannel = (event) => {
      if (modeRef.current !== 'local' || event.data?.kind !== 'state') return
      setState(event.data.state)
    }
    const onStorage = (event) => {
      if (event.key !== STORAGE_LOCAL || modeRef.current !== 'local' || !event.newValue) return
      try {
        setState(JSON.parse(event.newValue))
      } catch {
        /* تُتجاهل القيمة التالفة */
      }
    }
    channel.addEventListener('message', onChannel)
    window.addEventListener('storage', onStorage)

    const connect = () => {
      if (stopped || modeRef.current === 'local' || modeRef.current === 'denied') return
      let ws
      try {
        ws = new WebSocket(socketUrl())
      } catch {
        enterLocal()
        return
      }
      wsRef.current = ws
      ws.onopen = () => {
        if (stopped) return
        everRef.current = true
        modeRef.current = 'live'
        setStatus('live')
        const current = identityRef.current
        if (current.role === 'host') {
          ws.send(JSON.stringify({ type: 'join', role: 'host', pin: current.pin }))
        } else {
          ws.send(JSON.stringify({ type: 'join', role: 'student', studentId: current.studentId }))
        }
      }
      ws.onmessage = (event) => {
        if (stopped) return
        let message
        try {
          message = JSON.parse(event.data)
        } catch {
          return
        }
        if (message.type === 'error' && message.code === 'pin') {
          stopped = true
          modeRef.current = 'denied'
          setStatus('denied')
          ws.close()
          return
        }
        if (message.type === 'replaced') {
          stopped = true
          modeRef.current = 'replaced'
          setStatus('replaced')
          return
        }
        if (message.type === 'presence') setOnlineIds(message.onlineIds || [])
        if (message.type === 'state') {
          setOnlineIds(message.onlineIds || [])
          setState((prev) => (!prev || message.state.rev >= prev.rev ? message.state : prev))
        }
      }
      ws.onclose = () => {
        if (stopped) return
        if (!everRef.current) {
          enterLocal()
          return
        }
        setStatus('connecting')
        retry = setTimeout(connect, 1200)
      }
      ws.onerror = () => {}
    }

    connect()

    return () => {
      stopped = true
      clearTimeout(retry)
      channel.close()
      window.removeEventListener('storage', onStorage)
      wsRef.current?.close()
    }
  }, [identity.role, identity.pin, identity.studentId])

  const send = (action) => {
    if (modeRef.current === 'live' && wsRef.current?.readyState === WebSocket.OPEN) {
      if (action.type === 'vote') {
        wsRef.current.send(JSON.stringify({ type: 'vote', choice: action.choice }))
      } else if (action.type === 'advise' && identityRef.current.role === 'student') {
        wsRef.current.send(JSON.stringify({ type: 'advise', choice: action.choice }))
      } else {
        wsRef.current.send(
          JSON.stringify({
            type: 'host',
            action: action.type,
            caseIndex: action.caseIndex,
            minutes: action.minutes,
            choice: action.choice,
            step: action.step,
            studentId: action.studentId,
            guess: action.guess,
          }),
        )
      }
      return
    }
    if (modeRef.current !== 'local') return
    setState((current) => {
      const base = current || readLocal()
      const next = apply(
        base,
        action.type === 'vote' || action.type === 'arrive' ? { ...action, studentId: identityRef.current.studentId } : action,
        cases.length,
      )
      if (next === base) return base
      localStorage.setItem(STORAGE_LOCAL, JSON.stringify(next))
      const channel = new BroadcastChannel('nova-meeting')
      channel.postMessage({ kind: 'state', state: next })
      channel.close()
      return next
    })
  }

  return { state, onlineIds, status, send, caseCount: cases.length, roles }
}
