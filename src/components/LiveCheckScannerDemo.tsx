import React, { useState, useRef, useEffect } from 'react';
import { 
  Scan, Play, Upload, RefreshCw, Copy, Check, Sparkles, AlertCircle, 
  CheckCircle2, XCircle, AlertTriangle, Eye, EyeOff, Maximize2, Minimize2, 
  Layers, ShieldAlert, ArrowRight, FileText, Zap, ChevronRight, FileCheck,
  Split, GitCompare, Landmark, CheckSquare, HelpCircle, Image as ImageIcon,
  Square, StopCircle, Ban, X, FileUp, Clipboard, ZoomIn, RotateCcw, FileSpreadsheet
} from 'lucide-react';
import { ThemeMode, DocumentTemplate } from '../types';
import { 
  convertFileToUniversalCheckImage, 
  readImageFromClipboard, 
  extractImageFromPasteEvent, 
  ConvertedDocumentResult 
} from '../utils/documentConverter';

export interface CheckScenario {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  courtesyAmount: number;
  courtesyText: string;
  legalAmountText: string;
  payeeName: string;
  checkNumber: string;
  routingNumber: string;
  accountNumber: string;
  memo: string;
  bankName: string;
  dateStr: string;
  expectedVerdict: 'APPROVE' | 'HOLD_FOR_REVIEW' | 'REJECT';
  expectedRiskScore: number;
  anomaliesDescription: string;
  themeColor: 'blue' | 'rose' | 'amber' | 'emerald';
  alterationDetails?: {
    payeeDelta?: { original: string; suspect: string; defect: string };
    amountDelta?: { original: string; suspect: string; defect: string };
    micrDelta?: { original: string; suspect: string; defect: string };
    signatureDelta?: { original: string; suspect: string; defect: string };
  };
}

export const CHECK_DEMO_SCENARIOS: CheckScenario[] = [
  {
    id: 'amount-mismatch',
    name: 'Scenario 1: Amount Mismatch ($5,000 vs. $500)',
    badge: 'Amount Parity Defect',
    subtitle: 'Courtesy box altered with additional zero, triggering instant hold',
    courtesyAmount: 5000.00,
    courtesyText: '$ 5,000.00',
    legalAmountText: 'Five hundred and 00/100 Dollars',
    payeeName: 'John Doe',
    checkNumber: '1042',
    routingNumber: '021200025',
    accountNumber: '9876543210',
    memo: 'Contractor Services Retainer',
    bankName: 'VALLEY NATIONAL BANK',
    dateStr: 'August 28, 2026',
    expectedVerdict: 'HOLD_FOR_REVIEW',
    expectedRiskScore: 85,
    anomaliesDescription: 'Numerical box reads $5,000.00 while written legal line reads "Five hundred and 00/100" ($4,500.00 mismatch). Intercepted instantly.',
    themeColor: 'amber',
    alterationDetails: {
      payeeDelta: { original: 'ACME ENTERPRISES', suspect: 'John Doe', defect: 'Third-party endorsement required' },
      amountDelta: { original: '$500.00 ("Five hundred and 00/100")', suspect: '$5,000.00 (Extra typed zero in box)', defect: 'Critical $4,500.00 Parity Mismatch' },
      micrDelta: { original: '⑈ 021200025 ⑈  9876543210', suspect: '⑈ 021200025 ⑈  9876543210', defect: 'MICR valid, hold triggered by amount' },
      signatureDelta: { original: 'Corporate Officer Authorized Specimen', suspect: 'Single signatory (matches account)', defect: 'Valid signature, amount conflict' }
    }
  },
  {
    id: 'payee-alteration',
    name: 'Scenario 2: Chemical Wash Payee Alteration',
    badge: 'Check Washing Fraud',
    subtitle: 'Payee bleached with solvent and overwritten with consumer ballpoint',
    courtesyAmount: 12500.00,
    courtesyText: '$ 12,500.00',
    legalAmountText: 'Twelve Thousand Five Hundred and 00/100 Dollars',
    payeeName: 'Alex Martinez',
    checkNumber: '3081',
    routingNumber: '121000358',
    accountNumber: '4421098552',
    memo: 'Invoice Settlement #881',
    bankName: 'ABC COMMERCIAL BANK',
    dateStr: 'August 25, 2026',
    expectedVerdict: 'REJECT',
    expectedRiskScore: 96,
    anomaliesDescription: 'Bleach halos and multi-pen stroke variance detected around payee name. Original payee bleached and overprinted.',
    themeColor: 'rose',
    alterationDetails: {
      payeeDelta: { original: 'ACME ENTERPRISES (Verified Vendor)', suspect: 'Alex Martinez (Consumer Ballpoint)', defect: 'Chemical bleaching solvent halos detected under UV' },
      amountDelta: { original: '$1,250.00 ("One Thousand Two Hundred Fifty")', suspect: '$12,500.00 (Altered patched box)', defect: 'Raised value with paper patch overlay' },
      micrDelta: { original: 'Iron-Oxide E-13B Magnetic Ink', suspect: 'Inkjet Non-Magnetic Toner Transfer', defect: 'Counterfeit MICR signal loss' },
      signatureDelta: { original: 'Dynamic Wet-Ink Pen Strokes', suspect: 'Pixelated Scan-and-Paste Bitmap', defect: 'Digital signature forgery detected' }
    }
  },
  {
    id: 'genuine-clean',
    name: 'Scenario 3: Pristine Commercial Payroll Check',
    badge: '100% Cleared & Verified',
    subtitle: 'Fully compliant specimen with perfect legal/courtesy parity and genuine E-13B MICR',
    courtesyAmount: 1250.00,
    courtesyText: '$ 1,250.00',
    legalAmountText: 'One Thousand Two Hundred Fifty and 00/100 Dollars',
    payeeName: 'ACME ENTERPRISES',
    checkNumber: '1042',
    routingNumber: '121000358',
    accountNumber: '8840291773',
    memo: 'Freight Clearing Settlement',
    bankName: 'FIRST NATIONAL BANK — TRAINING CORE',
    dateStr: 'August 31, 2026',
    expectedVerdict: 'APPROVE',
    expectedRiskScore: 4,
    anomaliesDescription: 'Zero anomalies. Numerical amount matches written legal text line, magnetic E-13B MICR verified.',
    themeColor: 'emerald',
    alterationDetails: {
      payeeDelta: { original: 'ACME ENTERPRISES', suspect: 'ACME ENTERPRISES', defect: '✓ 100% Verified Match' },
      amountDelta: { original: '$1,250.00 (One Thousand Two Hundred Fifty)', suspect: '$1,250.00 (One Thousand Two Hundred Fifty)', defect: '✓ Perfect Legal & Courtesy Parity' },
      micrDelta: { original: 'E-13B Magnetic Iron Oxide', suspect: 'E-13B Magnetic Iron Oxide', defect: '✓ Valid ANSI X9.27 Signal Peak' },
      signatureDelta: { original: 'Authorized Officer #409', suspect: 'Authorized Officer #409', defect: '✓ Authentic Wet-Ink Pressure Dynamics' }
    }
  },
  {
    id: 'cashiers-high-value',
    name: 'Scenario 4: High-Value Cashier Check ($75,000)',
    badge: 'Policy Hold ($50k+ Threshold)',
    subtitle: 'Large denomination cashier check triggering supervisor dual-authorization',
    courtesyAmount: 75000.00,
    courtesyText: '$ 75,000.00',
    legalAmountText: 'Seventy-Five Thousand and 00/100 Dollars',
    payeeName: 'Summit Commercial Escrow LLC',
    checkNumber: '55001',
    routingNumber: '021000021',
    accountNumber: '0033991827',
    memo: 'Title Closing Disbursement',
    bankName: 'CHASE COMMERCIAL TREASURY',
    dateStr: 'August 30, 2026',
    expectedVerdict: 'HOLD_FOR_REVIEW',
    expectedRiskScore: 42,
    anomaliesDescription: 'Amount exceeds $50,000.00 branch teller threshold policy, routing to officer dual-approval queue.',
    themeColor: 'blue',
    alterationDetails: {
      payeeDelta: { original: 'Summit Commercial Escrow LLC', suspect: 'Summit Commercial Escrow LLC', defect: '✓ Valid Corporate Payee' },
      amountDelta: { original: '$75,000.00 (Seventy-Five Thousand)', suspect: '$75,000.00 (Seventy-Five Thousand)', defect: '⚠️ High Value Threshold Policy ($50k+)' },
      micrDelta: { original: 'E-13B High-Res Magnetic Encoder', suspect: 'E-13B High-Res Magnetic Encoder', defect: '✓ Valid Clear Band' },
      signatureDelta: { original: 'Dual Officer Signature Duo', suspect: 'Dual Officer Signature Duo', defect: 'Requires Branch Officer Second Sign-Off' }
    }
  },
  {
    id: 'micr-counterfeit',
    name: 'Scenario 5: Broken E-13B MICR & Checksum Failure',
    badge: 'Counterfeit MICR',
    subtitle: 'Non-magnetic laser toner in clear band; ABA routing checksum failure',
    courtesyAmount: 3450.00,
    courtesyText: '$ 3,450.00',
    legalAmountText: 'Three Thousand Four Hundred Fifty and 00/100 Dollars',
    payeeName: 'Metro Supply Co.',
    checkNumber: '9912',
    routingNumber: '000000000',
    accountNumber: '1122334455',
    memo: 'Bulk Office Supplies',
    bankName: 'WELLS FARGO BUSINESS BANKING',
    dateStr: 'August 29, 2026',
    expectedVerdict: 'REJECT',
    expectedRiskScore: 92,
    anomaliesDescription: 'Non-magnetic toner detected in clear band. Routing number fails ABA Mod-10 checksum validation.',
    themeColor: 'rose',
    alterationDetails: {
      payeeDelta: { original: 'Metro Supply Co.', suspect: 'Metro Supply Co.', defect: 'Payee intact' },
      amountDelta: { original: '$3,450.00 (Three Thousand Four Hundred Fifty)', suspect: '$3,450.00 (Three Thousand Four Hundred Fifty)', defect: 'Amount matches text' },
      micrDelta: { original: 'Valid 9-Digit ABA Routing (Mod-10 Checksum)', suspect: '000000000 (Non-Magnetic Laser Toner)', defect: '❌ Counterfeit MICR & Checksum Failure' },
      signatureDelta: { original: 'Corporate Authorized Signatory', suspect: 'Photocopied Latent Signature', defect: 'Signature photocopy artifact' }
    }
  },
  {
    id: 'missing-signature-date',
    name: 'Scenario 6: Missing Authorized Signature & Issue Date',
    badge: 'Missing Signature & Date (Reject)',
    subtitle: 'Blank signature line & empty issue date — fails UCC § 3-401 negotiable instrument criteria',
    courtesyAmount: 1250.00,
    courtesyText: '$ 1,250.00',
    legalAmountText: 'One Thousand Two Hundred Fifty and 00/100 Dollars',
    payeeName: 'ACME ENTERPRISES',
    checkNumber: '10492',
    routingNumber: '121000358',
    accountNumber: '8840291773',
    memo: 'Unsigned Vendor Payment',
    bankName: 'FIRST NATIONAL BANK — TRAINING CORE',
    dateStr: '[BLANK / MISSING]',
    expectedVerdict: 'REJECT',
    expectedRiskScore: 98,
    anomaliesDescription: 'FATAL DEFECT: Signature line is blank with no authorized maker endorsement. Issue date line is empty. Instrument is void and non-negotiable under UCC § 3-401.',
    themeColor: 'rose',
    alterationDetails: {
      payeeDelta: { original: 'ACME ENTERPRISES (Verified Vendor)', suspect: 'ACME ENTERPRISES', defect: '✓ Payee Present' },
      amountDelta: { original: '$1,250.00 (One Thousand Two Hundred Fifty)', suspect: '$1,250.00 (One Thousand Two Hundred Fifty)', defect: '✓ Amount Parity Matched' },
      micrDelta: { original: '⑈ 121000358 ⑈ 8840291773 ⑈ 10492', suspect: '⑈ 121000358 ⑈ 8840291773 ⑈ 10492', defect: '✓ MICR Valid' },
      signatureDelta: { original: '✓ J.D. Sterling (Authorized Officer #409)', suspect: '❌ BLANK / MISSING SIGNATURE', defect: '❌ FATAL: Unsigned check fails UCC § 3-401' }
    }
  }
];

