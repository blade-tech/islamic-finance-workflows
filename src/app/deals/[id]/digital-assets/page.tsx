'use client'

/**
 * DIGITAL ASSETS PAGE
 * ===================
 * Displays Guardian compliance certificates and ATS tokenization details for a deal.
 *
 * WHAT THIS SHOWS:
 * 1. Shariah Compliance Certificate (Guardian NFT)
 * 2. TrustChain Visualization (VP → VCs graph)
 * 3. Blockchain Verification (HCS, IPFS)
 * 4. Tokenized Sukuk (ATS) - if applicable
 * 5. Corporate Actions timeline
 *
 * DATA SOURCE:
 * - Mock Guardian endpoints: /api/mock-guardian/deals/{id}/certificate, /vp
 * - Mock ATS endpoints: /api/mock-guardian/deals/{id}/sukuk-token
 */

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ShieldCheck,
  ExternalLink,
  Download,
  CheckCircle2,
  Network,
  Coins,
  Calendar,
  Users,
  TrendingUp,
  FileText,
  Info,
  Sparkles
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { TrustChainVisualization } from '@/components/guardian/TrustChainVisualization'

interface Certificate {
  token_id: string
  serial_number: number
  deal_id: string
  minted_at: string
  vp_cid: string
  hcs_topic_id: string
  hcs_sequence_number: number
  consensus_timestamp: string
  hashscan_url: string
  verification_status: {
    vp_signature_valid: boolean
    hcs_timestamp_verified: boolean
    ipfs_accessible: boolean
  }
}

interface VerifiablePresentation {
  id: string
  type: string[]
  holder: string
  verifiableCredential: any[]
  proof: {
    type: string
    created: string
    verificationMethod: string
    proofPurpose: string
    ipfsCid: string
    hcsTopicId: string
    hcsSequenceNumber: number
  }
}

interface SukukToken {
  token_id: string
  token_name: string
  token_symbol: string
  total_supply: number
  decimals: number
  certificate_token_id: string
  deal_id: string
  created_at: string
  treasury_account: string
  holders_count: number
  hashscan_url: string
}

