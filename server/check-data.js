import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { apply, createState, PHASE, studentIdOk, summarize, tally, votedCaseIndexes } from '../shared/meeting.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

export function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', name), 'utf8'))
}

export function validateData(cases, roles) {
  const errors = []
  if (!Array.isArray(cases) || cases.length !== 20) {
    errors.push(`يُتوقع 20 حالة، الموجود: ${cases?.length ?? 0}`)
  }
  if (!Array.isArray(roles) || roles.length !== 17) {
    errors.push(`يُتوقع 17 دوراً، الموجود: ${roles?.length ?? 0}`)
  }
  const levels = new Set(['strategic', 'management', 'operational'])
  roles.forEach((role, index) => {
    if (role.id !== index + 1) errors.push(`ترتيب الأدوار غير متسلسل عند ${role.id}`)
    if (!levels.has(role.level)) errors.push(`مستوى غير معروف للدور ${role.id}`)
    if (!role.title || !role.mandate || !Array.isArray(role.duties) || role.duties.length < 2) {
      errors.push(`بيانات الدور ${role.id} ناقصة`)
    }
  })
  cases.forEach((item, index) => {
    const label = `الحالة ${index + 1}`
    if (item.id !== index + 1) errors.push(`${label}: المعرف لا يطابق الترتيب`)
    if (!item.title || !item.question || !item.ask) errors.push(`${label}: العنوان أو السؤال ناقص`)
    if (!item.personalAsk || !item.addressedLabel) errors.push(`${label}: سؤال صاحب المقعد ناقص`)
    if (item.addressedTo !== 'host' && !(Number.isInteger(item.addressedTo) && item.addressedTo >= 1 && item.addressedTo <= 17)) {
      errors.push(`${label}: المقعد الموجّه غير معروف`)
    }
    if (!Array.isArray(item.paragraphs) || item.paragraphs.length < 2) errors.push(`${label}: السيناريو ناقص`)
    if (!Array.isArray(item.facts) || item.facts.length < 3) errors.push(`${label}: بطاقة البيانات ناقصة`)
    if (!Array.isArray(item.topics) || !item.topics.length) errors.push(`${label}: المواضيع ناقصة`)
    if (!Array.isArray(item.hostNotes) || !item.hostNotes.length) errors.push(`${label}: ملاحظة المضيف ناقصة`)
    const keys = (item.options || []).map((option) => option.key).join('')
    if (keys !== 'ABC') errors.push(`${label}: الخيارات يجب أن تكون A ثم B ثم C`)
    item.options?.forEach((option) => {
      if (!option.title || !option.text) errors.push(`${label}: نص الخيار ${option.key} ناقص`)
    })
  })
  const hostCases = cases.filter((item) => item.addressedTo === 'host')
  const seats = cases.map((item) => item.addressedTo).filter((id) => id !== 'host')
  if (hostCases.length !== 3) errors.push(`يُتوقع 3 حالات للمدير العام، الموجود: ${hostCases.length}`)
  if (new Set(seats).size !== 17 || seats.length !== 17) errors.push('كل مقعد من 1 إلى 17 يحتاج حالة واحدة')
  return errors
}

