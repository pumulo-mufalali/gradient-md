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
      <div className="container-custom py-12 md:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-2 h-7 w-40 animate-pulse rounded bg-[var(--color-muted-bg)]" />
            <div className="mx-auto h-4 w-64 animate-pulse rounded bg-[var(--color-muted-bg)]" />
          </div>
          <div className="flex flex-col gap-4">
            {/* Severity skeleton */}
            <div className="glass-card overflow-hidden">
              <div className="h-16 animate-pulse bg-[var(--color-muted-bg)]" />
              <div className="p-5">
                <div className="mb-2 h-5 w-48 animate-pulse rounded bg-[var(--color-muted-bg)]" />
                <div className="h-4 w-full animate-pulse rounded bg-[var(--color-muted-bg)]" />
                <div className="mt-1.5 h-4 w-3/4 animate-pulse rounded bg-[var(--color-muted-bg)]" />
              </div>
            </div>
            {/* Recommendations skeleton */}
            <div className="glass-card p-5">
              <div className="mb-3 h-5 w-36 animate-pulse rounded bg-[var(--color-muted-bg)]" />
              <div className="flex flex-col gap-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-5 w-5 shrink-0 animate-pulse rounded-md bg-[var(--color-muted-bg)]" />
                    <div className="h-4 w-full animate-pulse rounded bg-[var(--color-muted-bg)]" />
                  </div>
                ))}
              </div>
            </div>
            {/* Citations skeleton */}
            <div className="glass-card p-5">
              <div className="mb-3 h-5 w-20 animate-pulse rounded bg-[var(--color-muted-bg)]" />
              <div className="flex flex-col gap-2.5">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-md border border-[var(--color-card-border)] bg-[var(--color-muted-bg)] p-3.5"
                  >
                    <div className="mb-2 h-3 w-24 animate-pulse rounded bg-[var(--color-card-border)]" />
                    <div className="h-3 w-full animate-pulse rounded bg-[var(--color-card-border)]" />
                    <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-[var(--color-card-border)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isEmergent =
    result.severity === "EMERGENCY" || result.severity === "URGENT";

  return (
    <>
      {/* Sticky emergency banner */}
      {isEmergent && (
        <div
          className={`sticky top-14 z-40 border-b px-4 py-2.5 text-center ${
            result.severity === "EMERGENCY"
              ? "animate-pulse-emergency border-red-300 bg-red-600 text-white"
              : "border-orange-300 bg-orange-500 text-white"
          }`}
        >
          <div className="container-custom flex items-center justify-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <p className="text-sm font-semibold">
              {result.severity === "EMERGENCY"
                ? "If this is a life-threatening emergency, call 911 immediately."
                : "Consider seeing a doctor within 24 hours."}
            </p>
            <a
              href="tel:911"
              className="shrink-0 rounded-md bg-white/20 px-3 py-1 text-xs font-bold transition-colors hover:bg-white/30"
            >
              Call 911
            </a>
          </div>
        </div>
      )}

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
    </>
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
