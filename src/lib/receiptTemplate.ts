// Centralized payment-receipt branding + HTML template, shared by every
// screen that can print a receipt (Opportunity Flow wizard's Payment/Accounts
// stages, Lead Management's Client List quick-pay, the Clients page
// quick-pay, and Invoices & Payments).
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
    vatGstPercent,
    branchAbbrv,
    bankName,
    bankAccountName,
    bankAccountNumber,
    bankIban,
    bankBranch,
  };
}

export interface BranchReceiptConfig {
  companyName: string;
  issuedByName: string;
  address: string;
  trn: string | null;
  email: string;
  headerBg: string;
  accentColor: string;
  totalBg: string;
  labelColor: string;
  receiptTitle: string;
  hasVat: boolean;
  vatRate: number; // percentage, e.g. 5 for 5%
  taxLabel: 'VAT' | 'GST';
  totalLabel: string;
  statusLabel: string;
  footerNote: string;
  refLabel: string;
}

// Commonwealth Migration Group's fixed navy/red identity — company name,
// address, TRN, and VAT rate still come from the branch's own dm_branch
// record (never hardcoded), only the color theme and copy are fixed here.
export function getBranchReceiptConfig(
  branchName: string = '',
  currency: string = 'AED',
  branchAddress: string | null = null,
  branchEmail: string | null = null,
  branchLicenseNumber: string | null = null,
  branchVatGstPercent: number | string | null = null,
  _branchId: number | string | null = null,
): BranchReceiptConfig {
  const vatRate = branchVatGstPercent !== null && branchVatGstPercent !== undefined && branchVatGstPercent !== ''
    ? Number(branchVatGstPercent)
    : 5;
  const hasVat = vatRate > 0;

  return {
    companyName: branchName || 'Commonwealth Migration Group',
    issuedByName: 'Commonwealth Document Clearing Services LLC',
    address: branchAddress || '',
    trn: branchLicenseNumber || null,
    email: branchEmail || '',
    headerBg: '#eef2f8',
    accentColor: '#0f2a4a',
    totalBg: '#0f2a4a',
    labelColor: '#1e3a5f',
    receiptTitle: hasVat ? 'TAX INVOICE / PAYMENT RECEIPT' : 'PAYMENT RECEIPT',
    hasVat, vatRate, taxLabel: 'VAT',
    totalLabel: hasVat ? 'TOTAL PAID (INCL. VAT)' : 'TOTAL RECEIVED',
    statusLabel: hasVat ? 'PAID IN FULL' : 'RECEIVED IN FULL',
    footerNote: hasVat
      ? `Tax Invoice per UAE Federal Tax Authority — VAT ${vatRate}%`
      : 'This supply qualifies as an export of services under UAE VAT Law and is zero-rated/VAT-exempt accordingly.',
    refLabel: 'Bank Reference',
  };
}

