# MCP Integration Migration Plan
**Version:** 1.0
**Date:** 2025-10-08
**Status:** Planning Phase

---

## Executive Summary

This document outlines the migration strategy from direct API calls to Model Context Protocol (MCP) integrations across four key areas:

1. **Blade-Graphiti MCP** - Knowledge graph operations
2. **Copilots MCP** - AI expert consultation for custom workflows
3. **Exa MCP** - Web research capabilities
4. **Hedera Agent Kit MCP** - Blockchain integration

---

## 1. BLADE-GRAPHITI MCP INTEGRATION

### 1.1 Current Architecture Analysis

**Current Implementation:**
```python
# backend/app/services/graphiti_service.py
class GraphitiService:
    def __init__(self):
        self.client = Graphiti(
            uri=neo4j_uri,
            user=neo4j_user,
            password=neo4j_password
        )

    async def search(self, query: str) -> List[Dict]:
        # Direct Graphiti client call
        results = await self.client.search(query)
        return results

    async def add_episode(self, name: str, content: str):
        # Direct episode creation
        episode = await self.client.add_episode(...)
        return episode
```

**Current Direct Calls:**
- `GraphitiService.search()` - Knowledge graph search
- `GraphitiService.add_episode()` - Add AAOIFI document episodes
- `GraphitiService.add_episodes_bulk()` - Bulk document ingestion
- Neo4j direct connection for schema/stats queries

### 1.2 Available MCP Tools

```python
# From blade-graphiti MCP
mcp__blade-graphiti__search(
    query: str,                    # Natural language search
    group_ids: List[str] = None,   # Namespace filtering
    num_results: int = 20,         # Result limit
    search_filter: Dict = None     # Advanced filters (node_labels, edge_types, temporal)
)

mcp__blade-graphiti__add_episode(
    name: str,                     # Episode title
    episode_body: str,             # Content to process
    episode_type: str = "message", # "text", "message", or "json"
    source_description: str,       # Data source
    group_id: str = None,          # Namespace
    reference_time: str = None     # ISO-8601 timestamp
)

mcp__blade-graphiti__add_episodes_bulk(
    episodes_json: str,            # JSON array of episodes
    group_id: str = None           # Namespace for all episodes
)

mcp__blade-graphiti__get_recent_nodes(
    limit: int = 10,               # Max results
    node_labels: List[str] = None, # Filter by node type
    group_id: str = None           # Namespace filter
)

mcp__blade-graphiti__delete_episode(
    uuid: str                      # Episode UUID to delete
)
```

### 1.3 Migration Strategy

#### Phase 1: Create MCP Wrapper Service

**New File:** `backend/app/services/graphiti_mcp_service.py`

```python
"""
GRAPHITI MCP SERVICE
====================
Replaces direct Graphiti client with MCP tool calls.

WHY MCP:
- Standardized protocol for Claude integrations
- Better context management via Agent SDK
- Eliminates direct Neo4j dependency
- Future-proof architecture
"""

from typing import List, Dict, Optional
import json
from claude_agent_sdk import query

class GraphitiMCPService:
    """MCP-based Graphiti service using blade-graphiti MCP server"""

    def __init__(self):
        # MCP configuration for blade-graphiti server
        self.mcp_config = {
            "mcpServers": {
                "blade-graphiti": {
                    "command": "uvx",
                    "args": ["mcp-server-graphiti"],
                    "env": {
                        "NEO4J_URI": os.getenv("NEO4J_URI"),
                        "NEO4J_USER": os.getenv("NEO4J_USER"),
                        "NEO4J_PASSWORD": os.getenv("NEO4J_PASSWORD")
                    }
                }
            },
            "allowedTools": [
                "mcp__blade-graphiti__search",
                "mcp__blade-graphiti__add_episode",
                "mcp__blade-graphiti__add_episodes_bulk",
                "mcp__blade-graphiti__get_recent_nodes",
                "mcp__blade-graphiti__delete_episode"
            ]
        }

    async def search(
        self,
        query: str,
        group_ids: Optional[List[str]] = None,
        num_results: int = 20
    ) -> List[Dict]:
        """
        Search knowledge graph via MCP.

        Replaces: graphiti_service.search()
        """
        # Build MCP tool call prompt
        tool_call_prompt = f"""
        Use the mcp__blade-graphiti__search tool to search for: {query}

        Parameters:
        - query: {query}
        - num_results: {num_results}
        {f"- group_ids: {group_ids}" if group_ids else ""}

        Return the search results as JSON.
        """

        results = []
        async for message in query(
            prompt=tool_call_prompt,
            options=self.mcp_config
        ):
            # Extract structured results from Claude's response
            results.append(message)

        return self._parse_search_results(results)
```

