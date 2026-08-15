// Centralized payment-receipt branding + HTML template, shared by every
// screen that can print a receipt (Opportunity Flow wizard's Payment/Accounts
// stages, Lead Management's Client List quick-pay, the Clients page
// quick-pay, and Invoices & Payments).
//
// Layout matches the FTA-style "Tax Invoice / Receipt" reference document
// exactly: a plain, grayscale bordered document rather than a colour-branded
// one — Company Legal Name / Trading As / Company TRN / Client Residency
// Status are all real fields on the printed page, not just internal data.
//
// The app operates a single branch/entity — Commonwealth Migration Group
// (CMG), Dubai — so this no longer branches on branch geography/name. Branch
// identity (company name/address/TRN/VAT/bank details) still comes from the
// lead/client's actual dm_branch record, not hardcoded, so it stays correct
// if finance updates those fields.

export interface ReceiptBranchSource {
  name?: string | null;
  nameAr?: string | null;
  address?: string | null;
  email?: string | null;
  mobile?: string | null;
  phone?: string | null;
  licenseNumber?: string | null;
  trn?: string | null;
  vatGstPercent?: number | string | null;
  abbrv?: string | null;
  bankName?: string | null;
  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  bankIban?: string | null;
  bankBranch?: string | null;
}

export interface ReceiptBranchDetails {
  companyName: string;
  branchName: string;
  branchNameAr: string;
  branchAddress: string;
  branchEmail: string;
  branchPhone: string;
  licenseNumber: string;
  trn: string;
  vatGstPercent: number | null;
  // dm_branch.abbrv — the stable branch key. Kept for callers that key other
  // lookups off the same lead/opportunity data without a second branch fetch.
  branchAbbrv: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIban: string;
  bankBranch: string;
}

// Only the narrow set of dm_branch columns a receipt/agreement ever needs —
// resolved from whichever shape the caller has on hand: a `dmBranch` object
// (leads), or flat `branchName`/`branchAddress`/... fields (clients list).
export function getLeadBranchDetails(
  leadData: (Record<string, any>) | null | undefined
): ReceiptBranchDetails {
  const dmBranch: ReceiptBranchSource = leadData?.dmBranch || {};
  const branchName = String(
    dmBranch.name ||
    leadData?.branchName ||
    leadData?.branch_name ||
    '',
  ).trim();
  const branchNameAr = String(
    dmBranch.nameAr ||
    leadData?.branchNameAr ||
    leadData?.branch_name_ar ||
    '',
  ).trim();
  const branchAddress = String(
    dmBranch.address ||
    leadData?.branchAddress ||
    leadData?.branch_address ||
    '',
  ).trim();
  const branchEmail = String(
    dmBranch.email ||
    leadData?.branchEmail ||
    leadData?.branch_email ||
    '',
  ).trim();
  const branchPhone = String(
    dmBranch.mobile ||
    dmBranch.phone ||
    leadData?.branchPhone ||
    leadData?.branchMobile ||
    leadData?.branch_mobile ||
    '',
  ).trim();
  const licenseNumber = String(
    dmBranch.licenseNumber ||
    leadData?.branchLicenseNumber ||
    leadData?.branch_license_number ||
    '',
  ).trim();
  const trn = String(
    dmBranch.trn ||
    leadData?.branchTrn ||
    leadData?.branch_trn ||
    '',
  ).trim();
  // dm_branch.vat_gst_percent is a DECIMAL column, which the MySQL driver
  // returns as a string — coerce here so callers can use it as a number.
  const rawVatGstPercent = dmBranch.vatGstPercent ?? leadData?.branchVatGstPercent ?? leadData?.branch_vat_gst_percent;
  const vatGstPercent = rawVatGstPercent !== null && rawVatGstPercent !== undefined && rawVatGstPercent !== ''
    ? Number(rawVatGstPercent)
    : null;
  const branchAbbrv = String(
    dmBranch.abbrv ||
    leadData?.branchAbbrv ||
    leadData?.branch_abbrv ||
    '',
  ).trim();
  const bankName = String(dmBranch.bankName || leadData?.branchBankName || leadData?.branch_bank_name || '').trim();
  const bankAccountName = String(dmBranch.bankAccountName || leadData?.branchBankAccountName || leadData?.branch_bank_account_name || '').trim();
  const bankAccountNumber = String(dmBranch.bankAccountNumber || leadData?.branchBankAccountNumber || leadData?.branch_bank_account_number || '').trim();
  const bankIban = String(dmBranch.bankIban || leadData?.branchBankIban || leadData?.branch_bank_iban || '').trim();
  const bankBranch = String(dmBranch.bankBranch || leadData?.branchBankBranch || leadData?.branch_bank_branch || '').trim();

  return {
    companyName: branchName || 'Commonwealth Migration Group',
    branchName: branchName || 'Commonwealth Migration Group',
    branchNameAr,
    branchAddress,
    branchEmail,
    branchPhone,
    licenseNumber,
    trn,
    vatGstPercent,
    branchAbbrv,
    bankName,
    bankAccountName,
    bankAccountNumber,
    bankIban,
    bankBranch,
  };
}

