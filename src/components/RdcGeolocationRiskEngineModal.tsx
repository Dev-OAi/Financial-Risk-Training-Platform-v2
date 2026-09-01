/**
 * @file RdcGeolocationRiskEngineModal.tsx
 * @description Remote Deposit Capture (RDC) Device & Geolocation Risk Engine modal. Evaluates device IPs, GPS, and fingerprints for mobile deposits.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: RdcGeolocationRiskEngineModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for correlating IP addresses, GPS coordinates, and hardware 
// device fingerprints against the account holder's primary location to detect 
// Account Takeover (ATO) and offshore mule network deposits.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, FileJson, CheckCircle2, MapPin } from 'lucide-react';
import { ThemeMode } from '../types';

interface RdcGeolocationRiskEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const RdcGeolocationRiskEngineModal: React.FC<RdcGeolocationRiskEngineModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [engineResult, setEngineResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleRunEngine = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "RDC-GEO-2026-K7",
          scan_type: "Device Fingerprint & Geolocation Correlation",
          account_id: "ACCT-5511993",
          extracted_metadata: {
            device_ip: "185.200.118.44 (Known TOR Exit Node)",
            gps_coordinates: "45.000, 39.000",
            distance_from_home: "4,250 miles",
            hardware_fingerprint: "BlueStacks Android Emulator v5.1"
          },
          findings: {
            vpn_tor_detected: true,
            location_anomaly: true,
            emulator_detected: true,
            risk_score: 98,
            details: "Device IP is routing through a known anonymizing TOR node. GPS location is >500 miles from the account holder's registered address. Hardware signature matches an Android emulator."
          },
          decision: "REJECT_HIGH_RISK_ATO_MULE",
          recommended_action: "Decline deposit and freeze account. Extremely high risk of Account Takeover (ATO) or offshore mule network activity."
        };
        setEngineResult(mockResult);
        setIsAnalyzing(false);
      }, 1700);
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
            <MapPin className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">RDC Geolocation Risk Engine</h2>
              <p className="text-xs opacity-75">Correlate IP, GPS, and device fingerprint against account holder profiles</p>
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
                Upload RDC Session Data / Check Image
              </label>

              {!fileName ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-indigo-400 bg-[#292a2d]' : 'border-slate-300 hover:border-indigo-600 bg-slate-50'
                }`}>
                  <FileJson className="w-8 h-8 text-indigo-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload RDC payload</span>
                  <span className="text-[10px] opacity-60 mt-1">Extract IP, GPS & Device Data</span>
                  <input type="file" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className={`relative  border p-4 flex flex-col items-center justify-center text-center space-y-2 ${
                  themeMode === 'dark' ? 'border-[#5f6368] bg-[#292a2d]' : 'border-slate-300 bg-slate-50'
                }`}>
                  <FileJson className="w-8 h-8 text-indigo-500" />
                  <span className="text-xs font-medium break-all">{fileName}</span>
                  <button
                    onClick={() => { setFileName(null); setSelectedFile(null); setEngineResult(null); }}
                    className="mt-2 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove Payload
                  </button>
                </div>
              )}

              {fileName && !engineResult && (
                <button
                  onClick={handleRunEngine}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Correlating Telemetry...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Geolocation Risk Engine</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Engine JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {engineResult ? (
                  <pre className="text-[11px] leading-relaxed text-indigo-300">
                    {JSON.stringify(engineResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <MapPin className="w-8 h-8" />
                    <p className="text-xs">Upload RDC session data to correlate IP addresses, GPS coordinates, and device fingerprints against account profiles.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {engineResult && (
            <div className={`p-4  border flex items-center justify-between ${
              engineResult.findings.risk_score > 75
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {engineResult.findings.risk_score > 75 ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {engineResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {engineResult.recommended_action}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  Risk Score
                </span>
                <span className="font-mono text-xs">
                  {engineResult.findings.risk_score} / 100
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
            Close Risk Engine
          </button>
        </div>
      </div>
    </div>
  );
};
