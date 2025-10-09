# UX IMPROVEMENTS PLAN
## Making Backend Requirements Visible & App Functional Without Backend

---

## 🎯 **GOALS**

1. **App should be explorable without backend** - Users can navigate, see templates, understand workflow
2. **Every button shows its dependencies** - Clear visibility of which services are needed
3. **Explicit mock indicators** - ALWAYS show when data is mock vs. real (critical for testing)
4. **Developer mode** - Toggle to disable all mocks and see raw errors
5. **Guide backend developers** - Make it crystal clear what each service enables

## ⚠️ **CRITICAL PRINCIPLE: TRANSPARENCY**

**Mock data is DANGEROUS for testing.** Every mock response MUST be clearly labeled:
- Visual badges: "🎭 MOCK DATA"
- Console logs: "[MOCK] Returning mock templates"
- Developer mode: Option to disable ALL mocks and see real errors
- API call logging: Show every API call and whether it succeeded/failed/mocked

---

## 📋 **ISSUES IDENTIFIED**

### Issue 1: Templates Don't Load Without Backend
**Problem:** `fetchWorkflowTemplates()` fails → No templates shown → Can't proceed to Step 2
**Impact:** App appears broken, can't demo workflow selection

**Solution:**
- Add 5 mock templates as fallback (from SPEC.md)
- Update `fetchWorkflowTemplates()` to return mock templates when backend unavailable
- Show badge indicating "Mock Templates" vs "Live Templates"

### Issue 2: Test Connection Has No Fallback
**Problem:** "Test Connection" button fails without helpful message
**Impact:** Confusing error, unclear what's needed

**Solution:**
- When Graphiti service disconnected, show modal explaining:
  - "Graphiti service not available"
  - "Mock stats will be shown for demonstration"
- Return mock stats to allow UI exploration

### Issue 3: Interactive Session Can't Start
**Problem:** Orchestrator service required, no clear indication
**Impact:** User can't understand why execution won't start

**Solution:**
- Disable "Start Execution" button when Orchestrator disconnected
- Show tooltip: "Requires: LangGraph Orchestrator service"
- Link to backend setup documentation

### Issue 4: No Per-Feature Service Dependencies
**Problem:** Users don't know which services each button/feature needs
**Impact:** Backend developers unclear about what to implement first

**Solution:**
- Add service dependency badges to every interactive element
- Create visual mapping of features → required services
- Show in real-time which services would enable which features

---

## 🏗️ **IMPLEMENTATION PLAN**

### **Phase 0: Developer Mode & Mock Indicators** (25 min) - **DO THIS FIRST**

#### 0.1 Add Developer Mode to Store
**File:** `src/lib/store.ts`

```typescript
interface WorkflowStore {
  // ... existing state

  // Developer mode settings
  developerMode: boolean
  disableAllMocks: boolean
  showApiLogs: boolean

  // Actions
  setDeveloperMode: (enabled: boolean) => void
  setDisableAllMocks: (disabled: boolean) => void
  setShowApiLogs: (show: boolean) => void
}
```

#### 0.2 Create Developer Settings Panel
**File:** `src/components/workflow/DeveloperSettings.tsx`

```typescript
export function DeveloperSettings() {
  const {
    developerMode,
    disableAllMocks,
    showApiLogs,
    setDeveloperMode,
    setDisableAllMocks,
    setShowApiLogs,
  } = useWorkflowStore()

  return (
    <Card className="border-yellow-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Developer Settings
        </CardTitle>
        <CardDescription>
          Testing controls - visible only in development mode
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Developer Mode</Label>
            <p className="text-xs text-muted-foreground">
              Show debug information and API logs
            </p>
          </div>
          <Switch
            checked={developerMode}
            onCheckedChange={setDeveloperMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-red-600">Disable All Mocks</Label>
            <p className="text-xs text-muted-foreground">
              ⚠️ Fail fast - no fallback data, show real errors
            </p>
          </div>
          <Switch
            checked={disableAllMocks}
            onCheckedChange={setDisableAllMocks}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Show API Logs</Label>
            <p className="text-xs text-muted-foreground">
              Log all API calls to console
            </p>
          </div>
          <Switch
            checked={showApiLogs}
            onCheckedChange={setShowApiLogs}
          />
        </div>
      </CardContent>
    </Card>
  )
}
```