// Fixed legal identity of the single entity this app operates as — matches
// the signed Tax Invoice/Receipt reference document exactly. The header
// banner always reads "COMMONWEALTH MIGRATION GROUP" regardless of which
// branch/lead the receipt is for (the app operates a single UAE entity) —
// never the raw dm_branch.name value, which is an internal office label
// (e.g. "Dubai SZR"), not the company's trading identity.
const CMG_LEGAL_NAME = '';
const CMG_DISPLAY_NAME = 'Commonwealth Documents Clearing Services LLC';
const CMG_TRADING_AS = 'Commonwealth Migration Group ("CMG")';
const CMG_ISSUER_EMAIL = 'accounts@cwmigrationgroup.ae';

export interface BranchReceiptConfig {
  companyName: string;
  legalName: string;
  tradingAs: string;
  address: string;
  trn: string | null;
  licenseNumber: string | null;
  email: string;
  vatRate: number; // the branch's own default/standard rate, e.g. 5 for 5%
  branchChargesVat: boolean; // false for branches with no VAT/GST regime at all (e.g. Kuwait, Qatar)
}

// Commonwealth Migration Group's identity for the printed invoice — legal
// name/trading name are fixed (this app operates a single UAE entity); TRN,
// address, and VAT rate still come from the branch's own dm_branch record
// (never hardcoded), so they stay correct if finance updates those fields.
export function getBranchReceiptConfig(
  _branchName: string = '',
  branchAddress: string | null = null,
  branchEmail: string | null = null,
  branchLicenseNumber: string | null = null,
  branchTrn: string | null = null,
  branchVatGstPercent: number | string | null = null,
): BranchReceiptConfig {
  const vatRate = branchVatGstPercent !== null && branchVatGstPercent !== undefined && branchVatGstPercent !== ''
    ? Number(branchVatGstPercent)
    : 5;

  return {
    companyName: CMG_DISPLAY_NAME,
    legalName: CMG_LEGAL_NAME,
    tradingAs: CMG_TRADING_AS,
    address: branchAddress || '',
    trn: branchTrn || null,
    licenseNumber: branchLicenseNumber || null,
    email: branchEmail || CMG_ISSUER_EMAIL,
    vatRate,
    branchChargesVat: vatRate > 0,
  };
}

export type ClientResidencyStatus = 'uae_resident' | 'non_resident';

