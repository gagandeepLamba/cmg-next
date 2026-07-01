'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { FileText, Download, Printer, Edit2, Eye, Search, CheckCircle, Loader2, AlertCircle, X } from 'lucide-react';

interface AgreementData {
  agreementNo: string;
  date: string;
  serviceProgram: string;
  destinationCountry: string;
  clientFullName: string;
  nationality: string;
  passportNo: string;
  emiratesId: string;
  phone: string;
  email: string;
  occupation: string;
  totalRetainerFee: string;
  initialPayment: string;
  secondPayment: string;
  secondPaymentDue: string;
  // Annexure A
  annexServiceProgram: string;
  annexDestinationCountry: string;
  annexVisaCategory: string;
  annexScopeIncludes: string;
  annexTotalFee: string;
  annexInitialPayment: string;
  annexSecondPayment: string;
  annexSecondPaymentDue: string;
}

const empty: AgreementData = {
  agreementNo: '', date: '', serviceProgram: '', destinationCountry: '',
  clientFullName: '', nationality: '', passportNo: '', emiratesId: '',
  phone: '', email: '', occupation: '',
  totalRetainerFee: '', initialPayment: '', secondPayment: '', secondPaymentDue: '',
  annexServiceProgram: '', annexDestinationCountry: '', annexVisaCategory: '',
  annexScopeIncludes: '', annexTotalFee: '', annexInitialPayment: '',
  annexSecondPayment: '', annexSecondPaymentDue: '',
};

const blank = (v: string) => v || '________________';

function BiRow({ en, ar, header }: { en: React.ReactNode; ar: React.ReactNode; header?: boolean }) {
  const cls = header
    ? 'font-bold text-[#1a3a6b] bg-[#dce8f8] text-[10px]'
    : 'text-[9.5px] text-gray-800';
  return (
    <tr>
      <td className={`${cls} border border-gray-300 px-2 py-1 w-[50%] align-top`}>{en}</td>
      <td className={`${cls} border border-gray-300 px-2 py-1 w-[50%] align-top text-right`} dir="rtl">{ar}</td>
    </tr>
  );
}

function SectionHeader({ en, ar }: { en: string; ar: string }) {
  return <BiRow header en={en} ar={ar} />;
}

