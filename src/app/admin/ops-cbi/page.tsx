'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-simple';
import { mapOperationsRowToListItem, searchOperationCases } from '@/lib/operationsClient';
import { 
  Search, 
  Filter, 
  User, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Award,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  TrendingUp,
  Eye,
  Edit,
  Download,
  Upload,
  FileCheck,
  FileX,
  FileQuestion,
  Archive,
  RefreshCw,
  DollarSign,
  Plus,
  Briefcase,
  Users,
  Target,
  BookOpen,
  GraduationCap,
  BriefcaseIcon,
  Plane,
  Hotel,
  ShoppingCart,
  Factory,
  Store,
  Building2,
  Home,
  Car,
  Truck,
  Star,
  Shield,
  Flag,
  Crown,
  Banknote,
  Heart,
  Zap,
  Rocket
} from 'lucide-react';

interface CBIOps {
  id: string;
  leadId: string;
  leadName: string;
  email: string;
  phone: string;
  country: string;
  investmentAmount: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  createdDate: string;
  lastUpdated: string;
  nextFollowUp: string;
  personalInfo: {
    dateOfBirth: string;
    passportNumber: string;
    nationality: string;
    currentLocation: string;
    maritalStatus: string;
    netWorth: string;
    sourceOfFunds: string;
  };
  investmentDetails: {
    program: string;
    investmentType: string;
    minimumInvestment: string;
    processingTime: string;
    residencyRequirement: string;
    familyMembers: number;
  };
  applicationStatus: {
    initialConsultation: string;
    documentCollection: string;
    applicationSubmission: string;
    dueDiligence: string;
    governmentApproval: string;
    investmentTransfer: string;
    residencyPermit: string;
  };
  documents: {
    passport: string;
    policeClearance: string;
    medicalCertificate: string;
    financialProof: string;
    sourceOfFunds: string;
    businessDocuments: string;
    familyDocuments: string;
  };
  milestones: {
    phase: string;
    status: string;
    completedDate?: string;
    dueDate: string;
    notes: string;
  }[];
  financials: {
    serviceFee: number;
    governmentFees: number;
    investmentAmount: number;
    totalCost: number;
    paidAmount: number;
    balanceAmount: number;
    paymentStatus: string;
    nextPaymentDue: string;
  };
  notes: string[];
}

