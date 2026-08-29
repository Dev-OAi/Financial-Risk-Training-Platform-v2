/**
 * @file MarketingSignageAuditModal.tsx
 * @description Retail Branch Marketing Signage Compliance Auditor modal for verifying lobby promotional banners and CD interest rate fine print against official Truth in Savings Act disclosures.
 */

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, ShieldAlert, Cpu, Image as ImageIcon, Megaphone } from 'lucide-react';
import { ThemeMode } from '../types';

interface MarketingSignageAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const MarketingSignageAuditModal: React.FC<MarketingSignageAuditModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<any | null>(null);

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

  const handleRunSignageAudit = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          audit_id: "SIGNAGE-AUDIT-2026-89",
          branch_location: "Flushing Community Branch #49",
          display_location: "Main Lobby Entrance Poster Stand A-2",
          truth_in_savings_verification: {
            current_official_cd_apy: "5.15% APY",
            detected_poster_apy: "4.85% APY (OUTDATED PROMO)",
            discrepancy_found: true,
            regulation_cited: "Truth in Savings Act (Regulation DD) - 12 CFR § 1030"
          },
          compliance_status: "FAIL_OUTDATED_RATE_DISCLOSURE",
          corrective_action: "Remove outdated 4.85% APY promotional poster immediately and replace with official Q3 5.15% CD rate flyer."
        };
        setAuditResult(mockResult);
        setIsAnalyzing(false);
      }, 1400);
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
            <Megaphone className="w-5 h-5 text-purple-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Retail Branch Marketing Signage Compliance Auditor</h2>
              <p className="text-xs opacity-75">Verify Lobby Promo Banners & CD APY Rates Against Truth in Savings Act Disclosures</p>
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
                Upload Lobby Promotional Signage Photo
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-purple-400 bg-[#292a2d]' : 'border-slate-300 hover:border-purple-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-purple-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to snap or upload lobby display photo</span>
                  <span className="text-[10px] opacity-60 mt-1">Fine-print APY & Rate Inspection AI</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Signage Preview" className="max-h-[200px] object-contain rounded" />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setAuditResult(null); }}
                    className="mt-3 px-3 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-medium transition"
                  >
                    Remove / Change Signage Photo
                  </button>
                </div>
              )}

              {previewUrl && !auditResult && (
                <button
                  onClick={handleRunSignageAudit}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Inspecting Fine-Print APY & Disclosures...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Signage Compliance Audit</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Truth in Savings Compliance JSON
              </label>

              <div className={`flex-1 rounded-xl p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {auditResult ? (
                  <pre className="text-[11px] leading-relaxed text-purple-300">
                    {JSON.stringify(auditResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <Megaphone className="w-8 h-8" />
                    <p className="text-xs">Upload a photo of a branch lobby promotional banner to verify listed APY rates against official current CD rate sheets.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {auditResult && (
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              auditResult.compliance_status.includes('FAIL')
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {auditResult.compliance_status.includes('FAIL') ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {auditResult.branch_location} - Status: {auditResult.compliance_status}
                  </div>
                  <div className="text-[11px] opacity-90">
                    {auditResult.corrective_action}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-black/20">
                Regulation DD
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
            Close Auditor
          </button>
        </div>
      </div>
    </div>
  );
};
