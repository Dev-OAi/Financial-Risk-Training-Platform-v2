/**
 * @file BankerVoiceCrmModal.tsx
 * @description Banker Voice Note to Structured CRM Task Converter modal for processing post-meeting audio debriefs into CRM tasks and client insights.
 */

import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Mic, FileText, Cpu, Headphones, Calendar } from 'lucide-react';
import { ThemeMode } from '../types';

interface BankerVoiceCrmModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const BankerVoiceCrmModal: React.FC<BankerVoiceCrmModalProps> = ({
  isOpen,
  onClose,
  themeMode
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [crmResult, setCrmResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAudioFileName(file.name);
    }
  };

  const handleRunVoiceExtraction = async () => {
    setIsProcessing(true);

    try {
      setTimeout(() => {
        const mockResult = {
          client_name: "Apex Global Logistics (CFO Marcus Vance)",
          meeting_type: "Commercial Credit & Treasury Review",
          key_discussion_points: [
            "Reviewed Q3 working capital loan extension up to $4.5M",
            "Client expressed interest in migrating ACH payroll processing to our API portal",
            "Discussed FX hedging options for European supplier payouts"
          ],
          product_interest_expressed: [
            "Treasury Management API",
            "Commercial Revolving Line of Credit",
            "Forward FX Contracts"
          ],
          structured_follow_up_tasks: [
            {
              task_description: "Send formal term sheet for $4.5M working capital extension",
              assigned_to: "Commercial Lending Team",
              due_date: "2026-09-02"
            },
            {
              task_description: "Schedule technical onboarding call for Treasury API portal with CFO's engineering lead",
              assigned_to: "Treasury Solutions Specialist",
              due_date: "2026-09-04"
            }
          ],
          audio_transcription_confidence: 97.4,
          crm_sync_status: "READY_FOR_SALESFORCE_EXPORT"
        };
        setCrmResult(mockResult);
        setIsProcessing(false);
      }, 1400);
    } catch (err) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className={`w-full max-w-3xl  border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        themeMode === 'dark' ? 'bg-[#202124] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          themeMode === 'dark' ? 'border-[#3c4043] bg-[#2d2e31]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <Mic className="w-5 h-5 text-indigo-500 animate-pulse" />
            <div>
              <h2 className="font-bold text-sm uppercase tracking-wider">Banker Voice Note to Structured CRM Task Converter</h2>
              <p className="text-xs opacity-75">Parse Post-Meeting Audio Debriefs into CRM Action Items Hands-Free</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5  opacity-75 hover:opacity-100 hover:bg-black/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Box */}
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Upload RM Audio Debrief (MP3, WAV, M4A, WEBM)
              </label>

              {!audioFileName ? (
                <label className={`border-2 border-dashed  p-8 flex flex-col items-center justify-center cursor-pointer transition ${
                  themeMode === 'dark' ? 'border-[#5f6368] hover:border-indigo-400 bg-[#292a2d]' : 'border-slate-300 hover:border-indigo-600 bg-slate-50'
                }`}>
                  <Headphones className="w-8 h-8 text-indigo-500 mb-2 animate-bounce" />
                  <span className="text-xs font-medium text-center">Click to browse or drop banker voice memo</span>
                  <span className="text-[10px] opacity-60 mt-1">Supports high-fidelity audio recordings</span>
                  <input type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="relative  border border-inherit bg-black/20 p-4 flex flex-col items-center space-y-3">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Mic className="w-4 h-4 text-indigo-400" />
                    <span className="truncate max-w-[220px]">{audioFileName}</span>
                  </div>
                  <button
                    onClick={() => { setAudioFileName(null); setSelectedFile(null); setCrmResult(null); }}
                    className="px-3 py-1  bg-rose-800/80 hover:bg-rose-800 text-white text-xs font-medium transition"
                  >
                    Remove / Change Audio File
                  </button>
                </div>
              )}

              {audioFileName && !crmResult && (
                <button
                  onClick={handleRunVoiceExtraction}
                  disabled={isProcessing}
                  className="w-full py-2.5  bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      <span>Transcribing & Parsing CRM Tasks...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Process Voice Debrief to CRM JSON</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Structured JSON Output */}
            <div className="space-y-3 flex flex-col">
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-80">
                Structured CRM Task JSON & Client Insights
              </label>

              <div className={`flex-1  p-4 font-mono text-xs border overflow-y-auto ${
                themeMode === 'dark' ? 'bg-[#18191c] border-[#3c4043]' : 'bg-slate-900 text-slate-100 border-slate-800'
              }`}>
                {crmResult ? (
                  <pre className="text-[11px] leading-relaxed text-indigo-300">
                    {JSON.stringify(crmResult, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-6 space-y-2">
                    <FileText className="w-8 h-8" />
                    <p className="text-xs">Upload a banker voice debrief recording and click process to automatically extract client name, discussion points, and structured follow-up tasks.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {crmResult && (
            <div className="p-4  border bg-indigo-500/10 border-indigo-500/30 text-indigo-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">
                    CRM Tasks Parsed for {crmResult.client_name}
                  </div>
                  <div className="text-[11px] opacity-90">
                    {crmResult.structured_follow_up_tasks.length} follow-up tasks generated with recommended due dates.
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1  bg-black/20">
                {crmResult.audio_transcription_confidence}% Accuracy
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex justify-end ${
          themeMode === 'dark' ? 'border-[#3c4043] bg-[#2d2e31]' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={onClose}
            className="px-4 py-2  bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs shadow transition"
          >
            Close Converter
          </button>
        </div>
      </div>
    </div>
  );
};