---

## 2. COPILOTS MCP INTEGRATION - CUSTOM WORKFLOW CREATION

### 2.1 Concept: AI Expert Consultation System

**Vision:** Enable users to create custom workflows by consulting AI domain experts who provide tailored guidance, templates, and implementation plans.

**Use Case Examples:**

1. **Shariah Audit Workflow**
   - Consult: SCO (Shariah Compliance Officer)
   - Consult: CCO (Chief Compliance Officer)
   - Output: Custom audit checklist, compliance criteria, reporting template

2. **Islamic Product Launch**
   - Consult: CEO (Strategic positioning)
   - Consult: CMO (Marketing strategy)
   - Consult: SCO (Shariah compliance)
   - Output: Go-to-market workflow with compliance gates

3. **Legal Contract Review**
   - Consult: CLO (Legal strategy)
   - Consult: SCO (Shariah compliance)
   - Output: Contract review workflow with dual compliance

### 2.2 Available Copilot MCPs

```python
# C-Suite Copilots
mcp__copilots__ask-ceo(query: str)     # Strategic leadership
mcp__copilots__ask-cto(query: str)     # Technology strategy
mcp__copilots__ask-coo(query: str)     # Operational excellence
mcp__copilots__ask-cmo(query: str)     # Marketing strategy
mcp__copilots__ask-clo(query: str)     # Legal strategy
mcp__copilots__ask-cco(query: str)     # Compliance strategy
mcp__copilots__ask-sco(query: str)     # Shariah compliance
mcp__copilots__ask-pe(query: str)      # Prompt engineering
```

### 2.3 UI/UX Design: Custom Workflow Creation Wizard

#### Step 1: Workflow Type Selection

```
┌─────────────────────────────────────────────────────┐
│  Create Custom Workflow                              │
├─────────────────────────────────────────────────────┤
│                                                       │
│  What type of workflow do you need?                  │
│                                                       │
│  [Text Input]                                         │
│  ┌─────────────────────────────────────────────┐    │
│  │ e.g., "Shariah audit for sukuk issuance"   │    │
│  │      "Legal review for Murabaha contract"   │    │
│  │      "Product launch for Islamic fund"      │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  OR select from common workflows:                     │
│                                                       │
│  ○ Shariah Compliance Audit                          │
│  ○ Islamic Product Launch                            │
│  ○ Legal Contract Review                             │
│  ○ Regulatory Filing                                 │
│  ○ Custom (describe above)                           │
│                                                       │
│              [Analyze Requirements] →                │
└─────────────────────────────────────────────────────┘
```

#### Step 2: AI Expert Consultation (Auto-Routing)

**Backend Intelligence:**

