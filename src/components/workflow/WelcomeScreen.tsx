'use client'

/**
 * WELCOME SCREEN - ISLAMIC FINANCE GRC PLATFORM
 * ==============================================
 * Educational landing page explaining the platform's 5-stage process
 * and persona-based value propositions.
 *
 * PURPOSE:
 * - Introduce users to Islamic GRC capabilities
 * - Show persona-based value props (Shariah Officers, Risk Officers, etc.)
 * - Explain the complete compliance-to-tokenization process
 * - Build confidence before starting
 *
 * 5 STAGES:
 * 1. Policy Intent - Define Shariah requirements
 * 2. Digitization - AI extracts processes from documents
 * 3. Process Execution - GRC fundamentals with Islamic overlays
 * 4. Verifiable Proofs - Guardian issues VP/VC and mints NFT
 * 5. Tokenization - Optional: Compliant digital asset issuance
 */

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Cpu,
  Workflow,
  ShieldCheck,
  Coins,
  ArrowRight,
  Users,
  MessageSquare,
  CheckSquare,
  Bell,
  Sparkles,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react'

export default function WelcomeScreen() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/')
  }

  // Persona-based value propositions
  const personas = [
    {
      icon: ShieldCheck,
      role: 'Shariah Compliance Officers',
      value: 'Assist Shariah officers with reviews, breach risk tracking, and audit reporting—reducing manual effort significantly.',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: TrendingUp,
      role: 'Risk Officers',
      value: 'Monitor SNCR, DCR, and fiduciary risks in real-time. One dashboard for all Islamic risk categories.',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      icon: Coins,
      role: 'Digital Asset Teams',
      value: 'Launch compliant Sukuk, tokens, and digital assets in weeks—not quarters. Compliance is built-in.',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      icon: Award,
      role: 'CFO / Executives',
      value: 'One view of Shariah compliance health, regulatory risk exposure, and digital asset performance.',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  ]

  const stages = [
    {
      icon: FileText,
      title: 'Policy Intent',
      description: 'Define Shariah requirements',
      details: 'Select Shariah structure, jurisdiction (AAOIFI/IFSB), accounting framework, and regulatory requirements',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: Cpu,
      title: 'Digitization',
      description: 'AI extracts processes from documents',
      details: 'Guardian methodology engine creates human and data processes from policy documents',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Workflow,
      title: 'Process Execution',
      description: 'GRC fundamentals + Islamic overlays',
      details: 'Execute with Shariah Board oversight, SNCR tracking, contract-sequence gates, and purification controls',
      gradient: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      icon: ShieldCheck,
      title: 'Verifiable Proofs',
      description: 'Blockchain-verified compliance certificates',
      details: 'Generate Verifiable Credentials for Shariah compliance, issue Verifiable Presentation, mint NFT certificate on Hedera',
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Coins,
      title: 'Tokenization',
      description: 'Optional: Compliant digital asset issuance',
      details: 'Create tradeable tokens with MLETR and QFC Digital Asset Regulations compliance built-in',
      gradient: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      optional: true
    }
  ]

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 z-50 overflow-auto">
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl w-full">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                Islamic Finance GRC Platform
              </h1>
            </div>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              AI-Powered Shariah Compliance • Built on Standards • Digital-Asset Ready
            </p>
            <p className="text-sm text-gray-500 mt-2 px-4">
              Built on ISO 37301 • ISO 31000 • COSO • AAOIFI • IFSB • Integrated with Hedera Guardian
            </p>
          </div>

          {/* Value Propositions by Persona */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Built For Your Role
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personas.map((persona, index) => {
                const Icon = persona.icon
                return (
                  <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full ${persona.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`h-6 w-6 ${persona.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {persona.role}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {persona.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* 5-Stage Workflow - Desktop */}
          <div className="hidden lg:block mb-8">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-blue-300 via-indigo-300 via-green-300 to-amber-300 opacity-30" />

              <div className="grid grid-cols-5 gap-4">
                {stages.map((stage, index) => {
                  const Icon = stage.icon
                  return (
                    <div key={index} className="relative">
                      <Card className="border-2 hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                          {/* Icon */}
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ${stage.iconBg} flex items-center justify-center mb-4 mx-auto`}>
                            <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stage.iconColor}`} />
                          </div>

                          {/* Title */}
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 text-center">
                            {stage.title}
                            {stage.optional && (
                              <span className="block text-xs text-gray-500 font-normal mt-1">Optional</span>
                            )}
                          </h3>

                          {/* Description */}
                          <p className="text-xs sm:text-sm text-gray-600 mb-3 text-center">
                            {stage.description}
                          </p>

                          {/* Details */}
                          <p className="text-xs text-gray-500 leading-relaxed text-center">
                            {stage.details}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Arrow */}
                      {index < stages.length - 1 && (
                        <div className="absolute top-16 -right-6 flex items-center justify-center">
                          <ArrowRight className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 5-Stage Workflow - Mobile/Tablet */}
          <div className="lg:hidden space-y-4 mb-8">
            {stages.map((stage, index) => {
              const Icon = stage.icon
              return (
                <div key={index}>
                  <Card className="border-2">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${stage.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${stage.iconColor}`} />
                        </div>

                        <div className="flex-1">
                          {/* Title */}
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1">
                            {stage.title}
                            {stage.optional && (
                              <span className="text-xs text-gray-500 font-normal ml-2">Optional</span>
                            )}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-gray-600 mb-2">
                            {stage.description}
                          </p>

                          {/* Details */}
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {stage.details}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow Down */}
                  {index < stages.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="h-6 w-6 text-gray-400 rotate-90" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Call to Action */}
          <Card className="border-2 border-purple-200 bg-white">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Ready to get started?
                </h3>
                <p className="text-gray-600 mb-4">
                  Experience the full Islamic GRC platform with our interactive demos
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span>Setup in minutes • No credit card required • AAOIFI/IFSB compliant</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-xs sm:text-sm text-gray-500 mb-2">
              The only platform that assists with Shariah compliance, manages operational risk, and enables compliant digital asset issuance—in one system.
            </p>
            <p className="text-xs text-gray-400">
              Powered by Blade Labs
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
