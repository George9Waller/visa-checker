"use client";

import React from "react";
import { Grid } from "./layout/Grid";
import { Box } from "./layout/Box";
import { Text } from "./typography/Text";

function SelectableGridItem({
  selected,
  onClick,
  leading,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  leading?: React.ReactNode;
  label: string;
}) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      p="sm"
      width="full"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderRadius: "var(--r-s)",
        border: `1px solid ${selected ? "var(--border-strong)" : "transparent"}`,
        backgroundColor: selected ? "var(--bg-sunken)" : "transparent",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {leading && <Box style={{ flexShrink: 0 }}>{leading}</Box>}
      <Text
        variant="caption"
        style={{
          color: "var(--fg)",
          display: "block",
        }}
        truncate
      >
        {label}
      </Text>
    </Box>
  );
}

function SelectableGridBase({ children }: { children: React.ReactNode }) {
  return (
    <Grid columns={2} gap="xs">
      {children}
    </Grid>
  );
}

export const SelectableGrid = Object.assign(SelectableGridBase, { Item: SelectableGridItem });
