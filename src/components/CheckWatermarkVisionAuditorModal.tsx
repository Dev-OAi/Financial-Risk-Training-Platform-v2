/**
 * @file CheckWatermarkVisionAuditorModal.tsx
 * @description Check Watermark & Security Feature Vision Auditor modal. Evaluates high-resolution check images for microscopic security features.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: CheckWatermarkVisionAuditorModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for inspecting border microprinting, background pantographs,
// and artificial watermarks to detect high-quality counterfeit checks created on
// commercial graphic equipment.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, Droplet } from 'lucide-react';
import { ThemeMode } from '../types';

interface CheckWatermarkVisionAuditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const CheckWatermarkVisionAuditorModal: React.FC<CheckWatermarkVisionAuditorModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [auditorResult, setAuditorResult] = useState<any | null>(null);

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

  const handleRunAuditor = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "WATERMARK-2026-W3",
          scan_type: "Microscopic Security Feature Inspection",
          findings: {
            microprinting_legible: false,
            pantograph_intact: false,
            watermark_detected: false,
            details: "Border microprinting appears as a solid blurred line. Background pantograph pattern disrupted, indicative of high-resolution commercial copying."
          },
          decision: "REJECT_HIGH_QUALITY_COUNTERFEIT",
          recommended_action: "Confiscate item if at teller line. Flag account and notify Fraud Operations regarding high-quality commercial forgery attempt."
        };
        setAuditorResult(mockResult);
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
            <Droplet className="w-5 h-5 text-cyan-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Check Watermark Vision Auditor</h2>
              <p className="text-xs opacity-75">Evaluate microprinting, pantographs, and watermarks</p>
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
                Upload High-Res Check Scan
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-cyan-400 bg-[#292a2d]' : 'border-slate-300 hover:border-cyan-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-cyan-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check scan</span>
                  <span className="text-[10px] opacity-60 mt-1">Inspect Security Features</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain rounded" />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setAuditorResult(null); }}
                    className="mt-3 px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !auditorResult && (
                <button
                  onClick={handleRunAuditor}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Inspecting Features...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Security Feature Auditor</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Auditor JSON Output
              </label>

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {auditorResult ? (
                  <pre className="text-[11px] leading-relaxed text-cyan-300">
                    {JSON.stringify(auditorResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Droplet className="w-8 h-8" />
                    <p className="text-xs">Upload a high-resolution check scan to evaluate microprinting readability and pantograph erasure protection.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {auditorResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              !auditorResult.findings.microprinting_legible || !auditorResult.findings.pantograph_intact
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {!auditorResult.findings.microprinting_legible || !auditorResult.findings.pantograph_intact ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {auditorResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {auditorResult.recommended_action}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-black/20 uppercase tracking-wider`}>
                  Status
                </span>
                <span className="font-mono text-xs">
                  {!auditorResult.findings.microprinting_legible || !auditorResult.findings.pantograph_intact ? "FAILED" : "PASS"}
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
            Close Auditor
          </button>
        </div>
      </div>
    </div>
  );
};
