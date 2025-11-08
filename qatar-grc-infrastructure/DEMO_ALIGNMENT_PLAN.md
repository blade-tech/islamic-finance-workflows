# Demo Alignment Plan: Current State → Qatar GRC Compliance

**Objective**: Evolve existing demo application to align with Qatar GRC research findings
**Current State**: 24% GRC ready (workflow-based document generation)
**Target State**: Qatar-compliant GRC infrastructure (100%)
**Gap**: 76 percentage points across 10 categories

---

## Executive Summary

This plan provides a **concrete roadmap** for transforming the current demo into a Qatar-compliant GRC system by:

✅ **Preserving valuable existing work** (control library, evidence model, MCP/Graphiti integration)
✅ **Adding missing core entities** (obligations, SSB, SNCR, reports)
✅ **Evolving architecture** incrementally (not a complete rewrite)
✅ **Maintaining backward compatibility** where possible

**Approach**: **Incremental Evolution** - Add new GRC modules alongside existing workflow system, gradually migrate functionality.

---

## Table of Contents

1. [What to Keep vs. Rebuild](#what-to-keep-vs-rebuild)
2. [Database Schema Evolution](#database-schema-evolution)
3. [New Data Models Required](#new-data-models-required)
4. [API Endpoint Additions](#api-endpoint-additions)
5. [Frontend Component Changes](#frontend-component-changes)
6. [Service Layer Additions](#service-layer-additions)
7. [Migration Path (Phased Approach)](#migration-path-phased-approach)
8. [Code Changes by File](#code-changes-by-file)
9. [Implementation Checklist](#implementation-checklist)

---

## What to Keep vs. Rebuild

### ✅ KEEP (Valuable Existing Work)

#### 1. Control Library Design (`src/lib/control-library.ts`)
**Current State**: 26 controls well-designed with standards alignment
**Action**: **KEEP and EXTEND**
- Keep existing 26 controls as universal control library
- Add 8 Qatar-specific controls from QATAR_CONTROL_ACTIVATION_RULES.md
- Add `qcb_required`, `qfcra_required` flags to each control

```typescript
// KEEP this structure, ADD new fields
interface Control {
  id: string
  name: string
  description: string
  bucket: ControlBucket
  // ADD these fields for Qatar
  qcb_required: boolean      // NEW: Required for QCB?
  qfcra_required: boolean     // NEW: Required for QFCRA?
  test_procedure?: string     // NEW: How to execute this control
  kri_tracked?: string[]      // NEW: Which KRIs this control affects
}
```

#### 2. Evidence Model (`src/lib/types.ts` - Evidence type)
**Current State**: Well-thought-out evidence model (mock data)
**Action**: **KEEP and IMPLEMENT**
- Evidence type structure is excellent
- Just needs actual database persistence
- Add retention calculation logic

```typescript
// KEEP this structure, ADD implementation
interface Evidence {
  id: string
  type: EvidenceType
  documentName: string
  uploadDate: string
  verifiedBy?: string
  // ADD these fields for Qatar
  regulator_id: string        // NEW: QCB or QFCRA
  retention_expiry: string    // NEW: Auto-calculated (10yr QCB, 6yr QFCRA)
  languages: string[]         // NEW: ['ar', 'en'] for bilingual
  blockchain_tx_id?: string   // NEW: Hedera VC anchor
}
```

#### 3. MCP/Graphiti Integration (`backend/app/services/graphiti_mcp_service.py`)
**Current State**: MCP integration working
**Action**: **KEEP and EXPAND**
- Keep MCP integration for knowledge graph
- Expand to index GRC entities (obligations, controls, SSB decisions)
- Use for Shariah precedent database

#### 4. Zustand Store (`src/lib/store.ts`)
**Current State**: Global state management working
**Action**: **KEEP and EXTEND**
- Keep existing workflow state
- Add new slices for GRC state (obligations, controls, compliance metrics)

#### 5. Component Library (`src/components/ui/`)
**Current State**: Radix UI components working
**Action**: **KEEP**
- Reuse all existing UI components (buttons, dialogs, accordions, etc.)
- Build new GRC-specific components on top of existing UI library

### ❌ REBUILD / ADD NEW (Missing Critical Functionality)

#### 1. Data Model (65% gap)
**Problem**: Missing 9 core GRC entities
**Action**: **ADD NEW** tables and models
- obligations
- control_tests
- ssb_members
- ssb_decisions
- sncr_incidents
- purification_journal
- reports
- report_generations
- risks

#### 2. Backend Services (100% gap for most)
**Problem**: No GRC services exist
**Action**: **ADD NEW** FastAPI services
- Obligations Service
- Control Execution Service
- SSB Governance Service
- SNCR Incident Service
- Regulatory Reporting Service

#### 3. Frontend Pages (Missing)
**Problem**: No GRC-specific pages
**Action**: **ADD NEW** pages
- `/obligations` - Obligations management
- `/controls` - Control execution and testing
- `/ssb` - SSB governance workflows
- `/sncr` - SNCR incident tracking
- `/reports` - Regulatory reporting
- `/compliance` - Compliance dashboard

---

## Database Schema Evolution

### Current Schema (Minimal)
```typescript
// Current demo has minimal persistence
// Mostly mock data in types.ts
```

### Target Schema (11 Core Tables)

**Migration Strategy**: Add tables incrementally across 4 sprints

#### Sprint 1: Foundation Tables

**1. obligations table** (NEW)
```sql
CREATE TABLE obligations (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    requirement TEXT NOT NULL,
    applicability VARCHAR(10)[] NOT NULL,  -- ['QCB'], ['QFCRA'], or ['QCB', 'QFCRA']
    category VARCHAR(50) NOT NULL,
    frequency VARCHAR(20) NOT NULL,
    evidence_required VARCHAR(100)[],
    related_controls VARCHAR(50)[],
    compliance_status VARCHAR(20),
    priority VARCHAR(10),
    source JSONB,
    effective_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_obligations_applicability ON obligations USING GIN(applicability);
CREATE INDEX idx_obligations_category ON obligations(category);
CREATE INDEX idx_obligations_priority ON obligations(priority);
```

**2. controls table** (MIGRATE from control-library.ts)
```sql
CREATE TABLE controls (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    bucket VARCHAR(50) NOT NULL,
    qcb_required BOOLEAN DEFAULT FALSE,
    qfcra_required BOOLEAN DEFAULT FALSE,
    test_procedure TEXT,
    evidence_types VARCHAR(100)[],
    kri_tracked VARCHAR(100)[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_controls_bucket ON controls(bucket);
CREATE INDEX idx_controls_qcb_required ON controls(qcb_required);
CREATE INDEX idx_controls_qfcra_required ON controls(qfcra_required);
```

**3. evidence table** (MIGRATE from types.ts mock)
```sql
CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(100) NOT NULL,
    document_name VARCHAR(500) NOT NULL,
    file_path TEXT NOT NULL,
    upload_date TIMESTAMP DEFAULT NOW(),
    verified_by VARCHAR(100),
    regulator_id VARCHAR(10) NOT NULL,  -- 'QCB' or 'QFCRA'
    retention_expiry DATE NOT NULL,
    languages VARCHAR(10)[] DEFAULT ARRAY['en'],
    blockchain_tx_id VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_evidence_regulator ON evidence(regulator_id);
CREATE INDEX idx_evidence_type ON evidence(type);
CREATE INDEX idx_evidence_retention_expiry ON evidence(retention_expiry);
```

**4. users table** (ADD for RBAC)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    role VARCHAR(50) NOT NULL,  -- 'ADMIN', 'COMPLIANCE_OFFICER', 'SSB_MEMBER', 'AUDITOR'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Sprint 2: SSB & SNCR Tables

**5. ssb_members table** (NEW)
```sql
CREATE TABLE ssb_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(200) NOT NULL,
    qualifications TEXT[],
    appointment_date DATE NOT NULL,
    term_end_date DATE,
    current_positions INTEGER DEFAULT 0,  -- Track for QCB max 3 rule
    is_independent BOOLEAN DEFAULT TRUE,
    conflict_of_interest_declared TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ssb_members_appointment_date ON ssb_members(appointment_date);
```

**6. ssb_decisions table** (NEW)
```sql
CREATE TABLE ssb_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_type VARCHAR(50) NOT NULL,  -- 'PRODUCT_APPROVAL', 'FATWA', 'POLICY_REVIEW'
    subject VARCHAR(500) NOT NULL,
    decision_date DATE NOT NULL,
    voting_record JSONB NOT NULL,  -- {member_id: 'APPROVE'|'REJECT'|'ABSTAIN'}
    decision_outcome VARCHAR(20) NOT NULL,  -- 'APPROVED', 'REJECTED', 'DEFERRED'
    dissents JSONB,
    fatwa_text TEXT,
    regulator_reported BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ssb_decisions_decision_date ON ssb_decisions(decision_date);
CREATE INDEX idx_ssb_decisions_decision_type ON ssb_decisions(decision_type);
```

**7. sncr_incidents table** (NEW)
```sql
CREATE TABLE sncr_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_date DATE NOT NULL,
    shariah_principle_violated TEXT NOT NULL,
    description TEXT NOT NULL,
    financial_impact DECIMAL(15, 2),
    root_cause TEXT,
    corrective_action TEXT,
    purification_required BOOLEAN DEFAULT FALSE,
    purification_completed BOOLEAN DEFAULT FALSE,
    reported_to_ssb BOOLEAN DEFAULT FALSE,
    reported_to_regulator BOOLEAN DEFAULT FALSE,
    regulator_id VARCHAR(10),
    status VARCHAR(20) DEFAULT 'OPEN',  -- 'OPEN', 'UNDER_REVIEW', 'PURIFIED', 'CLOSED'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sncr_incidents_incident_date ON sncr_incidents(incident_date);
CREATE INDEX idx_sncr_incidents_status ON sncr_incidents(status);
CREATE INDEX idx_sncr_incidents_purification_required ON sncr_incidents(purification_required);
```

**8. purification_journal table** (NEW)
```sql
CREATE TABLE purification_journal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID REFERENCES sncr_incidents(id),
    amount DECIMAL(15, 2) NOT NULL,
    beneficiary_name VARCHAR(200) NOT NULL,
    beneficiary_category VARCHAR(100),  -- 'CHARITY', 'ZAKAT_FUND', 'WAQF'
    donation_date DATE NOT NULL,
    proof_of_donation TEXT,  -- File path or description
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_purification_journal_incident_id ON purification_journal(incident_id);
CREATE INDEX idx_purification_journal_donation_date ON purification_journal(donation_date);
```

#### Sprint 3: Control Testing Tables

**9. control_tests table** (NEW)
```sql
CREATE TABLE control_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_id VARCHAR(50) REFERENCES controls(id),
    regulator_id VARCHAR(10) NOT NULL,
    test_date DATE NOT NULL,
    tested_by UUID REFERENCES users(id),
    test_procedure_followed TEXT,
    result VARCHAR(20) NOT NULL,  -- 'PASS', 'FAIL', 'PARTIAL'
    evidence_collected UUID[],  -- Array of evidence IDs
    kri_values JSONB,  -- {kri_name: value}
    findings TEXT,
    remediation_required BOOLEAN DEFAULT FALSE,
    remediation_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_control_tests_control_id ON control_tests(control_id);
CREATE INDEX idx_control_tests_test_date ON control_tests(test_date);
CREATE INDEX idx_control_tests_result ON control_tests(result);
```

**10. evidence_control_tests** (JOIN table - NEW)
```sql
CREATE TABLE evidence_control_tests (
    evidence_id UUID REFERENCES evidence(id),
    control_test_id UUID REFERENCES control_tests(id),
    PRIMARY KEY (evidence_id, control_test_id)
);

CREATE INDEX idx_ect_evidence_id ON evidence_control_tests(evidence_id);
CREATE INDEX idx_ect_control_test_id ON evidence_control_tests(control_test_id);
```

#### Sprint 4: Reporting Tables

**11. reports table** (NEW)
```sql
CREATE TABLE reports (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    regulator_id VARCHAR(10) NOT NULL,
    frequency VARCHAR(20) NOT NULL,  -- 'MONTHLY', 'QUARTERLY', 'ANNUAL', 'AD_HOC'
    due_date_rule VARCHAR(100),  -- e.g., "15th of following month"
    format VARCHAR(20),  -- 'PDF', 'EXCEL', 'XML'
    language VARCHAR(10)[] DEFAULT ARRAY['en'],
    template_path TEXT,
    data_requirements TEXT[],
    submission_method VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_regulator_id ON reports(regulator_id);
CREATE INDEX idx_reports_frequency ON reports(frequency);
```

**12. report_generations table** (NEW)
```sql
CREATE TABLE report_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(50) REFERENCES reports(id),
    regulator_id VARCHAR(10) NOT NULL,
    reporting_period_start DATE NOT NULL,
    reporting_period_end DATE NOT NULL,
    generated_at TIMESTAMP DEFAULT NOW(),
    generated_by UUID REFERENCES users(id),
    file_path TEXT NOT NULL,
    submitted BOOLEAN DEFAULT FALSE,
    submission_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_report_generations_report_id ON report_generations(report_id);
CREATE INDEX idx_report_generations_submitted ON report_generations(submitted);
```

---

## New Data Models Required

### Backend Models (Pydantic)

**Location**: `backend/app/models.py` (ADD to existing file)

```python
# backend/app/models.py

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from enum import Enum

# ============= ENUMS =============

class QatarRegulator(str, Enum):
    QCB = "QCB"
    QFCRA = "QFCRA"

class ObligationCategory(str, Enum):
    SSB_GOVERNANCE = "SSB_GOVERNANCE"
    SNCR_MANAGEMENT = "SNCR_MANAGEMENT"
    PRODUCT_APPROVAL = "PRODUCT_APPROVAL"
    RISK_MANAGEMENT = "RISK_MANAGEMENT"
    INTERNAL_CONTROLS = "INTERNAL_CONTROLS"
    REPORTING_DISCLOSURE = "REPORTING_DISCLOSURE"
    ACCOUNTING_STANDARDS = "ACCOUNTING_STANDARDS"
    # ... other categories

class Frequency(str, Enum):
    ONGOING = "ONGOING"
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    SEMI_ANNUAL = "SEMI_ANNUAL"
    ANNUAL = "ANNUAL"
    AD_HOC = "AD_HOC"

class Priority(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class ComplianceStatus(str, Enum):
    COMPLIANT = "COMPLIANT"
    NON_COMPLIANT = "NON_COMPLIANT"
    PARTIAL = "PARTIAL"
    PENDING = "PENDING"

class TestResult(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    PARTIAL = "PARTIAL"

class SNCRStatus(str, Enum):
    OPEN = "OPEN"
    UNDER_REVIEW = "UNDER_REVIEW"
    PURIFIED = "PURIFIED"
    CLOSED = "CLOSED"

# ============= OBLIGATION MODELS =============

class Obligation(BaseModel):
    id: str
    title: str
    requirement: str
    applicability: List[QatarRegulator]  # ['QCB'], ['QFCRA'], or both
    category: ObligationCategory
    frequency: Frequency
    evidence_required: List[str] = []
    related_controls: List[str] = []
    compliance_status: ComplianceStatus = ComplianceStatus.PENDING
    priority: Priority = Priority.MEDIUM
    source: Optional[Dict[str, str]] = None
    effective_date: Optional[date] = None

class ObligationCreate(BaseModel):
    title: str
    requirement: str
    applicability: List[QatarRegulator]
    category: ObligationCategory
    frequency: Frequency
    evidence_required: List[str] = []
    related_controls: List[str] = []
    priority: Priority = Priority.MEDIUM

class ObligationList(BaseModel):
    obligations: List[Obligation]
    total: int
    regulator_filter: Optional[QatarRegulator] = None

# ============= CONTROL MODELS =============

class Control(BaseModel):
    id: str
    name: str
    description: str
    bucket: str
    qcb_required: bool = False
    qfcra_required: bool = False
    test_procedure: Optional[str] = None
    evidence_types: List[str] = []
    kri_tracked: List[str] = []

class ControlActivation(BaseModel):
    control_id: str
    regulator_id: QatarRegulator
    required: bool

# ============= CONTROL TEST MODELS =============

class ControlTest(BaseModel):
    id: str
    control_id: str
    regulator_id: QatarRegulator
    test_date: date
    tested_by: str
    result: TestResult
    evidence_collected: List[str] = []
    kri_values: Optional[Dict[str, float]] = None
    findings: Optional[str] = None
    remediation_required: bool = False

class ControlTestCreate(BaseModel):
    control_id: str
    regulator_id: QatarRegulator
    test_procedure_followed: Optional[str] = None
    result: TestResult
    evidence_collected: List[str] = []
    findings: Optional[str] = None

# ============= SSB MODELS =============

class SSBMember(BaseModel):
    id: str
    full_name: str
    qualifications: List[str]
    appointment_date: date
    term_end_date: Optional[date] = None
    current_positions: int = 0
    is_independent: bool = True
    conflict_of_interest_declared: Optional[str] = None

class SSBMemberCreate(BaseModel):
    full_name: str
    qualifications: List[str]
    appointment_date: date
    term_end_date: Optional[date] = None
    is_independent: bool = True

class SSBDecision(BaseModel):
    id: str
    decision_type: str
    subject: str
    decision_date: date
    voting_record: Dict[str, str]  # {member_id: 'APPROVE'|'REJECT'|'ABSTAIN'}
    decision_outcome: str
    dissents: Optional[List[Dict[str, str]]] = None
    fatwa_text: Optional[str] = None
    regulator_reported: bool = False

class SSBDecisionCreate(BaseModel):
    decision_type: str
    subject: str
    voting_record: Dict[str, str]
    decision_outcome: str
    dissents: Optional[List[Dict[str, str]]] = None
    fatwa_text: Optional[str] = None

# ============= SNCR MODELS =============

class SNCRIncident(BaseModel):
    id: str
    incident_date: date
    shariah_principle_violated: str
    description: str
    financial_impact: Optional[float] = None
    root_cause: Optional[str] = None
    corrective_action: Optional[str] = None
    purification_required: bool = False
    purification_completed: bool = False
    reported_to_ssb: bool = False
    reported_to_regulator: bool = False
    regulator_id: Optional[QatarRegulator] = None
    status: SNCRStatus = SNCRStatus.OPEN

class SNCRIncidentCreate(BaseModel):
    incident_date: date
    shariah_principle_violated: str
    description: str
    financial_impact: Optional[float] = None
    root_cause: Optional[str] = None
    purification_required: bool = False

class PurificationJournal(BaseModel):
    id: str
    incident_id: str
    amount: float
    beneficiary_name: str
    beneficiary_category: str
    donation_date: date
    proof_of_donation: Optional[str] = None
    notes: Optional[str] = None

class PurificationCreate(BaseModel):
    incident_id: str
    amount: float
    beneficiary_name: str
    beneficiary_category: str
    donation_date: date
    proof_of_donation: Optional[str] = None

# ============= EVIDENCE MODELS =============

class Evidence(BaseModel):
    id: str
    type: str
    document_name: str
    file_path: str
    upload_date: datetime
    verified_by: Optional[str] = None
    regulator_id: QatarRegulator
    retention_expiry: date
    languages: List[str] = ["en"]
    blockchain_tx_id: Optional[str] = None

class EvidenceUpload(BaseModel):
    type: str
    document_name: str
    regulator_id: QatarRegulator
    # file will be uploaded separately via multipart/form-data

# ============= REPORT MODELS =============

class Report(BaseModel):
    id: str
    title: str
    regulator_id: QatarRegulator
    frequency: Frequency
    due_date_rule: Optional[str] = None
    format: str
    language: List[str] = ["en"]
    template_path: Optional[str] = None
    data_requirements: List[str] = []
    submission_method: str

class ReportGeneration(BaseModel):
    id: str
    report_id: str
    regulator_id: QatarRegulator
    reporting_period_start: date
    reporting_period_end: date
    generated_at: datetime
    generated_by: str
    file_path: str
    submitted: bool = False
    submission_date: Optional[datetime] = None

class ReportGenerateRequest(BaseModel):
    report_id: str
    regulator_id: QatarRegulator
    reporting_period_start: date
    reporting_period_end: date
```

### Frontend TypeScript Types

**Location**: `src/lib/types.ts` (ADD to existing file)

```typescript
// src/lib/types.ts

// ============= Qatar-specific types =============

export type QatarRegulator = 'QCB' | 'QFCRA'

export type ObligationCategory =
  | 'SSB_GOVERNANCE'
  | 'SNCR_MANAGEMENT'
  | 'PRODUCT_APPROVAL'
  | 'RISK_MANAGEMENT'
  | 'INTERNAL_CONTROLS'
  | 'REPORTING_DISCLOSURE'
  | 'ACCOUNTING_STANDARDS'
  | 'AUDIT_ASSURANCE'
  | 'LICENSING_REGISTRATION'
  | 'COMPLAINT_HANDLING'
  | 'TECHNOLOGY_SYSTEMS'
  | 'DOCUMENTATION_RECORDKEEPING'
  | 'TRAINING_COMPETENCE'
  | 'CUSTOMER_PROTECTION'
  | 'ANTI_MONEY_LAUNDERING'

export type Frequency =
  | 'ONGOING'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'SEMI_ANNUAL'
  | 'ANNUAL'
  | 'AD_HOC'

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'

export type ComplianceStatus =
  | 'COMPLIANT'
  | 'NON_COMPLIANT'
  | 'PARTIAL'
  | 'PENDING'

export type TestResult = 'PASS' | 'FAIL' | 'PARTIAL'

export type SNCRStatus = 'OPEN' | 'UNDER_REVIEW' | 'PURIFIED' | 'CLOSED'

// ============= Obligation =============

export interface Obligation {
  id: string
  title: string
  requirement: string
  applicability: QatarRegulator[]
  category: ObligationCategory
  frequency: Frequency
  evidenceRequired: string[]
  relatedControls: string[]
  complianceStatus: ComplianceStatus
  priority: Priority
  source?: Record<string, string>
  effectiveDate?: string
}

// ============= Control (EXTEND existing) =============

export interface Control {
  id: string
  name: string
  description: string
  bucket: string
  // ADD Qatar-specific fields
  qcbRequired: boolean
  qfcraRequired: boolean
  testProcedure?: string
  evidenceTypes: string[]
  kriTracked: string[]
}

// ============= Control Test =============

export interface ControlTest {
  id: string
  controlId: string
  regulatorId: QatarRegulator
  testDate: string
  testedBy: string
  result: TestResult
  evidenceCollected: string[]
  kriValues?: Record<string, number>
  findings?: string
  remediationRequired: boolean
}

// ============= SSB Member =============

export interface SSBMember {
  id: string
  fullName: string
  qualifications: string[]
  appointmentDate: string
  termEndDate?: string
  currentPositions: number
  isIndependent: boolean
  conflictOfInterestDeclared?: string
}

// ============= SSB Decision =============

export interface SSBDecision {
  id: string
  decisionType: string
  subject: string
  decisionDate: string
  votingRecord: Record<string, 'APPROVE' | 'REJECT' | 'ABSTAIN'>
  decisionOutcome: string
  dissents?: Array<{ memberId: string; reason: string }>
  fatwaText?: string
  regulatorReported: boolean
}

// ============= SNCR Incident =============

export interface SNCRIncident {
  id: string
  incidentDate: string
  shariahPrincipleViolated: string
  description: string
  financialImpact?: number
  rootCause?: string
  correctiveAction?: string
  purificationRequired: boolean
  purificationCompleted: boolean
  reportedToSSB: boolean
  reportedToRegulator: boolean
  regulatorId?: QatarRegulator
  status: SNCRStatus
}

// ============= Purification Journal =============

export interface PurificationJournal {
  id: string
  incidentId: string
  amount: number
  beneficiaryName: string
  beneficiaryCategory: string
  donationDate: string
  proofOfDonation?: string
  notes?: string
}

// ============= Evidence (EXTEND existing) =============

export interface Evidence {
  id: string
  type: string
  documentName: string
  filePath: string
  uploadDate: string
  verifiedBy?: string
  // ADD Qatar-specific fields
  regulatorId: QatarRegulator
  retentionExpiry: string
  languages: string[]
  blockchainTxId?: string
}

// ============= Report =============

export interface Report {
  id: string
  title: string
  regulatorId: QatarRegulator
  frequency: Frequency
  dueDateRule?: string
  format: string
  language: string[]
  templatePath?: string
  dataRequirements: string[]
  submissionMethod: string
}

export interface ReportGeneration {
  id: string
  reportId: string
  regulatorId: QatarRegulator
  reportingPeriodStart: string
  reportingPeriodEnd: string
  generatedAt: string
  generatedBy: string
  filePath: string
  submitted: boolean
  submissionDate?: string
}

// ============= Compliance Metrics =============

export interface ComplianceMetrics {
  regulatorId: QatarRegulator
  totalObligations: number
  compliantObligations: number
  nonCompliantObligations: number
  partialObligations: number
  pendingObligations: number
  compliancePercentage: number
  lastCalculated: string
}
```

---

## API Endpoint Additions

### Backend API Routes

**Create new routers** in `backend/app/api/`:

#### 1. Obligations Router (`backend/app/api/obligations.py` - NEW)

```python
# backend/app/api/obligations.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.database import get_db
from app.models import Obligation, ObligationCreate, QatarRegulator
from app.services.obligations_service import ObligationsService

router = APIRouter(prefix="/api/obligations", tags=["obligations"])

@router.get("/", response_model=List[Obligation])
async def list_obligations(
    regulator: Optional[QatarRegulator] = Query(None),
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_db)
):
    """List all obligations with optional filtering"""
    service = ObligationsService(session)
    return await service.list_obligations(
        regulator_filter=regulator,
        category_filter=category,
        priority_filter=priority
    )

@router.get("/{obligation_id}", response_model=Obligation)
async def get_obligation(
    obligation_id: str,
    session: AsyncSession = Depends(get_db)
):
    """Get single obligation by ID"""
    service = ObligationsService(session)
    return await service.get_obligation(obligation_id)

@router.post("/", response_model=Obligation)
async def create_obligation(
    obligation: ObligationCreate,
    session: AsyncSession = Depends(get_db)
):
    """Create new obligation (admin only)"""
    service = ObligationsService(session)
    return await service.create_obligation(obligation)

@router.get("/{obligation_id}/coverage")
async def get_obligation_coverage(
    obligation_id: str,
    session: AsyncSession = Depends(get_db)
):
    """Get evidence coverage for this obligation"""
    service = ObligationsService(session)
    return await service.get_coverage(obligation_id)
```

#### 2. Controls Router (`backend/app/api/controls.py` - NEW)

```python
# backend/app/api/controls.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_db
from app.models import Control, ControlTest, ControlTestCreate, QatarRegulator
from app.services.controls_service import ControlsService

router = APIRouter(prefix="/api/controls", tags=["controls"])

@router.get("/", response_model=List[Control])
async def list_controls(
    regulator: QatarRegulator = None,
    session: AsyncSession = Depends(get_db)
):
    """List all controls, optionally filtered by regulator"""
    service = ControlsService(session)
    return await service.list_controls(regulator_filter=regulator)

@router.post("/activate")
async def activate_controls(
    regulators: List[QatarRegulator],
    session: AsyncSession = Depends(get_db)
):
    """Activate controls for selected regulators"""
    service = ControlsService(session)
    return await service.activate_controls(regulators)

@router.post("/{control_id}/execute", response_model=ControlTest)
async def execute_control_test(
    control_id: str,
    test_data: ControlTestCreate,
    session: AsyncSession = Depends(get_db)
):
    """Execute a control test"""
    service = ControlsService(session)
    return await service.execute_test(control_id, test_data)

@router.get("/{control_id}/tests", response_model=List[ControlTest])
async def list_control_tests(
    control_id: str,
    session: AsyncSession = Depends(get_db)
):
    """List all test history for a control"""
    service = ControlsService(session)
    return await service.list_tests(control_id)
```

#### 3. SSB Router (`backend/app/api/ssb.py` - NEW)

```python
# backend/app/api/ssb.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_db
from app.models import SSBMember, SSBMemberCreate, SSBDecision, SSBDecisionCreate
from app.services.ssb_service import SSBService

router = APIRouter(prefix="/api/ssb", tags=["ssb"])

@router.post("/members", response_model=SSBMember)
async def add_ssb_member(
    member: SSBMemberCreate,
    session: AsyncSession = Depends(get_db)
):
    """Add new SSB member with position tracking"""
    service = SSBService(session)
    return await service.add_member(member)

@router.get("/members", response_model=List[SSBMember])
async def list_ssb_members(
    session: AsyncSession = Depends(get_db)
):
    """List all SSB members"""
    service = SSBService(session)
    return await service.list_members()

@router.post("/decisions", response_model=SSBDecision)
async def record_ssb_decision(
    decision: SSBDecisionCreate,
    session: AsyncSession = Depends(get_db)
):
    """Record SSB decision with voting"""
    service = SSBService(session)
    return await service.record_decision(decision)

@router.get("/decisions", response_model=List[SSBDecision])
async def list_ssb_decisions(
    session: AsyncSession = Depends(get_db)
):
    """List all SSB decisions"""
    service = SSBService(session)
    return await service.list_decisions()
```

#### 4. SNCR Router (`backend/app/api/sncr.py` - NEW)

```python
# backend/app/api/sncr.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_db
from app.models import SNCRIncident, SNCRIncidentCreate, PurificationJournal, PurificationCreate
from app.services.sncr_service import SNCRService

router = APIRouter(prefix="/api/sncr", tags=["sncr"])

@router.post("/incidents", response_model=SNCRIncident)
async def log_sncr_incident(
    incident: SNCRIncidentCreate,
    session: AsyncSession = Depends(get_db)
):
    """Log new SNCR incident"""
    service = SNCRService(session)
    return await service.log_incident(incident)

@router.get("/incidents", response_model=List[SNCRIncident])
async def list_sncr_incidents(
    status: str = None,
    session: AsyncSession = Depends(get_db)
):
    """List SNCR incidents with optional status filter"""
    service = SNCRService(session)
    return await service.list_incidents(status_filter=status)

@router.post("/purify", response_model=PurificationJournal)
async def execute_purification(
    purification: PurificationCreate,
    session: AsyncSession = Depends(get_db)
):
    """Execute purification for SNCR incident"""
    service = SNCRService(session)
    return await service.purify(purification)

@router.get("/purifications", response_model=List[PurificationJournal])
async def list_purifications(
    session: AsyncSession = Depends(get_db)
):
    """List all purification transactions"""
    service = SNCRService(session)
    return await service.list_purifications()
```

#### 5. Reports Router (`backend/app/api/reports.py` - NEW)

```python
# backend/app/api/reports.py

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.database import get_db
from app.models import Report, ReportGeneration, ReportGenerateRequest
from app.services.reporting_service import ReportingService

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/templates", response_model=List[Report])
async def list_report_templates(
    regulator: str = None,
    session: AsyncSession = Depends(get_db)
):
    """List all report templates"""
    service = ReportingService(session)
    return await service.list_templates(regulator_filter=regulator)

@router.post("/generate", response_model=ReportGeneration)
async def generate_report(
    request: ReportGenerateRequest,
    session: AsyncSession = Depends(get_db)
):
    """Generate report from template"""
    service = ReportingService(session)
    return await service.generate_report(request)

@router.get("/", response_model=List[ReportGeneration])
async def list_generated_reports(
    session: AsyncSession = Depends(get_db)
):
    """List all generated reports"""
    service = ReportingService(session)
    return await service.list_generated_reports()

@router.get("/{generation_id}/download")
async def download_report(
    generation_id: str,
    session: AsyncSession = Depends(get_db)
):
    """Download generated report file"""
    service = ReportingService(session)
    file_path = await service.get_file_path(generation_id)
    return FileResponse(file_path)
```

#### 6. Compliance Router (`backend/app/api/compliance.py` - NEW)

```python
# backend/app/api/compliance.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import QatarRegulator, ComplianceMetrics
from app.services.compliance_service import ComplianceService

router = APIRouter(prefix="/api/compliance", tags=["compliance"])

@router.get("/dashboard")
async def get_compliance_dashboard(
    session: AsyncSession = Depends(get_db)
):
    """Get overall compliance dashboard metrics"""
    service = ComplianceService(session)
    return await service.get_dashboard_metrics()

@router.get("/score")
async def get_compliance_score(
    regulator: QatarRegulator = None,
    session: AsyncSession = Depends(get_db)
):
    """Get compliance score by regulator"""
    service = ComplianceService(session)
    return await service.calculate_score(regulator)

@router.get("/kris")
async def get_kris(
    session: AsyncSession = Depends(get_db)
):
    """Get KRI time series data"""
    service = ComplianceService(session)
    return await service.get_kris()
```

---

## Frontend Component Changes

### Add New Pages

#### 1. Obligations Page (`src/app/obligations/page.tsx` - NEW)

```typescript
// src/app/obligations/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { backendClient } from '@/lib/backend-client'
import { Obligation, QatarRegulator } from '@/lib/types'
import { RegulatorySelector } from '@/components/regulatory-selector/RegulatorySelector'
import { ObligationsList } from '@/components/obligations/ObligationsList'
import { ObligationDetail } from '@/components/obligations/ObligationDetail'

export default function ObligationsPage() {
  const [selectedRegulators, setSelectedRegulators] = useState<QatarRegulator[]>([])
  const [obligations, setObligations] = useState<Obligation[]>([])
  const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(null)

  useEffect(() => {
    loadObligations()
  }, [selectedRegulators])

  async function loadObligations() {
    const data = await backendClient.get('/api/obligations', {
      params: { regulator: selectedRegulators[0] } // Filter by first selected regulator
    })
    setObligations(data)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Qatar Obligations Management</h1>

      <RegulatorySelector
        selected={selectedRegulators}
        onChange={setSelectedRegulators}
      />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <ObligationsList
          obligations={obligations}
          onSelect={setSelectedObligation}
        />

        {selectedObligation && (
          <ObligationDetail obligation={selectedObligation} />
        )}
      </div>
    </div>
  )
}
```

#### 2. Controls Page (`src/app/controls/page.tsx` - NEW)

```typescript
// src/app/controls/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { backendClient } from '@/lib/backend-client'
import { Control, ControlTest, QatarRegulator } from '@/lib/types'
import { RegulatorySelector } from '@/components/regulatory-selector/RegulatorySelector'
import { ControlsList } from '@/components/controls/ControlsList'
import { ControlTestForm } from '@/components/controls/ControlTestForm'
import { ControlTestHistory } from '@/components/controls/ControlTestHistory'

export default function ControlsPage() {
  const [selectedRegulators, setSelectedRegulators] = useState<QatarRegulator[]>([])
  const [controls, setControls] = useState<Control[]>([])
  const [selectedControl, setSelectedControl] = useState<Control | null>(null)
  const [tests, setTests] = useState<ControlTest[]>([])

  useEffect(() => {
    loadControls()
  }, [selectedRegulators])

  useEffect(() => {
    if (selectedControl) {
      loadControlTests(selectedControl.id)
    }
  }, [selectedControl])

  async function loadControls() {
    const data = await backendClient.get('/api/controls', {
      params: { regulator: selectedRegulators[0] }
    })
    setControls(data)
  }

  async function loadControlTests(controlId: string) {
    const data = await backendClient.get(`/api/controls/${controlId}/tests`)
    setTests(data)
  }

  async function executeTest(controlId: string, testData: any) {
    await backendClient.post(`/api/controls/${controlId}/execute`, testData)
    loadControlTests(controlId)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Control Execution & Testing</h1>

      <RegulatorySelector
        selected={selectedRegulators}
        onChange={setSelectedRegulators}
      />

      <div className="grid grid-cols-3 gap-6 mt-6">
        <ControlsList
          controls={controls}
          onSelect={setSelectedControl}
        />

        {selectedControl && (
          <>
            <ControlTestForm
              control={selectedControl}
              onSubmit={(testData) => executeTest(selectedControl.id, testData)}
            />
            <ControlTestHistory tests={tests} />
          </>
        )}
      </div>
    </div>
  )
}
```

#### 3. SSB Governance Page (`src/app/ssb/page.tsx` - NEW)

```typescript
// src/app/ssb/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { backendClient } from '@/lib/backend-client'
import { SSBMember, SSBDecision } from '@/lib/types'
import { SSBMembersList } from '@/components/ssb/SSBMembersList'
import { SSBMemberForm } from '@/components/ssb/SSBMemberForm'
import { SSBDecisionsList } from '@/components/ssb/SSBDecisionsList'
import { SSBDecisionForm } from '@/components/ssb/SSBDecisionForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SSBPage() {
  const [members, setMembers] = useState<SSBMember[]>([])
  const [decisions, setDecisions] = useState<SSBDecision[]>([])

  useEffect(() => {
    loadMembers()
    loadDecisions()
  }, [])

  async function loadMembers() {
    const data = await backendClient.get('/api/ssb/members')
    setMembers(data)
  }

  async function loadDecisions() {
    const data = await backendClient.get('/api/ssb/decisions')
    setDecisions(data)
  }

  async function addMember(memberData: any) {
    await backendClient.post('/api/ssb/members', memberData)
    loadMembers()
  }

  async function recordDecision(decisionData: any) {
    await backendClient.post('/api/ssb/decisions', decisionData)
    loadDecisions()
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">SSB Governance</h1>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">SSB Members</TabsTrigger>
          <TabsTrigger value="decisions">Decisions & Fatwas</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <div className="grid grid-cols-2 gap-6">
            <SSBMembersList members={members} />
            <SSBMemberForm onSubmit={addMember} />
          </div>
        </TabsContent>

        <TabsContent value="decisions">
          <div className="grid grid-cols-2 gap-6">
            <SSBDecisionsList decisions={decisions} />
            <SSBDecisionForm members={members} onSubmit={recordDecision} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

#### 4. SNCR Page (`src/app/sncr/page.tsx` - NEW)

```typescript
// src/app/sncr/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { backendClient } from '@/lib/backend-client'
import { SNCRIncident, PurificationJournal } from '@/lib/types'
import { SNCRIncidentDashboard } from '@/components/sncr/SNCRIncidentDashboard'
import { SNCRIncidentForm } from '@/components/sncr/SNCRIncidentForm'
import { PurificationForm } from '@/components/sncr/PurificationForm'

export default function SNCRPage() {
  const [incidents, setIncidents] = useState<SNCRIncident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<SNCRIncident | null>(null)

  useEffect(() => {
    loadIncidents()
  }, [])

  async function loadIncidents() {
    const data = await backendClient.get('/api/sncr/incidents')
    setIncidents(data)
  }

  async function logIncident(incidentData: any) {
    await backendClient.post('/api/sncr/incidents', incidentData)
    loadIncidents()
  }

  async function executePurification(purificationData: any) {
    await backendClient.post('/api/sncr/purify', purificationData)
    loadIncidents()
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">SNCR Incident Management</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <SNCRIncidentDashboard
            incidents={incidents}
            onSelect={setSelectedIncident}
          />
        </div>

        <div>
          <SNCRIncidentForm onSubmit={logIncident} />

          {selectedIncident && selectedIncident.purificationRequired && (
            <PurificationForm
              incident={selectedIncident}
              onSubmit={executePurification}
            />
          )}
        </div>
      </div>
    </div>
  )
}
```

#### 5. Compliance Dashboard (`src/app/compliance/page.tsx` - NEW)

```typescript
// src/app/compliance/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { backendClient } from '@/lib/backend-client'
import { QatarRegulator, ComplianceMetrics } from '@/lib/types'
import { RegulatorySelector } from '@/components/regulatory-selector/RegulatorySelector'
import { ComplianceScoreCard } from '@/components/compliance/ComplianceScoreCard'
import { ObligationSummary } from '@/components/compliance/ObligationSummary'
import { RecentSNCRIncidents } from '@/components/compliance/RecentSNCRIncidents'
import { KRIDashboard } from '@/components/compliance/KRIDashboard'

export default function CompliancePage() {
  const [selectedRegulators, setSelectedRegulators] = useState<QatarRegulator[]>([])
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null)

  useEffect(() => {
    loadComplianceMetrics()
  }, [selectedRegulators])

  async function loadComplianceMetrics() {
    const data = await backendClient.get('/api/compliance/dashboard')
    setMetrics(data)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Compliance Dashboard</h1>

      <RegulatorySelector
        selected={selectedRegulators}
        onChange={setSelectedRegulators}
      />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <ComplianceScoreCard metrics={metrics} />
        <ObligationSummary regulator={selectedRegulators[0]} />
        <RecentSNCRIncidents />
        <KRIDashboard />
      </div>
    </div>
  )
}
```

### Update Navigation (`src/components/layout/Navigation.tsx`)

```typescript
// src/components/layout/Navigation.tsx

// ADD new navigation items
const grcNavItems = [
  { href: '/obligations', label: 'Obligations' },
  { href: '/controls', label: 'Controls' },
  { href: '/ssb', label: 'SSB Governance' },
  { href: '/sncr', label: 'SNCR' },
  { href: '/evidence', label: 'Evidence' },
  { href: '/reports', label: 'Reports' },
  { href: '/compliance', label: 'Compliance Dashboard' },
]

// Add to navigation component
```

### Update Zustand Store (`src/lib/store.ts`)

```typescript
// src/lib/store.ts

import { create } from 'zustand'
import { Obligation, Control, QatarRegulator, ComplianceMetrics } from './types'

interface GRCStore {
  // Regulatory selector
  selectedRegulators: QatarRegulator[]
  setRegulators: (regulators: QatarRegulator[]) => void

  // Obligations
  obligations: Obligation[]
  filteredObligations: Obligation[]
  loadObligations: () => Promise<void>

  // Controls
  controls: Control[]
  activeControls: Control[]
  loadControls: () => Promise<void>

  // Compliance metrics
  complianceMetrics: ComplianceMetrics | null
  loadComplianceMetrics: () => Promise<void>
}

export const useGRCStore = create<GRCStore>((set, get) => ({
  // Initial state
  selectedRegulators: [],
  obligations: [],
  filteredObligations: [],
  controls: [],
  activeControls: [],
  complianceMetrics: null,

  // Actions
  setRegulators: (regulators) => {
    set({ selectedRegulators: regulators })
    // Reload data when regulators change
    get().loadObligations()
    get().loadControls()
    get().loadComplianceMetrics()
  },

  loadObligations: async () => {
    const { selectedRegulators } = get()
    const response = await fetch(`/api/obligations?regulator=${selectedRegulators[0]}`)
    const obligations = await response.json()
    set({ obligations, filteredObligations: obligations })
  },

  loadControls: async () => {
    const { selectedRegulators } = get()
    const response = await fetch(`/api/controls?regulator=${selectedRegulators[0]}`)
    const controls = await response.json()
    // Filter to active controls for selected regulators
    const activeControls = controls.filter((c: Control) =>
      selectedRegulators.some(reg =>
        (reg === 'QCB' && c.qcbRequired) || (reg === 'QFCRA' && c.qfcraRequired)
      )
    )
    set({ controls, activeControls })
  },

  loadComplianceMetrics: async () => {
    const { selectedRegulators } = get()
    const response = await fetch(`/api/compliance/score?regulator=${selectedRegulators[0]}`)
    const metrics = await response.json()
    set({ complianceMetrics: metrics })
  },
}))
```

---

## Service Layer Additions

### Create New Services

**Location**: `backend/app/services/`

#### 1. Obligations Service (`backend/app/services/obligations_service.py` - NEW)

```python
# backend/app/services/obligations_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional
from app.models import Obligation, ObligationCreate, QatarRegulator
from app.models.database import ObligationDB  # SQLAlchemy model

class ObligationsService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_obligations(
        self,
        regulator_filter: Optional[QatarRegulator] = None,
        category_filter: Optional[str] = None,
        priority_filter: Optional[str] = None
    ) -> List[Obligation]:
        """List obligations with optional filters"""
        query = select(ObligationDB)

        if regulator_filter:
            query = query.where(ObligationDB.applicability.contains([regulator_filter]))

        if category_filter:
            query = query.where(ObligationDB.category == category_filter)

        if priority_filter:
            query = query.where(ObligationDB.priority == priority_filter)

        result = await self.session.execute(query)
        obligations_db = result.scalars().all()

        return [self._to_pydantic(obl) for obl in obligations_db]

    async def get_obligation(self, obligation_id: str) -> Obligation:
        """Get single obligation by ID"""
        result = await self.session.execute(
            select(ObligationDB).where(ObligationDB.id == obligation_id)
        )
        obligation_db = result.scalar_one()
        return self._to_pydantic(obligation_db)

    async def create_obligation(self, obligation: ObligationCreate) -> Obligation:
        """Create new obligation"""
        obligation_db = ObligationDB(**obligation.dict())
        self.session.add(obligation_db)
        await self.session.commit()
        await self.session.refresh(obligation_db)
        return self._to_pydantic(obligation_db)

    async def get_coverage(self, obligation_id: str):
        """Get evidence coverage for this obligation"""
        # Query evidence linked to this obligation
        # Return coverage percentage
        pass

    def _to_pydantic(self, db_model: ObligationDB) -> Obligation:
        """Convert SQLAlchemy model to Pydantic"""
        return Obligation(**db_model.__dict__)
```

#### 2. Controls Service (`backend/app/services/controls_service.py` - NEW)

```python
# backend/app/services/controls_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.models import Control, ControlTest, ControlTestCreate, QatarRegulator
from app.models.database import ControlDB, ControlTestDB
from datetime import date

class ControlsService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_controls(
        self,
        regulator_filter: Optional[QatarRegulator] = None
    ) -> List[Control]:
        """List controls, optionally filtered by regulator"""
        query = select(ControlDB)

        if regulator_filter:
            if regulator_filter == QatarRegulator.QCB:
                query = query.where(ControlDB.qcb_required == True)
            elif regulator_filter == QatarRegulator.QFCRA:
                query = query.where(ControlDB.qfcra_required == True)

        result = await self.session.execute(query)
        controls_db = result.scalars().all()

        return [self._to_pydantic(ctrl) for ctrl in controls_db]

    async def activate_controls(self, regulators: List[QatarRegulator]):
        """Activate controls for selected regulators"""
        # Return list of controls that should be active
        # based on regulator selection
        pass

    async def execute_test(
        self,
        control_id: str,
        test_data: ControlTestCreate
    ) -> ControlTest:
        """Execute a control test"""
        test_db = ControlTestDB(
            control_id=control_id,
            test_date=date.today(),
            **test_data.dict()
        )
        self.session.add(test_db)
        await self.session.commit()
        await self.session.refresh(test_db)

        # Calculate KRIs if applicable
        await self._calculate_kris(test_db)

        return self._test_to_pydantic(test_db)

    async def list_tests(self, control_id: str) -> List[ControlTest]:
        """List all tests for a control"""
        result = await self.session.execute(
            select(ControlTestDB).where(ControlTestDB.control_id == control_id)
        )
        tests_db = result.scalars().all()
        return [self._test_to_pydantic(t) for t in tests_db]

    async def _calculate_kris(self, test: ControlTestDB):
        """Calculate KRI values based on test result"""
        # Implement KRI calculation logic
        pass

    def _to_pydantic(self, db_model: ControlDB) -> Control:
        return Control(**db_model.__dict__)

    def _test_to_pydantic(self, db_model: ControlTestDB) -> ControlTest:
        return ControlTest(**db_model.__dict__)
```

#### 3. SSB Service (`backend/app/services/ssb_service.py` - NEW)

```python
# backend/app/services/ssb_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.models import SSBMember, SSBMemberCreate, SSBDecision, SSBDecisionCreate
from app.models.database import SSBMemberDB, SSBDecisionDB

class SSBService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_member(self, member: SSBMemberCreate) -> SSBMember:
        """Add new SSB member with position tracking"""
        # Check QCB position limit (max 3)
        # Validate independence criteria
        member_db = SSBMemberDB(**member.dict())
        self.session.add(member_db)
        await self.session.commit()
        await self.session.refresh(member_db)
        return self._member_to_pydantic(member_db)

    async def list_members(self) -> List[SSBMember]:
        """List all SSB members"""
        result = await self.session.execute(select(SSBMemberDB))
        members_db = result.scalars().all()
        return [self._member_to_pydantic(m) for m in members_db]

    async def record_decision(self, decision: SSBDecisionCreate) -> SSBDecision:
        """Record SSB decision with voting"""
        decision_db = SSBDecisionDB(**decision.dict())
        self.session.add(decision_db)
        await self.session.commit()
        await self.session.refresh(decision_db)
        return self._decision_to_pydantic(decision_db)

    async def list_decisions(self) -> List[SSBDecision]:
        """List all SSB decisions"""
        result = await self.session.execute(select(SSBDecisionDB))
        decisions_db = result.scalars().all()
        return [self._decision_to_pydantic(d) for d in decisions_db]

    def _member_to_pydantic(self, db_model: SSBMemberDB) -> SSBMember:
        return SSBMember(**db_model.__dict__)

    def _decision_to_pydantic(self, db_model: SSBDecisionDB) -> SSBDecision:
        return SSBDecision(**db_model.__dict__)
```

#### 4. SNCR Service (`backend/app/services/sncr_service.py` - NEW)

```python
# backend/app/services/sncr_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.models import SNCRIncident, SNCRIncidentCreate, PurificationJournal, PurificationCreate
from app.models.database import SNCRIncidentDB, PurificationJournalDB

class SNCRService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def log_incident(self, incident: SNCRIncidentCreate) -> SNCRIncident:
        """Log new SNCR incident"""
        incident_db = SNCRIncidentDB(**incident.dict())
        self.session.add(incident_db)
        await self.session.commit()
        await self.session.refresh(incident_db)

        # Auto-flag for SSB/regulator reporting if material
        await self._check_materiality(incident_db)

        return self._incident_to_pydantic(incident_db)

    async def list_incidents(
        self,
        status_filter: Optional[str] = None
    ) -> List[SNCRIncident]:
        """List SNCR incidents with optional status filter"""
        query = select(SNCRIncidentDB)

        if status_filter:
            query = query.where(SNCRIncidentDB.status == status_filter)

        result = await self.session.execute(query)
        incidents_db = result.scalars().all()
        return [self._incident_to_pydantic(i) for i in incidents_db]

    async def purify(self, purification: PurificationCreate) -> PurificationJournal:
        """Execute purification for SNCR incident"""
        # Record purification
        purif_db = PurificationJournalDB(**purification.dict())
        self.session.add(purif_db)

        # Update incident status
        result = await self.session.execute(
            select(SNCRIncidentDB).where(SNCRIncidentDB.id == purification.incident_id)
        )
        incident_db = result.scalar_one()
        incident_db.purification_completed = True
        incident_db.status = 'PURIFIED'

        await self.session.commit()
        await self.session.refresh(purif_db)
        return self._purification_to_pydantic(purif_db)

    async def list_purifications(self) -> List[PurificationJournal]:
        """List all purification transactions"""
        result = await self.session.execute(select(PurificationJournalDB))
        purifs_db = result.scalars().all()
        return [self._purification_to_pydantic(p) for p in purifs_db]

    async def _check_materiality(self, incident: SNCRIncidentDB):
        """Check if incident requires SSB/regulator reporting"""
        # Implement materiality threshold logic
        # e.g., >$10K or >1% of income
        pass

    def _incident_to_pydantic(self, db_model: SNCRIncidentDB) -> SNCRIncident:
        return SNCRIncident(**db_model.__dict__)

    def _purification_to_pydantic(self, db_model: PurificationJournalDB) -> PurificationJournal:
        return PurificationJournal(**db_model.__dict__)
```

---

## Migration Path (Phased Approach)

### Phase 0: Preparation (Week 0)

**Objective**: Set up infrastructure without disrupting current demo

**Tasks**:
1. ✅ Create new database (separate from current demo data)
2. ✅ Add new FastAPI routers alongside existing ones
3. ✅ Add new frontend pages (separate from current workflow pages)
4. ✅ Seed Qatar obligations and controls from research documents

**No disruption to current demo** - New GRC modules run in parallel

### Phase 1: Foundation (Weeks 1-2)

**Objective**: Add obligations, controls, evidence management

**Backend**:
- ✅ Implement Obligations Service + API
- ✅ Implement Controls Service + API
- ✅ Implement Evidence Service + API (migrate mock evidence to DB)
- ✅ Add JWT authentication

**Frontend**:
- ✅ Build `/obligations` page
- ✅ Build `/controls` page
- ✅ Build Regulatory Selector component
- ✅ Update navigation to include GRC pages

**Migration**: Evidence model transitions from mock (`types.ts`) to DB-backed

### Phase 2: SSB & SNCR (Weeks 3-4)

**Objective**: Add Shariah governance and non-compliance workflows

**Backend**:
- ✅ Implement SSB Service + API
- ✅ Implement SNCR Service + API
- ✅ Add workflow engine (simple state machine)

**Frontend**:
- ✅ Build `/ssb` page
- ✅ Build `/sncr` page
- ✅ Add SSB approval workflow UI

**No migration needed** - Entirely new functionality

### Phase 3: Control Execution & Evidence Linking (Weeks 5-6)

**Objective**: Make controls executable with evidence collection

**Backend**:
- ✅ Implement control test execution
- ✅ Add evidence → control test → obligation linking
- ✅ Implement KRI calculation
- ✅ Expand Graphiti integration to index GRC entities

**Frontend**:
- ✅ Add control test form
- ✅ Build evidence linking UI
- ✅ Create KRI dashboard

**Migration**: Control library (`control-library.ts`) → DB with Qatar activation rules

### Phase 4: Reporting & Compliance Dashboard (Weeks 7-8)

**Objective**: Enable regulatory reporting and compliance monitoring

**Backend**:
- ✅ Implement Reporting Service + API
- ✅ Add PDF/bilingual report generation
- ✅ Implement Compliance Service (scoring, metrics)

**Frontend**:
- ✅ Build `/reports` page
- ✅ Build `/compliance` dashboard
- ✅ Add compliance metrics visualization

**Migration**: Integrate with existing workflow system (reuse generated documents as evidence)

### Post-MVP: Deprecate Old Workflow System (Weeks 9+)

**Objective**: Gradually replace workflow-based system with GRC-native workflows

**Strategy**:
- Keep existing `/workflow` pages for backward compatibility
- Add "Migrate to GRC" button on old workflow pages
- Gradually transition users to new GRC pages
- Eventually deprecate old workflow system once all features replicated

---

## Code Changes by File

### Changes to Existing Files

#### 1. `src/lib/types.ts`

```typescript
// BEFORE: Mock evidence
export interface Evidence {
  id: string
  type: EvidenceType
  documentName: string
  uploadDate: string
  verifiedBy?: string
}

// AFTER: Add Qatar-specific fields
export interface Evidence {
  id: string
  type: EvidenceType
  documentName: string
  uploadDate: string
  verifiedBy?: string
  // ADD Qatar fields
  regulatorId: QatarRegulator      // NEW
  retentionExpiry: string           // NEW
  languages: string[]               // NEW
  blockchainTxId?: string           // NEW
}
```

#### 2. `src/lib/control-library.ts`

```typescript
// BEFORE: Universal controls only
export const CONTROL_LIBRARY = [
  {
    id: 'CTRL-001',
    name: 'SSB Independence Validation',
    description: '...',
    bucket: 'SHARIAH_GOVERNANCE'
  },
  // ... 25 more
]

// AFTER: Add Qatar activation flags
export const CONTROL_LIBRARY = [
  {
    id: 'CTRL-001',
    name: 'SSB Independence Validation',
    description: '...',
    bucket: 'SHARIAH_GOVERNANCE',
    // ADD Qatar flags
    qcbRequired: true,              // NEW
    qfcraRequired: true,            // NEW
    testProcedure: '...',           // NEW
    evidenceTypes: ['SSB_INDEPENDENCE_DECLARATION'],  // NEW
    kriTracked: ['ssb_conflict_count']  // NEW
  },
  // ... 25 more existing + 8 new Qatar-specific controls
]
```

#### 3. `backend/app/main.py`

```python
# ADD new routers
from app.api import obligations, controls, ssb, sncr, reports, compliance

# Register new routers
app.include_router(obligations.router)
app.include_router(controls.router)
app.include_router(ssb.router)
app.include_router(sncr.router)
app.include_router(reports.router)
app.include_router(compliance.router)
```

#### 4. `src/components/layout/Navigation.tsx`

```typescript
// ADD GRC navigation section
const navItems = [
  // Existing items
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/workflow', label: 'Workflow' },

  // NEW: GRC section
  { section: 'GRC Compliance' },
  { href: '/obligations', label: 'Obligations' },
  { href: '/controls', label: 'Controls' },
  { href: '/ssb', label: 'SSB Governance' },
  { href: '/sncr', label: 'SNCR' },
  { href: '/evidence', label: 'Evidence' },
  { href: '/reports', label: 'Reports' },
  { href: '/compliance', label: 'Compliance Dashboard' },
]
```

---

## Implementation Checklist

### Sprint 0: Preparation ✅

- [ ] Create new PostgreSQL database (or schema)
- [ ] Add database connection config
- [ ] Create `backend/app/models/database.py` with SQLAlchemy models
- [ ] Create Alembic migration for initial schema
- [ ] Seed 60 Qatar obligations from `QATAR_UNIFIED_OBLIGATIONS_REGISTER.md`
- [ ] Seed 34 controls from `QATAR_CONTROL_ACTIVATION_RULES.md`
- [ ] Test database connection and seed data

### Sprint 1: Foundation ✅

**Backend**:
- [ ] Create `backend/app/services/obligations_service.py`
- [ ] Create `backend/app/api/obligations.py`
- [ ] Create `backend/app/services/controls_service.py`
- [ ] Create `backend/app/api/controls.py`
- [ ] Migrate evidence to database-backed (update Evidence service)
- [ ] Implement JWT authentication
- [ ] Test all endpoints with Postman/curl

**Frontend**:
- [ ] Create `src/components/regulatory-selector/RegulatorySelector.tsx`
- [ ] Create `src/app/obligations/page.tsx`
- [ ] Create `src/components/obligations/ObligationsList.tsx`
- [ ] Create `src/components/obligations/ObligationDetail.tsx`
- [ ] Create `src/app/controls/page.tsx`
- [ ] Create `src/components/controls/ControlsList.tsx`
- [ ] Update navigation with GRC pages
- [ ] Update Zustand store with GRC state

### Sprint 2: SSB & SNCR ✅

**Backend**:
- [ ] Create `backend/app/services/ssb_service.py`
- [ ] Create `backend/app/api/ssb.py`
- [ ] Create `backend/app/services/sncr_service.py`
- [ ] Create `backend/app/api/sncr.py`
- [ ] Implement basic workflow state machine
- [ ] Test SSB workflows end-to-end

**Frontend**:
- [ ] Create `src/app/ssb/page.tsx`
- [ ] Create `src/components/ssb/` components
- [ ] Create `src/app/sncr/page.tsx`
- [ ] Create `src/components/sncr/` components
- [ ] Test SSB → SNCR → Purification workflow

### Sprint 3: Control Execution ✅

**Backend**:
- [ ] Implement control test execution in Controls Service
- [ ] Add evidence → control test → obligation linking
- [ ] Implement KRI calculation logic
- [ ] Expand Graphiti MCP integration for GRC entities
- [ ] Test control execution with evidence

**Frontend**:
- [ ] Create `src/components/controls/ControlTestForm.tsx`
- [ ] Create `src/components/controls/ControlTestHistory.tsx`
- [ ] Create evidence linking UI
- [ ] Create KRI dashboard
- [ ] Test control → evidence → KRI flow

### Sprint 4: Reporting & Dashboard ✅

**Backend**:
- [ ] Create `backend/app/services/reporting_service.py`
- [ ] Create `backend/app/api/reports.py`
- [ ] Implement PDF generation (bilingual for QCB)
- [ ] Create `backend/app/services/compliance_service.py`
- [ ] Create `backend/app/api/compliance.py`
- [ ] Implement compliance scoring algorithm
- [ ] Test report generation for all 3 MVP reports

**Frontend**:
- [ ] Create `src/app/reports/page.tsx`
- [ ] Create `src/app/compliance/page.tsx`
- [ ] Create `src/components/compliance/ComplianceScoreCard.tsx`
- [ ] Create `src/components/compliance/KRIDashboard.tsx`
- [ ] Test compliance dashboard end-to-end

---

## Conclusion

This alignment plan provides a **concrete roadmap** to evolve the current demo (24% GRC ready) into a Qatar-compliant GRC system (100%) by:

✅ **Preserving** valuable existing work (control library, evidence model, MCP integration)
✅ **Adding** missing core functionality (obligations, SSB, SNCR, reports) incrementally
✅ **Migrating** mock data to database-backed persistence
✅ **Running in parallel** with existing workflow system (no disruption)
✅ **Following Qatar MVP plan** (8 weeks, 4 sprints)

**Key Strategy**: **Incremental Evolution** - Not a complete rewrite, but systematic addition of GRC modules alongside existing system, with gradual migration.

**Next Action**: Review this plan, then begin Sprint 0 (database setup + seed data) 🚀

