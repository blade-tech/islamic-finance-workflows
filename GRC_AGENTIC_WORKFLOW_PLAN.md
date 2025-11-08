# GRC Agentic Workflow Plan
**From Intent to Deployed Guardian Policy**

## Executive Summary

This document outlines a production-grade, human-in-the-loop (HITL) agentic workflow system for automating GRC compliance creation in Islamic finance, using Guardian as the deployment target. The system transforms high-level intent (e.g., "Ijara deal in Qatar") into validated, deployed Guardian policies with complete audit trails.

**Example Use Case:** Ijara (operating lease) for a Qatari financial institution regulated by QFCRA and QCB.

---

## Architecture Overview

```
INTENT → PROFILE → OBLIGATIONS → RISKS → CONTROLS → SCHEMAS → POLICY → DRY-RUN → DEPLOY
   ↓        ↓          ↓           ↓         ↓          ↓         ↓         ↓        ↓
  A0       HITL       A1          A2        A3         A4        A6        A8       A9
         (approve)   HITL        HITL      HITL       HITL      HITL      HITL   (publish)
```

**Framework Mapping:**
- **ISO 37301** (Compliance Management Systems): Guides A0-A3 (Plan phase)
- **ISO 31000** (Risk Management): Drives A2 (Risk Mapper)
- **COSO** (Internal Control Framework): Structures A3-A4 (Control design)
- **Guardian**: Implementation platform (A6-A9)

---

## Phase 1: INTAKE & SCOPING (Plan - ISO 37301)

### Agent A0: Deal Profiler

**Purpose:** Transform free-form intent into structured, validated deal profile.

**Input Example:**
```
"We need an Ijara structure for a commercial property lease. The institution
operates in Qatar Financial Centre and is regulated by both QFCRA and QCB.
This is an operating lease, not IMB."
```

**System Prompt:**
```markdown
You are a Deal Profiler for Islamic finance structures. Your role is to extract
structured information from deal descriptions.

CONSTRAINTS:
- Output MUST be valid JSON conforming to DealProfile schema
- contractType MUST be from: [Ijara, Murabaha, Musharakah, Mudharaba, Istisna, Salam, Wakala, Tawarruq]
- variant for Ijara MUST be from: [Operating, IMB (Ijara Muntahia Bittamleek)]
- jurisdictions MUST use ISO 3166-1 alpha-2 codes
- regulators MUST be from approved lists per jurisdiction
- assetType MUST be from: [Real Estate, Equipment, Vehicles, Commodities, Securities]

RULES:
1. If information is ambiguous, mark it in "open_questions" array
2. List ALL applicable regulators for the jurisdiction
3. Identify privacy regulations (e.g., QFC Data Protection if QFC entity)
4. Flag any assumptions you make in "assumptions" array

OUTPUT FORMAT: JSON only, no markdown
```

**JSON Schema (Pydantic/Instructor):**
```json
{
  "type": "object",
  "required": ["contractType", "jurisdictions", "regulators"],
  "properties": {
    "contractType": {
      "type": "string",
      "enum": ["Ijara", "Murabaha", "Musharakah", "Mudharaba", "Istisna", "Salam", "Wakala", "Tawarruq"]
    },
    "variant": {
      "type": "string",
      "enum": ["Operating", "IMB", "Partnership", "Diminishing", "Construction", "Forward Sale", "Agency", "Reverse Murabaha"]
    },
    "assetType": {
      "type": "string",
      "enum": ["Real Estate", "Equipment", "Vehicles", "Commodities", "Securities", "Infrastructure"]
    },
    "jurisdictions": {
      "type": "array",
      "items": {"type": "string", "pattern": "^[A-Z]{2}$"}
    },
    "regulators": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["code", "name", "type"],
        "properties": {
          "code": {"type": "string"},
          "name": {"type": "string"},
          "type": {"enum": ["Prudential", "Conduct", "Shariah", "Privacy"]}
        }
      }
    },
    "privacy_zone": {
      "type": "object",
      "properties": {
        "applicable": {"type": "boolean"},
        "framework": {"enum": ["QFC_DP", "UAE_PDPL", "KSA_PDPL", "GDPR", "None"]},
        "cross_border": {"type": "boolean"}
      }
    },
    "assumptions": {
      "type": "array",
      "items": {"type": "string"}
    },
    "open_questions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "question": {"type": "string"},
          "category": {"enum": ["Structure", "Jurisdiction", "Asset", "Counterparty"]}
        }
      }
    }
  }
}
```

**Output Example (Ijara/Qatar):**
```json
{
  "contractType": "Ijara",
  "variant": "Operating",
  "assetType": "Real Estate",
  "jurisdictions": ["QA"],
  "regulators": [
    {"code": "QFCRA", "name": "Qatar Financial Centre Regulatory Authority", "type": "Prudential"},
    {"code": "QCB", "name": "Qatar Central Bank", "type": "Prudential"},
    {"code": "AAOIFI", "name": "AAOIFI Standards (via QCB adoption)", "type": "Shariah"}
  ],
  "privacy_zone": {
    "applicable": true,
    "framework": "QFC_DP",
    "cross_border": false
  },
  "assumptions": [
    "Lessor is the financial institution (not SPV structure)",
    "Asset is commercial property (not residential)",
    "Operating lease implies no purchase option at end"
  ],
  "open_questions": [
    {"question": "Is takaful insurance required for the asset?", "category": "Structure"},
    {"question": "What is the lease term duration?", "category": "Structure"}
  ]
}
```

**Validation Layer (Instructor + Outlines):**
```python
from pydantic import BaseModel, Field, validator
from enum import Enum
from instructor import from_openai
import openai

class ContractType(str, Enum):
    IJARA = "Ijara"
    MURABAHA = "Murabaha"
    # ... etc

class Regulator(BaseModel):
    code: str
    name: str
    type: str = Field(..., pattern="^(Prudential|Conduct|Shariah|Privacy)$")

class DealProfile(BaseModel):
    contractType: ContractType
    variant: str
    assetType: str
    jurisdictions: list[str] = Field(..., min_items=1)
    regulators: list[Regulator]
    privacy_zone: dict
    assumptions: list[str] = []
    open_questions: list[dict] = []

    @validator('jurisdictions')
    def validate_iso_codes(cls, v):
        # Check against ISO 3166-1 alpha-2
        if any(len(code) != 2 or not code.isupper() for code in v):
            raise ValueError("Jurisdictions must be ISO 3166-1 alpha-2 codes")
        return v

# Usage with constrained decoding
client = from_openai(openai.OpenAI())
profile = client.chat.completions.create(
    model="gpt-4o",
    response_model=DealProfile,
    messages=[{"role": "system", "content": SYSTEM_PROMPT},
              {"role": "user", "content": intent_text}]
)
```

**HITL Gate 1: Profile Approval**
- **Reviewer:** Compliance Officer + Shariah Advisor
- **Decision:** Approve / Request Clarification / Reject
- **If rejected:** Loop back to A0 with feedback
- **Output:** `approved_profile.json` with digital signature

