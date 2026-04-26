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
import { DashboardCard } from "./visas/evaluation";
import { getTripDetailSummary } from "./trips/server-actions";
import { COUNTRY_EMOJIS, getCountryName } from "./constants";
import { formatDateRange } from "./utils";
import { getLocale, getTranslations } from "next-intl/server";
import { getVisaFlag } from "./visas/utils";
import { VisaTypeKey } from "./visas/constants";

export async function Card({ card }: { card: DashboardCard }) {
  const locale = await getLocale();
  const copyT = await getTranslations("copy");
  const today = new Date();
  const copy = copyForCard(copyT, card);
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

  if (card.kind == "CURRENTLY_TRAVELING" && tripDetailSummary) {
    return (
      <TripHeroCard
        href={`/trips/${tripDetailSummary.trip.id}`}
        flag={COUNTRY_EMOJIS[tripDetailSummary.trip.countryCode] ?? "✈"}
        title={
          tripDetailSummary.trip.name ??
          getCountryName(tripDetailSummary.trip.countryCode, locale) ??
          tripDetailSummary.trip.countryCode
        }
        livePill
        subtitle={formatDateRange(
          tripDetailSummary.trip.startDate.toISOString(),
          tripDetailSummary.trip.endDate.toISOString(),
          locale
        )}
        className="col-span-2"
      />
    );
  }

  if (
    [
      "ROLLING_WINDOW_USAGE",
      "ALLOWANCE_REMAINING",
      "ENTRIES_REMAINING",
    ].includes(card.kind)
  ) {
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
          {card.kind === "ENTRIES_REMAINING"
            ? copyT("cards.ENTRIES_REMAINING.remainingEntries", {
                remaining: Number(card.params.remaining ?? 0),
              })
            : copyT(`cards.${card.kind}.remainingDays`, {
                remaining: Number(card.params.remaining ?? 0),
              })}
        </Text>
      </StatCard>
    );
  }

  if (card.kind === "NEXT_EXPIRY") {
    const expiry = new Date(card.params.expiryDate as string);
    return (
      <StatCard
        href={href}
        label={copy.label}
        sublabel={copy.sublabel}
        className={cardClassName}
      >
        <div className="flex items-center gap-2 min-w-0 mb-1">
          <Flag size="md">
            {getVisaFlag(
              card.params.visaType as VisaTypeKey,
              card.params.countries as string[]
            )}
          </Flag>
          <Display level={4}>{card.params.visaName as string}</Display>
        </div>
        <Text className="text-sm text-fg-muted">
          {expiry.toLocaleDateString(locale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
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
          {startDate.toLocaleDateString(locale, {
            day: "2-digit",
            month: "2-digit",
          })}{" "}
          -{" "}
          {endDate.toLocaleDateString(locale, {
            day: "2-digit",
            month: "2-digit",
          })}{" "}
          ·{" "}
          {copyT("cards.NEXT_TRIP.durationDays", {
            durationDays: Number(card.params.durationDays ?? 0),
          })}
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
    ></StatCard>
  );
}
