/**
 * @file BatchUploadQueueModal.tsx
 * @description Batch ingestion and Straight-Through Processing (STP) queue for processing multiple documents simultaneously.
 */

import React, { useState } from 'react';
import { X, Upload, Layers, CheckCircle2, AlertTriangle, Play, FileText, ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';
import { DocumentTemplate, ThemeMode } from '../types';

interface BatchUploadQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
  onImportBatch: (templates: DocumentTemplate[]) => void;
}

interface BatchItem {
  id: string;
  name: string;
  size: string;
  status: 'Queued' | 'Analyzing' | 'Completed' | 'Flagged';
  riskScore: number;
  imageUrl: string;
}

export const BatchUploadQueueModal: React.FC<BatchUploadQueueModalProps> = ({
  isOpen,
  onClose,
  themeMode,
  onImportBatch
}) => {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([
    {
      id: 'batch-1',
      name: 'wire-instruction-acme-9182.png',
      size: '248 KB',
      status: 'Completed',
      riskScore: 14,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'batch-2',
      name: 'commercial-check-forgery-0492.png',
      size: '312 KB',
      status: 'Flagged',
      riskScore: 89,
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newItems: BatchItem[] = Array.from(files as unknown as File[]).map((file, idx) => ({
        id: `batch-${Date.now()}-${idx}`,
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        status: 'Queued',
        riskScore: Math.floor(Math.random() * 60) + 15,
        imageUrl: URL.createObjectURL(file)
      }));
      setBatchItems(prev => [...prev, ...newItems]);
    }
  };

  const runBatchProcessing = () => {
    setIsProcessing(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < batchItems.length) {
        setBatchItems(prev => prev.map((item, i) => i === index ? { ...item, status: 'Completed' } : item));
        index++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 800);
  };

  const removeItem = (id: string) => {
    setBatchItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className={`w-full max-w-3xl  border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
        themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          themeMode === 'dark' ? 'border-[#3c4043] bg-[#2d2e31]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-blue-500" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Batch Ingestion & Straight-Through Processing (STP) Queue</h2>
              <p className="text-xs opacity-75">Automated high-volume check and wire document processing pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5  opacity-75 hover:opacity-100 hover:bg-black/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Upload Drop Zone */}
          <div className={`border-2 border-dashed  p-6 text-center transition ${
            themeMode === 'dark' ? 'border-[#5f6368] hover:border-blue-500 bg-[#292a2d]' : 'border-slate-300 hover:border-blue-500 bg-slate-50/50'
          }`}>
            <Upload className="w-8 h-8 mx-auto mb-2 text-blue-500 opacity-80" />
            <h4 className="font-bold text-xs uppercase tracking-wider mb-1">Drop Check Specimen Images or Click to Upload Batch</h4>
            <p className="text-xs opacity-75 mb-3">Supports PNG, JPG, TIFF, PDF multi-page bundles</p>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2  bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs shadow transition">
              <Upload className="w-4 h-4" />
              <span>Select Files for Batch Queue</span>
              <input type="file" multiple accept="image/*" onChange={handleFileDrop} className="hidden" />
            </label>
          </div>

          {/* Queue List Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider">Queue Items ({batchItems.length})</h4>
            <div className="flex items-center gap-2">
              <button
                onClick={runBatchProcessing}
                disabled={isProcessing || batchItems.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5  bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs shadow transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isProcessing ? 'Processing STP...' : 'Run STP Batch Pipeline'}</span>
              </button>
            </div>
          </div>

          {/* Queue Items Table */}
          <div className="space-y-2">
            {batchItems.map((item) => {
              const isFlagged = item.status === 'Flagged' || item.riskScore > 75;
              const isCompleted = item.status === 'Completed';
              return (
                <div 
                  key={item.id}
                  className={`flex items-center justify-between p-3  border transition ${
                    themeMode === 'dark' ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10  overflow-hidden bg-black/20 flex items-center justify-center shrink-0 border border-inherit">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs font-mono">{item.name}</h5>
                      <p className="text-[11px] opacity-75">Size: {item.size} • Risk Score: <span className="font-bold">{item.riskScore}/100</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold ${
                      isCompleted 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                        : isFlagged
                        ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                    }`}>
                      {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                      {isFlagged && <AlertTriangle className="w-3 h-3" />}
                      <span>{item.status}</span>
                    </span>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5  hover:bg-rose-500/10 hover:text-rose-500 opacity-60 hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs ${
          themeMode === 'dark' ? 'border-[#3c4043] bg-[#2d2e31]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2 opacity-75">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Straight-Through Processing (STP) active with automatic anomaly triage</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2  bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs shadow transition"
          >
            Close Batch Queue
          </button>
        </div>
      </div>
    </div>
  );
};
