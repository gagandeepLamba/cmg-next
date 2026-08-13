'use client';

import { SearchableSelect } from '@/components/ui/searchable-select';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, X, Phone, Mail, MapPin, Calendar, DollarSign, Users, Target, Globe, Briefcase, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isFoeOrBranchManagerOrCeo } from '@/lib/roleChecks';
import { ALL_COUNTRIES } from '@/lib/countries';
import { calculateAgeFromDob } from '@/lib/utils';

interface LeadFormData {
  // Lead Information
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  
  // Address Information
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  // Personal Information
  genderIdentity: string;
  age: string;
  dateOfBirth: string;
  
  // Lead Details
  leadSource: string;
  utmSource: string;
  utmMedium: string;
  gclId: string;
  
  // Assignment
  leadOwner: string;
  assignedDate: string;
  autoAssign: boolean;
  reEnquiry: boolean;
  reEnquiryCounter: number;
  
  // Follow-up
  prospectFollowUp: string;
  callAttempt1: string;
  callBackAttempts: number;
  callAttemptsDeadline: string;
  
  // Additional Fields
  watnotBot: boolean;
  roundrobin: boolean;
  whatsapp: boolean;
  
  // System Fields
  status: string;
  priority: string;
  notes: string;
  
  // Chained Dropdown Fields
  programCountry: string;
  program: string;
  programType: string;
}

