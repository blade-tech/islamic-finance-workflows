'use client'

/**
 * EXTERNAL VERIFIER DASHBOARD COMPONENT
 * ======================================
 * Simulates how external parties verify Verifiable Credentials independently.
 *
 * FEATURES:
 * - Switch between verifier personas (Investor, Auditor, Regulator)
 * - View available VCs for verification
 * - Verify VCs via HashScan, Guardian API, or DID Resolver
 * - Display verification results with full transparency
 * - No access to private bank data - only public credentials
 */

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle2,
  XCircle,
  Shield,
  ExternalLink,
  Eye,
  Search,
  FileCheck,
  AlertCircle,
  Users,
  Lock,
  Unlock,
  Clock
} from 'lucide-react'
import {
  mockDIDs,
  mockVCs,
  mockExternalVerifications,
  getVCById,
  type HederaDID,
  type VerifiableCredential,
  type ExternalVerification
} from '@/lib/mock-data/hedera-trust-chain'

type VerifierRole = 'investor' | 'auditor' | 'regulator'

interface ExternalVerifierDashboardProps {
  defaultRole?: VerifierRole
}

export function ExternalVerifierDashboard({
  defaultRole = 'investor'
}: ExternalVerifierDashboardProps) {
  const [selectedRole, setSelectedRole] = useState<VerifierRole>(defaultRole)
  const [selectedVC, setSelectedVC] = useState<VerifiableCredential | null>(null)
  const [verificationInProgress, setVerificationInProgress] = useState(false)
  const [verificationResult, setVerificationResult] = useState<ExternalVerification | null>(null)

  const verifierMap: Record<VerifierRole, HederaDID> = {
    investor: mockDIDs.investor,
    auditor: mockDIDs.externalAuditor,
    regulator: mockDIDs.qcbRegulator
  }

  const currentVerifier = verifierMap[selectedRole]

  // Get VCs relevant to this verifier
  const getRelevantVCs = () => {
    // All VCs are public and verifiable by anyone
    return mockVCs
  }

  const handleVerify = async (vc: VerifiableCredential, method: 'hashscan' | 'guardian-api' | 'did-resolver') => {
    setVerificationInProgress(true)
    setSelectedVC(vc)

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Find existing verification or create new one
    const existingVerification = mockExternalVerifications.find(
      v => v.credentialId === vc.id && v.verifier.id === currentVerifier.id
    )

    const newVerification: ExternalVerification = existingVerification || {
      id: `verify-${Date.now()}`,
      verifier: currentVerifier,
      credentialId: vc.id,
      verificationTimestamp: new Date().toISOString(),
      verificationMethod: method,
      result: 'valid',
      notes: `Verified via ${method}. Credential signature valid, HCS timestamp confirmed, issuer DID verified.`
    }

    setVerificationResult(newVerification)
    setVerificationInProgress(false)
  }

  const getVCTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'ShariahComplianceCredential': 'bg-purple-100 text-purple-700 border-purple-300',
      'CapitalVerificationCredential': 'bg-blue-100 text-blue-700 border-blue-300',
      'ProfitCalculationCredential': 'bg-green-100 text-green-700 border-green-300',
      'ComplianceAttestationCredential': 'bg-orange-100 text-orange-700 border-orange-300'
    }
    const credType = type.replace('VerifiableCredential', '')
    return colorMap[credType] || 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header with Role Selector */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-600" />
                External Verifier Dashboard
              </CardTitle>
              <CardDescription>
                Verify credentials independently without accessing private data
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1 bg-white">
              <Lock className="w-3 h-3" />
              Read-Only Access
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Viewing as:</span>
            <div className="flex gap-2">
              {(['investor', 'auditor', 'regulator'] as VerifierRole[]).map((role) => {
                const did = verifierMap[role]
                return (
                  <Button
                    key={role}
                    size="sm"
                    variant={selectedRole === role ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedRole(role)
                      setSelectedVC(null)
                      setVerificationResult(null)
                    }}
                    className={selectedRole === role ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {did.name}
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Verifier Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Organization:</span>
              <p className="font-semibold">{currentVerifier.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Role:</span>
              <p className="font-semibold">{currentVerifier.role}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Hedera Account:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {currentVerifier.hederaAccountId}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available VCs to Verify */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Available Credentials to Verify
          </CardTitle>
          <CardDescription>
            All credentials are publicly verifiable via Hedera blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getRelevantVCs().map((vc) => {
              const isSelected = selectedVC?.id === vc.id
              const credType = vc.type.filter(t => t !== 'VerifiableCredential')[0] || 'Unknown'

              return (
                <Card
                  key={vc.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-green-500 shadow-md' : 'hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedVC(vc)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`gap-1 ${getVCTypeColor(credType)}`}>
                            <Shield className="w-3 h-3" />
                            {credType.replace('Credential', '')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatDate(vc.issuanceDate)}
                          </span>
                        </div>

                        <h4 className="font-semibold text-sm mb-1">
                          {vc.credentialSubject.action}
                        </h4>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Issued by: {vc.issuer.name}</span>
                          <span>•</span>
                          <span>HCS: {vc.hcsTopicId}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleVerify(vc, 'hashscan')
                          }}
                          disabled={verificationInProgress}
                        >
                          <ExternalLink className="w-3 h-3" />
                          Verify on HashScan
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleVerify(vc, 'guardian-api')
                          }}
                          disabled={verificationInProgress}
                        >
                          <FileCheck className="w-3 h-3" />
                          Guardian API
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Verification Result */}
      {verificationResult && selectedVC && (
        <Card className="border-green-300 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              {verificationResult.result === 'valid' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              Verification Result: {verificationResult.result.toUpperCase()}
            </CardTitle>
            <CardDescription>
              Verified by {currentVerifier.name} via {verificationResult.verificationMethod}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* What You Can Verify */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Unlock className="w-4 h-4 text-green-600" />
                What You Can Verify (Public):
              </h4>
              <ul className="space-y-1 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Credential Authenticity:</strong> Digital signature confirms this credential
                    was issued by {selectedVC.issuer.name}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Timestamp Integrity:</strong> HCS message{' '}
                    <code className="text-xs bg-white px-1 rounded">{selectedVC.hcsMessageId}</code>
                    {' '}confirms this action occurred at {formatDate(selectedVC.hcsTimestamp)}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Immutability:</strong> Record cannot be altered or deleted (anchored to Hedera blockchain)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Action Details:</strong> {selectedVC.credentialSubject.action}
                  </span>
                </li>
              </ul>
            </div>

            {/* What You Cannot See */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                What You Cannot See (Private):
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <span>Internal bank account numbers or customer data</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <span>Detailed transaction histories or sensitive financial records</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <span>Shariah Board internal deliberations or confidential fatwas</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <span>Proprietary risk models or compliance strategies</span>
                </li>
              </ul>
            </div>

            {/* Verification Method Details */}
            <div className="bg-white p-3 rounded-lg border border-green-300">
              <h4 className="font-semibold text-sm mb-2">Verification Method:</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {verificationResult.notes}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => window.open(selectedVC.hashScanUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                View on HashScan Explorer
              </Button>
            </div>

            {/* Use Cases by Role */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                How This Helps You ({currentVerifier.role}):
              </h4>
              {selectedRole === 'investor' && (
                <p className="text-sm">
                  As an investor, you can verify that Qatar Islamic Bank has obtained Shariah approval,
                  verified capital, and maintains ongoing compliance - all without accessing their
                  internal systems or sensitive data. This builds trust for your investment decision.
                </p>
              )}
              {selectedRole === 'auditor' && (
                <p className="text-sm">
                  As an auditor, you can verify the timing and authenticity of compliance actions
                  for your audit report. The immutable blockchain timestamp proves when each action
                  occurred, supporting your audit trail requirements.
                </p>
              )}
              {selectedRole === 'regulator' && (
                <p className="text-sm">
                  As a regulator, you can monitor compliance in real-time via publicly verifiable
                  credentials. This enables continuous regulatory oversight without requiring direct
                  access to the bank's systems, reducing compliance burden while maintaining transparency.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {verificationInProgress && (
        <Card className="border-blue-300 bg-blue-50">
          <CardContent className="p-6 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-blue-700">Verifying credential on Hedera...</span>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