#### 0.3 Add to BackendServiceMonitor
```typescript
import { DeveloperSettings } from './DeveloperSettings'

// In BackendServiceMonitor component:
<ScrollArea>
  <CardContent>
    {/* Existing service status cards */}

    {/* Add Developer Settings at bottom */}
    {process.env.NODE_ENV === 'development' && (
      <>
        <Separator className="my-6" />
        <DeveloperSettings />
      </>
    )}
  </CardContent>
</ScrollArea>
```

#### 0.4 Create MockDataBadge Component
**File:** `src/components/workflow/MockDataBadge.tsx`

```typescript
interface Props {
  visible?: boolean  // Only show if data is actually mock
  inline?: boolean   // Inline (next to data) vs. banner (top of card)
}

export function MockDataBadge({ visible = true, inline = false }: Props) {
  if (!visible) return null

  if (inline) {
    return (
      <Badge variant="outline" className="bg-yellow-50 border-yellow-500 text-yellow-700">
        🎭 MOCK DATA
      </Badge>
    )
  }

  // Banner style
  return (
    <Alert variant="warning" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Using Mock Data</AlertTitle>
      <AlertDescription>
        This data is simulated for demonstration. Backend service not available.
      </AlertDescription>
    </Alert>
  )
}
```

#### 0.5 Add API Call Logger
**File:** `src/lib/api-logger.ts`

```typescript
export function logApiCall(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  status: 'success' | 'error' | 'mock',
  details?: any
) {
  const store = useWorkflowStore.getState()

  if (!store.showApiLogs && !store.developerMode) return

  const emoji = {
    success: '✅',
    error: '❌',
    mock: '🎭'
  }[status]

  const style = {
    success: 'color: green',
    error: 'color: red',
    mock: 'color: orange; font-weight: bold'
  }[status]

  console.groupCollapsed(
    `%c${emoji} [${status.toUpperCase()}] ${method} ${endpoint}`,
    style
  )
  console.log('Status:', status)
  console.log('Endpoint:', endpoint)
  console.log('Method:', method)
  if (details) {
    console.log('Details:', details)
  }
  console.groupEnd()
}
```

---

### **Phase 1: Mock Data & Fallbacks** (30 min)

#### 1.1 Create Mock Templates File
**File:** `src/lib/mock-data.ts`

```typescript
// 5 Islamic Finance workflow templates
export const MOCK_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'sukuk-issuance',
    name: 'Sukuk Issuance Document',
    description: 'Generate Sharia-compliant bond prospectus (AAOIFI FAS 3)',
    icon: '💰',
    category: 'structuring',
    openCodeTemplate: `Create a Sukuk issuance document that:
1. Describes structure (Issuer, SPV, Trustee, Investors)
2. Identifies underlying asset
3. Explains profit distribution
4. Provides Sharia compliance certification
5. Includes risk disclosures`,
    axialCode: {
      steps: [],
      requiredSources: ['AAOIFI FAS 3', 'AAOIFI GS 8'],
      outputFormat: 'markdown',
      estimatedDuration: 45,
      complexity: 'complex'
    },
    // ... metadata
  },
  // ... 4 more templates (Murabaha, Ijarah, Mudarabah, Wakalah)
]

export const MOCK_GRAPHITI_STATS = {
  connected: true, // Mock as connected for demo
  totalNodes: 1250,
  totalEdges: 3420,
  totalEpisodes: 15,
  aaaoifiDocumentsCount: 3
}
```

