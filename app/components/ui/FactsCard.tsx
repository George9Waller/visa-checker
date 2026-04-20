import React from "react";
import { Box } from "./layout/Box";
import { Flex } from "./layout/Flex";
import { Grid } from "./layout/Grid";
import { Text } from "./typography/Text";

interface FactsCardProps {
  cols?: 2 | 3;
  children: React.ReactNode;
}

function FactsCardFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Flex variant="column" gap="xs">
      <Text variant="mono" color="muted" style={{ fontSize: 10, fontWeight: 700 }}>
        {label}
      </Text>
      <Box style={{ fontSize: 15, fontWeight: 500, color: "var(--fg)" }}>
        {value}
      </Box>
    </Flex>
  );
}

function FactsCardBase({ cols = 2, children }: FactsCardProps) {
  return (
    <Grid
      columns={cols}
      gap="md"
      p="md"
      style={{
        backgroundColor: "var(--bg-raised)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r)",
      }}
    >
      {children}
    </Grid>
  );
}

export const FactsCard = Object.assign(FactsCardBase, { Fact: FactsCardFact });
