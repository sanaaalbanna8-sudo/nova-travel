import { CHOICE_STYLE } from '../config'

const ORDER = ['strategic', 'management', 'operational']

export default function ResultsBoard({ item, summary, myVote = null, compact = false }) {
  if (!summary) return null
  const { counts, total, percents, levels } = summary

  return (
    <section className={`case-choices ${compact ? 'overflow-auto' : 'panel p-5 sm:p-7'}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold text-gold2">نتيجة الحالة</p>
          <h3 className="font-display text-2xl text-ink">توزيع الأصوات</h3>
        </div>
        <p className="text-sm text-mist">
          صوّت <span className="font-extrabold text-ink">{total}</span> من 17
        </p>
      </div>

      {total === 0 ? (
        <p className="rounded-2xl border border-line bg-panel2 px-4 py-6 text-center text-mist">لم يُسجَّل أي صوت في هذه الحالة.</p>
      ) : (
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[140px_minmax(0,1fr)] lg:items-center">
          <div
            className="mx-auto grid h-32 w-32 place-items-center rounded-full"
            style={{
              background: `conic-gradient(${CHOICE_STYLE.A.bar} 0 ${percents.A}%, ${CHOICE_STYLE.B.bar} ${percents.A}% ${percents.A + percents.B}%, ${CHOICE_STYLE.C.bar} ${percents.A + percents.B}% 100%)`,
            }}
          >
            <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center">
              <span className="text-xs text-faint">الأصوات</span>
              <span className="text-2xl font-extrabold text-ink">{total}</span>
            </div>
          </div>
          <div className="space-y-3">
            {item.options.map((option) => (
              <div key={option.key}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className={`font-bold ${CHOICE_STYLE[option.key].text}`}>
                    {option.key}. {option.title}
                    {myVote === option.key ? ' · صوتك' : ''}
                  </span>
                  <span className="font-extrabold text-ink">
                    {counts[option.key]} · {percents[option.key]}٪
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-panel2">
                  <div className="h-full rounded-full" style={{ width: `${percents[option.key]}%`, background: CHOICE_STYLE[option.key].bar }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!compact && (
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {ORDER.map((key) => {
            const level = levels?.[key]
            if (!level) return null
            return (
              <div key={key} className="rounded-2xl border border-line bg-panel2 p-4">
                <p className="text-sm font-extrabold text-ink">{level.label}</p>
                <p className="mt-1 text-xs text-faint">
                  صوّت {level.cast} من {level.seats}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
