'use client'

/**
 * AI-NATIVE GRC UX PROTOTYPE - CATEGORIES PAGE
 * =============================================
 * Shows 5 Mudarabah-specific control categories with 8 controls total.
 * Controls are organized by AAOIFI SS-13 sections.
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
  DollarSign,
  FileX,
  Lock,
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['cat-capital'])

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
    const colors: Record<string, { border: string; bg: string; text: string; icon: string }> = {
      blue: { border: 'border-blue-300', bg: 'bg-blue-50', text: 'text-blue-900', icon: 'text-blue-600' },
      green: { border: 'border-green-300', bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-600' },
      purple: { border: 'border-purple-300', bg: 'bg-purple-50', text: 'text-purple-900', icon: 'text-purple-600' },
      orange: { border: 'border-orange-300', bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-600' },
      red: { border: 'border-red-300', bg: 'bg-red-50', text: 'text-red-900', icon: 'text-red-600' }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bot className="h-8 w-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-900">Mudarabah Compliance Categories</h1>
              </div>
              <p className="text-gray-600 text-sm">
                8 controls from AAOIFI SS-13 across 5 categories • 1 hard gate
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/ai-grc-prototype')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Badge className="bg-purple-600 text-sm px-3 py-1">
                <Sparkles className="h-4 w-4 mr-1" />
                Phase 2: Requirements
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Configuration Summary */}
        <Card className="mb-8 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Configuration</h3>
                <div className="flex items-center gap-4 text-sm text-purple-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Qatar (QCB + QFCRA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Mudarabah (Profit-Sharing)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>AAOIFI SS-13</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Green Sukuk</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-900">8</p>
                <p className="text-xs text-purple-700">Controls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="space-y-6">
          {mudarabahCategories.map((category, index) => {
            const controls = getControlsByCategory(category.id)
            const colors = getColorClasses(category.color)
            const IconComponent = getIconForCategory(category.icon)

            return (
              <Card key={category.id} className={`border-2 ${colors.border}`}>
                <CardHeader className={`${colors.bg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center border-2 ${colors.border}`}>
                        <IconComponent className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <CardTitle className={`text-xl ${colors.text}`}>
                          {index + 1}. {category.name}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                      {category.controlCount} {category.controlCount === 1 ? 'control' : 'controls'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Controls List */}
                  <div className="space-y-3">
                    {controls.map((control) => (
                      <Card
                        key={control.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          control.isHardGate ? 'border-2 border-red-400 bg-red-50' : 'border border-gray-200'
                        }`}
                        onClick={() => router.push(`/ai-grc-prototype/control/${control.id}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{control.name}</h4>
                                {control.isHardGate && (
                                  <Badge className="bg-red-600 text-xs">
                                    <Lock className="h-3 w-3 mr-1" />
                                    HARD GATE
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{control.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Shield className="h-3 w-3" />
                                  <span>{control.aaoifiSection}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {control.frequency}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Hard Gates Summary */}
        <Card className="mt-8 border-2 border-red-300 bg-gradient-to-r from-red-50 to-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-red-600" />
              <CardTitle className="text-red-900">Hard Gates</CardTitle>
            </div>
            <CardDescription className="text-red-700">
              These controls BLOCK workflow progression if they fail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mudarabahControls
                .filter(c => c.isHardGate)
                .map(control => (
                  <Card
                    key={control.id}
                    className="border-2 border-red-300 cursor-pointer hover:shadow-md"
                    onClick={() => router.push(`/ai-grc-prototype/control/${control.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-red-900 mb-1">{control.name}</h4>
                          <p className="text-sm text-red-700">{control.aaoifiSection}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="mt-8 border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Key Insights</CardTitle>
            <CardDescription className="text-blue-700">
              What makes this contract-driven compliance different
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Contract-Specific</p>
                  <p className="text-blue-700 text-xs">Controls from AAOIFI SS-13 Mudarabah, not generic GRC templates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Hard Gates</p>
                  <p className="text-blue-700 text-xs">Capital Maintenance §8/7 blocks profit distribution if capital impaired</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">Conflict Resolution</p>
                  <p className="text-blue-700 text-xs">Shows how QCB vs QFCRA differences are resolved (strictest wins)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">AI Assistant</p>
                  <p className="text-blue-700 text-xs">Each task has dedicated AI helper with human approval (HITL)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
