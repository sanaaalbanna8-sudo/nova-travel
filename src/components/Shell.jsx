import { useEffect, useState } from 'react'
import { BRAND_AR, BRAND_EN, MEETING_AR, MEETING_EN } from '../config'

export function useCountdown(endsAt) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!endsAt) return undefined
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [endsAt])

  if (!endsAt) return null
  const left = Math.max(0, endsAt - now)
  const minutes = Math.floor(left / 60000)
  const seconds = Math.floor((left % 60000) / 1000)
  return {
    done: left === 0,
    label: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  }
}

export function Mark({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M32 12.5 34.4 27 32 24.8 29.6 27 32 12.5Zm0 39-2.4-14.5L32 39.2 34.4 37 32 51.5ZM12.5 32 27 29.6 24.8 32 27 34.4 12.5 32Zm39 0L37 34.4 39.2 32 37 29.6 51.5 32Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center" role="dialog">
      <button className="absolute inset-0 cursor-default" aria-label="إغلاق" onClick={onClose} />
      <div className={`panel relative max-h-[88vh] w-full overflow-y-auto p-5 sm:p-7 ${wide ? 'max-w-5xl' : 'max-w-2xl'}`}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="font-display text-3xl text-gold2">{title}</h2>
          <button className="btn-ghost min-h-10 px-3 py-2" onClick={onClose}>
            إغلاق
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Shell({ status, onLeave, leaveLabel = 'مغادرة القاعة', children }) {
  const statusMap = {
    live: { text: 'Live', className: 'border border-line bg-panel2 px-3 tracking-[0.14em] text-mist' },
    local: { text: 'تجريبي على هذا الجهاز', className: 'bg-gold text-ink' },
    connecting: { text: 'جارٍ الربط', className: 'bg-panel2 text-mist' },
  }
  const pill = statusMap[status] || statusMap.connecting

  return (
    <div className="relative z-10 min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3 text-gold">
            <Mark />
            <div>
              <p className="text-sm font-semibold leading-5 text-white">
                {BRAND_AR}
                <span className="mx-1.5 font-normal text-faint">·</span>
                <span className="font-medium tracking-wide text-gold2">{BRAND_EN}</span>
              </p>
              <p className="text-xs leading-5 text-mist">
                {MEETING_AR}
                <span className="mx-1.5 text-faint">·</span>
                <span className="tracking-wide">{MEETING_EN}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pill.className}`}>{pill.text}</span>
            <button className="btn-ghost min-h-10 px-3 py-2 text-xs" onClick={onLeave}>
              {leaveLabel}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}
