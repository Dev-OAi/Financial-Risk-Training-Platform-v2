/**
 * @file types.ts
 * @description Global TypeScript interfaces and type definitions for the
 * Professional Check Fraud Detection & Regulatory Training Platform.
 */

/** Represents an interactive inspection hot-spot on a financial document */
export interface HotSpot {
  id: string;
  title: string;
  x: number; // percentage coordinate 0-100 on canvas X-axis
  y: number; // percentage coordinate 0-100 on canvas Y-axis
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  titleDescription: string;
  detail: string;
}

/** Represents a field extracted during OCR cross-reference */
export interface ExtractedField {
  field: string;
  ocrValue: string;
  referenceValue: string;
  status: 'match' | 'mismatch' | 'flagged';
}

/** Represents a stage in the 12-point forensic audit */
export interface AuditStage {
  id: string;
  name: string;
  field: string;
  metric: string;
  status: 'verified' | 'flagged' | 'warning';
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

/** Represents a financial document specimen template for training */
export interface DocumentTemplate {
  id: string;
  title: string;
  subtitle: string;
  type: 'check' | 'invoice' | 'wire' | 'compliance';
  theme: string;
  imageUrl?: string;
  isFraudulent: boolean;
  riskScore: number;
  confidence: number;
  summary: string;
  hotspots: HotSpot[];
  extractedFields?: ExtractedField[];
  auditStages?: AuditStage[];
}

/** Represents a specific bank's check formatting and compliance standard */
export interface BankStandard {
  id: string;
  bankName: string;
  routingPrefix: string;
  micrFontSpec: string;
  borderSecurityType: string;
  endorsementRule: string;
  trainingTip: string;
  inkCharacteristics: string;
  paperStock: string;
  checksumRule: string;
  // Modular validation rules and check code for each requirement
  micrCheckCode?: string;
  borderCheckCode?: string;
  inkCheckCode?: string;
  paperCheckCode?: string;
  endorsementCheckCode?: string;
  sampleImageUrl?: string;
}

/** Real-time routing number validation result */
export interface RoutingVerificationResult {
  routingNumber: string;
  isValid: boolean;
  bankName: string;
  federalReserveDistrict: string;
  location: string;
  institutionType: string;
  checksumCalculation: string;
}

/** Multi-investigator case note */
export interface CaseNote {
  id: string;
  timestamp: string;
  author: string;
  investigatorRole: string;
  riskSeverity: 'info' | 'warning' | 'critical';
  documentTitle: string;
  noteText: string;
  bookmarkedHotspotId?: string;
}

/** Application theme mode */
export type ThemeMode = 'light' | 'dark';

/** Document viewing mode */
export type ComparisonMode = 'single' | 'compare';

/** Main navigation tabs */
export type AppTab = 'inspector' | 'buildathon' | 'standards' | 'sargenerator' | 'excel' | 'watchlist' | 'jsonvault';

/** Build-a-Thon Candidate Specification */
export interface BuildathonCandidate {
  id: number;
  title: string;
  department: string;
  solutionType: string;
  whatItDoes: string;
  whyItWins: string;
  pillarScores: {
    businessValue: number; // Max 25
    reusability: number;   // Max 25
    solutionDesign: number; // Max 25
    outputQuality: number; // Max 25
  };
  keyMetrics: string[];
  defaultInput: Record<string, any>;
  sampleOutput: Record<string, any>;
  promptTemplate: string;
}

/** Check Fraud Parser Submission Result Schema */
export interface CheckFraudParserResult {
  extracted_data: {
    courtesy_amount_numeric: number;
    legal_amount_text: string;
    payee_name: string;
    check_number: string;
    routing_number: string;
    account_number: string;
  };
  verification_results: {
    amount_match: boolean;
    micr_structure_valid: boolean;
    payee_alteration_detected: boolean;
  };
  risk_assessment: {
    risk_score: number;
    primary_risk_flags: string[];
    recommended_action: 'APPROVE' | 'HOLD_FOR_REVIEW' | 'REJECT';
  };
}


