import React from "react";

interface FactsCardProps {
  cols?: 2 | 3;
  children: React.ReactNode;
}

function FactsCardFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-label)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--fg-muted)",
          margin: 0,
        }}
      >
        {label}
      </p>
      <div
        style={{
          fontSize: "var(--text-md)",
          color: "var(--fg)",
          fontWeight: 500,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function FactsCardBase({ cols = 2, children }: FactsCardProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-raised)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r)",
        padding: 16,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

export const FactsCard = Object.assign(FactsCardBase, { Fact: FactsCardFact });
