'use client';

import { useState, useEffect } from 'react';
import {
  Package, Users, FileText, FileCheck, DollarSign, Eye,
  Edit, Plus, Search, Download, Upload, Filter,
  ChevronRight, ChevronLeft, Calendar, MapPin, Briefcase
} from 'lucide-react';

interface Batch {
  id: number;
  batchName: string;
  createdDate: string;
  vendorId: number;
  vendorName: string;
  totalCases: number;
  stage1Verified: number;
  stage2Verified: number;
  stage3Verified: number;
  accountVerified: number;
  opsVerified: number;
  rejectedCases: number;
  status: 'active' | 'completed' | 'hold';
}

interface Case {
  id: number;
  batchId: number;
  leadId: number;
  clientName: string;
  country: string;
  agreementNumber: string;
  nationality: string;
  passportNumber: string;
  stage1Complete: boolean;
  stage2Complete: boolean;
  stage3Complete: boolean;
  accountVerified: boolean;
  opsVerified: boolean;
  rejected: boolean;
  rejectionReason?: string;
}

export default function EuropeBatchesPage() {
  const [activeTab, setActiveTab] = useState<'batches' | 'cases'>('batches');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const databaseBatches: Batch[] = []

      const databaseCases: Case[] = []

      setBatches([]);
      setCases([]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || batch.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredCases = cases.filter(c => {
    if (selectedBatch && c.batchId !== selectedBatch) return false;
    return c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           c.agreementNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (batch: Batch) => {
    // Calculate average progress across all stages
    const totalPossible = batch.totalCases * 3; // 3 stages per case
    const totalCompleted = batch.stage1Verified + batch.stage2Verified + batch.stage3Verified;
    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Europe Cases Management</h1>
        <p className="text-gray-600">Manage batches, vendors, and case progress for European visa applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Batches</p>
              <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900">{cases.filter(c => !c.rejected).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(batches.map(b => b.vendorId)).size}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <FileCheck className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected Cases</p>
              <p className="text-2xl font-bold text-gray-900">{cases.filter(c => c.rejected).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'batches'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('batches')}
        >
          <div className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Batches ({batches.length})
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'cases'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('cases')}
        >
          <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Cases ({cases.length})
          </div>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search batches or cases..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {activeTab === 'batches' && (
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="hold">Hold</option>
          </select>
        )}

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          New Batch
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : activeTab === 'batches' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cases</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{batch.batchName}</div>
                    <div className="text-sm text-gray-500">ID: {batch.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-gray-400" />
                      <span>{batch.vendorName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(batch.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.totalCases} cases
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${getProgressPercentage(batch)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{getProgressPercentage(batch)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                      {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => {
                        setSelectedBatch(batch.id);
                        setActiveTab('cases');
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedBatch && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Cases in Batch #{selectedBatch}
                </h3>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => setSelectedBatch(null)}
                >
                  View All Batches
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">Total Cases</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {filteredCases.length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">Stage 1 Complete</p>
                  <p className="text-2xl font-bold text-green-900">
                    {filteredCases.filter(c => c.stage1Complete).length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">Stage 2 Complete</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {filteredCases.filter(c => c.stage2Complete).length}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-800">Stage 3 Complete</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {filteredCases.filter(c => c.stage3Complete).length}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agreement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stages</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{c.clientName}</div>
                      <div className="text-sm text-gray-500">ID: {c.leadId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                        {c.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {c.agreementNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {c.passportNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <div className={`h-2 w-2 rounded-full ${c.stage1Complete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`h-2 w-2 rounded-full ${c.stage2Complete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`h-2 w-2 rounded-full ${c.stage3Complete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {c.stage1Complete ? 'S1' : ''} {c.stage2Complete ? 'S2' : ''} {c.stage3Complete ? 'S3' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {c.rejected ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Rejected
                        </span>
                      ) : c.opsVerified ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          In Progress
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

