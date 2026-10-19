import roles from '../data/roles.json'
import { BRANCHES, managerName, roleById, WORKFLOW } from '../data/org.js'
import { HOST_NAME, LEVEL_STYLE } from '../config'

export const SLIDES = [
  { id: 'org', kicker: 'قبل الحالات', title: 'الهيكل التنظيمي' },
  { id: 'pyramid', kicker: 'قبل الحالات', title: 'الهرم التنظيمي' },
  { id: 'flow', kicker: 'قبل الحالات', title: 'مسار الشغل' },
  { id: 'infer', kicker: 'قبل الحالات', title: 'أسئلة الاستنتاج' },
  { id: 'policy', kicker: 'معرفة سابقة · الهدف ج', title: 'السياسات والتهديدات' },
]

const BANDS = [
  ['strategic', 'الاستراتيجي'],
  ['management', 'الإداري'],
  ['operational', 'التشغيلي'],
]

function OrgCard({ role, boss }) {
  return (
    <article className={`org-card lv-${role.level}`}>
      <strong>{role.nameAr}</strong>
      <b>{role.name}</b>
      <span>{role.title}</span>
      {boss && <em>مديرتها: {boss}</em>}
    </article>
  )
}

export default function Briefing({ step = 0, onStep }) {
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
              <OrgCard role={ghazal} boss={HOST_NAME} />
            </div>
            <div className="org-branches">
              {BRANCHES.map((branch) => {
                const lead = roleById(branch.lead)
                return (
                  <div key={branch.lead} className={`org-branch ${branch.team.length > 2 ? 'is-wide' : ''}`}>
                    <OrgCard role={lead} boss={managerName(lead.id)} />
                    {branch.team.length > 0 && (
                      <div className="org-kids">
                        {branch.team.map((id) => {
                          const role = roleById(id)
                          return <OrgCard key={id} role={role} boss={managerName(id)} />
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <p>غزل هي المدير التنفيذي، وفوق إيمان وروز. تحت كل اسم مكتوب: مديرتها.</p>
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

      {step === 2 && (
        <div className="brief-org">
          <p>من أول معلومة لين القرار. كل بنت إلها فعل واحد، على نفس نهج مسار البيانات.</p>
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

      {step === 3 && (
        <ol className="infer-list">
          <li>
            <b>مين مديرك المباشر؟</b>
            <span>انظري لصندوقك في الهيكل التنظيمي. تحت اسمك مكتوب: مديرتها.</span>
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

      {step === 4 && (
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
