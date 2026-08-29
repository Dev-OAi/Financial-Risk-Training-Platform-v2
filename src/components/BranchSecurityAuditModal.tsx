/**
 * @file BranchSecurityAuditModal.tsx
 * @description Branch Physical Security & Audit Scanner modal for cross-checking branch teller areas and vault photographs against internal security guidelines and FDIC compliance.
 */

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldCheck, ShieldAlert, Cpu, Camera, Lock } from 'lucide-react';
import { ThemeMode } from '../types';

interface BranchSecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const BranchSecurityAuditModal: React.FC<BranchSecurityAuditModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);

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

  const handleRunSecurityAudit = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          audit_id: "AUDIT-BRANCH-NYC-049",
          branch_location: "Flushing Community Branch #49",
          timestamp: new Date().toISOString(),
          compliance_score_percentage: 75.0,
          non_conformances_detected: 1,
          security_guideline_checks: [
            {
              item: "Loose currency visible on counter surfaces",
              status: "COMPLIANT",
              detail: "All cash drawers are locked and no unsecured currency detected on teller surfaces."
            },
            {
              item: "Vault & Safe Keypads exposed or unshielded",
              status: "NON_COMPLIANT",
              detail: "Vault combination keypad #2 lacks privacy shroud. Immediate privacy hood installation required."
            },
            {
              item: "Mandatory FDIC counter tents visible",
              status: "COMPLIANT",
              detail: "Standard FDIC insured deposit notice tents prominently displayed at all 4 active teller windows."
            }
          ],
          corrective_action_required: "Install privacy shroud on vault keypad #2 within 24 business hours.",
          audit_status: "REQUIRES_BRANCH_MANAGER_SIGN_OFF"
        };
        setAuditResult(mockResult);
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
            <Lock className="w-5 h-5 text-rose-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Branch Physical Security & Audit Scanner</h2>
              <p className="text-xs opacity-75">Cross-Check Vault, Teller Area & Signage Photos Against FDIC Compliance Guidelines</p>
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
                Upload Branch Photo (Teller Counter / Vault / Night Drop)
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-rose-400 bg-[#292a2d]' : 'border-slate-300 hover:border-rose-600 bg-slate-50'
                }`}>
                  <Camera className="w-8 h-8 text-rose-500 mb-2 animate-bounce" />
                  <span className="text-xs font-medium text-center">Click to snap or upload branch security photo</span>
                  <span className="text-[10px] opacity-60 mt-1">Supports PNG, JPG, WEBP</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Branch Preview" className="max-h-[200px] object-contain rounded" />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setAuditResult(null); }}
                    className="mt-3 px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition"
                  >
                    Remove / Change Branch Photo
                  </button>
                </div>
              )}

              {previewUrl && !auditResult && (
                <button
                  onClick={handleRunSecurityAudit}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Security & Compliance...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Physical Security Audit</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Structured Audit Compliance JSON
              </label>

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {auditResult ? (
                  <pre className="text-[11px] leading-relaxed text-rose-300">
                    {JSON.stringify(auditResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <ShieldCheck className="w-8 h-8" />
                    <p className="text-xs">Upload a photo of the branch teller area or vault door to verify loose cash, keypad exposure, and FDIC signage compliance.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {auditResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              auditResult.non_conformances_detected > 0
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {auditResult.non_conformances_detected > 0 ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {auditResult.branch_location} - Score: {auditResult.compliance_score_percentage}%
                  </div>
                  <div className="text-[11px] opacity-90">
                    {auditResult.non_conformances_detected > 0 ? auditResult.corrective_action_required : 'All physical security checks passed successfully.'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-black/20">
                {auditResult.non_conformances_detected} Flagged
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
            Close Audit Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
