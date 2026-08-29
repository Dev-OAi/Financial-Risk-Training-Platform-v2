/**
 * @file ForgedEndorsementInspectorModal.tsx
 * @description Forged Counter Signature Inspector (Vision) modal for inspecting rear check endorsement signatures for tracing, mechanical forgery, or missing endorsements.
 */

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldAlert, Cpu, Image as ImageIcon, FileSignature } from 'lucide-react';
import { ThemeMode } from '../types';

interface ForgedEndorsementInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const ForgedEndorsementInspectorModal: React.FC<ForgedEndorsementInspectorModalProps> = ({
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
          inspection_id: "ENDORSE-AUDIT-2026-773",
          channel: "ATM Deposit Capture",
          endorsement_analysis: {
            signature_present: true,
            extracted_endorsement_text: "For Deposit Only - Acq #449102",
            tracing_or_mechanical_forgery_detected: true,
            stroke_velocity_analysis: "Unnatural hesitation points and faint pencil guide tracks detected beneath ink lines",
            anomaly_notes: "Signature appears mechanically traced from a sample exemplar"
          },
          fraud_risk_score: 91.5,
          compliance_status: "FLAGGED_FORGED_COUNTER_SIGNATURE",
          recommended_action: "Reject mobile/ATM deposit. Require in-person branch verification with valid government ID from payee."
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
            <FileSignature className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Forged Counter Signature Inspector (Vision)</h2>
              <p className="text-xs opacity-75">Inspect Rear Endorsement Area for Tracing, Mechanical Forgery, & Missing Signatures</p>
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
                Upload Rear Check Image (Endorsement Block)
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-amber-400 bg-[#292a2d]' : 'border-slate-300 hover:border-amber-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload rear check scan / photo</span>
                  <span className="text-[10px] opacity-60 mt-1">Multimodal Endorsement & Tracing Detector</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Rear Check Preview" className="max-h-[200px] object-contain rounded" />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setInspectionResult(null); }}
                    className="mt-3 px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition"
                  >
                    Remove / Change Rear Image
                  </button>
                </div>
              )}

              {previewUrl && !inspectionResult && (
                <button
                  onClick={handleRunInspection}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Endorsement & Stroke Velocity...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Inspect Endorsement for Tracing</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Endorsement Inspection JSON Output
              </label>

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {inspectionResult ? (
                  <pre className="text-[11px] leading-relaxed text-amber-300">
                    {JSON.stringify(inspectionResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <FileSignature className="w-8 h-8" />
                    <p className="text-xs">Upload the rear image of a check to inspect the endorsement block for missing signatures, pencil guide lines, and mechanical tracing forgery.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {inspectionResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              inspectionResult.endorsement_analysis.tracing_or_mechanical_forgery_detected
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {inspectionResult.endorsement_analysis.tracing_or_mechanical_forgery_detected ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    Endorsement Status: {inspectionResult.compliance_status}
                  </div>
                  <div className="text-[11px] opacity-90">
                    {inspectionResult.recommended_action}
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
