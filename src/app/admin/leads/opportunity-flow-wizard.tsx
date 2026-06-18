'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead } from '@/types/lead';
import { useAuth } from '@/contexts/AuthContext';
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
}

interface DocumentData {
  documents: Array<{
    name: string;
    category: string;
    status: string;
    uploadDate: string;
  }>;
  allDocsVerified: boolean;
}

interface AgreementData {
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
    serviceRequired: ''
  });

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
    paymentDate: new Date().toISOString().split('T')[0]
  });

  const [documentData, setDocumentData] = useState<DocumentData>({
    documents: [],
    allDocsVerified: false
  });

  const [agreementData, setAgreementData] = useState<AgreementData>({
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
    companyAddress: ''
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

  const hydrateFlowFromLead = (leadData: Lead & Record<string, any>) => {
    const clientName = `${leadData.fname || ''} ${leadData.lname || ''}`.trim() || `Lead #${leadData.id}`;
    const service = leadData.service_interest || '';
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
    if (activeStage === 'quotation' && quotationData.discount > 0 && retentionData.discountStatus !== 'approved') {
      alert('Discount approval is required before continuing. The request must be approved by Director of Sales or Branch Manager.');
      return;
    }

    if (activeStage === 'signed-agreement') {
      if (!signedAgreementData.documentUrl || !signedAgreementData.uploadedTocrm) {
        alert('Upload the signed agreement before submitting it for compliance approval.');
        return;
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
      alert('Discount approval is required before moving past quotation. Please request approval and wait for BM or Director of Sales approval in Discount Management.');
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
        alert('Discount request submitted successfully. Director of Sales or Branch Manager must approve before payment stage is available.');
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
          documentsVerified: documentData.allDocsVerified
        },
        paymentData: {
          totalAmount: quotationData.total || paymentData.totalAmount || 0,
          amount: paymentData.paidAmount || paymentData.totalAmount || quotationData.total || 0,
          paidAmount: paymentData.paidAmount || 0,
          paymentMethod: paymentData.paymentMethod || 'cash',
          paymentDate: paymentData.paymentDate,
          transactionId: paymentData.transactionId,
          discountAmount: quotationData.discount || 0
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
          onNext={moveToNextStage}
        />;
      case 'quotation':
        return <QuotationStage
          lead={lead}
          data={quotationData}
          setData={setQuotationData}
          retentionData={retentionData}
          onRequestDiscount={handleRequestDiscount}
          onRefreshDiscount={refreshDiscountApproval}
          onDiscountChanged={handleDiscountChanged}
          onNext={moveToNextStage}
          onPrevious={moveToPreviousStage}
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
      case 'documents':
        return <DocumentsStage
          lead={lead}
          data={documentData}
          setData={setDocumentData}
          onNext={moveToNextStage}
          onPrevious={moveToPreviousStage}
        />;
      case 'agreement':
        return <AgreementStage
          lead={lead}
          data={agreementData}
          setData={setAgreementData}
          onNext={moveToNextStage}
          onPrevious={moveToPreviousStage}
        />;
      case 'signed-agreement':
        return <SignedAgreementStage
          lead={lead}
          data={signedAgreementData}
          setData={setSignedAgreementData}
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

// Stage Components
function ProspectStage({ lead, data, setData, onNext }: any) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Replace with actual API call
      console.log('Saving prospect data:', data);
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Prospect data saved successfully!');
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
              <input
                type="text"
                value={data.serviceRequired}
                onChange={(e) => setData({ ...data, serviceRequired: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Express Entry, Student Visa"
              />
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="mr-2 text-blue-600" size={20} />
          <span className="text-sm text-blue-800">Complete all required fields before proceeding to quotation stage.</span>
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
          disabled={!data.opportunityName || !data.estimatedValue || !data.serviceRequired}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center font-medium"
        >
          Continue to Quotation
          <ChevronRight className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );
}

function QuotationStage({ lead, data, setData, retentionData, onRequestDiscount, onRefreshDiscount, onDiscountChanged, onNext, onPrevious }: any) {
  const [saving, setSaving] = useState(false);

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
      </div>

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
                <span className="text-sm font-medium text-gray-700">Total: ${item.total || '0.00'}</span>
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
            <span className="font-medium">${data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span className="font-medium text-red-600">-${data.discount.toFixed(2)}</span>
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
                    Pending BM / Director of Sales approval in Discount Management.
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
            <span className="font-medium">${data.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span className="text-blue-600">${data.total.toFixed(2)}</span>
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

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving payment data:', data);
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Payment data saved successfully!');
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
          </div>
        </div>
      </div>

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
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center font-medium"
          >
            <Save className="mr-2" size={20} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium"
          >
            Continue to Documents
            <ChevronRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentsStage({ lead, data, setData, onNext, onPrevious }: any) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving documents data:', data);
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Documents saved successfully!');
      onNext();
    } catch (error) {
      console.error('Error requesting discount:', error);
      alert('Error requesting discount');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents & Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passport Copy
            </label>
            <input
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              onChange={(e) => setData({...data, passportCopy: e.target.files?.[0]})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Educational Documents
            </label>
            <input
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              onChange={(e) => setData({...data, educationalDocs: e.target.files?.[0]})}
            />
          </div>
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
          Previous
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
}

  const handleProcessReassignment = async () => {
  // Implementation here
};

function AgreementStage({ lead, data, setData, onNext, onPrevious }: any) {
  const [saving, setSaving] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving agreement data:', data);
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Agreement saved successfully!');
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
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 48;
      const contentWidth = pageWidth - margin * 2;
      const clientName = [lead?.fname, lead?.lname].filter(Boolean).join(' ') || lead?.name || 'Client';
      const title = data.agreementTitle || `Service Agreement - ${clientName}`;
      const amount = data.amount || lead?.payTotal || lead?.demandAmt || lead?.amount || 'Not specified';
      let y = margin;

      const addPageIfNeeded = (height = 24) => {
        if (y + height > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      const addText = (text: string, options: { size?: number; bold?: boolean; gap?: number } = {}) => {
        const lines = doc.splitTextToSize(text || 'Not specified', contentWidth);
        addPageIfNeeded(lines.length * 16 + (options.gap || 10));
        doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
        doc.setFontSize(options.size || 11);
        doc.text(lines, margin, y);
        y += lines.length * 16 + (options.gap || 10);
      };

      const addField = (label: string, value?: string | number | null) => {
        addText(`${label}: ${value || 'Not specified'}`, { size: 10, gap: 6 });
      };

      const addSection = (heading: string) => {
        addPageIfNeeded(34);
        y += y === margin ? 0 : 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(heading, margin, y);
        y += 18;
        doc.setDrawColor(210, 210, 210);
        doc.line(margin, y, pageWidth - margin, y);
        y += 16;
      };

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(title, margin, y);
      y += 26;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);
      y += 24;

      addSection('Agreement Details');
      addField('Agreement Type', data.agreementType);
      addField('Duration', data.duration ? `${data.duration} months` : null);
      addField('Start Date', data.startDate);
      addField('End Date', data.endDate);
      addField('Agreement Amount', amount);

      addSection('Client Details');
      addField('Client Name', clientName);
      addField('Email', lead?.email);
      addField('Phone', lead?.phone || lead?.mobile);
      addField('Nationality', lead?.nationality);
      addField('Address', lead?.address);

      addSection('Service Details');
      addField('Service Interest', lead?.service_interest);
      addField('Company Name', data.companyName);
      addField('Company Address', data.companyAddress);

      addSection('Terms and Conditions');
      addText(data.terms || 'Standard service agreement terms apply.', { size: 10, gap: 10 });

      if (data.specialConditions) {
        addSection('Special Conditions');
        addText(data.specialConditions, { size: 10, gap: 10 });
      }

      addSection('Signatures');
      addText('Client Signature: ________________________________', { size: 10, gap: 18 });
      addText('Authorized Signature: ____________________________', { size: 10, gap: 18 });
      addText('Date: ____________________', { size: 10, gap: 6 });

      const safeFileName = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || 'agreement';

      doc.save(`${safeFileName}.pdf`);
      setData({ ...data, status: 'generated' });
    } catch (error) {
      console.error('Error generating agreement PDF:', error);
      alert('Failed to generate agreement PDF');
    } finally {
      setGeneratingPdf(false);
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

      <button
        onClick={downloadAgreementPdf}
        disabled={generatingPdf}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center font-medium"
      >
        <Download className="mr-2" size={20} />
        {generatingPdf ? 'Generating PDF...' : 'Save Agreement Template'}
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

function SignedAgreementStage({ lead, data, setData, complianceStatus, onNext, onPrevious }: any) {
  const handleFileSelect = (file?: File) => {
    if (!file) return;
    setData({
      ...data,
      documentUrl: `/uploads/signed-agreements/${Date.now()}-${file.name}`,
      uploadedTocrm: true
    });
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

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <FileSignature className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600 mb-4">
          {data.documentUrl ? `Uploaded to CRM: ${data.documentUrl.split('/').pop()}` : 'Upload signed agreement PDF'}
        </p>
        <label className="inline-flex px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
          <Upload className="mr-2" size={20} />
          Choose File
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
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
          Submit for Compliance
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
  const combined = `${country} ${service}`;

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

function ClosedStage({ lead, prospectData, quotationData, paymentData, opportunityId }: any) {
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
            <span className="font-medium">Total Value:</span> ${quotationData.total.toFixed(2)}
          </div>
          <div>
            <span className="font-medium">Amount Paid:</span> ${paymentData.paidAmount.toFixed(2)}
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
