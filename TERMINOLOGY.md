# Terminology Reference for Developers

This document maps simplified user-facing terms to their technical implementations. Use this as a reference when working with the codebase to understand what non-technical labels refer to in the backend.

**Target Audience**: Non-tech-savvy Islamic Finance practitioners in Qatar (non-digital natives, traditional practitioners)

**Design Principle**: Use plain language that prioritizes clarity over technical accuracy. Avoid acronyms, blockchain jargon, and Silicon Valley terminology.

---

## User-Facing → Technical Mapping

### **Payment & Token Terms**

| User-Facing Term | Technical Term | Implementation Notes |
|-----------------|----------------|---------------------|
| **Payment Certificate** | PET (Payment Evidence Token) | HTS NFT on Hedera representing payment receipt |
| **Validation Certificate** | CoV-VC (Certificate of Validation - Verifiable Credential) | W3C VC v2.0 signed by Validator |
| **Issue** / **Issuing** | Mint / Minting | Creating tokens on Hedera Token Service |
| **Issuance Decision** | Mint Decision | Compliance approval to create token |
| **Digital Token** | HTS NFT | Hedera Token Service Non-Fungible Token |
| **Token** | HTS Token or NFT | Generic reference to Hedera tokens |

### **Blockchain & Infrastructure**

| User-Facing Term | Technical Term | Implementation Notes |
|-----------------|----------------|---------------------|
| **Blockchain Record** | HCS (Hedera Consensus Service) | Immutable audit trail with consensus timestamps |
| **Record on Blockchain** | Anchor to HCS | Submit message hash to HCS topic |
| **Token System** | HTS (Hedera Token Service) | Hedera's native token creation service |
| **Officially Timestamped** | Consensus timestamp recorded | HCS consensus timestamp |
| **Digital ID** | DID (Decentralized Identifier) | e.g., `did:hedera:testnet:buyer-001` |
| **Blockchain Explorer** | HashScan | Hedera network explorer UI |

### **Workflow & Process Terms**

| User-Facing Term | Technical Term | Implementation Notes |
|-----------------|----------------|---------------------|
| **Process** | Workflow | Business process automation |
| **Process Tracking** | Workflow Runs | Execution instances of workflows |
| **Waiting for Approval** | HITL (Human-In-The-Loop) | Requires manual approval gate |
| **Waiting** / **On Hold** | Blocked | Task/workflow paused for approval |
| **Deadline** / **Due By** | SLA (Service Level Agreement) | Time-based completion target |
| **On Time** | Within SLA | Completed before deadline |
| **Overdue** | Over SLA / SLA breach | Missed deadline |

### **AI & Automation Terms**

| User-Facing Term | Technical Term | Implementation Notes |
|-----------------|----------------|---------------------|
| **AI Assistant** | Pod (Agentic Pod) | Autonomous AI agent with specific function |
| **Document Processing Assistant** | Evidence Intake Pod | Pod #1: OCR + document validation |
| **Compliance Checking Assistant** | CCM Monitoring Pod | Pod #2: Continuous Controls Monitoring |
| **Gatekeeping Assistant** | Gatekeeping Pod | Pod #3: Precondition validation |
| **Blockchain Recording Assistant** | HCS Anchor Pod | Pod #7: Posts to Hedera Consensus Service |
| **Issuance Approval Assistant** | PET Mint Decision Pod | Pod #8: Validates token config (HITL) |
| **Token Creation Assistant** | HTS Mint & Deliver Pod | Pod #9: Mints HTS NFT and transfers |
| **AI Reasoning** / **Reasoning Steps** | AI Chain of Thought | Multi-step inference trace |
| **How AI Decided** | Chain of Thought | Step-by-step decision process |

### **Compliance & Verification Terms**

| User-Facing Term | Technical Term | Implementation Notes |
|-----------------|----------------|---------------------|
| **Identity Verification** | KYC (Know Your Customer) | Customer identity checks |
| **Customer Verification** | KYC | Alternative phrasing |
| **Anti-Money Laundering** | AML | Keep spelled out (not abbreviated) |
| **Digital Asset Rules** | DAR (Digital Asset Regulations) | QFC DAR 2024 |
| **Ongoing Compliance Check** | CCM (Continuous Controls Monitoring) | Automated control testing |
| **Token Issuer** | TSP (Token Service Provider) | Entity that mints tokens |

### **Role Names**

| User-Facing Term | Technical Term | Implementation Notes |
|-----------------|----------------|---------------------|
| **Authorization Officer** | Validator | Signs CoV-VCs, validates payments |
| **Compliance Officer** | Compliance Officer | No change (standard role) |
| **Document Manager** | Evidence Custodian | Manages payment evidence uploads |
| **Project Manager** | Project Manager | No change (standard role) |

### **UI/UX Terms**

| User-Facing Term | Technical Term | Implementation Notes |
|-----------------|----------------|---------------------|
| **Task View** | Task-First UX | V2 interface paradigm |
| **Overview Dashboard** | Big Picture Map | High-level metrics view (V2) |
| **Summary View** | Dashboard | Generic overview screen |
| **Section** / **Module** | Scene | V1 demo navigation structure |
| **Key Feature** | Showstopper | Marketing term for main highlight |
| **Documents** | Evidence Refs / Supporting Docs | Payment evidence files |
| **Settings** | Config / Configuration | Token or system configuration |

