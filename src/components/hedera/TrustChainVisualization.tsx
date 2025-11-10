'use client'

/**
 * TRUST CHAIN VISUALIZATION COMPONENT
 * ====================================
 * Visual representation of the DID/VC flow from action to verification.
 *
 * FLOW: Action → VC Issued → Anchored to HCS → External Party Verifies
 *
 * FEATURES:
 * - Timeline-based visualization
 * - Shows actors, actions, credentials
 * - Verification status badges
 * - HashScan links for on-chain verification
 * - Dependency connections between steps
 */

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Shield,
  Users,
  FileCheck,
  Link as LinkIcon,
  Eye,
  AlertCircle
} from 'lucide-react'
import {
  mockTrustChain,
  mockDIDs,
  getVerificationsForVC,
  type TrustChainStep,
  type HederaDID,
  type ExternalVerification
} from '@/lib/mock-data/hedera-trust-chain'

interface TrustChainVisualizationProps {
  maxSteps?: number
  showVerifications?: boolean
  highlightStep?: string
}

export function TrustChainVisualization({
  maxSteps = 10,
  showVerifications = true,
  highlightStep
}: TrustChainVisualizationProps) {
  const [selectedStep, setSelectedStep] = useState<TrustChainStep | null>(null)
  const [selectedVC, setSelectedVC] = useState<string | null>(null)

  const steps = mockTrustChain.slice(0, maxSteps)

  const getActorColor = (actor: HederaDID) => {
    const colorMap: Record<string, string> = {
      'Issuer': 'bg-blue-100 text-blue-700 border-blue-300',
      'Shariah Supervisor': 'bg-purple-100 text-purple-700 border-purple-300',
      'External Auditor': 'bg-orange-100 text-orange-700 border-orange-300',
      'Investor': 'bg-green-100 text-green-700 border-green-300',
      'Regulator': 'bg-red-100 text-red-700 border-red-300',
      'Credential Issuer': 'bg-gray-100 text-gray-700 border-gray-300'
    }
    return colorMap[actor.role] || 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Trust Chain Visualization</h3>
          <p className="text-sm text-muted-foreground">
            Each action is anchored to Hedera via DIDs and VCs
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <LinkIcon className="w-3 h-3" />
          {steps.length} Steps
        </Badge>
      </div>

      {/* Timeline */}
      <div className="relative">
        {steps.map((step, index) => {
          const verifications = showVerifications ? getVerificationsForVC(step.credentialIssued.id) : []
          const isHighlighted = highlightStep === step.id
          const isSelected = selectedStep?.id === step.id

          return (
            <div key={step.id} className="relative">
              {/* Vertical connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-purple-300" />
              )}

              {/* Step Card */}
              <Card
                className={`mb-4 transition-all cursor-pointer ${
                  isHighlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''
                } ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
                onClick={() => setSelectedStep(isSelected ? null : step)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Step Number Circle */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                        {index + 1}
                      </div>
                      {step.status === 'completed' && (
                        <CheckCircle2 className="absolute -bottom-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      {/* Actor & Timestamp */}
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`gap-1 ${getActorColor(step.actor)}`}>
                          <Users className="w-3 h-3" />
                          {step.actor.name}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(step.timestamp)}
                        </div>
                      </div>

                      {/* Action */}
                      <h4 className="font-semibold text-base mb-2">{step.action}</h4>

                      {/* Credential Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">VC Issued:</span>
                          <code className="text-xs bg-blue-50 px-2 py-0.5 rounded">
                            {step.credentialIssued.id.split(':').pop()?.substring(0, 20)}...
                          </code>
                        </div>

                        {/* HCS Anchoring */}
                        <div className="flex items-center gap-2 text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                          <FileCheck className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-700">Anchored to HCS:</span>
                          <code className="text-xs bg-white px-2 py-0.5 rounded border border-green-300">
                            {step.credentialIssued.hcsTopicId}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 gap-1 text-green-700 hover:text-green-800 ml-auto"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(step.credentialIssued.hashScanUrl, '_blank')
                            }}
                          >
                            <ExternalLink className="w-3 h-3" />
                            HashScan
                          </Button>
                        </div>

                        {/* Verifications */}
                        {showVerifications && verifications.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center gap-2 mb-2">
                              <Eye className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium">Verified By:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {verifications.map((verification) => {
                                const verifier = Object.values(mockDIDs).find(
                                  did => did.id === verification.verifier.id
                                )
                                return (
                                  <Badge
                                    key={verification.id}
                                    variant="outline"
                                    className="gap-1 bg-purple-50 border-purple-300 text-purple-700"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    {verifier?.name}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Dependencies */}
                        {step.dependencies && step.dependencies.length > 0 && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Depends on: Step {step.dependencies.map(d => steps.findIndex(s => s.id === d) + 1).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t bg-gray-50 -m-4 p-4 rounded-b-lg">
                      <h5 className="font-semibold text-sm mb-2">Credential Details:</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Credential Type:</span>
                          <span className="font-medium">
                            {step.credentialIssued.type.filter(t => t !== 'VerifiableCredential').join(', ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Issuer DID:</span>
                          <code className="text-xs bg-white px-2 py-0.5 rounded">
                            {step.credentialIssued.issuer.id.substring(0, 40)}...
                          </code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">HCS Message ID:</span>
                          <code className="text-xs bg-white px-2 py-0.5 rounded">
                            {step.credentialIssued.hcsMessageId}
                          </code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Proof Type:</span>
                          <span className="font-medium">{step.credentialIssued.proof.type}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <span className="font-semibold">Verifiable Credential (VC):</span> Cryptographically signed proof of an action (e.g., Shariah approval, capital verification)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileCheck className="w-4 h-4 text-green-600 mt-0.5" />
            <div>
              <span className="font-semibold">HCS Anchoring:</span> Credential hash recorded to Hedera Consensus Service for immutable timestamping
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-purple-600 mt-0.5" />
            <div>
              <span className="font-semibold">External Verification:</span> Third parties verify VCs independently via HashScan without accessing private data
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ExternalLink className="w-4 h-4 text-orange-600 mt-0.5" />
            <div>
              <span className="font-semibold">HashScan:</span> Public blockchain explorer where anyone can verify the credential's on-chain timestamp and integrity
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
