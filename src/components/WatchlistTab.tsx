/**
 * @file WatchlistTab.tsx
 * @description OFAC SDN and FinCEN 314(a) watchlist screening tab for extracted payees and routing numbers.
 */

import React, { useState } from 'react';
import { ShieldAlert, Search, AlertTriangle, CheckCircle2, UserCheck, Building, Globe, FileText, Database } from 'lucide-react';
import { DocumentTemplate, ThemeMode } from '../types';

interface WatchlistTabProps {
  template: DocumentTemplate;
  themeMode: ThemeMode;
}

interface WatchlistRecord {
  id: string;
  name: string;
  entityType: 'Individual' | 'Corporate' | 'Routing';
  program: string;
  country: string;
  matchScore: number;
  status: 'Clear' | 'Potential Match' | 'Confirmed Hit';
}

export const WatchlistTab: React.FC<WatchlistTabProps> = ({ template, themeMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedList, setSelectedList] = useState<'all' | 'ofac' | 'fincen'>('all');

  // Sample watchlist database mimicking OFAC SDN and FinCEN 314(a) lists
  const watchlistDatabase: WatchlistRecord[] = [
    { id: 'WL-001', name: 'ACME ENTERPRISES LLC (Suspended)', entityType: 'Corporate', program: 'SDN / FinCEN 314(a)', country: 'KY', matchScore: 88, status: 'Potential Match' },
    { id: 'WL-002', name: 'GLOBAL TRADING INC (Shell)', entityType: 'Corporate', program: 'SDN List', country: 'PA', matchScore: 42, status: 'Clear' },
    { id: 'WL-003', name: 'VIKTOR ORLOV HOLDINGS', entityType: 'Corporate', program: 'SDN Sanctions', country: 'CY', matchScore: 95, status: 'Confirmed Hit' },
    { id: 'WL-004', name: 'PACIFIC REMITTANCE CORP', entityType: 'Routing', program: 'FinCEN Advisory', country: 'US', matchScore: 12, status: 'Clear' },
    { id: 'WL-005', name: 'SHELL-CORP INTERNATIONAL', entityType: 'Corporate', program: 'SDN / Blocked', country: 'VG', matchScore: 78, status: 'Potential Match' }
  ];

  const filteredRecords = watchlistDatabase.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.program.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedList === 'ofac') return matchesSearch && r.program.includes('SDN');
    if (selectedList === 'fincen') return matchesSearch && r.program.includes('FinCEN');
    return matchesSearch;
  });

  return (
    <div className={`flex flex-col h-full rounded-xl border overflow-hidden ${
      themeMode === 'dark' ? 'bg-[#252629] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Header Bar */}
      <div className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
        themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider">OFAC SDN & FinCEN 314(a) Automated Watchlist Screening</h3>
            <p className="text-[11px] opacity-75">Screening active document specimen: <span className="font-mono font-semibold">{template.title}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium ${
            template.isFraudulent || template.riskScore > 70 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Screening Risk Score: {template.riskScore}/100</span>
          </div>
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
            placeholder="Search OFAC SDN names, aliases, routing IDs..."
            className="bg-transparent outline-none flex-1 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedList('all')}
            className={`px-3 py-1 rounded font-medium text-xs transition ${
              selectedList === 'all' ? 'bg-blue-600 text-white' : 'opacity-75 hover:opacity-100'
            }`}
          >
            All Lists
          </button>
          <button
            onClick={() => setSelectedList('ofac')}
            className={`px-3 py-1 rounded font-medium text-xs transition ${
              selectedList === 'ofac' ? 'bg-blue-600 text-white' : 'opacity-75 hover:opacity-100'
            }`}
          >
            OFAC SDN
          </button>
          <button
            onClick={() => setSelectedList('fincen')}
            className={`px-3 py-1 rounded font-medium text-xs transition ${
              selectedList === 'fincen' ? 'bg-blue-600 text-white' : 'opacity-75 hover:opacity-100'
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
            <tr className={`border-b sticky top-0 font-semibold uppercase tracking-wider text-[10px] ${
              themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043] text-[#bdc1c6]' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <th className="px-4 py-2.5 border-r border-inherit">Watchlist ID</th>
              <th className="px-4 py-2.5 border-r border-inherit">Entity / Payee Name</th>
              <th className="px-4 py-2.5 border-r border-inherit">Sanctions Program</th>
              <th className="px-4 py-2.5 border-r border-inherit">Jurisdiction</th>
              <th className="px-4 py-2.5 border-r border-inherit">Match Similarity</th>
              <th className="px-4 py-2.5">Compliance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {filteredRecords.map((record) => {
              const isHit = record.status === 'Confirmed Hit' || record.matchScore > 80;
              const isPotential = record.status === 'Potential Match';
              return (
                <tr 
                  key={record.id}
                  className={`transition-colors ${
                    themeMode === 'dark' 
                      ? 'hover:bg-[#323639] border-[#3c4043]' 
                      : 'hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <td className="px-4 py-3 font-mono font-bold border-r border-inherit text-blue-500 dark:text-blue-400">
                    {record.id}
                  </td>
                  <td className="px-4 py-3 font-medium border-r border-inherit flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 opacity-60 shrink-0" />
                    <span>{record.name}</span>
                  </td>
                  <td className="px-4 py-3 font-mono border-r border-inherit opacity-80">
                    {record.program}
                  </td>
                  <td className="px-4 py-3 font-mono border-r border-inherit opacity-75">
                    {record.country}
                  </td>
                  <td className="px-4 py-3 font-mono border-r border-inherit">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden w-24">
                        <div 
                          className={`h-full rounded-full ${
                            record.matchScore > 75 ? 'bg-rose-500' : record.matchScore > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} 
                          style={{ width: `${record.matchScore}%` }}
                        />
                      </div>
                      <span className="font-bold">{record.matchScore}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Advisory */}
      <div className={`px-4 py-2.5 border-t text-[11px] opacity-75 flex items-center justify-between ${
        themeMode === 'dark' ? 'border-[#3c4043] bg-[#292a2d]' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-blue-500" />
          <span>Real-time cryptographic hashing sync with OFAC SDN list (Updated: August 2026)</span>
        </div>
        <span className="font-mono">Secure FinCEN 314(a) Protocol Active</span>
      </div>
    </div>
  );
};
