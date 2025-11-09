/**
 * SCENE 5: RENT GATING (SHOWSTOPPER) - Enhanced with Gatekeeping Pod
 * ====================================================================
 * Hard gate that blocks rent billing until usufruct delivered
 * Now features AI-assisted validation with 96% time savings
 *
 * Control: IJR-A1 (Lease Commencement Control)
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  Calendar,
  TrendingDown,
  ExternalLink,
  Hash,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react'
import { useIjarahStore } from '@/lib/qatar-ijarah/ijarah-store'
import { getControlById } from '@/lib/qatar-ijarah/ijarah-controls'
import { PodCard, BeforeAfterMetrics } from '@/lib/qatar-ijarah/pod-components'
import type { PodStatus, GatekeepingPodOutput, EvidenceIntakePodOutput } from '@/lib/qatar-ijarah/pod-types'

export default function RentGatingPage() {
  const rentGate = useIjarahStore(state => state.rentGate)
  const currentProject = useIjarahStore(state => state.currentProject)
  const updateRentGate = useIjarahStore(state => state.updateRentGate)
  const unlockRentGate = useIjarahStore(state => state.unlockRentGate)

  const [uploading, setUploading] = useState<string | null>(null)
  const [showVCMinted, setShowVCMinted] = useState(false)

  // Evidence Intake Pod state (Pod #1)
  const [evidencePodStatus, setEvidencePodStatus] = useState<PodStatus>('idle')
  const [evidencePodOutput, setEvidencePodOutput] = useState<EvidenceIntakePodOutput | null>(null)
  const [showEvidencePod, setShowEvidencePod] = useState(false)
  const [currentUploadType, setCurrentUploadType] = useState<string | null>(null)

  // Gatekeeping Pod state (Pod #3)
  const [podStatus, setPodStatus] = useState<PodStatus>('idle')
  const [podOutput, setPodOutput] = useState<GatekeepingPodOutput | null>(null)
  const [showPod, setShowPod] = useState(false)

  const control = getControlById('IJR-A1')

  // Calculate if all evidence is uploaded
  const allEvidenceComplete = rentGate ? (
    rentGate.completionCertificate.uploaded &&
    rentGate.occupancyCertificate.uploaded &&
    rentGate.utilityActivation.uploaded &&
    rentGate.lessorTitle.uploaded
  ) : false

  // Auto-calculate rent adjustment if delivery is late
  const contractualStartDate = rentGate ? new Date(rentGate.contractualStartDate) : new Date()
  const actualDeliveryDate = rentGate?.actualDeliveryDate ? new Date(rentGate.actualDeliveryDate) : null

  const delayDays = actualDeliveryDate && actualDeliveryDate > contractualStartDate
    ? Math.floor((actualDeliveryDate.getTime() - contractualStartDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const monthlyRent = 50000 // QAR
  const dailyRent = monthlyRent / 30
  const rentReduction = delayDays * dailyRent

  // NEW: Trigger Evidence Intake Pod for document uploads
  const handleUpload = async (evidenceType: string) => {
    setCurrentUploadType(evidenceType)
    setShowEvidencePod(true)
    setEvidencePodStatus('intake')

    // Step 1: Intake (1 sec)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setEvidencePodStatus('evaluating')

    // Step 2: OCR & Validation (2.5 sec)
    await new Promise(resolve => setTimeout(resolve, 2500))
    setEvidencePodStatus('proposing')

    // Generate evidence-specific output
    const evidenceLabels: Record<string, { label: string; source: string; hash: string; fields: number }> = {
      'completion': {
        label: 'Completion Certificate',
        source: 'RERA',
        hash: 'sha256:a1b2c3d4e5f6...',
        fields: 12
      },
      'occupancy': {
        label: 'Occupancy Certificate',
        source: 'Ministry of Municipality',
        hash: 'sha256:f1e2d3c4b5a6...',
        fields: 8
      },
      'utility': {
        label: 'Utility Activation Proof',
        source: 'Kahramaa',
        hash: 'sha256:9x8y7z6w5v4u...',
        fields: 6
      },
      'title': {
        label: 'Lessor Title Document',
        source: 'Land Registry',
        hash: 'sha256:3m4n5o6p7q8r...',
        fields: 10
      }
    }

    const evidence = evidenceLabels[evidenceType]

    setEvidencePodOutput({
      status: 'proposed',
      recommendation: 'ALLOW',
      reasons: [
        `OCR extracted ${evidence.fields} fields with 98% confidence`,
        `${evidence.label} verified from ${evidence.source}`,
        `Document hash computed: ${evidence.hash}`,
        'All required fields present and valid'
      ],
      evidence_refs: [`/evidence/${evidenceType}-cert.pdf`],
      next_actions: [
        'Approve to add to evidence bundle',
        'Document will be hash-verified and stored'
      ],
      time_saved: '8 minutes 30 seconds',
      confidence: 98,
      evidence_bundle: {
        manifest: [
          {
            filename: `${evidenceType}-cert.pdf`,
            hash: evidence.hash,
            extracted_fields: {
              document_type: evidence.label,
              source: evidence.source,
              issuer: evidence.source,
              verified: true,
              uploaded_at: new Date().toISOString()
            },
            checklist_item: evidence.label,
            ocr_confidence: 98
          }
        ],
        checklist_status: {
          total: 4,
          complete: [
            rentGate?.completionCertificate.uploaded,
            rentGate?.occupancyCertificate.uploaded,
            rentGate?.utilityActivation.uploaded,
            rentGate?.lessorTitle.uploaded
          ].filter(Boolean).length + 1, // +1 for current upload
          missing: []
        }
      }
    })
  }

  // NEW: Approve Evidence Intake Pod output
  const handleEvidencePodApprove = async () => {
    if (!currentUploadType) return

    setEvidencePodStatus('executing')

    const now = new Date().toISOString()
    const evidenceLabels: Record<string, { documentUrl: string; hash: string; source: string }> = {
      'completion': {
        documentUrl: '/evidence/completion-cert.pdf',
        hash: 'sha256:a1b2c3d4e5f6...',
        source: 'RERA'
      },
      'occupancy': {
        documentUrl: '/evidence/occupancy-cert.pdf',
        hash: 'sha256:f1e2d3c4b5a6...',
        source: 'Ministry of Municipality'
      },
      'utility': {
        documentUrl: '/evidence/utility-activation.pdf',
        hash: 'sha256:9x8y7z6w5v4u...',
        source: 'Kahramaa'
      },
      'title': {
        documentUrl: '/evidence/lessor-title.pdf',
        hash: 'sha256:3m4n5o6p7q8r...',
        source: 'Land Registry'
      }
    }

    const evidence = evidenceLabels[currentUploadType]

    // Update specific evidence item in store
    switch (currentUploadType) {
      case 'completion':
        updateRentGate({
          completionCertificate: {
            uploaded: true,
            documentUrl: evidence.documentUrl,
            uploadDate: now,
            verified: true,
            hash: evidence.hash,
            source: evidence.source
          },
          // Set actual delivery date to 45 days after contractual (for demo)
          actualDeliveryDate: new Date(contractualStartDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        break
      case 'occupancy':
        updateRentGate({
          occupancyCertificate: {
            uploaded: true,
            documentUrl: evidence.documentUrl,
            uploadDate: now,
            verified: true,
            hash: evidence.hash,
            source: evidence.source
          }
        })
        break
      case 'utility':
        updateRentGate({
          utilityActivation: {
            uploaded: true,
            documentUrl: evidence.documentUrl,
            uploadDate: now,
            verified: true,
            hash: evidence.hash,
            source: evidence.source
          }
        })
        break
      case 'title':
        updateRentGate({
          lessorTitle: {
            uploaded: true,
            documentUrl: evidence.documentUrl,
            uploadDate: now,
            verified: true,
            hash: evidence.hash,
            source: evidence.source
          }
        })
        break
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    setEvidencePodStatus('completed')

    // Reset after 1 second
    setTimeout(() => {
      setShowEvidencePod(false)
      setEvidencePodStatus('idle')
      setEvidencePodOutput(null)
      setCurrentUploadType(null)
    }, 1000)
  }

  const handleEvidencePodReject = () => {
    setShowEvidencePod(false)
    setEvidencePodStatus('idle')
    setEvidencePodOutput(null)
    setCurrentUploadType(null)
  }

  // NEW: Run Gatekeeping Pod
  const handleRunPodCheck = async () => {
    setShowPod(true)
    setPodStatus('intake')

    await new Promise(resolve => setTimeout(resolve, 1500))
    setPodStatus('evaluating')

    await new Promise(resolve => setTimeout(resolve, 2000))
    setPodStatus('proposing')

    setPodOutput({
      status: 'proposed',
      recommendation: allEvidenceComplete ? 'ALLOW' : 'DENY',
      reasons: allEvidenceComplete ? [
        'All 4 evidence items uploaded and verified',
        'Completion certificate verified (RERA)',
        'Occupancy permit valid (Ministry)',
        'Lessor title confirmed (Land Registry)',
        'AAOIFI SS-9 4/1/3 requirements met'
      ] : [
        `Evidence incomplete: ${4 - [
          rentGate?.completionCertificate.uploaded,
          rentGate?.occupancyCertificate.uploaded,
          rentGate?.utilityActivation.uploaded,
          rentGate?.lessorTitle.uploaded
        ].filter(Boolean).length}/4 items missing`,
        'Cannot activate rent billing without complete evidence'
      ],
      evidence_refs: allEvidenceComplete ? [
        '/evidence/completion-cert.pdf',
        '/evidence/occupancy-cert.pdf',
        '/evidence/utility-activation.pdf',
        '/evidence/lessor-title.pdf'
      ] : [],
      next_actions: allEvidenceComplete ? [
        'Approve to unlock rent gate',
        'Rent billing will activate automatically',
        'Auto-adjustment will apply for 45-day delay'
      ] : [
        'Upload remaining evidence items',
        'Re-run pod check after upload'
      ],
      time_saved: '4 minutes 30 seconds',
      confidence: 100,
      gate_decision: {
        allow: allEvidenceComplete,
        preconditions_met: allEvidenceComplete ? [
          'Completion certificate uploaded',
          'Occupancy permit verified',
          'Utility activation confirmed',
          'Lessor title registered'
        ] : [],
        preconditions_missing: allEvidenceComplete ? [] : [
          !rentGate?.completionCertificate.uploaded && 'Completion certificate',
          !rentGate?.occupancyCertificate.uploaded && 'Occupancy permit',
          !rentGate?.utilityActivation.uploaded && 'Utility activation',
          !rentGate?.lessorTitle.uploaded && 'Lessor title'
        ].filter(Boolean) as string[],
        schedule_delta: delayDays > 0 ? `${delayDays} days late` : undefined,
        amount_delta: delayDays > 0 ? -rentReduction : undefined,
        required_remediation: !allEvidenceComplete ? [
          'Upload all required evidence',
          'Ensure all documents are verified'
        ] : undefined
      }
    })
  }

  const handlePodApprove = async () => {
    setPodStatus('executing')

    // Unlock the rent gate
    unlockRentGate()

    // Simulate VC minting to Hedera
    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowVCMinted(true)

    setPodStatus('completed')
  }

  const handlePodReject = () => {
    setPodStatus('idle')
    setPodOutput(null)
    setShowPod(false)
  }

  if (!rentGate || !currentProject) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Loading rent gate data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        <Link href="/qatar-ijarah" className="hover:text-foreground">Qatar Ijārah Demo</Link>
        <span className="mx-2">→</span>
        <span>Scene 5: Rent Gating</span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Rent Gating</h1>
          <Badge variant="outline">Scene 5 of 9</Badge>
          <Badge className="bg-red-500">⭐ SHOWSTOPPER</Badge>
          <Badge className="bg-purple-500">🤖 2 AI Pods</Badge>
        </div>
        <p className="text-muted-foreground">
          Hard gate enforcing AAOIFI SS-9 4/1/3 with AI-powered evidence intake and validation
        </p>
      </div>

      {/* Control Info */}
      {control && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm">Control: {control.id} - {control.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>Regulatory Source:</strong> {control.ruleSource}
            </div>
            <div>
              <strong>Purpose:</strong> {control.purpose}
            </div>
            <div className="pt-2 border-t">
              <strong>Rule Logic:</strong>
              <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-x-auto">
                {control.ruleLogic}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* HARD GATE STATUS - The Main Visual */}
      <Card className={`p-8 ${
        allEvidenceComplete && rentGate.gateUnlocked
          ? 'bg-green-50 border-green-500 border-2'
          : allEvidenceComplete && !rentGate.gateUnlocked
          ? 'bg-yellow-50 border-yellow-500 border-2'
          : 'bg-red-50 border-red-500 border-2'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Lock Icon - Animated */}
            <div className={`p-6 rounded-full ${
              rentGate.gateUnlocked ? 'bg-green-500' : 'bg-red-500'
            } transition-all duration-500`}>
              {rentGate.gateUnlocked ? (
                <Unlock className="w-16 h-16 text-white" />
              ) : (
                <Lock className="w-16 h-16 text-white" />
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-2">
                {rentGate.gateUnlocked
                  ? '✅ Lease Activated - Rent Billing Authorized'
                  : allEvidenceComplete
                  ? '⚡ Ready for AI Validation'
                  : '🔒 Lease Blocked - Evidence Required'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {rentGate.gateUnlocked
                  ? 'All AAOIFI SS-9 4/1/3 requirements met - rent billing active'
                  : allEvidenceComplete
                  ? 'All evidence verified - run AI pod check to proceed'
                  : 'Cannot bill rent until usufruct delivery is proven (AAOIFI SS-9 4/1/3)'}
              </p>

              {/* VC Minted Notification */}
              {showVCMinted && (
                <div className="mt-4 flex items-center gap-2 text-green-700">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">VC minted to Hedera:</span>
                  <a
                    href="https://hashscan.io/mainnet/transaction/0.0.12345@1730462400.000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Hash className="w-4 h-4" />
                    0.0.12345@1730462400.000
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* AI Check Button */}
          {!rentGate.gateUnlocked && !showPod && (
            <Button
              onClick={handleRunPodCheck}
              disabled={!allEvidenceComplete}
              size="lg"
              className={`text-lg px-8 py-6 ${
                allEvidenceComplete
                  ? 'bg-purple-600 hover:bg-purple-700 animate-pulse'
                  : ''
              }`}
            >
              {allEvidenceComplete ? (
                <>
                  <Brain className="w-6 h-6 mr-2" />
                  Run AI Validation
                </>
              ) : (
                <>
                  <Lock className="w-6 h-6 mr-2" />
                  Evidence Required
                </>
              )}
            </Button>
          )}

          {/* Status Badge */}
          {rentGate.gateUnlocked && (
            <Badge className="text-lg px-6 py-3 bg-green-600">
              <CheckCircle2 className="w-6 h-6 mr-2" />
              Lease Activated
            </Badge>
          )}
        </div>
      </Card>

      {/* Evidence Intake Pod Card (Pod #1) */}
      {showEvidencePod && (
        <Card className="border-2 border-blue-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <Sparkles className="h-6 w-6 mr-2 text-blue-600" />
                  Document Processing
                </CardTitle>
                <CardDescription className="mt-1">
                  Evidence Intake Pod performing OCR and validation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <PodCard
              podId="evidence-intake"
              status={evidencePodStatus}
              output={evidencePodOutput}
              onApprove={handleEvidencePodApprove}
              onReject={handleEvidencePodReject}
              compact={false}
            />
          </CardContent>
        </Card>
      )}

      {/* AI Gatekeeping Pod Card (Pod #3) */}
      {showPod && !rentGate.gateUnlocked && (
        <Card className="border-2 border-purple-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <Zap className="h-6 w-6 mr-2 text-purple-600" />
                  AI-Assisted Validation
                </CardTitle>
                <CardDescription className="mt-1">
                  Gatekeeping Pod analyzing preconditions for rent activation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <PodCard
              podId="gatekeeping"
              status={podStatus}
              output={podOutput}
              onApprove={handlePodApprove}
              onReject={handlePodReject}
              compact={false}
            />
          </CardContent>
        </Card>
      )}

      {/* Evidence Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Required Evidence (Control IJR-A1)</CardTitle>
          <CardDescription>
            All 4 evidence items must be verified before rent billing can commence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                key: 'completion',
                label: 'Completion Certificate',
                source: 'RERA/Aqarat',
                evidence: rentGate.completionCertificate
              },
              {
                key: 'occupancy',
                label: 'Occupancy Certificate',
                source: 'Ministry of Municipality',
                evidence: rentGate.occupancyCertificate
              },
              {
                key: 'utility',
                label: 'Utility Activation Proof',
                source: 'Kahramaa/Qtel',
                evidence: rentGate.utilityActivation
              },
              {
                key: 'title',
                label: 'Lessor Title/Assignment',
                source: 'Land Registry',
                evidence: rentGate.lessorTitle
              }
            ].map(({ key, label, source, evidence }) => (
              <Card key={key} className={`${
                evidence.uploaded ? 'bg-green-50 border-green-200' : 'bg-white'
              } border-2`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {evidence.uploaded ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        )}
                        {label}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        Source: {source}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {evidence.uploaded ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-xs truncate">{evidence.documentUrl}</span>
                      </div>
                      {evidence.hash && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Hash className="w-3 h-3" />
                          <span className="font-mono truncate">{evidence.hash.substring(7, 27)}...</span>
                        </div>
                      )}
                      {evidence.uploadDate && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(evidence.uploadDate).toLocaleString()}
                        </div>
                      )}
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={() => handleUpload(key)}
                        disabled={uploading === key}
                        size="sm"
                        className="w-full"
                      >
                        {uploading === key ? (
                          <>Uploading...</>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Document
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Adjustment Calculator */}
      {delayDays > 0 && (
        <Card className="bg-orange-50 border-orange-200 border-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-orange-600" />
              Auto-Rent Adjustment (AAOIFI SS-9 4/1/3)
            </CardTitle>
            <CardDescription>
              Delivery delayed {delayDays} days - automatic rent reduction applied
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Contractual Start</p>
                <p className="text-lg font-semibold">
                  {contractualStartDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actual Delivery</p>
                <p className="text-lg font-semibold">
                  {actualDeliveryDate?.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delay Period</p>
                <p className="text-lg font-semibold text-orange-600">
                  {delayDays} days
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-orange-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Monthly Rent (Contractual):</span>
                <span className="font-mono font-semibold">QAR {monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Daily Rent Rate:</span>
                <span className="font-mono">QAR {dailyRent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg pt-2 border-t border-orange-300">
                <span className="font-semibold">Total Rent Reduction:</span>
                <span className="font-mono font-bold text-orange-600">
                  - QAR {rentReduction.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded border border-orange-200">
              <p className="text-xs text-muted-foreground">
                <strong>Compliance Note:</strong> Per AAOIFI SS-9 4/1/3, rent cannot accrue until
                usufruct is delivered. The {delayDays}-day delay results in automatic rent waiver
                for that period. This adjustment is non-negotiable and protects the lessee's rights.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Before/After Metrics */}
      <BeforeAfterMetrics
        before={{
          steps: [
            '👤 Review completion certificate (1 min)',
            '👤 Review occupancy permit (1 min)',
            '👤 Review utility activation (30 sec)',
            '👤 Review lessor title (30 sec)',
            '👤 Cross-check AAOIFI rules (2 min)',
            '👤 Manual approval decision (30 sec)'
          ],
          time: '5 minutes 30 seconds',
          errors: '~3% human error in rule interpretation'
        }}
        after={{
          steps: [
            '🤖 Gatekeeping Pod analyzes all evidence (2 sec)',
            '🤖 Validates preconditions automatically (1 sec)',
            '👤 Review + Approve pod proposal (1 click)'
          ],
          time: '30 seconds',
          errors: '<0.1% error rate'
        }}
        savings={{
          time: '91%',
          accuracy: '+2.9%'
        }}
      />
    </div>
  )
}
