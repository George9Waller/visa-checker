import { TimelineTrip } from "@/app/server-actions";
import { StatusPip } from "./ui/StatusPip";
import { useTranslations } from "next-intl";
import { COUNTRY_LABELS } from "@/app/constants";
import { getVisaStatus, statusTone, VisaStatus } from "./utils/visaStatus";
import { fmtDateRange } from "./utils/dates";
import { splitCountryLabel } from "./utils/countries";
import { Box } from "./ui/layout/Box";
import { Flex } from "./ui/layout/Flex";
import { Grid } from "./ui/layout/Grid";
import { Text } from "./ui/typography/Text";
import { Heading } from "./ui/typography/Heading";

export function SkeletonRow({ bottomBorder }: { bottomBorder: boolean }) {
  return (
    <Grid templateColumns="44px 1fr auto" gap={14} alignItems="center" p="16px 2px" borderBottom={bottomBorder ? "1px solid var(--border)" : "none"}>
      <Flex direction="column" align="center" gap={4}>
        <Box w={24} h={26} bg="var(--bg-sunken)" borderRadius={2} />
        <Box w={20} h={8} bg="var(--bg-sunken)" borderRadius={2} />
      </Flex>
      <Flex direction="column" gap={6}>
        <Box w="60%" h={14} bg="var(--bg-sunken)" borderRadius={2} />
        <Box w="80%" h={10} bg="var(--bg-sunken)" borderRadius={2} />
      </Flex>
      <Flex direction="column" align="flex-end" gap={4}>
        <Box w={20} h={20} bg="var(--bg-sunken)" borderRadius={2} />
        <Box w={32} h={8} bg="var(--bg-sunken)" borderRadius={2} />
      </Flex>
    </Grid>
  );
}

export function TimelineRow({
  trip,
  isPast,
  isLast,
  onClick,
  t,
}: {
  trip: TimelineTrip;
  isPast: boolean;
  isLast: boolean;
  onClick: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const status = getVisaStatus(trip);
  const tone = statusTone(status);
  const { flag, name: countryName } = splitCountryLabel(
    COUNTRY_LABELS[trip.countryCode]
  );
  const startDate = new Date(trip.startDate + "T00:00:00");
  const day = String(startDate.getDate()).padStart(2, "0");
  const month = startDate
    .toLocaleDateString("en-GB", { month: "short" })
    .toUpperCase();

  const STATUS_LABEL: Record<VisaStatus, string> = {
    covered: t("status.valid"),
    "no-visa": t("status.noVisa"),
    invalid: t("status.unlinked"),
    "not-required": "—",
  };

  const toneColor =
    tone === "danger"
      ? "var(--danger)"
      : tone === "warn"
        ? "var(--warn)"
        : "var(--fg-muted)";

  return (
    <Box
      as="button"
      onClick={onClick}
      className="w-full text-left"
      opacity={isPast ? 0.55 : 1}
      bg="transparent"
      border="none"
      borderBottom={isLast ? "none" : "1px solid var(--border)"}
      cursor="pointer"
      p={0}
    >
      <Grid templateColumns="44px 1fr auto" gap={14} alignItems="center" p="12px 2px">
        {/* Col 1 */}
        <Flex direction="column" align="center">
          <Heading size={22} lineHeight={1} color="var(--fg)">{day}</Heading>
          <Text variant="mono" size={10} color="var(--fg-muted)" letterSpacing="0.1em" mt={3} as="div">
            {month}
          </Text>
        </Flex>

        {/* Col 2 */}
        <Flex direction="column" gap={4} minW={0}>
          <Flex align="center" gap={8} minW={0}>
            <Text as="span" size={14} shrink={0}>{flag}</Text>
            <Text as="span" size={15} weight={600} color="var(--fg)" truncate minW={0}>
              {trip.name || countryName}
            </Text>
          </Flex>
          <Text variant="mono" size={11} color="var(--fg-muted)" letterSpacing="0.04em" truncate as="div">
            {fmtDateRange(trip.startDate, trip.endDate)}
            {trip.visa && (
              <>
                <Text as="span" color="var(--fg-faint)" mx={6}>·</Text>
                <Text as="span" variant="body" letterSpacing={0}>{trip.visa.name}</Text>
              </>
            )}
          </Text>
        </Flex>

        {/* Col 3 */}
        <Flex direction="column" align="flex-end" gap={6} shrink={0}>
          <Flex direction="column" align="center">
            <Heading size={20} lineHeight={1} color="var(--fg)">{trip.durationDays}</Heading>
            <Text variant="mono" size={10} color="var(--fg-muted)" letterSpacing="0.1em" mt={3} as="div">
              {trip.durationDays === 1 ? "DAY" : t("trip.days").toUpperCase()}
            </Text>
          </Flex>
          {status !== "not-required" && (
            <Flex align="center" gap={5}>
              <StatusPip tone={tone} size={6} />
              <Text as="span" variant="mono" size={10} color={toneColor} letterSpacing="0.08em" transform="uppercase">
                {STATUS_LABEL[status]}
              </Text>
            </Flex>
          )}
        </Flex>
      </Grid>
    </Box>
  );
}
