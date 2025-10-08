"""
Quick script to search Graphiti for Sami's statements
"""
import asyncio
import os
import sys
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

load_dotenv()

from app.services.graphiti_service import GraphitiService


async def main():
    """Search for Sami's last statements using Graphiti"""
    print("Searching Graphiti for Sami's last statements...")
    print("=" * 60)

    service = GraphitiService()

    try:
        # Search using Graphiti's semantic search
        results = await service.search(
            query="What did Sami say? Sami's recent statements and messages",
            num_results=20
        )

        print(f"\nFound {len(results)} results\n")

        if results:
            for i, result in enumerate(results[:10], 1):
                print(f"\n--- Result {i} ---")
                print(f"Type: {type(result)}")
                print(f"Content: {result}")
                print("-" * 60)
        else:
            print("No results found")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        service.close()


if __name__ == "__main__":
    asyncio.run(main())
