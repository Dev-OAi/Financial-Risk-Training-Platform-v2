import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DocumentTemplate, HotSpot, ThemeMode, ComparisonMode } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, Sparkles, Flame } from 'lucide-react';

interface AugmentedCanvasProps {
  template: DocumentTemplate;
  comparisonTemplate?: DocumentTemplate;
  themeMode: ThemeMode;
  comparisonMode: ComparisonMode;
  selectedHotSpot: HotSpot | null;
  onSelectHotSpot: (spot: HotSpot) => void;
}

export const AugmentedCanvas: React.FC<AugmentedCanvasProps> = ({
  template,
  comparisonTemplate,
  themeMode,
  comparisonMode,
  selectedHotSpot,
  onSelectHotSpot,
}) => {
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start p-2 sm:p-3.5 overflow-y-auto">
      {/* Top Banner / Risk Badge & Heatmap Toggle */}
      <div className={`w-full max-w-5xl mb-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-lg border shadow-xs transition-colors ${
        themeMode === 'dark' ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-[#dadce0]'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-2 rounded-lg shrink-0 ${template.isFraudulent ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
            {template.isFraudulent ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs sm:text-sm font-bold text-inherit truncate">{template.title}</h2>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                template.isFraudulent ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {template.isFraudulent ? 'HIGH FRAUD PROBABILITY' : 'COMPLIANT TRAINING SAMPLE'}
              </span>
            </div>
            <p className="text-[11px] text-[#bdc1c6] mt-0.5 font-mono font-medium truncate">{template.subtitle}</p>
          </div>
        </div>

        {/* Risk Score Meter & Heatmap Toggle (Cleaned - duplicate upload button removed) */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
              showHeatmap 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                : themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043] text-slate-300 hover:bg-[#3c4043]' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title="Toggle Visual Heatmap Overlay"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Heatmap: {showHeatmap ? 'ON' : 'OFF'}</span>
          </button>

          <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border shrink-0 ${
            themeMode === 'dark' ? 'bg-[#323639] border-[#3c4043]' : 'bg-[#f8f9fa] border-[#dadce0]'
          }`}>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#bdc1c6] font-bold">Risk Assessment</div>
              <div className={`text-xs font-extrabold ${template.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                Risk Score: {template.riskScore}/100
              </div>
            </div>
            <div className="h-6 w-px bg-[#3c4043]"></div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-[#bdc1c6] font-bold">Confidence</div>
              <div className="text-xs font-extrabold text-[#e8eaed]">{template.confidence}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visual Render Area: Single or Compare Mode */}
      <div className={`w-full max-w-5xl grid gap-3 pb-4 ${comparisonMode === 'compare' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* Primary Document Canvas */}
        <div className="relative flex flex-col items-center w-full">
          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 self-start">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{comparisonMode === 'compare' ? 'Primary Document (Sample A)' : 'Augmented Training Canvas'}</span>
          </div>

          <DocumentSvgRenderer 
            template={template} 
            selectedHotSpot={selectedHotSpot}
            onSelectHotSpot={onSelectHotSpot}
            themeMode={themeMode}
            showHeatmap={showHeatmap}
          />
        </div>

        {/* Comparison Document Canvas (If Compare Mode Active) */}
        {comparisonMode === 'compare' && comparisonTemplate && (
          <div className="relative flex flex-col items-center w-full">
            <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 self-start">
              <ShieldAlert className="w-3 h-3" />
              <span>Comparison Document (Sample B - Fraudulent Variant)</span>
            </div>

            <DocumentSvgRenderer 
              template={comparisonTemplate} 
              selectedHotSpot={selectedHotSpot}
              onSelectHotSpot={onSelectHotSpot}
              themeMode={themeMode}
              showHeatmap={showHeatmap}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface DocumentSvgRendererProps {
  template: DocumentTemplate;
  selectedHotSpot: HotSpot | null;
  onSelectHotSpot: (spot: HotSpot) => void;
  themeMode: ThemeMode;
  showHeatmap: boolean;
}

const DocumentSvgRenderer: React.FC<DocumentSvgRendererProps> = ({
  template,
  selectedHotSpot,
  onSelectHotSpot,
  themeMode,
  showHeatmap,
}) => {
  return (
    <div id={`document-canvas-${template.id}`} className={`relative w-full aspect-[1.95/1] max-w-5xl rounded-lg border shadow-xs p-1 sm:p-2 overflow-hidden flex items-center justify-center select-none group transition-colors ${
      themeMode === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'
    }`}>
      
      {/* Background Security Guilloche Texture */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      {/* Risk Heatmap Intensity Overlay */}
      {showHeatmap && (
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Base Heatmap Gradient Grid based on template risk */}
          <div className={`absolute inset-0 opacity-25 transition-opacity ${
            template.isFraudulent 
              ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-600/60 via-amber-500/20 to-transparent' 
              : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/40 via-blue-500/10 to-transparent'
          }`} />

          {/* Hotspot Intensity Zones */}
          {template.hotspots.map((spot) => {
            const isCritical = spot.riskLevel === 'critical' || spot.riskLevel === 'high';
            return (
              <div
                key={`heatmap-${spot.id}`}
                className={`absolute rounded-full filter blur-xl transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isCritical 
                    ? 'w-36 h-36 bg-rose-500/40 animate-pulse' 
                    : 'w-28 h-28 bg-emerald-500/30'
                }`}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              />
            );
          })}
        </div>
      )}

      {template.imageUrl ? (
        <div className="absolute inset-2 flex items-center justify-center overflow-hidden rounded bg-black/40 z-1">
          <img 
            src={template.imageUrl} 
            alt={template.title} 
            className="w-full h-full object-contain rounded"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        /* SVG Check / Invoice Representation */
        <svg viewBox="0 0 800 440" className="w-full h-full drop-shadow-xs z-1">
        <defs>
          <linearGradient id={`checkBg-${template.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={template.isFraudulent ? '#fff1f2' : '#ffffff'} />
            <stop offset="100%" stopColor={template.isFraudulent ? '#ffe4e6' : '#f8fafc'} />
          </linearGradient>
        </defs>

        {/* Outer Check Border */}
        <rect x="12" y="12" width="776" height="416" rx="8" fill={`url(#checkBg-${template.id})`} stroke={template.isFraudulent ? '#e11d48' : '#94a3b8'} strokeWidth="1.5" />

        {/* Micro-printing Border Lines */}
        <rect x="22" y="22" width="756" height="396" rx="6" fill="none" stroke="#64748b" strokeWidth="0.75" strokeDasharray="4 2" opacity="0.6" />

        {/* Bank Logo / Header */}
        <g transform="translate(36, 40)">
          <rect x="0" y="0" width="65" height="28" rx="4" fill="#334155" fillOpacity="0.1" stroke="#334155" strokeWidth="1" />
          <text x="32" y="18" fill="#334155" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">LOGO</text>
          <text x="78" y="18" fill="#334155" fontSize="11" fontWeight="bold" fontFamily="sans-serif">ABC BANK — RISK TRAINING CORE</text>
        </g>

        {/* Check Number / Date */}
        <g transform="translate(610, 40)">
          <text x="0" y="12" fill="#64748b" fontSize="10" fontFamily="monospace">No. 10492</text>
          <text x="0" y="28" fill="#334155" fontSize="11" fontFamily="sans-serif">DATE: 10 / 24 / 2026</text>
        </g>

        {/* Payee Line */}
        <g transform="translate(36, 126)">
          <text x="0" y="0" fill="#475569" fontSize="11" fontWeight="600" fontFamily="sans-serif">PAY TO THE</text>
          <text x="0" y="14" fill="#475569" fontSize="11" fontWeight="600" fontFamily="sans-serif">ORDER OF:</text>
          <line x1="110" y1="12" x2="520" y2="12" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="125" y="4" fill={template.isFraudulent ? '#e11d48' : '#0f172a'} fontSize="15" fontWeight="bold" fontFamily="monospace">
            {template.isFraudulent ? 'ACME LOGISTICS (Altered Payee)' : 'ACME ENTERPRISES (Payee Verified)'}
          </text>
        </g>

        {/* Numerical Amount Box */}
        <g transform="translate(580, 110)">
          <rect x="0" y="0" width="180" height="42" rx="6" fill="#ffffff" stroke={template.isFraudulent ? '#e11d48' : '#475569'} strokeWidth="1.5" />
          <text x="15" y="27" fill={template.isFraudulent ? '#e11d48' : '#047857'} fontSize="18" fontWeight="bold" fontFamily="monospace">
            {template.isFraudulent ? '$12,500.00' : '$1,250.00'}
          </text>
        </g>

        {/* Written Amount Line */}
        <g transform="translate(36, 196)">
          <line x1="0" y1="0" x2="724" y2="0" stroke="#94a3b8" strokeWidth="1" />
          <text x="10" y="-8" fill="#1e293b" fontSize="13" fontStyle="italic" fontFamily="serif">
            {template.isFraudulent ? 'One Hundred Fifty and 00/100 Dollars (Discrepancy)' : 'One Thousand Two Hundred Fifty and 00/100 Dollars'}
          </text>
        </g>

        {/* Memo & Signature */}
        <g transform="translate(36, 276)">
          <text x="0" y="0" fill="#64748b" fontSize="10" fontFamily="monospace">MEMO: Consulting & Professional Training Services</text>
          
          <g transform="translate(460, -10)">
            <line x1="0" y1="0" x2="264" y2="0" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="60" y="16" fill="#475569" fontSize="10" fontWeight="bold" fontFamily="sans-serif">AUTHORIZED SIGNATURE</text>
            <text x="30" y="-12" fill={template.isFraudulent ? '#e11d48' : '#334155'} fontSize="14" fontStyle="italic" fontFamily="cursive">
              {template.isFraudulent ? 'J. D. Sterling (Forged)' : 'J. D. Sterling (Verified)'}
            </text>
          </g>
        </g>

        {/* MICR Clearing Line */}
        <g transform="translate(36, 370)">
          <text x="0" y="0" fill="#334155" fontSize="16" fontWeight="bold" fontFamily="monospace" letterSpacing="3">
            ⑈012345⑈ ∷098765432∷ 1234⑆
          </text>
        </g>
      </svg>
      )}

      {/* Glowing Hot-Spot Node Badges */}
      {template.hotspots.map((spot) => {
        const isSelected = selectedHotSpot?.id === spot.id;
        return (
          <div
            key={spot.id}
            onClick={() => onSelectHotSpot(spot)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node z-20"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          >
            {/* Pulsing Outer Ring */}
            <span className={`absolute -inset-2 rounded-full animate-ping opacity-50 ${
              spot.riskLevel === 'critical' ? 'bg-rose-500' :
              spot.riskLevel === 'high' ? 'bg-amber-500' :
              'bg-slate-600'
            }`}></span>

            {/* Core Badge */}
            <div className={`relative flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shadow-md transition-transform transform group-hover/node:scale-125 ${
              spot.riskLevel === 'critical' ? 'bg-rose-600 text-white shadow-rose-500/50' :
              spot.riskLevel === 'high' ? 'bg-amber-600 text-white shadow-amber-500/50' :
              isSelected ? 'bg-slate-900 text-white ring-2 ring-slate-400' : 'bg-slate-800 text-white shadow-slate-500/50'
            }`}>
              {spot.riskLevel === 'critical' ? '!' : spot.id.replace('h', '').replace('inv-', '').replace('cc-', '')}
            </div>

            {/* Hover Tooltip Label */}
            <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-100 text-[11px] whitespace-nowrap opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none shadow-lg z-30">
              {spot.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

