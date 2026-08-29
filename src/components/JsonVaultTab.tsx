/**
 * @file JsonVaultTab.tsx
 * @description JSON Match Archive & Advanced Analytics Vault for storing, reviewing, searching, and re-analyzing historical OCR and Check Fraud JSON extractions.
 */

import React, { useState } from 'react';
import { Database, Search, FileText, CheckCircle2, AlertTriangle, Copy, Check, RefreshCw, Download, ShieldAlert } from 'lucide-react';
import { ThemeMode, DocumentTemplate } from '../types';

interface JsonVaultTabProps {
  themeMode: ThemeMode;
  templates: Record<string, DocumentTemplate>;
  onSelectTemplate: (template: DocumentTemplate) => void;
}

export const JsonVaultTab: React.FC<JsonVaultTabProps> = ({ themeMode, templates, onSelectTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedRecordId, setSelectedRecordId] = useState<string>(Object.keys(templates)[0] || '');

  const templatesList = Object.values(templates) as DocumentTemplate[];

  const filteredTemplates = templatesList.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTemplate = templates[selectedRecordId] || templatesList[0];

  const handleCopyJson = (record: DocumentTemplate) => {
    const jsonStr = JSON.stringify(record, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedId(record.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${
      themeMode === 'dark' ? 'bg-[#202124] text-[#e8eaed]' : 'bg-[#f8f9fa] text-slate-800'
    }`}>
      {/* Top Header Bar */}
      <div className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
        themeMode === 'dark' ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base uppercase tracking-wider">JSON Match Archive & Advanced Analytics Vault</h2>
            <p className="text-xs opacity-75">Store, search, and re-analyze structured OCR extractions and Check Fraud match payloads for long-term compliance audit.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
            {templatesList.length} Archived Records
          </span>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left List of Archived Records */}
        <div className={`w-full lg:w-96 border-r flex flex-col shrink-0 ${
          themeMode === 'dark' ? 'border-[#3c4043] bg-[#252629]' : 'border-slate-200 bg-white'
        }`}>
          {/* Search box */}
          <div className={`p-3.5 border-b flex items-center gap-2.5 ${
            themeMode === 'dark' ? 'border-[#3c4043]' : 'border-slate-200'
          }`}>
            <Search className="w-4 h-4 opacity-50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search archived JSON records..."
              className="bg-transparent outline-none flex-1 text-xs"
            />
          </div>

          {/* Record List */}
          <div className="flex-1 overflow-y-auto divide-y divide-inherit">
            {filteredTemplates.map((tpl) => {
              const isSelected = tpl.id === selectedRecordId;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedRecordId(tpl.id)}
                  className={`p-3.5 cursor-pointer transition-colors flex flex-col gap-1.5 border-l-4 ${
                    isSelected
                      ? 'border-l-blue-600 bg-blue-600/10'
                      : 'border-l-transparent hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs truncate max-w-[200px]">{tpl.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      tpl.isFraudulent ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      Risk: {tpl.riskScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] opacity-75 line-clamp-1">{tpl.summary}</p>
                  <div className="flex items-center gap-2 text-[10px] font-mono opacity-60">
                    <span>Type: {tpl.type.toUpperCase()}</span>
                    <span>•</span>
                    <span>Confidence: {tpl.confidence}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detailed JSON & Advanced Analytics View */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
          {activeTemplate ? (
            <>
              {/* Record Header & Actions */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                themeMode === 'dark' ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeTemplate.isFraudulent ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    <h3 className="font-bold text-sm uppercase tracking-wider">{activeTemplate.title}</h3>
                  </div>
                  <p className="text-xs opacity-75 mt-1">{activeTemplate.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyJson(activeTemplate)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition shadow"
                  >
                    {copiedId === activeTemplate.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === activeTemplate.id ? 'Copied JSON!' : 'Copy Raw JSON'}</span>
                  </button>

                  <button
                    onClick={() => onSelectTemplate(activeTemplate)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition shadow"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Load in Inspector</span>
                  </button>
                </div>
              </div>

              {/* JSON & Hotspots Breakdown */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 overflow-hidden">
                {/* Raw JSON Tree / Structured Payload */}
                <div className={`flex flex-col rounded-xl border overflow-hidden ${
                  themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 border-slate-800 text-slate-100'
                }`}>
                  <div className={`px-4 py-2.5 border-b font-mono text-xs flex items-center justify-between ${
                    themeMode === 'dark' ? 'border-[#3c4043] bg-[#222327]' : 'border-slate-800 bg-slate-950 text-slate-300'
                  }`}>
                    <span>Structured JSON Match Payload</span>
                    <span className="text-[10px] text-emerald-400">RFC 8259 Compliant</span>
                  </div>
                  <div className="p-4 flex-1 overflow-auto font-mono text-[11px] leading-relaxed text-emerald-300">
                    <pre>{JSON.stringify(activeTemplate, null, 2)}</pre>
                  </div>
                </div>

                {/* Hot-Spots & Secondary Compliance Checks */}
                <div className={`flex flex-col rounded-xl border p-4 overflow-y-auto space-y-4 ${
                  themeMode === 'dark' ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200'
                }`}>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-inherit flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>Advanced Compliance Hot-Spots ({activeTemplate.hotspots.length})</span>
                  </h4>

                  <div className="space-y-3">
                    {activeTemplate.hotspots.map((spot, idx) => (
                      <div key={spot.id} className={`p-3 rounded-lg border ${
                        themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{idx + 1}. {spot.title}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            spot.riskLevel === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                            spot.riskLevel === 'high' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {spot.riskLevel}
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold opacity-90">{spot.titleDescription}</div>
                        <p className="text-[11px] opacity-75 mt-1">{spot.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-60 space-y-2">
              <FileText className="w-10 h-10" />
              <p className="text-xs">Select an archived record from the left list to inspect JSON match details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
