/**
 * SERVICE STATUS BUTTON
 * ======================
 * Floating button showing aggregated system service status.
 *
 * WHAT THIS DOES:
 * - Shows a compact badge with overall service health
 * - Opens BackendServiceMonitor on click
 * - Displays quick stats (e.g., "3/5 connected")
 * - Fixed position in bottom-right corner
 *
 * WHY THIS EXISTS:
 * - Always-visible indicator of backend connection status
 * - Quick access to detailed service monitor
 * - Helps developers see service status at a glance
 *
 * USAGE:
 * ```tsx
 * <ServiceStatusButton />  // Place in layout.tsx
 * ```
 */

'use client'

import { useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { BackendServiceMonitor } from './BackendServiceMonitor'
import { ServiceStatus } from '@/lib/service-types'

// ============================================================================
// COMPONENT
// ============================================================================

export function ServiceStatusButton() {
  const [isMonitorOpen, setIsMonitorOpen] = useState(false)
  const { servicesStatus } = useWorkflowStore()

  // Calculate aggregated status
  const stats = calculateServiceStats(servicesStatus)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsMonitorOpen(true)}
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Open system services monitor"
      >
        <div className="flex items-center gap-2 bg-background border border-border rounded-full shadow-lg px-4 py-2.5 hover:shadow-xl transition-all hover:scale-105">
          {/* Status Icon */}
          {stats.allConnected ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : stats.allDisconnected ? (
            <XCircle className="h-5 w-5 text-red-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          )}

          {/* Stats Badge */}
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {stats.connected}/{stats.total}
            </span>
          </div>

          {/* Status Text */}
          {stats.allConnected ? (
            <Badge className="bg-green-500">All Services</Badge>
          ) : stats.allDisconnected ? (
            <Badge variant="destructive">No Services</Badge>
          ) : stats.someMock ? (
            <Badge className="bg-yellow-500">Mock Mode</Badge>
          ) : (
            <Badge variant="outline">Partial</Badge>
          )}
        </div>

        {/* Tooltip on hover */}
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-popover text-popover-foreground text-xs rounded-md px-3 py-2 shadow-md whitespace-nowrap">
            Click to view service details
          </div>
        </div>
      </button>

      {/* Service Monitor Modal */}
      <BackendServiceMonitor
        isOpen={isMonitorOpen}
        onClose={() => setIsMonitorOpen(false)}
      />
    </>
  )
}

// ============================================================================
// UTILITIES
// ============================================================================

interface ServiceStats {
  total: number
  connected: number
  disconnected: number
  mock: number
  checking: number
  allConnected: boolean
  allDisconnected: boolean
  someMock: boolean
}

function calculateServiceStats(servicesStatus: any): ServiceStats {
  if (!servicesStatus) {
    return {
      total: 5,
      connected: 0,
      disconnected: 5,
      mock: 0,
      checking: 0,
      allConnected: false,
      allDisconnected: true,
      someMock: false,
    }
  }

  const services = [
    servicesStatus.mcp,
    servicesStatus.orchestrator,
    servicesStatus.graphiti,
    servicesStatus.documents,
    servicesStatus.observability,
  ]

  const stats = {
    total: services.length,
    connected: 0,
    disconnected: 0,
    mock: 0,
    checking: 0,
  }

  services.forEach((service) => {
    switch (service.status) {
      case ServiceStatus.CONNECTED:
        stats.connected++
        break
      case ServiceStatus.DISCONNECTED:
        stats.disconnected++
        break
      case ServiceStatus.MOCK:
        stats.mock++
        break
      case ServiceStatus.CHECKING:
        stats.checking++
        break
    }
  })

  return {
    ...stats,
    allConnected: stats.connected === stats.total,
    allDisconnected: stats.disconnected === stats.total,
    someMock: stats.mock > 0,
  }
}
