'use client';

import { useState } from 'react';
import {
  FileText, Download, Upload, Search, Filter, Eye,
  Edit, Trash2, Plus, Folder, Clock, User,
  File, Image, Video, Archive
} from 'lucide-react';

export default function DocumentsPage() {
  const [documents] = useState<Array<{
    id: number;
    name: string;
    type: string;
    size: string;
    uploaded: string;
    uploadedBy: string;
    client: string;
    category: string;
    tags: string[];
  }>>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchTerm || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'archive': return Archive;
      default: return File;
    }
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  return (
    <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600 mt-1">Manage client documents and files</p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="file">Files</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="archive">Archives</option>
                </select>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="identification">Identification</option>
                  <option value="education">Education</option>
                  <option value="application">Application</option>
                  <option value="financial">Financial</option>
                  <option value="consultation">Consultation</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Folder className="w-4 h-4 mr-2" />
                  New Folder
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Uploaded Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(doc => 
                      new Date(doc.uploaded).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Archive className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.reduce((sum, doc) => {
                      const size = parseFloat(doc.size.replace(/[^\d.]/g, ''));
                      const unit = doc.size.includes('MB') ? 1024 : 1;
                      return sum + (size * unit);
                    }, 0) > 1024 
                      ? `${(documents.reduce((sum, doc) => {
                        const size = parseFloat(doc.size.replace(/[^\d.]/g, ''));
                        const unit = doc.size.includes('MB') ? 1024 : 1;
                        return sum + (size * unit);
                      }, 0) / 1024).toFixed(1)} GB`
                      : `${Math.round(documents.reduce((sum, doc) => {
                        const size = parseFloat(doc.size.replace(/[^\d.]/g, ''));
                        const unit = doc.size.includes('MB') ? 1024 : 1;
                        return sum + (size * unit);
                      }, 0))} MB`
                  }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <User className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unique Clients</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(documents.map(doc => doc.client)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => {
                    const Icon = getFileIcon(doc.type);
                    return (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-lg mr-3">
                              <Icon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {doc.tags.map((tag, idx) => (
                                  <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doc.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatFileSize(doc.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{doc.uploaded}</div>
                            <div className="text-xs text-gray-400">{doc.uploadedBy}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800">
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  );
}
