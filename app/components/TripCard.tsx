import { TimelineTrip } from "@/app/server-actions";
import { COLOURS, COUNTRY_LABELS } from "@/app/constants";
import { splitCountryLabel } from "./utils/countries";
import { Box } from "./ui/layout/Box";
import { Flex } from "./ui/layout/Flex";
import { Text } from "./ui/typography/Text";
import { Icon } from "./ui/typography/Icon";
import { Heading } from "./ui/typography/Heading";

type VisaStatus = "covered" | "no-visa" | "invalid" | "not-required";

function getVisaStatus(trip: TimelineTrip): VisaStatus {
  if (!trip.visaRequired) return "not-required";
  if (!trip.visa) return "no-visa";
  if (!trip.visaValid) return "invalid";
  return "covered";
}

function formatDates(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const sDay = s.getDate();
  const eDay = e.getDate();
  const sMon = s.toLocaleDateString(undefined, { month: "short" });
  const eMon = e.toLocaleDateString(undefined, { month: "short" });
  const sYear = s.getFullYear();
  const eYear = e.getFullYear();

  if (sYear !== eYear)
    return `${sDay} ${sMon} ${sYear} – ${eDay} ${eMon} ${eYear}`;
  if (sMon !== eMon) return `${sDay} ${sMon} – ${eDay} ${eMon}`;
  return `${sDay} – ${eDay} ${eMon}`;
}

function getStripColor(trip: TimelineTrip, status: VisaStatus): string {
  if (status === "no-visa") return "var(--warn)";
  if (status === "invalid") return "var(--danger)";
  return COLOURS[trip.colour];
}

const STATUS_CONFIG: Record<
  VisaStatus,
  { label: string; subLabel: string; dotColor: string; textColor: string }
> = {
  covered: {
    label: "Validated",
    subLabel: "Visa required",
    dotColor: "var(--ok)",
    textColor: "var(--ok)",
  },
  "no-visa": {
    label: "No visa assigned",
    subLabel: "Visa required",
    dotColor: "var(--warn)",
    textColor: "var(--warn)",
  },
  invalid: {
    label: "Visa invalid",
    subLabel: "Visa required",
    dotColor: "var(--danger)",
    textColor: "var(--danger)",
  },
  "not-required": {
    label: "No visa needed",
    subLabel: "Visa not required",
    dotColor: "var(--fg-faint)",
    textColor: "var(--fg-muted)",
  },
};

export function TripCard({
  trip,
  isPast,
  onClick,
}: {
  trip: TimelineTrip;
  isPast: boolean;
  onClick: () => void;
}) {
  const status = getVisaStatus(trip);
  const cfg = STATUS_CONFIG[status];
  const stripColor = getStripColor(trip, status);
  const { flag, name: countryName } = splitCountryLabel(
    COUNTRY_LABELS[trip.countryCode]
  );

  return (
    <Box
      as="button"
      onClick={onClick}
      variant="card"
      p="none"
      width="full"
      style={{
        display: "flex",
        textAlign: "left",
        opacity: isPast ? 0.5 : 1,
        transition: "all 0.15s",
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}
    >
      {/* Coloured left strip */}
      <Box style={{ width: 4, flexShrink: 0, backgroundColor: stripColor }} />

      <Flex variant="column" style={{ flex: 1, minWidth: 0 }}>
        {/* Top section */}
        <Flex variant="row-between" p="lg" pb="md" gap="md" style={{ alignItems: "flex-start" }}>
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Flex variant="row-center" gap="sm" mb="xs">
              <Text style={{ fontSize: 20, lineHeight: 1 }}>{flag}</Text>
              <Text style={{ fontSize: 19, fontWeight: 900, letterSpacing: "-0.02em" }} truncate>
                {countryName}
              </Text>
            </Flex>

            {trip.name && (
              <Text variant="caption" color="muted" mb="sm" style={{ fontStyle: "italic" }} truncate>
                {trip.name}
              </Text>
            )}

            <Text style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em" }}>
              {formatDates(trip.startDate, trip.endDate)}
            </Text>
          </Box>

          {/* Duration circle */}
          <Flex
            variant="column-center"
            style={{
              width: 52,
              height: 52,
              flexShrink: 0,
              borderRadius: 99,
              backgroundColor: "var(--bg-sunken)",
              border: "1px solid var(--border)",
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.02em" }}>
              {trip.durationDays}
            </Text>
            <Text variant="mono-small" color="muted" style={{ fontWeight: "bold" }}>
              days
            </Text>
          </Flex>
        </Flex>

        {/* Tear line */}
        <Box
          position="relative"
          style={{
            height: 1,
            backgroundImage: "repeating-linear-gradient(to right, var(--border) 0, var(--border) 6px, transparent 6px, transparent 14px)",
          }}
        >
          <Box position="absolute" style={{ left: -10, top: -9, width: 20, height: 20, borderRadius: 99, backgroundColor: "var(--bg)", border: "1px solid var(--border)", zIndex: 10 }} />
          <Box position="absolute" style={{ right: -10, top: -9, width: 20, height: 20, borderRadius: 99, backgroundColor: "var(--bg)", border: "1px solid var(--border)", zIndex: 10 }} />
        </Box>

        {/* Footer */}
        <Flex variant="row-between" px="lg" py="sm" style={{ alignItems: "center" }}>
          <Flex variant="row-center" gap="xs">
            {trip.visaRequired && (
              <>
                <Icon name="passport" size="sm" />
                <Text style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-muted)" }}>
                  {trip.visa?.name ?? cfg.subLabel}
                </Text>
              </>
            )}
          </Flex>
          <Flex variant="row-center" gap="sm">
            <Box style={{ width: 7, height: 7, borderRadius: 99, backgroundColor: cfg.dotColor }} />
            <Text style={{ fontSize: 12, fontWeight: "bold", color: cfg.textColor }}>
              {cfg.label}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
