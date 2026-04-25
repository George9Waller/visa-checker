"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { OptionList, OptionRow, Stack, StatusBadge, Text } from "@/app/design";
import { TripVisaCandidate, selectVisaForTrip } from "../server-actions";
import {
  detailForTripIssue,
  titleForTripIssue,
  toneFromSeverity,
} from "@/app/structured-copy";

export default function TripVisaSelector({
  tripId,
  candidates,
  selectedVisaId,
}: {
  tripId: string;
  candidates: TripVisaCandidate[];
  selectedVisaId: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingVisaId, setPendingVisaId] = useState<string | null>(null);

  return (
    <Stack className="gap-3">
      <Text className="font-semibold text-lg">Visa options</Text>
      {candidates.length === 0 ? (
        <Text className="text-sm text-fg-muted">
          Create a visa for this country before you travel.
        </Text>
      ) : (
        <OptionList maxHeight="48vh" className="overscroll-contain">
          {candidates.map((candidate) => {
            const issueKinds = [...new Set(candidate.issueKinds)];
            const issue = candidate.issues[0];
            const badgeTone =
              candidate.status === "valid"
                ? "ok"
                : toneFromSeverity(issue?.severity ?? "danger");
            const firstIssueKind = issueKinds[0];
            const issueSummary =
              candidate.status === "valid"
                ? "Valid for this trip"
                : issue
                  ? detailForTripIssue(issue.kind, issue.params)
                  : firstIssueKind
                    ? titleForTripIssue(firstIssueKind)
                    : "Needs review";
            const subtitle =
              candidate.status === "valid"
                ? issueSummary
                : issueKinds.length > 1
                  ? `${issueSummary} · +${issueKinds.length - 1} more issue${
                      issueKinds.length - 1 === 1 ? "" : "s"
                    }`
                  : issueSummary;
            return (
              <OptionRow
                key={candidate.id}
                title={candidate.name}
                subtitle={subtitle}
                selected={candidate.id === selectedVisaId}
                trailing={
                  <StatusBadge tone={badgeTone} size="xs">
                    {isPending && pendingVisaId === candidate.id
                      ? "saving"
                      : candidate.status}
                  </StatusBadge>
                }
                onClick={() => {
                  if (isPending) {
                    return;
                  }
                  setPendingVisaId(candidate.id);
                  startTransition(() => {
                    void selectVisaForTrip(tripId, candidate.id).then(() => {
                      setPendingVisaId(null);
                      router.refresh();
                    });
                  });
                }}
              />
            );
          })}
        </OptionList>
      )}
    </Stack>
  );
}
