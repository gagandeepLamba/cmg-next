'use client';

import { useState, useEffect } from 'react';
import {
  Users, ArrowRight, CheckCircle, XCircle, Clock, AlertTriangle,
  Filter, Search, Eye, Edit, Trash2, Plus,
  TrendingUp, BarChart3, Calendar, Mail, Phone,
  UserCheck, UserX, RefreshCw, Download, Settings
} from 'lucide-react';

interface LeadTransferRequest {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  currentCounselorName: string;
  requestedCounselorName: string;
  targetBranchManagerName: string;
  reason: string;
  urgency: string;
  priority: string;
  transferType: string;
  status: string;
  requestedAt: string;
  reviewedAt?: string;
  respondedAt?: string;
  approverName?: string;
  approverComments?: string;
  rejectionReason?: string;
}

interface BranchManager {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  currentLeads: number;
  maxLeads: number;
  utilizationRate: number;
}

export default function LeadTransferManager() {
  const [activeTab, setActiveTab] = useState<'requests' | 'managers' | 'rules' | 'analytics'>('requests');
  const [transferRequests, setTransferRequests] = useState<LeadTransferRequest[]>([]);
  const [branchManagers, setBranchManagers] = useState<BranchManager[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeadTransferRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    setTransferRequests([]);
    setBranchManagers([]);
  }, []);

  const handleApproveRequest = async (requestId: string, comments?: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTransferRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: 'approved', 
              reviewedAt: new Date().toISOString(),
              respondedAt: new Date().toISOString(),
              approverName: 'Current User',
              approverComments: comments 
            }
          : req
      ));
      
      // Send notification
      console.log('Transfer request approved:', requestId);
    } catch (error) {
      console.error('Error approving request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string, reason: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTransferRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: 'rejected', 
              reviewedAt: new Date().toISOString(),
              respondedAt: new Date().toISOString(),
              approverName: 'Current User',
              rejectionReason: reason 
            }
          : req
      ));
      
      // Send notification
      console.log('Transfer request rejected:', requestId, reason);
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredRequests = transferRequests.filter(request => {
    const matchesSearch = !searchTerm || 
      request.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leadEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesUrgency = filterUrgency === 'all' || request.urgency === filterUrgency;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesUrgency && matchesPriority;
  });

  const statistics = {
    totalRequests: transferRequests.length,
    pendingRequests: transferRequests.filter(r => r.status === 'pending').length,
    approvedRequests: transferRequests.filter(r => r.status === 'approved').length,
    rejectedRequests: transferRequests.filter(r => r.status === 'rejected').length,
    averageResponseTime: 4.2,
    requestsByUrgency: {
      critical: transferRequests.filter(r => r.urgency === 'critical').length,
      high: transferRequests.filter(r => r.urgency === 'high').length,
      medium: transferRequests.filter(r => r.urgency === 'medium').length,
      low: transferRequests.filter(r => r.urgency === 'low').length
    },
    requestsByType: {
      assignment: transferRequests.filter(r => r.transferType === 'assignment').length,
      escalation: transferRequests.filter(r => r.transferType === 'escalation').length,
      specialist_required: transferRequests.filter(r => r.transferType === 'specialist_required').length,
      capacity_issue: transferRequests.filter(r => r.transferType === 'capacity_issue').length
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Lead Transfer Requests</h2>
            <p className="text-gray-600 mt-1">Counselor requests for lead transfers to branch managers</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Transfer Request
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.approvedRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.rejectedRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.averageResponseTime}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Transfer Requests
              </div>
            </button>
            <button
              onClick={() => setActiveTab('managers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'managers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Branch Managers
              </div>
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Transfer Rules
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </div>
            </button>
          </nav>
        </div>

        {/* Transfer Requests Tab */}
        {activeTab === 'requests' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <select
                  value={filterUrgency}
                  onChange={(e) => setFilterUrgency(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Urgency</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priority</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.leadName}</div>
                          <div className="text-sm text-gray-500">{request.leadEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.currentCounselorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.requestedCounselorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.targetBranchManagerName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate" title={request.reason}>
                          {request.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveRequest(request.id)}
                                disabled={loading}
                                className="text-green-600 hover:text-green-800"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => {
                                  const reason = prompt('Please enter rejection reason:');
                                  if (reason) {
                                    handleRejectRequest(request.id, reason);
                                  }
                                }}
                                disabled={loading}
                                className="text-red-600 hover:text-red-800"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Branch Managers Tab */}
        {activeTab === 'managers' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {([] as any[]).map((manager) => (
                <div key={manager.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{manager.name}</h3>
                      <p className="text-sm text-gray-600">{manager.email}</p>
                      <p className="text-sm text-gray-500">{manager.department}</p>
                      <p className="text-sm text-gray-500">{manager.role}</p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(manager.status)}`}>
                      {manager.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current Leads:</span>
                      <span className="font-medium text-gray-900">{manager.currentLeads}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Leads:</span>
                      <span className="font-medium text-gray-900">{manager.maxLeads}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Utilization:</span>
                      <span className="font-medium text-gray-900">{manager.utilizationRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.totalRequests}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statistics.totalRequests > 0 ? 
                        ((statistics.approvedRequests / statistics.totalRequests) * 100).toFixed(1) : '0'
                    }%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 lg:col-span-2">
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900">Requests by Urgency</h4>
                  <div className="space-y-2">
                    {Object.entries(statistics.requestsByUrgency).map(([urgency, count]) => (
                      <div key={urgency} className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(urgency)}`}>
                          {urgency}
                        </span>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900">Requests by Type</h4>
                  <div className="space-y-2">
                    {Object.entries(statistics.requestsByType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                        <span className="font-medium text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Transfer Request Details</h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Lead Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">{selectedRequest.leadName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{selectedRequest.leadEmail}</span>
                    </div>
                    {selectedRequest.leadPhone && (
                      <div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="font-medium text-gray-900">{selectedRequest.leadPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Transfer Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">From:</span>
                      <span className="font-medium text-gray-900">{selectedRequest.currentCounselorName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">To:</span>
                      <span className="font-medium text-gray-900">{selectedRequest.requestedCounselorName}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Manager:</span>
                      <span className="font-medium text-gray-900">{selectedRequest.targetBranchManagerName}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Request Details</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Reason:</span>
                      <span className="font-medium text-gray-900">{selectedRequest.reason}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{selectedRequest.transferType.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Urgency:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(selectedRequest.urgency)}`}>
                        {selectedRequest.urgency}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Priority:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedRequest.priority)}`}>
                        {selectedRequest.priority}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Timeline</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Requested:</span>
                      <span className="font-medium text-gray-900">{new Date(selectedRequest.requestedAt).toLocaleString()}</span>
                    </div>
                    {selectedRequest.reviewedAt && (
                      <div>
                        <span className="text-sm text-gray-600">Reviewed:</span>
                        <span className="font-medium text-gray-900">{new Date(selectedRequest.reviewedAt).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedRequest.respondedAt && (
                      <div>
                        <span className="text-sm text-gray-600">Responded:</span>
                        <span className="font-medium text-gray-900">{new Date(selectedRequest.respondedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedRequest.approverComments && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Manager Comments</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-900">{selectedRequest.approverComments}</p>
                    </div>
                  </div>
                )}
                
                {selectedRequest.rejectionReason && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Rejection Reason</h4>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-900">{selectedRequest.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
