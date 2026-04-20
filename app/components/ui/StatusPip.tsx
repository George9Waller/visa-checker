type Tone = "ok" | "warn" | "danger" | "muted";

const TONE_COLOR: Record<Tone, string> = {
  ok: "var(--ok)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  muted: "var(--muted)",
};

export function StatusPip({
  tone,
  size = 7,
  className = "",
}: {
  tone: Tone;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: TONE_COLOR[tone],
      }}
    />
  );
}
