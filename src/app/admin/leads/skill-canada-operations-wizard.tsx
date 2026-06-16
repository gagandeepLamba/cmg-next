'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, FileText, Award, GlobeIcon, Flag, Send, CheckCircle, TrendingUp,
  FileEdit, MessageCircle, File, Files, BarChart, ChevronRight, ChevronLeft, Save, MapPin
} from 'lucide-react';

interface SkillCanadaOperationsWizardProps {
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

export default function SkillCanadaOperationsWizard({
  opportunityId,
  leadId,
  clientName
}: SkillCanadaOperationsWizardProps) {
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
    { id: 'ita', name: 'ITA', icon: Send, status: 'pending' },
    { id: 'visa-grant', name: 'Visa Grant', icon: CheckCircle, status: 'pending' },
    { id: 'post-landing', name: 'Post Landing', icon: TrendingUp, status: 'pending' },
    { id: 'remark', name: 'Remark', icon: FileEdit, status: 'pending' },
    { id: 'conversation', name: 'Conversation', icon: MessageCircle, status: 'pending' },
    { id: 'doc-review-personal', name: 'Doc Review (Personal)', icon: File, status: 'pending' },
    { id: 'doc-review', name: 'Document Review', icon: Files, status: 'pending' },
    { id: 'status-update', name: 'Status Update', icon: BarChart, status: 'pending' },
  ]);

  const [stageData, setStageData] = useState<Record<string, any>>({
    personal: {}, eca: {}, spouseEca: {}, language: {}, spouseLanguage: {},
    expressEntry: {}, pnp: {}, ita: {}, visaGrant: {}, postLanding: {},
    remark: {}, conversation: {}, docReviewPersonal: {}, docReview: {}, statusUpdate: {}
  });

  const saveStageData = async () => {
    setSaving(true);
    try {
      const dataKey = activeStage.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const response = await fetch('/api/admin/operations/skill-canada/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId,
          leadId,
          stage: activeStage,
          data: stageData[activeStage] || stageData[dataKey] || {},
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save Skill Canada operations data');
      }
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{description}</p>
          <p className="text-sm text-red-600 mt-2">Complete all required fields based on the stage requirements from ops_skill_canada.php</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field 1</label>
            <input
              type="text"
              value={data.field1 || ''}
              onChange={(e) => updateStageData(dataKey, { ...data, field1: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter data"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field 2</label>
            <input
              type="text"
              value={data.field2 || ''}
              onChange={(e) => updateStageData(dataKey, { ...data, field2: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter data"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={data.notes || ''}
              onChange={(e) => updateStageData(dataKey, { ...data, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
                  alert('Skill Canada Operations Completed Successfully!');
                  window.location.href = '/admin/leads';
                } else {
                  moveToNextStage();
                }
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center font-medium"
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
      'eca': { title: 'ECA (Educational Credential Assessment)', description: 'ECA package details including receipt date, source (PA/Spouse), document status, assessment body (WES/ICAS/IQAS/MCC/PEBC/ICES/CES), application date, payment mode, transcript details, status, and completion date. Add qualifications with university, specialization, and rating.', dataKey: 'eca' },
      'spouse-eca': { title: 'Spouse ECA', description: 'Educational credential assessment for spouse including all qualification details, transcript status, assessment body selection, and completion tracking.', dataKey: 'spouseEca' },
      'language': { title: 'Language Proficiency', description: 'Language test details including test type (IELTS AT/GT, PTE, TOEFL iBT, OET, CAE), status (Pending/Completed/Insufficient/Registered), test date, expiry date, test score, and individual scores for Reading, Writing, Listening, Speaking. Multiple test entries supported.', dataKey: 'language' },
      'spouse-language': { title: 'Language Proficiency (Spouse)', description: 'Spouse language test information including test type, scores, dates, and proficiency levels across all four skills.', dataKey: 'spouseLanguage' },
      'express-entry': { title: 'Express Entry', description: 'Express Entry profile including CRS score, profile creation date, job offer details, LMIA information, and profile status tracking.', dataKey: 'expressEntry' },
      'pnp': { title: 'Provincial Nominee Program', description: 'PnP application including province selection, nomination status, application date, nomination certificate details, and processing timeline.', dataKey: 'pnp' },
      'ita': { title: 'Invitation to Apply', description: 'ITA details including invitation date, CRS score at invitation, application submission date, document checklist, and medical examination details.', dataKey: 'ita' },
      'visa-grant': { title: 'Visa Grant', description: 'Final visa approval including grant date, visa type, expiry date, passport submission, COPR details, and landing instructions.', dataKey: 'visaGrant' },
      'post-landing': { title: 'Post Landing Services', description: 'Settlement services including SIN application, bank account setup, health card, job search assistance, and accommodation support.', dataKey: 'postLanding' },
      'remark': { title: 'Remarks', description: 'General remarks and notes about the case progress, client communication, and important observations.', dataKey: 'remark' },
      'conversation': { title: 'Conversation History', description: 'Email conversations including date, conversation type (Walk-in/Inbound/Outbound/Email), conversation details, follow-up remarks, follow-up date, and conversation status.', dataKey: 'conversation' },
      'doc-review-personal': { title: 'Document Review (Personal)', description: 'Personal document review and verification including passport, birth certificate, marriage certificate, and identity documents.', dataKey: 'docReviewPersonal' },
      'doc-review': { title: 'Document Review', description: 'Complete document review including education documents, employment records, financial statements, and all supporting documentation.', dataKey: 'docReview' },
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
              <h1 className="text-2xl font-bold text-gray-900">Skill Canada Operations</h1>
              <p className="text-sm text-gray-600 mt-1">
                Client: {clientName} | Lead ID: {leadId} | Opportunity: {opportunityId}
              </p>
            </div>
            <MapPin className="text-red-600" size={48} />
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
                        ? 'bg-red-600 text-white shadow-md'
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
