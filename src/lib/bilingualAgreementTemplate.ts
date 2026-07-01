const esc = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

type AgreementValues = {
  agreementNumber: string; agreementDate: string; clientName: string; clientEmail: string; clientPhone: string;
  clientAddress: string; nationality: string; passportNumber: string; serviceProgram: string; destinationCountry: string;
  totalAmount: string; initialPayment: string; secondPayment: string; branchName: string; branchAddress: string;
  emiratesId?: string; occupation?: string; clientId?: string;
};

const getClauses = (companyName: string): Array<[string, string, string, string]> => [
  ['1. DEFINITIONS AND INTERPRETATION', `1.1 “DMC” means ${companyName}, its officers, employees, agents and authorised representatives. 1.2 “Client” means the individual named in this Agreement. 1.3 “Services” means only the consultancy services specified in Annexure A. 1.4 “Retainer Fee” means the professional fees payable to DMC. 1.5 “Government / Authority Fees” means all fees payable to any government department, immigration authority, embassy, consulate, skills assessment body, university, or other competent authority of any destination country. These are excluded from the Retainer Fee and are the Client’s sole responsibility. 1.6 “Authorities” means any government body, immigration department, embassy, consulate, or assessment organisation of any destination country relevant to the Services.`, '1. التعريفات والتفسير', `1.1 يقصد بـ DMC ${companyName} وموظفيها ووكلائها وممثليها المعتمدين. 1.2 يقصد بالعميل الشخص المحدد في هذه الاتفاقية. 1.3 تعني الخدمات الخدمات الاستشارية المحددة في الملحق أ فقط. 1.4 تعني رسوم التعاقد الأتعاب المهنية المستحقة للشركة. 1.5 رسوم الحكومة والجهات المختصة غير مشمولة في رسوم التعاقد وتقع على عاتق العميل وحده. 1.6 “الجهات المختصة” تعني أي جهة حكومية أو إدارة هجرة أو سفارة أو قنصلية أو منظمة تقييم في أي دولة مقصد ذات صلة بالخدمات.`],
  ['2. SCOPE OF SERVICES', '2.1 DMC provides only the Services specified in Annexure A. Services are limited to consultancy and documentation assistance and do not include legal representation or legal advice. 2.2 Services outside Annexure A require a separate written agreement and additional fees. 2.3 DMC may use third-party agents, assessors or registered migration practitioners; the Client consents to necessary information sharing.', '2. نطاق الخدمات', '2.1 تقدم DMC الخدمات المحددة في الملحق أ فقط، وتقتصر على الاستشارات والمساعدة في المستندات ولا تشمل التمثيل القانوني أو المشورة القانونية. 2.2 تتطلب الخدمات خارج نطاق الملحق أ اتفاقية مكتوبة منفصلة ورسومًا إضافية. 2.3 يجوز لـ DMC الاستعانة بأطراف ثالثة، ويوافق العميل على مشاركة معلوماته عند الحاجة لتقديم الخدمات.'],
  ['3. NO GUARANTEE OF OUTCOME', '3.1 DMC does not guarantee, represent or warrant success, approval or a positive outcome of any visa application, skills assessment, admission or immigration process. 3.2 All decisions are made solely by the relevant Authorities and DMC has no influence over them. 3.3 DMC is not liable for changes in laws, policies, occupation lists, quotas or processing times. 3.4 An unsuccessful outcome does not entitle the Client to a refund except as stated in Clause 6.', '3. عدم ضمان النتائج', '3.1 لا تضمن DMC نجاح أو قبول أي طلب تأشيرة أو تقييم مهارات أو قبول دراسي أو أي إجراء هجرة. 3.2 تصدر جميع القرارات من الجهات المختصة وحدها ولا تملك DMC تأثيرًا عليها. 3.3 لا تتحمل DMC مسؤولية تغيّر القوانين أو السياسات أو قوائم المهن أو الحصص أو أوقات المعالجة. 3.4 لا يحق للعميل استرداد الرسوم بسبب نتيجة غير مواتية إلا وفقًا للبند 6.'],
  ['4. CLIENT OBLIGATIONS AND REPRESENTATIONS', '4.1 The Client warrants that all information and documents are true, accurate, complete and not misleading. 4.2 The Client must promptly provide requested documents; delays remain the Client’s responsibility. 4.3 The Client shall not contact Authorities directly without DMC’s written approval. 4.4 Abusive or inappropriate conduct is a material breach and may result in immediate termination without refund. 4.5 False, fraudulent or forged documents are prohibited and may be reported to Authorities. 4.6 The Client must not make employment or financial decisions in anticipation of an outcome.', '4. التزامات العميل وتعهداته', '4.1 يضمن العميل صحة ودقة واكتمال المعلومات والمستندات المقدمة. 4.2 يلتزم العميل بتقديم المستندات المطلوبة فورًا ويتحمل مسؤولية أي تأخير. 4.3 لا يجوز للعميل التواصل مباشرة مع الجهات المختصة دون موافقة كتابية من DMC. 4.4 يعد السلوك المسيء أو غير اللائق إخلالًا جوهريًا وقد يؤدي إلى الإنهاء الفوري دون استرداد. 4.5 يحظر تقديم مستندات مزورة أو احتيالية ولـ DMC حق إبلاغ الجهات المختصة. 4.6 لا يجوز اتخاذ التزامات وظيفية أو مالية توقعًا لنتيجة البرنامج.'],
  ['5. FEES AND PAYMENT', '5.1 The Client shall pay the Retainer Fee in AED according to Annexure A, plus VAT where applicable. 5.2 Government / Authority Fees are entirely the Client’s responsibility. 5.3 Non-payment may result in immediate suspension or termination without notice or refund. 5.4 DMC may withhold submission until all outstanding fees are paid.', '5. الرسوم والدفع', '5.1 يوافق العميل على سداد رسوم التعاقد بالدرهم الإماراتي وفق الملحق أ، إضافة إلى ضريبة القيمة المضافة عند انطباقها. 5.2 تقع جميع رسوم الحكومة والجهات المختصة على عاتق العميل. 5.3 قد يؤدي عدم السداد إلى تعليق أو إنهاء الخدمات فورًا دون إشعار أو استرداد. 5.4 يجوز لـ DMC تأجيل تقديم أي طلب إلى حين سداد جميع الرسوم المستحقة.'],
  ['6. REFUND POLICY', '6.1 All fees are strictly non-refundable except as expressly stated here. 6.2 Registration and administration fees, work performed, instalments, refused applications, Client breach, voluntary termination, false documents and misconduct are non-refundable. 6.3 A partial refund may be considered solely at DMC’s discretion only if DMC has wholly been unable to commence services for a reason solely attributable to DMC. 6.4 No refund applies in Force Majeure or death. 6.5 No cooling-off period applies once any assessment or advice has been provided.', '6. سياسة الاسترداد', '6.1 جميع الرسوم غير قابلة للاسترداد إلا وفق ما هو منصوص عليه صراحة في هذا البند. 6.2 رسوم التسجيل والإدارة والأعمال المنجزة والأقساط والطلبات المرفوضة وحالات إخلال العميل أو الإنهاء الطوعي أو المستندات المزورة أو سوء السلوك غير قابلة للاسترداد. 6.3 يجوز النظر في استرداد جزئي وفق تقدير DMC المطلق فقط إذا تعذر عليها البدء بالخدمات لسبب يعود إليها وحدها. 6.4 لا يطبق الاسترداد في القوة القاهرة أو الوفاة. 6.5 لا تسري فترة التراجع بعد تقديم أي تقييم أو مشورة.'],
  ['7. LIMITATION OF LIABILITY', '7.1 To the maximum extent permitted by law, DMC is not liable for Authority decisions, changes in law or policy, inaccurate Client information, Client delays, unauthorised Authority contact, Client actions, Force Majeure or representations outside this Agreement. 7.2 DMC’s maximum aggregate liability shall not exceed the Retainer Fee actually paid by the Client.', '7. تحديد المسؤولية', '7.1 إلى أقصى حد يسمح به القانون، لا تتحمل DMC مسؤولية قرارات الجهات المختصة أو تغيّر القانون والسياسات أو معلومات العميل غير الدقيقة أو تأخره أو تواصله غير المصرح به أو أفعاله أو القوة القاهرة أو التصريحات خارج هذه الاتفاقية. 7.2 لا تتجاوز المسؤولية الإجمالية القصوى لـ DMC إجمالي رسوم التعاقد المدفوعة فعليًا.'],
  ['8. CONFIDENTIALITY', '8.1 Both parties shall keep information received under this Agreement confidential except as required by law. 8.2 The Client consents to DMC sharing personal information with third parties as necessary to provide the Services. 8.3 The Client releases DMC from liability for interception or delivery failure of electronic communications where reasonable security measures are used.', '8. السرية', '8.1 يلتزم الطرفان بالحفاظ على سرية المعلومات المتلقاة بموجب الاتفاقية إلا بما يقتضيه القانون. 8.2 يوافق العميل على مشاركة DMC لمعلوماته الشخصية مع الأطراف الثالثة عند الحاجة لتقديم الخدمات. 8.3 يعفي العميل DMC من المسؤولية عن اعتراض أو فشل تسليم الاتصالات الإلكترونية متى اتخذت تدابير أمنية معقولة.'],
  ['9. TERM AND TERMINATION', '9.1 This Agreement starts on signing and remains effective until Services are completed or terminated. 9.2 Either party may terminate with 15 days’ written email notice. 9.3 DMC may terminate immediately for non-payment, false documents, material breach, misconduct or engaging another agent without consent. 9.4 On termination DMC obligations cease, no refund is due except under Clause 6, and outstanding fees remain payable. 9.5 This Agreement expires after 12 months unless extended in writing.', '9. مدة الاتفاقية وإنهاؤها', '9.1 تسري هذه الاتفاقية من تاريخ التوقيع حتى إتمام الخدمات أو إنهائها. 9.2 يجوز لأي طرف الإنهاء بإشعار كتابي عبر البريد الإلكتروني مدته 15 يومًا. 9.3 يجوز لـ DMC الإنهاء فورًا عند عدم السداد أو تقديم مستندات مزورة أو الإخلال الجوهري أو سوء السلوك أو الاستعانة بوكيل آخر دون موافقة. 9.4 عند الإنهاء تنتهي التزامات DMC وتبقى الرسوم المستحقة واجبة السداد. 9.5 تنتهي الاتفاقية بعد 12 شهرًا ما لم تمدد كتابيًا.'],
  ['10. SOCIAL MEDIA AND DEFAMATION', 'The Client shall not publish false, defamatory or abusive content about DMC on any platform before obtaining a court judgment in their favour. DMC may seek damages and legal action under applicable UAE laws, including Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrimes.', '10. وسائل التواصل الاجتماعي والتشهير', 'يوافق العميل على عدم نشر أي محتوى كاذب أو تشهيري أو مسيء عن DMC على أي منصة قبل الحصول على حكم قضائي لصالحه. تحتفظ DMC بحقها في المطالبة بالتعويض واتخاذ الإجراءات القانونية بموجب قوانين الإمارات السارية، بما فيها المرسوم بقانون اتحادي رقم 34 لسنة 2021 بشأن مكافحة الشائعات والجرائم الإلكترونية.'],
  ['11. FORCE MAJEURE', 'Neither party is liable for failure caused by events beyond reasonable control, including acts of God, war, government restrictions, pandemics or infrastructure failures. If a Force Majeure Event continues more than 90 days, either party may terminate. No refund applies in Force Majeure circumstances.', '11. القوة القاهرة', 'لا يتحمل أي من الطرفين مسؤولية الإخفاق الناتج عن أحداث خارجة عن إرادته المعقولة، بما فيها الكوارث الطبيعية والحروب والقيود الحكومية والجوائح أو تعطل البنية التحتية. إذا استمر الحدث أكثر من 90 يومًا يجوز لأي من الطرفين الإنهاء، ولا يطبق أي استرداد في ظروف القوة القاهرة.'],
  ['12. GOVERNING LAW AND DISPUTE RESOLUTION', 'This Agreement is governed by the federal laws of the UAE and the laws applicable in Dubai. Disputes shall first be addressed through good-faith negotiations within 21 days of written notice. Unresolved disputes shall be referred to arbitration under DIAC Rules in Dubai. DMC may seek urgent injunctive relief from any competent court.', '12. القانون الحاكم وحل النزاعات', 'تخضع هذه الاتفاقية للقوانين الاتحادية لدولة الإمارات العربية المتحدة والقوانين السارية في إمارة دبي. تعالج النزاعات أولًا عبر مفاوضات حسن النية خلال 21 يومًا من الإشعار الكتابي، ثم تحال النزاعات غير المحسومة إلى التحكيم وفق قواعد مركز دبي للتحكيم الدولي في دبي. تحتفظ DMC بحق طلب الأوامر الوقتية من أي محكمة مختصة.'],
  ['13. GENERAL PROVISIONS', '13.1 This Agreement supersedes all prior representations, negotiations and commitments. 13.2 Amendments require a written instrument signed by both parties. 13.3 If any provision is invalid, the remaining provisions continue. 13.4 This Agreement is executed in English and Arabic; in case of inconsistency, the Arabic text prevails before UAE courts and authorities. 13.5 By signing, the Client confirms they have read, understood and agree to all terms.', '13. أحكام عامة', '13.1 تحل هذه الاتفاقية محل جميع التصريحات والمفاوضات والتعهدات السابقة. 13.2 تتطلب التعديلات وثيقة مكتوبة موقعة من الطرفين. 13.3 إذا بطل أي حكم تبقى الأحكام الأخرى سارية. 13.4 حررت الاتفاقية باللغتين الإنجليزية والعربية، وعند التعارض يسود النص العربي أمام محاكم وجهات الإمارات. 13.5 يقر العميل بتوقيعه أنه قرأ وفهم ووافق على جميع الشروط والأحكام.'],
];

