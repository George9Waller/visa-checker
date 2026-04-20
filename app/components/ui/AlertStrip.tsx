import React from "react";

type Tone = "ok" | "warn" | "danger" | "muted";

function AlertStripTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--fg)", margin: 0 }}>
      {children}
    </p>
  );
}

function AlertStripBody({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "var(--text-sm)", color: "var(--fg-muted)", margin: 0 }}>
      {children}
    </p>
  );
}

function AlertStripBase({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <div
      style={{
        borderLeft: `3px solid var(--${tone})`,
        backgroundColor: `color-mix(in oklch, var(--${tone}) 8%, transparent)`,
        borderRadius: "var(--r-s)",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {children}
    </div>
  );
}

export const AlertStrip = Object.assign(AlertStripBase, {
  Title: AlertStripTitle,
  Body: AlertStripBody,
});
