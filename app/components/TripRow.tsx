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
    <Grid 
      templateColumns="44px 1fr auto" 
      gap="md" 
      alignItems="center"
      py="md"
      px="xs"
      style={{ borderBottom: bottomBorder ? '1px solid var(--border)' : 'none' }}
    >
      <Flex variant="column-center" gap="xs">
        <Box style={{ width: 24, height: 26, background: "var(--bg-sunken)", borderRadius: 2 }} />
        <Box style={{ width: 20, height: 8, background: "var(--bg-sunken)", borderRadius: 2 }} />
      </Flex>
      <Flex variant="column" gap="xs">
        <Box style={{ width: "60%", height: 14, background: "var(--bg-sunken)", borderRadius: 2 }} />
        <Box style={{ width: "80%", height: 10, background: "var(--bg-sunken)", borderRadius: 2 }} />
      </Flex>
      <Flex variant="column" gap="xs" style={{ alignItems: "flex-end" }}>
        <Box style={{ width: 20, height: 20, background: "var(--bg-sunken)", borderRadius: 2 }} />
        <Box style={{ width: 32, height: 8, background: "var(--bg-sunken)", borderRadius: 2 }} />
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
      width="full"
      textAlign="left"
      p="none"
      style={{ 
        background: "transparent", 
        cursor: "pointer", 
        opacity: isPast ? 0.55 : 1,
        borderBottom: isLast ? 'none' : '1px solid var(--border)'
      }}
    >
      <Grid templateColumns="44px 1fr auto" gap="md" alignItems="center" py="md" px="xs">
        {/* Col 1 */}
        <Flex variant="column-center">
          <Heading variant="h4" style={{ fontSize: 22, lineHeight: 1 }}>{day}</Heading>
          <Text variant="mono" mt="xs" color="muted" as="div" style={{ fontSize: 10 }}>
            {month}
          </Text>
        </Flex>

        {/* Col 2 */}
        <Flex variant="column" gap="xs" minW={0}>
          <Flex variant="row-center" gap="sm" minW={0}>
            <Text as="span" style={{ fontSize: 14, flexShrink: 0 }}>{flag}</Text>
            <Text as="span" style={{ fontSize: 15, fontWeight: 600, minWidth: 0 }} truncate>
              {trip.name || countryName}
            </Text>
          </Flex>
          <Text variant="mono" color="muted" as="div" style={{ fontSize: 11, letterSpacing: "0.04em" }} truncate>
            {fmtDateRange(trip.startDate, trip.endDate)}
            {trip.visa && (
              <>
                <Text as="span" color="faint" style={{ margin: "0 6px" }}>·</Text>
                <Text as="span" variant="mono-small" style={{ letterSpacing: "normal" }}>{trip.visa.name}</Text>
              </>
            )}
          </Text>
        </Flex>

        {/* Col 3 */}
        <Flex variant="column" gap="xs" style={{ alignItems: "flex-end", flexShrink: 0 }}>
          <Flex variant="column-center">
            <Heading variant="h4" style={{ fontSize: 20, lineHeight: 1 }}>{trip.durationDays}</Heading>
            <Text variant="mono" mt="xs" color="muted" as="div" style={{ fontSize: 10 }}>
              {trip.durationDays === 1 ? "DAY" : t("trip.days").toUpperCase()}
            </Text>
          </Flex>
          {status !== "not-required" && (
            <Flex variant="row-center" gap="xs">
              <StatusPip tone={tone} size={6} />
              <Text as="span" variant="mono" style={{ fontSize: 10, letterSpacing: "0.08em", color: toneColor }}>
                {STATUS_LABEL[status]}
              </Text>
            </Flex>
          )}
        </Flex>
      </Grid>
    </Box>
  );
}
