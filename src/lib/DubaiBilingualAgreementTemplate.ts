// Bilingual (EN/AR) "Client Service Agreement" — Dubai branch, operating as
// Commonwealth Migration Group (CMG) / Commonwealth Documents Clearing
// Services, a MARA-registered UAE migration consultancy.
//
// Transcribed verbatim (English) from the signed reference PDF
// ("CMG_Agreement_..._Final_Client Service.pdf") with a professional Arabic
// translation carrying the same legal meaning. Unlike the old Gulf/India
// templates this single file is now the only agreement renderer in the app
// — see renderAgreementForBranch.ts.

const esc = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export interface DubaiAgreementValues {
  agreementNumber: string;
  agreementDate: string;
  agreementExpiry?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  nationality: string;
  passportNumber: string;
  // Accepted for interface compatibility with the shared AgreementLeadData
  // shape (renderAgreementForBranch.ts) — not rendered by this template.
  idNumber?: string;
  programCode?: string;
  programTermSchedule?: string;
  clientId?: string;
  agreementRenewalFee?: string;
  occupation?: string;
  serviceProgram: string;
  destinationCountry: string;
  visaSubclass?: string;
  // Plain formatted numbers (e.g. "9,600") — currency is shown via
  // currencyCode below, not repeated inside the value.
  totalAmount: string;
  initialPayment: string;
  secondPayment: string;
  secondPaymentDue?: string;
  includedDeliverables?: string;
  expressExclusions?: string;
  specialTerms?: string;
  currencyCode?: string;
}

// Fixed branch identity — Commonwealth Migration Group, Dubai.
const COMPANY = {
  nameEn: 'Commonwealth Migration Group',
  nameAr: 'مجموعة كومنولث للهجرة',
  tradingAsEn: 'Commonwealth Documents Clearing Services',
  tradingAsAr: 'خدمات كومنولث لتخليص المستندات',
  addressEn: 'Office 307, 3rd Floor, Business Atrium Building, Oud Metha, Dubai, UAE',
  addressAr: 'مكتب 307، الطابق الثالث، مبنى بزنس أتريوم، عود ميثاء، دبي، الإمارات العربية المتحدة',
  regulatoryEn: 'MARA-registered migration consultancy, UAE-based ("CMG / the Company")',
  regulatoryAr: 'شركة استشارات هجرة مسجلة لدى هيئة MARA ومقرها دولة الإمارات العربية المتحدة ("CMG" أو "الشركة")',
  contactEn: 'leads@cwmigrationgroup.ae | cwmigrationgroup.ae',
  contactAr: 'leads@cwmigrationgroup.ae | cwmigrationgroup.ae',
  currencyCode: 'AED',
};

