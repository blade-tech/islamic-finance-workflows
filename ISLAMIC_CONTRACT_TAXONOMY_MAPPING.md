# Islamic Finance Contract Taxonomy → ZeroH Deal Configuration Mapping

**Date**: 2025-01-07
**Purpose**: Map AAOIFI contract classification to ZeroH control library and deal configuration
**Status**: Research Foundation

---

## Executive Summary

This document maps the official AAOIFI Shariah Standards contract taxonomy to ZeroH's deal configuration and control library. It provides the foundation for our configuration-driven GRC architecture.

**Key Finding**: AAOIFI defines 41 Shariah Standards covering distinct contract types. Each contract type has unique:
- Shariah compliance requirements (SG controls)
- Risk profiles (RM controls)
- Accounting treatments (FR controls)
- Documentation obligations (RL controls)

This mapping enables **product-agnostic** control application: the same control library adapts to any Islamic finance product.

---

## Part 1: AAOIFI Shariah Standards Contract Taxonomy

### Primary Classification (14 Core Contracts)

Based on AAOIFI Shariah Standards and market usage:

| SS # | Contract Type | Arabic | Classification | Market Usage (2022) |
|------|--------------|--------|----------------|---------------------|
| **SS-8** | **Murabaha** | المرابحة | Sale-based (Deferred payment) | 24.8% of Sukuk |
| **SS-9** | **Ijara / Ijara Muntahia Bittamleek** | الإجارة | Lease-based | 16.9% of Sukuk |
| **SS-12** | **Musharaka** (Sharikah) | الشركة و المشاركة | Partnership (Equity) | 0.8% of Sukuk |
| **SS-13** | **Mudaraba** | المضاربة | Profit-sharing (Trust-based) | 5.3% of Sukuk |
| **SS-10** | **Salam / Parallel Salam** | السلم | Forward sale (Pre-paid) | Minor usage |
| **SS-11** | **Istisna / Parallel Istisna** | الاستصناع | Manufacturing/construction | Used in infrastructure |
| **SS-30** | **Tawarruq** | التورق | Monetization (Liquidity) | Retail banking |
| **SS-23** | **Wakala** | الوكالة | Agency | 27.3% of Sukuk |
| **SS-19** | **Qard** | القرض | Benevolent loan | Internal treasury |
| **SS-5** | **Kafalah** (Guarantee) | الضمانات | Guarantee | Credit enhancement |
| **SS-7** | **Hawalah** | الحوالة | Transfer of debt | Payment settlement |
| **SS-15** | **Jualah** | الجعالة | Service contract | Specific services |
| **SS-14** | **Documentary Credit** | الاعتمادات المستندية | Trade finance | International trade |
| **SS-17** | **Investment Sukuk** | صكوك الاستثمار | Asset-backed securities | Capital markets |

### Hybrid Structures (Common in Practice)

Real-world products often combine multiple contracts:

| Hybrid Structure | Component Contracts | Use Case |
|-----------------|---------------------|----------|
| **Sukuk Ijara** | Ijara + Wakala | Lease-backed bonds |
| **Sukuk Murabaha** | Murabaha + Wakala | Trade-backed bonds |
| **Musharaka Mutanaqisa** | Musharaka + Ijara | Diminishing partnership (home finance) |
| **Commodity Murabaha** | Murabaha + Wakala + Parallel sale | Liquidity management |
| **Sukuk Istisna** | Istisna + Ijara | Infrastructure project bonds |
| **Mudaraba-Wakala** | Mudaraba + Wakala | Investment funds |

**Implication for ZeroH**: Deal configuration must support **multi-contract deals** with combinatorial controls.

---

## Part 2: Contract-to-Control Mapping

### Mapping Methodology

Each contract type triggers a **subset of controls** from our 26-control library:

```
Contract Type → Applicable Controls → Evidence Requirements → Proof Types
```

### Contract Profile Template

For each contract, we define:

