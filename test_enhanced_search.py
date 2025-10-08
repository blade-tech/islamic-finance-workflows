"""
TEST ENHANCED SEARCH
=====================
Compares:
1. Regular search (RRF + episode content)
2. Enhanced search (MMR + Cypher context + synthesis)

This demonstrates the easy wins:
- MMR for diversity
- Direct Cypher for graph context
- Simple synthesis layer
"""

import asyncio
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from dotenv import load_dotenv
env_path = Path(__file__).parent / "backend" / ".env"
load_dotenv(env_path)

from app.services.graphiti_service import get_graphiti_service


async def test_both_searches():
    """Compare regular vs enhanced search"""

    query = "What were the last 2 major decisions in the company?"

    print(f"\n{'='*80}")
    print(f"SEARCH COMPARISON TEST")
    print(f"{'='*80}")
    print(f"Query: {query}\n")

    service = get_graphiti_service()

    # ==========================================================================
    # TEST 1: Regular Search (current implementation)
    # ==========================================================================
    print(f"\n{'='*80}")
    print("TEST 1: REGULAR SEARCH (RRF + Episode Content)")
    print(f"{'='*80}\n")

    try:
        regular_results = await service.search(
            query=query,
            num_results=5
        )

        print(f"[OK] Found {len(regular_results)} results\n")

        for i, result in enumerate(regular_results[:3], 1):
            print(f"--- Result {i} ---")
            print(f"  Fact: {result.get('fact', 'N/A')[:100]}...")
            print(f"  Created: {result.get('created_at', 'N/A')}")
            print(f"  Has Content: {'Yes' if result.get('content') else 'No'}")
            print()

    except Exception as e:
        print(f"[ERROR] Regular search failed: {e}")
        import traceback
        traceback.print_exc()

    # ==========================================================================
    # TEST 2: Enhanced Search (Episode Mentions + Entities + Episodes + Cypher + Synthesis)
    # ==========================================================================
    print(f"\n{'='*80}")
    print("TEST 2: ENHANCED SEARCH (Episode Mentions + Entities + Episodes)")
    print(f"{'='*80}\n")

    try:
        enhanced_result = await service.search_with_context(
            query=query,
            num_results=5
        )

        print(f"[OK] Enhanced search complete")
        print(f"  Facts found: {enhanced_result['num_results']}")
        print(f"  Raw edges: {enhanced_result.get('raw_edge_count', 0)}")
        print()

        # Show synthesized answer
        print(f"[SYNTHESIZED ANSWER]")
        print(f"{'-'*80}")
        print(enhanced_result['answer'])
        print(f"{'-'*80}\n")

        # Show enriched facts with context
        print(f"[ENRICHED FACTS WITH CONTEXT]")
        for i, fact in enumerate(enhanced_result['facts'][:3], 1):
            print(f"\n--- Fact {i} ---")
            print(f"  Fact: {fact['fact'][:100]}...")
            print(f"  Source Entity: {fact.get('source_entity', 'N/A')}")
            print(f"  Target Entity: {fact.get('target_entity', 'N/A')}")
            print(f"  Relationship: {fact.get('relationship_type', 'N/A')}")

            # Show episode context if available
            if fact.get('episode_context'):
                print(f"  Episode Context: {fact['episode_context'][:100]}...")

            # Show related facts if available
            if fact.get('related_facts'):
                print(f"  Related Facts: {len(fact['related_facts'])} found")
                for rf in fact['related_facts'][:2]:
                    print(f"    - {rf[:80]}...")

    except Exception as e:
        print(f"[ERROR] Enhanced search failed: {e}")
        import traceback
        traceback.print_exc()

    # ==========================================================================
    # COMPARISON SUMMARY
    # ==========================================================================
    print(f"\n{'='*80}")
    print("COMPARISON SUMMARY")
    print(f"{'='*80}")
    print(f"REGULAR SEARCH:")
    print(f"  - Uses .search() with default RRF reranking")
    print(f"  - Returns facts + episode content")
    print(f"  - Good for basic fact retrieval")
    print()
    print(f"ENHANCED SEARCH (Easy Wins - Not Overengineered):")
    print(f"  1. Episode Mentions Reranking (Graphiti built-in)")
    print(f"  2. Entity Node Search (get_nodes_by_query)")
    print(f"  3. Recent Episodes (retrieve_episodes)")
    print(f"  4. Cypher Context Enrichment (direct Neo4j)")
    print(f"  5. Comprehensive Synthesis (facts + entities + episodes)")
    print()
    print(f"BENEFITS:")
    print(f"  - More context-aware (entities, episodes, relationships)")
    print(f"  - Better temporal awareness (recent episodes)")
    print(f"  - Richer synthesis (combines multiple data sources)")
    print(f"  - Production-ready without LLM (simple synthesis)")
    print(f"  - LLM synthesis can be added later for narratives")
    print(f"{'='*80}\n")

    await service.close()


if __name__ == "__main__":
    asyncio.run(test_both_searches())
