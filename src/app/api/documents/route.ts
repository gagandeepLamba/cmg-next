import { NextRequest, NextResponse } from 'next/server'
import { Op, QueryTypes } from 'sequelize'
import { DmAdditionalDocuments, DmOpsDocuments } from '@/models'
import { sequelize } from '@/lib/sequelize'
import { verifyToken } from '@/lib/auth'
import { isCeo } from '@/lib/roleChecks'
import { requireAuth, isAuthError } from '@/lib/apiAuth'

export async function GET(request: NextRequest) {
  const auth = requireAuth(request, ['documents.view'])
  if (isAuthError(auth)) return auth
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')
    const search = searchParams.get('search')?.trim() || ''

    const leadFilter = leadId ? 'AND d.leadId = :leadId' : ''
    const searchFilter = search ? "AND (d.purpose LIKE :search OR l.fname LIKE :search OR l.lname LIKE :search)" : ''
    const replacements: Record<string, unknown> = { leadId: leadId ? Number(leadId) : null, search: `%${search}%` }

    const rows = await sequelize.query<any>(`
      SELECT
        d.id, 'additional' AS source, d.leadId, d.document AS file,
        COALESCE(d.purpose, 'Document') AS name, d.purpose AS category,
        d.created, NULL AS status,
        COALESCE(NULLIF(TRIM(CONCAT(COALESCE(l.fname,''), ' ', COALESCE(l.lname,''))), ''), l.email, l.phone) AS client
      FROM dm_additional_documents d
      LEFT JOIN dmc_forum_leads l ON l.id = d.leadId
      WHERE 1=1 ${leadFilter} ${searchFilter}

      UNION ALL

      SELECT
        d.id, 'operations' AS source, d.leadId, d.file,
        COALESCE(d.name, d.doc_type, 'Document') AS name, d.doc_type AS category,
        d.created, d.status,
        COALESCE(NULLIF(TRIM(CONCAT(COALESCE(l.fname,''), ' ', COALESCE(l.lname,''))), ''), l.email, l.phone) AS client
      FROM dm_ops_documents d
      LEFT JOIN dmc_forum_leads l ON l.id = d.leadId
      WHERE 1=1 ${leadFilter} ${searchFilter}

      ORDER BY created DESC
      LIMIT 200
    `, { replacements, type: QueryTypes.SELECT })

    return NextResponse.json({
      documents: rows,
      total: rows.length
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
      || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    const currentUser = token ? verifyToken(token) : null
    if (!currentUser || !isCeo(currentUser)) {
      return NextResponse.json({ error: 'Only the CEO can delete records' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = Number(searchParams.get('id'))
    const source = searchParams.get('source')

    if (!id || !source) {
      return NextResponse.json({ error: 'id and source are required' }, { status: 400 })
    }

    if (source === 'additional') {
      await DmAdditionalDocuments.destroy({ where: { id } })
    } else if (source === 'operations') {
      await DmOpsDocuments.destroy({ where: { id } })
    } else {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request, ['documents.create'])
  if (isAuthError(auth)) return auth
  try {
    const data = await request.json()
    const { documentType, ...documentData } = data

    let document;

    if (documentType === 'additional') {
      const recentDuplicate = await DmAdditionalDocuments.findOne({
        where: {
          leadId: documentData.leadId,
          document: documentData.document,
          created: { [Op.gte]: new Date(Date.now() - 60_000) },
        },
      });
      if (recentDuplicate) {
        return NextResponse.json({ error: 'This document was already uploaded a moment ago.' }, { status: 409 });
      }
      document = await DmAdditionalDocuments.create({
        ...documentData,
        remarks: documentData.remarks || documentData.purpose || 'Uploaded via Documents page',
        created: new Date(),
        created_by: 1 // Should be current user ID
      })
    } else if (documentType === 'operations') {
      const recentDuplicate = await DmOpsDocuments.findOne({
        where: {
          leadId: documentData.leadId,
          file: documentData.file,
          created: { [Op.gte]: new Date(Date.now() - 60_000) },
        },
      });
      if (recentDuplicate) {
        return NextResponse.json({ error: 'This document was already uploaded a moment ago.' }, { status: 409 });
      }
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
