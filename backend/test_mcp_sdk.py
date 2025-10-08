"""Test script to debug MCP SDK issues"""
import asyncio
import os
from dotenv import load_dotenv
from claude_agent_sdk import query
from claude_agent_sdk.types import ClaudeAgentOptions

load_dotenv()

async def test_mcp():
    """Test MCP connection via claude-agent-sdk"""

    # Verify environment variables
    print("=== Environment Check ===")
    print(f"NEO4J_URI: {os.getenv('NEO4J_URI')}")
    print(f"NEO4J_USER: {os.getenv('NEO4J_USER')}")
    print(f"NEO4J_PASSWORD: {'***' if os.getenv('NEO4J_PASSWORD') else 'NOT SET'}")
    print(f"OPENAI_API_KEY: {'***' if os.getenv('OPENAI_API_KEY') else 'NOT SET'}")
    print()

    # Create options
    graphiti_dir = r"D:\projects\graphiti\mcp_server"
    graphiti_script = "graphiti_mcp_server.py"

    print("=== MCP Server Configuration ===")
    print(f"Working directory: {graphiti_dir}")
    print(f"Script: {graphiti_script}")
    print(f"Command: uv run {graphiti_script} --transport stdio")
    print()

    options = ClaudeAgentOptions(
        mcp_servers={
            "blade-graphiti": {
                "command": "uv",
                "args": ["run", graphiti_script, "--transport", "stdio"],
                "env": {
                    "NEO4J_URI": os.getenv("NEO4J_URI"),
                    "NEO4J_USER": os.getenv("NEO4J_USER"),
                    "NEO4J_PASSWORD": os.getenv("NEO4J_PASSWORD"),
                    "OPENAI_API_KEY": os.getenv("OPENAI_API_KEY"),
                    "PATH": os.getenv("PATH"),  # Required for uv to find Python
                    "PYTHONPATH": os.getenv("PYTHONPATH", "")
                },
                "cwd": graphiti_dir  # Set working directory
            }
        },
        allowed_tools=[
            "mcp__blade-graphiti__search",
            "mcp__blade-graphiti__get_recent_nodes"
        ],
        permission_mode="bypassPermissions"  # Auto-allow all tools
    )

    # Test prompt - simple one-liner
    prompt = "Use mcp__blade-graphiti__get_recent_nodes to get 5 recent nodes"

    print("=== Testing MCP via claude-agent-sdk ===")
    print(f"Prompt: {prompt}")
    print()

    try:
        full_response = ""
        message_count = 0
        async for message in query(prompt=prompt, options=options):
            message_count += 1
            print(f"\n--- Message {message_count} ---")
            print(f"Type: {type(message).__name__}")

            # Extract detailed information from different message types
            if hasattr(message, 'content'):
                print(f"Content: {message.content}")
            if hasattr(message, 'mcp_servers'):
                print(f"MCP Servers Status: {message.mcp_servers}")

            print(f"Full message: {message}")
            full_response += str(message)

        print(f"\n=== Success! ===")
        print(f"Total messages: {message_count}")
        print(f"Response length: {len(full_response)} chars")
        print(f"\nFull response:\n{full_response}")

    except Exception as e:
        print(f"\n=== ERROR ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {e}")
        import traceback
        print("\nFull traceback:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_mcp())
