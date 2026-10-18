import { CHOICE_STYLE, LEVEL_STYLE } from '../config'

export default function CaseCard({ item, myVote = null, votingOpen = false, onVote = null }) {
  const level = LEVEL_STYLE[item.level] || LEVEL_STYLE.cross
  const code = `NT-${String(item.id).padStart(2, '0')}`

  return (
    <article className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold text-gold">{code}</span>
          <span className={`chip ${level.chip}`}>{item.levelLabel}</span>
        </div>
        <span className="text-xs text-faint">نقاش مقترح: {item.minutes} دقائق</span>
      </div>

      <div className="space-y-5 px-5 py-6 sm:px-7">
        <h2 className="font-display text-3xl leading-snug text-white sm:text-4xl">{item.title}</h2>
        <div className="flex flex-wrap gap-2">
          {item.topics.map((topic) => (
            <span key={topic} className="chip border-line bg-ink text-mist">
              {topic}
            </span>
          ))}
        </div>
        {item.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-base leading-8 text-mist">
            {paragraph}
          </p>
        ))}
        <div className="grid gap-3 sm:grid-cols-2">
          {item.facts.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-line bg-ink/70 px-4 py-3">
              <p className="text-xs text-faint">{fact.label}</p>
              <p className="mt-1 text-lg font-semibold text-gold2">{fact.value}</p>
            </div>
          ))}
        </div>
        <blockquote className="rounded-2xl border border-gold/30 bg-gold/5 px-4 py-4 text-sm leading-7 text-gold2">
          {item.ask}
        </blockquote>
        <h3 className="text-xl font-semibold text-white">{item.question}</h3>
        <div className="grid gap-3">
          {item.options.map((option) => {
            const style = CHOICE_STYLE[option.key]
            const selected = myVote === option.key
            const className = `w-full rounded-2xl border p-4 text-right transition ${
              selected ? style.ring : 'border-line bg-ink/50'
            } ${onVote ? 'hover:border-gold/50' : ''}`
            const body = (
              <>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className={`text-sm font-bold ${style.text}`}>الخيار {option.key}</span>
                  {selected && <span className="text-xs text-white">الصوت المسجّل</span>}
                </div>
                <p className="font-semibold text-white">{option.title}</p>
                <p className="mt-1 text-sm leading-7 text-mist">{option.text}</p>
              </>
            )
            if (!onVote) {
              return (
                <div key={option.key} className={className}>
                  {body}
                </div>
              )
            }
            return (
              <button key={option.key} className={className} disabled={!votingOpen} onClick={() => onVote(option.key)}>
                {body}
              </button>
            )
          })}
        </div>
      </div>
    </article>
  )
}
