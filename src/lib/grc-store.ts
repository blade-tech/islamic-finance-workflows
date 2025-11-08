/**
 * GRC STORE
 * =========
 * Zustand store for Qatar GRC compliance management.
 * Contains mock data from Qatar dual-regulatory research.
 *
 * Data Sources:
 * - 60 unified obligations from QATAR_UNIFIED_OBLIGATIONS_REGISTER.md
 * - 34 controls from QATAR_CONTROL_ACTIVATION_RULES.md
 * - SSB governance from QCB_SSB_GOVERNANCE_MODEL.md
 * - SNCR management from QCB/QFCRA research
 */

import { create } from 'zustand'
import type {
  QatarRegulator,
  Obligation,
  Control,
  SSBMember,
  SSBDecision,
  SNCRIncident,
  PurificationJournalEntry,
  Report,
  ControlTest,
  ComplianceMetrics,
  ComplianceStatus,
  TestResult,
} from './grc-types'

// ============================================================================
// MOCK DATA: OBLIGATIONS (First 10 from research)
// ============================================================================

const mockObligations: Obligation[] = [
  {
    id: 'UNIFIED-OBL-001',
    title: 'Establish Shariah Supervisory Board (SSB)',
    requirement: 'Establish and maintain a Shariah Supervisory Board with minimum 3 qualified Shariah scholars to oversee all Islamic operations.',
    applicability: ['QCB', 'QFCRA'],
    category: 'SSB_GOVERNANCE',
    frequency: 'ONGOING',
    evidence_required: ['SSB appointment letters', 'Scholar CVs', 'Board resolutions'],
    related_controls: ['CTRL-SSB-001', 'CTRL-SSB-004'],
    compliance_status: 'COMPLIANT',
    priority: 'CRITICAL',
    source: {
      regulator: 'QCB',
      document: 'QCB Law 13/2012',
      section: 'Article 109',
      url: '/research/qcb-obligations#obl-001'
    },
    effective_date: '2012-06-01',
    notes: 'QCB limits scholars to max 3 SSB positions. QFCRA has no specific limit. Apply strictest requirement (QCB) when both regulators apply.'
  },
  {
    id: 'UNIFIED-OBL-002',
    title: 'SSB Independence Requirements',
    requirement: 'Ensure SSB members maintain independence from management and are free from conflicts of interest.',
    applicability: ['QCB', 'QFCRA'],
    category: 'SSB_GOVERNANCE',
    frequency: 'ONGOING',
    evidence_required: ['Independence declarations', 'Conflict of interest policies', 'Quarterly reviews'],
    related_controls: ['CTRL-SSB-004'],
    compliance_status: 'COMPLIANT',
    priority: 'CRITICAL',
    source: {
      regulator: 'QCB',
      document: 'QCB Circular 68/2015',
      section: 'Independence Criteria',
      url: '/research/qcb-obligations#obl-002'
    },
    effective_date: '2015-03-01',
    notes: 'QCB requires 2-year cooling-off period. More prescriptive than QFCRA principles-based approach.'
  },
  {
    id: 'UNIFIED-OBL-003',
    title: 'SSB Annual Report',
    requirement: 'SSB must issue annual report on Shariah compliance of institution\'s operations.',
    applicability: ['QCB', 'QFCRA'],
    category: 'REPORTING',
    frequency: 'ANNUAL',
    evidence_required: ['Published SSB report', 'QFCRA submission', 'AAOIFI GS-1 compliance'],
    related_controls: ['CTRL-SSB-003', 'CTRL-AA-002'],
    compliance_status: 'IN_PROGRESS',
    priority: 'HIGH',
    source: {
      regulator: 'QCB',
      document: 'Instructions to Banks Chapter 8',
      section: 'SSB Reporting',
      url: '/research/qcb-reporting#obl-003'
    },
    effective_date: '2012-01-01',
    notes: 'QCB requires publication in annual statements. QFCRA requires submission within 3 months.'
  },
  {
    id: 'UNIFIED-OBL-004',
    title: 'Internal Shariah Compliance Function',
    requirement: 'Establish dedicated internal Shariah compliance function reporting to SSB.',
    applicability: ['QCB', 'QFCRA'],
    category: 'INTERNAL_CONTROLS',
    frequency: 'ONGOING',
    evidence_required: ['Organizational chart', 'Job descriptions', 'Reporting structure'],
    related_controls: ['CTRL-SSB-002'],
    compliance_status: 'COMPLIANT',
    priority: 'HIGH',
    source: {
      regulator: 'QCB',
      document: 'QCB Law 13/2012',
      section: 'Article 110',
      url: '/research/qcb-obligations#obl-004'
    },
    effective_date: '2012-06-01'
  },
  {
    id: 'UNIFIED-OBL-005',
    title: 'SNCR Identification and Reporting',
    requirement: 'Implement system to identify, measure, and report Shariah non-compliance risk (SNCR).',
    applicability: ['QCB', 'QFCRA'],
    category: 'SNCR_MANAGEMENT',
    frequency: 'ONGOING',
    evidence_required: ['SNCR policy', 'Incident reports', 'SSB review minutes'],
    related_controls: ['CTRL-SNCR-001', 'CTRL-SNCR-002'],
    compliance_status: 'COMPLIANT',
    priority: 'CRITICAL',
    source: {
      regulator: 'QCB',
      document: 'IFSB-1 Risk Management Guidelines',
      section: 'Section 4.3',
      url: '/research/qcb-obligations#obl-005'
    },
    effective_date: '2013-01-01',
    notes: 'SNCR is Islamic finance-specific operational risk. Must be reported to SSB immediately.'
  },
  {
    id: 'UNIFIED-OBL-006',
    title: 'Purification (Taharah) of Non-Compliant Income',
    requirement: 'Identify and purify (donate to charity) any income from non-Shariah compliant sources.',
    applicability: ['QCB', 'QFCRA'],
    category: 'SNCR_MANAGEMENT',
    frequency: 'ONGOING',
    evidence_required: ['Purification journal', 'Charity receipts', 'SSB approvals'],
    related_controls: ['CTRL-SNCR-003'],
    compliance_status: 'COMPLIANT',
    priority: 'CRITICAL',
    source: {
      regulator: 'QCB',
      document: 'AAOIFI FAS 1',
      section: 'Prohibited Income',
      url: '/research/qcb-aaoifi#obl-006'
    },
    effective_date: '2012-01-01',
    notes: 'QCB mandates full AAOIFI FAS compliance. Must maintain detailed purification journal.'
  },
  {
    id: 'UNIFIED-OBL-007',
    title: 'Islamic Product Approval Process',
    requirement: 'All Islamic financial products must receive SSB approval before launch.',
    applicability: ['QCB', 'QFCRA'],
    category: 'PRODUCT_APPROVAL',
    frequency: 'AD_HOC',
    evidence_required: ['Product proposals', 'SSB fatwa', 'Approval minutes'],
    related_controls: ['CTRL-PROD-001', 'CTRL-SSB-005'],
    compliance_status: 'COMPLIANT',
    priority: 'CRITICAL',
    source: {
      regulator: 'QCB',
      document: 'QCB Circular 10/2014',
      section: 'Product Approval',
      url: '/research/qcb-obligations#obl-007'
    },
    effective_date: '2014-02-01',
    notes: 'SSB must review product structure, contracts, and documentation before launch.'
  },
  {
    id: 'UNIFIED-OBL-008',
    title: 'AAOIFI FAS Financial Reporting',
    requirement: 'Prepare financial statements in accordance with AAOIFI Financial Accounting Standards (FAS).',
    applicability: ['QCB'],  // QCB only - mandatory
    category: 'REPORTING',
    frequency: 'ANNUAL',
    evidence_required: ['AAOIFI FAS compliant financial statements', 'Audit opinion'],
    related_controls: ['CTRL-AA-001', 'CTRL-AA-002'],
    compliance_status: 'COMPLIANT',
    priority: 'CRITICAL',
    source: {
      regulator: 'QCB',
      document: 'QCB Law 13/2012',
      section: 'Article 111',
      url: '/research/qcb-aaoifi#obl-008'
    },
    effective_date: '2012-06-01',
    notes: 'QCB mandates full AAOIFI FAS compliance. QFCRA allows selective reference.'
  },
  {
    id: 'UNIFIED-OBL-009',
    title: 'Monthly Regulatory Reporting',
    requirement: 'Submit monthly prudential and statistical reports to regulator.',
    applicability: ['QCB'],  // QCB only - QFCRA focuses on quarterly
    category: 'REPORTING',
    frequency: 'MONTHLY',
    evidence_required: ['Monthly regulatory returns', 'Submission confirmations'],
    related_controls: ['CTRL-REPORT-001'],
    compliance_status: 'IN_PROGRESS',
    priority: 'HIGH',
    source: {
      regulator: 'QCB',
      document: 'QCB Reporting Instructions',
      section: 'Monthly Returns',
      url: '/research/qcb-reporting#obl-009'
    },
    effective_date: '2012-01-01',
    notes: 'QCB requires 15 monthly reports. QFCRA has no monthly requirements, focuses on quarterly.'
  },
  {
    id: 'UNIFIED-OBL-010',
    title: 'Displaced Commercial Risk (DCR) Management',
    requirement: 'Identify and manage Displaced Commercial Risk arising from investment account holders.',
    applicability: ['QCB', 'QFCRA'],
    category: 'RISK_MANAGEMENT',
    frequency: 'ONGOING',
    evidence_required: ['DCR policy', 'Profit smoothing analysis', 'Investment account disclosures'],
    related_controls: ['CTRL-RISK-005'],
    compliance_status: 'NEEDS_ATTENTION',
    priority: 'HIGH',
    source: {
      regulator: 'QCB',
      document: 'IFSB-1 Risk Management',
      section: 'DCR Management',
      url: '/research/qcb-obligations#obl-010'
    },
    effective_date: '2013-01-01',
    notes: 'DCR is unique to Islamic banking. Arises when bank foregoes profit to remain competitive.'
  },
  // Additional obligations would continue to 60 total...
  // For demo purposes, 10 representative obligations cover key categories
]

