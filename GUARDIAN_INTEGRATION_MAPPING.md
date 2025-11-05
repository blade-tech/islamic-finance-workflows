# GUARDIAN INTEGRATION MAPPING
## Complete Analysis of Guardian Touchpoints Across 11-Step Workflow

**Date:** 2025-01-04
**Purpose:** Map where Guardian integration happens (or should happen) across the entire workflow journey from configuration to monitoring.

---

## EXECUTIVE SUMMARY

**Current State:** Guardian integration is **MOCK ONLY** in Step 10 (Live Execution)
**Target State:** Guardian should be integrated at **5 key phases** across the workflow

**Critical Discovery:**
- The platform has a comprehensive 11-step workflow for creating Islamic Finance compliance workflows
- Users compose deals from 4 independent components (Shariah, Jurisdiction, Accounting, Impact)
- Step 10 simulates Guardian deployment but uses **mock transaction IDs, mock DIDs, and mock policy IDs**
- Backend has NO Guardian integration yet - just stores the mock IDs passed from frontend

---

## PART 1: CURRENT WORKFLOW ARCHITECTURE

### The 11-Step Journey

```
┌─────────────────────────────────────────────────────────────────┐
│         STEP 1-5: CONFIGURATION PHASE                           │
│  User selects 4 components + Takaful overlay                    │
├─────────────────────────────────────────────────────────────────┤
│  Step 1: Connect Sources (Graphiti + AAOIFI docs)               │
│  Step 2: Select Shariah Structure (6 structures)                │
│  Step 3: Select Jurisdiction (10+ jurisdictions)                │
│  Step 4: Select Accounting (4 frameworks)                       │
│  Step 5: Select Impact Metrics (5 frameworks, multi-select)     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         STEP 6-7: VALIDATION & DETAILS PHASE                    │
│  Compose configuration + Add workflow parameters                │
├─────────────────────────────────────────────────────────────────┤
│  Step 6: Review Configuration (validation.ts validates)         │
│  Step 7: Configure Details (deal amount, participants, notes)   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         STEP 8-9: PREVIEW & TESTING PHASE                       │
│  Review Guardian policy + Dry-run simulation                    │
├─────────────────────────────────────────────────────────────────┤
│  Step 8: Review Policy Structure (MOCK policy preview)          │
│  Step 9: Test Workflow (MOCK dry-run simulation)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         STEP 10: LIVE EXECUTION (GUARDIAN DEPLOYMENT)           │
│  Deploy to Hedera Blockchain + Create Deal Record              │
├─────────────────────────────────────────────────────────────────┤
│  ⚠️  CURRENTLY MOCK IMPLEMENTATION                             │
│                                                                  │
│  Simulates:                                                      │
│  1. Generate Guardian Policy                                     │
│  2. Validate Policy Structure                                    │
│  3. Publish to IPFS (MOCK CID)                                  │
│  4. Publish to Hedera Blockchain (MOCK tx ID)                   │
│  5. Create Workflow Topic on HCS (MOCK topic ID)                │
│  6. Assign Participant Roles (MOCK DIDs)                        │
│                                                                  │
│  Then:                                                           │
│  - Calls POST /api/deals (backend) to create deal record        │
│  - Stores dealId in Zustand store for Step 11                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         STEP 11: MONITOR & COLLABORATE                          │
│  Navigate to dashboard or deal detail page                      │
├─────────────────────────────────────────────────────────────────┤
│  Shows:                                                          │
│  - Deal ID from Step 10 creation                                │
│  - Navigation options:                                           │
│    * Dashboard (view all deals)                                  │
│    * Deal Detail (/deals/{dealId})                               │
│    * Contracts AI (Phase 3)                                      │
│    * Reviews (Phase 4)                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## PART 2: CURRENT GUARDIAN INTEGRATION ANALYSIS

### 2.1 Step 10: Live Execution (Frontend)

**File:** `src/components/workflow/steps/Step10LiveExecution.tsx` (852 lines)

**Current Implementation:**

```typescript
// Lines 8-13: Explicit documentation of mock status
/**
 * MOCK IMPLEMENTATION (Phase 1 - MVP Demo):
 * - Simulates Guardian policy deployment
 * - Generates mock Hedera transaction IDs
 * - Shows mock blockchain confirmations
 * - Displays participant role assignments
 * - Provides mock HashScan links
 */

// Lines 120-125: Mock transaction ID generator
const generateMockTransactionId = (): string => {
  const accountId = `0.0.${Math.floor(100000 + Math.random() * 900000)}`
  const timestamp = `${Date.now().toString().slice(0, 10)}.${Math.floor(Math.random() * 1000000)}`
  return `${accountId}@${timestamp}`
}
// Example output: "0.0.789012@1730707200.123456"

// Lines 127-135: Mock DID generator
const generateMockDID = (): string => {
  const randomHash = Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
  const accountId = `0.0.${Math.floor(100000 + Math.random() * 900000)}`
  return `did:hedera:testnet:${randomHash}_${accountId}`
}
// Example output: "did:hedera:testnet:a3f7b9e2c5d8...1234_0.0.456789"

