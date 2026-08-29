/**
 * @file LeftSidebar.tsx
 * @description Left navigation sidebar containing document training specimen presets,
 * multi-bank check standard comparison selector, interactive banker training guidance,
 * and compliance audit checklists.
 */

// -----------------------------------------------------------------------------
// NAVIGATION & TOOLS LAYOUT: LeftSidebar.tsx
// -----------------------------------------------------------------------------
// Manages the main workspace navigation, document preset selection, and 
// launches modular AI tools via CustomEvent dispatching (intercepted in App.tsx).
// Maintains separation of concerns by keeping layout distinct from tool logic.
// -----------------------------------------------------------------------------

import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, ShieldAlert, FileText, Layers, BookOpen, 
  Search, Award, Sparkles, CheckSquare, AlertTriangle, ChevronRight, X, Building2, HelpCircle, Plus, Minus, Upload, Eye, FileSpreadsheet, UserCheck, Database, Receipt, Mic, Building, Lock, ClipboardList, Megaphone, FileCheck, UserX, Network, FileSignature, Printer, Camera, Scan, FlaskConical, Landmark, MonitorSmartphone, PenTool, BadgeCheck, FileCode, UserSearch, FileWarning, Droplet, MapPin, Calendar, Briefcase, Aperture, Timer
} from 'lucide-react';
import { DocumentTemplate, ThemeMode, BankStandard, AppTab } from '../types';
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
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenUploadScan: () => void;
  onOpenHelpGuide: () => void;
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
  activeTab,
  setActiveTab,
  onOpenUploadScan,
  onOpenHelpGuide,
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
          
          {/* Main App Navigation Tabs moved from Header for mobile optimization */}
          <div className={`p-3 rounded-xl border space-y-2 ${
            themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-75 block">Platform Modules</span>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('inspector')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                  activeTab === 'inspector' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : themeMode === 'dark' ? 'hover:bg-[#3c4043]' : 'hover:bg-slate-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Document Inspector</span>
              </button>

              <button
                onClick={() => setActiveTab('standards')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                  activeTab === 'standards' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : themeMode === 'dark' ? 'hover:bg-[#3c4043]' : 'hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Bank Standards & Routing</span>
              </button>

              <button
                onClick={() => setActiveTab('sargenerator')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                  activeTab === 'sargenerator' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : themeMode === 'dark' ? 'hover:bg-[#3c4043]' : 'hover:bg-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Case Notes & SAR Generator</span>
              </button>

              <button
                onClick={() => setActiveTab('excel')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                  activeTab === 'excel' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : themeMode === 'dark' ? 'hover:bg-[#3c4043]' : 'hover:bg-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Excel Cross-Ref Table</span>
              </button>

              <button
                onClick={() => setActiveTab('watchlist')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                  activeTab === 'watchlist' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : themeMode === 'dark' ? 'hover:bg-[#3c4043]' : 'hover:bg-slate-200'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>OFAC & FinCEN Watchlist</span>
              </button>

              <button
                onClick={() => setActiveTab('jsonvault')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                  activeTab === 'jsonvault' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : themeMode === 'dark' ? 'hover:bg-[#3c4043]' : 'hover:bg-slate-200'
                }`}
              >
                <Database className="w-4 h-4 text-blue-400" />
                <span>JSON Match Archive & Vault</span>
              </button>
            </div>

            {/* Quick Actions: OCR Upload, Batch Queue & Help Guide */}
            <div className="pt-2 border-t border-inherit space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onOpenUploadScan}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>OCR Upload</span>
                </button>
                <button
                  onClick={onOpenHelpGuide}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition border ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] hover:bg-[#3c4043]' : 'bg-white border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                  <span>Help Guide</span>
                </button>
              </div>

              {/* Batch STP Ingestion Queue Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-batch-queue'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow transition"
              >
                <Layers className="w-4 h-4" />
                <span>Batch STP Queue & Ingestion</span>
              </button>

              {/* Driver's License KYC Extractor Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-kyc-extractor'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Driver's License KYC Extractor</span>
              </button>

              {/* Check Fraud & Alteration Analyzer Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-check-fraud-analyzer'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-medium text-xs shadow transition"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Check Fraud & Alteration Analyzer</span>
              </button>

              {/* Thermal Receipt ATM Claim Reader Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-atm-claim-reader'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs shadow transition"
              >
                <Receipt className="w-4 h-4" />
                <span>Thermal Receipt ATM Claim Reader</span>
              </button>

              {/* Banker Voice Note to CRM Task Converter Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-banker-voice-crm'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-medium text-xs shadow transition"
              >
                <Mic className="w-4 h-4" />
                <span>Banker Voice Note to CRM Task Converter</span>
              </button>

              {/* Paper Loan Application Digitizer Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-paper-loan-digitizer'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow transition"
              >
                <Building className="w-4 h-4" />
                <span>Paper Loan Application Digitizer</span>
              </button>

              {/* Branch Physical Security & Audit Scanner Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-branch-security-audit'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-medium text-xs shadow transition"
              >
                <Lock className="w-4 h-4" />
                <span>Branch Physical Security Audit Scanner</span>
              </button>

              {/* Handwritten Dual-Custody Vault Log Inspector Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-vault-log-inspector'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs shadow transition"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Vault Log Handwriting Inspector</span>
              </button>

              {/* Retail Branch Marketing Signage Compliance Auditor Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-marketing-signage-audit'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium text-xs shadow transition"
              >
                <Megaphone className="w-4 h-4" />
                <span>Marketing Signage Compliance Auditor</span>
              </button>

              {/* Mismatched Amount Verifier Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-mismatched-amount-verifier'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-medium text-xs shadow transition"
              >
                <FileCheck className="w-4 h-4" />
                <span>Mismatched Amount Verifier (Vision)</span>
              </button>

              {/* Payee Alteration Inspector Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-payee-alteration-inspector'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-medium text-xs shadow transition"
              >
                <UserX className="w-4 h-4" />
                <span>Payee Alteration Inspector (Vision)</span>
              </button>

              {/* Check Kiting Analyzer Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-check-kiting-analyzer'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs shadow transition"
              >
                <Network className="w-4 h-4" />
                <span>Check Kiting & Float Analyzer (GNN)</span>
              </button>

              {/* Forged Counter Signature Inspector Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-forged-endorsement-inspector'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs shadow transition"
              >
                <FileSignature className="w-4 h-4" />
                <span>Forged Counter Signature Inspector (Vision)</span>
              </button>

              {/* Synthetic Check Stock Counterfeit Detector Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-synthetic-stock-detector'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium text-xs shadow transition"
              >
                <Printer className="w-4 h-4" />
                <span>Synthetic Stock Counterfeit Detector (Vision)</span>
              </button>

              {/* ATM Check Image-Quality Triage Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-atm-image-quality-triage'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-medium text-xs shadow transition"
              >
                <Camera className="w-4 h-4" />
                <span>ATM Check Deposit Image-Quality Triage</span>
              </button>

              {/* Unrecognized Account Routing Block Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-blocked-routing-interceptor'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-medium text-xs shadow transition"
              >
                <Network className="w-4 h-4" />
                <span>Unrecognized Account Routing Block</span>
              </button>

              {/* Commercial Positive Pay Triager Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-positive-pay-triager'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs shadow transition"
              >
                <Building2 className="w-4 h-4" />
                <span>Commercial Positive Pay Auto-Triager</span>
              </button>

              {/* MICR Font & Spacing Integrity Inspector Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-micr-integrity-inspector'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs shadow transition"
              >
                <Scan className="w-4 h-4" />
                <span>MICR Font & Spacing Integrity</span>
              </button>

              {/* Chemical Wash Screener Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-chemical-wash-screener'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-medium text-xs shadow transition"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Chemical Wash & Fiber Screener</span>
              </button>

              {/* Out-of-State Issuer First-Check Agent Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-out-of-state-issuer-agent'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-medium text-xs shadow transition"
              >
                <Landmark className="w-4 h-4" />
                <span>High-Risk Out-of-State Issuer Agent</span>
              </button>

              {/* RDC Digital Screen-Capture Filter Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-rdc-screen-capture-filter'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-medium text-xs shadow transition"
              >
                <MonitorSmartphone className="w-4 h-4" />
                <span>RDC Digital Screen-Capture Filter</span>
              </button>

              {/* Payee Endorsement Cross-Checker Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-payee-endorsement-cross-checker'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white font-medium text-xs shadow transition"
              >
                <PenTool className="w-4 h-4" />
                <span>Payee Endorsement Cross-Checker</span>
              </button>

              {/* Fake Cashier's Check Validator Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-fake-cashiers-check-validator'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs shadow transition"
              >
                <BadgeCheck className="w-4 h-4" />
                <span>Fake Cashier's Check Validator</span>
              </button>

              {/* EXIF Metadata Auditor Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-exif-metadata-auditor'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs shadow transition"
              >
                <FileCode className="w-4 h-4" />
                <span>EXIF Metadata & Image Auditor</span>
              </button>

              {/* Payee Name Matching Agent Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-payee-name-matching-agent'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-medium text-xs shadow transition"
              >
                <UserSearch className="w-4 h-4" />
                <span>Payee Name Matching Agent</span>
              </button>

              {/* Stolen Blank Check Predictor Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-stolen-blank-check-predictor'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-orange-700 hover:bg-orange-800 text-white font-medium text-xs shadow transition"
              >
                <FileWarning className="w-4 h-4" />
                <span>Stolen Blank Check Predictor</span>
              </button>

              {/* Check Watermark Vision Auditor Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-check-watermark-vision-auditor'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-medium text-xs shadow transition"
              >
                <Droplet className="w-4 h-4" />
                <span>Check Watermark Vision Auditor</span>
              </button>

              {/* RDC Geolocation Risk Engine Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-rdc-geolocation-risk-engine'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-medium text-xs shadow transition"
              >
                <MapPin className="w-4 h-4" />
                <span>RDC Geolocation Risk Engine</span>
              </button>

              {/* Check Date Verifier Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-check-date-verifier'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow transition"
              >
                <Calendar className="w-4 h-4" />
                <span>Post & Stale-Dated Verifier</span>
              </button>

              {/* Synthetic Payroll Batch Verifier Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-synthetic-payroll-verifier'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs shadow transition"
              >
                <Briefcase className="w-4 h-4" />
                <span>Synthetic Payroll Batch Verifier</span>
              </button>

              {/* Cashier's Check API Inspector Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-cashiers-check-api-inspector'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow transition"
              >
                <Landmark className="w-4 h-4" />
                <span>Cashier's Check API Inspector</span>
              </button>

              {/* Lighting & Shadow Tamper Detector Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-lighting-tamper-detector'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-medium text-xs shadow transition"
              >
                <Aperture className="w-4 h-4" />
                <span>Lighting & Shadow Tamper</span>
              </button>

              {/* Altered Payable Line Screener Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-altered-payable-line-screener'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow transition"
              >
                <PenTool className="w-4 h-4" />
                <span>Altered Payable Line Screener</span>
              </button>

              {/* Third-Party Signature Verification Agent Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-signature-verification-agent'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow transition"
              >
                <FileSignature className="w-4 h-4" />
                <span>Dual-Signature Verifier</span>
              </button>

              {/* Account Dormancy Activation Screener Button */}
              <button
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-dormancy-screener'))}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-xs shadow transition"
              >
                <Timer className="w-4 h-4" />
                <span>Account Dormancy Screener</span>
              </button>
            </div>
          </div>
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

