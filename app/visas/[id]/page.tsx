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
              <div key={i}>
                <AlertStrip.Title>{item.title}</AlertStrip.Title>
                <AlertStrip.Body>{item.content}</AlertStrip.Body>
              </div>
            ))}
          </AlertStrip>
        )}

        {/* §01 Simulation */}
        <div>
          <SectionHeading number="01" title={t("simulation")} />
          <p style={{ fontSize: "var(--text-sm)", color: "var(--fg-muted)", lineHeight: 1.6, marginBottom: 12 }}>
            {t("simulationDesc")}
          </p>
          {isSimulating && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--warn)",
                marginBottom: 12,
              }}
            >
              ⚠ {t("simulating")}:{" "}
              {date.toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <form action={`/visas/${id}`} method="GET" style={{ display: "flex", gap: 8 }}>
            <input type="hidden" name="show_outside_rolling_range" value={show_outside_rolling_range?.toString()} />
            <input
              name="date"
              type="date"
              defaultValue={convertDateToString(date)}
              style={{
                flex: 1,
                padding: "8px 12px",
                fontSize: "var(--text-base)",
                fontFamily: "var(--font-body)",
                backgroundColor: "var(--bg-raised)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-s)",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                height: 36,
                padding: "0 14px",
                fontSize: "var(--text-base)",
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
            </button>
            {isSimulating && (
              <Link
                href={`/visas/${id}`}
                style={{
                  height: 36,
                  padding: "0 14px",
                  fontSize: "var(--text-base)",
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
              </Link>
            )}
          </form>
        </div>

        {/* §02 Aggregates */}
        {visaTripInfo.aggregateValidation && visaTripInfo.aggregateValidation.length > 0 && (
          <div>
            <SectionHeading number="02" title={t("aggregates")} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                    <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div>
                        <p style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--fg)", margin: 0 }}>
                          {agg.name}
                        </p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-muted)", margin: 0 }}>
                          {agg.description}
                        </p>
                      </div>
                      <StatusBadge
                        tone={aggTone}
                        label={agg.valid ? tStatus("valid") : tStatus("expired")}
                        size="xs"
                      />
                    </div>
                    {max > 0 && (
                      <div style={{ gridColumn: "1 / -1" }}>
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
                      </div>
                    )}
                  </FactsCard>
                );
              })}
            </div>
          </div>
        )}

        {/* §03 Trips */}
        {visaTripInfo.trips && visaTripInfo.trips.length > 0 ? (
          <div>
            <SectionHeading number="03" title={t("trips")} count={visaTripInfo.trips.length} />
            <div
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
                    <Link
                      key={trip.trip.id}
                      href={`/trips/${trip.trip.id}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto",
                        gap: 12,
                        alignItems: "center",
                        padding: "12px 14px",
                        textDecoration: "none",
                        borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{flag}</span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: "var(--text-base)", color: "var(--fg)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {displayName}
                        </p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-muted)", margin: 0, marginTop: 2 }}>
                          {trip.trip.startDate.toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                          {" – "}
                          {trip.trip.endDate.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                          {" · "}
                          {trip.trip.tripLen}D
                          {inWindow && (
                            <span style={{ color: "var(--accent)", marginLeft: 6 }}>
                              · {t("inWindow")}
                            </span>
                          )}
                        </p>
                      </div>
                      <StatusPip tone={tripTone} size={8} />
                    </Link>
                  );
                })}
            </div>
            {tripIdInRollingPeriod.length > 0 && (
              <form action={`/visas/${id}`} style={{ display: "flex", marginTop: 4 }}>
                <input type="hidden" name="date" value={convertDateToString(date)} />
                <input
                  type="hidden"
                  name="show_outside_rolling_range"
                  value={show_outside_rolling_range ? "" : "true"}
                />
                <button
                  type="submit"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--fg-faint)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 0",
                  }}
                >
                  {show_outside_rolling_range ? "hide trips outside window" : "show all trips"}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            <SectionHeading number="03" title={t("trips")} />
            <EmptyState icon="flight" message={t("noTrips")} />
          </div>
        )}

        {/* §04 Coverage */}
        <div>
          <SectionHeading number="04" title={t("coverage")} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {visa.countries.map((code) => {
              const { flag, name } = splitCountryLabel(COUNTRY_LABELS[code] || code);
              return <TagPill key={code} flag={flag} label={name || code} />;
            })}
          </div>
        </div>

        {/* §05 Documents */}
        {(visa.visaNumber || visa.documentNumber) && (
          <div>
            <SectionHeading number="05" title="Documents" />
            <FactsCard cols={2}>
              {visa.visaNumber && (
                <FactsCard.Fact
                  label="Visa number"
                  value={
                    <PrivateText>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
                        {visa.visaNumber}
                      </span>
                    </PrivateText>
                  }
                />
              )}
              {visa.documentNumber && (
                <FactsCard.Fact
                  label="Document number"
                  value={
                    <PrivateText>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}>
                        {visa.documentNumber}
                      </span>
                    </PrivateText>
                  }
                />
              )}
            </FactsCard>
          </div>
        )}
      </ContentWell>
    </PageShell>
  );
}
