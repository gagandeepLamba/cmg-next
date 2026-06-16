import { NextRequest, NextResponse } from 'next/server';
import { sequelize } from '@/lib/sequelize';
import { findProductAgreementTemplate } from '@/lib/productAgreementTemplates';
import { renderLegacyAgreementFragments, type LegacyAgreementSection } from '@/lib/legacyAgreementTemplates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { opportunityId, agreementData, clientData, templateId } = body;

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: 'Opportunity ID is required' },
        { status: 400 }
      );
    }

    // Get opportunity details with client information
    const [opportunityResult] = await sequelize.query(`
      SELECT o.*, 
             l.fname, l.lname, l.email, l.mobile, l.phone, l.address, l.nationality,
             l.dob, l.id_number, l.id_expiry,
             fe.name as from_employee_name, fe.email as from_employee_email,
             be.name as branch_name, be.address as branch_address
      FROM dmc_opportunities o
      LEFT JOIN dmc_forum_leads l ON o.leadId = l.id
      LEFT JOIN dm_employee fe ON o.assignedTo = fe.id
      LEFT JOIN dm_branch be ON o.branchId = be.id
      WHERE o.id = ?
    `, {
      replacements: [opportunityId]
    });

    if (!opportunityResult || (opportunityResult as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    const opportunity = (opportunityResult as any[])[0];

    const agreementNumber = `AGR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const agreementContent = await generateAgreementContent(opportunity, agreementData, clientData, templateId, agreementNumber);

    // Create agreement record in database
    const [agreementResult] = await sequelize.query(`
      INSERT INTO dm_opportunity_agreements (
        opportunityId, agreementNumber, agreementType, templateId, status,
        title, description, termsAndConditions, totalAmount, currency,
        startDate, endDate, signedDate, clientName, clientEmail, clientPhone,
        companyName, companyAddress, createdBy, uploadedBy, generatedDate,
        content, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, {
      replacements: [
        opportunityId,
        agreementNumber,
        agreementData?.agreementType || 'service_agreement',
        templateId || null,
        'generated',
        agreementData?.title || `Service Agreement - ${opportunity.fname} ${opportunity.lname}`,
        agreementData?.description || `Service agreement for ${opportunity.serviceType}`,
        agreementData?.terms || generateDefaultTerms(opportunity),
        opportunity.estimatedValue || 0,
        opportunity.currency || 'AED',
        agreementData?.startDate || new Date().toISOString().split('T')[0],
        agreementData?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        null, // signedDate
        `${opportunity.fname} ${opportunity.lname}`,
        opportunity.email,
        opportunity.mobile || opportunity.phone,
        clientData?.companyName || '',
        clientData?.companyAddress || opportunity.address,
        opportunity.createdBy || opportunity.assignedTo,
        opportunity.createdBy || opportunity.assignedTo,
        new Date(),
        agreementContent
      ]
    });

    const agreementId = (agreementResult as any).insertId;

    // Update opportunity status
    await sequelize.query(`
      UPDATE dmc_opportunities 
      SET agreementGenerated = true, agreementId = ?, updatedAt = NOW()
      WHERE id = ?
    `, {
      replacements: [agreementId, opportunityId]
    });

    // Return the generated agreement
    return NextResponse.json({
      success: true,
      message: 'Agreement generated successfully',
      data: {
        agreementId,
        agreementNumber,
        content: agreementContent,
        opportunity: {
          id: opportunity.id,
          opportunityNumber: opportunity.opportunityNumber,
          clientName: `${opportunity.fname} ${opportunity.lname}`,
          clientEmail: opportunity.email,
          clientPhone: opportunity.mobile || opportunity.phone,
          serviceType: opportunity.serviceType,
          estimatedValue: opportunity.estimatedValue
        }
      }
    });

  } catch (error: any) {
    console.error('Error generating agreement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate agreement: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get('opportunityId');

    if (!opportunityId) {
      return NextResponse.json(
        { success: false, error: 'Opportunity ID is required' },
        { status: 400 }
      );
    }

    // Get agreement details
    const [agreementResult] = await sequelize.query(`
      SELECT a.*, o.opportunityNumber, o.leadId,
             l.fname, l.lname, l.email, l.mobile, l.phone,
             fe.name as assignedEmployeeName
      FROM dm_opportunity_agreements a
      LEFT JOIN dmc_opportunities o ON a.opportunityId = o.id
      LEFT JOIN dmc_forum_leads l ON o.leadId = l.id
      LEFT JOIN dm_employee fe ON o.assignedTo = fe.id
      WHERE a.opportunityId = ?
      ORDER BY a.createdAt DESC
    `, {
      replacements: [opportunityId]
    });

    if (!agreementResult || (agreementResult as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No agreements found for this opportunity' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: agreementResult
    });

  } catch (error: any) {
    console.error('Error fetching agreement:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agreement: ' + error.message },
      { status: 500 }
    );
  }
}

