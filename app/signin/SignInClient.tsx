import { getLocale, getTranslations } from "next-intl/server";
import { getProviders } from "next-auth/react";
import {
  Display,
  Grid,
  PageContainer,
  Stack,
  StickyBar,
  Text,
  PosterBackdrop,
  PosterMasthead,
  PosterMetricCard,
  PosterStepList,
  Kicker,
} from "@/app/design";
import { APP_ESTABLISHED_YEAR, APP_NAME } from "../constants";
import { SignInButton } from "./SignInButton";

export default async function SignInClient() {
  const [providers, t, locale] = await Promise.all([
    getProviders(),
    getTranslations("signin"),
    getLocale(),
  ]);
  const authProviders = providers
    ? Object.values(providers).filter(
        (provider) => provider.id !== "credentials"
      )
    : [];
  const callbackUrl = `/${locale}`;

  return (
    <PageContainer className="relative min-h-screen overflow-hidden pb-40 pt-6">
      <PosterBackdrop />

      <Stack gap="xl" className="mb-20">
        <Stack gap="md">
          <PosterMasthead
            title={APP_NAME}
            subtitle={t("established", { year: APP_ESTABLISHED_YEAR })}
          />

          <div className="max-w-2xl">
            <Display level={1} as="h1">
              {t("headlinePart1")}
              <br />
              <em className="not-italic opacity-85">{t("headlinePart2")}</em>
              <br />
              {t("headlinePart3")}
            </Display>
            <Text className="mt-5 max-w-xl text-fg-muted">{t("body")}</Text>
          </div>
        </Stack>

        <Grid cols={3} gap="none" className="md:grid-cols-3">
          {[
            {
              index: "01",
              title: t("promiseTrips"),
              detail: t("promiseTripsLabel"),
            },
            {
              index: "02",
              title: t("promiseDays"),
              detail: t("promiseDaysLabel"),
            },
            {
              index: "03",
              title: t("promiseVisas"),
              detail: t("promiseVisasLabel"),
            },
          ].map((item) => (
            <PosterMetricCard
              key={item.index}
              index={item.index}
              title={item.title}
              detail={item.detail}
            />
          ))}
        </Grid>

        <Stack gap="sm">
          <div className="flex items-baseline justify-between gap-4">
            <Kicker>{t("howItWorksTitle")}</Kicker>
            <Text variant="meta" tone="faint">
              {t("howItWorksCount")}
            </Text>
          </div>

          <PosterStepList
            steps={[
              {
                title: t("step1Title"),
                description: t("step1Desc"),
                roman: "I",
              },
              {
                title: t("step2Title"),
                description: t("step2Desc"),
                roman: "II",
              },
              {
                title: t("step3Title"),
                description: t("step3Desc"),
                roman: "III",
              },
            ]}
          />
        </Stack>
      </Stack>

      <StickyBar
        position="bottom"
        mode="fixed"
        className="border-t border-border/80"
      >
        <PageContainer className="py-4">
          <Stack gap="sm">
            {authProviders.map((provider) => (
              <SignInButton
                key={provider.name}
                name={provider.name}
                id={provider.id}
                callbackUrl={callbackUrl}
              />
            ))}

            <Text variant="small" tone="muted" className="mt-2">
              {t("disclaimer")}
            </Text>

            <div className="flex justify-between font-mono text-[10px] tracking-[0.18em] opacity-50">
              <span>v {process.env.NEXT_PUBLIC_APP_VERSION}</span>
            </div>
          </Stack>

          {process.env.NODE_ENV !== "production" && (
            <form action="/api/dev-login" method="post" className="mt-4">
              <button
                type="submit"
                className="cursor-pointer border-none bg-none p-0 font-mono text-[11px] tracking-[0.16em] opacity-50 transition-opacity hover:opacity-70"
              >
                {t("devSignIn")}
              </button>
            </form>
          )}
        </PageContainer>
      </StickyBar>
    </PageContainer>
  );
}
