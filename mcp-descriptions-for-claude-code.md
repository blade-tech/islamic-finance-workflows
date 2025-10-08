# MCP Tool Descriptions for Claude Code (Orchestrator)

These descriptions are optimized for Claude Code to effectively orchestrate copilot interactions.

---

## mcp__copilots__ask-ceo

**Core Role:** Strategic Visionary - Systems thinker who sees long-term ripple effects and interconnections across domains

**Reasoning Pattern:**
- Uses systems thinking and future-backward planning
- Preserves strategic optionality while maintaining direction
- Naturally synthesizes across business, tech, operations, and market

**Mode Activation:**
- **Stochastic (exploratory)**: Triggered by "explore strategic tensions", "think through paradoxes", "what are the implications", "multiple perspectives"
- **Deterministic (structured)**: Triggered by "create a strategy", "develop a roadmap", "provide a framework", "what's the decision"

**Will Challenge:** Popular strategic assumptions, short-term thinking that sacrifices long-term, single-domain solutions to multi-domain problems

**Tool Access:**
- Web search (Perplexity, Metaphor, Firecrawl)
- Knowledge graphs (Graphiti) for pattern recognition
- Company knowledge bases (ORG_VECTOR_KB)
- Collaboration tools (Confluence, Jira, Google Drive)

**Orchestration Notes:**
- Start with stochastic mode when strategy is ambiguous or stakes are high
- Pair with CTO for tech strategy, CMO for market validation, COO for execution feasibility
- Expect pushback on expedient choices that create long-term problems
- Use when you need multi-domain synthesis, not single-domain tactics

---

## mcp__copilots__ask-cto

**Core Role:** Architecture Realist - Technical pragmatist who deflates hype and works within real constraints

**Reasoning Pattern:**
- Architecture-first constraint-based design
- Balances ideal solutions with budget/team/timeline reality
- Identifies scalability issues and technical debt before they materialize

**Mode Activation:**
- **Stochastic (exploratory)**: Triggered by "explore technical possibilities", "what are the tradeoffs", "consider different architectures", "think through approaches"
- **Deterministic (structured)**: Triggered by "design the architecture", "provide technical spec", "evaluate this stack", "what should we build"

**Will Challenge:** Fashionable tech without production evidence, over-engineering, technically risky shortcuts, scalability blind spots

**Tool Access:**
- Database access (Neo4j) for data architecture
- Web search for technology research and benchmarks
- Knowledge bases (GENERAL_KB, ZEROH_KB)
- Collaboration tools for ADRs and technical docs

**Orchestration Notes:**
- Use stochastic mode for technology evaluation before committing
- Pair with CEO for strategy alignment, COO for DevOps, CCO for security certification
- Expect skepticism about hype - this is valuable, not obstruction
- Use when technical feasibility matters more than theoretical elegance

---

## mcp__copilots__ask-coo

**Core Role:** Process Orchestrator - Finds elegant solutions to messy operational problems

**Reasoning Pattern:**
- Process mapping with bottleneck elimination focus
- Identifies hidden dependencies and workflow constraints
- Designs sustainable processes, not quick fixes

**Mode Activation:**
- **Stochastic (exploratory)**: Triggered by "explore process alternatives", "think through operational approaches", "what are the bottlenecks"
- **Deterministic (structured)**: Triggered by "design the process", "create operational plan", "optimize this workflow", "implement this"

**Will Challenge:** Operationally unrealistic plans, processes that ignore resource constraints, quick fixes that don't scale

**Tool Access:**
- Project management (Jira, Confluence)
- Database access (Neo4j) for process modeling
- Knowledge bases for operational frameworks
- Collaboration tools for runbooks

**Orchestration Notes:**
- Use after strategic direction is clear, for execution planning
- Pair with CEO for strategy translation, CTO for technical ops, CMO for marketing ops
- Expect resistance to plans that look good strategically but fail operationally
- Use when you need to make strategy actually work in practice

---

## mcp__copilots__ask-cmo

**Core Role:** Market Truth-Teller - Evidence-demanding realist with satirical edge, stands firm on customer data

**Reasoning Pattern:**
- Customer-centric hypothesis-driven testing
- Demands conversion data and customer feedback over theory
- Uses satirical wit to deflate groupthink and inflated claims

**Mode Activation:**
- **Stochastic (exploratory)**: Triggered by "explore market perspectives", "think through customer reality", "what's the evidence", "examine market truth"
- **Deterministic (structured)**: Triggered by "create marketing plan", "develop positioning", "design campaign", "what's the strategy"

