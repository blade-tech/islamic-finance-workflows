'use client'

import React from 'react'
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
  Sparkles
} from 'lucide-react'

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const handleGetStarted = () => {
    onGetStarted()
  }

  const stages = [
    {
      icon: FileText,
      title: 'Policy Intent',
      description: 'Define your Islamic finance requirements',
      details: 'Select Shariah structure, jurisdiction, accounting framework, and impact metrics',
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: Cpu,
      title: 'Digitization',
      description: 'AI extracts workflows from documents',
      details: 'Guardian methodology engine creates human and data workflows from policy documents',
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Workflow,
      title: 'Workflow Execution',
      description: 'AI + human collaboration with checkpoints',
      details: 'Execute workflows with multi-stakeholder collaboration, task tracking, and granular status monitoring',
      gradient: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      icon: ShieldCheck,
      title: 'Verifiable Proofs',
      description: 'Guardian issues VP/VC and mints NFT certificate',
      details: 'Generate Verifiable Credentials for each component, create Verifiable Presentation, mint compliance certificate',
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Coins,
      title: 'Tokenization',
      description: 'Optional: Create tradeable tokens',
      details: 'Asset Tokenization Studio enables fractional ownership and secondary market trading',
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
                ZeroH
              </h1>
            </div>
            <p className="text-base sm:text-lg text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis px-4">
              Sustainable Islamic Finance governance, monitoring and risk management system
            </p>
          </div>

          {/* Collaboration Layer Banner */}
          <Card className="mb-6 sm:mb-8 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Collaboration Layer</h3>
                <span className="text-xs text-gray-500 ml-auto">Spans All Stages</span>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-700">@mentions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Task Assignments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Real-time Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Granular Status Tracking</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
                <p className="text-gray-600">
                  Begin your first sustainable Islamic finance governance workflow in minutes
                </p>
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
            <p className="text-xs sm:text-sm text-gray-500">
              Powered by Blade Labs
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
