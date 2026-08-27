/**
 * @file LeftSidebar.tsx
 * @description Left navigation sidebar containing document training specimen presets,
 * multi-bank check standard comparison selector, interactive banker training guidance,
 * and compliance audit checklists.
 */

import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, ShieldAlert, FileText, Layers, BookOpen, 
  Search, Award, Sparkles, CheckSquare, AlertTriangle, ChevronRight, X, Building2, HelpCircle, Plus, Minus, Upload
} from 'lucide-react';
import { DocumentTemplate, ThemeMode, BankStandard } from '../types';
import { INITIAL_TEMPLATES, BANK_STANDARDS } from '../data/mockTemplates';

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: DocumentTemplate;
  onSelectTemplate: (template: DocumentTemplate) => void;
  templates?: Record<string, DocumentTemplate>;
  onAddTemplate?: (template: DocumentTemplate) => void;
  onRemoveTemplate?: (id: string) => void;
  themeMode: ThemeMode;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen,
  onClose,
  currentTemplate,
  onSelectTemplate,
  templates = INITIAL_TEMPLATES,
  onAddTemplate,
  onRemoveTemplate,
  themeMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templatesList = Object.values(templates);
  const bankStandardsList = Object.values(BANK_STANDARDS);

  // State for selected bank comparison standard in the dropdown
  const [selectedBankId, setSelectedBankId] = useState<string>(bankStandardsList[0].id);

  // Find active bank standard object
  const currentBankStandard: BankStandard = BANK_STANDARDS[selectedBankId] || bankStandardsList[0];

  const handleAddNewPreset = () => {
    if (!onAddTemplate) return;
    const newId = `custom-${Date.now()}`;
    const newTpl: DocumentTemplate = {
      id: newId,
      title: `Custom Check Specimen #${Object.keys(templates).length + 1}`,
      subtitle: 'Newly Added Financial Specimen',
      type: 'check',
      theme: 'blue',
      isFraudulent: false,
      riskScore: 15,
      confidence: 98.2,
      summary: 'Custom uploaded or created check specimen ready for compliance review and verification.',
      hotspots: [
        {
          id: 'h1',
          title: 'Primary Security Band',
          x: 40,
          y: 50,
          riskLevel: 'low',
          titleDescription: 'Standard Micro-Printing & Watermark Check',
          detail: 'No anomalies detected in primary security band. Clear toner consistency.'
        }
      ]
    };
    onAddTemplate(newTpl);
  };

  const handleRemoveCurrent = () => {
    if (!onRemoveTemplate || templatesList.length <= 1) return;
    onRemoveTemplate(currentTemplate.id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAddTemplate) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newId = `uploaded-${Date.now()}`;
      const uploadedTpl: DocumentTemplate = {
        id: newId,
        title: file.name.replace(/\.[^/.]+$/, ""),
        subtitle: 'Uploaded Check Specimen for Review',
        type: 'check',
        theme: 'blue',
        imageUrl: dataUrl,
        isFraudulent: false,
        riskScore: 24,
        confidence: 95.0,
        summary: `User uploaded image "${file.name}" for financial check review and verification.`,
        hotspots: [
          {
            id: 'uh1',
            title: 'Uploaded Image Area',
            x: 50,
            y: 50,
            riskLevel: 'low',
            titleDescription: 'Custom Uploaded Specimen Audit',
            detail: 'Reviewing structural layout, signature block, and routing numbers from uploaded specimen.'
          }
        ]
      };
      onAddTemplate(uploadedTpl);
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  return (
    <>


      {/* Sidebar Container */}
      <aside className={`fixed lg:relative z-40 h-full flex flex-col shrink-0 border-r transition-all duration-300 ease-in-out ${
        isOpen ? 'w-80 lg:w-72 translate-x-0 opacity-100' : 'w-0 lg:w-0 -translate-x-full lg:-translate-x-full opacity-0 overflow-hidden border-r-0'
      } ${
        themeMode === 'dark' 
          ? 'bg-[#292a2d] border-[#3c4043] text-[#e8eaed]' 
          : 'bg-white border-[#dadce0] text-[#202124]'
      }`}>
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400 dark:text-emerald-400" />
            <h2 className="font-semibold text-xs uppercase tracking-wider text-inherit">Training & Compliance</h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded transition-colors lg:hidden ${themeMode === 'dark' ? 'hover:bg-[#3c4043] text-[#bdc1c6]' : 'hover:bg-[#f1f3f4] text-[#5f6368]'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
          
          {/* Bank Standard Comparison Selector Section */}
          <div className={`p-3 rounded-lg border ${
            themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'
          }`}>
            <div className="flex items-center gap-1.5 mb-2">
              <Building2 className="w-3.5 h-3.5 text-[#bdc1c6]" />
              <label htmlFor="bank-standard-select" className="text-[11px] font-bold uppercase tracking-wider text-inherit">
                Bank Standard Comparison
              </label>
            </div>
            <select
              id="bank-standard-select"
              value={selectedBankId}
              onChange={(e) => setSelectedBankId(e.target.value)}
              className={`w-full text-xs p-2 rounded border focus:outline-none focus:ring-1 focus:ring-[#5f6368] font-medium ${
                themeMode === 'dark'
                  ? 'bg-[#202124] border-[#3c4043] text-[#e8eaed]'
                  : 'bg-white border-[#dadce0] text-[#202124]'
              }`}
            >
              {bankStandardsList.map((bank) => (
                <option key={bank.id} value={bank.id} className={themeMode === 'dark' ? 'bg-[#202124] text-[#e8eaed]' : 'bg-white text-[#202124]'}>
                  {bank.bankName}
                </option>
              ))}
            </select>

            {/* Interactive Bank Training Details Box */}
            <div className={`mt-2.5 pt-2 border-t space-y-1 text-[11px] ${themeMode === 'dark' ? 'border-[#3c4043] text-[#bdc1c6]' : 'border-[#dadce0] text-[#5f6368]'}`}>
              <div className="flex justify-between">
                <span className="font-semibold">Routing Prefix:</span>
                <span className="font-mono font-bold text-inherit">{currentBankStandard.routingPrefix}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">MICR Spec:</span>
                <span className="truncate max-w-[150px] font-medium" title={currentBankStandard.micrFontSpec}>{currentBankStandard.micrFontSpec}</span>
              </div>
              <div className={`mt-1 text-[10px] p-2 rounded border leading-snug ${
                themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-[#dadce0] text-[#202124]'
              }`}>
                <span className="font-bold text-inherit block mb-0.5">Trainer Guidance:</span>
                {currentBankStandard.trainingTip}
              </div>
            </div>
          </div>

          {/* Presets & Templates Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-inherit opacity-90">
                Financial Check & Doc Presets
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleAddNewPreset}
                  className={`p-1 rounded border transition-colors ${
                    themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043]' : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124] hover:bg-[#e8eaed]'
                  }`}
                  title="Add new preset"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRemoveCurrent}
                  disabled={templatesList.length <= 1}
                  className={`p-1 rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043]' : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124] hover:bg-[#e8eaed]'
                  }`}
                  title="Remove selected preset"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Add item / upload check image button */}
            <div className="mb-2.5 px-1">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-1.5 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  themeMode === 'dark'
                    ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Add item (Upload Check)</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {templatesList.map((tpl) => {
                const isActive = currentTemplate.id === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      onSelectTemplate(tpl);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 border ${
                      isActive 
                        ? themeMode === 'dark'
                          ? 'bg-[#3c4043] border-[#5f6368] text-[#e8eaed] shadow-xs'
                          : 'bg-[#e8eaed] border-[#dadce0] text-[#202124] shadow-xs font-semibold'
                        : themeMode === 'dark'
                          ? 'bg-[#292a2d] border-[#3c4043] hover:bg-[#323639] text-[#bdc1c6]'
                          : 'bg-white border-[#dadce0] hover:bg-[#f1f3f4] text-[#202124]'
                    }`}
                  >
                    <div className={`p-1.5 rounded mt-0.5 shrink-0 ${
                      tpl.isFraudulent 
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {tpl.isFraudulent ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-inherit truncate">{tpl.title}</div>
                      <div className="text-[10px] text-[#bdc1c6] mt-0.5 truncate font-medium">{tpl.subtitle}</div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          tpl.riskScore > 50 ? 'bg-rose-500/10 text-rose-400 font-semibold' : 'bg-emerald-500/10 text-emerald-400 font-semibold'
                        }`}>
                          Risk: {tpl.riskScore}/100
                        </span>
                        <ChevronRight className="w-3 h-3 text-[#bdc1c6]" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Educational Checklist Section */}
          <div className="pt-3 border-t border-inherit">
            <div className="text-[11px] font-bold uppercase tracking-wider text-inherit mb-2.5 px-1 flex items-center gap-1.5 opacity-90">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fraud Detection Checklist</span>
            </div>
            <div className="space-y-2 text-xs text-[#bdc1c6] px-1 leading-relaxed font-medium">
              <div className="flex items-start gap-2">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Verify E-13B MICR font magnetic ink properties matching {currentBankStandard.bankName.split(' ')[0]}.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Check for chemical wash or erasure discoloration on payee endorsement line.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Confirm numerical box amount matches written legal text line precisely.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-inherit text-center">
          <div className="text-[10px] text-[#bdc1c6] font-mono font-semibold">
            Compliance Core v2.4 • {currentBankStandard.bankName.split(' ')[0]} Standard
          </div>
        </div>
      </aside>
    </>
  );
};

