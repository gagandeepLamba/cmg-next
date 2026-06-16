'use client';

import { useState } from 'react';
import {
  FileText, Download, Plus, Edit, Trash2, Eye, Save, Printer,
  Calculator, DollarSign, Package, User, Calendar, Settings,
  CheckCircle, Clock, AlertCircle, TrendingUp, Filter
} from 'lucide-react';

interface AgreementProduct {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  sku?: string;
  discount?: number;
}

interface AgreementParty {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  contactPerson?: string;
}

interface Agreement {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'pending' | 'signed' | 'expired' | 'cancelled';
  client: AgreementParty;
  products: AgreementProduct[];
  pricing: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    currency: string;
    taxRate: number;
    discountRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default function AgreementGenerator() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'generator' | 'templates' | 'history'>('generator');

  useState(() => {
    setAgreements([]);
  });

  const generatePDF = async (agreementId: string) => {
    setLoading(true);
    try {
      // In a real implementation, this would call the PDF generation API
      console.log('Generating PDF for agreement:', agreementId);
      
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const link = document.createElement('a');
      link.href = '/api/agreements/pdf?id=' + agreementId;
      link.download = `agreement-${agreementId}.pdf`;
      link.click();
      
      alert('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'signed': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agreement Generator</h2>
            <p className="text-gray-600 mt-1">Create and manage agreements with PDF export</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowGenerator(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Agreement
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('generator')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'generator'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Generator
              </div>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Templates
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                History
              </div>
            </button>
          </nav>
        </div>

        {/* Generator Tab */}
        {activeTab === 'generator' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowGenerator(true)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Agreement
                  </button>
                  
                  <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <FileText className="w-4 h-4 mr-2" />
                    Use Template
                  </button>
                  
                  <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Calculator className="w-4 h-4 mr-2" />
                    Price Calculator
                  </button>
                </div>

                {/* Statistics */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm text-gray-700">Total Agreements</span>
                      </div>
                      <span className="text-lg font-semibold text-blue-600">{agreements.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm text-gray-700">Signed</span>
                      </div>
                      <span className="text-lg font-semibold text-green-600">
                        {agreements.filter(a => a.status === 'signed').length}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-gray-700">Pending</span>
                      </div>
                      <span className="text-lg font-semibold text-yellow-600">
                        {agreements.filter(a => a.status === 'pending').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Agreements */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Agreements</h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {agreements.slice(0, 5).map((agreement) => (
                    <div key={agreement.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">{agreement.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(agreement.status)}`}>
                              {agreement.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{agreement.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {agreement.client.name}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {agreement.createdAt.toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {formatCurrency(agreement.pricing.total)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => setSelectedAgreement(agreement)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => generatePDF(agreement.id)}
                            disabled={loading}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'service-agreement',
                  name: 'Service Agreement',
                  description: 'Standard service agreement template',
                  category: 'Service',
                  icon: <FileText className="w-8 h-8 text-blue-600" />
                },
                {
                  id: 'product-sale',
                  name: 'Product Sale Agreement',
                  description: 'Product sale agreement template',
                  category: 'Product',
                  icon: <Package className="w-8 h-8 text-green-600" />
                },
                {
                  id: 'consulting',
                  name: 'Consulting Agreement',
                  description: 'Consulting services agreement',
                  category: 'Consulting',
                  icon: <User className="w-8 h-8 text-purple-600" />
                }
              ].map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    {template.icon}
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      Use Template
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agreement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agreements.map((agreement) => (
                    <tr key={agreement.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{agreement.title}</div>
                          <div className="text-sm text-gray-500">{agreement.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agreement.client.name}</div>
                        <div className="text-sm text-gray-500">{agreement.client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(agreement.status)}`}>
                          {agreement.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(agreement.pricing.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agreement.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedAgreement(agreement)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => generatePDF(agreement.id)}
                            disabled={loading}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Agreement Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Agreement</h3>
                <button
                  onClick={() => setShowGenerator(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter agreement title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>Service Agreement</option>
                        <option>Product Sale Agreement</option>
                        <option>Consulting Agreement</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Client Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Products & Services</h4>
                  <div className="border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-2">
                            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded" placeholder="Product name" />
                          </td>
                          <td className="px-4 py-2">
                            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded" placeholder="Description" />
                          </td>
                          <td className="px-4 py-2">
                            <input type="number" className="w-full px-2 py-1 border border-gray-300 rounded" placeholder="1" />
                          </td>
                          <td className="px-4 py-2">
                            <input type="number" className="w-full px-2 py-1 border border-gray-300 rounded" placeholder="0.00" />
                          </td>
                          <td className="px-4 py-2">
                            <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50" readOnly placeholder="0.00" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button className="mt-2 flex items-center text-blue-600 hover:text-blue-800">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Product
                  </button>
                </div>

                {/* Pricing */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Pricing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>AED</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowGenerator(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Generate agreement logic here
                  setShowGenerator(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Agreement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
