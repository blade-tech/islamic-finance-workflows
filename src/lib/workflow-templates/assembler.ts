/**
 * WORKFLOW ASSEMBLER
 * ==================
 * Composable workflow assembly engine
 *
 * Takes:
 * - Deal configuration (jurisdiction, product, accounting, etc.)
 * - Workflow modules (JSON templates)
 * - Assembly rules (dependency chains, hard gates)
 *
 * Returns:
 * - Assembled workflow with flattened steps
 * - Dependency graph
 * - Critical path
 */

import type {
  DealConfiguration,
  Workflow,
  WorkflowModule,
  WorkflowStep,
  WorkflowTemplate,
  AssemblyRules,
  DependencyChain,
} from '@/lib/types/grc-demo-types'

// ============================================================================
// MODULE LOADER
// ============================================================================

/**
 * Load workflow module from JSON file
 * In production, this would load from backend API or database
 * For MVP, we'll use imported JSON modules
 */
export async function loadModule(moduleId: string): Promise<WorkflowModule> {
  try {
    // Dynamic import of module JSON files
    const module = await import(
      `@/lib/workflow-templates/qatar/modules/${moduleId}.json`
    )
    return module.default as WorkflowModule
  } catch (error) {
    throw new Error(`Failed to load module ${moduleId}: ${error}`)
  }
}

/**
 * Load workflow template for product type
 */
export async function loadWorkflowTemplate(
  productType: string,
  jurisdiction: string
): Promise<WorkflowTemplate> {
  try {
    const template = await import(
      `@/lib/workflow-templates/${jurisdiction}/${productType}.json`
    )
    return template.default as WorkflowTemplate
  } catch (error) {
    throw new Error(
      `Failed to load template for ${productType} in ${jurisdiction}: ${error}`
    )
  }
}

// ============================================================================
// WORKFLOW ASSEMBLY
// ============================================================================

/**
 * Assemble complete workflow from modules
 */
export async function assembleWorkflow(
  config: DealConfiguration
): Promise<Workflow> {
  // 1. Load workflow template
  const template = await loadWorkflowTemplate(
    config.productType,
    config.jurisdiction
  )

  // 2. Load all required modules
  const modules = await Promise.all(
    template.modules.map((moduleId) => loadModule(moduleId))
  )

  // 3. Filter modules based on configuration
  const filteredModules = filterModules(modules, config)

  // 4. Flatten module steps into single workflow
  const steps = flattenSteps(filteredModules, template.assemblyRules)

  // 5. Calculate critical path
  const criticalPath = calculateCriticalPath(steps, template.assemblyRules)

  // 6. Calculate total duration
  const totalDurationDays = calculateTotalDuration(steps, criticalPath)

  // 7. Create workflow object
  const workflow: Workflow = {
    id: `wf-${config.id}-${Date.now()}`,
    dealConfigId: config.id,
    name: `${config.productType.toUpperCase()} Workflow - ${config.jurisdiction.toUpperCase()}`,
    description: `Complete GRC workflow for ${config.productType} product in ${config.jurisdiction}`,
    modules: filteredModules,
    steps,
    totalDurationDays,
    criticalPath,
    isCustomized: false,
    customizationLog: [],
  }

  return workflow
}

/**
 * Filter modules based on configuration
 * - Remove optional modules if not applicable
 * - Add conditional modules based on selections
 */
function filterModules(
  modules: WorkflowModule[],
  config: DealConfiguration
): WorkflowModule[] {
  return modules.filter((module) => {
    // Always include required modules
    if (module.isRequired) return true

    // Filter based on accounting standard
    if (module.id.includes('aaoifi') && config.accountingStandard !== 'aaoifi') {
      return false
    }

    // Filter based on sustainability framework
    if (module.category === 'sustainability') {
      return config.sustainability?.framework !== 'none'
    }

    return true
  })
}

/**
 * Flatten module steps into single array with dependency tracking
 */
function flattenSteps(
  modules: WorkflowModule[],
  rules: AssemblyRules
): WorkflowStep[] {
  const allSteps: WorkflowStep[] = []
  const moduleStepMap = new Map<string, string[]>() // moduleId -> stepIds

  // 1. Collect all steps from modules
  modules.forEach((module) => {
    const stepIds: string[] = []

    module.steps.forEach((step) => {
      allSteps.push(step)
      stepIds.push(step.id)
    })

    moduleStepMap.set(module.id, stepIds)
  })

  // 2. Apply dependency chains
  rules.dependencyChains.forEach((chain) => {
    applyDependencyChain(chain, allSteps, moduleStepMap)
  })

  // 3. Sort by order
  allSteps.sort((a, b) => a.order - b.order)

  return allSteps
}

/**
 * Apply dependency chain to steps
 */
function applyDependencyChain(
  chain: DependencyChain,
  steps: WorkflowStep[],
  moduleStepMap: Map<string, string[]>
): void {
  const beforeStepIds = getStepIdsForModule(chain.before, moduleStepMap)
  const afterStepIds = Array.isArray(chain.after)
    ? chain.after.flatMap((id) => getStepIdsForModule(id, moduleStepMap))
    : getStepIdsForModule(chain.after, moduleStepMap)

  // For each "after" step, add dependency on "before" steps
  afterStepIds.forEach((afterStepId) => {
    const step = steps.find((s) => s.id === afterStepId)
    if (step) {
      if (!step.startAfter) {
        step.startAfter = []
      }
      // Add last step of "before" module as dependency
      const lastBeforeStepId = beforeStepIds[beforeStepIds.length - 1]
      if (!step.startAfter.includes(lastBeforeStepId)) {
        step.startAfter.push(lastBeforeStepId)
      }
    }
  })
}

