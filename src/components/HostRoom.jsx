import { useEffect, useMemo, useState } from 'react'
import cases from '../data/cases.json'
import roles from '../data/roles.json'
import { GLOSSARY } from '../data/glossary'
import { HOST_NAME, MEETING_AR, MEETING_EN, PHASE_LABEL } from '../config'
import { useMeeting } from '../hooks/useMeeting'
import { seatHref } from '../paths'
import { Modal, Shell, useCountdown } from './Shell'
import { armVoteSound, playVoteOpen } from '../lib/voteSound'
import CaseCard from './CaseCard'
import Roster from './Roster'
import VoteStage from './VoteStage'

export default function HostRoom({ identity, onLeave }) {
  const meeting = useMeeting(identity)
  const { state, status, send, onlineIds } = meeting
  const [present, setPresent] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [modal, setModal] = useState(null)
  const [topic, setTopic] = useState('الكل')
  const [pending, setPending] = useState(null)
  const [info, setInfo] = useState(null)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    if (status === 'denied') onLeave('رمز المضيف غير صحيح')
  }, [status, onLeave])

  useEffect(() => {
    document.title = `لوحة الرئاسة | ${MEETING_EN}`
    const base = import.meta.env.VITE_SYNC_HTTP || ''
    fetch(`${base}/api/info`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setInfo(data))
      .catch(() => setInfo(null))
    return () => {
      document.title = `${MEETING_AR} | ${MEETING_EN}`
    }
  }, [])

  useEffect(() => {
    if (status !== 'local' || state?.phase !== 'voting' || !state.voteEndsAt) return undefined
    const wait = Math.max(0, state.voteEndsAt - Date.now() + 120)
    const id = setTimeout(() => send({ type: 'close' }), wait)
    return () => clearTimeout(id)
  }, [status, state?.phase, state?.voteEndsAt, send])

  const clock = useCountdown(state?.timerEndsAt)
  const item = state ? cases[state.caseIndex] : null
  const voteCount = Object.keys(state?.votes || {}).length
  const topics = useMemo(() => ['الكل', ...new Set(cases.flatMap((entry) => entry.topics))], [])

  if (status === 'denied') return null
  if (!state || !item) {
    return (
      <Shell status={status} onLeave={() => onLeave('')}>
        <p className="panel p-8 text-center text-mist">جارٍ فتح قاعة الاجتماع…</p>
      </Shell>
    )
  }

  const askMove = (action) => {
    const dirty = state.phase !== 'discuss' || voteCount > 0
    if (!dirty) {
      send(action)
      setModal(null)
      return
    }
    setPending(action)
  }

  const shareUrls = (info?.urls || [window.location.origin]).filter((url) => !url.includes('localhost'))
  const origins = shareUrls.length ? shareUrls : [window.location.origin]
  const hostLinks = origins.map((url) => seatHref(url, 'host'))
  const studentLinks = origins.map((url) => seatHref(url, 'join'))

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
    } catch {
      setCopied('')
    }
  }

  return (
    <Shell status={status} onLeave={() => onLeave('')} leaveLabel="إغلاق اللوحة">
      {status === 'local' && (
        <p className="mb-4 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-7 text-gold2">
          الخادم غير متصل. التصويت يتزامن بين تبويبات هذا الجهاز فقط. للحصّة على أجهزة الطلاب شغّلي التطبيق ثم حدّثي الصفحة.
        </p>
      )}

      <section className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gold">المضيفة: {HOST_NAME}</p>
          <h1 className="font-display text-4xl text-white">لوحة الرئاسة</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="chip border-line bg-ink text-white">
            الحالة {String(item.id).padStart(2, '0')} / {cases.length}
          </span>
          <span className="chip border-gold/40 bg-gold/10 text-gold2">{PHASE_LABEL[state.phase]}</span>
          {clock && (
            <span className={`chip ${clock.done ? 'border-coral/40 text-coral' : 'border-sea/40 text-sea'}`}>
              {clock.done ? 'انتهى وقت النقاش' : `المؤقت ${clock.label}`}
            </span>
          )}
        </div>
      </section>

      {(state.phase === 'voting' || state.phase === 'results') && (
        <VoteStage item={item} phase={state.phase} endsAt={state.voteEndsAt} votes={state.votes} />
      )}

      <div className={`grid items-start gap-5 ${state.phase === 'discuss' || !present ? 'lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]' : 'lg:justify-items-end'}`}>
        {(state.phase === 'discuss' || !present) && (
        <div className="space-y-5">
          {state.phase === 'discuss' && <CaseCard item={item} />}
          {!present && (
            <section className="host-private panel p-5">
              <button className="flex w-full items-center justify-between text-lg font-semibold text-gold2" onClick={() => setShowNotes((value) => !value)}>
                ملاحظة المضيف
                <span className="text-sm text-faint">{showNotes ? 'إخفاء' : 'إظهار'}</span>
              </button>
              {showNotes && (
                <div className="mt-3 space-y-3 text-sm leading-8 text-mist">
                  {item.hostNotes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
        )}

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="panel space-y-3 p-4">
            <button
              className="btn-gold w-full text-base"
              disabled={state.phase === 'voting'}
              onClick={() => {
                armVoteSound()
                playVoteOpen()
                send({ type: 'open' })
              }}
            >
              فتح باب التصويت · 12 ثانية
            </button>
            <button className="btn-sea w-full text-base" disabled={state.phase !== 'voting'} onClick={() => send({ type: 'close' })}>
              إغلاق التصويت وعرض النتائج
              {state.phase === 'voting' ? ` (${voteCount}/17)` : ''}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-ghost" disabled={state.caseIndex === 0} onClick={() => askMove({ type: 'prev' })}>
                الحالة السابقة
              </button>
              <button
                className="btn-ghost"
                disabled={state.caseIndex === cases.length - 1}
                onClick={() => askMove({ type: 'next' })}
              >
                الحالة التالية
              </button>
            </div>
            <button className="btn-ghost w-full" onClick={() => setModal('cases')}>
              كل الحالات
            </button>
            <p className="text-center text-xs leading-6 text-faint">صوّت {voteCount} من 17 · المتصلون {onlineIds.length}</p>
          </section>

          {!present && (
            <section className="host-private panel space-y-3 p-4">
              <p className="text-sm font-semibold text-white">أدوات الحصة</p>
              <div className="grid grid-cols-3 gap-2">
                {[5, item.minutes, 10].map((minutes) => (
                  <button key={minutes} className="btn-ghost px-2" onClick={() => send({ type: 'timer', minutes })}>
                    {minutes} د
                  </button>
                ))}
              </div>
              <button className="btn-ghost w-full" onClick={() => send({ type: 'timer', minutes: 0 })}>
                إيقاف المؤقت
              </button>
              <button className="btn-ghost w-full" onClick={() => setModal('roles')}>
                دليل الأدوار
              </button>
              <button className="btn-ghost w-full" onClick={() => setModal('glossary')}>
                ورقة المفاهيم
              </button>
              <button className="btn-ghost w-full" onClick={() => setModal('links')}>
                رابطا الدخول
              </button>
              {state.phase === 'results' && (
                <button className="btn-ghost w-full" onClick={() => setModal('names')}>
                  كشف أصوات الأدوار
                </button>
              )}
              <button className="btn-danger w-full" onClick={() => setPending({ type: 'clear-votes' })}>
                مسح أصوات هذه الحالة
              </button>
              <button className="btn-danger w-full" onClick={() => setPending({ type: 'reset' })}>
                إعادة ضبط الاجتماع
              </button>
            </section>
          )}

          <button className="btn-ghost w-full" onClick={() => setPresent((value) => !value)}>
            {present ? 'إظهار أدوات المعلمة' : 'وضع العرض'}
          </button>

          {!present && (
            <section className="host-private panel p-4">
              <h2 className="mb-3 text-sm font-semibold text-white">حضور الأقسام</h2>
              <Roster roles={roles} onlineIds={onlineIds} votes={state.votes} />
            </section>
          )}
        </aside>
      </div>

      {modal === 'cases' && (
        <Modal title="حالات الاجتماع" wide onClose={() => setModal(null)}>
          <div className="mb-4 flex flex-wrap gap-2">
            {topics.map((entry) => (
              <button
                key={entry}
                className={`chip ${topic === entry ? 'border-gold bg-gold text-ink' : 'border-line text-mist'}`}
                onClick={() => setTopic(entry)}
              >
                {entry}
              </button>
            ))}
          </div>
          <div className="grid gap-2">
            {cases
              .filter((entry) => topic === 'الكل' || entry.topics.includes(topic))
              .map((entry) => {
                const done = state.votedCases?.includes(entry.id - 1)
                const current = entry.id - 1 === state.caseIndex
                return (
                  <button
                    key={entry.id}
                    className={`rounded-2xl border px-4 py-3 text-right ${current ? 'border-gold bg-gold/10' : 'border-line bg-ink'}`}
                    onClick={() => askMove({ type: 'goto', caseIndex: entry.id - 1 })}
                  >
                    <span className="text-xs text-gold">NT-{String(entry.id).padStart(2, '0')}</span>
                    <span className="mt-1 block font-semibold text-white">{entry.title}</span>
                    <span className="mt-1 block text-xs text-faint">
                      {entry.levelLabel}
                      {done ? ' · تم التصويت' : ''}
                    </span>
                  </button>
                )
              })}
          </div>
        </Modal>
      )}

      {modal === 'roles' && (
        <Modal title="دليل الأدوار" wide onClose={() => setModal(null)}>
          <div className="grid gap-3 md:grid-cols-2">
            {roles.map((role) => (
              <div key={role.id} className="rounded-2xl border border-line bg-ink p-4">
                <p className="text-xs text-gold">
                  {role.id} · {role.levelLabel}
                </p>
                <p className="mt-1 font-semibold text-white">{role.title}</p>
                <p className="mt-2 text-sm leading-7 text-mist">{role.mandate}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal === 'glossary' && (
        <Modal title="ورقة المفاهيم" onClose={() => setModal(null)}>
          <div className="space-y-3">
            {GLOSSARY.map((entry) => (
              <div key={entry.term} className="rounded-2xl border border-line bg-ink p-4">
                <p className="font-semibold text-gold2">{entry.term}</p>
                <p className="mt-1 text-sm leading-7 text-mist">{entry.text}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal === 'links' && (
        <Modal title="رابطا الدخول" onClose={() => setModal(null)}>
          <p className="mb-4 text-sm leading-7 text-mist">رابط المضيفة يبقى على لابتوب الرئاسة. رابط البنات يُرسل إلى الأجهزة، ويُؤخذ من عنوان الشبكة لا من localhost.</p>
          <p className="mb-2 text-sm font-semibold text-gold2">المضيفة</p>
          <div className="mb-4 space-y-2">
            {hostLinks.map((url) => (
              <button key={url} className="btn-ghost w-full justify-between" onClick={() => copy(url, url)}>
                <span className="truncate">{url}</span>
                <span>{copied === url ? 'نُسخ' : 'نسخ'}</span>
              </button>
            ))}
          </div>
          <p className="mb-2 text-sm font-semibold text-gold2">البنات</p>
          <div className="space-y-2">
            {studentLinks.map((url) => (
              <button key={url} className="btn-ghost w-full justify-between" onClick={() => copy(url, url)}>
                <span className="truncate">{url}</span>
                <span>{copied === url ? 'نُسخ' : 'نسخ'}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {modal === 'names' && (
        <Modal title="كشف أصوات الأدوار" onClose={() => setModal(null)}>
          <p className="mb-4 text-sm leading-7 text-coral">هذه القائمة للمضيفة. لا تُعرض على شاشة الطلاب.</p>
          <div className="space-y-2">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-ink px-4 py-2 text-sm">
                <span className="text-white">
                  {role.id}. {role.title}
                </span>
                <span className="font-semibold text-gold2">{state.votes[String(role.id)] || '—'}</span>
              </div>
            ))}
          </div>
          <textarea
            readOnly
            className="mt-4 h-28 w-full rounded-2xl border border-line bg-ink p-3 text-sm text-mist"
            value={roles
              .map((role) => `${role.id}. ${role.title}: ${state.votes[String(role.id)] || 'بدون صوت'}`)
              .join('\n')}
          />
        </Modal>
      )}

      {pending && (
        <Modal title="تأكيد الإجراء" onClose={() => setPending(null)}>
          <p className="leading-8 text-mist">
            {pending.type === 'reset'
              ? 'سيُمسح تقدم الاجتماع كله، بما فيه نتائج الحالات السابقة المحفوظة على هذا الخادم.'
              : pending.type === 'clear-votes'
                ? 'ستُمسح أصوات الحالة الحالية ويُغلق باب التصويت من جديد.'
                : 'سيُحفظ تصويت الحالة الحالية، ثم تُفتح الحالة الأخرى بحالتها المحفوظة إن وُجدت.'}
          </p>
          <div className="mt-5 flex gap-3">
            <button
              className="btn-gold"
              onClick={() => {
                send(pending)
                setPending(null)
                setModal(null)
              }}
            >
              متابعة
            </button>
            <button className="btn-ghost" onClick={() => setPending(null)}>
              إلغاء
            </button>
          </div>
        </Modal>
      )}
    </Shell>
  )
}
