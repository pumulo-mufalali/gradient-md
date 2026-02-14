"use client";

import { useState } from "react";

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
      <div className="container-custom py-2.5 text-center text-sm text-amber-800 dark:text-amber-200">
        <span className="font-medium">Medical Disclaimer:</span> GradientMD is
        an AI tool for informational purposes only. It is{" "}
        <strong>not a substitute</strong> for professional medical advice,
        diagnosis, or treatment. In an emergency, call{" "}
        <strong>911</strong> immediately.
        <button
          onClick={() => setDismissed(true)}
          className="ml-4 inline-flex items-center rounded-lg px-4 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/20 dark:text-amber-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