---

## Phase 2: OBLIGATION EXTRACTION (Plan - ISO 37301)

### Agent A1: Obligations Harvester

**Purpose:** Extract atomic regulatory obligations from curated corpus with exact citations.

**Curated Corpus (Qatar Ijara):**
```
1. QFCRA_ISFI_Rulebook_Chapter_6_Islamic_Leasing.pdf
2. QCB_Law_13_2012_Articles_109-115.pdf
3. AAOIFI_SS9_Ijara.pdf
4. AAOIFI_GS1_SSB_Governance.pdf
5. AAOIFI_GS3_Internal_Shariah_Review.pdf
6. QFC_Data_Protection_Regulations_2021.pdf
```

**System Prompt:**
```markdown
You are an Obligations Harvester for Islamic finance regulatory compliance.

YOUR TASK: Extract ATOMIC obligations from the provided regulatory passages.

CRITICAL RULES:
1. VERBATIM EXTRACTION: Copy obligation text word-for-word from source
2. EXACT CITATIONS: Include document ID, section number, paragraph
3. NO INFERENCE: If a requirement is not explicitly stated, DO NOT include it
4. ONE OBLIGATION PER ITEM: Split compound requirements into atomic obligations
5. CLASSIFICATION: Tag as Shariah/Prudential/Privacy/Operational

OBLIGATION STRUCTURE:
- id: Unique identifier (e.g., "QA-IJARA-001")
- text: Verbatim quote from source
- source_id: Document identifier
- section: Exact section reference (e.g., "AAOIFI SS-9 §4/1/3")
- class: One of [Shariah, Prudential, Privacy, Operational]
- mandatory: true if "must"/"shall"/"required", false if "should"/"recommended"
- summary: Your 1-sentence plain-language summary

RETRIEVAL CONTEXT WILL BE PROVIDED. You may ONLY reference obligations
present in the context. If context is insufficient, output "INSUFFICIENT_CONTEXT".

OUTPUT: JSON array of Obligation objects only.
```

**JSON Schema:**
```json
{
  "type": "object",
  "required": ["obligations"],
  "properties": {
    "obligations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "text", "source_id", "section", "class", "mandatory"],
        "properties": {
          "id": {"type": "string", "pattern": "^[A-Z]{2}-[A-Z]+-[0-9]{3}$"},
          "text": {"type": "string", "minLength": 10},
          "source_id": {"type": "string"},
          "section": {"type": "string"},
          "class": {"enum": ["Shariah", "Prudential", "Privacy", "Operational"]},
          "mandatory": {"type": "boolean"},
          "summary": {"type": "string"}
        }
      }
    }
  }
}
```

**Retrieval Strategy (RAG with Faithfulness Check):**
```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from ragas.metrics import faithfulness
from ragas import evaluate

# 1. Retrieve relevant passages
vectorstore = Chroma.from_documents(
    documents=corpus_docs,
    embedding=OpenAIEmbeddings(),
    collection_name="qatar_ijara_obligations"
)

retrieved_passages = vectorstore.similarity_search(
    f"Ijara obligations for {approved_profile.regulators}",
    k=20,
    filter={"regulator": {"$in": ["QFCRA", "QCB", "AAOIFI"]}}
)

# 2. Generate obligations
obligations_output = agent_a1.extract(
    context=retrieved_passages,
    profile=approved_profile
)

# 3. FAITHFULNESS CHECK (RAGAS)
faithfulness_score = evaluate(
    dataset={
        "question": "What are the Ijara obligations?",
        "contexts": [p.page_content for p in retrieved_passages],
        "answer": obligations_output.model_dump_json()
    },
    metrics=[faithfulness]
)

# HARD GATE: Fail if faithfulness < 0.90
if faithfulness_score['faithfulness'] < 0.90:
    raise ValueError(f"Faithfulness too low: {faithfulness_score}")
```

**Output Example (Ijara/Qatar - Partial):**
```json
{
  "obligations": [
    {
      "id": "QA-IJARA-001",
      "text": "The lessor must own the leased asset prior to entering into the lease contract.",
      "source_id": "AAOIFI_SS9",
      "section": "§3/1/1",
      "class": "Shariah",
      "mandatory": true,
      "summary": "Lessor must have ownership before lease"
    },
    {
      "id": "QA-IJARA-002",
      "text": "Rental payments shall commence only after the lessee has taken delivery and possession of the leased asset.",
      "source_id": "AAOIFI_SS9",
      "section": "§4/1/3",
      "class": "Shariah",
      "mandatory": true,
      "summary": "Rent starts only after delivery"
    },
    {
      "id": "QA-IJARA-003",
      "text": "The lessor shall bear the risk of total or partial destruction of the leased asset during the lease period.",
      "source_id": "AAOIFI_SS9",
      "section": "§4/2/1",
      "class": "Shariah",
      "mandatory": true,
      "summary": "Lessor bears asset destruction risk"
    },
    {
      "id": "QA-IJARA-004",
      "text": "Any late payment charges imposed on the lessee shall be donated to charity and not recognized as income.",
      "source_id": "AAOIFI_SS9",
      "section": "§5/3/2",
      "class": "Shariah",
      "mandatory": true,
      "summary": "Late fees must go to charity"
    },
    {
      "id": "QA-IJARA-005",
      "text": "The Islamic financial institution must establish a Shariah Supervisory Board comprising not less than three qualified scholars.",
      "source_id": "QCB_Law_13_2012",
      "section": "Article 109",
      "class": "Shariah",
      "mandatory": true,
      "summary": "SSB with minimum 3 scholars required"
    },
    {
      "id": "QA-IJARA-006",
      "text": "The institution shall implement a Shariah compliance policy approved by the Shariah Supervisory Board.",
      "source_id": "QFCRA_ISFI",
      "section": "Chapter 2.3.1",
      "class": "Shariah",
      "mandatory": true,
      "summary": "SSB-approved Shariah policy required"
    },
    {
      "id": "QA-IJARA-007",
      "text": "Where personal data is processed, the institution must comply with QFC Data Protection Regulations including obtaining consent and maintaining data security.",
      "source_id": "QFC_DP_2021",
      "section": "Article 12",
      "class": "Privacy",
      "mandatory": true,
      "summary": "Comply with QFC data protection"
    },
    {
      "id": "QA-IJARA-008",
      "text": "The institution should maintain adequate insurance (takaful) coverage for leased assets.",
      "source_id": "QFCRA_ISFI",
      "section": "Chapter 6.4.2",
      "class": "Operational",
      "mandatory": false,
      "summary": "Takaful coverage recommended for assets"
    }
  ]
}
```

