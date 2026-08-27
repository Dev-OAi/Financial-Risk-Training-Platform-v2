import React from 'react';
import { X, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Lock, Sparkles, Cpu } from 'lucide-react';
import { DocumentTemplate, HotSpot, ThemeMode } from '../types';

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  template: DocumentTemplate;
  selectedHotSpot: HotSpot | null;
  onSelectHotSpot: (spot: HotSpot) => void;
  themeMode: ThemeMode;
  isAiGenerating: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onClose,
  template,
  selectedHotSpot,
  onSelectHotSpot,
  themeMode,
  isAiGenerating,
}) => {
  return (
    <>


      {/* Right Sidebar Container */}
      <aside className={`fixed right-0 top-0 bottom-0 z-40 w-80 sm:w-96 xl:w-88 flex flex-col shrink-0 border-l transition-transform duration-300 ease-in-out shadow-2xl ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
      } ${
        themeMode === 'dark' 
          ? 'bg-[#292a2d] border-[#3c4043] text-[#e8eaed]' 
          : 'bg-white border-[#dadce0] text-[#202124]'
      }`}>
        {/* Header */}
        <div className="p-3.5 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-xs uppercase tracking-wider text-inherit">Risk & Compliance Audit Log</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${themeMode === 'dark' ? 'hover:bg-[#3c4043] text-[#bdc1c6]' : 'hover:bg-[#f1f3f4] text-[#5f6368]'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          {/* AI Generating Indicator */}
          {isAiGenerating && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs animate-pulse">
              <Cpu className="w-4 h-4 animate-spin shrink-0" />
              <span>Analyzing document risk variables & security marks...</span>
            </div>
          )}

          {/* Active Specimen Summary */}
          <div className={`p-3.5 rounded-lg border ${
            themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'
          }`}>
            <div className="text-[10px] font-bold text-[#bdc1c6] uppercase tracking-wider mb-1">Active Specimen</div>
            <h3 className="text-xs font-extrabold text-inherit mb-1">{template.title}</h3>
            <p className="text-[11px] text-[#bdc1c6] leading-relaxed font-medium">{template.summary}</p>
          </div>

          {/* Risk Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className={`p-3 rounded-lg border ${themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'}`}>
              <div className="text-[10px] font-bold text-[#bdc1c6] uppercase tracking-wider">Fraud Risk Score</div>
              <div className={`text-sm font-extrabold mt-1 ${template.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {template.riskScore} / 100
              </div>
            </div>
            <div className={`p-3 rounded-lg border ${themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'}`}>
              <div className="text-[10px] font-bold text-[#bdc1c6] uppercase tracking-wider">Neural Confidence</div>
              <div className="text-sm font-extrabold text-[#e8eaed] mt-1">{template.confidence}%</div>
            </div>
          </div>

          {/* Selected Hot-Spot Detail (If any) */}
          {selectedHotSpot && (
            <div className={`p-3.5 rounded-lg border ${
              selectedHotSpot.riskLevel === 'critical' ? 'bg-rose-500/10 border-rose-500/30 text-rose-200 font-medium' :
              selectedHotSpot.riskLevel === 'high' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200 font-medium' :
              'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 font-medium'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Selected Hot-Spot</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  selectedHotSpot.riskLevel === 'critical' ? 'bg-rose-600 text-white' :
                  selectedHotSpot.riskLevel === 'high' ? 'bg-amber-600 text-white' :
                  'bg-emerald-600 text-white'
                }`}>
                  {selectedHotSpot.riskLevel}
                </span>
              </div>
              <div className="text-xs font-extrabold text-inherit">{selectedHotSpot.titleDescription}</div>
              <p className="text-[11px] text-[#bdc1c6] mt-1 leading-relaxed">{selectedHotSpot.detail}</p>
            </div>
          )}

          {/* Hot-Spot Inspection List */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#bdc1c6] mb-2.5 px-1">
              Document Field Hot-Spots ({template.hotspots.length})
            </h4>
            <div className="space-y-1.5">
              {template.hotspots.map((spot, index) => {
                const isSelected = selectedHotSpot?.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => onSelectHotSpot(spot)}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 border ${
                      isSelected 
                        ? themeMode === 'dark'
                          ? 'bg-[#3c4043] border-[#5f6368] text-[#e8eaed] shadow-xs'
                          : 'bg-[#e8eaed] border-[#dadce0] text-[#202124] shadow-xs font-semibold'
                        : themeMode === 'dark'
                          ? 'bg-[#292a2d] border-[#3c4043] hover:bg-[#323639] text-[#bdc1c6]'
                          : 'bg-white border-[#dadce0] hover:bg-[#f1f3f4] text-[#202124]'
                    }`}
                  >
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 mt-0.5 ${
                      spot.riskLevel === 'critical' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                      spot.riskLevel === 'high' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-inherit truncate">{spot.title}</div>
                      <div className="text-[10px] text-[#bdc1c6] mt-0.5 truncate font-medium">{spot.titleDescription}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-inherit text-center">
          <p className="text-[10px] font-bold text-[#bdc1c6] font-mono">
            Secure Audit Trail • Compliance Core
          </p>
        </div>
      </aside>
    </>
  );
};
