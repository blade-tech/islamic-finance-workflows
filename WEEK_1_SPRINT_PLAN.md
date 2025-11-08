# Week 1 Sprint Plan: AI-Native Vanta Foundation
**Sprint Goal**: Ship working AI Copilot that answers Islamic finance compliance questions

**Duration**: 5 working days
**Team Size**: 1-2 developers
**Success Metric**: User can ask "What's blocking this deal?" and get AAOIFI-cited answer

---

## Day 1 (Monday): LLM Integration Setup

### Backend Tasks

#### ✅ **Task 1.1**: Set up Claude API Integration
**File**: `backend/app/services/ai_agent_service.py`

```python
"""
AI Agent Service - LLM integration for compliance copilot
"""
from anthropic import Anthropic
import os

class AIAgentService:
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.model = "claude-3-5-sonnet-20241022"

    async def ask_copilot(self, query: str, context: dict) -> dict:
        """
        AI Copilot Q&A with Islamic finance context

        Args:
            query: User question (e.g., "What's blocking this deal?")
            context: Deal data, compliance status, tasks

        Returns:
            {
                "answer": "AI response with AAOIFI citations",
                "citations": ["AAOIFI FAS 28 §4.2", ...],
                "suggested_actions": ["Reassign to Sarah", ...]
            }
        """
        system_prompt = self._build_system_prompt()
        user_message = self._format_query(query, context)

        response = self.client.messages.create(
            model=self.model,
            max_tokens=2048,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}]
        )

        return self._parse_response(response.content[0].text)

    def _build_system_prompt(self) -> str:
        return """You are an AI compliance advisor specializing in Islamic finance.

        Your expertise:
        - AAOIFI standards (FAS 1-59, Shariah Standards 1-65)
        - IFSB regulatory frameworks
        - Shariah structures: Murabaha, Wakala, Ijara, Sukuk, Musharaka
        - 4-component compliance: Shariah, Jurisdiction, Accounting, Impact

        Always:
        - Cite specific AAOIFI/IFSB standards
        - Provide actionable next steps
        - Identify blockers and suggest resolutions
        - Format citations as [AAOIFI FAS XX §Y.Z]
        """

    def _format_query(self, query: str, context: dict) -> str:
        return f"""
        User question: {query}

        Deal context:
        - Deal ID: {context.get('deal_id')}
        - Shariah structure: {context.get('shariah_structure')}
        - Status: {context.get('status')}
        - Completion: {context.get('overall_completion')}%
        - Blockers: {context.get('blockers', [])}
        - Pending tasks: {context.get('pending_tasks', [])}

        Please analyze and provide:
        1. Direct answer to the question
        2. Relevant AAOIFI/IFSB citations
        3. Suggested actions to unblock
        """

    def _parse_response(self, response_text: str) -> dict:
        """Extract structured data from LLM response"""
        # Simple parser - extract citations and actions
        citations = self._extract_citations(response_text)
        actions = self._extract_actions(response_text)

        return {
            "answer": response_text,
            "citations": citations,
            "suggested_actions": actions,
            "confidence": 0.95  # Mock for demo
        }

    def _extract_citations(self, text: str) -> list:
        """Extract [AAOIFI ...] citations"""
        import re
        pattern = r'\[AAOIFI[^\]]+\]|\[IFSB[^\]]+\]'
        return re.findall(pattern, text)

    def _extract_actions(self, text: str) -> list:
        """Extract action items (lines starting with numbers or bullets)"""
        import re
        lines = text.split('\n')
        actions = []
        for line in lines:
            if re.match(r'^\d+\.|\-|\*', line.strip()):
                actions.append(line.strip())
        return actions[:5]  # Limit to 5 actions
```

**Time**: 3 hours

---

#### ✅ **Task 1.2**: Create API Endpoint
**File**: `backend/app/api/ai_copilot.py`

