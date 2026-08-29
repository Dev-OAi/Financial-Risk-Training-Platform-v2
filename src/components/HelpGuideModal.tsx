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

          {/* Section 5 - Added Specialized Vision Detectors */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-base text-rose-500">
              <ShieldCheck className="w-5 h-5" />
              <span>5. Specialized AI Detectors & Interceptors</span>
            </div>
            <p className="opacity-90 leading-relaxed pl-7">
              Utilize specialized Vision AI modules to analyze distinct vector attacks and automated deposit vulnerabilities.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-7 opacity-85 text-xs">
              <li><strong>Synthetic Check Stock Detector:</strong> Compares check layouts, E-13B MICR fonts, and pantograph backgrounds against known bank templates to intercept digitally printed synthetic checks.</li>
              <li><strong>ATM Image-Quality Triage:</strong> Inspects resolution, lighting, and contrast of ATM/Mobile deposit images to ensure legibility before automated clearing.</li>
              <li><strong>Blocked Routing Interceptor:</strong> Cross-references parsed MICR routing numbers against known master threat intelligence blocklists (e.g., FS-ISAC) to instantly hold funds from organized fraud rings.</li>
              <li><strong>Commercial Positive Pay Auto-Triager:</strong> Automatically reconciles presented checks against commercial client issue files to flag mismatched check numbers, payees, or amounts before settlement.</li>
              <li><strong>MICR Font & Spacing Integrity:</strong> Analyzes the E-13B MICR line at the bottom of checks against ANSI X3.2-1970 standards to flag incorrect spacing, sizing, or alignment found in desktop-printed counterfeits.</li>
              <li><strong>Chemical Wash & Fiber Alteration Screener:</strong> Inspects high-resolution images across RGB color channels to detect localized discoloration or fiber disruption caused by acetone or bleach check-washing.</li>
              <li><strong>High-Risk Out-of-State Issuer Agent:</strong> Triggers automated verification workflows for first-time check deposits drawn on small, out-of-state financial institutions.</li>
              <li><strong>RDC Digital Screen-Capture Filter:</strong> Analyzes mobile deposit image uploads for moiré patterns, screen pixel grids, or glare artifacts to prevent RDC fraud via digital screen photos.</li>
              <li><strong>Payee Endorsement & Signature Card Cross-Checker:</strong> Compares the endorsement signature on the back of a deposited check against the account holder's digital signature card on file to calculate visual similarity.</li>
              <li><strong>Fake Cashier's Check & Official Instrument Validator:</strong> Extracted serial formats and security features are verified against known official check templates to prevent high-value synthetic check scams.</li>
              <li><strong>EXIF Metadata & Image Manipulation Auditor:</strong> Inspects the raw image metadata and compression headers of check uploads to detect photo editing software artifacts and tampered timestamps.</li>
              <li><strong>Payee Name vs. Account Holder Name Matching Agent:</strong> Uses fuzzy string matching to compare the "Payee" line against the receiving account's legal name(s), blocking mismatched third-party stolen checks.</li>
              <li><strong>Stolen Blank Check Stock & Out-of-Sequence Predictor:</strong> Monitors check sequence numbers across active checking accounts to detect checks that are significantly out of sequence, indicating potentially stolen blank check stock.</li>
              <li><strong>Check Watermark & Security Feature Vision Auditor:</strong> Evaluates high-resolution check images for microscopic security features, such as microprinting readability and pantograph erasure protection, to detect high-quality commercial counterfeits.</li>
              <li><strong>RDC Device & Geolocation Risk Engine:</strong> Correlates device IP, GPS location, and hardware fingerprints during a mobile deposit to identify anomalies (e.g., VPNs/TOR, &gt;500 miles away, emulator software) and block account takeover or mule activity.</li>
              <li><strong>Post-Dated & Stale-Dated Check Rule Verifier:</strong> Extracts the written date from the check image and automatically compares it against system date rules, flagging items dated more than 6 months in the past or post-dated in the future to reduce return item processing fees.</li>
              <li><strong>Synthetic Payroll Check Batch Cross-Verifier:</strong> Validates high-volume payroll checks deposited on weekends by cross-referencing corporate issuer tax IDs, employer payout ranges, and historical deposit averages to stop weekend payroll fraud rings.</li>
              <li><strong>Real-Time Cashier's Check API Inspector:</strong> Issues an automated verification request against clearinghouse databases using the extracted routing number, serial number, and amount to confirm the legitimacy of external official checks.</li>
              <li><strong>Mobile Deposit Lighting & Shadow Tampering Detector:</strong> Applies physics-based computer vision to verify shadow consistency and lighting geometry across the check face, identifying digital spliced elements (such as pasted amounts).</li>
              <li><strong>Altered Payable Line Font & Ink Inconsistency Screener:</strong> Inspects the font family, line weight, kerning, and ink density on the "Pay To The Order Of" line to detect partial alterations where an extra name or word was typed or written over the original payee.</li>
              <li><strong>Third-Party Signature Verification Agent:</strong> Inspects multi-signature checks (such as corporate dual-signature checks) to verify that all required signature fields are populated and match authorized signers on the corporate signature card.</li>
              <li><strong>Unused Account Dormancy Check Activation Screener:</strong> Flags check deposits or presented drawn checks on accounts that have been dormant or inactive for more than 180 days, locking immediate cash-out channels pending secondary customer verification.</li>
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
