import roles from './roles.json'
import { HOST_NAME } from '../config'

export const REPORTS_TO = {
  4: 'host',
  1: 4,
  7: 4,
  2: 4,
  6: 4,
  16: 4,
  10: 4,
  11: 1,
  17: 1,
  13: 7,
  9: 7,
  12: 10,
  15: 10,
  5: 10,
  14: 10,
  8: 10,
  3: 10,
}

export const BRANCHES = [
  { lead: 1, team: [11, 17] },
  { lead: 7, team: [13, 9] },
  { lead: 2, team: [] },
  { lead: 6, team: [] },
  { lead: 16, team: [] },
  { lead: 10, team: [12, 15, 5, 14, 8, 3] },
]

export const WORKFLOW = [
  { id: 7, verb: 'تراقب' },
  { id: 9, verb: 'تحجز' },
  { id: 12, verb: 'تجمع' },
  { id: 15, verb: 'تفحص' },
  { id: 5, verb: 'تنظّف' },
  { id: 14, verb: 'تسجّل' },
  { id: 10, verb: 'تحفظ' },
  { id: 8, verb: 'تحسب' },
  { id: 16, verb: 'تموّل' },
  { id: 3, verb: 'تعرض' },
  { id: 13, verb: 'تنشر' },
  { id: 2, verb: 'ترد' },
  { id: 1, verb: 'تحدد' },
  { id: 11, verb: 'تنظّم' },
  { id: 17, verb: 'تحمي' },
  { id: 6, verb: 'تقيّم' },
  { id: 4, verb: 'تقرر' },
]

export function roleById(id) {
  return roles.find((role) => role.id === id)
}

export function managerName(id) {
  const boss = REPORTS_TO[id]
  if (boss === 'host') return HOST_NAME
  return roleById(boss)?.nameAr || ''
}
