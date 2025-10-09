'use client'

/**
 * STEP 1: SOURCE CONNECTION
 * ==========================
 * Connect to Neo4j knowledge graph via graphiti-core and upload AAOIFI documents.
 *
 * WHAT THIS STEP DOES:
 * - Tests Neo4j connection via graphiti-core Python library (direct connection, not MCP)
 * - Uploads AAOIFI standard documents (PDF/DOCX)
 * - Ingests documents as Graphiti episodes (EpisodeType.text)
 * - Displays connection stats (nodes, edges, episodes)
 * - Natural language search via Graphiti
 *
 * WHY THIS IS FIRST:
 * - Knowledge graph is foundation for citations
 * - AAOIFI documents are the authoritative source
 * - Need to establish data connection before workflow
 *
 * USER EXPERIENCE:
 * - Click "Test Connection" button
 * - See Neo4j stats (nodes, edges, documents)
 * - Upload AAOIFI PDFs with drag-and-drop
 * - See progress as documents are parsed
 */

import { useState, useEffect } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Database,
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Trash2,
  Info,
  Search,
  ChevronDown,
  ChevronUp,
  Settings,
  AlertCircle
} from 'lucide-react'
import { testGraphitiConnection, ingestDocument, searchGraphiti, type GraphitiSearchResponse } from '@/lib/api'
import type { GraphitiStats, UploadedDocument } from '@/lib/types'
import { ServiceStatus } from '@/lib/service-types'
import { BackendServiceMonitor } from '@/components/workflow/BackendServiceMonitor'
import { ServiceDependencyBadge } from '@/components/workflow/ServiceDependencyBadge'

// Helper to get status icon
function getStatusIcon(status: ServiceStatus) {
  switch (status) {
    case ServiceStatus.CONNECTED:
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case ServiceStatus.DISCONNECTED:
      return <XCircle className="h-4 w-4 text-red-500" />
    case ServiceStatus.MOCK:
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    case ServiceStatus.CHECKING:
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />
  }
}

// Helper to get status badge
function getStatusBadge(status: ServiceStatus) {
  switch (status) {
    case ServiceStatus.CONNECTED:
      return <Badge className="bg-green-500 text-xs">Connected</Badge>
    case ServiceStatus.DISCONNECTED:
      return <Badge variant="destructive" className="text-xs">Disconnected</Badge>
    case ServiceStatus.MOCK:
      return <Badge className="bg-yellow-500 text-xs">Mock Mode</Badge>
    case ServiceStatus.CHECKING:
      return <Badge className="bg-blue-500 text-xs">Checking...</Badge>
    default:
      return <Badge variant="outline" className="text-xs">Unknown</Badge>
  }
}

