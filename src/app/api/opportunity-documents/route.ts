import { NextRequest, NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { DmcOpportunityDocuments } from '@/models';
import { put } from '@vercel/blob';
import { requireAuth, isAuthError } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request, ['documents.view']);
    if (isAuthError(auth)) return auth;

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
    const auth = requireAuth(request, ['documents.create']);
    if (isAuthError(auth)) return auth;

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

      // Duplicate-submission guard: block re-uploading the same category for
      // this opportunity within the last minute, before spending time on the
      // blob upload itself.
      const recentUpload = await DmcOpportunityDocuments.findOne({
        where: {
          opportunityId,
          category,
          uploadDate: { [Op.gte]: new Date(Date.now() - 60_000) },
        },
      });
      if (recentUpload) {
        return NextResponse.json({ error: 'This document was already uploaded a moment ago.' }, { status: 409 });
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `${Date.now()}_${safeName}`;

      // Serverless functions (Vercel) have a read-only filesystem, so documents
      // are stored in Vercel Blob rather than written to local disk. The returned
      // `blob.url` is a permanent, publicly-fetchable HTTPS URL — that's what
      // gets saved as filePath instead of a local /uploads/... path.
      const blob = await put(`opportunity-documents/${opportunityId}/${fileName}`, file, {
        access: 'public',
        addRandomSuffix: true,
      });

      const document = await DmcOpportunityDocuments.create({
        opportunityId,
        documentType: category,
        documentName: String(formData.get('documentName') || file.name),
        fileName,
        filePath: blob.url,
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
