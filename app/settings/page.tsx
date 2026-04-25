"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Btn,
  DashboardHeader,
  Fact,
  FactGrid,
  OptionList,
  OptionRow,
  PageContainer,
  Stack,
  Text,
} from "@/app/design";
import {
  type ColorScheme,
  getSavedScheme,
  saveScheme,
} from "../components/ThemeProvider";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { data: session } = useSession();
  const router = useRouter();
  const [scheme, setScheme] = useState<ColorScheme>("system");
  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    setScheme(getSavedScheme());
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (match) {
      setCurrentLocale(match[1]);
    }
  }, []);

  const handleScheme = (nextScheme: ColorScheme) => {
    setScheme(nextScheme);
    saveScheme(nextScheme);
  };

  const handleLocale = (code: string) => {
    document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000`;
    setCurrentLocale(code);
    router.refresh();
  };

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <PageContainer>
      <DashboardHeader
        date={new Date()}
        weekday={new Date().toLocaleDateString("en-GB", { weekday: "long" })}
        title={t("title")}
        actions={
          <Btn as={Link} href="/" variant="outline" size="sm">
            Trips
          </Btn>
        }
      />

      <Stack gap="xl">
        {session?.user && (
          <Stack gap="sm">
            <Text variant="meta" tone="muted">
              Account
            </Text>
            <FactGrid cols={2}>
              <Fact label="Initials" value={initials} />
              <Fact label="Email" value={session.user.email ?? "—"} />
            </FactGrid>
            {session.user.name && (
              <Text variant="small" tone="muted">
                Signed in as {session.user.name}
              </Text>
            )}
          </Stack>
        )}

        <Stack gap="sm">
          <Text variant="meta" tone="muted">
            {t("appearance")}
          </Text>
          <div className="grid grid-cols-3 gap-2">
            {(["light", "system", "dark"] as ColorScheme[]).map((value) => (
              <Btn
                key={value}
                variant={scheme === value ? "primary" : "outline"}
                size="sm"
                onClick={() => handleScheme(value)}
              >
                {t(value)}
              </Btn>
            ))}
          </div>
        </Stack>

        <Stack gap="sm">
          <Text variant="meta" tone="muted">
            {t("language")}
          </Text>
          <OptionList maxHeight="none">
            {LOCALES.map((locale) => (
              <OptionRow
                key={locale.code}
                title={locale.label}
                subtitle={locale.code.toUpperCase()}
                selected={currentLocale === locale.code}
                onClick={() => handleLocale(locale.code)}
              />
            ))}
          </OptionList>
        </Stack>

        {session?.user && (
          <Btn variant="danger" onClick={() => signOut({ callbackUrl: "/" })}>
            {t("signOut")}
          </Btn>
        )}
      </Stack>
    </PageContainer>
  );
}
