/**
 * METHODOLOGY SELECTOR TEST PAGE
 * ===============================
 * Standalone test page for methodology selection UI.
 *
 * PURPOSE:
 * - Test methodology backend integration
 * - Verify UI components work with real API data
 * - Separate from main workflow (as requested by user)
 * - Can be "plugged in" to main app later
 *
 * ACCESS:
 * - Navigate to http://localhost:3030/test-methodologies
 */

import { MethodologySelector } from '@/components/workflow/MethodologySelector'

export default function TestMethodologiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Methodology Selection</h1>
        <p className="text-muted-foreground">
          Test page for Hedera Guardian methodology digitization framework integration.
          This component will replace/augment Step 2 in the main workflow.
        </p>
      </div>

      {/* Methodology Selector Component */}
      <MethodologySelector />

      {/* Developer Info */}
      <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
        <p className="font-semibold mb-2">Developer Notes:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Backend endpoint: <code className="bg-background px-1 rounded">GET /api/methodologies</code></li>
          <li>Mock data: 7 Islamic finance methodologies (IIFM, AAOIFI standards)</li>
          <li>Filters: Type, Category, Standard, Status, Search</li>
          <li>Upload functionality: UI only (backend integration pending)</li>
        </ul>
      </div>
    </div>
  )
}
