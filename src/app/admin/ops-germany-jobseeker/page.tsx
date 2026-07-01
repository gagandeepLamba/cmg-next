'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search, Filter, User, FileText, Calendar, Clock, CheckCircle,
  AlertCircle, XCircle, MapPin, Phone, Mail, Globe, CreditCard,
  Eye, Edit, Download, RefreshCw, DollarSign, Plus, Briefcase,
  Users, Target, GraduationCap, Plane, Building2, Star, Shield,
  Languages, Scale, TrendingUp, FileCheck, Award, ChevronDown, X
} from 'lucide-react';
import { searchOperationCases, mapOperationsRowToListItem } from '@/lib/operationsClient';

/* ─────────── Types ─────────── */
interface GermanyJobSeekerCase {
  id: string;
  leadId: string;
  leadName: string;
  email: string;
  phone: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  createdDate: string;
  nextFollowUp: string;
  personalInfo: {
    nationality: string;
    passportNumber: string;
    dateOfBirth: string;
    currentLocation: string;
    maritalStatus: string;
    education: string;
    fieldOfStudy: string;
    yearsExperience: string;
    germanLanguageLevel: string;
    englishLevel: string;
  };
  visaDetails: {
    targetSector: string;
    targetJobTitle: string;
    salaryExpectation: string;
    blockedAccountAmount: string;
    visaFee: string;
    appointmentDate: string;
    embassyLocation: string;
    travelHealthInsurance: boolean;
    motivationLetterReady: boolean;
    cvGermanFormat: boolean;
    recognizedQualification: boolean;
  };
  stageChecklist: {
    initialAssessment: boolean;
    documentsCollected: boolean;
    cvGermanFormatted: boolean;
    motivationLetterDone: boolean;
    qualificationRecognition: boolean;
    blockedAccountOpened: boolean;
    healthInsuranceArranged: boolean;
    embassyAppointmentBooked: boolean;
    visaInterviewPrepared: boolean;
    visaApproved: boolean;
    travelBooked: boolean;
    cityRegistered: boolean;
  };
  payments: { date: string; amount: string; method: string; reference: string }[];
  notes: string;
  agreementId: string | null;
}

const STAGES = [
  { key: 'initialAssessment',       label: 'Initial Assessment',         icon: <Target className="w-3 h-3" /> },
  { key: 'documentsCollected',      label: 'Documents Collected',         icon: <FileText className="w-3 h-3" /> },
  { key: 'cvGermanFormatted',       label: 'CV (German Format)',          icon: <FileCheck className="w-3 h-3" /> },
  { key: 'motivationLetterDone',    label: 'Motivation Letter',          icon: <FileText className="w-3 h-3" /> },
  { key: 'qualificationRecognition',label: 'Qualification Recognition',  icon: <Award className="w-3 h-3" /> },
  { key: 'blockedAccountOpened',    label: 'Blocked Account (€)       ', icon: <DollarSign className="w-3 h-3" /> },
  { key: 'healthInsuranceArranged', label: 'Health Insurance',           icon: <Shield className="w-3 h-3" /> },
  { key: 'embassyAppointmentBooked',label: 'Embassy Appointment',        icon: <Calendar className="w-3 h-3" /> },
  { key: 'visaInterviewPrepared',   label: 'Interview Prepared',         icon: <Users className="w-3 h-3" /> },
  { key: 'visaApproved',            label: 'Visa Approved',              icon: <CheckCircle className="w-3 h-3" /> },
  { key: 'travelBooked',            label: 'Travel Booked',              icon: <Plane className="w-3 h-3" /> },
  { key: 'cityRegistered',          label: 'City Registration (Anmeldung)', icon: <MapPin className="w-3 h-3" /> },
] as const;

const GERMAN_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'None'];
const SECTORS = ['Engineering', 'IT / Software', 'Healthcare / Nursing', 'Finance', 'Architecture', 'Teaching', 'Skilled Trades', 'Research / Science', 'Logistics', 'Other'];

const STATUS_COLORS: Record<string, string> = {
  active:     'bg-green-100 text-green-800',
  pending:    'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  approved:   'bg-emerald-100 text-emerald-800',
  rejected:   'bg-red-100 text-red-800',
  on_hold:    'bg-gray-100 text-gray-800',
};

