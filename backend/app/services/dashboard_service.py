"""
DASHBOARD SERVICE
=================
Business logic for calculating compliance metrics from workflow executions.

Implements:
- Component-level compliance aggregation
- Deal configuration compliance calculation
- Monitoring card generation
- Progress calculation formulas
"""

from datetime import datetime
from typing import List, Optional, Dict
from app.models import (
    DashboardMetrics,
    ComponentCompliance,
    DealConfiguration,
    MonitoringCard,
    ComponentType,
    ComplianceStatus,
    WorkflowExecution
)


# ============================================================================
# COMPONENT SEED DATA (Initial requirements for each component type)
# ============================================================================

COMPONENT_REQUIREMENTS = {
    # Shariah Structures
    'sukuk_ijara': {
        'name': 'Sukuk Ijara',
        'total_requirements': 15,  # AAOIFI SS 62, FAS 33
        'required_evidence': 8,    # SPO opinions, asset docs, etc.
    },
    'sukuk_murabaha': {
        'name': 'Sukuk Murabaha',
        'total_requirements': 12,
        'required_evidence': 6,
    },
    'murabaha': {
        'name': 'Murabaha',
        'total_requirements': 10,
        'required_evidence': 5,
    },

    # Jurisdictions
    'uae_dfsa': {
        'name': 'UAE DFSA',
        'total_requirements': 25,  # DFSA Rulebook
        'required_evidence': 12,
    },
    'saudi_cma': {
        'name': 'Saudi Arabia CMA',
        'total_requirements': 30,  # CMA regulations
        'required_evidence': 15,
    },

    # Accounting Frameworks
    'aaoifi': {
        'name': 'AAOIFI',
        'total_requirements': 62,  # FAS 1-62
        'required_evidence': 20,
    },
    'ifrs_islamic': {
        'name': 'IFRS + Islamic',
        'total_requirements': 15,
        'required_evidence': 10,
    },

    # Impact Metrics
    'green_sukuk': {
        'name': 'Green Sukuk Standards',
        'total_requirements': 10,
        'required_evidence': 8,
    },
    'sdg': {
        'name': 'SDG Alignment',
        'total_requirements': 8,
        'required_evidence': 6,
    },
    'none': {
        'name': 'No Impact Metrics',
        'total_requirements': 0,
        'required_evidence': 0,
    },
}


