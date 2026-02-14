"use client";

import { useState } from "react";

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: "high" | "moderate" | "low";
  description: string;
  source: string;
}

interface DrugCheckResult {
  interactions: DrugInteraction[];
  summary: string;
}

export function DrugChecker() {
  const [medications, setMedications] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DrugCheckResult | null>(null);

  const addMedication = () => {
    setMedications((prev) => [...prev, ""]);
  };

  const removeMedication = (index: number) => {
    if (medications.length <= 1) return;
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, value: string) => {
    setMedications((prev) => prev.map((m, i) => (i === index ? value : m)));
  };

  const checkInteractions = async () => {
    const meds = medications.filter((m) => m.trim() !== "");
    if (meds.length < 2) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medications: meds }),
      });

      if (!response.ok) throw new Error("Failed to check interactions");

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        interactions: [],
        summary:
          "Unable to check interactions at this time. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const severityColor = {
    high: "text-red-600 bg-red-500/10 border-red-500/30",
    moderate: "text-amber-600 bg-amber-500/10 border-amber-500/30",
    low: "text-green-600 bg-green-500/10 border-green-500/30",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="glass-card p-8 md:p-10">
        <h2 className="mb-2 text-2xl font-bold">Enter Medications</h2>
        <p className="mb-8 text-sm leading-relaxed text-[var(--color-muted)]">
          Enter two or more medications to check for potential interactions.
          Data sourced from NIH/FDA databases.
        </p>

        <div className="space-y-4">
          {medications.map((med, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-xs font-bold text-white">
                {i + 1}
              </span>
              <input
                type="text"
                value={med}
                onChange={(e) => updateMedication(i, e.target.value)}
                placeholder={`Medication ${i + 1} (e.g., ${i === 0 ? "Aspirin" : i === 1 ? "Warfarin" : "Ibuprofen"})`}
                className="flex-1 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
              {medications.length > 1 && (
                <button
                  onClick={() => removeMedication(i)}
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-[var(--color-muted)] transition-colors hover:bg-red-500/10 hover:text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={addMedication}
            className="btn-secondary !px-6 !py-4 text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Medication
          </button>
          <button
            onClick={checkInteractions}
            disabled={
              isLoading || medications.filter((m) => m.trim()).length < 2
            }
            className="btn-primary !px-10 !py-4 text-base font-bold"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Checking...
              </span>
            ) : (
              "Check Interactions"
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="glass-card p-6">
            <h3 className="mb-2 text-lg font-semibold">Results</h3>
            <p className="text-sm text-[var(--color-muted)]">
              {result.summary}
            </p>
          </div>

          {result.interactions.map((interaction, i) => (
            <div
              key={i}
              className={`glass-card border ${severityColor[interaction.severity]} p-6`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold uppercase ${severityColor[interaction.severity]}`}
                >
                  {interaction.severity} risk
                </span>
                <span className="text-sm font-medium">
                  {interaction.drug1} + {interaction.drug2}
                </span>
              </div>
              <p className="text-sm">{interaction.description}</p>
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                Source: {interaction.source}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
