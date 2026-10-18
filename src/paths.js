function basePath() {
  return (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
}

export function appPath() {
  const base = basePath()
  let path = window.location.pathname
  if (base && path.startsWith(base)) path = path.slice(base.length) || '/'
  if (!path.startsWith('/')) path = `/${path}`
  path = path.replace(/\/$/, '') || '/'
  return path
}

export function ensureSeatPath() {
  const path = appPath()
  if (path === '/host') return 'host'
  if (path === '/join') return 'student'
  const next = `${basePath()}/join${window.location.search}${window.location.hash}`
  window.history.replaceState(null, '', next)
  return 'student'
}

export function seatHref(origin, seat) {
  return `${String(origin || '').replace(/\/$/, '')}${basePath()}/${seat}`
}
