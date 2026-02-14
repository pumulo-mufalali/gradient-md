"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SymptomForm, type SymptomData } from "../_components/symptom-form";

export default function TriagePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

      // Store result and symptoms for the results page
      sessionStorage.setItem("triageResult", JSON.stringify(result));
      sessionStorage.setItem("symptomData", JSON.stringify(data));

      // Save to history
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
      alert(
        "Something went wrong. Please try again. If symptoms are severe, please call 911."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 opacity-20 blur-[120px] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]" />
      <div className="absolute bottom-0 right-0 -z-10 h-[400px] w-[400px] opacity-10 blur-[100px] bg-[var(--color-accent)]" />

      <div className="container-custom py-12 lg:py-20 flex flex-col items-center">
        {/* Enhanced Header Section */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-6 py-2 text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Secure AI Assessment
          </div>
          <h1 className="mb-8 text-5xl font-black tracking-tighter md:text-6xl lg:text-7xl">
            Symptom <span className="gradient-text">Triage</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-[var(--color-muted)]">
            Our multi-agent AI system analyzes your symptoms against clinical guidelines from WHO, CDC, and NIH.
          </p>
        </div>

        <div className="relative w-full z-10">
          <SymptomForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Supporting Information Section */}
        <div className="mx-auto mt-32 grid max-w-5xl gap-12 md:grid-cols-3">
          {[
            {
              title: "Privacy First",
              desc: "Your data is processed securely and is never used to train global AI models.",
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            },
            {
              title: "Clinical Accuracy",
              desc: "Assessments are grounded in peer-reviewed medical databases and emergency protocols.",
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            },
            {
              title: "Instant Guidance",
              desc: "Obtain immediate recommendations and warned signs to watch in under 60 seconds.",
              icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-card)] text-[var(--color-primary)] shadow-md border border-[var(--color-card-border)]">
                {item.icon}
              </div>
              <h3 className="mb-3 text-lg font-black tracking-tight">{item.title}</h3>
              <p className="text-sm font-medium leading-relaxed text-[var(--color-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
