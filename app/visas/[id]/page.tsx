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
import { COUNTRY_EMOJIS, getCountryName } from "@/app/constants";
import {
  copyForAlert,
  detailForTripIssue,
  titleForTripIssue,
  toneFromSeverity,
  uniqueAlertsForDisplay,
} from "@/app/structured-copy";
import Link from "next/link";
import { getVisaDetailSummary } from "../server-actions";
import { VisaTypeKey } from "../constants";
import { redirect } from "next/navigation";
import VisaSimulationControl from "./VisaSimulationControl";
import VisaDetailActions from "./VisaDetailActions";
import SensitiveValue from "./SensitiveValue";
import { getVisaFlag } from "../utils";
import { getLocale, getTranslations } from "next-intl/server";

const formatDate = (date: Date | null, locale: string) =>
  date
    ? date.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

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
  const locale = await getLocale();
  const visaT = await getTranslations("visa");
  const statusT = await getTranslations("status");
  const copyT = await getTranslations("copy");
  const commonT = await getTranslations("common");
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
  const visibleAlerts = uniqueAlertsForDisplay(copyT, summary.alerts);
  const projectedIssueCards = projectedTripIssues
    .flatMap((tripEvaluation) =>
      tripEvaluation.issueKinds.map((issueKind) => {
        const issue = tripEvaluation.issues.find(
          (item) => item.kind === issueKind
        );
        return {
          key: `${tripEvaluation.trip.id}-${issueKind}`,
          title: titleForTripIssue(copyT, issueKind),
          detail: detailForTripIssue(copyT, issueKind, issue?.params),
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
  const canRenew = Boolean(
    summary.visa.expires &&
    (summary.visa.expires < referenceDate || expiresSoon)
  );
  const previousVisa = summary.visa.renewedFrom;
  const nextVisa = summary.visa.renewals[0] ?? null;

  return (
    <div>
      <PageHeader
        kicker={visaT(`types.${summary.visa.type}`)}
        title={summary.visa.name}
        flag={getVisaFlag(
          summary.visa.type as VisaTypeKey,
          summary.visa.countries
        )}
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
            <Text className="font-semibold text-lg">{visaT("validity")}</Text>
            <FactGrid cols={2}>
              <Fact
                label={visaT("validFrom")}
                value={formatDate(summary.visa.validFrom, locale)}
              />
              <Fact
                label={visaT("expiresOn")}
                value={
                  formatDate(summary.visa.expires, locale) ?? visaT("openEnded")
                }
              />
              <Fact
                label={visaT("typeLabel")}
                value={visaT(`types.${summary.visa.type}`)}
              />
              <Fact
                label={visaT("countriesLabel")}
                value={commonT("countryCount", {
                  count: summary.visa.countries.length,
                })}
              />
            </FactGrid>
          </Stack>

          <Divider />

          <Stack className="gap-3">
            <Text className="font-semibold text-lg">
              {visaT("configuration")}
            </Text>
            <FactGrid cols={2}>
              {summary.visa.tripMaxLen != null && (
                <Fact
                  label={visaT("singleTripMax")}
                  value={commonT("dayCount", {
                    count: summary.visa.tripMaxLen,
                  })}
                />
              )}
              {summary.visa.totalMaxLen != null && (
                <Fact
                  label={visaT("totalStayMax")}
                  value={commonT("dayCount", {
                    count: summary.visa.totalMaxLen,
                  })}
                />
              )}
              {summary.visa.maxNumTrips != null && (
                <Fact
                  label={visaT("maxTrips")}
                  value={commonT("tripCount", {
                    count: summary.visa.maxNumTrips,
                  })}
                />
              )}
              {summary.visa.rollingPeriodLen != null && (
                <Fact
                  label={visaT("rollingPeriod")}
                  value={commonT("dayCount", {
                    count: summary.visa.rollingPeriodLen,
                  })}
                />
              )}
              <Fact
                label={visaT("mustLeave")}
                value={
                  summary.visa.mustExitBeforeExpiry
                    ? commonT("yes")
                    : commonT("no")
                }
              />
              <Fact
                label={visaT("countBothDays")}
                value={
                  summary.visa.includeEntryAndExitDates
                    ? commonT("yes")
                    : commonT("no")
                }
              />
            </FactGrid>
          </Stack>

          {(summary.visa.visaNumber || summary.visa.documentNumber) && (
            <>
              <Divider />
              <Stack className="gap-3">
                <Text className="font-semibold text-lg">
                  {visaT("identifiers")}
                </Text>
                <FactGrid cols={2}>
                  {summary.visa.visaNumber && (
                    <Fact
                      label={visaT("number")}
                      value={
                        <SensitiveValue
                          label={visaT("number").toLowerCase()}
                          value={summary.visa.visaNumber}
                        />
                      }
                    />
                  )}
                  {summary.visa.documentNumber && (
                    <Fact
                      label={visaT("documentNumber")}
                      value={
                        <SensitiveValue
                          label={visaT("documentNumber").toLowerCase()}
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
                <Text className="font-semibold text-lg">
                  {visaT("renewalHistory")}
                </Text>
                <FactGrid cols={2}>
                  {previousVisa && (
                    <Fact
                      label={visaT("renewedFrom")}
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
                      label={visaT("renewedBy")}
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

          {summary.projection && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">
                {visaT("projection")}
              </Text>
              <StatCard>
                <SchengenProjectionChart
                  points={summary.projection.points}
                  limit={summary.visa.totalMaxLen ?? 90}
                  today={referenceDate}
                />
              </StatCard>
              <VisaSimulationControl
                id={summary.visa.id}
                initialDate={referenceDate.toISOString().split("T")[0]}
                showAllTrips={showAllTrips}
              />
            </Stack>
          )}

          {summary.rollingLimit && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">
                {visaT("aggregates")}
              </Text>
              <UsageBar
                used={summary.rollingUsed ?? 0}
                limit={summary.rollingLimit}
                tone={summary.status === "valid" ? "ok" : "danger"}
              />
              <Text className="text-sm text-fg-muted">
                {commonT("daysUsedInWindow", {
                  used: summary.rollingUsed ?? 0,
                  limit: summary.rollingLimit,
                  window: summary.rollingWindow ?? 0,
                })}
              </Text>
            </Stack>
          )}

          {visibleAlerts.length > 0 && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">{visaT("alerts")}</Text>
              {visibleAlerts.map((alert) => {
                const copy = copyForAlert(copyT, alert);
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
              <Text className="font-semibold text-lg">
                {visaT("upcomingIssues")}
              </Text>
              {projectedIssueCards.map((card) => (
                <AlertBox key={card.key} tone="warn" title={card.title}>
                  <Text className="text-sm text-fg-muted">{card.detail}</Text>
                </AlertBox>
              ))}
            </Stack>
          )}

          {visibleTrips.length > 0 && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">{visaT("trips")}</Text>
              {visibleTrips.map((tripEvaluation) => (
                <TripCard
                  key={tripEvaluation.trip.id}
                  flag={COUNTRY_EMOJIS[tripEvaluation.trip.countryCode] ?? "✈"}
                  title={
                    tripEvaluation.trip.name ??
                    getCountryName(tripEvaluation.trip.countryCode, locale) ??
                    tripEvaluation.trip.countryCode
                  }
                  dateRange={`${formatDate(tripEvaluation.trip.startDate, locale)} – ${formatDate(tripEvaluation.trip.endDate, locale)}`}
                  length={
                    Math.round(
                      (new Date(tripEvaluation.trip.endDate).getTime() -
                        new Date(tripEvaluation.trip.startDate).getTime()) /
                        86400000
                    ) + 1
                  }
                  statusTone={
                    tripEvaluation.status === "valid" ? "ok" : "danger"
                  }
                  statusLabel={
                    tripEvaluation.status === "valid"
                      ? statusT("valid")
                      : statusT("visaInvalid")
                  }
                />
              ))}
            </Stack>
          )}

          {summary.visa.countries.length > 0 && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">{visaT("coverage")}</Text>
              <div className="flex flex-wrap gap-2">
                {summary.visa.countries.map((countryCode) => (
                  <TagPill
                    key={countryCode}
                    flag={COUNTRY_EMOJIS[countryCode] ?? "🌍"}
                    label={getCountryName(countryCode, locale) ?? countryCode}
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
