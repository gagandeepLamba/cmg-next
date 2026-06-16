'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, FileText, User, Building2, Globe, Calendar, DollarSign, ExternalLink, Eye, Receipt, FileCheck, Activity, ChevronDown, X } from 'lucide-react';

interface DmcForumLeadsContract {
  id: number;
  lead_id: number;
  contract: string;
  agreement_date: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  dmc_forum_lead?: {
    id: number;
    fname: string;
    lname: string;
    email: string;
    mobile: string;
    nationality: string;
    program_type: string;
    status: string;
    fee_agree_date: string;
    no_of_applicants: number;
    country_interest: string | number;
    service_interest: string | number;
    lead_type: string;
    region: number;
    branch: number;
    Counsilor: number;
    case_officer: number;
    escalation: string | null;
    agreeDate: Date | null;
    renDate: Date | null;
    created: Date;
  };
  dm_pay_histories?: DmPayHistory[];
  dm_3party_payments?: Dm3partyPayment[];
}

interface DmPayHistory {
  id: number;
  client_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: string;
  description: string;
}

interface Dm3partyPayment {
  id: number;
  client_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: string;
  description: string;
}

interface OperationModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
  programTypes: string[];
  description: string;
}

const operationModules: OperationModule[] = [
  {
    id: 'ops-business',
    name: 'Business Operations',
    icon: <FileText className="w-5 h-5" />,
    href: '/admin/ops-business',
    programTypes: ['Business', 'Business Immigration', 'Investment', 'Startup'],
    description: 'Business registration and immigration operations'
  },
  {
    id: 'ops-canada-business',
    name: 'Canada Business',
    icon: <Building2 className="w-5 h-5" />,
    href: '/admin/ops-business-canada',
    programTypes: ['Canada Business', 'Business Immigration'],
    description: 'Canadian business immigration operations'
  },
  {
    id: 'ops-canada-skill',
    name: 'Canada Skill Assessment',
    icon: <User className="w-5 h-5" />,
    href: '/admin/ops-skill-canada',
    programTypes: ['Canada Skilled', 'Skill Assessment', 'Points Test'],
    description: 'Canadian skilled migration assessment'
  },
  {
    id: 'ops-canada-startup',
    name: 'Canada Start-up Visa',
    icon: <Globe className="w-5 h-5" />,
    href: '/admin/ops-eip-canada',
    programTypes: ['Canada Startup', 'Startup Visa', 'Business Immigration'],
    description: 'Canada start-up visa program operations'
  },
  {
    id: 'ops-canada-ict',
    name: 'Canada ICT',
    icon: <Building2 className="w-5 h-5" />,
    href: '/admin/ops-ict-canada',
    programTypes: ['Canada ICT', 'Intra Company Transfer', 'Work Permit'],
    description: 'Canada Intra-Company Transfer operations'
  },
  {
    id: 'ops-resume-writing',
    name: 'Resume Writing',
    icon: <FileText className="w-5 h-5" />,
    href: '/admin/ops-resume-canada',
    programTypes: ['Resume Writing', 'Career Services', 'Employment'],
    description: 'Professional resume writing services'
  },
  {
    id: 'ops-europe-cases',
    name: 'Europe Cases',
    icon: <Globe className="w-5 h-5" />,
    href: '/admin/ops-europe-cases',
    programTypes: ['Europe', 'European Immigration', 'Schengen'],
    description: 'European immigration case management'
  },
  {
    id: 'ops-portugal-business',
    name: 'Portugal Business',
    icon: <Building2 className="w-5 h-5" />,
    href: '/admin/ops-portugal-business',
    programTypes: ['Portugal', 'Portugal Business', 'European Immigration'],
    description: 'Portugal business immigration operations'
  },
  {
    id: 'ops-uk-business',
    name: 'UK Business',
    icon: <Building2 className="w-5 h-5" />,
    href: '/admin/ops-business-uk',
    programTypes: ['UK Business', 'British Business', 'UK Immigration'],
    description: 'UK business immigration operations'
  },
  {
    id: 'ops-usa-business',
    name: 'USA Business',
    icon: <Building2 className="w-5 h-5" />,
    href: '/admin/ops-business-usa',
    programTypes: ['USA Business', 'US Business', 'American Immigration'],
    description: 'USA business immigration operations'
  },
  {
    id: 'ops-poland-business',
    name: 'Poland Business',
    icon: <Building2 className="w-5 h-5" />,
    href: '/admin/ops-business-poland',
    programTypes: ['Poland Business', 'Polish Immigration', 'European Immigration'],
    description: 'Poland business immigration operations'
  },
  {
    id: 'ops-skill-australia',
    name: 'Australia Skill Assessment',
    icon: <User className="w-5 h-5" />,
    href: '/admin/ops-skill-australia',
    programTypes: ['Australia Skilled', 'Australia Points Test'],
    description: 'Australian skilled migration assessment'
  },
  {
    id: 'ops-student-visa',
    name: 'Student Visa',
    icon: <User className="w-5 h-5" />,
    href: '/admin/ops-student-visa',
    programTypes: ['Student', 'Study Permit', 'Education'],
    description: 'Student visa application processing'
  },
  {
    id: 'ops-visit-visa',
    name: 'Visit Visa',
    icon: <Globe className="w-5 h-5" />,
    href: '/admin/ops-visit-visa',
    programTypes: ['Visit', 'Tourist', 'Travel'],
    description: 'Visit visa application processing'
  },
  {
    id: 'ops-work-operations',
    name: 'Work Operations',
    icon: <User className="w-5 h-5" />,
    href: '/admin/ops-work',
    programTypes: ['Work', 'Employment', 'Job'],
    description: 'Work permit and employment operations'
  },
  {
    id: 'ops-job-search',
    name: 'Job Search',
    icon: <User className="w-5 h-5" />,
    href: '/admin/ops-job-search',
    programTypes: ['Job Search', 'Employment', 'Career'],
    description: 'Job search assistance services'
  },
  {
    id: 'ops-conversations',
    name: 'Conversations',
    icon: <User className="w-5 h-5" />,
    href: '/admin/ops-conversations',
    programTypes: ['All'], // Available for all program types
    description: 'Client conversation management'
  },
  {
    id: 'ops-crm-entry',
    name: 'CRM Entry',
    icon: <FileText className="w-5 h-5" />,
    href: '/admin/ops-crm-entry',
    programTypes: ['All'], // Available for all program types
    description: 'CRM data entry and management'
  },
  {
    id: 'ops-cbi',
    name: 'CBI',
    icon: <Globe className="w-5 h-5" />,
    href: '/admin/ops-cbi',
    programTypes: ['CBI', 'Citizenship', 'Investment'],
    description: 'Citizenship by Investment programs'
  },
  {
    id: 'ops-leave-management',
    name: 'Leave Management',
    icon: <Calendar className="w-5 h-5" />,
    href: '/admin/ops-leave-list',
    programTypes: ['All'], // Available for all program types
    description: 'Staff leave management system'
  },
  {
    id: 'ops-operations-report',
    name: 'Operations Report',
    icon: <FileText className="w-5 h-5" />,
    href: '/admin/ops-report',
    programTypes: ['All'], // Available for all program types
    description: 'Generate operations reports'
  }
];

