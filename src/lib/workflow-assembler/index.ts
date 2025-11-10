/**
 * WORKFLOW ASSEMBLER
 * ==================
 * Assembles GRC workflows from composable JSON modules
 *
 * Flow:
 * 1. Load product template (e.g., qatar/ijarah.json)
 * 2. Load each module referenced in template
 * 3. Assemble into Workflow with flattened steps
 * 4. Calculate critical path and duration
 */

import type {
  DealConfiguration,
  Workflow,
  WorkflowModule,
  WorkflowStep,
  ProductType,
  Jurisdiction,
} from '@/lib/types/grc-demo-types'

// Import product templates
import qatarIjarahTemplate from '@/lib/workflow-templates/qatar/ijarah.json'
import qatarMurabahaTemplate from '@/lib/workflow-templates/qatar/murabaha.json'
import qatarMudarabaTemplate from '@/lib/workflow-templates/qatar/mudaraba.json'

// Import Qatar modules
import qatSsb001 from '@/lib/workflow-templates/qatar/modules/qat-ssb-001.json'
import qatScf001 from '@/lib/workflow-templates/qatar/modules/qat-scf-001.json'
import qatIjrGate001 from '@/lib/workflow-templates/qatar/modules/qat-ijr-gate-001.json'
import qatIjrGate002 from '@/lib/workflow-templates/qatar/modules/qat-ijr-gate-002.json'
import qatSncr001 from '@/lib/workflow-templates/qatar/modules/qat-sncr-001.json'
import qatMrbGate001 from '@/lib/workflow-templates/qatar/modules/qat-mrb-gate-001.json'
import qatMrbGate002 from '@/lib/workflow-templates/qatar/modules/qat-mrb-gate-002.json'
import qatMdrGate001 from '@/lib/workflow-templates/qatar/modules/qat-mdr-gate-001.json'
import qatMdrGate002 from '@/lib/workflow-templates/qatar/modules/qat-mdr-gate-002.json'

// ============================================================================
// MODULE REGISTRY
// ============================================================================

const MODULE_REGISTRY: Record<string, any> = {
  'qat-ssb-001': qatSsb001,
  'qat-scf-001': qatScf001,
  'qat-ijr-gate-001': qatIjrGate001,
  'qat-ijr-gate-002': qatIjrGate002,
  'qat-sncr-001': qatSncr001,
  'qat-mrb-gate-001': qatMrbGate001,
  'qat-mrb-gate-002': qatMrbGate002,
  'qat-mdr-gate-001': qatMdrGate001,
  'qat-mdr-gate-002': qatMdrGate002,
}

// ============================================================================
// TEMPLATE REGISTRY
// ============================================================================

interface TemplateKey {
  jurisdiction: Jurisdiction
  productType: ProductType
}

const TEMPLATE_REGISTRY: Record<string, any> = {
  'qatar-ijarah': qatarIjarahTemplate,
  'qatar-murabaha': qatarMurabahaTemplate,
  'qatar-mudaraba': qatarMudarabaTemplate,
}

function getTemplateKey(jurisdiction: Jurisdiction, productType: ProductType): string {
  return `${jurisdiction}-${productType}`
}

// ============================================================================
// WORKFLOW ASSEMBLY
// ============================================================================

export async function assembleWorkflows(
  config: DealConfiguration
): Promise<Workflow[]> {
  const templateKey = getTemplateKey(config.jurisdiction, config.productType)
  const template = TEMPLATE_REGISTRY[templateKey]

  if (!template) {
    throw new Error(
      `No workflow template found for ${config.jurisdiction} + ${config.productType}. Available: ${Object.keys(TEMPLATE_REGISTRY).join(', ')}`
    )
  }

  // Load all modules referenced in template
  const modules: WorkflowModule[] = []
  let stepCounter = 1

  for (const moduleId of template.modules) {
    const moduleData = MODULE_REGISTRY[moduleId]

    if (!moduleData) {
      console.warn(`Module ${moduleId} not found in registry, skipping`)
      continue
    }

    // Transform module data to WorkflowModule format
    const workflowModule: WorkflowModule = {
      id: moduleData.id,
      name: moduleData.name,
      category: moduleData.category as any,
      policySource: moduleData.policySource,
      isRequired: moduleData.isRequired,
      isEditable: moduleData.isEditable,
      steps: moduleData.steps.map((step: any) => ({
        ...step,
        order: stepCounter++,
      })),
    }

    modules.push(workflowModule)
  }

  // Flatten steps from all modules
  const allSteps: WorkflowStep[] = modules.flatMap((module) => module.steps)

  // Calculate total duration
  const totalDurationDays = allSteps.reduce(
    (sum, step) => sum + step.durationDays,
    0
  )

  // Extract critical path from template
  const criticalPath = template.criticalPath || []

  // Assemble final workflow
  const workflow: Workflow = {
    id: `workflow-${config.id}`,
    dealConfigId: config.id,
    name: template.name || `${config.productType} Workflow`,
    description:
      template.description ||
      `Complete GRC workflow for ${config.productType} in ${config.jurisdiction}`,
    modules,
    steps: allSteps,
    totalDurationDays,
    criticalPath,
    isCustomized: false,
    customizationLog: [],
  }

  return [workflow]
}

// ============================================================================
// HELPER: Get Available Templates
// ============================================================================

export function getAvailableTemplates(): TemplateKey[] {
  return Object.keys(TEMPLATE_REGISTRY).map((key) => {
    const [jurisdiction, productType] = key.split('-')
    return {
      jurisdiction: jurisdiction as Jurisdiction,
      productType: productType as ProductType,
    }
  })
}

// ============================================================================
// HELPER: Get Template Info
// ============================================================================

export function getTemplateInfo(
  jurisdiction: Jurisdiction,
  productType: ProductType
) {
  const templateKey = getTemplateKey(jurisdiction, productType)
  const template = TEMPLATE_REGISTRY[templateKey]

  if (!template) {
    return null
  }

  return {
    name: template.name,
    description: template.description,
    estimatedDurationDays: template.estimatedDurationDays,
    moduleCount: template.modules.length,
    keyRequirements: template.keyRequirements,
  }
}
