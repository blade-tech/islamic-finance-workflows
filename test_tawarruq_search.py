"""
Direct Graphiti Core search for Tawarruq requirements
Times the search execution
"""

import asyncio
import time
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

# Load environment variables
env_path = Path(__file__).parent / "backend" / ".env"
load_dotenv(env_path)

from graphiti_core import Graphiti

async def search_tawarruq():
    """Search for Tawarruq requirements using Graphiti Core"""

    query = "What are the requirements for Tawarruq?"

    print(f"\n{'='*80}")
    print("DIRECT GRAPHITI CORE SEARCH")
    print(f"{'='*80}")
    print(f"Query: {query}")
    print(f"{'='*80}\n")

    # Initialize Graphiti client
    client = Graphiti(
        uri=os.getenv("NEO4J_URI"),
        user=os.getenv("NEO4J_USER"),
        password=os.getenv("NEO4J_PASSWORD")
    )

    try:
        # Time the search
        start_time = time.time()

        results = await client.search(query=query, num_results=20)

        end_time = time.time()
        elapsed_time = end_time - start_time

        # Display timing
        print(f"EXECUTION TIME: {elapsed_time:.4f} seconds ({elapsed_time*1000:.2f} ms)\n")
        print(f"Results found: {len(results)}\n")

        # Display results
        for i, result in enumerate(results, 1):
            print(f"--- Result {i} (Relevance: {getattr(result, 'score', 'N/A')}) ---")
            print(f"Fact: {getattr(result, 'fact', 'N/A')}")
            print(f"Type: {getattr(result, 'edge_type', 'N/A')}")
            print(f"Created: {getattr(result, 'created_at', 'N/A')}")
            print(f"Valid From: {getattr(result, 'valid_at', 'N/A')}")
            print(f"Valid Until: {getattr(result, 'invalid_at', 'N/A')}")
            print()

        print(f"\n{'='*80}")
        print(f"SUMMARY")
        print(f"{'='*80}")
        print(f"Total execution time: {elapsed_time:.4f} seconds")
        print(f"Total results: {len(results)}")
        print(f"{'='*80}\n")

    except Exception as e:
        print(f"ERROR - Search failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(search_tawarruq())
