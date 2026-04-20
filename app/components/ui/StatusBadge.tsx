import { Flex } from "./layout/Flex";
import { Text } from "./typography/Text";
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

const SIZE_STYLE: Record<Size, { px: "xs" | "sm"; py: "none"; fontSize: number }> = {
  xs: { px: "xs", py: "none", fontSize: 10 },
  sm: { px: "sm", py: "none", fontSize: 11 },
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
  const { px, py, fontSize } = SIZE_STYLE[size];
  const color = TONE_COLOR[tone];
  
  return (
    <Flex
      as="span"
      variant="row-center"
      gap="xs"
      px={px}
      py={py}
      className={className}
      style={{
        display: "inline-flex",
        fontSize,
        fontWeight: 500,
        backgroundColor: TONE_BG[tone],
        border: `0.5px solid color-mix(in oklch, ${color} 30%, transparent)`,
        borderRadius: 99,
        color,
      }}
    >
      <StatusPip tone={tone} size={6} />
      <Text variant="mono" style={{ textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "inherit", color: "inherit" }}>
        {label}
      </Text>
    </Flex>
  );
}
