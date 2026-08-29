/**
 * @file CheckKitingAnalyzerModal.tsx
 * @description Check Kiting and Float Analyzer (Graph GNN) modal for modeling fund flows between banks and internal accounts to detect artificial float kiting loops.
 */

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, Cpu, Network, Share2, ArrowRightLeft } from 'lucide-react';
import { ThemeMode } from '../types';

interface CheckKitingAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const CheckKitingAnalyzerModal: React.FC<CheckKitingAnalyzerModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [targetAccount, setTargetAccount] = useState<string>("ACC-9921-Flushing Commercial");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleRunKitingAnalysis = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "KITING-GNN-2026-091",
          target_account: targetAccount,
          network_nodes_analyzed: 4,
          detected_circular_float_loops: [
            {
              path: "Regional Bank Branch #49 ➔ Chase Commercial ➔ Citibank NA ➔ Regional Bank Branch #49",
              float_velocity_days: 1.2,
              total_kite_volume: "$480,000.00",
              status: "ACTIVE_KITING_PATTERN_DETECTED"
            }
          ],
          gnn_risk_score: 96.8,
          fraud_classification: "CIRCULAR_CHECK_KITING_SCHEME",
          recommended_action: "Immediate freeze on uncollected funds availability. Alert Risk Management & SAR filing queue."
        };
        setAnalysisResult(mockResult);
        setIsAnalyzing(false);
      }, 1500);
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
            <Network className="w-5 h-5 text-teal-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Check Kiting & Float Analyzer (Graph GNN)</h2>
              <p className="text-xs opacity-75">Model Multi-Bank Fund Flows & Detect Circular Float Kiting Loops</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg opacity-75 hover:opacity-100 hover:bg-black/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-80 mb-2">
                  Target Account & Network Scope
                </label>
                <select
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    themeMode === 'dark' ? 'bg-[#292a2d] border-[#5f6368] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="ACC-9921-Flushing Commercial">ACC-9921 (Flushing Commercial LLC)</option>
                  <option value="ACC-4412-Grand Central Holding">ACC-4412 (Grand Central Holdings)</option>
                  <option value="ACC-8830-Manhattan Textile Import">ACC-8830 (Manhattan Textile Import)</option>
                </select>
              </div>

              <div className={`p-4 rounded-xl border space-y-2 ${
                themeMode === 'dark' ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-teal-400">
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>GNN Graph Parameters</span>
                </div>
                <p className="text-[11px] opacity-75 leading-relaxed">
                  The Graph Neural Network maps continuous deposit and withdrawal edges across Regional Bank, Chase, Citibank, and TD Bank to calculate float velocity and identify closed-loop artificial balances.
                </p>
              </div>

              {!analysisResult ? (
                <button
                  onClick={handleRunKitingAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Running Graph GNN Float Analysis...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Check Kiting GNN Analyzer</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-600 hover:bg-slate-700 text-white font-bold text-xs shadow transition"
                >
                  Reset Analysis
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                GNN Network Analysis JSON
              </label>

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {analysisResult ? (
                  <pre className="text-[11px] leading-relaxed text-teal-300">
                    {JSON.stringify(analysisResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Share2 className="w-8 h-8" />
                    <p className="text-xs">Select a commercial account to map multi-bank deposit and withdrawal flows and flag circular check kiting loops.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {analysisResult && (
            <div className="p-4 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    Kiting Threat Detected: {analysisResult.fraud_classification}
                  </div>
                  <div className="text-[11px] opacity-90">
                    {analysisResult.recommended_action}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-black/20">
                {analysisResult.gnn_risk_score}% GNN Risk
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
            Close Analyzer
          </button>
        </div>
      </div>
    </div>
  );
};
