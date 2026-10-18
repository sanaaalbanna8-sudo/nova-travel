export default function Roster({ roles, onlineIds, votes }) {
  const online = new Set(onlineIds)
  return (
    <aside className="board-names">
      <h2>المقاعد</h2>
      <ol>
        {roles.map((role) => {
          const voted = Boolean(votes?.[String(role.id)])
          const connected = online.has(role.id)
          return (
            <li key={role.id} className={`lv-${role.level} ${connected ? 'is-on' : ''} ${voted ? 'is-voted' : ''}`}>
              <b>{role.id}</b>
              <span>{role.title}</span>
              <i />
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
