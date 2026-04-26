"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Btn,
  DashboardHeader,
  Fact,
  FactGrid,
  Icon,
  OptionList,
  OptionRow,
  PageContainer,
  Stack,
  Text,
} from "@/app/design";
import { setLocaleCookie } from "@/app/components/locale";
import {
  type ColorScheme,
  getSavedScheme,
  saveScheme,
} from "../components/ThemeProvider";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
];

const getInitialLocale = () => {
  if (typeof document === "undefined") {
    return "en";
  }
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  return match?.[1] ?? "en";
};

export default function SettingsPage() {
  const t = useTranslations("settings");
  const navT = useTranslations("nav");
  const { data: session } = useSession();
  const router = useRouter();
  const [scheme, setScheme] = useState<ColorScheme>(() => getSavedScheme());
  const [currentLocale, setCurrentLocale] = useState(() => getInitialLocale());

  const handleScheme = (nextScheme: ColorScheme) => {
    setScheme(nextScheme);
    saveScheme(nextScheme);
  };

  const handleLocale = (code: string) => {
    setLocaleCookie(code);
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
        title={t("title")}
        actions={
          <Btn
            as={Link}
            href="/"
            variant="outline"
            size="sm"
            className="rounded-full h-[40px]"
          >
            <Icon name="calendar" />
            {navT("trips")}
          </Btn>
        }
      />

      <Stack gap="xl">
        {session?.user && (
          <Stack gap="sm">
            <Text variant="meta" tone="muted">
              {t("account")}
            </Text>
            <FactGrid cols={2}>
              <Fact label={t("initials")} value={initials} />
              <Fact label={t("email")} value={session.user.email ?? "—"} />
            </FactGrid>
            {session.user.name && (
              <Text variant="small" tone="muted">
                {t("signedInAs", { name: session.user.name })}
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
                title={t(`locales.${locale.code}`)}
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

        <FactGrid cols={1}>
          <Fact
            label={t("project")}
            value={
              <Link href="https://github.com/George9Waller/visa-checker" target="_blank" rel="noopener noreferrer">
                https://github.com/George9Waller/visa-checker
              </Link>
            }
          />
        </FactGrid>
      </Stack>
    </PageContainer>
  );
}
