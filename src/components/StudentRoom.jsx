import { useEffect } from 'react'
import cases from '../data/cases.json'
import roles from '../data/roles.json'
import { BRAND_EN, LEVEL_STYLE, MEETING_AR, MEETING_EN, PHASE_LABEL } from '../config'
import { summarize } from '../../shared/meeting.js'
import { useMeeting } from '../hooks/useMeeting'
import { Shell, useCountdown } from './Shell'
import CaseCard from './CaseCard'
import ResultsBoard from './ResultsBoard'
import Briefing from './Briefing'
import { useVoteSeconds } from './VoteStage'

export default function StudentRoom({ identity, onLeave }) {
  const { state, status, send } = useMeeting(identity)
  const role = roles.find((item) => item.id === identity.studentId)
  const clock = useCountdown(state?.timerEndsAt)
  const secondsLeft = useVoteSeconds(state?.voteEndsAt, state?.phase === 'voting')

  useEffect(() => {
    if (status === 'local') send({ type: 'arrive' })
  }, [status])

  useEffect(() => {
    if (!role) return undefined
    document.title = `${role.title} | ${BRAND_EN}`
    return () => {
      document.title = `${MEETING_AR} | ${MEETING_EN}`
    }
  }, [role])

  if (status === 'replaced') {
    return (
      <Shell status="connecting" onLeave={() => onLeave('')}>
        <div className="panel mx-auto max-w-xl p-8 text-center">
          <h1 className="font-display text-4xl text-ink">هذا الرقم مفتوح على جهاز آخر</h1>
          <p className="mt-4 leading-8 text-mist">إذا كان الجهاز الحالي هو المقصود، يُعاد اختيار الرقم بعد إغلاق الصفحة الأخرى.</p>
          <button className="btn-gold mt-6" onClick={() => onLeave('')}>
            العودة لاختيار الرقم
          </button>
        </div>
      </Shell>
    )
  }

  if (!state || !role) {
    return (
      <Shell status={status} onLeave={() => onLeave('')}>
        <p className="panel p-8 text-center text-mist">جارٍ فتح قاعة الاجتماع…</p>
      </Shell>
    )
  }

  const opening = state.briefing !== null && state.briefing !== undefined
  const item = cases[state.caseIndex] || cases[0]
  const myVote = state.votes ? state.votes[String(role.id)] || null : state.myVote || null
  const summary = state.phase === 'results' ? state.summary || summarize(state.votes || {}, roles) : null
  const votingOpen = state.phase === 'voting'

  return (
    <Shell status={status} onLeave={() => onLeave('')} leaveLabel="تغيير الرقم" stage progress={(state.caseIndex + 1) / cases.length}>
      <div className={`board board-student ${opening ? 'is-opening' : ''}`}>
        <div className="board-main">
          {opening ? (
            <Briefing step={state.briefing} onStep={(step) => send({ type: 'brief', step })} />
          ) : (
            <>
          <CaseCard item={item} mode="story" />
          {summary ? (
            <ResultsBoard item={item} summary={summary} myVote={myVote} compact />
          ) : (
            <CaseCard
              item={item}
              mode="choices"
              myVote={myVote}
              votingOpen={votingOpen}
              onVote={votingOpen ? (choice) => send({ type: 'vote', choice }) : null}
            />
          )}
            </>
          )}
          <div className="board-dock">
            <span className={`chip ${LEVEL_STYLE[role.level].chip}`}>{role.levelLabel}</span>
            <strong className="text-sm text-ink">{role.name}</strong>
            <span className="text-xs font-bold text-faint">{role.title}</span>
            <span className="me-auto text-xs font-bold text-mist">
              {opening
                ? ['الهيكل التنظيمي', 'الهرم التنظيمي', 'أسئلة الاستنتاج', 'السياسات والتهديدات'][state.briefing]
                : state.phase === 'discuss'
                  ? Number(item.addressedTo) === role.id
                    ? 'هالمشكلة إلك'
                    : PHASE_LABEL[state.phase]
                  : PHASE_LABEL[state.phase]}
              {clock ? ` · ${clock.done ? 'انتهى النقاش' : clock.label}` : ''}
            </span>
            {secondsLeft !== null && (
              <div className={`vote-student-clock ${secondsLeft <= 3 ? 'is-urgent' : ''}`}>
                <strong key={secondsLeft}>{secondsLeft}</strong>
                <span>ثانية</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  )
}
