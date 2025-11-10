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
  ArrowRight,
  Brain
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
    description: '2 AI Pods: Document Processing + Gatekeeping (91% time savings)',
    url: '/qatar-ijarah/rent-gating',
    color: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    featured: true,
    aiPods: 2
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
    description: '1 AI Assistant: Compliance Checking (dramatic time savings) + 7 KPIs',
    url: '/qatar-ijarah/grc-dashboard',
    color: 'bg-teal-50 border-teal-200',
    iconColor: 'text-teal-600',
    aiPods: 1
  },
  {
    id: 9,
    sceneId: 'ai-control-center',
    name: 'AI Control Center ⚡',
    icon: Brain,
    description: '3 AI Assistants working together with human oversight (HITL)',
    url: '/qatar-ijarah/ai-control-center',
    color: 'bg-purple-100 border-purple-300',
    iconColor: 'text-purple-700',
    featured: true
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
            AI-assisted GRC for Ijārah off-plan construction financing.
            <br />
            <strong>15 controls</strong> • <strong>3 regulators</strong> (QCB + QFCRA + AAOIFI) • <strong>9 scenes</strong> • <strong>3 AI assistants</strong>
          </p>

          <div className="flex gap-4">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90" asChild>
              <Link href="/qatar-ijarah/rent-gating">
                <Lock className="w-5 h-5 mr-2" />
                Start with Showstopper (Section 5)
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/qatar-ijarah/ai-control-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Control Center ⚡
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-yellow-400 bg-yellow-400/20 text-white hover:bg-yellow-400/30" asChild>
              <Link href="/qatar-ijarah-v2">
                <Sparkles className="w-5 h-5 mr-2" />
                Try V2: Task View
                <ArrowRight className="w-5 h-5 ml-2" />
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

      {/* AI Pods Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">3 AI Assistants Deployed</h2>
            <p className="text-sm text-muted-foreground">HITL-first AI automation with 95%+ time savings</p>
          </div>
          <Button asChild>
            <Link href="/qatar-ijarah/ai-control-center">
              <Brain className="w-4 h-4 mr-2" />
              See All Pods in Action
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge className="bg-blue-600 text-xs">Assistant #1</Badge>
                <Badge variant="outline" className="text-xs">Event-Driven</Badge>
              </div>
              <CardTitle className="text-lg mt-2">Document Processing</CardTitle>
              <CardDescription className="text-xs">OCR + Hash Validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Saved:</span>
                  <span className="font-semibold">8.5 min/doc</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-semibold">98% OCR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Integrated:</span>
                  <span className="font-semibold">Section 5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge className="bg-orange-600 text-xs">Assistant #2</Badge>
                <Badge variant="outline" className="text-xs">Scheduled</Badge>
              </div>
              <CardTitle className="text-lg mt-2">Compliance Checking</CardTitle>
              <CardDescription className="text-xs">Control Testing Engine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Saved:</span>
                  <span className="font-semibold">40 min → 4 sec</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Coverage:</span>
                  <span className="font-semibold">15 controls</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Integrated:</span>
                  <span className="font-semibold">Section 8</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge className="bg-purple-600 text-xs">Assistant #3</Badge>
                <Badge variant="outline" className="text-xs">Event-Driven</Badge>
              </div>
              <CardTitle className="text-lg mt-2">Gatekeeping</CardTitle>
              <CardDescription className="text-xs">Precondition Validator</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Saved:</span>
                  <span className="font-semibold">5.5 min → 30 sec</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Savings:</span>
                  <span className="font-semibold">91%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Integrated:</span>
                  <span className="font-semibold">Section 5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 9 Scenes Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Demo Sections</h2>
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
                      <div className="flex flex-col gap-1 items-end">
                        <Badge variant="outline" className="text-xs">
                          Section {scene.id}
                        </Badge>
                        {scene.aiPods && (
                          <Badge className="text-xs bg-purple-600">
                            <Brain className="w-3 h-3 mr-1" />
                            {scene.aiPods} AI Pod{scene.aiPods > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
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

      {/* V1 vs V2 UX Comparison */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 ring-2 ring-yellow-400">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-yellow-600">NEW</Badge>
                <CardTitle>V2: Task View Now Available</CardTitle>
              </div>
              <CardDescription>
                Same demo, two different interaction models - compare and choose
              </CardDescription>
            </div>
            <Button className="bg-yellow-600 hover:bg-yellow-700" asChild>
              <Link href="/qatar-ijarah-v2">
                <Sparkles className="w-4 h-4 mr-2" />
                Try V2 Now
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                V1: Section-Based View (Current Page)
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Explore 9 interactive sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>See full context and dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Best for showcasing capabilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Shows "after state" (results)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-600" />
                V2: Task View (Task Inbox)
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">✓</span>
                  <span><strong>My Tasks</strong> - What do I need to do NOW?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">✓</span>
                  <span><strong>Process Tracking</strong> - Track execution progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">✓</span>
                  <span><strong>Overview Dashboard</strong> - High-level metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">✓</span>
                  <span>Show details on demand + See AI decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-0.5">✓</span>
                  <span>Role-based filtering (Validator, Compliance, etc.)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

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
