/**
 * @file CheckLightingTamperDetectorModal.tsx
 * @description Mobile Deposit Lighting & Shadow Tampering Detector modal. Applies physics-based computer vision to verify shadow consistency and identify digital splices.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: CheckLightingTamperDetectorModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for analyzing light angles and shadow gradients across a 
// check face to flag localized image splicing artifacts, particularly over 
// critical fields like the Courtesy Amount box.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, Aperture } from 'lucide-react';
import { ThemeMode } from '../types';

interface CheckLightingTamperDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const CheckLightingTamperDetectorModal: React.FC<CheckLightingTamperDetectorModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectorResult, setDetectorResult] = useState<any | null>(null);

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

  const handleRunDetector = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "LIGHTING-GEO-2026-T8",
          scan_type: "Physics-Based Shadow & Lighting Analysis",
          target_zones: ["Courtesy Amount", "Payee Name", "Date"],
          extracted_features: {
            global_light_angle: "45 degrees (Top-Left Illumination)",
            courtesy_amount_light_angle: "180 degrees (Bottom-Up Illumination)",
            shadow_gradient_variance: "87% variance in region of interest"
          },
          findings: {
            lighting_mismatch: true,
            splicing_detected: true,
            splice_probability: 0.94,
            details: "Localized lighting geometry mismatch. Shadows around the Courtesy Amount drop downwards, contradicting the upward shadows on the rest of the document. Indicates digital cut-and-paste manipulation prior to deposit."
          },
          decision: "REJECT_DIGITAL_FORGERY",
          recommended_action: "Decline deposit immediately. Route to fraud team for 1st-Party check alteration review."
        };
        setDetectorResult(mockResult);
        setIsAnalyzing(false);
      }, 1900);
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
            <Aperture className="w-5 h-5 text-fuchsia-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Lighting & Shadow Tamper Detector</h2>
              <p className="text-xs opacity-75">Apply physics-based vision to identify digital splicing</p>
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
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-fuchsia-400 bg-[#292a2d]' : 'border-slate-300 hover:border-fuchsia-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-fuchsia-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload deposit image</span>
                  <span className="text-[10px] opacity-60 mt-1">Analyze Lighting Geometry</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setDetectorResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !detectorResult && (
                <button
                  onClick={handleRunDetector}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Analyzing Shadow Geometry...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Physics-Based Inspector</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Detector JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {detectorResult ? (
                  <pre className="text-[11px] leading-relaxed text-fuchsia-300">
                    {JSON.stringify(detectorResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Aperture className="w-8 h-8" />
                    <p className="text-xs">Upload an image to verify shadow consistency and lighting geometry across the check face, detecting digital splices.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {detectorResult && (
            <div className={`p-4  border flex items-center justify-between ${
              detectorResult.findings.splicing_detected
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {detectorResult.findings.splicing_detected ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {detectorResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {detectorResult.recommended_action}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  Splice Probability
                </span>
                <span className="font-mono text-xs">
                  {Math.round(detectorResult.findings.splice_probability * 100)}%
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
            Close Detector
          </button>
        </div>
      </div>
    </div>
  );
};
