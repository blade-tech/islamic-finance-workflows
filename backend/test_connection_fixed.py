"""
Test Neo4j and Graphiti connection with different URI schemes
"""
import os
import sys
import asyncio
from dotenv import load_dotenv

load_dotenv()

print("="*60)
print("Testing Neo4j/Graphiti Connection")
print("="*60)

# Check environment variables
neo4j_uri = os.getenv("NEO4J_URI")
neo4j_user = os.getenv("NEO4J_USER")
neo4j_password = os.getenv("NEO4J_PASSWORD")

print("\n1. Environment Variables:")
print(f"   NEO4J_URI: {neo4j_uri}")
print(f"   NEO4J_USER: {neo4j_user}")
print(f"   NEO4J_PASSWORD: {'*' * 10}")

if not all([neo4j_uri, neo4j_user, neo4j_password]):
    print("\nERROR: Neo4j credentials not configured!")
    sys.exit(1)

# Try different URI schemes
uri_variants = [
    neo4j_uri,  # Original
    neo4j_uri.replace("neo4j+s://", "bolt+s://"),  # Bolt with SSL
    neo4j_uri.replace("neo4j+s://", "neo4j+ssc://"),  # Neo4j with self-signed cert
]

print("\n2. Testing Neo4j Connection with different URI schemes...")

from neo4j import GraphDatabase

connected = False
working_uri = None

for uri in uri_variants:
    print(f"\n   Trying: {uri}")
    try:
        driver = GraphDatabase.driver(
            uri,
            auth=(neo4j_user, neo4j_password),
            max_connection_lifetime=3600
        )

        driver.verify_connectivity()
        print(f"   SUCCESS! Connected with URI: {uri}")

        # Get database info
        with driver.session() as session:
            result = session.run("MATCH (n) RETURN count(n) as count")
            node_count = result.single()["count"]

            result = session.run("MATCH ()-[r]->() RETURN count(r) as count")
            edge_count = result.single()["count"]

            print(f"   Nodes: {node_count}")
            print(f"   Edges: {edge_count}")

        driver.close()
        connected = True
        working_uri = uri
        break

    except Exception as e:
        print(f"   Failed: {type(e).__name__}: {str(e)[:100]}")
        continue

if not connected:
    print("\n" + "="*60)
    print("ERROR: Could not connect with any URI scheme!")
    print("="*60)
    print("\nPossible issues:")
    print("1. Neo4j Aura instance is paused/suspended")
    print("2. Network/firewall blocking connection")
    print("3. Invalid credentials")
    print("\nTo fix:")
    print("- Check Neo4j Aura console: https://console.neo4j.io/")
    print("- Resume the database if paused")
    print("- Verify credentials are correct")
    sys.exit(1)

# Test Graphiti initialization
print("\n3. Testing Graphiti Initialization...")
try:
    from graphiti_core import Graphiti

    print(f"   Using URI: {working_uri}")
    client = Graphiti(
        uri=working_uri,
        user=neo4j_user,
        password=neo4j_password
    )
    print("   Graphiti client initialized!")

    # Test basic operation
    async def test_graphiti():
        print("\n4. Testing Graphiti Operations...")
        try:
            from graphiti_core.nodes import EpisodeType
            from datetime import datetime

            print("   Adding test episode...")
            episode_uuid = await client.add_episode(
                name="Connection Test",
                episode_body="This is a test to verify Graphiti works.",
                source=EpisodeType.text,
                source_description="Test",
                reference_time=datetime.now(),
                group_id="test"
            )
            if episode_uuid:
                print(f"   Test episode created: {episode_uuid[:8] if len(str(episode_uuid)) > 8 else episode_uuid}...")
            else:
                print("   Test episode added (no UUID returned)")

            print("   Searching...")
            results = await client.search(
                query="test",
                group_ids=["test"],
                num_results=1
            )
            print(f"   Search returned {len(results)} results")

            return True

        except Exception as e:
            print(f"   Failed: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
            return False

    success = asyncio.run(test_graphiti())

    print("\n" + "="*60)
    if success:
        print("ALL TESTS PASSED!")
        print(f"\nUse this URI in your .env file:")
        print(f"NEO4J_URI={working_uri}")
    else:
        print("SOME TESTS FAILED")
    print("="*60)

except Exception as e:
    print(f"   Failed: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