// Lines 194-303: Deployment simulation flow
const handleDeploy = async () => {
  // Initialize 6 deployment phases
  const phases: DeploymentPhase[] = [
    { id: 'generate', title: 'Generate Guardian Policy', ... },
    { id: 'validate', title: 'Validate Policy Structure', ... },
    { id: 'publish_ipfs', title: 'Publish to IPFS', ... },
    { id: 'publish_blockchain', title: 'Publish to Hedera Blockchain', ... },
    { id: 'create_topic', title: 'Create Workflow Topic', ... },
    { id: 'assign_roles', title: 'Assign Participant Roles', ... }
  ]

  // Simulate each phase with 2-3 second delays
  for (let i = 0; i < phases.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))

    // Generate mock data for blockchain phases
    if (phases[i].id === 'publish_blockchain') {
      transactionId = generateMockTransactionId()
      hashScanUrl = `https://hashscan.io/testnet/transaction/${transactionId}`
      setPolicyId(`policy_${Date.now()}_${Math.floor(Math.random() * 10000)}`)
    }
    else if (phases[i].id === 'create_topic') {
      transactionId = generateMockTransactionId()
      setWorkflowTopicId(transactionId.split('@')[0]) // Extract "0.0.XXXXXX"
    }
  }

  // After deployment completes, create deal record
  await createDeal()
}

// Lines 145-191: Deal creation (calls backend)
const createDeal = async () => {
  const dealData = {
    deal_name: dealConfiguration.deal_name || 'Unnamed Deal',
    shariah_structure: dealConfiguration.shariah_structure,
    jurisdiction: dealConfiguration.jurisdiction,
    accounting_standard: dealConfiguration.accounting_standard,
    impact_framework: dealConfiguration.impact_framework,
    deal_amount: dealConfiguration.deal_amount,
    currency: dealConfiguration.currency,
    originator: dealConfiguration.originator,
    guardian_policy_id: policyId || undefined,        // MOCK ID
    guardian_transaction_id: workflowTopicId || undefined, // MOCK ID
  }

  const createdDeal = await backendClient.createDeal(dealData)

  // Store dealId in Zustand for Step 11
  useWorkflowStore.setState((state) => ({
    execution: {
      ...state.execution,
      dealId: createdDeal.deal_id,
    },
  }))
}
```

**What's Mock:**
- ❌ Policy generation (just returns mock policy ID)
- ❌ IPFS upload (no actual CID)
- ❌ Hedera transaction submission (fake tx IDs)
- ❌ HCS topic creation (fake topic ID)
- ❌ Participant DID assignment (fake DIDs)
- ❌ HashScan verification (links point to testnet but with fake IDs)

**What's Real:**
- ✅ Deal record creation in backend
- ✅ Storage of deal configuration
- ✅ Navigation to Step 11 with dealId

### 2.2 Backend Deal API

**File:** `backend/app/api/deals.py` (267 lines)

**Current Implementation:**

```python
# Lines 54-98: Create deal endpoint
@router.post("", response_model=Deal, status_code=201)
async def create_deal(deal_data: DealCreate):
    """
    Create a new deal from workflow completion.

    Called by Step 10 after Guardian deployment.
    """
    try:
        deal = DealStorage.create_deal(deal_data)
        return deal
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create deal: {str(e)}")
```

**What's Mock:**
- ❌ No Guardian API client
- ❌ No Hedera SDK integration
- ❌ No policy validation
- ❌ Just accepts and stores whatever IDs frontend sends

**File:** `backend/app/services/deal_storage.py` (300 lines)

```python
# Lines 31-40: In-memory storage
class DealStorage:
    """In-memory storage for deals."""
    _deals: Dict[str, Deal] = {}  # Class-level dict

# Lines 43-82: Create deal
@classmethod
def create_deal(cls, deal_data: DealCreate) -> Deal:
    deal_id = f"deal-{uuid.uuid4()}"
    now = datetime.now()

    deal = Deal(
        deal_id=deal_id,
        created_at=now,
        updated_at=now,
        status='active',
        overall_completion=0.0,
        **deal_data.model_dump()  # Includes guardian_policy_id, guardian_transaction_id
    )

    cls._deals[deal_id] = deal  # Store in memory
    return deal
