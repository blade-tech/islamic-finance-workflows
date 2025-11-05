/**
 * SERVICE TYPES
 * =============
 * TypeScript types for backend service discovery and monitoring.
 *
 * WHAT THIS DEFINES:
 * - Service status enums (connected/disconnected/mock)
 * - Service configuration interfaces
 * - Health check response types
 * - Mock data structures
 *
 * WHY SEPARATE FILE:
 * - Shared across backend-client, store, and UI components
 * - Type safety for service discovery
 * - Clear contract with backend
 */

// ============================================================================
// SERVICE STATUS ENUMS
// ============================================================================

/**
 * Connection status for a backend service
 */
export enum ServiceStatus {
  CONNECTED = 'connected',      // Service is available and responding
  DISCONNECTED = 'disconnected', // Service is not available
  MOCK = 'mock',                 // Using mock data (service unavailable)
  CHECKING = 'checking',         // Currently checking service status
}

/**
 * Individual MCP server status within the MCP Proxy service
 */
export enum MCPServerStatus {
  AVAILABLE = 'available',       // MCP server is configured and working
  NOT_CONFIGURED = 'not_configured', // MCP server exists but not configured
  ERROR = 'error',               // MCP server has errors
}

// ============================================================================
// SERVICE IDENTIFIERS
// ============================================================================

/**
 * Unique identifiers for each backend service
 */
export type ServiceName =
  | 'mcp'              // MCP Proxy Service (includes Copilots for Claude)
  | 'orchestrator'     // LangGraph Orchestrator
  | 'graphiti'         // Graphiti/Neo4j Service
  | 'documents'        // Document Service (includes LlamaParse for PDF parsing)
  | 'observability'    // LangFuse Observability

/**
 * MCP server identifiers within the MCP Proxy
 */
export type MCPServerName =
  | 'graphiti'
  | 'copilots'
  | 'exa'
  | 'hedera'

// ============================================================================
// SERVICE CONFIGURATION
// ============================================================================

/**
 * Individual service status with metadata
 */
export interface ServiceInfo {
  name: ServiceName
  displayName: string
  description: string
  status: ServiceStatus
  endpoints?: string[]          // Available endpoints for this service
  requiredFor?: string[]        // Which workflow steps need this service
  lastChecked?: Date
  error?: string
}

/**
 * MCP server status within MCP Proxy
 */
export interface MCPServerInfo {
  name: MCPServerName
  displayName: string
  status: MCPServerStatus
  tools?: string[]              // Available tools from this MCP server
  error?: string
}

/**
 * MCP Proxy service with nested MCP server status
 */
export interface MCPProxyInfo extends ServiceInfo {
  name: 'mcp'
  servers: MCPServerInfo[]
}

/**
 * Complete service status for all backend services
 */
export interface BackendServicesStatus {
  mcp: MCPProxyInfo
  orchestrator: ServiceInfo
  graphiti: ServiceInfo
  documents: ServiceInfo
  observability: ServiceInfo
  backendUrl: string
  lastGlobalCheck?: Date
}

// ============================================================================
// HEALTH CHECK RESPONSES
// ============================================================================

/**
 * Response from /health endpoint
 */
export interface HealthResponse {
  status: 'ok' | 'error'
  services: ServiceName[]       // List of available services
  version?: string
  timestamp?: string
}

/**
 * Response from /api/config endpoint
 */
export interface ConfigResponse {
  services: ServiceName[]       // Available services
  mcp_servers?: MCPServerName[] // Configured MCP servers
  features?: string[]           // Additional features (langgraph, langfuse, etc.)
}

// ============================================================================
// SERVICE-SPECIFIC TYPES
// ============================================================================

/**
 * MCP Tool definition
 */
export interface MCPTool {
  name: string
  description?: string
  inputSchema?: any
}

/**
 * Graphiti search filters
 */
export interface GraphitiSearchFilters {
  group_ids?: string[]
  center_node_uuid?: string
  num_results?: number
  min_score?: number
}

/**
 * Graphiti search result
 */
export interface GraphitiFact {
  fact: string
  relevance: number
  type?: string
  temporal?: {
    created: string
    valid_from?: string
    valid_until?: string
  }
}

/**
 * Graphiti search response
 */
export interface GraphitiSearchResponse {
  status: 'success' | 'error'
  query: string
  answer?: string
  facts: GraphitiFact[]
  context?: {
    total_facts: number
    confidence: 'low' | 'medium' | 'high'
  }
  isMock?: boolean
}

/**
 * LangGraph session response
 */
export interface SessionResponse {
  session_id: string
  created_at: string
  status: 'active' | 'completed' | 'interrupted'
}

/**
 * LangFuse trace
 */
export interface LangFuseTrace {
  id: string
  name: string
  timestamp: string
  input?: any
  output?: any
  metadata?: Record<string, any>
}

// ============================================================================
// MOCK DATA STRUCTURES
// ============================================================================

/**
 * Mock service providers - used when backend services are unavailable
 */
export interface MockDataProviders {
  graphitiSearch: (query: string) => GraphitiSearchResponse
  orchestratorStream: (onChunk: (chunk: string) => void) => () => void
  businessOutcomes: () => any[]
  traces: (sessionId: string) => LangFuseTrace[]
}

// ============================================================================
// EVENT TYPES
// ============================================================================

/**
 * Events emitted by backend client
 */
