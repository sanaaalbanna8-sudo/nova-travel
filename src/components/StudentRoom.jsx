import { useEffect } from 'react'
import cases from '../data/cases.json'
import roles from '../data/roles.json'
import { BRAND_EN, LEVEL_STYLE, MEETING_AR, MEETING_EN, PHASE_LABEL } from '../config'
import { summarize } from '../../shared/meeting.js'
import { useMeeting } from '../hooks/useMeeting'
import { Shell, useCountdown } from './Shell'
import CaseCard from './CaseCard'
import ResultsBoard from './ResultsBoard'
import { useVoteSeconds } from './VoteStage'

export default function StudentRoom({ identity, onLeave }) {
  const { state, status, send } = useMeeting(identity)
  const role = roles.find((item) => item.id === identity.studentId)
  const clock = useCountdown(state?.timerEndsAt)
  const secondsLeft = useVoteSeconds(state?.voteEndsAt, state?.phase === 'voting')

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
          <h1 className="font-display text-4xl text-white">هذا الرقم مفتوح على جهاز آخر</h1>
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

  const item = cases[state.caseIndex] || cases[0]
  const myVote = state.votes ? state.votes[String(role.id)] || null : state.myVote || null
  const summary = state.phase === 'results' ? state.summary || summarize(state.votes || {}, roles) : null
  const votingOpen = state.phase === 'voting'

  return (
    <Shell status={status} onLeave={() => onLeave('')} leaveLabel="تغيير الرقم">
      {status === 'local' && (
        <p className="mb-4 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-7 text-gold2">
          هذه تجربة على الجهاز نفسه. أجهزة الطلاب تتصل حين يعمل خادم الاجتماع.
        </p>
      )}

      <section className="panel mb-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className={`chip ${LEVEL_STYLE[role.level].chip}`}>{role.levelLabel}</span>
            <h1 className="mt-3 font-display text-3xl text-white sm:text-4xl">{role.title}</h1>
            <p className="mt-2 text-sm text-faint">الرقم الوظيفي {role.id}</p>
          </div>
          <div className="text-start">
            <p className="text-xs text-faint">الحالة {String(item.id).padStart(2, '0')} / {cases.length}</p>
            {clock && (
              <p className={`mt-2 text-sm ${clock.done ? 'text-coral' : 'text-sea'}`}>
                {clock.done ? 'انتهى وقت النقاش' : `وقت النقاش ${clock.label}`}
              </p>
            )}
          </div>
        </div>
        <p className="mt-4 leading-8 text-mist">{role.mandate}</p>
      </section>

      <div
        className={`sticky top-[69px] z-20 mb-5 rounded-2xl border px-4 py-3 text-sm ${
          votingOpen ? 'border-gold/40 bg-ink/95 text-gold2' : 'border-line bg-ink/95 text-mist'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <p>
            {PHASE_LABEL[state.phase]}
            {votingOpen ? ' — يمكن تعديل الصوت قبل انتهاء الثواني.' : ' — الخيارات معروضة للنقاش، والأزرار تنتظر فتح الباب.'}
          </p>
          {secondsLeft !== null && (
            <div className={`vote-student-clock ${secondsLeft <= 3 ? 'is-urgent' : ''}`}>
              <strong key={secondsLeft}>{secondsLeft}</strong>
              <span>ثانية</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <CaseCard
          item={item}
          myVote={myVote}
          votingOpen={votingOpen}
          onVote={votingOpen ? (choice) => send({ type: 'vote', choice }) : null}
        />
        {summary && <ResultsBoard item={item} summary={summary} myVote={myVote} />}
      </div>
    </Shell>
  )
}