// ============================================================================
// MOCK DATA: CONTROLS (34 total - showing first 15)
// ============================================================================

const mockControls: Control[] = [
  {
    id: 'CTRL-SSB-001',
    name: 'SSB Appointment & Composition Verification',
    description: 'Verify SSB has minimum 3 qualified scholars and composition meets regulatory requirements.',
    bucket: 'shariah',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Review SSB appointments, verify qualifications, check position limits (QCB: max 3 per scholar).',
    evidence_types: ['Appointment letters', 'Scholar CVs', 'Position declarations'],
    kri_tracked: ['SSB_member_count', 'SSB_qualification_compliance'],
    last_test_date: '2025-10-15',
    last_test_result: 'PASS',
    next_test_due: '2026-01-15',
    related_obligations: ['UNIFIED-OBL-001'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-SSB-002',
    name: 'Internal Shariah Compliance Function',
    description: 'Verify dedicated Shariah compliance function exists and reports to SSB.',
    bucket: 'governance',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Review org chart, verify reporting lines, interview compliance staff.',
    evidence_types: ['Org chart', 'Job descriptions', 'Meeting minutes'],
    kri_tracked: ['Shariah_compliance_staff_count'],
    last_test_date: '2025-09-01',
    last_test_result: 'PASS',
    next_test_due: '2026-03-01',
    related_obligations: ['UNIFIED-OBL-004'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-SSB-003',
    name: 'SSB Annual Report Generation',
    description: 'Ensure SSB annual report is prepared, approved, and published per requirements.',
    bucket: 'governance',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Review annual report for completeness, verify QCB template compliance, confirm QFCRA submission.',
    evidence_types: ['SSB report', 'QFCRA submission confirmation', 'Publication proof'],
    kri_tracked: ['SSB_report_timeliness'],
    last_test_date: '2025-04-01',
    last_test_result: 'PASS',
    next_test_due: '2026-04-01',
    related_obligations: ['UNIFIED-OBL-003'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-SSB-004',
    name: 'SSB Independence Verification',
    description: 'Verify SSB members meet independence criteria and have no conflicts of interest.',
    bucket: 'governance',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Review independence declarations, verify 2-year cooling-off (QCB), check conflict of interest.',
    evidence_types: ['Independence declarations', 'Conflict of interest reviews'],
    kri_tracked: ['SSB_independence_compliance'],
    last_test_date: '2025-10-01',
    last_test_result: 'PASS',
    next_test_due: '2026-01-01',
    related_obligations: ['UNIFIED-OBL-001', 'UNIFIED-OBL-002'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-SSB-005',
    name: 'Product Approval Process Control',
    description: 'Ensure all Islamic products receive SSB approval before launch.',
    bucket: 'shariah',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Review product pipeline, verify SSB review and approval for all products.',
    evidence_types: ['Product proposals', 'SSB fatwas', 'Approval minutes'],
    kri_tracked: ['Unapproved_products_launched'],
    last_test_date: '2025-11-01',
    last_test_result: 'PASS',
    next_test_due: '2025-12-01',
    related_obligations: ['UNIFIED-OBL-007'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-SNCR-001',
    name: 'SNCR Identification Process',
    description: 'Systematic process to identify potential Shariah non-compliance incidents.',
    bucket: 'shariah',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Review SNCR policy, test incident reporting mechanism, verify escalation to SSB.',
    evidence_types: ['SNCR policy', 'Incident logs', 'SSB escalation records'],
    kri_tracked: ['SNCR_incidents_identified', 'SNCR_incidents_unreported'],
    last_test_date: '2025-10-20',
    last_test_result: 'PASS',
    next_test_due: '2026-01-20',
    related_obligations: ['UNIFIED-OBL-005'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-SNCR-002',
    name: 'SNCR Incident Management',
    description: 'Control for managing and resolving SNCR incidents with SSB oversight.',
    bucket: 'operational',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Review recent SNCR incidents, verify SSB review, check resolution timeline.',
    evidence_types: ['Incident reports', 'SSB rulings', 'Remediation plans'],
    kri_tracked: ['Open_SNCR_incidents', 'SNCR_resolution_time'],
    last_test_date: '2025-10-25',
    last_test_result: 'PASS',
    next_test_due: '2026-01-25',
    related_obligations: ['UNIFIED-OBL-005'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-SNCR-003',
    name: 'Purification (Taharah) Process',
    description: 'Control for identifying and purifying non-Shariah compliant income.',
    bucket: 'shariah',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Review purification journal, verify charity donations, check SSB approval.',
    evidence_types: ['Purification journal', 'Charity receipts', 'SSB approvals'],
    kri_tracked: ['Purification_pending_amount', 'Purification_timeliness'],
    last_test_date: '2025-10-30',
    last_test_result: 'PASS',
    next_test_due: '2026-01-30',
    related_obligations: ['UNIFIED-OBL-006'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-PROD-001',
    name: 'Islamic Product Validation',
    description: 'Validate Islamic product structures comply with Shariah principles before launch.',
    bucket: 'shariah',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Review product documentation, verify Shariah compliance, check SSB approval.',
    evidence_types: ['Product specs', 'Shariah analysis', 'SSB fatwa'],
    kri_tracked: ['Products_pending_approval'],
    last_test_result: 'NOT_TESTED',
    related_obligations: ['UNIFIED-OBL-007'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-AA-001',
    name: 'AAOIFI FAS Compliance Verification',
    description: 'Verify financial statements comply with AAOIFI Financial Accounting Standards.',
    bucket: 'operational',
    qcb_required: true,  // QCB mandatory
    qfcra_required: false,  // QFCRA selective
    test_procedure: 'Review financial statements against AAOIFI FAS, verify external audit opinion.',
    evidence_types: ['Financial statements', 'AAOIFI FAS checklist', 'Audit opinion'],
    kri_tracked: ['AAOIFI_FAS_deviations'],
    last_test_date: '2025-03-31',
    last_test_result: 'PASS',
    next_test_due: '2026-03-31',
    related_obligations: ['UNIFIED-OBL-008'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-AA-002',
    name: 'AAOIFI Governance Standards Compliance',
    description: 'Ensure compliance with AAOIFI Governance Standards (GSIFI).',
    bucket: 'governance',
    qcb_required: true,
    qfcra_required: true,  // QFCRA mandates GSIFI 1,2,3
    test_procedure: 'Review governance practices against AAOIFI GSIFI 1, 2, 3.',
    evidence_types: ['Governance policies', 'GSIFI compliance checklist'],
    kri_tracked: ['GSIFI_compliance_score'],
    last_test_date: '2025-06-30',
    last_test_result: 'PASS',
    next_test_due: '2026-06-30',
    related_obligations: ['UNIFIED-OBL-003'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-REPORT-001',
    name: 'Monthly Regulatory Reporting',
    description: 'Submit monthly regulatory returns to QCB on time and accurately.',
    bucket: 'operational',
    qcb_required: true,  // QCB only - 15 monthly reports
    qfcra_required: false,  // QFCRA has no monthly requirements
    test_procedure: 'Verify all 15 monthly reports submitted, check accuracy, confirm timeliness.',
    evidence_types: ['Monthly returns', 'Submission confirmations', 'QCB acknowledgments'],
    kri_tracked: ['Monthly_reports_late', 'Monthly_reports_errors'],
    last_test_date: '2025-11-05',
    last_test_result: 'PASS',
    next_test_due: '2025-12-05',
    related_obligations: ['UNIFIED-OBL-009'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-RISK-005',
    name: 'Displaced Commercial Risk (DCR) Measurement',
    description: 'Measure and monitor Displaced Commercial Risk from investment accounts.',
    bucket: 'operational',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Calculate DCR exposure, review profit smoothing, verify disclosure to investment account holders.',
    evidence_types: ['DCR calculation', 'Profit distribution analysis', 'Customer disclosures'],
    kri_tracked: ['DCR_exposure', 'Profit_smoothing_reserve'],
    last_test_date: '2025-09-30',
    last_test_result: 'FAIL',
    next_test_due: '2025-12-31',
    related_obligations: ['UNIFIED-OBL-010'],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md'
  },
  {
    id: 'CTRL-DOC-001',
    name: 'Bilingual Documentation Management (QCB)',
    description: 'Ensure regulatory documents maintained in both Arabic and English (QCB requirement).',
    bucket: 'operational',
    qcb_required: true,  // QCB bilingual requirement
    qfcra_required: false,  // QFCRA English only
    test_procedure: 'Verify Arabic and English versions of key documents, check translation accuracy.',
    evidence_types: ['Bilingual documents', 'Translation certifications'],
    kri_tracked: ['Documents_missing_translation'],
    last_test_result: 'NOT_TESTED',
    related_obligations: [],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md - Qatar-specific control'
  },
  {
    id: 'CTRL-GOV-001',
    name: 'Board Islamic Finance Competency',
    description: 'Verify Board of Directors has adequate Islamic finance competency.',
    bucket: 'governance',
    qcb_required: true,
    qfcra_required: true,
    test_procedure: 'Review Board member qualifications, verify Islamic finance training, assess competency.',
    evidence_types: ['Board member CVs', 'Training records', 'Competency assessments'],
    kri_tracked: ['Board_IF_competency_score'],
    last_test_result: 'NOT_TESTED',
    related_obligations: [],
    source_document: 'QATAR_CONTROL_ACTIVATION_RULES.md - Qatar-specific control'
  },
  // Additional 19 controls would complete the 34 total...
]

// ============================================================================
// MOCK DATA: SSB MEMBERS
// ============================================================================

const mockSSBMembers: SSBMember[] = [
  {
    id: 'ssb-001',
    name: 'Dr. Ahmad Al-Rashid',
    qualifications: 'PhD Islamic Finance (Al-Azhar), AAOIFI CSAA, CIPA',
    appointment_date: '2023-01-01',
    term_expiry: '2027-12-31',
    current_positions_count: 2,  // Within QCB limit of 3
    status: 'ACTIVE',
    biography: 'Dr. Ahmad Al-Rashid is a renowned Shariah scholar specializing in Islamic banking and Sukuk structures.',
    specializations: ['Islamic Banking', 'Sukuk', 'Takaful']
  },
  {
    id: 'ssb-002',
    name: 'Sheikh Mohammed Al-Thani',
    qualifications: 'Master Islamic Jurisprudence (Qatar University), AAOIFI CSAA',
    appointment_date: '2023-01-01',
    term_expiry: '2027-12-31',
    current_positions_count: 3,  // At QCB limit of 3
    status: 'ACTIVE',
    biography: 'Sheikh Mohammed is an expert in Qatari Islamic finance regulatory compliance.',
    specializations: ['Regulatory Compliance', 'Islamic Contracts', 'Zakat']
  },
  {
    id: 'ssb-003',
    name: 'Dr. Fatima bint Ali',
    qualifications: 'PhD Shariah (University of Jordan), AAOIFI CSAA',
    appointment_date: '2023-01-01',
    term_expiry: '2027-12-31',
    current_positions_count: 1,
    status: 'ACTIVE',
    biography: 'Dr. Fatima specializes in Islamic finance innovation and fintech Shariah compliance.',
    specializations: ['Islamic Fintech', 'Product Innovation', 'SNCR Management']
  },
]

// ============================================================================
// MOCK DATA: SSB DECISIONS
// ============================================================================

const mockSSBDecisions: SSBDecision[] = [
  {
    id: 'ssb-dec-001',
    decision_date: '2025-10-15',
    decision_type: 'PRODUCT_APPROVAL',
    description: 'Approval of new Sukuk Al-Ijara structure for real estate financing',
    ruling: 'The proposed Sukuk Al-Ijara structure is Shariah-compliant subject to: (1) Clear asset ownership transfer, (2) No penalty clauses for late payment, (3) Market-based rental rates.',
    unanimous: true,
    related_products: ['sukuk-ijara-001'],
    effective_date: '2025-11-01',
    documents: ['product-proposal-sukuk-ijara.pdf', 'shariah-analysis-sukuk.pdf']
  },
  {
    id: 'ssb-dec-002',
    decision_date: '2025-09-20',
    decision_type: 'INCIDENT_RULING',
    description: 'Ruling on late Sukuk profit distribution incident',
    ruling: 'Late distribution constitutes SNCR. Purify late payment fees (QAR 1,500) and implement enhanced distribution controls.',
    unanimous: false,
    dissenting_opinions: 'One member argued no purification needed as delay was administrative, not Shariah violation.',
    related_incidents: ['sncr-001'],
    effective_date: '2025-09-20',
    documents: ['incident-analysis.pdf', 'purification-calculation.pdf']
  },
]

// ============================================================================
// MOCK DATA: SNCR INCIDENTS
// ============================================================================

const mockSNCRIncidents: SNCRIncident[] = [
  {
    id: 'sncr-001',
    incident_date: '2025-09-01',
    detected_by: 'Internal Shariah Audit',
    description: 'Late Sukuk profit distribution due to operational delay in payment processing system',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    purification_amount: 1500.00,
    purification_status: 'DISTRIBUTED',
    purification_date: '2025-09-25',
    purification_recipient: 'Qatar Charity',
    ssb_decision_id: 'ssb-dec-002',
    ssb_ruling: 'Purify late payment fees and implement enhanced controls',
    remediation_plan: 'Upgrade payment processing system, implement pre-distribution validation checks',
    remediation_completed: true,
    remediation_date: '2025-10-15',
    evidence_documents: ['incident-report-001.pdf', 'charity-receipt-001.pdf'],
    reported_to_regulator: false
  },
  {
    id: 'sncr-002',
    incident_date: '2025-08-15',
    detected_by: 'SSB Quarterly Review',
    description: 'Investment in non-Shariah compliant equity discovered in commingled fund',
    severity: 'HIGH',
    status: 'RESOLVED',
    purification_amount: 12500.00,
    purification_status: 'DISTRIBUTED',
    purification_date: '2025-08-20',
    purification_recipient: 'Qatar Red Crescent',
    ssb_ruling: 'Immediate divestment and purification of gains. Implement enhanced screening.',
    remediation_plan: 'Implement automated Shariah screening for all investments',
    remediation_completed: true,
    remediation_date: '2025-09-01',
    evidence_documents: ['screening-failure-analysis.pdf', 'charity-receipt-002.pdf'],
    reported_to_regulator: true,
    regulator_reference: 'QCB-SNCR-2025-08-001'
  },
  {
    id: 'sncr-003',
    incident_date: '2025-10-05',
    detected_by: 'Customer Complaint',
    description: 'Late fee charged on Murabaha financing (prohibited penalty clause)',
    severity: 'CRITICAL',
    status: 'UNDER_REVIEW',
    purification_amount: 850.00,
    purification_status: 'PENDING',
    remediation_plan: 'Review all financing contracts, update system to prevent penalty charges',
    remediation_completed: false,
    evidence_documents: ['customer-complaint.pdf', 'contract-review.pdf'],
    reported_to_regulator: false
  },
]

// ============================================================================
// MOCK DATA: PURIFICATION JOURNAL
// ============================================================================

const mockPurificationJournal: PurificationJournalEntry[] = [
  {
    id: 'purif-001',
    incident_id: 'sncr-001',
    amount: 1500.00,
    currency: 'QAR',
    purification_date: '2025-09-25',
    recipient: 'Qatar Charity',
    receipt_reference: 'QC-2025-09-25-001',
    notes: 'Late payment fees from Sukuk distribution incident'
  },
  {
    id: 'purif-002',
    incident_id: 'sncr-002',
    amount: 12500.00,
    currency: 'QAR',
    purification_date: '2025-08-20',
    recipient: 'Qatar Red Crescent',
    receipt_reference: 'QRC-2025-08-20-042',
    notes: 'Gains from non-Shariah compliant investment'
  },
]

// ============================================================================
// ZUSTAND STORE
// ============================================================================

interface GRCStore {
  // Regulator Selection
  selectedRegulators: QatarRegulator[]
  setSelectedRegulators: (regulators: QatarRegulator[]) => void

  // Obligations
  obligations: Obligation[]
  getFilteredObligations: () => Obligation[]
  updateObligationStatus: (id: string, status: ComplianceStatus) => void

  // Controls
  controls: Control[]
  getActiveControls: () => Control[]
  getControlById: (id: string) => Control | undefined
  executeControlTest: (id: string, result: TestResult, notes: string) => void

  // SSB Members
  ssbMembers: SSBMember[]
  addSSBMember: (member: Omit<SSBMember, 'id'>) => void

  // SSB Decisions
  ssbDecisions: SSBDecision[]
  addSSBDecision: (decision: Omit<SSBDecision, 'id'>) => void

  // SNCR Incidents
  sncrIncidents: SNCRIncident[]
  reportSNCRIncident: (incident: Omit<SNCRIncident, 'id'>) => void
  updateSNCRStatus: (id: string, status: SNCRIncident['status']) => void

  // Purification Journal
  purificationJournal: PurificationJournalEntry[]

  // Compliance Metrics (Calculated)
  getComplianceMetrics: () => ComplianceMetrics
}

export const useGRCStore = create<GRCStore>((set, get) => ({
  // ========================================================================
  // REGULATOR SELECTION
  // ========================================================================
  selectedRegulators: ['QCB'],  // Default to QCB

  setSelectedRegulators: (regulators) => {
    // Ensure at least one regulator selected
    if (regulators.length === 0) {
      regulators = ['QCB']
    }
    set({ selectedRegulators: regulators })
  },

  // ========================================================================
  // OBLIGATIONS
  // ========================================================================
  obligations: mockObligations,

  getFilteredObligations: () => {
    const { selectedRegulators, obligations } = get()
    return obligations.filter(obl =>
      selectedRegulators.some(reg => obl.applicability.includes(reg))
    )
  },

  updateObligationStatus: (id, status) => set(state => ({
    obligations: state.obligations.map(obl =>
      obl.id === id ? { ...obl, compliance_status: status } : obl
    )
  })),

  // ========================================================================
  // CONTROLS
  // ========================================================================
  controls: mockControls,

  getActiveControls: () => {
    const { selectedRegulators, controls } = get()
    return controls.filter(ctrl => {
      if (selectedRegulators.includes('QCB') && ctrl.qcb_required) return true
      if (selectedRegulators.includes('QFCRA') && ctrl.qfcra_required) return true
      return false
    })
  },

  getControlById: (id) => {
    const { controls } = get()
    return controls.find(ctrl => ctrl.id === id)
  },

  executeControlTest: (id, result, notes) => set(state => ({
    controls: state.controls.map(ctrl =>
      ctrl.id === id ? {
        ...ctrl,
        last_test_date: new Date().toISOString().split('T')[0],
        last_test_result: result,
        next_test_due: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]  // 90 days
      } : ctrl
    )
  })),

  // ========================================================================
  // SSB MEMBERS
  // ========================================================================
  ssbMembers: mockSSBMembers,

  addSSBMember: (member) => set(state => ({
    ssbMembers: [...state.ssbMembers, {
      ...member,
      id: `ssb-${Date.now()}`,
    }]
  })),

  // ========================================================================
  // SSB DECISIONS
  // ========================================================================
  ssbDecisions: mockSSBDecisions,

  addSSBDecision: (decision) => set(state => ({
    ssbDecisions: [...state.ssbDecisions, {
      ...decision,
      id: `ssb-dec-${Date.now()}`,
    }]
  })),

  // ========================================================================
  // SNCR INCIDENTS
  // ========================================================================
  sncrIncidents: mockSNCRIncidents,

  reportSNCRIncident: (incident) => set(state => ({
    sncrIncidents: [...state.sncrIncidents, {
      ...incident,
      id: `sncr-${Date.now()}`,
    }]
  })),

  updateSNCRStatus: (id, status) => set(state => ({
    sncrIncidents: state.sncrIncidents.map(inc =>
      inc.id === id ? { ...inc, status } : inc
    )
  })),

  // ========================================================================
  // PURIFICATION JOURNAL
  // ========================================================================
  purificationJournal: mockPurificationJournal,

  // ========================================================================
  // COMPLIANCE METRICS
  // ========================================================================
  getComplianceMetrics: () => {
    const { obligations, controls, ssbMembers, sncrIncidents } = get()

    const compliantObligations = obligations.filter(o => o.compliance_status === 'COMPLIANT').length
    const needsAttentionObligations = obligations.filter(o => o.compliance_status === 'NEEDS_ATTENTION').length
    const passedControls = controls.filter(c => c.last_test_result === 'PASS').length
    const failedControls = controls.filter(c => c.last_test_result === 'FAIL').length
    const untestedControls = controls.filter(c => !c.last_test_result || c.last_test_result === 'NOT_TESTED').length
    const activeSSBMembers = ssbMembers.filter(m => m.status === 'ACTIVE').length
    const openSNCRIncidents = sncrIncidents.filter(i => i.status !== 'RESOLVED').length
    const resolvedSNCRIncidents = sncrIncidents.filter(i => i.status === 'RESOLVED').length
    const purificationPending = sncrIncidents
      .filter(i => i.purification_status === 'PENDING')
      .reduce((sum, i) => sum + (i.purification_amount || 0), 0)

    return {
      overall_compliance: Math.round((compliantObligations / obligations.length) * 100),
      obligations_completion: Math.round((compliantObligations / obligations.length) * 100),
      controls_completion: Math.round((passedControls / controls.length) * 100),
      total_obligations: obligations.length,
      compliant_obligations: compliantObligations,
      needs_attention_obligations: needsAttentionObligations,
      total_controls: controls.length,
      passed_controls: passedControls,
      failed_controls: failedControls,
      untested_controls: untestedControls,
      total_ssb_members: ssbMembers.length,
      active_ssb_members: activeSSBMembers,
      total_sncr_incidents: sncrIncidents.length,
      open_sncr_incidents: openSNCRIncidents,
      resolved_sncr_incidents: resolvedSNCRIncidents,
      total_purification_pending: purificationPending,
      overdue_reports: 0,  // Would calculate based on mock reports
      pending_reports: 0,
      submitted_reports: 0,
    }
  },
}))
