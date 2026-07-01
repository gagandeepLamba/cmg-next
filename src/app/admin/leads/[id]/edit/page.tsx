'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Mail, Phone } from 'lucide-react';

interface LeadFormData {
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  genderIdentity: string;
  age: string;
  dateOfBirth: string;
  leadSource: string;
  utmSource: string;
  utmMedium: string;
  gclId: string;
  leadOwner: string;
  assignedDate: string;
  reEnquiry: boolean;
  reEnquiryCounter: number;
  prospectFollowUp: string;
  callAttempt1: string;
  callBackAttempts: number;
  callAttemptsDeadline: string;
  watnotBot: boolean;
  roundrobin: boolean;
  whatsapp: boolean;
  status: string;
  priority: string;
  notes: string;
  leadQuality: string;
  programCountry: string;
  program: string;
  programType: string;
}

interface LeadApiData {
  fname?: string | null;
  mname?: string | null;
  lname?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  address?: string | null;
  area?: string | null;
  nationality?: string | null;
  gender?: string | null;
  dob?: string | null;
  market_source?: string | null;
  assignTo?: number | string | null;
  created?: string | null;
  followup?: string | null;
  status?: string | null;
  priority?: string | null;
  lead_remark?: string | null;
  lead_quality?: string | null;
  country_interest?: number | string | null;
  service_interest?: number | string | null;
}

interface SelectOption {
  id?: number | string;
  name?: string;
}

interface ProgramTypeOption {
  id: number | string;
  type: string;
}

const emptyForm: LeadFormData = {
  salutation: '',
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  email: '',
  phone: '',
  whatsappNumber: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  genderIdentity: '',
  age: '',
  dateOfBirth: '',
  leadSource: '',
  utmSource: '',
  utmMedium: '',
  gclId: '',
  leadOwner: '',
  assignedDate: '',
  reEnquiry: false,
  reEnquiryCounter: 0,
  prospectFollowUp: '',
  callAttempt1: '',
  callBackAttempts: 0,
  callAttemptsDeadline: '',
  watnotBot: false,
  roundrobin: false,
  whatsapp: false,
  status: 'New',
  priority: 'Medium',
  notes: '',
  leadQuality: 'Warm',
  programCountry: '',
  program: '',
  programType: ''
};

const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const sectionClass = 'bg-white rounded-lg shadow-md p-6';

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value).slice(0, 10) : date.toISOString().slice(0, 10);
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16);
};

const toFormData = (lead: LeadApiData): LeadFormData => ({
  ...emptyForm,
  firstName: lead.fname || '',
  middleName: lead.mname || '',
  lastName: lead.lname || '',
  email: lead.email || '',
  phone: lead.phone || '',
  whatsappNumber: lead.mobile || '',
  street: lead.address || '',
  city: lead.area || '',
  country: lead.nationality || '',
  genderIdentity: lead.gender || '',
  dateOfBirth: formatDate(lead.dob),
  leadSource: lead.market_source || '',
  leadOwner: lead.assignTo ? String(lead.assignTo) : '',
  assignedDate: formatDateTime(lead.created),
  prospectFollowUp: formatDateTime(lead.followup),
  status: lead.status || 'New',
  priority: lead.priority || 'Medium',
  notes: lead.lead_remark || '',
  leadQuality: lead.lead_quality || 'Warm',
  programCountry: lead.country_interest ? String(lead.country_interest) : '',
  program: lead.service_interest ? String(lead.service_interest) : '',
  programType: lead.service_interest ? String(lead.service_interest) : ''
});

