import { useEffect } from 'react'
import cases from '../data/cases.json'
import roles from '../data/roles.json'
import { BRAND_EN, LEVEL_STYLE, MEETING_AR, MEETING_EN, PHASE_LABEL } from '../config'
import { SLIDES } from './Briefing'
import { summarize } from '../../shared/meeting.js'
import { useMeeting } from '../hooks/useMeeting'
import { Shell, useCountdown, useElapsed } from './Shell'
import CaseCard from './CaseCard'
import ResultsBoard from './ResultsBoard'
import Briefing from './Briefing'
import QuizCard from './QuizCard'
import { QUIZZES } from '../data/quizzes'
import { ANSWER_KEY } from '../data/answerKey'
import { QUIZ_KEY } from '../data/quizKey'
import { useVoteSeconds } from './VoteStage'

export default function StudentRoom({ identity, onLeave }) {
  const { state, status, send } = useMeeting(identity)
  const role = roles.find((item) => item.id === identity.studentId)
  const clock = useCountdown(state?.timerEndsAt)
  const discussing = !!state && (typeof state.briefing === 'number' || state.phase === 'discuss')
  const elapsed = useElapsed(discussing ? state.discussStartedAt : null)
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
  const quizzing = !opening && Number.isInteger(state.quizIndex)
  const quiz = quizzing ? QUIZZES[state.quizIndex] : null
  const item = cases[state.caseIndex] || cases[0]
  const myVote = state.votes ? state.votes[String(role.id)] || null : state.myVote || null
  const summary = state.phase === 'results' ? state.summary || summarize(state.votes || {}, roles) : null
  const votingOpen = state.phase === 'voting'

  return (
    <Shell status={status} onLeave={() => onLeave('')} leaveLabel="تغيير الرقم" stage clock={elapsed} progress={opening ? (state.briefing + 1) / SLIDES.length : quizzing ? (state.quizIndex + 1) / QUIZZES.length : (state.caseIndex + 1) / cases.length}>
      <div className={`board board-student ${opening ? 'is-opening' : ''}`}>
        <div className="board-main">
          {opening ? (
            <Briefing
              step={state.briefing}
              curtain={state.curtain}
              watch
              onStep={(step) => send({ type: 'tap', what: 'شريحة', detail: String(step + 1) })}
            />
          ) : quizzing ? (
            <>
              <QuizCard item={quiz} total={QUIZZES.length} mode="story" />
              {summary ? (
                <ResultsBoard item={quiz} summary={summary} myVote={myVote} answer={QUIZ_KEY[quiz.id]} compact />
              ) : (
                <QuizCard
                  item={quiz}
                  total={QUIZZES.length}
                  mode="choices"
                  myVote={myVote}
                  votingOpen={votingOpen}
                  onVote={votingOpen ? (choice) => send({ type: 'vote', choice }) : null}
                />
              )}
            </>
          ) : (
            <>
          <CaseCard item={item} mode="story" />
          {summary ? (
            <ResultsBoard item={item} summary={summary} myVote={myVote} answer={ANSWER_KEY[item.id]} compact />
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
                ? SLIDES[state.briefing]?.title
                : quizzing
                  ? `سؤال ${quiz.id} / ${QUIZZES.length}`
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
