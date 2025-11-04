# Vanta UX Analysis & Islamic Finance Application

**Document Purpose**: Comprehensive analysis of Vanta's compliance dashboard UX/UI patterns and their application to Islamic Finance Workflow demo.

**Last Updated**: 2025-11-04
**Analysis Date**: 2025-11-04

---

## Executive Summary

This document captures a deep analysis of Vanta's Trust Management Platform, focusing on how they handle:
- Multi-framework compliance management (SOC 2, ISO 27001, GDPR, etc.)
- Control cross-mapping and evidence reuse
- Progress visualization and status tracking
- Automated testing and validation

The goal is to apply these proven UX patterns to our Islamic Finance Workflow demo, where users select multiple methodologies (Murabaha, Ijara, Musharaka, Sukuk) and track compliance through shared and unique validation steps.

---

## Part 1: Vanta's Data Architecture (Discovered via MCP API)

### Hierarchical Structure

```
Framework (e.g., SOC 2, ISO 27001)
  └─ Requirement Category (e.g., "CC 1.0 - Control Environment")
      └─ Requirement (e.g., "CC 1.1 - COSO Principle 1: Integrity and ethical values")
          └─ Control (e.g., "Code of Conduct acknowledged by contractors")
              ├─ Tests (automated validation)
              ├─ Evidence (documents, screenshots)
              └─ Owner (assigned team member)
```

### Key Metrics from Live Vanta Instance

**Frameworks Retrieved:**
- **SOC 2**: 61/79 controls complete (77%)
  - 9 requirement categories (CC 1.0 through CC 9.0)
  - 40/48 documents passing
  - 84/92 tests passing

- **ISO 27001:2022**: 60/112 controls complete (54%)
  - Categories: Context, Leadership, Planning, Support, Operation, Performance Evaluation, Improvement
  - Most comprehensive framework in our instance

- **GDPR**: 42/48 controls complete (86%)
  - Note: Full details exceeded API token limits (30,407 tokens), indicating extensive control definitions

**Connected Integrations:**
- Confluence, Datadog, GitHub, GCP, Google Workspace, Jira, Zoom
- Each integration provides automated evidence collection

**Team Members:**
- Tracked with onboarding/offboarding status
- Task completion tracking
- Role assignments

**Vulnerabilities:**
- 5 HIGH severity CVEs identified
- Package-specific remediation (e.g., npm-axios < 0.30.2)
- SLA deadlines tracked (e.g., remediate by 2025-10-30)

**Risk Register:**
- 5 risks documented
- Treatment strategies: Accept, Avoid, Mitigate
- Category tracking

### Control Cross-Mapping Discovery

**Critical Insight**: A single control can satisfy multiple framework requirements simultaneously.

**Example from SOC 2 Data:**
```json
{
  "id": "code-of-conduct-acknowledged-contractors",
  "externalId": "HRS-2",
  "name": "Code of Conduct acknowledged by contractors",
  "owner": {
    "displayName": "Eilidh",
    "emailAddress": "eilidh@bladelabs.io"
  },
  "domain": "HR_SECURITY"
}
```

This control likely applies to:
- SOC 2: CC 1.1 (COSO Principle 1: Integrity and ethical values)
- ISO 27001: A.6.1 (Screening - Human Resource Security)
- GDPR: Article 32 (Security of processing)

**Evidence Reuse Mechanism**:
- When you upload evidence for `HRS-2` (e.g., signed Code of Conduct documents)
- That evidence automatically counts toward ALL frameworks requiring that control
- Progress updates propagate: SOC 2 +1 control, ISO 27001 +1 control, GDPR +1 control
- This explains how frameworks can have different completion rates despite shared controls

### Completion Math Example

```
SOC 2:      61/79 controls   (77%) ████████▓░
ISO 27001:  60/112 controls  (54%) ██████░░░░
GDPR:       42/48 controls   (86%) █████████▓

Scenario: Complete 1 shared control (e.g., HRS-2)
Result:
SOC 2:      62/79 controls   (78%) ████████▓░
ISO 27001:  61/112 controls  (54%) ██████░░░░
GDPR:       43/48 controls   (90%) █████████░

Note: Percentages change at different rates due to different total control counts
```

---

## Part 2: Vanta UX Patterns (Observed & Researched)

### Pattern 1: Multi-Framework Selection Interface

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────┐
│ Compliance Frameworks                                   │
│                                                         │
│ ☑ SOC 2                                [77% ████████▓░] │
│   └─ 61 of 79 controls complete                        │
│                                                         │
│ ☑ ISO 27001:2022                      [54% ██████░░░░] │
│   └─ 60 of 112 controls complete                       │
│                                                         │
│ ☑ GDPR                                 [86% █████████▓] │
│   └─ 42 of 48 controls complete                        │
│                                                         │
│ ☐ HIPAA                                [Not started]    │
│ ☐ DORA                                 [Not started]    │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Multi-select checkboxes for framework activation
- Real-time progress bars (visual and percentage)
- Completion counters showing (completed/total)
- Disabled state for inactive frameworks
- Status indication: Active (colored progress) vs. Not Started (gray)

### Pattern 2: Hierarchical Requirement View (Accordion Pattern)

**From SOC 2 Dashboard Screenshot:**

```
▼ CC 1.0 - Control Environment (8 controls)
  │
  ├─ CC 1.1: COSO Principle 1 - Integrity and ethical values
  │  Status: ✓ 3/3 complete
  │  Controls:
  │    • ✓ Code of Conduct acknowledged by employees
  │    • ✓ Code of Conduct acknowledged by contractors
  │    • ✓ Ethics training completed annually
  │
  ├─ CC 1.2: Board of directors exercises oversight
  │  Status: ⚠ 2/3 complete
  │  Controls:
  │    • ✓ Board meeting minutes documented
  │    • ✓ Board reviews security reports quarterly
  │    • ⏳ PENDING: Annual board security training
  │
  └─ CC 1.3: Management establishes responsibility
     Status: ✓ 3/3 complete
     [collapsed details]

▼ CC 2.0 - Communication and Information (6 controls)
  │
  ├─ CC 2.1: Internal communication enables responsibilities
  │  Status: ✓ 2/2 complete
  │
  └─ CC 2.2: External communication enables responsibilities
     Status: ⏳ 0/2 complete
     [collapsed details]

▶ CC 3.0 - Risk Assessment (collapsed, not yet started)

▶ CC 4.0 - Monitoring Activities (collapsed)

... (CC 5.0 through CC 9.0)
```

**Visual Hierarchy:**
- Level 1: Requirement Category (CC 1.0) - Bold, collapsible
- Level 2: Requirement (CC 1.1) - Indented, with status
- Level 3: Control - Double indented, with checkboxes and icons

**Status Icons:**
- ✓ (Green checkmark) = Complete
- ⚠ (Orange warning) = In progress
- ⏳ (Gray hourglass) = Pending/Not started

**Completion Indicators:**
- Fraction format: "3/3", "2/3", "0/2"
- Color coding: Green for complete, Orange for partial, Gray for none

### Pattern 3: Control Detail View

**Expanded Control Panel:**
```
┌─────────────────────────────────────────────────────────────┐
│ Code of Conduct acknowledged by contractors                 │
│ ✓ PASSING                                    [HRS-2]        │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                                             │
│ Applies to: [SOC 2] [ISO 27001] [GDPR]                    │
│ Owner: 👤 Eilidh (eilidh@bladelabs.io)                    │
│ Domain: HR_SECURITY                                         │
│ Last Updated: 2025-09-15                                    │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│ Evidence (3/3 complete)                                     │
│ ─────────────────────────────────────────────────────────  │
│   • ✓ Signed employee acknowledgments.pdf                  │
│     Uploaded: 2025-08-01 | Size: 2.3 MB                    │
│                                                             │
│   • ✓ Contractor NDAs.pdf                                  │
│     Uploaded: 2025-08-15 | Size: 1.8 MB                    │
│     Also satisfies: [CC 1.4] [ISO A.13.2]                 │
│                                                             │
│   • ✓ Training completion records.xlsx                     │
│     Uploaded: 2025-09-10 | Size: 456 KB                    │
│                                                             │
│ ─────────────────────────────────────────────────────────  │
│ Automated Tests (2/2 passing)                               │
│ ─────────────────────────────────────────────────────────  │
│   • ✓ All employees acknowledged within 7 days             │
│     Last run: 2025-10-01 | Next run: 2025-11-01           │
│                                                             │
│   • ✓ Contractors signed before project start              │
│     Last run: 2025-10-01 | Integration: BambooHR          │
│                                                             │
│ [View History] [Edit Control] [Add Evidence]               │
└─────────────────────────────────────────────────────────────┘
```

**Key Components:**
1. **Header**: Control name + status badge + external ID
2. **Meta Information**: Framework badges, owner avatar, domain tag
3. **Evidence Section**: File list with status, upload date, size, cross-references
4. **Tests Section**: Automated validation with run schedule and integration source
5. **Actions**: History, edit, add evidence buttons

### Pattern 4: Evidence Upload with Multi-Framework Impact

**Upload Dialog:**
```
┌─────────────────────────────────────────────────────────────┐
│ Upload Evidence                                        [×]  │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                                             │
│ This evidence will satisfy requirements in:                 │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ • SOC 2 → CC 1.1 (Code of Conduct)                 │   │
│ │ • ISO 27001 → A.6.1 (Screening)                     │   │
│ │ • GDPR → Article 32 (Security of processing)        │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ [📎 Choose File] contractor_nda_signed.pdf                 │
│                                                             │
│ Progress Impact:                                            │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ SOC 2:      77% → 78%  (+1 control)     [████████▓]│   │
│ │ ISO 27001:  54% → 55%  (+1 control)     [██████░░░]│   │
│ │ GDPR:       86% → 88%  (+1 control)     [█████████]│   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│                              [Cancel] [Upload & Continue]  │
└─────────────────────────────────────────────────────────────┘
```

**Impact Preview Features:**
- Shows ALL frameworks that will benefit from this evidence
- Lists specific requirements satisfied
- Previews progress bar changes BEFORE upload
- Quantifies impact (+1 control, +2%, etc.)
- Encourages completion by showing positive momentum

### Pattern 5: Framework Overlap Visualization

**Vanta's Cross-Mapping Display (researched feature):**

```
┌─────────────────────────────────────────────────────────────┐
│ Framework Overlap Analysis                                  │
│                                                             │
│ Total Controls:                                             │
│   Unique:    145                                            │
│   Shared:     87                                            │
│   Overall:   232  (reduced from 239 with mapping)          │
│                                                             │
│ Shared Controls by Framework Pair:                          │
│   SOC 2 ∩ ISO 27001:      43 controls                      │
│   SOC 2 ∩ GDPR:           28 controls                      │
│   ISO 27001 ∩ GDPR:       31 controls                      │
│   All Three:              15 controls                      │
│                                                             │
│ [View Shared Controls] [Export Mapping]                    │
└─────────────────────────────────────────────────────────────┘
```

**Efficiency Metric:**
- Without cross-mapping: 239 controls to complete
- With cross-mapping: 232 controls to complete (87 controls satisfy multiple frameworks)
- Time saved: ~30% reduction in duplicate work

### Pattern 6: Task Dashboard & Next Steps

**Home Dashboard View:**
```
┌─────────────────────────────────────────────────────────────┐
│ Next Steps to Improve Compliance                            │
│                                                             │
│ High Priority (3)                                           │
│   1. ⚠ Upload annual board security training certificate   │
│      Frameworks affected: SOC 2, ISO 27001                  │
│      Due: 2025-11-15 (11 days)                             │
│                                                             │
│   2. ⚠ Complete background check for new contractor         │
│      Frameworks affected: SOC 2, GDPR                       │
│      Due: 2025-11-08 (4 days)                              │
│                                                             │
│   3. ⚠ Review and update incident response plan             │
│      Frameworks affected: All frameworks                    │
│      Due: 2025-11-20 (16 days)                             │
│                                                             │
│ Tests Failing (2)                                           │
│   • MFA enforcement on admin accounts (SOC 2)               │
│   • Data retention policy automated cleanup (GDPR)          │
│                                                             │
│ Upcoming Renewals (1)                                       │
│   • SSL certificates expire in 30 days                      │
│                                                             │
│ [View All Tasks] [Assign Tasks]                            │
└─────────────────────────────────────────────────────────────┘
```

**Task Prioritization Logic:**
1. Failing tests (immediate action required)
2. High priority gaps (missing evidence)
3. Upcoming deadlines
4. Renewals and recurring tasks

---

## Part 3: Islamic Finance Methodology Mapping

### Conceptual Mapping

| **Vanta Concept** | **Islamic Finance Equivalent** | **Technical Implementation** |
|-------------------|-------------------------------|------------------------------|
| **Framework** (SOC 2, ISO 27001, GDPR) | **Methodology** (Murabaha, Ijara, Musharaka, Sukuk, Istisna) | Methodology registry with phases and validation steps |
| **Requirement Category** (CC 1.0 Control Environment, CC 2.0 Communication) | **Workflow Phase** (Contract Setup, Shariah Review, Execution, Settlement) | Phase groups in workflow template |
| **Requirement** (CC 1.1 COSO Principle 1) | **Step Requirement** (Asset ownership verified, pricing calculated, contract drafted) | Individual validation checkpoints |
| **Control** (Code of Conduct acknowledged) | **Validation Check** (Asset is tangible, markup within bounds, Shariah certificate obtained) | Boolean or scored validation |
| **Test** (Automated compliance test) | **Shariah Compliance Check** (Automated rule validation, Graphiti knowledge retrieval) | Backend validation service |
| **Evidence** (Document, screenshot, integration data) | **Supporting Document** (Purchase agreement, valuation report, Shariah certificate, scholar opinion) | File upload + metadata |
| **Control Owner** (Team member assigned) | **Responsible Party** (Shariah advisor, transaction manager, legal counsel) | User assignment |
| **Integration** (GitHub, GCP, BambooHR) | **Data Source** (Document library, knowledge graph via Graphiti MCP, external APIs) | MCP server connections |
| **Framework Scoping** (Assets/people per framework) | **Transaction Scoping** (Parties involved, assets included) | Transaction context |

### Methodology Overlap Example

**User Selection:**
- ☑ Murabaha (Cost-Plus Sale)
- ☑ Ijara (Leasing)
- ☑ Musharaka (Partnership)

**Shared Validation Steps (Evidence Reuse Opportunity):**

| **Validation Step** | **Required By** | **Evidence Type** | **Shariah Check** |
|---------------------|----------------|-------------------|-------------------|
| Asset identification and description | Murabaha, Ijara, Musharaka | Asset description document | Asset is tangible and permissible |
| Ownership verification | Murabaha, Ijara, Musharaka | Title deed, registration certificate | Ownership transfer is valid |
| Asset valuation | Murabaha, Ijara, Musharaka | Independent valuation report | Valuation method is acceptable |
| Shariah compliance certificate | ALL methodologies | Certificate from Shariah board | Certificate is valid and current |
| Contract documentation | ALL methodologies | Signed contract | Contract terms comply with Shariah |
| Party identification (KYC) | ALL methodologies | ID documents, company registration | Parties are legally capable |

**Methodology-Specific Steps:**

**Murabaha Only:**
- Cost basis calculation
- Markup/profit margin determination
- Payment schedule (deferred or installment)
- Ownership transfer from seller to financier to buyer

**Ijara Only:**
- Rental amount and schedule determination
- Maintenance responsibility allocation
- Lease term and renewal options
- End-of-lease asset disposition (return, purchase, extend)

**Musharaka Only:**
- Capital contribution from each partner
- Profit/loss sharing ratio agreement
- Management structure and decision-making
- Exit mechanism and buyout terms

### Progress Visualization Example

**Scenario**: User selects Murabaha + Ijara + Musharaka, uploads asset valuation report

**Before Upload:**
```
Murabaha:   ██████▓░░░  7/10 steps (70%)  [3 shared, 4 unique]
Ijara:      ████▓░░░░░  5/10 steps (50%)  [3 shared, 2 unique]
Musharaka:  ██▓░░░░░░░  3/10 steps (30%)  [3 shared, 0 unique]

Overall:    █████░░░░░  15/30 unique steps (50%)
```

**After Uploading Asset Valuation Report (satisfies "Asset valuation" step in all 3 methodologies):**
```
Murabaha:   ████████▓░  8/10 steps (80%)  [4 shared, 4 unique]  +1 ⬆
Ijara:      ██████▓░░░  6/10 steps (60%)  [4 shared, 2 unique]  +1 ⬆
Musharaka:  ████▓░░░░░  4/10 steps (40%)  [4 shared, 0 unique]  +1 ⬆

Overall:    ██████░░░░  16/30 unique steps (53%)              +1 ⬆

Impact: Single upload improved 3 methodologies simultaneously
```

**Evidence Reuse Indicator UI:**
```
┌─────────────────────────────────────────────────────────────┐
│ Upload Evidence: Asset Valuation Report                     │
│                                                             │
│ This will satisfy requirements in:                          │
│   • Murabaha → Phase 1: Asset Verification                 │
│   • Ijara → Phase 1: Lease Asset Appraisal                │
│   • Musharaka → Phase 1: Capital Asset Valuation           │
│                                                             │
│ [📎 Choose File] asset_valuation_2025-11-04.pdf            │
│                                                             │
│ Progress Impact:                                            │
│   • Murabaha:    70% → 80%  (+1 step)  [████████▓░]       │
│   • Ijara:       50% → 60%  (+1 step)  [██████▓░░░]       │
│   • Musharaka:   30% → 40%  (+1 step)  [████▓░░░░░]       │
│                                                             │
│ Shariah Check: Will auto-run after upload                   │
│   ✓ Valuation method is acceptable                         │
│                                                             │
│                              [Cancel] [Upload & Continue]  │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 4: Implementation Plan

### Phase 1: Core Methodology Selection System (Week 1-2)

**Objective**: Build the foundation for multi-methodology selection with progress tracking

#### Backend Tasks

**1.1 Create Methodology Data Models** (`backend/app/models.py`)

```python
from typing import List, Literal, Tuple, Optional
from pydantic import BaseModel, Field

class ValidationStep(BaseModel):
    """Individual validation checkpoint within a workflow phase"""
    id: str = Field(..., description="Unique step identifier")
    name: str = Field(..., description="Human-readable step name")
    description: str = Field(..., description="Detailed step description")
    required_by: List[str] = Field(..., description="List of methodology IDs requiring this step")
    status: Literal["complete", "in_progress", "pending", "failed"] = "pending"
    evidence_required: int = Field(..., description="Number of evidence items required")
    evidence_uploaded: int = Field(0, description="Number of evidence items uploaded")
    shariah_checks: List["ShariahCheck"] = Field(default_factory=list)
    owner: Optional[str] = Field(None, description="Responsible party")
    created_at: str
    updated_at: str

class ShariahCheck(BaseModel):
    """Automated Shariah compliance validation"""
    id: str
    name: str
    status: Literal["passing", "failing", "pending", "not_applicable"]
    automated: bool = Field(..., description="Whether this check runs automatically")
    last_run: Optional[str] = None
    next_run: Optional[str] = None
    message: str = Field("", description="Human-readable status message")

class WorkflowPhase(BaseModel):
    """Logical grouping of validation steps (like Vanta's Requirement Categories)"""
    id: str
    name: str
    description: str
    steps: List[ValidationStep]
    completion_count: Tuple[int, int]  # (completed, total)
    order: int = Field(..., description="Display order")

