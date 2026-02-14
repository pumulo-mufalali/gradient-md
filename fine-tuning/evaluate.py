"""Evaluate the fine-tuned model on medical QA benchmarks.

Tests the model's accuracy on a held-out validation set and measures
medical reasoning quality.

Usage:
    python evaluate.py --model output/gradientmd-medical-llama3.1-8b
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

VAL_DATA = "data/processed/val.jsonl"


def load_model(model_path: str):
    """Load the fine-tuned model for evaluation."""
    print(f"Loading model from {model_path}...")

    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)

    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=torch.bfloat16,
    )

    model = AutoModelForCausalLM.from_pretrained(
        model_path,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True,
    )

    return model, tokenizer


def evaluate(model, tokenizer, data_path: str, num_samples: int = 100) -> dict:
    """Evaluate the model on validation data."""
    print(f"\nEvaluating on {data_path}...")

    # Load validation data
    examples = []
    with open(data_path) as f:
        for line in f:
            examples.append(json.loads(line))

    examples = examples[:num_samples]
    print(f"Evaluating on {len(examples)} examples")

    correct = 0
    total = 0
    results = []

    for i, example in enumerate(examples):
        messages = example["messages"]

        # Get the expected answer (last assistant message)
        expected = messages[-1]["content"]

        # Generate prediction (use all messages except the last)
        input_messages = messages[:-1]
        prompt = tokenizer.apply_chat_template(
            input_messages, tokenize=False, add_generation_prompt=True
        )

        inputs = tokenizer(
            prompt, return_tensors="pt", truncation=True, max_length=2048
        ).to(model.device)

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=500,
                temperature=0.1,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
            )

        predicted = tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True
        )

        # Simple evaluation: check if key medical terms from expected answer
        # appear in the prediction
        expected_lower = expected.lower()
        predicted_lower = predicted.lower()

        # Extract key medical terms (words > 5 chars) from expected answer
        key_terms = [
            w for w in expected_lower.split()
            if len(w) > 5 and w.isalpha()
        ]

        if key_terms:
            matching = sum(1 for t in key_terms if t in predicted_lower)
            overlap = matching / len(key_terms)
            is_correct = overlap >= 0.3  # 30% keyword overlap threshold
        else:
            is_correct = len(predicted.strip()) > 0

        if is_correct:
            correct += 1
        total += 1

        results.append({
            "correct": is_correct,
            "overlap": overlap if key_terms else 1.0,
        })

        if (i + 1) % 10 == 0:
            print(f"  Progress: {i + 1}/{len(examples)} | "
                  f"Accuracy: {correct}/{total} ({100 * correct / total:.1f}%)")

    accuracy = correct / total if total > 0 else 0
    avg_overlap = sum(r["overlap"] for r in results) / len(results) if results else 0

    print(f"\n{'=' * 50}")
    print(f"Evaluation Results:")
    print(f"  Accuracy (keyword overlap >= 30%): {accuracy:.2%}")
    print(f"  Average keyword overlap: {avg_overlap:.2%}")
    print(f"  Samples evaluated: {total}")
    print(f"{'=' * 50}")

    return {
        "accuracy": accuracy,
        "avg_overlap": avg_overlap,
        "total": total,
        "correct": correct,
    }


def main():
    """Run evaluation."""
    parser = argparse.ArgumentParser(description="Evaluate fine-tuned model")
    parser.add_argument(
        "--model",
        type=str,
        default="output/gradientmd-medical-llama3.1-8b",
        help="Path to fine-tuned model",
    )
    parser.add_argument(
        "--data",
        type=str,
        default=VAL_DATA,
        help="Path to validation data",
    )
    parser.add_argument(
        "--samples",
        type=int,
        default=100,
        help="Number of samples to evaluate",
    )
    args = parser.parse_args()

    model, tokenizer = load_model(args.model)
    results = evaluate(model, tokenizer, args.data, args.samples)

    # Save results
    output_path = Path("output/eval_results.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to {output_path}")


if __name__ == "__main__":
    main()
