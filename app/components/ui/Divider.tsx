import React from "react";
import { Flex } from "./layout/Flex";
import { Box } from "./layout/Box";
import { Text } from "./typography/Text";

export function Divider({ label, ...props }: { label?: string; style?: React.CSSProperties }) {
  return (
    <Flex align="center" gap={12} style={{ color: "var(--fg-faint)", ...props.style }} {...props}>
      {label && (
        <Text variant="mono" size={10} letterSpacing="0.1em" transform="uppercase" color="var(--fg-muted)">
          {label}
        </Text>
      )}
      <Box flex={1} h={1} bg="var(--border)" />
    </Flex>
  );
}