```typescript
interface ContractProfile {
  ssNumber: string                    // AAOIFI SS reference
  contractType: string                // English name
  arabicName: string
  classification: string              // Sale/Lease/Partnership/Agency

  // Control applicability
  mandatoryControls: string[]         // Must execute (e.g., SG-01, SG-02)
  conditionalControls: Array<{
    controlId: string
    condition: string                 // When to apply
  }>

  // Shariah-specific requirements
  prohibitedClauses: string[]         // What to scan for in SG-02
  ownershipRequirements: string[]     // For SG-02, RM-02
  documentationMandates: string[]     // For RL controls

  // Risk profile
  primaryRisks: string[]              // Which RM controls critical
  riskWeighting: Record<string, 'high' | 'medium' | 'low'>

  // Accounting treatment
  fasReference: string                // AAOIFI FAS number
  recognitionRules: string[]          // For FR-01, FR-02

  // Sukuk applicability
  sukukEligible: boolean              // Can be securitized
  sukukStructure?: string             // If yes, which SS-17 structure
}
```

### Example: Murabaha (SS-8) Profile

```typescript
const murabaha: ContractProfile = {
  ssNumber: 'SS-8',
  contractType: 'Murabaha',
  arabicName: 'المرابحة',
  classification: 'Sale-based (Cost-plus deferred payment)',

  // Must execute these controls
  mandatoryControls: [
    'SG-01',  // Fatwa approval
    'SG-02',  // Pre-execution doc review
    'RM-02',  // Operational risk (asset transfer/ownership)
    'RM-01',  // Credit risk (customer creditworthiness)
    'FR-01',  // AAOIFI FAS 28 accounting
    'FR-02',  // Profit recognition rules
    'RL-02',  // KYC/AML (know the customer)
  ],

  // Conditionally execute
  conditionalControls: [
    {
      controlId: 'SG-04',
      condition: 'If commodity-based Murabaha (Tawarruq)'
    },
    {
      controlId: 'FR-04',
      condition: 'If Sukuk Murabaha (Use-of-Proceeds)'
    },
    {
      controlId: 'RM-03',
      condition: 'If large exposure (liquidity/concentration risk)'
    }
  ],

  // Shariah requirements (SG-02 scans for these)
  prohibitedClauses: [
    'Interest/riba',
    'Penalty clause for late payment',
    'Sale before ownership',
    'Two sales in one (bay al-inah)',
    'Ambiguity (gharar) in asset description'
  ],

  ownershipRequirements: [
    'Bank must own asset before sale to customer',
    'Constructive possession (qabd) required',
    'Risk must transfer to bank (even briefly)',
    'Asset must exist and be specified'
  ],

  documentationMandates: [
    'Master Murabaha Agreement',
    'Purchase order from customer',
    'Bank purchase invoice from supplier',
    'Sale agreement (bank → customer)',
    'Delivery confirmation'
  ],

  // Risk profile
  primaryRisks: [
    'Credit risk',           // HIGH
    'Operational risk',      // MEDIUM (documentation gaps)
    'Shariah non-compliance' // HIGH (if ownership not proven)
  ],

  riskWeighting: {
    'credit': 'high',
    'operational': 'medium',
    'SNC': 'high',
    'market': 'low',
    'liquidity': 'low'
  },

  // Accounting
  fasReference: 'FAS 28 - Murabaha and Other Deferred Payment Sales',
  recognitionRules: [
    'Profit recognized at inception (if collectibility reasonably assured)',
    'Or on installment method (if significant doubt)',
    'Impairment recognized if customer defaults'
  ],

  // Sukuk
  sukukEligible: true,
  sukukStructure: 'Sukuk Murabaha (SS-17 structure 3)'
}
```

### Example: Ijara (SS-9) Profile

