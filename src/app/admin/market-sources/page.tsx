'use client';

import { useState, useEffect } from 'react';
import { DmSourceAttributes } from '@/models';

export default function MarketSourcesManagement() {
  const [sources, setSources] = useState<DmSourceAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<DmSourceAttributes | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({ status: '' });

  useEffect(() => {
    fetchSources();
  }, [pagination.page, pagination.limit, filters.status]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page === 1) {
        fetchSources();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchSources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status !== '' && { status: filters.status })
      });

      const response = await fetch(`/api/admin/market-sources?${params}`);
      const result = await response.json();

      if (response.ok) {
        setSources(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages
        }));
      } else {
        console.error('Failed to fetch sources:', result.error);
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSource = (source: DmSourceAttributes) => {
    setSelectedSource(source);
    setShowModal(true);
  };

  const handleEditSource = (source: DmSourceAttributes) => {
    setSelectedSource(source);
    setShowEditModal(true);
  };

  const handleDeleteSource = async (id: number) => {
    if (!confirm('Are you sure you want to delete this source?')) return;
    try {
      const response = await fetch(`/api/admin/market-sources?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchSources();
      } else {
        const result = await response.json();
        alert('Failed to delete source: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting source:', error);
      alert('Failed to delete source');
    }
  };

  const handleAddSource = async (data: Partial<DmSourceAttributes>) => {
    try {
      const response = await fetch('/api/admin/market-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setShowAddModal(false);
        fetchSources();
      } else {
        const result = await response.json();
        alert('Error adding source: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding source:', error);
      alert('Error adding source');
    }
  };

  const handleUpdateSource = async (data: Partial<DmSourceAttributes>) => {
    if (!selectedSource) return;
    try {
      const response = await fetch('/api/admin/market-sources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedSource.id, ...data }),
      });
      if (response.ok) {
        setShowEditModal(false);
        setSelectedSource(null);
        fetchSources();
      } else {
        const result = await response.json();
        alert('Error updating source: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating source:', error);
      alert('Error updating source');
    }
  };

  const handlePageChange = (newPage: number) => setPagination(prev => ({ ...prev, page: newPage }));
  const handleLimitChange = (newLimit: number) => setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  const handleFilterChange = (value: string) => {
    setFilters({ status: value });
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchSources();
  };

  const getStatusColor = (status: number) =>
    status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

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
          <h1 className="text-3xl font-bold text-gray-900">Market Sources Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all market sources</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchSources}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Source
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search sources by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sources.map((source) => (
                <tr key={source.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{source.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{source.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(source.status)}`}>
                      {source.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewSource(source)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditSource(source)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSource(source.id)}
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

      {/* Pagination Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => handlePageChange(1)} disabled={pagination.page === 1} className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">First</button>
            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) pageNum = i + 1;
                else if (pagination.page <= 3) pageNum = i + 1;
                else if (pagination.page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                else pageNum = pagination.page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm border rounded-md ${pageNum === pagination.page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            <button onClick={() => handlePageChange(pagination.totalPages)} disabled={pagination.page === pagination.totalPages} className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Last</button>
          </div>
        </div>
      </div>

      {/* Source Details Modal */}
      {showModal && selectedSource && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-bold text-gray-900">Source Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 space-y-2">
              <p><span className="font-medium">Source ID:</span> {selectedSource.id}</p>
              <p><span className="font-medium">Name:</span> {selectedSource.name}</p>
              <p><span className="font-medium">Status:</span> {selectedSource.status === 1 ? 'Active' : 'Inactive'}</p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { setShowModal(false); handleEditSource(selectedSource); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Source
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Source Modal */}
      {showAddModal && (
        <SourceFormModal
          title="Add New Source"
          onSubmit={handleAddSource}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Source Modal */}
      {showEditModal && selectedSource && (
        <SourceFormModal
          title="Edit Source"
          initialData={selectedSource}
          onSubmit={handleUpdateSource}
          onClose={() => { setShowEditModal(false); setSelectedSource(null); }}
        />
      )}
    </div>
  );
}

interface SourceFormModalProps {
  title: string;
  initialData?: DmSourceAttributes | null;
  onSubmit: (data: Partial<DmSourceAttributes>) => void;
  onClose: () => void;
}

function SourceFormModal({ title, initialData, onSubmit, onClose }: SourceFormModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    status: initialData?.status ?? 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Source Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
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
              {initialData ? 'Update Source' : 'Add Source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
