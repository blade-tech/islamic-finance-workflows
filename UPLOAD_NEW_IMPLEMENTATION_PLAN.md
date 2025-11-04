# Upload New Methodology - Mock Flow Implementation Plan

**Created**: 2025-11-04 16:00 UTC
**Status**: Planning Phase
**Goal**: Create mock flow for methodology document upload with service dependency badges (Claude + LlamaParse)

---

## 1. Service Architecture (Using Existing Services)

### 1.1 No Service Type Changes Needed! ✅

**We'll use existing services**:
- **Documents Service** → Handles PDF upload and parsing (LlamaParse integration)
- **MCP Proxy Service** → Handles Claude access via Copilots MCP server

**Updated service comments** (already done):
```typescript
export type ServiceName =
  | 'mcp'              // MCP Proxy Service (includes Copilots for Claude)
  | 'orchestrator'     // LangGraph Orchestrator
  | 'graphiti'         // Graphiti/Neo4j Service
  | 'documents'        // Document Service (includes LlamaParse for PDF parsing)
  | 'observability'    // LangFuse Observability
```

### 1.2 Extend DEFAULT_SERVICES Descriptions

**Update `src/lib/service-types.ts` DEFAULT_SERVICES**:
```typescript
documents: {
  name: 'documents',
  displayName: 'Document Service',
  description: 'Read/write PDF, DOCX, Markdown; LlamaParse integration',
  endpoints: [
    'POST /documents/read',
    'POST /documents/write',
    'POST /documents/parse',           // NEW: LlamaParse endpoint
  ],
  requiredFor: [
    'Step 3: Context Upload',
    'Step 6: Outcome & Download',
    'Methodology Upload: Document Parsing',  // NEW
  ],
},
mcp: {
  name: 'mcp',
  displayName: 'MCP Proxy',
  description: 'Routes to MCP servers (Graphiti, Copilots/Claude, Exa, Hedera)',
  endpoints: [
    'GET /mcp/servers',
    'GET /mcp/{server}/tools',
    'POST /mcp/{server}/tools/{tool_name}',
    'POST /mcp/copilots/tools/ask-ceo',     // Example Copilot
    'POST /mcp/copilots/tools/ask-pe',      // Prompt Engineer for analysis
  ],
  requiredFor: [
    'Step 1: Source Connection',
    'Step 5: Live Execution',
    'Methodology Upload: AI Analysis & Generation',  // NEW
  ],
},
```

### 1.3 MCP Copilots Usage Pattern

**Which Copilot to use for methodology digitization?**
- **ask-pe** (Prompt Engineer) - For analyzing methodology documents and generating Guardian artifacts
- The PE copilot specializes in understanding document structures and generating structured outputs

**Service dependency badges will show**:
- **Documents Service** (for parsing step)
- **MCP Proxy** (for analysis/generation steps)

---

## 2. Component Architecture

### 2.1 New Components to Create

```
src/components/workflow/
├── MethodologyUploadFlow.tsx           # Main upload flow component
├── digitization/
│   ├── UploadArea.tsx                  # Drag-and-drop PDF upload
│   ├── GuardianProcessVisualization.tsx # 7-step progress indicator
│   ├── DigitizationStepCard.tsx        # Individual step display
│   ├── SchemaPreview.tsx               # Mock schema JSON preview
│   ├── PolicyPreview.tsx               # Mock policy workflow preview
│   ├── CalculationPreview.tsx          # Mock calculation logic preview
│   └── TestResultsPreview.tsx          # Mock validation results
```

### 2.2 Component Hierarchy

```
MethodologyUploadFlow
├── ServiceDependencyBadge (services: ['claude', 'llamaparse'])
├── BackendServiceMonitor (toggle button)
├── UploadArea
├── GuardianProcessVisualization
│   ├── Step 1: Upload (user action)
│   ├── Step 2: Parse (LlamaParse) → DigitizationStepCard
│   ├── Step 3: Analyze (Claude) → DigitizationStepCard
│   ├── Step 4: Generate Schemas (Claude) → DigitizationStepCard + SchemaPreview
│   ├── Step 5: Generate Policies (Claude) → DigitizationStepCard + PolicyPreview
│   ├── Step 6: Generate Calculations (Claude) → DigitizationStepCard + CalculationPreview
│   └── Step 7: Validate (Mock Testing) → DigitizationStepCard + TestResultsPreview
└── FinalReviewPanel
    ├── Approve & Save button
    └── Download Guardian artifacts button
```

