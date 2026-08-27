/**
 * @file mockTemplates.ts
 * @description Provides initial document specimen templates and multi-bank check standards
 * for banker training and compliance cross-referencing.
 */

import { DocumentTemplate, BankStandard } from '../types';

/** Dictionary of supported bank standards for multi-bank check comparison training */
export const BANK_STANDARDS: Record<string, BankStandard> = {
  abcBank: {
    id: 'abc-bank',
    bankName: 'ABC Bank (Standard Commercial)',
    routingPrefix: '121000358',
    micrFontSpec: 'E-13B Iron-Oxide Magnetic Ink',
    borderSecurityType: 'Multi-tone guilloche with micro-line ABC security text',
    endorsementRule: 'Restrictive endorsement required for deposits over $5,000',
    trainingTip: 'Verify E-13B magnetic signal strength and inspect guilloche border for continuous ribbon integrity.'
  },
  chaseComm: {
    id: 'chase-comm',
    bankName: 'Chase Commercial Treasury',
    routingPrefix: '021000021',
    micrFontSpec: 'E-13B OCR-A Precision Magnetic',
    borderSecurityType: 'Intaglio engraved border with latent image block',
    endorsementRule: 'Corporate resolution on file required for third-party payee transfers',
    trainingTip: 'Inspect right margin for standard void pantograph activation and verify routing prefix 021.'
  },
  bofaCorp: {
    id: 'bofa-corp',
    bankName: 'Bank of America Corporate Trust',
    routingPrefix: '026009593',
    micrFontSpec: 'E-13B High-Res Magnetic Encoder',
    borderSecurityType: 'Prismatic multi-color rainbow background tint',
    endorsementRule: 'Dual signature required for disbursements exceeding $25,000',
    trainingTip: 'Check rainbow color blending transition; consumer inkjet prints cannot reproduce multi-pass prismatic tinting.'
  },
  wellsFargo: {
    id: 'wells-fargo',
    bankName: 'Wells Fargo Business Banking',
    routingPrefix: '121000248',
    micrFontSpec: 'E-13B Standard Iron-Oxide',
    borderSecurityType: 'Stagecoach security watermark and chemical stain-reactive paper',
    endorsementRule: 'Positive pay verification required before teller window cash-out',
    trainingTip: 'Hold check to ultraviolet light to inspect fluorescent security fibers embedded in pulp.'
  },
  citiGlobal: {
    id: 'citi-global',
    bankName: 'Citibank Global Markets Corp',
    routingPrefix: '021000089',
    micrFontSpec: 'E-13B Laser-Encoded Magnetic',
    borderSecurityType: 'Micro-printed border reading CITI GLOBAL COMPLIANCE',
    endorsementRule: 'Electronic verification match mandatory for international wire settlement checks',
    trainingTip: 'Examine 4pt microprint with 10x loupe; blurry characters indicate digital photocopying.'
  }
};

