"""Router agent node — classifies incoming queries and routes to specialists."""

from __future__ import annotations

import json
import logging
import os

import httpx
from gradient_adk import trace_llm

from prompts.router_prompt import ROUTER_CLASSIFICATION_PROMPT, ROUTER_SYSTEM_PROMPT

logger = logging.getLogger(__name__)

GRADIENT_MODEL_ACCESS_KEY = os.getenv("GRADIENT_MODEL_ACCESS_KEY", "")
INFERENCE_URL = "https://inference.do-ai.run/v1/chat/completions"
ROUTER_MODEL = "llama3.3-70b-instruct"


@trace_llm("route_classification")
async def classify_query(user_message: str) -> str:
    """Classify a user message into a routing category.

    Returns one of: symptom_assessment, health_question, medication_check
    """
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                INFERENCE_URL,
                headers={
                    "Authorization": f"Bearer {GRADIENT_MODEL_ACCESS_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": ROUTER_MODEL,
                    "messages": [
                        {"role": "system", "content": ROUTER_SYSTEM_PROMPT},
                        {
                            "role": "user",
                            "content": ROUTER_CLASSIFICATION_PROMPT.format(
                                user_message=user_message
                            ),
                        },
                    ],
                    "max_tokens": 50,
                    "temperature": 0.0,
                },
            )
            response.raise_for_status()
            data = response.json()
            classification = (
                data["choices"][0]["message"]["content"].strip().lower()
            )

            # Validate the classification
            valid_routes = [
                "symptom_assessment",
                "health_question",
                "medication_check",
            ]
            if classification in valid_routes:
                return classification

            # Fuzzy match
            for route in valid_routes:
                if route in classification:
                    return route

            logger.warning(
                f"Unexpected classification: {classification}, defaulting to symptom_assessment"
            )
            return "symptom_assessment"

    except Exception as e:
        logger.error(f"Router classification error: {e}")
        # Default to symptom assessment for safety
        return "symptom_assessment"


async def route_query(state: dict) -> dict:
    """LangGraph node: Route the user's query to the appropriate specialist."""
    messages = state.get("messages", [])
    if not messages:
        return {**state, "route": "symptom_assessment"}

    # Get the last user message
    last_message = messages[-1]
    user_content = (
        last_message.get("content", "")
        if isinstance(last_message, dict)
        else str(last_message)
    )

    # Try to parse structured input (from the frontend form)
    try:
        parsed = json.loads(user_content)
        if "symptoms" in parsed or "age" in parsed:
            return {**state, "route": "symptom_assessment"}
        if "medications" in parsed:
            return {**state, "route": "medication_check"}
    except (json.JSONDecodeError, TypeError):
        pass

    # Use LLM classification for free-text queries
    route = await classify_query(user_content)
    logger.info(f"Query routed to: {route}")
    return {**state, "route": route}


def decide_route(state: dict) -> str:
    """LangGraph conditional edge: return the route from state."""
    return state.get("route", "symptom_assessment")
