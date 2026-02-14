"""Prepare medical QA datasets for fine-tuning.

Downloads and formats MedQA and PubMedQA datasets into the instruction-tuning
format required for QLoRA fine-tuning of Llama 3.1 8B.

Usage:
    python prepare_data.py

Output:
    data/processed/train.jsonl
    data/processed/val.jsonl
"""

from __future__ import annotations

import json
import os
from pathlib import Path

from datasets import load_dataset

OUTPUT_DIR = Path("data/processed")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SYSTEM_PROMPT = """You are a medical triage assistant. Your role is to assess the urgency of 
patient symptoms and provide evidence-based clinical guidance. Always cite specific medical 
guidelines when providing recommendations. Classify urgency as: EMERGENCY, URGENT, ROUTINE, 
or SELF_CARE. Never diagnose — only assess urgency and provide guidance."""


def format_medqa_example(example: dict) -> dict | None:
    """Format a MedQA example into instruction-tuning format."""
    question = example.get("question", "")
    options = example.get("options", {})
    answer_idx = example.get("answer_idx", "")
    answer = example.get("answer", "")

    if not question or not answer:
        return None

    # Format options
    options_text = "\n".join(
        f"  {k}) {v}" for k, v in options.items()
    ) if isinstance(options, dict) else ""

    user_msg = f"Medical question: {question}"
    if options_text:
        user_msg += f"\n\nOptions:\n{options_text}"

    # Create a detailed answer
    assistant_msg = (
        f"The correct answer is {answer_idx}) {answer}.\n\n"
        f"Clinical reasoning: Based on established medical guidelines, "
        f"this is the most appropriate answer. "
        f"Always consult a healthcare provider for personalized medical advice."
    )

    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
            {"role": "assistant", "content": assistant_msg},
        ]
    }


def format_pubmedqa_example(example: dict) -> dict | None:
    """Format a PubMedQA example into instruction-tuning format."""
    question = example.get("question", "")
    context = example.get("context", {})
    long_answer = example.get("long_answer", "")
    final_decision = example.get("final_decision", "")

    if not question or not long_answer:
        return None

    # Build context from abstract
    context_text = ""
    if isinstance(context, dict):
        contexts = context.get("contexts", [])
        if isinstance(contexts, list):
            context_text = " ".join(str(c) for c in contexts[:3])

    user_msg = f"Medical research question: {question}"
    if context_text:
        user_msg += f"\n\nRelevant research context: {context_text[:500]}"

    assistant_msg = (
        f"Based on current medical evidence: {long_answer}\n\n"
        f"Conclusion: {final_decision}\n\n"
        f"*This answer is based on published medical research. "
        f"Consult a healthcare provider for personalized advice.*"
    )

    return {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
            {"role": "assistant", "content": assistant_msg},
        ]
    }


def main() -> None:
    """Download, format, and save training data."""
    all_examples: list[dict] = []

    # Load MedQA dataset
    print("Loading MedQA dataset...")
    try:
        medqa = load_dataset("bigbio/med_qa", "med_qa_en_source", split="train",
                             trust_remote_code=True)
        print(f"  MedQA: {len(medqa)} examples")
        for example in medqa:
            formatted = format_medqa_example(example)
            if formatted:
                all_examples.append(formatted)
    except Exception as e:
        print(f"  Warning: Could not load MedQA: {e}")
        print("  Trying alternative source...")
        try:
            medqa = load_dataset("GBaker/MedQA-USMLE-4-options", split="train",
                                 trust_remote_code=True)
            print(f"  MedQA (alt): {len(medqa)} examples")
            for example in medqa:
                formatted = format_medqa_example(example)
                if formatted:
                    all_examples.append(formatted)
        except Exception as e2:
            print(f"  Could not load MedQA alternative: {e2}")

    # Load PubMedQA dataset
    print("Loading PubMedQA dataset...")
    try:
        pubmedqa = load_dataset("bigbio/pubmed_qa", "pubmed_qa_labeled_fold0_source",
                                split="train", trust_remote_code=True)
        print(f"  PubMedQA: {len(pubmedqa)} examples")
        for example in pubmedqa:
            formatted = format_pubmedqa_example(example)
            if formatted:
                all_examples.append(formatted)
    except Exception as e:
        print(f"  Warning: Could not load PubMedQA: {e}")
        try:
            pubmedqa = load_dataset("qiaojin/PubMedQA", "pqa_labeled",
                                    split="train", trust_remote_code=True)
            print(f"  PubMedQA (alt): {len(pubmedqa)} examples")
            for example in pubmedqa:
                formatted = format_pubmedqa_example(example)
                if formatted:
                    all_examples.append(formatted)
        except Exception as e2:
            print(f"  Could not load PubMedQA alternative: {e2}")

    print(f"\nTotal formatted examples: {len(all_examples)}")

    if not all_examples:
        print("ERROR: No examples loaded. Check dataset availability.")
        return

    # Split into train/val (90/10)
    split_idx = int(len(all_examples) * 0.9)
    train_data = all_examples[:split_idx]
    val_data = all_examples[split_idx:]

    # Save as JSONL
    train_path = OUTPUT_DIR / "train.jsonl"
    val_path = OUTPUT_DIR / "val.jsonl"

    with open(train_path, "w") as f:
        for example in train_data:
            f.write(json.dumps(example) + "\n")

    with open(val_path, "w") as f:
        for example in val_data:
            f.write(json.dumps(example) + "\n")

    print(f"Training data saved to {train_path} ({len(train_data)} examples)")
    print(f"Validation data saved to {val_path} ({len(val_data)} examples)")


if __name__ == "__main__":
    main()
