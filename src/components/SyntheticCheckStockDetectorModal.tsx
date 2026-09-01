/**
 * @file SyntheticCheckStockDetectorModal.tsx
 * @description Synthetic Check Stock Counterfeit Detector modal for comparing check layout, MICR line alignment, and security pantographs against known bank templates to intercept digitally printed fake checks.
 */

// -----------------------------------------------------------------------------
// MODULAR VISION TOOL: SyntheticCheckStockDetectorModal.tsx
// -----------------------------------------------------------------------------
// This component encapsulates the visual inspection workflow for identifying 
// synthetic (digitally fabricated) check stock. By separating this feature into
// its own file, the main App.tsx remains lean. It triggers its own local state 
// analysis simulation and yields a structured JSON decision.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldAlert, Cpu, Image as ImageIcon, Printer } from 'lucide-react';
import { ThemeMode } from '../types';

interface SyntheticCheckStockDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const SyntheticCheckStockDetectorModal: React.FC<SyntheticCheckStockDetectorModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedBank, setSelectedBank] = useState<string>("Wells Fargo Commercial");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<any | null>(null);

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

  const handleRunDetection = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          detection_id: "SYNTHETIC-CHECK-2026-3392",
          bank_template_compared: selectedBank,
          stock_analysis: {
            micr_line_font_compliance: "NON_STANDARD_E13B_RASTER_FONT",
            security_pantograph_pattern: "MISSING_VOID_PANTOGRAPH_BACKGROUND",
            paper_weight_and_fiber_fluorescence: "INKJET_PRINTER_DOT_MATRIX_PATTERNS",
            layout_alignment_variance: "+4.2mm routing number misalignment"
          },
          synthetic_stock_confidence: 97.4,
          counterfeit_classification: "DIGITALLY_PRINTED_SYNTHETIC_STOCK",
          recommended_action: "Immediate item confiscation and SAR filing. Do not release funds."
        };
        setDetectionResult(mockResult);
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
            <Printer className="w-5 h-5 text-purple-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Synthetic Check Stock Counterfeit Detector</h2>
              <p className="text-xs opacity-75">Compare Layout, MICR Alignment, & Security Pantographs Against Known Bank Templates</p>
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
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-2">
                  Target Bank Template Library
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className={`w-full px-3 py-2.5  border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    themeMode === 'dark' ? 'bg-[#292a2d] border-[#5f6368] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Wells Fargo Commercial">Wells Fargo Commercial</option>
                  <option value="US Bank Legacy">US Bank Legacy</option>
                  <option value="Chase Commercial Standard">Chase Commercial Standard</option>
                  <option value="Citibank NA Corporate">Citibank NA Corporate</option>
                </select>
              </div>

              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Upload Check Scan / Image
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-purple-400 bg-[#292a2d]' : 'border-slate-300 hover:border-purple-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-purple-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check scan</span>
                  <span className="text-[10px] opacity-60 mt-1">MICR & Security Pantograph Vision Analyzer</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[160px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setDetectionResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !detectionResult && (
                <button
                  onClick={handleRunDetection}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Comparing Against Bank Template...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Synthetic Stock Analysis</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Counterfeit Detector JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {detectionResult ? (
                  <pre className="text-[11px] leading-relaxed text-purple-300">
                    {JSON.stringify(detectionResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Printer className="w-8 h-8" />
                    <p className="text-xs">Upload a check image to analyze MICR font rasterization, security pantograph background patterns, and layout alignment against known banking templates.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {detectionResult && (
            <div className="p-4  border bg-rose-500/10 border-rose-500/30 text-rose-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    Counterfeit Status: {detectionResult.counterfeit_classification}
                  </div>
                  <div className="text-[11px] opacity-90">
                    {detectionResult.recommended_action}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1  bg-black/20">
                {detectionResult.synthetic_stock_confidence}% Synthetic
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
            className="px-4 py-2  bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs shadow transition"
          >
            Close Detector
          </button>
        </div>
      </div>
    </div>
  );
};
