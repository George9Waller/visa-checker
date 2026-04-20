"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type ColorScheme, getSavedScheme, saveScheme } from "../components/ThemeProvider";
import { useTranslations } from "next-intl";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono font-bold uppercase tracking-wider"
      style={{ fontSize: 10, color: "var(--fg-muted)", marginBottom: 10 }}
    >
      {children}
    </p>
  );
}

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { data: session } = useSession();
  const router = useRouter();
  const [scheme, setScheme] = useState<ColorScheme>("system");
  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    setScheme(getSavedScheme());
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (match) setCurrentLocale(match[1]);
  }, []);

  const handleScheme = (s: ColorScheme) => {
    setScheme(s);
    saveScheme(s);
  };

  const handleLocale = (code: string) => {
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
    setCurrentLocale(code);
    router.refresh();
  };

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="flex flex-col pb-32">
      {/* Header */}
      <div
        className="z-20 flex items-center gap-3 px-5 py-5"
        style={{
          backgroundColor: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link
          href="/"
          className="flex items-center justify-center rounded-[var(--r-s)] shrink-0"
          style={{
            width: 32,
            height: 32,
            color: "var(--fg-muted)",
            border: "1px solid var(--border)",
            textDecoration: "none",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            arrow_back
          </span>
        </Link>
        <h1
          className="font-display flex-1"
          style={{ fontSize: 22, color: "var(--fg)" }}
        >
          {t("title")}
        </h1>
      </div>

      <div className="px-5 py-6 flex flex-col gap-8">
        {/* Profile */}
        {session?.user && (
          <div>
            <SectionLabel>Account</SectionLabel>
            <div
              className="flex items-center gap-3 p-4 rounded-[var(--r)]"
              style={{
                backgroundColor: "var(--bg-raised)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="flex items-center justify-center rounded-full font-bold shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  fontSize: 16,
                  backgroundColor: "var(--fg)",
                  color: "var(--bg)",
                }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                {session.user.name && (
                  <p
                    className="font-semibold truncate"
                    style={{ fontSize: 15, color: "var(--fg)" }}
                  >
                    {session.user.name}
                  </p>
                )}
                {session.user.email && (
                  <p
                    className="font-mono truncate"
                    style={{ fontSize: 11, color: "var(--fg-muted)" }}
                  >
                    {session.user.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Appearance */}
        <div>
          <SectionLabel>{t("appearance")}</SectionLabel>
          <div
            className="p-4 rounded-[var(--r)]"
            style={{
              backgroundColor: "var(--bg-raised)",
              border: "1px solid var(--border)",
            }}
          >
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
                  className="flex-1 flex items-center justify-center gap-1.5 transition-colors"
                  style={{
                    height: 40,
                    fontSize: 13,
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
                  <span style={{ fontSize: 15 }}>
                    {s === "light" ? "☀" : s === "dark" ? "☾" : "⊙"}
                  </span>
                  <span>{t(s)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Language */}
        <div>
          <SectionLabel>{t("language")}</SectionLabel>
          <div
            className="rounded-[var(--r)] overflow-hidden"
            style={{
              backgroundColor: "var(--bg-raised)",
              border: "1px solid var(--border)",
            }}
          >
            {LOCALES.map((l, i) => (
              <button
                key={l.code}
                onClick={() => handleLocale(l.code)}
                className="flex items-center justify-between w-full px-4 py-3 text-left transition-colors"
                style={{
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  color: "var(--fg)",
                  backgroundColor:
                    currentLocale === l.code
                      ? "color-mix(in oklch, var(--ok) 8%, transparent)"
                      : "transparent",
                  border: "none",
                  borderTop: i > 0 ? "1px solid var(--border)" : "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (currentLocale !== l.code)
                    e.currentTarget.style.backgroundColor = "var(--bg-sunken)";
                }}
                onMouseLeave={(e) => {
                  if (currentLocale !== l.code)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {l.label}
                {currentLocale === l.code && (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16, color: "var(--ok)" }}
                  >
                    check
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <div>
          <SectionLabel>Session</SectionLabel>
          <div
            className="rounded-[var(--r)] overflow-hidden"
            style={{
              backgroundColor: "var(--bg-raised)",
              border: "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-left transition-colors"
              style={{
                fontSize: 14,
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                color: "var(--danger)",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
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
                style={{ fontSize: 18 }}
              >
                logout
              </span>
              {t("signOut")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
