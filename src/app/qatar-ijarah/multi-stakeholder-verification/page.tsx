'use client'

/**
 * MULTI-STAKEHOLDER VERIFICATION DEMO
 * ====================================
 * Showcases how Hedera Guardian + DIDs + VCs enable multi-stakeholder
 * collaboration without exposing private data.
 *
 * VALUE PROPOSITION:
 * - Each action anchored to Hedera via DIDs and VCs
 * - External parties can verify credentials independently
 * - Immutable audit trail for regulators, auditors, investors
 * - Trust without data sharing (selective disclosure)
 *
 * COMPONENTS:
 * 1. Trust Chain Visualization - Shows the DID/VC flow
 * 2. External Verifier Dashboard - Simulates external party verification
 */

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Shield,
  Users,
  GitBranch,
  Lock,
  Eye,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { TrustChainVisualization } from '@/components/hedera/TrustChainVisualization'
import { ExternalVerifierDashboard } from '@/components/hedera/ExternalVerifierDashboard'

export default function MultiStakeholderVerificationPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/qatar-ijarah">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Qatar Ijarah Demo
            </Link>
          </Button>

          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-8 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-3">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Hedera Guardian Integration
                </Badge>
                <h1 className="text-3xl font-bold mb-2">
                  Multi-Stakeholder Verification
                </h1>
                <p className="text-lg text-green-100 max-w-3xl">
                  Every action is anchored to Hedera blockchain via DIDs and Verifiable Credentials,
                  enabling external parties to verify compliance independently without accessing private data.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Hedera Anchoring</h3>
                  <p className="text-xs text-muted-foreground">
                    Every action recorded to HCS with immutable timestamp
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Multi-Party Trust</h3>
                  <p className="text-xs text-muted-foreground">
                    Investors, auditors, regulators verify independently
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Privacy Preserved</h3>
                  <p className="text-xs text-muted-foreground">
                    Verify compliance without exposing sensitive data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Selective Disclosure</h3>
                  <p className="text-xs text-muted-foreground">
                    Share only what's needed for each stakeholder
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <AlertCircle className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="trust-chain" className="flex items-center gap-2 py-3">
              <GitBranch className="w-4 h-4" />
              <span>Trust Chain</span>
            </TabsTrigger>
            <TabsTrigger value="external-verifier" className="flex items-center gap-2 py-3">
              <Eye className="w-4 h-4" />
              <span>External Verifier</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Understanding the multi-stakeholder verification flow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step-by-step flow */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Action Performed</h4>
                      <p className="text-sm text-muted-foreground">
                        A participant (e.g., Shariah Board) performs an action like approving a
                        Mudarabah contract. This action is performed by an entity with a <strong>Decentralized
                        Identifier (DID)</strong> registered on Hedera.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Verifiable Credential (VC) Issued</h4>
                      <p className="text-sm text-muted-foreground">
                        A <strong>Verifiable Credential</strong> is issued via Hedera Guardian. The VC
                        contains the action details, issuer DID, subject DID, and a cryptographic signature.
                        Think of it as a digital certificate that proves "X did Y at time Z."
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Anchored to Hedera Consensus Service (HCS)</h4>
                      <p className="text-sm text-muted-foreground">
                        The VC hash is submitted to <strong>Hedera Consensus Service (HCS)</strong>, creating
                        an immutable timestamp. This proves when the credential was created and prevents
                        backdating or tampering.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">External Parties Verify</h4>
                      <p className="text-sm text-muted-foreground">
                        Investors, auditors, or regulators can verify the VC independently via:
                      </p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                          <span><strong>HashScan:</strong> Public blockchain explorer to verify HCS timestamp</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                          <span><strong>Guardian API:</strong> Query Guardian for credential details</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                          <span><strong>DID Resolver:</strong> Verify issuer's DID and public key</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    Key Benefits
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">For Internal Teams:</h5>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Auditable trail for all compliance actions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Tamper-proof evidence for regulators</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Automated compliance reporting</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">For External Parties:</h5>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Verify compliance without data access</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Real-time monitoring capabilities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Reduced compliance burden</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Example Scenario */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-base">Real-World Scenario</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>
                      <strong>Dubai Investment Fund</strong> is considering investing in a Mudarabah
                      product from <strong>Qatar Islamic Bank</strong>.
                    </p>
                    <p className="text-muted-foreground">
                      Without blockchain credentials, the fund would need to:
                    </p>
                    <ul className="text-muted-foreground space-y-1 ml-4">
                      <li>• Request internal audit reports</li>
                      <li>• Wait for compliance certifications</li>
                      <li>• Trust third-party attestations</li>
                      <li>• Potentially access sensitive bank data</li>
                    </ul>
                    <p className="font-semibold text-purple-700 mt-3">
                      With Hedera Guardian + VCs:
                    </p>
                    <ul className="text-purple-700 space-y-1 ml-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Instantly verify Shariah Board approval via HashScan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Confirm capital verification by external auditor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Check compliance attestation timestamp</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Make investment decision in minutes, not weeks</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* CTA to explore tabs */}
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" onClick={() => setActiveTab('trust-chain')} className="gap-2">
                <GitBranch className="w-5 h-5" />
                View Trust Chain
              </Button>
              <Button size="lg" variant="outline" onClick={() => setActiveTab('external-verifier')} className="gap-2">
                <Eye className="w-5 h-5" />
                Try External Verifier
              </Button>
            </div>
          </TabsContent>

          {/* Trust Chain Tab */}
          <TabsContent value="trust-chain">
            <TrustChainVisualization showVerifications={true} />
          </TabsContent>

          {/* External Verifier Tab */}
          <TabsContent value="external-verifier">
            <ExternalVerifierDashboard />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Differentiator vs. Traditional GRC</h3>
                <p className="text-sm text-muted-foreground">
                  Unlike Vanta, ServiceNow GRC, or generic compliance platforms, this system provides
                  <strong> blockchain-verified credentials</strong> that external parties can verify
                  independently. This enables <strong>multi-stakeholder workflows</strong> without
                  data sharing, critical for Islamic finance where investors, Shariah boards, and
                  regulators need transparency without compromising privacy.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2">
                <a href="https://hedera.com/guardian" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Learn About Hedera Guardian
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
