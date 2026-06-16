import { NextRequest, NextResponse } from 'next/server'
import { DmAdditionalDocuments, DmOpsDocuments } from '@/models'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const leadId = searchParams.get('leadId')
    const documentType = searchParams.get('documentType')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (leadId) {
      where.leadId = parseInt(leadId)
    }

    if (documentType) {
      where.doc_type = documentType
    }

    if (status !== null) {
      where.status = parseInt(status)
    }

    // Get both additional documents and operations documents
    const [additionalDocs, opsDocs] = await Promise.all([
      DmAdditionalDocuments.findAll({
        where,
        offset: skip,
        limit: limit,
        order: [['created', 'DESC']]
      }),
      DmOpsDocuments.findAll({
        where,
        attributes: ['id', 'opsId', 'doc_type', 'doc_uploaded_for', 'leadId', 'tab', 'name', 'file', 'created', 'status', 'remarks', 'download_file'],
        offset: skip,
        limit: limit,
        order: [['created', 'DESC']]
      })
    ])

    return NextResponse.json({
      additionalDocuments: additionalDocs,
      operationsDocuments: opsDocs,
      total: additionalDocs.length + opsDocs.length
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { documentType, ...documentData } = data

    let document;

    if (documentType === 'additional') {
      document = await DmAdditionalDocuments.create({
        ...documentData,
        created: new Date(),
        created_by: 1 // Should be current user ID
      })
    } else if (documentType === 'operations') {
      document = await DmOpsDocuments.create({
        ...documentData,
        created: new Date(),
        created_by: 1, // Should be current user ID
        status: documentData.status || 0
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      )
    }

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error uploading document:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
