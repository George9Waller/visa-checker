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
        minHeight: "100dvh",
        backgroundColor: "var(--bg)",
      }}
    >
      {/* Header */}
      <Flex
        variant="row-between"
        gap="md"
        p="none"
        style={{
          padding: "16px 20px 12px",
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
            style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", display: "block" }}
            truncate
          >
            {kicker ? `${kicker} · ${step + 1}/${totalSteps}` : `${step + 1}/${totalSteps}`}
          </Text>
          <Heading
            variant="h2"
            style={{ fontSize: 18, fontWeight: "var(--w-display)", letterSpacing: "var(--track-display)", display: "block" }}
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
        style={{
          padding: "8px 20px 0",
        }}
      >
        {Array.from({ length: totalSteps }).map((_, i) => (
          <Box
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              backgroundColor: i < step ? "var(--fg)" : "var(--border)",
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
          padding: "14px 20px calc(14px + env(safe-area-inset-bottom))",
          background: "color-mix(in oklch, var(--bg) 90%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 10,
        }}
      >
        <Btn variant="ghost" onClick={onCancel}>
          Cancel
        </Btn>
        <Btn
          variant={nextLabel.toLowerCase().includes("create") ? "accent" : "primary"}
          size="lg"
          onClick={onNext}
          disabled={nextDisabled}
        >
          {nextLabel}
          <Icon name="arrow_forward" size="sm" />
        </Btn>
      </Flex>
    </Flex>
  );
}
