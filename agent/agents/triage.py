"""Triage agent node — assesses symptom urgency using clinical guidelines."""

from __future__ import annotations

import json
import logging
import os

import httpx
from gradient_adk import trace_llm

from prompts.triage_prompt import TRIAGE_SYSTEM_PROMPT, TRIAGE_USER_PROMPT
from tools.knowledge_base import (
    format_retrieval_context,
    search_cdc_guidelines,
    search_who_protocols,
)

logger = logging.getLogger(__name__)

GRADIENT_MODEL_ACCESS_KEY = os.getenv("GRADIENT_MODEL_ACCESS_KEY", "")
FINE_TUNED_MODEL_URL = os.getenv("FINE_TUNED_MODEL_URL", "")
INFERENCE_URL = "https://inference.do-ai.run/v1/chat/completions"

# Use fine-tuned model if available, otherwise fall back to serverless inference
TRIAGE_MODEL = "llama3.3-70b-instruct"


async def triage_node(state: dict) -> dict:
    """LangGraph node: Perform symptom triage assessment."""
    messages = state.get("messages", [])
    if not messages:
        return {**state, "response": _error_response()}

    last_message = messages[-1]
    user_content = (
        last_message.get("content", "")
        if isinstance(last_message, dict)
        else str(last_message)
    )

    # Parse symptom data
    symptom_data = _parse_symptom_data(user_content)

    # Retrieve relevant clinical guidelines from knowledge bases
    search_query = (
        f"{symptom_data.get('symptoms', '')} "
        f"{symptom_data.get('conditions', '')} "
        f"triage assessment urgency"
    )

    cdc_results = await search_cdc_guidelines(search_query)
    who_results = await search_who_protocols(search_query)

    # Tag sources
    for doc in cdc_results:
        doc["source"] = "CDC"
    for doc in who_results:
        doc["source"] = "WHO"

    all_results = cdc_results + who_results
    retrieval_context = format_retrieval_context(all_results)

    # Generate triage assessment
    triage_result = await _generate_triage(symptom_data, retrieval_context)

    return {**state, "response": triage_result}


@trace_llm("triage_assessment")
async def _generate_triage(symptom_data: dict, retrieval_context: str) -> str:
    """Generate the triage assessment using the LLM."""
    user_prompt = TRIAGE_USER_PROMPT.format(
        age=symptom_data.get("age", "Unknown"),
        sex=symptom_data.get("sex", "Unknown"),
        symptoms=symptom_data.get("symptoms", "Not specified"),
        duration=symptom_data.get("duration", "Unknown"),
        severity=symptom_data.get("severity", "Unknown"),
        medications=symptom_data.get("medications", "None"),
        conditions=symptom_data.get("conditions", "None"),
        additional_info=symptom_data.get("additionalInfo", "None"),
        retrieval_context=retrieval_context,
    )

    try:
        # Try fine-tuned model first, fall back to serverless inference
        inference_url = FINE_TUNED_MODEL_URL or INFERENCE_URL
        auth_key = GRADIENT_MODEL_ACCESS_KEY

        async with httpx.AsyncClient(timeout=60) as client:
            payload = {
                "messages": [
                    {"role": "system", "content": TRIAGE_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                "max_tokens": 2000,
                "temperature": 0.1,  # Low temp for medical accuracy
            }

            if not FINE_TUNED_MODEL_URL:
                payload["model"] = TRIAGE_MODEL

            response = await client.post(
                f"{inference_url}/chat/completions"
                if FINE_TUNED_MODEL_URL
                else inference_url,
                headers={
                    "Authorization": f"Bearer {auth_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    except Exception as e:
        logger.error(f"Triage generation error: {e}")
        return _error_response()


def _parse_symptom_data(content: str) -> dict:
    """Parse symptom data from user message (JSON or free text)."""
    try:
        return json.loads(content)
    except (json.JSONDecodeError, TypeError):
        # Free-text input — wrap it in a basic structure
        return {
            "symptoms": content,
            "age": "Unknown",
            "sex": "Unknown",
            "duration": "Unknown",
            "severity": "Unknown",
            "medications": "None",
            "conditions": "None",
            "additionalInfo": "None",
        }


def _error_response() -> str:
    """Return a safe error response."""
    return json.dumps(
        {
            "severity": "ROUTINE",
            "title": "Unable to Complete Assessment",
            "summary": (
                "We were unable to fully assess your symptoms. "
                "Please consult a healthcare provider for a proper evaluation."
            ),
            "recommendations": [
                "Contact your primary care physician for an assessment.",
                "If you are experiencing a medical emergency, call 911 immediately.",
            ],
            "citations": [],
            "nextSteps": [
                "Schedule an appointment with your doctor",
                "If symptoms worsen, seek immediate medical attention",
            ],
            "warningSignsToWatch": [
                "Sudden severe pain",
                "Difficulty breathing",
                "Loss of consciousness",
                "Chest pain or pressure",
            ],
        }
    )