**Chain-of-Verification (CoVe) Check:**
```python
# Self-verify extracted obligations
verification_questions = [
    "Does obligation QA-IJARA-002 actually appear in AAOIFI SS-9 §4/1/3?",
    "Is the late payment charity requirement stated in AAOIFI SS-9?",
    # ... generate for all obligations
]

for q in verification_questions:
    verification_answer = agent_a1.verify(
        question=q,
        context=retrieved_passages
    )
    # Compare to original extraction; flag discrepancies
```

**HITL Gate 2: Obligation Review**
- **Reviewers:** SSB Secretary + Compliance Manager
- **Actions:**
  - Flag obligations as `MANDATORY`/`RECOMMENDED`/`NOT_APPLICABLE`
  - Add jurisdiction-specific notes
  - Request additional sources if gaps found
- **Output:** `approved_obligations.json` (signed)

---

## Phase 3: RISK MAPPING (Plan - ISO 31000)

### Agent A2: Risk Mapper

**Purpose:** Map obligations to risk scenarios using ISO 31000 framework.

**System Prompt:**
```markdown
You are a Risk Mapper for Islamic finance compliance using ISO 31000 framework.

TASK: For each obligation, identify:
1. Risk scenario (what could go wrong)
2. Risk type (Shariah Non-Compliance Risk / Operational / Market / Credit / Legal)
3. Consequence if obligation violated
4. Key Risk Indicator (KRI) - measurable metric
5. Treatment approach (Prevent / Detect / Correct)

ISO 31000 RISK CATEGORIES:
- Strategic Risk
- Operational Risk
- Financial Risk (Market/Credit/Liquidity)
- Compliance Risk (includes SNCR)
- Reputational Risk

SHARIAH-SPECIFIC:
- SNCR (Shariah Non-Compliance Risk) is a PRIMARY category
- Distinguish between form (structure) and substance (intent) violations

OUTPUT: Risk[] array with obligation linkage
```

**JSON Schema:**
```json
{
  "type": "object",
  "properties": {
    "risks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "obl_id", "risk_type", "scenario", "consequence", "kri", "treatment"],
        "properties": {
          "id": {"type": "string"},
          "obl_id": {"type": "string"},
          "risk_type": {
            "enum": ["SNCR", "Operational", "Market", "Credit", "Legal", "Reputational"]
          },
          "scenario": {"type": "string"},
          "consequence": {"type": "string"},
          "kri": {
            "type": "object",
            "properties": {
              "metric": {"type": "string"},
              "threshold": {"type": "string"},
              "frequency": {"enum": ["Continuous", "Daily", "Weekly", "Monthly"]}
            }
          },
          "treatment": {"enum": ["Prevent", "Detect", "Correct", "Accept"]},
          "iso31000_category": {
            "enum": ["Strategic", "Operational", "Financial", "Compliance", "Reputational"]
          }
        }
      }
    }
  }
}
```

**Output Example (Ijara/Qatar - Partial):**
```json
{
  "risks": [
    {
      "id": "RISK-IJARA-001",
      "obl_id": "QA-IJARA-002",
      "risk_type": "SNCR",
      "scenario": "Rent charged before lessee takes delivery of asset",
      "consequence": "Contract deemed non-Shariah compliant; rental income must be purified (donated to charity); reputational damage",
      "kri": {
        "metric": "Instances where rent_start_date < delivery_acceptance_date",
        "threshold": "Zero tolerance",
        "frequency": "Continuous"
      },
      "treatment": "Prevent",
      "iso31000_category": "Compliance"
    },
    {
      "id": "RISK-IJARA-002",
      "obl_id": "QA-IJARA-004",
      "risk_type": "SNCR",
      "scenario": "Late payment charges recognized as revenue instead of donated to charity",
      "consequence": "SNCR incident; income must be purified; SSB escalation; regulatory reporting required",
      "kri": {
        "metric": "Late fee income in P&L",
        "threshold": "Must equal zero",
        "frequency": "Monthly"
      },
      "treatment": "Detect",
      "iso31000_category": "Compliance"
    },
    {
      "id": "RISK-IJARA-003",
      "obl_id": "QA-IJARA-003",
      "risk_type": "Operational",
      "scenario": "Leased asset destroyed without adequate insurance; lessor unable to bear loss",
      "consequence": "Financial loss; contract termination; customer dispute",
      "kri": {
        "metric": "% of leased assets with active takaful coverage",
        "threshold": ">95%",
        "frequency": "Weekly"
      },
      "treatment": "Prevent",
      "iso31000_category": "Operational"
    },
    {
      "id": "RISK-IJARA-004",
      "obl_id": "QA-IJARA-007",
      "risk_type": "Legal",
      "scenario": "Personal data processed without proper consent or security",
      "consequence": "QFC Data Protection Authority penalties; customer litigation; reputational damage",
      "kri": {
        "metric": "Data protection incidents",
        "threshold": "Zero",
        "frequency": "Continuous"
      },
      "treatment": "Prevent",
      "iso31000_category": "Compliance"
    }
  ]
}
```

**HITL Gate 3: Risk Assessment**
- **Reviewers:** Risk Manager + SSB Member
- **Actions:**
  - Assign risk owners (specific roles)
  - Set risk appetite/tolerance levels
  - Prioritize treatment (high/medium/low)
- **Output:** `approved_risks.json`

---

## Phase 4: CONTROLS & TESTS (Do - COSO)

### Agent A3: Control Synthesizer

**Purpose:** Design operational controls using COSO framework to address obligations and mitigate risks.

**System Prompt:**
```markdown
You are a Control Designer using COSO Internal Control Framework.

COSO COMPONENTS:
1. Control Environment (governance, ethics, competence)
2. Risk Assessment (identification, analysis)
3. Control Activities (policies, procedures, tech controls)
4. Information & Communication (reporting, data quality)
5. Monitoring (ongoing, separate evaluations)

TASK: For each obligation, design TESTABLE controls.

CONTROL STRUCTURE:
- Control Objective: What risk/obligation is being addressed
- Control Activity: Specific action/procedure
- Frequency: Continuous / Daily / Weekly / Monthly / Quarterly / Annual
- Owner Role: Who executes (not person names)
- Test Procedure: Binary pass/fail test
- Evidence Type: What artifact proves execution (Guardian VC type)
- Automation Level: Manual / Semi-automated / Fully Automated

CRITICAL: Every test_procedure must be implementable as Guardian policy logic.

OUTPUT: Controls[] array
```

**JSON Schema:**
```json
{
  "type": "object",
  "properties": {
    "controls": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "obl_id", "objective", "activity", "frequency", "owner_role", "test_procedure", "evidence_vc", "automation_level"],
        "properties": {
          "id": {"type": "string"},
          "obl_id": {"type": "string"},
          "risk_id": {"type": "string"},
          "objective": {"type": "string"},
          "activity": {"type": "string"},
          "frequency": {
            "enum": ["Continuous", "Daily", "Weekly", "Monthly", "Quarterly", "Annual", "Event-Driven"]
          },
          "owner_role": {"type": "string"},
          "test_procedure": {"type": "string"},
          "evidence_vc": {"type": "string"},
          "automation_level": {
            "enum": ["Manual", "Semi-Automated", "Fully Automated"]
          },
          "coso_component": {
            "enum": ["Control Environment", "Risk Assessment", "Control Activities", "Information & Communication", "Monitoring"]
          }
        }
      }
    }
  }
}
```

