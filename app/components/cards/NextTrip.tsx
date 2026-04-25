import { TimelineTrip } from "@/app/server-actions";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { COUNTRY_EMOJIS, COUNTRY_NAMES } from "@/app/constants";
import Link from "next/link";
import { Stack, StatCard, Text } from "@/app/design";

export async function NextTripCard({ trip }: { trip: TimelineTrip }) {
  const t = useTranslations();
  const timeUntil = formatDistanceToNow(new Date(trip.startDate), {
    addSuffix: true,
  });
  return (
    <Link href={`/trips/${trip.id}`}>
      <StatCard label={t("dashboard.nextTrip")}>
        <Stack gap="sm">
          <Stack gap="xs">
            <Text variant="small">{t("dashboard.nextTrip")}</Text>
            <Text variant="meta">{timeUntil}</Text>
          </Stack>
          <Stack gap="sm">
            <Text variant="body">{COUNTRY_EMOJIS[trip.countryCode]}</Text>
            <Text variant="body">
              {trip.name || COUNTRY_NAMES[trip.countryCode] || trip.countryCode}
            </Text>
          </Stack>
          {/* TODO: duration */}
          {/* {status !== "not-required" && (
                      <Stack gap="xs">
                        <StatusPip tone={tone} size={6} />
                        <Text as="span" variant="mono" style={{ fontSize: 10, letterSpacing: "0.08em", color: toneColor }}>
                          {STATUS_LABEL[status]}
                        </Text>
                      </Stack>
                    )} */}
        </Stack>
      </StatCard>
    </Link>
  );
}
