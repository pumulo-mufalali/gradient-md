"""Medical Q&A agent node — answers health questions with cited sources."""

from __future__ import annotations

import logging
import os

import httpx
from gradient_adk import trace_llm

from prompts.qa_prompt import QA_SYSTEM_PROMPT, QA_USER_PROMPT
from tools.knowledge_base import (
    format_retrieval_context,
    search_all_knowledge_bases,
)

logger = logging.getLogger(__name__)

GRADIENT_MODEL_ACCESS_KEY = os.getenv("GRADIENT_MODEL_ACCESS_KEY", "")
INFERENCE_URL = "https://inference.do-ai.run/v1/chat/completions"
QA_MODEL = "llama3.3-70b-instruct"


async def qa_node(state: dict) -> dict:
    """LangGraph node: Answer a medical question with cited sources."""
    messages = state.get("messages", [])
    if not messages:
        return {
            **state,
            "response": "Please ask a specific health question and I'll do my best to help.",
        }

    last_message = messages[-1]
    question = (
        last_message.get("content", "")
        if isinstance(last_message, dict)
        else str(last_message)
    )

    # Search all knowledge bases for relevant context
    results = await search_all_knowledge_bases(question)
    retrieval_context = format_retrieval_context(results)

    # Generate answer
    answer = await _generate_answer(question, retrieval_context)
    return {**state, "response": answer}


@trace_llm("medical_qa_answer")
async def _generate_answer(question: str, retrieval_context: str) -> str:
    """Generate a cited answer to the medical question."""
    user_prompt = QA_USER_PROMPT.format(
        question=question,
        retrieval_context=retrieval_context,
    )

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                INFERENCE_URL,
                headers={
                    "Authorization": f"Bearer {GRADIENT_MODEL_ACCESS_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": QA_MODEL,
                    "messages": [
                        {"role": "system", "content": QA_SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt},
                    ],
                    "max_tokens": 1500,
                    "temperature": 0.2,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    except Exception as e:
        logger.error(f"Q&A generation error: {e}")
        return (
            "I apologize, but I was unable to process your question at this time. "
            "Please try again or consult a healthcare provider for guidance.\n\n"
            "*This information is for educational purposes only and is not a substitute "
            "for professional medical advice.*"
        )
