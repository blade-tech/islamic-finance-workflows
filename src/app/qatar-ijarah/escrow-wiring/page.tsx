'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIjarahStore } from '@/lib/qatar-ijarah/ijarah-store'
import { PodCard } from '@/lib/qatar-ijarah/pod-components'
import type {
  PodStatus,
  HCSAnchorPodOutput,
  PETMintDecisionPodOutput,
  HTSMintDeliverPodOutput
} from '@/lib/qatar-ijarah/pod-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  DollarSign,
  Building2,
  ArrowRight,
  Shield,
  AlertTriangle,
  FileCheck,
  Banknote,
  Coins,
  Sparkles,
  ExternalLink
} from 'lucide-react'

interface BuyerPayment {
  id: string
  buyerId: string
  buyerName: string
  unitId: string
  amount: number
  currency: string
  date: string
  verified: boolean
  allocated: boolean
  petProcessing?: boolean
  petMinted?: boolean
  petTokenId?: string
  petSerialNumber?: number
}

export default function EscrowWiringPage() {
  const router = useRouter()
  const { currentProject, escrowAccount, loadDemoData } = useIjarahStore()
  const [buyerPayments, setBuyerPayments] = useState<BuyerPayment[]>([
    { id: 'bp-001', buyerId: 'buyer-001', buyerName: 'Ahmed Al-Thani', unitId: 'unit-12', amount: 500000, currency: 'QAR', date: '2025-01-15', verified: true, allocated: true },
    { id: 'bp-002', buyerId: 'buyer-002', buyerName: 'Fatima Al-Kuwari', unitId: 'unit-08', amount: 750000, currency: 'QAR', date: '2025-01-16', verified: true, allocated: true },
    { id: 'bp-003', buyerId: 'buyer-003', buyerName: 'Mohammed Al-Sulaiti', unitId: 'unit-15', amount: 600000, currency: 'QAR', date: '2025-01-18', verified: false, allocated: false },
  ])

  // PET workflow state
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)
  const [showPetWorkflow, setShowPetWorkflow] = useState(false)

  // Pod states
  const [hcsStatus, setHcsStatus] = useState<PodStatus>('idle')
  const [hcsOutput, setHcsOutput] = useState<HCSAnchorPodOutput | null>(null)

  const [mintDecisionStatus, setMintDecisionStatus] = useState<PodStatus>('idle')
  const [mintDecisionOutput, setMintDecisionOutput] = useState<PETMintDecisionPodOutput | null>(null)

  const [htsMintStatus, setHtsMintStatus] = useState<PodStatus>('idle')
  const [htsMintOutput, setHtsMintOutput] = useState<HTSMintDeliverPodOutput | null>(null)

  useEffect(() => {
    if (!currentProject) {
      loadDemoData()
    }
  }, [currentProject, loadDemoData])

  const handleVerifyPayment = (paymentId: string) => {
    setBuyerPayments(prev =>
      prev.map(p => p.id === paymentId ? { ...p, verified: true, allocated: true } : p)
    )
  }

  // PET Workflow Handlers
  const handleProcessPET = async (paymentId: string) => {
    const payment = buyerPayments.find(p => p.id === paymentId)
    if (!payment) return

    setSelectedPaymentId(paymentId)
    setShowPetWorkflow(true)

    // Mark payment as processing
    setBuyerPayments(prev =>
      prev.map(p => p.id === paymentId ? { ...p, petProcessing: true } : p)
    )

    // Pod #7: HCS Anchor (auto) - 2 sec
    setHcsStatus('intake')
    await new Promise(resolve => setTimeout(resolve, 1000))
    setHcsStatus('evaluating')
    await new Promise(resolve => setTimeout(resolve, 1000))
    setHcsStatus('completed')

    // Mock HCS receipt
    setHcsOutput({
      status: 'completed',
      recommendation: 'ALLOW',
      reasons: [
        'CoV-VC hash computed and validated',
        'Evidence hashes aggregated',
        'Message submitted to HCS topic 0.0.12345'
      ],
      evidence_refs: ['/cov-vc/payment-' + payment.id + '.json'],
      next_actions: ['Proceed to mint decision'],
      hcs_receipt: {
        topic_id: '0.0.12345',
        sequence_number: 100000 + Math.floor(Math.random() * 10000),
        consensus_timestamp: new Date().toISOString(),
        running_hash: 'sha384:' + Math.random().toString(36).substring(2, 15),
        message_hash: 'sha256:' + Math.random().toString(36).substring(2, 15)
      }
    })

    // Small delay before next pod
    await new Promise(resolve => setTimeout(resolve, 500))

    // Pod #8: PET Mint Decision (HITL) - waits for user approval
    setMintDecisionStatus('intake')
    await new Promise(resolve => setTimeout(resolve, 800))
    setMintDecisionStatus('evaluating')
    await new Promise(resolve => setTimeout(resolve, 1200))
    setMintDecisionStatus('proposing')

    // Mock mint decision output
    setMintDecisionOutput({
      status: 'proposed',
      recommendation: 'ALLOW',
      reasons: [
        'DAR Article 9 compliant: Not a means of payment',
        'DAR Article 12 compliant: CoV-VC → request → mint steps followed',
        'Token config validated: KYC + Freeze + Pause + Wipe enabled',
        'Investor KYC completed and verified'
      ],
      evidence_refs: ['/compliance/dar-check-' + payment.id + '.pdf'],
      next_actions: [
        'Approve to mint HTS NFT',
        'PET will be non-transferable (KYC-only)',
        'Investor wallet will receive token'
      ],
      time_saved: '12 minutes',
      confidence: 100,
      mint_config: {
        token_type: 'PET-Receipt',
        kyc_required: true,
        freeze_default: true,
        pause_enabled: true,
        wipe_enabled: true,
        transfer_restrictions: 'kyc_only',
        dar_article_9_compliant: true,
        dar_article_12_compliant: true
      },
      validation_checklist: {
        cov_vc_valid: true,
        evidence_complete: true,
        not_means_of_payment: true,
        permitted_token_status: true,
        investor_kyc_complete: true
      }
    })
  }

  const handleMintDecisionApprove = async () => {
    if (!selectedPaymentId) return
    const payment = buyerPayments.find(p => p.id === selectedPaymentId)
    if (!payment) return

    setMintDecisionStatus('executing')
    await new Promise(resolve => setTimeout(resolve, 500))
    setMintDecisionStatus('completed')

    // Pod #9: HTS Mint & Deliver (auto) - 3 sec
    await new Promise(resolve => setTimeout(resolve, 500))
    setHtsMintStatus('intake')
    await new Promise(resolve => setTimeout(resolve, 800))
    setHtsMintStatus('evaluating')
    await new Promise(resolve => setTimeout(resolve, 1200))
    setHtsMintStatus('executing')
    await new Promise(resolve => setTimeout(resolve, 1000))
    setHtsMintStatus('completed')

    // Mock HTS token
    const tokenId = '0.0.' + (5555555 + Math.floor(Math.random() * 10000))
    const serialNumber = Math.floor(Math.random() * 100) + 1

    setHtsMintOutput({
      status: 'completed',
      recommendation: 'ALLOW',
      reasons: [
        'HTS NFT created with token ID ' + tokenId,
        'Investor account associated',
        'KYC granted to investor only',
        'Token transferred successfully'
      ],
      evidence_refs: ['/hts/token-' + tokenId + '.json'],
      next_actions: [
        'View token on HashScan',
        'Investor can view PET in wallet'
      ],
      time_saved: '5 minutes',
      pet_token: {
        token_id: tokenId,
        serial_number: serialNumber,
        minted_at: new Date().toISOString(),
        delivered_to: '0.0.' + (payment.buyerId.replace('buyer-', '') + '00000'),
        hashscan_url: `https://hashscan.io/testnet/token/${tokenId}`,
        metadata: {
          version: '1.0',
          type: 'PET-Receipt',
          hcsTopic: hcsOutput?.hcs_receipt?.topic_id || '0.0.12345',
          hcsSequence: hcsOutput?.hcs_receipt?.sequence_number || 100000,
          covVcCid: 'ipfs://bafy' + Math.random().toString(36).substring(2, 15),
          evidenceCids: [
            'ipfs://bafy' + Math.random().toString(36).substring(2, 15),
            'ipfs://bafy' + Math.random().toString(36).substring(2, 15)
          ],
          contractId: 'ctr_Alpha_01',
          milestoneId: 'm1',
          amount: payment.amount.toString(),
          currency: payment.currency,
          payerDID: 'did:hedera:testnet:' + payment.buyerId,
          validatorDID: 'did:hedera:testnet:validator_qiib',
          rightsRegisterRef: `rr://alpha/ctr_Alpha_01/m1/${payment.id}`,
          issuedAt: new Date().toISOString()
        }
      },
      rights_register_updated: true
    })

    // Update payment with PET info
    setBuyerPayments(prev =>
      prev.map(p => p.id === selectedPaymentId ? {
        ...p,
        petProcessing: false,
        petMinted: true,
        petTokenId: tokenId,
        petSerialNumber: serialNumber
      } : p)
    )
  }

  const handleMintDecisionReject = () => {
    if (!selectedPaymentId) return

    setBuyerPayments(prev =>
      prev.map(p => p.id === selectedPaymentId ? { ...p, petProcessing: false } : p)
    )

    // Reset workflow
    setShowPetWorkflow(false)
    setSelectedPaymentId(null)
    setHcsStatus('idle')
    setHcsOutput(null)
    setMintDecisionStatus('idle')
    setMintDecisionOutput(null)
    setHtsMintStatus('idle')
    setHtsMintOutput(null)
  }

  const handleClosePetWorkflow = () => {
    setShowPetWorkflow(false)
    setSelectedPaymentId(null)
    setHcsStatus('idle')
    setHcsOutput(null)
    setMintDecisionStatus('idle')
    setMintDecisionOutput(null)
    setHtsMintStatus('idle')
    setHtsMintOutput(null)
  }

  if (!currentProject || !escrowAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading escrow data...</p>
        </div>
      </div>
    )
  }

  const verifiedPayments = buyerPayments.filter(p => p.verified).length
  const totalPayments = buyerPayments.length
  const verificationProgress = (verifiedPayments / totalPayments) * 100

  const totalReceived = buyerPayments.reduce((sum, p) => sum + (p.verified ? p.amount : 0), 0)
  const totalAllocated = buyerPayments.reduce((sum, p) => sum + (p.allocated ? p.amount : 0), 0)
  const unallocatedFunds = totalReceived - totalAllocated

  const escrowCompliant = escrowAccount.qcbCompliant && verifiedPayments === totalPayments

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/qatar-ijarah')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Scene 2: Escrow Wiring</h1>
                <p className="text-sm text-gray-600">QCB Circular 2/2025 Compliance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={escrowCompliant ? "default" : "secondary"} className="text-sm px-3 py-1">
                {escrowCompliant ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    QCB Compliant
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Pending Verification
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Escrow Account Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center text-lg">
                  <Lock className="h-5 w-5 mr-2 text-blue-600" />
                  Escrow Account
                </CardTitle>
                <CardDescription>QCB Circular 2/2025 Art.2</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Number</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">
                    {escrowAccount.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bank Name</p>
                  <p className="text-gray-900">{escrowAccount.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Type</p>
                  <Badge variant="outline" className="capitalize">
                    {escrowAccount.accountType}
                  </Badge>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">QCB Compliance Status</p>
                  <div className="flex items-center space-x-2">
                    {escrowAccount.qcbCompliant ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">Compliant</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-semibold text-orange-700">Pending Setup</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {escrowAccount.currency} {escrowAccount.balance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Received</p>
                  <p className="text-lg font-semibold text-gray-900">
                    QAR {totalReceived.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Allocated</p>
                  <p className="text-lg font-semibold text-gray-900">
                    QAR {totalAllocated.toLocaleString()}
                  </p>
                </div>
                {unallocatedFunds > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Unallocated Funds</p>
                    <p className="text-lg font-semibold text-orange-600">
                      QAR {unallocatedFunds.toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm text-blue-900">Control Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-blue-800 font-mono mb-2">IJR-B6: Escrow Compliance</p>
                <p className="text-sm text-blue-900 mb-3">
                  QCB Circular 2/2025 Art.2 requires all off-plan buyer funds in escrow accounts.
                </p>
                <div className="space-y-2 text-xs text-blue-800">
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Separate escrow account</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Authority-approved bank</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Verified buyer payments</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Milestone-based disbursement</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Payment Processing */}
          <div className="lg:col-span-2 space-y-6">
            {/* Verification Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
                    Payment Verification Progress
                  </span>
                  <Badge variant="outline">
                    {verifiedPayments} / {totalPayments} Verified
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex justify-between items-center">
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <p className="text-sm font-semibold text-gray-900">{Math.round(verificationProgress)}%</p>
                </div>
                <Progress value={verificationProgress} className="h-2" />
              </CardContent>
            </Card>

            {/* Buyer Payments */}
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardTitle className="flex items-center">
                  <Banknote className="h-6 w-6 mr-2 text-blue-600" />
                  Buyer Payments
                </CardTitle>
                <CardDescription>
                  Incoming payments from off-plan unit buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {buyerPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className={`p-4 rounded-lg border-2 ${
                        payment.verified
                          ? 'bg-green-50 border-green-200'
                          : 'bg-orange-50 border-orange-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            payment.verified ? 'bg-green-100' : 'bg-orange-100'
                          }`}>
                            {payment.verified ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-orange-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{payment.buyerName}</h4>
                            <p className="text-sm text-gray-600">Unit {payment.unitId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {payment.currency} {payment.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(payment.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">Verification:</span>
                          <Badge variant={payment.verified ? 'default' : 'secondary'} className="text-xs">
                            {payment.verified ? 'Verified' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">Allocation:</span>
                          <Badge variant={payment.allocated ? 'default' : 'secondary'} className="text-xs">
                            {payment.allocated ? 'Allocated' : 'Pending'}
                          </Badge>
                        </div>
                      </div>

                      {!payment.verified && (
                        <div className="pt-3 border-t border-orange-300">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-orange-800">
                              <AlertTriangle className="h-4 w-4 inline mr-1" />
                              Payment requires verification
                            </p>
                            <Button
                              size="sm"
                              onClick={() => handleVerifyPayment(payment.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Verify Payment
                            </Button>
                          </div>
                        </div>
                      )}

                      {payment.verified && !payment.petMinted && !payment.petProcessing && (
                        <div className="pt-3 border-t border-green-300">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-green-800 flex items-center">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Payment verified and allocated
                            </p>
                            <Button
                              size="sm"
                              onClick={() => handleProcessPET(payment.id)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <Coins className="h-4 w-4 mr-2" />
                              Process Payment Token
                            </Button>
                          </div>
                        </div>
                      )}

                      {payment.petProcessing && (
                        <div className="pt-3 border-t border-purple-300">
                          <p className="text-sm text-purple-800 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                            Processing PET (Payment Evidence Token)...
                          </p>
                        </div>
                      )}

                      {payment.petMinted && (
                        <div className="pt-3 border-t border-blue-300">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm font-semibold text-blue-900 flex items-center mb-2">
                              <Coins className="h-4 w-4 mr-2" />
                              Payment Evidence Token (PET) Minted
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-blue-700">Token ID:</span>
                                <p className="font-mono font-semibold text-blue-900">{payment.petTokenId}</p>
                              </div>
                              <div>
                                <span className="text-blue-700">Serial:</span>
                                <p className="font-semibold text-blue-900">#{payment.petSerialNumber}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full mt-2 text-xs"
                              asChild
                            >
                              <a
                                href={`https://hashscan.io/testnet/token/${payment.petTokenId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View on HashScan
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fund Flow Diagram */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fund Flow</CardTitle>
                <CardDescription>How buyer payments flow through the escrow system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-8">
                  <div className="text-center flex-1">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Buyer Payment</p>
                    <p className="text-xs text-gray-600 mt-1">Wire transfer</p>
                  </div>

                  <ArrowRight className="h-8 w-8 text-gray-400 flex-shrink-0 mx-4" />

                  <div className="text-center flex-1">
                    <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-2">
                      <Lock className="h-8 w-8 text-cyan-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Escrow Account</p>
                    <p className="text-xs text-gray-600 mt-1">QCB-compliant</p>
                  </div>

                  <ArrowRight className="h-8 w-8 text-gray-400 flex-shrink-0 mx-4" />

                  <div className="text-center flex-1">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Verification</p>
                    <p className="text-xs text-gray-600 mt-1">Auto-reconciliation</p>
                  </div>

                  <ArrowRight className="h-8 w-8 text-gray-400 flex-shrink-0 mx-4" />

                  <div className="text-center flex-1">
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                      <Building2 className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">Unit Sub-Ledger</p>
                    <p className="text-xs text-gray-600 mt-1">Allocation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            {escrowCompliant && (
              <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900">Escrow Setup Complete!</h3>
                        <p className="text-sm text-blue-700">
                          All payments verified. Ready to track construction progress.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push('/qatar-ijarah')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continue to Next Scene
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* PET Workflow Modal */}
      {showPetWorkflow && selectedPaymentId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Payment Evidence Token (PET) Workflow</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    QFC Digital Asset Regulations 2024 - Track A (Receipt-Only)
                  </p>
                </div>
                {htsMintStatus === 'completed' && (
                  <Button
                    onClick={handleClosePetWorkflow}
                    variant="outline"
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Info */}
              <Card className="border-2 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Processing payment from:</p>
                      <p className="text-lg font-semibold">
                        {buyerPayments.find(p => p.id === selectedPaymentId)?.buyerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Amount:</p>
                      <p className="text-lg font-semibold">
                        {buyerPayments.find(p => p.id === selectedPaymentId)?.currency}{' '}
                        {buyerPayments.find(p => p.id === selectedPaymentId)?.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pod #7: HCS Anchor */}
              <Card className="border-2 border-blue-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="flex items-center">
                    <Badge className="bg-blue-600 mr-2">Pod #7</Badge>
                    HCS Anchor Pod
                  </CardTitle>
                  <CardDescription>
                    Posts CoV-VC and evidence hashes to Hedera Consensus Service
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {hcsStatus !== 'idle' && (
                    <PodCard
                      podId="hcs-anchor"
                      status={hcsStatus}
                      output={hcsOutput}
                      compact={false}
                    />
                  )}
                  {hcsOutput?.hcs_receipt && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-2">HCS Receipt</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-blue-700">Topic ID:</span>
                          <p className="font-mono font-semibold text-blue-900">
                            {hcsOutput.hcs_receipt.topic_id}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-700">Sequence:</span>
                          <p className="font-semibold text-blue-900">
                            #{hcsOutput.hcs_receipt.sequence_number}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-blue-700">Consensus Timestamp:</span>
                          <p className="font-mono text-xs text-blue-900">
                            {new Date(hcsOutput.hcs_receipt.consensus_timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pod #8: PET Mint Decision */}
              {mintDecisionStatus !== 'idle' && (
                <Card className="border-2 border-purple-300">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center">
                      <Badge className="bg-purple-600 mr-2">Pod #8</Badge>
                      PET Mint Decision Pod (HITL)
                    </CardTitle>
                    <CardDescription>
                      Validates permitted-token status per QFC DAR Article 9 and 12
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <PodCard
                      podId="pet-mint-decision"
                      status={mintDecisionStatus}
                      output={mintDecisionOutput}
                      onApprove={handleMintDecisionApprove}
                      onReject={handleMintDecisionReject}
                      compact={false}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Pod #9: HTS Mint & Deliver */}
              {htsMintStatus !== 'idle' && (
                <Card className="border-2 border-green-300">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="flex items-center">
                      <Badge className="bg-green-600 mr-2">Pod #9</Badge>
                      HTS Mint & Deliver Pod
                    </CardTitle>
                    <CardDescription>
                      Mints HTS NFT and delivers to investor wallet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <PodCard
                      podId="hts-mint-deliver"
                      status={htsMintStatus}
                      output={htsMintOutput}
                      compact={false}
                    />
                    {htsMintOutput?.pet_token && htsMintStatus === 'completed' && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-semibold text-green-900 mb-3 flex items-center">
                          <Coins className="h-4 w-4 mr-2" />
                          Payment Evidence Token (PET) Details
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                          <div>
                            <span className="text-green-700">Token ID:</span>
                            <p className="font-mono font-semibold text-green-900">
                              {htsMintOutput.pet_token.token_id}
                            </p>
                          </div>
                          <div>
                            <span className="text-green-700">Serial Number:</span>
                            <p className="font-semibold text-green-900">
                              #{htsMintOutput.pet_token.serial_number}
                            </p>
                          </div>
                          <div>
                            <span className="text-green-700">Type:</span>
                            <p className="font-semibold text-green-900">
                              {htsMintOutput.pet_token.metadata.type}
                            </p>
                          </div>
                          <div>
                            <span className="text-green-700">Delivered To:</span>
                            <p className="font-mono text-xs text-green-900">
                              {htsMintOutput.pet_token.delivered_to}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a
                            href={htsMintOutput.pet_token.hashscan_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View PET on HashScan
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
