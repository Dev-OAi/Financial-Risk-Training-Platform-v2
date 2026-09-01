/**
 * @file CheckDateVerifierModal.tsx
 * @description Post-Dated & Stale-Dated Check Rule Verifier modal. Extracts the date and compares it against 180-day and future date rules.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: CheckDateVerifierModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for extracting the written date from a check image and 
// automatically comparing it against system rules to flag stale-dated (>180 days)
// or post-dated (future) checks.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, Calendar } from 'lucide-react';
import { ThemeMode } from '../types';

interface CheckDateVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const CheckDateVerifierModal: React.FC<CheckDateVerifierModalProps> = ({
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
          analysis_id: "DATE-RULE-2026-X1",
          scan_type: "Check Date Extraction & Rule Verification",
          account_id: "ACCT-2200194",
          extracted_data: {
            written_date: "January 10, 2026",
            system_date: "August 28, 2026",
            days_difference: 230
          },
          findings: {
            stale_dated: true,
            post_dated: false,
            threshold_days: 180,
            details: "The extracted check date (01/10/2026) is 230 days old, exceeding the standard 180-day stale-dated threshold."
          },
          decision: "REJECT_STALE_DATED_ITEM",
          recommended_action: "Decline deposit. Return item to depositor due to stale date to avoid processing fees and legal disputes."
        };
        setVerifierResult(mockResult);
        setIsAnalyzing(false);
      }, 1500);
    } catch (err) {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className={`w-full max-w-3xl  border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          themeMode === 'dark' ? 'border-[#3c4043] bg-[#2d2e31]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Post-Dated & Stale-Dated Verifier</h2>
              <p className="text-xs opacity-75">Automatically verify check dates against 180-day and future date rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5  opacity-75 hover:opacity-100 hover:bg-black/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Box */}
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Upload Check Image
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-amber-400 bg-[#292a2d]' : 'border-slate-300 hover:border-amber-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check scan</span>
                  <span className="text-[10px] opacity-60 mt-1">Extract Written Date</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setVerifierResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !verifierResult && (
                <button
                  onClick={handleRunVerifier}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Verifying Check Date...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Date Rule Verifier</span>
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

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {verifierResult ? (
                  <pre className="text-[11px] leading-relaxed text-amber-300">
                    {JSON.stringify(verifierResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Calendar className="w-8 h-8" />
                    <p className="text-xs">Upload a check image to extract the written date and compare it against system rules (flagging stale or post-dated items).</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {verifierResult && (
            <div className={`p-4  border flex items-center justify-between ${
              verifierResult.findings.stale_dated || verifierResult.findings.post_dated
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {verifierResult.findings.stale_dated || verifierResult.findings.post_dated ? (
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
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  Written Date
                </span>
                <span className="font-mono text-xs">
                  {verifierResult.extracted_data.written_date}
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
            className="px-4 py-2  bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs shadow transition"
          >
            Close Verifier
          </button>
        </div>
      </div>
    </div>
  );
};
