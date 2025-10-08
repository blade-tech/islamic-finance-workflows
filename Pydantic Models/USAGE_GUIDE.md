# Business Entities V2 - Usage Guide

## Overview

The **Business Entities V2** Pydantic models are generated from LinkML schemas and provide validated, type-safe data models for business domain entities and relationships.

## Architecture

```
pydantic_library/
├── schemas/                          # Source LinkML schemas
│   ├── core/
│   │   ├── base.yaml                # Base configuration
│   │   ├── provenance.yaml          # Provenance mixins
│   │   └── types.yaml               # Custom types (Email, Phone, Confidence)
│   └── overlays/
│       └── business_entities_v2_overlay.yaml  # Business domain schema
│
└── generated/                        # Generated Pydantic models
    └── pydantic/
        ├── core/                     # Core generated models (from LinkML core schemas)
        │   ├── base.py              # ConfiguredBaseModel, LinkMLMeta
        │   ├── provenance.py        # ProvenanceFields, EdgeProvenanceFields
        │   └── types.py             # Email, E164Phone, Confidence01
        │
        └── overlays/
            └── business_entities_v2_models.py  # All business models (standalone)
```

## How Core & Overlay Models Work Together

### Option 1: Use Standalone Generated Models (Recommended)

The generated `business_entities_v2_models.py` is **self-contained** and includes everything:

```python
from pydantic_library.generated.pydantic.overlays.business_entities_v2_models import (
    # Entities
    BusinessOutcome,
    Actor,
    Customer,
    Project,

    # Edges
    AssignedTo,
    ResponsibleFor,

    # Enums
    OutcomeStatus,
    Priority,
)
```

**Why?** LinkML's PydanticGenerator creates standalone files by default. The generated file includes:
- `ConfiguredBaseModel` (base config)
- `ProvenanceFields` and `EdgeProvenanceFields` mixins
- All entity and edge classes
- All enum types

### Option 2: Refactor to Use Shared Core Models (Advanced)

If you want to avoid duplication and use the core models directly:

```python
# Option A: Import from core
from pydantic_library.generated.pydantic.core.base import ConfiguredBaseModel
from pydantic_library.generated.pydantic.core.provenance import ProvenanceFields
from pydantic_library.generated.pydantic.core.types import Email, E164Phone, Confidence01

# Option B: Import from overlay
from pydantic_library.generated.pydantic.overlays.business_entities_v2_models import (
    BusinessOutcome,
    Actor,
)
```

**Note:** You would need to modify the generated overlay file to import from core instead of defining classes inline.

## Core Components

### 1. ConfiguredBaseModel

Base class with standardized Pydantic V2 configuration:

```python
class ConfiguredBaseModel(BaseModel):
    model_config = ConfigDict(
        validate_assignment=True,      # Validates field updates after creation
        validate_default=True,         # Validates default values
        extra="forbid",                # Rejects unknown fields
        arbitrary_types_allowed=True,  # Allows custom types
        use_enum_values=True,          # Serializes enums as values
        str_strip_whitespace=True,     # Auto-strips string whitespace
    )
```

**All generated models inherit this configuration automatically.**

### 2. ProvenanceFields Mixin

Tracks the source and evidence for entities (nodes):

```python
class ProvenanceFields(ConfiguredBaseModel):
    # Identity
    node_id: Optional[str]              # Stable citation ID

    # Source tracking
    prov_system: Optional[str]          # e.g., "slack", "gdrive", "jira"

    # Slack provenance
    prov_channel_ids: Optional[list[str]]
    prov_thread_tss: Optional[list[str]]
    prov_tss: Optional[list[str]]
    prov_permalinks: Optional[list[str]]

    # Document provenance
    prov_file_ids: Optional[list[str]]
    prov_rev_ids: Optional[list[str]]
    doco_types: Optional[list[str]]     # e.g., "section", "paragraph"
    doco_paths: Optional[list[str]]
    page_nums: Optional[list[int]]

    # Evidence
    prov_text_sha1s: Optional[list[str]]
    support_count: Optional[int]        # Number of supporting evidences (ge=0)
```

