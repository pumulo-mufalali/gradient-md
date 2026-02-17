"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/triage", label: "Symptom Triage" },
  { href: "/interactions", label: "Drug Checker" },
  { href: "/history", label: "History" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-card-border)] bg-[var(--color-background)]/95 backdrop-blur-md">
      <div className="container-custom flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-bold text-white">
            G
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Gradient<span className="text-[var(--color-primary)]">MD</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-muted-bg)] hover:text-[var(--color-foreground)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-3 border-l border-[var(--color-card-border)] pl-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-muted-bg)] transition-colors"
            aria-label="Toggle menu"
          >
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
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[var(--color-card-border)] bg-[var(--color-card)] p-3 md:hidden">
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-muted-bg)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
