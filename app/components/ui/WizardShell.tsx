"use client";

import React from "react";
import { Btn } from "./Btn";
import { Icon } from "./typography/Icon";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100dvh - 52px)",
        backgroundColor: "var(--bg)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {onBack ? (
          <button onClick={onBack} style={iconBtnStyle} aria-label="Back">
            <Icon name="arrow_back" size="md" />
          </button>
        ) : (
          <div style={{ width: 32, flexShrink: 0 }} />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-label)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--fg-muted)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {kicker ? `${kicker} · ${step}/${totalSteps}` : `${step}/${totalSteps}`}
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-xl)",
              color: "var(--fg)",
              letterSpacing: "var(--track-display)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </p>
        </div>

        <button onClick={onCancel} style={iconBtnStyle} aria-label="Cancel">
          <Icon name="close" size="md" />
        </button>
      </div>

      {/* Progress bar */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: "8px 20px 0",
          borderBottom: "1px solid var(--border)",
          paddingBottom: 8,
        }}
      >
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
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
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "22px 20px 120px",
          maxWidth: 560,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          borderTop: "1px solid var(--border)",
          padding: "14px 20px",
          background: "color-mix(in oklch, var(--bg) 90%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Btn variant="ghost" onClick={onCancel}>
          Cancel
        </Btn>
        <Btn variant="accent" size="md" onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
          <Icon name="arrow_forward" size="sm" />
        </Btn>
      </div>
    </div>
  );
}
