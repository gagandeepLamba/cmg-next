// Shared AG/RC document numbering: {PREFIX}/{BRANCH}/{PRODUCT}/{DDMMYYYY}/{SEQ}
// e.g. AG/QTR/CAN/15072026/001 for an agreement, RC/QTR/CAN/15072026/001 for a receipt.
// The sequence is the row's own DB auto-increment id, zero-padded to 3 digits —
// genuinely unique and never needs its own counter table.

const BRANCH_CODES: Array<{ code: string; test: (geo: string) => boolean }> = [
  { code: 'DXB', test: (geo) => /dubai/.test(geo) && !/abu\s*dhabi/.test(geo) },
  { code: 'AUH', test: (geo) => /abu\s*dhabi/.test(geo) },
  { code: 'QTR', test: (geo) => /qatar|doha/.test(geo) },
  { code: 'KWT', test: (geo) => /kuwait/.test(geo) },
  { code: 'IND', test: (geo) => /india|hyderabad/.test(geo) },
];

// Falls back to the first 3 letters of the branch name (e.g. an unlisted
// branch called "Muscat" becomes "MUS") rather than guessing at one of the
// five known codes above.
export function getBranchCode(branchName: string | null | undefined, branchAddress: string | null | undefined = ''): string {
  const geo = `${branchName || ''} ${branchAddress || ''}`.toLowerCase();
  const known = BRANCH_CODES.find(({ test }) => test(geo));
  if (known) return known.code;

  const letters = String(branchName || '').replace(/[^a-zA-Z]/g, '').toUpperCase();
  return (letters.slice(0, 3) || 'GEN').padEnd(3, 'X');
}

// First 3 letters of the product/service/program name, e.g. "Canada Skilled
// Migration" -> "CAN". Falls back to "GEN" (generic) when no name is given.
export function getProductCode(productName: string | null | undefined): string {
  const letters = String(productName || '').replace(/[^a-zA-Z]/g, '').toUpperCase();
  return (letters.slice(0, 3) || 'GEN').padEnd(3, 'X');
}

function formatDateDdMmYyyy(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}${mm}${yyyy}`;
}

// `sequenceId` should be the row's own auto-increment id (assigned after
// insert) so every number is guaranteed unique without a separate counter.
export function formatDocumentNumber(params: {
  prefix: 'AG' | 'RC';
  branchName: string | null | undefined;
  branchAddress?: string | null | undefined;
  product: string | null | undefined;
  date?: Date;
  sequenceId: number;
}): string {
  const branchCode = getBranchCode(params.branchName, params.branchAddress);
  const productCode = getProductCode(params.product);
  const dateStr = formatDateDdMmYyyy(params.date || new Date());
  const seq = String(params.sequenceId).padStart(3, '0');
  return `${params.prefix}/${branchCode}/${productCode}/${dateStr}/${seq}`;
}
