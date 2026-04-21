export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { getVisa, visaInfoForDate } from "../server-actions";
import { VISA_TYPES_DISPLAY_MAP } from "../constants";
import { COUNTRY_LABELS } from "@/app/constants";
import { convertDateToString } from "@/app/utils";
import { getDateWithOffset } from "@/app/server-actions";
import DeleteVisaButton from "@/app/components/DeleteVisaButton";
import PrivateText from "@/app/components/PrivateText";
import { StatusBadge } from "@/app/components/ui/StatusBadge";
import { StatusPip } from "@/app/components/ui/StatusPip";
import { UsageBar } from "@/app/components/ui/UsageBar";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { getTranslations } from "next-intl/server";
import { PageShell } from "@/app/components/ui/PageShell";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { ContentWell } from "@/app/components/ui/ContentWell";
import { FactsCard } from "@/app/components/ui/FactsCard";
import { AlertStrip } from "@/app/components/ui/AlertStrip";
import { TagPill } from "@/app/components/ui/TagPill";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { splitCountryLabel } from "@/app/components/utils/countries";
import { Flex } from "@/app/components/ui/layout/Flex";
import { Box } from "@/app/components/ui/layout/Box";
import { Text } from "@/app/components/ui/typography/Text";
import { Grid } from "@/app/components/ui/layout/Grid";

