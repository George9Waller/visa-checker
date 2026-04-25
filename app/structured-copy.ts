import {
  AlertKind,
  AlertSeverity,
  CardKind,
  DashboardCard,
  StructuredAlert,
  TripIssueKind,
} from "./visas/evaluation";

export const toneFromSeverity = (severity: AlertSeverity) =>
  severity === AlertSeverity.DANGER
    ? "danger"
    : severity === AlertSeverity.WARN
    ? "warn"
    : "muted";

export const titleForTripIssue = (issueKind: TripIssueKind) => {
  switch (issueKind) {
    case TripIssueKind.TRIP_NO_VISA_LINKED:
      return "No visa linked";
    case TripIssueKind.TRIP_VISA_EXPIRED:
      return "Visa expired";
    case TripIssueKind.TRIP_VISA_WILL_BE_EXPIRED:
      return "Visa expires during trip";
    case TripIssueKind.TRIP_VISA_NOT_YET_VALID:
      return "Visa not valid yet";
    case TripIssueKind.TRIP_COUNTRY_NOT_COVERED:
      return "Country not covered";
    case TripIssueKind.TRIP_EXCEEDS_SINGLE_TRIP_LIMIT:
      return "Trip too long";
    case TripIssueKind.TRIP_EXCEEDS_TOTAL_ALLOWANCE:
      return "Allowance exceeded";
    case TripIssueKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT:
      return "Rolling limit exceeded";
    case TripIssueKind.TRIP_EXCEEDS_ENTRY_LIMIT:
      return "No entries left";
    case TripIssueKind.TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH:
      return "Must leave before expiry";
  }
};

export const detailForTripIssue = (issueKind: TripIssueKind, params: Record<string, any> = {}) => {
  const tripLabel = params.tripName ? `${params.tripName}` : "this trip";
  const visaLabel = params.visaName ? `${params.visaName}` : "this visa";
  switch (issueKind) {
    case TripIssueKind.TRIP_NO_VISA_LINKED:
      return `${tripLabel} needs a linked visa before departure.`;
    case TripIssueKind.TRIP_VISA_EXPIRED:
      return `${visaLabel} expired on ${params.expires}.`;
    case TripIssueKind.TRIP_VISA_WILL_BE_EXPIRED:
      return `${visaLabel} expires on ${params.expires} before ${tripLabel} ends.`;
    case TripIssueKind.TRIP_VISA_NOT_YET_VALID:
      return `${visaLabel} becomes valid on ${params.validFrom}.`;
    case TripIssueKind.TRIP_COUNTRY_NOT_COVERED:
      return `${visaLabel} does not cover ${params.countryCode}.`;
    case TripIssueKind.TRIP_EXCEEDS_SINGLE_TRIP_LIMIT:
      return `${tripLabel} is ${params.tripLength} days long, which exceeds the ${params.limit}-day trip limit on ${visaLabel}.`;
    case TripIssueKind.TRIP_EXCEEDS_TOTAL_ALLOWANCE:
      return `${visaLabel} has ${params.used} days used, which exceeds the ${params.limit}-day allowance.`;
    case TripIssueKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT:
      return `${visaLabel} has ${params.used} days used, which exceeds the ${params.limit}-day rolling limit.`;
    case TripIssueKind.TRIP_EXCEEDS_ENTRY_LIMIT:
      return `${visaLabel} has ${params.used} entries used, which exceeds the ${params.limit}-entry limit.`;
    case TripIssueKind.TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH:
      return `${tripLabel} ends on ${params.tripEndDate}, after ${visaLabel} expires.`;
  }
};

