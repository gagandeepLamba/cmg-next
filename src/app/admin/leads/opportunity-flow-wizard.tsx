'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead } from '@/types/lead';
import { useAuth } from '@/contexts/AuthContext';
import { renderBilingualAgreementWithPdfFirstPage } from '@/lib/bilingualAgreementTemplate';
import {
  Search, Plus, Edit, Trash2, Download, Upload, CheckCircle, XCircle, Clock,
  AlertCircle, FileText, Send, Eye, User, Calendar, DollarSign, FileSignature,
  Shield, X, ChevronRight, ChevronLeft, Save, Mail, Phone, MapPin, Globe,
  Target, TrendingUp, Users, Briefcase, Flag, MessageSquare, FileCheck,
  Receipt, FolderOpen, PenTool, ThumbsUp, ThumbsDown, Lock, BookOpen, Plane, RefreshCw
} from 'lucide-react';

interface OpportunityFlowWizardProps {
  leadId: number;
  onFlowComplete?: () => void;
}

interface FlowStage {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'pending' | 'current' | 'completed' | 'rejected';
}

interface ProspectData {
  opportunityName: string;
  opportunityType: string;
  estimatedValue: string;
  priority: string;
  description: string;
  serviceRequired: string;
  serviceId: string;
}

interface QuotationData {
  quotationNumber: string;
  validUntil: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: string;
    total: string;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  terms: string;
}

interface PaymentData {
  paymentStructure: 'full' | 'installment' | 'milestone';
  totalAmount: number;
  paidAmount: number;
  remainingBalance: number;
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  proofOfPayment: File | null;
  proofOfPaymentUrl: string | null;
}

interface DocumentData {
  idProof: File | null;
  passportCopy: File | null;
  additionalInfo: string;
  allMandatoryDocsUploaded: boolean;
}

interface AgreementData {
  agreementId?: number | null;
  agreementType: string;
  agreementTitle: string;
  duration: string;
  startDate: string;
  endDate: string;
  amount: string;
  terms: string;
  specialConditions: string;
  status: 'draft' | 'generated' | 'sent';
  companyName?: string;
  companyAddress?: string;
  counselorConversationSummary: string;
}

interface SignedAgreementData {
  clientSignature: string;
  signatureDate: string;
  documentUrl: string;
  uploadedTocrm: boolean;
}

