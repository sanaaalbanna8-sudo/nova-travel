import { CHOICE_STYLE } from '../config'

const ORDER = ['strategic', 'management', 'operational']

export default function ResultsBoard({ item, summary, myVote = null }) {
  if (!summary) return null
  const { counts, total, percents, levels } = summary

  return (
    <section className="panel p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-gold">نتيجة الحالة</p>
          <h3 className="font-display text-3xl text-white">توزيع الأصوات</h3>
        </div>
        <p className="text-sm text-mist">
          صوّت <span className="font-semibold text-white">{total}</span> من 17
        </p>
      </div>

      {total === 0 ? (
        <p className="rounded-2xl border border-line bg-ink px-4 py-6 text-center text-mist">لم يُسجَّل أي صوت في هذه الحالة.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">
          <div
            className="mx-auto grid h-40 w-40 place-items-center rounded-full"
            style={{
              background: `conic-gradient(${CHOICE_STYLE.A.bar} 0 ${percents.A}%, ${CHOICE_STYLE.B.bar} ${percents.A}% ${percents.A + percents.B}%, ${CHOICE_STYLE.C.bar} ${percents.A + percents.B}% 100%)`,
            }}
          >
            <div className="grid h-24 w-24 place-items-center rounded-full bg-panel text-center">
              <span className="text-xs text-faint">الأصوات</span>
              <span className="text-2xl font-bold text-white">{total}</span>
            </div>
          </div>
          <div className="space-y-4">
            {item.options.map((option) => (
              <div key={option.key}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className={CHOICE_STYLE[option.key].text}>
                    {option.key}. {option.title}
                    {myVote === option.key ? ' · صوتك' : ''}
                  </span>
                  <span className="text-white">
                    {counts[option.key]} · {percents[option.key]}٪
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-ink">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${percents[option.key]}%`, background: CHOICE_STYLE[option.key].bar }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {ORDER.map((key) => {
          const level = levels?.[key]
          if (!level) return null
          return (
            <div key={key} className="rounded-2xl border border-line bg-ink/60 p-4">
              <p className="text-sm font-semibold text-white">{level.label}</p>
              <p className="mt-1 text-xs text-faint">
                صوّت {level.cast} من {level.seats}
              </p>
              <div className="mt-3 space-y-2">
                {['A', 'B', 'C'].map((choice) => (
                  <div key={choice} className="flex items-center gap-2 text-xs text-mist">
                    <span className="w-4">{choice}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-panel2">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${level.seats ? (level[choice] / level.seats) * 100 : 0}%`,
                          background: CHOICE_STYLE[choice].bar,
                        }}
                      />
                    </div>
                    <span className="w-4 text-left">{level[choice]}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