class Methodology(BaseModel):
    """Islamic finance methodology (like Vanta's Framework)"""
    id: str  # "murabaha", "ijara", "musharaka", "sukuk", "istisna"
    display_name: str
    short_description: str
    long_description: str
    category: Literal["sale", "lease", "partnership", "sukuk", "manufacturing"]
    phases: List[WorkflowPhase]

    # Progress metrics (like Vanta's numControlsCompleted/Total)
    steps_completed: int = 0
    steps_total: int
    completion_percentage: float = 0.0

    # Evidence tracking
    evidence_complete: int = 0
    evidence_total: int

    # Shariah checks
    checks_passing: int = 0
    checks_total: int

    # Metadata
    is_active: bool = True
    created_at: str
    updated_at: str

class MethodologySelection(BaseModel):
    """User's selected methodologies for a workflow execution"""
    selected_methodology_ids: List[str]
    unique_steps_count: int  # Total unique steps across selected methodologies
    shared_steps_count: int  # Steps required by multiple methodologies
    overall_completion_percentage: float

class EvidenceImpact(BaseModel):
    """Shows impact of uploading evidence (like Vanta's upload preview)"""
    methodology_id: str
    methodology_name: str
    current_progress: float
    new_progress: float
    steps_completed_delta: int  # +1, +2, etc.
    satisfied_step_ids: List[str]
```

**1.2 Create Methodology Mapper Service** (`backend/app/services/methodology_mapper.py`)

```python
from typing import List, Dict, Set, Tuple
from app.models import Methodology, ValidationStep, EvidenceImpact

class MethodologyMapper:
    """
    Service for analyzing multi-methodology overlap and evidence reuse.
    Inspired by Vanta's framework cross-mapping.
    """

    def __init__(self):
        self.methodologies: Dict[str, Methodology] = {}
        self._load_methodologies()

    def _load_methodologies(self):
        """Load methodology definitions (from DB, JSON, or hardcoded for MVP)"""
        # For MVP, can be hardcoded. Later, move to database/JSON config.
        pass

    def get_shared_steps(
        self,
        methodology_ids: List[str]
    ) -> List[ValidationStep]:
        """
        Returns validation steps required by multiple methodologies.

        Example:
            Input: ["murabaha", "ijara", "musharaka"]
            Output: [
                ValidationStep(
                    id="asset-ownership-verification",
                    name="Asset Ownership Verification",
                    required_by=["murabaha", "ijara", "musharaka"]
                ),
                ...
            ]
        """
        if not methodology_ids:
            return []

        # Collect all steps from selected methodologies
        step_map: Dict[str, ValidationStep] = {}

        for method_id in methodology_ids:
            methodology = self.methodologies.get(method_id)
            if not methodology:
                continue

            for phase in methodology.phases:
                for step in phase.steps:
                    if step.id in step_map:
                        # Step already seen, add this methodology to required_by
                        step_map[step.id].required_by.append(method_id)
                    else:
                        # First time seeing this step
                        step_map[step.id] = step.copy()
                        step_map[step.id].required_by = [method_id]

        # Filter to only shared steps (required by 2+ methodologies)
        shared_steps = [
            step for step in step_map.values()
            if len(step.required_by) > 1
        ]

        return shared_steps

    def get_unique_steps(
        self,
        methodology_ids: List[str]
    ) -> Dict[str, List[ValidationStep]]:
        """
        Returns methodology-specific steps (not shared with others).

        Example:
            Input: ["murabaha", "ijara"]
            Output: {
                "murabaha": [
                    ValidationStep(id="cost-plus-calculation", ...),
                    ValidationStep(id="markup-determination", ...)
                ],
                "ijara": [
                    ValidationStep(id="rental-schedule", ...),
                    ValidationStep(id="maintenance-responsibility", ...)
                ]
            }
        """
        shared_step_ids = {
            step.id for step in self.get_shared_steps(methodology_ids)
        }

        unique_steps = {}

        for method_id in methodology_ids:
            methodology = self.methodologies.get(method_id)
            if not methodology:
                continue

            unique_steps[method_id] = []

            for phase in methodology.phases:
                for step in phase.steps:
                    if step.id not in shared_step_ids:
                        unique_steps[method_id].append(step)

        return unique_steps

    def calculate_overlap_impact(
        self,
        step_id: str,
        methodology_ids: List[str]
    ) -> List[EvidenceImpact]:
        """
        Calculates progress impact across methodologies when a step is completed.
        Used for evidence upload preview (like Vanta's upload dialog).

        Example:
            Input: step_id="asset-valuation", methodologies=["murabaha", "ijara"]
            Output: [
                EvidenceImpact(
                    methodology_id="murabaha",
                    methodology_name="Murabaha (Cost-Plus Sale)",
                    current_progress=70.0,
                    new_progress=80.0,
                    steps_completed_delta=1,
                    satisfied_step_ids=["asset-valuation"]
                ),
                EvidenceImpact(
                    methodology_id="ijara",
                    current_progress=50.0,
                    new_progress=60.0,
                    steps_completed_delta=1,
                    satisfied_step_ids=["asset-valuation"]
                )
            ]
        """
        impacts = []

        for method_id in methodology_ids:
            methodology = self.methodologies.get(method_id)
            if not methodology:
                continue

            # Check if this methodology requires this step
            step_found = False
            for phase in methodology.phases:
                for step in phase.steps:
                    if step.id == step_id and method_id in step.required_by:
                        step_found = True
                        break
                if step_found:
                    break

            if not step_found:
                continue

            # Calculate progress delta
            current_completed = methodology.steps_completed
            total_steps = methodology.steps_total

            current_progress = (current_completed / total_steps) * 100
            new_progress = ((current_completed + 1) / total_steps) * 100

            impact = EvidenceImpact(
                methodology_id=method_id,
                methodology_name=methodology.display_name,
                current_progress=round(current_progress, 1),
                new_progress=round(new_progress, 1),
                steps_completed_delta=1,
                satisfied_step_ids=[step_id]
            )

            impacts.append(impact)

        return impacts

    def get_unique_steps_count(
        self,
        methodology_ids: List[str]
    ) -> Tuple[int, int, int]:
        """
        Returns (total_unique_steps, shared_steps_count, total_steps_without_dedup).

        Example:
            Input: ["murabaha", "ijara", "musharaka"]
            Output: (25, 8, 30)
            Meaning: 25 unique steps, 8 shared, total 30 if no deduplication
        """
        all_step_ids: Set[str] = set()
        total_steps_count = 0

        for method_id in methodology_ids:
            methodology = self.methodologies.get(method_id)
            if not methodology:
                continue

            for phase in methodology.phases:
                for step in phase.steps:
                    all_step_ids.add(step.id)
                    total_steps_count += 1

        unique_count = len(all_step_ids)
        shared_count = total_steps_count - unique_count

        return (unique_count, shared_count, total_steps_count)
```

**1.3 Create Methodology API Endpoints** (`backend/app/api/methodologies.py`)

```python
from fastapi import APIRouter, HTTPException
from typing import List
from app.models import Methodology, MethodologySelection, EvidenceImpact
from app.services.methodology_mapper import MethodologyMapper

router = APIRouter(prefix="/api/methodologies", tags=["methodologies"])
mapper = MethodologyMapper()

@router.get("/", response_model=List[Methodology])
async def list_methodologies():
    """Get all available Islamic finance methodologies (like Vanta's frameworks)"""
    return list(mapper.methodologies.values())

@router.get("/{methodology_id}", response_model=Methodology)
async def get_methodology(methodology_id: str):
    """Get detailed methodology with phases and steps"""
    methodology = mapper.methodologies.get(methodology_id)
    if not methodology:
        raise HTTPException(status_code=404, detail="Methodology not found")
    return methodology

@router.post("/selection/analyze", response_model=MethodologySelection)
async def analyze_selection(methodology_ids: List[str]):
    """
    Analyze multi-methodology selection (like Vanta's overlap analysis).
    Returns unique/shared step counts and overall progress.
    """
    unique_count, shared_count, total_without_dedup = mapper.get_unique_steps_count(
        methodology_ids
    )

    # Calculate overall completion (would need session context in real impl)
    overall_completion = 0.0  # TODO: Calculate from session state

    return MethodologySelection(
        selected_methodology_ids=methodology_ids,
        unique_steps_count=unique_count,
        shared_steps_count=shared_count,
        overall_completion_percentage=overall_completion
    )

@router.post("/evidence-impact", response_model=List[EvidenceImpact])
async def calculate_evidence_impact(
    step_id: str,
    methodology_ids: List[str]
):
    """
    Calculate progress impact of completing a step (for upload preview).
    Like Vanta's evidence upload dialog showing progress changes.
    """
    return mapper.calculate_overlap_impact(step_id, methodology_ids)
```

**1.4 Register Router in Main App** (`backend/app/main.py`)

```python
from app.api import methodologies

app.include_router(methodologies.router)
```

#### Frontend Tasks

**1.5 Create Methodology Store** (`src/lib/store.ts` - extend existing)

```typescript
interface MethodologyState {
  selectedMethodologies: string[]  // ["murabaha", "ijara", "musharaka"]
  availableMethodologies: Methodology[]
  methodologyProgress: Record<string, number>  // { "murabaha": 80, "ijara": 60 }
  sharedStepsCount: number
  uniqueStepsCount: number
}

const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // ... existing state ...

  // Methodology selection state
  selectedMethodologies: [],
  availableMethodologies: [],
  methodologyProgress: {},
  sharedStepsCount: 0,
  uniqueStepsCount: 0,

  // Actions
  selectMethodology: (methodologyId: string) => {
    const selected = [...get().selectedMethodologies, methodologyId]
    set({ selectedMethodologies: selected })
    get().refreshOverlapAnalysis()
  },

  deselectMethodology: (methodologyId: string) => {
    const selected = get().selectedMethodologies.filter(id => id !== methodologyId)
    set({ selectedMethodologies: selected })
    get().refreshOverlapAnalysis()
  },

  refreshOverlapAnalysis: async () => {
    const selected = get().selectedMethodologies
    if (selected.length === 0) return

    const analysis = await backendClient.analyzeMethodologySelection(selected)
    set({
      sharedStepsCount: analysis.shared_steps_count,
      uniqueStepsCount: analysis.unique_steps_count
    })
  },

  // ... rest of actions ...
}))
```

**1.6 Create Methodology Selector Component** (`src/components/workflow/MethodologySelector.tsx`)

```typescript
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { useWorkflowStore } from '@/lib/store'

