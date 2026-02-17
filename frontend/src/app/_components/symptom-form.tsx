"use client";

import { useState } from "react";

export interface SymptomData {
  age: string;
  sex: string;
  symptoms: string;
  duration: string;
  severity: string;
  medications: string;
  conditions: string;
  additionalInfo: string;
}

const INITIAL_DATA: SymptomData = {
  age: "",
  sex: "",
  symptoms: "",
  duration: "",
  severity: "",
  medications: "",
  conditions: "",
  additionalInfo: "",
};

interface SymptomFormProps {
  onSubmit: (data: SymptomData) => void;
  isLoading: boolean;
}

const STEPS = [
  { id: "demographics", label: "About You" },
  { id: "symptoms", label: "Symptoms" },
  { id: "history", label: "History" },
  { id: "review", label: "Review" },
];

export function SymptomForm({ onSubmit, isLoading }: SymptomFormProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SymptomData>(INITIAL_DATA);

  const update = (field: keyof SymptomData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const canAdvance = () => {
    switch (step) {
      case 0:
        return data.age.trim() !== "" && data.sex !== "";
      case 1:
        return (
          data.symptoms.trim() !== "" &&
          data.duration !== "" &&
          data.severity !== ""
        );
      case 2:
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    onSubmit(data);
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-3">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i >= step}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                  i === step
                    ? "step-active"
                    : i < step
                      ? "step-completed"
                      : "step-pending"
                }`}
              >
                {i < step ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </button>
              <span
                className={`hidden text-[10px] font-medium uppercase tracking-wider sm:block ${
                  i === step
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-muted)]"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px w-8 transition-colors ${
                  i < step
                    ? "bg-[var(--color-accent)]"
                    : "bg-[var(--color-card-border)]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="glass-card p-6 md:p-8">
        <div className="mb-6 text-center">
          <h2 className="mb-1.5 text-xl font-bold tracking-tight">
            {STEPS[step].label}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--color-muted)]">
            {step === 0 &&
              "Basic information to help the AI understand your context."}
            {step === 1 &&
              "Describe your symptoms in detail for a better assessment."}
            {step === 2 &&
              "Your medical background provides crucial context."}
            {step === 3 &&
              "Please verify all details before the clinical analysis."}
          </p>
        </div>

        {/* Step 0: Demographics */}
        {step === 0 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
                Age
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={data.age}
                onChange={(e) => update("age", e.target.value)}
                placeholder="Enter your age"
                className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
                Biological Sex
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Male", "Female", "Other"].map((option) => (
                  <button
                    key={option}
                    onClick={() => update("sex", option.toLowerCase())}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                      data.sex === option.toLowerCase()
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                        : "border-[var(--color-card-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-muted-bg)]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Symptoms */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
                Describe your symptoms
              </label>
              <textarea
                value={data.symptoms}
                onChange={(e) => update("symptoms", e.target.value)}
                placeholder="e.g., I have a persistent headache on the right side, nausea, and sensitivity to light..."
                rows={3}
                className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm leading-relaxed outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
                How long have you had these symptoms?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  "Less than 24 hours",
                  "1-3 days",
                  "4-7 days",
                  "More than a week",
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => update("duration", option)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      data.duration === option
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                        : "border-[var(--color-card-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-muted-bg)]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-foreground)]">
                Pain / Discomfort Severity
              </label>
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => update("severity", String(num))}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                      data.severity === String(num)
                        ? num <= 3
                          ? "border-green-500 bg-green-50 text-green-700"
                          : num <= 6
                            ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-red-500 bg-red-50 text-red-700"
                        : "border-[var(--color-card-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-muted-bg)]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex justify-between px-1 text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                <span>Mild</span>
                <span>Severe</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Medical History */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
                Current Medications{" "}
                <span className="font-normal text-[var(--color-muted)]">
                  (optional)
                </span>
              </label>
              <textarea
                value={data.medications}
                onChange={(e) => update("medications", e.target.value)}
                placeholder="e.g., Lisinopril 10mg, Metformin 500mg..."
                rows={2}
                className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
                Existing Medical Conditions{" "}
                <span className="font-normal text-[var(--color-muted)]">
                  (optional)
                </span>
              </label>
              <textarea
                value={data.conditions}
                onChange={(e) => update("conditions", e.target.value)}
                placeholder="e.g., Type 2 diabetes, hypertension..."
                rows={2}
                className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-foreground)]">
                Anything else we should know?{" "}
                <span className="font-normal text-[var(--color-muted)]">
                  (optional)
                </span>
              </label>
              <textarea
                value={data.additionalInfo}
                onChange={(e) => update("additionalInfo", e.target.value)}
                placeholder="e.g., Recent travel, allergies, family history..."
                rows={2}
                className="w-full rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="flex flex-col gap-2">
            {[
              { label: "Age", value: data.age },
              { label: "Sex", value: data.sex },
              { label: "Symptoms", value: data.symptoms },
              { label: "Duration", value: data.duration },
              { label: "Severity", value: `${data.severity}/10` },
              {
                label: "Medications",
                value: data.medications || "None specified",
              },
              {
                label: "Conditions",
                value: data.conditions || "None specified",
              },
              {
                label: "Additional Info",
                value: data.additionalInfo || "None",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between gap-4 rounded-md bg-[var(--color-muted-bg)] px-3.5 py-2.5"
              >
                <span className="shrink-0 text-xs font-medium text-[var(--color-muted)]">
                  {item.label}
                </span>
                <span className="text-right text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep(step - 1)}
            className={`btn-secondary text-sm ${step === 0 ? "invisible" : ""}`}
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canAdvance()}
              className="btn-primary text-sm"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary text-sm"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
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
                  Analyzing...
                </span>
              ) : (
                "Get Triage Assessment"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
