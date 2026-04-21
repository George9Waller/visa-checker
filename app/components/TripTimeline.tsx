import Link from "next/link";
import {
  getTripsBefore,
  getTripsFrom,
  getWarnings,
  getCurrentTrip,
  getNextTrip,
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
import { ProfileAvatar } from "./ProfileAvatar";
import { splitCountryLabel } from "./utils/countries";
import { COUNTRY_LABELS } from "@/app/constants";
import { Grid } from "./ui/layout/Grid";
import { NextTripCard } from "./cards/NextTrip";

export default function TripTimeline() {
  const t = useTranslations();
  const warnings = use(getWarnings());
  const currentTrips = use(getCurrentTrip());
  const nextTrip = use(getNextTrip());
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Box width="full" px="lg" pt="lg" pb="xl">
      {/* Dashboard header */}
      <Flex
        variant="row-between"
        mb="lg"
        gap="sm"
        style={{ alignItems: "center", paddingTop: "8px" }}
      >
        <Box minW={0}>
          <Text
            variant="mono"
            mb="xs"
            color="muted"
            as="div"
            style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
            })} · {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).toUpperCase()}
          </Text>
          <Heading variant="h1" style={{ fontSize: 38, lineHeight: 1.02 }}>
            Trips
          </Heading>
        </Box>

        <Flex variant="row-center" gap="sm">
          <Link href="/visas" style={{ textDecoration: "none" }}>
            <Flex
              variant="row-center"
              style={{
                gap: 6,
                height: 34,
                paddingLeft: 14,
                paddingRight: 14,
                background: "var(--bg-raised)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
                borderRadius: 99,
                transition: "background-color 0.2s"
              }}
            >
              <Icon name="passport" style={{ fontSize: 15 }} />
              <Text as="span" style={{ fontSize: 14, fontWeight: 600 }}>
                Visas
              </Text>
            </Flex>
          </Link>

          <ProfileAvatar />
        </Flex>
      </Flex>

      {currentTrips.map(currentTrip => (
        <Link href={`/trips/${currentTrip.id}`} key={currentTrip.id}>
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
              borderRadius: "var(--radius-lg)",
              textAlign: "left",
              position: "relative",
              overflow: "hidden",
              padding: "18px 20px"
            }}
          >
            <Flex variant="row-between">
              <Text variant="mono" style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.5 }}>
                Currently in
              </Text>
              <Text variant="mono" style={{ fontSize: 11, padding: "3px 8px", borderRadius: "99px", border: "1px solid color-mix(in oklch, var(--bg) 25%, transparent)", opacity: 0.7 }}>
                LIVE
              </Text>
            </Flex>
            <Flex variant="row-center" gap="md" style={{ gap: "14px" }}>
              <Text style={{ fontSize: 44, lineHeight: 1 }}>
                {splitCountryLabel(COUNTRY_LABELS[currentTrip.countryCode]).flag}
              </Text>
              <Box>
                <Heading variant="h1" style={{ color: "var(--bg)", fontSize: 28, fontWeight: "var(--w-display)", letterSpacing: "var(--track-display)", lineHeight: 1.05 }}>
                  {currentTrip.name}
                </Heading>
                <Text variant="caption" mt="xs" as="div" style={{ color: "var(--bg)", opacity: 0.6 }}>
                  {Math.floor((new Date().getTime() - new Date(currentTrip.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days in · {Math.floor((new Date(currentTrip.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days to go
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Link>
      ))}

      {/* Cards */}
      <Grid columns={2} mb="lg" gap="md">
        {nextTrip && <NextTripCard trip={nextTrip} />}
      </Grid>

      {warnings && warnings.length > 0 && (
        <Flex variant="column" gap="md" mb="xl" width="full">
          {warnings.map((warning, index) => (
            <Warning key={index} {...warning} />
          ))}
        </Flex>
      )}

      <TripsList
        title={t("dashboard.upcoming")}
        fetcher={getTripsFrom}
        initialCursor={todayStr}
        skeletonCount={1}
        isPast={false}
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
        isPast={true}
      />
      <FAB />
    </Box>
  );
}
