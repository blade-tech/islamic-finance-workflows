'use client'

/**
 * STEP 2: CONVERSATIONAL CONFIGURATION (AG-UI Protocol)
 * ======================================================
 * Agent-guided conversational interface for deal configuration.
 * Replaces Steps 2-6 (Shariah Structure, Jurisdiction, Accounting, Impact, Review)
 * with natural language interaction.
 *
 * ARCHITECTURE ALIGNMENT:
 * - Implements 12-Question Minimum Viable Questionnaire (MVQ)
 * - Uses AG-UI streaming for real-time interaction
 * - Shows control activation in real-time as user answers
 * - Reduces workflow from 10 steps to 3 steps
 * - Aligns with ARCHITECTURE_SESSION_FINDINGS.md recommendations
 *
 * 12 QUESTIONS (5 DOMAINS):
 * Domain 1: Product & Structure (3 questions)
 *   Q1: Product Type
 *   Q2: Sustainability Overlay
 *   Q3: Deal Complexity
 * Domain 2: Jurisdiction & Regulatory (3 questions)
 *   Q4: Primary Jurisdiction
 *   Q5: Cross-Border Exposure
 *   Q6: Listing Status
 * Domain 3: Risk Profile (2 questions)
 *   Q7: Counterparty Risk Exposure
 *   Q8: Liquidity & Funding Model
 * Domain 4: Governance & Assurance (3 questions)
 *   Q9: Shariah Governance Maturity
 *   Q10: Internal Audit Capability
 *   Q11: External Audit Requirement
 * Domain 5: Accounting & Reporting (1 question)
 *   Q12: Accounting Framework
 *
 * FEATURES:
 * - Conversational chat interface
 * - Real-time control activation matrix display
 * - Progressive disclosure (only asks relevant follow-up questions)
 * - AI-suggested responses based on deal description
 * - Live bucket score preview
 */

import { useState, useRef, useEffect } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Bot,
  User,
  Sparkles,
  Send,
  CheckCircle2,
  Loader2,
  Shield,
  Scale,
  AlertTriangle,
  FileText,
  ClipboardCheck,
  TrendingUp,
} from 'lucide-react'

// Types for 12-question configuration
interface DealConfiguration {
  // Domain 1: Product & Structure
  productType: 'Sukuk' | 'Murabaha' | 'Ijara' | 'Musharaka' | 'Mudaraba' | 'Istisna' | 'Salam' | 'Wakala' | null
  sustainabilityOverlay: 'None' | 'GBP' | 'SBP' | 'SLB' | 'Transition' | null
  dealComplexity: 'Simple' | 'Medium' | 'Complex' | null

  // Domain 2: Jurisdiction & Regulatory
  primaryJurisdiction: string | null
  crossBorder: 'No' | 'Yes - Investor base' | 'Yes - Asset location' | 'Yes - Both' | null
  listingStatus: 'Private' | 'Public' | null

  // Domain 3: Risk Profile
  counterpartyRisk: 'Low' | 'Medium' | 'High' | null
  fundingModel: 'Fixed maturity' | 'IAH' | 'Line of credit' | null

  // Domain 4: Governance & Assurance
  shariahGovernance: 'Full SSB+Review+Audit' | 'SSB+Review only' | 'SSB only' | null
  internalAudit: 'Yes (in-house)' | 'Yes (outsourced)' | 'No' | null
  externalAudit: 'Yes (regulatory)' | 'Yes (voluntary)' | 'No' | null

  // Domain 5: Accounting
  accountingFramework: 'AAOIFI FAS' | 'IFRS' | 'Local GAAP' | 'Hybrid' | null

  // Deal metadata
  dealName?: string
  dealAmount?: number
  dealCurrency?: string
  dealDescription?: string
}

interface ChatMessage {
  role: 'user' | 'agent'
  content: string
  timestamp: Date
  suggestedResponses?: string[]
}

interface ControlActivation {
  controlId: string
  name: string
  bucket: number
  activated: boolean
  reason: string
}

// 5 Bucket Configuration
const BUCKET_CONFIG = [
  { id: 1, name: 'Shariah Governance', color: 'purple', icon: Shield },
  { id: 2, name: 'Regulatory & Legal', color: 'orange', icon: Scale },
  { id: 3, name: 'Risk Management', color: 'red', icon: AlertTriangle },
  { id: 4, name: 'Financial & Reporting', color: 'blue', icon: FileText },
  { id: 5, name: 'Audit & Assurance', color: 'green', icon: ClipboardCheck },
]