const newCase = (): GermanyJobSeekerCase => ({
  id: '', leadId: '', leadName: '', email: '', phone: '',
  status: 'active', priority: 'medium', assignedTo: '',
  createdDate: new Date().toISOString().slice(0, 10), nextFollowUp: '',
  personalInfo: { nationality: '', passportNumber: '', dateOfBirth: '', currentLocation: '',
    maritalStatus: 'Single', education: '', fieldOfStudy: '', yearsExperience: '',
    germanLanguageLevel: 'None', englishLevel: 'B2' },
  visaDetails: { targetSector: '', targetJobTitle: '', salaryExpectation: '', blockedAccountAmount: '11208',
    visaFee: '75', appointmentDate: '', embassyLocation: '',
    travelHealthInsurance: false, motivationLetterReady: false,
    cvGermanFormat: false, recognizedQualification: false },
  stageChecklist: { initialAssessment: false, documentsCollected: false, cvGermanFormatted: false,
    motivationLetterDone: false, qualificationRecognition: false, blockedAccountOpened: false,
    healthInsuranceArranged: false, embassyAppointmentBooked: false, visaInterviewPrepared: false,
    visaApproved: false, travelBooked: false, cityRegistered: false },
  payments: [], notes: '', agreementId: null,
});

/* ─────────── Component ─────────── */
export default function GermanyJobSeekerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cases, setCases] = useState<GermanyJobSeekerCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCase, setSelectedCase] = useState<GermanyJobSeekerCase | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<GermanyJobSeekerCase>(newCase());
  const [activeTab, setActiveTab] = useState<'list' | 'pipeline'>('list');

  // Load from operations API
  const loadCases = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await searchOperationCases({
        module: 'germany_jobseeker',
        search: search || undefined,
        limit: 100,
      });
      const mapped = rows.map((row): GermanyJobSeekerCase => ({
        id: String(row.opportunityId),
        leadId: String(row.leadId),
        leadName: [row.fname, row.lname].filter(Boolean).join(' ') || '—',
        email: row.email || '',
        phone: row.mobile || row.phone || '',
        status: row.opportunityStatus || row.leadStatus || 'active',
        priority: 'medium',
        assignedTo: row.case_officer ? `Officer #${row.case_officer}` : '—',
        createdDate: '',
        nextFollowUp: '',
        personalInfo: {
          nationality: row.nationality || '', passportNumber: '',
          dateOfBirth: '', currentLocation: '',
          maritalStatus: 'Single', education: '',
          fieldOfStudy: '', yearsExperience: '',
          germanLanguageLevel: 'None', englishLevel: 'B2',
        },
        visaDetails: {
          targetSector: row.serviceRequired || '', targetJobTitle: '',
          salaryExpectation: '', blockedAccountAmount: '11208',
          visaFee: '75', appointmentDate: '', embassyLocation: '',
          travelHealthInsurance: false, motivationLetterReady: false,
          cvGermanFormat: false, recognizedQualification: false,
        },
        stageChecklist: {
          initialAssessment: true, documentsCollected: false, cvGermanFormatted: false,
          motivationLetterDone: false, qualificationRecognition: false, blockedAccountOpened: false,
          healthInsuranceArranged: false, embassyAppointmentBooked: false, visaInterviewPrepared: false,
          visaApproved: false, travelBooked: false, cityRegistered: false,
        },
        payments: [], notes: row.opportunityName || '', agreementId: row.agreementId ? String(row.agreementId) : null,
      }));
      setCases(mapped);
    } catch {
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { loadCases(); }, [loadCases]);

  // Pre-load from URL leadId
  useEffect(() => {
    const leadId = searchParams.get('leadId');
    if (leadId) setSearch(leadId);
  }, [searchParams]);

  const filtered = cases.filter(c => {
    const q = search.toLowerCase();
    if (statusFilter && c.status !== statusFilter) return false;
    if (!q) return true;
    return c.leadName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) ||
      c.leadId.includes(q) || c.phone.includes(q);
  });

  const stageProgress = (c: GermanyJobSeekerCase) => {
    const done = Object.values(c.stageChecklist).filter(Boolean).length;
    return { done, total: STAGES.length, pct: Math.round((done / STAGES.length) * 100) };
  };

  /* ─── Summary counts ─── */
  const summary = {
    total:     cases.length,
    active:    cases.filter(c => c.status === 'active').length,
    approved:  cases.filter(c => c.status === 'approved').length,
    pending:   cases.filter(c => c.status === 'pending').length,
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Germany Job Seeker Visa
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">§20 AufenthG — Qualified Professionals Job Seeker Operations</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadCases}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => { setEditingCase(newCase()); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            <Plus className="w-4 h-4" /> New Case
          </button>
          <button onClick={() => router.push('/admin/operations-management')}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            ← Operations
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Cases',  value: summary.total,    color: 'text-blue-600',   bg: 'bg-blue-50',   icon: <Users className="w-5 h-5 text-blue-500" /> },
          { label: 'Active',       value: summary.active,   color: 'text-green-600',  bg: 'bg-green-50',  icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
          { label: 'Pending',      value: summary.pending,  color: 'text-yellow-600', bg: 'bg-yellow-50', icon: <Clock className="w-5 h-5 text-yellow-500" /> },
          { label: 'Visa Approved',value: summary.approved, color: 'text-emerald-600',bg: 'bg-emerald-50',icon: <Plane className="w-5 h-5 text-emerald-500" /> },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-lg p-4 flex items-center gap-3`}>
            {s.icon}
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Key Requirements Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <h3 className="text-sm font-semibold text-amber-800 mb-2">Germany Job Seeker Visa Key Requirements (§20 AufenthG)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-amber-700">
          <div className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Recognised university degree</div>
          <div className="flex items-center gap-1"><Languages className="w-3 h-3" /> German B1 or English B2+</div>
          <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Blocked account ≥ €11,208</div>
          <div className="flex items-center gap-1"><Shield className="w-3 h-3" /> Travel health insurance</div>
          <div className="flex items-center gap-1"><FileText className="w-3 h-3" /> CV in German format + Motivation Letter</div>
          <div className="flex items-center gap-1"><Scale className="w-3 h-3" /> Qualification recognition (if applicable)</div>
          <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Valid for 6 months (extendable)</div>
          <div className="flex items-center gap-1"><Building2 className="w-3 h-3" /> Job offer → convert to Work Permit</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b">
          {(['list', 'pipeline'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t === 'list' ? 'Case List' : 'Pipeline View'}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-4 flex flex-wrap gap-3 border-b">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, email, lead ID..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="approved">Visa Approved</option>
            <option value="rejected">Rejected</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>

        {/* ── LIST VIEW ── */}
        {activeTab === 'list' && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Globe className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No Germany Job Seeker cases found</p>
                <button onClick={() => { setEditingCase(newCase()); setShowForm(true); }}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                  Add First Case
                </button>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Lead', 'Contact', 'Target Sector', 'German Level', 'Blocked Acc.', 'Progress', 'Status', 'Next Follow-up', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map(c => {
                    const { done, total, pct } = stageProgress(c);
                    return (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <button onClick={() => setSelectedCase(c)}
                            className="font-semibold text-blue-700 hover:underline text-sm text-left">
                            {c.leadName}
                          </button>
                          <div className="text-xs text-gray-500">Lead #{c.leadId}</div>
                          <div className="text-xs text-gray-400">{c.personalInfo.nationality}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1"><Mail className="w-3 h-3" />{c.email || '—'}</div>
                          <div className="flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{c.phone || '—'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{c.visaDetails.targetSector || '—'}</div>
                          <div className="text-xs text-gray-500">{c.visaDetails.targetJobTitle || ''}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            ['B2','C1','C2'].includes(c.personalInfo.germanLanguageLevel) ? 'bg-green-100 text-green-800' :
                            ['A2','B1'].includes(c.personalInfo.germanLanguageLevel) ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            DE: {c.personalInfo.germanLanguageLevel}
                          </span>
                          <div className="text-xs text-gray-500 mt-0.5">EN: {c.personalInfo.englishLevel}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className={`font-medium ${c.stageChecklist.blockedAccountOpened ? 'text-green-700' : 'text-gray-500'}`}>
                            {c.stageChecklist.blockedAccountOpened ? '✓ Opened' : '—'}
                          </div>
                          <div className="text-xs text-gray-400">€{c.visaDetails.blockedAccountAmount || '11,208'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5 min-w-16">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">{done}/{total}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">{pct}% complete</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-700'}`}>
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {c.nextFollowUp || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setSelectedCase(c)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setEditingCase(c); setShowForm(true); }}
                              className="p-1.5 text-gray-600 hover:bg-gray-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── PIPELINE VIEW ── */}
        {activeTab === 'pipeline' && (
          <div className="p-4 space-y-3">
            {filtered.map(c => {
              const { done, pct } = stageProgress(c);
              return (
                <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <button onClick={() => setSelectedCase(c)}
                        className="font-semibold text-blue-700 hover:underline">{c.leadName}</button>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {c.visaDetails.targetSector} • {c.personalInfo.nationality} • DE: {c.personalInfo.germanLanguageLevel}
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[c.status] || ''}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{pct}%</span>
                  </div>
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-1">
                    {STAGES.map(s => {
                      const done = c.stageChecklist[s.key as keyof typeof c.stageChecklist];
                      return (
                        <div key={s.key} title={s.label}
                          className={`h-6 rounded text-center flex items-center justify-center ${
                            done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                          }`}>
                          {s.icon}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {STAGES.map(s => {
                      const isDone = c.stageChecklist[s.key as keyof typeof c.stageChecklist];
                      return isDone ? null : (
                        <span key={s.key} className="text-[10px] text-red-500">{s.label.trim()}</span>
                      );
                    }).filter(Boolean).slice(0, 3)}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-500 text-sm">No cases match your filters.</div>
            )}
          </div>
        )}

        {/* Count footer */}
        <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500">
          Showing {filtered.length} of {cases.length} Germany Job Seeker cases
        </div>
      </div>

      {/* ── CASE DETAIL MODAL ── */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedCase.leadName}</h3>
                <p className="text-sm text-gray-500">Germany Job Seeker Visa — Lead #{selectedCase.leadId}</p>
              </div>
              <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Contact */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4" />{selectedCase.email || '—'}</div>
                <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" />{selectedCase.phone || '—'}</div>
                <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4" />{selectedCase.personalInfo.currentLocation || '—'}</div>
              </div>

              {/* Personal Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-1">Personal Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {[
                    ['Nationality', selectedCase.personalInfo.nationality],
                    ['Date of Birth', selectedCase.personalInfo.dateOfBirth],
                    ['Passport No.', selectedCase.personalInfo.passportNumber],
                    ['Education', selectedCase.personalInfo.education],
                    ['Field of Study', selectedCase.personalInfo.fieldOfStudy],
                    ['Experience', selectedCase.personalInfo.yearsExperience + ' years'],
                    ['German Level', selectedCase.personalInfo.germanLanguageLevel],
                    ['English Level', selectedCase.personalInfo.englishLevel],
                    ['Marital Status', selectedCase.personalInfo.maritalStatus],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-medium text-gray-900">{val || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visa Details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-1">Visa Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {[
                    ['Target Sector', selectedCase.visaDetails.targetSector],
                    ['Target Job Title', selectedCase.visaDetails.targetJobTitle],
                    ['Salary Expectation', selectedCase.visaDetails.salaryExpectation],
                    ['Blocked Account', '€' + selectedCase.visaDetails.blockedAccountAmount],
                    ['Visa Fee', '€' + selectedCase.visaDetails.visaFee],
                    ['Embassy', selectedCase.visaDetails.embassyLocation],
                    ['Appointment Date', selectedCase.visaDetails.appointmentDate],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-medium text-gray-900">{val || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-1">Progress Checklist</h4>
                <div className="grid grid-cols-2 gap-2">
                  {STAGES.map(s => {
                    const isDone = selectedCase.stageChecklist[s.key as keyof typeof selectedCase.stageChecklist];
                    return (
                      <div key={s.key} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${isDone ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                        {isDone ? <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" /> : <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                        {s.label.trim()}
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedCase.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1 border-b pb-1">Notes</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{selectedCase.notes}</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-between">
              <button onClick={() => { setEditingCase(selectedCase); setSelectedCase(null); setShowForm(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                <Edit className="w-4 h-4" /> Edit Case
              </button>
              <button onClick={() => setSelectedCase(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FORM MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCase.id ? 'Edit Case' : 'New Germany Job Seeker Case'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Lead ID</label>
                  <input type="text" value={editingCase.leadId}
                    onChange={e => setEditingCase(p => ({ ...p, leadId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Lead ID" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                  <input type="text" value={editingCase.leadName}
                    onChange={e => setEditingCase(p => ({ ...p, leadName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Client full name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input type="email" value={editingCase.email}
                    onChange={e => setEditingCase(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input type="tel" value={editingCase.phone}
                    onChange={e => setEditingCase(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select value={editingCase.status}
                    onChange={e => setEditingCase(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="approved">Visa Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Next Follow-up</label>
                  <input type="date" value={editingCase.nextFollowUp}
                    onChange={e => setEditingCase(p => ({ ...p, nextFollowUp: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Personal & Language</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nationality</label>
                  <input type="text" value={editingCase.personalInfo.nationality}
                    onChange={e => setEditingCase(p => ({ ...p, personalInfo: { ...p.personalInfo, nationality: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Education</label>
                  <input type="text" value={editingCase.personalInfo.education}
                    onChange={e => setEditingCase(p => ({ ...p, personalInfo: { ...p.personalInfo, education: e.target.value } }))}
                    placeholder="e.g. Bachelor's in Engineering"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">German Language Level</label>
                  <select value={editingCase.personalInfo.germanLanguageLevel}
                    onChange={e => setEditingCase(p => ({ ...p, personalInfo: { ...p.personalInfo, germanLanguageLevel: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    {GERMAN_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">English Level</label>
                  <select value={editingCase.personalInfo.englishLevel}
                    onChange={e => setEditingCase(p => ({ ...p, personalInfo: { ...p.personalInfo, englishLevel: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    {GERMAN_LEVELS.filter(l => l !== 'None').map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Visa / Job Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Target Sector</label>
                  <select value={editingCase.visaDetails.targetSector}
                    onChange={e => setEditingCase(p => ({ ...p, visaDetails: { ...p.visaDetails, targetSector: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="">Select sector</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Target Job Title</label>
                  <input type="text" value={editingCase.visaDetails.targetJobTitle}
                    onChange={e => setEditingCase(p => ({ ...p, visaDetails: { ...p.visaDetails, targetJobTitle: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Blocked Account Amount (€)</label>
                  <input type="text" value={editingCase.visaDetails.blockedAccountAmount}
                    onChange={e => setEditingCase(p => ({ ...p, visaDetails: { ...p.visaDetails, blockedAccountAmount: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Embassy Location</label>
                  <input type="text" value={editingCase.visaDetails.embassyLocation}
                    onChange={e => setEditingCase(p => ({ ...p, visaDetails: { ...p.visaDetails, embassyLocation: e.target.value } }))}
                    placeholder="e.g. Dubai"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Appointment Date</label>
                  <input type="date" value={editingCase.visaDetails.appointmentDate}
                    onChange={e => setEditingCase(p => ({ ...p, visaDetails: { ...p.visaDetails, appointmentDate: e.target.value } }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">Stage Checklist</h4>
              <div className="grid grid-cols-2 gap-2">
                {STAGES.map(s => (
                  <label key={s.key} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input type="checkbox"
                      checked={editingCase.stageChecklist[s.key as keyof typeof editingCase.stageChecklist]}
                      onChange={e => setEditingCase(p => ({
                        ...p,
                        stageChecklist: { ...p.stageChecklist, [s.key]: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-xs text-gray-700">{s.label.trim()}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea rows={3} value={editingCase.notes}
                  onChange={e => setEditingCase(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Case notes..." />
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => {
                // Save to local state (in production this would call the API)
                if (editingCase.id) {
                  setCases(prev => prev.map(c => c.id === editingCase.id ? editingCase : c));
                } else {
                  setCases(prev => [...prev, { ...editingCase, id: String(Date.now()) }]);
                }
                setShowForm(false);
              }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                {editingCase.id ? 'Save Changes' : 'Create Case'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
