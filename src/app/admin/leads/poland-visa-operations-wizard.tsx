'use client';

import { useEffect, useState } from 'react';
import { uploadOperationFiles } from '@/lib/operationsData';
import { useOperationStages, useSaveOperationStage } from '@/hooks/useOperationsQueries';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, FileText, Briefcase, FileSignature, Shield, Video, DollarSign,
  MessageCircle, BarChart, MessageSquare, ChevronRight, ChevronLeft, Save, CheckCircle, Plane
} from 'lucide-react';

interface PolandVisaOperationsWizardProps {
  opportunityId: number;
  leadId: number;
  clientName: string;
}

interface OperationsStage {
  id: string;
  name: string;
  icon: any;
  status: 'pending' | 'current' | 'completed';
}

export default function PolandVisaOperationsWizard({
  opportunityId,
  leadId,
  clientName
}: PolandVisaOperationsWizardProps) {
  const [activeStage, setActiveStage] = useState('personal');
  const [saving, setSaving] = useState(false);

  const [stages, setStages] = useState<OperationsStage[]>([
    { id: 'personal', name: 'Personal Details', icon: User, status: 'current' },
    { id: 'application', name: 'Application Details', icon: FileText, status: 'pending' },
    { id: 'jol', name: 'Job Offer Letter', icon: Briefcase, status: 'pending' },
    { id: 'loc', name: 'Letter of Commitment', icon: FileSignature, status: 'pending' },
    { id: 'work-permit', name: 'Work Permit', icon: Shield, status: 'pending' },
    { id: 'biometrics', name: 'Biometrics', icon: Video, status: 'pending' },
    { id: 'payment', name: 'Payment Operations', icon: DollarSign, status: 'pending' },
    { id: 'conversation', name: 'Conversation', icon: MessageCircle, status: 'pending' },
    { id: 'status-update', name: 'Status Update', icon: BarChart, status: 'pending' },
    { id: 'client-chat', name: 'Client Chat', icon: MessageSquare, status: 'pending' },
  ]);

  const [stageData, setStageData] = useState<Record<string, any>>({});
  const { data: savedStages } = useOperationStages('poland-visa', leadId, opportunityId);
  const saveStage = useSaveOperationStage('poland-visa', leadId, opportunityId);

  useEffect(() => {
    if (savedStages?.data) setStageData(savedStages.data);
  }, [savedStages]);

  const saveStageData = async () => {
    setSaving(true);
    try {
      await saveStage.mutateAsync({ stage: activeStage, data: await uploadOperationFiles(stageData[activeStage] || {}, 'poland-visa', leadId) });
    } catch (error) {
      console.error('Error saving:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const moveToNextStage = () => {
    const currentIndex = stages.findIndex(s => s.id === activeStage);
    if (currentIndex < stages.length - 1) {
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

  const updateStageData = (key: string, data: any) => {
    setStageData(prev => ({ ...prev, [key]: data }));
  };

  function GenericStage({ title, description, dataKey }: any) {
    const [localSaving, setLocalSaving] = useState(false);
    const data = stageData[dataKey] || {};

    const handleSave = async () => {
      setLocalSaving(true);
      try {
        await saveStageData();
        alert(`${title} saved successfully!`);
      } catch (error) {
        alert('Failed to save data');
      } finally {
        setLocalSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <p className="text-indigo-800">{description}</p>
          <p className="text-sm text-indigo-600 mt-2">Complete all required fields based on the stage requirements from poland_visa_ops.php</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field 1</label>
            <input
              type="text"
              value={data.field1 || ''}
              onChange={(e) => updateStageData(dataKey, { ...data, field1: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter data"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field 2</label>
            <input
              type="text"
              value={data.field2 || ''}
              onChange={(e) => updateStageData(dataKey, { ...data, field2: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter data"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
            <input
              type="file"
              multiple
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: PDF, DOCX, JPG, PNG (Max 5MB each)
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={data.notes || ''}
              onChange={(e) => updateStageData(dataKey, { ...data, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Add notes or remarks"
            />
          </div>
        </div>

        <div className="flex justify-between pt-6">
          {activeStage !== 'personal' && (
            <button
              onClick={moveToPreviousStage}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center font-medium"
            >
              <ChevronLeft className="mr-2" size={20} />
              Back
            </button>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={handleSave}
              disabled={localSaving}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center font-medium"
            >
              <Save className="mr-2" size={20} />
              {localSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={async () => {
                await saveStageData();
                if (activeStage === stages[stages.length - 1].id) {
                  alert('Poland Visa Operations Completed Successfully!');
                  window.location.href = '/admin/leads';
                } else {
                  moveToNextStage();
                }
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center font-medium"
            >
              {activeStage === stages[stages.length - 1].id ? (
                <>
                  <CheckCircle className="mr-2" size={20} />
                  Complete
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="ml-2" size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderStageContent = () => {
    const stageMap: Record<string, { title: string; description: string; dataKey: string }> = {
      'personal': { title: 'Personal Details', description: 'Client personal information including name, contact details, nationality, DOB, passport details, gender, marital status, counselor, case officer, retention date, agreement number, and branch details.', dataKey: 'personal' },
      'application': { title: 'Application Details', description: 'Poland work permit application information including application type (Type A/Type B/Type D), visa type, job details, employer information, contract details, application date, and processing status.', dataKey: 'application' },
      'jol': { title: 'Job Offer Letter (JOL)', description: 'Job offer letter details including employer name, job title, job description, salary details, work location, contract duration, company registration number, and JOL upload. Track JOL approval status and dates.', dataKey: 'jol' },
      'loc': { title: 'Letter of Commitment (LOC)', description: 'Letter of Commitment from employer including commitment details, employment terms, accommodation arrangements, insurance coverage, and employer obligations. Upload and track LOC approval.', dataKey: 'loc' },
      'work-permit': { title: 'Work Permit Processing', description: 'Work permit application and processing including Starostwo (District Office) application, permit type, application date, processing timeline, permit number, validity period, and approval/rejection status.', dataKey: 'workPermit' },
      'biometrics': { title: 'Biometrics & Medical', description: 'Biometrics appointment including appointment date, location, collection status, medical examination details, vaccination records, and health insurance documentation.', dataKey: 'biometrics' },
      'payment': { title: 'Payment Operations', description: 'All payment tracking including application fees, processing fees, service charges, payment mode, payment date, receipt numbers, outstanding amounts, and refund processing.', dataKey: 'payment' },
      'conversation': { title: 'Conversation Management', description: 'Email conversations and client communications including conversation date, type (Walk-in/Inbound/Outbound/Email), conversation details, follow-up remarks, follow-up date, priority level, and status tracking.', dataKey: 'conversation' },
      'status-update': { title: 'Status Update', description: 'Case status updates including current processing stage, milestone tracking, expected timelines, document verification status, authority feedback, and next action items. Upload status documents and communication from authorities.', dataKey: 'statusUpdate' },
      'client-chat': { title: 'Client Chat & Support', description: 'Direct client communication channel for queries, support requests, document clarifications, appointment scheduling, and general assistance. Track response times and resolution status.', dataKey: 'clientChat' }
    };

    const currentStage = stageMap[activeStage];
    if (!currentStage) return null;

    return <GenericStage title={currentStage.title} description={currentStage.description} dataKey={currentStage.dataKey} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
              >
                <ChevronLeft className="mr-1" size={20} />
                Back to Opportunities
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Poland Visa Operations</h1>
              <p className="text-sm text-gray-600 mt-1">
                Client: {clientName} | Lead ID: {leadId} | Opportunity: {opportunityId}
              </p>
            </div>
            <Plane className="text-indigo-600" size={48} />
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center overflow-x-auto gap-1">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = stage.id === activeStage;

              return (
                <div key={stage.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => setActiveStage(stage.id)}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : stage.status === 'completed'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={14} className="mr-1" />
                    <span className="text-xs font-medium">{stage.name}</span>
                    {stage.status === 'completed' && <CheckCircle size={12} className="ml-1" />}
                  </button>
                  {index < stages.length - 1 && (
                    <ChevronRight size={14} className={`mx-0.5 ${stage.status === 'completed' ? 'text-green-600' : 'text-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStageContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