---

## 3. UI Mockup & Flow

### 3.1 Initial State (No Upload)

```
┌────────────────────────────────────────────────────────────┐
│ 🔧 Required Services                                       │
│ ┌────────────┐ ┌──────────────┐                           │
│ │ MCP Proxy ●│ │ Documents  ● │  (Status badges)          │
│ └────────────┘ └──────────────┘                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ℹ️  Upload Methodology Document                            │
│                                                            │
│ Upload a methodology PDF (IIFM, AAOIFI, etc.) to          │
│ automatically digitize it using Guardian framework.        │
│                                                            │
│ ┌────────────────────────────────────────────────────┐   │
│ │                                                    │   │
│ │            📄 Drag & Drop PDF Here                 │   │
│ │                or                                  │   │
│ │          [ Select File ]                           │   │
│ │                                                    │   │
│ └────────────────────────────────────────────────────┘   │
│                                                            │
│ Supported: PDF (max 50MB)                                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 3.2 After Upload (Processing)

```
┌────────────────────────────────────────────────────────────┐
│ 🔧 Required Services                                       │
│ ┌────────────┐ ┌──────────────┐                           │
│ │ MCP Proxy ●│ │ Documents  ● │                           │
│ └────────────┘ └──────────────┘                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ 📄 IIFM_Mudarabah_Standard_ST14.pdf (2.3 MB)             │
│                                                            │
│ Guardian Digitization Process                              │
│                                                            │
│ ✅ 1. Upload Complete                         30 sec      │
│                                                            │
│ ⏳ 2. Parsing Document [Documents Service]    1-2 min     │
│    └─ Extracting structure, tables, clauses...            │
│                                                            │
│ ⏸️  3. Document Analysis [MCP/Copilots]        2-3 min     │
│                                                            │
│ ⏸️  4. Schema Generation [MCP/Copilots]        3-5 min     │
│                                                            │
│ ⏸️  5. Policy Generation [MCP/Copilots]        3-5 min     │
│                                                            │
│ ⏸️  6. Calculation Logic [MCP/Copilots]        2-3 min     │
│                                                            │
│ ⏸️  7. Testing & Validation                    10-15 min   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 3.3 Completed State (Review)

```
┌────────────────────────────────────────────────────────────┐
│ Guardian Digitization Process - Complete! ✅               │
│                                                            │
│ ✅ 1. Upload Complete                                      │
│ ✅ 2. Parsing Complete                                     │
│ ✅ 3. Analysis Complete                                    │
│ ✅ 4. Schemas Generated (8 schemas)      [View Schemas]   │
│ ✅ 5. Policies Generated (12 steps)      [View Policy]    │
│ ✅ 6. Calculations Generated             [View Logic]     │
│ ✅ 7. Validation Passed                  [View Results]   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Generated Methodology Details                              │
│                                                            │
│ Name: IIFM Mudarabah Standard (ST-14)                     │
│ Type: Islamic Finance                                     │
│ Category: Mudarabah                                       │
│ Standard: IIFM                                            │
│                                                            │
│ 📊 Artifacts Generated:                                    │
│ • 8 Guardian Schemas                                      │
│ • 12 Policy Workflow Steps                                │
│ • 3 Calculation Formulas                                  │
│ • 4 Required Roles                                        │
│                                                            │
│ [ Download Guardian Package ]  [ Approve & Save ]         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Guardian 7-Step Process Visualization

### 4.1 DigitizationStepCard Component

**Props Interface**:
```typescript
interface DigitizationStepCardProps {
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7
  stepName: string
  status: 'pending' | 'processing' | 'complete' | 'error'
  serviceName?: 'documents' | 'mcp' | null
  estimatedDuration: string
  progress?: number // 0-100 for processing state
  description?: string
  output?: React.ReactNode // Preview component
  error?: string
}
```

**Status Visual Indicators**:
- **Pending** (⏸️): Gray badge, no progress
- **Processing** (⏳): Blue spinner, progress bar (if available)
- **Complete** (✅): Green checkmark, expandable output preview
- **Error** (❌): Red X, error message

**Service Badge Integration**:
```typescript
{serviceName && (
  <Badge variant="outline" className="text-xs">
    <Server className="h-3 w-3 mr-1" />
    {serviceName === 'documents' ? 'Documents Service' : 'MCP Proxy'}
  </Badge>
)}
```

**Which service for which step**:
- Step 2 (Parsing): `serviceName="documents"` (LlamaParse via Documents Service)
- Steps 3-6 (Analysis, Schemas, Policies, Calculations): `serviceName="mcp"` (Claude via MCP Copilots)
- Step 7 (Validation): No service badge (local validation)

### 4.2 Process Flow State Machine

```typescript
type ProcessState =
  | 'idle'              // No file uploaded
  | 'uploading'         // File upload in progress
  | 'parsing'           // LlamaParse extraction
  | 'analyzing'         // Claude analysis
  | 'generating-schemas' // Claude schema generation
  | 'generating-policies' // Claude policy generation
  | 'generating-calcs'   // Claude calculation generation
  | 'validating'         // Guardian dry-run
  | 'complete'           // All done
  | 'error'              // Something failed

