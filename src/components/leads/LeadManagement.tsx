'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Plus, Edit, Trash2, Download, Upload, Users,
  Filter, Calendar, Phone, Mail, MapPin, DollarSign,
  Eye, MoreHorizontal, CheckCircle, XCircle, Clock,
  Target, X, Save, LayoutList, LayoutGrid, Briefcase, MessageSquare
} from 'lucide-react';
import LeadKanbanSimple from './LeadKanbanSimple';
import { Lead } from '@/types/lead';

interface LeadManagementProps {
  onLeadSelect?: (lead: Lead) => void;
  onConvertToOpportunity?: (leadId: number) => void;
  showActions?: boolean;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

type LeadActionType = 'appointment' | 'followup' | 'remark';

interface LeadActionForm {
  date: string;
  time: string;
  employeeId: string;
  title: string;
  notes: string;
  meetingType: string;
  priority: string;
}

interface LeadActivity {
  appointments: Array<{
    id: number;
    date?: string | null;
    appointtime?: string | null;
    booked?: number | null;
    done?: number | null;
    not_done?: number | null;
    screenshot?: string | null;
    counselorName?: string | null;
    branchName?: string | null;
  }>;
  followUps: Array<{
    id: number;
    reminder_date?: string | null;
    message?: string | null;
    status?: string | null;
    priority?: string | null;
    employeeName?: string | null;
  }>;
  remarks: Array<{
    id: number;
    date?: string | null;
    created?: string | null;
    remark?: string | null;
    employeeName?: string | null;
  }>;
  summary: {
    appointments: number;
    fixedAppointments: number;
    completedAppointments: number;
    followUps: number;
    pendingFollowUps: number;
    remarks: number;
  };
}

export default function LeadManagement({ onLeadSelect, onConvertToOpportunity, showActions = true }: LeadManagementProps) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    branch: '',
    region: '',
    countryInterest: '',
    serviceInterest: '',
    marketSource: '',
    leadQuality: '',
    dateFrom: '',
    dateTo: ''
  });
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({});
  const [importing, setImporting] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [activeTab, setActiveTab] = useState<'leads' | 'opportunities'>('leads');
  const [showLeadActionModal, setShowLeadActionModal] = useState(false);
  const [leadActionType, setLeadActionType] = useState<LeadActionType>('appointment');
  const [leadActionForm, setLeadActionForm] = useState<LeadActionForm>({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    employeeId: '',
    title: '',
    notes: '',
    meetingType: 'consultation',
    priority: 'medium'
  });
  const [leadActionSaving, setLeadActionSaving] = useState(false);
  const [leadActivity, setLeadActivity] = useState<LeadActivity | null>(null);
  const [leadActivityLoading, setLeadActivityLoading] = useState(false);
  const [leadActivityError, setLeadActivityError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API functions
  const fetchLeads = async (forceKanban?: boolean) => {
    try {
      setLoading(true);
      const isKanban = forceKanban ?? viewMode === 'kanban';
      const params = new URLSearchParams({
        page: isKanban ? '1' : pagination.page.toString(),
        limit: isKanban ? '500' : pagination.limit.toString(),
        search: searchTerm,
        opportunityView: activeTab,
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, {} as Record<string, string>)
      });

      const response = await fetch(`/api/leads?${params}`);
      const data = await response.json();

      if (response.ok) {
        // Console log lead conversion data
        console.log('=== LEAD CONVERSION DATA ===');
        console.log('Total leads fetched:', data.leads?.length || 0);
        console.log('Pagination:', data.pagination);

        // Log conversion statistics
        const conversionStats = {
          total: data.leads?.length || 0,
          prospect: data.leads?.filter((lead: any) => lead.status === 'Prospect')?.length || 0,
          notInterested: data.leads?.filter((lead: any) => lead.status === 'Not Interested')?.length || 0,
          dnq: data.leads?.filter((lead: any) => lead.status === 'DNQ')?.length || 0,
          notAnswered: data.leads?.filter((lead: any) => lead.status === 'Not_answered')?.length || 0,
          couldNotConnect: data.leads?.filter((lead: any) => lead.status === 'Could Not Connect')?.length || 0,
          callBack: data.leads?.filter((lead: any) => lead.status === 'Call Back')?.length || 0,
          abroadLead: data.leads?.filter((lead: any) => lead.status === 'Abroad Lead')?.length || 0
        };

        console.log('Conversion Statistics:', conversionStats);
        console.log('Prospect Rate:', `${((conversionStats.prospect / conversionStats.total) * 100).toFixed(2)}%`);
        console.log('Not Interested Rate:', `${((conversionStats.notInterested / conversionStats.total) * 100).toFixed(2)}%`);
        console.log('DNQ Rate:', `${((conversionStats.dnq / conversionStats.total) * 100).toFixed(2)}%`);
        console.log('Not Answered Rate:', `${((conversionStats.notAnswered / conversionStats.total) * 100).toFixed(2)}%`);
        console.log('Could Not Connect Rate:', `${((conversionStats.couldNotConnect / conversionStats.total) * 100).toFixed(2)}%`);
        console.log('Call Back Rate:', `${((conversionStats.callBack / conversionStats.total) * 100).toFixed(2)}%`);
        console.log('Abroad Lead Rate:', `${((conversionStats.abroadLead / conversionStats.total) * 100).toFixed(2)}%`);

        // Log individual leads with conversion info
        data.leads?.forEach((lead: any, index: number) => {
          console.log(`Lead ${index + 1}:`, {
            id: lead.id,
            name: `${lead.fname} ${lead.lname}`,
            status: lead.status,
            priority: lead.priority,
            countryInterest: lead.country_interest,
            serviceInterest: lead.service_interest,
            created: lead.created,
            isProspect: lead.status === 'Prospect',
            isNotInterested: lead.status === 'Not Interested',
            isDNQ: lead.status === 'DNQ',
            isNotAnswered: lead.status === 'Not_answered',
            isCouldNotConnect: lead.status === 'Could Not Connect',
            isCallBack: lead.status === 'Call Back',
            isAbroadLead: lead.status === 'Abroad Lead'
          });
        });
        console.log('=== END CONVERSION DATA ===');

        setLeads(data.leads || []);
        setPagination(data.pagination);
      } else {
        console.error('Error fetching leads:', data.error);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [pagination.page, searchTerm, filters, activeTab, viewMode]);

  const handleTabChange = (tab: 'leads' | 'opportunities') => {
    setActiveTab(tab);
    setSelectedLeads([]);
    setViewMode('list');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCreateLead = async () => {
    try {
      // Basic validation
      if (!formData.fname || !formData.lname) {
        alert('First Name and Last Name are required');
        return;
      }

      if (!formData.email && !formData.phone) {
        alert('Either Email or Phone is required');
        return;
      }

      const response = await fetch('/api/leads-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({});
        fetchLeads();
        alert('Lead created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error creating lead:', errorData);
        alert(`Error creating lead: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Error creating lead. Please try again.');
    }
  };

  const handleUpdateLead = async () => {
    if (!currentLead) return;

    try {
      const response = await fetch(`/api/leads-simple/${currentLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowEditModal(false);
        setCurrentLead(null);
        setFormData({});
        fetchLeads();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Error updating lead: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleDeleteLead = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/leads-simple/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchLeads();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Error deleting lead: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads-simple/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchLeads();
      } else {
        console.error('Error updating lead status');
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleViewLead = (lead: Lead) => {
    setCurrentLead(lead);
    setShowViewModal(true);
    onLeadSelect?.(lead);
    fetchLeadActivity(Number(lead.id));
  };

  const fetchLeadActivity = async (leadId: number) => {
    if (!leadId) return;

    setLeadActivityLoading(true);
    setLeadActivityError('');
    try {
      const response = await fetch(`/api/leads/${leadId}/activity`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load lead activity');
      }

      setLeadActivity(data);
    } catch (error) {
      console.error('Error loading lead activity:', error);
      setLeadActivity(null);
      setLeadActivityError(error instanceof Error ? error.message : 'Failed to load lead activity');
    } finally {
      setLeadActivityLoading(false);
    }
  };

  const openLeadActionModal = (lead: Lead, actionType: LeadActionType) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const leadName = `${lead.fname || ''} ${lead.lname || ''}`.trim() || `Lead #${lead.id}`;

    setCurrentLead(lead);
    setShowViewModal(false);
    setLeadActionType(actionType);
    setLeadActionForm({
      date: now.toISOString().split('T')[0],
      time: currentTime,
      employeeId: String(lead.assignTo || lead.dmEmployeeByASSIGNTo?.id || ''),
      title: actionType === 'appointment'
        ? `Appointment with ${leadName}`
        : actionType === 'followup'
          ? `Follow up with ${leadName}`
          : '',
      notes: '',
      meetingType: actionType === 'appointment' ? 'consultation' : 'follow_up',
      priority: String(lead.priority || 'medium').toLowerCase()
    });
    setShowLeadActionModal(true);
  };

  const closeLeadActionModal = () => {
    setShowLeadActionModal(false);
    setLeadActionSaving(false);
  };

  const handleLeadActionSubmit = async () => {
    if (!currentLead) return;

    const leadId = Number(currentLead.id);
    const employeeId = Number(leadActionForm.employeeId || currentLead.assignTo || currentLead.dmEmployeeByASSIGNTo?.id || 1);
    const timeWithSeconds = leadActionForm.time.length === 5 ? `${leadActionForm.time}:00` : leadActionForm.time;
    const scheduledAt = `${leadActionForm.date}T${leadActionForm.time}`;

    if (leadActionType !== 'remark' && (!leadActionForm.date || !leadActionForm.time)) {
      alert('Please select date and time');
      return;
    }

    if (leadActionType === 'remark' && !leadActionForm.notes.trim()) {
      alert('Please enter a remark');
      return;
    }

    setLeadActionSaving(true);
    try {
      let response: Response;

      if (leadActionType === 'appointment') {
        response = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId,
            date: leadActionForm.date,
            appointtime: timeWithSeconds,
            counselorId: employeeId,
            branch: currentLead.branch,
            region: currentLead.region,
            booked: 1,
            screenshot: leadActionForm.notes
          })
        });

        if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'Failed to book appointment');

        await fetch(`/api/leads/${leadId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointment: `${leadActionForm.date} ${timeWithSeconds}`
          })
        });
      } else if (leadActionType === 'followup') {
        response = await fetch('/api/follow-up-reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId,
            employeeId,
            scheduledAt,
            subject: leadActionForm.title || 'Lead follow-up',
            message: leadActionForm.notes || leadActionForm.title || 'Lead follow-up',
            priority: leadActionForm.priority || 'medium'
          })
        });

        if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'Failed to add follow-up');

        await fetch(`/api/leads/${leadId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            followup: leadActionForm.date,
            folowuptime: timeWithSeconds,
            followupstat: 0
          })
        });
      } else {
        response = await fetch('/api/lead-remarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId,
            employeeId,
            remark: leadActionForm.notes
          })
        });

        if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'Failed to add remark');
      }

      closeLeadActionModal();
      await fetchLeads();
      await fetchLeadActivity(leadId);
      alert(
        leadActionType === 'appointment'
          ? 'Appointment booked successfully'
          : leadActionType === 'followup'
            ? 'Follow-up added successfully'
            : 'Remark added successfully'
      );
    } catch (error) {
      console.error('Error saving lead action:', error);
      alert(error instanceof Error ? error.message : 'Failed to save lead action');
    } finally {
      setLeadActionSaving(false);
    }
  };

  const handleConvertToOpportunity = async (leadId: number) => {
    try {
      const numericLeadId = Number(leadId);
      const lead = leads.find(l => Number(l.id) === numericLeadId);
      if (!lead) {
        alert('Lead not found');
        return;
      }

      const confirmed = confirm(`Open opportunity wizard for ${lead.fname} ${lead.lname}?`);
      if (!confirmed) return;

      router.push(`/admin/leads/opportunity-flow?leadId=${numericLeadId}`);
    } catch (error) {
      console.error('Error converting lead to opportunity:', error);
      alert('Unable to open opportunity wizard. Please try again.');
    }
  };

  const getOperationsPath = (lead: Lead) => {
    const country = String(lead.country_interest || '').toLowerCase();
    const service = String(lead.service_interest || '').toLowerCase();
    const combined = `${country} ${service}`;

    if (combined.includes('resume') || combined.includes('rms') || combined.includes('marketing')) {
      return '/admin/leads/rms-operations';
    }
    if (combined.includes('visit') || combined.includes('tourist')) {
      return '/admin/leads/visit-visa-operations';
    }
    if (combined.includes('work visa') || combined.includes('work permit') || combined.includes('employment')) {
      return '/admin/leads/poland-visa-operations';
    }
    if (combined.includes('australia')) {
      return '/admin/leads/skill-australia-operations';
    }
    if (combined.includes('canada')) {
      return '/admin/leads/skill-canada-operations';
    }
    return '/admin/leads/skill-canada-operations';
  };

  const isClientLead = (lead: Lead) => {
    const status = String(lead.status || '').toLowerCase();
    const opportunityStatus = String((lead as any).opportunity_status || '').toLowerCase();
    return ['retained', 'converted', 'client'].includes(status) || opportunityStatus === 'won';
  };

  const handleOpenOperations = async (lead: Lead) => {
    try {
      let opportunityId = Number((lead as any).opportunity_id || (lead as any).resolved_opportunity_id);
      if (!opportunityId) {
        const response = await fetch(`/api/opportunities?leadId=${lead.id}`);
        if (response.ok) {
          const opportunities = await response.json();
          opportunityId = Number(Array.isArray(opportunities) ? opportunities[0]?.id : 0);
        }
      }

      if (!opportunityId) {
        alert('No opportunity found for this client. Please complete the opportunity flow first.');
        return;
      }

      const clientName = `${lead.fname || ''} ${lead.lname || ''}`.trim() || 'Client';
      router.push(`${getOperationsPath(lead)}?opportunityId=${opportunityId}&leadId=${lead.id}&clientName=${encodeURIComponent(clientName)}`);
    } catch (error) {
      console.error('Error opening operations:', error);
      alert('Unable to open operations module for this client.');
    }
  };

  const handleBulkConvertToOpportunity = async () => {
    if (selectedLeads.length === 0) {
      alert('Please select a lead to convert');
      return;
    }

    if (selectedLeads.length > 1) {
      alert('Please select only one lead at a time. The opportunity wizard works one lead at a time.');
      return;
    }

    const selectedLeadId = Number(selectedLeads[0]);
    const lead = leads.find(l => Number(l.id) === selectedLeadId);
    if (!lead) {
      alert('Selected lead not found');
      return;
    }

    const confirmed = confirm(`Open opportunity wizard for ${lead.fname} ${lead.lname}?`);
    if (!confirmed) return;

    router.push(`/admin/leads/opportunity-flow?leadId=${selectedLeadId}`);
  };

  const handleExportExcel = async () => {
    try {
      const params = new URLSearchParams({
        exportType: 'excel',
        opportunityView: activeTab,
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, {} as Record<string, string>)
      });

      const response = await fetch(`/api/leads?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = activeTab === 'opportunities' ? 'opportunity-list-export.xlsx' : 'leads-export.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting leads:', error);
    }
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];

        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            importType: 'excel',
            fileData: base64
          })
        });

        if (response.ok) {
          const data = await response.json();
          alert(data.message);
          fetchLeads();
        } else {
          console.error('Error importing leads');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error importing leads:', error);
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(leads.map(lead => Number(lead.id)).filter(Boolean));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id: number, checked: boolean) => {
    const numericId = Number(id);
    if (checked) {
      setSelectedLeads([...selectedLeads, numericId]);
    } else {
      setSelectedLeads(selectedLeads.filter(leadId => leadId !== numericId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Prospect': return 'bg-blue-100 text-blue-800';
      case 'Not Interested': return 'bg-red-100 text-red-800';
      case 'DNQ': return 'bg-gray-100 text-gray-800';
      case 'Not_answered': return 'bg-yellow-100 text-yellow-800';
      case 'Could Not Connect': return 'bg-orange-100 text-orange-800';
      case 'Call Back': return 'bg-purple-100 text-purple-800';
      case 'Abroad Lead': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Hot': return 'bg-red-100 text-red-800';
      case 'Warm': return 'bg-orange-100 text-orange-800';
      case 'Cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadActionTitle = () => {
    if (leadActionType === 'appointment') return 'Book Appointment';
    if (leadActionType === 'followup') return 'Add Follow-up';
    return 'Add Lead Remark';
  };

  const formatDate = (value?: string | null) => {
    if (!value) return 'No date';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleDateString();
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return 'No date';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString();
  };

  const formatTime = (value?: string | null) => {
    if (!value) return 'No time';
    return String(value).slice(0, 5);
  };

  const getAppointmentLabel = (appointment: LeadActivity['appointments'][number]) => {
    if (Number(appointment.done || 0) === 1) return 'Completed';
    if (Number(appointment.not_done || 0) === 1) return 'Not Done';
    if (Number(appointment.booked || 0) === 1) return 'Fixed';
    return 'Pending';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTabChange('leads')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'leads'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Lead List
          </button>
          <button
            onClick={() => handleTabChange('opportunities')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'opportunities'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Opportunity List
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={activeTab === 'opportunities' ? 'Search opportunities...' : 'Search leads...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Prospect">Prospect/Interested</option>
            <option value="Not Interested">Not Interested</option>
            <option value="DNQ">DNQ</option>
            <option value="Not_answered">Not Answered</option>
            <option value="Could Not Connect">Could Not Connect/Wrong Number</option>
            <option value="Call Back">Call Back</option>
            <option value="Abroad Lead">Abroad Lead</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={filters.branch}
            onChange={(e) => setFilters({...filters, branch: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Branches</option>
            <option value="1">Dubai</option>
            <option value="2">Abu Dhabi</option>
            <option value="3">Sharjah</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <select
            value={filters.countryInterest}
            onChange={(e) => setFilters({...filters, countryInterest: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Countries</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="UK">UK</option>
            <option value="USA">USA</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
          </select>

          <select
            value={filters.serviceInterest}
            onChange={(e) => setFilters({...filters, serviceInterest: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Services</option>
            <option value="Immigration">Immigration</option>
            <option value="Student Visa">Student Visa</option>
            <option value="Work Permit">Work Permit</option>
            <option value="Business Immigration">Business Immigration</option>
            <option value="Family Sponsorship">Family Sponsorship</option>
          </select>

          <select
            value={filters.marketSource}
            onChange={(e) => setFilters({...filters, marketSource: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Social Media">Social Media</option>
            <option value="Referral">Referral</option>
            <option value="Email Campaign">Email Campaign</option>
            <option value="Cold Call">Cold Call</option>
          </select>

          <select
            value={filters.leadQuality}
            onChange={(e) => setFilters({...filters, leadQuality: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Qualities</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              placeholder="Date From"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              placeholder="Date To"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setFilters({
              status: '',
              priority: '',
              branch: '',
              region: '',
              countryInterest: '',
              serviceInterest: '',
              marketSource: '',
              leadQuality: '',
              dateFrom: '',
              dateTo: ''
            })}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
          >
            Clear Filters
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} {activeTab === 'opportunities' ? 'opportunities' : 'leads'}
            </span>
          </div>

          {showActions && (
            <div className="flex items-center space-x-2">
              {activeTab === 'leads' && (
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <LayoutList className="w-4 h-4 mr-2" />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'kanban'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Kanban
                  </button>
                </div>
              )}

              {activeTab === 'leads' && (
                <>
                  <button
                    onClick={() => router.push('/admin/leads/create')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Lead
                  </button>
                  <button
                    onClick={handleBulkConvertToOpportunity}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Convert Selected to Opportunities
                  </button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportExcel}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 ${activeTab === 'opportunities' ? 'hidden' : ''}`}
              >
                <Upload className="w-4 h-4 mr-2" />
                {importing ? 'Importing...' : 'Import'}
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Leads Display - List or Kanban View */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'leads' && (
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === leads.length && leads.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'opportunities' ? 'Opportunity Information' : 'Lead Information'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead: Lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activeTab === 'leads' && (
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(Number(lead.id))}
                          onChange={(e) => handleSelectLead(Number(lead.id), e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {lead.fname} {lead.mname} {lead.lname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.nationality} • {lead.gender} • {lead.dob}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityColor(lead.lead_quality || 'Unknown')}`}>
                            {lead.lead_quality || 'No Quality'}
                          </span>
                        </div>
                        {activeTab === 'opportunities' && (
                          <div className="text-xs text-green-700 mt-1">
                            Opportunity #{(lead as any).resolved_opportunity_id || (lead as any).opportunity_id || 'Created'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {lead.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {lead.phone}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {lead.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.country_interest}</div>
                      <div className="text-sm text-gray-500">{lead.service_interest}</div>
                      <div className="text-sm text-gray-500 mt-1">Source: {lead.market_source}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status || 'Unknown')}`}>
                          {lead.status || 'No Status'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                          {lead.priority} Priority
                        </span>
                        {lead.payBalance > 0 && (
                          <div className="flex items-center text-xs text-gray-500">
                            <DollarSign className="w-3 h-3 mr-1" />
                            Balance: ${lead.payBalance.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{lead.dmEmployeeByASSIGNTo?.name || 'Unassigned'}</div>
                      <div className="text-xs text-gray-400">{lead.dmBranch?.name}</div>
                      {lead.appointment && (
                        <div className="flex items-center text-xs text-blue-600 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(lead.appointment).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewLead(lead)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View lead"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openLeadActionModal(lead, 'appointment')}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Book appointment"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openLeadActionModal(lead, 'followup')}
                          className="text-amber-600 hover:text-amber-900"
                          title="Add follow-up"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openLeadActionModal(lead, 'remark')}
                          className="text-slate-600 hover:text-slate-900"
                          title="Add remark"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        {activeTab === 'leads' && lead.status !== 'New' && (
                          <button
                            onClick={() => handleConvertToOpportunity(Number(lead.id))}
                            className="text-green-600 hover:text-green-900"
                            title="Convert to Opportunity"
                          >
                            <Target className="w-4 h-4" />
                          </button>
                        )}
                        {(activeTab === 'opportunities' || isClientLead(lead)) && (
                          <button
                            onClick={() => handleOpenOperations(lead)}
                            className="text-purple-600 hover:text-purple-900"
                            title={activeTab === 'opportunities' ? 'Open Opportunity Operations' : 'Open Operations'}
                          >
                            <Briefcase className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setCurrentLead(lead);
                            setFormData(lead);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination({...pagination, page: Math.max(1, pagination.page - 1)})}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({...pagination, page: Math.min(pagination.pages, pagination.page + 1)})}
                disabled={pagination.page === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setPagination({...pagination, page})}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.page === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LeadKanbanSimple
          leads={leads}
          onLeadSelect={handleViewLead}
          onConvertToOpportunity={handleConvertToOpportunity}
          onEditLead={(lead) => {
            setCurrentLead(lead);
            setFormData(lead);
            setShowEditModal(true);
          }}
          onDeleteLead={handleDeleteLead}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* View Lead Modal */}
      {showViewModal && currentLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {currentLead.fname} {currentLead.mname} {currentLead.lname}
                </h3>
                <p className="text-sm text-gray-500">Lead #{currentLead.id}</p>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setCurrentLead(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
                <p><span className="font-medium">Email:</span> {currentLead.email || 'N/A'}</p>
                <p><span className="font-medium">Phone:</span> {currentLead.phone || 'N/A'}</p>
                <p><span className="font-medium">Mobile:</span> {currentLead.mobile || 'N/A'}</p>
                <p><span className="font-medium">Address:</span> {currentLead.address || 'N/A'}</p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Interest</h4>
                <p><span className="font-medium">Country:</span> {currentLead.country_interest || 'N/A'}</p>
                <p><span className="font-medium">Service:</span> {currentLead.service_interest || 'N/A'}</p>
                <p><span className="font-medium">Source:</span> {currentLead.market_source || 'N/A'}</p>
                <p><span className="font-medium">Quality:</span> {currentLead.lead_quality || 'N/A'}</p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Status</h4>
                <p><span className="font-medium">Status:</span> {currentLead.status || 'N/A'}</p>
                <p><span className="font-medium">Priority:</span> {currentLead.priority || 'N/A'}</p>
                <p><span className="font-medium">Assigned:</span> {currentLead.dmEmployeeByASSIGNTo?.name || 'Unassigned'}</p>
                <p><span className="font-medium">Branch:</span> {currentLead.dmBranch?.name || 'N/A'}</p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Payment</h4>
                <p><span className="font-medium">Total:</span> {Number(currentLead.payTotal || 0).toLocaleString()}</p>
                <p><span className="font-medium">Paid:</span> {Number(currentLead.paidYet || 0).toLocaleString()}</p>
                <p><span className="font-medium">Balance:</span> {Number(currentLead.payBalance || 0).toLocaleString()}</p>
                <p><span className="font-medium">Appointment:</span> {currentLead.appointment ? new Date(currentLead.appointment).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            {currentLead.lead_remark && (
              <div className="mt-4 rounded-lg border border-gray-200 p-4 text-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Lead Remark</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{currentLead.lead_remark}</p>
              </div>
            )}

            <div className="mt-4 rounded-lg border border-gray-200 p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Appointments, Follow-ups & Remarks</h4>
                  <p className="text-xs text-gray-500">Loaded from appointment, follow-up, and lead remarks tables.</p>
                </div>
                <button
                  onClick={() => fetchLeadActivity(Number(currentLead.id))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Refresh
                </button>
              </div>

              {leadActivityLoading ? (
                <div className="py-6 text-center text-sm text-gray-500">Loading lead activity...</div>
              ) : leadActivityError ? (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{leadActivityError}</div>
              ) : (
                <>
                  <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                    <div className="rounded-lg bg-indigo-50 p-3">
                      <div className="text-xs text-indigo-700">Fixed Appointments</div>
                      <div className="text-lg font-semibold text-indigo-900">{leadActivity?.summary.fixedAppointments || 0}</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3">
                      <div className="text-xs text-green-700">Completed</div>
                      <div className="text-lg font-semibold text-green-900">{leadActivity?.summary.completedAppointments || 0}</div>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-3">
                      <div className="text-xs text-amber-700">Follow-ups</div>
                      <div className="text-lg font-semibold text-amber-900">{leadActivity?.summary.followUps || 0}</div>
                    </div>
                    <div className="rounded-lg bg-orange-50 p-3">
                      <div className="text-xs text-orange-700">Pending Follow-ups</div>
                      <div className="text-lg font-semibold text-orange-900">{leadActivity?.summary.pendingFollowUps || 0}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="text-xs text-slate-700">Remarks</div>
                      <div className="text-lg font-semibold text-slate-900">{leadActivity?.summary.remarks || 0}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900">Appointments</div>
                      <div className="max-h-64 overflow-y-auto">
                        {(leadActivity?.appointments || []).length === 0 ? (
                          <div className="p-3 text-sm text-gray-500">No appointments found.</div>
                        ) : leadActivity?.appointments.map((appointment) => (
                          <div key={appointment.id} className="border-b border-gray-100 p-3 last:border-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-medium text-gray-900">{formatDate(appointment.date)} at {formatTime(appointment.appointtime)}</div>
                              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">{getAppointmentLabel(appointment)}</span>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">{appointment.counselorName || 'No counselor'}{appointment.branchName ? ` · ${appointment.branchName}` : ''}</div>
                            {appointment.screenshot && <div className="mt-2 text-xs text-gray-700">{appointment.screenshot}</div>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900">Follow-ups</div>
                      <div className="max-h-64 overflow-y-auto">
                        {(leadActivity?.followUps || []).length === 0 ? (
                          <div className="p-3 text-sm text-gray-500">No follow-ups found.</div>
                        ) : leadActivity?.followUps.map((followUp) => (
                          <div key={followUp.id} className="border-b border-gray-100 p-3 last:border-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-medium text-gray-900">{formatDateTime(followUp.reminder_date)}</div>
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">{followUp.status || 'pending'}</span>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">{followUp.employeeName || 'No employee'} · {followUp.priority || 'medium'}</div>
                            <div className="mt-2 text-xs text-gray-700">{followUp.message || 'No message'}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-3 py-2 text-sm font-semibold text-gray-900">Remarks</div>
                      <div className="max-h-64 overflow-y-auto">
                        {(leadActivity?.remarks || []).length === 0 ? (
                          <div className="p-3 text-sm text-gray-500">No remarks found.</div>
                        ) : leadActivity?.remarks.map((remark) => (
                          <div key={remark.id} className="border-b border-gray-100 p-3 last:border-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-medium text-gray-900">{formatDate(remark.date)} {formatTime(remark.created)}</div>
                              <span className="text-xs text-gray-500">{remark.employeeName || 'Unknown'}</span>
                            </div>
                            <div className="mt-2 whitespace-pre-wrap text-xs text-gray-700">{remark.remark || 'No remark'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => openLeadActionModal(currentLead, 'appointment')}
                className="px-4 py-2 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50"
              >
                Book Appointment
              </button>
              <button
                onClick={() => openLeadActionModal(currentLead, 'followup')}
                className="px-4 py-2 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50"
              >
                Add Follow-up
              </button>
              <button
                onClick={() => openLeadActionModal(currentLead, 'remark')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Add Remark
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setFormData(currentLead);
                  setShowEditModal(true);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setCurrentLead(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Action Modal */}
      {showLeadActionModal && currentLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{getLeadActionTitle()}</h3>
                <p className="text-sm text-gray-500">
                  {currentLead.fname} {currentLead.lname} · Lead #{currentLead.id}
                </p>
              </div>
              <button
                onClick={closeLeadActionModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {leadActionType !== 'remark' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={leadActionForm.date}
                      onChange={(e) => setLeadActionForm({ ...leadActionForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={leadActionForm.time}
                      onChange={(e) => setLeadActionForm({ ...leadActionForm, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {leadActionType === 'appointment' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
                  <select
                    value={leadActionForm.meetingType}
                    onChange={(e) => setLeadActionForm({ ...leadActionForm, meetingType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="document_review">Document Review</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="visa_processing">Visa Processing</option>
                  </select>
                </div>
              )}

              {leadActionType !== 'remark' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Employee ID</label>
                    <input
                      type="number"
                      value={leadActionForm.employeeId}
                      onChange={(e) => setLeadActionForm({ ...leadActionForm, employeeId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Employee ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={leadActionForm.priority}
                      onChange={(e) => setLeadActionForm({ ...leadActionForm, priority: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              )}

              {leadActionType !== 'remark' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {leadActionType === 'appointment' ? 'Appointment Title' : 'Follow-up Subject'}
                  </label>
                  <input
                    type="text"
                    value={leadActionForm.title}
                    onChange={(e) => setLeadActionForm({ ...leadActionForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={leadActionType === 'appointment' ? 'Appointment title' : 'Follow-up subject'}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {leadActionType === 'remark' ? 'Remark' : 'Notes'}
                </label>
                <textarea
                  value={leadActionForm.notes}
                  onChange={(e) => setLeadActionForm({ ...leadActionForm, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={leadActionType === 'remark' ? 'Enter lead remark...' : 'Enter notes...'}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeLeadActionModal}
                disabled={leadActionSaving}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLeadActionSubmit}
                disabled={leadActionSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {leadActionSaving ? 'Saving...' : getLeadActionTitle()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Lead</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.fname || ''}
                onChange={(e) => setFormData({...formData, fname: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lname || ''}
                onChange={(e) => setFormData({...formData, lname: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.country_interest || ''}
                onChange={(e) => setFormData({...formData, country_interest: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Country</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="UK">UK</option>
                <option value="USA">USA</option>
              </select>
              <select
                value={formData.service_interest || ''}
                onChange={(e) => setFormData({...formData, service_interest: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Service</option>
                <option value="Immigration">Immigration</option>
                <option value="Student Visa">Student Visa</option>
                <option value="Work Permit">Work Permit</option>
              </select>
              <select
                value={formData.priority || ''}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={formData.lead_quality || ''}
                onChange={(e) => setFormData({...formData, lead_quality: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Quality</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {showEditModal && currentLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Lead</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentLead(null);
                  setFormData({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.fname || ''}
                onChange={(e) => setFormData({...formData, fname: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lname || ''}
                onChange={(e) => setFormData({...formData, lname: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.country_interest || ''}
                onChange={(e) => setFormData({...formData, country_interest: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Country</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="UK">UK</option>
                <option value="USA">USA</option>
              </select>
              <select
                value={formData.service_interest || ''}
                onChange={(e) => setFormData({...formData, service_interest: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Service</option>
                <option value="Immigration">Immigration</option>
                <option value="Student Visa">Student Visa</option>
                <option value="Work Permit">Work Permit</option>
              </select>
              <select
                value={formData.status || ''}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="Prospect">Prospect/Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="DNQ">DNQ</option>
                <option value="Not_answered">Not Answered</option>
                <option value="Could Not Connect">Could Not Connect/Wrong Number</option>
                <option value="Call Back">Call Back</option>
                <option value="Abroad Lead">Abroad Lead</option>
              </select>
              <select
                value={formData.priority || ''}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentLead(null);
                  setFormData({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateLead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
