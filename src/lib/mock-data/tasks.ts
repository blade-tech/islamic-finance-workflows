/**
 * MOCK AI TASK CARDS
 * AI-generated tasks for control execution
 * Demonstrates "Do It For Me" and "Ask Why" capabilities
 */

import { AITaskCard } from '@/lib/types'

export const mockTasks: AITaskCard[] = [
  // CRITICAL: Deal-002 Sanctions Blocker
  {
    id: 'task-rl-03-deal-002',
    controlId: 'RL-03',
    dealId: 'deal-002',
    dealName: 'Commodity Murabaha - Corporate Working Capital',

    priority: 'critical',
    status: 'blocked',
    createdAt: '2024-11-02T15:00:00Z',
    dueDate: '2024-11-02T17:00:00Z',
    assignedTo: 'Compliance Officer',

    summary: 'Sanctions screening failed - counterparty on OFAC SDN list',
    aiInsight: '⚠️ CRITICAL: This deal cannot proceed. Counterparty "Al-Baraka Trading LLC" appears on OFAC Specially Designated Nationals (SDN) list as of Nov 1, 2024. Recommend immediate deal suspension and board notification per FATF Rec 6.',

    evidence: [
      {
        type: 'api_response',
        name: 'OFAC SDN Search Result',
        status: 'verified',
        source: 'API',
        url: 'https://sanctionslistsearch.ofac.treas.gov/Details/12345678',
        collectedAt: '2024-11-02T15:00:00Z',
        lastVerified: '2024-11-02T15:00:00Z'
      },
      {
        type: 'document',
        name: 'Counterparty KYC Form',
        status: 'verified',
        source: 'SharePoint',
        url: '/evidence/kyc-albaraka-2024.pdf',
        hash: 'sha256:abc123...',
        collectedAt: '2024-10-28T10:00:00Z'
      }
    ],

    rule: {
      standard: 'FATF Recommendation 6 (Targeted Financial Sanctions)',
      text: 'Financial institutions must screen counterparties against UN/OFAC sanctions lists and freeze assets of designated persons without delay',
      citation_url: 'https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html'
    },

    proposedFix: undefined, // No automated fix possible for sanctions hits

    availableActions: ['reject', 'ask_why']
  },

  // HIGH: Deal-002 Shariah Review Blocker
  {
    id: 'task-sg-02-deal-002',
    controlId: 'SG-02',
    dealId: 'deal-002',
    dealName: 'Commodity Murabaha - Corporate Working Capital',

    priority: 'high',
    status: 'blocked',
    createdAt: '2024-10-30T10:00:00Z',
    dueDate: '2024-11-08T17:00:00Z',
    assignedTo: 'Shariah Officer',

    summary: 'Shariah review flagged asset ownership transfer mechanism',
    aiInsight: '🕌 Shariah concern: The commodity purchase agreement shows constructive ownership transfer (warehouse receipt) but lacks evidence of physical possession or risk transfer per AAOIFI SS 8 §3/5. SSB requires re-approval with amended contract structure.',

    evidence: [
      {
        type: 'document',
        name: 'Commodity Purchase Agreement (Draft)',
        status: 'verified',
        source: 'SharePoint',
        url: '/evidence/murabaha-purchase-agreement-draft.pdf',
        hash: 'sha256:def456...',
        collectedAt: '2024-10-29T14:00:00Z'
      },
      {
        type: 'document',
        name: 'Shariah Review Findings (Dr. Ahmed)',
        status: 'verified',
        source: 'Manual',
        url: '/evidence/shariah-review-findings-deal-002.pdf',
        collectedAt: '2024-10-30T10:00:00Z'
      },
      {
        type: 'document',
        name: 'Warehouse Receipt',
        status: 'missing',
        source: 'Manual'
      }
    ],

    rule: {
      standard: 'AAOIFI Shariah Standard 8 (Murabaha) §3/5',
      text: 'The institution must take constructive or physical possession of the commodity with full risk transfer before selling to the customer',
      citation_url: 'https://aaoifi.com/shariah-standard-8-murabaha-murabaha-to-the-purchase-orderer/'
    },

    proposedFix: {
      description: 'Agent drafted amended purchase agreement with explicit risk transfer clause and warehouse receipt requirement',
      confidence: 75,
      actions: [
        {
          type: 'create_doc',
          params: {
            template: 'murabaha-purchase-agreement-v2',
            changes: [
              'Add §4.2: Risk transfer upon warehouse receipt issuance',
              'Add §4.3: Insurance coverage during possession period',
              'Add Exhibit B: Warehouse receipt template'
            ]
          },
          preview: 'View draft agreement with tracked changes →'
        },
        {
          type: 'send_email',
          params: {
            to: 'dr.ahmed@shariahboard.com',
            subject: 'Re-submission: Murabaha Deal-002 - Amended Agreement',
            body: 'Dear Dr. Ahmed,\n\nWe have revised the purchase agreement per your review findings...'
          },
          preview: 'Email draft to SSB member →'
        },
        {
          type: 'request_approval',
          params: {
            approver: 'Shariah Board Secretary',
            item: 'Amended Murabaha Purchase Agreement',
            deadline: '2024-11-08T17:00:00Z'
          }
        }
      ]
    },

    availableActions: ['approve', 'reject', 'do_it_for_me', 'ask_why']
  },

  // HIGH: Deal-001 AML/CDD Blocker
  {
    id: 'task-rl-02-deal-001',
    controlId: 'RL-02',
    dealId: 'deal-001',
    dealName: 'Green Sukuk Issuance - Renewable Energy Portfolio',

    priority: 'high',
    status: 'in_progress',
    createdAt: '2024-11-04T13:00:00Z',
    dueDate: '2024-11-10T17:00:00Z',
    assignedTo: 'Compliance Officer',

    summary: 'Enhanced CDD required for 2 high-risk investors',
    aiInsight: '📋 2 investors flagged for Enhanced Due Diligence (EDD) per FATF Rec 10: (1) Offshore entity in Cayman Islands, (2) PEP relationship detected. Agent collected UBO data and source of funds documentation, pending compliance officer review.',

    evidence: [
      {
        type: 'api_response',
        name: 'PEP Screening Results',
        status: 'verified',
        source: 'API',
        url: 'https://dowjones.com/risk-compliance/results/987654',
        collectedAt: '2024-11-04T13:15:00Z',
        lastVerified: '2024-11-04T13:15:00Z'
      },
      {
        type: 'document',
        name: 'UBO Declaration - Cayman Entity',
        status: 'verified',
        source: 'Agent',
        url: '/evidence/ubo-cayman-investor.pdf',
        hash: 'sha256:ghi789...',
        collectedAt: '2024-11-05T09:00:00Z'
      },
      {
        type: 'document',
        name: 'Source of Funds Verification',
        status: 'pending',
        source: 'Manual'
      },
      {
        type: 'document',
        name: 'PEP Relationship Documentation',
        status: 'verified',
        source: 'Agent',
        url: '/evidence/pep-relationship-disclosure.pdf',
        collectedAt: '2024-11-05T10:30:00Z'
      }
    ],

    rule: {
      standard: 'FATF Recommendation 10 (Customer Due Diligence)',
      text: 'Financial institutions must conduct enhanced due diligence for higher-risk categories including PEPs and transactions involving high-risk jurisdictions',
      citation_url: 'https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html'
    },

    proposedFix: {
      description: 'Agent pre-filled EDD questionnaire and drafted compliance memo based on collected evidence',
      confidence: 85,
      actions: [
        {
          type: 'create_doc',
          params: {
            template: 'edd-compliance-memo',
            investor_name: 'Cayman Green Investment Fund LP',
            risk_factors: ['Offshore jurisdiction', 'Complex ownership structure'],
            mitigating_factors: ['Established fund (12 years)', 'Verified UBO', 'Clean PEP screening']
          },
          preview: 'View pre-filled EDD compliance memo →'
        },
        {
          type: 'update_field',
          params: {
            field: 'investor_risk_rating',
            value: 'Medium-High (requires senior manager approval)',
            justification: 'Offshore structure mitigated by verified UBO and clean screening'
          }
        },
        {
          type: 'request_approval',
          params: {
            approver: 'Head of Compliance',
            item: 'EDD Approval - 2 Investors',
            deadline: '2024-11-10T17:00:00Z'
          }
        }
      ]
    },

    availableActions: ['approve', 'reject', 'do_it_for_me', 'ask_why']
  },

  // MEDIUM: Deal-001 RoR Risk Monitoring
  {
    id: 'task-rm-03-deal-001',
    controlId: 'RM-03',
    dealId: 'deal-001',
    dealName: 'Green Sukuk Issuance - Renewable Energy Portfolio',

    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-11-05T08:00:00Z',
    dueDate: '2024-11-12T17:00:00Z',
    assignedTo: 'Risk Manager',

    summary: 'Q4 RoR benchmark data incomplete for projection',
    aiInsight: '📊 Rate-of-Return projection model needs Q4 2024 benchmark data. Agent found partial data from 2 comparable sukuk (ADIB Green Sukuk 2024, DIB Renewable Sukuk 2023) but Bloomberg data subscription expired. Recommend manual import or renew subscription.',

    evidence: [
      {
        type: 'api_response',
        name: 'Bloomberg RoR Data (Partial)',
        status: 'stale',
        source: 'API',
        url: 'https://bloomberg.com/data/sukuk-benchmarks',
        collectedAt: '2024-09-30T00:00:00Z',
        lastVerified: '2024-09-30T00:00:00Z'
      },
      {
        type: 'calculation',
        name: 'RoR Projection Model',
        status: 'pending',
        source: 'Agent',
        url: '/evidence/ror-projection-q4-2024.xlsx'
      },
      {
        type: 'document',
        name: 'Comparable Sukuk Analysis',
        status: 'verified',
        source: 'Agent',
        url: '/evidence/comparable-sukuk-analysis.pdf',
        collectedAt: '2024-11-05T09:00:00Z'
      }
    ],

    rule: {
      standard: 'IFSB-12 Liquidity Risk Management, IFSB-1 RoR Risk',
      text: 'IFIs must monitor rate-of-return expectations for IAH and benchmark against market rates to manage displaced commercial risk',
      citation_url: 'https://www.ifsb.org/standard.php?id=59'
    },

    proposedFix: {
      description: 'Agent can complete RoR projection using partial benchmark data + historical trend extrapolation (lower confidence)',
      confidence: 60,
      actions: [
        {
          type: 'update_field',
          params: {
            field: 'ror_benchmark_source',
            value: 'Hybrid: Bloomberg Q1-Q3 2024 + extrapolated Q4',
            note: 'Lower confidence (60%) - recommend Bloomberg renewal for production'
          }
        },
        {
          type: 'create_doc',
          params: {
            template: 'ror-risk-assessment',
            benchmark_data: 'Partial (Q1-Q3 2024)',
            projection_method: 'Historical trend extrapolation',
            confidence_interval: '±150 bps'
          },
          preview: 'View draft RoR assessment with caveats →'
        }
      ]
    },

    availableActions: ['approve', 'reject', 'do_it_for_me', 'ask_why', 'delegate']
  },

  // MEDIUM: Deal-002 Asset Valuation Expiry
  {
    id: 'task-fr-03-deal-002',
    controlId: 'FR-03',
    dealId: 'deal-002',
    dealName: 'Commodity Murabaha - Corporate Working Capital',

    priority: 'high',
    status: 'blocked',
    createdAt: '2024-11-03T11:00:00Z',
    dueDate: '2024-11-10T17:00:00Z',
    assignedTo: 'Finance Manager',

    summary: 'Asset valuation report expired (>90 days per AAOIFI FAS 28)',
    aiInsight: '⏰ Commodity valuation dated Aug 1, 2024 (96 days old) - exceeds AAOIFI FAS 28 §4.2 freshness requirement (90 days). Agent contacted external valuator; new report available Nov 12. Recommend delay deal closing or request SSB waiver for 6-day extension.',

    evidence: [
      {
        type: 'document',
        name: 'Commodity Valuation Report (Expired)',
        status: 'stale',
        source: 'S3',
        url: '/evidence/commodity-valuation-aug-2024.pdf',
        collectedAt: '2024-08-01T00:00:00Z',
        lastVerified: '2024-08-01T00:00:00Z'
      },
      {
        type: 'document',
        name: 'External Valuator Email Confirmation',
        status: 'verified',
        source: 'Agent',
        url: '/evidence/valuator-email-nov-12-delivery.pdf',
        collectedAt: '2024-11-03T14:00:00Z'
      }
    ],

    rule: {
      standard: 'AAOIFI FAS 28 (Murabaha and Other Deferred Payment Sales) §4.2',
      text: 'Asset valuation for Murabaha transactions must be current (not older than 90 days from transaction date)',
      citation_url: 'https://aaoifi.com/fas-28-murabaha-and-other-deferred-payment-sales/'
    },

    proposedFix: {
      description: 'Agent drafted SSB waiver request with risk mitigation (commodity price index unchanged ±2% since Aug 1)',
      confidence: 70,
      actions: [
        {
          type: 'create_doc',
          params: {
            template: 'ssb-waiver-request',
            control: 'FR-03 Asset Valuation Freshness',
            justification: 'Commodity price index stable (±2% variance), new report available Nov 12',
            risk_mitigation: 'Deal closing delayed to Nov 13 pending updated valuation'
          },
          preview: 'View SSB waiver request draft →'
        },
        {
          type: 'send_email',
          params: {
            to: 'shariah.board@example.com',
            subject: 'Waiver Request: Asset Valuation Freshness (Deal-002)',
            body: 'Dear SSB Members,\n\nWe request a 6-day extension waiver for asset valuation freshness...'
          },
          preview: 'Email to Shariah Board →'
        }
      ]
    },

    availableActions: ['approve', 'reject', 'do_it_for_me', 'ask_why']
  },

  // LOW: Deal-003 Trustee Annual Report
  {
    id: 'task-rl-05-deal-003',
    controlId: 'RL-05',
    dealId: 'deal-003',
    dealName: 'Ijara Muntahia Bittamleek - Aircraft Leasing',

    priority: 'low',
    status: 'in_progress',
    createdAt: '2024-11-05T10:00:00Z',
    dueDate: '2024-11-15T17:00:00Z',
    assignedTo: 'Legal Counsel',

    summary: 'Annual trustee report due Nov 15',
    aiInsight: '📅 Trustee annual report due per trust deed §8.3. Agent sent automated reminder to trustee (HSBC Amanah) on Nov 5. Trustee confirmed delivery by Nov 12. No action required unless delayed.',

    evidence: [
      {
        type: 'document',
        name: 'Trust Deed (Signed)',
        status: 'verified',
        source: 'SharePoint',
        url: '/evidence/trust-deed-deal-003.pdf',
        collectedAt: '2024-10-17T00:00:00Z'
      },
      {
        type: 'document',
        name: 'Trustee Reminder Email (Sent)',
        status: 'verified',
        source: 'Agent',
        url: '/evidence/trustee-reminder-nov-5.pdf',
        collectedAt: '2024-11-05T10:00:00Z'
      },
      {
        type: 'document',
        name: 'Trustee Confirmation Response',
        status: 'verified',
        source: 'Agent',
        url: '/evidence/trustee-confirmation-nov-5.pdf',
        collectedAt: '2024-11-05T11:30:00Z'
      }
    ],

    rule: {
      standard: 'Securities Guidelines (SC Malaysia) - Trust Deed Requirements',
      text: 'Trustee must provide annual report to issuer and regulators within 120 days of financial year-end',
      citation_url: 'https://www.sc.com.my/regulation/guidelines'
    },

    proposedFix: {
      description: 'Agent will monitor trustee delivery deadline and escalate if not received by Nov 13',
      confidence: 95,
      actions: [
        {
          type: 'update_field',
          params: {
            field: 'trustee_report_status',
            value: 'Reminder sent, delivery confirmed Nov 12',
            next_action: 'Auto-escalate if not received by Nov 13'
          }
        }
      ]
    },

    availableActions: ['approve', 'do_it_for_me']
  },

  // MEDIUM: Deal-001 Sustainability KPI Verification
  {
    id: 'task-fr-06-deal-001',
    controlId: 'FR-06',
    dealId: 'deal-001',
    dealName: 'Green Sukuk Issuance - Renewable Energy Portfolio',

    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-11-06T09:00:00Z',
    dueDate: '2024-11-18T17:00:00Z',
    assignedTo: 'Sustainability Officer',

    summary: 'Green project KPI tracking and external verification setup',
    aiInsight: '🌱 Green Sukuk requires Use of Proceeds (UoP) tracking and annual KPI reporting per ICMA GBP. Agent configured automated data collection from 3 renewable energy projects. External verifier (Sustainalytics) contracted for annual assurance - first report due May 2025.',

    evidence: [
      {
        type: 'document',
        name: 'Green Sukuk Framework',
        status: 'verified',
        source: 'SharePoint',
        url: '/evidence/green-sukuk-framework.pdf',
        collectedAt: '2024-10-20T00:00:00Z'
      },
      {
        type: 'api_response',
        name: 'Project KPI Data Feed (Solar Farm A)',
        status: 'verified',
        source: 'API',
        url: 'https://projectapi.example.com/solar-farm-a/kpis',
        collectedAt: '2024-11-06T09:00:00Z',
        lastVerified: '2024-11-06T09:00:00Z'
      },
      {
        type: 'document',
        name: 'External Verifier Contract (Sustainalytics)',
        status: 'verified',
        source: 'Agent',
        url: '/evidence/sustainalytics-contract-2024.pdf',
        collectedAt: '2024-11-06T10:00:00Z'
      },
      {
        type: 'calculation',
        name: 'UoP Allocation Report',
        status: 'pending',
        source: 'Agent',
        url: '/evidence/uop-allocation-q4-2024.xlsx'
      }
    ],

    rule: {
      standard: 'ICMA Green Bond Principles (GBP 2021), BNM VBIAF',
      text: 'Issuers of green sukuk should establish a framework for tracking Use of Proceeds and report on environmental impact indicators annually with external verification',
      citation_url: 'https://www.icmagroup.org/sustainable-finance/the-principles-guidelines-and-handbooks/green-bond-principles-gbp/'
    },

    proposedFix: {
      description: 'Agent will auto-generate quarterly UoP allocation report and coordinate with external verifier for May 2025 assurance',
      confidence: 90,
      actions: [
        {
          type: 'create_doc',
          params: {
            template: 'uop-quarterly-report',
            reporting_period: 'Q4 2024',
            allocated_amount: '$250M',
            projects: ['Solar Farm A ($100M)', 'Wind Farm B ($80M)', 'Hydro Plant C ($70M)']
          },
          preview: 'View draft Q4 UoP allocation report →'
        },
        {
          type: 'send_email',
          params: {
            to: 'sustainalytics@example.com',
            subject: 'Data Package: Annual Green Sukuk Assurance (May 2025)',
            body: 'Dear Sustainalytics Team,\n\nPlease find Q4 2024 UoP data for your annual verification...'
          },
          preview: 'Email to external verifier →'
        }
      ]
    },

    availableActions: ['approve', 'do_it_for_me', 'ask_why']
  },

  // MEDIUM: Deal-002 Credit Risk Assessment
  {
    id: 'task-rm-02-deal-002',
    controlId: 'RM-02',
    dealId: 'deal-002',
    dealName: 'Commodity Murabaha - Corporate Working Capital',

    priority: 'high',
    status: 'failed',
    createdAt: '2024-11-01T09:00:00Z',
    dueDate: '2024-11-08T17:00:00Z',
    assignedTo: 'Risk Manager',

    summary: 'Credit rating below investment grade threshold',
    aiInsight: '📉 Counterparty credit rating downgraded to BB+ (S&P) - below internal policy threshold of BBB- for unsecured Murabaha >$10M. Recommend: (1) Require additional collateral, (2) Reduce facility size to $8M, or (3) Obtain credit enhancement (e.g., bank guarantee).',

    evidence: [
      {
        type: 'api_response',
        name: 'S&P Credit Rating',
        status: 'verified',
        source: 'API',
        url: 'https://spglobal.com/ratings/entity/12345',
        collectedAt: '2024-11-01T09:00:00Z',
        lastVerified: '2024-11-01T09:00:00Z'
      },
      {
        type: 'document',
        name: 'Credit Policy (Internal)',
        status: 'verified',
        source: 'SharePoint',
        url: '/evidence/credit-policy-2024.pdf',
        collectedAt: '2024-11-01T09:30:00Z'
      },
      {
        type: 'calculation',
        name: 'Risk-Adjusted Capital Calculation',
        status: 'verified',
        source: 'Agent',
        url: '/evidence/risk-adjusted-capital-deal-002.xlsx',
        collectedAt: '2024-11-01T10:00:00Z'
      }
    ],

    rule: {
      standard: 'IFSB-1 Risk Management Principles (Credit Risk)',
      text: 'IFIs must establish credit risk limits based on counterparty creditworthiness and apply enhanced monitoring for sub-investment grade exposures',
      citation_url: 'https://www.ifsb.org/standard.php?id=1'
    },

    proposedFix: {
      description: 'Agent recommends requiring 150% collateral coverage (real estate pledge) to mitigate downgrade risk',
      confidence: 80,
      actions: [
        {
          type: 'create_doc',
          params: {
            template: 'credit-mitigation-memo',
            counterparty: 'Al-Baraka Trading LLC',
            issue: 'Credit rating downgrade (BBB- → BB+)',
            recommendation: 'Require 150% collateral coverage (commercial real estate)',
            alternative: 'Reduce facility to $8M (no collateral required per policy)'
          },
          preview: 'View credit mitigation memo →'
        },
        {
          type: 'request_approval',
          params: {
            approver: 'Credit Committee',
            item: 'Credit Enhancement Requirement - Deal-002',
            deadline: '2024-11-08T17:00:00Z'
          }
        }
      ]
    },

    availableActions: ['approve', 'reject', 'do_it_for_me', 'ask_why']
  },

  // MEDIUM: Deal-004 Initial SSB Review
  {
    id: 'task-sg-01-deal-004',
    controlId: 'SG-01',
    dealId: 'deal-004',
    dealName: 'Diminishing Musharaka - Real Estate Development',

    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-11-07T09:00:00Z',
    dueDate: '2024-11-20T17:00:00Z',
    assignedTo: 'Shariah Officer',

    summary: 'Initial SSB fatwa required for Musharaka structure',
    aiInsight: '🕌 New Musharaka product requires SSB fatwa approval per AAOIFI GS-1. Agent drafted SSB submission package including: (1) Product structure memo, (2) Profit-sharing mechanism, (3) Exit terms, (4) Comparable fatwa analysis (3 precedents found). Ready for Shariah Officer review before SSB submission.',

    evidence: [
      {
        type: 'document',
        name: 'Product Structure Memo (Draft)',
        status: 'pending',
        source: 'Agent',
        url: '/evidence/musharaka-structure-memo-draft.pdf',
        collectedAt: '2024-11-07T09:30:00Z'
      },
      {
        type: 'document',
        name: 'Comparable Fatwa Analysis',
        status: 'verified',
        source: 'Agent',
        url: '/evidence/comparable-musharaka-fatwas.pdf',
        collectedAt: '2024-11-07T10:00:00Z'
      },
      {
        type: 'document',
        name: 'Profit-Loss Sharing Calculation',
        status: 'pending',
        source: 'Agent',
        url: '/evidence/pls-calculation-deal-004.xlsx'
      }
    ],

    rule: {
      standard: 'AAOIFI GS-1 (Shariah Supervisory Board), IFSB-10 §4.1',
      text: 'All new Islamic finance products must obtain SSB approval via formal fatwa before offering to customers',
      citation_url: 'https://aaoifi.com/governance-standard-1-shariah-supervisory-board/'
    },

    proposedFix: {
      description: 'Agent compiled SSB submission package with 3 comparable fatwas and AAOIFI SS 12 compliance checklist',
      confidence: 85,
      actions: [
        {
          type: 'create_doc',
          params: {
            template: 'ssb-submission-package',
            product_type: 'Diminishing Musharaka',
            shariah_basis: 'AAOIFI SS 12 (Sharikah/Musharakah)',
            key_features: ['Progressive ownership transfer', 'Rental + purchase installments', 'Asset risk shared during ownership period'],
            precedents: ['Bank Islam Malaysia (2019)', 'Kuwait Finance House (2021)', 'Dubai Islamic Bank (2022)']
          },
          preview: 'View SSB submission package →'
        },
        {
          type: 'send_email',
          params: {
            to: 'shariah.board@example.com',
            subject: 'SSB Review Request: Diminishing Musharaka Product (Deal-004)',
            body: 'Dear SSB Members,\n\nPlease find attached submission package for new Musharaka product...'
          },
          preview: 'Email to Shariah Board →'
        }
      ]
    },

    availableActions: ['approve', 'reject', 'do_it_for_me', 'ask_why']
  }
]

// Utility functions
export const getTaskById = (taskId: string): AITaskCard | undefined => {
  return mockTasks.find(t => t.id === taskId)
}

export const getTasksByDeal = (dealId: string): AITaskCard[] => {
  return mockTasks.filter(t => t.dealId === dealId)
}

export const getTasksByPriority = (priority: AITaskCard['priority']): AITaskCard[] => {
  return mockTasks.filter(t => t.priority === priority)
}

export const getTasksByStatus = (status: AITaskCard['status']): AITaskCard[] => {
  return mockTasks.filter(t => t.status === status)
}

export const getBlockedTasks = (): AITaskCard[] => {
  return mockTasks.filter(t => t.status === 'blocked')
}

export const getCriticalTasks = (): AITaskCard[] => {
  return mockTasks.filter(t => t.priority === 'critical')
}

export const getTasksWithProposedFix = (): AITaskCard[] => {
  return mockTasks.filter(t => t.proposedFix !== undefined)
}
