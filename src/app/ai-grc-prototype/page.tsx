'use client'

/**
 * AI-NATIVE GRC UX PROTOTYPE - CONFIGURATION PAGE
 * ===============================================
 * Contract-driven compliance for Islamic Finance products.
 * Demonstrates controls extracted from actual contract templates (e.g., AAOIFI SS-13 Mudarabah).
 *
 * USER FLOW:
 * 1. Select Qatar (jurisdiction)
 * 2. Select Mudarabah (product)
 * 3. Select AAOIFI (accounting standard)
 * 4. Optional: Green Sukuk (sustainability)
 * 5. Click "Continue to Requirements" → Navigate to /ai-grc-prototype/categories
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  Sparkles
} from 'lucide-react'

export default function AIGRCPrototypePage() {
  const router = useRouter()

  // Configuration state (pre-selected for demo)
  const [jurisdiction, setJurisdiction] = useState<'qatar' | null>('qatar')
  const [product, setProduct] = useState<'mudarabah' | null>('mudarabah')
  const [accounting, setAccounting] = useState<'aaoifi' | null>('aaoifi')
  const [sustainability, setSustainability] = useState<'green-sukuk' | 'none'>('green-sukuk')

  const isComplete = jurisdiction && product && accounting

  const handleContinue = () => {
    router.push('/ai-grc-prototype/categories')
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
                <h1 className="text-3xl font-bold text-gray-900">AI-Native GRC UX Prototype</h1>
              </div>
              <p className="text-gray-600 text-sm">
                Contract-driven compliance • Self-contained task cards • AI assistant per task • Human-in-the-loop
              </p>
            </div>
            <Badge className="bg-purple-600 text-sm px-3 py-1">
              <Sparkles className="h-4 w-4 mr-1" />
              Phase 1: Configuration
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prototype Context Card */}
        <Card className="mb-8 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-900">
              <Sparkles className="h-5 w-5 mr-2" />
              About This Prototype
            </CardTitle>
            <CardDescription className="text-purple-700">
              Demonstrates contract-specific controls from AAOIFI SS-13 Mudarabah standard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-semibold text-purple-900">8 Controls</p>
                <p className="text-purple-700 text-xs">From AAOIFI SS-13</p>
              </div>
              <div>
                <p className="font-semibold text-purple-900">5 Categories</p>
                <p className="text-purple-700 text-xs">Capital, Profit, Conduct, etc.</p>
              </div>
              <div>
                <p className="font-semibold text-purple-900">1 Hard Gate</p>
                <p className="text-purple-700 text-xs">Capital Maintenance</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Qatar */}
                <Card
                  className={`cursor-pointer transition-all ${
                    jurisdiction === 'qatar'
                      ? 'border-2 border-purple-500 bg-purple-50'
                      : 'border-2 border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setJurisdiction('qatar')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Globe className="h-6 w-6 text-purple-600" />
                      {jurisdiction === 'qatar' && <CheckCircle2 className="h-5 w-5 text-purple-600" />}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Qatar</h4>
                    <p className="text-xs text-gray-600">QCB + QFCRA dual-regulatory</p>
                    <Badge className="mt-2 bg-purple-600">Selected</Badge>
                  </CardContent>
                </Card>

                {/* UAE (disabled) */}
                <Card className="border-2 border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed">
                  <CardContent className="p-4">
                    <Globe className="h-6 w-6 text-gray-400 mb-2" />
                    <h4 className="font-semibold text-gray-600 mb-1">UAE</h4>
                    <p className="text-xs text-gray-500">Coming soon</p>
                  </CardContent>
                </Card>

                {/* Saudi (disabled) */}
                <Card className="border-2 border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed">
                  <CardContent className="p-4">
                    <Globe className="h-6 w-6 text-gray-400 mb-2" />
                    <h4 className="font-semibold text-gray-600 mb-1">Saudi Arabia</h4>
                    <p className="text-xs text-gray-500">Coming soon</p>
                  </CardContent>
                </Card>
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Mudarabah */}
                <Card
                  className={`cursor-pointer transition-all ${
                    product === 'mudarabah'
                      ? 'border-2 border-purple-500 bg-purple-50'
                      : 'border-2 border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setProduct('mudarabah')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <FileText className="h-6 w-6 text-purple-600" />
                      {product === 'mudarabah' && <CheckCircle2 className="h-5 w-5 text-purple-600" />}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Mudarabah</h4>
                    <p className="text-xs text-gray-600">Profit-sharing partnership</p>
                    <Badge className="mt-2 bg-purple-600">Selected</Badge>
                  </CardContent>
                </Card>

                {/* Murabaha (disabled) */}
                <Card className="border-2 border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed">
                  <CardContent className="p-4">
                    <FileText className="h-6 w-6 text-gray-400 mb-2" />
                    <h4 className="font-semibold text-gray-600 mb-1">Murabaha</h4>
                    <p className="text-xs text-gray-500">Coming soon</p>
                  </CardContent>
                </Card>

                {/* Ijarah (disabled) */}
                <Card className="border-2 border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed">
                  <CardContent className="p-4">
                    <FileText className="h-6 w-6 text-gray-400 mb-2" />
                    <h4 className="font-semibold text-gray-600 mb-1">Ijarah</h4>
                    <p className="text-xs text-gray-500">Coming soon</p>
                  </CardContent>
                </Card>
              </div>
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
                    <CardDescription className="text-xs">Shariah accounting framework</CardDescription>
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
                      ? 'border-2 border-purple-500 bg-purple-50'
                      : 'border-2 border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setAccounting('aaoifi')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Building2 className="h-6 w-6 text-purple-600" />
                      {accounting === 'aaoifi' && <CheckCircle2 className="h-5 w-5 text-purple-600" />}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">AAOIFI</h4>
                    <p className="text-xs text-gray-600">SS-13 Mudarabah Standard</p>
                    <Badge className="mt-2 bg-purple-600">Selected</Badge>
                  </CardContent>
                </Card>

                {/* IFRS (disabled) */}
                <Card className="border-2 border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed">
                  <CardContent className="p-4">
                    <Building2 className="h-6 w-6 text-gray-400 mb-2" />
                    <h4 className="font-semibold text-gray-600 mb-1">IFRS</h4>
                    <p className="text-xs text-gray-500">Coming soon</p>
                  </CardContent>
                </Card>

                {/* IFRS-Islamic (disabled) */}
                <Card className="border-2 border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed">
                  <CardContent className="p-4">
                    <Building2 className="h-6 w-6 text-gray-400 mb-2" />
                    <h4 className="font-semibold text-gray-600 mb-1">IFRS + Islamic</h4>
                    <p className="text-xs text-gray-500">Coming soon</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* 4. Sustainability (Optional) */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <CardTitle className="text-lg">Sustainability Framework</CardTitle>
                    <CardDescription className="text-xs">
                      Optional ESG requirements
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline">Optional</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* None */}
                <Card
                  className={`cursor-pointer transition-all ${
                    sustainability === 'none'
                      ? 'border-2 border-gray-500 bg-gray-50'
                      : 'border-2 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSustainability('none')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Sparkles className="h-6 w-6 text-gray-600" />
                      {sustainability === 'none' && <CheckCircle2 className="h-5 w-5 text-gray-600" />}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">None</h4>
                    <p className="text-xs text-gray-600">Standard GRC only</p>
                  </CardContent>
                </Card>

                {/* Green Sukuk */}
                <Card
                  className={`cursor-pointer transition-all ${
                    sustainability === 'green-sukuk'
                      ? 'border-2 border-green-500 bg-green-50'
                      : 'border-2 border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setSustainability('green-sukuk')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Sparkles className="h-6 w-6 text-green-600" />
                      {sustainability === 'green-sukuk' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Green Sukuk</h4>
                    <p className="text-xs text-gray-600">Environmental sustainability</p>
                    {sustainability === 'green-sukuk' && <Badge className="mt-2 bg-green-600">Selected</Badge>}
                  </CardContent>
                </Card>
              </div>
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
                  Qatar • Mudarabah • AAOIFI SS-13 • {sustainability === 'green-sukuk' ? 'Green Sukuk' : 'Standard GRC'}
                </p>
              </div>
              <Button
                onClick={handleContinue}
                disabled={!isComplete}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
