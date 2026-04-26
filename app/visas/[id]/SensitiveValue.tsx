"use client";

import { useState } from "react";
import { cn } from "@/app/design";

export default function SensitiveValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const maskedValue = "•".repeat(Math.max(8, value.length));

  return (
    <button
      type="button"
      aria-label={revealed ? `Hide ${label}` : `Reveal ${label}`}
      aria-pressed={revealed}
      onClick={() => setRevealed((current) => !current)}
      className={cn(
        "w-full rounded-[var(--radius)] border border-border bg-bg-raised px-3 py-2 text-left",
        "transition-all hover:border-fg/70 hover:bg-bg-sunken focus-visible:ds-focus-ring"
      )}
    >
      <div
        data-sensitive-value={label}
        className={cn(
          "font-mono text-md tracking-[0.12em]",
          !revealed && "blur-md select-none"
        )}
      >
        {revealed ? value : maskedValue}
      </div>
      <div className="mt-1 text-xs text-fg-muted">
        {revealed ? "Click to hide" : "Click to reveal"}
      </div>
    </button>
  );
}
