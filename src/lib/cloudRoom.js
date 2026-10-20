import roles from '../data/roles.json'
import { apply, createState, summarize, votedCaseIndexes } from '../../shared/meeting.js'

const CONFIG = {
  apiKey: 'AIzaSyDqo-AyryLhYPAIBrPy-O15S6W_9HkRbPY',
  authDomain: 'presentation-e045c.firebaseapp.com',
  databaseURL: 'https://presentation-e045c-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'presentation-e045c',
}

const ROOT = 'novaTravel'
const STUDENT_ACTIONS = new Set(['vote', 'advise', 'arrive', 'tap'])

function database() {
  const firebase = window.firebase
  if (!firebase?.initializeApp || !firebase?.database) return null
  if (!firebase.apps?.length) firebase.initializeApp(CONFIG)
  return firebase.database()
}

function screenOf(state) {
  if (Number.isInteger(state.quizIndex) && typeof state.briefing !== 'number') return 'quiz'
  if (typeof state.briefing === 'number') return 'brief'
  return 'cases'
}

function defang(value) {
  if (Array.isArray(value)) return value.map(defang)
  if (!value || typeof value !== 'object') return value
  const out = {}
  for (const [key, item] of Object.entries(value)) {
    out[/^\d+$/.test(key) ? `k${key}` : key] = defang(item)
  }
  return out
}

function rehydrate(value) {
  if (Array.isArray(value)) {
    const objects = value.filter((item) => item && typeof item === 'object')
    const ledger = objects.some((item) => item.kind)
    if (!ledger && (objects.length > 0 || value.some((item) => typeof item === 'string'))) {
      const out = {}
      value.forEach((item, index) => {
        if (item != null) out[String(index)] = rehydrate(item)
      })
      return out
    }
    return value.map(rehydrate)
  }
  if (!value || typeof value !== 'object') return value
  const out = {}
  for (const [key, item] of Object.entries(value)) {
    const plain = /^k(\d+)$/.exec(key)
    out[plain ? plain[1] : key] = rehydrate(item)
  }
  return out
}

function asMap(value) {
  const data = rehydrate(value)
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
  return data
}

function pack(state) {
  return defang(JSON.parse(JSON.stringify({ ...state, screen: screenOf(state) })))
}

function normalize(raw) {
  const data = rehydrate(raw)
  if (!data || typeof data.rev !== 'number') return null
  let briefing = typeof data.briefing === 'number' ? data.briefing : 0
  let quizIndex = Number.isInteger(data.quizIndex) ? data.quizIndex : null
  if (data.screen === 'quiz') briefing = null
  if (data.screen === 'cases') {
    briefing = null
    quizIndex = null
  }
  return {
    ...createState(),
    ...data,
    votes: asMap(data.votes),
    history: asMap(data.history),
    quizHistory: asMap(data.quizHistory),
    ledger: Array.isArray(data.ledger) ? data.ledger : [],
    advice: data.advice || null,
    timerEndsAt: typeof data.timerEndsAt === 'number' ? data.timerEndsAt : null,
    voteEndsAt: typeof data.voteEndsAt === 'number' ? data.voteEndsAt : null,
    quizIndex,
    briefing,
    curtain: {
      studentId: Number.isInteger(Number(data.curtain?.studentId)) ? Number(data.curtain.studentId) : 0,
      guess: data.curtain?.guess ? String(data.curtain.guess) : '',
    },
  }
}

function project(full, identity) {
  if (!full) return null
  if (identity.role === 'host') return { ...full, votedCases: votedCaseIndexes(full) }
  const key = String(identity.studentId)
  return {
    rev: full.rev,
    caseIndex: full.caseIndex,
    phase: full.phase,
    timerEndsAt: full.timerEndsAt,
    voteEndsAt: full.voteEndsAt,
    advice: full.advice,
    briefing: full.briefing,
    quizIndex: full.quizIndex,
    curtain: full.curtain || { studentId: 0, guess: '' },
    discussStartedAt: full.discussStartedAt,
    updatedAt: full.updatedAt,
    myVote: full.votes?.[key] || null,
    summary: full.phase === 'results' ? summarize(full.votes || {}, roles) : null,
  }
}

