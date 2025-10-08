"""
TEMPLATE SERVICE
================
Loads and manages Islamic Finance workflow templates.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional
from loguru import logger

# Import models (will need to create WorkflowTemplate model)
from pydantic import BaseModel, Field


class WorkflowTemplate(BaseModel):
    """Workflow template model"""
    id: str
    title: str
    description: str
    category: str
    shariah_framework: dict
    legal_framework: Optional[dict] = None
    system_prompt: str
    user_prompt_template: str
    required_documents: List[str]
    optional_documents: Optional[List[str]] = None
    required_standards: List[str]
    citation_requirements: dict
    common_concerns: List[str]
    example_workflow: Optional[dict] = None
    learning_patterns: Optional[List[str]] = None
    version: str
    created_at: str
    updated_at: Optional[str] = None
    created_by: Optional[str] = None
    shariah_reviewed: Optional[bool] = False
    legal_reviewed: Optional[bool] = False


class TemplateService:
    """
    Service for loading and managing workflow templates.

    Templates are stored as JSON files in backend/app/templates/
    and loaded on initialization.
    """

    def __init__(self):
        self.templates_dir = Path(__file__).parent.parent / "templates"
        self._templates: Dict[str, WorkflowTemplate] = {}
        self._load_templates()
        logger.info(f"TemplateService initialized with {len(self._templates)} templates")

    def _load_templates(self):
        """Load all JSON templates from the templates directory"""
        if not self.templates_dir.exists():
            logger.warning(f"Templates directory not found: {self.templates_dir}")
            return

        json_files = list(self.templates_dir.glob("*.json"))
        logger.info(f"Found {len(json_files)} template files")

        for file_path in json_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    template = WorkflowTemplate(**data)
                    self._templates[template.id] = template
                    logger.success(f"Loaded template: {template.id} - {template.title}")
            except Exception as e:
                logger.error(f"Failed to load template {file_path.name}: {e}")

    def get_template(self, template_id: str) -> WorkflowTemplate:
        """
        Get a specific template by ID.

        Args:
            template_id: Template identifier

        Returns:
            WorkflowTemplate object

        Raises:
            ValueError: If template not found
        """
        if template_id not in self._templates:
            available = list(self._templates.keys())
            raise ValueError(
                f"Template '{template_id}' not found. "
                f"Available templates: {', '.join(available)}"
            )

        return self._templates[template_id]

    def list_templates(self) -> List[WorkflowTemplate]:
        """
        Get all available templates.

        Returns:
            List of WorkflowTemplate objects
        """
        return list(self._templates.values())

    def render_user_prompt(
        self,
        template_id: str,
        variables: dict
    ) -> str:
        """
        Render user prompt template with variables.

        Args:
            template_id: Template identifier
            variables: Dictionary of variable values

        Returns:
            Rendered prompt string
        """
        template = self.get_template(template_id)
        prompt = template.user_prompt_template

        # Simple variable substitution: {{variable}} -> value
        for key, value in variables.items():
            placeholder = f"{{{{{key}}}}}"
            prompt = prompt.replace(placeholder, str(value))

        return prompt

    def get_templates_by_category(self, category: str) -> List[WorkflowTemplate]:
        """
        Get templates filtered by category.

        Args:
            category: Category name (e.g., 'structuring', 'compliance', 'screening')

        Returns:
            List of matching templates
        """
        return [
            template for template in self._templates.values()
            if template.category == category
        ]


# Singleton instance
_template_service: Optional[TemplateService] = None


def get_template_service() -> TemplateService:
    """Get or create singleton TemplateService instance"""
    global _template_service
    if _template_service is None:
        _template_service = TemplateService()
    return _template_service
