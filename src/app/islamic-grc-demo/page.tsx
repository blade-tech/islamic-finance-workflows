'use client'

/**
 * ISLAMIC GRC DEMO - CONFIGURATION PAGE (Phase 1)
 * ===============================================
 * Single-page configuration for:
 * - Jurisdiction selection
 * - Product selection
 * - Accounting standard
 * - Sustainability framework (optional)
 * - Document uploads (optional)
 *
 * After configuration, generates workflows and proceeds to Phase 2
 */

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Settings,
  Sparkles,
} from 'lucide-react'
import { JurisdictionSelector } from './components/JurisdictionSelector'
import { ProductSelector } from './components/ProductSelector'
import { useGRCDemoStore } from '@/lib/stores/grc-demo-store'
import type {
  Jurisdiction,
  ProductType,
  AccountingStandard,
  SustainabilityFramework,
} from '@/lib/types/grc-demo-types'

export default function IslamicGRCDemoPage() {
  const router = useRouter()
  const { setConfiguration, generateWorkflows, goToPhase } = useGRCDemoStore()

  // Configuration state
  const [selectedJurisdiction, setSelectedJurisdiction] =
    useState<Jurisdiction | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  )
  const [accountingStandard, setAccountingStandard] =
    useState<AccountingStandard>('aaoifi')
  const [sustainabilityFramework, setSustainabilityFramework] =
    useState<SustainabilityFramework>('none')

  // Validation
  const isComplete =
    selectedJurisdiction && selectedProduct && accountingStandard

  // Handle configuration submission
  const handleGenerateWorkflows = async () => {
    if (!selectedJurisdiction || !selectedProduct) return

    // Create configuration object
    const config = {
      id: `cfg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      jurisdiction: selectedJurisdiction,
      productType: selectedProduct,
      accountingStandard,
      sustainability:
        sustainabilityFramework !== 'none'
          ? { framework: sustainabilityFramework }
          : undefined,
      uploadedDocuments: [],
      status: 'draft' as const,
    }

    // Save configuration
    setConfiguration(config)

    // Generate workflows
    await generateWorkflows()

    // Navigate to workflow review phase
    router.push('/islamic-grc-demo/workflows')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Islamic GRC Demo
            </h1>
            <Badge className="bg-purple-600">Phase 1: Configuration</Badge>
          </div>
          <p className="text-gray-600">
            Configure your Islamic finance product to generate compliant GRC
            workflows
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <span className="text-sm font-medium text-purple-900">
              Configuration
            </span>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="text-sm font-medium text-gray-600">
              Workflow Review
            </span>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <span className="text-sm font-medium text-gray-600">Dashboard</span>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="space-y-8">
          {/* Step 1: Jurisdiction */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <CardTitle>Jurisdiction</CardTitle>
                {selectedJurisdiction && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <JurisdictionSelector
                selectedJurisdiction={selectedJurisdiction}
                onSelect={setSelectedJurisdiction}
              />
            </CardContent>
          </Card>

          {/* Step 2: Product */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <CardTitle>Islamic Finance Product</CardTitle>
                {selectedProduct && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ProductSelector
                selectedProduct={selectedProduct}
                onSelect={setSelectedProduct}
              />
            </CardContent>
          </Card>

          {/* Step 3: Accounting Standard */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <CardTitle>Accounting & Reporting Framework</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Select accounting standard for financial reporting
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* AAOIFI */}
                  <Card
                    className={`cursor-pointer transition-all ${
                      accountingStandard === 'aaoifi'
                        ? 'border-2 border-blue-500 bg-blue-50'
                        : 'border-2 border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setAccountingStandard('aaoifi')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            AAOIFI
                          </h4>
                          <p className="text-xs text-gray-600">
                            Islamic accounting standards (FAS series)
                          </p>
                        </div>
                        {accountingStandard === 'aaoifi' && (
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <Badge className="mt-2 bg-blue-600">Recommended</Badge>
                    </CardContent>
                  </Card>

                  {/* IFRS */}
                  <Card
                    className={`cursor-pointer transition-all ${
                      accountingStandard === 'ifrs'
                        ? 'border-2 border-blue-500 bg-blue-50'
                        : 'border-2 border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setAccountingStandard('ifrs')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            IFRS
                          </h4>
                          <p className="text-xs text-gray-600">
                            International Financial Reporting Standards
                          </p>
                        </div>
                        {accountingStandard === 'ifrs' && (
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* IFRS-Islamic */}
                  <Card
                    className={`cursor-pointer transition-all ${
                      accountingStandard === 'ifrs-islamic'
                        ? 'border-2 border-blue-500 bg-blue-50'
                        : 'border-2 border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setAccountingStandard('ifrs-islamic')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            IFRS + Islamic
                          </h4>
                          <p className="text-xs text-gray-600">
                            IFRS with Islamic finance adaptations
                          </p>
                        </div>
                        {accountingStandard === 'ifrs-islamic' && (
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Sustainability (Optional) */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <CardTitle>Sustainability Framework</CardTitle>
                <Badge variant="outline">Optional</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Add ESG or sustainability requirements (optional)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Card
                    className={`cursor-pointer transition-all ${
                      sustainabilityFramework === 'none'
                        ? 'border-2 border-gray-400 bg-gray-50'
                        : 'border-2 border-gray-200'
                    }`}
                    onClick={() => setSustainabilityFramework('none')}
                  >
                    <CardContent className="p-4">
                      <h4 className="text-sm font-semibold text-gray-700">
                        None
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Standard GRC only
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    className="border-2 border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                    title="Coming soon"
                  >
                    <CardContent className="p-4">
                      <h4 className="text-sm font-semibold text-gray-600">
                        Green Sukuk
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="border-2 border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                    title="Coming soon"
                  >
                    <CardContent className="p-4">
                      <h4 className="text-sm font-semibold text-gray-600">
                        UN SDGs
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                    </CardContent>
                  </Card>

                  <Card
                    className="border-2 border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                    title="Coming soon"
                  >
                    <CardContent className="p-4">
                      <h4 className="text-sm font-semibold text-gray-600">
                        VBI (BNM)
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generate Button */}
        <div className="mt-8 flex items-center justify-between p-6 bg-white border-2 border-purple-200 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Ready to generate workflows?
            </h3>
            <p className="text-sm text-gray-600">
              {isComplete
                ? `Generate compliant ${selectedProduct?.toUpperCase()} workflows for ${selectedJurisdiction?.toUpperCase()}`
                : 'Complete jurisdiction and product selection to continue'}
            </p>
          </div>

          <Button
            onClick={handleGenerateWorkflows}
            disabled={!isComplete}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Workflows
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
