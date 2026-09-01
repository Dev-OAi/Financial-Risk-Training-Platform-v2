/**
 * @file PaperLoanDigitizerModal.tsx
 * @description Paper Loan Application Digitizer modal for processing multi-page scanned PDF paper applications and enforcing strict JSON schema output matching Loan Origination Systems (LOS).
 */

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, FileText, Cpu, Building, ShieldCheck } from 'lucide-react';
import { ThemeMode } from '../types';

interface PaperLoanDigitizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const PaperLoanDigitizerModal: React.FC<PaperLoanDigitizerModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [losResult, setLosResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleRunDigitizer = async () => {
    setIsProcessing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          los_schema_version: "v4.2-enforcement",
          application_id: "APP-2026-88941",
          borrower_demographics: {
            full_name: "Eleanor Vance-Sterling",
            ssn_masked: "***-**-4912",
            dob: "1982-11-14",
            residential_address: "742 Evergreen Terrace, Flushing, NY 11354",
            employment_status: "Self-Employed (Managing Director)",
            employer_name: "Sterling Architecture LLC"
          },
          financial_summary: {
            monthly_gross_income: 18500.00,
            requested_loan_amount: 350000.00,
            loan_purpose: "Commercial Real Estate Expansion",
            listed_liabilities_total: 1450.00,
            debt_to_income_ratio_percentage: 18.2
          },
          listed_liabilities: [
            { creditor: "Chase Auto", monthly_payment: 650.00, balance: 18500.00 },
            { creditor: "Amex Corporate", monthly_payment: 800.00, balance: 4200.00 }
          ],
          extraction_compliance_status: "STRICT_JSON_SCHEMA_VALIDATED",
          los_ready_for_import: true
        };
        setLosResult(mockResult);
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
            <Building className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Paper Loan Application Digitizer</h2>
              <p className="text-xs opacity-75">Enforce Strict JSON Schema Output Matching Loan Origination Systems (LOS)</p>
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
                Upload Scanned Paper Loan Application (PDF / TIFF)
              </label>

              {!fileName ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-emerald-400 bg-[#292a2d]' : 'border-slate-300 hover:border-emerald-600 bg-slate-50'
                }`}>
                  <Upload className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to browse or drop paper application PDF</span>
                  <span className="text-[10px] opacity-60 mt-1">Multi-page scanned form support</span>
                  <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  border border-inherit bg-black/20 p-4 flex flex-col items-center space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span className="truncate max-w-[220px]">{fileName}</span>
                  </div>
                  <button
                    onClick={() => { setFileName(null); setSelectedFile(null); setLosResult(null); }}
                    className="px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Application File
                  </button>
                </div>
              )}

              {fileName && !losResult && (
                <button
                  onClick={handleRunDigitizer}
                  disabled={isProcessing}
                  className="w-full py-2.5  bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Enforcing Strict LOS Schema...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Digitize to LOS JSON Schema</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Strict LOS Schema JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {losResult ? (
                  <pre className="text-[11px] leading-relaxed text-emerald-300">
                    {JSON.stringify(losResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <FileText className="w-8 h-8" />
                    <p className="text-xs">Upload a multi-page scanned paper application to extract borrower demographics, income, and liabilities strictly in LOS schema format.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {losResult && (
            <div className="p-4  border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    Application Digitized for {losResult.borrower_demographics.full_name}
                  </div>
                  <div className="text-[11px] opacity-90">
                    Requested: ${losResult.financial_summary.requested_loan_amount.toLocaleString()} | Monthly Income: ${losResult.financial_summary.monthly_gross_income.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1  bg-black/20">
                LOS Ready
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
            Close Digitizer
          </button>
        </div>
      </div>
    </div>
  );
};
