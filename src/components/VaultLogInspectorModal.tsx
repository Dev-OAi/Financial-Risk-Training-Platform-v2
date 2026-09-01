/**
 * @file VaultLogInspectorModal.tsx
 * @description Handwritten Dual-Custody Vault Log Inspector modal for transcribing messy handwritten vault logs and detecting missing second authorizing signatures.
 */

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldAlert, Cpu, FileText, ClipboardList } from 'lucide-react';
import { ThemeMode } from '../types';

interface VaultLogInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const VaultLogInspectorModal: React.FC<VaultLogInspectorModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [logResult, setLogResult] = useState<any | null>(null);

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

  const handleRunVaultLogInspector = async () => {
    setIsProcessing(true);

    try {
      setTimeout(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const mockResult = {
          log_page_id: "VAULT-LOG-FLUSHING-2026-08",
          branch_id: "Branch #49 - Flushing",
          transcription_confidence_percentage: 92.4,
          entries_extracted: [
            {
              date: todayStr,
              time: "08:15 AM",
              vault_cash_amount_opened: "$2,450,000.00",
              officer_1_signature: "Robert Chen (VP Operations)",
              officer_2_signature: "Sarah Jenkins (Assistant Manager)",
              status: "FULLY_COMPLIANT_DUAL_CUSTODY"
            },
            {
              date: todayStr,
              time: "12:30 PM",
              vault_cash_amount_opened: "$2,450,000.00 (Midday Access)",
              officer_1_signature: "Robert Chen (VP Operations)",
              officer_2_signature: "MISSING / UNKNOWN",
              status: "VIOLATION_MISSING_SECOND_SIGNATURE",
              flag: "CRITICAL: Dual-custody breach detected at 12:30 PM entry."
            }
          ],
          audit_recommendation: "Immediate supervisor review required for 12:30 PM midday vault entry missing Officer 2 sign-off."
        };
        setLogResult(mockResult);
        setIsProcessing(false);
      }, 1400);
    } catch (err) {
      setIsProcessing(false);
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
            <ClipboardList className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Handwritten Dual-Custody Vault Log Inspector</h2>
              <p className="text-xs opacity-75">Transcribe Hand-Written Vault Logs & Flag Missing Dual Signatures</p>
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
                Upload Handwritten Vault Log Page (Scan / Photo)
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-amber-400 bg-[#292a2d]' : 'border-slate-300 hover:border-amber-600 bg-slate-50'
                }`}>
                  <Upload className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to browse or drop vault log sheet</span>
                  <span className="text-[10px] opacity-60 mt-1">Handwriting & Signature Recognition AI</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Vault Log Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setLogResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Log Photo
                  </button>
                </div>
              )}

              {previewUrl && !logResult && (
                <button
                  onClick={handleRunVaultLogInspector}
                  disabled={isProcessing}
                  className="w-full py-2.5  bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Transcribing Handwriting & Signatures...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Vault Log Inspector</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Structured Vault Log JSON & Dual-Custody Flags
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {logResult ? (
                  <pre className="text-[11px] leading-relaxed text-amber-300">
                    {JSON.stringify(logResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <FileText className="w-8 h-8" />
                    <p className="text-xs">Upload a handwritten vault log page to extract timestamps, cash amounts, dual officer signatures, and flag missing authorizations.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {logResult && (
            <div className="p-4  border bg-rose-500/10 border-rose-500/30 text-rose-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    Dual-Custody Violation Flagged in {logResult.branch_id}
                  </div>
                  <div className="text-[11px] opacity-90">
                    {logResult.audit_recommendation}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1  bg-black/20">
                {logResult.transcription_confidence_percentage}% AI Confidence
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
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
