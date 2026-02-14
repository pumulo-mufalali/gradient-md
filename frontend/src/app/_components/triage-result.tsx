"use client";

import { CitationCard, type Citation } from "./citation-card";

export type SeverityLevel = "EMERGENCY" | "URGENT" | "ROUTINE" | "SELF_CARE";

export interface TriageResultData {
  severity: SeverityLevel;
  title: string;
  summary: string;
  recommendations: string[];
  citations: Citation[];
  nextSteps: string[];
  warningSignsToWatch: string[];
}

const SEVERITY_CONFIG: Record<
  SeverityLevel,
  { label: string; className: string; icon: string; description: string }
> = {
  EMERGENCY: {
    label: "Emergency",
    className: "severity-emergency animate-pulse-emergency",
    icon: "!!",
    description: "Seek emergency care immediately. Call 911 if needed.",
  },
  URGENT: {
    label: "Urgent",
    className: "severity-urgent",
    icon: "!",
    description: "See a doctor within 24 hours.",
  },
  ROUTINE: {
    label: "Routine",
    className: "severity-routine",
    icon: "i",
    description: "Schedule an appointment this week.",
  },
  SELF_CARE: {
    label: "Self-Care",
    className: "severity-selfcare",
    icon: "+",
    description: "Manageable at home with monitoring.",
  },
};

interface TriageResultProps {
  result: TriageResultData;
  onAskFollowUp: () => void;
}

export function TriageResult({ result, onAskFollowUp }: TriageResultProps) {
  const config = SEVERITY_CONFIG[result.severity];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Severity badge */}
      <div className="glass-card overflow-hidden">
        <div className={`${config.className} px-6 py-4`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
              {config.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold">{config.label}</h2>
              <p className="text-sm opacity-90">{config.description}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="mb-2 text-lg font-semibold">{result.title}</h3>
          <p className="text-sm text-[var(--color-muted)]">{result.summary}</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Recommendations</h3>
        <ul className="space-y-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xs font-bold text-[var(--color-primary)]">
                {i + 1}
              </div>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Citations */}
      {result.citations.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Sources</h3>
          <div className="space-y-3">
            {result.citations.map((citation, i) => (
              <CitationCard key={i} citation={citation} />
            ))}
          </div>
        </div>
      )}

      {/* Warning signs */}
      {result.warningSignsToWatch.length > 0 && (
        <div className="glass-card border-amber-500/30 bg-amber-500/5 p-6">
          <h3 className="mb-3 text-lg font-semibold text-amber-700 dark:text-amber-400">
            Warning Signs to Watch
          </h3>
          <p className="mb-3 text-sm text-[var(--color-muted)]">
            Seek immediate medical attention if you experience any of the
            following:
          </p>
          <ul className="space-y-1.5">
            {result.warningSignsToWatch.map((sign, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300"
              >
                <span className="mt-0.5 text-amber-600">&#9888;</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next steps */}
      <div className="glass-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Next Steps</h3>
        <ul className="space-y-2">
          {result.nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 shrink-0 text-[var(--color-accent)]"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ask follow-up */}
      <div className="text-center">
        <button
          onClick={onAskFollowUp}
          className="btn-secondary !px-8 !py-4 text-base font-bold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Ask a Follow-Up Question
        </button>
      </div>
    </div>
  );
}
