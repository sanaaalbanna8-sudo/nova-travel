import { CHOICE_STYLE, LEVEL_STYLE } from '../config'

export default function CaseCard({ item, mode = 'full', myVote = null, votingOpen = false, onVote = null }) {
  const level = LEVEL_STYLE[item.level] || LEVEL_STYLE.cross
  const code = `NT-${String(item.id).padStart(2, '0')}`
  const showStory = mode !== 'choices'
  const showChoices = mode !== 'story'

  return (
    <>
      {showStory && (
        <section className="case-story" key={`story-${item.id}`}>
          <div className="case-kicker">
            <span className="chip border-gold/40 bg-[#fff8ea] text-gold2">{code}</span>
            <span className={`chip ${level.chip}`}>{item.levelLabel}</span>
            <span className="text-xs font-bold text-faint">{item.minutes} د نقاش</span>
          </div>
          <h2>{item.title}</h2>
          {item.paragraphs.map((paragraph) => (
            <p key={paragraph} className="case-lead">
              {paragraph}
            </p>
          ))}
          <div className="fact-row">
            {item.facts.map((fact) => (
              <div key={fact.label} className="fact-card">
                <small>{fact.label}</small>
                <b>{fact.value}</b>
              </div>
            ))}
          </div>
          <p className="case-ask">{item.ask}</p>
        </section>
      )}
      {showChoices && (
        <section className="case-choices" key={`choices-${item.id}`}>
          <h3>{item.question}</h3>
          <div className="choice-grid">
            {item.options.map((option) => {
              const style = CHOICE_STYLE[option.key]
              const selected = myVote === option.key
              const className = `choice-card ${selected ? style.ring : ''}`
              const body = (
                <>
                  <span className={`text-sm font-black ${style.text}`}>
                    {option.key}
                    {selected ? ' · صوتك' : ''}
                  </span>
                  <strong>{option.title}</strong>
                  <p>{option.text}</p>
                </>
              )
              if (!onVote) {
                return (
                  <div key={option.key} className={className} style={{ '--tone': style.bar }}>
                    {body}
                  </div>
                )
              }
              return (
                <button key={option.key} className={className} style={{ '--tone': style.bar }} disabled={!votingOpen} onClick={() => onVote(option.key)}>
                  {body}
                </button>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