export default function DigitalAssetsPage() {
  const params = useParams()
  const dealId = params.id as string

  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [vp, setVp] = useState<VerifiablePresentation | null>(null)
  const [sukukToken, setSukukToken] = useState<SukukToken | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch certificate
        const certResponse = await fetch(`http://localhost:8000/api/mock-guardian/deals/${dealId}/certificate`)
        const certData = await certResponse.json()
        setCertificate(certData)

        // Fetch VP
        const vpResponse = await fetch(`http://localhost:8000/api/mock-guardian/deals/${dealId}/vp`)
        const vpData = await vpResponse.json()
        setVp(vpData)

        // Fetch sukuk token
        const tokenResponse = await fetch(`http://localhost:8000/api/mock-guardian/deals/${dealId}/sukuk-token`)
        const tokenData = await tokenResponse.json()
        setSukukToken(tokenData)
      } catch (error) {
        console.error('Error fetching digital assets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dealId])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-purple-600 animate-pulse mx-auto mb-4" />
            <p className="text-muted-foreground">Loading digital assets...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Digital Assets</h1>
        <p className="text-muted-foreground">
          Guardian compliance certificates and tokenization details
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trustchain">TrustChain</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="tokenization">Tokenization</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Compliance Certificate Card */}
          <Card className="border-2 border-green-200 bg-green-50/50 dark:bg-green-950/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Shariah Compliance Certificate</CardTitle>
                    <CardDescription>Guardian NFT Certificate</CardDescription>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Minted
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {certificate && (
                <>
                  {/* Token Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Token ID</p>
                      <p className="font-mono font-semibold">{certificate.token_id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Serial Number</p>
                      <p className="font-semibold">#{certificate.serial_number}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Minted Date</p>
                      <p className="font-semibold">
                        {new Date(certificate.minted_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Platform</p>
                      <p className="font-semibold">Hedera Guardian</p>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">Verification Status</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-gray-900 border">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">VP Signature Valid</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-gray-900 border">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">HCS Timestamp Verified</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-gray-900 border">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">IPFS Accessible</span>
                      </div>
                    </div>
                  </div>

                  {/* Compliance Summary */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">Compliance Summary</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Shariah Structure: 100%</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200">
                        <CheckCircle2 className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Jurisdiction: 100%</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Accounting: 100%</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Impact: 100%</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t">
                    <Button variant="default" asChild>
                      <a href={certificate.hashscan_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on HashScan
                      </a>
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      View Metadata
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Sukuk Token Card */}
          {sukukToken && (
            <Card className="border-2 border-amber-200 bg-amber-50/50 dark:bg-amber-950/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <Coins className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Tokenized Sukuk (ATS)</CardTitle>
                      <CardDescription>Asset Tokenization Studio</CardDescription>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-amber-600">
                    {sukukToken.status === 'active' ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      'Pending'
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Token Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Token ID</p>
                    <p className="font-mono font-semibold">{sukukToken.token_id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Token Symbol</p>
                    <p className="font-semibold">{sukukToken.token_symbol}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tokenization Date</p>
                    <p className="font-semibold">
                      {new Date(sukukToken.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Treasury Account</p>
                    <p className="font-mono text-xs">{sukukToken.treasury_account}</p>
                  </div>
                </div>

                {/* Financial Overview */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground">Token Supply Overview</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg bg-white dark:bg-gray-900 border">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Total Supply</p>
                      <p className="text-lg font-bold">
                        {sukukToken.total_supply.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Decimals</p>
                      <p className="text-lg font-bold">{sukukToken.decimals}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Token Holders</p>
                      <p className="text-lg font-bold flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {sukukToken.holders_count}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shariah Compliance Link */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Linked to Guardian Certificate:</strong>{' '}
                    <span className="font-mono">{certificate?.token_id}</span>
                    <br />
                    <span className="text-sm text-muted-foreground">
                      This tokenized sukuk is backed by verified Shariah compliance
                    </span>
                  </AlertDescription>
                </Alert>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button variant="default" asChild>
                    <a href={sukukToken.hashscan_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on HashScan
                    </a>
                  </Button>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Manage Token
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Corporate Actions
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TrustChain Tab */}
        <TabsContent value="trustchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                TrustChain Visualization
              </CardTitle>
              <CardDescription>
                Interactive graph showing Verifiable Presentation (VP) and connected Verifiable Credentials (VCs)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vp && <TrustChainVisualization vp={vp} />}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>
                Hedera Consensus Service (HCS) and IPFS storage details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {certificate && (
                <>
                  {/* HCS Details */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">Hedera Consensus Service</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Topic ID</p>
                        <p className="font-mono font-semibold">{certificate.hcs_topic_id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Sequence Number</p>
                        <p className="font-semibold">#{certificate.hcs_sequence_number}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-xs text-muted-foreground">Consensus Timestamp</p>
                        <p className="font-semibold">
                          {new Date(certificate.consensus_timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* IPFS Details */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">IPFS Storage</p>
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Content Identifier (CID)</p>
                        <p className="font-mono text-sm break-all">{certificate.vp_cid}</p>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://ipfs.io/ipfs/${certificate.vp_cid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 mr-2" />
                            View on IPFS Gateway
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* HashScan Verification */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground">Blockchain Explorer</p>
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
                      <p className="text-sm mb-3">
                        View this certificate on the Hedera blockchain explorer for full transaction history and verification.
                      </p>
                      <Button variant="default" asChild>
                        <a href={certificate.hashscan_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in HashScan
                        </a>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tokenization Tab */}
        <TabsContent value="tokenization" className="space-y-6">
          {sukukToken ? (
            <>
              {/* Token Overview Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Token Overview</CardTitle>
                  <CardDescription>ATS Sukuk Token Details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200">
                      <p className="text-sm text-muted-foreground mb-1">Total Supply</p>
                      <p className="text-2xl font-bold">
                        {sukukToken.total_supply.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{sukukToken.token_symbol}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                      <p className="text-sm text-muted-foreground mb-1">Token Decimals</p>
                      <p className="text-2xl font-bold">{sukukToken.decimals}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Precision level
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
                      <p className="text-sm text-muted-foreground mb-1">Token Holders</p>
                      <p className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        {sukukToken.holders_count}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Active holders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Corporate Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Corporate Actions
                  </CardTitle>
                  <CardDescription>Profit distributions and lifecycle events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Next Profit Distribution:</strong> June 1, 2025
                      <br />
                      <span className="text-sm text-muted-foreground">
                        Semi-annual profit payment to all token holders
                      </span>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Recent Activity</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-900">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Token Issuance</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(sukukToken.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg border bg-white dark:bg-gray-900">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Guardian Certificate Linked</p>
                          <p className="text-xs text-muted-foreground font-mono">{certificate?.token_id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Coins className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tokenization Not Started</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      This deal has not been tokenized yet. Complete compliance certification first.
                    </p>
                    <Button disabled>
                      <Coins className="h-4 w-4 mr-2" />
                      Tokenize Deal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
