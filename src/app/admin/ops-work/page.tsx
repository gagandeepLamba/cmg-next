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
  LineChart,
  MessageCircle,
  PhoneCall,
  Video,
  Mail as MailIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  User as UserIcon,
  Headphones,
  Volume2,
  Mic,
  Video as VideoIcon,
  Settings,
  Cog
} from 'lucide-react';

interface WorkOps {
  id: string;
  leadId: string;
  leadName: string;
  email: string;
  phone: string;
  workType: string;
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
    profession: string;
  };
  workDetails: {
    category: string;
    subCategory: string;
    experience: string;
    certifications: string[];
    skills: string[];
    languages: string[];
    salaryExpectation: string;
    jobType: string;
    availability: string;
  };
  applicationStatus: {
    initialConsultation: string;
    documentCollection: string;
    jobSearch: string;
    interviews: string;
    jobOffer: string;
    workPermit: string;
    relocation: string;
  };
  documents: {
    resume: string;
    certificates: string;
    workReferences: string;
    policeClearance: string;
    medicalCertificate: string;
    languageTest: string;
    workPermit: string;
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
    placementFee: number;
    totalCost: number;
    paidAmount: number;
    balanceAmount: number;
    paymentStatus: string;
    nextPaymentDue: string;
  };
  notes: string[];
}

