'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import { ArrowLeft, Save, X, Phone, Mail, MapPin, Calendar, DollarSign, Users, Target, Globe, Briefcase, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const [loading, setLoading] = useState(false);
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
    country: '',
    
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
    autoAssign: true,
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
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Get logged-in user
  const { user } = useAuth();

  // Fetch countries, lead sources, and employees on component mount
  useEffect(() => {
    fetchCountries();
    fetchLeadSources();
    fetchEmployees();
  }, []);

  // Set lead owner to logged-in user when user data is available
  useEffect(() => {
    if (user && !formData.leadOwner) {
      setFormData(prev => ({
        ...prev,
        leadOwner: user.id.toString(),
        assignedDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [user]);

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
      const response = await fetch('/api/employees/active');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          branch: user?.branch || 1,
          autoAssign: formData.autoAssign,
          created_by_admin: true,
          admin_created: true,
        }),
      });

      if (response.ok) {
        const newLead = await response.json();
        alert('Lead created successfully by admin!');
        router.push('/admin/leads');
      } else {
        const error = await response.json();
        alert(`Error creating lead: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Error creating lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const salutations = ['--None--', 'Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];
  const genderOptions = ['--None--', 'Male', 'Female', 'Other', 'Prefer not to say'];
  const staticCountries = ['--None--', 'United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'UAE', 'Germany', 'France', 'Singapore'];
  const priorities = ['Hot', 'Warm', 'Cold'];
  const statuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Closed'];

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
          {/* Lead Information Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Lead Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salutation</label>
                <select
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {salutations.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
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
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {staticCountries.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender Identity <span className="text-red-500">*</span>
                </label>
                <select
                  name="genderIdentity"
                  value={formData.genderIdentity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {genderOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <select
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
                </select>
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
                  Country <span className="text-red-500">*</span>
                </label>
                <select
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
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
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
                  </select>
                  {loadingPrograms && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
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
                  </select>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lead Owner</label>
                <select
                  name="leadOwner"
                  value={formData.leadOwner}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Lead Owner</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

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
                <span className="ml-2 text-sm text-gray-700">WatnotBot</span>
              </label>

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
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
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
