export const dynamic = "force-dynamic";

import { getVisas } from "./server-actions";
import { VisaTypeKey } from "./constants";
import {
  EmptyState,
  FAB,
  Icon,
  PageContainer,
  PageHeader,
  Stack,
  Text,
  VisaListRow,
} from "@/app/design";
import { getVisaFlag } from "./utils";
import { getLocale, getTranslations } from "next-intl/server";

const formatDate = (value: Date, locale: string) =>
  value.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function VisasPage() {
  const locale = await getLocale();
  const t = await getTranslations("visa");
  const fabT = await getTranslations("fab");
  const statusT = await getTranslations("status");
  const visaGroups = await getVisas();
  const today = new Date();

  const renderVisaRow = (
    visa: (typeof visaGroups)[number]["primary"],
    muted = false,
    kicker?: string
  ) => {
    const isExpired = Boolean(visa.expires && visa.expires < today);
    const isExpiringSoon =
      Boolean(visa.expires) &&
      !isExpired &&
      (visa.expires!.getTime() - today.getTime()) / 86400000 <= 30;
    const statusTone = muted
      ? "muted"
      : isExpired
        ? "danger"
        : isExpiringSoon
          ? "warn"
          : "ok";

    return (
      <VisaListRow
        key={visa.id}
        href={`/visas/${visa.id}`}
        flag={getVisaFlag(visa.type as VisaTypeKey, visa.countries)}
        title={visa.name}
        kicker={
          kicker ??
          [
            t(`types.${visa.type}`),
            visa.expires
              ? t("expiresOnDate", { date: formatDate(visa.expires, locale) })
              : t("openEnded"),
          ]
            .filter(Boolean)
            .join(" · ")
        }
        countryCount={visa.countries.length}
        statusTone={statusTone}
        statusLabel={
          muted
            ? t("renewed")
            : isExpired
              ? statusT("expired")
              : isExpiringSoon
                ? t("expiring")
                : statusT("valid")
        }
        muted={muted}
      />
    );
  };

  return (
    <>
      <PageHeader title={t("all")} backHref="/" />
      <PageContainer>
        <Stack className="gap-4">
          {visaGroups.length === 0 ? (
            <EmptyState
              icon="passport"
              title={t("noVisasYet")}
              message={t("addFirstVisa")}
              action={{
                label: t("create"),
                href: "/visas/create",
              }}
            />
          ) : (
            visaGroups.map((group) => (
              <div key={group.primary.id} className="space-y-2">
                {renderVisaRow(group.primary)}
                {group.history.length > 0 && (
                  <div className="ml-4 border-l border-border/70 pl-4">
                    {group.history.map((visa, index) =>
                      renderVisaRow(
                        visa,
                        true,
                        index === 0
                          ? t("renewedFromThisChain")
                          : t("earlierVisa")
                      )
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </Stack>

        {visaGroups.length > 0 && (
          <Text className="mt-4 text-sm text-fg-muted">{t("tapToReview")}</Text>
        )}

        <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
          <FAB
            actions={[
              {
                href: "/trips/create",
                icon: <Icon name="calendar" size="sm" />,
                title: fabT("trip"),
                description: fabT("tripDesc"),
              },
              {
                href: "/visas/create",
                icon: <Icon name="passport" size="sm" />,
                title: fabT("visa"),
                description: fabT("visaDesc"),
              },
            ]}
          />
        </div>
      </PageContainer>
    </>
  );
}
