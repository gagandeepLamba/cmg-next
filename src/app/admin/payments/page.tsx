'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ThirdPartyPayment {
  id: number;
  leadId: number;
  date: Date | null;
  currency_id: number;
  amount: number;
  Tax: number;
  payMethod: string | null;
  emp_id: number;
  receipt_date: Date | null;
  cc_number: string;
  receipt: string;
  counselor_receipt: string;
  trans_or_ref_number: string;
  remarks: string;
  payoption?: string;
  paycardoption?: string;
}

interface LeadFee {
  id: number;
  lead: number;
  amount: number;
  taxAmt: number;
  payDate: Date;
  paidAmt: number;
  paidDate: Date;
  profAmt: number;
  status: number;
}

interface OpportunityPayment {
  id: number;
  opportunityId: number;
  paymentNumber: string;
  receiptNumber: string | null;
  totalAmount: number;
  amount: number;
  paidAmount: number;
  remainingBalance: number;
  currency: string;
  paymentMethod: string;
  paymentDate: Date | null;
  status: string;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  serviceName: string | null;
  branchName: string | null;
  consultantName: string | null;
  taxAmount: number;
  discountAmount: number;
  dmcOpportunity?: {
    id: number;
    opportunityName: string;
  };
  createdEmployee?: {
    id: number;
    name: string;
  };
}