function AgreementPreview({ d }: { d: AgreementData }) {
  return (
    <div className="bg-white text-[9.5px] font-[Arial,sans-serif] leading-snug" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="text-[8px] text-gray-500 text-center border-b border-gray-300 pb-1 mb-1">
        DM Immigration Consultants DMCC – Dubai Branch — DET Licence 766222 / Parent: DMCC-788993 — Office 3703B, Latifa Tower, Sheikh Zayed Road, Dubai
      </div>

      {/* HEADER */}
      <table className="w-full border-collapse mb-1"><tbody>
        <tr>
          <td className="border border-gray-300 px-2 py-1.5 w-[50%] align-top">
            <div className="font-bold text-[10px] text-[#1a3a6b]">DM IMMIGRATION CONSULTANTS DMCC – DUBAI BRANCH</div>
            <div>Professional Licence No. 766222 — Dubai Department of Economy and Tourism (DET)</div>
            <div>Branch of DM Immigration Consultants DMCC — Free Zone Company, Licence No. DMCC-788993, DMCC Authority, Dubai</div>
            <div>Address: Office 3703B, Latifa Tower, Sheikh Zayed Road, Trade Centre First, P.O. Box 29514, Dubai, UAE</div>
            <div>Email: ________________ | Website: ________________</div>
            <div className="font-bold mt-1">CLIENT SERVICE AGREEMENT — UNIFIED TERMS (ALL SERVICE PROGRAMS)</div>
          </td>
          <td className="border border-gray-300 px-2 py-1.5 w-[50%] align-top text-right" dir="rtl">
            <div className="font-bold text-[10px] text-[#1a3a6b]">دي إم أيميغرايشون كونسالتنتس م.د.م.س – فرع دبي</div>
            <div>رخصة مهنية رقم 766222 — دائرة الاقتصاد والسياحة في دبي</div>
            <div>فرع شركة دي إم أيميغرايشون كونسالتنتس م.د.م.س شركة منطقة حرة، رخصة رقم DMCC-788993، سلطة مركز دبي للسلع المتعددة، دبي</div>
            <div>العنوان: مكتب B،3703 برج لطيفة، شارع الشيخ زايد، المركز التجاري الأول، ص.ب 29514، دبي، الإمارات</div>
            <div>البريد الإلكتروني: ________________ | الموقع الإلكتروني: ________________</div>
            <div className="font-bold mt-1">اتفاقية خدمات العميل — شروط موحدة لجميع برامج الخدمة</div>
          </td>
        </tr>
      </tbody></table>

      {/* AGREEMENT DETAILS */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="AGREEMENT DETAILS" ar="تفاصيل الاتفاقية" />
        <BiRow
          en={<><div>Agreement No.: {blank(d.agreementNo)}</div><div>Date: {blank(d.date)}</div><div>Service Program: {blank(d.serviceProgram)}</div><div>Destination Country: {blank(d.destinationCountry)}</div><div className="mt-1">These unified terms apply to every service program offered by the Company. The specific service and destination are defined only in Annexure A.</div></>}
          ar={<><div>رقم الاتفاقية: {blank(d.agreementNo)}</div><div>التاريخ: {blank(d.date)}</div><div>برنامج الخدمة: {blank(d.serviceProgram)}</div><div>دولة المقصد: {blank(d.destinationCountry)}</div><div className="mt-1">تسري هذه الشروط الموحدة على جميع برامج الخدمة التي تقدمها الشركة. وتُحدد الخدمة المعينة ودولة المقصد في الملحق أ فقط.</div></>}
        />
      </tbody></table>

      {/* SERVICE PROVIDER + CLIENT DETAILS */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="SERVICE PROVIDER" ar="مقدم الخدمة" />
        <BiRow
          en={<><div className="font-bold">DM Immigration Consultants DMCC – Dubai Branch ("DMC / the Company")</div><div>Professional Licence No. 766222 — Dubai Department of Economy and Tourism (DET)</div><div>Branch of DM Immigration Consultants DMCC — Free Zone Company, Licence No. DMCC-788993, DMCC Authority, Dubai</div><div>Address: Office 3703B, Latifa Tower, Sheikh Zayed Road, Trade Centre First, P.O. Box 29514, Dubai, UAE</div></>}
          ar={<><div className="font-bold">دي إم أيميغرايشون كونسالتنتس م.د.م.س – فرع دبي ("DMC / الشركة")</div><div>رخصة مهنية رقم 766222 — دائرة الاقتصاد والسياحة في دبي</div><div>فرع شركة دي إم أيميغرايشون كونسالتنتس م.د.م.س شركة منطقة حرة، رخصة رقم DMCC-788993، سلطة مركز دبي للسلع المتعددة، دبي</div><div>العنوان: مكتب B،3703 برج لطيفة، شارع الشيخ زايد، المركز التجاري الأول، ص.ب 29514، دبي، الإمارات</div></>}
        />
        <SectionHeader en="CLIENT DETAILS" ar="بيانات العميل" />
        <BiRow
          en={<><div>Full Name: {blank(d.clientFullName)}</div><div>Nationality: {blank(d.nationality)}</div><div>Passport No.: {blank(d.passportNo)}</div><div>Emirates ID No.: {blank(d.emiratesId)}</div><div>Phone: {blank(d.phone)}</div><div>Email: {blank(d.email)}</div><div>Occupation: {blank(d.occupation)}</div></>}
          ar={<><div>الاسم الكامل: {blank(d.clientFullName)}</div><div>الجنسية: {blank(d.nationality)}</div><div>رقم جواز السفر: {blank(d.passportNo)}</div><div>رقم الهوية الإماراتية: {blank(d.emiratesId)}</div><div>رقم الهاتف: {blank(d.phone)}</div><div>البريد الإلكتروني: {blank(d.email)}</div><div>المهنة: {blank(d.occupation)}</div></>}
        />
      </tbody></table>

      {/* FEE SUMMARY */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="FEE SUMMARY" ar="ملخص الرسوم" />
        <BiRow
          en={<><div>Total Retainer Fee (AED): {blank(d.totalRetainerFee)}</div><div>Initial Payment (AED): {blank(d.initialPayment)}</div><div>Second Payment (AED): {blank(d.secondPayment)}</div><div>Government / Authority Fees: NOT INCLUDED — paid directly by Client</div><div>VAT: Applicable per UAE VAT Law (Federal Decree-Law No. 8 of 2017, as amended)</div><div className="font-bold text-red-700 mt-1">IMPORTANT: All retainer fees are strictly non-refundable except as stated in Clause 6.</div></>}
          ar={<><div>إجمالي رسوم التعاقد (درهم): {blank(d.totalRetainerFee)}</div><div>الدفعة الأولى (درهم): {blank(d.initialPayment)}</div><div>الدفعة الثانية (درهم): {blank(d.secondPayment)}</div><div>رسوم الحكومة / الجهات المختصة: غير مشمولة — يدفعها العميل مباشرةً</div><div>ضريبة القيمة المضافة: مطبقة وفق قانون ضريبة القيمة المضافة الإماراتي (المرسوم بقانون اتحادي رقم 8 لسنة 2017 وتعديلاته)</div><div className="font-bold text-red-700 mt-1">هام: جميع رسوم التعاقد غير قابلة للاسترداد إلا وفق ما هو منصوص عليه في البند 6.</div></>}
        />
      </tbody></table>

      {/* PREAMBLE */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="PREAMBLE" ar="تمهيد" />
        <BiRow
          en={<><p>This Client Service Agreement ("Agreement") is entered into between DM Immigration Consultants DMCC – Dubai Branch, holding Professional Licence No. 766222 issued by the Dubai Department of Economy and Tourism, being a branch of DM Immigration Consultants DMCC, a free zone company licensed by the DMCC Authority under Licence No. DMCC-788993 ("DMC / the Company"), and the Client identified above.</p><p className="mt-1">WHEREAS DMC provides immigration, global mobility, education and related documentation and management consultancy services covering multiple destination countries and programs, for individuals in the UAE and the region.</p><p className="mt-1">WHEREAS these terms are unified and apply regardless of the service program or destination country selected; the specific scope is defined exclusively in Annexure A.</p><p className="mt-1">WHEREAS the Client has been provided a full opportunity to read, review, and seek independent legal advice in relation to this Agreement prior to execution.</p><p className="mt-1 font-bold">NOW THEREFORE, in consideration of the mutual covenants herein, the parties agree as follows:</p></>}
          ar={<><p>تُبرم اتفاقية خدمات العميل هذه ("الاتفاقية") بين دي إم أيميغرايشون كونسالتنتس م.د.م.س – فرع دبي، الحاصل على رخصة مهنية رقم 766222 صادرة عن دائرة الاقتصاد والسياحة في دبي، وهو فرع شركة دي إم أيميغرايشون كونسالتنتس م.د.م.س، وهي شركة منطقة حرة مرخصة من سلطة مركز دبي للسلع المتعددة بموجب الرخصة رقم DMCC-788993 ("DMC / الشركة")، والعميل المحدد أعلاه.</p><p className="mt-1">حيث تقدم DMC خدمات الهجرة والتنقل العالمي والتعليم وخدمات المستندات والاستشارات الإدارية ذات الصلة، وتغطي دولاً وبرامج مقصد متعددة، للأفراد في الإمارات والمنطقة.</p><p className="mt-1">وحيث إن هذه الشروط موحدة وتسري بغض النظر عن برنامج الخدمة أو دولة المقصد المختارة؛ ويُحدد النطاق المعين حصرياً في الملحق أ.</p><p className="mt-1">وحيث أُتيحت للعميل فرصة كاملة لقراءة هذه الاتفاقية ومراجعتها والحصول على مشورة قانونية مستقلة بشأنها قبل التوقيع عليها.</p><p className="mt-1 font-bold">بناءً على ذلك، يتفق الطرفان على ما يلي:</p></>}
        />
      </tbody></table>

      {/* CLAUSE 1 */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="1. DEFINITIONS AND INTERPRETATION" ar="1. التعريفات والتفسير" />
        <BiRow
          en={<><p>1.1 "DMC" means DM Immigration Consultants DMCC – Dubai Branch, its officers, employees, agents, and authorised representatives.</p><p className="mt-0.5">1.2 "Client" means the individual named in this Agreement who has engaged DMC for consultancy services.</p><p className="mt-0.5">1.3 "Services" means only the consultancy services specified in Annexure A.</p><p className="mt-0.5">1.4 "Retainer Fee" means the professional fees payable to DMC as detailed in Annexure A.</p><p className="mt-0.5">1.5 "Government / Authority Fees" means all fees payable to any government department, immigration authority, embassy, consulate, skills assessment body, university, or other competent authority of any destination country. These are excluded from the Retainer Fee and are the Client's sole responsibility.</p><p className="mt-0.5">1.6 "Authorities" means any government body, immigration department, embassy, consulate, or assessment organisation of any destination country relevant to the Services.</p></>}
          ar={<><p>1.1 "DMC" تعني دي إم أيميغرايشون كونسالتنتس م.د.م.س – فرع دبي، ومسؤوليها وموظفيها ووكلائها وممثليها المعتمدين.</p><p className="mt-0.5">1.2 "العميل" يعني الشخص المحدد في هذه الاتفاقية الذي استعان بـ DMC للخدمات الاستشارية.</p><p className="mt-0.5">1.3 "الخدمات" تعني فقط الخدمات الاستشارية المحددة في الملحق أ.</p><p className="mt-0.5">1.4 "رسوم التعاقد" تعني الأتعاب المهنية المستحقة لـ DMC كما هو مفصل في الملحق أ.</p><p className="mt-0.5">1.5 "رسوم الحكومة / الجهات المختصة" تعني جميع الرسوم المستحقة لأي جهة حكومية أو سلطة هجرة أو سفارة أو قنصلية أو هيئة تقييم مهارات أو جامعة أو أي جهة مختصة أخرى في أي دولة مقصد. وهي مستثناة من رسوم التعاقد وتقع على عاتق العميل وحده.</p><p className="mt-0.5">1.6 "الجهات المختصة" تعني أي جهة حكومية أو إدارة هجرة أو سفارة أو قنصلية أو منظمة تقييم في أي دولة مقصد ذات صلة بالخدمات.</p></>}
        />
      </tbody></table>

      {/* CLAUSE 2 */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="2. SCOPE OF SERVICES" ar="2. نطاق الخدمات" />
        <BiRow
          en={<><p>2.1 DMC agrees to provide only the Services specified in Annexure A. Services are strictly limited to consultancy and documentation assistance and do not include legal representation or legal advice.</p><p className="mt-0.5">2.2 Any services beyond the scope of Annexure A require a separate written agreement and additional fees.</p><p className="mt-0.5">2.3 DMC may engage third-party agents, assessors, or registered migration practitioners to fulfil part of the Services. The Client consents to sharing their information with such third parties.</p></>}
          ar={<><p>2.1 توافق DMC على تقديم الخدمات المحددة في الملحق أ فحسب. وتقتصر الخدمات على الاستشارات والمساعدة في المستندات ولا تشمل التمثيل القانوني أو الاستشارة القانونية.</p><p className="mt-0.5">2.2 أي خدمات تتجاوز نطاق الملحق أ تستلزم اتفاقية مكتوبة منفصلة ورسوماً إضافية.</p><p className="mt-0.5">2.3 يجوز لـ DMC الاستعانة بوكلاء أو مقيّمين أو ممارسي هجرة مسجلين من أطراف ثالثة لتنفيذ جزء من الخدمات. ويوافق العميل على مشاركة معلوماته مع هذه الأطراف.</p></>}
        />
      </tbody></table>

      {/* CLAUSE 3 */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="3. NO GUARANTEE OF OUTCOME" ar="3. عدم ضمان النتائج" />
        <BiRow
          en={<><p className="font-bold">3.1 DMC DOES NOT GUARANTEE, REPRESENT, OR WARRANT THE SUCCESS, APPROVAL, OR POSITIVE OUTCOME OF ANY VISA APPLICATION, SKILLS ASSESSMENT, ADMISSION, OR IMMIGRATION PROCESS, FOR ANY DESTINATION COUNTRY.</p><p className="mt-0.5">3.2 All decisions are made solely by the relevant Authorities. DMC has no influence over Authority decisions and accepts no liability for them.</p><p className="mt-0.5">3.3 DMC is not liable for any changes in immigration laws, policies, occupation lists, invitation scores, quotas, or processing times of any destination country.</p><p className="mt-0.5">3.4 An unsuccessful outcome does not entitle the Client to any refund except as stated in Clause 6.</p><p className="mt-0.5">3.5 No verbal or written representation made by any DMC employee outside this Agreement constitutes a guarantee of outcome. The Client agrees not to rely on any such representation.</p></>}
          ar={<><p>3.1 لا تضمن DMC ولا تُقرّ ولا تكفل نجاح أي طلب تأشيرة أو تقييم مهارات أو قبول دراسي أو أي إجراء هجرة، لأي دولة مقصد، أو الموافقة عليه أو الحصول على نتيجة إيجابية بشأنه.</p><p className="mt-0.5">3.2 تصدر جميع القرارات من الجهات المختصة وحدها. ولا تملك DMC أي تأثير على هذه القرارات ولا تتحمل أي مسؤولية عنها.</p><p className="mt-0.5">3.3 لا تتحمل DMC أي مسؤولية عن أي تغييرات في قوانين الهجرة أو السياسات أو قوائم المهن أو درجات الدعوات أو الحصص أو أوقات المعالجة في أي دولة مقصد.</p><p className="mt-0.5">3.4 لا يُخوّل الحصول على نتيجة غير مواتية العميلَ أي استرداد للرسوم إلا وفق ما هو منصوص عليه في البند 6.</p><p className="mt-0.5">3.5 لا يُشكّل أي تصريح شفهي أو كتابي يصدر من أي موظف في DMC خارج نطاق هذه الاتفاقية ضماناً لأي نتيجة. ويوافق العميل على عدم الاعتماد على أي تصريح من هذا القبيل.</p></>}
        />
      </tbody></table>

      {/* CLAUSE 4 */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="4. CLIENT OBLIGATIONS AND REPRESENTATIONS" ar="4. التزامات العميل وتعهداته" />
        <BiRow
          en={<><p>4.1 The Client warrants that all information and documents provided to DMC are true, accurate, complete, and not misleading.</p><p className="mt-0.5">4.2 The Client shall promptly provide all documents and information requested. Any delay by the Client that adversely affects the application is the Client's sole responsibility.</p><p className="mt-0.5">4.3 The Client shall NOT contact any Authority directly without prior written approval from DMC during this Agreement.</p><p className="mt-0.5">4.4 The Client shall maintain respectful conduct with all DMC employees. Abusive or inappropriate conduct constitutes a material breach and may result in immediate termination without refund.</p><p className="mt-0.5">4.5 The Client shall not provide false, fraudulent, or forged documents. DMC has a duty to report fraudulent documents to the Authorities.</p><p className="mt-0.5">4.6 The Client shall not take actions — such as resigning from employment or making financial commitments — in anticipation of a visa grant or program outcome. DMC accepts no liability for such actions.</p></>}
          ar={<><p>4.1 يضمن العميل أن جميع المعلومات والمستندات المقدمة لـ DMC صحيحة ودقيقة وكاملة وغير مضللة.</p><p className="mt-0.5">4.2 يتعين على العميل تقديم جميع المستندات والمعلومات المطلوبة فور طلبها.</p><p className="mt-0.5">4.3 لا يجوز للعميل التواصل مع أي جهة مختصة مباشرةً دون الحصول على موافقة كتابية مسبقة من DMC.</p><p className="mt-0.5">4.4 يلتزم العميل بالتعامل باحترام مع جميع موظفي DMC.</p><p className="mt-0.5">4.5 لا يجوز للعميل تقديم مستندات مزورة أو احتيالية.</p><p className="mt-0.5">4.6 لا يجوز للعميل اتخاذ أي إجراءات تحسباً للحصول على تأشيرة أو نتيجة أي برنامج.</p></>}
        />
      </tbody></table>

      {/* CLAUSE 5 */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="5. FEES AND PAYMENT" ar="5. الرسوم والدفع" />
        <BiRow
          en={<><p>5.1 The Client agrees to pay the Retainer Fee in UAE Dirhams (AED) per the schedule in Annexure A, plus VAT where applicable.</p><p className="mt-0.5">5.2 All Government / Authority fees are entirely the Client's responsibility and are not covered by this Agreement.</p><p className="mt-0.5">5.3 Non-payment of any instalment may result in immediate suspension or termination of Services without notice or refund.</p><p className="mt-0.5">5.4 DMC may withhold submission of any application until all outstanding fees are paid.</p></>}
          ar={<><p>5.1 يوافق العميل على سداد رسوم التعاقد بالدرهم الإماراتي وفقاً للجدول الزمني المحدد في الملحق أ.</p><p className="mt-0.5">5.2 تقع جميع رسوم الحكومة والجهات المختصة على عاتق العميل وحده.</p><p className="mt-0.5">5.3 قد يؤدي عدم سداد أي قسط إلى تعليق الخدمات أو إنهائها فوراً.</p><p className="mt-0.5">5.4 يجوز لـ DMC تأجيل تقديم أي طلب إلى حين سداد جميع الرسوم المستحقة.</p></>}
        />
      </tbody></table>

      {/* CLAUSE 6 */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="6. REFUND POLICY" ar="6. سياسة الاسترداد" />
        <BiRow
          en={<><p className="font-bold">6.1 ALL FEES ARE STRICTLY NON-REFUNDABLE, except as expressly stated in this Clause.</p><p className="mt-0.5">6.2 Non-refundable: registration/administration fees; fees for work performed; instalment payments; fees where the application is refused; fees on termination due to Client breach; fees on Client voluntary termination; fees where Client provides false documents; fees on Client misconduct.</p><p className="mt-0.5">6.3 A partial refund may be considered, at DMC's sole discretion, only where DMC has been wholly unable to commence any services due to a reason solely attributable to DMC.</p><p className="mt-0.5">6.4 No refund applies in the event of Force Majeure or the death of any person.</p><p className="mt-0.5">6.5 The cooling-off period does not apply once any assessment or advice has been provided.</p></>}
          ar={<><p className="font-bold">6.1 جميع الرسوم غير قابلة للاسترداد بصرامة، إلا وفق ما هو منصوص عليه صراحةً في هذا البند.</p><p className="mt-0.5">6.2 غير قابلة للاسترداد في جميع الأحوال: رسوم التسجيل والإدارة؛ الرسوم المقابلة للأعمال المنجزة؛ دفعات الأقساط؛ الرسوم في حال رفض الطلب؛ الرسوم عند الإنهاء بسبب إخلال العميل؛ الرسوم عند الإنهاء الطوعي؛ الرسوم في حال تقديم مستندات مزورة؛ الرسوم في حال سوء السلوك.</p><p className="mt-0.5">6.3 يجوز النظر في استرداد جزئي، وفق تقدير DMC المطلق، فقط في حالة عجز DMC الكامل عن البدء في تقديم أي خدمات لأسباب تعود إليها وحدها.</p><p className="mt-0.5">6.4 لا ينطبق أي استرداد في حالات القوة القاهرة أو وفاة أي شخص.</p><p className="mt-0.5">6.5 لا تسري فترة التراجع فور تقديم أي تقييم أو مشورة.</p></>}
        />
      </tbody></table>

      {/* CLAUSE 7 */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="7. LIMITATION OF LIABILITY" ar="7. تحديد المسؤولية" />
        <BiRow
          en={<><p>7.1 TO THE MAXIMUM EXTENT PERMITTED BY LAW, DMC SHALL NOT BE LIABLE FOR: any Authority decision; changes in law or policy; inaccurate information provided by the Client; Client's delay in providing documents; Client's unauthorised contact with Authorities; Client's actions taken in anticipation of a visa or program outcome; Force Majeure Events; or reliance on representations outside this Agreement.</p><p className="mt-0.5">7.2 DMC's maximum aggregate liability shall not exceed the total Retainer Fee actually paid by the Client.</p></>}
          ar={<><p>7.1 إلى أقصى حد يسمح به القانون، لا تتحمل DMC أي مسؤولية عن: قرارات الجهات المختصة؛ التغييرات في القوانين أو السياسات؛ المعلومات غير الدقيقة التي يقدمها العميل؛ تأخر العميل في تقديم المستندات؛ الإجراءات التي يتخذها العميل تحسباً للحصول على تأشيرة؛ أحداث القوة القاهرة.</p><p className="mt-0.5">7.2 لا تتجاوز المسؤولية الإجمالية القصوى لـ DMC إجمالي رسوم التعاقد التي دفعها العميل فعلياً.</p></>}
        />
      </tbody></table>

      {/* CLAUSE 8–13 condensed */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="8. CONFIDENTIALITY" ar="8. السرية" />
        <BiRow en={<><p>8.1 Both parties agree to maintain the confidentiality of all information received under this Agreement.</p><p className="mt-0.5">8.2 The Client consents to DMC sharing their personal information with third parties as necessary to provide the Services.</p><p className="mt-0.5">8.3 The Client releases DMC from all liability arising from electronic communications interception or delivery failure, provided DMC uses reasonable security measures.</p></>} ar={<><p>8.1 يتفق الطرفان على الحفاظ على سرية جميع المعلومات المتلقاة بموجب هذه الاتفاقية.</p><p className="mt-0.5">8.2 يوافق العميل على قيام DMC بمشاركة معلوماته الشخصية مع أطراف ثالثة عند الاقتضاء لتقديم الخدمات.</p><p className="mt-0.5">8.3 يُعفي العميل DMC من أي مسؤولية ناجمة عن اعتراض الاتصالات الإلكترونية أو فشل التسليم.</p></>} />
      </tbody></table>

      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="9. TERM AND TERMINATION" ar="9. مدة الاتفاقية وإنهاؤها" />
        <BiRow en={<><p>9.1 This Agreement commences on the date of signing and remains in force until Services are completed or until terminated.</p><p className="mt-0.5">9.2 Either party may terminate with 15 days' written notice by email.</p><p className="mt-0.5">9.3 DMC may terminate immediately without notice for: non-payment; provision of false documents; material breach; Client misconduct; or engaging another agent without consent.</p><p className="mt-0.5">9.4 Upon termination: all DMC obligations cease; no refund is due except per Clause 6; the Client remains liable for outstanding fees. This Agreement expires automatically after 12 months unless extended in writing.</p></>} ar={<><p>9.1 تسري هذه الاتفاقية من تاريخ التوقيع وتظل سارية إلى حين إتمام الخدمات أو إنهائها.</p><p className="mt-0.5">9.2 يحق لأي من الطرفين إنهاء الاتفاقية بإشعار مكتوب مدته 15 يوماً عبر البريد الإلكتروني.</p><p className="mt-0.5">9.3 يحق لـ DMC إنهاء الاتفاقية فوراً دون إشعار في حالات عدم السداد، تقديم مستندات مزورة، الإخلال الجوهري، سوء السلوك، أو الاستعانة بوكيل آخر دون موافقة.</p><p className="mt-0.5">9.4 عند الإنهاء: تنتهي جميع التزامات DMC ولا يستحق أي استرداد إلا وفق البند 6. تنتهي الاتفاقية تلقائياً بعد 12 شهراً.</p></>} />
      </tbody></table>

      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="10. SOCIAL MEDIA AND DEFAMATION" ar="10. وسائل التواصل الاجتماعي والتشهير" />
        <BiRow en={<><p>10.1 The Client agrees not to publish any false, defamatory, or abusive content about DMC on any platform, prior to obtaining a court judgment in their favour.</p><p className="mt-0.5">10.2 DMC reserves the right to seek damages under applicable UAE laws including Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrimes.</p></>} ar={<><p>10.1 يوافق العميل على عدم نشر أي محتوى كاذب أو تشهيري أو مسيء بشأن DMC على أي منصة.</p><p className="mt-0.5">10.2 تحتفظ DMC بحقها في المطالبة بالتعويضات بموجب قوانين الإمارات بما في ذلك المرسوم بقانون اتحادي رقم 34 لسنة 2021.</p></>} />
      </tbody></table>

      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="11. FORCE MAJEURE" ar="11. القوة القاهرة" />
        <BiRow en={<><p>11.1 Neither party is liable for failure to perform obligations caused by events beyond their reasonable control, including acts of God, war, government restrictions, pandemics, or infrastructure failures.</p><p className="mt-0.5">11.2 If a Force Majeure Event continues for more than 90 days, either party may terminate. No refund applies.</p></>} ar={<><p>11.1 لا يتحمل أيٌّ من الطرفين مسؤولية الإخفاق في الوفاء بالتزاماته نتيجة أحداث خارجة عن إرادته المعقولة.</p><p className="mt-0.5">11.2 إذا استمر حدث القوة القاهرة لأكثر من 90 يوماً، يحق لأيٍّ من الطرفين إنهاء الاتفاقية. ولا يُطبَّق أي استرداد.</p></>} />
      </tbody></table>

      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="12. GOVERNING LAW AND DISPUTE RESOLUTION" ar="12. القانون الحاكم وحل النزاعات" />
        <BiRow en={<><p>12.1 This Agreement is governed by the federal laws of the UAE and the laws applicable in the Emirate of Dubai.</p><p className="mt-0.5">12.2 Disputes shall first be addressed through good-faith negotiations within 21 days of written notice.</p><p className="mt-0.5">12.3 Unresolved disputes shall be referred to arbitration under the Dubai International Arbitration Centre (DIAC) Rules. The arbitral award shall be final and binding.</p><p className="mt-0.5">12.4 DMC reserves the right to seek urgent injunctive relief from any competent court.</p></>} ar={<><p>12.1 تخضع هذه الاتفاقية للقوانين الاتحادية لدولة الإمارات العربية المتحدة والقوانين السارية في إمارة دبي.</p><p className="mt-0.5">12.2 تُعالَج النزاعات أولاً عبر مفاوضات حسن النية خلال 21 يوماً من الإشعار الكتابي.</p><p className="mt-0.5">12.3 تُحال النزاعات غير المحسومة إلى التحكيم وفق قواعد مركز دبي للتحكيم الدولي (DIAC). ويكون قرار التحكيم نهائياً وملزماً.</p><p className="mt-0.5">12.4 تحتفظ DMC بحقها في طلب الإنصاف القضائي العاجل من أي محكمة مختصة.</p></>} />
      </tbody></table>

      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="13. GENERAL PROVISIONS" ar="13. أحكام عامة" />
        <BiRow en={<><p>13.1 <b>Entire Agreement:</b> This Agreement supersedes all prior representations, negotiations, and commitments.</p><p className="mt-0.5">13.2 <b>Amendments:</b> Amendments require a written instrument signed by both parties.</p><p className="mt-0.5">13.3 <b>Severability:</b> If any provision is found invalid, the remaining provisions continue in force.</p><p className="mt-0.5">13.4 <b>Language:</b> This Agreement is executed in English and Arabic. In case of inconsistency, the Arabic text shall prevail before the UAE courts and authorities.</p><p className="mt-0.5">13.5 By signing this Agreement, the Client confirms they have read, understood, and agree to be bound by all terms and conditions.</p></>} ar={<><p>13.1 <b>الاتفاقية الكاملة:</b> تحل هذه الاتفاقية محل جميع التصريحات والمفاوضات والتعهدات السابقة.</p><p className="mt-0.5">13.2 <b>التعديلات:</b> تستلزم التعديلات وثيقة مكتوبة موقعة من كلا الطرفين.</p><p className="mt-0.5">13.3 <b>قابلية الانفصال:</b> إذا اعتُبر أي حكم غير صالح، يستمر سريان الأحكام المتبقية.</p><p className="mt-0.5">13.4 <b>اللغة:</b> في حال وجود تعارض، يسود النص العربي أمام المحاكم الإماراتية.</p><p className="mt-0.5">13.5 بالتوقيع على هذه الاتفاقية، يُقرّ العميل بأنه قرأ وفهم جميع الشروط والأحكام ويوافق على الالتزام بها.</p></>} />
      </tbody></table>

      {/* EXECUTION */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="EXECUTION" ar="التوقيع والإبرام" />
        <BiRow
          en={<><p>Each party confirms they have read, understood, and agree to be bound by this Agreement.</p><p className="mt-2 font-bold">FOR AND ON BEHALF OF DM IMMIGRATION CONSULTANTS DMCC – DUBAI BRANCH:</p><p className="mt-1">Authorised Signatory: ____________________</p><p>Name: ____________________</p><p>Date: ____________________</p><p className="mt-2 font-bold">CLIENT:</p><p className="mt-1">Signature: ____________________</p><p>Name: {blank(d.clientFullName)}</p><p>Date: ____________________</p></>}
          ar={<><p>يُقرّ كل طرف بأنه قرأ وفهم هذه الاتفاقية ويوافق على الالتزام بها.</p><p className="mt-2 font-bold">نيابةً عن دي إم أيميغرايشون كونسالتنتس م.د.م.س – فرع دبي:</p><p className="mt-1">التوقيع المفوض: ____________________</p><p>الاسم: ____________________</p><p>التاريخ: ____________________</p><p className="mt-2 font-bold">العميل:</p><p className="mt-1">التوقيع: ____________________</p><p>الاسم: {blank(d.clientFullName)}</p><p>التاريخ: ____________________</p></>}
        />
      </tbody></table>

      {/* ANNEXURE A */}
      <table className="w-full border-collapse mb-1"><tbody>
        <SectionHeader en="ANNEXURE A — SCOPE OF SERVICES AND FEE SCHEDULE" ar="الملحق أ — نطاق الخدمات وجدول الرسوم" />
        <BiRow en={<p>This Annexure forms part of the Client Service Agreement and defines the specific service program.</p>} ar={<p>يُعدّ هذا الملحق جزءاً لا يتجزأ من اتفاقية خدمات العميل ويحدد برنامج الخدمة المعين.</p>} />
        <SectionHeader en="Services to be Provided:" ar="الخدمات المقدمة:" />
        <BiRow
          en={<><p>Service Program / Description: {blank(d.annexServiceProgram)}</p><p>Destination Country: {blank(d.annexDestinationCountry)}</p><p>Visa Category / Program Stream: {blank(d.annexVisaCategory)}</p><p>Scope Includes: {blank(d.annexScopeIncludes)}</p><p>Scope Excludes: Legal representation, services not listed above</p></>}
          ar={<><p>برنامج / وصف الخدمة: {blank(d.annexServiceProgram)}</p><p>دولة المقصد: {blank(d.annexDestinationCountry)}</p><p>فئة التأشيرة / مسار البرنامج: {blank(d.annexVisaCategory)}</p><p>يشمل النطاق: {blank(d.annexScopeIncludes)}</p><p>يستثني النطاق: التمثيل القانوني والخدمات غير المدرجة أعلاه</p></>}
        />
        <SectionHeader en="Fee Schedule:" ar="جدول الرسوم:" />
        <BiRow
          en={<><p>Total Retainer Fee (AED): {blank(d.annexTotalFee)}</p><p>Initial Payment: {blank(d.annexInitialPayment)} — Due: upon signing</p><p>Second Payment: {blank(d.annexSecondPayment)} — Due: {blank(d.annexSecondPaymentDue)}</p><p>Government Fees: NOT INCLUDED — paid directly by Client</p><p>VAT: Applicable per UAE VAT Law</p><p className="mt-2">Client Signature: ____________________ &nbsp;&nbsp; Date: ____________________</p><p className="mt-1">DMC Authorised Signature: ____________________ &nbsp;&nbsp; Date: ____________________</p></>}
          ar={<><p>إجمالي رسوم التعاقد (درهم): {blank(d.annexTotalFee)}</p><p>الدفعة الأولى: {blank(d.annexInitialPayment)} — الاستحقاق: عند التوقيع</p><p>الدفعة الثانية: {blank(d.annexSecondPayment)} — الاستحقاق: {blank(d.annexSecondPaymentDue)}</p><p>رسوم الحكومة: غير مشمولة — يدفعها العميل مباشرةً</p><p>ضريبة القيمة المضافة: مطبقة وفق قانون ضريبة القيمة المضافة الإماراتي</p><p className="mt-2">توقيع العميل: ____________________ &nbsp;&nbsp; التاريخ: ____________________</p><p className="mt-1">توقيع DMC المفوض: ____________________ &nbsp;&nbsp; التاريخ: ____________________</p></>}
        />
      </tbody></table>

      <div className="text-[8px] text-gray-500 text-center border-t border-gray-300 pt-1 mt-1">
        DM Immigration Consultants DMCC – Dubai Branch — DET Licence 766222 / Parent: DMCC-788993 — Office 3703B, Latifa Tower, Sheikh Zayed Road, Dubai
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

type LookupState = 'idle' | 'loading' | 'found' | 'notfound' | 'error';

export default function AgreementGenerator() {
  const [agreementInput, setAgreementInput] = useState('');
  const [lookupState, setLookupState]       = useState<LookupState>('idle');
  const [lookupMsg, setLookupMsg]           = useState('');
  const [data, setData]                     = useState<AgreementData>(empty);
  const [mode, setMode]                     = useState<'form' | 'preview'>('preview');
  const [generating, setGenerating]         = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchAgreement = useCallback(async (num: string) => {
    const trimmed = num.trim();
    if (!trimmed) { setLookupState('idle'); setLookupMsg(''); return; }

    setLookupState('loading');
    setLookupMsg('');
    try {
      const res = await fetch(`/api/admin/agreements/lookup?agreementNumber=${encodeURIComponent(trimmed)}`);
      const json = await res.json();
      if (!res.ok || !json.found) {
        setLookupState('notfound');
        setLookupMsg(json.error || 'Agreement not found. Check the number and try again.');
        return;
      }
      setData({ ...empty, ...json.data });
      setLookupState('found');
      setLookupMsg(`Loaded: ${json.data.clientFullName}`);
      setMode('preview');
    } catch {
      setLookupState('error');
      setLookupMsg('Network error. Please try again.');
    }
  }, []);

  // Debounce auto-lookup as counsellor types
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!agreementInput.trim()) { setLookupState('idle'); setLookupMsg(''); return; }
    debounceRef.current = setTimeout(() => fetchAgreement(agreementInput), 600);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [agreementInput, fetchAgreement]);

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pdfW) / canvas.width;
      let remaining = imgH;
      let position = 0;
      pdf.addImage(imgData, 'JPEG', 0, position, pdfW, imgH);
      remaining -= pdfH;
      while (remaining > 0) {
        position -= pdfH;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfW, imgH);
        remaining -= pdfH;
      }
      const filename = `DMC_Agreement_${data.clientFullName.replace(/\s+/g, '_') || 'Client'}_${data.agreementNo || new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please use the Print option instead.');
    } finally {
      setGenerating(false);
    }
  };

  const set = (field: keyof AgreementData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData(prev => ({ ...prev, [field]: e.target.value }));

  const Field = ({ label, field, type = 'text' }: { label: string; field: keyof AgreementData; type?: string }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-0.5">{label}</label>
      <input type={type} value={data[field]} onChange={set(field)}
        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
        placeholder={label} />
    </div>
  );

  const isReady = lookupState === 'found';

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #agreement-print-area, #agreement-print-area * { visibility: visible !important; }
          #agreement-print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 8mm; }
        }
      `}</style>

      <div className="space-y-4">
        {/* ── AGREEMENT NUMBER LOOKUP ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Agreement Number Lookup</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Enter the agreement number from the opportunity flow to automatically load all client and fee details.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    value={agreementInput}
                    onChange={e => setAgreementInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && fetchAgreement(agreementInput)}
                    placeholder="e.g. AGR-1720000000000"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => fetchAgreement(agreementInput)}
                  disabled={lookupState === 'loading' || !agreementInput.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {lookupState === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Lookup
                </button>
                {isReady && (
                  <button onClick={() => { setAgreementInput(''); setData(empty); setLookupState('idle'); setLookupMsg(''); setMode('preview'); }}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                    <X className="h-4 w-4" /> Clear
                  </button>
                )}
              </div>

              {/* Lookup status */}
              {lookupState === 'loading' && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" /> Looking up agreement…
                </div>
              )}
              {lookupState === 'found' && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" /> {lookupMsg}
                </div>
              )}
              {(lookupState === 'notfound' || lookupState === 'error') && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" /> {lookupMsg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── TOOLBAR (only shown when agreement is loaded) ── */}
        {isReady && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">DMC Client Service Agreement</h3>
              <p className="text-xs text-gray-500">Bilingual English / Arabic — Dubai Branch · {data.agreementNo}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setMode(mode === 'form' ? 'preview' : 'form')}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                {mode === 'form' ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                {mode === 'form' ? 'Preview' : 'Edit Details'}
              </button>
              <button onClick={() => window.print()}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                <Printer className="w-4 h-4" /> Print
              </button>
              <button onClick={downloadPDF} disabled={generating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {generating ? 'Generating PDF…' : 'Download PDF'}
              </button>
            </div>
          </div>
        )}

        {isReady && (
          <div className={`grid gap-4 ${mode === 'form' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
            {/* ── EDIT FORM (optional corrections) ── */}
            {mode === 'form' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Details are auto-filled from the system. Edit only if something needs correction.
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 border-b pb-1">Agreement Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Agreement No." field="agreementNo" />
                    <Field label="Date" field="date" type="date" />
                    <Field label="Service Program" field="serviceProgram" />
                    <Field label="Destination Country" field="destinationCountry" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 border-b pb-1">Client Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Full Name" field="clientFullName" />
                    <Field label="Nationality" field="nationality" />
                    <Field label="Passport No." field="passportNo" />
                    <Field label="Emirates ID No." field="emiratesId" />
                    <Field label="Phone" field="phone" type="tel" />
                    <Field label="Email" field="email" type="email" />
                    <div className="col-span-2"><Field label="Occupation" field="occupation" /></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 border-b pb-1">Fee Summary</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Total Retainer Fee (AED)" field="totalRetainerFee" />
                    <Field label="Initial Payment (AED)" field="initialPayment" />
                    <Field label="Second Payment (AED)" field="secondPayment" />
                    <Field label="Second Payment Due Date" field="secondPaymentDue" type="date" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 border-b pb-1">Annexure A</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Service Program / Description" field="annexServiceProgram" />
                    <Field label="Destination Country" field="annexDestinationCountry" />
                    <Field label="Visa Category / Program Stream" field="annexVisaCategory" />
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-0.5">Scope Includes</label>
                      <textarea value={data.annexScopeIncludes} onChange={e => setData(p => ({ ...p, annexScopeIncludes: e.target.value }))}
                        rows={2} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                        placeholder="List of included services..." />
                    </div>
                    <Field label="Total Fee (AED)" field="annexTotalFee" />
                    <Field label="Initial Payment (AED)" field="annexInitialPayment" />
                    <Field label="Second Payment (AED)" field="annexSecondPayment" />
                    <Field label="Second Payment Due" field="annexSecondPaymentDue" type="date" />
                  </div>
                </div>

                <button onClick={() => setMode('preview')}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  <Eye className="w-4 h-4 inline mr-2" />Preview Agreement
                </button>
              </div>
            )}

            {/* ── PREVIEW ── */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-auto">
              <div id="agreement-print-area" ref={previewRef} className="min-w-[700px]">
                <AgreementPreview d={data} />
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isReady && lookupState !== 'loading' && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center">
            <FileText className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500">Enter an agreement number above to load the client agreement</p>
            <p className="text-xs text-gray-400 mt-1">Agreement numbers are generated automatically in the opportunity flow after payment verification</p>
          </div>
        )}
      </div>
    </>
  );
}
