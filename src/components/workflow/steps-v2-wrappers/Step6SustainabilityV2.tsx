'use client'

/**
 * STEP 6: SUSTAINABILITY & IMPACT (V2 Wrapper)
 * =============================================
 * Wrapper for V2 SustainabilityStep that integrates with main demo Zustand store
 *
 * DATA FLOW:
 * 1. Read current impact metrics from Zustand store
 * 2. Convert to V2 SustainabilityConfig format
 * 3. Render V2 SustainabilityStep component
 * 4. On change, convert V2 data back to main demo format
 * 5. Save to Zustand store using setImpacts
 *
 * MAPPING NOTES:
 * - Main demo uses ImpactMetrics[] (multi-select, can include 'none')
 * - V2 uses enabled flag + type + frameworks
 * - Adapter handles conversion between the two models
 */

import { useWorkflowStore } from '@/lib/store'
import { SustainabilityStep } from '@/components/workflow-v2/steps/SustainabilityStep'
import type { SustainabilityConfig } from '@/lib/control-engine/types'
import { mapImpactsToSustainability, mapSustainabilityToImpacts } from '@/lib/v2-adapter'

export function Step6SustainabilityV2() {
  const execution = useWorkflowStore((state) => state.execution)
  const setImpacts = useWorkflowStore((state) => state.setImpacts)

  // Convert main demo ImpactMetrics[] to V2 SustainabilityConfig
  const currentSustainabilityConfig: SustainabilityConfig = execution?.selectedImpacts
    ? mapImpactsToSustainability(execution.selectedImpacts)
    : { type: 'None', frameworks: [] }

  // Handle V2 sustainability configuration changes
  const handleSustainabilityChange = (sustainabilityConfig: SustainabilityConfig) => {
    // Convert V2 SustainabilityConfig back to main demo ImpactMetrics[]
    const impactMetrics = mapSustainabilityToImpacts(sustainabilityConfig)
    setImpacts(impactMetrics)
  }

  return (
    <div className="space-y-8">
      {/* V2 Sustainability Step */}
      <SustainabilityStep
        value={currentSustainabilityConfig}
        onChange={handleSustainabilityChange}
      />

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <p className="text-sm text-emerald-900">
          <strong>Optional but Powerful:</strong> Sustainability sukuk activate specialized
          controls (Use of Proceeds Tracking, External Assurance SPO, KPI Reporting). Green
          sukuk aligns with ICMA GBP. Social sukuk supports SDG 1-8. Sustainability-linked
          uses performance targets.
        </p>
      </div>
    </div>
  )
}
