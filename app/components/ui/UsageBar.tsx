type Tone = "ok" | "warn" | "danger" | "muted";

const TONE_COLOR: Record<Tone, string> = {
  ok: "var(--fg)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  muted: "var(--muted)",
};

export function UsageBar({
  value,
  max,
  tone = "ok",
  label,
  sublabel,
  className = "",
}: {
  value: number;
  max: number;
  tone?: Tone;
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {(label || sublabel) && (
        <div className="flex justify-between items-baseline">
          {label && (
            <span
              className="font-mono font-bold"
              style={{ fontSize: 11, color: "var(--fg)" }}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span
              className="font-mono"
              style={{ fontSize: 10, color: "var(--fg-muted)" }}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 4, backgroundColor: "var(--bg-sunken)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-400 ease-in-out"
          style={{
            width: `${pct}%`,
            backgroundColor: TONE_COLOR[tone],
          }}
        />
      </div>
    </div>
  );
}
