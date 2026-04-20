export function Error({ error }: { error: string }) {
  return (
    <div
      style={{
        margin: "8px 0",
        padding: "12px 16px",
        borderRadius: "var(--r)",
        backgroundColor: "color-mix(in oklch, var(--danger) 10%, transparent)",
        color: "var(--danger)",
        border: "1px solid color-mix(in oklch, var(--danger) 25%, transparent)",
        fontSize: 14,
      }}
    >
      Failed to load trips: {error}
    </div>
  );
}
