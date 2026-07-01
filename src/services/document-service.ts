import crypto from 'crypto';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

type DocumentType = 'payslip' | 'experience_letter' | 'relieving_letter';
type DocumentInput = {
  type: DocumentType;
  title: string;
  fileName: string;
  lines: string[];
  ownerId?: number;
  expiresInDays?: number;
};
type PayslipLineItem = { label: string; amount: number };
type PayslipInput = {
  companyName: string;
  companyAddress: string;
  employeeName: string;
  employeeId: string;
  designation?: string;
  department?: string;
  payPeriod: string;
  basicSalary: number;
  allowances: PayslipLineItem[];
  overtimeHours: number;
  overtimeAmount: number;
  deductions: PayslipLineItem[];
  grossSalary: number;
  netSalary: number;
  bankName?: string;
  maskedIban?: string;
  ytdEarnings: number;
  signatureName?: string;
  fileName?: string;
};
type StoredDocument = {
  provider: 'local' | 's3' | 'blob';
  storageKey: string;
  signedUrl: string;
  contentType: 'application/pdf';
  expiresAt: Date;
};

const storageRoot = path.join(process.cwd(), 'public', 'generated-documents');
const publicBaseUrl = process.env.APP_URL || 'http://localhost:3000';
const signingSecret = process.env.DOCUMENT_SIGNING_SECRET || process.env.JWT_SECRET || 'local-document-secret';

const escapePdfText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const makeSimplePdf = (title: string, lines: string[]) => {
  const textRows = [title, '', ...lines].map((line, index) => {
    const y = 760 - (index * 18);
    const size = index === 0 ? 16 : 10;
    return `BT /F1 ${size} Tf 50 ${y} Td (${escapePdfText(line)}) Tj ET`;
  }).join('\n');

  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    `5 0 obj << /Length ${textRows.length} >> stream\n${textRows}\nendstream endobj`,
  ];

  const body = objects.join('\n');
  return Buffer.from(`%PDF-1.4\n${body}\ntrailer << /Root 1 0 R >>\n%%EOF`, 'utf8');
};

const signStorageKey = (storageKey: string, expiresAt: Date) => (
  crypto
    .createHmac('sha256', signingSecret)
    .update(`${storageKey}:${expiresAt.getTime()}`)
    .digest('hex')
);

export class DocumentService {
  static async generateAndStorePdf(input: DocumentInput): Promise<StoredDocument> {
    const provider = (process.env.DOCUMENT_STORAGE_PROVIDER || 'local').toLowerCase();
    const fileName = input.fileName.endsWith('.pdf') ? input.fileName : `${input.fileName}.pdf`;
    const storageKey = `${input.type}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const pdf = makeSimplePdf(input.title, input.lines);

    const expiresAt = new Date(Date.now() + (input.expiresInDays || 7) * 24 * 60 * 60 * 1000);

    if (provider === 's3') return this.storeS3(storageKey, pdf, expiresAt);
    if (provider === 'blob') return this.storeBlob(storageKey, pdf, expiresAt);
    return this.storeLocal(storageKey, pdf, expiresAt);
  }

  static generatePayslip(input: PayslipInput) {
    return this.generateAndStorePdf({
      type: 'payslip',
      title: `${input.companyName} - Payslip`,
      fileName: input.fileName || `payslip-${input.employeeId}-${input.payPeriod}`,
      lines: [
        input.companyAddress,
        '',
        `Employee: ${input.employeeName}`,
        `Employee ID: ${input.employeeId}`,
        `Designation: ${input.designation || 'Not set'}`,
        `Department: ${input.department || 'Not set'}`,
        `Pay Period: ${input.payPeriod}`,
        '',
        'EARNINGS',
        `Basic Salary: AED ${input.basicSalary.toLocaleString('en-AE')}`,
        ...input.allowances.map((item) => `${item.label}: AED ${item.amount.toLocaleString('en-AE')}`),
        `Overtime: ${input.overtimeHours} hours - AED ${input.overtimeAmount.toLocaleString('en-AE')}`,
        '',
        'DEDUCTIONS',
        ...input.deductions.map((item) => `${item.label}: AED ${item.amount.toLocaleString('en-AE')}`),
        '',
        `Gross Salary: AED ${input.grossSalary.toLocaleString('en-AE')}`,
        `Net Salary: AED ${input.netSalary.toLocaleString('en-AE')}`,
        `Bank: ${input.bankName || 'Not set'}`,
        `IBAN: ${input.maskedIban || 'Not set'}`,
        `YTD Earnings: AED ${input.ytdEarnings.toLocaleString('en-AE')}`,
        '',
        `Authorised Signature: ${input.signatureName || 'HR / Finance'}`,
      ],
      expiresInDays: 7,
    });
  }

  static generateLetter(input: {
    type: 'experience_letter' | 'relieving_letter';
    employeeName: string;
    body: string;
    fileName?: string;
    title?: string;
    lines?: string[];
  }) {
    return this.generateAndStorePdf({
      type: input.type,
      title: input.title || (input.type === 'experience_letter' ? 'Experience Letter' : 'Relieving Letter'),
      fileName: input.fileName || `${input.type}-${input.employeeName}`,
      lines: input.lines || input.body.split('\n'),
      expiresInDays: 7,
    });
  }

  private static async storeLocal(storageKey: string, pdf: Buffer, expiresAt: Date): Promise<StoredDocument> {
    const fullPath = path.join(storageRoot, storageKey);
    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, pdf);

    const signature = signStorageKey(storageKey, expiresAt);
    const signedUrl = `${publicBaseUrl}/generated-documents/${storageKey}?expires=${expiresAt.getTime()}&signature=${signature}`;

    return {
      provider: 'local',
      storageKey,
      signedUrl,
      contentType: 'application/pdf',
      expiresAt,
    };
  }

  private static async storeS3(storageKey: string, _pdf: Buffer, _expiresAt: Date): Promise<StoredDocument> {
    void _pdf;
    void _expiresAt;
    throw new Error(`S3 storage is selected for ${storageKey}, but an S3 SDK adapter has not been configured.`);
  }

  private static async storeBlob(storageKey: string, _pdf: Buffer, _expiresAt: Date): Promise<StoredDocument> {
    void _pdf;
    void _expiresAt;
    throw new Error(`Blob storage is selected for ${storageKey}, but a Blob SDK adapter has not been configured.`);
  }
}