export interface ReceiptFields {
  receiptNumber?: string | null;
  paymentNumber?: string | null;
  paymentDate?: string | Date | null;
  clientName?: string | null;
  email?: string | null;
  passportNumber?: string | null;
  agreementNumber?: string | null;
  opportunityId?: number | string | null;
  serviceName?: string | null;
  consultantName?: string | null;
  companyName?: string | null;
  branchId?: number | string | null;
  branchName?: string | null;
  branchAddress?: string | null;
  branchEmail?: string | null;
  branchPhone?: string | null;
  licenseNumber?: string | null;
  vatGstPercent?: number | string | null;
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

// Shared by every screen that prints a payment receipt so they all render
// the exact same layout instead of maintaining divergent copies.
export function buildReceiptHtml(r: ReceiptFields): string {
  const cfg = getBranchReceiptConfig(
    r.branchName || r.companyName || '',
    r.currency || 'AED',
    r.branchAddress || null,
    r.branchEmail || null,
    r.licenseNumber || null,
    r.vatGstPercent ?? null,
    r.branchId ?? null,
  );
  const currency = r.currency || 'AED';
  const companyName = r.companyName || cfg.companyName;
  const branchName = r.branchName || companyName;
  const branchAddress = (r.branchAddress || cfg.address || '').replace(/\n/g, ', ');
  const contactLine = [
    r.branchPhone ? `Ph: ${r.branchPhone}` : '',
    r.branchEmail || cfg.email || '',
  ].filter(Boolean).join(' · ');
  const fmt = (n: number) => `${currency} ${n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalAmount = Number(r.totalAmount || 0);
  const paidAmount = Number(r.paidAmount || 0);
  const hasPreviouslyPaid = r.previouslyPaid !== undefined && r.previouslyPaid !== null;
  const previouslyPaid = Number(r.previouslyPaid || 0);
  const balance = r.remainingBalance !== undefined && r.remainingBalance !== null
    ? Number(r.remainingBalance)
    : Math.max(0, totalAmount - paidAmount);

  // The VAT/net split applies to the amount actually being receipted now
  // (paidAmount) — matching how a tax invoice is issued per payment received.
  const netAmount = cfg.hasVat ? paidAmount / (1 + cfg.vatRate / 100) : paidAmount;
  const vatAmount = cfg.hasVat ? paidAmount - netAmount : 0;
  const vatRowLabel = cfg.hasVat ? `VAT @ ${cfg.vatRate}%` : 'VAT — Export of Services (Exempt)';

  const isBankTransfer = /bank|transfer|swift|iban/i.test(r.paymentMethod || '');
  const bankName = r.bankName || '';
  const bankAccountName = r.bankAccountName || '';
  const bankAccountNumber = r.bankAccountNumber || '';
  const bankIban = r.bankIban || '';
  const bankBranch = r.bankBranch || '';
  const hasBankDetails = isBankTransfer && !!(bankName || bankAccountNumber || bankIban);

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>Payment Receipt</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;color:#222;font-size:11pt;padding:50px 60px 80px}
  .header{background:${cfg.headerBg};border-bottom:3px solid ${cfg.accentColor};padding:16px 20px;margin:-50px -60px 20px;display:flex;align-items:center;justify-content:space-between}
  .brand{font-size:15pt;font-weight:700;color:${cfg.accentColor}}
  .sub{font-size:9pt;color:#555;margin-top:3px}
  .badge{background:${cfg.accentColor};color:#fff;padding:6px 16px;border-radius:4px;font-weight:700;font-size:10pt;white-space:nowrap}
  table{width:100%;border-collapse:collapse;margin:16px 0}
  td{padding:9px 12px;font-size:10.5pt}
  tr td:first-child{background:${cfg.labelColor};color:#fff;font-weight:600}
  tr td:last-child{background:#fff;border-bottom:1px solid #eee}
  .vat-row td:first-child, .vat-row td:last-child{color:${cfg.accentColor};font-weight:700;background:#fff}
  .total-row td:first-child{background:${cfg.totalBg}!important;font-size:11.5pt;color:#fff}
  .total-row td:last-child{background:${cfg.totalBg}!important;font-weight:700;font-size:13pt;color:#fff}
  .amount-table th{background:${cfg.accentColor};color:#fff;text-align:left;padding:9px 12px;font-size:10pt;text-transform:uppercase;letter-spacing:.3px}
  .amount-table th:last-child, .amount-table td:last-child{text-align:right}
  .bank-section{margin-top:18px}
  .bank-title{background:${cfg.accentColor};color:#fff;padding:7px 12px;font-weight:700;font-size:10pt;text-transform:uppercase;letter-spacing:.3px}
  .bank-table{margin-top:0}
  .footer{margin-top:30px;border-top:2px solid ${cfg.accentColor};padding-top:10px;text-align:center;color:#666;font-size:9pt}
  @media print{@page{size:A4;margin:0}body{padding:40px 50px 60px}.header{margin:-40px -50px 20px}}
</style></head><body>
<div class="header">
  <div>
    <div class="brand">${companyName.toUpperCase()}</div>
    <div class="sub">${branchAddress || branchName}</div>
    ${cfg.trn ? `<div class="sub"><strong>TRN: ${cfg.trn}</strong></div>` : ''}
    ${contactLine ? `<div class="sub">${contactLine}</div>` : ''}
  </div>
  <div class="badge">${cfg.receiptTitle}</div>
</div>
<div style="margin-bottom:18px;">
  <div style="font-size:10pt;color:#666;">Receipt No: <strong>${r.receiptNumber || r.paymentNumber || 'N/A'}</strong></div>
  <div style="font-size:10pt;color:#666;margin-top:4px;">Date: <strong>${r.paymentDate ? new Date(r.paymentDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</strong></div>
</div>
<table>
  <tr><td>Client Name</td><td>${r.clientName || 'Client'}</td></tr>
  ${r.email ? `<tr><td>Email</td><td>${r.email}</td></tr>` : ''}
  ${r.passportNumber ? `<tr><td>Passport Number</td><td>${r.passportNumber}</td></tr>` : ''}
  <tr><td>Agreement No.</td><td>${r.agreementNumber || 'N/A'}</td></tr>
  ${r.serviceName ? `<tr><td>Service</td><td>${r.serviceName}</td></tr>` : ''}
  ${r.consultantName ? `<tr><td>Consultant</td><td>${r.consultantName}</td></tr>` : ''}
  <tr><td>Issued By</td><td>${cfg.issuedByName}</td></tr>
  <tr><td>Branch</td><td>${branchName}</td></tr>
  <tr><td>Payment Method</td><td>${titleCase(r.paymentMethod || 'Cash')}</td></tr>
  ${r.transactionId ? `<tr><td>${cfg.refLabel}</td><td>${r.transactionId}</td></tr>` : ''}
  ${r.remark ? `<tr><td>Remark</td><td>${r.remark}</td></tr>` : ''}
</table>
<table class="amount-table">
  <tr><th>Amount</th><th>Value (${currency})</th></tr>
  ${hasPreviouslyPaid ? `<tr><td>Total Amount</td><td>${fmt(totalAmount)}</td></tr>
  <tr><td>Previously Paid</td><td>${fmt(previouslyPaid)}</td></tr>` : ''}
  <tr><td>Net Amount (excl. ${cfg.taxLabel})</td><td>${fmt(netAmount)}</td></tr>
  <tr class="vat-row"><td>${vatRowLabel}</td><td>${fmt(vatAmount)}</td></tr>
  <tr class="total-row"><td>${hasPreviouslyPaid ? cfg.totalLabel.replace('TOTAL PAID', 'AMOUNT PAID (THIS RECEIPT)').replace('TOTAL RECEIVED', 'AMOUNT RECEIVED (THIS RECEIPT)') : cfg.totalLabel}</td><td>${fmt(paidAmount)}</td></tr>
  ${hasPreviouslyPaid ? `<tr class="total-row"><td>Balance Due</td><td>${fmt(balance)}</td></tr>` : ''}
</table>
${hasBankDetails ? `<div class="bank-section">
  <div class="bank-title">Payment Details (Bank Transfer)</div>
  <table class="bank-table">
    ${bankName ? `<tr><td>Bank</td><td>${bankName}</td></tr>` : ''}
    ${bankAccountName ? `<tr><td>Account Name</td><td>${bankAccountName}</td></tr>` : ''}
    ${bankAccountNumber ? `<tr><td>Account Number</td><td>${bankAccountNumber}</td></tr>` : ''}
    ${bankIban ? `<tr><td>IBAN</td><td>${bankIban}</td></tr>` : ''}
    ${bankBranch ? `<tr><td>Branch</td><td>${bankBranch}</td></tr>` : ''}
  </table>
</div>` : ''}
<p style="margin-top:16px;font-size:10pt;color:#444;">This receipt confirms payment received by ${companyName}. Please retain for your records.</p>
<div style="margin-top:40px;display:flex;justify-content:space-between;font-size:10pt;">
  <div>Client Signature: <span style="display:inline-block;width:160px;border-bottom:1px solid #222;"></span></div>
  <div>Authorised Signatory: <span style="display:inline-block;width:160px;border-bottom:1px solid #222;"></span></div>
</div>
<div class="footer">${cfg.footerNote}${cfg.trn ? ` · TRN: ${cfg.trn}` : ''}<br>${[companyName, branchAddress, r.licenseNumber && !cfg.trn ? `Licence No. ${r.licenseNumber}` : '', 'cwmigrationgroup.ae'].filter(Boolean).join(' · ')}</div>
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
