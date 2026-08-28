/**
 * @file AddBankStandardModal.tsx
 * @description Modal for adding custom bank standards and security specifications.
 */

import React, { useState } from 'react';
import { X, Plus, Building2 } from 'lucide-react';
import { BankStandard, ThemeMode } from '../types';

interface AddBankStandardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStandard: (standard: BankStandard) => void;
  themeMode: ThemeMode;
}

export const AddBankStandardModal: React.FC<AddBankStandardModalProps> = ({
  isOpen,
  onClose,
  onAddStandard,
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

  const [micrCheckCode, setMicrCheckCode] = useState('return scan.font === "E-13B" && scan.signalStrength >= 70;');
  const [borderCheckCode, setBorderCheckCode] = useState('return scan.borderHasGuilloche && !scan.isPixelatedRaster;');
  const [inkCheckCode, setInkCheckCode] = useState('return scan.reactsToChemicalSolvent && scan.hasOVMInk;');
  const [paperCheckCode, setPaperCheckCode] = useState('return scan.hasUVFibers && scan.paperWeight >= 24;');
  const [endorsementCheckCode, setEndorsementCheckCode] = useState('return amount <= 5000 || scan.hasRestrictiveEndorsement;');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !routingPrefix) return;

    const newStandard: BankStandard = {
      id: `custom-${Date.now()}`,
      bankName,
      routingPrefix,
      micrFontSpec: micrFontSpec || 'Standard E-13B Magnetic Ink',
      borderSecurityType: borderSecurityType || 'Standard security border',
      endorsementRule: endorsementRule || 'Standard UCC endorsement rules apply',
      trainingTip: trainingTip || 'Inspect magnetic signals and security fibers.',
      inkCharacteristics: inkCharacteristics || 'Standard security ink',
      paperStock: paperStock || 'Standard security paper stock',
      checksumRule: checksumRule || 'Standard ABA Mod-10 checksum',
      micrCheckCode,
      borderCheckCode,
      inkCheckCode,
      paperCheckCode,
      endorsementCheckCode
    };

    onAddStandard(newStandard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-xl overflow-hidden border ${
        themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-inherit">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Add Custom Bank Security Standard</h2>
              <p className="text-xs opacity-75">Define custom routing prefixes, ink characteristics, and security rule patterns.</p>
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
                placeholder="e.g. Apex Regional Bank"
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
                placeholder="e.g. 122000456"
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
                placeholder="e.g. E-13B Iron-Oxide Magnetic"
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
                placeholder="e.g. Guilloche rainbow tint with micro-line text"
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
                placeholder="e.g. Chemically reactive fugitive safety ink"
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
                placeholder="e.g. 24lb security bond with UV fibers"
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
              placeholder="e.g. Restrictive endorsement required"
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

          <div>
            <label className="block font-semibold uppercase tracking-wider mb-1 opacity-75">Inspector Training Tip</label>
            <textarea
              rows={2}
              value={trainingTip}
              onChange={(e) => setTrainingTip(e.target.value)}
              placeholder="Enter specific red flags or inspection pointers..."
              className={`w-full px-3 py-2 rounded-lg border outline-none resize-none ${
                themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-inherit">
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
              <Plus className="w-4 h-4" />
              <span>Save Custom Standard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
