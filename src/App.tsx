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
import { KycExtractorModal } from './components/KycExtractorModal';
import { CheckFraudAnalyzerModal } from './components/CheckFraudAnalyzerModal';
import { AtmReceiptClaimModal } from './components/AtmReceiptClaimModal';
import { BankerVoiceCrmModal } from './components/BankerVoiceCrmModal';
import { PaperLoanDigitizerModal } from './components/PaperLoanDigitizerModal';
import { BranchSecurityAuditModal } from './components/BranchSecurityAuditModal';
import { VaultLogInspectorModal } from './components/VaultLogInspectorModal';
import { MarketingSignageAuditModal } from './components/MarketingSignageAuditModal';
import { MismatchedAmountVerifierModal } from './components/MismatchedAmountVerifierModal';
import { PayeeAlterationInspectorModal } from './components/PayeeAlterationInspectorModal';
import { CheckKitingAnalyzerModal } from './components/CheckKitingAnalyzerModal';
import { ForgedEndorsementInspectorModal } from './components/ForgedEndorsementInspectorModal';
import { SyntheticCheckStockDetectorModal } from './components/SyntheticCheckStockDetectorModal';
import { AtmImageQualityTriageModal } from './components/AtmImageQualityTriageModal';
import { BlockedRoutingInterceptorModal } from './components/BlockedRoutingInterceptorModal';
import { PositivePayTriagerModal } from './components/PositivePayTriagerModal';
import { MicrIntegrityInspectorModal } from './components/MicrIntegrityInspectorModal';
import { ChemicalWashScreenerModal } from './components/ChemicalWashScreenerModal';
import { OutOfStateIssuerAgentModal } from './components/OutOfStateIssuerAgentModal';
import { RdcScreenCaptureFilterModal } from './components/RdcScreenCaptureFilterModal';
import { PayeeEndorsementCrossCheckerModal } from './components/PayeeEndorsementCrossCheckerModal';
import { FakeCashiersCheckValidatorModal } from './components/FakeCashiersCheckValidatorModal';
import { ExifMetadataAuditorModal } from './components/ExifMetadataAuditorModal';
import { PayeeNameMatchingAgentModal } from './components/PayeeNameMatchingAgentModal';
import { StolenBlankCheckPredictorModal } from './components/StolenBlankCheckPredictorModal';
import { CheckWatermarkVisionAuditorModal } from './components/CheckWatermarkVisionAuditorModal';
import { RdcGeolocationRiskEngineModal } from './components/RdcGeolocationRiskEngineModal';
import { CheckDateVerifierModal } from './components/CheckDateVerifierModal';
import { SyntheticPayrollBatchVerifierModal } from './components/SyntheticPayrollBatchVerifierModal';
import { CashiersCheckApiInspectorModal } from './components/CashiersCheckApiInspectorModal';
import { CheckLightingTamperDetectorModal } from './components/CheckLightingTamperDetectorModal';
import { CheckAlteredPayableLineScreenerModal } from './components/CheckAlteredPayableLineScreenerModal';
import { CheckSignatureVerificationModal } from './components/CheckSignatureVerificationModal';
import { CheckDormancyActivationScreenerModal } from './components/CheckDormancyActivationScreenerModal';
import { JsonVaultTab } from './components/JsonVaultTab';
import { INITIAL_TEMPLATES } from './data/mockTemplates';
import { DocumentTemplate, HotSpot, ThemeMode, ComparisonMode, AppTab } from './types';

// -----------------------------------------------------------------------------
// CORE LAYOUT COMPONENT: App.tsx
// -----------------------------------------------------------------------------
// This is the primary root component for the Financial Risk & Compliance Platform.
// It manages global state (theme, selected documents, active tabs, modal visibility)
// and handles the composition of the LeftSidebar, Center Canvas, and RightSidebar.
// -----------------------------------------------------------------------------

