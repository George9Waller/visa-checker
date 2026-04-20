"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "./typography/Icon";
import { Flex } from "./layout/Flex";
import { Box } from "./layout/Box";
import { Text } from "./typography/Text";

interface SelectableRowProps {
  selected?: boolean;
  indicator?: "radio" | "check" | "none";
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

export function SelectableRow({
  selected = false,
  indicator = "none",
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  href,
}: SelectableRowProps) {
  const commonProps = {
    p: "md" as const,
    gap: "md" as const,
    style: {
      borderRadius: "var(--r)",
      border: `1px solid ${selected ? "var(--border-strong)" : "var(--border)"}`,
      backgroundColor: selected ? "var(--bg-sunken)" : "var(--bg-raised)",
      cursor: "pointer",
      textDecoration: "none",
      textAlign: "left" as const,
    },
  };

  const content = (
    <Flex variant="row-center" width="full" gap="md">
      {icon && (
        <Box style={{ flexShrink: 0, lineHeight: 1 }}>{icon}</Box>
      )}
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontWeight: 600,
            display: "block",
          }}
          truncate
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            variant="mono"
            color="muted"
            style={{ fontSize: 11, display: "block" }}
            mt="xs"
            truncate
          >
            {subtitle}
          </Text>
        )}
      </Box>
      {trailing && <Box style={{ flexShrink: 0 }}>{trailing}</Box>}
      {indicator === "radio" && (
        <Flex
          variant="row-center"
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: `2px solid ${selected ? "var(--fg)" : "var(--border-strong)"}`,
            backgroundColor: selected ? "var(--fg)" : "transparent",
            flexShrink: 0,
          }}
        >
          {selected && (
            <Box
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "var(--bg)",
              }}
            />
          )}
        </Flex>
      )}
      {indicator === "check" && selected && (
        <Icon name="check" size="sm" color="accent" />
      )}
    </Flex>
  );

  if (href) {
    return (
      <Box as={Link} href={href} {...commonProps}>
        {content}
      </Box>
    );
  }

  return (
    <Box as="button" type="button" onClick={onClick} width="full" {...commonProps}>
      {content}
    </Box>
  );
}
