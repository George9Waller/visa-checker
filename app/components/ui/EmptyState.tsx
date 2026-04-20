import React from "react";
import { Icon } from "./typography/Icon";

export function EmptyState({
  icon,
  message,
  action,
}: {
  icon: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px dashed var(--border)",
        borderRadius: "var(--r)",
        padding: "48px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 12,
      }}
    >
      <Icon name={icon} size="xl" color="var(--fg-faint)" />
      <p
        style={{
          fontSize: "var(--text-base)",
          color: "var(--fg-muted)",
          fontWeight: 500,
          margin: 0,
        }}
      >
        {message}
      </p>
      {action}
    </div>
  );
}
