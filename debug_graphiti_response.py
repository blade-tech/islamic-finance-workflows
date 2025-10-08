"""
Debug script to show EXACTLY what Graphiti returns
Saves raw response to JSON file for inspection
"""

import asyncio
import os
import sys
import json
from pathlib import Path
from datetime import datetime

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

from dotenv import load_dotenv
env_path = Path(__file__).parent / "backend" / ".env"
load_dotenv(env_path)

from graphiti_core import Graphiti

async def debug_graphiti_search(query: str):
    """
    Query Graphiti and save the EXACT raw response to a file.

    This shows:
    1. What we send to Graphiti
    2. What Graphiti sends back (raw EntityEdge objects)
    3. What fields are available
    """

    print(f"\n{'='*80}")
    print(f"GRAPHITI DEBUG - Raw Response Inspection")
    print(f"{'='*80}\n")

    # Initialize Graphiti client
    client = Graphiti(
        uri=os.getenv("NEO4J_URI"),
        user=os.getenv("NEO4J_USER"),
        password=os.getenv("NEO4J_PASSWORD")
    )

    print(f"[QUERY SENT TO GRAPHITI]")
    print(f"  Query: {query}")
    print(f"  Num Results: 5")
    print(f"  Group IDs: None (all groups)")
    print()

    try:
        # Call Graphiti search
        results = await client.search(
            query=query,
            num_results=5
        )

        print(f"[RESPONSE RECEIVED]")
        print(f"  Type: {type(results)}")
        print(f"  Count: {len(results)}")
        print()

        # Convert results to JSON-serializable format
        results_data = []

        for i, result in enumerate(results, 1):
            print(f"\n{'-'*80}")
            print(f"Result {i}/{len(results)}")
            print(f"{'-'*80}")

            # Inspect the raw object
            result_type = type(result).__name__
            print(f"  Object Type: {result_type}")
            print(f"  Module: {type(result).__module__}")
            print()

            # Extract all attributes
            result_dict = {}

            # Try to get all attributes using dir()
            print("  Available Attributes:")
            for attr in dir(result):
                if not attr.startswith('_'):  # Skip private attributes
                    try:
                        value = getattr(result, attr)
                        # Skip methods
                        if not callable(value):
                            print(f"    {attr}: {type(value).__name__}")

                            # Convert to JSON-serializable
                            if hasattr(value, 'isoformat'):
                                result_dict[attr] = value.isoformat()
                            elif isinstance(value, (str, int, float, bool, type(None))):
                                result_dict[attr] = value
                            elif isinstance(value, list):
                                result_dict[attr] = [str(item) for item in value]
                            else:
                                result_dict[attr] = str(value)
                    except Exception as e:
                        print(f"    {attr}: <error reading: {e}>")

            print()
            print("  Field Values:")
            for key, value in result_dict.items():
                if isinstance(value, str) and len(value) > 100:
                    print(f"    {key}: {value[:100]}... ({len(value)} chars)")
                else:
                    print(f"    {key}: {value}")

            results_data.append(result_dict)

        # Save to JSON file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"graphiti_raw_response_{timestamp}.json"

        output = {
            "query": query,
            "timestamp": datetime.now().isoformat(),
            "num_results": len(results),
            "results": results_data
        }

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        print(f"\n{'='*80}")
        print(f"[RAW RESPONSE SAVED]")
        print(f"  File: {filename}")
        print(f"  Location: {Path(filename).absolute()}")
        print(f"{'='*80}\n")

        # Summary analysis
        print(f"\n{'='*80}")
        print(f"[ANALYSIS]")
        print(f"{'='*80}")
        print(f"Graphiti returns: {result_type} objects")
        print(f"Common fields found:")
        if results_data:
            for key in results_data[0].keys():
                print(f"  - {key}")
        print()
        print(f"These are NOT full episode contents - they are extracted facts/relationships")
        print(f"To get full episode content, we need to:")
        print(f"  1. Extract source_node_uuid from each result")
        print(f"  2. Query Neo4j for the Episodic node")
        print(f"  3. Get the 'content' field from the Episodic node")
        print(f"{'='*80}\n")

    except Exception as e:
        print(f"[ERROR] Search failed: {e}")
        import traceback
        traceback.print_exc()

    finally:
        await client.close()


if __name__ == "__main__":
    # Test query
    query = "What were the last 2 major decisions in the company?"
    asyncio.run(debug_graphiti_search(query))
