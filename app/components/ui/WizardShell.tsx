"use client";

import React from "react";
import { Btn } from "./Btn";
import { Icon } from "./typography/Icon";
import { Flex } from "./layout/Flex";
import { Box } from "./layout/Box";
import { Text } from "./typography/Text";
import { Heading } from "./typography/Heading";

interface WizardShellProps {
  step: number;
  totalSteps: number;
  kicker?: string;
  title: string;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
  onCancel: () => void;
  children: React.ReactNode;
}

export function WizardShell({
  step,
  totalSteps,
  kicker,
  title,
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
  onCancel,
  children,
}: WizardShellProps) {
  const iconBtnStyle: React.CSSProperties = {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "var(--r-s)",
    border: "1px solid var(--border)",
    backgroundColor: "transparent",
    color: "var(--fg-muted)",
    cursor: "pointer",
  };

  return (
    <Flex
      variant="column"
      style={{
        minHeight: "calc(100dvh - 52px)",
        backgroundColor: "var(--bg)",
      }}
    >
      {/* Header */}
      <Flex
        variant="row-center"
        gap="md"
        p="md"
        px="lg"
        style={{
          borderBottom: "1px solid var(--border)",
        }}
      >
        {onBack ? (
          <Box as="button" onClick={onBack} style={iconBtnStyle} aria-label="Back">
            <Icon name="arrow_back" size="md" />
          </Box>
        ) : (
          <Box style={{ width: 32, flexShrink: 0 }} />
        )}

        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text
            variant="mono"
            color="muted"
            style={{ fontWeight: 700, display: "block" }}
            truncate
          >
            {kicker ? `${kicker} · ${step}/${totalSteps}` : `${step}/${totalSteps}`}
          </Text>
          <Heading
            variant="h2"
            style={{ fontSize: 22, display: "block" }}
            truncate
          >
            {title}
          </Heading>
        </Box>

        <Box as="button" onClick={onCancel} style={iconBtnStyle} aria-label="Cancel">
          <Icon name="close" size="md" />
        </Box>
      </Flex>

      {/* Progress bar */}
      <Flex
        gap="xs"
        px="lg"
        py="xs"
        style={{
          borderBottom: "1px solid var(--border)",
        }}
      >
        {Array.from({ length: totalSteps }).map((_, i) => (
          <Box
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              backgroundColor: i < step ? "var(--accent)" : "var(--border)",
              transition: "background-color 0.2s",
            }}
          />
        ))}
      </Flex>

      {/* Body */}
      <Box
        style={{
          flex: 1,
          overflowY: "auto" as const,
          padding: "22px 20px 120px",
          maxWidth: 560,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box" as const,
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Flex
        variant="row-between"
        gap="md"
        p="md"
        px="lg"
        position="sticky"
        style={{
          bottom: 0,
          borderTop: "1px solid var(--border)",
          background: "color-mix(in oklch, var(--bg) 90%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <Btn variant="ghost" onClick={onCancel}>
          Cancel
        </Btn>
        <Btn variant="accent" size="md" onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
          <Icon name="arrow_forward" size="sm" />
        </Btn>
      </Flex>
    </Flex>
  );
}
