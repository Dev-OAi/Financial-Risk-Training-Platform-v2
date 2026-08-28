import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { AugmentedCanvas } from './components/AugmentedCanvas';
import { ExportModal } from './components/ExportModal';
import { BankStandardsTab } from './components/BankStandardsTab';
import { CaseNotesAndSARTab } from './components/CaseNotesAndSARTab';
import { ExcelComparisonTable } from './components/ExcelComparisonTable';
import { WatchlistTab } from './components/WatchlistTab';
import { UploadScanModal } from './components/UploadScanModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import { BatchUploadQueueModal } from './components/BatchUploadQueueModal';
import { GuillocheMagnifierModal } from './components/GuillocheMagnifierModal';
import { INITIAL_TEMPLATES } from './data/mockTemplates';
import { DocumentTemplate, HotSpot, ThemeMode, ComparisonMode, AppTab } from './types';

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('single');
  const [activeTab, setActiveTab] = useState<AppTab>('inspector');
  const [templates, setTemplates] = useState<Record<string, DocumentTemplate>>(INITIAL_TEMPLATES);
  const [currentTemplate, setCurrentTemplate] = useState<DocumentTemplate>(INITIAL_TEMPLATES.genuineCheck);
  const [comparisonTemplate, setComparisonTemplate] = useState<DocumentTemplate>(INITIAL_TEMPLATES.fraudulentCheck);
  const [selectedHotSpot, setSelectedHotSpot] = useState<HotSpot | null>(INITIAL_TEMPLATES.genuineCheck.hotspots[0] || null);
  
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isUploadScanOpen, setIsUploadScanOpen] = useState(false);
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isMagnifierOpen, setIsMagnifierOpen] = useState(false);

  useEffect(() => {
    const handleOpenBatch = () => setIsBatchOpen(true);
    const handleOpenMagnifier = () => setIsMagnifierOpen(true);
    window.addEventListener('open-batch-queue', handleOpenBatch);
    window.addEventListener('open-guilloche-magnifier', handleOpenMagnifier);
    return () => {
      window.removeEventListener('open-batch-queue', handleOpenBatch);
      window.removeEventListener('open-guilloche-magnifier', handleOpenMagnifier);
    };
  }, []);

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setCurrentTemplate(template);
    setSelectedHotSpot(template.hotspots[0] || null);
    if (template.isFraudulent) {
      setComparisonTemplate(INITIAL_TEMPLATES.genuineCheck);
    } else {
      setComparisonTemplate(INITIAL_TEMPLATES.fraudulentCheck);
    }
  };

  const handleAddTemplate = (newTpl: DocumentTemplate) => {
    setTemplates(prev => ({
      ...prev,
      [newTpl.id]: newTpl
    }));
    handleSelectTemplate(newTpl);
  };

  const handleRemoveTemplate = (templateId: string) => {
    const keys = Object.keys(templates);
    if (keys.length <= 1) return; // Keep at least one
    const updated = { ...templates };
    delete updated[templateId];
    setTemplates(updated);
    const remainingKeys = Object.keys(updated);
    if (remainingKeys.length > 0) {
      handleSelectTemplate(updated[remainingKeys[0]]);
    }
  };

  const handleSearchPrompt = async (promptText: string, isFraudulent = false) => {
    setIsAiGenerating(true);
    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, isFraudulent, theme: themeMode }),
      });
      const data = await response.json();
      if (data.success && data.template) {
        handleAddTemplate(data.template);
      }
    } catch (err) {
      console.error('Failed to generate AI template:', err);
      const fallback = isFraudulent ? INITIAL_TEMPLATES.fraudulentCheck : INITIAL_TEMPLATES.genuineCheck;
      handleSelectTemplate(fallback);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      themeMode === 'dark' ? 'bg-[#202124] text-[#e8eaed]' : 'bg-[#f8f9fa] text-[#202124]'
    }`}>
      {/* Top Header */}
      <Header
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        comparisonMode={comparisonMode}
        setComparisonMode={setComparisonMode}
        onOpenExport={() => setIsExportOpen(true)}
        onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        onSearch={handleSearchPrompt}
        isAiGenerating={isAiGenerating}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUploadScan={() => setIsUploadScanOpen(true)}
        onOpenHelpGuide={() => setIsHelpGuideOpen(true)}
      />

      {/* Main Body Layout with Persistent Left Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Menu Sidebar */}
        <LeftSidebar
          isOpen={isLeftSidebarOpen}
          onClose={() => setIsLeftSidebarOpen(false)}
          currentTemplate={currentTemplate}
          onSelectTemplate={handleSelectTemplate}
          templates={templates}
          onAddTemplate={handleAddTemplate}
          onRemoveTemplate={handleRemoveTemplate}
          themeMode={themeMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenUploadScan={() => setIsUploadScanOpen(true)}
          onOpenHelpGuide={() => setIsHelpGuideOpen(true)}
        />

        {/* Central Workspace / Active Tab Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {activeTab === 'standards' && (
            <BankStandardsTab themeMode={themeMode} />
          )}

          {activeTab === 'sargenerator' && (
            <CaseNotesAndSARTab themeMode={themeMode} currentTemplate={currentTemplate} />
          )}

          {activeTab === 'excel' && (
            <div className="flex-1 p-4 overflow-hidden">
              <ExcelComparisonTable template={currentTemplate} themeMode={themeMode} />
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="flex-1 p-4 overflow-hidden">
              <WatchlistTab template={currentTemplate} themeMode={themeMode} />
            </div>
          )}

          {activeTab === 'inspector' && (
            <div className="flex-1 flex overflow-hidden relative w-full h-full">
              {/* Central Canvas Area */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <AugmentedCanvas
                  template={currentTemplate}
                  comparisonTemplate={comparisonTemplate}
                  themeMode={themeMode}
                  comparisonMode={comparisonMode}
                  selectedHotSpot={selectedHotSpot}
                  onSelectHotSpot={setSelectedHotSpot}
                />
              </div>

              {/* Right Sidebar Drawer */}
              <RightSidebar
                isOpen={isRightSidebarOpen}
                onClose={() => setIsRightSidebarOpen(false)}
                template={currentTemplate}
                selectedHotSpot={selectedHotSpot}
                onSelectHotSpot={setSelectedHotSpot}
                themeMode={themeMode}
                isAiGenerating={isAiGenerating}
              />
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        template={currentTemplate}
      />

      {/* Upload OCR Scan Modal */}
      <UploadScanModal
        isOpen={isUploadScanOpen}
        onClose={() => setIsUploadScanOpen(false)}
        onAddTemplate={handleAddTemplate}
        templates={templates}
        themeMode={themeMode}
      />

      {/* Help Guide Modal */}
      <HelpGuideModal
        isOpen={isHelpGuideOpen}
        onClose={() => setIsHelpGuideOpen(false)}
        themeMode={themeMode}
      />

      {/* Batch Ingestion & STP Queue Modal */}
      <BatchUploadQueueModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        themeMode={themeMode}
        onImportBatch={(_templates) => {}}
      />

      {/* Guilloche & Micro-Print Magnifier Modal */}
      <GuillocheMagnifierModal
        isOpen={isMagnifierOpen}
        onClose={() => setIsMagnifierOpen(false)}
        template={currentTemplate}
        themeMode={themeMode}
      />
    </div>
  );
}

