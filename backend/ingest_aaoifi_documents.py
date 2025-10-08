"""
AAOIFI DOCUMENT INGESTION SCRIPT
==================================
Parse and ingest AAOIFI standards documents into Graphiti knowledge graph.

This script:
1. Parses SS_08_Murabahah.pdf and SS_30_Monetization_Tawarruq.pdf
2. Ingests them into Graphiti with group_id "aaoifi"
3. Makes them searchable for workflow execution
"""

import asyncio
import logging
import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from app.services.document_service import get_document_service
from app.services.graphiti_service import get_graphiti_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def ingest_aaoifi_documents():
    """
    Parse and ingest AAOIFI standards into Graphiti.
    """
    try:
        # Document paths
        documents = [
            {
                "path": Path("../AAOIFI_Standards/SS_08_Murabahah.pdf"),
                "name": "SS_08_Murabahah",
                "description": "AAOIFI Shariah Standard 08 - Murabahah (Cost-Plus Sale)"
            },
            {
                "path": Path("../AAOIFI_Standards/SS_30_Monetization_Tawarruq.pdf"),
                "name": "SS_30_Monetization_Tawarruq",
                "description": "AAOIFI Shariah Standard 30 - Monetization (Tawarruq)"
            }
        ]

        logger.info("=" * 80)
        logger.info("AAOIFI DOCUMENT INGESTION")
        logger.info("=" * 80)

        # Get services
        doc_service = get_document_service()
        graphiti_service = get_graphiti_service()

        ingested_docs = []

        for doc in documents:
            logger.info(f"\n📄 Processing: {doc['name']}")
            logger.info(f"   Description: {doc['description']}")

            # Check if file exists
            if not doc['path'].exists():
                logger.error(f"   ❌ File not found: {doc['path']}")
                continue

            # Parse document
            logger.info(f"   📖 Parsing PDF...")
            text = await doc_service.parse_pdf(doc['path'])
            logger.info(f"   ✅ Extracted {len(text):,} characters")

            # Ingest into Graphiti with "aaoifi" group_id
            logger.info(f"   🔗 Ingesting into Graphiti knowledge graph...")
            episode_id = await graphiti_service.ingest_document(
                content=text,
                document_name=doc['name'],
                document_type="aaoifi",
                metadata={
                    "filename": doc['path'].name,
                    "description": doc['description'],
                    "standard_number": doc['name'].split('_')[1],  # "08" or "30"
                    "category": "shariah_standard"
                }
            )

            logger.info(f"   ✅ Ingested successfully → Episode ID: {episode_id}")

            ingested_docs.append({
                "name": doc['name'],
                "episode_id": episode_id,
                "char_count": len(text)
            })

        # Summary
        logger.info("\n" + "=" * 80)
        logger.info("INGESTION COMPLETE")
        logger.info("=" * 80)
        logger.info(f"\nTotal documents ingested: {len(ingested_docs)}")

        for doc in ingested_docs:
            logger.info(f"  • {doc['name']}")
            logger.info(f"    - Episode ID: {doc['episode_id']}")
            logger.info(f"    - Content: {doc['char_count']:,} characters")

        logger.info("\n✅ AAOIFI standards are now searchable in the knowledge graph!")
        logger.info("   Group ID: 'aaoifi'")
        logger.info("   Use these standards in Murabaha/Tawarruq workflows.\n")

        return ingested_docs

    except Exception as e:
        logger.error(f"\n❌ Ingestion failed: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    asyncio.run(ingest_aaoifi_documents())
