"""
Test script to compare raw Graphiti search vs enriched backend search
"""

import asyncio
import os
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from dotenv import load_dotenv
# Load from backend .env
env_path = Path(__file__).parent / "backend" / ".env"
load_dotenv(env_path)

from graphiti_core import Graphiti
from app.services.graphiti_service import get_graphiti_service

async def test_search():
    """Test both raw Graphiti and enriched backend search"""

    query = "What did Ints talk about last and with who?"

    # =======================================================================
    # TEST 1: Raw Graphiti Search (what we were getting before)
    # =======================================================================
    print(f"\n{'='*80}")
    print("TEST 1: RAW GRAPHITI SEARCH (EntityEdge facts)")
    print(f"Query: {query}")
    print(f"{'='*80}\n")

    raw_client = Graphiti(
        uri=os.getenv("NEO4J_URI"),
        user=os.getenv("NEO4J_USER"),
        password=os.getenv("NEO4J_PASSWORD")
    )

    try:
        raw_results = await raw_client.search(query=query, num_results=3)
        print(f"[OK] Found {len(raw_results)} raw results\n")

        for i, result in enumerate(raw_results, 1):
            print(f"--- Raw Result {i} ---")
            print(f"  Fact: {getattr(result, 'fact', 'N/A')}")
            print(f"  Name: {getattr(result, 'name', 'N/A')}")
            print(f"  Created: {getattr(result, 'created_at', 'N/A')}")
            print(f"  Episode UUID: {getattr(result, 'source_node_uuid', 'N/A')}")
            print()

    except Exception as e:
        print(f"[ERROR] Raw search failed: {e}")
    finally:
        raw_client.close()

    # =======================================================================
    # TEST 2: Enriched Backend Search (with episode content)
    # =======================================================================
    print(f"\n{'='*80}")
    print("TEST 2: ENRICHED BACKEND SEARCH (with episode content)")
    print(f"Query: {query}")
    print(f"{'='*80}\n")

    graphiti_service = get_graphiti_service()

    try:
        enriched_results = await graphiti_service.search(query=query, num_results=3)
        print(f"[OK] Found {len(enriched_results)} enriched results\n")

        for i, result in enumerate(enriched_results, 1):
            print(f"--- Enriched Result {i} ---")
            print(f"  Name: {result.get('name', 'N/A')}")
            print(f"  Source: {result.get('source_description', 'N/A')}")
            print(f"  Created: {result.get('created_at', 'N/A')}")
            print(f"  Fact: {result.get('fact', 'N/A')[:100]}...")

            # Show full content if available
            if result.get('content'):
                content = result['content']
                print(f"\n  [CONTENT] FULL EPISODE CONTENT:")
                print(f"  {'-'*76}")
                # Show first 500 chars
                if len(content) > 500:
                    print(f"  {content[:500]}...")
                    print(f"  ... ({len(content)} chars total)")
                else:
                    print(f"  {content}")
                print(f"  {'-'*76}")
            else:
                print(f"  [WARNING] No episode content available")

            print(f"  Episode UUID: {result.get('uuid', 'N/A')}")
            print()

    except Exception as e:
        print(f"[ERROR] Enriched search failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        graphiti_service.close()

    print(f"\n{'='*80}")
    print("COMPARISON SUMMARY")
    print(f"{'='*80}")
    print("Raw Graphiti: Returns EntityEdge facts (short summaries)")
    print("Enriched Backend: Returns full episode content + timestamps + metadata")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    asyncio.run(test_search())
