/**
 * @file AtmImageQualityTriageModal.tsx
 * @description ATM Check Deposit Image-Quality Triage modal for verifying resolution, lighting, and contrast of check images captured at ATMs.
 */

// -----------------------------------------------------------------------------
// MODULAR VISION TOOL: AtmImageQualityTriageModal.tsx
// -----------------------------------------------------------------------------
// Isolates the ATM / Mobile Deposit image quality inspection workflow. 
// Evaluates resolution and lighting before downstream fraud detection models
// are invoked. Maintained as a decoupled standalone component.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, Cpu, Image as ImageIcon, Camera } from 'lucide-react';
import { ThemeMode } from '../types';

interface AtmImageQualityTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const AtmImageQualityTriageModal: React.FC<AtmImageQualityTriageModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [qualityResult, setQualityResult] = useState<any | null>(null);

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
          triage_id: "ATM-IMG-2026-881",
          capture_channel: "ATM / Mobile Deposit",
          quality_metrics: {
            resolution_dpi: 96,
            lighting_uniformity: "POOR - Heavy shadows on right quadrant",
            contrast_ratio: "LOW - Faded ink or washed out",
            blur_detection: "INTENTIONAL_MOTION_BLUR_DETECTED"
          },
          usability_score: 32.5,
          decision: "REJECT_IMAGE_UNREADABLE",
          recommended_action: "Prompt user at ATM to retake photo with better lighting. Do not accept for automated clearing."
        };
        setQualityResult(mockResult);
        setIsAnalyzing(false);
      }, 1300);
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
            <Camera className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">ATM Check Image-Quality Triage</h2>
              <p className="text-xs opacity-75">Inspect Resolution, Lighting, & Contrast Before Fraud Analysis</p>
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
                Upload ATM/Mobile Deposit Capture
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-indigo-400 bg-[#292a2d]' : 'border-slate-300 hover:border-indigo-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-indigo-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload deposit scan</span>
                  <span className="text-[10px] opacity-60 mt-1">Image Quality & Blur Analyzer</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain rounded" />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setQualityResult(null); }}
                    className="mt-3 px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !qualityResult && (
                <button
                  onClick={handleRunTriage}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Resolution & Blur...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Quality Triage</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Quality Analyzer JSON Output
              </label>

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {qualityResult ? (
                  <pre className="text-[11px] leading-relaxed text-indigo-300">
                    {JSON.stringify(qualityResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Camera className="w-8 h-8" />
                    <p className="text-xs">Upload an image to inspect if resolution and lighting are sufficient for automated CAR/LAR extraction and payee validation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {qualityResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              qualityResult.decision === "REJECT_IMAGE_UNREADABLE"
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {qualityResult.decision === "REJECT_IMAGE_UNREADABLE" ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    Triage Decision: {qualityResult.decision}
                  </div>
                  <div className="text-[11px] opacity-90">
                    {qualityResult.recommended_action}
                  </div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded bg-black/20`}>
                {qualityResult.usability_score}/100 Quality
              </span>
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
            Close Triage
          </button>
        </div>
      </div>
    </div>
  );
};
