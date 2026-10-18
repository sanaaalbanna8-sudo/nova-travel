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
  const [tools, setTools] = useState(false)
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
    <Shell status={status} onLeave={() => onLeave('')} leaveLabel="إغلاق اللوحة" stage progress={(state.caseIndex + 1) / cases.length}>
      <div className="board">
        {!present && <Roster roles={roles} onlineIds={onlineIds} votes={state.votes} />}
        <div className="board-main" style={present ? { gridColumn: '1 / -1' } : undefined}>
          <CaseCard item={item} mode="story" />
          {state.phase === 'discuss' ? (
            <CaseCard
              item={item}
              mode="choices"
              advice={state.advice}
              canAdvise={item.addressedTo === 'host'}
              onAdvise={(choice) => send({ type: 'advise', choice })}
            />
          ) : (
            <VoteStage item={item} phase={state.phase} endsAt={state.voteEndsAt} votes={state.votes} advice={state.advice} />
          )}
          <div className="board-dock">
            <button
              className="btn-gold"
              disabled={state.phase === 'voting' || !state.advice}
              onClick={() => {
                armVoteSound()
                playVoteOpen()
                send({ type: 'open' })
              }}
            >
              {state.advice ? 'فتح التصويت · 12 ث' : 'بانتظار التوصية'}
            </button>
            <button className="btn-sea" disabled={state.phase !== 'voting'} onClick={() => send({ type: 'close' })}>
              إغلاق وعرض النتائج{state.phase === 'voting' ? ` (${voteCount}/17)` : ''}
            </button>
            <button className="btn-ghost" disabled={state.caseIndex === 0} onClick={() => askMove({ type: 'prev' })}>
              السابقة
            </button>
            <button className="btn-ghost" disabled={state.caseIndex === cases.length - 1} onClick={() => askMove({ type: 'next' })}>
              التالية
            </button>
            <button className="btn-ghost" onClick={() => setModal('cases')}>
              الحالات
            </button>
            <span className="me-auto text-xs font-bold text-mist">
              {String(item.id).padStart(2, '0')} / {cases.length} · {PHASE_LABEL[state.phase]}
              {state.advice ? ` · التوصية ${state.advice}` : ''}
              {clock ? ` · ${clock.done ? 'انتهى النقاش' : clock.label}` : ''} · {voteCount}/17
            </span>
            {!present && (
              <button className="btn-ghost" onClick={() => setTools((value) => !value)}>
                أدوات الحصة
              </button>
            )}
            <button className="btn-ghost" onClick={() => setPresent((value) => !value)}>
              {present ? 'إظهار الأسماء' : 'وضع العرض'}
            </button>
          </div>
        </div>
      </div>

      {tools && !present && (
        <aside className="tools-drawer">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink">أدوات الحصة</h2>
            <button className="btn-ghost min-h-10 px-3" onClick={() => setTools(false)}>
              إغلاق
            </button>
          </div>
          <div className="space-y-3">
            <button className="flex w-full items-center justify-between text-sm font-extrabold text-gold2" onClick={() => setShowNotes((value) => !value)}>
              ملاحظة المضيف
              <span className="text-xs text-faint">{showNotes ? 'إخفاء' : 'إظهار'}</span>
            </button>
            {showNotes && (
              <div className="space-y-2 text-sm leading-7 text-mist">
                {item.hostNotes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            )}
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
            <p className="text-xs leading-6 text-faint">المتصلون {onlineIds.length} · المضيفة {HOST_NAME}</p>
          </div>
        </aside>
      )}

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
                    className={`rounded-2xl border px-4 py-3 text-right ${current ? 'border-gold bg-gold/10' : 'border-line bg-paper'}`}
                    onClick={() => askMove({ type: 'goto', caseIndex: entry.id - 1 })}
                  >
                    <span className="text-xs text-gold">NT-{String(entry.id).padStart(2, '0')}</span>
                    <span className="mt-1 block font-semibold text-ink">{entry.title}</span>
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
              <div key={role.id} className="rounded-2xl border border-line bg-paper p-4">
                <p className="text-xs text-gold">
                  {role.id} · {role.levelLabel}
                </p>
                <p className="mt-1 font-semibold text-ink">{role.title}</p>
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
              <div key={entry.term} className="rounded-2xl border border-line bg-paper p-4">
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
              <div key={role.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper px-4 py-2 text-sm">
                <span className="text-ink">
                  {role.id}. {role.title}
                </span>
                <span className="font-semibold text-gold2">{state.votes[String(role.id)] || '—'}</span>
              </div>
            ))}
          </div>
          <textarea
            readOnly
            className="mt-4 h-28 w-full rounded-2xl border border-line bg-paper p-3 text-sm text-mist"
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
