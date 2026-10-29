// Bilingual (EN/AR) "Client Advisory Agreement" — Dubai branch, operating as
// CW Migration Advisor (CW Migration) / Commonwealth Document Clearing
// Services LLC, a UAE migration consultancy.
//
// Transcribed verbatim (English) from the reference PDF
// ("CW_Migration_Advisor_Client_Advisory_Agreement_FINAL-2.pdf") with a
// professional Arabic translation carrying the same legal meaning. The PDF is
// destination-neutral (one agreement, several services, generic "Regulator"),
// so the Service / Fee fields below stay dynamic. This single file is the only
// agreement renderer in the app — see renderAgreementForBranch.ts.

import { BRAND_LOGO_DATA_URI, BRAND_ICON_DATA_URI } from './brandLogo';

export const esc = (value: unknown) => String(value ?? '')
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
  // shape (renderAgreementForBranch.ts) — not rendered by this template
  // (the reference Client Details table has no Occupation/ID row).
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
  // true (default) = a MARA-registered agent handles the visa work, so the
  // Service Provider block names the agent/MARN and the OMARA clauses apply.
  // false = CW Migration's own (non-MARA) agreement: no agent/MARN rows and
  // the MARA/OMARA wording is left out.
  maraAgent?: boolean;
  // Registered Representative (MARA agent, RCIC, etc.) who handles the visa
  // work (Service Provider block).
  registeredMigrationAgent?: string;
  marn?: string;
  // Plain formatted number - the "current estimate" of Government / Authority fees.
  governmentFeeEstimate?: string;
  // Optional Annexure A fee breakdown (plain formatted numbers). When omitted,
  // VAT reads "As per UAE VAT Law" and Total Payable equals the retainer fee.
  vatAmount?: string;
  totalPayable?: string;
}

// Fixed branch identity — CW Migration Advisor, Dubai. The registered entity is
// Commonwealth Document Clearing Services LLC; "CW Migration Advisor" /
// "CW Migration" is its trading name.
export const COMPANY = {
  brandEn: 'CW Migration Advisor',
  brandAr: 'سي دبليو مستشار الهجرة',
  nameEn: 'Commonwealth Document Clearing Services LLC',
  nameAr: 'كومنولث لتخليص المستندات ذ.م.م',
  tradingAsEn: 'CW Migration Advisor ("CW Migration")',
  tradingAsAr: 'سي دبليو مستشار الهجرة ("CW Migration")',
  addressEn: 'Office 307, 3rd Floor, Business Atrium Building, Oud Metha, Dubai, UAE',
  addressAr: 'مكتب 307، الطابق الثالث، مبنى بزنس أتريوم، عود ميثاء، دبي، الإمارات العربية المتحدة',
  regulatoryEn: 'Regulated and registered migration agents and licensed representatives',
  regulatoryAr: 'وكلاء هجرة مرخصون ومسجلون وممثلون مرخصون',
  contactEn: 'info@cwmigration.com | cwmigration.com',
  contactAr: 'info@cwmigration.com | cwmigration.com',
  currencyCode: 'AED',
};

