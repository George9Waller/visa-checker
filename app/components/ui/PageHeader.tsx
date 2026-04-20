"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "./typography/Icon";

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
    <div
      style={{
        position: "sticky",
        top: 52,
        zIndex: 20,
        backgroundColor: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "16px 20px",
      }}
    >
      {variant === "detail" && (
        <button
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
          <Icon name="arrow_back" size="md" />
        </button>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {kicker && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-label)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--fg-muted)",
              marginBottom: 2,
            }}
          >
            {kicker}
          </p>
        )}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-2xl)",
            lineHeight: 1.1,
            color: "var(--fg)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>
      </div>

      {actions && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
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
      <Link href={href} aria-label={label} style={style}>
        <Icon name={icon} size="md" />
      </Link>
    );
  }

  return (
    <button onClick={onClick} aria-label={label} style={style}>
      <Icon name={icon} size="md" />
    </button>
  );
}