```python
async def route_to_experts(workflow_description: str) -> List[str]:
    """
    Intelligently route workflow to relevant copilot experts.

    Uses LLM to analyze description and determine which experts to consult.
    """

    # Step 1: Analyze workflow requirements with PE copilot
    analysis_prompt = f"""
    Analyze this workflow requirement and determine which experts should be consulted:

    Workflow: {workflow_description}

    Available Experts:
    - CEO: Strategic leadership, business vision, market positioning
    - CTO: Technology strategy, architecture, system design
    - COO: Operations, process optimization, execution
    - CMO: Marketing, customer acquisition, brand strategy
    - CLO: Legal compliance, contracts, regulatory affairs
    - CCO: Compliance frameworks, risk management, governance
    - SCO: Shariah compliance, Islamic finance principles

    Return a JSON array of experts to consult with reasoning:
    [
        {{"expert": "SCO", "reason": "Shariah compliance validation required"}},
        {{"expert": "CLO", "reason": "Legal contract review needed"}}
    ]
    """

    pe_response = await mcp__copilots__ask_pe(analysis_prompt)
    experts = parse_expert_recommendations(pe_response)

    return experts
```

---

## 3. EXA MCP INTEGRATION - RESEARCH CAPABILITY

### 3.1 Available Exa MCP Tools

```python
mcp__exa__web_search_exa(
    query: str,           # Search query
    numResults: int = 5   # Number of results
)

mcp__exa__get_code_context_exa(
    query: str,                    # Search query for APIs/SDKs/Libraries
    tokensNum: str|int = "dynamic" # Token allocation strategy
)
```

### 3.2 Research Capability Design

**Use Cases:**

1. **Market Research**: "Research latest sukuk issuances in GCC region"
2. **Regulatory Updates**: "Find recent AAOIFI standard updates"
3. **Best Practices**: "Research Shariah governance frameworks in Malaysia"
4. **Competitive Analysis**: "Analyze Islamic banking products in UAE"

**UI Integration:**

Add research step in workflow (optional):

```
┌─────────────────────────────────────────────────────┐
│  Step 1B: Research & Context (Optional)              │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Enhance your workflow with external research:       │
│                                                       │
│  Research Query:                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │ Latest AAOIFI guidelines on sukuk reporting │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  [🔍 Search the Web] [Skip Research]                │
│                                                       │
│  Research Results (5):                                │
│  ┌─────────────────────────────────────────────┐    │
│  │ 📄 AAOIFI FAS 33 Update (2024)              │    │
│  │ Source: aaoifi.com                           │    │
│  │ Relevance: ⭐⭐⭐⭐⭐                          │    │
│  │ [Add to Context]                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 4. HEDERA AGENT KIT MCP - BLOCKCHAIN INTEGRATION

### 4.1 What is Hedera?

**Hedera Hashgraph** is a public distributed ledger technology (DLT) that provides:
- **High throughput**: 10,000+ TPS
- **Low fees**: $0.0001 per transaction
- **Fast finality**: 3-5 seconds
- **Carbon negative**: Energy efficient consensus

**Use Cases for Islamic Finance:**
- **Tokenized Sukuk**: Issue sukuk as NFTs on blockchain
- **Halal Supply Chain**: Track halal certification via blockchain
- **Zakat Distribution**: Transparent charity disbursement
- **Islamic Finance Records**: Immutable audit trail
- **Shariah Compliance Attestation**: Blockchain-verified compliance certificates

### 4.2 Available Hedera MCP Tools

**Token Operations:**
```python
mcp__hedera-agent-kit__create_fungible_token(tokenName, tokenSymbol, ...)
mcp__hedera-agent-kit__mint_fungible_token(tokenId, amount)
mcp__hedera-agent-kit__create_non_fungible_token(tokenName, tokenSymbol, ...)
mcp__hedera-agent-kit__mint_non_fungible_token(tokenId, uris)
mcp__hedera-agent-kit__airdrop_fungible_token(tokenId, recipients, ...)
```

**Account Operations:**
```python
mcp__hedera-agent-kit__create_account(publicKey, accountMemo, ...)
mcp__hedera-agent-kit__update_account(accountId, ...)
mcp__hedera-agent-kit__delete_account(accountId, ...)
mcp__hedera-agent-kit__transfer_hbar(transfers, ...)
```

**Topic Operations (Messaging):**
```python
mcp__hedera-agent-kit__create_topic(topicMemo, isSubmitKey)
mcp__hedera-agent-kit__submit_topic_message(topicId, message)
```

**Query Operations:**
```python
mcp__hedera-agent-kit__get_hbar_balance_query_tool(accountId)
mcp__hedera-agent-kit__get_account_query_tool(accountId)
mcp__hedera-agent-kit__get_topic_messages_query_tool(topicId, ...)
```

### 4.3 Integration into Step 1: Source Connection

**Enhanced Step 1:**
- Connect to Graphiti Knowledge Graph
- Connect to Hedera Blockchain ← NEW
- Upload AAOIFI Documents

**UI Design:**

```
┌─────────────────────────────────────────────────────┐
│  Step 1: Source Connection                           │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │ 📊 Knowledge Graph (Graphiti/Neo4j)         │    │
│  │ Status: ✓ Connected (996 nodes, 6664 edges) │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │ ⛓️  Blockchain (Hedera Hashgraph)            │    │
│  │ Status: ○ Not Connected                      │    │
│  │                                              │    │
│  │ Account ID: [____________]                   │    │
│  │ Private Key: [____________] (secure input)   │    │
│  │                                              │    │
│  │ [Connect to Hedera]                          │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  What can you do with blockchain?                    │
│  • Record immutable audit trails                     │
│  • Issue tokenized sukuk (NFTs)                      │
│  • Submit compliance attestations                    │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 5. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1)

