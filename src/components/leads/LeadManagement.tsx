'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Plus, Edit, Trash2, Download, Upload, Users,
  Filter, Calendar, Phone, Mail, MapPin, DollarSign,
  Eye, CheckCircle, XCircle, Clock,
  Target, X, Save, LayoutList, LayoutGrid, Briefcase, MessageSquare, Settings,
  Receipt, AlertCircle, Printer, Loader2
} from 'lucide-react';
import LeadKanbanSimple from './LeadKanbanSimple';
import { Lead } from '@/types/lead';
import { useAuth } from '@/contexts/AuthContext';

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

interface FilterOption {
  value: string;
  label: string;
  region?: string;
}

interface LeadFilterOptions {
  statuses: FilterOption[];
  priorities: FilterOption[];
  branches: FilterOption[];
  regions: FilterOption[];
  countries: FilterOption[];
  services: FilterOption[];
  sources: FilterOption[];
  leadQualities: FilterOption[];
}

type LeadActionType = 'appointment' | 'followup' | 'remark';

interface QuickPayLeadState {
  lead: Lead;
  amount: string;
  method: string;
  date: string;
  txnId: string;
  saving: boolean;
  msg: string;
  success: boolean;
  receipt: any;
}

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

function getSelectableLeadId(lead: Pick<Lead, 'id'>): number | null {
  const id = Number(lead.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export default function LeadManagement({ onLeadSelect, onConvertToOpportunity, showActions = true }: LeadManagementProps) {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
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
  const [filterOptions, setFilterOptions] = useState<LeadFilterOptions>({
    statuses: [],
    priorities: [],
    branches: [],
    regions: [],
    countries: [],
    services: [],
    sources: [],
    leadQualities: []
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
  const [activeTab, setActiveTab] = useState<'leads' | 'opportunities' | 'clients'>('leads');
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

  const [quickPayLead, setQuickPayLead] = useState<QuickPayLeadState | null>(null);

  // ── Assignment modal state ──
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignLead, setAssignLead] = useState<Lead | null>(null);
  const [assignCounselors, setAssignCounselors] = useState<Array<{ id: number; name: string; branch: number | null; role: number | null }>>([]);
  const [assignSearch, setAssignSearch] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSaving, setAssignSaving] = useState(false);

  const { user } = useAuth();
  const isDSorBM = useMemo(() => {
    const t = String(user?.type || '').toLowerCase().replace(/[\s-]+/g, '_');
    return ['director_of_sales', 'director', 'dos', 'branch_manager', 'bm', 'admin', 'administrator', 'super_admin'].includes(t) || user?.role === 1;
  }, [user]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filteredBranchOptions = useMemo(() => {
    if (!filters.region) return filterOptions.branches;
    return filterOptions.branches.filter((branch) => !branch.region || branch.region === filters.region);
  }, [filterOptions.branches, filters.region]);
  const selectableLeadIds = useMemo(
    () => leads.map(getSelectableLeadId).filter((id): id is number => id !== null),
    [leads]
  );

  // Build a lookup map from dm_source id → name using the already-loaded filter options
  const sourceNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    filterOptions.sources.forEach((s) => { map[s.value] = s.label; });
    return map;
  }, [filterOptions.sources]);

  const resolveSourceName = (lead: Lead) => {
    const raw = lead.market_source;
    if (!raw) return '';
    return sourceNameMap[raw] || (lead as any).market_source_label || raw;
  };

  const PIPELINE_STAGES = [
    { id: 'new_lead', label: 'New Lead', short: 'Lead' },
    { id: 'with_counselor', label: 'With Counselor', short: 'Counselor' },
    { id: 'prospect', label: 'Prospect', short: 'Prospect' },
    { id: 'quotation', label: 'Quotation', short: 'Quote' },
    { id: 'payment', label: 'Payment', short: 'Payment' },
    { id: 'accounts', label: 'Accounts Verified', short: 'Accounts' },
    { id: 'documents', label: 'Documents', short: 'Docs' },
    { id: 'agreement', label: 'Agreement', short: 'Agree' },
    { id: 'signed', label: 'Signed Agreement', short: 'Signed' },
    { id: 'compliance', label: 'Compliance', short: 'Compliance' },
    { id: 'client_active', label: 'Client Active', short: 'Client' },
  ];

  const getPipelineStage = (lead: any): { label: string; color: string; stepIndex: number } => {
    const hasOpp = !!(lead.resolved_opportunity_id || lead.opportunity_id);
    const workflowStatus = String(lead.workflow_status || '').toLowerCase();
    const financeOk = lead.finance_status === 'approved';
    const complianceOk = lead.compliance_status === 'approved';
    const hasClient = !!lead.formal_client_id;
    const paymentDone = !!lead.paymentReceived;
    const agreementSigned = !!lead.agreementSigned;
    const oppStage = String(lead.opp_stage || '').toLowerCase();
    const oppStatus = String(lead.opp_status || '').toLowerCase();
    const stepComplete = Number(lead.stepComplete || 0);

    if (hasClient) return { label: 'Client Active', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', stepIndex: 10 };
    if (complianceOk) return { label: 'Compliance Verified', color: 'bg-teal-100 text-teal-800 border-teal-200', stepIndex: 9 };
    if (agreementSigned || oppStage === 'signed-agreement') return { label: 'Signed Agreement', color: 'bg-pink-100 text-pink-800 border-pink-200', stepIndex: 8 };
    if (oppStage === 'agreement') return { label: 'Agreement', color: 'bg-violet-100 text-violet-800 border-violet-200', stepIndex: 7 };
    if (oppStage === 'documents') return { label: 'Documents', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', stepIndex: 6 };
    if (oppStage === 'accounts') return { label: 'Accounts Verified', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', stepIndex: 5 };
    if (oppStage === 'payment' || paymentDone) return { label: 'Payment Done', color: 'bg-purple-100 text-purple-800 border-purple-200', stepIndex: 4 };
    if (oppStage === 'quotation') return { label: 'Quotation', color: 'bg-amber-100 text-amber-800 border-amber-200', stepIndex: 3 };
    if (oppStage === 'prospect' || (hasOpp && workflowStatus === 'opportunity_created')) return { label: 'Prospect', color: 'bg-orange-100 text-orange-800 border-orange-200', stepIndex: 2 };
    if (hasOpp) return { label: 'Opportunity Created', color: 'bg-orange-100 text-orange-800 border-orange-200', stepIndex: 2 };
    if (lead.assignTo || stepComplete >= 1) return { label: 'With Counselor', color: 'bg-sky-100 text-sky-800 border-sky-200', stepIndex: 1 };
    return { label: 'New Lead', color: 'bg-gray-100 text-gray-800 border-gray-200', stepIndex: 0 };
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchTerm.length >= 3 || searchTerm.length === 0) {
        setDebouncedSearchTerm(searchTerm);
        setPagination((current) => current.page === 1 ? current : { ...current, page: 1 });
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  // API functions
  const fetchLeads = async (forceKanban?: boolean) => {
    if (authLoading) return;
    try {
      setLoading(true);
      setLoadError('');
      const isKanban = forceKanban ?? viewMode === 'kanban';
      const params = new URLSearchParams({
        page: isKanban ? '1' : pagination.page.toString(),
        limit: isKanban ? '500' : pagination.limit.toString(),
        search: debouncedSearchTerm,
        opportunityView: activeTab,
        kanban: isKanban && activeTab === 'leads' ? 'true' : 'false',

        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, {} as Record<string, string>)
      });

      const response = await fetch(`/api/leads?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
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
        setLeads([]);
        setPagination((current) => ({ ...current, total: 0, pages: 0 }));
        setLoadError(data.error || 'Unable to load leads. Please sign in again and retry.');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLoadError('Unable to load leads. Please check your connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [pagination.page, debouncedSearchTerm, filters, activeTab, viewMode, token, authLoading]);

  useEffect(() => {
    setSelectedLeads((current) => current.filter((id) => selectableLeadIds.includes(id)));
  }, [selectableLeadIds]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/lead-filter-options');
        if (!response.ok) throw new Error('Failed to fetch lead filter options');
        const data = await response.json();
        setFilterOptions({
          statuses: data.statuses || [],
          priorities: data.priorities || [],
          branches: data.branches || [],
          regions: data.regions || [],
          countries: data.countries || [],
          services: data.services || [],
          sources: data.sources || [],
          leadQualities: data.leadQualities || []
        });
      } catch (error) {
        console.error('Error fetching lead filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleTabChange = (tab: 'leads' | 'opportunities' | 'clients') => {
    setActiveTab(tab);
    setSelectedLeads([]);
    setViewMode('list');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const validateLeadForm = (data: Partial<Lead>): string | null => {
    if (!data.fname?.trim() || !data.lname?.trim()) {
      return 'First Name and Last Name are required';
    }
    if (data.fname.trim().length < 2 || data.lname.trim().length < 2) {
      return 'First Name and Last Name must be at least 2 characters';
    }
    if (!data.email && !data.phone) {
      return 'Either Email or Phone is required';
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      return 'Please enter a valid email address';
    }
    if (data.phone && data.phone.replace(/\s/g, '').length < 7) {
      return 'Phone number must be at least 7 digits';
    }
    return null;
  };

  const checkDuplicateLead = async (email?: string, mobile?: string): Promise<string | null> => {
    const checks: Promise<boolean>[] = [];
    if (email?.trim()) {
      checks.push(
        fetch(`/api/leads?search=${encodeURIComponent(email.trim())}&limit=1`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
          .then(r => r.json())
          .then(d => Number(d?.pagination?.total || 0) > 0)
          .catch(() => false)
      );
    }
    if (mobile?.trim()) {
      checks.push(
        fetch(`/api/leads?search=${encodeURIComponent(mobile.trim())}&limit=1`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
          .then(r => r.json())
          .then(d => Number(d?.pagination?.total || 0) > 0)
          .catch(() => false)
      );
    }
    if (checks.length === 0) return null;
    const results = await Promise.all(checks);
    if (results[0] && email?.trim()) return `A lead with email "${email.trim()}" already exists.`;
    if (results[1] && mobile?.trim()) return `A lead with mobile "${mobile.trim()}" already exists.`;
    if (results[0] && !email?.trim() && mobile?.trim()) return `A lead with mobile "${mobile.trim()}" already exists.`;
    return null;
  };

  const handleCreateLead = async () => {
    try {
      const error = validateLeadForm(formData);
      if (error) {
        alert(error);
        return;
      }

      const dupError = await checkDuplicateLead(formData.email, formData.mobile || formData.phone);
      if (dupError) {
        if (!confirm(`${dupError}\n\nDo you want to add this lead anyway?`)) return;
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
      const error = validateLeadForm(formData);
      if (error) {
        alert(error);
        return;
      }

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
    if (!currentLead.id || Number.isNaN(Number(currentLead.id))) {
      alert('Invalid lead ID');
      return;
    }

    const leadId = Number(currentLead.id);
    const employeeId = Number(leadActionForm.employeeId || currentLead.assignTo || currentLead.dmEmployeeByASSIGNTo?.id || 1);
    const timeWithSeconds = leadActionForm.time.length === 5 ? `${leadActionForm.time}:00` : leadActionForm.time;
    const scheduledAt = `${leadActionForm.date}T${timeWithSeconds}`;

    if (leadActionType !== 'remark' && (!leadActionForm.date || !leadActionForm.time)) {
      alert('Please select date and time');
      return;
    }

    if (leadActionType !== 'remark' && !leadActionForm.notes.trim()) {
      alert('Please enter notes');
      return;
    }

    if (leadActionType === 'remark' && !leadActionForm.notes.trim()) {
      alert('Please enter a remark');
      return;
    }

    if (leadActionType === 'appointment' && !leadActionForm.title.trim()) {
      alert('Please enter an appointment title');
      return;
    }

    if (leadActionType !== 'remark' && (!employeeId || employeeId < 1)) {
      alert('Please enter a valid employee ID');
      return;
    }

    if (leadActionType !== 'remark' && leadActionForm.date) {
      const today = new Date().toISOString().split('T')[0];
      if (leadActionForm.date < today) {
        alert('Date cannot be in the past');
        return;
      }
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

        const leadApptRes = await fetch(`/api/leads/${leadId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointment: `${leadActionForm.date} ${timeWithSeconds}`
          })
        });
        if (!leadApptRes.ok) {
          console.warn('Appointment created but lead update failed:', await leadApptRes.text());
        }
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

        const leadUpdateRes = await fetch(`/api/leads/${leadId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            followup: leadActionForm.date,
            folowuptime: timeWithSeconds,
            followupstat: 0
          })
        });
        if (!leadUpdateRes.ok) {
          console.warn('Follow-up created but lead update failed:', await leadUpdateRes.text());
        }
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

  const openAssignModal = async (lead: Lead) => {
    setAssignLead(lead);
    setShowAssignModal(true);
    setAssignSearch('');
    setAssignLoading(true);
    try {
      const params = new URLSearchParams({ status: '1', limit: '200' });
      const res = await fetch(`/api/employees?${params}`);
      if (!res.ok) throw new Error('Failed to load employees');
      const data = await res.json();
      const employees: Array<{ id: number; name: string; branch: number | null; role: number | null }> = data.employees || [];
      const userBranch = Number(user?.branch || 0);
      const userType = String(user?.type || '').toLowerCase().replace(/[\s-]+/g, '_');
      const isBranchManager = userType === 'branch_manager';
      const filtered = isBranchManager && userBranch
        ? employees.filter(e => e.branch === userBranch)
        : employees;
      setAssignCounselors(filtered);
    } catch (err) {
      console.error('Error loading counselors:', err);
      alert('Failed to load employees');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAssignLead = async (employeeId: number) => {
    if (!assignLead) return;
    setAssignSaving(true);
    try {
      const res = await fetch(`/api/leads/${assignLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignTo: employeeId, Counsilor: employeeId }),
      });
      if (!res.ok) throw new Error('Failed to assign lead');
      setLeads(prev => prev.map(l =>
        Number(l.id) === Number(assignLead.id) ? { ...l, assignTo: employeeId } : l
      ));
      setShowAssignModal(false);
      alert('Lead assigned successfully');
    } catch (err) {
      console.error('Error assigning lead:', err);
      alert('Failed to assign lead');
    } finally {
      setAssignSaving(false);
    }
  };

  const openQuickPayForLead = (lead: Lead) => {
    setQuickPayLead({
      lead,
      amount: String(Number(lead.payBalance) > 0 ? lead.payBalance : ''),
      method: 'cash',
      date: new Date().toISOString().split('T')[0],
      txnId: '',
      saving: false,
      msg: '',
      success: false,
      receipt: null,
    });
  };

  const printLeadReceipt = (receipt: any, lead: Lead, qp: QuickPayLeadState) => {
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>Payment Receipt</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,sans-serif;color:#222;font-size:11pt;padding:50px 60px 80px}
  .header{border-bottom:3px solid #35AE22;padding-bottom:14px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between}
  .brand{font-size:15pt;font-weight:700;color:#1C6B10}
  .sub{font-size:9pt;color:#666;margin-top:3px}
  .badge{background:#35AE22;color:#fff;padding:6px 16px;border-radius:4px;font-weight:700;font-size:10pt}
  table{width:100%;border-collapse:collapse;margin:16px 0}
  td{padding:9px 12px;font-size:10.5pt}
  tr:nth-child(even) td:first-child{background:#2D6A27;color:#fff;font-weight:600}
  tr:nth-child(odd)  td:first-child{background:#1C6B10;color:#fff;font-weight:600}
  tr:nth-child(even) td:last-child{background:#E8F7E4}
  tr:nth-child(odd)  td:last-child{background:#fff}
  .total-row td:first-child{background:#14500A!important;font-size:11.5pt}
  .total-row td:last-child{background:#D4F0D0!important;font-weight:700;font-size:12pt;color:#14500A}
  .footer{margin-top:30px;border-top:2px solid #35AE22;padding-top:10px;text-align:center;color:#666;font-size:9pt}
  @media print{@page{size:A4;margin:0}body{padding:40px 50px 60px}}
</style></head><body>
<div class="header">
  <div>
    <div class="brand">DM IMMIGRATION CONSULTANTS DMCC</div>
    <div class="sub">Dubai Branch · 3703, Latifa Tower, Sheikh Zayed Road, Dubai UAE</div>
    <div class="sub">Ph: +971 04 344 7757 · info@dm-consultant.com</div>
  </div>
  <div class="badge">OFFICIAL RECEIPT</div>
</div>
<div style="margin-bottom:18px;">
  <div style="font-size:10pt;color:#666;">Receipt No: <strong>${receipt.receiptNumber || receipt.paymentNumber || 'N/A'}</strong></div>
  <div style="font-size:10pt;color:#666;margin-top:4px;">Date: <strong>${qp.date ? new Date(qp.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')}</strong></div>
</div>
<table>
  <tr><td>Client Name</td><td>${lead.fname} ${lead.lname}</td></tr>
  <tr><td>Email</td><td>${lead.email || '—'}</td></tr>
  <tr><td>Payment Method</td><td>${qp.method.replace('_',' ').replace(/\\b\\w/g,(c)=>c.toUpperCase())}</td></tr>
  ${qp.txnId ? `<tr><td>Transaction ID</td><td>${qp.txnId}</td></tr>` : ''}
  <tr><td>Total Amount</td><td>AED ${Number(lead.payTotal || 0).toLocaleString()}</td></tr>
  <tr><td>Previously Paid</td><td>AED ${Number(lead.paidYet || 0).toLocaleString()}</td></tr>
  <tr><td>Amount Paid (This Receipt)</td><td>AED ${Number(qp.amount || 0).toLocaleString()}</td></tr>
  <tr class="total-row"><td>Remaining Balance</td><td>AED ${Math.max(0, Number(lead.payBalance || 0) - Number(qp.amount || 0)).toLocaleString()}</td></tr>
</table>
<p style="margin-top:16px;font-size:10pt;color:#444;">This receipt confirms payment received by DM Immigration Consultants DMCC. Please retain for your records.</p>
<div style="margin-top:40px;display:flex;justify-content:space-between;font-size:10pt;">
  <div>Client Signature: <span style="display:inline-block;width:160px;border-bottom:1px solid #222;"></span></div>
  <div>Authorised Signatory: <span style="display:inline-block;width:160px;border-bottom:1px solid #222;"></span></div>
</div>
<div class="footer">DM Immigration Consultants DMCC · Registered in Dubai · DMCC License · www.dm-consultant.com</div>
</body></html>`;
    const win = window.open('', '_blank', 'width=860,height=1100');
    if (!win) { alert('Allow pop-ups to view the receipt.'); return; }
    win.document.write(html);
    win.document.close();
    win.addEventListener('load', () => setTimeout(() => win.print(), 300));
    if (win.document.readyState === 'complete') setTimeout(() => win.print(), 500);
  };

  const submitQuickPayForLead = async () => {
    if (!quickPayLead) return;
    const amount = Number(quickPayLead.amount);
    if (!amount || amount <= 0) { setQuickPayLead(p => p ? { ...p, msg: 'Enter a valid amount.' } : null); return; }
    setQuickPayLead(p => p ? { ...p, saving: true, msg: '' } : null);
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: quickPayLead.lead.id,
          opportunityId: null,
          paymentData: {
            paymentStructure: 'installment',
            paymentMethod: quickPayLead.method,
            transactionId: quickPayLead.txnId || undefined,
            paymentDate: quickPayLead.date,
            paidAmount: amount,
            totalAmount: quickPayLead.lead.payTotal || amount,
            amount,
          },
          receiptData: {
            description: `Balance payment receipt for ${quickPayLead.lead.fname} ${quickPayLead.lead.lname}`,
            receiptType: 'payment',
            taxAmount: 0,
            discountAmount: 0,
            notes: '',
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create receipt');
      const receipt = json.data?.receipt || json.data || json;
      setQuickPayLead(p => p ? { ...p, saving: false, success: true, receipt, msg: `Receipt ${receipt.receiptNumber || ''} created!` } : null);
      fetchLeads();
    } catch (err: any) {
      setQuickPayLead(p => p ? { ...p, saving: false, msg: err.message || 'Failed to save payment' } : null);
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
        a.download = activeTab === 'clients' ? 'client-list-export.xlsx' : activeTab === 'opportunities' ? 'opportunity-draft-export.xlsx' : 'leads-export.xlsx';
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

    const validTypes = ['.xlsx', '.xls', '.csv'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(ext)) {
      alert('Please select a valid Excel file (.xlsx, .xls) or CSV file (.csv)');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      event.target.value = '';
      return;
    }

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
      setSelectedLeads(selectableLeadIds);
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id: number, checked: boolean) => {
    const numericId = Number.isInteger(id) && id > 0 ? id : null;
    if (numericId === null) return;

    if (checked) {
      setSelectedLeads((current) => current.includes(numericId) ? current : [...current, numericId]);
    } else {
      setSelectedLeads((current) => current.filter(leadId => leadId !== numericId));
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

  if (authLoading || (loading && leads.length === 0 && !debouncedSearchTerm)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loadError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{loadError}</span>
          <button onClick={() => fetchLeads()} className="font-medium underline">Retry</button>
        </div>
      )}
      <div className="bg-white rounded-lg shadow p-2">
        <div className="flex items-center gap-2 flex-wrap">
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
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Target className="w-4 h-4 mr-2" />
            Opportunity Draft
          </button>
          <button
            onClick={() => handleTabChange('clients')}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'clients'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Client List
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
              placeholder={activeTab === 'opportunities' ? 'Search opportunities (min 3 chars)...' : 'Search leads (min 3 chars)...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                Type {3 - searchTerm.length} more {3 - searchTerm.length === 1 ? 'char' : 'chars'}
              </span>
            )}
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            {filterOptions.statuses.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({...filters, priority: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Priority</option>
            {filterOptions.priorities.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.region}
            onChange={(e) => setFilters({...filters, region: e.target.value, branch: ''})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Regions</option>
            {filterOptions.regions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <select
            value={filters.branch}
            onChange={(e) => setFilters({...filters, branch: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Branches</option>
            {filteredBranchOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.countryInterest}
            onChange={(e) => setFilters({...filters, countryInterest: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Countries</option>
            {filterOptions.countries.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.serviceInterest}
            onChange={(e) => setFilters({...filters, serviceInterest: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Programs/Services</option>
            {filterOptions.services.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.marketSource}
            onChange={(e) => setFilters({...filters, marketSource: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Sources</option>
            {filterOptions.sources.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <select
            value={filters.leadQuality}
            onChange={(e) => setFilters({...filters, leadQuality: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Qualities</option>
            {filterOptions.leadQualities.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

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
              Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
              {activeTab === 'opportunities' ? 'opportunity drafts' : activeTab === 'clients' ? 'clients' : 'leads'}
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
              {activeTab === 'opportunities' && (
                <button
                  onClick={() => router.push('/admin/leads/create?mode=opportunity')}
                  className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Opportunity
                </button>
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
                className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 ${activeTab !== 'leads' ? 'hidden' : ''}`}
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
                        checked={selectableLeadIds.length > 0 && selectedLeads.length === selectableLeadIds.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'clients' ? 'Client Information' : activeTab === 'opportunities' ? 'Opportunity Draft' : 'Lead Information'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest / Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latest Remark
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pipeline Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {activeTab === 'clients' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance Due
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead: Lead, index) => {
                  const leadId = getSelectableLeadId(lead);

                  return (
                  <tr key={leadId ?? `${lead.email || 'lead'}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activeTab === 'leads' && (
                        <input
                          type="checkbox"
                          checked={leadId !== null && selectedLeads.includes(leadId)}
                          disabled={leadId === null}
                          onChange={(e) => leadId !== null && handleSelectLead(leadId, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <button
                          onClick={() => {
                            if (activeTab === 'leads') {
                              router.push(`/admin/leads/${lead.id}/edit`);
                            } else if (activeTab === 'opportunities') {
                              router.push(`/admin/leads/opportunity-flow?leadId=${lead.id}`);
                            } else {
                              handleOpenOperations(lead);
                            }
                          }}
                          className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline text-left"
                        >
                          {lead.fname} {lead.mname} {lead.lname}
                        </button>
                        <div className="text-sm text-gray-500">
                          {lead.nationality} • {lead.gender} • {lead.dob}
                        </div>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityColor(lead.lead_quality || 'Unknown')}`}>
                            {lead.lead_quality || 'No Quality'}
                          </span>
                        </div>
                        {(activeTab === 'opportunities' || activeTab === 'clients') && (
                          <div className="text-xs text-green-700 mt-1">
                            Opp #{(lead as any).resolved_opportunity_id || (lead as any).opportunity_id || '—'}
                          </div>
                        )}
                        {activeTab === 'clients' && (lead as any).agreementNumber && (
                          <div className="text-xs text-violet-700 mt-0.5 font-medium">
                            {(lead as any).agreementNumber}
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
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{(lead as any).country_interest_label || lead.country_interest || '—'}</div>
                      <div className="text-sm text-gray-600">{(lead as any).service_interest_label || lead.service_interest || '—'}</div>
                      {resolveSourceName(lead) ? (
                        <div className="text-xs text-indigo-600 mt-1">
                          Source: {resolveSourceName(lead)}
                        </div>
                      ) : null}
                      {lead.campaign ? (
                        <div className="text-xs text-purple-600 mt-0.5">
                          Campaign: {lead.campaign}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 max-w-[180px]">
                      {(lead.latest_remark || lead.lead_remark) ? (
                        <div
                          className="text-xs text-gray-700 line-clamp-3 leading-relaxed"
                          title={lead.latest_remark || lead.lead_remark}
                        >
                          {lead.latest_remark || lead.lead_remark}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No remarks</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const stage = getPipelineStage(lead);
                        const totalStages = PIPELINE_STAGES.length;
                        const progressPct = Math.round(((stage.stepIndex) / (totalStages - 1)) * 100);
                        return (
                          <div className="space-y-1.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stage.color}`}>
                              {stage.label}
                            </span>
                            <div className="relative w-full" title={`Stage ${stage.stepIndex + 1} of ${totalStages}: ${PIPELINE_STAGES[stage.stepIndex]?.label || stage.label}`}>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full transition-all ${
                                  stage.stepIndex >= 10 ? 'bg-emerald-500' :
                                  stage.stepIndex >= 9 ? 'bg-teal-500' :
                                  stage.stepIndex >= 7 ? 'bg-violet-500' :
                                  stage.stepIndex >= 5 ? 'bg-blue-500' :
                                  stage.stepIndex >= 3 ? 'bg-amber-500' :
                                  'bg-gray-400'
                                }`} style={{ width: `${progressPct}%` }} />
                              </div>
                              <span className="text-[10px] text-gray-400 mt-0.5">{stage.stepIndex + 1}/{totalStages}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status || 'Unknown')}`}>
                          {lead.status || 'No Status'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                          {lead.priority} Priority
                        </span>
                      </div>
                    </td>
                    {activeTab === 'clients' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Number(lead.payTotal) > 0 ? (
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">
                              Total: <span className="font-medium text-gray-800">AED {Number(lead.payTotal).toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Paid: <span className="font-medium text-green-700">AED {Number(lead.paidYet || 0).toLocaleString()}</span>
                            </div>
                            {Number(lead.payBalance) > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg bg-red-100 text-red-700 border border-red-200">
                                <AlertCircle className="w-3 h-3" />
                                AED {Number(lead.payBalance).toLocaleString()}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-lg bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3" />
                                Fully Paid
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {lead.dmEmployeeByASSIGNTo?.name || (
                          isDSorBM ? (
                            <button
                              onClick={() => openAssignModal(lead)}
                              className="text-red-600 hover:text-red-800 font-medium underline"
                              title="Click to assign lead"
                            >
                              Unassigned
                            </button>
                          ) : 'Unassigned'
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{lead.dmBranch?.name}</div>
                      {lead.appointment && (
                        <div className="flex items-center text-xs text-blue-600 mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(lead.appointment).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative flex items-center space-x-2 flex-wrap gap-y-1">
                        {activeTab === 'clients' && Number(lead.payBalance) > 0 && (
                          <button
                            onClick={() => openQuickPayForLead(lead)}
                            title={`Collect balance AED ${Number(lead.payBalance).toLocaleString()} & generate receipt`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            Receipt
                          </button>
                        )}
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
                        {activeTab === 'leads' && (
                          <button
                            onClick={() => handleConvertToOpportunity(Number(lead.id))}
                            className="text-green-600 hover:text-green-900"
                            title="Start Opportunity Flow"
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
                        {activeTab === 'opportunities' && (
                          <button
                            onClick={() => router.push(`/admin/leads/opportunity-flow?leadId=${lead.id}`)}
                            className="text-amber-600 hover:text-amber-900"
                            title="Edit opportunity flow"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/admin/leads/${lead.id}/edit`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit lead"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
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
          onEditLead={(lead) => router.push(`/admin/leads/${lead.id}/edit`)}
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
                <p><span className="font-medium">Country:</span> {currentLead.country_interest_label || currentLead.country_interest || 'N/A'}</p>
                <p><span className="font-medium">Service:</span> {currentLead.service_interest_label || currentLead.service_interest || 'N/A'}</p>
                <p><span className="font-medium">Source:</span> {resolveSourceName(currentLead) || 'N/A'}</p>
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
                onClick={() => router.push(`/admin/leads/${currentLead.id}/edit`)}
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
                {filterOptions.countries.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={formData.service_interest || ''}
                onChange={(e) => setFormData({...formData, service_interest: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Service / Program</option>
                {filterOptions.services.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
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
                {filterOptions.countries.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={formData.service_interest || ''}
                onChange={(e) => setFormData({...formData, service_interest: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Service / Program</option>
                {filterOptions.services.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
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

      {/* ── Quick Pay / Balance Receipt Modal (Client List) ── */}
      {quickPayLead && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Collect Balance Payment</h3>
                <p className="text-sm text-gray-500">{quickPayLead.lead.fname} {quickPayLead.lead.lname}</p>
              </div>
              <button onClick={() => setQuickPayLead(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500">Total Fee</div>
                  <div className="font-bold text-gray-800">AED {Number(quickPayLead.lead.payTotal || 0).toLocaleString()}</div>
                </div>
                <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-green-600">Paid So Far</div>
                  <div className="font-bold text-green-700">AED {Number(quickPayLead.lead.paidYet || 0).toLocaleString()}</div>
                </div>
                <div className="flex-1 bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-red-600">Balance Due</div>
                  <div className="font-bold text-red-700">AED {Number(quickPayLead.lead.payBalance || 0).toLocaleString()}</div>
                </div>
              </div>
              {!quickPayLead.success ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (AED)</label>
                    <input type="number" min="0" value={quickPayLead.amount}
                      onChange={e => setQuickPayLead(p => p ? { ...p, amount: e.target.value } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter amount" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select value={quickPayLead.method}
                      onChange={e => setQuickPayLead(p => p ? { ...p, method: e.target.value } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="cheque">Cheque</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                    <input type="date" value={quickPayLead.date}
                      onChange={e => setQuickPayLead(p => p ? { ...p, date: e.target.value } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID (optional)</label>
                    <input type="text" value={quickPayLead.txnId}
                      onChange={e => setQuickPayLead(p => p ? { ...p, txnId: e.target.value } : null)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Reference / transaction number" />
                  </div>
                  {quickPayLead.msg && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {quickPayLead.msg}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">{quickPayLead.msg}</p>
                  <p className="text-sm text-green-600 mt-1">Payment recorded and lead updated.</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 p-5 border-t">
              <button onClick={() => setQuickPayLead(null)}
                className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                {quickPayLead.success ? 'Close' : 'Cancel'}
              </button>
              {quickPayLead.success && quickPayLead.receipt ? (
                <button
                  onClick={() => printLeadReceipt(quickPayLead.receipt, quickPayLead.lead, quickPayLead)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                  <Printer className="w-4 h-4" /> Print Receipt
                </button>
              ) : (
                <button onClick={submitQuickPayForLead} disabled={quickPayLead.saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                  {quickPayLead.saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                  {quickPayLead.saving ? 'Processing…' : 'Save & Create Receipt'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Lead Modal ── */}
      {showAssignModal && assignLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Assign Lead</h2>
                <p className="text-sm text-gray-500">
                  {assignLead.fname} {assignLead.lname}
                  {assignLead.dmBranch?.name ? ` — ${assignLead.dmBranch.name}` : ''}
                </p>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lead details */}
            <div className="border-b px-6 py-3 bg-gray-50 grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">Email:</span> {assignLead.email || '—'}</div>
              <div><span className="text-gray-500">Phone:</span> {assignLead.phone || assignLead.mobile || '—'}</div>
              <div><span className="text-gray-500">Country:</span> {assignLead.country_interest_label || assignLead.country_interest || '—'}</div>
              <div><span className="text-gray-500">Service:</span> {assignLead.service_interest_label || assignLead.service_interest || '—'}</div>
              <div><span className="text-gray-500">Status:</span> {assignLead.status || '—'}</div>
              <div><span className="text-gray-500">Priority:</span> {assignLead.priority || '—'}</div>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search counselors..."
                  value={assignSearch}
                  onChange={e => setAssignSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Counselor list */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              {assignLoading ? (
                <div className="text-center py-8 text-gray-500">Loading employees...</div>
              ) : assignCounselors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No employees found</div>
              ) : (
                assignCounselors
                  .filter(e => !assignSearch || e.name.toLowerCase().includes(assignSearch.toLowerCase()))
                  .map(emp => (
                    <button
                      key={emp.id}
                      onClick={() => handleAssignLead(emp.id)}
                      disabled={assignSaving || Number(assignLead.assignTo) === emp.id}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 mb-1 flex items-center justify-between disabled:opacity-50"
                    >
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{emp.name}</div>
                        <div className="text-xs text-gray-500">ID: {emp.id}</div>
                      </div>
                      {Number(assignLead.assignTo) === emp.id ? (
                        <span className="text-xs text-green-600 font-medium">Current</span>
                      ) : (
                        <span className="text-xs text-blue-600 font-medium">Assign</span>
                      )}
                    </button>
                  ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-3 flex justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
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
