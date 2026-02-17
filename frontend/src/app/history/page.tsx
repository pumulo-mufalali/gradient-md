"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface HistoryEntry {
  id: number;
  date: string;
  symptoms: string;
  severity: string;
  title: string;
}

const severityBadge: Record<string, string> = {
  EMERGENCY: "severity-emergency",
  URGENT: "severity-urgent",
  ROUTINE: "severity-routine",
  SELF_CARE: "severity-selfcare",
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("gradientmd-history");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("gradientmd-history");
    setHistory([]);
  };

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold tracking-tight">
              Triage History
            </h1>
            <p className="text-sm text-[var(--color-muted)]">
              Your previous symptom assessments (stored locally).
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="btn-secondary text-xs text-red-500"
              style={{
                borderColor: "rgba(239, 68, 68, 0.2)",
              }}
            >
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="glass-card flex flex-col items-center py-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-3 text-[var(--color-muted)]"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h2 className="mb-1 text-base font-semibold">No History Yet</h2>
            <p className="mb-4 text-sm text-[var(--color-muted)]">
              Your triage assessments will appear here after you complete a
              symptom check.
            </p>
            <Link href="/triage" className="btn-primary text-sm">
              Start Symptom Check
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="glass-card flex items-center gap-3 p-3.5"
              >
                <span
                  className={`inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                    severityBadge[entry.severity] || "bg-gray-200"
                  }`}
                >
                  {entry.severity.replace("_", " ")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{entry.title}</p>
                  <p className="truncate text-xs text-[var(--color-muted)]">
                    {entry.symptoms}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-[var(--color-muted)]">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
