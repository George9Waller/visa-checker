"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export function FAB() {
  const t = useTranslations("fab");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const itemStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "var(--fg)",
    textAlign: "left",
    fontFamily: "var(--font-body)",
    fontSize: 15,
    textDecoration: "none",
  };

  return (
    <div ref={ref} className="fixed right-5 z-50" style={{ bottom: 24 }}>
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 10px)",
            right: 0,
            width: 244,
            backgroundColor: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
            overflow: "hidden",
          }}
        >
          <Link href="/trips/create" onClick={() => setOpen(false)} style={itemStyle}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{t("trip")}</div>
              <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{t("tripDesc")}</div>
            </div>
          </Link>

          <div style={{ height: 1, background: "var(--border)" }} />

          <Link href="/visas/create" onClick={() => setOpen(false)} style={itemStyle}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2 6h12" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{t("visa")}</div>
              <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{t("visaDesc")}</div>
            </div>
          </Link>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 56,
          height: 56,
          borderRadius: 99,
          backgroundColor: "var(--fg)",
          color: "var(--bg)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
          transition: "transform 180ms ease",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
        }}
        aria-label={open ? "Close" : "Add"}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M3 11h16M11 3v16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