// The 14 clauses, verbatim (English) from the signed PDF, in its own order/numbering.
const clauses: Array<[string, string[], string, string[]]> = [
  ['1. DEFINITIONS AND INTERPRETATION', [
    '1.1 "CW Migration" means CW Migration Advisor, the trading name of Commonwealth Document Clearing Services LLC, together with its officers, employees, agents, branches and authorised representatives in the UAE and the region.',
    '1.2 "Client" means the individual(s) named in this Agreement who has/have engaged CW Migration for migration consultancy services, including all family members included in the same application.',
    '1.3 "Services" means only the immigration consultancy services specified in Annexure A.',
    '1.4 "Retainer Fee" means the professional fees payable to CW Migration as detailed in Annexure A.',
    '1.5 "Government / Authority Fees" means all fees payable to immigration departments, skills assessment bodies, provincial/state/territory bodies, educational institutions, language testing bodies, embassies and visa application centres, or any other government or quasi-government body. These are excluded from the Retainer Fee and are the Client’s sole responsibility.',
    '1.6 "Refusal" or "Rejection" means any negative decision, refusal, cancellation, withdrawal-deemed-refusal, or non-approval issued by an Authority in respect of any application lodged under this Agreement.',
    '1.7 "Regulator" means the professional body that regulates the Registered Representative named in this Agreement (for example, OMARA in Australia for MARA-registered agents, or the College of Immigration and Citizenship Consultants (CICC) in Canada for RCICs), and "Registration Number" means the registration or licence number issued by that Regulator.',
    '1.8 "DIAC" means the Dubai International Arbitration Centre.',
    '1.9 Interpretation: words importing the singular include the plural and vice versa; references to any statutory provision include modifications or re-enactments; headings are for convenience only and do not affect interpretation.',
  ], '1. التعريفات والتفسير', [
    '1.1 تعني "CW Migration" سي دبليو مستشار الهجرة، وهي الاسم التجاري لشركة خدمات كومنولث لتخليص المستندات ذ.م.م، وموظفيها ومسؤوليها ووكلائها وفروعها وممثليها المعتمدين في دولة الإمارات العربية المتحدة والمنطقة.',
    '1.2 يعني "العميل" الشخص أو الأشخاص المحددة أسماؤهم في هذه الاتفاقية والذين استعانوا بـ CW Migration للحصول على خدمات استشارات الهجرة، بما في ذلك جميع أفراد الأسرة المدرجين في الطلب ذاته.',
    '1.3 تعني "الخدمات" حصرًا خدمات استشارات الهجرة المحددة في الملحق (أ).',
    '1.4 تعني "رسوم الاحتفاظ" الأتعاب المهنية المستحقة لـ CW Migration كما هو مفصل في الملحق (أ).',
    '1.5 تعني "رسوم الحكومة / الجهات المختصة" جميع الرسوم المستحقة لدوائر الهجرة، أو جهات تقييم المهارات، أو هيئات المقاطعات/الولايات/الأقاليم، أو المؤسسات التعليمية، أو جهات اختبار اللغة، أو السفارات ومراكز استقبال طلبات التأشيرة، أو أي جهة حكومية أو شبه حكومية أخرى. وهذه الرسوم مستثناة من رسوم الاحتفاظ وتقع على عاتق العميل وحده.',
    '1.6 يعني "الرفض" أي قرار سلبي، أو رفض، أو إلغاء، أو سحب يُعامل كرفض، أو عدم موافقة صادر عن جهة مختصة بخصوص أي طلب مقدم بموجب هذه الاتفاقية.',
    '1.7 تعني "الجهة المنظِّمة" الهيئة المهنية التي تنظم عمل الممثل المسجل المذكور في هذه الاتفاقية (مثل OMARA في أستراليا للوكلاء المسجلين لدى MARA، أو الكلية الكندية لمستشاري الهجرة والجنسية (CICC) في كندا لمستشاري RCIC)، وتعني "رقم التسجيل" رقم التسجيل أو الترخيص الصادر عن تلك الجهة.',
    '1.8 يعني "DIAC" مركز دبي الدولي للتحكيم.',
    '1.9 التفسير: تشمل الكلمات الدالة على المفرد الجمع والعكس صحيح؛ وتشمل الإشارات إلى أي حكم قانوني أي تعديلات أو إعادة سنّه؛ والعناوين لغرض التيسير فقط ولا تؤثر على التفسير.',
  ]],
  ['2. SCOPE OF SERVICES', [
    '2.1 CW Migration agrees to provide only the Services specified in Annexure A, including: (a) pre-application eligibility assessment, (b) document review and preparation, (c) submission and follow-up of the application, (d) liaison with the relevant Authority, and (e) general consultation and advice.',
    '2.2 Services are strictly limited to migration consultancy and do not include legal representation, legal advice, or courtroom/tribunal representation of any kind.',
    '2.3 Any services beyond the scope of Annexure A (including refiling, appeals, reassessment, additional family members, or a change of visa subclass/program) require a separate written agreement and additional fees.',
    '2.4 CW Migration may engage third-party agents, registered agents, translators, or assessors to fulfil part of the Services. The Client consents to CW Migration sharing their information with such third parties strictly for the purpose of providing the Services.',
    '2.5 All immigration assistance in relation to any visa or immigration application under this Agreement that is regulated by a Regulator shall be provided by, or under the direct supervision of, the Registered Representative (MARA, RCIC or other licensed representative) named above. CW Migration’s UAE staff provide administrative, document and client-liaison support only.',
    '2.6 Service-specific terms. For each service selected in Annexure A: (a) Permanent Residence / Skilled Migration — CW Migration prepares and submits the profile, expression of interest or application; invitations, nominations and decisions rest solely with the Authorities; (b) Skills Assessment — CW Migration prepares and submits the file to the relevant assessing body, whose outcome and processing time are not controlled by CW Migration; (c) Student Visa — admission, scholarships and the visa decision rest solely with the institution and the Authority; (d) Resume Marketing — CW Migration prepares the Client’s resume and profile and circulates or applies to employers and job portals on the Client’s behalf; this is a career-support service, not an immigration service, and does not guarantee interviews, job offers or employment; (e) Visit Visas — CW Migration prepares and submits the application; the decision and the permitted duration of stay rest solely with the Authority; and (f) any other service listed on cwmigration.com and selected in Annexure A — as described on that website at the date of signing and detailed in Annexure A.',
    '2.7 One agreement, several services. This Agreement may cover one or more services selected in Annexure A. Fees are itemised per service, and each service is treated separately for the purposes of Clause 8 (Refund Policy); an outcome in one service does not affect fees due for another. Service descriptions on cwmigration.com are for information only, and Annexure A prevails if they differ.',
  ], '2. نطاق الخدمات', [
    '2.1 توافق CW Migration على تقديم الخدمات المحددة في الملحق (أ) فقط، وتشمل: (أ) تقييم الأهلية قبل التقديم، (ب) مراجعة وإعداد المستندات، (ج) تقديم الطلب ومتابعته، (د) التواصل مع الجهة المختصة ذات الصلة، و(هـ) الاستشارة والمشورة العامة.',
    '2.2 تقتصر الخدمات حصرًا على الاستشارات المتعلقة بالهجرة ولا تشمل التمثيل القانوني أو المشورة القانونية أو التمثيل أمام المحاكم أو الهيئات القضائية بأي شكل.',
    '2.3 أي خدمات تتجاوز نطاق الملحق (أ) (بما في ذلك إعادة التقديم، أو الطعون، أو إعادة التقييم، أو إضافة أفراد أسرة، أو تغيير فئة/برنامج التأشيرة) تستلزم اتفاقية مكتوبة منفصلة ورسومًا إضافية.',
    '2.4 يجوز لـ CW Migration الاستعانة بوكلاء من أطراف ثالثة، أو وكلاء مسجلين، أو مترجمين، أو مقيّمين لتنفيذ جزء من الخدمات. ويوافق العميل على مشاركة CW Migration لمعلوماته مع هذه الأطراف الثالثة حصرًا لغرض تقديم الخدمات.',
    '2.5 تُقدَّم جميع أعمال المساعدة في الهجرة المتعلقة بأي طلب تأشيرة أو هجرة بموجب هذه الاتفاقية والخاضعة لتنظيم جهة منظِّمة من قبل الممثل المسجل (وكيل MARA أو RCIC أو أي ممثل مرخص آخر) المذكور أعلاه، أو تحت إشرافه المباشر. ويقتصر دور موظفي CW Migration في دولة الإمارات على الدعم الإداري ودعم المستندات والتواصل مع العملاء.',
    '2.6 شروط خاصة بالخدمات. بالنسبة لكل خدمة محددة في الملحق (أ): (أ) الإقامة الدائمة / الهجرة للعمالة الماهرة — تُعدّ CW Migration الملف أو التعبير عن الاهتمام أو الطلب وتقدمه؛ وتقع الدعوات والترشيحات والقرارات حصرًا على عاتق الجهات المختصة؛ (ب) تقييم المهارات — تُعدّ CW Migration الملف وتقدمه إلى جهة التقييم المعنية، ولا تتحكم CW Migration في نتيجته أو مدة معالجته؛ (ج) التأشيرة الدراسية — يخضع القبول والمنح الدراسية وقرار التأشيرة حصرًا للمؤسسة التعليمية والجهة المختصة؛ (د) تسويق السيرة الذاتية — تُعدّ CW Migration السيرة الذاتية للعميل وملفه المهني وتعممها أو تتقدم بها إلى أصحاب العمل ومواقع التوظيف نيابةً عنه؛ وهذه خدمة دعم وظيفي وليست خدمة هجرة، ولا تتضمن ضمان مقابلات أو عروض عمل أو توظيف؛ (هـ) تأشيرات الزيارة — تُعدّ CW Migration الطلب وتقدمه؛ ويخضع القرار ومدة الإقامة المسموح بها حصرًا للجهة المختصة؛ (و) أي خدمة أخرى مدرجة على cwmigration.com ومحددة في الملحق (أ) — وفق وصفها على ذلك الموقع في تاريخ التوقيع وكما هو مفصل في الملحق (أ).',
    '2.7 اتفاقية واحدة لعدة خدمات. يجوز أن تغطي هذه الاتفاقية خدمة واحدة أو أكثر من الخدمات المحددة في الملحق (أ). وتُفصَّل الرسوم لكل خدمة على حدة، وتُعامل كل خدمة بشكل مستقل لأغراض البند 8 (سياسة الاسترداد)؛ ولا تؤثر نتيجة إحدى الخدمات على الرسوم المستحقة عن خدمة أخرى. وأوصاف الخدمات على cwmigration.com للعلم فقط، وتسود أحكام الملحق (أ) عند أي اختلاف.',
  ]],
  ['3. NO GUARANTEE OF OUTCOME', [
    '3.1 CW Migration does not guarantee, represent, or warrant the success, approval, timeline, or positive outcome of any visa application, skills assessment, expression of interest, nomination, or immigration process.',
    '3.2 All decisions are made solely by the relevant Authorities (including immigration departments, embassies, skills assessment bodies, educational institutions, and provincial/state/territory nomination authorities). CW Migration has no influence over Authority decisions, processing times, occupation lists, invitation rounds, or points thresholds, and accepts no liability for them.',
    '3.3 CW Migration is not liable for any changes in immigration laws, policies, occupation lists, invitation scores, quotas, or processing times occurring after the signing of this Agreement.',
    '3.4 An unsuccessful, delayed, or partially successful outcome does not, by itself, entitle the Client to any refund except strictly as stated in Clause 8 (Refund Policy).',
    '3.5 No verbal or written representation made by any CW Migration employee, agent, or representative outside this Agreement constitutes a guarantee of outcome. The Client agrees not to rely on any such representation and confirms that no such promise induced them to sign this Agreement.',
    '3.6 The Client acknowledges that CW Migration has conducted only a preliminary assessment based on the information and documents provided by the Client, and that eligibility may change if the information provided is incomplete, inaccurate, or later found to be incorrect.',
  ], '3. عدم ضمان النتائج', [
    '3.1 لا تضمن CW Migration ولا تقر ولا تكفل نجاح أو الموافقة على أو المدة الزمنية أو تحقيق نتيجة إيجابية لأي طلب تأشيرة، أو تقييم مهارات، أو تعبير عن الاهتمام، أو ترشيح، أو إجراء هجرة.',
    '3.2 تُتخذ جميع القرارات حصرًا من قبل الجهات المختصة ذات الصلة (بما في ذلك دوائر الهجرة والسفارات وجهات تقييم المهارات والمؤسسات التعليمية وجهات الترشيح في المقاطعات/الولايات/الأقاليم). ولا تملك CW Migration أي تأثير على قرارات هذه الجهات، أو مدد المعالجة، أو قوائم المهن، أو جولات الدعوة، أو حدود النقاط، ولا تتحمل أي مسؤولية عنها.',
    '3.3 لا تتحمل CW Migration مسؤولية أي تغييرات في قوانين أو سياسات الهجرة، أو قوائم المهن، أو درجات الدعوة، أو الحصص، أو مدد المعالجة التي تطرأ بعد توقيع هذه الاتفاقية.',
    '3.4 لا تخوّل النتيجة غير الناجحة أو المتأخرة أو الناجحة جزئيًا، بحد ذاتها، العميل الحق في أي استرداد إلا وفق ما هو منصوص عليه حصرًا في البند 8 (سياسة الاسترداد).',
    '3.5 لا يشكل أي تصريح شفهي أو كتابي يصدر عن أي موظف أو وكيل أو ممثل لدى CW Migration خارج نطاق هذه الاتفاقية ضمانًا لأي نتيجة، ويوافق العميل على عدم الاعتماد على أي تصريح من هذا القبيل ويؤكد أن لا وعد من هذا النوع كان الدافع لتوقيعه هذه الاتفاقية.',
    '3.6 يقر العميل بأن CW Migration أجرت تقييمًا أوليًا فقط استنادًا إلى المعلومات والمستندات التي قدمها العميل، وأن الأهلية قد تتغير إذا كانت المعلومات المقدمة ناقصة أو غير دقيقة أو تبين لاحقًا أنها غير صحيحة.',
  ]],
  ['4. CLIENT OBLIGATIONS AND REPRESENTATIONS', [
    '4.1 The Client warrants that all information and documents provided to CW Migration are true, accurate, complete, current, and not misleading, and accepts full responsibility for the accuracy of all submissions, forms, and documents signed prior to submission to CW Migration.',
    '4.2 The Client shall promptly (and in any event within the timeframe specified by CW Migration or the relevant Authority) provide all documents and information requested, including for Skills Assessment (within 15 days of signing this Agreement, unless otherwise agreed) and for English proficiency test results (within 90–120 days of signing this Agreement). Any delay by the Client that adversely affects the application, including a lapse of validity of the Skills Assessment, Expression of Interest, or invitation, is the Client’s sole responsibility and does not entitle the Client to any refund.',
    '4.3 The Client warrants that they and their dependents do not have any severe communicable medical condition, criminal record, or security issue that may affect the application, and that all medical, criminal, and security background checks mandated by the Authority must be passed. CW Migration is not liable for any refusal resulting from adverse findings during such checks.',
    '4.4 The Client shall maintain sufficient, legally sourced, and verifiable settlement/proof-of-funds as mandated by the Authority, and is solely responsible for presenting such proof during the application process and upon arrival. CW Migration does not offer assistance with travel arrangements or fund transfers.',
    '4.5 The Client shall NOT contact any immigration Authority, embassy, government body, lawyer, agent, or employer directly without prior written approval from CW Migration during the term of this Agreement. If such unauthorised contact negatively affects the application, CW Migration shall not be liable for the outcome and no refund shall be issued.',
    '4.6 The Client shall maintain respectful and professional conduct with all CW Migration employees. Abusive, threatening, or inappropriate conduct constitutes a material breach and may result in immediate termination without refund and without notice, and may result in legal action against the Client.',
    '4.7 The Client shall not provide false, fraudulent, forged, or misleading documents. CW Migration has a legal and ethical duty to report suspected fraudulent documents to the relevant Authorities, and any such conduct forfeits the Client’s right to any refund under this Agreement.',
    '4.8 The Client shall not take any action (such as resigning from employment, selling assets, or making financial or family commitments) in anticipation of a visa grant or positive outcome. CW Migration accepts no liability for such actions and no refund shall be payable in connection with losses arising from them.',
    '4.9 All documentation must be provided in English or accompanied by a certified legal translation, with a sworn statement from a qualified translator (who may not be the Client or a relative of the Client).',
    '4.10 The Client agrees to attend all interviews, medical examinations, biometric appointments, and other requirements within the stipulated timeframe. Failure to do so, without CW Migration’s fault, relieves CW Migration of liability for any adverse outcome and does not entitle the Client to a refund.',
    '4.11 The Client shall not instruct their bank or financial institution to reverse, dispute, charge back, or dishonour any payment made to CW Migration. Any bounced cheque or reversed payment (‘chargeback’) shall be treated as a material breach entitling CW Migration to suspend Services immediately and to recover the amount plus reasonable recovery costs, and forfeits the Client’s eligibility for any refund under Clause 8.',
    '4.12 The Client shall NOT pay, offer, or agree to provide any money or benefit to an employer, sponsor, or any third party in exchange for a job offer, nomination, or sponsorship. CW Migration will never request such a payment. Any such arrangement may breach the laws of the destination country and is entirely at the Client’s own risk.',
  ], '4. التزامات العميل وإقراراته', [
    '4.1 يقر العميل بأن جميع المعلومات والمستندات المقدمة إلى CW Migration صحيحة ودقيقة وكاملة وحديثة وغير مضللة، ويتحمل العميل المسؤولية الكاملة عن دقة جميع المستندات والنماذج التي يوقّعها قبل تقديمها إلى CW Migration.',
    '4.2 يجب على العميل أن يقدم فورًا (وفي جميع الأحوال ضمن الإطار الزمني الذي تحدده CW Migration أو الجهة المختصة) جميع المستندات والمعلومات المطلوبة، بما في ذلك ما يخص تقييم المهارات (خلال 15 يومًا من توقيع هذه الاتفاقية، ما لم يُتفق على خلاف ذلك) ونتائج اختبار الكفاءة في اللغة الإنجليزية (خلال 90 إلى 120 يومًا من توقيع هذه الاتفاقية). وأي تأخر من جانب العميل يؤثر سلبًا على الطلب، بما في ذلك انتهاء صلاحية تقييم المهارات أو التعبير عن الاهتمام أو الدعوة، يقع على عاتق العميل وحده ولا يخوّله الحق في أي استرداد.',
    '4.3 يقر العميل بأنه هو وأفراد عائلته لا يعانون من أي حالة طبية معدية خطيرة أو سجل جنائي أو مشكلة أمنية قد تؤثر على الطلب، وأنه يجب اجتياز جميع الفحوصات الطبية والجنائية والأمنية التي تفرضها الجهة المختصة بنجاح. ولن تكون CW Migration مسؤولة عن أي رفض ناتج عن نتائج سلبية أثناء هذه الفحوصات.',
    '4.4 يجب على العميل الاحتفاظ بأموال تسوية/إثبات مالي كافية ومن مصادر قانونية وقابلة للتحقق وفقًا لما تفرضه الجهة المختصة، ويتحمل وحده مسؤولية تقديم هذا الإثبات أثناء إجراء التقديم وعند الوصول. ولا تقدم CW Migration المساعدة في ترتيبات السفر أو تحويل الأموال.',
    '4.5 لا يجوز للعميل التواصل مع أي جهة هجرة، أو سفارة، أو جهة حكومية، أو محامٍ، أو وكيل، أو رب عمل بشكل مباشر دون الحصول على موافقة كتابية مسبقة من CW Migration طوال مدة هذه الاتفاقية. وإذا أثر هذا التواصل غير المصرح به سلبًا على الطلب، فلن تكون CW Migration مسؤولة عن النتيجة ولن يُصدر أي استرداد.',
    '4.6 يلتزم العميل بالحفاظ على سلوك محترم ومهني مع جميع موظفي CW Migration. ويشكل أي سلوك مسيء أو تهديدي أو غير لائق إخلالًا جوهريًا قد يؤدي إلى إنهاء فوري دون استرداد ودون إشعار، وقد يؤدي إلى اتخاذ إجراءات قانونية ضد العميل.',
    '4.7 لا يجوز للعميل تقديم مستندات كاذبة أو احتيالية أو مزورة أو مضللة. وتلتزم CW Migration قانونيًا وأخلاقيًا بالإبلاغ عن أي مستندات يُشتبه في تزويرها للجهات المختصة، ويسقط حق العميل في أي استرداد بموجب هذه الاتفاقية في حال ثبوت ذلك.',
    '4.8 لا يجوز للعميل اتخاذ أي إجراء (مثل الاستقالة من العمل، أو بيع الأصول، أو الالتزام بتعهدات مالية أو أسرية) تحسبًا للحصول على تأشيرة أو نتيجة إيجابية. ولا تتحمل CW Migration أي مسؤولية عن مثل هذه الإجراءات ولن يُستحق أي استرداد فيما يتعلق بالخسائر الناشئة عنها.',
    '4.9 يجب أن تكون جميع المستندات باللغة الإنجليزية أو مصحوبة بترجمة قانونية معتمدة، مع بيان مشفوع بالقسم من مترجم مؤهل (لا يجوز أن يكون العميل أو أحد أقاربه).',
    '4.10 يوافق العميل على حضور جميع المقابلات والفحوصات الطبية ومواعيد البصمة البيومترية والمتطلبات الأخرى ضمن الإطار الزمني المحدد. وعدم القيام بذلك، دون تقصير من CW Migration، يعفي CW Migration من المسؤولية عن أي نتيجة سلبية ولا يخوّل العميل الحق في استرداد.',
    '4.11 لا يجوز للعميل إصدار تعليمات لبنكه أو مؤسسته المالية بعكس أو الاعتراض على أو استرجاع أو رفض أي دفعة مقدمة إلى CW Migration. ويُعامل أي شيك مرتجع أو دفعة معكوسة ("chargeback") كإخلال جوهري يخوّل CW Migration تعليق الخدمات فورًا واسترداد المبلغ بالإضافة إلى تكاليف التحصيل المعقولة، ويسقط أهلية العميل لأي استرداد بموجب البند 8.',
    '4.12 لا يجوز للعميل دفع أو عرض أو الموافقة على تقديم أي مبلغ مالي أو منفعة إلى صاحب عمل أو كفيل أو أي طرف ثالث مقابل الحصول على عرض عمل أو ترشيح أو كفالة. ولن تطلب CW Migration أبدًا مثل هذه الدفعة. وقد يخالف أي ترتيب من هذا القبيل قوانين بلد الوجهة ويكون على مسؤولية العميل الخاصة بالكامل.',
  ]],
  ['5. FEES AND PAYMENT', [
    '5.1 The Client agrees to pay the Retainer Fee per the schedule in Annexure A.',
    '5.2 All Government / Authority fees are entirely the Client’s responsibility and are not covered by this Agreement, regardless of whether CW Migration assists in submitting such payments. Any estimate of such fees provided by CW Migration is indicative only and subject to change by the Authority.',
    '5.3 Non-payment of any instalment may result in immediate suspension or termination of Services without notice or refund.',
    '5.4 CW Migration may withhold submission of any application, EOI, or nomination until all outstanding fees are paid in full.',
    '5.5 Any amount not paid within 7 days of its due date shall accrue interest at the rate of 1.5% per month (or the maximum rate permitted by UAE law, whichever is lower) from the due date until the date of actual payment.',
    '5.6 In the event CW Migration engages legal counsel or a debt recovery agency to recover outstanding amounts, all associated costs — including legal fees, court fees, and collection charges — shall be borne entirely by the Client.',
    '5.7 Any payment plan agreed verbally or in writing must be honoured in full. Failure to adhere to an agreed payment plan constitutes a material breach of this Agreement and entitles CW Migration to suspend or terminate Services without refund.',
    '5.8 CW Migration does not accept payment into any employee’s personal account. Any such payment is considered unauthorised, and CW Migration shall not be liable for any loss, dispute, or consequence arising from it. All official payments must be made through CW Migration’s verified company bank accounts, approved online payment gateways, or at CW Migration’s official office locations, with an official company receipt issued.',
  ], '5. الرسوم والدفع', [
    '5.1 يوافق العميل على سداد رسوم الاحتفاظ وفق الجدول الزمني المحدد في الملحق (أ).',
    '5.2 تقع جميع رسوم الحكومة / الجهات المختصة على عاتق العميل وحده وهي غير مشمولة بهذه الاتفاقية، بصرف النظر عما إذا كانت CW Migration تساعد في تقديم هذه المدفوعات. وأي تقدير لهذه الرسوم تقدمه CW Migration هو تقدير استرشادي فقط ويخضع للتغيير من قبل الجهة المختصة.',
    '5.3 قد يؤدي عدم سداد أي قسط إلى تعليق أو إنهاء فوري للخدمات دون إشعار أو استرداد.',
    '5.4 يجوز لـ CW Migration تأجيل تقديم أي طلب أو تعبير عن اهتمام أو ترشيح إلى حين سداد جميع الرسوم المستحقة بالكامل.',
    '5.5 يستحق على أي مبلغ لم يُسدد خلال 7 أيام من تاريخ استحقاقه فائدة تأخيرية بمعدل 1.5% شهريًا (أو الحد الأقصى الذي يسمح به القانون الإماراتي، أيهما أدنى) من تاريخ الاستحقاق وحتى تاريخ السداد الفعلي.',
    '5.6 في حال اضطرار CW Migration إلى الاستعانة بمستشار قانوني أو وكالة تحصيل ديون لاسترداد مبالغ مستحقة، تقع جميع التكاليف المرتبطة بذلك — بما في ذلك أتعاب المحاماة ورسوم المحكمة وتكاليف التحصيل — على عاتق العميل وحده.',
    '5.7 يجب الوفاء الكامل بأي خطة سداد متفق عليها شفهيًا أو كتابيًا. ويُعد الإخفاق في الالتزام بخطة السداد المتفق عليها إخلالًا جوهريًا بهذه الاتفاقية ويخوّل CW Migration تعليق أو إنهاء الخدمات دون استرداد.',
    '5.8 لا تقبل CW Migration أي دفع إلى الحساب الشخصي لأي موظف. ويُعتبر أي دفع من هذا النوع غير مصرح به، ولا تتحمل CW Migration أي مسؤولية عن أي خسارة أو نزاع أو تبعات تنشأ عنه. ويجب أن تتم جميع المدفوعات الرسمية فقط من خلال حسابات CW Migration البنكية الموثقة، أو بوابات الدفع الإلكترونية المعتمدة، أو في أحد مكاتب CW Migration الرسمية، مع إصدار إيصال رسمي من الشركة.',
  ]],
  ['6. LIMITATION OF LIABILITY', [
    '6.1 To the maximum extent permitted by law, CW Migration shall not be liable for: any Authority decision, delay, refusal, or processing time; changes in law or policy; inaccurate, incomplete, or delayed information/documents provided by the Client; Client’s delay in providing documents or attending appointments; Client’s unauthorised contact with any Authority or third party; Client’s actions taken in anticipation of a visa; the loss of records in transit (which remains the courier’s responsibility); the authenticity of documents that appear genuine on their face; Force Majeure Events; or reliance on any representation made outside this Agreement.',
    '6.2 CW Migration’s maximum aggregate liability, under any theory of liability (contract, tort, or otherwise), shall not exceed the total Retainer Fee actually paid by the Client, and shall exclude any indirect, incidental, consequential, or punitive damages, loss of income, loss of opportunity, or loss of visa eligibility.',
    '6.3 The Client acknowledges that CW Migration’s role is limited to consultancy and advisory support and does not include, unless separately agreed in writing, any guarantee of employment, job placement, or a specific number of job applications submitted.',
  ], '6. تحديد المسؤولية', [
    '6.1 إلى أقصى حد يسمح به القانون، لا تتحمل CW Migration المسؤولية عن: أي قرار أو تأخير أو رفض أو مدة معالجة صادرة عن جهة مختصة؛ أو التغييرات في القانون أو السياسة؛ أو المعلومات/المستندات غير الدقيقة أو الناقصة أو المتأخرة المقدمة من العميل؛ أو تأخر العميل في تقديم المستندات أو حضور المواعيد؛ أو تواصل العميل غير المصرح به مع أي جهة مختصة أو طرف ثالث؛ أو إجراءات العميل المتخذة تحسبًا للحصول على تأشيرة؛ أو فقدان السجلات أثناء النقل (والتي تقع مسؤوليتها على شركة التوصيل)؛ أو صحة المستندات التي تبدو أصلية ظاهريًا؛ أو أحداث القوة القاهرة؛ أو الاعتماد على أي تصريح خارج نطاق هذه الاتفاقية.',
    '6.2 لا تتجاوز المسؤولية الإجمالية القصوى لـ CW Migration، بموجب أي نظرية مسؤولية (تعاقدية أو تقصيرية أو غير ذلك)، إجمالي رسوم الاحتفاظ التي سددها العميل فعليًا، وتستثني أي أضرار غير مباشرة أو عرضية أو تبعية أو تأديبية، أو خسارة الدخل، أو خسارة الفرصة، أو فقدان أهلية التأشيرة.',
    '6.3 يقر العميل بأن دور CW Migration يقتصر على الاستشارات والدعم الاستشاري ولا يشمل، ما لم يُتفق على خلاف ذلك كتابيًا، أي ضمان للتوظيف أو التنسيب الوظيفي أو عدد محدد من طلبات العمل المقدمة.',
  ]],
  ['7. INDEMNIFICATION', [
    '7.1 The Client shall indemnify, defend, and hold harmless CW Migration, its officers, employees, agents, and authorised representatives (collectively "Indemnified Parties") from and against any and all claims, demands, losses, damages, liabilities, costs, and expenses (including reasonable legal fees) arising out of or in connection with: (a) any false, misleading, incomplete, or fraudulent information or documents provided by the Client; (b) any breach by the Client of this Agreement; (c) any action taken by the Client in anticipation of a visa grant, skills assessment outcome, or other immigration result; and (d) any unauthorised direct contact by the Client with any Authority or third party in connection with the Services.',
    '7.2 This indemnification obligation shall survive the termination or expiry of this Agreement.',
  ], '7. التعويض', [
    '7.1 يلتزم العميل بتعويض CW Migration ومسؤوليها وموظفيها ووكلائها وممثليها المعتمدين ("الأطراف المُعوَّضة") والدفاع عنهم وإبراء ذمتهم من وضد جميع المطالبات والطلبات والخسائر والأضرار والمسؤوليات والتكاليف والمصاريف (بما في ذلك أتعاب المحاماة المعقولة) الناشئة عن أو المرتبطة بـ: (أ) أي معلومات أو مستندات كاذبة أو مضللة أو ناقصة أو احتيالية يقدمها العميل؛ (ب) أي إخلال من العميل بهذه الاتفاقية؛ (ج) أي إجراء يتخذه العميل تحسبًا للحصول على تأشيرة أو نتيجة تقييم مهارات أو أي نتيجة هجرة أخرى؛ و(د) أي تواصل مباشر غير مصرح به من العميل مع أي جهة مختصة أو طرف ثالث فيما يتعلق بالخدمات.',
    '7.2 يظل التزام التعويض هذا ساريًا بعد إنهاء هذه الاتفاقية أو انقضائها.',
  ]],
  ['8. REFUND POLICY', [
    '8.1 All fees are strictly non-refundable, except as expressly and narrowly stated in this Clause 8.',
    '8.2 The Client acknowledges and agrees that, under no circumstances, will CW Migration issue a refund where any of the following situations apply (this list is illustrative, not exhaustive):',
    '8.2(a) Changes in immigration laws, policies, occupation lists, or invitation rounds occurring after signing;',
    '8.2(b) Refusal, rejection, or non-approval of an application by any Authority, since visa approval is solely at that Authority’s discretion;',
    '8.2(c) Diplomatic, political, or bilateral relationship issues between the Client’s country of residence/nationality and the destination country;',
    '8.2(d) The Client’s voluntary withdrawal at any stage after signing this Agreement;',
    '8.2(e) Inconsistent, contradictory, incomplete, or false information or documents provided by the Client;',
    '8.2(f) Closure of the relevant immigration program or the program reaching maximum capacity;',
    '8.2(g) The Client’s failure to provide required documents, information, or test results within the stipulated timeframe;',
    '8.2(h) The Client’s failure to attend an interview, biometric appointment, or medical examination, or otherwise failing to complete the immigration process;',
    '8.2(i) Refusal on medical, criminal, national security, character, or financial-ineligibility grounds;',
    '8.2(j) The Client’s unauthorised direct communication with any Authority, agent, or third party that negatively affects the outcome;',
    '8.2(k) Provision of false, misleading, or fraudulent documents, or any form of misrepresentation;',
    '8.2(l) Registration/administration fees and fees for work already performed (file creation, initial consultation, document checklist, submission);',
    '8.2(m) Instalment payments already collected;',
    '8.2(n) Termination due to the Client’s breach of this Agreement (including Clauses 4.6, 4.7, 4.11, 4.12, or 5.7) or the Client’s misconduct;',
    '8.2(o) Dormancy of the Client’s file for 90 days or more without communication or action by the Client;',
    '8.2(p) Fees paid by CW Migration to government bodies or third parties on the Client’s behalf (the Client must seek such refunds directly from the relevant body);',
    '8.2(q) VAT or other government taxes remitted to the authorities;',
    '8.2(r) Force Majeure Events or the death of any person.',
    '8.3 A partial refund may be considered, at CW Migration’s sole discretion, only where CW Migration has been wholly unable to commence any Services for a reason solely and exclusively attributable to CW Migration, and only for the unused portion of the Retainer Fee corresponding to work not yet performed.',
    '8.4 Where CW Migration determines, at its sole discretion, that a refund under Clause 8.3 is approved, CW Migration shall process the approved refund within ninety (90) calendar days from the date the refund is approved in writing, subject to deduction of: (a) any applicable VAT/GST or government charges already remitted; (b) card/payment-processing fees actually incurred (up to 2.5%); (c) administrative and registration fees; and (d) the value of work already performed up to the date of approval.',
    '8.5 Any approved refund will be issued only by bank transfer or company cheque, in the Client’s name exclusively, to the account/address on file. No refund will be issued to a third party, nominee, or any person other than the Client named in this Agreement.',
    '8.6 The cooling-off period, if any, does not apply once any assessment, advice, document review, or file registration has been provided.',
    '8.7 Nothing in this Clause obliges CW Migration to review the merits of a refusal; however, CW Migration will, on request, provide a written summary of the work performed on a file that did not result in approval.',
    '8.8 Notwithstanding Clauses 2.3 and 8.2, where the Services fail due to an error, omission, or deficiency solely attributable to CW Migration (and not to the Client or any Authority), CW Migration shall, at its option, either: (a) correct the issue and re-apply on the Client’s behalf without any additional professional fee; or (b) where the Client has paid the Retainer Fee in full as a one-time payment, refund the Retainer Fee after deducting the percentage of work completed by CW Migration up to that date. Any such refund shall be processed within ninety (90) calendar days in the manner set out in Clause 8.5. Government / Authority fees remain the Client’s responsibility.',
  ], '8. سياسة الاسترداد', [
    '8.1 جميع الرسوم غير قابلة للاسترداد بصورة قاطعة، إلا وفق ما هو منصوص عليه صراحة وبشكل ضيق في هذا البند 8.',
    '8.2 يقر العميل ويوافق على أنه لن تُصدر CW Migration، تحت أي ظرف من الظروف، أي استرداد إذا انطبقت أي من الحالات التالية (هذه القائمة توضيحية وليست حصرية):',
    '8.2(أ) التغييرات في قوانين أو سياسات الهجرة أو قوائم المهن أو جولات الدعوة التي تطرأ بعد التوقيع؛',
    '8.2(ب) رفض أو عدم موافقة أي جهة مختصة على الطلب، حيث تعتمد الموافقة على التأشيرة حصرًا على تقدير تلك الجهة؛',
    '8.2(ج) المشاكل الدبلوماسية أو السياسية أو في العلاقات الثنائية بين بلد إقامة/جنسية العميل والبلد المقصد؛',
    '8.2(د) انسحاب العميل الطوعي في أي مرحلة بعد توقيع هذه الاتفاقية؛',
    '8.2(هـ) المعلومات أو المستندات غير المتسقة أو المتناقضة أو الناقصة أو الكاذبة المقدمة من العميل؛',
    '8.2(و) إغلاق برنامج الهجرة المعني أو وصوله إلى الحد الأقصى للقدرة الاستيعابية؛',
    '8.2(ز) عدم تقديم العميل للمستندات أو المعلومات أو نتائج الاختبارات المطلوبة ضمن الإطار الزمني المحدد؛',
    '8.2(ح) عدم حضور العميل مقابلة أو موعد بصمة بيومترية أو فحصًا طبيًا، أو عدم إكمال إجراء الهجرة بأي شكل آخر؛',
    '8.2(ط) الرفض لأسباب طبية أو جنائية أو تتعلق بالأمن القومي أو الشخصية أو عدم الأهلية المالية؛',
    '8.2(ي) تواصل العميل المباشر غير المصرح به مع أي جهة مختصة أو وكيل أو طرف ثالث بما يؤثر سلبًا على النتيجة؛',
    '8.2(ك) تقديم مستندات كاذبة أو مضللة أو احتيالية، أو أي شكل من أشكال التضليل؛',
    '8.2(ل) رسوم التسجيل/الإدارة والرسوم مقابل العمل المنجز بالفعل (إنشاء الملف، الاستشارة الأولية، قائمة التحقق من المستندات، التقديم)؛',
    '8.2(م) دفعات الأقساط المحصّلة بالفعل؛',
    '8.2(ن) الإنهاء بسبب إخلال العميل بهذه الاتفاقية (بما في ذلك البنود 4.6 أو 4.7 أو 4.11 أو 4.12 أو 5.7) أو سوء سلوك العميل؛',
    '8.2(س) تعليق ملف العميل لمدة 90 يومًا أو أكثر دون تواصل أو إجراء من جانب العميل؛',
    '8.2(ع) الرسوم التي تدفعها CW Migration لجهات حكومية أو أطراف ثالثة نيابة عن العميل (يجب على العميل طلب استرداد هذه المبالغ مباشرة من الجهة المعنية)؛',
    '8.2(ف) ضريبة القيمة المضافة أو الضرائب الحكومية الأخرى المحوّلة إلى الجهات المختصة؛',
    '8.2(ص) أحداث القوة القاهرة أو وفاة أي شخص.',
    '8.3 يجوز النظر في استرداد جزئي، وفق التقدير المطلق لـ CW Migration، فقط في حال عجز CW Migration الكامل عن بدء أي خدمات لسبب يعود حصرًا وكليًا إلى CW Migration، وفقط عن الجزء غير المستخدم من رسوم الاحتفاظ المقابل للعمل الذي لم يُنجز بعد.',
    '8.4 في حال قررت CW Migration، وفق تقديرها المطلق، الموافقة على استرداد بموجب البند 8.3، تلتزم CW Migration بمعالجة الاسترداد المعتمد خلال تسعين (90) يومًا تقويميًا من تاريخ الموافقة الكتابية على الاسترداد، مع خصم: (أ) أي ضريبة قيمة مضافة أو رسوم حكومية سارية تم تحويلها بالفعل؛ (ب) رسوم معالجة البطاقات/الدفع المتكبدة فعليًا (حتى 2.5%)؛ (ج) الرسوم الإدارية ورسوم التسجيل؛ و(د) قيمة العمل المنجز بالفعل حتى تاريخ الموافقة.',
    '8.5 لن يُصدر أي استرداد معتمد إلا عن طريق التحويل البنكي أو شيك الشركة، باسم العميل حصرًا، إلى الحساب/العنوان المسجل. ولن يُصدر أي استرداد لطرف ثالث أو مرشح أو أي شخص بخلاف العميل المذكور في هذه الاتفاقية.',
    '8.6 لا تسري فترة التراجع، إن وجدت، بعد تقديم أي تقييم أو مشورة أو مراجعة مستندات أو تسجيل ملف.',
    '8.7 لا يُلزم أي نص في هذا البند CW Migration بمراجعة أسباب الرفض؛ ومع ذلك، ستقدم CW Migration، عند الطلب، ملخصًا كتابيًا بالعمل المنجز على الملف الذي لم يُفضِ إلى الموافقة.',
    '8.8 على الرغم مما ورد في البندين 2.3 و8.2، في حال إخفاق الخدمات بسبب خطأ أو سهو أو قصور يعود حصرًا إلى CW Migration (وليس إلى العميل أو أي جهة مختصة)، تلتزم CW Migration، وفق اختيارها، بما يلي: (أ) تصحيح الخطأ وإعادة التقديم نيابةً عن العميل دون أي أتعاب مهنية إضافية؛ أو (ب) في حال سداد العميل رسوم الاحتفاظ كاملةً دفعةً واحدة، رد رسوم الاحتفاظ بعد خصم نسبة العمل الذي أنجزته CW Migration حتى تاريخه. ويُعالج أي استرداد من هذا النوع خلال تسعين (90) يومًا تقويميًا وفق الطريقة المنصوص عليها في البند 8.5. وتظل رسوم الحكومة / الجهات المختصة على عاتق العميل وحده.',
  ]],
  ['9. CONFIDENTIALITY AND DATA PROTECTION', [
    '9.1 Both parties agree to maintain the confidentiality of all information received under this Agreement. Confidential Information shall not be disclosed without prior written consent, except as required by law.',
    '9.2 The Client consents to CW Migration sharing their personal information with third parties as necessary to provide the Services (e.g., skills assessment bodies, immigration departments, educational institutions, nomination authorities, translators, and IELTS/PTE bodies). CW Migration may use the Client’s name or testimonial for marketing and branding purposes only with the Client’s prior consent, which the Client may withdraw at any time by email.',
    '9.3 CW Migration processes the Client’s personal data in accordance with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL) and any applicable regulations thereunder.',
    '9.4 The Client releases CW Migration from all liability arising from electronic communications interception, delay, or delivery failure, provided CW Migration uses reasonable security measures.',
  ], '9. السرية وحماية البيانات', [
    '9.1 يتفق الطرفان على الحفاظ على سرية جميع المعلومات المتلقاة بموجب هذه الاتفاقية. ولا يجوز الإفصاح عن المعلومات السرية دون موافقة كتابية مسبقة، إلا وفق ما يقتضيه القانون.',
    '9.2 يوافق العميل على مشاركة CW Migration لمعلوماته الشخصية مع أطراف ثالثة بالقدر اللازم لتقديم الخدمات (مثل جهات تقييم المهارات، ودوائر الهجرة، والمؤسسات التعليمية، وجهات الترشيح، والمترجمين، وجهات اختبار IELTS/PTE). ولا يجوز لـ CW Migration استخدام اسم العميل أو شهادته لأغراض التسويق والترويج إلا بموافقة العميل المسبقة، ويجوز للعميل سحب هذه الموافقة في أي وقت عبر البريد الإلكتروني.',
    '9.3 تعالج CW Migration بيانات العميل الشخصية وفقًا للمرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية (PDPL) وأي لوائح تنفيذية سارية بموجبه.',
    '9.4 يُعفي العميل CW Migration من أي مسؤولية ناشئة عن اعتراض الاتصالات الإلكترونية أو تأخرها أو فشل تسليمها، شريطة أن تتخذ CW Migration تدابير أمنية معقولة.',
  ]],
  ['10. TERM AND TERMINATION', [
    '10.1 This Agreement commences on the date of signing and remains in force until the Services are completed or until terminated in accordance with this Clause. Unless otherwise stated in Annexure A, this Agreement is valid for 24 months from signing and may be renewed by mutual written consent.',
    '10.2 Either party may terminate this Agreement with fifteen (15) days’ prior written notice via email.',
    '10.3 CW Migration may terminate immediately and without notice for: non-payment; provision of false or forged documents; material breach; Client misconduct (Clause 4.6); breach of Clause 4.12; unauthorised engagement of another agent; or any circumstance described in Clause 8.2.',
    '10.4 Upon termination: (a) all CW Migration obligations cease; (b) no refund is due except strictly as set out in Clause 8; (c) the Client remains liable for all outstanding fees and charges; and (d) Clauses 6, 7, 8, 9, 11, and 13 survive termination.',
  ], '10. مدة الاتفاقية وإنهاؤها', [
    '10.1 تسري هذه الاتفاقية اعتبارًا من تاريخ التوقيع وتظل نافذة حتى إتمام الخدمات أو حتى إنهائها وفقًا لهذا البند. وما لم يُنص على خلاف ذلك في الملحق (أ)، تسري هذه الاتفاقية لمدة 24 شهرًا من تاريخ التوقيع ويجوز تجديدها بموافقة كتابية متبادلة.',
    '10.2 يحق لأي من الطرفين إنهاء الاتفاقية بإشعار كتابي مسبق مدته خمسة عشر (15) يومًا عبر البريد الإلكتروني.',
    '10.3 يجوز لـ CW Migration إنهاء الاتفاقية فورًا ودون إشعار في الحالات التالية: عدم السداد؛ تقديم مستندات كاذبة أو مزورة؛ الإخلال الجوهري؛ سوء سلوك العميل (البند 4.6)؛ الإخلال بالبند 4.12؛ الاستعانة بوكيل آخر دون تصريح؛ أو أي حالة من الحالات الواردة في البند 8.2.',
    '10.4 عند الإنهاء: (أ) تنتهي جميع التزامات CW Migration؛ (ب) لا يستحق أي استرداد إلا وفق ما هو منصوص عليه حصرًا في البند 8؛ (ج) يظل العميل مسؤولًا عن جميع الرسوم والتكاليف المستحقة؛ و(د) تظل البنود 6 و7 و8 و9 و11 و13 سارية بعد الإنهاء.',
  ]],
  ['11. SOCIAL MEDIA, REVIEWS, AND DEFAMATION', [
    '11.1 The Client agrees not to publish, on any platform (including Google, social media, review sites, or messaging applications), any content about CW Migration or its employees that is factually false or misleading, defamatory, malicious or abusive, or designed to cause commercial harm without factual basis.',
    '11.2 Legitimate grievances shall be addressed exclusively through the dispute resolution mechanism in Clause 13. The Client agrees to exhaust that process before making any public statement about CW Migration in connection with a dispute arising from this Agreement.',
    '11.3 CW Migration reserves the right to seek injunctive relief, damages, and all available remedies under UAE Federal Decree-Law No. 34 of 2021 on Combating Rumours and Cybercrime, UAE Federal Decree-Law No. 31 of 2021 (Penal Code), and applicable defamation laws in any relevant jurisdiction (including the destination country or the Client’s country of residence), for any breach of this Clause.',
    '11.4 Nothing in this Clause prevents the Client from making truthful, factual, and non-malicious statements about their experience with CW Migration in good faith, provided the Client has first followed the dispute resolution process under Clause 13.',
  ], '11. وسائل التواصل الاجتماعي والمراجعات والتشهير', [
    '11.1 يوافق العميل على عدم نشر أي محتوى عن CW Migration أو موظفيها، على أي منصة (بما في ذلك جوجل، ووسائل التواصل الاجتماعي، ومواقع المراجعات، وتطبيقات المراسلة)، يكون كاذبًا أو مضللًا من الناحية الواقعية، أو تشهيريًا، أو كيديًا أو مسيئًا، أو يهدف إلى إلحاق ضرر تجاري دون أساس واقعي.',
    '11.2 تُعالج الشكاوى المشروعة حصرًا من خلال آلية تسوية المنازعات المنصوص عليها في البند 13. ويوافق العميل على استنفاد هذه الإجراءات قبل الإدلاء بأي تصريح علني بشأن CW Migration فيما يتعلق بأي نزاع ناشئ عن هذه الاتفاقية.',
    '11.3 تحتفظ CW Migration بحقها في طلب الإنصاف القضائي العاجل والتعويضات وجميع سبل الانتصاف المتاحة بموجب المرسوم بقانون اتحادي رقم 34 لسنة 2021 بشأن مكافحة الشائعات والجرائم الإلكترونية، والمرسوم بقانون اتحادي رقم 31 لسنة 2021 (قانون العقوبات)، وقوانين التشهير المعمول بها في أي اختصاص قضائي ذي صلة (بما في ذلك بلد الوجهة أو بلد إقامة العميل)، عن أي إخلال بهذا البند.',
    '11.4 لا يحول هذا البند دون قيام العميل بالإدلاء بتصريحات صادقة وواقعية وغير كيدية عن تجربته مع CW Migration بحسن نية، شريطة أن يكون العميل قد اتبع أولًا إجراءات تسوية المنازعات المنصوص عليها في البند 13.',
  ]],
  ['12. FORCE MAJEURE', [
    '12.1 Neither party is liable for failure to perform obligations caused by events beyond their reasonable control, including acts of God, war, government restrictions, pandemics, or infrastructure failures ("Force Majeure Event").',
    '12.2 If a Force Majeure Event continues for more than 90 days, either party may terminate this Agreement. No refund applies in Force Majeure circumstances, other than as strictly provided in Clause 8.',
  ], '12. القوة القاهرة', [
    '12.1 لا يتحمل أي من الطرفين مسؤولية الإخفاق في الوفاء بالتزاماته الناتج عن أحداث خارجة عن إرادته المعقولة، بما في ذلك الكوارث الطبيعية، والحروب، والقيود الحكومية، والأوبئة، أو أعطال البنية التحتية ("حدث القوة القاهرة").',
    '12.2 إذا استمر حدث القوة القاهرة لأكثر من 90 يومًا، يحق لأي من الطرفين إنهاء هذه الاتفاقية. ولا ينطبق أي استرداد في ظروف القوة القاهرة، باستثناء ما هو منصوص عليه حصرًا في البند 8.',
  ]],
  ['13. GOVERNING LAW AND DISPUTE RESOLUTION', [
    '13.1 This Agreement is governed by the laws of the United Arab Emirates, specifically the laws applicable in the Emirate of Dubai.',
    '13.2 Disputes shall first be addressed through good-faith negotiations within 21 days of written notice.',
    '13.3 Any dispute, controversy, or claim arising out of or relating to this Agreement, including its existence, validity, interpretation, performance, breach, or termination — including any dispute concerning a refusal, refund, or fee — that is not resolved through negotiation under Clause 13.2 shall be finally and exclusively resolved by arbitration administered by the Dubai International Arbitration Centre (DIAC) in accordance with its Arbitration Rules in force at the time the arbitration is commenced. The seat of arbitration shall be Dubai, UAE. The language of the arbitration shall be English (with Arabic translation available). The tribunal shall consist of one (1) arbitrator appointed in accordance with the DIAC Rules. The arbitral award shall be final and binding on both parties.',
    '13.4 Notwithstanding Clause 13.3, CW Migration reserves the right to seek urgent interim or injunctive relief (including for non-payment, breach of confidentiality, or defamation) from any competent court, without this being deemed a waiver of the arbitration agreement.',
    '13.5 The Client acknowledges that pursuing a dispute through a consumer complaint, regulatory body, or public statement in parallel with, or instead of, the process set out in this Clause does not suspend or waive CW Migration’s right to invoke this Clause 13 or Clause 7 (Indemnification).',
    '13.6 Nothing in this Agreement limits or restricts the Client’s right to lodge a complaint with the relevant Regulator regarding the conduct of a registered migration agent or licensed representative.',
  ], '13. القانون الحاكم وتسوية المنازعات', [
    '13.1 تخضع هذه الاتفاقية لقوانين دولة الإمارات العربية المتحدة، وتحديدًا القوانين السارية في إمارة دبي.',
    '13.2 تُعالج المنازعات أولًا من خلال مفاوضات بحسن نية خلال 21 يومًا من تاريخ الإشعار الكتابي.',
    '13.3 أي نزاع أو خلاف أو مطالبة تنشأ عن أو تتعلق بهذه الاتفاقية، بما في ذلك وجودها أو صحتها أو تفسيرها أو تنفيذها أو الإخلال بها أو إنهاؤها — بما في ذلك أي نزاع يتعلق برفض أو استرداد أو رسوم — ولم تتم تسويته من خلال المفاوضات بموجب البند 13.2، يُحال إلى التحكيم بشكل نهائي وحصري وفقًا لقواعد التحكيم لدى مركز دبي الدولي للتحكيم (DIAC) السارية وقت بدء إجراءات التحكيم. ويكون مقر التحكيم في دبي، الإمارات العربية المتحدة. وتكون لغة التحكيم الإنجليزية (مع توفر ترجمة عربية). وتتألف هيئة التحكيم من محكّم واحد (1) يُعيَّن وفقًا لقواعد DIAC. ويكون قرار التحكيم نهائيًا وملزمًا للطرفين.',
    '13.4 بصرف النظر عن البند 13.3، تحتفظ CW Migration بحقها في طلب الإنصاف القضائي العاجل أو المؤقت (بما في ذلك بخصوص عدم السداد، أو خرق السرية، أو التشهير) من أي محكمة مختصة، دون اعتبار ذلك تنازلًا عن اتفاق التحكيم.',
    '13.5 يقر العميل بأن اللجوء إلى شكوى استهلاكية أو جهة تنظيمية أو تصريح علني بالتوازي مع، أو بدلًا من، الإجراءات المنصوص عليها في هذا البند لا يعلّق أو يُسقط حق CW Migration في الاحتجاج بهذا البند 13 أو البند 7 (التعويض).',
    '13.6 لا يحدّ أي نص في هذه الاتفاقية من حق العميل في تقديم شكوى إلى الجهة المنظِّمة ذات الصلة بشأن سلوك وكيل هجرة مسجل أو ممثل مرخص.',
  ]],
  ['14. GENERAL PROVISIONS', [
    '14.1 Entire Agreement: This Agreement, including Annexure A, together with CW Migration’s website terms and any referenced policies as updated from time to time, constitutes the entire agreement between the parties and supersedes all prior discussions, representations, and agreements, whether oral or written.',
    '14.2 Amendments: Amendments require a written instrument signed by both parties, except that CW Migration may update Government/Authority fee estimates without amending this Agreement, as such fees are outside CW Migration’s control.',
    '14.3 Severability: If any provision is found invalid or unenforceable, the remaining provisions continue in full force and effect, and the invalid provision shall be replaced with a valid provision that most closely reflects the parties’ original intent.',
    '14.4 Assignment: The Client may not assign or transfer any rights or obligations under this Agreement without CW Migration’s prior written consent. CW Migration may assign this Agreement to an affiliate or successor entity within the CW Migration group.',
    '14.5 Notices: Any notice under this Agreement shall be in writing and sent by email or registered mail to the addresses on record, and shall be deemed effective on the day of delivery or the next business day if mailed.',
    '14.6 No Waiver: Failure by CW Migration to enforce any provision of this Agreement shall not be construed as a waiver of that or any other provision.',
    '14.7 By signing below, the Client confirms they have read, understood, and had the opportunity to seek independent advice on this Agreement (including its Refund Policy and dispute resolution mechanism) prior to signing, have received a copy of any consumer guide required by the relevant Regulator, and agree to be bound by all its terms.',
  ], '14. أحكام عامة', [
    '14.1 الاتفاق الكامل: تشكل هذه الاتفاقية، بما في ذلك الملحق (أ)، إلى جانب شروط موقع CW Migration وأي سياسات مشار إليها عند تحديثها من وقت لآخر، الاتفاق الكامل بين الطرفين وتحل محل جميع المناقشات والتصريحات والاتفاقيات السابقة، سواء كانت شفهية أو كتابية.',
    '14.2 التعديلات: تستلزم أي تعديلات وثيقة كتابية موقعة من الطرفين، باستثناء أن CW Migration يجوز لها تحديث تقديرات رسوم الحكومة/الجهات المختصة دون تعديل هذه الاتفاقية، حيث إن هذه الرسوم خارجة عن سيطرة CW Migration.',
    '14.3 قابلية الفصل: إذا تبين بطلان أو عدم قابلية إنفاذ أي حكم من أحكام هذه الاتفاقية، تظل الأحكام المتبقية سارية المفعول بالكامل، ويُستبدل الحكم الباطل بحكم صحيح يعكس بأقرب ما يمكن نية الطرفين الأصلية.',
    '14.4 التنازل: لا يجوز للعميل التنازل عن أو نقل أي حقوق أو التزامات بموجب هذه الاتفاقية دون موافقة كتابية مسبقة من CW Migration. ويجوز لـ CW Migration التنازل عن هذه الاتفاقية لشركة تابعة أو خلف ضمن مجموعة CW Migration.',
    '14.5 الإشعارات: يجب أن يكون أي إشعار بموجب هذه الاتفاقية كتابيًا ويُرسل عبر البريد الإلكتروني أو البريد المسجل إلى العناوين المسجلة، ويُعتبر ساريًا في يوم التسليم أو يوم العمل التالي إذا أُرسل بالبريد.',
    '14.6 عدم التنازل: لا يُفسَّر إخفاق CW Migration في إنفاذ أي حكم من أحكام هذه الاتفاقية على أنه تنازل عن ذلك الحكم أو أي حكم آخر.',
    '14.7 بالتوقيع أدناه، يؤكد العميل أنه قرأ وفهم هذه الاتفاقية وأتيحت له الفرصة للحصول على مشورة مستقلة بشأنها (بما في ذلك سياسة الاسترداد وآلية تسوية المنازعات) قبل التوقيع، وأنه استلم نسخة من أي دليل للمستهلك تشترطه الجهة المنظِّمة ذات الصلة، ويوافق على الالتزام بجميع أحكامها.',
  ]],
];

