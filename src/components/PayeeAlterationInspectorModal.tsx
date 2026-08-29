/**
 * @file PayeeAlterationInspectorModal.tsx
 * @description Payee Deletion & Alteration Detection (Computer Vision) modal for inspecting check payee lines for ink lifting, chemical erasure, or non-matching pen strokes (check washing fraud).
 */

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldAlert, Cpu, Image as ImageIcon, UserX } from 'lucide-react';
import { ThemeMode } from '../types';

interface PayeeAlterationInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const PayeeAlterationInspectorModal: React.FC<PayeeAlterationInspectorModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [inspectionResult, setInspectionResult] = useState<any | null>(null);

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

  const handleRunInspection = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          inspection_id: "PAYEE-AUDIT-2026-8812",
          channel: "Branch Teller Capture",
          payee_analysis: {
            extracted_payee_name: "Metropolitan Utilities Corp",
            ink_texture_uniformity: "SUSPICIOUS_CHEMICAL_WASHING",
            pen_pressure_variance: "High variance detected around letters 'M' and 'e'",
            fiber_disturbance: "Paper surface fibers show chemical bleaching marks",
            anomaly_detected: true
          },
          fraud_risk_score: 94.2,
          detection_status: "FLAGGED_POTENTIAL_CHECK_WASHING",
          recommendation: "Hold item for immediate fraud investigator review. Contact drawer bank to verify payee alteration."
        };
        setInspectionResult(mockResult);
        setIsAnalyzing(false);
      }, 1400);
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
            <UserX className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Payee Deletion & Alteration Detection</h2>
              <p className="text-xs opacity-75">Inspect Check Payee Lines for Chemical Erasure, Ink Washing, & Pen Stroke Anomalies</p>
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
                Upload Check Image (Payee Line Zoom / Full Scan)
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-red-400 bg-[#292a2d]' : 'border-slate-300 hover:border-red-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-red-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check scan / photo</span>
                  <span className="text-[10px] opacity-60 mt-1">Computer Vision Ink Washing & Erasure Detector</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain rounded" />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setInspectionResult(null); }}
                    className="mt-3 px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition"
                  >
                    Remove / Change Check Image
                  </button>
                </div>
              )}

              {previewUrl && !inspectionResult && (
                <button
                  onClick={handleRunInspection}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Payee Ink & Paper Texture...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Inspect Payee Line for Alterations</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Payee Inspection JSON Output
              </label>

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {inspectionResult ? (
                  <pre className="text-[11px] leading-relaxed text-red-300">
                    {JSON.stringify(inspectionResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <UserX className="w-8 h-8" />
                    <p className="text-xs">Upload a check image to analyze the payee line texture for ink lifting, chemical erasure, and non-matching pen strokes indicative of check washing.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {inspectionResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              inspectionResult.payee_analysis.anomaly_detected
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {inspectionResult.payee_analysis.anomaly_detected ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    Payee Status: {inspectionResult.detection_status}
                  </div>
                  <div className="text-[11px] opacity-90">
                    Payee: "{inspectionResult.payee_analysis.extracted_payee_name}" | {inspectionResult.recommendation}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-black/20">
                {inspectionResult.fraud_risk_score}% Risk
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
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
