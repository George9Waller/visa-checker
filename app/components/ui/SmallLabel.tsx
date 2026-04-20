import { Text } from "./typography/Text";

export function SmallLabel({ text, muted }: { text: string; muted: boolean }) {
  return (
    <Text
      as="div"
      variant="mono"
      size={12}
      color={muted ? "var(--fg-faint)" : "var(--fg-muted)"}
      letterSpacing="0.15em"
      pl={4}
      mb={8}
      pt={4}
    >
      {text}
    </Text>
  );
}