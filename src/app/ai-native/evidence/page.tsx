/**
 * SCREEN 4: EVIDENCE REPOSITORY
 * Evidence vault with agent collection badges and VC proofs
 */

'use client'

import { useState } from 'react'
import { FileText, CheckCircle2, Clock, AlertTriangle, XCircle, Bot, ExternalLink, Hash } from 'lucide-react'
import { mockEvidence, getEvidenceBySource, getEvidenceByType, getBlockchainEvidence } from '@/lib/mock-data/evidence'

export default function EvidencePage() {
  const [filter, setFilter] = useState<'all' | 'verified' | 'agent' | 'blockchain'>('all')

  const filteredEvidence = (() => {
    switch (filter) {
      case 'verified':
        return mockEvidence.filter(e => e.status === 'verified')
      case 'agent':
        return getEvidenceBySource('Agent')
      case 'blockchain':
        return getBlockchainEvidence()
      default:
        return mockEvidence
    }
  })()

  const stats = {
    total: mockEvidence.length,
    verified: mockEvidence.filter(e => e.status === 'verified').length,
    agentCollected: getEvidenceBySource('Agent').length,
    blockchain: getBlockchainEvidence().length
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'stale':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'missing':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blockchain_tx':
        return <Hash className="h-4 w-4 text-purple-600" />
      case 'api_response':
        return <ExternalLink className="h-4 w-4 text-blue-600" />
      case 'calculation':
        return <FileText className="h-4 w-4 text-orange-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Evidence Repository</h1>
        <p className="text-gray-600">
          Automated evidence collection across 5+ sources
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Total Evidence</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Verified</div>
          <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
        </div>
        <div className="bg-white rounded-lg border border-purple-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Agent-Collected</div>
          <div className="text-2xl font-bold text-purple-600">{stats.agentCollected}</div>
        </div>
        <div className="bg-white rounded-lg border border-blue-200 p-4">
          <div className="text-sm text-gray-500 mb-1">Blockchain VCs</div>
          <div className="text-2xl font-bold text-blue-600">{stats.blockchain}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 border-b border-gray-200">
        {(['all', 'verified', 'agent', 'blockchain'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              filter === f
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Evidence List */}
      <div className="grid gap-3">
        {filteredEvidence.map((evidence, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(evidence.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getTypeIcon(evidence.type)}
                    <h3 className="font-medium text-gray-900">{evidence.name}</h3>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                      {evidence.type.replace('_', ' ')}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {evidence.source}
                    </span>
                    {evidence.source === 'Agent' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        <Bot className="h-3 w-3 mr-1" />
                        Auto-collected
                      </span>
                    )}
                    {evidence.collectedAt && (
                      <span>{new Date(evidence.collectedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  {evidence.hash && (
                    <div className="mt-2 font-mono text-xs text-gray-500 truncate">
                      {evidence.hash}
                    </div>
                  )}
                </div>
              </div>
              {evidence.url && (
                <a
                  href={evidence.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors whitespace-nowrap flex items-center space-x-1"
                >
                  <span>View</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
