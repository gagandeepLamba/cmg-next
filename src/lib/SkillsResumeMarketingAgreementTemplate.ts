// Bilingual (EN/AR) "Client Advisory Agreement" for the Australia
// Skills Assessment + Resume Marketing service - Commonwealth Migration Advisor
// (CW Migration), Dubai.
//
// English text is transcribed from the reference PDF
// ("Client_Advisory_Agreement_AUS_Skills_Assessment_Resume_Marketing_v5.pdf");
// the Arabic carries the same legal meaning. Layout, styles and row helpers are
// shared with DubaiBilingualAgreementTemplate.ts so both agreements print alike.
// Selected automatically by renderAgreementForBranch.ts when the service program
// is Skills Assessment + Resume Marketing (see isSkillsResumeMarketingProgram).
//
// Dynamic values: agreement number/date, client details, case type (fresh vs.
// existing positive assessment), fees and instalment dates, plus the optional
// nominated occupation / assessing authority. The 6-month expiry is computed
// from the signing date (Clause 10.1).
import {
  COMPANY,
  logoHtml,
  addMonthsToDisplayDate,
  agreementStyles,
  clauseSection,
  esc,
  row,
  section,
  sectionHeader,
  textOrBlank,
} from './DubaiBilingualAgreementTemplate';

export interface SkillsResumeAgreementValues {
  agreementNumber: string;
  agreementDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  nationality: string;
  passportNumber: string;
  // 'fresh' (default): fixed AED 5,000 professional fee (Clause 5.2).
  // 'existing': client already holds a positive Skills Assessment; the fee is
  // adjusted by the consultant (Clause 5.3) and passed in as professionalFee.
  caseType?: 'fresh' | 'existing';
  // Plain formatted number, e.g. "3,500" - the adjusted fee for an existing case.
  professionalFee?: string;
  initialPayment: string;
  secondPayment?: string;
  secondPaymentDue?: string;
  occupation?: string;
  assessingAuthority?: string;
  specialTerms?: string;
  currencyCode?: string;
}

const FRESH_CASE_FEE = '5,000';

// Matches the program names this agreement is used for, e.g.
// "Skills Assessment + Resume Marketing", "Skill Assessment & Resume Marketing",
// or the agreement-number product code "RMSA".
export function isSkillsResumeMarketingProgram(...texts: Array<string | null | undefined>): boolean {
  const text = texts.map((t) => String(t ?? '')).join(' ').toLowerCase();
  if (/\brmsa\b/.test(text)) return true;
  return /skills?[\s-]*assessment/.test(text) && /resume/.test(text);
}

