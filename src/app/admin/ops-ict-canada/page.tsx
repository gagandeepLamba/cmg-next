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
  MapPinIcon
} from 'lucide-react';

interface ICTCanadaOps {
  id: string;
  leadId: string;
  leadName: string;
  email: string;
  phone: string;
  position: string;
  company: string;
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
  };
  employmentInfo: {
    currentPosition: string;
    yearsWithCompany: number;
    totalExperience: number;
    annualSalary: string;
    companyIndustry: string;
    companySize: string;
  };
  canadianCompany: {
    companyName: string;
    businessNumber: string;
    industry: string;
    location: string;
    positionOffered: string;
    salaryOffered: string;
    jobOfferDate: string;
  };
  applicationStatus: {
    initialConsultation: string;
    documentCollection: string;
    lmiaApplication: string;
    lmiaApproval: string;
    workPermitApplication: string;
    medicalExam: string;
    biometrics: string;
    workPermitIssued: string;
  };
  documents: {
    passport: string;
    jobOfferLetter: string;
    educationalCertificates: string;
    workExperience: string;
    lmiaApproval: string;
    medicalCertificate: string;
    biometrics: string;
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
    lmiaFee: number;
    totalCost: number;
    paidAmount: number;
    balanceAmount: number;
    paymentStatus: string;
    nextPaymentDue: string;
  };
  notes: string[];
}