```typescript
const ijara: ContractProfile = {
  ssNumber: 'SS-9',
  contractType: 'Ijara / Ijara Muntahia Bittamleek',
  arabicName: 'الإجارة / الإجارة المنتهية بالتمليك',
  classification: 'Lease-based (Operating or finance lease)',

  mandatoryControls: [
    'SG-01',  // Fatwa approval
    'SG-02',  // Pre-execution doc review
    'RM-02',  // Operational risk (asset maintenance, insurance)
    'RM-01',  // Credit risk (lessee creditworthiness)
    'FR-01',  // AAOIFI FAS 8 accounting
    'FR-02',  // Rental income recognition
    'RL-02',  // KYC/AML
    'RL-04',  // If Sukuk Ijara: disclosure obligations
  ],

  conditionalControls: [
    {
      controlId: 'FR-03',
      condition: 'If SPV structure (account segregation)'
    },
    {
      controlId: 'FR-04',
      condition: 'If Sukuk Ijara (Use-of-Proceeds for asset purchase)'
    },
    {
      controlId: 'AA-04',
      condition: 'If green/social Sukuk Ijara (external verifier)'
    }
  ],

  prohibitedClauses: [
    'Lessee responsible for perishing risk (must be lessor)',
    'Penalty for late rental payment',
    'Gharar in lease term or asset description',
    'Binding promise to purchase during lease (only at end)'
  ],

  ownershipRequirements: [
    'Lessor must own asset throughout lease',
    'Lessor bears ownership risks (major maintenance)',
    'Lessee bears usage risks (minor maintenance)',
    'Asset must be specified and delivered'
  ],

  documentationMandates: [
    'Lease agreement (Ijara contract)',
    'Asset title deed (proof of ownership)',
    'Insurance certificate (lessor as beneficiary)',
    'Maintenance agreement (who pays what)',
    'Purchase undertaking (if IMB - Ijara Muntahia Bittamleek)'
  ],

  primaryRisks: [
    'Operational risk',      // HIGH (asset maintenance, insurance)
    'Credit risk',           // MEDIUM (rental payment default)
    'Asset obsolescence',    // MEDIUM (residual value risk)
    'Shariah non-compliance' // HIGH (if ownership unclear)
  ],

  riskWeighting: {
    'operational': 'high',
    'credit': 'medium',
    'market': 'medium',     // Asset value fluctuation
    'SNC': 'high',
    'liquidity': 'low'
  },

  fasReference: 'FAS 8 - Ijarah and Ijarah Muntahia Bittamleek',
  recognitionRules: [
    'Rental income recognized on straight-line basis over lease term',
    'Asset depreciation recognized (lessor)',
    'Impairment if asset value < carrying amount'
  ],

  sukukEligible: true,
  sukukStructure: 'Sukuk Ijara (SS-17 structure 1) - most common Sukuk type'
}
```

### Example: Musharaka (SS-12) Profile

```typescript
const musharaka: ContractProfile = {
  ssNumber: 'SS-12',
  contractType: 'Musharaka (Sharikah)',
  arabicName: 'الشركة و المشاركة',
  classification: 'Partnership (Equity-based profit-loss sharing)',

  mandatoryControls: [
    'SG-01',  // Fatwa approval
    'SG-02',  // Pre-execution doc review
    'SG-03',  // Shariah risk register (PLS structure scrutiny)
    'RM-05',  // Equity investment risk
    'RM-01',  // Credit risk (partner creditworthiness)
    'FR-01',  // AAOIFI FAS 4 accounting
    'FR-02',  // Profit distribution (PLS allocation)
    'RL-02',  // KYC/AML (know your partner)
  ],

  conditionalControls: [
    {
      controlId: 'SG-04',
      condition: 'If long-term partnership (periodic Shariah audit)'
    },
    {
      controlId: 'FR-03',
      condition: 'If SPV structure (profit allocation accounts)'
    },
    {
      controlId: 'AA-01',
      condition: 'If complex profit calculation (internal audit)'
    }
  ],

  prohibitedClauses: [
    'Guaranteed return to one partner',
    'Fixed profit share (must be percentage)',
    'One partner exempt from losses',
    'Profit before capital recovery',
    'Ambiguity (gharar) in profit-sharing ratio'
  ],

  ownershipRequirements: [
    'All partners must contribute capital (cash or assets)',
    'Profit shared per agreed ratio',
    'Loss shared per capital contribution ratio',
    'Partners jointly own venture assets',
    'Diminishing Musharaka: ownership transfers gradually'
  ],

  documentationMandates: [
    'Musharaka agreement (capital, profit ratio, management)',
    'Capital contribution evidence',
    'Profit-sharing calculation methodology',
    'Exit mechanism (buyout terms)',
    'Management authority matrix'
  ],

  primaryRisks: [
    'Equity investment risk',  // HIGH (partner share of losses)
    'Operational risk',        // HIGH (joint management complexity)
    'Credit risk',             // MEDIUM (partner default)
    'Shariah non-compliance',  // HIGH (if profit allocation wrong)
    'DCR (if IAH funded)'      // MEDIUM (managing return expectations)
  ],

  riskWeighting: {
    'equity_investment': 'high',
    'operational': 'high',
    'credit': 'medium',
    'SNC': 'high',
    'DCR': 'medium',
    'liquidity': 'medium'
  },

  fasReference: 'FAS 4 - Musharakah Financing',
  recognitionRules: [
    'Profit recognized when realized (not accrued)',
    'Loss recognized immediately',
    'Impairment if venture assets decline in value',
    'Profit allocation per agreed ratio (not capital ratio)'
  ],

  sukukEligible: true,
  sukukStructure: 'Sukuk Musharaka (SS-17 structure 2) - rare but used for equity projects'
}
```

