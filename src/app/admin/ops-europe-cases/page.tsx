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
  Dna,
  Linkedin,
  Send,
  MessageSquare,
  UserCheck,
  UserX,
  FileText as FileIcon,
  File,
  PenTool,
  CheckSquare,
  Euro,
  Languages,
  Scale,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface EuropeCasesOps {
  id: string;
  leadId: string;
  leadName: string;
  email: string;
  phone: string;
  caseType: string;
  targetCountry: string;
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
    languages: string[];
  };
  caseDetails: {
    category: string;
    subCategory: string;
    investmentAmount: string;
    businessType: string;
    position: string;
    salary: string;
    institution: string;
    program: string;
    duration: string;
  };
  applicationStatus: {
    initialConsultation: string;
    documentCollection: string;
    applicationSubmission: string;
    governmentReview: string;
    approval: string;
    visaIssuance: string;
    relocation: string;
  };
  documents: {
    passport: string;
    educationalCertificates: string;
    financialDocuments: string;
    businessPlan: string;
    medicalCertificate: string;
    policeClearance: string;
    languageTest: string;
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
    processingFees: number;
    totalCost: number;
    paidAmount: number;
    balanceAmount: number;
    paymentStatus: string;
    nextPaymentDue: string;
  };
  notes: string[];
}

