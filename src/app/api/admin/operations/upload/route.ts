import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { apiError, invalidRequest } from '@/lib/apiError';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const operationsModule = String(formData.get('module') || '').replace(/[^a-z0-9-]/gi, '');
    const leadId = String(formData.get('leadId') || '').replace(/\D/g, '');

    if (!(file instanceof File) || !operationsModule || !leadId) {
      return invalidRequest('A file, module, and leadId are required');
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: 'Files must be 20 MB or smaller' }, { status: 413 });
    }

    const extension = path.extname(file.name).replace(/[^.a-z0-9]/gi, '').slice(0, 12);
    const fileName = `${randomUUID()}${extension}`;
    const relativeDirectory = path.join('uploads', 'operations', operationsModule, leadId);
    const directory = path.join(process.cwd(), 'public', relativeDirectory);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, fileName), Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: `/${relativeDirectory.replace(/\\/g, '/')}/${fileName}`,
      },
    });
  } catch (error: unknown) {
    return apiError(error, 'Unable to upload file');
  }
}
