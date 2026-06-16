'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchParamsWrapper } from '@/components/SearchParamsWrapper'
import DocumentUpload from '@/components/DocumentUpload'
import { baseOperationFields, findOperationCase, OperationsSearchRow } from '@/lib/operationsClient'
import {
  FileText,
  GraduationCap,
  Briefcase,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Download,
  Edit,
  Save,
  Plus,
  Search,
  Filter,
  User,
  Globe
} from 'lucide-react'

interface SkillAssessment {
  id: number
  leadId: number
  leadName: string
  agreementNumber: string
  paymentDue: number
  paymentRemarks: string
  paymentDueDate: string
  status: string
  personalInfo: {
    fullName: string
    dateOfBirth: string
    passportNumber: string
    nationality: string
    email: string
    phone: string
  }
  education: {
    highestLevel: string
    institution: string
    fieldOfStudy: string
    yearCompleted: string
    country: string
  }
  workExperience: {
    totalYears: number
    currentOccupation: string
    nocCode: string
    company: string
    duration: string
    duties: string[]
  }
  languageProficiency: {
    english: {
      speaking: string
      listening: string
      reading: string
      writing: string
      overall: string
      testDate: string
    }
    french?: {
      speaking: string
      listening: string
      reading: string
      writing: string
      overall: string
      testDate: string
    }
  }
  skills: {
    technical: string[]
    soft: string[]
    certifications: string[]
  }
  documents: {
    resume: string[]
    educational: string[]
    professional: string[]
    language: string[]
    other: string[]
  }
  assessmentResult: {
    eligible: boolean
    score: number
    recommendations: string[]
    nextSteps: string[]
  }
  createdAt: string
  updatedAt: string
  assignedTo: string
  assignedToId: number
}

const mapSkillCanadaCase = (row: OperationsSearchRow): SkillAssessment => ({
  ...baseOperationFields(row),
  personalInfo: {
    fullName: [row.fname, row.lname].filter(Boolean).join(' '),
    dateOfBirth: '',
    passportNumber: '',
    nationality: row.nationality || '',
    email: row.email || '',
    phone: row.mobile || row.phone || ''
  },
  education: {
    highestLevel: '',
    institution: '',
    fieldOfStudy: '',
    yearCompleted: '',
    country: ''
  },
  workExperience: {
    totalYears: 0,
    currentOccupation: row.serviceRequired || '',
    nocCode: '',
    company: '',
    duration: '',
    duties: []
  },
  languageProficiency: {
    english: { speaking: '', listening: '', reading: '', writing: '', overall: '', testDate: '' }
  },
  skills: {
    technical: [],
    soft: [],
    certifications: []
  },
  documents: {
    resume: [],
    educational: [],
    professional: [],
    language: [],
    other: []
  },
  assessmentResult: {
    eligible: false,
    score: 0,
    recommendations: [],
    nextSteps: []
  }
})

