import React from 'react';
import { ShieldAlert, Moon, Sun, ArrowLeftRight, Download, Eye, Menu, PanelRight, HelpCircle, Search } from 'lucide-react';
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
  isRightSidebarOpen?: boolean;
  onSearch: (promptText: string, isFraudulent?: boolean) => void;
  isAiGenerating: boolean;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onOpenUploadScan: () => void;
  onOpenHelpGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  themeMode,
  setThemeMode,
  comparisonMode,
  setComparisonMode,
  onOpenExport,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  isRightSidebarOpen = false,
  onSearch,
  isAiGenerating,
  activeTab,
  setActiveTab,
  onOpenUploadScan,
  onOpenHelpGuide,
}) => {
  return (
    <header className={`w-full border-b px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30 transition-colors duration-200 ${
      themeMode === 'dark' 
        ? 'bg-[#292a2d] border-[#3c4043] text-[#e8eaed]' 
        : 'bg-white border-[#dadce0] text-[#202124] shadow-xs'
    }`}>
      {/* Branding & Menu Toggle */}
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

      {/* Center Search Box */}
      <div className="flex-1 max-w-md mx-2 flex justify-center hidden sm:flex">
        <SearchBox onSearch={onSearch} isGenerating={isAiGenerating} themeMode={themeMode} />
      </div>

      {/* Actions & Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Build-a-Thon 2026 Suite Button */}
        <button
          onClick={() => setActiveTab('buildathon')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
            activeTab === 'buildathon'
              ? 'bg-gradient-to-r from-amber-500 to-blue-600 text-white shadow-md border-amber-400'
              : themeMode === 'dark'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
          }`}
          title="Bank Build-a-Thon 2026 Innovation Suite"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Build-a-Thon 2026</span>
        </button>

        {/* Upload / Run Scan Button (Primary CTA) */}
        <button
          onClick={onOpenUploadScan}
          className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-500/20 transition-all border border-blue-500"
          title="Upload Check & Run Forensic Scan"
        >
          <Search className="w-4 h-4" />
          <span>Run Forensic Scan</span>
        </button>
        {/* Help Guide Button */}
        <button
          onClick={onOpenHelpGuide}
          className={`p-2 rounded-lg transition-colors border flex items-center gap-1.5 px-3 ${
            themeMode === 'dark'
              ? 'bg-[#323639] border-[#3c4043] text-blue-400 hover:bg-[#3c4043]'
              : 'bg-[#f1f3f4] border-[#dadce0] text-blue-600 hover:bg-[#e8eaed]'
          }`}
          title="Help & User Guide"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden md:inline text-xs font-medium">Guide</span>
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
              isRightSidebarOpen
                ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                : themeMode === 'dark'
                  ? 'bg-[#323639] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043]'
                  : 'bg-[#f1f3f4] border-[#dadce0] text-[#202124] hover:bg-[#e8eaed]'
            }`}
            title={isRightSidebarOpen ? "Close Risk Audit Log" : "Open Risk Audit Log"}
          >
            <PanelRight className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isRightSidebarOpen ? "Audit Log (Open)" : "Risk Audit Log"}</span>
          </button>
        )}
      </div>
    </header>
  );
};