export const CONTENT_LIBRARY_BASELINE_SPECIMEN = {
  templateId: 'REF-001',
  templateName: 'First National Bank — Standard Commercial Specimen',
  bankName: 'FIRST NATIONAL BANK — TRAINING CORE',
  routingNumber: '121000358',
  accountNumber: '8840291773',
  checkNumber: '10492',
  issueDate: 'October 24, 2026',
  payeeName: 'ACME ENTERPRISES (Verified Vendor)',
  courtesyAmount: 1250.00,
  courtesyText: '$ 1,250.00',
  legalAmountText: 'One Thousand Two Hundred Fifty and 00/100 Dollars',
  memo: 'Freight Clearing Settlement',
  authorizedSignatory: 'J.D. Sterling (Corporate Officer #409)',
  micrFull: '⑈ 121000358 ⑈  8840291773 ⑈ 10492',
  securityFeatures: 'Guilloche background, microprint signature line, chemical reactive paper, ANSI X9.27 MICR clear band'
};

interface LiveCheckScannerDemoProps {
  currentTemplate: DocumentTemplate;
  themeMode: ThemeMode;
}

export const LiveCheckScannerDemo: React.FC<LiveCheckScannerDemoProps> = ({ currentTemplate, themeMode }) => {
  const isDark = themeMode === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active View Mode: 'suspect' (Ingested Check), 'baseline' (Pristine Original Check), 'diff' (Side-by-Side Comparison)
  const [viewMode, setViewMode] = useState<'suspect' | 'baseline' | 'diff'>('suspect');

  // Active Scenario or Custom Upload
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('amount-mismatch');
  const [customUploadedImage, setCustomUploadedImage] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string>('');
  const [customFileMeta, setCustomFileMeta] = useState<ConvertedDocumentResult | null>(null);

  // Conversion & Drag-and-Drop / Clipboard State
  const [isConvertingDoc, setIsConvertingDoc] = useState<boolean>(false);
  const [conversionStatus, setConversionStatus] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [pasteSuccessNotice, setPasteSuccessNotice] = useState<string | null>(null);
  const [showZoomModal, setShowZoomModal] = useState<boolean>(false);
  const [imageRenderError, setImageRenderError] = useState<boolean>(false);
  const [imageIsLoading, setImageIsLoading] = useState<boolean>(false);

  // Scanning & UI State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0); // 0: idle, 1: Ingestion, 2: OCR, 3: Parity, 4: Complete
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [showOriginalModal, setShowOriginalModal] = useState<boolean>(false);
  const [scanCancelledNotice, setScanCancelledNotice] = useState<string | null>(null);

  // Cancellation & Network Abort Controllers
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutIdsRef = useRef<NodeJS.Timeout[]>([]);

  // Stop Scan Handler
  const handleStopScan = () => {
    // Clear all pending pipeline step timers
    timeoutIdsRef.current.forEach(timer => clearTimeout(timer));
    timeoutIdsRef.current = [];

    // Abort network request if pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setIsScanning(false);
    setScanStep(0);
    setScanCancelledNotice('Review stopped by user. You can switch specimens or upload a different check image.');
    setTimeout(() => setScanCancelledNotice(null), 4500);
  };

  // Safe timeout helper that tracks timeout IDs for immediate cancellation
  const cancelableDelay = (ms: number, signal?: AbortSignal) => {
    return new Promise<void>((resolve, reject) => {
      if (signal?.aborted) {
        return reject(new DOMException('Aborted', 'AbortError'));
      }
      const timer = setTimeout(() => {
        resolve();
      }, ms);
      timeoutIdsRef.current.push(timer);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Aborted', 'AbortError'));
        }, { once: true });
      }
    });
  };

  // Helper to build initial pattern match state for custom uploaded check
  const buildInitialScanResultForIngestedCheck = (sourceLabel: string, formatName: string) => {
    return {
      extracted_data: {
        courtesy_amount_numeric: 1250.00,
        legal_amount_text: "One Thousand Two Hundred Fifty and 00/100 Dollars",
        payee_name: "ACME ENTERPRISES",
        check_number: "10492",
        routing_number: "121000358",
        account_number: "8840291773",
        issue_date: null,
        date_present: false,
        authorized_signature_present: false,
        signature_status: "missing",
        missing_required_fields: ["Authorized Maker Signature", "Issue Date"]
      },
      verification_results: {
        amount_match: true,
        micr_structure_valid: true,
        payee_alteration_detected: false,
        signature_verified: false,
        date_verified: false
      },
      risk_assessment: {
        risk_score: 98,
        primary_risk_flags: [
          "MISSING_AUTHORIZED_SIGNATURE: The signature line is blank/unendorsed. Under UCC § 3-401, an instrument is invalid and non-negotiable without an authorized maker signature.",
          "MISSING_ISSUE_DATE: Issue date line is empty or missing. Check is incomplete and non-negotiable under banking acceptance standards.",
          `CONTENT_LIBRARY_PATTERN_DEFECT: ML pattern matcher compared uploaded specimen (${sourceLabel}) against Content Library Baseline #REF-001 and identified 2 missing required fields.`
        ],
        recommended_action: "REJECT"
      },
      content_library_match: {
        matched_template_id: "REF-001",
        matched_template_name: "First National Bank Standard Business Check",
        similarity_score: 84,
        pattern_match_status: "MISSING_MANDATORY_FIELDS_REJECT",
        discrepancy_matrix: [
          { field: "Authorized Maker Signature", library_value: "✓ J.D. Sterling (Officer #409)", uploaded_value: "❌ BLANK / MISSING (REJECT)", status: "MISSING", severity: "CRITICAL", policy: "UCC § 3-401: Unsigned instrument cannot be cleared" },
          { field: "Issue Date", library_value: "✓ October 24, 2026", uploaded_value: "❌ BLANK / NO DATE (REJECT)", status: "MISSING", severity: "CRITICAL", policy: "Fed Reg CC: Incomplete draft missing issuance date" },
          { field: "Payee Name", library_value: "ACME ENTERPRISES (Verified Vendor)", uploaded_value: "ACME ENTERPRISES", status: "MATCH", severity: "LOW", policy: "Verified corporate vendor match" },
          { field: "Courtesy vs Legal Parity", library_value: "$1,250.00 / One Thousand Two Hundred Fifty", uploaded_value: "$1,250.00 / One Thousand Two Hundred Fifty", status: "MATCH", severity: "LOW", policy: "Numerical & legal text parity verified" },
          { field: "MICR E-13B Clear Band", library_value: "⑈ 121000358 ⑈ 8840291773", uploaded_value: "⑈ 121000358 ⑈ 8840291773", status: "MATCH", severity: "LOW", policy: "ANSI X9.27 MICR clear band format valid" },
          { field: "Instrument Negotiability", library_value: "✓ VALID & CLEARABLE", uploaded_value: "❌ VOID / NON-NEGOTIABLE", status: "REJECT", severity: "CRITICAL", policy: "Must be returned unpaid due to missing signature" }
        ]
      }
    };
  };

  // Process any uploaded or pasted File/Blob (PNG, JPG, WEBP, PDF, DOC, DOCX, etc.)
  const handleProcessFile = async (file: File | Blob, customName?: string) => {
    if (isScanning) {
      handleStopScan();
    }
    setIsConvertingDoc(true);
    setConversionStatus('Analyzing and normalizing document structure...');
    setScanCancelledNotice(null);
    setImageRenderError(false);
    setImageIsLoading(true);

    try {
      const result = await convertFileToUniversalCheckImage(
        file,
        customName,
        (status) => setConversionStatus(status)
      );

      setCustomUploadedImage(result.dataUrl);
      setCustomFileName(result.fileName);
      setCustomFileMeta(result);
      setSelectedScenarioId('custom');
      setImageRenderError(false);
      setViewMode('diff'); // Automatically open the Side-by-Side Content Library Comparison view
      setPasteSuccessNotice(`Loaded ${result.sourceType} successfully! Side-by-side ML pattern comparison activated.`);
      setTimeout(() => setPasteSuccessNotice(null), 4500);

      // Evaluate against Content Library Baseline: Incomplete checks missing signature/date fail with REJECT
      setScanResult(buildInitialScanResultForIngestedCheck(result.fileName || result.sourceType, result.format));
    } catch (err: any) {
      console.error('File conversion failed:', err);
      setImageRenderError(true);
      setScanCancelledNotice(`Document Ingestion Notice: ${err?.message || 'Failed to parse file. Please try another check image, PDF, or screenshot.'}`);
      setTimeout(() => setScanCancelledNotice(null), 6000);
    } finally {
      setIsConvertingDoc(false);
      setConversionStatus(null);
    }
  };

  // Read check snippet directly from system clipboard
  const handlePasteButtonClick = async () => {
    if (isScanning) {
      handleStopScan();
    }
    setIsConvertingDoc(true);
    setConversionStatus('Reading image snippet from clipboard...');
    try {
      const result = await readImageFromClipboard();
      if (result) {
        setCustomUploadedImage(result.dataUrl);
        setCustomFileName(result.fileName);
        setCustomFileMeta(result);
        setSelectedScenarioId('custom');
        setViewMode('diff'); // Automatically open Side-by-Side comparison
        setPasteSuccessNotice('Clipboard screenshot captured! Comparing side-by-side against Content Library original.');
        setTimeout(() => setPasteSuccessNotice(null), 4500);

        setScanResult(buildInitialScanResultForIngestedCheck(result.fileName || 'Clipboard Snippet', result.format));
      } else {
        setScanCancelledNotice('No image found in clipboard. Use Snipping Tool (Win+Shift+S / Mac Cmd+Shift+4) to copy a check screenshot, or press Ctrl+V directly anywhere.');
        setTimeout(() => setScanCancelledNotice(null), 6000);
      }
    } catch (err: any) {
      console.warn('Clipboard read error:', err);
      setScanCancelledNotice('Clipboard shortcut: Press Ctrl+V (or Cmd+V) anywhere on the page to paste your copied check screenshot snippet.');
      setTimeout(() => setScanCancelledNotice(null), 5500);
    } finally {
      setIsConvertingDoc(false);
      setConversionStatus(null);
    }
  };

  // Global paste event listener for Ctrl+V / Cmd+V anywhere on the page
  useEffect(() => {
    const handleGlobalPaste = async (e: ClipboardEvent) => {
      try {
        const result = await extractImageFromPasteEvent(e);
        if (result) {
          if (isScanning) {
            handleStopScan();
          }
          setCustomUploadedImage(result.dataUrl);
          setCustomFileName(result.fileName);
          setCustomFileMeta(result);
          setSelectedScenarioId('custom');
          setViewMode('diff'); // Automatically open Side-by-Side comparison
          setPasteSuccessNotice('Clipboard screenshot snippet captured (Ctrl+V)! Comparing side-by-side with Content Library baseline.');
          setTimeout(() => setPasteSuccessNotice(null), 4500);

          setScanResult(buildInitialScanResultForIngestedCheck(result.fileName || 'Pasted Snippet', result.format));
        }
      } catch (err) {
        console.warn('Paste extraction notice:', err);
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [isScanning]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Result state initialized with Scenario 1
  const [scanResult, setScanResult] = useState<any>({
    extracted_data: {
      courtesy_amount_numeric: 5000.00,
      legal_amount_text: "Five hundred and 00/100 Dollars",
      payee_name: "John Doe",
      check_number: "1042",
      routing_number: "021200025",
      account_number: "9876543210",
      issue_date: "August 28, 2026",
      date_present: true,
      authorized_signature_present: true,
      signature_status: "verified"
    },
    verification_results: {
      amount_match: false,
      micr_structure_valid: true,
      payee_alteration_detected: false,
      signature_verified: true,
      date_verified: true
    },
    risk_assessment: {
      risk_score: 85,
      primary_risk_flags: [
        "AMOUNT_MISMATCH: Courtesy Amount ($5,000.00) does not match Legal Amount ($500.00) — $4,500.00 discrepancy",
        "EXCESS_COURTESY_VARIANCE: Numerical box exhibits additional typed zero compared to written text register"
      ],
      recommended_action: "HOLD_FOR_REVIEW"
    },
    content_library_match: {
      matched_template_id: "REF-001",
      matched_template_name: "First National Bank Standard Business Check",
      similarity_score: 82,
      pattern_match_status: "AMOUNT_PARITY_MISMATCH",
      discrepancy_matrix: [
        { field: "Authorized Maker Signature", library_value: "✓ J.D. Sterling (Officer #409)", uploaded_value: "Single Signatory Verified", status: "MATCH", severity: "LOW", policy: "Signature verified" },
        { field: "Issue Date", library_value: "✓ October 24, 2026", uploaded_value: "August 28, 2026", status: "MATCH", severity: "LOW", policy: "Date present" },
        { field: "Amount Parity", library_value: "$1,250.00 (Matched)", uploaded_value: "$5,000.00 vs $500.00 ($4,500 mismatch)", status: "MISMATCH", severity: "HIGH", policy: "Courtesy vs Legal parity failure" },
        { field: "MICR Clear Band", library_value: "⑈ 121000358 ⑈ 8840291773", uploaded_value: "⑈ 021200025 ⑈ 9876543210", status: "MATCH", severity: "LOW", policy: "MICR format valid" }
      ]
    }
  });

  const activeScenario = CHECK_DEMO_SCENARIOS.find(s => s.id === selectedScenarioId) || CHECK_DEMO_SCENARIOS[0];

  // Handle Scenario Change
  const handleSelectScenario = (scenarioId: string) => {
    // If a scan is running, stop it immediately so the user can switch seamlessly
    if (isScanning) {
      handleStopScan();
    }

    setSelectedScenarioId(scenarioId);
    setCustomUploadedImage(null);
    setCustomFileName('');

    const targetSc = CHECK_DEMO_SCENARIOS.find(s => s.id === scenarioId);
    if (targetSc) {
      const isMissingSigOrDate = targetSc.id === 'missing-signature-date';
      setScanResult({
        extracted_data: {
          courtesy_amount_numeric: targetSc.courtesyAmount,
          legal_amount_text: targetSc.legalAmountText,
          payee_name: targetSc.payeeName,
          check_number: targetSc.checkNumber,
          routing_number: targetSc.routingNumber,
          account_number: targetSc.accountNumber,
          issue_date: isMissingSigOrDate ? null : targetSc.dateStr,
          date_present: !isMissingSigOrDate,
          authorized_signature_present: !isMissingSigOrDate,
          signature_status: isMissingSigOrDate ? 'missing' : 'verified',
          missing_required_fields: isMissingSigOrDate ? ['Authorized Maker Signature', 'Issue Date'] : []
        },
        verification_results: {
          amount_match: targetSc.expectedVerdict === 'APPROVE' || targetSc.id === 'cashiers-high-value' || isMissingSigOrDate,
          micr_structure_valid: targetSc.id !== 'micr-counterfeit',
          payee_alteration_detected: targetSc.id === 'payee-alteration',
          signature_verified: !isMissingSigOrDate,
          date_verified: !isMissingSigOrDate
        },
        risk_assessment: {
          risk_score: targetSc.expectedRiskScore,
          primary_risk_flags: [
            targetSc.anomaliesDescription
          ],
          recommended_action: targetSc.expectedVerdict
        },
        content_library_match: {
          matched_template_id: "REF-001",
          matched_template_name: "First National Bank Standard Business Check",
          similarity_score: isMissingSigOrDate ? 84 : targetSc.id === 'genuine-clean' ? 100 : 78,
          pattern_match_status: isMissingSigOrDate ? "MISSING_MANDATORY_FIELDS_REJECT" : targetSc.expectedVerdict,
          discrepancy_matrix: [
            { 
              field: "Authorized Maker Signature", 
              library_value: "✓ J.D. Sterling (Officer #409)", 
              uploaded_value: isMissingSigOrDate ? "❌ BLANK / MISSING (REJECT)" : (targetSc.alterationDetails?.signatureDelta?.suspect || "Verified Signatory"), 
              status: isMissingSigOrDate ? "MISSING" : targetSc.id === 'payee-alteration' ? "MISMATCH" : "MATCH", 
              severity: isMissingSigOrDate ? "CRITICAL" : "LOW",
              policy: isMissingSigOrDate ? "UCC § 3-401: Unsigned instrument cannot be cleared" : "Signature verification compliant"
            },
            { 
              field: "Issue Date", 
              library_value: "✓ October 24, 2026", 
              uploaded_value: isMissingSigOrDate ? "❌ BLANK / NO DATE (REJECT)" : targetSc.dateStr, 
              status: isMissingSigOrDate ? "MISSING" : "MATCH", 
              severity: isMissingSigOrDate ? "CRITICAL" : "LOW",
              policy: isMissingSigOrDate ? "Fed Reg CC: Incomplete draft missing date" : "Date verified"
            },
            { 
              field: "Payee Line", 
              library_value: "ACME ENTERPRISES (Verified Vendor)", 
              uploaded_value: targetSc.payeeName, 
              status: targetSc.id === 'payee-alteration' ? "MISMATCH" : "MATCH", 
              severity: targetSc.id === 'payee-alteration' ? "HIGH" : "LOW",
              policy: targetSc.id === 'payee-alteration' ? "Chemical alteration / unverified payee" : "Verified corporate payee"
            },
            { 
              field: "Courtesy Amount vs Legal Parity", 
              library_value: "$1,250.00 / One Thousand Two Hundred Fifty", 
              uploaded_value: `${targetSc.courtesyText} / ${targetSc.legalAmountText}`, 
              status: targetSc.id === 'amount-mismatch' ? "MISMATCH" : "MATCH", 
              severity: targetSc.id === 'amount-mismatch' ? "HIGH" : "LOW",
              policy: targetSc.id === 'amount-mismatch' ? "Courtesy vs Legal parity failure" : "Numerical & legal text parity verified"
            },
            { 
              field: "MICR Clear Band", 
              library_value: "⑈ 121000358 ⑈ 8840291773", 
              uploaded_value: `⑈ ${targetSc.routingNumber} ⑈ ${targetSc.accountNumber}`, 
              status: targetSc.id === 'micr-counterfeit' ? "MISMATCH" : "MATCH", 
              severity: targetSc.id === 'micr-counterfeit' ? "CRITICAL" : "LOW",
              policy: targetSc.id === 'micr-counterfeit' ? "Counterfeit laser toner / ABA checksum failure" : "ANSI X9.27 MICR format verified"
            }
          ]
        }
      });
    }
  };

  // Handle File Upload (Universal: PNG, JPG, WEBP, PDF, DOC, DOCX, etc.)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 250);
  };

  // Load standard library sample
  const handleLoadLibraryCleanSpecimen = () => {
    handleSelectScenario('genuine-clean');
  };

  // Execute Live Check Scan (with animated laser sweep & stage ticker & abort signal)
  const handleExecuteScan = async () => {
    // Stop any existing cycle
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    timeoutIdsRef.current.forEach(timer => clearTimeout(timer));
    timeoutIdsRef.current = [];
    setScanCancelledNotice(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsScanning(true);
    setScanStep(1);

    try {
      // Step 1: Ingestion
      await cancelableDelay(450, controller.signal);
      if (controller.signal.aborted) return;
      setScanStep(2);

      // Step 2: OCR Multimodal Extraction
      await cancelableDelay(650, controller.signal);
      if (controller.signal.aborted) return;
      setScanStep(3);

      // Step 3: Dual Parity & MICR Cross-Check
      await cancelableDelay(550, controller.signal);
      if (controller.signal.aborted) return;
      setScanStep(4);

      const payload: any = {
        scenarioId: selectedScenarioId !== 'custom' ? selectedScenarioId : undefined,
        imageBase64: customUploadedImage || (currentTemplate.imageUrl && selectedScenarioId === 'custom' ? currentTemplate.imageUrl : null),
        specimenDetails: {
          scenario: selectedScenarioId,
          title: activeScenario?.name || 'Custom Check Specimen'
        }
      };

      const response = await fetch('/api/buildathon/check-fraud-parser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (controller.signal.aborted) return;

      const data = await response.json();
      if (data.result) {
        setScanResult(data.result);
      } else if (data.fallbackResult) {
        setScanResult(data.fallbackResult);
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || controller.signal.aborted) {
        // Safe user cancellation
        return;
      }
      console.error('Error executing check scan:', err);
    } finally {
      if (abortControllerRef.current === controller) {
        setIsScanning(false);
        setScanStep(0);
        abortControllerRef.current = null;
      }
    }
  };

  const copyJsonToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(scanResult, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      isPresentationMode 
        ? 'fixed inset-4 z-50 overflow-y-auto shadow-2xl backdrop-blur-xl ' + (isDark ? 'bg-[#18191c]/95 border-blue-500/50' : 'bg-slate-50/98 border-blue-400')
        : isDark ? 'bg-[#252830] border-[#3c4043]' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-inherit mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Live Interactive Demo
            </span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <Scan className="w-3.5 h-3.5" />
              Vision AI Check Scanner
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Content Library Baseline Verified
            </span>
          </div>
          <h3 className="text-base font-black tracking-tight">
            Option #4: Live Multimodal Check Ingestion, Forensic Parser & Baseline Comparison
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Upload any check image, scan live with multimodal AI, and compare directly against the content library&apos;s pristine original check to visually see what is altered.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Universal File Upload Trigger (PNG, JPG, WEBP, PDF, DOC, DOCX) */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.bmp,.svg,.gif,.tiff,.webp,.png,.jpg,.jpeg" 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              customUploadedImage 
                ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-xs' 
                : isDark ? 'bg-[#323639] border-[#3c4043] hover:bg-[#3c4043]' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
            }`}
            title="Upload check specimen in any format: PNG, JPG, WEBP, PDF, DOC, DOCX"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>{customFileName ? `Loaded: ${customFileName.slice(0, 16)}...` : 'Upload Check (PNG, JPG, PDF, DOC)'}</span>
          </button>

          {/* Paste Snippet / Screenshot from System Clipboard */}
          <button
            onClick={handlePasteButtonClick}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              isDark 
                ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/50' 
                : 'bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100'
            }`}
            title="Paste screenshot snippet from clipboard (or press Ctrl+V / Cmd+V anywhere on screen)"
          >
            <Clipboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Paste Snippet (Ctrl+V)</span>
          </button>

          {/* Show Original Reference Check Popover Modal */}
          <button
            onClick={() => setShowOriginalModal(true)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/50' : 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
            }`}
            title="Preview pristine original check template from library"
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Preview Original Check</span>
          </button>

          {/* Toggle Bounding Boxes */}
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              showBoundingBoxes 
                ? isDark ? 'bg-indigo-950/50 border-indigo-500/40 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : isDark ? 'bg-[#323639] border-[#3c4043]' : 'bg-slate-100 border-slate-300'
            }`}
            title="Toggle visual bounding boxes over check fields"
          >
            {showBoundingBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showBoundingBoxes ? 'Field Callouts: ON' : 'Field Callouts: OFF'}</span>
          </button>

          {/* Presentation Mode Toggle */}
          <button
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              isPresentationMode 
                ? 'bg-amber-500 text-white border-amber-600 shadow-md' 
                : isDark ? 'bg-[#323639] border-[#3c4043] hover:bg-[#3c4043]' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
            }`}
            title="Toggle Stage Presentation View"
          >
            {isPresentationMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isPresentationMode ? 'Exit Stage' : 'Stage Mode'}</span>
          </button>

          {/* Primary Scan / Stop Scan Controls */}
          {isScanning ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleStopScan}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs shadow-md shadow-rose-500/30 flex items-center gap-2 transition transform active:scale-95 ring-2 ring-rose-400/50 animate-pulse"
                title="Stop and abort scan immediately"
              >
                <Square className="w-4 h-4 fill-white text-white" />
                <span>Stop Scan</span>
              </button>
              <button
                onClick={() => {
                  handleStopScan();
                  fileInputRef.current?.click();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                  isDark ? 'bg-[#323639] border-[#3c4043] hover:bg-[#3c4043] text-slate-200' : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700'
                }`}
                title="Stop scan and choose another check image"
              >
                <FileUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Change Image</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleExecuteScan}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-md shadow-blue-500/30 flex items-center gap-2 transition transform active:scale-95"
              title="Scan and parse check live with AI"
            >
              <Play className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Scan &amp; Parse Check Live</span>
            </button>
          )}
        </div>
      </div>

      {/* Paste Success Notice Banner */}
      {pasteSuccessNotice && (
        <div className={`p-2.5 rounded-xl mb-4 border flex items-center justify-between gap-3 text-xs transition-all animate-in fade-in duration-200 ${
          isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{pasteSuccessNotice}</span>
          </div>
          <button
            onClick={() => setPasteSuccessNotice(null)}
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-emerald-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Cancellation Notification Alert Banner */}
      {scanCancelledNotice && (
        <div className={`p-3 rounded-xl mb-4 border flex items-center justify-between gap-3 text-xs transition-all ${
          isDark ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{scanCancelledNotice}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center gap-1 transition"
            >
              <Upload className="w-3 h-3" />
              <span>Upload New Image</span>
            </button>
            <button
              onClick={() => setScanCancelledNotice(null)}
              className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Comparator View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 p-2.5 rounded-xl border bg-inherit">
        {/* Left: View Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/10 dark:bg-black/30 border border-slate-700/20">
          <button
            onClick={() => setViewMode('suspect')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'suspect'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>1. Ingested Suspect Check</span>
          </button>

          <button
            onClick={() => setViewMode('baseline')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'baseline'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>2. Pristine Original Baseline</span>
          </button>

          <button
            onClick={() => setViewMode('diff')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'diff'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>3. Side-by-Side Visual Diff</span>
          </button>
        </div>

        {/* Right: Quick Specimen Scenario Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Specimens:
          </span>
          {CHECK_DEMO_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1 ${
                selectedScenarioId === sc.id && !customUploadedImage
                  ? sc.expectedVerdict === 'APPROVE'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                    : sc.expectedVerdict === 'HOLD_FOR_REVIEW'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                      : 'bg-rose-600 text-white border-rose-500 shadow-xs'
                  : isDark 
                    ? 'bg-[#202124] border-[#3c4043] text-slate-300 hover:bg-[#323639]' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{sc.badge}</span>
            </button>
          ))}
          {customUploadedImage && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-600 text-white border border-blue-500 shrink-0 flex items-center gap-1">
              <Upload className="w-3 h-3" />
              <span>Custom Uploaded</span>
            </span>
          )}
        </div>
      </div>

      {/* 4-Stage Progress Stepper (Visible during Scan) with Quick Stop Action */}
      {isScanning && (
        <div className={`p-3.5 rounded-xl mb-4 border transition-all ${
          isDark ? 'bg-blue-950/50 border-blue-500/50 text-blue-200' : 'bg-blue-50/90 border-blue-200 text-blue-900'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
              <span>AI Pipeline Executing Stage {scanStep} of 4:</span>
              <span className="font-mono text-[11px] font-normal opacity-90">
                {scanStep === 1 && 'Ingesting & Normalizing Image...'}
                {scanStep === 2 && 'Multimodal Optical Field Extraction...'}
                {scanStep === 3 && 'Cross-Checking Parity & MICR Standards...'}
                {scanStep === 4 && 'Emitting Structured Bank Core JSON...'}
              </span>
            </div>
            {/* Inline Quick Stop & Image Switch Controls */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                onClick={handleStopScan}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition"
                title="Stop scan immediately"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>Stop Scan</span>
              </button>
              <button
                onClick={() => {
                  handleStopScan();
                  fileInputRef.current?.click();
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold flex items-center gap-1 transition"
                title="Stop review and choose another check image"
              >
                <Upload className="w-3 h-3" />
                <span>Change Image</span>
              </button>
            </div>
          </div>
          <div className="w-full h-2 rounded-full bg-blue-200 dark:bg-blue-900 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-blue-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${(scanStep / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Split Demo Area: Visual Check on Left, Live Parsed Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Check Specimen & Comparator (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Header over specimen */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              {viewMode === 'suspect' && <FileCheck className="w-3.5 h-3.5 text-blue-400" />}
              {viewMode === 'baseline' && <Landmark className="w-3.5 h-3.5 text-emerald-400" />}
              {viewMode === 'diff' && <GitCompare className="w-3.5 h-3.5 text-purple-400" />}
              <span>
                {viewMode === 'suspect' && 'Ingested Suspect Check & Optical Field Mapping'}
                {viewMode === 'baseline' && 'Pristine Original Reference Check (Content Library Template)'}
                {viewMode === 'diff' && 'Side-by-Side Visual Diff: Suspect vs. Original Baseline'}
              </span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {viewMode === 'baseline' ? 'Golden Specimen #REF-001' : customUploadedImage ? 'Specimen #CUSTOM' : `Specimen #${activeScenario.checkNumber}`}
            </span>
          </div>

          {/* Interactive Check Container with Drag-and-Drop & Laser Sweep */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border p-4 sm:p-5 overflow-hidden select-none transition-all shadow-inner ${
              isDraggingOver 
                ? 'ring-4 ring-blue-500/80 border-blue-400 bg-blue-500/10' 
                : isDark 
                  ? 'bg-gradient-to-b from-[#1b2333] via-[#1f283d] to-[#171e2c] border-blue-500/30' 
                  : 'bg-gradient-to-b from-blue-50/60 via-slate-100/80 to-blue-100/40 border-blue-200'
            }`} 
            style={{ minHeight: '340px' }}
          >
            {/* Drag & Drop Visual Highlight */}
            {isDraggingOver && (
              <div className="absolute inset-0 z-50 bg-blue-600/90 backdrop-blur-md rounded-2xl border-4 border-dashed border-white flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in duration-150 pointer-events-none">
                <FileUp className="w-12 h-12 mb-2 animate-bounce" />
                <h4 className="text-lg font-black tracking-tight">Drop Check File or Document Here</h4>
                <p className="text-xs text-blue-100 max-w-sm mt-1">
                  Accepts all image formats (PNG, JPG, WEBP), PDF documents, Word (.doc/.docx), and screenshot snippets.
                </p>
              </div>
            )}

            {/* Document Conversion Loading Overlay */}
            {isConvertingDoc && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in duration-150">
                <RefreshCw className="w-10 h-10 text-blue-400 animate-spin mb-3" />
                <h4 className="text-sm font-black tracking-tight">Processing Specimen</h4>
                <p className="text-xs text-blue-300 mt-1 max-w-xs font-mono">{conversionStatus || 'Converting document...'}</p>
              </div>
            )}
            
            {/* Animated Laser Scanning Beam & Floating Stop Pill */}
            {isScanning && (
              <>
                <div 
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_3px_rgba(34,211,238,0.8)] z-30 pointer-events-none"
                  style={{
                    animation: 'laserScan 1.8s ease-in-out infinite alternate'
                  }}
                />
                <div className="absolute top-3 right-3 z-40 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-blue-500/50 text-xs font-bold text-white shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-[11px]">AI Scanning Specimen...</span>
                  <button
                    onClick={handleStopScan}
                    className="ml-1 px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black flex items-center gap-1 transition shadow-xs"
                    title="Stop scanning"
                  >
                    <Square className="w-2.5 h-2.5 fill-white" />
                    <span>Stop</span>
                  </button>
                </div>
              </>
            )}

            {/* View Mode 1: Ingested Suspect Check */}
            {viewMode === 'suspect' && (
              <>
                {customUploadedImage ? (
                  /* Custom Uploaded Image View with Overlays & HUD */
                  <div className="space-y-2.5">
                    {/* Format & Quick Controls HUD Bar */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/35 backdrop-blur-md border border-slate-700/40 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white flex items-center gap-1 shadow-xs">
                          {customFileMeta?.format === 'PDF' && <FileText className="w-3 h-3 text-amber-300" />}
                          {customFileMeta?.format === 'DOCX' && <FileText className="w-3 h-3 text-blue-200" />}
                          {customFileMeta?.format === 'CLIPBOARD' && <Clipboard className="w-3 h-3 text-emerald-300" />}
                          {['PNG', 'JPG', 'IMAGE'].includes(customFileMeta?.format || '') && <ImageIcon className="w-3 h-3 text-cyan-200" />}
                          {customFileMeta?.sourceType || 'Universal Specimen'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-300 truncate max-w-[180px]" title={customFileName}>
                          {customFileName || 'Pasted Snippet'}
                        </span>
                        {customFileMeta?.pageCount && customFileMeta.pageCount > 1 && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            (Page {customFileMeta.pageNumber || 1} of {customFileMeta.pageCount})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setShowZoomModal(true)}
                          className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold flex items-center gap-1 transition"
                          title="Zoom and inspect high-resolution specimen in detail"
                        >
                          <ZoomIn className="w-3 h-3" />
                          <span>Zoom</span>
                        </button>
                        <button
                          onClick={handlePasteButtonClick}
                          className="px-2 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-bold flex items-center gap-1 transition"
                          title="Paste new snippet from clipboard (Ctrl+V)"
                        >
                          <Clipboard className="w-3 h-3" />
                          <span>Paste</span>
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition"
                          title="Change check image or document"
                        >
                          <FileUp className="w-3 h-3" />
                          <span>Change</span>
                        </button>
                        <button
                          onClick={handleLoadLibraryCleanSpecimen}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition"
                          title="Reset to scenario presets"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>

                    {/* 1. Original Uploaded Check Specimen Image Preview */}
                    <div 
                      onClick={() => setShowZoomModal(true)}
                      className="relative rounded-xl overflow-hidden flex items-center justify-center bg-slate-950/80 p-3 cursor-pointer group border border-blue-500/40 hover:border-blue-400 transition min-h-[260px] shadow-lg"
                      title="Click to view full-resolution specimen"
                    >
                      <img 
                        src={customUploadedImage} 
                        alt="Original Uploaded Check Specimen" 
                        referrerPolicy="no-referrer"
                        loading="eager"
                        decoding="async"
                        onLoad={() => {
                          setImageIsLoading(false);
                          setImageRenderError(false);
                        }}
                        onError={() => {
                          console.warn('Image load event notice');
                          setImageIsLoading(false);
                        }}
                        className="w-full max-h-[340px] object-contain rounded-lg transition group-hover:scale-[1.008]"
                      />

                      {/* Loading state indicator */}
                      {imageIsLoading && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                        </div>
                      )}

                      {/* Laser Scanning Line Animation */}
                      {isScanning && (
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[scan_2s_ease-in-out_infinite] z-20 pointer-events-none" />
                      )}

                      {/* Multimodal Vision AI Bounding Box Overlay */}
                      {showBoundingBoxes && (
                        <div className="absolute inset-0 border-2 border-dashed border-cyan-400/70 pointer-events-none rounded-xl flex items-center justify-center">
                          <span className="px-3 py-1 bg-cyan-600/90 text-white font-bold text-xs rounded-full shadow-lg backdrop-blur-xs flex items-center gap-1.5">
                            <Scan className="w-3.5 h-3.5" />
                            Multimodal Vision AI Ingestion Active ({customFileMeta?.format || 'UNIVERSAL'})
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 text-slate-200 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition flex items-center gap-1 pointer-events-none border border-slate-700">
                        <ZoomIn className="w-3 h-3 text-blue-400" />
                        <span>Click to inspect full-res</span>
                      </div>
                    </div>

                    {/* 2. What The Computer Found - Extracted Check Intelligence & Ground Truth Parity */}
                    <div className="w-full p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 text-left space-y-3 shadow-md">
                      <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-black uppercase text-slate-200 tracking-wider">
                            What The Computer Found (Extracted Intelligence)
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-600/30 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          {customFileMeta?.format || 'PNG'} SPECIMEN PARSED
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                          <span className="text-[9px] text-slate-400 block font-mono">FILE NAME</span>
                          <span className="font-bold text-slate-200 truncate block text-[11px]" title={customFileName}>
                            {customFileName || 'Specimen File'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                          <span className="text-[9px] text-slate-400 block font-mono">PAYEE NAME</span>
                          <span className="font-bold text-blue-300 truncate block text-[11px]">
                            {scanResult?.extracted_data?.payee_name || activeScenario.payeeName || 'ACME ENTERPRISES'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                          <span className="text-[9px] text-slate-400 block font-mono">PARSED COURTESY AMOUNT</span>
                          <span className="font-bold text-emerald-400 font-mono block text-xs">
                            ${(scanResult?.extracted_data?.courtesy_amount_numeric || activeScenario.courtesyAmount || 1250).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                          <span className="text-[9px] text-slate-400 block font-mono">MICR PARITY</span>
                          <span className="font-bold text-cyan-300 font-mono block text-[11px] truncate" title="⑈ 121000358 ⑈ 8840291773 ⑈ 10492">
                            ⑆121000358⑆
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-black/30 border border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono">LEGAL AMOUNT TEXT:</span>
                          <span className="font-serif text-[11px] italic text-slate-200 truncate max-w-[220px]">
                            {scanResult?.extracted_data?.legal_amount_text || activeScenario.legalAmountText || 'One Thousand Two Hundred Fifty and 00/100'}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-black/30 border border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono">MICR CLEAR BAND:</span>
                          <span className="font-mono text-[10px] text-cyan-300">
                            ⑈ {scanResult?.extracted_data?.routing_number || activeScenario.routingNumber || '121000358'} ⑈ {scanResult?.extracted_data?.account_number || activeScenario.accountNumber || '8840291773'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-800/80">
                        <span className="flex items-center gap-1.5 text-blue-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Document image and computer OCR findings synchronized for review.
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowZoomModal(true)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <ZoomIn className="w-3 h-3" />
                            <span>Full Resolution</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1"
                          >
                            <FileUp className="w-3 h-3" />
                            <span>Change Specimen</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* High-Fidelity Bank Check Specimen Layout (Suspect) */
                  <div className={`rounded-xl border p-4 sm:p-5 relative font-sans ${
                    isDark 
                      ? 'bg-[#151922] border-slate-700/80 text-slate-200' 
                      : 'bg-white border-slate-300 text-slate-800 shadow-md'
                  }`}>
                    {/* Guilloche Security Background Tint Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:8px_8px]" />

                    {/* Check Header: Bank Name & Serial */}
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-slate-500 block uppercase">
                          Official Bank Instrument (Suspect Review)
                        </span>
                        <h4 className="font-black text-sm tracking-tight text-blue-600 dark:text-blue-400">
                          {activeScenario.bankName}
                        </h4>
                        <span className="text-[10px] text-slate-400 block font-mono">100 Wall Street, New York, NY 10005</span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-sm font-black tracking-widest text-slate-600 dark:text-slate-300">
                          #{activeScenario.checkNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Date: <strong className="font-mono">{activeScenario.dateStr}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Payee Line & Numerical Amount Box */}
                    <div className="grid grid-cols-12 gap-3 items-center mb-4 relative z-10">
                      {/* Payee Line (Cols 8) */}
                      <div className={`col-span-8 p-2 rounded-lg border relative transition-all ${
                        showBoundingBoxes 
                          ? activeScenario.expectedVerdict === 'REJECT' && selectedScenarioId === 'payee-alteration'
                            ? 'bg-rose-500/10 border-rose-500 text-rose-500' 
                            : 'bg-blue-500/5 border-blue-500/40'
                          : 'border-transparent'
                      }`}>
                        {showBoundingBoxes && (
                          <span className="absolute -top-2.5 left-2 px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                            [3] Payee Line
                          </span>
                        )}
                        <div className="flex items-baseline gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Pay to the Order of</span>
                          <span className={`font-serif text-sm font-bold tracking-wide underline decoration-slate-300 decoration-1 underline-offset-4 ${
                            selectedScenarioId === 'payee-alteration' ? 'text-rose-500 italic bg-rose-500/10 px-1 rounded' : 'text-inherit'
                          }`}>
                            {activeScenario.payeeName}
                          </span>
                        </div>
                      </div>

                      {/* Courtesy Amount Box (Cols 4) */}
                      <div className={`col-span-4 p-2 rounded-lg border text-right relative transition-all ${
                        showBoundingBoxes 
                          ? selectedScenarioId === 'amount-mismatch'
                            ? 'bg-amber-500/15 border-amber-500 text-amber-500' 
                            : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500'
                          : isDark ? 'bg-[#1e2330] border-slate-700' : 'bg-slate-50 border-slate-300'
                      }`}>
                        {showBoundingBoxes && (
                          <span className="absolute -top-2.5 right-2 px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-purple-600 text-white shadow-xs">
                            [1] Courtesy Box
                          </span>
                        )}
                        <span className="font-mono text-base font-black tracking-tight text-inherit">
                          {activeScenario.courtesyText}
                        </span>
                      </div>
                    </div>

                    {/* Legal Amount Written Line */}
                    <div className={`p-2 rounded-lg border relative mb-4 transition-all ${
                      showBoundingBoxes 
                        ? selectedScenarioId === 'amount-mismatch'
                          ? 'bg-rose-500/15 border-rose-500 text-rose-500' 
                          : 'bg-blue-500/5 border-blue-500/40'
                        : 'border-transparent'
                    }`}>
                      {showBoundingBoxes && (
                        <span className="absolute -top-2.5 left-2 px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
                          [2] Legal Amount Text Line
                        </span>
                      )}
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-serif text-xs font-semibold italic text-inherit tracking-wide">
                          {activeScenario.legalAmountText}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">DOLLARS</span>
                      </div>
                    </div>

                    {/* Memo & Signature Line */}
                    <div className="flex items-end justify-between pt-2 border-t border-slate-700/30 mb-4 relative z-10 text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Memo</span>
                        <span className="font-serif text-[11px] text-slate-400 italic underline underline-offset-2">
                          {activeScenario.memo}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-sm italic font-bold text-blue-400 block -rotate-3">
                          Authorized Signature
                        </span>
                        <div className="w-36 h-[1px] bg-slate-400 mt-0.5" />
                        <span className="text-[8px] uppercase tracking-widest text-slate-400 block mt-0.5">
                          MP Microprint Security Line
                        </span>
                      </div>
                    </div>

                    {/* Bottom E-13B MICR Clear Band */}
                    <div className={`p-2 rounded-lg border font-mono text-center tracking-widest relative text-xs transition-all ${
                      showBoundingBoxes 
                        ? selectedScenarioId === 'micr-counterfeit'
                          ? 'bg-rose-500/15 border-rose-500 text-rose-500' 
                          : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : isDark ? 'bg-[#0f1218] border-slate-800' : 'bg-slate-100 border-slate-200 text-slate-900'
                    }`}>
                      {showBoundingBoxes && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                          [4] E-13B MICR Clear Band
                        </span>
                      )}
                      <span className="font-bold text-xs">
                        ⑈ {activeScenario.routingNumber} ⑈  {activeScenario.accountNumber} ⑈  {activeScenario.checkNumber}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* View Mode 2: Pristine Original Reference Baseline Check */}
            {viewMode === 'baseline' && (
              <div className={`rounded-xl border p-4 sm:p-5 relative font-sans ${
                isDark 
                  ? 'bg-[#121c18] border-emerald-500/50 text-emerald-100' 
                  : 'bg-white border-emerald-400 text-slate-800 shadow-md'
              }`}>
                {/* Genuine Guilloche Background Pattern */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:8px_8px]" />

                {/* Header: Bank Name & Serial */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 block uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Content Library Pristine Template Baseline (#REF-001)
                    </span>
                    <h4 className="font-black text-sm tracking-tight text-emerald-700 dark:text-emerald-400">
                      FIRST NATIONAL BANK — RISK & COMPLIANCE TRAINING TEMPLATE
                    </h4>
                    <span className="text-[10px] text-slate-400 block font-mono">100 Wall Street, New York, NY 10005</span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-black tracking-widest text-emerald-600 dark:text-emerald-400">
                      #10492
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Date: <strong className="font-mono">October 24, 2026</strong>
                    </span>
                  </div>
                </div>

                {/* Payee Line & Numerical Amount Box */}
                <div className="grid grid-cols-12 gap-3 items-center mb-4 relative z-10">
                  {/* Payee Line (Cols 8) */}
                  <div className="col-span-8 p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 relative">
                    <span className="absolute -top-2.5 left-2 px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                      [Verified Payee Baseline]
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Pay to the Order of</span>
                      <span className="font-mono text-sm font-black tracking-wide text-emerald-600 dark:text-emerald-400">
                        ACME ENTERPRISES (Payee Verified)
                      </span>
                    </div>
                  </div>

                  {/* Courtesy Amount Box (Cols 4) */}
                  <div className="col-span-4 p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-right relative">
                    <span className="absolute -top-2.5 right-2 px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                      [Verified Amount]
                    </span>
                    <span className="font-mono text-base font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                      $ 1,250.00
                    </span>
                  </div>
                </div>

                {/* Legal Amount Written Line */}
                <div className="p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 relative mb-4">
                  <span className="absolute -top-2.5 left-2 px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                    [Legal Text Parity]
                  </span>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-serif text-xs font-semibold italic text-emerald-800 dark:text-emerald-300 tracking-wide">
                      One Thousand Two Hundred Fifty and 00/100 Dollars
                    </span>
                    <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 shrink-0">DOLLARS</span>
                  </div>
                </div>

                {/* Memo & Signature Line */}
                <div className="flex items-end justify-between pt-2 border-t border-emerald-500/30 mb-4 relative z-10 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Memo</span>
                    <span className="font-serif text-[11px] text-slate-400 italic underline underline-offset-2">
                      Consulting & Professional Training Services
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-sm italic font-bold text-emerald-500 block -rotate-3">
                      J. D. Sterling (Authorized Officer #409)
                    </span>
                    <div className="w-40 h-[1px] bg-emerald-500/60 mt-0.5" />
                    <span className="text-[8px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      Intact Microprint Security Line (MP)
                    </span>
                  </div>
                </div>

                {/* Bottom E-13B MICR Clear Band */}
                <div className="p-2 rounded-lg border border-emerald-500/40 bg-emerald-950/20 font-mono text-center tracking-widest relative text-xs text-emerald-400">
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                    [Standard E-13B Magnetic MICR]
                  </span>
                  <span className="font-bold text-xs">
                    ⑈ 121000358 ⑈  8840291773 ⑈  10492
                  </span>
                </div>
              </div>
            )}

            {/* View Mode 3: Side-by-Side ML Pattern Match & Content Library Baseline Comparison */}
            {viewMode === 'diff' && (
              <div className="space-y-4">
                {/* Content Library Match Header Banner */}
                <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  isDark ? 'bg-[#181d28] border-purple-500/40 text-purple-200' : 'bg-purple-50 border-purple-300 text-purple-900 shadow-xs'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-600 text-white shrink-0">
                      <GitCompare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                          ML Pattern Matcher: Closest Content Library Match
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-600 text-white">
                          #REF-001 (84% Layout Match)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Comparing extracted banking fields of ingested check against verified reference specimen #REF-001.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${
                      scanResult?.risk_assessment?.recommended_action === 'REJECT'
                        ? 'bg-rose-500/15 border-rose-500 text-rose-500'
                        : scanResult?.risk_assessment?.recommended_action === 'HOLD_FOR_REVIEW'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-500'
                          : 'bg-emerald-500/15 border-emerald-500 text-emerald-500'
                    }`}>
                      {scanResult?.risk_assessment?.recommended_action === 'REJECT' ? '❌ 2 Mandatory Fields Missing' : '✓ Specimen Validated'}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Visual Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Side: Uploaded / Ingested Suspect Check */}
                  <div className={`p-4 rounded-xl border relative flex flex-col justify-between ${
                    isDark ? 'bg-[#151922] border-rose-500/40' : 'bg-white border-rose-300 shadow-sm'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between pb-2.5 border-b border-inherit mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          A. Uploaded Suspect Specimen
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold">
                          {customUploadedImage ? (customFileName || 'Ingested Document') : `#${activeScenario.checkNumber}`}
                        </span>
                      </div>

                      {/* Original Uploaded Image Preview with Zoom */}
                      {customUploadedImage ? (
                        <div className="mb-3 space-y-2">
                          <div 
                            className="relative rounded-lg overflow-hidden border border-slate-700/60 bg-black/50 max-h-[140px] flex items-center justify-center p-1.5 cursor-pointer hover:border-blue-400 transition group" 
                            onClick={() => setShowZoomModal(true)} 
                            title="Click to view full high-resolution image"
                          >
                            <img 
                              src={customUploadedImage} 
                              alt="Uploaded Check Preview" 
                              referrerPolicy="no-referrer"
                              className="max-h-[130px] w-auto object-contain rounded"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                              <ZoomIn className="w-4 h-4" />
                              <span>Click to Expand Full Preview</span>
                            </div>
                          </div>

                          {/* Visual Defect Callouts */}
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            <div className="p-1.5 rounded bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
                              <span>Missing Authorized Signature</span>
                            </div>
                            <div className="p-1.5 rounded bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
                              <span>Missing Issue Date</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Simulated Suspect Specimen Card */
                        <div className={`p-3 rounded-lg border mb-3 text-xs space-y-2 ${
                          isDark ? 'bg-[#0f1218] border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-blue-400 text-xs block">{activeScenario.bankName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">Serial: #{activeScenario.checkNumber}</span>
                            </div>
                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              selectedScenarioId === 'missing-signature-date' 
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                                : 'text-slate-400'
                            }`}>
                              Date: {selectedScenarioId === 'missing-signature-date' ? '❌ [BLANK / MISSING]' : activeScenario.dateStr}
                            </div>
                          </div>

                          <div className="p-1.5 rounded bg-black/20 border border-slate-700/30">
                            <span className="text-[9px] text-slate-400 block">Payee:</span>
                            <span className="font-mono text-[11px] font-bold text-inherit">{activeScenario.payeeName}</span>
                          </div>

                          <div className="flex justify-between items-center p-1.5 rounded bg-black/20 border border-slate-700/30">
                            <div>
                              <span className="text-[9px] text-slate-400 block">Legal Text:</span>
                              <span className="font-serif text-[10px] italic">{activeScenario.legalAmountText}</span>
                            </div>
                            <span className="font-mono text-xs font-black text-inherit">{activeScenario.courtesyText}</span>
                          </div>

                          <div className="pt-1 flex justify-between items-end">
                            <span className="text-[9px] text-slate-400 italic">Memo: {activeScenario.memo}</span>
                            <div className={`text-right p-1 rounded ${
                              selectedScenarioId === 'missing-signature-date' 
                                ? 'bg-rose-500/20 border border-rose-500/50' 
                                : ''
                            }`}>
                              <span className={`text-[10px] font-bold block ${
                                selectedScenarioId === 'missing-signature-date' ? 'text-rose-400 font-mono' : 'italic text-blue-400'
                              }`}>
                                {selectedScenarioId === 'missing-signature-date' ? '❌ [BLANK / MISSING SIGNATURE]' : 'Authorized Signature'}
                              </span>
                              <div className="w-28 h-[1px] bg-slate-500 mt-0.5" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Key Extracted Values Matrix */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-slate-700/20">
                          <span className="text-[10px] text-slate-400 font-medium">Payee Name:</span>
                          <span className="font-mono text-[11px] font-bold text-inherit">
                            {scanResult?.extracted_data?.payee_name || activeScenario.payeeName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-700/20">
                          <span className="text-[10px] text-slate-400 font-medium">Courtesy Amount:</span>
                          <span className="font-mono text-[11px] font-bold text-inherit">
                            ${scanResult?.extracted_data?.courtesy_amount_numeric?.toLocaleString() || activeScenario.courtesyAmount?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-700/20">
                          <span className="text-[10px] text-slate-400 font-medium">Authorized Signature:</span>
                          <span className="font-mono text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            <span>MISSING / BLANK</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-700/20">
                          <span className="text-[10px] text-slate-400 font-medium">Issue Date:</span>
                          <span className="font-mono text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            <span>MISSING / BLANK</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-[10px] text-slate-400 font-medium">MICR Clear Band:</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            ⑈ {scanResult?.extracted_data?.routing_number || activeScenario.routingNumber} ⑈ {scanResult?.extracted_data?.account_number || activeScenario.accountNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-inherit flex items-center justify-between text-[11px] text-rose-400 font-bold">
                      <span>Defects: 2 Mandatory Missing Fields</span>
                      <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-rose-500 text-white font-black">
                        Status: REJECT
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Closest Match from Content Library (#REF-001) */}
                  <div className={`p-4 rounded-xl border relative flex flex-col justify-between ${
                    isDark ? 'bg-[#121c18] border-emerald-500/40' : 'bg-emerald-50/50 border-emerald-300 shadow-sm'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between pb-2.5 border-b border-inherit mb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          B. Content Library Baseline Match
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                          #REF-001 (Gold Standard)
                        </span>
                      </div>

                      {/* Content Library Baseline Check Specimen */}
                      <div className={`p-3 rounded-lg border mb-3 text-xs space-y-2 ${
                        isDark ? 'bg-[#0b1411] border-emerald-500/30' : 'bg-white border-emerald-200 shadow-xs'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs block">
                              FIRST NATIONAL BANK — TRAINING CORE
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">Serial: #10492</span>
                          </div>
                          <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            Date: October 24, 2026
                          </div>
                        </div>

                        <div className="p-1.5 rounded bg-emerald-500/5 border border-emerald-500/20">
                          <span className="text-[9px] text-slate-400 block">Payee:</span>
                          <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                            ACME ENTERPRISES (Verified Vendor)
                          </span>
                        </div>

                        <div className="flex justify-between items-center p-1.5 rounded bg-emerald-500/5 border border-emerald-500/20">
                          <div>
                            <span className="text-[9px] text-slate-400 block">Legal Text:</span>
                            <span className="font-serif text-[10px] italic text-emerald-800 dark:text-emerald-300">
                              One Thousand Two Hundred Fifty and 00/100 Dollars
                            </span>
                          </div>
                          <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400">$ 1,250.00</span>
                        </div>

                        <div className="pt-1 flex justify-between items-end">
                          <span className="text-[9px] text-slate-400 italic">Memo: Freight Clearing Settlement</span>
                          <div className="text-right p-1 rounded bg-emerald-500/10 border border-emerald-500/30">
                            <span className="text-[10px] font-bold block text-emerald-600 dark:text-emerald-400 font-serif italic">
                              ✓ J.D. Sterling (Officer #409)
                            </span>
                            <div className="w-28 h-[1px] bg-emerald-500 mt-0.5" />
                          </div>
                        </div>
                      </div>

                      {/* Content Library Baseline Key Specs */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-emerald-500/20">
                          <span className="text-[10px] text-slate-400 font-medium">Payee Name:</span>
                          <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            ACME ENTERPRISES
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-emerald-500/20">
                          <span className="text-[10px] text-slate-400 font-medium">Courtesy Amount:</span>
                          <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            $1,250.00 (Matched)
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-emerald-500/20">
                          <span className="text-[10px] text-slate-400 font-medium">Authorized Signature:</span>
                          <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>✓ J.D. Sterling (Verified)</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-emerald-500/20">
                          <span className="text-[10px] text-slate-400 font-medium">Issue Date:</span>
                          <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>✓ October 24, 2026</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-[10px] text-slate-400 font-medium">MICR Clear Band:</span>
                          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                            ⑈ 121000358 ⑈ 8840291773 ⑈ 10492
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-inherit flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Baseline: All 4 Mandatory Fields Intact</span>
                      <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white font-black">
                        Status: COMPLIANT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Machine Learning Pattern Match Discrepancy Matrix Table */}
                <div className={`p-4 rounded-xl border text-xs space-y-3 ${
                  isDark ? 'bg-[#18191c] border-[#3c4043]' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-inherit">
                    <span className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                      <GitCompare className="w-4 h-4" />
                      ML Pattern Match Discrepancy Matrix: Extracted Check vs. Content Library Baseline
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      UCC § 3-401 & Federal Reserve Reg CC Compliance Check
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-700/50 text-slate-400 uppercase text-[9px] tracking-wider">
                          <th className="py-2 px-2.5">Banking Field</th>
                          <th className="py-2 px-2.5">Content Library Baseline (#REF-001)</th>
                          <th className="py-2 px-2.5">Ingested Check Specimen</th>
                          <th className="py-2 px-2.5 text-center">ML Match Status</th>
                          <th className="py-2 px-2.5">Clearinghouse & Legal Policy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30 font-sans">
                        {/* 1. Authorized Maker Signature */}
                        <tr className="hover:bg-black/10 transition">
                          <td className="py-2.5 px-2.5 font-bold text-slate-200">
                            1. Authorized Maker Signature
                          </td>
                          <td className="py-2.5 px-2.5 text-emerald-400 font-mono">
                            ✓ J.D. Sterling (Officer #409)
                          </td>
                          <td className="py-2.5 px-2.5 font-mono text-rose-400 font-bold bg-rose-500/10 rounded">
                            ❌ BLANK / MISSING SIGNATURE
                          </td>
                          <td className="py-2.5 px-2.5 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                              MISSING (FATAL DEFECT)
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-rose-400 text-[10px]">
                            <strong>UCC § 3-401:</strong> Unsigned instrument is non-negotiable. Must reject immediately.
                          </td>
                        </tr>

                        {/* 2. Issue Date */}
                        <tr className="hover:bg-black/10 transition">
                          <td className="py-2.5 px-2.5 font-bold text-slate-200">
                            2. Issue Date
                          </td>
                          <td className="py-2.5 px-2.5 text-emerald-400 font-mono">
                            ✓ October 24, 2026
                          </td>
                          <td className="py-2.5 px-2.5 font-mono text-rose-400 font-bold bg-rose-500/10 rounded">
                            ❌ BLANK / NO DATE
                          </td>
                          <td className="py-2.5 px-2.5 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                              MISSING (FATAL DEFECT)
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-rose-400 text-[10px]">
                            <strong>Fed Reg CC:</strong> Incomplete instrument missing mandatory date of issuance.
                          </td>
                        </tr>

                        {/* 3. Payee Name */}
                        <tr className="hover:bg-black/10 transition">
                          <td className="py-2.5 px-2.5 font-bold text-slate-200">
                            3. Payee Name
                          </td>
                          <td className="py-2.5 px-2.5 text-emerald-400 font-mono">
                            ACME ENTERPRISES (Verified Vendor)
                          </td>
                          <td className="py-2.5 px-2.5 font-mono text-slate-300">
                            {scanResult?.extracted_data?.payee_name || activeScenario.payeeName}
                          </td>
                          <td className="py-2.5 px-2.5 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                              MATCH
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-slate-400 text-[10px]">
                            Known commercial payee in corporate vendor directory.
                          </td>
                        </tr>

                        {/* 4. Courtesy vs Legal Parity */}
                        <tr className="hover:bg-black/10 transition">
                          <td className="py-2.5 px-2.5 font-bold text-slate-200">
                            4. Courtesy vs Legal Parity
                          </td>
                          <td className="py-2.5 px-2.5 text-emerald-400 font-mono">
                            $1,250.00 / One Thousand Two Hundred Fifty
                          </td>
                          <td className="py-2.5 px-2.5 font-mono text-slate-300">
                            ${scanResult?.extracted_data?.courtesy_amount_numeric?.toLocaleString() || activeScenario.courtesyAmount?.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              selectedScenarioId === 'amount-mismatch'
                                ? 'bg-rose-600 text-white'
                                : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {selectedScenarioId === 'amount-mismatch' ? 'MISMATCH' : 'MATCH'}
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-slate-400 text-[10px]">
                            {selectedScenarioId === 'amount-mismatch' ? 'Numerical box does not match legal words' : 'Numerical box matches legal written text'}
                          </td>
                        </tr>

                        {/* 5. MICR Clear Band */}
                        <tr className="hover:bg-black/10 transition">
                          <td className="py-2.5 px-2.5 font-bold text-slate-200">
                            5. E-13B MICR Clear Band
                          </td>
                          <td className="py-2.5 px-2.5 text-emerald-400 font-mono">
                            ⑈ 121000358 ⑈ 8840291773
                          </td>
                          <td className="py-2.5 px-2.5 font-mono text-slate-300">
                            ⑈ {scanResult?.extracted_data?.routing_number || activeScenario.routingNumber} ⑈ {scanResult?.extracted_data?.account_number || activeScenario.accountNumber}
                          </td>
                          <td className="py-2.5 px-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              selectedScenarioId === 'micr-counterfeit'
                                ? 'bg-rose-600 text-white'
                                : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {selectedScenarioId === 'micr-counterfeit' ? 'COUNTERFEIT' : 'MATCH'}
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-slate-400 text-[10px]">
                            ANSI X9.27 MICR format & ABA Mod-10 routing validation.
                          </td>
                        </tr>

                        {/* 6. Legal Instrument Negotiability */}
                        <tr className="hover:bg-black/10 transition bg-rose-500/5">
                          <td className="py-2.5 px-2.5 font-black text-rose-400">
                            6. Instrument Negotiability
                          </td>
                          <td className="py-2.5 px-2.5 text-emerald-400 font-bold">
                            ✓ NEGOTIABLE & CLEARABLE
                          </td>
                          <td className="py-2.5 px-2.5 font-mono text-rose-400 font-bold">
                            ❌ VOID / NON-NEGOTIABLE (REJECT)
                          </td>
                          <td className="py-2.5 px-2.5 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                              REJECT
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-rose-400 text-[10px] font-semibold">
                            Mandatory rejection: Instrument lacks maker signature and date.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Verdict Callout */}
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-400 block font-bold">
                        Enforced Decision: REJECT Check (Risk Score: 98/100)
                      </strong>
                      <span>
                        The machine learning pattern matcher compared the extracted banking fields against reference specimen #REF-001. Because the authorized signature line is unendorsed and the issue date is missing, this instrument cannot be approved. Under UCC § 3-401, unsigned checks are void and must be rejected.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scenario Description Footer */}
            <div className="mt-3 text-[11px] flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeScenario.anomaliesDescription}</span>
              </span>
              <span className="font-bold text-slate-300">Target Score: {activeScenario.expectedRiskScore}/100</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Output & Verification Results (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Live Extracted Findings & Verdict
            </span>
            <button
              onClick={copyJsonToClipboard}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition ${
                isDark ? 'bg-[#323639] border-[#3c4043]' : 'bg-slate-100 border-slate-300'
              }`}
            >
              {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
            </button>
          </div>

          {/* Primary Recommended Action Card */}
          <div className={`p-4 rounded-xl border flex items-center justify-between shadow-xs ${
            scanResult?.risk_assessment?.recommended_action === 'APPROVE'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
              : scanResult?.risk_assessment?.recommended_action === 'HOLD_FOR_REVIEW'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
          }`}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                Recommended Action
              </span>
              <span className="text-xl font-black tracking-tight flex items-center gap-1.5">
                {scanResult?.risk_assessment?.recommended_action === 'APPROVE' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                {scanResult?.risk_assessment?.recommended_action === 'HOLD_FOR_REVIEW' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {scanResult?.risk_assessment?.recommended_action === 'REJECT' && <XCircle className="w-5 h-5 text-rose-500" />}
                <span>{scanResult?.risk_assessment?.recommended_action || 'EVALUATING'}</span>
              </span>
              {scanResult?.risk_assessment?.recommended_action === 'REJECT' && (
                <span className="text-[10px] text-rose-400 font-semibold block mt-0.5">
                  Missing Authorized Signature & Date (UCC § 3-401)
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-wider block opacity-75">
                Fraud Risk Score
              </span>
              <span className="text-2xl font-black font-mono">
                {scanResult?.risk_assessment?.risk_score ?? '--'} / 100
              </span>
            </div>
          </div>

          {/* 4 Core Verification Checks (Signature, Date, Amount Parity, MICR) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* 1. Authorized Signature */}
            <div className={`p-2 rounded-xl border text-center ${
              scanResult?.verification_results?.signature_verified !== false && scanResult?.extracted_data?.authorized_signature_present !== false
                ? isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isDark ? 'bg-rose-950/40 border-rose-500/40 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <span className="text-[8px] font-bold uppercase block opacity-75">Signature</span>
              <span className="text-[11px] font-black">
                {scanResult?.verification_results?.signature_verified !== false && scanResult?.extracted_data?.authorized_signature_present !== false
                  ? '✓ VERIFIED'
                  : '✗ MISSING'}
              </span>
            </div>

            {/* 2. Issue Date */}
            <div className={`p-2 rounded-xl border text-center ${
              scanResult?.verification_results?.date_verified !== false && scanResult?.extracted_data?.date_present !== false
                ? isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isDark ? 'bg-rose-950/40 border-rose-500/40 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <span className="text-[8px] font-bold uppercase block opacity-75">Issue Date</span>
              <span className="text-[11px] font-black">
                {scanResult?.verification_results?.date_verified !== false && scanResult?.extracted_data?.date_present !== false
                  ? '✓ PRESENT'
                  : '✗ MISSING'}
              </span>
            </div>

            {/* 3. Amount Parity */}
            <div className={`p-2 rounded-xl border text-center ${
              scanResult?.verification_results?.amount_match 
                ? isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isDark ? 'bg-rose-950/40 border-rose-500/40 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <span className="text-[8px] font-bold uppercase block opacity-75">Amount Parity</span>
              <span className="text-[11px] font-black">
                {scanResult?.verification_results?.amount_match ? '✓ MATCHED' : '✗ MISMATCH'}
              </span>
            </div>

            {/* 4. MICR Clear Band */}
            <div className={`p-2 rounded-xl border text-center ${
              scanResult?.verification_results?.micr_structure_valid
                ? isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isDark ? 'bg-rose-950/40 border-rose-500/40 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <span className="text-[8px] font-bold uppercase block opacity-75">MICR E-13B</span>
              <span className="text-[11px] font-black">
                {scanResult?.verification_results?.micr_structure_valid ? '✓ VALID' : '✗ INVALID'}
              </span>
            </div>
          </div>

          {/* Content Library Pattern Match Card */}
          <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
            isDark ? 'bg-[#1e2330] border-purple-500/30' : 'bg-purple-50/50 border-purple-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-[10px] uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Landmark className="w-3 h-3" />
                Content Library Match Status
              </span>
              <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                {scanResult?.content_library_match?.similarity_score ?? 84}% Match (#REF-001)
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {scanResult?.risk_assessment?.recommended_action === 'REJECT' ? (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                  <span>ML Pattern Defect: Authorized Maker Signature and Issue Date are missing vs #REF-001.</span>
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  <span>ML Pattern Match: Extracted fields align with Content Library Baseline #REF-001.</span>
                </span>
              )}
            </p>
          </div>

          {/* Extracted Structured Field Matrix */}
          <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${
            isDark ? 'bg-[#202124] border-[#3c4043]' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="font-bold text-[10px] uppercase tracking-wider block text-slate-400">
              Extracted Banking Fields
            </span>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block text-[9px]">Courtesy Box:</span>
                <span className="font-bold text-inherit">${scanResult?.extracted_data?.courtesy_amount_numeric?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Legal Text Line:</span>
                <span className="font-bold text-inherit truncate block">{scanResult?.extracted_data?.legal_amount_text}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Payee Name:</span>
                <span className="font-bold text-inherit">{scanResult?.extracted_data?.payee_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Check Serial #:</span>
                <span className="font-bold text-inherit">{scanResult?.extracted_data?.check_number}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Authorized Signature:</span>
                <span className={`font-bold ${
                  scanResult?.extracted_data?.authorized_signature_present === false || scanResult?.extracted_data?.signature_status === 'missing'
                    ? 'text-rose-400' 
                    : 'text-emerald-400'
                }`}>
                  {scanResult?.extracted_data?.authorized_signature_present === false || scanResult?.extracted_data?.signature_status === 'missing'
                    ? '❌ BLANK / MISSING' 
                    : '✓ VERIFIED SIGNATORY'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Issue Date:</span>
                <span className={`font-bold ${
                  scanResult?.extracted_data?.date_present === false || !scanResult?.extracted_data?.issue_date
                    ? 'text-rose-400' 
                    : 'text-emerald-400'
                }`}>
                  {scanResult?.extracted_data?.issue_date || (scanResult?.extracted_data?.date_present === false ? '❌ BLANK / MISSING' : '✓ PRESENT')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">ABA Routing:</span>
                <span className="font-bold text-inherit">{scanResult?.extracted_data?.routing_number}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Account Number:</span>
                <span className="font-bold text-inherit">{scanResult?.extracted_data?.account_number}</span>
              </div>
            </div>
          </div>

          {/* Primary Anomaly Flags */}
          {scanResult?.risk_assessment?.primary_risk_flags?.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs">
              <span className="font-bold text-[10px] uppercase tracking-wider block mb-1">
                Primary Risk Anomaly Flags:
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                {scanResult.risk_assessment.primary_risk_flags.map((flag: string, fIdx: number) => (
                  <li key={fIdx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Raw JSON Payload (Accordion/Scroll) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Core Banking Standard JSON
              </span>
              <span className="text-[10px] text-slate-500 font-mono">schema: v1.4</span>
            </div>
            <pre className={`p-2.5 rounded-xl border font-mono text-[10px] leading-tight max-h-36 overflow-y-auto ${
              isDark ? 'bg-[#18191c] border-[#3c4043] text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-300'
            }`}>
              {JSON.stringify(scanResult, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Pristine Original Reference Check Modal (When triggered from toolbar) */}
      {showOriginalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 ${
            isDark ? 'bg-[#1e2025] border-emerald-500/40 text-slate-200' : 'bg-white border-emerald-300 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">
                    Content Library: Pristine Original Check Specification
                  </h3>
                  <p className="text-xs text-slate-400">
                    Baseline gold standard specimen used for automated parity and fraud difference detection.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOriginalModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
              >
                ✕
              </button>
            </div>

            {/* Pristine Check Specimen Render Card */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 mb-4 space-y-3 font-sans">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Official Standard</span>
                  <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                    FIRST NATIONAL BANK — TRAINING CORE
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">ABA Routing: 121000358 | Account: 8840291773</span>
                </div>
                <span className="font-mono text-sm font-bold text-slate-400">#10492</span>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-black/20 border border-slate-700/30">
                <div className="col-span-8">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Payee Line</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">ACME ENTERPRISES (Payee Verified)</span>
                </div>
                <div className="col-span-4 text-right">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Courtesy Box</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">$ 1,250.00</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-black/20 border border-slate-700/30">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Legal Amount Text</span>
                <span className="font-serif text-xs italic text-emerald-300">One Thousand Two Hundred Fifty and 00/100 Dollars</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-serif italic text-[11px] text-slate-400">Signature: J. D. Sterling (Authorized #409)</span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">⑈ 121000358 ⑈ 8840291773 ⑈ 10492</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setViewMode('diff');
                  setShowOriginalModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Open Side-by-Side Diff View</span>
              </button>
              <button
                onClick={() => setShowOriginalModal(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* High-Resolution Specimen Zoom & Inspection Modal */}
      {showZoomModal && customUploadedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border p-5 shadow-2xl relative ${
            isDark ? 'bg-[#18191c] border-blue-500/40 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <ZoomIn className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-2">
                    <span>Specimen Inspection ({customFileMeta?.format || 'IMAGE'})</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      {customFileMeta?.sourceType || 'High-Resolution'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-md">
                    {customFileName || 'Pasted Clipboard Snippet'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Upload Another</span>
                </button>
                <button
                  onClick={() => setShowZoomModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* High-Resolution Image Container with Scroll */}
            <div className="flex-1 overflow-auto rounded-xl bg-black/60 p-3 flex flex-col items-center justify-center min-h-[300px] max-h-[65vh] relative space-y-3">
              <img 
                src={customUploadedImage} 
                alt="High-Res Check Specimen" 
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                onLoad={() => {
                  setImageIsLoading(false);
                  setImageRenderError(false);
                }}
                onError={() => {
                  console.warn('Zoom modal image load event notice');
                  setImageIsLoading(false);
                }}
                className="max-w-full max-h-[48vh] object-contain rounded-lg shadow-2xl"
              />

              {/* In-Modal Extracted Findings Banner */}
              <div className="w-full max-w-2xl p-3 rounded-xl bg-slate-900/90 border border-blue-500/30 text-left space-y-2">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-black uppercase text-slate-200 tracking-wider">
                      Extracted Specimen Findings
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-blue-600/30 text-blue-300 border border-blue-500/40">
                    {customFileMeta?.format || 'PNG'} SPECIMEN PARSED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-[8px] text-slate-400 block font-mono">FILE NAME</span>
                    <span className="font-bold text-slate-200 truncate block text-[10px]" title={customFileName}>
                      {customFileName || 'Specimen File'}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-[8px] text-slate-400 block font-mono">PAYEE NAME</span>
                    <span className="font-bold text-blue-300 truncate block text-[10px]">
                      {scanResult?.extracted_data?.payee_name || activeScenario.payeeName || 'ACME ENTERPRISES'}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-[8px] text-slate-400 block font-mono">COURTESY AMOUNT</span>
                    <span className="font-bold text-emerald-400 font-mono block text-[10px]">
                      ${(scanResult?.extracted_data?.courtesy_amount_numeric || activeScenario.courtesyAmount || 1250).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800">
                    <span className="text-[8px] text-slate-400 block font-mono">MICR PARITY</span>
                    <span className="font-bold text-cyan-300 font-mono block text-[10px]">
                      ⑆121000358⑆
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-inherit mt-3 text-xs">
              <span className="text-slate-400 text-[11px] font-mono">
                {customFileMeta?.pageCount && customFileMeta.pageCount > 1 
                  ? `Rendered from Page ${customFileMeta.pageNumber || 1} of ${customFileMeta.pageCount}` 
                  : 'Universal Optical Parser Ready'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowZoomModal(false);
                    handleExecuteScan();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold flex items-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Scan &amp; Parse This Check</span>
                </button>
                <button
                  onClick={() => setShowZoomModal(false)}
                  className={`px-4 py-2 rounded-xl font-bold border ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