const DEFAULT_COMPANY_NAME = 'DM Immigration Consultants DMCC – Dubai Branch';
const DEFAULT_ADDRESS = 'Office 3703B, Latifa Tower, Sheikh Zayed Road, Trade Centre First, P.O. Box 29514, Dubai, UAE';

const DMC_LICENSE_EN = [
  'Professional Licence No. 766222 — Dubai Department of Economy and Tourism (DET)',
  'Branch of DM Immigration Consultants DMCC — Free Zone Company, Licence No. DMCC-788993, DMCC Authority, Dubai',
];
const DMC_LICENSE_AR = [
  'رخصة مهنية رقم 766222 — دائرة الاقتصاد والسياحة في دبي',
  'فرع شركة دي إم أيميغرايشون كونسالتنتس م.د.م.س — شركة منطقة حرة، رخصة رقم DMCC-788993، دبي',
];

const isDmcCompany = (name: string) => /dm immigration consultants|dmcc/i.test(name);
const isCmgCompany = (name: string) => /commonwealth|\bcmg\b/i.test(name);

const textOrBlank = (value: unknown, fallback = '________________') => {
  const result = String(value ?? '').trim();
  return result || fallback;
};

const box = (
  englishTitle: string,
  english: string,
  arabicTitle: string,
  arabic: string,
  className = '',
) => `<section class="agreement-box ${className}">
  <div class="language english" lang="en">
    ${englishTitle ? `<h2>${esc(englishTitle)}</h2>` : ''}
    <p>${esc(english)}</p>
  </div>
  <div class="language arabic" dir="rtl" lang="ar">
    ${arabicTitle ? `<h2>${esc(arabicTitle)}</h2>` : ''}
    <p>${esc(arabic)}</p>
  </div>
</section>`;

