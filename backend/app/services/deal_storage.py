"""
DEAL STORAGE SERVICE
====================
In-memory storage for Islamic Finance deal lifecycle management.

DESIGN:
- Simple dict-based storage for demo purposes
- Thread-safe operations with Python's GIL
- Data persists during backend session only
- For production: Replace with SQLAlchemy + PostgreSQL

USAGE:
    from app.services.deal_storage import DealStorage

    # Create deal
    deal = DealStorage.create_deal(deal_create_data)

    # Get all deals
    deals = DealStorage.get_all_deals()

    # Get specific deal
    deal = DealStorage.get_deal(deal_id)
"""

import uuid
from datetime import datetime
from typing import Dict, List, Optional
from app.models import Deal, DealCreate


class DealStorage:
    """
    In-memory storage for deals.

    Class-based singleton pattern for demo purposes.
    Data is stored in a class-level dictionary.
    """

    # Class-level storage dictionary
    _deals: Dict[str, Deal] = {}

    @classmethod
    def create_deal(cls, deal_data: DealCreate) -> Deal:
        """
        Create a new deal from workflow completion.

        Args:
            deal_data: Deal creation data from workflow

        Returns:
            Created deal with generated ID and timestamps

        Example:
            >>> deal_create = DealCreate(
            ...     deal_name="QIIB Oryx Sustainability Sukuk",
            ...     shariah_structure="wakala",
            ...     jurisdiction="qatar_qfc",
            ...     accounting_standard="aaoifi",
            ...     impact_framework="qfc_sustainable"
            ... )
            >>> deal = DealStorage.create_deal(deal_create)
            >>> print(deal.deal_id)
            'deal-550e8400-e29b-41d4-a716-446655440000'
        """
        # Generate unique deal ID
        deal_id = f"deal-{uuid.uuid4()}"

        # Create Deal instance with auto-populated fields
        now = datetime.now()
        deal = Deal(
            deal_id=deal_id,
            created_at=now,
            updated_at=now,
            status='active',
            overall_completion=0.0,  # Initial completion is 0%
            **deal_data.model_dump()
        )

        # Store in memory
        cls._deals[deal_id] = deal

        return deal

    @classmethod
    def get_all_deals(cls, status: Optional[str] = None) -> List[Deal]:
        """
        Get all deals, optionally filtered by status.

        Args:
            status: Optional status filter ('draft', 'active', 'completed', 'archived')

        Returns:
            List of deals, sorted by created_at descending (newest first)

        Example:
            >>> all_deals = DealStorage.get_all_deals()
            >>> active_deals = DealStorage.get_all_deals(status='active')
        """
        deals = list(cls._deals.values())

        # Filter by status if provided
        if status:
            deals = [d for d in deals if d.status == status]

        # Sort by created_at descending (newest first)
        deals.sort(key=lambda d: d.created_at, reverse=True)

        return deals

    @classmethod
    def get_deal(cls, deal_id: str) -> Optional[Deal]:
        """
        Get a specific deal by ID.

        Args:
            deal_id: Unique deal identifier

        Returns:
            Deal if found, None otherwise

        Example:
            >>> deal = DealStorage.get_deal("deal-550e8400-e29b-41d4-a716-446655440000")
            >>> if deal:
            ...     print(f"Found: {deal.deal_name}")
            ... else:
            ...     print("Deal not found")
        """
        return cls._deals.get(deal_id)

    @classmethod
    def update_deal(cls, deal_id: str, updates: dict) -> Optional[Deal]:
        """
        Update a deal's fields.

        Args:
            deal_id: Deal to update
            updates: Dictionary of fields to update

        Returns:
            Updated deal if found, None otherwise

        Example:
            >>> deal = DealStorage.update_deal(
            ...     "deal-123",
            ...     {"status": "completed", "overall_completion": 100.0}
            ... )
        """
        deal = cls._deals.get(deal_id)
        if not deal:
            return None

        # Update fields
        for key, value in updates.items():
            if hasattr(deal, key):
                setattr(deal, key, value)

        # Update timestamp
        deal.updated_at = datetime.now()

        return deal

    @classmethod
    def delete_deal(cls, deal_id: str) -> bool:
        """
        Delete a deal from storage.

        Args:
            deal_id: Deal to delete

        Returns:
            True if deleted, False if not found

        Example:
            >>> deleted = DealStorage.delete_deal("deal-123")
            >>> if deleted:
            ...     print("Deal deleted successfully")
        """
        if deal_id in cls._deals:
            del cls._deals[deal_id]
            return True
        return False

    @classmethod
    def count_deals(cls, status: Optional[str] = None) -> int:
        """
        Count deals, optionally filtered by status.

        Args:
            status: Optional status filter

        Returns:
            Number of deals matching criteria

        Example:
            >>> total = DealStorage.count_deals()
            >>> active = DealStorage.count_deals(status='active')
        """
        if status:
            return len([d for d in cls._deals.values() if d.status == status])
        return len(cls._deals)

    @classmethod
    def clear_all(cls) -> None:
        """
        Clear all deals from storage.

        WARNING: This is irreversible in the current in-memory implementation.
        Only use for testing/demo reset purposes.

        Example:
            >>> DealStorage.clear_all()
            >>> print(DealStorage.count_deals())
            0
        """
        cls._deals.clear()

    @classmethod
    def get_storage_stats(cls) -> dict:
        """
        Get statistics about the deal storage.

        Returns:
            Dictionary with storage statistics

        Example:
            >>> stats = DealStorage.get_storage_stats()
            >>> print(f"Total deals: {stats['total_deals']}")
            >>> print(f"Active deals: {stats['active_deals']}")
        """
        all_deals = list(cls._deals.values())

        return {
            'total_deals': len(all_deals),
            'active_deals': len([d for d in all_deals if d.status == 'active']),
            'completed_deals': len([d for d in all_deals if d.status == 'completed']),
            'draft_deals': len([d for d in all_deals if d.status == 'draft']),
            'archived_deals': len([d for d in all_deals if d.status == 'archived']),
            'average_completion': sum(d.overall_completion or 0 for d in all_deals) / len(all_deals) if all_deals else 0.0
        }


