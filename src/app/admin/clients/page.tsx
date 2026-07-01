'use client';

import { useState, useEffect, useCallback } from 'react';
import { DmClientsAttributes } from '@/models';
import { Printer, DollarSign, X, AlertCircle, CheckCircle, Loader2, Receipt } from 'lucide-react';

interface BalanceRow {
  clientId: number;
  leadId: number;
  payTotal: number;
  paidYet: number;
  payBalance: number;
  receiptCount: number;
  lastReceiptNumber: string;
  lastPaymentDate: string;
}

interface QuickPayState {
  client: DmClientsAttributes;
  balance: BalanceRow | null;
  amount: string;
  method: string;
  date: string;
  txnId: string;
  saving: boolean;
  msg: string;
  success: boolean;
  receipt: any;
}

export default function ClientsManagement() {
  const [clients, setClients]           = useState<DmClientsAttributes[]>([]);
  const [balances, setBalances]         = useState<Map<number, BalanceRow>>(new Map());
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState('');
  const [selectedClient, setSelectedClient] = useState<DmClientsAttributes | null>(null);
  const [showModal, setShowModal]       = useState(false);
  const [quickPay, setQuickPay]         = useState<QuickPayState | null>(null);

  const normalizeClient = (client: DmClientsAttributes): DmClientsAttributes => ({
    ...client,
    first_name: client.first_name || '',
    last_name: client.last_name || '',
    email: client.email || '',
    dob: client.dob ? new Date(client.dob) : new Date(0),
    token_validity: client.token_validity ? new Date(client.token_validity) : new Date(0),
    created: client.created ? new Date(client.created) : new Date(0),
  });

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const [clientsRes, balancesRes] = await Promise.all([
        fetch('/api/admin/clients?limit=200'),
        fetch('/api/admin/clients/balances'),
      ]);
      if (clientsRes.ok) {
        const result = await clientsRes.json();
        setClients((result.data || []).map(normalizeClient));
      }
      if (balancesRes.ok) {
        const bResult = await balancesRes.json();
        const map = new Map<number, BalanceRow>();
        (bResult.data || []).forEach((b: BalanceRow) => map.set(b.clientId, b));
        setBalances(map);
      }
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const filteredClients = clients.filter(client =>
    (client.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClient = (client: DmClientsAttributes) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const openQuickPay = (client: DmClientsAttributes) => {
    const balance = balances.get(client.id) || null;
    setQuickPay({
      client,
      balance,
      amount: balance ? String(balance.payBalance > 0 ? balance.payBalance : '') : '',
      method: 'cash',
      date: new Date().toISOString().split('T')[0],
      txnId: '',
      saving: false,
      msg: '',
      success: false,
      receipt: null,
    });
  };

  const printReceipt = (receipt: any, client: DmClientsAttributes, qp: QuickPayState) => {
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
  <div style="font-size:10pt;color:#666;">Receipt No: <strong>${receipt.receiptNumber || receipt.paymentNumber || 'N/A'}</strong></div>
  <div style="font-size:10pt;color:#666;margin-top:4px;">Date: <strong>${qp.date ? new Date(qp.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</strong></div>
</div>
<table>
  <tr><td>Client Name</td><td>${client.first_name} ${client.last_name}</td></tr>
  <tr><td>Email</td><td>${client.email}</td></tr>
  <tr><td>Payment Method</td><td>${qp.method.replace('_',' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</td></tr>
  ${qp.txnId ? `<tr><td>Transaction ID</td><td>${qp.txnId}</td></tr>` : ''}
  <tr><td>Total Amount</td><td>AED ${Number(qp.balance?.payTotal || 0).toLocaleString()}</td></tr>
  <tr><td>Previously Paid</td><td>AED ${Number(qp.balance?.paidYet || 0).toLocaleString()}</td></tr>
  <tr><td>Amount Paid (This Receipt)</td><td>AED ${Number(qp.amount || 0).toLocaleString()}</td></tr>
  <tr class="total-row"><td>Remaining Balance</td><td>AED ${Math.max(0, Number(qp.balance?.payBalance || 0) - Number(qp.amount || 0)).toLocaleString()}</td></tr>
</table>
<p style="margin-top:16px;font-size:10pt;color:#444;">This receipt confirms payment received by DM Immigration Consultants DMCC. Please retain for your records.</p>
<div style="margin-top:40px;display:flex;justify-content:space-between;font-size:10pt;">
  <div>Client Signature: <span style="display:inline-block;width:160px;border-bottom:1px solid #222;"></span></div>
  <div>Authorised Signatory: <span style="display:inline-block;width:160px;border-bottom:1px solid #222;"></span></div>
</div>
<div class="footer">DM Immigration Consultants DMCC · Registered in Dubai · DMCC License · www.dm-consultant.com</div>
</body></html>`;
    const win = window.open('', '_blank', 'width=860,height=1100');
    if (!win) { alert('Allow pop-ups to view the receipt.'); return; }
    win.document.write(html);
    win.document.close();
    win.addEventListener('load', () => setTimeout(() => win.print(), 300));
    if (win.document.readyState === 'complete') setTimeout(() => win.print(), 500);
  };

  const submitQuickPay = async () => {
    if (!quickPay) return;
    const amount = Number(quickPay.amount);
    if (!amount || amount <= 0) { setQuickPay(p => p ? { ...p, msg: 'Enter a valid amount.' } : null); return; }

    setQuickPay(p => p ? { ...p, saving: true, msg: '' } : null);
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: quickPay.client.leadId,
          opportunityId: null,
          paymentData: {
            paymentStructure: 'installment',
            paymentMethod: quickPay.method,
            transactionId: quickPay.txnId || undefined,
            paymentDate: quickPay.date,
            paidAmount: amount,
            totalAmount: quickPay.balance?.payTotal || amount,
            amount,
          },
          receiptData: {
            description: `Balance payment receipt for ${quickPay.client.first_name} ${quickPay.client.last_name}`,
            receiptType: 'payment',
            taxAmount: 0,
            discountAmount: 0,
            notes: '',
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create receipt');
      const receipt = json.data?.receipt || json.data || json;
      setQuickPay(p => p ? { ...p, saving: false, success: true, receipt, msg: `Receipt ${receipt.receiptNumber || ''} created!` } : null);
      // Refresh balances
      const bRes = await fetch('/api/admin/clients/balances');
      if (bRes.ok) {
        const bResult = await bRes.json();
        const map = new Map<number, BalanceRow>();
        (bResult.data || []).forEach((b: BalanceRow) => map.set(b.clientId, b));
        setBalances(map);
      }
    } catch (err: any) {
      setQuickPay(p => p ? { ...p, saving: false, msg: err.message || 'Failed to save payment' } : null);
    }
  };

  const getStatusColor = (status: number) =>
    status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const getVerificationColor = (verify: number) =>
    verify === 1 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';

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
          <h1 className="text-3xl font-bold text-gray-900">Clients Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all clients</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search clients by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Verification</option>
            <option value="1">Verified</option>
            <option value="0">Not Verified</option>
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => {
                const bal = balances.get(client.id);
                const hasBalance = bal && Number(bal.payBalance) > 0;
                return (
                  <tr key={client.id} className={`hover:bg-gray-50 ${hasBalance ? 'border-l-4 border-l-orange-400' : ''}`}>
                    {/* Client */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-blue-700">
                            {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900">{client.first_name} {client.last_name}</div>
                          <div className="text-xs text-gray-400">#{client.leadId} · {client.city || '—'}</div>
                        </div>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.email}</td>
                    {/* Nationality */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{client.nationality || '—'}</td>
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                        {client.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {/* Total Fee */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {bal ? `AED ${Number(bal.payTotal).toLocaleString()}` : <span className="text-gray-400">—</span>}
                    </td>
                    {/* Paid */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bal ? (
                        <span className="text-sm font-medium text-green-700">
                          AED {Number(bal.paidYet).toLocaleString()}
                        </span>
                      ) : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    {/* Balance Due */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bal ? (
                        hasBalance ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-bold rounded-lg bg-red-100 text-red-700 border border-red-200">
                            <AlertCircle className="w-3.5 h-3.5" />
                            AED {Number(bal.payBalance).toLocaleString()}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-green-100 text-green-700">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Fully Paid
                          </span>
                        )
                      ) : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    {/* Receipts */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bal ? (
                        <span className="text-sm text-gray-600">{Number(bal.receiptCount)} receipt{Number(bal.receiptCount) !== 1 ? 's' : ''}</span>
                      ) : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewClient(client)} className="text-xs text-blue-600 hover:text-blue-900 font-medium">View</button>
                        {hasBalance && (
                          <button
                            onClick={() => openQuickPay(client)}
                            title={`Collect balance AED ${Number(bal?.payBalance).toLocaleString()} & generate receipt`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            Receipt for Balance
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Details Modal */}
      {showModal && selectedClient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Client Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Personal Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedClient.first_name} {selectedClient.last_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedClient.email}</p>
                    <p><span className="font-medium">Date of Birth:</span> {selectedClient.dob.toLocaleDateString()}</p>
                    <p><span className="font-medium">Nationality:</span> {selectedClient.nationality}</p>
                    <p><span className="font-medium">City:</span> {selectedClient.city}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Account Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Lead ID:</span> #{selectedClient.leadId}</p>
                    <p><span className="font-medium">Status:</span> {selectedClient.status === 1 ? 'Active' : 'Inactive'}</p>
                    <p><span className="font-medium">Verified:</span> {selectedClient.verify === 1 ? 'Yes' : 'No'}</p>
                    <p><span className="font-medium">Accepted:</span> {selectedClient.accept === 1 ? 'Yes' : 'No'}</p>
                    <p><span className="font-medium">Case Manager:</span> #{selectedClient.case_manager}</p>
                    <p><span className="font-medium">Backend Person:</span> #{selectedClient.backend_person}</p>
                  </div>
                </div>
              </div>
              {(() => {
                const b = balances.get(selectedClient.id);
                return b ? (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Payment Summary</h4>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div><span className="text-gray-500">Total Fee:</span> <span className="font-medium">AED {Number(b.payTotal).toLocaleString()}</span></div>
                      <div><span className="text-gray-500">Paid:</span> <span className="font-medium text-green-700">AED {Number(b.paidYet).toLocaleString()}</span></div>
                      <div><span className="text-gray-500">Balance:</span> <span className={`font-bold ${Number(b.payBalance) > 0 ? 'text-red-600' : 'text-green-600'}`}>AED {Number(b.payBalance).toLocaleString()}</span></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{b.receiptCount} receipt(s) · Last: {b.lastReceiptNumber || '—'}</p>
                  </div>
                ) : null;
              })()}
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Address Information</h4>
                <p className="mt-1">{selectedClient.full_address}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Token Information</h4>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Token:</span> {selectedClient.token}</p>
                  <p><span className="font-medium">Token Validity:</span> {selectedClient.token_validity.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Account Dates</h4>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Created:</span> {selectedClient.created.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                Close
              </button>
              {balances.get(selectedClient.id) && Number(balances.get(selectedClient.id)?.payBalance) > 0 && (
                <button onClick={() => { setShowModal(false); openQuickPay(selectedClient); }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Collect Balance Payment
                </button>
              )}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Edit Client</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Payment Modal */}
      {quickPay && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Collect Payment</h3>
                <p className="text-sm text-gray-500">{quickPay.client.first_name} {quickPay.client.last_name}</p>
              </div>
              <button onClick={() => setQuickPay(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {quickPay.balance && (
                <div className="flex gap-3">
                  <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500">Total Fee</div>
                    <div className="font-bold text-gray-800">AED {Number(quickPay.balance.payTotal).toLocaleString()}</div>
                  </div>
                  <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-green-600">Paid So Far</div>
                    <div className="font-bold text-green-700">AED {Number(quickPay.balance.paidYet).toLocaleString()}</div>
                  </div>
                  <div className="flex-1 bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-red-600">Balance Due</div>
                    <div className="font-bold text-red-700">AED {Number(quickPay.balance.payBalance).toLocaleString()}</div>
                  </div>
                </div>
              )}

              {!quickPay.success ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (AED)</label>
                    <input
                      type="number"
                      min="0"
                      value={quickPay.amount}
                      onChange={e => setQuickPay(p => p ? { ...p, amount: e.target.value } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={quickPay.method}
                      onChange={e => setQuickPay(p => p ? { ...p, method: e.target.value } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="cheque">Cheque</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                    <input
                      type="date"
                      value={quickPay.date}
                      onChange={e => setQuickPay(p => p ? { ...p, date: e.target.value } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID (optional)</label>
                    <input
                      type="text"
                      value={quickPay.txnId}
                      onChange={e => setQuickPay(p => p ? { ...p, txnId: e.target.value } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Reference / transaction number"
                    />
                  </div>

                  {quickPay.msg && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {quickPay.msg}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">{quickPay.msg}</p>
                  <p className="text-sm text-green-600 mt-1">Payment recorded in pay history and lead updated.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-5 border-t">
              <button onClick={() => setQuickPay(null)}
                className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                {quickPay.success ? 'Close' : 'Cancel'}
              </button>
              {quickPay.success && quickPay.receipt ? (
                <button
                  onClick={() => printReceipt(quickPay.receipt, quickPay.client, quickPay)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  <Printer className="w-4 h-4" /> Print Receipt
                </button>
              ) : (
                <button
                  onClick={submitQuickPay}
                  disabled={quickPay.saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                  {quickPay.saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                  {quickPay.saving ? 'Processing…' : 'Save & Create Receipt'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
