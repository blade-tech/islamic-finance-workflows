/**
 * METHODOLOGY DIGITIZATION TYPES
 * ===============================
 * Types for the Guardian methodology digitization flow.
 */

// ============================================================================
// PARSED DOCUMENT (LlamaParse output)
// ============================================================================

export interface ParsedDocument {
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

// ============================================================================
// DOCUMENT ANALYSIS (Claude output)
// ============================================================================

export interface DocumentAnalysis {
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

// ============================================================================
// GUARDIAN SCHEMA
// ============================================================================

export interface GuardianSchemaField {
  name: string
  type: 'string' | 'number' | 'date' | 'boolean' | 'enum' | 'nested'
  required: boolean
  description: string
  enum_values?: string[]
  nested_schema?: GuardianSchema
}

export interface GuardianSchema {
  id: string
  name: string
  description: string
  entity: string
  fields: GuardianSchemaField[]
}

// ============================================================================
// GUARDIAN POLICY
// ============================================================================

export interface GuardianWorkflowBlock {
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
}

export interface GuardianPolicy {
  id: string
  name: string
  description: string
  roles: string[]
  workflow_blocks: GuardianWorkflowBlock[]
}

// ============================================================================
// CALCULATION LOGIC
// ============================================================================

export interface CalculationLogic {
  id: string
  name: string
  description: string
  language: 'javascript'
  code: string
  inputs: { name: string; type: string; description: string }[]
  outputs: { name: string; type: string; description: string }[]
}

// ============================================================================
// VALIDATION RESULTS
// ============================================================================

export interface ValidationResults {
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

// ============================================================================
// DIGITIZATION STATE
// ============================================================================

export type ProcessState =
  | 'idle' // No file uploaded
  | 'uploading' // File upload in progress
  | 'parsing' // LlamaParse extraction
  | 'analyzing' // Claude analysis
  | 'generating-schemas' // Claude schema generation
  | 'generating-policies' // Claude policy generation
  | 'generating-calcs' // Claude calculation generation
  | 'validating' // Guardian dry-run
  | 'complete' // All done
  | 'error' // Something failed

export interface DigitizationState {
  currentState: ProcessState
  uploadedFile: File | null
  parsedContent: ParsedDocument | null
  analysis: DocumentAnalysis | null
  schemas: GuardianSchema[] | null
  policies: GuardianPolicy | null
  calculations: CalculationLogic[] | null
  validationResults: ValidationResults | null
  error: string | null
}