const ICTCanadaOps: React.FC = () => {
  const [ictCanadaOps, setICTCanadaOps] = useState<ICTCanadaOps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchICTCanadaOps = async () => {
      setLoading(true);
      try {
        const rows = await searchOperationCases({ module: 'ict-canada', search: searchTerm || null, limit: 100 });
        setICTCanadaOps(rows.map((row) => mapOperationsRowToListItem(row)) as unknown as ICTCanadaOps[]);
      } catch (error) {
        console.error('Error fetching operations cases:', error);
        setICTCanadaOps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchICTCanadaOps();
  }, [searchTerm]);

  const getPositionIcon = (position: string) => {
    if (position.toLowerCase().includes('software') || position.toLowerCase().includes('developer')) {
      return <BriefcaseIcon className="h-5 w-5 text-blue-500" />;
    } else if (position.toLowerCase().includes('marketing')) {
      return <Target className="h-5 w-5 text-purple-500" />;
    } else if (position.toLowerCase().includes('financial') || position.toLowerCase().includes('analyst')) {
      return <DollarSign className="h-5 w-5 text-green-500" />;
    } else if (position.toLowerCase().includes('manager')) {
      return <Users className="h-5 w-5 text-orange-500" />;
    } else {
      return <Briefcase className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'initial_consultation': return <Badge className="bg-blue-100 text-blue-800">Initial Consultation</Badge>;
      case 'document_collection': return <Badge className="bg-yellow-100 text-yellow-800">Document Collection</Badge>;
      case 'lmia_application': return <Badge className="bg-orange-100 text-orange-800">LMIA Application</Badge>;
      case 'lmia_approval': return <Badge className="bg-purple-100 text-purple-800">LMIA Approval</Badge>;
      case 'work_permit_application': return <Badge className="bg-green-100 text-green-800">Work Permit Application</Badge>;
      case 'medical_exam': return <Badge className="bg-indigo-100 text-indigo-800">Medical Exam</Badge>;
      case 'biometrics': return <Badge className="bg-teal-100 text-teal-800">Biometrics</Badge>;
      case 'work_permit_issued': return <Badge className="bg-green-100 text-green-800">Work Permit Issued</Badge>;
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

  const filteredICTCanadaOps = ictCanadaOps.filter(op => {
    const matchesSearch = op.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || op.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || op.priority === selectedPriority;
    const matchesPhase = selectedPhase === 'all' || op.milestones.some(m => m.phase === selectedPhase);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesPhase;
  });

  const stats = {
    total: ictCanadaOps.length,
    active: ictCanadaOps.filter(op => !['completed', 'on_hold'].includes(op.status)).length,
    completed: ictCanadaOps.filter(op => op.status === 'completed').length,
    highPriority: ictCanadaOps.filter(op => op.priority === 'high').length,
    totalRevenue: ictCanadaOps.reduce((sum, op) => sum + op.financials.totalCost, 0),
    pendingPayments: ictCanadaOps.filter(op => op.financials.paymentStatus === 'partial').length
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
            <h1 className="text-3xl font-bold text-gray-900">ICT Canada Operations</h1>
            <p className="text-gray-600 mt-2">Manage Intra-Company Transfer Canada applications</p>
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
              <Users className="h-4 w-4 text-muted-foreground" />
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
                    placeholder="Search by name, position, or ID..."
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
                    <SelectItem value="lmia_application">LMIA Application</SelectItem>
                    <SelectItem value="lmia_approval">LMIA Approval</SelectItem>
                    <SelectItem value="work_permit_application">Work Permit Application</SelectItem>
                    <SelectItem value="medical_exam">Medical Exam</SelectItem>
                    <SelectItem value="biometrics">Biometrics</SelectItem>
                    <SelectItem value="work_permit_issued">Work Permit Issued</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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
          {filteredICTCanadaOps.map(ictOp => (
            <Card key={ictOp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getPositionIcon(ictOp.position)}
                    <div>
                      <h3 className="text-lg font-semibold">{ictOp.leadName}</h3>
                      <p className="text-sm text-gray-600">{ictOp.position} • {ictOp.leadId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(ictOp.priority)}
                    {getStatusBadge(ictOp.status)}
                    <Badge className="bg-blue-100 text-blue-800">{ictOp.canadianCompany.location}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Current Company</p>
                    <p className="font-medium">{ictOp.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Canadian Company</p>
                    <p className="font-medium">{ictOp.canadianCompany.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Experience</p>
                    <p className="font-medium">{ictOp.employmentInfo.totalExperience} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{ictOp.assignedTo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Application Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Initial Consultation</span>
                        {getApplicationStatusBadge(ictOp.applicationStatus.initialConsultation)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Document Collection</span>
                        {getApplicationStatusBadge(ictOp.applicationStatus.documentCollection)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">LMIA Application</span>
                        {getApplicationStatusBadge(ictOp.applicationStatus.lmiaApplication)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Work Permit Application</span>
                        {getApplicationStatusBadge(ictOp.applicationStatus.workPermitApplication)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Documents</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Passport</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(ictOp.documents.passport)}
                          <span className="text-xs capitalize">{ictOp.documents.passport}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Job Offer Letter</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(ictOp.documents.jobOfferLetter)}
                          <span className="text-xs capitalize">{ictOp.documents.jobOfferLetter}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Educational Certificates</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(ictOp.documents.educationalCertificates)}
                          <span className="text-xs capitalize">{ictOp.documents.educationalCertificates}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">LMIA Approval</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(ictOp.documents.lmiaApproval)}
                          <span className="text-xs capitalize">{ictOp.documents.lmiaApproval}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Financial Information</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Service Fee</span>
                        <span className="text-sm font-medium">${ictOp.financials.serviceFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">LMIA Fee</span>
                        <span className="text-sm font-medium">${ictOp.financials.lmiaFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Government Fees</span>
                        <span className="text-sm font-medium">${ictOp.financials.governmentFees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payment Status</span>
                        <Badge className={ictOp.financials.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {ictOp.financials.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Milestone</p>
                    <div className="space-y-2">
                      {ictOp.milestones
                        .filter(m => m.status === 'in_progress')
                        .map(milestone => (
                          <div key={milestone.phase} className="bg-yellow-50 p-2 rounded">
                            <p className="text-sm font-medium">{milestone.phase}</p>
                            <p className="text-xs text-gray-600">Due: {milestone.dueDate}</p>
                          </div>
                        ))}
                      {ictOp.milestones.every(m => m.status !== 'in_progress') && (
                        <p className="text-sm text-gray-500">No active milestones</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {ictOp.createdDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {ictOp.lastUpdated}</span>
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

        {filteredICTCanadaOps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ICTCanadaOps;


