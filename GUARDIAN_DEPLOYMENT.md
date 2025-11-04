# Guardian Deployment & Onboarding Documentation

**DEPLOYMENT STRATEGY: Guardian Policy Execution on Hedera Blockchain**

This document outlines how Islamic Finance Workflows are deployed to Hedera Guardian and how workflow participants are onboarded with DIDs (Decentralized Identifiers) to sign and approve their parts of the workflow.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Guardian Deployment Flow](#guardian-deployment-flow)
3. [DID & Credential Issuance](#did--credential-issuance)
4. [Participant Onboarding](#participant-onboarding)
5. [Workflow Execution Model](#workflow-execution-model)
6. [Implementation Phases](#implementation-phases)

---

## Architecture Overview

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                  Islamic Finance Workflows                   │
│                     (Next.js Frontend)                       │
│  - 12-step modular workflow UI                              │
│  - 4-component configuration (Shariah/Jurisdiction/etc.)    │
│  - AI-powered field suggestions                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ MCP Integration
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Server                        │
│                    (FastAPI + Python)                        │
│  - Guardian MCP client                                       │
│  - Policy generation from 4-component config                │
│  - Document processing & validation                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Guardian API
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Hedera Guardian                            │
│                 (Policy Execution Engine)                    │
│  - Policy Workflow Engine                                    │
│  - DID Management (W3C Decentralized Identifiers)           │
│  - Verifiable Credential Issuance                           │
│  - Role-Based Access Control                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HCS (Hedera Consensus Service)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Hedera Blockchain                          │
│  - Immutable audit trail (Consensus Service)                │
│  - Token Service (for Sukuk/asset tokens)                   │
│  - Timestamping & transaction recording                     │
│  - HashScan verification links                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Concepts

**W3C Decentralized Identifier (DID)**:
- Unique identifier for each workflow participant
- Format: `did:hedera:testnet:<public-key-hash>_<account-id>`
- Example: `did:hedera:testnet:5jDN1zBJPjjQhRDZ4MV3q5CFUVM99WvfJ3zMLLhLS2yk_0.0.7495695`
- Enables verifiable, cryptographic identity without central authority

**W3C Verifiable Credential (VC)**:
- Tamper-evident claims cryptographically signed by issuer
- Used for role assignments (Shariah Advisor, Auditor, Issuer, etc.)
- Attached to participant's DID
- Can be selectively disclosed (privacy-preserving)

**Guardian Policy**:
- BPMN-like workflow definition with:
  - Schemas (data structures for each workflow step)
  - Steps (tasks, approvals, validations)
  - Roles (who can perform which actions)
  - Rules (AAOIFI compliance checks, calculations)

---

## Guardian Deployment Flow

### Step 1: Initial Guardian Setup (One-Time)

**Prerequisite**: Guardian instance running (testnet or mainnet)

#### 1.1 Deploy Guardian Instance
```bash
# Option A: Docker deployment (recommended for development)
git clone https://github.com/hashgraph/guardian
cd guardian
docker-compose up -d

# Option B: Cloud deployment (production)
# Deploy to AWS/GCP/Azure with managed PostgreSQL + MongoDB
```

#### 1.2 Create Standard Registry Account

**Role**: Our organization acts as the **Standard Registry** (policy creator/manager)

```typescript
// Account creation flow
POST /api/v1/accounts/register
{
  "username": "IslamicFinanceRegistry",
  "password": "<secure-password>",
  "role": "STANDARD_REGISTRY"
}

// Generate Hedera credentials (or provide existing)
POST /api/v1/accounts/session
{
  "operatorId": "0.0.1234567",  // Hedera account ID
  "operatorKey": "<private-key>" // Hedera private key
}
```

**What Happens Automatically**:
1. ✅ DID created: `did:hedera:testnet:...`
2. ✅ Hedera Consensus Service (HCS) topic created
3. ✅ Verifiable Credential issued with "Standard Registry" role
4. ✅ IPFS storage configured for policy documents

### Step 2: Policy Deployment (Per Workflow Configuration)

When user completes Step 6 (Review Configuration) with validated 4-component config:

#### 2.1 Generate Guardian Policy from Configuration

**Input**: 4-component deal configuration
- Shariah Structure (e.g., Murabaha, Ijara, Sukuk)
- Jurisdiction (e.g., Malaysia, UAE, UK)
- Accounting Framework (e.g., AAOIFI FAS 33)
- Impact Metrics (e.g., ISSB S1/S2, GRI Standards)

**Backend Process**:
```python
# backend/services/guardian_policy_generator.py

async def generate_policy_from_config(deal_config: DealConfiguration):
    """
    Compose Guardian policy from 4-component configuration.

    Returns: Guardian Policy JSON with:
    - Schemas: Dynamic from component fields
    - Workflow steps: From Shariah structure requirements
    - Roles: Shariah Advisor, Auditor, Issuer, Investor, etc.
    - Validation rules: AAOIFI standards embedded
    """
    policy = {
        "name": f"{deal_config.shariah_structure.name} - {deal_config.jurisdiction.name}",
        "version": "1.0.0",
        "description": deal_config.configuration_name,
        "policyRoles": compose_roles(deal_config),
        "policyTopics": [],  # Will be created by Guardian
        "policyTokens": compose_tokens(deal_config),
        "policyGroups": compose_groups(deal_config),
        "schemas": compose_schemas(deal_config),
        "blocks": compose_workflow_blocks(deal_config)
    }

    return policy
```

#### 2.2 Deploy Policy to Guardian

**Step 8: Review Policy Structure** → User reviews generated policy → Approves

```typescript
// POST to Guardian API
POST /api/v1/policies
{
  "policyTag": "islamic-finance-murabaha-malaysia-v1",
  "name": "Murabaha Financing - Malaysia (AAOIFI FAS 33)",
  "version": "1.0.0",
  "description": "4-component modular configuration...",
  "config": <generated-policy-json>
}

// Response: Policy ID
{
  "id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "policyTag": "islamic-finance-murabaha-malaysia-v1",
  "status": "draft"
}
```

#### 2.3 Publish Policy to Blockchain

**Step 9: Test Workflow** (Dry Run) → User validates in sandbox → Passes

**Step 10: Live Execution** → User clicks "🚀 Launch Workflow on Blockchain"

```typescript
// Publish policy (makes it immutable on Hedera)
PUT /api/v1/policies/{policyId}/publish

// What happens on blockchain:
// 1. Policy JSON → IPFS
// 2. IPFS CID → Hedera Consensus Service (HCS)
// 3. Blockchain TX created: 0.0.123456@1699564800.123
// 4. HashScan link generated: https://hashscan.io/testnet/transaction/...
```

**User sees**:
```
✅ Policy Published to Hedera Blockchain
📍 Transaction: 0.0.123456@1699564800.123
🔗 [View on HashScan ↗]

Policy is now immutable and ready for workflow execution.
Proceed to invite participants and assign roles.
```

---

## DID & Credential Issuance

### How Guardian Handles DIDs

**Automatic DID Creation**: When any user creates a Guardian account, a DID is automatically generated.

```
User Registration Flow:
1. User provides: username, password, role
2. User generates Hedera credentials (or provides existing):
   - Operator ID (e.g., 0.0.7495695)
   - Operator Key (private key for signing)
3. Guardian creates:
   - DID: did:hedera:testnet:<pubkey-hash>_<operator-id>
   - DID Document (JSON-LD with public key, service endpoints)
   - Stores in MongoDB + publishes to HCS
4. Verifiable Credential issued:
   - Issuer: Standard Registry DID
   - Subject: User DID
   - Claims: { "role": "USER", "username": "..." }
   - Cryptographically signed by Standard Registry
```

### DID Document Structure

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://ns.did.ai/transmute/v1"
  ],
  "id": "did:hedera:testnet:5jDN1zBJPjjQhRDZ4MV3q5CFUVM99WvfJ3zMLLhLS2yk_0.0.7495695",
  "verificationMethod": [
    {
      "id": "did:hedera:testnet:...#did-root-key",
      "type": "Ed25519VerificationKey2018",
      "controller": "did:hedera:testnet:...",
      "publicKeyBase58": "5jDN1zBJPjjQhRDZ4MV3q5CFUVM99WvfJ3zMLLhLS2yk"
    }
  ],
  "authentication": ["did:hedera:testnet:...#did-root-key"],
  "assertionMethod": ["did:hedera:testnet:...#did-root-key"]
}
```

### Verifiable Credential Issuance for Roles

When Standard Registry assigns a role to workflow participant:

```typescript
// Example: Assign "Shariah Advisor" role
POST /api/v1/policies/{policyId}/blocks/{blockId}/approve
{
  "document": {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiableCredential", "ShariahAdvisorCredential"],
    "issuer": "did:hedera:testnet:..._0.0.1234567",  // Standard Registry
    "issuanceDate": "2025-01-04T10:30:00Z",
    "credentialSubject": {
      "id": "did:hedera:testnet:..._0.0.7495695",  // Participant
      "role": "Shariah Advisor",
      "policyId": "64a1b2c3d4e5f6g7h8i9j0k1",
      "permissions": ["approve_shariah_compliance", "validate_contracts"]
    },
    "proof": {
      "type": "Ed25519Signature2018",
      "created": "2025-01-04T10:30:00Z",
      "verificationMethod": "did:hedera:testnet:...#did-root-key",
      "proofPurpose": "assertionMethod",
      "jws": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..."
    }
  }
}
```

---

## Participant Onboarding

### Onboarding Flow Overview

```
Standard Registry (Us) → Email Invite → Participant → Guardian Account → DID Created → Role Assigned → Workflow Access
```

### Option 1: Email Invite Flow (Recommended for Production)

#### Step 1: Generate Invite Link

```typescript
// Backend API endpoint
POST /api/v1/workflows/{workflowId}/invite
{
  "email": "shariah.advisor@example.com",
  "role": "Shariah Advisor",
  "permissions": ["approve_shariah_compliance"],
  "expiresIn": "7d"  // 7 days
}

// Response: Invite token
{
  "inviteToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "inviteLink": "https://islamic-finance-workflows.com/onboard?token=...",
  "expiresAt": "2025-01-11T10:30:00Z"
}
```

#### Step 2: Send Email Invite

**Email Template**:
```html
Subject: You've been invited to approve Islamic Finance Workflow

Dear Dr. Ahmed Al-Mansouri,

You have been invited to participate as a Shariah Advisor in the following workflow:

📋 Workflow: Murabaha Financing - Malaysia (AAOIFI FAS 33)
🏢 Organization: ABC Islamic Bank
💰 Deal Size: $250M
📅 Expected Duration: 5 days

Your approval is required for Shariah compliance validation.

🔐 Secure Onboarding (One-Time Setup):
This workflow uses decentralized identity (DID) on Hedera Blockchain for
cryptographically verifiable signatures. You'll need to create a secure account.

[Get Started - Create Account →]

This link expires in 7 days.

Need help? Contact: support@islamic-finance-workflows.com

---
Powered by Hedera Blockchain
```

#### Step 3: Participant Account Creation

**User clicks link** → Redirected to onboarding wizard

**Wizard Steps**:

**Page 1: Welcome & Role Assignment**
```
✅ Your invitation has been verified

You've been invited as: Shariah Advisor
Workflow: Murabaha Financing - Malaysia
Invited by: ABC Islamic Bank

[Continue to Account Setup →]
```

**Page 2: Create Guardian Account**
```
Create Your Secure Account

Username: [____________________]
Email: shariah.advisor@example.com (pre-filled)
Password: [____________________]
Confirm: [____________________]

⚠️ Important: Your password secures your digital identity (DID)
   on Hedera Blockchain. Store it safely.

[Create Account →]
```

**Page 3: Generate Hedera Credentials**
```
Generate Blockchain Credentials

Your decentralized identity (DID) will be created on Hedera Blockchain.

Option A: Generate New Credentials (Recommended)
┌─────────────────────────────────────────────┐
│ [Generate Hedera Account & Key]             │
│                                              │
│ This creates a new Hedera account for you.  │
│ Cost: ~$1 USD (one-time, covered by us)     │
└─────────────────────────────────────────────┘

Option B: Use Existing Hedera Account
┌─────────────────────────────────────────────┐
│ Operator ID: [0.0._______]                  │
│ Operator Key: [____________________]        │
│                                              │
│ If you already have a Hedera account        │
└─────────────────────────────────────────────┘

[Continue →]
```

**Backend Process (when "Generate" clicked)**:
```python
# Backend creates Hedera account via Hedera SDK
from hedera import Client, PrivateKey, AccountCreateTransaction

async def create_hedera_account_for_user():
    client = Client.forTestnet()
    client.setOperator(TREASURY_ACCOUNT_ID, TREASURY_PRIVATE_KEY)

    # Generate new key pair
    new_key = PrivateKey.generate()

    # Create account on Hedera (costs ~$1 HBAR)
    transaction = AccountCreateTransaction() \
        .setKey(new_key.getPublicKey()) \
        .setInitialBalance(Hbar(10))  # Fund with 10 HBAR

    receipt = await transaction.execute(client)
    new_account_id = receipt.accountId

    return {
        "operatorId": str(new_account_id),  # e.g., "0.0.7495695"
        "operatorKey": new_key.toString(),  # User must save this securely
        "publicKey": new_key.getPublicKey().toString()
    }
```

**Page 4: Save Your Credentials**
```
✅ Your Blockchain Identity Created

Your Hedera Account ID: 0.0.7495695

⚠️ IMPORTANT: Save Your Private Key Securely
┌─────────────────────────────────────────────────────────────┐
│ Private Key (Operator Key):                                  │
│ 302e020100300506032b657004220420a1b2c3d4e5f6...          │
│                                                               │
│ [Download as File] [Copy to Clipboard]                      │
│                                                               │
│ ⚠️ Never share this key. It cannot be recovered if lost.    │
│ ⚠️ Store in a password manager or secure vault.             │
└─────────────────────────────────────────────────────────────┘

☑️ I have securely saved my private key

[Continue to Profile →]
```

**Page 5: DID Creation (Automatic)**
```
🔐 Creating Your Decentralized Identity...

✅ DID Created: did:hedera:testnet:5jDN1zBJPjjQ..._0.0.7495695
✅ DID Document Published to Hedera Blockchain
✅ Verifiable Credential Issued
✅ Role Assigned: Shariah Advisor

[Access Workflow →]
```

#### Step 4: Role Assignment & Policy Access

**Automatic (triggered by onboarding completion)**:
```typescript
// Backend assigns role in Guardian policy
POST /api/v1/policies/{policyId}/assign-role
{
  "userDid": "did:hedera:testnet:..._0.0.7495695",
  "role": "Shariah Advisor",
  "permissions": ["approve_shariah_compliance", "validate_contracts"]
}

// Guardian issues Verifiable Credential for this role
// (as shown in "Verifiable Credential Issuance for Roles" section above)
```

**User Dashboard Shows**:
```
✅ Onboarding Complete

Your Profile:
- Username: dr.ahmed
- DID: did:hedera:testnet:..._0.0.7495695
- Role: Shariah Advisor
- Status: Active

Assigned Workflows:
┌─────────────────────────────────────────────────────────┐
│ 📋 Murabaha Financing - Malaysia                        │
│ Status: Awaiting Your Approval (Step 4/12)             │
│ Your Action: Validate Shariah Compliance               │
│ [Review & Approve →]                                    │
└─────────────────────────────────────────────────────────┘
```

### Option 2: Pre-Provisioned Accounts (Enterprise)

For organizations with existing Guardian deployments:

```python
# Bulk create accounts for known participants
async def provision_participant_accounts(participants: List[Participant]):
    for participant in participants:
        # Create Guardian account
        account = await create_guardian_account(
            username=participant.email,
            role="USER"
        )

        # Generate Hedera credentials (or use provided)
        hedera_creds = await create_hedera_account_for_user()

        # Link to Guardian account
        await link_hedera_account(account.id, hedera_creds)

        # Send credentials via secure channel
        await send_secure_credentials_email(
            participant.email,
            account_id=account.id,
            did=account.did,
            operator_id=hedera_creds.operatorId,
            operator_key=hedera_creds.operatorKey  # Encrypted
        )
```

---

## Workflow Execution Model

### Role-Based Workflow Progression

**Example: Sukuk Issuance Workflow (12 Steps)**

```
┌─────────────────────────────────────────────────────────────────┐
│ ROLE ASSIGNMENTS (configured in Step 7: Configure Details)      │
├─────────────────────────────────────────────────────────────────┤
│ Issuer:         ABC Islamic Bank (DID: did:hedera:..._0.0.111) │
│ Shariah Board:  Dr. Ahmed Al-Mansouri (DID: ..._0.0.222)       │
│ Auditor:        XYZ Audit Firm (DID: ..._0.0.333)              │
│ Trustee:        DEF Trust Services (DID: ..._0.0.444)          │
│ Legal Counsel:  GHI Law Firm (DID: ..._0.0.555)                │
│ Investors:      Pool (multiple DIDs)                            │
└─────────────────────────────────────────────────────────────────┘

WORKFLOW EXECUTION:

Step 1: Document Submission (Issuer)
  → Issuer (DID ..._0.0.111) uploads financial statements
  → Guardian: Create VC with documents, sign with Issuer's private key
  → Publish to IPFS + HCS
  → State: "Documents Submitted" → Blockchain TX: 0.0.123@timestamp

Step 2: Shariah Compliance Review (Shariah Board)
  → Guardian notifies Shariah Board (DID ..._0.0.222)
  → Shariah Board reviews documents in UI
  → Approves/Rejects with signature (using their private key)
  → Guardian: Create VC with approval decision
  → Publish to IPFS + HCS
  → State: "Shariah Approved" → Blockchain TX: 0.0.124@timestamp

Step 3: Asset Valuation (Auditor)
  → Guardian notifies Auditor (DID ..._0.0.333)
  → Auditor validates asset valuation
  → Signs valuation report
  → Guardian: Create VC with valuation
  → Publish to IPFS + HCS
  → State: "Assets Valued" → Blockchain TX: 0.0.125@timestamp

[... Steps 4-11 follow similar pattern ...]

Step 12: Token Issuance (Automated)
  → Guardian: All approvals collected
  → Create Sukuk token on Hedera Token Service
  → Distribute to investors based on subscription
  → Final state: "Workflow Complete" → Blockchain TX: 0.0.136@timestamp

AUDIT TRAIL:
Every signature, approval, document is:
- Cryptographically signed by participant's DID
- Immutably recorded on Hedera Blockchain
- Verifiable via HashScan
- Forms complete trust chain
```

### Signature & Approval Mechanism

**When participant approves/signs**:

```typescript
// Frontend: User clicks "Approve Shariah Compliance"
// Backend handles signing with user's private key (stored securely)

async function signApproval(userId: string, documentId: string, decision: string) {
  // Get user's Hedera credentials (encrypted in DB)
  const credentials = await getUserHederaCredentials(userId)

  // Create approval payload
  const approval = {
    documentId: documentId,
    decision: decision,  // "approved" or "rejected"
    reason: "Complies with AAOIFI FAS 33",
    timestamp: new Date().toISOString(),
    signer: credentials.did
  }

  // Sign with user's private key
  const privateKey = PrivateKey.fromString(credentials.operatorKey)
  const signature = privateKey.sign(JSON.stringify(approval))

  // Submit to Guardian
  return await submitToGuardian({
    ...approval,
    signature: signature.toString()
  })
}
```

**Guardian verifies signature** using DID's public key → Creates Verifiable Credential → Publishes to blockchain

---

## Implementation Phases

### Phase 1: Mock Guardian (Current - MVP)

**Goal**: Complete UX flow with mocked Guardian responses

**Scope**:
- ✅ 12-step workflow UI completed
- ✅ Document upload integration in Step 7
- ⏳ Mock policy generation from 4-component config
- ⏳ Simulated DID/VC creation
- ⏳ Mocked blockchain transaction IDs
- ⏳ HashScan links (point to testnet examples)

**Onboarding**: Email invites → Mocked account creation → Assigned roles (no real DIDs)

**Deliverable**: Fully functional demo for user testing and investor presentations

---

### Phase 2: Real Guardian Integration (Testnet)

**Goal**: Replace mocks with real Guardian instance on Hedera Testnet

**Prerequisites**:
- Guardian instance deployed (Docker or cloud)
- Guardian MCP server configured in backend
- Hedera testnet account with HBAR for transactions

**Tasks**:
1. Deploy Guardian to testnet environment
2. Implement real policy generation API integration
3. Implement real DID creation flow
4. Implement real Verifiable Credential issuance
5. Connect onboarding flow to real Guardian accounts
6. Test complete workflow with real blockchain transactions
7. Verify HashScan links work correctly
8. Load testing (10-20 concurrent workflows)

**Onboarding**:
- Email invites trigger real Guardian account creation
- Users receive real Hedera credentials
- Real DIDs created on Hedera Blockchain
- Real VCs issued and verifiable

**Cost**: ~$1-5 USD per participant for Hedera account creation (testnet = free HBAR)

**Timeline**: 3-4 weeks after Phase 1 completion

---

### Phase 3: Production Deployment (Mainnet)

**Goal**: Production-ready platform on Hedera Mainnet

**Prerequisites**:
- Phase 2 tested and validated
- Security audit completed
- SOC 2 compliance initiated
- Multi-tenancy implemented
- Production infrastructure ready

**Additional Requirements**:
- **Hedera Mainnet Account**: Funded with HBAR for:
  - Account creation (~$1 per participant)
  - HCS message submissions (~$0.0001 per message)
  - Token creation (~$1 per token)
- **Authentication**: OAuth 2.0 / SAML for enterprise SSO
- **RBAC**: Fine-grained role-based access control
- **Audit Logging**: Complete audit trail in DB + blockchain
- **Monitoring**: Datadog/NewRelic for observability
- **Backup**: Automated backups of Guardian DB + policy configs
- **SLA**: 99.9% uptime commitment

**Onboarding**:
- Automated email invites via SendGrid/Postmark
- SMS verification for high-security roles
- Hardware wallet support (Ledger/Trezor) for storing private keys
- Optional: Custodial key management for enterprise clients

**Cost Structure**:
- **Per Participant**: $1-2 USD (Hedera account + initial HBAR)
- **Per Workflow**: $0.10-0.50 USD (HCS messages + token ops)
- **Per Month**: Infrastructure costs (~$500-2000 for Guardian + backend)

**Timeline**: 2-3 months after Phase 2 completion

---

## Summary: Answering Your Questions

### Q1: "How does Hedera Guardian do DID issuance?"

**Answer**: Automatic DID creation during account registration
- User creates Guardian account with username/password
- User generates (or provides) Hedera credentials (Operator ID + Key)
- Guardian automatically creates:
  - DID: `did:hedera:testnet:<pubkey-hash>_<operator-id>`
  - DID Document (JSON-LD with public key)
  - Publishes DID Document to Hedera Blockchain via HCS
  - Issues initial Verifiable Credential with role

**No separate DID issuance step** - it's built into account creation.

---

### Q2: "Email invites so people can get DIDs to sign?"

**Answer**: Yes, email invite flow:
1. Standard Registry (us) generates invite link with token
2. Email sent to participant (e.g., "Shariah Advisor")
3. Participant clicks link → Onboarding wizard
4. Wizard guides through:
   - Account creation (username/password)
   - Hedera credential generation (automatic, costs ~$1)
   - DID creation (automatic when credentials generated)
   - Role assignment (automatic based on invite)
5. Participant receives DID + credentials → Can now sign approvals

**Key Insight**: Email is NOT the identity mechanism (vulnerable to phishing).
- Email is just the **invitation delivery method**
- DID + cryptographic keys = actual identity
- All approvals signed with private key, verifiable via DID's public key

---

### Q3: "How should we do the onboarding and execution?"

**Recommended Approach**:

**For MVP/Demo (Phase 1)**:
- Mocked onboarding (no real DIDs)
- Pre-configured test accounts
- Simulated blockchain transactions

**For Testnet (Phase 2)**:
- Real email invite flow (as documented above)
- Automatic Hedera account creation (funded by us from treasury)
- Real DIDs created on Hedera Testnet
- Real signatures verifiable on-chain

**For Production (Phase 3)**:
- Enterprise-grade onboarding wizard
- Optional: Pre-provisioned accounts for known participants
- SMS verification for high-security roles
- Hardware wallet support for storing private keys
- Custodial options for non-technical users

**Execution Model**: Role-based workflow progression
- Each participant only sees tasks assigned to their role
- Guardian orchestrates workflow state machine
- Every action (approval, rejection, document upload) = blockchain transaction
- Complete audit trail: every signature verifiable on HashScan

---

## Next Steps

**Immediate (This Sprint)**:
1. Complete mock policy generation from 4-component config
2. Create onboarding UI mockups (wizard flow documented above)
3. Implement mocked DID/VC display in user profile

**Phase 2 Preparation**:
1. Set up Guardian testnet instance (Docker deployment)
2. Configure Guardian MCP in backend
3. Test policy deployment API
4. Implement real DID creation flow

**Documentation**:
1. Create API documentation for Guardian integration
2. Write user guide for onboarding process
3. Document troubleshooting for common Hedera/Guardian errors

---

**Document Version**: 1.0
**Last Updated**: 2025-01-04
**Author**: Islamic Finance Workflows Development Team
**References**:
- [Hedera Guardian Documentation](https://docs.hedera.com/guardian)
- [W3C DID Specification](https://www.w3.org/TR/did-core/)
- [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
