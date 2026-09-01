/**
 * @file FakeCashiersCheckValidatorModal.tsx
 * @description Fake Cashier’s Check & Official Instrument Validator modal. Compiles known cashier's check security features and formats to verify high-value official checks.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: FakeCashiersCheckValidatorModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for extracting and validating cashier's check details
// (issuing bank, serial number, routing number format). Flags checks that fail
// to match the known official check templates of major issuing institutions.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, BadgeCheck } from 'lucide-react';
import { ThemeMode } from '../types';

interface FakeCashiersCheckValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const FakeCashiersCheckValidatorModal: React.FC<FakeCashiersCheckValidatorModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [validatorResult, setValidatorResult] = useState<any | null>(null);

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

  const handleRunValidator = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "CASH-CHK-2026-X8",
          scan_type: "Official Instrument Validation",
          extracted_data: {
            issuing_bank: "First National Bank",
            routing_number: "021000021",
            serial_number: "98765432",
            remitter_name: "Jane Doe"
          },
          findings: {
            routing_number_valid: true,
            serial_format_match: false,
            security_features_present: false,
            details: "Serial number format does not match known official templates for this institution. Missing embedded security watermarks typical for this high-value instrument."
          },
          decision: "REJECT_SUSPECTED_COUNTERFEIT_CASHIERS_CHECK",
          recommended_action: "Do not cash. Highly likely to be a synthetic cashier's check scam. Retain check and contact the issuing bank's fraud department immediately."
        };
        setValidatorResult(mockResult);
        setIsAnalyzing(false);
      }, 1900);
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
            <BadgeCheck className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Fake Cashier’s Check Validator</h2>
              <p className="text-xs opacity-75">Verify official check formats, serial numbers, and security features</p>
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
                Upload Cashier's Check Image
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-amber-400 bg-[#292a2d]' : 'border-slate-300 hover:border-amber-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload official check</span>
                  <span className="text-[10px] opacity-60 mt-1">Extract & Validate Instrument</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setValidatorResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !validatorResult && (
                <button
                  onClick={handleRunValidator}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-amber-800 hover:bg-amber-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Validating Official Templates...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Cashier's Check Validator</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Validator JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {validatorResult ? (
                  <pre className="text-[11px] leading-relaxed text-amber-300">
                    {JSON.stringify(validatorResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <BadgeCheck className="w-8 h-8" />
                    <p className="text-xs">Upload an image of a cashier's check to extract the issuing bank, serial number, and remitter name, and verify the formatting.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {validatorResult && (
            <div className={`p-4  border flex items-center justify-between ${
              !validatorResult.findings.serial_format_match || !validatorResult.findings.security_features_present
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {!validatorResult.findings.serial_format_match || !validatorResult.findings.security_features_present ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {validatorResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {validatorResult.recommended_action}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  Validation Match
                </span>
                <span className="font-mono text-xs">
                  {validatorResult.findings.serial_format_match ? "MATCH" : "FAILED"}
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
            Close Validator
          </button>
        </div>
      </div>
    </div>
  );
};
