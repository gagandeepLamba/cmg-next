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
  Rocket,
  Building,
  MapPinIcon,
  Lightbulb,
  Brain,
  Cpu,
  Microscope,
  Dna
} from 'lucide-react';

interface EIPCanadaOps {
  id: string;
  leadId: string;
  leadName: string;
  email: string;
  phone: string;
  businessIdea: string;
  category: string;
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
    education: string;
  };
  businessProposal: {
    title: string;
    description: string;
    innovationType: string;
    marketPotential: string;
    competitiveAdvantage: string;
    scalability: string;
    investmentRequired: string;
    projectedRevenue: string;
    timeline: string;
  };
  applicationStatus: {
    initialConsultation: string;
    proposalReview: string;
    documentCollection: string;
    applicationSubmission: string;
    governmentReview: string;
    approval: string;
    startupVisa: string;
    prApplication: string;
  };
  documents: {
    businessProposal: string;
    financialProjections: string;
    marketResearch: string;
    educationalCertificates: string;
    languageTest: string;
    supportLetter: string;
    pitchDeck: string;
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
    applicationFees: number;
    totalCost: number;
    paidAmount: number;
    balanceAmount: number;
    paymentStatus: string;
    nextPaymentDue: string;
  };
  notes: string[];
}

const EIPCanadaOps: React.FC = () => {
  const [eipCanadaOps, setEIPCanadaOps] = useState<EIPCanadaOps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchEIPCanadaOps = async () => {
      setLoading(true);
      try {
        const rows = await searchOperationCases({ module: 'eip-canada', search: searchTerm || null, limit: 100 });
        setEIPCanadaOps(rows.map((row) => mapOperationsRowToListItem(row)) as unknown as EIPCanadaOps[]);
      } catch (error) {
        console.error('Error fetching operations cases:', error);
        setEIPCanadaOps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEIPCanadaOps();
  }, [searchTerm]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health Technology': return <Microscope className="h-5 w-5 text-red-500" />;
      case 'Clean Technology': return <Zap className="h-5 w-5 text-green-500" />;
      case 'Education Technology': return <GraduationCap className="h-5 w-5 text-blue-500" />;
      case 'Artificial Intelligence': return <Brain className="h-5 w-5 text-purple-500" />;
      case 'Biotechnology': return <Dna className="h-5 w-5 text-pink-500" />;
      case 'Software Technology': return <Cpu className="h-5 w-5 text-indigo-500" />;
      default: return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'initial_consultation': return <Badge className="bg-blue-100 text-blue-800">Initial Consultation</Badge>;
      case 'proposal_review': return <Badge className="bg-yellow-100 text-yellow-800">Proposal Review</Badge>;
      case 'document_collection': return <Badge className="bg-orange-100 text-orange-800">Document Collection</Badge>;
      case 'application_submission': return <Badge className="bg-purple-100 text-purple-800">Application Submission</Badge>;
      case 'government_review': return <Badge className="bg-green-100 text-green-800">Government Review</Badge>;
      case 'approval': return <Badge className="bg-indigo-100 text-indigo-800">Approval</Badge>;
      case 'startup_visa': return <Badge className="bg-teal-100 text-teal-800">Startup Visa</Badge>;
      case 'pr_application': return <Badge className="bg-pink-100 text-pink-800">PR Application</Badge>;
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
      case 'under_review': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'pending': return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const filteredEIPCanadaOps = eipCanadaOps.filter(op => {
    const matchesSearch = op.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.businessIdea.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || op.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || op.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || op.priority === selectedPriority;
    const matchesPhase = selectedPhase === 'all' || op.milestones.some(m => m.phase === selectedPhase);
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesPhase;
  });

  const stats = {
    total: eipCanadaOps.length,
    active: eipCanadaOps.filter(op => !['completed', 'on_hold'].includes(op.status)).length,
    completed: eipCanadaOps.filter(op => op.status === 'completed').length,
    highPriority: eipCanadaOps.filter(op => op.priority === 'high').length,
    totalRevenue: eipCanadaOps.reduce((sum, op) => sum + op.financials.totalCost, 0),
    pendingPayments: eipCanadaOps.filter(op => op.financials.paymentStatus === 'partial').length
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
            <h1 className="text-3xl font-bold text-gray-900">Canada Start-up Visa Operations</h1>
            <p className="text-gray-600 mt-2">Manage Canada Start-up Visa Program applications</p>
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
              <Rocket className="h-4 w-4 text-muted-foreground" />
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
              <DollarSign className="h-4 w-4 text-muted-foreground" />
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
                    placeholder="Search by name, business idea, or ID..."
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
                    <SelectItem value="proposal_review">Proposal Review</SelectItem>
                    <SelectItem value="document_collection">Document Collection</SelectItem>
                    <SelectItem value="application_submission">Application Submission</SelectItem>
                    <SelectItem value="government_review">Government Review</SelectItem>
                    <SelectItem value="approval">Approval</SelectItem>
                    <SelectItem value="startup_visa">Startup Visa</SelectItem>
                    <SelectItem value="pr_application">PR Application</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Health Technology">Health Technology</SelectItem>
                    <SelectItem value="Clean Technology">Clean Technology</SelectItem>
                    <SelectItem value="Education Technology">Education Technology</SelectItem>
                    <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                    <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                    <SelectItem value="Software Technology">Software Technology</SelectItem>
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
          {filteredEIPCanadaOps.map(eipOp => (
            <Card key={eipOp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(eipOp.category)}
                    <div>
                      <h3 className="text-lg font-semibold">{eipOp.leadName}</h3>
                      <p className="text-sm text-gray-600">{eipOp.businessIdea} • {eipOp.leadId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(eipOp.priority)}
                    {getStatusBadge(eipOp.status)}
                    <Badge className="bg-blue-100 text-blue-800">{eipOp.category}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Business Title</p>
                    <p className="font-medium">{eipOp.businessProposal.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Investment Required</p>
                    <p className="font-medium">{eipOp.businessProposal.investmentRequired}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Education</p>
                    <p className="font-medium">{eipOp.personalInfo.education}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{eipOp.assignedTo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Application Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Initial Consultation</span>
                        {getApplicationStatusBadge(eipOp.applicationStatus.initialConsultation)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Proposal Review</span>
                        {getApplicationStatusBadge(eipOp.applicationStatus.proposalReview)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Application Submission</span>
                        {getApplicationStatusBadge(eipOp.applicationStatus.applicationSubmission)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Government Review</span>
                        {getApplicationStatusBadge(eipOp.applicationStatus.governmentReview)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Documents</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Business Proposal</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(eipOp.documents.businessProposal)}
                          <span className="text-xs capitalize">{eipOp.documents.businessProposal}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Financial Projections</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(eipOp.documents.financialProjections)}
                          <span className="text-xs capitalize">{eipOp.documents.financialProjections}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Support Letter</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(eipOp.documents.supportLetter)}
                          <span className="text-xs capitalize">{eipOp.documents.supportLetter}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pitch Deck</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(eipOp.documents.pitchDeck)}
                          <span className="text-xs capitalize">{eipOp.documents.pitchDeck}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Business Details</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Innovation Type</span>
                        <span className="text-sm font-medium">{eipOp.businessProposal.innovationType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Market Potential</span>
                        <span className="text-sm font-medium truncate" title={eipOp.businessProposal.marketPotential}>
                          {eipOp.businessProposal.marketPotential}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Timeline</span>
                        <span className="text-sm font-medium">{eipOp.businessProposal.timeline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Projected Revenue</span>
                        <span className="text-sm font-medium">{eipOp.businessProposal.projectedRevenue}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Milestone</p>
                    <div className="space-y-2">
                      {eipOp.milestones
                        .filter(m => m.status === 'in_progress')
                        .map(milestone => (
                          <div key={milestone.phase} className="bg-yellow-50 p-2 rounded">
                            <p className="text-sm font-medium">{milestone.phase}</p>
                            <p className="text-xs text-gray-600">Due: {milestone.dueDate}</p>
                          </div>
                        ))}
                      {eipOp.milestones.every(m => m.status !== 'in_progress') && (
                        <p className="text-sm text-gray-500">No active milestones</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {eipOp.createdDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {eipOp.lastUpdated}</span>
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

        {filteredEIPCanadaOps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default EIPCanadaOps;


