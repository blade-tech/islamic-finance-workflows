/**
 * CONTROL LIBRARY SERVICE
 * =======================
 * Extracts and manages GRC controls from workflow templates
 *
 * Controls are extracted from:
 * 1. Workflow template keyRequirements
 * 2. Module policySource metadata
 * 3. Step policyConstraints
 */

import qatarIjarahTemplate from '@/lib/workflow-templates/qatar/ijarah.json'
import qatarMurabahaTemplate from '@/lib/workflow-templates/qatar/mudaraba.json'
import qatarMudarabaTemplate from '@/lib/workflow-templates/qatar/murabaha.json'

// Module imports
import qatSSB001 from '@/lib/workflow-templates/qatar/modules/qat-ssb-001.json'
import qatSCF001 from '@/lib/workflow-templates/qatar/modules/qat-scf-001.json'
import qatSNCR001 from '@/lib/workflow-templates/qatar/modules/qat-sncr-001.json'
import qatIJRGate001 from '@/lib/workflow-templates/qatar/modules/qat-ijr-gate-001.json'
import qatIJRGate002 from '@/lib/workflow-templates/qatar/modules/qat-ijr-gate-002.json'
import qatMRBGate001 from '@/lib/workflow-templates/qatar/modules/qat-mrb-gate-001.json'
import qatMRBGate002 from '@/lib/workflow-templates/qatar/modules/qat-mrb-gate-002.json'
import qatMDRGate001 from '@/lib/workflow-templates/qatar/modules/qat-mdr-gate-001.json'
import qatMDRGate002 from '@/lib/workflow-templates/qatar/modules/qat-mdr-gate-002.json'

import type { ProductType, ModuleCategory } from '@/lib/types/grc-demo-types'

export interface Control {
  id: string
  name: string
  description: string
  category: ModuleCategory | 'key-requirement'
  source: string // e.g., "AAOIFI SS-9 §3/1"
  isMandatory: boolean
  isHardGate: boolean

  // Usage tracking
  usedInProducts: ProductType[]
  usedInModules: string[]

  // Related constraints
  constraints: Array<{
    text: string
    cannotModify: boolean
  }>
}

export interface ControlCategory {
  id: string
  name: string
  description: string
  controls: Control[]
}

// Module registry
const moduleRegistry: Record<string, any> = {
  'qat-ssb-001': qatSSB001,
  'qat-scf-001': qatSCF001,
  'qat-sncr-001': qatSNCR001,
  'qat-ijr-gate-001': qatIJRGate001,
  'qat-ijr-gate-002': qatIJRGate002,
  'qat-mrb-gate-001': qatMRBGate001,
  'qat-mrb-gate-002': qatMRBGate002,
  'qat-mdr-gate-001': qatMDRGate001,
  'qat-mdr-gate-002': qatMDRGate002,
}

/**
 * Extract controls from Qatar workflow templates
 */