// The 14 clauses, English from the reference PDF, in its own order/numbering.
const clauses: Array<[string, string[], string, string[]]> = [
  ["1. DEFINITIONS AND INTERPRETATION", [
    "1.1 \"CW Migration\" means Commonwealth Migration Advisor, the trading name of Commonwealth Document Clearing Services LLC, together with its officers, employees, agents, branches and authorised representatives in the UAE and the region.",
    "1.2 \"Client\" means the individual(s) named in this Agreement who has/have engaged CW Migration for the Services.",
    "1.3 \"Services\" means only the Skills Assessment and Resume Marketing services specified in Clause 2 and Annexure A.",
    "1.4 \"Retainer Fee\" means the professional fees payable to CW Migration as detailed in Annexure A.",
    "1.5 \"Government / Authority Fees\" means all fees payable to the Department of Home Affairs, Skills Assessment Authorities, State/Territory bodies, English testing bodies, or any other government or quasi-government body. These are excluded from the Retainer Fee and are the Client’s sole responsibility.",
    "1.6 \"Assessing Authority\" means the relevant Australian skills assessment body designated for the Client’s nominated occupation (for example, VETASSESS, Engineers Australia, ACS, TRA, CPA Australia, or ANMAC).",
    "1.7 \"Skills Assessment\" means the assessment of the Client’s qualifications and/or work experience by the Assessing Authority against the requirements of a nominated occupation.",
    "1.8 \"Resume Marketing\" means the preparation of the Client’s Australian-format resume and the marketing of the Client’s profile to prospective employers and job portals in Australia, as described in Clause 2.",
    "1.9 \"Employer Sponsorship\" means any Australian employer-sponsored visa pathway available where an employer offers to nominate or sponsor the Client.",
    "1.10 \"Refusal\" or \"Rejection\" means any negative decision, refusal, cancellation, withdrawal-deemed-refusal, negative assessment, or non-approval issued by an Authority in respect of any application lodged under this Agreement.",
    "1.11 \"DIAC\" means the Dubai International Arbitration Centre.",
    "1.12 Interpretation: words importing the singular include the plural and vice versa; references to any statutory provision include modifications or re-enactments; headings are for convenience only and do not affect interpretation.",
  ], "1. التعريفات والتفسير", [
    "1.1 تعني \"CW Migration\" مستشار كومنولث للهجرة، وهي الاسم التجاري لشركة خدمات كومنولث لتخليص المستندات ذ.م.م، وموظفيها ومسؤوليها ووكلائها وفروعها وممثليها المعتمدين في دولة الإمارات العربية المتحدة والمنطقة.",
    "1.2 يعني \"العميل\" الشخص أو الأشخاص المحددة أسماؤهم في هذه الاتفاقية والذين استعانوا بـ CW Migration للحصول على الخدمات.",
    "1.3 تعني \"الخدمات\" حصرًا خدمتي تقييم المهارات والتسويق للسيرة الذاتية المحددتين في البند 2 والملحق أ.",
    "1.4 تعني \"رسوم الاحتجاز\" الأتعاب المهنية المستحقة لـ CW Migration كما هو مفصل في الملحق أ.",
    "1.5 تعني \"رسوم الحكومة / الجهات المختصة\" جميع الرسوم المستحقة لوزارة الشؤون الداخلية، أو هيئات تقييم المهارات، أو الجهات الإقليمية/الولائية، أو هيئات اختبار اللغة، أو أي جهة حكومية أو شبه حكومية أخرى. وهذه الرسوم مستثناة من رسوم الاحتجاز وتقع على عاتق العميل وحده.",
    "1.6 يعني \"جهة التقييم\" هيئة تقييم المهارات الأسترالية المختصة المحددة للمهنة التي رشّحها العميل (على سبيل المثال: VETASSESS أو Engineers Australia أو ACS أو TRA أو CPA Australia أو ANMAC).",
    "1.7 يعني \"تقييم المهارات\" تقييم مؤهلات العميل و/أو خبرته العملية من قبل جهة التقييم وفقًا لمتطلبات المهنة المرشّحة.",
    "1.8 يعني \"التسويق للسيرة الذاتية\" إعداد السيرة الذاتية للعميل بالصيغة الأسترالية وتسويق ملفه الشخصي لأصحاب العمل المحتملين ومنصات التوظيف في أستراليا، وفق ما هو موضح في البند 2.",
    "1.9 تعني \"كفالة صاحب العمل\" أي مسار تأشيرة أسترالي بكفالة صاحب العمل متاح عندما يعرض صاحب العمل ترشيح العميل أو كفالته.",
    "1.10 يعني \"الرفض\" أو \"عدم القبول\" أي قرار سلبي، أو رفض، أو إلغاء، أو سحب يُعامل كرفض، أو تقييم سلبي، أو عدم موافقة صادر عن جهة مختصة بخصوص أي طلب مقدم بموجب هذه الاتفاقية.",
    "1.11 يعني \"DIAC\" مركز دبي الدولي للتحكيم.",
    "1.12 التفسير: تشمل الكلمات الدالة على المفرد الجمع والعكس صحيح؛ وتشمل الإشارات إلى أي حكم قانوني أي تعديلات أو إعادة سنّه؛ والعناوين لغرض التيسير فقط ولا تؤثر على التفسير.",
  ]],
  ["2. SCOPE OF SERVICES", [
    "2.1 Skills Assessment. CW Migration shall: (a) assess the Client’s profile and suggest the most suitable occupation and Assessing Authority; (b) provide a document checklist and review and prepare the Client’s documents, including employment references and statements; (c) lodge and follow up the Skills Assessment application with the Assessing Authority; and (d) liaise with the Assessing Authority until an outcome is issued. All professional work for the Skills Assessment is covered by the Retainer Fee.",
    "2.2 Resume Marketing. CW Migration shall carry out the complete Resume Marketing process at no additional charge, including: (a) preparing an Australian-format resume and cover letter; (b) marketing the Client’s profile to prospective employers and job portals; (c) applying for suitable roles in all Australian states and territories wherever an opportunity exists for the Client’s occupation; (d) interview preparation guidance; and (e) where an employer offers Employer Sponsorship, guiding and coordinating the Client through that process.",
    "2.3 Language Training. Where English language proficiency is required for the process, CW Migration may provide language training (IELTS/PTE preparation) as part of the Services. Test registration and booking fees are payable by the Client directly to the testing body.",
    "2.4 Permanent Residency Pathway. If the Client does not secure employment or Employer Sponsorship within the term of this Agreement, CW Migration may redirect the Client’s application towards a Permanent Residency (PR) application for the Client and their complete family. Any PR application shall be governed by a separate written agreement with separate charges and is not covered by this Agreement.",
    "2.5 Services are strictly limited to migration consultancy, skills assessment and resume marketing, and do not include legal representation, legal advice, recruitment or labour supply, or courtroom/tribunal representation of any kind.",
    "2.6 Any services beyond the scope of Annexure A (including visa lodgement, PR applications, re-assessment, review or appeal of a negative Skills Assessment, or adding family members) require a separate written agreement and additional fees. Any visa application shall be lodged by a MARA-registered migration agent only at the visa-filing stage, under that separate agreement.",
    "2.7 CW Migration may engage third-party agents, translators, trainers, or assessors to fulfil part of the Services. The Client consents to CW Migration sharing their information with such third parties strictly for the purpose of providing the Services.",
  ], "2. نطاق الخدمات", [
    "2.1 تقييم المهارات. تلتزم CW Migration بما يلي: (أ) تقييم الملف الشخصي للعميل واقتراح المهنة وجهة التقييم الأنسب؛ (ب) تزويد العميل بقائمة المستندات ومراجعة وإعداد مستنداته، بما في ذلك خطابات الخبرة والإفادات؛ (ج) تقديم طلب تقييم المهارات إلى جهة التقييم ومتابعته؛ و(د) التواصل مع جهة التقييم إلى حين صدور النتيجة. وجميع الأعمال المهنية المتعلقة بتقييم المهارات مشمولة برسوم الاحتجاز.",
    "2.2 التسويق للسيرة الذاتية. تقوم CW Migration بتنفيذ عملية التسويق للسيرة الذاتية كاملةً دون أي رسوم إضافية، وتشمل: (أ) إعداد سيرة ذاتية وخطاب تقديم بالصيغة الأسترالية؛ (ب) تسويق الملف الشخصي للعميل لأصحاب العمل المحتملين ومنصات التوظيف؛ (ج) التقديم على الوظائف المناسبة في جميع الولايات والأقاليم الأسترالية حيثما توفرت فرصة لمهنة العميل؛ (د) الإرشاد للتحضير للمقابلات؛ و(هـ) عند عرض صاحب العمل كفالة العميل، توجيه العميل وتنسيق الإجراءات معه خلال تلك العملية.",
    "2.3 التدريب على اللغة. عند اشتراط إتقان اللغة الإنجليزية في العملية، يجوز لـ CW Migration تقديم تدريب لغوي (التحضير لاختبار IELTS/PTE) كجزء من الخدمات. وتُدفع رسوم التسجيل والحجز للاختبار من العميل مباشرة إلى جهة الاختبار.",
    "2.4 مسار الإقامة الدائمة. إذا لم يحصل العميل على وظيفة أو كفالة صاحب عمل خلال مدة هذه الاتفاقية، يجوز لـ CW Migration توجيه طلب العميل نحو طلب إقامة دائمة (PR) للعميل وأسرته بالكامل. ويخضع أي طلب إقامة دائمة لاتفاقية كتابية منفصلة برسوم منفصلة ولا يدخل ضمن نطاق هذه الاتفاقية.",
    "2.5 تقتصر الخدمات حصرًا على الاستشارات المتعلقة بالهجرة وتقييم المهارات والتسويق للسيرة الذاتية، ولا تشمل التمثيل القانوني أو المشورة القانونية أو التوظيف أو توريد العمالة أو التمثيل أمام المحاكم أو الهيئات القضائية بأي شكل.",
    "2.6 أي خدمات تتجاوز نطاق الملحق أ (بما في ذلك تقديم طلب التأشيرة، أو طلبات الإقامة الدائمة، أو إعادة التقييم، أو مراجعة تقييم المهارات السلبي أو الطعن فيه، أو إضافة أفراد أسرة) تستلزم اتفاقية مكتوبة منفصلة ورسومًا إضافية. ولا يجوز تقديم أي طلب تأشيرة إلا من قبل وكيل هجرة مسجل لدى MARA وفي مرحلة تقديم التأشيرة فقط، بموجب تلك الاتفاقية المنفصلة.",
    "2.7 يجوز لـ CW Migration الاستعانة بوكلاء من أطراف ثالثة، أو مترجمين، أو مدربين، أو مقيّمين لتنفيذ جزء من الخدمات. ويوافق العميل على مشاركة CW Migration لمعلوماته مع هذه الأطراف الثالثة حصرًا لغرض تقديم الخدمات.",
  ]],
  ["3. NO GUARANTEE OF OUTCOME", [
    "3.1 CW Migration does not guarantee, represent, or warrant a positive Skills Assessment outcome, or the success, approval, timeline, or positive outcome of any visa application, nomination, or immigration process.",
    "3.2 CW Migration does not guarantee any job offer, interview, Employer Sponsorship, salary level, or minimum number of job applications. All hiring and sponsorship decisions are made solely and independently by employers.",
    "3.3 All decisions are made solely by the relevant Authorities (including the Department of Home Affairs, Assessing Authorities, and State/Territory bodies). CW Migration has no influence over Authority decisions, processing times, occupation lists, or invitation rounds, and accepts no liability for them.",
    "3.4 CW Migration is not liable for any changes in immigration laws, policies, occupation lists, assessment criteria, labour-market conditions, or processing times occurring after the signing of this Agreement.",
    "3.5 An unsuccessful, delayed, or partially successful outcome, or the absence of a job offer, does not, by itself, entitle the Client to any refund except strictly as stated in Clause 8 (Refund Policy).",
    "3.6 No verbal or written representation made by any CW Migration employee, agent, or representative outside this Agreement constitutes a guarantee of outcome. The Client agrees not to rely on any such representation and confirms that no such promise induced them to sign this Agreement.",
    "3.7 The Client acknowledges that CW Migration has conducted only a preliminary assessment based on the information and documents provided by the Client, and that eligibility may change if the information provided is incomplete, inaccurate, or later found to be incorrect.",
  ], "3. عدم ضمان النتائج", [
    "3.1 لا تضمن CW Migration ولا تقر ولا تكفل نتيجة إيجابية لتقييم المهارات، ولا نجاح أو الموافقة على أو المدة الزمنية أو تحقيق نتيجة إيجابية لأي طلب تأشيرة أو ترشيح أو إجراء هجرة.",
    "3.2 لا تضمن CW Migration أي عرض عمل أو مقابلة أو كفالة صاحب عمل أو مستوى راتب أو حدًا أدنى لعدد طلبات التوظيف. وتُتخذ جميع قرارات التوظيف والكفالة حصرًا ومن قبل أصحاب العمل بشكل مستقل.",
    "3.3 تُتخذ جميع القرارات حصرًا من قبل الجهات المختصة ذات الصلة (بما في ذلك وزارة الشؤون الداخلية، وجهات التقييم، والجهات الإقليمية/الولائية). ولا تملك CW Migration أي تأثير على قرارات هذه الجهات، أو مدد المعالجة، أو قوائم المهن، أو جولات الدعوة، ولا تتحمل أي مسؤولية عنها.",
    "3.4 لا تتحمل CW Migration مسؤولية أي تغييرات في قوانين أو سياسات الهجرة، أو قوائم المهن، أو معايير التقييم، أو أوضاع سوق العمل، أو مدد المعالجة التي تطرأ بعد توقيع هذه الاتفاقية.",
    "3.5 لا تخوّل النتيجة غير الناجحة أو المتأخرة أو الناجحة جزئيًا، أو عدم الحصول على عرض عمل، بحد ذاتها، العميل الحق في أي استرداد إلا وفق ما هو منصوص عليه حصرًا في البند 8 (سياسة الاسترداد).",
    "3.6 لا يشكل أي تصريح شفهي أو كتابي يصدر عن أي موظف أو وكيل أو ممثل لدى CW Migration خارج نطاق هذه الاتفاقية ضمانًا لأي نتيجة، ويوافق العميل على عدم الاعتماد على أي تصريح من هذا القبيل ويؤكد أن لا وعد من هذا النوع كان الدافع لتوقيعه هذه الاتفاقية.",
    "3.7 يقر العميل بأن CW Migration أجرت تقييمًا أوليًا فقط استنادًا إلى المعلومات والمستندات التي قدمها العميل، وأن الأهلية قد تتغير إذا كانت المعلومات المقدمة ناقصة أو غير دقيقة أو تبين لاحقًا أنها غير صحيحة.",
  ]],
  ["4. CLIENT OBLIGATIONS AND REPRESENTATIONS", [
    "4.1 The Client warrants that all information and documents provided to CW Migration are true, accurate, complete, current, and not misleading, and accepts full responsibility for the accuracy of all submissions, forms, and documents signed prior to submission to CW Migration.",
    "4.2 The Client shall promptly (and in any event within 15 days of signing this Agreement, unless otherwise agreed) provide all documents and information requested for the Skills Assessment and Resume Marketing, and, where required, English proficiency test results within the timeframe specified by CW Migration. Any delay by the Client is the Client’s sole responsibility and does not entitle the Client to any refund or extension of the term.",
    "4.3 The Client shall keep their resume details truthful and shall not request or permit any misrepresentation of qualifications, experience, or employment history in any resume, application, or Skills Assessment.",
    "4.4 The Client shall respond promptly to employer contact, attend scheduled interviews, and inform CW Migration immediately of any interview invitation, job offer, or sponsorship offer received directly.",
    "4.5 The Client shall NOT pay, offer, or agree to provide any money or benefit to an employer or any third party in exchange for a job offer, nomination, or sponsorship. CW Migration will never request such a payment. Any such arrangement may breach Australian law and is entirely at the Client’s own risk.",
    "4.6 The Client warrants that they and their dependents do not have any severe communicable medical condition, criminal record, or security issue that may affect the application, and that all medical, criminal, and security background checks mandated by the Authority must be passed. CW Migration is not liable for any refusal resulting from adverse findings during such checks.",
    "4.7 The Client shall NOT contact any immigration Authority, Assessing Authority, embassy, government body, lawyer, agent, or employer introduced by CW Migration directly without prior written approval from CW Migration during the term of this Agreement. If such unauthorised contact negatively affects the application, CW Migration shall not be liable for the outcome and no refund shall be issued.",
    "4.8 The Client shall maintain respectful and professional conduct with all CW Migration employees. Abusive, threatening, or inappropriate conduct constitutes a material breach and may result in immediate termination without refund and without notice, and may result in legal action against the Client.",
    "4.9 The Client shall not provide false, fraudulent, forged, or misleading documents. CW Migration has a legal and ethical duty to report suspected fraudulent documents to the relevant Authorities, and any such conduct forfeits the Client’s right to any refund under this Agreement.",
    "4.10 The Client shall not take any action (such as resigning from employment, selling assets, or making financial or family commitments) in anticipation of a job offer, visa grant, or positive outcome. CW Migration accepts no liability for such actions and no refund shall be payable in connection with losses arising from them.",
    "4.11 All documentation must be provided in English or accompanied by a certified legal translation, with a sworn statement from a qualified translator (who may not be the Client or a relative of the Client).",
    "4.12 The Client shall not instruct their bank or financial institution to reverse, dispute, charge back, or dishonour any payment made to CW Migration. Any bounced cheque or reversed payment (’chargeback’) shall be treated as a material breach entitling CW Migration to suspend Services immediately and to recover the amount plus reasonable recovery costs, and forfeits the Client’s eligibility for any refund under Clause 8.",
  ], "4. التزامات العميل وإقراراته", [
    "4.1 يقر العميل بأن جميع المعلومات والمستندات المقدمة إلى CW Migration صحيحة ودقيقة وكاملة وحديثة وغير مضللة، ويتحمل العميل المسؤولية الكاملة عن دقة جميع المستندات والنماذج التي يوقّعها قبل تقديمها إلى CW Migration.",
    "4.2 يجب على العميل أن يقدم فورًا (وفي جميع الأحوال خلال 15 يومًا من توقيع هذه الاتفاقية، ما لم يُتفق على خلاف ذلك) جميع المستندات والمعلومات المطلوبة لتقييم المهارات والتسويق للسيرة الذاتية، وعند الاقتضاء نتائج اختبار الكفاءة في اللغة الإنجليزية ضمن الإطار الزمني الذي تحدده CW Migration. وأي تأخر من جانب العميل يقع على عاتقه وحده ولا يخوّله الحق في أي استرداد أو تمديد لمدة الاتفاقية.",
    "4.3 يلتزم العميل بالحفاظ على صحة بيانات سيرته الذاتية، ولا يجوز له أن يطلب أو يسمح بأي تحريف للمؤهلات أو الخبرة أو التاريخ الوظيفي في أي سيرة ذاتية أو طلب أو تقييم مهارات.",
    "4.4 يلتزم العميل بالرد فورًا على تواصل أصحاب العمل، وحضور المقابلات المحددة، وإبلاغ CW Migration فورًا بأي دعوة لمقابلة أو عرض عمل أو عرض كفالة يتلقاه مباشرة.",
    "4.5 لا يجوز للعميل دفع أو عرض أو الموافقة على تقديم أي مبلغ مالي أو منفعة إلى صاحب عمل أو أي طرف ثالث مقابل الحصول على عرض عمل أو ترشيح أو كفالة. ولن تطلب CW Migration أبدًا مثل هذه الدفعة. وقد يخالف أي ترتيب من هذا القبيل القانون الأسترالي ويكون على مسؤولية العميل الخاصة بالكامل.",
    "4.6 يقر العميل بأنه هو وأفراد عائلته لا يعانون من أي حالة طبية معدية خطيرة أو سجل جنائي أو مشكلة أمنية قد تؤثر على الطلب، وأنه يجب اجتياز جميع الفحوصات الطبية والجنائية والأمنية التي تفرضها الجهة المختصة بنجاح. ولن تكون CW Migration مسؤولة عن أي رفض ناتج عن نتائج سلبية أثناء هذه الفحوصات.",
    "4.7 لا يجوز للعميل التواصل مع أي جهة هجرة، أو جهة تقييم، أو سفارة، أو جهة حكومية، أو محامٍ، أو وكيل، أو صاحب عمل عرّفته CW Migration عليه بشكل مباشر دون الحصول على موافقة كتابية مسبقة من CW Migration طوال مدة هذه الاتفاقية. وإذا أثر هذا التواصل غير المصرح به سلبًا على الطلب، فلن تكون CW Migration مسؤولة عن النتيجة ولن يُصدر أي استرداد.",
    "4.8 يلتزم العميل بالحفاظ على سلوك محترم ومهني مع جميع موظفي CW Migration. ويشكل أي سلوك مسيء أو تهديدي أو غير لائق إخلالًا جوهريًا قد يؤدي إلى إنهاء فوري دون استرداد ودون إشعار، وقد يؤدي إلى اتخاذ إجراءات قانونية ضد العميل.",
    "4.9 لا يجوز للعميل تقديم مستندات كاذبة أو احتيالية أو مزورة أو مضللة. وتلتزم CW Migration قانونيًا وأخلاقيًا بالإبلاغ عن أي مستندات يُشتبه في تزويرها للجهات المختصة، ويسقط حق العميل في أي استرداد بموجب هذه الاتفاقية في حال ثبوت ذلك.",
    "4.10 لا يجوز للعميل اتخاذ أي إجراء (مثل الاستقالة من العمل، أو بيع الأصول، أو الالتزام بتعهدات مالية أو أسرية) تحسبًا للحصول على عرض عمل أو تأشيرة أو نتيجة إيجابية. ولا تتحمل CW Migration أي مسؤولية عن مثل هذه الإجراءات ولن يُستحق أي استرداد فيما يتعلق بالخسائر الناشئة عنها.",
    "4.11 يجب أن تكون جميع المستندات باللغة الإنجليزية أو مصحوبة بترجمة قانونية معتمدة، مع بيان مشفوع بالقسم من مترجم مؤهل (لا يجوز أن يكون العميل أو أحد أقاربه).",
    "4.12 لا يجوز للعميل إصدار تعليمات لبنكه أو مؤسسته المالية بعكس أو الاعتراض على أو استرجاع أو رفض أي دفعة مقدمة إلى CW Migration. ويُعامل أي شيك مرتجع أو دفعة معكوسة (\"chargeback\") كإخلال جوهري يخوّل CW Migration تعليق الخدمات فورًا واسترداد المبلغ بالإضافة إلى تكاليف التحصيل المعقولة، ويسقط أهلية العميل لأي استرداد بموجب البند 8.",
  ]],
  ["5. FEES AND PAYMENT", [
    "5.1 The Client agrees to pay the Retainer Fee per the schedule in Annexure A.",
    "5.2 Fresh Case: Where the Client does not hold a valid positive Skills Assessment, the Retainer Fee is a fixed amount of AED 5,000. This amount is non-refundable, as it is utilised in completing the entire Skills Assessment process. It also covers the complete Resume Marketing process, for which no additional professional charges apply.",
    "5.3 Existing Positive Skills Assessment: Where the Client has already completed a Skills Assessment with a valid positive outcome, the Retainer Fee shall be adjusted by the consultant and stated in Annexure A.",
    "5.4 Assessing Authority Fees: The fees charged by the Assessing Authority are additional to the Retainer Fee, depend on the occupation suggested by the consultant, and are payable by the Client directly to the Assessing Authority.",
    "5.5 Employer Sponsorship: If the Client is selected by an employer under an Employer Sponsorship option, CW Migration charges no additional professional fee for coordinating that process. Where the employer bears the government fees, no government fees are payable by the Client. Where any government fees are payable by the Client as visa applicant, the Client shall pay them directly to the Department of Home Affairs or relevant Authority. CW Migration does not collect government fees.",
    "5.6 All Government / Authority fees are entirely the Client’s responsibility (unless borne by an employer as above) and are not covered by this Agreement, regardless of whether CW Migration assists in submitting such payments.",
    "5.7 Non-payment of any instalment may result in immediate suspension or termination of Services without notice or refund. CW Migration may withhold lodgement of any application until all outstanding fees are paid in full.",
    "5.8 Any amount not paid within 7 days of its due date shall accrue interest at the rate of 1.5% per month (or the maximum rate permitted by UAE law, whichever is lower) from the due date until the date of actual payment.",
    "5.9 In the event CW Migration engages legal counsel or a debt recovery agency to recover outstanding amounts, all associated costs — including legal fees, court fees, and collection charges — shall be borne entirely by the Client.",
    "5.10 Any payment plan agreed verbally or in writing must be honoured in full. Failure to adhere to an agreed payment plan constitutes a material breach of this Agreement and entitles CW Migration to suspend or terminate Services without refund.",
    "5.11 CW Migration does not accept payment into any employee’s personal account. Any such payment is considered unauthorised, and CW Migration shall not be liable for any loss, dispute, or consequence arising from it. All official payments must be made through CW Migration’s verified company bank accounts, approved online payment gateways, or at CW Migration’s official office locations, with an official company receipt issued.",
  ], "5. الرسوم والدفع", [
    "5.1 يوافق العميل على سداد رسوم الاحتجاز وفق الجدول الزمني المحدد في الملحق أ.",
    "5.2 الحالة الجديدة: عندما لا يحمل العميل تقييم مهارات إيجابيًا ساريًا، تكون رسوم الاحتجاز مبلغًا ثابتًا قدره 5,000 درهم إماراتي. وهذا المبلغ غير قابل للاسترداد لأنه يُستخدم في إتمام عملية تقييم المهارات بالكامل. كما يغطي عملية التسويق للسيرة الذاتية كاملةً، دون أي أتعاب مهنية إضافية عنها.",
    "5.3 تقييم مهارات إيجابي قائم: عندما يكون العميل قد أتمّ بالفعل تقييم مهارات بنتيجة إيجابية سارية، تُعدَّل رسوم الاحتجاز من قبل المستشار وتُذكر في الملحق أ.",
    "5.4 رسوم جهة التقييم: الرسوم التي تفرضها جهة التقييم إضافية إلى رسوم الاحتجاز، وتعتمد على المهنة التي يقترحها المستشار، ويدفعها العميل مباشرة إلى جهة التقييم.",
    "5.5 كفالة صاحب العمل: إذا اختار صاحب عمل العميل ضمن خيار كفالة صاحب العمل، فلا تفرض CW Migration أي أتعاب مهنية إضافية مقابل تنسيق تلك العملية. وعندما يتحمل صاحب العمل الرسوم الحكومية، لا يستحق على العميل أي رسوم حكومية. وعندما تكون أي رسوم حكومية مستحقة على العميل بصفته مقدم الطلب، يدفعها العميل مباشرة إلى وزارة الشؤون الداخلية أو الجهة المختصة المعنية. ولا تقوم CW Migration بتحصيل الرسوم الحكومية.",
    "5.6 تقع جميع رسوم الحكومة / الجهات المختصة على عاتق العميل وحده (ما لم يتحملها صاحب العمل وفق ما سبق) وهي غير مشمولة بهذه الاتفاقية، بصرف النظر عما إذا كانت CW Migration تساعد في تقديم هذه المدفوعات.",
    "5.7 قد يؤدي عدم سداد أي قسط إلى تعليق أو إنهاء فوري للخدمات دون إشعار أو استرداد. ويجوز لـ CW Migration تأجيل تقديم أي طلب إلى حين سداد جميع الرسوم المستحقة بالكامل.",
    "5.8 يستحق على أي مبلغ لم يُسدد خلال 7 أيام من تاريخ استحقاقه فائدة تأخيرية بمعدل 1.5% شهريًا (أو الحد الأقصى الذي يسمح به القانون الإماراتي، أيهما أدنى) من تاريخ الاستحقاق وحتى تاريخ السداد الفعلي.",
    "5.9 في حال اضطرار CW Migration إلى الاستعانة بمستشار قانوني أو وكالة تحصيل ديون لاسترداد مبالغ مستحقة، تقع جميع التكاليف المرتبطة بذلك — بما في ذلك أتعاب المحاماة ورسوم المحكمة وتكاليف التحصيل — على عاتق العميل وحده.",
    "5.10 يجب الوفاء الكامل بأي خطة سداد متفق عليها شفهيًا أو كتابيًا. ويُعد الإخفاق في الالتزام بخطة السداد المتفق عليها إخلالًا جوهريًا بهذه الاتفاقية ويخوّل CW Migration تعليق أو إنهاء الخدمات دون استرداد.",
    "5.11 لا تقبل CW Migration أي دفع إلى الحساب الشخصي لأي موظف. ويُعتبر أي دفع من هذا النوع غير مصرح به، ولا تتحمل CW Migration أي مسؤولية عن أي خسارة أو نزاع أو تبعات تنشأ عنه. ويجب أن تتم جميع المدفوعات الرسمية فقط من خلال حسابات CW Migration البنكية الموثقة، أو بوابات الدفع الإلكترونية المعتمدة، أو في أحد مكاتب CW Migration الرسمية، مع إصدار إيصال رسمي من الشركة.",
  ]],
  ["6. LIMITATION OF LIABILITY", [
    "6.1 To the maximum extent permitted by law, CW Migration shall not be liable for: any Authority or employer decision, delay, refusal, or processing time; changes in law, policy, or labour-market conditions; inaccurate, incomplete, or delayed information/documents provided by the Client; Client’s delay in providing documents or attending interviews or appointments; Client’s unauthorised contact with any Authority, employer, or third party; Client’s actions taken in anticipation of a job offer or visa; the loss of records in transit (which remains the courier’s responsibility); the authenticity of documents that appear genuine on their face; Force Majeure Events; or reliance on any representation made outside this Agreement.",
    "6.2 CW Migration’s maximum aggregate liability, under any theory of liability (contract, tort, or otherwise), shall not exceed the total Retainer Fee actually paid by the Client, and shall exclude any indirect, incidental, consequential, or punitive damages, loss of income, loss of opportunity, or loss of visa eligibility..",
    "6.3 The Client acknowledges that Resume Marketing is a marketing and advisory support service only. CW Migration is not a recruitment agency or employer and does not guarantee employment, job placement, Employer Sponsorship, or a specific number of job applications submitted.",
  ], "6. تحديد المسؤولية", [
    "6.1 إلى أقصى حد يسمح به القانون، لا تتحمل CW Migration المسؤولية عن: أي قرار أو تأخير أو رفض أو مدة معالجة صادرة عن جهة مختصة أو صاحب عمل؛ أو التغييرات في القانون أو السياسة أو أوضاع سوق العمل؛ أو المعلومات/المستندات غير الدقيقة أو الناقصة أو المتأخرة المقدمة من العميل؛ أو تأخر العميل في تقديم المستندات أو حضور المقابلات أو المواعيد؛ أو تواصل العميل غير المصرح به مع أي جهة مختصة أو صاحب عمل أو طرف ثالث؛ أو إجراءات العميل المتخذة تحسبًا للحصول على عرض عمل أو تأشيرة؛ أو فقدان السجلات أثناء النقل (والتي تقع مسؤوليتها على شركة التوصيل)؛ أو صحة المستندات التي تبدو أصلية ظاهريًا؛ أو أحداث القوة القاهرة؛ أو الاعتماد على أي تصريح خارج نطاق هذه الاتفاقية.",
    "6.2 لا تتجاوز المسؤولية الإجمالية القصوى لـ CW Migration، بموجب أي نظرية مسؤولية (تعاقدية أو تقصيرية أو غير ذلك)، إجمالي رسوم الاحتجاز التي سددها العميل فعليًا، وتستثني أي أضرار غير مباشرة أو عرضية أو تبعية أو تأديبية، أو خسارة الدخل، أو خسارة الفرصة، أو فقدان أهلية التأشيرة.",
    "6.3 يقر العميل بأن التسويق للسيرة الذاتية خدمة تسويقية ودعم استشاري فقط. وCW Migration ليست وكالة توظيف أو صاحب عمل ولا تضمن التوظيف أو التنسيب الوظيفي أو كفالة صاحب العمل أو عددًا محددًا من طلبات التوظيف المقدمة.",
  ]],
  ["7. INDEMNIFICATION", [
    "7.1 The Client shall indemnify, defend, and hold harmless CW Migration, its officers, employees, agents, and authorised representatives (collectively \"Indemnified Parties\") from and against any and all claims, demands, losses, damages, liabilities, costs, and expenses (including reasonable legal fees) arising out of or in connection with: (a) any false, misleading, incomplete, or fraudulent information or documents provided by the Client; (b) any breach by the Client of this Agreement; (c) any action taken by the Client in anticipation of a job offer, visa grant, skills assessment outcome, or other immigration result; and (d) any unauthorised direct contact by the Client with any Authority, employer, or third party in connection with the Services.",
    "7.2 This indemnification obligation shall survive the termination or expiry of this Agreement.",
  ], "7. التعويض", [
    "7.1 يلتزم العميل بتعويض CW Migration ومسؤوليها وموظفيها ووكلائها وممثليها المعتمدين (\"الأطراف المُعوَّضة\") والدفاع عنهم وإبراء ذمتهم من وضد جميع المطالبات والطلبات والخسائر والأضرار والمسؤوليات والتكاليف والمصاريف (بما في ذلك أتعاب المحاماة المعقولة) الناشئة عن أو المرتبطة بـ: (أ) أي معلومات أو مستندات كاذبة أو مضللة أو ناقصة أو احتيالية يقدمها العميل؛ (ب) أي إخلال من العميل بهذه الاتفاقية؛ (ج) أي إجراء يتخذه العميل تحسبًا للحصول على عرض عمل أو تأشيرة أو نتيجة تقييم مهارات أو أي نتيجة هجرة أخرى؛ و(د) أي تواصل مباشر غير مصرح به من العميل مع أي جهة مختصة أو صاحب عمل أو طرف ثالث فيما يتعلق بالخدمات.",
    "7.2 يظل التزام التعويض هذا ساريًا بعد إنهاء هذه الاتفاقية أو انقضائها.",
  ]],
  ["8. REFUND POLICY", [
    "8.1 All fees are strictly non-refundable, except as expressly and narrowly stated in this Clause 8. In particular, the Fresh Case Retainer Fee of AED 5,000 is fixed and non-refundable once signed, as it is utilised in completing the Skills Assessment process.",
    "8.2 The Client acknowledges and agrees that, under no circumstances, will CW Migration issue a refund where any of the following situations apply (this list is illustrative, not exhaustive): :)",
    "8.2(a) The Client not receiving any interview, job offer, or Employer Sponsorship within the term of this Agreement;",
    "8.2(b) A negative or unsuitable Skills Assessment outcome, or the Assessing Authority assessing the Client against a different occupation;",
    "8.2(c) The Client declining a job offer, interview, or sponsorship opportunity, or an employer withdrawing an offer;",
    "8.2(d) Changes in immigration laws, policies, occupation lists, assessment criteria, or invitation rounds occurring after signing;",
    "8.2(e) Refusal, rejection, or non-approval of an application by any Authority, since approval is solely at that Authority’s discretion;",
    "8.2(f) Diplomatic, political, or bilateral relationship issues between the Client’s country of residence/nationality and the destination country;",
    "8.2(g) The Client’s voluntary withdrawal at any stage after signing this Agreement;",
    "8.2(h) Inconsistent, contradictory, incomplete, or false information or documents provided by the Client;",
    "8.2(i) Closure of the relevant immigration program or occupation, or the program reaching maximum capacity;",
    "8.2(j) The Client’s failure to provide required documents, information, or test results within the stipulated timeframe, or to attend any interview, test, or appointment;",
    "8.2(k) Refusal on medical, criminal, national security, character, or financial-ineligibility grounds;",
    "8.2(l) The Client’s unauthorised direct communication with any Authority, employer, agent, or third party that negatively affects the outcome;",
    "8.2(m) Provision of false, misleading, or fraudulent documents, or any form of misrepresentation;",
    "8.2(n) Registration/administration fees and fees for work already performed (file creation, consultation, document checklist, resume preparation, submission);",
    "8.2(o) Termination due to the Client’s breach of this Agreement (including Clauses 4.5, 4.8, 4.9, 4.12, or 5.7) or the Client’s misconduct;",
    "8.2(p) Dormancy of the Client’s file for 90 days or more without communication or action by the Client;",
    "8.2(q) Fees paid to the Assessing Authority, government bodies, or third parties on the Client’s behalf (the Client must seek such refunds directly from the relevant body);",
    "8.2(r) VAT or other government taxes remitted to the authorities;",
    "8.2(s) Force Majeure Events or the death of any person.",
    "8.3 A partial refund may be considered, at CW Migration’s sole discretion, only where CW Migration has been wholly unable to commence any Services for a reason solely and exclusively attributable to CW Migration, and only for the unused portion of the Retainer Fee corresponding to work not yet performed.",
    "8.4 Where CW Migration determines, at its sole discretion, that a refund under Clause 8.3 is approved, CW Migration shall process the approved refund within ninety (90) calendar days from the date the refund is approved in writing, subject to deduction of: (a) any applicable VAT/GST or government charges already remitted; (b) card/payment-processing fees actually incurred (up to 2.5%); (c) administrative and registration fees; and (d) the value of work already performed up to the date of approval.",
    "8.5 Any approved refund will be issued only by bank transfer or company cheque, in the Client’s name exclusively, to the account/address on file. No refund will be issued to a third party, nominee, or any person other than the Client named in this Agreement.",
    "8.6 The cooling-off period, if any, does not apply once any assessment, advice, document review, resume preparation, or file registration has been provided.",
    "8.7 Nothing in this Clause obliges CW Migration to review the merits of a refusal; however, CW Migration will, on request, provide a written summary of the work performed on a file that did not result in approval.",
    "8.8 Notwithstanding Clauses 2.6 and 8.2, where a Skills Assessment fails due to an error, omission, or deficiency solely attributable to CW Migration (and not to the Client or any Authority), CW Migration shall correct the issue and re-lodge the Skills Assessment on the Client’s behalf without any additional professional fee. Assessing Authority fees remain the Client’s responsibility.",
  ], "8. سياسة الاسترداد", [
    "8.1 جميع الرسوم غير قابلة للاسترداد بصورة قاطعة، إلا وفق ما هو منصوص عليه صراحة وبشكل ضيق في هذا البند 8. وعلى وجه الخصوص، فإن رسوم الاحتجاز للحالة الجديدة وقدرها 5,000 درهم إماراتي مبلغ ثابت وغير قابل للاسترداد بمجرد التوقيع، لأنه يُستخدم في إتمام عملية تقييم المهارات.",
    "8.2 يقر العميل ويوافق على أنه لن تُصدر CW Migration، تحت أي ظرف من الظروف، أي استرداد إذا انطبقت أي من الحالات التالية (هذه القائمة توضيحية وليست حصرية):",
    "8.2(أ) عدم حصول العميل على أي مقابلة أو عرض عمل أو كفالة صاحب عمل خلال مدة هذه الاتفاقية؛",
    "8.2(ب) نتيجة تقييم مهارات سلبية أو غير مناسبة، أو تقييم جهة التقييم للعميل وفق مهنة مختلفة؛",
    "8.2(ج) رفض العميل لعرض عمل أو مقابلة أو فرصة كفالة، أو سحب صاحب العمل لعرضه؛",
    "8.2(د) التغييرات في قوانين أو سياسات الهجرة أو قوائم المهن أو معايير التقييم أو جولات الدعوة التي تطرأ بعد التوقيع؛",
    "8.2(هـ) رفض أو عدم موافقة أي جهة مختصة على الطلب، حيث تعتمد الموافقة حصرًا على تقدير تلك الجهة؛",
    "8.2(و) المشاكل الدبلوماسية أو السياسية أو في العلاقات الثنائية بين بلد إقامة/جنسية العميل والبلد المقصد؛",
    "8.2(ز) انسحاب العميل الطوعي في أي مرحلة بعد توقيع هذه الاتفاقية؛",
    "8.2(ح) المعلومات أو المستندات غير المتسقة أو المتناقضة أو الناقصة أو الكاذبة المقدمة من العميل؛",
    "8.2(ط) إغلاق برنامج الهجرة أو المهنة المعنية، أو وصول البرنامج إلى الحد الأقصى للقدرة الاستيعابية؛",
    "8.2(ي) عدم تقديم العميل للمستندات أو المعلومات أو نتائج الاختبارات المطلوبة ضمن الإطار الزمني المحدد، أو عدم حضوره أي مقابلة أو اختبار أو موعد؛",
    "8.2(ك) الرفض لأسباب طبية أو جنائية أو تتعلق بالأمن القومي أو الشخصية أو عدم الأهلية المالية؛",
    "8.2(ل) تواصل العميل المباشر غير المصرح به مع أي جهة مختصة أو صاحب عمل أو وكيل أو طرف ثالث بما يؤثر سلبًا على النتيجة؛",
    "8.2(م) تقديم مستندات كاذبة أو مضللة أو احتيالية، أو أي شكل من أشكال التضليل؛",
    "8.2(ن) رسوم التسجيل/الإدارة والرسوم مقابل العمل المنجز بالفعل (إنشاء الملف، الاستشارة، قائمة التحقق من المستندات، إعداد السيرة الذاتية، التقديم)؛",
    "8.2(س) الإنهاء بسبب إخلال العميل بهذه الاتفاقية (بما في ذلك البنود 4.5 أو 4.8 أو 4.9 أو 4.12 أو 5.7) أو سوء سلوك العميل؛",
    "8.2(ع) تعليق ملف العميل لمدة 90 يومًا أو أكثر دون تواصل أو إجراء من جانب العميل؛",
    "8.2(ف) الرسوم المدفوعة لجهة التقييم أو الجهات الحكومية أو أطراف ثالثة نيابة عن العميل (يجب على العميل طلب استرداد هذه المبالغ مباشرة من الجهة المعنية)؛",
    "8.2(ص) ضريبة القيمة المضافة أو الضرائب الحكومية الأخرى المحوّلة إلى الجهات المختصة؛",
    "8.2(ق) أحداث القوة القاهرة أو وفاة أي شخص.",
    "8.3 يجوز النظر في استرداد جزئي، وفق التقدير المطلق لـ CW Migration، فقط في حال عجز CW Migration الكامل عن بدء أي خدمات لسبب يعود حصرًا وكليًا إلى CW Migration، وفقط عن الجزء غير المستخدم من رسوم الاحتجاز المقابل للعمل الذي لم يُنجز بعد.",
    "8.4 في حال قررت CW Migration، وفق تقديرها المطلق، الموافقة على استرداد بموجب البند 8.3، تلتزم CW Migration بمعالجة الاسترداد المعتمد خلال تسعين (90) يومًا تقويميًا من تاريخ الموافقة الكتابية على الاسترداد، مع خصم: (أ) أي ضريبة قيمة مضافة أو رسوم حكومية سارية تم تحويلها بالفعل؛ (ب) رسوم معالجة البطاقات/الدفع المتكبدة فعليًا (حتى 2.5%)؛ (ج) الرسوم الإدارية ورسوم التسجيل؛ و(د) قيمة العمل المنجز بالفعل حتى تاريخ الموافقة.",
    "8.5 لن يُصدر أي استرداد معتمد إلا عن طريق التحويل البنكي أو شيك الشركة، باسم العميل حصرًا، إلى الحساب/العنوان المسجل. ولن يُصدر أي استرداد لطرف ثالث أو مرشح أو أي شخص بخلاف العميل المذكور في هذه الاتفاقية.",
    "8.6 لا تسري فترة التراجع، إن وجدت، بعد تقديم أي تقييم أو مشورة أو مراجعة مستندات أو إعداد سيرة ذاتية أو تسجيل ملف.",
    "8.7 لا يُلزم أي نص في هذا البند CW Migration بمراجعة أسباب الرفض؛ ومع ذلك، ستقدم CW Migration، عند الطلب، ملخصًا كتابيًا بالعمل المنجز على الملف الذي لم يُفضِ إلى الموافقة.",
    "8.8 على الرغم مما ورد في البندين 2.6 و8.2، في حال إخفاق تقييم المهارات بسبب خطأ أو سهو أو قصور يعود حصرًا إلى CW Migration (وليس إلى العميل أو أي جهة مختصة)، تلتزم CW Migration بتصحيح الخطأ وإعادة تقديم طلب تقييم المهارات نيابةً عن العميل دون أي أتعاب مهنية إضافية. وتظل رسوم جهة التقييم على عاتق العميل.",
  ]],
  ["9. CONFIDENTIALITY AND DATA PROTECTION", [
    "9.1 Both parties agree to maintain the confidentiality of all information received under this Agreement. Confidential Information shall not be disclosed without prior written consent, except as required by law.",
    "9.2 The Client consents to CW Migration sharing their resume and personal information with prospective employers and job portals for Resume Marketing; with third parties as necessary to provide the Services (e.g., Assessing Authorities, Department of Home Affairs, State/Territory bodies, translators, trainers, and IELTS/PTE bodies); and for marketing and branding purposes related to CW Migration’s promotional activities.",
    "9.3 CW Migration processes the Client’s personal data in accordance with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL) and any applicable regulations thereunder.",
    "9.4 The Client releases CW Migration from all liability arising from electronic communications interception, delay, or delivery failure, provided CW Migration uses reasonable security measures.",
  ], "9. السرية وحماية البيانات", [
    "9.1 يتفق الطرفان على الحفاظ على سرية جميع المعلومات المتلقاة بموجب هذه الاتفاقية. ولا يجوز الإفصاح عن المعلومات السرية دون موافقة كتابية مسبقة، إلا وفق ما يقتضيه القانون.",
    "9.2 يوافق العميل على مشاركة CW Migration لسيرته الذاتية ومعلوماته الشخصية مع أصحاب العمل المحتملين ومنصات التوظيف لغرض التسويق للسيرة الذاتية؛ ومع أطراف ثالثة بالقدر اللازم لتقديم الخدمات (مثل جهات التقييم، ووزارة الشؤون الداخلية، والجهات الإقليمية/الولائية، والمترجمين، والمدربين، وهيئات اختبار الآيلتس/البيرسون)؛ ولأغراض التسويق والترويج لأنشطة CW Migration الترويجية.",
    "9.3 تعالج CW Migration بيانات العميل الشخصية وفقًا للمرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية (PDPL) وأي لوائح تنفيذية سارية بموجبه.",
    "9.4 يُعفي العميل CW Migration من أي مسؤولية ناشئة عن اعتراض الاتصالات الإلكترونية أو تأخرها أو فشل تسليمها، شريطة أن تتخذ CW Migration تدابير أمنية معقولة.",
  ]],
  ["10. TERM AND TERMINATION", [
    "10.1 This Agreement commences on the date of signing and remains valid for six (6) months, covering both the Skills Assessment and Resume Marketing, unless terminated earlier in accordance with this Clause. It may be extended by mutual written consent.",
    "10.2 Where the Skills Assessment outcome is still pending with the Assessing Authority on expiry, CW Migration shall continue to follow up that application until an outcome is issued, without additional professional fee.",
    "10.3 Either party may terminate this Agreement with fifteen (15) days’ prior written notice via email.",
    "10.4 CW Migration may terminate immediately and without notice for: non-payment; provision of false or forged documents; material breach; Client misconduct (Clause 4.8); breach of Clause 4.5; unauthorised engagement of another agent; or any circumstance described in Clause 8.2.",
    "10.5 Upon termination or expiry: (a) all CW Migration obligations cease (subject to Clause 10.2); (b) no refund is due except strictly as set out in Clause 8; (c) the Client remains liable for all outstanding fees and charges; (d) any PR application shall proceed only under a separate agreement per Clause 2.4; and (e) Clauses 6, 7, 8, 9, and 11 survive termination.",
  ], "10. مدة الاتفاقية وإنهاؤها", [
    "10.1 تسري هذه الاتفاقية اعتبارًا من تاريخ التوقيع وتظل نافذة لمدة ستة (6) أشهر، وتغطي كلاً من تقييم المهارات والتسويق للسيرة الذاتية، ما لم يتم إنهاؤها قبل ذلك وفقًا لهذا البند. ويجوز تمديدها بموافقة كتابية متبادلة.",
    "10.2 إذا كانت نتيجة تقييم المهارات لا تزال قيد النظر لدى جهة التقييم عند انقضاء الاتفاقية، تواصل CW Migration متابعة ذلك الطلب إلى حين صدور النتيجة، دون أي أتعاب مهنية إضافية.",
    "10.3 يحق لأي من الطرفين إنهاء الاتفاقية بإشعار كتابي مسبق مدته خمسة عشر (15) يومًا عبر البريد الإلكتروني.",
    "10.4 يجوز لـ CW Migration إنهاء الاتفاقية فورًا ودون إشعار في الحالات التالية: عدم السداد؛ تقديم مستندات كاذبة أو مزورة؛ الإخلال الجوهري؛ سوء سلوك العميل (البند 4.8)؛ الإخلال بالبند 4.5؛ الاستعانة بوكيل آخر دون تصريح؛ أو أي حالة من الحالات الواردة في البند 8.2.",
    "10.5 عند الإنهاء أو الانقضاء: (أ) تنتهي جميع التزامات CW Migration (مع مراعاة البند 10.2)؛ (ب) لا يستحق أي استرداد إلا وفق ما هو منصوص عليه حصرًا في البند 8؛ (ج) يظل العميل مسؤولًا عن جميع الرسوم والتكاليف المستحقة؛ (د) لا يُباشر أي طلب إقامة دائمة إلا بموجب اتفاقية منفصلة وفق البند 2.4؛ و(هـ) تظل البنود 6 و7 و8 و9 و11 سارية بعد الإنهاء.",
  ]],
  ["11. SOCIAL MEDIA, REVIEWS, AND DEFAMATION", [
    "11.1 The Client agrees not to publish, on any platform (including Google, social media, review sites, or messaging applications), any content about CW Migration or its employees that is factually false or misleading, defamatory, malicious or abusive, or designed to cause commercial harm without factual basis.",
    "11.2 Legitimate grievances shall be addressed exclusively through the dispute resolution mechanism in Clause 13. The Client agrees to exhaust that process before making any public statement about CW Migration in connection with a dispute arising from this Agreement.",
    "11.3 CW Migration reserves the right to seek injunctive relief, damages, and all available remedies under UAE Federal Decree-Law No. 34 of 2021 on Combating Rumours and Cybercrime, UAE Federal Decree-Law No. 31 of 2021 (Penal Code), and applicable defamation laws in any relevant jurisdiction (including Australia, Canada, or the Client’s country of residence), for any breach of this Clause.",
    "11.4 Nothing in this Clause prevents the Client from making truthful, factual, and non-malicious statements about their experience with CW Migration in good faith, provided the Client has first followed the dispute resolution process under Clause 13.",
  ], "11. وسائل التواصل الاجتماعي والمراجعات والتشهير", [
    "11.1 يوافق العميل على عدم نشر أي محتوى عن CW Migration أو موظفيها، على أي منصة (بما في ذلك جوجل، ووسائل التواصل الاجتماعي، ومواقع المراجعات، وتطبيقات المراسلة)، يكون كاذبًا أو مضللًا من الناحية الواقعية، أو تشهيريًا، أو كيديًا أو مسيئًا، أو يهدف إلى إلحاق ضرر تجاري دون أساس واقعي.",
    "11.2 تُعالج الشكاوى المشروعة حصرًا من خلال آلية تسوية المنازعات المنصوص عليها في البند 13. ويوافق العميل على استنفاد هذه الإجراءات قبل الإدلاء بأي تصريح علني بشأن CW Migration فيما يتعلق بأي نزاع ناشئ عن هذه الاتفاقية.",
    "11.3 تحتفظ CW Migration بحقها في طلب الإنصاف القضائي العاجل والتعويضات وجميع سبل الانتصاف المتاحة بموجب المرسوم بقانون اتحادي رقم 34 لسنة 2021 بشأن مكافحة الشائعات والجرائم الإلكترونية، والمرسوم بقانون اتحادي رقم 31 لسنة 2021 (قانون العقوبات)، وقوانين التشهير المعمول بها في أي اختصاص قضائي ذي صلة (بما في ذلك أستراليا أو كندا أو بلد إقامة العميل)، عن أي إخلال بهذا البند.",
    "11.4 لا يحول هذا البند دون قيام العميل بالإدلاء بتصريحات صادقة وواقعية وغير كيدية عن تجربته مع CW Migration بحسن نية، شريطة أن يكون العميل قد اتبع أولًا إجراءات تسوية المنازعات المنصوص عليها في البند 13.",
  ]],
  ["12. FORCE MAJEURE", [
    "12.1 Neither party is liable for failure to perform obligations caused by events beyond their reasonable control, including acts of God, war, government restrictions, pandemics, or infrastructure failures (\"Force Majeure Event\").",
    "12.2 If a Force Majeure Event continues for more than 90 days, either party may terminate this Agreement. No refund applies in Force Majeure circumstances, other than as strictly provided in Clause 8.",
  ], "12. القوة القاهرة", [
    "12.1 لا يتحمل أي من الطرفين مسؤولية الإخفاق في الوفاء بالتزاماته الناتج عن أحداث خارجة عن إرادته المعقولة، بما في ذلك الكوارث الطبيعية، والحروب، والقيود الحكومية، والأوبئة، أو أعطال البنية التحتية (\"حدث القوة القاهرة\").",
    "12.2 إذا استمر حدث القوة القاهرة لأكثر من 90 يومًا، يحق لأي من الطرفين إنهاء هذه الاتفاقية. ولا ينطبق أي استرداد في ظروف القوة القاهرة، باستثناء ما هو منصوص عليه حصرًا في البند 8.",
  ]],
  ["13. GOVERNING LAW AND DISPUTE RESOLUTION", [
    "13.1 This Agreement is governed by the laws of the United Arab Emirates, specifically the laws applicable in the Emirate of Dubai.",
    "13.2 Disputes shall first be addressed through good-faith negotiations within 21 days of written notice.",
    "13.3 Any dispute, controversy, or claim arising out of or relating to this Agreement, including its existence, validity, interpretation, performance, breach, or termination — including any dispute concerning a refusal, refund, or fee — that is not resolved through negotiation under Clause 13.2 shall be finally and exclusively resolved by arbitration administered by the Dubai International Arbitration Centre (DIAC) in accordance with its Arbitration Rules in force at the time the arbitration is commenced. The seat of arbitration shall be Dubai, UAE. The language of the arbitration shall be English (with Arabic translation available). The tribunal shall consist of one (1) arbitrator appointed in accordance with the DIAC Rules. The arbitral award shall be final and binding on both parties.",
    "13.4 Notwithstanding Clause 13.3, CW Migration reserves the right to seek urgent interim or injunctive relief (including for non-payment, breach of confidentiality, or defamation) from any competent court, without this being deemed a waiver of the arbitration agreement.",
    "13.5 The Client acknowledges that pursuing a dispute through a consumer complaint, regulatory body, or public statement in parallel with, or instead of, the process set out in this Clause does not suspend or waive CW Migration’s right to invoke this Clause 13 or Clause 7 (Indemnification).",
  ], "13. القانون الحاكم وتسوية المنازعات", [
    "13.1 تخضع هذه الاتفاقية لقوانين دولة الإمارات العربية المتحدة، وتحديدًا القوانين السارية في إمارة دبي.",
    "13.2 تُعالج المنازعات أولًا من خلال مفاوضات بحسن نية خلال 21 يومًا من تاريخ الإشعار الكتابي.",
    "13.3 أي نزاع أو خلاف أو مطالبة تنشأ عن أو تتعلق بهذه الاتفاقية، بما في ذلك وجودها أو صحتها أو تفسيرها أو تنفيذها أو الإخلال بها أو إنهاؤها — بما في ذلك أي نزاع يتعلق برفض أو استرداد أو رسوم — ولم تتم تسويته من خلال المفاوضات بموجب البند 13.2، يُحال إلى التحكيم بشكل نهائي وحصري وفقًا لقواعد التحكيم لدى مركز دبي الدولي للتحكيم (DIAC) السارية وقت بدء إجراءات التحكيم. ويكون مقر التحكيم في دبي، الإمارات العربية المتحدة. وتكون لغة التحكيم الإنجليزية (مع توفر ترجمة عربية). وتتألف هيئة التحكيم من محكّم واحد (1) يُعيَّن وفقًا لقواعد DIAC. ويكون قرار التحكيم نهائيًا وملزمًا للطرفين.",
    "13.4 بصرف النظر عن البند 13.3، تحتفظ CW Migration بحقها في طلب الإنصاف القضائي العاجل أو المؤقت (بما في ذلك بخصوص عدم السداد، أو خرق السرية، أو التشهير) من أي محكمة مختصة، دون اعتبار ذلك تنازلًا عن اتفاق التحكيم.",
    "13.5 يقر العميل بأن اللجوء إلى شكوى استهلاكية أو جهة تنظيمية أو تصريح علني بالتوازي مع، أو بدلًا من، الإجراءات المنصوص عليها في هذا البند لا يعلّق أو يُسقط حق CW Migration في الاحتجاج بهذا البند 13 أو البند 7 (التعويض).",
  ]],
  ["14. GENERAL PROVISIONS", [
    "14.1 Entire Agreement: This Agreement, including Annexure A, together with CW Migration’s website terms and any referenced policies as updated from time to time, constitutes the entire agreement between the parties and supersedes all prior discussions, representations, and agreements, whether oral or written.",
    "14.2 Amendments: Amendments require a written instrument signed by both parties, except that CW Migration may update Government/Authority fee estimates without amending this Agreement, as such fees are outside CW Migration’s control.",
    "14.3 Severability: If any provision is found invalid or unenforceable, the remaining provisions continue in full force and effect, and the invalid provision shall be replaced with a valid provision that most closely reflects the parties’ original intent.",
    "14.4 Assignment: The Client may not assign or transfer any rights or obligations under this Agreement without CW Migration’s prior written consent. CW Migration may assign this Agreement to an affiliate or successor entity within the CW Migration group.",
    "14.5 Notices: Any notice under this Agreement shall be in writing and sent by email or registered mail to the addresses on record, and shall be deemed effective on the day of delivery or the next business day if mailed.",
    "14.6 No Waiver: Failure by CW Migration to enforce any provision of this Agreement shall not be construed as a waiver of that or any other provision.",
    "14.7 By signing below, the Client confirms they have read, understood, and had the opportunity to seek independent advice on this Agreement (including its Refund Policy and dispute resolution mechanism) prior to signing, and agrees to be bound by all its terms.",
  ], "14. أحكام عامة", [
    "14.1 الاتفاق الكامل: تشكل هذه الاتفاقية، بما في ذلك الملحق أ، إلى جانب شروط موقع CW Migration وأي سياسات مشار إليها عند تحديثها من وقت لآخر، الاتفاق الكامل بين الطرفين وتحل محل جميع المناقشات والتصريحات والاتفاقيات السابقة، سواء كانت شفهية أو كتابية.",
    "14.2 التعديلات: تستلزم أي تعديلات وثيقة كتابية موقعة من الطرفين، باستثناء أن CW Migration يجوز لها تحديث تقديرات رسوم الحكومة/الجهات المختصة دون تعديل هذه الاتفاقية، حيث إن هذه الرسوم خارجة عن سيطرة CW Migration.",
    "14.3 قابلية الفصل: إذا تبين بطلان أو عدم قابلية إنفاذ أي حكم من أحكام هذه الاتفاقية، تظل الأحكام المتبقية سارية المفعول بالكامل، ويُستبدل الحكم الباطل بحكم صحيح يعكس بأقرب ما يمكن نية الطرفين الأصلية.",
    "14.4 التنازل: لا يجوز للعميل التنازل عن أو نقل أي حقوق أو التزامات بموجب هذه الاتفاقية دون موافقة كتابية مسبقة من CW Migration. ويجوز لـ CW Migration التنازل عن هذه الاتفاقية لشركة تابعة أو خلف ضمن مجموعة CW Migration.",
    "14.5 الإشعارات: يجب أن يكون أي إشعار بموجب هذه الاتفاقية كتابيًا ويُرسل عبر البريد الإلكتروني أو البريد المسجل إلى العناوين المسجلة، ويُعتبر ساريًا في يوم التسليم أو يوم العمل التالي إذا أُرسل بالبريد.",
    "14.6 عدم التنازل: لا يُفسَّر إخفاق CW Migration في إنفاذ أي حكم من أحكام هذه الاتفاقية على أنه تنازل عن ذلك الحكم أو أي حكم آخر.",
    "14.7 بالتوقيع أدناه، يؤكد العميل أنه قرأ وفهم هذه الاتفاقية وأتيحت له الفرصة للحصول على مشورة مستقلة بشأنها (بما في ذلك سياسة الاسترداد وآلية تسوية المنازعات) قبل التوقيع، ويوافق على الالتزام بجميع أحكامها.",
  ]],
];

