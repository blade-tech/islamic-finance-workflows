'use client'

/**
 * STEP 11: MONITOR & COLLABORATE
 * ===============================
 * Bridge from workflow completion to lifecycle management.
 *
 * WHAT THIS DOES:
 * - Confirms successful deal creation
 * - Provides navigation to 4 lifecycle management features
 * - Acts as "what's next" decision point after deployment
 *
 * 4 NAVIGATION OPTIONS:
 * 1. Dashboard - View all deals and platform compliance
 * 2. Deal Detail - Track this deal's compliance progress
 * 3. Contracts (AI) - Collaborate on contract generation
 * 4. Reviews - Manage Shariah reviews and approvals
 *
 * DESIGN PHILOSOPHY:
 * - Step 11 extends the linear workflow with lifecycle options
 * - User decides their next action after deployment
 * - Preserves workflow narrative while opening broader capabilities
 */

import { useRouter } from 'next/navigation'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  LayoutDashboard,
  FileText,
  Users,
  Shield,
  ArrowRight,
  Info
} from 'lucide-react'

interface NavigationCard {
  title: string
  description: string
  icon: React.ElementType
  path: string
  badge?: string
  available: boolean
}

export function Step11MonitorCollaborate() {
  const router = useRouter()
  const execution = useWorkflowStore((state) => state.execution)
  const dealId = execution?.dealId // Will be set by Step 10 after deal creation

  // Define the 4 lifecycle navigation options
  const navigationCards: NavigationCard[] = [
    {
      title: 'Dashboard',
      description: 'View all active deals and monitor platform-wide compliance metrics across all 4 components.',
      icon: LayoutDashboard,
      path: '/dashboard',
      badge: 'Recommended',
      available: true
    },
    {
      title: 'Deal Detail',
      description: 'Track this specific deal\'s compliance progress with component breakdowns and activity timeline.',
      icon: FileText,
      path: dealId ? `/deals/${dealId}` : '/dashboard',
      available: true
    },
    {
      title: 'Contracts (AI)',
      description: 'Collaborate on AI-powered contract generation for this deal with real-time document editing.',
      icon: FileText,
      path: dealId ? `/contracts/${dealId}` : '/dashboard',
      badge: 'Phase 3',
      available: false
    },
    {
      title: 'Reviews',
      description: 'Manage Shariah board reviews, approvals, and audit documentation for compliance verification.',
      icon: Shield,
      path: dealId ? `/reviews/${dealId}` : '/dashboard',
      badge: 'Phase 4',
      available: false
    }
  ]

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-900">
          Deal Successfully Created
        </AlertTitle>
        <AlertDescription className="text-green-700">
          Your workflow configuration has been deployed to Hedera Guardian and a new deal has been created for lifecycle management.
          {dealId && (
            <div className="mt-2 font-mono text-sm">
              Deal ID: <span className="font-semibold">{dealId}</span>
            </div>
          )}
        </AlertDescription>
      </Alert>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            What's Next?
          </CardTitle>
          <CardDescription>
            You've completed the 10-step workflow and deployed your Islamic finance structure to the blockchain.
            Now you can monitor compliance, collaborate on contracts, and manage the deal lifecycle.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Choose your next action:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Dashboard:</strong> Get a bird's-eye view of all deals and compliance</li>
              <li><strong>Deal Detail:</strong> Deep dive into this specific deal's progress</li>
              <li><strong>Contracts:</strong> Generate and collaborate on legal documents (Coming in Phase 3)</li>
              <li><strong>Reviews:</strong> Manage Shariah board reviews and approvals (Coming in Phase 4)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-tour="collaboration">
        {navigationCards.map((card) => {
          const Icon = card.icon

          return (
            <Card
              key={card.title}
              className={`relative transition-all ${
                card.available
                  ? 'hover:shadow-lg hover:border-primary cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      card.available ? 'bg-primary/10' : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        card.available ? 'text-primary' : 'text-gray-400'
                      }`} />
                    </div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                  {card.badge && (
                    <Badge variant={card.badge === 'Recommended' ? 'default' : 'secondary'}>
                      {card.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription className="mt-2">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant={card.available ? 'default' : 'outline'}
                  disabled={!card.available}
                  onClick={() => {
                    if (card.available) {
                      router.push(card.path)
                    }
                  }}
                >
                  {card.available ? (
                    <>
                      Go to {card.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>Coming Soon</>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Context */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Lifecycle Management Integration</AlertTitle>
        <AlertDescription>
          This workflow has created a deal that connects to the compliance dashboard. You can return
          to the dashboard at any time to monitor progress, update deal status, or access lifecycle features.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/workflow')}
        >
          Start New Workflow
        </Button>
        <Button
          onClick={() => router.push('/dashboard')}
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
