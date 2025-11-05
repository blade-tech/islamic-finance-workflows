/**
 * BACKEND SERVICE CLIENT
 * ======================
 * Singleton client for discovering and communicating with backend services.
 *
 * WHAT THIS DOES:
 * - Service discovery on initialization
 * - Health checking for each service
 * - API methods for all backend services
 * - Mock mode fallback when services unavailable
 * - Event emission for status changes
 *
 * WHY SINGLETON:
 * - One shared connection pool
 * - Consistent service status across app
 * - Centralized error handling
 *
 * USAGE:
 * ```typescript
 * import { backendClient } from '@/lib/backend-client'
 *
 * await backendClient.init()
 * const results = await backendClient.searchGraphiti('my query')
 * ```
 */

import type {
  ServiceName,
  ServiceStatus,
  ServiceInfo,
  MCPServerInfo,
  MCPServerStatus,
  BackendServicesStatus,
  HealthResponse,
  ConfigResponse,
  GraphitiSearchResponse,
  GraphitiSearchFilters,
  MCPTool,
  SessionResponse,
  LangFuseTrace,
  BackendClientConfig,
  BackendClientEvent,
  EventCallback,
} from './service-types'

import {
  DEFAULT_SERVICES,
  DEFAULT_MCP_SERVERS,
  SERVICE_ENDPOINTS,
  ServiceStatus as ServiceStatusEnum,
  MCPServerStatus as MCPServerStatusEnum,
} from './service-types'

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: BackendClientConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 1000, // Reduced to 1 second for faster service discovery
  enableMockMode: true,
  autoRefreshInterval: 30000, // 30 seconds
}

// ============================================================================
// BACKEND CLIENT CLASS
// ============================================================================

class BackendClient {
  private config: BackendClientConfig
  private servicesStatus: BackendServicesStatus
  private eventListeners: Map<BackendClientEvent, Set<EventCallback>>
  private refreshInterval?: NodeJS.Timeout

  constructor(config?: Partial<BackendClientConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.eventListeners = new Map()

    // Initialize with default disconnected status
    this.servicesStatus = {
      mcp: {
        ...DEFAULT_SERVICES.mcp,
        status: ServiceStatusEnum.DISCONNECTED,
        servers: Object.values(DEFAULT_MCP_SERVERS).map((server) => ({
          ...server,
          status: MCPServerStatusEnum.NOT_CONFIGURED,
        })),
      } as any,
      orchestrator: {
        ...DEFAULT_SERVICES.orchestrator,
        status: ServiceStatusEnum.DISCONNECTED,
      },
      graphiti: {
        ...DEFAULT_SERVICES.graphiti,
        status: ServiceStatusEnum.DISCONNECTED,
      },
      documents: {
        ...DEFAULT_SERVICES.documents,
        status: ServiceStatusEnum.DISCONNECTED,
      },
      observability: {
        ...DEFAULT_SERVICES.observability,
        status: ServiceStatusEnum.DISCONNECTED,
      },
      backendUrl: this.config.baseUrl,
    }
  }

  // ==========================================================================
  // INITIALIZATION & HEALTH
  // ==========================================================================

  /**
   * Initialize backend client and discover available services
   */
  async init(): Promise<void> {
    console.log('[BackendClient] Initializing...', this.config.baseUrl)
    await this.checkHealth()

    // Start auto-refresh if enabled
    if (this.config.autoRefreshInterval) {
      this.startAutoRefresh()
    }
  }

  /**
   * Check health of all backend services
   */
  async checkHealth(): Promise<BackendServicesStatus> {
    try {
      // Check /health endpoint
      const healthResponse = await this.fetchWithTimeout<HealthResponse>(
        SERVICE_ENDPOINTS.HEALTH
      )

      // Check /api/config endpoint
      const configResponse = await this.fetchWithTimeout<ConfigResponse>(
        SERVICE_ENDPOINTS.CONFIG
      )

      // Update service status based on responses
      this.updateServicesFromHealth(healthResponse, configResponse)

      // Test each service endpoint (non-blocking - will update status individually)
      // Using allSettled to not fail if some services are unavailable
      await Promise.allSettled([
        this.testMCPProxy(),
        this.testOrchestrator(),
        this.testGraphiti(),
        this.testDocuments(),
        this.testObservability(),
      ])

      this.servicesStatus.lastGlobalCheck = new Date()
      this.emit('health-check', this.servicesStatus)

      return this.servicesStatus
    } catch (error) {
      console.warn('[BackendClient] Health check failed, using mock mode:', error)

      // Set all services to disconnected (mock mode will be used)
      this.setAllServicesDisconnected()

      this.servicesStatus.lastGlobalCheck = new Date()
      this.emit('health-check', this.servicesStatus)

      return this.servicesStatus
    }
  }