const PREAMBLE_EN = 'This Client Advisory Agreement ("Agreement") is entered into between Commonwealth Migration Advisor ("CW Migration"), the trading name of Commonwealth Document Clearing Services LLC, a UAE-based migration consultancy, and the Client identified above.<br><br>WHEREAS CW Migration specialises in Australian skilled migration, skills assessment, resume marketing to prospective Australian employers, employer-sponsored visa support, and related document clearing services for individuals in the UAE and the region.<br><br>WHEREAS the Client wishes to engage CW Migration for a Skills Assessment and Resume Marketing service, and has been provided a full opportunity to read, review, and seek independent legal advice in relation to this Agreement prior to execution.<br><br>NOW THEREFORE, in consideration of the mutual covenants herein, the parties agree as follows:';
const PREAMBLE_AR = 'تُبرم اتفاقية الخدمات الاستشارية للعميل هذه ("الاتفاقية") بين مستشار كومنولث للهجرة ("CW Migration")، وهي الاسم التجاري لشركة خدمات كومنولث لتخليص المستندات ذ.م.م، وهي شركة استشارات هجرة مقرها دولة الإمارات العربية المتحدة، وبين العميل المحدد أعلاه.<br><br>حيث تتخصص CW Migration في الهجرة الماهرة إلى أستراليا، وتقييم المهارات، والتسويق للسيرة الذاتية لدى أصحاب العمل المحتملين في أستراليا، ودعم التأشيرات بكفالة صاحب العمل، وخدمات تخليص المستندات ذات الصلة للأفراد في دولة الإمارات العربية المتحدة والمنطقة.<br><br>وحيث يرغب العميل في الاستعانة بـ CW Migration لخدمة تقييم المهارات والتسويق للسيرة الذاتية، وقد أُتيحت له فرصة كاملة لقراءة هذه الاتفاقية ومراجعتها والحصول على مشورة قانونية مستقلة بشأنها قبل توقيعها.<br><br>لذلك، وبناءً على التعهدات المتبادلة الواردة في هذه الاتفاقية، يتفق الطرفان على ما يلي:';