export interface ReceiptFields {
  receiptNumber?: string | null;
  paymentNumber?: string | null;
  paymentDate?: string | Date | null;
  clientName?: string | null;
  email?: string | null;
  phone?: string | null;
  passportNumber?: string | null;
  agreementNumber?: string | null;
  opportunityId?: number | string | null;
  serviceName?: string | null;
  purposeOfPayment?: string | null;
  consultantName?: string | null;
  companyName?: string | null;
  branchId?: number | string | null;
  branchName?: string | null;
  branchAddress?: string | null;
  branchEmail?: string | null;
  branchPhone?: string | null;
  licenseNumber?: string | null;
  branchTrn?: string | null;
  vatGstPercent?: number | string | null;
  // Client residency status determines VAT treatment (5% standard-rated vs
  // 0% zero-rated export of services). Pass either the resolved status or
  // the raw dmc_forum_leads.novat flag (1 = non-resident/zero-rated) — the
  // template never defaults to zero-rating on its own (matches the UAE VAT
  // Law guidance that export-of-services zero-rating must be confirmed, not
  // assumed).
  residencyStatus?: ClientResidencyStatus | null;
  novat?: number | string | null;
  paymentMethod?: string | null;
  transactionId?: string | null;
  currency?: string | null;
  totalAmount?: number | string | null;
  previouslyPaid?: number | string | null;
  paidAmount?: number | string | null;
  remainingBalance?: number | string | null;
  remark?: string | null;
  bankName?: string | null;
  bankAccountName?: string | null;
  bankAccountNumber?: string | null;
  bankIban?: string | null;
  bankBranch?: string | null;
}

const titleCase = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const esc = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// ── English number-to-words, for the "Amount in Words" line ───────────────
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const SCALES = ['', 'Thousand', 'Million', 'Billion'];

function threeDigitsToWords(n: number): string {
  let s = '';
  if (n >= 100) {
    s += `${ONES[Math.floor(n / 100)]} Hundred`;
    n %= 100;
    if (n) s += ' ';
  }
  if (n >= 20) {
    s += TENS[Math.floor(n / 10)];
    if (n % 10) s += `-${ONES[n % 10]}`;
  } else if (n > 0) {
    s += ONES[n];
  }
  return s;
}

function integerToWords(num: number): string {
  if (num <= 0) return 'Zero';
  let n = Math.floor(num);
  const parts: string[] = [];
  let scale = 0;
  while (n > 0) {
    const chunk = n % 1000;
    if (chunk) parts.unshift(`${threeDigitsToWords(chunk)}${SCALES[scale] ? ' ' + SCALES[scale] : ''}`);
    n = Math.floor(n / 1000);
    scale++;
  }
  return parts.join(' ');
}

function amountInWords(amount: number, currency: string): string {
  const whole = Math.floor(amount);
  const fils = Math.round((amount - whole) * 100);
  let words = `${currency} ${integerToWords(whole)}`;
  if (fils > 0) words += ` and ${integerToWords(fils)} Fils`;
  return `${words} only`;
}

