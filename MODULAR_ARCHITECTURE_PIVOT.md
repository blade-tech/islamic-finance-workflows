# 4-Component Modular Architecture - Pivot Plan

**Decision Date**: 2025-11-04
**Rationale**: Islamic finance deals have 4 independent components that should be selected modularly, not as monolithic pre-combined templates
**Impact**: Architectural pivot during Phase 4A (currently 50% complete)
**Status**: APPROVED - Proceeding with full pivot

---

## Executive Summary

### Problem with Current Approach (Monolithic Templates)

**Current Architecture:**
```
Templates = Jurisdiction × Shariah Structure × Accounting × Impact

Example:
- "UAE Sukuk Ijara with AAOIFI and Green Standards"
- "Malaysia Murabaha with IFRS and No Impact Metrics"
- "Saudi Musharaka with Local GAAP and SDG Alignment"

Result: N jurisdictions × M structures × P accounting × Q impact = 100s of templates
```

**Problems:**
1. Template explosion (need 100+ pre-combined templates)
2. Inflexible (can't mix "UAE jurisdiction" with "IFRS accounting")
3. Maintenance nightmare (change to one jurisdiction affects all templates)
4. Doesn't match how professionals structure deals
5. Poor UX (scrolling through 100+ templates)

### Solution: 4-Component Modular Architecture

**New Architecture:**
```
Deal Configuration:
├── Component 1: Shariah Structure (Sukuk types, Murabaha, Ijarah, etc.)
├── Component 2: Legal Jurisdiction (UAE DFSA, Malaysia SC, Saudi CMA, etc.)
├── Component 3: Accounting Framework (AAOIFI, IFRS+Islamic, Local GAAP)
├── Component 4: Impact Metrics (Green Sukuk, SDG, ESG, Social Impact, None)
└── Optional Overlay: + Takaful (can be added to any combination)

Example User Flow:
1. Select Shariah Structure: "Sukuk Ijara"
2. Select Jurisdiction: "UAE DFSA"
3. Select Accounting: "AAOIFI"
4. Select Impact: "Green Sukuk Standards"
5. Add Takaful: [✓] Yes

Result: Dynamically composed workflow from 4 independent components
```

**Benefits:**
1. **Scalability**: Add new jurisdiction without touching other components
2. **Flexibility**: Any valid combination possible (e.g., "Saudi structure + Luxembourg jurisdiction + AAOIFI + ESG")
3. **Maintainability**: Update accounting rules once, applies to all structures
4. **Professional UX**: Mirrors actual deal structuring process
5. **Takaful as overlay**: Correctly represents optional insurance augmentation
6. **Fewer total artifacts**: ~15 structures + 10 jurisdictions + 5 accounting + 5 impact = 35 components (vs 100+ templates)

---

## 4-Component Architecture Detailed Specification

### Component 1: Shariah Structure

**Purpose**: The Islamic finance contract type (the "how" of the transaction)

**Available Structures:**

#### Sukuk (Islamic Bonds)
1. **Sukuk Ijara** (Lease-based, 60% market share)
   - Use case: Real estate, infrastructure, equipment
   - Key features: Asset ownership transfer, rental payments

2. **Sukuk Murabaha** (Cost-plus financing)
   - Use case: Trade finance, working capital
   - Key features: Commodity purchase, deferred payment with markup

3. **Sukuk Musharaka** (Partnership)
   - Use case: Joint ventures, project finance
   - Key features: Capital split, profit/loss sharing

4. **Sukuk Mudaraba** (Profit-sharing)
   - Use case: Fund management, investment pools
   - Key features: Mudarib (manager) + Rab al-Mal (investor), profit split

5. **Sukuk Istisna** (Construction)
   - Use case: Infrastructure projects, manufacturing
   - Key features: Milestone payments, completion-based

6. **Sukuk Salam** (Forward commodity purchase)
   - Use case: Agriculture, commodities
   - Key features: Advance payment, future delivery

#### Non-Sukuk Structures
7. **Murabaha** (Trade finance)
8. **Ijarah** (Leasing)
9. **Musharaka** (Partnership)
10. **Mudaraba** (Fund management)
11. **Takaful** (Islamic insurance) - Can also be overlay
12. **Wakala** (Agency agreement)
13. **Qard Hassan** (Benevolent loan)
14. **Istisna** (Manufacturing contract)
15. **Salam** (Forward sale)

**Data Model:**
```typescript
interface ShariahStructure {
  id: string // 'sukuk_ijara', 'murabaha', etc.
  name: string // 'Sukuk Ijara', 'Murabaha'
  category: 'sukuk' | 'non_sukuk'
  description: string
  useCases: string[]
  requiredRoles: string[] // 'shariah_board', 'spo_provider', etc.
  requiredFields: FormField[] // Structure-specific fields
  aaoifiStandards: string[] // Applicable standards
}
```

---

### Component 2: Legal Jurisdiction

**Purpose**: The regulatory environment governing the transaction

**Available Jurisdictions:**

#### Middle East
1. **UAE - DFSA (Dubai International Financial Centre)**
   - Regulator: Dubai Financial Services Authority
   - Standards: DFSA Rulebook + AAOIFI
   - Currency: USD, AED
   - Tax: 0% corporate tax (DIFC)

2. **UAE - ADGM (Abu Dhabi Global Market)**
   - Regulator: Financial Services Regulatory Authority
   - Standards: ADGM Rulebook + AAOIFI
   - Currency: USD, AED

3. **Saudi Arabia - CMA**
   - Regulator: Capital Market Authority
   - Standards: CMA Regulations + AAOIFI mandatory
   - Currency: SAR
   - Language: Arabic mandatory

4. **Bahrain - CBB**
   - Regulator: Central Bank of Bahrain
   - Standards: CBB Rulebook + AAOIFI (headquartered here)
   - Currency: BHD

#### Asia Pacific
5. **Malaysia - SC**
   - Regulator: Securities Commission Malaysia
   - Standards: SC Guidelines + AAOIFI reference
   - Currency: MYR
   - Language: Bahasa Malaysia + English

6. **Indonesia - OJK**
   - Regulator: Financial Services Authority (OJK)
   - Standards: OJK Regulations + National Shariah Board
   - Currency: IDR

#### Europe
7. **UK - FCA**
   - Regulator: Financial Conduct Authority
   - Standards: FCA Handbook + AAOIFI reference
   - Currency: GBP
   - Tax: Standard UK corporate tax

8. **Luxembourg - CSSF**
   - Regulator: Commission de Surveillance du Secteur Financier
   - Standards: Luxembourg law + AAOIFI
   - Currency: EUR

#### Other
9. **Pakistan - SECP**
10. **Turkey - CMB**
11. **Qatar - QFCRA**
12. **Singapore - MAS**

**Data Model:**
```typescript
interface Jurisdiction {
  id: string // 'uae_dfsa', 'saudi_cma', etc.
  name: string // 'UAE DFSA', 'Saudi Arabia CMA'
  regulator: string
  country: string
  requiredLanguages: string[] // ['en'], ['en', 'ar'], etc.
  currencies: string[] // ['USD', 'AED']
  taxRate: number | null
  requiredDisclosures: string[]
  additionalRequiredFields: FormField[] // Jurisdiction-specific fields
  compatibleAccounting: string[] // Which accounting frameworks allowed
}
```

---

### Component 3: Accounting Framework

**Purpose**: The financial reporting standard for the transaction

**Available Frameworks:**

1. **AAOIFI (Accounting & Auditing Organization for Islamic Financial Institutions)**
   - **Scope**: Full Islamic finance accounting standards
   - **Adoption**: Mandatory in Saudi, Bahrain, Sudan, Jordan, Qatar (optional elsewhere)
   - **Standards**: FAS 1-62 (Financial Accounting Standards)
   - **Shariah Standards**: SS 1-65
   - **Use when**: Pure Islamic finance, Gulf region, Shariah-compliant mandatory

2. **IFRS + Islamic Adjustments**
   - **Scope**: IFRS with Islamic finance modifications
   - **Adoption**: Common in Malaysia, Indonesia, UAE (ADGM)
   - **Standards**: IFRS 9, 15, 16 with Islamic adaptations
   - **Use when**: Cross-border deals, international investors, hybrid approach

3. **Local GAAP + Islamic**
   - **Scope**: Country-specific GAAP with Islamic overlay
   - **Examples**:
     - Malaysia: MFRS (Malaysian Financial Reporting Standards) + Islamic
     - Indonesia: PSAK (Indonesian GAAP) + Islamic
   - **Use when**: Domestic-only deals, local investor base

4. **UK GAAP + Islamic**
   - **Scope**: FRS 102 with Islamic adaptations
   - **Use when**: UK-based Islamic banks, FCA-regulated entities

5. **US GAAP + Islamic**
   - **Scope**: US GAAP with Shariah compliance notes
   - **Use when**: US investors, cross-listing, rare in pure Islamic finance

**Data Model:**
```typescript
interface AccountingFramework {
  id: string // 'aaoifi', 'ifrs_islamic', etc.
  name: string // 'AAOIFI', 'IFRS + Islamic'
  description: string
  applicableStandards: string[] // ['FAS 33', 'IFRS 9', etc.]
  requiredDisclosures: string[]
  reportingCurrency: string | null // null = flexible
  additionalFields: FormField[] // Framework-specific fields
  compatibleJurisdictions: string[] // Which jurisdictions allow this
}
```

---

### Component 4: Impact Metrics

**Purpose**: Sustainability/social impact measurement framework (optional)

**Available Frameworks:**

1. **Green Sukuk Standards (Climate Bond Initiative)**
   - **Use case**: Renewable energy, green buildings, clean transport
   - **Reporting**: Annual impact report on environmental metrics
   - **Certification**: Climate Bonds Standard certification
   - **Examples**: QIIB Orix Green Sukuk ($500M solar/wind)

2. **SDG-Aligned (UN Sustainable Development Goals)**
   - **Use case**: Any project aligned with 17 SDGs
   - **Reporting**: SDG impact metrics (e.g., SDG 7: Clean Energy)
   - **Certification**: SDG Impact Standards

3. **ESG (Environmental, Social, Governance)**
   - **Use case**: Broad sustainability, corporate responsibility
   - **Reporting**: ESG scores (MSCI, Sustainalytics)
   - **Frameworks**: GRI, SASB, TCFD

4. **Social Impact Bonds**
   - **Use case**: Healthcare, education, poverty alleviation
   - **Reporting**: Social ROI (SROI), beneficiaries served
   - **Examples**: Education Sukuk for school construction

5. **Blue Sukuk (Ocean/Water)**
   - **Use case**: Water infrastructure, marine conservation
   - **Reporting**: Water quality metrics, ocean health

6. **No Impact Metrics**
   - **Use case**: Standard commercial transactions
   - **Reporting**: Standard financial reporting only

**Data Model:**
```typescript
interface ImpactMetrics {
  id: string // 'green_sukuk', 'sdg', 'none', etc.
  name: string // 'Green Sukuk Standards', 'No Impact Metrics'
  category: 'environmental' | 'social' | 'governance' | 'none'
  reportingRequirements: string[]
  certificationBody: string | null
  additionalFields: FormField[] // Impact-specific fields (e.g., SDG targets)
  isOptional: boolean // true for all
}
```

---

### Component 5: Takaful Overlay (Optional)

**Purpose**: Islamic insurance coverage (can augment any structure)

**When to Add:**
- **Credit Enhancement**: Insure against issuer default (Sukuk)
- **Asset Protection**: Insure underlying assets (Ijarah, Istisna)
- **Performance Guarantee**: Insure project completion (Musharaka, Mudaraba)
- **Commodity Risk**: Insure commodity price fluctuations (Salam)

**Takaful Models:**
1. **Mudaraba-based** (Profit-sharing with Takaful operator)
2. **Wakalah-based** (Fee-based agency model)
3. **Hybrid** (Combination of Mudaraba + Wakalah)

**Data Model:**
```typescript
interface TakafulOverlay {
  enabled: boolean
  model: 'mudaraba' | 'wakalah' | 'hybrid'
  coverageType: 'credit' | 'asset' | 'performance' | 'commodity'
  coverageAmount: number
  provider: string // Takaful operator
  premium: number
  additionalFields: FormField[]
}
```

---

## Workflow Step Redesign

### OLD: Monolithic Template Selection (Step 2)

```
Step 2: Select Template
┌─────────────────────────────────────────┐
│ Search: [                             ] │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🏦 UAE DFSA Sukuk Ijara + AAOIFI   │ │
│ │    + Green Standards                │ │
│ │    [Select]                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🏦 Malaysia Sukuk Murabaha + IFRS  │ │
│ │    + No Impact                      │ │
│ │    [Select]                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ... (100+ more templates)               │
└─────────────────────────────────────────┘
```

### NEW: 4-Component Modular Selection (Steps 2-5)

```
Step 2: Select Shariah Structure
┌─────────────────────────────────────────┐
│ Choose the Islamic finance contract:    │
│                                         │
│ Sukuk (Islamic Bonds):                  │
│ ( ) Sukuk Ijara       (Lease-based)    │
│ ( ) Sukuk Murabaha    (Cost-plus)      │
│ ( ) Sukuk Musharaka   (Partnership)    │
│ ...                                     │
│                                         │
│ Other Structures:                       │
│ ( ) Murabaha          (Trade finance)  │
│ ( ) Ijarah            (Leasing)        │
│ ...                                     │
│                                         │
│ [Next: Select Jurisdiction]             │
└─────────────────────────────────────────┘

Step 3: Select Jurisdiction
┌─────────────────────────────────────────┐
│ Where will this deal be regulated?      │
│                                         │
│ Middle East:                            │
│ ( ) UAE DFSA  (Dubai)                  │
│ ( ) UAE ADGM  (Abu Dhabi)              │
│ ( ) Saudi CMA (AAOIFI mandatory)       │
│ ...                                     │
│                                         │
│ Asia Pacific:                           │
│ ( ) Malaysia SC                        │
│ ( ) Indonesia OJK                      │
│ ...                                     │
│                                         │
│ [Back] [Next: Select Accounting]        │
└─────────────────────────────────────────┘

Step 4: Select Accounting Framework
┌─────────────────────────────────────────┐
│ Choose financial reporting standard:    │
│                                         │
│ ( ) AAOIFI                             │
│     Full Islamic accounting standards   │
│     Required in: Saudi, Bahrain         │
│                                         │
│ ( ) IFRS + Islamic Adjustments         │
│     International standards + Islamic   │
│     Common in: Malaysia, UAE ADGM       │
│                                         │
│ ( ) Local GAAP + Islamic               │
│     Country-specific GAAP + Islamic     │
│                                         │
│ [Back] [Next: Select Impact Metrics]    │
└─────────────────────────────────────────┘

Step 5: Select Impact Metrics (Optional)
┌─────────────────────────────────────────┐
│ Add sustainability/impact tracking?     │
│                                         │
│ ( ) Green Sukuk Standards              │
│     Climate-focused projects            │
│                                         │
│ ( ) SDG-Aligned                        │
│     UN Sustainable Development Goals    │
│                                         │
│ ( ) ESG Framework                      │
│     Environmental, Social, Governance   │
│                                         │
│ ( ) Social Impact Bonds                │
│     Healthcare, education, poverty      │
│                                         │
│ ( ) No Impact Metrics                  │
│     Standard commercial deal            │
│                                         │
│ [✓] Add Takaful Insurance Overlay      │
│                                         │
│ [Back] [Next: Configure Details]        │
└─────────────────────────────────────────┘

Step 6: Review Configuration
┌─────────────────────────────────────────┐
│ Your Deal Configuration:                │
│                                         │
│ Shariah Structure:  Sukuk Ijara         │
│ Jurisdiction:       UAE DFSA            │
│ Accounting:         AAOIFI              │
│ Impact:             Green Sukuk         │
│ Takaful:            ✓ Enabled           │
│                                         │
│ This combination requires:              │
│ • Shariah Board (3-5 scholars)         │
│ • SPO Provider (AAOIFI-certified)      │
│ • Green Bond Certification             │
│ • Takaful Operator                     │
│                                         │
│ [Edit] [Next: Configure Details]        │
└─────────────────────────────────────────┘
```

---

## Updated Workflow Flow (13 Steps Total)

```
PHASE 4A - MODULAR ARCHITECTURE:

Step 1:  Connect Sources          (unchanged)
Step 2:  Select Shariah Structure (NEW - was "Select Template")
Step 3:  Select Jurisdiction      (NEW)
Step 4:  Select Accounting        (NEW)
Step 5:  Select Impact Metrics    (NEW)
Step 6:  Review Configuration     (NEW - summary of selections)
Step 7:  Configure Details        (REFACTORED - dynamic from 4 components)
Step 8:  Test Workflow            (unchanged)
Step 9:  Context Upload           (unchanged - optional)
Step 10: Live Execution           (unchanged)
Step 11: Citation Verification    (unchanged)
Step 12: Outcome & Download       (unchanged)
Step 13: Learning Capture         (unchanged)
```

**Changes from Previous Architecture:**
- Steps 2-6: Component selection (5 new steps)
- Step 7: Refactored Configure Details (was Step 3)
- Step 8: Test Workflow (was Step 4)
- Steps 9-13: Same as before (shifted by +4)

---

## Technical Implementation Plan

### Phase 1: Data Model Updates (Task 7A)

**File**: `src/lib/types.ts`

```typescript
// Component Types
export interface ShariahStructure {
  id: string
  name: string
  category: 'sukuk' | 'non_sukuk'
  description: string
  useCases: string[]
  requiredRoles: string[]
  baseFields: FormField[]
  aaoifiStandards: string[]
}

export interface Jurisdiction {
  id: string
  name: string
  regulator: string
  country: string
  requiredLanguages: string[]
  currencies: string[]
  taxRate: number | null
  additionalFields: FormField[]
  compatibleAccounting: string[] // IDs of compatible frameworks
}

export interface AccountingFramework {
  id: string
  name: string
  description: string
  applicableStandards: string[]
  additionalFields: FormField[]
  compatibleJurisdictions: string[]
}

export interface ImpactMetrics {
  id: string
  name: string
  category: 'environmental' | 'social' | 'governance' | 'none'
  reportingRequirements: string[]
  additionalFields: FormField[]
}

export interface TakafulOverlay {
  enabled: boolean
  model?: 'mudaraba' | 'wakalah' | 'hybrid'
  coverageType?: 'credit' | 'asset' | 'performance' | 'commodity'
  provider?: string
  additionalFields?: FormField[]
}

// Composed Deal Configuration
export interface DealConfiguration {
  shariahStructure: ShariahStructure
  jurisdiction: Jurisdiction
  accounting: AccountingFramework
  impact: ImpactMetrics
  takaful: TakafulOverlay
}
```

---

### Phase 2: Zustand Store Updates (Task 7B)

**File**: `src/lib/store.ts`

```typescript
interface WorkflowStore {
  execution: {
    // ... existing fields
    selectedShariahStructure: ShariahStructure | null
    selectedJurisdiction: Jurisdiction | null
    selectedAccounting: AccountingFramework | null
    selectedImpact: ImpactMetrics | null
    takafulOverlay: TakafulOverlay
  } | null

  // Actions
  setShariahStructure: (structure: ShariahStructure) => void
  setJurisdiction: (jurisdiction: Jurisdiction) => void
  setAccounting: (accounting: AccountingFramework) => void
  setImpact: (impact: ImpactMetrics) => void
  setTakaful: (takaful: TakafulOverlay) => void
}
```

---

### Phase 3: Component Data (Task 7C)

**File**: `src/data/shariah-structures.ts`

```typescript
export const SHARIAH_STRUCTURES: ShariahStructure[] = [
  {
    id: 'sukuk_ijara',
    name: 'Sukuk Ijara',
    category: 'sukuk',
    description: 'Lease-based Sukuk for real estate and infrastructure (60% market share)',
    useCases: ['Real Estate', 'Infrastructure', 'Equipment Leasing'],
    requiredRoles: ['shariah_board', 'spo_provider', 'trustee', 'lead_arranger'],
    baseFields: [
      { id: 'asset_type', label: 'Underlying Asset Type', type: 'select', options: ['Real Estate', 'Infrastructure', 'Equipment'], ... },
      { id: 'lease_period_years', label: 'Lease Period (Years)', type: 'number', ... },
      // ... (from current FORM_CONFIGS.sukuk_ijara.basicInfo)
    ],
    aaoifiStandards: ['AAOIFI Shariah Standard 62', 'AAOIFI FAS 33']
  },
  // ... other structures
]
```

**File**: `src/data/jurisdictions.ts`

```typescript
export const JURISDICTIONS: Jurisdiction[] = [
  {
    id: 'uae_dfsa',
    name: 'UAE DFSA (Dubai)',
    regulator: 'Dubai Financial Services Authority',
    country: 'United Arab Emirates',
    requiredLanguages: ['en'],
    currencies: ['USD', 'AED'],
    taxRate: 0,
    additionalFields: [
      { id: 'dfsa_license_number', label: 'DFSA License Number', type: 'text', ... },
    ],
    compatibleAccounting: ['aaoifi', 'ifrs_islamic']
  },
  {
    id: 'saudi_cma',
    name: 'Saudi Arabia CMA',
    regulator: 'Capital Market Authority',
    country: 'Saudi Arabia',
    requiredLanguages: ['ar', 'en'],
    currencies: ['SAR'],
    taxRate: null,
    additionalFields: [
      { id: 'cma_registration', label: 'CMA Registration Number', type: 'text', ... },
      { id: 'arabic_prospectus', label: 'Arabic Prospectus', type: 'file', ... },
    ],
    compatibleAccounting: ['aaoifi'] // AAOIFI mandatory in Saudi
  },
  // ... other jurisdictions
]
```

**File**: `src/data/accounting-frameworks.ts`

```typescript
export const ACCOUNTING_FRAMEWORKS: AccountingFramework[] = [
  {
    id: 'aaoifi',
    name: 'AAOIFI',
    description: 'Full Islamic finance accounting standards (mandatory in Saudi, Bahrain)',
    applicableStandards: ['FAS 1-62', 'Shariah Standards SS 1-65'],
    additionalFields: [
      { id: 'aaoifi_audit_firm', label: 'AAOIFI-Certified Audit Firm', type: 'select', ... },
    ],
    compatibleJurisdictions: ['uae_dfsa', 'uae_adgm', 'saudi_cma', 'bahrain_cbb', 'malaysia_sc']
  },
  {
    id: 'ifrs_islamic',
    name: 'IFRS + Islamic Adjustments',
    description: 'International standards with Islamic finance modifications',
    applicableStandards: ['IFRS 9', 'IFRS 15', 'IFRS 16'],
    additionalFields: [],
    compatibleJurisdictions: ['uae_adgm', 'malaysia_sc', 'uk_fca', 'luxembourg_cssf']
  },
  // ... other frameworks
]
```

**File**: `src/data/impact-metrics.ts`

```typescript
export const IMPACT_METRICS: ImpactMetrics[] = [
  {
    id: 'green_sukuk',
    name: 'Green Sukuk Standards',
    category: 'environmental',
    reportingRequirements: ['Annual Environmental Impact Report', 'Climate Bonds Certification'],
    additionalFields: [
      { id: 'green_project_type', label: 'Green Project Type', type: 'select', options: ['Solar', 'Wind', 'Green Buildings', 'Clean Transport'], ... },
      { id: 'co2_reduction_target', label: 'CO2 Reduction Target (tons/year)', type: 'number', ... },
    ]
  },
  {
    id: 'none',
    name: 'No Impact Metrics',
    category: 'none',
    reportingRequirements: [],
    additionalFields: []
  },
  // ... other metrics
]
```

---

### Phase 4: Step Components (Tasks 7D-7I)

#### Task 7D: Step2SelectShariahStructure.tsx

```typescript
'use client'

import { SHARIAH_STRUCTURES } from '@/data/shariah-structures'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export function Step2SelectShariahStructure() {
  const setShariahStructure = useWorkflowStore((state) => state.setShariahStructure)
  const selectedStructure = useWorkflowStore((state) => state.execution?.selectedShariahStructure)

  return (
    <div className="space-y-6">
      <h2>Select Shariah Structure</h2>

      {/* Sukuk Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sukuk (Islamic Bonds)</CardTitle>
        </CardHeader>
        <CardContent>
          {SHARIAH_STRUCTURES.filter(s => s.category === 'sukuk').map(structure => (
            <button
              key={structure.id}
              onClick={() => setShariahStructure(structure)}
              className={selectedStructure?.id === structure.id ? 'selected' : ''}
            >
              <h3>{structure.name}</h3>
              <p>{structure.description}</p>
              <div>Use cases: {structure.useCases.join(', ')}</div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Non-Sukuk Section */}
      <Card>
        <CardHeader>
          <CardTitle>Other Structures</CardTitle>
        </CardHeader>
        {/* Similar to above */}
      </Card>
    </div>
  )
}
```

#### Task 7E: Step3SelectJurisdiction.tsx

```typescript
'use client'

import { JURISDICTIONS } from '@/data/jurisdictions'
import { useWorkflowStore } from '@/lib/store'

export function Step3SelectJurisdiction() {
  const setJurisdiction = useWorkflowStore((state) => state.setJurisdiction)
  const selectedJurisdiction = useWorkflowStore((state) => state.execution?.selectedJurisdiction)
  const selectedAccounting = useWorkflowStore((state) => state.execution?.selectedAccounting)

  // Filter jurisdictions by compatible accounting (if already selected)
  const availableJurisdictions = selectedAccounting
    ? JURISDICTIONS.filter(j => j.compatibleAccounting.includes(selectedAccounting.id))
    : JURISDICTIONS

  return (
    <div className="space-y-6">
      <h2>Select Jurisdiction</h2>

      {/* Group by region */}
      <div>
        <h3>Middle East</h3>
        {availableJurisdictions.filter(j => ['UAE', 'Saudi Arabia', 'Bahrain'].includes(j.country)).map(jurisdiction => (
          <button onClick={() => setJurisdiction(jurisdiction)}>
            {jurisdiction.name}
            <p>{jurisdiction.regulator}</p>
          </button>
        ))}
      </div>

      {/* Asia Pacific, Europe, etc. */}
    </div>
  )
}
```

#### Task 7F: Step4SelectAccounting.tsx
#### Task 7G: Step5SelectImpact.tsx
#### Task 7H: Step6ReviewConfiguration.tsx

```typescript
export function Step6ReviewConfiguration() {
  const { shariahStructure, jurisdiction, accounting, impact, takaful } = useWorkflowStore(
    (state) => state.execution || {}
  )

  return (
    <div className="space-y-6">
      <h2>Review Your Configuration</h2>

      <Card>
        <CardContent>
          <dl>
            <dt>Shariah Structure</dt>
            <dd>{shariahStructure?.name}</dd>

            <dt>Jurisdiction</dt>
            <dd>{jurisdiction?.name} ({jurisdiction?.regulator})</dd>

            <dt>Accounting Framework</dt>
            <dd>{accounting?.name}</dd>

            <dt>Impact Metrics</dt>
            <dd>{impact?.name}</dd>

            <dt>Takaful Insurance</dt>
            <dd>{takaful?.enabled ? `✓ ${takaful.model}` : '✗ Not enabled'}</dd>
          </dl>
        </CardContent>
      </Card>

      {/* Required Roles Summary */}
      <Card>
        <CardHeader>
          <CardTitle>This configuration requires:</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {shariahStructure?.requiredRoles.map(role => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
```

#### Task 7I: Refactor Step7ConfigureDetails.tsx

```typescript
export function Step7ConfigureDetails() {
  const { shariahStructure, jurisdiction, accounting, impact, takaful } = useWorkflowStore(
    (state) => state.execution || {}
  )

  // Compose form fields from all 4 components
  const allFields: FormField[] = [
    ...(shariahStructure?.baseFields || []),
    ...(jurisdiction?.additionalFields || []),
    ...(accounting?.additionalFields || []),
    ...(impact?.additionalFields || []),
    ...(takaful?.enabled ? takaful.additionalFields || [] : []),
  ]

  // Compose compliance standards
  const allStandards: string[] = [
    ...(shariahStructure?.aaoifiStandards || []),
    ...(accounting?.applicableStandards || []),
    ...(impact?.reportingRequirements || []),
  ]

  return (
    <div className="space-y-6">
      <h2>Configure Details</h2>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            {shariahStructure?.name} in {jurisdiction?.name} with {accounting?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allFields.map(field => (
            <FormFieldRenderer key={field.id} field={field} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Standards</CardTitle>
        </CardHeader>
        <CardContent>
          {allStandards.map(standard => (
            <div key={standard}>✓ {standard} (auto-applied)</div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### Phase 5: WorkflowContainer Integration (Task 7J)

```typescript
const STEPS = [
  { index: 0, title: 'Connect Sources', component: Step1SourceConnection },
  { index: 1, title: 'Select Shariah Structure', component: Step2SelectShariahStructure },
  { index: 2, title: 'Select Jurisdiction', component: Step3SelectJurisdiction },
  { index: 3, title: 'Select Accounting', component: Step4SelectAccounting },
  { index: 4, title: 'Select Impact Metrics', component: Step5SelectImpact },
  { index: 5, title: 'Review Configuration', component: Step6ReviewConfiguration },
  { index: 6, title: 'Configure Details', component: Step7ConfigureDetails },
  { index: 7, title: 'Test Workflow', component: Step8TestWorkflow },
  { index: 8, title: 'Context Upload', component: Step9ContextUpload },
  { index: 9, title: 'Live Execution', component: Step10LiveExecution },
  { index: 10, title: 'Citation Verification', component: Step11CitationVerification },
  { index: 11, title: 'Outcome & Download', component: Step12Outcome },
  { index: 12, title: 'Learning Capture', component: Step13Learning },
]
```

---

## Validation Rules Engine

### Component Compatibility Matrix

**File**: `src/lib/validation.ts`

```typescript
// Example: Saudi CMA requires AAOIFI (not optional)
const JURISDICTION_ACCOUNTING_RULES = {
  'saudi_cma': {
    mandatoryAccounting: ['aaoifi'],
    forbiddenAccounting: ['ifrs_islamic', 'local_gaap']
  },
  'uae_dfsa': {
    allowedAccounting: ['aaoifi', 'ifrs_islamic']
  }
}

// Example: Green Sukuk requires environmental reporting
const STRUCTURE_IMPACT_RULES = {
  'sukuk_ijara': {
    recommendedImpact: ['green_sukuk', 'sdg'],
    allowedImpact: ['green_sukuk', 'sdg', 'esg', 'none']
  }
}

export function validateConfiguration(config: DealConfiguration): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check jurisdiction-accounting compatibility
  const jurisdictionRule = JURISDICTION_ACCOUNTING_RULES[config.jurisdiction.id]
  if (jurisdictionRule?.mandatoryAccounting) {
    if (!jurisdictionRule.mandatoryAccounting.includes(config.accounting.id)) {
      errors.push(`${config.jurisdiction.name} requires ${jurisdictionRule.mandatoryAccounting.join(' or ')} accounting`)
    }
  }

  // Check cross-component compatibility
  if (!config.jurisdiction.compatibleAccounting.includes(config.accounting.id)) {
    errors.push(`${config.accounting.name} not compatible with ${config.jurisdiction.name}`)
  }

  return { isValid: errors.length === 0, errors, warnings }
}
```

---

## Migration Strategy

### Step 1: Preserve Old Work
```bash
git checkout -b phase-4a-monolithic-backup
git commit -m "Backup: Pre-modular architecture state"
git checkout main
```

### Step 2: Incremental Implementation
1. **Day 1-2**: Tasks 7A-7C (Data models, store, component data)
2. **Day 3-4**: Tasks 7D-7H (New step components)
3. **Day 5**: Task 7I (Refactor Configure Details composition)
4. **Day 6**: Task 7J (WorkflowContainer integration)
5. **Day 7**: Testing, validation rules, bug fixes

### Step 3: Testing Plan
1. Test all 6 Sukuk structures × 3 jurisdictions × 2 accounting = 36 combinations
2. Test validation rules (e.g., Saudi requires AAOIFI)
3. Test Takaful overlay on/off
4. Test impact metrics optional/required
5. E2E test: Full flow from component selection → test run → launch

---

## Impact on PHASE_4A_TRACKER.md

### Updated Task List

**Old Tasks (Being Replaced):**
- ~~Task 4: Rename Step1_5 → Step1SelectTemplate~~ → REPLACED
- ~~Task 5: Integrate Step1SelectTemplate into WorkflowContainer~~ → REPLACED
- ~~Task 6: Create Step2ConfigureDetails~~ → REFACTORED (now Step 7)

**New Tasks (Modular Architecture):**
- **Task 4A**: Create data models and types (ShariahStructure, Jurisdiction, etc.)
- **Task 4B**: Update Zustand store for 4-component selection
- **Task 4C**: Create component data files (shariah-structures.ts, jurisdictions.ts, etc.)
- **Task 4D**: Create Step2SelectShariahStructure component
- **Task 4E**: Create Step3SelectJurisdiction component
- **Task 4F**: Create Step4SelectAccounting component
- **Task 4G**: Create Step5SelectImpact component
- **Task 4H**: Create Step6ReviewConfiguration component
- **Task 4I**: Refactor Step7ConfigureDetails (composition from 4 components)
- **Task 4J**: Update WorkflowContainer (13-step flow)
- **Task 4K**: Build validation rules engine
- **Task 4L**: E2E testing (36+ combinations)

**Unchanged Tasks:**
- Task 7: Step3TestWorkflow (already complete) → becomes Step 8
- Task 8: Step4ValidateCompliance → becomes Step 9
- Task 9: Step5LaunchExecute → becomes Step 10
- Task 10: Step6MonitorReview → becomes Step 11
- Task 11: Step7ImproveLearn → becomes Step 12
- Task 12: Mock Guardian service
- Task 13: AAOIFI pre-ingestion
- Task 14: E2E Sukuk test

### Updated Progress
- **Before Pivot**: 50% (7/14 tasks)
- **After Pivot**: ~35% (need to redo Tasks 4-6, add 4A-4L)
- **New Total**: 22 tasks (was 14)
- **Estimated Additional Time**: +5-7 days

---

## Success Criteria (Updated)

### Component Selection UX
- [ ] User selects Shariah structure in <30 seconds
- [ ] Jurisdiction selection shows only compatible options
- [ ] Accounting selection enforces jurisdiction rules (e.g., Saudi → AAOIFI only)
- [ ] Impact metrics clearly optional
- [ ] Takaful overlay checkbox intuitive

### Configuration Composition
- [ ] Configure Details form correctly composes all 4 components
- [ ] No duplicate fields across components
- [ ] Validation enforces component compatibility
- [ ] User understands why certain combinations invalid

### Professional Alignment
- [ ] UX matches how Islamic finance professionals structure deals
- [ ] Terminology correct (e.g., "Shariah structure" not "template")
- [ ] Component independence clear (can change jurisdiction without re-selecting structure)

### Scalability
- [ ] Adding new jurisdiction requires only 1 new file (jurisdictions.ts)
- [ ] Adding new accounting framework requires only 1 new file (accounting-frameworks.ts)
- [ ] No monolithic template explosions
- [ ] Takaful overlay works with all structures

---

## Risks and Mitigations

### Risk 1: Complexity Overwhelms User
**Mitigation**:
- Smart defaults (e.g., auto-select jurisdiction based on user's organization country)
- "Quick Start" presets (e.g., "Standard UAE Sukuk" = Ijara + DFSA + AAOIFI + None)
- Progressive disclosure (hide advanced options until needed)

### Risk 2: Invalid Component Combinations
**Mitigation**:
- Real-time validation as user selects components
- Disable incompatible options dynamically
- AI suggestions: "For Saudi CMA, you must use AAOIFI accounting"

### Risk 3: Implementation Timeline
**Mitigation**:
- Prioritize critical path (Sukuk + 3 jurisdictions + 2 accounting frameworks first)
- Phase additional jurisdictions/frameworks in Phase 4B
- Mock data for Phase 4A, real Guardian integration Phase 4B

### Risk 4: Data Maintenance Burden
**Mitigation**:
- Component data files version-controlled
- Automated validation tests (e.g., "Saudi CMA + IFRS should fail validation")
- Community contributions (jurisdictions.ts accepts PRs)

---

## Next Steps

1. **Review and Approve**: Stakeholder approval of modular architecture
2. **Update PHASE_4A_TRACKER.md**: Reflect new task breakdown
3. **Create GitHub Issue**: Track pivot work separately
4. **Begin Implementation**: Start with Task 4A (data models)
5. **Weekly Check-ins**: Ensure architecture aligns with professional reality

---

**Document Owner**: Claude AI Assistant
**Last Updated**: 2025-11-04
**Status**: APPROVED - Proceeding with Implementation
**Next Review**: After Task 4F completion (50% through pivot)