const WorkOps: React.FC = () => {
  const [workOps, setWorkOps] = useState<WorkOps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWorkType, setSelectedWorkType] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchWorkOps = async () => {
      setLoading(true);
      try {
        const rows = await searchOperationCases({ module: 'work', search: searchTerm || null, limit: 100 });
        setWorkOps(rows.map((row) => mapOperationsRowToListItem(row)) as unknown as WorkOps[]);
      } catch (error) {
        console.error('Error fetching operations cases:', error);
        setWorkOps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOps();
  }, [searchTerm]);

  const getWorkTypeIcon = (workType: string) => {
    switch (workType) {
      case 'Skilled Worker': return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'Healthcare Worker': return <Heart className="h-5 w-5 text-red-500" />;
      case 'Construction Worker': return <Building className="h-5 w-5 text-orange-500" />;
      case 'IT Professional': return <Cpu className="h-5 w-5 text-purple-500" />;
      case 'Hospitality Worker': return <Hotel className="h-5 w-5 text-pink-500" />;
      case 'Agricultural Worker': return <Factory className="h-5 w-5 text-green-500" />;
      default: return <Briefcase className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'initial_consultation': return <Badge className="bg-blue-100 text-blue-800">Initial Consultation</Badge>;
      case 'document_collection': return <Badge className="bg-yellow-100 text-yellow-800">Document Collection</Badge>;
      case 'job_search': return <Badge className="bg-orange-100 text-orange-800">Job Search</Badge>;
      case 'interviews': return <Badge className="bg-purple-100 text-purple-800">Interviews</Badge>;
      case 'job_offer': return <Badge className="bg-green-100 text-green-800">Job Offer</Badge>;
      case 'work_permit': return <Badge className="bg-indigo-100 text-indigo-800">Work Permit</Badge>;
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

  const filteredWorkOps = workOps.filter(op => {
    const matchesSearch = op.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || op.status === selectedStatus;
    const matchesWorkType = selectedWorkType === 'all' || op.workType === selectedWorkType;
    const matchesCountry = selectedCountry === 'all' || op.targetCountry === selectedCountry;
    const matchesPriority = selectedPriority === 'all' || op.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesWorkType && matchesCountry && matchesPriority;
  });

  const stats = {
    total: workOps.length,
    active: workOps.filter(op => !['completed', 'on_hold'].includes(op.status)).length,
    completed: workOps.filter(op => op.status === 'completed').length,
    highPriority: workOps.filter(op => op.priority === 'high').length,
    totalRevenue: workOps.reduce((sum, op) => sum + op.financials.totalCost, 0),
    pendingPayments: workOps.filter(op => op.financials.paymentStatus === 'partial').length
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
            <h1 className="text-3xl font-bold text-gray-900">Work Operations</h1>
            <p className="text-gray-600 mt-2">Manage skilled worker and employment services</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Client
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
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
              <CardTitle className="text-sm font-medium">Completed Placements</CardTitle>
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
                    placeholder="Search by name, work type, or ID..."
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
                    <SelectItem value="job_search">Job Search</SelectItem>
                    <SelectItem value="interviews">Interviews</SelectItem>
                    <SelectItem value="job_offer">Job Offer</SelectItem>
                    <SelectItem value="work_permit">Work Permit</SelectItem>
                    <SelectItem value="relocation">Relocation</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedWorkType} onValueChange={setSelectedWorkType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Work Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Work Types</SelectItem>
                    <SelectItem value="Skilled Worker">Skilled Worker</SelectItem>
                    <SelectItem value="Healthcare Worker">Healthcare Worker</SelectItem>
                    <SelectItem value="Construction Worker">Construction Worker</SelectItem>
                    <SelectItem value="IT Professional">IT Professional</SelectItem>
                    <SelectItem value="Hospitality Worker">Hospitality Worker</SelectItem>
                    <SelectItem value="Agricultural Worker">Agricultural Worker</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
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

        {/* Workers List */}
        <div className="space-y-4">
          {filteredWorkOps.map(workOp => (
            <Card key={workOp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getWorkTypeIcon(workOp.workType)}
                    <div>
                      <h3 className="text-lg font-semibold">{workOp.leadName}</h3>
                      <p className="text-sm text-gray-600">{workOp.workType} • {workOp.leadId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(workOp.priority)}
                    {getStatusBadge(workOp.status)}
                    <Badge className="bg-blue-100 text-blue-800">{workOp.targetCountry}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Profession</p>
                    <p className="font-medium">{workOp.personalInfo.profession}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Experience</p>
                    <p className="font-medium">{workOp.workDetails.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Salary Expectation</p>
                    <p className="font-medium">{workOp.workDetails.salaryExpectation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{workOp.assignedTo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Application Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Initial Consultation</span>
                        {getApplicationStatusBadge(workOp.applicationStatus.initialConsultation)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Document Collection</span>
                        {getApplicationStatusBadge(workOp.applicationStatus.documentCollection)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Job Search</span>
                        {getApplicationStatusBadge(workOp.applicationStatus.jobSearch)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Interviews</span>
                        {getApplicationStatusBadge(workOp.applicationStatus.interviews)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Documents</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Resume</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(workOp.documents.resume)}
                          <span className="text-xs capitalize">{workOp.documents.resume}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Certificates</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(workOp.documents.certificates)}
                          <span className="text-xs capitalize">{workOp.documents.certificates}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Work References</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(workOp.documents.workReferences)}
                          <span className="text-xs capitalize">{workOp.documents.workReferences}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Language Test</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(workOp.documents.languageTest)}
                          <span className="text-xs capitalize">{workOp.documents.languageTest}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Skills & Certifications</p>
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {workOp.workDetails.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {workOp.workDetails.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{workOp.workDetails.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {workOp.workDetails.certifications.slice(0, 2).map(cert => (
                          <Badge key={cert} variant="outline" className="text-xs bg-green-50 text-green-700">
                            {cert}
                          </Badge>
                        ))}
                        {workOp.workDetails.certifications.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{workOp.workDetails.certifications.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Milestone</p>
                    <div className="space-y-2">
                      {workOp.milestones
                        .filter(m => m.status === 'in_progress')
                        .map(milestone => (
                          <div key={milestone.phase} className="bg-yellow-50 p-2 rounded">
                            <p className="text-sm font-medium">{milestone.phase}</p>
                            <p className="text-xs text-gray-600">Due: {milestone.dueDate}</p>
                          </div>
                        ))}
                      {workOp.milestones.every(m => m.status !== 'in_progress') && (
                        <p className="text-sm text-gray-500">No active milestones</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {workOp.createdDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {workOp.lastUpdated}</span>
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

        {filteredWorkOps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default WorkOps;


