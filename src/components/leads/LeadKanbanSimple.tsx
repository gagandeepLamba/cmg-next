'use client';

import { useState } from 'react';
import { Lead } from '@/types/lead';



interface LeadKanbanSimpleProps {
  leads: Lead[];
  onLeadSelect?: (lead: Lead) => void;
  onConvertToOpportunity?: (leadId: number) => void;
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (leadId: number) => void;
  onStatusChange?: (leadId: number, newStatus: string) => void;
}

const kanbanColumns = [
  { id: 'Prospect', title: 'Prospect', color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400', headerColor: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' },
  { id: 'Not Interested', title: 'Not Interested', color: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-400', headerColor: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white' },
  { id: 'DNQ', title: 'DNQ', color: 'bg-gradient-to-br from-red-50 to-red-100 border-red-400', headerColor: 'bg-gradient-to-r from-red-500 to-red-600 text-white' },
  { id: 'Not_answered', title: 'Not Answered', color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400', headerColor: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' },
  { id: 'Could Not Connect', title: 'Could Not Connect', color: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-400', headerColor: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' },
  { id: 'Call Back', title: 'Call Back', color: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-400', headerColor: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' },
  { id: 'Abroad Lead', title: 'Abroad Lead', color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-400', headerColor: 'bg-gradient-to-r from-green-500 to-green-600 text-white' }
];

export default function LeadKanbanSimple({
  leads,
  onLeadSelect,
  onEditLead,
  onDeleteLead,
  onStatusChange
}: Omit<LeadKanbanSimpleProps, 'onConvertToOpportunity'> & { onConvertToOpportunity?: (id: number) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);

  const getLeadsByStatus = (status: string) =>
    leads.filter(lead => {
      const matchesSearch = searchTerm === '' ||

        lead.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);
      return lead.status === status && matchesSearch;
    });

  const LeadCard = ({ lead }: { lead: Lead }) => (
    <div
      draggable
      onDragStart={(e) => {
        console.log('🎯 SIMPLE DragStart:', lead.id, lead.fname, lead.status);
        e.dataTransfer.effectAllowed = 'move';        e.dataTransfer.setData('text/plain', JSON.stringify({

          leadId: lead.id,
          fromStatus: lead.status
        }));
        
        e.currentTarget.style.opacity = '0.5';
      }}
      onDragEnd={(e) => {
        console.log('🎯 SIMPLE DragEnd:', lead.id);
        e.currentTarget.style.opacity = '1';
      }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4 hover:shadow-xl transition-all duration-300 cursor-move hover:border-blue-400"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-base leading-tight mb-2">
            {lead.fname} {lead.mname} {lead.lname}
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${
              lead.lead_quality === 'Hot' ? 'bg-red-500 text-white' :
              lead.lead_quality === 'Warm' ? 'bg-orange-500 text-white' :
              lead.lead_quality === 'Cold' ? 'bg-blue-500 text-white' :
              'bg-gray-400 text-white'
            }`}>
              {lead.lead_quality || 'No Quality'}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${
              lead.priority === 'High' ? 'bg-red-500 text-white' :
              lead.priority === 'Medium' ? 'bg-yellow-500 text-white' :
              lead.priority === 'Low' ? 'bg-green-500 text-white' :
              'bg-gray-400 text-white'
            }`}>
              {lead.priority || 'No Priority'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => onLeadSelect && onLeadSelect(lead)}
            className="h-8 w-8 p-0 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors"
            title="View"
          >
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => onEditLead && onEditLead(lead)}
            className="h-8 w-8 p-0 hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors"
            title="Edit"
          >
            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDeleteLead && onDeleteLead(lead.id)}
            className="h-8 w-8 p-0 hover:bg-red-100 rounded-lg flex items-center justify-center text-red-600 transition-colors"
            title="Delete"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 mb-4">
        {lead.email && (
          <div className="flex items-center gap-3 text-sm">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-gray-700 font-medium truncate">{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-3 text-sm">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">{lead.phone}</span>
          </div>
        )}
      </div>

      {/* Interest */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-sm">
          <div className="font-medium text-gray-900">{lead.country_interest}</div>
          <div className="text-gray-600">{lead.service_interest}</div>
          <div className="text-xs text-gray-500 mt-1">Source: {lead.market_source}</div>
        </div>
      </div>

      {/* Assignment */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {lead.dmEmployeeByASSIGNTo ? (
              <div className="flex items-center gap-1">
                <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs text-gray-600">{lead.dmEmployeeByASSIGNTo.name}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">Unassigned</span>
            )}
          </div>
          {lead.dmBranch && (
            <div className="flex items-center gap-1">
              <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xs text-gray-600">{lead.dmBranch.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Change Dropdown */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <select
          value={lead.status}
          onChange={(e) => onStatusChange?.(lead.id, e.target.value)}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Prospect">Prospect/Interested</option>
          <option value="Not Interested">Not Interested</option>
          <option value="DNQ">DNQ</option>
          <option value="Not_answered">Not Answered</option>
          <option value="Could Not Connect">Could Not Connect/Wrong Number</option>
          <option value="Call Back">Call Back</option>
          <option value="Abroad Lead">Abroad Lead</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search and Test Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search leads in Kanban view..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

      </div>


      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {kanbanColumns.map((column) => (
          <div
            key={column.id}
            className={`rounded-2xl border-2 ${column.color} min-h-[650px] transition-all duration-300 ${
              dragOverStatus === column.id ? 'ring-4 ring-blue-500 ring-opacity-40 shadow-2xl transform scale-[1.02]' : 'shadow-lg hover:shadow-xl'
            }`}
            onDragOver={(e) => {
              console.log('🎯 SIMPLE DragOver:', column.id);
              e.preventDefault();
              setDragOverStatus(column.id);
            }}
            onDragLeave={() => {
              console.log('🎯 SIMPLE DragLeave');
              setDragOverStatus(null);
            }}
            onDrop={(e) => {
              console.log('🎯 SIMPLE Drop:', column.id);
              e.preventDefault();
              setDragOverStatus(null);

              const dragData = e.dataTransfer.getData('text/plain');
              console.log('🎯 SIMPLE Drag Data:', dragData);

              if (dragData) {
                const { leadId, fromStatus } = JSON.parse(dragData);
                console.log('🎯 SIMPLE Parsed:', { leadId, fromStatus, toStatus: column.id });

                if (fromStatus !== column.id && onStatusChange) {
                  console.log('🎯 SIMPLE Calling Status Change:', leadId, column.id);
                  onStatusChange(leadId, column.id);
                }
              }
            }}
          >
            {/* Column Header */}
            <div className={`p-5 border-b-2 ${column.headerColor} sticky top-0 z-10 rounded-t-2xl`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">{column.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-white bg-opacity-90 shadow-md">
                    {getLeadsByStatus(column.id).length}
                  </span>
                  {dragOverStatus === column.id && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-xs text-white font-medium animate-pulse">Drop here</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drop Zone */}
            <div className="p-5 min-h-[550px] relative">
              {getLeadsByStatus(column.id).length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium mb-1">No leads yet</p>
                    <p className="text-gray-400 text-sm">Drag leads here to add them</p>
                  </div>
                </div>
              )}
              {getLeadsByStatus(column.id).map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
