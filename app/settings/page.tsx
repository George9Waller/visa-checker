"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type ColorScheme, getSavedScheme, saveScheme } from "../components/ThemeProvider";
import { useTranslations } from "next-intl";
import { Box } from "../components/ui/layout/Box";
import { Flex } from "../components/ui/layout/Flex";
import { Text } from "../components/ui/typography/Text";
import { Heading } from "../components/ui/typography/Heading";
import { Icon } from "../components/ui/typography/Icon";
import { Btn } from "../components/ui/Btn";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      variant="mono"
      color="muted"
      mb="sm"
      as="p"
      style={{ fontSize: 10, fontWeight: "bold" }}
    >
      {children}
    </Text>
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
    <Flex variant="column" pb="xl">
      {/* Header */}
      <Flex
        variant="row-center"
        gap="md"
        px="lg"
        py="lg"
        style={{
          backgroundColor: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          zIndex: 20,
        }}
      >
        <Box
          as={Link}
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            flexShrink: 0,
            color: "var(--fg-muted)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-s)",
            textDecoration: "none",
          }}
        >
          <Icon name="arrow_back" size="md" />
        </Box>
        <Heading variant="h2" style={{ flex: 1, fontSize: 22 }}>
          {t("title")}
        </Heading>
      </Flex>

      <Flex variant="column" px="lg" py="xl" gap="xl">
        {/* Profile */}
        {session?.user && (
          <Box>
            <SectionLabel>Account</SectionLabel>
            <Flex
              variant="row-center"
              p="md"
              gap="md"
              style={{
                backgroundColor: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r)",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: 99,
                  fontWeight: "bold",
                  fontSize: 16,
                  backgroundColor: "var(--fg)",
                  color: "var(--bg)",
                }}
              >
                {initials}
              </Box>
              <Box style={{ minWidth: 0 }}>
                {session.user.name && (
                  <Text
                    style={{ fontSize: 15, fontWeight: 600, display: "block" }}
                    truncate
                  >
                    {session.user.name}
                  </Text>
                )}
                {session.user.email && (
                  <Text
                    variant="mono"
                    color="muted"
                    style={{ fontSize: 11, display: "block" }}
                    truncate
                  >
                    {session.user.email}
                  </Text>
                )}
              </Box>
            </Flex>
          </Box>
        )}

        {/* Appearance */}
        <Box>
          <SectionLabel>{t("appearance")}</SectionLabel>
          <Box
            p="md"
            style={{
              backgroundColor: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r)",
            }}
          >
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    height: 40,
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    fontWeight: scheme === s ? 600 : 400,
                    backgroundColor:
                      scheme === s ? "var(--bg-raised)" : "transparent",
                    color: scheme === s ? "var(--fg)" : "var(--fg-muted)",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  aria-pressed={scheme === s}
                >
                  <span style={{ fontSize: 15 }}>
                    {s === "light" ? "☀" : s === "dark" ? "☾" : "⊙"}
                  </span>
                  <span>{t(s)}</span>
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>

        {/* Language */}
        <Box>
          <SectionLabel>{t("language")}</SectionLabel>
          <Box
            style={{
              backgroundColor: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r)",
              overflow: "hidden",
            }}
          >
            {LOCALES.map((l, i) => (
              <Box
                as="button"
                key={l.code}
                onClick={() => handleLocale(l.code)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "12px 16px",
                  textAlign: "left",
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
                  transition: "background-color 0.2s",
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
                  <Icon
                    name="check"
                    size="sm"
                    color="ok"
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Sign out */}
        <Box>
          <SectionLabel>Session</SectionLabel>
          <Box
            style={{
              backgroundColor: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r)",
              overflow: "hidden",
            }}
          >
            <Box
              as="button"
              onClick={() => signOut()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "12px 16px",
                textAlign: "left",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                color: "var(--danger)",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s",
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
                size="md"
              />
              {t("signOut")}
            </Box>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
