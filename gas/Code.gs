const TOKEN = 'NOVA-SHEET-2026'

const GIRLS = [
  [1, 'إيمان الدراغمة', 'EMAN MOHAMMAD AL-DRAGHMA', 'مديرة السياسات، القوانين، والمناطق الزمنية', 'استراتيجي'],
  [2, 'جنى المغربي', "JANA MU'TAZ ELMUGHRABI", 'مديرة خدمة العملاء وأصحاب المصلحة', 'إداري'],
  [3, 'كندة بطاح', 'KENDAH AMMAR BATTAH', 'مهندسة الواجهات الأمامية ولوحات معلومات المسافرين', 'تشغيلي'],
  [4, 'غزل أبو الرب', 'GHAZAL RAID ABU AL ROB', 'المدير التنفيذي لشركة نوفا', 'استراتيجي'],
  [5, 'سما إكبارية', 'SAMA AHMAD IKBARIEH', 'مسؤولة تطهير بيانات الحجوزات وجودتها', 'تشغيلي'],
  [6, 'مرح الشريدة', 'MARAH MONTASER SHRAIDEH', 'مديرة تقييم المخاطر وتسريب البيانات', 'إداري'],
  [7, 'روز النجار', 'ROSE SAMIR F. NAJJAR', 'مديرة التخطيط الاستراتيجي ومراقبة السوق السياحي', 'استراتيجي'],
  [8, 'جود العساف', 'JOUD AHMAD AL-ASSAF', 'مسؤولة استخراج البيانات والنماذج العددية', 'تشغيلي'],
  [9, 'لمار الدويري', 'LAMAR KHALDOUN AL DEWARI', 'مديرة المخزون السياحي ونظام الحجز في الوقت المناسب', 'تشغيلي'],
  [10, 'سلمى الحموز', 'SALMA RIYAD AL-HMOUZ', 'مديرة قواعد البيانات والواجهة الخلفية', 'تشغيلي'],
  [11, 'سارة عطية', 'SARA ZIAD ATIEYH', 'مديرة الشؤون الإدارية والموارد البشرية', 'إداري'],
  [12, 'فرح النتشة', 'FARAH AMER ALI NATSHEH', 'مسؤولة جمع البيانات الأولية للمسافرين', 'تشغيلي'],
  [13, 'ليان الزواهرة', 'LAYAN YAZAN ALZAWAHRA', 'مديرة المجتمعات الرقمية ووسائل التواصل', 'إداري'],
  [14, 'جنى دروزة', "JANA MAH'D FUAD DARWAZEH", 'مسؤولة مصادر البيانات الثانوية وسجل التدقيق', 'تشغيلي'],
  [15, 'ريتال الحيت', 'RITAL MOHAMMAD AL-HEET', 'مسؤولة المدخلات والتحقق من الصحة', 'تشغيلي'],
  [16, 'ملك جودة', 'MALAK MAHDI GOUDA', 'مسؤولة التحليل المالي والتدفق النقدي', 'تشغيلي'],
  [17, 'ديلارا نصير', 'DILARA LUAY NUSIER', 'مديرة أمن الأنظمة واختيار حلول تكنولوجيا المعلومات', 'تشغيلي'],
]

