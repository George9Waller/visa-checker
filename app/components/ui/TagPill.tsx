export function TagPill({ flag, label }: { flag?: string; label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        border: "1px solid var(--border)",
        borderRadius: 999,
        backgroundColor: "var(--bg-raised)",
        fontSize: "var(--text-xs)",
        color: "var(--fg)",
        fontFamily: "var(--font-body)",
      }}
    >
      {flag && <span style={{ fontSize: 14 }}>{flag}</span>}
      {label}
    </span>
  );
}
