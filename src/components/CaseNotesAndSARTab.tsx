/**
 * @file CaseNotesAndSARTab.tsx
 * @description Collaborative multi-investigator case notes, flagged hotspot bookmarking, risk severity tagging,
 * and one-click FinCEN-compliant Suspicious Activity Report (SAR) Generator.
 */

import React, { useState } from 'react';
import { FileSpreadsheet, ShieldAlert, Plus, Trash2, Printer, CheckCircle, AlertTriangle, User, Calendar, FileText } from 'lucide-react';
import { CaseNote, DocumentTemplate, ThemeMode } from '../types';

interface CaseNotesAndSARTabProps {
  themeMode: ThemeMode;
  currentTemplate: DocumentTemplate;
}

export const CaseNotesAndSARTab: React.FC<CaseNotesAndSARTabProps> = ({
  themeMode,
  currentTemplate
}) => {
  const [notes, setNotes] = useState<CaseNote[]>([
    {
      id: 'note-1',
      timestamp: new Date().toLocaleString(),
      author: 'Senior Investigator J. Vance',
      investigatorRole: 'Lead Fraud Analyst',
      riskSeverity: currentTemplate.isFraudulent ? 'critical' : 'info',
      documentTitle: currentTemplate.title,
      noteText: currentTemplate.isFraudulent 
        ? 'Observed severe chemical wash residue on payee line and toner ghosting in MICR line. Recommending immediate stop-payment and SAR filing under FinCEN category Check Fraud.'
        : 'Routine compliance review completed. All E-13B magnetic ink signals and guilloche security patterns verify correctly.'
    }
  ]);

  const [newNoteText, setNewNoteText] = useState('');
  const [newAuthor, setNewAuthor] = useState('Analyst Miller');
  const [newRole, setNewRole] = useState('Compliance Officer');
  const [newSeverity, setNewSeverity] = useState<'info' | 'warning' | 'critical'>(currentTemplate.isFraudulent ? 'critical' : 'info');
  const [isGeneratingSar, setIsGeneratingSar] = useState(false);
  const [sarReport, setSarReport] = useState<string | null>(null);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const note: CaseNote = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      author: newAuthor,
      investigatorRole: newRole,
      riskSeverity: newSeverity,
      documentTitle: currentTemplate.title,
      noteText: newNoteText
    };

    setNotes([note, ...notes]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleGenerateFinCENSAR = () => {
    setIsGeneratingSar(true);
    setTimeout(() => {
      const report = `SUSPICIOUS ACTIVITY REPORT (FINCEN FORM 111)
===================================================
FILING INSTITUTION: Remix Financial Risk Training & Compliance Bureau
DATE OF FILING: ${new Date().toLocaleDateString()}
SUBJECT DOCUMENT: ${currentTemplate.title}
SPECIMEN TYPE: ${currentTemplate.type.toUpperCase()} (${currentTemplate.isFraudulent ? 'FRAUDULENT / ALTERED' : 'GENUINE COMPLIANT'})
CALCULATED RISK SCORE: ${currentTemplate.riskScore} / 100
AI CONFIDENCE RATING: ${currentTemplate.confidence}%

PART I: SUBJECT INFORMATION & ACCOUNT SUMMARY
- Document Reference ID: ${currentTemplate.id}
- Summary of Findings: ${currentTemplate.summary}

PART II: SUSPICIOUS ACTIVITY CHARACTERIZATION
- Check Washing / Chemical Alteration: ${currentTemplate.isFraudulent ? 'DETECTED (Acetone/Chlorine residue on payee line)' : 'None detected'}
- MICR E-13B Anomalies: ${currentTemplate.isFraudulent ? 'Counterfeit laser printer toner-transfer detected' : 'Standard magnetic iron-oxide ink verified'}
- Amount Discrepancy: ${currentTemplate.isFraudulent ? 'Numerical and written legal line mismatch' : 'Amounts reconciled'}

PART III: INVESTIGATIVE NOTES & CHRONOLOGY
${notes.map((n, idx) => `[${idx + 1}] ${n.timestamp} - ${n.author} (${n.investigatorRole}) [Severity: ${n.riskSeverity.toUpperCase()}]:\n    "${n.noteText}"`).join('\n\n')}

PART IV: COMPLIANCE OFFICER CERTIFICATION
I declare that I have examined this report, and to the best of my knowledge, the information provided above is true, correct, and complete in accordance with 31 CFR 1020.320.
Authorized Compliance Officer Signature: [Digital Cryptographic Seal Verified]
===================================================`;
      setSarReport(report);
      setIsGeneratingSar(false);
    }, 800);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-inherit pb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <FileSpreadsheet className="w-7 h-7 text-blue-500" />
            Collaborative Case Notes & FinCEN SAR Generator
          </h1>
          <p className="text-sm opacity-75 mt-1">
            Maintain multi-investigator audit trails, bookmark flagged inspection anomalies, and generate regulatory Suspicious Activity Reports.
          </p>
        </div>
        <button
          onClick={handleGenerateFinCENSAR}
          disabled={isGeneratingSar}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg transition flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>{isGeneratingSar ? 'Formatting SAR...' : 'Generate FinCEN SAR Report'}</span>
        </button>
      </div>

      {/* Generated SAR Report Output */}
      {sarReport && (
        <div className={`p-6 rounded-2xl border shadow-lg space-y-4 ${
          themeMode === 'dark' ? 'bg-[#202124] border-blue-500/50' : 'bg-slate-900 text-slate-100 border-blue-600'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>FinCEN Form 111 Regulatory Draft Generated Successfully</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Export PDF</span>
              </button>
              <button
                onClick={() => setSarReport(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Close Draft
              </button>
            </div>
          </div>
          <pre className="font-mono text-xs whitespace-pre-wrap overflow-x-auto text-emerald-300 p-4 bg-black/40 rounded-xl leading-relaxed">
            {sarReport}
          </pre>
        </div>
      )}

      {/* Add Case Note Form */}
      <div className={`p-6 rounded-2xl border shadow-sm ${
        themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043]' : 'bg-white border-slate-200'
      }`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-500" />
          Add Investigator Case Note for "{currentTemplate.title}"
        </h3>

        <form onSubmit={handleAddNote} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-75">Investigator Name</label>
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-75">Role / Department</label>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-75">Risk Severity Tag</label>
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as any)}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm outline-none ${
                  themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
                }`}
              >
                <option value="info">Info / Routine</option>
                <option value="warning">Warning / Elevated Risk</option>
                <option value="critical">Critical / Fraud Confirmed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-75">Forensic Observation & Case Findings</label>
            <textarea
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Enter detailed notes regarding magnification inspection, UV fiber reaction, or clearinghouse responses..."
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none ${
                themeMode === 'dark' ? 'bg-[#202124] border-[#5f6368]' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow transition"
            >
              Save Investigator Note
            </button>
          </div>
        </form>
      </div>

      {/* Case Notes History Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Investigation Audit Trail & Notes ({notes.length})</h3>

        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-5 rounded-2xl border shadow-sm transition ${
                themeMode === 'dark' ? 'bg-[#2d2e31] border-[#3c4043]' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    note.riskSeverity === 'critical' ? 'bg-rose-500/10 text-rose-500' :
                    note.riskSeverity === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {note.riskSeverity === 'critical' ? <ShieldAlert className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{note.author} <span className="text-xs opacity-60 font-normal">({note.investigatorRole})</span></div>
                    <div className="text-xs opacity-60 flex items-center gap-2 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{note.timestamp}</span>
                      <span>•</span>
                      <span className="font-medium">Document: {note.documentTitle}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${
                    note.riskSeverity === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                    note.riskSeverity === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {note.riskSeverity}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 rounded-lg opacity-60 hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm opacity-90 pl-11 leading-relaxed">{note.noteText}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
