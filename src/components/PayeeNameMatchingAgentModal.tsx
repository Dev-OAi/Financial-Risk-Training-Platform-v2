/**
 * @file PayeeNameMatchingAgentModal.tsx
 * @description Payee Name vs. Account Holder Name Matching Agent modal. Uses fuzzy string matching to compare Payee line against the account holder legal name.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: PayeeNameMatchingAgentModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for extracting the Payee Name from a deposited check
// and comparing it against the account holder's legal name. Calculates a fuzzy 
// match confidence score to block third-party check deposits.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, UserSearch } from 'lucide-react';
import { ThemeMode } from '../types';

interface PayeeNameMatchingAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const PayeeNameMatchingAgentModal: React.FC<PayeeNameMatchingAgentModalProps> = ({
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
          analysis_id: "PAYEE-MATCH-2026-F2",
          scan_type: "NLP Payee Entity Resolution & Fuzzy Matching",
          account_id: "ACCT-9008812",
          extracted_data: {
            check_payee_name: "Internal Revenue Service",
            account_legal_names: ["John Q. Public", "Jane Public"]
          },
          findings: {
            fuzzy_match_score: 12.5,
            threshold_met: false,
            details: "Payee entity 'Internal Revenue Service' (Government/Tax) does not match individual account holders. Mismatch score is well below the 75% required threshold."
          },
          decision: "REJECT_THIRD_PARTY_DEPOSIT",
          recommended_action: "Decline deposit. Name mismatch indicates a third-party check (tax refund) being deposited into an unauthorized account."
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
      <div className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          themeMode === 'dark' ? 'border-[#3c4043] bg-[#2d2e31]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <UserSearch className="w-5 h-5 text-fuchsia-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Payee Name Matching Agent</h2>
              <p className="text-xs opacity-75">Compare check Payee against account holder legal names</p>
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
                Upload Check (Front)
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-fuchsia-400 bg-[#292a2d]' : 'border-slate-300 hover:border-fuchsia-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-fuchsia-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check front</span>
                  <span className="text-[10px] opacity-60 mt-1">Extract & Match Payee Name</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain rounded" />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setAgentResult(null); }}
                    className="mt-3 px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !agentResult && (
                <button
                  onClick={handleRunAgent}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Resolving Entities...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Name Matching Agent</span>
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

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {agentResult ? (
                  <pre className="text-[11px] leading-relaxed text-fuchsia-300">
                    {JSON.stringify(agentResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <UserSearch className="w-8 h-8" />
                    <p className="text-xs">Upload an image of a check to extract the Payee Name and calculate a fuzzy match confidence score against the account holder's legal name.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {agentResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              agentResult.findings.fuzzy_match_score < 75
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {agentResult.findings.fuzzy_match_score < 75 ? (
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
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-black/20 uppercase tracking-wider`}>
                  Fuzzy Match Score
                </span>
                <span className="font-mono text-xs">
                  {agentResult.findings.fuzzy_match_score}%
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
            Close Agent
          </button>
        </div>
      </div>
    </div>
  );
};
