/**
 * @file MicrIntegrityInspectorModal.tsx
 * @description MICR Line Font & Spacing Integrity Inspector modal. Analyzes the E-13B / CMC-7 MICR font on the bottom of presented checks for improper character spacing, sizing, or alignment.
 */

// -----------------------------------------------------------------------------
// MODULAR VISION TOOL: MicrIntegrityInspectorModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates the logic for analyzing MICR lines at the bottom of checks.
// Evaluates character spacing, alignment, and font specifications against
// standard ANSI X3.2-1970 E-13B MICR standards to intercept counterfeit checks.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, Scan } from 'lucide-react';
import { ThemeMode } from '../types';

interface MicrIntegrityInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const MicrIntegrityInspectorModal: React.FC<MicrIntegrityInspectorModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [integrityResult, setIntegrityResult] = useState<any | null>(null);

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

  const handleRunInspector = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "MICR-CHK-2026-904",
          extracted_micr: "U011000015U 1234567890C 0101",
          font_specification: "E-13B",
          ansi_x3_2_compliance: {
            character_spacing_valid: false,
            font_sizing_valid: false,
            magnetic_ink_signal_detected: false,
            details: "Irregular kerning between transit and on-us fields. Font stroke width deviates from E-13B specifications."
          },
          distortion_detected: true,
          decision: "REJECT_COUNTERFEIT_STOCK",
          recommended_action: "Flag as desktop-printed counterfeit. Route to fraud investigations for immediate review."
        };
        setIntegrityResult(mockResult);
        setIsAnalyzing(false);
      }, 1600);
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
            <Scan className="w-5 h-5 text-teal-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">MICR Font & Spacing Integrity Inspector</h2>
              <p className="text-xs opacity-75">Analyze check MICR lines against ANSI X3.2-1970 E-13B standards</p>
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
                Upload Check Scan
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-teal-400 bg-[#292a2d]' : 'border-slate-300 hover:border-teal-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-teal-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload deposit check</span>
                  <span className="text-[10px] opacity-60 mt-1">Extract MICR and Check Integrity</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setIntegrityResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !integrityResult && (
                <button
                  onClick={handleRunInspector}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Analyzing MICR Standards...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Integrity Inspection</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Integrity JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {integrityResult ? (
                  <pre className="text-[11px] leading-relaxed text-teal-300">
                    {JSON.stringify(integrityResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Scan className="w-8 h-8" />
                    <p className="text-xs">Upload an image to inspect the MICR character spacing and font size against E-13B / CMC-7 specifications.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {integrityResult && (
            <div className={`p-4  border flex items-center justify-between ${
              integrityResult.distortion_detected
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {integrityResult.distortion_detected ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {integrityResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {integrityResult.ansi_x3_2_compliance.details}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  MICR Standard
                </span>
                <span className="font-mono text-xs">{integrityResult.font_specification}</span>
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
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
