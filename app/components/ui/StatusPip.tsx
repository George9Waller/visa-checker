import { Box } from "./layout/Box";

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
    <Box
      as="span"
      className={className}
      style={{
        display: "inline-block",
        flexShrink: 0,
        width: size,
        height: size,
        backgroundColor: TONE_COLOR[tone],
        borderRadius: "50%",
      }}
    />
  );
}
