import roles from '../data/roles.json'
import { LEVEL_STYLE } from '../config'

const SLIDES = [
  { id: 'org', kicker: 'قبل الأسئلة', title: 'هل تقف الشركة على هذه الوظائف؟' },
  { id: 'pyramid', kicker: 'الهرم', title: 'كل بنت وين مكانها' },
  { id: 'infer', kicker: 'قبل أن نفتح الحالات', title: 'أجيبي من مقعدك' },
]

const FLOW = [
  ['فرح نتشة', 'تجمع'],
  ['ريتال الهيت', 'تفحص'],
  ['سما إكبارية', 'تنظّف'],
  ['جنى دروزة', 'تسجّل'],
  ['سلمى الحموز', 'تحفظ'],
  ['جود العساف', 'تحسب'],
  ['كندة بطاح', 'تعرض'],
  ['غزل أبو الرب', 'تقرر'],
]

export default function Briefing({ step = 0 }) {
  const slide = SLIDES[step] || SLIDES[0]
  const bands = [
    ['strategic', 'الاستراتيجي'],
    ['management', 'الإداري'],
    ['operational', 'التشغيلي'],
  ]

  return (
    <section className="briefing">
      <p className="case-label">{slide.kicker}</p>
      <h2>{slide.title}</h2>

      {step === 0 && (
        <div className="brief-org">
          <p>
            سناء البنا هي المديرة التنفيذية العامة. تحتها سبع عشرة وظيفة، وكل وظيفة عليها بنت. المقعد 3 كان فاضي، ووظيفته ما أخذتها بنت: مهندسة الواجهات الأمامية ولوحات معلومات المسافرين. كندة بطاح سكّرت هذا المقعد. من غيرها البيانات تنجمع وتنحفظ، والمسافر والاستقبال والمدير يشوفون شاشة واحدة ما بتسعفهم.
          </p>
          <p>
            الشركة بهالتشكيل تقدر تشتغل. في من يجمع، ومن يفحص، ومن ينظّف، ومن يسجّل التغيير، ومن يحفظ، ومن يحسب، ومن يعرض، ومن يقرر، ومن يواجه الضيف، ومن يحمي المصاري والناس والقانون.
          </p>
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
          <article className="pyr-card is-host">
            <small>الإدارة العليا</small>
            <strong>Sanaa Albanna</strong>
            <span>المدير التنفيذي العام</span>
          </article>
          {bands.map(([level, label]) => (
            <div key={level} className={`pyr-band lv-${level}`}>
              <p>{label}</p>
              <div>
                {roles
                  .filter((role) => role.level === level)
                  .map((role) => (
                    <article key={role.id} className="pyr-card">
                      <small>{role.id}</small>
                      <strong>{role.name}</strong>
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
            <span>انظري للهرم. غزل ترفع لسناء. روز وإيمان ترفعان لغزل. مديرات الوسط يرفعن لغزل. من في التشغيل: لمن ترفعين شغلك اليوم؟</span>
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

      <p className="brief-step">
        {step + 1} / {SLIDES.length}
        <span className={`chip ${LEVEL_STYLE.strategic.chip}`}>ثم تبدأ الحالات</span>
      </p>
    </section>
  )
}