/**
 * Get step IDs for module or step ID
 */
function getStepIdsForModule(
  id: string,
  moduleStepMap: Map<string, string[]>
): string[] {
  // Check if it's a module ID
  if (moduleStepMap.has(id)) {
    return moduleStepMap.get(id)!
  }

  // Otherwise, it's a step ID
  return [id]
}

/**
 * Calculate critical path through workflow
 * Uses longest path algorithm
 */
function calculateCriticalPath(
  steps: WorkflowStep[],
  rules: AssemblyRules
): string[] {
  const criticalPath: string[] = []
  const stepDurations = new Map<string, number>()

  // Calculate earliest start time for each step
  const earliestStart = new Map<string, number>()
  steps.forEach((step) => {
    const dependencies = step.startAfter || []
    if (dependencies.length === 0) {
      earliestStart.set(step.id, 0)
    } else {
      const maxDependencyEnd = Math.max(
        ...dependencies.map(
          (depId) =>
            (earliestStart.get(depId) || 0) +
            (steps.find((s) => s.id === depId)?.durationDays || 0)
        )
      )
      earliestStart.set(step.id, maxDependencyEnd)
    }
    stepDurations.set(step.id, step.durationDays)
  })

  // Find longest path (critical path)
  // Simple approach: follow dependencies with longest cumulative duration
  const visited = new Set<string>()
  const startSteps = steps.filter(
    (s) => !s.startAfter || s.startAfter.length === 0
  )

  startSteps.forEach((startStep) => {
    const path = findLongestPath(startStep.id, steps, visited, stepDurations)
    if (path.length > criticalPath.length) {
      criticalPath.length = 0
      criticalPath.push(...path)
    }
  })

  return criticalPath
}

/**
 * Find longest path from step using DFS
 */
function findLongestPath(
  stepId: string,
  steps: WorkflowStep[],
  visited: Set<string>,
  durations: Map<string, number>
): string[] {
  if (visited.has(stepId)) return []

  visited.add(stepId)
  const step = steps.find((s) => s.id === stepId)
  if (!step) return []

  // Find steps that depend on this step
  const nextSteps = steps.filter((s) => s.startAfter?.includes(stepId))

  if (nextSteps.length === 0) {
    return [stepId]
  }

  let longestPath: string[] = []
  nextSteps.forEach((nextStep) => {
    const path = findLongestPath(nextStep.id, steps, visited, durations)
    if (path.length > longestPath.length) {
      longestPath = path
    }
  })

  return [stepId, ...longestPath]
}

/**
 * Calculate total workflow duration based on critical path
 */
function calculateTotalDuration(
  steps: WorkflowStep[],
  criticalPath: string[]
): number {
  return criticalPath.reduce((total, stepId) => {
    const step = steps.find((s) => s.id === stepId)
    return total + (step?.durationDays || 0)
  }, 0)
}

// ============================================================================
// WORKFLOW CUSTOMIZATION
// ============================================================================

/**
 * Validate customization request
 * Returns true if customization is allowed, false otherwise
 */
export function canCustomizeStep(
  step: WorkflowStep,
  field: string
): { allowed: boolean; reason?: string } {
  // Check if step is editable
  if (step.isHardGate) {
    return {
      allowed: false,
      reason: `This is a hard gate required by ${step.policyConstraints[0]?.source}. Cannot be modified.`,
    }
  }

  // Check specific field permissions
  switch (field) {
    case 'durationDays':
      if (!step.allowDurationChange) {
        return {
          allowed: false,
          reason: 'Duration for this step cannot be modified due to regulatory requirements.',
        }
      }
      break

    case 'assignedRole':
    case 'assignedTo':
      if (!step.allowRoleChange) {
        return {
          allowed: false,
          reason: `Assignment must be to ${step.assignedRole} per policy requirements.`,
        }
      }
      break

    case 'isOptional':
      if (!step.isOptional) {
        return {
          allowed: false,
          reason: 'This step is required and cannot be skipped.',
        }
      }
      break

    default:
      return { allowed: true }
  }

  return { allowed: true }
}

/**
 * Apply customization to workflow
 */
export function applyCustomization(
  workflow: Workflow,
  stepId: string,
  field: string,
  newValue: any,
  changedBy: string
): Workflow {
  const step = workflow.steps.find((s) => s.id === stepId)
  if (!step) {
    throw new Error(`Step ${stepId} not found in workflow`)
  }

  // Validate customization
  const validation = canCustomizeStep(step, field)
  if (!validation.allowed) {
    throw new Error(validation.reason)
  }

  // Apply change
  const oldValue = (step as any)[field]
  ;(step as any)[field] = newValue

  // Log customization
  workflow.customizationLog.push({
    stepId,
    field,
    oldValue,
    newValue,
    changedBy,
    changedAt: new Date().toISOString(),
  })

  workflow.isCustomized = true

  // Recalculate critical path and duration if needed
  if (field === 'durationDays') {
    workflow.criticalPath = calculateCriticalPath(
      workflow.steps,
      { hardGates: [], dependencyChains: [] } // Simplified for now
    )
    workflow.totalDurationDays = calculateTotalDuration(
      workflow.steps,
      workflow.criticalPath
    )
  }

  return workflow
}
