'use client'

/**
 * STEP 1: BACKEND ARCHITECTURE OVERVIEW
 * ======================================
 * Showcase the platform's comprehensive backend infrastructure for customer demos.
 *
 * WHAT THIS STEP SHOWS:
 * - Core AI Services (4 active/connected services)
 * - Blockchain Integration Layer (4 in-development services)
 * - Asset Tokenization Studio (2 in-development services)
 * - Research & Discovery Services (3 in-development services)
 * - AI Knowledge Base (20+ authoritative sources across 23 disciplines)
 * - Optional: Explore Knowledge Graph (natural language search)
 *
 * WHY THIS IS FIRST:
 * - Demonstrates platform sophistication to customers
 * - Shows both current capabilities and future roadmap
 * - Provides transparency on service availability
 * - Validates knowledge base completeness
 *
 * USER EXPERIENCE:
 * - See impressive backend architecture at a glance
 * - Understand which services are active vs. in development
 * - Explore pre-loaded knowledge base (23 disciplines)
 * - Optional: Test knowledge graph search capabilities
 */

import { useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Brain,
  Network,
  Coins,
  Search,
  BookOpen,
  Shield,
  Globe,
  Calculator,
  TrendingUp,
  CheckCircle2,
  Circle,
  Info,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { searchGraphiti, type GraphitiSearchResponse } from '@/lib/api'

export function Step1SourceConnection() {
  const execution = useWorkflowStore((state) => state.execution)
  const addError = useWorkflowStore((state) => state.addError)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GraphitiSearchResponse | null>(null)
  const [searching, setSearching] = useState(false)

  // Handle knowledge graph search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const results = await searchGraphiti({
        query: searchQuery,
        num_results: 10,
      })
      setSearchResults(results)
    } catch (error: any) {
      addError({
        id: `error_${Date.now()}`,
        timestamp: new Date().toISOString(),
        severity: 'error',
        title: 'Search Failed',
        message: error.message || 'Failed to search knowledge graph',
        technicalDetails: error.stack,
        dismissible: true,
      })
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* SECTION 1: WHAT'S HAPPENING - UPDATED */}
      {/* ============================================================ */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Backend Architecture Overview</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>ZeroH</strong> is powered by a modular backend architecture connecting:
          </p>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>AI Memory System (Graphiti)</strong> - Persistent knowledge graph for institutional learning</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Document Processing Pipeline</strong> - Extract insights from AAOIFI, regulatory filings, and contracts</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Workflow Orchestration</strong> - AI-driven execution with human collaboration checkpoints</span>
            </li>
            <li className="flex items-start gap-2">
              <Circle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span><strong>Blockchain Integration (Future)</strong> - Hedera Guardian for verifiable compliance certificates</span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-gray-600">
            <Info className="h-3 w-3 inline mr-1" />
            Services marked with <CheckCircle2 className="h-3 w-3 inline text-green-600 mx-1" /> are currently active.
            Services marked with <Circle className="h-3 w-3 inline text-amber-500 mx-1" /> are in development.
          </p>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* SECTION 2A: CORE AI SERVICES (CONNECTED) */}
      {/* ============================================================ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle>Core AI Services</CardTitle>
            <Badge className="ml-auto bg-green-600">4/4 Connected</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

            {/* Service 1: Graphiti Knowledge Graph */}
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Graphiti Knowledge Graph</h4>
                  <Badge variant="outline" className="text-xs">Neo4j + OpenAI</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Persistent institutional memory tracking entities, relationships, and temporal facts across all transactions
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Entity Recognition</Badge>
                  <Badge variant="secondary" className="text-xs">Citation Tracking</Badge>
                  <Badge variant="secondary" className="text-xs">Learning Extraction</Badge>
                </div>
              </div>
            </div>

            {/* Service 2: Document Processing */}
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Document Processing Pipeline</h4>
                  <Badge variant="outline" className="text-xs">LlamaParse + Claude</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Extract structured data from PDFs, Word docs, and text files with semantic understanding
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">PDF Parsing</Badge>
                  <Badge variant="secondary" className="text-xs">OCR</Badge>
                  <Badge variant="secondary" className="text-xs">Table Extraction</Badge>
                </div>
              </div>
            </div>

            {/* Service 3: AI Orchestrator */}
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">AI Workflow Orchestrator</h4>
                  <Badge variant="outline" className="text-xs">Claude Sonnet 4.5</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Multi-step reasoning with tool use, streaming execution, and interruption handling
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Session Management</Badge>
                  <Badge variant="secondary" className="text-xs">SSE Streaming</Badge>
                  <Badge variant="secondary" className="text-xs">Feedback Loops</Badge>
                </div>
              </div>
            </div>

            {/* Service 4: MCP Integration Layer */}
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Model Context Protocol (MCP)</h4>
                  <Badge variant="outline" className="text-xs">Claude Agent SDK</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Standardized protocol for connecting AI models to external data sources and tools
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Graphiti MCP</Badge>
                  <Badge variant="secondary" className="text-xs">Tool Discovery</Badge>
                  <Badge variant="secondary" className="text-xs">Bi-directional Comms</Badge>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* SECTION 2B: BLOCKCHAIN SERVICES (IN DEVELOPMENT) */}
      {/* ============================================================ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-indigo-600" />
            <CardTitle>Blockchain Integration Layer</CardTitle>
            <Badge className="ml-auto bg-amber-500">Development Phase</Badge>
          </div>
          <CardDescription className="text-xs mt-1">
            Hedera DLT integration for verifiable compliance certification and tokenization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

            {/* Service 5: Hedera Guardian */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Circle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Hedera Guardian</h4>
                  <Badge variant="outline" className="text-xs">Policy Engine</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Transform compliance requirements into executable policies with verifiable credentials
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Policy Digitization</Badge>
                  <Badge variant="secondary" className="text-xs">VP/VC Issuance</Badge>
                  <Badge variant="secondary" className="text-xs">Trust Chain</Badge>
                </div>
              </div>
            </div>

            {/* Service 6: HCS (Consensus Service) */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Circle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Hedera Consensus Service (HCS)</h4>
                  <Badge variant="outline" className="text-xs">Audit Trail</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Immutable timestamping and ordering of compliance events and policy executions
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Topic Streaming</Badge>
                  <Badge variant="secondary" className="text-xs">Event Ordering</Badge>
                  <Badge variant="secondary" className="text-xs">Tamper Proof</Badge>
                </div>
              </div>
            </div>

            {/* Service 7: HTS (Token Service) */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Circle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Hedera Token Service (HTS)</h4>
                  <Badge variant="outline" className="text-xs">NFT Minting</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Mint compliance certificates as NFTs with embedded credential metadata
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">NFT Creation</Badge>
                  <Badge variant="secondary" className="text-xs">Metadata Storage</Badge>
                  <Badge variant="secondary" className="text-xs">Transfer Control</Badge>
                </div>
              </div>
            </div>

            {/* Service 8: IPFS Storage */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Circle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">IPFS Decentralized Storage</h4>
                  <Badge variant="outline" className="text-xs">Content Addressing</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Permanent, censorship-resistant storage for compliance documents and credentials
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">CID Generation</Badge>
                  <Badge variant="secondary" className="text-xs">Pinning</Badge>
                  <Badge variant="secondary" className="text-xs">Retrieval</Badge>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* SECTION 2C: ASSET TOKENIZATION (IN DEVELOPMENT) */}
      {/* ============================================================ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-green-600" />
            <CardTitle>Asset Tokenization Studio (ATS)</CardTitle>
            <Badge className="ml-auto bg-amber-500">Development Phase</Badge>
          </div>
          <CardDescription className="text-xs mt-1">
            Convert compliance-certified Islamic finance assets into tradeable digital tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

            {/* Service 9: Sukuk Tokenization */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Circle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Asset Token Issuance</h4>
                  <Badge variant="outline" className="text-xs">Fractional Ownership</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Create fungible tokens representing Islamic finance assets (Sukuk, Mudaraba, Musharaka) with built-in compliance validation
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Token Creation</Badge>
                  <Badge variant="secondary" className="text-xs">Supply Management</Badge>
                  <Badge variant="secondary" className="text-xs">Compliance Link</Badge>
                </div>
              </div>
            </div>

            {/* Service 10: Secondary Market Integration */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Circle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Secondary Market Connectivity</h4>
                  <Badge variant="outline" className="text-xs">Trading Infrastructure</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Connect tokenized assets to exchanges and liquidity pools for Shariah-compliant secondary trading
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">DEX Integration</Badge>
                  <Badge variant="secondary" className="text-xs">Order Book</Badge>
                  <Badge variant="secondary" className="text-xs">Settlement</Badge>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* SECTION 2D: RESEARCH & DISCOVERY (IN DEVELOPMENT) */}
      {/* ============================================================ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            <CardTitle>Research & Discovery Services</CardTitle>
            <Badge className="ml-auto bg-amber-500">Development Phase</Badge>
          </div>
          <CardDescription className="text-xs mt-1">
            AI-powered research across regulatory databases and legal precedents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

            {/* Service 11: Exa AI Research */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Circle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Exa AI Research Agent</h4>
                  <Badge variant="outline" className="text-xs">Semantic Search</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Neural search across academic papers, regulatory filings, and industry reports
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Citation Discovery</Badge>
                  <Badge variant="secondary" className="text-xs">Source Verification</Badge>
                  <Badge variant="secondary" className="text-xs">Knowledge Update</Badge>
                </div>
              </div>
            </div>

            {/* Service 12: Firecrawl Web Extraction */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Circle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Firecrawl Document Extraction</h4>
                  <Badge variant="outline" className="text-xs">Web Scraping</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Extract structured data from regulatory websites and document repositories
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Page Crawling</Badge>
                  <Badge variant="secondary" className="text-xs">Content Parsing</Badge>
                  <Badge variant="secondary" className="text-xs">Markdown Export</Badge>
                </div>
              </div>
            </div>

            {/* Service 13: Perplexity Real-time Research */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Circle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">Perplexity Real-time Intelligence</h4>
                  <Badge variant="outline" className="text-xs">Live Updates</Badge>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Monitor regulatory changes and market developments in real-time
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">Regulatory Alerts</Badge>
                  <Badge variant="secondary" className="text-xs">Market News</Badge>
                  <Badge variant="secondary" className="text-xs">Precedent Tracking</Badge>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* SECTION 3: AI KNOWLEDGE BASE */}
      {/* ============================================================ */}
      <Card className="border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <CardTitle>AI Knowledge Base</CardTitle>
            <Badge className="ml-auto bg-green-600">20+ Authoritative Sources</Badge>
          </div>
          <CardDescription className="text-xs mt-1">
            Pre-loaded with authoritative documents across all Islamic finance disciplines
          </CardDescription>
        </CardHeader>
        <CardContent>

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-xs text-gray-600">Shariah Structures</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-xs text-gray-600">Jurisdictions</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-xs text-gray-600">Accounting Frameworks</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-2xl font-bold text-amber-600">8</div>
              <div className="text-xs text-gray-600">Impact Metrics</div>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">

            {/* Category 1: Shariah Structures */}
            <AccordionItem value="shariah">
              <AccordionTrigger className="text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Shariah Structures (7)
                  <Badge variant="outline" className="text-xs ml-2">AAOIFI Standards</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Ijara</span> - AAOIFI SS 9, FAS 33
                      <p className="text-gray-600">Lease-based structures (60% market share)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Murabaha</span> - AAOIFI FAS 28
                      <p className="text-gray-600">Cost-plus financing structures</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Musharaka</span> - AAOIFI FAS 4
                      <p className="text-gray-600">Partnership-based financing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Mudaraba</span> - AAOIFI SS 40
                      <p className="text-gray-600">Profit-sharing agreements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Istisna, Salam, Wakala</span> - AAOIFI Standards
                      <p className="text-gray-600">Manufacturing, forward sale, agency contracts</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Category 2: Jurisdictions */}
            <AccordionItem value="jurisdictions">
              <AccordionTrigger className="text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  Jurisdictions (5)
                  <Badge variant="outline" className="text-xs ml-2">Regulatory Frameworks</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">UAE DFSA</span> - DFSA Rulebook (Sukuks Module)
                      <p className="text-gray-600">Dubai Financial Services Authority</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Saudi CMA</span> - Chambers Islamic Finance Guide 2025
                      <p className="text-gray-600">Capital Market Authority regulations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Qatar QFC</span> - QFC Rulebook IBANK 10.1.2, Sustainable Framework
                      <p className="text-gray-600">Qatar Financial Centre regulations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Malaysia SC</span> - Guidelines on Islamic Capital Market Products
                      <p className="text-gray-600">Securities Commission Malaysia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Luxembourg</span> - Securitisation Law, Islamic Finance Framework
                      <p className="text-gray-600">European Islamic finance hub</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Category 3: Accounting */}
            <AccordionItem value="accounting">
              <AccordionTrigger className="text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-purple-600" />
                  Accounting Frameworks (3)
                  <Badge variant="outline" className="text-xs ml-2">Financial Standards</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">AAOIFI</span> - 62+ FAS, 65+ Shariah Standards
                      <p className="text-gray-600">Islamic accounting & auditing standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">IFRS + Islamic</span> - SSRN Research Papers
                      <p className="text-gray-600">IFRS reconciliation with Islamic principles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Local GAAP</span> - Jurisdiction-specific
                      <p className="text-gray-600">Covered in regulatory frameworks above</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Category 4: Impact Metrics */}
            <AccordionItem value="impact">
              <AccordionTrigger className="text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  Impact Metrics (8)
                  <Badge variant="outline" className="text-xs ml-2">ESG & Sustainability</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Green Sukuk</span> - ICMA Guidance (April 2024, 28 pages PDF)
                      <p className="text-gray-600">Green, Social, Sustainability Sukuk principles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">SDG Sukuk</span> - UNDP Report
                      <p className="text-gray-600">UN Sustainable Development Goals alignment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">ESG Framework</span> - ICMA Sustainable Sukuk
                      <p className="text-gray-600">Environmental, Social, Governance criteria</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">QFC Sustainable</span> - Qatar Sustainable Framework
                      <p className="text-gray-600">Qatar Financial Centre green sukuk standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">VBI Malaysia</span> - Bank Negara VBI Framework
                      <p className="text-gray-600">Value-Based Intermediation impact assessment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Islamic Social Finance</span> - Research Papers
                      <p className="text-gray-600">Zakat, Waqf, Qard Hassan integration</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">CBI Certification</span> - Climate Bonds Initiative
                      <p className="text-gray-600">Green sukuk certification standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">No Impact</span> - N/A
                      <p className="text-gray-600">Conventional transactions without impact metrics</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          {/* View Full Documentation Link */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <ExternalLink className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-900">View Complete Knowledge Base</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              See KNOWLEDGE_BASE_AUTHORITATIVE_SOURCES.md for full document catalog with URLs and accessibility information
            </p>
          </div>

        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* SECTION 4: OPTIONAL KNOWLEDGE GRAPH SEARCH */}
      {/* ============================================================ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-600" />
            Optional: Explore Knowledge Graph
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            Test natural language queries against the Graphiti knowledge graph (demo feature)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g., What are the requirements for Murabaha contracts?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
            <Button onClick={handleSearch} disabled={searching || !searchQuery.trim()}>
              {searching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  Results for "{searchResults.query}"
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {searchResults.total_results} {searchResults.total_results === 1 ? 'fact' : 'facts'}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {searchResults.context?.confidence || 'medium'} confidence
                  </Badge>
                </div>
              </div>

              {searchResults.total_results === 0 ? (
                <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground text-center">
                  No results found. Try a different query.
                </div>
              ) : (
                <>
                  {/* Answer Summary */}
                  {searchResults.answer && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <h5 className="text-sm font-semibold text-primary mb-2">
                        Summary
                      </h5>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {searchResults.answer}
                      </div>
                    </div>
                  )}

                  {/* Facts */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    <h5 className="text-sm font-semibold">Knowledge Graph Facts</h5>
                    {searchResults.results.map((result, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <p className="text-sm leading-relaxed flex-1">
                            {result.fact}
                          </p>
                          <Badge variant="outline" className="text-xs whitespace-nowrap">
                            {(result.relevance * 100).toFixed(0)}% match
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 pt-2 border-t">
                          <span className="font-medium">{result.type}</span>
                          {result.temporal?.created && (
                            <time>• {new Date(result.temporal.created).toLocaleDateString()}</time>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