```

**What's Missing:**
- ❌ No database persistence (PostgreSQL/MongoDB)
- ❌ No Guardian event storage
- ❌ No HCS message tracking
- ❌ No VP/VC storage
- ❌ No certificate token tracking

---

## PART 3: WHERE GUARDIAN INTEGRATION SHOULD HAPPEN

### Phase 1: Policy Generation (Backend)

**When:** After Step 6 validation, before Step 8 preview

**New Backend Service:** `backend/app/services/policy_generator.py`

```python
class PolicyGenerator:
    """
    Generates Guardian policy JSON from 4-component DealConfiguration.
    """

    def generate_policy(self, deal_config: DealConfiguration) -> GuardianPolicy:
        """
        Convert 4-component configuration to Guardian policy structure.

        Steps:
        1. Load base policy template
        2. Inject Shariah structure workflows
        3. Add jurisdiction requirements
        4. Add accounting standards
        5. Add impact metrics validation
        6. Generate BPMN diagram
        7. Create schemas for VCs

        Returns:
            GuardianPolicy with complete policy definition
        """
        policy = GuardianPolicy(
            name=deal_config.configurationName,
            description=f"Islamic Finance workflow: {deal_config.shariah_structure}",
            version="1.0.0",
            topicDescription="Compliance workflow topic"
        )

        # Add roles
        policy.add_role(PolicyRole(
            id="issuer",
            name="Deal Issuer",
            permissions=["SUBMIT_DOCUMENTS", "SIGN_AGREEMENTS"]
        ))
        policy.add_role(PolicyRole(
            id="shariah_advisor",
            name="Shariah Compliance Advisor",
            permissions=["REVIEW_STRUCTURE", "ISSUE_FATWA"]
        ))

        # Add workflow steps based on 4 components
        self._add_shariah_steps(policy, deal_config.shariah_structure)
        self._add_jurisdiction_steps(policy, deal_config.jurisdiction)
        self._add_accounting_steps(policy, deal_config.accounting_standard)
        self._add_impact_steps(policy, deal_config.impact_framework)

        # Generate BPMN workflow
        policy.bpmn = self._generate_bpmn(policy)

        # Generate VC schemas for each step
        policy.schemas = self._generate_schemas(policy)

        return policy
```

**Integration Point:**

```typescript
// Frontend: Step 8 (Review Policy Structure)
// Instead of showing mock policy, fetch generated policy

