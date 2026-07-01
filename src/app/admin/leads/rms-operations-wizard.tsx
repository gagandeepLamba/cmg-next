'use client';

import { useEffect, useState } from 'react';
import { loadOperationStages, uploadOperationFiles } from '@/lib/operationsData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, ChevronRight, ChevronLeft, Upload, Download, FileText,
  User, Calendar, CheckCircle, XCircle, Clock, AlertCircle,
  Briefcase, FileCheck, Users, MessageSquare, Shield, Target
} from 'lucide-react';

interface RMSOperationsWizardProps {
  opportunityId: number;
  leadId: number;
  clientName: string;
}

interface OperationsStage {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'pending' | 'current' | 'completed';
}

interface PersonalDetailsData {
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
  countryInterest: string;
  serviceInterest: string;
}

interface ResumeWritingData {
  // Level 1 - Documents Received
  resumeDate: string;
  draftResume: File | null;
  uploadPassport: File | null;
  education: string;
  uploadEducation: File | null;
  nationalId: File | null;
  level1Remarks: string;

  // Level 2
  finalCopyResume: File | null;
  level2Remarks: string;
}

interface PrescreeningData {
  prescreeningDateScheduled: string;
  prescreeningStatus: string;
  interviewMode: string;
  languageProficiency: Array<{
    language: string;
    proficiency: string;
  }>;
  comments: string;
}

interface JobRegistrationData {
  frontendCaseHandover: string;
  documentStatus: string;
  pointClaimedFSWP: string;
  nocConfirmed: string;
  profileLaunched: string;
  profileExpiry: string;
  crsScores: string;
  status: string;
  profiles: Array<{
    documentReceived: string;
    documentStatus: string;
    pointClaimed: string;
    noc: string;
    profileLaunchDate: string;
    profileExpiry: string;
    crsScore: string;
    status: string;
    profileType: string;
  }>;
  comments: string;
}

interface RecruiterInterviewData {
  pnpLaunched: string;
  eoiSubmissionDate: string;
  eoiExpiryDate: string;
  noiReceivedDate: string;
  noiSubmissionDate: string;
  noiExpiryDate: string;
  nominationAwardedDate: string;
  nominationExpiryDate: string;
  status: string;
  eoiPoints: string;
  comments: string;
}

interface StatusUpdateData {
  currentStatus: string;
  lastUpdated: string;
  statusNotes: string;
  nextAction: string;
  nextActionDate: string;
}

