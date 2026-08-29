/**
 * @file PositivePayTriagerModal.tsx
 * @description Commercial Positive Pay Mismatch Auto-Triager modal. Reconciles commercial client check-issue files against presented check images to flag mismatches.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: PositivePayTriagerModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates the Positive Pay reconciliation logic. Compares uploaded check
// images (simulating CAR/LAR and payee extraction) against a mock daily issue
// file to identify discrepancies in Check #, Payee, and Amount before settlement.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, Building2 } from 'lucide-react';
import { ThemeMode } from '../types';

interface PositivePayTriagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const PositivePayTriagerModal: React.FC<PositivePayTriagerModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [triageResult, setTriageResult] = useState<any | null>(null);

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

  const handleRunTriage = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          triage_id: "POS-PAY-2026-X89",
          client_id: "CORP-84729 (Acme Logistics)",
          issue_file_record: {
            check_number: "8842",
            payee: "Global Supplies Inc.",
            amount: "$450.00"
          },
          presented_image_extraction: {
            check_number: "8842",
            payee: "Johnathan Doe",
            amount: "$4,550.00"
          },
          mismatch_detected: true,
          mismatched_fields: ["payee", "amount"],
          decision: "EXCEPTION_HOLD_AND_ALERT",
          recommended_action: "Generate exception alert for commercial client review. Do not settle funds."
        };
        setTriageResult(mockResult);
        setIsAnalyzing(false);
      }, 1500);
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
            <Building2 className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Commercial Positive Pay Auto-Triager</h2>
              <p className="text-xs opacity-75">Reconcile Check Images Against Client Daily Issue Files</p>
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
                Upload Presented Check
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-amber-400 bg-[#292a2d]' : 'border-slate-300 hover:border-amber-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check scan</span>
                  <span className="text-[10px] opacity-60 mt-1">Extract Data & Reconcile</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain rounded" />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setTriageResult(null); }}
                    className="mt-3 px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !triageResult && (
                <button
                  onClick={handleRunTriage}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Reconciling with Issue File...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Positive Pay Triage</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Reconciliation JSON Output
              </label>

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {triageResult ? (
                  <pre className="text-[11px] leading-relaxed text-amber-300">
                    {JSON.stringify(triageResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Building2 className="w-8 h-8" />
                    <p className="text-xs">Upload an image to compare Check #, Payee Name, and Amount against the Commercial Client's daily Positive Pay issue file.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {triageResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              triageResult.mismatch_detected
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {triageResult.mismatch_detected ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {triageResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {triageResult.recommended_action}
                  </div>
                </div>
              </div>
              {triageResult.mismatched_fields && triageResult.mismatched_fields.length > 0 && (
                <div className="flex gap-1.5">
                  {triageResult.mismatched_fields.map((field: string) => (
                    <span key={field} className={`text-[10px] font-bold px-2 py-0.5 rounded bg-black/20 uppercase tracking-wider`}>
                      {field} Mismatch
                    </span>
                  ))}
                </div>
              )}
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
            Close Triager
          </button>
        </div>
      </div>
    </div>
  );
};
