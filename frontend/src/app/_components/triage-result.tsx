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
    <div className="flex flex-col gap-4">
      {/* Severity badge */}
      <div className="glass-card overflow-hidden">
        <div className={`${config.className} px-5 py-3`}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20 text-sm font-bold">
              {config.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold">{config.label}</h2>
              <p className="text-xs opacity-90">{config.description}</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="mb-1.5 text-base font-semibold">{result.title}</h3>
          <p className="text-sm leading-relaxed text-[var(--color-muted)]">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card p-5">
        <h3 className="mb-3 text-base font-semibold">Recommendations</h3>
        <ul className="flex flex-col gap-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-[10px] font-semibold text-[var(--color-primary)]">
                {i + 1}
              </div>
              <span className="leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Citations */}
      {result.citations.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="mb-3 text-base font-semibold">Sources</h3>
          <div className="flex flex-col gap-2.5">
            {result.citations.map((citation, i) => (
              <CitationCard key={i} citation={citation} />
            ))}
          </div>
        </div>
      )}

      {/* Warning signs */}
      {result.warningSignsToWatch.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 dark:border-amber-800/30 dark:bg-amber-900/10">
          <h3 className="mb-2 text-base font-semibold text-amber-800 dark:text-amber-300">
            Warning Signs to Watch
          </h3>
          <p className="mb-2.5 text-xs text-amber-700 dark:text-amber-400">
            Seek immediate medical attention if you experience any of the
            following:
          </p>
          <ul className="flex flex-col gap-1.5">
            {result.warningSignsToWatch.map((sign, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300"
              >
                <span className="mt-0.5 text-xs text-amber-600">
                  {"!"}
                </span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next steps */}
      <div className="glass-card p-5">
        <h3 className="mb-3 text-base font-semibold">Next Steps</h3>
        <ul className="flex flex-col gap-2">
          {result.nextSteps.map((nextStep, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
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
                className="mt-0.5 shrink-0 text-[var(--color-accent)]"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="leading-relaxed">{nextStep}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ask follow-up */}
      <div className="text-center">
        <button
          onClick={onAskFollowUp}
          className="btn-secondary text-sm"
        >
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
            className="mr-1.5"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Ask a Follow-Up Question
        </button>
      </div>
    </div>
  );
}
