"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { type ColorScheme, getSavedScheme, saveScheme } from "./ThemeProvider";
import { useTranslations } from "next-intl";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

export function ProfileMenu({ locale }: { locale: string }) {
  const t = useTranslations("settings");
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scheme, setScheme] = useState<ColorScheme>("system");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScheme(getSavedScheme());
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleScheme = (s: ColorScheme) => {
    setScheme(s);
    saveScheme(s);
  };

  const handleLocale = (code: string) => {
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
    router.refresh();
    setOpen(false);
  };

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-full font-bold transition-opacity hover:opacity-80"
        style={{
          width: 36,
          height: 36,
          fontSize: 13,
          fontFamily: "var(--font-body)",
          backgroundColor: "var(--fg)",
          color: "var(--bg)",
          border: "none",
          cursor: "pointer",
        }}
        aria-label="Open settings"
      >
        {initials}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="absolute right-0 top-10 z-50 flex flex-col"
          style={{
            width: 220,
            backgroundColor: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Appearance */}
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <p
              className="font-mono font-bold uppercase tracking-wider mb-2"
              style={{ fontSize: 10, color: "var(--fg-muted)" }}
            >
              {t("appearance")}
            </p>
            <div
              className="flex rounded-[var(--r-s)] overflow-hidden"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-sunken)",
              }}
            >
              {(["light", "system", "dark"] as ColorScheme[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleScheme(s)}
                  className="flex-1 flex items-center justify-center gap-1 transition-colors"
                  style={{
                    height: 30,
                    fontSize: 12,
                    fontFamily: "var(--font-body)",
                    fontWeight: scheme === s ? 600 : 400,
                    backgroundColor:
                      scheme === s ? "var(--bg-raised)" : "transparent",
                    color: scheme === s ? "var(--fg)" : "var(--fg-muted)",
                    border: "none",
                    cursor: "pointer",
                  }}
                  aria-pressed={scheme === s}
                >
                  <span style={{ fontSize: 13 }}>
                    {s === "light" ? "☀" : s === "dark" ? "☾" : "⊙"}
                  </span>
                  <span>{t(s)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div
            className="px-4 py-3"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <p
              className="font-mono font-bold uppercase tracking-wider mb-2"
              style={{ fontSize: 10, color: "var(--fg-muted)" }}
            >
              {t("language")}
            </p>
            <div className="flex flex-col gap-1">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLocale(l.code)}
                  className="flex items-center justify-between rounded-[var(--r-xs)] px-2 py-1.5 transition-colors text-left"
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    color: "var(--fg)",
                    backgroundColor:
                      locale === l.code
                        ? "var(--bg-sunken)"
                        : "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (locale !== l.code)
                      e.currentTarget.style.backgroundColor =
                        "var(--bg-sunken)";
                  }}
                  onMouseLeave={(e) => {
                    if (locale !== l.code)
                      e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {l.label}
                  {locale === l.code && (
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 14, color: "var(--ok)" }}
                    >
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sign out */}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-3 w-full text-left transition-colors"
            style={{
              fontSize: 13,
              fontFamily: "var(--font-body)",
              color: "var(--danger)",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: "0 0 var(--r) var(--r)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in oklch, var(--danger) 8%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 16 }}
            >
              logout
            </span>
            {t("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