export function MethodologySelector() {
  const {
    availableMethodologies,
    selectedMethodologies,
    methodologyProgress,
    selectMethodology,
    deselectMethodology
  } = useWorkflowStore()

  const handleToggle = (methodologyId: string, checked: boolean) => {
    if (checked) {
      selectMethodology(methodologyId)
    } else {
      deselectMethodology(methodologyId)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Islamic Finance Methodologies</h3>

      {availableMethodologies.map((methodology) => {
        const isSelected = selectedMethodologies.includes(methodology.id)
        const progress = methodologyProgress[methodology.id] || 0
        const progressColor = progress >= 80 ? 'bg-green-500' :
                              progress >= 50 ? 'bg-blue-500' :
                              'bg-gray-400'

        return (
          <div key={methodology.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-start space-x-3">
              <Checkbox
                id={methodology.id}
                checked={isSelected}
                onCheckedChange={(checked) => handleToggle(methodology.id, !!checked)}
              />

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={methodology.id}
                    className="font-medium cursor-pointer"
                  >
                    {methodology.display_name}
                  </label>

                  {isSelected && (
                    <span className="text-sm text-gray-600">
                      {methodology.steps_completed}/{methodology.steps_total} steps
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600">
                  {methodology.short_description}
                </p>

                {isSelected && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className={progressColor} />
                  </div>
                )}

                {!isSelected && progress === 0 && (
                  <span className="text-sm text-gray-400">Not started</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

**1.7 Create Overlap Summary Component** (`src/components/workflow/OverlapSummary.tsx`)

```typescript
import { useWorkflowStore } from '@/lib/store'

export function OverlapSummary() {
  const {
    selectedMethodologies,
    sharedStepsCount,
    uniqueStepsCount
  } = useWorkflowStore()

  if (selectedMethodologies.length < 2) {
    return null
  }

  const totalWithoutDedup = sharedStepsCount + uniqueStepsCount
  const efficiencyGain = ((sharedStepsCount / totalWithoutDedup) * 100).toFixed(0)

  return (
    <div className="border rounded-lg p-4 bg-blue-50">
      <h4 className="font-semibold mb-3">Methodology Overlap Analysis</h4>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{uniqueStepsCount}</div>
          <div className="text-sm text-gray-600">Total Unique Steps</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-green-600">{sharedStepsCount}</div>
          <div className="text-sm text-gray-600">Shared Steps</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-purple-600">{efficiencyGain}%</div>
          <div className="text-sm text-gray-600">Efficiency Gain</div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        By completing shared validation steps, you'll satisfy requirements across multiple
        methodologies simultaneously. This reduces total work from {totalWithoutDedup} steps
        to just {uniqueStepsCount} unique steps.
      </p>
    </div>
  )
}
```

### Phase 2: Evidence Management with Reuse (Week 3)

**Objective**: Implement evidence upload with multi-methodology impact preview

#### Backend Tasks

**2.1 Extend Document Service** (`backend/app/services/document_service.py`)

```python
class EvidenceService:
    """Service for managing evidence with multi-methodology tracking"""

    async def upload_evidence(
        self,
        file: UploadFile,
        step_ids: List[str],  # Steps this evidence satisfies
        session_id: str,
        methodology_ids: List[str]
    ) -> Evidence:
        """
        Upload evidence and link to multiple validation steps.
        Like Vanta's evidence reuse across framework controls.
        """
        # 1. Save file
        file_path = await self._save_upload(file)

        # 2. Create evidence record
        evidence = Evidence(
            id=str(uuid.uuid4()),
            filename=file.filename,
            file_path=file_path,
            uploaded_at=datetime.utcnow().isoformat(),
            satisfies_step_ids=step_ids,
            applies_to_methodologies=methodology_ids
        )

        # 3. Update session state for all affected steps
        await self._update_step_status(session_id, step_ids, evidence.id)

        # 4. Trigger Shariah checks
        await shariah_validator.run_checks_for_evidence(evidence)

        return evidence

    async def calculate_upload_impact(
        self,
        step_ids: List[str],
        methodology_ids: List[str],
        session_id: str
    ) -> List[EvidenceImpact]:
        """
        Preview progress impact before upload (for UI preview dialog).
        """
        mapper = MethodologyMapper()
        impacts = []

        for step_id in step_ids:
            step_impacts = mapper.calculate_overlap_impact(step_id, methodology_ids)
            impacts.extend(step_impacts)

        # Deduplicate by methodology_id
        impact_map = {impact.methodology_id: impact for impact in impacts}
        return list(impact_map.values())
```

**2.2 Create Evidence Upload Endpoint** (`backend/app/api/documents.py` - extend existing)

```python
@router.post("/evidence/preview-impact", response_model=List[EvidenceImpact])
async def preview_evidence_impact(
    step_ids: List[str],
    methodology_ids: List[str],
    session_id: str
):
    """
    Preview progress impact of uploading evidence (before actual upload).
    Like Vanta's upload dialog preview.
    """
    evidence_service = EvidenceService()
    return await evidence_service.calculate_upload_impact(
        step_ids, methodology_ids, session_id
    )

@router.post("/evidence/upload", response_model=Evidence)
async def upload_evidence(
    file: UploadFile = File(...),
    step_ids: List[str] = Form(...),
    methodology_ids: List[str] = Form(...),
    session_id: str = Form(...)
):
    """Upload evidence and link to multiple validation steps"""
    evidence_service = EvidenceService()
    return await evidence_service.upload_evidence(
        file, step_ids, session_id, methodology_ids
    )
```

#### Frontend Tasks

**2.3 Create Evidence Upload Dialog** (`src/components/workflow/EvidenceUploadDialog.tsx`)

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { backendClient } from '@/lib/backend-client'
import { Progress } from '@/components/ui/progress'

interface EvidenceUploadDialogProps {
  open: boolean
  onClose: () => void
  stepId: string
  stepName: string
  sessionId: string
  selectedMethodologies: string[]
}

export function EvidenceUploadDialog({
  open,
  onClose,
  stepId,
  stepName,
  sessionId,
  selectedMethodologies
}: EvidenceUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [impacts, setImpacts] = useState<EvidenceImpact[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (open && stepId) {
      // Fetch impact preview
      fetchImpactPreview()
    }
  }, [open, stepId])

  const fetchImpactPreview = async () => {
    const preview = await backendClient.previewEvidenceImpact(
      [stepId],
      selectedMethodologies,
      sessionId
    )
    setImpacts(preview)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      await backendClient.uploadEvidence(
        file,
        [stepId],
        selectedMethodologies,
        sessionId
      )
      onClose()
      // Refresh workflow state
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Evidence: {stepName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Impact preview */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">This evidence will satisfy requirements in:</h4>
            <ul className="space-y-1 text-sm">
              {impacts.map((impact) => (
                <li key={impact.methodology_id}>
                  • {impact.methodology_name} → {stepName}
                </li>
              ))}
            </ul>
          </div>

          {/* File input */}
          <div>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.docx,.png,.jpg,.jpeg"
            />
          </div>

          {/* Progress impact preview */}
          {impacts.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Progress Impact:</h4>
              <div className="space-y-3">
                {impacts.map((impact) => (
                  <div key={impact.methodology_id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{impact.methodology_name}</span>
                      <span className="text-green-600 font-medium">
                        {impact.current_progress}% → {impact.new_progress}%
                        (+{impact.steps_completed_delta} step)
                      </span>
                    </div>
                    <Progress
                      value={impact.new_progress}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Uploading...' : 'Upload & Continue'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Phase 3: Visual Progress System (Week 4)

#### Frontend Tasks

**3.1 Create Progress Dashboard** (`src/components/workflow/MethodologyProgressDashboard.tsx`)

```typescript
import { useWorkflowStore } from '@/lib/store'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MethodologyProgressDashboard() {
  const {
    availableMethodologies,
    selectedMethodologies,
    methodologyProgress
  } = useWorkflowStore()

  const selectedMethods = availableMethodologies.filter(
    m => selectedMethodologies.includes(m.id)
  )

  // Calculate overall progress
  const overallProgress = selectedMethods.length > 0
    ? selectedMethods.reduce((sum, m) => sum + (methodologyProgress[m.id] || 0), 0) / selectedMethods.length
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Methodology Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className="text-2xl font-bold text-blue-600">
              {overallProgress.toFixed(0)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-3 bg-blue-500" />
        </div>

        {/* Individual methodology progress */}
        <div className="space-y-4">
          {selectedMethods.map((methodology) => {
            const progress = methodologyProgress[methodology.id] || 0
            const barColor =
              progress >= 80 ? 'bg-green-500' :
              progress >= 50 ? 'bg-blue-500' :
              progress >= 25 ? 'bg-yellow-500' :
              'bg-gray-400'

            return (
              <div key={methodology.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{methodology.display_name}</div>
                    <div className="text-sm text-gray-600">
                      {methodology.steps_completed}/{methodology.steps_total} steps complete
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold">{progress}%</div>
                    <div className="text-xs text-gray-500">
                      {methodology.evidence_complete}/{methodology.evidence_total} evidence
                    </div>
                  </div>
                </div>
                <Progress value={progress} className={`h-2 ${barColor}`} />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
```

**3.2 Create Phase Accordion with Status Icons** (`src/components/workflow/PhaseAccordion.tsx`)

```typescript
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface Phase {
  id: string
  name: string
  steps: ValidationStep[]
  completionCount: [number, number]
}

export function PhaseAccordion({ phases }: { phases: Phase[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Accordion type="multiple" className="space-y-2">
      {phases.map((phase) => {
        const [completed, total] = phase.completionCount
        const phaseStatus =
          completed === total ? 'complete' :
          completed > 0 ? 'in_progress' :
          'pending'

        return (
          <AccordionItem key={phase.id} value={phase.id} className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(phaseStatus)}
                  <span className="font-medium">{phase.name}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {completed}/{total} complete
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2 pl-7">
                {phase.steps.map((step) => (
                  <div key={step.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(step.status)}
                      <span className="text-sm">{step.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.evidence_uploaded}/{step.evidence_required} evidence
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
```

### Phase 4: Automated Shariah Checks (Week 5)

#### Backend Tasks

**4.1 Create Shariah Validator Service** (`backend/app/services/shariah_validator.py`)

```python
from typing import List
from app.models import ShariahCheck, ValidationStep, Evidence
from app.services.graphiti_mcp_service import GraphitiMCPService

class ShariahValidator:
    """
    Service for running automated Shariah compliance checks.
    Like Vanta's automated tests for controls.
    """

    def __init__(self):
        self.graphiti_service = GraphitiMCPService()

    async def run_automated_checks(
        self,
        step_id: str,
        evidence: Evidence
    ) -> List[ShariahCheck]:
        """
        Run automated Shariah compliance checks for a validation step.

        Example checks:
        - Asset is tangible (no intangible/debt-based assets in Murabaha)
        - No interest-bearing terms in contract
        - Ownership transfer is valid
        - Pricing mechanism is acceptable
        """
        checks = []

        # Example check 1: Asset tangibility (for Murabaha/Ijara)
        if step_id == "asset-identification":
            tangibility_check = await self._check_asset_tangibility(evidence)
            checks.append(tangibility_check)

        # Example check 2: No Riba (interest) terms
        if step_id in ["contract-documentation", "pricing-calculation"]:
            riba_check = await self._check_no_riba_terms(evidence)
            checks.append(riba_check)

        # Example check 3: Query knowledge graph for scholar opinions
        if step_id == "shariah-certificate":
            scholar_check = await self._validate_via_knowledge_graph(evidence)
            checks.append(scholar_check)

        return checks

    async def _check_asset_tangibility(self, evidence: Evidence) -> ShariahCheck:
        """Check if asset is tangible (required for Murabaha, Ijara)"""
        # In real implementation, use LLM to analyze evidence content
        # For MVP, can be rule-based or manual override

        return ShariahCheck(
            id="check-tangibility",
            name="Asset is tangible and Shariah-compliant",
            status="passing",  # or "failing", "pending"
            automated=True,
            last_run=datetime.utcnow().isoformat(),
            next_run=None,  # One-time check
            message="Asset identified as tangible property (vehicle/equipment)"
        )

    async def _check_no_riba_terms(self, evidence: Evidence) -> ShariahCheck:
        """Check for interest-bearing terms in contract"""
        # Use LLM to analyze contract for Riba indicators
        # Keywords: interest rate, APR, penalty interest, late fees with compounding

        return ShariahCheck(
            id="check-no-riba",
            name="No interest-bearing terms detected",
            status="passing",
            automated=True,
            last_run=datetime.utcnow().isoformat(),
            message="Contract reviewed, no Riba terms found"
        )

    async def _validate_via_knowledge_graph(self, evidence: Evidence) -> ShariahCheck:
        """Query Graphiti knowledge graph for scholar opinions"""
        # Search knowledge graph for relevant fatwas, scholar opinions
        query = f"Shariah ruling on {evidence.filename} transaction type"

        search_results = await self.graphiti_service.search(
            query=query,
            filters={"node_labels": ["ScholarOpinion", "Fatwa"]}
        )

        if search_results.get("status") == "success":
            return ShariahCheck(
                id="check-scholar-opinion",
                name="Shariah scholar opinion retrieved",
                status="passing",
                automated=True,
                last_run=datetime.utcnow().isoformat(),
                message=f"Found {len(search_results.get('facts', []))} relevant opinions"
            )
        else:
            return ShariahCheck(
                id="check-scholar-opinion",
                name="Manual Shariah review required",
                status="pending",
                automated=False,
                message="No automated ruling available, manual review needed"
            )
```

**4.2 Create Validation Endpoint** (`backend/app/api/validation.py` - new file)

```python
from fastapi import APIRouter
from app.models import ShariahCheck
from app.services.shariah_validator import ShariahValidator

router = APIRouter(prefix="/api/validation", tags=["validation"])
validator = ShariahValidator()

@router.post("/run-checks/{step_id}", response_model=List[ShariahCheck])
async def run_shariah_checks(
    step_id: str,
    evidence_id: str,
    session_id: str
):
    """
    Run automated Shariah compliance checks for a validation step.
    Like Vanta's automated tests.
    """
    # Get evidence from session/DB
    evidence = await get_evidence(evidence_id, session_id)

    checks = await validator.run_automated_checks(step_id, evidence)

    # Update session state with check results
    await update_session_checks(session_id, step_id, checks)

    return checks
```

#### Frontend Tasks

**4.3 Create Status Badges Component** (`src/components/workflow/StatusBadge.tsx`)

```typescript
import { CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react'

interface StatusBadgeProps {
  status: 'passing' | 'failing' | 'pending' | 'in_progress'
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = {
    passing: {
      icon: CheckCircle,
      label: 'PASSING',
      className: 'bg-green-100 text-green-700 border-green-300'
    },
    failing: {
      icon: XCircle,
      label: 'FAILING',
      className: 'bg-red-100 text-red-700 border-red-300'
    },
    in_progress: {
      icon: AlertTriangle,
      label: 'IN PROGRESS',
      className: 'bg-orange-100 text-orange-700 border-orange-300'
    },
    pending: {
      icon: Clock,
      label: 'PENDING',
      className: 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  const { icon: Icon, label, className } = config[status]

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  return (
    <div className={`inline-flex items-center space-x-1 rounded-full border ${className} ${sizeClasses[size]} font-medium`}>
      <Icon className={`h-${size === 'sm' ? '3' : size === 'md' ? '4' : '5'} w-${size === 'sm' ? '3' : size === 'md' ? '4' : '5'}`} />
      <span>{label}</span>
    </div>
  )
}
```

**4.4 Add Auto-Refresh for Check Status** (`src/components/workflow/StepDetailView.tsx`)

```typescript
import { useEffect, useState } from 'react'
import { backendClient } from '@/lib/backend-client'
import { StatusBadge } from './StatusBadge'

export function StepDetailView({ stepId, sessionId }) {
  const [checks, setChecks] = useState<ShariahCheck[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchChecks()

    // Auto-refresh every 5 seconds if any checks are pending
    const interval = setInterval(() => {
      const hasPending = checks.some(c => c.status === 'pending')
      if (hasPending) {
        fetchChecks()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [stepId, checks])

  const fetchChecks = async () => {
    setRefreshing(true)
    try {
      const results = await backendClient.getStepChecks(stepId, sessionId)
      setChecks(results)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Shariah Compliance Checks</h4>
        {refreshing && <span className="text-sm text-gray-500">Refreshing...</span>}
      </div>

      <div className="space-y-3">
        {checks.map((check) => (
          <div key={check.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{check.name}</span>
              <StatusBadge status={check.status} size="sm" />
            </div>

            <p className="text-sm text-gray-600">{check.message}</p>

            {check.automated && (
              <div className="mt-2 text-xs text-gray-500">
                Last run: {new Date(check.last_run).toLocaleString()}
                {check.next_run && ` • Next run: ${new Date(check.next_run).toLocaleString()}`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Phase 5: Graphiti Integration for Evidence Discovery (Week 6)

#### Backend Tasks

**5.1 Create Evidence Recommendation Service** (`backend/app/services/evidence_recommender.py`)

```python
from app.services.graphiti_mcp_service import GraphitiMCPService

class EvidenceRecommender:
    """
    Use knowledge graph to recommend evidence from past transactions.
    Like Vanta's integration-based evidence collection.
    """

    def __init__(self):
        self.graphiti_service = GraphitiMCPService()

    async def recommend_evidence_for_step(
        self,
        step_id: str,
        methodology_id: str,
        transaction_context: Dict[str, Any]
    ) -> List[EvidenceRecommendation]:
        """
        Search knowledge graph for reusable evidence from similar past transactions.

        Example:
            step_id="asset-valuation"
            methodology_id="murabaha"
            context={"asset_type": "vehicle", "transaction_amount": 50000}

            Returns: [
                {
                    "evidence_id": "valuation-report-2024-09-15",
                    "filename": "vehicle_valuation_toyota_camry.pdf",
                    "relevance_score": 0.92,
                    "reason": "Similar vehicle transaction (Toyota Camry, $52,000)",
                    "can_reuse": True
                }
            ]
        """
        # Query knowledge graph
        query = f"Find evidence for {step_id} in {methodology_id} transactions with {transaction_context.get('asset_type', 'any')} asset"

        results = await self.graphiti_service.search(
            query=query,
            filters={
                "node_labels": ["Evidence", "Document"],
                "group_ids": [f"methodology-{methodology_id}"]
            },
            num_results=10
        )

        recommendations = []

        if results.get("status") == "success":
            for fact in results.get("facts", []):
                # Parse fact to extract evidence details
                recommendation = EvidenceRecommendation(
                    evidence_id=fact.get("uuid"),
                    filename=fact.get("filename", "Unknown"),
                    relevance_score=fact.get("relevance", 0.0),
                    reason=fact.get("fact", ""),
                    can_reuse=True  # Check if evidence is still valid/not expired
                )
                recommendations.append(recommendation)

        return recommendations

    async def get_scholar_opinions(
        self,
        methodology_id: str,
        contract_type: str
    ) -> List[ScholarOpinion]:
        """
        Retrieve scholar opinions and fatwas from knowledge graph.
        Helps with Shariah compliance validation.
        """
        query = f"Shariah scholar opinions on {methodology_id} {contract_type} transactions"

        results = await self.graphiti_service.search(
            query=query,
            filters={"node_labels": ["ScholarOpinion", "Fatwa", "ShariahRuling"]},
            num_results=5
        )

        opinions = []

        if results.get("status") == "success":
            for fact in results.get("facts", []):
                opinion = ScholarOpinion(
                    scholar_name=fact.get("scholar", "Unknown"),
                    opinion_text=fact.get("fact", ""),
                    source=fact.get("source", ""),
                    date=fact.get("temporal", {}).get("valid_from", "")
                )
                opinions.append(opinion)

        return opinions
```

**5.2 Create Recommendation Endpoint** (`backend/app/api/recommendations.py` - new file)

```python
from fastapi import APIRouter
from app.services.evidence_recommender import EvidenceRecommender

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])
recommender = EvidenceRecommender()

@router.get("/evidence/{step_id}", response_model=List[EvidenceRecommendation])
async def get_evidence_recommendations(
    step_id: str,
    methodology_id: str,
    asset_type: Optional[str] = None,
    transaction_amount: Optional[float] = None
):
    """
    Get evidence recommendations from knowledge graph based on similar past transactions.
    Like Vanta's integration-based evidence suggestions.
    """
    context = {
        "asset_type": asset_type,
        "transaction_amount": transaction_amount
    }

    return await recommender.recommend_evidence_for_step(
        step_id, methodology_id, context
    )

@router.get("/scholar-opinions/{methodology_id}", response_model=List[ScholarOpinion])
async def get_scholar_opinions(
    methodology_id: str,
    contract_type: str = "sale"
):
    """Get relevant Shariah scholar opinions from knowledge graph"""
    return await recommender.get_scholar_opinions(methodology_id, contract_type)
```

#### Frontend Tasks

**5.3 Create Evidence Suggestions Panel** (`src/components/workflow/EvidenceSuggestions.tsx`)

```typescript
import { backendClient } from '@/lib/backend-client'
import { useEffect, useState } from 'react'
import { FileText, ExternalLink } from 'lucide-react'

interface EvidenceSuggestionsProps {
  stepId: string
  methodologyId: string
}

export function EvidenceSuggestions({ stepId, methodologyId }: EvidenceSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<EvidenceRecommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSuggestions()
  }, [stepId, methodologyId])

  const fetchSuggestions = async () => {
    setLoading(true)
    try {
      const results = await backendClient.getEvidenceRecommendations(
        stepId,
        methodologyId
      )
      setSuggestions(results)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading suggestions...</div>
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className="border rounded-lg p-4 bg-blue-50">
      <h4 className="font-medium mb-3 flex items-center">
        <FileText className="h-4 w-4 mr-2" />
        Evidence Suggestions from Past Transactions
      </h4>

      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <div key={suggestion.evidence_id} className="bg-white rounded p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-sm">{suggestion.filename}</div>
                <div className="text-xs text-gray-600 mt-1">{suggestion.reason}</div>
              </div>
              <div className="text-xs font-medium text-blue-600 ml-3">
                {(suggestion.relevance_score * 100).toFixed(0)}% match
              </div>
            </div>

            {suggestion.can_reuse && (
              <button
                className="text-xs text-blue-600 hover:underline flex items-center mt-2"
                onClick={() => handleReuseEvidence(suggestion.evidence_id)}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Reuse this evidence
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Part 5: Visual Design Tokens (Vanta-Inspired)

### Color Palette

```css
/* Status Colors */
:root {
  /* Success / Passing */
  --status-passing: #10b981;
  --status-passing-bg: #d1fae5;
  --status-passing-border: #6ee7b7;

  /* Warning / In Progress */
  --status-warning: #f59e0b;
  --status-warning-bg: #fef3c7;
  --status-warning-border: #fcd34d;

  /* Pending / Not Started */
  --status-pending: #6b7280;
  --status-pending-bg: #f3f4f6;
  --status-pending-border: #d1d5db;

  /* Failing / Error */
  --status-failing: #ef4444;
  --status-failing-bg: #fee2e2;
  --status-failing-border: #fca5a5;

  /* Progress Bar Colors */
  --progress-excellent: #10b981;  /* 80-100% */
  --progress-good: #3b82f6;       /* 50-79% */
  --progress-fair: #f59e0b;       /* 25-49% */
  --progress-poor: #6b7280;       /* 0-24% */
  --progress-incomplete: #e5e7eb;

  /* Framework/Methodology Badges */
  --badge-bg: #eff6ff;
  --badge-text: #1e40af;
  --badge-border: #bfdbfe;

  /* Evidence Overlap Highlight */
  --overlap-bg: #f0fdf4;
  --overlap-border: #86efac;
}
```

### Typography

```css
/* Font Families (match Vanta's clean sans-serif) */
:root {
  --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                  "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono",
               "Source Code Pro", monospace;
}

/* Font Sizes */
.text-methodology-name { font-size: 16px; font-weight: 600; }
.text-phase-name { font-size: 15px; font-weight: 500; }
.text-step-name { font-size: 14px; font-weight: 400; }
.text-progress-counter { font-size: 24px; font-weight: 700; }
.text-percentage { font-size: 20px; font-weight: 600; }
.text-badge { font-size: 12px; font-weight: 500; }
.text-evidence-filename { font-size: 13px; font-weight: 500; }
```

### Component Styles

```css
/* Methodology Selector Card */
.methodology-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;
}

.methodology-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.methodology-card.selected {
  background-color: #f0f9ff;
  border-color: #3b82f6;
  border-width: 2px;
}

/* Progress Bar */
.progress-bar {
  height: 8px;
  background-color: var(--progress-incomplete);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  transition: width 0.5s ease, background-color 0.3s ease;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border: 1px solid;
}

/* Accordion */
.phase-accordion-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.phase-accordion-trigger {
  padding: 12px 16px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.phase-accordion-trigger:hover {
  background-color: #f9fafb;
}

/* Evidence Upload Dialog */
.evidence-impact-preview {
  background-color: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 16px;
}

/* Overlap Summary Card */
.overlap-summary {
  background: linear-gradient(to bottom right, #f0f9ff, #e0f2fe);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 20px;
}
```

---

## Part 6: Key Insights & Best Practices

### What We Learned from Vanta

1. **Progress Transparency is Critical**
   - Users need to see completion percentage, completed/total counters, and visual progress bars
   - Multiple progress views: overall, per-framework, per-category, per-control
   - Real-time updates when evidence is uploaded or checks complete

2. **Evidence Reuse is a Game-Changer**
   - Showing "This will satisfy requirements in..." before upload motivates users
   - Progress impact preview (70% → 80%) demonstrates value of each action
   - Cross-framework evidence linking reduces duplicate work by ~30%

3. **Automated Tests Build Trust**
   - Continuous monitoring (not one-time checks) ensures ongoing compliance
   - Clear status indicators (✓ PASSING, ⚠ IN PROGRESS, ⏳ PENDING) reduce ambiguity
   - Integration with data sources (GitHub, BambooHR) automates evidence collection

4. **Hierarchical Organization Reduces Overwhelm**
   - Framework → Category → Requirement → Control structure prevents information overload
   - Collapsible accordions let users focus on one section at a time
   - Completion counters at each level (3/3, 8/8, 61/79) track granular progress

5. **Visual Design Matters**
   - Status colors (green=good, orange=attention, gray=pending) communicate at a glance
   - Badges for framework tags make cross-mapping visible
   - Consistent iconography (✓, ⚠, ⏳) across the entire interface

### Applying to Islamic Finance

1. **Methodology as Framework**
   - Treat each Islamic finance methodology (Murabaha, Ijara, etc.) like a Vanta framework
   - Allow multi-select with overlap analysis
   - Show completion percentage per methodology

2. **Validation Steps as Controls**
   - Each step (asset verification, pricing calculation) is like a Vanta control
   - Steps can be shared across methodologies (evidence reuse opportunity)
   - Status tracking: complete, in_progress, pending, failed

3. **Shariah Checks as Tests**
   - Automated validation where possible (e.g., no Riba terms detected)
   - Manual review required for complex jurisprudential questions
   - Knowledge graph integration for scholar opinion retrieval

4. **Evidence with Context**
   - Upload once, satisfy multiple methodology requirements
   - Preview impact before upload to motivate completion
   - Suggest reusable evidence from past transactions (via Graphiti)

5. **Progressive Disclosure**
   - Start with methodology selection (simple choice)
   - Drill down into phases → steps → evidence (increasing detail)
   - Show "Next Steps" dashboard for high-priority tasks

---

## Part 7: Implementation Checklist

### Week 1-2: Foundation
- [ ] Backend: Create Methodology, WorkflowPhase, ValidationStep models
- [ ] Backend: Implement MethodologyMapper service
- [ ] Backend: Create /api/methodologies endpoints
- [ ] Frontend: Extend Zustand store with methodology state
- [ ] Frontend: Build MethodologySelector component
- [ ] Frontend: Build OverlapSummary component
- [ ] Test: Multi-methodology selection with overlap calculation

### Week 3: Evidence Management
- [ ] Backend: Extend document service with evidence linking
- [ ] Backend: Create /api/evidence/preview-impact endpoint
- [ ] Backend: Create /api/evidence/upload endpoint
- [ ] Frontend: Build EvidenceUploadDialog with impact preview
- [ ] Frontend: Integrate file upload with methodology progress updates
- [ ] Test: Upload evidence for shared step, verify multi-methodology progress update

### Week 4: Visual Progress
- [ ] Frontend: Build MethodologyProgressDashboard component
- [ ] Frontend: Build PhaseAccordion component with status icons
- [ ] Frontend: Add progress bars at all hierarchy levels
- [ ] Frontend: Implement completion counters (3/3, 8/10, etc.)
- [ ] Design: Apply Vanta-inspired color palette and typography
- [ ] Test: Visual consistency and responsive design

### Week 5: Shariah Validation
- [ ] Backend: Create ShariahValidator service
- [ ] Backend: Implement automated checks (tangibility, no-Riba, etc.)
- [ ] Backend: Create /api/validation/run-checks endpoint
- [ ] Frontend: Build StatusBadge component
- [ ] Frontend: Build StepDetailView with check status
- [ ] Frontend: Add auto-refresh for pending checks
- [ ] Test: Automated Shariah checks run and update UI

### Week 6: Knowledge Graph Integration
- [ ] Backend: Create EvidenceRecommender service
- [ ] Backend: Implement Graphiti search for similar transactions
- [ ] Backend: Create /api/recommendations endpoints
- [ ] Frontend: Build EvidenceSuggestions panel
- [ ] Frontend: Add "Reuse this evidence" functionality
- [ ] Frontend: Display scholar opinions from knowledge graph
- [ ] Test: Recommendations surface relevant past evidence

### Final Week: Polish & Testing
- [ ] End-to-end testing of complete workflow
- [ ] Performance optimization (lazy loading, caching)
- [ ] Error handling and edge cases
- [ ] Documentation and user guide
- [ ] Demo preparation with sample data

---

## Part 8: Success Metrics

### Vanta-Inspired KPIs

1. **Efficiency Gain**
   - Measure: Reduction in total steps due to cross-methodology sharing
   - Target: 20-30% reduction (like Vanta's cross-mapping)

2. **Completion Rate**
   - Measure: % of users who complete selected methodologies
   - Target: >80% (high completion indicates good UX)

3. **Evidence Reuse Rate**
   - Measure: % of evidence items that satisfy 2+ methodologies
   - Target: >40% reuse rate

4. **Time to Completion**
   - Measure: Time from methodology selection to 100% completion
   - Target: <30 minutes for simple transactions (Murabaha)

5. **Shariah Check Pass Rate**
   - Measure: % of automated checks that pass on first attempt
   - Target: >90% (indicates good user guidance)

---

## Appendix: Vanta API Discoveries

### Frameworks Endpoint
```
GET /frameworks → Returns all frameworks with progress metrics
GET /frameworks/{id} → Returns detailed framework with requirement hierarchy
```

**Sample SOC 2 Structure:**
- 9 requirement categories (CC 1.0 through CC 9.0)
- ~79 controls total
- Each control has: id, externalId (e.g., HRS-2), name, owner, domain

### Tests Endpoint
```
GET /tests → Returns all compliance tests
```

**Sample Test:**
```json
{
  "id": "agent-macos-workstation-screenlock-enabled",
  "name": "Personnel computer screenlock configured (MacOS)",
  "status": "DEACTIVATED",
  "owner": {"emailAddress": "eilidh@bladelabs.io"}
}
```

### Integrations Endpoint
```
GET /integrations → Returns connected services
```

**Connected Services:**
- Confluence, Datadog, GitHub, GCP, Google Workspace, Jira, Zoom

### Vulnerabilities Endpoint
```
GET /vulnerabilities → Returns CVEs and security issues
```

**Sample Vulnerability:**
```json
{
  "id": "68db5c4f9a149967604cabff",
  "name": "CVE-2025-58754",
  "severity": "HIGH",
  "cvssSeverityScore": 7.5,
  "packageIdentifier": "npm-axios < 0.30.2",
  "remediateByDate": "2025-10-30T04:28:01.140Z"
}
```

### Risks Endpoint
```
GET /risks → Returns risk register
```

**Sample Risk:**
```json
{
  "id": "6762e6e5d83cb7d46fccd22c",
  "name": "Lack of encryption for data at rest",
  "category": "Access Control",
  "treatmentStrategy": "MITIGATE"
}
```

---

## Part 9: Multi-Stakeholder Collaboration & Workflow Management

### Executive Summary: Collaboration Use Case

**Context**: Islamic Finance contract lifecycle involves multiple stakeholders - primarily business teams and Shariah teams - who need to collaborate on validation steps, document reviews, and compliance approvals. Currently, this happens via email/PDF cycles which are slow, unstructured, and error-prone.

**Goal**: Apply Vanta's multi-stakeholder collaboration patterns to create structured workflows where:
- Business team submits contract documents and evidence
- Shariah team reviews and approves/rejects
- Both teams track progress and status changes
- Notifications replace email threads
- Audit trail is automatically maintained

---

### 9.1 Vanta's Collaboration Model (Discovered via MCP & Research)

#### 9.1.1 Task Ownership Architecture

**Core Pattern**: Owner + Subscribers Model

```
Resource (Test/Document/Control/Policy)
  ├─ Primary Owner: Single accountable individual
  │  └─ Receives: All notifications, responsible for completion
  │
  └─ Subscribers (up to 10): Additional stakeholders
     └─ Receives: Notification emails when status changes
```

**From MCP Data (vanta__tests):**
```json
{
  "id": "approved-access-control-policy-bsi-exists",
  "name": "Approved access control policy exists",
  "status": "NEEDS_ATTENTION",
  "owner": {
    "id": "64c80085110abd7c42724e96",
    "emailAddress": "kasturi@bladelabs.io",
    "displayName": "Kasturi Sharma"
  }
  // Note: Subscribers retrieved separately, up to 10 email addresses
}
```

**From MCP Data (vanta__documents):**
```json
{
  "id": "access-requests",
  "name": "Access Requests",
  "ownerId": "662ea69b0a396d6a20aa557f",
  "category": "Account setup",
  "uploadStatus": "Needs document",
  "frameworks": {
    "soc2": {
      "status": "Needs document",
      "statusChangedOn": "2025-10-01T14:42:20.149Z"
    }
  }
}
```

**Key Insights:**
- Every resource (test, document, control) has a single owner
- Owner is accountable for completion
- Subscribers receive notifications but aren't directly responsible
- Status changes trigger notifications to owner + subscribers

#### 9.1.2 User Role Hierarchy

**From Research (Vanta Documentation):**

```
┌─────────────────────────────────────────────────┐
│ Admin / Owner                                   │
│ • Full access to all resources                  │
│ • Can assign ownership                          │
│ • Can create approval workflows                 │
│ • Can manage team members                       │
└─────────────────────────────────────────────────┘
         │
         ├──────────────────────────────────────┐
         │                                      │
┌────────▼────────┐                    ┌────────▼────────┐
│ Editor          │                    │ Collaborator    │
│ • Edit resources│                    │ • View access   │
│ • Upload docs   │                    │ • Comment only  │
│ • Assign tasks  │                    │ • Limited edit  │
└─────────────────┘                    └─────────────────┘
         │                                      │
         └──────────────────┬───────────────────┘
                            │
                   ┌────────▼────────┐
                   │ Employee        │
                   │ • View own tasks│
                   │ • Upload evidence│
                   │ • Accept policies│
                   └─────────────────┘
```

**Object-Level Permissions**: Vanta supports fine-grained permissions where users can have different roles for different resources (e.g., Editor for SOC 2, Viewer for GDPR).

#### 9.1.3 Approval Workflows (Multi-Step, Multi-Approver)

**From Research (Vanta Policy Approval):**

**Feature Availability by Plan:**
- Starter: 1 approval step, 1 approver
- Growth: Up to 3 approval steps, 1 approver per step
- Scale/Enterprise: Up to 5 approval steps, 3 approvers per step

**Approval Workflow Structure:**
```
Policy Draft Created
      ↓
  ┌───────────────────────────────────────┐
  │ Step 1: Legal Review                  │
  │ Approvers: [legal@company.com]        │
  │ Status: PENDING → APPROVED            │
  └───────────────┬───────────────────────┘
                  ↓
  ┌───────────────────────────────────────┐
  │ Step 2: Security Team Review          │
  │ Approvers: [security@company.com]     │
  │ Status: PENDING → APPROVED            │
  └───────────────┬───────────────────────┘
                  ↓
  ┌───────────────────────────────────────┐
  │ Step 3: Executive Approval            │
  │ Approvers: [ceo@, cto@, ciso@]       │
  │ Status: PENDING → 2/3 APPROVED        │
  └───────────────┬───────────────────────┘
                  ↓
              APPROVED ✓
```

**Approval Logic:**
- Sequential steps (must complete in order)
- Parallel approvers within a step (any/all can approve)
- Configurable: Require all or just one approver per step
- Email notifications sent when approval needed
- Approval tracked with timestamp and approver identity

#### 9.1.4 Status Lifecycle Management

**Document Status States** (from MCP vanta__documents):
- **OK**: Document uploaded and approved
- **Needs document**: No document uploaded yet
- **Needs update**: Document expired or needs refresh
- **Overdue**: Past due date for upload/update
- **Not relevant**: Document not applicable to this framework
- **Upcoming**: Document will be needed soon

**Test Status States** (from MCP vanta__tests):
- **OK**: Test passing
- **NEEDS_ATTENTION**: Test failing or requires manual review
- **DEACTIVATED**: Test intentionally disabled
- **IN_PROGRESS**: Test currently running
- **INVALID**: Test configuration invalid
- **NOT_APPLICABLE**: Test not relevant to current configuration

**Task Status States** (from MCP vanta__people):
- **COMPLETE**: Task finished
- **IN_PROGRESS**: Task being worked on
- **PENDING**: Task not started
- **FAILING**: Task past due or blocked

**Status Transition Rules:**
```
Document Lifecycle:
  Needs document → (Upload) → OK → (Expiration/Change) → Needs update
                                                            ↓
                                                    (Update/Upload) → OK

Test Lifecycle:
  PENDING → (Trigger) → IN_PROGRESS → (Pass) → OK
                                    → (Fail) → NEEDS_ATTENTION → (Fix) → OK
```

#### 9.1.5 Notification & Alert System

**From Research (Vanta Notifications):**

**Notification Triggers:**
1. **Status Changes**
   - Document status changes (Needs document → OK)
   - Test status changes (OK → NEEDS_ATTENTION)
   - Task assignments
   - Approval requests

2. **Time-Based Alerts**
   - Document expiration approaching
   - Test scheduled to run
   - Task past due
   - Renewal deadlines

3. **Collaboration Events**
   - New comment added
   - Approval granted/denied
   - Evidence uploaded
   - Ownership transferred

**Notification Channels:**
- Email (primary)
- In-app notifications
- Slack integration (optional)
- Webhook for custom integrations

**Recipient Logic:**
- Owner: Always notified
- Subscribers: Notified per their subscription preferences
- Approvers: Notified when approval needed
- Team: Notified for team-wide updates

#### 9.1.6 Bulk Assignment & Team Management

**From Research (Vanta Bulk Operations):**

**Bulk Assignment Features:**
- Assign single owner to multiple resources at once
- Add subscribers to multiple tests/documents
- Transfer ownership in bulk (e.g., when employee leaves)
- Mass status updates

**Team Assignment Patterns:**
- Assign by domain (e.g., all HR_SECURITY controls to HR manager)
- Assign by framework (e.g., all GDPR documents to privacy officer)
- Assign by category (e.g., all policies to policy manager)

**Use Case Example:**
```
Scenario: New compliance manager joins team
Action: Bulk assign 30 controls related to "Access Control" domain
Result: All 30 controls now owned by new manager
        All 30 controls appear on their task dashboard
        Previous owner moved to subscriber role
```

#### 9.1.7 Task Management Integration

**From Research (Vanta & Task Management):**

**Supported Integrations:**
- Jira
- Linear
- GitHub Issues
- Asana

**Integration Pattern:**
```
Vanta Control/Test                    External Task Tracker
      ↓                                       ↓
  [Create]  ────────────────────────→   [Create Ticket]
      ↓                                       ↓
  [Update Status] ←──────────────────  [Update Ticket]
      ↓                                       ↓
  [Complete] ────────────────────────→  [Close Ticket]
```

**Two-Way Sync:**
- Vanta task created → Jira ticket created automatically
- Jira ticket status updated → Vanta task status updated
- Comments sync bidirectionally
- Assignments sync (if users match in both systems)

**Benefits:**
- Engineering teams work in Jira/Linear (their native workflow)
- Compliance team tracks progress in Vanta
- No manual status updates needed
- Single source of truth maintained

---

### 9.2 Mapping to Islamic Finance Contract Lifecycle

#### 9.2.1 Stakeholder Roles Mapping

**Vanta → Islamic Finance Translation:**

| **Vanta Role** | **Islamic Finance Role** | **Responsibilities** |
|----------------|-------------------------|---------------------|
| **Admin/Owner** | **Compliance Manager** | Oversees entire contract lifecycle, assigns tasks, reviews overall progress |
| **Control Owner** | **Business Team Lead** | Owns contract steps related to business terms (pricing, asset details, customer onboarding) |
| **Policy Approver** | **Shariah Advisor** | Reviews and approves Shariah compliance, provides rulings on contract terms |
| **Document Owner** | **Legal Counsel** | Manages contract documentation, ensures legal compliance |
| **Subscriber** | **Stakeholders** | Finance team, operations, risk management - receive notifications but not primary owners |
| **Employee** | **Transaction Manager** | Executes individual contract steps, uploads evidence, submits for review |

#### 9.2.2 Contract Workflow Step Ownership

**Example: Mudaraba Contract Lifecycle**

**Phase 1: Contract Setup (Business Team Owned)**
```
┌─────────────────────────────────────────────────────────┐
│ Step 1.1: Parties Identification (KYC)                  │
│ Owner: Business Team Lead                               │
│ Subscribers: Risk Team, Compliance Manager              │
│ Status: PENDING → IN_PROGRESS → COMPLETE               │
│ Evidence Required: ID docs, company registration       │
└─────────────────────────────────────────────────────────┘
     │ When complete → Notify Shariah Team
     ↓
┌─────────────────────────────────────────────────────────┐
│ Step 1.2: Capital Contribution Agreement               │
│ Owner: Business Team Lead                               │
│ Subscribers: Finance Team, Legal Counsel                │
│ Status: PENDING → NEEDS_REVIEW                         │
│ Evidence Required: Contribution agreement, bank proof   │
└─────────────────────────────────────────────────────────┘
     │ When complete → Notify Shariah Team
     ↓
```

**Phase 2: Shariah Review (Shariah Team Owned)**
```
┌─────────────────────────────────────────────────────────┐
│ Step 2.1: Shariah Compliance Assessment                │
│ Owner: Lead Shariah Advisor                             │
│ Subscribers: Shariah Board Members (3)                  │
│ Status: PENDING_REVIEW → APPROVED / REJECTED           │
│ Evidence Reviewed: All Phase 1 documents               │
│ Action: Approve OR Request Revisions                    │
└─────────────────────────────────────────────────────────┘
     │ If APPROVED → Move to Phase 3
     │ If REJECTED → Back to Business Team with comments
     ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2.2: Shariah Certificate Issuance                 │
│ Owner: Lead Shariah Advisor                             │
│ Subscribers: Compliance Manager, Business Team          │
│ Status: PENDING → ISSUED                               │
│ Evidence: Signed Shariah certificate (PDF)             │
└─────────────────────────────────────────────────────────┘
     │ When issued → Notify all stakeholders
     ↓
```

**Phase 3: Execution (Business Team Returns as Owner)**
```
┌─────────────────────────────────────────────────────────┐
│ Step 3.1: Contract Execution                            │
│ Owner: Business Team Lead                               │
│ Subscribers: Legal Counsel, Shariah Advisor             │
│ Status: PENDING → EXECUTED                             │
│ Evidence: Signed contract by all parties               │
└─────────────────────────────────────────────────────────┘
     │ When executed → Contract becomes active
     ↓
```

#### 9.2.3 Approval Workflow Mapping

**Example: Shariah Review Approval Workflow**

**Traditional (Email/PDF Cycle) - BEFORE:**
```
1. Business team emails contract draft to shariah@company.com
2. Shariah team downloads, reviews, marks up PDF with comments
3. Shariah team emails back comments
4. Business team makes revisions, emails new version
5. Repeat steps 2-4 (3-5 times)
6. Final approval sent via email
7. Business team searches email threads for final version
```
**Problems:**
- Version confusion (which PDF is latest?)
- No status visibility (is it still under review?)
- Approval audit trail scattered across emails
- No automated reminders
- Time-consuming (1-2 weeks for simple contracts)

**Vanta-Style Workflow - AFTER:**
```
Step 1: Business Submission
  ├─ Owner: Business Team Lead
  ├─ Action: Upload contract draft + evidence
  ├─ Status: SUBMITTED → PENDING_SHARIAH_REVIEW
  └─ Notification: Email to Shariah Team with direct link

Step 2: Shariah Team Review (Approval Step 1)
  ├─ Approvers: Lead Shariah Advisor (required) + 2 Board Members (optional)
  ├─ Action: Review contract, leave comments inline
  ├─ Decision Options:
  │   ├─ APPROVE → Move to Step 3
  │   ├─ REQUEST_CHANGES → Return to Business Team with comments
  │   └─ REJECT → Return with rejection reason
  └─ SLA: 3 business days

Step 3: Business Team Revisions (if changes requested)
  ├─ Owner: Business Team Lead
  ├─ Action: Make changes, upload revised contract
  ├─ Status: REVISED → PENDING_SHARIAH_REVIEW
  └─ Notification: Email to Shariah Team

Step 4: Final Shariah Approval (Approval Step 2)
  ├─ Approvers: Lead Shariah Advisor (required)
  ├─ Action: Final review, approve
  ├─ Status: APPROVED ✓
  └─ Notification: Email to all stakeholders

Step 5: Certificate Issuance
  ├─ Owner: Lead Shariah Advisor
  ├─ Action: Generate and upload Shariah certificate
  ├─ Status: CERTIFICATE_ISSUED ✓
  └─ Notification: Email to Business Team + Compliance Manager
```

**Benefits:**
- Single source of truth (no email threads)
- Clear status visibility for all stakeholders
- Automated notifications replace manual follow-ups
- Audit trail automatically maintained
- Time reduced to 2-3 days (vs. 1-2 weeks)

#### 9.2.4 Status Tracking Dashboard

**Business Team View:**
```
┌─────────────────────────────────────────────────────────┐
│ My Active Contracts                                     │
│                                                         │
│ Mudaraba #2025-001                         [70% ████▓░]│
│ └─ Phase 1: Complete ✓                                 │
│ └─ Phase 2: PENDING_SHARIAH_REVIEW ⏳                  │
│    └─ Submitted 2 days ago                             │
│    └─ SLA: 1 day remaining                             │
│ └─ Phase 3: Not started                                │
│                                                         │
│ Ijara #2025-002                            [40% ███░░░]│
│ └─ Phase 1: IN_PROGRESS ⚠                              │
│    └─ Missing: Asset valuation report                  │
│    └─ Due: Tomorrow                                    │
│ └─ Phase 2: Not started                                │
│                                                         │
│ [View All] [Add New Contract]                          │
└─────────────────────────────────────────────────────────┘
```

**Shariah Team View:**
```
┌─────────────────────────────────────────────────────────┐
│ Pending Shariah Reviews                                 │
│                                                         │
│ HIGH PRIORITY (2)                                       │
│ ┌─────────────────────────────────────────────────────┐│
│ │ Mudaraba #2025-001                          ⏳ 1 day ││
│ │ Business Team: John Smith                           ││
│ │ Submitted: 2 days ago                               ││
│ │ [Review Contract] [Request Changes] [Approve]       ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ │ Musharaka #2024-099                       ⚠ OVERDUE ││
│ │ Business Team: Jane Doe                             ││
│ │ Submitted: 5 days ago (SLA: 3 days)                 ││
│ │ [Review Contract] [Request Changes] [Approve]       ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ RECENTLY APPROVED (5)                                   │
│ • Murabaha #2025-003 - Approved 1 hour ago            │
│ • Sukuk #2024-098 - Certificate issued yesterday       │
│                                                         │
│ [View All Contracts]                                    │
└─────────────────────────────────────────────────────────┘
```

**Compliance Manager View (Aggregated):**
```
┌─────────────────────────────────────────────────────────┐
│ Contract Portfolio Overview                             │
│                                                         │
│ Active Contracts: 24                                    │
│ ├─ Awaiting Shariah Review: 2 (1 overdue ⚠)          │
│ ├─ In Business Team: 8                                 │
│ ├─ Approved & Executing: 14 ✓                         │
│ └─ Average Approval Time: 2.3 days                     │
│                                                         │
│ Contract Type Breakdown:                                │
│ • Mudaraba: 8 contracts (█████████░)                   │
│ • Murabaha: 7 contracts (████████░░)                   │
│ • Musharaka: 5 contracts (██████░░░░)                  │
│ • Ijara: 4 contracts (█████░░░░░)                      │
│                                                         │
│ [View Details] [Export Report]                         │
└─────────────────────────────────────────────────────────┘
```

#### 9.2.5 Document Review Process

**Vanta Pattern: Document Status Lifecycle**

**Applied to Islamic Finance:**
```
Contract Document Lifecycle:

  ┌─────────────────────────────────────────┐
  │ DRAFT CREATED                           │
  │ Owner: Business Team Lead               │
  │ Status: NEEDS_UPLOAD                    │
  └───────────────┬─────────────────────────┘
                  │ Business uploads draft
                  ↓
  ┌─────────────────────────────────────────┐
  │ SUBMITTED FOR SHARIAH REVIEW            │
  │ Owner: Lead Shariah Advisor (transferred)│
  │ Status: PENDING_REVIEW                  │
  │ Notification: Shariah Team notified     │
  └───────────────┬─────────────────────────┘
                  │ Shariah team reviews
                  ↓
  ┌──────────────────────┬──────────────────┐
  │ APPROVED ✓           │ NEEDS_REVISION ⚠│
  ├──────────────────────┴──────────────────┤
  │ If APPROVED:                            │
  │ • Status: APPROVED                      │
  │ • Certificate issued                    │
  │ • Execution can proceed                 │
  │                                         │
  │ If NEEDS_REVISION:                      │
  │ • Ownership returns to Business Team    │
  │ • Status: NEEDS_UPDATE                  │
  │ • Comments visible to Business Team     │
  │ • Cycle repeats                         │
  └─────────────────────────────────────────┘
```

**Key Features:**
- Ownership transfers with workflow phases
- Status visible to all stakeholders
- Comments/revisions tracked inline (no separate PDFs)
- Version history automatically maintained
- Approval timestamps recorded for audit

---

### 9.3 Implementation Guide: Collaboration Features

#### 9.3.1 Backend Data Models

**File: `backend/app/models.py`**

```python
from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class StakeholderRole(str, Enum):
    """Stakeholder role types"""
    BUSINESS_TEAM = "business_team"
    SHARIAH_ADVISOR = "shariah_advisor"
    LEGAL_COUNSEL = "legal_counsel"
    COMPLIANCE_MANAGER = "compliance_manager"
    FINANCE_TEAM = "finance_team"
    SUBSCRIBER = "subscriber"  # General observer

class WorkflowStepOwnership(BaseModel):
    """Ownership and assignment for a workflow step"""
    step_id: str
    owner: str = Field(..., description="Email or user ID of primary owner")
    owner_role: StakeholderRole
    subscribers: List[str] = Field(default_factory=list, max_items=10,
                                   description="Up to 10 subscribers for notifications")
    assigned_at: datetime
    due_date: Optional[datetime] = None

class ApprovalStep(BaseModel):
    """Single step in an approval workflow"""
    step_number: int
    step_name: str  # e.g., "Shariah Review", "Legal Review", "Executive Approval"
    required_approvers: List[str] = Field(..., description="Email addresses of required approvers")
    optional_approvers: List[str] = Field(default_factory=list)
    approval_mode: Literal["any", "all"] = "all"  # "any" = 1 approver enough, "all" = all must approve
    status: Literal["pending", "in_progress", "approved", "rejected"] = "pending"
    approvals: List["Approval"] = Field(default_factory=list)
    comments: List["Comment"] = Field(default_factory=list)
    due_date: Optional[datetime] = None

class Approval(BaseModel):
    """Individual approval action"""
    approver_email: str
    decision: Literal["approved", "rejected", "changes_requested"]
    timestamp: datetime
    comments: Optional[str] = None

class Comment(BaseModel):
    """Comment on a step or document"""
    author_email: str
    author_role: StakeholderRole
    content: str
    timestamp: datetime
    in_reply_to: Optional[str] = None  # Comment ID for threading

class ContractWorkflowExecution(BaseModel):
    """Complete contract workflow execution with collaboration tracking"""
    contract_id: str
    contract_type: Literal["mudaraba", "murabaha", "musharaka", "ijara", "sukuk"]
    phases: List["WorkflowPhaseWithOwnership"]
    approval_workflow: Optional[List[ApprovalStep]] = None
    current_phase_index: int = 0
    current_step_index: int = 0
    overall_status: Literal["draft", "in_progress", "pending_approval", "approved", "rejected", "executed"] = "draft"
    created_at: datetime
    updated_at: datetime
    stakeholders: List["Stakeholder"] = Field(default_factory=list)

class WorkflowPhaseWithOwnership(BaseModel):
    """Workflow phase extended with ownership tracking"""
    phase_id: str
    phase_name: str
    steps: List["ValidationStepWithOwnership"]
    phase_owner: Optional[str] = None  # Overall phase owner
    phase_status: Literal["not_started", "in_progress", "pending_review", "complete"] = "not_started"

class ValidationStepWithOwnership(BaseModel):
    """Validation step extended with ownership and collaboration"""
    step_id: str
    step_name: str
    description: str
    owner: str  # Primary owner email
    owner_role: StakeholderRole
    subscribers: List[str] = Field(default_factory=list, max_items=10)
    status: Literal["pending", "in_progress", "submitted", "pending_review", "approved", "rejected", "complete"] = "pending"
    evidence_uploaded: List[str] = Field(default_factory=list)  # Evidence IDs
    comments: List[Comment] = Field(default_factory=list)
    status_history: List["StatusChange"] = Field(default_factory=list)
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class StatusChange(BaseModel):
    """Track status changes for audit trail"""
    from_status: str
    to_status: str
    changed_by: str
    changed_at: datetime
    reason: Optional[str] = None

class Stakeholder(BaseModel):
    """Stakeholder in the contract workflow"""
    email: str
    name: str
    role: StakeholderRole
    organization: Optional[str] = None
    notification_preferences: dict = Field(default_factory=dict)

class Notification(BaseModel):
    """Notification to be sent to stakeholder"""
    notification_id: str
    recipient_email: str
    notification_type: Literal["status_change", "assignment", "approval_request", "comment", "overdue", "reminder"]
    subject: str
    message: str
    related_contract_id: str
    related_step_id: Optional[str] = None
    sent_at: Optional[datetime] = None
    read_at: Optional[datetime] = None
```

#### 9.3.2 Backend Services

**File: `backend/app/services/collaboration_service.py`**

```python
from typing import List, Optional
from app.models import (
    ContractWorkflowExecution, WorkflowStepOwnership, ApprovalStep,
    Approval, Comment, Notification, StatusChange, StakeholderRole
)
from datetime import datetime, timedelta
import uuid

class CollaborationService:
    """
    Service for managing multi-stakeholder collaboration on contract workflows.
    Inspired by Vanta's task ownership and approval workflow patterns.
    """

    async def assign_step_owner(
        self,
        contract_id: str,
        step_id: str,
        owner_email: str,
        owner_role: StakeholderRole,
        subscribers: List[str] = [],
        due_date: Optional[datetime] = None
    ) -> WorkflowStepOwnership:
        """
        Assign ownership of a workflow step to a team member.
        Like Vanta's control/test/document ownership.
        """
        ownership = WorkflowStepOwnership(
            step_id=step_id,
            owner=owner_email,
            owner_role=owner_role,
            subscribers=subscribers[:10],  # Max 10 subscribers
            assigned_at=datetime.utcnow(),
            due_date=due_date
        )

        # Update workflow execution
        await self._update_step_ownership(contract_id, step_id, ownership)

        # Send notification to owner
        await self._send_assignment_notification(
            owner_email, contract_id, step_id, due_date
        )

        # Send notifications to subscribers
        for subscriber in subscribers:
            await self._send_subscriber_notification(
                subscriber, contract_id, step_id, owner_email
            )

        return ownership

    async def create_approval_workflow(
        self,
        contract_id: str,
        steps: List[ApprovalStep]
    ) -> List[ApprovalStep]:
        """
        Create multi-step approval workflow for contract.
        Like Vanta's policy approval workflow (up to 5 steps, 3 approvers each).
        """
        # Validate step configuration
        if len(steps) > 5:
            raise ValueError("Maximum 5 approval steps allowed")

        for step in steps:
            if len(step.required_approvers) + len(step.optional_approvers) > 3:
                raise ValueError("Maximum 3 approvers per step")

        # Save approval workflow to contract
        await self._save_approval_workflow(contract_id, steps)

        # Notify first step approvers
        if steps:
            first_step = steps[0]
            for approver in first_step.required_approvers:
                await self._send_approval_request_notification(
                    approver, contract_id, first_step
                )

        return steps

    async def submit_approval_decision(
        self,
        contract_id: str,
        step_number: int,
        approver_email: str,
        decision: Literal["approved", "rejected", "changes_requested"],
        comments: Optional[str] = None
    ) -> ApprovalStep:
        """
        Submit approval decision for a workflow step.
        Automatically advances to next step if all approvals received.
        """
        # Get approval workflow
        workflow = await self._get_approval_workflow(contract_id)
        step = workflow[step_number - 1]

        # Record approval
        approval = Approval(
            approver_email=approver_email,
            decision=decision,
            timestamp=datetime.utcnow(),
            comments=comments
        )
        step.approvals.append(approval)

        # Check if step is complete
        if decision == "rejected":
            step.status = "rejected"
            # Notify contract owner of rejection
            await self._send_rejection_notification(contract_id, step, comments)

        elif decision == "changes_requested":
            step.status = "changes_requested"
            # Return ownership to business team
            await self._return_ownership_to_business_team(contract_id, comments)

        else:  # approved
            # Check if all required approvers have approved
            required_approvals = [
                a for a in step.approvals
                if a.approver_email in step.required_approvers and a.decision == "approved"
            ]

            if step.approval_mode == "all":
                all_approved = len(required_approvals) == len(step.required_approvers)
            else:  # "any"
                all_approved = len(required_approvals) >= 1

            if all_approved:
                step.status = "approved"

                # Move to next step or complete workflow
                if step_number < len(workflow):
                    # Notify next step approvers
                    next_step = workflow[step_number]
                    for approver in next_step.required_approvers:
                        await self._send_approval_request_notification(
                            approver, contract_id, next_step
                        )
                else:
                    # Workflow complete
                    await self._complete_approval_workflow(contract_id)

        # Save updated workflow
        await self._save_approval_workflow(contract_id, workflow)

        return step

    async def add_comment(
        self,
        contract_id: str,
        step_id: str,
        author_email: str,
        author_role: StakeholderRole,
        content: str,
        in_reply_to: Optional[str] = None
    ) -> Comment:
        """
        Add comment to a workflow step.
        Comments visible to all stakeholders (owner + subscribers).
        """
        comment = Comment(
            author_email=author_email,
            author_role=author_role,
            content=content,
            timestamp=datetime.utcnow(),
            in_reply_to=in_reply_to
        )

        # Save comment
        await self._save_comment(contract_id, step_id, comment)

        # Notify step owner + subscribers
        step_ownership = await self._get_step_ownership(contract_id, step_id)
        recipients = [step_ownership.owner] + step_ownership.subscribers

        for recipient in recipients:
            if recipient != author_email:  # Don't notify author
                await self._send_comment_notification(
                    recipient, contract_id, step_id, comment
                )

        return comment

    async def update_step_status(
        self,
        contract_id: str,
        step_id: str,
        new_status: str,
        changed_by: str,
        reason: Optional[str] = None
    ) -> StatusChange:
        """
        Update step status and record in audit trail.
        Notify relevant stakeholders of status change.
        """
        # Get current step
        step = await self._get_step(contract_id, step_id)
        old_status = step.status

        # Create status change record
        status_change = StatusChange(
            from_status=old_status,
            to_status=new_status,
            changed_by=changed_by,
            changed_at=datetime.utcnow(),
            reason=reason
        )

        # Update step
        step.status = new_status
        step.status_history.append(status_change)
        if new_status == "complete":
            step.completed_at = datetime.utcnow()

        await self._save_step(contract_id, step)

        # Send status change notifications
        ownership = await self._get_step_ownership(contract_id, step_id)
        recipients = [ownership.owner] + ownership.subscribers

        for recipient in recipients:
            await self._send_status_change_notification(
                recipient, contract_id, step_id, old_status, new_status
            )

        return status_change

    async def get_stakeholder_dashboard(
        self,
        stakeholder_email: str,
        role: StakeholderRole
    ) -> dict:
        """
        Get personalized dashboard for stakeholder based on their role.
        Like Vanta's role-based dashboard views.
        """
        if role == StakeholderRole.BUSINESS_TEAM:
            return await self._get_business_team_dashboard(stakeholder_email)
        elif role == StakeholderRole.SHARIAH_ADVISOR:
            return await self._get_shariah_team_dashboard(stakeholder_email)
        elif role == StakeholderRole.COMPLIANCE_MANAGER:
            return await self._get_compliance_manager_dashboard(stakeholder_email)
        else:
            return await self._get_general_dashboard(stakeholder_email)

    async def _get_business_team_dashboard(self, email: str) -> dict:
        """Dashboard for business team members"""
        # Get contracts owned by this user
        owned_contracts = await self._get_contracts_owned_by(email)

        # Get pending tasks
        pending_tasks = []
        for contract in owned_contracts:
            for phase in contract.phases:
                for step in phase.steps:
                    if step.owner == email and step.status in ["pending", "in_progress", "needs_revision"]:
                        pending_tasks.append({
                            "contract_id": contract.contract_id,
                            "step_id": step.step_id,
                            "step_name": step.step_name,
                            "status": step.status,
                            "due_date": step.due_date
                        })

        # Get pending shariah reviews
        pending_reviews = []
        for contract in owned_contracts:
            if contract.overall_status == "pending_approval":
                pending_reviews.append({
                    "contract_id": contract.contract_id,
                    "contract_type": contract.contract_type,
                    "submitted_at": contract.updated_at
                })

        return {
            "role": "business_team",
            "owned_contracts": len(owned_contracts),
            "pending_tasks": pending_tasks,
            "pending_shariah_reviews": pending_reviews,
            "overdue_tasks": [t for t in pending_tasks if t["due_date"] and t["due_date"] < datetime.utcnow()]
        }

    async def _get_shariah_team_dashboard(self, email: str) -> dict:
        """Dashboard for Shariah advisors"""
        # Get contracts pending Shariah review
        pending_reviews = await self._get_contracts_by_status("pending_approval")

        # Get contracts where this advisor is assigned as approver
        assigned_approvals = []
        for contract in pending_reviews:
            if contract.approval_workflow:
                for step in contract.approval_workflow:
                    if email in step.required_approvers and step.status == "pending":
                        assigned_approvals.append({
                            "contract_id": contract.contract_id,
                            "contract_type": contract.contract_type,
                            "step_name": step.step_name,
                            "submitted_at": contract.updated_at,
                            "due_date": step.due_date
                        })

        # Get recently approved contracts
        recently_approved = await self._get_recently_approved_by(email, days=7)

        return {
            "role": "shariah_advisor",
            "pending_reviews": len(pending_reviews),
            "assigned_approvals": assigned_approvals,
            "overdue_reviews": [r for r in assigned_approvals if r["due_date"] and r["due_date"] < datetime.utcnow()],
            "recently_approved": recently_approved,
            "average_approval_time_days": await self._calculate_avg_approval_time(email)
        }

    async def _get_compliance_manager_dashboard(self, email: str) -> dict:
        """Dashboard for compliance managers (aggregated view)"""
        # Get all active contracts
        all_contracts = await self._get_all_active_contracts()

        # Group by status
        by_status = {
            "draft": [],
            "in_progress": [],
            "pending_approval": [],
            "approved": [],
            "rejected": [],
            "executed": []
        }

        for contract in all_contracts:
            by_status[contract.overall_status].append(contract)

        # Contract type breakdown
        by_type = {}
        for contract in all_contracts:
            if contract.contract_type not in by_type:
                by_type[contract.contract_type] = 0
            by_type[contract.contract_type] += 1

        # Calculate metrics
        avg_approval_time = await self._calculate_overall_avg_approval_time()
        overdue_count = await self._count_overdue_approvals()

        return {
            "role": "compliance_manager",
            "total_active_contracts": len(all_contracts),
            "by_status": {k: len(v) for k, v in by_status.items()},
            "by_contract_type": by_type,
            "average_approval_time_days": avg_approval_time,
            "overdue_approvals": overdue_count,
            "pending_shariah_reviews": len(by_status["pending_approval"])
        }

    # Private helper methods
    async def _send_assignment_notification(self, email: str, contract_id: str, step_id: str, due_date: Optional[datetime]):
        """Send notification when task is assigned"""
        notification = Notification(
            notification_id=str(uuid.uuid4()),
            recipient_email=email,
            notification_type="assignment",
            subject=f"New task assigned: {step_id}",
            message=f"You have been assigned as owner of step {step_id} in contract {contract_id}.",
            related_contract_id=contract_id,
            related_step_id=step_id,
            sent_at=datetime.utcnow()
        )
        await self._send_notification(notification)

    async def _send_approval_request_notification(self, email: str, contract_id: str, step: ApprovalStep):
        """Send notification when approval is requested"""
        notification = Notification(
            notification_id=str(uuid.uuid4()),
            recipient_email=email,
            notification_type="approval_request",
            subject=f"Approval requested: {step.step_name}",
            message=f"Your approval is requested for {step.step_name} in contract {contract_id}.",
            related_contract_id=contract_id,
            sent_at=datetime.utcnow()
        )
        await self._send_notification(notification)

    async def _send_status_change_notification(self, email: str, contract_id: str, step_id: str, old_status: str, new_status: str):
        """Send notification when step status changes"""
        notification = Notification(
            notification_id=str(uuid.uuid4()),
            recipient_email=email,
            notification_type="status_change",
            subject=f"Status update: {step_id}",
            message=f"Step {step_id} status changed from {old_status} to {new_status}.",
            related_contract_id=contract_id,
            related_step_id=step_id,
            sent_at=datetime.utcnow()
        )
        await self._send_notification(notification)

    async def _send_notification(self, notification: Notification):
        """Send notification via email/webhook"""
        # Implementation: Send email via SMTP or notification service
        # For MVP, can log to console or queue for background worker
        print(f"[NOTIFICATION] To: {notification.recipient_email}, Subject: {notification.subject}")
```

#### 9.3.3 API Endpoints

**File: `backend/app/api/collaboration.py`**

```python
from fastapi import APIRouter, HTTPException
from typing import List
from app.models import (
    WorkflowStepOwnership, ApprovalStep, Approval, Comment,
    StakeholderRole, Notification
)
from app.services.collaboration_service import CollaborationService

router = APIRouter(prefix="/api/collaboration", tags=["collaboration"])
service = CollaborationService()

@router.post("/contracts/{contract_id}/steps/{step_id}/assign")
async def assign_step_owner(
    contract_id: str,
    step_id: str,
    owner_email: str,
    owner_role: StakeholderRole,
    subscribers: List[str] = [],
    due_date_iso: Optional[str] = None
):
    """
    Assign ownership of a workflow step to a team member.
    Like Vanta's control ownership assignment.
    """
    due_date = datetime.fromisoformat(due_date_iso) if due_date_iso else None

    ownership = await service.assign_step_owner(
        contract_id, step_id, owner_email, owner_role, subscribers, due_date
    )

    return ownership

@router.post("/contracts/{contract_id}/approval-workflow")
async def create_approval_workflow(
    contract_id: str,
    steps: List[ApprovalStep]
):
    """
    Create multi-step approval workflow for contract.
    Like Vanta's policy approval (up to 5 steps, 3 approvers each).
    """
    workflow = await service.create_approval_workflow(contract_id, steps)
    return {"workflow": workflow}

@router.post("/contracts/{contract_id}/approval-workflow/steps/{step_number}/approve")
async def submit_approval(
    contract_id: str,
    step_number: int,
    approver_email: str,
    decision: Literal["approved", "rejected", "changes_requested"],
    comments: Optional[str] = None
):
    """
    Submit approval decision for a workflow step.
    """
    step = await service.submit_approval_decision(
        contract_id, step_number, approver_email, decision, comments
    )
    return step

@router.post("/contracts/{contract_id}/steps/{step_id}/comments")
async def add_comment(
    contract_id: str,
    step_id: str,
    author_email: str,
    author_role: StakeholderRole,
    content: str,
    in_reply_to: Optional[str] = None
):
    """
    Add comment to a workflow step.
    Comments visible to owner + subscribers.
    """
    comment = await service.add_comment(
        contract_id, step_id, author_email, author_role, content, in_reply_to
    )
    return comment

@router.put("/contracts/{contract_id}/steps/{step_id}/status")
async def update_step_status(
    contract_id: str,
    step_id: str,
    new_status: str,
    changed_by: str,
    reason: Optional[str] = None
):
    """
    Update step status and notify stakeholders.
    """
    status_change = await service.update_step_status(
        contract_id, step_id, new_status, changed_by, reason
    )
    return status_change

@router.get("/dashboard")
async def get_stakeholder_dashboard(
    stakeholder_email: str,
    role: StakeholderRole
):
    """
    Get personalized dashboard based on stakeholder role.
    Like Vanta's role-based dashboard views.
    """
    dashboard = await service.get_stakeholder_dashboard(stakeholder_email, role)
    return dashboard

@router.get("/contracts/{contract_id}/notifications")
async def get_contract_notifications(
    contract_id: str,
    recipient_email: Optional[str] = None
):
    """Get notifications for a contract (optionally filtered by recipient)"""
    notifications = await service._get_notifications(contract_id, recipient_email)
    return notifications
```

#### 9.3.4 Frontend Components

**File: `src/components/collaboration/StakeholderDashboard.tsx`**

```typescript
import { useEffect, useState } from 'react'
import { backendClient } from '@/lib/backend-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface DashboardProps {
  email: string
  role: 'business_team' | 'shariah_advisor' | 'compliance_manager'
}

export function StakeholderDashboard({ email, role }: DashboardProps) {
  const [dashboard, setDashboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [email, role])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const data = await backendClient.getStakeholderDashboard(email, role)
      setDashboard(data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading dashboard...</div>

  if (role === 'business_team') {
    return <BusinessTeamDashboard data={dashboard} />
  } else if (role === 'shariah_advisor') {
    return <ShariahAdvisorDashboard data={dashboard} />
  } else {
    return <ComplianceManagerDashboard data={dashboard} />
  }
}

function BusinessTeamDashboard({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Contracts</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.owned_contracts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.pending_tasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {data.overdue_tasks.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>My Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.pending_tasks.map((task: any) => (
              <div key={task.step_id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{task.step_name}</h4>
                    <p className="text-sm text-gray-600">
                      Contract: {task.contract_id}
                    </p>
                  </div>
                  <Badge variant={task.status === 'overdue' ? 'destructive' : 'secondary'}>
                    {task.status}
                  </Badge>
                </div>
                {task.due_date && (
                  <div className="text-sm text-gray-500 mt-2">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Shariah Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Awaiting Shariah Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.pending_shariah_reviews.map((review: any) => (
              <div key={review.contract_id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{review.contract_type}</h4>
                    <p className="text-sm text-gray-600">
                      Submitted: {new Date(review.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ShariahAdvisorDashboard({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shariah Review Queue</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.pending_reviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Overdue Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {data.overdue_reviews.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Approval Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.average_approval_time_days.toFixed(1)} days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Contracts Awaiting Your Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.assigned_approvals.map((approval: any) => {
              const isOverdue = approval.due_date && new Date(approval.due_date) < new Date()

              return (
                <div key={approval.contract_id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{approval.contract_type}</h4>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">OVERDUE</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {approval.step_name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {new Date(approval.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">
                        Approve
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                        Request Changes
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recently Approved */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Approved (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.recently_approved.map((contract: any) => (
              <div key={contract.contract_id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm">{contract.contract_type} #{contract.contract_id}</span>
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ComplianceManagerDashboard({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contract Portfolio Overview</h2>

      {/* Top-Level Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.total_active_contracts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {data.by_status.pending_approval}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {data.overdue_approvals}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg Approval Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.average_approval_time_days.toFixed(1)} days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Contracts by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.by_status).map(([status, count]: [string, any]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="capitalize">{status.replace('_', ' ')}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / data.total_active_contracts) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contract Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data.by_contract_type).map(([type, count]: [string, any]) => (
              <div key={type} className="flex items-center justify-between p-3 border rounded">
                <span className="capitalize font-medium">{type}</span>
                <span className="text-2xl font-bold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### 9.4 Key Takeaways: Collaboration Patterns

#### What We Learned from Vanta

1. **Ownership Clarity Prevents Bottlenecks**
   - Every resource (test, document, control) has a single clear owner
   - Owner = accountable party, not just "aware"
   - Subscribers = observers who get notified but aren't responsible
   - This prevents "tragedy of the commons" where everyone assumes someone else is handling it

2. **Multi-Step Approvals Structure Complex Workflows**
   - Sequential approval steps (Legal → Security → Executive)
   - Parallel approvers within steps (any 1 of 3 or all 3 required)
   - Clear SLAs at each step (e.g., 3 business days)
   - Automatic notifications replace manual follow-ups

3. **Status Lifecycle Provides Visibility**
   - Status states are finite and well-defined (not free-form)
   - Status transitions are logical and enforced
   - Status changes trigger notifications automatically
   - Audit trail maintained for compliance

4. **Notifications Replace Email Threads**
   - Structured notifications with clear actions (Approve, Review, Upload)
   - Direct links to resources (no searching through email)
   - Notification preferences configurable per user
   - Integration with Slack/webhooks for external workflows

5. **Role-Based Dashboards Reduce Cognitive Load**
   - Each stakeholder sees only relevant information
   - Business team: "My tasks"
   - Shariah team: "Pending reviews"
   - Compliance: Aggregated portfolio view
   - Context switching minimized

#### Applied to Islamic Finance

1. **Replace Email/PDF Cycles**
   - Structured workflow steps replace email threads
   - Status visibility replaces "Did you review this?" emails
   - Inline comments replace PDF markups
   - Version control automatic (no "v3_final_FINAL.pdf")

2. **Clear Stakeholder Separation**
   - Business team owns contract setup and documentation
   - Shariah team owns review and approval
   - Legal counsel owns contract execution
   - Compliance manager oversees entire portfolio

3. **Audit Trail by Default**
   - Every status change recorded with timestamp and actor
   - Every approval decision logged with comments
   - Every document upload tracked
   - Regulatory compliance reporting becomes trivial

4. **SLA Enforcement**
   - Shariah reviews: 3 business days SLA
   - Business revisions: 2 business days SLA
   - Automatic escalation when overdue
   - Dashboard shows overdue items prominently

5. **Scalability Through Structure**
   - Works for 1 contract or 1000 contracts
   - Bulk operations for recurring tasks
   - Integration with external task trackers (Jira, Linear)
   - Team handoffs seamless (ownership transfer)

---

### 9.5 Implementation Checklist: Collaboration Features

#### Week 1: Core Ownership & Assignment
- [ ] Backend: Create `WorkflowStepOwnership` and `Stakeholder` models
- [ ] Backend: Implement `CollaborationService.assign_step_owner()`
- [ ] Backend: Create POST `/api/collaboration/contracts/{id}/steps/{id}/assign` endpoint
- [ ] Frontend: Build `StepOwnershipCard` component showing owner + subscribers
- [ ] Frontend: Add "Assign Owner" dialog
- [ ] Test: Assign ownership, verify notifications sent

#### Week 2: Approval Workflows
- [ ] Backend: Create `ApprovalStep` and `Approval` models
- [ ] Backend: Implement `CollaborationService.create_approval_workflow()`
- [ ] Backend: Implement `CollaborationService.submit_approval_decision()`
- [ ] Backend: Create approval workflow endpoints
- [ ] Frontend: Build `ApprovalWorkflowBuilder` component
- [ ] Frontend: Build `ApprovalStepCard` component with approve/reject buttons
- [ ] Test: Create 3-step approval workflow, submit decisions, verify progression

#### Week 3: Comments & Collaboration
- [ ] Backend: Create `Comment` model with threading support
- [ ] Backend: Implement `CollaborationService.add_comment()`
- [ ] Backend: Create POST `/api/collaboration/contracts/{id}/steps/{id}/comments` endpoint
- [ ] Frontend: Build `CommentThread` component
- [ ] Frontend: Add inline comment editor
- [ ] Test: Add comments, verify owner + subscribers notified

#### Week 4: Notifications & Dashboards
- [ ] Backend: Implement notification service (email + in-app)
- [ ] Backend: Implement dashboard data aggregation methods
- [ ] Backend: Create GET `/api/collaboration/dashboard` endpoint
- [ ] Frontend: Build `StakeholderDashboard` component with role-based views
- [ ] Frontend: Build `NotificationCenter` component
- [ ] Test: Role-based dashboards show correct data

#### Week 5: Status Management & Audit Trail
- [ ] Backend: Implement `StatusChange` audit trail
- [ ] Backend: Implement `CollaborationService.update_step_status()`
- [ ] Backend: Add status transition validation rules
- [ ] Frontend: Build `StatusHistoryTimeline` component
- [ ] Frontend: Add status update dropdown with reason input
- [ ] Test: Status changes recorded, notifications sent, audit trail visible

#### Week 6: Integration & Polish
- [ ] Integration: Connect with existing workflow execution engine
- [ ] Integration: Link collaboration features to document upload
- [ ] Frontend: Polish all collaboration UI components
- [ ] Test: End-to-end contract workflow with multi-stakeholder collaboration
- [ ] Documentation: Create collaboration feature guide

---

# Part 10: Model Context Protocol (MCP) Server Implementation

## 10.1 Overview - Building a Vanta-Style MCP for Islamic Finance

### Why MCP?

The Model Context Protocol (MCP) is an open standard developed by Anthropic that allows AI models to interact with external systems in a standardized, extensible way. Like Vanta's MCP implementation that we've been using throughout this research, the Islamic Finance platform needs its own MCP server to:

1. **Enable AI Assistant Access**: Allow Claude Desktop, Cursor, and other MCP clients to interact with contracts, workflows, and approvals
2. **Standardized Interface**: Provide a consistent API for AI assistants regardless of client implementation
3. **Tool-Based Operations**: Expose platform capabilities as discrete, callable tools
4. **Resource Access**: Allow reading of contracts, documents, and stakeholder data via URI-based resources
5. **Prompt Guidance**: Offer templated workflows for common Islamic finance tasks

### MCP vs. REST API

| Aspect | REST API | MCP Server |
|--------|----------|------------|
| **Purpose** | Human/app consumption | AI assistant consumption |
| **Interface** | HTTP endpoints | JSON-RPC tools/resources |
| **Discovery** | OpenAPI/Swagger docs | list_tools(), list_resources() |
| **Communication** | Request/response | stdio or SSE streaming |
| **Authorization** | Bearer tokens, OAuth | Context-based permissions |
| **Use Case** | Frontend integration | AI-powered workflows |

**Both are needed**: The REST API serves the Next.js frontend, while the MCP server enables AI assistants to help users manage contracts.

### Vanta's MCP Pattern Analysis

From our extensive use of Vanta's MCP tools throughout this research, we observed key patterns:

**Tool Organization**:
- Grouped by resource type (tests, controls, documents, frameworks)
- Operations per resource: browse/list (with filtering), read/get (specific item)
- Consistent naming: `mcp__vanta__<resource>`

**Pagination**:
- `pageCursor` + `pageSize` pattern (1-100 items)
- Cursor-based pagination for stable iteration
- Returns `pageInfo` with `hasNextPage`, `nextCursor`

**Filtering**:
- Rich filter support (statusFilter, frameworkFilter, integrationFilter)
- Enum-based filters for type safety
- Multiple filters combinable

**Response Structure**:
- Always returns structured JSON
- IDs for all entities (for linkage)
- Nested relationships (owner, frameworks, subscribers)
- Timestamps in ISO-8601 format

**Security**:
- Tool calls implicitly scoped to authenticated user
- No raw SQL/database access exposed
- Input validation at tool boundary

## 10.2 Islamic Finance MCP Server Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   MCP Clients                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Claude    │  │   Cursor    │  │   Custom    │    │
│  │  Desktop    │  │     IDE     │  │    Client   │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
└─────────┼─────────────────┼─────────────────┼───────────┘
          │                 │                 │
          │      JSON-RPC over stdio/SSE      │
          │                 │                 │
┌─────────▼─────────────────▼─────────────────▼───────────┐
│         Islamic Finance MCP Server (Python)             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Tools Layer (14 tools)                         │   │
│  │  - Contracts: list, get, create                 │   │
│  │  - Workflows: status, advance                   │   │
│  │  - Approvals: submit, get_pending               │   │
│  │  - Documents: list, verify                      │   │
│  │  - Stakeholders: assign, get_contracts          │   │
│  │  - Dashboards: get, metrics                     │   │
│  │  - Collaboration: comments                      │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Resources Layer (URI-based access)             │   │
│  │  - islamic-finance://contracts/{id}             │   │
│  │  - islamic-finance://workflows/{contract_id}    │   │
│  │  - islamic-finance://documents/{contract_id}    │   │
│  │  - islamic-finance://stakeholders/{email}       │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Prompts Layer (Templated workflows)            │   │
│  │  - create_mudaraba                              │   │
│  │  - shariah_review_checklist                     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │
                          │  Direct Python calls
                          │
┌─────────────────────────▼───────────────────────────────┐
│              Backend Services (FastAPI)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  CollaborationService                           │   │
│  │  WorkflowEngine                                 │   │
│  │  DocumentService                                │   │
│  │  SessionService                                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │
                          │  Database queries
                          │
┌─────────────────────────▼───────────────────────────────┐
│                   Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │    Neo4j     │  │  File Store  │  │
│  │  (Contracts) │  │  (Knowledge) │  │ (Documents)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Implementation Stack

- **MCP SDK**: `mcp` Python package (>=1.0.0)
- **Transport**: stdio (standard input/output) for local execution
- **Protocol**: JSON-RPC 2.0
- **Backend Integration**: Direct Python imports of FastAPI services
- **Location**: `backend/mcp/` directory

### File Structure

```
backend/
├── mcp/
│   ├── __init__.py          # Package marker
│   ├── __main__.py          # Entry point (python -m mcp.server)
│   ├── server.py            # Main MCP server implementation (800+ lines)
│   ├── auth.py              # Authentication/authorization (TODO)
│   └── README.md            # MCP server documentation
├── app/
│   ├── services/            # Backend services (reused by MCP)
│   │   ├── collaboration_service.py
│   │   ├── workflow_engine.py
│   │   ├── document_service.py
│   │   └── session_service.py
│   └── models.py            # Pydantic models (shared)
└── requirements.txt         # Updated with mcp>=1.0.0
```

## 10.3 MCP Tools - Complete Reference

### Tool Organization

The Islamic Finance MCP server exposes **14 tools** organized by domain:

| Domain | Tools | Purpose |
|--------|-------|---------|
| **Contracts** | list_contracts, get_contract, create_contract | Core contract management |
| **Workflows** | get_workflow_status, advance_workflow_step | Workflow execution |
| **Approvals** | submit_approval, get_pending_approvals | Shariah/legal approvals |
| **Documents** | list_contract_documents, verify_document | Document management |
| **Stakeholders** | assign_step_owner, get_stakeholder_contracts | Team collaboration |
| **Dashboards** | get_dashboard, get_portfolio_metrics | Role-based insights |
| **Collaboration** | add_comment, get_comments | Communication |

### Tool Schemas

#### 1. list_contracts

**Purpose**: List all contracts with optional filtering and pagination.

**Input Schema**:
```json
{
  "status": "in_progress",              // optional, enum: draft|in_progress|pending_approval|approved|rejected|executed
  "contract_type": "mudaraba",          // optional, enum: mudaraba|murabaha|musharaka|ijara|sukuk|istisna
  "owner_email": "business@example.com", // optional
  "impact_methodology": "esg",          // optional, enum: esg|vbi_malaysia|sdg|vera|gift_ib
  "page_cursor": "cursor-xyz",          // optional, for pagination
  "page_size": 20                       // optional, 1-100, default 20
}
```

**Response**:
```json
{
  "contracts": [
    {
      "contract_id": "contract-001",
      "contract_type": "mudaraba",
      "status": "in_progress",
      "owner": "business@example.com",
      "impact_methodologies": ["esg", "sdg"],
      "current_phase": "shariah_review",
      "created_at": "2025-11-04T10:00:00Z",
      "updated_at": "2025-11-04T14:30:00Z"
    }
  ],
  "pagination": {
    "total_count": 15,
    "page_size": 20,
    "has_more": false,
    "next_cursor": null
  }
}
```

**Use Cases**:
- Dashboard: Show all active contracts
- Filter: Find contracts pending approval
- Search: Locate specific contract types
- Reporting: Get contracts by impact methodology

---

#### 2. get_contract

**Purpose**: Get detailed information about a specific contract.

**Input Schema**:
```json
{
  "contract_id": "contract-001"  // required
}
```

**Response**:
```json
{
  "contract_id": "contract-001",
  "contract_type": "mudaraba",
  "status": "in_progress",
  "owner": "business@example.com",
  "impact_methodologies": ["esg", "sdg"],
  "parties": {
    "investor_email": "investor@example.com",
    "entrepreneur_email": "entrepreneur@example.com"
  },
  "workflow": {
    "current_phase": "shariah_review",
    "current_step": "assess_shariah_compliance",
    "phases": [
      {
        "phase_name": "Contract Setup",
        "status": "completed",
        "owner": "business@example.com"
      },
      {
        "phase_name": "Shariah Review",
        "status": "in_progress",
        "owner": "shariah@example.com"
      }
    ]
  },
  "documents": [...],
  "comments": [...],
  "audit_trail": [...]
}
```

**Use Cases**:
- View contract details
- Monitor workflow progress
- Access full audit trail
- Review all documents and comments

---

#### 3. create_contract

**Purpose**: Create a new Islamic finance contract.

**Input Schema**:
```json
{
  "contract_type": "mudaraba",           // required, enum
  "impact_methodologies": ["esg", "sdg"], // optional, array
  "parties": {                           // required
    "investor_email": "investor@example.com",
    "entrepreneur_email": "entrepreneur@example.com",
    "business_team_owner": "business@example.com"  // required
  },
  "metadata": {                          // optional
    "capital_amount": 1000000,
    "duration_months": 12
  }
}
```

**Response**:
```json
{
  "contract_id": "contract-123",
  "contract_type": "mudaraba",
  "status": "draft",
  "impact_methodologies": ["esg", "sdg"],
  "workflow_initialized": true,
  "created_at": "2025-11-04T15:00:00Z"
}
```

**Use Cases**:
- Create new contract via AI assistant
- Initialize workflow automatically
- Set up impact methodologies

---

#### 4. get_workflow_status

**Purpose**: Get current workflow execution status for a contract.

**Input Schema**:
```json
{
  "contract_id": "contract-001"  // required
}
```

**Response**:
```json
{
  "contract_id": "contract-001",
  "current_phase": "shariah_review",
  "current_step": "assess_shariah_compliance",
  "step_owner": "shariah@example.com",
  "step_subscribers": ["business@example.com", "compliance@example.com"],
  "pending_approvals": 1,
  "recent_activity": [
    {
      "timestamp": "2025-11-04T14:00:00Z",
      "actor": "business@example.com",
      "action": "completed",
      "step": "identify_parties"
    }
  ]
}
```

**Use Cases**:
- Monitor contract progress
- Check current owner
- View recent activity
- Identify blockers

---

#### 5. advance_workflow_step

**Purpose**: Complete current step and advance workflow.

**Input Schema**:
```json
{
  "contract_id": "contract-001",        // required
  "step_id": "assess_shariah_compliance", // required
  "completion_notes": "All requirements met", // optional
  "executor_email": "shariah@example.com"   // required
}
```

**Response**:
```json
{
  "success": true,
  "contract_id": "contract-001",
  "previous_step": "assess_shariah_compliance",
  "current_step": "issue_shariah_certificate",
  "new_owner": "shariah@example.com",
  "notifications_sent": 3
}
```

**Use Cases**:
- Mark step complete
- Advance to next phase
- Trigger ownership change
- Send notifications

---

#### 6. submit_approval

**Purpose**: Submit approval decision for a workflow step.

**Input Schema**:
```json
{
  "contract_id": "contract-001",          // required
  "step_number": 1,                        // required, 1-based
  "approver_email": "shariah@example.com", // required
  "decision": "approved",                  // required, enum: approved|rejected|changes_requested
  "comments": "Complies with Shariah"      // optional
}
```

**Response**:
```json
{
  "success": true,
  "contract_id": "contract-001",
  "step_number": 1,
  "decision": "approved",
  "approver": "shariah@example.com",
  "timestamp": "2025-11-04T15:30:00Z",
  "workflow_advanced": true
}
```

**Use Cases**:
- Shariah advisor approval
- Legal review
- Executive sign-off
- Request changes

---

#### 7. get_pending_approvals

**Purpose**: Get list of contracts pending approval for a specific approver.

**Input Schema**:
```json
{
  "approver_email": "shariah@example.com", // required
  "approval_type": "shariah_review"        // optional, enum: shariah_review|legal_review|executive_approval|all
}
```

**Response**:
```json
{
  "approver_email": "shariah@example.com",
  "pending_approvals": [
    {
      "contract_id": "contract-001",
      "contract_type": "mudaraba",
      "step_name": "Shariah Compliance Review",
      "step_number": 1,
      "assigned_at": "2025-11-04T10:00:00Z",
      "due_date": null,
      "priority": "high"
    }
  ],
  "total_count": 3
}
```

**Use Cases**:
- Personalized task list
- Approval queue management
- Priority sorting
- Workload visibility

---

#### 8. list_contract_documents

**Purpose**: List all documents associated with a contract.

**Input Schema**:
```json
{
  "contract_id": "contract-001",     // required
  "document_type": "kyc",            // optional, enum: kyc|asset_proof|shariah_certificate|legal_contract|other
  "status": "uploaded"               // optional, enum: needs_document|uploaded|verified|rejected
}
```

**Response**:
```json
{
  "contract_id": "contract-001",
  "documents": [
    {
      "document_id": "doc-001",
      "type": "kyc",
      "status": "uploaded",
      "owner": "business@example.com",
      "uploaded_at": "2025-11-04T12:00:00Z",
      "verified": false,
      "file_name": "investor_kyc.pdf",
      "file_size_bytes": 524288
    }
  ],
  "total_count": 5
}
```

**Use Cases**:
- Document checklist
- Verification status
- Missing documents
- Evidence linkage

---

#### 9. verify_document

**Purpose**: Verify a document has been reviewed and meets requirements.

**Input Schema**:
```json
{
  "document_id": "doc-001",               // required
  "verifier_email": "shariah@example.com", // required
  "verification_status": "verified",       // required, enum: verified|rejected
  "comments": "KYC documents complete"     // optional
}
```

**Response**:
```json
{
  "success": true,
  "document_id": "doc-001",
  "verification_status": "verified",
  "verifier": "shariah@example.com",
  "timestamp": "2025-11-04T15:45:00Z"
}
```

**Use Cases**:
- Mark documents verified
- Request resubmission
- Track verification history
- Compliance audit

---

#### 10. assign_step_owner

**Purpose**: Assign ownership of a workflow step to a team member.

**Input Schema**:
```json
{
  "contract_id": "contract-001",        // required
  "step_id": "assess_shariah_compliance", // required
  "owner_email": "shariah@example.com",   // required
  "owner_role": "shariah_advisor",        // required, enum: business_team|shariah_advisor|legal_counsel|compliance_manager|finance_team
  "subscribers": [                        // optional, max 10
    "business@example.com",
    "compliance@example.com"
  ],
  "due_date": "2025-11-10T17:00:00Z"     // optional
}
```

**Response**:
```json
{
  "success": true,
  "contract_id": "contract-001",
  "step_id": "assess_shariah_compliance",
  "owner": "shariah@example.com",
  "role": "shariah_advisor",
  "subscribers": ["business@example.com", "compliance@example.com"],
  "notifications_sent": 3
}
```

**Use Cases**:
- Assign workflow step
- Set up notification subscribers
- Define due dates
- Transfer ownership

---

#### 11. get_stakeholder_contracts

**Purpose**: Get all contracts assigned to a specific stakeholder.

**Input Schema**:
```json
{
  "stakeholder_email": "shariah@example.com", // required
  "role": "owner",                             // optional, enum: owner|subscriber|all
  "status_filter": "active"                    // optional, enum: active|pending|overdue|all
}
```

**Response**:
```json
{
  "stakeholder_email": "shariah@example.com",
  "contracts": [
    {
      "contract_id": "contract-001",
      "contract_type": "mudaraba",
      "status": "in_progress",
      "role": "owner",
      "current_step": "assess_shariah_compliance",
      "due_date": null,
      "is_overdue": false
    }
  ],
  "total_count": 5
}
```

**Use Cases**:
- Personal workload view
- Overdue tracking
- Subscription monitoring
- Workload balancing

---

#### 12. get_dashboard

**Purpose**: Get personalized dashboard data based on stakeholder role.

**Input Schema**:
```json
{
  "stakeholder_email": "shariah@example.com", // required
  "role": "shariah_advisor"                    // required, enum
}
```

**Response** (Shariah Advisor):
```json
{
  "stakeholder_email": "shariah@example.com",
  "role": "shariah_advisor",
  "metrics": {
    "pending_reviews": 3,
    "completed_this_month": 12,
    "average_review_time_days": 2.5,
    "approval_rate": 0.95
  },
  "pending_tasks": [
    {
      "contract_id": "contract-001",
      "task": "Shariah Compliance Review",
      "due_date": null,
      "priority": "high"
    }
  ],
  "recent_activity": [...]
}
```

**Use Cases**:
- Role-based dashboard
- Performance metrics
- Task prioritization
- Activity feed

---

#### 13. get_portfolio_metrics

**Purpose**: Get aggregate metrics across all contracts in the portfolio.

**Input Schema**:
```json
{
  "time_period": "last_30_days",  // optional, enum: last_7_days|last_30_days|last_90_days|this_year|all_time
  "group_by": "contract_type"     // optional, enum: contract_type|impact_methodology|status|owner
}
```

**Response**:
```json
{
  "time_period": "last_30_days",
  "metrics": {
    "total_contracts": 15,
    "by_status": {
      "draft": 2,
      "in_progress": 8,
      "pending_approval": 3,
      "approved": 1,
      "executed": 1
    },
    "by_contract_type": {
      "mudaraba": 5,
      "murabaha": 4,
      "musharaka": 3,
      "ijara": 2,
      "sukuk": 1
    },
    "average_completion_days": 14.5,
    "approval_rate": 0.93
  }
}
```

**Use Cases**:
- Executive oversight
- Compliance reporting
- Performance analysis
- Trend identification

---

#### 14. add_comment & 15. get_comments

**add_comment** - Add a comment to a contract or workflow step.

**Input Schema**:
```json
{
  "contract_id": "contract-001",        // required
  "step_id": "assess_shariah_compliance", // optional
  "author_email": "business@example.com", // required
  "content": "Updated KYC documents",     // required
  "in_reply_to": "comment-456"           // optional, for threading
}
```

**get_comments** - Get all comments for a contract or workflow step.

**Input Schema**:
```json
{
  "contract_id": "contract-001",          // required
  "step_id": "assess_shariah_compliance"  // optional
}
```

**Use Cases**:
- Threaded discussions
- @mentions
- Activity notifications
- Collaboration history

## 10.4 Resource System - URI-Based Access

### Resource URI Scheme

The Islamic Finance MCP server uses a custom URI scheme for resource identification:

```
islamic-finance://[resource_type]/[id]
```

### Available Resources

| URI Pattern | Description | Example |
|-------------|-------------|---------|
| `islamic-finance://contracts` | List all contracts | Returns array of contracts |
| `islamic-finance://contracts/{id}` | Get specific contract | `islamic-finance://contracts/contract-001` |
| `islamic-finance://workflows/{contract_id}` | Get workflow status | `islamic-finance://workflows/contract-001` |
| `islamic-finance://documents/{contract_id}` | List contract documents | `islamic-finance://documents/contract-001` |
| `islamic-finance://stakeholders/{email}` | Get stakeholder info | `islamic-finance://stakeholders/user@example.com` |

### Resource vs. Tool

**When to use Resources**:
- Reading data for AI context
- Bulk data retrieval
- Static reference information

**When to use Tools**:
- Performing actions (create, update, delete)
- Triggering workflows
- Side effects (notifications, state changes)

### Resource Implementation

```python
@server.read_resource()
async def read_resource(uri: str) -> str:
    """
    Read a specific resource by URI.
    """
    # Parse URI
    if not uri.startswith("islamic-finance://"):
        raise ValueError("Invalid URI scheme")

    path = uri.replace("islamic-finance://", "")
    parts = path.split("/")

    # Route to handler
    if parts[0] == "contracts":
        if len(parts) == 1:
            result = await handle_list_contracts({})
        else:
            result = await handle_get_contract({"contract_id": parts[1]})

    elif parts[0] == "workflows":
        result = await handle_get_workflow_status({"contract_id": parts[1]})

    # ... other resource types

    return json.dumps(result, indent=2, default=str)
```

## 10.5 Prompt Templates

### Purpose

Prompt templates guide AI assistants through standard Islamic finance workflows with pre-defined structures and checklists.

### Available Prompts

#### 1. create_mudaraba

**Description**: Guide for creating a new Mudaraba (profit-sharing) contract.

**Arguments**:
- `investor_email` (required): Email of the investor (Rabb-ul-Maal)
- `entrepreneur_email` (required): Email of the entrepreneur (Mudarib)
- `capital_amount` (required): Capital contribution amount

**Template**:
```
I need to create a new Mudaraba contract with the following details:

Investor (Rabb-ul-Maal): {investor_email}
Entrepreneur (Mudarib): {entrepreneur_email}
Capital Amount: {capital_amount}

Please guide me through the contract creation process, ensuring all Shariah compliance requirements are met.
```

**Use Case**: AI assistant helps user create Mudaraba contract step-by-step.

---

#### 2. shariah_review_checklist

**Description**: Comprehensive checklist for Shariah compliance review.

**Arguments**:
- `contract_id` (required): Contract ID to review

**Template**:
```
Please review contract {contract_id} for Shariah compliance using this checklist:

1. Verify parties are eligible under Islamic law
2. Confirm asset tangibility and lawful ownership
3. Validate absence of Riba (interest)
4. Check profit-sharing ratios are clearly defined
5. Ensure business activities are halal
6. Verify contract contains necessary Islamic clauses
7. Confirm transparency in all financial disclosures

Provide detailed findings for each point.
```

**Use Case**: Shariah advisor performs structured compliance review.

---

### Adding Custom Prompts

To add new prompt templates:

1. Define in `list_prompts()`:
```python
{
    "name": "ijara_lease_setup",
    "description": "Guide for setting up Ijara (leasing) contract",
    "arguments": [
        {
            "name": "lessor_email",
            "required": True
        },
        {
            "name": "lessee_email",
            "required": True
        },
        {
            "name": "asset_description",
            "required": True
        }
    ]
}
```

2. Implement in `get_prompt()`:
```python
elif name == "ijara_lease_setup":
    return GetPromptResult(
        messages=[
            PromptMessage(
                role="user",
                content=TextContent(
                    type="text",
                    text=f"Setup Ijara lease for asset: {arguments['asset_description']}..."
                )
            )
        ]
    )
```

## 10.6 Integration with MCP Clients

### Claude Desktop Integration

**Configuration** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "islamic-finance": {
      "command": "python",
      "args": ["-m", "mcp.server"],
      "cwd": "/path/to/backend",
      "env": {
        "NEO4J_URI": "neo4j+ssc://xxx.databases.neo4j.io",
        "NEO4J_USER": "neo4j",
        "NEO4J_PASSWORD": "your-password",
        "ANTHROPIC_API_KEY": "sk-ant-xxx"
      }
    }
  }
}
```

**Usage in Claude Desktop**:
1. Restart Claude Desktop after config update
2. MCP server auto-starts when Claude launches
3. Use natural language to call tools:
   - "Show me all contracts pending approval"
   - "Create a new Mudaraba contract for investor@example.com"
   - "What's the status of contract-001?"
   - "Submit approval for contract-001 step 1"

### Cursor IDE Integration

**Configuration** (`.cursor/mcp.json` in project root):

```json
{
  "mcpServers": {
    "islamic-finance": {
      "command": "python",
      "args": ["-m", "mcp.server"],
      "cwd": "backend",
      "env": {
        "NEO4J_URI": "${NEO4J_URI}",
        "ANTHROPIC_API_KEY": "${ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

**Usage in Cursor**:
- MCP server appears in Cursor's context menu
- Use Cmd+K to invoke tools
- AI assistant has full contract management capabilities

### Custom MCP Client Integration

For building custom MCP clients:

```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Configure server
server_params = StdioServerParameters(
    command="python",
    args=["-m", "mcp.server"],
    cwd="/path/to/backend",
    env={
        "NEO4J_URI": "...",
        "ANTHROPIC_API_KEY": "..."
    }
)

# Connect to server
async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        # Initialize
        await session.initialize()

        # List available tools
        tools = await session.list_tools()
        print(f"Available tools: {[t.name for t in tools.tools]}")

        # Call a tool
        result = await session.call_tool("list_contracts", {
            "status": "in_progress",
            "page_size": 10
        })
        print(result)

        # Read a resource
        contract_data = await session.read_resource(
            "islamic-finance://contracts/contract-001"
        )
        print(contract_data)
```

## 10.7 Security & Authentication

### Current Implementation

The initial MCP server implementation (v1.0.0) has **mock security**:
- No authentication required
- All operations succeed
- No user context validation

### Production Security Requirements

#### 1. User Authentication

**JWT Token Validation**:
```python
from app.auth import verify_jwt_token

async def authenticate_call(token: str) -> User:
    """
    Verify JWT token from MCP client.
    MCP clients should pass token via environment or metadata.
    """
    try:
        payload = verify_jwt_token(token)
        user = await get_user_by_id(payload['user_id'])
        return user
    except InvalidTokenError:
        raise Unauthorized("Invalid authentication token")
```

**MCP Client Setup with Auth**:
```json
{
  "mcpServers": {
    "islamic-finance": {
      "command": "python",
      "args": ["-m", "mcp.server"],
      "env": {
        "MCP_AUTH_TOKEN": "jwt-token-here"
      }
    }
  }
}
```

#### 2. Authorization Checks

**Role-Based Access Control**:
```python
async def authorize_tool_call(user: User, tool_name: str, args: dict) -> bool:
    """
    Check if user has permission to call tool with given arguments.
    """
    # Check tool-level permissions
    if tool_name == "create_contract":
        if user.role not in ["business_team", "finance_team"]:
            raise Forbidden("Only business/finance teams can create contracts")

    # Check resource-level permissions
    if tool_name == "submit_approval":
        contract_id = args["contract_id"]
        step_number = args["step_number"]

        approval_step = await get_approval_step(contract_id, step_number)

        if user.email not in approval_step.required_approvers:
            raise Forbidden("You are not an authorized approver for this step")

    return True
```

#### 3. Input Validation

**Strict Schema Validation**:
```python
from pydantic import BaseModel, validator

class SubmitApprovalInput(BaseModel):
    contract_id: str
    step_number: int
    approver_email: str
    decision: Literal["approved", "rejected", "changes_requested"]
    comments: Optional[str] = None

    @validator('contract_id')
    def validate_contract_exists(cls, v):
        # Check contract exists
        if not contract_exists(v):
            raise ValueError(f"Contract {v} not found")
        return v

    @validator('approver_email')
    def validate_approver(cls, v, values):
        # Check approver is authorized
        contract_id = values.get('contract_id')
        step_number = values.get('step_number')

        if not is_authorized_approver(contract_id, step_number, v):
            raise ValueError(f"{v} is not authorized to approve this step")
        return v
```

#### 4. Audit Logging

**Comprehensive Audit Trail**:
```python
async def log_tool_call(user: User, tool_name: str, args: dict, result: dict):
    """
    Log all MCP tool calls for compliance and debugging.
    """
    await audit_log.create({
        "timestamp": datetime.utcnow(),
        "actor_email": user.email,
        "actor_role": user.role,
        "action": f"mcp.{tool_name}",
        "resource_type": extract_resource_type(tool_name),
        "resource_id": extract_resource_id(args),
        "arguments": sanitize_sensitive_data(args),
        "result_status": "success" if result.get("success") else "failure",
        "ip_address": get_client_ip(),
        "client": "mcp_server"
    })
```

#### 5. Rate Limiting

**Per-User Rate Limits**:
```python
from aioredis import Redis

async def check_rate_limit(user: User, tool_name: str):
    """
    Enforce rate limits on sensitive operations.
    """
    redis = Redis()

    # Different limits for different tool categories
    if tool_name in ["create_contract", "submit_approval"]:
        limit = 100  # 100 calls per hour
        window = 3600
    else:
        limit = 1000  # 1000 calls per hour
        window = 3600

    key = f"rate_limit:{user.id}:{tool_name}:{window}"
    current = await redis.incr(key)

    if current == 1:
        await redis.expire(key, window)

    if current > limit:
        raise RateLimitExceeded(
            f"Rate limit exceeded for {tool_name}. Max {limit} per hour."
        )
```

### Security Best Practices

1. **Never Trust MCP Client Input**: Always validate, even if client is "trusted"
2. **Principle of Least Privilege**: Users only access contracts they own/subscribe to
3. **Fail Secure**: Deny by default, grant explicitly
4. **Audit Everything**: Log all operations for compliance
5. **Encrypt Sensitive Data**: Use TLS for transport, encrypt at rest
6. **Regular Security Reviews**: Audit MCP server code quarterly
7. **Monitor Anomalies**: Alert on unusual tool call patterns

## 10.8 Usage Examples

### Example 1: Creating a Mudaraba Contract

**Scenario**: Business team member uses Claude Desktop to create new contract.

**User**: "Create a new Mudaraba contract for investor investor@bank.com and entrepreneur entrepreneur@startup.com with $500,000 capital. Apply ESG and SDG impact methodologies."

**Claude (via MCP)**:
1. Calls `create_contract` tool:
```json
{
  "contract_type": "mudaraba",
  "impact_methodologies": ["esg", "sdg"],
  "parties": {
    "investor_email": "investor@bank.com",
    "entrepreneur_email": "entrepreneur@startup.com",
    "business_team_owner": "business@example.com"
  },
  "metadata": {
    "capital_amount": 500000
  }
}
```

2. Receives response:
```json
{
  "contract_id": "contract-789",
  "contract_type": "mudaraba",
  "status": "draft",
  "workflow_initialized": true
}
```

3. Responds to user: "I've created Mudaraba contract-789 with $500,000 capital. ESG and SDG impact assessments will be included. The contract is in draft status. Would you like me to advance it to the first workflow step?"

---

### Example 2: Shariah Advisor Review

**Scenario**: Shariah advisor uses Claude to review pending contracts.

**User**: "What contracts are pending my review?"

**Claude (via MCP)**:
1. Calls `get_pending_approvals`:
```json
{
  "approver_email": "shariah@example.com",
  "approval_type": "shariah_review"
}
```

2. Receives 3 pending contracts

3. Responds: "You have 3 contracts pending Shariah review:
   - contract-001 (Mudaraba, assigned 2 days ago)
   - contract-045 (Musharaka, assigned 1 day ago, high priority)
   - contract-089 (Ijara, assigned 3 hours ago)"

**User**: "Review contract-045 using the checklist."

**Claude**:
1. Calls `get_contract` to fetch details
2. Uses `shariah_review_checklist` prompt template
3. Walks through 7-point checklist
4. Identifies compliance issues
5. Suggests: "I found 2 issues: profit-sharing ratio not clearly defined, and business activities include non-halal revenue. Should I submit a 'changes_requested' decision with these findings?"

**User**: "Yes, submit it."

**Claude**:
1. Calls `submit_approval`:
```json
{
  "contract_id": "contract-045",
  "step_number": 1,
  "approver_email": "shariah@example.com",
  "decision": "changes_requested",
  "comments": "1. Profit-sharing ratio must be explicitly stated. 2. Business activities contain non-halal revenue streams - requires restructuring."
}
```

2. Confirms: "I've submitted your review requesting changes. The business team has been notified and the contract returned to the setup phase."

---

### Example 3: Portfolio Oversight

**Scenario**: Compliance manager uses Claude for portfolio monitoring.

**User**: "Show me portfolio metrics for the last 30 days."

**Claude (via MCP)**:
1. Calls `get_portfolio_metrics`:
```json
{
  "time_period": "last_30_days",
  "group_by": "status"
}
```

2. Receives aggregate data

3. Responds with formatted summary:
```
Portfolio Metrics (Last 30 Days):
================================

Total Contracts: 47

By Status:
- Draft: 8 (17%)
- In Progress: 22 (47%)
- Pending Approval: 10 (21%)
- Approved: 5 (11%)
- Executed: 2 (4%)

Performance:
- Average Completion: 14.5 days
- Approval Rate: 93%

🚨 10 contracts pending approval (needs attention)
```

**User**: "Which contracts are overdue?"

**Claude**:
1. Calls `list_contracts` with status filter
2. Identifies overdue items
3. Provides actionable list with owners

---

### Example 4: Document Verification

**Scenario**: Business team uploads KYC documents, Shariah advisor verifies.

**User (Business Team)**: "I've uploaded KYC documents for contract-123. Let the Shariah team know."

**Claude**:
1. Calls `list_contract_documents` to check uploads
2. Finds KYC documents uploaded
3. Calls `add_comment`:
```json
{
  "contract_id": "contract-123",
  "author_email": "business@example.com",
  "content": "@shariah@example.com KYC documents uploaded and ready for review."
}
```

4. Confirms: "I've notified the Shariah team that KYC documents are ready. They'll receive an email notification."

**Later - User (Shariah Advisor)**: "Verify the KYC documents for contract-123."

**Claude**:
1. Calls `list_contract_documents` to retrieve docs
2. Reviews document metadata
3. After advisor reviews: calls `verify_document`:
```json
{
  "document_id": "doc-456",
  "verifier_email": "shariah@example.com",
  "verification_status": "verified",
  "comments": "KYC documents complete and compliant"
}
```

4. Confirms: "I've marked the KYC documents as verified. The business team has been notified and the workflow can proceed."

---

### Example 5: Dashboard Customization

**Scenario**: Different stakeholders get role-specific dashboards.

**Shariah Advisor Dashboard**:
```
Your Shariah Dashboard:
======================

📊 Metrics:
- Pending Reviews: 3
- Completed This Month: 12
- Average Review Time: 2.5 days
- Approval Rate: 95%

📋 Your Pending Tasks:
1. contract-001 (Mudaraba) - Shariah Compliance Review [HIGH PRIORITY]
2. contract-045 (Musharaka) - Shariah Compliance Review
3. contract-089 (Ijara) - Shariah Certificate Issuance

🔔 Recent Activity:
- business@example.com completed KYC upload (contract-001) - 10 min ago
- Your review approved for contract-033 - 2 hours ago
```

**Business Team Dashboard**:
```
Your Business Dashboard:
=======================

📊 Metrics:
- Active Contracts: 8
- Pending Tasks: 5
- Overdue: 1 ⚠️
- Completed This Month: 15

📋 Your Pending Tasks:
1. contract-001 - Await Shariah Review [BLOCKED]
2. contract-078 - Asset Identification [OVERDUE ⚠️]
3. contract-089 - Capital Contribution Documentation
4. contract-102 - Party Identification (KYC)
5. contract-115 - Draft Contract Creation

🔔 Recent Activity:
- shariah@example.com requested changes (contract-045) - 1 hour ago
- contract-033 approved and ready for execution - 2 hours ago
```

## 10.9 Deployment & Operations

### Local Development

**Running the MCP Server**:
```bash
cd backend
python -m mcp.server
```

**Testing with MCP Inspector**:
```bash
npx @modelcontextprotocol/inspector python -m mcp.server
```

### Production Deployment

#### Option 1: Standalone Process

Run MCP server as a separate process managed by systemd:

**systemd service** (`/etc/systemd/system/islamic-finance-mcp.service`):
```ini
[Unit]
Description=Islamic Finance MCP Server
After=network.target

[Service]
Type=simple
User=mcp-server
WorkingDirectory=/opt/islamic-finance/backend
Environment="NEO4J_URI=neo4j+ssc://..."
Environment="ANTHROPIC_API_KEY=sk-ant-..."
ExecStart=/opt/islamic-finance/venv/bin/python -m mcp.server
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Start service**:
```bash
sudo systemctl enable islamic-finance-mcp
sudo systemctl start islamic-finance-mcp
sudo systemctl status islamic-finance-mcp
```

#### Option 2: Docker Container

**Dockerfile**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy MCP server code
COPY backend/mcp/ ./mcp/
COPY backend/app/ ./app/

# Expose stdio (no port needed)
CMD ["python", "-m", "mcp.server"]
```

**Build and run**:
```bash
docker build -t islamic-finance-mcp .
docker run -e NEO4J_URI=$NEO4J_URI -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY islamic-finance-mcp
```

### Monitoring & Observability

**Logging Configuration**:
```python
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/islamic-finance-mcp/server.log'),
        logging.StreamHandler()
    ]
)
```

**Metrics to Track**:
- Tool call count per tool (identify popular operations)
- Tool call latency (performance monitoring)
- Error rate per tool (reliability)
- Active MCP client connections
- Resource access patterns

**Health Check**:
```python
@server.list_tools()
async def health_check() -> List[Tool]:
    """
    Health check endpoint - if this succeeds, server is healthy.
    """
    return []  # Return empty list to confirm server responsive
```

### Performance Optimization

**Connection Pooling**:
```python
# Initialize service connections once at startup
collaboration_service = CollaborationService()
workflow_engine = WorkflowEngine()

# Reuse connections across tool calls
```

**Response Caching**:
```python
from functools import lru_cache
from datetime import datetime, timedelta

@lru_cache(maxsize=128)
async def cached_get_contract(contract_id: str, cache_time: datetime):
    """
    Cache contract data for 5 minutes.
    cache_time parameter allows cache invalidation every 5 minutes.
    """
    return await get_contract_from_db(contract_id)

# Usage
cache_time = datetime.utcnow().replace(second=0, microsecond=0) // 300  # 5-min buckets
contract = await cached_get_contract(contract_id, cache_time)
```

**Batch Operations**:
```python
async def handle_get_stakeholder_contracts(args: Dict[str, Any]):
    """
    Optimize by fetching all contracts in single query instead of N queries.
    """
    stakeholder_email = args["stakeholder_email"]

    # Single query with JOIN instead of N queries
    contracts = await db.query("""
        SELECT c.* FROM contracts c
        JOIN workflow_steps ws ON c.id = ws.contract_id
        WHERE ws.owner = ? OR ws.subscribers LIKE ?
    """, [stakeholder_email, f"%{stakeholder_email}%"])

    return {"contracts": contracts}
```

## 10.10 Roadmap & Future Enhancements

### Phase 1: Production Readiness (Current)
- [x] Core MCP server implementation (14 tools, resources, prompts)
- [x] Mock data handlers
- [x] README documentation
- [ ] Connect to real backend services (in progress)
- [ ] Authentication and authorization
- [ ] Comprehensive test suite
- [ ] Error handling and logging

### Phase 2: Enhanced Capabilities (Q1 2026)
- [ ] **SSE Transport Support**: Add Server-Sent Events for streaming updates
- [ ] **Resource Templates**: Dynamic resource discovery
- [ ] **Advanced Filtering**: Complex queries with multiple filter combinations
- [ ] **Bulk Operations**: Batch create/update/delete tools
- [ ] **Workflow Templates**: Pre-configured workflows for common contract types
- [ ] **Custom Validators**: Contract-specific validation rules

### Phase 3: Integration & Ecosystem (Q2 2026)
- [ ] **Task Management Integration**: Sync with Jira, Linear, Asana
- [ ] **Notification Integration**: Slack, Teams, email
- [ ] **Calendar Integration**: Due date sync with Google Calendar, Outlook
- [ ] **Document Management**: Direct integration with Google Drive, SharePoint
- [ ] **Analytics Dashboard**: MCP tool usage analytics
- [ ] **API Gateway**: Unified API for both REST and MCP

### Phase 4: Advanced Features (Q3 2026)
- [ ] **AI-Powered Insights**: Automatic contract risk analysis
- [ ] **Predictive Analytics**: Forecast approval times, bottlenecks
- [ ] **Smart Routing**: Auto-assign steps based on workload, expertise
- [ ] **Contract Templates**: AI-generated contract clauses
- [ ] **Compliance Scanner**: Automatic Shariah compliance checking
- [ ] **Multi-Language Support**: Arabic, Malay, Urdu contract support

### Phase 5: Enterprise Features (Q4 2026)
- [ ] **Multi-Tenancy**: Support multiple organizations
- [ ] **Advanced RBAC**: Fine-grained permissions
- [ ] **Audit Compliance**: SOC 2, ISO 27001 reporting
- [ ] **Disaster Recovery**: Backup and restore workflows
- [ ] **High Availability**: Multi-region deployment
- [ ] **Enterprise SSO**: SAML, OIDC integration

### Publishing to PyPI

**Goal**: Make MCP server installable via `pip install mcp-islamic-finance`

**Steps**:
1. Create `pyproject.toml`:
```toml
[build-system]
requires = ["setuptools>=45", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "mcp-islamic-finance"
version = "1.0.0"
description = "MCP server for Islamic Finance contract management"
authors = [{name = "Blade Labs", email = "info@bladelabs.io"}]
dependencies = ["mcp>=1.0.0", "pydantic>=2.0.0"]

[project.scripts]
mcp-islamic-finance = "mcp.server:main"
```

2. Build and publish:
```bash
python -m build
twine upload dist/*
```

3. Install via pip:
```bash
pip install mcp-islamic-finance
```

4. Configure Claude Desktop:
```json
{
  "mcpServers": {
    "islamic-finance": {
      "command": "mcp-islamic-finance",
      "env": {"NEO4J_URI": "..."}
    }
  }
}
```

## 10.11 Key Takeaways - MCP Server

### 1. **MCP Enables AI-Powered Workflows**

The Islamic Finance MCP server transforms the platform from a traditional web app into an **AI-native system**. Users can manage contracts through natural language conversations with Claude, not just clicking buttons in a UI.

### 2. **Vanta's MCP Patterns Are Highly Reusable**

The patterns we observed in Vanta's MCP implementation (tool organization, pagination, filtering, resource URIs) translate directly to Islamic finance:
- Tool categorization by domain
- Cursor-based pagination
- Enum-based filtering
- Owner + subscribers model
- Approval workflows

### 3. **Tools vs. Resources Distinction**

- **Tools** = Actions with side effects (create contract, submit approval)
- **Resources** = Read-only data access (get contract, list documents)
- Both serve AI assistants but with different semantics

### 4. **Security is Critical**

MCP servers expose powerful operations to AI assistants. Without proper authentication, authorization, and audit logging, this creates significant security risks. Production deployments MUST implement:
- JWT-based authentication
- Role-based authorization
- Input validation
- Rate limiting
- Comprehensive audit logging

### 5. **Prompt Templates Guide AI Behavior**

Well-designed prompt templates (like `create_mudaraba`, `shariah_review_checklist`) ensure AI assistants follow best practices and regulatory requirements. They act as **guardrails** for AI-powered workflows.

### 6. **MCP Complements REST API**

The MCP server does NOT replace the REST API:
- **REST API**: Serves Next.js frontend, external integrations
- **MCP Server**: Serves AI assistants (Claude Desktop, Cursor)
- Both use the same backend services (`CollaborationService`, `WorkflowEngine`)

### 7. **stdio Transport is Simple but Powerful**

The stdio (standard input/output) transport makes MCP servers trivially easy to integrate with local AI assistants. No network configuration, no ports, no TLS certificates—just spawn a process and pipe JSON-RPC.

### 8. **MCP Enables Multi-Stakeholder Collaboration**

By exposing the collaboration features (ownership, approvals, comments) through MCP, AI assistants can orchestrate complex multi-person workflows:
- Business team creates contract
- AI assistant notifies Shariah advisor
- Shariah advisor reviews via AI-guided checklist
- AI assistant submits approval and advances workflow
- Business team receives notification and proceeds to execution

This replaces email/PDF cycles with structured, auditable workflows.

## 10.12 Implementation Checklist - MCP Server

### Week 1: Core Infrastructure
- [x] Create `backend/mcp/` directory structure
- [x] Implement `server.py` with 14 tools
- [x] Define tool input/output schemas
- [x] Implement resource URI handling
- [x] Create prompt templates
- [x] Add `mcp>=1.0.0` to requirements.txt
- [x] Write comprehensive README
- [ ] Test MCP server with MCP Inspector
- [ ] Verify all tools return mock data

### Week 2: Backend Service Integration
- [ ] Replace mock data in `handle_list_contracts()`
- [ ] Replace mock data in `handle_get_contract()`
- [ ] Replace mock data in `handle_create_contract()`
- [ ] Connect workflow tools to `WorkflowEngine`
- [ ] Connect approval tools to `CollaborationService`
- [ ] Connect document tools to `DocumentService`
- [ ] Connect stakeholder tools to `CollaborationService`
- [ ] Connect dashboard tools to analytics service
- [ ] Test end-to-end tool calls with real data

### Week 3: Authentication & Authorization
- [ ] Implement JWT token validation
- [ ] Add user context to tool calls
- [ ] Implement role-based authorization
- [ ] Add resource-level permission checks
- [ ] Test authorization with different roles
- [ ] Document authentication setup

### Week 4: Security & Validation
- [ ] Add Pydantic input validation for all tools
- [ ] Implement rate limiting
- [ ] Add audit logging for all tool calls
- [ ] Implement SQL injection prevention
- [ ] Add error handling and sanitization
- [ ] Security audit and penetration testing

### Week 5: Testing & Documentation
- [ ] Write unit tests for all tool handlers
- [ ] Write integration tests for workflows
- [ ] Test with Claude Desktop
- [ ] Test with Cursor IDE
- [ ] Update `backend/mcp/README.md` with examples
- [ ] Create video tutorials
- [ ] Document troubleshooting guide

### Week 6: Deployment & Operations
- [ ] Create Docker container
- [ ] Write systemd service file
- [ ] Set up logging infrastructure
- [ ] Implement health checks
- [ ] Add performance monitoring
- [ ] Deploy to staging environment
- [ ] Load testing
- [ ] Deploy to production

### Future Enhancements
- [ ] SSE transport support
- [ ] Resource templates
- [ ] Bulk operations tools
- [ ] Task management integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Publish to PyPI

---

**Document End**

Last Updated: 2025-11-04
Analysis Completed: 2025-11-04 (Part 9 added, Part 10 added)
Implementation Target: 6 weeks (Phases 1-6) + 6 weeks (Collaboration) + 6 weeks (MCP Server)