**Output Example (Ijara/Qatar - Partial):**
```json
{
  "controls": [
    {
      "id": "CTRL-IJARA-001",
      "obl_id": "QA-IJARA-001",
      "risk_id": null,
      "objective": "Ensure lessor owns asset before lease execution",
      "activity": "Verify asset title/ownership document exists and lessor is named owner prior to lease contract signing",
      "frequency": "Event-Driven",
      "owner_role": "Legal / Asset Manager",
      "test_procedure": "CHECK: ownership_document.owner == lessor.entity_id AND ownership_document.date < lease_contract.date",
      "evidence_vc": "AssetOwnershipVC",
      "automation_level": "Fully Automated",
      "coso_component": "Control Activities"
    },
    {
      "id": "CTRL-IJARA-002",
      "obl_id": "QA-IJARA-002",
      "risk_id": "RISK-IJARA-001",
      "objective": "Prevent rent charging before delivery",
      "activity": "Obtain delivery acceptance confirmation from lessee before activating rent schedule",
      "frequency": "Event-Driven",
      "owner_role": "Operations Manager",
      "test_procedure": "CHECK: rent_schedule.start_date >= delivery_acceptance.date",
      "evidence_vc": "DeliveryAcceptanceVC",
      "automation_level": "Fully Automated",
      "coso_component": "Control Activities"
    },
    {
      "id": "CTRL-IJARA-003",
      "obl_id": "QA-IJARA-004",
      "risk_id": "RISK-IJARA-002",
      "objective": "Ensure late fees donated to charity",
      "activity": "Monitor late payment fees accrued; verify equal amount donated monthly with charity receipt",
      "frequency": "Monthly",
      "owner_role": "Finance Manager",
      "test_procedure": "CHECK: SUM(late_fees_accrued) == donation_receipt.amount AND donation_receipt.recipient IN approved_charities",
      "evidence_vc": "LateFeeDonationVC",
      "automation_level": "Semi-Automated",
      "coso_component": "Monitoring"
    },
    {
      "id": "CTRL-IJARA-004",
      "obl_id": "QA-IJARA-003",
      "risk_id": "RISK-IJARA-003",
      "objective": "Maintain takaful coverage for assets",
      "activity": "Verify active takaful policy exists for each leased asset with coverage >= asset value",
      "frequency": "Weekly",
      "owner_role": "Risk Manager",
      "test_procedure": "CHECK: takaful_policy.status == 'Active' AND takaful_policy.coverage_amount >= asset.current_value AND takaful_policy.expiry > TODAY",
      "evidence_vc": "TakafulCoverageVC",
      "automation_level": "Fully Automated",
      "coso_component": "Control Activities"
    },
    {
      "id": "CTRL-IJARA-005",
      "obl_id": "QA-IJARA-005",
      "risk_id": null,
      "objective": "Maintain compliant SSB composition",
      "activity": "Verify SSB has ≥3 active members, all with valid Shariah scholar qualifications",
      "frequency": "Quarterly",
      "owner_role": "Company Secretary",
      "test_procedure": "CHECK: COUNT(ssb_members WHERE status='Active') >= 3 AND ALL(member.qualification == 'Certified Shariah Scholar')",
      "evidence_vc": "SSBCompositionVC",
      "automation_level": "Semi-Automated",
      "coso_component": "Control Environment"
    },
    {
      "id": "CTRL-IJARA-006",
      "obl_id": "QA-IJARA-007",
      "risk_id": "RISK-IJARA-004",
      "objective": "Protect personal data per QFC regulations",
      "activity": "Obtain explicit consent for data processing; encrypt PII fields; conduct DPIA for high-risk processing",
      "frequency": "Event-Driven",
      "owner_role": "Data Protection Officer",
      "test_procedure": "CHECK: consent_record.status == 'Valid' AND data_fields.encryption == true AND (IF high_risk THEN dpia_record EXISTS)",
      "evidence_vc": "DataProtectionComplianceVC",
      "automation_level": "Semi-Automated",
      "coso_component": "Control Activities"
    }
  ]
}
```

**HITL Gate 4: Control Approval**
- **Reviewers:** Internal Shariah Audit + Compliance Head
- **Actions:**
  - Validate control logic covers obligation
  - Confirm test procedures are binary (pass/fail)
  - Ensure evidence types are feasible to collect
- **Output:** `approved_controls.json`

---

## Phase 5: EVIDENCE SCHEMA DESIGN (Guardian VC Schemas)

### Agent A4: Evidence Schema Designer

**Purpose:** Create JSON Schemas for Verifiable Credentials that serve as control evidence.

**System Prompt:**
```markdown
You are a Schema Designer for Guardian Verifiable Credentials.

TASK: For each unique evidence_vc type in Controls[], create a JSON Schema
that captures all data points needed for the test_procedure.

GUARDIAN VC REQUIREMENTS:
1. Schema must be valid JSON Schema Draft-07
2. Include @context for W3C Verifiable Credentials
3. Mark PII fields with "pii": true
4. Specify selective disclosure strategy for privacy:
   - public: Always visible
   - hashed: Hashed on-chain
   - sd_attribute: Selective disclosure (holder can reveal)
   - encrypted: Encrypted, only holder/verifier can decrypt

QFC DATA PROTECTION CONSIDERATIONS:
- Lessee/customer names, addresses, IDs are PII
- Financial amounts are NOT PII but may be confidential
- Asset details are usually public
- Charity donation receipts should be public (transparency)

OUTPUT: SchemaDefinition[] array
```

**JSON Schema for Schema Output:**
```json
{
  "type": "object",
  "properties": {
    "schemas": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["vc_type", "schema", "sd_plan"],
        "properties": {
          "vc_type": {"type": "string"},
          "description": {"type": "string"},
          "schema": {"type": "object"},
          "sd_plan": {
            "type": "object",
            "description": "Selective disclosure strategy per field",
            "additionalProperties": {
              "enum": ["public", "hashed", "sd_attribute", "encrypted"]
            }
          },
          "issuer_role": {"type": "string"},
          "verifier_role": {"type": "string"}
        }
      }
    }
  }
}
```