const CASES = [
  [1, 'الضيوف ألغوا رحلة البتراء', 'C', 'الرحلة تطلع بعد إصلاح الشكوى، وتقرير السنة كلها ما يقرر جمعة.'],
  [2, 'المنافس نزل سعر وادي رم', 'B', 'هبوط أسبوع عابر، والحجوزات بالعادة ترجع، فنزول السعر الليلة يكسر الموسم.'],
  [3, 'الضيفة وصلت والفنادق مقفلة', 'A', 'ساعة واحدة مكتوبة في كل رسالة، والضيفة اللي وصلت تتعوّض الليلة.'],
  [4, 'جواز ضيف انتشر والتعليقات اشتعلت', 'B', 'نوقف النشر ونكتب قاعدة. حذف الصورة ما يمسح النسخ المحفوظة.'],
  [5, '12 عائلة تطلب فلوسها', 'C', 'نكلّم العائلات اليوم بلا وعد بمبلغ قبل ما القاعة تقرر.'],
  [6, 'موظف مشى والحساب لسا مفتوح', 'A', 'حساب الموظف الذي خرج يُقفل الليلة، حتى لو تأخر التسكين.'],
  [7, 'الخميس ما في مصاري بالصندوق', 'C', 'خصم صغير على باقة واحدة يحمي مصاري الخميس.'],
  [8, '3 حوادث قبل الظهر', 'B', 'الجواز أخطر من كثرة الإيميلات ومن ظهور الموقع، وأصحابه يُبلَّغون.'],
  [9, 'العائلة وصلت والغرفة انسحبت', 'B', 'العائلة تحتاج سريراً الليلة. مراجعة العقد تصير غداً.'],
  [10, 'بدنا نبيع رحلة غالية وما سألنا الضيف', 'B', 'الرحلة الغالية تحتاج سؤالاً للضيوف الآن، والتقارير القديمة لسؤال آخر.'],
  [11, 'سعر الباقة نزل وما نعرف مين', 'B', 'السجل يحفظ من غيّر السعر ومتى. مسح الليل يضيع الدليل.'],
  [12, 'النموذج قبل الغلط ورفض الضيفة', 'B', 'نفحص التاريخ والعدد ومفتاح البلد، مش بس الخانة الفاضية.'],
  [13, 'نفس الضيف 4 كوبونات', 'B', 'نفس الشخص يُدمج ويأخذ رسالة واحدة قبل إرسال الخصم.'],
  [14, 'الاستقبال ضايع والمدير شايف 15 رقم', 'C', 'المسافر والاستقبال والمدير كل واحد يشوف ما يستطيع فعله الآن.'],
  [15, 'السعر تغيّر وهي عم تدفع', 'B', 'السعر الذي رأته الضيفة يبقى محفوظاً وهي تدفع.'],
  [16, 'العيد خنق الهواتف والتوقع كان جاهز', 'B', 'الرقم الذي لا يدخل جدول المناوبة ما يغيّر قراراً.'],
  [17, 'أداة رخيصة تبي صور الجواز الليلة', 'C', 'صورة الجواز ما تطلع لأداة رخيصة الليلة.'],
  [18, 'المصاري والسمعة في نفس اليوم', 'C', 'حد مكتوب يحمي سمعة الشركة ومصاري الخميس معاً.'],
  [19, 'خبر علني: الشركة سرّبت الجوازات', 'B', 'البيان العلني يقول ما نعرفه فقط، قبل ما يخلص التحقيق.'],
  [20, 'نظام واحد ومشكلتان مفتوحتان', 'B', 'الغرفة التي تُباع غلط أضر من شكوى تتأخر.'],
]

