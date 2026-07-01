'use client';

import { useEffect, useState } from 'react';
import { uploadOperationFiles } from '@/lib/operationsData';
import { useOperationStages, useSaveOperationStage } from '@/hooks/useOperationsQueries';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Award, FileText, GlobeIcon, MapPin, Send, Anchor, Ship, Building,
  CheckCircle, TrendingUp, FileEdit, MessageCircle, BarChart,
  ChevronRight, ChevronLeft, Save
} from 'lucide-react';

interface EIPCanadaOperationsWizardProps {
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

export default function EIPCanadaOperationsWizard({
  opportunityId,
  leadId,
  clientName
}: EIPCanadaOperationsWizardProps) {
  const [activeStage, setActiveStage] = useState('personal');
  const [saving, setSaving] = useState(false);

  const [stages, setStages] = useState<OperationsStage[]>([
    { id: 'personal', name: 'Personal Details', icon: User, status: 'current' },
    { id: 'eca', name: 'ECA', icon: Award, status: 'pending' },
    { id: 'spouse-eca', name: 'Spouse ECA', icon: Award, status: 'pending' },
    { id: 'language', name: 'Language Proficiency', icon: FileText, status: 'pending' },
    { id: 'spouse-language', name: 'Language (Spouse)', icon: FileText, status: 'pending' },
    { id: 'express-entry', name: 'Express Entry', icon: GlobeIcon, status: 'pending' },
    { id: 'pnp', name: 'PnP', icon: MapPin, status: 'pending' },
    { id: 'aipp', name: 'AIPP', icon: Anchor, status: 'pending' },
    { id: 'rnip', name: 'RNIP', icon: Ship, status: 'pending' },
    { id: 'mcdii', name: 'MCDII', icon: Building, status: 'pending' },
    { id: 'cic-submission', name: 'CIC Submission', icon: Send, status: 'pending' },
    { id: 'visa-grant', name: 'Visa Grant', icon: CheckCircle, status: 'pending' },
    { id: 'post-landing', name: 'Post Landing', icon: TrendingUp, status: 'pending' },
    { id: 'remark', name: 'Remark', icon: FileEdit, status: 'pending' },
    { id: 'conversation', name: 'Conversation', icon: MessageCircle, status: 'pending' },
    { id: 'status-update', name: 'Status Update', icon: BarChart, status: 'pending' },
  ]);

  const [stageData, setStageData] = useState<Record<string, any>>({});
  const { data: savedStages } = useOperationStages('eip-canada', leadId, opportunityId);
  const saveStage = useSaveOperationStage('eip-canada', leadId, opportunityId);

  useEffect(() => {
    if (savedStages?.data) setStageData(savedStages.data);
  }, [savedStages]);

  const saveStageData = async () => {
    setSaving(true);
    try {
      await saveStage.mutateAsync({ stage: activeStage, data: await uploadOperationFiles(stageData[activeStage] || {}, 'eip-canada', leadId) });
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
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <p className="text-purple-800">{description}</p>
          <p className="text-sm text-purple-600 mt-2">Complete all required fields based on the stage requirements from ops_eip_canada.php</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field 1</label>
            <input
              type="text"
              value={data.field1 || ''}
              onChange={(e) => updateStageData(dataKey, { ...data, field1: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter data"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field 2</label>
            <input
              type="text"
              value={data.field2 || ''}
              onChange={(e) => updateStageData(dataKey, { ...data, field2: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter data"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
            <input
              type="file"
              multiple
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={data.notes || ''}
              onChange={(e) => updateStageData(dataKey, { ...data, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                  alert('EIP Canada Operations Completed Successfully!');
                  window.location.href = '/admin/leads';
                } else {
                  moveToNextStage();
                }
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center font-medium"
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
      'personal': { title: 'Personal Details', description: 'Client personal information including contact details, nationality, DOB, gender, country interest, program interest, counselor, case officer, retention date, agreement number, and branch details.', dataKey: 'personal' },
      'eca': { title: 'ECA (Educational Credential Assessment)', description: 'ECA package details including receipt date, source (PA/Spouse), document status, assessment body (WES/ICAS/IQAS/MCC/PEBC/ICES/CES), application date, payment mode, transcript details, status, and completion date.', dataKey: 'eca' },
      'spouse-eca': { title: 'Spouse ECA', description: 'Educational credential assessment for spouse including all qualification details, transcript status, assessment body selection, and completion tracking.', dataKey: 'spouseEca' },
      'language': { title: 'Language Proficiency', description: 'Language test details including test type (IELTS AT/GT, PTE, TOEFL iBT, OET, CAE), status, test date, expiry date, test score, and individual scores for Reading, Writing, Listening, Speaking.', dataKey: 'language' },
      'spouse-language': { title: 'Language Proficiency (Spouse)', description: 'Spouse language test information including test type, scores, dates, and proficiency levels across all four skills.', dataKey: 'spouseLanguage' },
      'express-entry': { title: 'Express Entry', description: 'Express Entry profile including CRS score, profile creation date, job offer details, LMIA information, and profile status tracking.', dataKey: 'expressEntry' },
      'pnp': { title: 'Provincial Nominee Program', description: 'PnP application including province selection, nomination status, application date, nomination certificate details, and processing timeline.', dataKey: 'pnp' },
      'aipp': { title: 'Atlantic Immigration Pilot Program', description: 'AIPP details including employer endorsement, job offer, designation certificate, settlement plan, and application tracking.', dataKey: 'aipp' },
      'rnip': { title: 'Rural and Northern Immigration Pilot', description: 'RNIP application including community recommendation, job offer, settlement plan, community selection, and application status.', dataKey: 'rnip' },
      'mcdii': { title: 'Ministerial Instructions (MCDII)', description: 'MCDII category application including eligibility criteria, documentation requirements, and special processing instructions.', dataKey: 'mcdii' },
      'cic-submission': { title: 'CIC Submission', description: 'Citizenship and Immigration Canada submission including ITA response, document submission, medical examination, police certificates, and biometrics.', dataKey: 'cicSubmission' },
      'visa-grant': { title: 'Visa Grant', description: 'Final visa approval including grant date, visa type, expiry date, passport submission, COPR details, and landing instructions.', dataKey: 'visaGrant' },
      'post-landing': { title: 'Post Landing Services', description: 'Settlement services including SIN application, bank account setup, health card, job search assistance, and accommodation support.', dataKey: 'postLanding' },
      'remark': { title: 'Remarks', description: 'General remarks and notes about the case progress, client communication, and important observations.', dataKey: 'remark' },
      'conversation': { title: 'Conversation History', description: 'Email conversations including date, conversation type (Walk-in/Inbound/Outbound/Email), conversation details, follow-up remarks, and follow-up date.', dataKey: 'conversation' },
      'status-update': { title: 'Status Update', description: 'Case status updates including current stage, progress notes, next steps, and client communication updates. Upload status files and track milestones.', dataKey: 'statusUpdate' }
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
              <h1 className="text-2xl font-bold text-gray-900">EIP Canada Operations</h1>
              <p className="text-sm text-gray-600 mt-1">
                Client: {clientName} | Lead ID: {leadId} | Opportunity: {opportunityId}
              </p>
            </div>
            <Building className="text-purple-600" size={48} />
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
                    className={`flex items-center px-2 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md'
                        : stage.status === 'completed'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={12} className="mr-1" />
                    <span className="text-xs font-medium">{stage.name}</span>
                    {stage.status === 'completed' && <CheckCircle size={10} className="ml-1" />}
                  </button>
                  {index < stages.length - 1 && (
                    <ChevronRight size={12} className={`mx-0.5 ${stage.status === 'completed' ? 'text-green-600' : 'text-gray-300'}`} />
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
