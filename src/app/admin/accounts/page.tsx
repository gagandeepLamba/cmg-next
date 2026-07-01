'use client';

import { useState, useEffect } from 'react';
import { DmAccounts, DmAccountsAttributes } from '@/models';

export default function AccountsManagement() {
  const [accounts, setAccounts] = useState<DmAccountsAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<DmAccountsAttributes | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    account_no: '',
    bank_address: '',
    bank_beneficiary: '',
    bank_name: '',
    iban: '',
    branch_id: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/accounts?limit=100');
      const data = await response.json();
      if (response.ok) {
        setAccounts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.account_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.bank_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.bank_beneficiary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewAccount = (account: DmAccountsAttributes) => {
    setSelectedAccount(account);
    setShowModal(true);
  };

  const handleAddAccount = async () => {
    if (newAccount.account_no && newAccount.bank_name) {
      const response = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount),
      });
      if (!response.ok) return;
      await fetchAccounts();
      setNewAccount({
        account_no: '',
        bank_address: '',
        bank_beneficiary: '',
        bank_name: '',
        iban: '',
        branch_id: '',
      });
      setShowAddModal(false);
    }
  };

  const handleEditAccount = async (id: number, updatedAccount: Partial<DmAccountsAttributes>) => {
    await fetch('/api/admin/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updatedAccount }),
    });
    await fetchAccounts();
    setShowModal(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = async (id: number) => {
    await fetch(`/api/admin/accounts?id=${id}`, { method: 'DELETE' });
    await fetchAccounts();
    setShowModal(false);
    setSelectedAccount(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Accounts Management</h1>
          <p className="text-gray-600 mt-2">Manage bank accounts and financial information</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Account
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search accounts by account number, bank name, or beneficiary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Banks</option>
            <option value="Emirates NBD">Emirates NBD</option>
            <option value="Abu Dhabi Commercial Bank">Abu Dhabi Commercial Bank</option>
            <option value="Sharjah Islamic Bank">Sharjah Islamic Bank</option>
          </select>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beneficiary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IBAN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 font-mono">
                      {account.account_no}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{account.bank_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{account.bank_beneficiary}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {account.iban}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{account.branch_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewAccount(account)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedAccount(account);
                        setShowModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Details Modal */}
      {showModal && selectedAccount && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Account Details</h3>
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
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Account Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Account Number:</span></p>
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedAccount.account_no}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Bank Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Bank Name:</span> {selectedAccount.bank_name}</p>
                    <p><span className="font-medium">Beneficiary:</span> {selectedAccount.bank_beneficiary}</p>
                    <p><span className="font-medium">Branch:</span> {selectedAccount.branch_id}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">IBAN Information</h4>
                  <div className="mt-2">
                    <p className="font-mono text-sm bg-gray-100 p-2 rounded">{selectedAccount.iban}</p>
                  </div>
                </div>
                {selectedAccount.bank_address && (
                  <div>
                    <h4 className="font-semibold text-gray-700">Bank Address</h4>
                    <p className="mt-1">{selectedAccount.bank_address}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  const newAccountNo = prompt('Enter new account number:', selectedAccount.account_no || '');
                  const newBankName = prompt('Enter new bank name:', selectedAccount.bank_name || '');
                  if (newAccountNo && newBankName) {
                    handleEditAccount(selectedAccount.id, { account_no: newAccountNo, bank_name: newBankName });
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Edit Account
              </button>
              <button 
                onClick={() => {
                  if (confirm(`Are you sure you want to delete this account?`)) {
                    handleDeleteAccount(selectedAccount.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Add New Account</h3>
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
              <div className="space-y-4">
                <div>
                  <label htmlFor="accountNo" className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNo"
                    value={newAccount.account_no}
                    onChange={(e) => setNewAccount({ ...newAccount, account_no: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    value={newAccount.bank_name}
                    onChange={(e) => setNewAccount({ ...newAccount, bank_name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter bank name"
                  />
                </div>
                <div>
                  <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700">
                    Beneficiary
                  </label>
                  <input
                    type="text"
                    id="beneficiary"
                    value={newAccount.bank_beneficiary}
                    onChange={(e) => setNewAccount({ ...newAccount, bank_beneficiary: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter beneficiary name"
                  />
                </div>
                <div>
                  <label htmlFor="iban" className="block text-sm font-medium text-gray-700">
                    IBAN
                  </label>
                  <input
                    type="text"
                    id="iban"
                    value={newAccount.iban}
                    onChange={(e) => setNewAccount({ ...newAccount, iban: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                    placeholder="Enter IBAN"
                  />
                </div>
                <div>
                  <label htmlFor="branchId" className="block text-sm font-medium text-gray-700">
                    Branch
                  </label>
                  <input
                    type="text"
                    id="branchId"
                    value={newAccount.branch_id}
                    onChange={(e) => setNewAccount({ ...newAccount, branch_id: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter branch name"
                  />
                </div>
                <div>
                  <label htmlFor="bankAddress" className="block text-sm font-medium text-gray-700">
                    Bank Address
                  </label>
                  <textarea
                    id="bankAddress"
                    rows={3}
                    value={newAccount.bank_address}
                    onChange={(e) => setNewAccount({ ...newAccount, bank_address: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter bank address"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewAccount({
                    account_no: '',
                    bank_address: '',
                    bank_beneficiary: '',
                    bank_name: '',
                    iban: '',
                    branch_id: '',
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddAccount}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
