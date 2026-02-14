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
          <svg className="mx-auto h-8 w-8 animate-spin text-[var(--color-primary)]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Triage Results</h1>
        <p className="text-[var(--color-muted)]">
          Based on the information you provided, here is your AI-generated
          assessment.
        </p>
      </div>

      <TriageResult result={result} onAskFollowUp={() => setShowChat(true)} />

      {showChat && (
        <div className="mt-8">
          <ChatInterface initialContext={symptomContext} />
        </div>
      )}

      {/* Feedback */}
      <div className="mx-auto mt-8 max-w-2xl text-center">
        <p className="mb-3 text-sm text-[var(--color-muted)]">
          Was this assessment helpful?
        </p>
        <div className="flex items-center justify-center gap-3">
          <FeedbackButton type="up" resultId={result.title} />
          <FeedbackButton type="down" resultId={result.title} />
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
      className={`btn-secondary !px-5 !py-3 !text-sm !font-bold transition-all ${submitted
          ? type === "up"
            ? "!border-green-500/30 !bg-green-500/10 !text-green-600"
            : "!border-red-500/30 !bg-red-500/10 !text-red-600"
          : "hover:!scale-105"
        }`}
    >
      {type === "up" ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
      )}
      {submitted ? "Thanks!" : type === "up" ? "Helpful" : "Not helpful"}
    </button>
  );
}