export function extractControlsFromQatarTemplates(): Control[] {
  const controls: Control[] = []
  const controlMap = new Map<string, Control>()

  const templates = [
    { template: qatarIjarahTemplate, productType: 'ijarah' as ProductType },
    { template: qatarMurabahaTemplate, productType: 'murabaha' as ProductType },
    { template: qatarMudarabaTemplate, productType: 'mudaraba' as ProductType },
  ]

  // Extract from template keyRequirements
  templates.forEach(({ template, productType }) => {
    if (template.keyRequirements) {
      template.keyRequirements.forEach((req: any) => {
        const controlId = `control-${req.source.toLowerCase().replace(/[^a-z0-9]/g, '-')}`

        if (!controlMap.has(controlId)) {
          controlMap.set(controlId, {
            id: controlId,
            name: req.requirement,
            description: `Key requirement for ${productType} products`,
            category: 'key-requirement',
            source: req.source,
            isMandatory: req.mandatory,
            isHardGate: req.mandatory,
            usedInProducts: [productType],
            usedInModules: [],
            constraints: [],
          })
        } else {
          const existing = controlMap.get(controlId)!
          if (!existing.usedInProducts.includes(productType)) {
            existing.usedInProducts.push(productType)
          }
        }
      })
    }

    // Extract from modules
    if (template.modules) {
      template.modules.forEach((moduleId: string) => {
        const module = moduleRegistry[moduleId]
        if (!module) return

        // Module-level control
        const controlId = `control-${module.id}`

        if (!controlMap.has(controlId)) {
          controlMap.set(controlId, {
            id: controlId,
            name: module.name,
            description: module.description,
            category: module.category as ModuleCategory,
            source: module.policySource,
            isMandatory: module.isRequired,
            isHardGate: module.isHardGate,
            usedInProducts: [productType],
            usedInModules: [moduleId],
            constraints: [],
          })
        } else {
          const existing = controlMap.get(controlId)!
          if (!existing.usedInProducts.includes(productType)) {
            existing.usedInProducts.push(productType)
          }
          if (!existing.usedInModules.includes(moduleId)) {
            existing.usedInModules.push(moduleId)
          }
        }

        // Extract step-level policy constraints
        if (module.steps) {
          module.steps.forEach((step: any) => {
            if (step.policyConstraints) {
              step.policyConstraints.forEach((constraint: any) => {
                const constraintId = `control-${constraint.source.toLowerCase().replace(/[^a-z0-9]/g, '-')}`

                if (!controlMap.has(constraintId)) {
                  controlMap.set(constraintId, {
                    id: constraintId,
                    name: constraint.constraint,
                    description: `Policy constraint from ${step.title}`,
                    category: module.category as ModuleCategory,
                    source: constraint.source,
                    isMandatory: constraint.cannotModify,
                    isHardGate: step.isHardGate || false,
                    usedInProducts: [productType],
                    usedInModules: [moduleId],
                    constraints: [{
                      text: constraint.constraint,
                      cannotModify: constraint.cannotModify,
                    }],
                  })
                } else {
                  const existing = controlMap.get(constraintId)!
                  if (!existing.usedInProducts.includes(productType)) {
                    existing.usedInProducts.push(productType)
                  }
                  if (!existing.usedInModules.includes(moduleId)) {
                    existing.usedInModules.push(moduleId)
                  }
                  // Add constraint if not already present
                  const hasConstraint = existing.constraints.some(c => c.text === constraint.constraint)
                  if (!hasConstraint) {
                    existing.constraints.push({
                      text: constraint.constraint,
                      cannotModify: constraint.cannotModify,
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
  })

  return Array.from(controlMap.values())
}

/**
 * Group controls by category
 */
export function getControlsByCategory(): ControlCategory[] {
  const controls = extractControlsFromQatarTemplates()
  const categories = new Map<string, Control[]>()

  controls.forEach(control => {
    const category = control.category
    if (!categories.has(category)) {
      categories.set(category, [])
    }
    categories.get(category)!.push(control)
  })

  const categoryInfo: Record<string, { name: string; description: string }> = {
    'shariah-governance': {
      name: 'Shariah Governance',
      description: 'Controls related to Shariah Supervisory Board oversight and governance',
    },
    'contract-gates': {
      name: 'Contract Gates',
      description: 'Product-specific sequence controls (e.g., delivery before rent)',
    },
    'risk-management': {
      name: 'Risk Management',
      description: 'SNCR monitoring, DCR controls, and Islamic risk categories',
    },
    'reporting': {
      name: 'Reporting & Disclosure',
      description: 'AAOIFI, IFSB, and regulatory reporting requirements',
    },
    'sustainability': {
      name: 'Sustainability & ESG',
      description: 'Green Sukuk, SDG alignment, and Value-Based Intermediation',
    },
    'key-requirement': {
      name: 'Key Requirements',
      description: 'Core mandatory requirements for Islamic finance products',
    },
  }

  return Array.from(categories.entries()).map(([categoryId, controls]) => ({
    id: categoryId,
    name: categoryInfo[categoryId]?.name || categoryId,
    description: categoryInfo[categoryId]?.description || '',
    controls: controls.sort((a, b) => {
      // Sort by mandatory first, then by name
      if (a.isMandatory !== b.isMandatory) {
        return a.isMandatory ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    }),
  })).sort((a, b) => {
    // Priority order for categories
    const order = [
      'key-requirement',
      'shariah-governance',
      'contract-gates',
      'risk-management',
      'reporting',
      'sustainability',
    ]
    return order.indexOf(a.id) - order.indexOf(b.id)
  })
}

/**
 * Search controls by keyword
 */
export function searchControls(query: string): Control[] {
  const controls = extractControlsFromQatarTemplates()
  const lowerQuery = query.toLowerCase()

  return controls.filter(control => {
    return (
      control.name.toLowerCase().includes(lowerQuery) ||
      control.description.toLowerCase().includes(lowerQuery) ||
      control.source.toLowerCase().includes(lowerQuery) ||
      control.constraints.some(c => c.text.toLowerCase().includes(lowerQuery))
    )
  })
}

/**
 * Get controls by product type
 */
export function getControlsByProduct(productType: ProductType): Control[] {
  const controls = extractControlsFromQatarTemplates()
  return controls.filter(control => control.usedInProducts.includes(productType))
}

/**
 * Get control statistics
 */
export function getControlStats() {
  const controls = extractControlsFromQatarTemplates()

  return {
    total: controls.length,
    mandatory: controls.filter(c => c.isMandatory).length,
    hardGates: controls.filter(c => c.isHardGate).length,
    byCategory: getControlsByCategory().map(cat => ({
      category: cat.name,
      count: cat.controls.length,
    })),
  }
}
