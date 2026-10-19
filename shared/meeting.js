export const PHASE = {
  discuss: 'discuss',
  voting: 'voting',
  results: 'results',
}

export const CHOICES = ['A', 'B', 'C']
export const VOTE_SECONDS = 12

export function createState() {
  return {
    rev: 1,
    caseIndex: 0,
    phase: PHASE.discuss,
    votes: {},
    advice: null,
    timerEndsAt: null,
    voteEndsAt: null,
    history: {},
    briefing: 0,
    updatedAt: Date.now(),
  }
}

function touch(state) {
  return { ...state, rev: state.rev + 1, updatedAt: Date.now() }
}

export function studentIdOk(id) {
  const n = Number(id)
  return Number.isInteger(n) && n >= 1 && n <= 17
}

function snapshot(state) {
  return {
    phase: state.phase,
    votes: { ...state.votes },
    advice: state.advice || null,
    voteEndsAt: state.voteEndsAt || null,
  }
}

function moveTo(state, index, caseCount) {
  if (!Number.isInteger(index) || index < 0 || index >= caseCount) return state
  if (index === state.caseIndex) return state
  const history = {
    ...state.history,
    [state.caseIndex]: snapshot(state),
  }
  const saved = history[index]
  return touch({
    ...state,
    history,
    caseIndex: index,
    phase: saved?.phase || PHASE.discuss,
    votes: saved?.votes ? { ...saved.votes } : {},
    advice: saved?.advice || null,
    timerEndsAt: null,
    voteEndsAt: saved?.voteEndsAt || null,
  })
}

export function apply(state, action, caseCount) {
  switch (action.type) {
    case 'open':
      if (state.phase === PHASE.voting) return state
      if (typeof state.briefing === 'number') return state
      return touch({
        ...state,
        phase: PHASE.voting,
        timerEndsAt: null,
        voteEndsAt: Date.now() + VOTE_SECONDS * 1000,
      })
    case 'close':
      if (state.phase !== PHASE.voting) return state
      return touch({ ...state, phase: PHASE.results, timerEndsAt: null, voteEndsAt: null })
    case 'goto':
      return moveTo(state, action.caseIndex, caseCount)
    case 'next':
      return moveTo(state, state.caseIndex + 1, caseCount)
    case 'prev':
      return moveTo(state, state.caseIndex - 1, caseCount)
    case 'advise': {
      if (state.phase !== PHASE.discuss) return state
      if (!CHOICES.includes(action.choice)) return state
      if (state.advice === action.choice) return state
      return touch({ ...state, advice: action.choice })
    }
    case 'vote': {
      if (state.phase !== PHASE.voting) return state
      if (!studentIdOk(action.studentId)) return state
      if (!CHOICES.includes(action.choice)) return state
      const key = String(Number(action.studentId))
      if (state.votes[key] === action.choice) return state
      return touch({
        ...state,
        votes: { ...state.votes, [key]: action.choice },
      })
    }
    case 'clear-votes':
      return touch({
        ...state,
        votes: {},
        advice: null,
        phase: PHASE.discuss,
        history: {
          ...state.history,
          [state.caseIndex]: { phase: PHASE.discuss, votes: {}, advice: null, voteEndsAt: null },
        },
        voteEndsAt: null,
      })
    case 'timer': {
      const minutes = Number(action.minutes)
      const timerEndsAt =
        Number.isFinite(minutes) && minutes > 0 ? Date.now() + minutes * 60 * 1000 : null
      return touch({ ...state, timerEndsAt })
    }
    case 'brief': {
      const step = action.step
      if (step !== null && step !== 0 && step !== 1 && step !== 2) return state
      if (state.briefing === step) return state
      if (step === null) {
        return touch({
          ...state,
          briefing: null,
          caseIndex: 0,
          phase: PHASE.discuss,
          votes: {},
          summary: null,
          advice: null,
          voteEndsAt: null,
          timerEndsAt: null,
        })
      }
      return touch({ ...state, briefing: step, phase: PHASE.discuss, voteEndsAt: null })
    }
    case 'reset':
      return createState()
    default:
      return state
  }
}

export function votedCaseIndexes(state) {
  const set = new Set()
  for (const [key, item] of Object.entries(state.history || {})) {
    const index = Number(key)
    if (index === state.caseIndex) continue
    if (item?.votes && Object.keys(item.votes).length) set.add(index)
  }
  if (Object.keys(state.votes || {}).length) set.add(state.caseIndex)
  return [...set].sort((a, b) => a - b)
}

export function summarize(votes, roles) {
  const overall = tally(votes)
  const levels = {}
  for (const role of roles) {
    if (!levels[role.level]) {
      levels[role.level] = {
        A: 0,
        B: 0,
        C: 0,
        cast: 0,
        seats: 0,
        label: role.levelLabel,
      }
    }
    const bucket = levels[role.level]
    bucket.seats += 1
    const choice = votes?.[String(role.id)]
    if (choice && bucket[choice] !== undefined) {
      bucket[choice] += 1
      bucket.cast += 1
    }
  }
  return { ...overall, levels }
}

export function tally(votes) {
  const counts = { A: 0, B: 0, C: 0 }
  for (const choice of Object.values(votes || {})) {
    if (counts[choice] !== undefined) counts[choice] += 1
  }
  const total = counts.A + counts.B + counts.C
  const raw = CHOICES.map((key) => {
    const exact = total ? (counts[key] / total) * 100 : 0
    return { key, pct: Math.floor(exact), frac: exact - Math.floor(exact) }
  })
  let used = raw.reduce((sum, item) => sum + item.pct, 0)
  const order = [...raw].sort((a, b) => b.frac - a.frac)
  let i = 0
  while (total && used < 100) {
    order[i % order.length].pct += 1
    used += 1
    i += 1
  }
  const percents = { A: 0, B: 0, C: 0 }
  for (const item of raw) percents[item.key] = item.pct
  return { counts, total, percents }
}
