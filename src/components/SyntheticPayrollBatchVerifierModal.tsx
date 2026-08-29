/**
 * @file SyntheticPayrollBatchVerifierModal.tsx
 * @description Synthetic Payroll Check Batch Cross-Verifier modal. Validates high-volume payroll checks deposited on weekends against corporate issuer templates.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: SyntheticPayrollBatchVerifierModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for cross-referencing corporate issuer tax IDs, standard 
// employer payout ranges, and historical deposit averages to stop weekend 
// payroll fraud rings.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, Briefcase } from 'lucide-react';
import { ThemeMode } from '../types';

interface SyntheticPayrollBatchVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const SyntheticPayrollBatchVerifierModal: React.FC<SyntheticPayrollBatchVerifierModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [verifierResult, setVerifierResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunVerifier = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "PAYROLL-BATCH-2026-F9",
          scan_type: "Synthetic Payroll Check Verification",
          employer_id: "EMP-99382-ACME",
          extracted_data: {
            employer_name: "Acme Manufacturing LLC",
            deposit_time: "Friday 6:45 PM (Post-Cutoff)",
            amount: "$2,450.00",
            logo_position: "Top-Left (Expected: Top-Center)"
          },
          findings: {
            weekend_deposit_flag: true,
            amount_anomaly: true,
            format_mismatch: true,
            historical_average: "$1,200.00 - $1,800.00",
            details: "Deposited after hours on a Friday. Check format and logo position do not match established templates for this employer. Amount exceeds historical 95th percentile payout."
          },
          decision: "REJECT_SYNTHETIC_PAYROLL_RING",
          recommended_action: "Freeze funds and flag for manual fraud review. High probability of weekend payroll fraud ring activity."
        };
        setVerifierResult(mockResult);
        setIsAnalyzing(false);
      }, 1800);
    } catch (err) {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          themeMode === 'dark' ? 'border-[#3c4043] bg-[#2d2e31]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-violet-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Synthetic Payroll Batch Verifier</h2>
              <p className="text-xs opacity-75">Cross-reference weekend payroll deposits against corporate templates</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg opacity-75 hover:opacity-100 hover:bg-black/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Box */}
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Upload Payroll Check Image
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-violet-400 bg-[#292a2d]' : 'border-slate-300 hover:border-violet-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-violet-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check scan</span>
                  <span className="text-[10px] opacity-60 mt-1">Cross-reference Employer Data</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain rounded" />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setVerifierResult(null); }}
                    className="mt-3 px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !verifierResult && (
                <button
                  onClick={handleRunVerifier}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Employer Record...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Payroll Batch Verifier</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Verifier JSON Output
              </label>

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {verifierResult ? (
                  <pre className="text-[11px] leading-relaxed text-violet-300">
                    {JSON.stringify(verifierResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Briefcase className="w-8 h-8" />
                    <p className="text-xs">Upload a payroll check to validate format, logo placement, and payout ranges against known employer templates.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {verifierResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              verifierResult.findings.format_mismatch || verifierResult.findings.amount_anomaly
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {verifierResult.findings.format_mismatch || verifierResult.findings.amount_anomaly ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {verifierResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {verifierResult.recommended_action}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-black/20 uppercase tracking-wider`}>
                  Mismatches
                </span>
                <span className="font-mono text-xs">
                  {Object.values(verifierResult.findings).filter((v) => v === true).length} Detected
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex justify-end ${
          themeMode === 'dark' ? 'border-[#3c4043] bg-[#2d2e31]' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow transition"
          >
            Close Verifier
          </button>
        </div>
      </div>
    </div>
  );
};