export default function PaymentsManagement() {
  const router = useRouter();
  const [opportunityPayments, setOpportunityPayments] = useState<OpportunityPayment[]>([]);
  const [payments, setPayments] = useState<ThirdPartyPayment[]>([]);
  const [leadFees, setLeadFees] = useState<LeadFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<ThirdPartyPayment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'opportunity' | 'thirdparty' | 'fees'>('opportunity');

  useEffect(() => {
    fetchPayments();
  }, []);

  const toNumber = (value: unknown) => Number(value || 0);

  const normalizeOpportunityPayment = (payment: any): OpportunityPayment => ({
    ...payment,
    totalAmount: toNumber(payment.totalAmount),
    amount: toNumber(payment.amount),
    paidAmount: toNumber(payment.paidAmount),
    remainingBalance: toNumber(payment.remainingBalance),
    taxAmount: toNumber(payment.taxAmount),
    discountAmount: toNumber(payment.discountAmount),
    paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : null,
    receiptNumber: payment.receiptNumber || '',
    paymentNumber: payment.paymentNumber || '',
    paymentMethod: payment.paymentMethod || '',
    status: payment.status || 'pending',
  });

  const normalizePayment = (payment: ThirdPartyPayment): ThirdPartyPayment => ({
    ...payment,
    amount: toNumber(payment.amount),
    Tax: toNumber(payment.Tax),
    receipt: payment.receipt || '',
    trans_or_ref_number: payment.trans_or_ref_number || '',
    payMethod: payment.payMethod || '',
    date: payment.date ? new Date(payment.date) : new Date(0),
    receipt_date: payment.receipt_date ? new Date(payment.receipt_date) : new Date(0),
    payoption: payment.payoption || '',
    paycardoption: payment.paycardoption || '',
  });

  const normalizeFee = (fee: LeadFee): LeadFee => ({
    ...fee,
    amount: toNumber(fee.amount),
    taxAmt: toNumber(fee.taxAmt),
    paidAmt: toNumber(fee.paidAmt),
    profAmt: toNumber(fee.profAmt),
    payDate: fee.payDate ? new Date(fee.payDate) : new Date(0),
    paidDate: fee.paidDate ? new Date(fee.paidDate) : new Date(0),
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      const [opportunityResponse, thirdPartyResponse, feesResponse] = await Promise.all([
        fetch('/api/opportunity-payments'),
        fetch('/api/admin/payments?type=thirdparty&limit=100'),
        fetch('/api/admin/payments?type=fees&limit=100'),
      ]);
      if (!opportunityResponse.ok || !thirdPartyResponse.ok || !feesResponse.ok) {
        throw new Error('Failed to fetch payments');
      }
      const [opportunityResult, thirdPartyResult, feesResult] = await Promise.all([
        opportunityResponse.json(),
        thirdPartyResponse.json(),
        feesResponse.json(),
      ]);
      setOpportunityPayments((Array.isArray(opportunityResult) ? opportunityResult : []).map(normalizeOpportunityPayment));
      setPayments((thirdPartyResult.data || []).map(normalizePayment));
      setLeadFees((feesResult.data || []).map(normalizeFee));
    } catch (error) {
      console.error('Failed to load payments:', error);
      setError(error instanceof Error ? error.message : 'Failed to load payments');
      setOpportunityPayments([]);
      setPayments([]);
      setLeadFees([]);
    } finally {
      setLoading(false);
    }
  };

  const loweredSearch = searchTerm.toLowerCase();

  const filteredOpportunityPayments = opportunityPayments.filter(payment =>
    (payment.paymentNumber || '').toLowerCase().includes(loweredSearch) ||
    (payment.receiptNumber || '').toLowerCase().includes(loweredSearch) ||
    (payment.clientName || '').toLowerCase().includes(loweredSearch) ||
    (payment.serviceName || '').toLowerCase().includes(loweredSearch) ||
    String(payment.opportunityId || '').includes(searchTerm)
  );

  const filteredPayments = payments.filter(payment =>
    (payment.receipt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.trans_or_ref_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFees = leadFees.filter(fee =>
    String(fee.lead || '').includes(searchTerm)
  );

  const handleViewPayment = (payment: ThirdPartyPayment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getPaymentMethodColor = (method: string | null) => {
    switch (method) {
      case 'Credit Card':
        return 'bg-blue-100 text-blue-800';
      case 'Bank Transfer':
        return 'bg-green-100 text-green-800';
      case 'Cash':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all payments and fees</p>
        </div>
        <button
          onClick={() => router.push('/admin/opportunity-payments/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Payment
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('opportunity')}
              className={`py-2 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'opportunity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Opportunity Payments
            </button>
            <button
              onClick={() => setActiveTab('thirdparty')}
              className={`py-2 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'thirdparty'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Third Party Payments
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`py-2 px-4 text-sm font-medium border-b-2 ${
                activeTab === 'fees'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lead Fees
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={
                activeTab === 'opportunity'
                  ? 'Search by payment, receipt, client, service, or opportunity ID...'
                  : activeTab === 'thirdparty'
                    ? 'Search by receipt or transaction number...'
                    : 'Search by lead ID...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Payment Methods</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Opportunity Payments Table */}
      {activeTab === 'opportunity' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOpportunityPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.paymentNumber}</div>
                      <div className="text-sm text-gray-500">{payment.receiptNumber || 'No receipt'}</div>
                      <div className="text-xs text-gray-400">Opportunity #{payment.opportunityId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.clientName || 'Client'}</div>
                      <div className="text-sm text-gray-500">{payment.clientPhone || payment.clientEmail || ''}</div>
                      <div className="text-xs text-gray-400">{payment.consultantName || payment.createdEmployee?.name || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.serviceName || payment.dmcOpportunity?.opportunityName || 'Service'}</div>
                      <div className="text-sm text-gray-500">{payment.branchName || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.currency} {payment.paidAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">Total {payment.totalAmount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.currency} {payment.remainingBalance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(payment.paymentMethod)}`}>
                        {payment.paymentMethod || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'paid' || payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {payment.status}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {payment.paymentDate?.toLocaleDateString() || 'No date'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOpportunityPayments.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-500">
              No opportunity payments found.
            </div>
          )}
        </div>
      )}

      {/* Third Party Payments Table */}
      {activeTab === 'thirdparty' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.receipt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.leadId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${payment.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${payment.Tax.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(payment.payMethod)}`}>
                        {payment.payMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.date?.toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewPayment(payment)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPayments.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-500">
              No third party payments found.
            </div>
          )}
        </div>
      )}

      {/* Lead Fees Table */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professional Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{fee.lead}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${fee.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${fee.taxAmt.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${fee.paidAmt.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${fee.profAmt.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fee.status)}`}>
                        {fee.status === 1 ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(fee.payDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredFees.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-500">
              No lead fees found.
            </div>
          )}
        </div>
      )}

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Payment Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Payment Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Receipt Number:</span> {selectedPayment.receipt}</p>
                    <p><span className="font-medium">Lead ID:</span> {selectedPayment.leadId}</p>
                    <p><span className="font-medium">Amount:</span> ${selectedPayment.amount.toFixed(2)}</p>
                    <p><span className="font-medium">Tax:</span> ${selectedPayment.Tax.toFixed(2)}</p>
                    <p><span className="font-medium">Total:</span> ${(selectedPayment.amount + selectedPayment.Tax).toFixed(2)}</p>
                    <p><span className="font-medium">Payment Method:</span> {selectedPayment.payMethod}</p>
                    <p><span className="font-medium">Payment Option:</span> {selectedPayment.payoption}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Transaction Details</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Transaction Number:</span> {selectedPayment.trans_or_ref_number}</p>
                    <p><span className="font-medium">Receipt Date:</span> {selectedPayment.receipt_date?.toLocaleDateString() || 'N/A'}</p>
                    <p><span className="font-medium">Payment Date:</span> {selectedPayment.date?.toLocaleDateString() || 'N/A'}</p>
                    <p><span className="font-medium">Counselor Receipt:</span> {selectedPayment.counselor_receipt}</p>
                    {selectedPayment.cc_number && (
                      <p><span className="font-medium">Card Number:</span> {selectedPayment.cc_number}</p>
                    )}
                    <p><span className="font-medium">Card Type:</span> {selectedPayment.paycardoption}</p>
                  </div>
                </div>
              </div>
              {selectedPayment.remarks && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700">Remarks</h4>
                  <p className="mt-1">{selectedPayment.remarks}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
