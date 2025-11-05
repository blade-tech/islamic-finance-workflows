"""
MOCK GUARDIAN API ENDPOINTS
============================
Provides mock Guardian/Hedera data for UX development without real integration.

PURPOSE:
- Enable frontend development without blockchain infrastructure
- Provide realistic demo data for presentations
- Support rapid UX iteration

ENDPOINTS:
1. GET /api/mock-guardian/deals/{deal_id}/certificate - Compliance certificate
2. GET /api/mock-guardian/deals/{deal_id}/vp - Verifiable Presentation
3. GET /api/mock-guardian/deals/{deal_id}/vcs - All 4 Verifiable Credentials
4. POST /api/mock-guardian/deals/{deal_id}/generate-document - Generate document
5. GET /api/mock-guardian/analytics/platform-metrics - Platform-wide metrics
6. GET /api/mock-guardian/deals/{deal_id}/sukuk-token - Sukuk token (ATS)
7. GET /api/mock-guardian/deals/{deal_id}/complete - All mock data for a deal

MIGRATION STRATEGY:
When swapping to real Guardian integration, these endpoints will be replaced with
real Guardian API calls in separate service files (guardian_client.py, hedera_client.py, etc.)
"""

from fastapi import APIRouter, HTTPException
from typing import Literal
from datetime import datetime, timedelta
import random
import string
from pydantic import BaseModel

router = APIRouter(prefix="/api/mock-guardian", tags=["Mock Guardian"])

# ============================================================================
# RESPONSE MODELS (match TypeScript types)
# ============================================================================

class MockCertificate(BaseModel):
    token_id: str
    serial_number: int
    deal_id: str
    deal_name: str
    minted_at: str
    vp_cid: str
    hcs_topic_id: str
    hcs_sequence_number: int
    consensus_timestamp: str
    hashscan_url: str
    verification_status: dict

class MockVP(BaseModel):
    vp_id: str
    cid: str
    created_at: str
    holder_did: str
    credential_cids: list[str]
    credential_types: list[str]
    proof: dict

class MockVC(BaseModel):
    vc_id: str
    cid: str
    type: str
    issuer_did: str
    subject_did: str
    issuance_date: str
    credential_subject: dict
    proof: dict

class MockDocument(BaseModel):
    document_id: str
    document_type: str
    file_name: str
    file_size: int
    generated_at: str
    deal_id: str
    deal_name: str
    pages: int
    download_url: str
    ipfs_cid: str | None = None

class MockSukukToken(BaseModel):
    token_id: str
    token_name: str
    token_symbol: str
    total_supply: int
    decimals: int
    certificate_token_id: str
    deal_id: str
    created_at: str
    treasury_account: str
    holders_count: int
    hashscan_url: str

class GenerateDocumentRequest(BaseModel):
    document_type: Literal["compliance_report", "certificate", "audit_trail", "regulatory_filing"]

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def generate_hedera_id() -> str:
    """Generate realistic Hedera account/token ID (e.g., 0.0.123456)"""
    return f"0.0.{random.randint(100000, 999999)}"

def generate_ipfs_cid() -> str:
    """Generate realistic IPFS CID (Qm...)"""
    return "Qm" + ''.join(random.choices(string.ascii_letters + string.digits, k=44))

def generate_did() -> str:
    """Generate DID (Decentralized Identifier)"""
    method = random.choice(["hedera", "key", "web"])
    identifier = ''.join(random.choices(string.ascii_lowercase + string.digits, k=32))
    return f"did:{method}:{identifier}"

def generate_proof() -> dict:
    """Generate cryptographic proof structure"""
    return {
        "type": "Ed25519Signature2020",
        "created": (datetime.now() - timedelta(days=random.randint(1, 7))).isoformat(),
        "verification_method": generate_did() + "#key-1",
        "proof_value": ''.join(random.choices(string.ascii_lowercase + string.digits, k=64))
    }

# ============================================================================
# CERTIFICATE ENDPOINT
# ============================================================================

@router.get("/deals/{deal_id}/certificate", response_model=MockCertificate)
async def get_mock_certificate(deal_id: str):
    """
    Get mock compliance certificate for a deal.
    This simulates what would be returned from Hedera Token Service (HTS).
    """
    token_id = generate_hedera_id()
    vp_cid = generate_ipfs_cid()
    topic_id = generate_hedera_id()
    minted_date = datetime.now() - timedelta(days=random.randint(1, 7))

    return MockCertificate(
        token_id=token_id,
        serial_number=1,
        deal_id=deal_id,
        deal_name=f"Deal {deal_id}",
        minted_at=minted_date.isoformat(),
        vp_cid=vp_cid,
        hcs_topic_id=topic_id,
        hcs_sequence_number=random.randint(1000, 9999),
        consensus_timestamp=minted_date.isoformat(),
        hashscan_url=f"https://hashscan.io/testnet/token/{token_id}/1",
        verification_status={
            "vp_signature_valid": True,
            "hcs_timestamp_verified": True,
            "ipfs_accessible": True
        }
    )