function assertMeetingFlow() {
  let state = createState()
  const blocked = apply(state, { type: 'vote', studentId: 4, choice: 'A' }, 30)
  if (blocked !== state) throw new Error('قُبل تصويت بينما الباب مغلق')
  const held = apply(state, { type: 'open' }, 30)
  if (held !== state) throw new Error('فُتح التصويت أثناء شرائح التعريف')
  state = apply(state, { type: 'brief', step: null }, 30)
  state = apply(state, { type: 'open' }, 30)
  if (state.phase !== PHASE.voting) throw new Error('لم يُفتح التصويت')
  if (!state.voteEndsAt || state.voteEndsAt - Date.now() < 11000) throw new Error('عدّ التصويت ليس 12 ثانية')
  state = apply(state, { type: 'vote', studentId: 4, choice: 'B' }, 30)
  if (state.votes['4'] !== 'B') throw new Error('لم يُحفظ الصوت')
  state = apply(state, { type: 'close' }, 30)
  if (state.phase !== PHASE.results) throw new Error('لم تُعرض النتائج')
  state = apply(state, { type: 'next' }, 30)
  if (state.caseIndex !== 1 || Object.keys(state.votes).length !== 0) {
    throw new Error('الانتقال لم يمسح أصوات الحالة الجديدة')
  }
  state = apply(state, { type: 'prev' }, 30)
  if (state.caseIndex !== 0 || state.phase !== PHASE.results || state.votes['4'] !== 'B') {
    throw new Error('العودة لم تسترجع التصويت المحفوظ')
  }
  const sample = tally({ 1: 'A', 2: 'A', 3: 'B' })
  if (sample.total !== 3 || sample.percents.A + sample.percents.B + sample.percents.C !== 100) {
    throw new Error('حساب النسب غير مكتمل')
  }
  if (!studentIdOk(17) || studentIdOk(18)) throw new Error('حدود أرقام الطلاب غير صحيحة')
  const roles = [
    { id: 1, level: 'strategic', levelLabel: 'المستوى الاستراتيجي' },
    { id: 2, level: 'management', levelLabel: 'المستوى الإداري' },
  ]
  const summary = summarize({ 1: 'A', 2: 'C' }, roles)
  if (summary.levels.strategic.A !== 1 || summary.levels.management.C !== 1) {
    throw new Error('تجميع المستويات غير صحيح')
  }
  if (!votedCaseIndexes(state).includes(0)) throw new Error('وسم الحالات المصوّت عليها ناقص')
  let quiz = createState()
  quiz = apply(quiz, { type: 'quiz-start' }, 20)
  if (quiz.briefing !== null || quiz.quizIndex !== 0) throw new Error('لم تبدأ الأسئلة السريعة')
  quiz = apply(quiz, { type: 'open' }, 20)
  const quizLeft = quiz.voteEndsAt - Date.now()
  if (quizLeft < 14000 || quizLeft > 16000) throw new Error('عدّ السؤال السريع ليس 15 ثانية')
  quiz = apply(quiz, { type: 'vote', studentId: 2, choice: 'C' }, 20)
  const saved = quiz.ledger.find((item) => item.kind === 'quiz' && item.quizId === 1)
  if (!saved || saved.choice !== 'C' || quiz.votes['2'] !== 'C') throw new Error('لم يُحفظ صوت السؤال السريع')
  quiz = apply(quiz, { type: 'next' }, 20)
  if (quiz.quizIndex !== 1 || Object.keys(quiz.votes).length !== 0) throw new Error('السؤال التالي لم يفصل الأصوات')
  quiz = apply(quiz, { type: 'prev' }, 20)
  if (quiz.votes['2'] !== 'C') throw new Error('العودة لم تسترجع صوت السؤال السريع')
  quiz = apply(quiz, { type: 'quiz-end' }, 20)
  if (quiz.quizIndex !== null || quiz.votes['2']) throw new Error('إنهاء الأسئلة لم يرجّع الحالات فارغة')
  if (!quiz.quizHistory[0] || quiz.quizHistory[0].votes['2'] !== 'C') throw new Error('سجل السؤال السريع ضاع')
  quiz = apply(quiz, { type: 'quiz-start', quizIndex: 8 }, 20)
  if (quiz.quizIndex !== 8 || quiz.caseIndex !== 0) throw new Error('السؤال الأخير ما صار قبل الحالة الأولى')
  quiz = apply(quiz, { type: 'quiz-end' }, 20)
  quiz = apply(quiz, { type: 'quiz-start', quizIndex: 8 }, 20)
  if (quiz.quizIndex !== 8) throw new Error('الرجوع من الحالة الأولى ما فتح آخر سؤال')
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const cases = loadJson('cases.json')
  const roles = loadJson('roles.json')
  const errors = validateData(cases, roles)
  assertMeetingFlow()
  if (errors.length) {
    console.error(errors.join('\n'))
    process.exit(1)
  }
  console.log(`البيانات سليمة: ${cases.length} حالة و${roles.length} دوراً، ومنطق التصويت يعمل.`)
}
