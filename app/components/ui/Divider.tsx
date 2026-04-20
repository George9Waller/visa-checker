import React from "react";
import { Flex } from "./layout/Flex";
import { Box } from "./layout/Box";
import { Text } from "./typography/Text";

export function Divider({ label, ...props }: { label?: string; style?: React.CSSProperties }) {
  return (
    <Flex variant="row-center" gap="md" style={{ color: "var(--fg-faint)", ...props.style }} {...props}>
      {label && (
        <Text variant="mono" color="muted" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
          {label}
        </Text>
      )}
      <Box style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </Flex>
  );
}