#### 1.2 Update `fetchWorkflowTemplates()` in api.ts
```typescript
export async function fetchWorkflowTemplates(): Promise<WorkflowTemplate[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/templates`)
    const backendTemplates = await handleResponse<any[]>(response)
    return backendTemplates.map(mapBackendTemplate)
  } catch (error) {
    console.warn('Backend templates unavailable, using mock templates')
    return MOCK_TEMPLATES
  }
}
```

#### 1.3 Update `testGraphitiConnection()` in api.ts
```typescript
export async function testGraphitiConnection(): Promise<GraphitiStats> {
  // Check if Graphiti service is available
  const status = backendClient.getServiceStatus('graphiti')

  if (status !== ServiceStatus.CONNECTED) {
    console.warn('Graphiti service unavailable, returning mock stats')
    return MOCK_GRAPHITI_STATS
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/graphiti/test`)
    return handleResponse<GraphitiStats>(response)
  } catch (error) {
    console.warn('Graphiti connection test failed, using mock stats')
    return MOCK_GRAPHITI_STATS
  }
}
```

---

### **Phase 2: Service Dependency Badges** (45 min)

#### 2.1 Create `ServiceDependencyBadge` Component
**File:** `src/components/workflow/ServiceDependencyBadge.tsx`

```typescript
interface Props {
  services: ServiceName[]  // Required services
  showLabel?: boolean      // Show "Requires:" label
  size?: 'sm' | 'md'       // Badge size
}

export function ServiceDependencyBadge({ services, showLabel = true, size = 'sm' }: Props) {
  const servicesStatus = useWorkflowStore((state) => state.servicesStatus)

  const allConnected = services.every(
    (name) => servicesStatus?.[name]?.status === ServiceStatus.CONNECTED
  )

  return (
    <div className="flex items-center gap-1 text-xs">
      {showLabel && <span className="text-muted-foreground">Requires:</span>}
      {services.map((name) => {
        const status = servicesStatus?.[name]?.status
        return (
          <Badge
            key={name}
            variant={status === ServiceStatus.CONNECTED ? 'default' : 'outline'}
            className={cn(
              size === 'sm' && 'text-[10px] px-1.5 py-0',
              status === ServiceStatus.DISCONNECTED && 'border-red-500 text-red-500'
            )}
          >
            {servicesStatus?.[name]?.displayName || name}
          </Badge>
        )
      })}
    </div>
  )
}
```

#### 2.2 Update Interactive Buttons with Dependencies

**Example: Test Connection Button**
```typescript
<Tooltip>
  <TooltipTrigger asChild>
    <div>
      <Button
        onClick={handleTestConnection}
        disabled={testingConnection || graphitiDisconnected}
      >
        Test Connection
      </Button>
    </div>
  </TooltipTrigger>
  {graphitiDisconnected && (
    <TooltipContent>
      <ServiceDependencyBadge services={['graphiti']} />
      <p className="text-xs mt-1">Graphiti service must be running</p>
    </TooltipContent>
  )}
</Tooltip>
```

**Example: Upload AAOIFI Documents Button**
```typescript
<div className="space-y-2">
  <ServiceDependencyBadge
    services={['documents', 'graphiti']}
    showLabel={true}
  />
  <Input
    type="file"
    onChange={handleFileUpload}
    disabled={uploadingFiles.size > 0 || !servicesReady}
  />
  {!servicesReady && (
    <p className="text-xs text-muted-foreground">
      Requires Document Service (LlamaParse) and Graphiti for ingestion
    </p>
  )}
</div>
```

**Example: Start Execution Button**
```typescript
<div className="space-y-3">
  <ServiceDependencyBadge
    services={['orchestrator', 'mcp', 'graphiti']}
  />
  <Button
    onClick={handleStartExecution}
    disabled={!orchestratorReady}
    className="w-full"
  >
    {orchestratorReady ? (
      'Start Execution'
    ) : (
      'Orchestrator Service Required'
    )}
  </Button>
</div>
```

---

### **Phase 3: Feature-Service Mapping Table** (20 min)

#### 3.1 Add to BackendServiceMonitor

Add a new tab/section showing which features need which services:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Feature Dependencies</CardTitle>
    <CardDescription>
      What each backend service enables in the frontend
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Feature</TableHead>
          <TableHead>Required Services</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Test Graphiti Connection</TableCell>
          <TableCell>
            <ServiceDependencyBadge services={['graphiti']} showLabel={false} />
          </TableCell>
          <TableCell>{statusIcon}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Upload & Ingest AAOIFI Documents</TableCell>
          <TableCell>
            <ServiceDependencyBadge
              services={['documents', 'graphiti']}
              showLabel={false}
            />
          </TableCell>
          <TableCell>{statusIcon}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Search Knowledge Graph</TableCell>
          <TableCell>
            <ServiceDependencyBadge
              services={['mcp', 'graphiti']}
              showLabel={false}
            />
          </TableCell>
          <TableCell>{statusIcon}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Execute Workflow (Interactive Session)</TableCell>
          <TableCell>
            <ServiceDependencyBadge
              services={['orchestrator', 'mcp', 'graphiti']}
              showLabel={false}
            />
          </TableCell>
          <TableCell>{statusIcon}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Generate Final Document (PDF/DOCX)</TableCell>
          <TableCell>
            <ServiceDependencyBadge
              services={['documents']}
              showLabel={false}
            />
          </TableCell>
          <TableCell>{statusIcon}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Export LangFuse Traces</TableCell>
          <TableCell>
            <ServiceDependencyBadge
              services={['observability']}
              showLabel={false}
            />
          </TableCell>
          <TableCell>{statusIcon}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

---

### **Phase 4: Enhanced Error Messages** (15 min)

Replace generic errors with actionable messages:

**Before:**
```
Error: Failed to load templates
```

**After:**
```
❌ Template Service Unavailable

The backend Templates API is not running.

🔧 What you can do:
• Browse mock templates (loaded automatically)
• Start the backend service: `npm run backend:dev`
• View backend setup guide: /docs/backend-setup.md

📊 Service Status:
Orchestrator: ❌ Disconnected
```

---

## 📊 **SERVICE DEPENDENCY MATRIX**

| Feature | MCP Proxy | Orchestrator | Graphiti | Documents | Observability |
|---------|-----------|--------------|----------|-----------|---------------|
| Test Connection | | | ✅ | | |
| Upload AAOIFI Docs | | | ✅ | ✅ | |
| Search Knowledge Graph | ✅ | | ✅ | | |
| Load Templates | | ✅ | | | |
| Execute Workflow | ✅ | ✅ | ✅ | | |
| Generate Document | | | | ✅ | |
| View Traces | | | | | ✅ |

---

## ✅ **EXPECTED OUTCOMES**

1. **Without Backend Running:**
   - ✅ App loads successfully
   - ✅ 5 mock templates displayed
   - ✅ Mock Graphiti stats shown
   - ✅ All UI explorable in demo mode
   - ✅ Clear indicators: "Mock Mode" badges
   - ✅ Every button shows what services it needs

2. **With Partial Backend:**
   - ✅ Features light up as services connect
   - ✅ Real-time status updates in UI
   - ✅ Clear visibility of what's available vs. missing

3. **For Backend Developers:**
   - ✅ Immediately see: "If I implement Graphiti service, these 4 features will work"
   - ✅ Feature dependency table guides implementation priority
   - ✅ Can test each service independently

---

## 🚀 **IMPLEMENTATION ORDER**

1. **Phase 1** (30 min) - Mock data & fallbacks
   - Most impactful: Makes app functional

2. **Phase 2** (45 min) - Service dependency badges
   - High value: Clear visibility of requirements

3. **Phase 3** (20 min) - Feature mapping table
   - Great for backend developers

4. **Phase 4** (15 min) - Enhanced error messages
   - Polish, improves UX

**Total Time:** ~2 hours

---

## 🎯 **SUCCESS CRITERIA**

- [ ] App loads and is fully explorable without backend
- [ ] Every interactive element shows which services it needs
- [ ] Mock templates (5) available when backend unavailable
- [ ] Feature dependency table visible in BackendServiceMonitor
- [ ] Clear "Mock Mode" indicators when using fallback data
- [ ] Backend developers can immediately understand what to build
