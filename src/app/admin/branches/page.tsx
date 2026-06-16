'use client';

import { useState, useEffect } from 'react';
import { DmBranch, DmBranchAttributes } from '@/models';

export default function BranchesManagement() {
  const [branches, setBranches] = useState<DmBranchAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<DmBranchAttributes | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    region: '',
    status: ''
  });

  useEffect(() => {
    fetchBranches();
  }, [pagination.page, pagination.limit, filters.region, filters.status]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page === 1) {
        fetchBranches();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.region && { region: filters.region }),
        ...(filters.status !== '' && { status: filters.status })
      });

      const response = await fetch(`/api/admin/branches?${params}`);
      const data = await response.json();

      if (response.ok) {
        setBranches(data.data);
        setPagination(data.pagination);
      } else {
        console.error('Error fetching branches:', data.error);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBranch = (branch: DmBranchAttributes) => {
    setSelectedBranch(branch);
    setShowModal(true);
  };

  const handleEditBranch = (branch: DmBranchAttributes) => {
    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const handleDeleteBranch = async (id: number) => {
    if (!confirm('Are you sure you want to delete this branch?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/branches?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBranches();
      } else {
        const error = await response.json();
        alert('Error deleting branch: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Error deleting branch');
    }
  };

  const handleAddBranch = async (branchData: Partial<DmBranchAttributes>) => {
    try {
      const response = await fetch('/api/admin/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(branchData),
      });

      if (response.ok) {
        setShowAddModal(false);
        fetchBranches();
      } else {
        const error = await response.json();
        alert('Error adding branch: ' + error.error);
      }
    } catch (error) {
      console.error('Error adding branch:', error);
      alert('Error adding branch');
    }
  };

  const handleUpdateBranch = async (branchData: Partial<DmBranchAttributes>) => {
    if (!selectedBranch) return;

    try {
      const response = await fetch('/api/admin/branches', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedBranch.id, ...branchData }),
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedBranch(null);
        fetchBranches();
      } else {
        const error = await response.json();
        alert('Error updating branch: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating branch:', error);
      alert('Error updating branch');
    }
  };

  const getStatusColor = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Branches Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all branches</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Branch
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search branches by name, code, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={filters.region}
            onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Regions</option>
            <option value="1">UAE</option>
            <option value="2">Canada</option>
            <option value="3">Australia</option>
            <option value="4">UK</option>
            <option value="5">USA</option>
          </select>
          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
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
              {branches.map((branch: DmBranchAttributes) => (
                <tr key={branch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {branch.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {branch.ar_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{branch.branch}</div>
                    <div className="text-sm text-gray-500">{branch.abbrv}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{branch.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{branch.mobile}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`http://${branch.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {branch.website}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(branch.status)}`}>
                      {branch.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewBranch(branch)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleEditBranch(branch)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteBranch(branch.id)}
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

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Branch Details Modal */}
      {showModal && selectedBranch && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Branch Details</h3>
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
                    <p><span className="font-medium">Branch Name:</span> {selectedBranch.name}</p>
                    <p><span className="font-medium">Arabic Name:</span> {selectedBranch.ar_name}</p>
                    <p><span className="font-medium">Branch Code:</span> {selectedBranch.branch}</p>
                    <p><span className="font-medium">Abbreviation:</span> {selectedBranch.abbrv}</p>
                    <p><span className="font-medium">Region ID:</span> {selectedBranch.region}</p>
                    <p><span className="font-medium">Status:</span> {selectedBranch.status === 1 ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Contact Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Email:</span> {selectedBranch.email}</p>
                    <p><span className="font-medium">Mobile:</span> {selectedBranch.mobile}</p>
                    <p><span className="font-medium">Website:</span> 
                      <a
                        href={`http://${selectedBranch.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        {selectedBranch.website}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Address Information</h4>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><span className="font-medium">English Address:</span></p>
                    <p className="mt-1 text-gray-600">{selectedBranch.address}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Arabic Address:</span></p>
                    <p className="mt-1 text-gray-600" style={{ direction: 'rtl' }}>
                      {selectedBranch.ar_address}
                    </p>
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
                  setShowModal(false);
                  handleEditBranch(selectedBranch);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Branch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {showAddModal && (
        <BranchFormModal
          title="Add New Branch"
          onSubmit={handleAddBranch}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Branch Modal */}
      {showEditModal && selectedBranch && (
        <BranchFormModal
          title="Edit Branch"
          initialData={selectedBranch}
          onSubmit={handleUpdateBranch}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBranch(null);
          }}
        />
      )}
    </div>
  );
}

// Branch Form Modal Component
interface BranchFormModalProps {
  title: string;
  initialData?: DmBranchAttributes | null;
  onSubmit: (data: Partial<DmBranchAttributes>) => void;
  onClose: () => void;
}

function BranchFormModal({ title, initialData, onSubmit, onClose }: BranchFormModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    ar_name: initialData?.ar_name || '',
    branch: initialData?.branch || '',
    region: initialData?.region || 1,
    abbrv: initialData?.abbrv || '',
    address: initialData?.address || '',
    ar_address: initialData?.ar_address || '',
    email: initialData?.email || '',
    mobile: initialData?.mobile || '',
    website: initialData?.website || '',
    status: initialData?.status ?? 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Arabic Name *</label>
              <input
                type="text"
                required
                value={formData.ar_name}
                onChange={(e) => setFormData(prev => ({ ...prev, ar_name: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch Code *</label>
              <input
                type="text"
                required
                value={formData.branch}
                onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Abbreviation *</label>
              <input
                type="text"
                required
                value={formData.abbrv}
                onChange={(e) => setFormData(prev => ({ ...prev, abbrv: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Region *</label>
              <select
                required
                value={formData.region}
                onChange={(e) => setFormData(prev => ({ ...prev, region: parseInt(e.target.value) }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">UAE</option>
                <option value="2">Canada</option>
                <option value="3">Australia</option>
                <option value="4">UK</option>
                <option value="5">USA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status *</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: parseInt(e.target.value) }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile *</label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Website *</label>
              <input
                type="text"
                required
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">English Address *</label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Arabic Address *</label>
              <textarea
                required
                rows={3}
                value={formData.ar_address}
                onChange={(e) => setFormData(prev => ({ ...prev, ar_address: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                style={{ direction: 'rtl' }}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {initialData ? 'Update Branch' : 'Add Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
