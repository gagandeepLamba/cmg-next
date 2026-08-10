'use client';

import { SearchableSelect } from '@/components/ui/searchable-select';
import { useState, useEffect } from 'react';
import { useSortableData, SortableTh } from '@/components/ui/sortable-th';
import {
  Users, UserPlus, Search, Eye, FileText,
  CheckCircle, RefreshCw,
  Mail, Phone, CreditCard,
  Star, ArrowRight, X
} from 'lucide-react';

interface ClientProfile {
  id: string;
  uniqueClientId: string;
  leadId: number;
  email: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    nationality?: string;
    address?: string;
    city?: string;
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
  verified: boolean;
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
  leadId: number;
  message: string;
}

export default function ClientRecognitionManager() {
  const [inquiry, setInquiry] = useState<ClientInquiry>({
    firstName: '', lastName: '', email: '', phone: '',
    productCategory: '', specificProduct: '', source: '', notes: ''
  });

  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [clientProfiles, setClientProfiles] = useState<ClientProfile[]>([]);
  const [statistics, setStatistics] = useState({ totalClients: 0, activeClients: 0, verifiedClients: 0, totalContracts: 0, totalContractValue: 0 });
  const [selectedClient, setSelectedClient] = useState<{ profile: ClientProfile; leads: any[]; contracts: any[] } | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const load = async (search = '') => {
    setIsLoading(true);
    try {
      const [clientsRes, statsRes] = await Promise.all([
        fetch(`/api/client-recognition?action=clients${search ? `&search=${encodeURIComponent(search)}` : ''}`),
        fetch('/api/client-recognition?action=statistics'),
      ]);
      const clientsJson = await clientsRes.json();
      const statsJson = await statsRes.json();
      if (clientsJson.success) setClientProfiles(clientsJson.data);
      if (statsJson.success) setStatistics(statsJson.data);
    } catch (error) {
      console.error('Error loading client recognition data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const viewClient = async (client: ClientProfile) => {
    try {
      const res = await fetch(`/api/client-recognition?action=client_history&clientId=${client.id}`);
      const json = await res.json();
      if (json.success) {
        setSelectedClient({ profile: json.data.clientProfile, leads: json.data.leads, contracts: json.data.contracts });
      }
    } catch (error) {
      console.error('Error loading client history:', error);
    }
  };

  const processInquiry = async () => {
    setLoading(true);
    try {
      const historyRes = await fetch(`/api/client-recognition?action=search_client&email=${encodeURIComponent(inquiry.email)}`);
      const isReturning = historyRes.ok;
      const existingProfile = isReturning ? (await historyRes.json()).data?.clientProfile : undefined;

      const leadRes = await fetch('/api/lead-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${inquiry.firstName} ${inquiry.lastName}`.trim(),
          email: inquiry.email,
          phone: inquiry.phone,
          program: inquiry.productCategory,
          service: inquiry.specificProduct,
          source: inquiry.source,
          message: inquiry.notes,
        }),
      });
      const leadJson = await leadRes.json();
      if (!leadRes.ok) throw new Error(leadJson.error || 'Failed to create lead');

      setProcessingResult({
        isReturningClient: isReturning,
        clientProfile: existingProfile,
        leadId: leadJson.leadId,
        message: isReturning
          ? `Returning client identified: ${existingProfile?.personalInfo?.firstName || inquiry.firstName} ${existingProfile?.personalInfo?.lastName || inquiry.lastName}`
          : `New inquiry logged as lead #${leadJson.leadId} for ${inquiry.firstName} ${inquiry.lastName}`,
      });

      setShowInquiryModal(false);
      setInquiry({ firstName: '', lastName: '', email: '', phone: '', productCategory: '', specificProduct: '', source: '', notes: '' });
      load(searchTerm);
    } catch (error) {
      window.toast.error(error instanceof Error ? error.message : 'Failed to process inquiry');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clientProfiles.filter(client => {
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesFilter;
  });

  const { sorted: sortedClients, sortKey: clientSortKey, sortDirection: clientSortDirection, toggleSort: toggleClientSort } = useSortableData(
    filteredClients,
    {
      client: (c) => `${c.personalInfo.firstName} ${c.personalInfo.lastName}`,
      contact: (c) => c.personalInfo.email,
      status: (c) => c.status,
      contracts: (c) => c.metadata.totalContracts,
      totalValue: (c) => c.metadata.totalValue,
      firstContact: (c) => c.metadata.firstContactDate,
    },
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString() : '—';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Client Recognition System</h2>
            <p className="text-gray-600 mt-1">Identify returning clients and log new inquiries</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => load(searchTerm)} className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={() => setShowInquiryModal(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" /> New Inquiry
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalClients}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.activeClients}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg"><Star className="w-6 h-6 text-purple-600" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified Clients</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.verifiedClients}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg"><CreditCard className="w-6 h-6 text-yellow-600" /></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contract Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(statistics.totalContractValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {processingResult && (
        <div className={`rounded-lg p-6 border ${processingResult.isReturningClient ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${processingResult.isReturningClient ? 'bg-blue-100' : 'bg-green-100'}`}>
              {processingResult.isReturningClient ? <RefreshCw className="w-6 h-6 text-blue-600" /> : <UserPlus className="w-6 h-6 text-green-600" />}
            </div>
            <div className="ml-4 flex-1">
              <h3 className={`text-lg font-semibold ${processingResult.isReturningClient ? 'text-blue-900' : 'text-green-900'}`}>
                {processingResult.message}
              </h3>
              <p className={`text-sm mt-1 ${processingResult.isReturningClient ? 'text-blue-700' : 'text-green-700'}`}>
                Lead ID: {processingResult.leadId}
              </p>
            </div>
            <button onClick={() => setProcessingResult(null)} className="text-gray-500 hover:text-gray-700">×</button>
          </div>
        </div>
      )}

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
                onChange={(e) => { setSearchTerm(e.target.value); load(e.target.value); }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <SearchableSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </SearchableSelect>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableTh label="Client" sortKey="client" activeKey={clientSortKey} direction={clientSortDirection} onSort={toggleClientSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" />
                <SortableTh label="Contact" sortKey="contact" activeKey={clientSortKey} direction={clientSortDirection} onSort={toggleClientSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" />
                <SortableTh label="Status" sortKey="status" activeKey={clientSortKey} direction={clientSortDirection} onSort={toggleClientSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" />
                <SortableTh label="Contracts" sortKey="contracts" activeKey={clientSortKey} direction={clientSortDirection} onSort={toggleClientSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" />
                <SortableTh label="Total Value" sortKey="totalValue" activeKey={clientSortKey} direction={clientSortDirection} onSort={toggleClientSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" />
                <SortableTh label="First Contact" sortKey="firstContact" activeKey={clientSortKey} direction={clientSortDirection} onSort={toggleClientSort} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedClients.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">{isLoading ? 'Loading...' : 'No clients found.'}</td></tr>
              )}
              {sortedClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.personalInfo.firstName} {client.personalInfo.lastName}</div>
                      <div className="text-sm text-gray-500">ID: {client.uniqueClientId}</div>
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
                      <div className="flex items-center"><Mail className="w-4 h-4 text-gray-400 mr-2" />{client.personalInfo.email}</div>
                      {client.personalInfo.phone && <div className="flex items-center mt-1"><Phone className="w-4 h-4 text-gray-400 mr-2" />{client.personalInfo.phone}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(client.status)}`}>{client.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.metadata.totalContracts}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(client.metadata.totalValue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(client.metadata.firstContactDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => viewClient(client)} className="text-blue-600 hover:text-blue-800"><Eye className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedClient.profile.personalInfo.firstName} {selectedClient.profile.personalInfo.lastName}
              </h3>
              <button onClick={() => setSelectedClient(null)} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Leads</h4>
                {selectedClient.leads.length === 0 ? <p className="text-sm text-gray-400">No leads found.</p> : (
                  <div className="space-y-2">
                    {selectedClient.leads.map((l: any) => (
                      <div key={l.id} className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 text-sm">
                        <span>{l.fname} {l.lname} — {l.service_interest || 'N/A'}</span>
                        <span className="text-gray-500">{l.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Contracts / Agreements</h4>
                {selectedClient.contracts.length === 0 ? <p className="text-sm text-gray-400">No contracts found.</p> : (
                  <div className="space-y-2">
                    {selectedClient.contracts.map((c: any) => (
                      <div key={c.id} className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 text-sm">
                        <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-gray-400" />{c.agreementNumber}</span>
                        <span className="text-gray-500">{formatCurrency(c.totalAmount)} · {c.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showInquiryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Process New Inquiry</h3>
                <button onClick={() => setShowInquiryModal(false)} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input type="text" value={inquiry.firstName} onChange={(e) => setInquiry({ ...inquiry, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter first name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input type="text" value={inquiry.lastName} onChange={(e) => setInquiry({ ...inquiry, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter last name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input type="email" value={inquiry.email} onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter email address" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input type="tel" value={inquiry.phone} onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter phone number" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Product Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
                      <SearchableSelect value={inquiry.productCategory} onChange={(e) => setInquiry({ ...inquiry, productCategory: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select category</option>
                        <option value="Student Visa">Student Visa</option>
                        <option value="Work Permit">Work Permit</option>
                        <option value="Business Visa">Business Visa</option>
                        <option value="Family Visa">Family Visa</option>
                        <option value="Investment Visa">Investment Visa</option>
                      </SearchableSelect>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specific Product</label>
                      <input type="text" value={inquiry.specificProduct} onChange={(e) => setInquiry({ ...inquiry, specificProduct: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter specific product" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                      <SearchableSelect value={inquiry.source} onChange={(e) => setInquiry({ ...inquiry, source: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select source</option>
                        <option value="website">Website</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="referral">Referral</option>
                        <option value="social_media">Social Media</option>
                      </SearchableSelect>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea value={inquiry.notes} onChange={(e) => setInquiry({ ...inquiry, notes: e.target.value })} rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter any additional notes" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button onClick={() => setShowInquiryModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={processInquiry} disabled={loading || !inquiry.firstName || !inquiry.lastName || !inquiry.email}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center">
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Process Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
