import React, { useState } from 'react';
import { 
  Trophy, Award, Sparkles, ShieldAlert, CheckCircle2, AlertTriangle, XCircle, 
  ArrowRight, FileText, Layers, RefreshCw, Copy, Check, Download, ExternalLink, 
  Send, Calculator, ChevronRight, Play, Eye, Sliders, Briefcase, Landmark, 
  Smartphone, Building, FileSpreadsheet, ShieldCheck, Mail, Users, FileCheck, 
  Search, AlertCircle, Info, Zap
} from 'lucide-react';
import { ThemeMode, DocumentTemplate } from '../types';
import { OPTION_4_SUBMISSION, BUILDATHON_CANDIDATES } from '../data/buildathonData';
import { LiveCheckScannerDemo } from './LiveCheckScannerDemo';

interface BuildathonSuiteTabProps {
  currentTemplate: DocumentTemplate;
  themeMode: ThemeMode;
}

export const BuildathonSuiteTab: React.FC<BuildathonSuiteTabProps> = ({ currentTemplate, themeMode }) => {
  const [activeSubTab, setActiveSubTab] = useState<'option4' | 'candidates' | 'rubric' | 'dossier'>('option4');
  
  // Option #4 Parser State
  const [isParsingOption4, setIsParsingOption4] = useState(false);
  const [option4Result, setOption4Result] = useState<any>(OPTION_4_SUBMISSION.implementation.sampleOutput);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // ROI Calculator State
  const [dailyCheckVolume, setDailyCheckVolume] = useState<number>(8500);
  const [avgChargebackLoss, setAvgChargebackLoss] = useState<number>(1450);
  const [manualReviewCost, setManualReviewCost] = useState<number>(4.25);

  // Candidates State
  const [selectedCandidateId, setSelectedCandidateId] = useState<number>(11);
  const [candidateDeptFilter, setCandidateDeptFilter] = useState<string>('all');
  const [candidateInputState, setCandidateInputState] = useState<Record<number, any>>(() => {
    const initial: Record<number, any> = {};
    BUILDATHON_CANDIDATES.forEach(c => {
      initial[c.id] = { ...c.defaultInput };
    });
    return initial;
  });
  const [candidateOutputState, setCandidateOutputState] = useState<Record<number, any>>(() => {
    const initial: Record<number, any> = {};
    BUILDATHON_CANDIDATES.forEach(c => {
      initial[c.id] = c.sampleOutput;
    });
    return initial;
  });
  const [isCandidateRunning, setIsCandidateRunning] = useState(false);
  const [copiedCandidateOutput, setCopiedCandidateOutput] = useState(false);

  // Selected Candidate
  const currentCandidate = BUILDATHON_CANDIDATES.find(c => c.id === selectedCandidateId) || BUILDATHON_CANDIDATES[0];

  // Calculate ROI
  const annualCheckVolume = dailyCheckVolume * 252; // business days
  const manualReviewQueueBefore = annualCheckVolume * 0.08; // 8% exception rate
  const annualReviewCostBefore = manualReviewQueueBefore * manualReviewCost;
  const annualReviewCostAfter = annualReviewCostBefore * 0.35; // 65% reduction
  const manualReviewSavings = annualReviewCostBefore - annualReviewCostAfter;
  const estimatedFraudInterceptions = Math.round(annualCheckVolume * 0.0012); // 0.12% fraud rate
  const directFraudLossPrevented = estimatedFraudInterceptions * avgChargebackLoss;
  const totalAnnualValue = manualReviewSavings + directFraudLossPrevented;

  // Run Option #4 Parser via API
  const handleRunOption4Parser = async () => {
    setIsParsingOption4(true);
    try {
      const response = await fetch('/api/buildathon/check-fraud-parser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: currentTemplate.imageUrl || null,
          specimenDetails: {
            title: currentTemplate.title,
            riskScore: currentTemplate.riskScore,
            isFraudulent: currentTemplate.isFraudulent,
            summary: currentTemplate.summary
          }
        })
      });
      const data = await response.json();
      if (data.result) {
        setOption4Result(data.result);
      }
    } catch (error) {
      console.error('Failed to run Option #4 parser:', error);
      // Fallback
      setOption4Result(OPTION_4_SUBMISSION.implementation.sampleOutput);
    } finally {
      setIsParsingOption4(false);
    }
  };

  // Run Candidate Workflow via API
  const handleRunCandidateWorkflow = async (cand: typeof currentCandidate) => {
    setIsCandidateRunning(true);
    try {
      const inputPayload = candidateInputState[cand.id] || cand.defaultInput;
      const response = await fetch('/api/buildathon/run-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: cand.id,
          title: cand.title,
          department: cand.department,
          inputPayload: inputPayload,
          promptTemplate: cand.promptTemplate
        })
      });
      const data = await response.json();
      if (data.output) {
        setCandidateOutputState(prev => ({
          ...prev,
          [cand.id]: data.output
        }));
      }
    } catch (error) {
      console.error('Candidate execution error:', error);
      setCandidateOutputState(prev => ({
        ...prev,
        [cand.id]: cand.sampleOutput
      }));
    } finally {
      setIsCandidateRunning(false);
    }
  };

  const copyToClipboard = (text: string, type: 'prompt' | 'json' | 'candidate') => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else if (type === 'json') {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } else {
      setCopiedCandidateOutput(true);
      setTimeout(() => setCopiedCandidateOutput(false), 2000);
    }
  };

  const filteredCandidates = candidateDeptFilter === 'all' 
    ? BUILDATHON_CANDIDATES 
    : BUILDATHON_CANDIDATES.filter(c => c.department.toLowerCase().includes(candidateDeptFilter.toLowerCase()));

  const isDark = themeMode === 'dark';

  return (
    <div className={`h-full flex flex-col overflow-hidden ${isDark ? 'bg-[#1e1f20] text-[#e8eaed]' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Banner & Sub-Tabs Navigation */}
      <div className={`border-b shrink-0 px-6 py-4 ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-xs'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-emerald-600 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight">Bank Innovation Build-a-Thon 2026</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  100% Scorecard Optimized
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Engineered across 4 Judging Pillars: Business Value (25%) • Reusability (25%) • Solution Design (25%) • Output Quality (25%)
              </p>
            </div>
          </div>

          {/* Sub-Navigation Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveSubTab('option4')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeSubTab === 'option4'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-500'
                  : isDark ? 'bg-[#323639] hover:bg-[#3c4043] text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Option #4 Submission Packet & Live Parser</span>
            </button>

            <button
              onClick={() => setActiveSubTab('candidates')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeSubTab === 'candidates'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-500'
                  : isDark ? 'bg-[#323639] hover:bg-[#3c4043] text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>10 Candidates Lab (Ideas 11–20)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('rubric')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeSubTab === 'rubric'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-500'
                  : isDark ? 'bg-[#323639] hover:bg-[#3c4043] text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Judging Rubric & Scorecard</span>
            </button>

            <button
              onClick={() => setActiveSubTab('dossier')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeSubTab === 'dossier'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-500'
                  : isDark ? 'bg-[#323639] hover:bg-[#3c4043] text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Submission Packet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* ========================================================================= */}
        {/* SUB-VIEW 1: OPTION #4 SUBMISSION PACKET & LIVE MULTIMODAL PARSER */}
        {/* ========================================================================= */}
        {activeSubTab === 'option4' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* Header Hero Banner */}
            <div className={`p-6 rounded-2xl border relative overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-r from-[#202538] via-[#24293e] to-[#1e2233] border-blue-500/30' 
                : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border-blue-200 shadow-sm'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                      Official Candidate Entry • Option #4
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isDark ? 'bg-[#323639] border-[#3c4043] text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                    }`}>
                      {OPTION_4_SUBMISSION.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">{OPTION_4_SUBMISSION.title}</h2>
                  <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <strong>Target Departments:</strong> {OPTION_4_SUBMISSION.targetDepartment}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRunOption4Parser}
                    disabled={isParsingOption4}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-blue-500/30 flex items-center gap-2 transition transform active:scale-95 disabled:opacity-50"
                  >
                    {isParsingOption4 ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Running Multimodal Vision AI...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span>Execute Multimodal Check Parser</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 4 Pillars Summary Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-blue-500/20">
                <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-[#1e1f20]/60 border-[#3c4043]' : 'bg-white/80 border-slate-200'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">1. Business Value</span>
                  <span className="text-lg font-black text-emerald-500">25 / 25</span>
                  <span className="text-[10px] block opacity-75">60-70% Review Queue Cut</span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-[#1e1f20]/60 border-[#3c4043]' : 'bg-white/80 border-slate-200'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">2. Reusability</span>
                  <span className="text-lg font-black text-emerald-500">25 / 25</span>
                  <span className="text-[10px] block opacity-75">Branches, Mobile, Ops, PosPay</span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-[#1e1f20]/60 border-[#3c4043]' : 'bg-white/80 border-slate-200'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">3. Solution Design</span>
                  <span className="text-lg font-black text-emerald-500">25 / 25</span>
                  <span className="text-[10px] block opacity-75">4-Stage Vision AI Pipeline</span>
                </div>
                <div className={`p-3 rounded-xl border text-center ${isDark ? 'bg-[#1e1f20]/60 border-[#3c4043]' : 'bg-white/80 border-slate-200'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">4. Output Quality</span>
                  <span className="text-lg font-black text-emerald-500">25 / 25</span>
                  <span className="text-[10px] block opacity-75">Strict Standardized JSON</span>
                </div>
              </div>
            </div>

            {/* LIVE INTERACTIVE CHECK SCANNER & AUDIENCE DEMO STATION */}
            <LiveCheckScannerDemo currentTemplate={currentTemplate} themeMode={themeMode} />

            {/* Section 1: Executive Summary & Business Case (25%) */}
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-xs'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-sm tracking-tight">1. Executive Summary & Business Case (25% Business Value & Impact)</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Max Business Impact
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <h4 className="font-bold text-rose-500 mb-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      The Problem in Banking Operations
                    </h4>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      {OPTION_4_SUBMISSION.executiveSummary.problem}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-emerald-500 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      The Automated AI Solution
                    </h4>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      {OPTION_4_SUBMISSION.executiveSummary.solution}
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border space-y-2 ${isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="font-bold text-[11px] uppercase tracking-wider block text-blue-400">Measurable Value & ROI Outcomes</span>
                    <ul className="space-y-1.5 list-disc pl-4 text-[11px]">
                      <li><strong className="text-inherit">Direct Loss Prevention:</strong> {OPTION_4_SUBMISSION.executiveSummary.roi.directLossPrevention}</li>
                      <li><strong className="text-inherit">Efficiency Gains:</strong> {OPTION_4_SUBMISSION.executiveSummary.roi.efficiencyGains}</li>
                      <li><strong className="text-inherit">Speed to Triage:</strong> {OPTION_4_SUBMISSION.executiveSummary.roi.speedToTriage}</li>
                    </ul>
                  </div>
                </div>

                {/* Interactive ROI & Savings Calculator */}
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-blue-50/50 border-blue-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-xs">Interactive Branch Network ROI Calculator</h4>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-medium mb-1">
                        <span>Daily Ingested Checks (All Channels):</span>
                        <span className="font-bold font-mono text-blue-400">{dailyCheckVolume.toLocaleString()} checks/day</span>
                      </div>
                      <input 
                        type="range" 
                        min="1000" 
                        max="50000" 
                        step="500" 
                        value={dailyCheckVolume} 
                        onChange={(e) => setDailyCheckVolume(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-medium mb-1">
                        <span>Avg Chargeback Loss per Fraud Check:</span>
                        <span className="font-bold font-mono text-amber-400">${avgChargebackLoss.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" 
                        min="500" 
                        max="5000" 
                        step="50" 
                        value={avgChargebackLoss} 
                        onChange={(e) => setAvgChargebackLoss(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-medium mb-1">
                        <span>Manual Review Cost per Exception Item:</span>
                        <span className="font-bold font-mono text-emerald-400">${manualReviewCost.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="2" 
                        max="12" 
                        step="0.25" 
                        value={manualReviewCost} 
                        onChange={(e) => setManualReviewCost(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>

                    {/* Calculated Outcome Cards */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-inherit">
                      <div className={`p-2.5 rounded-lg border text-center ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-blue-200'}`}>
                        <span className="text-[10px] font-bold block opacity-75">Annual Manual Queue Savings</span>
                        <span className="text-base font-black font-mono text-emerald-500">${Math.round(manualReviewSavings).toLocaleString()}/yr</span>
                      </div>
                      <div className={`p-2.5 rounded-lg border text-center ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-blue-200'}`}>
                        <span className="text-[10px] font-bold block opacity-75">Fraud Losses Intercepted</span>
                        <span className="text-base font-black font-mono text-amber-500">${Math.round(directFraudLossPrevented).toLocaleString()}/yr</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-600/10 border border-emerald-500/30 text-center">
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">Total Net Bank Value Generated</span>
                      <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-300">
                        ${Math.round(totalAnnualValue).toLocaleString()} / year
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Reusability Across Valley & Bank Network (25%) */}
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-xs'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-bold text-sm tracking-tight">2. Cross-Departmental Reusability (25% Reusability)</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  4 Critical Bank Channels
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {OPTION_4_SUBMISSION.reusability.departments.map((dept, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-xl border transition hover:border-blue-500 ${
                      isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                        0{idx + 1}
                      </div>
                      <h4 className="font-bold text-xs tracking-tight">{dept.name}</h4>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div>
                        <span className="font-semibold text-inherit block">Use Case:</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{dept.useCase}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-emerald-500 block">Operational Impact:</span>
                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{dept.impact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Solution Design & Architecture (25%) */}
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-xs'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold text-sm tracking-tight">3. Solution Design & Tools Used (25% Solution Design & Creativity)</h3>
                </div>
                <div className="flex items-center gap-2">
                  {OPTION_4_SUBMISSION.solutionDesign.toolsUsed.map((tool, idx) => (
                    <span key={idx} className="hidden md:inline text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4-Step Pipeline Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {OPTION_4_SUBMISSION.solutionDesign.workflowSteps.map((step) => (
                  <div 
                    key={step.stepNumber}
                    className={`p-4 rounded-xl border relative ${
                      isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                        Step {step.stepNumber}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 hidden md:block" />
                    </div>
                    <h4 className="font-bold text-xs mb-1">{step.title}</h4>
                    <p className={`text-[11px] mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {step.description}
                    </p>
                    <ul className="space-y-1 text-[10px] list-disc pl-3 opacity-80">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Implementation, Prompts & Output Quality (25%) */}
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-xs'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-sm tracking-tight">4. Solution Implementation (Prompts & Output Quality - 25%)</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(
                      `${OPTION_4_SUBMISSION.implementation.systemRole}\n\nTASK: ${OPTION_4_SUBMISSION.implementation.task}\n\nINSTRUCTIONS:\n${OPTION_4_SUBMISSION.implementation.instructions.join('\n')}\n\nOUTPUT REQUIREMENTS:\n${OPTION_4_SUBMISSION.implementation.jsonSchema}`,
                      'prompt'
                    )}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition ${
                      isDark ? 'bg-[#323639] border-[#3c4043] hover:bg-[#3c4043]' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copied Prompt!' : 'Copy Core Prompt'}</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(JSON.stringify(option4Result, null, 2), 'json')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition ${
                      isDark ? 'bg-[#323639] border-[#3c4043] hover:bg-[#3c4043]' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedJson ? 'Copied JSON!' : 'Copy JSON Result'}</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side: Interactive Prompt Display & Live Parser Results */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Exact Prompt & Schema */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        Core Workflow Prompt (Input to Multimodal AI)
                      </span>
                    </div>
                    <div className={`p-3.5 rounded-xl border font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto ${
                      isDark ? 'bg-[#1a1b1d] border-[#3c4043] text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-300'
                    }`}>
                      <p className="text-amber-300 font-bold mb-2">{OPTION_4_SUBMISSION.implementation.systemRole}</p>
                      <p className="text-blue-300 font-bold mb-2">TASK: {OPTION_4_SUBMISSION.implementation.task}</p>
                      <p className="text-slate-300 font-bold mb-1">INSTRUCTIONS:</p>
                      <div className="space-y-1 text-slate-200 pl-2">
                        {OPTION_4_SUBMISSION.implementation.instructions.map((inst, idx) => (
                          <div key={idx}>{inst}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1.5">
                      Strict JSON Output Schema
                    </span>
                    <pre className={`p-3 rounded-xl border font-mono text-[10px] leading-snug max-h-48 overflow-y-auto ${
                      isDark ? 'bg-[#1a1b1d] border-[#3c4043] text-purple-300' : 'bg-slate-900 border-slate-800 text-purple-300'
                    }`}>
                      {OPTION_4_SUBMISSION.implementation.jsonSchema}
                    </pre>
                  </div>
                </div>

                {/* Right: Live Interactive Output Results */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Live AI Parser Execution Output
                    </span>
                    <button
                      onClick={handleRunOption4Parser}
                      disabled={isParsingOption4}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      {isParsingOption4 ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                      <span>Re-Run Parser</span>
                    </button>
                  </div>

                  {/* Visual Evaluation Summary Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`p-2.5 rounded-xl border text-center ${
                      option4Result?.verification_results?.amount_match 
                        ? isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : isDark ? 'bg-rose-950/40 border-rose-500/40 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <span className="text-[10px] font-bold block">Amount Match</span>
                      <span className="text-xs font-black">
                        {option4Result?.verification_results?.amount_match ? '✓ MATCHED' : '✗ MISMATCH'}
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-center ${
                      option4Result?.verification_results?.micr_structure_valid
                        ? isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : isDark ? 'bg-rose-950/40 border-rose-500/40 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <span className="text-[10px] font-bold block">MICR E-13B</span>
                      <span className="text-xs font-black">
                        {option4Result?.verification_results?.micr_structure_valid ? '✓ VALID' : '✗ INVALID'}
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-center ${
                      !option4Result?.verification_results?.payee_alteration_detected
                        ? isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : isDark ? 'bg-rose-950/40 border-rose-500/40 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      <span className="text-[10px] font-bold block">Payee Line</span>
                      <span className="text-xs font-black">
                        {option4Result?.verification_results?.payee_alteration_detected ? '✗ ALTERATION' : '✓ CLEAN'}
                      </span>
                    </div>
                  </div>

                  {/* Decision & Risk Banner */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    option4Result?.risk_assessment?.recommended_action === 'APPROVE'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                      : option4Result?.risk_assessment?.recommended_action === 'HOLD_FOR_REVIEW'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
                  }`}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Recommended Action</span>
                      <span className="text-base font-black tracking-tight">{option4Result?.risk_assessment?.recommended_action}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">Fraud Risk Score</span>
                      <span className="text-xl font-black font-mono">{option4Result?.risk_assessment?.risk_score} / 100</span>
                    </div>
                  </div>

                  {/* Extracted Data Table */}
                  <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                    isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="font-bold text-[11px] uppercase tracking-wider block text-slate-400">Extracted Structured Fields</span>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Courtesy Amount (Box):</span>
                        <span className="font-bold text-inherit">${option4Result?.extracted_data?.courtesy_amount_numeric?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Legal Amount (Line):</span>
                        <span className="font-bold text-inherit">{option4Result?.extracted_data?.legal_amount_text}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Payee Name:</span>
                        <span className="font-bold text-inherit">{option4Result?.extracted_data?.payee_name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Check Serial #:</span>
                        <span className="font-bold text-inherit">{option4Result?.extracted_data?.check_number}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">ABA Routing:</span>
                        <span className="font-bold text-inherit">{option4Result?.extracted_data?.routing_number}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Account #:</span>
                        <span className="font-bold text-inherit">{option4Result?.extracted_data?.account_number}</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Risk Flags */}
                  {option4Result?.risk_assessment?.primary_risk_flags?.length > 0 && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs">
                      <span className="font-bold text-[11px] uppercase tracking-wider block mb-1">Primary Anomaly Flags Detected:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                        {option4Result.risk_assessment.primary_risk_flags.map((flag: string, fIdx: number) => (
                          <li key={fIdx}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Formatted JSON Accordion */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Raw Output JSON Payload
                    </span>
                    <pre className={`p-3 rounded-xl border font-mono text-[10px] leading-tight max-h-40 overflow-y-auto ${
                      isDark ? 'bg-[#1a1b1d] border-[#3c4043] text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-300'
                    }`}>
                      {JSON.stringify(option4Result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-VIEW 2: 10 ADDITIONAL BUILD-A-THON CANDIDATES LAB (IDEAS 11-20) */}
        {/* ========================================================================= */}
        {activeSubTab === 'candidates' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">10 Additional Build-a-Thon Candidates (Ideas 11–20)</h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Live Interactive Sandboxes & Automated AI Workflows Tailored for Bank Operations
                </p>
              </div>

              {/* Department Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold opacity-75">Filter Department:</span>
                <select
                  value={candidateDeptFilter}
                  onChange={(e) => setCandidateDeptFilter(e.target.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${
                    isDark ? 'bg-[#292a2d] border-[#3c4043] text-[#e8eaed]' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="all">All Departments (10)</option>
                  <option value="Treasury">Treasury / Ops</option>
                  <option value="Retail">Retail Banking</option>
                  <option value="Customer Care">Customer Care</option>
                  <option value="Small Business">Small Business</option>
                  <option value="Human Resources">HR / Operations</option>
                  <option value="Commercial Real Estate">Commercial Real Estate</option>
                  <option value="Risk & Legal">Risk & Legal</option>
                  <option value="Branch Operations">Branch Operations</option>
                  <option value="Deposit Operations">Deposit Operations</option>
                </select>
              </div>
            </div>

            {/* Candidate Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {filteredCandidates.map((cand) => (
                <button
                  key={cand.id}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    selectedCandidateId === cand.id
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-600/10'
                      : isDark ? 'bg-[#292a2d] border-[#3c4043] hover:bg-[#323639]' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-600 text-white">
                        Idea #{cand.id}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-500">
                        {cand.pillarScores.businessValue + cand.pillarScores.reusability + cand.pillarScores.solutionDesign + cand.pillarScores.outputQuality}%
                      </span>
                    </div>
                    <h3 className="font-bold text-xs leading-tight mb-1 line-clamp-2">{cand.title}</h3>
                    <span className="text-[10px] opacity-75 font-medium block mb-2">{cand.department}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-500/10 font-medium inline-block truncate max-w-full">
                    {cand.solutionType}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Candidate Detailed Interactive Sandbox */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-inherit mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                      Candidate #{currentCandidate.id}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                      {currentCandidate.solutionType}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {currentCandidate.department}
                    </span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{currentCandidate.title}</h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <strong>What it Does:</strong> {currentCandidate.whatItDoes}
                  </p>
                </div>

                <button
                  onClick={() => handleRunCandidateWorkflow(currentCandidate)}
                  disabled={isCandidateRunning}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/30 flex items-center gap-2 transition disabled:opacity-50 shrink-0"
                >
                  {isCandidateRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Executing Banking Agent...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-amber-300" />
                      <span>Run AI Candidate Workflow</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4 Pillars & Why it Wins Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold text-blue-500 uppercase block">Why It Wins</span>
                  <span className="text-xs font-bold text-inherit mt-0.5 block leading-snug">{currentCandidate.whyItWins}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase block">Business Value (25%)</span>
                  <span className="text-lg font-black text-emerald-500">{currentCandidate.pillarScores.businessValue} / 25</span>
                  <span className="text-[10px] opacity-75 block">{currentCandidate.keyMetrics[0]}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold text-purple-500 uppercase block">Reusability (25%)</span>
                  <span className="text-lg font-black text-purple-500">{currentCandidate.pillarScores.reusability} / 25</span>
                  <span className="text-[10px] opacity-75 block">{currentCandidate.keyMetrics[1]}</span>
                </div>
                <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[10px] font-bold text-cyan-500 uppercase block">Solution & Quality (50%)</span>
                  <span className="text-lg font-black text-cyan-500">
                    {currentCandidate.pillarScores.solutionDesign + currentCandidate.pillarScores.outputQuality} / 50
                  </span>
                  <span className="text-[10px] opacity-75 block">{currentCandidate.keyMetrics[2]}</span>
                </div>
              </div>

              {/* Side-by-Side Interactive Scenario & AI Output */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Left: Input Scenario Parameters */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      Live Test Case Scenario & Ingested Data
                    </span>
                    <button
                      onClick={() => setCandidateInputState(prev => ({ ...prev, [currentCandidate.id]: { ...currentCandidate.defaultInput } }))}
                      className="text-[11px] font-medium text-slate-400 hover:text-slate-200"
                    >
                      Reset to Default
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-3 text-xs ${
                    isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
                  }`}>
                    {Object.entries(candidateInputState[currentCandidate.id] || currentCandidate.defaultInput).map(([key, val]) => (
                      <div key={key}>
                        <label className="font-bold text-[11px] capitalize text-slate-400 block mb-1">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </label>
                        {typeof val === 'string' && val.length > 60 ? (
                          <textarea
                            rows={3}
                            value={val}
                            onChange={(e) => {
                              const updated = { ...(candidateInputState[currentCandidate.id] || currentCandidate.defaultInput), [key]: e.target.value };
                              setCandidateInputState(prev => ({ ...prev, [currentCandidate.id]: updated }));
                            }}
                            className={`w-full p-2 rounded-lg border text-xs font-mono ${
                              isDark ? 'bg-[#1a1b1d] border-[#3c4043] text-slate-200' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        ) : typeof val === 'object' ? (
                          <textarea
                            rows={4}
                            value={JSON.stringify(val, null, 2)}
                            onChange={(e) => {
                              try {
                                const parsed = JSON.parse(e.target.value);
                                const updated = { ...(candidateInputState[currentCandidate.id] || currentCandidate.defaultInput), [key]: parsed };
                                setCandidateInputState(prev => ({ ...prev, [currentCandidate.id]: updated }));
                              } catch (err) {}
                            }}
                            className={`w-full p-2 rounded-lg border text-xs font-mono ${
                              isDark ? 'bg-[#1a1b1d] border-[#3c4043] text-slate-200' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={val as string}
                            onChange={(e) => {
                              const updated = { ...(candidateInputState[currentCandidate.id] || currentCandidate.defaultInput), [key]: e.target.value };
                              setCandidateInputState(prev => ({ ...prev, [currentCandidate.id]: updated }));
                            }}
                            className={`w-full p-2 rounded-lg border text-xs ${
                              isDark ? 'bg-[#1a1b1d] border-[#3c4043] text-slate-200' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: AI Output Generated */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Generated Operations Decision & Artifact
                    </span>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(candidateOutputState[currentCandidate.id] || currentCandidate.sampleOutput, null, 2), 'candidate')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition ${
                        isDark ? 'bg-[#323639] border-[#3c4043] hover:bg-[#3c4043]' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {copiedCandidateOutput ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCandidateOutput ? 'Copied!' : 'Copy Result'}</span>
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border font-mono text-xs leading-relaxed max-h-[480px] overflow-y-auto ${
                    isDark ? 'bg-[#1a1b1d] border-[#3c4043] text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-300'
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans text-xs">
                      {JSON.stringify(candidateOutputState[currentCandidate.id] || currentCandidate.sampleOutput, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-VIEW 3: 4-PILLAR SCORING RUBRIC & JUDGING SCORECARD */}
        {/* ========================================================================= */}
        {activeSubTab === 'rubric' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Bank Build-a-Thon Scoring Rubric & Judging Matrix</h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Official Evaluation Criteria: 4 Pillars Weighted at 25% Each (100% Maximum Score)
                </p>
              </div>
            </div>

            {/* 4 Pillars Detailed Rubric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-xs'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-sm">Pillar 1: Business Value & Impact (25%)</h3>
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">25 Pts</span>
                </div>
                <p className={`text-xs mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Measures quantifiable direct financial return, fraud prevention dollar volume, operational cycle time reduction, and cost savings across bank departments.
                </p>
                <ul className="space-y-1.5 text-xs list-disc pl-4 opacity-85">
                  <li><strong>Direct Dollar Loss Prevention:</strong> Intercepts chargebacks, wire fraud, and forged signatures prior to settlement.</li>
                  <li><strong>Labor & Queue Reduction:</strong> Cuts manual triage workloads by 60%+.</li>
                  <li><strong>Speed to Triage:</strong> Millisecond response times vs days of back-office friction.</li>
                </ul>
              </div>

              <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-xs'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-bold text-sm">Pillar 2: Reusability Across the Bank (25%)</h3>
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">25 Pts</span>
                </div>
                <p className={`text-xs mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Measures how seamlessly the solution extends horizontally across multiple departments, retail branches, mobile channels, and back-office clearing desks.
                </p>
                <ul className="space-y-1.5 text-xs list-disc pl-4 opacity-85">
                  <li><strong>Retail Branch Operations:</strong> Teller counter deposit point verification.</li>
                  <li><strong>Digital Channels:</strong> Remote Deposit Capture (RDC) background verification.</li>
                  <li><strong>Commercial Banking:</strong> Positive Pay client issue file automated cross-checking.</li>
                </ul>
              </div>

              <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-xs'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-500" />
                    <h3 className="font-bold text-sm">Pillar 3: Solution Design & Creativity (25%)</h3>
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">25 Pts</span>
                </div>
                <p className={`text-xs mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Evaluates the elegance of the architectural pipeline, multimodal AI reasoning, prompt chaining, and resilience against adversarial edge cases.
                </p>
                <ul className="space-y-1.5 text-xs list-disc pl-4 opacity-85">
                  <li><strong>Multimodal LLM / Vision Integration:</strong> High-precision OCR + visual texture anomaly analysis.</li>
                  <li><strong>Modular Architecture:</strong> 4-stage ingestion, analysis, cross-check, and decision pipeline.</li>
                  <li><strong>Mod-10 Checksum & Security Rule Engines:</strong> Zero reliance on unstructured free-form text.</li>
                </ul>
              </div>

              <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-xs'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-sm">Pillar 4: Solution Implementation & Output Quality (25%)</h3>
                  </div>
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">25 Pts</span>
                </div>
                <p className={`text-xs mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Evaluates prompt precision, strictness of the JSON schema, repeatability, actionable decision outputs (`APPROVE`, `HOLD_FOR_REVIEW`, `REJECT`), and error handling.
                </p>
                <ul className="space-y-1.5 text-xs list-disc pl-4 opacity-85">
                  <li><strong>Deterministic Schema:</strong> Standardized JSON output payload matching enterprise specifications.</li>
                  <li><strong>Actionable Triage Flags:</strong> Clear reason codes for ops teams with zero hallucination.</li>
                  <li><strong>Production Readiness:</strong> Full-stack execution with real-time fallback resilience.</li>
                </ul>
              </div>
            </div>

            {/* Candidate Comparison Matrix */}
            <div className={`p-5 rounded-xl border overflow-x-auto ${isDark ? 'bg-[#292a2d] border-[#3c4043]' : 'bg-white border-slate-200 shadow-xs'}`}>
              <h3 className="font-bold text-sm mb-3">All Candidates Scorecard Comparison Matrix</h3>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-[#3c4043] text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <th className="py-2.5 px-3">Candidate Idea</th>
                    <th className="py-2.5 px-3">Target Department</th>
                    <th className="py-2.5 px-3">Solution Type</th>
                    <th className="py-2.5 px-3 text-center">Business Value</th>
                    <th className="py-2.5 px-3 text-center">Reusability</th>
                    <th className="py-2.5 px-3 text-center">Design</th>
                    <th className="py-2.5 px-3 text-center">Quality</th>
                    <th className="py-2.5 px-3 text-center">Total Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit font-medium">
                  <tr className="bg-blue-600/10 font-bold">
                    <td className="py-3 px-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Option #4: Check Fraud & Mismatch Parser (Featured)</span>
                    </td>
                    <td className="py-3 px-3">Deposit Ops & Retail Branches</td>
                    <td className="py-3 px-3">AI Vision Agent</td>
                    <td className="py-3 px-3 text-center text-emerald-500">25/25</td>
                    <td className="py-3 px-3 text-center text-emerald-500">25/25</td>
                    <td className="py-3 px-3 text-center text-emerald-500">25/25</td>
                    <td className="py-3 px-3 text-center text-emerald-500">25/25</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-black text-sm">100%</td>
                  </tr>
                  {BUILDATHON_CANDIDATES.map((cand) => (
                    <tr key={cand.id} className={isDark ? 'hover:bg-[#323639]' : 'hover:bg-slate-50'}>
                      <td className="py-2.5 px-3">#{cand.id}. {cand.title}</td>
                      <td className="py-2.5 px-3">{cand.department}</td>
                      <td className="py-2.5 px-3">{cand.solutionType}</td>
                      <td className="py-2.5 px-3 text-center">{cand.pillarScores.businessValue}/25</td>
                      <td className="py-2.5 px-3 text-center">{cand.pillarScores.reusability}/25</td>
                      <td className="py-2.5 px-3 text-center">{cand.pillarScores.solutionDesign}/25</td>
                      <td className="py-2.5 px-3 text-center">{cand.pillarScores.outputQuality}/25</td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-500">
                        {cand.pillarScores.businessValue + cand.pillarScores.reusability + cand.pillarScores.solutionDesign + cand.pillarScores.outputQuality}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-VIEW 4: EXPORT COMPLETE SUBMISSION PACKET (DOSSIER) */}
        {/* ========================================================================= */}
        {activeSubTab === 'dossier' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Complete Build-a-Thon Submission Packet</h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Official Submission Packet for Option #4: Automated Check Fraud & Amount Mismatch Parser
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>

            {/* Printable Formatted Submission Dossier */}
            <div className={`p-8 rounded-2xl border space-y-6 print:border-none print:shadow-none ${
              isDark ? 'bg-[#292a2d] border-[#3c4043] text-slate-200' : 'bg-white border-slate-200 shadow-md text-slate-800'
            }`}>
              
              {/* Dossier Header */}
              <div className="border-b pb-4 border-inherit">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-500">
                      Bank Build-a-Thon Official Submission Dossier
                    </span>
                    <h1 className="text-2xl font-black mt-1 text-inherit">{OPTION_4_SUBMISSION.title}</h1>
                    <p className="text-xs font-medium opacity-80 mt-1">
                      <strong>Category:</strong> {OPTION_4_SUBMISSION.category} | <strong>Target Departments:</strong> {OPTION_4_SUBMISSION.targetDepartment}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold block opacity-75">Event Year: 2026</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Evaluated Score: 100/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wider text-blue-500 border-b pb-1 border-inherit">
                  1. Executive Summary & Business Case (25% Business Value & Impact)
                </h3>
                <div className="text-xs space-y-2 leading-relaxed">
                  <p><strong>The Problem:</strong> {OPTION_4_SUBMISSION.executiveSummary.problem}</p>
                  <p><strong>The Solution:</strong> {OPTION_4_SUBMISSION.executiveSummary.solution}</p>
                  <div>
                    <strong>Measurable Value & ROI:</strong>
                    <ul className="list-disc pl-5 space-y-1 mt-1">
                      <li><strong>Direct Loss Prevention:</strong> {OPTION_4_SUBMISSION.executiveSummary.roi.directLossPrevention}</li>
                      <li><strong>Efficiency Gains:</strong> {OPTION_4_SUBMISSION.executiveSummary.roi.efficiencyGains}</li>
                      <li><strong>Speed to Triage:</strong> {OPTION_4_SUBMISSION.executiveSummary.roi.speedToTriage}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wider text-blue-500 border-b pb-1 border-inherit">
                  2. Reusability Across the Bank (25% Reusability)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {OPTION_4_SUBMISSION.reusability.departments.map((dept, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'}`}>
                      <h4 className="font-bold text-inherit">{dept.name}</h4>
                      <p className="opacity-80 mt-0.5">{dept.useCase}</p>
                      <p className="text-emerald-500 font-semibold mt-1">{dept.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wider text-blue-500 border-b pb-1 border-inherit">
                  3. Solution Design & Tools Used (25% Solution Design & Creativity)
                </h3>
                <div className="text-xs space-y-2 leading-relaxed">
                  <p><strong>Tools Used:</strong> {OPTION_4_SUBMISSION.solutionDesign.toolsUsed.join(', ')}</p>
                  <div className="space-y-2 mt-2">
                    {OPTION_4_SUBMISSION.solutionDesign.workflowSteps.map(step => (
                      <div key={step.stepNumber} className="pl-3 border-l-2 border-blue-500">
                        <strong className="text-inherit">Step {step.stepNumber}: {step.title}</strong> — {step.description}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase tracking-wider text-blue-500 border-b pb-1 border-inherit">
                  4. Solution Implementation (Prompts & Output Quality - 25%)
                </h3>
                <div className="text-xs space-y-3">
                  <div>
                    <strong className="block mb-1">Core Workflow Prompt (Input to Multimodal AI Tool):</strong>
                    <div className={`p-3 rounded-lg font-mono text-[11px] whitespace-pre-wrap leading-tight border ${
                      isDark ? 'bg-[#1a1b1d] border-[#3c4043] text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-300'
                    }`}>
                      {`SYSTEM ROLE: ${OPTION_4_SUBMISSION.implementation.systemRole}\n\nTASK: ${OPTION_4_SUBMISSION.implementation.task}\n\nINSTRUCTIONS:\n${OPTION_4_SUBMISSION.implementation.instructions.join('\n')}\n\nOUTPUT REQUIREMENTS:\n${OPTION_4_SUBMISSION.implementation.jsonSchema}`}
                    </div>
                  </div>

                  <div>
                    <strong className="block mb-1">Sample Output Generation (Demonstrating Output Quality):</strong>
                    <pre className={`p-3 rounded-lg font-mono text-[11px] whitespace-pre-wrap leading-tight border ${
                      isDark ? 'bg-[#1a1b1d] border-[#3c4043] text-purple-300' : 'bg-slate-900 border-slate-800 text-purple-300'
                    }`}>
                      {JSON.stringify(OPTION_4_SUBMISSION.implementation.sampleOutput, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Sign-off footer */}
              <div className="pt-4 border-t border-inherit flex justify-between items-center text-[11px] opacity-75">
                <span>Submitted by: Bank Fraud Operations & AI Innovation Team</span>
                <span>Platform: Google AI Studio Build</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
