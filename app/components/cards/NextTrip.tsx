import { TimelineTrip } from "@/app/server-actions";
import { Card } from "../ui/Card";
import { Text } from "../ui/typography/Text";
import { useTranslations } from "next-intl";
import { formatDistanceToNow } from "date-fns";
import { Flex } from "../ui/layout/Flex";
import { COUNTRY_EMOJIS, COUNTRY_NAMES } from "@/app/constants";
import { Heading } from "../ui/typography/Heading";
import { StatusBadge } from "../ui/StatusBadge";
import Link from "next/link";
import { StatusPip } from "../ui/StatusPip";

export async function NextTripCard({ trip }: { trip: TimelineTrip }) {
  const t = useTranslations();
  const timeUntil = formatDistanceToNow(new Date(trip.startDate), {
    addSuffix: true,
  });
  return (
    <Link href={`/trips/${trip.id}`}>
      <Card>
        <Flex variant="column" gap="sm">
          <Flex variant="column">
            <Text variant="mono">{t("dashboard.nextTrip")}</Text>
            <Text variant="mono-small">{timeUntil}</Text>
          </Flex>
          <Flex variant="row-center" gap="sm" minW={0}>
            <Heading variant="h3">{COUNTRY_EMOJIS[trip.countryCode]}</Heading>
            <Heading variant="h3">
              {trip.name || COUNTRY_NAMES[trip.countryCode] || trip.countryCode}
            </Heading>
          </Flex>
          {/* TODO: duration */}
          {/* {status !== "not-required" && (
                      <Flex variant="row-center" gap="xs">
                        <StatusPip tone={tone} size={6} />
                        <Text as="span" variant="mono" style={{ fontSize: 10, letterSpacing: "0.08em", color: toneColor }}>
                          {STATUS_LABEL[status]}
                        </Text>
                      </Flex>
                    )} */}
        </Flex>
      </Card>
    </Link>
  );
}
