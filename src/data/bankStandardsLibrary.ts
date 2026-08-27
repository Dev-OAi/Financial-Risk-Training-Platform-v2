/**
 * @file bankStandardsLibrary.ts
 * @description Comprehensive database of bank check security specifications, ink rules, E-13B MICR standards,
 * and real-time ABA routing number verification logic.
 */

import { BankStandard, RoutingVerificationResult } from '../types';

export const BANK_STANDARDS_DATABASE: Record<string, BankStandard> = {
  abcBank: {
    id: 'abc-bank',
    bankName: 'ABC Bank (Standard Commercial)',
    routingPrefix: '121000358',
    micrFontSpec: 'E-13B Iron-Oxide Magnetic Ink (ANSI X9.27)',
    borderSecurityType: 'Multi-tone guilloche with micro-line ABC security text and void pantograph',
    endorsementRule: 'Restrictive endorsement required for third-party deposits over $5,000 under UCC 3-206',
    trainingTip: 'Verify E-13B magnetic signal strength (70-200%) and inspect guilloche border for continuous ribbon integrity.',
    inkCharacteristics: 'Optically Variable Magnetic Ink with chemical stain reactivity (acetone/chlorine bleach turns pink/brown)',
    paperStock: '24lb security bond with embedded multi-colored fluorescent fibers (UV reactive yellow/blue)',
    checksumRule: 'Standard ABA Mod-10 checksum validation mandatory'
  },
  chaseComm: {
    id: 'chase-comm',
    bankName: 'Chase Commercial Treasury',
    routingPrefix: '021000021',
    micrFontSpec: 'E-13B OCR-A Precision Magnetic (ISO 1004)',
    borderSecurityType: 'Intaglio engraved border with latent image block and prismatic rainbow tint',
    endorsementRule: 'Corporate resolution on file required for corporate disbursements exceeding $10,000',
    trainingTip: 'Inspect right margin for standard void pantograph activation and verify routing prefix 021.',
    inkCharacteristics: 'Heat-sensitive thermochromic ink emblem (disappears at 88°F, returns upon cooling)',
    paperStock: 'Watermarked security cotton blend with chemical neutralization capsule coating',
    checksumRule: 'ABA 9-digit weighted sum checksum'
  },
  bofaCorp: {
    id: 'bofa-corp',
    bankName: 'Bank of America Corporate Trust',
    routingPrefix: '026009593',
    micrFontSpec: 'E-13B High-Resolution Magnetic Encoder Toners',
    borderSecurityType: 'Prismatic multi-color rainbow background tint with invisible UV reaction',
    endorsementRule: 'Dual authorized signature required for disbursements exceeding $25,000',
    trainingTip: 'Check rainbow color blending transition; consumer inkjet prints cannot reproduce multi-pass prismatic tinting.',
    inkCharacteristics: 'Penetrating dye-based safety ink that bleeds through paper when subjected to erasure solvents',
    paperStock: 'Chalk-surfaced chemical reactive paper with embedded security threads',
    checksumRule: 'ABA Mod-10 weighted validation algorithm'
  },
  wellsFargo: {
    id: 'wells-fargo',
    bankName: 'Wells Fargo Business Banking',
    routingPrefix: '121000248',
    micrFontSpec: 'E-13B Standard Iron-Oxide Magnetic',
    borderSecurityType: 'Stagecoach security watermark and chemical stain-reactive safety pulp',
    endorsementRule: 'Positive pay electronic clearing verification required before teller window cash-out',
    trainingTip: 'Hold check to ultraviolet light to inspect fluorescent security fibers embedded in pulp.',
    inkCharacteristics: 'Metallic foil hot-stamp security seal resistant to color photocopier capture',
    paperStock: 'Alkaline chemical reactive paper stock preventing acid/base wash alteration',
    checksumRule: 'Standard ABA Mod-10 checksum validation'
  },
  citiGlobal: {
    id: 'citi-global',
    bankName: 'Citibank Global Markets Corp',
    routingPrefix: '021000089',
    micrFontSpec: 'E-13B Laser-Encoded Magnetic Toner',
    borderSecurityType: 'Micro-printed border reading CITI GLOBAL COMPLIANCE repeatedly at 4pt',
    endorsementRule: 'Electronic verification match mandatory for international wire settlement checks',
    trainingTip: 'Examine 4pt microprint with 10x loupe; blurry characters indicate digital photocopying.',
    inkCharacteristics: 'Fluorescent invisible UV ink seal visible only under 365nm ultraviolet inspection lamp',
    paperStock: 'Synthetic security substrate tear-resistant polymer blend',
    checksumRule: 'ABA Mod-10 strict weighting'
  }
};

/**
 * Real-time ABA Routing Number verification algorithm with Mod-10 weighted checksum
 */
export function verifyRoutingNumber(routingInput: string): RoutingVerificationResult {
  const clean = routingInput.replace(/\D/g, '');
  
  if (clean.length !== 9) {
    return {
      routingNumber: routingInput,
      isValid: false,
      bankName: 'Unknown / Invalid Length',
      federalReserveDistrict: 'N/A',
      location: 'N/A',
      institutionType: 'Invalid Format (Must be 9 digits)',
      checksumCalculation: 'Failed: Length is not 9 digits.'
    };
  }

  const d = clean.split('').map(Number);
  const sum = 3 * (d[0] + d[3] + d[6]) + 7 * (d[1] + d[4] + d[7]) + 1 * (d[2] + d[5] + d[8]);
  const isValid = sum % 10 === 0;

  const prefix2 = clean.substring(0, 2);
  let district = 'Unknown District';
  let location = 'United States';
  let bankName = 'Commercial Depository Institution';
  let institutionType = isValid ? 'Verified Commercial Depository Institution' : 'Suspicious / Invalid Routing Checksum';

  if (prefix2 >= '01' && prefix2 <= '12') {
    const districts: Record<string, string> = {
      '01': 'First Federal Reserve District - Boston',
      '02': 'Second Federal Reserve District - New York',
      '03': 'Third Federal Reserve District - Philadelphia',
      '04': 'Fourth Federal Reserve District - Cleveland',
      '05': 'Fifth Federal Reserve District - Richmond',
      '06': 'Sixth Federal Reserve District - Atlanta',
      '07': 'Seventh Federal Reserve District - Chicago',
      '08': 'Eighth Federal Reserve District - St. Louis',
      '09': 'Ninth Federal Reserve District - Minneapolis',
      '10': 'Tenth Federal Reserve District - Kansas City',
      '11': 'Eleventh Federal Reserve District - Dallas',
      '12': 'Twelfth Federal Reserve District - San Francisco'
    };
    district = districts[prefix2] || 'Federal Reserve Bank';
  }

  Object.values(BANK_STANDARDS_DATABASE).forEach(std => {
    if (std.routingPrefix === clean) {
      bankName = std.bankName;
    }
  });

  return {
    routingNumber: clean,
    isValid,
    bankName,
    federalReserveDistrict: district,
    location,
    institutionType,
    checksumCalculation: `Weighted Sum: 3*(${d[0]}+${d[3]}+${d[6]}) + 7*(${d[1]}+${d[4]}+${d[7]}) + 1*(${d[2]}+${d[5]}+${d[8]}) = ${sum} (Mod 10 = ${sum % 10}) -> ${isValid ? 'PASSED (0)' : 'FAILED (Non-zero)'}`
  };
}
