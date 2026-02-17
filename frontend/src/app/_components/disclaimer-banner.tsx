"use client";

import { useState } from "react";

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="rounded-lg border border-amber-400/30 bg-amber-50 px-4 py-3 dark:bg-amber-900/10">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          <span className="font-semibold">Medical Disclaimer:</span>{" "}
          GradientMD is an AI tool for informational purposes only. It is{" "}
          <strong>not a substitute</strong> for professional medical advice,
          diagnosis, or treatment. In an emergency, call{" "}
          <strong>911</strong> immediately.
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-800/20"
          aria-label="Dismiss disclaimer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