const CBIOps: React.FC = () => {
  const [cbiOps, setCbiOps] = useState<CBIOps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCBIOps = async () => {
      setLoading(true);
      try {
        const rows = await searchOperationCases({ module: 'cbi', search: searchTerm || null, limit: 100 });
        setCbiOps(rows.map((row) => mapOperationsRowToListItem(row)) as unknown as CBIOps[]);
      } catch (error) {
        console.error('Error fetching operations cases:', error);
        setCbiOps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCBIOps();
  }, [searchTerm]);

  const getCountryIcon = (country: string) => {
    switch (country) {
      case 'St. Kitts & Nevis': return <Flag className="h-5 w-5 text-green-500" />;
      case 'Grenada': return <Flag className="h-5 w-5 text-yellow-500" />;
      case 'Dominica': return <Flag className="h-5 w-5 text-red-500" />;
      case 'Antigua & Barbuda': return <Flag className="h-5 w-5 text-blue-500" />;
      case 'St. Lucia': return <Flag className="h-5 w-5 text-purple-500" />;
      case 'Vanuatu': return <Flag className="h-5 w-5 text-orange-500" />;
      case 'Turkey': return <Flag className="h-5 w-5 text-red-600" />;
      case 'Malta': return <Flag className="h-5 w-5 text-gray-500" />;
      default: return <Globe className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'initial_consultation': return <Badge className="bg-blue-100 text-blue-800">Initial Consultation</Badge>;
      case 'document_collection': return <Badge className="bg-yellow-100 text-yellow-800">Document Collection</Badge>;
      case 'application_submission': return <Badge className="bg-orange-100 text-orange-800">Application Submission</Badge>;
      case 'due_diligence': return <Badge className="bg-purple-100 text-purple-800">Due Diligence</Badge>;
      case 'government_approval': return <Badge className="bg-green-100 text-green-800">Government Approval</Badge>;
      case 'investment_transfer': return <Badge className="bg-indigo-100 text-indigo-800">Investment Transfer</Badge>;
      case 'residency_permit': return <Badge className="bg-teal-100 text-teal-800">Residency Permit</Badge>;
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'on_hold': return <Badge className="bg-red-100 text-red-800">On Hold</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{priority}</Badge>;
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <FileCheck className="h-4 w-4 text-green-500" />;
      case 'submitted': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'pending': return <FileQuestion className="h-4 w-4 text-gray-500" />;
      case 'rejected': return <FileX className="h-4 w-4 text-red-500" />;
      case 'not_applicable': return <Shield className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'pending': return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'not_applicable': return <Badge className="bg-blue-100 text-blue-800">N/A</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const filteredCBIOps = cbiOps.filter(op => {
    const matchesSearch = op.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || op.status === selectedStatus;
    const matchesCountry = selectedCountry === 'all' || op.country === selectedCountry;
    const matchesPriority = selectedPriority === 'all' || op.priority === selectedPriority;
    const matchesPhase = selectedPhase === 'all' || op.milestones.some(m => m.phase === selectedPhase);
    
    return matchesSearch && matchesStatus && matchesCountry && matchesPriority && matchesPhase;
  });

  const stats = {
    total: cbiOps.length,
    active: cbiOps.filter(op => !['completed', 'on_hold'].includes(op.status)).length,
    completed: cbiOps.filter(op => op.status === 'completed').length,
    highPriority: cbiOps.filter(op => op.priority === 'high').length,
    totalRevenue: cbiOps.reduce((sum, op) => sum + op.financials.totalCost, 0),
    pendingPayments: cbiOps.filter(op => op.financials.paymentStatus === 'partial').length
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Citizenship by Investment Operations</h1>
            <p className="text-gray-600 mt-2">Manage citizenship by investment applications</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} active cases
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Cases</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.completed / stats.total) * 100).toFixed(1)}% completion rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.highPriority}</div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingPayments} pending payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, country, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="initial_consultation">Initial Consultation</SelectItem>
                    <SelectItem value="document_collection">Document Collection</SelectItem>
                    <SelectItem value="application_submission">Application Submission</SelectItem>
                    <SelectItem value="due_diligence">Due Diligence</SelectItem>
                    <SelectItem value="government_approval">Government Approval</SelectItem>
                    <SelectItem value="investment_transfer">Investment Transfer</SelectItem>
                    <SelectItem value="residency_permit">Residency Permit</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="St. Kitts & Nevis">St. Kitts & Nevis</SelectItem>
                    <SelectItem value="Grenada">Grenada</SelectItem>
                    <SelectItem value="Dominica">Dominica</SelectItem>
                    <SelectItem value="Antigua & Barbuda">Antigua & Barbuda</SelectItem>
                    <SelectItem value="St. Lucia">St. Lucia</SelectItem>
                    <SelectItem value="Vanuatu">Vanuatu</SelectItem>
                    <SelectItem value="Turkey">Turkey</SelectItem>
                    <SelectItem value="Malta">Malta</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredCBIOps.map(cbiOp => (
            <Card key={cbiOp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getCountryIcon(cbiOp.country)}
                    <div>
                      <h3 className="text-lg font-semibold">{cbiOp.leadName}</h3>
                      <p className="text-sm text-gray-600">{cbiOp.country} • {cbiOp.leadId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(cbiOp.priority)}
                    {getStatusBadge(cbiOp.status)}
                    <Badge className="bg-purple-100 text-purple-800">{cbiOp.investmentAmount}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Investment Program</p>
                    <p className="font-medium">{cbiOp.investmentDetails.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Investment Type</p>
                    <p className="font-medium">{cbiOp.investmentDetails.investmentType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Family Members</p>
                    <p className="font-medium">{cbiOp.investmentDetails.familyMembers} members</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{cbiOp.assignedTo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Application Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Initial Consultation</span>
                        {getApplicationStatusBadge(cbiOp.applicationStatus.initialConsultation)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Document Collection</span>
                        {getApplicationStatusBadge(cbiOp.applicationStatus.documentCollection)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Application Submission</span>
                        {getApplicationStatusBadge(cbiOp.applicationStatus.applicationSubmission)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Due Diligence</span>
                        {getApplicationStatusBadge(cbiOp.applicationStatus.dueDiligence)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Documents</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Passport</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(cbiOp.documents.passport)}
                          <span className="text-xs capitalize">{cbiOp.documents.passport}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Police Clearance</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(cbiOp.documents.policeClearance)}
                          <span className="text-xs capitalize">{cbiOp.documents.policeClearance}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Financial Proof</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(cbiOp.documents.financialProof)}
                          <span className="text-xs capitalize">{cbiOp.documents.financialProof}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Source of Funds</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(cbiOp.documents.sourceOfFunds)}
                          <span className="text-xs capitalize">{cbiOp.documents.sourceOfFunds.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Financial Information</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Service Fee</span>
                        <span className="text-sm font-medium">${cbiOp.financials.serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Government Fees</span>
                        <span className="text-sm font-medium">${cbiOp.financials.governmentFees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Investment Amount</span>
                        <span className="text-sm font-medium">${cbiOp.financials.investmentAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payment Status</span>
                        <Badge className={cbiOp.financials.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {cbiOp.financials.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Milestone</p>
                    <div className="space-y-2">
                      {cbiOp.milestones
                        .filter(m => m.status === 'in_progress')
                        .map(milestone => (
                          <div key={milestone.phase} className="bg-yellow-50 p-2 rounded">
                            <p className="text-sm font-medium">{milestone.phase}</p>
                            <p className="text-xs text-gray-600">Due: {milestone.dueDate}</p>
                          </div>
                        ))}
                      {cbiOp.milestones.every(m => m.status !== 'in_progress') && (
                        <p className="text-sm text-gray-500">No active milestones</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {cbiOp.createdDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {cbiOp.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCBIOps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default CBIOps;