interface DigitizationState {
  currentState: ProcessState
  uploadedFile: File | null
  parsedContent: ParsedDocument | null
  analysis: DocumentAnalysis | null
  schemas: GuardianSchema[] | null
  policies: GuardianPolicy | null
  calculations: CalculationLogic | null
  validationResults: ValidationResults | null
  error: string | null
}
```

---

## 5. Mock Data Structure

### 5.1 Step 2: Parsing (LlamaParse Output - MOCK)

```typescript
interface ParsedDocument {
  text: string
  structure: {
    sections: {
      title: string
      content: string
      subsections: { title: string; content: string }[]
    }[]
    tables: {
      title: string
      headers: string[]
      rows: string[][]
    }[]
  }
  metadata: {
    pages: number
    language: string
    hasFormulas: boolean
    hasTables: boolean
  }
}

// MOCK DATA
const mockParsedDocument: ParsedDocument = {
  text: "IIFM Mudarabah Standard (ST-14)...",
  structure: {
    sections: [
      {
        title: "1. Introduction",
        content: "This standard establishes...",
        subsections: [
          { title: "1.1 Scope", content: "..." },
          { title: "1.2 Purpose", content: "..." }
        ]
      },
      {
        title: "2. Shariah Compliance Criteria",
        content: "The Mudarabah contract must...",
        subsections: []
      }
    ],
    tables: [
      {
        title: "Table 1: Profit Distribution Scenarios",
        headers: ["Profit %", "Mudarib Share", "Rab-ul-Mal Share"],
        rows: [
          ["< 10%", "30%", "70%"],
          ["10-20%", "40%", "60%"],
          ["> 20%", "50%", "50%"]
        ]
      }
    ]
  },
  metadata: {
    pages: 45,
    language: "en",
    hasFormulas: true,
    hasTables: true
  }
}
```

### 5.2 Step 3: Analysis (Claude Output - MOCK)

```typescript
interface DocumentAnalysis {
  methodologyType: string
  category: string
  standard: string
  extractedEntities: {
    stakeholderRoles: string[]
    complianceRequirements: string[]
    approvalGates: string[]
    formulas: {
      name: string
      formula: string
      variables: string[]
    }[]
  }
  recommendedSchemas: string[]
  recommendedPolicySteps: string[]
  confidence: number
}