class DashboardService:
    """Service for calculating dashboard metrics from execution data"""

    @staticmethod
    async def get_dashboard_overview() -> DashboardMetrics:
        """
        Calculate dashboard metrics from all deals.

        For MVP, returns mock data. In production, this would:
        1. Query all workflow executions from database
        2. Calculate component compliances
        3. Generate monitoring cards
        4. Calculate summary metrics
        """
        # MVP: Return mock data with proper structure
        # TODO: Replace with real data from database

        # Mock: 3 active deals
        mock_deals = [
            DashboardService._create_mock_deal(
                deal_id="exec-001",
                deal_name="UAE Sukuk Ijara Deal",
                shariah="sukuk_ijara",
                jurisdiction="uae_dfsa",
                accounting="aaoifi",
                impact="green_sukuk",
                overall_completion=85.0,
                status=ComplianceStatus.IN_PROGRESS
            ),
            DashboardService._create_mock_deal(
                deal_id="exec-002",
                deal_name="Saudi Murabaha Financing",
                shariah="murabaha",
                jurisdiction="saudi_cma",
                accounting="aaoifi",
                impact="none",
                overall_completion=92.0,
                status=ComplianceStatus.COMPLIANT
            ),
            DashboardService._create_mock_deal(
                deal_id="exec-003",
                deal_name="Dubai Green Sukuk",
                shariah="sukuk_murabaha",
                jurisdiction="uae_dfsa",
                accounting="ifrs_islamic",
                impact="sdg",
                overall_completion=45.0,
                status=ComplianceStatus.NEEDS_ATTENTION
            ),
        ]

        # Calculate component-level compliance (aggregated)
        shariah_compliance = await DashboardService.get_component_compliance(
            ComponentType.SHARIAH_STRUCTURE
        )
        jurisdiction_compliance = await DashboardService.get_component_compliance(
            ComponentType.JURISDICTION
        )
        accounting_compliance = await DashboardService.get_component_compliance(
            ComponentType.ACCOUNTING
        )
        impact_compliance = await DashboardService.get_component_compliance(
            ComponentType.IMPACT
        )

        # Generate monitoring cards
        contracts_card = MonitoringCard(
            title="Contracts",
            total_count=len(mock_deals),
            needs_attention_count=1,
            status=ComplianceStatus.IN_PROGRESS,
            breakdown_by_component={
                "Sukuk Ijara": 1,
                "Sukuk Murabaha": 1,
                "Murabaha": 1
            },
            last_updated=datetime.utcnow().isoformat()
        )

        shariah_reviews_card = MonitoringCard(
            title="Shariah Reviews",
            total_count=8,
            needs_attention_count=2,
            status=ComplianceStatus.NEEDS_ATTENTION,
            breakdown_by_component={
                "Pending": 2,
                "Approved": 5,
                "Rejected": 1
            },
            last_updated=datetime.utcnow().isoformat()
        )

        impact_validations_card = MonitoringCard(
            title="Impact Validations",
            total_count=5,
            needs_attention_count=0,
            status=ComplianceStatus.COMPLIANT,
            breakdown_by_component={
                "Green Standards": 2,
                "SDG Metrics": 2,
                "Not Applicable": 1
            },
            last_updated=datetime.utcnow().isoformat()
        )

        documents_card = MonitoringCard(
            title="Documents",
            total_count=45,
            needs_attention_count=3,
            status=ComplianceStatus.NEEDS_ATTENTION,
            breakdown_by_component={
                "AAOIFI Standards": 15,
                "Shariah Opinions": 8,
                "Legal Documents": 12,
                "Impact Reports": 7,
                "Missing": 3
            },
            last_updated=datetime.utcnow().isoformat()
        )

        # Calculate overall platform compliance
        overall_platform_compliance = (
            shariah_compliance.overall_completion +
            jurisdiction_compliance.overall_completion +
            accounting_compliance.overall_completion +
            impact_compliance.overall_completion
        ) / 4.0

        return DashboardMetrics(
            shariah_compliance=shariah_compliance,
            jurisdiction_compliance=jurisdiction_compliance,
            accounting_compliance=accounting_compliance,
            impact_compliance=impact_compliance,
            contracts_card=contracts_card,
            shariah_reviews_card=shariah_reviews_card,
            impact_validations_card=impact_validations_card,
            documents_card=documents_card,
            active_deals=mock_deals,
            total_deals=len(mock_deals),
            compliant_deals=len([d for d in mock_deals if d.status == ComplianceStatus.COMPLIANT]),
            deals_needing_attention=len([d for d in mock_deals if d.status == ComplianceStatus.NEEDS_ATTENTION]),
            overall_platform_compliance=overall_platform_compliance
        )

    @staticmethod
    async def get_component_compliance(
        component_type: ComponentType
    ) -> ComponentCompliance:
        """
        Get aggregated compliance for a component type.

        For MVP, returns mock aggregated data.
        In production, would aggregate across all deals using this component.
        """
        # MVP: Return mock aggregated compliance
        if component_type == ComponentType.SHARIAH_STRUCTURE:
            return ComponentCompliance(
                component_type=component_type,
                component_id="aggregated_shariah",
                component_name="All Shariah Structures",
                total_requirements=37,  # Sum of sukuk_ijara + sukuk_murabaha + murabaha
                completed_requirements=30,
                evidence_count=15,
                required_evidence_count=19,
                control_completion=81.1,  # 30/37 * 100
                evidence_completion=78.9,  # 15/19 * 100
                overall_completion=80.2,  # (81.1 * 0.6) + (78.9 * 0.4)
                status=ComplianceStatus.IN_PROGRESS,
                needs_attention_count=7,
                last_updated=datetime.utcnow().isoformat()
            )
        elif component_type == ComponentType.JURISDICTION:
            return ComponentCompliance(
                component_type=component_type,
                component_id="aggregated_jurisdiction",
                component_name="All Jurisdictions",
                total_requirements=55,  # Sum of uae_dfsa + saudi_cma
                completed_requirements=48,
                evidence_count=22,
                required_evidence_count=27,
                control_completion=87.3,  # 48/55 * 100
                evidence_completion=81.5,  # 22/27 * 100
                overall_completion=85.0,  # (87.3 * 0.6) + (81.5 * 0.4)
                status=ComplianceStatus.IN_PROGRESS,
                needs_attention_count=7,
                last_updated=datetime.utcnow().isoformat()
            )
        elif component_type == ComponentType.ACCOUNTING:
            return ComponentCompliance(
                component_type=component_type,
                component_id="aggregated_accounting",
                component_name="All Accounting Frameworks",
                total_requirements=77,  # Sum of aaoifi + ifrs_islamic
                completed_requirements=65,
                evidence_count=25,
                required_evidence_count=30,
                control_completion=84.4,  # 65/77 * 100
                evidence_completion=83.3,  # 25/30 * 100
                overall_completion=84.0,  # (84.4 * 0.6) + (83.3 * 0.4)
                status=ComplianceStatus.IN_PROGRESS,
                needs_attention_count=12,
                last_updated=datetime.utcnow().isoformat()
            )
        else:  # IMPACT
            return ComponentCompliance(
                component_type=component_type,
                component_id="aggregated_impact",
                component_name="All Impact Metrics",
                total_requirements=18,  # Sum of green_sukuk + sdg
                completed_requirements=14,
                evidence_count=11,
                required_evidence_count=14,
                control_completion=77.8,  # 14/18 * 100
                evidence_completion=78.6,  # 11/14 * 100
                overall_completion=78.1,  # (77.8 * 0.6) + (78.6 * 0.4)
                status=ComplianceStatus.IN_PROGRESS,
                needs_attention_count=4,
                last_updated=datetime.utcnow().isoformat()
            )

    @staticmethod
    async def get_deals(
        component_type: Optional[ComponentType] = None,
        component_id: Optional[str] = None
    ) -> List[DealConfiguration]:
        """
        Get all deals, optionally filtered by component.

        For MVP, returns mock deals.
        In production, would query database with filters.
        """
        # Get all mock deals
        all_deals = [
            DashboardService._create_mock_deal(
                deal_id="exec-001",
                deal_name="UAE Sukuk Ijara Deal",
                shariah="sukuk_ijara",
                jurisdiction="uae_dfsa",
                accounting="aaoifi",
                impact="green_sukuk",
                overall_completion=85.0,
                status=ComplianceStatus.IN_PROGRESS
            ),
            DashboardService._create_mock_deal(
                deal_id="exec-002",
                deal_name="Saudi Murabaha Financing",
                shariah="murabaha",
                jurisdiction="saudi_cma",
                accounting="aaoifi",
                impact="none",
                overall_completion=92.0,
                status=ComplianceStatus.COMPLIANT
            ),
            DashboardService._create_mock_deal(
                deal_id="exec-003",
                deal_name="Dubai Green Sukuk",
                shariah="sukuk_murabaha",
                jurisdiction="uae_dfsa",
                accounting="ifrs_islamic",
                impact="sdg",
                overall_completion=45.0,
                status=ComplianceStatus.NEEDS_ATTENTION
            ),
        ]

        # Apply filters if provided
        if component_type and component_id:
            filtered_deals = []
            for deal in all_deals:
                if component_type == ComponentType.SHARIAH_STRUCTURE and deal.shariah_structure == component_id:
                    filtered_deals.append(deal)
                elif component_type == ComponentType.JURISDICTION and deal.jurisdiction == component_id:
                    filtered_deals.append(deal)
                elif component_type == ComponentType.ACCOUNTING and deal.accounting == component_id:
                    filtered_deals.append(deal)
                elif component_type == ComponentType.IMPACT and deal.impact == component_id:
                    filtered_deals.append(deal)
            return filtered_deals

        return all_deals

    @staticmethod
    async def get_deal_compliance(deal_id: str) -> Optional[DealConfiguration]:
        """
        Get full compliance breakdown for a specific deal.

        For MVP, returns mock deal if ID matches.
        In production, would query database.
        """
        all_deals = await DashboardService.get_deals()
        for deal in all_deals:
            if deal.deal_id == deal_id:
                return deal
        return None

    @staticmethod
    async def get_monitoring_card_details(card_type: str) -> Dict:
        """
        Get detailed breakdown for a monitoring card.

        For MVP, returns mock detailed breakdowns.
        In production, would query database.
        """
        if card_type == 'contracts':
            return {
                "total_count": 3,
                "needs_attention_count": 1,
                "breakdown": {
                    "sukuk_ijara": 1,
                    "sukuk_murabaha": 1,
                    "murabaha": 1
                },
                "details": [
                    {"id": "exec-001", "name": "UAE Sukuk Ijara Deal", "status": "in_progress"},
                    {"id": "exec-002", "name": "Saudi Murabaha Financing", "status": "compliant"},
                    {"id": "exec-003", "name": "Dubai Green Sukuk", "status": "needs_attention"},
                ]
            }
        elif card_type == 'shariah_reviews':
            return {
                "total_count": 8,
                "needs_attention_count": 2,
                "breakdown": {
                    "pending": 2,
                    "approved": 5,
                    "rejected": 1
                },
                "details": [
                    {"review_id": "rev-001", "deal": "exec-001", "status": "pending"},
                    {"review_id": "rev-002", "deal": "exec-002", "status": "approved"},
                    {"review_id": "rev-003", "deal": "exec-003", "status": "pending"},
                ]
            }
        elif card_type == 'impact_validations':
            return {
                "total_count": 5,
                "needs_attention_count": 0,
                "breakdown": {
                    "green_standards": 2,
                    "sdg_metrics": 2,
                    "not_applicable": 1
                },
                "details": []
            }
        else:  # documents
            return {
                "total_count": 45,
                "needs_attention_count": 3,
                "breakdown": {
                    "aaoifi_standards": 15,
                    "shariah_opinions": 8,
                    "legal_documents": 12,
                    "impact_reports": 7,
                    "missing": 3
                },
                "details": []
            }

    @staticmethod
    def _create_mock_deal(
        deal_id: str,
        deal_name: str,
        shariah: str,
        jurisdiction: str,
        accounting: str,
        impact: str,
        overall_completion: float,
        status: ComplianceStatus
    ) -> DealConfiguration:
        """Helper to create mock deal configuration with component compliances"""

        # Get component requirements
        shariah_reqs = COMPONENT_REQUIREMENTS.get(shariah, {})
        jurisdiction_reqs = COMPONENT_REQUIREMENTS.get(jurisdiction, {})
        accounting_reqs = COMPONENT_REQUIREMENTS.get(accounting, {})
        impact_reqs = COMPONENT_REQUIREMENTS.get(impact, {})

        # Calculate mock compliance for each component
        shariah_compliance = DashboardService._create_mock_component_compliance(
            ComponentType.SHARIAH_STRUCTURE,
            shariah,
            shariah_reqs.get('name', shariah),
            shariah_reqs.get('total_requirements', 10),
            shariah_reqs.get('required_evidence', 5),
            completion_percentage=overall_completion
        )

        jurisdiction_compliance = DashboardService._create_mock_component_compliance(
            ComponentType.JURISDICTION,
            jurisdiction,
            jurisdiction_reqs.get('name', jurisdiction),
            jurisdiction_reqs.get('total_requirements', 20),
            jurisdiction_reqs.get('required_evidence', 10),
            completion_percentage=overall_completion
        )

        accounting_compliance = DashboardService._create_mock_component_compliance(
            ComponentType.ACCOUNTING,
            accounting,
            accounting_reqs.get('name', accounting),
            accounting_reqs.get('total_requirements', 30),
            accounting_reqs.get('required_evidence', 15),
            completion_percentage=overall_completion
        )

        impact_compliance = None
        if impact != 'none':
            impact_compliance = DashboardService._create_mock_component_compliance(
                ComponentType.IMPACT,
                impact,
                impact_reqs.get('name', impact),
                impact_reqs.get('total_requirements', 10),
                impact_reqs.get('required_evidence', 8),
                completion_percentage=overall_completion
            )

        return DealConfiguration(
            deal_id=deal_id,
            deal_name=deal_name,
            shariah_structure=shariah,
            jurisdiction=jurisdiction,
            accounting=accounting,
            impact=impact,
            takaful_enabled=False,
            shariah_compliance=shariah_compliance,
            jurisdiction_compliance=jurisdiction_compliance,
            accounting_compliance=accounting_compliance,
            impact_compliance=impact_compliance,
            overall_completion=overall_completion,
            status=status,
            created_at=datetime.utcnow().isoformat()
        )

    @staticmethod
    def _create_mock_component_compliance(
        component_type: ComponentType,
        component_id: str,
        component_name: str,
        total_requirements: int,
        required_evidence: int,
        completion_percentage: float
    ) -> ComponentCompliance:
        """Helper to create mock component compliance"""

        # Calculate completed requirements based on completion percentage
        completed_requirements = int(total_requirements * (completion_percentage / 100))
        evidence_count = int(required_evidence * (completion_percentage / 100))

        control_completion = (completed_requirements / total_requirements * 100) if total_requirements > 0 else 0
        evidence_completion = (evidence_count / required_evidence * 100) if required_evidence > 0 else 0
        overall_completion = (control_completion * 0.6) + (evidence_completion * 0.4)

        needs_attention = total_requirements - completed_requirements

        # Determine status
        if overall_completion >= 90:
            status = ComplianceStatus.COMPLIANT
        elif needs_attention > 5:
            status = ComplianceStatus.NEEDS_ATTENTION
        else:
            status = ComplianceStatus.IN_PROGRESS

        return ComponentCompliance(
            component_type=component_type,
            component_id=component_id,
            component_name=component_name,
            total_requirements=total_requirements,
            completed_requirements=completed_requirements,
            evidence_count=evidence_count,
            required_evidence_count=required_evidence,
            control_completion=control_completion,
            evidence_completion=evidence_completion,
            overall_completion=overall_completion,
            status=status,
            needs_attention_count=needs_attention,
            last_updated=datetime.utcnow().isoformat()
        )
