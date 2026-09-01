/**
 * @file ExcelComparisonTable.tsx
 * @description Excel-style tabular cross-reference view comparing OCR extracted document data against reference bank standards and security rules.
 * Allows full manual addition, editing, insertion, deletion, and cross-referencing on every single row and line.
 */

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, CheckCircle2, AlertTriangle, XCircle, Search, 
  ArrowUpDown, Loader2, Plus, Trash2, Edit3, Check, X, 
  Copy, Download, RefreshCw, Layers, ShieldCheck, AlertCircle, HelpCircle
} from 'lucide-react';
import { DocumentTemplate, ThemeMode, BankStandard } from '../types';
import { BANK_STANDARDS_DATABASE } from '../data/bankStandardsLibrary';

export interface ComparisonFieldItem {
  id: string;
  field: string;
  ocrValue: string;
  referenceValue: string;
  status: 'match' | 'mismatch' | 'flagged' | 'pending';
}

interface ExcelComparisonTableProps {
  template: DocumentTemplate;
  themeMode: ThemeMode;
  onUpdateTemplate?: (updated: DocumentTemplate) => void;
}

export const ExcelComparisonTable: React.FC<ExcelComparisonTableProps> = ({ 
  template, 
  themeMode,
  onUpdateTemplate 
}) => {
  const [filterText, setFilterText] = useState('');
  const [selectedStandardId, setSelectedStandardId] = useState<string>('chaseComm');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  
  // Temporary editing form state
  const [editForm, setEditForm] = useState<ComparisonFieldItem>({
    id: '',
    field: '',
    ocrValue: '',
    referenceValue: '',
    status: 'match'
  });

  // Modal or inline add new row state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<{
    field: string;
    ocrValue: string;
    referenceValue: string;
    status: 'match' | 'mismatch' | 'flagged' | 'pending';
  }>({
    field: '',
    ocrValue: '',
    referenceValue: '',
    status: 'match'
  });

  // Audit state tracking
  const [scanState, setScanState] = useState<'analyzing' | 'complete'>('complete');
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

  const selectedBank: BankStandard = BANK_STANDARDS_DATABASE[selectedStandardId] || Object.values(BANK_STANDARDS_DATABASE)[0];

  // Generate initial default fields based on active template & selected bank
  const generateDefaultFields = (): ComparisonFieldItem[] => [
    {
      id: 'field-1',
      field: 'Payee Name Line',
      ocrValue: template.title.includes('fraud') || template.isFraudulent ? 'ACME ENTERPRISES (Altered)' : 'ACME ENTERPRISES (Payee)',
      referenceValue: 'Authorized Corporate Payee Registry Match',
      status: template.isFraudulent ? 'mismatch' : 'match'
    },
    {
      id: 'field-2',
      field: 'Numerical Amount Box',
      ocrValue: '$1,250.00',
      referenceValue: '$1,250.00 (Max Limit $50,000)',
      status: 'match'
    },
    {
      id: 'field-3',
      field: 'Written Amount Words',
      ocrValue: 'One Thousand Two Hundred Fifty and 00/100 Dollars',
      referenceValue: 'Exact Numeric vs Words Parity Required',
      status: 'match'
    },
    {
      id: 'field-4',
      field: 'MICR Routing Prefix (9-Digit)',
      ocrValue: selectedBank.routingPrefix,
      referenceValue: `${selectedBank.bankName} (${selectedBank.routingPrefix})`,
      status: 'match'
    },
    {
      id: 'field-5',
      field: 'MICR Font Spec',
      ocrValue: template.isFraudulent ? 'Raster Font Simulation (Non-Magnetic)' : selectedBank.micrFontSpec,
      referenceValue: selectedBank.micrFontSpec,
      status: template.isFraudulent ? 'flagged' : 'match'
    },
    {
      id: 'field-6',
      field: 'Security Border Type',
      ocrValue: template.isFraudulent ? 'Flat Inkjet Border Simulation' : selectedBank.borderSecurityType,
      referenceValue: selectedBank.borderSecurityType,
      status: template.isFraudulent ? 'mismatch' : 'match'
    },
    {
      id: 'field-7',
      field: 'Ink Characteristics',
      ocrValue: selectedBank.inkCharacteristics,
      referenceValue: 'Chemical Solvent & OVM Reactivity Verified',
      status: 'match'
    },
    {
      id: 'field-8',
      field: 'Paper Stock & UV Fibers',
      ocrValue: selectedBank.paperStock,
      referenceValue: '24lb Security Bond with UV Reactivity',
      status: 'match'
    },
    {
      id: 'field-9',
      field: 'Endorsement Rule',
      ocrValue: selectedBank.endorsementRule,
      referenceValue: 'Strict UCC Endorsement Compliance',
      status: 'match'
    }
  ];

  // Synchronize state from template or defaults
  const [rows, setRows] = useState<ComparisonFieldItem[]>(() => {
    if (template.extractedFields && template.extractedFields.length > 0) {
      return template.extractedFields.map((f, idx) => ({
        id: `field-${idx}-${Date.now()}`,
        field: f.field,
        ocrValue: f.ocrValue,
        referenceValue: f.referenceValue,
        status: f.status as any
      }));
    }
    return generateDefaultFields();
  });

  // When template ID changes, reload rows
  useEffect(() => {
    if (template.extractedFields && template.extractedFields.length > 0) {
      setRows(template.extractedFields.map((f, idx) => ({
        id: `field-${idx}-${Date.now()}`,
        field: f.field,
        ocrValue: f.ocrValue,
        referenceValue: f.referenceValue,
        status: f.status as any
      })));
    } else {
      setRows(generateDefaultFields());
    }
    setEditingRowId(null);
  }, [template.id, selectedStandardId]);

  // Propagate changes to parent template
  const propagateRowsToTemplate = (newRows: ComparisonFieldItem[]) => {
    setRows(newRows);
    if (onUpdateTemplate) {
      const updatedTemplate: DocumentTemplate = {
        ...template,
        extractedFields: newRows.map(r => ({
          field: r.field,
          ocrValue: r.ocrValue,
          referenceValue: r.referenceValue,
          status: r.status === 'pending' ? 'match' : r.status
        }))
      };
      onUpdateTemplate(updatedTemplate);
    }
  };

  // Row Add / Insert Handler
  const handleInsertRow = (index: number, position: 'above' | 'below') => {
    const newId = `field-custom-${Date.now()}`;
    const insertItem: ComparisonFieldItem = {
      id: newId,
      field: 'New Cross-Reference Item',
      ocrValue: 'Manually entered specimen reading',
      referenceValue: 'Target verification standard',
      status: 'match'
    };

    const targetIndex = position === 'above' ? index : index + 1;
    const updated = [...rows];
    updated.splice(targetIndex, 0, insertItem);
    propagateRowsToTemplate(updated);
    
    // Automatically start editing the new row
    setEditingRowId(newId);
    setEditForm(insertItem);
  };

  // Add Row from top modal / form
  const handleAddNewRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRowData.field.trim()) return;

    const newItem: ComparisonFieldItem = {
      id: `field-manual-${Date.now()}`,
      field: newRowData.field.trim(),
      ocrValue: newRowData.ocrValue.trim() || 'Manual OCR Input',
      referenceValue: newRowData.referenceValue.trim() || 'Required Verification Value',
      status: newRowData.status
    };

    const updated = [...rows, newItem];
    propagateRowsToTemplate(updated);
    setIsAddModalOpen(false);
    setNewRowData({
      field: '',
      ocrValue: '',
      referenceValue: '',
      status: 'match'
    });
  };

  // Delete Row Handler
  const handleDeleteRow = (id: string) => {
    const updated = rows.filter(r => r.id !== id);
    propagateRowsToTemplate(updated);
    if (editingRowId === id) {
      setEditingRowId(null);
    }
  };

  // Duplicate Row Handler
  const handleDuplicateRow = (row: ComparisonFieldItem) => {
    const newItem: ComparisonFieldItem = {
      ...row,
      id: `field-dup-${Date.now()}`,
      field: `${row.field} (Copy)`
    };
    const updated = [...rows, newItem];
    propagateRowsToTemplate(updated);
  };

  // Start Editing Row
  const handleStartEdit = (row: ComparisonFieldItem) => {
    setEditingRowId(row.id);
    setEditForm({ ...row });
  };

  // Save Editing Row
  const handleSaveEdit = (id: string) => {
    const updated = rows.map(r => r.id === id ? { ...editForm, id } : r);
    propagateRowsToTemplate(updated);
    setEditingRowId(null);
  };

  // Cancel Editing Row
  const handleCancelEdit = () => {
    setEditingRowId(null);
  };

  // Reset to Bank Defaults
  const handleResetDefaults = () => {
    const defaults = generateDefaultFields();
    propagateRowsToTemplate(defaults);
    setEditingRowId(null);
  };

  // Export Table as CSV
  const handleExportCSV = () => {
    const header = ['Field Name', 'OCR Extracted Value', 'Good Reference Standard', 'Rule Status'];
    const csvContent = [
      header.join(','),
      ...rows.map(r => `"${r.field.replace(/"/g, '""')}","${r.ocrValue.replace(/"/g, '""')}","${r.referenceValue.replace(/"/g, '""')}","${r.status}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cross_reference_${template.title.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered rows for display
  const filteredRows = rows.filter(r => 
    r.field.toLowerCase().includes(filterText.toLowerCase()) ||
    r.ocrValue.toLowerCase().includes(filterText.toLowerCase()) ||
    r.referenceValue.toLowerCase().includes(filterText.toLowerCase()) ||
    r.status.toLowerCase().includes(filterText.toLowerCase())
  );

  const matchCount = rows.filter(r => r.status === 'match').length;
  const mismatchCount = rows.filter(r => r.status === 'mismatch').length;
  const flaggedCount = rows.filter(r => r.status === 'flagged').length;

  return (
    <div className={`flex flex-col h-full  border overflow-hidden shadow-xs ${
      themeMode === 'dark' ? 'bg-[#252629] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Top Header & Cross-Ref Toolbar */}
      <div className={`px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
        themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2  bg-emerald-500/10 text-emerald-500">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm uppercase tracking-wider">Excel Cross-Reference & Line-Item Auditor</h3>
              <span className="text-[10px] font-mono px-2 py-0.5  bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                {rows.length} Active Lines
              </span>
            </div>
            <p className="text-[11px] opacity-75 mt-0.5">
              Manually enter, cross-reference, edit, add, or remove verification checkpoints line-by-line.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Add Manual Line Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5  bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
            title="Manually enter a new cross-reference item"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item / Row</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-3 py-1.5  font-medium text-xs border transition ${
              themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] hover:bg-[#3c4043] text-slate-200' : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Reset to Bank Standard Defaults */}
          <button
            onClick={handleResetDefaults}
            className={`flex items-center gap-1.5 px-2.5 py-1.5  font-medium text-xs border transition ${
              themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] hover:bg-[#3c4043] text-slate-300' : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-600'
            }`}
            title="Reset table to default bank specification rules"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Bank Standard Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="opacity-75 font-medium hidden sm:inline">Bank Standard:</span>
            <select
              value={selectedStandardId}
              onChange={(e) => setSelectedStandardId(e.target.value)}
              className={`px-2.5 py-1.5  border outline-none font-medium text-xs ${
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

      {/* Summary Scoreboard Bar & Search Filter */}
      <div className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
        themeMode === 'dark' ? 'border-[#3c4043] bg-[#292a2d]' : 'border-slate-200 bg-slate-100/70'
      }`}>
        {/* Search filter */}
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 opacity-50 shrink-0" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter rows, OCR text, rules, or status..."
            className="bg-transparent outline-none flex-1 text-xs"
          />
          {filterText && (
            <button onClick={() => setFilterText('')} className="opacity-50 hover:opacity-100">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Audit Metrics Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5  bg-emerald-500/10 text-emerald-500 font-medium text-[11px] border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>{matchCount} Match</span>
          </div>
          {mismatchCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5  bg-rose-500/10 text-rose-500 font-medium text-[11px] border border-rose-500/20">
              <XCircle className="w-3 h-3" />
              <span>{mismatchCount} Discrepancy</span>
            </div>
          )}
          {flaggedCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5  bg-amber-500/10 text-amber-500 font-medium text-[11px] border border-amber-500/20">
              <AlertTriangle className="w-3 h-3" />
              <span>{flaggedCount} Flagged</span>
            </div>
          )}
        </div>
      </div>

      {/* Spreadsheet Table Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b sticky top-0 font-semibold uppercase tracking-wider text-[10px] z-10 ${
              themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043] text-[#bdc1c6]' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <th className="px-3 py-2.5 border-r border-inherit w-10 text-center">#</th>
              <th className="px-4 py-2.5 border-r border-inherit w-1/4">Col A: Field / Feature</th>
              <th className="px-4 py-2.5 border-r border-inherit w-1/4">Col B: OCR Extracted / Specimen Reading</th>
              <th className="px-4 py-2.5 border-r border-inherit w-1/4">Col C: Good Reference Standard</th>
              <th className="px-3 py-2.5 border-r border-inherit w-32">Col D: Status</th>
              <th className="px-3 py-2.5 text-center w-36">Row Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center opacity-60">
                  <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-xs">No cross-reference lines match your search.</p>
                  <button
                    onClick={() => setFilterText('')}
                    className="mt-2 text-xs text-blue-500 hover:underline font-medium"
                  >
                    Clear Filter
                  </button>
                </td>
              </tr>
            ) : (
              filteredRows.map((row, index) => {
                const isEditing = editingRowId === row.id;
                const isMatch = row.status === 'match';
                const isMismatch = row.status === 'mismatch';
                const isFlagged = row.status === 'flagged';

                if (isEditing) {
                  return (
                    <tr 
                      key={row.id} 
                      className={themeMode === 'dark' ? 'bg-blue-950/30 border-blue-500/40' : 'bg-blue-50/80 border-blue-200'}
                    >
                      <td className="px-3 py-2 text-center font-mono font-bold opacity-60 border-r border-inherit">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 border-r border-inherit">
                        <input
                          type="text"
                          value={editForm.field}
                          onChange={(e) => setEditForm({ ...editForm, field: e.target.value })}
                          placeholder="Field name (e.g. Payee Line)"
                          className={`w-full px-2.5 py-1.5  border text-xs outline-none font-bold ${
                            themeMode === 'dark' ? 'bg-[#202124] border-blue-500 text-white' : 'bg-white border-blue-500 text-slate-900'
                          }`}
                        />
                      </td>
                      <td className="px-3 py-2 border-r border-inherit">
                        <textarea
                          rows={2}
                          value={editForm.ocrValue}
                          onChange={(e) => setEditForm({ ...editForm, ocrValue: e.target.value })}
                          placeholder="OCR reading or manual entry"
                          className={`w-full px-2.5 py-1.5  border text-xs outline-none font-mono resize-none ${
                            themeMode === 'dark' ? 'bg-[#202124] border-blue-500 text-blue-300' : 'bg-white border-blue-500 text-blue-700'
                          }`}
                        />
                      </td>
                      <td className="px-3 py-2 border-r border-inherit">
                        <textarea
                          rows={2}
                          value={editForm.referenceValue}
                          onChange={(e) => setEditForm({ ...editForm, referenceValue: e.target.value })}
                          placeholder="Target standard reference"
                          className={`w-full px-2.5 py-1.5  border text-xs outline-none font-mono resize-none ${
                            themeMode === 'dark' ? 'bg-[#202124] border-blue-500 text-slate-200' : 'bg-white border-blue-500 text-slate-800'
                          }`}
                        />
                      </td>
                      <td className="px-3 py-2 border-r border-inherit">
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                          className={`w-full px-2 py-1.5  border text-xs outline-none font-bold ${
                            themeMode === 'dark' ? 'bg-[#202124] border-blue-500 text-white' : 'bg-white border-blue-500 text-slate-900'
                          }`}
                        >
                          <option value="match">Match (Verified)</option>
                          <option value="mismatch">Mismatch (Altered)</option>
                          <option value="flagged">Flagged (Suspicious)</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(row.id)}
                            className="p-1.5 bg-emerald-800 hover:bg-emerald-700 text-white  shadow-xs transition"
                            title="Save Row Changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1.5 bg-slate-600 hover:bg-slate-700 text-white  shadow-xs transition"
                            title="Cancel Editing"
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
                    key={row.id}
                    className={`transition-colors group ${
                      themeMode === 'dark' 
                        ? 'hover:bg-[#323639] border-[#3c4043]' 
                        : 'hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {/* Index */}
                    <td className="px-3 py-2.5 text-center font-mono font-bold opacity-60 border-r border-inherit">
                      {index + 1}
                    </td>

                    {/* Field Name */}
                    <td className="px-4 py-2.5 font-bold border-r border-inherit">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{row.field}</span>
                      </div>
                    </td>

                    {/* OCR Extracted Data */}
                    <td className="px-4 py-2.5 font-mono border-r border-inherit text-blue-500 dark:text-blue-400">
                      <div className="break-words line-clamp-2" title={row.ocrValue}>
                        {row.ocrValue}
                      </div>
                    </td>

                    {/* Good Reference Standard */}
                    <td className="px-4 py-2.5 font-mono border-r border-inherit opacity-85">
                      <div className="break-words line-clamp-2" title={row.referenceValue}>
                        {row.referenceValue}
                      </div>
                    </td>

                    {/* Rule Status Badge */}
                    <td className="px-3 py-2.5 border-r border-inherit">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold ${
                        isMatch 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : isFlagged
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          : isMismatch
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/30'
                      }`}>
                        {isMatch && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isFlagged && <AlertTriangle className="w-3.5 h-3.5" />}
                        {isMismatch && <XCircle className="w-3.5 h-3.5" />}
                        <span className="capitalize">{row.status}</span>
                      </span>
                    </td>

                    {/* Per-Row Add / Edit / Delete Actions */}
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Edit Row Button */}
                        <button
                          onClick={() => handleStartEdit(row)}
                          className={`p-1.5  transition ${
                            themeMode === 'dark' 
                              ? 'bg-[#3c4043] hover:bg-slate-700 text-blue-400 hover:text-white' 
                              : 'bg-slate-100 hover:bg-slate-700 text-blue-600 hover:text-white'
                          }`}
                          title="Edit Row Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Insert Row Above/Below */}
                        <button
                          onClick={() => handleInsertRow(index, 'below')}
                          className={`p-1.5  transition ${
                            themeMode === 'dark' 
                              ? 'bg-[#3c4043] hover:bg-emerald-800 text-emerald-400 hover:text-white' 
                              : 'bg-slate-100 hover:bg-emerald-800 text-emerald-600 hover:text-white'
                          }`}
                          title="Insert New Row Below"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate Row */}
                        <button
                          onClick={() => handleDuplicateRow(row)}
                          className={`p-1.5  transition ${
                            themeMode === 'dark' 
                              ? 'bg-[#3c4043] hover:bg-purple-800 text-purple-400 hover:text-white' 
                              : 'bg-slate-100 hover:bg-purple-800 text-purple-600 hover:text-white'
                          }`}
                          title="Duplicate Row"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Row Button */}
                        <button
                          onClick={() => handleDeleteRow(row.id)}
                          className={`p-1.5  transition ${
                            themeMode === 'dark' 
                              ? 'bg-[#3c4043] hover:bg-rose-800 text-rose-400 hover:text-white' 
                              : 'bg-slate-100 hover:bg-rose-800 text-rose-600 hover:text-white'
                          }`}
                          title="Delete Row"
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

      {/* Footer Info & Quick-Add Strip */}
      <div className={`px-4 py-2.5 border-t text-[11px] flex flex-wrap items-center justify-between gap-3 ${
        themeMode === 'dark' ? 'border-[#3c4043] bg-[#292a2d]' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="flex items-center gap-3 opacity-80">
          <span>Showing <strong>{filteredRows.length}</strong> of {rows.length} lines</span>
          <span>•</span>
          <span className="font-mono">Editable cross-reference matrix active</span>
        </div>

        <button
          onClick={() => handleInsertRow(rows.length - 1, 'below')}
          className="flex items-center gap-1 font-bold text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add another row at the bottom</span>
        </button>
      </div>

      {/* Modal for Adding New Item / Line */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className={`w-full max-w-lg  border p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
            themeMode === 'dark' ? 'bg-[#292a2d] border-[#3c4043] text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b border-inherit pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base">Manually Enter Cross-Reference Line Item</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1  hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewRow} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Field / Check Characteristic Name *
                </label>
                <input
                  type="text"
                  required
                  value={newRowData.field}
                  onChange={(e) => setNewRowData({ ...newRowData, field: e.target.value })}
                  placeholder="e.g. Authorized Signatory Line, Micro-print Line, Bank Routing..."
                  className={`w-full px-3 py-2  border text-xs outline-none ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] focus:border-blue-400' : 'bg-slate-50 border-slate-300 focus:border-blue-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Specimen / OCR Extracted Reading
                </label>
                <input
                  type="text"
                  value={newRowData.ocrValue}
                  onChange={(e) => setNewRowData({ ...newRowData, ocrValue: e.target.value })}
                  placeholder="e.g. John Doe / $5,000.00 / 021000021"
                  className={`w-full px-3 py-2  border text-xs outline-none font-mono ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] focus:border-blue-400' : 'bg-slate-50 border-slate-300 focus:border-blue-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Good Bank Reference Standard Value
                </label>
                <input
                  type="text"
                  value={newRowData.referenceValue}
                  onChange={(e) => setNewRowData({ ...newRowData, referenceValue: e.target.value })}
                  placeholder="e.g. Must match authorized signatory card on file"
                  className={`w-full px-3 py-2  border text-xs outline-none font-mono ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] focus:border-blue-400' : 'bg-slate-50 border-slate-300 focus:border-blue-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
                  Verification Status
                </label>
                <select
                  value={newRowData.status}
                  onChange={(e) => setNewRowData({ ...newRowData, status: e.target.value as any })}
                  className={`w-full px-3 py-2  border text-xs outline-none font-bold ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <option value="match">Match (Verified Compliant)</option>
                  <option value="mismatch">Mismatch (Discrepancy / Alteration)</option>
                  <option value="flagged">Flagged (Requires Escalation)</option>
                  <option value="pending">Pending Review</option>
                </select>
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
                  className="px-5 py-2  bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  Add Cross-Ref Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