async function generateAgreementContent(opportunity: any, agreementData: any, clientData: any, templateId: string | null, agreementNumber: string): Promise<string> {
  const currentDate = new Date().toLocaleDateString();
  const companyName = clientData?.companyName || 'Client Company';
  const companyAddress = clientData?.companyAddress || opportunity.address;
  const legacyContent = await generateLegacyAgreementContent(opportunity, agreementData, clientData, agreementNumber, currentDate);

  if (legacyContent) {
    return legacyContent;
  }

  const productTemplate = findProductAgreementTemplate([
    templateId,
    agreementData?.templateId,
    agreementData?.productTemplateId,
    agreementData?.agreementType,
    agreementData?.title,
    agreementData?.description,
    opportunity.serviceType,
    opportunity.serviceRequired,
    opportunity.opportunityName,
    opportunity.description,
  ].filter(Boolean).join(' '));

  if (productTemplate) {
    return generateProductAgreementContent(opportunity, agreementData, clientData, productTemplate, agreementNumber, currentDate);
  }

  const terms = agreementData?.terms || generateDefaultTerms(opportunity);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Agreement - ${opportunity.fname} ${opportunity.lname}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 10px; }
        .subtitle { font-size: 16px; color: #666; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .client-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .client-info h3 { margin-top: 0; color: #333; }
        .signature-section { margin-top: 50px; border-top: 2px solid #333; padding-top: 20px; }
        .signature-line { display: flex; justify-content: space-between; margin-top: 30px; }
        .signature-box { border-bottom: 1px solid #000; width: 200px; height: 50px; margin-bottom: 10px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">SERVICE AGREEMENT</div>
        <div class="subtitle">Agreement Number: ${agreementNumber}</div>
    </div>

    <div class="section">
        <div class="section-title">Parties</div>
        
        <div class="client-info">
            <h3>Client Information</h3>
            <p><strong>Name:</strong> ${opportunity.fname} ${opportunity.lname}</p>
            <p><strong>Email:</strong> ${opportunity.email}</p>
            <p><strong>Phone:</strong> ${opportunity.mobile || opportunity.phone}</p>
            <p><strong>Address:</strong> ${companyAddress}</p>
            <p><strong>Company:</strong> ${companyName}</p>
        </div>

        <div class="client-info">
            <h3>Service Provider</h3>
            <p><strong>Employee:</strong> ${opportunity.assignedEmployeeName || 'Assigned Employee'}</p>
            <p><strong>Branch:</strong> ${opportunity.branch_name || 'Main Branch'}</p>
            <p><strong>Address:</strong> ${opportunity.branch_address || 'Branch Address'}</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Service Details</div>
        <p><strong>Service Type:</strong> ${opportunity.serviceType}</p>
        <p><strong>Description:</strong> ${opportunity.description || 'Professional services as agreed'}</p>
        <p><strong>Estimated Value:</strong> ${opportunity.currency || 'AED'} ${opportunity.estimatedValue?.toLocaleString() || '0'}</p>
        <p><strong>Start Date:</strong> ${agreementData?.startDate || currentDate}</p>
        <p><strong>End Date:</strong> ${agreementData?.endDate || 'One year from start date'}</p>
    </div>

    <div class="section">
        <div class="section-title">Terms and Conditions</div>
        <div style="white-space: pre-wrap;">${terms}</div>
    </div>

    <div class="section">
        <div class="section-title">Payment Terms</div>
        <p><strong>Total Amount:</strong> ${opportunity.currency || 'AED'} ${opportunity.estimatedValue?.toLocaleString() || '0'}</p>
        <p><strong>Payment Method:</strong> ${agreementData?.paymentMethod || 'Bank Transfer'}</p>
        <p><strong>Payment Schedule:</strong> ${agreementData?.paymentSchedule || 'As per agreed schedule'}</p>
    </div>

    <div class="signature-section">
        <div class="section-title">Signatures</div>
        
        <div class="signature-line">
            <div>
                <p><strong>Client Signature:</strong></p>
                <div class="signature-box"></div>
                <p>Name: _________________________</p>
                <p>Date: _________________________</p>
            </div>
            
            <div>
                <p><strong>Provider Signature:</strong></p>
                <div class="signature-box"></div>
                <p>Name: ${opportunity.assignedEmployeeName || '_______________________'}</p>
                <p>Date: _________________________</p>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>This agreement was generated on ${currentDate}</p>
        <p>Agreement Number: ${agreementNumber}</p>
    </div>
</body>
</html>
  `;
}

async function generateLegacyAgreementContent(
  opportunity: any,
  agreementData: any,
  clientData: any,
  agreementNumber: string,
  currentDate: string
): Promise<string | null> {
  const legacyFiles = normalizeLegacyFiles(agreementData);
  if (legacyFiles.length === 0) return null;

  const clientName = `${opportunity.fname || ''} ${opportunity.mname || ''} ${opportunity.lname || ''}`
    .replace(/\s+/g, ' ')
    .trim() || 'Client';
  const agreementDate = new Date();
  const values = {
    agreementNumber,
    feeAgreeDay: String(agreementDate.getDate()).padStart(2, '0'),
    feeAgreeMonth: agreementDate.toLocaleString('en-US', { month: 'long' }),
    feeAgreeYear: String(agreementDate.getFullYear()),
    branchName: opportunity.branch_name || 'DM CONSULTANTS',
    branchAddress: opportunity.branch_address || '',
    clientName,
    clientFirstName: opportunity.fname || '',
    clientMiddleName: opportunity.mname || '',
    clientLastName: opportunity.lname || '',
    clientEmail: opportunity.email || '',
    clientPhone: opportunity.mobile || opportunity.phone || '',
    clientAddress: clientData?.companyAddress || opportunity.address || '',
    serviceType: opportunity.serviceType || opportunity.serviceRequired || '',
    totalAmount: `${opportunity.currency || 'AED'} ${Number(opportunity.estimatedValue || agreementData?.totalAmount || 0).toLocaleString()}`,
  };

  const body = await renderLegacyAgreementFragments(legacyFiles, values);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agreement ${escapeHtml(agreementNumber)} - ${escapeHtml(clientName)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #222; max-width: 900px; margin: 0 auto; padding: 28px; line-height: 1.55; }
    .legacy-header { text-align: center; border-bottom: 2px solid #222; margin-bottom: 22px; padding-bottom: 14px; }
    .legacy-meta { color: #555; font-size: 13px; margin-top: 5px; }
    .row { display: block; margin: 10px 0; }
    .border { border: 1px solid #222; }
    .border-dark { border-color: #222; }
    .my-1 { margin-top: 4px; margin-bottom: 4px; }
    .col-sm-12 { width: 100%; box-sizing: border-box; padding: 8px 12px; }
    .englishtext { padding-left: 18px; }
    .signature-section { margin-top: 46px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .signature-box { border-top: 1px solid #111; padding-top: 8px; min-height: 60px; }
    @media print { body { padding: 0; } .row { break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="legacy-header">
    <h1>Agreement for Services</h1>
    <div class="legacy-meta">Agreement No ${escapeHtml(agreementNumber)} | ${escapeHtml(currentDate)}</div>
  </div>

  ${body}

  <div class="signature-section">
    <div class="signature-box">
      <strong>Client Signature</strong><br>
      Name: ${escapeHtml(clientName)}<br>
      Date:
    </div>
    <div class="signature-box">
      <strong>DM Consultants Signature</strong><br>
      Name:<br>
      Date:
    </div>
  </div>
</body>
</html>
  `;
}

function normalizeLegacyFiles(agreementData: any): Array<{ section: LegacyAgreementSection; relativePath: string }> {
  const files: Array<{ section: LegacyAgreementSection; relativePath: string }> = [];
  const add = (section: LegacyAgreementSection, value: unknown) => {
    if (!value) return;
    const values = Array.isArray(value) ? value : [value];
    values
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .forEach((relativePath) => files.push({ section, relativePath }));
  };

  add('contract', agreementData?.legacyContractFiles || agreementData?.legacyContractFile);
  add('annexureA', agreementData?.legacyAnnexureFiles || agreementData?.legacyAnnexureFile || agreementData?.legacyAnnexureAFiles);

  return files;
}

function generateProductAgreementContent(
  opportunity: any,
  agreementData: any,
  clientData: any,
  productTemplate: NonNullable<ReturnType<typeof findProductAgreementTemplate>>,
  agreementNumber: string,
  currentDate: string
): string {
  const clientName = `${opportunity.fname || ''} ${opportunity.lname || ''}`.trim() || 'Client';
  const clientPhone = opportunity.mobile || opportunity.phone || '';
  const clientAddress = clientData?.companyAddress || opportunity.address || '';
  const agreementDate = new Date();
  const values: Record<string, string> = {
    agreementNumber,
    agreementDate: currentDate,
    agreementDay: String(agreementDate.getDate()).padStart(2, '0'),
    agreementMonth: agreementDate.toLocaleString('en-US', { month: 'long' }),
    agreementYear: String(agreementDate.getFullYear()),
    branchName: opportunity.branch_name || 'DM CONSULTANTS',
    branchAddress: opportunity.branch_address || '',
    clientName,
    clientEmail: opportunity.email || '',
    clientPhone,
    clientAddress,
    serviceType: opportunity.serviceType || opportunity.serviceRequired || productTemplate.name,
    country: opportunity.country_interest || opportunity.country || '',
    totalAmount: `${opportunity.currency || 'AED'} ${Number(opportunity.estimatedValue || agreementData?.totalAmount || 0).toLocaleString()}`,
    startDate: agreementData?.startDate || currentDate,
    endDate: agreementData?.endDate || '',
  };

  const renderedParagraphs = productTemplate.paragraphs
    .map((paragraph) => replaceAgreementVariables(paragraph, values))
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(productTemplate.name)} - ${escapeHtml(clientName)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #222; max-width: 850px; margin: 0 auto; padding: 28px; line-height: 1.55; }
    .header { text-align: center; border-bottom: 2px solid #222; margin-bottom: 24px; padding-bottom: 16px; }
    .title { font-size: 24px; font-weight: 700; text-transform: uppercase; }
    .meta { color: #555; font-size: 13px; margin-top: 6px; }
    .summary { border: 1px solid #d8d8d8; padding: 14px; margin-bottom: 22px; }
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; font-size: 13px; }
    .agreement-body p { margin: 0 0 10px; white-space: pre-wrap; }
    .signature-section { margin-top: 46px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .signature-box { border-top: 1px solid #111; padding-top: 8px; min-height: 60px; }
    @media print { body { padding: 0; } .summary { break-inside: avoid; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Agreement for Services</div>
    <div class="meta">${escapeHtml(productTemplate.name)} | Agreement No ${escapeHtml(agreementNumber)} | ${escapeHtml(currentDate)}</div>
  </div>

  <div class="summary">
    <div class="summary-grid">
      <div><strong>Client:</strong> ${escapeHtml(clientName)}</div>
      <div><strong>Email:</strong> ${escapeHtml(values.clientEmail)}</div>
      <div><strong>Phone:</strong> ${escapeHtml(clientPhone)}</div>
      <div><strong>Service:</strong> ${escapeHtml(values.serviceType)}</div>
      <div><strong>Address:</strong> ${escapeHtml(clientAddress)}</div>
      <div><strong>Amount:</strong> ${escapeHtml(values.totalAmount)}</div>
    </div>
  </div>

  <div class="agreement-body">
    ${renderedParagraphs}
  </div>

  <div class="signature-section">
    <div class="signature-box">
      <strong>Client Signature</strong><br>
      Name: ${escapeHtml(clientName)}<br>
      Date:
    </div>
    <div class="signature-box">
      <strong>DM Consultants Signature</strong><br>
      Name:<br>
      Date:
    </div>
  </div>
</body>
</html>
  `;
}

function replaceAgreementVariables(text: string, values: Record<string, string>): string {
  return text.replace(/{{(agreementNumber|agreementDate|agreementDay|agreementMonth|agreementYear|branchName|branchAddress|clientName|clientEmail|clientPhone|clientAddress|serviceType|country|totalAmount|startDate|endDate)}}/g, (_, key) => values[key] || '');
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateDefaultTerms(opportunity: any): string {
  return `
1. SERVICE PROVISION
   The Service Provider agrees to provide ${opportunity.serviceType} services to the Client as specified in this agreement.

2. CLIENT OBLIGATIONS
   The Client agrees to:
   - Provide all necessary information and documentation required for the services
   - Make timely payments as agreed
   - Cooperate with the Service Provider throughout the process
   - Maintain confidentiality of all information shared

3. SERVICE PROVIDER OBLIGATIONS
   The Service Provider agrees to:
   - Provide professional and timely services
   - Maintain confidentiality of client information
   - Keep the client informed of progress
   - Deliver services as per agreed standards

4. PAYMENT TERMS
   - Total Amount: ${opportunity.currency || 'AED'} ${opportunity.estimatedValue?.toLocaleString() || '0'}
   - Payment Method: Bank Transfer
   - Payment Schedule: As per agreed schedule
   - Late payments may incur additional charges

5. TERM AND TERMINATION
   - This agreement is valid for the duration specified
   - Either party may terminate with 30 days written notice
   - Termination does not affect obligations accrued prior to termination

6. CONFIDENTIALITY
   - Both parties agree to maintain confidentiality of all information
   - Information shared during the service provision is protected
   - This obligation survives the termination of this agreement

7. GOVERNING LAW
   - This agreement shall be governed by the laws of United Arab Emirates
   - Any disputes shall be resolved through mutual discussion or legal means

8. ENTIRE AGREEMENT
   - This document constitutes the entire agreement between the parties
   - No modifications or amendments shall be valid unless in writing and signed by both parties
   - Both parties acknowledge having read, understood, and agreed to the terms contained herein
  `.trim();
}