const QUIZZES = [
  [1, 'مين من البنات معنية ترد عليه قبل ما تنتشر الشكوى؟', 'C', 'شكوى الضيف قبل ما تنتشر هي خدمة الضيف.'],
  [2, 'مين تراقب السوق قبل ما يتحول هذا الرقم إلى قرار؟', 'B', 'مراقبة السوق قبل قرار نزول السعر هي التخطيط.'],
  [3, 'مين تحجز الغرفة والمقعد المتاحين هذه اللحظة؟', 'A', 'الغرفة والمقعد المتاحان هذه اللحظة هما المخزون والحجز.'],
  [4, 'مين تجمع من الضيف المعلومة التي لا يذكرها التقرير؟', 'C', 'المعلومة التي لا يذكرها التقرير القديم تُجمع من الضيف.'],
  [5, 'مين تفحص الإدخال وترفض التاريخ المستحيل قبل ما يدخل؟', 'B', 'التاريخ المستحيل يُرفض عند فحص الإدخال.'],
  [6, 'مين تنظّف التكرار والنقص قبل ما تنحفظ البيانات؟', 'A', 'التكرار يُنظَّف قبل ما تنحفظ البيانات.'],
  [7, 'مين تحفظ السعر والحجز كما شافتهما الضيفة؟', 'B', 'السعر الذي رأته الضيفة يبقى محفوظاً وهي تدفع.'],
  [8, 'مين تبيّن كم نقدر ندفع حتى لا نعد الضيف بأكثر من الصندوق؟', 'A', 'كم نقدر ندفع هذا الأسبوع هو الصندوق والتدفق النقدي.'],
  [9, 'مين تقيّم أي بيان أخطر على الضيف، وتحدد من نبلّغ اليوم؟', 'C', 'أخطر بيان، ومين نبلّغ اليوم، هو تقييم الخطر.'],
]

function doGet() {
  return ContentService.createTextOutput('nova-sheet-ok')
}

function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}')
    if (body.token !== TOKEN) return ContentService.createTextOutput('no')
    const lock = LockService.getScriptLock()
    lock.waitLock(15000)
    try {
      writeLog_('السجل', body.records || [], 9)
      writeLog_('النقرات', body.taps || [], 5)
    } finally {
      lock.releaseLock()
    }
    return ContentService.createTextOutput('ok')
  } catch (err) {
    return ContentService.createTextOutput(String(err))
  }
}

function writeLog_(name, rows, width) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(name)
  if (!sheet) return
  const last = Math.max(sheet.getLastRow(), 2)
  if (last > 2) sheet.getRange(3, 1, last - 2, width).clearContent()
  if (!rows.length) return
  const values = rows.map((row) => {
    const copy = row.slice(0, width)
    while (copy.length < width) copy.push('')
    if (name === 'السجل' && copy[8]) copy[8] = new Date(copy[8])
    if (name === 'النقرات' && copy[0]) copy[0] = new Date(copy[0])
    return copy
  })
  sheet.getRange(3, 1, values.length, width).setValues(values)
}