export default function RMSOperationsWizard({
  opportunityId,
  leadId,
  clientName
}: RMSOperationsWizardProps) {
  const [activeStage, setActiveStage] = useState<string>('personal');
  const [saving, setSaving] = useState(false);

  const [stages, setStages] = useState<OperationsStage[]>([
    { id: 'personal', name: 'Personal Details', icon: User, status: 'current' },
    { id: 'resume', name: 'Resume Writing', icon: FileText, status: 'pending' },
    { id: 'prescreening', name: 'Prescreening', icon: Shield, status: 'pending' },
    { id: 'jobregistration', name: 'Job Registration', icon: Briefcase, status: 'pending' },
    { id: 'recruiter', name: 'Recruiter Interview', icon: Users, status: 'pending' },
    { id: 'status', name: 'Status Update', icon: Target, status: 'pending' },
  ]);

  const [personalData, setPersonalData] = useState<PersonalDetailsData>({
    fname: '',
    mname: '',
    lname: '',
    email: '',
    phone: '',
    mobile: '',
    nationality: '',
    address: '',
    dob: '',
    gender: 'Male',
    countryInterest: '',
    serviceInterest: ''
  });

  const [resumeData, setResumeData] = useState<ResumeWritingData>({
    resumeDate: '',
    draftResume: null,
    uploadPassport: null,
    education: '',
    uploadEducation: null,
    nationalId: null,
    level1Remarks: '',
    finalCopyResume: null,
    level2Remarks: ''
  });

  const [prescreeningData, setPrescreeningData] = useState<PrescreeningData>({
    prescreeningDateScheduled: '',
    prescreeningStatus: '',
    interviewMode: '',
    languageProficiency: [],
    comments: ''
  });

  const [jobRegistrationData, setJobRegistrationData] = useState<JobRegistrationData>({
    frontendCaseHandover: '',
    documentStatus: '',
    pointClaimedFSWP: '',
    nocConfirmed: '',
    profileLaunched: '',
    profileExpiry: '',
    crsScores: '',
    status: '',
    profiles: [],
    comments: ''
  });

  const [recruiterData, setRecruiterData] = useState<RecruiterInterviewData>({
    pnpLaunched: '',
    eoiSubmissionDate: '',
    eoiExpiryDate: '',
    noiReceivedDate: '',
    noiSubmissionDate: '',
    noiExpiryDate: '',
    nominationAwardedDate: '',
    nominationExpiryDate: '',
    status: '',
    eoiPoints: '',
    comments: ''
  });

  const [statusData, setStatusData] = useState<StatusUpdateData>({
    currentStatus: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    statusNotes: '',
    nextAction: '',
    nextActionDate: ''
  });

  useEffect(() => {
    loadOperationStages('rms', leadId, opportunityId).then((data) => {
      if (data.personal) setPersonalData(data.personal as unknown as PersonalDetailsData);
      if (data.resume) setResumeData(data.resume as unknown as ResumeWritingData);
      if (data.prescreening) setPrescreeningData(data.prescreening as unknown as PrescreeningData);
      if (data.jobregistration) setJobRegistrationData(data.jobregistration as unknown as JobRegistrationData);
      if (data.recruiter) setRecruiterData(data.recruiter as unknown as RecruiterInterviewData);
      if (data.status) setStatusData(data.status as unknown as StatusUpdateData);
    }).catch((error) => console.error('Unable to load RMS operations data:', error));
  }, [leadId, opportunityId]);

  const moveToNextStage = async () => {
    const currentIndex = stages.findIndex(s => s.id === activeStage);
    if (currentIndex < stages.length - 1) {
      await saveStageData();
      const newStages = [...stages];
      newStages[currentIndex].status = 'completed';
      newStages[currentIndex + 1].status = 'current';
      setStages(newStages);
      setActiveStage(newStages[currentIndex + 1].id);
    }
  };

  const moveToPreviousStage = () => {
    const currentIndex = stages.findIndex(s => s.id === activeStage);
    if (currentIndex > 0) {
      const newStages = [...stages];
      newStages[currentIndex].status = 'pending';
      newStages[currentIndex - 1].status = 'current';
      setStages(newStages);
      setActiveStage(newStages[currentIndex - 1].id);
    }
  };

  const saveStageData = async () => {
    setSaving(true);
    try {
      const stageDataMap: Record<string, any> = {
        personal: personalData,
        resume: resumeData,
        prescreening: prescreeningData,
        jobregistration: jobRegistrationData,
        recruiter: recruiterData,
        status: statusData
      };

      const dataToSave = {
        opportunityId,
        leadId,
        stage: activeStage,
        data: await uploadOperationFiles(stageDataMap[activeStage], 'rms', leadId),
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/admin/operations/rms/save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSave),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Failed to save RMS operations data');

      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const renderStageContent = () => {
    switch (activeStage) {
      case 'personal':
        return (
          <PersonalDetailsStage
            data={personalData}
            setData={setPersonalData}
            onNext={moveToNextStage}
            onSave={saveStageData}
            saving={saving}
          />
        );
      case 'resume':
        return (
          <ResumeWritingStage
            data={resumeData}
            setData={setResumeData}
            onNext={moveToNextStage}
            onPrevious={moveToPreviousStage}
            onSave={saveStageData}
            saving={saving}
          />
        );
      case 'prescreening':
        return (
          <PrescreeningStage
            data={prescreeningData}
            setData={setPrescreeningData}
            onNext={moveToNextStage}
            onPrevious={moveToPreviousStage}
            onSave={saveStageData}
            saving={saving}
          />
        );
      case 'jobregistration':
        return (
          <JobRegistrationStage
            data={jobRegistrationData}
            setData={setJobRegistrationData}
            onNext={moveToNextStage}
            onPrevious={moveToPreviousStage}
            onSave={saveStageData}
            saving={saving}
          />
        );
      case 'recruiter':
        return (
          <RecruiterInterviewStage
            data={recruiterData}
            setData={setRecruiterData}
            onNext={moveToNextStage}
            onPrevious={moveToPreviousStage}
            onSave={saveStageData}
            saving={saving}
          />
        );
      case 'status':
        return (
          <StatusUpdateStage
            data={statusData}
            setData={setStatusData}
            onPrevious={moveToPreviousStage}
            onSave={saveStageData}
            saving={saving}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">RMS Operations - {clientName}</h1>
                <p className="text-gray-600 mt-1">Resume Marketing Services Operations Management</p>
              </div>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
              >
                <ChevronLeft className="mr-1" size={20} />
                Back
              </button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Opportunity ID:</span> #{opportunityId}
                </div>
                <div>
                  <span className="font-medium">Lead ID:</span> #{leadId}
                </div>
                <div>
                  <span className="font-medium">Client:</span> {clientName}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = stage.id === activeStage;

                return (
                  <div key={stage.id} className="flex items-center">
                    <button
                      onClick={() => setActiveStage(stage.id)}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : stage.status === 'completed'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon size={16} className="mr-2" />
                      <span className="text-sm font-medium">{stage.name}</span>
                      {stage.status === 'completed' && (
                        <CheckCircle size={14} className="ml-2" />
                      )}
                    </button>

                    {index < stages.length - 1 && (
                      <ChevronRight
                        size={16}
                        className={`mx-1 ${
                          stage.status === 'completed' ? 'text-green-600' : 'text-gray-300'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stage Content */}
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStageContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stage Components
function PersonalDetailsStage({ data, setData, onNext, onSave, saving }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <User className="mr-2 text-blue-600" size={24} />
          Personal Information
        </h3>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              value={data.fname}
              onChange={(e) => setData({ ...data, fname: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="First name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
            <input
              type="text"
              value={data.mname}
              onChange={(e) => setData({ ...data, mname: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="Middle name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              value={data.lname}
              onChange={(e) => setData({ ...data, lname: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="+1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
            <input
              type="tel"
              value={data.mobile}
              onChange={(e) => setData({ ...data, mobile: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="+1234567890"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
            <input
              type="text"
              value={data.nationality}
              onChange={(e) => setData({ ...data, nationality: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="Nationality"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={data.dob}
              onChange={(e) => setData({ ...data, dob: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={data.gender}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country Interest</label>
            <input
              type="text"
              value={data.countryInterest}
              onChange={(e) => setData({ ...data, countryInterest: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="Country of interest"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            rows={3}
            className="w-full p-3 border rounded-lg"
            placeholder="Full address"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center"
        >
          <Save className="mr-2" size={20} />
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          onClick={onNext}
          disabled={!data.fname || !data.lname || !data.email || !data.mobile}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
        >
          Continue to Resume
          <ChevronRight className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );
}

function ResumeWritingStage({ data, setData, onNext, onPrevious, onSave, saving }: any) {
  return (
    <div className="space-y-6">
      {/* Level 1 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <FileText className="mr-2 text-blue-600" size={24} />
          Level 1 - Documents Received from Client
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume Date</label>
            <input
              type="date"
              value={data.resumeDate}
              onChange={(e) => setData({ ...data, resumeDate: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Education Level *</label>
            <select
              value={data.education}
              onChange={(e) => setData({ ...data, education: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Education</option>
              <option value="Under 10th">Under 10th</option>
              <option value="10th Pass">10th Pass</option>
              <option value="12th Pass">12th Pass</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Diploma">Diploma</option>
              <option value="Masters">Masters</option>
              <option value="PHD">PHD</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Draft Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setData({ ...data, draftResume: e.target.files?.[0] || null })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Passport</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setData({ ...data, uploadPassport: e.target.files?.[0] || null })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Education Document</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setData({ ...data, uploadEducation: e.target.files?.[0] || null })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">National ID</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setData({ ...data, nationalId: e.target.files?.[0] || null })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Level 1 Remarks</label>
          <textarea
            value={data.level1Remarks}
            onChange={(e) => setData({ ...data, level1Remarks: e.target.value })}
            rows={3}
            className="w-full p-3 border rounded-lg"
            placeholder="Add remarks for Level 1..."
          />
        </div>
      </div>

      {/* Level 2 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Level 2 - Final Resume</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Final Copy of Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setData({ ...data, finalCopyResume: e.target.files?.[0] || null })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Level 2 Remarks</label>
          <textarea
            value={data.level2Remarks}
            onChange={(e) => setData({ ...data, level2Remarks: e.target.value })}
            rows={3}
            className="w-full p-3 border rounded-lg"
            placeholder="Add remarks for Level 2..."
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center"
          >
            <Save className="mr-2" size={20} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={onNext}
            disabled={!data.education}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
          >
            Continue to Prescreening
            <ChevronRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PrescreeningStage({ data, setData, onNext, onPrevious, onSave, saving }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Shield className="mr-2 text-blue-600" size={24} />
          Prescreening Round
        </h3>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prescreening Date Scheduled</label>
            <input
              type="date"
              value={data.prescreeningDateScheduled}
              onChange={(e) => setData({ ...data, prescreeningDateScheduled: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prescreening Status</label>
            <select
              value={data.prescreeningStatus}
              onChange={(e) => setData({ ...data, prescreeningStatus: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interview Mode</label>
            <select
              value={data.interviewMode}
              onChange={(e) => setData({ ...data, interviewMode: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Mode</option>
              <option value="Zoom">Zoom</option>
              <option value="Telephonic">Telephonic</option>
              <option value="In-Person">In-Person</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
          <textarea
            value={data.comments}
            onChange={(e) => setData({ ...data, comments: e.target.value })}
            rows={4}
            className="w-full p-3 border rounded-lg"
            placeholder="Add prescreening comments..."
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center"
          >
            <Save className="mr-2" size={20} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            Continue to Job Registration
            <ChevronRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function JobRegistrationStage({ data, setData, onNext, onPrevious, onSave, saving }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Briefcase className="mr-2 text-blue-600" size={24} />
          Job Registration / Application
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frontend Case Handover</label>
            <select
              value={data.frontendCaseHandover}
              onChange={(e) => setData({ ...data, frontendCaseHandover: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Status</option>
              <option value="Complete">Complete</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Document Status</label>
            <select
              value={data.documentStatus}
              onChange={(e) => setData({ ...data, documentStatus: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Status</option>
              <option value="Complete">Complete</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Point Claimed in FSWP</label>
            <input
              type="number"
              value={data.pointClaimedFSWP}
              onChange={(e) => setData({ ...data, pointClaimedFSWP: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="Points"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NOC Confirmed by Client</label>
            <input
              type="text"
              value={data.nocConfirmed}
              onChange={(e) => setData({ ...data, nocConfirmed: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="NOC code"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Launched</label>
            <input
              type="date"
              value={data.profileLaunched}
              onChange={(e) => setData({ ...data, profileLaunched: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Expiry</label>
            <input
              type="date"
              value={data.profileExpiry}
              onChange={(e) => setData({ ...data, profileExpiry: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CRS Scores</label>
            <input
              type="number"
              value={data.crsScores}
              onChange={(e) => setData({ ...data, crsScores: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="CRS score"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={data.status}
            onChange={(e) => setData({ ...data, status: e.target.value })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="under review">Under Review</option>
            <option value="Sent for filing">Sent for filing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
          <textarea
            value={data.comments}
            onChange={(e) => setData({ ...data, comments: e.target.value })}
            rows={3}
            className="w-full p-3 border rounded-lg"
            placeholder="Add comments..."
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center"
          >
            <Save className="mr-2" size={20} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            Continue to Recruiter Interview
            <ChevronRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function RecruiterInterviewStage({ data, setData, onNext, onPrevious, onSave, saving }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Users className="mr-2 text-blue-600" size={24} />
          Recruiter Interview / PNP Process
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PNP Launched</label>
            <select
              value={data.pnpLaunched}
              onChange={(e) => setData({ ...data, pnpLaunched: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select PNP</option>
              <option value="PEI">PEI</option>
              <option value="Nova Scotia">Nova Scotia</option>
              <option value="New Brunswick">New Brunswick</option>
              <option value="Saskatchewan">Saskatchewan</option>
              <option value="Quebec">Quebec</option>
              <option value="Manitoba">Manitoba</option>
              <option value="Ontario">Ontario</option>
              <option value="British Columbia">British Columbia</option>
              <option value="Alberta">Alberta</option>
              <option value="Yukon">Yukon</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">EOI Points</label>
            <input
              type="number"
              value={data.eoiPoints}
              onChange={(e) => setData({ ...data, eoiPoints: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="EOI points"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">EOI Submission Date</label>
            <input
              type="date"
              value={data.eoiSubmissionDate}
              onChange={(e) => setData({ ...data, eoiSubmissionDate: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">EOI Expiry Date</label>
            <input
              type="date"
              value={data.eoiExpiryDate}
              onChange={(e) => setData({ ...data, eoiExpiryDate: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NOI Received Date</label>
            <input
              type="date"
              value={data.noiReceivedDate}
              onChange={(e) => setData({ ...data, noiReceivedDate: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NOI Submission Date</label>
            <input
              type="date"
              value={data.noiSubmissionDate}
              onChange={(e) => setData({ ...data, noiSubmissionDate: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">NOI Expiry Date</label>
            <input
              type="date"
              value={data.noiExpiryDate}
              onChange={(e) => setData({ ...data, noiExpiryDate: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomination Awarded Date</label>
            <input
              type="date"
              value={data.nominationAwardedDate}
              onChange={(e) => setData({ ...data, nominationAwardedDate: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nomination Expiry Date</label>
            <input
              type="date"
              value={data.nominationExpiryDate}
              onChange={(e) => setData({ ...data, nominationExpiryDate: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={data.status}
              onChange={(e) => setData({ ...data, status: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Status</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
              <option value="Submitted">Submitted</option>
              <option value="APPROVED">APPROVED</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
          <textarea
            value={data.comments}
            onChange={(e) => setData({ ...data, comments: e.target.value })}
            rows={3}
            className="w-full p-3 border rounded-lg"
            placeholder="Add comments..."
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center"
          >
            <Save className="mr-2" size={20} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            Continue to Status Update
            <ChevronRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusUpdateStage({ data, setData, onPrevious, onSave, saving }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="mr-2 text-blue-600" size={24} />
          Status Update & Next Actions
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
            <select
              value={data.currentStatus}
              onChange={(e) => setData({ ...data, currentStatus: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Documents Pending">Documents Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
            <input
              type="date"
              value={data.lastUpdated}
              onChange={(e) => setData({ ...data, lastUpdated: e.target.value })}
              className="w-full p-3 border rounded-lg"
              readOnly
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status Notes</label>
          <textarea
            value={data.statusNotes}
            onChange={(e) => setData({ ...data, statusNotes: e.target.value })}
            rows={4}
            className="w-full p-3 border rounded-lg"
            placeholder="Add detailed status notes..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Next Action Required</label>
            <input
              type="text"
              value={data.nextAction}
              onChange={(e) => setData({ ...data, nextAction: e.target.value })}
              className="w-full p-3 border rounded-lg"
              placeholder="Describe next action..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Next Action Date</label>
            <input
              type="date"
              value={data.nextActionDate}
              onChange={(e) => setData({ ...data, nextActionDate: e.target.value })}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-lg mb-4 text-green-900">Operations Summary</h4>
        <div className="space-y-2 text-sm text-green-800">
          <p>✓ Personal details recorded</p>
          <p>✓ Resume writing completed</p>
          <p>✓ Prescreening interview conducted</p>
          <p>✓ Job registration processed</p>
          <p>✓ Recruiter interview completed</p>
          <p>✓ All stages documented and tracked</p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center"
          >
            <Save className="mr-2" size={20} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => window.location.href = '/admin/leads'}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <CheckCircle className="mr-2" size={20} />
            Complete Operations
          </button>
        </div>
      </div>
    </div>
  );
}
