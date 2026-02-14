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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Triage History</h1>
          <p className="text-[var(--color-muted)]">
            Your previous symptom assessments (stored locally on your device).
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="btn-secondary !px-6 !py-2.5 !text-sm !text-red-500 !border-red-500/20 hover:!bg-red-500/10"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card flex flex-col items-center py-16 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4 text-[var(--color-muted)]"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h2 className="mb-2 text-lg font-semibold">No History Yet</h2>
          <p className="mb-4 text-sm text-[var(--color-muted)]">
            Your triage assessments will appear here after you complete a
            symptom check.
          </p>
          <Link
            href="/triage"
            className="btn-primary !px-8 !py-3 !text-sm font-bold shadow-lg"
          >
            Start Symptom Check
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => (
            <div key={entry.id} className="glass-card flex items-center gap-4 p-4">
              <span
                className={`inline-flex shrink-0 rounded-lg px-3 py-1 text-xs font-bold ${severityBadge[entry.severity] || "bg-gray-200"
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
  );
}
