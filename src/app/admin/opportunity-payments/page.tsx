'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'

interface OpportunityPayment {
  id: number
  opportunityId: number
  opportunityName: string
  clientName: string
  totalAmount: string
  currency: string
  paymentStructure: 'full' | 'installment' | 'milestone' | 'hybrid'
  status: 'pending' | 'partial' | 'completed' | 'overdue'
  nextPaymentDue: string
  totalPaid: string
  remainingBalance: string
  paymentSchedule: PaymentSchedule[]
  createdDate: string
  lastPaymentDate?: string
  counsilorName: string
  branchName: string
}

interface PaymentSchedule {
  id: number
  installmentNumber: number
  amount: string
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
  paidDate?: string
  paymentMethod?: string
  transactionId?: string
}

export default function OpportunityPaymentsPage() {
  const [opportunityPayments, setOpportunityPayments] = useState<OpportunityPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    paymentStructure: '',
    branch: '',
    dateRange: ''
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityPayment | null>(null)

  useEffect(() => {
    fetchOpportunityPayments()
  }, [filters])

  const fetchOpportunityPayments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.set('status', filters.status)
      const response = await fetch(`/api/opportunity-payments?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to load opportunity payments')
      const records = await response.json()
      const mappedPayments: OpportunityPayment[] = (Array.isArray(records) ? records : []).map((payment: any) => ({
        id: Number(payment.id || 0),
        opportunityId: Number(payment.opportunityId || payment.opportunity_id || 0),
        opportunityName: payment.dmcOpportunity?.opportunityName || payment.opportunityName || `Opportunity ${payment.opportunityId || ''}`.trim(),
        clientName: payment.clientName || payment.dmcOpportunity?.clientName || 'Not set',
        totalAmount: String(payment.totalAmount || payment.amount || 0),
        currency: payment.currency || payment.dmcOpportunity?.currency || 'AED',
        paymentStructure: payment.paymentStructure || 'full',
        status: payment.status === 'paid' ? 'completed' : payment.status || 'pending',
        nextPaymentDue: payment.dueDate || payment.nextPaymentDue || '',
        totalPaid: String(payment.paidAmount || payment.amount || 0),
        remainingBalance: String(payment.remainingBalance || 0),
        paymentSchedule: [],
        createdDate: payment.createdAt || payment.created || '',
        lastPaymentDate: payment.paymentDate || payment.lastPaymentDate || undefined,
        counsilorName: payment.createdEmployee?.name || payment.counsilorName || 'Not set',
        branchName: payment.branchName || 'Not set'
      }))

      let filteredPayments = mappedPayments
      if (filters.search) {
        filteredPayments = filteredPayments.filter(payment =>
          payment.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
          payment.opportunityName.toLowerCase().includes(filters.search.toLowerCase())
        )
      }
      if (filters.paymentStructure) {
        filteredPayments = filteredPayments.filter(payment => payment.paymentStructure === filters.paymentStructure)
      }
      if (filters.branch) {
        filteredPayments = filteredPayments.filter(payment => payment.branchName.toLowerCase().includes(filters.branch.toLowerCase()))
      }

      setOpportunityPayments(filteredPayments)
    } catch (error) {
      console.error('Error fetching opportunity payments:', error)
      setOpportunityPayments([])
    } finally {
      setLoading(false)
    }
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'partial':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStructureColor = (structure: string) => {
    switch (structure) {
      case 'full':
        return 'bg-purple-100 text-purple-800'
      case 'installment':
        return 'bg-blue-100 text-blue-800'
      case 'milestone':
        return 'bg-green-100 text-green-800'
      case 'hybrid':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScheduleStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
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
      paymentStructure: '',
      branch: '',
      dateRange: ''
    })
  }

  const recordPayment = (opportunityId: number) => {
    const opportunity = opportunityPayments.find(p => p.id === opportunityId)
    setSelectedOpportunity(opportunity || null)
    setShowCreateModal(true)
  }

  const viewPaymentSchedule = (opportunityId: number) => {
    const opportunity = opportunityPayments.find(p => p.id === opportunityId)
    setSelectedOpportunity(opportunity || null)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading opportunity payments...</div>
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
                  Opportunity Payment Management
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Manage payment structures and schedules for business opportunities
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Opportunity Payment
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">Filters</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                  placeholder="Search by client or opportunity"
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
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label htmlFor="paymentStructure" className="block text-sm font-medium text-gray-700">
                  Payment Structure
                </label>
                <select
                  id="paymentStructure"
                  name="paymentStructure"
                  value={filters.paymentStructure}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">All Structures</option>
                  <option value="full">Full Payment</option>
                  <option value="installment">Installment</option>
                  <option value="milestone">Milestone</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                  Branch
                </label>
                <select
                  id="branch"
                  name="branch"
                  value={filters.branch}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">All Branches</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                </select>
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

        {/* Opportunity Payment Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
                <span className="text-white text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Opportunities</p>
                <p className="text-2xl font-semibold text-gray-900">{opportunityPayments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
                <span className="text-white text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {opportunityPayments.filter(p => p.status === 'completed').length}
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
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {opportunityPayments.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-lg p-3">
                <span className="text-white text-xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {opportunityPayments.reduce((sum, p) => sum + parseFloat(p.totalAmount), 0).toFixed(2)} AED
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity Payments Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opportunity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Structure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Payment
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {opportunityPayments.map((opportunity) => (
                    <tr key={opportunity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {opportunity.opportunityName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {opportunity.opportunityId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {opportunity.counsilorName} - {opportunity.branchName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{opportunity.clientName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {opportunity.currency} {opportunity.totalAmount}
                        </div>
                        <div className="text-sm text-gray-500">
                          Paid: {opportunity.currency} {opportunity.totalPaid}
                        </div>
                        <div className="text-sm text-gray-500">
                          Remaining: {opportunity.currency} {opportunity.remainingBalance}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getPaymentStructureColor(opportunity.paymentStructure)}`}>
                          {opportunity.paymentStructure.charAt(0).toUpperCase() + opportunity.paymentStructure.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(opportunity.status)}`}>
                          {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-900">
                                {((parseFloat(opportunity.totalPaid) / parseFloat(opportunity.totalAmount)) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${(parseFloat(opportunity.totalPaid) / parseFloat(opportunity.totalAmount)) * 100}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {opportunity.nextPaymentDue ? (
                          <div className="text-sm text-gray-900">
                            {new Date(opportunity.nextPaymentDue).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">N/A</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewPaymentSchedule(opportunity.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Schedule
                        </button>
                        <button
                          onClick={() => recordPayment(opportunity.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {opportunityPayments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No opportunity payments found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Schedule Modal */}
        {selectedOpportunity && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Payment Schedule - {selectedOpportunity.opportunityName}
                </h3>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500">Total Amount</h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedOpportunity.currency} {selectedOpportunity.totalAmount}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500">Total Paid</h4>
                    <p className="text-lg font-semibold text-green-600">
                      {selectedOpportunity.currency} {selectedOpportunity.totalPaid}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500">Remaining Balance</h4>
                    <p className="text-lg font-semibold text-orange-600">
                      {selectedOpportunity.currency} {selectedOpportunity.remainingBalance}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Installment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOpportunity.paymentSchedule.map((schedule) => (
                      <tr key={schedule.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Installment {schedule.installmentNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {selectedOpportunity.currency} {schedule.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(schedule.dueDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getScheduleStatusColor(schedule.status)}`}>
                            {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {schedule.paidDate ? new Date(schedule.paidDate).toLocaleDateString() : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {schedule.paymentMethod || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {schedule.transactionId || '-'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedOpportunity(null)
                    setShowCreateModal(true)
                  }}
                  className="rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Record Payment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Record Payment</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
              
              {/* Record payment form would go here */}
              <div className="text-center py-8 text-gray-500">
                Payment recording form would be implemented here
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
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

