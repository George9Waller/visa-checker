"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "./typography/Icon";

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
  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    borderRadius: "var(--r)",
    border: `1px solid ${selected ? "var(--border-strong)" : "var(--border)"}`,
    backgroundColor: selected ? "var(--bg-sunken)" : "var(--bg-raised)",
    cursor: "pointer",
    textDecoration: "none",
    width: "100%",
    textAlign: "left",
  };

  const content = (
    <>
      {icon && (
        <span style={{ flexShrink: 0, lineHeight: 1 }}>{icon}</span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--fg)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            margin: 0,
          }}
        >
          {title}
        </p>
        {subtitle && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--fg-muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              margin: 0,
              marginTop: 2,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {trailing && <span style={{ flexShrink: 0 }}>{trailing}</span>}
      {indicator === "radio" && (
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: `2px solid ${selected ? "var(--fg)" : "var(--border-strong)"}`,
            backgroundColor: selected ? "var(--fg)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {selected && (
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "var(--bg)",
                display: "block",
              }}
            />
          )}
        </span>
      )}
      {indicator === "check" && selected && (
        <Icon name="check" size="sm" color="var(--accent)" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} style={containerStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} style={containerStyle}>
      {content}
    </button>
  );
}
