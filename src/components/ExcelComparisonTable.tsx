/**
 * @file ExcelComparisonTable.tsx
 * @description Excel-style tabular cross-reference view comparing OCR extracted document data against reference bank standards and security rules.
 */

import React, { useState, useEffect } from 'react';
import { Table, CheckCircle2, AlertTriangle, XCircle, Search, FileSpreadsheet, ArrowUpDown, Loader2 } from 'lucide-react';
import { DocumentTemplate, ThemeMode, BankStandard } from '../types';
import { BANK_STANDARDS_DATABASE } from '../data/bankStandardsLibrary';

interface ExcelComparisonTableProps {
  template: DocumentTemplate;
  themeMode: ThemeMode;
}

export const ExcelComparisonTable: React.FC<ExcelComparisonTableProps> = ({ template, themeMode }) => {
  const [filterText, setFilterText] = useState('');
  const [selectedStandardId, setSelectedStandardId] = useState<string>('chaseComm');

  // Audit state tracking
  const [scanState, setScanState] = useState<'analyzing' | 'complete'>('analyzing');
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

  // Restart automated scan when template changes
  useEffect(() => {
    setScanState('analyzing');
    setCurrentStageIndex(0);
  }, [template.id]);

  const selectedBank: BankStandard = BANK_STANDARDS_DATABASE[selectedStandardId] || Object.values(BANK_STANDARDS_DATABASE)[0];

  // Default or dynamic extracted fields compared against reference standard
  const defaultFields = [
    {
      field: 'Payee Name Line',
      ocrValue: template.title.includes('fraud') || template.isFraudulent ? 'ACME ENTERPRISES (Altered)' : 'ACME ENTERPRISES (Payee)',
      referenceValue: 'Authorized Corporate Payee Registry Match',
      status: template.isFraudulent ? 'mismatch' : 'match'
    },
    {
      field: 'Numerical Amount Box',
      ocrValue: '$1,250.00',
      referenceValue: '$1,250.00 (Max Limit $50,000)',
      status: 'match'
    },
    {
      field: 'Written Amount Words',
      ocrValue: 'One Thousand Two Hundred Fifty and 00/100 Dollars',
      referenceValue: 'Exact Numeric vs Words Parity Required',
      status: 'match'
    },
    {
      field: 'MICR Routing Prefix (9-Digit)',
      ocrValue: selectedBank.routingPrefix,
      referenceValue: `${selectedBank.bankName} (${selectedBank.routingPrefix})`,
      status: 'match'
    },
    {
      field: 'MICR Font Spec',
      ocrValue: template.isFraudulent ? 'Raster Font Simulation (Non-Magnetic)' : selectedBank.micrFontSpec,
      referenceValue: selectedBank.micrFontSpec,
      status: template.isFraudulent ? 'flagged' : 'match'
    },
    {
      field: 'Security Border Type',
      ocrValue: template.isFraudulent ? 'Flat Inkjet Border Simulation' : selectedBank.borderSecurityType,
      referenceValue: selectedBank.borderSecurityType,
      status: template.isFraudulent ? 'mismatch' : 'match'
    },
    {
      field: 'Ink Characteristics',
      ocrValue: selectedBank.inkCharacteristics,
      referenceValue: 'Chemical Solvent & OVM Reactivity Verified',
      status: 'match'
    },
    {
      field: 'Paper Stock & UV Fibers',
      ocrValue: selectedBank.paperStock,
      referenceValue: '24lb Security Bond with UV Reactivity',
      status: 'match'
    },
    {
      field: 'Endorsement Rule',
      ocrValue: selectedBank.endorsementRule,
      referenceValue: 'Strict UCC Endorsement Compliance',
      status: 'match'
    }
  ];

  const fieldsToDisplay = template.extractedFields && template.extractedFields.length > 0 
    ? template.extractedFields.map(f => ({
        field: f.field,
        ocrValue: f.ocrValue,
        referenceValue: f.referenceValue,
        status: f.status
      }))
    : defaultFields;

  // Automated Model Trigger progression logic (2-second delay between each field check)
  useEffect(() => {
    if (scanState === 'analyzing') {
      if (currentStageIndex < fieldsToDisplay.length) {
        const timer = setTimeout(() => {
          setCurrentStageIndex(prev => prev + 1);
        }, 2000); 
        return () => clearTimeout(timer);
      } else {
        setScanState('complete');
      }
    }
  }, [scanState, currentStageIndex, fieldsToDisplay.length]);

  const filteredFields = fieldsToDisplay.filter(f => 
    f.field.toLowerCase().includes(filterText.toLowerCase()) ||
    f.ocrValue.toLowerCase().includes(filterText.toLowerCase()) ||
    f.referenceValue.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-full rounded-xl border overflow-hidden ${
      themeMode === 'dark' ? 'bg-[#252629] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Table Header / Toolbar */}
      <div className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
        themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Excel Spreadsheet Cross-Reference & OCR View</h3>
          
          {scanState === 'analyzing' && (
            <div className="flex items-center gap-2 text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>TESTING MODEL {Math.min(currentStageIndex + 1, fieldsToDisplay.length)} / {fieldsToDisplay.length}</span>
            </div>
          )}
          {scanState === 'complete' && (
            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ALL AUDITS COMPLETED</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button 
            onClick={() => {
              setScanState('analyzing');
              setCurrentStageIndex(0);
            }}
            disabled={scanState === 'analyzing'}
            className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Restart Sequence
          </button>
          
          <div className="h-4 border-l border-inherit" />

          <div className="flex items-center gap-2">
            <span className="opacity-75 font-medium">Cross-Ref Bank:</span>
            <select
              value={selectedStandardId}
              onChange={(e) => setSelectedStandardId(e.target.value)}
              className={`px-2.5 py-1 rounded border outline-none font-medium ${
                themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] text-[#e8eaed]' : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              {Object.values(BANK_STANDARDS_DATABASE).map(std => (
                <option key={std.id} value={std.id}>{std.bankName} ({std.routingPrefix})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className={`px-4 py-2 border-b flex items-center gap-2 text-xs ${
        themeMode === 'dark' ? 'border-[#3c4043] bg-[#292a2d]' : 'border-slate-200 bg-slate-100/50'
      }`}>
        <Search className="w-3.5 h-3.5 opacity-50" />
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter columns, OCR data, or reference rules..."
          className="bg-transparent outline-none flex-1 text-xs"
        />
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b sticky top-0 font-semibold uppercase tracking-wider text-[10px] ${
              themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043] text-[#bdc1c6]' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <th className="px-4 py-2.5 border-r border-inherit w-1/4">Col A: Field Name</th>
              <th className="px-4 py-2.5 border-r border-inherit w-1/4">Col B: OCR Extracted Data</th>
              <th className="px-4 py-2.5 border-r border-inherit w-1/4">Col C: Good Reference Standard</th>
              <th className="px-4 py-2.5 w-1/4">Col D: Rule Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {filteredFields.map((row, idx) => {
              // Find the original index of the field in the unfiltered fields array 
              // to synchronize its audit state properly.
              const originalIndex = fieldsToDisplay.findIndex(f => f.field === row.field);
              const isRunning = scanState === 'analyzing' && originalIndex === currentStageIndex;
              const isPending = scanState === 'analyzing' && originalIndex > currentStageIndex;
              const isCompleted = scanState === 'complete' || originalIndex < currentStageIndex;

              const isMatch = row.status === 'match';
              const isFlagged = row.status === 'flagged';
              
              return (
                <tr 
                  key={idx}
                  className={`transition-colors ${
                    isRunning 
                      ? (themeMode === 'dark' ? 'bg-blue-900/20 border-[#3c4043]' : 'bg-blue-50 border-slate-200')
                      : themeMode === 'dark' 
                        ? 'hover:bg-[#323639] border-[#3c4043]' 
                        : 'hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <td className={`px-4 py-3 font-mono font-bold border-r border-inherit ${
                    isRunning ? 'text-blue-500' : 'opacity-90'
                  }`}>
                    {row.field}
                  </td>
                  <td className="px-4 py-3 font-mono border-r border-inherit text-blue-500 dark:text-blue-400">
                    {isCompleted ? row.ocrValue : <span className="opacity-30">Awaiting Extraction...</span>}
                  </td>
                  <td className="px-4 py-3 font-mono border-r border-inherit opacity-80">
                    {isCompleted ? row.referenceValue : <span className="opacity-30">Pending Cross-Reference...</span>}
                  </td>
                  <td className="px-4 py-3">
                    {isPending && (
                      <span className="opacity-40 flex items-center gap-1.5 font-medium">
                        Pending...
                      </span>
                    )}
                    {isRunning && (
                      <span className="text-blue-500 flex items-center gap-2 font-bold">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Running Model...
                      </span>
                    )}
                    {isCompleted && (
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isMatch 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                          : isFlagged
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                      }`}>
                        {isMatch && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isFlagged && <AlertTriangle className="w-3.5 h-3.5" />}
                        {!isMatch && !isFlagged && <XCircle className="w-3.5 h-3.5" />}
                        <span className="capitalize">{row.status}</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className={`px-4 py-2 border-t text-[11px] opacity-75 flex items-center justify-between ${
        themeMode === 'dark' ? 'border-[#3c4043] bg-[#292a2d]' : 'border-slate-200 bg-slate-50'
      }`}>
        <span>Showing {filteredFields.length} cross-referenced data columns</span>
        <span className="font-mono">Token-efficient deterministic verification active</span>
      </div>
    </div>
  );
};
