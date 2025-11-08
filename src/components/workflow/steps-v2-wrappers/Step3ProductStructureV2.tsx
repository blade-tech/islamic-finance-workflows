'use client'

/**
 * STEP 3: PRODUCT STRUCTURE SELECTION (V2 Wrapper)
 * =================================================
 * Wrapper for V2 ProductStructureStep that integrates with main demo Zustand store
 *
 * DATA FLOW:
 * 1. Read current Shariah structure and securitization flag from Zustand store
 * 2. Convert to V2 ProductStructure format
 * 3. Render V2 ProductStructureStep component (with jurisdiction-based filtering)
 * 4. On change, convert V2 data back to main demo format
 * 5. Save to Zustand store using setShariahStructure and setIsSecuritized
 *
 * NOTE: V2 ProductStructureStep already includes jurisdiction prohibition warnings
 */

import { useWorkflowStore } from '@/lib/store'
import { ProductStructureStep } from '@/components/workflow-v2/steps/ProductStructureStep'
import type { ProductStructure } from '@/lib/control-engine/types'
import { mapShariahToProductStructure, mapProductStructureToShariah } from '@/lib/v2-adapter'

export function Step3ProductStructureV2() {
  const execution = useWorkflowStore((state) => state.execution)
  const setShariahStructure = useWorkflowStore((state) => state.setShariahStructure)
  const setIsSecuritized = useWorkflowStore((state) => state.setIsSecuritized)

  // Convert main demo Shariah structure to V2 ProductStructure
  const currentProductStructure: ProductStructure | undefined =
    execution?.selectedShariahStructure
      ? mapShariahToProductStructure(
          execution.selectedShariahStructure,
          execution.isSecuritized
        )
      : undefined

  // Get jurisdiction for prohibition filtering
  const jurisdiction = execution?.selectedJurisdiction
    ? (() => {
        // Map main demo jurisdiction ID to V2 jurisdiction name
        const jurisdictionMap: Record<string, 'Malaysia' | 'Saudi Arabia' | 'UAE' | 'Qatar' | 'Bahrain' | 'Other'> = {
          'malaysia_sc': 'Malaysia',
          'saudi_cma': 'Saudi Arabia',
          'uae_dfsa': 'UAE',
          'qatar_qfc': 'Qatar',
          'bahrain': 'Bahrain',
          'luxembourg': 'Other'
        }
        return jurisdictionMap[execution.selectedJurisdiction.id] || 'Other'
      })()
    : undefined

  // Handle V2 product structure selection
  const handleProductStructureChange = (productStructure: ProductStructure) => {
    // Convert V2 ProductStructure back to main demo Shariah structure
    const shariahStructure = mapProductStructureToShariah(productStructure)

    if (shariahStructure) {
      setShariahStructure(shariahStructure)
      setIsSecuritized(productStructure.category === 'sukuk')
    }
  }

  return (
    <div className="space-y-8">
      {/* V2 Product Structure Step (includes prohibition warnings) */}
      <ProductStructureStep
        value={currentProductStructure}
        onChange={handleProductStructureChange}
        jurisdiction={jurisdiction}
      />

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-sm text-purple-900">
          <strong>Jurisdiction Filtering:</strong> Product structures prohibited by your selected
          jurisdiction are automatically flagged. For example, Malaysia prohibits Bay Al-Inah and
          Organized Tawarruq per Securities Commission guidelines.
        </p>
      </div>
    </div>
  )
}
