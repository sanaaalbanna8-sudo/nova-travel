import roles from '../data/roles.json'
import { CHOICE_STYLE, LEVEL_STYLE } from '../config'
import RoleMark from './RoleMark'

export default function CaseCard({ item, mode = 'full', myVote = null, votingOpen = false, onVote = null }) {
  const level = LEVEL_STYLE[item.level] || LEVEL_STYLE.cross
  const code = `NT-${String(item.id).padStart(2, '0')}`
  const showStory = mode !== 'choices'
  const showChoices = mode !== 'story'
  const hostCase = item.addressedTo === 'host'
  const seat = roles.find((role) => role.id === Number(item.addressedTo))
  const concern = hostCase ? '' : `يا ${seat?.nameAr}، هالمشكلة إلك.`

  return (
    <>
      {showStory && (
        <section className="case-story" key={`story-${item.id}`}>
          <div className="case-kicker">
            <span className="chip border-gold/40 bg-[#fff8ea] text-gold2">{code}</span>
            <span className={`chip ${level.chip}`}>{item.levelLabel}</span>
            <span className="text-xs font-bold text-faint">{item.minutes} د نقاش</span>
          </div>
          <div className="case-speak">
            <RoleMark who={item.roleKey || item.addressedTo} name={item.addressedLabel} title={item.addressedTitle} host={hostCase} />
            <div>
              <h2>{item.title}</h2>
              {concern && <p className="case-job">{concern}</p>}
            </div>
          </div>
          {item.paragraphs.map((paragraph) => (
            <p key={paragraph} className="case-lead">
              {paragraph}
            </p>
          ))}
          <p className="case-ask">{item.ask}</p>
          <p className="case-personal">{item.personalAsk}</p>
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