const EuropeCasesOps: React.FC = () => {
  const [europeCasesOps, setEuropeCasesOps] = useState<EuropeCasesOps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchEuropeCasesOps = async () => {
      setLoading(true);
      try {
        const rows = await searchOperationCases({ module: 'europe-cases', search: searchTerm || null, limit: 100 });
        setEuropeCasesOps(rows.map((row) => mapOperationsRowToListItem(row)) as unknown as EuropeCasesOps[]);
      } catch (error) {
        console.error('Error fetching operations cases:', error);
        setEuropeCasesOps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEuropeCasesOps();
  }, [searchTerm]);

  const getCaseTypeIcon = (caseType: string) => {
    switch (caseType) {
      case 'Business Immigration': return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'Student Visa': return <GraduationCap className="h-5 w-5 text-green-500" />;
      case 'Work Permit': return <Users className="h-5 w-5 text-orange-500" />;
      case 'Family Reunification': return <Heart className="h-5 w-5 text-red-500" />;
      case 'Investment Visa': return <DollarSign className="h-5 w-5 text-purple-500" />;
      case 'Research Visa': return <Microscope className="h-5 w-5 text-indigo-500" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'initial_consultation': return <Badge className="bg-blue-100 text-blue-800">Initial Consultation</Badge>;
      case 'document_collection': return <Badge className="bg-yellow-100 text-yellow-800">Document Collection</Badge>;
      case 'application_submission': return <Badge className="bg-orange-100 text-orange-800">Application Submission</Badge>;
      case 'government_review': return <Badge className="bg-purple-100 text-purple-800">Government Review</Badge>;
      case 'approval': return <Badge className="bg-green-100 text-green-800">Approval</Badge>;
      case 'visa_issuance': return <Badge className="bg-indigo-100 text-indigo-800">Visa Issuance</Badge>;
      case 'relocation': return <Badge className="bg-teal-100 text-teal-800">Relocation</Badge>;
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
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getCountryIcon = (country: string) => {
    switch (country) {
      case 'Germany': return <Flag className="h-5 w-5 text-black" />;
      case 'France': return <Flag className="h-5 w-5 text-blue-600" />;
      case 'Italy': return <Flag className="h-5 w-5 text-green-600" />;
      case 'Spain': return <Flag className="h-5 w-5 text-red-600" />;
      case 'Netherlands': return <Flag className="h-5 w-5 text-orange-600" />;
      case 'Sweden': return <Flag className="h-5 w-5 text-blue-500" />;
      default: return <Globe className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredEuropeCasesOps = europeCasesOps.filter(op => {
    const matchesSearch = op.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || op.status === selectedStatus;
    const matchesCountry = selectedCountry === 'all' || op.targetCountry === selectedCountry;
    const matchesCategory = selectedCategory === 'all' || op.caseDetails.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || op.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesCountry && matchesCategory && matchesPriority;
  });

  const stats = {
    total: europeCasesOps.length,
    active: europeCasesOps.filter(op => !['completed', 'on_hold'].includes(op.status)).length,
    completed: europeCasesOps.filter(op => op.status === 'completed').length,
    highPriority: europeCasesOps.filter(op => op.priority === 'high').length,
    totalRevenue: europeCasesOps.reduce((sum, op) => sum + op.financials.totalCost, 0),
    pendingPayments: europeCasesOps.filter(op => op.financials.paymentStatus === 'partial').length
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
            <h1 className="text-3xl font-bold text-gray-900">Europe Cases Operations</h1>
            <p className="text-gray-600 mt-2">Manage European immigration and visa cases</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
              <FileIcon className="h-4 w-4 text-muted-foreground" />
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
                {((stats.completed / stats.total) * 100).toFixed(1)}% success rate
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
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{stats.totalRevenue.toLocaleString()}</div>
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
                    placeholder="Search by name, case type, or ID..."
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
                    <SelectItem value="government_review">Government Review</SelectItem>
                    <SelectItem value="approval">Approval</SelectItem>
                    <SelectItem value="visa_issuance">Visa Issuance</SelectItem>
                    <SelectItem value="relocation">Relocation</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                    <SelectItem value="Sweden">Sweden</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Business Immigration">Business Immigration</SelectItem>
                    <SelectItem value="Student Visa">Student Visa</SelectItem>
                    <SelectItem value="Work Permit">Work Permit</SelectItem>
                    <SelectItem value="Family Reunification">Family Reunification</SelectItem>
                    <SelectItem value="Investment Visa">Investment Visa</SelectItem>
                    <SelectItem value="Research Visa">Research Visa</SelectItem>
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

        {/* Cases List */}
        <div className="space-y-4">
          {filteredEuropeCasesOps.map(europeOp => (
            <Card key={europeOp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getCaseTypeIcon(europeOp.caseType)}
                    <div>
                      <h3 className="text-lg font-semibold">{europeOp.leadName}</h3>
                      <p className="text-sm text-gray-600">{europeOp.caseType} • {europeOp.leadId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(europeOp.priority)}
                    {getStatusBadge(europeOp.status)}
                    <div className="flex items-center space-x-1">
                      {getCountryIcon(europeOp.targetCountry)}
                      <Badge className="bg-blue-100 text-blue-800">{europeOp.targetCountry}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Sub-Category</p>
                    <p className="font-medium">{europeOp.caseDetails.subCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Education</p>
                    <p className="font-medium">{europeOp.personalInfo.education}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {europeOp.personalInfo.languages.slice(0, 2).map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                      {europeOp.personalInfo.languages.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{europeOp.personalInfo.languages.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{europeOp.assignedTo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Application Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Initial Consultation</span>
                        {getApplicationStatusBadge(europeOp.applicationStatus.initialConsultation)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Document Collection</span>
                        {getApplicationStatusBadge(europeOp.applicationStatus.documentCollection)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Application Submission</span>
                        {getApplicationStatusBadge(europeOp.applicationStatus.applicationSubmission)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Government Review</span>
                        {getApplicationStatusBadge(europeOp.applicationStatus.governmentReview)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Documents</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Passport</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(europeOp.documents.passport)}
                          <span className="text-xs capitalize">{europeOp.documents.passport}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Educational Certificates</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(europeOp.documents.educationalCertificates)}
                          <span className="text-xs capitalize">{europeOp.documents.educationalCertificates}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Financial Documents</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(europeOp.documents.financialDocuments)}
                          <span className="text-xs capitalize">{europeOp.documents.financialDocuments}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Language Test</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(europeOp.documents.languageTest)}
                          <span className="text-xs capitalize">{europeOp.documents.languageTest}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Case Details</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Program</span>
                        <span className="text-sm font-medium">{europeOp.caseDetails.program}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Duration</span>
                        <span className="text-sm font-medium">{europeOp.caseDetails.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Investment</span>
                        <span className="text-sm font-medium">{europeOp.caseDetails.investmentAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Position</span>
                        <span className="text-sm font-medium">{europeOp.caseDetails.position}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Milestone</p>
                    <div className="space-y-2">
                      {europeOp.milestones
                        .filter(m => m.status === 'in_progress')
                        .map(milestone => (
                          <div key={milestone.phase} className="bg-yellow-50 p-2 rounded">
                            <p className="text-sm font-medium">{milestone.phase}</p>
                            <p className="text-xs text-gray-600">Due: {milestone.dueDate}</p>
                          </div>
                        ))}
                      {europeOp.milestones.every(m => m.status !== 'in_progress') && (
                        <p className="text-sm text-gray-500">No active milestones</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {europeOp.createdDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {europeOp.lastUpdated}</span>
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

        {filteredEuropeCasesOps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default EuropeCasesOps;