---

## Part 3: Deal Configuration Data Model

### Enhanced Deal Schema

```typescript
interface Deal {
  // Identity
  dealId: string
  dealName: string
  status: 'draft' | 'in_progress' | 'completed' | 'suspended'

  // Product classification (CRITICAL for control mapping)
  productStructure: {
    primaryContract: ContractType        // e.g., 'Murabaha', 'Ijara'
    secondaryContracts?: ContractType[]  // For hybrid structures
    sukukType?: SukukType                // If securitized

    // AAOIFI references
    applicableSS: string[]               // e.g., ['SS-8', 'SS-23'] for Wakala-Murabaha
    applicableFAS: string[]              // e.g., ['FAS 28']
  }

  // Automatic control derivation
  applicableControls: Array<{
    controlId: string
    source: 'mandatory' | 'conditional'
    condition?: string
    priority: 'critical' | 'high' | 'medium' | 'low'
  }>

  // Product-specific data
  contractDetails: {
    // Common fields
    parties: {
      bank: string
      customer: string
      sukukHolders?: string[]
      trustee?: string
      shariahAdvisor: string
    }

    // Murabaha-specific
    murabaha?: {
      assetDescription: string
      costPrice: number
      profitMargin: number
      sellingPrice: number
      paymentSchedule: 'lump_sum' | 'installments'
      installmentPlan?: InstallmentSchedule[]
    }

    // Ijara-specific
    ijara?: {
      assetDescription: string
      leaseType: 'operating' | 'finance' | 'IMB'
      leaseTerm: number              // months
      rentalAmount: number
      maintenanceResponsibility: 'lessor' | 'lessee' | 'shared'
      purchaseOption?: boolean       // For IMB
      purchasePrice?: number
    }

    // Musharaka-specific
    musharaka?: {
      ventureDescription: string
      totalCapital: number
      bankContribution: number
      partnerContribution: number
      profitSharingRatio: {
        bank: number                 // percentage
        partner: number
      }
      lossSharingRatio: {
        bank: number                 // follows capital ratio
        partner: number
      }
      managementAuthority: 'bank' | 'partner' | 'joint'
      diminishing?: boolean          // Musharaka Mutanaqisa
      buyoutSchedule?: BuyoutSchedule[]
    }

    // Mudaraba-specific
    mudaraba?: {
      fundDescription: string
      capitalProvider: 'bank' | 'IAH'
      mudaribCapital: number         // Bank's capital if IAH-funded
      profitSharingRatio: {
        rabbalmal: number            // Capital provider
        mudarib: number              // Entrepreneur (bank)
      }
      managementFees?: number
    }

    // Sukuk-specific
    sukuk?: {
      structure: SukukType
      issueAmount: number
      currency: string
      maturityDate: string
      couponRate?: number            // If periodic distribution
      underlyingAssets: string[]
      trusteeAppointment: string
      listingExchange?: string
    }
  }

  // Compliance tracking
  compliance: {
    overall: number                    // 0-100
    buckets: {
      shariah: number                  // Bucket 1
      regulatory: number               // Bucket 2
      risk: number                     // Bucket 3
      financial: number                // Bucket 4
      audit: number                    // Bucket 5
    }
  }

  // Execution state
  controls: Array<{
    controlId: string
    status: 'not_started' | 'in_progress' | 'passed' | 'failed' | 'conditional'
    lastExecuted?: string
    nextExecution?: string
    kri?: number
    vcId?: string
  }>

  // Blockers
  blockers: Array<{
    controlId: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    description: string
    since: string
    assignedTo?: string
  }>

  // Metadata
  createdAt: string
  updatedAt: string
  completedAt?: string
}

// Supporting types
type ContractType = 'Murabaha' | 'Ijara' | 'Musharaka' | 'Mudaraba' |
                    'Salam' | 'Istisna' | 'Tawarruq' | 'Wakala' |
                    'Qard' | 'Kafalah' | 'Hawalah'

type SukukType = 'Sukuk Ijara' | 'Sukuk Murabaha' | 'Sukuk Musharaka' |
                 'Sukuk Mudaraba' | 'Sukuk Wakala' | 'Sukuk Istisna' |
                 'Hybrid Sukuk'
```

