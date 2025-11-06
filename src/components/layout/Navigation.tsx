'use client'

/**
 * GLOBAL NAVIGATION - ROLE-BASED STRUCTURE
 * =========================================
 * Top navigation bar with role-based sections for different user types.
 *
 * NAVIGATION STRUCTURE (BY ROLE):
 * 1. 🌟 Get Started    → /welcome           [All Users] - Onboarding
 * 2. 🏠 Workflow       → /                  [Creators] - 11-step deal creation
 * 3. 📊 Dashboard      → /dashboard         [Managers] - Compliance monitoring
 * 4. 🛡️  Deals         → /deals             [Operators] - Deal lifecycle management
 * 5. 💼 Digital Assets → /digital-assets    [Treasury/Finance] - Certificates & tokens
 * 6. 👥 Collaboration  → /collaboration     [All Roles] - Tasks & mentions
 * 7. 🔔 Notifications  → /notifications     [All Users] - Notification center
 *
 * ROLE SEPARATION:
 * - Creators: Build new workflows
 * - Managers: Monitor compliance metrics
 * - Operators: Manage active deals
 * - Treasury/Finance: Oversee digital assets
 *
 * DESIGN:
 * - Clean, minimal design with proper hierarchy
 * - Fixed at top of viewport
 * - Active state highlighting
 * - Uses shadcn/ui components for consistency
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LayoutDashboard, Home, Users, Bell, Sparkles, ShieldCheck, Wallet, PlayCircle } from 'lucide-react'
import { useTour } from '@/hooks/useTour'

export function Navigation() {
  const pathname = usePathname()
  const { resetTour } = useTour()

  // Determine active section
  const isWelcomeActive = pathname === '/welcome'
  const isWorkflowActive = pathname === '/'
  const isDashboardActive = pathname.startsWith('/dashboard')
  const isDealsActive = pathname.startsWith('/deals')
  const isDigitalAssetsActive = pathname.startsWith('/digital-assets')
  const isCollaborationActive = pathname.startsWith('/collaboration') ||
                                pathname.startsWith('/tasks') ||
                                pathname.startsWith('/mentions') ||
                                pathname.startsWith('/notifications')

  // Mock unread count (will be replaced with real data)
  const unreadNotifications = 0

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* App Title */}
        <Link href="/" className="flex items-center space-x-2 mr-8">
          <span className="text-xl font-bold">ZeroH</span>
        </Link>

        {/* Primary Navigation Links */}
        <div className="flex items-center space-x-1 flex-1">
          <Button
            variant={isWelcomeActive ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link href="/welcome">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Get Started</span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetTour}
            title="Restart Product Tour"
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tour</span>
          </Button>

          <Button
            variant={isWorkflowActive ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Workflow</span>
            </Link>
          </Button>

          <Button
            variant={isDashboardActive ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>

          <Button
            variant={isDealsActive ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link href="/deals">
              <ShieldCheck className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Deals</span>
            </Link>
          </Button>

          <Button
            variant={isDigitalAssetsActive ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link href="/digital-assets">
              <Wallet className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Digital Assets</span>
            </Link>
          </Button>

          <Button
            variant={isCollaborationActive ? 'default' : 'ghost'}
            size="sm"
            asChild
          >
            <Link href="/collaboration">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Collaboration</span>
            </Link>
          </Button>
        </div>

        {/* Notification Bell */}
        <div className="flex items-center ml-auto">
          <Button
            variant="ghost"
            size="sm"
            className="relative"
            asChild
          >
            <Link href="/notifications">
              <Bell className="h-4 w-4" />
              {unreadNotifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
