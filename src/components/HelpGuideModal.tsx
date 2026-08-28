/**
 * @file HelpGuideModal.tsx
 * @description Comprehensive user guide modal explaining how to use the Financial Risk & Compliance Platform.
 */

import React from 'react';
import { HelpCircle, X, ShieldCheck, Eye, BookOpen, FileSpreadsheet, Upload, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { ThemeMode } from '../types';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border transition-colors ${
        themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Platform User Guide & Quick Start Manual</h2>
              <p className="text-xs opacity-75">Learn how to inspect financial documents, verify bank standards, and generate compliance reports.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Section 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-base text-blue-500">
              <Eye className="w-5 h-5" />
              <span>1. Document Inspector Tab</span>
            </div>
            <p className="opacity-90 leading-relaxed pl-7">
              The primary workspace where you inspect financial checks, invoices, and wire instructions.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-7 opacity-85 text-xs">
              <li><strong>Click Hotspots:</strong> Click any of the color-coded glowing hotspot markers (Payee Name, Amount Box, MICR E-13B Line) to view detailed vulnerability analysis in the Right Sidebar.</li>
              <li><strong>Compare Mode:</strong> Click the <strong>Compare Good vs Bad</strong> toggle in the header to view side-by-side comparative analysis between genuine and fraudulent specimens.</li>
              <li><strong>Left Menu Presets:</strong> Switch between pre-loaded training templates (Payroll Check, Cashier Check, Altered Check) using the Left Sidebar menu.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-base text-emerald-500">
              <Upload className="w-5 h-5" />
              <span>2. AI Vision OCR Forensic Scanner</span>
            </div>
            <p className="opacity-90 leading-relaxed pl-7">
              Upload your own scanned check or invoice image to run instant AI-powered anomaly detection.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-7 opacity-85 text-xs">
              <li>Click <strong>Upload OCR Scan</strong> in the Left Sidebar to upload any image file.</li>
              <li>Gemini Vision AI will automatically extract text fields, scan for toner ghosting or chemical wash traces, calculate a risk score (0-100), and place custom interactive hotspots on your uploaded document.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-base text-amber-500">
              <BookOpen className="w-5 h-5" />
              <span>3. Bank Standards & Routing Verifier</span>
            </div>
            <p className="opacity-90 leading-relaxed pl-7">
              Cross-reference institutional security specifications and verify routing numbers instantly.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-7 opacity-85 text-xs">
              <li>Switch to the <strong>Bank Standards</strong> tab from the Left Menu.</li>
              <li>Enter any 9-digit American Bankers Association (ABA) routing number into the verifier tool to execute real-time Mod-10 weighted checksum validation.</li>
              <li>Browse bank check specifications, E-13B magnetic ink rules, and paper stock security guidelines.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-base text-purple-500">
              <FileSpreadsheet className="w-5 h-5" />
              <span>4. Collaborative Case Notes & FinCEN SAR Generator</span>
            </div>
            <p className="opacity-90 leading-relaxed pl-7">
              Document your investigation and prepare regulatory reports.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-7 opacity-85 text-xs">
              <li>Switch to the <strong>Case Notes & SAR</strong> tab from the Left Menu.</li>
              <li>Add time-stamped investigator notes, risk severity tags (Info, Warning, Critical), and bookmark inspection findings.</li>
              <li>Click <strong>Generate FinCEN SAR Report</strong> to automatically format all inspection findings into a formal FinCEN Form 111 Suspicious Activity Report ready for printing or export.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-inherit shrink-0 bg-black/5">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Got it, Let's Start Investigating</span>
          </button>
        </div>
      </div>
    </div>
  );
};