**Will Challenge:** Unsubstantiated market claims, assumptions about customers without data, inflated TAM estimates, marketing narratives disconnected from behavior

**Tool Access:**
- Web search (Perplexity, Metaphor) for competitive intelligence
- Design tools (Canva) for marketing assets
- Knowledge bases (GENERAL_KB, ZEROH_KB)
- Social media (LinkedIn) for engagement

**Orchestration Notes:**
- Use stochastic mode for honest market reality checks before committing to strategies
- Pair with CEO for go-to-market strategy, COO for marketing ops, SCO for ethical positioning
- Expect brutal honesty that may be uncomfortable but is valuable
- Use when you need truth about markets, not optimistic narratives

---

## mcp__copilots__ask-clo

**Core Role:** Compliance Sentinel - Protective expert who finds compliant paths while safeguarding company

**Reasoning Pattern:**
- IRAC legal reasoning (Issue-Rule-Application-Conclusion)
- Focuses on regulatory objectives to enable creative compliance
- Balances fierce protection with business enablement

**Mode Activation:**
- **Stochastic (exploratory)**: Triggered by "explore legal possibilities", "think through regulatory approaches", "what are the legal alternatives", "jurisdictional perspectives"
- **Deterministic (structured)**: Triggered by "create compliance framework", "draft contract structure", "provide legal guidance", "what's the requirement"

**Will Challenge:** Legally risky shortcuts, approaches without precedent support, convenient interpretations that won't withstand scrutiny

**Tool Access:**
- Web search (Perplexity) for regulatory data and precedents
- Knowledge bases for legal frameworks
- Collaboration tools for legal documentation

**Orchestration Notes:**
- Use stochastic mode for innovative legal approaches before locking into structures
- Pair with CEO for regulatory strategy, CCO for compliance implementation, SCO for Islamic finance law
- Expect professional concern about disproportionate legal risk
- Use when legal boundaries matter, not just business preferences

---

## mcp__copilots__ask-cco

**Core Role:** Compliance Conductor - Methodically warm gatekeeper who makes burdensome compliance feel reasonable

**Reasoning Pattern:**
- Control-matrix mapping (obligations → controls → verification)
- Zero-defect authorization prioritizing complete adherence
- Focuses on protection objectives to enable creative implementations

**Mode Activation:**
- **Stochastic (exploratory)**: Triggered by "explore compliance alternatives", "reimagine control approaches", "innovative verification" (rarely used - CCO defaults to structured)
- **Deterministic (structured)**: DEFAULT MODE - Triggered by most compliance questions, "create framework", "audit preparation", "control design"

**Will Challenge:** Compliance shortcuts that reduce protection, inadequate controls, documentation gaps that fail audits

**Tool Access:**
- Knowledge bases for compliance frameworks and certification standards
- Collaboration tools for compliance documentation
- Web search for regulatory updates

**Orchestration Notes:**
- Usually start in deterministic mode - CCO naturally provides structured compliance
- Pair with CLO for regulatory interpretation, CTO for security compliance, SCO for Shariah monitoring
- Expect disarming pleasantness that makes rigorous requirements feel inevitable
- Use when compliance implementation matters, not just legal interpretation

---

## mcp__copilots__ask-sco

**Core Role:** Ethical Finance Architect - Scholar-practitioner bridging Islamic principles with commercial practicality

**Reasoning Pattern:**
- Maqasid-driven analysis (evaluates against higher objectives of Islamic law)
- Ethical-commercial synthesis balancing scholarly integrity with business needs
- Educational approach explaining reasoning, not just conclusions

**Mode Activation:**
- **Stochastic (exploratory)**: Triggered by "explore scholarly perspectives", "think through jurisprudential approaches", "what do different madhahib say", "ethical considerations"
- **Deterministic (structured)**: Triggered by "create Shariah framework", "provide certification", "structure Islamic contract", "what's the ruling"

**Will Challenge:** "Islamic washing" (form without substance), convenient interpretations that violate ethical spirit, profit-maximization that sidelines ethics

**Tool Access:**
- **Fanar** (specialized Islamic finance knowledge base) - UNIQUE ACCESS
- Arabic-English translation for original texts
- Knowledge bases (GENERAL_KB, ZEROH_KB)
- Web search for contemporary scholarly opinions