export function renderSkillsResumeMarketingAgreement(v: SkillsResumeAgreementValues): string {
  const currencyCode = v.currencyCode || COMPANY.currencyCode;
  const agreementNumber = textOrBlank(v.agreementNumber);
  const agreementDate = textOrBlank(v.agreementDate);
  const agreementExpiryDate = addMonthsToDisplayDate(v.agreementDate, 6);
  const clientName = textOrBlank(v.clientName);
  const nationality = textOrBlank(v.nationality);
  const passportNumber = textOrBlank(v.passportNumber);
  const clientPhone = textOrBlank(v.clientPhone);
  const clientEmail = textOrBlank(v.clientEmail);
  const isExisting = v.caseType === 'existing';
  const existingFee = textOrBlank(v.professionalFee, '____________');
  const initialPayment = textOrBlank(v.initialPayment, '____________');
  // A blank or zero instalment means "no balance payment" - show the blank
  // template line instead of "AED 0".
  const secondPaymentRaw = String(v.secondPayment ?? '').trim();
  const secondPayment = Number(secondPaymentRaw.replace(/,/g, '')) > 0 ? secondPaymentRaw : '';
  const secondPaymentDue = textOrBlank(v.secondPaymentDue, '____________');
  const occupation = String(v.occupation ?? '').trim();
  const assessingAuthority = String(v.assessingAuthority ?? '').trim();
  const specialTerms = String(v.specialTerms ?? '').trim();

  const mark = (on: boolean) => (on ? '☒' : '☐');
  const caseTypeEn = `${mark(!isExisting)} Fresh Case   ${mark(isExisting)} Existing Positive Skills Assessment`;

  const clauseHtml = clauses.map(([enTitle, enBody, arTitle, arBody]) =>
    clauseSection(enTitle, enBody, arTitle, arBody)).join('');

  const optionalScopeRows = [
    occupation ? row('Nominated Occupation', occupation, 'المهنة المرشّحة') : '',
    assessingAuthority ? row('Assessing Authority', assessingAuthority, 'جهة التقييم') : '',
  ].join('');

  const balanceRow = secondPayment
    ? row('Balance Payment', `${currencyCode} ${secondPayment} — Due: ${secondPaymentDue}`, 'الدفعة المتبقية', `${currencyCode} ${secondPayment} — تستحق: ${secondPaymentDue}`)
    : row('Balance Payment (if any)', `${currencyCode} ____________ — Due: ____________`, 'الدفعة المتبقية (إن وجدت)', `${currencyCode} ____________ — تستحق: ____________`);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Client Advisory Agreement ${esc(agreementNumber)}</title>
${agreementStyles()}
</head>
<body>
  <main class="document">
    ${logoHtml()}
    <header class="letterhead">
      <div class="en">
        <div class="company-name">${esc(COMPANY.brandEn.toUpperCase())}</div>
        <div class="trading-as">Legal Name: ${esc(COMPANY.nameEn)}</div>
        <div class="addr">${esc(COMPANY.addressEn)}</div>
        <div class="addr">${esc(COMPANY.contactEn)}</div>
      </div>
      <div class="ar" dir="rtl" lang="ar">
        <div class="company-name">${esc(COMPANY.brandAr)}</div>
        <div class="trading-as">الاسم القانوني: ${esc(COMPANY.nameAr)}</div>
        <div class="addr">${esc(COMPANY.addressAr)}</div>
        <div class="addr">${esc(COMPANY.contactAr)}</div>
      </div>
    </header>

    <div class="title-bar">
      <span class="en">CLIENT ADVISORY AGREEMENT</span>
      <span class="ar" dir="rtl" lang="ar">اتفاقية استشارية للعميل</span>
    </div>

    ${section('AGREEMENT DETAILS', 'تفاصيل الاتفاقية', [
      row('Agreement No.', agreementNumber, 'رقم الاتفاقية'),
      row('Date', agreementDate, 'التاريخ'),
      row('Date of Expiry', `${agreementExpiryDate} (6 months from date of signing)`, 'تاريخ الانتهاء', `${agreementExpiryDate} (6 أشهر من تاريخ التوقيع)`),
      row('Service Program', 'Skills Assessment + Resume Marketing', 'برنامج الخدمة', 'تقييم المهارات + التسويق للسيرة الذاتية'),
      row('Country', 'Australia', 'الدولة', 'أستراليا'),
    ].join(''))}

    ${section('SERVICE PROVIDER', 'مقدم الخدمة', [
      row('Legal Name', COMPANY.nameEn, 'الاسم القانوني', COMPANY.nameAr),
      row('Trading As', COMPANY.tradingAsEn, 'يعمل تحت اسم', COMPANY.tradingAsAr),
      row('Address', COMPANY.addressEn, 'العنوان', COMPANY.addressAr),
    ].join(''))}

    ${section('CLIENT DETAILS', 'بيانات العميل', [
      row('Full Name', clientName, 'الاسم الكامل'),
      row('Nationality', nationality, 'الجنسية'),
      row('Passport No.', passportNumber, 'رقم جواز السفر'),
      row('Phone', clientPhone, 'الهاتف'),
      row('Email', clientEmail, 'البريد الإلكتروني'),
    ].join(''))}

    ${section('FEE SUMMARY', 'ملخص الرسوم', [
      row('Case Type', caseTypeEn, 'نوع الحالة', `${mark(!isExisting)} حالة جديدة   ${mark(isExisting)} تقييم مهارات إيجابي قائم`),
      row('Professional Fee — Fresh Case', `${currencyCode} ${FRESH_CASE_FEE} (fixed, non-refundable)`, 'الأتعاب المهنية — حالة جديدة', `${currencyCode} ${FRESH_CASE_FEE} (مبلغ ثابت، غير قابل للاسترداد)`),
      row('Professional Fee — Existing Positive Skills Assessment', `${currencyCode} ${existingFee} (as adjusted by the consultant)`, 'الأتعاب المهنية — تقييم مهارات إيجابي قائم', `${currencyCode} ${existingFee} (وفق تعديل المستشار)`),
      row('Resume Marketing', 'Included — no additional charges', 'التسويق للسيرة الذاتية', 'مشمول — دون أي رسوم إضافية'),
      row('Skills Assessment Authority Fees', 'NOT INCLUDED — vary by occupation; paid by Client directly', 'رسوم جهة تقييم المهارات', 'غير مشمولة — تختلف حسب المهنة؛ يدفعها العميل مباشرة'),
      row('Government / Authority Fees', 'NOT INCLUDED — paid by Client directly (see Clause 5.5)', 'رسوم الحكومة / الجهات المختصة', 'غير مشمولة — يدفعها العميل مباشرة (انظر البند 5.5)'),
      row('VAT', 'Applicable per UAE VAT Law', 'ضريبة القيمة المضافة', 'مطبقة وفق قانون ضريبة القيمة المضافة الإماراتي'),
    ].join(''))}

    <section class="cmg-block cmg-clause preamble">
      ${sectionHeader('PREAMBLE', 'تمهيد')}
      <div class="cmg-rows"><div class="cmg-row">
        <div class="en">${PREAMBLE_EN}</div>
        <div class="ar" dir="rtl" lang="ar">${PREAMBLE_AR}</div>
      </div></div>
    </section>

    ${clauseHtml}

    <div class="annexure-title">
      <span class="en">ANNEXURE A — SCOPE OF SERVICES AND FEE SCHEDULE</span>
      <span class="ar" dir="rtl" lang="ar">الملحق أ — نطاق الخدمات وجدول الرسوم</span>
    </div>

    ${section('SERVICES TO BE PROVIDED', 'الخدمات المقدمة', [
      row('Service Description', 'Skills Assessment + Resume Marketing — Australia', 'وصف الخدمة', 'تقييم المهارات + التسويق للسيرة الذاتية — أستراليا'),
      optionalScopeRows,
      row('Scope Excludes', 'Visa lodgement; PR application (separate agreement); Assessing Authority, government and test fees; job placement guarantee; legal representation; services not listed above', 'يستثني النطاق', 'تقديم طلب التأشيرة؛ طلب الإقامة الدائمة (باتفاقية منفصلة)؛ رسوم جهة التقييم والرسوم الحكومية ورسوم الاختبارات؛ ضمان التوظيف؛ التمثيل القانوني؛ الخدمات غير المذكورة أعلاه'),
      row('Term', '6 months from date of signing (Skills Assessment + Resume Marketing)', 'المدة', '6 أشهر من تاريخ التوقيع (تقييم المهارات + التسويق للسيرة الذاتية)'),
    ].join(''))}

    ${section('FEE SCHEDULE', 'جدول الرسوم', [
      row('Initial Payment', `${currencyCode} ${initialPayment} — Due upon signing`, 'الدفعة الأولى', `${currencyCode} ${initialPayment} — تستحق عند التوقيع`),
      balanceRow,
      row('Resume Marketing', 'Included — no additional charges', 'التسويق للسيرة الذاتية', 'مشمول — دون أي رسوم إضافية'),
      row('Assessing Authority Fee', 'NOT INCLUDED — depends on occupation; paid directly by Client', 'رسوم جهة التقييم', 'غير مشمولة — تعتمد على المهنة؛ يدفعها العميل مباشرة'),
      row('Employer Sponsorship', 'No additional CW Migration fee; government fees (if payable by Client) paid directly to the Authority', 'كفالة صاحب العمل', 'لا توجد رسوم إضافية لـ CW Migration؛ والرسوم الحكومية (إن كانت مستحقة على العميل) تُدفع مباشرة إلى الجهة المختصة'),
      row('PR Application (if no job secured)', 'Separate agreement with separate charges, covering the complete family', 'طلب الإقامة الدائمة (في حال عدم الحصول على وظيفة)', 'اتفاقية منفصلة برسوم منفصلة، تشمل الأسرة بالكامل'),
      row('VAT', 'Applicable per UAE VAT Law', 'ضريبة القيمة المضافة', 'مطبقة وفق قانون ضريبة القيمة المضافة الإماراتي'),
      row('Refund', 'Non-refundable, except strictly under Clauses 8.3 and 8.8', 'الاسترداد', 'غير قابل للاسترداد، إلا وفق ما هو منصوص عليه حصرًا في البندين 8.3 و8.8'),
      specialTerms ? row('Special Terms', specialTerms, 'شروط خاصة') : '',
    ].join(''))}

    <div class="cmg-block signature-block">
      <div class="cmg-rows">
        <div class="cmg-row">
          <div class="en">Client Signature: ________________________________<br><br>Name: ________________________________<br><br>Date: ________________________________</div>
          <div class="ar" dir="rtl" lang="ar">توقيع العميل: ________________________________<br><br>الاسم: ________________________________<br><br>التاريخ: ________________________________</div>
        </div>
        <div class="cmg-row">
          <div class="en">For and on Behalf of ${esc(COMPANY.brandEn)} (${esc(COMPANY.nameEn)})<br><br>Authorised Signature: ________________________________<br><br>Name: ________________________________<br><br>Date: ________________________________</div>
          <div class="ar" dir="rtl" lang="ar">نيابة عن ولصالح ${esc(COMPANY.brandAr)} (${esc(COMPANY.nameAr)})<br><br>التوقيع المعتمد: ________________________________<br><br>الاسم: ________________________________<br><br>التاريخ: ________________________________</div>
        </div>
      </div>
    </div>

    <footer class="print-footer">
      <span>${esc(COMPANY.brandEn)} — ${esc(COMPANY.addressEn)}</span>
    </footer>
  </main>
</body>
</html>`;
}