function setupNova() {
  const ss = SpreadsheetApp.getActive()
  const girls = sheet_(ss, 'الطالبات')
  const cases = sheet_(ss, 'الحالات')
  const quizzes = sheet_(ss, 'الاسئلة')
  const log = sheet_(ss, 'السجل')
  const taps = sheet_(ss, 'النقرات')
  const board = sheet_(ss, 'لوحة المعلومات')
  ;[girls, cases, quizzes, log, taps, board].forEach((sheet) => {
    sheet.setRightToLeft(true)
    sheet.clear()
    sheet.getCharts().forEach((chart) => sheet.removeChart(chart))
  })

  girls.getRange(1, 1, 1, 14).setValues([[
    'الرقم', 'الاسم', 'الإنجليزي', 'الوظيفة', 'المستوى',
    'أصوات الحالات', 'صحيحة الحالات', 'أصوات الأسئلة', 'صحيحة الأسئلة',
    'الستار صح', 'مجموع الصحيح', 'متوسط الثواني', 'النقرات', 'الدقة',
  ]])
  GIRLS.forEach((girl, index) => {
    const row = index + 2
    girls.getRange(row, 1, 1, 5).setValues([girl])
    girls.getRange(row, 6, 1, 9).setFormulas([[
      `=COUNTIFS(السجل!$B$3:$B$800,"حالة",السجل!$C$3:$C$800,B${row})`,
      `=COUNTIFS(السجل!$B$3:$B$800,"حالة",السجل!$C$3:$C$800,B${row},السجل!$H$3:$H$800,1)`,
      `=COUNTIFS(السجل!$B$3:$B$800,"سؤال",السجل!$C$3:$C$800,B${row})`,
      `=COUNTIFS(السجل!$B$3:$B$800,"سؤال",السجل!$C$3:$C$800,B${row},السجل!$H$3:$H$800,1)`,
      `=IF(COUNTIFS(السجل!$B$3:$B$800,"ستار",السجل!$C$3:$C$800,B${row})=0,"",COUNTIFS(السجل!$B$3:$B$800,"ستار",السجل!$C$3:$C$800,B${row},السجل!$H$3:$H$800,1))`,
      `=G${row}+I${row}+IF(J${row}="",0,J${row})`,
      `=IF(COUNTIFS(السجل!$C$3:$C$800,B${row},السجل!$G$3:$G$800,">=0")=0,NA(),AVERAGEIFS(السجل!$G$3:$G$800,السجل!$C$3:$C$800,B${row},السجل!$G$3:$G$800,">=0"))`,
      `=COUNTIF(النقرات!$C$3:$C$2000,B${row})`,
      `=IF(F${row}+H${row}=0,NA(),(G${row}+I${row})/(F${row}+H${row}))`,
    ]])
  })
  girls.getRange('N2:N18').setNumberFormat('0%')
  girls.getRange('L2:L18').setNumberFormat('0.0')
  girls.setFrozenRows(1)
  styleHeader_(girls, 14)
  girls.setColumnWidth(2, 140)
  girls.setColumnWidth(3, 220)
  girls.setColumnWidth(4, 280)

  cases.getRange(1, 1, 1, 4).setValues([['رقم الحالة', 'العنوان', 'الأصح', 'السبب']])
  cases.getRange(2, 1, CASES.length, 4).setValues(CASES)
  styleHeader_(cases, 4)
  cases.setFrozenRows(1)
  cases.setColumnWidth(2, 280)
  cases.setColumnWidth(4, 420)

  quizzes.getRange(1, 1, 1, 4).setValues([['رقم السؤال', 'السؤال', 'الأصح', 'السبب']])
  quizzes.getRange(2, 1, QUIZZES.length, 4).setValues(QUIZZES)
  styleHeader_(quizzes, 4)
  quizzes.setFrozenRows(1)
  quizzes.setColumnWidth(2, 420)
  quizzes.setColumnWidth(4, 360)

  log.getRange(1, 1, 2, 9).setValues([
    ['سجل التصويت', '', '', '', '', '', '', '', ''],
    ['المفتاح', 'النوع', 'الاسم', 'رقم الطالبة', 'البند', 'الخيار', 'الثواني', 'صحيحة', 'الوقت'],
  ])
  log.getRange('I3:I800').setNumberFormat('yyyy-mm-dd hh:mm:ss')
  styleHeader_(log, 9, 2)
  log.setFrozenRows(2)
  log.setColumnWidth(5, 160)

  taps.getRange(1, 1, 2, 5).setValues([
    ['سجل النقرات', '', '', '', ''],
    ['الوقت', 'رقم الطالبة', 'الاسم', 'ماذا', 'التفصيل'],
  ])
  taps.getRange('A3:A2000').setNumberFormat('yyyy-mm-dd hh:mm:ss')
  styleHeader_(taps, 5, 2)
  taps.setFrozenRows(2)

  board.getRange('A1').setValue('لوحة المعلومات')
  board.getRange('A2').setValue('تتحدث وحدها مع كل تصويت ونقرة. لا تحتاجي تلصقي شيئاً.')
  board.getRange('A4:B4').setValues([['البند', 'القيمة']])
  const kpis = [
    ['عدد الطالبات', '=COUNTA(الطالبات!B2:B18)'],
    ['أصوات الحالات', '=COUNTIF(السجل!B3:B800,"حالة")'],
    ['أصوات الأسئلة السريعة', '=COUNTIF(السجل!B3:B800,"سؤال")'],
    ['كشف الستار', '=COUNTIF(السجل!B3:B800,"ستار")'],
    ['نقرات الطالبات', '=COUNTA(النقرات!C3:C2000)'],
    ['نسبة الصحة', '=IF(B6+B7=0,"",COUNTIFS(السجل!B3:B800,"<>ستار",السجل!H3:H800,1)/(B6+B7))'],
    ['الأصح', '=IF(MAX(الطالبات!K2:K18)=0,"—",IFERROR(INDEX(الطالبات!B2:B18,MATCH(MAX(الطالبات!K2:K18),الطالبات!K2:K18,0)),"—"))'],
    ['الأسرع', '=IF(COUNT(الطالبات!L2:L18)=0,"—",IFERROR(INDEX(الطالبات!B2:B18,MATCH(MIN(FILTER(الطالبات!L2:L18,ISNUMBER(الطالبات!L2:L18))),الطالبات!L2:L18,0)),"—"))'],
    ['الأدق', '=IF(COUNT(الطالبات!N2:N18)=0,"—",IFERROR(INDEX(الطالبات!B2:B18,MATCH(MAX(FILTER(الطالبات!N2:N18,ISNUMBER(الطالبات!N2:N18))),الطالبات!N2:N18,0)),"—"))'],
    ['الأكثر نقراً', '=IF(MAX(الطالبات!M2:M18)=0,"—",IFERROR(INDEX(الطالبات!B2:B18,MATCH(MAX(الطالبات!M2:M18),الطالبات!M2:M18,0)),"—"))'],
  ]
  board.getRange(5, 1, kpis.length, 2).setValues(kpis)
  board.getRange('B10').setNumberFormat('0%')
  board.getRange('A1').setFontSize(28).setFontWeight('bold').setFontColor('#1c2433')
  board.getRange('A2').setFontColor('#5c6778')
  board.getRange('A4:B4').setBackground('#1c2433').setFontColor('#ffffff').setFontWeight('bold')
  board.getRange('A5:A14').setFontWeight('bold').setFontColor('#0b6a71')
  board.getRange('B5:B14').setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center')
  board.setColumnWidth(1, 180)
  board.setColumnWidth(2, 220)
  board.setHiddenGridlines(true)
  board.setRowHeight(1, 42)

  addChart_(board, 'مجموع الإجابات الصحيحة', 'K2:K18', '#0e7c84', 4, 4)
  addChart_(board, 'الدقة', 'N2:N18', '#c9a227', 4, 9)
  addChart_(board, 'متوسط الثواني — الأقصر أسرع', 'L2:L18', '#e15a4a', 20, 4)
  addChart_(board, 'عدد النقرات', 'M2:M18', '#1c2433', 20, 9)

  const old = ss.getSheetByName('البيانات')
  if (old) old.setRightToLeft(true)
  board.activate()
}

function addChart_(board, title, valueRange, color, row, column) {
  const girls = SpreadsheetApp.getActive().getSheetByName('الطالبات')
  const chart = board.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(girls.getRange('B2:B18'))
    .addRange(girls.getRange(valueRange))
    .setMergeStrategy(Charts.ChartMergeStrategy.MERGE_COLUMNS)
    .setOption('title', title)
    .setOption('legend', { position: 'none' })
    .setOption('colors', [color])
    .setOption('backgroundColor', '#fffaf3')
    .setOption('titleTextStyle', { fontSize: 16, bold: true, color: '#1c2433' })
    .setOption('hAxis', { minValue: 0, textStyle: { fontSize: 11 } })
    .setOption('vAxis', { textStyle: { fontSize: 11 } })
    .setOption('height', 320)
    .setOption('width', 480)
    .setPosition(row, column, 0, 0)
    .build()
  board.insertChart(chart)
}

function sheet_(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name)
}

function styleHeader_(sheet, width, row) {
  const header = row || 1
  sheet.getRange(header, 1, 1, width).setBackground('#1c2433').setFontColor('#ffffff').setFontWeight('bold')
  sheet.setRowHeight(header, 28)
}
