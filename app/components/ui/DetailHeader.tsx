"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Box } from "./layout/Box";
import { Flex } from "./layout/Flex";
import { Text } from "./typography/Text";
import { Heading } from "./typography/Heading";
import { Icon } from "./typography/Icon";

export function DetailHeader({
  kicker,
  title,
  backHref,
  actions,
}: {
  kicker?: string;
  title: ReactNode;
  backHref?: string;
  actions?: ReactNode;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <Box
      as="header"
      position="sticky"
      p="lg"
      px="lg"
      style={{
        top: 0,
        zIndex: 20,
        backgroundColor: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
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

      <Box style={{ flex: 1, minWidth: 0 }}>
        {kicker && (
          <Text variant="mono" color="muted" mb="none" as="p" style={{ fontSize: 10, fontWeight: 700 }}>
            {kicker}
          </Text>
        )}
        <Heading variant="h2" style={{ fontSize: 22, lineHeight: 1.1 }} truncate>
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
}: {
  icon: string;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <Box
      as="button"
      onClick={onClick}
      aria-label={label}
      style={{
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--r-s)",
        border: "1px solid var(--border)",
        background: "transparent",
        color: danger ? "var(--danger)" : "var(--fg-muted)",
        cursor: "pointer",
      }}
    >
      <Icon name={icon} size="sm" color={danger ? "danger" : "muted"} />
    </Box>
  );
}
