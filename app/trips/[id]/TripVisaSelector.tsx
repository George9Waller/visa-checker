"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("trip");
  const statusT = useTranslations("status");
  const copyT = useTranslations("copy");

  return (
    <Stack className="gap-3">
      <Text className="font-semibold text-lg">{t("visaOptions")}</Text>
      {candidates.length === 0 ? (
        <Text className="text-sm text-fg-muted">
          {t("createVisaBeforeTravel")}
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
                ? t("validForTrip")
                : issue
                  ? detailForTripIssue(copyT, issue.kind, issue.params)
                  : firstIssueKind
                    ? titleForTripIssue(copyT, firstIssueKind)
                    : t("needsReview");
            const subtitle =
              candidate.status === "valid"
                ? issueSummary
                : issueKinds.length > 1
                  ? `${issueSummary} · ${copyT("moreIssues", {
                      count: issueKinds.length - 1,
                    })}`
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
                      ? t("saving")
                      : statusT(candidate.status as "valid" | "invalid")}
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
