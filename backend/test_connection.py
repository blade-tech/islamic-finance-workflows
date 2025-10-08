"""
Test Neo4j and Graphiti connection
"""
import os
import sys
import asyncio
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("Testing Neo4j/Graphiti Connection")
print("=" * 60)

# Check environment variables
neo4j_uri = os.getenv("NEO4J_URI")
neo4j_user = os.getenv("NEO4J_USER")
neo4j_password = os.getenv("NEO4J_PASSWORD")
openai_key = os.getenv("OPENAI_API_KEY")

print("\n1. Environment Variables:")
print(f"   NEO4J_URI: {neo4j_uri}")
print(f"   NEO4J_USER: {neo4j_user}")
print(f"   NEO4J_PASSWORD: {'*' * len(neo4j_password) if neo4j_password else 'NOT SET'}")
print(f"   OPENAI_API_KEY: {'SET' if openai_key else 'NOT SET'}")

if not all([neo4j_uri, neo4j_user, neo4j_password]):
    print("\n❌ ERROR: Neo4j credentials not configured!")
    sys.exit(1)

if not openai_key:
    print("\n⚠️  WARNING: OpenAI API key not set (required for Graphiti embeddings)")

# Test Neo4j connection
print("\n2. Testing Neo4j Connection...")
try:
    from neo4j import GraphDatabase

    driver = GraphDatabase.driver(
        neo4j_uri,
        auth=(neo4j_user, neo4j_password)
    )

    print("   Verifying connectivity...")
    driver.verify_connectivity()
    print("   ✅ Neo4j connection successful!")

    # Get database info
    with driver.session() as session:
        result = session.run("MATCH (n) RETURN count(n) as count")
        node_count = result.single()["count"]

        result = session.run("MATCH ()-[r]->() RETURN count(r) as count")
        edge_count = result.single()["count"]

        print(f"   📊 Nodes: {node_count}")
        print(f"   📊 Edges: {edge_count}")

    driver.close()

except Exception as e:
    print(f"   ❌ Neo4j connection failed: {e}")
    print(f"   Error type: {type(e).__name__}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test Graphiti initialization
print("\n3. Testing Graphiti Initialization...")
try:
    from graphiti_core import Graphiti

    print("   Creating Graphiti client...")
    client = Graphiti(
        uri=neo4j_uri,
        user=neo4j_user,
        password=neo4j_password,
        max_coroutines=5
    )
    print("   ✅ Graphiti client initialized!")

    # Test basic operation
    async def test_graphiti():
        print("\n4. Testing Graphiti Operations...")
        try:
            # Try to add a test episode
            print("   Adding test episode...")
            from graphiti_core.nodes import EpisodeType

            episode_uuid = await client.add_episode(
                name="Test Episode",
                episode_body="This is a test episode to verify Graphiti is working.",
                episode_type=EpisodeType.text,
                source_description="Connection test",
                group_id="test"
            )
            print(f"   ✅ Test episode created: {episode_uuid}")

            # Try to search
            print("   Searching for test episode...")
            results = await client.search(
                query="test episode",
                group_ids=["test"],
                num_results=1
            )
            print(f"   ✅ Search returned {len(results)} results")

            return True

        except Exception as e:
            print(f"   ❌ Graphiti operation failed: {e}")
            print(f"   Error type: {type(e).__name__}")
            import traceback
            traceback.print_exc()
            return False

    # Run async test
    success = asyncio.run(test_graphiti())

    if success:
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("❌ SOME TESTS FAILED")
        print("=" * 60)
        sys.exit(1)

except Exception as e:
    print(f"   ❌ Graphiti initialization failed: {e}")
    print(f"   Error type: {type(e).__name__}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
