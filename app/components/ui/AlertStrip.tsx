import React from "react";
import { Box } from "./layout/Box";
import { Flex } from "./layout/Flex";
import { Text } from "./typography/Text";

type Tone = "ok" | "warn" | "danger" | "muted";

function AlertStripTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ fontSize: 13, fontWeight: 600, display: "block" }}>
      {children}
    </Text>
  );
}

function AlertStripBody({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="caption" color="muted" as="p">
      {children}
    </Text>
  );
}

function AlertStripBase({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <Flex
      variant="column"
      gap="xs"
      p="md"
      style={{
        borderLeft: `3px solid var(--${tone})`,
        backgroundColor: `color-mix(in oklch, var(--${tone}) 8%, transparent)`,
        borderRadius: "var(--r-s)",
      }}
    >
      {children}
    </Flex>
  );
}

export const AlertStrip = Object.assign(AlertStripBase, {
  Title: AlertStripTitle,
  Body: AlertStripBody,
});
