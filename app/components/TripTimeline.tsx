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

export default function TripTimeline() {
  const t = useTranslations();
  const warnings = use(getWarnings());
  const currentTrips = use(getCurrentTrip());
  const currentTrip = currentTrips.length > 0 ? currentTrips[0] : null;
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Box w="100%" p="20px 20px 40px">
      {/* Dashboard header */}
      <Flex align="flex-end" justify="space-between" mb={24} gap={12}>
        <Box minW={0}>
          <Text
            variant="mono"
            size={11}
            color="var(--fg-muted)"
            letterSpacing="0.1em"
            transform="uppercase"
            mb={4}
            as="div"
          >
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Heading size={38} lineHeight={1.02} m={0}>
            {t("dashboard.title")}
          </Heading>
        </Box>
      </Flex>

      {warnings && warnings.length > 0 && (
        <Flex direction="column" gap={16} mb={32} w="100%">
          {warnings.map((warning, index) => (
            <Warning key={index} {...warning} />
          ))}
        </Flex>
      )}

      {currentTrip && (
        <Flex
          as={Link}
          href={`/trips/${currentTrip.id}`}
          direction="column"
          w="100%"
          textAlign="left"
          mb={24}
          p="18px 20px"
          bg="var(--fg)"
          color="var(--bg)"
          border="none"
          borderRadius="var(--r)"
          gap={14}
          className="no-underline"
          position="relative"
          overflow="hidden"
        >
          <Flex justify="space-between" align="center">
            <Text variant="mono" size={10} letterSpacing="0.15em" transform="uppercase" opacity={0.5}>
              Currently in
            </Text>
            <Text variant="mono" size={11} p="3px 8px" borderRadius={99} border="1px solid color-mix(in oklch, var(--bg) 25%, transparent)" opacity={0.7}>
              LIVE
            </Text>
          </Flex>
          <Flex align="center" gap={14}>
            <Text size={44} lineHeight={1}>{currentTrip.countryCode}</Text>
            <Box>
              <Heading size={28} lineHeight={1.05} color="var(--bg)">{currentTrip.name}</Heading>
              <Text size={13} opacity={0.6} mt={2} as="div">
                In progress
              </Text>
            </Box>
          </Flex>
        </Flex>
      )}

      <TripsList
        title={t("dashboard.upcoming")}
        fetcher={getTripsFrom}
        initialCursor={todayStr}
        skeletonCount={1}
      >
        <Flex direction="column" align="center" justify="center" py={80} gap={16} textAlign="center">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 48, color: "var(--fg-faint)" }}
          >
            flight_takeoff
          </span>
          <Text size={14} color="var(--fg-muted)" weight={500} as="p">
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
