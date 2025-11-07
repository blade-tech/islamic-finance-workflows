/**
 * PER-PAGE MINI TOURS
 * ===================
 * Context-aware tours that show only what's on the current page.
 * Perfect for demos - no complex navigation, no missing targets.
 */

import { Step } from 'react-joyride';

/**
 * Tour configurations for each workflow step and navigation page
 * - Numeric keys (0-11): Workflow steps
 * - String keys ('/dashboard', '/deals', etc.): Navigation pages
 */
export const pageTours: Record<number | string, Step[]> = {
  // Step 0: Overview Screen
  0: [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Welcome to ZeroH! 👋</h3>
          <p className="text-sm text-gray-700">
            Choose how you want to use the platform:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Complete Workflow:</strong> Full product creation (15-20 min)</li>
            <li><strong>Impact Measurement:</strong> ESG/sustainability tracking only</li>
            <li><strong>Compliance Check:</strong> Quick Shariah validation (3-5 min)</li>
          </ul>
          <p className="text-xs text-emerald-700 mt-2">
            💡 <strong>Tip:</strong> Click any card to get started
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 420,
        },
      },
    },
  ],

  // Step 1: Connect Sources
  1: [
    {
      target: '[data-tour="methodology-connect"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Backend Architecture Overview 🏗️</h3>
          <p className="text-sm text-gray-700">
            Welcome to ZeroH's modular backend infrastructure. This page demonstrates:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Active Services:</strong> 4 core AI services (Graphiti, Document Processing, AI Orchestrator, MCP)</li>
            <li><strong>Development Phase:</strong> Blockchain integration (Hedera Guardian), Asset Tokenization (ATS), Research tools</li>
            <li><strong>Knowledge Base:</strong> 20+ authoritative sources across 23 Islamic finance disciplines</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            💡 <strong>Why this is first:</strong> Shows platform sophistication and validates knowledge base completeness
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="core-ai-services"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Core AI Services 🧠</h3>
          <p className="text-sm text-gray-700">
            These 4 services are fully connected and operational:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Graphiti Knowledge Graph:</strong> Persistent institutional memory (Neo4j + OpenAI)</li>
            <li><strong>Document Processing:</strong> PDF/DOCX parsing with semantic understanding (LlamaParse + Claude)</li>
            <li><strong>AI Workflow Orchestrator:</strong> Multi-step reasoning with streaming execution (Claude Sonnet 4.5)</li>
            <li><strong>MCP Integration Layer:</strong> Model Context Protocol for connecting AI to external tools</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            Green checkmarks indicate active services; amber circles indicate services in development
          </p>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: '[data-tour="knowledge-base"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">AI Knowledge Base 📚</h3>
          <p className="text-sm text-gray-700">
            Pre-loaded with 20+ authoritative documents covering all Islamic finance disciplines:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>7 Shariah Structures:</strong> AAOIFI standards for Ijara, Murabaha, Musharaka, Mudaraba, etc.</li>
            <li><strong>5 Jurisdictions:</strong> UAE DFSA, Saudi CMA, Qatar QFC, Malaysia SC, Luxembourg</li>
            <li><strong>3 Accounting Frameworks:</strong> AAOIFI FAS, IFRS + Islamic, Local GAAP</li>
            <li><strong>8 Impact Metrics:</strong> Green Sukuk, SDG, ESG, VBI, CBI certification</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            💡 Click accordions to see full document catalog with source citations
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="ai-analysis"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Knowledge Graph Search 🔍</h3>
          <p className="text-sm text-gray-700">
            Test natural language queries against the Graphiti knowledge graph (demo feature):
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Entity Recognition:</strong> Automatically extracts people, companies, contracts</li>
            <li><strong>Citation Tracking:</strong> Full audit trail back to source documents</li>
            <li><strong>Temporal Facts:</strong> Tracks when information was true/valid</li>
            <li><strong>Learning Extraction:</strong> Captures insights from execution feedback</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            <strong>Try asking:</strong> "What are the requirements for Murabaha contracts?" or "Tell me about AAOIFI FAS 28"
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
  ],

  // Step 2: Select Shariah Structure
  2: [
    {
      target: '[data-tour="structure-selection"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Choose Shariah Structure 🏗️</h3>
          <p className="text-sm text-gray-700">
            Select from 7 Islamic finance structures:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Ijara:</strong> Lease-based financing (60% market share)</li>
            <li><strong>Murabaha:</strong> Cost-plus financing</li>
            <li><strong>Musharaka:</strong> Partnership/profit-sharing</li>
            <li><strong>Mudaraba:</strong> Trust-based profit sharing</li>
            <li><strong>Sukuk:</strong> Islamic bonds</li>
          </ul>
          <p className="text-xs text-emerald-700 mt-2">
            💡 <strong>Tip:</strong> Hover over ⓘ icons for detailed explanations
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
  ],

  // Step 3: Select Jurisdiction
  3: [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Select Jurisdiction 🌍</h3>
          <p className="text-sm text-gray-700">
            Choose your regulatory framework:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>UAE DFSA:</strong> Dubai International Financial Centre</li>
            <li><strong>Saudi CMA:</strong> Capital Market Authority</li>
            <li><strong>Qatar QFC:</strong> Qatar Financial Centre</li>
            <li><strong>Malaysia SC:</strong> Securities Commission</li>
            <li><strong>Luxembourg:</strong> European gateway for Sukuk</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            Each jurisdiction has unique disclosure and compliance requirements
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 420,
        },
      },
    },
  ],

  // Step 4: Select Accounting
  4: [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Select Accounting Standards 📊</h3>
          <p className="text-sm text-gray-700">
            Choose your accounting framework:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>AAOIFI:</strong> Islamic accounting standards (most authoritative)</li>
            <li><strong>IFRS + Islamic:</strong> Hybrid framework for international compliance</li>
            <li><strong>Local GAAP:</strong> Jurisdiction-specific standards</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            AAOIFI is recommended for pure Islamic finance institutions
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 420,
        },
      },
    },
  ],

  // Step 5: Select Impact Metrics
  5: [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Select Impact Framework 🌱</h3>
          <p className="text-sm text-gray-700">
            Choose ESG/sustainability metrics:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Green Sukuk (ICMA):</strong> Climate financing standards</li>
            <li><strong>SDG Alignment:</strong> UN Sustainable Development Goals</li>
            <li><strong>ESG Framework:</strong> Environmental, Social, Governance</li>
            <li><strong>VBI Malaysia:</strong> Value-Based Intermediation</li>
            <li><strong>Islamic Social Finance:</strong> Zakat, Waqf integration</li>
          </ul>
          <p className="text-xs text-emerald-700 mt-2">
            💡 Or select "No Impact" for conventional structures
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 420,
        },
      },
    },
  ],

  // Step 6: Review Configuration
  6: [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Review Your Configuration ✅</h3>
          <p className="text-sm text-gray-700">
            Validate your 4-component modular configuration before proceeding:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Component Summary:</strong> See all 4 selected components at a glance</li>
            <li><strong>Validation Engine:</strong> Checks compatibility and regulatory requirements</li>
            <li><strong>Edit Buttons:</strong> Quick navigation back to modify any component</li>
            <li><strong>Configuration Metadata:</strong> Auto-generated name and timestamps</li>
          </ul>
          <p className="text-xs text-emerald-700 mt-2">
            💡 <strong>Example:</strong> Saudi CMA requires AAOIFI accounting - validation catches this
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
  ],

  // Step 7: Configure Details
  7: [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Configure Deal Details 📋</h3>
          <p className="text-sm text-gray-700">
            Dynamic form generated from your 4 selected components:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Shariah Fields:</strong> Asset description, rental rates, profit sharing</li>
            <li><strong>Jurisdiction Fields:</strong> Regulatory disclosures, tax information</li>
            <li><strong>Accounting Fields:</strong> AAOIFI/IFRS-specific requirements</li>
            <li><strong>Impact Fields:</strong> ESG metrics, SDG alignment, carbon data</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            The form adapts based on your selections - pure modular architecture
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">AI Auto-Fill ✨</h3>
          <p className="text-sm text-gray-700">
            Claude AI suggests values based on industry best practices:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Toggle AI Assistance:</strong> Enable/disable AI suggestions</li>
            <li><strong>Sparkles Button:</strong> Click ✨ next to any field to apply AI suggestion</li>
            <li><strong>Smart Defaults:</strong> AI knows AAOIFI FAS 33 rental rate ranges</li>
            <li><strong>Context-Aware:</strong> Suggestions based on your selected components</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            💡 <strong>Try it:</strong> Look for sparkles ✨ icons next to form fields
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Compliance Standards 📜</h3>
          <p className="text-sm text-gray-700">
            Automatically applied standards from your configuration:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>AAOIFI Standards:</strong> FAS 33 (Ijara), FAS 32 (Wakala)</li>
            <li><strong>Shariah Standards:</strong> SS 23 (Agency), SS 9 (Ijara)</li>
            <li><strong>ICMA Principles:</strong> Green/Social/Sustainability Bond standards</li>
            <li><strong>SDG Framework:</strong> UN Sustainable Development Goals alignment</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            These standards are embedded and validated automatically
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
  ],

  // Step 8: Review Policy Structure
  8: [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">BPMN Workflow Visualization 🎨</h3>
          <p className="text-sm text-gray-700">
            ServiceNow-inspired 3-column layout showing your Guardian policy:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Left Panel:</strong> Workflow navigator (main + sub-workflows)</li>
            <li><strong>Center:</strong> BPMN canvas with interactive flowchart</li>
            <li><strong>Right Panel:</strong> Step details (slides in when clicking steps)</li>
            <li><strong>Policy Metadata:</strong> Schemas, roles, estimated execution time</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            💡 <strong>Tip:</strong> Click any workflow step in the canvas to see details
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Sub-Workflows 🔀</h3>
          <p className="text-sm text-gray-700">
            Complex workflows are broken into manageable sub-processes:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Main Workflow:</strong> Primary Sukuk/Ijara issuance flow</li>
            <li><strong>ESG Verification:</strong> Impact metrics validation sub-workflow</li>
            <li><strong>Audit Process:</strong> AAOIFI/IFRS audit sub-workflow</li>
            <li><strong>Shariah Review:</strong> Compliance certification sub-workflow</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            Switch between workflows using the navigator on the left
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
  ],

  // Step 9: Test Workflow
  9: [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Sandbox Testing 🧪</h3>
          <p className="text-sm text-gray-700">
            Run a complete simulation before deploying to blockchain:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>No Blockchain Cost:</strong> Test runs are 100% free</li>
            <li><strong>Full Execution:</strong> All 12 workflow steps simulated</li>
            <li><strong>Real-time Progress:</strong> Watch each step execute with timings</li>
            <li><strong>Stop/Resume:</strong> Pause testing anytime to inspect</li>
          </ul>
          <p className="text-xs text-emerald-700 mt-2">
            💡 <strong>Recommended:</strong> Always test before live deployment
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">AI Issue Detection 🔍</h3>
          <p className="text-sm text-gray-700">
            Claude AI monitors test execution for compliance issues:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>AAOIFI Validation:</strong> Checks FAS 33 compliance</li>
            <li><strong>Role Verification:</strong> Ensures all required participants assigned</li>
            <li><strong>Document Checks:</strong> Validates Shariah certification signatures</li>
            <li><strong>Smart Suggestions:</strong> AI proposes fixes for detected issues</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            ✨ <strong>AI Suggestion:</strong> "Add Shariah signature to asset valuation"
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Detailed Test Log 📝</h3>
          <p className="text-sm text-gray-700">
            Complete execution trace with timestamps:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Step-by-Step:</strong> Every workflow action logged</li>
            <li><strong>Timing Data:</strong> Duration for each step (helps estimate production time)</li>
            <li><strong>Color-Coded:</strong> Green (completed), Blue (in progress), Gray (pending)</li>
            <li><strong>Scrollable:</strong> View full execution history</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            Toggle "View Detailed Log" to see the complete trace
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
  ],

  // Step 10: Live Execution
  10: [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Deploy to Hedera Blockchain 🚀</h3>
          <p className="text-sm text-gray-700">
            Your validated workflow becomes an immutable Guardian policy:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Immutable Policy:</strong> Once deployed, structure cannot be modified</li>
            <li><strong>Cryptographic Verification:</strong> All actions permanently recorded</li>
            <li><strong>Public Transparency:</strong> Verify on HashScan.io</li>
            <li><strong>DID Onboarding:</strong> Participants receive verifiable credentials</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            ⚡ <strong>Cost:</strong> ~$0.50 USD on mainnet (testnet = free)
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">6-Phase Deployment 📦</h3>
          <p className="text-sm text-gray-700">
            Watch real-time deployment progress through 6 phases:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>1. Generate Policy:</strong> Compose Guardian BPMN from your config</li>
            <li><strong>2. Validate Structure:</strong> Check all schemas and workflows</li>
            <li><strong>3. Publish to IPFS:</strong> Immutable document storage</li>
            <li><strong>4. Publish to Blockchain:</strong> Record on Hedera Consensus Service</li>
            <li><strong>5. Create Workflow Topic:</strong> Establish HCS message topic</li>
            <li><strong>6. Assign Roles:</strong> Issue DIDs to all participants</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            Each phase shows transaction ID and HashScan verification link
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Participant Roles 👥</h3>
          <p className="text-sm text-gray-700">
            Multi-stakeholder workflow with verifiable credentials:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Issuer:</strong> ABC Islamic Bank (initiates workflow)</li>
            <li><strong>Shariah Advisor:</strong> Dr. Ahmed Al-Mansouri (compliance certification)</li>
            <li><strong>Auditor:</strong> XYZ Audit Firm (financial verification)</li>
            <li><strong>Trustee:</strong> DEF Trust Services (asset custody)</li>
          </ul>
          <p className="text-xs text-emerald-700 mt-2">
            📧 <strong>Email invites sent:</strong> Participants onboard via DID wallet
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Blockchain Verification 🔗</h3>
          <p className="text-sm text-gray-700">
            External verification via Hedera HashScan:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Policy ID:</strong> Unique Guardian policy identifier</li>
            <li><strong>Workflow Topic:</strong> HCS topic for all workflow messages</li>
            <li><strong>Transaction IDs:</strong> Hedera transaction identifiers (0.0.xxxxx@timestamp)</li>
            <li><strong>HashScan Links:</strong> Public blockchain explorer for transparency</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            Click "Verify on HashScan" to see your deployment on public blockchain
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
      styles: {
        options: {
          width: 450,
        },
      },
    },
  ],

  // Step 11: Monitor & Collaborate
  11: [
    {
      target: '[data-tour="collaboration"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Collaboration Features 👥</h3>
          <p className="text-sm text-gray-700">
            Multi-stakeholder workflow capabilities:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Real-time Comments:</strong> Discuss with scholars and business teams</li>
            <li><strong>Approval Workflow:</strong> Track sign-offs and reviews</li>
            <li><strong>Full Audit Trail:</strong> Complete compliance documentation</li>
            <li><strong>Activity Feed:</strong> See all changes and updates</li>
            <li><strong>Document Viewer:</strong> Annotate and review contracts</li>
          </ul>
        </div>
      ),
      placement: 'left',
      disableBeacon: true,
    },
  ],

  // =====================================================
  // NAVIGATION PAGE TOURS
  // =====================================================

  // Dashboard Page
  '/dashboard': [
    {
      target: '[data-tour="overall-compliance"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Overall Platform Compliance 📊</h3>
          <p className="text-sm text-gray-700">
            Real-time compliance score across all active deals:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Current Score:</strong> Aggregated compliance percentage</li>
            <li><strong>Active Deals:</strong> Total deals being monitored</li>
            <li><strong>Real-Time Updates:</strong> Recalculated as deals progress</li>
          </ul>
          <p className="text-xs text-emerald-700 mt-2">
            💡 Target: Maintain 90%+ compliance for regulatory reporting
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="summary-stats"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Deal Summary Stats 📈</h3>
          <p className="text-sm text-gray-700">
            Quick overview of deal status:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Total Deals:</strong> All active Islamic finance deals</li>
            <li><strong>Compliant Deals:</strong> Meeting all compliance thresholds</li>
            <li><strong>Need Attention:</strong> Deals requiring review or action</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="component-cards"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">4-Component Architecture 🎯</h3>
          <p className="text-sm text-gray-700">
            Modular compliance tracking system:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Shariah:</strong> Islamic finance structures (Ijara, Sukuk, Musharaka)</li>
            <li><strong>Jurisdiction:</strong> Regulatory compliance (UAE DFSA, Saudi CMA)</li>
            <li><strong>Accounting:</strong> AAOIFI FAS 33, IFRS standards</li>
            <li><strong>Impact:</strong> ESG, SDG, Green Sukuk metrics</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            Click any card to see detailed breakdown
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="monitoring-cards"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Monitoring & Status 🔍</h3>
          <p className="text-sm text-gray-700">
            Track operational activities:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Contracts:</strong> Pending signatures and reviews</li>
            <li><strong>Shariah Reviews:</strong> Scholar certifications in progress</li>
            <li><strong>Impact Validations:</strong> ESG metric verifications</li>
            <li><strong>Documents:</strong> Total uploaded compliance documents</li>
          </ul>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="quick-actions"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Quick Actions ⚡</h3>
          <p className="text-sm text-gray-700">
            Common navigation shortcuts:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Manage Deals:</strong> View all deals with filters</li>
            <li><strong>Digital Assets:</strong> Guardian certificates and tokens</li>
            <li><strong>Create New:</strong> Start workflow wizard (Steps 0-11)</li>
          </ul>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
  ],

  // Deals Page
  '/deals': [
    {
      target: '[data-tour="deals-header"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Deals & Digital Assets 🛡️</h3>
          <p className="text-sm text-gray-700">
            Manage Guardian certificates and ATS tokenization:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Deal Tracking:</strong> View all active Islamic finance deals</li>
            <li><strong>Compliance Monitoring:</strong> Real-time 4-component scores</li>
            <li><strong>Digital Assets:</strong> Guardian certificates and ATS tokens</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="deals-grid"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Deals Grid View 📋</h3>
          <p className="text-sm text-gray-700">
            All deals with compliance status at a glance:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Overall Compliance:</strong> Aggregate score for each deal</li>
            <li><strong>Component Breakdown:</strong> Shariah, Jurisdiction, Accounting, Impact</li>
            <li><strong>Status Badges:</strong> Active, Pending, Completed</li>
            <li><strong>Quick Actions:</strong> Details and Assets buttons</li>
          </ul>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="deal-card-example"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Deal Card Details 🎯</h3>
          <p className="text-sm text-gray-700">
            Each card shows comprehensive deal information:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Deal Name:</strong> Project or financing description</li>
            <li><strong>Overall Compliance:</strong> Aggregated score across all components</li>
            <li><strong>Component Mini-Cards:</strong> Color-coded progress indicators</li>
            <li><strong>Configuration:</strong> Shariah structure and jurisdiction</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            💡 Click "Assets" to view Guardian certificates and ATS tokens
          </p>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
    },
  ],

  // Digital Assets Page
  '/digital-assets': [
    {
      target: '[data-tour="assets-header"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Digital Assets Management 💼</h3>
          <p className="text-sm text-gray-700">
            Cross-deal view of blockchain-based assets:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Guardian Certificates:</strong> Immutable compliance certificates</li>
            <li><strong>ATS Tokens:</strong> Asset-backed securities on Hedera</li>
            <li><strong>Unified View:</strong> All digital assets in one dashboard</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="assets-metrics"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Platform Metrics 📈</h3>
          <p className="text-sm text-gray-700">
            Real-time digital asset statistics:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Total Deals:</strong> Deals with digital assets</li>
            <li><strong>Certificates:</strong> Guardian compliance certificates issued</li>
            <li><strong>Tokenized Assets:</strong> ATS tokens on Hedera</li>
            <li><strong>Total Supply:</strong> Sum of all token supplies</li>
            <li><strong>Holders:</strong> Unique token holder addresses</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="assets-tabs"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Asset Filters 📑</h3>
          <p className="text-sm text-gray-700">
            Filter by asset type:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>All Assets:</strong> Combined certificates and tokens</li>
            <li><strong>Certificates Only:</strong> Guardian compliance certificates</li>
            <li><strong>Tokens Only:</strong> ATS tokenized securities</li>
            <li><strong>Complete Set:</strong> Deals with both types</li>
          </ul>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="assets-grid"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Asset Cards 🔍</h3>
          <p className="text-sm text-gray-700">
            Detailed asset information per deal:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Certificate Status:</strong> Issued, Pending, Active</li>
            <li><strong>Token Details:</strong> Symbol, supply, holders</li>
            <li><strong>HashScan Links:</strong> Blockchain verification</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            💡 Click cards to view detailed asset information
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
  ],

  // Collaboration Page
  '/collaboration': [
    {
      target: '[data-tour="collab-hero"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Collaboration Hub 👥</h3>
          <p className="text-sm text-gray-700">
            Vanta-inspired multi-stakeholder workflow platform:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>15 Notification Types:</strong> Real-time alerts and updates</li>
            <li><strong>Task Management:</strong> Assign and track compliance tasks</li>
            <li><strong>Multi-stakeholder:</strong> Business, Shariah, Legal, Compliance, Finance</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="collab-features"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Core Features 🎨</h3>
          <p className="text-sm text-gray-700">
            Four main collaboration capabilities:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Notifications:</strong> Email, in-app, webhook delivery</li>
            <li><strong>Tasks:</strong> 4 priority levels with due dates</li>
            <li><strong>Comments:</strong> @mentions and threaded discussions</li>
            <li><strong>Stakeholders:</strong> Max 10 per contract, 5 role types</li>
          </ul>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="collab-roles"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Role Dashboards 👤</h3>
          <p className="text-sm text-gray-700">
            Personalized views for each stakeholder:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Business:</strong> Deal creation and configuration</li>
            <li><strong>Shariah:</strong> Compliance review and certification</li>
            <li><strong>Legal:</strong> Contract and regulatory compliance</li>
            <li><strong>Compliance:</strong> Audit trails and monitoring</li>
            <li><strong>Finance:</strong> Treasury and asset management</li>
          </ul>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="demo-cta"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Try the Demo 🎯</h3>
          <p className="text-sm text-gray-700">
            Explore collaboration with pre-populated data:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Demo Contract:</strong> Full collaboration interface</li>
            <li><strong>32 API Endpoints:</strong> Complete REST API</li>
            <li><strong>Role Examples:</strong> Sample dashboards for each role</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            💡 Click to see tasks, comments, notifications in action
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
  ],

  // Deal Detail Page (/deals/[id])
  '/deals/[id]': [
    {
      target: '[data-tour="deal-header"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Deal Overview 🏢</h3>
          <p className="text-sm text-gray-700">
            This is your central hub for managing individual deals. Key information at a glance:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Deal Name & ID:</strong> Unique identifier and description</li>
            <li><strong>Status Badge:</strong> Compliant, In Progress, or Needs Attention</li>
            <li><strong>Overall Completion:</strong> Aggregated compliance score across all components</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            💡 This page shows real-time compliance status and provides quick access to all deal resources
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="component-stats"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">4-Component Compliance 📊</h3>
          <p className="text-sm text-gray-700">
            Each deal is assessed across four modular compliance components:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>🕌 Shariah Structure:</strong> AAOIFI standards compliance (Ijara, Murabaha, Musharaka, etc.)</li>
            <li><strong>⚖️ Jurisdiction:</strong> Regulatory compliance (UAE DFSA, Saudi CMA, Qatar QFC, etc.)</li>
            <li><strong>📊 Accounting:</strong> Financial reporting standards (AAOIFI FAS, IFRS, Local GAAP)</li>
            <li><strong>🌱 Impact Metrics:</strong> Optional ESG and sustainability tracking (Green Sukuk, SDG, VBI)</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            Each component is scored independently, then aggregated for the overall completion score
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="component-tabs"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Detailed Compliance Breakdown 📋</h3>
          <p className="text-sm text-gray-700">
            Deep dive into each component's compliance status:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Overview Tab:</strong> All components at a glance</li>
            <li><strong>Component Tabs:</strong> Requirements, evidence count, attention needed</li>
            <li><strong>Contracts Tab:</strong> All contracts associated with this deal</li>
            <li><strong>Progress Cards:</strong> Visual breakdown of completed vs. pending requirements</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            💡 Click each tab to see granular details for Shariah, Jurisdiction, Accounting, and Impact
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="deal-config"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Deal Configuration ⚙️</h3>
          <p className="text-sm text-gray-700">
            The deal's core configuration determines which compliance requirements apply:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>Shariah Structure:</strong> Determines AAOIFI standards and Islamic principles</li>
            <li><strong>Jurisdiction:</strong> Determines regulatory framework and reporting obligations</li>
            <li><strong>Accounting Framework:</strong> Determines financial reporting standards</li>
            <li><strong>Impact Metrics:</strong> Optional sustainability and ESG framework</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2">
            These selections were made in the initial 11-step workflow
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour="quick-actions"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-emerald-900">Quick Actions Sidebar 🚀</h3>
          <p className="text-sm text-gray-700">
            Navigate to key deal management features:
          </p>
          <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
            <li><strong>View Contracts:</strong> All contracts filtered for this deal</li>
            <li><strong>Collaboration Hub:</strong> Tasks, comments, notifications (Vanta-inspired)</li>
            <li><strong>My Tasks:</strong> Tasks assigned to you for this deal</li>
            <li><strong>Digital Assets:</strong> Guardian certificates and ATS tokenization</li>
            <li><strong>Upload Document:</strong> Add supporting evidence (coming soon)</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            💡 <strong>Tip:</strong> Use "Digital Assets" to view blockchain-based compliance certificates
          </p>
        </div>
      ),
      placement: 'left',
      disableBeacon: true,
    },
  ],
};

/**
 * Get tour steps for current workflow step or navigation page
 * @param pageKey - Workflow step index (0-11) or navigation route ('/dashboard', '/deals', etc.)
 */
export function getTourForPage(pageKey: number | string): Step[] | null {
  return pageTours[pageKey] || null;
}

/**
 * Check if current page has a tour available
 * @param pageKey - Workflow step index (0-11) or navigation route ('/dashboard', '/deals', etc.)
 */
export function hasTourForPage(pageKey: number | string): boolean {
  return !!pageTours[pageKey];
}

/**
 * Shared tour styling (consistent with existing tours)
 */
export const tourStyles = {
  options: {
    arrowColor: '#ffffff',
    backgroundColor: '#ffffff',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    primaryColor: '#10b981', // Islamic Green (emerald-500)
    textColor: '#1f2937', // gray-800
    width: 380,
    zIndex: 10000,
  },
  tooltip: {
    borderRadius: 12,
    padding: 20,
  },
  tooltipContainer: {
    textAlign: 'left' as const,
  },
  buttonNext: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 500,
  },
  buttonBack: {
    color: '#6b7280',
    marginRight: 8,
    fontSize: 14,
  },
  buttonSkip: {
    color: '#9ca3af',
    fontSize: 13,
  },
};

export const tourLocale = {
  back: 'Back',
  close: 'Close',
  last: 'Got it!',
  next: 'Next',
  open: 'Open the dialog',
  skip: 'Skip',
};
