/**
 * @file CheckFraudAnalyzerModal.tsx
 * @description Check Fraud & Alteration Analyzer modal for teller lines & mobile deposit ingest pipelines.
 */

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertTriangle, FileText, Cpu, ShieldAlert, DollarSign } from 'lucide-react';
import { ThemeMode } from '../types';

interface CheckFraudAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const CheckFraudAnalyzerModal: React.FC<CheckFraudAnalyzerModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

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

  const handleRunAnalysis = async () => {
    if (!previewUrl) return;
    setIsProcessing(true);

    try {
      // Simulate or call AI vision for check fraud analysis
      setTimeout(() => {
        const mockResult = {
          written_amount: "One Thousand Two Hundred Fifty Dollars and Zero Cents",
          numerical_amount: "$1,250.00",
          match_status: "MISMATCH_DETECTED",
          fraud_flag: true,
          payee_name: "Acme Industrial Supply Corp.",
          micr_routing: "∷122000496∷ 4829103837⌑ 0842",
          alteration_indicators: [
            "Handwriting stroke pressure variance between written legal amount and numerical amount",
            "Slight background ink disturbance near the cents decimal area",
            "MICR checksum parity check minor anomaly"
          ],
          confidence_score: 94.2
        };
        setAnalysisResult(mockResult);
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
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Check Fraud & Alteration Analyzer</h2>
              <p className="text-xs opacity-75">Teller Line & Mobile Deposit Ingest Pipeline Validation</p>
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
                Upload Check Front / Back Image
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-rose-400 bg-[#292a2d]' : 'border-slate-300 hover:border-rose-600 bg-slate-50'
                }`}>
                  <Upload className="w-8 h-8 text-rose-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to browse or drop check specimen</span>
                  <span className="text-[10px] opacity-60 mt-1">Supports PNG, JPG, WEBP (High-Res Check)</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[220px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setAnalysisResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Check Image
                  </button>
                </div>
              )}

              {previewUrl && !analysisResult && (
                <button
                  onClick={handleRunAnalysis}
                  disabled={isProcessing}
                  className="w-full py-2.5  bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Analyzing Handwriting & Alterations...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Check Fraud & Alteration Scan</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Structured Fraud & Amount Match JSON
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {analysisResult ? (
                  <pre className="text-[11px] leading-relaxed text-rose-300">
                    {JSON.stringify(analysisResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <FileText className="w-8 h-8" />
                    <p className="text-xs">Upload a check image and run scan to extract written amount, numerical amount, and check for handwriting mismatch.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {analysisResult && (
            <div className={`p-4  border flex items-center justify-between ${
              analysisResult.fraud_flag 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {analysisResult.fraud_flag ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {analysisResult.fraud_flag ? 'Fraud Flag Triggered - Alteration or Mismatch Detected' : 'Check Verified Genuine'}
                  </div>
                  <div className="text-[11px] opacity-90">
                    Match Status: {analysisResult.match_status} | Written: {analysisResult.written_amount} ({analysisResult.numerical_amount})
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1  bg-black/20">
                {analysisResult.confidence_score}% Confidence
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
            Close Analyzer
          </button>
        </div>
      </div>
    </div>
  );
};