// Shared by every screen that prints a payment receipt so they all render
// the exact same layout instead of maintaining divergent copies.
export function buildReceiptHtml(r: ReceiptFields): string {
  const cfg = getBranchReceiptConfig(
    r.branchName || r.companyName || '',
    r.branchAddress || null,
    r.branchEmail || null,
    r.licenseNumber || null,
    r.branchTrn || null,
    r.vatGstPercent ?? null,
  );
  const currency = r.currency || 'AED';
  const branchAddress = (r.branchAddress || cfg.address || '').replace(/\n/g, ', ');
  const fmt = (n: number) => `${currency} ${n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalAmount = Number(r.totalAmount || 0);
  const paidAmount = Number(r.paidAmount || 0);
  const hasPreviouslyPaid = r.previouslyPaid !== undefined && r.previouslyPaid !== null;
  const previouslyPaid = Number(r.previouslyPaid || 0);
  const balance = r.remainingBalance !== undefined && r.remainingBalance !== null
    ? Number(r.remainingBalance)
    : Math.max(0, totalAmount - paidAmount);

  // Client residency resolves the VAT treatment for *this* invoice. Never
  // zero-rate without an explicit non-resident confirmation — an unset/
  // unknown status is treated as UAE-resident/standard-rated, per the UAE
  // VAT Law export-of-services note (zero-rating must be verified, not
  // assumed by default).
  const residencyStatus: ClientResidencyStatus =
    r.residencyStatus === 'non_resident' ? 'non_resident'
    : r.residencyStatus === 'uae_resident' ? 'uae_resident'
    : (r.novat === 1 || r.novat === '1') ? 'non_resident'
    : 'uae_resident';
  const isZeroRatedExport = cfg.branchChargesVat && residencyStatus === 'non_resident';
  const effectiveVatRate = cfg.branchChargesVat ? (isZeroRatedExport ? 0 : cfg.vatRate) : 0;
  const chargesVatAtAll = cfg.branchChargesVat;

  // The VAT/net split applies to the amount actually being receipted now
  // (paidAmount) — matching how a tax invoice is issued per payment received.
  const netAmount = effectiveVatRate > 0 ? paidAmount / (1 + effectiveVatRate / 100) : paidAmount;
  const vatAmount = effectiveVatRate > 0 ? paidAmount - netAmount : 0;
  const vatRowLabel = !chargesVatAtAll
    ? 'VAT — Not Applicable'
    : isZeroRatedExport
      ? 'VAT — 0% Export of Services (Zero-Rated)'
      : `VAT — ${effectiveVatRate}% Standard Rate`;
  const residencyLabel = residencyStatus === 'non_resident' ? 'Non-UAE Resident (Export of Services)' : 'UAE Resident';
  const totalLabel = hasPreviouslyPaid ? 'AMOUNT PAID (THIS RECEIPT)' : 'TOTAL DUE';

  const vatNote = !chargesVatAtAll
    ? ''
    : isZeroRatedExport
      ? 'VAT Note: This supply is zero-rated as an export of services under UAE VAT Law (Cabinet Decision 52/2017, Art. 31) — the Client has confirmed non-UAE-residence and being outside the UAE at the time the service is performed.'
      : `VAT Note: Standard-rated supply — ${effectiveVatRate}% UAE VAT applied as the Client is a UAE resident. Zero-rating as an export of services applies only where the recipient is confirmed non-UAE-resident and outside the UAE at the time of service (Cabinet Decision 52/2017, Art. 31); it is never applied by default.`;

  const isBankTransfer = /bank|transfer|swift|iban/i.test(r.paymentMethod || '');
  const bankName = r.bankName || '';
  const bankAccountName = r.bankAccountName || '';
  const bankAccountNumber = r.bankAccountNumber || '';
  const bankIban = r.bankIban || '';
  const bankBranch = r.bankBranch || '';
  const hasBankDetails = isBankTransfer && !!(bankName || bankAccountNumber || bankIban);

  const invoiceNo = r.receiptNumber || r.paymentNumber || 'N/A';
  const invoiceDate = r.paymentDate ? new Date(r.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const trnValue = cfg.trn
    ? esc(cfg.trn)
    : '<span class="placeholder">____________________ (mandatory — insert FTA Tax Registration Number)</span>';
  const clientContact = [r.phone || '', r.email || ''].filter(Boolean).join(' | ') || '—';
  const purposeOfPayment = r.purposeOfPayment || `Professional Migration & Visa Consulting Services${r.serviceName ? ` — ${r.serviceName}` : ''}`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>Tax Invoice / Receipt ${esc(invoiceNo)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;font-size:9pt;line-height:1.3;padding:18px 28px 20px}
  .placeholder{color:#666;font-style:italic;font-weight:400}
  .doc-header{text-align:center;margin-bottom:6px}
  .doc-header .company{font-size:13.5pt;font-weight:800;letter-spacing:.3px}
  .doc-header .legal{font-size:8.8pt;font-weight:600;margin-top:1px}
  .doc-header .addr{font-size:8pt;color:#333;margin-top:1px}
  .rule{border:none;border-top:2px solid #1a1a1a;margin:6px 0 6px}
  .doc-title{text-align:center;margin-bottom:8px}
  .doc-title .t1{font-size:11.5pt;font-weight:800;letter-spacing:.3px}
  .doc-title .t2{font-size:8.5pt;margin-top:2px}
  table.info-table{width:100%;border-collapse:collapse;border:1px solid #333;margin-bottom:8px}
  table.info-table td{border:1px solid #333;padding:3px 8px;font-size:8.3pt;vertical-align:top}
  table.info-table td.label{background:#eeeeee;font-weight:700;width:30%}
  table.desc-table{width:100%;border-collapse:collapse;border:1px solid #333;margin-bottom:4px}
  table.desc-table th{background:#2b2b2b;color:#fff;text-align:left;padding:4px 8px;font-size:8.2pt;text-transform:uppercase;letter-spacing:.3px}
  table.desc-table th:last-child, table.desc-table td:last-child{text-align:right;width:150px}
  table.desc-table td{border:1px solid #333;padding:4px 8px;font-size:8.3pt}
  table.desc-table tr.total-row td{font-weight:800;background:#f0f0f0;font-size:9pt}
  .caption{font-size:7.6pt;color:#333;margin:3px 0;line-height:1.4}
  .caption.note{font-style:italic;color:#444}
  table.bank-table{width:100%;border-collapse:collapse;border:1px solid #333;margin-top:8px}
  table.bank-table th{background:#2b2b2b;color:#fff;text-align:left;padding:4px 8px;font-size:8.2pt;text-transform:uppercase;letter-spacing:.3px}
  table.bank-table td{border:1px solid #333;padding:3px 8px;font-size:8.3pt}
  table.bank-table td.label{background:#eeeeee;font-weight:700;width:30%}
  .sign-row{display:flex;justify-content:space-between;margin-top:20px;gap:40px}
  .sign-row .box{flex:1;font-size:8.3pt}
  .sign-row .line{display:block;border-bottom:1px solid #1a1a1a;height:22px}
  .sign-row .cap{margin-top:3px;font-style:italic;color:#333}
  .notes{margin-top:12px;border-top:1px solid #999;padding-top:5px}
  .notes ul{list-style:disc;padding-left:16px;font-size:7pt;color:#333;line-height:1.35}
  @media print{
    @page{size:A4;margin:8mm 10mm}
    body{padding:0}
    table.info-table,table.desc-table,table.bank-table,.sign-row,.notes{page-break-inside:avoid}
  }
</style></head><body>
<div class="doc-header">
  <div class="company">${esc(cfg.companyName.toUpperCase())}</div>
  <div class="legal">${esc(cfg.legalName)}</div>
  ${branchAddress ? `<div class="addr">${esc(branchAddress)}</div>` : ''}
</div>
<hr class="rule"/>
<div class="doc-title">
  <div class="t1">TAX INVOICE / RECEIPT</div>
  <div class="t2">Invoice No.: <strong>${esc(invoiceNo)}</strong></div>
</div>
<table class="info-table">
  <tr><td class="label">Company Legal Name</td><td>${esc(cfg.legalName)}</td></tr>
  <tr><td class="label">Trading As</td><td>${esc(cfg.tradingAs)}</td></tr>
  <tr><td class="label">Company TRN</td><td>${trnValue}</td></tr>
  <tr><td class="label">Date of Supply / Invoice Date</td><td>${esc(invoiceDate)}</td></tr>
  <tr><td class="label">Client Name</td><td>${esc(r.clientName || 'Client')}</td></tr>
  <tr><td class="label">Client Contact</td><td>${esc(clientContact)}</td></tr>
  <tr><td class="label">Client Residency Status</td><td>${esc(residencyLabel)}</td></tr>
  <tr><td class="label">Service / Program</td><td>${esc(r.serviceName || '—')}</td></tr>
  <tr><td class="label">Purpose of Payment</td><td>${esc(purposeOfPayment)}</td></tr>
  <tr><td class="label">Payment Mode</td><td>${esc(titleCase(r.paymentMethod || 'Cash'))}</td></tr>
  <tr><td class="label">Payment Status</td><td><strong>Payment Received</strong></td></tr>
  ${r.agreementNumber ? `<tr><td class="label">Agreement No.</td><td>${esc(r.agreementNumber)}</td></tr>` : ''}
  ${r.consultantName ? `<tr><td class="label">Consultant</td><td>${esc(r.consultantName)}</td></tr>` : ''}
  ${r.transactionId ? `<tr><td class="label">Bank Reference</td><td>${esc(r.transactionId)}</td></tr>` : ''}
  ${r.remark ? `<tr><td class="label">Remark</td><td>${esc(r.remark)}</td></tr>` : ''}
</table>
<table class="desc-table">
  <tr><th>Description</th><th>Value (${esc(currency)})</th></tr>
  ${hasPreviouslyPaid ? `<tr><td>Total Amount</td><td>${fmt(totalAmount)}</td></tr>
  <tr><td>Previously Paid</td><td>${fmt(previouslyPaid)}</td></tr>` : ''}
  <tr><td>Net Amount — Professional Consulting Fee</td><td>${fmt(netAmount)}</td></tr>
  <tr><td>${esc(vatRowLabel)}</td><td>${fmt(vatAmount)}</td></tr>
  <tr class="total-row"><td>${esc(totalLabel)}</td><td>${fmt(paidAmount)}</td></tr>
  ${hasPreviouslyPaid ? `<tr class="total-row"><td>Balance Due</td><td>${fmt(balance)}</td></tr>` : ''}
</table>
<div class="caption"><strong>Amount in Words:</strong> ${esc(amountInWords(paidAmount, currency))}</div>
${vatNote ? `<div class="caption note">${esc(vatNote)}</div>` : ''}
${hasBankDetails ? `<table class="bank-table">
  <tr><th colspan="2">Payment Details (for bank transfer)</th></tr>
  ${bankName ? `<tr><td class="label">Bank</td><td>${esc(bankName)}</td></tr>` : ''}
  ${bankAccountName ? `<tr><td class="label">Account Name</td><td>${esc(bankAccountName)}</td></tr>` : ''}
  ${bankAccountNumber ? `<tr><td class="label">Account Number</td><td>${esc(bankAccountNumber)}</td></tr>` : ''}
  ${bankIban ? `<tr><td class="label">IBAN</td><td>${esc(bankIban)}</td></tr>` : ''}
  ${bankBranch ? `<tr><td class="label">Branch</td><td>${esc(bankBranch)}</td></tr>` : ''}
</table>` : ''}
<div class="sign-row">
  <div class="box"><span class="line"></span><div class="cap">Client Signature</div></div>
  <div class="box"><span class="line"></span><div class="cap">Authorised Signatory — CMG</div></div>
</div>
<div class="notes">
  <ul>
    <li>All fees and payments made by the Client under this Agreement are final, non-refundable, and non-transferable, irrespective of the outcome of the services, change in the Client's circumstances, withdrawal, cancellation, or decision not to proceed.</li>
    <li>This is a Tax Invoice per UAE Federal Tax Authority requirements. Valid only when the Company TRN above is completed.</li>
    <li>Please share the bank transfer receipt / SWIFT copy referencing this invoice number once payment is sent.</li>
    <li>Bank transfer charges are borne by the applicant, not by ${esc(cfg.legalName)}.</li>
    <li>Payment will only be recorded/credited as "Payment Received" once funds are realized and cleared in our bank account — not upon initiation or submission of a transfer.</li>
    <li>${esc(cfg.email)}</li>
  </ul>
</div>
</body></html>`;
}

export function printReceipt(r: ReceiptFields): boolean {
  const html = buildReceiptHtml(r);
  const win = window.open('', '_blank', 'width=860,height=1100');
  if (!win) { window.toast.warning('Allow pop-ups to view the receipt.'); return false; }
  win.document.write(html);
  win.document.close();
  win.addEventListener('load', () => setTimeout(() => win.print(), 300));
  if (win.document.readyState === 'complete') setTimeout(() => win.print(), 500);
  return true;
}
