/**
 * QATAR IJĀRAH LANDING PAGE
 * ==========================
 * Entry point for Qatar Ijārah off-plan demo
 * 8 scenes demonstrating complete GRC automation
 */

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Lock,
  Shield,
  FileCheck,
  Wallet,
  Construction,
  FileSignature,
  LineChart,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { useIjarahStore } from '@/lib/qatar-ijarah/ijarah-store'
import { getControlStats } from '@/lib/qatar-ijarah/ijarah-controls'

const scenes = [
  {
    id: 1,
    sceneId: 'project-setup',
    name: 'Project Setup',
    icon: Building2,
    description: 'Create project, upload approvals, generate Shariah Policy Manual',
    url: '/qatar-ijarah/project-setup',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600'
  },
  {
    id: 2,
    sceneId: 'escrow-wiring',
    name: 'Escrow Wiring',
    icon: Wallet,
    description: 'Connect escrow account, validate deposits, create per-unit sub-ledgers',
    url: '/qatar-ijarah/escrow-wiring',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600'
  },
  {
    id: 3,
    sceneId: 'construction-progress',
    name: 'Construction Progress',
    icon: Construction,
    description: 'Upload consultant reports, Authority letters, gate disbursements',
    url: '/qatar-ijarah/construction-progress',
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'text-orange-600'
  },
  {
    id: 4,
    sceneId: 'contract-integrity',
    name: 'Contract Integrity',
    icon: FileSignature,
    description: 'Validate tri-split contracts (Istisnā\', Wa\'d, Ijārah), SSB sign-off',
    url: '/qatar-ijarah/contract-integrity',
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-green-600'
  },
  {
    id: 5,
    sceneId: 'rent-gating',
    name: 'Rent Gating ⭐ SHOWSTOPPER',
    icon: Lock,
    description: 'Hard gate blocks rent until usufruct delivered (AAOIFI SS-9 4/1/3)',
    url: '/qatar-ijarah/rent-gating',
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    featured: true
  },
  {
    id: 6,
    sceneId: 'retention-tracker',
    name: 'Retention Tracker',
    icon: Shield,
    description: '10% retention locked until conditions met (QCB Circular 2/2025)',
    url: '/qatar-ijarah/retention-tracker',
    color: 'bg-indigo-50 border-indigo-200',
    iconColor: 'text-indigo-600'
  },
  {
    id: 7,
    sceneId: 'late-payment',
    name: 'Late Payment',
    icon: FileCheck,
    description: 'Block late fees, route to charity, SSB oversight (AAOIFI SS-9 6/3-6/4)',
    url: '/qatar-ijarah/late-payment',
    color: 'bg-pink-50 border-pink-200',
    iconColor: 'text-pink-600'
  },
  {
    id: 8,
    sceneId: 'grc-dashboard',
    name: 'GRC Dashboard',
    icon: LineChart,
    description: '7 KPI tiles with click-through to audit trails',
    url: '/qatar-ijarah/grc-dashboard',
    color: 'bg-teal-50 border-teal-200',
    iconColor: 'text-teal-600'
  }
]

export default function QatarIjarahLanding() {
  const loadDemoData = useIjarahStore(state => state.loadDemoData)
  const currentProject = useIjarahStore(state => state.currentProject)

  useEffect(() => {
    // Load demo data on mount if not already loaded
    if (!currentProject) {
      loadDemoData()
    }
  }, [currentProject, loadDemoData])

  const controlStats = getControlStats()

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 p-12 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-white/20 text-white border-white/30">
              Qatar GRC Demo
            </Badge>
            <Badge className="bg-yellow-500/90 text-yellow-900 border-yellow-600">
              <Sparkles className="w-3 h-3 mr-1" />
              Production-Ready
            </Badge>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            Qatar Ijārah Off-Plan Demo
          </h1>

          <p className="text-xl text-white/90 mb-6 max-w-3xl">
            Complete GRC automation for Ijārah off-plan construction financing.
            <br />
            <strong>15 controls</strong> • <strong>3 regulators</strong> (QCB + QFCRA + AAOIFI) • <strong>8 scenes</strong> • <strong>100% automated</strong>
          </p>

          <div className="flex gap-4">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90" asChild>
              <Link href="/qatar-ijarah/rent-gating">
                <Lock className="w-5 h-5 mr-2" />
                Start with Showstopper (Scene 5)
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/qatar-ijarah/project-setup">
                <Building2 className="w-5 h-5 mr-2" />
                Full 8-Scene Demo
              </Link>
            </Button>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* Control Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{controlStats.total}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Controls</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{controlStats.shariah}</div>
            <div className="text-xs text-muted-foreground mt-1">Shariah Controls</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{controlStats.escrow}</div>
            <div className="text-xs text-muted-foreground mt-1">Escrow Controls</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{controlStats.automatable}</div>
            <div className="text-xs text-muted-foreground mt-1">Automated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-red-600">3</div>
            <div className="text-xs text-muted-foreground mt-1">Regulators</div>
          </CardContent>
        </Card>
      </div>

      {/* 8 Scenes Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Demo Scenes</h2>
        <div className="grid grid-cols-4 gap-4">
          {scenes.map(scene => {
            const Icon = scene.icon
            return (
              <Link key={scene.id} href={scene.url}>
                <Card className={`${scene.color} hover:shadow-lg transition-shadow cursor-pointer h-full ${scene.featured ? 'ring-2 ring-red-500' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-white`}>
                        <Icon className={`w-6 h-6 ${scene.iconColor}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Scene {scene.id}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{scene.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-xs">
                      {scene.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Demo vs Main App */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>How This Differs from Main Demo</CardTitle>
          <CardDescription>
            Focused, production-ready implementation vs broad GRC framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Main Demo (5-Pillar GRC)
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Broad GRC framework across all products</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>5-pillar compliance model</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Hedera Guardian integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Multiple jurisdictions (Qatar, UAE, Saudi, etc.)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                Qatar Ijārah Demo (Focused)
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span><strong>Single product:</strong> Ijārah off-plan construction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span><strong>Single jurisdiction:</strong> Qatar (QCB + QFCRA)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span><strong>15 specific controls</strong> with hard gates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span><strong>Auto-remediation:</strong> Rent adjustment, charity routing</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Sources</CardTitle>
          <CardDescription>
            Built from comprehensive Qatar dual-regulatory research
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">QFCRA IBANK</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 7.5.2 - Ijārah requirements</li>
                <li>• 7.5.3 - Istisnā\' rules</li>
                <li>• 7.5.8 - Operational risks</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">QCB Circular 2/2025</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Off-plan escrow requirements</li>
                <li>• Authority-gated disbursements</li>
                <li>• 10% retention rules</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">AAOIFI SS-9</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 4/1/3 - Rent on delivery only</li>
                <li>• 6/3-6/4 - Late payment charity</li>
                <li>• 5/1/5-7 - Maintenance rules</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
