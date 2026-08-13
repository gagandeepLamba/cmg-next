// Authoritative legal content for the "Client Advisory Agreement" contract,
// taken verbatim from the signed Commonwealth Migration Group (CMG) PDF.
// The app now operates a single branch/entity (Dubai, trading as CMG), so
// this is the only profile — the multi-branch (Abu Dhabi/Kuwait/Qatar/
// Hyderabad) profiles and templates were removed.
//
// Legal name vs. trading name: the registered legal entity is Commonwealth
// Document Clearing Services; "Commonwealth Migration Group" / "CMG" is its
// trading name. Matches both reference PDFs (the agreement and the tax
// invoice) exactly — do not swap these.

export interface BranchAgreementProfile {
  legalNameEn: string;
  legalNameAr: string;
  tradingAsEn: string;
  tradingAsAr: string;
  addressEn: string;
  addressAr: string;
  regulatoryLineEn: string;
  regulatoryLineAr: string;
  currencyCode: string;
  governingLawEn: string;
  governingLawAr: string;
}

const CMG_PROFILE: BranchAgreementProfile = {
  legalNameEn: 'Commonwealth Document Clearing Services',
  legalNameAr: 'خدمات كومنولث لتخليص المستندات',
  tradingAsEn: 'Commonwealth Migration Group ("CMG")',
  tradingAsAr: 'مجموعة كومنولث للهجرة ("CMG")',
  addressEn: 'Office 307, 3rd Floor, Business Atrium Building, Oud Metha, Dubai, UAE',
  addressAr: 'مكتب 307، الطابق الثالث، مبنى بزنس أتريوم، عود ميثاء، دبي، الإمارات العربية المتحدة',
  regulatoryLineEn: 'MARA-Registered Migration Agent — Australia',
  regulatoryLineAr: 'وكيل هجرة مسجل لدى MARA — أستراليا',
  currencyCode: 'AED',
  governingLawEn: 'This Agreement is governed by the laws of the United Arab Emirates, specifically the laws applicable in the Emirate of Dubai. Unresolved disputes are referred to arbitration under the Dubai International Arbitration Centre (DIAC) Rules, seated in Dubai.',
  governingLawAr: 'تخضع هذه الاتفاقية لقوانين دولة الإمارات العربية المتحدة، وتحديدًا القوانين السارية في إمارة دبي. وتُحال المنازعات غير المحلولة إلى التحكيم وفقًا لقواعد مركز دبي الدولي للتحكيم (DIAC)، على أن يكون مقر التحكيم في دبي.',
};

export function getBranchAgreementProfile(_abbrv?: string | null): BranchAgreementProfile {
  return CMG_PROFILE;
}