interface FilterOptions {
  agreementNumber: string;
  startDate: string;
  endDate: string;
  retentionDate: string;
  region: string;
  branch: string;
  counselor: string;
  caseOfficer: string;
  escalated: string;
  programInterested: string;
  programType: string;
  countryInterested: string;
  forRmsJs: string;
  sortByCase: string;
  nationality: string;
  onlineAcceptance: string;
  status: string;
  search: string;
}

export default function OperationsManagement() {
  const router = useRouter();
  const [contracts, setContracts] = useState<DmcForumLeadsContract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<DmcForumLeadsContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState<DmcForumLeadsContract | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOperationsModal, setShowOperationsModal] = useState(false);
  const [filteredOperations, setFilteredOperations] = useState<OperationModule[]>([]);
  const [hoveredAgreement, setHoveredAgreement] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('admin');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    agreementNumber: '',
    startDate: '2026-01-31',
    endDate: '2026-01-31',
    retentionDate: '',
    region: '',
    branch: '',
    counselor: '',
    caseOfficer: '',
    escalated: '',
    programInterested: '',
    programType: '',
    countryInterested: '',
    forRmsJs: '',
    sortByCase: '',
    nationality: '',
    onlineAcceptance: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    let mounted = true;
    const loadOperationsClients = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/operations/search');
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to load operations clients');
        }

        const liveContracts: DmcForumLeadsContract[] = result.data.map((row: any) => ({
          id: row.agreementId || row.opportunityId,
          lead_id: row.leadId,
          contract: row.agreementNumber || row.opportunityNumber,
          agreement_date: row.generatedDate || row.retentionDate || '',
          amount: Number(row.totalAmount || row.actualValue || row.estimatedValue || 0),
          currency: row.currency || 'AED',
          status: row.leadStatus || row.opportunityStatus || 'retained',
          created_at: row.generatedDate || row.retentionDate || '',
          updated_at: row.retentionDate || row.generatedDate || '',
          dmc_forum_lead: {
            id: row.leadId,
            fname: row.fname || '',
            lname: row.lname || '',
            email: row.email || '',
            mobile: row.mobile || row.phone || '',
            nationality: row.nationality || '',
            program_type: row.serviceType || row.serviceRequired || row.service_interest || '',
            status: row.leadStatus || '',
            fee_agree_date: row.generatedDate || '',
            no_of_applicants: 1,
            country_interest: row.country_interest || '',
            service_interest: row.service_interest || row.serviceType || '',
            lead_type: row.leadType || '',
            region: 0,
            branch: row.branch || 0,
            Counsilor: row.Counsilor || 0,
            case_officer: row.case_officer || 0,
            escalation: null,
            agreeDate: row.generatedDate ? new Date(row.generatedDate) : null,
            renDate: row.retentionDate ? new Date(row.retentionDate) : null,
            created: row.generatedDate ? new Date(row.generatedDate) : new Date()
          },
          dm_pay_histories: row.latestPaymentId ? [{
            id: row.latestPaymentId,
            client_id: row.leadId,
            amount: Number(row.paidAmount || row.totalAmount || 0),
            payment_date: row.retentionDate || '',
            payment_method: row.paymentNumber || row.receiptNumber || '',
            status: row.paymentStatus || '',
            description: 'Latest opportunity payment'
          }] : [],
          dm_3party_payments: []
        }));

        if (mounted) {
          setContracts(liveContracts);
          setFilteredContracts(liveContracts);
        }
      } catch (error) {
        console.error('Error loading live operations clients:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadOperationsClients();
    const databaseContracts: DmcForumLeadsContract[] = []
    if (contracts.length === 0) {
      setContracts([]);
      setFilteredContracts([]);
    }
    return () => {
      mounted = false;
    };
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = contracts;

    // Agreement Number filter
    if (filters.agreementNumber) {
      filtered = filtered.filter(contract => 
        contract.contract.toLowerCase().includes(filters.agreementNumber.toLowerCase())
      );
    }

    // Date range filters
    if (filters.startDate) {
      filtered = filtered.filter(contract => 
        new Date(contract.agreement_date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(contract => 
        new Date(contract.agreement_date) <= new Date(filters.endDate)
      );
    }

    // Retention Date filter
    if (filters.retentionDate && selectedContract?.dmc_forum_lead?.renDate) {
      filtered = filtered.filter(contract => 
        contract.dmc_forum_lead?.renDate && 
        new Date(contract.dmc_forum_lead.renDate).toDateString() === new Date(filters.retentionDate).toDateString()
      );
    }

    // Region filter
    if (filters.region) {
      filtered = filtered.filter(contract => 
        contract.dmc_forum_lead?.region.toString() === filters.region
      );
    }

    // Branch filter
    if (filters.branch) {
      filtered = filtered.filter(contract => 
        contract.dmc_forum_lead?.branch.toString() === filters.branch
      );
    }

    // Counselor filter
    if (filters.counselor) {
      filtered = filtered.filter(contract => 
        contract.dmc_forum_lead?.Counsilor.toString() === filters.counselor
      );
    }

    // Case Officer filter
    if (filters.caseOfficer) {
      filtered = filtered.filter(contract => 
        contract.dmc_forum_lead?.case_officer.toString() === filters.caseOfficer
      );
    }

    // Escalated filter
    if (filters.escalated) {
      filtered = filtered.filter(contract => 
        contract.dmc_forum_lead?.escalation === filters.escalated
      );
    }

    // Program Interested filter
    if (filters.programInterested) {
      filtered = filtered.filter(contract => 
        contract.dmc_forum_lead?.service_interest.toString() === filters.programInterested
      );
    }

    // Program Type filter
    if (filters.programType) {
      filtered = filtered.filter(contract => 
        contract.dmc_forum_lead?.program_type.toLowerCase().includes(filters.programType.toLowerCase())
      );
    }

    // Country Interested filter
    if (filters.countryInterested) {
      filtered = filtered.filter(contract => 
        contract.dmc_forum_lead?.country_interest.toString() === filters.countryInterested
      );
    }

    // Nationality filter
    if (filters.nationality) {
      filtered = filtered.filter(contract => 
        contract.dmc_forum_lead?.nationality.toLowerCase().includes(filters.nationality.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(contract => 
        contract.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // General search filter
    if (filters.search) {
      filtered = filtered.filter(contract =>
        contract.contract.toLowerCase().includes(filters.search.toLowerCase()) ||
        contract.dmc_forum_lead?.fname.toLowerCase().includes(filters.search.toLowerCase()) ||
        contract.dmc_forum_lead?.lname.toLowerCase().includes(filters.search.toLowerCase()) ||
        contract.dmc_forum_lead?.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredContracts(filtered);
  }, [filters, contracts]);

  const handleFilterChange = (filterName: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      agreementNumber: '',
      startDate: '2026-01-31',
      endDate: '2026-01-31',
      retentionDate: '',
      region: '',
      branch: '',
      counselor: '',
      caseOfficer: '',
      escalated: '',
      programInterested: '',
      programType: '',
      countryInterested: '',
      forRmsJs: '',
      sortByCase: '',
      nationality: '',
      onlineAcceptance: '',
      status: '',
      search: ''
    });
  };

  const handleSearch = (term: string) => {
    handleFilterChange('search', term);
  };

  // --- Exact PHP routing logic: ID arrays from operation_management.php / sales_operation_management.php ---
  const EIP_ARRAY        = [211, 213, 214, 215, 216, 218];
  const RESUME_ARRAY     = [250, 248, 251, 252];
  const LMIA_ARRAY       = [208, 212, 222, 223, 230, 231, 232, 238, 239, 240, 258, 284, 289, 290, 237];
  const POLAND_ARRAY     = [39, 280, 254, 278, 285, 298, 293, 288, 287, 286, 303, 315, 316, 317, 309, 294, 264, 279, 329];
  const STARTUP_ARRAY    = [202, 209];
  const ICT_ARRAY        = [226];
  const PORT_ARRAY       = [253];
  const CBI_ARRAY        = [277, 262, 227, 17, 18];
  const WORK_ARRAY       = [311, 206, 3];
  const JOB_SEARCH_ARRAY = [321, 322, 332, 333, 331, 327, 326, 341, 338, 339, 352, 349, 343, 344, 354, 334];
  const EUROPE_COUNTRY   = [5, 8, 18, 26, 27, 28, 32, 33, 34, 35];
  const EUROPE_SERVICE   = [3, 39, 146, 206, 241, 254, 264, 278, 280, 282, 285, 286, 287, 288, 293, 298, 300, 301, 303];

  const getOpsUrlForLead = (lead: DmcForumLeadsContract['dmc_forum_lead']): string => {
    if (!lead) return '/admin/ops-conversations';
    const type    = (lead.lead_type || '').trim();
    const country = Number(lead.country_interest);
    const service = Number(lead.service_interest);
    const leadId  = lead.id;
    const q       = `?lead=${leadId}`;

    // Visit Visa
    if (type === 'Visit') return `/admin/ops-visit-visa${q}`;

    // Student Visa
    if (type === 'Student') return `/admin/ops-student-visa${q}`;

    // Poland Visa (service-based, overrides type)
    if (POLAND_ARRAY.includes(service)) return `/admin/ops-visit-visa${q}`;

    // EIP Canada (Skill or Work + eip service)
    if ((type === 'Skill' || type === 'Work') && EIP_ARRAY.includes(service))
      return `/admin/ops-eip-canada${q}`;

    // Job Search (Skill or Work + job_search service)
    if ((type === 'Skill' || type === 'Work') && JOB_SEARCH_ARRAY.includes(service))
      return `/admin/ops-job-search${q}`;

    // Skill PIP Canada (service_interest == 237)
    if (type === 'Skill' && service === 237 && country === 2)
      return `/admin/ops-skill-canada-pip${q}`;

    // Skill Australia / Canada (not eip, not resume, not 237, not job_search)
    if (type === 'Skill' && !EIP_ARRAY.includes(service) && !RESUME_ARRAY.includes(service) &&
        !JOB_SEARCH_ARRAY.includes(service) && service !== 237) {
      if (country === 1 || country === 14) return `/admin/ops-skill-australia${q}`;
      if (country === 2)                   return `/admin/ops-skill-canada${q}`;
    }

    // Work + resume → Resume Canada
    if (type === 'Work' && RESUME_ARRAY.includes(service) && country === 2)
      return `/admin/ops-resume-canada${q}`;

    // Work + service 35 → Skill Canada
    if (type === 'Work' && service === 35 && country === 2)
      return `/admin/ops-skill-canada${q}`;

    // Work + service 346 → Skill Australia
    if (type === 'Work' && service === 346)
      return `/admin/ops-skill-australia${q}`;

    // Work + work_array (Canada/specific countries)
    if (type === 'Work' && !RESUME_ARRAY.includes(service) && WORK_ARRAY.includes(service) &&
        [2, 34, 62, 26].includes(country))
      return `/admin/ops-work${q}`;

    // Work + LMIA
    if (type === 'Work' && LMIA_ARRAY.includes(service))
      return `/admin/ops-work${q}`;

    // Work + UK/Europe countries (not Poland visa service)
    if (type === 'Work' && (country === 3 || country === 8) && service !== 279)
      return `/admin/ops-visit-visa${q}`;

    // Skill + country 26 (Europe)
    if (type === 'Skill' && country === 26)
      return `/admin/ops-visit-visa${q}`;

    // Business + startup
    if (type === 'Business' && STARTUP_ARRAY.includes(service))
      return `/admin/ops-business${q}`;

    // Business + Portugal
    if (type === 'Business' && PORT_ARRAY.includes(service))
      return `/admin/ops-portugal-business${q}`;

    // Business + ICT → ICT Canada
    if (type === 'Business' && ICT_ARRAY.includes(service))
      return `/admin/ops-ict-canada${q}`;

    // Business + CBI
    if (type === 'Business' && CBI_ARRAY.includes(service))
      return `/admin/ops-cbi${q}`;

    // Business by country
    if (type === 'Business') {
      if (country === 2) return `/admin/ops-business-canada${q}`;
      if (country === 3) return `/admin/ops-business-uk${q}`;
      if (country === 4) return `/admin/ops-business-usa${q}`;
      if (country === 5) return `/admin/ops-business-poland${q}`;
    }

    // Europe cases (country in europe + service in europe service list)
    if (EUROPE_COUNTRY.includes(country) && EUROPE_SERVICE.includes(service))
      return `/admin/ops-europe-cases${q}`;

    // fallback
    return `/admin/ops-conversations${q}`;
  };

  const handleAgreementClick = (contract: DmcForumLeadsContract) => {
    setSelectedContract(contract);
    setShowDetailsModal(true);
  };

  const handleOpsClick = (contract: DmcForumLeadsContract) => {
    const url = getOpsUrlForLead(contract.dmc_forum_lead);
    router.push(url);
  };

  const handleShowAgreement = (contract: DmcForumLeadsContract) => {
    // This would open the agreement document
    alert(`Opening agreement: ${contract.contract}`);
  };

  const handleShowLogs = () => {
    // This would show logs for super admin
    alert('Showing logs (Super Admin only)');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Operations Management</h1>
        <p className="text-gray-600">Search and manage operations by agreement numbers</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter size={20} />
            Filters
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
            >
              {showFilters ? <X size={16} /> : <Filter size={16} />}
              {showFilters ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
            >
              Clear All
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Agreement Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Number</label>
              <input
                type="text"
                placeholder="Enter agreement number"
                value={filters.agreementNumber}
                onChange={(e) => handleFilterChange('agreementNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Retention Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retention Date</label>
              <input
                type="date"
                value={filters.retentionDate}
                onChange={(e) => handleFilterChange('retentionDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Region</option>
                <option value="1">North America</option>
                <option value="2">Europe</option>
                <option value="3">Asia</option>
                <option value="4">Middle East</option>
                <option value="5">Africa</option>
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange('branch', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Branch</option>
                <option value="1">Head Office</option>
                <option value="2">Downtown Branch</option>
                <option value="3">Airport Branch</option>
                <option value="4">Suburban Branch</option>
              </select>
            </div>

            {/* Counselor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Counselor</label>
              <select
                value={filters.counselor}
                onChange={(e) => handleFilterChange('counselor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="1">John Smith</option>
                <option value="2">Sarah Johnson</option>
                <option value="3">Michael Davis</option>
                <option value="4">Emily Wilson</option>
              </select>
            </div>

            {/* Case Officer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case Officer</label>
              <select
                value={filters.caseOfficer}
                onChange={(e) => handleFilterChange('caseOfficer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
              </select>
            </div>

            {/* Escalated */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Escalated</label>
              <select
                value={filters.escalated}
                onChange={(e) => handleFilterChange('escalated', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Program Interested */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Interested</label>
              <select
                value={filters.programInterested}
                onChange={(e) => handleFilterChange('programInterested', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Program Interested</option>
                <option value="1">Business Immigration</option>
                <option value="2">Student Visa</option>
                <option value="3">Work Permit</option>
                <option value="4">Family Sponsorship</option>
                <option value="5">Citizenship</option>
              </select>
            </div>

            {/* Program Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
              <select
                value={filters.programType}
                onChange={(e) => handleFilterChange('programType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="Canada Business">Canada Business</option>
                <option value="Student">Student</option>
                <option value="UK Business">UK Business</option>
                <option value="Work Permit">Work Permit</option>
                <option value="Family Sponsorship">Family Sponsorship</option>
              </select>
            </div>

            {/* Country Interested */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country Interested</label>
              <select
                value={filters.countryInterested}
                onChange={(e) => handleFilterChange('countryInterested', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="1">Canada</option>
                <option value="2">UK</option>
                <option value="3">USA</option>
                <option value="4">Australia</option>
                <option value="5">Germany</option>
              </select>
            </div>

            {/* For RMS JS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">For RMS JS</label>
              <select
                value={filters.forRmsJs}
                onChange={(e) => handleFilterChange('forRmsJs', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Sort by case */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by case</label>
              <select
                value={filters.sortByCase}
                onChange={(e) => handleFilterChange('sortByCase', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount (High to Low)</option>
                <option value="amount-low">Amount (Low to High)</option>
              </select>
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <select
                value={filters.nationality}
                onChange={(e) => handleFilterChange('nationality', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="Pakistan">Pakistan</option>
                <option value="India">India</option>
                <option value="Philippines">Philippines</option>
              </select>
            </div>

            {/* Online Acceptance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Online Acceptance</label>
              <select
                value={filters.onlineAcceptance}
                onChange={(e) => handleFilterChange('onlineAcceptance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by agreement number, client name, or email..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileCheck className="text-green-600 mr-2" size={20} />
            <span className="text-gray-700 font-medium">
              Found {filteredContracts.length} agreements
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Total Amount: ${filteredContracts.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
            </div>
            <button
              onClick={() => userRole === 'super_admin' && handleShowLogs()}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                userRole === 'super_admin' 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
              disabled={userRole !== 'super_admin'}
              title={userRole === 'super_admin' ? 'View Logs' : 'Logs only available to Super Admin'}
            >
              <Activity size={18} />
              Logs
            </button>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agreement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Loading agreements...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No agreements found. Try adjusting your search.
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="relative"
                        onMouseEnter={() => setHoveredAgreement(contract.id)}
                        onMouseLeave={() => setHoveredAgreement(null)}
                      >
                        <button
                          onClick={() => handleAgreementClick(contract)}
                          className="text-blue-600 hover:text-blue-900 font-medium flex items-center"
                        >
                          {contract.contract}
                          <ExternalLink size={14} className="ml-1" />
                        </button>
                        {hoveredAgreement === contract.id && (
                          <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-2 mt-1 flex gap-2">
                            <button
                              onClick={() => handleOpsClick(contract)}
                              title={`Go to: ${getOpsUrlForLead(contract.dmc_forum_lead).split('?')[0]}`}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-1"
                            >
                              <FileText size={14} />
                              OPS
                            </button>
                            <button
                              onClick={() => handleShowAgreement(contract)}
                              className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 flex items-center gap-1"
                            >
                              <Eye size={14} />
                              View
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contract.dmc_forum_lead?.fname} {contract.dmc_forum_lead?.lname}
                      </div>
                      <div className="text-sm text-gray-500">{contract.dmc_forum_lead?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {contract.dmc_forum_lead?.lead_type || contract.dmc_forum_lead?.program_type || '—'}
                      </span>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {getOpsUrlForLead(contract.dmc_forum_lead).split('?')[0].replace('/admin/', '')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.currency} {contract.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contract.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpsClick(contract)}
                          title={`Go to: ${getOpsUrlForLead(contract.dmc_forum_lead).split('?')[0]}`}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <FileText size={16} />
                          OPS
                        </button>
                        <button
                          onClick={() => handleAgreementClick(contract)}
                          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                        >
                          <Eye size={16} />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Details Modal */}
      {showDetailsModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Client Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Client Information */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-2">
                    <div><strong>Name:</strong> {selectedContract.dmc_forum_lead?.fname} {selectedContract.dmc_forum_lead?.lname}</div>
                    <div><strong>Email:</strong> {selectedContract.dmc_forum_lead?.email}</div>
                    <div><strong>Mobile:</strong> {selectedContract.dmc_forum_lead?.mobile}</div>
                    <div><strong>Nationality:</strong> {selectedContract.dmc_forum_lead?.nationality}</div>
                    <div><strong>Program:</strong> {selectedContract.dmc_forum_lead?.program_type}</div>
                    <div><strong>Status:</strong> {selectedContract.dmc_forum_lead?.status}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Agreement Information</h3>
                  <div className="space-y-2">
                    <div><strong>Agreement:</strong> {selectedContract.contract}</div>
                    <div><strong>Amount:</strong> {selectedContract.currency} {selectedContract.amount.toLocaleString()}</div>
                    <div><strong>Status:</strong> {selectedContract.status}</div>
                    <div><strong>Agreement Date:</strong> {new Date(selectedContract.agreement_date).toLocaleDateString()}</div>
                    <div><strong>Created:</strong> {new Date(selectedContract.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Receipts Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
                
                {/* Regular Receipts */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Receipt size={18} />
                    Regular Receipts ({selectedContract.dm_pay_histories?.length || 0})
                  </h4>
                  {selectedContract.dm_pay_histories && selectedContract.dm_pay_histories.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <table className="min-w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedContract.dm_pay_histories.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-4 py-2 text-sm">{new Date(payment.payment_date).toLocaleDateString()}</td>
                              <td className="px-4 py-2 text-sm">${payment.amount.toLocaleString()}</td>
                              <td className="px-4 py-2 text-sm">{payment.payment_method}</td>
                              <td className="px-4 py-2 text-sm">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-sm">{payment.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No regular receipts found</p>
                  )}
                </div>

                {/* Extra Receipts */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <DollarSign size={18} />
                    Extra Receipts ({selectedContract.dm_3party_payments?.length || 0})
                  </h4>
                  {selectedContract.dm_3party_payments && selectedContract.dm_3party_payments.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <table className="min-w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedContract.dm_3party_payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-4 py-2 text-sm">{new Date(payment.payment_date).toLocaleDateString()}</td>
                              <td className="px-4 py-2 text-sm">${payment.amount.toLocaleString()}</td>
                              <td className="px-4 py-2 text-sm">{payment.payment_method}</td>
                              <td className="px-4 py-2 text-sm">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-sm">{payment.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No extra receipts found</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => handleShowAgreement(selectedContract)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <Eye size={18} />
                  View Agreement
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operations Modal */}
      {showOperationsModal && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Operations for {selectedContract.contract}</h2>
                  <p className="text-gray-600 mt-1">
                    {selectedContract.dmc_forum_lead?.fname} {selectedContract.dmc_forum_lead?.lname} - {selectedContract.dmc_forum_lead?.program_type}
                  </p>
                </div>
                <button
                  onClick={() => setShowOperationsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOperations.map((operation) => (
                  <div
                    key={operation.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      // Navigate to operation module
                      window.location.href = operation.href;
                    }}
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-3">
                        {operation.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{operation.name}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{operation.description}</p>
                    <div className="mt-3 text-xs text-blue-600 font-medium">
                      Click to open →
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowOperationsModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


