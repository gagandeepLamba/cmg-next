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
  UserX
} from 'lucide-react';

interface JobSearchOps {
  id: string;
  leadId: string;
  leadName: string;
  email: string;
  phone: string;
  targetPosition: string;
  targetIndustry: string;
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
    experience: string;
  };
  jobProfile: {
    currentPosition: string;
    yearsExperience: number;
    skills: string[];
    salaryExpectation: string;
    jobType: string;
    availability: string;
    targetCompanies: string[];
    preferredLocations: string[];
  };
  applicationStatus: {
    profileCreation: string;
    resumeOptimization: string;
    jobApplications: string;
    interviews: string;
    offers: string;
    visaSponsorship: string;
    relocation: string;
  };
  documents: {
    resume: string;
    coverLetter: string;
    portfolio: string;
    certificates: string;
    references: string;
    visaDocuments: string;
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
    visaFees: number;
    totalCost: number;
    paidAmount: number;
    balanceAmount: number;
    paymentStatus: string;
    nextPaymentDue: string;
  };
  notes: string[];
}

const JobSearchOps: React.FC = () => {
  const [jobSearchOps, setJobSearchOps] = useState<JobSearchOps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchJobSearchOps = async () => {
      setLoading(true);
      try {
        const rows = await searchOperationCases({ module: 'job-search', search: searchTerm || null, limit: 100 });
        setJobSearchOps(rows.map((row) => mapOperationsRowToListItem(row)) as unknown as JobSearchOps[]);
      } catch (error) {
        console.error('Error fetching operations cases:', error);
        setJobSearchOps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobSearchOps();
  }, [searchTerm]);

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'Information Technology': return <Cpu className="h-5 w-5 text-blue-500" />;
      case 'Marketing & Advertising': return <Target className="h-5 w-5 text-purple-500" />;
      case 'Banking & Finance': return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'Healthcare': return <Heart className="h-5 w-5 text-red-500" />;
      case 'Education': return <GraduationCap className="h-5 w-5 text-orange-500" />;
      case 'Engineering': return <Building className="h-5 w-5 text-gray-500" />;
      case 'Consulting': return <BriefcaseIcon className="h-5 w-5 text-teal-500" />;
      default: return <Briefcase className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'profile_creation': return <Badge className="bg-blue-100 text-blue-800">Profile Creation</Badge>;
      case 'resume_optimization': return <Badge className="bg-yellow-100 text-yellow-800">Resume Optimization</Badge>;
      case 'job_applications': return <Badge className="bg-orange-100 text-orange-800">Job Applications</Badge>;
      case 'interviews': return <Badge className="bg-purple-100 text-purple-800">Interviews</Badge>;
      case 'offers': return <Badge className="bg-green-100 text-green-800">Offers</Badge>;
      case 'visa_sponsorship': return <Badge className="bg-indigo-100 text-indigo-800">Visa Sponsorship</Badge>;
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

  const filteredJobSearchOps = jobSearchOps.filter(op => {
    const matchesSearch = op.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.targetPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.leadId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || op.status === selectedStatus;
    const matchesIndustry = selectedIndustry === 'all' || op.targetIndustry === selectedIndustry;
    const matchesCountry = selectedCountry === 'all' || op.targetCountry === selectedCountry;
    const matchesPriority = selectedPriority === 'all' || op.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesIndustry && matchesCountry && matchesPriority;
  });

  const stats = {
    total: jobSearchOps.length,
    active: jobSearchOps.filter(op => !['completed', 'on_hold'].includes(op.status)).length,
    completed: jobSearchOps.filter(op => op.status === 'completed').length,
    highPriority: jobSearchOps.filter(op => op.priority === 'high').length,
    totalRevenue: jobSearchOps.reduce((sum, op) => sum + op.financials.totalCost, 0),
    pendingPayments: jobSearchOps.filter(op => op.financials.paymentStatus === 'partial').length
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
            <h1 className="text-3xl font-bold text-gray-900">Job Search Operations</h1>
            <p className="text-gray-600 mt-2">Manage international job search assistance</p>
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
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} active searches
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Searches</CardTitle>
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
                    <SelectItem value="profile_creation">Profile Creation</SelectItem>
                    <SelectItem value="resume_optimization">Resume Optimization</SelectItem>
                    <SelectItem value="job_applications">Job Applications</SelectItem>
                    <SelectItem value="interviews">Interviews</SelectItem>
                    <SelectItem value="offers">Offers</SelectItem>
                    <SelectItem value="visa_sponsorship">Visa Sponsorship</SelectItem>
                    <SelectItem value="relocation">Relocation</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Marketing & Advertising">Marketing & Advertising</SelectItem>
                    <SelectItem value="Banking & Finance">Banking & Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
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

        {/* Clients List */}
        <div className="space-y-4">
          {filteredJobSearchOps.map(jobOp => (
            <Card key={jobOp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {getIndustryIcon(jobOp.targetIndustry)}
                    <div>
                      <h3 className="text-lg font-semibold">{jobOp.leadName}</h3>
                      <p className="text-sm text-gray-600">{jobOp.targetPosition} • {jobOp.leadId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(jobOp.priority)}
                    {getStatusBadge(jobOp.status)}
                    <Badge className="bg-blue-100 text-blue-800">{jobOp.targetCountry}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Current Position</p>
                    <p className="font-medium">{jobOp.jobProfile.currentPosition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Experience</p>
                    <p className="font-medium">{jobOp.jobProfile.yearsExperience} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Salary Expectation</p>
                    <p className="font-medium">{jobOp.jobProfile.salaryExpectation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium">{jobOp.assignedTo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Application Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Profile Creation</span>
                        {getApplicationStatusBadge(jobOp.applicationStatus.profileCreation)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Resume Optimization</span>
                        {getApplicationStatusBadge(jobOp.applicationStatus.resumeOptimization)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Job Applications</span>
                        {getApplicationStatusBadge(jobOp.applicationStatus.jobApplications)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Interviews</span>
                        {getApplicationStatusBadge(jobOp.applicationStatus.interviews)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Documents</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Resume</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(jobOp.documents.resume)}
                          <span className="text-xs capitalize">{jobOp.documents.resume}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cover Letter</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(jobOp.documents.coverLetter)}
                          <span className="text-xs capitalize">{jobOp.documents.coverLetter}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Portfolio</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(jobOp.documents.portfolio)}
                          <span className="text-xs capitalize">{jobOp.documents.portfolio}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">References</span>
                        <div className="flex items-center space-x-1">
                          {getDocumentStatusIcon(jobOp.documents.references)}
                          <span className="text-xs capitalize">{jobOp.documents.references}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Key Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {jobOp.jobProfile.skills.slice(0, 4).map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {jobOp.jobProfile.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{jobOp.jobProfile.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Current Milestone</p>
                    <div className="space-y-2">
                      {jobOp.milestones
                        .filter(m => m.status === 'in_progress')
                        .map(milestone => (
                          <div key={milestone.phase} className="bg-yellow-50 p-2 rounded">
                            <p className="text-sm font-medium">{milestone.phase}</p>
                            <p className="text-xs text-gray-600">Due: {milestone.dueDate}</p>
                          </div>
                        ))}
                      {jobOp.milestones.every(m => m.status !== 'in_progress') && (
                        <p className="text-sm text-gray-500">No active milestones</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {jobOp.createdDate}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Updated: {jobOp.lastUpdated}</span>
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

        {filteredJobSearchOps.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default JobSearchOps;


