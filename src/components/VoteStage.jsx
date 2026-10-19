import { useEffect, useMemo, useRef, useState } from 'react'
import { CHOICE_STYLE } from '../config'
import { tally, summarize } from '../../shared/meeting.js'
import { playVoteLand, playVoteReveal, playVoteTick } from '../lib/voteSound'
import roles from '../data/roles.json'

function useNow(active) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!active) return undefined
    const id = setInterval(() => setNow(Date.now()), 80)
    return () => clearInterval(id)
  }, [active])
  return now
}

function useCountUp(target, run) {
  const [value, setValue] = useState(run ? 0 : target)
  useEffect(() => {
    if (!run) {
      setValue(target)
      return undefined
    }
    let frame
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min(1, (now - start) / 1100)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, run])
  return value
}

export function useVoteSeconds(endsAt, active) {
  const now = useNow(Boolean(active && endsAt))
  if (!active || !endsAt) return null
  return Math.max(0, Math.ceil((endsAt - now) / 1000))
}

export default function VoteStage({ item, phase, endsAt, votes, seconds = 12 }) {
  const live = phase === 'voting'
  const reveal = phase === 'results'
  const now = useNow(live)
  const leftMs = live && endsAt ? Math.max(0, endsAt - now) : 0
  const second = live ? Math.max(0, Math.ceil(leftMs / 1000)) : 0
  const urgent = live && second > 0 && second <= 3
  const progress = live ? Math.min(1, leftMs / (seconds * 1000)) : reveal ? 1 : 0
  const counts = useMemo(() => tally(votes || {}), [votes])
  const levels = useMemo(() => summarize(votes || {}, roles).levels, [votes])
  const top = Math.max(counts.counts.A, counts.counts.B, counts.counts.C)
  const radius = 92
  const circumference = 2 * Math.PI * radius
  const seen = useRef(-1)
  const prev = useRef({ A: 0, B: 0, C: 0, total: 0 })
  const [pops, setPops] = useState([])

  useEffect(() => {
    if (!live) return undefined
    seen.current = -1
    prev.current = { A: counts.counts.A, B: counts.counts.B, C: counts.counts.C, total: counts.total }
    return undefined
  }, [live, endsAt])

  useEffect(() => {
    if (!live || second < 1 || second === seen.current) return undefined
    if (seen.current !== -1) playVoteTick(second)
    seen.current = second
    return undefined
  }, [live, second])

  useEffect(() => {
    if (!reveal) return undefined
    playVoteReveal()
    return undefined
  }, [reveal])

  useEffect(() => {
    const before = prev.current
    const letter = ['A', 'B', 'C'].find((key) => counts.counts[key] > before[key])
    prev.current = { A: counts.counts.A, B: counts.counts.B, C: counts.counts.C, total: counts.total }
    if (!live || !letter || counts.total <= before.total) return undefined
    playVoteLand()
    const id = `${Date.now()}-${letter}`
    setPops((list) => [...list.slice(-7), { id, letter }])
    const wipe = setTimeout(() => setPops((list) => list.filter((item) => item.id !== id)), 1400)
    return () => clearTimeout(wipe)
  }, [counts, live])

  return (
    <section className={`vote-stage ${urgent ? 'is-urgent' : ''} ${reveal ? 'is-reveal' : ''}`}>
      <div className="vote-stage-flare" aria-hidden="true" />
      <div className="vote-pops" aria-hidden="true">
        {pops.map((pop) => (
          <span key={pop.id} className={`vote-pop tone-${pop.letter}`}>
            {pop.letter}
          </span>
        ))}
      </div>
      <div className="vote-stage-copy">
        <p className="text-xs tracking-[0.18em] text-gold2">{reveal ? 'النتائج' : 'باب التصويت'}</p>
        <h2 className="mt-1 font-display text-2xl text-ink">{item.question}</h2>
        <p className="mt-2 text-sm text-mist">{reveal ? 'أُغلق العدّ. هذا توزيع القاعة.' : 'اثنتا عشرة ثانية. الكل يصوّت.'}</p>
      </div>
      <div className="vote-ring-wrap">
        <svg viewBox="0 0 220 220" className="vote-ring" aria-hidden="true">
          <circle cx="110" cy="110" r={radius} className="vote-ring-track" />
          <circle
            cx="110"
            cy="110"
            r={radius}
            className="vote-ring-value"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
        </svg>
        <div className={`vote-count ${urgent ? 'is-pop' : ''}`} key={live ? second : 'done'}>
          <strong>{reveal ? counts.total : second}</strong>
          <small>{reveal ? 'صوت' : 'ثانية'}</small>
        </div>
      </div>
      <div className="vote-columns">
        {item.options.map((option, index) => (
          <Column
            key={option.key}
            option={option}
            count={counts.counts[option.key]}
            percent={counts.percents[option.key]}
            total={counts.total}
            reveal={reveal}
            winner={reveal && counts.total > 0 && counts.counts[option.key] === top}
            delay={index}
          />
        ))}
      </div>
      {reveal && (
        <div className="vote-levels">
          <p className="vote-levels-note">حسب المستوى · أ / ب / ج</p>
          {['strategic', 'management', 'operational'].map((key) => {
            const level = levels[key]
            if (!level) return null
            return (
              <p key={key}>
                <span>{level.label}</span>
                <b>
                  {level.A}/{level.B}/{level.C}
                </b>
              </p>
            )
          })}
        </div>
      )}
    </section>
  )
}

function Column({ option, count, percent, total, reveal, winner, delay }) {
  const shown = useCountUp(reveal ? percent : percent, reveal)
  const width = reveal ? shown : total ? percent : 0
  return (
    <article className={`vote-col ${winner ? 'is-winner' : ''}`} style={{ '--d': `${delay * 80}ms`, '--bar': CHOICE_STYLE[option.key].bar }}>
      <div className="vote-col-top">
        <span>{option.key}</span>
        <b>{reveal ? shown : count}</b>
        <small>{reveal ? '٪' : 'صوت'}</small>
      </div>
      <div className="vote-shaft">
        <i style={{ height: `${width}%` }} />
      </div>
        <p>{option.title}</p>
        <small className={option.role ? 'is-role' : ''}>{option.role ? `${option.role}. ${option.text}` : option.text}</small>
    </article>
  )
}