export const copyForAlert = (alert: StructuredAlert) => {
  const visaLabel = alert.params.visaName ? `${alert.params.visaName}` : "Visa";
  const tripLabel = alert.params.tripName ? `${alert.params.tripName}` : "trip";
  switch (alert.kind) {
    case AlertKind.VISA_OVER_LIMIT_NOW:
      return {
        title: `${visaLabel} over the limit now`,
        detail: `${alert.params.used} of ${alert.params.limit} already used.`,
      };
    case AlertKind.VISA_EXPIRED:
      return {
        title: `${visaLabel} expired`,
        detail: `Expired on ${alert.params.expires}.`,
      };
    case AlertKind.VISA_WILL_EXCEED_ON_PLANNED_TRIP:
      return {
        title: `${tripLabel} will exceed the limit`,
        detail: `${visaLabel} is projected to breach by ${alert.params.tripStartDate}.`,
      };
    case AlertKind.VISA_EXPIRES_DURING_TRIP:
      return {
        title: `${visaLabel} expires during ${tripLabel}`,
        detail: `${tripLabel} ends on ${alert.params.tripEndDate}.`,
      };
    case AlertKind.VISA_NOT_YET_VALID_FOR_TRIP:
      return {
        title: `${visaLabel} not valid yet for ${tripLabel}`,
        detail: `Valid from ${alert.params.validFrom}.`,
      };
    case AlertKind.VISA_MUST_LEAVE_BEFORE_EXPIRY_BREACH:
      return {
        title: `${visaLabel} must end before expiry`,
        detail: `${tripLabel} ends on ${alert.params.tripEndDate}.`,
      };
    case AlertKind.VISA_EXPIRING_SOON:
      return {
        title: `${visaLabel} expiring soon`,
        detail: `${alert.params.daysUntilExpiry} days left.`,
      };
    case AlertKind.VISA_EXPIRING_WITH_UPCOMING_TRIPS:
      return {
        title: `${visaLabel} expiry overlaps upcoming travel`,
        detail: `${alert.params.daysUntilExpiry} days until expiry.`,
      };
    case AlertKind.VISA_APPROACHING_ALLOWANCE:
      return {
        title: `${visaLabel} allowance running low`,
        detail: `${alert.params.remaining} days remain.`,
      };
    case AlertKind.VISA_LAST_ENTRY_CONSUMED:
      return {
        title: `${visaLabel} last entry consumed`,
        detail: "Re-entry on a future trip may fail.",
      };
    case AlertKind.ROLLING_WINDOW_RESETS_SOON:
      return {
        title: `${visaLabel} rolling window changes soon`,
        detail: `One counted day drops out of the rolling window on ${alert.params.nextResetDate}.`,
      };
    case AlertKind.VISA_VALID_SOON:
      return {
        title: `${visaLabel} valid soon`,
        detail: `${alert.params.daysUntilValid} days until validity starts.`,
      };
    case AlertKind.LONG_GAP_SINCE_LAST_TRIP:
      return {
        title: `${visaLabel} long gap since last trip`,
        detail: `${alert.params.gapDays} days since travel.`,
      };
    default:
      return {
        title: titleForTripIssue(alert.kind as TripIssueKind),
        detail: detailForTripIssue(alert.kind as TripIssueKind, alert.params),
      };
  }
};

export const alertSignatureForDisplay = (alert: StructuredAlert) => {
  const copy = copyForAlert(alert);
  return `${copy.title}::${copy.detail ?? ""}`;
};

export const uniqueAlertsForDisplay = (alerts: StructuredAlert[]) => {
  const seen = new Set<string>();
  return alerts.filter((alert) => {
    const signature = alertSignatureForDisplay(alert);
    if (seen.has(signature)) {
      return false;
    }
    seen.add(signature);
    return true;
  });
};

export const copyForCard = (card: DashboardCard) => {
  switch (card.kind) {
    case CardKind.CURRENTLY_TRAVELING:
      return {
        label: "Currently traveling",
        sublabel: card.params.tripName?.toString() || card.params.countryCode?.toString() || "",
      };
    case CardKind.ROLLING_WINDOW_USAGE:
      return {
        label: "Rolling window",
        sublabel: `${card.params.used}/${card.params.limit} used`,
      };
    case CardKind.ALLOWANCE_REMAINING:
      return {
        label: "Allowance remaining",
        sublabel: `${card.params.remaining} days left`,
      };
    case CardKind.ENTRIES_REMAINING:
      return {
        label: "Entries remaining",
        sublabel: `${card.params.remainingEntries} of ${card.params.maxEntries} left`,
      };
    case CardKind.NEXT_EXPIRY:
      return {
        label: "Next expiry",
        sublabel: `${card.params.daysUntilExpiry} days left`,
      };
    case CardKind.NEXT_TRIP:
      return {
        label: "Next trip",
        sublabel: `${card.params.daysUntilStart} days until departure`,
      };
  }
};
