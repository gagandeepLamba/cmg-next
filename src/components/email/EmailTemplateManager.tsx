'use client';

import { useState, useEffect } from 'react';
import {
  Mail, Plus, Edit, Trash2, Eye, Send, Filter, Search,
  FileText, Users, BarChart3, Clock, CheckCircle, AlertCircle,
  TrendingUp, Download, Copy, Play, Pause, Settings,
  Calendar, Globe, Tag, Star, MoreVertical
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  subject: string;
  status: string;
  metadata: {
    createdAt: string;
    usageCount: number;
    lastUsed?: string;
  };
  tags: string[];
}

interface EmailCampaign {
  id: string;
  name: string;
  description: string;
  templateName: string;
  status: string;
  recipients: any[];
  scheduledFor?: string;
  sentAt?: string;
  performance: {
    totalRecipients: number;
    sentCount: number;
    deliveredCount: number;
    openedCount: number;
    clickedCount: number;
    openRate: number;
    clickRate: number;
  };
}

interface EmailRecipient {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  company?: string;
  status: string;
  tags: string[];
  metadata: {
    totalEmails: number;
    openedCount: number;
    clickedCount: number;
  };
}

export default function EmailTemplateManager() {
  const [activeTab, setActiveTab] = useState<'templates' | 'campaigns' | 'recipients' | 'analytics'>('templates');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setTemplates([]);
    setCampaigns([]);
    setRecipients([]);
  }, []);

  const handleSendCampaign = async (campaignId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update campaign status
      setCampaigns(prev => prev.map(c => 
        c.id === campaignId 
          ? { ...c, status: 'sending' }
          : c
      ));
      
      // After some time, mark as sent
      setTimeout(() => {
        setCampaigns(prev => prev.map(c => 
          c.id === campaignId 
            ? { 
                ...c, 
                status: 'sent',
                sentAt: new Date().toISOString(),
                performance: {
                  ...c.performance,
                  sentCount: c.performance.totalRecipients,
                  deliveredCount: Math.floor(c.performance.totalRecipients * 0.94),
                  openedCount: Math.floor(c.performance.totalRecipients * 0.47),
                  clickedCount: Math.floor(c.performance.totalRecipients * 0.09)
                }
              }
            : c
        ));
      }, 3000);
      
    } catch (error) {
      console.error('Error sending campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }
    
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const duplicatedTemplate: EmailTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      metadata: {
        ...template.metadata,
        createdAt: new Date().toISOString(),
        usageCount: 0,
        lastUsed: undefined
      }
    };
    
    setTemplates(prev => [...prev, duplicatedTemplate]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'sending': return 'text-yellow-600 bg-yellow-100';
      case 'scheduled': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'marketing': return 'text-blue-600 bg-blue-100';
      case 'transactional': return 'text-green-600 bg-green-100';
      case 'notification': return 'text-yellow-600 bg-yellow-100';
      case 'newsletter': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || template.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const statistics = {
    totalTemplates: templates.length,
    activeTemplates: templates.filter(t => t.status === 'active').length,
    totalCampaigns: campaigns.length,
    sentCampaigns: campaigns.filter(c => c.status === 'sent').length,
    totalRecipients: recipients.length,
    activeRecipients: recipients.filter(r => r.status === 'active').length,
    totalEmailsSent: campaigns.reduce((sum, c) => sum + c.performance.sentCount, 0),
    averageOpenRate: campaigns.length > 0 ? 
      campaigns.reduce((sum, c) => sum + c.performance.openRate, 0) / campaigns.length : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Email Template System</h2>
            <p className="text-gray-600 mt-1">Create, manage, and send email templates to bulk users</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </button>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              New Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalTemplates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Templates</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.activeTemplates}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalCampaigns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Recipients</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalRecipients}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Templates
              </div>
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'campaigns'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Campaigns
              </div>
            </button>
            <button
              onClick={() => setActiveTab('recipients')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recipients'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Recipients
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </div>
            </button>
          </nav>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="marketing">Marketing</option>
                  <option value="transactional">Transactional</option>
                  <option value="notification">Notification</option>
                  <option value="newsletter">Newsletter</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(template.status)}`}>
                          {template.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>Subject:</strong> {template.subject}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateTemplate(template)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span>Created: {new Date(template.metadata.createdAt).toLocaleDateString()}</span>
                      <span>Used: {template.metadata.usageCount} times</span>
                    </div>
                    {template.metadata.lastUsed && (
                      <div className="mt-1">
                        <span>Last used: {new Date(template.metadata.lastUsed).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipients</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">{campaign.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.templateName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.performance.totalRecipients.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>Open: {campaign.performance.openRate.toFixed(1)}%</div>
                          <div>Click: {campaign.performance.clickRate.toFixed(1)}%</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          {campaign.status === 'draft' && (
                            <button className="text-green-600 hover:text-green-800">
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          {campaign.status === 'sending' && (
                            <button className="text-yellow-600 hover:text-yellow-800">
                              <Pause className="w-4 h-4" />
                            </button>
                          )}
                          <button className="text-gray-600 hover:text-gray-800">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recipients Tab */}
        {activeTab === 'recipients' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search recipients..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button
                  onClick={() => setShowRecipientModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Recipient
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipients.map((recipient) => (
                <div key={recipient.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{recipient.fullName}</h3>
                      <p className="text-sm text-gray-600 mb-1">{recipient.email}</p>
                      {recipient.company && (
                        <p className="text-sm text-gray-500 mb-2">{recipient.company}</p>
                      )}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(recipient.status)}`}>
                          {recipient.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
                    <div className="flex justify-between mb-2">
                      <span>Total Emails: {recipient.metadata.totalEmails}</span>
                      <span>Opened: {recipient.metadata.openedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clicked: {recipient.metadata.clickedCount}</span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {recipient.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Emails Sent</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.totalEmailsSent.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Open Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.averageOpenRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Sent Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.sentCampaigns}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Users className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Recipients</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.activeRecipients}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-md font-medium text-gray-900">{campaign.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Recipients:</span>
                        <span className="font-medium text-gray-900 ml-1">{campaign.performance.totalRecipients}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sent:</span>
                        <span className="font-medium text-gray-900 ml-1">{campaign.performance.sentCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Opened:</span>
                        <span className="font-medium text-green-600 ml-1">{campaign.performance.openedCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Clicked:</span>
                        <span className="font-medium text-blue-600 ml-1">{campaign.performance.clickedCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