**Output Example (Ijara/Qatar - Partial):**
```json
{
  "schemas": [
    {
      "vc_type": "AssetOwnershipVC",
      "description": "Verifiable credential proving lessor ownership of asset before lease",
      "schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "type": "object",
        "required": ["asset_id", "owner_entity_id", "ownership_date", "document_ref"],
        "properties": {
          "asset_id": {"type": "string", "pii": false},
          "asset_description": {"type": "string", "pii": false},
          "owner_entity_id": {"type": "string", "pii": false},
          "owner_name": {"type": "string", "pii": true},
          "ownership_date": {"type": "string", "format": "date"},
          "document_ref": {"type": "string"},
          "document_type": {"enum": ["Title Deed", "Purchase Agreement", "Transfer Document"]}
        }
      },
      "sd_plan": {
        "asset_id": "public",
        "asset_description": "public",
        "owner_entity_id": "public",
        "owner_name": "sd_attribute",
        "ownership_date": "public",
        "document_ref": "hashed",
        "document_type": "public"
      },
      "issuer_role": "Asset Manager / Legal Counsel",
      "verifier_role": "Compliance / Auditor"
    },
    {
      "vc_type": "DeliveryAcceptanceVC",
      "description": "Lessee confirmation of asset delivery and possession",
      "schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "type": "object",
        "required": ["lease_id", "asset_id", "lessee_id", "delivery_date", "acceptance_status"],
        "properties": {
          "lease_id": {"type": "string", "pii": false},
          "asset_id": {"type": "string", "pii": false},
          "lessee_id": {"type": "string", "pii": true},
          "lessee_name": {"type": "string", "pii": true},
          "delivery_date": {"type": "string", "format": "date-time"},
          "acceptance_status": {"enum": ["Accepted", "Rejected", "Conditional"]},
          "condition_notes": {"type": "string"},
          "signature": {"type": "string"}
        }
      },
      "sd_plan": {
        "lease_id": "public",
        "asset_id": "public",
        "lessee_id": "encrypted",
        "lessee_name": "encrypted",
        "delivery_date": "public",
        "acceptance_status": "public",
        "condition_notes": "sd_attribute",
        "signature": "hashed"
      },
      "issuer_role": "Lessee / Operations Manager",
      "verifier_role": "Compliance / Finance"
    },
    {
      "vc_type": "LateFeeDonationVC",
      "description": "Proof that late payment fees were donated to charity",
      "schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "type": "object",
        "required": ["period_start", "period_end", "late_fees_accrued", "donation_amount", "charity_recipient", "receipt_ref"],
        "properties": {
          "period_start": {"type": "string", "format": "date"},
          "period_end": {"type": "string", "format": "date"},
          "late_fees_accrued": {"type": "number", "minimum": 0},
          "donation_amount": {"type": "number", "minimum": 0},
          "currency": {"type": "string", "default": "QAR"},
          "charity_recipient": {"type": "string"},
          "charity_registration": {"type": "string"},
          "receipt_ref": {"type": "string"},
          "donation_date": {"type": "string", "format": "date"}
        }
      },
      "sd_plan": {
        "period_start": "public",
        "period_end": "public",
        "late_fees_accrued": "public",
        "donation_amount": "public",
        "currency": "public",
        "charity_recipient": "public",
        "charity_registration": "public",
        "receipt_ref": "hashed",
        "donation_date": "public"
      },
      "issuer_role": "Finance Manager",
      "verifier_role": "SSB / Auditor / Public"
    },
    {
      "vc_type": "TakafulCoverageVC",
      "description": "Proof of active takaful insurance for leased asset",
      "schema": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "type": "object",
        "required": ["asset_id", "policy_number", "coverage_amount", "policy_start", "policy_expiry", "status"],
        "properties": {
          "asset_id": {"type": "string"},
          "policy_number": {"type": "string"},
          "takaful_provider": {"type": "string"},
          "coverage_amount": {"type": "number"},
          "currency": {"type": "string", "default": "QAR"},
          "policy_start": {"type": "string", "format": "date"},
          "policy_expiry": {"type": "string", "format": "date"},
          "status": {"enum": ["Active", "Expired", "Cancelled"]},
          "coverage_type": {"type": "string"}
        }
      },
      "sd_plan": {
        "asset_id": "public",
        "policy_number": "hashed",
        "takaful_provider": "public",
        "coverage_amount": "public",
        "currency": "public",
        "policy_start": "public",
        "policy_expiry": "public",
        "status": "public",
        "coverage_type": "public"
      },
      "issuer_role": "Risk Manager / Takaful Provider",
      "verifier_role": "Compliance / Auditor"
    }
  ]
}
```

**HITL Gate 5: Schema & Privacy Review**
- **Reviewers:** Data Protection Officer + Tech Lead
- **Actions:**
  - Validate SD strategy complies with QFC DP
  - Ensure schemas support all test_procedure logic
  - Confirm no unnecessary PII collection
- **Output:** `approved_schemas.json`

---

## Phase 6: GUARDIAN POLICY COMPILATION (Do + Check)

### Agent A6: Guardian Policy Composer

**Purpose:** Generate Guardian policy JSON using workflow blocks.

**System Prompt:**
```markdown
You are a Guardian Policy Composer.

TASK: Create a Guardian policy workflow that:
1. Defines ROLES: OWNER (lessor), PROP (lessee), VVB (verifier/auditor/SSB)
2. Publishes VC SCHEMAS from approved_schemas.json
3. Creates WORKFLOW BLOCKS to:
   - Request VCs from appropriate roles
   - Validate VC schemas and signatures
   - Execute control logic checks
   - Route to approval or rejection based on results
4. Uses ONLY these allowed blocks:
   - requestVCDocumentBlock
   - documentValidatorBlock
   - customLogicBlock
   - switchBlock
   - sendToGuardianBlock
   - filtersAddon (for queries)
   - interfaceStepBlock (for HITL steps)

POLICY STRUCTURE:
{
  "name": "Ijara Operating Lease - Qatar (QFCRA/QCB)",
  "topicDescription": "Shariah-compliant operating lease policy",
  "roles": [...],
  "schemas": [...],
  "workflow": [...]
}

CRITICAL RULES:
1. NO arbitrary HTTP calls (security risk)
2. Every control from approved_controls.json must map to a workflow step
3. Use {schema_uuid} placeholders (will be resolved on publish)
4. HITL gates use interfaceStepBlock with proper role assignment

OUTPUT: Valid Guardian policy JSON
```

