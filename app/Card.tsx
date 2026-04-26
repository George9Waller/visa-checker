import {
  Display,
  Flag,
  Kicker,
  StatCard,
  StatusPip,
  Text,
  TripHeroCard,
} from "@/app/design";
import { copyForCard } from "./structured-copy";
import { DashboardCard, ProjectionPoint } from "./visas/evaluation";
import { getTripDetailSummary } from "./trips/server-actions";
import { COUNTRY_EMOJIS, COUNTRY_NAMES } from "./constants";
import { formatDateRange } from "./utils";

export async function Card({ card }: { card: DashboardCard }) {
  const today = new Date();
  const copy = copyForCard(card);
  const href = card.tripId
    ? `/trips/${card.tripId}`
    : card.visaId
      ? `/visas/${card.visaId}`
      : undefined;

  const tripDetailSummary =
    card.tripId !== undefined
      ? await getTripDetailSummary(card.tripId)
      : undefined;

  const cardClassName =
    card.tone === "danger"
      ? "border-danger/40"
      : card.tone === "warn"
        ? "border-warn/40"
        : "";

  console.log(card);

  if (card.kind == "CURRENTLY_TRAVELING" && tripDetailSummary) {
    return (
      <TripHeroCard
        href={`/trips/${tripDetailSummary.trip.id}`}
        flag={COUNTRY_EMOJIS[tripDetailSummary.trip.countryCode] ?? "✈"}
        title={
          tripDetailSummary.trip.name ??
          COUNTRY_NAMES[tripDetailSummary.trip.countryCode] ??
          tripDetailSummary.trip.countryCode
        }
        livePill
        subtitle={formatDateRange(
          tripDetailSummary.trip.startDate.toISOString(),
          tripDetailSummary.trip.endDate.toISOString()
        )}
        className="col-span-2"
      />
    );
  }

  if (card.kind === "ROLLING_WINDOW_USAGE") {
    return (
      <StatCard
        href={href}
        label={copy.label}
        sublabel={copy.sublabel}
        className={cardClassName}
      >
        <Display level={1}>
          {card.params.used as string}
          <Text variant="meta" tone="faint" className="inline">
            /{card.params.limit as string}
          </Text>
        </Display>
        <progress
          value={card.params.used as number}
          max={card.params.limit as number}
        />
        <Text variant="meta" tone="muted">
          {card.params.remaining as string} days left
        </Text>
      </StatCard>
    );
  }

  if (card.kind === "NEXT_TRIP") {
    const startDate = new Date(card.params.startDate as string);
    const endDate = new Date(card.params.endDate as string);
    return (
      <StatCard
        href={href}
        label={copy.label}
        sublabel={copy.sublabel}
        className={cardClassName}
      >
        <div className="flex items-center gap-2 min-w-0 mb-1">
          <Flag size="md">
            {COUNTRY_EMOJIS[card.params.countryCode as string] ?? "✈"}
          </Flag>
          <Display level={4}>{card.params.tripName as string}</Display>
        </div>
        <Text variant="meta" tone="muted">
          {startDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          })}{" "}
          -{" "}
          {endDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          })}{" "}
          · {card.params.durationDays as string} days
        </Text>
        <div className="flex items-center gap-1.5">
          <StatusPip tone={card.tone} size="xs" />
          <Kicker className="text-xs uppercase">
            {card.params.statusSummary as string}
          </Kicker>
        </div>
      </StatCard>
    );
  }

  return (
    <StatCard
      href={href}
      label={copy.label}
      sublabel={copy.sublabel}
      className={cardClassName}
    >
      <Text className="text-sm text-fg-muted">
        {card.kind === "NEXT_EXPIRY"
          ? (card.params.expiryDate?.toString() ?? "")
          : ""}
      </Text>
    </StatCard>
  );
}
