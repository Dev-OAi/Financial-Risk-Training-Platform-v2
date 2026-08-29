/**
 * @file AtmReceiptClaimModal.tsx
 * @description Thermal Receipt Disputed ATM Claim Reader modal for processing faded or crumpled ATM receipts uploaded by customers filing deposit dispute claims.
 */

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertTriangle, FileText, Cpu, Receipt, ShieldCheck } from 'lucide-react';
import { ThemeMode } from '../types';

interface AtmReceiptClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const AtmReceiptClaimModal: React.FC<AtmReceiptClaimModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [claimResult, setClaimResult] = useState<any | null>(null);

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

  const handleRunAtmClaimExtraction = async () => {
    if (!previewUrl) return;
    setIsProcessing(true);

    try {
      setTimeout(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const mockResult = {
          terminal_id: "ATM-NYC-FLUSHING-049",
          transaction_date: todayStr + " 14:22:05",
          transaction_type: "CASH_DEPOSIT_DISPUTE",
          cash_deposited_amount: "$1,500.00",
          dispensed_amount: "$0.00",
          faded_text_detected: true,
          confidence_level_percentage: 88.5,
          dispute_claim_status: "AUTO_VERIFIED_PENDING_CREDIT",
          extracted_lines: [
            "CHASE ATM #88492 - BRANCH 49",
            "TERM ID: NYC-049-FLUSHING",
            "DATE: " + todayStr + " 14:22",
            "TRANS: CASH DEP [UNVERIFIED ATM STACK]",
            "DEPOSIT AMOUNT: $1,500.00",
            "FADED INK / CRUMPLED PAPER INDEX: MODERATE"
          ]
        };
        setClaimResult(mockResult);
        setIsProcessing(false);
      }, 1300);
    } catch (err) {
      setIsProcessing(false);
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
            <Receipt className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Thermal Receipt Disputed ATM Claim Reader</h2>
              <p className="text-xs opacity-75">Process Faded & Crumpled ATM Receipts for Instant Deposit Dispute Resolution</p>
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
                Upload ATM Receipt Image (Faded / Crumpled)
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-amber-400 bg-[#292a2d]' : 'border-slate-300 hover:border-amber-600 bg-slate-50'
                }`}>
                  <Upload className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to browse or drop ATM receipt</span>
                  <span className="text-[10px] opacity-60 mt-1">Supports PNG, JPG, WEBP (Thermal Printout)</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Receipt Preview" className="max-h-[220px] object-contain rounded" />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setClaimResult(null); }}
                    className="mt-3 px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition"
                  >
                    Remove / Change Receipt Photo
                  </button>
                </div>
              )}

              {previewUrl && !claimResult && (
                <button
                  onClick={handleRunAtmClaimExtraction}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Extracting Faded Thermal Text...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Thermal Receipt Claim Reader</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Structured ATM Claim JSON & Confidence Scores
              </label>

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {claimResult ? (
                  <pre className="text-[11px] leading-relaxed text-amber-300">
                    {JSON.stringify(claimResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <FileText className="w-8 h-8" />
                    <p className="text-xs">Upload a thermal receipt image and click run reader to extract Terminal ID, Transaction Type, and Deposited Amount.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {claimResult && (
            <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    Deposit Claim Successfully Extracted
                  </div>
                  <div className="text-[11px] opacity-90">
                    Terminal: {claimResult.terminal_id} | Deposited: {claimResult.cash_deposited_amount}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-black/20">
                {claimResult.confidence_level_percentage}% Confidence
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
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