**Output Example (Ijara/Qatar - Simplified):**
```json
{
  "name": "Ijara Operating Lease - Qatar (QFCRA/QCB)",
  "version": "1.0.0",
  "topicDescription": "Shariah-compliant operating lease compliance policy for Qatari institutions",
  "roles": [
    "OWNER",
    "PROP",
    "VVB",
    "SSB"
  ],
  "schemas": [
    {
      "name": "AssetOwnershipVC",
      "entity": "VC",
      "fields": "{{SCHEMA_FROM_A4}}"
    },
    {
      "name": "DeliveryAcceptanceVC",
      "entity": "VC",
      "fields": "{{SCHEMA_FROM_A4}}"
    },
    {
      "name": "LateFeeDonationVC",
      "entity": "VC",
      "fields": "{{SCHEMA_FROM_A4}}"
    },
    {
      "name": "TakafulCoverageVC",
      "entity": "VC",
      "fields": "{{SCHEMA_FROM_A4}}"
    }
  ],
  "workflow": [
    {
      "blockType": "interfaceStepBlock",
      "tag": "init_lease_application",
      "permissions": ["OWNER"],
      "uiMetaData": {
        "title": "Initiate Lease Application",
        "description": "OWNER submits initial lease details"
      }
    },
    {
      "blockType": "requestVCDocumentBlock",
      "tag": "request_asset_ownership",
      "permissions": ["OWNER"],
      "schema": "{AssetOwnershipVC_uuid}",
      "uiMetaData": {
        "title": "Submit Asset Ownership Proof",
        "description": "CTRL-IJARA-001: Prove asset ownership before lease"
      }
    },
    {
      "blockType": "documentValidatorBlock",
      "tag": "validate_asset_ownership",
      "schema": "{AssetOwnershipVC_uuid}",
      "conditions": [
        {
          "field": "owner_entity_id",
          "operator": "==",
          "value": "{{OWNER.entity_id}}"
        }
      ]
    },
    {
      "blockType": "customLogicBlock",
      "tag": "check_ownership_date",
      "script": `
        function check(documents) {
          const ownership = documents.find(d => d.type === 'AssetOwnershipVC');
          const lease = documents.find(d => d.type === 'LeaseContractVC');

          if (!ownership || !lease) {
            return { pass: false, violations: ['Missing required documents'] };
          }

          const ownershipDate = new Date(ownership.ownership_date);
          const leaseDate = new Date(lease.contract_date);

          if (ownershipDate >= leaseDate) {
            return {
              pass: false,
              violations: ['CTRL-IJARA-001 FAIL: Ownership date must precede lease date']
            };
          }

          return { pass: true, violations: [] };
        }
        return check(documents);
      `
    },
    {
      "blockType": "switchBlock",
      "tag": "ownership_check_result",
      "conditions": [
        {
          "condition": "customLogicBlock.check_ownership_date.pass == true",
          "nextBlock": "request_delivery_acceptance"
        },
        {
          "condition": "customLogicBlock.check_ownership_date.pass == false",
          "nextBlock": "reject_application"
        }
      ]
    },
    {
      "blockType": "requestVCDocumentBlock",
      "tag": "request_delivery_acceptance",
      "permissions": ["PROP"],
      "schema": "{DeliveryAcceptanceVC_uuid}",
      "uiMetaData": {
        "title": "Confirm Asset Delivery",
        "description": "PROP confirms receipt and acceptance of asset"
      }
    },
    {
      "blockType": "customLogicBlock",
      "tag": "check_rent_after_delivery",
      "script": `
        function check(documents) {
          const delivery = documents.find(d => d.type === 'DeliveryAcceptanceVC');
          const rentSchedule = documents.find(d => d.type === 'RentScheduleVC');

          if (!delivery || !rentSchedule) {
            return { pass: false, violations: ['Missing required documents'] };
          }

          const deliveryDate = new Date(delivery.delivery_date);
          const rentStartDate = new Date(rentSchedule.start_date);

          if (rentStartDate < deliveryDate) {
            return {
              pass: false,
              violations: ['CTRL-IJARA-002 FAIL: Rent cannot start before delivery (AAOIFI SS-9 §4/1/3)']
            };
          }

          return { pass: true, violations: [] };
        }
        return check(documents);
      `
    },
    {
      "blockType": "interfaceStepBlock",
      "tag": "ssb_approval_gate",
      "permissions": ["SSB"],
      "uiMetaData": {
        "title": "SSB Shariah Compliance Review",
        "description": "SSB reviews and approves structure"
      },
      "stopPropagation": true
    },
    {
      "blockType": "sendToGuardianBlock",
      "tag": "finalize_and_mint",
      "uiMetaData": {
        "title": "Policy Approved - Mint to Hedera",
        "description": "All checks passed, creating immutable record"
      }
    }
  ],
  "projectSchema": "{project_schema_from_A4}"
}
```

**Validation (against our policy-config schema):**
```python
import jsonschema

policy_schema = {
  "type": "object",
  "required": ["name", "version", "roles", "schemas", "workflow"],
  "properties": {
    "name": {"type": "string"},
    "version": {"type": "string", "pattern": "^\\d+\\.\\d+\\.\\d+$"},
    "roles": {"type": "array", "items": {"type": "string"}},
    "workflow": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["blockType", "tag"],
        "properties": {
          "blockType": {
            "enum": [
              "requestVCDocumentBlock",
              "documentValidatorBlock",
              "customLogicBlock",
              "switchBlock",
              "sendToGuardianBlock",
              "interfaceStepBlock",
              "filtersAddon"
            ]
          }
        }
      }
    }
  }
}

jsonschema.validate(policy_json, policy_schema)
```

### Agent A7: Logic Encoder

**Purpose:** Generate and unit-test deterministic JavaScript for control gates.

**System Prompt:**
```markdown
You are a Logic Encoder for Guardian control gates.

TASK: For each control in approved_controls.json, generate a pure function:
- Input: documents[] (array of VCs)
- Output: {pass: boolean, violations: string[]}
- Logic: Implement the test_procedure EXACTLY as specified

REQUIREMENTS:
1. Pure function (no side effects, no external calls)
2. Deterministic (same input → same output)
3. Handle missing documents gracefully (return violation, not error)
4. Use strict equality checks for dates/amounts
5. Include control ID in violation messages

TEST GENERATION:
For each function, also generate property-based tests covering:
- Happy path (pass)
- Boundary conditions (dates, amounts)
- Missing documents
- Invalid data types

OUTPUT: {function_code, unit_tests}[]
```

