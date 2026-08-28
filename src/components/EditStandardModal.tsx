/**
 * @file EditStandardModal.tsx
 * @description Modal for editing bank standards and customizing check rules/code logic.
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Code, Building2, Upload, Image as ImageIcon } from 'lucide-react';
import { BankStandard, ThemeMode } from '../types';

interface EditStandardModalProps {
  isOpen: boolean;
  onClose: () => void;
  standard: BankStandard | null;
  onSaveStandard: (updated: BankStandard) => void;
  themeMode: ThemeMode;
}

export const EditStandardModal: React.FC<EditStandardModalProps> = ({
  isOpen,
  onClose,
  standard,
  onSaveStandard,
  themeMode
}) => {
  const [bankName, setBankName] = useState('');
  const [routingPrefix, setRoutingPrefix] = useState('');
  const [micrFontSpec, setMicrFontSpec] = useState('');
  const [borderSecurityType, setBorderSecurityType] = useState('');
  const [endorsementRule, setEndorsementRule] = useState('');
  const [trainingTip, setTrainingTip] = useState('');
  const [inkCharacteristics, setInkCharacteristics] = useState('');
  const [paperStock, setPaperStock] = useState('');
  const [checksumRule, setChecksumRule] = useState('');
  const [sampleImageUrl, setSampleImageUrl] = useState('');

  // Modular check rule codes
  const [micrCheckCode, setMicrCheckCode] = useState('');
  const [borderCheckCode, setBorderCheckCode] = useState('');
  const [inkCheckCode, setInkCheckCode] = useState('');
  const [paperCheckCode, setPaperCheckCode] = useState('');
  const [endorsementCheckCode, setEndorsementCheckCode] = useState('');

  useEffect(() => {
    if (standard) {
      setBankName(standard.bankName || '');
      setRoutingPrefix(standard.routingPrefix || '');
      setMicrFontSpec(standard.micrFontSpec || '');
      setBorderSecurityType(standard.borderSecurityType || '');
      setEndorsementRule(standard.endorsementRule || '');
      setTrainingTip(standard.trainingTip || '');
      setInkCharacteristics(standard.inkCharacteristics || '');
      setPaperStock(standard.paperStock || '');
      setChecksumRule(standard.checksumRule || '');
      setSampleImageUrl(standard.sampleImageUrl || '');
      setMicrCheckCode(standard.micrCheckCode || 'return scan.font === "E-13B" && scan.signalStrength >= 70;');
      setBorderCheckCode(standard.borderCheckCode || 'return scan.borderHasGuilloche && !scan.isPixelatedRaster;');
      setInkCheckCode(standard.inkCheckCode || 'return scan.reactsToChemicalSolvent && scan.hasOVMInk;');
      setPaperCheckCode(standard.paperCheckCode || 'return scan.hasUVFibers && scan.paperWeight >= 24;');
      setEndorsementCheckCode(standard.endorsementCheckCode || 'return amount <= 5000 || scan.hasRestrictiveEndorsement;');
    }
  }, [standard]);

  if (!isOpen || !standard) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSampleImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BankStandard = {
      ...standard,
      bankName,
      routingPrefix,
      micrFontSpec,
      borderSecurityType,
      endorsementRule,
      trainingTip,
      inkCharacteristics,
      paperStock,
      checksumRule,
      sampleImageUrl,
      micrCheckCode,
      borderCheckCode,
      inkCheckCode,
      paperCheckCode,
      endorsementCheckCode
    };
    onSaveStandard(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`w-full max-w-3xl max-h-[92vh] flex flex-col rounded-xl shadow-xl overflow-hidden border ${
        themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-inherit">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Edit Check Specifications & Modular Rule Code</h2>
              <p className="text-xs opacity-75">Customize specifications and validation JavaScript check rules for {standard.bankName}.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/10 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider mb-1 opacity-75">Bank Name *</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider mb-1 opacity-75">9-Digit Routing Prefix *</label>
              <input
                type="text"
                required
                maxLength={9}
                value={routingPrefix}
                onChange={(e) => setRoutingPrefix(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border font-mono outline-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider mb-1 opacity-75">MICR Font Spec</label>
              <input
                type="text"
                value={micrFontSpec}
                onChange={(e) => setMicrFontSpec(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                }`}
              />
              <div className="mt-1">
                <span className="font-semibold text-[11px] opacity-75">Modular Check Code:</span>
                <textarea
                  rows={2}
                  value={micrCheckCode}
                  onChange={(e) => setMicrCheckCode(e.target.value)}
                  className={`w-full font-mono text-[11px] px-2.5 py-1.5 rounded border mt-0.5 outline-none resize-none ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] text-blue-300' : 'bg-slate-50 border-slate-300 text-blue-700'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider mb-1 opacity-75">Security Border Type</label>
              <input
                type="text"
                value={borderSecurityType}
                onChange={(e) => setBorderSecurityType(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                }`}
              />
              <div className="mt-1">
                <span className="font-semibold text-[11px] opacity-75">Modular Check Code:</span>
                <textarea
                  rows={2}
                  value={borderCheckCode}
                  onChange={(e) => setBorderCheckCode(e.target.value)}
                  className={`w-full font-mono text-[11px] px-2.5 py-1.5 rounded border mt-0.5 outline-none resize-none ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] text-blue-300' : 'bg-slate-50 border-slate-300 text-blue-700'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider mb-1 opacity-75">Ink Characteristics</label>
              <input
                type="text"
                value={inkCharacteristics}
                onChange={(e) => setInkCharacteristics(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                }`}
              />
              <div className="mt-1">
                <span className="font-semibold text-[11px] opacity-75">Modular Check Code:</span>
                <textarea
                  rows={2}
                  value={inkCheckCode}
                  onChange={(e) => setInkCheckCode(e.target.value)}
                  className={`w-full font-mono text-[11px] px-2.5 py-1.5 rounded border mt-0.5 outline-none resize-none ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] text-blue-300' : 'bg-slate-50 border-slate-300 text-blue-700'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider mb-1 opacity-75">Paper Stock</label>
              <input
                type="text"
                value={paperStock}
                onChange={(e) => setPaperStock(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                }`}
              />
              <div className="mt-1">
                <span className="font-semibold text-[11px] opacity-75">Modular Check Code:</span>
                <textarea
                  rows={2}
                  value={paperCheckCode}
                  onChange={(e) => setPaperCheckCode(e.target.value)}
                  className={`w-full font-mono text-[11px] px-2.5 py-1.5 rounded border mt-0.5 outline-none resize-none ${
                    themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] text-blue-300' : 'bg-slate-50 border-slate-300 text-blue-700'
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider mb-1 opacity-75">Endorsement Rule</label>
            <input
              type="text"
              value={endorsementRule}
              onChange={(e) => setEndorsementRule(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border outline-none ${
                themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
              }`}
            />
            <div className="mt-1">
              <span className="font-semibold text-[11px] opacity-75">Modular Check Code:</span>
              <textarea
                rows={2}
                value={endorsementCheckCode}
                onChange={(e) => setEndorsementCheckCode(e.target.value)}
                className={`w-full font-mono text-[11px] px-2.5 py-1.5 rounded border mt-0.5 outline-none resize-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] text-blue-300' : 'bg-slate-50 border-slate-300 text-blue-700'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase tracking-wider mb-1 opacity-75">Checksum Rule</label>
              <input
                type="text"
                value={checksumRule}
                onChange={(e) => setChecksumRule(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="block font-semibold uppercase tracking-wider mb-1 opacity-75">Inspector Training Tip</label>
              <input
                type="text"
                value={trainingTip}
                onChange={(e) => setTrainingTip(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>

          {/* Reference Specimen Image Upload for Pattern Matching */}
          <div className={`p-3.5 rounded-lg border space-y-2.5 ${
            themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-xs uppercase tracking-wider">Reference Specimen Check / Document Image</span>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Example</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <p className="text-[11px] opacity-75">
              Upload a clear image of an authentic check or document for this bank standard. Used for computer pattern matching, layout extraction, and automated cross-referencing.
            </p>
            {sampleImageUrl && (
              <div className="relative mt-2 rounded-lg overflow-hidden border border-inherit bg-black/20 h-28 flex items-center justify-center">
                <img src={sampleImageUrl} alt="Reference Specimen" className="max-h-full max-w-full object-contain" />
                <button
                  type="button"
                  onClick={() => setSampleImageUrl('')}
                  className="absolute top-2 right-2 px-2 py-1 rounded bg-rose-600/90 hover:bg-rose-700 text-white text-[10px] font-bold shadow transition"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-inherit">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg opacity-75 hover:opacity-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>Update Standard & Rules</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
