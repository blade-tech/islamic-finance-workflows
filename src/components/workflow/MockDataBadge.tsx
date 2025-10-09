/**
 * MOCK DATA BADGE COMPONENT
 * =========================
 * Visual indicator for mock/simulated data
 *
 * CRITICAL: Mock data is dangerous for testing!
 * This component ensures explicit transparency about data sources.
 *
 * TWO VARIANTS:
 * 1. Inline Badge - Small badge next to content
 * 2. Banner Alert - Full-width alert at top of section
 */

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'

interface MockDataBadgeProps {
  /** Show the badge (default: true) */
  visible?: boolean
  /** Inline badge vs full banner (default: false = banner) */
  inline?: boolean
  /** Custom message for banner variant */
  message?: string
  /** Additional CSS classes */
  className?: string
}

export function MockDataBadge({
  visible = true,
  inline = false,
  message = 'This data is simulated for demonstration. Backend service not available.',
  className = '',
}: MockDataBadgeProps) {
  if (!visible) return null

  if (inline) {
    return (
      <Badge
        variant="outline"
        className={`bg-yellow-50 border-yellow-500 text-yellow-700 font-mono text-xs ${className}`}
      >
        🎭 MOCK DATA
      </Badge>
    )
  }

  // Banner variant
  return (
    <Alert variant="default" className={`border-yellow-500 bg-yellow-50 mb-4 ${className}`}>
      <AlertCircle className="h-4 w-4 text-yellow-700" />
      <AlertTitle className="text-yellow-800 font-semibold">🎭 Using Mock Data</AlertTitle>
      <AlertDescription className="text-yellow-700">{message}</AlertDescription>
    </Alert>
  )
}
