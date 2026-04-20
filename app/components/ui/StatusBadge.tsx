import { StatusPip } from "./StatusPip";

type Tone = "ok" | "warn" | "danger" | "muted";
type Size = "xs" | "sm";

const TONE_BG: Record<Tone, string> = {
  ok: "color-mix(in oklch, var(--ok) 15%, var(--bg))",
  warn: "color-mix(in oklch, var(--warn) 20%, var(--bg))",
  danger: "color-mix(in oklch, var(--danger) 18%, var(--bg))",
  muted: "var(--bg-sunken)",
};

const TONE_COLOR: Record<Tone, string> = {
  ok: "var(--ok)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  muted: "var(--fg-muted)",
};

const SIZE_STYLE: Record<Size, { padding: string; fontSize: string }> = {
  xs: { padding: "2px 7px", fontSize: "10px" },
  sm: { padding: "3px 9px", fontSize: "11px" },
};

export function StatusBadge({
  tone,
  label,
  size = "sm",
  className = "",
}: {
  tone: Tone;
  label: string;
  size?: Size;
  className?: string;
}) {
  const { padding, fontSize } = SIZE_STYLE[size];
  const color = TONE_COLOR[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase whitespace-nowrap rounded-full ${className}`}
      style={{
        padding,
        fontSize,
        fontWeight: 500,
        letterSpacing: "0.04em",
        backgroundColor: TONE_BG[tone],
        border: `0.5px solid color-mix(in oklch, ${color} 30%, transparent)`,
        color,
      }}
    >
      <StatusPip tone={tone} size={6} />
      {label}
    </span>
  );
}