### **Status & Action Terms**

| User-Facing Term | Technical Term | Implementation Notes |
|-----------------|----------------|---------------------|
| **Being Reviewed** | In Review | Task in approval state |
| **Not Started** | To Do / Pending | Task not yet begun |
| **Waiting for Approval** | Blocked (HITL) | Task waiting for human decision |
| **Used X times** | Executed X times | Number of pod/workflow executions |
| **Average Time** | Avg Duration | Mean processing time |
| **Tasks Completed This Week** | Weekly Throughput | Processing volume metric |

### **Security & Token Controls**

| User-Facing Term | Technical Term | Implementation Notes |
|-----------------|----------------|---------------------|
| **Cannot be transferred or sold** | `freeze_default=true`, non-transferable | HTS token freeze setting |
| **Identity check** | KYC key | HTS KYC control |
| **Transfer lock** | Freeze key | HTS freeze control |
| **Emergency stop** | Pause key | HTS pause control |
| **Reversal option** | Wipe key | HTS wipe control |

---

## Specific Phrase Mappings

### Payment Certificate Workflow

| User-Facing Phrase | Technical Phrase |
|-------------------|------------------|
| "Payment Processing → Issue Payment Certificate" | "Payment Processing → PET Minting (Track A)" |
| "Step 7: Blockchain Recording Assistant" | "Pod #7: HCS Anchor Pod" |
| "Step 8: Issuance Approval (Needs Your Decision)" | "Pod #8: PET Mint Decision (HITL)" |
| "Step 9: Create & Deliver Token" | "Pod #9: HTS Mint & Deliver" |

### Compliance Checks

| User-Facing Phrase | Technical Phrase |
|-------------------|------------------|
| "Cannot be used as payment instrument" | "DAR Article 9 compliant: not a means of payment" |
| "Validation certificate matches blockchain record" | "CoV-VC hash matches HCS message" |
| "Security controls enabled: Identity check, Transfer lock, Emergency stop, Reversal option" | "KYC, Freeze, Pause, Wipe keys configured" |

### Workflow Steps

| User-Facing Phrase | Technical Phrase |
|-------------------|------------------|
| "Record on Blockchain → Issuance request created" | "Anchor to HCS → Mint request generated" |
| "Blockchain record confirmed" | "HCS anchor confirmed: Topic 0.0.12345, Sequence 100432" |
| "Collect documents from bank system" | "Automate evidence intake from banking API" |

---

## Implementation Guidelines for Developers

### 1. **Code Variables & Functions**
- Keep technical terms in code (e.g., `generatePETWorkflowTasks()`, `hcsAnchor`, `mintDecision`)
- Only user-facing strings (UI labels, descriptions) use simplified terms

### 2. **Type Definitions**
- TypeScript interfaces use technical names (e.g., `PETMintDecisionPodOutput`, `CoVVC`)
- No changes needed to type system

### 3. **API Endpoints**
- Keep REST paths technical (e.g., `/api/pet/mint`, `/api/hcs/anchor`)
- Response labels can use simplified terms if user-facing

### 4. **Comments & Documentation**
- Technical docs (this file, README) use both terms with mapping
- User-facing help text uses only simplified terms

### 5. **Logging & Debugging**
- Internal logs use technical terms for developer clarity
- User-visible error messages use simplified terms

### 6. **Database & Models**
- Keep field names technical (e.g., `cov_vc_cid`, `hcs_topic_id`, `pet_token_id`)
- Frontend display layer translates to user-facing labels

---

## Examples in Context

### Before (Technical Jargon)
```typescript
<Badge>Pod #7: HCS Anchor</Badge>
<p>Minting PET (Track A) with CoV-VC validation</p>
<Alert>Task blocked - HITL approval needed. SLA: 4 hours</Alert>
```

### After (Simplified)
```typescript
<Badge>Step 7: Blockchain Recording</Badge>
<p>Issuing Payment Certificate with Validation Certificate</p>
<Alert>Task waiting for your approval. Due in 4 hours</Alert>
```

---

## Regional Considerations

### Qatar Islamic Finance Context
- Users are compliance officers, Shariah scholars, finance managers
- Familiar with: AAOIFI, QCB, QFCRA, Ijārah, Murabaha, Istisnā'
- NOT familiar with: Blockchain, NFTs, Web3, DeFi, smart contracts
- Prefer: Traditional banking terminology over crypto jargon

### Language Notes
- English is working language for finance/compliance in Qatar
- Arabic support not required per user feedback (Q1 answered "no need")
- Some users may have British English background (Qatar was UK-influenced)

---

## Version History

- **v1.0** (2025-01-14): Initial terminology mapping for Qatar Ijārah V1 & V2
- Based on user feedback: Non-tech-savvy Islamic Finance practitioners in Qatar

---

## Quick Reference Cheat Sheet

**Top 10 Most Critical Replacements:**

1. PET → **Payment Certificate**
2. CoV-VC → **Validation Certificate**
3. HITL → **Waiting for Approval**
4. SLA → **Deadline** / **Due By**
5. Pod → **AI Assistant**
6. Mint/Minting → **Issue/Issuing**
7. HCS → **Blockchain Record**
8. HTS NFT → **Digital Token**
9. Validator → **Authorization Officer**
10. Workflow → **Process**

**When in doubt**: If a term requires explanation, it's too technical. Replace it.
