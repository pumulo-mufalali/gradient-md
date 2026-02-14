"""Drug interaction lookup via OpenFDA API."""

from __future__ import annotations

import logging

import httpx
from gradient_adk import trace_tool

logger = logging.getLogger(__name__)

OPENFDA_BASE = "https://api.fda.gov/drug"


@trace_tool("check_drug_interactions")
async def check_drug_interactions(medications: list[str]) -> dict:
    """Check for drug interactions using the OpenFDA API.

    Args:
        medications: List of medication names to check.

    Returns:
        Dictionary with interaction results.
    """
    interactions = []

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            # Search for drug label information for each medication
            for i, drug1 in enumerate(medications):
                for drug2 in medications[i + 1 :]:
                    interaction = await _check_pair(client, drug1, drug2)
                    if interaction:
                        interactions.append(interaction)

    except Exception as e:
        logger.error(f"Drug interaction check error: {e}")
        return {
            "interactions": [],
            "summary": f"Unable to check interactions: {str(e)}. "
            "Please consult your pharmacist.",
        }

    if interactions:
        high_count = sum(1 for i in interactions if i["severity"] == "high")
        summary = (
            f"Found {len(interactions)} potential interaction(s) between your "
            f"medications. {high_count} high-risk interaction(s) detected. "
            "Please consult your healthcare provider about these findings."
        )
    else:
        summary = (
            "No known interactions found between the specified medications in "
            "the FDA database. However, always inform your healthcare provider "
            "about all medications you are taking."
        )

    return {"interactions": interactions, "summary": summary}


async def _check_pair(
    client: httpx.AsyncClient, drug1: str, drug2: str
) -> dict | None:
    """Check for interactions between two specific drugs."""
    try:
        # Search OpenFDA for drug label warnings mentioning the other drug
        response = await client.get(
            f"{OPENFDA_BASE}/label.json",
            params={
                "search": (
                    f'(openfda.generic_name:"{drug1}") AND '
                    f'(drug_interactions:"{drug2}")'
                ),
                "limit": 1,
            },
        )

        if response.status_code == 200:
            data = response.json()
            results = data.get("results", [])
            if results:
                interaction_text = results[0].get("drug_interactions", [""])[0]
                # Determine severity based on keywords
                severity = _classify_severity(interaction_text)
                return {
                    "drug1": drug1,
                    "drug2": drug2,
                    "severity": severity,
                    "description": interaction_text[:500],
                    "source": "FDA Drug Label Database (OpenFDA)",
                }

        # Try reverse search
        response = await client.get(
            f"{OPENFDA_BASE}/label.json",
            params={
                "search": (
                    f'(openfda.generic_name:"{drug2}") AND '
                    f'(drug_interactions:"{drug1}")'
                ),
                "limit": 1,
            },
        )

        if response.status_code == 200:
            data = response.json()
            results = data.get("results", [])
            if results:
                interaction_text = results[0].get("drug_interactions", [""])[0]
                severity = _classify_severity(interaction_text)
                return {
                    "drug1": drug1,
                    "drug2": drug2,
                    "severity": severity,
                    "description": interaction_text[:500],
                    "source": "FDA Drug Label Database (OpenFDA)",
                }

    except Exception as e:
        logger.warning(f"Error checking {drug1} + {drug2}: {e}")

    return None


def _classify_severity(text: str) -> str:
    """Classify interaction severity based on warning text."""
    text_lower = text.lower()

    high_keywords = [
        "contraindicated",
        "fatal",
        "death",
        "life-threatening",
        "do not use",
        "never",
        "serious",
        "severe",
        "dangerous",
        "bleeding",
        "cardiac arrest",
        "serotonin syndrome",
    ]

    moderate_keywords = [
        "caution",
        "monitor",
        "may increase",
        "may decrease",
        "adjust dose",
        "use with caution",
        "closely monitored",
        "concurrent use",
    ]

    if any(kw in text_lower for kw in high_keywords):
        return "high"
    elif any(kw in text_lower for kw in moderate_keywords):
        return "moderate"
    return "low"
