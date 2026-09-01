/**
 * @file WatchlistTab.tsx
 * @description OFAC SDN and FinCEN 314(a) watchlist screening tab for extracted payees and routing numbers.
 * Provides per-row manual entry, addition, editing, and deletion for compliance records.
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, Search, AlertTriangle, CheckCircle2, UserCheck, Building, 
  Globe, FileText, Database, Plus, Trash2, Edit3, Copy, Check, X, Download
} from 'lucide-react';
import { DocumentTemplate, ThemeMode } from '../types';

interface WatchlistTabProps {
  template: DocumentTemplate;
  themeMode: ThemeMode;
  onUpdateTemplate?: (template: DocumentTemplate) => void;
}

export interface WatchlistRecord {
  id: string;
  name: string;
  entityType: 'Individual' | 'Corporate' | 'Routing';
  program: string;
  country: string;
  matchScore: number;
  status: 'Clear' | 'Potential Match' | 'Confirmed Hit';
}

export const WatchlistTab: React.FC<WatchlistTabProps> = ({ template, themeMode, onUpdateTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedList, setSelectedList] = useState<'all' | 'ofac' | 'fincen'>('all');
  
  // Watchlist database with state for manual modifications
  const [records, setRecords] = useState<WatchlistRecord[]>([
    { id: 'WL-001', name: 'ACME ENTERPRISES LLC (Suspended)', entityType: 'Corporate', program: 'SDN / FinCEN 314(a)', country: 'KY', matchScore: 88, status: 'Potential Match' },
    { id: 'WL-002', name: 'GLOBAL TRADING INC (Shell)', entityType: 'Corporate', program: 'SDN List', country: 'PA', matchScore: 42, status: 'Clear' },
    { id: 'WL-003', name: 'VIKTOR ORLOV HOLDINGS', entityType: 'Corporate', program: 'SDN Sanctions', country: 'CY', matchScore: 95, status: 'Confirmed Hit' },
    { id: 'WL-004', name: 'PACIFIC REMITTANCE CORP', entityType: 'Routing', program: 'FinCEN Advisory', country: 'US', matchScore: 12, status: 'Clear' },
    { id: 'WL-005', name: 'SHELL-CORP INTERNATIONAL', entityType: 'Corporate', program: 'SDN / Blocked', country: 'VG', matchScore: 78, status: 'Potential Match' }
  ]);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<WatchlistRecord>({
    id: '',
    name: '',
    entityType: 'Corporate',
    program: 'SDN List',
    country: 'US',
    matchScore: 50,
    status: 'Potential Match'
  });

  // Modal for new record
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Omit<WatchlistRecord, 'id'>>({
    name: '',
    entityType: 'Corporate',
    program: 'SDN List / FinCEN 314(a)',
    country: 'US',
    matchScore: 85,
    status: 'Potential Match'
  });

  const handleStartEdit = (rec: WatchlistRecord) => {
    setEditingId(rec.id);
    setEditForm({ ...rec });
  };

  const handleSaveEdit = (id: string) => {
    setRecords(records.map(r => r.id === id ? { ...editForm, id } : r));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleDuplicateRecord = (rec: WatchlistRecord) => {
    const newRec: WatchlistRecord = {
      ...rec,
      id: `WL-${String(records.length + 1).padStart(3, '0')}`,
      name: `${rec.name} (Duplicate)`
    };
    setRecords([newRec, ...records]);
  };

  const handleInsertRow = (index: number) => {
    const newId = `WL-${String(records.length + 1).padStart(3, '0')}`;
    const insertRec: WatchlistRecord = {
      id: newId,
      name: 'NEW SUSPECT ENTITY / PAYEE',
      entityType: 'Corporate',
      program: 'SDN Sanctions / FinCEN 314(a)',
      country: 'US',
      matchScore: 75,
      status: 'Potential Match'
    };
    const updated = [...records];
    updated.splice(index + 1, 0, insertRec);
    setRecords(updated);
    handleStartEdit(insertRec);
  };

  const handleAddRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.name.trim()) return;

    const recordToAdd: WatchlistRecord = {
      ...newRecord,
      id: `WL-${String(records.length + 1).padStart(3, '0')}`
    };

    setRecords([recordToAdd, ...records]);
    setIsAddModalOpen(false);
    setNewRecord({
      name: '',
      entityType: 'Corporate',
      program: 'SDN List / FinCEN 314(a)',
      country: 'US',
      matchScore: 85,
      status: 'Potential Match'
    });
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedList === 'ofac') return matchesSearch && r.program.includes('SDN');
    if (selectedList === 'fincen') return matchesSearch && r.program.includes('FinCEN');
    return matchesSearch;
  });

  return (
    <div className={`flex flex-col h-full  border overflow-hidden shadow-xs ${
      themeMode === 'dark' ? 'bg-[#252629] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Header Bar */}
      <div className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
        themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2  bg-amber-500/10 text-amber-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm uppercase tracking-wider">OFAC SDN & FinCEN 314(a) Automated Watchlist Screening</h3>
              <span className="text-[10px] font-mono px-2 py-0.5  bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                {records.length} Monitored Targets
              </span>
            </div>
            <p className="text-[11px] opacity-75 mt-0.5">
              Screening specimen <span className="font-mono font-bold text-inherit">{template.title}</span> against global sanctions & embargo registries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5  bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Watchlist Record</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
        themeMode === 'dark' ? 'border-[#3c4043] bg-[#292a2d]' : 'border-slate-200 bg-slate-100/60'
      }`}>
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 opacity-50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search OFAC SDN names, aliases, routing IDs, countries..."
            className="bg-transparent outline-none flex-1 text-xs"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="opacity-50 hover:opacity-100">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedList('all')}
            className={`px-3 py-1  font-medium text-xs transition ${
              selectedList === 'all' ? 'bg-slate-700 text-white' : 'opacity-75 hover:opacity-100'
            }`}
          >
            All Lists ({records.length})
          </button>
          <button
            onClick={() => setSelectedList('ofac')}
            className={`px-3 py-1  font-medium text-xs transition ${
              selectedList === 'ofac' ? 'bg-slate-700 text-white' : 'opacity-75 hover:opacity-100'
            }`}
          >
            OFAC SDN
          </button>
          <button
            onClick={() => setSelectedList('fincen')}
            className={`px-3 py-1  font-medium text-xs transition ${
              selectedList === 'fincen' ? 'bg-slate-700 text-white' : 'opacity-75 hover:opacity-100'
            }`}
          >
            FinCEN 314(a)
          </button>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b sticky top-0 font-semibold uppercase tracking-wider text-[10px] z-10 ${
              themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043] text-[#bdc1c6]' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <th className="px-3 py-2.5 border-r border-inherit w-24">Watchlist ID</th>
              <th className="px-4 py-2.5 border-r border-inherit w-1/4">Entity / Payee Name</th>
              <th className="px-4 py-2.5 border-r border-inherit w-1/5">Sanctions Program</th>
              <th className="px-3 py-2.5 border-r border-inherit w-20 text-center">Country</th>
              <th className="px-3 py-2.5 border-r border-inherit w-28 text-center">Match Similarity</th>
              <th className="px-3 py-2.5 border-r border-inherit w-32">Status</th>
              <th className="px-3 py-2.5 text-center w-36">Row Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center opacity-60">
                  <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-xs">No watchlist entries matched your search query.</p>
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, index) => {
                const isEditing = editingId === record.id;
                const isHit = record.status === 'Confirmed Hit' || record.matchScore >= 90;
                const isPotential = record.status === 'Potential Match';

                if (isEditing) {
                  return (
                    <tr 
                      key={record.id} 
                      className={themeMode === 'dark' ? 'bg-blue-950/30 border-blue-500/40' : 'bg-blue-50/80 border-blue-200'}
                    >
                      <td className="px-3 py-2 font-mono font-bold border-r border-inherit">
                        {record.id}
                      </td>
                      <td className="px-3 py-2 border-r border-inherit">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className={`w-full px-2 py-1  border text-xs outline-none font-bold ${
                            themeMode === 'dark' ? 'bg-[#202124] border-blue-500 text-white' : 'bg-white border-blue-500 text-slate-900'
                          }`}
                        />
                      </td>
                      <td className="px-3 py-2 border-r border-inherit">
                        <input
                          type="text"
                          value={editForm.program}
                          onChange={(e) => setEditForm({ ...editForm, program: e.target.value })}
                          className={`w-full px-2 py-1  border text-xs outline-none ${
                            themeMode === 'dark' ? 'bg-[#202124] border-blue-500 text-white' : 'bg-white border-blue-500 text-slate-900'
                          }`}
                        />
                      </td>
                      <td className="px-3 py-2 border-r border-inherit text-center">
                        <input
                          type="text"
                          maxLength={3}
                          value={editForm.country}
                          onChange={(e) => setEditForm({ ...editForm, country: e.target.value.toUpperCase() })}
                          className={`w-12 text-center px-1.5 py-1  border text-xs outline-none font-mono ${
                            themeMode === 'dark' ? 'bg-[#202124] border-blue-500 text-white' : 'bg-white border-blue-500 text-slate-900'
                          }`}
                        />
                      </td>
                      <td className="px-3 py-2 border-r border-inherit text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={editForm.matchScore}
                          onChange={(e) => setEditForm({ ...editForm, matchScore: Number(e.target.value) })}
                          className={`w-16 text-center px-1.5 py-1  border text-xs outline-none font-mono ${
                            themeMode === 'dark' ? 'bg-[#202124] border-blue-500 text-white' : 'bg-white border-blue-500 text-slate-900'
                          }`}
                        />
                      </td>
                      <td className="px-3 py-2 border-r border-inherit">
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                          className={`w-full px-2 py-1  border text-xs outline-none font-bold ${
                            themeMode === 'dark' ? 'bg-[#202124] border-blue-500 text-white' : 'bg-white border-blue-500 text-slate-900'
                          }`}
                        >
                          <option value="Clear">Clear</option>
                          <option value="Potential Match">Potential Match</option>
                          <option value="Confirmed Hit">Confirmed Hit</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(record.id)}
                            className="p-1.5 bg-emerald-800 hover:bg-emerald-700 text-white  shadow-xs"
                            title="Save Changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1.5 bg-slate-600 hover:bg-slate-700 text-white  shadow-xs"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr 
                    key={record.id}
                    className={`transition-colors group ${
                      themeMode === 'dark' 
                        ? 'hover:bg-[#323639] border-[#3c4043]' 
                        : 'hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <td className="px-3 py-2.5 font-mono font-bold text-xs opacity-75 border-r border-inherit">
                      {record.id}
                    </td>

                    <td className="px-4 py-2.5 font-bold border-r border-inherit">
                      <div className="flex items-center gap-1.5">
                        {record.entityType === 'Corporate' ? (
                          <Building className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        ) : record.entityType === 'Routing' ? (
                          <Database className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                        <span className="truncate">{record.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-2.5 text-xs opacity-85 font-mono border-r border-inherit">
                      {record.program}
                    </td>

                    <td className="px-3 py-2.5 text-center font-mono font-bold border-r border-inherit">
                      <span className="px-1.5 py-0.5  bg-black/10 dark:bg-white/10 text-[10px]">
                        {record.country}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 text-center font-mono font-bold border-r border-inherit">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`text-xs ${isHit ? 'text-rose-500 font-extrabold' : isPotential ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {record.matchScore}%
                        </span>
                        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div 
                            className={`h-full ${isHit ? 'bg-rose-500' : isPotential ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${record.matchScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-2.5 border-r border-inherit">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold ${
                        isHit 
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30' 
                          : isPotential 
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                      }`}>
                        {isHit && <AlertTriangle className="w-3 h-3" />}
                        {isPotential && <AlertTriangle className="w-3 h-3" />}
                        {!isHit && !isPotential && <CheckCircle2 className="w-3 h-3" />}
                        <span>{record.status}</span>
                      </span>
                    </td>

                    {/* Per-Row Actions */}
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleStartEdit(record)}
                          className={`p-1.5  transition ${
                            themeMode === 'dark' 
                              ? 'bg-[#3c4043] hover:bg-slate-700 text-blue-400 hover:text-white' 
                              : 'bg-slate-100 hover:bg-slate-700 text-blue-600 hover:text-white'
                          }`}
                          title="Edit Watchlist Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleInsertRow(index)}
                          className={`p-1.5  transition ${
                            themeMode === 'dark' 
                              ? 'bg-[#3c4043] hover:bg-emerald-800 text-emerald-400 hover:text-white' 
                              : 'bg-slate-100 hover:bg-emerald-800 text-emerald-600 hover:text-white'
                          }`}
                          title="Insert New Row Below"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDuplicateRecord(record)}
                          className={`p-1.5  transition ${
                            themeMode === 'dark' 
                              ? 'bg-[#3c4043] hover:bg-purple-800 text-purple-400 hover:text-white' 
                              : 'bg-slate-100 hover:bg-purple-800 text-purple-600 hover:text-white'
                          }`}
                          title="Duplicate Record"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className={`p-1.5  transition ${
                            themeMode === 'dark' 
                              ? 'bg-[#3c4043] hover:bg-rose-800 text-rose-400 hover:text-white' 
                              : 'bg-slate-100 hover:bg-rose-800 text-rose-600 hover:text-white'
                          }`}
                          title="Delete Watchlist Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className={`w-full max-w-lg  border p-6 shadow-2xl space-y-4 ${
            themeMode === 'dark' ? 'bg-[#292a2d] border-[#3c4043] text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-base">Add Watchlist Screening Record</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1  hover:bg-black/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Entity / Payee Name *
                </label>
                <input
                  type="text"
                  required
                  value={newRecord.name}
                  onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                  placeholder="e.g. BARRINGTON OVERSEAS CORP"
                  className={`w-full px-3 py-2  border text-xs outline-none ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
                    Entity Type
                  </label>
                  <select
                    value={newRecord.entityType}
                    onChange={(e) => setNewRecord({ ...newRecord, entityType: e.target.value as any })}
                    className={`w-full px-3 py-2  border text-xs outline-none ${
                      themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="Corporate">Corporate Entity</option>
                    <option value="Individual">Individual Person</option>
                    <option value="Routing">Routing / FI Node</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
                    Country Code
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={newRecord.country}
                    onChange={(e) => setNewRecord({ ...newRecord, country: e.target.value.toUpperCase() })}
                    placeholder="US, KY, PA..."
                    className={`w-full px-3 py-2  border text-xs outline-none font-mono uppercase ${
                      themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Sanctions / Advisory Program
                </label>
                <input
                  type="text"
                  value={newRecord.program}
                  onChange={(e) => setNewRecord({ ...newRecord, program: e.target.value })}
                  placeholder="e.g. SDN List / FinCEN 314(a)"
                  className={`w-full px-3 py-2  border text-xs outline-none ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
                    Match Similarity (0-100)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newRecord.matchScore}
                    onChange={(e) => setNewRecord({ ...newRecord, matchScore: Number(e.target.value) })}
                    className={`w-full px-3 py-2  border text-xs outline-none font-mono ${
                      themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
                    Compliance Status
                  </label>
                  <select
                    value={newRecord.status}
                    onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value as any })}
                    className={`w-full px-3 py-2  border text-xs outline-none font-bold ${
                      themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <option value="Clear">Clear</option>
                    <option value="Potential Match">Potential Match</option>
                    <option value="Confirmed Hit">Confirmed Hit</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-inherit">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2  text-xs font-medium border ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] text-slate-300' : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2  bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold shadow-xs transition"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
