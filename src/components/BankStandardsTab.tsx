/**
 * @file BankStandardsTab.tsx
 * @description Searchable standards library, bank check specifications, ink rules, and real-time ABA routing number verifier.
 */

import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, CheckCircle2, XCircle, BookOpen, AlertCircle, Building2, Cpu, FileCheck, Plus, Trash2, Code } from 'lucide-react';
import { BANK_STANDARDS_DATABASE, verifyRoutingNumber } from '../data/bankStandardsLibrary';
import { ThemeMode, RoutingVerificationResult, BankStandard } from '../types';
import { AddBankStandardModal } from './AddBankStandardModal';
import { EditStandardModal } from './EditStandardModal';

interface BankStandardsTabProps {
  themeMode: ThemeMode;
}

const STORAGE_KEY = 'custom_bank_standards_v1';
const EDITED_DEFAULTS_KEY = 'edited_default_standards_v1';

export const BankStandardsTab: React.FC<BankStandardsTabProps> = ({ themeMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [routingInput, setRoutingInput] = useState('121000358');
  const [verificationResult, setVerificationResult] = useState<RoutingVerificationResult>(
    verifyRoutingNumber('121000358')
  );
  const [customStandards, setCustomStandards] = useState<BankStandard[]>([]);
  const [editedDefaults, setEditedDefaults] = useState<Record<string, BankStandard>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStandard, setEditingStandard] = useState<BankStandard | null>(null);

  useEffect(() => {
    try {
      const savedCustom = localStorage.getItem(STORAGE_KEY);
      if (savedCustom) {
        setCustomStandards(JSON.parse(savedCustom));
      }
      const savedEdited = localStorage.getItem(EDITED_DEFAULTS_KEY);
      if (savedEdited) {
        setEditedDefaults(JSON.parse(savedEdited));
      }
    } catch (e) {
      console.error('Failed to load bank standards from localStorage', e);
    }
  }, []);

  const handleSaveCustomStandard = (newStandard: BankStandard) => {
    const updated = [newStandard, ...customStandards];
    setCustomStandards(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save custom bank standard', e);
    }
  };

  const handleRemoveCustomStandard = (id: string) => {
    const updated = customStandards.filter(s => s.id !== id);
    setCustomStandards(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove custom bank standard', e);
    }
  };

  const handleSaveEditedStandard = (updatedStd: BankStandard) => {
    const isCustom = customStandards.some(c => c.id === updatedStd.id);
    if (isCustom) {
      const updatedList = customStandards.map(s => s.id === updatedStd.id ? updatedStd : s);
      setCustomStandards(updatedList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } else {
      const updatedMap = { ...editedDefaults, [updatedStd.id]: updatedStd };
      setEditedDefaults(updatedMap);
      localStorage.setItem(EDITED_DEFAULTS_KEY, JSON.stringify(updatedMap));
    }
  };

  const handleVerifyRouting = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationResult(verifyRoutingNumber(routingInput));
  };

  const defaultStandards = Object.values(BANK_STANDARDS_DATABASE).map(std => {
    return editedDefaults[std.id] || std;
  });
  const allStandards = [...customStandards, ...defaultStandards];

  const filteredStandards = allStandards.filter(std =>
    std.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    std.routingPrefix.includes(searchTerm) ||
    std.micrFontSpec.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-inherit pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-inherit">
            <Building2 className="w-6 h-6 text-blue-500" />
            Bank Security Specifications & Routing Standards Library
          </h1>
          <p className="text-xs opacity-75 mt-0.5">
            Cross-reference institutional security features, E-13B magnetic ink rules, thermochromic inks, and real-time ABA check digits.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Standard</span>
        </button>
      </div>

      {/* Real-time routing number verification tool */}
      <div className={`p-4 sm:p-5 rounded-xl border shadow-xs transition ${
        themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043]' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Real-Time ABA Routing Number Verification Engine</h2>
            <p className="text-xs opacity-75">Test 9-digit American Bankers Association transit routing numbers with Mod-10 weighted checksum validation.</p>
          </div>
        </div>

        <form onSubmit={handleVerifyRouting} className="flex flex-col sm:flex-row gap-2.5 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              maxLength={9}
              value={routingInput}
              onChange={(e) => setRoutingInput(e.target.value)}
              placeholder="Enter 9-digit routing number (e.g. 121000358)"
              className={`w-full px-3.5 py-2.5 rounded-lg border font-mono text-sm tracking-wider outline-none transition ${
                themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] focus:border-blue-400' : 'bg-slate-50 border-slate-300 focus:border-blue-600'
              }`}
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-xs transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Routing</span>
          </button>
        </form>

        {/* Verification Result Card */}
        <div className={`p-4 rounded-lg border ${
          verificationResult.isValid 
            ? (themeMode === 'dark' ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300' : 'bg-emerald-50/80 border-emerald-200 text-emerald-900')
            : (themeMode === 'dark' ? 'bg-rose-950/20 border-rose-800/50 text-rose-300' : 'bg-rose-50/80 border-rose-200 text-rose-900')
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              {verificationResult.isValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-base">{verificationResult.routingNumber}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    verificationResult.isValid ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                  }`}>
                    {verificationResult.isValid ? 'VALID ROUTING PREFIX' : 'CHECKSUM FAILED'}
                  </span>
                </div>
                <div className="text-xs font-medium opacity-90">{verificationResult.bankName}</div>
                <div className="text-[11px] opacity-75">{verificationResult.federalReserveDistrict}</div>
                <div className="text-[11px] font-mono opacity-80 pt-1">
                  <strong>Checksum Math:</strong> {verificationResult.checksumCalculation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Searchable Standards Library */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              Institutional Standards & Security Rule Catalog
            </h3>
            <p className="text-xs opacity-75">Browse pre-registered and custom bank check specifications and ink requirements.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 opacity-50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bank standards..."
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs outline-none transition ${
                themeMode === 'dark' ? 'bg-[#2d2e31] border-[#5f6368] focus:border-blue-400' : 'bg-white border-slate-300 focus:border-blue-600'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStandards.map((std) => {
            const isCustom = customStandards.some(c => c.id === std.id);
            return (
              <div
                key={std.id}
                className={`p-4 sm:p-5 rounded-xl border shadow-xs flex flex-col justify-between transition hover:shadow-sm relative ${
                  themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043]' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base">{std.bankName}</h4>
                        {isCustom && (
                          <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            Custom
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono opacity-70">Routing Prefix: {std.routingPrefix}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      {isCustom && (
                        <button
                          onClick={() => handleRemoveCustomStandard(std.id)}
                          className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition"
                          title="Remove Custom Standard"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs opacity-90 pt-2 border-t border-inherit">
                    <div>
                      <strong className="opacity-75">MICR Font Spec:</strong> {std.micrFontSpec}
                    </div>
                    <div>
                      <strong className="opacity-75">Security Border:</strong> {std.borderSecurityType}
                    </div>
                    <div>
                      <strong className="opacity-75">Ink Characteristics:</strong> {std.inkCharacteristics}
                    </div>
                    <div>
                      <strong className="opacity-75">Paper Stock:</strong> {std.paperStock}
                    </div>
                    <div>
                      <strong className="opacity-75">Endorsement Rule:</strong> {std.endorsementRule}
                    </div>
                  </div>
                </div>

                <div className={`mt-4 p-2.5 rounded-lg text-xs flex items-start gap-2 ${
                  themeMode === 'dark' ? 'bg-[#202124] text-amber-300' : 'bg-amber-50/80 text-amber-900 border border-amber-200'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <strong>Training Tip:</strong> {std.trainingTip}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-inherit space-y-2">
                  {std.sampleImageUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-inherit bg-black/10 h-20 flex items-center justify-center">
                      <img src={std.sampleImageUrl} alt="Specimen Reference" className="max-h-full max-w-full object-contain" />
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                        Reference Specimen Loaded
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono opacity-75">Rules: {std.micrCheckCode ? 'Modular JS Configured' : 'Default'}</span>
                    <button
                      onClick={() => setEditingStandard(std)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium text-xs transition"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>{std.sampleImageUrl ? 'Edit Specimen & Rules' : 'Upload Specimen & Rules'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Standard Modal */}
      <AddBankStandardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStandard={handleSaveCustomStandard}
        themeMode={themeMode}
      />

      {/* Edit Standard Rules & Code Modal */}
      <EditStandardModal
        isOpen={!!editingStandard}
        onClose={() => setEditingStandard(null)}
        standard={editingStandard}
        onSaveStandard={handleSaveEditedStandard}
        themeMode={themeMode}
      />
    </div>
  );
};