export function openCloud(identity, caseCount) {
  const db = database()
  if (!db) return Promise.resolve(null)

  const stateRef = db.ref(`${ROOT}/state`)
  const presenceRoot = db.ref(`${ROOT}/presence`)
  const listeners = []
  let replaced = false
  let arrived = false
  let stateHandler = null
  let presenceHandler = null
  let replacedHandler = null
  let latestState
  let sawState = false
  let latestPresence = []
  let sawPresence = false
  const tabId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

  const session = {
    set onState(fn) {
      stateHandler = fn
      if (sawState) fn?.(latestState)
    },
    set onPresence(fn) {
      presenceHandler = fn
      if (sawPresence) fn?.(latestPresence)
    },
    set onReplaced(fn) {
      replacedHandler = fn
    },
    send(action) {
      if (replaced) return Promise.resolve()
      const mine = identity
      let nextAction = action
      if (mine.role !== 'host') {
        if (!STUDENT_ACTIONS.has(action.type)) return Promise.resolve()
        if (action.type !== 'advise') nextAction = { ...action, studentId: mine.studentId }
      }
      return stateRef.transaction((current) => {
        const base = normalize(current)
        if (!base) {
          if (mine.role !== 'host') return
          const created = createState()
          const applied = apply(created, nextAction, caseCount)
          return pack(applied === created ? created : applied)
        }
        const applied = apply(base, nextAction, caseCount)
        if (applied === base) return
        return pack(applied)
      })
    },
    close() {
      for (const stop of listeners) stop()
      listeners.length = 0
    },
  }

  return new Promise((resolve) => {
    let settled = false
    const finish = (value) => {
      if (settled) return
      settled = true
      resolve(value)
    }

    const onState = (snap) => {
      const full = normalize(snap.val())
      sawState = true
      latestState = project(full, identity)
      stateHandler?.(latestState)
      if (identity.role === 'student' && full && !arrived) {
        arrived = true
        session.send({ type: 'arrive' })
      }
      if (!settled) finish(session)
    }
    const onStateError = () => {
      session.close()
      finish(null)
    }
    stateRef.on('value', onState, onStateError)
    listeners.push(() => stateRef.off('value', onState))

    const onPresence = (snap) => {
      const val = snap.val() || {}
      const ids = Object.keys(val)
        .map((key) => Number(String(key).replace(/^s/, '')))
        .filter((id) => Number.isInteger(id) && id >= 1 && id <= 17)
        .sort((a, b) => a - b)
      sawPresence = true
      latestPresence = ids
      presenceHandler?.(ids)
    }
    presenceRoot.on('value', onPresence)
    listeners.push(() => presenceRoot.off('value', onPresence))

    if (identity.role === 'student' && Number.isInteger(Number(identity.studentId))) {
      const id = `s${Number(identity.studentId)}`
      const presenceRef = db.ref(`${ROOT}/presence/${id}`)
      const seatRef = db.ref(`${ROOT}/seats/${id}`)
      presenceRef.onDisconnect().remove()
      seatRef.onDisconnect().remove()
      presenceRef.set({ at: Date.now() })
      seatRef.set({ tabId, at: Date.now() })
      const onSeat = (snap) => {
        const seat = snap.val()
        if (!seat?.tabId || seat.tabId === tabId) return
        replaced = true
        replacedHandler?.()
      }
      seatRef.on('value', onSeat)
      listeners.push(() => {
        seatRef.off('value', onSeat)
        presenceRef.remove()
        seatRef.remove()
      })
    }

    setTimeout(() => {
      if (settled) return
      session.close()
      finish(null)
    }, 20000)
  })
}
