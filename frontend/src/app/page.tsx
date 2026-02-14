import Link from "next/link";
import { DisclaimerBanner } from "./_components/disclaimer-banner";

export default function HomePage() {
  return (
    <div className="container-custom">
      {/* Hero Section */}
      <section className="page-section flex flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-card-border)] bg-[var(--color-muted-bg)] px-5 py-2 text-sm font-medium text-[var(--color-muted)] shadow-sm">
          Powered by DigitalOcean Gradient AI
        </div>

        <h1 className="mb-8 max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          Understand your symptoms.{" "}
          <span className="gradient-text">Get cited guidance.</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)] md:text-xl">
          GradientMD uses AI to triage your symptoms, assess urgency, and
          provide clinical guidance backed by citations from WHO, CDC, and NIH
          sources — so you know when to seek care.
        </p>

        <div className="flex flex-col gap-6 sm:flex-row">
          <Link
            href="/triage"
            className="btn-primary text-lg"
          >
            Start Symptom Check
          </Link>
          <Link
            href="/interactions"
            className="btn-secondary text-lg"
          >
            Check Drug Interactions
          </Link>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* How it works */}
      <section className="page-section">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">How It Works</h2>
          <p className="text-lg text-[var(--color-muted)]">
            Three simple steps to get personalized health guidance
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Describe Symptoms",
              description:
                "Tell us about your symptoms, how long you've had them, and your medical background through a guided form.",
              icon: null,
            },
            {
              step: "2",
              title: "AI Triage Assessment",
              description:
                "Our multi-agent AI system analyzes your symptoms against clinical guidelines and classifies urgency.",
              icon: null,
            },
            {
              step: "3",
              title: "Cited Guidance",
              description:
                "Receive an urgency assessment with cited recommendations from CDC, WHO, and NIH clinical guidelines.",
              icon: null,
            },
          ].map((item) => (
            <div key={item.step} className="feature-card group">
              {item.icon && (
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-md transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
              )}
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-muted-bg)] text-sm font-bold text-[var(--color-primary)]">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
              <p className="leading-relaxed text-[var(--color-muted)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Trust indicators */}
      <section className="page-section">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            Trusted Sources, Cited Answers
          </h2>
          <p className="text-lg text-[var(--color-muted)]">
            All recommendations are backed by authoritative medical sources
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "CDC",
              desc: "Centers for Disease Control and Prevention - Evidence-based clinical guidelines, disease surveillance data, and emergency triage protocols used by healthcare providers nationwide.",
            },
            {
              name: "WHO",
              desc: "World Health Organization - International treatment standards, disease classification systems, and comprehensive fact sheets covering symptoms, transmission, and care recommendations.",
            },
            {
              name: "NIH",
              desc: "National Institutes of Health - Peer-reviewed drug interaction databases, medication safety information, and clinical research findings from the world's largest medical research agency.",
            },
            {
              name: "FDA",
              desc: "Food and Drug Administration - Official medication labeling, adverse event reporting, drug safety communications, and regulatory guidance on pharmaceutical products.",
            },
          ].map((source) => (
            <div
              key={source.name}
              className="glass-card group flex flex-col gap-4 p-6 text-center"
            >
              <h3 className="text-xl font-bold text-[var(--color-primary)]">{source.name}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">{source.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Medical Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
}
