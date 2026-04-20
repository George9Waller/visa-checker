"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Box } from "./ui/layout/Box";
import { Flex } from "./ui/layout/Flex";
import { Text } from "./ui/typography/Text";

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

  return (
    <Box 
      ref={ref} 
      position="fixed" 
      style={{ right: 20, zIndex: 50, bottom: 24 }}
    >
      {open && (
        <Box
          position="absolute"
          style={{
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
          <Box as={Link} href="/trips/create" onClick={() => setOpen(false)} p="none" style={{ textDecoration: "none", display: "block" }}>
            <Flex variant="row" p="md" gap="md" style={{ background: "transparent", color: "var(--fg)", textAlign: "left" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: 2 }}>
                <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <Box style={{ flex: 1 }}>
                <Text style={{ fontWeight: 600, display: "block" }}>{t("trip")}</Text>
                <Text variant="caption" color="muted" style={{ display: "block" }}>{t("tripDesc")}</Text>
              </Box>
            </Flex>
          </Box>

          <Box style={{ height: 1, background: "var(--border)" }} />

          <Box as={Link} href="/visas/create" onClick={() => setOpen(false)} p="none" style={{ textDecoration: "none", display: "block" }}>
            <Flex variant="row" p="md" gap="md" style={{ background: "transparent", color: "var(--fg)", textAlign: "left" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: 2 }}>
                <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M2 6h12" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <Box style={{ flex: 1 }}>
                <Text style={{ fontWeight: 600, display: "block" }}>{t("visa")}</Text>
                <Text variant="caption" color="muted" style={{ display: "block" }}>{t("visaDesc")}</Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      )}

      <Box
        as="button"
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
      </Box>
    </Box>
  );
}
