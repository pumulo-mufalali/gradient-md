"""Nearby medical facility lookup tool."""

from __future__ import annotations

import logging

import httpx
from gradient_adk import trace_tool

logger = logging.getLogger(__name__)


@trace_tool("get_nearby_facilities")
async def get_nearby_facilities(
    zip_code: str, facility_type: str = "hospital"
) -> list[dict]:
    """Look up nearby medical facilities by ZIP code.

    Uses a public API to find hospitals, urgent care centers, and ERs.

    Args:
        zip_code: US ZIP code.
        facility_type: Type of facility (hospital, urgent_care, pharmacy).

    Returns:
        List of nearby facilities with name, address, and phone.
    """
    try:
        # Use the CMS (Centers for Medicare & Medicaid Services) public API
        # for hospital data
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                "https://data.cms.gov/provider-data/api/1/datastore/query/xubh-q36u/0",
                params={
                    "conditions[0][property]": "zip_code",
                    "conditions[0][value]": zip_code,
                    "conditions[0][operator]": "=",
                    "limit": 5,
                    "sort[0][property]": "hospital_name",
                    "sort[0][order]": "asc",
                },
            )

            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                return [
                    {
                        "name": r.get("hospital_name", "Unknown"),
                        "address": f"{r.get('address', '')}, {r.get('city', '')}, {r.get('state', '')} {r.get('zip_code', '')}",
                        "phone": r.get("phone_number", "N/A"),
                        "type": r.get("hospital_type", "General"),
                        "emergency_services": r.get(
                            "emergency_services", "Unknown"
                        ),
                    }
                    for r in results
                ]

    except Exception as e:
        logger.error(f"Facility lookup error: {e}")

    return []


@trace_tool("get_emergency_numbers")
async def get_emergency_numbers(country_code: str = "US") -> dict:
    """Get emergency contact numbers for a given country.

    Args:
        country_code: ISO country code (default: US).

    Returns:
        Dictionary of emergency numbers.
    """
    # Static mapping of emergency numbers by country
    emergency_numbers = {
        "US": {
            "emergency": "911",
            "poison_control": "1-800-222-1222",
            "suicide_crisis": "988",
            "domestic_violence": "1-800-799-7233",
            "substance_abuse": "1-800-662-4357",
        },
        "UK": {
            "emergency": "999",
            "non_emergency": "111",
            "suicide_crisis": "116 123 (Samaritans)",
        },
        "CA": {
            "emergency": "911",
            "poison_control": "1-800-268-9017",
            "suicide_crisis": "988",
        },
    }

    return emergency_numbers.get(
        country_code,
        {"emergency": "Call local emergency services"},
    )
