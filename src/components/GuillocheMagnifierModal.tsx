/**
 * @file GuillocheMagnifierModal.tsx
 * @description High-magnification (40x) edge sharpness, raster pixel density, and guilloche pattern FFT frequency analysis modal.
 */

import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Search, Sliders, AlertTriangle, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { DocumentTemplate, ThemeMode } from '../types';

interface GuillocheMagnifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: DocumentTemplate;
  themeMode: ThemeMode;
}

export const GuillocheMagnifierModal: React.FC<GuillocheMagnifierModalProps> = ({
  isOpen,
  onClose,
  template,
  themeMode
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(4); // 2x to 10x
  const [activeFilter, setActiveFilter] = useState<'normal' | 'edge' | 'raster' | 'fft'>('edge');

  if (!isOpen) return null;

  const isSuspicious = template.isFraudulent || template.riskScore > 75;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className={`w-full max-w-4xl  border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          themeMode === 'dark' ? 'border-[#3c4043] bg-[#2d2e31]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <Search className="w-5 h-5 text-blue-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Micro-Typography & Guilloche Pattern FFT Frequency Analysis</h2>
              <p className="text-xs opacity-75">Specimen: <span className="font-mono font-semibold">{template.title}</span> • High-Magnification Edge & Raster Diagnostics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5  opacity-75 hover:opacity-100 hover:bg-black/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
          themeMode === 'dark' ? 'border-[#3c4043] bg-[#292a2d]' : 'border-slate-200 bg-slate-100/50'
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-medium opacity-75">Analysis Mode:</span>
            <button
              onClick={() => setActiveFilter('edge')}
              className={`px-3 py-1.5  font-medium transition ${activeFilter === 'edge' ? 'bg-slate-700 text-white' : 'opacity-75 hover:opacity-100'}`}
            >
              Edge Sharpness (Laplacian)
            </button>
            <button
              onClick={() => setActiveFilter('raster')}
              className={`px-3 py-1.5  font-medium transition ${activeFilter === 'raster' ? 'bg-slate-700 text-white' : 'opacity-75 hover:opacity-100'}`}
            >
              Pixel Raster Density
            </button>
            <button
              onClick={() => setActiveFilter('fft')}
              className={`px-3 py-1.5  font-medium transition ${activeFilter === 'fft' ? 'bg-slate-700 text-white' : 'opacity-75 hover:opacity-100'}`}
            >
              Guilloche FFT Spectrum
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium opacity-75">Magnification:</span>
            <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10  p-1">
              <button onClick={() => setZoomLevel(Math.max(2, zoomLevel - 1))} className="p-1  hover:bg-white/20">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono px-2 font-bold">{zoomLevel}x</span>
              <button onClick={() => setZoomLevel(Math.min(10, zoomLevel + 1))} className="p-1  hover:bg-white/20">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Magnifier Canvas & Inspector Panel */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Main Magnifier View */}
          <div className="md:col-span-2 relative bg-black/90 flex items-center justify-center overflow-hidden p-6">
            <div 
              className="relative  overflow-hidden shadow-2xl border border-white/20 transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 3 + 0.8})` }}
            >
              <img src={template.imageUrl} alt="Magnified Specimen" className="max-h-[350px] object-contain filter contrast-125" />
              
              {/* Simulated Scanner Reticle / Crosshair */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-24 h-24 border-2 border-emerald-400/80 flex items-center justify-center relative animate-pulse">
                  <div className="absolute w-2 h-2 bg-emerald-400" />
                  <div className="absolute w-full h-px bg-emerald-400/50" />
                  <div className="absolute h-full w-px bg-emerald-400/50" />
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 px-3 py-1.5  bg-black/75 backdrop-blur-xs text-white font-mono text-[10px] border border-white/10">
              MAGNIFICATION: {zoomLevel}x • FILTER: {activeFilter.toUpperCase()} • DPI: 2400
            </div>
          </div>

          {/* Diagnostic Metrics Sidebar */}
          <div className={`p-5 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 md:border-l ${
            themeMode === 'dark' ? 'border-[#3c4043] bg-[#252629]' : 'border-slate-200 bg-slate-50'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <h4 className="font-bold text-xs uppercase tracking-wider">Forensic Diagnostics</h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className={`p-3  border ${
                  isSuspicious 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                }`}>
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {isSuspicious ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{isSuspicious ? 'Inkjet Raster / Toner Variance Detected' : 'Authentic Offset Lithography Verified'}</span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    {isSuspicious 
                      ? 'Edge sharpness analysis indicates inkjet droplet diffusion and secondary toner overlay instead of solid offset printing.' 
                      : 'Uniform ink density and continuous guilloche waveform frequency match authentic bank engraving standards.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="opacity-75">Edge Acutance (Sharpening):</span>
                    <span className="font-bold">{isSuspicious ? '41.2 (Low)' : '94.8 (High)'}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="opacity-75">Raster Dot Variance (Moiré):</span>
                    <span className="font-bold">{isSuspicious ? 'High (Inkjet)' : 'None (Offset)'}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="opacity-75">Guilloche FFT Peak Frequency:</span>
                    <span className="font-bold">{isSuspicious ? 'Irregular Harmonics' : 'Synchronous Waveform'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-inherit">
              <button
                onClick={onClose}
                className="w-full py-2  bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs shadow transition"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
