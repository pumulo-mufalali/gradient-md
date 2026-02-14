"""Drug interaction check agent node."""

from __future__ import annotations

import json
import logging
import os

import httpx
from gradient_adk import trace_llm

from tools.drug_api import check_drug_interactions
from tools.knowledge_base import format_retrieval_context, search_nih_drug_data

logger = logging.getLogger(__name__)

GRADIENT_MODEL_ACCESS_KEY = os.getenv("GRADIENT_MODEL_ACCESS_KEY", "")
INFERENCE_URL = "https://inference.do-ai.run/v1/chat/completions"
DRUG_MODEL = "llama3.3-70b-instruct"

DRUG_CHECK_SYSTEM_PROMPT = """You are the GradientMD Drug Interaction Agent. Your role is to check 
for potential drug-drug interactions and provide safety information.

You receive:
1. A list of medications the patient is taking
2. Results from the FDA drug interaction database
3. Relevant information from NIH/FDA knowledge base

Your job is to:
- Summarize any found interactions in clear, plain language
- Classify each interaction as high, moderate, or low risk
- Cite the source of the interaction data (FDA, NIH, etc.)
- Recommend consulting a pharmacist or physician for high-risk interactions
- Note if no interactions were found

ALWAYS include the disclaimer that this is not a substitute for professional advice.

Return the response as JSON:
{
  "interactions": [
    {
      "drug1": "name",
      "drug2": "name",
      "severity": "high|moderate|low",
      "description": "clear explanation",
      "source": "FDA/NIH source"
    }
  ],
  "summary": "Overall summary"
}"""


async def drug_check_node(state: dict) -> dict:
    """LangGraph node: Check drug interactions."""
    messages = state.get("messages", [])
    if not messages:
        return {**state, "response": _empty_result()}

    last_message = messages[-1]
    user_content = (
        last_message.get("content", "")
        if isinstance(last_message, dict)
        else str(last_message)
    )

    # Parse medications from input
    medications = _parse_medications(user_content)
    if len(medications) < 2:
        return {
            **state,
            "response": json.dumps(
                {
                    "interactions": [],
                    "summary": "Please provide at least 2 medications to check for interactions.",
                }
            ),
        }

    # Check interactions via OpenFDA API
    api_results = await check_drug_interactions(medications)

    # Also search NIH knowledge base for additional context
    search_query = f"drug interactions {' '.join(medications)}"
    kb_results = await search_nih_drug_data(search_query)
    kb_context = format_retrieval_context(kb_results)

    # Use LLM to synthesize results
    response = await _synthesize_results(medications, api_results, kb_context)
    return {**state, "response": response}


@trace_llm("drug_interaction_synthesis")
async def _synthesize_results(
    medications: list[str], api_results: dict, kb_context: str
) -> str:
    """Synthesize drug interaction results with LLM."""
    user_prompt = f"""Check for drug interactions between these medications: {', '.join(medications)}

FDA API Results:
{json.dumps(api_results, indent=2)}

Additional Knowledge Base Context:
{kb_context}

Synthesize these results into a comprehensive drug interaction report. Return as JSON."""

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                INFERENCE_URL,
                headers={
                    "Authorization": f"Bearer {GRADIENT_MODEL_ACCESS_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": DRUG_MODEL,
                    "messages": [
                        {"role": "system", "content": DRUG_CHECK_SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt},
                    ],
                    "max_tokens": 1500,
                    "temperature": 0.1,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    except Exception as e:
        logger.error(f"Drug check synthesis error: {e}")
        # Fall back to raw API results
        return json.dumps(api_results)


def _parse_medications(content: str) -> list[str]:
    """Parse medications from user input."""
    try:
        data = json.loads(content)
        if isinstance(data, dict) and "medications" in data:
            meds = data["medications"]
            if isinstance(meds, list):
                return [m.strip() for m in meds if m.strip()]
            return [m.strip() for m in meds.split(",") if m.strip()]
    except (json.JSONDecodeError, TypeError):
        pass

    # Try comma-separated
    return [m.strip() for m in content.split(",") if m.strip()]


def _empty_result() -> str:
    """Return empty result JSON."""
    return json.dumps(
        {
            "interactions": [],
            "summary": "No medications provided. Please specify medications to check.",
        }
    )
