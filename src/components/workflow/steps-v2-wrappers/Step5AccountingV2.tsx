'use client'

/**
 * STEP 5: ACCOUNTING & REPORTING (V2 Wrapper)
 * ============================================
 * Wrapper for V2 AccountingStep that integrates with main demo Zustand store
 *
 * DATA FLOW:
 * 1. Read current accounting framework and reporting frequency from Zustand store
 * 2. Convert to V2 AccountingConfig format
 * 3. Render V2 AccountingStep component
 * 4. On change, convert V2 data back to main demo format
 * 5. Save to Zustand store using setAccounting and setReportingFrequency
 *
 * MAPPING NOTES:
 * - V2 'AAOIFI' → Main demo 'aaoifi'
 * - V2 'IFRS' → Main demo 'ifrs_islamic'
 * - V2 'Dual' → Main demo 'aaoifi' (AAOIFI takes precedence in dual reporting)
 */

import { useWorkflowStore } from '@/lib/store'
import { AccountingStep } from '@/components/workflow-v2/steps/AccountingStep'
import type { AccountingConfig } from '@/lib/control-engine/types'
import { mapFrameworkToAccountingConfig, mapAccountingConfigToFramework } from '@/lib/v2-adapter'

export function Step5AccountingV2() {
  const execution = useWorkflowStore((state) => state.execution)
  const setAccounting = useWorkflowStore((state) => state.setAccounting)
  const setReportingFrequency = useWorkflowStore((state) => state.setReportingFrequency)

  // Convert main demo AccountingFramework to V2 AccountingConfig
  const currentAccountingConfig: AccountingConfig | undefined = execution?.selectedAccounting
    ? mapFrameworkToAccountingConfig(
        execution.selectedAccounting,
        (execution.reportingFrequency as 'quarterly' | 'semi-annual' | 'annual') || 'quarterly'
      )
    : undefined

  // Handle V2 accounting configuration changes
  const handleAccountingChange = (accountingConfig: AccountingConfig) => {
    // Convert V2 AccountingConfig back to main demo AccountingFramework
    const accountingFramework = mapAccountingConfigToFramework(accountingConfig)

    if (accountingFramework) {
      setAccounting(accountingFramework)
      setReportingFrequency(accountingConfig.reportingFrequency)
    }
  }

  return (
    <div className="space-y-8">
      {/* V2 Accounting Step */}
      <AccountingStep
        value={currentAccountingConfig}
        onChange={handleAccountingChange}
      />

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-900">
          <strong>Accounting Standards Matter:</strong> AAOIFI standards focus on Shariah
          substance and require Shariah audit (GS-3). IFRS focuses on economic substance. Dual
          reporting provides both perspectives but requires reconciliation controls (FR-05).
        </p>
      </div>
    </div>
  )
}
