import Link from "next/link";
import {
  AlertBox,
  Btn,
  Fact,
  FactGrid,
  PageContainer,
  Stack,
  StatusBadge,
  Text,
} from "@/app/design";
import { COUNTRY_EMOJIS, COUNTRY_NAMES } from "@/app/constants";
import { detailForTripIssue, titleForTripIssue, toneFromSeverity } from "@/app/structured-copy";
import { getTripDetailSummary } from "../server-actions";
import TripVisaSelector from "./TripVisaSelector";

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString("en-GB", {
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
  const summary = await getTripDetailSummary(id);

  const durationDays =
    Math.round(
      (new Date(summary.trip.endDate).getTime() - new Date(summary.trip.startDate).getTime()) /
        86400000
    ) + 1;

  return (
    <PageContainer>
      <Stack className="gap-6">
        <Stack className="gap-2 border-b border-border pb-4">
          <Btn as={Link} href="/" variant="ghost" size="sm">
            Back
          </Btn>
          <Text className="text-sm text-fg-muted">
            {COUNTRY_EMOJIS[summary.trip.countryCode] ?? "✈"}{" "}
            {COUNTRY_NAMES[summary.trip.countryCode] ?? summary.trip.countryCode}
          </Text>
          <Text className="text-3xl font-semibold">
            {summary.trip.name ?? COUNTRY_NAMES[summary.trip.countryCode] ?? summary.trip.countryCode}
          </Text>
        </Stack>

        <FactGrid cols={2}>
          <Fact label="From" value={formatDate(summary.trip.startDate)} />
          <Fact label="To" value={formatDate(summary.trip.endDate)} />
          <Fact label="Length" value={`${durationDays} days`} />
          <Fact
            label="Visa status"
            value={
              <StatusBadge tone={summary.status === "valid" ? "ok" : "danger"} size="xs">
                {summary.status}
              </StatusBadge>
            }
          />
        </FactGrid>

        {summary.issueKinds.length > 0 ? (
          <Stack className="gap-3">
            {summary.issueKinds.map((issueKind) => (
              <AlertBox
                key={issueKind}
                tone={toneFromSeverity(
                  summary.selectedCandidate?.issues.find((issue) => issue.kind === issueKind)
                    ?.severity ?? "danger"
                )}
                title={titleForTripIssue(issueKind)}
              >
                <Text className="text-sm text-fg-muted">
                  {detailForTripIssue(
                    issueKind,
                    summary.selectedCandidate?.issues.find((issue) => issue.kind === issueKind)
                      ?.params
                  )}
                </Text>
              </AlertBox>
            ))}
          </Stack>
        ) : (
          <AlertBox tone="ok" title="Trip covered">
            <Text className="text-sm text-fg-muted">
              {summary.selectedCandidate
                ? `${summary.selectedCandidate.name} covers this trip.`
                : "No visa required for this trip."}
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
            <Text className="font-semibold text-lg">Selected visa</Text>
            <AlertBox
              tone={summary.selectedCandidate.status === "valid" ? "ok" : "danger"}
              title={summary.selectedCandidate.name}
            >
              <Text className="text-sm text-fg-muted">
                {summary.selectedCandidate.issueKinds.length > 0
                  ? `${detailForTripIssue(
                      summary.selectedCandidate.issueKinds[0],
                      summary.selectedCandidate.issues.find(
                        (issue) => issue.kind === summary.selectedCandidate?.issueKinds[0]
                      )?.params
                    )}${
                      summary.selectedCandidate.issueKinds.length > 1
                        ? ` · +${summary.selectedCandidate.issueKinds.length - 1} more issue${
                            summary.selectedCandidate.issueKinds.length - 1 === 1 ? "" : "s"
                          }`
                        : ""
                    }`
                  : "This visa currently evaluates as valid for the trip."}
              </Text>
            </AlertBox>
          </Stack>
        )}
      </Stack>
    </PageContainer>
  );
}
