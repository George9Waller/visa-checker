import Link from "next/link";
import {
  getTripsBefore,
  getTripsFrom,
  getWarnings,
  getCurrentTrip,
} from "@/app/server-actions";
import { FAB } from "./FAB";
import { useTranslations } from "next-intl";
import { TripsList } from "./TripsList";
import { Warning } from "./ui/Warning";
import { use } from "react";
import { Box } from "./ui/layout/Box";
import { Flex } from "./ui/layout/Flex";
import { Heading } from "./ui/typography/Heading";
import { Text } from "./ui/typography/Text";
import { Btn } from "./ui/Btn";
import { Icon } from "./ui/typography/Icon";

export default function TripTimeline() {
  const t = useTranslations();
  const warnings = use(getWarnings());
  const currentTrips = use(getCurrentTrip());
  const currentTrip = currentTrips.length > 0 ? currentTrips[0] : null;
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Box width="full" px="lg" pt="lg" pb="xl">
      {/* Dashboard header */}
      <Flex variant="row-between" mb="lg" gap="sm" style={{ alignItems: "flex-end" }}>
        <Box minW={0}>
          <Text
            variant="mono"
            mb="xs"
            color="muted"
            as="div"
          >
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Heading variant="h2">
            {t("dashboard.title")}
          </Heading>
        </Box>
      </Flex>

      {warnings && warnings.length > 0 && (
        <Flex variant="column" gap="md" mb="xl" width="full">
          {warnings.map((warning, index) => (
            <Warning key={index} {...warning} />
          ))}
        </Flex>
      )}

      {currentTrip && (
        <Link href={`/trips/${currentTrip.id}`} style={{ textDecoration: "none" }}>
          <Flex
            variant="column"
            width="full"
            mb="lg"
            py="md"
            px="lg"
            gap="sm"
            style={{ 
              background: "var(--fg)", 
              color: "var(--bg)", 
              borderRadius: "var(--r)",
              textAlign: "left",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Flex variant="row-between">
              <Text variant="mono-small">
                Currently in
              </Text>
              <Text variant="mono" style={{ padding: "3px 8px", borderRadius: "99px", border: "1px solid color-mix(in oklch, var(--bg) 25%, transparent)", opacity: 0.7 }}>
                LIVE
              </Text>
            </Flex>
            <Flex variant="row-center" gap="md">
              <Text style={{ fontSize: 44, lineHeight: 1 }}>{currentTrip.countryCode}</Text>
              <Box>
                <Heading variant="h3" color="inverse">{currentTrip.name}</Heading>
                <Text variant="caption" mt="xs" as="div">
                  In progress
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Link>
      )}

      <TripsList
        title={t("dashboard.upcoming")}
        fetcher={getTripsFrom}
        initialCursor={todayStr}
        skeletonCount={1}
      >
        <Flex variant="column-center" py="section" gap="md" textAlign="center">
          <Icon name="flight_takeoff" size="2xl" color="faint" />
          <Text variant="body" color="muted" mb="md" as="p" style={{ fontWeight: 500 }}>
            {t("dashboard.noTrips")}
          </Text>
          <Link href="/trips/create" style={{ textDecoration: "none" }}>
            <Btn variant="primary">{t("dashboard.addFirst")}</Btn>
          </Link>
        </Flex>
      </TripsList>

      <TripsList
        title={t("dashboard.past")}
        fetcher={getTripsBefore}
        initialCursor={todayStr}
        skeletonCount={3}
      />
      <FAB />
    </Box>
  );
}
