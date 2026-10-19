import cases from '../data/cases.json'
import roles from '../data/roles.json'
import { ANSWER_KEY } from '../data/answerKey'

function rowsFor(ledger) {
  return roles.map((role) => {
    const votes = (ledger || []).filter((item) => item.kind !== 'arrive' && String(item.studentId) === String(role.id))
    const correct = votes.filter((item) => ANSWER_KEY[item.caseId]?.best === item.choice)
    const avgMs = votes.length ? votes.reduce((sum, item) => sum + item.ms, 0) / votes.length : null
    return { role, votes, correct, avgMs }
  })
}

function seconds(ms) {
  if (ms == null) return '—'
  return `${(ms / 1000).toFixed(1)} ث`
}

function Rank({ title, people, detail }) {
  return (
    <section className="rounded-2xl border border-line bg-paper p-4">
      <h3 className="mb-3 text-lg font-extrabold text-ink">{title}</h3>
      <ol className="space-y-2">
        {people.length === 0 && <li className="text-sm text-mist">ما في أصوات بعد.</li>}
        {people.map((item, index) => (
          <li key={item.role.id} className="rounded-xl bg-white px-3 py-2">
            <p className="font-extrabold text-ink">
              {index + 1}. {item.role.nameAr}
              <span className="mr-2 text-xs font-bold text-faint">{item.role.name}</span>
            </p>
            <p className="text-sm text-mist">{detail(item)}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function Insights({ ledger = [], live = false }) {
  const rows = rowsFor(ledger).filter((item) => item.votes.length)
  const sharp = [...rows].sort((a, b) => b.correct.length - a.correct.length || a.avgMs - b.avgMs).slice(0, 10)
  const fast = [...rows].sort((a, b) => a.avgMs - b.avgMs).slice(0, 10)
  const active = [...rows].sort((a, b) => b.votes.length - a.votes.length || a.avgMs - b.avgMs).slice(0, 10)

  return (
    <div className="space-y-4">
      {!live && (
        <p className="rounded-2xl bg-[#fff8ea] px-4 py-3 text-sm font-bold leading-7 text-ink">
          هذه اللوحة تحفظ أصوات الجهاز الذي فتحتِه. إذا كل بنت على رابط GitHub منفصل، صوتها يبقى عندها وما يجتمع هنا.
        </p>
      )}
      <Rank
        title="الأصح قراراً"
        people={sharp}
        detail={(item) => {
          const reasons = item.correct
            .slice(0, 3)
            .map((vote) => {
              const story = cases.find((entry) => entry.id === vote.caseId)
              return `${story?.title}: ${ANSWER_KEY[vote.caseId]?.why || ''}`
            })
            .join(' ')
          return `${item.correct.length} من ${item.votes.length} قرارات أقرب للدرس. ${reasons}`
        }}
      />
      <Rank title="الأسرع" people={fast} detail={(item) => `متوسط وصول الصوت ${seconds(item.avgMs)} من لحظة فتح التصويت.`} />
      <Rank title="الأكثر تفاعلاً" people={active} detail={(item) => `صوّتت في ${item.votes.length} حالات.`} />
    </div>
  )
}
