/**
 * SCREEN 6: TRUST PORTAL (CUSTOMER-FACING)
 * Proof-constrained AI chatbot with selective disclosure
 * External stakeholders see only verified, minimal claims
 */

'use client'

import { useState } from 'react'
import { Shield, CheckCircle2, Lock, ExternalLink, MessageSquare, Sparkles, Hash, Eye, EyeOff } from 'lucide-react'
import { getCredentialsByDeal, getSelectiveDisclosureView } from '@/lib/mock-data/credentials'
import { getDealById } from '@/lib/mock-data/deals'

export default function TrustPortalPage() {
  const [selectedVC, setSelectedVC] = useState<string | null>(null)
  const [showFullData, setShowFullData] = useState(false)

  // Demo: Show VCs for deal-003 (complete deal)
  const deal = getDealById('deal-003')
  const credentials = getCredentialsByDeal('deal-003')

  if (!deal) return null

  const vcCategories = [
    { type: 'ShariahApprovalCredential', label: 'Shariah Approval', icon: '🕌', color: 'purple' },
    { type: 'ShariahReviewCredential', label: 'Shariah Review', icon: '📋', color: 'blue' },
    { type: 'KYCComplianceCredential', label: 'KYC/CDD', icon: '👤', color: 'orange' },
    { type: 'SanctionsScreeningCredential', label: 'Sanctions', icon: '⚖️', color: 'red' },
    { type: 'FinancialReportingCredential', label: 'Financial Reporting', icon: '📊', color: 'green' },
    { type: 'InternalAuditCredential', label: 'Internal Audit', icon: '✓', color: 'teal' },
    { type: 'ShariahAuditCredential', label: 'Shariah Audit', icon: '🔍', color: 'indigo' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Trust Portal</h1>
            </div>
            <p className="text-green-100 max-w-2xl mb-4">
              Customer-facing compliance portal with blockchain-verified proofs.
              All credentials are cryptographically verifiable and selectively disclosed.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>{credentials.length} Verified Credentials</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="h-5 w-5" />
                <span>Hedera Mainnet</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Selective Disclosure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deal Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {deal.dealName}
            </h2>
            <p className="text-sm text-gray-500">
              {deal.dealId} • {deal.productType}
            </p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              100% Compliant
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {Object.entries(deal.compliance.buckets).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-green-600">{value}%</div>
              <div className="text-xs text-gray-500 capitalize">{key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Verifiable Credentials */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Verifiable Credentials ({credentials.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {credentials.map((vc, idx) => {
            const category = vcCategories.find(c => vc.type.includes(c.type))
            const isSelected = selectedVC === vc.proof.hederaTxId

            return (
              <div
                key={idx}
                onClick={() => setSelectedVC(isSelected ? null : vc.proof.hederaTxId!)}
                className={`
                  bg-white rounded-lg border-2 p-5 cursor-pointer transition-all
                  ${isSelected ? 'border-purple-300 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{category?.icon || '📄'}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {category?.label || 'Credential'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {vc.credentialSubject.controlId}
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-green-600">
                      {vc.credentialSubject.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Issued:</span>
                    <span>{new Date(vc.issuanceDate).toLocaleDateString()}</span>
                  </div>
                  {vc.proof.hederaTxId && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <a
                        href={`https://hashscan.io/mainnet/transaction/${vc.proof.hederaTxId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Hash className="h-3 w-3" />
                        <span className="font-mono truncate">{vc.proof.hederaTxId.split('@')[0]}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Expanded View */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Credential Data</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowFullData(!showFullData)
                        }}
                        className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900"
                      >
                        {showFullData ? (
                          <>
                            <EyeOff className="h-3 w-3" />
                            <span>Hide Sensitive</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3" />
                            <span>Show All</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs overflow-auto max-h-64">
                      <pre className="text-gray-700">
                        {JSON.stringify(
                          showFullData
                            ? vc.credentialSubject
                            : getSelectiveDisclosureView(vc, vc.selectiveDisclosure?.disclosures || []).credentialSubject,
                          null,
                          2
                        )}
                      </pre>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Lock className="h-3 w-3" />
                      <span>
                        {showFullData ? 'Full disclosure' : 'Minimal disclosure'} (customer view)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Proof-Constrained AI Chatbot */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            AI Compliance Assistant
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
            Proof-Constrained
          </span>
        </div>

        <div className="space-y-4 mb-4">
          {/* Sample Q&A */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3 mb-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Is this deal Shariah-compliant?
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-2">
                  Yes, this deal is 100% Shariah-compliant based on verified credentials:
                </p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <span>SSB Fatwa approved on {new Date(credentials[0].issuanceDate).toLocaleDateString()}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <span>Shariah Review completed - zero non-compliance events</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    <span>Independent Shariah Audit passed per AAOIFI GS-3</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-500 mt-2">
                  ℹ️ All claims verified via blockchain-anchored credentials
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Ask about compliance status..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="absolute right-2 top-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          💡 This AI only answers from verified credentials - no hallucinations, no speculation
        </p>
      </div>

      {/* Verification Instructions */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h4 className="font-semibold text-blue-900 mb-2">How to Verify Credentials</h4>
        <ol className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="font-medium">1.</span>
            <span>Click any credential above to view its Hedera transaction ID</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-medium">2.</span>
            <span>Visit HashScan to verify the credential was anchored on Hedera Mainnet</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-medium">3.</span>
            <span>Verify the issuer DID matches the expected issuer</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-medium">4.</span>
            <span>Check the cryptographic signature using W3C verification tools</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
