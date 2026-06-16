'use client';

import { useState, useEffect } from 'react';
import { DmB2bInvoicesAttributes } from '@/models';

export default function InvoicesManagement() {
  const [invoices, setInvoices] = useState<DmB2bInvoicesAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<DmB2bInvoicesAttributes | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    region: 1,
    receipt: '',
    branch: 1,
    company: '',
    purpose: '',
    narration: '',
    vat: 5,
    taxAmt: 0,
    totPayAmt: 0,
    payBalance: 0,
    payment_mode: '',
    amount: 0,
    discount: 0,
    status: 1,
    Counsilor: 1,
    created_by: 1,
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const toNumber = (value: unknown) => Number(value || 0);

  const normalizeInvoice = (invoice: DmB2bInvoicesAttributes): DmB2bInvoicesAttributes => ({
    ...invoice,
    receipt: invoice.receipt || '',
    company: invoice.company || '',
    purpose: invoice.purpose || '',
    payment_mode: invoice.payment_mode || '',
    amount: toNumber(invoice.amount),
    taxAmt: toNumber(invoice.taxAmt),
    totPayAmt: toNumber(invoice.totPayAmt),
    payBalance: toNumber(invoice.payBalance),
    discount: toNumber(invoice.discount),
    created: invoice.created ? new Date(invoice.created) : new Date(),
  });

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/invoices?limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const result = await response.json();
      setInvoices((result.data || []).map(normalizeInvoice));
    } catch (error) {
      console.error('Failed to load invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    (invoice.receipt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewInvoice = (invoice: DmB2bInvoicesAttributes) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handleAddInvoice = async () => {
    if (newInvoice.receipt && newInvoice.company) {
      await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice),
      });
      await fetchInvoices();
      setNewInvoice({
        region: 1,
        receipt: '',
        branch: 1,
        company: '',
        purpose: '',
        narration: '',
        vat: 5,
        taxAmt: 0,
        totPayAmt: 0,
        payBalance: 0,
        payment_mode: '',
        amount: 0,
        discount: 0,
        status: 1,
        Counsilor: 1,
        created_by: 1,
      });
      setShowAddModal(false);
    }
  };

  const getStatusColor = (status?: number | null) => {
    return status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (status?: number | null) => {
    return status === 1 ? 'Paid' : 'Pending';
  };

  const getPaymentModeColor = (paymentMode?: string | null) => {
    switch (paymentMode) {
      case 'Bank Transfer':
        return 'bg-blue-100 text-blue-800';
      case 'Credit Card':
        return 'bg-purple-100 text-purple-800';
      case 'Cash':
        return 'bg-green-100 text-green-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Invoices Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all invoices</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Invoice
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search invoices by receipt, company, or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Regions</option>
            <option value="1">UAE</option>
            <option value="2">Canada</option>
            <option value="3">Australia</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="1">Paid</option>
            <option value="0">Pending</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Mode
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
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.receipt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.purpose}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${invoice.amount?.toLocaleString() || '0'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${invoice.taxAmt?.toLocaleString() || '0'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${invoice.totPayAmt?.toLocaleString() || '0'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${invoice.payBalance?.toLocaleString() || '0'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentModeColor(invoice.payment_mode)}`}>
                      {invoice.payment_mode || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewInvoice(invoice)}
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
      </div>

      {/* Invoice Details Modal */}
      {showModal && selectedInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Invoice Details</h3>
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
                  <h4 className="font-semibold text-gray-700">Basic Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Receipt:</span> {selectedInvoice.receipt}</p>
                    <p><span className="font-medium">Company:</span> {selectedInvoice.company}</p>
                    <p><span className="font-medium">Purpose:</span> {selectedInvoice.purpose}</p>
                    <p><span className="font-medium">Region:</span> #{selectedInvoice.region}</p>
                    <p><span className="font-medium">Branch:</span> #{selectedInvoice.branch}</p>
                    <p><span className="font-medium">Counselor:</span> #{selectedInvoice.Counsilor}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Financial Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Amount:</span> ${selectedInvoice.amount?.toLocaleString()}</p>
                    <p><span className="font-medium">VAT (%):</span> {selectedInvoice.vat}%</p>
                    <p><span className="font-medium">Tax Amount:</span> ${selectedInvoice.taxAmt?.toLocaleString()}</p>
                    <p><span className="font-medium">Total Amount:</span> ${selectedInvoice.totPayAmt?.toLocaleString()}</p>
                    <p><span className="font-medium">Discount:</span> ${selectedInvoice.discount?.toLocaleString()}</p>
                    <p><span className="font-medium">Balance:</span> ${selectedInvoice.payBalance?.toLocaleString()}</p>
                    <p><span className="font-medium">Payment Mode:</span> {selectedInvoice.payment_mode}</p>
                    <p><span className="font-medium">Status:</span> {getStatusText(selectedInvoice.status)}</p>
                  </div>
                </div>
              </div>
              {selectedInvoice.narration && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700">Narration</h4>
                  <p className="mt-1">{selectedInvoice.narration}</p>
                </div>
              )}
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Created Information</h4>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Created Date:</span> {selectedInvoice.created?.toLocaleDateString()}</p>
                  <p><span className="font-medium">Created By:</span> User #{selectedInvoice.created_by}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Create New Invoice</h3>
              <button
                onClick={() => setShowAddModal(false)}
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
                  <label htmlFor="receipt" className="block text-sm font-medium text-gray-700">
                    Receipt Number
                  </label>
                  <input
                    type="text"
                    id="receipt"
                    value={newInvoice.receipt}
                    onChange={(e) => setNewInvoice({ ...newInvoice, receipt: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter receipt number"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={newInvoice.company}
                    onChange={(e) => setNewInvoice({ ...newInvoice, company: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                    Purpose
                  </label>
                  <input
                    type="text"
                    id="purpose"
                    value={newInvoice.purpose}
                    onChange={(e) => setNewInvoice({ ...newInvoice, purpose: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter purpose"
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: parseFloat(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label htmlFor="paymentMode" className="block text-sm font-medium text-gray-700">
                    Payment Mode
                  </label>
                  <select
                    id="paymentMode"
                    value={newInvoice.payment_mode}
                    onChange={(e) => setNewInvoice({ ...newInvoice, payment_mode: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select payment mode</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                    Region
                  </label>
                  <select
                    id="region"
                    value={newInvoice.region}
                    onChange={(e) => setNewInvoice({ ...newInvoice, region: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value={1}>UAE</option>
                    <option value={2}>Canada</option>
                    <option value={3}>Australia</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="narration" className="block text-sm font-medium text-gray-700">
                  Narration
                </label>
                <textarea
                  id="narration"
                  rows={3}
                  value={newInvoice.narration}
                  onChange={(e) => setNewInvoice({ ...newInvoice, narration: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter narration"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewInvoice({
                    region: 1,
                    receipt: '',
                    branch: 1,
                    company: '',
                    purpose: '',
                    narration: '',
                    vat: 5,
                    taxAmt: 0,
                    totPayAmt: 0,
                    payBalance: 0,
                    payment_mode: '',
                    amount: 0,
                    discount: 0,
                    status: 1,
                    Counsilor: 1,
                    created_by: 1,
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddInvoice}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
