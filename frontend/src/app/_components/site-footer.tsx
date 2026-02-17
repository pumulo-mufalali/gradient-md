import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Symptom Triage", href: "/triage" },
    { label: "Drug Checker", href: "/interactions" },
    { label: "Find Facilities", href: "/facilities" },
    { label: "History", href: "/history" },
  ],
  resources: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "CDC Guidelines", href: "https://www.cdc.gov", external: true },
    { label: "WHO Resources", href: "https://www.who.int", external: true },
    { label: "NIH Database", href: "https://www.nih.gov", external: true },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-card-border)] bg-[var(--color-card)]">
      <div className="container-custom py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-3 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)] text-xs font-bold text-white">
                G
              </div>
              <span className="text-base font-semibold tracking-tight">
                Gradient<span className="text-[var(--color-primary)]">MD</span>
              </span>
            </Link>
            <p className="mb-4 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
              AI-powered symptom triage and clinical guidance backed by citations
              from WHO, CDC, and NIH sources. Built on DigitalOcean Gradient AI.
            </p>
            <div className="rounded-md border border-amber-400/30 bg-amber-50 px-3 py-2 dark:bg-amber-900/10">
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                <span className="font-semibold">Disclaimer:</span> GradientMD
                is for informational purposes only and is not a substitute for
                professional medical advice. In an emergency, call{" "}
                <strong>911</strong>.
              </p>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-foreground)]">
              Product
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-foreground)]">
              Resources
            </h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  {"external" in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                    >
                      {link.label}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-50"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--color-card-border)] pt-6 sm:flex-row">
          <p className="text-xs text-[var(--color-muted)]">
            {new Date().getFullYear()} GradientMD. For informational purposes
            only.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/pumulo-mufalali/gradient-md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
              aria-label="GitHub repository"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
