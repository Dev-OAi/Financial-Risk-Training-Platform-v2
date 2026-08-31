import { BuildathonCandidate, CheckFraudParserResult } from '../types';

export interface Option4SubmissionPacket {
  title: string;
  category: string;
  targetDepartment: string;
  executiveSummary: {
    problem: string;
    solution: string;
    roi: {
      directLossPrevention: string;
      efficiencyGains: string;
      speedToTriage: string;
    };
  };
  reusability: {
    departments: {
      name: string;
      useCase: string;
      impact: string;
    }[];
  };
  solutionDesign: {
    toolsUsed: string[];
    workflowSteps: {
      stepNumber: number;
      title: string;
      description: string;
      details: string[];
    }[];
  };
  implementation: {
    systemRole: string;
    task: string;
    instructions: string[];
    jsonSchema: string;
    sampleOutput: CheckFraudParserResult;
  };
}

export const OPTION_4_SUBMISSION: Option4SubmissionPacket = {
  title: "Automated Check Fraud & Amount Mismatch Parser",
  category: "AI-Powered Workflow / Agent",
  targetDepartment: "Deposit Operations, Retail Branches, Fraud & Risk Management",
  executiveSummary: {
    problem: "Check fraud remains one of the largest financial loss vectors in banking. Manual verification of deposited checks—verifying written (legal) vs. numerical (courtesy) amounts, checking MICR line alignment, and inspecting payee lines for alteration—is labor-intensive, slow, and prone to human error during high-volume processing windows.",
    solution: "An automated vision-based AI workflow that processes ingested check images at deposit points (Mobile Deposit, ATM, or Teller line). The workflow extracts key visual elements, performs automated cross-checks, identifies structural anomalies, and outputs a structured JSON fraud risk evaluation in seconds.",
    roi: {
      directLossPrevention: "Intercepts altered checks and mismatch errors before clearing settlement windows, directly protecting the bank from chargeback losses.",
      efficiencyGains: "Reduces manual review queue volume by 60–70% by instantly auto-approving low-risk, fully matching items.",
      speedToTriage: "Cuts down exception item processing time from minutes per check to milliseconds."
    }
  },
  reusability: {
    departments: [
      {
        name: "Retail Branch Operations",
        useCase: "Teller capture verification at the counter",
        impact: "Instant point-of-deposit alert to tellers before funds are credited to the customer account."
      },
      {
        name: "Digital / Mobile Banking (RDC)",
        useCase: "Real-time background verification for Mobile Remote Deposit Capture",
        impact: "Automated instant hold placement or approval on mobile app deposit captures within 500ms."
      },
      {
        name: "Fraud Investigations & Operations",
        useCase: "Back-office batch parser for post-deposit and overnight clearinghouse queues",
        impact: "Prioritizes high-risk exception items and auto-populates SAR documentation."
      },
      {
        name: "Commercial Banking (Positive Pay)",
        useCase: "Cross-referencing commercial client issue files against incoming check images",
        impact: "Guarantees corporate accounts match issued check lists with zero manual keying."
      }
    ]
  },
  solutionDesign: {
    toolsUsed: [
      "Multimodal LLM / Vision AI (Gemini 3.7 Flash / Vision API)",
      "Structured Prompt Engineering Pipeline",
      "Strict JSON Output Schema & Validator",
      "Real-Time Clearinghouse E-13B MICR Checksum Engine"
    ],
    workflowSteps: [
      {
        stepNumber: 1,
        title: "Image Ingestion",
        description: "Check image (front and back) is ingested into the vision workflow from teller scanners, ATMs, or mobile RDC.",
        details: ["Dual-sided image capture", "Grayscale & color UV artifact normalization", "Resolution check"]
      },
      {
        stepNumber: 2,
        title: "Multimodal OCR & Visual Analysis",
        description: "The AI extracts critical textual and structural fields directly from the pixel buffer.",
        details: [
          "Courtesy Amount (Numerical Box, e.g. $5,000.00)",
          "Legal Amount (Handwritten/Printed Text Line, e.g. 'Five hundred and 00/100')",
          "MICR Line String (Transit Routing, Account, Check Serial)",
          "Payee Name Line ('Pay to the Order of')"
        ]
      },
      {
        stepNumber: 3,
        title: "Automated Cross-Check Logic",
        description: "Performs strict mathematical and semantic validations on extracted fields.",
        details: [
          "Validation A: Legal Amount vs Courtesy Amount match check",
          "Validation B: MICR line font structure, E-13B glyph spacing, and Mod-10 checksum",
          "Validation C: Payee line visual texture, chemical wash halo, and font weight alteration analysis"
        ]
      },
      {
        stepNumber: 4,
        title: "Structured Decision Output",
        description: "Emits a standardized JSON response containing extracted data, validation flags, risk score (0-100), and recommended action.",
        details: [
          "APPROVE: Score 0-30, all validations pass",
          "HOLD_FOR_REVIEW: Score 31-75, mismatch or unverified signer",
          "REJECT: Score 76-100, confirmed alteration, counterfeit stock, or critical mismatch"
        ]
      }
    ]
  },
  implementation: {
    systemRole: "You are an expert Bank Fraud Operations Auditor specialized in check image parsing and forensic document inspection.",
    task: "Analyze the attached image of the check and perform a comprehensive fraud and integrity evaluation.",
    instructions: [
      "1. Extract the numerical 'Courtesy Amount' from the right-hand box.",
      "2. Extract the written 'Legal Amount' from the text line.",
      "3. Extract the Payee Name from the 'Pay to the Order of' line.",
      "4. Extract the full MICR line text at the bottom (Routing Number, Account Number, Check Number).",
      "5. Inspect the Payee area and Amount fields for signs of physical or digital alteration (e.g., font inconsistencies, chemical lifting, irregular spacing, or mismatched ink weights).",
      "6. Perform the following verification checks:\n   - Check A: Does Courtesy Amount exactly equal Legal Amount?\n   - Check B: Is the MICR line properly formatted according to E-13B standards?\n   - Check C: Are there visible signs of payee alteration?"
    ],
    jsonSchema: `{
  "extracted_data": {
    "courtesy_amount_numeric": 0.00,
    "legal_amount_text": "string",
    "payee_name": "string",
    "check_number": "string",
    "routing_number": "string",
    "account_number": "string"
  },
  "verification_results": {
    "amount_match": true/false,
    "micr_structure_valid": true/false,
    "payee_alteration_detected": true/false
  },
  "risk_assessment": {
    "risk_score": 0-100,
    "primary_risk_flags": ["list of flags if any"],
    "recommended_action": "APPROVE" | "HOLD_FOR_REVIEW" | "REJECT"
  }
}`,
    sampleOutput: {
      extracted_data: {
        courtesy_amount_numeric: 5000.00,
        legal_amount_text: "Five hundred and 00/100",
        payee_name: "John Doe",
        check_number: "1042",
        routing_number: "021200025",
        account_number: "9876543210"
      },
      verification_results: {
        amount_match: false,
        micr_structure_valid: true,
        payee_alteration_detected: false
      },
      risk_assessment: {
        risk_score: 85,
        primary_risk_flags: [
          "AMOUNT_MISMATCH: Courtesy Amount ($5,000.00) does not match Legal Amount ($500.00)"
        ],
        recommended_action: "HOLD_FOR_REVIEW"
      }
    }
  }
};