export function Step1SourceConnection() {
  const execution = useWorkflowStore((state) => state.execution)
  const servicesStatus = useWorkflowStore((state) => state.servicesStatus)
  const setGraphitiConnected = useWorkflowStore((state) => state.setGraphitiConnected)
  const addDocument = useWorkflowStore((state) => state.addDocument)
  const removeDocument = useWorkflowStore((state) => state.removeDocument)
  const addError = useWorkflowStore((state) => state.addError)
  const setLoading = useWorkflowStore((state) => state.setLoading)

  const [graphitiStats, setGraphitiStats] = useState<GraphitiStats | null>(null)
  const [testingConnection, setTestingConnection] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GraphitiSearchResponse | null>(null)
  const [searching, setSearching] = useState(false)
  const [showServiceMonitor, setShowServiceMonitor] = useState(false)

  // Debug: Log searchResults changes
  useEffect(() => {
    console.log('🔄 searchResults state changed:', searchResults)
  }, [searchResults])

  // Test Graphiti connection
  const handleTestConnection = async () => {
    setTestingConnection(true)
    setLoading('graphitiConnection', true)

    try {
      const stats = await testGraphitiConnection()
      setGraphitiStats(stats)
      setGraphitiConnected(stats.connected)

      if (!stats.connected) {
        addError({
          id: `error_${Date.now()}`,
          timestamp: new Date().toISOString(),
          severity: 'error',
          title: 'Neo4j Connection Failed',
          message: 'Could not connect to Neo4j via graphiti-core. Check your backend configuration.',
          suggestion: 'Ensure the FastAPI backend is running and NEO4J_URI/NEO4J_USER/NEO4J_PASSWORD are correctly set.',
          dismissible: true,
        })
      }
    } catch (error: any) {
      addError({
        id: `error_${Date.now()}`,
        timestamp: new Date().toISOString(),
        severity: 'error',
        title: 'Connection Test Failed',
        message: error.message || 'Failed to test Graphiti connection',
        technicalDetails: error.stack,
        suggestion: 'Check that the backend API is running at http://localhost:8000',
        dismissible: true,
      })
    } finally {
      setTestingConnection(false)
      setLoading('graphitiConnection', false)
    }
  }

  // Handle file upload with progress tracking
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setLoading('documentUpload', true)

    for (const file of Array.from(files)) {
      // Add to uploading set
      setUploadingFiles((prev) => new Set(prev).add(file.name))

      try {
        // Upload → Parse → Ingest happens in single API call
        const uploadedDoc = await ingestDocument(file, 'aaoifi')

        // Verify ingestion was successful
        if (uploadedDoc.parsed && uploadedDoc.episode_id) {
          addDocument('aaoifi', uploadedDoc)
        } else {
          throw new Error('Document upload succeeded but ingestion failed')
        }
      } catch (error: any) {
        addError({
          id: `error_${Date.now()}`,
          timestamp: new Date().toISOString(),
          severity: 'error',
          title: `Failed to ingest ${file.name}`,
          message: error.message || 'Document ingestion failed',
          technicalDetails: error.stack,
          suggestion: 'Check backend logs for LlamaParse or Graphiti errors',
          dismissible: true,
        })
      } finally {
        // Remove from uploading set
        setUploadingFiles((prev) => {
          const newSet = new Set(prev)
          newSet.delete(file.name)
          return newSet
        })
      }
    }

    setLoading('documentUpload', false)
    // Clear file input
    event.target.value = ''
  }

  // Handle knowledge graph search (MCP-powered)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    console.log('🔍 Starting MCP search:', searchQuery)
    setSearching(true)
    try {
      console.log('📡 Calling searchGraphiti (MCP)...')
      const results = await searchGraphiti({
        query: searchQuery,
        num_results: 10,
      })
      console.log('✅ MCP search results received:', results)
      setSearchResults(results)
      console.log('✅ Search results state set')
    } catch (error: any) {
      console.error('❌ Search error:', error)
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
      console.log('🏁 Search complete, searching=false')
    }
  }

  return (
    <div className="space-y-6">
      {/* What's Happening Explainer */}
      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>What's Happening in Step 1</AlertTitle>
        <AlertDescription>
          This step connects to the Neo4j knowledge graph using graphiti-core (Python library) and ingests
          AAOIFI standard documents. These documents will be used as authoritative sources for
          citations and natural language search during workflow execution.
        </AlertDescription>
      </Alert>

      {/* Backend Services Required */}
      {servicesStatus && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Backend Services Required
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowServiceMonitor(true)}
                className="text-xs"
              >
                View All Services
              </Button>
            </div>
            <CardDescription className="text-xs">
              This step requires the following backend services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Graphiti Service */}
            <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(servicesStatus.graphiti.status)}
                <span className="text-sm font-medium">Graphiti / Neo4j</span>
              </div>
              {getStatusBadge(servicesStatus.graphiti.status)}
            </div>

            {/* MCP Proxy Service */}
            <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(servicesStatus.mcp.status)}
                <span className="text-sm font-medium">MCP Proxy</span>
              </div>
              {getStatusBadge(servicesStatus.mcp.status)}
            </div>

            {/* Documents Service */}
            <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(servicesStatus.documents.status)}
                <span className="text-sm font-medium">Document Service</span>
              </div>
              {getStatusBadge(servicesStatus.documents.status)}
            </div>

            {/* Help text */}
            <p className="text-xs text-muted-foreground pt-2">
              Services will fall back to mock mode if unavailable. Click "View All Services" for details.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Graphiti Connection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Neo4j / Graphiti Connection (Optional)
          </CardTitle>
          <CardDescription>
            Test connection to view knowledge graph stats. Skip if the Graphiti service badge above shows healthy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Required Services */}
          <ServiceDependencyBadge services={['graphiti']} inline={false} />

          <Button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="w-full"
          >
            {testingConnection ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Test Connection
              </>
            )}
          </Button>

          {/* Connection Status */}
          {graphitiStats && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {graphitiStats.connected ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-600">Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-destructive" />
                    <span className="font-medium text-destructive">Disconnected</span>
                  </>
                )}
              </div>

              {/* Stats */}
              {graphitiStats.connected && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-md">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Episodes</p>
                    <p className="text-2xl font-bold">{graphitiStats.totalEpisodes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Nodes</p>
                    <p className="text-2xl font-bold">{graphitiStats.totalNodes}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Edges</p>
                    <p className="text-2xl font-bold">{graphitiStats.totalEdges}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AAOIFI Documents</p>
                    <p className="text-2xl font-bold">{graphitiStats.aaaoifiDocumentsCount}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Natural Language Search (appears after successful connection) */}
      {graphitiStats && graphitiStats.connected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Explore Knowledge Graph
            </CardTitle>
            <CardDescription>
              Search the knowledge graph using natural language to see what information is available
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Required Services */}
            <ServiceDependencyBadge services={['mcp', 'graphiti']} inline={false} />

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

            {/* Search Results - MCP-Powered */}
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
                    {/* MCP Answer (when available) */}
                    {searchResults.answer && (
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <h5 className="text-sm font-semibold text-primary mb-2">
                          MCP Summary
                        </h5>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {searchResults.answer}
                        </div>
                      </div>
                    )}

                    {/* Facts from MCP */}
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
      )}

      {/* AAOIFI Document Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload AAOIFI Documents
          </CardTitle>
          <CardDescription>
            Upload AAOIFI standards (PDF/DOCX) to use as authoritative sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Required Services */}
          <ServiceDependencyBadge services={['documents', 'graphiti']} inline={false} />

          {/* File input */}
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".pdf,.docx"
              multiple
              onChange={handleFileUpload}
              disabled={uploadingFiles.size > 0}
            />
          </div>

          {/* Uploaded documents list */}
          {execution && execution.aaaoifiDocuments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Uploaded Documents</h4>
              <div className="space-y-2">
                {execution.aaaoifiDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.filename}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{(doc.filesize / 1024).toFixed(1)} KB</span>
                          {doc.episode_id && (
                            <span className="font-mono">• Episode: {doc.episode_id.slice(0, 8)}...</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.parsed && doc.episode_id ? (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ingested
                        </Badge>
                      ) : uploadingFiles.has(doc.filename) ? (
                        <Badge variant="secondary">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Processing...
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDocument('aaoifi', doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing status */}
          {uploadingFiles.size > 0 && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertTitle>Processing Documents</AlertTitle>
              <AlertDescription>
                {uploadingFiles.size === 1 ? (
                  <>Processing {Array.from(uploadingFiles)[0]}</>
                ) : (
                  <>Processing {uploadingFiles.size} files: Upload → LlamaParse → Graphiti ingestion</>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Backend Service Monitor Modal */}
      <BackendServiceMonitor
        isOpen={showServiceMonitor}
        onClose={() => setShowServiceMonitor(false)}
      />
    </div>
  )
}
 
