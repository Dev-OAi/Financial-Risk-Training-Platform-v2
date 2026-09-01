/**
 * @file StolenBlankCheckPredictorModal.tsx
 * @description Stolen Blank Check Stock & Out-of-Sequence Predictor modal. Monitors sequence numbers against historical cleared ranges.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: StolenBlankCheckPredictorModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for extracting check numbers and comparing them against
// an account's historical issue range. Flags checks that are massively out of 
// sequence as potentially stolen blank check stock.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, FileWarning } from 'lucide-react';
import { ThemeMode } from '../types';

interface StolenBlankCheckPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const StolenBlankCheckPredictorModal: React.FC<StolenBlankCheckPredictorModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [predictorResult, setPredictorResult] = useState<any | null>(null);

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

  const handleRunPredictor = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "SEQ-PREDICT-2026-N1",
          scan_type: "Check Sequence Number Verification",
          account_id: "ACCT-8899122",
          extracted_data: {
            presented_check_number: 4002,
            last_cleared_check: 1050,
            sequence_delta: 2952
          },
          findings: {
            out_of_sequence: true,
            reported_stolen_block: false,
            details: "Presented item #4002 is greater than 500 digits out of sequence from the last cleared check (#1050)."
          },
          decision: "EXTENDED_HOLD_ISSUER_VERIFICATION",
          recommended_action: "Hold funds for issuer verification. Check falls within an unissued or potentially stolen blank stock range."
        };
        setPredictorResult(mockResult);
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
            <FileWarning className="w-5 h-5 text-orange-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Stolen Blank Check Predictor</h2>
              <p className="text-xs opacity-75">Detect out-of-sequence checks to intercept stolen checkbooks</p>
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
                Upload Check Image
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-orange-400 bg-[#292a2d]' : 'border-slate-300 hover:border-orange-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-orange-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check</span>
                  <span className="text-[10px] opacity-60 mt-1">Extract Sequence Number</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setPredictorResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !predictorResult && (
                <button
                  onClick={handleRunPredictor}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Checking Sequence...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Sequence Predictor</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Predictor JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {predictorResult ? (
                  <pre className="text-[11px] leading-relaxed text-orange-300">
                    {JSON.stringify(predictorResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <FileWarning className="w-8 h-8" />
                    <p className="text-xs">Upload an image to compare the check number against the account's historical cleared item range.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {predictorResult && (
            <div className={`p-4  border flex items-center justify-between ${
              predictorResult.extracted_data.sequence_delta > 500
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {predictorResult.extracted_data.sequence_delta > 500 ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {predictorResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {predictorResult.recommended_action}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  Sequence Delta
                </span>
                <span className="font-mono text-xs">
                  +{predictorResult.extracted_data.sequence_delta}
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
            Close Predictor
          </button>
        </div>
      </div>
    </div>
  );
};
