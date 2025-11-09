/**
 * SCENE 5: RENT GATING (SHOWSTOPPER)
 * ====================================
 * Hard gate that blocks rent billing until usufruct delivered
 * Auto-adjusts rent for delays per AAOIFI SS-9 4/1/3
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
  Sparkles
} from 'lucide-react'
import { useIjarahStore } from '@/lib/qatar-ijarah/ijarah-store'
import { getControlById } from '@/lib/qatar-ijarah/ijarah-controls'

export default function RentGatingPage() {
  const rentGate = useIjarahStore(state => state.rentGate)
  const currentProject = useIjarahStore(state => state.currentProject)
  const updateRentGate = useIjarahStore(state => state.updateRentGate)
  const unlockRentGate = useIjarahStore(state => state.unlockRentGate)

  const [uploading, setUploading] = useState<string | null>(null)
  const [showVCMinted, setShowVCMinted] = useState(false)

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

  const handleUpload = async (evidenceType: string) => {
    setUploading(evidenceType)

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const now = new Date().toISOString()

    // Update specific evidence item
    switch (evidenceType) {
      case 'completion':
        updateRentGate({
          completionCertificate: {
            uploaded: true,
            documentUrl: '/evidence/completion-cert.pdf',
            uploadDate: now,
            verified: true,
            hash: 'sha256:a1b2c3d4e5f6...',
            source: 'RERA'
          },
          // Set actual delivery date to 45 days after contractual (for demo)
          actualDeliveryDate: new Date(contractualStartDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        break
      case 'occupancy':
        updateRentGate({
          occupancyCertificate: {
            uploaded: true,
            documentUrl: '/evidence/occupancy-cert.pdf',
            uploadDate: now,
            verified: true,
            hash: 'sha256:f1e2d3c4b5a6...',
            source: 'Ministry of Municipality'
          }
        })
        break
      case 'utility':
        updateRentGate({
          utilityActivation: {
            uploaded: true,
            documentUrl: '/evidence/utility-activation.pdf',
            uploadDate: now,
            verified: true,
            hash: 'sha256:7g8h9i0j1k2l...',
            source: 'Kahramaa'
          }
        })
        break
      case 'title':
        updateRentGate({
          lessorTitle: {
            uploaded: true,
            documentUrl: '/evidence/lessor-title.pdf',
            uploadDate: now,
            verified: true,
            hash: 'sha256:3m4n5o6p7q8r...',
            source: 'Land Registry'
          }
        })
        break
    }

    setUploading(null)
  }

  const handleActivateLease = async () => {
    if (!allEvidenceComplete) return

    // Unlock the rent gate
    unlockRentGate()

    // Simulate VC minting to Hedera
    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowVCMinted(true)

    // Mark scene as completed
    // (would update scene progress in real implementation)
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
          <Badge variant="outline">Scene 5 of 8</Badge>
          <Badge className="bg-red-500">⭐ SHOWSTOPPER</Badge>
        </div>
        <p className="text-muted-foreground">
          Hard gate enforcing AAOIFI SS-9 4/1/3: No rent until usufruct delivered
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
                  ? '⚡ Ready to Activate'
                  : '🔒 Lease Blocked - Evidence Required'}
              </h2>
              <p className="text-lg text-muted-foreground">
                {rentGate.gateUnlocked
                  ? 'All AAOIFI SS-9 4/1/3 requirements met - rent billing active'
                  : allEvidenceComplete
                  ? 'All evidence verified - ready to unlock rent gate'
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

          {/* Activate Button */}
          <Button
            onClick={handleActivateLease}
            disabled={!allEvidenceComplete || rentGate.gateUnlocked}
            size="lg"
            className={`text-lg px-8 py-6 ${
              allEvidenceComplete && !rentGate.gateUnlocked
                ? 'bg-green-600 hover:bg-green-700 animate-pulse'
                : ''
            }`}
          >
            {rentGate.gateUnlocked ? (
              <>
                <CheckCircle2 className="w-6 h-6 mr-2" />
                Lease Activated
              </>
            ) : allEvidenceComplete ? (
              <>
                <Unlock className="w-6 h-6 mr-2" />
                Activate Lease & Start Billing
              </>
            ) : (
              <>
                <Lock className="w-6 h-6 mr-2" />
                Evidence Required
              </>
            )}
          </Button>
        </div>
      </Card>

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
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {evidence.uploaded ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-semibold">{label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Source: {source}
                      </p>
                      {evidence.uploaded && evidence.verified && (
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{evidence.uploadDate}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground font-mono">
                            <Hash className="w-3 h-3" />
                            <span>{evidence.hash}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {!evidence.uploaded ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpload(key)}
                      disabled={uploading !== null}
                      className="w-full"
                    >
                      {uploading === key ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a href={evidence.documentUrl} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Document
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Adjustment Calculator (appears when all evidence uploaded) */}
      {allEvidenceComplete && delayDays > 0 && (
        <Card className="bg-amber-50 border-amber-500 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-amber-600" />
              Automatic Rent Adjustment (AAOIFI SS-9 4/1/3)
            </CardTitle>
            <CardDescription>
              Delivery was delayed - system automatically reduces rent for the lost period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contractual Start Date:</span>
                  <span className="font-mono font-semibold">{contractualStartDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actual Delivery Date:</span>
                  <span className="font-mono font-semibold">{actualDeliveryDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span className="font-semibold">Delay Period:</span>
                  <span className="font-mono font-bold">{delayDays} days</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Rent:</span>
                  <span className="font-mono">QAR {monthlyRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Rent:</span>
                  <span className="font-mono">QAR {dailyRent.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-amber-600 pt-2 border-t border-amber-200">
                  <span className="font-bold">Rent Reduction:</span>
                  <span className="font-mono font-bold text-lg">QAR {rentReduction.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded border border-amber-200">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Shariah Ruling:</strong> Per AAOIFI SS-9 4/1/3,
                rent is not due for periods where usufruct was not delivered. The system automatically
                reduces rent for the {delayDays}-day delay period and maintains an immutable audit log
                for SSB review and regulatory inspection.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" asChild>
          <Link href="/qatar-ijarah/contract-integrity">
            ← Previous: Contract Integrity
          </Link>
        </Button>
        <Button asChild>
          <Link href="/qatar-ijarah/retention-tracker">
            Next: Retention Tracker →
          </Link>
        </Button>
      </div>
    </div>
  )
}
