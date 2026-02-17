"use client";

import { useState } from "react";
import Link from "next/link";

const faqItems = [
  {
    q: "Is GradientMD a replacement for a doctor?",
    a: "No. GradientMD is an informational tool only. It provides AI-generated guidance backed by clinical sources, but it cannot diagnose conditions or prescribe treatment. Always consult a licensed healthcare provider for medical decisions.",
  },
  {
    q: "Where does the medical information come from?",
    a: "All clinical guidance is grounded in published resources from the CDC (Centers for Disease Control and Prevention), WHO (World Health Organization), NIH (National Institutes of Health), and FDA (Food and Drug Administration). Every recommendation includes citations so you can verify the source.",
  },
  {
    q: "Is my health data stored or shared?",
    a: "Your triage history is stored locally in your browser and is never sent to third-party services. Symptom data is processed in real time by the AI system and is not retained after your session ends. We do not sell or share personal health information.",
  },
  {
    q: "How accurate is the triage assessment?",
    a: "The AI system is designed to provide conservative assessments -- it will lean toward recommending professional care when in doubt. However, no AI system is perfect. The triage level should be treated as a starting point, not a definitive diagnosis.",
  },
  {
    q: "What should I do in a medical emergency?",
    a: "Call 911 immediately (or your local emergency number). Do not rely on any digital tool, including GradientMD, to assess emergency situations. If you believe you or someone else is experiencing a life-threatening condition, seek emergency care right away.",
  },
  {
    q: "How does the drug interaction checker work?",
    a: "The drug interaction checker cross-references your medications against the NIH/FDA drug interaction databases. It identifies known interactions and categorizes them by severity (high, moderate, low). Always confirm results with your pharmacist or doctor.",
  },
  {
    q: "What AI technology powers GradientMD?",
    a: "GradientMD uses a multi-agent AI architecture built on DigitalOcean Gradient AI. Different specialized agents handle triage routing, clinical question answering, drug interaction checking, and facility lookup -- each grounded in domain-specific medical data.",
  },
];

export default function HowItWorksPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container-custom py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            How <span className="gradient-text">GradientMD</span> Works
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
            Understand the technology, data sources, and privacy practices
            behind our AI-powered medical triage assistant.
          </p>
        </div>

        {/* Process steps */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-xl font-bold tracking-tight">
            The Triage Process
          </h2>
          <div className="flex flex-col gap-4">
            {[
              {
                step: "1",
                title: "You Describe Symptoms",
                description:
                  "Through a guided multi-step form, you provide details about your symptoms, their duration and severity, current medications, and medical history. The more context you provide, the better the assessment.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                ),
              },
              {
                step: "2",
                title: "Multi-Agent AI Analysis",
                description:
                  "Your input is routed through a multi-agent system. A triage agent classifies urgency, a medical QA agent generates clinical guidance, and a citation agent grounds every recommendation in WHO, CDC, or NIH sources.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                ),
              },
              {
                step: "3",
                title: "Severity Classification",
                description:
                  "Your symptoms are classified into one of four urgency levels: Emergency (call 911), Urgent (see a doctor within 24 hours), Routine (schedule an appointment), or Self-Care (manageable at home).",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
              },
              {
                step: "4",
                title: "Cited Guidance Delivered",
                description:
                  "You receive actionable recommendations, warning signs to watch, and next steps -- all with clickable citations from authoritative medical sources so you can verify the information yourself.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass-card flex items-start gap-4 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data sources */}
        <div className="mb-12 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)] p-6">
          <h2 className="mb-4 text-lg font-bold tracking-tight">
            Our Data Sources
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                name: "CDC",
                url: "https://www.cdc.gov",
                desc: "Evidence-based clinical guidelines and disease surveillance data.",
              },
              {
                name: "WHO",
                url: "https://www.who.int",
                desc: "International treatment standards and disease classification.",
              },
              {
                name: "NIH",
                url: "https://www.nih.gov",
                desc: "Peer-reviewed drug databases and clinical research findings.",
              },
              {
                name: "FDA",
                url: "https://www.fda.gov",
                desc: "Medication labeling, adverse events, and drug safety data.",
              },
            ].map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-lg border border-[var(--color-card-border)] p-4 transition-colors hover:bg-[var(--color-muted-bg)]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-xs font-bold text-[var(--color-primary)]">
                  {source.name.charAt(0)}
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{source.name}</h3>
                  <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                    {source.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="mb-6 text-center text-xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-2">
            {faqItems.map((item, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === i ? null : i)
                  }
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--color-card-hover)]"
                  aria-expanded={openIndex === i}
                >
                  <span className="text-sm font-medium">{item.q}</span>
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
                    className={`shrink-0 text-[var(--color-muted)] transition-transform duration-200 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openIndex === i && (
                  <div className="border-t border-[var(--color-card-border)] px-5 py-4">
                    <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="mb-2 text-lg font-bold">Ready to get started?</h2>
          <p className="mb-5 text-sm text-[var(--color-muted)]">
            Try a symptom check now -- it takes less than 60 seconds.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/triage" className="btn-primary text-sm">
              Start Symptom Check
            </Link>
            <Link href="/interactions" className="btn-secondary text-sm">
              Check Drug Interactions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
