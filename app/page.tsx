import {
  AlertRow,
  Btn,
  DashboardHeader,
  EmptyState,
  Grid,
  FAB,
  Icon,
  PageContainer,
  Stack,
  Text,
  TripTimelineRow,
} from "@/app/design";
import { COUNTRY_EMOJIS, getCountryName } from "@/app/constants";
import { ProfileAvatar } from "./components/ProfileAvatar";
import {
  getDashboardSummary,
  getTripsBefore,
  getTripsFrom,
} from "./server-actions";
import {
  copyForAlert,
  toneFromSeverity,
  uniqueAlertsForDisplay,
} from "./structured-copy";
import { Link } from "@/i18n/navigation";
import { Card } from "./Card";
import { formatDateRange } from "./utils";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations("dashboard");
  const navT = await getTranslations("nav");
  const fabT = await getTranslations("fab");
  const copyT = await getTranslations("copy");
  const statusT = await getTranslations("status");
  const tripT = await getTranslations("trip");
  const today = new Date();
  const todayIso = today.toISOString().split("T")[0];
  const [{ alerts, cards, warningOverflowCount }, upcoming, past] =
    await Promise.all([
      getDashboardSummary(),
      getTripsFrom(todayIso, 8),
      getTripsBefore(todayIso, 8),
    ]);
  const visibleAlerts = uniqueAlertsForDisplay(copyT, alerts);

  return (
    <PageContainer>
      <DashboardHeader
        date={today}
        title={t("title")}
        actions={
          <>
            <Btn
              as={Link}
              href="/atlas"
              variant="outline"
              size="sm"
              className="rounded-full h-[40px]"
            >
              {navT("atlas")}
            </Btn>
            <Btn
              as={Link}
              href="/visas"
              variant="outline"
              size="sm"
              className="rounded-full h-[40px]"
            >
              <Icon name="passport" />
              {navT("visas")}
            </Btn>
            <ProfileAvatar />
          </>
        }
      />

      <Stack className="gap-6">
        {cards.length > 0 && (
          <Grid className="grid-cols-2 gap-4">
            {cards.map((card) => (
              <Card
                key={`${card.kind}-${card.tripId ?? card.visaId ?? "card"}`}
                card={card}
              />
            ))}
          </Grid>
        )}

        {visibleAlerts.length > 0 && (
          <Stack className="gap-3">
            {visibleAlerts.map((alert) => {
              const copy = copyForAlert(copyT, alert);
              return (
                <AlertRow
                  key={alert.fingerprint}
                  href={
                    alert.tripId
                      ? `/trips/${alert.tripId}`
                      : alert.visaId
                        ? `/visas/${alert.visaId}`
                        : undefined
                  }
                  tone={toneFromSeverity(alert.severity)}
                  title={copy.title}
                  detail={copy.detail}
                  action={copyT("labels.review")}
                />
              );
            })}
            {warningOverflowCount > 0 && (
              <Text className="text-sm text-fg-muted">
                {copyT("moreWarnings", { count: warningOverflowCount })}
              </Text>
            )}
          </Stack>
        )}

        <Stack className="gap-2">
          <Text className="font-semibold text-lg">{t("upcoming")}</Text>
          {upcoming.trips.length === 0 ? (
            <Stack className="gap-3">
              <EmptyState
                icon="calendar"
                title={t("noTrips")}
                message={t("addFirst")}
                action={{
                  label: tripT("create"),
                  href: "/trips/create",
                }}
              />
            </Stack>
          ) : (
            upcoming.trips.map((trip, index) => (
              <TripTimelineRow
                key={trip.id}
                href={`/trips/${trip.id}`}
                date={new Date(trip.startDate)}
                month={new Date(trip.startDate).toLocaleDateString(locale, {
                  month: "short",
                })}
                title={
                  trip.name ??
                  getCountryName(trip.countryCode, locale) ??
                  trip.countryCode
                }
                flag={COUNTRY_EMOJIS[trip.countryCode] ?? "✈"}
                meta={formatDateRange(trip.startDate, trip.endDate, locale)}
                length={trip.durationDays}
                statusTone={
                  trip.visaRequired
                    ? trip.visaValid
                      ? "ok"
                      : "danger"
                    : "muted"
                }
                statusLabel={
                  trip.visaRequired
                    ? trip.visaValid
                      ? statusT("valid")
                      : statusT("visaInvalid")
                    : tripT("visaFree")
                }
                isLast={index === upcoming.trips.length - 1}
              />
            ))
          )}
        </Stack>

        {past.trips.length > 0 && (
          <Stack className="gap-2">
            <Text className="font-semibold text-lg">{t("past")}</Text>
            {past.trips.map((trip, index) => (
              <TripTimelineRow
                key={trip.id}
                href={`/trips/${trip.id}`}
                date={new Date(trip.startDate)}
                month={new Date(trip.startDate).toLocaleDateString(locale, {
                  month: "short",
                })}
                title={
                  trip.name ??
                  getCountryName(trip.countryCode, locale) ??
                  trip.countryCode
                }
                flag={COUNTRY_EMOJIS[trip.countryCode] ?? "✈"}
                meta={formatDateRange(trip.startDate, trip.endDate, locale)}
                length={trip.durationDays}
                statusTone={
                  trip.visaRequired
                    ? trip.visaValid
                      ? "ok"
                      : "danger"
                    : "muted"
                }
                statusLabel={
                  trip.visaRequired
                    ? trip.visaValid
                      ? statusT("valid")
                      : statusT("visaInvalid")
                    : tripT("visaFree")
                }
                isPast
                isLast={index === past.trips.length - 1}
              />
            ))}
          </Stack>
        )}
      </Stack>

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
  );
}
