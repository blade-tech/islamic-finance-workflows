'use client'

/**
 * STEP 10: LIVE EXECUTION (Guardian Deployment)
 * ==============================================
 * Deploy workflow to Hedera Guardian and execute on blockchain.
 *
 * MOCK IMPLEMENTATION (Phase 1 - MVP Demo):
 * - Simulates Guardian policy deployment
 * - Generates mock Hedera transaction IDs
 * - Shows mock blockchain confirmations
 * - Displays participant role assignments
 * - Provides mock HashScan links
 *
 * DEPLOYMENT FLOW:
 * 1. Deploy policy to Guardian
 * 2. Publish policy to Hedera Blockchain (immutable)
 * 3. Assign participant roles
 * 4. Generate blockchain transaction records
 * 5. Provide HashScan verification links
 *
 * USER-FACING TERMINOLOGY:
 * - "Deploy to Hedera Blockchain" (not "Guardian")
 * - "Blockchain Transaction" (clear, understandable)
 * - "Verify on HashScan" (external verification)
 */

import { useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Rocket,
  Info,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Shield,
  Users,
  Clock,
  Link as LinkIcon,
  Copy,
  Check,
  Database
} from 'lucide-react'

interface DeploymentPhase {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  transactionId?: string
  hashScanUrl?: string
  duration?: number
}

interface ParticipantRole {
  role: string
  name: string
  email: string
  did?: string
  status: 'invited' | 'onboarded' | 'active'
}

