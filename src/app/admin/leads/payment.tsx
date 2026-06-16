'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DmcForumLeads } from '@/models';

interface PaymentWizardProps {
  leadId: number;
  onPaymentProcessed: (paymentId: number) => void;
}

interface Payment {
  id: number;
  amount: number;
  method: string;
  date: string;
  status: string;
  receiptNumber: string;
}

export default function PaymentWizard({ leadId, onPaymentProcessed }: PaymentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    leadId: leadId,
    payments: [
      {
        amount: '',
        method: 'cash',
        date: new Date().toISOString().split('T')[0],
        reference: '',
        notes: ''
      }
    ],
    totalAmount: 0,
    receiptNumber: '',
    generateReceipt: true,
    sendEmail: false,
    emailRecipient: ''
  });

  const [lead, setLead] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [existingPayments, setExistingPayments] = useState<Payment[]>([]);
  const [receiptPreview, setReceiptPreview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const leadResponse = await fetch(`/api/leads/${leadId}`);
        if (!leadResponse.ok) throw new Error('Failed to fetch lead');
        const leadData = await leadResponse.json();
        setLead(leadData);

        // Load existing payments
        const paymentResponse = await fetch(`/api/admin/payments?type=thirdparty&search=${leadId}`);
        if (paymentResponse.ok) {
          const { data } = await paymentResponse.json();
          setExistingPayments(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (leadId) fetchData();
  }, [leadId]);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field: string, value: any) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (index: number, field: string, value: any) => {
    const newPayments = [...paymentData.payments];
    newPayments[index] = { ...newPayments[index], [field]: value };
    setPaymentData(prev => ({ ...prev, payments: newPayments }));

    // Calculate total
    const total = newPayments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    setPaymentData(prev => ({ ...prev, totalAmount: total }));
  };

  const addPayment = () => {
    setPaymentData(prev => ({
      ...prev,
      payments: [...prev.payments, {
        amount: '',
        method: 'cash',
        date: new Date().toISOString().split('T')[0],
        reference: '',
        notes: ''
      }]
    }));
  };

  const removePayment = (index: number) => {
    const newPayments = paymentData.payments.filter((_, i) => i !== index);
    setPaymentData(prev => ({ ...prev, payments: newPayments }));

    // Recalculate total
    const total = newPayments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    setPaymentData(prev => ({ ...prev, totalAmount: total }));
  };

  const generateReceiptNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RCP-${year}-${random}`;
  };

  const processPayments = async () => {
    try {
      const receiptNumber = generateReceiptNumber();
      const finalData = {
        ...paymentData,
        receiptNumber,
        emailRecipient: paymentData.sendEmail ? (lead?.email || '') : ''
      };

      const response = await fetch('/api/admin/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        const result = await response.json();
        onPaymentProcessed(result.paymentId);
        setCurrentStep(4); // Success step
      } else {
        throw new Error('Failed to process payments');
      }
    } catch (error) {
      console.error('Error processing payments:', error);
      alert('Failed to process payments. Please try again.');
    }
  };

  const downloadReceipt = () => {
    // Generate PDF receipt (mock implementation)
    const receiptContent = `
      RECEIPT #${paymentData.receiptNumber}
      Date: ${new Date().toLocaleDateString()}
      
      Client: ${lead?.fname} ${lead?.lname}
      Email: ${lead?.email}
      Phone: ${lead?.phone}
      
      Payment Details:
      ${paymentData.payments.map((payment, index) => `
      ${index + 1}. Amount: $${payment.amount}
         Method: ${payment.method.replace('_', ' ').toUpperCase()}
         Date: ${payment.date}
         Reference: ${payment.reference || 'N/A'}
      `).join('')}
      
      Total Amount: $${paymentData.totalAmount.toFixed(2)}
      
      Thank you for your payment!
    `;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentData.receiptNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
                Step 1: Payment Information
              </motion.h2>

              {/* Lead Information */}
              {lead && (
                <motion.div
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Client Information</h3>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  {paymentData.payments.map((payment, index) => (
                    <motion.div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                          <input
                            type="number"
                            value={payment.amount}
                            onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                          <select
                            value={payment.method}
                            onChange={(e) => handlePaymentChange(index, 'method', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="cash">Cash</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="debit_card">Debit Card</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="cheque">Cheque</option>
                            <option value="online">Online Payment</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                          <input
                            type="date"
                            value={payment.date}
                            onChange={(e) => handlePaymentChange(index, 'date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                          <input
                            type="text"
                            value={payment.reference}
                            onChange={(e) => handlePaymentChange(index, 'reference', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Transaction ID"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                          value={payment.notes}
                          onChange={(e) => handlePaymentChange(index, 'notes', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Payment notes..."
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  onClick={addPayment}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Add Payment
                </motion.button>
              </motion.div>
              <motion.div
                className="flex justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
                Step 2: Receipt Generation
              </motion.h2>
              <motion.div
                className="bg-white rounded-lg shadow p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                    <div className="space-y-2">
                      {paymentData.payments.map((payment, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>Payment {index + 1} ({payment.method.replace('_', ' ').toUpperCase()}):</span>
                          <span className="font-medium">${parseFloat(payment.amount || '0').toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total Amount:</span>
                        <span className="text-blue-600">${paymentData.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Receipt Options</h3>
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={paymentData.generateReceipt}
                            onChange={(e) => handleInputChange('generateReceipt', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700">Generate PDF Receipt</span>
                        </label>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={paymentData.sendEmail}
                            onChange={(e) => handleInputChange('sendEmail', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium text-gray-700">Send Receipt via Email</span>
                        </label>
                      </motion.div>
                      {paymentData.sendEmail && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Recipient</label>
                          <input
                            type="email"
                            value={paymentData.emailRecipient}
                            onChange={(e) => handleInputChange('emailRecipient', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Recipient email"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.button
                      onClick={() => setReceiptPreview(true)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors mr-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Preview Receipt
                    </motion.button>
                  </motion.div>
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
                  onClick={processPayments}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Process Payments
                </motion.button>
              </div>
            </div>
          )}

          {currentStep === 3 && receiptPreview && (
            <div className="space-y-6">
              <motion.h2
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Receipt Preview
              </motion.h2>
              <motion.div
                className="bg-white rounded-lg shadow p-8 border-2 border-gray-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">PAYMENT RECEIPT</h1>
                  <p className="text-gray-600">Receipt #: {generateReceiptNumber()}</p>
                  <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Client Information:</h3>
                  <p className="text-sm text-gray-700">{lead?.fname} {lead?.lname}</p>
                  <p className="text-sm text-gray-700">{lead?.email}</p>
                  <p className="text-sm text-gray-700">{lead?.phone}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Details:</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Method</th>
                        <th className="text-left py-2">Date</th>
                        <th className="text-left py-2">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentData.payments.map((payment, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">${parseFloat(payment.amount || '0').toFixed(2)}</td>
                          <td className="py-2">{payment.method.replace('_', ' ').toUpperCase()}</td>
                          <td className="py-2">{payment.date}</td>
                          <td className="py-2">{payment.reference || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="pt-2 font-semibold">Total:</td>
                        <td className="pt-2 font-semibold">${paymentData.totalAmount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>Thank you for your payment!</p>
                  <p>This receipt serves as proof of payment.</p>
                </div>
              </motion.div>
              <div className="flex justify-between">
                <motion.button
                  onClick={() => setReceiptPreview(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back
                </motion.button>
                <motion.button
                  onClick={downloadReceipt}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Download PDF
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
                  <h3 className="text-xl font-bold text-green-800 mb-2">Payment Processed Successfully!</h3>
                  <p className="text-green-700 mb-4">
                    Receipt Number: {generateReceiptNumber()}
                  </p>
                  <p className="text-green-700 mb-4">
                    Total Amount: ${paymentData.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-green-700 mb-4">
                    Your payment has been processed and receipt generated.
                  </p>
                </motion.div>
                <motion.div
                  className="flex justify-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={downloadReceipt}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download Receipt
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Process Another
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
              Payment Processing
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

          {/* Existing Payments */}
          {existingPayments.length > 0 && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment History</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Receipt Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
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
                    {existingPayments.map((payment: any, index) => (
                      <motion.tr
                        key={payment.id}
                        className="hover:bg-gray-50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.receiptNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${payment.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.method.replace('_', ' ').toUpperCase()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{payment.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                            }`}>
                            {payment.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <motion.button
                            className="text-blue-600 hover:text-blue-800 mr-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            View Receipt
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