export default function AdminCreateLeadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpportunityMode = searchParams.get('mode') === 'opportunity';
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [duplicateInfo, setDuplicateInfo] = useState<{
    leadId: number;
    ownerId: number | null;
    ownerName: string | null;
    status: string;
  } | null>(null);
  const [transferReason, setTransferReason] = useState('');
  const [transferSubmitting, setTransferSubmitting] = useState(false);
  const [transferRequested, setTransferRequested] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    // Lead Information
    salutation: '',
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    
    // Address Information
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '--None--',
    
    // Personal Information
    genderIdentity: '',
    age: '',
    dateOfBirth: '',
    
    // Lead Details
    leadSource: '',
    utmSource: '',
    utmMedium: '',
    gclId: '',
    
    // Assignment
    leadOwner: '',
    assignedDate: '',
    // Off by default: a lead should only be auto-assigned via round-robin when
    // explicitly requested. If no counselor is picked and this stays unchecked,
    // the lead enters unassigned for a FOE/Branch Manager/CEO to assign later.
    autoAssign: false,
    reEnquiry: false,
    reEnquiryCounter: 0,
    
    // Follow-up
    prospectFollowUp: '',
    callAttempt1: '',
    callBackAttempts: 0,
    callAttemptsDeadline: '',
    
    // Additional Fields
    watnotBot: false,
    roundrobin: false,
    whatsapp: false,
    
    // System Fields
    status: 'New',
    priority: 'Medium',
    notes: '',
    
    // Chained Dropdown Fields
    programCountry: '',
    program: '',
    programType: ''
  });

  // State for dropdown options
  const [countries, setCountries] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [programTypes, setProgramTypes] = useState<any[]>([]);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [ownerBranchFilter, setOwnerBranchFilter] = useState('');
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Get logged-in user
  const { user } = useAuth();
  const isCeoUser = String((user as any)?.roleName || '').trim().toLowerCase() === 'ceo';
  // FOE and Branch Manager only ever add leads for their own branch's staff;
  // CEO can pick any branch via the selector below.
  const isBranchLockedRole = isFoeOrBranchManagerOrCeo(user as any) && !isCeoUser;
  // Plain counselors never see or choose the Counselor field — a new lead
  // they add is always assigned to themselves (enforced server-side too).
  const isPlainCounsellor = !isCeoUser && !isBranchLockedRole;
  const effectiveOwnerBranch = isBranchLockedRole ? String(user?.branch || '') : ownerBranchFilter;
  const leadOwnerOptions = effectiveOwnerBranch
    ? employees.filter((e) => String(e.branch || '') === effectiveOwnerBranch)
    : employees;

  // Fetch countries, lead sources, and employees on component mount
  useEffect(() => {
    fetchCountries();
    fetchLeadSources();
    fetchEmployees();
    fetchBranches();
  }, []);

  // Default the counselor to the logged-in user when they are themselves a
  // counselor. FOE/Branch Manager/CEO aren't counselors, so they must
  // explicitly pick one from the dropdown instead of defaulting to themselves.
  useEffect(() => {
    if (user && !formData.leadOwner && !isCeoUser && !isBranchLockedRole) {
      setFormData(prev => ({
        ...prev,
        leadOwner: user.id.toString(),
        assignedDate: new Date().toISOString().split('T')[0]
      }));
    } else if (user && !formData.assignedDate) {
      setFormData(prev => ({ ...prev, assignedDate: new Date().toISOString().split('T')[0] }));
    }
  }, [user, isCeoUser, isBranchLockedRole]);

  // Check the email/phone against existing leads as the person types (debounced),
  // instead of only finding out about the duplicate after they hit Save.
  useEffect(() => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const phoneDigits = formData.phone.replace(/\D/g, '');
    const phoneValid = phoneDigits.length >= 7;
    if (!emailValid && !phoneValid) return;

    const handle = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (emailValid) params.set('email', formData.email);
        if (phoneValid) params.set('phone', formData.phone);
        const res = await fetch(`/api/leads/check-duplicate?${params.toString()}`);
        if (!res.ok) return;
        const json = await res.json();
        if (json.duplicate) {
          setDuplicateInfo({
            leadId: json.duplicateLeadId,
            ownerId: json.duplicateLeadOwnerId ?? null,
            ownerName: json.duplicateLeadOwner ?? null,
            status: json.duplicateLeadStatus || 'New',
          });
        }
      } catch (error) {
        console.error('Error checking for duplicate lead:', error);
      }
    }, 600);

    return () => clearTimeout(handle);
  }, [formData.email, formData.phone]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/countries');
      if (response.ok) {
        const data = await response.json();
        setCountries(data);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  // Fetch programs when country changes
  useEffect(() => {
    if (formData.programCountry) {
      fetchPrograms(formData.programCountry);
    } else {
      setPrograms([]);
      setProgramTypes([]);
      setFormData(prev => ({ ...prev, program: '', programType: '' }));
    }
  }, [formData.programCountry]);

  // Fetch program types when program changes
  useEffect(() => {
    if (formData.programCountry && formData.program) {
      fetchProgramTypes(formData.programCountry, formData.program);
    } else {
      setProgramTypes([]);
      setFormData(prev => ({ ...prev, programType: '' }));
    }
  }, [formData.programCountry, formData.program]);

  const fetchPrograms = async (countryId: string) => {
    setLoadingPrograms(true);
    try {
      const response = await fetch(`/api/country-programs?countryId=${countryId}`);
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoadingPrograms(false);
    }
  };

  const fetchLeadSources = async () => {
    try {
      const response = await fetch('/api/lead-sources');
      if (response.ok) {
        const data = await response.json();
        setLeadSources([{ id: '', name: '--None--' }, ...data]);
      }
    } catch (error) {
      console.error('Error fetching lead sources:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      // Only counselors can be a lead's owner from this form — CEO sees every
      // branch, FOE/Branch Manager are locked server-side to their own branch.
      const response = await fetch('/api/employees/active?role=counsellor');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches?limit=200&status=1');
      if (response.ok) {
        const data = await response.json();
        setBranches(data.branches || []);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchProgramTypes = async (countryId: string, programId: string) => {
    setLoadingTypes(true);
    try {
      const response = await fetch(`/api/program-types?countryId=${countryId}&programId=${programId}`);
      if (response.ok) {
        const data = await response.json();
        setProgramTypes(data);
      }
    } catch (error) {
      console.error('Error fetching program types:', error);
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (formErrors.length > 0) setFormErrors([]);
    // A stale "this lead already exists" panel from a previous email/phone
    // shouldn't linger once the person edits either field again.
    if ((name === 'email' || name === 'phone') && duplicateInfo) {
      setDuplicateInfo(null);
      setTransferRequested(false);
      setTransferReason('');
    }
    setFormData(prev => {
      const next = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };
      if (name === 'dateOfBirth') {
        next.age = calculateAgeFromDob(value);
      }
      // Prospect leads are prioritized P1-P4 instead of the Hot/Warm/Cold
      // scale, so switching status in/out of Prospect must re-pick a
      // priority that's actually valid for the now-active option list.
      if (name === 'status') {
        const wasProspect = prev.status === 'Prospect';
        const isProspect = value === 'Prospect';
        if (isProspect && !wasProspect) next.priority = 'P1';
        else if (!isProspect && wasProspect) next.priority = 'Medium';
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateLeadForm(formData);
    if (errors.length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFormErrors([]);
    setDuplicateInfo(null);
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // CEO isn't tied to one branch — the lead (and any agreement later
          // generated for it) must use whichever branch the CEO picked in the
          // selector above, not the CEO's own (empty) branch. Every other
          // role has no branch picker and always uses their own branch.
          branch: isCeoUser ? (ownerBranchFilter || user?.branch || 1) : (user?.branch || 1),
          autoAssign: formData.autoAssign,
          created_by_admin: true,
          admin_created: true,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const addedByLabel = `${user?.name || 'you'}${user?.roleName ? ` (${user.roleName})` : ''}`;
        if (isOpportunityMode && result?.id) {
          window.toast.success(`Lead added by ${addedByLabel}. Opening opportunity flow...`);
          router.push(`/admin/leads/opportunity-flow?leadId=${result.id}`);
        } else {
          window.toast.success(`Lead added by ${addedByLabel}`);
          // The Leads list keeps its status/tab filters (e.g. "New Leads") in
          // React state, not the URL, so a fresh push to '/admin/leads'
          // always landed back on the unfiltered default view. Going back
          // returns to the exact filtered page state the user came from.
          if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
          } else {
            router.push('/admin/leads');
          }
        }
      } else {
        const error = await response.json();
        if (response.status === 409 && error.duplicateLeadId) {
          setDuplicateInfo({
            leadId: error.duplicateLeadId,
            ownerId: error.duplicateLeadOwnerId ?? null,
            ownerName: error.duplicateLeadOwner ?? null,
            status: error.duplicateLeadStatus || 'New',
          });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const messages = Array.isArray(error.errors) ? error.errors.join('\n') : error.message || error.error || 'Unknown error';
          window.toast.error(`Error creating lead: ${messages}`);
        }
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      window.toast.error('Error creating lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTransfer = async () => {
    if (!duplicateInfo?.ownerId || !user) return;
    setTransferSubmitting(true);
    try {
      const res = await fetch('/api/lead-reassignments-working', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: duplicateInfo.leadId,
          fromEmployeeId: duplicateInfo.ownerId,
          toEmployeeId: user.id,
          reassignmentType: 'transfer',
          reason: transferReason.trim() || `${user.name || 'A counselor'} re-enquired on this lead and is requesting ownership.`,
          previousStatus: duplicateInfo.status,
          newStatus: duplicateInfo.status,
          createdBy: user.id,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.error || 'Failed to submit transfer request');
      setTransferRequested(true);
    } catch (err) {
      window.toast.error(err instanceof Error ? err.message : 'Failed to submit transfer request');
    } finally {
      setTransferSubmitting(false);
    }
  };

  const salutations = ['--None--', 'Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];
  const genderOptions = ['--None--', 'Male', 'Female', 'Other', 'Prefer not to say'];
  const staticCountries = ALL_COUNTRIES;
  const priorities = formData.status === 'Prospect' ? ['P1', 'P2', 'P3', 'P4'] : ['Hot', 'Warm', 'Cold'];
  const statuses = ['Untouched', 'New', 'Contacted', 'Qualified', 'Prospect', 'Converted', 'Closed'];

  return (
  
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Leads
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">New Lead</h1>
                <p className="text-gray-600 mt-1">
                  <span className="text-red-500">*</span> = Required Information
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {formErrors.length > 0 && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-semibold">Please correct the following before saving:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {formErrors.map((error) => <li key={error}>{error}</li>)}
              </ul>
            </div>
          )}
          {duplicateInfo && (
            <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">
                A lead with this email or phone already exists (Lead #{duplicateInfo.leadId})
                {duplicateInfo.ownerName ? `, currently owned by ${duplicateInfo.ownerName}.` : ', and is currently unassigned.'}
              </p>
              {duplicateInfo.ownerId ? (
                transferRequested ? (
                  <p className="mt-2 text-green-700">
                    Transfer request submitted — it&apos;s pending approval from a Branch Manager or CEO.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                      placeholder="Reason for requesting this lead (optional)"
                      rows={2}
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleRequestTransfer}
                      disabled={transferSubmitting}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                    >
                      {transferSubmitting ? 'Submitting...' : 'Request Transfer'}
                    </button>
                  </div>
                )
              ) : (
                <p className="mt-2">This lead is currently unassigned — contact your Branch Manager to have it assigned to you.</p>
              )}
            </div>
          )}
          {/* Lead Information Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Lead Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salutation</label>
                <SearchableSelect
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {salutations.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </SearchableSelect>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="First Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Middle Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Last Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Suffix</label>
                <input
                  type="text"
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleInputChange}
                  placeholder="Suffix"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Phone"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="WhatsApp Number"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Address</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                <textarea
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State/Province"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip/Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Zip/Postal Code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <SearchableSelect
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {staticCountries.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </SearchableSelect>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Identity
                </label>
                <SearchableSelect
                  name="genderIdentity"
                  value={formData.genderIdentity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {genderOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </SearchableSelect>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (auto-calculated)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled
                  placeholder="Set Date of Birth"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Lead Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Lead Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lead Source</label>
                <SearchableSelect
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {leadSources.map(source => (
                    <option key={source.id || source} value={source.id || source}>
                      {source.name || source}
                    </option>
                  ))}
                </SearchableSelect>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UTM Source</label>
                <input
                  type="text"
                  name="utmSource"
                  value={formData.utmSource}
                  onChange={handleInputChange}
                  placeholder="UTM Source"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UTM Medium</label>
                <input
                  type="text"
                  name="utmMedium"
                  value={formData.utmMedium}
                  onChange={handleInputChange}
                  placeholder="UTM Medium"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GCLID</label>
                <input
                  type="text"
                  name="gclId"
                  value={formData.gclId}
                  onChange={handleInputChange}
                  placeholder="GCLID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Program Selection Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Program Selection</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <SearchableSelect
                  name="programCountry"
                  value={formData.programCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select Country --</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </SearchableSelect>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program
                </label>
                <div className="relative">
                  <SearchableSelect
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    disabled={!formData.programCountry || loadingPrograms}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Select Program --</option>
                    {programs.map(program => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </SearchableSelect>
                  {loadingPrograms && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Type
                </label>
                <div className="relative">
                  <SearchableSelect
                    name="programType"
                    value={formData.programType}
                    onChange={handleInputChange}
                    disabled={!formData.program || loadingTypes}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Select Type --</option>
                    {programTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.type}
                      </option>
                    ))}
                  </SearchableSelect>
                  {loadingTypes && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Program Selection Info */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Globe className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Program Selection Guide</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>First select the destination country</li>
                    <li>Then choose an available program for that country</li>
                    <li>Finally select the specific program type</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Assignment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isCeoUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                  <SearchableSelect
                    value={ownerBranchFilter}
                    onChange={(e) => setOwnerBranchFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- All Branches --</option>
                    {branches.map((branch: any) => (
                      <option key={branch.id} value={String(branch.id)}>
                        {branch.branch}
                      </option>
                    ))}
                  </SearchableSelect>
                </div>
              )}

              {!isPlainCounsellor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Counselor</label>
                  <SearchableSelect
                    name="leadOwner"
                    value={formData.leadOwner}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Counselor</option>
                    {leadOwnerOptions.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </SearchableSelect>
                  {isBranchLockedRole && (
                    <p className="text-xs text-gray-500 mt-1">Showing counselors in your branch only.</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Date</label>
                <input
                  type="datetime-local"
                  name="assignedDate"
                  value={formData.assignedDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Re-Enquiry Counter</label>
                <input
                  type="number"
                  name="reEnquiryCounter"
                  value={formData.reEnquiryCounter}
                  onChange={handleInputChange}
                  placeholder="Re-Enquiry Counter"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="reEnquiry"
                    checked={formData.reEnquiry}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Re-Enquiry</span>
                </label>
              </div>
            </div>
          </div>

          {/* Follow-up Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Follow-up</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prospect Follow-Up</label>
                <input
                  type="datetime-local"
                  name="prospectFollowUp"
                  value={formData.prospectFollowUp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Attempt 1</label>
                <input
                  type="datetime-local"
                  name="callAttempt1"
                  value={formData.callAttempt1}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Back Attempts</label>
                <input
                  type="number"
                  name="callBackAttempts"
                  value={formData.callBackAttempts}
                  onChange={handleInputChange}
                  placeholder="Call Back Attempts"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Attempts Deadline</label>
                <input
                  type="datetime-local"
                  name="callAttemptsDeadline"
                  value={formData.callAttemptsDeadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Options Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Additional Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="watnotBot"
                  checked={formData.watnotBot}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Chat Lead / Bot Lead</span>
              </label>

              {!isPlainCounsellor && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="roundrobin"
                    checked={formData.roundrobin}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Roundrobin</span>
                </label>
              )}

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="whatsapp"
                  checked={formData.whatsapp}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Whatsapp</span>
              </label>
            </div>
          </div>

          {/* Status and Priority Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Status & Priority</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <SearchableSelect
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </SearchableSelect>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <SearchableSelect
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </SearchableSelect>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes about this lead..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4">
              {!isPlainCounsellor && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoAssign"
                    checked={formData.autoAssign}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Assign using active assignment rule</span>
                </label>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                Save & New
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>

  );
}

function validateLeadForm(data: LeadFormData): string[] {
  const errors: string[] = [];
  const validName = /^[\p{L}][\p{L}\s.'-]*$/u;
  const phoneDigits = (value: string) => value.replace(/\D/g, '');

  if (!validName.test(data.firstName.trim())) errors.push('Enter a valid first name.');
  if (!validName.test(data.lastName.trim())) errors.push('Enter a valid last name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.push('Enter a valid email address.');

  const phone = phoneDigits(data.phone);
  if (phone.length < 7 || phone.length > 15) errors.push('Enter a valid phone number with 7 to 15 digits.');

  if (data.whatsappNumber && (phoneDigits(data.whatsappNumber).length < 7 || phoneDigits(data.whatsappNumber).length > 15)) {
    errors.push('Enter a valid WhatsApp number with 7 to 15 digits.');
  }

  if (data.age && (!Number.isInteger(Number(data.age)) || Number(data.age) < 0 || Number(data.age) > 120)) {
    errors.push('Age must be a whole number between 0 and 120.');
  }

  if (data.dateOfBirth) {
    const dateOfBirth = new Date(`${data.dateOfBirth}T00:00:00`);
    if (Number.isNaN(dateOfBirth.getTime()) || dateOfBirth > new Date()) errors.push('Date of birth cannot be in the future.');
  }

  return errors;
}
