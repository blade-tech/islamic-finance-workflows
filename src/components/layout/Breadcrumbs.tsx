/**
 * BREADCRUMBS COMPONENT
 * ======================
 * Dynamic navigation breadcrumbs for hierarchical page navigation.
 *
 * Features:
 * - Dynamic breadcrumb generation based on route
 * - Clickable navigation up hierarchy
 * - Truncation for long names
 * - Responsive design
 * - Current page indicator (non-clickable)
 *
 * Usage:
 * <Breadcrumbs
 *   items={[
 *     { label: 'Dashboard', href: '/dashboard' },
 *     { label: 'Deals', href: '/deals' },
 *     { label: 'UAE Sukuk Ijara' } // Current page (no href)
 *   ]}
 * />
 */

'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

export interface BreadcrumbItem {
  label: string
  href?: string
  truncate?: boolean
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Breadcrumbs({ items, showHome = true, className }: BreadcrumbsProps) {
  // If no items, don't render
  if (!items || items.length === 0) {
    return null
  }

  // Helper to truncate long text
  const truncateText = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm', className)}
    >
      {/* Home Link (optional) */}
      {showHome && (
        <>
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </>
      )}

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const displayLabel = item.truncate
          ? truncateText(item.label)
          : item.label

        return (
          <div key={index} className="flex items-center space-x-2">
            {/* Breadcrumb Link or Text */}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                title={item.label}
              >
                {displayLabel}
              </Link>
            ) : (
              <span
                className={cn(
                  'font-medium',
                  isLast
                    ? 'text-gray-900'
                    : 'text-gray-600 cursor-not-allowed'
                )}
                title={item.label}
                aria-current={isLast ? 'page' : undefined}
              >
                {displayLabel}
              </span>
            )}

            {/* Separator */}
            {!isLast && (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
        )
      })}
    </nav>
  )
}

// ============================================================================
// HELPER: Generate Breadcrumbs from Path
// ============================================================================

/**
 * Generate breadcrumb items from a Next.js pathname
 *
 * @param pathname - Current pathname from usePathname()
 * @param labels - Optional custom labels for path segments
 *
 * @example
 * const pathname = '/deals/deal-001/contracts/contract-123'
 * const breadcrumbs = generateBreadcrumbs(pathname, {
 *   'deal-001': 'UAE Sukuk Ijara',
 *   'contract-123': 'Master Agreement'
 * })
 * // Returns: [
 * //   { label: 'Deals', href: '/deals' },
 * //   { label: 'UAE Sukuk Ijara', href: '/deals/deal-001' },
 * //   { label: 'Contracts', href: '/deals/deal-001/contracts' },
 * //   { label: 'Master Agreement' }
 * // ]
 */
export function generateBreadcrumbs(
  pathname: string,
  labels?: Record<string, string>
): BreadcrumbItem[] {
  // Remove trailing slash and split
  const segments = pathname
    .replace(/\/$/, '')
    .split('/')
    .filter(Boolean)

  // Build breadcrumb items
  const items: BreadcrumbItem[] = []
  let currentPath = ''

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1

    // Get custom label or format segment
    const label = labels?.[segment] || formatSegment(segment)

    items.push({
      label,
      href: isLast ? undefined : currentPath,
      truncate: label.length > 30
    })
  })

  return items
}

/**
 * Format a path segment into a readable label
 */
function formatSegment(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// ============================================================================
// PRESET BREADCRUMBS
// ============================================================================

/**
 * Common breadcrumb presets for frequently used routes
 */
export const BreadcrumbPresets = {
  /**
   * Deal Detail breadcrumbs
   */
  dealDetail: (dealId: string, dealName?: string) => [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Deals', href: '/dashboard' },
    { label: dealName || dealId, truncate: true }
  ],

  /**
   * Contract Collaboration breadcrumbs
   */
  contractCollaboration: (
    contractId: string,
    dealId?: string,
    dealName?: string,
    contractName?: string
  ) => {
    const items: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/dashboard' }
    ]

    if (dealId && dealName) {
      items.push(
        { label: 'Deals', href: '/dashboard' },
        { label: dealName, href: `/deals/${dealId}`, truncate: true }
      )
    }

    items.push({
      label: contractName || contractId,
      truncate: true
    })

    return items
  },

  /**
   * Component Tab breadcrumbs (for Deal Detail tabs)
   */
  componentTab: (
    dealId: string,
    dealName: string,
    componentName: string
  ) => [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Deals', href: '/dashboard' },
    { label: dealName, href: `/deals/${dealId}`, truncate: true },
    { label: componentName }
  ],

  /**
   * Tasks page breadcrumbs
   */
  tasks: () => [
    { label: 'Collaboration', href: '/collaboration' },
    { label: 'My Tasks' }
  ],

  /**
   * Mentions page breadcrumbs
   */
  mentions: () => [
    { label: 'Collaboration', href: '/collaboration' },
    { label: 'My Mentions' }
  ],

  /**
   * Notifications page breadcrumbs
   */
  notifications: () => [
    { label: 'Collaboration', href: '/collaboration' },
    { label: 'Notifications' }
  ]
}