# =============================================================================
# MOCK DATA FOR DEVELOPMENT
# =============================================================================

def seed_mock_deals():
    """
    Seed storage with mock deals for testing/demo purposes.

    Call this function to populate the storage with realistic demo data.
    Useful for testing the dashboard without completing workflows.

    Example:
        >>> from app.services.deal_storage import seed_mock_deals
        >>> seed_mock_deals()
        >>> deals = DealStorage.get_all_deals()
        >>> print(f"Seeded {len(deals)} mock deals")
    """
    # Clear existing data first
    DealStorage.clear_all()

    # Create deals with digital asset data
    # Deal 1: QIIB Oryx - Complete with certificate and token
    deal1 = DealStorage.create_deal(DealCreate(
        deal_name="QIIB Oryx Fund - Phase 1 (Green Sukuk Ijara)",
        shariah_structure="wakala",
        jurisdiction="qatar_qfc",
        accounting_standard="aaoifi",
        impact_framework="qfc_sustainable",
        deal_amount=500000000.0,
        currency="USD",
        originator="Qatar International Islamic Bank",
        guardian_policy_id="policy_qfc_wakala_v1",
        guardian_transaction_id="0.0.123456@1730707200.0"
    ))
    DealStorage.update_deal(deal1.deal_id, {
        "has_certificate": True,
        "certificate_id": "GC-2024-001-QIIB-ORYX",
        "certificate_status": "issued",
        "has_token": True,
        "token_id": "0.0.4929427",
        "token_name": "QIIB Oryx Green Sukuk",
        "token_symbol": "QIIB-ORYX",
        "total_supply": 50000000,
        "holders_count": 127
    })

    # Deal 2: Dubai Islamic Bank - Complete with certificate and token
    deal2 = DealStorage.create_deal(DealCreate(
        deal_name="Dubai Islamic Bank Murabaha Facility",
        shariah_structure="murabaha",
        jurisdiction="uae_difc",
        accounting_standard="ifrs",
        impact_framework=None,
        deal_amount=250000000.0,
        currency="AED",
        originator="Dubai Islamic Bank",
        guardian_policy_id="policy_difc_murabaha_v1",
        guardian_transaction_id="0.0.789012@1730793600.0"
    ))
    DealStorage.update_deal(deal2.deal_id, {
        "has_certificate": True,
        "certificate_id": "GC-2024-002-DIB-MURABAHA",
        "certificate_status": "issued",
        "has_token": True,
        "token_id": "0.0.5123456",
        "token_name": "DIB Murabaha Notes",
        "token_symbol": "DIB-MRB",
        "total_supply": 25000000,
        "holders_count": 89
    })

    # Deal 3: Abu Dhabi Sovereign - Complete with certificate and token
    deal3 = DealStorage.create_deal(DealCreate(
        deal_name="Abu Dhabi Sovereign Wakala (Infrastructure)",
        shariah_structure="wakala",
        jurisdiction="uae_adgm",
        accounting_standard="aaoifi",
        impact_framework="un_sdgs",
        deal_amount=1000000000.0,
        currency="USD",
        originator="Abu Dhabi Government",
        guardian_policy_id="policy_adgm_wakala_v1",
        guardian_transaction_id="0.0.234567@1730880000.0"
    ))
    DealStorage.update_deal(deal3.deal_id, {
        "has_certificate": True,
        "certificate_id": "GC-2024-003-ADGOV-WAKALA",
        "certificate_status": "issued",
        "has_token": True,
        "token_id": "0.0.5234567",
        "token_name": "ADGOV Wakala Certificates",
        "token_symbol": "ADGOV-WKL",
        "total_supply": 100000000,
        "holders_count": 342
    })

    # Deal 4: Saudi Aramco - Certificate only (not tokenized yet)
    deal4 = DealStorage.create_deal(DealCreate(
        deal_name="Saudi Aramco Green Sukuk Istisna",
        shariah_structure="istisna",
        jurisdiction="saudi_cma",
        accounting_standard="aaoifi",
        impact_framework="green_sukuk",
        deal_amount=750000000.0,
        currency="SAR",
        originator="Saudi Aramco",
        guardian_policy_id="policy_cma_istisna_v1",
        guardian_transaction_id="0.0.345678@1730966400.0"
    ))
    DealStorage.update_deal(deal4.deal_id, {
        "has_certificate": True,
        "certificate_id": "GC-2024-004-ARAMCO-ISTISNA",
        "certificate_status": "issued",
        "has_token": False
    })

    # Deal 5: Malaysia - Complete with certificate and token
    deal5 = DealStorage.create_deal(DealCreate(
        deal_name="Malaysia Sustainable Sukuk Musharaka",
        shariah_structure="musharaka",
        jurisdiction="malaysia_sc",
        accounting_standard="aaoifi",
        impact_framework="un_sdgs",
        deal_amount=300000000.0,
        currency="MYR",
        originator="Malaysian Government",
        guardian_policy_id="policy_malaysia_musharaka_v1",
        guardian_transaction_id="0.0.456789@1731052800.0"
    ))
    DealStorage.update_deal(deal5.deal_id, {
        "has_certificate": True,
        "certificate_id": "GC-2024-005-MYS-MUSHARAKA",
        "certificate_status": "issued",
        "has_token": True,
        "token_id": "0.0.5345678",
        "token_name": "Malaysia Musharaka Sukuk",
        "token_symbol": "MYS-MSH",
        "total_supply": 75000000,
        "holders_count": 215
    })

    # Deal 6: Kuwait - Pending (no certificate or token yet)
    deal6 = DealStorage.create_deal(DealCreate(
        deal_name="Kuwait Finance House Hybrid Sukuk",
        shariah_structure="hybrid",
        jurisdiction="kuwait_cma",
        accounting_standard="aaoifi",
        impact_framework=None,
        deal_amount=150000000.0,
        currency="KWD",
        originator="Kuwait Finance House",
        guardian_policy_id=None,
        guardian_transaction_id=None
    ))
    DealStorage.update_deal(deal6.deal_id, {
        "status": "pending",
        "has_certificate": False,
        "has_token": False
    })
