"""GradientMD Agent — Main Entrypoint

Multi-agent medical triage system built with LangGraph and deployed via
DigitalOcean Gradient AI Agent Development Kit (ADK).

This agent uses:
- Router node to classify and route queries
- Triage node for symptom urgency assessment
- Medical Q&A node for health questions with RAG citations
- Drug interaction node for medication safety checks
- Knowledge Bases for CDC, WHO, and NIH clinical guidelines
- Guardrails for PII protection, jailbreak prevention, and content moderation
"""

from __future__ import annotations

import json
import logging
import os
from typing import Any

from dotenv import load_dotenv
from gradient_adk import entrypoint
from langgraph.graph import END, StateGraph

from agents.drug_check import drug_check_node
from agents.medical_qa import qa_node
from agents.router import decide_route, route_query
from agents.triage import triage_node

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger("gradientmd")


# ---------------------------------------------------------------------------
# LangGraph Workflow Definition
# ---------------------------------------------------------------------------

def build_workflow() -> StateGraph:
    """Build the GradientMD multi-agent LangGraph workflow."""

    workflow = StateGraph(dict)

    # Add nodes
    workflow.add_node("router", route_query)
    workflow.add_node("triage", triage_node)
    workflow.add_node("medical_qa", qa_node)
    workflow.add_node("drug_check", drug_check_node)
    workflow.add_node("format_output", format_response)

    # Set entry point
    workflow.set_entry_point("router")

    # Conditional routing from router node
    workflow.add_conditional_edges(
        "router",
        decide_route,
        {
            "symptom_assessment": "triage",
            "health_question": "medical_qa",
            "medication_check": "drug_check",
        },
    )

    # All specialist nodes flow to format_output
    workflow.add_edge("triage", "format_output")
    workflow.add_edge("medical_qa", "format_output")
    workflow.add_edge("drug_check", "format_output")

    # format_output ends the workflow
    workflow.add_edge("format_output", END)

    return workflow


async def format_response(state: dict) -> dict:
    """Format the final response for the frontend."""
    response = state.get("response", "")
    route = state.get("route", "unknown")

    # Ensure the response is valid JSON for triage and drug_check routes
    if route in ("symptom_assessment", "medication_check"):
        try:
            # Validate it's parseable JSON
            if isinstance(response, str):
                json.loads(response)
        except json.JSONDecodeError:
            # Wrap non-JSON responses
            logger.warning(f"Non-JSON response from {route}, wrapping")

    logger.info(f"Response generated via {route} route")
    return {**state, "response": response}


# Build and compile the workflow
workflow = build_workflow()
app = workflow.compile()


# ---------------------------------------------------------------------------
# ADK Entrypoint
# ---------------------------------------------------------------------------

@entrypoint
async def main(payload: dict[str, Any], context: dict[str, Any]) -> dict:
    """GradientMD agent entrypoint.

    Accepts a prompt and optional metadata, routes to the appropriate
    specialist agent, and returns the response.

    Payload format:
        {
            "prompt": "user message or JSON symptom data",
            "include_retrieval_info": true/false,
            "include_guardrails_info": true/false,
            "metadata": {}
        }

    Returns:
        {
            "response": "agent response (string or JSON)",
            "route": "which agent handled the request"
        }
    """
    prompt = payload.get("prompt", "")
    metadata = payload.get("metadata", {})

    if not prompt:
        return {
            "response": "Please provide a symptom description, health question, or medication list.",
            "route": "none",
        }

    logger.info(f"Processing request (length={len(prompt)})")

    try:
        # Run the LangGraph workflow
        result = await app.ainvoke(
            {
                "messages": [{"role": "user", "content": prompt}],
                "metadata": metadata,
            }
        )

        response = result.get("response", "")
        route = result.get("route", "unknown")

        return {
            "response": response,
            "route": route,
        }

    except Exception as e:
        logger.error(f"Agent error: {e}", exc_info=True)
        return {
            "response": json.dumps(
                {
                    "severity": "ROUTINE",
                    "title": "Service Temporarily Unavailable",
                    "summary": "We encountered an error processing your request. Please try again.",
                    "recommendations": [
                        "If you are experiencing a medical emergency, call 911.",
                    ],
                    "citations": [],
                    "nextSteps": ["Try again in a few moments"],
                    "warningSignsToWatch": [
                        "If symptoms are severe, seek immediate medical attention"
                    ],
                }
            ),
            "route": "error",
        }
