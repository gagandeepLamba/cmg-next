import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type PageCountingPdf = jsPDF & { getNumberOfPages: () => number };

export interface AgreementProduct {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  sku?: string;
  discount?: number;
  tax?: number;
  specifications?: Record<string, unknown>;
}

export interface AgreementPricing {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  taxRate: number;
  discountRate: number;
  paymentTerms: string;
  depositRequired?: number;
  depositAmount?: number;
  installments?: {
    count: number;
    amount: number;
    frequency: string;
    dueDates: string[];
  };
}

export interface AgreementParty {
  name: string;
  type: 'client' | 'company';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  contactPerson?: string;
  taxId?: string;
  registrationNumber?: string;
}

export interface AgreementTerms {
  effectiveDate: Date;
  expiryDate?: Date;
  duration?: string;
  renewalTerms?: string;
  terminationClause: string;
  paymentTerms: string;
  deliveryTerms: string;
  warrantyTerms: string;
  liabilityClause: string;
  confidentialityClause: string;
  governingLaw: string;
  disputeResolution: string;
  specialConditions?: string[];
}

export interface AgreementTemplate {
  id: string;
  name: string;
  description: string;
  category: 'service' | 'product' | 'consulting' | 'subscription' | 'custom';
  template: string;
  variables: string[];
  defaultTerms: Partial<AgreementTerms>;
  isDefault: boolean;
}

export interface Agreement {
  id: string;
  templateId: string;
  templateName: string;
  title: string;
  description: string;
  status: 'draft' | 'pending' | 'signed' | 'expired' | 'cancelled';
  version: number;
  client: AgreementParty;
  company: AgreementParty;
  products: AgreementProduct[];
  pricing: AgreementPricing;
  terms: AgreementTerms;
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    signedAt?: Date;
    signedBy?: string;
    approvedBy?: string;
    approvedAt?: Date;
  };
  customFields?: Record<string, unknown>;
  attachments?: string[];
  notes?: string;
}

export class AgreementGenerator {
  private templates: AgreementTemplate[];
  private agreements: Agreement[];