### Control Derivation Engine

```typescript
// Automatic control mapping when deal is created
function deriveApplicableControls(deal: Deal): ApplicableControl[] {
  const controls: ApplicableControl[] = []

  // Get primary contract profile
  const primaryProfile = getContractProfile(deal.productStructure.primaryContract)

  // Add mandatory controls
  for (const controlId of primaryProfile.mandatoryControls) {
    controls.push({
      controlId,
      source: 'mandatory',
      priority: determinePriority(controlId, primaryProfile)
    })
  }

  // Evaluate conditional controls
  for (const conditional of primaryProfile.conditionalControls) {
    if (evaluateCondition(conditional.condition, deal)) {
      controls.push({
        controlId: conditional.controlId,
        source: 'conditional',
        condition: conditional.condition,
        priority: determinePriority(conditional.controlId, primaryProfile)
      })
    }
  }

  // Add controls from secondary contracts (hybrid structures)
  if (deal.productStructure.secondaryContracts) {
    for (const secondaryContract of deal.productStructure.secondaryContracts) {
      const secondaryProfile = getContractProfile(secondaryContract)
      // Add non-duplicate mandatory controls
      // Merge conditional controls
    }
  }

  // Sukuk-specific controls
  if (deal.productStructure.sukukType) {
    controls.push(
      { controlId: 'FR-04', source: 'mandatory', priority: 'critical' }, // UoP
      { controlId: 'RL-04', source: 'mandatory', priority: 'high' },     // Disclosures
      { controlId: 'FR-06', source: 'mandatory', priority: 'high' }      // Post-issuance
    )

    // If green/social/sustainability Sukuk
    if (isSustainabilitySukuk(deal)) {
      controls.push(
        { controlId: 'FR-05', source: 'mandatory', priority: 'critical' }, // KPI/SPT
        { controlId: 'AA-04', source: 'mandatory', priority: 'critical' }  // External verifier
      )
    }
  }

  // De-duplicate and sort by priority
  return deduplicateAndSort(controls)
}
```

---

## Part 4: Infrastructure Implications

### 1. Contract Profile Repository

**Purpose**: Store machine-readable contract profiles

**Storage**: PostgreSQL + JSON columns for flexibility

```sql
CREATE TABLE contract_profile (
  id VARCHAR(20) PRIMARY KEY,          -- 'SS-8', 'SS-9'
  contract_type VARCHAR(100) NOT NULL,
  arabic_name VARCHAR(200),
  classification VARCHAR(100),

  -- Control mappings (JSONB for flexibility)
  mandatory_controls JSONB NOT NULL,   -- Array of control IDs
  conditional_controls JSONB,          -- Array of {controlId, condition}

  -- Shariah requirements
  prohibited_clauses JSONB,
  ownership_requirements JSONB,
  documentation_mandates JSONB,

  -- Risk profile
  primary_risks JSONB,
  risk_weighting JSONB,

  -- Accounting
  fas_reference VARCHAR(100),
  recognition_rules JSONB,

  -- Sukuk
  sukuk_eligible BOOLEAN DEFAULT false,
  sukuk_structure VARCHAR(100),

  -- Metadata
  version VARCHAR(20) DEFAULT '1.0',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Populate with profiles
INSERT INTO contract_profile (id, contract_type, mandatory_controls, ...)
VALUES ('SS-8', 'Murabaha', '["SG-01", "SG-02", "RM-02", ...]', ...);
```

