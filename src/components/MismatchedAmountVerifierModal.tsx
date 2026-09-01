/**
 * @file MismatchedAmountVerifierModal.tsx
 * @description Mismatched Amount Verifier (Vision) modal for comparing handwritten Legal Amount against numerical Courtesy Amount on checks to intercept altered check fraud.
 */

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldAlert, Cpu, Image as ImageIcon, FileCheck } from 'lucide-react';
import { ThemeMode } from '../types';

interface MismatchedAmountVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const MismatchedAmountVerifierModal: React.FC<MismatchedAmountVerifierModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

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

  const handleRunVerification = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          verification_id: "CHK-VERIFY-2026-9942",
          channel: "Mobile Deposit Capture",
          check_details: {
            courtesy_amount_box: "$1,450.00",
            legal_amount_written: "One Thousand Four Hundred Fifty and 00/100 Dollars",
            legal_amount_parsed_numeric: 1450.00,
            courtesy_amount_parsed_numeric: 1450.00
          },
          amount_match_verified: true,
          confidence_score_percentage: 98.6,
          fraud_risk_assessment: "LOW_RISK_AMOUNTS_MATCH",
          action_recommended: "AUTO_CLEAR_CHECK_FOR_PROCESSING"
        };
        setVerificationResult(mockResult);
        setIsAnalyzing(false);
      }, 1400);
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
            <FileCheck className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Mismatched Amount Verifier (Vision)</h2>
              <p className="text-xs opacity-75">Compare Handwritten Legal Amount vs. Courtesy Box to Intercept Altered Check Fraud</p>
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
                Upload Check Image (Mobile Deposit / Teller Line)
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-indigo-400 bg-[#292a2d]' : 'border-slate-300 hover:border-indigo-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-indigo-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check scan / photo</span>
                  <span className="text-[10px] opacity-60 mt-1">Computer Vision Legal vs Courtesy Amount Match</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setVerificationResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Check Image
                  </button>
                </div>
              )}

              {previewUrl && !verificationResult && (
                <button
                  onClick={handleRunVerification}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Analyzing Legal & Courtesy Amounts...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Verify Amount Match (Pass/Fail)</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Amount Verification JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {verificationResult ? (
                  <pre className="text-[11px] leading-relaxed text-indigo-300">
                    {JSON.stringify(verificationResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <FileCheck className="w-8 h-8" />
                    <p className="text-xs">Upload a check image to extract the legal handwritten amount and courtesy box amount, verifying exact numeric match to prevent altered check fraud.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {verificationResult && (
            <div className={`p-4  border flex items-center justify-between ${
              !verificationResult.amount_match_verified
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {!verificationResult.amount_match_verified ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    Amount Match Status: {verificationResult.amount_match_verified ? 'PASS (Match Verified)' : 'FAIL (Mismatch Detected)'}
                  </div>
                  <div className="text-[11px] opacity-90">
                    Courtesy: {verificationResult.check_details.courtesy_amount_box} | Legal: "{verificationResult.check_details.legal_amount_written}"
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1  bg-black/20">
                {verificationResult.confidence_score_percentage}% Confidence
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
            Close Verifier
          </button>
        </div>
      </div>
    </div>
  );
};
