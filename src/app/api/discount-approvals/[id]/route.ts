import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: discountId } = await params;

    if (!discountId) {
      return NextResponse.json(
        { success: false, error: 'Discount approval ID is required' },
        { status: 400 }
      );
    }

    const [discountResult] = await sequelize.query(`
      SELECT 
        da.*,
        l.fname, l.lname, l.email, l.mobile,
        o.opportunityName, o.estimatedValue, o.currency,
        e_req.name as requestedEmployeeName,
        e_app.name as approvedEmployeeName,
        e_req.name as createdEmployeeName
      FROM dm_discount_approvals da
      LEFT JOIN dmc_forum_leads l ON da.leadId = l.id
      LEFT JOIN dmc_opportunities o ON da.opportunityId = o.id
      LEFT JOIN dm_employee e_req ON da.requestedBy = e_req.id
      LEFT JOIN dm_employee e_app ON da.approvedBy = e_app.id
      WHERE da.id = ?
    `, {
      replacements: [discountId]
    });

    if (!discountResult || (discountResult as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Discount approval not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: (discountResult as any[])[0]
    });

  } catch (error: any) {
    console.error('Error fetching discount approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch discount approval: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: discountId } = await params;
    const body = await request.json();

    if (!discountId) {
      return NextResponse.json(
        { success: false, error: 'Discount approval ID is required' },
        { status: 400 }
      );
    }

    const [existingResult] = await sequelize.query(`
      SELECT id FROM dm_discount_approvals WHERE id = ?
    `, {
      replacements: [discountId]
    });

    if (!existingResult || (existingResult as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Discount approval not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (['approved', 'rejected'].includes(body.status)) {
      const allowedRoles = ['director_of_sales', 'branch_manager'];
      if (!allowedRoles.includes(body.approverRole)) {
        return NextResponse.json(
          { success: false, error: 'Only Director of Sales or Branch Manager can approve or reject discounts' },
          { status: 403 }
        );
      }
    }

    // Add approval timestamps based on status
    if (body.status === 'approved') {
      updateData.approvedAt = new Date();
      if (body.approvedBy) {
        updateData.approvedBy = body.approvedBy;
      }
    } else if (body.status === 'rejected') {
      updateData.rejectedDate = new Date();
    }

    // Update other fields
    if (body.status) updateData.status = body.status;
    if (body.approvedBy) updateData.approvedBy = body.approvedBy;
    if (body.approvedAt) updateData.approvedAt = new Date(body.approvedAt);
    if (body.rejectedDate) updateData.rejectedDate = new Date(body.rejectedDate);

    await sequelize.query(`
      UPDATE dm_discount_approvals 
      SET ${Object.keys(updateData).map(key => `${key} = ?`).join(', ')}
      WHERE id = ?
    `, {
      replacements: [...Object.values(updateData), discountId]
    });

    return NextResponse.json({
      success: true,
      message: 'Discount approval updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating discount approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update discount approval: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: discountId } = await params;

    if (!discountId) {
      return NextResponse.json(
        { success: false, error: 'Discount approval ID is required' },
        { status: 400 }
      );
    }

    const [existingResult] = await sequelize.query(`
      SELECT id FROM dm_discount_approvals WHERE id = ?
    `, {
      replacements: [discountId]
    });

    if (!existingResult || (existingResult as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Discount approval not found' },
        { status: 404 }
      );
    }

    await sequelize.query(`DELETE FROM dm_discount_approvals WHERE id = ?`, {
      replacements: [discountId]
    });

    return NextResponse.json({
      success: true,
      message: 'Discount approval deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting discount approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete discount approval: ' + error.message },
      { status: 500 }
    );
  }
}
