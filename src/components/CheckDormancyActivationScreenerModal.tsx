/**
 * @file CheckDormancyActivationScreenerModal.tsx
 * @description Unused Account Dormancy Check Activation Screener modal. Flags deposits on dormant accounts to lock cash-out channels.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: CheckDormancyActivationScreenerModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for flagging check deposits or presented drawn checks on 
// accounts that have been dormant (>180 days) and placing administrative holds.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, Timer } from 'lucide-react';
import { ThemeMode } from '../types';

interface CheckDormancyActivationScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const CheckDormancyActivationScreenerModal: React.FC<CheckDormancyActivationScreenerModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [screenerResult, setScreenerResult] = useState<any | null>(null);

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

  const handleRunScreener = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "DORMANT-ACCT-2026-D4",
          scan_type: "Account Dormancy & Activity Screening",
          account_id: "ACCT-98920-INACTIVE",
          extracted_data: {
            deposit_amount: "$4,800.00",
            channel: "Mobile Deposit Capture",
            account_status: "DORMANT",
            days_inactive: 210
          },
          findings: {
            dormancy_breach: true,
            high_risk_amount: true,
            details: "Account has been dormant for 210 days (>180 day threshold). Sudden mobile deposit of $4,800 poses a high risk of dormant account takeover and rapid funds extraction."
          },
          decision: "ADMINISTRATIVE_HOLD_PLACED",
          recommended_action: "Place an immediate administrative hold on withdrawal channels. Alert the fraud triage desk for mandatory secondary customer verification before releasing funds."
        };
        setScreenerResult(mockResult);
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
            <Timer className="w-5 h-5 text-cyan-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Account Dormancy Activation Screener</h2>
              <p className="text-xs opacity-75">Flag deposits on dormant accounts to prevent rapid cash-out</p>
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
                Upload Target Deposit Check
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-cyan-400 bg-[#292a2d]' : 'border-slate-300 hover:border-cyan-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-cyan-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload deposit image</span>
                  <span className="text-[10px] opacity-60 mt-1">Cross-check Account Activity</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setScreenerResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !screenerResult && (
                <button
                  onClick={handleRunScreener}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Checking Account Status...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Dormancy Screener</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Screener JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {screenerResult ? (
                  <pre className="text-[11px] leading-relaxed text-cyan-300">
                    {JSON.stringify(screenerResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Timer className="w-8 h-8" />
                    <p className="text-xs">Upload an image to verify if the receiving account is dormant and requires an administrative hold.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {screenerResult && (
            <div className={`p-4  border flex items-center justify-between ${
              screenerResult.findings.dormancy_breach
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {screenerResult.findings.dormancy_breach ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {screenerResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {screenerResult.recommended_action}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  Days Inactive
                </span>
                <span className="font-mono text-xs text-rose-400 font-bold">
                  {screenerResult.extracted_data.days_inactive} Days
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
            Close Screener
          </button>
        </div>
      </div>
    </div>
  );
};