export const BUILDATHON_CANDIDATES: BuildathonCandidate[] = [
  {
    id: 11,
    title: "Commercial Wire Fraud & Callback Screener",
    department: "Treasury / Operations",
    solutionType: "Multi-Step Workflow / Agent",
    whatItDoes: "Scans high-value out-of-band wire requests, compares beneficiary details against historic payment patterns, and auto-generates a prioritized risk score and callback script for ops teams.",
    whyItWins: "High Business Impact by directly preventing business email compromise (BEC) wire losses.",
    pillarScores: {
      businessValue: 25,
      reusability: 24,
      solutionDesign: 25,
      outputQuality: 25
    },
    keyMetrics: [
      "Prevents $500k+ avg BEC wire fraud losses",
      "Generates strict dual-control callback script in 2s",
      "Detects recently altered vendor bank routing"
    ],
    defaultInput: {
      originatorAccount: "Apex Logistics Corp (#44982103)",
      requestedAmount: "$485,000.00 USD",
      requestChannel: "Email Attachment (Out-of-band PDF)",
      beneficiaryName: "Apex Marine Parts LLC",
      beneficiaryBank: "First Offshore Trust (Routing: 121000358)",
      beneficiaryAccount: "9921448821",
      historyMatch: "Vendor name matches, but routing and account number changed 2 days ago via email notification.",
      urgencyLevel: "Immediate Same-Day Settlement Requested"
    },
    sampleOutput: {
      riskScore: 94,
      riskLevel: "CRITICAL_SUSPICION",
      anomalyFlags: [
        "BENEFICIARY_ROUTING_ALTERATION: Routing number changed from historical Chase clearing to unverified First Offshore Trust",
        "HIGH_VELOCITY_OUT_OF_BAND: Request submitted via email attachment without phone token pre-clearance",
        "SETTLEMENT_URGENCY_SPOOF: High-value $485k wire requested under immediate same-day cut-off pressure"
      ],
      recommendedAction: "SUSPEND_WIRE_AND_EXECUTE_CALLBACK",
      callbackScript: {
        authorizedContact: "Sarah Jenkins, CFO (Apex Logistics Corp)",
        verifiedPhoneOnRecord: "+1 (555) 438-9901 (Core CRM Verified)",
        unverifiedEmailSource: "sjenkins@apex-logistics-group.com (SUSPECT DOMAIN SPOOF)",
        mandatoryVerificationQuestions: [
          "Confirm wire amount of $485,000.00 intended for Apex Marine Parts.",
          "Verify the physical phone request originating from Sarah Jenkins rather than email instruction.",
          "Verify source invoice #INV-2026-883 against primary ERP ledger."
        ],
        escalationContact: "BSA/AML Fraud Operations Desk (Ext 4902)"
      }
    },
    promptTemplate: `SYSTEM ROLE: You are an expert Bank Treasury Wire Fraud Operations Specialist.
Analyze the commercial wire request, compare beneficiary details against historical patterns, calculate a risk score (0-100), identify BEC (Business Email Compromise) indicators, and generate an exact, compliant verbal callback script for the operations officer.`
  },
  {
    id: 12,
    title: "Cross-Sell Next-Best-Action Generator for Branch Bankers",
    department: "Retail Banking",
    solutionType: "Prompt Workflow",
    whatItDoes: "Ingests recent customer transaction summaries and account balances to generate 3 tailored, compliant conversation starters for branch associates during routine visits.",
    whyItWins: "Maximum Reusability across every retail branch in the bank network.",
    pillarScores: {
      businessValue: 24,
      reusability: 25,
      solutionDesign: 24,
      outputQuality: 25
    },
    keyMetrics: [
      "Deploys across 100% of retail branch network",
      "Increases deposit retention and CD conversions by 32%",
      "Enforces strict CFPB and Reg DD compliant disclosures"
    ],
    defaultInput: {
      customerName: "Elena Rostova",
      relationshipTenure: "6 Years",
      checkingBalance: "$74,250.00 (Earning 0.05% APY)",
      savingsBalance: "$1,200.00",
      recentActivity: "Frequent large debit transactions to home improvement centers ($12,400 over last 30 days). Direct deposit of $8,500/mo.",
      branchVisitReason: "Inquiring about replacement debit card."
    },
    sampleOutput: {
      customerPersona: "High-Liquidity Prime Depositor / Home Renovator",
      recommendedNextBestActions: [
        {
          rank: 1,
          product: "9-Month Relationship High-Yield CD (4.85% APY)",
          rationale: "Customer is holding $74k+ in standard checking earning virtually zero interest.",
          conversationStarter: "Ms. Rostova, while I set up your new debit card, I noticed your checking balance qualifies for our special 4.85% APY 9-month Relationship Certificate of Deposit. Locking in $50,000 would earn you over $1,800 in guaranteed interest without disrupting your monthly cash flow.",
          complianceNotice: "Annual Percentage Yield accurate as of today. Early withdrawal penalty applies."
        },
        {
          rank: 2,
          product: "Home Equity Line of Credit (HELOC)",
          rationale: "Recent home renovation expenditures ($12.4k) suggest ongoing property improvements.",
          conversationStarter: "I see you have been tackling some home improvements lately! Did you know our Prime HELOC allows you to draw funds at our lowest rate with zero closing costs?",
          complianceNotice: "Subject to credit approval and property valuation."
        },
        {
          rank: 3,
          product: "Premier Cash Back Rewards Credit Card",
          rationale: "High debit card volume that could be earning 2.5% cash back rewards.",
          conversationStarter: "You could be earning 2.5% cash back on all your renovation and retail purchases with our Premier card.",
          complianceNotice: "See cardholder agreement for APR terms and rewards schedule."
        }
      ]
    },
    promptTemplate: `SYSTEM ROLE: You are an expert Retail Banking Strategy & Customer Relationship Consultant.
Analyze the customer's account balances, tenure, and transaction patterns to generate 3 tailored, highly compliant, personalized conversation starters for a branch banker.`
  },
  {
    id: 13,
    title: "Customer Email Sentiment & Escalation Router",
    department: "Customer Care / Branch",
    solutionType: "AI Agent",
    whatItDoes: "Parses inbound customer emails, detects high-risk sentiment or formal complaint triggers (e.g., CFPB keywords), categorizes the issue, and drafts a proposed response.",
    whyItWins: "Strong Solution Design that directly reduces response times and compliance escalation risks.",
    pillarScores: {
      businessValue: 25,
      reusability: 25,
      solutionDesign: 25,
      outputQuality: 25
    },
    keyMetrics: [
      "99.4% accuracy in detecting CFPB/Reg E regulatory triggers",
      "Reduces formal complaint response latency from 4 days to 45 mins",
      "Pre-drafts policy-compliant escalation memos"
    ],
    defaultInput: {
      senderEmail: "m.rodriguez.legal@gmail.com",
      subject: "UNAUTHORIZED CHARGES - IMMATRICULATE FRAUD AND REFUSAL TO REFUND",
      body: "I have visited your branch twice regarding three unauthorized ATM withdrawals totaling $1,500 on my debit card. Your branch manager dismissed my dispute under Regulation E and refused to provide provisional credit. If this is not credited to my account within 48 hours, I will file a formal complaint with the CFPB, OCC, and seek legal damages.",
      accountType: "Personal Checking",
      daysPending: "8 Days"
    },
    sampleOutput: {
      urgencyScore: 98,
      sentiment: "HIGH_RISK_REGULATORY_THREAT",
      detectedTriggers: [
        "REGULATION_E_DISPUTE: Unauthorized debit card withdrawals under 12 CFR 1005",
        "CFPB_ESCALATION_THREAT: Explicit mention of Consumer Financial Protection Bureau complaint",
        "OCC_SUPERVISORY_REFERENCE: Escalation to Office of the Comptroller of the Currency",
        "PROVISIONAL_CREDIT_WINDOW: Exceeded 5-day standard provisional credit turnaround"
      ],
      assignedQueue: "Tier 3 Executive Regulatory Escalations & Fraud Disputes",
      slaTargetMinutes: 60,
      proposedDraftResponse: "Dear Mr. Rodriguez,\n\nThank you for bringing this matter to our Executive Support Team. We sincerely apologize for the frustration and delay you experienced regarding your unauthorized transaction dispute.\n\nWe have initiated an expedited Priority Review under Regulation E guidelines. A provisional credit of $1,500.00 is being posted to your checking account pending the final investigation outcome. A dedicated Dispute Specialist (Case #DISP-99214) will contact you tomorrow morning with a full resolution report.\n\nSincerely,\nExecutive Customer Care & Regulatory Operations"
    },
    promptTemplate: `SYSTEM ROLE: You are a Bank Compliance & Customer Dispute Resolution Specialist.
Parse the customer email, extract regulatory risk triggers (Reg E, Reg Z, CFPB, OCC, FCRA), calculate an urgency score, determine routing queue, and draft a compliant, de-escalating customer response.`
  },
  {
    id: 14,
    title: "Business Loan Application Completeness Checker",
    department: "Small Business Banking",
    solutionType: "Multi-Step Workflow",
    whatItDoes: "Compiles submitted loan documents (tax returns, P&L, IDs), verifies that all required fields and signature lines are populated, and auto-drafts a 'Missing Items' email to the applicant.",
    whyItWins: "Eliminates back-and-forth operational drag, speeding up time-to-decision for small business loans.",
    pillarScores: {
      businessValue: 25,
      reusability: 24,
      solutionDesign: 25,
      outputQuality: 25
    },
    keyMetrics: [
      "Reduces small business loan closing cycle by 4.5 days",
      "Eliminates 80% of applicant email back-and-forth",
      "Instantly validates Schedule C, Form 1120S, and personal guarantor signatures"
    ],
    defaultInput: {
      borrowerName: "Oakwood Medical Supplies Inc.",
      loanRequest: "$350,000 Commercial Line of Credit",
      submittedFiles: [
        { name: "2024_Form_1120S.pdf", pages: 5, signed: true, schedulesPresent: ["Schedule K", "Schedule L"] },
        { name: "2023_Form_1120S.pdf", pages: 5, signed: true, schedulesPresent: ["Schedule K", "Schedule L"] },
        { name: "Interim_P&L_Statement.pdf", pages: 2, signed: false, period: "YTD June 2026" },
        { name: "Guarantor_Personal_Financial_Statement.pdf", pages: 3, signed: false, missingFields: ["Spouse Signature", "Schedule of Real Estate"] }
      ],
      requiredDocumentPolicy: "Small Business Credit Policy v2026 - Standard Package"
    },
    sampleOutput: {
      completenessScore: "68%",
      packageStatus: "INCOMPLETE_MISSING_ITEMS",
      verificationMatrix: [
        { item: "2 Years Business Tax Returns (1120S)", status: "COMPLETE", notes: "2023 and 2024 returns verified with all required schedules." },
        { item: "Interim P&L and Balance Sheet", status: "DEFICIENT", notes: "YTD Statement provided but lacks required Officer Certification signature." },
        { item: "Personal Financial Statement (PFS)", status: "CRITICAL_MISSING", notes: "Form 413 missing Guarantor spouse co-signature and Real Estate Asset Schedule." },
        { item: "Business Debt Schedule", status: "MISSING", notes: "Schedule of current bank debt and equipment leases was not attached." }
      ],
      autoDraftedApplicantEmail: "Subject: Action Required: Missing Items for Oakwood Medical Supplies Loan Application (#SB-88210)\n\nDear Dr. Oakwood,\n\nThank you for submitting your $350,000 credit line application. Our credit underwriting team has completed the initial document verification. To move your application into final credit approval, please provide the following 3 remaining items:\n\n1. Officer Signature on the Interim YTD P&L Statement.\n2. Completed Real Estate Schedule & Co-Signer Signature on the Personal Financial Statement.\n3. Business Debt Schedule detailing existing equipment financing balances.\n\nYou can upload these documents directly to your secure portal link. As soon as received, our underwriting team will issue the formal credit commitment.\n\nWarm regards,\nSmall Business Lending Team"
    },
    promptTemplate: `SYSTEM ROLE: You are a Senior Commercial Underwriting Operations Auditor.
Analyze the submitted loan document package against small business credit policy, evaluate completeness, pinpoint signature deficiencies and missing schedules, and generate a professional, structured applicant email.`
  },
  {
    id: 15,
    title: "IT & System Access Onboarding Automation Agent",
    department: "Human Resources / Operations",
    solutionType: "Agent Workflow",
    whatItDoes: "Takes a new hire profile and role description, maps required system permissions (e.g., core banking system, CRM, loan origination), and generates standardized IT access request tickets.",
    whyItWins: "High Reusability across every department within the bank.",
    pillarScores: {
      businessValue: 24,
      reusability: 25,
      solutionDesign: 24,
      outputQuality: 25
    },
    keyMetrics: [
      "100% role-based security compliance (Zero SOD conflicts)",
      "Reduces employee onboarding provisioning time from 5 days to 10 mins",
      "Standardizes IT tickets across 40+ bank job families"
    ],
    defaultInput: {
      employeeName: "Marcus Vance",
      department: "Commercial Lending & Special Assets",
      jobTitle: "Senior Commercial Loan Underwriter",
      branchLocation: "Metropolitan Corporate HQ (Level 4)",
      manager: "Patricia Hayes (VP Lending)",
      clearanceLevel: "Confidential Credit Authority (Up to $1.5M approval)"
    },
    sampleOutput: {
      provisioningProfile: "ROLE_COMMERCIAL_UNDERWRITING_SENIOR",
      securitySeparationOfDutiesAudit: "PASSED_ZERO_CONFLICTS",
      mappedSystemEntitlements: [
        { system: "nCino / Salesforce Loan Origination", role: "Underwriter_Level_3", permissions: ["Read/Write Deal Memo", "Financial Spreading", "Covenant Tracking"] },
        { system: "FIS / Core Banking System", role: "Inquiry_Only_Commercial", permissions: ["View Deposit Balances", "View Loan Payoff Quotes"] },
        { system: "Moody's Analytics RiskCalc", role: "Commercial_Scorer", permissions: ["Run PD/LGD Models", "Export Credit Rating"] },
        { system: "LexisNexis / Bridger OFAC", role: "AML_Screening_Analyst", permissions: ["Run KYC/CIP Background Search"] }
      ],
      generatedTicketPayload: {
        ticketId: "IT-ONBOARD-2026-904",
        priority: "High",
        summary: "New Hire Provisioning - Marcus Vance (Sr Commercial Underwriter)",
        requiredHardware: "Encrypted Dell Precision Laptop + YubiKey 5C NFC Token",
        adGroups: ["DL-Commercial-Lending", "SecGrp-Credit-Approvers-L3", "VPN-Corp-Metropolitan"]
      }
    },
    promptTemplate: `SYSTEM ROLE: You are an Enterprise Bank IT Security & Identity Access Management (IAM) Engineer.
Map the new hire role to required banking core entitlements, verify Separation of Duties (SOD) compliance, and output a structured IT ticketing payload.`
  },
  {
    id: 16,
    title: "Appraisal & CRE Environmental Report Summarizer",
    department: "Commercial Real Estate",
    solutionType: "Multi-Step Prompt Workflow",
    whatItDoes: "Ingests 100+ page property appraisal reports or Phase I Environmental Site Assessments (ESA) and extracts key valuation metrics, structural risks, and environmental red flags into a 1-page table.",
    whyItWins: "Exceptional Output Quality that saves credit analysts hours of tedious reading per deal.",
    pillarScores: {
      businessValue: 25,
      reusability: 24,
      solutionDesign: 25,
      outputQuality: 25
    },
    keyMetrics: [
      "Synthesizes 120-page CRE appraisal into 1-page executive deal memo",
      "Flags REC (Recognized Environmental Conditions) in seconds",
      "Extracts Cap Rate, NOI, and As-Is vs As-Stabilized LTV"
    ],
    defaultInput: {
      propertyTitle: "Beacon Point Medical & Professional Center (3-Story Office Complex)",
      propertyAddress: "4200 North Harbor Blvd, Suite 100-300",
      appraisalExcerpt: "Total Gross Leasable Area: 64,500 RSF. As-Is Market Value: $14,200,000. As-Stabilized Market Value: $16,800,000 upon reaching 94% occupancy. Current NOI: $923,000. Capitalization Rate: 6.50%. Phase I ESA notes a historical dry cleaning facility operating on adjacent parcel between 1982-1996; minor chlorinated solvent vapor encroachment detected requiring soil-gas vapor barrier.",
      proposedLoanAmount: "$9,230,000 (65% As-Is LTV)"
    },
    sampleOutput: {
      executivePropertySummary: "3-Story Class-B+ Medical Office Building (64,500 RSF)",
      valuationMetrics: {
        asIsMarketValue: "$14,200,000",
        asStabilizedValue: "$16,800,000",
        currentNOI: "$923,000",
        capRate: "6.50%",
        impliedDSCR: "1.38x at 6.75% amortized rate",
        loanToValue: "65.0% As-Is / 54.9% As-Stabilized"
      },
      environmentalAndStructuralRedFlags: [
        { type: "ENVIRONMENTAL_REC", severity: "MEDIUM_HIGH", detail: "Adjacent historical dry cleaner (1982-1996) created vapor encroachment risk. Requires ongoing sub-slab monitoring and vapor mitigation barrier confirmation prior to closing." },
        { type: "DEFERRED_MAINTENANCE", severity: "LOW", detail: "Roof replacement scheduled within 24 months ($140,000 escrow recommended)." }
      ],
      creditCommitteeRecommendation: "APPROVE_WITH_ENVIRONMENTAL_ESCROW_CONDITIONS"
    },
    promptTemplate: `SYSTEM ROLE: You are a Senior Commercial Real Estate Credit Risk Officer.
Ingest the property appraisal and Phase I Environmental Site Assessment data, extract core valuation metrics (NOI, Cap Rate, LTV, DSCR), identify environmental RECs, and output a concise 1-page Credit Committee deal memo.`
  },
  {
    id: 17,
    title: "Regulatory News & Compliance Update Tracker",
    department: "Risk & Legal",
    solutionType: "Prompt Workflow / Agent",
    whatItDoes: "Summarizes daily banking regulatory updates (FDIC, OCC, CFPB bulletins) and maps potential impacts directly to internal bank policy sections.",
    whyItWins: "High Solution Design & Creativity keeping the bank proactive on regulatory changes.",
    pillarScores: {
      businessValue: 24,
      reusability: 25,
      solutionDesign: 25,
      outputQuality: 25
    },
    keyMetrics: [
      "Tracks daily FDIC, OCC, CFPB, and FinCEN advisories",
      "Maps regulatory mandates to internal bank policy sections",
      "Auto-generates compliance action timelines"
    ],
    defaultInput: {
      agencySource: "CFPB & OCC Joint Interagency Advisory",
      bulletinTitle: "Final Rule on Consumer Financial Data Rights & Open Banking (Section 1033)",
      effectiveDate: "October 1, 2026",
      summaryText: "Mandates covered depository institutions with assets over $850M to provide secure, standardized developer APIs for authorized third-party fintechs to access consumer transaction history and account balance data without screen scraping. Prohibits fee charging for API access."
    },
    sampleOutput: {
      regulatoryImpactTier: "TIER_1_CRITICAL_STRATEGIC",
      internalPolicyMapping: [
        { section: "Bank Policy 4.2 - Information Security & Third-Party API Architecture", requiredRevision: "Establish certified OAuth 2.0 FDX-compliant developer gateway to replace screen-scraping IP blocks." },
        { section: "Bank Policy 8.1 - Consumer Fee Schedule & Account Disclosures", requiredRevision: "Eliminate any third-party connectivity data access fees." },
        { section: "Bank Policy 12.4 - Consumer Privacy & Data Revocation", requiredRevision: "Build customer-facing dashboard for real-time third-party data sharing revocation." }
      ],
      complianceRoadmap: [
        { milestone: "API Architecture Gap Analysis", targetQuarter: "Q3 2026", leadOwner: "Chief Technology Officer" },
        { milestone: "Customer Consent Management Portal", targetQuarter: "Q4 2026", leadOwner: "Head of Digital Channels" }
      ]
    },
    promptTemplate: `SYSTEM ROLE: You are a Bank General Counsel & Regulatory Compliance Director.
Analyze the incoming federal regulatory bulletin, identify operational and legal impacts, map revisions directly to internal bank policy sections, and generate an executive action matrix.`
  },
  {
    id: 18,
    title: "Treasury Management Pitch Deck Generator",
    department: "Treasury Management",
    solutionType: "Prompt / Workflow",
    whatItDoes: "Inputs a commercial prospect's estimated annual revenue, industry, and current pain points to auto-generate customized value propositions and service bundling recommendations for pitch decks.",
    whyItWins: "Clear revenue-generating Business Impact for commercial growth teams.",
    pillarScores: {
      businessValue: 25,
      reusability: 24,
      solutionDesign: 24,
      outputQuality: 25
    },
    keyMetrics: [
      "Accelerates commercial treasury RFP responses by 75%",
      "Identifies $45k+ annual fee and float opportunities per prospect",
      "Generates customized slide deck talking points"
    ],
    defaultInput: {
      prospectName: "Summit Regional Healthcare Group",
      annualRevenue: "$65,000,000",
      industry: "Healthcare & Outpatient Clinics (14 locations)",
      currentBankingRelationship: "Legacy Regional Bank",
      identifiedPainPoints: "Manual reconciliation of patient paper checks, delayed insurance ACH remittance posting, lack of multi-entity account sweeping."
    },
    sampleOutput: {
      tailoredTreasurySolution: "Summit Health Automated Liquidity & Revenue Cycle Treasury Package",
      recommendedServiceBundling: [
        { product: "Healthcare Lockbox with AI EOB Matching", valueProp: "Converts patient checks and paper Explanation of Benefits (EOB) into 835 HIPAA-compliant electronic posting files, cutting billing cycle by 6 days." },
        { product: "Zero Balance Accounts (ZBA) & Target Balance Sweeps", valueProp: "Automatically consolidates liquidity from 14 clinic deposit accounts into an interest-bearing sweep overnight." },
        { product: "ACH Positive Pay & Real-Time Payments (RTP)", valueProp: "Secures medical supplier disbursements and provides instant doctor compensation payouts." }
      ],
      estimatedAnnualSavings: "$58,400 in administrative overhead and $32,000 in accelerated cash float",
      pitchDeckSlideOutlines: [
        "Slide 1: Solving Healthcare Revenue Cycle Latency",
        "Slide 2: Automated Lockbox & EOB Digital Conversion",
        "Slide 3: Enterprise Liquidity Architecture & Sweep Returns",
        "Slide 4: Implementation Roadmap & Dedicated Onboarding Officer"
      ]
    },
    promptTemplate: `SYSTEM ROLE: You are a Senior Treasury Management Solutions Architect.
Given the commercial prospect's profile, industry, and cash flow pain points, build a customized treasury bundling proposal, calculate ROI savings, and draft pitch deck slide outlines.`
  },
  {
    id: 19,
    title: "Branch Operations Daily Checklist & Audit Synthesizer",
    department: "Branch Operations",
    solutionType: "Prompt Workflow",
    whatItDoes: "Summarizes daily branch vault counts, dual-control audit logs, and transaction exception reports into a standardized manager daily sign-off summary.",
    whyItWins: "Simplifies repetitive administrative routines for Branch Managers and Operations Officers.",
    pillarScores: {
      businessValue: 24,
      reusability: 25,
      solutionDesign: 24,
      outputQuality: 25
    },
    keyMetrics: [
      "Saves Branch Managers 45 minutes every morning & evening",
      "Enforces 100% compliance with dual-control vault procedures",
      "Consolidates exception logs into audit-ready manager packet"
    ],
    defaultInput: {
      branchName: "Branch #104 - Downtown Financial Center",
      date: "August 31, 2026",
      vaultCashCount: "Opening: $142,500.00 | Closing: $156,200.00 | Variance: $0.00",
      atmReplenishment: "ATM #1 Replenished $40,000 (Dual control: Teller #12 & Head Teller #04)",
      overShortItems: "Teller #08 had a $2.50 overage (within $10 threshold).",
      ctrFilings: "2 Currency Transaction Reports filed (Customer #9941: $14,000 cash in, Customer #4412: $11,500 cash in)",
      securityCheck: "Alarm system armed, all teller cash drawers locked in vault."
    },
    sampleOutput: {
      auditStatus: "PASSED_CLEAN_SIGN_OFF",
      executiveSummary: "All end-of-day cash counts, vault balances, and dual-control verifications completed with zero unresolved discrepancies.",
      auditChecklistMatrix: [
        { control: "Main Cash Vault Reconciliation", status: "VERIFIED", notes: "$156,200.00 balanced exactly with zero variance." },
        { control: "ATM Dual Control Replenishment", status: "VERIFIED", notes: "Dual sign-off logged by Teller #12 & Head Teller #04." },
        { control: "BSA/CTR Regulatory Filings", status: "VERIFIED", notes: "2 CTR filings transmitted within mandatory FinCEN window." },
        { control: "Teller Drawer Balancing", status: "VERIFIED", notes: "1 minor $2.50 overage logged and within branch policy limit." }
      ],
      managerSignOffText: "I, Branch Operations Officer, certify that all daily cash counts, security protocols, and exception logs have been audited in compliance with Bank Operating Manual Policy 3.1."
    },
    promptTemplate: `SYSTEM ROLE: You are a Branch Operations Audit & Compliance Officer.
Synthesize the branch's daily balancing logs, dual-control verification entries, and exception reports into a formal Branch Manager Daily Audit Sign-Off dossier.`
  },
  {
    id: 20,
    title: "Customer Deceased Notification & Estate Workflow Assistant",
    department: "Deposit Operations",
    solutionType: "Multi-Step Agent Workflow",
    whatItDoes: "Guides operations staff through the sensitive process of handling estate accounts, auto-generating necessary legal hold notices, document checklists, and compassionate customer communications.",
    whyItWins: "Combines operational accuracy with high customer empathy, lowering compliance risk.",
    pillarScores: {
      businessValue: 25,
      reusability: 24,
      solutionDesign: 25,
      outputQuality: 25
    },
    keyMetrics: [
      "100% legal compliance with probate hold rules and POD beneficiary designations",
      "Reduces estate account processing turnaround from 3 weeks to 48 hours",
      "Generates empathetic, compassionate condolence letters"
    ],
    defaultInput: {
      deceasedCustomerName: "Arthur Pendelton",
      dateOfDeath: "August 18, 2026",
      informantName: "Margaret Pendelton (Daughter / Designated Executrix)",
      accountHoldings: [
        { account: "Primary Checking (#1002991)", balance: "$14,320.00", ownership: "Sole Owner" },
        { account: "High Yield Savings (#1002992)", balance: "$85,400.00", ownership: "Payable on Death (POD) to Margaret Pendelton" },
        { account: "Safe Deposit Box (#B-44)", status: "Active, Key with customer" }
      ],
      submittedDocs: "Certified Death Certificate received."
    },
    sampleOutput: {
      estateCaseId: "ESTATE-2026-0881",
      requiredLegalActions: [
        { action: "Place Estate Legal Hold on Sole Checking (#1002991)", status: "REQUIRED_IMMEDIATE", legalReason: "Requires Letters of Administration / Probate Court Order to disburse." },
        { action: "Direct POD Beneficiary Transfer on Savings (#1002992)", status: "PROCEED_DIRECT_PAYOUT", legalReason: "Designated POD avoids probate; payable directly to Margaret Pendelton upon identity verification." },
        { action: "Seal Safe Deposit Box (#B-44)", status: "REQUIRED_IMMEDIATE", legalReason: "Requires probate inventory order or bank witness joint opening." }
      ],
      requiredDocumentChecklist: [
        "Certified Copy of Letters Testamentary / Letters of Administration",
        "W-9 Form for Estate EIN",
        "Valid Government ID for Executrix Margaret Pendelton"
      ],
      compassionateCondolenceLetter: "Dear Ms. Pendelton,\n\nPlease accept our deepest condolences on the passing of your father, Arthur Pendelton. We know this is an immensely difficult time, and we are committed to making the transition of his accounts as smooth and supportive as possible.\n\nBecause your father thoughtfully designated you as the direct beneficiary on his High-Yield Savings Account, those funds can be transferred to you immediately upon receiving your ID. For the checking account, our dedicated Estate Services Specialist (Evelyn Scott, Direct: 555-0199) will assist you step-by-step through the simple estate documentation.\n\nWith our sincere sympathy,\nEstate Support & Client Care Services"
    },
    promptTemplate: `SYSTEM ROLE: You are a Senior Deposit Operations Estate Specialist & Legal Compliance Officer.
Evaluate the deceased customer's account ownership structure, identify mandatory probate legal holds vs direct POD payouts, and draft a compassionate, highly compliant customer communication.`
  }
];