// Component that uses useSearchParams
function OpsSkillCanadaContent() {
  const searchParams = useSearchParams()
  const [assessmentData, setAssessmentData] = useState<SkillAssessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const leadId = searchParams.get('lead')
    const agreementNumber = searchParams.get('agreementNumber') || searchParams.get('agreement')
    if (leadId || agreementNumber) {
      fetchAssessmentData({ leadId, agreementNumber })
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const fetchAssessmentData = async ({ leadId, agreementNumber }: { leadId?: string | null; agreementNumber?: string | null }) => {
    setLoading(true)
    try {
      const row = await findOperationCase({ module: 'skill-canada', leadId, agreementNumber })
      setAssessmentData(row ? mapSkillCanadaCase(row) : null)
    } catch (error) {
      console.error('Error fetching assessment data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const tabs = [
    { id: 'personal', name: 'Personal Information', icon: User },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'work', name: 'Work Experience', icon: Briefcase },
    { id: 'language', name: 'Language Proficiency', icon: Globe },
    { id: 'skills', name: 'Skills & Certifications', icon: Award },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'assessment', name: 'Assessment Result', icon: CheckCircle }
  ]

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    )
  }

  if (!assessmentData) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No assessment data found</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Final Skill Draft for Canada</h1>
            <p className="text-gray-600">Comprehensive skill assessment for Canadian immigration</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Assessment
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
          </div>
        </div>

        {/* Client Information Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Client Name</label>
                <p className="text-lg font-semibold text-gray-900">{assessmentData.leadName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Agreement Number</label>
                <p className="text-lg font-semibold text-gray-900">{assessmentData.agreementNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Due</label>
                <p className="text-lg font-semibold text-gray-900">${assessmentData.paymentDue.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Due Date</label>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(assessmentData.paymentDueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Remarks</label>
                <p className="text-sm text-gray-900">{assessmentData.paymentRemarks}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Assigned To</label>
                <p className="text-sm text-gray-900">{assessmentData.assignedTo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">{getStatusBadge(assessmentData.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-900">
                  {new Date(assessmentData.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Card>
          <CardContent className="p-0">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-2 inline" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <p className="text-sm text-gray-900">{assessmentData.personalInfo.fullName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <p className="text-sm text-gray-900">{assessmentData.personalInfo.dateOfBirth}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Passport Number</label>
                        <p className="text-sm text-gray-900">{assessmentData.personalInfo.passportNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nationality</label>
                        <p className="text-sm text-gray-900">{assessmentData.personalInfo.nationality}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{assessmentData.personalInfo.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <p className="text-sm text-gray-900">{assessmentData.personalInfo.phone}</p>
                      </div>
                    </div>
                  </div>
                  <DocumentUpload opportunityId={String(assessmentData.id)} clientId={String(assessmentData.leadId)} />
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Highest Level</label>
                        <p className="text-sm text-gray-900">{assessmentData.education.highestLevel}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Institution</label>
                        <p className="text-sm text-gray-900">{assessmentData.education.institution}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                        <p className="text-sm text-gray-900">{assessmentData.education.fieldOfStudy}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Year Completed</label>
                        <p className="text-sm text-gray-900">{assessmentData.education.yearCompleted}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <p className="text-sm text-gray-900">{assessmentData.education.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'work' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Years</label>
                        <p className="text-sm text-gray-900">{assessmentData.workExperience.totalYears} years</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current Occupation</label>
                        <p className="text-sm text-gray-900">{assessmentData.workExperience.currentOccupation}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">NOC Code</label>
                        <p className="text-sm text-gray-900">{assessmentData.workExperience.nocCode}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company</label>
                        <p className="text-sm text-gray-900">{assessmentData.workExperience.company}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <p className="text-sm text-gray-900">{assessmentData.workExperience.duration}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Duties</label>
                    <ul className="list-disc list-inside space-y-1">
                      {assessmentData.workExperience.duties.map((duty, index) => (
                        <li key={index} className="text-sm text-gray-900">{duty}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Language Proficiency</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">English</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Speaking</label>
                          <p className="text-sm text-gray-900">{assessmentData.languageProficiency.english.speaking}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Listening</label>
                          <p className="text-sm text-gray-900">{assessmentData.languageProficiency.english.listening}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Reading</label>
                          <p className="text-sm text-gray-900">{assessmentData.languageProficiency.english.reading}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Writing</label>
                          <p className="text-sm text-gray-900">{assessmentData.languageProficiency.english.writing}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Overall</label>
                          <p className="text-sm font-semibold text-blue-600">{assessmentData.languageProficiency.english.overall}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Test Date: {new Date(assessmentData.languageProficiency.english.testDate).toLocaleDateString()}
                      </div>
                    </div>

                    {assessmentData.languageProficiency.french && (
                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3">French</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Speaking</label>
                            <p className="text-sm text-gray-900">{assessmentData.languageProficiency.french.speaking}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Listening</label>
                            <p className="text-sm text-gray-900">{assessmentData.languageProficiency.french.listening}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Reading</label>
                            <p className="text-sm text-gray-900">{assessmentData.languageProficiency.french.reading}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Writing</label>
                            <p className="text-sm text-gray-900">{assessmentData.languageProficiency.french.writing}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Overall</label>
                            <p className="text-sm font-semibold text-blue-600">{assessmentData.languageProficiency.french.overall}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Test Date: {new Date(assessmentData.languageProficiency.french.testDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Skills & Certifications</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {assessmentData.skills.technical.map((skill, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {assessmentData.skills.soft.map((skill, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {assessmentData.skills.certifications.map((cert, index) => (
                          <Badge key={index} className="bg-purple-100 text-purple-800">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">Resume</h4>
                      <div className="space-y-2">
                        {assessmentData.documents.resume.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-900">{doc}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">Educational Documents</h4>
                      <div className="space-y-2">
                        {assessmentData.documents.educational.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <GraduationCap className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-900">{doc}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">Professional Documents</h4>
                      <div className="space-y-2">
                        {assessmentData.documents.professional.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Briefcase className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-900">{doc}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">Language Documents</h4>
                      <div className="space-y-2">
                        {assessmentData.documents.language.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-900">{doc}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-800 mb-3">Other Documents</h4>
                      <div className="space-y-2">
                        {assessmentData.documents.other.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-900">{doc}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assessment' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900">Assessment Result</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-600 mb-2">
                            {assessmentData.assessmentResult.score}
                          </div>
                          <p className="text-sm text-gray-500 mb-4">CRS Score</p>
                          <div className="flex items-center justify-center space-x-2">
                            {assessmentData.assessmentResult.eligible ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <span className="text-green-600 font-medium">Eligible</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                <span className="text-red-600 font-medium">Not Eligible</span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h4 className="text-md font-medium text-gray-800 mb-3">Recommendations</h4>
                        <ul className="list-disc list-inside space-y-2">
                          {assessmentData.assessmentResult.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-gray-900">{rec}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="text-md font-medium text-gray-800 mb-3">Next Steps</h4>
                      <ul className="list-disc list-inside space-y-2">
                        {assessmentData.assessmentResult.nextSteps.map((step, index) => (
                          <li key={index} className="text-sm text-gray-900">{step}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

// Main page component that wraps the content in Suspense
export default function OpsSkillCanadaPage() {
  return (
    <SearchParamsWrapper>
      <OpsSkillCanadaContent />
    </SearchParamsWrapper>
  )
}


