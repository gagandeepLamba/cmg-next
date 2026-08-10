// Authoritative legal content for the "Client Service Agreement" contract,
// taken verbatim from the signed Commonwealth Migration Group (CMG) PDF.
// The app now operates a single branch/entity (Dubai, trading as CMG), so
// this is the only profile — the multi-branch (Abu Dhabi/Kuwait/Qatar/
// Hyderabad) profiles and templates were removed.

export interface BranchAgreementProfile {
  legalNameEn: string;
  legalNameAr: string;
  addressEn: string;
  addressAr: string;
  regulatoryLineEn: string;
  regulatoryLineAr: string;
  currencyCode: string;
  governingLawEn: string;
  governingLawAr: string;
}

const CMG_PROFILE: BranchAgreementProfile = {
  legalNameEn: 'Commonwealth Migration Group (CMG)',
  legalNameAr: 'مجموعة كومنولث للهجرة (CMG)',
  addressEn: 'Office 307, 3rd Floor, Business Atrium Building, Oud Metha, Dubai, UAE',
  addressAr: 'مكتب 307، الطابق الثالث، مبنى بزنس أتريوم، عود ميثاء، دبي، الإمارات العربية المتحدة',
  regulatoryLineEn: 'MARA-registered migration consultancy, operating as Commonwealth Documents Clearing Services',
  regulatoryLineAr: 'شركة استشارات هجرة مسجلة لدى هيئة MARA، تعمل تحت اسم خدمات كومنولث لتخليص المستندات',
  currencyCode: 'AED',
  governingLawEn: 'This Agreement is governed by the laws of the United Arab Emirates, specifically the laws applicable in the Emirate of Dubai. Unresolved disputes are referred to arbitration under the Dubai International Arbitration Centre (DIAC) Rules, seated in Dubai.',
  governingLawAr: 'تخضع هذه الاتفاقية لقوانين دولة الإمارات العربية المتحدة، وتحديدًا القوانين السارية في إمارة دبي. وتُحال المنازعات غير المحلولة إلى التحكيم وفقًا لقواعد مركز دبي الدولي للتحكيم (DIAC)، على أن يكون مقر التحكيم في دبي.',
};

export function getBranchAgreementProfile(_abbrv?: string | null): BranchAgreementProfile {
  return CMG_PROFILE;
}
