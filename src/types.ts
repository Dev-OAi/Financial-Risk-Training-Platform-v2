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
export type AppTab = 'inspector' | 'standards' | 'sargenerator' | 'excel' | 'watchlist';


