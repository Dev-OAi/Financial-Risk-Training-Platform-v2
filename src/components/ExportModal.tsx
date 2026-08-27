import React, { useState } from 'react';
import { X, Download, FileImage, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { DocumentTemplate } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: DocumentTemplate;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, template }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGeneratePng = async () => {
    setIsExporting(true);
    try {
      const svgElement = document.querySelector(`#document-canvas-${template.id} svg`);
      if (!svgElement) throw new Error('SVG container not found');

      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1600;
        canvas.height = 880;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');

        context.fillStyle = '#020617'; // slate-950 background
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const pngUrl = canvas.toDataURL('image/png');
        setPngDataUrl(pngUrl);
        setDownloadReady(true);
        setIsExporting(false);
        URL.revokeObjectURL(blobURL);
      };
      image.src = blobURL;
    } catch (err) {
      console.error('Export failed:', err);
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!pngDataUrl) return;
    const link = document.createElement('a');
    link.href = pngDataUrl;
    link.download = `${template.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_training_template.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <FileImage className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Export Training Template</h3>
            <p className="text-xs text-slate-400">Convert SVG template to high-resolution PNG for MS Paint & image editors</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 mb-6">
          <div className="text-xs font-semibold text-slate-300 mb-1">{template.title}</div>
          <div className="text-[11px] font-mono text-cyan-400">{template.subtitle}</div>
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Rasterized at 1600x880 true PNG format (compatible with MS Paint, Photoshop, GIMP)</span>
          </div>
        </div>

        {!downloadReady ? (
          <button
            onClick={handleGeneratePng}
            disabled={isExporting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
          >
            {isExporting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Rasterizing via HTML5 Canvas...</span>
              </>
            ) : (
              <>
                <FileImage className="w-4 h-4" />
                <span>Generate PNG Raster File</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>PNG raster successfully generated and ready for download!</span>
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG File</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