**Output Example (Partial):**
```javascript
// CTRL-IJARA-002: Rent after delivery check
function ctrl_ijara_002_rent_after_delivery(documents) {
  const delivery = documents.find(d => d.type === 'DeliveryAcceptanceVC');
  const rentSchedule = documents.find(d => d.type === 'RentScheduleVC');

  // Missing document checks
  if (!delivery) {
    return {
      pass: false,
      violations: ['CTRL-IJARA-002: Missing DeliveryAcceptanceVC']
    };
  }

  if (!rentSchedule) {
    return {
      pass: false,
      violations: ['CTRL-IJARA-002: Missing RentScheduleVC']
    };
  }

  // Parse dates
  const deliveryDate = new Date(delivery.delivery_date);
  const rentStartDate = new Date(rentSchedule.start_date);

  // Validate date parsing
  if (isNaN(deliveryDate.getTime()) || isNaN(rentStartDate.getTime())) {
    return {
      pass: false,
      violations: ['CTRL-IJARA-002: Invalid date format']
    };
  }

  // Core check: rent must not start before delivery
  if (rentStartDate < deliveryDate) {
    return {
      pass: false,
      violations: [
        `CTRL-IJARA-002 FAIL: Rent start (${rentSchedule.start_date}) precedes delivery (${delivery.delivery_date}) - violates AAOIFI SS-9 §4/1/3`
      ]
    };
  }

  return { pass: true, violations: [] };
}

// Unit tests
describe('CTRL-IJARA-002: Rent after delivery', () => {
  test('Pass: Rent starts on delivery date', () => {
    const docs = [
      { type: 'DeliveryAcceptanceVC', delivery_date: '2025-01-10' },
      { type: 'RentScheduleVC', start_date: '2025-01-10' }
    ];
    expect(ctrl_ijara_002_rent_after_delivery(docs)).toEqual({
      pass: true, violations: []
    });
  });

  test('Pass: Rent starts after delivery', () => {
    const docs = [
      { type: 'DeliveryAcceptanceVC', delivery_date: '2025-01-10' },
      { type: 'RentScheduleVC', start_date: '2025-01-11' }
    ];
    expect(ctrl_ijara_002_rent_after_delivery(docs)).toEqual({
      pass: true, violations: []
    });
  });

  test('Fail: Rent starts before delivery', () => {
    const docs = [
      { type: 'DeliveryAcceptanceVC', delivery_date: '2025-01-10' },
      { type: 'RentScheduleVC', start_date: '2025-01-09' }
    ];
    const result = ctrl_ijara_002_rent_after_delivery(docs);
    expect(result.pass).toBe(false);
    expect(result.violations[0]).toContain('CTRL-IJARA-002 FAIL');
  });

  test('Fail: Missing delivery VC', () => {
    const docs = [
      { type: 'RentScheduleVC', start_date: '2025-01-10' }
    ];
    const result = ctrl_ijara_002_rent_after_delivery(docs);
    expect(result.pass).toBe(false);
    expect(result.violations[0]).toContain('Missing DeliveryAcceptanceVC');
  });
});
```

**Run Tests & Block on Failure:**
```bash
npm test -- ctrl-logic.test.js
# Exit code 0 → proceed
# Exit code 1 → BLOCK deployment
```

**HITL Gate 6: Policy Review**
- **Reviewers:** Tech Lead + SSB Representative
- **Actions:**
  - Validate policy workflow matches approved controls
  - Review all customLogicBlock scripts for correctness
  - Confirm role assignments (OWNER/PROP/VVB/SSB)
- **Output:** `approved_policy.json`

---

## Phase 7: DRY-RUN & VALIDATION (Check)

### Agent A8: Dry-Run Orchestrator

**Purpose:** Execute Guardian Dry-Run mode with virtual users to validate policy end-to-end.

**System Prompt:**
```markdown
You are a Dry-Run Orchestrator for Guardian policy testing.

TASK: Create and execute test scenarios using Guardian Dry-Run features:
1. Virtual Users (OWNER/PROP/VVB/SSB)
2. Savepoints (rollback capability)
3. Record/Replay (scenario execution)

GOLDEN SCENARIOS (Must All Pass):
1. Happy Path - Operating Ijara
2. Violation - Rent before delivery
3. Violation - Missing asset ownership
4. Violation - Late fee not donated
5. Violation - Expired takaful coverage
6. Privacy Check - PII properly encrypted

For each scenario:
- Define initial state (documents, dates)
- Execute workflow
- Capture:
  - Final state (approved/rejected)
  - Violation messages
  - Guardian topic messages
  - Indexer queryability

OUTPUT: Machine-readable test report with pass/fail per scenario
```

**Dry-Run CLI Execution:**
```bash
# Using Guardian CLI or API
guardian-cli dry-run \
  --policy approved_policy.json \
  --scenarios golden_scenarios.json \
  --virtual-users 4 \
  --output dry_run_report.json

# Example scenario: Rent before delivery
{
  "scenario_id": "violation_rent_before_delivery",
  "description": "Rent starts before delivery - should be rejected",
  "initial_state": {
    "documents": [
      {
        "type": "AssetOwnershipVC",
        "owner_entity_id": "LESSOR_001",
        "ownership_date": "2025-01-01"
      },
      {
        "type": "LeaseContractVC",
        "contract_date": "2025-01-05",
        "lessor": "LESSOR_001",
        "lessee": "LESSEE_001"
      },
      {
        "type": "DeliveryAcceptanceVC",
        "delivery_date": "2025-01-10"
      },
      {
        "type": "RentScheduleVC",
        "start_date": "2025-01-09"
      }
    ]
  },
  "expected_outcome": {
    "status": "REJECTED",
    "violations": ["CTRL-IJARA-002 FAIL"]
  }
}
```

**Faithfulness & Quality Checks (RAGAS + TruLens):**
```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy
from trulens_eval import TruChain, Feedback
from trulens_eval.feedback import Groundedness

# 1. RAGAS Faithfulness on dry-run outputs
dry_run_results = load_dry_run_report()

for scenario in dry_run_results['scenarios']:
    score = evaluate(
        dataset={
            "question": f"Does scenario {scenario['id']} outcome match expected?",
            "contexts": [scenario['initial_state']],
            "answer": scenario['actual_outcome']
        },
        metrics=[faithfulness]
    )

    if score['faithfulness'] < 0.90:
        raise ValueError(f"Scenario {scenario['id']} failed faithfulness check")

# 2. TruLens feedback on policy execution traces
feedback_functions = [
    Feedback(Groundedness().groundedness_measure).on_output(),
    Feedback(lambda x: len(x) > 0).on(violations)  # Violations properly captured
]

tru_guardian = TruChain(
    guardian_policy,
    app_id="ijara_qatar_policy",
    feedbacks=feedback_functions
)

# Execute with TruLens monitoring
with tru_guardian:
    for scenario in golden_scenarios:
        result = execute_guardian_scenario(scenario)
        # TruLens auto-scores
```

**Dry-Run Report Example:**
```json
{
  "policy": "Ijara Operating Lease - Qatar",
  "execution_time": "2025-01-08T10:30:00Z",
  "scenarios": [
    {
      "id": "happy_path_operating_ijara",
      "status": "PASS",
      "expected": "APPROVED",
      "actual": "APPROVED",
      "violations": [],
      "hedera_topic_id": "0.0.12345",
      "indexer_query_success": true
    },
    {
      "id": "violation_rent_before_delivery",
      "status": "PASS",
      "expected": "REJECTED",
      "actual": "REJECTED",
      "violations": ["CTRL-IJARA-002 FAIL: Rent start (2025-01-09) precedes delivery (2025-01-10)"],
      "hedera_topic_id": null,
      "indexer_query_success": false
    },
    {
      "id": "violation_late_fee_not_donated",
      "status": "PASS",
      "expected": "REJECTED",
      "actual": "REJECTED",
      "violations": ["CTRL-IJARA-003 FAIL: Late fees (1000 QAR) != donation amount (900 QAR)"],
      "hedera_topic_id": null,
      "indexer_query_success": false
    }
  ],
  "summary": {
    "total": 6,
    "passed": 6,
    "failed": 0,
    "faithfulness_avg": 0.96
  }
}
```

**HITL Gate 7: Dry-Run Review**
- **Reviewers:** Internal Audit + SSB Member
- **Actions:**
  - Review all scenario results
  - Replay edge cases manually if needed
  - Confirm violation messages are clear and reference correct obligations