export const INITIAL_TEMPLATES: Record<string, DocumentTemplate> = {
  genuineCheck: {
    id: 'genuine-check',
    title: 'Standard Business Check (Genuine Sample)',
    subtitle: 'ABC BANK - COMPLIANT VERIFIED & CLEARED',
    type: 'check',
    theme: 'blue',
    isFraudulent: false,
    riskScore: 4,
    confidence: 99.8,
    summary: 'Verified authentic commercial instrument. E-13B MICR magnetic ink signal peak within ANSI specifications, multi-tone guilloche background security fibers intact.',
    hotspots: [
      {
        id: 'h1',
        title: 'Payee Line',
        x: 34,
        y: 44,
        riskLevel: 'low',
        titleDescription: 'Payee Endorsement & Latent Fiber Check',
        detail: 'Clear latent paper fibers under UV light. Name typed with thermal imprint ribbon matching account register.'
      },
      {
        id: 'h2',
        title: 'Numerical Amount Box',
        x: 76,
        y: 42,
        riskLevel: 'low',
        titleDescription: 'Numeric & Written Amount Match',
        detail: 'Numerical amount ($1,250.00) precisely matches written legal text line ("One Thousand Two Hundred Fifty and 00/100 Dollars").'
      },
      {
        id: 'h3',
        title: 'MICR Clearing Line',
        x: 22,
        y: 82,
        riskLevel: 'low',
        titleDescription: 'E-13B Magnetic Ink Character Verification',
        detail: 'Valid transit routing number and checking account sequence printed with iron oxide magnetic ink conforming to ISO 1004.'
      },
      {
        id: 'h4',
        title: 'Authorized Signature',
        x: 65,
        y: 68,
        riskLevel: 'low',
        titleDescription: 'Wet-Ink Signature Analysis',
        detail: 'Dynamic pen pressure variance confirms natural human stroke rhythm matching authorized corporate officer specimen #409.'
      },
      {
        id: 'h5',
        title: 'Logo & Security Border',
        x: 18,
        y: 20,
        riskLevel: 'low',
        titleDescription: 'Microprinting & Watermark Check',
        detail: 'Micro-line security border reads "ABC BANK RISK TRAINING" repeatedly at 4pt magnification.'
      }
    ]
  },
  fraudulentCheck: {
    id: 'fraudulent-check',
    title: 'Altered Payee & Amount Check (Fraudulent Sample)',
    subtitle: 'ALERT: POTENTIAL CHECK WASHING & FORGERY DETECTED',
    type: 'check',
    theme: 'rose',
    isFraudulent: true,
    riskScore: 96,
    confidence: 98.4,
    summary: 'High fraud probability detected: Chemical wash residue on payee line, altered numerical amount box, and non-magnetic inkjet MICR characters.',
    hotspots: [
      {
        id: 'h1',
        title: 'Payee Line (Altered)',
        x: 35,
        y: 44,
        riskLevel: 'critical',
        titleDescription: 'Chemical Washing & Substitution Evidence',
        detail: 'CRITICAL ANOMALY: Acetone / chlorine wash residue detected. Original payee name bleached and re-printed with consumer bubble-jet printer.'
      },
      {
        id: 'h2',
        title: 'Numerical Amount Box',
        x: 76,
        y: 42,
        riskLevel: 'critical',
        titleDescription: 'Amount Discrepancy & Patching',
        detail: 'CRITICAL: Numerical amount box ($12,500.00) shows physical paper patch overlay. Written legal line reads "$250.00" creating a $12,250 discrepancy.'
      },
      {
        id: 'h3',
        title: 'MICR Clearing Line',
        x: 22,
        y: 82,
        riskLevel: 'high',
        titleDescription: 'Counterfeit MICR Toner Transfer',
        detail: 'HIGH RISK: MICR line reflects normal carbon toner rather than iron-oxide E-13B magnetic ink. High-speed check sorter optical reader rejection likely.'
      },
      {
        id: 'h4',
        title: 'Authorized Signature',
        x: 65,
        y: 68,
        riskLevel: 'high',
        titleDescription: 'Signature Forgery / Stamping',
        detail: 'Uniform pixelation under 10x magnification indicates digital scan-and-paste forgery rather than authentic wet-ink signature.'
      },
      {
        id: 'h5',
        title: 'Background Security Void',
        x: 18,
        y: 20,
        riskLevel: 'medium',
        titleDescription: 'Pantograph Security Test',
        detail: 'Warning: Hidden "VOID" pantograph pattern fails to activate upon color photocopy replication, indicating low-grade stock.'
      }
    ]
  },
  commercialInvoice: {
    id: 'commercial-invoice',
    title: 'Commercial Supply Invoice (Compliance Review)',
    subtitle: 'GLOBAL LOGISTICS & PROCUREMENT RISK TEMPLATE',
    type: 'invoice',
    theme: 'slate',
    isFraudulent: false,
    riskScore: 18,
    confidence: 95.0,
    summary: 'Standard corporate procurement invoice. Tax ID format valid, bank wire remittance instructions match pre-registered vendor KYC profile.',
    hotspots: [
      {
        id: 'inv-1',
        title: 'Vendor Header & Tax ID',
        x: 20,
        y: 22,
        riskLevel: 'low',
        titleDescription: 'EIN & Entity Verification',
        detail: 'Employer Identification Number matches state corporate registry filings with active tax-exempt status.'
      },
      {
        id: 'inv-2',
        title: 'Remittance Bank Routing',
        x: 60,
        y: 75,
        riskLevel: 'low',
        titleDescription: 'Wire Instructions & Beneficiary Match',
        detail: 'Beneficiary account name matches corporate beneficiary registered in 2025 vendor KYC audit.'
      },
      {
        id: 'inv-3',
        title: 'Line Item Total Calculation',
        x: 75,
        y: 55,
        riskLevel: 'low',
        titleDescription: 'Subtotal & Tax Computation',
        detail: 'Mathematically verified unit prices multiplied by quantities with accurate state sales tax computation.'
      }
    ]
  },
  cashiersCheck: {
    id: 'cashiers-check',
    title: 'Cashier\'s Check (High-Value Verification)',
    subtitle: 'OFFICIAL BANK CHECK SECURITY AUDIT',
    type: 'check',
    theme: 'amber',
    isFraudulent: false,
    riskScore: 12,
    confidence: 99.1,
    summary: 'Official bank obligation check. Watermarked paper stock with metallic foil seal and dual-signature endorsement requirement.',
    hotspots: [
      {
        id: 'cc-1',
        title: 'Metallic Foil Hologram',
        x: 82,
        y: 18,
        riskLevel: 'low',
        titleDescription: 'Optically Variable Device (OVD)',
        detail: 'Reflective security hologram shifts from copper to green under angled illumination.'
      },
      {
        id: 'cc-2',
        title: 'Bank Officer Signature Duo',
        x: 62,
        y: 70,
        riskLevel: 'low',
        titleDescription: 'Dual Authorization Check',
        detail: 'Requires two authorized officer signatures for instruments exceeding $50,000 threshold.'
      },
      {
        id: 'cc-3',
        title: 'Perforated Edge',
        x: 95,
        y: 50,
        riskLevel: 'low',
        titleDescription: 'Continuous Form Edge Verification',
        detail: 'Original security paper cut with precision micro-perforation on right margin.'
      }
    ]
  }
};

