'use client';

import { useState, useEffect } from 'react';
import { DmClientsAttributes } from '@/models';

export default function ClientsManagement() {
  const [clients, setClients] = useState<DmClientsAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<DmClientsAttributes | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const normalizeClient = (client: DmClientsAttributes): DmClientsAttributes => ({
    ...client,
    first_name: client.first_name || '',
    last_name: client.last_name || '',
    email: client.email || '',
    dob: client.dob ? new Date(client.dob) : new Date(0),
    token_validity: client.token_validity ? new Date(client.token_validity) : new Date(0),
    created: client.created ? new Date(client.created) : new Date(0),
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/clients?limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const result = await response.json();
      setClients((result.data || []).map(normalizeClient));
    } catch (error) {
      console.error('Failed to load clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    (client.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewClient = (client: DmClientsAttributes) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getVerificationColor = (verify: number) => {
    return verify === 1 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Clients Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all clients</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Add New Client
        </button>
        <button
                  onClick={() => window.open(`/admin/clients/contract?clientId=${selectedClient?.id}`, '_blank')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Generate Contract
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    if (selectedClient) {
                      window.open(`/admin/clients/contract?clientId=${selectedClient.id}`, '_blank');
                    }
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={!selectedClient}
                >
                  Generate Contract
                </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nationality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {client.first_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {client.first_name} {client.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: #{client.leadId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.nationality}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Manager #{client.case_manager}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                      {client.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVerificationColor(client.verify)}`}>
                      {client.verify === 1 ? 'Verified' : 'Not Verified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewClient(client)}
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

      {/* Client Details Modal */}
      {showModal && selectedClient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Client Details</h3>
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
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
