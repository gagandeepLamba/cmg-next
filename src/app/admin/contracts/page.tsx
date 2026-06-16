'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'

interface Contract {
  id: number
  leadId: number
  leadName: string
  contractNumber: string
  type: string
  status: 'draft' | 'pending' | 'signed' | 'cancelled'
  amount: string
  currency: string
  createdDate: string
  signedDate?: string
  expiryDate?: string
  counsilorName: string
  branchName: string
  fileName: string
  fileSize: string
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    dateRange: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchContracts()
  }, [filters])

  const fetchContracts = async () => {
    try {
      let filteredContracts: any[] = []

      if (filters.search) {
        filteredContracts = filteredContracts.filter(contract =>
          contract.leadName.toLowerCase().includes(filters.search.toLowerCase()) ||
          contract.contractNumber.toLowerCase().includes(filters.search.toLowerCase())
        )
      }

      if (filters.status) {
        filteredContracts = filteredContracts.filter(contract => contract.status === filters.status)
      }

      if (filters.type) {
        filteredContracts = filteredContracts.filter(contract => 
          contract.type.toLowerCase().includes(filters.type.toLowerCase())
        )
      }

      setTimeout(() => {
        setContracts(filteredContracts)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error fetching contracts:', error)
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      type: '',
      dateRange: ''
    })
  }

  const downloadContract = (contractId: number) => {
    console.log('Downloading contract:', contractId)
    // In a real implementation, this would trigger a file download
    alert('Contract download would start here')
  }

  const viewContract = (contractId: number) => {
    console.log('Viewing contract:', contractId)
    // In a real implementation, this would open a PDF viewer
    alert('Contract viewer would open here')
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading contracts...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Contract Management
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage and track all client contracts and agreements
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Contract
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">Filters</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by lead name or contract number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="signed">Signed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Contract Type
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  placeholder="Search by contract type"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <input
                  type="text"
                  id="dateRange"
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                  placeholder="Select date range"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Contract Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
                <span className="text-white text-xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Contracts</p>
                <p className="text-2xl font-semibold text-gray-900">{contracts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
                <span className="text-white text-xl">✍️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Signed Contracts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contracts.filter(c => c.status === 'signed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-lg p-3">
                <span className="text-white text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Contracts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contracts.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-lg p-3">
                <span className="text-white text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contracts.reduce((sum, c) => sum + parseFloat(c.amount), 0).toFixed(2)} AED
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contracts Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {contract.contractNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contract.counsilorName} - {contract.branchName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contract.leadName}</div>
                        <div className="text-sm text-gray-500">ID: {contract.leadId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contract.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {contract.currency} {contract.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Created: {new Date(contract.createdDate).toLocaleDateString()}
                        </div>
                        {contract.signedDate && (
                          <div className="text-sm text-gray-500">
                            Signed: {new Date(contract.signedDate).toLocaleDateString()}
                          </div>
                        )}
                        {contract.expiryDate && (
                          <div className="text-sm text-gray-500">
                            Expires: {new Date(contract.expiryDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{contract.fileName}</div>
                        <div className="text-sm text-gray-500">{contract.fileSize}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewContract(contract.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => downloadContract(contract.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Download
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {contracts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No contracts found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Contract Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Contract</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            
            {/* Create contract form would go here */}
            <div className="text-center py-8 text-gray-500">
              Contract creation form would be implemented here
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Create Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