interface RetentionData {
  retentionStatus: 'pending' | 'approved' | 'rejected';
  complianceManager: string;
  reviewNotes: string;
  reviewDate: string;
  discountApprovalId: number | null;
  discountStatus: 'not_required' | 'pending' | 'approved' | 'rejected';
  complianceApprovalId: number | null;
  agreementComplianceStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  reassignmentId: number | null;
  notes: string;
}

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function OpportunityFlowWizard({ leadId }: OpportunityFlowWizardProps) {
  const { user } = useAuth();
  const [activeStage, setActiveStage] = useState<string>('prospect');
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedOpportunityId, setCompletedOpportunityId] = useState<number | null>(null);

  // State for each stage
  const [prospectData, setProspectData] = useState<ProspectData>({
    opportunityName: '',
    opportunityType: 'new_business',
    estimatedValue: '',
    priority: 'medium',
    description: '',
    serviceRequired: '',
    serviceId: ''
  });

  // ── Fee lookup state ──
  interface FeeRecord {
    id: number;
    service: number | null;
    country: number | null;
    branch: number | null;
    currency: number | null;
    currencyCode: string;
    serviceName: string;
    countryName: string;
    branchName: string;
    upfront: number;
    prof_fee: number;
    firstMonth: number;
    secondMonth: number;
    thirdMonth: number;
    prof_fee_month: number;
    firstStage: number;
    secondStage: number;
    thirdStage: number;
    forthStage: number;
    fifthStage: number;
    prof_fee_stage: number;
  }
  const [feeData, setFeeData] = useState<FeeRecord | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);

  const [quotationData, setQuotationData] = useState<QuotationData>({
    quotationNumber: '',
    validUntil: '',
    items: [{
      description: '',
      quantity: 1,
      unitPrice: '',
      total: ''
    }],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    terms: ''
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentStructure: 'full',
    totalAmount: 0,
    paidAmount: 0,
    remainingBalance: 0,
    paymentMethod: 'cash',
    transactionId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    proofOfPayment: null,
    proofOfPaymentUrl: null,
  });

  const [documentData, setDocumentData] = useState<DocumentData>({
    idProof: null,
    passportCopy: null,
    additionalInfo: '',
    allMandatoryDocsUploaded: false
  });

  const [agreementData, setAgreementData] = useState<AgreementData>({
    agreementId: null,
    agreementType: 'service_agreement',
    agreementTitle: '',
    duration: '12',
    startDate: '',
    endDate: '',
    amount: '',
    terms: '',
    specialConditions: '',
    status: 'draft',
    companyName: '',
    companyAddress: '',
    counselorConversationSummary: ''
  });

  const [signedAgreementData, setSignedAgreementData] = useState<SignedAgreementData>({
    clientSignature: '',
    signatureDate: '',
    documentUrl: '',
    uploadedTocrm: false
  });

  const [retentionData, setRetentionData] = useState<RetentionData>({
    retentionStatus: 'pending',
    complianceManager: '',
    reviewNotes: '',
    reviewDate: '',
    discountApprovalId: null,
    discountStatus: 'not_required',
    complianceApprovalId: null,
    agreementComplianceStatus: 'not_submitted',
    reassignmentId: null,
    notes: ''
  });

  const [stages, setStages] = useState<FlowStage[]>([
    { id: 'prospect', name: 'Prospect', description: 'Initial opportunity identification', icon: Target, status: 'current' },
    { id: 'quotation', name: 'Quotation', description: 'Generate and send quotation', icon: FileText, status: 'pending' },
    { id: 'payment', name: 'Payment', description: 'Process payment', icon: DollarSign, status: 'pending' },
    { id: 'documents', name: 'Documents', description: 'Upload required documents', icon: FolderOpen, status: 'pending' },
    { id: 'agreement', name: 'Agreement', description: 'Generate agreement', icon: PenTool, status: 'pending' },
    { id: 'signed-agreement', name: 'Signed Agreement', description: 'Upload signed agreement', icon: FileSignature, status: 'pending' },
    { id: 'accounts', name: 'Accounts', description: 'Payment verification', icon: Receipt, status: 'pending' },
    { id: 'retained', name: 'Retained', description: 'Compliance review', icon: Shield, status: 'pending' },
    { id: 'retention-rejected', name: 'Retention Review', description: 'Retention status', icon: Lock, status: 'pending' },
    { id: 'closed', name: 'Closed', description: 'Opportunity closed', icon: CheckCircle, status: 'pending' }
  ]);

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leads/${leadId}`);
        if (!response.ok) throw new Error('Failed to fetch lead');
        const leadData = await response.json();
        setLead(leadData);
        hydrateFlowFromLead(leadData);
        if (leadData.opportunity_id) {
          setCompletedOpportunityId(Number(leadData.opportunity_id));
        }

        const opportunitiesResponse = await fetch(`/api/opportunities?leadId=${leadId}`);
        if (opportunitiesResponse.ok) {
          const opportunities = await opportunitiesResponse.json();
          const latestOpportunity = Array.isArray(opportunities) ? opportunities[0] : null;
          if (latestOpportunity?.id) {
            setCompletedOpportunityId(Number(latestOpportunity.id));
          }
        }

        const discountResponse = await fetch(`/api/discount-approvals?leadId=${leadId}`);
        if (discountResponse.ok) {
          const discountData = await discountResponse.json();
          const latestDiscount = discountData.data?.[0];
          if (latestDiscount) {
            setRetentionData(prev => ({
              ...prev,
              discountApprovalId: latestDiscount.id,
              discountStatus: latestDiscount.status || 'pending',
            }));
          }
        }

        const complianceResponse = await fetch(`/api/opportunity-compliance-approvals?leadId=${leadId}`);
        if (complianceResponse.ok) {
          const complianceData = await complianceResponse.json();
          const latestCompliance = complianceData.data?.[0];
          if (latestCompliance) {
            setRetentionData(prev => ({
              ...prev,
              complianceApprovalId: latestCompliance.id,
              agreementComplianceStatus: latestCompliance.status || 'pending',
              retentionStatus: latestCompliance.status === 'approved' ? 'approved' : latestCompliance.status === 'rejected' ? 'rejected' : 'pending',
              complianceManager: latestCompliance.reviewedBy || prev.complianceManager,
              reviewNotes: latestCompliance.reviewNotes || prev.reviewNotes,
              reviewDate: latestCompliance.reviewedAt ? latestCompliance.reviewedAt.split('T')[0] : prev.reviewDate,
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching lead:', error);
      } finally {
        setLoading(false);
      }
    };

    if (leadId) fetchLeadData();
  }, [leadId]);

  // ── Payment type for package selection ──
  const [paymentType, setPaymentType] = useState<'upfront' | 'monthly' | 'stage'>('stage');

  // ── Helper: compute package totals from a fee record ──
  const getFeePackageTotals = (fee: FeeRecord) => {
    const upfrontTotal  = Number(fee.upfront) + Number(fee.prof_fee);
    const monthlyTotal  = upfrontTotal + Number(fee.firstMonth) + Number(fee.secondMonth) + Number(fee.thirdMonth) + Number(fee.prof_fee_month);
    const stageTotal    = upfrontTotal + Number(fee.firstStage) + Number(fee.secondStage) + Number(fee.thirdStage) + Number(fee.forthStage) + Number(fee.fifthStage) + Number(fee.prof_fee_stage);
    return { upfrontTotal, monthlyTotal, stageTotal };
  };

  // ── Auto-fetch fee: service + country from lead (branch as enhancement; falls back without it) ──
  useEffect(() => {
    // Prefer explicit serviceId from Prospect stage; fall back to lead's service_interest
    const leadAny = lead as any;
    const serviceId = prospectData.serviceId || String(leadAny?.service_interest || '');
    const countryId = Number(leadAny?.country_interest || 0);
    const branchId  = Number(leadAny?.branch || leadAny?.dmBranch?.id || 0);

    if (!serviceId || !countryId) {
      setFeeData(null);
      return;
    }

    let cancelled = false;
    const fetchFee = async () => {
      setFeeLoading(true);
      try {
        // First try: service + country + branch (most specific)
        if (branchId) {
          const params = new URLSearchParams({ service: String(serviceId), country: String(countryId), branch: String(branchId) });
          const res  = await fetch(`/api/admin/fees/lookup?${params}`);
          const json = await res.json();
          if (!cancelled && json.data) { setFeeData(json.data); return; }
        }
        // Fallback: service + country only (as set when creating the lead)
        const params = new URLSearchParams({ service: String(serviceId), country: String(countryId) });
        const res  = await fetch(`/api/admin/fees/lookup?${params}`);
        const json = await res.json();
        if (!cancelled) setFeeData(json.data || null);
      } catch (err) {
        console.error('Fee lookup error:', err);
        if (!cancelled) setFeeData(null);
      } finally {
        if (!cancelled) setFeeLoading(false);
      }
    };

    fetchFee();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prospectData.serviceId, (lead as any)?.service_interest, (lead as any)?.country_interest, (lead as any)?.branch]);

  const hydrateFlowFromLead = (leadData: Lead & Record<string, any>) => {
    const clientName = `${leadData.fname || ''} ${leadData.lname || ''}`.trim() || `Lead #${leadData.id}`;
    const service = String((leadData as Record<string, unknown>).service_interest_label || leadData.service_interest || '');
    const totalAmount = Number(leadData.payTotal || leadData.demandAmt || 0);
    const paidAmount = Number(leadData.paidYet || 0);
    const remainingBalance = Number(leadData.payBalance || Math.max(totalAmount - paidAmount, 0));
    const opportunityName = `${clientName}${service ? ` - ${service}` : ''}`;
    const today = new Date().toISOString().split('T')[0];
    const validUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    setProspectData(prev => ({
      ...prev,
      opportunityName: prev.opportunityName || opportunityName,
      estimatedValue: prev.estimatedValue || String(totalAmount || ''),
      priority: normalizePriorityForWizard(prev.priority || leadData.priority),
      description: prev.description || leadData.lead_remark || `Opportunity for ${clientName}`,
      serviceRequired: prev.serviceRequired || service,
      serviceId: prev.serviceId || String((leadData as Record<string, unknown>).service_interest || ''),
    }));

    setQuotationData(prev => {
      const hasExistingItem = prev.items.some(item => item.description || Number(item.unitPrice) > 0);
      return {
        ...prev,
        validUntil: prev.validUntil || validUntil,
        items: hasExistingItem ? prev.items : [{
          description: service || 'Consulting Service',
          quantity: 1,
          unitPrice: String(totalAmount || ''),
          total: String(totalAmount || ''),
        }],
        subtotal: prev.subtotal || totalAmount,
        tax: prev.tax || 0,
        total: prev.total || totalAmount,
        terms: prev.terms || 'Payment as per agreed service package.',
      };
    });

    setPaymentData(prev => ({
      ...prev,
      totalAmount: prev.totalAmount || totalAmount,
      paidAmount: prev.paidAmount || paidAmount,
      remainingBalance: prev.remainingBalance || remainingBalance,
      paymentDate: prev.paymentDate || today,
    }));

    setAgreementData(prev => ({
      ...prev,
      agreementTitle: prev.agreementTitle || `Service Agreement - ${clientName}`,
      amount: prev.amount || String(totalAmount || ''),
      startDate: prev.startDate || today,
      endDate: prev.endDate || endDate,
      companyAddress: prev.companyAddress || leadData.address || '',
      terms: prev.terms || 'Standard service agreement terms apply.',
    }));
  };

  const moveToNextStage = async () => {
    const validationError = validateStage(activeStage, {
      prospectData,
      quotationData,
      paymentData,
      documentData,
      agreementData,
      signedAgreementData,
    });
    if (validationError) {
      alert(validationError);
      return;
    }

    if (activeStage === 'quotation' && quotationData.discount > 0 && retentionData.discountStatus !== 'approved') {
      alert('Discount approval is required before continuing. The request must be approved by the Director of Sales or Super Admin.');
      return;
    }

    if (activeStage === 'signed-agreement') {
      if (!signedAgreementData.documentUrl || !signedAgreementData.uploadedTocrm) {
        alert('Upload the signed agreement before submitting it for compliance approval.');
        return;
      }

      // Block compliance submission until accounts team has verified a payment via Finance > Payment Verification
      try {
        const pvRes = await fetch(`/api/admin/opportunity-payments?leadId=${leadId}`);
        if (pvRes.ok) {
          const pvData = await pvRes.json();
          const paymentsArr: Array<{ accountantStatus?: string }> = pvData.data ?? pvData.payments ?? [];
          const hasVerified = paymentsArr.some((p) => p.accountantStatus === 'verified');
          if (!hasVerified) {
            alert('Payment must be verified by the accounts team before submitting for compliance approval.\n\nGo to Finance → Payment Verification to verify this client\'s payment.');
            return;
          }
        }
      } catch {
        // Non-blocking: if the check fails, allow to proceed
      }

      await submitComplianceApproval();
    }

    if (activeStage === 'retained' && retentionData.agreementComplianceStatus !== 'approved') {
      alert('Compliance officer approval is required before closing or marking the opportunity as won.');
      return;
    }

    const currentIndex = stages.findIndex(s => s.id === activeStage);
    if (currentIndex < stages.length - 1) {
      // Save current stage data
      await saveStageData(activeStage);

      // When moving from payment → accounts, ensure opportunity + payment record exist
      if (stages[currentIndex].id === 'payment') {
        try {
          await ensureOpportunityForClient();
        } catch (err) {
          console.error('Error ensuring opportunity before accounts:', err);
        }
      }

      // Mark current as completed
      const newStages = [...stages];
      newStages[currentIndex].status = 'completed';
      newStages[currentIndex + 1].status = 'current';
      setStages(newStages);
      setActiveStage(newStages[currentIndex + 1].id);
    }
  };

  const saveStageData = async (stageId: string) => {
    try {
      const stageDataMap: Record<string, any> = {
        prospect: prospectData,
        quotation: quotationData,
        payment: paymentData,
        accounts: {},
        documents: documentData,
        agreement: agreementData,
        'signed-agreement': signedAgreementData,
        retained: retentionData,
      };

      const dataToSave = {
        leadId,
        stage: stageId,
        data: stageDataMap[stageId],
        timestamp: new Date().toISOString()
      };

      console.log('Saving stage data:', dataToSave);
      const response = await fetch('/api/admin/opportunities/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });

      if (!response.ok) {
        throw new Error('Failed to save stage data');
      }

      const result = await response.json();
      console.log('Stage data saved successfully:', result);
    } catch (error) {
      console.error('Error saving stage data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  const moveToPreviousStage = () => {
    const currentIndex = stages.findIndex(s => s.id === activeStage);
    if (currentIndex > 0) {
      const newStages = [...stages];
      newStages[currentIndex].status = 'pending';
      newStages[currentIndex - 1].status = 'current';
      setStages(newStages);
      setActiveStage(newStages[currentIndex - 1].id);
    }
  };

  const handleStageClick = (stageId: string) => {
    const quotationIndex = stages.findIndex(stage => stage.id === 'quotation');
    const targetIndex = stages.findIndex(stage => stage.id === stageId);
    if (quotationData.discount > 0 && retentionData.discountStatus !== 'approved' && targetIndex > quotationIndex) {
      alert('Discount approval is required before moving past quotation. Please request approval and wait for Director of Sales / Super Admin approval in Discount Management.');
      setActiveStage('quotation');
      return;
    }

    setActiveStage(stageId);
  };

  const refreshDiscountApproval = async () => {
    const discountResponse = await fetch(`/api/discount-approvals?leadId=${leadId}`);
    if (!discountResponse.ok) return;
    const discountData = await discountResponse.json();
    const latestDiscount = discountData.data?.[0];
    if (latestDiscount) {
      setRetentionData(prev => ({
        ...prev,
        discountApprovalId: latestDiscount.id,
        discountStatus: latestDiscount.status || 'pending',
      }));
    }
  };

  const handleDiscountChanged = (discount: number) => {
    if (discount <= 0) {
      setRetentionData(prev => ({ ...prev, discountApprovalId: null, discountStatus: 'not_required' }));
      return;
    }

    setRetentionData(prev => {
      if (prev.discountStatus === 'pending' || prev.discountStatus === 'approved') {
        return { ...prev, discountApprovalId: null, discountStatus: 'not_required' };
      }
      return prev;
    });
  };

  const handleRequestDiscount = async () => {
    try {
      const originalAmount = quotationData.subtotal || parseFloat(prospectData.estimatedValue);
      if (!originalAmount || originalAmount <= 0 || quotationData.discount <= 0) {
        alert('Please enter quotation line items and a valid discount amount before requesting approval');
        return;
      }

      const discountData = {
        leadId: leadId,
        opportunityId: completedOpportunityId || (lead as any)?.opportunity_id || null,
        discountType: 'fixed',
        discountAmount: quotationData.discount,
        originalAmount,
        discountedAmount: originalAmount - quotationData.discount,
        currency: 'AED',
        reason: `Discount requested for ${prospectData.opportunityName}`,
        requestedBy: user?.id || 1,
        status: 'pending'
      };

      const response = await fetch('/api/discount-approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discountData)
      });

      if (response.ok) {
        const discount = await response.json();
        setRetentionData(prev => ({
          ...prev,
          discountApprovalId: discount.data?.id || discount.id,
          discountStatus: 'pending'
        }));
        alert('Discount request submitted successfully. The Director of Sales or Super Admin must approve it before the payment stage is available.');
      } else {
        alert('Failed to submit discount request');
      }
    } catch (error) {
      console.error('Error requesting discount:', error);
      alert('Error requesting discount');
    }
  };

  const handleProcessReassignment = async () => {
    try {
      const reassignmentData = {
        leadId: leadId,
        fromEmployeeId: lead?.assignTo || 1,
        toEmployeeId: 1, // Would be selected from dropdown
        reassignmentType: 'manual',
        reason: retentionData.notes || 'Lead reassignment during retention process',
        previousStatus: lead?.status || 'new',
        newStatus: 'reassigned',
        reassignmentDate: new Date()
      };

      const response = await fetch('/api/lead-reassignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reassignmentData)
      });

      if (response.ok) {
        const reassignment = await response.json();
        setRetentionData(prev => ({ ...prev, reassignmentId: reassignment.id }));
        alert('Lead reassignment submitted successfully!');
      } else {
        alert('Failed to submit lead reassignment');
      }
    } catch (error) {
      console.error('Error processing reassignment:', error);
      alert('Error processing reassignment');
    }
  };

  const submitComplianceApproval = async () => {
    if (retentionData.agreementComplianceStatus === 'approved') return;

    const response = await fetch('/api/opportunity-compliance-approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId,
        opportunityId: (lead as any)?.opportunity_id || null,
        signedAgreementUrl: signedAgreementData.documentUrl,
        clientSignature: signedAgreementData.clientSignature,
        signatureDate: signedAgreementData.signatureDate,
        submittedBy: 1,
        status: 'pending'
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to submit signed agreement for compliance review');
    }

    const result = await response.json();
    setRetentionData(prev => ({
      ...prev,
      complianceApprovalId: result.data?.id || prev.complianceApprovalId,
      agreementComplianceStatus: 'pending',
      retentionStatus: 'pending',
    }));
  };

  const handleApproveCompliance = async () => {
    try {
      if (!retentionData.complianceApprovalId) {
        alert('Submit the signed agreement for compliance approval first.');
        return;
      }

      const response = await fetch(`/api/opportunity-compliance-approvals?id=${retentionData.complianceApprovalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          reviewedBy: retentionData.complianceManager || 'Compliance Officer',
          reviewerRole: 'compliance_officer',
          reviewNotes: retentionData.reviewNotes,
          reviewedAt: new Date()
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        alert(error.error || 'Failed to approve compliance review');
        return;
      }

      setRetentionData(prev => ({
        ...prev,
        agreementComplianceStatus: 'approved',
        retentionStatus: 'approved',
        reviewDate: new Date().toISOString().split('T')[0],
      }));
      alert('Compliance officer approved the signed agreement. The opportunity can now be closed or marked won.');
    } catch (error) {
      console.error('Error approving compliance review:', error);
      alert('Error approving compliance review');
    }
  };

  const handleRejectCompliance = async () => {
    try {
      if (!retentionData.complianceApprovalId) {
        alert('Submit the signed agreement for compliance approval first.');
        return;
      }

      const response = await fetch(`/api/opportunity-compliance-approvals?id=${retentionData.complianceApprovalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          reviewedBy: retentionData.complianceManager || 'Compliance Officer',
          reviewerRole: 'compliance_officer',
          reviewNotes: retentionData.reviewNotes,
          reviewedAt: new Date()
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        alert(error.error || 'Failed to reject compliance review');
        return;
      }

      setRetentionData(prev => ({
        ...prev,
        agreementComplianceStatus: 'rejected',
        retentionStatus: 'rejected',
        reviewDate: new Date().toISOString().split('T')[0],
      }));
      const updatedStages = stages.map(stage =>
        stage.id === 'retained' ? { ...stage, status: 'rejected' as const } :
          stage.id === 'retention-rejected' ? { ...stage, status: 'current' as const } : stage
      );
      setStages(updatedStages);
      setActiveStage('retention-rejected');
      alert('Compliance review rejected. The opportunity cannot be closed until the signed agreement is corrected and approved.');
    } catch (error) {
      console.error('Error rejecting compliance review:', error);
      alert('Error rejecting compliance review');
    }
  };

  const ensureOpportunityForClient = async () => {
    const existingOpportunityId = completedOpportunityId || Number((lead as any)?.opportunity_id);
    if (existingOpportunityId) return existingOpportunityId;

    const existingResponse = await fetch(`/api/opportunities?leadId=${leadId}`);
    if (existingResponse.ok) {
      const opportunities = await existingResponse.json();
      const latestOpportunity = Array.isArray(opportunities) ? opportunities[0] : null;
      if (latestOpportunity?.id) {
        setCompletedOpportunityId(Number(latestOpportunity.id));
        return Number(latestOpportunity.id);
      }
    }

    const createResponse = await fetch('/api/lead-to-opportunity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId,
        opportunityData: {
          opportunityName: prospectData.opportunityName || `${lead?.fname || ''} ${lead?.lname || ''} - ${lead?.service_interest || prospectData.serviceRequired}`,
          description: prospectData.description || `Opportunity created for ${lead?.fname || ''} ${lead?.lname || ''}`,
          estimatedValue: parseFloat(prospectData.estimatedValue) || quotationData.total || (lead as any)?.payTotal || 0,
          priority: prospectData.priority || (lead as any)?.priority || 'Medium',
          documentsVerified: documentData.allMandatoryDocsUploaded,
          serviceRequired: prospectData.serviceRequired || (lead as any)?.service_interest || 'Consulting Service',
        },
        paymentData: {
          totalAmount: quotationData.total || paymentData.totalAmount || 0,
          amount: paymentData.paidAmount || paymentData.totalAmount || quotationData.total || 0,
          paidAmount: paymentData.paidAmount || 0,
          paymentMethod: paymentData.paymentMethod || 'cash',
          paymentDate: paymentData.paymentDate,
          transactionId: paymentData.transactionId,
          discountAmount: quotationData.discount || 0,
          proofOfPaymentUrl: (paymentData.proofOfPayment instanceof File && paymentData.proofOfPaymentUrl)
            ? paymentData.proofOfPaymentUrl
            : null,
        },
        agreementData: {
          title: agreementData.agreementTitle || `Service Agreement - ${lead?.fname || ''} ${lead?.lname || ''}`,
          agreementType: agreementData.agreementType,
          duration: agreementData.duration,
          startDate: agreementData.startDate,
          endDate: agreementData.endDate,
          totalAmount: quotationData.total || parseFloat(prospectData.estimatedValue) || 0,
          terms: agreementData.terms,
          specialConditions: agreementData.specialConditions,
          status: signedAgreementData.uploadedTocrm ? 'uploaded' : 'generated',
          documentUrl: signedAgreementData.documentUrl,
          clientSignature: signedAgreementData.clientSignature,
          signatureDate: signedAgreementData.signatureDate
        },
        invoiceData: {
          purpose: prospectData.serviceRequired || lead?.service_interest || '',
          discount: quotationData.discount || 0,
          amount: paymentData.paidAmount || 0,
          totPayAmt: quotationData.total || paymentData.totalAmount || 0,
          payBalance: paymentData.remainingBalance || 0,
          payment_mode: paymentData.paymentMethod || 'cash'
        },
        counselorHandover: {
          summary: agreementData.counselorConversationSummary
        }
      })
    });

    if (!createResponse.ok) {
      const error = await createResponse.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create opportunity for operations');
    }

    const result = await createResponse.json();
    const createdOpportunityId = Number(result.data?.opportunity?.id);
    if (!createdOpportunityId) {
      throw new Error('Opportunity conversion did not return an opportunity ID');
    }
    setCompletedOpportunityId(createdOpportunityId);
    return createdOpportunityId;
  };

  const saveAgreement = async () => {
    const opportunityId = await ensureOpportunityForClient();
    let agreementId = agreementData.agreementId;

    if (!agreementId) {
      const response = await fetch(`/api/opportunity-agreements?opportunityId=${opportunityId}`);
      if (response.ok) {
        const agreements = await response.json();
        agreementId = Number(agreements?.[0]?.id || 0) || null;
      }
    }

    const payload = {
      agreementType: agreementData.agreementType,
      agreementTitle: agreementData.agreementTitle,
      title: agreementData.agreementTitle,
      duration: agreementData.duration,
      startDate: agreementData.startDate || new Date().toISOString().split('T')[0],
      endDate: agreementData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: Number(agreementData.amount || quotationData.total || 0),
      totalAmount: Number(agreementData.amount || quotationData.total || 0),
      terms: agreementData.terms,
      termsAndConditions: agreementData.terms,
      specialConditions: agreementData.specialConditions,
      companyName: agreementData.companyName,
      companyAddress: agreementData.companyAddress,
    };

    const response = await fetch(
      agreementId ? `/api/opportunity-agreements?id=${agreementId}` : '/api/opportunity-agreements',
      {
        method: agreementId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agreementId ? payload : {
          ...payload,
          opportunityId,
          agreementNumber: `AGR-${Date.now()}`,
          status: 'generated',
          createdBy: user?.id || lead?.assignTo || 1,
          uploadedBy: user?.id || lead?.assignTo || 1,
        }),
      },
    );
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to save agreement');

    const savedId = Number(result.data?.id || result.id || agreementId || 0);
    setAgreementData((current) => ({ ...current, agreementId: savedId || current.agreementId, status: 'generated' }));
    return savedId;
  };

  const deleteAgreement = async () => {
    const agreementId = agreementData.agreementId;
    if (!agreementId) return;
    const response = await fetch(`/api/opportunity-agreements?id=${agreementId}`, { method: 'DELETE' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to delete agreement');
    setAgreementData((current) => ({ ...current, agreementId: null, status: 'draft' }));
  };

  const handleCompleteRetention = async () => {
    try {
      if (retentionData.agreementComplianceStatus !== 'approved') {
        alert('Compliance officer approval is required before this opportunity can be closed or won.');
        return;
      }

      const opportunityId = await ensureOpportunityForClient();

      let agreementResult: any = null;
      const existingAgreementResponse = await fetch(`/api/agreement-generation?opportunityId=${opportunityId}`);
      if (existingAgreementResponse.ok) {
        const existingAgreementData = await existingAgreementResponse.json();
        const latestAgreement = Array.isArray(existingAgreementData.data) ? existingAgreementData.data[0] : null;
        if (latestAgreement) {
          agreementResult = {
            data: {
              agreementId: latestAgreement.id,
              agreementNumber: latestAgreement.agreementNumber,
              content: latestAgreement.content,
              opportunity: {
                clientName: latestAgreement.clientName || `${lead?.fname || ''} ${lead?.lname || ''}`.trim(),
                serviceType: prospectData.serviceRequired || lead?.service_interest || 'Service'
              }
            }
          };
        }
      }

      if (!agreementResult) {
        const agreementResponse = await fetch('/api/agreement-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId,
          agreementData: {
            agreementType: agreementData.agreementType || 'service_agreement',
            title: `Service Agreement - ${prospectData.opportunityName || `${lead?.fname} ${lead?.lname}`}`,
            description: `Service agreement for ${prospectData.serviceRequired || lead?.service_interest}`,
            terms: generateDefaultTerms(prospectData),
            startDate: agreementData.startDate || new Date().toISOString().split('T')[0],
            endDate: agreementData.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            paymentMethod: 'Bank Transfer',
            paymentSchedule: 'As per agreed schedule'
          },
          clientData: {
            companyName: agreementData.companyName || '',
            companyAddress: agreementData.companyAddress || lead?.address
          },
          templateId: null
        })
      });

        if (!agreementResponse.ok) {
          const agreementError = await agreementResponse.json();
          throw new Error(agreementError.error || 'Failed to generate agreement');
        }

        agreementResult = await agreementResponse.json();
      }
      
      // Update opportunity status to won
      const opportunityStatusResponse = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'won',
          actualCloseDate: new Date(),
          actualValue: quotationData.total || parseFloat(prospectData.estimatedValue) || 0,
          retentionStatus: 'approved',
          retentionDate: new Date(),
          agreementGenerated: true,
          agreementId: agreementResult.data.agreementId,
          agreementSent: true,
          agreementSigned: true,
          paymentReceived: true,
          documentsVerified: true
        })
      });

      if (!opportunityStatusResponse.ok) {
        const opportunityStatusError = await opportunityStatusResponse.json().catch(() => ({}));
        throw new Error(opportunityStatusError.error || 'Failed to update opportunity status');
      }
      setCompletedOpportunityId(opportunityId);

      const leadStatusResponse = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'retained',
          opportunity_status: 'won',
          conversion_date: new Date().toISOString().split('T')[0],
          conversion_reason: 'Successfully converted and retained client'
        })
      });

      if (!leadStatusResponse.ok) {
        const leadStatusError = await leadStatusResponse.json().catch(() => ({}));
        throw new Error(leadStatusError.error || 'Failed to update lead status after opportunity conversion');
      }

      // Update stages
      const updatedStages = stages.map(stage =>
        stage.id === 'retained' ? { ...stage, status: 'completed' as const } :
          stage.id === 'closed' ? { ...stage, status: 'current' as const } : stage
      );
      setStages(updatedStages);
      setActiveStage('closed');

      alert(`🎉 Opportunity completed and retained successfully!\n\nAgreement generated: ${agreementResult.data.agreementNumber}\nClient: ${agreementResult.data.opportunity.clientName}\nService: ${agreementResult.data.opportunity.serviceType}`);
      
      // Show agreement preview
      if (confirm('Would you like to preview the generated agreement?')) {
        // Open agreement in new window
        const agreementWindow = window.open('', '_blank');
        if (agreementWindow) {
          agreementWindow.document.write(agreementResult.data.content);
          agreementWindow.document.close();
        } else {
          alert('Popup blocked! Please disable popup blocker to preview the agreement.');
        }
      }

      // Redirect to leads page
      setTimeout(() => {
        window.location.href = '/admin/leads';
      }, 3000);
    } catch (error) {
      console.error('Error completing retention:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Error completing retention: ' + errorMessage);
    }
  };

  const generateDefaultTerms = (prospectData: any) => {
    return `
1. SERVICE PROVISION
   The Service Provider agrees to provide ${prospectData.serviceRequired || 'professional'} services to the Client as specified in this agreement.

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
   - Total Amount: ${prospectData.estimatedValue || 'To be determined'}
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
  };

  const renderStageContent = () => {
    switch (activeStage) {
      case 'prospect':
        return <ProspectStage
          lead={lead}
          data={prospectData}
          setData={setProspectData}
          onLeadUpdated={setLead}
          onSaveProspect={() => saveStageData('prospect')}
          onNext={moveToNextStage}
          feeData={feeData}
          feeLoading={feeLoading}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          getFeePackageTotals={getFeePackageTotals}
        />;
      case 'quotation':
        return <QuotationStage
          lead={lead}
          data={quotationData}
          setData={setQuotationData}
          feeData={feeData}
          feeLoading={feeLoading}
          retentionData={retentionData}
          onRequestDiscount={handleRequestDiscount}
          onRefreshDiscount={refreshDiscountApproval}
          onDiscountChanged={handleDiscountChanged}
          onNext={moveToNextStage}
          onPrevious={moveToPreviousStage}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
        />;
      case 'payment':
        return <PaymentStage
          lead={lead}
          data={paymentData}
          setData={setPaymentData}
          quotationTotal={quotationData.total}
          onNext={moveToNextStage}
          onPrevious={moveToPreviousStage}
        />;
      case 'accounts':
        return <AccountsStage
          lead={lead}
          leadId={leadId}
          onNext={moveToNextStage}
          onPrevious={moveToPreviousStage}
        />;
      case 'documents':
        return <DocumentsStage
          lead={lead}
          data={documentData}
          setData={setDocumentData}
          opportunityId={completedOpportunityId}
          onEnsureOpportunity={ensureOpportunityForClient}
          uploadedBy={user?.id || 1}
          paymentProofFile={paymentData.proofOfPayment instanceof File ? paymentData.proofOfPayment : null}
          onNext={moveToNextStage}
          onPrevious={moveToPreviousStage}
        />;
      case 'agreement':
        return <AgreementStage
          lead={lead}
          data={agreementData}
          setData={setAgreementData}
          quotationData={quotationData}
          onSaveAgreement={saveAgreement}
          onDeleteAgreement={deleteAgreement}
          onNext={moveToNextStage}
          onPrevious={moveToPreviousStage}
        />;
      case 'signed-agreement':
        return <SignedAgreementStage
          lead={lead}
          data={signedAgreementData}
          setData={setSignedAgreementData}
          opportunityId={completedOpportunityId}
          uploadedBy={user?.id || 1}
          complianceStatus={retentionData.agreementComplianceStatus}
          onNext={moveToNextStage}
          onPrevious={moveToPreviousStage}
        />;
      case 'retained':
        return <RetainedStage
          lead={lead}
          data={retentionData}
          setData={setRetentionData}
          onApproveCompliance={handleApproveCompliance}
          onRejectCompliance={handleRejectCompliance}
          onCloseWon={handleCompleteRetention}
          onPrevious={moveToPreviousStage}
          onReject={() => {
            const newStages = [...stages];
            const retainedIndex = newStages.findIndex(s => s.id === 'retained');
            newStages[retainedIndex].status = 'rejected';
            const rejectedIndex = newStages.findIndex(s => s.id === 'retention-rejected');
            newStages[rejectedIndex].status = 'current';
            setStages(newStages);
            setActiveStage('retention-rejected');
          }}
        />;
      case 'retention-rejected':
        return <RetentionRejectedStage
          lead={lead}
          data={retentionData}
          onResubmit={() => {
            const newStages = [...stages];
            const retainedIndex = newStages.findIndex(s => s.id === 'retained');
            newStages[retainedIndex].status = 'current';
            const rejectedIndex = newStages.findIndex(s => s.id === 'retention-rejected');
            newStages[rejectedIndex].status = 'pending';
            setStages(newStages);
            setActiveStage('retained');
          }}
        />;
      case 'closed':
        return <ClosedStage
          lead={lead}
          prospectData={prospectData}
          quotationData={quotationData}
          paymentData={paymentData}
          opportunityId={completedOpportunityId}
          currencyCode={feeData?.currencyCode || 'AED'}
        />;
      default:
        return <div>Select a stage</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Loading opportunity flow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        {/* Header with Lead Info */}
        <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Opportunity Flow Management</h1>
                <p className="text-gray-600 mt-1">Convert lead to opportunity through the complete workflow</p>
              </div>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
              >
                <ChevronLeft className="mr-1" size={20} />
                Back to Leads
              </button>
            </div>

            {lead && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <User className="mr-2 text-blue-600" size={18} />
                  <span className="font-semibold text-gray-900">{lead.fname} {lead.lname}</span>
                  <span className="ml-4 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">ID: #{lead.id}</span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center text-gray-700">
                    <Mail className="mr-2 text-gray-400" size={14} />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="mr-2 text-gray-400" size={14} />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Globe className="mr-2 text-gray-400" size={14} />
                    <span>{lead.nationality}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="mr-2 text-gray-400" size={14} />
                    <span>{lead.service_interest}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Path */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = stage.id === activeStage;

                return (
                  <div key={stage.id} className="flex items-center">
                    <button
                      onClick={() => handleStageClick(stage.id)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all ${isActive
                        ? stage.status === 'completed'
                          ? 'bg-green-600 text-white shadow-md'
                          : stage.status === 'rejected'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-blue-600 text-white shadow-md'
                        : stage.status === 'completed'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : stage.status === 'rejected'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      <Icon size={16} className="mr-2" />
                      <span className="text-sm font-medium">{stage.name}</span>
                      {stage.status === 'completed' && (
                        <CheckCircle size={14} className="ml-2" />
                      )}
                      {stage.status === 'rejected' && (
                        <XCircle size={14} className="ml-2" />
                      )}
                    </button>

                    {index < stages.length - 1 && (
                      <ChevronRight
                        size={16}
                        className={`mx-1 ${stage.status === 'completed' ? 'text-green-600' : 'text-gray-300'
                          }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stage Content */}
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={stepVariants}
                transition={{ duration: 0.3 }}
              >
                {renderStageContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function validateStage(
  stage: string,
  data: {
    prospectData: ProspectData;
    quotationData: QuotationData;
    paymentData: PaymentData;
    documentData: DocumentData;
    agreementData: AgreementData;
    signedAgreementData: SignedAgreementData;
  },
): string | null {
  const { prospectData, quotationData, paymentData, documentData, agreementData, signedAgreementData } = data;
  const total = Number(quotationData.total);

  if (stage === 'prospect') {
    if (!prospectData.opportunityName.trim()) return 'Enter an opportunity name before continuing.';
    if (!Number.isFinite(Number(prospectData.estimatedValue)) || Number(prospectData.estimatedValue) <= 0) return 'Estimated value must be greater than zero.';
  }

  if (stage === 'quotation') {
    if (!quotationData.validUntil || new Date(`${quotationData.validUntil}T23:59:59`) < new Date()) return 'Set a quotation validity date that is today or later.';
    if (!Number.isFinite(total) || total <= 0) return 'Quotation total must be greater than zero.';
    if (!Number.isFinite(quotationData.discount) || quotationData.discount < 0 || quotationData.discount > quotationData.subtotal) return 'Discount must be between zero and the quotation subtotal.';
    if (!quotationData.items.some((item) => item.description.trim() && Number(item.quantity) > 0 && Number(item.unitPrice) >= 0)) return 'Add at least one complete quotation line item.';
  }

  if (stage === 'payment') {
    if (!Number.isFinite(paymentData.totalAmount) || paymentData.totalAmount <= 0) return 'Payment total must be greater than zero.';
    if (!Number.isFinite(paymentData.paidAmount) || paymentData.paidAmount < 0 || paymentData.paidAmount > paymentData.totalAmount) return 'Paid amount must be between zero and the payment total.';
    if (!paymentData.paymentDate || Number.isNaN(new Date(paymentData.paymentDate).getTime())) return 'Enter a valid payment date.';
  }

  if (stage === 'documents' && !documentData.allMandatoryDocsUploaded) return 'Upload ID proof and passport copy before continuing.';

  if (stage === 'agreement') {
    if (!agreementData.agreementTitle.trim()) return 'Enter an agreement title before continuing.';
    if (!agreementData.startDate || !agreementData.endDate || new Date(agreementData.endDate) < new Date(agreementData.startDate)) return 'Agreement end date must be on or after the start date.';
    if (!Number.isFinite(Number(agreementData.amount)) || Number(agreementData.amount) <= 0) return 'Agreement amount must be greater than zero.';
    if (!agreementData.terms.trim()) return 'Enter the agreement terms before continuing.';
    if (!agreementData.counselorConversationSummary.trim()) return 'Counselor conversation summary is required before continuing.';
  }

  if (stage === 'signed-agreement') {
    if (!signedAgreementData.clientSignature.trim()) return 'Enter the client signature before submitting for approval.';
    if (!signedAgreementData.signatureDate || Number.isNaN(new Date(signedAgreementData.signatureDate).getTime())) return 'Enter a valid signature date.';
  }

  return null;
}

// Stage Components
function ProspectStage({ lead, data, setData, onLeadUpdated, onSaveProspect, onNext, feeData, feeLoading, paymentType, setPaymentType, getFeePackageTotals }: any) {
  const [saving, setSaving] = useState(false);
  const [editingLeadField, setEditingLeadField] = useState<string | null>(null);
  const [leadDraft, setLeadDraft] = useState<Record<string, any>>({});
  const [programs, setPrograms] = useState<Array<{ id: number | string; name: string }>>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [countries, setCountries] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    if (lead) setLeadDraft(lead);
  }, [lead]);

  useEffect(() => {
    const loadPrograms = async () => {
      setLoadingPrograms(true);
      try {
        const response = await fetch('/api/services');
        setPrograms(response.ok ? await response.json() : []);
      } catch (error) {
        console.error('Error loading programs:', error);
        setPrograms([]);
      } finally {
        setLoadingPrograms(false);
      }
    };
    loadPrograms();
  }, []);

  useEffect(() => {
    fetch('/api/admin/lookup')
      .then(r => r.json())
      .then(d => setCountries(d.countries || []))
      .catch(() => {});
  }, []);

  const saveLeadField = async (field: string) => {
    if (!lead?.id) return;
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: leadDraft[field] ?? '' }),
      });
      const updatedLead = await response.json();
      if (!response.ok) throw new Error(updatedLead.error || 'Failed to save field');
      onLeadUpdated(updatedLead);
      setEditingLeadField(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save field');
    }
  };

  const leadField = (field: string, label: string, type = 'text') => {
    const editing = editingLeadField === field;
    const value = leadDraft[field] ?? '';
    return (
      <div className="rounded-lg border border-gray-200 p-3">
        <div className="mb-1 flex items-center justify-between gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</label>
          {!editing && (
            <button onClick={() => setEditingLeadField(field)} className="text-xs font-medium text-blue-600 hover:text-blue-800">
              Edit
            </button>
          )}
        </div>
        {editing ? (
          <div className="flex gap-2">
            <input
              type={type}
              value={value}
              onChange={(event) => setLeadDraft((current) => ({ ...current, [field]: event.target.value }))}
              className="min-w-0 flex-1 rounded border border-blue-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button onClick={() => saveLeadField(field)} className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700">Save</button>
            <button onClick={() => { setLeadDraft(lead); setEditingLeadField(null); }} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200">Cancel</button>
          </div>
        ) : (
          <p className="min-h-5 break-words text-sm text-gray-900">{value || '—'}</p>
        )}
      </div>
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save status and priority to lead record
      if (lead?.id && (leadDraft.status || leadDraft.priority)) {
        await fetch(`/api/leads/${lead.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: leadDraft.status || undefined,
            priority: leadDraft.priority || undefined,
          }),
        });
      }
      await onSaveProspect();
      alert('Prospect data saved successfully.');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Target className="mr-3 text-blue-600" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Prospect Stage</h3>
          <p className="text-gray-600 text-sm">Identify and qualify the opportunity</p>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-blue-950">Counselor workspace</h4>
            <p className="text-sm text-blue-800">Review and correct lead details here. Each field saves immediately, so you can fix data without leaving the flow.</p>
          </div>
          <span className="rounded bg-white px-3 py-1 text-xs font-medium text-blue-700">Lead #{lead?.id || '—'}</span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {leadField('fname', 'First name')}
          {leadField('lname', 'Last name')}
          {leadField('email', 'Email', 'email')}
          {leadField('mobile', 'Mobile')}
          {leadField('phone', 'Phone')}
          {leadField('nationality', 'Nationality')}
          {/* Country interest — dropdown */}
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500">Country interest</label>
              {editingLeadField !== 'country_interest' && (
                <button onClick={() => setEditingLeadField('country_interest')} className="text-xs font-medium text-blue-600 hover:text-blue-800">Edit</button>
              )}
            </div>
            {editingLeadField === 'country_interest' ? (
              <div className="flex gap-2">
                <select
                  value={leadDraft.country_interest ?? ''}
                  onChange={e => setLeadDraft(cur => ({ ...cur, country_interest: e.target.value }))}
                  className="min-w-0 flex-1 rounded border border-blue-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                  autoFocus
                >
                  <option value="">Select country</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button onClick={() => saveLeadField('country_interest')} className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700">Save</button>
                <button onClick={() => { setLeadDraft(lead); setEditingLeadField(null); }} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200">Cancel</button>
              </div>
            ) : (
              <p className="min-h-5 break-words text-sm text-gray-900">
                {lead?.country_interest_label || countries.find(c => String(c.id) === String(leadDraft.country_interest))?.name || leadDraft.country_interest || '—'}
              </p>
            )}
          </div>

          {/* Service interest — dropdown */}
          <div className="rounded-lg border border-gray-200 p-3">
            <div className="mb-1 flex items-center justify-between gap-2">
              <label className="text-xs font-medium uppercase tracking-wide text-gray-500">Service interest</label>
              {editingLeadField !== 'service_interest' && (
                <button onClick={() => setEditingLeadField('service_interest')} className="text-xs font-medium text-blue-600 hover:text-blue-800">Edit</button>
              )}
            </div>
            {editingLeadField === 'service_interest' ? (
              <div className="flex gap-2">
                <select
                  value={leadDraft.service_interest ?? ''}
                  onChange={e => setLeadDraft(cur => ({ ...cur, service_interest: e.target.value }))}
                  className="min-w-0 flex-1 rounded border border-blue-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                  autoFocus
                >
                  <option value="">Select program</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <button onClick={() => saveLeadField('service_interest')} className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700">Save</button>
                <button onClick={() => { setLeadDraft(lead); setEditingLeadField(null); }} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200">Cancel</button>
              </div>
            ) : (
              <p className="min-h-5 break-words text-sm text-gray-900">
                {lead?.service_interest_label || programs.find(p => String(p.id) === String(leadDraft.service_interest))?.name || leadDraft.service_interest || '—'}
              </p>
            )}
          </div>
          {leadField('address', 'Address')}
          {leadField('market_source', 'Lead source')}
          {leadField('priority', 'Lead priority')}
          {leadField('lead_remark', 'Counselor remarks')}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white p-4 text-sm md:grid-cols-4">
        <div><span className="block text-xs text-gray-500">Branch</span><span className="font-medium text-gray-900">{lead?.branch_name || lead?.dmBranch?.name || '—'}</span></div>
        <div><span className="block text-xs text-gray-500">Assigned counselor</span><span className="font-medium text-gray-900">{lead?.counselor_name || lead?.dmEmployeeByCoUNSILOR?.name || '—'}</span></div>
        <div><span className="block text-xs text-gray-500">Current status</span><span className="font-medium text-gray-900">{lead?.status || 'New'}</span></div>
        <div><span className="block text-xs text-gray-500">Current package value</span><span className="font-medium text-gray-900">{lead?.payTotal || '0'}</span></div>
      </div>

      {/* Mandatory Lead Status & Priority */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-5">
        <div className="mb-3">
          <h4 className="font-semibold text-amber-950">Lead Progression (Required)</h4>
          <p className="text-sm text-amber-800">Update the lead status and priority before continuing to the next stage.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lead Status *</label>
            <select
              value={leadDraft.status || ''}
              onChange={(e) => setLeadDraft((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status</option>
              <option value="Prospect">Prospect</option>
              <option value="Not Interested">Not Interested</option>
              <option value="DNQ">DNQ</option>
              <option value="Not_answered">Not Answered</option>
              <option value="Could Not Connect">Could Not Connect</option>
              <option value="Call Back">Call Back</option>
              <option value="Abroad Lead">Abroad Lead</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lead Priority *</label>
            <select
              value={leadDraft.priority || ''}
              onChange={(e) => setLeadDraft((prev) => ({ ...prev, priority: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select priority</option>
              <option value="P1">P1 - Payment Expected in a week</option>
              <option value="P2">P2 - Discussions going on can close by Month End</option>
              <option value="P3">P3 - Developing Interest</option>
              <option value="P4">P4 - Not sure when to start / Future Interest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-lg mb-4 text-gray-900">Opportunity Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Name *</label>
              <input
                type="text"
                value={data.opportunityName}
                onChange={(e) => setData({ ...data, opportunityName: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter opportunity name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Type *</label>
              <select
                value={data.opportunityType}
                onChange={(e) => setData({ ...data, opportunityType: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="new_business">New Business</option>
                <option value="upsell">Upsell</option>
                <option value="renewal">Renewal</option>
                <option value="referral">Referral</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Value *</label>
              <input
                type="number"
                value={data.estimatedValue}
                onChange={(e) => setData({ ...data, estimatedValue: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
              <select
                value={data.priority}
                onChange={(e) => setData({ ...data, priority: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-lg mb-4 text-gray-900">Service Requirements</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Required *</label>
              <select
                value={JSON.stringify({ name: data.serviceRequired, id: data.serviceId })}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setData({ ...data, serviceRequired: parsed.name, serviceId: parsed.id });
                  } catch {
                    setData({ ...data, serviceRequired: e.target.value, serviceId: '' });
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={loadingPrograms}
              >
                <option value={JSON.stringify({ name: '', id: '' })}>{loadingPrograms ? 'Loading programs...' : 'Select a program'}</option>
                {data.serviceRequired && !programs.some((p) => p.name === data.serviceRequired) && (
                  <option value={JSON.stringify({ name: data.serviceRequired, id: data.serviceId })}>{data.serviceRequired}</option>
                )}
                {programs.map((program) => (
                  <option key={program.id} value={JSON.stringify({ name: program.name, id: String(program.id) })}>{program.name}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Programs are loaded from the active services in CRM.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the opportunity requirements..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Fee Package Summary ── */}
      {feeLoading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 animate-pulse flex items-center gap-2">
          <RefreshCw size={16} className="animate-spin" /> Loading fee package for this service &amp; country…
        </div>
      )}

      {feeData && !feeLoading && (() => {
        const { upfrontTotal, monthlyTotal, stageTotal } = getFeePackageTotals(feeData);
        const cur = feeData.currencyCode || 'AED';
        const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const packages: Array<{ key: 'upfront' | 'monthly' | 'stage'; label: string; total: number; rows: Array<{ label: string; amount: number }> }> = ([
          {
            key: 'upfront' as const,
            label: 'Upfront Package',
            total: upfrontTotal,
            rows: [
              { label: 'Upfront Fee', amount: Number(feeData.upfront) },
              { label: 'Professional Fee', amount: Number(feeData.prof_fee) },
            ].filter(r => r.amount > 0),
          },
          {
            key: 'stage' as const,
            label: 'Stage-wise Package',
            total: stageTotal,
            rows: [
              { label: 'Upfront Fee', amount: Number(feeData.upfront) },
              { label: 'Professional Fee', amount: Number(feeData.prof_fee) },
              { label: 'Stage 1', amount: Number(feeData.firstStage) },
              { label: 'Stage 2', amount: Number(feeData.secondStage) },
              { label: 'Stage 3', amount: Number(feeData.thirdStage) },
              { label: 'Stage 4', amount: Number(feeData.forthStage) },
              { label: 'Stage 5', amount: Number(feeData.fifthStage) },
              { label: 'Prof. Fee (Stage)', amount: Number(feeData.prof_fee_stage) },
            ].filter(r => r.amount > 0),
          },
          {
            key: 'monthly' as const,
            label: 'Monthly Package',
            total: monthlyTotal,
            rows: [
              { label: 'Upfront Fee', amount: Number(feeData.upfront) },
              { label: 'Professional Fee', amount: Number(feeData.prof_fee) },
              { label: 'Month 1', amount: Number(feeData.firstMonth) },
              { label: 'Month 2', amount: Number(feeData.secondMonth) },
              { label: 'Month 3', amount: Number(feeData.thirdMonth) },
              { label: 'Prof. Fee (Monthly)', amount: Number(feeData.prof_fee_month) },
            ].filter(r => r.amount > 0),
          },
        ] as Array<{ key: 'upfront' | 'monthly' | 'stage'; label: string; total: number; rows: Array<{ label: string; amount: number }> }>).filter(pkg => pkg.rows.length > 0);

        return (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-emerald-950">Fee Package from CRM</h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  {feeData.serviceName} · {feeData.countryName}{feeData.branchName ? ` · ${feeData.branchName}` : ''}
                </p>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">{cur}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {packages.map(pkg => {
                const isSelected = paymentType === pkg.key;
                return (
                  <button
                    key={pkg.key}
                    type="button"
                    onClick={() => {
                      setPaymentType(pkg.key);
                      setData({ ...data, estimatedValue: String(pkg.total) });
                    }}
                    className={`text-left rounded-lg border-2 p-3 transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-white shadow'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{pkg.label}</span>
                      {isSelected && <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded">Selected</span>}
                    </div>
                    <div className="space-y-1 mb-2">
                      {pkg.rows.map(r => (
                        <div key={r.label} className="flex justify-between text-xs text-gray-600">
                          <span>{r.label}</span>
                          <span>{cur} {fmt(r.amount)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-sm text-emerald-800">
                      <span>Total</span>
                      <span>{cur} {fmt(pkg.total)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {packages.length === 0 && (
              <p className="text-sm text-emerald-700">No fee package found for this service and country.</p>
            )}
          </div>
        );
      })()}

      {!feeData && !feeLoading && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle className="inline mr-2" size={16} />
          No fee package found in CRM for this service &amp; country. Enter the estimated value manually.
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="mr-2 text-blue-600" size={20} />
          <span className="text-sm text-blue-800">Complete all required fields including Lead Status and Lead Priority before proceeding.</span>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center font-medium"
        >
          <Save className="mr-2" size={20} />
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          onClick={onNext}
          disabled={!data.opportunityName || !data.estimatedValue || !data.serviceRequired || !leadDraft.status || !leadDraft.priority}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center font-medium"
        >
          Continue to Quotation
          <ChevronRight className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );
}

function QuotationStage({ lead, data, setData, feeData, feeLoading, retentionData, onRequestDiscount, onRefreshDiscount, onDiscountChanged, onNext, onPrevious, paymentType, setPaymentType }: any) {
  const [saving, setSaving] = useState(false);
  const [appliedFeeKey, setAppliedFeeKey] = useState<string | null>(null);
  const currencyCode = feeData?.currencyCode || 'AED';

  // ── Build fee items for the selected payment type ──
  const buildFeeItems = (fee: any, type: 'upfront' | 'monthly' | 'stage') => {
    const base = [
      { description: 'Upfront Fee',        amount: Number(fee.upfront)   },
      { description: 'Professional Fee',   amount: Number(fee.prof_fee)  },
    ];
    const monthly = [
      { description: 'Month 1',              amount: Number(fee.firstMonth)     },
      { description: 'Month 2',              amount: Number(fee.secondMonth)    },
      { description: 'Month 3',              amount: Number(fee.thirdMonth)     },
      { description: 'Prof. Fee (Monthly)', amount: Number(fee.prof_fee_month) },
    ];
    const stages = [
      { description: 'Stage 1',              amount: Number(fee.firstStage)    },
      { description: 'Stage 2',              amount: Number(fee.secondStage)   },
      { description: 'Stage 3',              amount: Number(fee.thirdStage)    },
      { description: 'Stage 4',              amount: Number(fee.forthStage)    },
      { description: 'Stage 5',              amount: Number(fee.fifthStage)    },
      { description: 'Prof. Fee (Stage)',   amount: Number(fee.prof_fee_stage) },
    ];
    const pool = type === 'upfront' ? base : type === 'monthly' ? [...base, ...monthly] : [...base, ...stages];
    return pool
      .filter(r => r.amount > 0)
      .map(r => ({ description: r.description, quantity: 1, unitPrice: String(r.amount), total: String(r.amount) }));
  };

  // ── Auto-populate line items when fee data or payment type changes ──
  useEffect(() => {
    if (!feeData) return;
    const key = `${feeData.id}-${paymentType}`;
    if (appliedFeeKey === key) return;

    const items = buildFeeItems(feeData, paymentType);
    if (items.length === 0) return;

    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax - (data.discount || 0);

    setData({ ...data, items, subtotal, tax, total });
    setAppliedFeeKey(key);
  }, [feeData, paymentType]);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving quotation data:', data);
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Quotation saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setData({
      ...data,
      items: [...data.items, { description: '', quantity: 1, unitPrice: '', total: '' }]
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].total = (quantity * unitPrice).toFixed(2);
    }

    // Calculate totals
    const subtotal = newItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax - data.discount;

    setData({ ...data, items: newItems, subtotal, tax, total });
  };

  const updateDiscount = (value: string) => {
    const discount = Math.max(0, parseFloat(value) || 0);
    const total = data.subtotal + data.tax - discount;
    setData({ ...data, discount, total: Math.max(0, total) });
    onDiscountChanged?.(discount);
  };

  const requiresDiscountApproval = data.discount > 0;
  const discountApproved = !requiresDiscountApproval || retentionData.discountStatus === 'approved';
  const discountStatusLabel = requiresDiscountApproval
    ? retentionData.discountStatus.replace('_', ' ')
    : 'not required';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="mr-3 text-blue-600" size={28} />
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Quotation Stage</h3>
            <p className="text-gray-600 text-sm">Generate quotation for the opportunity</p>
          </div>
        </div>
        {feeLoading && (
          <span className="text-sm text-blue-600 animate-pulse">Loading fee package...</span>
        )}
      </div>

      {/* ── Payment Package Type Selector ── */}
      {feeData && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-sm font-semibold text-blue-900">Payment Package</span>
              <span className="ml-2 text-xs text-blue-600">
                {feeData.serviceName} · {feeData.countryName}{feeData.branchName ? ` · ${feeData.branchName}` : ''} · {feeData.currencyCode || 'AED'}
              </span>
            </div>
            <div className="flex gap-2">
              {([
                { key: 'upfront', label: 'Upfront Only', total: Number(feeData.upfront) + Number(feeData.prof_fee) },
                { key: 'stage',   label: 'Stage-wise',   total: Number(feeData.upfront) + Number(feeData.prof_fee) + Number(feeData.firstStage) + Number(feeData.secondStage) + Number(feeData.thirdStage) + Number(feeData.forthStage) + Number(feeData.fifthStage) + Number(feeData.prof_fee_stage) },
                { key: 'monthly', label: 'Monthly',       total: Number(feeData.upfront) + Number(feeData.prof_fee) + Number(feeData.firstMonth) + Number(feeData.secondMonth) + Number(feeData.thirdMonth) + Number(feeData.prof_fee_month) },
              ] as const).filter(p => p.total > 0).map(pkg => (
                <button
                  key={pkg.key}
                  type="button"
                  onClick={() => setPaymentType(pkg.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    paymentType === pkg.key
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {pkg.label}
                  <span className="ml-1 opacity-80">
                    {(feeData.currencyCode || 'AED')} {pkg.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Selecting a package type reloads the line items below from dm_fees. You can still edit individual items.
          </p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-lg mb-4 text-gray-900">Line Items</h4>
        <div className="space-y-4">
          {data.items.map((item: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Service description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className="text-sm font-medium text-gray-700">Total: {currencyCode} {item.total || '0.00'}</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          + Add Item
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-lg mb-4 text-gray-900">Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">{currencyCode} {data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span className="font-medium text-red-600">-{currencyCode} {data.discount.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apply Discount</label>
              <input
                type="number"
                min="0"
                value={data.discount}
                onChange={(e) => updateDiscount(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end gap-3">
              <span className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                discountApproved ? 'bg-green-100 text-green-700' :
                retentionData.discountStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                Discount approval: {discountStatusLabel}
              </span>
              {requiresDiscountApproval && retentionData.discountStatus !== 'approved' && retentionData.discountStatus !== 'pending' && (
                <button
                  onClick={onRequestDiscount}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center"
                >
                  <Send className="mr-2" size={16} />
                  Request Approval
                </button>
              )}
              {requiresDiscountApproval && retentionData.discountStatus === 'pending' && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-yellow-700">
                    Pending Director of Sales / Super Admin approval. All next opportunity stages are locked until approval.
                  </span>
                  <button
                    onClick={onRefreshDiscount}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
                  >
                    <RefreshCw className="mr-2" size={16} />
                    Refresh Status
                  </button>
                  <button
                    onClick={() => window.open('/admin/discount-approvals?status=pending', '_blank')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Shield className="mr-2" size={16} />
                    Open Management
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span>Tax (5%):</span>
            <span className="font-medium">{currencyCode} {data.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span className="text-blue-600">{currencyCode} {data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center font-medium"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back to Prospect
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center font-medium"
          >
            <Save className="mr-2" size={20} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={onNext}
            disabled={!discountApproved}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center font-medium"
          >
            Continue to Payment
            <ChevronRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentStage({ lead, data, setData, quotationTotal, onNext, onPrevious }: any) {
  const [saving, setSaving] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [printingReceipt, setPrintingReceipt] = useState(false);

  useEffect(() => {
    const total = Number(quotationTotal);
    if (Number.isFinite(total) && total > 0 && data.totalAmount !== total) {
      setData({ ...data, totalAmount: total, remainingBalance: total - (data.paidAmount || 0) });
    }
  }, [quotationTotal]);

  const handleSave = async () => {
    if (!lead?.id) { alert('Lead data not loaded.'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          opportunityId: null,
          paymentData: {
            paymentStructure: data.paymentStructure,
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId,
            paymentDate: data.paymentDate,
            paidAmount: data.paidAmount,
            totalAmount: data.totalAmount,
            amount: data.paidAmount,
          },
          receiptData: {
            description: `Payment receipt for ${lead.fname} ${lead.lname}`,
            receiptType: 'payment',
            taxAmount: 0,
            discountAmount: 0,
            notes: '',
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create receipt');
      setReceipt(json.data?.receipt || json.data || json);
      alert(`Receipt ${json.data?.receipt?.receiptNumber || ''} created successfully!`);
    } catch (error: any) {
      console.error('Error saving payment:', error);
      alert(error.message || 'Failed to save payment');
    } finally {
      setSaving(false);
    }
  };

  const downloadReceiptPDF = async () => {
    if (!receipt && !data.paidAmount) { alert('Save the payment first to generate a receipt.'); return; }
    setPrintingReceipt(true);
    const r = receipt || {};
    const clientName = r.clientName || `${lead?.fname || ''} ${lead?.lname || ''}`.trim() || 'Client';
    const currency = r.currency || 'AED';
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>Payment Receipt</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;color:#222;font-size:11pt;padding:50px 60px 80px}
  .header{border-bottom:3px solid #35AE22;padding-bottom:14px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between}
  .brand{font-size:15pt;font-weight:700;color:#1C6B10}
  .sub{font-size:9pt;color:#666;margin-top:3px}
  .badge{background:#35AE22;color:#fff;padding:6px 16px;border-radius:4px;font-weight:700;font-size:10pt}
  table{width:100%;border-collapse:collapse;margin:16px 0}
  td{padding:9px 12px;font-size:10.5pt}
  tr:nth-child(even) td:first-child{background:#2D6A27;color:#fff;font-weight:600}
  tr:nth-child(odd)  td:first-child{background:#1C6B10;color:#fff;font-weight:600}
  tr:nth-child(even) td:last-child{background:#E8F7E4}
  tr:nth-child(odd)  td:last-child{background:#fff}
  .total-row td:first-child{background:#14500A!important;font-size:11.5pt}
  .total-row td:last-child{background:#D4F0D0!important;font-weight:700;font-size:12pt;color:#14500A}
  .footer{margin-top:30px;border-top:2px solid #35AE22;padding-top:10px;text-align:center;color:#666;font-size:9pt}
  @media print{@page{size:A4;margin:0}body{padding:40px 50px 60px}}
</style></head><body>
<div class="header">
  <div>
    <div class="brand">DM IMMIGRATION CONSULTANTS DMCC</div>
    <div class="sub">Dubai Branch · 3703, Latifa Tower, Sheikh Zayed Road, Dubai UAE</div>
    <div class="sub">Ph: +971 04 344 7757 · info@dm-consultant.com</div>
  </div>
  <div class="badge">OFFICIAL RECEIPT</div>
</div>
<div style="margin-bottom:18px;">
  <div style="font-size:10pt;color:#666;">Receipt No: <strong>${r.receiptNumber || r.paymentNumber || 'N/A'}</strong></div>
  <div style="font-size:10pt;color:#666;margin-top:4px;">Date: <strong>${r.paymentDate ? new Date(r.paymentDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</strong></div>
</div>
<table>
  <tr><td>Client Name</td><td>${clientName}</td></tr>
  <tr><td>Service</td><td>${r.serviceName || (lead?.service_interest || 'Consulting Service')}</td></tr>
  <tr><td>Consultant</td><td>${r.consultantName || 'DM Immigration Consultants DMCC'}</td></tr>
  <tr><td>Branch</td><td>${r.branchName || 'Dubai Branch'}</td></tr>
  <tr><td>Payment Method</td><td>${(data.paymentMethod || 'Cash').replace('_',' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</td></tr>
  ${data.transactionId ? `<tr><td>Transaction ID</td><td>${data.transactionId}</td></tr>` : ''}
  <tr><td>Total Amount</td><td>${currency} ${Number(data.totalAmount || r.totalAmount || 0).toLocaleString()}</td></tr>
  <tr><td>Amount Paid</td><td>${currency} ${Number(data.paidAmount || r.paidAmount || r.amount || 0).toLocaleString()}</td></tr>
  <tr class="total-row"><td>Balance Due</td><td>${currency} ${Number(data.remainingBalance ?? Math.max(0, Number(data.totalAmount) - Number(data.paidAmount))).toLocaleString()}</td></tr>
</table>
<p style="margin-top:16px;font-size:10pt;color:#444;">This receipt confirms payment received by DM Immigration Consultants DMCC. Please retain for your records.</p>
<div style="margin-top:40px;display:flex;justify-content:space-between;font-size:10pt;">
  <div>Client Signature: <span style="display:inline-block;width:160px;border-bottom:1px solid #222;"></span></div>
  <div>Authorised Signatory: <span style="display:inline-block;width:160px;border-bottom:1px solid #222;"></span></div>
</div>
<div class="footer">DM Immigration Consultants DMCC · Registered in Dubai · DMCC License · www.dm-consultant.com</div>
</body></html>`;
    const win = window.open('', '_blank', 'width=860,height=1100');
    if (!win) { alert('Allow pop-ups to view the receipt.'); setPrintingReceipt(false); return; }
    win.document.write(html);
    win.document.close();
    win.addEventListener('load', () => setTimeout(() => win.print(), 300));
    if (win.document.readyState === 'complete') setTimeout(() => win.print(), 500);
    setPrintingReceipt(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <DollarSign className="mr-3 text-blue-600" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Payment Stage</h3>
          <p className="text-gray-600 text-sm">Process payment and configure payment structure</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-lg mb-4 text-gray-900">Payment Structure</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
              <select
                value={data.paymentStructure}
                onChange={(e) => setData({ ...data, paymentStructure: e.target.value })}
                className="w-full p-3 border rounded-lg"
              >
                <option value="full">Full Payment</option>
                <option value="installment">Installment</option>
                <option value="milestone">Milestone Based</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
              <input
                type="number"
                value={quotationTotal}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount Paid</label>
              <input
                type="number"
                value={data.paidAmount}
                onChange={(e) => {
                  const paid = parseFloat(e.target.value) || 0;
                  setData({ ...data, paidAmount: paid, remainingBalance: quotationTotal - paid });
                }}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remaining Balance</label>
              <input
                type="number"
                value={data.remainingBalance}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-lg mb-4 text-gray-900">Payment Details</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={data.paymentMethod}
                onChange={(e) => setData({ ...data, paymentMethod: e.target.value })}
                className="w-full p-3 border rounded-lg"
              >
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction ID</label>
              <input
                type="text"
                value={data.transactionId}
                onChange={(e) => setData({ ...data, transactionId: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter transaction reference"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
              <input
                type="date"
                value={data.paymentDate}
                onChange={(e) => setData({ ...data, paymentDate: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Payment</label>
              {data.proofOfPayment instanceof File ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="text-sm text-green-800 truncate flex-1">{data.proofOfPayment.name}</span>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, proofOfPayment: null })}
                    className="text-red-500 hover:text-red-700 text-xs shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <Upload className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Choose file</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setData({ ...data, proofOfPayment: file });
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {receipt && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-green-800">Receipt Created: {receipt.receiptNumber || receipt.paymentNumber}</div>
            <div className="text-sm text-green-700">Amount: {receipt.currency || 'AED'} {Number(receipt.paidAmount || receipt.amount || 0).toLocaleString()}</div>
          </div>
          <button onClick={downloadReceiptPDF} disabled={printingReceipt}
            className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm hover:bg-green-800 flex items-center gap-2 disabled:opacity-60">
            <Download size={16}/> {printingReceipt ? 'Opening…' : 'Download Receipt PDF'}
          </button>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center font-medium"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back to Quotation
        </button>
        <div className="flex gap-3">
          <button
            onClick={downloadReceiptPDF}
            disabled={printingReceipt}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center font-medium"
          >
            <Receipt className="mr-2" size={20} />
            {printingReceipt ? 'Opening…' : 'Print Receipt'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center font-medium"
          >
            <Save className="mr-2" size={20} />
            {saving ? 'Saving…' : 'Save & Create Receipt'}
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium"
          >
            Continue to Accounts
            <ChevronRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountsStage({ lead, leadId, onNext, onPrevious }: any) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyPayment, setVerifyPayment] = useState<any>(null);
  const [verifyRemarks, setVerifyRemarks] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const oppRes = await fetch(`/api/opportunities?leadId=${leadId}`);
        const opps = await oppRes.json();
        const opp = Array.isArray(opps) ? opps[0] : null;
        if (opp?.id) {
          const payRes = await fetch(`/api/opportunity-payments?opportunityId=${opp.id}`);
          const pays = await payRes.json();
          setPayments(Array.isArray(pays) ? pays : pays.data || []);
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [leadId]);

  const handleVerify = async (paymentId: number, status: 'verified' | 'rejected') => {
    setVerifying(true);
    try {
      const res = await fetch('/api/admin/opportunity-payments/verify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status, remarks: verifyRemarks })
      });
      if (!res.ok) throw new Error('Failed');
      alert(`Payment ${status} successfully`);
      setVerifyPayment(null);
      setVerifyRemarks('');
      const updated = await fetch(`/api/opportunity-payments?opportunityId=${payments[0]?.opportunityId}`);
      const json = await updated.json();
      setPayments(Array.isArray(json) ? json : json.data || []);
    } catch {
      alert('Failed to update payment');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading payment data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Receipt className="mr-3 text-blue-600" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Accounts Verification</h3>
          <p className="text-gray-600 text-sm">Payment verification status and accountant review</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
          <p className="text-yellow-800 font-medium">No payment records found</p>
          <p className="text-yellow-600 text-sm mt-1">Complete the payment stage first before accounts verification.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((p: any) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-lg text-gray-900">{p.paymentNumber || `Payment #${p.id}`}</h4>
                  <p className="text-sm text-gray-500">{p.clientName || lead?.fname + ' ' + lead?.lname || 'N/A'} — {p.serviceName || 'Service'}</p>
                </div>
                <span className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full ${
                  p.accountantStatus === 'verified' ? 'bg-green-100 text-green-800 border border-green-300' :
                  p.accountantStatus === 'rejected' ? 'bg-red-100 text-red-800 border border-red-300' :
                  'bg-yellow-100 text-yellow-800 border border-yellow-300'
                }`}>
                  {p.accountantStatus === 'verified' && <CheckCircle className="w-4 h-4 mr-1" />}
                  {p.accountantStatus === 'rejected' && <XCircle className="w-4 h-4 mr-1" />}
                  {(p.accountantStatus === 'pending' || !p.accountantStatus) && <Clock className="w-4 h-4 mr-1" />}
                  {(p.accountantStatus || 'pending').charAt(0).toUpperCase() + (p.accountantStatus || 'pending').slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500 uppercase">Total Amount</span>
                  <p className="text-lg font-bold text-gray-900">{p.currency || 'AED'} {(p.totalAmount || 0).toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <span className="text-xs text-green-600 uppercase">Paid Amount</span>
                  <p className="text-lg font-bold text-green-700">{p.currency || 'AED'} {(p.paidAmount || 0).toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="text-xs text-blue-600 uppercase">Payment Method</span>
                  <p className="text-lg font-bold text-blue-700 capitalize">{(p.paymentMethod || 'N/A').replace('_', ' ')}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <span className="text-xs text-purple-600 uppercase">Payment Status</span>
                  <p className="text-lg font-bold text-purple-700 capitalize">{p.status || 'N/A'}</p>
                </div>
              </div>

              {p.proofOfPaymentUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Proof of Payment: {p.proofOfPaymentUrl.split('/').pop()}</span>
                  </div>
                </div>
              )}

              {p.accountantRemarks && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <span className="text-xs text-blue-600 uppercase font-medium">Accountant Remarks</span>
                  <p className="text-sm text-blue-800 mt-1">{p.accountantRemarks}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    const clientName = p.clientName || (lead ? `${lead.fname} ${lead.lname}` : 'Client');
                    const currency = p.currency || 'AED';
                    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Receipt</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;padding:50px 60px 80px;color:#222}
.hdr{border-bottom:3px solid #35AE22;padding-bottom:12px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center}
.brand{font-size:15pt;font-weight:700;color:#1C6B10}.sub{font-size:9pt;color:#666;margin-top:3px}
.badge{background:#35AE22;color:#fff;padding:6px 18px;border-radius:4px;font-weight:700}
table{width:100%;border-collapse:collapse;margin:14px 0}
td{padding:9px 12px;font-size:10.5pt}
tr:nth-child(odd) td:first-child{background:#1C6B10;color:#fff;font-weight:600}
tr:nth-child(even) td:first-child{background:#2D6A27;color:#fff;font-weight:600}
tr:nth-child(odd) td:last-child{background:#fff}
tr:nth-child(even) td:last-child{background:#E8F7E4}
.total td:first-child{background:#14500A!important;font-size:11pt}
.total td:last-child{background:#D4F0D0!important;font-weight:700;color:#14500A;font-size:12pt}
.footer{margin-top:28px;border-top:2px solid #35AE22;padding-top:8px;text-align:center;font-size:9pt;color:#666}
@media print{@page{size:A4;margin:0}body{padding:40px 50px 60px}}</style></head><body>
<div class="hdr"><div><div class="brand">DM IMMIGRATION CONSULTANTS DMCC</div>
<div class="sub">Dubai Branch · 3703, Latifa Tower, Sheikh Zayed Road, Dubai UAE</div>
<div class="sub">Ph: +971 04 344 7757 · info@dm-consultant.com</div></div>
<div class="badge">OFFICIAL RECEIPT</div></div>
<div style="margin-bottom:16px;font-size:10pt;color:#444;">
Receipt No: <strong>${p.paymentNumber || p.id}</strong> &nbsp;|&nbsp;
Date: <strong>${p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</strong>
</div>
<table>
<tr><td>Client</td><td>${clientName}</td></tr>
<tr><td>Service</td><td>${p.serviceName || 'Consulting Service'}</td></tr>
<tr><td>Branch</td><td>${p.branchName || 'Dubai Branch'}</td></tr>
<tr><td>Payment Method</td><td>${(p.paymentMethod || 'Cash').replace('_',' ')}</td></tr>
${p.transactionId ? `<tr><td>Transaction ID</td><td>${p.transactionId}</td></tr>` : ''}
<tr><td>Total Amount</td><td>${currency} ${Number(p.totalAmount || 0).toLocaleString()}</td></tr>
<tr><td>Amount Paid</td><td>${currency} ${Number(p.paidAmount || p.amount || 0).toLocaleString()}</td></tr>
<tr class="total"><td>Balance Due</td><td>${currency} ${Number(p.remainingBalance || p.balanceAmount || 0).toLocaleString()}</td></tr>
</table>
<p style="margin-top:14px;font-size:10pt;color:#444;">This receipt confirms payment received by DM Immigration Consultants DMCC.</p>
<div style="margin-top:40px;display:flex;justify-content:space-between;font-size:10pt;">
<div>Client Signature: <span style="display:inline-block;width:160px;border-bottom:1px solid #222;"></span></div>
<div>Authorised Signatory: <span style="display:inline-block;width:160px;border-bottom:1px solid #222;"></span></div>
</div>
<div class="footer">DM Immigration Consultants DMCC · DMCC Licensed · www.dm-consultant.com</div>
</body></html>`;
                    const win = window.open('', '_blank', 'width=860,height=1100');
                    if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 400); }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Receipt PDF
                </button>
                <button
                  onClick={() => { setVerifyPayment(p); setVerifyRemarks(p.accountantRemarks || ''); }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Review Payment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {verifyPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Accountant Review</h2>
              <button onClick={() => { setVerifyPayment(null); setVerifyRemarks(''); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Payment #:</span> <span className="font-medium">{verifyPayment.paymentNumber || verifyPayment.id}</span></div>
                  <div><span className="text-gray-500">Client:</span> <span className="font-medium">{verifyPayment.clientName || lead?.fname + ' ' + lead?.lname || 'N/A'}</span></div>
                  <div><span className="text-gray-500">Amount:</span> <span className="font-medium">{verifyPayment.currency || 'AED'} {(verifyPayment.totalAmount || 0).toLocaleString()}</span></div>
                  <div><span className="text-gray-500">Paid:</span> <span className="font-medium text-green-700">{verifyPayment.currency || 'AED'} {(verifyPayment.paidAmount || 0).toLocaleString()}</span></div>
                  {verifyPayment.proofOfPaymentUrl && <div className="col-span-2"><span className="text-gray-500">Proof:</span> <span className="font-medium text-green-700">{verifyPayment.proofOfPaymentUrl.split('/').pop()}</span></div>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accountant Remarks</label>
                <textarea
                  value={verifyRemarks}
                  onChange={e => setVerifyRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter remarks (optional for verify, recommended for reject)..."
                />
              </div>
            </div>
            <div className="border-t px-6 py-3 flex justify-end gap-3">
              <button onClick={() => { setVerifyPayment(null); setVerifyRemarks(''); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleVerify(verifyPayment.id, 'rejected')} disabled={verifying} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:bg-red-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button onClick={() => handleVerify(verifyPayment.id, 'verified')} disabled={verifying} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Verify & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="mr-2 text-blue-600" size={20} />
          <span className="text-sm text-blue-800">Accountant must verify or reject payment before proceeding to compliance review.</span>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onPrevious} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center font-medium">
          <ChevronLeft className="mr-2" size={20} />
          Back to Payment
        </button>
        <button
          onClick={onNext}
          disabled={payments.length > 0 && payments.every((p: any) => p.accountantStatus !== 'verified')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center font-medium"
        >
          Continue to Documents
          <ChevronRight className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );
}

function DocumentsStage({ lead, data, setData, opportunityId: initialOpportunityId, onEnsureOpportunity, uploadedBy, paymentProofFile, onNext, onPrevious }: any) {
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, 'idle' | 'uploading' | 'done' | 'error'>>({});

  const mandatoryDocs = [
    { key: 'idProof', label: 'ID Proof (Mandatory)', category: 'id_proof' },
    { key: 'passportCopy', label: 'Passport Copy (Mandatory)', category: 'passport' },
  ] as const;

  const optionalDocs: { key: string; label: string; category: string }[] = [];

  const allMandatoryUploaded = mandatoryDocs.every(({ key }) => data[key] instanceof File);

  useEffect(() => {
    if (allMandatoryUploaded !== data.allMandatoryDocsUploaded) {
      setData({ ...data, allMandatoryDocsUploaded: allMandatoryUploaded });
    }
  }, [allMandatoryUploaded]);

  const uploadFileToServer = async (file: File, category: string, oppId: number): Promise<string | null> => {
    const form = new FormData();
    form.append('file', file);
    form.append('opportunityId', String(oppId));
    form.append('category', category);
    form.append('documentName', file.name);
    form.append('required', 'true');
    form.append('uploadedBy', String(uploadedBy || 1));
    const res = await fetch('/api/opportunity-documents', { method: 'POST', body: form });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Upload failed for ${file.name}`);
    }
    const result = await res.json();
    return result.filePath || null;
  };

  const handleSave = async () => {
    if (!allMandatoryUploaded) return;
    setSaving(true);
    try {
      // Ensure we have an opportunity ID — create one if missing
      let oppId: number | null = initialOpportunityId || null;
      if (!oppId && onEnsureOpportunity) {
        try {
          oppId = await onEnsureOpportunity();
        } catch (err) {
          console.error('Could not ensure opportunity for document upload:', err);
        }
      }

      if (oppId) {
        // Upload mandatory documents (ID proof, passport)
        for (const { key, category } of mandatoryDocs) {
          const file = data[key];
          if (file instanceof File) {
            setUploadProgress(p => ({ ...p, [key]: 'uploading' }));
            try {
              await uploadFileToServer(file, category, oppId as number);
              setUploadProgress(p => ({ ...p, [key]: 'done' }));
            } catch (err) {
              setUploadProgress(p => ({ ...p, [key]: 'error' }));
              throw err;
            }
          }
        }
        // Also upload proof of payment if provided from payment stage
        if (paymentProofFile instanceof File) {
          setUploadProgress(p => ({ ...p, proofOfPayment: 'uploading' }));
          try {
            await uploadFileToServer(paymentProofFile, 'proof_of_payment', oppId as number);
            setUploadProgress(p => ({ ...p, proofOfPayment: 'done' }));
          } catch (err) {
            console.warn('Proof of payment upload failed (non-blocking):', err);
            setUploadProgress(p => ({ ...p, proofOfPayment: 'error' }));
          }
        }
      } else {
        console.warn('No opportunity ID available — documents saved to state only, will upload after opportunity creation.');
      }

      alert('Documents saved successfully!');
      onNext();
    } catch (error) {
      console.error('Error saving documents:', error);
      alert(`Error saving documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents & Information</h3>
        {!initialOpportunityId && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            Opportunity will be created automatically when you save documents.
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mandatoryDocs.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}{' '}
                {uploadProgress[key] === 'done' && <span className="text-green-600 text-xs">(uploaded ✓)</span>}
                {uploadProgress[key] === 'uploading' && <span className="text-blue-600 text-xs">(uploading...)</span>}
                {uploadProgress[key] === 'error' && <span className="text-red-600 text-xs">(upload failed)</span>}
                {!uploadProgress[key] && data[key] instanceof File && <span className="text-green-600 text-xs">(selected)</span>}
              </label>
              <input
                type="file"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setData({ ...data, [key]: file });
                  setUploadProgress(p => ({ ...p, [key]: 'idle' }));
                }}
              />
            </div>
          ))}
          {optionalDocs.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} {data[key] instanceof File && <span className="text-green-600 text-xs">(selected)</span>}
              </label>
              <input
                type="file"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setData({ ...data, [key]: file });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Additional Information</h4>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows={4}
          placeholder="Enter any additional information or notes..."
          value={data.additionalInfo || ''}
          onChange={(e) => setData({...data, additionalInfo: e.target.value})}
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back to Payment
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !allMandatoryUploaded}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
}

function AgreementStage({ lead, data, setData, quotationData, onSaveAgreement, onDeleteAgreement, onNext, onPrevious }: any) {
  const [saving, setSaving] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveAgreement();
      alert('Agreement saved successfully.');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const downloadAgreementPdf = async () => {
    setGeneratingPdf(true);
    try {
      const clientName = [lead?.fname, lead?.lname].filter(Boolean).join(' ') || lead?.name || 'Client';
      const destinationCountry = (lead as any)?.country_interest_label || (lead as any)?.country_interest || 'Not specified';
      const serviceProgram   = (lead as any)?.service_interest_label  || (lead as any)?.service_interest  || data.agreementType || 'Consulting Service';

      // Pull payment amounts from quotation if available
      const totalAmount    = quotationData?.total    || data.amount || (lead as any)?.payTotal || (lead as any)?.demandAmt || '0';
      const initialPayment = quotationData?.subtotal ? String(quotationData.subtotal) : String(Math.round(Number(totalAmount) / 2));
      const secondPayment  = quotationData?.total    ? String(Math.max(0, Number(quotationData.total) - Number(initialPayment))) : String(Math.round(Number(totalAmount) / 2));

      await onSaveAgreement();

      const html = renderBilingualAgreementWithPdfFirstPage({
        agreementNumber : `AGR-${Date.now()}`,
        agreementDate   : new Date().toLocaleDateString('en-GB'),
        clientName,
        clientEmail   : (lead as any)?.email      || '',
        clientPhone   : (lead as any)?.phone      || (lead as any)?.mobile || '',
        clientAddress : (lead as any)?.address    || '',
        nationality   : (lead as any)?.nationality || '',
        passportNumber: (lead as any)?.passport_no || (lead as any)?.id_number || '',
        emiratesId    : (lead as any)?.emirates_id || (lead as any)?.id_number  || '',
        occupation    : (lead as any)?.occupation  || '',
        serviceProgram,
        destinationCountry,
        totalAmount   : String(totalAmount),
        initialPayment,
        secondPayment,
        branchName   : (lead as any)?.dmBranch?.name    || (lead as any)?.branchName    || 'DM Immigration Consultants DMCC – Dubai Branch',
        branchAddress: (lead as any)?.dmBranch?.address  || (lead as any)?.branchAddress || 'Office 3703B, Latifa Tower, Sheikh Zayed Road, Trade Centre First, P.O. Box 29514, Dubai, UAE',
      });

      // Open in a new tab — browser renders Arabic natively, user saves as PDF via Ctrl+P / Print dialog
      const win = window.open('', '_blank', 'width=900,height=700');
      if (!win) { alert('Please allow pop-ups to open the agreement.'); return; }
      win.document.write(html);
      win.document.close();
      // Trigger print after fonts have loaded
      win.addEventListener('load', () => {
        setTimeout(() => win.print(), 400);
      });
      // Fallback if load already fired
      if (win.document.readyState === 'complete') {
        setTimeout(() => win.print(), 600);
      }

      setData((current: AgreementData) => ({ ...current, status: 'generated' }));
    } catch (error) {
      console.error('Error generating agreement PDF:', error);
      alert('Failed to generate agreement PDF');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDelete = async () => {
    if (!data.agreementId) return;
    if (!window.confirm('Delete this agreement? This cannot be undone.')) return;

    setSaving(true);
    try {
      await onDeleteAgreement();
      alert('Agreement deleted.');
    } catch (error) {
      console.error('Error deleting agreement:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete agreement');
    } finally {
      setSaving(false);
    }
  };

  const [lookupNumber, setLookupNumber] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);

  const handleAgreementLookup = async () => {
    const num = lookupNumber.trim();
    if (!num) return;
    setLookupLoading(true);
    try {
      const res = await fetch(`/api/opportunity-agreements?agreementNumber=${encodeURIComponent(num)}`);
      if (!res.ok) throw new Error('Not found');
      const json = await res.json();
      const agr = Array.isArray(json.data) ? json.data[0] : json.data ?? json;
      if (!agr) { alert(`No agreement found with number: ${num}`); return; }
      setData((prev: AgreementData) => ({
        ...prev,
        agreementId: agr.id ?? prev.agreementId,
        agreementType: agr.agreementType ?? agr.type ?? prev.agreementType,
        agreementTitle: agr.title ?? agr.agreementTitle ?? prev.agreementTitle,
        terms: agr.termsAndConditions ?? agr.terms ?? prev.terms,
        startDate: agr.startDate ? String(agr.startDate).split('T')[0] : prev.startDate,
        endDate: agr.endDate ? String(agr.endDate).split('T')[0] : prev.endDate,
        amount: agr.totalAmount ? String(agr.totalAmount) : prev.amount,
        companyName: agr.companyName ?? prev.companyName,
        companyAddress: agr.companyAddress ?? prev.companyAddress,
        status: agr.status ?? prev.status,
      }));
      alert(`Agreement ${num} loaded successfully.`);
    } catch {
      alert(`No agreement found with number: ${num}`);
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <PenTool className="mr-3 text-blue-600" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Agreement Generation</h3>
          <p className="text-gray-600 text-sm">Generate service agreement document</p>
        </div>
      </div>

      {/* Agreement number lookup */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-blue-900 mb-2">Lookup Existing Agreement</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={lookupNumber}
            onChange={(e) => setLookupNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAgreementLookup()}
            placeholder="Enter Agreement Number (e.g. AGR-001)"
            className="flex-1 p-2.5 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAgreementLookup}
            disabled={lookupLoading || !lookupNumber.trim()}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {lookupLoading ? 'Loading...' : 'Fetch & Fill'}
          </button>
        </div>
        <p className="text-xs text-blue-600 mt-1">Enter an agreement number and click Fetch to auto-fill all fields below.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Type</label>
          <select
            value={data.agreementType}
            onChange={(e) => setData({ ...data, agreementType: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="service_agreement">Auto by Product</option>
            <option value="canada-single">Canada Single</option>
            <option value="europe-work-permit">Europe Work Permit</option>
            <option value="job-search">Job Search</option>
            <option value="visit-visa">Visit Visa</option>
            <option value="australia-single">Australia Single</option>
            <option value="student-visa">Student Visa</option>
            <option value="goc">Germany Opportunity Card</option>
            <option value="eip">Economic Immigration Program</option>
            <option value="work-permit-visa-application">Work Permit Visa Application</option>
            <option value="yukon-gcc">Yukon GCC</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Title</label>
          <input
            type="text"
            value={data.agreementTitle}
            onChange={(e) => setData({ ...data, agreementTitle: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter agreement title"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Terms and Conditions</label>
        <textarea
          value={data.terms}
          onChange={(e) => setData({ ...data, terms: e.target.value })}
          rows={6}
          className="w-full p-3 border rounded-lg"
          placeholder="Enter terms and conditions..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Counselor Conversation Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.counselorConversationSummary}
          onChange={(e) => setData({ ...data, counselorConversationSummary: e.target.value })}
          rows={4}
          className="w-full p-3 border rounded-lg"
          placeholder="Summarize the conversation with the client regarding their service requirements, expectations, and any commitments made..."
        />
      </div>

      <button
        onClick={downloadAgreementPdf}
        disabled={generatingPdf}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center font-medium"
      >
        <Download className="mr-2" size={20} />
        {generatingPdf ? 'Opening Agreement...' : 'Generate & Print Agreement (PDF)'}
      </button>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center font-medium"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back to Documents
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center font-medium"
          >
            <Save className="mr-2" size={20} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          {data.agreementId && (
            <button
              onClick={handleDelete}
              disabled={saving || generatingPdf}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center font-medium"
            >
              <Trash2 className="mr-2" size={20} />
              Delete Agreement
            </button>
          )}
          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium"
          >
            Continue to Signed Agreement
            <ChevronRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SignedAgreementStage({ lead, data, setData, opportunityId, uploadedBy, complianceStatus, onNext, onPrevious }: any) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (file?: File) => {
    if (!file) return;
    if (!opportunityId) {
      alert('Opportunity not yet created. Please complete the agreement stage first.');
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('opportunityId', String(opportunityId));
      form.append('category', 'signed_agreement');
      form.append('documentName', file.name);
      form.append('required', 'true');
      form.append('uploadedBy', String(uploadedBy || 1));
      const res = await fetch('/api/opportunity-documents', { method: 'POST', body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }
      const result = await res.json();
      setData({
        ...data,
        documentUrl: result.filePath || `/uploads/opportunity-documents/${file.name}`,
        uploadedTocrm: true,
      });
    } catch (err) {
      alert(`Failed to upload signed agreement: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const canSubmit = Boolean(data.documentUrl && data.uploadedTocrm && data.clientSignature && data.signatureDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <FileSignature className="mr-3 text-blue-600" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Signed Agreement Upload</h3>
          <p className="text-gray-600 text-sm">Upload client-signed agreement document</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="mr-2 text-blue-600" size={20} />
          <span className="text-sm text-blue-800">Once uploaded, the signed agreement will be automatically sent to CRM.</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Client Signature</label>
          <input
            type="text"
            value={data.clientSignature}
            onChange={(e) => setData({ ...data, clientSignature: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter client signature"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Signature Date</label>
          <input
            type="date"
            value={data.signatureDate}
            onChange={(e) => setData({ ...data, signatureDate: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <FileSignature className="mx-auto text-gray-400 mb-3" size={40} />
        {data.documentUrl ? (
          <div className="flex items-center justify-center gap-2 mb-3">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-sm text-green-800 font-medium">
              Uploaded: {data.documentUrl.split('/').pop()}
            </span>
          </div>
        ) : (
          <p className="text-gray-600 mb-3 text-sm">
            {uploading ? 'Uploading…' : 'Upload the signed agreement document (PDF, DOCX, JPG)'}
          </p>
        )}
        <label className={`inline-flex px-5 py-2 rounded-lg cursor-pointer text-sm font-medium ${
          uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}>
          <Upload className="mr-2" size={18} />
          {uploading ? 'Uploading…' : data.documentUrl ? 'Replace File' : 'Choose File'}
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
        </label>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Compliance status</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
          complianceStatus === 'approved' ? 'bg-green-100 text-green-700' :
          complianceStatus === 'rejected' ? 'bg-red-100 text-red-700' :
          complianceStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {complianceStatus.replace('_', ' ')}
        </span>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center font-medium"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back to Agreement
        </button>
        <button
          onClick={onNext}
          disabled={!canSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center font-medium"
        >
          Continue to Accounts
          <ChevronRight className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );
}

function RetainedStage({ lead, data, setData, onApproveCompliance, onRejectCompliance, onCloseWon, onPrevious }: any) {
  const canClose = data.agreementComplianceStatus === 'approved';
  const isRejected = data.agreementComplianceStatus === 'rejected';

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Shield className="mr-3 text-blue-600" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Retention & Compliance Review</h3>
          <p className="text-gray-600 text-sm">Compliance manager review for approval</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="mr-2 text-yellow-600" size={20} />
          <span className="text-sm text-yellow-800">This agreement requires compliance officer approval before closing or marking the opportunity won.</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Status</label>
          <div className={`w-full p-3 border rounded-lg capitalize font-medium ${
            canClose ? 'bg-green-50 border-green-200 text-green-700' :
            isRejected ? 'bg-red-50 border-red-200 text-red-700' :
            'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}>
            {data.agreementComplianceStatus.replace('_', ' ')}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Manager</label>
          <input
            type="text"
            value={data.complianceManager}
            onChange={(e) => setData({ ...data, complianceManager: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter manager name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes</label>
        <textarea
          value={data.reviewNotes}
          onChange={(e) => setData({ ...data, reviewNotes: e.target.value })}
          rows={4}
          className="w-full p-3 border rounded-lg"
          placeholder="Enter review comments..."
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center font-medium"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back
        </button>
        <div className="flex gap-3">
          {!canClose && (
            <>
              <button
                onClick={onRejectCompliance}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center font-medium"
              >
                <ThumbsDown className="mr-2" size={20} />
                Reject as Compliance
              </button>
              <button
                onClick={onApproveCompliance}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center font-medium"
              >
                <ThumbsUp className="mr-2" size={20} />
                Approve as Compliance
              </button>
            </>
          )}
          <button
            onClick={onCloseWon}
            disabled={!canClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center font-medium"
          >
            <CheckCircle className="mr-2" size={20} />
            Close / Mark Won
          </button>
        </div>
      </div>
    </div>
  );
}

function RetentionRejectedStage({ lead, data, onResubmit }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <XCircle className="mr-3 text-red-600" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Retention Review Rejected</h3>
          <p className="text-gray-600 text-sm">Agreement was rejected by compliance manager</p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h4 className="font-semibold text-lg mb-4 text-red-900">Rejection Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <XCircle className="mr-2 text-red-600" size={16} />
            <span><strong>Rejected By:</strong> {data.complianceManager || 'Compliance Manager'}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 text-red-600" size={16} />
            <span><strong>Rejection Date:</strong> {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-lg mb-4 text-gray-900">Rejection Reason</h4>
        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-red-600">
          <p className="text-sm">{data.reviewNotes || 'The submitted agreement requires modifications before approval.'}</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h4 className="font-semibold text-lg mb-4 text-yellow-900">Required Actions</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <AlertCircle className="mr-2 text-yellow-600" size={16} />
            Review and update agreement terms
          </li>
          <li className="flex items-center">
            <AlertCircle className="mr-2 text-yellow-600" size={16} />
            Address compliance manager feedback
          </li>
          <li className="flex items-center">
            <AlertCircle className="mr-2 text-yellow-600" size={16} />
            Resubmit for review
          </li>
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onResubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium"
        >
          <Upload className="mr-2" size={20} />
          Resubmit for Review
        </button>
      </div>
    </div>
  );
}

function getOperationsModule(lead: any) {
  const country = String(lead?.country_interest || '').toLowerCase();
  const service = String(lead?.service_interest || '').toLowerCase();
  const leadType = String(lead?.type || lead?.lead_type || '').toLowerCase();
  const countryId = Number(lead?.country_interest);
  const serviceId = Number(lead?.service_interest);
  const combined = `${country} ${service}`;

  // Production leads normally store country and service as IDs. Keep this in
  // sync with leadOpportunityConversion so a won opportunity opens the right
  // operations program instead of falling back to Canada.
  const eipServices = [211, 213, 214, 215, 216, 218];
  const jobSearchServices = [321, 322, 332, 333, 331, 327, 326, 341, 338, 339, 352, 349, 343, 344, 354, 250, 248, 251, 252];
  const polandServices = [39, 280, 254, 278, 285, 298, 293, 288, 287, 286, 303, 315, 316, 317, 309, 294, 264, 279, 329];

  if (leadType === 'visit') {
    return { label: 'Visit Visa Operations', subtitle: 'Visit visa client flow', path: '/admin/leads/visit-visa-operations', color: 'bg-blue-600 hover:bg-blue-700', icon: FileText };
  }
  if (leadType === 'student') {
    return { label: 'Student Visa Operations', subtitle: 'Student visa client flow', path: '/admin/leads/student-visa-operations', color: 'bg-blue-600 hover:bg-blue-700', icon: FileText };
  }
  if ((leadType === 'skill' || leadType === 'work') && eipServices.includes(serviceId)) {
    return { label: 'EIP Canada Operations', subtitle: 'Canada investment client flow', path: '/admin/leads/eip-canada-operations', color: 'bg-red-600 hover:bg-red-700', icon: MapPin };
  }
  if (jobSearchServices.includes(serviceId)) {
    return { label: 'Resume Marketing Operations', subtitle: 'Resume marketing services', path: '/admin/leads/rms-operations', color: 'bg-purple-600 hover:bg-purple-700', icon: Briefcase };
  }
  if (polandServices.includes(serviceId)) {
    return { label: 'Poland Visa Operations', subtitle: 'Poland work permit client flow', path: '/admin/leads/poland-visa-operations', color: 'bg-indigo-600 hover:bg-indigo-700', icon: Plane };
  }
  if (leadType === 'skill' && (countryId === 1 || countryId === 14)) {
    return { label: 'Australia Operations', subtitle: 'Australia skilled client flow', path: '/admin/leads/skill-australia-operations', color: 'bg-yellow-600 hover:bg-yellow-700', icon: Globe };
  }
  if (leadType === 'skill' && countryId === 2) {
    return { label: 'Canada Operations', subtitle: 'Canada skilled client flow', path: '/admin/leads/skill-canada-operations', color: 'bg-red-600 hover:bg-red-700', icon: MapPin };
  }

  if (combined.includes('resume') || combined.includes('rms') || combined.includes('marketing')) {
    return {
      label: 'Resume Marketing Operations',
      subtitle: 'Resume marketing services',
      path: '/admin/leads/rms-operations',
      color: 'bg-purple-600 hover:bg-purple-700',
      icon: Briefcase
    };
  }

  if (combined.includes('visit') || combined.includes('tourist')) {
    return {
      label: 'Visit Visa Operations',
      subtitle: 'Visit visa client flow',
      path: '/admin/leads/visit-visa-operations',
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: FileText
    };
  }

  if (combined.includes('work visa') || combined.includes('work permit') || combined.includes('employment')) {
    return {
      label: 'Work Visa Operations',
      subtitle: 'Work permit client flow',
      path: '/admin/leads/poland-visa-operations',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      icon: Plane
    };
  }

  if (combined.includes('australia')) {
    return {
      label: 'Australia Operations',
      subtitle: 'Australia single operations module',
      path: '/admin/leads/skill-australia-operations',
      color: 'bg-yellow-600 hover:bg-yellow-700',
      icon: Globe
    };
  }

  if (combined.includes('canada')) {
    return {
      label: 'Canada Operations',
      subtitle: 'Canada client operations module',
      path: '/admin/leads/skill-canada-operations',
      color: 'bg-red-600 hover:bg-red-700',
      icon: MapPin
    };
  }

  return {
    label: 'Canada Operations',
    subtitle: 'Default client operations module',
    path: '/admin/leads/skill-canada-operations',
    color: 'bg-red-600 hover:bg-red-700',
    icon: MapPin
  };
}

function buildOperationsUrl(path: string, lead: any, opportunityId: number | null) {
  const clientName = `${lead?.fname || ''} ${lead?.lname || ''}`.trim() || 'Client';
  const id = opportunityId || Number(lead?.opportunity_id) || Number(lead?.id);
  return `${path}?opportunityId=${id}&leadId=${lead?.id}&clientName=${encodeURIComponent(clientName)}`;
}

function normalizePriorityForWizard(priority?: string) {
  const value = String(priority || 'medium').toLowerCase();
  if (value === 'critical' || value === 'urgent') return 'critical';
  if (value === 'high') return 'high';
  if (value === 'low') return 'low';
  return 'medium';
}

function ClosedStage({ lead, prospectData, quotationData, paymentData, opportunityId, currencyCode = 'AED' }: any) {
  const recommendedModule = getOperationsModule(lead);
  const RecommendedIcon = recommendedModule.icon;
  const openOperations = (path = recommendedModule.path) => {
    window.location.href = buildOperationsUrl(path, lead, opportunityId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <CheckCircle className="mr-3 text-green-600" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Opportunity Closed - Won!</h3>
          <p className="text-gray-600 text-sm">Lead successfully converted to customer</p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-lg mb-4 text-green-900">Success Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Opportunity:</span> {prospectData.opportunityName}
          </div>
          <div>
            <span className="font-medium">Total Value:</span> {currencyCode} {quotationData.total.toFixed(2)}
          </div>
          <div>
            <span className="font-medium">Amount Paid:</span> {currencyCode} {paymentData.paidAmount.toFixed(2)}
          </div>
          <div>
            <span className="font-medium">Closed Date:</span> {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-lg mb-4 text-gray-900">Process Timeline</h4>
        <div className="space-y-2 text-sm">
          {[
            'Prospect → Quotation',
            'Quotation → Payment',
            'Payment → Documents',
            'Documents → Agreement',
            'Agreement → Signed Agreement',
            'Signed Agreement → Retained',
            'Retained → Closed'
          ].map((step, index) => (
            <div key={index} className="flex items-center">
              <CheckCircle className="mr-2 text-green-600" size={16} />
              <span className="text-green-700">{step} ✓</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-lg mb-4 text-blue-900">Launch Operations</h4>
        <p className="text-sm text-blue-800 mb-4">
          Recommended module is selected from the client country and service.
        </p>

        <button
          onClick={() => openOperations()}
          className={`mb-4 w-full px-5 py-4 ${recommendedModule.color} text-white rounded-lg flex items-center justify-center text-center transition-all`}
        >
          <RecommendedIcon className="mr-3" size={24} />
          <span className="font-medium">{recommendedModule.label}</span>
          <span className="ml-3 text-sm opacity-90">{recommendedModule.subtitle}</span>
        </button>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={() => openOperations('/admin/leads/rms-operations')}
            className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex flex-col items-center justify-center text-center transition-all"
          >
            <Briefcase className="mb-2" size={24} />
            <span className="text-sm font-medium">RMS Operations</span>
            <span className="text-xs opacity-90">Resume Marketing</span>
          </button>

          <button
            onClick={() => openOperations('/admin/leads/visit-visa-operations')}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex flex-col items-center justify-center text-center transition-all"
          >
            <FileText className="mb-2" size={24} />
            <span className="text-sm font-medium">Visit Visa</span>
            <span className="text-xs opacity-90">Tourism/Family</span>
          </button>

          <button
            onClick={() => openOperations('/admin/leads/student-visa-operations')}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex flex-col items-center justify-center text-center transition-all"
          >
            <BookOpen className="mb-2" size={24} />
            <span className="text-sm font-medium">Student Visa</span>
            <span className="text-xs opacity-90">Education</span>
          </button>

          <button
            onClick={() => openOperations('/admin/leads/skill-australia-operations')}
            className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex flex-col items-center justify-center text-center transition-all"
          >
            <Globe className="mb-2" size={24} />
            <span className="text-sm font-medium">Australia Operations</span>
            <span className="text-xs opacity-90">Single Module</span>
          </button>

          <button
            onClick={() => openOperations('/admin/leads/skill-canada-operations')}
            className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex flex-col items-center justify-center text-center transition-all"
          >
            <MapPin className="mb-2" size={24} />
            <span className="text-sm font-medium">Canada Operations</span>
            <span className="text-xs opacity-90">Client Module</span>
          </button>

          <button
            onClick={() => openOperations('/admin/leads/poland-visa-operations')}
            className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex flex-col items-center justify-center text-center transition-all"
          >
            <Plane className="mb-2" size={24} />
            <span className="text-sm font-medium">Work Visa</span>
            <span className="text-xs opacity-90">Work Permit</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center font-medium">
          <Download className="mr-2" size={20} />
          Generate Report
        </button>
        <button
          onClick={() => window.location.href = '/admin/leads'}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center font-medium"
        >
          <CheckCircle className="mr-2" size={20} />
          Back to Leads
        </button>
      </div>
    </div>
  );
}
