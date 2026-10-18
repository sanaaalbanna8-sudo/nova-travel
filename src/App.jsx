import { useCallback, useState } from 'react'
import { STORAGE_IDENTITY } from './config'
import { ensureSeatPath } from './paths'
import Landing from './components/Landing'
import HostRoom from './components/HostRoom'
import StudentRoom from './components/StudentRoom'

function readIdentity() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_IDENTITY) || 'null')
    if (saved?.role === 'host' && saved.pin) return saved
    if (saved?.role === 'student' && saved.studentId) return saved
  } catch {
    /* تُفتح صفحة الدخول */
  }
  return null
}

export default function App() {
  const [gate] = useState(ensureSeatPath)
  const [identity, setIdentity] = useState(readIdentity)
  const [error, setError] = useState('')

  const leave = useCallback((message = '') => {
    sessionStorage.removeItem(STORAGE_IDENTITY)
    setIdentity(null)
    setError(message)
  }, [])

  const enterHost = (pin) => {
    const next = { role: 'host', pin }
    sessionStorage.setItem(STORAGE_IDENTITY, JSON.stringify(next))
    setError('')
    setIdentity(next)
  }

  const enterStudent = (studentId) => {
    const next = { role: 'student', studentId }
    sessionStorage.setItem(STORAGE_IDENTITY, JSON.stringify(next))
    setError('')
    setIdentity(next)
  }

  const seated =
    identity && ((gate === 'host' && identity.role === 'host') || (gate === 'student' && identity.role === 'student'))

  if (!seated) return <Landing gate={gate} error={error} onHost={enterHost} onStudent={enterStudent} />
  if (identity.role === 'host') return <HostRoom identity={identity} onLeave={leave} />
  return <StudentRoom identity={identity} onLeave={leave} />
}
