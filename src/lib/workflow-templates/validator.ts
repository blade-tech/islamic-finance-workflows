/**
 * POLICY VALIDATOR
 * ================
 * Validates workflow configurations against policy constraints
 *
 * Ensures:
 * - Hard gates cannot be bypassed
 * - Required evidence is collected
 * - Policy constraints are respected
 * - Regulatory requirements are met
 */

import type {
  Workflow,
  WorkflowStep,
  WorkflowModule,
  ValidationResult,
  ValidationError,
  DealConfiguration,
  PolicyConstraint,
} from '@/lib/types/grc-demo-types'

// ============================================================================
// WORKFLOW VALIDATION
// ============================================================================

/**
 * Validate entire workflow against policy constraints
 */
export function validateWorkflow(workflow: Workflow): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // 1. Validate all hard gates are present
  const hardGateValidation = validateHardGates(workflow)
  errors.push(...hardGateValidation.errors)
  warnings.push(...hardGateValidation.warnings)

  // 2. Validate dependency chains
  const dependencyValidation = validateDependencies(workflow)
  errors.push(...dependencyValidation.errors)
  warnings.push(...dependencyValidation.warnings)

  // 3. Validate evidence requirements
  const evidenceValidation = validateEvidence(workflow)
  errors.push(...evidenceValidation.errors)
  warnings.push(...evidenceValidation.warnings)

  // 4. Validate approval gates
  const approvalValidation = validateApprovals(workflow)
  errors.push(...approvalValidation.errors)
  warnings.push(...approvalValidation.warnings)

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate hard gates are present and configured correctly
 */
