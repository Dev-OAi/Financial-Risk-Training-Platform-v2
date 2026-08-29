/**
 * @file UploadScanModal.tsx
 * @description Unified Forensic Ingestion & Check Fraud Analyzer Modal combining OCR vision, bank standard cross-referencing, and handwriting mismatch / amount verification.
 */

import React, { useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, Loader2, X, ShieldAlert, Building2, CheckSquare } from 'lucide-react';
import { DocumentTemplate, ThemeMode } from '../types';

interface UploadScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTemplate: (template: DocumentTemplate) => void;
  templates: Record<string, DocumentTemplate>;
  themeMode: ThemeMode;
}

export const UploadScanModal: React.FC<UploadScanModalProps> = ({
  isOpen,
  onClose,
  onAddTemplate,
  templates,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [selectedReferenceId, setSelectedReferenceId] = useState<string>('');
  const [includeFraudCheck, setIncludeFraudCheck] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunOcrScan = async () => {
    if (!previewUrl) return;
    setIsScanning(true);
    setScanError(null);

    try {
      const referenceStandard = selectedReferenceId ? templates[selectedReferenceId] : null;
      const response = await fetch('/api/ocr-scan-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewUrl,
          mimeType: selectedFile?.type || 'image/png',
          documentTitle: documentTitle || 'Uploaded Specimen',
          referenceStandardTitle: referenceStandard?.title || null,
          includeFraudCheck: includeFraudCheck
        })
      });
      const data = await response.json();
      if (data.success && data.template) {
        // If reference standard was selected, incorporate its metadata/sample image
        const fraudTag = includeFraudCheck ? ' [Check Fraud & Handwriting Verified]' : '';
        const finalTemplate = referenceStandard ? {
          ...data.template,
          title: `${data.template.title} (${referenceStandard.title})`,
          summary: `[Cross-referenced against ${referenceStandard.title}]${fraudTag}: ${data.template.summary}`,
          sampleImageUrl: referenceStandard.sampleImageUrl || data.template.sampleImageUrl
        } : {
          ...data.template,
          summary: `${fraudTag} ${data.template.summary}`
        };

        onAddTemplate(finalTemplate);
        onClose();
      } else {
        setScanError(data.error || 'Failed to analyze document via OCR scan');
      }
    } catch (err: any) {
      setScanError(err.message || 'Network error during OCR scan');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border transition-colors ${
        themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider">Unified Forensic Ingestion & Check Fraud Analyzer</h2>
              <p className="text-xs opacity-75">Multi-layer OCR, bank standard cross-reference, and handwriting mismatch inspection.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
                Document Title / Reference Name
              </label>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="e.g. Suspicious Check #4891 or Invoice"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] focus:border-blue-400' : 'bg-slate-50 border-slate-300 focus:border-blue-600'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Investigate Against Bank Standard</span>
              </label>
              <select
                value={selectedReferenceId}
                onChange={(e) => setSelectedReferenceId(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] focus:border-blue-400' : 'bg-slate-50 border-slate-300 focus:border-blue-600'
                }`}
              >
                <option value="">-- Auto-Detect (No Preset) --</option>
                {(Object.values(templates) as DocumentTemplate[]).map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.title} ({tpl.type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Professional Check Fraud & Handwriting Analysis Toggle */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
            themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
              <div>
                <div className="text-xs font-bold">Include Check Fraud & Handwriting Mismatch Scan</div>
                <div className="text-[11px] opacity-70">Verifies spelled-out payee amount vs numerical amount & detects stroke alteration.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeFraudCheck}
              onChange={(e) => setIncludeFraudCheck(e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
            />
          </div>

          {!previewUrl ? (
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition ${
              themeMode === 'dark' ? 'border-[#5f6368] hover:border-blue-400 bg-[#202124]/50' : 'border-slate-300 hover:border-blue-500 bg-slate-50'
            }`}>
              <Upload className="w-10 h-10 text-blue-500 mb-3 animate-bounce" />
              <span className="text-sm font-medium mb-1">Click to upload or drag and drop financial document / check</span>
              <span className="text-xs opacity-60">Supports PNG, JPG, WEBP, or scanned PDF images</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-inherit max-h-60 flex items-center justify-center bg-black/40">
                <img src={previewUrl} alt="Preview" className="max-h-56 object-contain" />
                <button
                  onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                  className="absolute top-2 right-2 px-3 py-1 bg-black/70 text-white rounded-lg text-xs font-medium hover:bg-black/90"
                >
                  Change File
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>File loaded: {selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(1)} KB)</span>
              </div>
            </div>
          )}

          {scanError && (
            <div className="flex items-center gap-2 text-xs text-rose-500 bg-rose-500/10 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{scanError}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-inherit bg-black/5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium opacity-75 hover:opacity-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleRunOcrScan}
            disabled={!previewUrl || isScanning}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-lg transition disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Unified Forensic Analysis...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Run Unified Forensic Scan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

