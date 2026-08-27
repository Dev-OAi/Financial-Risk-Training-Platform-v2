/**
 * @file UploadScanModal.tsx
 * @description OCR Vision Document Upload & Forensic Scan Modal using Gemini Vision AI.
 */

import React, { useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, Loader2, X, ShieldAlert } from 'lucide-react';
import { DocumentTemplate, ThemeMode } from '../types';

interface UploadScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTemplate: (template: DocumentTemplate) => void;
  themeMode: ThemeMode;
}

export const UploadScanModal: React.FC<UploadScanModalProps> = ({
  isOpen,
  onClose,
  onAddTemplate,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>('');
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
      const response = await fetch('/api/ocr-scan-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewUrl,
          mimeType: selectedFile?.type || 'image/png',
          documentTitle: documentTitle || 'Uploaded Specimen'
        })
      });
      const data = await response.json();
      if (data.success && data.template) {
        onAddTemplate(data.template);
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
              <h2 className="text-lg font-semibold">AI Vision OCR Forensic Document Scanner</h2>
              <p className="text-xs opacity-75">Upload check, invoice, or wire instruction to automatically extract fields and flag tampering.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
              Document Title / Reference Name
            </label>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="e.g. Vendor Invoice #4891 or Suspicious Check"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] focus:border-blue-400' : 'bg-slate-50 border-slate-300 focus:border-blue-600'
              }`}
            />
          </div>

          {!previewUrl ? (
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition ${
              themeMode === 'dark' ? 'border-[#5f6368] hover:border-blue-400 bg-[#202124]/50' : 'border-slate-300 hover:border-blue-500 bg-slate-50'
            }`}>
              <Upload className="w-10 h-10 text-blue-500 mb-3 animate-bounce" />
              <span className="text-sm font-medium mb-1">Click to upload or drag and drop financial document</span>
              <span className="text-xs opacity-60">Supports PNG, JPG, WEBP, or scanned PDF images</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-inherit max-h-64 flex items-center justify-center bg-black/40">
                <img src={previewUrl} alt="Preview" className="max-h-60 object-contain" />
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
                <span>Running Gemini Vision OCR Scan...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Run Forensic OCR Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
