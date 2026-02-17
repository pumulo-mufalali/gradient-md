"use client";

export interface Citation {
  source: string;
  document: string;
  excerpt: string;
  url?: string;
}

interface CitationCardProps {
  citation: Citation;
}

export function CitationCard({ citation }: CitationCardProps) {
  return (
    <div className="rounded-md border border-[var(--color-card-border)] bg-[var(--color-muted-bg)] p-3.5">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="inline-flex items-center rounded-md bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-primary)]">
          {citation.source}
        </span>
        <span className="text-xs text-[var(--color-muted)]">
          {citation.document}
        </span>
      </div>
      <p className="text-sm italic leading-relaxed text-[var(--color-muted)]">
        &ldquo;{citation.excerpt}&rdquo;
      </p>
      {citation.url && (
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline"
        >
          View source
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
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}
    </div>
  );
}
