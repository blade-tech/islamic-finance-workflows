/**
 * DEVELOPER SETTINGS COMPONENT
 * ============================
 * Panel for controlling developer/testing features
 *
 * FEATURES:
 * 1. Developer Mode - Show debug information
 * 2. Disable All Mocks - Fail fast, no fallback data
 * 3. Show API Logs - Console logging for all API calls
 */

'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Code, AlertTriangle, Terminal, Bug } from 'lucide-react'
import { useWorkflowStore } from '@/lib/store'

export function DeveloperSettings() {
  const {
    developerMode,
    disableAllMocks,
    showApiLogs,
    setDeveloperMode,
    setDisableAllMocks,
    setShowApiLogs,
  } = useWorkflowStore()

  return (
    <Card className="border-yellow-500 bg-yellow-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <Code className="h-5 w-5" />
          Developer Settings
        </CardTitle>
        <CardDescription className="text-yellow-700">
          Testing and debugging controls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Developer Mode Toggle */}
        <div className="flex items-center justify-between space-x-4 rounded-lg border border-yellow-300 bg-white p-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="developer-mode" className="text-sm font-medium flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Developer Mode
            </Label>
            <p className="text-xs text-muted-foreground">
              Show additional debug information and technical details
            </p>
          </div>
          <Switch
            id="developer-mode"
            checked={developerMode}
            onCheckedChange={setDeveloperMode}
          />
        </div>

        {/* Disable All Mocks Toggle - DANGER */}
        <div className="flex items-center justify-between space-x-4 rounded-lg border-2 border-red-500 bg-red-50 p-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="disable-mocks" className="text-sm font-medium flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Disable All Mocks
            </Label>
            <p className="text-xs text-red-600 font-semibold">
              ⚠️ FAIL FAST - No fallback data, show real errors only
            </p>
            <p className="text-xs text-muted-foreground">
              Use this to test with real backend services. App will error if services unavailable.
            </p>
          </div>
          <Switch
            id="disable-mocks"
            checked={disableAllMocks}
            onCheckedChange={setDisableAllMocks}
            className="data-[state=checked]:bg-red-600"
          />
        </div>

        {/* Show API Logs Toggle */}
        <div className="flex items-center justify-between space-x-4 rounded-lg border border-yellow-300 bg-white p-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="api-logs" className="text-sm font-medium flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Show API Logs
            </Label>
            <p className="text-xs text-muted-foreground">
              Log all API calls to browser console (✅ success, ❌ error, 🎭 mock)
            </p>
          </div>
          <Switch
            id="api-logs"
            checked={showApiLogs}
            onCheckedChange={setShowApiLogs}
          />
        </div>

        {/* Status Message */}
        {disableAllMocks && (
          <div className="rounded-lg bg-red-100 border border-red-300 p-3 text-xs text-red-700">
            <strong>⚠️ Mock Data Disabled:</strong> Application will fail if backend services are not available.
            This is intended for testing real backend connections.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