export type BackendClientEvent =
  | 'status-change'    // Service status changed
  | 'health-check'     // Health check completed
  | 'error'            // Error occurred

/**
 * Event callback signature
 */
export type EventCallback = (data: any) => void

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Backend client configuration
 */
export interface BackendClientConfig {
  baseUrl: string
  timeout?: number              // Request timeout in ms
  enableMockMode?: boolean      // Enable fallback to mock data
  autoRefreshInterval?: number  // Auto health check interval in ms
}

/**
 * Service endpoint paths
 */
export const SERVICE_ENDPOINTS = {
  HEALTH: '/health',
  CONFIG: '/api/config',
  MCP_SERVERS: '/mcp/servers',
  MCP_TOOLS: (server: string) => `/mcp/${server}/tools`,
  MCP_CALL: (server: string, tool: string) => `/mcp/${server}/tools/${tool}`,
  ORCHESTRATOR_SESSION: '/orchestrator/sessions',
  ORCHESTRATOR_STREAM: (id: string) => `/orchestrator/sessions/${id}/stream`,
  ORCHESTRATOR_INTERRUPT: (id: string) => `/orchestrator/sessions/${id}/interrupt`,
  GRAPHITI_SEARCH: '/graphiti/search',
  GRAPHITI_QUERY: '/graphiti/query',
  GRAPHITI_BUSINESS_OUTCOMES: '/graphiti/business-outcomes',
  GRAPHITI_INGEST: '/graphiti/documents/ingest',
  DOCUMENTS_READ: '/documents/read',
  DOCUMENTS_WRITE: '/documents/write',
  OBSERVABILITY_TRACES: (sessionId: string) => `/observability/traces/${sessionId}`,
  OBSERVABILITY_METRICS: '/observability/metrics',
  DASHBOARD_OVERVIEW: '/api/dashboard/overview',
  DASHBOARD_COMPONENT: (componentType: string) => `/api/dashboard/components/${componentType}`,
  DASHBOARD_DEALS: '/api/dashboard/deals',
  DASHBOARD_DEAL: (dealId: string) => `/api/dashboard/deals/${dealId}`,
  DASHBOARD_MONITORING: (cardType: string) => `/api/dashboard/monitoring/${cardType}`,
  // Deal lifecycle management endpoints
  DEALS_BASE: '/api/deals',
  DEALS_BY_ID: (dealId: string) => `/api/deals/${dealId}`,
  DEALS_STATS: '/api/deals/stats/summary',
} as const

/**
 * Default service information
 */
export const DEFAULT_SERVICES: Record<ServiceName, Omit<ServiceInfo, 'status' | 'lastChecked'>> = {
  mcp: {
    name: 'mcp',
    displayName: 'MCP Proxy',
    description: 'Routes to MCP servers (Graphiti, Copilots/Claude, Exa, Hedera)',
    endpoints: [
      'GET /mcp/servers',
      'GET /mcp/{server}/tools',
      'POST /mcp/{server}/tools/{tool_name}',
      'POST /mcp/copilots/tools/ask-pe',
    ],
    requiredFor: [
      'Step 1: Source Connection',
      'Step 5: Live Execution',
      'Methodology Upload: AI Analysis & Generation',
    ],
  },
  orchestrator: {
    name: 'orchestrator',
    displayName: 'LangGraph Orchestrator',
    description: 'Multi-turn AI conversations with human interrupts',
    endpoints: [
      'POST /orchestrator/sessions',
      'GET /orchestrator/sessions/{id}/stream',
      'POST /orchestrator/sessions/{id}/interrupt',
    ],
    requiredFor: ['Step 5: Live Execution'],
  },
  graphiti: {
    name: 'graphiti',
    displayName: 'Graphiti/Neo4j',
    description: 'Enhanced search, GDS projections, Pydantic models',
    endpoints: [
      'POST /graphiti/search',
      'GET /graphiti/business-outcomes',
      'POST /graphiti/query',
      'POST /graphiti/documents/ingest',
    ],
    requiredFor: ['Step 1: Source Connection', 'Step 5: Live Execution'],
  },
  documents: {
    name: 'documents',
    displayName: 'Document Service',
    description: 'Read/write PDF, DOCX, Markdown; LlamaParse integration',
    endpoints: [
      'POST /documents/read',
      'POST /documents/write',
      'POST /documents/parse',
    ],
    requiredFor: [
      'Step 3: Context Upload',
      'Step 6: Outcome & Download',
      'Methodology Upload: Document Parsing',
    ],
  },
  observability: {
    name: 'observability',
    displayName: 'LangFuse Observability',
    description: 'Execution traces and performance metrics',
    endpoints: [
      'GET /observability/traces/{session_id}',
      'GET /observability/metrics',
    ],
    requiredFor: ['Step 5: Live Execution', 'Step 8: Learning Capture'],
  },
}

/**
 * Default MCP server information
 */
export const DEFAULT_MCP_SERVERS: Record<MCPServerName, Omit<MCPServerInfo, 'status'>> = {
  graphiti: {
    name: 'graphiti',
    displayName: 'Graphiti MCP',
  },
  copilots: {
    name: 'copilots',
    displayName: 'Copilots MCP',
  },
  exa: {
    name: 'exa',
    displayName: 'Exa MCP',
  },
  hedera: {
    name: 'hedera',
    displayName: 'Hedera MCP',
  },
}
