'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, FileText, Award, Globe as GlobeIcon, MapPin, TrendingUp, Users as UsersIcon,
  FileEdit, MessageCircle, ChevronRight, ChevronLeft, Save, CheckCircle
} from 'lucide-react';

interface SkillAustraliaOperationsWizardProps {
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

export default function SkillAustraliaOperationsWizard({
  opportunityId,
  leadId,
  clientName
}: SkillAustraliaOperationsWizardProps) {
  const [activeStage, setActiveStage] = useState('personal');
  const [saving, setSaving] = useState(false);

  const [stages, setStages] = useState<OperationsStage[]>([
    { id: 'personal', name: 'Personal Details', icon: User, status: 'current' },
    { id: 'language', name: 'Language Proficiency', icon: FileText, status: 'pending' },
    { id: 'language-spouse', name: 'Language (Spouse)', icon: FileText, status: 'pending' },
    { id: 'skill-assessment', name: 'Skill Assessment', icon: Award, status: 'pending' },
    { id: 'skill-assessment-spouse', name: 'Skill Assessment (Spouse)', icon: Award, status: 'pending' },
    { id: 'eoi', name: 'EOI', icon: GlobeIcon, status: 'pending' },
    { id: 'state-nomination', name: 'State Nomination', icon: MapPin, status: 'pending' },
    { id: 'visa-grant', name: 'Visa Grant', icon: CheckCircle, status: 'pending' },
    { id: 'post-landing', name: 'Post Landing Service', icon: TrendingUp, status: 'pending' },
    { id: 'remark', name: 'Remark', icon: FileEdit, status: 'pending' },
    { id: 'conversation', name: 'Conversation', icon: MessageCircle, status: 'pending' },
  ]);

  const [stageData, setStageData] = useState<Record<string, any>>({});

  const saveStageData = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/operations/skill-australia/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId,
          leadId,
          stage: activeStage,
          data: stageData[activeStage] || {},
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save Skill Australia operations data');
      }
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

  const renderStageContent = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {stages.find(s => s.id === activeStage)?.name}
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            This stage contains detailed forms for {stages.find(s => s.id === activeStage)?.name}.
            Complete all required fields to proceed.
          </p>
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
          <button
            onClick={async () => {
              await saveStageData();
              if (activeStage === stages[stages.length - 1].id) {
                alert('Skill Australia Operations Completed!');
                window.location.href = '/admin/leads';
              } else {
                moveToNextStage();
              }
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium ml-auto"
            disabled={saving}
          >
            {saving ? 'Saving...' : activeStage === stages[stages.length - 1].id ? 'Complete' : 'Continue'}
            <ChevronRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    );
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
              <h1 className="text-2xl font-bold text-gray-900">Skill Australia Operations</h1>
              <p className="text-sm text-gray-600 mt-1">
                Client: {clientName} | Lead ID: {leadId} | Opportunity: {opportunityId}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between overflow-x-auto">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = stage.id === activeStage;

              return (
                <div key={stage.id} className="flex items-center">
                  <button
                    onClick={() => setActiveStage(stage.id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : stage.status === 'completed'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    <span className="text-sm font-medium">{stage.name}</span>
                    {stage.status === 'completed' && <CheckCircle size={14} className="ml-2" />}
                  </button>
                  {index < stages.length - 1 && (
                    <ChevronRight size={16} className="mx-1 text-gray-300" />
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
