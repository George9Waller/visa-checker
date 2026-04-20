"use client";

import React from "react";

function ModalTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "var(--text-md)",
        fontWeight: 600,
        color: "var(--fg)",
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

function ModalBase({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r)",
          padding: 24,
          maxWidth: 360,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export const Modal = Object.assign(ModalBase, { Title: ModalTitle });