export const textOrBlank = (value: unknown, fallback = '________________') => {
  const result = String(value ?? '').trim();
  return result || fallback;
};

// Per Clause 10.1, this Agreement is valid for 24 months from signing.
// agreementDate arrives already formatted for display (every caller renders
// it as DD/MM/YYYY before passing it in), so it's parsed back out here
// rather than threading a separate Date object through every call site.
// Falls back to today when the display string can't be parsed (e.g. blank).
export const addMonthsToDisplayDate = (dateStr: string, months: number): string => {
  const trimmed = String(dateStr ?? '').trim();
  const dmy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const base = dmy
    ? new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]))
    : new Date(trimmed);
  const start = Number.isNaN(base.getTime()) ? new Date() : base;
  const expiry = new Date(start);
  expiry.setMonth(expiry.getMonth() + months);
  const dd = String(expiry.getDate()).padStart(2, '0');
  const mm = String(expiry.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${expiry.getFullYear()}`;
};

// ── Bilingual section header bar (dark navy, EN left / AR right) ──────────
export const sectionHeader = (englishTitle: string, arabicTitle: string) => `<div class="cmg-section-header">
  <span class="en">${esc(englishTitle)}</span>
  <span class="ar" dir="rtl" lang="ar">${esc(arabicTitle)}</span>
</div>`;

// ── One striped label:value row, EN left cell / AR right cell ─────────────
export const row = (labelEn: string, value: string, labelAr: string, arValue?: string) => `<div class="cmg-row">
  <div class="en"><strong>${esc(labelEn)}:</strong> ${esc(value)}</div>
  <div class="ar" dir="rtl" lang="ar"><strong>${esc(labelAr)}:</strong> ${esc(arValue ?? value)}</div>
</div>`;

// ── A section: header bar + its striped rows, kept together ───────────────
export const section = (englishTitle: string, arabicTitle: string, rows: string) =>
  `<section class="cmg-block">${sectionHeader(englishTitle, arabicTitle)}<div class="cmg-rows">${rows}</div></section>`;

// ── One clause: header bar + one striped row per sub-clause sentence ──────
export const clauseSection = (englishTitle: string, english: string[], arabicTitle: string, arabic: string[]) => {
  const rows = english.map((en, i) => `<div class="cmg-row">
    <div class="en">${esc(en)}</div>
    <div class="ar" dir="rtl" lang="ar">${esc(arabic[i] ?? '')}</div>
  </div>`).join('');
  return `<section class="cmg-block cmg-clause">${sectionHeader(englishTitle, arabicTitle)}<div class="cmg-rows">${rows}</div></section>`;
};

// Orange rounded triangle from the CW logo, as a crisp inline SVG for the
// @page margin box (margin boxes only accept url() images at intrinsic size).
const FOOTER_ICON_SVG = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 22 20"><path d="M3.2 1h15.6c1.9 0 3 2 2 3.6L12.8 18.4c-.9 1.6-2.7 1.6-3.6 0L1.2 4.6C.2 3 1.3 1 3.2 1z" fill="#ff7714"/></svg>');

// Shared <style> block for every bilingual agreement (this one and the Skills
// Assessment + Resume Marketing agreement) so they print identically.
export const agreementStyles = () => `
  <style>
    /* "Page X of Y" lives in the page margin box: counter(page) only resolves
       there — inside normal (even position: fixed) content Chrome prints "0". */
    @page {
      size: A4;
      margin: 10mm 8mm 14mm;
      /* The address footer lives in the margin box too — a position: fixed
         footer sits inside the content area and overprints the last row. */
      @bottom-left {
        content: url("${FOOTER_ICON_SVG}") "  ${COMPANY.brandEn} — ${COMPANY.addressEn}";
        color: #667;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 8px;
        vertical-align: bottom;
        padding-bottom: 4mm;
      }
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        color: #667;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 8px;
        vertical-align: bottom;
        padding-bottom: 4mm;
      }
    }
    * { box-sizing: border-box; }
    :root {
      --navy: #003087;
      --navy-dark: #00246a;
      --orange: #ff7714;
      --grey: #6f6f6f;
      --border: #c5d0e3;
      --stripe: #eef2fa;
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

    /* ── brand header: horizontal logo left, company details right ── */
    .cw-header {
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      border-bottom: 3px solid var(--orange);
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    .cw-header .cw-logo img { height: 54px; width: auto; display: block; }
    .cw-header .cw-company { text-align: right; font-size: 9px; color: var(--grey); line-height: 1.45; }
    .cw-header .cw-company .name { font-size: 12px; font-weight: 800; color: var(--navy); }
    .cw-header .cw-company .name .ar { font-family: Tahoma, Arial, sans-serif; }

    /* ── letterhead (legacy two-column variant) ── */
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
    .letterhead .regulatory { font-size: 9px; color: var(--navy); font-weight: 700; margin-top: 3px; }

    .title-bar {
      background: var(--navy);
      border-bottom: 3px solid var(--orange);
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
    /* Short blocks (details, fee tables, signatures) stay on one page. Clauses
       must be allowed to split: Clause 8 alone is taller than an A4 page, and
       forcing a taller-than-page block to "avoid" breaking makes Chrome paint
       its overflow on top of the following pages (duplicated/overlapping
       8.4–10.4 text in printed PDFs). Clauses break between rows instead. */
    .cmg-block { border: 1px solid var(--border); margin-bottom: 7px; break-inside: avoid; page-break-inside: avoid; }
    .cmg-block.cmg-clause { break-inside: auto; page-break-inside: auto; }
    .cmg-section-header {
      break-after: avoid;
      page-break-after: avoid;
      background: var(--navy);
      border-bottom: 2px solid var(--orange);
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
    /* Flex rather than grid: Chrome fragments flex rows across pages more
       reliably, and each EN/AR sentence pair is kept whole on one page. */
    .cmg-row { display: flex; break-inside: avoid; page-break-inside: avoid; }
    .cmg-row .en, .cmg-row .ar { flex: 1 1 0; min-width: 0; padding: 5px 10px; }
    .cmg-row .en { border-right: 1px solid var(--border); }
    .cmg-row .ar { text-align: right; font-family: Tahoma, Arial, sans-serif; font-size: 10.3px; line-height: 1.6; }
    .cmg-clause .cmg-row .en, .cmg-clause .cmg-row .ar { padding: 6px 10px; }

    .preamble p { margin: 0 0 6px; }
    .preamble p:last-child { margin-bottom: 0; }

    .annexure-title {
      background: var(--navy);
      color: #fff;
      border: 1px solid var(--navy);
      border-bottom: 3px solid var(--orange);
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
      display: flex; justify-content: space-between; align-items: center;
      color: #667; font-size: 8px;
    }
    .print-footer img { height: 10px; width: auto; vertical-align: middle; margin-right: 4px; }
    .fee-table { width: 100%; border-collapse: collapse; font-size: 10.3px; }
    .fee-table th { background: var(--navy); color: #fff; text-align: left; padding: 5px 8px; border-bottom: 2px solid var(--orange); }
    .fee-table th.num, .fee-table td.num { text-align: right; white-space: nowrap; }
    .fee-table td { padding: 5px 8px; border-bottom: 1px solid var(--border); vertical-align: top; }
    .fee-table tr.total td { background: var(--stripe); font-weight: 700; }
    .fee-table .ar { font-family: Tahoma, Arial, sans-serif; color: var(--grey); direction: rtl; display: block; }

    @media screen {
      body { background: #eef0f3; padding: 14px 0; }
      .document { background: #fff; padding: 10mm 8mm 14mm; box-shadow: 0 2px 12px rgba(0,0,0,.12); }
      .print-footer { position: static; margin-top: 10px; }
    }
    @media print { .document { padding: 0; } .print-footer { display: none; } }
    @media (max-width: 700px) {
      html, body { font-size: 11px; }
      .letterhead, .title-bar, .cmg-section-header, .annexure-title {
        grid-template-columns: 1fr;
      }
      .cw-header { flex-direction: column; align-items: flex-start; }
      .cw-header .cw-company { text-align: left; }
      .cmg-row { flex-direction: column; }
      .letterhead .en, .title-bar .en, .cmg-row .en { border-right: 0; border-bottom: 1px solid var(--border); }
    }
  </style>
`;


// Brand header shared by every agreement: horizontal CW logo on the left,
// company details on the right (inline images so it survives being stored as
// HTML and opened in a blank window).
export const headerHtml = () => `<header class="cw-header">
      <div class="cw-logo"><img src="${BRAND_LOGO_DATA_URI}" alt="${esc(COMPANY.brandEn)}"></div>
      <div class="cw-company">
        <div class="name"><span class="ar" dir="rtl" lang="ar">${esc(COMPANY.brandAr)}</span> | ${esc(COMPANY.brandEn)}</div>
        <div>Legal Name: ${esc(COMPANY.nameEn)}</div>
        <div>${esc(COMPANY.addressEn)}</div>
        <div>${esc(COMPANY.contactEn)}</div>
      </div>
    </header>`;

export const footerHtml = () => `<footer class="print-footer">
      <span><img src="${BRAND_ICON_DATA_URI}" alt="">${esc(COMPANY.brandEn)} — ${esc(COMPANY.addressEn)}</span>
    </footer>`;

const REGULATOR_CLAUSE = /^(1\.7|2\.5|13\.6)\s/;

// Agreements with no Registered Representative (no regulated agent) drop the
// Regulator definition (1.7), the Registered-Representative supervision clause
// (2.5) and the Regulator complaint clause (13.6), renumber the clauses that
// follow, and strip the regulator wording from the remaining text.
export const withoutMara = (text: string) => text
  .replace(' through regulated and registered migration agents and licensed representatives, as applicable to the destination country', '')
  .replace(' عن طريق وكلاء هجرة مرخصين ومسجلين وممثلين مرخصين، بحسب ما ينطبق على بلد الوجهة', '')
  .replace(', have received a copy of any consumer guide required by the relevant Regulator, and agree', ', and agree')
  .replace('، وأنه استلم نسخة من أي دليل للمستهلك تشترطه الجهة المنظِّمة ذات الصلة، ويوافق', '، ويوافق')
  .replace(' (MARA, RCIC or other licensed representative)', '')
  .replace(/Clause 2[.]6/g, "Clause 2.5");

// After dropping 1.7 / 2.5, shift later numbers in that clause down by one.
const renumber = (t: string) => {
  const m = t.match(/^(1|2)\.(\d+)\s/);
  if (!m) return t;
  const threshold = m[1] === '1' ? 7 : 5;
  const n = Number(m[2]);
  return n > threshold ? t.replace(/^(1|2)\.\d+/, `${m[1]}.${n - 1}`) : t;
};

function clausesFor(maraAgent: boolean) {
  if (maraAgent) return clauses;
  const adapt = (body: string[]) => body
    .filter((t) => !REGULATOR_CLAUSE.test(t))
    .map((t) => withoutMara(renumber(t)));
  return clauses.map(([enTitle, enBody, arTitle, arBody]): [string, string[], string, string[]] =>
    [enTitle, adapt(enBody), arTitle, adapt(arBody)]);
}

export function renderDubaiAgreement(v: DubaiAgreementValues): string {
  const currencyCode = v.currencyCode || COMPANY.currencyCode;
  const agreementNumber = textOrBlank(v.agreementNumber);
  const agreementDate = textOrBlank(v.agreementDate);
  const agreementExpiryDate = addMonthsToDisplayDate(v.agreementDate, 24);
  const clientName = textOrBlank(v.clientName);
  const nationality = textOrBlank(v.nationality);
  const passportNumber = textOrBlank(v.passportNumber);
  const clientPhone = textOrBlank(v.clientPhone);
  const clientEmail = textOrBlank(v.clientEmail);
  const serviceProgram = textOrBlank(v.serviceProgram);
  const destinationCountry = textOrBlank(v.destinationCountry);
  const visaSubclass = String(v.visaSubclass ?? '').trim();
  const totalAmount = textOrBlank(v.totalAmount);
  const initialPayment = textOrBlank(v.initialPayment);
  const secondPayment = textOrBlank(v.secondPayment);
  // The Fee Summary points at Annexure A for the instalment date, so Annexure A
  // itself must never fall back to "As per Annexure A" — with no date on file
  // it refers to the agreed payment plan (Clause 5.7) instead.
  const secondPaymentDue = String(v.secondPaymentDue ?? '').trim();
  const secondPaymentSummaryEn = secondPaymentDue ? `Due: ${secondPaymentDue}` : 'As per Annexure A';
  const secondPaymentSummaryAr = secondPaymentDue ? `تستحق: ${secondPaymentDue}` : 'وفق الملحق (أ)';
  const secondPaymentAnnexEn = secondPaymentDue || 'As per the payment plan agreed with CW Migration (Clause 5.7)';
  const secondPaymentAnnexAr = secondPaymentDue || 'وفق خطة السداد المتفق عليها مع CW Migration (البند 5.7)';
  const includedDeliverables = textOrBlank(v.includedDeliverables, 'Eligibility assessment, document review, application / profile preparation and submission, and liaison with the Authority or relevant body, as per Clause 2 and the service-specific terms in Clause 2.6.');
  const expressExclusions = textOrBlank(v.expressExclusions, 'Legal representation; any guarantee of visa approval, admission, interview or job placement; Government / Authority fees; services not named above.');
  const specialTerms = String(v.specialTerms ?? '').trim();
  const registeredMigrationAgent = textOrBlank(v.registeredMigrationAgent);
  const marn = textOrBlank(v.marn);
  const governmentFeeEstimate = textOrBlank(v.governmentFeeEstimate);
  // Annexure A fee breakdown: VAT / Total Payable are optional inputs.
  const vatAmount = String(v.vatAmount ?? '').trim();
  const totalPayable = String(v.totalPayable ?? '').trim() || totalAmount;

  const maraAgent = v.maraAgent !== false;
  const clauseHtml = clausesFor(maraAgent).map(([enTitle, enBody, arTitle, arBody]) =>
    clauseSection(enTitle, enBody, arTitle, arBody)).join('');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Client Advisory Agreement ${esc(agreementNumber)}</title>
${agreementStyles()}
</head>
<body>
  <main class="document">
    ${headerHtml()}

    <div class="title-bar">
      <span class="en">CLIENT ADVISORY AGREEMENT</span>
      <span class="ar" dir="rtl" lang="ar">اتفاقية استشارية للعملاء</span>
    </div>

    ${section('AGREEMENT DETAILS', 'تفاصيل الاتفاقية', [
      row('Agreement No.', agreementNumber, 'رقم الاتفاقية'),
      row('Date', agreementDate, 'التاريخ'),
      row('Date of Expiry', agreementExpiryDate, 'تاريخ الانتهاء'),
      row('Service(s) Selected', 'As selected in Annexure A', 'الخدمة / الخدمات المختارة', 'وفق الاختيار في الملحق (أ)'),
      row('Destination Country', destinationCountry, 'بلد الوجهة'),
    ].join(''))}

    ${section('SERVICE PROVIDER', 'مقدم الخدمة', [
      row('Brand Name', COMPANY.tradingAsEn, 'اسم العلامة التجارية', COMPANY.tradingAsAr),
      row('Legal Name', COMPANY.nameEn, 'الاسم القانوني', COMPANY.nameAr),
      row('Address', COMPANY.addressEn, 'العنوان', COMPANY.addressAr),
      ...(maraAgent ? [
        row('Registered Representative', registeredMigrationAgent, 'الممثل المسجل'),
        row('Registration No.', marn, 'رقم التسجيل'),
      ] : []),
    ].join(''))}

    ${section('CLIENT DETAILS', 'بيانات العميل', [
      row('Full Name', clientName, 'الاسم الكامل'),
      row('Nationality', nationality, 'الجنسية'),
      row('Passport No.', passportNumber, 'رقم جواز السفر'),
      row('Phone', clientPhone, 'الهاتف'),
      row('Email', clientEmail, 'البريد الإلكتروني'),
    ].join(''))}

    ${section('FEE SUMMARY', 'ملخص الرسوم', [
      row('Total Retainer Fee', `${currencyCode} ${totalAmount}`, 'إجمالي رسوم الاحتفاظ'),
      row('Initial Payment', `${currencyCode} ${initialPayment}`, 'الدفعة الأولى'),
      row('Second / Instalment Payment', `${currencyCode} ${secondPayment} (${secondPaymentSummaryEn})`, 'الدفعة الثانية / القسط', `${currencyCode} ${secondPayment} (${secondPaymentSummaryAr})`),
      row('Government / Authority Fees', `NOT INCLUDED — paid by Client directly (current estimate: ${currencyCode} ${governmentFeeEstimate})`, 'رسوم الحكومة / الجهات المختصة', `غير مشمولة — يدفعها العميل مباشرة (التقدير الحالي: ${currencyCode} ${governmentFeeEstimate})`),
      row('VAT', 'Applicable per UAE VAT Law', 'ضريبة القيمة المضافة', 'مطبقة وفق قانون ضريبة القيمة المضافة الإماراتي'),
    ].join(''))}

    <section class="cmg-block cmg-clause preamble">
      ${sectionHeader('PREAMBLE', 'التمهيد')}
      <div class="cmg-rows">
        <div class="cmg-row">
          <div class="en">This Client Advisory Agreement ("Agreement") is entered into between CW Migration Advisor ("CW Migration"), the trading name of Commonwealth Document Clearing Services LLC, a UAE-based migration consultancy that provides immigration, skills assessment, student, visitor and career-support services (as listed at cwmigration.com) through regulated and registered migration agents and licensed representatives, as applicable to the destination country, and the Client identified above.</div>
          <div class="ar" dir="rtl" lang="ar">أُبرمت اتفاقية الاستشارة هذه للعملاء ("الاتفاقية") بين سي دبليو مستشار الهجرة ("CW Migration")، وهو الاسم التجاري لشركة كومنولث لتخليص المستندات ذ.م.م، وهي شركة استشارات هجرة مقرها دولة الإمارات العربية المتحدة تقدّم خدمات الهجرة وتقييم المهارات والتأشيرات الدراسية وتأشيرات الزيارة والدعم الوظيفي (كما هو مدرج على cwmigration.com) عن طريق وكلاء هجرة مرخصين ومسجلين وممثلين مرخصين، بحسب ما ينطبق على بلد الوجهة، وبين العميل المحدد أعلاه.</div>
        </div>
        <div class="cmg-row">
          <div class="en">WHEREAS CW Migration specialises in permanent residence and skilled migration, skills assessment, student visas, visit visas, resume marketing, and related document clearing services for individuals in the UAE and the region, as listed on its website cwmigration.com.</div>
          <div class="ar" dir="rtl" lang="ar">وحيث إن CW Migration متخصصة في الإقامة الدائمة والهجرة للعمالة الماهرة وتقييم المهارات والتأشيرات الدراسية وتأشيرات الزيارة وتسويق السيرة الذاتية وخدمات تخليص المستندات ذات الصلة للأفراد في دولة الإمارات والمنطقة، وفق ما هو مدرج على موقعها الإلكتروني cwmigration.com.</div>
        </div>
        <div class="cmg-row">
          <div class="en">WHEREAS the Client has been provided a full opportunity to read, review, and seek independent legal advice in relation to this Agreement prior to execution.</div>
          <div class="ar" dir="rtl" lang="ar">وحيث إنه قد أُتيحت للعميل الفرصة الكاملة لقراءة هذه الاتفاقية ومراجعتها والحصول على مشورة قانونية مستقلة بشأنها قبل التوقيع عليها.</div>
        </div>
        <div class="cmg-row">
          <div class="en">NOW THEREFORE, in consideration of the mutual covenants herein, the parties agree as follows:</div>
          <div class="ar" dir="rtl" lang="ar">وعليه، ونظير التعهدات المتبادلة الواردة في هذه الاتفاقية، اتفق الطرفان على ما يلي:</div>
        </div>
      </div>
    </section>

    ${clauseHtml}

    <div class="annexure-title">
      <span class="en">ANNEXURE A — SCOPE OF SERVICES AND FEE SCHEDULE</span>
      <span class="ar" dir="rtl" lang="ar">الملحق (أ) — نطاق الخدمات وجدول الرسوم</span>
    </div>

    ${section('1. SERVICE DETAILS', '1. تفاصيل الخدمة', [
      row('Service', serviceProgram, 'الخدمة'),
      ...(visaSubclass ? [row('Visa Subclass(es)', visaSubclass, 'فئة/فئات التأشيرة')] : []),
      row('Scope Includes', includedDeliverables, 'يشمل النطاق'),
      row('Scope Excludes', expressExclusions, 'يستثني النطاق'),
      ...(specialTerms ? [row('Special Terms', specialTerms, 'شروط خاصة')] : []),
    ].join(''))}

    <section class="cmg-block">
      ${sectionHeader('2. FEES', '2. الرسوم')}
      <table class="fee-table">
        <thead><tr><th style="width:36px">No.</th><th>Description</th><th class="num">Amount (${esc(currencyCode)})</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Professional (Retainer) Fee — ${esc(serviceProgram)}<span class="ar" dir="rtl" lang="ar">أتعاب مهنية (رسوم الاحتفاظ)</span></td><td class="num">${esc(totalAmount)}</td></tr>
          <tr><td>2</td><td>VAT as per UAE VAT Law<span class="ar" dir="rtl" lang="ar">ضريبة القيمة المضافة وفق القانون الإماراتي</span></td><td class="num">${esc(vatAmount || 'As per UAE VAT Law')}</td></tr>
          <tr class="total"><td></td><td>Total Payable to CW Migration<span class="ar" dir="rtl" lang="ar">إجمالي المبلغ المستحق لـ CW Migration</span></td><td class="num">${esc(totalPayable)}</td></tr>
          <tr><td>3</td><td>Government / Authority Fees — <strong>NOT INCLUDED</strong>, paid directly by the Client (current estimate)<span class="ar" dir="rtl" lang="ar">رسوم الحكومة / الجهات المختصة — غير مشمولة، يدفعها العميل مباشرة (التقدير الحالي)</span></td><td class="num">${esc(governmentFeeEstimate)}</td></tr>
        </tbody>
      </table>
    </section>

    <section class="cmg-block">
      ${sectionHeader('3. PAYMENT SCHEDULE', '3. جدول الدفعات')}
      <table class="fee-table">
        <thead><tr><th style="width:36px">No.</th><th>Instalment</th><th>Due</th><th class="num">Amount (${esc(currencyCode)})</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Initial Payment<span class="ar" dir="rtl" lang="ar">الدفعة الأولى</span></td><td>Upon signing<span class="ar" dir="rtl" lang="ar">عند التوقيع</span></td><td class="num">${esc(initialPayment)}</td></tr>
          <tr><td>2</td><td>Second Payment<span class="ar" dir="rtl" lang="ar">الدفعة الثانية</span></td><td>${esc(secondPaymentAnnexEn)}<span class="ar" dir="rtl" lang="ar">${esc(secondPaymentAnnexAr)}</span></td><td class="num">${esc(secondPayment)}</td></tr>
        </tbody>
      </table>
    </section>

    ${section('4. SIGNATURES', '4. التوقيعات', [
      `<div class="cmg-row">
          <div class="en"><strong>Client</strong><br><br>Signature: ________________________________<br><br>Name: ________________________________<br><br>Date: ________________________________</div>
          <div class="ar" dir="rtl" lang="ar"><strong>العميل</strong><br><br>التوقيع: ________________________________<br><br>الاسم: ________________________________<br><br>التاريخ: ________________________________</div>
        </div>`,
      `<div class="cmg-row">
          <div class="en"><strong>For and on Behalf of ${esc(COMPANY.nameEn)} (CW Migration)</strong><br><br>Authorised Signature: ________________________________<br><br>Name: ________________________________<br><br>Date: ________________________________</div>
          <div class="ar" dir="rtl" lang="ar"><strong>نيابة عن ${esc(COMPANY.nameAr)} (CW Migration)</strong><br><br>التوقيع المعتمد: ________________________________<br><br>الاسم: ________________________________<br><br>التاريخ: ________________________________</div>
        </div>`,
    ].join(''))}

    ${footerHtml()}
  </main>
</body>
</html>`;
  // The preamble also mentions MARA-registered agents.
  return maraAgent ? html : withoutMara(html);
}
