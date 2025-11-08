/**
 * AI-NATIVE GRC LAYOUT
 * Layout for AI-native compliance demo
 * Provides navigation between 6 core screens
 */

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, CheckSquare, Building2, FileText, GitBranch, Shield } from 'lucide-react'

export default function AILayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/ai-native', icon: Home, description: 'Dashboard overview' },
    { name: 'My Tasks', href: '/ai-native/tasks', icon: CheckSquare, description: 'Agent inbox' },
    { name: 'Deals', href: '/ai-native/deals', icon: Building2, description: 'Deal compliance' },
    { name: 'Evidence', href: '/ai-native/evidence', icon: FileText, description: 'Evidence vault' },
    { name: 'Workflows', href: '/ai-native/workflows', icon: GitBranch, description: 'Execution log' },
    { name: 'Trust Portal', href: '/ai-native/trust-portal', icon: Shield, description: 'Customer view' },
  ]

  const isActive = (href: string) => {
    if (href === '/ai-native') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  ZeroH AI-Native GRC
                </h1>
                <p className="text-xs text-gray-500">
                  Agentic Compliance for Islamic Finance
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${active
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              AI-Native GRC Demo • Powered by Claude 3.5 Sonnet + Hedera Guardian
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>26 Controls</span>
              <span>•</span>
              <span>5 Deals</span>
              <span>•</span>
              <span>15 VCs Minted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