const feeTitle = () => `<section class="agreement-box fee-title" aria-label="Fee summary">
  <div class="language english"><h2>FEE SUMMARY</h2></div>
  <div class="language arabic" dir="rtl" lang="ar"><h2>ملخص الرسوم</h2></div>
</section>`;

const bilingualHeader = (companyName: string, address: string, licenseEn: string[], licenseAr: string[]) => `<header class="agreement-header">
  <div class="header-column header-english">
    <div class="company-name">${esc(companyName.toUpperCase())}</div>
    ${licenseEn.map((line) => `<div>${esc(line)}</div>`).join('')}
    <div>Address: ${esc(address)}</div>
    <div class="contact-line">Email: ____________________ &nbsp;|&nbsp; Website: ____________________</div>
    <div class="agreement-name">CLIENT SERVICE AGREEMENT — UNIFIED TERMS (ALL SERVICE PROGRAMS)</div>
  </div>
  <div class="header-column header-arabic" dir="rtl" lang="ar">
    <div class="company-name">${esc(companyName)}</div>
    ${licenseAr.map((line) => `<div>${esc(line)}</div>`).join('')}
    <div>العنوان: ${esc(address)}</div>
    <div class="contact-line">البريد الإلكتروني: ____________________ &nbsp;|&nbsp; الموقع الإلكتروني: ____________________</div>
    <div class="agreement-name">اتفاقية خدمات العميل — شروط موحدة لجميع برامج الخدمة</div>
  </div>
</header>`;

