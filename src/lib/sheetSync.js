import roles from '../data/roles.json'
import { ANSWER_KEY } from '../data/answerKey'
import { QUIZ_KEY } from '../data/quizKey'
import { HOST_NAME, SHEET_URL, SHEET_TOKEN } from '../config'
import { managerKey, roleById } from '../data/org'

function girlName(id) {
  return roles.find((role) => String(role.id) === String(id))?.nameAr || ''
}

function guessName(guess) {
  if (guess === 'host') return HOST_NAME
  return roleById(Number(guess))?.nameAr || String(guess || '')
}

export function sheetPayload(state) {
  const records = []
  const taps = []
  for (const item of state?.ledger || []) {
    const name = girlName(item.studentId)
    if (item.kind === 'vote') {
      const key = ANSWER_KEY[item.caseId]
      records.push([
        `case-${item.studentId}-${item.caseId}`,
        'حالة',
        name,
        Number(item.studentId),
        `حالة ${item.caseId}`,
        item.choice,
        Math.round(Number(item.ms || 0) / 100) / 10,
        key && key.best === item.choice ? 1 : 0,
        item.at || Date.now(),
      ])
    } else if (item.kind === 'quiz') {
      const key = QUIZ_KEY[item.quizId]
      records.push([
        `quiz-${item.studentId}-${item.quizId}`,
        'سؤال',
        name,
        Number(item.studentId),
        `سؤال ${item.quizId}`,
        item.choice,
        Math.round(Number(item.ms || 0) / 100) / 10,
        key && key.best === item.choice ? 1 : 0,
        item.at || Date.now(),
      ])
    } else if (item.kind === 'curtain') {
      const right = String(managerKey(Number(item.studentId))) === String(item.guess)
      records.push([
        `curtain-${item.studentId}`,
        'ستار',
        name,
        Number(item.studentId),
        'كشف الستار',
        guessName(item.guess),
        '',
        right ? 1 : 0,
        item.at || Date.now(),
      ])
    } else if (item.kind === 'tap') {
      taps.push([item.at || Date.now(), Number(item.studentId), name, item.what || 'نقرة', item.detail || ''])
    }
  }
  return { token: SHEET_TOKEN, records, taps }
}

let lastSig = ''
let timer

export function scheduleSheet(state) {
  if (!SHEET_URL) return
  const payload = sheetPayload(state)
  const sig = JSON.stringify(payload.records) + JSON.stringify(payload.taps)
  if (sig === lastSig) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    lastSig = sig
    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).catch(() => {})
  }, 700)
}