### 2. Deal Configuration UI

**Screen**: Deal Creation Wizard

**Flow**:
1. Select primary contract type (dropdown: Murabaha, Ijara, etc.)
2. System displays relevant product fields (Murabaha → cost/profit; Ijara → rental/term)
3. Optional: Add secondary contracts (for hybrids)
4. System auto-derives applicable controls and displays preview
5. User confirms and deal is created with controls pre-configured

**Implementation**:
```typescript
// React component
function DealConfigurationWizard() {
  const [primaryContract, setPrimaryContract] = useState<ContractType>()
  const [applicableControls, setApplicableControls] = useState<ApplicableControl[]>([])

  useEffect(() => {
    if (primaryContract) {
      // Fetch contract profile
      const profile = await fetchContractProfile(primaryContract)

      // Derive controls
      const controls = deriveApplicableControls({ productStructure: { primaryContract }})
      setApplicableControls(controls)
    }
  }, [primaryContract])

  return (
    <div>
      <h2>Configure New Deal</h2>

      <Select
        label="Primary Contract Type"
        options={CONTRACT_TYPES}
        value={primaryContract}
        onChange={setPrimaryContract}
      />

      {primaryContract && (
        <>
          <ProductFieldsForm contractType={primaryContract} />

          <ControlPreview controls={applicableControls} />
        </>
      )}

      <Button onClick={createDeal}>Create Deal</Button>
    </div>
  )
}
```

### 3. Control Library Enhancement

**Update**: Add `applicableContracts` field to each control

```typescript
// Example: SG-02 now specifies which contracts it applies to
const SG_02 = {
  id: 'SG-02',
  name: 'Shariah Review (Pre-execution doc review)',

  // NEW: Contract applicability
  applicableContracts: ['*'],  // All contracts

  // Contract-specific evidence variations
  evidenceVariations: {
    'Murabaha': [
      'Murabaha agreement with cost+profit breakdown',
      'Bank purchase invoice (proof of ownership)',
      'Delivery confirmation'
    ],
    'Ijara': [
      'Lease agreement with rental schedule',
      'Asset title deed',
      'Maintenance & insurance terms'
    ],
    'Musharaka': [
      'Partnership agreement with profit-sharing ratios',
      'Capital contribution evidence',
      'Management authority matrix'
    ]
  },

  // Contract-specific prohibited clauses
  prohibitedClausesScanner: {
    'Murabaha': murabaha.prohibitedClauses,
    'Ijara': ijara.prohibitedClauses,
    'Musharaka': musharaka.prohibitedClauses
  }
}
```

### 4. API Endpoints

**New endpoints** for contract taxonomy:

```typescript
// GET /api/contracts - List all contract profiles
// GET /api/contracts/:ssNumber - Get specific contract profile
// POST /api/deals/:dealId/derive-controls - Re-derive controls for deal
// GET /api/contracts/:ssNumber/controls - Get controls for contract type
```

---

## Part 5: Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

- [ ] Create `contract_profile` table and seed with 14 core profiles
- [ ] Implement control derivation engine
- [ ] Update deal schema to include `productStructure` and `applicableControls`
- [ ] Build contract profile API endpoints

### Phase 2: UI Integration (Week 3-4)

- [ ] Build Deal Configuration Wizard with contract selection
- [ ] Dynamic form rendering based on contract type
- [ ] Control preview component
- [ ] Update deal creation flow to use derivation engine

### Phase 3: Control Enhancement (Week 5-6)

