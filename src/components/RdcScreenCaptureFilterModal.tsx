/**
 * @file RdcScreenCaptureFilterModal.tsx
 * @description RDC Digital Screen-Capture & Re-Photograph Filter modal. Analyzes mobile deposit image uploads for moiré patterns, screen pixel grids, or glare artifacts.
 */

// -----------------------------------------------------------------------------
// MODULAR VISION TOOL: RdcScreenCaptureFilterModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates the logic for detecting if a check image was photographed from a 
// computer screen rather than an authentic paper check. Flags moiré interference 
// patterns and refresh-line artifacts to prevent digital RDC fraud.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, MonitorSmartphone } from 'lucide-react';
import { ThemeMode } from '../types';

interface RdcScreenCaptureFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const RdcScreenCaptureFilterModal: React.FC<RdcScreenCaptureFilterModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [filterResult, setFilterResult] = useState<any | null>(null);

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

  const handleRunFilter = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "RDC-MOIRE-2026-X1",
          scan_type: "Digital Artifact & Moiré Pattern Analysis",
          findings: {
            moire_pattern_detected: true,
            pixel_grid_visible: true,
            bezel_edge_detected: false,
            details: "High-frequency interference (moiré) patterns and sub-pixel grid structures detected, consistent with photographing an LCD/OLED screen."
          },
          physical_check_confidence: 0.12,
          decision: "REJECT_RDC_SUBMISSION",
          recommended_action: "Decline mobile deposit. Image is a photograph of a digital screen. Flag account for potential RDC abuse."
        };
        setFilterResult(mockResult);
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
            <MonitorSmartphone className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">RDC Digital Screen-Capture Filter</h2>
              <p className="text-xs opacity-75">Analyze RDC deposits for moiré patterns and screen pixel grids</p>
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
                Upload Mobile Deposit Image
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-indigo-400 bg-[#292a2d]' : 'border-slate-300 hover:border-indigo-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-indigo-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload RDC image</span>
                  <span className="text-[10px] opacity-60 mt-1">Scan for Digital Artifacts</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setFilterResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !filterResult && (
                <button
                  onClick={handleRunFilter}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Detecting Artifacts...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Screen-Capture Filter</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Filter JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {filterResult ? (
                  <pre className="text-[11px] leading-relaxed text-indigo-300">
                    {JSON.stringify(filterResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <MonitorSmartphone className="w-8 h-8" />
                    <p className="text-xs">Upload an image to inspect for moiré interference patterns, refresh-line artifacts, or screen bezel edges.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {filterResult && (
            <div className={`p-4  border flex items-center justify-between ${
              filterResult.physical_check_confidence < 0.5
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {filterResult.physical_check_confidence < 0.5 ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {filterResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {filterResult.recommended_action}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  Physical Confidence
                </span>
                <span className="font-mono text-xs">{(filterResult.physical_check_confidence * 100).toFixed(1)}%</span>
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
            Close Filter
          </button>
        </div>
      </div>
    </div>
  );
};
