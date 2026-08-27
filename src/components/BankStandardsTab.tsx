/**
 * @file BankStandardsTab.tsx
 * @description Searchable standards library, bank check specifications, ink rules, and real-time ABA routing number verifier.
 */

import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, XCircle, BookOpen, AlertCircle, Building2, Cpu, FileCheck } from 'lucide-react';
import { BANK_STANDARDS_DATABASE, verifyRoutingNumber } from '../data/bankStandardsLibrary';
import { ThemeMode, RoutingVerificationResult } from '../types';

interface BankStandardsTabProps {
  themeMode: ThemeMode;
}

export const BankStandardsTab: React.FC<BankStandardsTabProps> = ({ themeMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [routingInput, setRoutingInput] = useState('121000358');
  const [verificationResult, setVerificationResult] = useState<RoutingVerificationResult>(
    verifyRoutingNumber('121000358')
  );

  const handleVerifyRouting = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationResult(verifyRoutingNumber(routingInput));
  };

  const filteredStandards = Object.values(BANK_STANDARDS_DATABASE).filter(std =>
    std.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    std.routingPrefix.includes(searchTerm) ||
    std.micrFontSpec.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-inherit pb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Building2 className="w-7 h-7 text-blue-500" />
            Bank Security Specifications & Routing Standards Library
          </h1>
          <p className="text-sm opacity-75 mt-1">
            Cross-reference institutional security features, E-13B magnetic ink rules, thermochromic inks, and real-time ABA check digits.
          </p>
        </div>
      </div>

      {/* Real-time routing number verification tool */}
      <div className={`p-6 rounded-2xl border shadow-sm transition ${
        themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Real-Time ABA Routing Number Verification Engine</h2>
            <p className="text-xs opacity-75">Test 9-digit American Bankers Association transit routing numbers with Mod-10 weighted checksum validation.</p>
          </div>
        </div>

        <form onSubmit={handleVerifyRouting} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              maxLength={9}
              value={routingInput}
              onChange={(e) => setRoutingInput(e.target.value)}
              placeholder="Enter 9-digit routing number (e.g. 121000358)"
              className={`w-full px-4 py-3 rounded-xl border font-mono text-base tracking-wider outline-none transition ${
                themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368] focus:border-blue-400' : 'bg-slate-50 border-slate-300 focus:border-blue-600'
              }`}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Verify Routing</span>
          </button>
        </form>

        {/* Verification Result Card */}
        <div className={`p-5 rounded-xl border ${
          verificationResult.isValid 
            ? (themeMode === 'dark' ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900')
            : (themeMode === 'dark' ? 'bg-rose-950/20 border-rose-800/50 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900')
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {verificationResult.isValid ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-500 mt-0.5 shrink-0" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-lg">{verificationResult.routingNumber}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    verificationResult.isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {verificationResult.isValid ? 'VALID ROUTING PREFIX' : 'CHECKSUM FAILED'}
                  </span>
                </div>
                <div className="text-sm font-medium opacity-90">{verificationResult.bankName}</div>
                <div className="text-xs opacity-75">{verificationResult.federalReserveDistrict}</div>
                <div className="text-xs font-mono opacity-80 pt-1">
                  <strong>Checksum Math:</strong> {verificationResult.checksumCalculation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Searchable Standards Library */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Institutional Standards & Security Rule Catalog
            </h3>
            <p className="text-xs opacity-75">Browse pre-registered bank check specifications and ink requirements.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 opacity-50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bank standards..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition ${
                themeMode === 'dark' ? 'bg-[#2d2e31] border-[#5f6368] focus:border-blue-400' : 'bg-white border-slate-300 focus:border-blue-600'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStandards.map((std) => (
            <div
              key={std.id}
              className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between transition hover:shadow-md ${
                themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-base">{std.bankName}</h4>
                    <span className="text-xs font-mono opacity-70">Routing Prefix: {std.routingPrefix}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <FileCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2 text-xs opacity-95 pt-2 border-t border-inherit">
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

              <div className={`mt-5 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                themeMode === 'dark' ? 'bg-[#202124] text-amber-300' : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <strong>Training Tip:</strong> {std.trainingTip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
