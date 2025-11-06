/**
 * Interactive Product Tour Steps
 * Based on DEMO_ONBOARDING_PLAN.md - 5-Step Guided Walkthrough
 */

import { Step } from 'react-joyride';

export const tourSteps: Step[] = [
  // Step 1: Platform Overview (15 sec)
  {
    target: '[data-tour="dashboard"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-emerald-900">Welcome to ZeroH Islamic Finance Workflows! 👋</h3>
        <p className="text-sm text-gray-700">
          ZeroH helps you create Shariah-compliant financial products with AI-powered compliance checking.
        </p>
        <div className="mt-2 space-y-1 text-sm">
          <p><strong className="text-emerald-700">Navigate by role:</strong></p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li><strong>Business:</strong> Create financial products</li>
            <li><strong>Shariah Scholar:</strong> Review & approve</li>
            <li><strong>IT:</strong> Integrate systems</li>
          </ul>
        </div>
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

  // Step 2: Start Workflow (30 sec)
  {
    target: '[data-tour="methodology-connect"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-emerald-900">Connect to Shariah Standards 📚</h3>
        <p className="text-sm text-gray-700">
          Link to authoritative Islamic finance sources to ensure compliance:
        </p>
        <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
          <li><strong>AAOIFI:</strong> Accounting standards</li>
          <li><strong>IFSB:</strong> Regulatory frameworks</li>
          <li><strong>OIC Fiqh Academy:</strong> Shariah rulings</li>
        </ul>
        <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded">
          <p className="text-xs text-emerald-800">
            💡 <strong>Tip:</strong> Click "Demo Mode" to see pre-loaded examples
          </p>
        </div>
      </div>
    ),
    placement: 'right',
    spotlightClicks: true,
  },

  // Step 3: Structure Selection (30 sec)
  {
    target: '[data-tour="structure-selection"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-emerald-900">Choose Your Financial Structure 🏗️</h3>
        <p className="text-sm text-gray-700">
          Select from various Shariah-compliant structures:
        </p>
        <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
          <li><strong>Murabaha:</strong> Cost-plus financing</li>
          <li><strong>Ijara:</strong> Islamic leasing</li>
          <li><strong>Musharaka:</strong> Partnership financing</li>
          <li><strong>Sukuk:</strong> Islamic bonds</li>
        </ul>
        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded">
          <p className="text-xs text-amber-800">
            ℹ️ Hover over info icons to see Shariah rulings and use cases
          </p>
        </div>
      </div>
    ),
    placement: 'bottom',
  },

  // Step 4: AI Assistance (45 sec)
  {
    target: '[data-tour="ai-analysis"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-emerald-900">AI-Powered Compliance Analysis 🤖</h3>
        <p className="text-sm text-gray-700">
          Our AI analyzes documents against Shariah principles with full citation tracking.
        </p>
        <div className="mt-2 space-y-2">
          <div className="p-2 bg-blue-50 border border-blue-200 rounded">
            <p className="text-xs font-medium text-blue-900">Example questions:</p>
            <ul className="list-disc list-inside ml-2 text-xs text-blue-800 mt-1">
              <li>"Is this riba-compliant?"</li>
              <li>"Check for gharar elements"</li>
              <li>"Verify maysir prohibition"</li>
            </ul>
          </div>
          <p className="text-xs text-gray-600">
            <strong>Every answer includes:</strong> Source citations, confidence scores, and Shariah references
          </p>
        </div>
      </div>
    ),
    placement: 'left',
  },

  // Step 5: Collaboration (30 sec)
  {
    target: '[data-tour="collaboration"]',
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-emerald-900">Multi-Stakeholder Collaboration 👥</h3>
        <p className="text-sm text-gray-700">
          Collaborate with scholars and business teams in real-time:
        </p>
        <ul className="list-disc list-inside ml-2 space-y-1 text-sm">
          <li><strong>Comment threads</strong> on specific sections</li>
          <li><strong>Approval workflows</strong> with notifications</li>
          <li><strong>Audit trails</strong> for full transparency</li>
          <li><strong>Version control</strong> for documents</li>
        </ul>
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
          <p className="text-xs text-green-800">
            ✅ All changes are tracked for compliance and audit purposes
          </p>
        </div>
      </div>
    ),
    placement: 'top',
  },
];

/**
 * Tour styling configuration
 * Matches brand colors (Islamic Green) and design system
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
  tooltipTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
  },
  tooltipContent: {
    fontSize: 14,
    lineHeight: 1.6,
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

/**
 * Tour locale configuration
 * Customizes button labels and messages
 */
export const tourLocale = {
  back: 'Back',
  close: 'Close',
  last: 'Finish Tour',
  next: 'Next',
  open: 'Open the dialog',
  skip: 'Skip Tour',
};
