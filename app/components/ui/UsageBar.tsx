import { Flex } from "./layout/Flex";
import { Box } from "./layout/Box";
import { Text } from "./typography/Text";

type Tone = "ok" | "warn" | "danger" | "muted";

const TONE_COLOR: Record<Tone, string> = {
  ok: "var(--fg)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  muted: "var(--fg-muted)",
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
    <Flex variant="column" gap="xs" className={className}>
      {(label || sublabel) && (
        <Flex variant="row-between" style={{ alignItems: "baseline" }}>
          {label && (
            <Text variant="mono" style={{ fontSize: 11, fontWeight: "bold" }}>
              {label}
            </Text>
          )}
          {sublabel && (
            <Text variant="mono" color="muted" style={{ fontSize: 10 }}>
              {sublabel}
            </Text>
          )}
        </Flex>
      )}
      <Box
        width="full"
        style={{
          height: 4,
          backgroundColor: "var(--bg-sunken)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <Box
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: TONE_COLOR[tone],
            borderRadius: 99,
            transition: "width 0.4s ease-in-out",
          }}
        />
      </Box>
    </Flex>
  );
}
