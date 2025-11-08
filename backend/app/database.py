"""
DATABASE CONFIGURATION
======================
Async PostgreSQL database setup for Qatar GRC infrastructure.

WHY ASYNC:
- Non-blocking database operations
- Better concurrency for API endpoints
- Matches FastAPI async patterns

WHY POSTGRESQL:
- Strong ACID compliance for regulatory data
- JSON support for flexible metadata
- Array types for multi-value fields (regulators, languages)
- Excellent performance for GRC workloads
"""

import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ============================================================================
# DATABASE URL CONFIGURATION
# ============================================================================

# PostgreSQL connection string from environment
# Format: postgresql+asyncpg://user:password@host:port/database
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/islamic_finance_grc"
)

# ============================================================================
# SQLAlchemy ENGINE & SESSION
# ============================================================================

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=os.getenv("DEBUG", "false").lower() == "true",  # SQL logging in debug mode
    future=True,
    pool_pre_ping=True,  # Verify connections before using
    pool_size=5,
    max_overflow=10,
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# ============================================================================
# DECLARATIVE BASE
# ============================================================================

Base = declarative_base()

# ============================================================================
# DEPENDENCY INJECTION
# ============================================================================

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency for database sessions.

    Usage:
        @app.get("/api/obligations")
        async def list_obligations(db: AsyncSession = Depends(get_db)):
            result = await db.execute(select(Obligation))
            return result.scalars().all()
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# ============================================================================
# DATABASE INITIALIZATION
# ============================================================================

async def init_db():
    """
    Initialize database tables.

    IMPORTANT: In production, use Alembic migrations instead.
    This is only for development convenience.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def close_db():
    """Close database connections on shutdown"""
    await engine.dispose()
