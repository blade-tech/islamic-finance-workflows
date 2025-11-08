'use client'

/**
 * STEP 2: REGULATORY JURISDICTION (V2 Wrapper)
 * =============================================
 * Wrapper for V2 JurisdictionStep that integrates with main demo Zustand store
 *
 * DATA FLOW:
 * 1. Read current jurisdiction from Zustand store
 * 2. Convert to V2 JurisdictionConfig format
 * 3. Render V2 JurisdictionStep component
 * 4. On change, convert V2 data back to main demo format
 * 5. Save to Zustand store using setJurisdiction, setCrossBorder, setAdditionalJurisdictions
 */

import { useWorkflowStore } from '@/lib/store'
import { JurisdictionStep } from '@/components/workflow-v2/steps/JurisdictionStep'
import { DocumentUploadMock } from '@/components/workflow-v2/DocumentUploadMock'
import type { JurisdictionConfig } from '@/lib/control-engine/types'
import { mapJurisdictionToConfig, mapJurisdictionConfigToJurisdiction } from '@/lib/v2-adapter'

export function Step2JurisdictionV2() {
  const execution = useWorkflowStore((state) => state.execution)
  const setJurisdiction = useWorkflowStore((state) => state.setJurisdiction)
  const setCrossBorder = useWorkflowStore((state) => state.setCrossBorder)
  const setAdditionalJurisdictions = useWorkflowStore((state) => state.setAdditionalJurisdictions)

  // Convert main demo Jurisdiction to V2 JurisdictionConfig
  const currentJurisdictionConfig: JurisdictionConfig | undefined = execution?.selectedJurisdiction
    ? mapJurisdictionToConfig(
        execution.selectedJurisdiction,
        execution.crossBorder || false,
        [] // Additional jurisdictions will be mapped separately
      )
    : undefined

  // Handle V2 jurisdiction selection
  const handleJurisdictionChange = (jurisdictionConfig: JurisdictionConfig) => {
    // Convert V2 config back to main demo Jurisdiction
    const jurisdiction = mapJurisdictionConfigToJurisdiction(jurisdictionConfig)

    if (jurisdiction) {
      setJurisdiction(jurisdiction)
      setCrossBorder(jurisdictionConfig.crossBorder)

      // Map additional jurisdictions if present
      if (jurisdictionConfig.additional && jurisdictionConfig.additional.length > 0) {
        const additionalJurisdictions = jurisdictionConfig.additional
          .map(j => mapJurisdictionConfigToJurisdiction({ primary: j, additional: [], crossBorder: false }))
          .filter((j): j is NonNullable<typeof j> => j !== null)

        setAdditionalJurisdictions(additionalJurisdictions)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* V2 Jurisdiction Step */}
      <JurisdictionStep
        value={currentJurisdictionConfig}
        onChange={handleJurisdictionChange}
      />

      {/* Document Upload Section (from V2 Step 1) */}
      <div className="pt-8 border-t">
        <DocumentUploadMock />
      </div>

      {/* Helper Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Why Jurisdiction First?</strong> GRC-aligned workflow starts with regulatory context.
          Your jurisdiction selection will filter available product structures based on prohibitions
          (e.g., Malaysia prohibits Bay Al-Inah and Organized Tawarruq).
        </p>
      </div>
    </div>
  )
}