export default function AdminEditLeadPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const leadId = params?.id;

  const [formData, setFormData] = useState<LeadFormData>(emptyForm);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [programs, setPrograms] = useState<SelectOption[]>([]);
  const [programTypes, setProgramTypes] = useState<ProgramTypeOption[]>([]);
  const [leadSources, setLeadSources] = useState<SelectOption[]>([]);
  const [employees, setEmployees] = useState<SelectOption[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!leadId) return;
      setPageLoading(true);
      setError('');

      try {
        const [leadRes, countriesRes, sourcesRes, employeesRes] = await Promise.all([
          fetch(`/api/leads/${leadId}`),
          fetch('/api/countries'),
          fetch('/api/lead-sources'),
          fetch('/api/employees/active')
        ]);

        if (!leadRes.ok) {
          const leadError = await leadRes.json().catch(() => ({}));
          throw new Error(leadError.error || 'Lead not found');
        }

        const lead = await leadRes.json();
        setFormData(toFormData(lead));

        if (countriesRes.ok) setCountries(await countriesRes.json());
        if (sourcesRes.ok) setLeadSources([{ id: '', name: '--None--' }, ...(await sourcesRes.json())]);
        if (employeesRes.ok) setEmployees(await employeesRes.json());
      } catch (loadError) {
        console.error('Error loading lead edit page:', loadError);
        setError(loadError instanceof Error ? loadError.message : 'Failed to load lead');
      } finally {
        setPageLoading(false);
      }
    };

    loadInitialData();
  }, [leadId]);

  useEffect(() => {
    if (!formData.programCountry) {
      setPrograms([]);
      setProgramTypes([]);
      return;
    }

    const fetchPrograms = async () => {
      setLoadingPrograms(true);
      try {
        const response = await fetch(`/api/country-programs?countryId=${formData.programCountry}`);
        setPrograms(response.ok ? await response.json() : []);
      } catch (programError) {
        console.error('Error fetching programs:', programError);
        setPrograms([]);
      } finally {
        setLoadingPrograms(false);
      }
    };

    fetchPrograms();
  }, [formData.programCountry]);

  useEffect(() => {
    if (!formData.programCountry || !formData.program) {
      setProgramTypes([]);
      return;
    }

    const fetchProgramTypes = async () => {
      setLoadingTypes(true);
      try {
        const response = await fetch(`/api/program-types?countryId=${formData.programCountry}&programId=${formData.program}`);
        setProgramTypes(response.ok ? await response.json() : []);
      } catch (typeError) {
        console.error('Error fetching program types:', typeError);
        setProgramTypes([]);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchProgramTypes();
  }, [formData.programCountry, formData.program]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value
    }));
  };

  const handleProgramCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      programCountry: event.target.value,
      program: '',
      programType: ''
    }));
  };

  const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      program: event.target.value,
      programType: ''
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!leadId) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          whatsappNumber: formData.whatsappNumber,
          street: formData.street,
          city: formData.city,
          country: formData.country,
          dateOfBirth: formData.dateOfBirth,
          genderIdentity: formData.genderIdentity,
          leadSource: formData.leadSource,
          leadOwner: formData.leadOwner,
          prospectFollowUp: formData.prospectFollowUp,
          status: formData.status,
          priority: formData.priority,
          notes: formData.notes,
          leadQuality: formData.leadQuality,
          programCountry: formData.programCountry,
          program: formData.program,
          programType: formData.programType || formData.program
        })
      });

      if (!response.ok) {
        const updateError = await response.json().catch(() => ({}));
        const message = Array.isArray(updateError.errors) ? updateError.errors.join('\n') : updateError.error || 'Error updating lead';
        throw new Error(message);
      }

      alert('Lead updated successfully!');
      router.push('/admin/leads');
    } catch (submitError) {
      console.error('Error updating lead:', submitError);
      alert(submitError instanceof Error ? submitError.message : 'Error updating lead. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const salutations = ['--None--', 'Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];
  const genderOptions = ['--None--', 'Male', 'Female', 'Other', 'Prefer not to say'];
  const staticCountries = ['--None--', 'United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'UAE', 'Germany', 'France', 'Singapore'];
  const priorities = ['Hot', 'Warm', 'Cold', 'High', 'Medium', 'Low'];
  const statuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Closed', 'Prospect', 'Not Interested', 'DNQ', 'Not_answered', 'Could Not Connect', 'Call Back', 'Abroad Lead'];
  const leadQualities = ['Hot', 'Warm', 'Cold'];

  if (pageLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-blue-600" />
        <span className="text-gray-700">Loading lead...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <button onClick={() => router.push('/admin/leads')} className="mb-6 flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Leads
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center space-x-4">
        <button onClick={() => router.push('/admin/leads')} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Leads
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Lead</h1>
          <p className="mt-1 text-gray-600">
            Lead #{leadId} <span className="text-red-500">*</span> = Required Information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className={sectionClass}>
          <h2 className="mb-6 border-b pb-3 text-xl font-semibold text-gray-900">Lead Information</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Field label="Salutation">
              <select name="salutation" value={formData.salutation} onChange={handleInputChange} className={inputClass}>
                {salutations.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </Field>
            <TextField name="firstName" label="First Name" value={formData.firstName} onChange={handleInputChange} required />
            <TextField name="middleName" label="Middle Name" value={formData.middleName} onChange={handleInputChange} />
            <TextField name="lastName" label="Last Name" value={formData.lastName} onChange={handleInputChange} required />
            <TextField name="suffix" label="Suffix" value={formData.suffix} onChange={handleInputChange} />
            <Field label="Email" required>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={`${inputClass} pl-10`} />
              </div>
            </Field>
            <Field label="Phone" required>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className={`${inputClass} pl-10`} />
              </div>
            </Field>
            <Field label="WhatsApp Number">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} className={`${inputClass} pl-10`} />
              </div>
            </Field>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="mb-6 border-b pb-3 text-xl font-semibold text-gray-900">Address</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Street" wide>
              <textarea name="street" value={formData.street} onChange={handleInputChange} rows={2} className={inputClass} />
            </Field>
            <TextField name="city" label="City" value={formData.city} onChange={handleInputChange} />
            <TextField name="state" label="State/Province" value={formData.state} onChange={handleInputChange} />
            <TextField name="postalCode" label="Zip/Postal Code" value={formData.postalCode} onChange={handleInputChange} />
            <Field label="Country">
              <select name="country" value={formData.country} onChange={handleInputChange} className={inputClass}>
                {staticCountries.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </Field>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="mb-6 border-b pb-3 text-xl font-semibold text-gray-900">Personal Information</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Field label="Gender Identity" required>
              <select name="genderIdentity" value={formData.genderIdentity} onChange={handleInputChange} required className={inputClass}>
                {genderOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </Field>
            <TextField name="age" label="Age" type="number" value={formData.age} onChange={handleInputChange} />
            <TextField name="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="mb-6 border-b pb-3 text-xl font-semibold text-gray-900">Lead Details</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Field label="Lead Source">
              <select name="leadSource" value={formData.leadSource} onChange={handleInputChange} className={inputClass}>
                {formData.leadSource && !leadSources.some((source) => String(source.id ?? source.name ?? '') === formData.leadSource) && (
                  <option value={formData.leadSource}>{formData.leadSource}</option>
                )}
                {leadSources.map((source) => (
                  <option key={source.id ?? source.name} value={source.id ?? source.name ?? ''}>
                    {source.name ?? source.id}
                  </option>
                ))}
              </select>
            </Field>
            <TextField name="utmSource" label="UTM Source" value={formData.utmSource} onChange={handleInputChange} />
            <TextField name="utmMedium" label="UTM Medium" value={formData.utmMedium} onChange={handleInputChange} />
            <TextField name="gclId" label="GCLID" value={formData.gclId} onChange={handleInputChange} />
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="mb-6 border-b pb-3 text-xl font-semibold text-gray-900">Program Selection</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label="Country" required>
              <select name="programCountry" value={formData.programCountry} onChange={handleProgramCountryChange} className={inputClass}>
                <option value="">-- Select Country --</option>
                {formData.programCountry && !countries.some((country) => String(country.id) === formData.programCountry) && (
                  <option value={formData.programCountry}>{formData.programCountry}</option>
                )}
                {countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}
              </select>
            </Field>
            <Field label="Program" required>
              <div className="relative">
                <select name="program" value={formData.program} onChange={handleProgramChange} disabled={!formData.programCountry || loadingPrograms} className={`${inputClass} disabled:bg-gray-100`}>
                  <option value="">-- Select Program --</option>
                  {formData.program && !programs.some((program) => String(program.id) === formData.program) && (
                    <option value={formData.program}>{formData.program}</option>
                  )}
                  {programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}
                </select>
                {loadingPrograms && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-500" />}
              </div>
            </Field>
            <Field label="Program Type" required>
              <div className="relative">
                <select name="programType" value={formData.programType} onChange={handleInputChange} disabled={!formData.program || loadingTypes} className={`${inputClass} disabled:bg-gray-100`}>
                  <option value="">-- Select Type --</option>
                  {formData.programType && !programTypes.some((type) => String(type.id) === formData.programType) && (
                    <option value={formData.programType}>{formData.programType}</option>
                  )}
                  {programTypes.map((type) => <option key={type.id} value={type.id}>{type.type}</option>)}
                </select>
                {loadingTypes && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-500" />}
              </div>
            </Field>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="mb-6 border-b pb-3 text-xl font-semibold text-gray-900">Assignment</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Field label="Lead Owner">
              <select name="leadOwner" value={formData.leadOwner} onChange={handleInputChange} className={inputClass}>
                <option value="">Select Lead Owner</option>
                {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
              </select>
            </Field>
            <TextField name="assignedDate" label="Assigned Date" type="datetime-local" value={formData.assignedDate} onChange={handleInputChange} />
            <TextField name="reEnquiryCounter" label="Re-Enquiry Counter" type="number" value={formData.reEnquiryCounter} onChange={handleInputChange} />
            <CheckboxField name="reEnquiry" label="Re-Enquiry" checked={formData.reEnquiry} onChange={handleInputChange} />
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="mb-6 border-b pb-3 text-xl font-semibold text-gray-900">Follow-up</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <TextField name="prospectFollowUp" label="Prospect Follow-Up" type="datetime-local" value={formData.prospectFollowUp} onChange={handleInputChange} />
            <TextField name="callAttempt1" label="Call Attempt 1" type="datetime-local" value={formData.callAttempt1} onChange={handleInputChange} />
            <TextField name="callBackAttempts" label="Call Back Attempts" type="number" value={formData.callBackAttempts} onChange={handleInputChange} />
            <TextField name="callAttemptsDeadline" label="Call Attempts Deadline" type="datetime-local" value={formData.callAttemptsDeadline} onChange={handleInputChange} />
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="mb-6 border-b pb-3 text-xl font-semibold text-gray-900">Additional Options</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <CheckboxField name="watnotBot" label="Chat Lead / Bot Lead" checked={formData.watnotBot} onChange={handleInputChange} />
            <CheckboxField name="roundrobin" label="Roundrobin" checked={formData.roundrobin} onChange={handleInputChange} />
            <CheckboxField name="whatsapp" label="Whatsapp" checked={formData.whatsapp} onChange={handleInputChange} />
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="mb-6 border-b pb-3 text-xl font-semibold text-gray-900">Status & Priority</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Field label="Status">
              <select name="status" value={formData.status} onChange={handleInputChange} className={inputClass}>
                {statuses.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Priority">
              <select name="priority" value={formData.priority} onChange={handleInputChange} className={inputClass}>
                {priorities.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Lead Quality">
              <select name="leadQuality" value={formData.leadQuality} onChange={handleInputChange} className={inputClass}>
                {leadQualities.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </Field>
            <Field label="Notes" wide>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={4} className={inputClass} />
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-4 rounded-lg bg-white p-6 shadow-md">
          <button type="button" onClick={() => router.push('/admin/leads')} className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Updating...' : 'Update Lead'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, wide, children }: { label: string; required?: boolean; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? 'md:col-span-2 lg:col-span-full' : ''}>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextField({
  name,
  label,
  value,
  onChange,
  type = 'text',
  required = false
}: {
  name: keyof LeadFormData;
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <Field label={label} required={required}>
      <input type={type} name={name} value={value} onChange={onChange} required={required} className={inputClass} />
    </Field>
  );
}

function CheckboxField({
  name,
  label,
  checked,
  onChange
}: {
  name: keyof LeadFormData;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex items-center self-end">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
      <span className="ml-2 text-sm text-gray-700">{label}</span>
    </label>
  );
}
