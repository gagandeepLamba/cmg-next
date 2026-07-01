import { NextRequest, NextResponse } from 'next/server';
import { DmcOpportunityDocuments } from '@/models';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get('opportunityId');
    const status = searchParams.get('status');

    let whereClause: any = {};
    
    if (opportunityId) {
      whereClause.opportunityId = opportunityId;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const documents = await DmcOpportunityDocuments.findAll({
      where: whereClause,
      include: [
        {
          association: 'dmcOpportunity',
          attributes: ['id', 'opportunityName', 'estimatedValue', 'currency']
        },
        {
          association: 'uploadedEmployee',
          attributes: ['id', 'name']
        },
        {
          association: 'verifiedEmployee',
          attributes: ['id', 'name']
        }
      ],
      order: [['uploadDate', 'DESC']]
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const opportunityId = Number(formData.get('opportunityId'));
      const category = String(formData.get('category') || 'other');
      const uploadedBy = Number(formData.get('uploadedBy') || 1);

      if (!file || !opportunityId) {
        return NextResponse.json(
          { error: 'file and opportunityId are required' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `${Date.now()}_${safeName}`;
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'opportunity-documents');
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, fileName), buffer);

      const document = await DmcOpportunityDocuments.create({
        opportunityId,
        documentType: category,
        documentName: String(formData.get('documentName') || file.name),
        fileName,
        filePath: `/uploads/opportunity-documents/${fileName}`,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        category,
        status: 'uploaded',
        uploadDate: new Date(),
        required: formData.get('required') === 'true',
        notes: String(formData.get('notes') || ''),
        uploadedBy,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return NextResponse.json(document, { status: 201 });
    }

    const body = await request.json();
    
    const documentData = {
      ...body,
      uploadDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const document = await DmcOpportunityDocuments.create(documentData);

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