export default function App() {
  // --- Main Application State ---
  // Tracks theme (dark/light), layout modes, and active tools.
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('single');
  const [activeTab, setActiveTab] = useState<AppTab>('inspector');
  const [templates, setTemplates] = useState<Record<string, DocumentTemplate>>(INITIAL_TEMPLATES);
  const [currentTemplate, setCurrentTemplate] = useState<DocumentTemplate>(INITIAL_TEMPLATES.genuineCheck);
  const [comparisonTemplate, setComparisonTemplate] = useState<DocumentTemplate>(INITIAL_TEMPLATES.fraudulentCheck);
  const [selectedHotSpot, setSelectedHotSpot] = useState<HotSpot | null>(INITIAL_TEMPLATES.genuineCheck.hotspots[0] || null);
  
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  // --- Modals State Management ---
  // Booleans tracking the visibility of all specialized analysis tools and guides.
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isUploadScanOpen, setIsUploadScanOpen] = useState(false);
  const [isHelpGuideOpen, setIsHelpGuideOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isMagnifierOpen, setIsMagnifierOpen] = useState(false);
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [isCheckFraudOpen, setIsCheckFraudOpen] = useState(false);
  const [isAtmClaimOpen, setIsAtmClaimOpen] = useState(false);
  const [isBankerVoiceOpen, setIsBankerVoiceOpen] = useState(false);
  const [isPaperLoanOpen, setIsPaperLoanOpen] = useState(false);
  const [isBranchSecurityOpen, setIsBranchSecurityOpen] = useState(false);
  const [isVaultLogOpen, setIsVaultLogOpen] = useState(false);
  const [isMarketingSignageOpen, setIsMarketingSignageOpen] = useState(false);
  const [isMismatchedAmountOpen, setIsMismatchedAmountOpen] = useState(false);
  const [isPayeeAlterationOpen, setIsPayeeAlterationOpen] = useState(false);
  const [isCheckKitingOpen, setIsCheckKitingOpen] = useState(false);
  const [isForgedEndorsementOpen, setIsForgedEndorsementOpen] = useState(false);
  const [isSyntheticStockOpen, setIsSyntheticStockOpen] = useState(false);
  const [isAtmImageQualityOpen, setIsAtmImageQualityOpen] = useState(false);
  const [isBlockedRoutingOpen, setIsBlockedRoutingOpen] = useState(false);
  const [isPositivePayOpen, setIsPositivePayOpen] = useState(false);
  const [isMicrIntegrityOpen, setIsMicrIntegrityOpen] = useState(false);
  const [isChemicalWashOpen, setIsChemicalWashOpen] = useState(false);
  const [isOutOfStateIssuerOpen, setIsOutOfStateIssuerOpen] = useState(false);
  const [isRdcScreenCaptureOpen, setIsRdcScreenCaptureOpen] = useState(false);
  const [isPayeeEndorsementCrossCheckOpen, setIsPayeeEndorsementCrossCheckOpen] = useState(false);
  const [isFakeCashiersCheckOpen, setIsFakeCashiersCheckOpen] = useState(false);
  const [isExifMetadataOpen, setIsExifMetadataOpen] = useState(false);
  const [isPayeeNameMatchingOpen, setIsPayeeNameMatchingOpen] = useState(false);
  const [isStolenBlankCheckPredictorOpen, setIsStolenBlankCheckPredictorOpen] = useState(false);
  const [isCheckWatermarkOpen, setIsCheckWatermarkOpen] = useState(false);
  const [isRdcGeolocationRiskOpen, setIsRdcGeolocationRiskOpen] = useState(false);
  const [isCheckDateVerifierOpen, setIsCheckDateVerifierOpen] = useState(false);
  const [isSyntheticPayrollOpen, setIsSyntheticPayrollOpen] = useState(false);
  const [isCashiersCheckApiOpen, setIsCashiersCheckApiOpen] = useState(false);
  const [isLightingTamperOpen, setIsLightingTamperOpen] = useState(false);
  const [isAlteredPayableOpen, setIsAlteredPayableOpen] = useState(false);
  const [isSignatureVerificationOpen, setIsSignatureVerificationOpen] = useState(false);
  const [isDormancyScreenerOpen, setIsDormancyScreenerOpen] = useState(false);

  // --- Global Event Listeners for Specialized Modules ---
  // The LeftSidebar dispatches CustomEvents when modular tool buttons are clicked.
  // This effect listens to those events and sets the corresponding modal state to true.
  useEffect(() => {
    const handleOpenBatch = () => setIsBatchOpen(true);
    const handleOpenMagnifier = () => setIsMagnifierOpen(true);
    const handleOpenKyc = () => setIsKycOpen(true);
    const handleOpenCheckFraud = () => setIsCheckFraudOpen(true);
    const handleOpenAtmClaim = () => setIsAtmClaimOpen(true);
    const handleOpenBankerVoice = () => setIsBankerVoiceOpen(true);
    const handleOpenPaperLoan = () => setIsPaperLoanOpen(true);
    const handleOpenBranchSecurity = () => setIsBranchSecurityOpen(true);
    const handleOpenVaultLog = () => setIsVaultLogOpen(true);
    const handleOpenMarketingSignage = () => setIsMarketingSignageOpen(true);
    const handleOpenMismatchedAmount = () => setIsMismatchedAmountOpen(true);
    const handleOpenPayeeAlteration = () => setIsPayeeAlterationOpen(true);
    const handleOpenCheckKiting = () => setIsCheckKitingOpen(true);
    const handleOpenForgedEndorsement = () => setIsForgedEndorsementOpen(true);
    const handleOpenSyntheticStock = () => setIsSyntheticStockOpen(true);
    const handleOpenAtmImageQuality = () => setIsAtmImageQualityOpen(true);
    const handleOpenBlockedRouting = () => setIsBlockedRoutingOpen(true);
    const handleOpenPositivePay = () => setIsPositivePayOpen(true);
    const handleOpenMicrIntegrity = () => setIsMicrIntegrityOpen(true);
    const handleOpenChemicalWash = () => setIsChemicalWashOpen(true);
    const handleOpenOutOfStateIssuer = () => setIsOutOfStateIssuerOpen(true);
    const handleOpenRdcScreenCapture = () => setIsRdcScreenCaptureOpen(true);
    const handleOpenPayeeEndorsementCrossCheck = () => setIsPayeeEndorsementCrossCheckOpen(true);
    const handleOpenFakeCashiersCheck = () => setIsFakeCashiersCheckOpen(true);
    const handleOpenExifMetadata = () => setIsExifMetadataOpen(true);
    const handleOpenPayeeNameMatching = () => setIsPayeeNameMatchingOpen(true);
    const handleOpenStolenBlankCheckPredictor = () => setIsStolenBlankCheckPredictorOpen(true);
    const handleOpenCheckWatermark = () => setIsCheckWatermarkOpen(true);
    const handleOpenRdcGeolocationRisk = () => setIsRdcGeolocationRiskOpen(true);
    const handleOpenCheckDateVerifier = () => setIsCheckDateVerifierOpen(true);
    const handleOpenSyntheticPayroll = () => setIsSyntheticPayrollOpen(true);
    const handleOpenCashiersCheckApi = () => setIsCashiersCheckApiOpen(true);
    const handleOpenLightingTamper = () => setIsLightingTamperOpen(true);
    const handleOpenAlteredPayable = () => setIsAlteredPayableOpen(true);
    const handleOpenSignatureVerification = () => setIsSignatureVerificationOpen(true);
    const handleOpenDormancyScreener = () => setIsDormancyScreenerOpen(true);
    const handleOpenUploadModal = () => setIsUploadScanOpen(true);

    window.addEventListener('open-batch-queue', handleOpenBatch);
    window.addEventListener('open-upload-modal', handleOpenUploadModal);
    window.addEventListener('open-guilloche-magnifier', handleOpenMagnifier);
    window.addEventListener('open-kyc-extractor', handleOpenKyc);
    window.addEventListener('open-check-fraud-analyzer', handleOpenCheckFraud);
    window.addEventListener('open-atm-claim-reader', handleOpenAtmClaim);
    window.addEventListener('open-banker-voice-crm', handleOpenBankerVoice);
    window.addEventListener('open-paper-loan-digitizer', handleOpenPaperLoan);
    window.addEventListener('open-branch-security-audit', handleOpenBranchSecurity);
    window.addEventListener('open-vault-log-inspector', handleOpenVaultLog);
    window.addEventListener('open-marketing-signage-audit', handleOpenMarketingSignage);
    window.addEventListener('open-mismatched-amount-verifier', handleOpenMismatchedAmount);
    window.addEventListener('open-payee-alteration-inspector', handleOpenPayeeAlteration);
    window.addEventListener('open-check-kiting-analyzer', handleOpenCheckKiting);
    window.addEventListener('open-forged-endorsement-inspector', handleOpenForgedEndorsement);
    window.addEventListener('open-synthetic-stock-detector', handleOpenSyntheticStock);
    window.addEventListener('open-atm-image-quality-triage', handleOpenAtmImageQuality);
    window.addEventListener('open-blocked-routing-interceptor', handleOpenBlockedRouting);
    window.addEventListener('open-positive-pay-triager', handleOpenPositivePay);
    window.addEventListener('open-micr-integrity-inspector', handleOpenMicrIntegrity);
    window.addEventListener('open-chemical-wash-screener', handleOpenChemicalWash);
    window.addEventListener('open-out-of-state-issuer-agent', handleOpenOutOfStateIssuer);
    window.addEventListener('open-rdc-screen-capture-filter', handleOpenRdcScreenCapture);
    window.addEventListener('open-payee-endorsement-cross-checker', handleOpenPayeeEndorsementCrossCheck);
    window.addEventListener('open-fake-cashiers-check-validator', handleOpenFakeCashiersCheck);
    window.addEventListener('open-exif-metadata-auditor', handleOpenExifMetadata);
    window.addEventListener('open-payee-name-matching-agent', handleOpenPayeeNameMatching);
    window.addEventListener('open-stolen-blank-check-predictor', handleOpenStolenBlankCheckPredictor);
    window.addEventListener('open-check-watermark-vision-auditor', handleOpenCheckWatermark);
    window.addEventListener('open-rdc-geolocation-risk-engine', handleOpenRdcGeolocationRisk);
    window.addEventListener('open-check-date-verifier', handleOpenCheckDateVerifier);
    window.addEventListener('open-synthetic-payroll-verifier', handleOpenSyntheticPayroll);
    window.addEventListener('open-cashiers-check-api-inspector', handleOpenCashiersCheckApi);
    window.addEventListener('open-lighting-tamper-detector', handleOpenLightingTamper);
    window.addEventListener('open-altered-payable-line-screener', handleOpenAlteredPayable);
    window.addEventListener('open-signature-verification-agent', handleOpenSignatureVerification);
    window.addEventListener('open-dormancy-screener', handleOpenDormancyScreener);
    return () => {
      window.removeEventListener('open-batch-queue', handleOpenBatch);
      window.removeEventListener('open-upload-modal', handleOpenUploadModal);
      window.removeEventListener('open-guilloche-magnifier', handleOpenMagnifier);
      window.removeEventListener('open-kyc-extractor', handleOpenKyc);
      window.removeEventListener('open-check-fraud-analyzer', handleOpenCheckFraud);
      window.removeEventListener('open-atm-claim-reader', handleOpenAtmClaim);
      window.removeEventListener('open-banker-voice-crm', handleOpenBankerVoice);
      window.removeEventListener('open-paper-loan-digitizer', handleOpenPaperLoan);
      window.removeEventListener('open-branch-security-audit', handleOpenBranchSecurity);
      window.removeEventListener('open-vault-log-inspector', handleOpenVaultLog);
      window.removeEventListener('open-marketing-signage-audit', handleOpenMarketingSignage);
      window.removeEventListener('open-mismatched-amount-verifier', handleOpenMismatchedAmount);
      window.removeEventListener('open-payee-alteration-inspector', handleOpenPayeeAlteration);
      window.removeEventListener('open-check-kiting-analyzer', handleOpenCheckKiting);
      window.removeEventListener('open-forged-endorsement-inspector', handleOpenForgedEndorsement);
      window.removeEventListener('open-synthetic-stock-detector', handleOpenSyntheticStock);
      window.removeEventListener('open-atm-image-quality-triage', handleOpenAtmImageQuality);
      window.removeEventListener('open-blocked-routing-interceptor', handleOpenBlockedRouting);
      window.removeEventListener('open-positive-pay-triager', handleOpenPositivePay);
      window.removeEventListener('open-micr-integrity-inspector', handleOpenMicrIntegrity);
      window.removeEventListener('open-chemical-wash-screener', handleOpenChemicalWash);
      window.removeEventListener('open-out-of-state-issuer-agent', handleOpenOutOfStateIssuer);
      window.removeEventListener('open-rdc-screen-capture-filter', handleOpenRdcScreenCapture);
      window.removeEventListener('open-payee-endorsement-cross-checker', handleOpenPayeeEndorsementCrossCheck);
      window.removeEventListener('open-fake-cashiers-check-validator', handleOpenFakeCashiersCheck);
      window.removeEventListener('open-exif-metadata-auditor', handleOpenExifMetadata);
      window.removeEventListener('open-payee-name-matching-agent', handleOpenPayeeNameMatching);
      window.removeEventListener('open-stolen-blank-check-predictor', handleOpenStolenBlankCheckPredictor);
      window.removeEventListener('open-check-watermark-vision-auditor', handleOpenCheckWatermark);
      window.removeEventListener('open-rdc-geolocation-risk-engine', handleOpenRdcGeolocationRisk);
      window.removeEventListener('open-check-date-verifier', handleOpenCheckDateVerifier);
      window.removeEventListener('open-synthetic-payroll-verifier', handleOpenSyntheticPayroll);
      window.removeEventListener('open-cashiers-check-api-inspector', handleOpenCashiersCheckApi);
      window.removeEventListener('open-lighting-tamper-detector', handleOpenLightingTamper);
      window.removeEventListener('open-altered-payable-line-screener', handleOpenAlteredPayable);
      window.removeEventListener('open-signature-verification-agent', handleOpenSignatureVerification);
      window.removeEventListener('open-dormancy-screener', handleOpenDormancyScreener);
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
      {/* --- Main Application Shell --- */}
      {/* Top Navigation & Tool Header */}
      <Header
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        comparisonMode={comparisonMode}
        setComparisonMode={setComparisonMode}
        onOpenExport={() => setIsExportOpen(true)}
        onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        isRightSidebarOpen={isRightSidebarOpen}
        onSearch={handleSearchPrompt}
        isAiGenerating={isAiGenerating}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUploadScan={() => setIsUploadScanOpen(true)}
        onOpenHelpGuide={() => setIsHelpGuideOpen(true)}
      />

      {/* --- Core Workspace Area --- */}
      {/* Contains Left Sidebar (Navigation), Center (Main Canvas), Right Sidebar (Details) */}
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

        {/* --- Central Workspace / Active Tab Content --- */}
        {/* Renders the specific tool based on the `activeTab` state */}
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

          {activeTab === 'jsonvault' && (
            <JsonVaultTab
              themeMode={themeMode}
              templates={templates}
              onSelectTemplate={(tpl) => {
                setCurrentTemplate(tpl);
                setActiveTab('inspector');
              }}
            />
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

      {/* --- Modular Assessment & Inspection Modals --- */}
      {/* 
        Below are all the lazy-rendered or conditionally-rendered specific AI Vision / OCR modules.
        Keeping these as separate component files prevents App.tsx from becoming bloated.
      */}

      {/* Export Report Generation Modal */}
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

      {/* Driver's License KYC Extractor Modal */}
      <KycExtractorModal
        isOpen={isKycOpen}
        onClose={() => setIsKycOpen(false)}
        themeMode={themeMode}
      />

      {/* Check Fraud & Alteration Analyzer Modal */}
      <CheckFraudAnalyzerModal
        isOpen={isCheckFraudOpen}
        onClose={() => setIsCheckFraudOpen(false)}
        themeMode={themeMode}
      />

      {/* Thermal Receipt ATM Claim Reader Modal */}
      <AtmReceiptClaimModal
        isOpen={isAtmClaimOpen}
        onClose={() => setIsAtmClaimOpen(false)}
        themeMode={themeMode}
      />

      {/* Banker Voice Note to CRM Task Converter Modal */}
      <BankerVoiceCrmModal
        isOpen={isBankerVoiceOpen}
        onClose={() => setIsBankerVoiceOpen(false)}
        themeMode={themeMode}
      />

      {/* Paper Loan Application Digitizer Modal */}
      <PaperLoanDigitizerModal
        isOpen={isPaperLoanOpen}
        onClose={() => setIsPaperLoanOpen(false)}
        themeMode={themeMode}
      />

      {/* Branch Physical Security & Audit Scanner Modal */}
      <BranchSecurityAuditModal
        isOpen={isBranchSecurityOpen}
        onClose={() => setIsBranchSecurityOpen(false)}
        themeMode={themeMode}
      />

      {/* Handwritten Dual-Custody Vault Log Inspector Modal */}
      <VaultLogInspectorModal
        isOpen={isVaultLogOpen}
        onClose={() => setIsVaultLogOpen(false)}
        themeMode={themeMode}
      />

      {/* Retail Branch Marketing Signage Compliance Auditor Modal */}
      <MarketingSignageAuditModal
        isOpen={isMarketingSignageOpen}
        onClose={() => setIsMarketingSignageOpen(false)}
        themeMode={themeMode}
      />

      {/* Mismatched Amount Verifier (Vision) Modal */}
      <MismatchedAmountVerifierModal
        isOpen={isMismatchedAmountOpen}
        onClose={() => setIsMismatchedAmountOpen(false)}
        themeMode={themeMode}
      />

      {/* Payee Alteration Inspector Modal */}
      <PayeeAlterationInspectorModal
        isOpen={isPayeeAlterationOpen}
        onClose={() => setIsPayeeAlterationOpen(false)}
        themeMode={themeMode}
      />

      {/* Check Kiting Analyzer Modal */}
      <CheckKitingAnalyzerModal
        isOpen={isCheckKitingOpen}
        onClose={() => setIsCheckKitingOpen(false)}
        themeMode={themeMode}
      />

      {/* Forged Counter Signature Inspector Modal */}
      <ForgedEndorsementInspectorModal
        isOpen={isForgedEndorsementOpen}
        onClose={() => setIsForgedEndorsementOpen(false)}
        themeMode={themeMode}
      />

      {/* Synthetic Check Stock Counterfeit Detector Modal */}
      <SyntheticCheckStockDetectorModal
        isOpen={isSyntheticStockOpen}
        onClose={() => setIsSyntheticStockOpen(false)}
        themeMode={themeMode}
      />

      {/* ATM Check Image-Quality Triage Modal */}
      <AtmImageQualityTriageModal
        isOpen={isAtmImageQualityOpen}
        onClose={() => setIsAtmImageQualityOpen(false)}
        themeMode={themeMode}
      />

      {/* Unrecognized Account Routing Block Modal */}
      <BlockedRoutingInterceptorModal
        isOpen={isBlockedRoutingOpen}
        onClose={() => setIsBlockedRoutingOpen(false)}
        themeMode={themeMode}
      />

      {/* Commercial Positive Pay Triager Modal */}
      <PositivePayTriagerModal
        isOpen={isPositivePayOpen}
        onClose={() => setIsPositivePayOpen(false)}
        themeMode={themeMode}
      />

      {/* MICR Integrity Inspector Modal */}
      <MicrIntegrityInspectorModal
        isOpen={isMicrIntegrityOpen}
        onClose={() => setIsMicrIntegrityOpen(false)}
        themeMode={themeMode}
      />

      {/* Chemical Wash Screener Modal */}
      <ChemicalWashScreenerModal
        isOpen={isChemicalWashOpen}
        onClose={() => setIsChemicalWashOpen(false)}
        themeMode={themeMode}
      />

      {/* Out-of-State Issuer First-Check Agent Modal */}
      <OutOfStateIssuerAgentModal
        isOpen={isOutOfStateIssuerOpen}
        onClose={() => setIsOutOfStateIssuerOpen(false)}
        themeMode={themeMode}
      />

      {/* RDC Digital Screen-Capture Filter Modal */}
      <RdcScreenCaptureFilterModal
        isOpen={isRdcScreenCaptureOpen}
        onClose={() => setIsRdcScreenCaptureOpen(false)}
        themeMode={themeMode}
      />

      {/* Payee Endorsement & Signature Card Cross-Checker Modal */}
      <PayeeEndorsementCrossCheckerModal
        isOpen={isPayeeEndorsementCrossCheckOpen}
        onClose={() => setIsPayeeEndorsementCrossCheckOpen(false)}
        themeMode={themeMode}
      />

      {/* Fake Cashier's Check Validator Modal */}
      <FakeCashiersCheckValidatorModal
        isOpen={isFakeCashiersCheckOpen}
        onClose={() => setIsFakeCashiersCheckOpen(false)}
        themeMode={themeMode}
      />

      {/* EXIF Metadata Auditor Modal */}
      <ExifMetadataAuditorModal
        isOpen={isExifMetadataOpen}
        onClose={() => setIsExifMetadataOpen(false)}
        themeMode={themeMode}
      />

      {/* Payee Name Matching Agent Modal */}
      <PayeeNameMatchingAgentModal
        isOpen={isPayeeNameMatchingOpen}
        onClose={() => setIsPayeeNameMatchingOpen(false)}
        themeMode={themeMode}
      />

      {/* Stolen Blank Check Predictor Modal */}
      <StolenBlankCheckPredictorModal
        isOpen={isStolenBlankCheckPredictorOpen}
        onClose={() => setIsStolenBlankCheckPredictorOpen(false)}
        themeMode={themeMode}
      />

      {/* Check Watermark Vision Auditor Modal */}
      <CheckWatermarkVisionAuditorModal
        isOpen={isCheckWatermarkOpen}
        onClose={() => setIsCheckWatermarkOpen(false)}
        themeMode={themeMode}
      />

      {/* RDC Geolocation Risk Engine Modal */}
      <RdcGeolocationRiskEngineModal
        isOpen={isRdcGeolocationRiskOpen}
        onClose={() => setIsRdcGeolocationRiskOpen(false)}
        themeMode={themeMode}
      />

      {/* Post-Dated & Stale-Dated Check Verifier Modal */}
      <CheckDateVerifierModal
        isOpen={isCheckDateVerifierOpen}
        onClose={() => setIsCheckDateVerifierOpen(false)}
        themeMode={themeMode}
      />

      {/* Synthetic Payroll Batch Cross-Verifier Modal */}
      <SyntheticPayrollBatchVerifierModal
        isOpen={isSyntheticPayrollOpen}
        onClose={() => setIsSyntheticPayrollOpen(false)}
        themeMode={themeMode}
      />

      {/* Cashier's Check API Inspector Modal */}
      <CashiersCheckApiInspectorModal
        isOpen={isCashiersCheckApiOpen}
        onClose={() => setIsCashiersCheckApiOpen(false)}
        themeMode={themeMode}
      />

      {/* Lighting & Shadow Tamper Detector Modal */}
      <CheckLightingTamperDetectorModal
        isOpen={isLightingTamperOpen}
        onClose={() => setIsLightingTamperOpen(false)}
        themeMode={themeMode}
      />

      {/* Altered Payable Line Screener Modal */}
      <CheckAlteredPayableLineScreenerModal
        isOpen={isAlteredPayableOpen}
        onClose={() => setIsAlteredPayableOpen(false)}
        themeMode={themeMode}
      />

      {/* Third-Party Signature Verification Agent Modal */}
      <CheckSignatureVerificationModal
        isOpen={isSignatureVerificationOpen}
        onClose={() => setIsSignatureVerificationOpen(false)}
        themeMode={themeMode}
      />

      {/* Account Dormancy Activation Screener Modal */}
      <CheckDormancyActivationScreenerModal
        isOpen={isDormancyScreenerOpen}
        onClose={() => setIsDormancyScreenerOpen(false)}
        themeMode={themeMode}
      />
    </div>
  );
}

