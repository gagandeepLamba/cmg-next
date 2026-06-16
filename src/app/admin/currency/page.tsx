'use client';

import { useState } from 'react';
import {
  Plus, Search, Filter, Edit, Trash2, Eye,
  DollarSign, Globe, TrendingUp, TrendingDown
} from 'lucide-react';

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  status: 'active' | 'inactive';
  isDefault: boolean;
  created: string;
  updated: string;
}

export default function CurrencyPage() {
  const [currencies] = useState<Currency[]>([
    {
      id: 1,
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      exchangeRate: 1.00,
      status: 'active',
      isDefault: true,
      created: '2024-01-15',
      updated: '2024-01-15'
    },
    {
      id: 2,
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'C$',
      exchangeRate: 1.35,
      status: 'active',
      isDefault: false,
      created: '2024-01-14',
      updated: '2024-01-14'
    },
    {
      id: 3,
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      exchangeRate: 0.79,
      status: 'active',
      isDefault: false,
      created: '2024-01-13',
      updated: '2024-01-13'
    },
    {
      id: 4,
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      exchangeRate: 0.92,
      status: 'active',
      isDefault: false,
      created: '2024-01-12',
      updated: '2024-01-12'
    },
    {
      id: 5,
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ',
      exchangeRate: 3.67,
      status: 'active',
      isDefault: false,
      created: '2024-01-11',
      updated: '2024-01-11'
    },
    {
      id: 6,
      code: 'SAR',
      name: 'Saudi Riyal',
      symbol: '﷼',
      exchangeRate: 3.75,
      status: 'inactive',
      isDefault: false,
      created: '2024-01-10',
      updated: '2024-01-10'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);

  const filteredCurrencies = currencies.filter(currency => {
    const matchesSearch = !searchTerm || 
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || currency.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statuses = ['all', 'active', 'inactive'];

  return (
    <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Currency Management</h1>
            <p className="text-gray-600 mt-1">Manage currencies and exchange rates</p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search currencies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Currency
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Currencies</p>
                  <p className="text-2xl font-bold text-gray-900">{currencies.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currencies.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Default</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currencies.find(c => c.isDefault)?.code || 'USD'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currencies.filter(c => c.status === 'inactive').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Currencies Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exchange Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCurrencies.map((currency) => (
                    <tr key={currency.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{currency.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {currency.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {currency.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {currency.exchangeRate.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          currency.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {currency.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {currency.isDefault && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setSelectedCurrency(currency)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="w-4 h-4" />
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  );
}
