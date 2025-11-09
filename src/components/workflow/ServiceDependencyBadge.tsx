/**
 * SERVICE DEPENDENCY BADGE
 * ========================
 * Shows which system services a feature requires.
 * Displays real-time status indicators next to each service.
 *
 * USAGE:
 * <ServiceDependencyBadge services={['graphiti', 'documents']} />
 * <ServiceDependencyBadge services={['graphiti', 'documents']} specialTags={['R&D Phase']} />
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Loader2, AlertCircle, Beaker, HelpCircle } from 'lucide-react'
import { useWorkflowStore } from '@/lib/store'
import { ServiceStatus, type ServiceName } from '@/lib/service-types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Special tag types (not system services)
export type SpecialTag = 'R&D Phase' | 'Unknown'

interface ServiceDependencyBadgeProps {
  /** List of required services */
  services: ServiceName[]
  /** Special workflow tags (R&D Phase, Unknown, etc.) */
  specialTags?: SpecialTag[]
  /** Show inline (default: true) */
  inline?: boolean
  /** Additional CSS classes */
  className?: string
}

export function ServiceDependencyBadge({
  services,
  specialTags = [],
  inline = true,
  className = '',
}: ServiceDependencyBadgeProps) {
  const servicesStatus = useWorkflowStore((state) => state.servicesStatus)

  if (services.length === 0 && specialTags.length === 0) return null

  const serviceDisplayNames: Record<ServiceName, string> = {
    mcp: 'MCP',
    orchestrator: 'Orchestrator',
    graphiti: 'Graphiti',
    documents: 'Documents',
    observability: 'Traces',
  }

  const serviceDescriptions: Record<ServiceName, string> = {
    mcp: 'Model Context Protocol - enables communication between AI copilots and your tools/services',
    orchestrator: 'Orchestrator service - coordinates workflow execution and manages Claude interactions',
    graphiti: 'Graphiti service - knowledge graph database for storing and retrieving structured information',
    documents: 'Documents service - handles document parsing, storage, and semantic search',
    observability: 'Observability service - provides execution traces and monitoring via Langfuse',
  }

  const getStatusIcon = (serviceName: ServiceName) => {
    if (!servicesStatus) return <Loader2 className="h-3 w-3 animate-spin text-gray-400" />

    const service = servicesStatus[serviceName]
    if (!service) return <XCircle className="h-3 w-3 text-gray-400" />

    switch (service.status) {
      case ServiceStatus.CONNECTED:
        return <CheckCircle2 className="h-3 w-3 text-green-600" />
      case ServiceStatus.CHECKING:
        return <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
      case ServiceStatus.MOCK:
        return <AlertCircle className="h-3 w-3 text-yellow-600" />
      case ServiceStatus.DISCONNECTED:
      default:
        return <XCircle className="h-3 w-3 text-red-600" />
    }
  }

  const getStatusColor = (serviceName: ServiceName) => {
    if (!servicesStatus) return 'bg-gray-100 border-gray-300 text-gray-700'

    const service = servicesStatus[serviceName]
    if (!service) return 'bg-gray-100 border-gray-300 text-gray-700'

    switch (service.status) {
      case ServiceStatus.CONNECTED:
        return 'bg-green-50 border-green-300 text-green-800'
      case ServiceStatus.CHECKING:
        return 'bg-blue-50 border-blue-300 text-blue-800'
      case ServiceStatus.MOCK:
        return 'bg-yellow-50 border-yellow-300 text-yellow-800'
      case ServiceStatus.DISCONNECTED:
      default:
        return 'bg-red-50 border-red-300 text-red-800'
    }
  }

  // Special tag helpers
  const specialTagDisplayNames: Record<SpecialTag, string> = {
    'R&D Phase': 'R&D Phase',
    'Unknown': 'Unknown',
  }

  const specialTagDescriptions: Record<SpecialTag, string> = {
    'R&D Phase': 'Experimental workflow - may have incomplete features or documentation',
    'Unknown': 'Custom workflows may require additional services based on your specific needs',
  }

  const getSpecialTagIcon = (tag: SpecialTag) => {
    switch (tag) {
      case 'R&D Phase':
        return <Beaker className="h-3 w-3 text-purple-600" />
      case 'Unknown':
        return <HelpCircle className="h-3 w-3 text-gray-600" />
    }
  }

  const getSpecialTagColor = (tag: SpecialTag) => {
    switch (tag) {
      case 'R&D Phase':
        return 'bg-purple-50 border-purple-300 text-purple-800'
      case 'Unknown':
        return 'bg-gray-50 border-gray-300 text-gray-700'
    }
  }

  if (!inline) {
    // Block layout with labels
    return (
      <TooltipProvider>
        <div className={`space-y-2 ${className}`}>
          <p className="text-xs font-medium text-muted-foreground">Required Services:</p>
          <div className="flex flex-wrap gap-2">
            {/* Service Badges with Tooltips */}
            {services.map((serviceName) => (
              <Tooltip key={serviceName}>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(serviceName)} flex items-center gap-1.5 cursor-help`}
                  >
                    {getStatusIcon(serviceName)}
                    {serviceDisplayNames[serviceName]}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{serviceDescriptions[serviceName]}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            {/* Special Tags with Tooltips */}
            {specialTags.map((tag) => (
              <Tooltip key={tag}>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className={`${getSpecialTagColor(tag)} flex items-center gap-1.5 cursor-help`}
                  >
                    {getSpecialTagIcon(tag)}
                    {specialTagDisplayNames[tag]}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{specialTagDescriptions[tag]}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>
    )
  }

  // Inline compact layout
  return (
    <TooltipProvider>
      <div className={`flex flex-wrap gap-1.5 ${className}`}>
        {/* Service Badges with Tooltips */}
        {services.map((serviceName) => (
          <Tooltip key={serviceName}>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={`${getStatusColor(serviceName)} flex items-center gap-1 text-xs px-2 py-0.5 cursor-help`}
              >
                {getStatusIcon(serviceName)}
                <span className="text-xs">{serviceDisplayNames[serviceName]}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{serviceDescriptions[serviceName]}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {/* Special Tags with Tooltips */}
        {specialTags.map((tag) => (
          <Tooltip key={tag}>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={`${getSpecialTagColor(tag)} flex items-center gap-1 text-xs px-2 py-0.5 cursor-help`}
              >
                {getSpecialTagIcon(tag)}
                <span className="text-xs">{specialTagDisplayNames[tag]}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{specialTagDescriptions[tag]}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
