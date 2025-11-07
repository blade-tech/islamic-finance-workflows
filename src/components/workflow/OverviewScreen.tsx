'use client'

/**
 * OVERVIEW SCREEN - OPTION C LANDING PAGE
 * =======================================
 * Intent-driven entry point showing 4 modular use cases.
 *
 * PURPOSE:
 * - Demonstrate platform modularity (each component works standalone)
 * - Intent-driven UX (user declares goal upfront)
 * - Foundation for AG-UI (AI-guided progressive disclosure)
 *
 * 4 USE CASES:
 * 1. Full Workflow (Steps 1-11) - Complete Islamic finance product creation
 * 2. Impact Measurement Only (Step 5) - Standalone ESG/sustainability tracking
 * 3. Compliance Check (Steps 1-2) - Quick Shariah validation
 * 4. Asset Tokenization (Step 10) - Blockchain deployment focus
 *
 * DESIGN PHILOSOPHY:
 * - Clear value proposition for each use case
 * - Estimated time to set realistic expectations
 * - Feature lists showing what's included
 * - Phase badges for in-development features
 * - One-click routing to appropriate workflow step
 */

import Link from 'next/link'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Sparkles,
  TrendingUp,
  Shield,
  Coins,
  CheckCircle2,
  ArrowRight,
  Info,
  Clock,
  BookOpen
} from 'lucide-react'

interface UseCase {
  id: 'full' | 'impact-only' | 'compliance-check' | 'tokenization-only'
  title: string
  description: string
  icon: React.ElementType
  color: string
  startStep: number
  estimatedTime: string
  badge?: string
  available: boolean
  features: string[]
}

const USE_CASES: UseCase[] = [
  {
    id: 'full',
    title: 'Complete Workflow',
    description: 'Create a full Islamic finance product from methodology selection to blockchain deployment.',
    icon: Sparkles,
    color: 'emerald',
    startStep: 1, // Start at Step 1 (after welcome screen)
    estimatedTime: '15-20 min',
    available: true,
    features: [
      'Connect to Shariah knowledge sources',
      'Select 4-component structure (Shariah, Jurisdiction, Accounting, Impact)',
      'Review & validate configuration',
      'Test in sandbox environment',
      'Deploy to Hedera blockchain',
      'Monitor compliance & collaborate'
    ]
  },
  {
    id: 'impact-only',
    title: 'Impact Measurement',
    description: 'Use our ESG/sustainability framework standalone to measure and report impact metrics.',
    icon: TrendingUp,
    color: 'blue',
    startStep: 5, // Jump directly to Step 5 (Select Impact Metrics)
    estimatedTime: '5-7 min',
    badge: 'Modular',
    available: true,
    features: [
      'Select from 12+ impact frameworks (SDGs, GRI, SASB, etc.)',
      'Configure impact metrics for your project',
      'Generate impact reports',
      'Track sustainability goals',
      'Export data for ESG disclosure'
    ]
  },
  {
    id: 'compliance-check',
    title: 'Quick Compliance Check',
    description: 'Validate existing contracts or documents against Shariah principles using AI analysis.',
    icon: Shield,
    color: 'purple',
    startStep: 1, // Start at Step 1 but skip to AI analysis
    estimatedTime: '3-5 min',
    available: true,
    features: [
      'Upload contracts or financial documents',
      'AI-powered Shariah compliance analysis',
      'Citation-backed validation results',
      'Identify riba, gharar, maysir issues',
      'Export compliance report'
    ]
  },
  {
    id: 'tokenization-only',
    title: 'Asset Tokenization',
    description: 'Deploy Shariah-compliant digital assets to Hedera blockchain with Guardian policies.',
    icon: Coins,
    color: 'amber',
    startStep: 9, // Jump to Step 9 (Test Workflow) or Step 10 (Live Execution)
    estimatedTime: '10-12 min',
    badge: 'Phase 3',
    available: false,
    features: [
      'Configure Guardian policy structure',
      'Define token economics & roles',
      'Set up Hedera accounts',
      'Deploy smart contracts',
      'Mint NFTs or fungible tokens',
      'Monitor on-chain activity'
    ]
  }
]

export default function OverviewScreen() {
  const setWorkflowMode = useWorkflowStore((state) => state.setWorkflowMode)

  const handleSelectUseCase = (useCase: UseCase) => {
    if (!useCase.available) return

    // Set workflow mode and starting step
    setWorkflowMode(useCase.id, useCase.startStep)

    // Note: Navigation is handled by WorkflowContainer watching store state
    // We don't need to manually navigate here
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-emerald-900">
          Welcome to ZeroH
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sustainable Islamic Finance governance, monitoring and risk management system
        </p>
      </div>

      {/* Information Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 flex items-center justify-between">
          <span>
            <strong>Modular Platform:</strong> Each workflow can be used independently or as part of the complete system.
            Choose what you want to accomplish today.
          </span>
          <Button variant="outline" size="sm" asChild className="ml-4 shrink-0">
            <Link href="/welcome">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn More
            </Link>
          </Button>
        </AlertDescription>
      </Alert>

      {/* Use Case Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {USE_CASES.map((useCase) => {
          const Icon = useCase.icon
          const isAvailable = useCase.available

          return (
            <Card
              key={useCase.id}
              className={`relative transition-all ${
                isAvailable
                  ? 'hover:shadow-lg hover:border-primary cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-${useCase.color}-100 text-${useCase.color}-600`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {useCase.badge && (
                    <Badge variant={useCase.badge === 'Modular' ? 'default' : 'secondary'}>
                      {useCase.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl mt-4">{useCase.title}</CardTitle>
                <CardDescription className="text-sm">
                  {useCase.description}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{useCase.estimatedTime}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features List */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">What's included:</p>
                  <ul className="space-y-1">
                    {useCase.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className={`h-3 w-3 mt-0.5 flex-shrink-0 ${
                          isAvailable ? `text-${useCase.color}-600` : 'text-gray-400'
                        }`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={isAvailable ? 'default' : 'outline'}
                  disabled={!isAvailable}
                  onClick={() => handleSelectUseCase(useCase)}
                >
                  {isAvailable ? (
                    <>
                      Start {useCase.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>Coming Soon</>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Footer Information */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>First time here?</strong> We recommend starting with the Complete Workflow to understand
          the full platform capabilities. You can always return to this page to try other workflows.
        </AlertDescription>
      </Alert>
    </div>
  )
}
