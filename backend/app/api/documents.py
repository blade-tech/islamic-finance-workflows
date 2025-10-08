"""
DOCUMENT API ENDPOINTS
======================
Endpoints for document upload, ingestion, and generation.

FEATURES:
- Upload PDF/DOCX files
- Parse with LlamaParse/PyPDF2
- Ingest into Graphiti knowledge graph
- Generate PDF/DOCX/Markdown outputs
- Download generated documents
"""

import logging
import os
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.services import get_document_service
from app.models import UploadedDocument

logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class IngestDocumentResponse(BaseModel):
    """Response after document ingestion"""
    document: UploadedDocument
    message: str


class GenerateDocumentRequest(BaseModel):
    """Request to generate a document"""
    content: str
    format: str = "pdf"  # pdf, docx, markdown
    filename: Optional[str] = None


class GenerateDocumentResponse(BaseModel):
    """Response after document generation"""
    file_id: str
    filename: str
    format: str
    download_url: str


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/documents/ingest", response_model=IngestDocumentResponse)
async def ingest_document(
    file: UploadFile = File(...),
    document_type: str = Form(..., alias="type")  # 'aaoifi' or 'context', exposed as 'type' in API
):
    """
    Upload and ingest a document into Graphiti knowledge graph.

    Args:
        file: PDF or DOCX file to upload
        document_type: 'aaoifi' or 'context'

    Returns:
        UploadedDocument with Graphiti episode_id
    """
    try:
        # Validate document type
        if document_type not in ["aaoifi", "context"]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid document_type: {document_type}. Must be 'aaoifi' or 'context'"
            )

        # Validate file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in [".pdf", ".docx", ".doc"]:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file_ext}. Only PDF and DOCX files are supported."
            )

        # Get document service
        doc_service = get_document_service()

        # Save uploaded file
        content = await file.read()
        file_path = await doc_service.save_upload(content, file.filename)

        logger.info(f"📄 Processing {file.filename} (type: {document_type})")

        # Parse and ingest into Graphiti
        uploaded_doc = await doc_service.ingest_document(
            file_path=file_path,
            document_type=document_type,
            metadata={
                "original_filename": file.filename,
                "content_type": file.content_type,
                "file_size": len(content)
            }
        )

        logger.info(f"✅ Successfully ingested {file.filename} → Episode {uploaded_doc.graphitiEpisodeId}")

        return IngestDocumentResponse(
            document=uploaded_doc,
            message=f"Document '{file.filename}' successfully ingested into knowledge graph"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to ingest document: {e}")
        raise HTTPException(status_code=500, detail=f"Document ingestion failed: {str(e)}")


@router.post("/documents/generate", response_model=GenerateDocumentResponse)
async def generate_document(request: GenerateDocumentRequest):
    """
    Generate a document in specified format (PDF/DOCX/Markdown).

    Args:
        request: Document content and format preferences

    Returns:
        Generated document information with download URL
    """
    try:
        # Validate format
        if request.format not in ["pdf", "docx", "markdown"]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid format: {request.format}. Must be 'pdf', 'docx', or 'markdown'"
            )

        # Get document service
        doc_service = get_document_service()

        # Generate document
        output_path = await doc_service.generate_document(
            content=request.content,
            format=request.format,
            filename=request.filename
        )

        logger.info(f"📄 Generated {request.format.upper()} document: {output_path.name}")

        # Create response
        file_id = output_path.stem  # Filename without extension
        download_url = f"/api/documents/{file_id}/download"

        return GenerateDocumentResponse(
            file_id=file_id,
            filename=output_path.name,
            format=request.format,
            download_url=download_url
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to generate document: {e}")
        raise HTTPException(status_code=500, detail=f"Document generation failed: {str(e)}")


@router.get("/documents/{file_id}/download")
async def download_document(file_id: str):
    """
    Download a generated document.

    Args:
        file_id: ID of the document to download

    Returns:
        File download response
    """
    try:
        # Get output directory
        output_dir = Path(os.getenv("OUTPUT_DIR", "./outputs"))

        # Find file with any supported extension
        possible_files = list(output_dir.glob(f"{file_id}.*"))

        if not possible_files:
            raise HTTPException(
                status_code=404,
                detail=f"Document not found: {file_id}"
            )

        file_path = possible_files[0]

        # Determine media type
        ext = file_path.suffix.lower()
        media_types = {
            ".pdf": "application/pdf",
            ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".md": "text/markdown"
        }
        media_type = media_types.get(ext, "application/octet-stream")

        logger.info(f"📥 Downloading document: {file_path.name}")

        return FileResponse(
            path=str(file_path),
            media_type=media_type,
            filename=file_path.name
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to download document: {e}")
        raise HTTPException(status_code=500, detail=f"Document download failed: {str(e)}")
