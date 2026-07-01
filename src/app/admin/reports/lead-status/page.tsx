'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, TrendingUp, Calendar, DollarSign, Globe, 
  Filter, Search, Download, Eye, BarChart3,
  MapPin, Phone, Mail, Building, Clock
} from 'lucide-react';

interface LeadData {
  id: number;
  fname: string;
  mname: string;
  lname: string;
  email: string;
  phone: string;
  mobile: string;
  nationality: string;
  address: string;
  dob: string;
  gender: string;
  country_interest: string;
  country_interest_label?: string;
  service_interest: string;
  service_interest_label?: string;
  market_source: string;
  market_source_label?: string;
  priority: string;
  status: string;
  regdate: string;
  payTotal: number;
  payBalance: number;
  dmEmployeeByASSIGNTo?: { id: number; name: string };
  dmBranch?: { id: number; name: string };
}

interface Statistics {
  totalLeads: number;
  newLeads: number;
  activeLeads: number;
  convertedLeads: number;
  totalRevenue: number;
  pendingRevenue: number;
  topCountries: Array<{ country: string; count: number }>;
  topServices: Array<{ service: string; count: number }>;
  monthlyTrends: Array<{ month: string; leads: number; revenue: number }>;
}

const formatCurrency = (value: number) => (
  new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(value)
);

export default function LeadStatusReport() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    country: '',
    service: '',
    dateFrom: '',
    dateTo: ''
  });
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Fetch leads data
      const leadsResponse = await fetch('/api/leads?limit=10000');
      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        const fetchedLeads = leadsData.leads || [];
        setLeads(fetchedLeads);
        setStatistics(calculateStatistics(fetchedLeads));
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (leadsData: LeadData[]): Statistics => {
    const totalLeads = leadsData.length;
    const newLeads = leadsData.filter(lead => String(lead.status).toLowerCase() === 'new').length;
    const convertedLeads = leadsData.filter(lead => {
      const status = String(lead.status || '').toLowerCase();
      return ['converted', 'retained', 'client'].includes(status) || String((lead as any).opportunity_status || '').toLowerCase() === 'won';
    }).length;
    const activeLeads = totalLeads - newLeads - convertedLeads;
    
    const totalRevenue = leadsData.reduce((sum, lead) => sum + Number(lead.payTotal || 0), 0);
    const pendingRevenue = leadsData.reduce((sum, lead) => sum + Number(lead.payBalance || 0), 0);

    // Group by country
    const countryCounts: { [key: string]: number } = {};
    leadsData.forEach(lead => {
      const country = lead.country_interest_label || lead.country_interest || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    const topCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Group by service
    const serviceCounts: { [key: string]: number } = {};
    leadsData.forEach(lead => {
      const service = lead.service_interest_label || lead.service_interest || 'Unknown';
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });
    const topServices = Object.entries(serviceCounts)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const monthlyMap: Record<string, { month: string; leads: number; revenue: number }> = {};
    leadsData.forEach(lead => {
      const date = new Date(lead.regdate || Date.now());
      const month = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      if (!monthlyMap[month]) monthlyMap[month] = { month, leads: 0, revenue: 0 };
      monthlyMap[month].leads += 1;
      monthlyMap[month].revenue += Number(lead.payTotal || 0);
    });
    const monthlyTrends = Object.values(monthlyMap).slice(-6);

    return {
      totalLeads,
      newLeads,
      activeLeads,
      convertedLeads,
      totalRevenue,
      pendingRevenue,
      topCountries,
      topServices,
      monthlyTrends
    };
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = `${lead.fname} ${lead.lname} ${lead.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filters.status || lead.status === filters.status;
    const matchesPriority = !filters.priority || lead.priority === filters.priority;
    const matchesCountry = !filters.country || lead.country_interest === filters.country;
    const matchesService = !filters.service || lead.service_interest === filters.service;
    const leadDate = lead.regdate ? new Date(lead.regdate) : null;
    const matchesDateFrom = !filters.dateFrom || (leadDate && leadDate >= new Date(filters.dateFrom));
    const matchesDateTo = !filters.dateTo || (leadDate && leadDate <= new Date(filters.dateTo));
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCountry && matchesService && matchesDateFrom && matchesDateTo;
  });

  const exportToExcel = () => {
    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Country', 'Service', 'Status', 'Priority', 'Registration Date', 'Total Payment', 'Balance'];
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.id,
        `${lead.fname} ${lead.lname}`,
        lead.email,
        lead.phone,
        lead.country_interest_label || lead.country_interest,
        lead.service_interest_label || lead.service_interest,
        lead.status,
        lead.priority,
        lead.regdate,
        lead.payTotal,
        lead.payBalance
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Status Report</h1>
              <p className="text-gray-600 mt-2">Comprehensive analysis of leads from DmcForumLeads table</p>
            </div>
            <button
              onClick={exportToExcel}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalLeads}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Leads</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.newLeads}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(statistics.totalRevenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Revenue</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(statistics.pendingRevenue)}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Countries */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
            {statistics?.topCountries.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700">{item.country}</span>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{item.count}</span>
              </div>
            ))}
          </div>

          {/* Top Services */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h3>
            {statistics?.topServices.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700">{item.service}</span>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search leads..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({...filters, country: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {statistics?.topCountries.map(country => (
                  <option key={country.country} value={country.country}>{country.country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Leads ({filteredLeads.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {lead.fname} {lead.lname}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {lead.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.country_interest_label || lead.country_interest}</div>
                      <div className="text-sm text-gray-500">{lead.service_interest_label || lead.service_interest}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        lead.status === 'New' ? 'bg-green-100 text-green-800' :
                        lead.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'Converted' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.dmEmployeeByASSIGNTo?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(Number(lead.payTotal || 0))}</div>
                      <div className="text-sm text-gray-500">Balance: {formatCurrency(Number(lead.payBalance || 0))}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