  /**
   * Get current status of a specific service
   */
  getServiceStatus(serviceName: ServiceName): ServiceStatus {
    return this.servicesStatus[serviceName].status
  }

  /**
   * Get complete service status
   */
  getAllServicesStatus(): BackendServicesStatus {
    return this.servicesStatus
  }

  // ==========================================================================
  // MCP PROXY METHODS
  // ==========================================================================

  /**
   * List available MCP servers
   */
  async listMCPServers(): Promise<string[]> {
    if (this.getServiceStatus('mcp') !== ServiceStatusEnum.CONNECTED) {
      return this.mockMCPServers()
    }

    try {
      const response = await this.fetchWithTimeout<{ servers: string[] }>(
        SERVICE_ENDPOINTS.MCP_SERVERS
      )
      return response.servers
    } catch (error) {
      console.warn('[BackendClient] MCP list servers failed:', error)
      return this.mockMCPServers()
    }
  }

  /**
   * List tools for a specific MCP server
   */
  async listMCPTools(server: string): Promise<MCPTool[]> {
    if (this.getServiceStatus('mcp') !== ServiceStatusEnum.CONNECTED) {
      return this.mockMCPTools(server)
    }

    try {
      const response = await this.fetchWithTimeout<{ tools: MCPTool[] }>(
        SERVICE_ENDPOINTS.MCP_TOOLS(server)
      )
      return response.tools
    } catch (error) {
      console.warn(`[BackendClient] MCP list tools failed for ${server}:`, error)
      return this.mockMCPTools(server)
    }
  }

