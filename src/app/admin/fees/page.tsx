'use client';

import { useState, useEffect } from 'react';
import { DmFee } from '@/models/DmFee';
import type { DmFeeAttributes } from '@/models/DmFee';

export default function FeesManagement() {
  const [fees, setFees] = useState<DmFeeAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFee, setSelectedFee] = useState<DmFeeAttributes | null>(null);
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
    status: '',
    service: '',
    country: '',
    branch: ''
  });

  useEffect(() => {
    fetchFees();
  }, [pagination.page, pagination.limit, filters.status, filters.service, filters.country, filters.branch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page === 1) {
        fetchFees();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status !== '' && { status: filters.status }),
        ...(filters.service !== '' && { service: filters.service }),
        ...(filters.country !== '' && { country: filters.country }),
        ...(filters.branch !== '' && { branch: filters.branch })
      });

      const response = await fetch(`/api/admin/fees?${params}`);
      const data = await response.json();

      if (response.ok) {
        setFees(data.data);
        setPagination(data.pagination);
      } else {
        console.error('Error fetching fees:', data.error);
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFee = (fee: DmFeeAttributes) => {
    setSelectedFee(fee);
    setShowModal(true);
  };

  const handleEditFee = (fee: DmFeeAttributes) => {
    setSelectedFee(fee);
    setShowEditModal(true);
  };

  const handleDeleteFee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this fee? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/fees?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFees();
      } else {
        const error = await response.json();
        alert('Error deleting fee: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting fee:', error);
      alert('Error deleting fee');
    }
  };

  const handleAddFee = async (feeData: Partial<DmFeeAttributes>) => {
    try {
      const response = await fetch('/api/admin/fees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feeData),
      });

      if (response.ok) {
        setShowAddModal(false);
        fetchFees();
      } else {
        const error = await response.json();
        alert('Error adding fee: ' + error.error);
      }
    } catch (error) {
      console.error('Error adding fee:', error);
      alert('Error adding fee');
    }
  };

  const handleUpdateFee = async (feeData: Partial<DmFeeAttributes>) => {
    if (!selectedFee) return;

    try {
      const response = await fetch('/api/admin/fees', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedFee.id, ...feeData }),
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedFee(null);
        fetchFees();
      } else {
        const error = await response.json();
        alert('Error updating fee: ' + error.error);
      }
    } catch (error) {
      console.error('Error updating fee:', error);
      alert('Error updating fee');
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
          <h1 className="text-3xl font-bold text-gray-900">Fees Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all fees</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Fee
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search fees by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <select 
            value={filters.service}
            onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Services</option>
            <option value="1">Service 1</option>
            <option value="2">Service 2</option>
            <option value="3">Service 3</option>
          </select>
          <select 
            value={filters.country}
            onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Countries</option>
            <option value="1">Country 1</option>
            <option value="2">Country 2</option>
            <option value="3">Country 3</option>
          </select>
          <select 
            value={filters.branch}
            onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Branches</option>
            <option value="1">Branch 1</option>
            <option value="2">Branch 2</option>
            <option value="3">Branch 3</option>
          </select>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upfront
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prof Fee
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
              {fees.map((fee: DmFeeAttributes) => (
                <tr key={fee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{fee.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {fee.service || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {fee.country || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {fee.branch || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {fee.currency || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${fee.upfront}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${fee.prof_fee}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fee.status)}`}>
                      {fee.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewFee(fee)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleEditFee(fee)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteFee(fee.id)}
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

      {/* Fee Details Modal */}
      {showModal && selectedFee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Fee Details</h3>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Basic Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Fee ID:</span> {selectedFee.id}</p>
                    <p><span className="font-medium">Service:</span> {selectedFee.service || 'N/A'}</p>
                    <p><span className="font-medium">Country:</span> {selectedFee.country || 'N/A'}</p>
                    <p><span className="font-medium">Branch:</span> {selectedFee.branch || 'N/A'}</p>
                    <p><span className="font-medium">Currency:</span> {selectedFee.currency || 'N/A'}</p>
                    <p><span className="font-medium">Status:</span> {selectedFee.status === 1 ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Monthly Fees</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Upfront:</span> ${selectedFee.upfront}</p>
                    <p><span className="font-medium">Professional Fee:</span> ${selectedFee.prof_fee}</p>
                    <p><span className="font-medium">First Month:</span> ${selectedFee.firstMonth}</p>
                    <p><span className="font-medium">Second Month:</span> ${selectedFee.secondMonth}</p>
                    <p><span className="font-medium">Third Month:</span> ${selectedFee.thirdMonth}</p>
                    <p><span className="font-medium">Prof Fee Month:</span> ${selectedFee.prof_fee_month}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Stage Fees</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">First Stage:</span> ${selectedFee.firstStage}</p>
                    <p><span className="font-medium">Second Stage:</span> ${selectedFee.secondStage}</p>
                    <p><span className="font-medium">Third Stage:</span> ${selectedFee.thirdStage}</p>
                    <p><span className="font-medium">Fourth Stage:</span> ${selectedFee.forthStage}</p>
                    <p><span className="font-medium">Fifth Stage:</span> ${selectedFee.fifthStage || 0}</p>
                    <p><span className="font-medium">Prof Fee Stage:</span> ${selectedFee.prof_fee_stage}</p>
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
                  handleEditFee(selectedFee);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Fee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Fee Modal */}
      {showAddModal && (
        <FeeFormModal
          title="Add New Fee"
          onSubmit={handleAddFee}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Fee Modal */}
      {showEditModal && selectedFee && (
        <FeeFormModal
          title="Edit Fee"
          initialData={selectedFee}
          onSubmit={handleUpdateFee}
          onClose={() => {
            setShowEditModal(false);
            setSelectedFee(null);
          }}
        />
      )}
    </div>
  );
}

// Fee Form Modal Component
interface FeeFormModalProps {
  title: string;
  initialData?: DmFeeAttributes | null;
  onSubmit: (data: Partial<DmFeeAttributes>) => void;
  onClose: () => void;
}

function FeeFormModal({ title, initialData, onSubmit, onClose }: FeeFormModalProps) {
  const [formData, setFormData] = useState({
    service: initialData?.service || null,
    country: initialData?.country || null,
    branch: initialData?.branch || null,
    currency: initialData?.currency || null,
    upfront: initialData?.upfront || 0,
    prof_fee: initialData?.prof_fee || 0,
    firstMonth: initialData?.firstMonth || 0,
    secondMonth: initialData?.secondMonth || 0,
    thirdMonth: initialData?.thirdMonth || 0,
    prof_fee_month: initialData?.prof_fee_month || 0,
    firstStage: initialData?.firstStage || 0,
    secondStage: initialData?.secondStage || 0,
    thirdStage: initialData?.thirdStage || 0,
    forthStage: initialData?.forthStage || 0,
    fifthStage: initialData?.fifthStage || 0,
    prof_fee_stage: initialData?.prof_fee_stage || 0,
    status: initialData?.status ?? 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-3/4 shadow-lg rounded-lg bg-white">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service</label>
              <input
                type="number"
                value={formData.service || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value ? parseInt(e.target.value) : null }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="number"
                value={formData.country || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value ? parseInt(e.target.value) : null }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <input
                type="number"
                value={formData.branch || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value ? parseInt(e.target.value) : null }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <input
                type="number"
                value={formData.currency || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value ? parseInt(e.target.value) : null }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upfront *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.upfront}
                onChange={(e) => setFormData(prev => ({ ...prev, upfront: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Professional Fee *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.prof_fee}
                onChange={(e) => setFormData(prev => ({ ...prev, prof_fee: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First Month *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.firstMonth}
                onChange={(e) => setFormData(prev => ({ ...prev, firstMonth: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Second Month *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.secondMonth}
                onChange={(e) => setFormData(prev => ({ ...prev, secondMonth: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Third Month *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.thirdMonth}
                onChange={(e) => setFormData(prev => ({ ...prev, thirdMonth: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prof Fee Month *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.prof_fee_month}
                onChange={(e) => setFormData(prev => ({ ...prev, prof_fee_month: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First Stage *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.firstStage}
                onChange={(e) => setFormData(prev => ({ ...prev, firstStage: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Second Stage *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.secondStage}
                onChange={(e) => setFormData(prev => ({ ...prev, secondStage: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Third Stage *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.thirdStage}
                onChange={(e) => setFormData(prev => ({ ...prev, thirdStage: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fourth Stage *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.forthStage}
                onChange={(e) => setFormData(prev => ({ ...prev, forthStage: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fifth Stage</label>
              <input
                type="number"
                step="0.01"
                value={formData.fifthStage}
                onChange={(e) => setFormData(prev => ({ ...prev, fifthStage: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prof Fee Stage *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.prof_fee_stage}
                onChange={(e) => setFormData(prev => ({ ...prev, prof_fee_stage: parseFloat(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
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
              {initialData ? 'Update Fee' : 'Add Fee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
