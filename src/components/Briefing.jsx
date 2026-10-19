import roles from '../data/roles.json'
import { HOST_NAME, LEVEL_STYLE } from '../config'

const SLIDES = [
  { id: 'org', kicker: 'قبل الحالات', title: 'الهيكل التنظيمي' },
  { id: 'pyramid', kicker: 'قبل الحالات', title: 'الهرم التنظيمي' },
  { id: 'infer', kicker: 'قبل الحالات', title: 'أسئلة الاستنتاج' },
  { id: 'policy', kicker: 'معرفة سابقة · الهدف ج', title: 'السياسات والتهديدات' },
]

const FLOW = [
  ['فرح النتشة', 'تجمع'],
  ['ريتال الحيت', 'تفحص'],
  ['سما إكبارية', 'تنظّف'],
  ['جنى دروزة', 'تسجّل'],
  ['سلمى الحموز', 'تحفظ'],
  ['جود العساف', 'تحسب'],
  ['كندة بطاح', 'تعرض'],
  ['غزل أبو الرب', 'تقرر'],
]

function SeatBox({ role, level }) {
  return (
    <article className={`org-card lv-${level || role.level}`}>
      <strong>{role.nameAr}</strong>
      <b>{role.name}</b>
      <span>{role.title}</span>
    </article>
  )
}

export default function Briefing({ step = 0, onStep }) {
  const slide = SLIDES[step] || SLIDES[0]
  const bands = [
    ['strategic', 'الاستراتيجي'],
    ['management', 'الإداري'],
    ['operational', 'التشغيلي'],
  ]

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
            {bands.map(([level, label]) => (
              <div key={level} className={`org-tier lv-${level}`}>
                <p className="org-level">{label}</p>
                <div className="org-line">
                  {roles
                    .filter((role) => role.level === level)
                    .map((role) => (
                      <SeatBox key={role.id} role={role} level={level} />
                    ))}
                </div>
              </div>
            ))}
          </div>
          <ol className="life-flow">
            {FLOW.map(([name, verb]) => (
              <li key={name}>
                <b>{verb}</b>
                <span>{name}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

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
          {bands.map(([level, label], index) => (
            <div key={level} className={`pyr-row is-${index + 2} lv-${level}`}>
              <p>{label}</p>
              <div>
                {roles
                  .filter((role) => role.level === level)
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

      {step === 2 && (
        <ol className="infer-list">
          <li>
            <b>مين مديرك المباشر؟</b>
            <span>انظري لمكانك في الهرم، وسمّي الشخص الذي تسلّمينه شغلك.</span>
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

      {step === 3 && (
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
