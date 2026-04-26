export const dynamic = "force-dynamic";

import {
  AlertBox,
  Fact,
  FactGrid,
  PageContainer,
  PageHeader,
  SchengenProjectionChart,
  Stack,
  StatCard,
  TagPill,
  Text,
  TripCard,
  UsageBar,
} from "@/app/design";
import { COUNTRY_EMOJIS, COUNTRY_NAMES } from "@/app/constants";
import {
  copyForAlert,
  detailForTripIssue,
  titleForTripIssue,
  toneFromSeverity,
  uniqueAlertsForDisplay,
} from "@/app/structured-copy";
import { getVisaDetailSummary } from "../server-actions";
import { VISA_TYPES_DISPLAY_MAP } from "../constants";
import Link from "next/link";
import { redirect } from "next/navigation";
import VisaSimulationControl from "./VisaSimulationControl";
import VisaDetailActions from "./VisaDetailActions";

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
  const visibleAlerts = uniqueAlertsForDisplay(summary.alerts);
  const projectedIssueCards = projectedTripIssues
    .flatMap((tripEvaluation) =>
      tripEvaluation.issueKinds.map((issueKind) => {
        const issue = tripEvaluation.issues.find(
          (item) => item.kind === issueKind
        );
        return {
          key: `${tripEvaluation.trip.id}-${issueKind}`,
          title: titleForTripIssue(issueKind),
          detail: detailForTripIssue(issueKind, issue?.params),
        };
      })
    )
    .filter(
      (item, index, list) =>
        list.findIndex(
          (candidate) =>
            candidate.title === item.title && candidate.detail === item.detail
        ) === index
    );

  return (
    <div>
      <PageHeader
        kicker={VISA_TYPES_DISPLAY_MAP[summary.visa.type]}
        title={summary.visa.name}
        flag={summary.visa.countries[0] ? COUNTRY_EMOJIS[summary.visa.countries[0]] ?? "🪪" : "🪪"}
        backHref="/visas"
        actions={<VisaDetailActions visaId={summary.visa.id} />}
      />
      <PageContainer>
        <Stack className="gap-6">
          <Stack className="gap-3">
            <Text className="font-semibold text-lg">Validity</Text>
            <FactGrid cols={2}>
            <Fact
              label="Valid from"
              value={formatDate(summary.visa.validFrom)}
            />
            <Fact
              label="Expires"
              value={formatDate(summary.visa.expires)}
            />
            <Fact
              label="Type"
              value={VISA_TYPES_DISPLAY_MAP[summary.visa.type]}
            />
            <Fact
              label="Countries"
              value={summary.visa.countries.length}
            />
            </FactGrid>
          </Stack>

          {summary.projection && summary.rollingWindowTripIds.length > 0 && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">Projection</Text>
              <StatCard>
              <SchengenProjectionChart
                points={summary.projection.points}
                limit={summary.visa.totalMaxLen ?? 90}
                today={referenceDate}
              /></StatCard>
              <VisaSimulationControl
                id={summary.visa.id}
                initialDate={referenceDate.toISOString().split('T')[0]}
                showAllTrips={showAllTrips}
              />
            </Stack>
          )}

          {summary.rollingLimit && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">Usage</Text>
              <UsageBar
                used={summary.rollingUsed ?? 0}
                limit={summary.rollingLimit}
                tone={
                  summary.status === "valid"
                    ? "ok"
                    : "danger"
                }
              />
              <Text className="text-sm text-fg-muted">
                {summary.rollingUsed} / {summary.rollingLimit} days used in the last {summary.rollingWindow} days
              </Text>
            </Stack>
          )}

          {visibleAlerts.length > 0 && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">Alerts</Text>
              {visibleAlerts.map((alert) => {
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
          )}

          {projectedIssueCards.length > 0 && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">Upcoming issues</Text>
              {projectedIssueCards.map((card) => (
                <AlertBox
                  key={card.key}
                  tone="warn"
                  title={card.title}
                >
                  <Text className="text-sm text-fg-muted">{card.detail}</Text>
                </AlertBox>
              ))}
            </Stack>
          )}

          {visibleTrips.length > 0 && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">Trips</Text>
              {visibleTrips.map((tripEvaluation) => (
                <TripCard
                  key={tripEvaluation.trip.id}
                  flag={COUNTRY_EMOJIS[tripEvaluation.trip.countryCode] ?? "✈"}
                  title={tripEvaluation.trip.name ?? COUNTRY_NAMES[tripEvaluation.trip.countryCode] ?? tripEvaluation.trip.countryCode}
                  dateRange={`${formatDate(tripEvaluation.trip.startDate)} – ${formatDate(tripEvaluation.trip.endDate)}`}
                  length={Math.round((new Date(tripEvaluation.trip.endDate).getTime() - new Date(tripEvaluation.trip.startDate).getTime()) / 86400000) + 1}
                  statusTone={tripEvaluation.status === "valid" ? "ok" : "danger"}
                  statusLabel={tripEvaluation.status}
                />
              ))}
            </Stack>
          )}

          {summary.visa.countries.length > 0 && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">Coverage</Text>
              <div className="flex flex-wrap gap-2">
                {summary.visa.countries.map((countryCode) => (
                  <TagPill
                    key={countryCode}
                    flag={COUNTRY_EMOJIS[countryCode] ?? "🌍"}
                    label={COUNTRY_NAMES[countryCode] ?? countryCode}
                  />
                ))}
              </div>
            </Stack>
          )}
        </Stack>
      </PageContainer>
    </div>
  );
}
