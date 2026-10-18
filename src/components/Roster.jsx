import { LEVEL_STYLE } from '../config'

const GROUPS = [
  ['strategic', 'المستوى الاستراتيجي'],
  ['management', 'المستوى الإداري'],
  ['operational', 'المستوى التشغيلي'],
]

export default function Roster({ roles, onlineIds, votes }) {
  const online = new Set(onlineIds)
  return (
    <div className="space-y-4">
      {GROUPS.map(([level, label]) => (
        <div key={level}>
          <p className="mb-2 text-xs text-faint">{label}</p>
          <div className="grid gap-2">
            {roles
              .filter((role) => role.level === level)
              .map((role) => {
                const voted = Boolean(votes?.[String(role.id)])
                const connected = online.has(role.id)
                return (
                  <div key={role.id} className="flex items-center gap-3 rounded-2xl border border-line bg-ink/50 px-3 py-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-sea' : 'bg-line'}`} />
                    <span className="w-6 text-sm font-semibold text-gold">{role.id}</span>
                    <span className="min-w-0 flex-1 truncate text-sm text-white">{role.title}</span>
                    <span className={`text-xs ${voted ? 'text-gold2' : 'text-faint'}`}>{voted ? 'صوّت' : 'بانتظار'}</span>
                    <span className={`h-2 w-2 rounded-full ${LEVEL_STYLE[level].dot} ${voted ? '' : 'opacity-0'}`} />
                  </div>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}