// The 14 clauses, verbatim (English) from the signed PDF, in its own order/numbering.
const clauses: Array<[string, string[], string, string[]]> = [
  ['1. DEFINITIONS AND INTERPRETATION', [
    '1.1 "CMG" means Commonwealth Migration Group, its officers, employees, agents, and authorised representatives.',
    '1.2 "Client" means the individual named in this Agreement who has engaged CMG for migration consultancy services.',
    '1.3 "Services" means only the immigration consultancy services specified in Annexure A.',
    '1.4 "Retainer Fee" means the professional fees payable to CMG as detailed in Annexure A.',
    '1.5 "Government / Authority Fees" means all fees payable to the Department of Home Affairs, Skills Assessment Authorities, or any government body. These are excluded from the Retainer Fee and are the Client’s sole responsibility.',
  ], '1. التعريفات والتفسير', [
    '1.1 تعني "CMG" مجموعة كومنولث للهجرة وموظفيها ومسؤوليها ووكلائها وممثليها المعتمدين.',
    '1.2 يعني "العميل" الشخص المحدد اسمه في هذه الاتفاقية والذي استعان بـ CMG للحصول على خدمات استشارات الهجرة.',
    '1.3 تعني "الخدمات" حصرًا خدمات استشارات الهجرة المحددة في الملحق أ.',
    '1.4 تعني "رسوم الاحتجاز" الأتعاب المهنية المستحقة لـ CMG كما هو مفصل في الملحق أ.',
    '1.5 تعني "رسوم الحكومة / الجهات المختصة" جميع الرسوم المستحقة لوزارة الشؤون الداخلية أو هيئات تقييم المهارات أو أي جهة حكومية. وهذه الرسوم مستثناة من رسوم الاحتجاز وتقع على عاتق العميل وحده.',
  ]],
  ['2. SCOPE OF SERVICES', [
    '2.1 CMG agrees to provide only the Services specified in Annexure A. Services are strictly limited to migration consultancy and do not include legal representation or legal advice.',
    '2.2 Any services beyond the scope of Annexure A require a separate written agreement and additional fees.',
    '2.3 CMG may engage third-party agents or assessors to fulfil part of the Services. The Client consents to sharing their information with such third parties.',
  ], '2. نطاق الخدمات', [
    '2.1 توافق CMG على تقديم الخدمات المحددة في الملحق أ فقط. وتقتصر الخدمات حصرًا على الاستشارات المتعلقة بالهجرة ولا تشمل التمثيل القانوني أو المشورة القانونية.',
    '2.2 أي خدمات تتجاوز نطاق الملحق أ تستلزم اتفاقية مكتوبة منفصلة ورسومًا إضافية.',
    '2.3 يجوز لـ CMG الاستعانة بوكلاء أو مقيّمين من أطراف ثالثة لتنفيذ جزء من الخدمات، ويوافق العميل على مشاركة معلوماته مع هذه الأطراف الثالثة.',
  ]],
  ['3. NO GUARANTEE OF OUTCOME', [
    '3.1 CMG DOES NOT GUARANTEE, REPRESENT, OR WARRANT THE SUCCESS, APPROVAL, OR POSITIVE OUTCOME OF ANY VISA APPLICATION, SKILLS ASSESSMENT, OR IMMIGRATION PROCESS.',
    '3.2 All decisions are made solely by the relevant Authorities. CMG has no influence over Authority decisions and accepts no liability for them.',
    '3.3 CMG is not liable for any changes in immigration laws, policies, occupation lists, invitation scores, or processing times.',
    '3.4 An unsuccessful outcome does not entitle the Client to any refund except as stated in Clause 6.',
    '3.5 No verbal or written representation made by any CMG employee outside this Agreement constitutes a guarantee of outcome. The Client agrees not to rely on any such representation.',
  ], '3. عدم ضمان النتائج', [
    '3.1 لا تضمن CMG ولا تقر ولا تكفل نجاح أو الموافقة على أو تحقيق نتيجة إيجابية لأي طلب تأشيرة أو تقييم مهارات أو إجراء هجرة.',
    '3.2 تُتخذ جميع القرارات حصرًا من قبل الجهات المختصة ذات الصلة، ولا تملك CMG أي تأثير على قرارات هذه الجهات ولا تتحمل أي مسؤولية عنها.',
    '3.3 لا تتحمل CMG مسؤولية أي تغييرات في قوانين أو سياسات الهجرة، أو قوائم المهن، أو درجات الدعوة، أو مدد المعالجة.',
    '3.4 لا تخول النتيجة غير الناجحة العميل الحق في أي استرداد إلا وفق ما هو منصوص عليه في البند 6.',
    '3.5 لا يشكل أي تصريح شفهي أو كتابي يصدر عن أي موظف لدى CMG خارج نطاق هذه الاتفاقية ضمانًا لأي نتيجة، ويوافق العميل على عدم الاعتماد على أي تصريح من هذا القبيل.',
  ]],
  ['4. CLIENT OBLIGATIONS AND REPRESENTATIONS', [
    '4.1 The Client warrants that all information and documents provided to CMG are true, accurate, complete, and not misleading. The Client accepts full responsibility for the accuracy of all submissions.',
    '4.2 The Client shall promptly provide all documents and information requested. Any delay by the Client that adversely affects the application is the Client’s sole responsibility.',
    '4.3 The Client shall NOT contact any immigration authority directly without prior written approval from CMG during this Agreement.',
    '4.4 The Client shall maintain respectful conduct with all CMG employees. Abusive or inappropriate conduct constitutes a material breach and may result in immediate termination without refund.',
    '4.5 The Client shall not provide false, fraudulent, or forged documents. CMG has a duty to report fraudulent documents to the Authorities.',
    '4.6 The Client shall not take actions — such as resigning from employment or making financial commitments — in anticipation of a visa grant. CMG accepts no liability for such actions.',
  ], '4. التزامات العميل وإقراراته', [
    '4.1 يقر العميل بأن جميع المعلومات والمستندات المقدمة إلى CMG صحيحة ودقيقة وكاملة وغير مضللة، ويتحمل العميل المسؤولية الكاملة عن دقة جميع المستندات المقدمة.',
    '4.2 يجب على العميل تقديم جميع المستندات والمعلومات المطلوبة فور طلبها. وأي تأخر من جانب العميل يؤثر سلبًا على الطلب يقع على عاتقه وحده.',
    '4.3 لا يجوز للعميل التواصل مع أي جهة هجرة مباشرة دون الحصول على موافقة كتابية مسبقة من CMG طوال مدة هذه الاتفاقية.',
    '4.4 يلتزم العميل بالتعامل باحترام مع جميع موظفي CMG. ويُعد أي سلوك مسيء أو غير لائق إخلالًا جوهريًا قد يؤدي إلى إنهاء فوري للاتفاقية دون استرداد.',
    '4.5 لا يجوز للعميل تقديم مستندات كاذبة أو احتيالية أو مزورة. وتلتزم CMG بالإبلاغ عن أي مستندات احتيالية إلى الجهات المختصة.',
    '4.6 لا يجوز للعميل اتخاذ إجراءات — مثل الاستقالة من العمل أو الالتزام بتعهدات مالية — تحسبًا للحصول على تأشيرة. ولا تتحمل CMG أي مسؤولية عن مثل هذه الإجراءات.',
  ]],
  ['5. FEES AND PAYMENT', [
    '5.1 The Client agrees to pay the Retainer Fee per the schedule in Annexure A.',
    '5.2 All Government / Authority fees are entirely the Client’s responsibility and are not covered by this Agreement.',
    '5.3 Non-payment of any instalment may result in immediate suspension or termination of Services without notice or refund.',
    '5.4 CMG may withhold submission of any application until all outstanding fees are paid.',
    '5.5 Any amount not paid within 7 days of its due date shall accrue interest at the rate of 1.5% per month (or the maximum rate permitted by UAE law, whichever is lower) from the due date until the date of actual payment.',
    '5.6 In the event CMG engages legal counsel or a debt recovery agency to recover outstanding amounts, all associated costs — including legal fees, court fees, and collection charges — shall be borne entirely by the Client.',
    '5.7 Any payment plan agreed verbally or in writing must be honoured in full. Failure to adhere to an agreed payment plan constitutes a material breach of this Agreement.',
  ], '5. الرسوم والدفع', [
    '5.1 يوافق العميل على سداد رسوم الاحتجاز وفق الجدول الزمني المحدد في الملحق أ.',
    '5.2 تقع جميع رسوم الحكومة / الجهات المختصة على عاتق العميل وحده وهي غير مشمولة بهذه الاتفاقية.',
    '5.3 قد يؤدي عدم سداد أي قسط إلى تعليق أو إنهاء فوري للخدمات دون إشعار أو استرداد.',
    '5.4 يجوز لـ CMG تأجيل تقديم أي طلب إلى حين سداد جميع الرسوم المستحقة.',
    '5.5 يستحق على أي مبلغ لم يُسدد خلال 7 أيام من تاريخ استحقاقه فائدة تأخيرية بمعدل 1.5% شهريًا (أو الحد الأقصى الذي يسمح به القانون الإماراتي، أيهما أدنى) من تاريخ الاستحقاق وحتى تاريخ السداد الفعلي.',
    '5.6 في حال اضطرار CMG إلى الاستعانة بمستشار قانوني أو وكالة تحصيل ديون لاسترداد مبالغ مستحقة، تقع جميع التكاليف المرتبطة بذلك — بما في ذلك أتعاب المحاماة ورسوم المحكمة وتكاليف التحصيل — على عاتق العميل وحده.',
    '5.7 يجب الوفاء الكامل بأي خطة سداد متفق عليها شفهيًا أو كتابيًا. ويُعد الإخفاق في الالتزام بخطة السداد المتفق عليها إخلالًا جوهريًا بهذه الاتفاقية.',
  ]],
  ['6. REFUND POLICY', [
    '6.1 ALL FEES ARE STRICTLY NON-REFUNDABLE, except as expressly stated in this Clause.',
    '6.2 Non-refundable in all circumstances: registration/administration fees; fees for work performed; instalment payments; fees where the application is refused by any Authority; fees on termination due to Client breach; fees on Client’s voluntary termination; fees where Client provides false documents; fees on Client misconduct.',
    '6.3 A partial refund may be considered, at CMG’s sole discretion, only where CMG has been wholly unable to commence any services due to a reason solely attributable to CMG.',
    '6.4 No refund applies in the event of Force Majeure or the death of any person.',
    '6.5 The cooling-off period does not apply once any assessment or advice has been provided.',
  ], '6. سياسة الاسترداد', [
    '6.1 جميع الرسوم غير قابلة للاسترداد بصورة قاطعة، إلا وفق ما هو منصوص عليه صراحة في هذا البند.',
    '6.2 غير قابل للاسترداد في جميع الأحوال: رسوم التسجيل/الإدارة؛ رسوم الأعمال المنجزة؛ دفعات الأقساط؛ الرسوم في حال رفض الطلب من قبل أي جهة مختصة؛ الرسوم عند الإنهاء بسبب إخلال العميل؛ الرسوم عند الإنهاء الطوعي من قبل العميل؛ الرسوم في حال تقديم العميل مستندات كاذبة؛ الرسوم في حال سوء سلوك العميل.',
    '6.3 يجوز النظر في استرداد جزئي، وفق التقدير المطلق لـ CMG، فقط في حال عجز CMG الكامل عن بدء أي خدمات لسبب يعود بالكامل إلى CMG.',
    '6.4 لا ينطبق أي استرداد في حالات القوة القاهرة أو وفاة أي شخص.',
    '6.5 لا تسري فترة التراجع بعد تقديم أي تقييم أو مشورة.',
  ]],
  ['7. LIMITATION OF LIABILITY', [
    '7.1 TO THE MAXIMUM EXTENT PERMITTED BY LAW, CMG SHALL NOT BE LIABLE FOR: any Authority decision; changes in law or policy; inaccurate information provided by the Client; Client’s delay in providing documents; Client’s unauthorised contact with Authorities; Client’s actions taken in anticipation of a visa; Force Majeure Events; or reliance on representations outside this Agreement.',
    '7.2 CMG’s maximum aggregate liability shall not exceed the total Retainer Fee actually paid by the Client.',
  ], '7. تحديد المسؤولية', [
    '7.1 إلى أقصى حد يسمح به القانون، لا تتحمل CMG المسؤولية عن: أي قرار صادر عن جهة مختصة؛ التغييرات في القانون أو السياسة؛ المعلومات غير الدقيقة المقدمة من العميل؛ تأخر العميل في تقديم المستندات؛ تواصل العميل غير المصرح به مع الجهات المختصة؛ إجراءات العميل المتخذة تحسبًا للحصول على تأشيرة؛ أحداث القوة القاهرة؛ أو الاعتماد على تصريحات خارج نطاق هذه الاتفاقية.',
    '7.2 لا تتجاوز المسؤولية الإجمالية القصوى لـ CMG إجمالي رسوم الاحتجاز التي سددها العميل فعليًا.',
  ]],
  ['8. CONFIDENTIALITY AND DATA PROTECTION', [
    '8.1 Both parties agree to maintain the confidentiality of all information received under this Agreement. Confidential Information shall not be disclosed without prior written consent, except as required by law.',
    '8.2 The Client consents to CMG sharing their personal information with third parties as necessary to provide the Services (e.g., skills assessment bodies, Department of Home Affairs, nomination authorities).',
    '8.3 The Client releases CMG from all liability arising from electronic communications interception or delivery failure, provided CMG uses reasonable security measures.',
    '8.4 CMG processes the Client’s personal data in accordance with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL) and any applicable regulations thereunder. The Client’s data is collected and processed solely for the purpose of providing the Services and fulfilling CMG’s regulatory and legal obligations.',
    '8.5 The Client has the right to request access to, correction of, or deletion of their personal data, subject to CMG’s legal obligations to retain records. Such requests shall be made in writing to operations@cwmigrationgroup.ae.',
    '8.6 CMG implements reasonable technical and organisational security measures to protect the Client’s personal data against unauthorised access, loss, or disclosure.',
  ], '8. السرية وحماية البيانات', [
    '8.1 يتفق الطرفان على الحفاظ على سرية جميع المعلومات المتلقاة بموجب هذه الاتفاقية. ولا يجوز الإفصاح عن المعلومات السرية دون موافقة كتابية مسبقة، إلا وفق ما يقتضيه القانون.',
    '8.2 يوافق العميل على مشاركة CMG لمعلوماته الشخصية مع أطراف ثالثة بالقدر اللازم لتقديم الخدمات (مثل هيئات تقييم المهارات، ووزارة الشؤون الداخلية، وجهات الترشيح).',
    '8.3 يُعفي العميل CMG من أي مسؤولية ناشئة عن اعتراض الاتصالات الإلكترونية أو فشل تسليمها، شريطة أن تتخذ CMG تدابير أمنية معقولة.',
    '8.4 تعالج CMG بيانات العميل الشخصية وفقًا للمرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية (PDPL) وأي لوائح تنفيذية سارية بموجبه. ويتم جمع بيانات العميل ومعالجتها حصرًا لغرض تقديم الخدمات والوفاء بالتزامات CMG التنظيمية والقانونية.',
    '8.5 يحق للعميل طلب الاطلاع على بياناته الشخصية أو تصحيحها أو حذفها، مع مراعاة التزامات CMG القانونية بالاحتفاظ بالسجلات. وتُقدَّم هذه الطلبات كتابةً إلى operations@cwmigrationgroup.ae.',
    '8.6 تطبق CMG تدابير أمنية تقنية وتنظيمية معقولة لحماية بيانات العميل الشخصية من الوصول غير المصرح به أو الفقدان أو الإفصاح.',
  ]],
  ['9. INDEMNIFICATION', [
    '9.1 The Client shall indemnify, defend, and hold harmless CMG, its officers, employees, agents, and authorised representatives (collectively "Indemnified Parties") from and against any and all claims, demands, losses, damages, liabilities, costs, and expenses (including reasonable legal fees) arising out of or in connection with: (a) any false, misleading, incomplete, or fraudulent information or documents provided by the Client to CMG or any Authority; (b) any breach by the Client of this Agreement; (c) any action taken by the Client in anticipation of a visa grant, skills assessment outcome, or other immigration result; (d) any unauthorised direct contact by the Client with any immigration authority, government body, or third party in connection with the Services; (e) any complaint, claim, or report filed by the Client with any regulatory authority, licensing body, or government agency that results in any investigation, suspension, cancellation, or restriction of CMG’s MARA registration, business licence, or operational capacity.',
    '9.2 Without limiting Clause 9.1(e), if any action or complaint by the Client — whether filed directly or facilitated through a third party — results in the suspension, cancellation, or restriction of CMG’s MARA registration or any operating licence, the Client shall be liable to CMG for all direct and consequential losses during the period of suspension or restriction, including but not limited to: (a) lost revenue and loss of business opportunities; (b) costs of legal representation in any regulatory proceedings; (c) reputational and operational rehabilitation costs.',
    '9.3 This indemnification obligation shall survive the termination or expiry of this Agreement.',
    '9.4 CMG shall notify the Client promptly upon becoming aware of any claim or potential claim to which this Clause applies, and the Client shall cooperate fully with CMG in the defence of any such claim.',
  ], '9. التعويض', [
    '9.1 يلتزم العميل بتعويض CMG ومسؤوليها وموظفيها ووكلائها وممثليها المعتمدين ("الأطراف المُعوَّضة") والدفاع عنهم وإبراء ذمتهم من وضد جميع المطالبات والطلبات والخسائر والأضرار والمسؤوليات والتكاليف والمصاريف (بما في ذلك أتعاب المحاماة المعقولة) الناشئة عن أو المرتبطة بـ: (أ) أي معلومات أو مستندات كاذبة أو مضللة أو ناقصة أو احتيالية يقدمها العميل إلى CMG أو أي جهة مختصة؛ (ب) أي إخلال من العميل بهذه الاتفاقية؛ (ج) أي إجراء يتخذه العميل تحسبًا للحصول على تأشيرة، أو نتيجة تقييم مهارات، أو أي نتيجة هجرة أخرى؛ (د) أي تواصل مباشر غير مصرح به من العميل مع أي جهة هجرة أو جهة حكومية أو طرف ثالث فيما يتعلق بالخدمات؛ (هـ) أي شكوى أو مطالبة أو بلاغ يقدمه العميل إلى أي جهة تنظيمية أو هيئة ترخيص أو جهة حكومية يؤدي إلى أي تحقيق أو تعليق أو إلغاء أو تقييد لتسجيل CMG لدى MARA أو رخصتها التجارية أو قدرتها التشغيلية.',
    '9.2 دون الإخلال بعمومية البند 9.1(هـ)، إذا أدى أي إجراء أو شكوى من العميل — سواء قُدمت مباشرة أو من خلال طرف ثالث — إلى تعليق أو إلغاء أو تقييد تسجيل CMG لدى MARA أو أي رخصة تشغيلية، يكون العميل مسؤولًا تجاه CMG عن جميع الخسائر المباشرة والتبعية خلال فترة التعليق أو التقييد، بما في ذلك على سبيل المثال لا الحصر: (أ) الإيرادات المفقودة وفرص الأعمال الضائعة؛ (ب) تكاليف التمثيل القانوني في أي إجراءات تنظيمية؛ (ج) تكاليف إعادة التأهيل السمعي والتشغيلي.',
    '9.3 يظل التزام التعويض هذا ساريًا بعد إنهاء هذه الاتفاقية أو انقضائها.',
    '9.4 تُخطر CMG العميل فور علمها بأي مطالبة أو مطالبة محتملة تنطبق عليها أحكام هذا البند، ويتعاون العميل تعاونًا كاملًا مع CMG في الدفاع عن أي مطالبة من هذا القبيل.',
  ]],
  ['10. TERM AND TERMINATION', [
    '10.1 This Agreement commences on the date of signing and remains in force until Services are completed or until terminated.',
    '10.2 Either party may terminate with 15 days’ written notice by email.',
    '10.3 CMG may terminate immediately without notice for: non-payment; provision of false documents; material breach; Client misconduct; or engaging another agent without consent.',
    '10.4 Upon termination: all CMG obligations cease; no refund is due except per Clause 6; the Client remains liable for outstanding fees.',
    '10.5 This Agreement expires automatically after 12 months unless extended in writing.',
  ], '10. مدة الاتفاقية وإنهاؤها', [
    '10.1 تسري هذه الاتفاقية اعتبارًا من تاريخ التوقيع وتظل نافذة حتى إتمام الخدمات أو حتى إنهائها.',
    '10.2 يحق لأي من الطرفين إنهاء الاتفاقية بإشعار كتابي مدته 15 يومًا عبر البريد الإلكتروني.',
    '10.3 يحق لـ CMG إنهاء الاتفاقية فورًا ودون إشعار في الحالات التالية: عدم السداد؛ تقديم مستندات مزورة؛ الإخلال الجوهري؛ سوء سلوك العميل؛ أو الاستعانة بوكيل آخر دون موافقة.',
    '10.4 عند الإنهاء: تنتهي جميع التزامات CMG؛ ولا يستحق أي استرداد إلا وفق البند 6؛ ويظل العميل مسؤولًا عن أي رسوم مستحقة.',
    '10.5 تنتهي هذه الاتفاقية تلقائيًا بعد 12 شهرًا ما لم يتم تمديدها كتابيًا.',
  ]],
  ['11. SOCIAL MEDIA, REVIEWS, AND DEFAMATION', [
    '11.1 The Client acknowledges that freedom of expression does not extend to the publication of false, defamatory, misleading, or malicious content. The Client agrees not to publish or cause to be published, on any platform (including but not limited to Google, social media, review sites, or messaging applications), any content about CMG or its employees that is: (a) factually false or misleading; (b) defamatory or injurious to CMG’s reputation; (c) malicious, abusive, or designed to harass or intimidate; or (d) calculated to cause commercial harm to CMG without factual basis.',
    '11.2 Legitimate grievances shall be addressed exclusively through the dispute resolution mechanism set out in Clause 13. The Client agrees to exhaust the dispute resolution process before making any public statement about CMG in connection with a dispute arising from this Agreement.',
    '11.3 CMG reserves the right to seek injunctive relief, damages, and all available remedies under UAE Federal Law No. 34 of 2021 on Combating Rumours and Cybercrime, UAE Federal Decree-Law No. 31 of 2021 (Penal Code), and applicable defamation laws in any relevant jurisdiction (including Australian law) for any breach of this Clause.',
    '11.4 Nothing in this Clause prevents the Client from making truthful, factual, and non-malicious statements about their experience with CMG in good faith, provided such statements are not designed to cause harm and the Client has first followed the dispute resolution process under Clause 13.',
  ], '11. وسائل التواصل الاجتماعي والمراجعات والتشهير', [
    '11.1 يقر العميل بأن حرية التعبير لا تمتد لتشمل نشر محتوى كاذب أو تشهيري أو مضلل أو كيدي. ويوافق العميل على عدم نشر أو التسبب في نشر أي محتوى عن CMG أو موظفيها، على أي منصة (بما في ذلك على سبيل المثال لا الحصر جوجل، ووسائل التواصل الاجتماعي، ومواقع المراجعات، وتطبيقات المراسلة)، يكون: (أ) كاذبًا أو مضللًا من الناحية الواقعية؛ (ب) تشهيريًا أو مسيئًا لسمعة CMG؛ (ج) كيديًا أو مسيئًا أو مصممًا للتحرش أو التخويف؛ أو (د) يهدف إلى إلحاق ضرر تجاري بـ CMG دون أساس واقعي.',
    '11.2 تُعالَج الشكاوى المشروعة حصرًا من خلال آلية تسوية المنازعات المنصوص عليها في البند 13. ويوافق العميل على استنفاد إجراءات تسوية المنازعات قبل الإدلاء بأي تصريح علني بشأن CMG فيما يتعلق بأي نزاع ناشئ عن هذه الاتفاقية.',
    '11.3 تحتفظ CMG بحقها في طلب الإنصاف القضائي العاجل والتعويضات وجميع سبل الانتصاف المتاحة بموجب القانون الاتحادي رقم 34 لسنة 2021 بشأن مكافحة الشائعات والجرائم الإلكترونية، والمرسوم بقانون اتحادي رقم 31 لسنة 2021 (قانون العقوبات)، وقوانين التشهير المعمول بها في أي اختصاص قضائي ذي صلة (بما في ذلك القانون الأسترالي) عن أي إخلال بهذا البند.',
    '11.4 لا يحول هذا البند دون قيام العميل بالإدلاء بتصريحات صادقة وواقعية وغير كيدية عن تجربته مع CMG بحسن نية، شريطة ألا تهدف هذه التصريحات إلى التسبب في ضرر وأن يكون العميل قد اتبع أولًا إجراءات تسوية المنازعات المنصوص عليها في البند 13.',
  ]],
  ['12. FORCE MAJEURE', [
    '12.1 Neither party is liable for failure to perform obligations caused by events beyond their reasonable control, including acts of God, war, government restrictions, pandemics, or infrastructure failures ("Force Majeure Event").',
    '12.2 If a Force Majeure Event continues for more than 90 days, either party may terminate this Agreement. No refund applies in Force Majeure circumstances.',
  ], '12. القوة القاهرة', [
    '12.1 لا يتحمل أي من الطرفين مسؤولية الإخفاق في الوفاء بالتزاماته الناتج عن أحداث خارجة عن إرادته المعقولة، بما في ذلك الكوارث الطبيعية، والحروب، والقيود الحكومية، والأوبئة، أو أعطال البنية التحتية ("حدث القوة القاهرة").',
    '12.2 إذا استمر حدث القوة القاهرة لأكثر من 90 يومًا، يحق لأي من الطرفين إنهاء هذه الاتفاقية. ولا ينطبق أي استرداد في ظروف القوة القاهرة.',
  ]],
  ['13. GOVERNING LAW AND DISPUTE RESOLUTION', [
    '13.1 This Agreement is governed by the laws of the United Arab Emirates, specifically the laws applicable in the Emirate of Dubai.',
    '13.2 Disputes shall first be addressed through good-faith negotiations within 21 days of written notice.',
    '13.3 Unresolved disputes shall be referred to arbitration under the Dubai International Arbitration Centre (DIAC) Rules, with the seat of arbitration in Dubai. The arbitral award shall be final and binding.',
    '13.4 CMG reserves the right to seek urgent injunctive relief from any competent court.',
  ], '13. القانون الحاكم وتسوية المنازعات', [
    '13.1 تخضع هذه الاتفاقية لقوانين دولة الإمارات العربية المتحدة، وتحديدًا القوانين السارية في إمارة دبي.',
    '13.2 تُعالَج المنازعات أولًا من خلال مفاوضات بحسن نية خلال 21 يومًا من تاريخ الإشعار الكتابي.',
    '13.3 تُحال المنازعات غير المحلولة إلى التحكيم وفقًا لقواعد مركز دبي الدولي للتحكيم (DIAC)، على أن يكون مقر التحكيم في دبي. ويكون قرار التحكيم نهائيًا وملزمًا للطرفين.',
    '13.4 تحتفظ CMG بحقها في طلب الإنصاف القضائي العاجل من أي محكمة مختصة.',
  ]],
  ['14. GENERAL PROVISIONS', [
    '14.1 Entire Agreement: This Agreement supersedes all prior representations, negotiations, and commitments, whether oral or written.',
    '14.2 Amendments: Amendments require a written instrument signed by both parties.',
    '14.3 Severability: If any provision is found invalid, the remaining provisions continue in force.',
    '14.4 By signing this Agreement, the Client confirms they have read, understood, and agree to be bound by all terms and conditions.',
  ], '14. أحكام عامة', [
    '14.1 الاتفاقية الكاملة: تحل هذه الاتفاقية محل جميع التصريحات والمفاوضات والالتزامات السابقة، سواء كانت شفهية أو كتابية.',
    '14.2 التعديلات: تستلزم أي تعديلات وثيقة كتابية موقعة من الطرفين.',
    '14.3 قابلية الفصل: إذا تبين بطلان أي حكم من أحكام هذه الاتفاقية، تظل الأحكام المتبقية سارية المفعول.',
    '14.4 بتوقيع هذه الاتفاقية، يقر العميل بأنه قرأ وفهم جميع الشروط والأحكام ويوافق على الالتزام بها.',
  ]],
];