// MOCK DATA
const mockAnalysis: DocumentAnalysis = {
  methodologyType: "islamic-finance",
  category: "mudarabah",
  standard: "IIFM",
  extractedEntities: {
    stakeholderRoles: [
      "Mudarib (Investment Manager)",
      "Rab-ul-Mal (Capital Provider)",
      "Shariah Board",
      "Auditor"
    ],
    complianceRequirements: [
      "Profit-sharing ratio must be predetermined",
      "Loss borne by capital provider only",
      "No guaranteed returns",
      "Shariah Board approval required"
    ],
    approvalGates: [
      "Shariah compliance certification",
      "Contract registration",
      "Periodic audit reviews"
    ],
    formulas: [
      {
        name: "Profit Distribution",
        formula: "mudarib_share = total_profit * mudarib_ratio",
        variables: ["total_profit", "mudarib_ratio"]
      }
    ]
  },
  recommendedSchemas: [
    "contract-details-schema",
    "profit-sharing-parameters-schema",
    "shariah-compliance-validation-schema"
  ],
  recommendedPolicySteps: [
    "Contract initiation",
    "Shariah review",
    "Capital contribution",
    "Investment execution",
    "Profit calculation",
    "Distribution approval"
  ],
  confidence: 0.92
}
```

### 5.3 Step 4: Schemas (Guardian JSON - MOCK)

```typescript
interface GuardianSchema {
  id: string
  name: string
  description: string
  entity: string
  fields: {
    name: string
    type: 'string' | 'number' | 'date' | 'boolean' | 'enum' | 'nested'
    required: boolean
    description: string
    enum_values?: string[]
    nested_schema?: GuardianSchema
  }[]
}

// MOCK DATA - Abbreviated
const mockSchemas: GuardianSchema[] = [
  {
    id: "contract-details",
    name: "Mudarabah Contract Details",
    description: "Core contract information and parties",
    entity: "MudarabahContract",
    fields: [
      {
        name: "contract_id",
        type: "string",
        required: true,
        description: "Unique contract identifier"
      },
      {
        name: "mudarib_name",
        type: "string",
        required: true,
        description: "Investment manager (Mudarib) name"
      },
      {
        name: "rabul_mal_name",
        type: "string",
        required: true,
        description: "Capital provider (Rab-ul-Mal) name"
      },
      {
        name: "capital_amount",
        type: "number",
        required: true,
        description: "Initial capital in base currency"
      },
      {
        name: "profit_sharing_ratio",
        type: "nested",
        required: true,
        description: "Profit distribution parameters",
        nested_schema: {
          id: "profit-ratio",
          name: "Profit Sharing Ratio",
          description: "Mudarib and Rab-ul-Mal profit shares",
          entity: "ProfitRatio",
          fields: [
            {
              name: "mudarib_percentage",
              type: "number",
              required: true,
              description: "Mudarib profit share (0-100)"
            },
            {
              name: "rabul_mal_percentage",
              type: "number",
              required: true,
              description: "Rab-ul-Mal profit share (0-100)"
            }
          ]
        }
      }
    ]
  },
  // ... 7 more schemas (abbreviated for plan)
]
```

### 5.4 Step 5: Policy Workflow (Guardian Policy - MOCK)

```typescript
interface GuardianPolicy {
  id: string
  name: string
  description: string
  roles: string[]
  workflow_blocks: {
    id: string
    type: 'data-input' | 'approval' | 'calculation' | 'mint' | 'external-api'
    name: string
    assigned_role: string
    inputs: string[] // Schema IDs
    outputs: string[]
    conditions?: {
      field: string
      operator: string
      value: any
    }[]
  }[]
}

// MOCK DATA - Abbreviated
const mockPolicy: GuardianPolicy = {
  id: "mudarabah-workflow",
  name: "IIFM Mudarabah Workflow",
  description: "Complete workflow from contract initiation to profit distribution",
  roles: ["Mudarib", "Rab-ul-Mal", "Shariah Board", "Auditor"],
  workflow_blocks: [
    {
      id: "block-1",
      type: "data-input",
      name: "Contract Initiation",
      assigned_role: "Mudarib",
      inputs: ["contract-details"],
      outputs: ["contract-draft"]
    },
    {
      id: "block-2",
      type: "approval",
      name: "Shariah Compliance Review",
      assigned_role: "Shariah Board",
      inputs: ["contract-draft"],
      outputs: ["shariah-certification"],
      conditions: [
        {
          field: "profit_sharing_ratio_predetermined",
          operator: "equals",
          value: true
        }
      ]
    },
    // ... 10 more blocks (abbreviated)
  ]
}
```

### 5.5 Step 6: Calculation Logic (JavaScript - MOCK)

```typescript
interface CalculationLogic {
  id: string
  name: string
  description: string
  language: 'javascript'
  code: string
  inputs: { name: string; type: string; description: string }[]
  outputs: { name: string; type: string; description: string }[]
}