- [ ] Add `applicableContracts` and `evidenceVariations` to all 26 controls
- [ ] Implement contract-specific evidence collection strategies
- [ ] Update Evidence Collection Agent to use contract-aware logic
- [ ] Test end-to-end: create Murabaha deal → auto-derive controls → execute → mint VCs

### Phase 4: Validation (Week 7-8)

- [ ] Create test deals for all 14 contract types
- [ ] Validate control derivation accuracy
- [ ] User acceptance testing with domain experts
- [ ] Documentation and training materials

---

## Part 6: Validation Criteria

### Contract Profile Completeness

For each of the 14 core contract types:
- [ ] AAOIFI SS number referenced
- [ ] Mandatory controls list is accurate per standard
- [ ] Prohibited clauses match Shariah requirements
- [ ] Risk weighting reflects market practice
- [ ] FAS reference correct

### Control Derivation Accuracy

- [ ] Murabaha deal generates correct mandatory controls (SG-01, SG-02, RM-01, RM-02, FR-01, FR-02)
- [ ] Ijara deal adds operational risk controls (RM-02 with asset maintenance)
- [ ] Musharaka deal adds equity investment risk (RM-05)
- [ ] Hybrid Sukuk deal merges controls from multiple profiles without duplicates
- [ ] Green Sukuk adds sustainability controls (FR-05, AA-04)

### Evidence Collection Accuracy

- [ ] Murabaha deal collects: purchase invoice, sale agreement, delivery confirmation
- [ ] Ijara deal collects: title deed, insurance certificate, lease agreement
- [ ] Musharaka deal collects: partnership agreement, capital evidence, profit calculation

---

## Appendix A: Full AAOIFI Standards List (41 Total)

**Trade & Sale Contracts (10)**:
- SS-1: Trading in Currencies
- SS-2: Debit/Credit Cards
- SS-8: Murabaha
- SS-10: Salam & Parallel Salam
- SS-11: Istisna & Parallel Istisna
- SS-20: Sale of Commodities in Organized Markets
- SS-21: Financial Papers (Shares & Bonds)
- SS-25: Combination of Contracts
- SS-30: Tawarruq (Monetization)
- SS-31: Controls on Gharar

**Leasing (2)**:
- SS-9: Ijara & Ijara Muntahia Bittamleek
- SS-34: Hiring of Persons

**Partnership (2)**:
- SS-12: Musharaka & Modern Corporations
- SS-13: Mudaraba

**Agency & Services (6)**:
- SS-7: Hawalah (Transfer)
- SS-14: Documentary Credit
- SS-15: Jualah (Service contract)
- SS-23: Wakala & Agency
- SS-24: Syndicated Financing
- SS-28: Banking Services

**Guarantees & Debt (5)**:
- SS-3: Procrastinating Debtor
- SS-4: Settlement by Set-Off
- SS-5: Guarantees (Kafalah)
- SS-18: Possession (Qabd)
- SS-19: Loan (Qard)
- SS-37: Credit Agreement
- SS-39: Mortgage

**Sukuk & Capital Markets (2)**:
- SS-17: Investment Sukuk
- SS-27: Indices

**Insurance (2)**:
- SS-26: Islamic Insurance (Takaful)
- SS-41: Islamic Reinsurance

**Governance (5)**:
- SS-6: Conversion of Conventional Bank
- SS-22: Concession Contracts
- SS-29: Fatwa Ethics
- SS-32: Arbitration
- SS-36: Contingent Incidents

**Social Finance (1)**:
- SS-33: Waqf
- SS-35: Zakah

**Digital (2)**:
- SS-38: Online Financial Dealings
- SS-40: Profit Distribution (IAH)

---

## Appendix B: Market Data Reference

**Sukuk Issuance by Structure (2022)**:
- Wakala: 27.3%
- Murabaha: 24.8%
- Hybrid: 17.7%
- Ijara: 16.9%
- Mudaraba: 5.3%
- Musharaka: 0.8%
- Other: 7.2%

**Source**: Islamic Financial Services Industry Stability Report 2023

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-07 | Research Team | Initial contract taxonomy mapping based on AAOIFI research |

---

**END OF DOCUMENT**

**Next Steps**: Implement contract profile repository and control derivation engine per Phase 1 roadmap.
