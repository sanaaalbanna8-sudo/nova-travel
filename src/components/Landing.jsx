import { useState } from 'react'
import roles from '../data/roles.json'
import { BRAND_AR, BRAND_EN, LEVEL_STYLE, MEETING_AR, MEETING_EN } from '../config'
import { Mark } from './Shell'

const GROUPS = [
  ['strategic', 'المستوى الاستراتيجي', 'الأرقام 1 – 3'],
  ['management', 'المستوى الإداري', 'الأرقام 4 – 8'],
  ['operational', 'المستوى التشغيلي', 'الأرقام 9 – 17'],
]

export default function Landing({ gate = 'student', error = '', onHost, onStudent }) {
  const [step] = useState(gate === 'host' || error ? 'host' : 'student')
  const [pin, setPin] = useState('')
  const [picked, setPicked] = useState(null)

  const role = roles.find((item) => item.id === picked)

  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8">
      <div className="mb-8 flex items-center gap-3 text-gold">
        <Mark className="h-12 w-12" />
        <div>
          <p className="text-sm font-semibold text-white">
            {BRAND_AR}
            <span className="mx-1.5 font-normal text-faint">·</span>
            <span className="tracking-wide text-gold2">{BRAND_EN}</span>
          </p>
          <p className="text-xs text-mist">
            {MEETING_AR}
            <span className="mx-1.5 text-faint">·</span>
            {MEETING_EN}
          </p>
        </div>
      </div>

      {step === 'host' && (
        <form
          className="panel mx-auto mt-10 w-full max-w-md p-7"
          onSubmit={(event) => {
            event.preventDefault()
            if (pin.trim()) onHost(pin.trim())
          }}
        >
          <h2 className="font-display text-4xl text-white">مقعد الرئاسة</h2>
          <p className="mt-3 text-sm leading-7 text-mist">يُدخل المضيف رمز الجلسة للمتابعة إلى لوحة التحكم.</p>
          <label className="mt-6 block text-sm text-gold2" htmlFor="pin">
            رمز المضيف
          </label>
          <input
            id="pin"
            type="password"
            value={pin}
            autoComplete="current-password"
            onChange={(event) => setPin(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-ink px-4 py-3 text-white"
          />
          {error && <p className="mt-3 text-sm text-coral">{error}</p>}
          <button className="btn-gold mt-6 w-full" type="submit">
            دخول اللوحة
          </button>
        </form>
      )}

      {step === 'student' && !role && (
        <div className="mt-6">
          <div className="mb-6">
            <h2 className="font-display text-4xl text-white">الرقم الوظيفي</h2>
            <p className="mt-2 text-sm text-mist">يُختار الرقم الذي وُزّع في بداية الاجتماع.</p>
          </div>
          <div className="grid gap-5">
            {GROUPS.map(([level, label, range]) => (
              <section key={level} className="panel p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className={`chip ${LEVEL_STYLE[level].chip}`}>{label}</span>
                  <span className="text-xs text-faint">{range}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {roles
                    .filter((item) => item.level === level)
                    .map((item) => (
                      <button
                        key={item.id}
                        className="rounded-2xl border border-line bg-ink py-4 text-xl font-semibold text-white hover:border-gold/50"
                        onClick={() => setPicked(item.id)}
                      >
                        {item.id}
                      </button>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      {step === 'student' && role && (
        <div className="panel mx-auto mt-8 max-w-2xl p-6 sm:p-8">
          <p className={`chip ${LEVEL_STYLE[role.level].chip}`}>{role.levelLabel}</p>
          <p className="mt-4 text-sm text-faint">الرقم {role.id}</p>
          <h2 className="mt-2 font-display text-4xl leading-snug text-white">{role.title}</h2>
          <p className="mt-4 leading-8 text-mist">{role.mandate}</p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-mist">
            {role.duties.map((duty) => (
              <li key={duty} className="rounded-2xl border border-line bg-ink/60 px-4 py-3">
                {duty}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-gold" onClick={() => onStudent(role.id)}>
              تأكيد الهوية ودخول القاعة
            </button>
            <button className="btn-ghost" onClick={() => setPicked(null)}>
              رقم آخر
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