// MOCK DATA
const mockCalculations: CalculationLogic[] = [
  {
    id: "profit-distribution-calc",
    name: "Profit Distribution Calculator",
    description: "Calculates Mudarib and Rab-ul-Mal profit shares",
    language: "javascript",
    code: `
// Guardian Calculation Logic: Profit Distribution
function calculateProfitDistribution(data) {
  const { total_profit, mudarib_ratio, rabul_mal_ratio } = data;

  // Validation
  if (mudarib_ratio + rabul_mal_ratio !== 100) {
    throw new Error('Profit ratios must sum to 100%');
  }

  // Calculate shares
  const mudarib_share = (total_profit * mudarib_ratio) / 100;
  const rabul_mal_share = (total_profit * rabul_mal_ratio) / 100;

  return {
    mudarib_share,
    rabul_mal_share,
    total_profit,
    timestamp: new Date().toISOString()
  };
}
    `.trim(),
    inputs: [
      { name: "total_profit", type: "number", description: "Total profit amount" },
      { name: "mudarib_ratio", type: "number", description: "Mudarib share %" },
      { name: "rabul_mal_ratio", type: "number", description: "Rab-ul-Mal share %" }
    ],
    outputs: [
      { name: "mudarib_share", type: "number", description: "Mudarib profit amount" },
      { name: "rabul_mal_share", type: "number", description: "Rab-ul-Mal profit amount" }
    ]
  }
]
```

### 5.6 Step 7: Validation Results (MOCK)

```typescript
interface ValidationResults {
  passed: boolean
  tests_run: number
  tests_passed: number
  tests_failed: number
  errors: string[]
  warnings: string[]
  test_details: {
    test_name: string
    status: 'passed' | 'failed' | 'warning'
    message: string
  }[]
}

// MOCK DATA
const mockValidationResults: ValidationResults = {
  passed: true,
  tests_run: 12,
  tests_passed: 11,
  tests_failed: 0,
  errors: [],
  warnings: [
    "Schema 'audit-trail' has optional field without default value"
  ],
  test_details: [
    {
      test_name: "Schema Validation",
      status: "passed",
      message: "All 8 schemas are valid Guardian schemas"
    },
    {
      test_name: "Policy Workflow Completeness",
      status: "passed",
      message: "All workflow blocks properly connected"
    },
    {
      test_name: "Role Assignment Check",
      status: "passed",
      message: "All blocks have assigned roles"
    },
    {
      test_name: "Calculation Logic Syntax",
      status: "passed",
      message: "JavaScript code is syntactically valid"
    },
    {
      test_name: "Calculation Logic Execution",
      status: "passed",
      message: "Test run successful with sample data"
    },
    {
      test_name: "Shariah Compliance Rules",
      status: "passed",
      message: "All compliance conditions present in workflow"
    },
    {
      test_name: "Required Fields Check",
      status: "passed",
      message: "All required schema fields defined"
    },
    {
      test_name: "Data Type Consistency",
      status: "passed",
      message: "No type mismatches found"
    },
    {
      test_name: "Workflow Termination",
      status: "passed",
      message: "All workflow paths reach completion"
    },
    {
      test_name: "API Integration Points",
      status: "passed",
      message: "External API blocks properly configured"
    },
    {
      test_name: "Documentation Completeness",
      status: "passed",
      message: "All artifacts have descriptions"
    },
    {
      test_name: "Optional Field Defaults",
      status: "warning",
      message: "Some optional fields lack default values"
    }
  ]
}
```

---

## 6. State Management

### 6.1 Zustand Store Additions

Add to `src/lib/workflow-store.ts`:

```typescript
interface WorkflowStore {
  // ... existing state

  // NEW: Methodology digitization state
  digitizationState: DigitizationState | null
  setDigitizationState: (state: DigitizationState) => void

  // Mock processing simulation
  simulateParsing: (file: File) => Promise<void>
  simulateAnalysis: () => Promise<void>
  simulateSchemaGeneration: () => Promise<void>
  simulatePolicyGeneration: () => Promise<void>
  simulateCalculationGeneration: () => Promise<void>
  simulateValidation: () => Promise<void>

