// Bilingual (EN/AR) "Client Advisory Agreement" — Dubai branch, operating as
// Commonwealth Migration Group (CMG) / Commonwealth Document Clearing
// Services, a MARA-registered UAE migration consultancy.
//
// Transcribed verbatim (English) from the signed reference PDF
// ("CMG_Client_Advisory_Agreement_Bilingual.pdf") with a professional Arabic
// translation carrying the same legal meaning. This single file is the only
// agreement renderer in the app — see renderAgreementForBranch.ts.

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
}

// Fixed branch identity — Commonwealth Migration Group, Dubai. Legal name vs.
// trading name matches both reference PDFs (agreement + tax invoice)
// exactly: the registered entity is Commonwealth Document Clearing Services;
// "Commonwealth Migration Group" / "CMG" is its trading name.
const COMPANY = {
  nameEn: 'Commonwealth Document Clearing Services',
  nameAr: 'خدمات كومنولث لتخليص المستندات',
  tradingAsEn: 'Commonwealth Migration Group ("CMG")',
  tradingAsAr: 'مجموعة كومنولث للهجرة ("CMG")',
  addressEn: 'Office 307, 3rd Floor, Business Atrium Building, Oud Metha, Dubai, UAE',
  addressAr: 'مكتب 307، الطابق الثالث، مبنى بزنس أتريوم، عود ميثاء، دبي، الإمارات العربية المتحدة',
  regulatoryEn: 'MARA-Registered Migration Agent — Australia',
  regulatoryAr: 'وكيل هجرة مسجل لدى MARA — أستراليا',
  contactEn: 'accounts@cwmigrationgroup.ae | cwmigrationgroup.ae',
  contactAr: 'accounts@cwmigrationgroup.ae | cwmigrationgroup.ae',
  currencyCode: 'AED',
};