**Usage:**
```python
outcome = BusinessOutcome(
    title="Launch Product",
    node_id="outcome-launch-001",
    prov_system="slack",
    prov_channel_ids=["C12345"],
    prov_permalinks=["https://slack.com/..."],
    support_count=3,
)
```

### 3. EdgeProvenanceFields Mixin

Tracks the source and evidence for relationships (edges):

```python
class EdgeProvenanceFields(ConfiguredBaseModel):
    # Identity
    rel_id: Optional[str]               # Stable relationship ID

    # All ProvenanceFields PLUS:
    derived: Optional[bool]             # True if inferred, False if direct
    derivation_rule: Optional[str]      # Method used for derivation
```

**Usage:**
```python
assignment = AssignedTo(
    primary=True,
    rel_id="assignment-task-001-to-sarah",
    prov_system="jira",
    derived=False,  # Directly extracted from JIRA
)
```

### 4. Custom Types

Validation types with constraints:

```python
# Email validation
Email = Annotated[str, Field(pattern=r'^[^@\s]+@[^@\s]+\.[^@\s]+$')]

# E.164 phone number validation
E164Phone = Annotated[str, Field(pattern=r'^\+?[1-9]\d{7,15}$')]

# Confidence score (0-1)
Confidence01 = Annotated[float, Field(ge=0, le=1)]
```

**Usage:**
```python
actor = Actor(
    actor_name="Sarah Chen",
    email="sarah@company.com",      # Validates email pattern
    phone="+14155551234",            # Validates E.164 format
)

outcome = BusinessOutcome(
    title="Goal",
    outcome_confidence=0.85,         # Validates 0 <= value <= 1
)
```

## Working with the Models

### 1. Creating Entities

```python
from pydantic_library.generated.pydantic.overlays.business_entities_v2_models import (
    BusinessOutcome,
    OutcomeStatus,
    Priority,
)
from datetime import datetime

# Create with type-safe enums and validation
outcome = BusinessOutcome(
    title="Launch Mobile App V2",
    description="Complete redesign with new features",
    outcome_status=OutcomeStatus.in_progress,  # Enum validation
    outcome_priority=Priority.high,            # Enum validation
    outcome_confidence=0.85,                   # Numeric guard: 0 <= x <= 1
    outcome_due_date=datetime(2025, 12, 31),   # Datetime validation

    # Provenance tracking
    node_id="outcome-mobile-v2",
    prov_system="slack",
    support_count=5,
)
```

### 2. Creating Relationships (Edges)

```python
from pydantic_library.generated.pydantic.overlays.business_entities_v2_models import (
    AssignedTo,
    Severity,
)

# Edge with provenance
assignment = AssignedTo(
    primary=True,

    # Edge provenance
    rel_id="assignment-123",
    prov_system="jira",
    prov_permalinks=["https://jira.company.com/browse/TASK-123"],
    derived=False,
)
```

### 3. Validation Examples

```python
# ✓ Valid email
actor = Actor(actor_name="John", email="john@company.com")

# ✗ Invalid email - raises ValidationError
actor = Actor(actor_name="John", email="not-an-email")

# ✓ Valid confidence
outcome = BusinessOutcome(title="Goal", outcome_confidence=0.75)

# ✗ Invalid confidence - raises ValidationError
outcome = BusinessOutcome(title="Goal", outcome_confidence=1.5)

# ✓ Valid phone
actor = Actor(actor_name="Jane", phone="+14155551234")

# ✗ Invalid phone - raises ValidationError
actor = Actor(actor_name="Jane", phone="+123")
```

### 4. Serialization

```python
# To dict
data = outcome.model_dump()

# To JSON string
json_str = outcome.model_dump_json(indent=2)

# From dict
outcome2 = BusinessOutcome.model_validate(data)

# From JSON string
outcome3 = BusinessOutcome.model_validate_json(json_str)
```

### 5. Enum Handling

```python
from pydantic_library.generated.pydantic.overlays.business_entities_v2_models import (
    OutcomeStatus,
    TaskStatus,
    Priority,
    Severity,
)

# Use enum values
task = BusinessTask(
    title="Design feature",
    task_status=TaskStatus.in_progress,      # Type-safe enum
    task_priority=Priority.high,
)

# Enums serialize as string values (due to use_enum_values=True)
data = task.model_dump()
assert data["task_status"] == "in_progress"  # String, not enum instance
```