  /**
   * Call an MCP tool
   */
  async callMCPTool(server: string, tool: string, args: any): Promise<any> {
    if (this.getServiceStatus('mcp') !== ServiceStatusEnum.CONNECTED) {
      throw new Error(`MCP Proxy service not available. Using mock mode.`)
    }

    try {
      const response = await this.fetchWithTimeout(
        SERVICE_ENDPOINTS.MCP_CALL(server, tool),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args),
        }
      )
      return response
    } catch (error) {
      console.error(`[BackendClient] MCP tool call failed (${server}/${tool}):`, error)
      throw error
    }
  }

  // ==========================================================================
  // GRAPHITI METHODS
  // ==========================================================================

  /**
   * Search Graphiti knowledge graph
   */
  async searchGraphiti(
    query: string,
    filters?: GraphitiSearchFilters
  ): Promise<GraphitiSearchResponse> {
    if (this.getServiceStatus('graphiti') !== ServiceStatusEnum.CONNECTED) {
      return this.mockGraphitiSearch(query)
    }

    try {
      const response = await this.fetchWithTimeout<GraphitiSearchResponse>(
        SERVICE_ENDPOINTS.GRAPHITI_SEARCH,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, ...filters }),
        }
      )
      return { ...response, isMock: false }
    } catch (error) {
      console.warn('[BackendClient] Graphiti search failed:', error)
      return this.mockGraphitiSearch(query)
    }
  }

  /**
   * Run custom Cypher query
   */
  async runCypher(query: string, params?: any): Promise<any> {
    if (this.getServiceStatus('graphiti') !== ServiceStatusEnum.CONNECTED) {
      throw new Error('Graphiti service not available')
    }

    const response = await this.fetchWithTimeout(SERVICE_ENDPOINTS.GRAPHITI_QUERY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, params }),
    })
    return response
  }

  /**
   * Get business outcomes (Pydantic models)
   */
  async getBusinessOutcomes(filters?: any): Promise<any[]> {
    if (this.getServiceStatus('graphiti') !== ServiceStatusEnum.CONNECTED) {
      return this.mockBusinessOutcomes()
    }

    try {
      const response = await this.fetchWithTimeout<{ outcomes: any[] }>(
        SERVICE_ENDPOINTS.GRAPHITI_BUSINESS_OUTCOMES
      )
      return response.outcomes
    } catch (error) {
      console.warn('[BackendClient] Business outcomes failed:', error)
      return this.mockBusinessOutcomes()
    }
  }

  // ==========================================================================
  // LANGGRAPH ORCHESTRATOR METHODS
  // ==========================================================================

  /**
   * Create a new orchestrator session
   */
  async createSession(message: string): Promise<string> {
    if (this.getServiceStatus('orchestrator') !== ServiceStatusEnum.CONNECTED) {
      return this.mockCreateSession()
    }

    try {
      const response = await this.fetchWithTimeout<SessionResponse>(
        SERVICE_ENDPOINTS.ORCHESTRATOR_SESSION,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        }
      )
      return response.session_id
    } catch (error) {
      console.warn('[BackendClient] Create session failed:', error)
      return this.mockCreateSession()
    }
  }

  /**
   * Stream session execution (SSE)
   * Returns an EventSource that can be listened to
   */
  createSessionStream(sessionId: string): EventSource | null {
    if (this.getServiceStatus('orchestrator') !== ServiceStatusEnum.CONNECTED) {
      console.warn('[BackendClient] Orchestrator not available, cannot stream')
      return null
    }

    const url = `${this.config.baseUrl}${SERVICE_ENDPOINTS.ORCHESTRATOR_STREAM(sessionId)}`
    return new EventSource(url)
  }

  /**
   * Interrupt a running session
   */
  async interruptSession(sessionId: string, message: string): Promise<void> {
    if (this.getServiceStatus('orchestrator') !== ServiceStatusEnum.CONNECTED) {
      throw new Error('Orchestrator service not available')
    }

    await this.fetchWithTimeout(SERVICE_ENDPOINTS.ORCHESTRATOR_INTERRUPT(sessionId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
  }

  // ==========================================================================
  // DASHBOARD METHODS
  // ==========================================================================

  /**
   * Get complete dashboard overview with all 4 component compliances
   */
  async getDashboardOverview(): Promise<any> {
    if (this.getServiceStatus('documents') === ServiceStatusEnum.DISCONNECTED) {
      return this.mockDashboardOverview()
    }

    try {
      const response = await this.fetchWithTimeout(
        SERVICE_ENDPOINTS.DASHBOARD_OVERVIEW
      )
      return response
    } catch (error) {
      console.warn('[BackendClient] Dashboard overview failed:', error)
      return this.mockDashboardOverview()
    }
  }

  /**
   * Get detailed compliance for a specific component type
   */
  async getComponentCompliance(componentType: string): Promise<any> {
    if (this.getServiceStatus('documents') === ServiceStatusEnum.DISCONNECTED) {
      return this.mockComponentCompliance(componentType)
    }

    try {
      const response = await this.fetchWithTimeout(
        SERVICE_ENDPOINTS.DASHBOARD_COMPONENT(componentType)
      )
      return response
    } catch (error) {
      console.warn(`[BackendClient] Component compliance failed for ${componentType}:`, error)
      return this.mockComponentCompliance(componentType)
    }
  }

  /**
   * Get all deals, optionally filtered by component
   */
  async getAllDeals(filters?: { component_type?: string; component_id?: string }): Promise<any[]> {
    if (this.getServiceStatus('documents') === ServiceStatusEnum.DISCONNECTED) {
      return this.mockAllDeals(filters)
    }

    try {
      const queryParams = new URLSearchParams()
      if (filters?.component_type) {
        queryParams.append('component_type', filters.component_type)
      }
      if (filters?.component_id) {
        queryParams.append('component_id', filters.component_id)
      }

      const endpoint = queryParams.toString()
        ? `${SERVICE_ENDPOINTS.DASHBOARD_DEALS}?${queryParams}`
        : SERVICE_ENDPOINTS.DASHBOARD_DEALS

      const response = await this.fetchWithTimeout<any[]>(endpoint)
      return response
    } catch (error) {
      console.warn('[BackendClient] Get all deals failed:', error)
      return this.mockAllDeals(filters)
    }
  }

  /**
   * Get full compliance breakdown for a specific deal
   */
  async getDealCompliance(dealId: string): Promise<any | null> {
    if (this.getServiceStatus('documents') === ServiceStatusEnum.DISCONNECTED) {
      return this.mockDealCompliance(dealId)
    }

    try {
      const response = await this.fetchWithTimeout(
        SERVICE_ENDPOINTS.DASHBOARD_DEAL(dealId)
      )
      return response
    } catch (error) {
      console.warn(`[BackendClient] Deal compliance failed for ${dealId}:`, error)
      return this.mockDealCompliance(dealId)
    }
  }

  /**
   * Get detailed breakdown for a monitoring card
   */
  async getMonitoringCardDetails(cardType: string): Promise<any> {
    if (this.getServiceStatus('documents') === ServiceStatusEnum.DISCONNECTED) {
      return this.mockMonitoringCardDetails(cardType)
    }

    try {
      const response = await this.fetchWithTimeout(
        SERVICE_ENDPOINTS.DASHBOARD_MONITORING(cardType)
      )
      return response
    } catch (error) {
      console.warn(`[BackendClient] Monitoring card failed for ${cardType}:`, error)
      return this.mockMonitoringCardDetails(cardType)
    }
  }

  // ==========================================================================
  // DEAL LIFECYCLE METHODS
  // ==========================================================================

  /**
   * Create a new deal from workflow completion
   */
  async createDeal(dealData: any): Promise<any> {
    if (this.getServiceStatus('documents') === ServiceStatusEnum.DISCONNECTED) {
      return this.mockCreateDeal(dealData)
    }

    try {
      const response = await this.fetchWithTimeout(
        SERVICE_ENDPOINTS.DEALS_BASE,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dealData),
        }
      )
      return response
    } catch (error) {
      console.warn('[BackendClient] Create deal failed:', error)
      return this.mockCreateDeal(dealData)
    }
  }

  /**
   * Get all deals with optional filtering
   */
  async getDeals(filters?: { status?: string; limit?: number }): Promise<any[]> {
    if (this.getServiceStatus('documents') === ServiceStatusEnum.DISCONNECTED) {
      return this.mockGetDeals(filters)
    }

    try {
      const queryParams = new URLSearchParams()
      if (filters?.status) {
        queryParams.append('status', filters.status)
      }
      if (filters?.limit) {
        queryParams.append('limit', filters.limit.toString())
      }

      const endpoint = queryParams.toString()
        ? `${SERVICE_ENDPOINTS.DEALS_BASE}?${queryParams}`
        : SERVICE_ENDPOINTS.DEALS_BASE

      const response = await this.fetchWithTimeout<any[]>(endpoint)
      return response
    } catch (error) {
      console.warn('[BackendClient] Get deals failed:', error)
      return this.mockGetDeals(filters)
    }
  }

  /**
   * Get a specific deal by ID
   */
  async getDeal(dealId: string): Promise<any | null> {
    if (this.getServiceStatus('documents') === ServiceStatusEnum.DISCONNECTED) {
      return this.mockGetDeal(dealId)
    }

    try {
      const response = await this.fetchWithTimeout(
        SERVICE_ENDPOINTS.DEALS_BY_ID(dealId)
      )
      return response
    } catch (error) {
      console.warn(`[BackendClient] Get deal failed for ${dealId}:`, error)
      return this.mockGetDeal(dealId)
    }
  }

  /**
   * Update a deal's fields
   */
  async updateDeal(dealId: string, updates: any): Promise<any | null> {
    if (this.getServiceStatus('documents') === ServiceStatusEnum.DISCONNECTED) {
      throw new Error('Cannot update deals in mock mode')
    }

    try {
      const response = await this.fetchWithTimeout(
        SERVICE_ENDPOINTS.DEALS_BY_ID(dealId),
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        }
      )
      return response
    } catch (error) {
      console.error(`[BackendClient] Update deal failed for ${dealId}:`, error)
      throw error
    }
  }

  /**
   * Delete a deal
   */
  async deleteDeal(dealId: string): Promise<void> {
    if (this.getServiceStatus('documents') === ServiceStatusEnum.DISCONNECTED) {
      throw new Error('Cannot delete deals in mock mode')
    }

    try {
      await this.fetchWithTimeout(
        SERVICE_ENDPOINTS.DEALS_BY_ID(dealId),
        {
          method: 'DELETE',
        }
      )
    } catch (error) {
      console.error(`[BackendClient] Delete deal failed for ${dealId}:`, error)
      throw error
    }
  }

  /**
   * Get deal statistics
   */
  async getDealStats(): Promise<any> {
    if (this.getServiceStatus('documents') === ServiceStatusEnum.DISCONNECTED) {
      return this.mockGetDealStats()
    }

    try {
      const response = await this.fetchWithTimeout(SERVICE_ENDPOINTS.DEALS_STATS)
      return response
    } catch (error) {
      console.warn('[BackendClient] Get deal stats failed:', error)
      return this.mockGetDealStats()
    }
  }

  // ==========================================================================
  // GENERIC API METHOD
  // ==========================================================================

  /**
   * Generic API method for endpoints not covered by specific methods
   * Used primarily by collaboration features
   */
  async api<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    // For frontend-only deployment, throw error since these endpoints don't exist
    throw new Error(`Generic API not available in frontend-only mode: ${endpoint}`)
  }

  // ==========================================================================
  // PRIVATE: SERVICE TESTING
  // ==========================================================================

  private async testMCPProxy(): Promise<void> {
    try {
      await this.fetchWithTimeout(SERVICE_ENDPOINTS.MCP_SERVERS, { method: 'GET' })
      this.updateServiceStatus('mcp', ServiceStatusEnum.CONNECTED)
    } catch (error) {
      this.updateServiceStatus('mcp', ServiceStatusEnum.DISCONNECTED)
    }
  }

  private async testOrchestrator(): Promise<void> {
    // We can't easily test session creation without side effects
    // Just check if the service is listed in health
    const status = this.servicesStatus.orchestrator.status
    if (status === ServiceStatusEnum.CHECKING) {
      this.updateServiceStatus('orchestrator', ServiceStatusEnum.CONNECTED)
    }
  }

  private async testGraphiti(): Promise<void> {
    try {
      // Test with a simple search
      await this.fetchWithTimeout(SERVICE_ENDPOINTS.GRAPHITI_SEARCH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'test', num_results: 1 }),
      })
      this.updateServiceStatus('graphiti', ServiceStatusEnum.CONNECTED)
    } catch (error) {
      this.updateServiceStatus('graphiti', ServiceStatusEnum.DISCONNECTED)
    }
  }

  private async testDocuments(): Promise<void> {
    // Documents service might not have a simple test endpoint
    // Mark as connected if listed in health, otherwise disconnected
    const status = this.servicesStatus.documents.status
    if (status === ServiceStatusEnum.CHECKING) {
      this.updateServiceStatus('documents', ServiceStatusEnum.CONNECTED)
    }
  }

  private async testObservability(): Promise<void> {
    // Similar to documents - check if listed in health
    const status = this.servicesStatus.observability.status
    if (status === ServiceStatusEnum.CHECKING) {
      this.updateServiceStatus('observability', ServiceStatusEnum.CONNECTED)
    }
  }

  // ==========================================================================
  // PRIVATE: UTILITIES
  // ==========================================================================

  private async fetchWithTimeout<T = any>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const url = endpoint.startsWith('http')
        ? endpoint
        : `${this.config.baseUrl}${endpoint}`

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } finally {
      clearTimeout(timeout)
    }
  }

  private updateServicesFromHealth(
    health: HealthResponse,
    config: ConfigResponse
  ): void {
    // Mark services as checking first
    const serviceNames: ServiceName[] = ['mcp', 'orchestrator', 'graphiti', 'documents', 'observability']

    serviceNames.forEach((name) => {
      if (health.services.includes(name) || config.services.includes(name)) {
        this.updateServiceStatus(name, ServiceStatusEnum.CHECKING)
      } else {
        this.updateServiceStatus(name, ServiceStatusEnum.DISCONNECTED)
      }
    })

    // Update MCP servers if available
    if (config.mcp_servers && this.servicesStatus.mcp.servers) {
      this.servicesStatus.mcp.servers.forEach((server) => {
        if (config.mcp_servers!.includes(server.name)) {
          server.status = MCPServerStatusEnum.AVAILABLE
        }
      })
    }
  }

  private setAllServicesDisconnected(): void {
    const serviceNames: ServiceName[] = ['mcp', 'orchestrator', 'graphiti', 'documents', 'observability']
    serviceNames.forEach((name) => {
      this.updateServiceStatus(name, ServiceStatusEnum.DISCONNECTED)
    })
  }

  private updateServiceStatus(name: ServiceName, status: ServiceStatus): void {
    const service = this.servicesStatus[name]
    const oldStatus = service.status

    service.status = status
    service.lastChecked = new Date()

    // Emit event if status changed
    if (oldStatus !== status) {
      this.emit('status-change', { service: name, oldStatus, newStatus: status })
    }
  }

  private startAutoRefresh(): void {
    this.refreshInterval = setInterval(() => {
      this.checkHealth()
    }, this.config.autoRefreshInterval)
  }

  public stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  }

  // ==========================================================================
  // MOCK DATA PROVIDERS
  // ==========================================================================

  private mockMCPServers(): string[] {
    return ['graphiti', 'copilots']
  }

  private mockMCPTools(server: string): MCPTool[] {
    if (server === 'graphiti') {
      return [
        { name: 'search', description: 'Search knowledge graph' },
        { name: 'add_episode', description: 'Add content to graph' },
      ]
    }
    return []
  }

  private mockGraphitiSearch(query: string): GraphitiSearchResponse {
    return {
      status: 'success',
      query,
      answer: `This is mock data for query: "${query}"`,
      facts: [
        {
          fact: 'Murabaha is a cost-plus financing structure compliant with Shariah principles',
          relevance: 0.9,
          type: 'definition',
        },
        {
          fact: 'AAOIFI FAS 2 governs accounting standards for Murabaha transactions',
          relevance: 0.85,
          type: 'standard',
        },
      ],
      context: {
        total_facts: 2,
        confidence: 'medium',
      },
      isMock: true,
    }
  }

  private mockBusinessOutcomes(): any[] {
    return [
      {
        id: 'mock-1',
        name: 'Sukuk Issuance Process',
        status: 'draft',
        type: 'workflow',
      },
    ]
  }

  private mockCreateSession(): string {
    return `mock-session-${Date.now()}`
  }

  private mockDashboardOverview(): any {
    return {
      shariah_compliance: {
        component_type: 'shariah_structure',
        component_id: 'aggregated',
        component_name: 'All Shariah Structures',
        total_requirements: 37,
        completed_requirements: 30,
        evidence_count: 19,
        required_evidence_count: 25,
        control_completion: 81.1,
        evidence_completion: 76.0,
        overall_completion: 80.2,
        status: 'in_progress',
        needs_attention_count: 4,
        last_updated: new Date().toISOString(),
      },
      jurisdiction_compliance: {
        component_type: 'jurisdiction',
        component_id: 'aggregated',
        component_name: 'All Jurisdictions',
        total_requirements: 55,
        completed_requirements: 48,
        evidence_count: 25,
        required_evidence_count: 29,
        control_completion: 87.3,
        evidence_completion: 86.2,
        overall_completion: 85.0,
        status: 'in_progress',
        needs_attention_count: 3,
        last_updated: new Date().toISOString(),
      },
      accounting_compliance: {
        component_type: 'accounting',
        component_id: 'aggregated',
        component_name: 'All Accounting Frameworks',
        total_requirements: 77,
        completed_requirements: 66,
        evidence_count: 29,
        required_evidence_count: 35,
        control_completion: 85.7,
        evidence_completion: 82.9,
        overall_completion: 84.0,
        status: 'in_progress',
        needs_attention_count: 6,
        last_updated: new Date().toISOString(),
      },
      impact_compliance: {
        component_type: 'impact',
        component_id: 'aggregated',
        component_name: 'All Impact Frameworks',
        total_requirements: 18,
        completed_requirements: 14,
        evidence_count: 13,
        required_evidence_count: 16,
        control_completion: 77.8,
        evidence_completion: 81.3,
        overall_completion: 78.1,
        status: 'in_progress',
        needs_attention_count: 2,
        last_updated: new Date().toISOString(),
      },
      contracts_card: {
        title: 'Contracts',
        total_count: 15,
        needs_attention_count: 3,
        status: 'in_progress',
        breakdown_by_component: {
          sukuk_ijara: 8,
          sukuk_murabaha: 5,
          murabaha: 2,
        },
        last_updated: new Date().toISOString(),
      },
      shariah_reviews_card: {
        title: 'Shariah Reviews',
        total_count: 12,
        needs_attention_count: 2,
        status: 'in_progress',
        breakdown_by_component: {
          sukuk_ijara: 7,
          sukuk_murabaha: 3,
          murabaha: 2,
        },
        last_updated: new Date().toISOString(),
      },
      impact_validations_card: {
        title: 'Impact Validations',
        total_count: 6,
        needs_attention_count: 1,
        status: 'in_progress',
        breakdown_by_component: {
          green_sukuk: 4,
          sdg: 2,
        },
        last_updated: new Date().toISOString(),
      },
      documents_card: {
        title: 'Documents',
        total_count: 48,
        needs_attention_count: 5,
        status: 'in_progress',
        breakdown_by_component: {
          sukuk_ijara: 20,
          sukuk_murabaha: 15,
          murabaha: 13,
        },
        last_updated: new Date().toISOString(),
      },
      active_deals: [
        {
          deal_id: 'exec-001',
          deal_name: 'UAE Sukuk Ijara (Green)',
          shariah_structure: 'sukuk_ijara',
          jurisdiction: 'uae_dfsa',
          accounting: 'aaoifi',
          impact: 'green_sukuk',
          takaful_enabled: true,
          overall_completion: 85.0,
          status: 'in_progress',
          created_at: new Date().toISOString(),
        },
        {
          deal_id: 'exec-002',
          deal_name: 'Saudi Murabaha',
          shariah_structure: 'murabaha',
          jurisdiction: 'saudi_cma',
          accounting: 'aaoifi',
          impact: 'none',
          takaful_enabled: false,
          overall_completion: 92.0,
          status: 'compliant',
          created_at: new Date().toISOString(),
        },
      ],
      total_deals: 5,
      compliant_deals: 3,
      deals_needing_attention: 1,
      overall_platform_compliance: 81.8,
    }
  }

  private mockComponentCompliance(componentType: string): any {
    const mockData: Record<string, any> = {
      shariah_structure: {
        component_type: 'shariah_structure',
        component_id: 'aggregated',
        component_name: 'All Shariah Structures',
        total_requirements: 37,
        completed_requirements: 30,
        evidence_count: 19,
        required_evidence_count: 25,
        control_completion: 81.1,
        evidence_completion: 76.0,
        overall_completion: 80.2,
        status: 'in_progress',
        needs_attention_count: 4,
        last_updated: new Date().toISOString(),
      },
      jurisdiction: {
        component_type: 'jurisdiction',
        component_id: 'aggregated',
        component_name: 'All Jurisdictions',
        total_requirements: 55,
        completed_requirements: 48,
        evidence_count: 25,
        required_evidence_count: 29,
        control_completion: 87.3,
        evidence_completion: 86.2,
        overall_completion: 85.0,
        status: 'in_progress',
        needs_attention_count: 3,
        last_updated: new Date().toISOString(),
      },
    }
    return mockData[componentType] || mockData.shariah_structure
  }

  private mockAllDeals(filters?: { component_type?: string; component_id?: string }): any[] {
    const allDeals = [
      {
        deal_id: 'exec-001',
        deal_name: 'UAE Sukuk Ijara (Green)',
        shariah_structure: 'sukuk_ijara',
        jurisdiction: 'uae_dfsa',
        accounting: 'aaoifi',
        impact: 'green_sukuk',
        takaful_enabled: true,
        overall_completion: 85.0,
        status: 'in_progress',
        created_at: new Date().toISOString(),
      },
      {
        deal_id: 'exec-002',
        deal_name: 'Saudi Murabaha',
        shariah_structure: 'murabaha',
        jurisdiction: 'saudi_cma',
        accounting: 'aaoifi',
        impact: 'none',
        takaful_enabled: false,
        overall_completion: 92.0,
        status: 'compliant',
        created_at: new Date().toISOString(),
      },
    ]

    // Apply filters if provided
    if (filters?.component_type && filters?.component_id) {
      return allDeals.filter((deal: any) => {
        const componentKey = filters.component_type === 'shariah_structure' ? 'shariah_structure' :
                             filters.component_type === 'jurisdiction' ? 'jurisdiction' :
                             filters.component_type === 'accounting' ? 'accounting' : 'impact'
        return deal[componentKey] === filters.component_id
      })
    }

    return allDeals
  }

  private mockDealCompliance(dealId: string): any | null {
    const mockDeals: Record<string, any> = {
      'exec-001': {
        deal_id: 'exec-001',
        deal_name: 'UAE Sukuk Ijara (Green)',
        shariah_structure: 'sukuk_ijara',
        jurisdiction: 'uae_dfsa',
        accounting: 'aaoifi',
        impact: 'green_sukuk',
        takaful_enabled: true,
        shariah_compliance: {
          component_type: 'shariah_structure',
          component_id: 'sukuk_ijara',
          component_name: 'Sukuk Ijara',
          total_requirements: 15,
          completed_requirements: 13,
          evidence_count: 7,
          required_evidence_count: 8,
          control_completion: 86.7,
          evidence_completion: 87.5,
          overall_completion: 87.0,
          status: 'in_progress',
          needs_attention_count: 2,
          last_updated: new Date().toISOString(),
        },
        jurisdiction_compliance: {
          component_type: 'jurisdiction',
          component_id: 'uae_dfsa',
          component_name: 'UAE DFSA',
          total_requirements: 25,
          completed_requirements: 22,
          evidence_count: 11,
          required_evidence_count: 12,
          control_completion: 88.0,
          evidence_completion: 91.7,
          overall_completion: 89.3,
          status: 'in_progress',
          needs_attention_count: 1,
          last_updated: new Date().toISOString(),
        },
        accounting_compliance: {
          component_type: 'accounting',
          component_id: 'aaoifi',
          component_name: 'AAOIFI',
          total_requirements: 62,
          completed_requirements: 50,
          evidence_count: 18,
          required_evidence_count: 20,
          control_completion: 80.6,
          evidence_completion: 90.0,
          overall_completion: 84.4,
          status: 'in_progress',
          needs_attention_count: 4,
          last_updated: new Date().toISOString(),
        },
        impact_compliance: {
          component_type: 'impact',
          component_id: 'green_sukuk',
          component_name: 'Green Sukuk Standards',
          total_requirements: 10,
          completed_requirements: 8,
          evidence_count: 7,
          required_evidence_count: 8,
          control_completion: 80.0,
          evidence_completion: 87.5,
          overall_completion: 82.8,
          status: 'in_progress',
          needs_attention_count: 1,
          last_updated: new Date().toISOString(),
        },
        overall_completion: 85.0,
        status: 'in_progress',
        created_at: new Date().toISOString(),
      },
    }
    return mockDeals[dealId] || null
  }

  private mockMonitoringCardDetails(cardType: string): any {
    const mockCards: Record<string, any> = {
      contracts: {
        total_count: 15,
        needs_attention_count: 3,
        breakdown: {
          sukuk_ijara: 8,
          sukuk_murabaha: 5,
          murabaha: 2,
        },
        details: [
          { id: 'c1', name: 'Master Trust Agreement', status: 'needs_attention' },
          { id: 'c2', name: 'Purchase Undertaking', status: 'ok' },
          { id: 'c3', name: 'Service Agency Agreement', status: 'ok' },
        ],
      },
      shariah_reviews: {
        total_count: 12,
        needs_attention_count: 2,
        breakdown: {
          sukuk_ijara: 7,
          sukuk_murabaha: 3,
          murabaha: 2,
        },
        details: [
          { id: 'sr1', name: 'Structure Review', status: 'needs_attention' },
          { id: 'sr2', name: 'Annual Audit', status: 'ok' },
        ],
      },
      impact_validations: {
        total_count: 6,
        needs_attention_count: 1,
        breakdown: {
          green_sukuk: 4,
          sdg: 2,
        },
        details: [
          { id: 'iv1', name: 'Green Bond Certification', status: 'ok' },
          { id: 'iv2', name: 'Impact Report Q1', status: 'needs_attention' },
        ],
      },
      documents: {
        total_count: 48,
        needs_attention_count: 5,
        breakdown: {
          sukuk_ijara: 20,
          sukuk_murabaha: 15,
          murabaha: 13,
        },
        details: [
          { id: 'd1', name: 'Prospectus', status: 'ok' },
          { id: 'd2', name: 'Financial Statements', status: 'needs_attention' },
        ],
      },
    }
    return mockCards[cardType] || mockCards.contracts
  }

  private mockCreateDeal(dealData: any): any {
    const dealId = `deal-mock-${Date.now()}`
    return {
      deal_id: dealId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      overall_completion: 0.0,
      ...dealData,
    }
  }

  private mockGetDeals(filters?: { status?: string; limit?: number }): any[] {
    const allMockDeals = [
      {
        deal_id: 'deal-mock-001',
        deal_name: 'Mock QIIB Oryx Sustainability Sukuk',
        shariah_structure: 'wakala',
        jurisdiction: 'qatar_qfc',
        accounting_standard: 'aaoifi',
        impact_framework: 'qfc_sustainable',
        deal_amount: 500000000.0,
        currency: 'USD',
        originator: 'Qatar International Islamic Bank',
        status: 'active',
        overall_completion: 45.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        deal_id: 'deal-mock-002',
        deal_name: 'Mock UAE Green Ijarah',
        shariah_structure: 'ijarah',
        jurisdiction: 'uae_difc',
        accounting_standard: 'ifrs',
        impact_framework: 'un_sdgs',
        deal_amount: 250000000.0,
        currency: 'AED',
        originator: 'Dubai Islamic Bank',
        status: 'completed',
        overall_completion: 100.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    // Apply filters
    let filtered = allMockDeals
    if (filters?.status) {
      filtered = filtered.filter((d) => d.status === filters.status)
    }
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit)
    }

    return filtered
  }

  private mockGetDeal(dealId: string): any | null {
    const mockDeals: Record<string, any> = {
      'deal-mock-001': {
        deal_id: 'deal-mock-001',
        deal_name: 'Mock QIIB Oryx Sustainability Sukuk',
        shariah_structure: 'wakala',
        jurisdiction: 'qatar_qfc',
        accounting_standard: 'aaoifi',
        impact_framework: 'qfc_sustainable',
        deal_amount: 500000000.0,
        currency: 'USD',
        originator: 'Qatar International Islamic Bank',
        guardian_policy_id: 'policy_qfc_wakala_v1_mock',
        guardian_transaction_id: '0.0.123456@1730707200.0',
        status: 'active',
        overall_completion: 45.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
    return mockDeals[dealId] || null
  }

  private mockGetDealStats(): any {
    return {
      total_deals: 2,
      active_deals: 1,
      completed_deals: 1,
      draft_deals: 0,
      archived_deals: 0,
      average_completion: 72.5,
    }
  }

  // ==========================================================================
  // EVENT SYSTEM
  // ==========================================================================

  /**
   * Subscribe to backend client events
   */
  on(event: BackendClientEvent, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)
  }

  /**
   * Unsubscribe from backend client events
   */
  off(event: BackendClientEvent, callback: EventCallback): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(callback)
    }
  }

  /**
   * Emit an event to all listeners
   */
  private emit(event: BackendClientEvent, data: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((callback) => callback(data))
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const backendClient = new BackendClient()
