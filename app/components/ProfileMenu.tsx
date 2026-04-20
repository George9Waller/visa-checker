"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { type ColorScheme, getSavedScheme, saveScheme } from "./ThemeProvider";
import { useTranslations } from "next-intl";
import { Box } from "./ui/layout/Box";
import { Flex } from "./ui/layout/Flex";
import { Text } from "./ui/typography/Text";
import { Icon } from "./ui/typography/Icon";
import { Heading } from "./ui/typography/Heading";

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
    <Box position="relative" ref={menuRef}>
      {/* Avatar button */}
      <Box
        as="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 99,
          fontWeight: "bold",
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
      </Box>

      {/* Dropdown menu */}
      {open && (
        <Flex
          variant="column"
          position="absolute"
          style={{
            right: 0,
            top: 40,
            zIndex: 50,
            width: 220,
            backgroundColor: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* Appearance */}
          <Box
            px="md"
            py="sm"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <Text
              variant="mono"
              color="muted"
              mb="xs"
              as="p"
              style={{ fontWeight: "bold", fontSize: 10 }}
            >
              {t("appearance")}
            </Text>
            <Flex
              variant="row"
              style={{
                borderRadius: "var(--r-s)",
                overflow: "hidden",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-sunken)",
              }}
            >
              {(["light", "system", "dark"] as ColorScheme[]).map((s) => (
                <Box
                  as="button"
                  key={s}
                  onClick={() => handleScheme(s)}
                  style={{
                    flex: 1,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
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
                </Box>
              ))}
            </Flex>
          </Box>

          {/* Language */}
          <Box
            px="md"
            py="sm"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <Text
              variant="mono"
              color="muted"
              mb="xs"
              as="p"
              style={{ fontWeight: "bold", fontSize: 10 }}
            >
              {t("language")}
            </Text>
            <Flex variant="column" gap="xs">
              {LOCALES.map((l) => (
                <Box
                  as="button"
                  key={l.code}
                  onClick={() => handleLocale(l.code)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: "var(--r-xs)",
                    padding: "6px 8px",
                    textAlign: "left",
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
                    <Icon
                      name="check"
                      size="xs"
                      color="ok"
                    />
                  )}
                </Box>
              ))}
            </Flex>
          </Box>

          {/* Sign out */}
          <Box
            as="button"
            onClick={() => signOut()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              width: "100%",
              textAlign: "left",
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
            <Icon
              name="logout"
              size="sm"
            />
            {t("signOut")}
          </Box>
        </Flex>
      )}
    </Box>
  );
}
