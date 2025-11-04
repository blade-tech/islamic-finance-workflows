"""
FASTAPI MAIN APPLICATION
========================
Main entry point for the Islamic Finance Workflows backend.

WHAT THIS DOES:
- Initializes FastAPI with CORS
- Mounts API routers
- Configures middleware
- Handles startup/shutdown events
- Provides health check endpoint

WHY THIS STRUCTURE:
- Clean separation of concerns
- Easy to test and maintain
- Follows FastAPI best practices
- Matches frontend API client expectations

VERSION: Fully migrated to MCP (blade-graphiti)
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=getattr(logging, os.getenv("LOG_LEVEL", "INFO")),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# ============================================================================
# LIFESPAN CONTEXT MANAGER
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events for FastAPI app.
    Runs on startup and shutdown.
    """
    # Startup
    logger.info("🚀 Starting Islamic Finance Workflows API")
    logger.info(f"📊 Neo4j URI: {os.getenv('NEO4J_URI')}")
    logger.info(f"🤖 Claude Model: {os.getenv('CLAUDE_MODEL')}")

    # Create upload/output directories
    os.makedirs(os.getenv("UPLOAD_DIR", "./uploads"), exist_ok=True)
    os.makedirs(os.getenv("OUTPUT_DIR", "./outputs"), exist_ok=True)

    yield

    # Shutdown
    logger.info("👋 Shutting down Islamic Finance Workflows API")


# ============================================================================
# FASTAPI APP INITIALIZATION
# ============================================================================

app = FastAPI(
    title="Islamic Finance Workflows API",
    description="AI-powered AAOIFI-compliant document generation using Claude and Graphiti",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)


# ============================================================================
# CORS MIDDLEWARE
# ============================================================================

# Get CORS origins from env
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# API ROUTERS
# ============================================================================

# Import routers (will create these next)
from app.api import graphiti, documents, templates, workflows, citations, learnings, sessions, methodologies, dashboard
from app.api import collaboration, comments, tasks, notifications  # Vanta Phase A

app.include_router(graphiti.router, prefix="/api", tags=["Graphiti"])
app.include_router(documents.router, prefix="/api", tags=["Documents"])
app.include_router(templates.router, prefix="/api", tags=["Templates"])
app.include_router(workflows.router, prefix="/api", tags=["Workflows"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["Sessions"])  # NEW: Session management
app.include_router(citations.router, prefix="/api", tags=["Citations"])
app.include_router(learnings.router, prefix="/api", tags=["Learnings"])
app.include_router(methodologies.router, prefix="/api", tags=["Methodologies"])  # NEW: Methodology management
app.include_router(dashboard.router, tags=["Dashboard"])  # NEW: Compliance dashboard (4-component architecture)

# Vanta Phase A: Collaboration features
app.include_router(collaboration.router, prefix="/api", tags=["Collaboration"])
app.include_router(comments.router, prefix="/api", tags=["Comments"])
app.include_router(tasks.router, prefix="/api", tags=["Tasks"])
app.include_router(notifications.router, prefix="/api", tags=["Notifications"])


# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Islamic Finance Workflows API",
        "version": "1.0.0"
    }


@app.get("/health", tags=["Health"])
async def health():
    """
    Detailed health check
    Returns available services based on configuration
    """
    # Determine which services are available based on environment config
    available_services = []

    # Graphiti service (requires Neo4j)
    if os.getenv("NEO4J_URI"):
        available_services.append("graphiti")

    # Documents service (always available)
    available_services.append("documents")

    # Orchestrator service (requires Anthropic API, using sessions router)
    if os.getenv("ANTHROPIC_API_KEY"):
        available_services.append("orchestrator")

    # MCP service (requires Anthropic API for Claude agent SDK)
    if os.getenv("ANTHROPIC_API_KEY"):
        available_services.append("mcp")

    return {
        "status": "ok",
        "services": available_services,
        "version": "1.0.0",
        "neo4j_configured": bool(os.getenv("NEO4J_URI")),
        "anthropic_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
    }


@app.get("/api/config", tags=["Health"])
async def config():
    """
    Service configuration endpoint
    Returns available services and MCP servers for frontend discovery
    """
    # Determine which services are available
    available_services = []

    # Graphiti service (requires Neo4j)
    if os.getenv("NEO4J_URI"):
        available_services.append("graphiti")

    # Documents service (always available)
    available_services.append("documents")

    # Orchestrator service (requires Anthropic API)
    if os.getenv("ANTHROPIC_API_KEY"):
        available_services.append("orchestrator")

    # MCP service (requires Anthropic API)
    if os.getenv("ANTHROPIC_API_KEY"):
        available_services.append("mcp")

    # Determine which MCP servers are configured
    mcp_servers = []
    if os.getenv("NEO4J_URI") and os.getenv("OPENAI_API_KEY"):
        mcp_servers.append("graphiti")

    # Additional features
    features = []
    if os.getenv("ANTHROPIC_API_KEY"):
        features.append("claude-agent-sdk")

    return {
        "services": available_services,
        "mcp_servers": mcp_servers,
        "features": features
    }


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for uncaught errors"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
            "detail": str(exc) if os.getenv("DEBUG") == "true" else "An error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", 8000)),
        reload=os.getenv("DEBUG", "false").lower() == "true"
    )