# ============================================================================
# VERIFIABLE PRESENTATION ENDPOINT
# ============================================================================

@router.get("/deals/{deal_id}/vp", response_model=MockVP)
async def get_mock_vp(deal_id: str):
    """
    Get mock Verifiable Presentation (VP) for a deal.
    VP aggregates all 4 component VCs (Shariah, Jurisdiction, Accounting, Impact).
    """
    vp_cid = generate_ipfs_cid()
    credential_cids = [generate_ipfs_cid() for _ in range(4)]

    return MockVP(
        vp_id=f"vp:{deal_id}",
        cid=vp_cid,
        created_at=(datetime.now() - timedelta(days=random.randint(1, 7))).isoformat(),
        holder_did=generate_did(),
        credential_cids=credential_cids,
        credential_types=["ShariahVC", "JurisdictionVC", "AccountingVC", "ImpactVC"],
        proof=generate_proof()
    )

# ============================================================================
# VERIFIABLE CREDENTIALS ENDPOINT
# ============================================================================

@router.get("/deals/{deal_id}/vcs")
async def get_mock_vcs(deal_id: str):
    """
    Get all 4 mock Verifiable Credentials for a deal.
    Returns one VC for each component (Shariah, Jurisdiction, Accounting, Impact).
    """
    vcs = {}

    for vc_type in ["ShariahVC", "JurisdictionVC", "AccountingVC", "ImpactVC"]:
        credential_subject = {"id": generate_did()}

        # Add component-specific data
        if vc_type == "ShariahVC":
            credential_subject.update({
                "shariah_structure": "wakala",
                "shariah_compliance_status": "compliant",
                "reviewed_by": "Dr. Ahmad Al-Sharif",
                "review_date": (datetime.now() - timedelta(days=random.randint(10, 30))).isoformat()
            })
        elif vc_type == "JurisdictionVC":
            credential_subject.update({
                "jurisdiction": "qfca",
                "regulatory_status": "approved",
                "license_number": ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
            })
        elif vc_type == "AccountingVC":
            credential_subject.update({
                "accounting_framework": "AAOIFI",
                "audit_status": "passed",
                "auditor": "Ernst & Young LLP"
            })
        elif vc_type == "ImpactVC":
            credential_subject.update({
                "impact_framework": "sdg",
                "impact_score": random.randint(70, 100),
                "sdg_alignment": ["SDG 7", "SDG 9", "SDG 13"]
            })

        vc_data = MockVC(
            vc_id=f"vc:{deal_id}:{vc_type}",
            cid=generate_ipfs_cid(),
            type=vc_type,
            issuer_did=generate_did(),
            subject_did=generate_did(),
            issuance_date=(datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
            credential_subject=credential_subject,
            proof=generate_proof()
        )

        vcs[vc_type.replace("VC", "").lower()] = vc_data

    return vcs

# ============================================================================
# DOCUMENT GENERATION ENDPOINT
# ============================================================================

@router.post("/deals/{deal_id}/generate-document", response_model=MockDocument)
async def generate_mock_document(deal_id: str, request: GenerateDocumentRequest):
    """
    Generate mock document for a deal.
    In production, this would trigger document generation from HCS audit trail.
    """
    file_name = f"{request.document_type}_{deal_id}_{int(datetime.now().timestamp())}.pdf"
    pages = random.randint(5, 50)
    file_size = pages * 100000 + random.randint(-20000, 20000)

    return MockDocument(
        document_id=f"doc-{deal_id}-{request.document_type}",
        document_type=request.document_type,
        file_name=file_name,
        file_size=file_size,
        generated_at=datetime.now().isoformat(),
        deal_id=deal_id,
        deal_name=f"Deal {deal_id}",
        pages=pages,
        download_url=f"/api/mock-documents/{file_name}",
        ipfs_cid=generate_ipfs_cid() if request.document_type == "audit_trail" else None
    )

# ============================================================================
# PLATFORM ANALYTICS ENDPOINT
# ============================================================================

@router.get("/analytics/platform-metrics")
async def get_mock_platform_metrics():
    """
    Get platform-wide analytics metrics.
    In production, this would aggregate from Guardian Indexer and Mirror Node.
    """
    total_deals = random.randint(50, 200)
    compliant_deals = random.randint(int(total_deals * 0.7), total_deals)
    pending_deals = total_deals - compliant_deals

    # Certificate issuance trend (last 30 days)
    trend = []
    for i in range(29, -1, -1):
        date = datetime.now() - timedelta(days=i)
        trend.append({
            "date": date.strftime("%Y-%m-%d"),
            "certificates_issued": 0 if i == 0 else random.randint(1, 10)
        })

    # Component breakdown
    component_breakdown = {
        "shariah": {
            "total": total_deals,
            "compliant": random.randint(int(total_deals * 0.8), total_deals)
        },
        "jurisdiction": {
            "total": total_deals,
            "compliant": random.randint(int(total_deals * 0.75), total_deals)
        },
        "accounting": {
            "total": total_deals,
            "compliant": random.randint(int(total_deals * 0.85), total_deals)
        },
        "impact": {
            "total": total_deals,
            "compliant": random.randint(int(total_deals * 0.7), total_deals)
        }
    }

    # Recent activity
    activity_types = ["certificate_minted", "deal_created", "document_generated", "workflow_completed"]
    recent_activity = []

    for i in range(10):
        activity_type = random.choice(activity_types)
        deal_id_short = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        deal_name = f"Deal {deal_id_short}"

        descriptions = {
            "certificate_minted": f"Compliance certificate minted for {deal_name}",
            "deal_created": f"New deal created: {deal_name}",
            "document_generated": f"Compliance report generated for {deal_name}",
            "workflow_completed": f"Workflow execution completed for {deal_name}"
        }

        recent_activity.append({
            "activity_id": f"activity-{i}",
            "activity_type": activity_type,
            "timestamp": (datetime.now() - timedelta(hours=random.randint(1, 168))).isoformat(),
            "deal_id": f"deal-{deal_id_short}",
            "deal_name": deal_name,
            "description": descriptions[activity_type]
        })

    recent_activity.sort(key=lambda x: x["timestamp"], reverse=True)

    return {
        "overview": {
            "total_deals": total_deals,
            "compliant_deals": compliant_deals,
            "pending_deals": pending_deals,
            "total_certificates_issued": compliant_deals
        },
        "certificate_issuance_trend": trend,
        "component_breakdown": component_breakdown,
        "recent_activity": recent_activity
    }

# ============================================================================
# SUKUK TOKEN ENDPOINT (ATS Integration)
# ============================================================================

@router.get("/deals/{deal_id}/sukuk-token", response_model=MockSukukToken)
async def get_mock_sukuk_token(deal_id: str, certificate_token_id: str | None = None):
    """
    Get mock Sukuk token (Asset Tokenization Studio integration).
    Links to compliance certificate via certificate_token_id.
    """
    token_id = generate_hedera_id()
    cert_token_id = certificate_token_id or generate_hedera_id()

    return MockSukukToken(
        token_id=token_id,
        token_name=f"Sukuk Token {deal_id}",
        token_symbol=''.join(random.choices(string.ascii_uppercase, k=4)) + "SK",
        total_supply=random.randint(1000000, 100000000),
        decimals=2,
        certificate_token_id=cert_token_id,
        deal_id=deal_id,
        created_at=(datetime.now() - timedelta(days=random.randint(1, 3))).isoformat(),
        treasury_account=generate_hedera_id(),
        holders_count=random.randint(10, 500),
        hashscan_url=f"https://hashscan.io/testnet/token/{token_id}"
    )

# ============================================================================
# COMPLETE DEAL DATA ENDPOINT
# ============================================================================

@router.get("/deals/{deal_id}/complete")
async def get_complete_deal_mock_data(deal_id: str):
    """
    Get all mock data for a deal in one call (certificate, VP, VCs, documents, sukuk).
    Useful for demo initialization and testing.
    """
    certificate = await get_mock_certificate(deal_id)
    vp = await get_mock_vp(deal_id)
    vcs = await get_mock_vcs(deal_id)

    documents = {}
    for doc_type in ["compliance_report", "certificate", "audit_trail", "regulatory_filing"]:
        doc = await generate_mock_document(deal_id, GenerateDocumentRequest(document_type=doc_type))
        documents[doc_type] = doc

    sukuk_token = await get_mock_sukuk_token(deal_id, certificate.token_id)

    return {
        "certificate": certificate,
        "vp": vp,
        "vcs": vcs,
        "documents": documents,
        "sukuk_token": sukuk_token
    }
