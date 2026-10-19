export const PHASE = {
  discuss: 'discuss',
  voting: 'voting',
  results: 'results',
}

export const CHOICES = ['A', 'B', 'C']
export const VOTE_SECONDS = 12
export const QUIZ_VOTE_SECONDS = 15
export const BRIEF_MAX = 6
export const QUIZ_MAX = 8

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
    quizIndex: null,
    quizHistory: {},
    ledger: [],
    curtain: { studentId: 0, guess: '' },
    discussStartedAt: Date.now(),
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

function inQuiz(state) {
  return Number.isInteger(state.quizIndex) && typeof state.briefing !== 'number'
}

function voteSeconds(state) {
  return inQuiz(state) ? QUIZ_VOTE_SECONDS : VOTE_SECONDS
}

function rememberQuiz(state) {
  if (!Number.isInteger(state.quizIndex)) return state.quizHistory || {}
  return { ...(state.quizHistory || {}), [state.quizIndex]: snapshot(state) }
}

function moveQuiz(state, index) {
  if (!Number.isInteger(index) || index < 0 || index > QUIZ_MAX) return state
  if (index === state.quizIndex) return state
  const quizHistory = rememberQuiz(state)
  const saved = quizHistory[index]
  const phase = saved?.phase || PHASE.discuss
  return touch({
    ...state,
    quizHistory,
    quizIndex: index,
    phase,
    votes: saved?.votes ? { ...saved.votes } : {},
    advice: null,
    timerEndsAt: null,
    voteEndsAt: saved?.voteEndsAt || null,
    discussStartedAt: phase === PHASE.discuss ? Date.now() : state.discussStartedAt || null,
  })
}

