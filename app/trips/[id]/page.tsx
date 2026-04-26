import {
  AlertBox,
  Fact,
  FactGrid,
  PageContainer,
  PageHeader,
  Stack,
  StatusBadge,
  Text,
} from "@/app/design";
import { COUNTRY_EMOJIS, getCountryName } from "@/app/constants";
import {
  detailForTripIssue,
  titleForTripIssue,
  toneFromSeverity,
} from "@/app/structured-copy";
import { getTripDetailSummary } from "../server-actions";
import TripVisaSelector from "./TripVisaSelector";
import TripDetailActions from "./TripDetailActions";
import { getLocale, getTranslations } from "next-intl/server";

const formatDate = (value: string | Date, locale: string) =>
  new Date(value).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const tripT = await getTranslations("trip");
  const statusT = await getTranslations("status");
  const copyT = await getTranslations("copy");
  const summary = await getTripDetailSummary(id);

  const durationDays =
    Math.round(
      (new Date(summary.trip.endDate).getTime() -
        new Date(summary.trip.startDate).getTime()) /
        86400000
    ) + 1;
  const issueKinds = [...new Set(summary.issueKinds)];
  const selectedIssueKinds = [
    ...new Set(summary.selectedCandidate?.issueKinds ?? []),
  ];
  const selectedIssue =
    selectedIssueKinds[0] &&
    summary.selectedCandidate?.issues.find(
      (issue) => issue.kind === selectedIssueKinds[0]
    );

  const now = new Date();
  const tripStart = new Date(summary.trip.startDate);
  const tripEnd = new Date(summary.trip.endDate);
  let tripStatus: "current" | "upcoming" | "past" = "upcoming";
  if (now >= tripStart && now <= tripEnd) {
    tripStatus = "current";
  } else if (now > tripEnd) {
    tripStatus = "past";
  }
  const kickerText =
    tripStatus === "current"
      ? tripT("currentlyIn")
      : tripStatus === "past"
        ? tripT("pastTrip")
        : tripT("upcoming");

  return (
    <div>
      <PageHeader
        kicker={kickerText}
        title={
          summary.trip.name ??
          getCountryName(summary.trip.countryCode, locale) ??
          summary.trip.countryCode
        }
        flag={COUNTRY_EMOJIS[summary.trip.countryCode] ?? "✈"}
        backHref="/"
        actions={<TripDetailActions tripId={summary.trip.id} />}
      />
      <PageContainer>
        <Stack className="gap-6">
          <FactGrid cols={2}>
            <Fact
              label={tripT("from")}
              value={formatDate(summary.trip.startDate, locale)}
            />
            <Fact
              label={tripT("to")}
              value={formatDate(summary.trip.endDate, locale)}
            />
            <Fact
              label={tripT("length")}
              value={tripT("lengthValue", { count: durationDays })}
            />
            <Fact
              label={tripT("visaStatus")}
              value={
                <StatusBadge
                  tone={summary.status === "valid" ? "ok" : "danger"}
                  size="xs"
                >
                  {summary.status === "valid"
                    ? statusT("valid")
                    : statusT("visaInvalid")}
                </StatusBadge>
              }
            />
          </FactGrid>

          {issueKinds.length > 0 ? (
            <Stack className="gap-3">
              {issueKinds.map((issueKind) => (
                <AlertBox
                  key={issueKind}
                  tone={toneFromSeverity(
                    summary.selectedCandidate?.issues.find(
                      (issue) => issue.kind === issueKind
                    )?.severity ?? "danger"
                  )}
                  title={titleForTripIssue(copyT, issueKind)}
                >
                  <Text className="text-sm text-fg-muted">
                    {detailForTripIssue(
                      copyT,
                      issueKind,
                      summary.selectedCandidate?.issues.find(
                        (issue) => issue.kind === issueKind
                      )?.params
                    )}
                  </Text>
                </AlertBox>
              ))}
            </Stack>
          ) : (
            <AlertBox tone="ok" title={tripT("tripCovered")}>
              <Text className="text-sm text-fg-muted">
                {summary.selectedCandidate
                  ? tripT("tripCoveredByVisa", {
                      visaName: summary.selectedCandidate.name,
                    })
                  : tripT("noVisaRequired")}
              </Text>
            </AlertBox>
          )}

          {summary.trip.visaRequired && (
            <TripVisaSelector
              tripId={summary.trip.id}
              candidates={summary.candidates}
              selectedVisaId={summary.selectedVisaId}
            />
          )}

          {summary.selectedCandidate && (
            <Stack className="gap-3">
              <Text className="font-semibold text-lg">
                {tripT("selectedVisa")}
              </Text>
              <AlertBox
                tone={
                  summary.selectedCandidate.status === "valid" ? "ok" : "danger"
                }
                title={summary.selectedCandidate.name}
              >
                <Text className="text-sm text-fg-muted">
                  {selectedIssueKinds.length > 0
                    ? `${detailForTripIssue(
                        copyT,
                        selectedIssueKinds[0],
                        selectedIssue?.params
                      )}${
                        selectedIssueKinds.length > 1
                          ? ` · ${copyT("moreIssues", {
                              count: selectedIssueKinds.length - 1,
                            })}`
                          : ""
                      }`
                    : tripT("visaCurrentlyValid")}
                </Text>
              </AlertBox>
            </Stack>
          )}
        </Stack>
      </PageContainer>
    </div>
  );
}
