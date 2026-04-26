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
import { COUNTRY_EMOJIS, COUNTRY_NAMES } from "@/app/constants";
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
import Link from "next/link";
import { Card } from "./Card";
import { formatDateRange } from "./utils";

export default async function Home() {
  const today = new Date();
  const todayIso = today.toISOString().split("T")[0];
  const [{ alerts, cards, warningOverflowCount }, upcoming, past] =
    await Promise.all([
      getDashboardSummary(),
      getTripsFrom(todayIso, 8),
      getTripsBefore(todayIso, 8),
    ]);
  const visibleAlerts = uniqueAlertsForDisplay(alerts);

  return (
    <PageContainer>
      <DashboardHeader
        date={today}
        weekday={today.toLocaleDateString("en-GB", { weekday: "long" })}
        actions={
          <>
            <Btn
              as={Link}
              href="/visas"
              variant="outline"
              size="sm"
              className="rounded-full h-[40px]"
            >
              Visas
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
              const copy = copyForAlert(alert);
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
                  action="Review"
                />
              );
            })}
            {warningOverflowCount > 0 && (
              <Text className="text-sm text-fg-muted">
                +{warningOverflowCount} more warning
                {warningOverflowCount === 1 ? "" : "s"}
              </Text>
            )}
          </Stack>
        )}

        <Stack className="gap-2">
          <Text className="font-semibold text-lg">Upcoming</Text>
          {upcoming.trips.length === 0 ? (
            <Stack className="gap-3">
              <EmptyState
                title="No upcoming trips"
                message="Add your first trip to start tracking visas."
              />
              <div>
                <Btn as={Link} href="/trips/create" variant="primary">
                  Add trip
                </Btn>
              </div>
            </Stack>
          ) : (
            upcoming.trips.map((trip, index) => (
              <TripTimelineRow
                key={trip.id}
                href={`/trips/${trip.id}`}
                date={new Date(trip.startDate)}
                month={new Date(trip.startDate).toLocaleDateString("en-GB", {
                  month: "short",
                })}
                title={
                  trip.name ??
                  COUNTRY_NAMES[trip.countryCode] ??
                  trip.countryCode
                }
                flag={COUNTRY_EMOJIS[trip.countryCode] ?? "✈"}
                meta={formatDateRange(trip.startDate, trip.endDate)}
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
                      ? "valid"
                      : "invalid"
                    : "visa-free"
                }
                isLast={index === upcoming.trips.length - 1}
              />
            ))
          )}
        </Stack>

        <Stack className="gap-2">
          <Text className="font-semibold text-lg">Past</Text>
          {past.trips.map((trip, index) => (
            <TripTimelineRow
              key={trip.id}
              href={`/trips/${trip.id}`}
              date={new Date(trip.startDate)}
              month={new Date(trip.startDate).toLocaleDateString("en-GB", {
                month: "short",
              })}
              title={
                trip.name ?? COUNTRY_NAMES[trip.countryCode] ?? trip.countryCode
              }
              flag={COUNTRY_EMOJIS[trip.countryCode] ?? "✈"}
              meta={formatDateRange(trip.startDate, trip.endDate)}
              length={trip.durationDays}
              statusTone={
                trip.visaRequired ? (trip.visaValid ? "ok" : "danger") : "muted"
              }
              statusLabel={
                trip.visaRequired
                  ? trip.visaValid
                    ? "valid"
                    : "invalid"
                  : "visa-free"
              }
              isPast
              isLast={index === past.trips.length - 1}
            />
          ))}
        </Stack>
      </Stack>

        <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
          <FAB
            actions={[
              {
                href: "/trips/create",
                icon: <Icon name="calendar" size="sm" />,
                title: "Plan trip",
                description: "Create an upcoming journey",
              },
              {
                href: "/visas/create",
                icon: <Icon name="visa-card" size="sm" />,
                title: "Add visa",
                description: "Save a visa or permit",
              },
            ]}
          />
        </div>
    </PageContainer>
  );
}
