import {
  AlertRow,
  Btn,
  DashboardHeader,
  EmptyState,
  Grid,
  PageContainer,
  Stack,
  StatCard,
  Text,
  TripHeroCard,
  TripTimelineRow,
} from "@/app/design";
import { COUNTRY_EMOJIS, COUNTRY_NAMES } from "@/app/constants";
import {
  getDashboardSummary,
  getTripsBefore,
  getTripsFrom,
} from "./server-actions";
import { copyForAlert, copyForCard, toneFromSeverity } from "./structured-copy";
import Link from "next/link";

const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })} - ${end.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};

export default async function Home() {
  const today = new Date();
  const todayIso = today.toISOString().split("T")[0];
  const [{ alerts, cards, currentTrip, warningOverflowCount }, upcoming, past] =
    await Promise.all([
      getDashboardSummary(),
      getTripsFrom(todayIso, 8),
      getTripsBefore(todayIso, 8),
    ]);

  return (
    <PageContainer>
      <DashboardHeader
        date={today}
        weekday={today.toLocaleDateString("en-GB", { weekday: "long" })}
        actions={
          <Btn as={Link} href="/visas" variant="outline" size="sm">
            Visas
          </Btn>
        }
      />

      <Stack className="gap-6">
        {currentTrip && (
          <TripHeroCard
            href={`/trips/${currentTrip.trip.id}`}
            flag={COUNTRY_EMOJIS[currentTrip.trip.countryCode] ?? "✈"}
            title={
              currentTrip.trip.name ??
              COUNTRY_NAMES[currentTrip.trip.countryCode] ??
              currentTrip.trip.countryCode
            }
            livePill
            subtitle={formatDateRange(
              currentTrip.trip.startDate.toISOString(),
              currentTrip.trip.endDate.toISOString()
            )}
          />
        )}

        {cards.length > 0 && (
          <Grid className="grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card) => {
              const copy = copyForCard(card);
              const href = card.tripId
                ? `/trips/${card.tripId}`
                : card.visaId
                  ? `/visas/${card.visaId}`
                  : undefined;
              return (
                <StatCard
                  key={`${card.kind}-${card.tripId ?? card.visaId ?? "card"}`}
                  href={href}
                  label={copy.label}
                  sublabel={copy.sublabel}
                  className={
                    card.tone === "danger"
                      ? "border-danger/40"
                      : card.tone === "warn"
                        ? "border-warn/40"
                        : ""
                  }
                >
                  <Text className="text-sm text-fg-muted">
                    {card.kind === "NEXT_TRIP"
                      ? (card.params.tripName?.toString() ?? "")
                      : card.kind === "NEXT_EXPIRY"
                        ? (card.params.expiryDate?.toString() ?? "")
                        : card.kind === "ROLLING_WINDOW_USAGE"
                          ? `Reset ${card.params.resetDate ?? "TBC"}`
                          : ""}
                  </Text>
                </StatCard>
              );
            })}
          </Grid>
        )}

        {alerts.length > 0 && (
          <Stack className="gap-3">
            {alerts.map((alert) => {
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
                  action="Open"
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
                      ? "ready"
                      : "needs review"
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
    </PageContainer>
  );
}
