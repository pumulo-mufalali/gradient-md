"""Pydantic models for GradientMD agent input/output schemas."""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class SeverityLevel(str, Enum):
    EMERGENCY = "EMERGENCY"
    URGENT = "URGENT"
    ROUTINE = "ROUTINE"
    SELF_CARE = "SELF_CARE"


class SymptomInput(BaseModel):
    """Input schema for symptom triage requests."""

    age: str
    sex: str
    symptoms: str
    duration: str
    severity: str
    medications: Optional[str] = ""
    conditions: Optional[str] = ""
    additional_info: Optional[str] = Field(default="", alias="additionalInfo")


class Citation(BaseModel):
    """A citation from a clinical guideline source."""

    source: str = Field(description="Source organization: CDC, WHO, NIH, or FDA")
    document: str = Field(description="Document name or title")
    excerpt: str = Field(description="Relevant excerpt from the document")
    url: Optional[str] = Field(default=None, description="URL to the source")


class TriageResult(BaseModel):
    """Output schema for triage assessment."""

    severity: SeverityLevel
    title: str = Field(description="Brief condition title")
    summary: str = Field(description="1-2 sentence summary of the assessment")
    recommendations: list[str] = Field(description="List of recommendations")
    citations: list[Citation] = Field(default_factory=list)
    next_steps: list[str] = Field(
        default_factory=list, alias="nextSteps", description="Action items"
    )
    warning_signs_to_watch: list[str] = Field(
        default_factory=list,
        alias="warningSignsToWatch",
        description="Red-flag symptoms to watch for",
    )

    model_config = {"populate_by_name": True}


class DrugInteraction(BaseModel):
    """A drug-drug interaction result."""

    drug1: str
    drug2: str
    severity: str = Field(description="high, moderate, or low")
    description: str
    source: str


class DrugCheckResult(BaseModel):
    """Output schema for drug interaction check."""

    interactions: list[DrugInteraction] = Field(default_factory=list)
    summary: str


class AgentState(BaseModel):
    """State schema for the LangGraph workflow."""

    messages: list[dict] = Field(default_factory=list)
    route: Optional[str] = None
    retrieval_context: Optional[str] = None
    response: Optional[str] = None
    metadata: dict = Field(default_factory=dict)
