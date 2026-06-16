'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DmcForumLeads } from '@/models';

interface QuotationWizardProps {
  leadId: number;
  onQuotationCreated: (quotationId: number) => void;
}

export default function QuotationWizard({ leadId, onQuotationCreated }: QuotationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [quotationData, setQuotationData] = useState({
    leadId: leadId,
    quotationNumber: '',
    validUntil: '',
    discountType: 'percentage',
    discountValue: '',
    discountReason: '',
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: '',
        total: ''
      }
    ],
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
    terms: '',
    notes: '',
    status: 'pending',
    approvedBy: null,
    approvedDate: null,
  });

  const [leads, setLeads] = useState<DmcForumLeads[]>([]);
  const [lead, setLead] = useState<DmcForumLeads | null>(null);
  const [loading, setLoading] = useState(true);
  const [existingQuotations, setExistingQuotations] = useState<any[]>([]);

  useEffect(() => {
    // Load lead data
        setLead(null);

    // Load existing quotations
    const databaseQuotations = []
    setExistingQuotations([]);
    setLoading(false);
  }, [leadId]);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    setQuotationData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...quotationData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calculate item total
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(String(newItems[index].quantity)) || 0;
      const unitPrice = parseFloat(String(newItems[index].unitPrice)) || 0;
      newItems[index].total = (quantity * unitPrice).toString();
    }

    setQuotationData(prev => ({ ...prev, items: newItems }));
    calculateTotals(newItems);
  };

  const addItem = () => {
    setQuotationData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unitPrice: '',
        total: ''
      }]
    }));
  };

  const removeItem = (index: number) => {
    const newItems = quotationData.items.filter((_, i) => i !== index);
    setQuotationData(prev => ({ ...prev, items: newItems }));
    calculateTotals(newItems);
  };

  const calculateTotals = (items = quotationData.items) => {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    let discountAmount = 0;

    if (quotationData.discountType === 'percentage') {
      discountAmount = subtotal * (parseFloat(quotationData.discountValue) || 0) / 100;
    } else {
      discountAmount = parseFloat(quotationData.discountValue) || 0;
    }

    const taxAmount = (subtotal - discountAmount) * 0.05; // 5% tax
    const totalAmount = subtotal - discountAmount + taxAmount;

    setQuotationData(prev => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount
    }));
  };

  const generateQuotationNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `QT-${year}-${random}`;
  };

  const createQuotation = async () => {
    try {
      const quotationNumber = generateQuotationNumber();
      const finalData = {
        ...quotationData,
        quotationNumber,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      };

      const response = await fetch('/api/admin/quotations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        const result = await response.json();
        onQuotationCreated(result.quotationId);
        setCurrentStep(4); // Success step
      } else {
        throw new Error('Failed to create quotation');
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
      alert('Failed to create quotation. Please try again.');
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const renderStep = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={stepVariants}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <motion.h2
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Step 1: Quotation Details
              </motion.h2>

              {/* Lead Information */}
              {lead && (
                <motion.div
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Lead Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {lead.fname} {lead.lname}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {lead.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {lead.phone}
                    </div>
                    <div>
                      <span className="font-medium">Country:</span> {lead.nationality}
                    </div>
                    <div>
                      <span className="font-medium">Program:</span> {lead.service_interest}
                    </div>
                    <div>
                      <span className="font-medium">Source:</span> {lead.market_source}
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                className="bg-white rounded-lg shadow p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until *</label>
                    <input
                      type="date"
                      value={quotationData.validUntil}
                      onChange={(e) => handleInputChange('validUntil', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </motion.div>
                </div>
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                  <textarea
                    value={quotationData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter terms and conditions..."
                  />
                </motion.div>
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={quotationData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes..."
                  />
                </motion.div>
              </motion.div>
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next Step
                </motion.button>
              </motion.div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <motion.h2
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Step 2: Line Items
              </motion.h2>
              <motion.div
                className="bg-white rounded-lg shadow p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-4">
                  {quotationData.items.map((item, index) => (
                    <motion.div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Item description"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex items-end space-x-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                            <input
                              type="text"
                              value={item.total}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                          </div>
                          {quotationData.items.length > 1 && (
                            <motion.button
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800 p-2"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  onClick={addItem}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Add Item
                </motion.button>
              </motion.div>
              <div className="flex justify-between">
                <motion.button
                  onClick={handlePrevious}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Previous
                </motion.button>
                <motion.button
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next Step
                </motion.button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <motion.h2
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Step 3: Discount & Approval
              </motion.h2>
              <motion.div
                className="bg-white rounded-lg shadow p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">${quotationData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-red-600">-${quotationData.discountAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (5%):</span>
                        <span className="font-medium">${quotationData.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-blue-600">${quotationData.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Discount Approval</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                        <select
                          value={quotationData.discountType}
                          onChange={(e) => handleInputChange('discountType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                        </select>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount {quotationData.discountType === 'percentage' ? '(%)' : '($)'}
                        </label>
                        <input
                          type="number"
                          value={quotationData.discountValue}
                          onChange={(e) => {
                            handleInputChange('discountValue', e.target.value);
                            calculateTotals();
                          }}
                          min="0"
                          max={quotationData.discountType === 'percentage' ? '100' : undefined}
                          step={quotationData.discountType === 'percentage' ? '1' : '0.01'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={quotationData.discountType === 'percentage' ? '10' : '1000'}
                        />
                      </motion.div>
                    </div>
                    <motion.div
                      className="mt-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount Reason</label>
                      <textarea
                        value={quotationData.discountReason}
                        onChange={(e) => handleInputChange('discountReason', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Reason for discount approval..."
                      />
                    </motion.div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Required</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-yellow-800">Discount Approval Required</p>
                          <p className="text-xs text-yellow-700">This quotation requires manager approval due to the discount amount.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="flex justify-between">
                <motion.button
                  onClick={handlePrevious}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Previous
                </motion.button>
                <motion.button
                  onClick={createQuotation}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Quotation
                </motion.button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <motion.div
                className="bg-green-50 border border-green-200 rounded-lg p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-green-800">
                    <motion.svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </motion.svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Quotation Created Successfully!</h3>
                  <p className="text-green-700 mb-4">
                    Quotation Number: {generateQuotationNumber()}
                  </p>
                  <p className="text-green-700 mb-4">
                    Your quotation has been created and is pending approval.
                  </p>
                </motion.div>
                <motion.div
                  className="flex justify-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={() => setCurrentStep(1)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Another
                  </motion.button>
                  <motion.button
                    onClick={() => window.print()}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Print Quotation
                  </motion.button>
                  <motion.button
                    onClick={() => window.close()}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <motion.h1
              className="text-3xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Quotation Generator
            </motion.h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Lead ID: #{leadId}</span>
              <motion.button
                onClick={() => window.close()}
                className="text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1, rotate: 90 }}
                transition={{ type: "spring" }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((step) => (
                  <motion.div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                      }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring" }}
                  >
                    {step}
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="text-sm text-gray-600"
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Step {currentStep} of 4
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg p-6">
            {renderStep()}
          </div>

          {/* Existing Quotations */}
          {existingQuotations.length > 0 && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Existing Quotations</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quotation Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {existingQuotations.map((quot: any, index) => (
                      <motion.tr
                        key={quot.id}
                        className="hover:bg-gray-50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{quot.quotationNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${quot.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${quot.discount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${quot.total.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${quot.status === 'approved' ? 'bg-green-100 text-green-800' :
                            quot.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {quot.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <motion.button
                            className="text-blue-600 hover:text-blue-800 mr-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            View
                          </motion.button>
                          <motion.button
                            className="text-gray-600 hover:text-gray-800 mr-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            Edit
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}



