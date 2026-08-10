// Single entry point for "render the Client Service Agreement HTML" — every
// screen that generates/previews an agreement (agreement-generation route,
// sample-agreement route, the standalone opportunity agreement page, the
// Opportunity Flow wizard, and the Agreements page) should call this instead
// of importing the renderer directly. The app operates a single branch/
// entity (Dubai, trading as Commonwealth Migration Group), so this no
// longer branches on `branchAbbrv` — the parameter is kept only so callers
// don't need to change their call sites.
import { renderDubaiAgreement } from './DubaiBilingualAgreementTemplate';

export interface AgreementLeadData {
  agreementNumber: string;
  agreementDate: string;
  agreementExpiry?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string;
  nationality?: string;
  passportNumber?: string;
  idNumber?: string;
  occupation?: string;
  serviceProgram: string;
  programCode?: string;
  // Accepted for compatibility with existing callers — not used by the
  // current (single-branch) agreement template.
  programTermSchedule?: string;
  destinationCountry: string;
  visaSubclass?: string;
  // Plain formatted numbers (no currency prefix) — the renderer adds the
  // currency code.
  totalAmount: string;
  initialPayment: string;
  secondPayment: string;
  secondPaymentDue?: string;
  clientId?: string;
  includedDeliverables?: string;
  expressExclusions?: string;
  specialTerms?: string;
}

export function renderAgreementForBranch(_branchAbbrv: string | null | undefined, data: AgreementLeadData): string {
  return renderDubaiAgreement({
    agreementNumber: data.agreementNumber,
    agreementDate: data.agreementDate,
    agreementExpiry: data.agreementExpiry,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientPhone: data.clientPhone,
    nationality: data.nationality || '',
    passportNumber: data.passportNumber || '',
    idNumber: data.idNumber || '',
    occupation: data.occupation,
    serviceProgram: data.serviceProgram,
    programCode: data.programCode,
    destinationCountry: data.destinationCountry,
    visaSubclass: data.visaSubclass,
    totalAmount: data.totalAmount,
    initialPayment: data.initialPayment,
    secondPayment: data.secondPayment,
    secondPaymentDue: data.secondPaymentDue,
    clientId: data.clientId || '',
    includedDeliverables: data.includedDeliverables,
    expressExclusions: data.expressExclusions,
    specialTerms: data.specialTerms,
    currencyCode: 'AED',
  });
}
