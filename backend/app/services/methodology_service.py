"""
METHODOLOGY SERVICE
==================
Manages digitized methodologies for Islamic finance workflows.

Mock Implementation:
- In-memory storage with pre-populated methodologies
- Based on Hedera Guardian framework
- Ready to swap with real Guardian integration later
"""

from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from app.models import (
    Methodology,
    MethodologyListFilters,
    MethodologyListResponse,
    MethodologyDetailResponse,
)


class MethodologyService:
    """Service for managing methodologies (mock implementation)"""

    def __init__(self):
        """Initialize with mock methodologies"""
        self._methodologies: dict[str, Methodology] = {}
        self._initialize_mock_methodologies()

    def _initialize_mock_methodologies(self):
        """Create mock methodologies for testing"""

        # Islamic Finance Methodologies
        mock_methodologies = [
            # IIFM Mudarabah
            Methodology(
                id="method-iifm-mudarabah",
                name="IIFM Mudarabah Standard (ST-14)",
                description="International Islamic Financial Market standard for Mudarabah profit-sharing partnerships. Includes contract templates, risk allocation, and profit distribution mechanisms.",
                type="islamic-finance",
                category="mudarabah",
                standard="IIFM",
                status="active",
                schema_count=8,
                policy_steps=12,
                required_roles=["Mudarib (Manager)", "Rab-ul-Mal (Investor)", "Shariah Auditor"],
                source_type="iifm",
                source_url="https://iifm.net/standards/mudarabah",
                version="2.1.0",
                created_at=datetime(2024, 1, 15, 10, 30),
                updated_at=datetime(2024, 1, 15, 10, 30),
                application_count=45,
                success_rate=0.92,
                average_validation_time=180,
            ),
            # IIFM Sukuk Al Mudarabah
            Methodology(
                id="method-iifm-sukuk-mudarabah",
                name="IIFM Sukuk Al Mudarabah (Tier 1)",
                description="Islamic bond structure based on Mudarabah partnership. Comprehensive framework for origination, issuance, and management of Sukuk Al Mudarabah.",
                type="islamic-finance",
                category="sukuk",
                standard="IIFM",
                status="active",
                schema_count=15,
                policy_steps=24,
                required_roles=["Issuer", "Trustee", "Shariah Advisor", "Rating Agency", "Investors"],
                source_type="iifm",
                source_url="https://iifm.net/standards/sukuk-mudarabah",
                version="3.0.0",
                created_at=datetime(2024, 1, 20, 14, 15),
                updated_at=datetime(2024, 2, 5, 9, 45),
                application_count=28,
                success_rate=0.89,
                average_validation_time=360,
            ),
            # AAOIFI Murabaha
            Methodology(
                id="method-aaoifi-murabaha",
                name="AAOIFI Murabaha Standard (FAS 28)",
                description="AAOIFI's Shariah standard for cost-plus financing contracts. Covers purchase, sale, and documentation requirements for Islamic trade financing.",
                type="islamic-finance",
                category="murabaha",
                standard="AAOIFI",
                status="active",
                schema_count=6,
                policy_steps=9,
                required_roles=["Seller", "Purchaser", "Shariah Committee"],
                source_type="custom",
                source_url="https://aaoifi.com/standards/murabaha",
                version="1.5.0",
                created_at=datetime(2024, 2, 1, 11, 0),
                updated_at=datetime(2024, 2, 1, 11, 0),
                application_count=67,
                success_rate=0.94,
                average_validation_time=120,
            ),
            # AAOIFI Ijara
            Methodology(
                id="method-aaoifi-ijara",
                name="AAOIFI Ijara Lease Standard",
                description="Islamic leasing methodology compliant with AAOIFI guidelines. Covers operating leases, lease-to-own, and asset-backed financing structures.",
                type="islamic-finance",
                category="ijara",
                standard="AAOIFI",
                status="active",
                schema_count=10,
                policy_steps=15,
                required_roles=["Lessor", "Lessee", "Asset Manager", "Shariah Board"],
                source_type="custom",
                version="2.0.0",
                created_at=datetime(2024, 2, 10, 13, 30),
                updated_at=datetime(2024, 2, 10, 13, 30),
                application_count=52,
                success_rate=0.91,
                average_validation_time=240,
            ),
            # Custom Musharakah
            Methodology(
                id="method-custom-musharakah",
                name="Diminishing Musharakah Partnership",
                description="Joint venture partnership with gradual ownership transfer. Commonly used for Islamic home financing and business partnerships.",
                type="islamic-finance",
                category="musharakah",
                standard="Custom",
                status="active",
                schema_count=7,
                policy_steps=11,
                required_roles=["Partner A", "Partner B", "Independent Auditor"],
                source_type="custom",
                version="1.0.0",
                created_at=datetime(2024, 2, 15, 9, 0),
                updated_at=datetime(2024, 2, 15, 9, 0),
                application_count=34,
                success_rate=0.87,
                average_validation_time=200,
            ),
            # Wakala Investment
            Methodology(
                id="method-wakala-investment",
                name="Wakala Investment Agency",
                description="Investment agency agreement where agent (Wakeel) invests funds on behalf of principal. Used in Islamic investment funds and wealth management.",
                type="islamic-finance",
                category="wakala",
                standard="IIFM",
                status="active",
                schema_count=5,
                policy_steps=8,
                required_roles=["Principal (Investor)", "Wakeel (Agent)", "Investment Committee"],
                source_type="iifm",
                version="1.2.0",
                created_at=datetime(2024, 2, 20, 10, 15),
                updated_at=datetime(2024, 2, 20, 10, 15),
                application_count=19,
                success_rate=0.93,
                average_validation_time=150,
            ),
            # Draft Example
            Methodology(
                id="method-draft-takaful",
                name="[DRAFT] Takaful Insurance Framework",
                description="Cooperative Islamic insurance model. Currently in development - requires Shariah board approval before activation.",
                type="islamic-finance",
                category="takaful",
                standard="AAOIFI",
                status="draft",
                schema_count=12,
                policy_steps=18,
                required_roles=["Participants", "Takaful Operator", "Shariah Supervisory Board", "Retakaful Provider"],
                source_type="custom",
                version="0.9.0",
                created_at=datetime(2024, 3, 1, 14, 0),
                updated_at=datetime(2024, 3, 5, 16, 30),
                application_count=0,
                success_rate=0.0,
                average_validation_time=0,
            ),
        ]

        # Store methodologies
        for methodology in mock_methodologies:
            self._methodologies[methodology.id] = methodology

    def list_methodologies(
        self, filters: Optional[MethodologyListFilters] = None
    ) -> MethodologyListResponse:
        """
        List all methodologies with optional filtering

        Args:
            filters: Optional filters for type, category, status, etc.

        Returns:
            MethodologyListResponse with filtered methodologies
        """
        methodologies = list(self._methodologies.values())

        # Apply filters if provided
        if filters:
            if filters.type:
                methodologies = [m for m in methodologies if m.type == filters.type]
            if filters.category:
                methodologies = [m for m in methodologies if m.category == filters.category]
            if filters.standard:
                methodologies = [
                    m
                    for m in methodologies
                    if m.standard and m.standard.lower() == filters.standard.lower()
                ]
            if filters.status:
                methodologies = [m for m in methodologies if m.status == filters.status]
            if filters.search:
                search_lower = filters.search.lower()
                methodologies = [
                    m
                    for m in methodologies
                    if search_lower in m.name.lower()
                    or search_lower in m.description.lower()
                ]

        # Sort by most applied
        methodologies.sort(key=lambda m: m.application_count, reverse=True)

        return MethodologyListResponse(
            methodologies=methodologies,
            total=len(methodologies),
            filters_applied=filters or MethodologyListFilters(),
        )

    def get_methodology(self, methodology_id: str) -> Optional[Methodology]:
        """
        Get a specific methodology by ID

        Args:
            methodology_id: The methodology ID

        Returns:
            Methodology if found, None otherwise
        """
        return self._methodologies.get(methodology_id)

    def get_methodology_detail(
        self, methodology_id: str
    ) -> Optional[MethodologyDetailResponse]:
        """
        Get detailed methodology information

        Args:
            methodology_id: The methodology ID

        Returns:
            MethodologyDetailResponse if found, None otherwise
        """
        methodology = self.get_methodology(methodology_id)
        if not methodology:
            return None

        return MethodologyDetailResponse(methodology=methodology)


# Global service instance
methodology_service = MethodologyService()
