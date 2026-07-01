'use client';

import { useState, useEffect } from 'react';
import {
  Users, UserPlus, Search, Filter, Eye, FileText, Calendar,
  TrendingUp, Clock, CheckCircle, AlertCircle, RefreshCw,
  Mail, Phone, Globe, CreditCard, Activity, BarChart3,
  Download, Settings, ChevronRight, Star, ArrowRight
} from 'lucide-react';

interface ClientProfile {
  id: string;
  uniqueClientId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    nationality?: string;
  };
  metadata: {
    firstContactDate: string;
    lastContactDate: string;
    totalInteractions: number;
    totalContracts: number;
    totalValue: number;
    conversionRate: number;
    tags: string[];
  };
  status: 'active' | 'inactive' | 'blacklisted';
}

interface ClientInquiry {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  productCategory: string;
  specificProduct: string;
  source: string;
  notes?: string;
}

interface ProcessingResult {
  isReturningClient: boolean;
  clientProfile?: ClientProfile;
  lead: any;
  action: string;
  message: string;
}

export default function ClientRecognitionManager() {
  const [inquiry, setInquiry] = useState<ClientInquiry>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    productCategory: '',
    specificProduct: '',
    source: '',
    notes: ''
  });

  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientProfiles, setClientProfiles] = useState<ClientProfile[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'blacklisted'>('all');

  const statistics = {
    totalClients: 0,
    activeClients: ([] as any[]).filter(c => c.status === 'active').length,
    returningClients: ([] as any[]).filter(c => c.metadata.totalContracts > 1).length,
    totalContracts: ([] as any[]).reduce((sum, c) => sum + c.metadata.totalContracts, 0),
    totalValue: ([] as any[]).reduce((sum, c) => sum + c.metadata.totalValue, 0),
    averageContractsPerClient: 0 > 0 ? 
      ([] as any[]).reduce((sum, c) => sum + c.metadata.totalContracts, 0) / 0 : 0,
    averageValuePerClient: 0 > 0 ? 
      ([] as any[]).reduce((sum, c) => sum + c.metadata.totalValue, 0) / 0 : 0
  };

  useEffect(() => {
    setClientProfiles([]);
  }, []);

  const processInquiry = async () => {
    setLoading(true);
    try {
      // Simulate API call to process inquiry
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if client exists (simple email match for demo)
      const existingClient = ([] as any[]).find(
        client => client.personalInfo.email.toLowerCase() === inquiry.email.toLowerCase()
      );

      const result: ProcessingResult = {
        isReturningClient: !!existingClient,
        clientProfile: existingClient || undefined,
        lead: {
          id: `lead-${Date.now()}`,
          title: inquiry.specificProduct,
          status: 'new',
          createdAt: new Date().toISOString()
        },
        action: existingClient ? 'existing_client_identified' : 'new_profile_created',
        message: existingClient 
          ? `Returning client identified: ${existingClient.personalInfo.firstName} ${existingClient.personalInfo.lastName}`
          : `New client profile created: ${inquiry.firstName} ${inquiry.lastName}`
      };

      setProcessingResult(result);
      
      // Reset form
      setInquiry({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        productCategory: '',
        specificProduct: '',
        source: '',
        notes: ''
      });
      
    } catch (error) {
      console.error('Error processing inquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clientProfiles.filter(client => {
    const matchesSearch = 
      client.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'blacklisted': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Client Recognition System</h2>
            <p className="text-gray-600 mt-1">Identify returning clients and generate new contracts</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowInquiryModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              New Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.activeClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Returning Clients</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.returningClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(statistics.totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Result */}
      {processingResult && (
        <div className={`rounded-lg p-6 border ${
          processingResult.isReturningClient 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${
              processingResult.isReturningClient 
                ? 'bg-blue-100' 
                : 'bg-green-100'
            }`}>
              {processingResult.isReturningClient ? (
                <RefreshCw className="w-6 h-6 text-blue-600" />
              ) : (
                <UserPlus className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div className="ml-4 flex-1">
              <h3 className={`text-lg font-semibold ${
                processingResult.isReturningClient 
                  ? 'text-blue-900' 
                  : 'text-green-900'
              }`}>
                {processingResult.message}
              </h3>
              <p className={`text-sm mt-1 ${
                processingResult.isReturningClient 
                  ? 'text-blue-700' 
                  : 'text-green-700'
              }`}>
                Lead ID: {processingResult.lead.id} | Status: {processingResult.lead.status}
              </p>
            </div>
            <button
              onClick={() => setProcessingResult(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Client Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Client Database</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
          </div>
        </div>

        {/* Client List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contracts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {client.personalInfo.firstName} {client.personalInfo.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {client.uniqueClientId}
                      </div>
                      {client.metadata.totalContracts > 1 && (
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-xs text-yellow-600">Returning Client</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        {client.personalInfo.email}
                      </div>
                      {client.personalInfo.phone && (
                        <div className="flex items-center mt-1">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          {client.personalInfo.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.metadata.totalContracts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(client.metadata.totalValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(client.metadata.lastContactDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Process New Inquiry</h3>
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={inquiry.firstName}
                        onChange={(e) => setInquiry({...inquiry, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={inquiry.lastName}
                        onChange={(e) => setInquiry({...inquiry, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={inquiry.email}
                        onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={inquiry.phone}
                        onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Product Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
                      <select
                        value={inquiry.productCategory}
                        onChange={(e) => setInquiry({...inquiry, productCategory: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select category</option>
                        <option value="Student Visa">Student Visa</option>
                        <option value="Work Permit">Work Permit</option>
                        <option value="Business Visa">Business Visa</option>
                        <option value="Family Visa">Family Visa</option>
                        <option value="Investment Visa">Investment Visa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specific Product</label>
                      <input
                        type="text"
                        value={inquiry.specificProduct}
                        onChange={(e) => setInquiry({...inquiry, specificProduct: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter specific product"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                      <select
                        value={inquiry.source}
                        onChange={(e) => setInquiry({...inquiry, source: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select source</option>
                        <option value="website">Website</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="referral">Referral</option>
                        <option value="social_media">Social Media</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={inquiry.notes}
                    onChange={(e) => setInquiry({...inquiry, notes: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter any additional notes"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowInquiryModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={processInquiry}
                disabled={loading || !inquiry.firstName || !inquiry.lastName || !inquiry.email}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                Process Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