const textOrBlank = (value: unknown, fallback = '________________') => {
  const result = String(value ?? '').trim();
  return result || fallback;
};

// ── Bilingual section header bar (dark navy, EN left / AR right) ──────────
const sectionHeader = (englishTitle: string, arabicTitle: string) => `<div class="cmg-section-header">
  <span class="en">${esc(englishTitle)}</span>
  <span class="ar" dir="rtl" lang="ar">${esc(arabicTitle)}</span>
</div>`;

// ── One striped label:value row, EN left cell / AR right cell ─────────────
const row = (labelEn: string, value: string, labelAr: string, arValue?: string) => `<div class="cmg-row">
  <div class="en"><strong>${esc(labelEn)}:</strong> ${esc(value)}</div>
  <div class="ar" dir="rtl" lang="ar"><strong>${esc(labelAr)}:</strong> ${esc(arValue ?? value)}</div>
</div>`;

// ── A section: header bar + its striped rows, kept together ───────────────
const section = (englishTitle: string, arabicTitle: string, rows: string) =>
  `<section class="cmg-block">${sectionHeader(englishTitle, arabicTitle)}<div class="cmg-rows">${rows}</div></section>`;

// ── One clause: header bar + one striped row per sub-clause sentence ──────
const clauseSection = (englishTitle: string, english: string[], arabicTitle: string, arabic: string[]) => {
  const rows = english.map((en, i) => `<div class="cmg-row">
    <div class="en">${esc(en)}</div>
    <div class="ar" dir="rtl" lang="ar">${esc(arabic[i] ?? '')}</div>
  </div>`).join('');
  return `<section class="cmg-block cmg-clause">${sectionHeader(englishTitle, arabicTitle)}<div class="cmg-rows">${rows}</div></section>`;
};

