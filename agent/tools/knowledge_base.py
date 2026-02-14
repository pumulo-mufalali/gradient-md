"""Knowledge Base retrieval tool for Gradient AI RAG."""

from __future__ import annotations

import logging
import os

import httpx
from gradient_adk import trace_retriever

logger = logging.getLogger(__name__)

GRADIENT_MODEL_ACCESS_KEY = os.getenv("GRADIENT_MODEL_ACCESS_KEY", "")
DIGITALOCEAN_API_TOKEN = os.getenv("DIGITALOCEAN_API_TOKEN", "")

# These will be set after creating Knowledge Bases in DO Control Panel
CDC_KB_UUID = os.getenv("CDC_KB_UUID", "")
WHO_KB_UUID = os.getenv("WHO_KB_UUID", "")
NIH_KB_UUID = os.getenv("NIH_KB_UUID", "")

API_BASE = "https://api.digitalocean.com/v2/gen-ai"


@trace_retriever("search_cdc_guidelines")
async def search_cdc_guidelines(query: str, top_k: int = 5) -> list[dict]:
    """Search CDC clinical guidelines knowledge base."""
    return await _search_knowledge_base(CDC_KB_UUID, query, top_k)


@trace_retriever("search_who_protocols")
async def search_who_protocols(query: str, top_k: int = 5) -> list[dict]:
    """Search WHO treatment protocols knowledge base."""
    return await _search_knowledge_base(WHO_KB_UUID, query, top_k)


@trace_retriever("search_nih_drug_data")
async def search_nih_drug_data(query: str, top_k: int = 5) -> list[dict]:
    """Search NIH/FDA drug database knowledge base."""
    return await _search_knowledge_base(NIH_KB_UUID, query, top_k)


@trace_retriever("search_all_knowledge_bases")
async def search_all_knowledge_bases(query: str, top_k: int = 3) -> list[dict]:
    """Search all knowledge bases and merge results."""
    results = []
    for kb_uuid, source in [
        (CDC_KB_UUID, "CDC"),
        (WHO_KB_UUID, "WHO"),
        (NIH_KB_UUID, "NIH/FDA"),
    ]:
        if kb_uuid:
            docs = await _search_knowledge_base(kb_uuid, query, top_k)
            for doc in docs:
                doc["source"] = source
            results.extend(docs)

    # Sort by relevance score (descending)
    results.sort(key=lambda x: x.get("score", 0), reverse=True)
    return results[:top_k * 2]  # Return top results across all KBs


async def _search_knowledge_base(
    kb_uuid: str, query: str, top_k: int = 5
) -> list[dict]:
    """Internal helper to search a specific knowledge base via DO API.

    Note: In production with the ADK, the knowledge base is attached directly
    to the agent and RAG happens automatically. This function is for cases
    where we need explicit retrieval control.
    """
    if not kb_uuid:
        logger.warning("Knowledge base UUID not configured, skipping search")
        return []

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # Use the DigitalOcean API to query the knowledge base
            response = await client.post(
                f"{API_BASE}/knowledge_bases/{kb_uuid}/query",
                headers={
                    "Authorization": f"Bearer {DIGITALOCEAN_API_TOKEN}",
                    "Content-Type": "application/json",
                },
                json={
                    "query": query,
                    "top_k": top_k,
                },
            )
            response.raise_for_status()
            data = response.json()

            return [
                {
                    "content": doc.get("page_content", ""),
                    "filename": doc.get("filename", "Unknown"),
                    "score": doc.get("score", 0),
                    "metadata": doc.get("metadata", {}),
                }
                for doc in data.get("results", [])
            ]

    except httpx.HTTPStatusError as e:
        logger.error(f"KB search HTTP error: {e.response.status_code}")
        return []
    except Exception as e:
        logger.error(f"KB search error: {e}")
        return []


def format_retrieval_context(results: list[dict]) -> str:
    """Format retrieved documents into a context string for the LLM."""
    if not results:
        return "No relevant clinical guidelines were found in the knowledge base."

    context_parts = ["Relevant clinical guidelines retrieved:\n"]
    for i, doc in enumerate(results, 1):
        source = doc.get("source", "Unknown")
        filename = doc.get("filename", "Unknown document")
        content = doc.get("content", "")
        context_parts.append(
            f"[Source {i}: {source} - {filename}]\n{content}\n"
        )

    return "\n".join(context_parts)