const getAgreementDetails = (v: AgreementValues) => {
  const companyName = textOrBlank(v.branchName, DEFAULT_COMPANY_NAME);
  const isDmc = isDmcCompany(companyName);
  const licenseLinesEn = isDmc ? DMC_LICENSE_EN : [];
  const licenseLinesAr = isDmc ? DMC_LICENSE_AR : [];
  const entityEn = isDmc
    ? `${companyName}, holding Professional Licence No. 766222 issued by the Dubai Department of Economy and Tourism, being a branch of DM Immigration Consultants DMCC, a free zone company licensed by the DMCC Authority under Licence No. DMCC-788993 ("DMC / the Company")`
    : `${companyName} ("DMC / the Company")`;
  const entityAr = isDmc
    ? `${companyName}، الحاصل على رخصة مهنية رقم 766222 صادرة عن دائرة الاقتصاد والسياحة في دبي، وهو فرع شركة دي إم أيميغرايشون كونسالتنتس م.د.م.س، وهي شركة منطقة حرة مرخصة من سلطة مركز دبي للسلع المتعددة بموجب الرخصة رقم DMCC-788993 ("DMC / الشركة")`
    : `${companyName} ("DMC / الشركة")`;

  return {
    agreementNumber: textOrBlank(v.agreementNumber),
    agreementDate: textOrBlank(v.agreementDate),
    serviceProgram: textOrBlank(v.serviceProgram),
    destinationCountry: textOrBlank(v.destinationCountry),
    clientName: textOrBlank(v.clientName),
    clientEmail: textOrBlank(v.clientEmail),
    clientPhone: textOrBlank(v.clientPhone),
    clientAddress: textOrBlank(v.clientAddress),
    nationality: textOrBlank(v.nationality),
    passportNumber: textOrBlank(v.passportNumber),
    totalAmount: textOrBlank(v.totalAmount),
    initialPayment: textOrBlank(v.initialPayment),
    secondPayment: textOrBlank(v.secondPayment),
    emiratesId: textOrBlank(v.emiratesId),
    occupation: textOrBlank(v.occupation),
    companyName,
    branchAddress: textOrBlank(v.branchAddress, DEFAULT_ADDRESS),
    licenseLinesEn,
    licenseLinesAr,
    entityEn,
    entityAr,
    isCmg: isCmgCompany(companyName),
  };
};

