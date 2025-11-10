'use client'

/**
 * AI-NATIVE GRC UX PROTOTYPE - VANTA-STYLE CATEGORIES PAGE
 * =========================================================
 * Three-panel layout inspired by Vanta's compliance dashboard structure
 * while maintaining Islamic GRC's colorful, engaging visual design.
 *
 * LAYOUT STRUCTURE:
 * - Left Sidebar: Category navigation with search and filters
 * - Main Content: Controls list with completion metrics and expandable rows
 * - Right Sidebar: Audit timeline and compliance metrics
 *
 * DESIGN PHILOSOPHY:
 * - Vanta's clean organization + Islamic Finance's visual richness
 * - Collapsed/expandable categories for better information hierarchy
 * - Aggregate completion metrics at the top
 * - Tab navigation for different views
 *
 * CATEGORIES:
 * 1. Capital Verification (1 control)
 * 2. Profit-Sharing Compliance (2 controls, 1 hard gate)
 * 3. Mudarib Conduct Monitoring (3 controls)
 * 4. Liability & Trust Assessment (1 control)
 * 5. Termination & Liquidation (1 control)
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  DollarSign,
  FileText,
  FileX,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import {
  mudarabahCategories,
  mudarabahControls,
  getControlsByCategory
} from '@/lib/mock-data/mudarabah-controls'

export default function AIGRCCategoriesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'controls' | 'updates'>('controls')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['cat-capital', 'cat-profit'])

  // Calculate completion metrics
  const totalControls = mudarabahControls.length
  const passingControls = 7 // Mock: 7 out of 8 passing (one hard gate needs attention)
  const completionPercentage = Math.round((passingControls / totalControls) * 100)
  const hardGateControls = mudarabahControls.filter(c => c.isHardGate)

  const getIconForCategory = (iconName: string) => {
    const icons: Record<string, any> = {
      DollarSign,
      TrendingUp,
      Shield,
      AlertTriangle,
      FileX
    }
    return icons[iconName] || DollarSign
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string; icon: string; badge: string }> = {
      blue: {
        border: 'border-blue-300',
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700 border-blue-300'
      },
      green: {
        border: 'border-green-300',
        bg: 'bg-green-50',
        text: 'text-green-900',
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-700 border-green-300'
      },
      purple: {
        border: 'border-purple-300',
        bg: 'bg-purple-50',
        text: 'text-purple-900',
        icon: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-700 border-purple-300'
      },
      orange: {
        border: 'border-orange-300',
        bg: 'bg-orange-50',
        text: 'text-orange-900',
        icon: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-700 border-orange-300'
      },
      red: {
        border: 'border-red-300',
        bg: 'bg-red-50',
        text: 'text-red-900',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-700 border-red-300'
      }
    }
    return colors[color] || colors.blue
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Top Header with Navigation */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mudarabah Compliance</h1>
                <p className="text-sm text-gray-600">AAOIFI SS-13 • Qatar (QCB + QFCRA)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Phase 2: Requirements</span>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/ai-grc-prototype')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Control
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-6 border-b -mb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('controls')}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'controls'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Controls
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'updates'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Updates
              <Badge className="ml-2 bg-purple-100 text-purple-700 text-xs">2</Badge>
            </button>
          </div>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex h-[calc(100vh-180px)]">
        {/* LEFT SIDEBAR - Category Navigation */}
        <div className="w-64 border-r bg-white overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            {/* Filter Header */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Requirement Categories
              </h3>

              {/* Category List */}
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === null
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Categories ({mudarabahCategories.length})
                </button>

                {mudarabahCategories.map((category) => {
                  const colors = getColorClasses(category.color)
                  const IconComponent = getIconForCategory(category.icon)

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? `${colors.bg} ${colors.text} font-medium`
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-4 w-4 ${colors.icon}`} />
                          <span className="truncate">{category.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{category.controlCount}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT - Controls List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Completion Metrics */}
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-purple-900 mb-1">Controls</h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-4xl font-bold text-purple-900">{completionPercentage}%</span>
                      <span className="text-sm text-purple-700">of controls have passing evidence</span>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-3">
                      {/* Automated Tests Progress */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-purple-700 font-medium">Automated tests</span>
                          <span className="text-purple-600">{passingControls}/{totalControls} • {completionPercentage}%</span>
                        </div>
                        <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Documents Progress */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-purple-700 font-medium">Documents</span>
                          <span className="text-purple-600">6/8 • 75%</span>
                        </div>
                        <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                            style={{ width: '75%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Control Count */}
                  <div className="text-center ml-8">
                    <div className="text-5xl font-bold text-purple-900">{passingControls}</div>
                    <div className="text-sm text-purple-700 font-medium">/ {totalControls} total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls by Category - Collapsed/Expandable */}
            <div className="space-y-3">
              {mudarabahCategories
                .filter(cat => !selectedCategory || cat.id === selectedCategory)
                .map((category, index) => {
                  const controls = getControlsByCategory(category.id)
                  const colors = getColorClasses(category.color)
                  const IconComponent = getIconForCategory(category.icon)
                  const isExpanded = expandedCategories.includes(category.id)

                  // Mock control status
                  const passingCount = category.id === 'cat-profit' ? 1 : controls.length
                  const statusText = `${passingCount}/${controls.length} controls OK`

                  return (
                    <Card key={category.id} className="border-2 transition-shadow hover:shadow-md">
                      {/* Category Header - Collapsible */}
                      <div
                        onClick={() => toggleCategory(category.id)}
                        className="cursor-pointer"
                      >
                        <CardHeader className={`${colors.bg} border-b ${colors.border}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center border-2 ${colors.border}`}>
                                <IconComponent className={`h-5 w-5 ${colors.icon}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <CardTitle className={`text-base ${colors.text}`}>
                                    {category.name}
                                  </CardTitle>
                                  <Badge className={`${colors.badge} border text-xs`}>
                                    {statusText}
                                  </Badge>
                                </div>
                                <CardDescription className="text-xs mt-0.5">
                                  {category.description}
                                </CardDescription>
                              </div>
                            </div>

                            {isExpanded ? (
                              <ChevronDown className={`h-5 w-5 ${colors.icon}`} />
                            ) : (
                              <ChevronRight className={`h-5 w-5 ${colors.icon}`} />
                            )}
                          </div>
                        </CardHeader>
                      </div>

                      {/* Expanded Controls List */}
                      {isExpanded && (
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            {controls.map((control) => (
                              <Card
                                key={control.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  control.isHardGate ? 'border-2 border-red-400 bg-red-50' : 'border border-gray-200'
                                }`}
                                onClick={() => router.push(`/ai-grc-prototype/control/${control.id}`)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-gray-900 text-sm">{control.name}</h4>
                                        {control.isHardGate && (
                                          <Badge className="bg-red-600 text-white text-xs">
                                            <Lock className="h-3 w-3 mr-1" />
                                            HARD GATE
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{control.description}</p>
                                      <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                          <Shield className="h-3 w-3" />
                                          <span>{control.aaoifiSection}</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                          {control.frequency}
                                        </Badge>
                                      </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Audit Timeline & Metrics */}
        <div className="w-80 border-l bg-white overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Audit Timeline */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Audit Timeline</h3>
                <Button variant="ghost" size="sm" className="text-xs text-purple-600">
                  View audits
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-700">
                  No audit scheduled. Contact your auditor to enter a date.
                </p>
              </div>

              {/* Timeline visualization */}
              <div className="mt-4 relative">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Now</span>
                  <span>Jan</span>
                  <span>Mar</span>
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full relative">
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-purple-600 rounded-full" style={{ left: '0%' }} />
                </div>
              </div>
            </div>

            {/* Hard Gates Alert */}
            {hardGateControls.length > 0 && (
              <Card className="border-2 border-red-300 bg-red-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-sm text-red-900">Hard Gates</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-red-700 mb-3">
                    These controls BLOCK workflow progression if they fail
                  </p>
                  {hardGateControls.map(control => (
                    <div
                      key={control.id}
                      onClick={() => router.push(`/ai-grc-prototype/control/${control.id}`)}
                      className="bg-white border-2 border-red-300 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <h4 className="text-xs font-semibold text-red-900 mb-1">{control.name}</h4>
                      <p className="text-xs text-red-700">{control.aaoifiSection}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Configuration Tags */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-purple-900">Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span className="text-purple-700">Qatar (QCB + QFCRA)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span className="text-purple-700">Mudarabah (Profit-Sharing)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span className="text-purple-700">AAOIFI SS-13</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-purple-600" />
                    <span className="text-purple-700">Green Sukuk</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-900">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-900">Contract-Specific</p>
                      <p className="text-xs text-blue-700">Controls from AAOIFI SS-13 Mudarabah</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-900">Hard Gates</p>
                      <p className="text-xs text-blue-700">Capital Maintenance blocks profit distribution</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-900">AI Assistant</p>
                      <p className="text-xs text-blue-700">Each task has dedicated AI helper (HITL)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
