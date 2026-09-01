import React from 'react';
import { X, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Lock } from 'lucide-react';
import { DocumentTemplate } from '../types';

interface RiskInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  template: DocumentTemplate;
}

export const RiskInspector: React.FC<RiskInspectorProps> = ({ isOpen, onClose, template }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Risk & Compliance Audit Log</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2  bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Document Summary Card */}
          <div className="p-4  bg-slate-950/60 border border-slate-800">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Active Specimen</div>
            <h3 className="text-sm font-bold text-slate-100 mb-2">{template.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{template.summary}</p>
          </div>

          {/* Risk Metrics Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3  bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Fraud Risk Score</div>
              <div className={`text-lg font-bold mt-1 ${template.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {template.riskScore} / 100
              </div>
            </div>
            <div className="p-3  bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Neural Confidence</div>
              <div className="text-lg font-bold text-cyan-400 mt-1">{template.confidence}%</div>
            </div>
          </div>

          {/* Hot-Spot Inspection List */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Document Field Hot-Spots ({template.hotspots.length})
            </h4>
            <div className="space-y-2.5">
              {template.hotspots.map((spot, index) => (
                <div key={spot.id} className="p-3  bg-slate-950/40 border border-slate-800/80 flex items-start gap-3">
                  <span className={`flex items-center justify-center w-6 h-6 text-xs font-bold shrink-0 mt-0.5 ${
                    spot.riskLevel === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    spot.riskLevel === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{spot.titleDescription}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{spot.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800 text-center">
        <p className="text-[11px] text-slate-500 font-mono">
          Financial Risk Training Platform v2.4 • Secured AI Core
        </p>
      </div>
    </div>
  );
};
