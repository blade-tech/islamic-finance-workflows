'use client'

/**
 * AI-GRC PROTOTYPE - OBLIGATIONS REGISTER PAGE
 * ============================================
 * Shows the obligations register for selected jurisdiction + product
 * Pattern: [Jurisdiction] + [Product] + "Obligation Register"
 * Example: "Qatar Mudarabah Obligation Register"
 *
 * Features:
 * - Research transparency (QCB + QFCRA sources)
 * - Obligations with control mappings
 * - Conflict resolution methodology
 * - Traceability to controls and workflows
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
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  GitBranch,
  Shield,
  Sparkles,
  Target,
} from 'lucide-react'
import { mudarabahControls } from '@/lib/mock-data/mudarabah-controls'

export default function ObligationsRegisterPage() {
  const router = useRouter()

  // Mock data for Qatar Mudarabah obligations
  const obligations = [
    {
      id: 'QA-MUD-OBL-001',
      title: 'Profit Distribution Disclosure',
      category: 'Profit Management',
      description: 'Mudarabah contracts must clearly disclose profit-sharing ratios, calculation methodology, and distribution frequency to all parties.',
      sources: [
        { name: 'AAOIFI SS-13', section: 'Section 2/1/1', url: '#' },
        { name: 'QCB Regulation 8/2023', section: 'Article 12', url: '#' },
        { name: 'QFCRA IBANK Chapter 8', section: 'Rule 8.2.1', url: '#' },
      ],
      controls: ['ctrl-mud-profit-001'],
      researchNotes: 'QCB requires quarterly profit distribution statements, while QFCRA mandates monthly reporting for investment accounts exceeding QAR 1M.',
    },
    {
      id: 'QA-MUD-OBL-002',
      title: 'Capital Protection Validation',
      category: 'Capital Management',
      description: 'Verify that Mudarabah capital is protected from Mudarib negligence, misconduct, or breach of contract terms.',
      sources: [
        { name: 'AAOIFI SS-13', section: 'Section 3/1/5', url: '#' },
        { name: 'QCB Regulation 8/2023', section: 'Article 18', url: '#' },
        { name: 'IFSB-3', section: 'Standard 4.1', url: '#' },
      ],
      controls: ['ctrl-mud-profit-002'],
      researchNotes: 'AAOIFI defines strict criteria for Mudarib liability. QCB requires evidence-based validation quarterly.',
    },
    {
      id: 'QA-MUD-OBL-003',
      title: 'Shariah Compliance Review',
      category: 'Shariah Governance',
      description: 'Ensure ongoing Shariah compliance through regular reviews by qualified Shariah scholars.',
      sources: [
        { name: 'AAOIFI GS-1', section: 'Standard 9', url: '#' },
        { name: 'QCB Regulation 4/2018', section: 'Article 7', url: '#' },
        { name: 'QFCRA IBANK Chapter 2', section: 'Rule 2.3.1', url: '#' },
      ],
      controls: ['ctrl-mud-contract-001', 'ctrl-mud-contract-002'],
      researchNotes: 'QCB requires quarterly Shariah audit reports. QFCRA mandates independent Shariah advisor appointment.',
    },
    {
      id: 'QA-MUD-OBL-004',
      title: 'Transaction Documentation',
      category: 'Documentation & Records',
      description: 'Maintain comprehensive documentation of all Mudarabah transactions, including contracts, amendments, and profit distributions.',
      sources: [
        { name: 'AAOIFI SS-13', section: 'Section 5/2', url: '#' },
        { name: 'QCB Regulation 8/2023', section: 'Article 25', url: '#' },
      ],
      controls: ['ctrl-mud-contract-001'],
      researchNotes: 'Both QCB and QFCRA require 7-year retention period for Mudarabah contract documentation.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => router.push('/ai-grc-prototype')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to AI-GRC Prototype
            </Button>
            <Badge className="bg-blue-600 text-sm px-3 py-1">
              <Shield className="h-4 w-4 mr-1" />
              Obligations Register
            </Badge>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Qatar Mudarabah Obligation Register</h1>
            </div>
            <p className="text-gray-600 text-sm">
              Research-backed compliance framework for Mudarabah contracts in Qatar
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Research Transparency Panel */}
        <Card className="border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-green-600" />
              <div>
                <CardTitle className="text-green-900">Research Transparency</CardTitle>
                <CardDescription className="text-green-700">
                  How this obligations register was built
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white rounded-lg border-2 border-green-200">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Research Methodology
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                This obligations register was created through systematic analysis of regulatory requirements from multiple authorities:
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <p className="font-semibold text-blue-900 text-sm">Qatar Central Bank (QCB)</p>
                  </div>
                  <p className="text-xs text-blue-800">
                    Source: Regulation No. 8 of 2023 on Islamic Banking and Finance
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Covers prudential requirements, capital adequacy, and Shariah governance for Islamic banks in Qatar
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <p className="font-semibold text-purple-900 text-sm">QFCRA (Qatar Financial Centre Regulatory Authority)</p>
                  </div>
                  <p className="text-xs text-purple-800">
                    Source: IBANK Rulebook - Islamic Banking Business Prudential Rules (Chapter 8)
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Specifies Mudarabah contract requirements, profit-sharing disclosure, and risk management
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-orange-600" />
                    <p className="font-semibold text-orange-900 text-sm">AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions)</p>
                  </div>
                  <p className="text-xs text-orange-800">
                    Source: Shariah Standard No. 13 (SS-13) on Mudarabah
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Defines Shariah-compliant Mudarabah contract structures, profit allocation, and capital protection
                  </p>
                </div>
              </div>
            </div>

            {/* Conflict Resolution */}
            <div className="p-4 bg-white rounded-lg border-2 border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Conflict Resolution Approach
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                When QCB and QFCRA regulations conflict, we apply the following hierarchy:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>
                  <strong>QCB takes precedence</strong> for mainland Qatar institutions (applies to conventional banks and standalone Islamic banks)
                </li>
                <li>
                  <strong>QFCRA takes precedence</strong> for QFC-licensed entities (applies to QFC Islamic bank branches)
                </li>
                <li>
                  <strong>AAOIFI provides Shariah foundation</strong> for all Mudarabah contracts regardless of jurisdiction
                </li>
                <li>
                  <strong>Most conservative requirement applies</strong> when both regulators apply (choose stricter standard)
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Obligations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Regulatory Obligations</h2>
            <Badge variant="outline" className="text-sm">
              {obligations.length} obligations
            </Badge>
          </div>

          {obligations.map((obligation, index) => (
            <Card key={obligation.id} className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-purple-900">{obligation.title}</CardTitle>
                        <p className="text-xs text-gray-600 mt-1">
                          <code className="bg-purple-100 px-2 py-0.5 rounded text-purple-700">{obligation.id}</code>
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-purple-600 ml-3">{obligation.category}</Badge>
                </div>
                <CardDescription className="text-gray-700">{obligation.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Regulatory Sources */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-2">Regulatory Sources:</p>
                  <div className="space-y-1">
                    {obligation.sources.map((source, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Shield className="h-3 w-3 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-800">
                          <strong>{source.name}</strong> - {source.section}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mapped Controls */}
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-green-900 mb-2">Implemented by Controls:</p>
                  <div className="flex flex-wrap gap-2">
                    {obligation.controls.map(controlId => {
                      const control = mudarabahControls.find(c => c.id === controlId)
                      return control ? (
                        <Button
                          key={controlId}
                          variant="outline"
                          size="sm"
                          className="text-xs border-green-400 text-green-800 hover:bg-green-100"
                          onClick={() => router.push(`/ai-grc-prototype/control/${controlId}`)}
                        >
                          <GitBranch className="h-3 w-3 mr-1" />
                          {control.name}
                        </Button>
                      ) : null
                    })}
                  </div>
                </div>

                {/* Research Notes */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="research" className="border-none">
                    <AccordionTrigger className="text-xs text-gray-600 hover:text-gray-900 py-2">
                      <span className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        View Research Notes
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-700">
                        {obligation.researchNotes}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Additional Resources</CardTitle>
            <CardDescription>Learn more about the regulatory framework</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => router.push('/ssb-prototype')}
            >
              <span className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                View Complete Traceability Map
              </span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => router.push('/ai-grc-prototype/categories')}
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Browse Control Categories
              </span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