function moveTo(state, index, caseCount) {
  if (!Number.isInteger(index) || index < 0 || index >= caseCount) return state
  if (index === state.caseIndex) return state
  const history = {
    ...state.history,
    [state.caseIndex]: snapshot(state),
  }
  const saved = history[index]
  const phase = saved?.phase || PHASE.discuss
  return touch({
    ...state,
    history,
    caseIndex: index,
    phase,
    votes: saved?.votes ? { ...saved.votes } : {},
    advice: saved?.advice || null,
    timerEndsAt: null,
    voteEndsAt: saved?.voteEndsAt || null,
    discussStartedAt: phase === PHASE.discuss ? Date.now() : state.discussStartedAt || null,
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
        voteEndsAt: Date.now() + voteSeconds(state) * 1000,
      })
    case 'close':
      if (state.phase !== PHASE.voting) return state
      return touch({ ...state, phase: PHASE.results, timerEndsAt: null, voteEndsAt: null })
    case 'goto':
      if (inQuiz(state)) {
        const index = action.caseIndex
        if (!Number.isInteger(index) || index < 0 || index >= caseCount) return state
        const saved = state.history?.[index]
        const phase = saved?.phase || PHASE.discuss
        return touch({
          ...state,
          quizHistory: rememberQuiz(state),
          quizIndex: null,
          caseIndex: index,
          phase,
          votes: saved?.votes ? { ...saved.votes } : {},
          advice: saved?.advice || null,
          voteEndsAt: saved?.voteEndsAt || null,
          timerEndsAt: null,
          discussStartedAt: phase === PHASE.discuss ? Date.now() : state.discussStartedAt || null,
        })
      }
      return moveTo(state, action.caseIndex, caseCount)
    case 'next':
      if (inQuiz(state)) return moveQuiz(state, state.quizIndex + 1)
      if (typeof state.briefing === 'number') return state
      return moveTo(state, state.caseIndex + 1, caseCount)
    case 'prev':
      if (inQuiz(state)) return moveQuiz(state, state.quizIndex - 1)
      if (typeof state.briefing === 'number') return state
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
      const opened = typeof state.voteEndsAt === 'number' ? state.voteEndsAt - voteSeconds(state) * 1000 : Date.now()
      const ms = Math.max(0, Date.now() - opened)
      const ledger = [...(state.ledger || [])]
      if (inQuiz(state)) {
        const quizId = state.quizIndex + 1
        const prior = ledger.find((item) => item.kind === 'quiz' && item.studentId === key && item.quizId === quizId)
        if (prior) prior.choice = action.choice
        else ledger.push({ kind: 'quiz', studentId: key, quizId, choice: action.choice, ms, at: Date.now() })
      } else {
        const caseId = state.caseIndex + 1
        const prior = ledger.find((item) => item.kind === 'vote' && item.studentId === key && item.caseId === caseId)
        if (prior) prior.choice = action.choice
        else ledger.push({ kind: 'vote', studentId: key, caseId, choice: action.choice, ms, at: Date.now() })
      }
      return touch({
        ...state,
        votes: { ...state.votes, [key]: action.choice },
        ledger,
      })
    }
    case 'curtain-who': {
      if (!studentIdOk(action.studentId)) return state
      const studentId = Number(action.studentId)
      if (state.curtain?.studentId === studentId && !state.curtain?.guess) return state
      return touch({ ...state, curtain: { studentId, guess: '' } })
    }
    case 'curtain': {
      if (!studentIdOk(action.studentId)) return state
      const key = String(Number(action.studentId))
      const guess = String(action.guess || '')
      if (!guess) return state
      const ledger = (state.ledger || []).filter((item) => !(item.kind === 'curtain' && item.studentId === key))
      ledger.push({ kind: 'curtain', studentId: key, guess, at: Date.now() })
      return touch({
        ...state,
        ledger,
        curtain: { studentId: Number(action.studentId), guess },
      })
    }
    case 'arrive': {
      if (!studentIdOk(action.studentId)) return state
      const key = String(Number(action.studentId))
      if ((state.ledger || []).some((item) => item.kind === 'arrive' && item.studentId === key)) return state
      return touch({
        ...state,
        ledger: [...(state.ledger || []), { kind: 'arrive', studentId: key, at: Date.now() }],
      })
    }
    case 'clear-votes':
      if (inQuiz(state)) {
        const quizId = state.quizIndex + 1
        return touch({
          ...state,
          votes: {},
          advice: null,
          phase: PHASE.discuss,
          quizHistory: {
            ...(state.quizHistory || {}),
            [state.quizIndex]: { phase: PHASE.discuss, votes: {}, advice: null, voteEndsAt: null },
          },
          voteEndsAt: null,
          discussStartedAt: Date.now(),
          ledger: (state.ledger || []).filter((item) => !(item.kind === 'quiz' && item.quizId === quizId)),
        })
      }
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
        discussStartedAt: Date.now(),
        ledger: (state.ledger || []).filter((item) => !(item.kind === 'vote' && item.caseId === state.caseIndex + 1)),
      })
    case 'timer': {
      const minutes = Number(action.minutes)
      const timerEndsAt =
        Number.isFinite(minutes) && minutes > 0 ? Date.now() + minutes * 60 * 1000 : null
      return touch({ ...state, timerEndsAt })
    }
    case 'quiz-start': {
      const requested = Number.isInteger(action.quizIndex) && action.quizIndex >= 0 && action.quizIndex <= QUIZ_MAX ? action.quizIndex : null
      if (inQuiz(state)) {
        if (requested === null || requested === state.quizIndex) return state
        return moveQuiz(state, requested)
      }
      const index = requested !== null ? requested : Number.isInteger(state.quizIndex) ? state.quizIndex : 0
      const fromCases = typeof state.briefing !== 'number'
      const history = fromCases ? { ...state.history, [state.caseIndex]: snapshot(state) } : state.history
      const quizHistory = state.quizHistory || {}
      const saved = quizHistory[index]
      const phase = saved?.phase || PHASE.discuss
      return touch({
        ...state,
        history,
        briefing: null,
        quizHistory,
        quizIndex: index,
        phase,
        votes: saved?.votes ? { ...saved.votes } : {},
        advice: null,
        voteEndsAt: saved?.voteEndsAt || null,
        timerEndsAt: null,
        discussStartedAt: phase === PHASE.discuss ? Date.now() : state.discussStartedAt || null,
      })
    }
    case 'quiz-end':
      if (!Number.isInteger(state.quizIndex) && typeof state.briefing !== 'number') return state
      return touch({
        ...state,
        quizHistory: rememberQuiz(state),
        quizIndex: null,
        briefing: null,
        caseIndex: 0,
        phase: PHASE.discuss,
        votes: {},
        advice: null,
        summary: null,
        voteEndsAt: null,
        timerEndsAt: null,
        discussStartedAt: Date.now(),
      })
    case 'brief': {
      const step = action.step
      if (step !== null && (!Number.isInteger(step) || step < 0 || step > BRIEF_MAX)) return state
      if (state.briefing === step && !Number.isInteger(state.quizIndex)) return state
      if (step === null) {
        return touch({
          ...state,
          quizHistory: rememberQuiz(state),
          quizIndex: null,
          briefing: null,
          caseIndex: 0,
          phase: PHASE.discuss,
          votes: {},
          summary: null,
          advice: null,
          voteEndsAt: null,
          timerEndsAt: null,
          discussStartedAt: Date.now(),
        })
      }
      if (inQuiz(state)) {
        return touch({
          ...state,
          quizHistory: rememberQuiz(state),
          briefing: step,
          phase: PHASE.discuss,
          voteEndsAt: null,
          discussStartedAt: Date.now(),
        })
      }
      return touch({
        ...state,
        briefing: step,
        phase: PHASE.discuss,
        voteEndsAt: null,
        discussStartedAt: Date.now(),
      })
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