export function Step10LiveExecution() {
  const execution = useWorkflowStore((state) => state.execution)
  const dealConfiguration = execution?.dealConfiguration
  const isV2Workflow = !!execution?.transactionScale

  // Deployment state
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentPhases, setDeploymentPhases] = useState<DeploymentPhase[]>([])
  const [currentPhase, setCurrentPhase] = useState(0)
  const [deploymentComplete, setDeploymentComplete] = useState(false)
  const [policyId, setPolicyId] = useState<string | null>(null)
  const [workflowTopicId, setWorkflowTopicId] = useState<string | null>(null)

  // Participant state
  const [participants, setParticipants] = useState<ParticipantRole[]>([
    {
      role: 'Issuer',
      name: 'ABC Islamic Bank',
      email: 'issuer@abcbank.com',
      status: 'invited'
    },
    {
      role: 'Shariah Advisor',
      name: 'Dr. Ahmed Al-Mansouri',
      email: 'ahmed@shariahboard.com',
      status: 'invited'
    },
    {
      role: 'Auditor',
      name: 'XYZ Audit Firm',
      email: 'audit@xyzaudit.com',
      status: 'invited'
    },
    {
      role: 'Trustee',
      name: 'DEF Trust Services',
      email: 'trustee@deftrust.com',
      status: 'invited'
    }
  ])

  // UI state
  const [copiedTx, setCopiedTx] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Deal creation state
  const [isCreatingDeal, setIsCreatingDeal] = useState(false)
  const [dealCreationError, setDealCreationError] = useState<string | null>(null)
  const [createdDealId, setCreatedDealId] = useState<string | null>(null)

  // Generate mock transaction ID
  const generateMockTransactionId = (): string => {
    const accountId = `0.0.${Math.floor(100000 + Math.random() * 900000)}`
    const timestamp = `${Date.now().toString().slice(0, 10)}.${Math.floor(Math.random() * 1000000)}`
    return `${accountId}@${timestamp}`
  }

  // Generate mock DID
  const generateMockDID = (): string => {
    const randomHash = Array(40)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('')
    const accountId = `0.0.${Math.floor(100000 + Math.random() * 900000)}`
    return `did:hedera:testnet:${randomHash}_${accountId}`
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedTx(id)
    setTimeout(() => setCopiedTx(null), 2000)
  }

  // Create deal in backend after successful deployment
  // DEMO MODE: Mock deal creation without backend
  const createDeal = async () => {
    // DEMO MODE: Allow deal creation even without complete configuration
    const isDemoMode = true
    if (!isDemoMode && !isV2Workflow && !dealConfiguration) {
      console.error('[Step10] Cannot create deal: dealConfiguration is missing')
      return
    }

    setIsCreatingDeal(true)
    setDealCreationError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generate mock deal ID
      const mockDealId = `DEAL-${Date.now()}-${Math.floor(Math.random() * 10000)}`

      setCreatedDealId(mockDealId)

      // Store deal ID in workflow store for Step 11 to access
      useWorkflowStore.setState((state) => ({
        execution: state.execution ? {
          ...state.execution,
          dealId: mockDealId,
        } : null,
      }))

      console.log('[Step10 DEMO] Mock deal created successfully:', mockDealId)
    } catch (error) {
      console.error('[Step10] Failed to create deal:', error)
      setDealCreationError(error instanceof Error ? error.message : 'Failed to create deal')
    } finally {
      setIsCreatingDeal(false)
    }
  }

  // Start deployment process
  const handleDeploy = async () => {
    // DEMO MODE: Allow deployment even without dealConfiguration
    const isDemoMode = true // Set to false for production
    if (!isDemoMode && !dealConfiguration) return

    setIsDeploying(true)
    setShowConfirmation(false)
    setCurrentPhase(0)

    // Initialize deployment phases
    const phases: DeploymentPhase[] = [
      {
        id: 'generate',
        title: 'Generate Guardian Policy',
        description: 'Composing policy from 4-component configuration',
        status: 'pending'
      },
      {
        id: 'validate',
        title: 'Validate Policy Structure',
        description: 'Checking BPMN workflow and schemas',
        status: 'pending'
      },
      {
        id: 'publish_ipfs',
        title: 'Publish to IPFS',
        description: 'Storing policy document immutably',
        status: 'pending'
      },
      {
        id: 'publish_blockchain',
        title: 'Publish to Hedera Blockchain',
        description: 'Recording policy on Hedera Consensus Service',
        status: 'pending'
      },
      {
        id: 'create_topic',
        title: 'Create Workflow Topic',
        description: 'Establishing Hedera HCS topic for workflow messages',
        status: 'pending'
      },
      {
        id: 'assign_roles',
        title: 'Assign Participant Roles',
        description: 'Issuing verifiable credentials to participants',
        status: 'pending'
      }
    ]

    setDeploymentPhases(phases)

    // Simulate deployment phases
    for (let i = 0; i < phases.length; i++) {
      setCurrentPhase(i)

      // Update phase to in_progress
      setDeploymentPhases(prev =>
        prev.map((phase, idx) =>
          idx === i ? { ...phase, status: 'in_progress' } : phase
        )
      )

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))

      // Generate transaction IDs for blockchain operations
      let transactionId: string | undefined
      let hashScanUrl: string | undefined

      if (phases[i].id === 'publish_blockchain') {
        transactionId = generateMockTransactionId()
        hashScanUrl = `https://hashscan.io/testnet/transaction/${transactionId}`
        setPolicyId(`policy_${Date.now()}_${Math.floor(Math.random() * 10000)}`)
      } else if (phases[i].id === 'create_topic') {
        transactionId = generateMockTransactionId()
        hashScanUrl = `https://hashscan.io/testnet/topic/${transactionId.split('@')[0]}`
        setWorkflowTopicId(transactionId.split('@')[0])
      }

      // Update phase to completed
      setDeploymentPhases(prev =>
        prev.map((phase, idx) =>
          idx === i
            ? {
                ...phase,
                status: 'completed',
                transactionId,
                hashScanUrl,
                duration: 2 + Math.random()
              }
            : phase
        )
      )

      // Assign DIDs to participants when role assignment phase completes
      if (phases[i].id === 'assign_roles') {
        setParticipants(prev =>
          prev.map(p => ({
            ...p,
            did: generateMockDID(),
            status: 'onboarded'
          }))
        )
      }
    }

    setIsDeploying(false)
    setDeploymentComplete(true)

    // Create deal record after successful deployment
    await createDeal()
  }

  // Render deployment phase
  const renderPhase = (phase: DeploymentPhase, index: number) => (
    <div key={phase.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
      {/* Status Icon */}
      <div className="flex-shrink-0 mt-1">
        {phase.status === 'completed' && (
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        )}
        {phase.status === 'in_progress' && (
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
        )}
        {phase.status === 'pending' && (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        {phase.status === 'error' && (
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        )}
      </div>

      {/* Phase Details */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">
            {index + 1}. {phase.title}
          </h4>
          {phase.status === 'completed' && phase.duration && (
            <span className="text-xs text-muted-foreground">
              {phase.duration.toFixed(1)}s
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{phase.description}</p>

        {/* Transaction ID & HashScan Link */}
        {phase.transactionId && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 p-2 bg-background rounded-md">
              <code className="text-xs font-mono flex-1 truncate">
                {phase.transactionId}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => copyToClipboard(phase.transactionId!, phase.id)}
              >
                {copiedTx === phase.id ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>

            {phase.hashScanUrl && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(phase.hashScanUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Verify on HashScan
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )

  // DEMO MODE: Relax validation to allow deployment without complete configuration
  // In production, this would enforce strict validation
  const isDemoMode = true // Set to false for production
  const hasMinimalConfig = dealConfiguration || execution?.selectedShariahStructure || isV2Workflow

  if (!isDemoMode && !isV2Workflow && (!dealConfiguration || !dealConfiguration.isValid)) {
    return (
      <div className="space-y-6">
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Required</AlertTitle>
          <AlertDescription>
            Please complete and validate your 4-component configuration in previous steps before
            deploying to Hedera Blockchain.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // DEMO MODE: Show info if configuration is incomplete
  if (isDemoMode && !hasMinimalConfig) {
    console.warn('[Step10 DEMO] No configuration found, using demo defaults')
  }

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Deploy to Hedera Blockchain</AlertTitle>
        <AlertDescription>
          Your validated workflow will be deployed as an immutable Guardian policy on Hedera
          Blockchain. All participant actions will be recorded permanently with cryptographic
          verification.
        </AlertDescription>
      </Alert>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Deployment Configuration
          </CardTitle>
          <CardDescription>
            Policy generated from your 4-component modular configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Shariah Structure</p>
              <p className="text-sm font-semibold">
                {execution?.selectedShariahStructure?.name || 'Not selected'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Jurisdiction</p>
              <p className="text-sm font-semibold">
                {execution?.selectedJurisdiction?.name || 'Not selected'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Accounting Framework</p>
              <p className="text-sm font-semibold">
                {execution?.selectedAccounting?.name || 'Not selected'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Impact Metrics</p>
              <p className="text-sm font-semibold">
                {execution?.selectedImpacts?.length || 0} framework(s) selected
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">Configuration Name</p>
            <p className="text-sm text-muted-foreground">{dealConfiguration?.configurationName || (isV2Workflow ? "V2 Workflow Configuration" : "No configuration name")}</p>
          </div>

          {(dealConfiguration as any)?.derivedFields && Object.keys((dealConfiguration as any).derivedFields).length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Derived Configuration Fields</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {Object.entries((dealConfiguration as any).derivedFields).slice(0, 4).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Participant Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Workflow Participants
          </CardTitle>
          <CardDescription>
            Email invites will be sent for DID onboarding after deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {participants.map((participant, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{participant.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {participant.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{participant.email}</p>
                  {participant.did && (
                    <code className="text-xs text-muted-foreground mt-1 block truncate max-w-md">
                      {participant.did}
                    </code>
                  )}
                </div>
                <Badge
                  variant={
                    participant.status === 'active'
                      ? 'default'
                      : participant.status === 'onboarded'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {participant.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment Confirmation */}
      {!showConfirmation && !isDeploying && !deploymentComplete && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Ready to Deploy</CardTitle>
            <CardDescription>
              This action will deploy your workflow to Hedera Blockchain (testnet)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important: Blockchain Deployment</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  Once deployed to Hedera Blockchain, the policy becomes <strong>immutable</strong>.
                  All process executions and participant signatures will be permanently recorded.
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Policy structure cannot be modified after deployment</li>
                  <li>All transactions are publicly verifiable on HashScan</li>
                  <li>Estimated cost: ~$0.50 USD (testnet = free)</li>
                  <li>Participants will receive email invites for DID onboarding</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={() => setShowConfirmation(true)}
                className="flex-1"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Deploy to Blockchain
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment Confirmation Dialog */}
      {showConfirmation && !isDeploying && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Confirm Blockchain Deployment</CardTitle>
            <CardDescription>
              Please confirm you understand this action is permanent and immutable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirm1"
                  className="mt-1"
                  required
                />
                <label htmlFor="confirm1" className="text-sm">
                  I understand this policy will be immutably recorded on Hedera Blockchain
                </label>
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirm2"
                  className="mt-1"
                  required
                />
                <label htmlFor="confirm2" className="text-sm">
                  I confirm all participant roles and configuration are correct
                </label>
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirm3"
                  className="mt-1"
                  required
                />
                <label htmlFor="confirm3" className="text-sm">
                  I understand this is a testnet deployment (not production)
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeploy}
                className="flex-1"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Confirm & Deploy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment Progress */}
      {isDeploying && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Deploying to Hedera Blockchain
            </CardTitle>
            <CardDescription>
              Phase {currentPhase + 1} of {deploymentPhases.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress
                value={((currentPhase + 1) / deploymentPhases.length) * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground text-center">
                {Math.round(((currentPhase + 1) / deploymentPhases.length) * 100)}% Complete
              </p>
            </div>

            {/* Deployment Phases */}
            <div className="space-y-3">
              {deploymentPhases.map((phase, index) => renderPhase(phase, index))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deployment Complete */}
      {deploymentComplete && (
        <>
          <Alert variant="default" className="border-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Deployment Successful!</AlertTitle>
            <AlertDescription>
              Your workflow has been deployed to Hedera Blockchain. All participant invites have
              been sent.
            </AlertDescription>
          </Alert>

          {/* Deal Creation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Deal Lifecycle Record
              </CardTitle>
              <CardDescription>
                Creating deal record for lifecycle management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isCreatingDeal && (
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <p className="text-sm text-muted-foreground">
                    Creating deal record in backend system...
                  </p>
                </div>
              )}

              {!isCreatingDeal && createdDealId && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-900">Deal Created Successfully</AlertTitle>
                  <AlertDescription className="text-green-700">
                    <p className="mb-2">
                      Your deal has been registered for lifecycle management and compliance tracking.
                    </p>
                    <div className="mt-2 font-mono text-sm bg-white/50 p-2 rounded">
                      Deal ID: <span className="font-semibold">{createdDealId}</span>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {!isCreatingDeal && dealCreationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Deal Creation Failed</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">
                      Failed to create deal record: {dealCreationError}
                    </p>
                    <p className="text-xs mt-2">
                      Don't worry - your blockchain deployment was successful. You can manually create
                      the deal record from the dashboard or contact support.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {!isCreatingDeal && !createdDealId && !dealCreationError && (
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Waiting for deal creation...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Blockchain Verification
              </CardTitle>
              <CardDescription>
                Verify your deployment on Hedera HashScan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {policyId && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Policy ID</p>
                    <code className="text-xs">{policyId}</code>
                  </div>
                )}

                {workflowTopicId && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Workflow Topic (HCS)</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs flex-1">{workflowTopicId}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://hashscan.io/testnet/topic/${workflowTopicId}`,
                            '_blank'
                          )
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Deployment Timeline</h4>
                {deploymentPhases
                  .filter(p => p.transactionId)
                  .map((phase, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{phase.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(phase.hashScanUrl, '_blank')}
                      >
                        <code className="text-xs mr-2">{phase.transactionId?.slice(0, 20)}...</code>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium">Monitor Participant Onboarding</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email invites sent. Participants will receive DID onboarding instructions.
                    Track status in the participants section above.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium">Begin Workflow Execution</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Once all participants are onboarded, the workflow will begin automatically.
                    Each step requires cryptographic signatures from assigned roles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium">Monitor Progress</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Track workflow progress in real-time. All actions are recorded on blockchain
                    and visible on HashScan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