  // Reset
  resetDigitization: () => void
}
```

### 6.2 Mock Processing Functions

```typescript
// Simulate step-by-step processing with delays
const simulateParsing: (file: File) => Promise<void> = async (file) => {
  set({
    digitizationState: {
      currentState: 'parsing',
      uploadedFile: file,
      // ... other fields null
    }
  })

  // Simulate 1-2 min processing
  await new Promise(resolve => setTimeout(resolve, 2000)) // 2 sec for demo

  set({
    digitizationState: {
      currentState: 'analyzing',
      parsedContent: mockParsedDocument,
      // ... carry forward state
    }
  })
}

// Similar functions for each step...
```

---

## 7. Integration Points for Real APIs

### 7.1 Backend API Endpoints (Using Existing Services)

#### Documents Service Endpoint (Extend existing `backend/app/api/documents.py`)

```python
@router.post("/parse")
async def parse_pdf_document(file: UploadFile):
    """
    Parse PDF using LlamaParse integration.

    MOCK: Returns mock parsed content
    REAL: Call LlamaParse API with file

    This uses the existing Documents Service infrastructure.
    """
    # TODO: Implement LlamaParse integration
    # For now, return mock data
    return mockParsedDocument
```

#### MCP Copilots Endpoints (Use existing MCP Proxy)

**Use existing `/mcp/copilots/tools/{tool_name}` endpoint**

All Claude-powered analysis and generation will go through:
- **POST** `/mcp/copilots/tools/ask-pe` (Prompt Engineer copilot)

**Request format for each step**:

```python
# Step 3: Analysis
{
  "query": "Analyze this IIFM Mudarabah methodology document and extract...",
  # parsedDoc content in query or as context
}

# Step 4: Schema Generation
{
  "query": "Generate Guardian schemas for this methodology based on analysis...",
  # analysis results in context
}

# Step 5: Policy Generation
{
  "query": "Generate Guardian policy workflow for this methodology...",
  # schemas + analysis in context
}

# Step 6: Calculation Logic
{
  "query": "Generate JavaScript calculation logic from these formulas...",
  # analysis + formulas in context
}
```

#### Methodology Endpoints (Extend `backend/app/api/methodologies.py`)

```python
@router.post("/digitize/start")
async def start_digitization(file: UploadFile):
    """
    Start methodology digitization workflow.

    Orchestrates:
    1. Upload to Documents Service
    2. Parse via Documents Service (/documents/parse)
    3. Analysis via MCP Copilots (/mcp/copilots/tools/ask-pe)
    4-6. Generation via MCP Copilots
    7. Local validation

    MOCK: Returns mock digitization session ID
    REAL: Creates orchestration session
    """
    # TODO: Implement orchestration
    return {"session_id": "mock-session-123"}


@router.get("/digitize/{session_id}/status")
async def get_digitization_status(session_id: str):
    """
    Get current status of digitization process.

    MOCK: Returns mock progress
    REAL: Queries orchestration state
    """
    # TODO: Implement status tracking
    return mockDigitizationStatus
```

### 7.2 Service Connection Detection (Use Existing Checks)

**No new service checks needed!** Digitization flow uses existing service status:

```typescript
// MCP Proxy status check (already exists in BackendServiceMonitor)
const mcpStatus = useWorkflowStore((state) => state.servicesStatus.mcp.status)

// Documents Service status check (already exists)
const documentsStatus = useWorkflowStore((state) => state.servicesStatus.documents.status)

// Service badges will show:
<ServiceDependencyBadge services={['mcp', 'documents']} />

// Status automatically reflects:
// - MCP: CONNECTED if copilots server available
// - Documents: CONNECTED if documents service responding
```

**Additional capability checks** (optional, for detailed status):

```typescript
// Check if MCP Copilots server specifically is available
async function checkCopilotServerAvailable(): Promise<boolean> {
  try {
    const response = await fetch('/mcp/servers')
    const servers = await response.json()
    return servers.some((s: any) => s.name === 'copilots' && s.status === 'available')
  } catch {
    return false
  }
}

