export const dynamic = "force-dynamic";

import {
  AlertBox,
  Divider,
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
import Link from "next/link";
import { getVisaDetailSummary } from "../server-actions";
import { VISA_TYPES_DISPLAY_MAP, VisaTypeKey } from "../constants";
import { redirect } from "next/navigation";
import VisaSimulationControl from "./VisaSimulationControl";
import VisaDetailActions from "./VisaDetailActions";
import SensitiveValue from "./SensitiveValue";
import { getVisaFlag } from "../utils";

const formatDate = (date: Date | null) =>
  date
    ? date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      year: "numeric",
      })
    : "Open-ended";

const formatCount = (value: number, singular: string, plural: string) =>
  `${value} ${value === 1 ? singular : plural}`;

const formatBoolean = (value: boolean) => (value ? "Yes" : "No");

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
  const expiresSoon =
    summary.visa.expires &&
    summary.visa.expires.getTime() - referenceDate.getTime() <= 30 * 86400000;
  const canRenew = Boolean(summary.visa.expires && (summary.visa.expires < referenceDate || expiresSoon));
  const previousVisa = summary.visa.renewedFrom;
  const nextVisa = summary.visa.renewals[0] ?? null;

  return (
    <div>
      <PageHeader
        kicker={VISA_TYPES_DISPLAY_MAP[summary.visa.type]}
        title={summary.visa.name}
        flag={getVisaFlag(summary.visa.type as VisaTypeKey, summary.visa.countries)}
        backHref="/visas"
        actions={
          <VisaDetailActions
            visaId={summary.visa.id}
            renewHref={canRenew ? `/visas/${summary.visa.id}/renew` : null}
          />
        }
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

          <Divider />

          <Stack className="gap-3">
            <Text className="font-semibold text-lg">Configuration</Text>
            <FactGrid cols={2}>
              {summary.visa.tripMaxLen != null && (
                <Fact
                  label="Maximum single trip"
                  value={formatCount(summary.visa.tripMaxLen, "day", "days")}
                />
              )}
              {summary.visa.totalMaxLen != null && (
                <Fact
                  label="Maximum total stay"
                  value={formatCount(summary.visa.totalMaxLen, "day", "days")}
                />
              )}
              {summary.visa.maxNumTrips != null && (
                <Fact
                  label="Maximum trips"
                  value={formatCount(summary.visa.maxNumTrips, "trip", "trips")}
                />
              )}
              {summary.visa.rollingPeriodLen != null && (
                <Fact
                  label="Rolling period"
                  value={formatCount(
                    summary.visa.rollingPeriodLen,
                    "day",
                    "days"
                  )}
                />
              )}
              <Fact
                label="Must exit before expiry"
                value={formatBoolean(summary.visa.mustExitBeforeExpiry)}
              />
              <Fact
                label="Include entry and exit dates"
                value={formatBoolean(summary.visa.includeEntryAndExitDates)}
              />
            </FactGrid>
          </Stack>

          {(summary.visa.visaNumber || summary.visa.documentNumber) && (
            <>
              <Divider />
              <Stack className="gap-3">
                <Text className="font-semibold text-lg">Identifiers</Text>
                <FactGrid cols={2}>
                  {summary.visa.visaNumber && (
                    <Fact
                      label="Visa number"
                      value={
                        <SensitiveValue
                          label="visa number"
                          value={summary.visa.visaNumber}
                        />
                      }
                    />
                  )}
                  {summary.visa.documentNumber && (
                    <Fact
                      label="Document number"
                      value={
                        <SensitiveValue
                          label="document number"
                          value={summary.visa.documentNumber}
                        />
                      }
                    />
                  )}
                </FactGrid>
              </Stack>
            </>
          )}

          {(previousVisa || nextVisa) && (
            <>
              <Divider />
              <Stack className="gap-3">
                <Text className="font-semibold text-lg">Renewal history</Text>
                <FactGrid cols={2}>
                  {previousVisa && (
                    <Fact
                      label="Renewed from"
                      value={
                        <Link
                          href={`/visas/${previousVisa.id}`}
                          className="text-fg underline decoration-fg/30 underline-offset-2 transition-colors hover:text-fg-muted"
                        >
                          {previousVisa.name}
                        </Link>
                      }
                    />
                  )}
                  {nextVisa && (
                    <Fact
                      label="Renewed by"
                      value={
                        <Link
                          href={`/visas/${nextVisa.id}`}
                          className="text-fg underline decoration-fg/30 underline-offset-2 transition-colors hover:text-fg-muted"
                        >
                          {nextVisa.name}
                        </Link>
                      }
                    />
                  )}
                </FactGrid>
              </Stack>
            </>
          )}

          <Divider />

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
