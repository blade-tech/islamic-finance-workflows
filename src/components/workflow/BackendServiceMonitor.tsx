/**
 * BACKEND SERVICE MONITOR
 * =======================
 * Comprehensive panel showing backend service status and configuration.
 *
 * WHAT THIS SHOWS:
 * - Real-time status of all 5 backend services
 * - Individual MCP server status within MCP Proxy
 * - Service endpoints and what they're used for
 * - Backend URL configuration
 * - Last health check time
 *
 * WHY THIS EXISTS:
 * - Helps backend developers see what services frontend needs
 * - Shows immediate feedback when services connect/disconnect
 * - Documents the pluggable architecture visually
 * - Makes backend requirements transparent
 *
 * USAGE:
 * ```tsx
 * <BackendServiceMonitor isOpen={true} onClose={() => {}} />
 * ```
 */

'use client'

import { useEffect } from 'react'
import { useWorkflowStore } from '@/lib/store'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  HelpCircle,
  Settings,
} from 'lucide-react'
import type { ServiceStatus, ServiceInfo, MCPServerInfo } from '@/lib/service-types'
import { ServiceStatus as ServiceStatusEnum, MCPServerStatus } from '@/lib/service-types'
import { DeveloperSettings } from './DeveloperSettings'

// ============================================================================
// PROPS
// ============================================================================

interface BackendServiceMonitorProps {
  isOpen: boolean
  onClose: () => void
}

// ============================================================================
// STATUS ICONS & COLORS
// ============================================================================

function getStatusIcon(status: ServiceStatus) {
  switch (status) {
    case ServiceStatusEnum.CONNECTED:
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case ServiceStatusEnum.DISCONNECTED:
      return <XCircle className="h-5 w-5 text-red-500" />
    case ServiceStatusEnum.MOCK:
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    case ServiceStatusEnum.CHECKING:
      return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
    default:
      return <HelpCircle className="h-5 w-5 text-gray-400" />
  }
}

function getStatusBadge(status: ServiceStatus) {
  switch (status) {
    case ServiceStatusEnum.CONNECTED:
      return <Badge className="bg-green-500">Connected</Badge>
    case ServiceStatusEnum.DISCONNECTED:
      return <Badge variant="destructive">Disconnected</Badge>
    case ServiceStatusEnum.MOCK:
      return <Badge className="bg-yellow-500">Mock Mode</Badge>
    case ServiceStatusEnum.CHECKING:
      return <Badge className="bg-blue-500">Checking...</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

function getMCPServerStatusBadge(status: MCPServerStatus) {
  switch (status) {
    case MCPServerStatus.AVAILABLE:
      return <Badge className="bg-green-500 text-xs">✓ Available</Badge>
    case MCPServerStatus.NOT_CONFIGURED:
      return <Badge variant="outline" className="text-xs">⚠️ Not configured</Badge>
    case MCPServerStatus.ERROR:
      return <Badge variant="destructive" className="text-xs">✗ Error</Badge>
    default:
      return <Badge variant="outline" className="text-xs">Unknown</Badge>
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

export function BackendServiceMonitor({
  isOpen,
  onClose,
}: BackendServiceMonitorProps) {
  const { servicesStatus, initializeServices, refreshServices } = useWorkflowStore()

  // Initialize services on mount
  useEffect(() => {
    if (!servicesStatus) {
      initializeServices()
    }
  }, [servicesStatus, initializeServices])

  if (!isOpen) return null

  const handleRefresh = async () => {
    await refreshServices()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Backend Services Status</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={!servicesStatus}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
          <CardDescription>
            Monitor real-time connection status to backend services.
            {servicesStatus?.lastGlobalCheck && (
              <span className="block mt-1 text-xs text-muted-foreground">
                Last checked:{' '}
                {new Date(servicesStatus.lastGlobalCheck).toLocaleTimeString()}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <ScrollArea className="flex-1 px-6">
          <CardContent className="space-y-4 pb-6">
            {!servicesStatus ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <p className="text-muted-foreground">Discovering services...</p>
              </div>
            ) : (
              <>
                {/* Backend URL */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Backend URL</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {servicesStatus.backendUrl}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Services List */}
                <Accordion type="multiple" className="w-full">
                  {/* MCP Proxy Service */}
                  <AccordionItem value="mcp">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 flex-1">
                        {getStatusIcon(servicesStatus.mcp.status)}
                        <div className="flex-1 text-left">
                          <p className="font-medium">{servicesStatus.mcp.displayName}</p>
                          <p className="text-xs text-muted-foreground">
                            {servicesStatus.mcp.description}
                          </p>
                        </div>
                        {getStatusBadge(servicesStatus.mcp.status)}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-3">
                        {/* MCP Servers */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium">MCP Servers:</p>
                          {servicesStatus.mcp.servers.map((server: MCPServerInfo) => (
                            <div
                              key={server.name}
                              className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded"
                            >
                              <span className="text-sm">{server.displayName}</span>
                              {getMCPServerStatusBadge(server.status)}
                            </div>
                          ))}
                        </div>

                        {/* Endpoints */}
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Endpoints:</p>
                          {servicesStatus.mcp.endpoints?.map((endpoint) => (
                            <code
                              key={endpoint}
                              className="block text-xs bg-muted px-2 py-1 rounded"
                            >
                              {endpoint}
                            </code>
                          ))}
                        </div>

                        {/* Required For */}
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Required for:</p>
                          {servicesStatus.mcp.requiredFor?.map((step) => (
                            <p key={step} className="text-xs text-muted-foreground">
                              • {step}
                            </p>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Other Services */}
                  {['orchestrator', 'graphiti', 'documents', 'observability'].map(
                    (serviceName) => {
                      const service = servicesStatus[
                        serviceName as keyof typeof servicesStatus
                      ] as ServiceInfo

                      return (
                        <AccordionItem key={serviceName} value={serviceName}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 flex-1">
                              {getStatusIcon(service.status)}
                              <div className="flex-1 text-left">
                                <p className="font-medium">{service.displayName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {service.description}
                                </p>
                              </div>
                              {getStatusBadge(service.status)}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-8 space-y-3">
                              {/* Endpoints */}
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Endpoints:</p>
                                {service.endpoints?.map((endpoint) => (
                                  <code
                                    key={endpoint}
                                    className="block text-xs bg-muted px-2 py-1 rounded"
                                  >
                                    {endpoint}
                                  </code>
                                ))}
                              </div>

                              {/* Required For */}
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Required for:</p>
                                {service.requiredFor?.map((step) => (
                                  <p key={step} className="text-xs text-muted-foreground">
                                    • {step}
                                  </p>
                                ))}
                              </div>

                              {/* Error if exists */}
                              {service.error && (
                                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                                  <p className="text-sm text-red-600 dark:text-red-400">
                                    Error: {service.error}
                                  </p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    }
                  )}
                </Accordion>

                {/* Developer Settings */}
                <div className="mt-6">
                  <DeveloperSettings />
                </div>

                {/* Help Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-6">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        For Backend Developers
                      </p>
                      <p className="text-blue-800 dark:text-blue-200">
                        This panel shows what backend services the frontend needs. When you
                        implement a service, it will automatically turn green. The frontend
                        works in mock mode when services are unavailable.
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        See <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">PLUGGABLE_ARCHITECTURE.md</code> for implementation details.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  )
}
