'use client'

import { SearchableSelect } from '@/components/ui/searchable-select';
import { useState, useEffect } from 'react'
import { useSortableData, SortableTh } from '@/components/ui/sortable-th'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  MapPin,
  Users,
  Phone,
  Mail
} from 'lucide-react'

interface Branch {
  id: number
  name: string
  branch: string
  code: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  managerId: number
  managerName: string
  regionId: number
  regionName: string
  status: number
  createdAt: string
  employeeCount: number
}

export default function BranchListPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches')
      if (response.ok) {
        const data = await response.json()
        setBranches(data.branches)
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: number) => {
    return status === 1 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge className="bg-red-100 text-red-800">Inactive</Badge>
  }

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.branch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          branch.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          branch.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          branch.managerName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRegion = !regionFilter || branch.regionId === parseInt(regionFilter)
    const matchesStatus = statusFilter === '' || 
      (statusFilter === 'active' && branch.status === 1) ||
      (statusFilter === 'inactive' && branch.status === 0)
    
    return matchesSearch && matchesRegion && matchesStatus
  })

  const { sorted: sortedBranches, sortKey: branchSortKey, sortDirection: branchSortDirection, toggleSort: toggleBranchSort } = useSortableData(
    filteredBranches,
    {
      branch: (b) => b.branch,
      location: (b) => `${b.city || ''} ${b.state || ''}`,
      manager: (b) => b.managerName,
      region: (b) => b.regionName,
      employees: (b) => b.employeeCount,
      status: (b) => b.status,
    },
  )

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Branch List</h1>
            <p className="text-gray-600">Manage branch locations and information</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Branches</p>
                  <p className="text-2xl font-bold text-gray-900">{branches.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Active Branches</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {branches.filter(b => b.status === 1).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Regions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(branches.map(b => b.regionId)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {branches.reduce((sum, b) => sum + b.employeeCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search branches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
              <SearchableSelect
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Regions</option>
                <option value="1">North</option>
                <option value="2">South</option>
                <option value="3">East</option>
                <option value="4">West</option>
              </SearchableSelect>
              <SearchableSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </SearchableSelect>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Branches List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortableTh label="Branch" sortKey="branch" activeKey={branchSortKey} direction={branchSortDirection} onSort={toggleBranchSort} />
                    <SortableTh label="Location" sortKey="location" activeKey={branchSortKey} direction={branchSortDirection} onSort={toggleBranchSort} />
                    <SortableTh label="Manager" sortKey="manager" activeKey={branchSortKey} direction={branchSortDirection} onSort={toggleBranchSort} />
                    <SortableTh label="Region" sortKey="region" activeKey={branchSortKey} direction={branchSortDirection} onSort={toggleBranchSort} />
                    <SortableTh label="Employees" sortKey="employees" activeKey={branchSortKey} direction={branchSortDirection} onSort={toggleBranchSort} />
                    <SortableTh label="Status" sortKey="status" activeKey={branchSortKey} direction={branchSortDirection} onSort={toggleBranchSort} />
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBranches.map((branch) => (
                    <tr key={branch.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {branch.branch}
                            </div>
                            <div className="text-sm text-gray-500">
                              {branch.code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {branch.address}
                        </div>
                        <div className="text-sm text-gray-500">
                          {branch.city}, {branch.state}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {branch.managerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {branch.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {branch.regionName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {branch.employeeCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(branch.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredBranches.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No branches found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
