import { useState } from 'react'
import roles from '../data/roles.json'
import { BRANCHES, REASONS, managerKey, managerName, roleById, WORKFLOW } from '../data/org.js'
import { HOST_NAME, LEVEL_STYLE } from '../config'

export const SLIDES = [
  { id: 'company', kicker: 'قبل الحالات', title: 'الشركة' },
  { id: 'pyramid', kicker: 'قبل الحالات', title: 'الهرم التنظيمي' },
  { id: 'guess', kicker: 'قبل الحالات', title: 'كشف الستار' },
  { id: 'org', kicker: 'قبل الحالات', title: 'الهيكل التنظيمي' },
  { id: 'flow', kicker: 'قبل الحالات', title: 'مسار الشغل' },
  { id: 'infer', kicker: 'قبل الحالات', title: 'أسئلة الاستنتاج' },
  { id: 'policy', kicker: 'معرفة سابقة · الهدف ج', title: 'السياسات والتهديدات' },
]

const BANDS = [
  ['strategic', 'الاستراتيجي'],
  ['management', 'الإداري'],
  ['operational', 'التشغيلي'],
]

function OrgCard({ role }) {
  return (
    <article className={`org-card lv-${role.level}`}>
      <strong>{role.nameAr}</strong>
      <b>{role.name}</b>
      <span>{role.title}</span>
    </article>
  )
}

function taskOf(id) {
  return WORKFLOW.find((item) => item.id === id)?.verb || ''
}