// The 14 clauses, verbatim (English) from the signed PDF, in its own order/numbering.
const clauses: Array<[string, string[], string, string[]]> = [
  ['1. DEFINITIONS AND INTERPRETATION', [
    '1.1 "CMG" means Commonwealth Document Clearing Services, trading as Commonwealth Migration Group, together with its officers, employees, agents, branches and authorised representatives in the UAE and the region.',
    '1.2 "Client" means the individual(s) named in this Agreement who has/have engaged CMG for migration consultancy services, including all family members included in the same application.',
    '1.3 "Services" means only the immigration consultancy services specified in Annexure A.',
    '1.4 "Retainer Fee" means the professional fees payable to CMG as detailed in Annexure A.',
    '1.5 "Government / Authority Fees" means all fees payable to the Department of Home Affairs, Skills Assessment Authorities, State/Territory nomination bodies, English testing bodies, or any other government or quasi-government body. These are excluded from the Retainer Fee and are the Client’s sole responsibility.',
    '1.6 "Refusal" or "Rejection" means any negative decision, refusal, cancellation, withdrawal-deemed-refusal, or non-approval issued by an Authority in respect of any application lodged under this Agreement.',
    '1.7 "DIAC" means the Dubai International Arbitration Centre.',
    '1.8 Interpretation: words importing the singular include the plural and vice versa; references to any statutory provision include modifications or re-enactments; headings are for convenience only and do not affect interpretation.',
  ], '1. التعريفات والتفسير', [
    '1.1 تعني "CMG" شركة خدمات كومنولث لتخليص المستندات، العاملة تحت اسم مجموعة كومنولث للهجرة، وموظفيها ومسؤوليها ووكلائها وفروعها وممثليها المعتمدين في دولة الإمارات العربية المتحدة والمنطقة.',
    '1.2 يعني "العميل" الشخص أو الأشخاص المحددة أسماؤهم في هذه الاتفاقية والذين استعانوا بـ CMG للحصول على خدمات استشارات الهجرة، بما في ذلك جميع أفراد الأسرة المدرجين في الطلب ذاته.',
    '1.3 تعني "الخدمات" حصرًا خدمات استشارات الهجرة المحددة في الملحق أ.',
    '1.4 تعني "رسوم الاحتجاز" الأتعاب المهنية المستحقة لـ CMG كما هو مفصل في الملحق أ.',
    '1.5 تعني "رسوم الحكومة / الجهات المختصة" جميع الرسوم المستحقة لوزارة الشؤون الداخلية، أو هيئات تقييم المهارات، أو جهات الترشيح الإقليمية/الولائية، أو هيئات اختبار اللغة، أو أي جهة حكومية أو شبه حكومية أخرى. وهذه الرسوم مستثناة من رسوم الاحتجاز وتقع على عاتق العميل وحده.',
    '1.6 يعني "الرفض" أي قرار سلبي، أو رفض، أو إلغاء، أو سحب يُعامل كرفض، أو عدم موافقة صادر عن جهة مختصة بخصوص أي طلب مقدم بموجب هذه الاتفاقية.',
    '1.7 يعني "DIAC" مركز دبي الدولي للتحكيم.',
    '1.8 التفسير: تشمل الكلمات الدالة على المفرد الجمع والعكس صحيح؛ وتشمل الإشارات إلى أي حكم قانوني أي تعديلات أو إعادة سنّه؛ والعناوين لغرض التيسير فقط ولا تؤثر على التفسير.',
  ]],
  ['2. SCOPE OF SERVICES', [
    '2.1 CMG agrees to provide only the Services specified in Annexure A, including: (a) pre-application eligibility assessment, (b) document review and preparation, (c) submission and follow-up of the application, (d) liaison with the relevant Authority, and (e) general consultation and advice.',
    '2.2 Services are strictly limited to migration consultancy and do not include legal representation, legal advice, or courtroom/tribunal representation of any kind.',
    '2.3 Any services beyond the scope of Annexure A (including refiling, appeals, reassessment, additional family members, or a change of visa subclass/program) require a separate written agreement and additional fees.',
    '2.4 CMG may engage third-party agents, MARA agents, translators, or assessors to fulfil part of the Services. The Client consents to CMG sharing their information with such third parties strictly for the purpose of providing the Services.',
  ], '2. نطاق الخدمات', [
    '2.1 توافق CMG على تقديم الخدمات المحددة في الملحق أ فقط، وتشمل: (أ) تقييم الأهلية قبل التقديم، (ب) مراجعة وإعداد المستندات، (ج) تقديم الطلب ومتابعته، (د) التواصل مع الجهة المختصة ذات الصلة، و(هـ) الاستشارة والمشورة العامة.',
    '2.2 تقتصر الخدمات حصرًا على الاستشارات المتعلقة بالهجرة ولا تشمل التمثيل القانوني أو المشورة القانونية أو التمثيل أمام المحاكم أو الهيئات القضائية بأي شكل.',
    '2.3 أي خدمات تتجاوز نطاق الملحق أ (بما في ذلك إعادة التقديم، أو الطعون، أو إعادة التقييم، أو إضافة أفراد أسرة، أو تغيير فئة/برنامج التأشيرة) تستلزم اتفاقية مكتوبة منفصلة ورسومًا إضافية.',
    '2.4 يجوز لـ CMG الاستعانة بوكلاء من أطراف ثالثة، أو وكلاء مسجلين لدى MARA، أو مترجمين، أو مقيّمين لتنفيذ جزء من الخدمات. ويوافق العميل على مشاركة CMG لمعلوماته مع هذه الأطراف الثالثة حصرًا لغرض تقديم الخدمات.',
  ]],
  ['3. NO GUARANTEE OF OUTCOME', [
    '3.1 CMG does not guarantee, represent, or warrant the success, approval, timeline, or positive outcome of any visa application, skills assessment, expression of interest, nomination, or immigration process.',
    '3.2 All decisions are made solely by the relevant Authorities (including the Department of Home Affairs, Skills Assessment bodies, and State/Territory nomination authorities). CMG has no influence over Authority decisions, processing times, occupation lists, invitation rounds, or points thresholds, and accepts no liability for them.',
    '3.3 CMG is not liable for any changes in immigration laws, policies, occupation lists, invitation scores, quotas, or processing times occurring after the signing of this Agreement.',
    '3.4 An unsuccessful, delayed, or partially successful outcome does not, by itself, entitle the Client to any refund except strictly as stated in Clause 8 (Refund Policy).',
    '3.5 No verbal or written representation made by any CMG employee, agent, or representative outside this Agreement constitutes a guarantee of outcome. The Client agrees not to rely on any such representation and confirms that no such promise induced them to sign this Agreement.',
    '3.6 The Client acknowledges that CMG has conducted only a preliminary assessment based on the information and documents provided by the Client, and that eligibility may change if the information provided is incomplete, inaccurate, or later found to be incorrect.',
  ], '3. عدم ضمان النتائج', [
    '3.1 لا تضمن CMG ولا تقر ولا تكفل نجاح أو الموافقة على أو المدة الزمنية أو تحقيق نتيجة إيجابية لأي طلب تأشيرة، أو تقييم مهارات، أو تعبير عن الاهتمام، أو ترشيح، أو إجراء هجرة.',
    '3.2 تُتخذ جميع القرارات حصرًا من قبل الجهات المختصة ذات الصلة (بما في ذلك وزارة الشؤون الداخلية، وهيئات تقييم المهارات، وجهات الترشيح الإقليمية/الولائية). ولا تملك CMG أي تأثير على قرارات هذه الجهات، أو مدد المعالجة، أو قوائم المهن، أو جولات الدعوة، أو حدود النقاط، ولا تتحمل أي مسؤولية عنها.',
    '3.3 لا تتحمل CMG مسؤولية أي تغييرات في قوانين أو سياسات الهجرة، أو قوائم المهن، أو درجات الدعوة، أو الحصص، أو مدد المعالجة التي تطرأ بعد توقيع هذه الاتفاقية.',
    '3.4 لا تخوّل النتيجة غير الناجحة أو المتأخرة أو الناجحة جزئيًا، بحد ذاتها، العميل الحق في أي استرداد إلا وفق ما هو منصوص عليه حصرًا في البند 8 (سياسة الاسترداد).',
    '3.5 لا يشكل أي تصريح شفهي أو كتابي يصدر عن أي موظف أو وكيل أو ممثل لدى CMG خارج نطاق هذه الاتفاقية ضمانًا لأي نتيجة، ويوافق العميل على عدم الاعتماد على أي تصريح من هذا القبيل ويؤكد أن لا وعد من هذا النوع كان الدافع لتوقيعه هذه الاتفاقية.',
    '3.6 يقر العميل بأن CMG أجرت تقييمًا أوليًا فقط استنادًا إلى المعلومات والمستندات التي قدمها العميل، وأن الأهلية قد تتغير إذا كانت المعلومات المقدمة ناقصة أو غير دقيقة أو تبين لاحقًا أنها غير صحيحة.',
  ]],
  ['4. CLIENT OBLIGATIONS AND REPRESENTATIONS', [
    '4.1 The Client warrants that all information and documents provided to CMG are true, accurate, complete, current, and not misleading, and accepts full responsibility for the accuracy of all submissions, forms, and documents signed prior to submission to CMG.',
    '4.2 The Client shall promptly (and in any event within the timeframe specified by CMG or the relevant Authority) provide all documents and information requested, including for Skills Assessment (within 15 days of signing this Agreement, unless otherwise agreed) and for English proficiency test results (within 90–120 days of signing this Agreement). Any delay by the Client that adversely affects the application, including a lapse of validity of the Skills Assessment, Expression of Interest, or invitation, is the Client’s sole responsibility and does not entitle the Client to any refund.',
    '4.3 The Client warrants that they and their dependents do not have any severe communicable medical condition, criminal record, or security issue that may affect the application, and that all medical, criminal, and security background checks mandated by the Authority must be passed. CMG is not liable for any refusal resulting from adverse findings during such checks.',
    '4.4 The Client shall maintain sufficient, legally sourced, and verifiable settlement/proof-of-funds as mandated by the Authority, and is solely responsible for presenting such proof during the application process and upon arrival. CMG does not offer assistance with travel arrangements or fund transfers.',
    '4.5 The Client shall NOT contact any immigration Authority, embassy, government body, lawyer, agent, or employer directly without prior written approval from CMG during the term of this Agreement. If such unauthorised contact negatively affects the application, CMG shall not be liable for the outcome and no refund shall be issued.',
    '4.6 The Client shall maintain respectful and professional conduct with all CMG employees. Abusive, threatening, or inappropriate conduct constitutes a material breach and may result in immediate termination without refund and without notice, and may result in legal action against the Client.',
    '4.7 The Client shall not provide false, fraudulent, forged, or misleading documents. CMG has a legal and ethical duty to report suspected fraudulent documents to the relevant Authorities, and any such conduct forfeits the Client’s right to any refund under this Agreement.',
    '4.8 The Client shall not take any action (such as resigning from employment, selling assets, or making financial or family commitments) in anticipation of a visa grant or positive outcome. CMG accepts no liability for such actions and no refund shall be payable in connection with losses arising from them.',
    '4.9 All documentation must be provided in English or accompanied by a certified legal translation, with a sworn statement from a qualified translator (who may not be the Client or a relative of the Client).',
    '4.10 The Client agrees to attend all interviews, medical examinations, biometric appointments, and other requirements within the stipulated timeframe. Failure to do so, without CMG’s fault, relieves CMG of liability for any adverse outcome and does not entitle the Client to a refund.',
    '4.11 The Client shall not instruct their bank or financial institution to reverse, dispute, charge back, or dishonour any payment made to CMG. Any bounced cheque or reversed payment (‘chargeback’) shall be treated as a material breach entitling CMG to suspend Services immediately and to recover the amount plus reasonable recovery costs, and forfeits the Client’s eligibility for any refund under Clause 8.',
  ], '4. التزامات العميل وإقراراته', [
    '4.1 يقر العميل بأن جميع المعلومات والمستندات المقدمة إلى CMG صحيحة ودقيقة وكاملة وحديثة وغير مضللة، ويتحمل العميل المسؤولية الكاملة عن دقة جميع المستندات والنماذج التي يوقّعها قبل تقديمها إلى CMG.',
    '4.2 يجب على العميل أن يقدم فورًا (وفي جميع الأحوال ضمن الإطار الزمني الذي تحدده CMG أو الجهة المختصة) جميع المستندات والمعلومات المطلوبة، بما في ذلك ما يخص تقييم المهارات (خلال 15 يومًا من توقيع هذه الاتفاقية، ما لم يُتفق على خلاف ذلك) ونتائج اختبار الكفاءة في اللغة الإنجليزية (خلال 90 إلى 120 يومًا من توقيع هذه الاتفاقية). وأي تأخر من جانب العميل يؤثر سلبًا على الطلب، بما في ذلك انتهاء صلاحية تقييم المهارات أو التعبير عن الاهتمام أو الدعوة، يقع على عاتق العميل وحده ولا يخوّله الحق في أي استرداد.',
    '4.3 يقر العميل بأنه هو وأفراد عائلته لا يعانون من أي حالة طبية معدية خطيرة أو سجل جنائي أو مشكلة أمنية قد تؤثر على الطلب، وأنه يجب اجتياز جميع الفحوصات الطبية والجنائية والأمنية التي تفرضها الجهة المختصة بنجاح. ولن تكون CMG مسؤولة عن أي رفض ناتج عن نتائج سلبية أثناء هذه الفحوصات.',
    '4.4 يجب على العميل الاحتفاظ بأموال تسوية/إثبات مالي كافية ومن مصادر قانونية وقابلة للتحقق وفقًا لما تفرضه الجهة المختصة، ويتحمل وحده مسؤولية تقديم هذا الإثبات أثناء إجراء التقديم وعند الوصول. ولا تقدم CMG المساعدة في ترتيبات السفر أو تحويل الأموال.',
    '4.5 لا يجوز للعميل التواصل مع أي جهة هجرة، أو سفارة، أو جهة حكومية، أو محامٍ، أو وكيل، أو رب عمل بشكل مباشر دون الحصول على موافقة كتابية مسبقة من CMG طوال مدة هذه الاتفاقية. وإذا أثر هذا التواصل غير المصرح به سلبًا على الطلب، فلن تكون CMG مسؤولة عن النتيجة ولن يُصدر أي استرداد.',
    '4.6 يلتزم العميل بالحفاظ على سلوك محترم ومهني مع جميع موظفي CMG. ويشكل أي سلوك مسيء أو تهديدي أو غير لائق إخلالًا جوهريًا قد يؤدي إلى إنهاء فوري دون استرداد ودون إشعار، وقد يؤدي إلى اتخاذ إجراءات قانونية ضد العميل.',
    '4.7 لا يجوز للعميل تقديم مستندات كاذبة أو احتيالية أو مزورة أو مضللة. وتلتزم CMG قانونيًا وأخلاقيًا بالإبلاغ عن أي مستندات يُشتبه في تزويرها للجهات المختصة، ويسقط حق العميل في أي استرداد بموجب هذه الاتفاقية في حال ثبوت ذلك.',
    '4.8 لا يجوز للعميل اتخاذ أي إجراء (مثل الاستقالة من العمل، أو بيع الأصول، أو الالتزام بتعهدات مالية أو أسرية) تحسبًا للحصول على تأشيرة أو نتيجة إيجابية. ولا تتحمل CMG أي مسؤولية عن مثل هذه الإجراءات ولن يُستحق أي استرداد فيما يتعلق بالخسائر الناشئة عنها.',
    '4.9 يجب أن تكون جميع المستندات باللغة الإنجليزية أو مصحوبة بترجمة قانونية معتمدة، مع بيان مشفوع بالقسم من مترجم مؤهل (لا يجوز أن يكون العميل أو أحد أقاربه).',
    '4.10 يوافق العميل على حضور جميع المقابلات والفحوصات الطبية ومواعيد البصمة البيومترية والمتطلبات الأخرى ضمن الإطار الزمني المحدد. وعدم القيام بذلك، دون تقصير من CMG، يعفي CMG من المسؤولية عن أي نتيجة سلبية ولا يخوّل العميل الحق في استرداد.',
    '4.11 لا يجوز للعميل إصدار تعليمات لبنكه أو مؤسسته المالية بعكس أو الاعتراض على أو استرجاع أو رفض أي دفعة مقدمة إلى CMG. ويُعامل أي شيك مرتجع أو دفعة معكوسة ("chargeback") كإخلال جوهري يخوّل CMG تعليق الخدمات فورًا واسترداد المبلغ بالإضافة إلى تكاليف التحصيل المعقولة، ويسقط أهلية العميل لأي استرداد بموجب البند 8.',
  ]],
  ['5. FEES AND PAYMENT', [
    '5.1 The Client agrees to pay the Retainer Fee per the schedule in Annexure A.',
    '5.2 All Government / Authority fees are entirely the Client’s responsibility and are not covered by this Agreement, regardless of whether CMG assists in submitting such payments.',
    '5.3 Non-payment of any instalment may result in immediate suspension or termination of Services without notice or refund.',
    '5.4 CMG may withhold submission of any application, EOI, or nomination until all outstanding fees are paid in full.',
    '5.5 Any amount not paid within 7 days of its due date shall accrue interest at the rate of 1.5% per month (or the maximum rate permitted by UAE law, whichever is lower) from the due date until the date of actual payment.',
    '5.6 In the event CMG engages legal counsel or a debt recovery agency to recover outstanding amounts, all associated costs — including legal fees, court fees, and collection charges — shall be borne entirely by the Client.',
    '5.7 Any payment plan agreed verbally or in writing must be honoured in full. Failure to adhere to an agreed payment plan constitutes a material breach of this Agreement and entitles CMG to suspend or terminate Services without refund.',
    '5.8 CMG does not accept payment into any employee’s personal account. Any such payment is considered unauthorised, and CMG shall not be liable for any loss, dispute, or consequence arising from it. All official payments must be made through CMG’s verified company bank accounts, approved online payment gateways, or at CMG’s official office locations, with an official company receipt issued.',
  ], '5. الرسوم والدفع', [
    '5.1 يوافق العميل على سداد رسوم الاحتجاز وفق الجدول الزمني المحدد في الملحق أ.',
    '5.2 تقع جميع رسوم الحكومة / الجهات المختصة على عاتق العميل وحده وهي غير مشمولة بهذه الاتفاقية، بصرف النظر عما إذا كانت CMG تساعد في تقديم هذه المدفوعات.',
    '5.3 قد يؤدي عدم سداد أي قسط إلى تعليق أو إنهاء فوري للخدمات دون إشعار أو استرداد.',
    '5.4 يجوز لـ CMG تأجيل تقديم أي طلب أو تعبير عن اهتمام أو ترشيح إلى حين سداد جميع الرسوم المستحقة بالكامل.',
    '5.5 يستحق على أي مبلغ لم يُسدد خلال 7 أيام من تاريخ استحقاقه فائدة تأخيرية بمعدل 1.5% شهريًا (أو الحد الأقصى الذي يسمح به القانون الإماراتي، أيهما أدنى) من تاريخ الاستحقاق وحتى تاريخ السداد الفعلي.',
    '5.6 في حال اضطرار CMG إلى الاستعانة بمستشار قانوني أو وكالة تحصيل ديون لاسترداد مبالغ مستحقة، تقع جميع التكاليف المرتبطة بذلك — بما في ذلك أتعاب المحاماة ورسوم المحكمة وتكاليف التحصيل — على عاتق العميل وحده.',
    '5.7 يجب الوفاء الكامل بأي خطة سداد متفق عليها شفهيًا أو كتابيًا. ويُعد الإخفاق في الالتزام بخطة السداد المتفق عليها إخلالًا جوهريًا بهذه الاتفاقية ويخوّل CMG تعليق أو إنهاء الخدمات دون استرداد.',
    '5.8 لا تقبل CMG أي دفع إلى الحساب الشخصي لأي موظف. ويُعتبر أي دفع من هذا النوع غير مصرح به، ولا تتحمل CMG أي مسؤولية عن أي خسارة أو نزاع أو تبعات تنشأ عنه. ويجب أن تتم جميع المدفوعات الرسمية فقط من خلال حسابات CMG البنكية الموثقة، أو بوابات الدفع الإلكترونية المعتمدة، أو في أحد مكاتب CMG الرسمية، مع إصدار إيصال رسمي من الشركة.',
  ]],
  ['6. LIMITATION OF LIABILITY', [
    '6.1 To the maximum extent permitted by law, CMG shall not be liable for: any Authority decision, delay, refusal, or processing time; changes in law or policy; inaccurate, incomplete, or delayed information/documents provided by the Client; Client’s delay in providing documents or attending appointments; Client’s unauthorised contact with any Authority or third party; Client’s actions taken in anticipation of a visa; the loss of records in transit (which remains the courier’s responsibility); the authenticity of documents that appear genuine on their face; Force Majeure Events; or reliance on any representation made outside this Agreement.',
    '6.2 CMG’s maximum aggregate liability, under any theory of liability (contract, tort, or otherwise), shall not exceed the total Retainer Fee actually paid by the Client, and shall exclude any indirect, incidental, consequential, or punitive damages, loss of income, loss of opportunity, or loss of visa eligibility.',
    '6.3 The Client acknowledges that CMG’s role is limited to consultancy and advisory support and does not include, unless separately agreed in writing, any guarantee of employment, job placement, or a specific number of job applications submitted.',
  ], '6. تحديد المسؤولية', [
    '6.1 إلى أقصى حد يسمح به القانون، لا تتحمل CMG المسؤولية عن: أي قرار أو تأخير أو رفض أو مدة معالجة صادرة عن جهة مختصة؛ أو التغييرات في القانون أو السياسة؛ أو المعلومات/المستندات غير الدقيقة أو الناقصة أو المتأخرة المقدمة من العميل؛ أو تأخر العميل في تقديم المستندات أو حضور المواعيد؛ أو تواصل العميل غير المصرح به مع أي جهة مختصة أو طرف ثالث؛ أو إجراءات العميل المتخذة تحسبًا للحصول على تأشيرة؛ أو فقدان السجلات أثناء النقل (والتي تقع مسؤوليتها على شركة التوصيل)؛ أو صحة المستندات التي تبدو أصلية ظاهريًا؛ أو أحداث القوة القاهرة؛ أو الاعتماد على أي تصريح خارج نطاق هذه الاتفاقية.',
    '6.2 لا تتجاوز المسؤولية الإجمالية القصوى لـ CMG، بموجب أي نظرية مسؤولية (تعاقدية أو تقصيرية أو غير ذلك)، إجمالي رسوم الاحتجاز التي سددها العميل فعليًا، وتستثني أي أضرار غير مباشرة أو عرضية أو تبعية أو تأديبية، أو خسارة الدخل، أو خسارة الفرصة، أو فقدان أهلية التأشيرة.',
    '6.3 يقر العميل بأن دور CMG يقتصر على الاستشارات والدعم الاستشاري ولا يشمل، ما لم يُتفق على خلاف ذلك كتابيًا، أي ضمان للتوظيف أو التنسيب الوظيفي أو عدد محدد من طلبات العمل المقدمة.',
  ]],
  ['7. INDEMNIFICATION', [
    '7.1 The Client shall indemnify, defend, and hold harmless CMG, its officers, employees, agents, and authorised representatives (collectively "Indemnified Parties") from and against any and all claims, demands, losses, damages, liabilities, costs, and expenses (including reasonable legal fees) arising out of or in connection with: (a) any false, misleading, incomplete, or fraudulent information or documents provided by the Client; (b) any breach by the Client of this Agreement; (c) any action taken by the Client in anticipation of a visa grant, skills assessment outcome, or other immigration result; (d) any unauthorised direct contact by the Client with any Authority or third party in connection with the Services; and (e) any complaint, claim, or report filed by the Client with any regulatory authority, licensing body, or government agency that results in any investigation, suspension, cancellation, or restriction of CMG’s MARA registration, business licence, or operational capacity.',
    '7.2 Without limiting Clause 7.1(e), if any action or complaint by the Client — whether filed directly or facilitated through a third party — results in the suspension, cancellation, or restriction of CMG’s MARA registration or any operating licence, the Client shall be liable to CMG for all direct and consequential losses during the period of suspension or restriction, including lost revenue and business opportunities, legal representation costs, and reputational and operational rehabilitation costs.',
    '7.3 This indemnification obligation shall survive the termination or expiry of this Agreement.',
  ], '7. التعويض', [
    '7.1 يلتزم العميل بتعويض CMG ومسؤوليها وموظفيها ووكلائها وممثليها المعتمدين ("الأطراف المُعوَّضة") والدفاع عنهم وإبراء ذمتهم من وضد جميع المطالبات والطلبات والخسائر والأضرار والمسؤوليات والتكاليف والمصاريف (بما في ذلك أتعاب المحاماة المعقولة) الناشئة عن أو المرتبطة بـ: (أ) أي معلومات أو مستندات كاذبة أو مضللة أو ناقصة أو احتيالية يقدمها العميل؛ (ب) أي إخلال من العميل بهذه الاتفاقية؛ (ج) أي إجراء يتخذه العميل تحسبًا للحصول على تأشيرة أو نتيجة تقييم مهارات أو أي نتيجة هجرة أخرى؛ (د) أي تواصل مباشر غير مصرح به من العميل مع أي جهة مختصة أو طرف ثالث فيما يتعلق بالخدمات؛ و(هـ) أي شكوى أو مطالبة أو بلاغ يقدمه العميل إلى أي جهة تنظيمية أو هيئة ترخيص أو جهة حكومية يؤدي إلى أي تحقيق أو تعليق أو إلغاء أو تقييد لتسجيل CMG لدى MARA أو رخصتها التجارية أو قدرتها التشغيلية.',
    '7.2 دون الإخلال بعمومية البند 7.1(هـ)، إذا أدى أي إجراء أو شكوى من العميل — سواء قُدمت مباشرة أو من خلال طرف ثالث — إلى تعليق أو إلغاء أو تقييد تسجيل CMG لدى MARA أو أي رخصة تشغيلية، يكون العميل مسؤولًا تجاه CMG عن جميع الخسائر المباشرة والتبعية خلال فترة التعليق أو التقييد، بما في ذلك الإيرادات المفقودة وفرص الأعمال الضائعة، وتكاليف التمثيل القانوني، وتكاليف إعادة التأهيل السمعي والتشغيلي.',
    '7.3 يظل التزام التعويض هذا ساريًا بعد إنهاء هذه الاتفاقية أو انقضائها.',
  ]],
  ['8. REFUND POLICY', [
    '8.1 All fees are strictly non-refundable, except as expressly and narrowly stated in this Clause 8.',
    '8.2 The Client acknowledges and agrees that, under no circumstances, will CMG issue a refund where any of the following situations apply (this list is illustrative, not exhaustive):',
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
    '8.2(n) Termination due to the Client’s breach of this Agreement (including Clauses 4.6, 4.7, 4.11, or 5.7) or the Client’s misconduct;',
    '8.2(o) Dormancy of the Client’s file for 90 days or more without communication or action by the Client;',
    '8.2(p) Fees paid by CMG to government bodies or third parties on the Client’s behalf (the Client must seek such refunds directly from the relevant body);',
    '8.2(q) VAT or other government taxes remitted to the authorities;',
    '8.2(r) Force Majeure Events or the death of any person.',
    '8.3 A partial refund may be considered, at CMG’s sole discretion, only where CMG has been wholly unable to commence any Services for a reason solely and exclusively attributable to CMG, and only for the unused portion of the Retainer Fee corresponding to work not yet performed.',
    '8.4 Where CMG determines, at its sole discretion, that a refund under Clause 8.3 is approved, CMG shall process the approved refund within ninety (90) calendar days from the date the refund is approved in writing, subject to deduction of: (a) any applicable VAT/GST or government charges already remitted; (b) card/payment-processing fees actually incurred (up to 2.5%); (c) administrative and registration fees; and (d) the value of work already performed up to the date of approval.',
    '8.5 Any approved refund will be issued only by bank transfer or company cheque, in the Client’s name exclusively, to the account/address on file. No refund will be issued to a third party, nominee, or any person other than the Client named in this Agreement.',
    '8.6 The cooling-off period, if any, does not apply once any assessment, advice, document review, or file registration has been provided.',
    '8.7 Nothing in this Clause obliges CMG to review the merits of a refusal; however, CMG will, on request, provide a written summary of the work performed on a file that did not result in approval.',
  ], '8. سياسة الاسترداد', [
    '8.1 جميع الرسوم غير قابلة للاسترداد بصورة قاطعة، إلا وفق ما هو منصوص عليه صراحة وبشكل ضيق في هذا البند 8.',
    '8.2 يقر العميل ويوافق على أنه لن تُصدر CMG، تحت أي ظرف من الظروف، أي استرداد إذا انطبقت أي من الحالات التالية (هذه القائمة توضيحية وليست حصرية):',
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
    '8.2(ن) الإنهاء بسبب إخلال العميل بهذه الاتفاقية (بما في ذلك البنود 4.6 أو 4.7 أو 4.11 أو 5.7) أو سوء سلوك العميل؛',
    '8.2(س) تعليق ملف العميل لمدة 90 يومًا أو أكثر دون تواصل أو إجراء من جانب العميل؛',
    '8.2(ع) الرسوم التي تدفعها CMG لجهات حكومية أو أطراف ثالثة نيابة عن العميل (يجب على العميل طلب استرداد هذه المبالغ مباشرة من الجهة المعنية)؛',
    '8.2(ف) ضريبة القيمة المضافة أو الضرائب الحكومية الأخرى المحوّلة إلى الجهات المختصة؛',
    '8.2(ص) أحداث القوة القاهرة أو وفاة أي شخص.',
    '8.3 يجوز النظر في استرداد جزئي، وفق التقدير المطلق لـ CMG، فقط في حال عجز CMG الكامل عن بدء أي خدمات لسبب يعود حصرًا وكليًا إلى CMG، وفقط عن الجزء غير المستخدم من رسوم الاحتجاز المقابل للعمل الذي لم يُنجز بعد.',
    '8.4 في حال قررت CMG، وفق تقديرها المطلق، الموافقة على استرداد بموجب البند 8.3، تلتزم CMG بمعالجة الاسترداد المعتمد خلال تسعين (90) يومًا تقويميًا من تاريخ الموافقة الكتابية على الاسترداد، مع خصم: (أ) أي ضريبة قيمة مضافة أو رسوم حكومية سارية تم تحويلها بالفعل؛ (ب) رسوم معالجة البطاقات/الدفع المتكبدة فعليًا (حتى 2.5%)؛ (ج) الرسوم الإدارية ورسوم التسجيل؛ و(د) قيمة العمل المنجز بالفعل حتى تاريخ الموافقة.',
    '8.5 لن يُصدر أي استرداد معتمد إلا عن طريق التحويل البنكي أو شيك الشركة، باسم العميل حصرًا، إلى الحساب/العنوان المسجل. ولن يُصدر أي استرداد لطرف ثالث أو مرشح أو أي شخص بخلاف العميل المذكور في هذه الاتفاقية.',
    '8.6 لا تسري فترة التراجع، إن وجدت، بعد تقديم أي تقييم أو مشورة أو مراجعة مستندات أو تسجيل ملف.',
    '8.7 لا يُلزم أي نص في هذا البند CMG بمراجعة أسباب الرفض؛ ومع ذلك، ستقدم CMG، عند الطلب، ملخصًا كتابيًا بالعمل المنجز على الملف الذي لم يُفضِ إلى الموافقة.',
  ]],
  ['9. CONFIDENTIALITY AND DATA PROTECTION', [
    '9.1 Both parties agree to maintain the confidentiality of all information received under this Agreement. Confidential Information shall not be disclosed without prior written consent, except as required by law.',
    '9.2 The Client consents to CMG sharing their personal information with third parties as necessary to provide the Services (e.g., skills assessment bodies, Department of Home Affairs, nomination authorities, translators, and IELTS/PTE bodies), and for marketing and branding purposes related to CMG’s promotional activities.',
    '9.3 CMG processes the Client’s personal data in accordance with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL) and any applicable regulations thereunder.',
    '9.4 The Client releases CMG from all liability arising from electronic communications interception, delay, or delivery failure, provided CMG uses reasonable security measures.',
  ], '9. السرية وحماية البيانات', [
    '9.1 يتفق الطرفان على الحفاظ على سرية جميع المعلومات المتلقاة بموجب هذه الاتفاقية. ولا يجوز الإفصاح عن المعلومات السرية دون موافقة كتابية مسبقة، إلا وفق ما يقتضيه القانون.',
    '9.2 يوافق العميل على مشاركة CMG لمعلوماته الشخصية مع أطراف ثالثة بالقدر اللازم لتقديم الخدمات (مثل هيئات تقييم المهارات، ووزارة الشؤون الداخلية، وجهات الترشيح، والمترجمين، وهيئات اختبار الآيلتس/البيرسون)، ولأغراض التسويق والترويج لأنشطة CMG الترويجية.',
    '9.3 تعالج CMG بيانات العميل الشخصية وفقًا للمرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية (PDPL) وأي لوائح تنفيذية سارية بموجبه.',
    '9.4 يُعفي العميل CMG من أي مسؤولية ناشئة عن اعتراض الاتصالات الإلكترونية أو تأخرها أو فشل تسليمها، شريطة أن تتخذ CMG تدابير أمنية معقولة.',
  ]],
  ['10. TERM AND TERMINATION', [
    '10.1 This Agreement commences on the date of signing and remains in force until the Services are completed or until terminated in accordance with this Clause. Unless otherwise stated in Annexure A, this Agreement is valid for 24 months from signing and may be renewed by mutual written consent.',
    '10.2 Either party may terminate this Agreement with fifteen (15) days’ prior written notice via email.',
    '10.3 CMG may terminate immediately and without notice for: non-payment; provision of false or forged documents; material breach; Client misconduct (Clause 4.6); unauthorised engagement of another agent; or any circumstance described in Clause 8.2.',
    '10.4 Upon termination: (a) all CMG obligations cease; (b) no refund is due except strictly as set out in Clause 8; (c) the Client remains liable for all outstanding fees and charges; and (d) Clauses 6, 7, 8, 9, and 11 survive termination.',
  ], '10. مدة الاتفاقية وإنهاؤها', [
    '10.1 تسري هذه الاتفاقية اعتبارًا من تاريخ التوقيع وتظل نافذة حتى إتمام الخدمات أو حتى إنهائها وفقًا لهذا البند. وما لم يُنص على خلاف ذلك في الملحق أ، تسري هذه الاتفاقية لمدة 24 شهرًا من تاريخ التوقيع ويجوز تجديدها بموافقة كتابية متبادلة.',
    '10.2 يحق لأي من الطرفين إنهاء الاتفاقية بإشعار كتابي مسبق مدته خمسة عشر (15) يومًا عبر البريد الإلكتروني.',
    '10.3 يجوز لـ CMG إنهاء الاتفاقية فورًا ودون إشعار في الحالات التالية: عدم السداد؛ تقديم مستندات كاذبة أو مزورة؛ الإخلال الجوهري؛ سوء سلوك العميل (البند 4.6)؛ الاستعانة بوكيل آخر دون تصريح؛ أو أي حالة من الحالات الواردة في البند 8.2.',
    '10.4 عند الإنهاء: (أ) تنتهي جميع التزامات CMG؛ (ب) لا يستحق أي استرداد إلا وفق ما هو منصوص عليه حصرًا في البند 8؛ (ج) يظل العميل مسؤولًا عن جميع الرسوم والتكاليف المستحقة؛ و(د) تظل البنود 6 و7 و8 و9 و11 سارية بعد الإنهاء.',
  ]],
  ['11. SOCIAL MEDIA, REVIEWS, AND DEFAMATION', [
    '11.1 The Client agrees not to publish, on any platform (including Google, social media, review sites, or messaging applications), any content about CMG or its employees that is factually false or misleading, defamatory, malicious or abusive, or designed to cause commercial harm without factual basis.',
    '11.2 Legitimate grievances shall be addressed exclusively through the dispute resolution mechanism in Clause 13. The Client agrees to exhaust that process before making any public statement about CMG in connection with a dispute arising from this Agreement.',
    '11.3 CMG reserves the right to seek injunctive relief, damages, and all available remedies under UAE Federal Law No. 34 of 2021 on Combating Rumours and Cybercrime, UAE Federal Decree-Law No. 31 of 2021 (Penal Code), and applicable defamation laws in any relevant jurisdiction (including Australia, Canada, or the Client’s country of residence), for any breach of this Clause.',
    '11.4 Nothing in this Clause prevents the Client from making truthful, factual, and non-malicious statements about their experience with CMG in good faith, provided the Client has first followed the dispute resolution process under Clause 13.',
  ], '11. وسائل التواصل الاجتماعي والمراجعات والتشهير', [
    '11.1 يوافق العميل على عدم نشر أي محتوى عن CMG أو موظفيها، على أي منصة (بما في ذلك جوجل، ووسائل التواصل الاجتماعي، ومواقع المراجعات، وتطبيقات المراسلة)، يكون كاذبًا أو مضللًا من الناحية الواقعية، أو تشهيريًا، أو كيديًا أو مسيئًا، أو يهدف إلى إلحاق ضرر تجاري دون أساس واقعي.',
    '11.2 تُعالج الشكاوى المشروعة حصرًا من خلال آلية تسوية المنازعات المنصوص عليها في البند 13. ويوافق العميل على استنفاد هذه الإجراءات قبل الإدلاء بأي تصريح علني بشأن CMG فيما يتعلق بأي نزاع ناشئ عن هذه الاتفاقية.',
    '11.3 تحتفظ CMG بحقها في طلب الإنصاف القضائي العاجل والتعويضات وجميع سبل الانتصاف المتاحة بموجب القانون الاتحادي رقم 34 لسنة 2021 بشأن مكافحة الشائعات والجرائم الإلكترونية، والمرسوم بقانون اتحادي رقم 31 لسنة 2021 (قانون العقوبات)، وقوانين التشهير المعمول بها في أي اختصاص قضائي ذي صلة (بما في ذلك أستراليا أو كندا أو بلد إقامة العميل)، عن أي إخلال بهذا البند.',
    '11.4 لا يحول هذا البند دون قيام العميل بالإدلاء بتصريحات صادقة وواقعية وغير كيدية عن تجربته مع CMG بحسن نية، شريطة أن يكون العميل قد اتبع أولًا إجراءات تسوية المنازعات المنصوص عليها في البند 13.',
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
    '13.4 Notwithstanding Clause 13.3, CMG reserves the right to seek urgent interim or injunctive relief (including for non-payment, breach of confidentiality, or defamation) from any competent court, without this being deemed a waiver of the arbitration agreement.',
    '13.5 The Client acknowledges that pursuing a dispute through a consumer complaint, regulatory body, or public statement in parallel with, or instead of, the process set out in this Clause does not suspend or waive CMG’s right to invoke this Clause 13 or Clause 7 (Indemnification).',
  ], '13. القانون الحاكم وتسوية المنازعات', [
    '13.1 تخضع هذه الاتفاقية لقوانين دولة الإمارات العربية المتحدة، وتحديدًا القوانين السارية في إمارة دبي.',
    '13.2 تُعالج المنازعات أولًا من خلال مفاوضات بحسن نية خلال 21 يومًا من تاريخ الإشعار الكتابي.',
    '13.3 أي نزاع أو خلاف أو مطالبة تنشأ عن أو تتعلق بهذه الاتفاقية، بما في ذلك وجودها أو صحتها أو تفسيرها أو تنفيذها أو الإخلال بها أو إنهاؤها — بما في ذلك أي نزاع يتعلق برفض أو استرداد أو رسوم — ولم تتم تسويته من خلال المفاوضات بموجب البند 13.2، يُحال إلى التحكيم بشكل نهائي وحصري وفقًا لقواعد التحكيم لدى مركز دبي الدولي للتحكيم (DIAC) السارية وقت بدء إجراءات التحكيم. ويكون مقر التحكيم في دبي، الإمارات العربية المتحدة. وتكون لغة التحكيم الإنجليزية (مع توفر ترجمة عربية). وتتألف هيئة التحكيم من محكّم واحد (1) يُعيَّن وفقًا لقواعد DIAC. ويكون قرار التحكيم نهائيًا وملزمًا للطرفين.',
    '13.4 بصرف النظر عن البند 13.3، تحتفظ CMG بحقها في طلب الإنصاف القضائي العاجل أو المؤقت (بما في ذلك بخصوص عدم السداد، أو خرق السرية، أو التشهير) من أي محكمة مختصة، دون اعتبار ذلك تنازلًا عن اتفاق التحكيم.',
    '13.5 يقر العميل بأن اللجوء إلى شكوى استهلاكية أو جهة تنظيمية أو تصريح علني بالتوازي مع، أو بدلًا من، الإجراءات المنصوص عليها في هذا البند لا يعلّق أو يُسقط حق CMG في الاحتجاج بهذا البند 13 أو البند 7 (التعويض).',
  ]],
  ['14. GENERAL PROVISIONS', [
    '14.1 Entire Agreement: This Agreement, including Annexure A, together with CMG’s website terms and any referenced policies as updated from time to time, constitutes the entire agreement between the parties and supersedes all prior discussions, representations, and agreements, whether oral or written.',
    '14.2 Amendments: Amendments require a written instrument signed by both parties, except that CMG may update Government/Authority fee estimates without amending this Agreement, as such fees are outside CMG’s control.',
    '14.3 Severability: If any provision is found invalid or unenforceable, the remaining provisions continue in full force and effect, and the invalid provision shall be replaced with a valid provision that most closely reflects the parties’ original intent.',
    '14.4 Assignment: The Client may not assign or transfer any rights or obligations under this Agreement without CMG’s prior written consent. CMG may assign this Agreement to an affiliate or successor entity within the CMG group.',
    '14.5 Notices: Any notice under this Agreement shall be in writing and sent by email or registered mail to the addresses on record, and shall be deemed effective on the day of delivery or the next business day if mailed.',
    '14.6 No Waiver: Failure by CMG to enforce any provision of this Agreement shall not be construed as a waiver of that or any other provision.',
    '14.7 By signing below, the Client confirms they have read, understood, and had the opportunity to seek independent advice on this Agreement (including its Refund Policy and dispute resolution mechanism) prior to signing, and agrees to be bound by all its terms.',
  ], '14. أحكام عامة', [
    '14.1 الاتفاق الكامل: تشكل هذه الاتفاقية، بما في ذلك الملحق أ، إلى جانب شروط موقع CMG وأي سياسات مشار إليها عند تحديثها من وقت لآخر، الاتفاق الكامل بين الطرفين وتحل محل جميع المناقشات والتصريحات والاتفاقيات السابقة، سواء كانت شفهية أو كتابية.',
    '14.2 التعديلات: تستلزم أي تعديلات وثيقة كتابية موقعة من الطرفين، باستثناء أن CMG يجوز لها تحديث تقديرات رسوم الحكومة/الجهات المختصة دون تعديل هذه الاتفاقية، حيث إن هذه الرسوم خارجة عن سيطرة CMG.',
    '14.3 قابلية الفصل: إذا تبين بطلان أو عدم قابلية إنفاذ أي حكم من أحكام هذه الاتفاقية، تظل الأحكام المتبقية سارية المفعول بالكامل، ويُستبدل الحكم الباطل بحكم صحيح يعكس بأقرب ما يمكن نية الطرفين الأصلية.',
    '14.4 التنازل: لا يجوز للعميل التنازل عن أو نقل أي حقوق أو التزامات بموجب هذه الاتفاقية دون موافقة كتابية مسبقة من CMG. ويجوز لـ CMG التنازل عن هذه الاتفاقية لشركة تابعة أو خلف ضمن مجموعة CMG.',
    '14.5 الإشعارات: يجب أن يكون أي إشعار بموجب هذه الاتفاقية كتابيًا ويُرسل عبر البريد الإلكتروني أو البريد المسجل إلى العناوين المسجلة، ويُعتبر ساريًا في يوم التسليم أو يوم العمل التالي إذا أُرسل بالبريد.',
    '14.6 عدم التنازل: لا يُفسَّر إخفاق CMG في إنفاذ أي حكم من أحكام هذه الاتفاقية على أنه تنازل عن ذلك الحكم أو أي حكم آخر.',
    '14.7 بالتوقيع أدناه، يؤكد العميل أنه قرأ وفهم هذه الاتفاقية وأتيحت له الفرصة للحصول على مشورة مستقلة بشأنها (بما في ذلك سياسة الاسترداد وآلية تسوية المنازعات) قبل التوقيع، ويوافق على الالتزام بجميع أحكامها.',
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

export function renderDubaiAgreement(v: DubaiAgreementValues): string {
  const currencyCode = v.currencyCode || COMPANY.currencyCode;
  const agreementNumber = textOrBlank(v.agreementNumber);
  const agreementDate = textOrBlank(v.agreementDate);
  const clientName = textOrBlank(v.clientName);
  const nationality = textOrBlank(v.nationality);
  const passportNumber = textOrBlank(v.passportNumber);
  const clientPhone = textOrBlank(v.clientPhone);
  const clientEmail = textOrBlank(v.clientEmail);
  const serviceProgram = textOrBlank(v.serviceProgram);
  const destinationCountry = textOrBlank(v.destinationCountry);
  const visaSubclass = textOrBlank(v.visaSubclass, 'To be confirmed based on the applicable occupation/points assessment');
  const totalAmount = textOrBlank(v.totalAmount);
  const initialPayment = textOrBlank(v.initialPayment);
  const secondPayment = textOrBlank(v.secondPayment);
  const secondPaymentDue = textOrBlank(v.secondPaymentDue, 'As per Annexure A');
  const includedDeliverables = textOrBlank(v.includedDeliverables, 'Eligibility assessment, document review, application preparation and submission, liaison with the Authority, as per Clause 2');
  const expressExclusions = textOrBlank(v.expressExclusions, 'Legal representation; job placement guarantee; services not listed above');
  const specialTerms = textOrBlank(v.specialTerms, 'Standard Client Advisory Agreement terms apply as set out in the body of this Agreement');

  const clauseHtml = clauses.map(([enTitle, enBody, arTitle, arBody]) =>
    clauseSection(enTitle, enBody, arTitle, arBody)).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Client Advisory Agreement ${esc(agreementNumber)}</title>
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
    .letterhead .regulatory { font-size: 9px; color: var(--navy); font-weight: 700; margin-top: 3px; }

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
        <div class="trading-as">Trading As: ${esc(COMPANY.tradingAsEn)}</div>
        <div class="addr">${esc(COMPANY.addressEn)}</div>
        <div class="addr">${esc(COMPANY.contactEn)}</div>
        <div class="regulatory">${esc(COMPANY.regulatoryEn)}</div>
      </div>
      <div class="ar" dir="rtl" lang="ar">
        <div class="company-name">${esc(COMPANY.nameAr)}</div>
        <div class="trading-as">يعمل تحت اسم: ${esc(COMPANY.tradingAsAr)}</div>
        <div class="addr">${esc(COMPANY.addressAr)}</div>
        <div class="addr">${esc(COMPANY.contactAr)}</div>
        <div class="regulatory">${esc(COMPANY.regulatoryAr)}</div>
      </div>
    </header>

    <div class="title-bar">
      <span class="en">CLIENT ADVISORY AGREEMENT</span>
      <span class="ar" dir="rtl" lang="ar">اتفاقية استشارية للعميل</span>
    </div>

    ${section('AGREEMENT DETAILS', 'تفاصيل الاتفاقية', [
      row('Agreement No.', agreementNumber, 'رقم الاتفاقية'),
      row('Date', agreementDate, 'التاريخ'),
      row('Service Program', serviceProgram, 'برنامج الخدمة'),
      row('Country', destinationCountry, 'الدولة'),
    ].join(''))}

    ${section('SERVICE PROVIDER', 'مقدم الخدمة', [
      row('Legal Name', COMPANY.nameEn, 'الاسم القانوني', COMPANY.nameAr),
      row('Trading As', COMPANY.tradingAsEn, 'يعمل تحت اسم', COMPANY.tradingAsAr),
      row('Address', COMPANY.addressEn, 'العنوان', COMPANY.addressAr),
      row('Regulatory Status', COMPANY.regulatoryEn, 'الحالة التنظيمية', COMPANY.regulatoryAr),
    ].join(''))}

    ${section('CLIENT DETAILS', 'بيانات العميل', [
      row('Full Name', clientName, 'الاسم الكامل'),
      row('Nationality', nationality, 'الجنسية'),
      row('Passport No.', passportNumber, 'رقم جواز السفر'),
      row('Phone', clientPhone, 'الهاتف'),
      row('Email', clientEmail, 'البريد الإلكتروني'),
    ].join(''))}

    ${section('FEE SUMMARY', 'ملخص الرسوم', [
      row('Total Retainer Fee', `${currencyCode} ${totalAmount}`, 'إجمالي رسوم الاحتجاز'),
      row('Initial Payment', `${currencyCode} ${initialPayment}`, 'الدفعة الأولى'),
      row('Second / Instalment Payment', `${currencyCode} ${secondPayment} (${secondPaymentDue})`, 'الدفعة الثانية / القسط', `${currencyCode} ${secondPayment} (${secondPaymentDue})`),
      row('Government / Authority Fees', 'NOT INCLUDED — paid by Client directly', 'رسوم الحكومة / الجهات المختصة', 'غير مشمولة — يدفعها العميل مباشرة'),
      row('VAT', 'Applicable per UAE VAT Law', 'ضريبة القيمة المضافة', 'مطبقة وفق قانون ضريبة القيمة المضافة الإماراتي'),
    ].join(''))}

    <div class="important-note">
      <span class="en">IMPORTANT: All retainer fees are strictly non-refundable except as stated in Clause 8. Any approved refund is processed within 90 calendar days (Clause 8.4).</span>
      <span class="ar" dir="rtl" lang="ar">هام: جميع رسوم الاحتجاز غير قابلة للاسترداد بصورة قاطعة إلا وفق ما هو منصوص عليه في البند 8. ويُعالج أي استرداد معتمد خلال 90 يومًا تقويميًا (البند 8.4).</span>
    </div>

    <section class="cmg-block cmg-clause preamble">
      ${sectionHeader('PREAMBLE', 'تمهيد')}
      <div class="cmg-rows"><div class="cmg-row">
        <div class="en">This Client Advisory Agreement ("Agreement") is entered into between Commonwealth Document Clearing Services, trading as Commonwealth Migration Group ("CMG"), a MARA-registered, UAE-based migration consultancy, and the Client identified above.<br><br>WHEREAS CMG specialises in Australian skilled migration, partner visas, student visas, visitor visas, and related document clearing services for individuals in the UAE and the region.<br><br>WHEREAS the Client has been provided a full opportunity to read, review, and seek independent legal advice in relation to this Agreement prior to execution.<br><br>NOW THEREFORE, in consideration of the mutual covenants herein, the parties agree as follows:</div>
        <div class="ar" dir="rtl" lang="ar">تُبرم اتفاقية الخدمات الاستشارية للعميل هذه ("الاتفاقية") بين شركة خدمات كومنولث لتخليص المستندات، العاملة تحت اسم مجموعة كومنولث للهجرة ("CMG")، وهي شركة استشارات هجرة مسجلة لدى هيئة MARA ومقرها دولة الإمارات العربية المتحدة، وبين العميل المحدد أعلاه.<br><br>حيث تتخصص CMG في الهجرة الماهرة إلى أستراليا، وتأشيرات الشريك، وتأشيرات الطلاب، وتأشيرات الزيارة، وخدمات تخليص المستندات ذات الصلة للأفراد في دولة الإمارات العربية المتحدة والمنطقة.<br><br>وحيث أُتيحت للعميل فرصة كاملة لقراءة هذه الاتفاقية ومراجعتها والحصول على مشورة قانونية مستقلة بشأنها قبل توقيعها.<br><br>لذلك، وبناءً على التعهدات المتبادلة الواردة في هذه الاتفاقية، يتفق الطرفان على ما يلي:</div>
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
      row('Refund (if approved under Clause 8)', 'Processed within 90 calendar days of written approval, less applicable deductions per Clause 8.4', 'الاسترداد (إن ووفق عليه بموجب البند 8)', 'يُعالج خلال 90 يومًا تقويميًا من تاريخ الموافقة الكتابية، بعد خصم المبالغ المطبقة وفقًا للبند 8.4'),
      row('Special Terms', specialTerms, 'شروط خاصة'),
    ].join(''))}

    <div class="cmg-block signature-block">
      <div class="cmg-rows">
        <div class="cmg-row">
          <div class="en">Client Signature: ________________________________<br><br>Name: ________________________________<br><br>Date: ________________________________</div>
          <div class="ar" dir="rtl" lang="ar">توقيع العميل: ________________________________<br><br>الاسم: ________________________________<br><br>التاريخ: ________________________________</div>
        </div>
        <div class="cmg-row">
          <div class="en">For and on Behalf of ${esc(COMPANY.nameEn)} (CMG)<br><br>Authorised Signature: ________________________________<br><br>Name: ________________________________<br><br>Date: ________________________________</div>
          <div class="ar" dir="rtl" lang="ar">نيابة عن ولصالح ${esc(COMPANY.nameAr)} (CMG)<br><br>التوقيع المعتمد: ________________________________<br><br>الاسم: ________________________________<br><br>التاريخ: ________________________________</div>
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