// Check if Documents Service has LlamaParse configured
async function checkLlamaParseConfigured(): Promise<boolean> {
  try {
    const response = await fetch('/documents/capabilities')
    const data = await response.json()
    return data.parsing_enabled || false
  } catch {
    return false
  }
}
```

### 7.3 Mock-to-Real Transition Strategy

**Phase 1 (Current)**: All MOCK
- Frontend calls mock functions in Zustand store
- Returns hardcoded mock data
- No backend API calls

**Phase 2 (Backend Integration)**: Backend MOCK, Real API structure
- Frontend calls real backend endpoints
- Backend returns mock data (no external APIs yet)
- Service status shows MOCK

**Phase 3 (LlamaParse Integration)**: Real parsing
- Backend calls real LlamaParse API
- Other steps still mock
- Service status: LlamaParse = CONNECTED, Claude = MOCK

**Phase 4 (Claude Integration)**: Fully Real
- Backend calls real Claude API for all generation steps
- All services CONNECTED
- Real Guardian artifact generation

**Toggle Logic**:
```typescript
const USE_REAL_BACKEND = process.env.NEXT_PUBLIC_USE_REAL_DIGITIZATION === 'true'

async function parseDocument(file: File) {
  if (USE_REAL_BACKEND) {
    return await fetch('/api/methodologies/digitize/parse', {
      method: 'POST',
      body: formData
    })
  } else {
    // Simulate delay + return mock
    await sleep(2000)
    return mockParsedDocument
  }
}
```

---

## 8. File Structure

```
D:\projects\Islamic Finance Workflows\
├── src/
│   ├── components/
│   │   └── workflow/
│   │       ├── MethodologyUploadFlow.tsx           # NEW: Main component
│   │       ├── digitization/                       # NEW: Folder
│   │       │   ├── UploadArea.tsx                  # NEW
│   │       │   ├── GuardianProcessVisualization.tsx # NEW
│   │       │   ├── DigitizationStepCard.tsx        # NEW
│   │       │   ├── SchemaPreview.tsx               # NEW
│   │       │   ├── PolicyPreview.tsx               # NEW
│   │       │   ├── CalculationPreview.tsx          # NEW
│   │       │   └── TestResultsPreview.tsx          # NEW
│   │       ├── ServiceDependencyBadge.tsx          # MODIFY: Add claude, llamaparse
│   │       └── BackendServiceMonitor.tsx           # MODIFY: Add new services
│   ├── lib/
│   │   ├── service-types.ts                        # MODIFY: Add ServiceName types
│   │   ├── workflow-store.ts                       # MODIFY: Add digitization state
│   │   └── mock-data/                              # NEW: Folder
│   │       ├── mock-parsed-document.ts             # NEW
│   │       ├── mock-analysis.ts                    # NEW
│   │       ├── mock-schemas.ts                     # NEW
│   │       ├── mock-policy.ts                      # NEW
│   │       ├── mock-calculations.ts                # NEW
│   │       └── mock-validation-results.ts          # NEW
│   └── app/
│       └── test-methodologies/
│           └── page.tsx                            # MODIFY: Add upload flow test
│
├── backend/
│   └── app/
│       ├── api/
│       │   └── methodologies.py                    # MODIFY: Add digitize endpoints
│       ├── models.py                               # MODIFY: Add digitization types
│       └── services/
│           ├── methodology_service.py              # MODIFY: Add digitization logic
│           ├── claude_service.py                   # NEW: Placeholder
│           └── llamaparse_service.py               # NEW: Placeholder
│
└── UPLOAD_NEW_IMPLEMENTATION_PLAN.md              # THIS FILE
```

---

## 9. Implementation Sequence

### Phase A: Service Extensions (15 min) ✅ SIMPLIFIED
1. ✅ Update `service-types.ts` comments - Clarify MCP includes Copilots, Documents includes LlamaParse (DONE)
2. ⏸️ Update `DEFAULT_SERVICES` descriptions - Add new endpoints and requiredFor (optional)
3. No workflow-store changes needed - use existing services!
4. No ServiceDependencyBadge changes needed - use existing types!
5. No BackendServiceMonitor changes needed - use existing panels!

### Phase B: Mock Data Creation (45 min)
1. ✅ Create `src/lib/mock-data/` folder
2. ✅ Create all mock data files (6 files)
3. ✅ Export centralized `index.ts` for easy imports

### Phase C: Core Components (2-3 hours)
1. ✅ Create `UploadArea.tsx` - Drag & drop + file validation
2. ✅ Create `DigitizationStepCard.tsx` - Reusable step display
3. ✅ Create `GuardianProcessVisualization.tsx` - 7-step progress
4. ✅ Create preview components (Schema, Policy, Calculation, TestResults)

### Phase D: Main Upload Flow (1-2 hours)
1. ✅ Create `MethodologyUploadFlow.tsx` - Wire everything together
2. ✅ Add state management for upload flow
3. ✅ Add mock processing simulation functions
4. ✅ Connect service dependency badges

### Phase E: Backend Placeholders (1 hour)
1. ✅ Add digitization endpoint stubs to `methodologies.py`
2. ✅ Add Pydantic models for requests/responses
3. ✅ Create placeholder service files

### Phase F: Testing & Integration (1 hour)
1. ✅ Update test page to show upload flow
2. ✅ Test all 7 steps with mock data
3. ✅ Verify service badge display
4. ✅ Test error states

**Total Estimated Time**: 5.5-7.5 hours (reduced from 6-8 hrs due to simplified service architecture)

---

## 10. Success Criteria

- [ ] Service badges show **MCP Proxy** and **Documents Service** with current status
- [ ] Upload area accepts PDF files (client-side validation)
- [ ] 7-step Guardian process visualized with status indicators
- [ ] Each step shows appropriate service dependency:
  - Step 2: Documents Service badge
  - Steps 3-6: MCP Proxy badge
- [ ] Mock data flows through all steps automatically
- [ ] Preview panels show generated artifacts (schemas, policies, calculations)
- [ ] Final review panel shows complete methodology details
- [ ] Download button generates mock Guardian package
- [ ] "Approve & Save" button adds methodology to list
- [ ] Backend endpoints defined (even if returning mock data)
- [ ] Easy to swap mock functions for real API calls later
- [ ] Service status badges update when real services connected
- [ ] ✅ **Integrated into MethodologySelector "Upload New" button**

---

## 11. Future Enhancements (Post-Mock)

**Phase 2: Real Backend Integration**
- Implement actual backend endpoints
- Add file upload handling
- Return structured mock data from backend

**Phase 3: LlamaParse Integration**
- Add LlamaParse API key configuration
- Implement real PDF parsing
- Handle parsing errors and retries

**Phase 4: Claude Integration**
- Add Claude API key configuration
- Implement real analysis prompts
- Implement schema/policy/calculation generation
- Add streaming responses for real-time feedback

**Phase 5: Guardian Integration**
- Set up Guardian instance (local or hosted)
- Implement Guardian dry-run testing
- Add Guardian artifact export
- Deploy methodologies to Guardian

**Phase 6: Learning & Improvement**
- Track digitization accuracy
- User feedback on generated artifacts
- Fine-tune Claude prompts based on corrections
- Build template library of successful patterns

---

## 12. Notes & Considerations

### UI/UX Decisions
- **Auto-advance vs Manual**: Auto-advance through steps (user can interrupt)
- **Expandable Previews**: Collapse by default, expand to see JSON/code
- **Download Options**: JSON, ZIP (all artifacts), or individual files
- **Edit Capability**: Phase 1 = view only, Phase 2+ = allow edits before save

### Error Handling
- **Upload errors**: File too large, wrong format, corrupt PDF
- **Parsing errors**: LlamaParse timeout, unreadable document
- **Analysis errors**: Claude API failure, rate limits
- **Validation errors**: Invalid schemas, workflow logic issues

### Performance
- **File size limits**: Max 50MB PDFs
- **Progress indicators**: Show percentage for long-running steps
- **Caching**: Cache parsed documents to avoid re-parsing on errors
- **Cancellation**: Allow user to cancel in-progress digitization

### Accessibility
- **Keyboard navigation**: Tab through steps, Enter to expand
- **Screen readers**: Proper ARIA labels for status indicators
- **Color contrast**: Status colors meet WCAG AA standards
- **Loading states**: Clear indication of processing vs waiting for user

---

**End of Implementation Plan**
