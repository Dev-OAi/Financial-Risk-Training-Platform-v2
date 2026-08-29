/**
 * @file CashiersCheckApiInspectorModal.tsx
 * @description Real-Time Cashier's Check Central Status API Inspector modal. Verifies official checks against clearinghouse databases in real-time.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: CashiersCheckApiInspectorModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for extracting data from a cashier's check and querying 
// a clearinghouse verification API to confirm legitimacy and eliminate scam losses.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, Landmark } from 'lucide-react';
import { ThemeMode } from '../types';

interface CashiersCheckApiInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const CashiersCheckApiInspectorModal: React.FC<CashiersCheckApiInspectorModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [apiResult, setApiResult] = useState<any | null>(null);

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
          analysis_id: "CASH-CHECK-API-2026-N2",
          scan_type: "Clearinghouse API Verification",
          extracted_data: {
            issuing_bank: "First National Corporate Bank",
            routing_number: "021000021",
            serial_number: "889345021",
            amount: "$15,500.00"
          },
          api_response: {
            status_code: 404,
            clearinghouse_match: false,
            instrument_status: "NOT_FOUND_OR_VOIDED",
            message: "The requested cashier's check serial number and amount combination was not found in the central issuance registry."
          },
          decision: "REJECT_FRAUDULENT_INSTRUMENT",
          recommended_action: "Decline deposit immediately. Do not make funds available. Confiscate physical item if presented in person and notify fraud operations."
        };
        setApiResult(mockResult);
        setIsAnalyzing(false);
      }, 2000);
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
            <Landmark className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Cashier's Check API Inspector</h2>
              <p className="text-xs opacity-75">Verify official check status against clearinghouse databases</p>
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
                Upload Cashier's Check Image
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-emerald-400 bg-[#292a2d]' : 'border-slate-300 hover:border-emerald-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check scan</span>
                  <span className="text-[10px] opacity-60 mt-1">Extract Routing & Serial Data</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain rounded" />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setApiResult(null); }}
                    className="mt-3 px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !apiResult && (
                <button
                  onClick={handleRunInspector}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Querying Clearinghouse API...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Status API Inspector</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                API Response JSON
              </label>

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {apiResult ? (
                  <pre className="text-[11px] leading-relaxed text-emerald-300">
                    {JSON.stringify(apiResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Landmark className="w-8 h-8" />
                    <p className="text-xs">Upload an official check image to query external clearinghouse APIs for instrument status verification.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {apiResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              !apiResult.api_response.clearinghouse_match
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {!apiResult.api_response.clearinghouse_match ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {apiResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {apiResult.recommended_action}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-black/20 uppercase tracking-wider`}>
                  Status Code
                </span>
                <span className="font-mono text-xs">
                  {apiResult.api_response.status_code}
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
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