const renderAgreement = (v: AgreementValues) => {
  const d = getAgreementDetails(v);
  const clauseHtml = getClauses(d.companyName).map(([englishTitle, english, arabicTitle, arabic]) =>
    box(englishTitle, english, arabicTitle, arabic, 'clause'),
  ).join('');
  const theme = d.isCmg
    ? { headingEn: '#0B3F9F', accentEn: '#0B3F9F', headingAr: '#DF2B22', accentAr: '#DF2B22', gradEnFrom: '#0B3F9F', gradEnTo: '#14213D', gradArFrom: '#DF2B22', gradArTo: '#a3221b' }
    : { headingEn: '#166534', accentEn: '#166534', headingAr: '#92400e', accentAr: '#b45309', gradEnFrom: '#166534', gradEnTo: '#15803d', gradArFrom: '#92400e', gradArTo: '#b45309' };

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Client Service Agreement ${esc(d.agreementNumber)}</title>
  <style>
    @page {
      size: A4;
      margin: 9mm 6mm 13mm;
    }

    :root {
      --ink: #1a1a2e;
      --border: #c9cdd4;
      --english-bg: #f0f4ff;
      --arabic-bg: #fdf8f0;
      --heading-en: ${theme.headingEn};
      --heading-ar: ${theme.headingAr};
      --accent-en: ${theme.accentEn};
      --accent-ar: ${theme.accentAr};
      --grad-en-from: ${theme.gradEnFrom};
      --grad-en-to: ${theme.gradEnTo};
      --grad-ar-from: ${theme.gradArFrom};
      --grad-ar-to: ${theme.gradArTo};
      --important: #b91c1c;
      --page-width: 210mm;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: var(--ink);
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.35px;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .document {
      width: 100%;
      max-width: var(--page-width);
      margin: 0 auto;
      padding: 0;
    }

    /* ── header ── */
    .agreement-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1.5px solid var(--border);
      border-radius: 6px;
      overflow: hidden;
      margin: 0 0 10px;
      break-inside: avoid;
      page-break-inside: avoid;
      box-shadow: 0 1px 3px rgba(0,0,0,.06);
    }

    .header-column {
      min-width: 0;
      padding: 10px 12px;
    }

    .header-english {
      background: linear-gradient(180deg, #eef3ff 0%, #f5f7ff 100%);
      border-right: 1.5px solid var(--border);
      text-align: left;
    }

    .header-arabic {
      background: linear-gradient(180deg, #fef9ee 0%, #fffcf5 100%);
      text-align: right;
      font-family: Tahoma, Arial, sans-serif;
      font-size: 10.7px;
      line-height: 1.5;
    }

    .header-column > div {
      margin: 0 0 3px;
    }

    .company-name,
    .agreement-name {
      font-weight: 700;
    }

    .company-name {
      font-size: 12px;
      letter-spacing: .15px;
      margin-bottom: 5px !important;
    }

    .header-english .company-name { color: var(--accent-en); }
    .header-arabic .company-name { color: var(--accent-ar); }

    .agreement-name {
      font-size: 11.5px;
      margin-top: 7px !important;
      line-height: 1.2;
      color: var(--heading-en);
    }

    .header-arabic .agreement-name { color: var(--heading-ar); }

    .contact-line {
      margin-top: 5px !important;
      white-space: nowrap;
    }

    /* ── boxes ── */
    .agreement-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1.5px solid var(--border);
      border-radius: 6px;
      overflow: hidden;
      margin: 0 0 8px;
      break-inside: avoid;
      page-break-inside: avoid;
      box-shadow: 0 1px 3px rgba(0,0,0,.05);
    }

    .language {
      min-width: 0;
      padding: 9px 11px;
    }

    .english {
      background: linear-gradient(180deg, #eef3ff 0%, #f8faff 100%);
      border-right: 1.5px solid var(--border);
      text-align: left;
    }

    .arabic {
      background: linear-gradient(180deg, #fef9ee 0%, #fffcf5 100%);
      text-align: right;
      font-family: Tahoma, Arial, sans-serif;
      font-size: 10.7px;
      line-height: 1.5;
    }

    .language h2 {
      margin: 0 0 6px;
      font-size: 10px;
      line-height: 1.15;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .6px;
      padding: 4px 8px;
      border-radius: 3px;
      display: inline-block;
    }

    .english h2 {
      color: #fff;
      background: linear-gradient(135deg, var(--grad-en-from), var(--grad-en-to));
    }

    .arabic h2 {
      text-transform: none;
      letter-spacing: 0;
      color: #fff;
      background: linear-gradient(135deg, var(--grad-ar-from), var(--grad-ar-to));
    }

    .language p {
      margin: 0;
      white-space: pre-line;
    }

    .fee-title .language {
      padding: 7px 11px;
    }

    .fee-title .language h2 {
      margin: 0;
    }

    .fee-content {
      margin-bottom: 12px;
    }

    .fee-content .english p,
    .fee-content .arabic p {
      font-size: 10.9px;
      line-height: 1.4;
    }

    .fee-content .important {
      color: var(--important);
      font-weight: 700;
    }

    .manual-page-break {
      break-after: page;
      page-break-after: always;
      height: 0;
      margin: 0;
    }

    .clause {
      margin-bottom: 8px;
    }

    .annexure-title-pair {
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin-top: 12px;
      border: 1.5px solid var(--border);
      border-radius: 6px 6px 0 0;
      overflow: hidden;
    }

    .annexure-title {
      padding: 8px 11px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .4px;
      color: #fff;
    }

    .annexure-title-pair > div:first-child {
      background: linear-gradient(135deg, var(--grad-en-from), var(--grad-en-to));
      border-right: 1.5px solid var(--border);
    }

    .annexure-title-pair > div:last-child {
      background: linear-gradient(135deg, var(--grad-ar-from), var(--grad-ar-to));
      text-align: right;
      font-family: Tahoma, Arial, sans-serif;
      text-transform: none;
      letter-spacing: 0;
    }

    .signature .language {
      min-height: 130px;
    }

    .signature p {
      line-height: 1.7;
    }

    .print-footer {
      position: fixed;
      left: 6mm;
      right: 6mm;
      bottom: 4mm;
      display: flex;
      justify-content: center;
      color: #444;
      font-size: 8.4px;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
    }

    .page-number::after {
      content: counter(page);
    }

    @media screen {
      body {
        background: #eef0f3;
        padding: 14px 0;
      }

      .document {
        background: #fff;
        min-height: 297mm;
        padding: 9mm 6mm 13mm;
        box-shadow: 0 2px 12px rgba(0, 0, 0, .1);
      }

      .print-footer {
        position: static;
        margin-top: 11px;
      }
    }

    @media print {
      .document { padding: 0; }
      .print-footer { position: fixed; }
    }

    @media (max-width: 700px) {
      html, body { font-size: 11px; }
      .document { width: 100%; }
      .agreement-header,
      .agreement-box,
      .annexure-title-pair {
        grid-template-columns: 1fr;
      }
      .header-english,
      .english,
      .annexure-title-pair > div:first-child {
        border-right: 0;
        border-bottom: 1.5px solid var(--border);
      }
      .contact-line { white-space: normal; }
      .manual-page-break { display: none; }
      .print-footer { white-space: normal; }
    }
  </style>
</head>
<body>
  <main class="document">
    ${bilingualHeader(d.companyName, d.branchAddress, d.licenseLinesEn, d.licenseLinesAr)}

    ${box(
      'AGREEMENT DETAILS',
      `Agreement No.: ${d.agreementNumber}
Date: ${d.agreementDate}
Service Program: ${d.serviceProgram}
Destination Country: ${d.destinationCountry}
These unified terms apply to every service program offered by the Company. The specific service and destination are defined only in Annexure A.`,
      'تفاصيل الاتفاقية',
      `رقم الاتفاقية: ${d.agreementNumber}
التاريخ: ${d.agreementDate}
برنامج الخدمة: ${d.serviceProgram}
دولة المقصد: ${d.destinationCountry}
تسري هذه الشروط الموحدة على جميع برامج الخدمة التي تقدمها الشركة، وتحدد الخدمة المعينة ودولة المقصد في الملحق أ فقط.`,
    )}

    ${box(
      'SERVICE PROVIDER',
      `${d.companyName} ("DMC / the Company")
${d.licenseLinesEn.length ? d.licenseLinesEn.join('\n') + '\n' : ''}Address: ${d.branchAddress}

CLIENT DETAILS
Full Name: ${d.clientName}
Nationality: ${d.nationality}
Passport No.: ${d.passportNumber}
Emirates ID No.: ${d.emiratesId}
Phone: ${d.clientPhone}
Email: ${d.clientEmail}
Occupation: ${d.occupation}`,
      'مقدم الخدمة',
      `${d.companyName} ("DMC / الشركة")
${d.licenseLinesAr.length ? d.licenseLinesAr.join('\n') + '\n' : ''}العنوان: ${d.branchAddress}

بيانات العميل
الاسم الكامل: ${d.clientName}
الجنسية: ${d.nationality}
رقم جواز السفر: ${d.passportNumber}
رقم الهوية الإماراتية: ${d.emiratesId}
رقم الهاتف: ${d.clientPhone}
البريد الإلكتروني: ${d.clientEmail}
المهنة: ${d.occupation}`,
      'service-client',
    )}

    ${feeTitle()}
    <div class="manual-page-break"></div>

    <section class="agreement-box fee-content">
      <div class="language english">
        <p>Total Retainer Fee (AED): ${esc(d.totalAmount)}
Initial Payment (AED): ${esc(d.initialPayment)}
Second Payment (AED): ${esc(d.secondPayment)}
Government / Authority Fees: NOT INCLUDED — paid directly by Client
VAT: Applicable per UAE VAT Law (Federal Decree-Law No. 8 of 2017, as amended)</p>
        <p class="important">IMPORTANT: All retainer fees are strictly non-refundable except as stated in Clause 6.</p>
      </div>
      <div class="language arabic" dir="rtl" lang="ar">
        <p>إجمالي رسوم التعاقد (درهم): ${esc(d.totalAmount)}
الدفعة الأولى (درهم): ${esc(d.initialPayment)}
الدفعة الثانية (درهم): ${esc(d.secondPayment)}
رسوم الحكومة / الجهات المختصة: غير مشمولة — يدفعها العميل مباشرة
ضريبة القيمة المضافة: مطبقة وفق قانون ضريبة القيمة المضافة الإماراتي (المرسوم بقانون اتحادي رقم 8 لسنة 2017 وتعديلاته)</p>
        <p class="important">هام: جميع رسوم التعاقد غير قابلة للاسترداد إلا وفق ما هو منصوص عليه في البند 6.</p>
      </div>
    </section>

    ${box(
      'PREAMBLE',
      `This Client Service Agreement ("Agreement") is entered into between ${d.entityEn}, and the Client identified above.

WHEREAS DMC provides immigration, global mobility, education and related documentation and management consultancy services covering multiple destination countries and programs, for individuals in the UAE and the region.

WHEREAS these terms are unified and apply regardless of the service program or destination country selected; the specific scope is defined exclusively in Annexure A.

WHEREAS the Client has been provided a full opportunity to read, review, and seek independent legal advice in relation to this Agreement prior to execution.

NOW THEREFORE, in consideration of the mutual covenants herein, the parties agree as follows:`,
      'تمهيد',
      `أبرمت اتفاقية خدمات العميل هذه ("الاتفاقية") بين ${d.entityAr}، والعميل المحدد أعلاه.

تقدم DMC خدمات الهجرة والتنقل العالمي والتعليم وخدمات المستندات والاستشارات الإدارية ذات الصلة للأفراد في الإمارات والمنطقة.

تسري هذه الشروط الموحدة بغض النظر عن برنامج الخدمة أو دولة المقصد المختارة، ويحدد النطاق المعين حصريًا في الملحق أ.

أتيحت للعميل فرصة كاملة لقراءة الاتفاقية ومراجعتها والحصول على مشورة قانونية مستقلة بشأنها قبل التوقيع عليها.

بناءً على ذلك، يتفق الطرفان على ما يلي:`,
    )}

    ${clauseHtml}

    <div class="annexure-title-pair">
      <div class="annexure-title">ANNEXURE A — SCOPE OF SERVICES AND FEE SCHEDULE</div>
      <div class="annexure-title" dir="rtl" lang="ar">الملحق أ — نطاق الخدمات وجدول الرسوم</div>
    </div>

    ${box(
      'SERVICES TO BE PROVIDED',
      `Service Program / Description: ${d.serviceProgram}
Destination Country: ${d.destinationCountry}
Visa Category / Program Stream: ________________________________
Scope Includes: Consultancy and documentation assistance for the stated program
Scope Excludes: Legal representation and services not listed above

FEE SCHEDULE
Total Retainer Fee (AED): ${d.totalAmount}
Initial Payment: ${d.initialPayment} — Due: upon signing
Second Payment: ${d.secondPayment} — Due: ____________________
Government Fees: NOT INCLUDED — paid directly by Client
VAT: Applicable per UAE VAT Law`,
      'الخدمات التي سيتم تقديمها',
      `برنامج / وصف الخدمة: ${d.serviceProgram}
دولة المقصد: ${d.destinationCountry}
فئة التأشيرة / مسار البرنامج: ________________________________
يشمل النطاق: الاستشارات والمساعدة في المستندات للبرنامج المحدد
يستثني النطاق: التمثيل القانوني والخدمات غير المذكورة أعلاه

جدول الرسوم
إجمالي رسوم التعاقد (درهم): ${d.totalAmount}
الدفعة الأولى: ${d.initialPayment} — تستحق عند التوقيع
الدفعة الثانية: ${d.secondPayment} — تستحق في: ____________________
رسوم الحكومة: غير مشمولة — يدفعها العميل مباشرة
ضريبة القيمة المضافة: مطبقة وفق قانون الإمارات`,
    )}

    ${box(
      'EXECUTION',
      `Each party confirms they have read, understood, and agree to be bound by this Agreement.

FOR AND ON BEHALF OF ${d.companyName.toUpperCase()}:
Authorised Signatory: ________________________________
Name: ____________________________________________
Date: _____________________________________________

CLIENT:
Signature: _________________________________________
Name: ${d.clientName}
Date: _____________________________________________`,
      'التوقيع والإبرام',
      `يقر كل طرف بأنه قرأ وفهم هذه الاتفاقية ويوافق على الالتزام بها.

نيابةً عن ${d.companyName}:
التوقيع المفوض: ________________________________
الاسم: ________________________________________
التاريخ: _______________________________________

العميل:
التوقيع: _______________________________________
الاسم: ${d.clientName}
التاريخ: _______________________________________`,
      'signature',
    )}

    <footer class="print-footer">
      ${d.companyName}${d.licenseLinesEn.length ? ' — DET Licence 766222 / Parent: DMCC-788993' : ''} — ${d.branchAddress} — Page <span class="page-number"></span>
    </footer>
  </main>
</body>
</html>`;
};

export const renderBilingualAgreement = (v: AgreementValues) => renderAgreement(v);

// Kept as an alias for existing callers. The renderer now creates the PDF-style first page
// itself, so no extra / duplicate first page is injected.
export const renderBilingualAgreementWithPdfFirstPage = (v: AgreementValues) => renderAgreement(v);
