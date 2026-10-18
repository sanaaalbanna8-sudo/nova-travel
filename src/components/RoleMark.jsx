const SCENES = {
  1: 'compass',
  2: 'market',
  3: 'clock',
  4: 'community',
  5: 'families',
  6: 'people',
  7: 'cash',
  8: 'alert',
  9: 'room',
  10: 'ask',
  11: 'trail',
  12: 'form',
  13: 'clean',
  14: 'screen',
  15: 'price',
  16: 'model',
  17: 'shield',
  host: 'seal',
}

function Scene({ kind }) {
  const ink = '#1c2433'
  const gold = '#c9a227'
  const sea = '#0e7c84'
  const coral = '#e15a4a'
  if (kind === 'compass') {
    return (
      <>
        <circle cx="40" cy="40" r="16" fill="none" stroke={gold} strokeWidth="3" />
        <path d="M40 26 L46 40 L40 54 L34 40 Z" fill={sea} />
        <circle cx="40" cy="40" r="3" fill={gold} />
      </>
    )
  }
  if (kind === 'market') {
    return (
      <>
        <path d="M18 52 H62" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <path d="M22 46 L32 34 L42 40 L58 22" fill="none" stroke={sea} strokeWidth="3" strokeLinecap="round" />
        <circle cx="58" cy="22" r="4" fill={coral} />
      </>
    )
  }
  if (kind === 'clock') {
    return (
      <>
        <circle cx="40" cy="40" r="18" fill="none" stroke={sea} strokeWidth="3" />
        <path d="M40 28 V40 L50 46" fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round" />
      </>
    )
  }
  if (kind === 'community') {
    return (
      <>
        <rect x="16" y="22" width="28" height="20" rx="8" fill={sea} />
        <rect x="36" y="36" width="28" height="20" rx="8" fill={gold} />
      </>
    )
  }
  if (kind === 'families') {
    return (
      <>
        <circle cx="28" cy="30" r="7" fill={coral} />
        <circle cx="46" cy="28" r="8" fill={sea} />
        <circle cx="58" cy="36" r="5" fill={gold} />
        <path d="M16 56c2-10 10-14 16-12 4 8 14 8 20-2 6 2 12 8 12 16" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      </>
    )
  }
  if (kind === 'people') {
    return (
      <>
        <circle cx="28" cy="30" r="8" fill={sea} />
        <circle cx="52" cy="30" r="8" fill={gold} />
        <path d="M14 58c2-12 10-16 14-16s12 4 14 16" fill={sea} opacity="0.35" />
        <path d="M38 58c2-12 10-16 14-16s12 4 14 16" fill={gold} opacity="0.45" />
      </>
    )
  }
  if (kind === 'cash') {
    return (
      <>
        <rect x="18" y="26" width="44" height="28" rx="6" fill={gold} />
        <circle cx="40" cy="40" r="8" fill="none" stroke={ink} strokeWidth="3" />
      </>
    )
  }
  if (kind === 'alert') {
    return (
      <>
        <path d="M40 16 L64 58 H16 Z" fill="#fff4d6" stroke={coral} strokeWidth="3" />
        <path d="M40 32 V44" stroke={coral} strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="50" r="2" fill={coral} />
      </>
    )
  }
  if (kind === 'room') {
    return (
      <>
        <rect x="22" y="24" width="36" height="32" rx="4" fill="none" stroke={sea} strokeWidth="3" />
        <path d="M36 56 V40 H48" fill="none" stroke={gold} strokeWidth="3" />
      </>
    )
  }
  if (kind === 'ask') {
    return (
      <>
        <rect x="20" y="18" width="40" height="32" rx="6" fill="none" stroke={sea} strokeWidth="3" />
        <path d="M28 30 H48 M28 38 H42" stroke={gold} strokeWidth="3" strokeLinecap="round" />
        <circle cx="54" cy="54" r="8" fill={coral} />
        <path d="M51 54 H57 M54 51 V57" stroke="#fff" strokeWidth="2" />
      </>
    )
  }
  if (kind === 'trail') {
    return (
      <>
        <path d="M22 56 C30 40 34 44 40 28 C48 44 52 36 60 20" fill="none" stroke={sea} strokeWidth="3" />
        <circle cx="40" cy="28" r="4" fill={gold} />
        <circle cx="60" cy="20" r="4" fill={coral} />
      </>
    )
  }
  if (kind === 'form') {
    return (
      <>
        <rect x="22" y="16" width="36" height="48" rx="6" fill="none" stroke={sea} strokeWidth="3" />
        <path d="M30 30 H50 M30 40 H46 M30 50 H40" stroke={gold} strokeWidth="3" strokeLinecap="round" />
      </>
    )
  }
  if (kind === 'clean') {
    return (
      <>
        <rect x="16" y="28" width="22" height="28" rx="4" fill={gold} opacity="0.8" />
        <rect x="30" y="22" width="22" height="28" rx="4" fill={sea} />
        <path d="M48 46 L62 32" stroke={coral} strokeWidth="3" strokeLinecap="round" />
      </>
    )
  }
  if (kind === 'screen') {
    return (
      <>
        <rect x="14" y="20" width="52" height="34" rx="6" fill="none" stroke={sea} strokeWidth="3" />
        <path d="M24 48 V32 H34 V48" stroke={gold} strokeWidth="3" />
        <path d="M40 48 V26 H50 V48" stroke={coral} strokeWidth="3" />
      </>
    )
  }
  if (kind === 'price') {
    return (
      <>
        <ellipse cx="40" cy="40" rx="20" ry="14" fill="none" stroke={sea} strokeWidth="3" />
        <path d="M34 34 H46 M34 40 H44 M34 46 H40" stroke={gold} strokeWidth="3" strokeLinecap="round" />
      </>
    )
  }
  if (kind === 'model') {
    return (
      <>
        <path d="M18 58 V22 H26 V58 H36 V34 H44 V58 H54 V28 H62 V58" fill={sea} />
      </>
    )
  }
  if (kind === 'shield') {
    return <path d="M40 14 L62 24 V40 C62 54 40 66 40 66 C40 66 18 54 18 40 V24 Z" fill={sea} stroke={gold} strokeWidth="3" />
  }
  return (
    <>
      <circle cx="40" cy="40" r="22" fill={gold} />
      <path d="M40 24 L44 36 H56 L46 44 L50 56 L40 48 L30 56 L34 44 L24 36 H36 Z" fill="#fff8ea" />
    </>
  )
}

export default function RoleMark({ who, name, host = false }) {
  const kind = SCENES[who] || 'seal'
  return (
    <figure className={`role-mark ${host ? 'is-host' : ''}`}>
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r="38" fill="#fff8ea" />
        <Scene kind={kind} />
      </svg>
      <figcaption>
        <small>{host ? 'المدير العام · رأي شفهي' : 'الرأي شفهي'}</small>
        <strong>{name}</strong>
      </figcaption>
    </figure>
  )
}
