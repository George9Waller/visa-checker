import React from "react";
import { Box } from "./layout/Box";
import { Flex } from "./layout/Flex";
import { Text } from "./typography/Text";
import { Icon } from "./typography/Icon";

export function CheckableRow({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onChange}
      p="none"
      width="full"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        cursor: "pointer",
        background: "none",
        border: "none",
        textAlign: "left",
      }}
    >
      <Flex
        variant="row-center"
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          border: `1.5px solid ${checked ? "var(--fg)" : "var(--border-strong)"}`,
          backgroundColor: checked ? "var(--fg)" : "transparent",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {checked && (
          <Icon name="check" size="xs" color="inverse" />
        )}
      </Flex>
      <Box>
        <Text style={{ fontWeight: 600, display: "block" }}>
          {label}
        </Text>
        {hint && (
          <Text variant="caption" color="muted" mt="xs" as="p">
            {hint}
          </Text>
        )}
      </Box>
    </Box>
  );
}