```python
"""
AI Copilot API Router
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_agent_service import AIAgentService

router = APIRouter(prefix="/api/ai", tags=["ai"])

class CopilotRequest(BaseModel):
    query: str
    deal_id: str = None
    context: dict = {}

class CopilotResponse(BaseModel):
    answer: str
    citations: list[str]
    suggested_actions: list[str]
    confidence: float

@router.post("/copilot", response_model=CopilotResponse)
async def ask_copilot(request: CopilotRequest):
    """
    AI Copilot Q&A endpoint

    Example:
        POST /api/ai/copilot
        {
            "query": "What's blocking this deal?",
            "deal_id": "deal-123",
            "context": {...}
        }
    """
    try:
        service = AIAgentService()

        # Fetch deal context if deal_id provided
        if request.deal_id:
            # TODO: Fetch from DealStorage
            request.context['deal_id'] = request.deal_id

        result = await service.ask_copilot(request.query, request.context)

        return CopilotResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Register in** `backend/app/main.py`:
```python
from app.api import ai_copilot
app.include_router(ai_copilot.router)
```

**Time**: 1 hour

---

### Frontend Tasks

#### ✅ **Task 1.3**: Create AI Copilot Widget Component
**File**: `src/components/ai/AICopilot.tsx`

```typescript
/**
 * AI COPILOT FLOATING WIDGET
 * ===========================
 * Delve-inspired floating chat widget for compliance Q&A
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, X, Send, Sparkles } from 'lucide-react'
import { backendClient } from '@/lib/backend-client'

export function AICopilot() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)

  const handleAsk = async () => {
    if (!query.trim()) return

    try {
      setLoading(true)
      const result = await backendClient.api('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          context: {}  // Add deal context from page
        })
      })

      setResponse(result)
    } catch (error) {
      console.error('AI Copilot error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all bg-emerald-600 hover:bg-emerald-700"
          size="icon"
          title="Ask AI Copilot"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      <Card className="shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Compliance Copilot
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-white hover:bg-emerald-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Quick Actions */}
          <div className="mb-4 space-y-2">
            <p className="text-xs text-gray-500">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "What's blocking this deal?",
                "Show overdue tasks",
                "Explain AAOIFI FAS 28"
              ].map((q) => (
                <Badge
                  key={q}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setQuery(q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="space-y-3">
            <Textarea
              placeholder="Ask about compliance, blockers, or Islamic finance standards..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <Button
              onClick={handleAsk}
              disabled={!query.trim() || loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  AI Thinking...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Ask AI
                </>
              )}
            </Button>
          </div>

          {/* Response */}
          {response && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">AI Response</span>
                <Badge variant="secondary" className="text-xs">
                  {(response.confidence * 100).toFixed(0)}% confidence
                </Badge>
              </div>

              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {response.answer}
              </p>

              {/* Citations */}
              {response.citations?.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-xs font-medium text-gray-500 mb-2">Citations:</p>
                  <div className="flex flex-wrap gap-1">
                    {response.citations.map((cite: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {cite}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {response.suggested_actions?.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-xs font-medium text-gray-500 mb-2">Suggested Actions:</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {response.suggested_actions.map((action: string, i: number) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

**Time**: 2 hours

---

#### ✅ **Task 1.4**: Add to Main Layout
**File**: `src/app/layout.tsx`

```typescript
import { AICopilot } from '@/components/ai/AICopilot'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <AICopilot />  {/* Add floating widget globally */}
      </body>
    </html>
  )
}
```

**Time**: 15 minutes

---

### Testing Tasks

#### ✅ **Task 1.5**: Manual Testing

**Test Cases**:
1. Click AI bot icon → widget opens
2. Ask "What's blocking this deal?" → get response with citations
3. Click quick question badge → auto-fills query
4. Check confidence score displays
5. Verify citations and actions render

**Time**: 1 hour

---

## Day 2 (Tuesday): Islamic Finance Knowledge Base (Mock)

### ✅ **Task 2.1**: Create Mock Knowledge Base
**File**: `backend/app/data/islamic_finance_kb.json`

```json
{
  "aaoifi_standards": [
    {
      "id": "FAS_28",
      "title": "AAOIFI FAS 28 - Murabaha and Other Deferred Payment Sales",
      "sections": [
        {
          "number": "4.2",
          "title": "Asset Ownership Transfer",
          "content": "The Islamic financial institution must own the asset before selling it to the customer. Constructive or physical possession is required.",
          "keywords": ["asset ownership", "murabaha", "possession"]
        },
        {
          "number": "5.1",
          "title": "Cost-Plus Disclosure",
          "content": "The institution must disclose the cost price and profit margin separately to the customer.",
          "keywords": ["disclosure", "cost plus", "transparency"]
        }
      ]
    },
    {
      "id": "FAS_33",
      "title": "AAOIFI FAS 33 - Investments in Sukuk",
      "sections": [
        {
          "number": "3.1",
          "title": "Asset-Backed Requirement",
          "content": "Sukuk must represent ownership in tangible assets, usufructs, or services.",
          "keywords": ["sukuk", "asset-backed", "ownership"]
        }
      ]
    }
  ],
  "shariah_structures": [
    {
      "id": "murabaha",
      "name": "Murabaha",
      "definition": "Cost-plus financing where the bank purchases an asset and sells it to the customer at cost + disclosed markup.",
      "use_cases": ["Trade finance", "Asset acquisition", "Working capital"],
      "key_requirements": ["Asset ownership", "Cost disclosure", "No interest"]
    },
    {
      "id": "wakala",
      "name": "Wakala",
      "definition": "Agency contract where one party authorizes another to act on their behalf.",
      "use_cases": ["Investment management", "Sukuk issuance"],
      "key_requirements": ["Clear agency terms", "Performance fees allowed"]
    }
  ]
}
```

**Time**: 2 hours

---

### ✅ **Task 2.2**: Enhance AI Agent with KB
**File**: Update `backend/app/services/ai_agent_service.py`

```python
import json

class AIAgentService:
    def __init__(self):
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.model = "claude-3-5-sonnet-20241022"
        self.kb = self._load_knowledge_base()

    def _load_knowledge_base(self) -> dict:
        """Load Islamic finance knowledge base"""
        kb_path = "app/data/islamic_finance_kb.json"
        with open(kb_path, 'r') as f:
            return json.load(f)

    def _build_system_prompt(self) -> str:
        """Enhanced with KB data"""
        kb_summary = self._summarize_kb()

        return f"""You are an AI compliance advisor specializing in Islamic finance.

        Knowledge Base Available:
        {kb_summary}

        Always cite specific AAOIFI/IFSB standards when answering.
        Provide actionable next steps with confidence scores.
        """

    def _summarize_kb(self) -> str:
        """Create KB summary for prompt"""
        standards = [s['title'] for s in self.kb['aaoifi_standards']]
        structures = [s['name'] for s in self.kb['shariah_structures']]

        return f"""
        AAOIFI Standards: {', '.join(standards)}
        Shariah Structures: {', '.join(structures)}

        Use this knowledge to answer questions accurately.
        """
```

**Time**: 1 hour

---

### ✅ **Task 2.3**: Test Enhanced Responses

**Test Queries**:
1. "Explain Murabaha requirements" → Should cite FAS 28 §4.2
2. "What are Sukuk asset-backing rules?" → Should cite FAS 33 §3.1
3. "Compare Wakala vs Murabaha" → Should use structure definitions

**Time**: 1 hour

---

## Day 3 (Wednesday): Deal Context Integration

### ✅ **Task 3.1**: Fetch Deal Data for Context
**File**: Update `backend/app/api/ai_copilot.py`

```python
from app.services.deal_storage import DealStorage

@router.post("/copilot", response_model=CopilotResponse)
async def ask_copilot(request: CopilotRequest):
    """Enhanced with deal context"""
    try:
        service = AIAgentService()

        # Fetch full deal context
        if request.deal_id:
            deal = DealStorage.get_deal(request.deal_id)
            if deal:
                request.context = {
                    'deal_id': deal.deal_id,
                    'deal_name': deal.deal_name,
                    'shariah_structure': deal.shariah_structure,
                    'status': deal.status,
                    'overall_completion': deal.overall_completion,
                    'shariah_compliance': deal.shariah_compliance,
                    'jurisdiction_compliance': deal.jurisdiction_compliance,
                    'accounting_compliance': deal.accounting_compliance,
                    'impact_compliance': deal.impact_compliance
                }

        result = await service.ask_copilot(request.query, request.context)
        return CopilotResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Time**: 1 hour

---

### ✅ **Task 3.2**: Add Context from Pages
**File**: `src/app/deals/[id]/page.tsx`

Update to pass deal context to AI Copilot:

```typescript
// In deal detail page, enhance AI Copilot with deal context
import { AICopilot } from '@/components/ai/AICopilot'

export default function DealDetailPage({ params }) {
  const [dealData, setDealData] = useState(null)

  // ... existing code ...

  return (
    <div>
      {/* Existing deal content */}

      {/* AI Copilot with deal context */}
      <AICopilot dealId={params.id} dealData={dealData} />
    </div>
  )
}
```

Update `AICopilot.tsx`:
```typescript
interface AICopilotProps {
  dealId?: string
  dealData?: any
}

export function AICopilot({ dealId, dealData }: AICopilotProps) {
  const handleAsk = async () => {
    // ...
    const result = await backendClient.api('/api/ai/copilot', {
      method: 'POST',
      body: JSON.stringify({
        query,
        deal_id: dealId,
        context: dealData || {}
      })
    })
    // ...
  }
}
```

**Time**: 2 hours

---

## Day 4 (Thursday): Polish & Demo Prep

### ✅ **Task 4.1**: Add Loading States

```typescript
// In AICopilot.tsx
{loading && (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <Sparkles className="h-5 w-5 text-emerald-600 animate-spin" />
      <div>
        <p className="text-sm font-medium">AI Analyzing...</p>
        <p className="text-xs text-gray-500">Consulting AAOIFI standards</p>
      </div>
    </div>
  </div>
)}
```

**Time**: 1 hour

---

### ✅ **Task 4.2**: Add Example Responses (Mock Fallback)

For demo reliability, add pre-scripted responses for common questions:

```typescript
const DEMO_RESPONSES = {
  "What's blocking this deal?": {
    answer: "This Murabaha deal has 2 blockers:\n\n1. Shariah review pending (3 days overdue)\n- Requires Dr. Ahmed's approval on asset ownership documentation\n- AAOIFI FAS 28 §4.2 requires proof of constructive possession\n\n2. Missing KYC documents for originator\n- Qatar QFC requires enhanced due diligence\n- Upload pending: beneficial ownership disclosure",
    citations: ["AAOIFI FAS 28 §4.2", "Qatar QFC Rule 3.1.2"],
    suggested_actions: [
      "1. Reassign Shariah review to Sarah (available, 95% confidence)",
      "2. Request KYC from originator via automated email",
      "3. Generate asset transfer certificate (AI can do this)"
    ],
    confidence: 0.98
  }
}

// In handleAsk:
if (DEMO_RESPONSES[query]) {
  setResponse(DEMO_RESPONSES[query])
  return
}
```

**Time**: 2 hours

---

### ✅ **Task 4.3**: Write Demo Script

**File**: `WEEK_1_DEMO_SCRIPT.md`

```markdown
# Week 1 Demo Script: AI Copilot

## Setup (30 seconds)
1. Navigate to `/deals/deal-123` (mock deal page)
2. Click AI bot icon (bottom-right)
3. Widget opens

## Demo Flow (2 minutes)

### Act 1: Ask Question (30s)
- **Say**: "Let me ask the AI what's blocking this deal"
- **Do**: Click quick question: "What's blocking this deal?"
- **Show**: Loading animation → "AI Analyzing... Consulting AAOIFI standards"
- **Result**: AI response with 2 blockers, AAOIFI citations, suggested actions

### Act 2: Explain Citations (30s)
- **Say**: "Notice the AI cites specific AAOIFI standards"
- **Do**: Hover over citation badge
- **Show**: [AAOIFI FAS 28 §4.2] highlighted
- **Say**: "This is the actual standard requiring asset ownership proof"

### Act 3: Suggested Actions (30s)
- **Say**: "The AI suggests 3 actions, ranked by impact"
- **Do**: Read suggested actions
- **Highlight**: "Reassign to Sarah (95% confidence)"
- **Say**: "It knows Sarah's availability and expertise"

### Act 4: Ask Another Question (30s)
- **Say**: "Let me ask about AAOIFI standards"
- **Do**: Type "Explain Murabaha requirements"
- **Result**: Detailed explanation with FAS 28 references

## Key Talking Points
- ✅ "AI knows Islamic finance" (AAOIFI, IFSB built-in)
- ✅ "Citations, not hallucinations" (every answer backed by standards)
- ✅ "Actionable suggestions" (not just analysis, but next steps)
- ✅ "Context-aware" (knows deal status, blockers, team capacity)
```

**Time**: 1 hour

---

## Day 5 (Friday): Testing & Documentation

### ✅ **Task 5.1**: End-to-End Testing

**Test Scenarios**:
1. ✅ AI Copilot opens/closes
2. ✅ Quick questions auto-fill
3. ✅ Custom queries work
4. ✅ Citations display correctly
5. ✅ Suggested actions render
6. ✅ Confidence scores show
7. ✅ Loading states work
8. ✅ Error handling (API down)
9. ✅ Mobile responsiveness

**Time**: 2 hours

---

### ✅ **Task 5.2**: Write Documentation

**File**: `docs/AI_COPILOT_USAGE.md`

```markdown
# AI Copilot Usage Guide

## What is it?
AI-powered compliance assistant that answers Islamic finance questions with AAOIFI/IFSB citations.

## How to use
1. Click bot icon (bottom-right on any page)
2. Ask a question or click quick question
3. Get AI answer with citations and suggested actions

## Example Questions
- "What's blocking this deal?"
- "Explain AAOIFI FAS 28 requirements"
- "Show all overdue tasks"
- "Compare Wakala vs Murabaha"

## How it works
1. User asks question
2. AI fetches deal context + Islamic finance knowledge base
3. Claude 3.5 Sonnet analyzes and responds
4. Citations extracted and displayed
5. Actions suggested based on context

## Limitations (Week 1)
- Pre-scripted responses for demo reliability
- Limited to 5 quick questions
- No conversation history (stateless)
```

**Time**: 1 hour

---

### ✅ **Task 5.3**: Record Demo Video

**Steps**:
1. Record screen following demo script
2. Highlight key features (citations, actions, confidence)
3. Add voiceover explaining AI-native approach
4. Export as MP4 (2 minutes max)

**Time**: 2 hours

---

## Sprint Deliverables

### ✅ Completed Features
- [ ] AI Copilot floating widget
- [ ] Claude 3.5 Sonnet integration
- [ ] Islamic finance knowledge base (mock)
- [ ] AAOIFI citation extraction
- [ ] Suggested actions generation
- [ ] Confidence scoring
- [ ] Quick question badges
- [ ] Deal context integration
- [ ] Demo script
- [ ] Usage documentation
- [ ] Demo video

### 📊 Success Metrics
- Response time: < 3 seconds
- Citation accuracy: 100% (AAOIFI standards)
- User engagement: 5+ questions per session
- Demo conversion: "This is amazing" feedback

---

## Dependencies

### Environment Variables
```bash
# .env.local (frontend)
NEXT_PUBLIC_API_URL=http://localhost:8000

# backend/.env
ANTHROPIC_API_KEY=sk-ant-xxx  # Required for Claude
```

### Package Installations
```bash
# Backend
pip install anthropic

# Frontend (no new deps needed)
```

---

## Risks & Mitigation

### Risk 1: LLM Response Time > 3s
**Mitigation**: Use streaming responses (Week 2 enhancement)

### Risk 2: API Rate Limits
**Mitigation**: Implement response caching for common questions

### Risk 3: Hallucinated Citations
**Mitigation**: Validate citations against knowledge base before displaying

---

## Next Week Preview (Week 2)

### Planned Features
- "Do It For Me" button (agent auto-completes tasks)
- Streaming responses for real-time typing effect
- Conversation history (multi-turn dialog)
- Task auto-assignment suggestions
- Evidence gap detection

---

**Sprint Owner**: [Your Name]
**Start Date**: [Monday]
**End Date**: [Friday]
**Status**: Ready to Execute 🚀