function CurtainGame({ seat, onCurtain }) {
  const [who, setWho] = useState(seat?.id || null)
  const [guess, setGuess] = useState(null)
  const [open, setOpen] = useState(false)
  const player = who ? roleById(who) : null
  const answer = player ? managerKey(player.id) : null
  const options = [
    { key: 'host', nameAr: HOST_NAME, task: 'تثبت قرار الإدارة العليا' },
    ...roles
      .filter((role) => role.id !== who)
      .map((role) => ({ key: String(role.id), nameAr: role.nameAr, task: taskOf(role.id) })),
  ]
  const right = open && guess === answer

  const chooseGirl = (id) => {
    setWho(id)
    setGuess(null)
    setOpen(false)
  }

  const pick = (key) => {
    if (!player || open) return
    setGuess(key)
    setOpen(true)
    onCurtain?.(player.id, key)
  }

  return (
    <div className="guess-game">
      {!seat && (
        <div className="guess-cast">
          {roles.map((role) => (
            <button key={role.id} type="button" className={who === role.id ? 'is-on' : ''} onClick={() => chooseGirl(role.id)}>
              {role.nameAr}
            </button>
          ))}
        </div>
      )}
      <p className="guess-ask">{player ? `يا ${player.nameAr}، مين مديرتك المباشرة؟` : 'اختاري بنت، وخليها تحزر مين مديرتها.'}</p>
      <div className={`curtain ${open ? 'is-open' : ''}`}>
        <div className="curtain-reveal">
          {open && player && (
            <>
              <p className={right ? 'is-right' : 'is-wrong'}>{right ? 'صح' : 'مو هيك'}</p>
              <strong>مديرتها {managerName(player.id)}</strong>
              <span>{REASONS[player.id]}</span>
            </>
          )}
        </div>
        <i className="curtain-half is-start" />
        <i className="curtain-half is-end" />
        {!open && <p className="curtain-wait">اختاري من كل البنات، وبعدين بينكشف الجواب.</p>}
      </div>
      <div className="guess-options">
        {options.map((item) => (
          <button
            key={item.key}
            type="button"
            className={guess === item.key ? 'is-on' : ''}
            disabled={!player || open}
            onClick={() => pick(item.key)}
          >
            <strong>{item.nameAr}</strong>
            <b>{item.task}</b>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Briefing({ step = 0, onStep, seat = null, onCurtain = null }) {
  const slide = SLIDES[step] || SLIDES[0]
  const ghazal = roleById(4)

  return (
    <section className="briefing">
      <nav className="slide-tabs">
        {SLIDES.map((item, index) => (
          <button key={item.id} type="button" className={index === step ? 'is-on' : ''} onClick={() => onStep?.(index)}>
            <b>{index + 1}</b>
            {item.title}
          </button>
        ))}
      </nav>
      <p className="case-label">{slide.kicker}</p>
      <h2>{slide.title}</h2>

      {step === 0 && (
        <div className="company-intro">
          <p>نوفا ترافل شركة حجوزات وسياحة وفنادق. بترتب الرحلات، والغرف، والأسعار، وبيانات الضيوف.</p>
          <div className="company-facts">
            <article>
              <small>القطاع</small>
              <strong>السياحة والسفر والضيافة</strong>
            </article>
            <article>
              <small>الموظفات</small>
              <strong>17 موظفة، ومديرة تنفيذية عامة</strong>
            </article>
            <article>
              <small>المستويات</small>
              <strong>استراتيجي، إداري، وتشغيلي</strong>
            </article>
          </div>
          <article className="company-jobs">
            <small>الوظائف</small>
            <ul>
              <li>قرار الشركة، والتخطيط، ومراقبة السوق السياحي</li>
              <li>السياسات، والقوانين، والمناطق الزمنية</li>
              <li>خدمة الضيف، والمجتمعات الرقمية</li>
              <li>الشؤون الإدارية، وتقييم مخاطر تسريب البيانات</li>
              <li>جمع بيانات المسافر، وفحصها، وتنظيفها، وحفظها، وحسابها</li>
              <li>المخزون السياحي، والحجز في وقته</li>
              <li>التحليل المالي، والتدفق النقدي</li>
              <li>أمن الأنظمة، وحلول التكنولوجيا، ولوحات المسافرين</li>
            </ul>
          </article>
          <p>هاي الجلسة اجتماع طارئ. في مشاكل مفتوحة اليوم، والقاعة لازم تحسمها قبل ما تكبر.</p>
        </div>
      )}

      {step === 3 && (
        <div className="brief-org">
          <div className="org-chart">
            <div className="org-tier">
              <article className="org-card is-host">
                <small>الإدارة العليا</small>
                <strong>{HOST_NAME}</strong>
                <b>Sanaa Albanna</b>
                <span>المدير التنفيذي العام</span>
              </article>
            </div>
            <div className="org-tier">
              <OrgCard role={ghazal} />
            </div>
            <div className="org-branches">
              {BRANCHES.map((branch) => {
                const lead = roleById(branch.lead)
                return (
                  <div key={branch.lead} className={`org-branch ${branch.team.length > 2 ? 'is-wide' : ''}`}>
                    <OrgCard role={lead} />
                    {branch.team.length > 0 && (
                      <div className="org-kids">
                        {branch.team.map((id) => (
                          <OrgCard key={id} role={roleById(id)} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {step === 2 && <CurtainGame seat={seat} onCurtain={onCurtain} />}

      {step === 1 && (
        <div className="pyramid">
          <div className="pyr-row is-apex">
            <article className="pyr-card is-host">
              <small>الإدارة العليا</small>
              <strong>{HOST_NAME}</strong>
              <b>Sanaa Albanna</b>
              <span>المدير التنفيذي العام</span>
            </article>
          </div>
          <div className="pyr-row is-ceo">
            <article className="pyr-card lv-strategic">
              <strong>{ghazal.nameAr}</strong>
              <b>{ghazal.name}</b>
              <span>{ghazal.title}</span>
            </article>
          </div>
          {BANDS.map(([level, label], index) => (
            <div key={level} className={`pyr-row is-${index + 2} lv-${level}`}>
              <p>{label}</p>
              <div>
                {roles
                  .filter((role) => role.level === level && role.id !== 4)
                  .map((role) => (
                    <article key={role.id} className="pyr-card">
                      <strong>{role.nameAr}</strong>
                      <b>{role.name}</b>
                      <span>{role.title}</span>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="brief-org">
          <ol className="life-flow">
            {WORKFLOW.map((item, index) => {
              const role = roleById(item.id)
              return (
                <li key={role.id}>
                  <i>{index + 1}</i>
                  <b>{item.verb}</b>
                  <span>{role.nameAr}</span>
                </li>
              )
            })}
          </ol>
        </div>
      )}

      {step === 5 && (
        <ol className="infer-list">
          <li>
            <b>مين مديرك المباشر؟</b>
            <span>من شريحة كشف الستار. إذا الستار لسه مسكّر، احزري من مكانك في الهيكل.</span>
          </li>
          <li>
            <b>لو الشركة حقيقية، شو أول مهمة لك هذا الأسبوع؟</b>
            <span>مهمة واحدة تقدرين تكمّلينها، مش عنوان الوظيفة.</span>
          </li>
          <li>
            <b>أي بيانات توصلك، ومن وين؟</b>
            <span>من ضيف، من بنت ثانية، من تقرير قديم، ولا من شاشة؟</span>
          </li>
          <li>
            <b>أي بيانات تطلعينها، ومين يستناها؟</b>
            <span>إذا شغلك وقف يوم، أي قرار في الشركة يتأخر؟</span>
          </li>
        </ol>
      )}

      {step === 6 && (
        <div className="brief-org">
          <p>من معرفتكم السابقة، قبل الحالات. الهدف ج: السياسة، والقانون، والأخلاق، وأمن المعلومة، والتهديد وكيف نخففه.</p>
          <ol className="infer-list">
            <li>
              <b>أي تهديد ممكن يضرب نظام الشركة اليوم؟</b>
              <span>جواز على مجموعة، حساب موظف سابق، أو أداة رخيصة تطلب صور الجوازات. إذا ما خففناه، شو بيصير بالشركة وبالضيف؟</span>
            </li>
            <li>
              <b>شو يعني نجمع بيانات الضيف بطريقة قانونية؟</b>
              <span>أي بيان نقدر نطلبه، ولأي غرض، ومين يحق له يشوفه؟</span>
            </li>
            <li>
              <b>وين يفرق الأخلاقي عن القانوني؟</b>
              <span>نشر صورة المسافر ممكن يكون قانونياً ممنوعاً، وممكن يكون أخلاقياً غلط حتى لو القانون سكت.</span>
            </li>
            <li>
              <b>إذا كتبنا سياسة للشركة، شو لازم يكون فيها؟</b>
              <span>التهديد، والإجراء اللي بيخففه، ومين ينفذه، وكيف يأثر على الشركة وعلى الضيف.</span>
            </li>
          </ol>
        </div>
      )}

      <p className="brief-step">
        {step + 1} / {SLIDES.length}
        <span className={`chip ${LEVEL_STYLE.strategic.chip}`}>ثم تبدأ الحالات</span>
      </p>
    </section>
  )
}