export default async function VisaDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    show_outside_rolling_range?: string | string[];
    date?: string | string[];
  }>;
}) {
  const t = await getTranslations("visa");
  const tStatus = await getTranslations("status");

  const { id } = await params;
  const { date: dateParam, show_outside_rolling_range } = await searchParams;
  const date = dateParam ? new Date(dateParam.toString()) : new Date();
  const visa = await getVisa(id);
  const dateWithOffset = await getDateWithOffset(date);
  const visaTripInfo = await visaInfoForDate(id, dateWithOffset);
  console.log(visaTripInfo)

  if (!visa) redirect("/visas");

  const isSimulating =
    date.toLocaleDateString() !== new Date().toLocaleDateString();

  const tripIdInRollingPeriod: string[] =
    visaTripInfo.aggregateValidation
      ?.find((a) => a.name === "Rolling Period")
      ?.data.map((d) => d.tripId) || [];

  const overallValid = visaTripInfo.summary?.valid ?? true;
  const tone = overallValid ? ("ok" as const) : ("danger" as const);

  return (
    <PageShell>
      <PageHeader
        variant="detail"
        backHref="/visas"
        kicker={VISA_TYPES_DISPLAY_MAP[visa.type]}
        title={visa.name}
        actions={<DeleteVisaButton visaId={id} />}
      />

      <ContentWell>
        {/* Overview facts */}
        <FactsCard cols={3}>
          <FactsCard.Fact
            label={t("validFrom")}
            value={visa.validFrom.toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
          <FactsCard.Fact
            label={t("expires")}
            value={
              visa.expires
                ? visa.expires.toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"
            }
          />
          <FactsCard.Fact
            label={t("status")}
            value={
              <StatusBadge
                tone={tone}
                label={overallValid ? tStatus("validated") : tStatus("visaInvalid")}
                size="xs"
              />
            }
          />
        </FactsCard>

        {/* Alert if invalid */}
        {visaTripInfo.summary && !visaTripInfo.summary.valid && (
          <AlertStrip tone="danger">
            {visaTripInfo.summary.items.map((item, i) => (
              <Box key={i}>
                <AlertStrip.Title>{item.title}</AlertStrip.Title>
                <AlertStrip.Body>{item.content}</AlertStrip.Body>
              </Box>
            ))}
          </AlertStrip>
        )}

        {/* §01 Simulation */}
        <Box>
          <SectionHeading number="01" title={t("simulation")} />
          <Text variant="caption" color="muted" as="p" mb="md" style={{ lineHeight: 1.6 }}>
            {t("simulationDesc")}
          </Text>
          {isSimulating && (
            <Text
              variant="mono"
              color="warn"
              style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
              mb="md"
              as="p"
            >
              ⚠ {t("simulating")}:{" "}
              {date.toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          )}
          <Flex as="form" action={`/visas/${id}`} method="GET" gap="sm">
            <input type="hidden" name="show_outside_rolling_range" value={show_outside_rolling_range?.toString()} />
            <Box
              as="input"
              name="date"
              type="date"
              defaultValue={convertDateToString(date)}
              width="full"
              style={{
                flex: 1,
                padding: "8px 12px",
                fontSize: 15,
                fontFamily: "var(--font-body)",
                backgroundColor: "var(--bg-raised)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-s)",
                outline: "none",
              }}
            />
            <Box
              as="button"
              type="submit"
              style={{
                height: 36,
                padding: "0 14px",
                fontSize: 14,
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                backgroundColor: "var(--fg)",
                color: "var(--bg)",
                border: "none",
                borderRadius: "var(--r-s)",
                cursor: "pointer",
              }}
            >
              Go
            </Box>
            {isSimulating && (
              <Box
                as={Link}
                href={`/visas/${id}`}
                style={{
                  height: 36,
                  padding: "0 14px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--fg-muted)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-s)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {t("reset")}
              </Box>
            )}
          </Flex>
        </Box>

        {/* §02 Aggregates */}
        {visaTripInfo.aggregateValidation && visaTripInfo.aggregateValidation.length > 0 && (
          <Box>
            <SectionHeading number="02" title={t("aggregates")} />
            <Flex variant="column" gap="md">
              {visaTripInfo.aggregateValidation.map((agg) => {
                const used = agg.data?.reduce((s, d) => s + Number(d.count), 0) ?? 0;
                const max = used + (agg.remaining ?? 0);
                const aggTone =
                  agg.valid
                    ? used / max < 0.8
                      ? ("ok" as const)
                      : ("warn" as const)
                    : ("danger" as const);

                return (
                  <FactsCard key={agg.name} cols={2}>
                    <Flex variant="row-between" style={{ gridColumn: "1 / -1", alignItems: "flex-start" }}>
                      <Box>
                        <Text style={{ fontWeight: 600, display: "block" }}>
                          {agg.name}
                        </Text>
                        <Text variant="mono" color="muted" style={{ fontSize: 11 }}>
                          {agg.description}
                        </Text>
                      </Box>
                      <StatusBadge
                        tone={aggTone}
                        label={agg.valid ? tStatus("valid") : tStatus("expired")}
                        size="xs"
                      />
                    </Flex>
                    {max > 0 && (
                      <Box style={{ gridColumn: "1 / -1" }}>
                        <UsageBar
                          value={used}
                          max={max}
                          tone={aggTone}
                          label={`${used} / ${max}`}
                          sublabel={
                            agg.remaining !== undefined && agg.remaining !== null
                              ? `${agg.remaining} remaining`
                              : undefined
                          }
                        />
                      </Box>
                    )}
                  </FactsCard>
                );
              })}
            </Flex>
          </Box>
        )}

        {/* §03 Trips */}
        {visaTripInfo.trips && visaTripInfo.trips.length > 0 ? (
          <Box>
            <SectionHeading number="03" title={t("trips")} count={visaTripInfo.trips.length} />
            <Box
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--r)",
                backgroundColor: "var(--bg-raised)",
                overflow: "hidden",
              }}
            >
              {visaTripInfo.trips
                .filter((trip) =>
                  show_outside_rolling_range
                    ? true
                    : tripIdInRollingPeriod.length === 0 ||
                      tripIdInRollingPeriod.includes(trip.trip.id)
                )
                .map((trip, i, arr) => {
                  const tripTone = trip.valid ? ("ok" as const) : ("danger" as const);
                  const inWindow = tripIdInRollingPeriod.includes(trip.trip.id);
                  const { flag, name: tripName } = splitCountryLabel(COUNTRY_LABELS[trip.trip.country] || "");
                  const displayName = trip.trip.name || tripName || COUNTRY_LABELS[trip.trip.country] || "";
                  return (
                    <Grid
                      as={Link}
                      key={trip.trip.id}
                      href={`/trips/${trip.trip.id}`}
                      templateColumns="auto 1fr auto"
                      gap="md"
                      alignItems="center"
                      p="md"
                      style={{
                        textDecoration: "none",
                        borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{flag}</Text>
                      <Box style={{ minWidth: 0 }}>
                        <Text style={{ fontWeight: 600, display: "block" }} truncate>
                          {displayName}
                        </Text>
                        <Flex variant="row-center" gap="xs" mt="xs">
                          <Text variant="mono" color="muted" style={{ fontSize: 11 }}>
                            {trip.trip.startDate.toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                            {" – "}
                            {trip.trip.endDate.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                            {" · "}
                            {trip.trip.tripLen}D
                          </Text>
                          {inWindow && (
                            <Text variant="mono" color="accent" style={{ fontSize: 11, fontWeight: 700 }}>
                              · {t("inWindow")}
                            </Text>
                          )}
                        </Flex>
                      </Box>
                      <StatusPip tone={tripTone} size={8} />
                    </Grid>
                  );
                })}
            </Box>
            {tripIdInRollingPeriod.length > 0 && (
              <Flex as="form" action={`/visas/${id}`} mt="xs">
                <input type="hidden" name="date" value={convertDateToString(date)} />
                <input
                  type="hidden"
                  name="show_outside_rolling_range"
                  value={show_outside_rolling_range ? "" : "true"}
                />
                <Box
                  as="button"
                  type="submit"
                  p="xs"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--fg-faint)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {show_outside_rolling_range ? "hide trips outside window" : "show all trips"}
                </Box>
              </Flex>
            )}
          </Box>
        ) : (
          <Box>
            <SectionHeading number="03" title={t("trips")} />
            <EmptyState icon="flight" message={t("noTrips")} />
          </Box>
        )}

        {/* §04 Coverage */}
        <Box>
          <SectionHeading number="04" title={t("coverage")} />
          <Flex wrap="wrap" gap="xs">
            {visa.countries.map((code) => {
              const { flag, name } = splitCountryLabel(COUNTRY_LABELS[code] || code);
              return <TagPill key={code} flag={flag} label={name || code} />;
            })}
          </Flex>
        </Box>

        {/* §05 Documents */}
        {(visa.visaNumber || visa.documentNumber) && (
          <Box>
            <SectionHeading number="05" title="Documents" />
            <FactsCard cols={2}>
              {visa.visaNumber && (
                <FactsCard.Fact
                  label="Visa number"
                  value={
                    <PrivateText>
                      <Text variant="mono" style={{ fontSize: 13 }}>
                        {visa.visaNumber}
                      </Text>
                    </PrivateText>
                  }
                />
              )}
              {visa.documentNumber && (
                <FactsCard.Fact
                  label="Document number"
                  value={
                    <PrivateText>
                      <Text variant="mono" style={{ fontSize: 13 }}>
                        {visa.documentNumber}
                      </Text>
                    </PrivateText>
                  }
                />
              )}
            </FactsCard>
          </Box>
        )}
      </ContentWell>
    </PageShell>
  );
}
