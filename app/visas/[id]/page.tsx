export const dynamic = "force-dynamic";

import {
  AlertBox,
  Btn,
  Fact,
  FactGrid,
  PageContainer,
  SchengenProjectionChart,
  Stack,
  StatusBadge,
  TagPill,
  Text,
  TripCard,
  UsageBar,
} from "@/app/design";
import { COUNTRY_EMOJIS, COUNTRY_NAMES } from "@/app/constants";
import { copyForAlert, detailForTripIssue, titleForTripIssue, toneFromSeverity } from "@/app/structured-copy";
import { getVisaDetailSummary } from "../server-actions";
import { VISA_TYPES_DISPLAY_MAP } from "../constants";
import Link from "next/link";
import { redirect } from "next/navigation";
import VisaSimulationControl from "./VisaSimulationControl";

const formatDate = (date: Date | null) =>
  date
    ? date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Open-ended";

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
  const { id } = await params;
  const { date: dateParam, show_outside_rolling_range } = await searchParams;
  const referenceDate = dateParam ? new Date(dateParam.toString()) : new Date();
  const summary = await getVisaDetailSummary(id, referenceDate);

  if (!summary) {
    redirect("/visas");
  }

  const showAllTrips = show_outside_rolling_range?.toString() === "true";
  const visibleTrips = summary.tripEvaluations.filter(
    (tripEvaluation) =>
      showAllTrips ||
      summary.rollingWindowTripIds.length === 0 ||
      summary.rollingWindowTripIds.includes(tripEvaluation.trip.id)
  );
  const projectedTripIssues = summary.tripEvaluations.filter(
    (tripEvaluation) =>
      tripEvaluation.projected && tripEvaluation.issueKinds.length > 0
  );

  return (
    <PageContainer>
      <Stack className="gap-6">
        <Stack className="gap-2 border-b border-border pb-4">
          <Btn as={Link} href="/visas" variant="ghost" size="sm">
            Back
          </Btn>
          <Text className="text-sm text-fg-muted">{VISA_TYPES_DISPLAY_MAP[summary.visa.type]}</Text>
          <Text className="text-3xl font-semibold">{summary.visa.name}</Text>
        </Stack>

        <FactGrid cols={3}>
          <Fact label="Valid from" value={formatDate(summary.visa.validFrom)} />
          <Fact label="Expires" value={formatDate(summary.visa.expires)} />
          <Fact
            label="Status"
            value={
              <StatusBadge tone={summary.status === "valid" ? "ok" : "danger"} size="xs">
                {summary.status}
              </StatusBadge>
            }
          />
        </FactGrid>

        <Stack className="gap-3">
          {summary.alerts.map((alert) => {
            const copy = copyForAlert(alert);
            return (
              <AlertBox
                key={alert.fingerprint}
                tone={toneFromSeverity(alert.severity)}
                title={copy.title}
              >
                <Text className="text-sm text-fg-muted">{copy.detail}</Text>
              </AlertBox>
            );
          })}
        </Stack>

        <Stack className="gap-3">
          <Text className="font-semibold text-lg">Calculation date</Text>
          <VisaSimulationControl
            id={id}
            initialDate={referenceDate.toISOString().split("T")[0]}
            showAllTrips={showAllTrips}
          />
        </Stack>

        {summary.usageSnapshots.length > 0 && (
          <Stack className="gap-4">
            <Text className="font-semibold text-lg">Usage</Text>
            {summary.usageSnapshots.map((snapshot) => {
              const tone =
                snapshot.remaining < 0
                  ? "danger"
                  : snapshot.utilization >= 0.8
                  ? "warn"
                  : "ok";
              return (
                <Stack
                  key={`${snapshot.ruleKind}-${snapshot.limit}`}
                  className="gap-2 rounded-lg border border-border bg-bg-raised p-4"
                >
                  <Text className="font-semibold">{snapshot.ruleKind}</Text>
                  <UsageBar used={snapshot.used} limit={snapshot.limit} tone={tone} />
                </Stack>
              );
            })}
          </Stack>
        )}

        {summary.projection && (
          <Stack className="gap-3">
            <Text className="font-semibold text-lg">Projection</Text>
            <SchengenProjectionChart
              points={summary.projection.points.map((point) => ({
                date: new Date(point.date),
                remaining: point.remainingDays,
              }))}
              limit={summary.projection.points[0]?.limit ?? 0}
              windowDays={summary.visa.rollingPeriodLen ?? 0}
              today={referenceDate}
            />
          </Stack>
        )}

        <Stack className="gap-3">
          <Text className="font-semibold text-lg">Trips</Text>
          {visibleTrips.length === 0 ? (
            <Text className="text-sm text-fg-muted">No trips linked to this visa.</Text>
          ) : (
            visibleTrips.map((tripEvaluation) => (
              <TripCard
                key={tripEvaluation.trip.id}
                href={`/trips/${tripEvaluation.trip.id}`}
                flag={COUNTRY_EMOJIS[tripEvaluation.trip.countryCode] ?? "✈"}
                title={
                  tripEvaluation.trip.name ??
                  COUNTRY_NAMES[tripEvaluation.trip.countryCode] ??
                  tripEvaluation.trip.countryCode
                }
                dateRange={`${formatDate(tripEvaluation.trip.startDate)} - ${formatDate(
                  tripEvaluation.trip.endDate
                )}`}
                length={
                  Math.round(
                    (tripEvaluation.trip.endDate.getTime() -
                      tripEvaluation.trip.startDate.getTime()) /
                      86400000
                  ) + 1
                }
                statusTone={tripEvaluation.status === "valid" ? "ok" : "danger"}
                statusLabel={tripEvaluation.status}
                visaLabel={
                  tripEvaluation.issueKinds.length > 0
                    ? titleForTripIssue(tripEvaluation.issueKinds[0])
                    : undefined
                }
              />
            ))
          )}
          {summary.rollingWindowTripIds.length > 0 && (
            <Btn
              as={Link}
              href={(() => {
                const params = new URLSearchParams({
                  date: referenceDate.toISOString().split("T")[0],
                });
                if (!showAllTrips) {
                  params.set("show_outside_rolling_range", "true");
                }
                return `/visas/${id}?${params.toString()}`;
              })()}
              variant="ghost"
              size="sm"
            >
              {showAllTrips ? "Hide trips outside the window" : "Show all trips"}
            </Btn>
          )}
        </Stack>

        <Stack className="gap-3">
          <Text className="font-semibold text-lg">Coverage</Text>
          <div className="flex flex-wrap gap-2">
            {summary.visa.countries.map((countryCode) => (
              <TagPill
                key={countryCode}
                flag={COUNTRY_EMOJIS[countryCode] ?? "•"}
                label={COUNTRY_NAMES[countryCode] ?? countryCode}
              />
            ))}
          </div>
        </Stack>

        {(summary.visa.visaNumber || summary.visa.documentNumber) && (
          <FactGrid cols={2}>
            {summary.visa.visaNumber && (
              <Fact label="Visa number" value={summary.visa.visaNumber} />
            )}
            {summary.visa.documentNumber && (
              <Fact label="Document number" value={summary.visa.documentNumber} />
            )}
          </FactGrid>
        )}

        {projectedTripIssues.length > 0 && (
          <Stack className="gap-3">
            <Text className="font-semibold text-lg">Projected trip issues</Text>
            {projectedTripIssues.map((tripEvaluation) =>
              tripEvaluation.issueKinds.map((issueKind) => (
                <AlertBox
                  key={`${tripEvaluation.trip.id}-${issueKind}`}
                  tone="danger"
                  title={titleForTripIssue(issueKind)}
                >
                  <Text className="text-sm text-fg-muted">
                    {detailForTripIssue(
                      issueKind,
                      tripEvaluation.issues.find((issue) => issue.kind === issueKind)?.params
                    )}
                  </Text>
                </AlertBox>
              ))
            )}
          </Stack>
        )}
      </Stack>
    </PageContainer>
  );
}
