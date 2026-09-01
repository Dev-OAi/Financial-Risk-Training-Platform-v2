/**
 * @file ChemicalWashScreenerModal.tsx
 * @description Chemical Washing & Paper Fiber Alteration Screener modal. Inspects check images for localized discoloration or fiber disruption caused by chemical washing.
 */

// -----------------------------------------------------------------------------
// MODULAR VISION TOOL: ChemicalWashScreenerModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates the logic for multi-spectrum/color channel analysis of checks.
// Detects localized texture anomalies, halo effects around ink, or background 
// pantograph fading indicative of acetone/bleach check-washing.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, FlaskConical } from 'lucide-react';
import { ThemeMode } from '../types';

interface ChemicalWashScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const ChemicalWashScreenerModal: React.FC<ChemicalWashScreenerModalProps> = ({
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
          analysis_id: "CHEM-WASH-2026-X11",
          scan_type: "RGB Multi-Spectrum Channel Analysis",
          target_zones: ["Payee Name", "Legal Amount"],
          findings: {
            fiber_disruption: true,
            halo_effect_detected: true,
            pantograph_fading: "Severe fading observed under Payee line",
            details: "Localized texture anomalies and chromatic shifting detected. Paper fibers show swelling consistent with solvent exposure (e.g., acetone or bleach)."
          },
          alteration_probability: 0.96,
          decision: "REJECT_CHEMICAL_ALTERATION",
          recommended_action: "Immediate exception hold. Check appears washed and rewritten. Alert loss prevention."
        };
        setScreenerResult(mockResult);
        setIsAnalyzing(false);
      }, 1800);
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
            <FlaskConical className="w-5 h-5 text-fuchsia-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Chemical Wash & Fiber Alteration Screener</h2>
              <p className="text-xs opacity-75">Inspect for acetone/bleach washing anomalies across color channels</p>
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
                Upload High-Res Check Scan
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-fuchsia-400 bg-[#292a2d]' : 'border-slate-300 hover:border-fuchsia-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-fuchsia-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload deposit check</span>
                  <span className="text-[10px] opacity-60 mt-1">Multi-Spectrum Analysis</span>
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
                  className="w-full py-2.5  bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Analyzing Paper Fibers...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run RGB Channel Screener</span>
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
                  <pre className="text-[11px] leading-relaxed text-fuchsia-300">
                    {JSON.stringify(screenerResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <FlaskConical className="w-8 h-8" />
                    <p className="text-xs">Upload an image to examine the Payee and Amount fields across RGB color channels for localized texture anomalies or ink halos.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {screenerResult && (
            <div className={`p-4  border flex items-center justify-between ${
              screenerResult.alteration_probability > 0.8
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {screenerResult.alteration_probability > 0.8 ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {screenerResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {screenerResult.findings.details}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  Confidence
                </span>
                <span className="font-mono text-xs">{(screenerResult.alteration_probability * 100).toFixed(1)}%</span>
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