const loadPolicyPreview = async () => {
  // Call backend to generate policy
  const policy = await backendClient.generatePolicy(dealConfiguration)

  // Display real Guardian policy structure
  setPolicyPreview(policy)
}
```

### Phase 2: Guardian Deployment (Backend + Frontend)

**When:** Step 10 Live Execution

**New Backend Service:** `backend/app/services/guardian_client.py`

```python
class GuardianClient:
    """
    Client for Guardian API integration.
    """

    def __init__(self, guardian_url: str, api_key: str):
        self.guardian_url = guardian_url
        self.api_key = api_key
        self.client = httpx.AsyncClient()

    async def import_policy(self, policy: GuardianPolicy) -> str:
        """
        Import policy to Guardian instance.

        Returns:
            Policy ID assigned by Guardian
        """
        response = await self.client.post(
            f"{self.guardian_url}/api/v1/policies/import",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json=policy.to_dict()
        )
        response.raise_for_status()
        return response.json()["policyId"]

    async def publish_policy(self, policy_id: str) -> HederaTransaction:
        """
        Publish policy to Hedera blockchain.

        Steps:
        1. Upload policy to IPFS
        2. Submit IPFS CID to HCS
        3. Return Hedera transaction details

        Returns:
            HederaTransaction with consensus timestamp, topic ID, sequence number
        """
        response = await self.client.post(
            f"{self.guardian_url}/api/v1/policies/{policy_id}/publish",
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        response.raise_for_status()

        data = response.json()
        return HederaTransaction(
            transaction_id=data["transactionId"],
            consensus_timestamp=data["consensusTimestamp"],
            topic_id=data["topicId"],
            sequence_number=data["sequenceNumber"],
            ipfs_cid=data["ipfsCid"]
        )

    async def create_workflow_topic(self, policy_id: str) -> str:
        """
        Create HCS topic for workflow messages.

        Returns:
            Topic ID (format: "0.0.XXXXXX")
        """
        response = await self.client.post(
            f"{self.guardian_url}/api/v1/policies/{policy_id}/topics/workflow",
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        response.raise_for_status()
        return response.json()["topicId"]

    async def assign_role(
        self,
        policy_id: str,
        user_did: str,
        role: str
    ) -> VerifiableCredential:
        """
        Assign role to participant and issue VC.

        Returns:
            Verifiable Credential for role assignment
        """
        response = await self.client.post(
            f"{self.guardian_url}/api/v1/policies/{policy_id}/roles",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json={
                "userDid": user_did,
                "role": role
            }
        )
        response.raise_for_status()
        return VerifiableCredential(**response.json())
```

**New Backend Endpoint:** `backend/app/api/guardian.py`

```python
@router.post("/api/guardian/deploy")
async def deploy_policy_to_guardian(deployment_request: GuardianDeploymentRequest):
    """
    Deploy Guardian policy to Hedera blockchain.

    This replaces the mock implementation in Step 10 frontend.

    Steps:
    1. Generate policy from deal configuration
    2. Import policy to Guardian
    3. Publish policy to Hedera (IPFS + HCS)
    4. Create workflow topic
    5. Assign participant roles
    6. Store Guardian events in database
    7. Return deployment details
    """
    guardian = GuardianClient(settings.GUARDIAN_URL, settings.GUARDIAN_API_KEY)
    hedera = HederaClient(settings.HEDERA_ACCOUNT_ID, settings.HEDERA_PRIVATE_KEY)

    # 1. Generate policy
    policy_gen = PolicyGenerator()
    policy = policy_gen.generate_policy(deployment_request.deal_configuration)

    # 2. Import to Guardian
    policy_id = await guardian.import_policy(policy)

    # 3. Publish to Hedera
    tx = await guardian.publish_policy(policy_id)

    # 4. Create workflow topic
    workflow_topic_id = await guardian.create_workflow_topic(policy_id)

    # 5. Assign participant roles
    role_vcs = []
    for participant in deployment_request.participants:
        # Create DID if not exists
        if not participant.did:
            participant.did = await hedera.create_did(participant.email)

        # Assign role
        vc = await guardian.assign_role(policy_id, participant.did, participant.role)
        role_vcs.append(vc)

    # 6. Store in database
    guardian_event = GuardianEvent(
        deal_id=deployment_request.deal_id,
        event_type="POLICY_DEPLOYED",
        policy_id=policy_id,
        transaction_id=tx.transaction_id,
        consensus_timestamp=tx.consensus_timestamp,
        topic_id=tx.topic_id,
        ipfs_cid=tx.ipfs_cid,
        workflow_topic_id=workflow_topic_id
    )
    await db.guardian_events.insert_one(guardian_event.dict())

    # 7. Return deployment details
    return GuardianDeploymentResponse(
        policy_id=policy_id,
        transaction_id=tx.transaction_id,
        consensus_timestamp=tx.consensus_timestamp,
        topic_id=tx.topic_id,
        workflow_topic_id=workflow_topic_id,
        ipfs_cid=tx.ipfs_cid,
        hashscan_url=f"https://hashscan.io/testnet/topic/{tx.topic_id}",
        participants=[
            ParticipantWithDID(
                role=p.role,
                name=p.name,
                email=p.email,
                did=p.did,
                credential_cid=vc.ipfs_cid
            )
            for p, vc in zip(deployment_request.participants, role_vcs)
        ]
    )
```

**Frontend Integration (Step 10):**

```typescript
// Replace handleDeploy() mock implementation
const handleDeploy = async () => {
  if (!dealConfiguration) return

  setIsDeploying(true)

  try {
    // Call backend Guardian deployment API
    const deploymentResponse = await backendClient.deployToGuardian({
      deal_configuration: dealConfiguration,
      participants: participants
    })

    // Update state with REAL Guardian data
    setPolicyId(deploymentResponse.policy_id)
    setWorkflowTopicId(deploymentResponse.workflow_topic_id)

    // Update participants with real DIDs
    setParticipants(deploymentResponse.participants)

    // Store Guardian event data
    setDeploymentDetails({
      transactionId: deploymentResponse.transaction_id,
      consensusTimestamp: deploymentResponse.consensus_timestamp,
      topicId: deploymentResponse.topic_id,
      ipfsCid: deploymentResponse.ipfs_cid,
      hashscanUrl: deploymentResponse.hashscan_url
    })

    setDeploymentComplete(true)

    // Create deal record with real Guardian IDs
    await createDeal()

  } catch (error) {
    console.error('Guardian deployment failed:', error)
    setDeploymentError(error.message)
  } finally {
    setIsDeploying(false)
  }
}
```

### Phase 3: Workflow Execution (Post-Deployment)

**When:** After Step 11, during deal lifecycle

**New Backend Service:** `backend/app/services/workflow_execution.py`

```python
class WorkflowExecutionService:
    """
    Handles Guardian workflow execution after deployment.
    """

    async def submit_workflow_step(
        self,
        deal_id: str,
        step_id: str,
        user_did: str,
        step_data: dict
    ) -> VerifiableCredential:
        """
        Submit workflow step to Guardian.

        Steps:
        1. Validate user has permission for this step
        2. Submit step data to Guardian
        3. Guardian creates VC for this step
        4. Guardian submits VC hash to HCS
        5. Return VC to frontend
        """
        guardian = GuardianClient()

        # Get policy ID for this deal
        deal = await db.deals.find_one({"deal_id": deal_id})
        policy_id = deal["guardian_policy_id"]

        # Submit step to Guardian
        vc = await guardian.submit_step(
            policy_id=policy_id,
            step_id=step_id,
            user_did=user_did,
            data=step_data
        )

        # Store VC in database
        await db.verifiable_credentials.insert_one({
            "deal_id": deal_id,
            "step_id": step_id,
            "vc_id": vc.id,
            "issuer": vc.issuer,
            "subject": vc.credentialSubject,
            "ipfs_cid": vc.proof.ipfsCid,
            "hcs_topic_id": vc.proof.topicId,
            "hcs_sequence": vc.proof.sequenceNumber,
            "created_at": datetime.now()
        })

        # Update deal completion percentage
        await self.recalculate_deal_completion(deal_id)

        return vc

    async def recalculate_deal_completion(self, deal_id: str):
        """
        Recalculate deal completion based on workflow steps completed.
        """
        # Get all VCs for this deal
        vcs = await db.verifiable_credentials.find({"deal_id": deal_id}).to_list()

        # Get policy to know total steps
        deal = await db.deals.find_one({"deal_id": deal_id})
        policy = await guardian.get_policy(deal["guardian_policy_id"])

        total_steps = len(policy.workflow.steps)
        completed_steps = len(vcs)

        completion_percentage = (completed_steps / total_steps) * 100

        # Update deal
        await db.deals.update_one(
            {"deal_id": deal_id},
            {"$set": {"overall_completion": completion_percentage}}
        )
```

### Phase 4: Compliance Certification (100% Completion)

**When:** Deal reaches 100% compliance across all 4 components

**New Backend Service:** `backend/app/services/certificate_service.py`

```python
class CertificateService:
    """
    Mints compliance certificates when deals reach 100% completion.
    """

    async def mint_compliance_certificate(self, deal_id: str) -> NFTCertificate:
        """
        Mint NFT compliance certificate via Guardian.

        Triggered when:
        - Shariah compliance = 100%
        - Jurisdiction compliance = 100%
        - Accounting compliance = 100%
        - Impact compliance = 100% (if applicable)

        Steps:
        1. Aggregate all VCs from workflow execution
        2. Create Verifiable Presentation (VP)
        3. Guardian mints NFT certificate token
        4. Token metadata points to VP
        5. Return certificate details
        """
        guardian = GuardianClient()

        # Get deal and verify 100% completion
        deal = await db.deals.find_one({"deal_id": deal_id})
        if deal["overall_completion"] < 100:
            raise ValueError("Deal not fully compliant")

        # Get all VCs for this deal
        vcs = await db.verifiable_credentials.find({"deal_id": deal_id}).to_list()

        # Create Verifiable Presentation
        vp = await guardian.create_vp(
            policy_id=deal["guardian_policy_id"],
            credentials=vcs,
            holder_did=deal["owner_did"]
        )

        # Mint NFT certificate
        certificate = await guardian.mint_certificate(
            policy_id=deal["guardian_policy_id"],
            vp_id=vp.id,
            deal_metadata={
                "dealId": deal_id,
                "dealName": deal["deal_name"],
                "shariahStructure": deal["shariah_structure"],
                "jurisdiction": deal["jurisdiction"],
                "accountingStandard": deal["accounting_standard"],
                "impactFramework": deal["impact_framework"],
                "certificationDate": datetime.now().isoformat()
            }
        )

        # Store certificate in database
        await db.certificates.insert_one({
            "deal_id": deal_id,
            "certificate_token_id": certificate.token_id,
            "certificate_serial": certificate.serial_number,
            "vp_id": vp.id,
            "vp_cid": vp.ipfs_cid,
            "hcs_topic_id": certificate.hcs_topic_id,
            "hcs_sequence": certificate.hcs_sequence_number,
            "minted_at": certificate.consensus_timestamp,
            "hashscan_url": f"https://hashscan.io/testnet/token/{certificate.token_id}/{certificate.serial_number}"
        })

        # Update deal status
        await db.deals.update_one(
            {"deal_id": deal_id},
            {"$set": {
                "status": "certified",
                "compliance_certificate_token_id": certificate.token_id,
                "compliance_certificate_serial": certificate.serial_number,
                "certification_date": datetime.now()
            }}
        )

        return NFTCertificate(
            token_id=certificate.token_id,
            serial_number=certificate.serial_number,
            deal_id=deal_id,
            vp_cid=vp.ipfs_cid,
            hcs_topic_id=certificate.hcs_topic_id,
            hcs_sequence=certificate.hcs_sequence_number,
            hashscan_url=f"https://hashscan.io/testnet/token/{certificate.token_id}/{certificate.serial_number}"
        )
```

### Phase 5: Post-Certification Features

**New Pages/Features After Certification:**

1. **Digital Assets Page** (`/deals/[id]/digital-assets`)
   - Display NFT compliance certificate
   - TrustChain visualization (VP → VCs → DIDs)
   - ATS sukuk tokenization integration
   - Investor management

2. **Documents Page** (`/deals/[id]/documents`)
   - On-demand document generation from audit trail
   - Shariah Board Package
   - Regulatory Report
   - Investor Package
   - Audit Evidence Bundle

3. **Analytics Dashboard** (`/analytics`)
   - Platform-wide Guardian metrics
   - Certificate issuance trends
   - HCS message volume
   - Blockchain transaction costs

---

## PART 4: COMPLETE GUARDIAN INTEGRATION ARCHITECTURE

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│  STEPS 1-7: Configuration Phase                                     │
│  Frontend collects user input → Stores in Zustand                   │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 6: Validation                                                  │
│  validation.ts validates 4-component configuration                   │
│  → Calls backend: POST /api/policies/generate                        │
│  → Backend PolicyGenerator creates Guardian policy JSON              │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 8: Review Policy Structure                                     │
│  Fetches generated policy from backend                               │
│  → GET /api/policies/{policyId}                                      │
│  → Displays REAL Guardian policy structure                           │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 9: Test Workflow                                               │
│  Dry-run simulation (future: call Guardian sandbox API)              │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 10: Live Execution                                             │
│  → POST /api/guardian/deploy                                         │
│                                                                       │
│  Backend GuardianClient:                                             │
│  1. Import policy to Guardian instance                               │
│  2. Guardian publishes to IPFS (get CID)                             │
│  3. Guardian submits to HCS (get tx ID, timestamp)                   │
│  4. Create workflow topic on HCS                                     │
│  5. Assign participant DIDs + issue role VCs                         │
│  6. Store GuardianEvent in database                                  │
│                                                                       │
│  HEDERA BLOCKCHAIN ←─ Guardian writes here                           │
│  ├─ HCS Topic (policy metadata)                                      │
│  ├─ HCS Workflow Topic (step messages)                               │
│  └─ IPFS (policy document, VCs, VPs)                                 │
│                                                                       │
│  → Returns REAL Guardian data to frontend                            │
│  → Frontend calls POST /api/deals (create deal record)               │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 11 & BEYOND: Workflow Execution                                │
│                                                                       │
│  Deal Detail Page (/deals/{dealId}):                                 │
│  - Shows workflow progress (step completion)                         │
│  - Participants submit steps via Guardian                            │
│  - Each step creates VC → stored in IPFS → hash on HCS               │
│                                                                       │
│  POST /api/deals/{dealId}/submit-step                                │
│  → GuardianClient.submit_step()                                      │
│  → Guardian validates step data                                      │
│  → Guardian creates VC                                               │
│  → Guardian submits VC hash to HCS                                   │
│  → Returns VC to frontend                                            │
│  → Backend recalculates overall_completion                           │
│                                                                       │
│  When overall_completion reaches 100%:                               │
│  → Auto-trigger POST /api/deals/{dealId}/mint-certificate           │
│  → CertificateService.mint_compliance_certificate()                 │
│  → Guardian aggregates all VCs into VP                               │
│  → Guardian mints NFT certificate token                              │
│  → Token metadata points to VP (with all VCs)                        │
│  → Certificate stored in database                                    │
│  → Deal status updated to "certified"                                │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────────┐
│  POST-CERTIFICATION: Digital Assets & Documents                      │
│                                                                       │
│  Digital Assets Page (/deals/{dealId}/digital-assets):               │
│  → GET /api/deals/{dealId}/certificate                               │
│  → Fetches NFT certificate details                                   │
│  → Fetches VP from IPFS                                              │
│  → Fetches HCS messages from Mirror Node                             │
│  → Displays TrustChain visualization                                 │
│  → ATS tokenization integration (sukuk tokens)                       │
│                                                                       │
│  Documents Page (/deals/{dealId}/documents):                         │
│  → POST /api/deals/{dealId}/generate-document                        │
│  → DocumentService reconstructs compliance history                   │
│  → Walks TrustChain: VP → parent VPs → VCs                           │
│  → Fetches HCS messages for timestamps                               │
│  → Generates PDF using WeasyPrint                                    │
│  → Returns download link                                             │
│                                                                       │
│  Analytics Dashboard (/analytics):                                   │
│  → GET /api/analytics/guardian-metrics                               │
│  → Guardian Indexer: Search VPs, VCs, relationships                  │
│  → Mirror Node: HCS message counts, tx costs                         │
│  → Visualizations: D3.js timeline, recharts metrics                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Backend Services Summary

```
backend/app/services/
├── policy_generator.py          # NEW - Generate Guardian policies from 4-component config
├── guardian_client.py            # NEW - Guardian API integration
├── hedera_client.py              # NEW - Hedera SDK (HCS, tokens, DIDs)
├── ipfs_client.py                # NEW - IPFS storage (policies, VCs, VPs)
├── workflow_execution.py         # NEW - Handle Guardian workflow steps
├── certificate_service.py        # NEW - Mint compliance certificates
├── document_service.py           # NEW - Generate documents from audit trail
├── hedera_data_aggregator.py    # NEW - Fetch data from Mirror Node + Indexer
└── deal_storage.py               # EXISTING - Upgrade to PostgreSQL
```

### Frontend Pages Summary

```
src/app/
├── page.tsx                      # EXISTING - Home (WorkflowContainer)
├── dashboard/page.tsx            # EXISTING - Main dashboard
├── deals/[id]/
│   ├── page.tsx                  # EXISTING - Deal detail (4-component view)
│   ├── digital-assets/
│   │   └── page.tsx              # NEW - Certificates + TrustChain + ATS
│   ├── documents/
│   │   └── page.tsx              # NEW - On-demand document generation
│   └── workflow/
│       └── page.tsx              # NEW - Workflow execution interface
└── analytics/
    └── page.tsx                  # NEW - Platform-wide Guardian metrics
```

---

## PART 5: IMPLEMENTATION PRIORITY MATRIX

### P0: Critical for Demo (Weeks 1-2)

| Feature | Why Critical | Complexity |
|---------|--------------|------------|
| PolicyGenerator | Converts 4-component config to Guardian policy | Medium |
| GuardianClient | Real Guardian API integration | High |
| HederaClient (HCS only) | Submit messages to blockchain | Medium |
| Step 10 real deployment | Replace mock with real Guardian calls | Medium |
| GuardianEvent storage | Track Guardian operations in database | Low |

### P1: Important for Demo (Weeks 3-4)

| Feature | Why Important | Complexity |
|---------|---------------|------------|
| Workflow execution | Allow participants to submit steps | High |
| VC/VP storage | Store credentials in database | Medium |
| Certificate minting | Mint NFT certificates at 100% | High |
| Digital Assets page | Display certificates and TrustChain | Medium |

### P2: Nice to Have (Weeks 5-6)

| Feature | Why Nice to Have | Complexity |
|---------|------------------|------------|
| Document generation | On-demand PDF generation | Medium |
| Guardian Indexer integration | Enhanced search and analytics | Medium |
| TrustChain visualization | Interactive D3.js graph | High |
| ATS integration | Sukuk tokenization | Very High |

### P3: Future Enhancements (Post-Demo)

| Feature | Notes |
|---------|-------|
| Real-time SSE for Guardian events | WebSocket alternative |
| Guardian Indexer analytics dashboard | Platform-wide metrics |
| Multi-tenancy | Separate Guardian instances per organization |
| Production deployment | Mainnet configuration |

---

## PART 6: KEY DECISIONS & OPEN QUESTIONS

### Decisions Made

1. **Guardian Integration Strategy:**
   - Backend-heavy: All Guardian API calls happen in backend
   - Frontend displays results and manages UI state only
   - Real-time updates via polling (not SSE initially)

2. **Storage Strategy:**
   - Upgrade from in-memory dict to PostgreSQL
   - Store Guardian events, VCs, VPs in separate tables
   - Keep IPFS as primary storage, database for metadata

3. **Policy Generation:**
   - 4-component config → Guardian policy JSON transformation
   - Template-based policy generation
   - Custom BPMN workflow per configuration

4. **Certificate Triggering:**
   - Auto-mint when `overall_completion` reaches 100%
   - Certificate service called automatically
   - User notified via UI update

### Open Questions

1. **Guardian Instance:**
   - Do we run our own Guardian instance?
   - Or use hosted Guardian service?
   - If hosted: which provider?

2. **Hedera Network:**
   - Start with testnet for demo?
   - When to move to mainnet?
   - Cost estimation for mainnet?

3. **DID Management:**
   - Create DIDs for users during onboarding?
   - Or create DIDs just-in-time during role assignment?
   - DID registry storage?

4. **Policy Templates:**
   - Create custom policy templates for each Shariah structure?
   - Or one generic template with dynamic fields?
   - BPMN workflow complexity?

5. **Audit Trail Depth:**
   - Store all HCS messages in database?
   - Or query Mirror Node on-demand?
   - Guardian Indexer vs. Mirror Node priority?

---

## PART 7: NEXT STEPS

### Immediate Actions (This Week)

1. ✅ Complete this mapping document
2. ⏳ Revise `DEMO_ENHANCEMENT_PLAN.md` with this understanding
3. ⏳ Create Week 1-2 implementation tasks with code examples
4. ⏳ Set up backend Guardian integration skeleton
5. ⏳ Design database schema for Guardian events

### Week 1 Focus

1. **Backend Infrastructure:**
   - Set up Hedera SDK (testnet)
   - Create Guardian API client stub
   - Create PolicyGenerator skeleton
   - Add PostgreSQL database
   - Design database schema

2. **Frontend Updates:**
   - Update Step 10 to call backend API (not mock)
   - Add loading states for real Guardian deployment
   - Handle deployment errors gracefully

3. **Testing:**
   - Set up Guardian testnet instance
   - Test policy import/publish flow
   - Validate HCS message submission

---

## APPENDIX A: CODE LOCATIONS

### Current Code (Mock Implementation)

| Feature | File | Lines |
|---------|------|-------|
| Step 10 Mock Deployment | `src/components/workflow/steps/Step10LiveExecution.tsx` | 194-303 |
| Mock Transaction IDs | Same file | 120-125 |
| Mock DID Generation | Same file | 127-135 |
| Deal Creation API | `backend/app/api/deals.py` | 54-98 |
| Deal Storage | `backend/app/services/deal_storage.py` | 43-82 |

### New Code (To Be Created)

| Service | File | Purpose |
|---------|------|---------|
| Policy Generator | `backend/app/services/policy_generator.py` | 4-component → Guardian policy |
| Guardian Client | `backend/app/services/guardian_client.py` | Guardian API wrapper |
| Hedera Client | `backend/app/services/hedera_client.py` | Hedera SDK (HCS, tokens) |
| IPFS Client | `backend/app/services/ipfs_client.py` | IPFS upload/download |
| Workflow Execution | `backend/app/services/workflow_execution.py` | Handle Guardian steps |
| Certificate Service | `backend/app/services/certificate_service.py` | Mint NFT certificates |
| Document Service | `backend/app/services/document_service.py` | Generate PDFs from audit trail |

---

## APPENDIX B: GUARDIAN POLICY STRUCTURE EXAMPLE

```json
{
  "name": "Qatar QFC Wakala Green Sukuk v1.0",
  "description": "Islamic Finance workflow: Wakala structure with QFC Sustainable Finance framework",
  "version": "1.0.0",
  "topicDescription": "Compliance workflow for Qatar QFC Wakala Green Sukuk",
  "config": {
    "fields": [
      {
        "name": "dealId",
        "title": "Deal ID",
        "description": "Unique identifier for this deal",
        "type": "string",
        "required": true
      },
      {
        "name": "dealAmount",
        "title": "Deal Amount (USD)",
        "description": "Total value of the sukuk issuance",
        "type": "number",
        "required": true
      }
    ]
  },
  "roles": [
    {
      "id": "issuer",
      "name": "Sukuk Issuer",
      "permissions": ["SUBMIT_DOCUMENTS", "SIGN_AGREEMENTS"]
    },
    {
      "id": "shariah_advisor",
      "name": "Shariah Compliance Advisor",
      "permissions": ["REVIEW_STRUCTURE", "ISSUE_FATWA"]
    },
    {
      "id": "qfc_regulator",
      "name": "QFC Authority Reviewer",
      "permissions": ["REVIEW_REGULATORY", "APPROVE_ISSUANCE"]
    },
    {
      "id": "external_auditor",
      "name": "External Auditor (AAOIFI)",
      "permissions": ["REVIEW_FINANCIALS", "ISSUE_AUDIT_REPORT"]
    },
    {
      "id": "esg_verifier",
      "name": "ESG Impact Verifier",
      "permissions": ["VERIFY_SUSTAINABILITY", "ISSUE_GREEN_CERTIFICATE"]
    }
  ],
  "workflow": {
    "steps": [
      {
        "id": "step1_shariah_structure",
        "title": "Submit Wakala Structure Documentation",
        "description": "Issuer submits wakala agreement and asset specifications",
        "role": "issuer",
        "schema": "WakalaStructureSchema",
        "uischema": "WakalaStructureUISchema"
      },
      {
        "id": "step2_shariah_review",
        "title": "Shariah Board Review",
        "description": "Shariah advisor reviews wakala structure for compliance",
        "role": "shariah_advisor",
        "schema": "ShariahReviewSchema",
        "dependsOn": ["step1_shariah_structure"]
      },
      {
        "id": "step3_jurisdiction_docs",
        "title": "Submit QFC Regulatory Documents",
        "description": "Issuer submits QFC-required documentation",
        "role": "issuer",
        "schema": "QFCRegulatorySchema",
        "dependsOn": ["step2_shariah_review"]
      },
      {
        "id": "step4_qfc_review",
        "title": "QFC Authority Review",
        "description": "QFC regulator reviews and approves issuance",
        "role": "qfc_regulator",
        "schema": "QFCApprovalSchema",
        "dependsOn": ["step3_jurisdiction_docs"]
      },
      {
        "id": "step5_aaoifi_financials",
        "title": "Submit AAOIFI Financial Statements",
        "description": "Issuer submits AAOIFI-compliant financials",
        "role": "issuer",
        "schema": "AAOIFIFinancialsSchema",
        "dependsOn": ["step4_qfc_review"]
      },
      {
        "id": "step6_audit_review",
        "title": "External Audit Review",
        "description": "Auditor reviews AAOIFI financials and issues report",
        "role": "external_auditor",
        "schema": "AuditReviewSchema",
        "dependsOn": ["step5_aaoifi_financials"]
      },
      {
        "id": "step7_esg_documentation",
        "title": "Submit ESG/Sustainability Documentation",
        "description": "Issuer submits green project documentation",
        "role": "issuer",
        "schema": "ESGDocumentationSchema",
        "dependsOn": ["step6_audit_review"]
      },
      {
        "id": "step8_esg_verification",
        "title": "ESG Impact Verification",
        "description": "ESG verifier validates sustainability claims",
        "role": "esg_verifier",
        "schema": "ESGVerificationSchema",
        "dependsOn": ["step7_esg_documentation"]
      }
    ]
  },
  "schemas": {
    "WakalaStructureSchema": {
      "$id": "#WakalaStructure",
      "title": "Wakala Structure Documentation",
      "type": "object",
      "properties": {
        "wakalaAgreement": {
          "type": "string",
          "title": "Wakala Agreement (IPFS CID)"
        },
        "underlyingAssets": {
          "type": "array",
          "title": "Underlying Assets",
          "items": {
            "type": "object",
            "properties": {
              "assetType": {"type": "string"},
              "assetValue": {"type": "number"},
              "ownershipProof": {"type": "string"}
            }
          }
        }
      }
    }
  }
}
```

---

## SUMMARY

This document provides a complete map of:

1. ✅ The existing 11-step workflow journey
2. ✅ Current Guardian integration state (mock only in Step 10)
3. ✅ Backend API analysis (no Guardian integration yet)
4. ✅ Where Guardian integration should happen (5 phases)
5. ✅ Complete data flow architecture
6. ✅ Implementation priority matrix
7. ✅ Open questions and decisions needed

**Next Action:** Revise `DEMO_ENHANCEMENT_PLAN.md` with this detailed understanding of the actual workflow journey and Guardian integration points.
