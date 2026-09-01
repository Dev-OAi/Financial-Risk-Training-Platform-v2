/**
 * @file OutOfStateIssuerAgentModal.tsx
 * @description High-Risk Out-of-State Issuer First-Check Agent modal. Triggers automated verification workflows when a check is drawn on a small, out-of-state financial institution for the first time.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: OutOfStateIssuerAgentModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for evaluating checks drawn on unrecognized, out-of-state
// routing numbers. Queries simulated Federal Reserve databases and historical
// account behavior to assign a hold recommendation on suspicious first-time deposits.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, Landmark } from 'lucide-react';
import { ThemeMode } from '../types';

interface OutOfStateIssuerAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const OutOfStateIssuerAgentModal: React.FC<OutOfStateIssuerAgentModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [agentResult, setAgentResult] = useState<any | null>(null);

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

  const handleRunAgent = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "OOS-ISSUER-2026-F9",
          routing_number: "091212345",
          institution_name: "Montana Rural Credit Union",
          federal_reserve_status: "ACTIVE",
          historical_deposit_frequency: 0,
          risk_indicators: [
            "First time receiving funds from this institution",
            "Out-of-state issuer (MT) vs. Account Holder location (NY)",
            "High-risk deposit channel (Mobile Deposit)"
          ],
          decision: "EXTENDED_REG_CC_HOLD",
          recommended_action: "Apply Extended Hold under Reg CC exception. Verify funds with issuing bank before release."
        };
        setAgentResult(mockResult);
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
            <Landmark className="w-5 h-5 text-cyan-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Out-of-State Issuer First-Check Agent</h2>
              <p className="text-xs opacity-75">Automated verification for first-time deposits from high-risk external routing numbers</p>
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
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-cyan-400 bg-[#292a2d]' : 'border-slate-300 hover:border-cyan-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-cyan-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload deposit check</span>
                  <span className="text-[10px] opacity-60 mt-1">Extract Routing # & Analyze</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setAgentResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !agentResult && (
                <button
                  onClick={handleRunAgent}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Checking Routing Status...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Issuer Analysis Agent</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Agent JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {agentResult ? (
                  <pre className="text-[11px] leading-relaxed text-cyan-300">
                    {JSON.stringify(agentResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Landmark className="w-8 h-8" />
                    <p className="text-xs">Upload an image to verify the Federal Reserve status and historical deposit frequency for out-of-state routing numbers.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {agentResult && (
            <div className={`p-4  border flex items-center justify-between ${
              agentResult.historical_deposit_frequency === 0
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {agentResult.historical_deposit_frequency === 0 ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {agentResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {agentResult.recommended_action}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  Routing Info
                </span>
                <span className="font-mono text-xs">{agentResult.institution_name} ({agentResult.routing_number})</span>
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
            Close Agent
          </button>
        </div>
      </div>
    </div>
  );
};