- **If failures:** Loop back to A6/A7 to fix logic
- **Output:** `dry_run_approved.json`

---

## Phase 8: PUBLISH & INDEX (Do - Deploy)

### Agent A9: Publisher & Indexer

**Purpose:** Publish schemas and policy to IPFS + Hedera; configure Global Indexer.

**System Prompt:**
```markdown
You are a Publisher for Guardian policies.

TASK:
1. Publish VC schemas to IPFS (get CIDs)
2. Publish policy JSON to IPFS (get CID)
3. Submit policy to Hedera topic (get topic ID)
4. Configure Global Indexer queries for:
   - SNCR incidents (rejected transactions with violations)
   - Charity donations (LateFeeDonationVC)
   - Asset transfers (for IMB variant)
   - SSB approvals
5. Verify indexer discoverability via API

OUTPUT: Deployment manifest with all IDs/CIDs
```

**Execution (Guardian API):**
```python
import requests
import ipfshttpclient

# 1. Publish schemas to IPFS
ipfs_client = ipfshttpclient.connect('/dns/ipfs.infura.io/tcp/5001/https')
schema_cids = {}

for schema in approved_schemas:
    result = ipfs_client.add_json(schema)
    schema_cids[schema['vc_type']] = result

# 2. Publish policy to IPFS
policy_cid = ipfs_client.add_json(approved_policy)

# 3. Submit to Guardian/Hedera
guardian_api = "https://guardian.example.com/api/v1"
response = requests.post(
    f"{guardian_api}/policies/publish",
    json={
        "policy": approved_policy,
        "ipfs_cid": policy_cid,
        "network": "testnet"  # or mainnet
    },
    headers={"Authorization": f"Bearer {GUARDIAN_API_KEY}"}
)

hedera_topic_id = response.json()['topic_id']

# 4. Configure Global Indexer
indexer_queries = [
    {
        "name": "SNCR Incidents",
        "query": {
          "type": "VC",
          "status": "REJECTED",
          "violations": {"$exists": true}
        },
        "alert": "Email SSB on new incident"
    },
    {
        "name": "Late Fee Donations",
        "query": {
          "type": "LateFeeDonationVC",
          "status": "APPROVED"
        },
        "public": true
    }
]

for query in indexer_queries:
    requests.post(
        f"{guardian_api}/indexer/queries",
        json=query
    )

# 5. Verify indexer discoverability
verify_result = requests.get(
    f"{guardian_api}/indexer/search",
    params={"topic_id": hedera_topic_id}
)

if verify_result.status_code != 200:
    raise ValueError("Indexer verification failed")
```

**Deployment Manifest Output:**
```json
{
  "policy_name": "Ijara Operating Lease - Qatar (QFCRA/QCB)",
  "version": "1.0.0",
  "deployed_at": "2025-01-08T12:00:00Z",
  "network": "hedera-testnet",
  "hedera_topic_id": "0.0.12345",
  "policy_ipfs_cid": "QmPolicyABC123...",
  "schemas": [
    {
      "vc_type": "AssetOwnershipVC",
      "ipfs_cid": "QmSchemaXYZ789...",
      "schema_id": "0.0.12346"
    },
    {
      "vc_type": "DeliveryAcceptanceVC",
      "ipfs_cid": "QmSchemaDEF456...",
      "schema_id": "0.0.12347"
    }
  ],
  "indexer_queries": [
    {
      "name": "SNCR Incidents",
      "query_id": "idx_sncr_001",
      "api_endpoint": "https://indexer.guardian.com/api/sncr"
    },
    {
      "name": "Late Fee Donations",
      "query_id": "idx_donations_001",
      "api_endpoint": "https://indexer.guardian.com/api/donations"
    }
  ],
  "deployment_log_cid": "QmLogDEPLOY...",
  "approved_by": [
    {"role": "Compliance", "signature": "0x..."},
    {"role": "SSB", "signature": "0x..."}
  ]
}
```

**Final HITL Gate: Go-Live Approval**
- **Reviewers:** CEO / Compliance Head / SSB Chairman
- **Decision:** Activate policy for production use
- **Output:** Policy is LIVE on Hedera mainnet

---

## Summary: Complete Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│ FROM INTENT TO DEPLOYED GUARDIAN POLICY                            │
└─────────────────────────────────────────────────────────────────────┘

1. INTAKE (A0) → DealProfile → HITL Approve
   ↓
2. OBLIGATIONS (A1) → 8 Obligations extracted → RAGAS faithfulness → HITL Review
   ↓
3. RISKS (A2) → 4 Risks mapped (ISO 31000) → HITL Assign
   ↓
4. CONTROLS (A3) → 6 Controls designed (COSO) → HITL Approve
   ↓
5. SCHEMAS (A4) → 4 VC schemas + SD plan → HITL Privacy Review
   ↓
6. POLICY (A6) → Guardian workflow JSON → Unit tests (A7) → HITL Review
   ↓
7. DRY-RUN (A8) → 6 scenarios executed → TruLens feedback → HITL Audit
   ↓
8. PUBLISH (A9) → IPFS + Hedera + Indexer → HITL Go-Live

RESULT: Production-ready Guardian policy with complete audit trail
```

---

## Guardrails Summary (Anti-Hallucination Stack)

| Layer | Tool/Framework | Purpose |
|-------|---------------|---------|
| **Output Format** | Instructor + Pydantic | Schema-first JSON validation |
| **Token Control** | Outlines / LM-Format-Enforcer | Constrained decoding (impossible to emit invalid tokens) |
| **Retrieval** | Langchain + Chroma | Closed-corpus RAG |
| **Faithfulness** | RAGAS | Automated scoring vs retrieved context |
| **Self-Check** | Chain-of-Verification (CoVe) | Agent verifies its own outputs |
| **Logic Testing** | Jest / pytest | Unit tests for all control logic |
| **E2E Validation** | Guardian Dry-Run | Virtual users + golden scenarios |
| **Trace Quality** | TruLens | Feedback functions on tool use |
| **Red Team** | Giskard / DeepEval | Adversarial eval suites |
| **HITL Gates** | Custom workflow | Human approval at 7 checkpoints |

---

## Next Steps

1. **Repo Setup**: Create project structure with agent prompts, schemas, and test harness
2. **Tool Integration**: Wire Instructor + Outlines + RAGAS + Guardian CLI
3. **Golden Sets**: Build Qatar Ijara scenario pack (6-10 scenarios)
4. **CI/CD Pipeline**: Automate faithfulness checks, unit tests, dry-run on PR
5. **Pilot Run**: Execute full workflow for Qatar Ijara case end-to-end

Would you like me to generate:
- **Detailed Python/TypeScript implementation** for any specific agent?
- **Complete JSON Schemas** for all VCs?
- **CI/CD config** for automated testing pipeline?
- **Golden scenario pack** for Qatar Ijara testing?