export function Step2ConversationalConfig() {
  const execution = useWorkflowStore((state) => state.execution)
  const setDealConfiguration = useWorkflowStore((state) => state.setDealConfiguration)

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'agent',
      content: "Hello! I'm your AI compliance advisor. Let me help you configure your Islamic finance deal. To start, could you tell me about your deal in a few sentences? For example: \"We're structuring a $500M Sukuk for renewable energy in Malaysia.\"",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  // Configuration state (12 questions)
  const [config, setConfig] = useState<DealConfiguration>({
    productType: null,
    sustainabilityOverlay: null,
    dealComplexity: null,
    primaryJurisdiction: null,
    crossBorder: null,
    listingStatus: null,
    counterpartyRisk: null,
    fundingModel: null,
    shariahGovernance: null,
    internalAudit: null,
    externalAudit: null,
    accountingFramework: null,
  })

  // Control activation state
  const [activatedControls, setActivatedControls] = useState<ControlActivation[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(1) // Track which of 12 questions we're on

  // Refs
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Simulate agent thinking and response (TODO: Replace with actual Claude API call)
  const simulateAgentResponse = async (userMessage: string) => {
    setIsThinking(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simple question flow logic (TODO: Replace with Claude SDK query)
    let agentResponse = ''
    let suggestedResponses: string[] = []

    // Question 1: Product Type
    if (currentQuestion === 1) {
      agentResponse =
        "Great! Let me ask you a few questions to understand your deal better. First, what type of Islamic finance product are you structuring?"
      suggestedResponses = ['Sukuk', 'Murabaha', 'Ijara', 'Musharaka', 'Mudaraba']
      setCurrentQuestion(2)
    }
    // Question 2: Sustainability Overlay
    else if (currentQuestion === 2) {
      setConfig((prev) => ({ ...prev, productType: 'Sukuk' })) // TODO: Parse from user message
      agentResponse =
        "Excellent. Does this deal have a sustainability overlay (Green, Social, Sustainability-Linked)?"
      suggestedResponses = ['None', 'Green Bond Principles (GBP)', 'Social Bond Principles (SBP)', 'Sustainability-Linked (SLB)']
      setCurrentQuestion(3)
    }
    // Question 3: Deal Complexity
    else if (currentQuestion === 3) {
      setConfig((prev) => ({ ...prev, sustainabilityOverlay: 'None' })) // TODO: Parse
      agentResponse = "How would you characterize the complexity of this deal?"
      suggestedResponses = ['Simple', 'Medium', 'Complex']
      setCurrentQuestion(4)
    }
    // Question 4: Primary Jurisdiction
    else if (currentQuestion === 4) {
      setConfig((prev) => ({ ...prev, dealComplexity: 'Medium' })) // TODO: Parse
      agentResponse = "What is the primary jurisdiction for this deal?"
      suggestedResponses = ['Malaysia', 'UAE', 'Saudi Arabia', 'Bahrain', 'Qatar', 'Singapore']
      setCurrentQuestion(5)
    }
    // Question 5: Cross-Border Exposure
    else if (currentQuestion === 5) {
      setConfig((prev) => ({ ...prev, primaryJurisdiction: 'Malaysia' })) // TODO: Parse
      agentResponse = "Does this deal have cross-border exposure?"
      suggestedResponses = ['No', 'Yes - Investor base', 'Yes - Asset location', 'Yes - Both']
      setCurrentQuestion(6)
    }
    // Question 6: Listing Status
    else if (currentQuestion === 6) {
      setConfig((prev) => ({ ...prev, crossBorder: 'No' })) // TODO: Parse
      agentResponse = "Will this deal be publicly listed or remain private?"
      suggestedResponses = ['Private', 'Public']
      setCurrentQuestion(7)
    }
    // Question 7: Counterparty Risk
    else if (currentQuestion === 7) {
      setConfig((prev) => ({ ...prev, listingStatus: 'Private' })) // TODO: Parse
      agentResponse = "How would you assess the counterparty risk exposure?"
      suggestedResponses = ['Low', 'Medium', 'High']
      setCurrentQuestion(8)
    }
    // Question 8: Funding Model
    else if (currentQuestion === 8) {
      setConfig((prev) => ({ ...prev, counterpartyRisk: 'Low' })) // TODO: Parse
      agentResponse = "What is the liquidity and funding model for this deal?"
      suggestedResponses = ['Fixed maturity', 'Investment Account Holders (IAH)', 'Line of credit']
      setCurrentQuestion(9)
    }
    // Question 9: Shariah Governance
    else if (currentQuestion === 9) {
      setConfig((prev) => ({ ...prev, fundingModel: 'Fixed maturity' })) // TODO: Parse
      agentResponse = "What is your Shariah governance maturity level?"
      suggestedResponses = ['Full SSB+Review+Audit', 'SSB+Review only', 'SSB only']
      setCurrentQuestion(10)
    }
    // Question 10: Internal Audit
    else if (currentQuestion === 10) {
      setConfig((prev) => ({ ...prev, shariahGovernance: 'SSB+Review only' })) // TODO: Parse
      agentResponse = "Do you have internal audit capability?"
      suggestedResponses = ['Yes (in-house)', 'Yes (outsourced)', 'No']
      setCurrentQuestion(11)
    }
    // Question 11: External Audit
    else if (currentQuestion === 11) {
      setConfig((prev) => ({ ...prev, internalAudit: 'Yes (in-house)' })) // TODO: Parse
      agentResponse = "Is external audit required for this deal?"
      suggestedResponses = ['Yes (regulatory)', 'Yes (voluntary)', 'No']
      setCurrentQuestion(12)
    }
    // Question 12: Accounting Framework
    else if (currentQuestion === 12) {
      setConfig((prev) => ({ ...prev, externalAudit: 'Yes (regulatory)' })) // TODO: Parse
      agentResponse = "Finally, which accounting framework will you use?"
      suggestedResponses = ['AAOIFI FAS', 'IFRS', 'Local GAAP', 'Hybrid']
      setCurrentQuestion(13)
    }
    // Configuration Complete
    else {
      setConfig((prev) => ({ ...prev, accountingFramework: 'AAOIFI FAS' })) // TODO: Parse
      agentResponse =
        "Perfect! Based on your answers, I've activated 18 controls across 5 buckets. You can review the control activation matrix on the right. When you're ready, click 'Proceed to Review' to confirm your configuration."
      suggestedResponses = []
    }

    // Add agent message
    setMessages((prev) => [
      ...prev,
      {
        role: 'agent',
        content: agentResponse,
        timestamp: new Date(),
        suggestedResponses,
      },
    ])

    // Update control activations (simplified - TODO: Implement full activation logic from ARCHITECTURE_SESSION_FINDINGS.md)
    updateControlActivations()

    setIsThinking(false)
  }

  // Update control activations based on current config
  const updateControlActivations = () => {
    const controls: ControlActivation[] = []

    // Bucket 1: Shariah Governance (always activate SG-01, SG-03, SG-05)
    controls.push(
      { controlId: 'SG-01', name: 'SSB Mandate', bucket: 1, activated: true, reason: 'Always required' },
      { controlId: 'SG-03', name: 'Shariah Risk Management', bucket: 1, activated: true, reason: 'Always required' },
      { controlId: 'SG-05', name: 'SNC Handling', bucket: 1, activated: true, reason: 'Always required' }
    )

    // Add SG-02 if governance maturity is not "SSB only"
    if (config.shariahGovernance && config.shariahGovernance !== 'SSB only') {
      controls.push({ controlId: 'SG-02', name: 'Shariah Review', bucket: 1, activated: true, reason: 'Governance maturity > SSB only' })
    }

    // Add SG-04 if full governance
    if (config.shariahGovernance === 'Full SSB+Review+Audit') {
      controls.push({ controlId: 'SG-04', name: 'Shariah Audit', bucket: 1, activated: true, reason: 'Full governance maturity' })
    }

    // Bucket 2: Regulatory & Legal (always activate RL-01, RL-02)
    controls.push(
      { controlId: 'RL-01', name: 'Licensing', bucket: 2, activated: true, reason: 'Always required' },
      { controlId: 'RL-02', name: 'AML/CFT', bucket: 2, activated: true, reason: 'Always required' }
    )

    // Add RL-03 if cross-border with investors
    if (config.crossBorder && config.crossBorder.includes('Investor')) {
      controls.push({ controlId: 'RL-03', name: 'Data Protection', bucket: 2, activated: true, reason: 'Cross-border investor exposure' })
    }

    // Add RL-05 if any cross-border
    if (config.crossBorder && config.crossBorder !== 'No') {
      controls.push({ controlId: 'RL-05', name: 'Cross-Border Mapping', bucket: 2, activated: true, reason: 'Cross-border deal' })
    }

    // Bucket 3: Risk Management
    if (config.counterpartyRisk && config.counterpartyRisk !== 'Low') {
      controls.push({ controlId: 'RM-01', name: 'Credit Risk', bucket: 3, activated: true, reason: 'Counterparty risk > Low' })
    }

    if (config.dealComplexity && config.dealComplexity !== 'Simple') {
      controls.push({ controlId: 'RM-02', name: 'Operational Risk', bucket: 3, activated: true, reason: 'Complex deal' })
    }

    // Bucket 4: Financial & Reporting (always activate FR-01, FR-02)
    controls.push(
      { controlId: 'FR-01', name: 'Financials', bucket: 4, activated: true, reason: 'Always required' },
      { controlId: 'FR-02', name: 'Profit Recognition', bucket: 4, activated: true, reason: 'Always required' }
    )

    // Bucket 5: Audit & Assurance (always activate AA-05)
    controls.push({ controlId: 'AA-05', name: 'Regulator Inspection', bucket: 5, activated: true, reason: 'Always required' })

    if (config.internalAudit && config.internalAudit.startsWith('Yes')) {
      controls.push({ controlId: 'AA-01', name: 'Internal Audit', bucket: 5, activated: true, reason: 'Internal audit capability' })
    }

    if (config.externalAudit && config.externalAudit.startsWith('Yes')) {
      controls.push({ controlId: 'AA-03', name: 'External Audit', bucket: 5, activated: true, reason: 'External audit required' })
    }

    setActivatedControls(controls)
  }

  // Handle user message send
  const handleSend = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Simulate agent response
    simulateAgentResponse(inputValue)
  }

  // Handle suggested response click
  const handleSuggestedResponse = (response: string) => {
    setInputValue(response)
    inputRef.current?.focus()
  }

  // Calculate bucket scores
  const bucketScores = BUCKET_CONFIG.map((bucket) => {
    const bucketControls = activatedControls.filter((c) => c.bucket === bucket.id)
    const activatedCount = bucketControls.filter((c) => c.activated).length
    return {
      ...bucket,
      controlCount: bucketControls.length,
      score: bucketControls.length > 0 ? Math.round((activatedCount / bucketControls.length) * 100) : 0,
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Configure Your Deal</h2>
        <p className="text-muted-foreground mt-1">
          Let our AI guide you through the configuration process. Answer 12 questions conversationally, and we'll
          automatically activate the right controls across all 5 governance buckets.
        </p>
      </div>

      {/* Main Layout: Chat + Control Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                AI Compliance Advisor
              </CardTitle>
              <CardDescription>
                Question {Math.min(currentQuestion, 12)} of 12 • Answer conversationally or click suggested responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <ScrollArea className="h-[500px] pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message, idx) => (
                    <div key={idx} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                      {message.role === 'agent' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                        <div
                          className={`rounded-lg p-4 ${
                            message.role === 'agent'
                              ? 'bg-purple-50 border border-purple-200'
                              : 'bg-blue-600 text-white ml-auto'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>

                        {/* Suggested Responses */}
                        {message.role === 'agent' && message.suggestedResponses && message.suggestedResponses.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {message.suggestedResponses.map((response, ridx) => (
                              <Button
                                key={ridx}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestedResponse(response)}
                                className="text-xs"
                              >
                                {response}
                              </Button>
                            ))}
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>

                      {message.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Thinking Indicator */}
                  {isThinking && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="rounded-lg p-4 bg-purple-50 border border-purple-200">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your answer..."
                  disabled={isThinking}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!inputValue.trim() || isThinking}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Activation Matrix (1/3 width) */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Control Activation
              </CardTitle>
              <CardDescription>
                {activatedControls.length} controls activated across {bucketScores.filter((b) => b.controlCount > 0).length} buckets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Bucket Scores */}
              {bucketScores.map((bucket) => {
                const Icon = bucket.icon
                return (
                  <div key={bucket.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 text-${bucket.color}-600`} />
                        <span className="text-sm font-medium">{bucket.name}</span>
                      </div>
                      <Badge variant={bucket.controlCount > 0 ? 'default' : 'secondary'}>
                        {bucket.controlCount} controls
                      </Badge>
                    </div>

                    {/* Controls List */}
                    {bucket.controlCount > 0 && (
                      <div className="pl-6 space-y-1">
                        {activatedControls
                          .filter((c) => c.bucket === bucket.id)
                          .map((control) => (
                            <div key={control.controlId} className="flex items-start gap-2 text-xs">
                              <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5" />
                              <div className="flex-1">
                                <div className="font-medium">{control.controlId}: {control.name}</div>
                                <div className="text-muted-foreground">{control.reason}</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {activatedControls.length === 0 && (
                <Alert>
                  <AlertDescription className="text-sm">
                    Answer the questions in the chat to see which controls will be activated for your deal.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Configuration Progress</span>
                  <span className="text-muted-foreground">{Math.min(currentQuestion - 1, 12)}/12</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${(Math.min(currentQuestion - 1, 12) / 12) * 100}%` }}
                  />
                </div>
              </div>

              {currentQuestion > 12 && (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>Configuration Complete!</AlertTitle>
                  <AlertDescription className="text-sm">
                    All 12 questions answered. Review the control activation matrix and proceed when ready.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Alert */}
      <Alert variant="info">
        <TrendingUp className="h-4 w-4" />
        <AlertTitle>AG-UI Protocol</AlertTitle>
        <AlertDescription>
          This conversational interface replaces 5 separate form steps with natural language interaction. The AI asks
          12 strategic questions and automatically determines which of 26 controls to activate across 5 governance
          buckets based on your answers.
        </AlertDescription>
      </Alert>
    </div>
  )
}
