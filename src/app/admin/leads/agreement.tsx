'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Download, Upload, CheckCircle, XCircle, Clock, AlertCircle, FileText, Send, Eye, User, Calendar, DollarSign, FileSignature, Shield, X, ChevronRight, ChevronLeft, Save, Mail, Phone, MapPin, Globe } from 'lucide-react';

interface AgreementFormData {
  leadId: number;
  agreementType: string;
  agreementTitle: string;
  terms: string;
  duration: string;
  startDate: string;
  endDate: string;
  amount: string;
  currency: string;
  specialConditions: string;
  clientSignature: string;
  clientSignatureDate: string;
  retentionStatus: 'pending' | 'approved' | 'rejected';
  retentionNotes: string;
  complianceManager: string;
  finalStatus: 'draft' | 'signed' | 'retained' | 'rejected' | 'closed';
}

interface Agreement {
  id: number;
  leadId: number;
  agreementType: string;
  agreementTitle: string;
  terms: string;
  duration: string;
  startDate: string;
  endDate: string;
  amount: string;
  currency: string;
  specialConditions: string;
  clientSignature?: string;
  clientSignatureDate?: string;
  retentionStatus: 'pending' | 'approved' | 'rejected';
  retentionNotes: string;
  complianceManager: string;
  finalStatus: 'draft' | 'signed' | 'retained' | 'rejected' | 'closed';
  created: Date;
  createdBy: string;
}

import { DmcForumLeads } from '@/models';

// Using DmcForumLeads from @/models