  constructor() {
    this.templates = [];
    this.agreements = [];
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates(): void {
    this.templates = [
      {
        id: 'service-agreement',
        name: 'Service Agreement',
        description: 'Standard service agreement template',
        category: 'service',
        template: `
<h1>SERVICE AGREEMENT</h1>

<div class="agreement-header">
  <div class="party-section">
    <h3>Service Provider</h3>
    <p><strong>{{company.name}}</strong></p>
    <p>{{company.address}}</p>
    <p>{{company.city}}, {{company.state}} {{company.zipCode}}</p>
    <p>{{company.country}}</p>
    <p>Phone: {{company.phone}}</p>
    <p>Email: {{company.email}}</p>
  </div>
  
  <div class="party-section">
    <h3>Client</h3>
    <p><strong>{{client.name}}</strong></p>
    <p>{{client.address}}</p>
    <p>{{client.city}}, {{client.state}} {{client.zipCode}}</p>
    <p>{{client.country}}</p>
    <p>Phone: {{client.phone}}</p>
    <p>Email: {{client.email}}</p>
  </div>
</div>

<div class="agreement-details">
  <h2>Agreement Details</h2>
  <p><strong>Agreement Number:</strong> {{agreement.id}}</p>
  <p><strong>Date:</strong> {{agreement.date}}</p>
  <p><strong>Effective Date:</strong> {{terms.effectiveDate}}</p>
  <p><strong>Duration:</strong> {{terms.duration}}</p>
</div>

<div class="products-section">
  <h2>Products and Services</h2>
  <table class="products-table">
    <thead>
      <tr>
        <th>Product/Service</th>
        <th>Description</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{#each products}}
      <tr>
        <td>{{name}}</td>
        <td>{{description}}</td>
        <td>{{quantity}}</td>
        <td>{{currency}} {{unitPrice}}</td>
        <td>{{currency}} {{totalPrice}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</div>

<div class="pricing-section">
  <h2>Pricing</h2>
  <table class="pricing-table">
    <tr>
      <td>Subtotal:</td>
      <td>{{currency}} {{pricing.subtotal}}</td>
    </tr>
    <tr>
      <td>Discount ({{pricing.discountRate}}%):</td>
      <td>-{{currency}} {{pricing.discount}}</td>
    </tr>
    <tr>
      <td>Tax ({{pricing.taxRate}}%):</td>
      <td>{{currency}} {{pricing.tax}}</td>
    </tr>
    <tr class="total-row">
      <td><strong>Total:</strong></td>
      <td><strong>{{currency}} {{pricing.total}}</strong></td>
    </tr>
  </table>
</div>

<div class="terms-section">
  <h2>Terms and Conditions</h2>
  
  <h3>Payment Terms</h3>
  <p>{{terms.paymentTerms}}</p>
  
  <h3>Delivery Terms</h3>
  <p>{{terms.deliveryTerms}}</p>
  
  <h3>Warranty Terms</h3>
  <p>{{terms.warrantyTerms}}</p>
  
  <h3>Termination Clause</h3>
  <p>{{terms.terminationClause}}</p>
  
  <h3>Liability Clause</h3>
  <p>{{terms.liabilityClause}}</p>
  
  <h3>Confidentiality</h3>
  <p>{{terms.confidentialityClause}}</p>
  
  <h3>Governing Law</h3>
  <p>{{terms.governingLaw}}</p>
  
  <h3>Dispute Resolution</h3>
  <p>{{terms.disputeResolution}}</p>
</div>

{{#if terms.specialConditions}}
<div class="special-conditions">
  <h2>Special Conditions</h2>
  <ul>
    {{#each terms.specialConditions}}
    <li>{{this}}</li>
    {{/each}}
  </ul>
</div>
{{/if}}

<div class="signatures">
  <h2>Signatures</h2>
  
  <div class="signature-section">
    <h4>Service Provider</h4>
    <div class="signature-line">
      <p>_________________________</p>
      <p>Name: {{company.contactPerson}}</p>
      <p>Title: Authorized Representative</p>
      <p>Date: _________________</p>
    </div>
  </div>
  
  <div class="signature-section">
    <h4>Client</h4>
    <div class="signature-line">
      <p>_________________________</p>
      <p>Name: {{client.contactPerson}}</p>
      <p>Title: Authorized Representative</p>
      <p>Date: _________________</p>
    </div>
  </div>
</div>
        `,
        variables: [
          'company.name', 'company.address', 'company.city', 'company.state', 'company.zipCode',
          'client.name', 'client.address', 'client.city', 'client.state', 'client.zipCode',
          'agreement.id', 'agreement.date', 'terms.effectiveDate', 'terms.duration',
          'products', 'pricing.subtotal', 'pricing.discount', 'pricing.tax', 'pricing.total',
          'terms.paymentTerms', 'terms.deliveryTerms', 'terms.warrantyTerms',
          'terms.terminationClause', 'terms.liabilityClause', 'terms.confidentialityClause',
          'terms.governingLaw', 'terms.disputeResolution', 'terms.specialConditions'
        ],
        defaultTerms: {
          paymentTerms: 'Payment is due within 30 days of invoice date. Late payments are subject to a 1.5% monthly interest charge.',
          deliveryTerms: 'Products will be delivered within 14 business days of order confirmation.',
          warrantyTerms: 'All products come with a standard 12-month warranty against manufacturing defects.',
          terminationClause: 'Either party may terminate this agreement with 30 days written notice.',
          liabilityClause: 'Our liability is limited to the value of the products/services provided.',
          confidentialityClause: 'Both parties agree to maintain confidentiality of all business information.',
          governingLaw: 'This agreement is governed by the laws of the jurisdiction.',
          disputeResolution: 'Disputes will be resolved through arbitration in accordance with local laws.'
        },
        isDefault: true
      },
      {
        id: 'product-sale',
        name: 'Product Sale Agreement',
        description: 'Product sale agreement template',
        category: 'product',
        template: `
<h1>PRODUCT SALE AGREEMENT</h1>

<div class="agreement-header">
  <div class="party-section">
    <h3>Seller</h3>
    <p><strong>{{company.name}}</strong></p>
    <p>{{company.address}}</p>
    <p>{{company.city}}, {{company.state}} {{company.zipCode}}</p>
    <p>{{company.country}}</p>
    <p>Phone: {{company.phone}}</p>
    <p>Email: {{company.email}}</p>
  </div>
  
  <div class="party-section">
    <h3>Buyer</h3>
    <p><strong>{{client.name}}</strong></p>
    <p>{{client.address}}</p>
    <p>{{client.city}}, {{client.state}} {{client.zipCode}}</p>
    <p>{{client.country}}</p>
    <p>Phone: {{client.phone}}</p>
    <p>Email: {{client.email}}</p>
  </div>
</div>

<div class="agreement-details">
  <h2>Sale Details</h2>
  <p><strong>Agreement Number:</strong> {{agreement.id}}</p>
  <p><strong>Date:</strong> {{agreement.date}}</p>
  <p><strong>Sale Date:</strong> {{terms.effectiveDate}}</p>
</div>

<div class="products-section">
  <h2>Products</h2>
  <table class="products-table">
    <thead>
      <tr>
        <th>Product</th>
        <th>Description</th>
        <th>SKU</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {{#each products}}
      <tr>
        <td>{{name}}</td>
        <td>{{description}}</td>
        <td>{{sku}}</td>
        <td>{{quantity}}</td>
        <td>{{currency}} {{unitPrice}}</td>
        <td>{{currency}} {{totalPrice}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
</div>

<div class="pricing-section">
  <h2>Pricing</h2>
  <table class="pricing-table">
    <tr>
      <td>Subtotal:</td>
      <td>{{currency}} {{pricing.subtotal}}</td>
    </tr>
    <tr>
      <td>Discount ({{pricing.discountRate}}%):</td>
      <td>-{{currency}} {{pricing.discount}}</td>
    </tr>
    <tr>
      <td>Tax ({{pricing.taxRate}}%):</td>
      <td>{{currency}} {{pricing.tax}}</td>
    </tr>
    <tr class="total-row">
      <td><strong>Total Amount:</strong></td>
      <td><strong>{{currency}} {{pricing.total}}</strong></td>
    </tr>
  </table>
  
  {{#if pricing.depositRequired}}
  <div class="deposit-info">
    <h4>Deposit Information</h4>
    <p>Deposit Required: {{currency}} {{pricing.depositAmount}}</p>
    <p>Balance Due: {{currency}} {{pricing.total}}</p>
  </div>
  {{/if}}
</div>

<div class="terms-section">
  <h2>Sale Terms</h2>
  
  <h3>Payment Terms</h3>
  <p>{{terms.paymentTerms}}</p>
  
  <h3>Delivery Terms</h3>
  <p>{{terms.deliveryTerms}}</p>
  
  <h3>Warranty Terms</h3>
  <p>{{terms.warrantyTerms}}</p>
  
  <h3>Return Policy</h3>
  <p>{{terms.terminationClause}}</p>
  
  <h3>Limitation of Liability</h3>
  <p>{{terms.liabilityClause}}</p>
  
  <h3>Governing Law</h3>
  <p>{{terms.governingLaw}}</p>
</div>

<div class="signatures">
  <h2>Signatures</h2>
  
  <div class="signature-section">
    <h4>Seller</h4>
    <div class="signature-line">
      <p>_________________________</p>
      <p>Name: {{company.contactPerson}}</p>
      <p>Title: Authorized Representative</p>
      <p>Date: _________________</p>
    </div>
  </div>
  
  <div class="signature-section">
    <h4>Buyer</h4>
    <div class="signature-line">
      <p>_________________________</p>
      <p>Name: {{client.contactPerson}}</p>
      <p>Title: Authorized Representative</p>
      <p>Date: _________________</p>
    </div>
  </div>
</div>
        `,
        variables: [
          'company.name', 'company.address', 'company.city', 'company.state', 'company.zipCode',
          'client.name', 'client.address', 'client.city', 'client.state', 'client.zipCode',
          'agreement.id', 'agreement.date', 'terms.effectiveDate',
          'products', 'pricing.subtotal', 'pricing.discount', 'pricing.tax', 'pricing.total',
          'pricing.depositRequired', 'pricing.depositAmount',
          'terms.paymentTerms', 'terms.deliveryTerms', 'terms.warrantyTerms',
          'terms.terminationClause', 'terms.liabilityClause', 'terms.governingLaw'
        ],
        defaultTerms: {
          paymentTerms: 'Full payment is required at the time of purchase. We accept cash, credit cards, and bank transfers.',
          deliveryTerms: 'Products will be delivered within 7 business days of payment confirmation.',
          warrantyTerms: 'All products come with a manufacturer warranty as specified in the product documentation.',
          terminationClause: 'Returns are accepted within 14 days of delivery in original packaging. A 15% restocking fee may apply.',
          liabilityClause: 'Our liability is limited to the purchase price of the product.',
          governingLaw: 'This sale agreement is governed by the laws of the jurisdiction.'
        },
        isDefault: false
      }
    ];
  }

  public generateAgreement(
    templateId: string,
    data: {
      title: string;
      description: string;
      client: AgreementParty;
      products: AgreementProduct[];
      pricing: AgreementPricing;
      terms: AgreementTerms;
      customFields?: Record<string, unknown>;
    }
  ): Agreement {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    const agreement: Agreement = {
      id: `AGR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      templateId,
      templateName: template.name,
      title: data.title,
      description: data.description,
      status: 'draft',
      version: 1,
      client: data.client,
      company: this.getCompanyInfo(),
      products: data.products,
      pricing: data.pricing,
      terms: {
        ...template.defaultTerms,
        ...data.terms
      },
      metadata: {
        createdBy: 'system',
        createdAt: new Date()
      },
      customFields: data.customFields
    };

    this.agreements.push(agreement);
    return agreement;
  }

  public async generatePDF(agreementId: string, options?: {
    format?: 'A4' | 'Letter';
    orientation?: 'portrait' | 'landscape';
    includeWatermark?: boolean;
    includeSignature?: boolean;
  }): Promise<Blob> {
    const agreement = this.agreements.find(a => a.id === agreementId);
    if (!agreement) {
      throw new Error(`Agreement with ID ${agreementId} not found`);
    }

    const template = this.templates.find(t => t.id === agreement.templateId);
    if (!template) {
      throw new Error(`Template with ID ${agreement.templateId} not found`);
    }

    // Generate HTML content
    const htmlContent = this.renderTemplate(template, agreement);
    
    // Create temporary DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = options?.format === 'A4' ? '210mm' : '8.5in';
    tempDiv.style.padding = '20mm';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    tempDiv.style.fontSize = '12px';
    tempDiv.style.lineHeight = '1.4';
    tempDiv.style.color = '#333';
    document.body.appendChild(tempDiv);

    try {
      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: options?.orientation || 'portrait',
        unit: 'mm',
        format: options?.format || 'A4'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth() - 40; // 20mm margins each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 20; // 20mm top margin

      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight() - 40; // 20mm margins each side

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 20;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight() - 40;
      }

      // Add watermark if requested
      if (options?.includeWatermark) {
        const pageCount = (pdf as PageCountingPdf).getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setTextColor(200, 200, 200);
          pdf.setFontSize(50);
          pdf.text('DRAFT', pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() / 2, {
            align: 'center',
            angle: 45
          });
        }
      }

      return pdf.output('blob');
    } finally {
      document.body.removeChild(tempDiv);
    }
  }

  private renderTemplate(template: AgreementTemplate, agreement: Agreement): string {
    let html = template.template;

    // Replace simple variables
    const variables = {
      'agreement.id': agreement.id,
      'agreement.date': new Date().toLocaleDateString(),
      'company.name': agreement.company.name,
      'company.address': agreement.company.address,
      'company.city': agreement.company.city,
      'company.state': agreement.company.state,
      'company.zipCode': agreement.company.zipCode,
      'company.country': agreement.company.country,
      'company.phone': agreement.company.phone,
      'company.email': agreement.company.email,
      'company.contactPerson': agreement.company.contactPerson || 'N/A',
      'client.name': agreement.client.name,
      'client.address': agreement.client.address,
      'client.city': agreement.client.city,
      'client.state': agreement.client.state,
      'client.zipCode': agreement.client.zipCode,
      'client.country': agreement.client.country,
      'client.phone': agreement.client.phone,
      'client.email': agreement.client.email,
      'client.contactPerson': agreement.client.contactPerson || 'N/A',
      'terms.effectiveDate': agreement.terms.effectiveDate.toLocaleDateString(),
      'terms.duration': agreement.terms.duration || 'N/A',
      'terms.paymentTerms': agreement.terms.paymentTerms,
      'terms.deliveryTerms': agreement.terms.deliveryTerms,
      'terms.warrantyTerms': agreement.terms.warrantyTerms,
      'terms.terminationClause': agreement.terms.terminationClause,
      'terms.liabilityClause': agreement.terms.liabilityClause,
      'terms.confidentialityClause': agreement.terms.confidentialityClause,
      'terms.governingLaw': agreement.terms.governingLaw,
      'terms.disputeResolution': agreement.terms.disputeResolution,
      'pricing.subtotal': agreement.pricing.subtotal.toFixed(2),
      'pricing.discount': agreement.pricing.discount.toFixed(2),
      'pricing.tax': agreement.pricing.tax.toFixed(2),
      'pricing.total': agreement.pricing.total.toFixed(2),
      'pricing.discountRate': agreement.pricing.discountRate.toFixed(1),
      'pricing.taxRate': agreement.pricing.taxRate.toFixed(1),
      'pricing.currency': agreement.pricing.currency,
      'pricing.depositRequired': agreement.pricing.depositRequired ? 'true' : 'false',
      'pricing.depositAmount': agreement.pricing.depositAmount?.toFixed(2) || '0.00'
    };

    // Replace variables
    Object.keys(variables).forEach(key => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(variables[key as keyof typeof variables]));
    });

    // Handle product table
    if (html.includes('{{#each products}}')) {
      const productsHtml = agreement.products.map(product => `
        <tr>
          <td>${product.name}</td>
          <td>${product.description}</td>
          <td>${product.sku || ''}</td>
          <td>${product.quantity}</td>
          <td>${agreement.pricing.currency} ${product.unitPrice.toFixed(2)}</td>
          <td>${agreement.pricing.currency} ${product.totalPrice.toFixed(2)}</td>
        </tr>
      `).join('');
      
      html = html.replace(/{{#each products}}[\s\S]*?{{\/each}}/g, productsHtml);
    }

    // Handle special conditions
    if (agreement.terms.specialConditions && agreement.terms.specialConditions.length > 0) {
      const conditionsHtml = agreement.terms.specialConditions.map(condition => 
        `<li>${condition}</li>`
      ).join('');
      
      html = html.replace(/{{#if terms.specialConditions}}[\s\S]*?{{\/if}}/g, conditionsHtml);
    } else {
      html = html.replace(/{{#if terms.specialConditions}}[\s\S]*?{{\/if}}/g, '');
    }

    // Handle deposit information
    if (agreement.pricing.depositRequired) {
      // Keep deposit section
    } else {
      html = html.replace(/{{#if pricing.depositRequired}}[\s\S]*?{{\/if}}/g, '');
    }

    return html;
  }

  private getCompanyInfo(): AgreementParty {
    return {
      name: 'Immigration Services Ltd',
      type: 'company',
      address: '123 Business Center, Suite 100',
      city: 'Dubai',
      state: 'Dubai',
      zipCode: '12345',
      country: 'United Arab Emirates',
      phone: '+971-4-123-4567',
      email: 'info@immigrationservices.ae',
      contactPerson: 'John Smith',
      taxId: 'AE123456789',
      registrationNumber: 'CR-123456'
    };
  }

  public calculatePricing(products: AgreementProduct[], options: {
    currency?: string;
    taxRate?: number;
    discountRate?: number;
    depositRequired?: boolean;
    depositPercentage?: number;
  } = {}): AgreementPricing {
    const currency = options.currency || 'USD';
    const taxRate = options.taxRate || 5;
    const discountRate = options.discountRate || 0;

    const subtotal = products.reduce((sum, product) => sum + product.totalPrice, 0);
    const discount = subtotal * (discountRate / 100);
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * (taxRate / 100);
    const total = taxableAmount + tax;

    const depositRequired = options.depositRequired || false;
    const depositAmount = depositRequired ? (total * (options.depositPercentage || 20)) / 100 : undefined;

    return {
      subtotal,
      discount,
      tax,
      total,
      currency,
      taxRate,
      discountRate,
      paymentTerms: 'Payment due within 30 days',
      depositRequired: depositRequired ? 1 : 0,
      depositAmount
    };
  }

  public getTemplates(): AgreementTemplate[] {
    return this.templates;
  }

  public getAgreements(): Agreement[] {
    return this.agreements;
  }

  public getAgreement(id: string): Agreement | undefined {
    return this.agreements.find(a => a.id === id);
  }

  public updateAgreement(id: string, updates: Partial<Agreement>): Agreement | null {
    const index = this.agreements.findIndex(a => a.id === id);
    if (index === -1) {
      return null;
    }

    this.agreements[index] = {
      ...this.agreements[index],
      ...updates,
      metadata: {
        ...this.agreements[index].metadata,
        updatedAt: new Date(),
        updatedBy: 'system'
      }
    };

    return this.agreements[index];
  }

  public deleteAgreement(id: string): boolean {
    const index = this.agreements.findIndex(a => a.id === id);
    if (index === -1) {
      return false;
    }

    this.agreements.splice(index, 1);
    return true;
  }

  public addTemplate(template: Omit<AgreementTemplate, 'id'>): AgreementTemplate {
    const newTemplate: AgreementTemplate = {
      ...template,
      id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  public updateTemplate(id: string, updates: Partial<AgreementTemplate>): AgreementTemplate | null {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      return null;
    }

    this.templates[index] = { ...this.templates[index], ...updates };
    return this.templates[index];
  }

  public deleteTemplate(id: string): boolean {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) {
      return false;
    }

    this.templates.splice(index, 1);
    return true;
  }
}
