'use client'

/**
 * DASHBOARD LAYOUT
 * ================
 * Navigation and layout for Phase 3 Dashboard pages
 */

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  CheckSquare,
  TrendingUp,
  Sparkles,
  Home,
  Shield,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/islamic-grc-demo/dashboard/my-tasks',
      label: 'My Tasks',
      icon: CheckSquare,
      description: 'Daily, weekly, and monthly tasks',
    },
    {
      href: '/islamic-grc-demo/dashboard/process-tracking',
      label: 'Process Tracking',
      icon: TrendingUp,
      description: 'Monitor workflow progress',
    },
    {
      href: '/islamic-grc-demo/dashboard/controls',
      label: 'Control Library',
      icon: Shield,
      description: 'Browse GRC controls',
    },
    {
      href: '/islamic-grc-demo/dashboard/overview',
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Executive dashboard',
    },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Islamic GRC Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage tasks and track workflow progress
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600">Phase 3: Dashboard</Badge>
              <Link href="/islamic-grc-demo">
                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                  <Home className="h-3 w-3 mr-1" />
                  Back to Config
                </Badge>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Card className="p-2">
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md transition-all
                      ${
                        active
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'hover:bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.label}</span>
                      {!active && (
                        <span className="text-xs text-gray-500">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  )
}
