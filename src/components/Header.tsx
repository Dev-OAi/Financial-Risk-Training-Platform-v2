import React from 'react';
import { ShieldAlert, Moon, Sun, ArrowLeftRight, Download, Eye, Menu, PanelRight, Upload, BookOpen, FileSpreadsheet } from 'lucide-react';
import { ThemeMode, ComparisonMode, AppTab } from '../types';
import { SearchBox } from './SearchBox';

interface HeaderProps {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  comparisonMode: ComparisonMode;
  setComparisonMode: (mode: ComparisonMode) => void;
  onOpenExport: () => void;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onSearch: (promptText: string, isFraudulent?: boolean) => void;
  isAiGenerating: boolean;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenUploadScan: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  themeMode,
  setThemeMode,
  comparisonMode,
  setComparisonMode,
  onOpenExport,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onSearch,
  isAiGenerating,
  activeTab,
  setActiveTab,
  onOpenUploadScan,
}) => {
  return (
    <header className={`w-full border-b px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 sticky top-0 z-30 transition-colors duration-200 ${
      themeMode === 'dark' 
        ? 'bg-[#292a2d] border-[#3c4043] text-[#e8eaed]' 
        : 'bg-white border-[#dadce0] text-[#202124] shadow-xs'
    }`}>
      {/* Top Row: Branding & Navigation Tabs */}
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleLeftSidebar}
            className={`p-2 rounded-lg transition-colors border ${
              themeMode === 'dark' 
                ? 'bg-[#323639] border-[#3c4043] hover:bg-[#3c4043] text-[#e8eaed]' 
                : 'bg-[#f1f3f4] border-[#dadce0] hover:bg-[#e8eaed] text-[#202124]'
            }`}
            title="Toggle Training Modules Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white shadow-sm shrink-0">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="min-w-0 hidden lg:block">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-semibold text-sm sm:text-base tracking-tight text-inherit truncate">
                Financial Risk & Compliance Academy
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                Secure Core
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'inspector' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Document Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('standards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'standards' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bank Standards</span>
          </button>

          <button
            onClick={() => setActiveTab('sargenerator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'sargenerator' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Case Notes & SAR</span>
          </button>
        </div>

        {/* Actions & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Upload OCR Scan Button */}
          <button
            onClick={onOpenUploadScan}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow transition"
            title="Upload Document & OCR Scan"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload OCR Scan</span>
          </button>

          {/* Comparison Mode Toggle */}
          <button
            onClick={() => setComparisonMode(comparisonMode === 'single' ? 'compare' : 'single')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              comparisonMode === 'compare'
                ? 'bg-[#3c4043] text-[#e8eaed] border-[#5f6368] shadow-sm'
                : themeMode === 'dark'
                  ? 'bg-[#323639] text-[#e8eaed] border-[#3c4043] hover:bg-[#3c4043]'
                  : 'bg-[#f1f3f4] text-[#202124] border-[#dadce0] hover:bg-[#e8eaed]'
            }`}
            title="Compare Good vs Bad Check"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{comparisonMode === 'compare' ? 'Compare Active' : 'Compare Good vs Bad'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-lg transition-colors border ${
              themeMode === 'dark'
                ? 'bg-[#323639] border-[#3c4043] text-amber-300 hover:bg-[#3c4043]'
                : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124] hover:bg-[#e8eaed]'
            }`}
            title="Toggle Theme"
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className={`p-2 rounded-lg transition-colors border ${
              themeMode === 'dark'
                ? 'bg-[#323639] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043]'
                : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124] hover:bg-[#e8eaed]'
            }`}
            title="Export PNG"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Right Sidebar Drawer Toggle */}
          {activeTab === 'inspector' && (
            <button
              onClick={onToggleRightSidebar}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                themeMode === 'dark'
                  ? 'bg-[#323639] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043]'
                  : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124] hover:bg-[#e8eaed]'
              }`}
              title="Toggle Risk Audit Log Sidebar"
            >
              <PanelRight className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Risk Audit Log</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

