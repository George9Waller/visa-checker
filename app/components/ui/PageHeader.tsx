"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "./typography/Icon";
import { Box } from "./layout/Box";
import { Flex } from "./layout/Flex";
import { Text } from "./typography/Text";
import { Heading } from "./typography/Heading";

interface PageHeaderProps {
  variant?: "detail" | "list";
  backHref?: string;
  kicker?: string;
  title: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({
  variant = "detail",
  backHref,
  kicker,
  title,
  actions,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <Box
      as="header"
      position="sticky"
      p="lg"
      px="lg"
      style={{
        top: 52,
        zIndex: 20,
        backgroundColor: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      {variant === "detail" && (
        <Box
          as="button"
          onClick={handleBack}
          aria-label="Go back"
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            borderRadius: "var(--r-s)",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--fg-muted)",
            cursor: "pointer",
          }}
        >
          <Icon name="arrow_back" size="md" color="muted" />
        </Box>
      )}

      <Box style={{ flex: 1, minWidth: 0 }}>
        {kicker && (
          <Text variant="mono" color="muted" mb="none" as="p" style={{ fontSize: 10, fontWeight: 700 }}>
            {kicker}
          </Text>
        )}
        <Heading variant="h2" style={{ fontSize: 24, lineHeight: 1.1 }} truncate>
          {title}
        </Heading>
      </Box>

      {actions && (
        <Flex variant="row-center" gap="xs" style={{ flexShrink: 0 }}>
          {actions}
        </Flex>
      )}
    </Box>
  );
}

export function IconBtn({
  icon,
  label,
  danger,
  onClick,
  href,
}: {
  icon: string;
  label: string;
  danger?: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const style: React.CSSProperties = {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--r-s)",
    border: "1px solid var(--border)",
    background: "transparent",
    color: danger ? "var(--danger)" : "var(--fg-muted)",
    cursor: "pointer",
    textDecoration: "none",
    flexShrink: 0,
  };

  if (href) {
    return (
      <Box as={Link} href={href} aria-label={label} style={style}>
        <Icon name={icon} size="md" color={danger ? "danger" : "muted"} />
      </Box>
    );
  }

  return (
    <Box as="button" onClick={onClick} aria-label={label} style={style}>
      <Icon name={icon} size="md" color={danger ? "danger" : "muted"} />
    </Box>
  );
}
