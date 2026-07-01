'use client';

import { useState, useEffect } from 'react';
import { DmB2b, DmB2bAttributes } from '@/models';

export default function B2BManagement() {
  const [b2bCompanies, setB2bCompanies] = useState<DmB2bAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<DmB2bAttributes | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    status: 1,
    created_by: 1,
  });

  useEffect(() => {
    fetchB2bCompanies();
  }, []);

  const normalizeCompany = (company: any): DmB2bAttributes => ({
    ...company,
    created: company.created ? new Date(company.created) : new Date(),
  });

  const fetchB2bCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/b2b?limit=100');
      const data = await response.json();
      if (response.ok) {
        setB2bCompanies((data.data || []).map(normalizeCompany));
      }
    } catch (error) {
      console.error('Error fetching B2B companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = b2bCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCompany = (company: DmB2bAttributes) => {
    setSelectedCompany(company);
    setShowModal(true);
  };

  const handleAddCompany = async () => {
    if (newCompany.name.trim()) {
      const response = await fetch('/api/admin/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCompany, name: newCompany.name.trim() }),
      });
      if (!response.ok) return;
      await fetchB2bCompanies();
      setNewCompany({
        name: '',
        status: 1,
        created_by: 1,
      });
      setShowAddModal(false);
    }
  };

  const handleEditCompany = async (id: number, updatedName: string, updatedStatus: number) => {
    await fetch('/api/admin/b2b', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: updatedName, status: updatedStatus }),
    });
    await fetchB2bCompanies();
    setShowModal(false);
    setSelectedCompany(null);
  };

  const handleDeleteCompany = async (id: number) => {
    await fetch(`/api/admin/b2b?id=${id}`, { method: 'DELETE' });
    await fetchB2bCompanies();
    setShowModal(false);
    setSelectedCompany(null);
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status: number) => {
    return status === 1 ? 'Active' : 'Inactive';
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
          <h1 className="text-3xl font-bold text-gray-900">B2B Management</h1>
          <p className="text-gray-600 mt-2">Manage B2B partnerships and collaborations</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add B2B Partner
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search B2B partners by name..."
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
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* B2B Companies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{company.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{company.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(company.status)}`}>
                      {getStatusText(company.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {company.created.toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">User #{company.created_by}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewCompany(company)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCompany(company);
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

      {/* Company Details Modal */}
      {showModal && selectedCompany && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">B2B Partner Details</h3>
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
                  <h4 className="font-semibold text-gray-700">Company Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">ID:</span> #{selectedCompany.id}</p>
                    <p><span className="font-medium">Name:</span> {selectedCompany.name}</p>
                    <p><span className="font-medium">Status:</span> {getStatusText(selectedCompany.status)}</p>
                    <p><span className="font-medium">Created Date:</span> {selectedCompany.created.toLocaleDateString()}</p>
                    <p><span className="font-medium">Created By:</span> User #{selectedCompany.created_by}</p>
                  </div>
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
              <button 
                onClick={() => {
                  const newName = prompt('Enter new company name:', selectedCompany.name);
                  const newStatus = prompt('Enter status (1 for Active, 0 for Inactive):', selectedCompany.status.toString());
                  if (newName && newName.trim() && newStatus) {
                    handleEditCompany(selectedCompany.id, newName.trim(), parseInt(newStatus));
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Edit Company
              </button>
              <button 
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${selectedCompany.name}?`)) {
                    handleDeleteCompany(selectedCompany.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Add New B2B Partner</h3>
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
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label htmlFor="companyStatus" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="companyStatus"
                    value={newCompany.status}
                    onChange={(e) => setNewCompany({ ...newCompany, status: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCompany({
                    name: '',
                    status: 1,
                    created_by: 1,
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCompany}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
