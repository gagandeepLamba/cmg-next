'use client';

import React, { useState, useEffect } from 'react';
import { DiscountApprovalSystem, DiscountRequest, ApproverRole, DiscountRule } from '@/lib/discountApprovalSystem';

const DiscountApprovalManager: React.FC = () => {
  const [discountSystem] = useState(() => new DiscountApprovalSystem());
  const [requests, setRequests] = useState<DiscountRequest[]>([]);
  const [approvers, setApprovers] = useState<ApproverRole[]>([]);
  const [rules, setRules] = useState<DiscountRule[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'approvers' | 'rules' | 'analytics'>('requests');
  const [selectedRequest, setSelectedRequest] = useState<DiscountRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    urgency: '',
    discountType: '',
    approverId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRequests(discountSystem.getDiscountRequests());
    setApprovers(discountSystem.getApprovers());
    setRules(discountSystem.getDiscountRules());
    setStatistics(discountSystem.getDiscountStatistics());
  };

  const handleApprove = async (requestId: string, approverId: number) => {
    try {
      await discountSystem.approveDiscountRequest(requestId, approverId, approvalComments);
      setShowApprovalModal(false);
      setApprovalComments('');
      loadData();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId: string, approverId: number) => {
    try {
      await discountSystem.rejectDiscountRequest(requestId, approverId, rejectionReason);
      setShowRejectionModal(false);
      setRejectionReason('');
      loadData();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    return `${hours.toFixed(1)} hours`;
  };

  const filteredRequests = requests.filter(request => {
    if (filters.status && request.status !== filters.status) return false;
    if (filters.urgency && request.urgency !== filters.urgency) return false;
    if (filters.discountType && request.discountType !== filters.discountType) return false;
    if (filters.approverId && request.approvedBy?.id !== parseInt(filters.approverId)) return false;
    return true;
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discount Approval System</h1>
        <p className="text-gray-600">Manage discount requests with approval workflow and SLA tracking</p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600 mb-1">Total Requests</h3>
            <p className="text-2xl font-bold text-blue-900">{statistics.totalRequests}</p>
            <p className="text-sm text-blue-600">{statistics.pendingRequests} pending</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600 mb-1">Approved</h3>
            <p className="text-2xl font-bold text-green-900">{statistics.approvedRequests}</p>
            <p className="text-sm text-green-600">{statistics.averageDiscountPercentage.toFixed(1)}% avg discount</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600 mb-1">Total Savings</h3>
            <p className="text-2xl font-bold text-yellow-900">{formatCurrency(statistics.totalSavings)}</p>
            <p className="text-sm text-yellow-600">Approved discounts</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600 mb-1">SLA Compliance</h3>
            <p className="text-2xl font-bold text-purple-900">{statistics.slaCompliance.metPercentage.toFixed(1)}%</p>
            <p className="text-sm text-purple-600">{formatHours(statistics.slaCompliance.averageResponseTime)} avg response</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {(['requests', 'approvers', 'rules', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      {activeTab === 'requests' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={filters.urgency}
              onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Urgency</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filters.discountType}
              onChange={(e) => setFilters({ ...filters, discountType: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="package">Package</option>
              <option value="volume">Volume</option>
            </select>
            <select
              value={filters.approverId}
              onChange={(e) => setFilters({ ...filters, approverId: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Approvers</option>
              {approvers.map((approver) => (
                <option key={approver.id} value={approver.id.toString()}>
                  {approver.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'requests' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product & Pricing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SLA Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.metadata.referenceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.leadName}</div>
                    <div className="text-sm text-gray-500">{request.leadEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.productName}</div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(request.originalPrice)} → {formatCurrency(request.finalPrice)}
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {request.discountPercentage}% off ({formatCurrency(request.requestedDiscount)})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.requestedBy.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {request.sla.slaStatus === 'met' ? '✅' : '⏱️'} {request.sla.slaStatus}
                    </div>
                    <div className="text-xs text-gray-500">
                      Target: {formatHours(request.sla.targetResponseTime)}
                    </div>
                    {request.sla.actualResponseTime && (
                      <div className="text-xs text-gray-500">
                        Actual: {formatHours(request.sla.actualResponseTime)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowApprovalModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRejectionModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'approvers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvers.map((approver) => (
            <div key={approver.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{approver.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  approver.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {approver.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Title:</span>
                  <span className="font-medium">{approver.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Role:</span>
                  <span className="font-medium">{approver.role.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Level:</span>
                  <span className="font-medium">{approver.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Max Discount:</span>
                  <span className="font-medium">{approver.permissions.maxDiscountPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pending Requests:</span>
                  <span className="font-medium">{approver.workload.pendingRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Approval Rate:</span>
                  <span className="font-medium">{approver.workload.approvalRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Response:</span>
                  <span className="font-medium">{formatHours(approver.workload.averageResponseTime)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{rule.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{rule.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Conditions</h4>
                  <div className="space-y-1 text-sm">
                    <div>Min Discount: {rule.conditions.minDiscountPercentage}%</div>
                    <div>Max Discount: {rule.conditions.maxDiscountPercentage}%</div>
                    <div>Min Amount: {formatCurrency(rule.conditions.minDiscountAmount || 0)}</div>
                    <div>Max Amount: {formatCurrency(rule.conditions.maxDiscountAmount || 0)}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">SLA</h4>
                  <div className="space-y-1 text-sm">
                    <div>Target Response: {formatHours(rule.sla.targetResponseTime)}</div>
                    <div>Escalation: {formatHours(rule.sla.escalationThreshold)}</div>
                    <div>Max Approval: {formatHours(rule.sla.maxApprovalTime)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && statistics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Requests by Urgency</h3>
              <div className="space-y-2">
                {Object.entries(statistics.requestsByUrgency).map(([urgency, count]) => (
                  <div key={urgency} className="flex justify-between items-center">
                    <span className="capitalize">{urgency}</span>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Requests by Type</h3>
              <div className="space-y-2">
                {Object.entries(statistics.requestsByType).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="capitalize">{type}</span>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Approvers</h3>
              <div className="space-y-2">
                {Object.entries(statistics.requestsByApprover).map(([approver, count]) => (
                  <div key={approver} className="flex justify-between items-center">
                    <span>{approver}</span>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SLA Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Met SLA</span>
                  <span className="font-medium text-green-600">{statistics.slaCompliance.metPercentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Breached SLA</span>
                  <span className="font-medium text-red-600">{statistics.slaCompliance.breachedPercentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Response Time</span>
                  <span className="font-medium">{formatHours(statistics.slaCompliance.averageResponseTime)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Discount Request Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Request ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.metadata.referenceNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lead Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.leadName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lead Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.leadEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.productName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedRequest.discountType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Original Price</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedRequest.originalPrice)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedRequest.requestedDiscount)} ({selectedRequest.discountPercentage}%)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Final Price</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedRequest.finalPrice)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason for Discount</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.discountReason}</p>
                </div>

                {selectedRequest.approvedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Approval Details</label>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-900">Approved by: {selectedRequest.approvedBy.name} ({selectedRequest.approvedBy.title})</p>
                      <p className="text-sm text-gray-900">Approved at: {new Date(selectedRequest.approvedBy.approvedAt).toLocaleString()}</p>
                      {selectedRequest.approvedBy.comments && (
                        <p className="text-sm text-gray-900">Comments: {selectedRequest.approvedBy.comments}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Approve Discount Request</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to approve this discount request for <strong>{selectedRequest.leadName}</strong>?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Discount: {formatCurrency(selectedRequest.requestedDiscount)} ({selectedRequest.discountPercentage}%)
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments (optional)</label>
                <textarea
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any comments or conditions for this approval..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest.id, 1)} // Using approver ID 1 for demo
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Discount Request</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to reject this discount request for <strong>{selectedRequest.leadName}</strong>?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Discount: {formatCurrency(selectedRequest.requestedDiscount)} ({selectedRequest.discountPercentage}%)
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason *</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide a reason for rejection..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.id, 1)} // Using approver ID 1 for demo
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountApprovalManager;