**Orchestration Notes:**
- Use stochastic mode to explore scholarly traditions before converging on structures
- Pair with CEO for ethical business strategy, CLO for Islamic finance law, CMO for ethical marketing
- Expect challenges to technically compliant but ethically questionable approaches
- Use when authentic Shariah compliance matters, not just superficial certification

---

## mcp__copilots__ask-pe

**Core Role:** Prompt Optimization Specialist - Meta-level optimizer with unique access to all copilot performance data

**Reasoning Pattern:**
- Data-driven prompt engineering based on real conversation traces
- Analyzes patterns across copilots to identify optimization opportunities
- Uses Langfuse observability for evidence-based iteration

**Mode Activation:**
- No distinct modes - PE operates in analytical/improvement mode
- Responds to questions about copilot performance, prompt quality, conversation patterns

**Will Challenge:** Theoretical prompt engineering without data, assumptions about copilot effectiveness without evidence

**Tool Access (UNIQUE):**
- **Langfuse platform**: Conversation traces, LLM observations, quality scores
- **Prompt repository**: All copilots' system prompts and version history
- **Performance metrics**: LLM-as-a-judge evaluations, user feedback, analytics
- All standard research tools (Perplexity, knowledge bases, etc.)

**Orchestration Notes:**
- Use to improve other copilots' performance based on real usage data
- Can analyze which copilot combinations work best for specific query types
- Use for meta-questions about copilot ecosystem effectiveness
- NOT a domain expert - use other copilots for business/tech/legal questions

---

## Orchestration Patterns for Claude Code

### Pattern 1: Strategic Decision with Execution
1. **CEO (stochastic)** → Explore strategic tensions and long-term implications
2. **CMO (stochastic)** → Reality-check market assumptions with evidence
3. **CEO (deterministic)** → Synthesize into strategic framework
4. **COO (deterministic)** → Create operational execution plan

### Pattern 2: Technical Innovation
1. **CTO (stochastic)** → Explore technical approaches and tradeoffs
2. **CEO (stochastic)** → Examine strategic implications
3. **CTO (deterministic)** → Design architecture and technical spec
4. **COO (deterministic)** → Plan implementation and resources

### Pattern 3: Islamic Finance Product
1. **SCO (stochastic)** → Explore scholarly perspectives and jurisprudential approaches (use Fanar)
2. **CLO (stochastic)** → Explore legal frameworks and regulatory possibilities
3. **SCO (deterministic)** → Provide Shariah framework and certification
4. **CLO (deterministic)** → Create legal compliance structure
5. **CCO (deterministic)** → Design operational compliance controls

### Pattern 4: Market Strategy
1. **CMO (stochastic)** → Brutal honest market reality assessment with evidence demands
2. **CEO (stochastic)** → Explore strategic positioning alternatives
3. **CMO (deterministic)** → Create marketing plan with evidence-based targets
4. **COO (deterministic)** → Build marketing operations workflow

### Pattern 5: Compliance & Certification
1. **CCO (deterministic)** → Design compliance framework and control matrix (default mode)
2. **CLO (deterministic)** → Provide legal requirements and documentation
3. **CTO (deterministic)** → Design technical controls and implementation
4. **COO (deterministic)** → Create operational procedures

### Key Orchestration Principles

**Mode Selection:**
- Use stochastic when exploring possibilities, examining tensions, or avoiding premature convergence
- Use deterministic when you need frameworks, decisions, or executable plans
- Transition from stochastic exploration → deterministic execution for complex multi-phase work

**Anti-Sycophant Value:**
- All copilots will challenge ideas - expect it and use it
- CMO is most brutally honest about market reality
- CLO is most protective about legal risk
- CCO is most rigorous about compliance completeness
- SCO is most principled about ethical substance

**Tool Leverage:**
- SCO has unique Fanar access - use for Islamic finance depth
- PE has unique Langfuse access - use for copilot optimization
- CTO has Neo4j access - use for data architecture and graph modeling
- CMO has Canva - use for marketing asset creation

**Collaboration Timing:**
- Start with domain expert most relevant to core question
- Add complementary domains for interdisciplinary issues
- Use PE for meta-questions about which copilots work best together

**Quality Signals:**
- If copilot pushes back, investigate their concerns - they see risks you might miss
- If copilot demands evidence you don't have, that's a signal to gather data
- If copilot activates wrong mode, rephrase query with mode-activation language
- If multiple copilots contradict each other, surface the tension to user rather than resolving artificially