const paragraph = (englishTitle: string, english: string, arabicTitle: string, arabic: string) =>
  `<section class="cmg-block cmg-clause">${sectionHeader(englishTitle, arabicTitle)}<div class="cmg-rows"><div class="cmg-row"><div class="en">${esc(english)}</div><div class="ar" dir="rtl" lang="ar">${esc(arabic)}</div></div></div></section>`;

export function renderDubaiAgreement(v: DubaiAgreementValues): string {
  const currencyCode = v.currencyCode || COMPANY.currencyCode;
  const agreementNumber = textOrBlank(v.agreementNumber);
  const agreementDate = textOrBlank(v.agreementDate);
  const clientName = textOrBlank(v.clientName);
  const nationality = textOrBlank(v.nationality);
  const passportNumber = textOrBlank(v.passportNumber);
  const clientPhone = textOrBlank(v.clientPhone);
  const clientEmail = textOrBlank(v.clientEmail);
  const occupation = textOrBlank(v.occupation, 'N/A');
  const serviceProgram = textOrBlank(v.serviceProgram);
  const destinationCountry = textOrBlank(v.destinationCountry);
  const visaSubclass = textOrBlank(v.visaSubclass, 'To be confirmed based on the applicable occupation/points assessment');
  const totalAmount = textOrBlank(v.totalAmount);
  const initialPayment = textOrBlank(v.initialPayment);
  const secondPayment = textOrBlank(v.secondPayment);
  const secondPaymentDue = textOrBlank(v.secondPaymentDue, 'As per Annexure A');
  const includedDeliverables = textOrBlank(v.includedDeliverables, 'As selected for the Service Program above');
  const expressExclusions = textOrBlank(v.expressExclusions, 'Legal representation; services not listed above');
  const specialTerms = textOrBlank(v.specialTerms, 'None');

  const clauseHtml = clauses.map(([enTitle, enBody, arTitle, arBody]) =>
    clauseSection(enTitle, enBody, arTitle, arBody)).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Client Service Agreement ${esc(agreementNumber)}</title>
  <style>
    @page { size: A4; margin: 10mm 8mm 14mm; }
    * { box-sizing: border-box; }
    :root {
      --navy: #0f2a4a;
      --navy-dark: #0a1e38;
      --border: #9fb0c8;
      --stripe: #eaf0f9;
      --red: #c1272d;
    }
    html, body {
      margin: 0; padding: 0;
      background: #fff;
      color: #14213d;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5px;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .document { width: 100%; max-width: 8.27in; margin: 0 auto; }

    /* ── letterhead ── */
    .letterhead {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 3px solid var(--navy);
      padding-bottom: 8px;
      margin-bottom: 6px;
    }
    .letterhead .en, .letterhead .ar { padding: 0 6px; }
    .letterhead .ar { text-align: right; font-family: Tahoma, Arial, sans-serif; }
    .letterhead .company-name { font-size: 15px; font-weight: 800; color: var(--navy); }
    .letterhead .trading-as { font-size: 9.5px; color: #445; margin-top: 1px; }
    .letterhead .addr { font-size: 9px; color: #556; margin-top: 3px; }

    .title-bar {
      background: var(--navy);
      color: #fff;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 7px 10px;
      margin-bottom: 8px;
      font-weight: 800;
      font-size: 12px;
      letter-spacing: .3px;
    }
    .title-bar .ar { text-align: right; font-family: Tahoma, Arial, sans-serif; }

    /* ── generic bilingual block ── */
    .cmg-block { border: 1px solid var(--border); margin-bottom: 7px; break-inside: avoid; page-break-inside: avoid; }
    .cmg-section-header {
      background: var(--navy);
      color: #fff;
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 5px 10px;
      font-weight: 700;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: .2px;
    }
    .cmg-section-header .ar { text-align: right; font-family: Tahoma, Arial, sans-serif; text-transform: none; }
    .cmg-rows > .cmg-row:nth-child(odd) { background: var(--stripe); }
    .cmg-row { display: grid; grid-template-columns: 1fr 1fr; }
    .cmg-row .en, .cmg-row .ar { padding: 5px 10px; }
    .cmg-row .en { border-right: 1px solid var(--border); }
    .cmg-row .ar { text-align: right; font-family: Tahoma, Arial, sans-serif; font-size: 10.3px; line-height: 1.6; }
    .cmg-clause .cmg-row .en, .cmg-clause .cmg-row .ar { padding: 6px 10px; }

    .important-note {
      border: 1.5px solid var(--red);
      background: #fdecec;
      color: var(--red);
      font-weight: 700;
      padding: 6px 10px;
      margin-bottom: 8px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      font-size: 10px;
    }
    .important-note .ar { text-align: right; font-family: Tahoma, Arial, sans-serif; }

    .preamble p { margin: 0 0 6px; }
    .preamble p:last-child { margin-bottom: 0; }

    .annexure-title {
      background: #e5e7eb;
      border: 1px solid var(--border);
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 7px 10px;
      font-weight: 800;
      font-size: 11.5px;
      text-transform: uppercase;
      margin: 10px 0 7px;
    }
    .annexure-title .ar { text-align: right; font-family: Tahoma, Arial, sans-serif; text-transform: none; }

    .signature-block { margin-top: 8px; }
    .signature-block .cmg-row .en, .signature-block .cmg-row .ar { padding: 10px; min-height: 46px; }

    .print-footer {
      position: fixed;
      left: 8mm; right: 8mm; bottom: 4mm;
      display: flex; justify-content: space-between;
      color: #667; font-size: 8px;
    }
    .page-number::after { content: counter(page); }

    @media screen {
      body { background: #eef0f3; padding: 14px 0; }
      .document { background: #fff; padding: 10mm 8mm 14mm; box-shadow: 0 2px 12px rgba(0,0,0,.12); }
      .print-footer { position: static; margin-top: 10px; }
    }
    @media print { .document { padding: 0; } .print-footer { position: fixed; } }
    @media (max-width: 700px) {
      html, body { font-size: 11px; }
      .letterhead, .title-bar, .cmg-section-header, .cmg-row, .important-note, .annexure-title {
        grid-template-columns: 1fr;
      }
      .letterhead .en, .title-bar .en, .cmg-row .en { border-right: 0; border-bottom: 1px solid var(--border); }
    }
  </style>
</head>
<body>
  <main class="document">
    <header class="letterhead">
      <div class="en">
        <div class="company-name">${esc(COMPANY.nameEn.toUpperCase())}</div>
        <div class="trading-as">${esc(COMPANY.tradingAsEn)}</div>
        <div class="addr">${esc(COMPANY.addressEn)}</div>
        <div class="addr">${esc(COMPANY.contactEn)}</div>
      </div>
      <div class="ar" dir="rtl" lang="ar">
        <div class="company-name">${esc(COMPANY.nameAr)}</div>
        <div class="trading-as">${esc(COMPANY.tradingAsAr)}</div>
        <div class="addr">${esc(COMPANY.addressAr)}</div>
        <div class="addr">${esc(COMPANY.contactAr)}</div>
      </div>
    </header>

    <div class="title-bar">
      <span class="en">CLIENT SERVICE AGREEMENT</span>
      <span class="ar" dir="rtl" lang="ar">اتفاقية خدمات العميل</span>
    </div>

    ${section('AGREEMENT DETAILS', 'تفاصيل الاتفاقية', [
      row('Agreement No.', agreementNumber, 'رقم الاتفاقية'),
      row('Date', agreementDate, 'التاريخ'),
      row('Service Program', serviceProgram, 'برنامج الخدمة'),
      row('Country', destinationCountry, 'الدولة'),
    ].join(''))}

    ${section('SERVICE PROVIDER', 'مقدم الخدمة', [
      row('Company', `${COMPANY.nameEn} (CMG)`, 'الشركة', `${COMPANY.nameAr} (CMG)`),
      row('Address', COMPANY.addressEn, 'العنوان', COMPANY.addressAr),
    ].join(''))}

    ${section('CLIENT DETAILS', 'بيانات العميل', [
      row('Full Name', clientName, 'الاسم الكامل'),
      row('Nationality', nationality, 'الجنسية'),
      row('Passport No.', passportNumber, 'رقم جواز السفر'),
      row('Phone', clientPhone, 'الهاتف'),
      row('Email', clientEmail, 'البريد الإلكتروني'),
      row('Occupation', occupation, 'المهنة'),
    ].join(''))}

    ${section('FEE SUMMARY', 'ملخص الرسوم', [
      row('Total Retainer Fee', `${currencyCode} ${totalAmount}`, 'إجمالي رسوم الاحتجاز'),
      row('Initial Payment', `${currencyCode} ${initialPayment}`, 'الدفعة الأولى'),
      row('Second Payment', `${currencyCode} ${secondPayment} (${secondPaymentDue})`, 'الدفعة الثانية', `${currencyCode} ${secondPayment} (${secondPaymentDue})`),
      row('Government / Authority Fees', 'NOT INCLUDED — paid directly by Client', 'رسوم الحكومة / الجهات المختصة', 'غير مشمولة — يدفعها العميل مباشرة'),
      row('VAT', 'Applicable per UAE VAT Law', 'ضريبة القيمة المضافة', 'مطبقة وفق قانون ضريبة القيمة المضافة الإماراتي'),
    ].join(''))}

    <div class="important-note">
      <span class="en">IMPORTANT: All retainer fees are strictly non-refundable except as stated in Clause 6.</span>
      <span class="ar" dir="rtl" lang="ar">هام: جميع رسوم الاحتجاز غير قابلة للاسترداد بصورة قاطعة إلا وفق ما هو منصوص عليه في البند 6.</span>
    </div>

    <section class="cmg-block cmg-clause preamble">
      ${sectionHeader('PREAMBLE', 'تمهيد')}
      <div class="cmg-rows"><div class="cmg-row">
        <div class="en">This Client Service Agreement ("Agreement") is entered into between Commonwealth Migration Group, operating as Commonwealth Documents Clearing Services, a MARA-registered, UAE-based migration consultancy ("CMG / the Company"), and the Client identified above.<br><br>WHEREAS CMG specialises in Australian skilled migration, partner visas, student visas, visitor visas, and related document clearing services for individuals in the UAE and the region.<br><br>WHEREAS the Client has been provided a full opportunity to read, review, and seek independent legal advice in relation to this Agreement prior to execution.<br><br>NOW THEREFORE, in consideration of the mutual covenants herein, the parties agree as follows:</div>
        <div class="ar" dir="rtl" lang="ar">تُبرم اتفاقية خدمات العميل هذه ("الاتفاقية") بين مجموعة كومنولث للهجرة، العاملة تحت اسم "خدمات كومنولث لتخليص المستندات"، وهي شركة استشارات هجرة مسجلة لدى هيئة MARA ومقرها دولة الإمارات العربية المتحدة ("CMG" أو "الشركة")، وبين العميل المحدد أعلاه.<br><br>حيث تتخصص CMG في الهجرة الماهرة إلى أستراليا، وتأشيرات الشريك، وتأشيرات الطلاب، وتأشيرات الزيارة، وخدمات تخليص المستندات ذات الصلة للأفراد في دولة الإمارات العربية المتحدة والمنطقة.<br><br>وحيث أُتيحت للعميل فرصة كاملة لقراءة هذه الاتفاقية ومراجعتها والحصول على مشورة قانونية مستقلة بشأنها قبل توقيعها.<br><br>لذلك، وبناءً على التعهدات المتبادلة الواردة في هذه الاتفاقية، يتفق الطرفان على ما يلي:</div>
      </div></div>
    </section>

    ${clauseHtml}

    <div class="annexure-title">
      <span class="en">ANNEXURE A — SCOPE OF SERVICES AND FEE SCHEDULE</span>
      <span class="ar" dir="rtl" lang="ar">الملحق أ — نطاق الخدمات وجدول الرسوم</span>
    </div>

    ${section('SERVICES TO BE PROVIDED', 'الخدمات المقدمة', [
      row('Service Description', serviceProgram, 'وصف الخدمة'),
      row('Visa Subclass(es)', visaSubclass, 'فئة/فئات التأشيرة'),
      row('Scope Includes', includedDeliverables, 'يشمل النطاق'),
      row('Scope Excludes', expressExclusions, 'يستثني النطاق'),
    ].join(''))}

    ${section('FEE SCHEDULE', 'جدول الرسوم', [
      row('Total Retainer Fee', `${currencyCode} ${totalAmount}`, 'إجمالي رسوم الاحتجاز'),
      row('Initial Payment', `${currencyCode} ${initialPayment} — Due upon signing`, 'الدفعة الأولى', `${currencyCode} ${initialPayment} — تستحق عند التوقيع`),
      row('Second Payment', `${currencyCode} ${secondPayment} — Due: ${secondPaymentDue}`, 'الدفعة الثانية', `${currencyCode} ${secondPayment} — تستحق: ${secondPaymentDue}`),
      row('Government Fees', 'NOT INCLUDED — paid directly by Client', 'رسوم الحكومة', 'غير مشمولة — يدفعها العميل مباشرة'),
      row('VAT', 'Applicable per UAE VAT Law', 'ضريبة القيمة المضافة', 'مطبقة وفق قانون ضريبة القيمة المضافة الإماراتي'),
      row('Special Terms', specialTerms, 'شروط خاصة'),
    ].join(''))}

    <div class="cmg-block signature-block">
      <div class="cmg-rows">
        <div class="cmg-row">
          <div class="en">Client Signature: ________________________________<br><br>Date: ________________________________</div>
          <div class="ar" dir="rtl" lang="ar">توقيع العميل: ________________________________<br><br>التاريخ: ________________________________</div>
        </div>
        <div class="cmg-row">
          <div class="en">CMG Authorised Signature: ________________________________<br><br>Date: ________________________________</div>
          <div class="ar" dir="rtl" lang="ar">توقيع CMG المعتمد: ________________________________<br><br>التاريخ: ________________________________</div>
        </div>
      </div>
    </div>

    <footer class="print-footer">
      <span>${esc(COMPANY.nameEn)} — ${esc(COMPANY.addressEn)}</span>
      <span>Page <span class="page-number"></span></span>
    </footer>
  </main>
</body>
</html>`;
}