## Complete Example

See `examples/business_entities_v2_usage.py` for a comprehensive demonstration:

```bash
python -m examples.business_entities_v2_usage
```

This example demonstrates:
- ✓ Provenance tracking on entities and edges
- ✓ Enum validation for categorical values
- ✓ Datetime handling for temporal fields
- ✓ Numeric constraints (ge/le)
- ✓ Email/phone validation
- ✓ Edge relationships with provenance
- ✓ JSON serialization/deserialization
- ✓ Type safety and validation

## Regeneration Workflow

When you need to update the models:

### 1. Edit LinkML Schema

```bash
# Edit the schema
vim pydantic_library/schemas/overlays/business_entities_v2_overlay.yaml
```

### 2. Regenerate Pydantic Models

```bash
# Generate from LinkML
python -c "
from linkml.generators.pydanticgen import PydanticGenerator;
import sys;
sys.stdout.reconfigure(encoding='utf-8');
gen = PydanticGenerator('pydantic_library/schemas/overlays/business_entities_v2_overlay.yaml');
result = gen.serialize();
open('pydantic_library/generated/pydantic/overlays/business_entities_v2_models.py', 'w', encoding='utf-8').write(result)
"
```

### 3. Apply Validation Fixes

LinkML doesn't translate custom type constraints (Email, E164Phone, Confidence01) to Pydantic Field() parameters, so we apply a post-processing script:

```bash
python fix_generated_validations.py
```

This adds:
- `ge=0, le=1` to confidence fields
- `pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$"` to email fields
- `pattern=r"^\+?[1-9]\d{7,15}$"` to phone fields

### 4. Run Tests

```bash
python -m pytest pydantic_library/tests/test_business_entities_v2.py -v
```

## Key Features

### ✓ Type Safety
All models are fully typed with Pydantic V2, providing IDE autocomplete and type checking.

### ✓ Validation
- Enums prevent string drift
- Numeric guards enforce constraints (ge/le)
- Pattern validation for email/phone
- Datetime parsing and validation

### ✓ Provenance Tracking
Every entity and edge can track:
- Source system
- Slack channels/threads/messages
- Document IDs/revisions/pages
- Evidence counts

### ✓ Graph Relationships
Edge classes model relationships with their own provenance:
- `AssignedTo` - Task → Actor
- `ResponsibleFor` - Outcome → Actor
- `DependsOn` - Task → Task
- `Requires` - Project → Outcome
- `Fulfills` - Task → Outcome
- `BlockedBy` - Task → Task
- `SupportedBy` - Claim → Evidence

### ✓ Backward Compatibility
Deprecated fields are marked but still work, allowing gradual migration.

## Troubleshooting

### Import Errors

**Error:** `ModuleNotFoundError: No module named 'pydantic_library'`

**Solution:** Run as a module from project root:
```bash
python -m examples.business_entities_v2_usage
```

### Validation Errors

**Error:** Email/phone/confidence validation not working after regeneration

**Solution:** Run the post-processing script:
```bash
python fix_generated_validations.py
```

### Unicode Errors

**Error:** `UnicodeEncodeError: 'charmap' codec can't encode character`

**Solution:** When generating, ensure UTF-8 encoding:
```python
sys.stdout.reconfigure(encoding='utf-8')
```

## Best Practices

1. **Always use enums** for categorical values (don't use raw strings)
2. **Track provenance** for all extracted data (aids citation and auditing)
3. **Use edge classes** instead of embedding relationships as entity fields
4. **Validate early** - instantiate models as soon as data is extracted
5. **Use stable IDs** - set `node_id` and `rel_id` for persistence and citations
6. **Document derivations** - set `derived=True` and `derivation_rule` for inferred edges

## Further Reading

- [Pydantic V2 Documentation](https://docs.pydantic.dev/latest/)
- [LinkML Documentation](https://linkml.io/)
- [Project Tests](pydantic_library/tests/test_business_entities_v2.py) - 38 comprehensive tests
- [Schema Definition](pydantic_library/schemas/overlays/business_entities_v2_overlay.yaml)
