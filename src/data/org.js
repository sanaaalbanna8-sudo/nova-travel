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

export function managerKey(id) {
  const boss = REPORTS_TO[id]
  return boss === 'host' ? 'host' : String(boss)
}

export function managerName(id) {
  return MANAGER_OPTIONS.find((item) => item.key === managerKey(id))?.nameAr || ''
}

export const MANAGER_OPTIONS = [
  { key: 'host', nameAr: HOST_NAME, name: 'Sanaa Albanna' },
  { key: '4', nameAr: 'غزل أبو الرب', name: 'GHAZAL RAID ABU AL ROB' },
  { key: '1', nameAr: 'إيمان الدراغمة', name: 'EMAN MOHAMMAD AL-DRAGHMA' },
  { key: '7', nameAr: 'روز النجار', name: 'ROSE SAMIR F. NAJJAR' },
  { key: '10', nameAr: 'سلمى الحموز', name: 'SALMA RIYAD AL-HMOUZ' },
]

export const REASONS = {
  4: 'لأنها المدير التنفيذي، والقرار الأخير بيرجع للإدارة العليا.',
  1: 'السياسة والقانون لازم يمرّوا على القرار التنفيذي قبل ما يتطبقوا.',
  7: 'مراقبة السوق بتغذي الخطة، والخطة ما بتصير قرار إلا عند المدير التنفيذي.',
  2: 'شكوى الضيف بتوصل للإدارة قبل ما الشركة توعد أو تعوّض.',
  6: 'ترتيب الخطر لازم يوصل للمديرة اللي بتحسم شو نبلّغ اليوم.',
  16: 'الصندوق والربح قرار تنفيذي، مو قرار قسم لحاله.',
  10: 'البيانات المحفوظة هي أساس قرار الشركة، فمسؤولتها ترفع للمدير التنفيذي.',
  11: 'حسابات الموظفين وإغلاقها بيتبعوا السياسة والقانون.',
  17: 'اختيار النظام وأمنه بيتبع سياسة الشركة، مو العكس.',
  13: 'الكلام العلني عن الشركة بيتبع خطة السوق، مو يننشر لحاله.',
  9: 'المقاعد والغرف المتاحة بتتبع الموسم والخطة، مو رقم الصباح فقط.',
  12: 'البيان اللي بتنجمعه من الضيف لازم ينحفظ، ما يضل عند اللي جمعته.',
  15: 'الفحص بيوقف الإدخال الغلط قبل ما يدخل قاعدة البيانات.',
  5: 'التنظيف بيصير قبل التخزين، حتى ما ينحفظ تكرار أو نقص.',
  14: 'سجل مين عدّل ومتى بينحفظ مع البيانات نفسها.',
  8: 'الرقم اللي بتحسبه طالع من البيانات المحفوظة.',
  3: 'الشاشة بتعرض اللي انحفظ واتحسب، فما بتسبق قاعدة البيانات.',
}