function validateHardGates(workflow: Workflow): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Find all hard gate steps
  const hardGateSteps = workflow.steps.filter((step) => step.isHardGate)

  hardGateSteps.forEach((step) => {
    // Check if hard gate step has required evidence
    const requiredEvidence = step.requiredEvidence.filter((e) => e.isRequired)
    if (requiredEvidence.length === 0) {
      warnings.push({
        field: `steps.${step.id}.requiredEvidence`,
        message: `Hard gate step "${step.title}" should have required evidence defined`,
        severity: 'warning',
        policySource: step.policyConstraints[0]?.source,
      })
    }

    // Check if hard gate has approval requirement
    if (!step.requiresApproval) {
      warnings.push({
        field: `steps.${step.id}.requiresApproval`,
        message: `Hard gate step "${step.title}" typically requires approval`,
        severity: 'warning',
        policySource: step.policyConstraints[0]?.source,
      })
    }

    // Validate policy constraints are documented
    if (step.policyConstraints.length === 0) {
      errors.push({
        field: `steps.${step.id}.policyConstraints`,
        message: `Hard gate step "${step.title}" must have policy constraints documented`,
        severity: 'error',
        policySource: 'Validator Requirement',
      })
    }

    // Check if any policy constraints are modifiable (should not be for hard gates)
    const modifiableConstraints = step.policyConstraints.filter(
      (c) => !c.cannotModify
    )
    if (modifiableConstraints.length > 0) {
      errors.push({
        field: `steps.${step.id}.policyConstraints`,
        message: `Hard gate step "${step.title}" has modifiable policy constraints - all constraints should be locked`,
        severity: 'error',
        policySource: step.policyConstraints[0]?.source,
      })
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate dependency chains are valid
 */
function validateDependencies(workflow: Workflow): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  const stepIds = new Set(workflow.steps.map((s) => s.id))

  workflow.steps.forEach((step) => {
    if (step.startAfter && step.startAfter.length > 0) {
      step.startAfter.forEach((dependencyId) => {
        // Check if dependency exists
        if (!stepIds.has(dependencyId)) {
          errors.push({
            field: `steps.${step.id}.startAfter`,
            message: `Step "${step.title}" depends on non-existent step "${dependencyId}"`,
            severity: 'error',
          })
        }

        // Check for circular dependencies (simplified check)
        if (hasCircularDependency(step.id, dependencyId, workflow.steps)) {
          errors.push({
            field: `steps.${step.id}.startAfter`,
            message: `Circular dependency detected: "${step.title}" depends on "${dependencyId}"`,
            severity: 'error',
          })
        }
      })
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Check for circular dependencies (simplified)
 */
function hasCircularDependency(
  stepId: string,
  dependencyId: string,
  steps: WorkflowStep[]
): boolean {
  // If dependency depends on this step (direct circular), return true
  const dependencyStep = steps.find((s) => s.id === dependencyId)
  if (
    dependencyStep?.startAfter &&
    dependencyStep.startAfter.includes(stepId)
  ) {
    return true
  }

  // More complex circular dependency detection would require graph traversal
  return false
}

/**
 * Validate evidence requirements
 */
function validateEvidence(workflow: Workflow): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  workflow.steps.forEach((step) => {
    // All steps should have at least one evidence requirement
    if (step.requiredEvidence.length === 0) {
      warnings.push({
        field: `steps.${step.id}.requiredEvidence`,
        message: `Step "${step.title}" has no evidence requirements - consider adding documentation`,
        severity: 'warning',
      })
    }

    // Hard gates must have required evidence
    if (step.isHardGate) {
      const hasRequiredEvidence = step.requiredEvidence.some((e) => e.isRequired)
      if (!hasRequiredEvidence) {
        errors.push({
          field: `steps.${step.id}.requiredEvidence`,
          message: `Hard gate step "${step.title}" must have at least one required evidence item`,
          severity: 'error',
          policySource: step.policyConstraints[0]?.source,
        })
      }
    }

    // Evidence should have clear descriptions
    step.requiredEvidence.forEach((evidence, index) => {
      if (!evidence.description || evidence.description.length < 10) {
        warnings.push({
          field: `steps.${step.id}.requiredEvidence[${index}]`,
          message: `Evidence "${evidence.type}" needs more detailed description`,
          severity: 'warning',
        })
      }
    })
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate approval gates
 */
function validateApprovals(workflow: Workflow): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  const stepsRequiringApproval = workflow.steps.filter(
    (s) => s.requiresApproval
  )

  stepsRequiringApproval.forEach((step) => {
    // Steps requiring approval must have approver role defined
    if (!step.approvalRole) {
      errors.push({
        field: `steps.${step.id}.approvalRole`,
        message: `Step "${step.title}" requires approval but no approver role is specified`,
        severity: 'error',
      })
    }

    // Hard gates should require approval
    if (step.isHardGate && !step.requiresApproval) {
      warnings.push({
        field: `steps.${step.id}.requiresApproval`,
        message: `Hard gate step "${step.title}" should typically require approval`,
        severity: 'warning',
        policySource: step.policyConstraints[0]?.source,
      })
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// ============================================================================
// CONFIGURATION VALIDATION
// ============================================================================

/**
 * Validate deal configuration before workflow generation
 */
export function validateConfiguration(
  config: DealConfiguration
): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // 1. Jurisdiction must be selected
  if (!config.jurisdiction) {
    errors.push({
      field: 'jurisdiction',
      message: 'Jurisdiction must be selected',
      severity: 'error',
    })
  }

  // 2. Product type must be selected
  if (!config.productType) {
    errors.push({
      field: 'productType',
      message: 'Product type must be selected',
      severity: 'error',
    })
  }

  // 3. Accounting standard must be selected
  if (!config.accountingStandard) {
    errors.push({
      field: 'accountingStandard',
      message: 'Accounting standard must be selected',
      severity: 'error',
    })
  }

  // 4. If sustainability selected, validate framework
  if (
    config.sustainability &&
    config.sustainability.framework !== 'none' &&
    config.sustainability.framework === 'un-sdgs'
  ) {
    if (
      !config.sustainability.targetSDGs ||
      config.sustainability.targetSDGs.length === 0
    ) {
      warnings.push({
        field: 'sustainability.targetSDGs',
        message: 'UN SDG framework selected but no target SDGs specified',
        severity: 'warning',
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// ============================================================================
// POLICY CONSTRAINT VALIDATION
// ============================================================================

/**
 * Validate that a specific policy constraint is being met
 */
export function validatePolicyConstraint(
  constraint: PolicyConstraint,
  context: any
): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // This is a hook for custom validation logic per constraint
  // In practice, each constraint would have specific validation rules

  if (constraint.cannotModify && context.isModified) {
    errors.push({
      field: 'policyConstraint',
      message: `Policy constraint "${constraint.constraint}" cannot be modified`,
      severity: 'error',
      policySource: constraint.source,
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// ============================================================================
// MODULE VALIDATION
// ============================================================================

/**
 * Validate individual workflow module
 */
export function validateModule(module: WorkflowModule): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // 1. Module must have at least one step
  if (module.steps.length === 0) {
    errors.push({
      field: 'module.steps',
      message: `Module "${module.name}" has no steps defined`,
      severity: 'error',
      policySource: module.policySource,
    })
  }

  // 2. Validate each step
  module.steps.forEach((step, index) => {
    const stepValidation = validateStep(step, module)
    errors.push(...stepValidation.errors)
    warnings.push(...stepValidation.warnings)
  })

  // 3. Hard gate modules must be marked as required
  const hasHardGateSteps = module.steps.some((s) => s.isHardGate)
  if (hasHardGateSteps && !module.isRequired) {
    errors.push({
      field: 'module.isRequired',
      message: `Module "${module.name}" contains hard gates but is not marked as required`,
      severity: 'error',
      policySource: module.policySource,
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate individual step
 */
function validateStep(
  step: WorkflowStep,
  module: WorkflowModule
): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // 1. Step must have title and description
  if (!step.title || step.title.length < 5) {
    errors.push({
      field: `step.${step.id}.title`,
      message: 'Step title must be at least 5 characters',
      severity: 'error',
    })
  }

  if (!step.description || step.description.length < 20) {
    warnings.push({
      field: `step.${step.id}.description`,
      message: 'Step description should be more detailed (at least 20 characters)',
      severity: 'warning',
    })
  }

  // 2. Duration must be positive
  if (step.durationDays <= 0) {
    errors.push({
      field: `step.${step.id}.durationDays`,
      message: 'Step duration must be positive',
      severity: 'error',
    })
  }

  // 3. Assigned role must be specified
  if (!step.assignedRole) {
    errors.push({
      field: `step.${step.id}.assignedRole`,
      message: 'Step must have assigned role',
      severity: 'error',
    })
  }

  // 4. Hard gate steps must have policy constraints
  if (step.isHardGate && step.policyConstraints.length === 0) {
    errors.push({
      field: `step.${step.id}.policyConstraints`,
      message: 'Hard gate step must have at least one policy constraint',
      severity: 'error',
      policySource: module.policySource,
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// ============================================================================
// SHARIAH COMPLIANCE VALIDATION
// ============================================================================

/**
 * Validate Shariah compliance requirements for product
 */
export function validateShariahCompliance(
  workflow: Workflow,
  productType: string
): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // 1. SSB approval must be present for all products
  const hasSsbApproval = workflow.steps.some((step) =>
    step.id.includes('ssb-001')
  )
  if (!hasSsbApproval) {
    errors.push({
      field: 'workflow.modules',
      message: 'Shariah Supervisory Board approval module is required for all products',
      severity: 'error',
      policySource: 'AAOIFI GS-1',
    })
  }

  // 2. SNCR monitoring must be present
  const hasSncr = workflow.steps.some((step) => step.id.includes('sncr-001'))
  if (!hasSncr) {
    warnings.push({
      field: 'workflow.modules',
      message: 'SNCR monitoring module is recommended for risk management',
      severity: 'warning',
      policySource: 'IFSB-1 §6.1-6.2',
    })
  }

  // 3. Product-specific validation
  switch (productType) {
    case 'ijarah':
      const hasDeliveryBeforeRent = workflow.steps.some((step) =>
        step.id.includes('ijr-gate-002')
      )
      if (!hasDeliveryBeforeRent) {
        errors.push({
          field: 'workflow.modules',
          message: 'Ijarah requires "Delivery Before Rent" hard gate module',
          severity: 'error',
          policySource: 'AAOIFI SS-9 §4/4',
        })
      }
      break

    case 'murabaha':
      const hasCostDisclosure = workflow.steps.some((step) =>
        step.id.includes('mrb-gate-001')
      )
      if (!hasCostDisclosure) {
        errors.push({
          field: 'workflow.modules',
          message: 'Murabaha requires "Cost Disclosure" hard gate module',
          severity: 'error',
          policySource: 'AAOIFI FAS-28 §3',
        })
      }
      break

    case 'mudaraba':
      const hasProfitSharing = workflow.steps.some((step) =>
        step.id.includes('mdr-gate-002')
      )
      if (!hasProfitSharing) {
        errors.push({
          field: 'workflow.modules',
          message: 'Mudaraba requires "Profit-Sharing Ratio" hard gate module',
          severity: 'error',
          policySource: 'AAOIFI FAS-3 §3',
        })
      }
      break
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