**Day 1-2: MCP Agent SDK Setup**
- [ ] Install `claude-agent-sdk` in backend
- [ ] Configure MCP servers in environment
- [ ] Test basic MCP tool calls
- [ ] Document MCP configuration

**Day 3-4: Blade-Graphiti Migration**
- [ ] Create `GraphitiMCPService`
- [ ] Migrate search endpoint
- [ ] Migrate episode ingestion
- [ ] Test knowledge graph operations

**Day 5: Hedera Integration Setup**
- [ ] Create `HederaService`
- [ ] Add blockchain connection UI
- [ ] Test connection and account queries

### Phase 2: Custom Workflows (Week 2)

**Day 1-2: Copilots MCP Integration**
- [ ] Create `CustomWorkflowService`
- [ ] Implement expert routing logic
- [ ] Test copilot consultations

**Day 3-4: Wizard UI Development**
- [ ] Create `CustomWorkflowWizard.tsx`
- [ ] Build expert consultation panel
- [ ] Implement workflow synthesis

**Day 5: Testing & Refinement**
- [ ] Test end-to-end custom workflow creation
- [ ] Refine expert routing
- [ ] Polish UI/UX

### Phase 3: Research & Blockchain (Week 3)

**Day 1-2: Exa Research Integration**
- [ ] Create `ResearchService`
- [ ] Add research step to workflow
- [ ] Build research results UI

**Day 3-4: Hedera Blockchain Features**
- [ ] Implement compliance topic creation
- [ ] Add checkpoint recording
- [ ] Build audit trail viewer

**Day 5: Integration & Testing**
- [ ] End-to-end testing of all MCPs
- [ ] Performance optimization
- [ ] Documentation updates

---

## 6. SUCCESS METRICS

### Technical Metrics
- [ ] 100% of Graphiti operations via MCP (no direct client calls)
- [ ] Custom workflow creation < 2 minutes
- [ ] Research integration < 5 seconds per query
- [ ] Hedera connection success rate > 99%
- [ ] MCP tool call latency < 500ms average

### User Experience Metrics
- [ ] Users can create custom workflows without coding
- [ ] Expert consultation provides actionable guidance
- [ ] Research results add value to workflows
- [ ] Blockchain trail provides audit confidence

---

**End of Migration Plan**

**Next Steps:** Review this plan, provide feedback, and approve for implementation.
