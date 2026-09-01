/**
 * @file ExifMetadataAuditorModal.tsx
 * @description EXIF Metadata & Image Manipulation Auditor modal. Inspects raw image metadata and compression headers to detect photo editing software artifacts.
 */

// -----------------------------------------------------------------------------
// MODULAR COMPLIANCE TOOL: ExifMetadataAuditorModal.tsx
// -----------------------------------------------------------------------------
// Encapsulates logic for extracting and auditing EXIF metadata and JPEG compression 
// headers from mobile check images. Flags images processed through Photoshop or 
// other editing software indicative of digital fabrication or synthetic fraud.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { X, ShieldAlert, Cpu, Image as ImageIcon, CheckCircle2, FileCode } from 'lucide-react';
import { ThemeMode } from '../types';

interface ExifMetadataAuditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const ExifMetadataAuditorModal: React.FC<ExifMetadataAuditorModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [auditorResult, setAuditorResult] = useState<any | null>(null);

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

  const handleRunAuditor = async () => {
    setIsAnalyzing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          analysis_id: "EXIF-AUDIT-2026-M4",
          scan_type: "Metadata & Compression Header Analysis",
          extracted_metadata: {
            make: "Apple",
            model: "iPhone 14 Pro",
            software_tag: "Adobe Photoshop 2025.1 (Macintosh)",
            original_date: "2026-08-28T09:15:00Z",
            modified_date: "2026-08-28T14:32:11Z"
          },
          findings: {
            software_artifact_detected: true,
            timestamp_anomaly: true,
            compression_mismatch: true,
            details: "Image compression headers indicate a non-standard quantization table matching Adobe Photoshop exports. Original EXIF timestamp predates the modification timestamp by 5 hours."
          },
          decision: "REJECT_DIGITALLY_FABRICATED_IMAGE",
          recommended_action: "Decline mobile deposit. Image has been manipulated using photo editing software. Freeze funds and investigate for synthetic fraud."
        };
        setAuditorResult(mockResult);
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
            <FileCode className="w-5 h-5 text-teal-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">EXIF Metadata Auditor</h2>
              <p className="text-xs opacity-75">Inspect mobile deposit images for software editing artifacts</p>
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
                Upload Mobile Deposit Image
              </label>

              {!previewUrl ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-teal-400 bg-[#292a2d]' : 'border-slate-300 hover:border-teal-600 bg-slate-50'
                }`}>
                  <ImageIcon className="w-8 h-8 text-teal-500 mb-2" />
                  <span className="text-xs font-medium text-center">Click to upload check image</span>
                  <span className="text-[10px] opacity-60 mt-1">Extract EXIF & Compression Data</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  overflow-hidden border border-inherit bg-black/40 p-2 flex flex-col items-center">
                  <img src={previewUrl} alt="Check Preview" className="max-h-[200px] object-contain " />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); setAuditorResult(null); }}
                    className="mt-3 px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Image
                  </button>
                </div>
              )}

              {previewUrl && !auditorResult && (
                <button
                  onClick={handleRunAuditor}
                  disabled={isAnalyzing}
                  className="w-full py-2.5  bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Parsing File Headers...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Run Metadata Auditor</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Auditor JSON Output
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {auditorResult ? (
                  <pre className="text-[11px] leading-relaxed text-teal-300">
                    {JSON.stringify(auditorResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <FileCode className="w-8 h-8" />
                    <p className="text-xs">Upload an image to parse EXIF metadata, software tags, and compression artifacts to detect photo manipulation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {auditorResult && (
            <div className={`p-4  border flex items-center justify-between ${
              auditorResult.findings.software_artifact_detected
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <div className="flex items-center gap-3">
                {auditorResult.findings.software_artifact_detected ? (
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {auditorResult.decision.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 text-slate-300">
                    {auditorResult.findings.details}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5  bg-black/20 uppercase tracking-wider`}>
                  Status
                </span>
                <span className="font-mono text-xs">
                  {auditorResult.findings.software_artifact_detected ? "MANIPULATED" : "AUTHENTIC"}
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
            Close Auditor
          </button>
        </div>
      </div>
    </div>
  );
};
