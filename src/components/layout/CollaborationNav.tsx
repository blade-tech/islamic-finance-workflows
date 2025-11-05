'use client'

/**
 * COLLABORATION SUB-NAVIGATION
 * ============================
 * Secondary navigation for the Collaboration section.
 *
 * WHAT THIS DOES:
 * - Provides tab-style navigation within Collaboration pages
 * - Shows active state for current page
 * - Displays unread counts for Tasks, Mentions, and Notifications
 *
 * NAVIGATION ITEMS:
 * 1. Overview - Collaboration Hub landing page
 * 2. Tasks - My Tasks page with status tracking
 * 3. Mentions - Comments where user was @mentioned
 * 4. Notifications - Notification center
 *
 * USAGE:
 * - Automatically shown on all Collaboration section pages
 * - Rendered below primary navigation
 * - Uses shadcn/ui Tabs component for styling
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { LayoutGrid, CheckSquare, AtSign, Bell } from 'lucide-react'

export function CollaborationNav() {
  const pathname = usePathname()

  // Mock counts (will be replaced with real data from API/store)
  const taskCount = 0
  const mentionCount = 0
  const notificationCount = 0

  const navItems = [
    {
      href: '/collaboration',
      label: 'Overview',
      icon: LayoutGrid,
      isActive: pathname === '/collaboration',
      count: null,
    },
    {
      href: '/tasks',
      label: 'Tasks',
      icon: CheckSquare,
      isActive: pathname.startsWith('/tasks'),
      count: taskCount,
    },
    {
      href: '/mentions',
      label: 'Mentions',
      icon: AtSign,
      isActive: pathname.startsWith('/mentions'),
      count: mentionCount,
    },
    {
      href: '/notifications',
      label: 'Notifications',
      icon: Bell,
      isActive: pathname.startsWith('/notifications'),
      count: notificationCount,
    },
  ]

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-6 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-1 py-3 border-b-2 text-sm font-medium transition-colors
                  whitespace-nowrap
                  ${
                    item.isActive
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.count !== null && item.count > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {item.count > 99 ? '99+' : item.count}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
