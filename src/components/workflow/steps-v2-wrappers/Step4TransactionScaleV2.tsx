'use client'

/**
 * STEP 4: TRANSACTION SCALE & VISIBILITY (V2 Wrapper)
 * ====================================================
 * Wrapper for V2 TransactionScaleStep that integrates with main demo Zustand store
 *
 * DATA FLOW:
 * 1. Read current transaction scale from Zustand store (V2 field)
 * 2. Render V2 TransactionScaleStep component
 * 3. On change, save directly to Zustand store using setTransactionScale
 *
 * NOTE: This is a new V2 field with no direct equivalent in original main demo
 */

import { useWorkflowStore } from '@/lib/store'
import { TransactionScaleStep } from '@/components/workflow-v2/steps/TransactionScaleStep'
import type { TransactionScale } from '@/lib/control-engine/types'

export function Step4TransactionScaleV2() {
  const execution = useWorkflowStore((state) => state.execution)
  const setTransactionScale = useWorkflowStore((state) => state.setTransactionScale)

  // Get current transaction scale from store (V2 field)
  const currentTransactionScale: TransactionScale | undefined = execution?.transactionScale

  // Handle V2 transaction scale changes
  const handleTransactionScaleChange = (transactionScale: TransactionScale) => {
    setTransactionScale(transactionScale)
  }

  return (
    <div className="space-y-8">
      {/* V2 Transaction Scale Step */}
      <TransactionScaleStep
        value={currentTransactionScale}
        onChange={handleTransactionScaleChange}
      />

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Why Transaction Scale Matters:</strong> Controls scale with complexity. Large
          transactions (&gt;$50M) trigger external Shariah audit requirements per IFSB-10. Public
          offerings require prospectus disclosure. Listed securities need semi-annual assurance reports.
        </p>
      </div>
    </div>
  )
}
