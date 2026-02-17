"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TriageResult,
  type TriageResultData,
} from "../_components/triage-result";
import { ChatInterface } from "../_components/chat-interface";

export default function ResultsPage() {
  const [result, setResult] = useState<TriageResultData | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [symptomContext, setSymptomContext] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("triageResult");
    const symptoms = sessionStorage.getItem("symptomData");

    if (!stored) {
      router.push("/triage");
      return;
    }

    setResult(JSON.parse(stored));
    if (symptoms) {
      setSymptomContext(symptoms);
    }
  }, [router]);

  if (!result) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-6 w-6 animate-spin text-[var(--color-primary)]"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-1.5 text-2xl font-bold tracking-tight">
            Triage Results
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            Based on the information you provided, here is your AI-generated
            assessment.
          </p>
        </div>

        <TriageResult result={result} onAskFollowUp={() => setShowChat(true)} />

        {showChat && (
          <div className="mt-6">
            <ChatInterface initialContext={symptomContext} />
          </div>
        )}

        {/* Feedback */}
        <div className="mt-8 text-center">
          <p className="mb-2.5 text-xs text-[var(--color-muted)]">
            Was this assessment helpful?
          </p>
          <div className="flex items-center justify-center gap-2">
            <FeedbackButton type="up" resultId={result.title} />
            <FeedbackButton type="down" resultId={result.title} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackButton({
  type,
  resultId,
}: {
  type: "up" | "down";
  resultId: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (submitted) return;
    setSubmitted(true);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultId,
          feedback: type === "up" ? "positive" : "negative",
        }),
      });
    } catch {
      // Feedback is non-critical, silently fail
    }
  };

  return (
    <button
      onClick={submit}
      disabled={submitted}
      className={`btn-secondary text-xs transition-all ${
        submitted
          ? type === "up"
            ? "border-green-300 bg-green-50 text-green-600"
            : "border-red-300 bg-red-50 text-red-600"
          : ""
      }`}
    >
      {type === "up" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
      )}
      {submitted ? "Thanks!" : type === "up" ? "Helpful" : "Not helpful"}
    </button>
  );
}
