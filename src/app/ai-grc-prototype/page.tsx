'use client'

/**
 * AI-NATIVE GRC UX PROTOTYPE - CONFIGURATION PAGE
 * ===============================================
 * Contract-driven compliance for Islamic Finance products.
 * Demonstrates framework flexibility across jurisdictions, products, and standards.
 *
 * USER FLOW:
 * 1. Select Jurisdiction (Qatar or Malaysia)
 * 2. Select Product (Ijarah, Murabaha, Mudaraba, etc.)
 * 3. Select Accounting Standard (AAOIFI, IFRS, IFRS+Islamic)
 * 4. Optional: Select Sustainability Framework
 * 5. Click "Continue to Requirements" → Navigate to /ai-grc-prototype/categories
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { JurisdictionSelector } from '@/app/islamic-grc-demo/components/JurisdictionSelector'
import { ProductSelector } from '@/app/islamic-grc-demo/components/ProductSelector'
import type { Jurisdiction, ProductType, AccountingStandard } from '@/lib/types/grc-demo-types'

// Sustainability types
type SustainabilityType = 'none' | 'green' | 'social' | 'sustainability-linked'
type SustainabilityFramework = 'ICMA-GBP' | 'ICMA-SBP' | 'ICMA-SLBP' | 'BNM-VBIAF' | 'UN-SDG'

export default function AIGRCPrototypePage() {
  const router = useRouter()

  // Configuration state - more realistic defaults
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>('qatar')
  const [product, setProduct] = useState<ProductType | null>('ijarah')
  const [accounting, setAccounting] = useState<AccountingStandard>('aaoifi')
  const [sustainabilityType, setSustainabilityType] = useState<SustainabilityType>('none')
  const [sustainabilityFrameworks, setSustainabilityFrameworks] = useState<SustainabilityFramework[]>([])
  const [impactCategories, setImpactCategories] = useState<string[]>([])

  const isComplete = jurisdiction && product && accounting

  const handleContinue = () => {
    router.push('/ai-grc-prototype/categories')
  }

  const toggleFramework = (framework: SustainabilityFramework) => {
    setSustainabilityFrameworks(prev =>
      prev.includes(framework) ? prev.filter(f => f !== framework) : [...prev, framework]
    )
  }

  const toggleImpactCategory = (category: string) => {
    setImpactCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    )
  }

  const sustainabilityEnabled = sustainabilityType !== 'none'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bot className="h-8 w-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-900">AI-Native GRC UX Prototype</h1>
              </div>
              <p className="text-gray-600 text-sm">
                Multi-framework compliance • Contract-driven controls • AI assistant per task • Human-in-the-loop
              </p>
            </div>
            <Badge className="bg-purple-600 text-sm px-3 py-1">
              <Sparkles className="h-4 w-4 mr-1" />
              Phase 1: Configuration
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prototype Context Card */}
        <Card className="mb-8 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-900">
              <Sparkles className="h-5 w-5 mr-2" />
              About This Prototype
            </CardTitle>
            <CardDescription className="text-purple-700">
              Demonstrates framework flexibility across jurisdictions, products, and standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-semibold text-purple-900">Multiple Frameworks</p>
                <p className="text-purple-700 text-xs">AAOIFI, IFRS, BNM, ICMA</p>
              </div>
              <div>
                <p className="font-semibold text-purple-900">7 Products</p>
                <p className="text-purple-700 text-xs">Banking, Sukuk, Funds, Takaful</p>
              </div>
              <div>
                <p className="font-semibold text-purple-900">4 Jurisdictions</p>
                <p className="text-purple-700 text-xs">Qatar, Malaysia, UAE, Saudi</p>
              </div>
              <div>
                <p className="font-semibold text-purple-900">AI Assistant</p>
                <p className="text-purple-700 text-xs">Per task, HITL approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Options */}
        <div className="space-y-6">
          {/* 1. Jurisdiction */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-lg">Jurisdiction</CardTitle>
                    <CardDescription className="text-xs">Select regulatory environment</CardDescription>
                  </div>
                </div>
                {jurisdiction && <CheckCircle2 className="h-6 w-6 text-green-600" />}
              </div>
            </CardHeader>
            <CardContent>
              <JurisdictionSelector
                selectedJurisdiction={jurisdiction}
                onSelect={setJurisdiction}
              />
            </CardContent>
          </Card>

          {/* 2. Product */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <CardTitle className="text-lg">Islamic Finance Product</CardTitle>
                    <CardDescription className="text-xs">Select contract type</CardDescription>
                  </div>
                </div>
                {product && <CheckCircle2 className="h-6 w-6 text-green-600" />}
              </div>
            </CardHeader>
            <CardContent>
              <ProductSelector
                selectedProduct={product}
                onSelect={setProduct}
              />
            </CardContent>
          </Card>

          {/* 3. Accounting Standard */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <CardTitle className="text-lg">Accounting Standard</CardTitle>
                    <CardDescription className="text-xs">Select accounting & reporting framework</CardDescription>
                  </div>
                </div>
                {accounting && <CheckCircle2 className="h-6 w-6 text-green-600" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* AAOIFI */}
                <Card
                  className={`cursor-pointer transition-all ${
                    accounting === 'aaoifi'
                      ? 'border-2 border-blue-500 bg-blue-50'
                      : 'border-2 border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setAccounting('aaoifi')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Building2 className="h-6 w-6 text-blue-600" />
                      {accounting === 'aaoifi' && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">AAOIFI</h4>
                    <p className="text-xs text-gray-600">Islamic accounting standards (FAS series)</p>
                    {accounting === 'aaoifi' && <Badge className="mt-2 bg-blue-600">Selected</Badge>}
                  </CardContent>
                </Card>

                {/* IFRS */}
                <Card
                  className={`cursor-pointer transition-all ${
                    accounting === 'ifrs'
                      ? 'border-2 border-blue-500 bg-blue-50'
                      : 'border-2 border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setAccounting('ifrs')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Building2 className="h-6 w-6 text-blue-600" />
                      {accounting === 'ifrs' && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">IFRS</h4>
                    <p className="text-xs text-gray-600">International Financial Reporting Standards</p>
                    {accounting === 'ifrs' && <Badge className="mt-2 bg-blue-600">Selected</Badge>}
                  </CardContent>
                </Card>

                {/* IFRS-Islamic */}
                <Card
                  className={`cursor-pointer transition-all ${
                    accounting === 'ifrs-islamic'
                      ? 'border-2 border-blue-500 bg-blue-50'
                      : 'border-2 border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setAccounting('ifrs-islamic')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Building2 className="h-6 w-6 text-blue-600" />
                      {accounting === 'ifrs-islamic' && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">IFRS + Islamic</h4>
                    <p className="text-xs text-gray-600">IFRS with Islamic finance adaptations</p>
                    {accounting === 'ifrs-islamic' && <Badge className="mt-2 bg-blue-600">Selected</Badge>}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* 4. Sustainability Framework (Optional) */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <CardTitle className="text-lg">Sustainability & Impact</CardTitle>
                    <CardDescription className="text-xs">
                      Optional ESG and sustainability frameworks
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline">Optional</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sustainability Type Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Does this transaction have sustainability goals?
                </Label>
                <RadioGroup
                  value={sustainabilityType}
                  onValueChange={(v) => setSustainabilityType(v as SustainabilityType)}
                >
                  <div className="space-y-2">
                    <Card
                      className={`cursor-pointer transition-all ${
                        sustainabilityType === 'none'
                          ? 'border-2 border-gray-500 bg-gray-50'
                          : 'border-2 border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSustainabilityType('none')}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="none" id="none" />
                          <div className="flex-1">
                            <Label htmlFor="none" className="font-medium cursor-pointer block">
                              No sustainability component
                            </Label>
                            <p className="text-xs text-gray-600">Standard GRC only</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all ${
                        sustainabilityType === 'green'
                          ? 'border-2 border-emerald-500 bg-emerald-50'
                          : 'border-2 border-gray-200 hover:border-emerald-300'
                      }`}
                      onClick={() => setSustainabilityType('green')}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="green" id="green" />
                          <div className="flex-1">
                            <Label htmlFor="green" className="font-medium cursor-pointer block">
                              Green/Sustainable Sukuk
                            </Label>
                            <p className="text-xs text-gray-600">
                              Environmental projects (renewable energy, green buildings, etc.)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all ${
                        sustainabilityType === 'social'
                          ? 'border-2 border-emerald-500 bg-emerald-50'
                          : 'border-2 border-gray-200 hover:border-emerald-300'
                      }`}
                      onClick={() => setSustainabilityType('social')}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="social" id="social" />
                          <div className="flex-1">
                            <Label htmlFor="social" className="font-medium cursor-pointer block">
                              Social Impact Sukuk
                            </Label>
                            <p className="text-xs text-gray-600">
                              Social welfare projects (education, healthcare, affordable housing)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={`cursor-pointer transition-all ${
                        sustainabilityType === 'sustainability-linked'
                          ? 'border-2 border-emerald-500 bg-emerald-50'
                          : 'border-2 border-gray-200 hover:border-emerald-300'
                      }`}
                      onClick={() => setSustainabilityType('sustainability-linked')}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="sustainability-linked" id="sustainability-linked" />
                          <div className="flex-1">
                            <Label htmlFor="sustainability-linked" className="font-medium cursor-pointer block">
                              Sustainability-Linked (KPI-based)
                            </Label>
                            <p className="text-xs text-gray-600">
                              Performance-based sustainability targets
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </RadioGroup>
              </div>

              {/* Framework Alignment - show if sustainability enabled */}
              {sustainabilityEnabled && (
                <div className="pt-4 border-t">
                  <Label className="text-base font-semibold mb-3 block">
                    Framework Alignment
                  </Label>
                  <div className="space-y-2">
                    {[
                      { value: 'ICMA-GBP' as const, label: 'ICMA Green Bond Principles (GBP)' },
                      { value: 'ICMA-SBP' as const, label: 'ICMA Social Bond Principles (SBP)' },
                      { value: 'ICMA-SLBP' as const, label: 'ICMA Sustainability-Linked Bond Principles (SLBP)' },
                      { value: 'BNM-VBIAF' as const, label: 'BNM Value-Based Intermediation Assessment (VBIAF)' },
                      { value: 'UN-SDG' as const, label: 'UN Sustainable Development Goals (SDGs)' }
                    ].map((framework) => (
                      <Card
                        key={framework.value}
                        className={`cursor-pointer transition-all ${
                          sustainabilityFrameworks.includes(framework.value)
                            ? 'border-2 border-emerald-500 bg-emerald-50'
                            : 'border-2 border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => toggleFramework(framework.value)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={sustainabilityFrameworks.includes(framework.value)}
                              onCheckedChange={() => toggleFramework(framework.value)}
                            />
                            <Label className="cursor-pointer flex-1 text-sm">
                              {framework.label}
                            </Label>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact Categories - show if sustainability enabled */}
              {sustainabilityEnabled && (
                <div className="pt-4 border-t">
                  <Label className="text-base font-semibold mb-3 block">
                    Impact Categories (select all that apply)
                  </Label>
                  <div className="space-y-2">
                    {[
                      { value: 'Climate & Environment (SDG 13)', label: 'Climate & Environment (SDG 13, 14, 15)' },
                      { value: 'Social Welfare (SDG 1)', label: 'Social Welfare (SDG 1, 2, 3, 8)' },
                      { value: 'Economic Inclusion (SDG 8)', label: 'Economic Inclusion (SDG 8, 9, 10)' },
                      { value: 'Governance & Ethics (SDG 16)', label: 'Governance & Ethics (SDG 16, 17)' }
                    ].map((category) => (
                      <Card
                        key={category.value}
                        className={`cursor-pointer transition-all ${
                          impactCategories.includes(category.value)
                            ? 'border-2 border-emerald-500 bg-emerald-50'
                            : 'border-2 border-gray-200 hover:border-emerald-300'
                        }`}
                        onClick={() => toggleImpactCategory(category.value)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={impactCategories.includes(category.value)}
                              onCheckedChange={() => toggleImpactCategory(category.value)}
                            />
                            <Label className="cursor-pointer flex-1 text-sm">
                              {category.label}
                            </Label>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <Card className="mt-8 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-1">
                  Configuration Complete
                </h3>
                <p className="text-sm text-purple-700">
                  {jurisdiction?.toUpperCase()} • {product?.charAt(0).toUpperCase()}{product?.slice(1)} • {accounting.toUpperCase()}
                  {sustainabilityEnabled && ` • ${sustainabilityType === 'green' ? 'Green/Sustainable' : sustainabilityType === 'social' ? 'Social Impact' : 'Sustainability-Linked'}`}
                  {!sustainabilityEnabled && ' • Standard GRC'}
                </p>
                {sustainabilityEnabled && sustainabilityFrameworks.length > 0 && (
                  <p className="text-xs text-purple-600 mt-1">
                    Frameworks: {sustainabilityFrameworks.join(', ')}
                  </p>
                )}
              </div>
              <Button
                onClick={handleContinue}
                disabled={!isComplete}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Requirements
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
