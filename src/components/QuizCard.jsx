import { CHOICE_STYLE } from '../config'

export default function QuizCard({ item, total, mode = 'story', myVote = null, votingOpen = false, onVote = null }) {
  if (mode === 'story') {
    return (
      <section className="case-story" key={`quiz-story-${item.id}`}>
        <div className="case-kicker">
          <span className="chip border-gold/40 bg-[#fff8ea] text-gold2">أسئلة سريعة</span>
          <span className="chip border-sea/30 bg-sea/10 text-sea">الهدف ب</span>
          <span className="text-xs font-bold text-faint">
            {item.id} / {total}
          </span>
        </div>
        <h2>{item.scene}</h2>
        <p className="case-personal">{item.question}</p>
      </section>
    )
  }

  return (
    <section className="case-choices" key={`quiz-choices-${item.id}`}>
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
              {option.role && <em>{option.role}</em>}
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
  )
}
