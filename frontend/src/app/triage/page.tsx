"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SymptomForm, type SymptomData } from "../_components/symptom-form";
import { useToast } from "../_components/toast";

export default function TriagePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: SymptomData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Triage request failed");

      const result = await response.json();

      sessionStorage.setItem("triageResult", JSON.stringify(result));
      sessionStorage.setItem("symptomData", JSON.stringify(data));

      const history = JSON.parse(
        localStorage.getItem("gradientmd-history") || "[]"
      );
      history.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        symptoms: data.symptoms,
        severity: result.severity,
        title: result.title,
      });
      localStorage.setItem(
        "gradientmd-history",
        JSON.stringify(history.slice(0, 50))
      );

      router.push("/results");
    } catch (error) {
      console.error("Triage failed:", error);
      toast(
        "Something went wrong. Please try again. If symptoms are severe, please call 911.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-12 md:py-16">
      {/* Header */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Secure AI Assessment
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          Symptom <span className="gradient-text">Triage</span>
        </h1>
        <p className="text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
          Our multi-agent AI system analyzes your symptoms against clinical
          guidelines from WHO, CDC, and NIH.
        </p>
      </div>

      {/* Form */}
      <SymptomForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Supporting Information */}
      <div className="mx-auto mt-16 grid max-w-3xl gap-8 md:grid-cols-3">
        {[
          {
            title: "Privacy First",
            desc: "Your data is processed securely and is never used to train global AI models.",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ),
          },
          {
            title: "Clinical Accuracy",
            desc: "Assessments are grounded in peer-reviewed medical databases and emergency protocols.",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            ),
          },
          {
            title: "Instant Guidance",
            desc: "Get immediate recommendations and warning signs to watch in under 60 seconds.",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            ),
          },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] text-[var(--color-primary)]">
              {item.icon}
            </div>
            <h3 className="mb-1 text-sm font-semibold">{item.title}</h3>
            <p className="text-xs leading-relaxed text-[var(--color-muted)]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
