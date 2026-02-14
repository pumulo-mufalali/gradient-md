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
  { id: "history", label: "Medical History" },
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
    <div className="mx-auto w-full max-w-4xl">
      {/* Step indicator */}
      <div className="mb-20 flex items-center justify-center gap-6">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i >= step}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-base font-black transition-all ${i === step
                  ? "step-active scale-125 shadow-xl"
                  : i < step
                    ? "step-completed hover:scale-110"
                    : "step-pending opacity-60"
                  }`}
              >
                {i < step ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  i + 1
                )}
              </button>
              <span className={`text-xs font-black uppercase tracking-widest transition-colors ${i === step ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"
                }`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-1 w-12 rounded-full transition-all ${i < step ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-primary)]" : "bg-[var(--color-card-border)]"
                  }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="glass-card !rounded-[2.5rem] p-12 md:p-20 shadow-2xl">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-3xl font-black tracking-tighter sm:text-4xl">{STEPS[step].label}</h2>
          <p className="mx-auto max-w-xl text-lg font-medium leading-relaxed text-[var(--color-muted)]">
            {step === 0 && "Let's start with some basic information to help the AI understand your context."}
            {step === 1 && "Describe your symptoms in detail. The more info you provide, the better the assessment."}
            {step === 2 && "Your medical background provides crucial context for our clinical agent."}
            {step === 3 && "Please verify all details before we proceed with the clinical analysis."}
          </p>
        </div>
        {/* Step 0: Demographics */}
        {step === 0 && (
          <div className="space-y-16">
            <div className="flex flex-col items-center text-center">
              <label className="mb-6 block text-xl font-black tracking-tight uppercase tracking-widest text-[var(--color-primary)]">Age</label>
              <div className="relative w-full max-w-sm">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={data.age}
                  onChange={(e) => update("age", e.target.value)}
                  placeholder="0"
                  className="w-full rounded-[2rem] border-4 border-[var(--color-card-border)] bg-[var(--color-background)] px-10 py-8 text-4xl font-black text-center outline-none transition-all focus:border-[var(--color-primary)] focus:ring-8 focus:ring-[var(--color-primary)]/10"
                />
                <span className="mt-4 block text-base font-bold text-[var(--color-muted)]">years old</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <label className="mb-8 block text-xl font-black tracking-tight uppercase tracking-widest text-[var(--color-primary)] text-center">
                Biological Sex
              </label>
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
                {["Male", "Female", "Other"].map((option) => (
                  <button
                    key={option}
                    onClick={() => update("sex", option.toLowerCase())}
                    className={`rounded-3xl border-4 px-8 py-10 text-xl font-black transition-all ${data.sex === option.toLowerCase()
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-2xl scale-105"
                      : "border-[var(--color-card-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] bg-[var(--color-muted-bg)]/30 hover:bg-[var(--color-muted-bg)]"
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
          <div className="space-y-16">
            <div className="flex flex-col items-center">
              <label className="mb-6 block text-xl font-black tracking-tight uppercase tracking-widest text-[var(--color-primary)] text-center">
                Describe your symptoms
              </label>
              <textarea
                value={data.symptoms}
                onChange={(e) => update("symptoms", e.target.value)}
                placeholder="e.g., I have a persistent headache on the right side, nausea, and sensitivity to light..."
                rows={4}
                className="w-full rounded-[2.5rem] border-4 border-[var(--color-card-border)] bg-[var(--color-background)] px-10 py-10 text-lg font-medium leading-relaxed outline-none transition-all focus:border-[var(--color-primary)] focus:ring-8 focus:ring-[var(--color-primary)]/10"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="mb-8 block text-xl font-black tracking-tight uppercase tracking-widest text-[var(--color-primary)] text-center">
                How long have you had these symptoms?
              </label>
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  "Less than 24 hours",
                  "1-3 days",
                  "4-7 days",
                  "More than a week",
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => update("duration", option)}
                    className={`rounded-[2rem] border-4 px-8 py-8 text-base font-black transition-all ${data.duration === option
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-xl scale-105"
                      : "border-[var(--color-card-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] bg-[var(--color-muted-bg)]/30 hover:bg-[var(--color-muted-bg)]"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <label className="mb-10 block text-xl font-black tracking-tight uppercase tracking-widest text-[var(--color-primary)] text-center">
                Pain / Discomfort Severity
              </label>
              <div className="flex flex-wrap justify-center gap-4">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => update("severity", String(num))}
                    className={`flex h-16 w-16 items-center justify-center rounded-[1.25rem] border-4 text-2xl font-black transition-all ${data.severity === String(num)
                      ? num <= 3
                        ? "border-green-500 bg-green-500/10 text-green-600 shadow-2xl scale-125"
                        : num <= 6
                          ? "border-yellow-500 bg-yellow-500/10 text-yellow-600 shadow-2xl scale-125"
                          : "border-red-500 bg-red-500/10 text-red-600 shadow-2xl scale-125"
                      : "border-[var(--color-card-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] bg-[var(--color-muted-bg)]/30 hover:bg-[var(--color-muted-bg)]"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="mt-10 flex w-full max-w-lg justify-between px-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-muted)]">
                <span className="text-green-600">Mild</span>
                <span className="text-red-600">Severe</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Medical History */}
        {step === 2 && (
          <div className="space-y-12">
            <div>
              <label className="mb-3 block text-base font-bold tracking-tight">
                Current Medications <span className="text-xs font-normal text-[var(--color-muted)]">(optional)</span>
              </label>
              <textarea
                value={data.medications}
                onChange={(e) => update("medications", e.target.value)}
                placeholder="e.g., Lisinopril 10mg, Metformin 500mg..."
                rows={2}
                className="w-full rounded-xl border border-[var(--color-card-border)] bg-[var(--color-background)] px-6 py-5 text-base outline-none transition-all focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
              />
            </div>
            <div>
              <label className="mb-3 block text-base font-bold tracking-tight">
                Existing Medical Conditions <span className="text-xs font-normal text-[var(--color-muted)]">(optional)</span>
              </label>
              <textarea
                value={data.conditions}
                onChange={(e) => update("conditions", e.target.value)}
                placeholder="e.g., Type 2 diabetes, hypertension..."
                rows={2}
                className="w-full rounded-xl border border-[var(--color-card-border)] bg-[var(--color-background)] px-6 py-5 text-base outline-none transition-all focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
              />
            </div>
            <div>
              <label className="mb-3 block text-base font-bold tracking-tight text-[var(--color-foreground)]">
                Anything else we should know? <span className="text-xs font-normal text-[var(--color-muted)]">(optional)</span>
              </label>
              <textarea
                value={data.additionalInfo}
                onChange={(e) => update("additionalInfo", e.target.value)}
                placeholder="e.g., Recent travel, allergies, family history..."
                rows={2}
                className="w-full rounded-xl border border-[var(--color-card-border)] bg-[var(--color-background)] px-6 py-5 text-base outline-none transition-all focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
              />
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-3">
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
                className="flex items-start justify-between rounded-lg bg-[var(--color-muted-bg)] px-4 py-3"
              >
                <span className="text-sm font-medium text-[var(--color-muted)]">
                  {item.label}
                </span>
                <span className="ml-4 text-right text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep(step - 1)}
            className={`btn-secondary !px-8 !py-3.5 ${step === 0 ? "invisible" : ""
              }`}
          >
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canAdvance()}
              className="btn-primary !px-10 !py-3.5"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary !px-10 !py-3.5 shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
