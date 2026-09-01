/**
 * @file CheckAlteredPayableLineScreenerModal.tsx
 * @description Altered Payable Line Font & Ink Inconsistency Screener modal. Inspects the "Pay To The Order Of" line for ink density and font mismatches.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: CheckAlteredPayableLineScreenerModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for examining the Payee line of a check image to compare
// font weight, kerning, and ink opacity to flag partial alterations (e.g., mail theft).
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, PenTool } from 'lucide-react';
import { ThemeMode } from '../types';

interface CheckAlteredPayableLineScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const CheckAlteredPayableLineScreenerModal: React.FC<CheckAlteredPayableLineScreenerModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [screenerResult, setScreenerResult] = useState<any | null>(null);

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

  const handleRunScreener = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "INK-FONT-2026-X4",
          scan_type: "Font & Ink Consistency Screening",
          target_zone: "Payable Line (Pay To The Order Of)",
          extracted_data: {
            baseline_text: "ACME CORPORATION",
            divergent_text: " OR JOHN DOE",
            baseline_font_profile: "Helvetica 12pt, 89% Opacity",
            divergent_font_profile: "Arial 11.5pt, 55% Opacity"
          },
          findings: {
            ink_density_variance: true,
            kerning_mismatch: true,
            font_weight_mismatch: true,
            details: "The suffix 'OR JOHN DOE' exhibits a 34% drop in ink opacity and differing typographic kerning compared to the baseline payee 'ACME CORPORATION'. This indicates secondary typewriter or digital alteration."
          },
          decision: "REJECT_ALTERED_PAYEE",
          recommended_action: "Decline deposit. High probability of mail-theft fraud with an appended payee name. Flag account for fraud review."
        };
        setScreenerResult(mockResult);
        setIsAnalyzing(false);
      }, 1700);
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
            <PenTool className="w-5 h-5 text-teal-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Altered Payable Line Screener</h2>
              <p className="text-xs opacity-75">Inspect font and ink consistency on the Payee line</p>
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
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-teal-400 bg-[#292a2d]' : 'border-slate-300 hover:border-teal-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-teal-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check scan</span>
                  <span className="text-[10px] opacity-60 mt-1">Extract Ink & Font Data</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setScreenerResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !screenerResult && (
                <button
                  onClick={handleRunScreener}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Analyzing Ink & Kerning...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Ink & Font Screener</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Screener JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {screenerResult ? (
                  <pre className="text-[11px] leading-relaxed text-teal-300">
                    {JSON.stringify(screenerResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <PenTool className="w-8 h-8" />
                    <p className="text-xs">Upload an image to compare the font weight, kerning, and ink opacity across each character in the Payee name.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {screenerResult && (
            <div className={`p-4  border flex items-center justify-between ${
              screenerResult.findings.ink_density_variance || screenerResult.findings.kerning_mismatch
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {screenerResult.findings.ink_density_variance || screenerResult.findings.kerning_mismatch ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {screenerResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {screenerResult.recommended_action}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  Anomalous Text
                </span>
                <span className="font-mono text-xs text-rose-400 font-bold">
                  "{screenerResult.extracted_data.divergent_text.trim()}"
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
            Close Screener
          </button>
        </div>
      </div>
    </div>
  );
};
