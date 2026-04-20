"use client";

import React from "react";

export function CheckableRow({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        cursor: "pointer",
        background: "none",
        border: "none",
        textAlign: "left",
        width: "100%",
        padding: 0,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          border: `1.5px solid ${checked ? "var(--fg)" : "var(--border-strong)"}`,
          backgroundColor: checked ? "var(--fg)" : "transparent",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {checked && (
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 13, color: "var(--bg)" }}
          >
            check
          </span>
        )}
      </div>
      <div>
        <p style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--fg)", margin: 0 }}>
          {label}
        </p>
        {hint && (
          <p style={{ fontSize: "var(--text-sm)", color: "var(--fg-muted)", margin: 0, marginTop: 2 }}>
            {hint}
          </p>
        )}
      </div>
    </button>
  );
}
