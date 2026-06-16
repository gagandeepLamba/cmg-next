import path from 'path';
import { promises as fs } from 'fs';

export type LegacyAgreementSection = 'contract' | 'annexureA' | 'annexureB';

export interface LegacyAgreementTemplateFile {
  section: LegacyAgreementSection;
  fileName: string;
  relativePath: string;
  size: number;
  modifiedAt: string;
}

const legacyRoots: Record<LegacyAgreementSection, string> = {
  contract: 'D:\\xampp\\htdocs\\dm\\en_contract',
  annexureA: 'D:\\xampp\\htdocs\\dm\\en_annexure_a',
  annexureB: 'D:\\xampp\\htdocs\\dm\\en_annexure_b',
};

function getLegacyRoot(section: LegacyAgreementSection): string {
  return legacyRoots[section];
}

function assertSafeLegacyPath(section: LegacyAgreementSection, relativePath: string): string {
  const root = path.resolve(getLegacyRoot(section));
  const resolved = path.resolve(root, relativePath);

  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error('Invalid legacy template path');
  }

  return resolved;
}

export async function listLegacyAgreementTemplates(section?: LegacyAgreementSection): Promise<LegacyAgreementTemplateFile[]> {
  const sections = section ? [section] : (Object.keys(legacyRoots) as LegacyAgreementSection[]);
  const results: LegacyAgreementTemplateFile[] = [];

  for (const currentSection of sections) {
    const root = getLegacyRoot(currentSection);
    let entries: Array<{ name: string; isFile: () => boolean }>;

    try {
      entries = await fs.readdir(root, { withFileTypes: true });
    } catch (error: any) {
      if (error?.code === 'ENOENT') continue;
      throw error;
    }

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.php')) continue;
      const fullPath = assertSafeLegacyPath(currentSection, entry.name);
      const stat = await fs.stat(fullPath);
      results.push({
        section: currentSection,
        fileName: entry.name,
        relativePath: entry.name,
        size: stat.size,
        modifiedAt: stat.mtime.toISOString(),
      });
    }
  }

  return results.sort((a, b) => `${a.section}:${a.fileName}`.localeCompare(`${b.section}:${b.fileName}`));
}

export async function readLegacyAgreementTemplate(section: LegacyAgreementSection, relativePath: string): Promise<string> {
  const safePath = assertSafeLegacyPath(section, relativePath);
  return fs.readFile(safePath, 'utf8');
}

export async function renderLegacyAgreementFragments(
  files: Array<{ section: LegacyAgreementSection; relativePath: string }>,
  values: Record<string, string>
): Promise<string> {
  const fragments = await Promise.all(
    files.map(async (file) => {
      const raw = await readLegacyAgreementTemplate(file.section, file.relativePath);
      return sanitizeLegacyPhpFragment(raw, values);
    })
  );

  return fragments.join('\n');
}

function sanitizeLegacyPhpFragment(raw: string, values: Record<string, string>): string {
  return raw
    .replace(/<\?=\s*\$feeAgreeDay\s*\?>/g, values.feeAgreeDay || '')
    .replace(/<\?=\s*\$feeAgreeMonth\s*\?>/g, values.feeAgreeMonth || '')
    .replace(/<\?=\s*\$feeAgreeYear\s*\?>/g, values.feeAgreeYear || '')
    .replace(/<\?=\s*\$b_name\s*\?>/g, values.branchName || 'DM CONSULTANTS')
    .replace(/<\?=\s*\$b_address\s*\?>/g, values.branchAddress || '')
    .replace(/<\?=\s*\$c_address\s*\?>/g, values.clientAddress || '')
    .replace(/<\?php\s+echo\s+ucwords\(strtolower\(\$lead1\['fname'\]\.\" \".\(\$lead1\['mname'\]!=\"\"\?\" \".\$lead1\['mname'\]:\"\"\).\$lead1\['lname'\]\s*\)\);\s*\?>/g, values.clientName || '')
    .replace(/<\?(?:php|=)[\s\S]*?\?>/g, '')
    .replace(/\$lead1\[['"]fname['"]\]/g, values.clientFirstName || '')
    .replace(/\$lead1\[['"]mname['"]\]/g, values.clientMiddleName || '')
    .replace(/\$lead1\[['"]lname['"]\]/g, values.clientLastName || '');
}
