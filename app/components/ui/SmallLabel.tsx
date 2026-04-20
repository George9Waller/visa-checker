import { Text } from "./typography/Text";

export function SmallLabel({ text, muted }: { text: string; muted: boolean }) {
  return (
    <Text
      as="div"
      variant="mono"
      color={muted ? "faint" : "muted"}
      pl="xs"
      pt="xs"
      mb="sm"
      style={{ fontSize: 12, letterSpacing: "0.15em" }}
    >
      {text}
    </Text>
  );
}