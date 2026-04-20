"use client";

import React from "react";

function SelectableGridItem({
  selected,
  onClick,
  leading,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  leading?: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: "var(--r-s)",
        border: `1px solid ${selected ? "var(--border-strong)" : "transparent"}`,
        backgroundColor: selected ? "var(--bg-sunken)" : "transparent",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
      }}
    >
      {leading && <span style={{ flexShrink: 0 }}>{leading}</span>}
      <span
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--fg)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </button>
  );
}

function SelectableGridBase({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 4,
      }}
    >
      {children}
    </div>
  );
}

export const SelectableGrid = Object.assign(SelectableGridBase, { Item: SelectableGridItem });