interface AgreementWizardProps {
  leadId?: number;
  onAgreementCreated?: (agreement: Agreement) => void;
}

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function AgreementWizard({ leadId, onAgreementCreated }: AgreementWizardProps) {
  const [agreementData, setAgreementData] = useState<AgreementFormData>({
    leadId: leadId || 0,
    agreementType: 'service',
    agreementTitle: '',
    terms: '',
    duration: '12',
    startDate: '',
    endDate: '',
    amount: '',
    currency: 'USD',
    specialConditions: '',
    clientSignature: '',
    clientSignatureDate: '',
    retentionStatus: 'pending',
    retentionNotes: '',
    complianceManager: '',
    finalStatus: 'draft'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [lead, setLead] = useState<Partial<DmcForumLeads> | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeSection, setActiveSection] = useState('details');

  useEffect(() => {
        setLead(null);
    const databaseAgreements: Agreement[] = []
    setAgreements([]);
  }, [leadId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAgreementData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    // Navigate to next section
    const sections = ['details', 'financial', 'signature', 'retention', 'status'];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    // Navigate to previous section
    const sections = ['details', 'financial', 'signature', 'retention', 'status'];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  const generateAgreementPDF = async () => {
    setIsGeneratingPDF(true);
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const pdfContent = `
AGREEMENT DOCUMENT
==================

Title: ${agreementData.agreementTitle}
Type: ${agreementData.agreementType}
Duration: ${agreementData.duration} months
Amount: ${agreementData.currency} ${agreementData.amount}

Terms and Conditions:
${agreementData.terms}

Special Conditions:
${agreementData.specialConditions}

Start Date: ${agreementData.startDate}
End Date: ${agreementData.endDate}

Client Information:
Name: ${lead?.fname} ${lead?.lname}
Email: ${lead?.email}
Phone: ${lead?.phone}
Address: ${lead?.address}

${agreementData.clientSignature ? `
Client Signature: ${agreementData.clientSignature}
Signature Date: ${agreementData.clientSignatureDate}
` : ''}

Retention Status: ${agreementData.retentionStatus}
Compliance Manager: ${agreementData.complianceManager}
${agreementData.retentionNotes ? `Retention Notes: ${agreementData.retentionNotes}` : ''}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    // Create and download PDF
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agreement_${agreementData.agreementTitle.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    setIsGeneratingPDF(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newAgreement: Agreement = {
      id: agreements.length + 1,
      ...agreementData,
      created: new Date(),
      createdBy: 'Current User'
    };

    // If signed, upload to CRM
    if (agreementData.finalStatus === 'signed' && agreementData.clientSignature) {
      console.log('Uploading signed agreement to CRM...');
    }

    setAgreements(prev => [...prev, newAgreement]);
    setSubmitted(true);
    setIsSubmitting(false);

    if (onAgreementCreated) {
      onAgreementCreated(newAgreement);
    }
  };

  const handleStatusChange = (newStatus: AgreementFormData['finalStatus']) => {
    setAgreementData(prev => ({
      ...prev,
      finalStatus: newStatus
    }));
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'details':
        return (
          <motion.div
            key="details"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="mr-2" size={20} />
                Agreement Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Agreement Type *</label>
                  <select
                    name="agreementType"
                    value={agreementData.agreementType}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="service">Service Agreement</option>
                    <option value="retainer">Retainer Agreement</option>
                    <option value="consultation">Consultation Agreement</option>
                    <option value="partnership">Partnership Agreement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Agreement Title *</label>
                  <input
                    type="text"
                    name="agreementTitle"
                    value={agreementData.agreementTitle}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter agreement title"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Terms and Conditions *</label>
                <textarea
                  name="terms"
                  value={agreementData.terms}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter detailed terms and conditions"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (months) *</label>
                  <input
                    type="number"
                    name="duration"
                    value={agreementData.duration}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={agreementData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={agreementData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'financial':
        return (
          <motion.div
            key="financial"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="mr-2" size={20} />
                Financial Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    value={agreementData.amount}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Currency *</label>
                  <select
                    name="currency"
                    value={agreementData.currency}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Special Conditions</label>
                <textarea
                  name="specialConditions"
                  value={agreementData.specialConditions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter any special conditions or clauses"
                />
              </div>
            </div>
          </motion.div>
        );

      case 'signature':
        return (
          <motion.div
            key="signature"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileSignature className="mr-2" size={20} />
                Client Signature
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  Once the client signs the document, it will be automatically uploaded to the CRM system.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Client Signature *</label>
                  <input
                    type="text"
                    name="clientSignature"
                    value={agreementData.clientSignature}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter client signature"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Signature Date *</label>
                  <input
                    type="date"
                    name="clientSignatureDate"
                    value={agreementData.clientSignatureDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {agreementData.clientSignature && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2" size={20} />
                    <span className="text-green-800 font-medium">Document Signed</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    The signed agreement will be uploaded to CRM upon completion.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'retention':
        return (
          <motion.div
            key="retention"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="mr-2" size={20} />
                Retention & Compliance
              </h3>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  Retained agreements go to the compliance manager for approval.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Retention Status *</label>
                  <select
                    name="retentionStatus"
                    value={agreementData.retentionStatus}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Compliance Manager *</label>
                  <input
                    type="text"
                    name="complianceManager"
                    value={agreementData.complianceManager}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter compliance manager name"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Retention Notes</label>
                <textarea
                  name="retentionNotes"
                  value={agreementData.retentionNotes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={agreementData.retentionStatus === 'rejected' ? 'Enter rejection reason' : 'Enter retention notes or comments'}
                />
              </div>

              {agreementData.retentionStatus === 'rejected' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="text-red-600 mr-2" size={20} />
                    <span className="text-red-800 font-medium">Retention Rejected</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Please provide detailed reason for rejection in the notes above.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'status':
        return (
          <motion.div
            key="status"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="mr-2" size={20} />
                Final Status
              </h3>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                  If approved, the lead status will be updated to "Won" and the agreement will be closed.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Final Status *</label>
                  <select
                    name="finalStatus"
                    value={agreementData.finalStatus}
                    onChange={(e) => handleStatusChange(e.target.value as AgreementFormData['finalStatus'])}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="signed">Signed</option>
                    <option value="retained">Retained</option>
                    <option value="rejected">Rejected</option>
                    <option value="closed">Closed (Won)</option>
                  </select>
                </div>
              </div>

              {agreementData.finalStatus === 'closed' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-2" size={20} />
                    <span className="text-green-800 font-medium">Lead Won!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    The lead has been successfully converted and the agreement is closed.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Agreement Created Successfully!</h3>
            <p className="text-sm text-gray-500 mb-4">
              The agreement has been {agreementData.finalStatus === 'closed' ? 'closed and the lead marked as won' : 'processed'}.
              {agreementData.clientSignature && ' The signed document has been uploaded to CRM.'}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setActiveSection('details');
                setAgreementData({
                  leadId: leadId || 0,
                  agreementType: 'service',
                  agreementTitle: '',
                  terms: '',
                  duration: '12',
                  startDate: '',
                  endDate: '',
                  amount: '',
                  currency: 'USD',
                  specialConditions: '',
                  clientSignature: '',
                  clientSignatureDate: '',
                  retentionStatus: 'pending',
                  retentionNotes: '',
                  complianceManager: '',
                  finalStatus: 'draft'
                });
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Another Agreement
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Agreement Generation Wizard</h2>
            <button
              onClick={() => window.close()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Lead Information */}
          {lead && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <User className="mr-2" size={16} />
                <span className="font-medium">{lead.fname} {lead.lname}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <Mail className="mr-2" size={14} />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2" size={14} />
                  <span>{lead.phone}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="mr-2" size={14} />
                  <span>{lead.nationality}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section Navigation */}
          <div className="flex items-center justify-between mt-6">
            {['details', 'financial', 'signature', 'retention', 'status'].map((section, index) => (
              <div key={section} className="flex items-center">
                <button
                  onClick={() => setActiveSection(section)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${activeSection === section
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                >
                  {index + 1}
                </button>
                {index < 4 && (
                  <div
                    className={`w-full h-1 mx-2 ${['details', 'financial', 'signature', 'retention', 'status'].indexOf(activeSection) > index ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Details</span>
            <span>Financial</span>
            <span>Signature</span>
            <span>Retention</span>
            <span>Status</span>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-64 p-6 border-r border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-4">SECTIONS</h3>
            <nav className="space-y-2">
              {[
                { id: 'details', label: 'Agreement Details', icon: FileText },
                { id: 'financial', label: 'Financial Details', icon: DollarSign },
                { id: 'signature', label: 'Client Signature', icon: FileSignature },
                { id: 'retention', label: 'Retention & Compliance', icon: Shield },
                { id: 'status', label: 'Final Status', icon: CheckCircle }
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === section.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <section.icon className="mr-3" size={16} />
                  {section.label}
                </button>
              ))}
            </nav>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">QUICK ACTIONS</h3>
              <div className="space-y-2">
                <button
                  onClick={generateAgreementPDF}
                  disabled={isGeneratingPDF}
                  className="w-full flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2" size={16} />
                      Generate PDF
                    </>
                  )}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={16} />
                      Save Agreement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <AnimatePresence mode="wait">
              {renderSection()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={activeSection === 'details'}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="mr-2" size={20} />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={activeSection === 'status'}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Existing Agreements */}
        {agreements.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Existing Agreements</h3>
            <div className="space-y-3">
              {agreements.map((agreement) => (
                <div key={agreement.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{agreement.agreementTitle}</h4>
                      <p className="text-sm text-gray-600">{agreement.agreementType} • {agreement.currency} {agreement.amount}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {agreement.finalStatus === 'closed' && <CheckCircle className="text-green-600" size={16} />}
                      {agreement.finalStatus === 'rejected' && <XCircle className="text-red-600" size={16} />}
                      {agreement.finalStatus === 'signed' && <FileSignature className="text-blue-600" size={16} />}
                      {agreement.finalStatus === 'retained' && <Clock className="text-yellow-600" size={16} />}
                      <span className="text-sm font-medium capitalize">{agreement.finalStatus}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span>Duration: {agreement.duration} months</span>
                    <span className="mx-2">•</span>
                    <span>Created: {agreement.created.toLocaleDateString()}</span>
                    {agreement.clientSignature && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Signed: {agreement.clientSignatureDate}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



