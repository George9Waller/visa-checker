import {
  AlertKind,
  AlertSeverity,
  CardKind,
  DashboardCard,
  StructuredAlert,
  TripIssueKind,
} from "./visas/evaluation";

type Translator = (key: string, values?: Record<string, any>) => string;

export const toneFromSeverity = (severity: AlertSeverity) =>
  severity === AlertSeverity.DANGER
    ? "danger"
    : severity === AlertSeverity.WARN
      ? "warn"
      : "muted";

const tripIssueKey = (issueKind: TripIssueKind) => {
  switch (issueKind) {
    case TripIssueKind.TRIP_NO_VISA_LINKED:
      return "TRIP_NO_VISA_LINKED";
    case TripIssueKind.TRIP_VISA_EXPIRED:
      return "TRIP_VISA_EXPIRED";
    case TripIssueKind.TRIP_VISA_WILL_BE_EXPIRED:
      return "TRIP_VISA_WILL_BE_EXPIRED";
    case TripIssueKind.TRIP_VISA_NOT_YET_VALID:
      return "TRIP_VISA_NOT_YET_VALID";
    case TripIssueKind.TRIP_COUNTRY_NOT_COVERED:
      return "TRIP_COUNTRY_NOT_COVERED";
    case TripIssueKind.TRIP_EXCEEDS_SINGLE_TRIP_LIMIT:
      return "TRIP_EXCEEDS_SINGLE_TRIP_LIMIT";
    case TripIssueKind.TRIP_EXCEEDS_TOTAL_ALLOWANCE:
      return "TRIP_EXCEEDS_TOTAL_ALLOWANCE";
    case TripIssueKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT:
      return "TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT";
    case TripIssueKind.TRIP_EXCEEDS_ENTRY_LIMIT:
      return "TRIP_EXCEEDS_ENTRY_LIMIT";
    case TripIssueKind.TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH:
      return "TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH";
  }
};

export const titleForTripIssue = (t: Translator, issueKind: TripIssueKind) =>
  t(`tripIssues.${tripIssueKey(issueKind)}.title`);

export const detailForTripIssue = (
  t: Translator,
  issueKind: TripIssueKind,
  params: Record<string, any> = {}
) => {
  const tripLabel = params.tripName ? `${params.tripName}` : t("labels.thisTrip");
  const visaLabel = params.visaName ? `${params.visaName}` : t("labels.thisVisa");
  switch (issueKind) {
    case TripIssueKind.TRIP_NO_VISA_LINKED:
      return t("tripIssues.TRIP_NO_VISA_LINKED.detail", { tripLabel });
    case TripIssueKind.TRIP_VISA_EXPIRED:
      return t("tripIssues.TRIP_VISA_EXPIRED.detail", {
        visaLabel,
        expires: params.expires,
      });
    case TripIssueKind.TRIP_VISA_WILL_BE_EXPIRED:
      return t("tripIssues.TRIP_VISA_WILL_BE_EXPIRED.detail", {
        visaLabel,
        tripLabel,
        expires: params.expires,
      });
    case TripIssueKind.TRIP_VISA_NOT_YET_VALID:
      return t("tripIssues.TRIP_VISA_NOT_YET_VALID.detail", {
        visaLabel,
        validFrom: params.validFrom,
      });
    case TripIssueKind.TRIP_COUNTRY_NOT_COVERED:
      return t("tripIssues.TRIP_COUNTRY_NOT_COVERED.detail", {
        visaLabel,
        countryCode: params.countryCode,
      });
    case TripIssueKind.TRIP_EXCEEDS_SINGLE_TRIP_LIMIT:
      return t("tripIssues.TRIP_EXCEEDS_SINGLE_TRIP_LIMIT.detail", {
        tripLabel,
        tripLength: params.tripLength,
        limit: params.limit,
        visaLabel,
      });
    case TripIssueKind.TRIP_EXCEEDS_TOTAL_ALLOWANCE:
      return t("tripIssues.TRIP_EXCEEDS_TOTAL_ALLOWANCE.detail", {
        visaLabel,
        used: params.used,
        limit: params.limit,
      });
    case TripIssueKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT:
      return t("tripIssues.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT.detail", {
        visaLabel,
        used: params.used,
        limit: params.limit,
      });
    case TripIssueKind.TRIP_EXCEEDS_ENTRY_LIMIT:
      return t("tripIssues.TRIP_EXCEEDS_ENTRY_LIMIT.detail", {
        visaLabel,
        used: params.used,
        limit: params.limit,
      });
    case TripIssueKind.TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH:
      return t("tripIssues.TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH.detail", {
        tripLabel,
        visaLabel,
        tripEndDate: params.tripEndDate,
      });
  }
};

const alertKey = (alertKind: AlertKind) => {
  switch (alertKind) {
    case AlertKind.VISA_OVER_LIMIT_NOW:
      return "VISA_OVER_LIMIT_NOW";
    case AlertKind.VISA_EXPIRED:
      return "VISA_EXPIRED";
    case AlertKind.VISA_WILL_EXCEED_ON_PLANNED_TRIP:
      return "VISA_WILL_EXCEED_ON_PLANNED_TRIP";
    case AlertKind.VISA_EXPIRES_DURING_TRIP:
      return "VISA_EXPIRES_DURING_TRIP";
    case AlertKind.VISA_NOT_YET_VALID_FOR_TRIP:
      return "VISA_NOT_YET_VALID_FOR_TRIP";
    case AlertKind.VISA_MUST_LEAVE_BEFORE_EXPIRY_BREACH:
      return "VISA_MUST_LEAVE_BEFORE_EXPIRY_BREACH";
    case AlertKind.TRIP_NO_VISA_LINKED:
      return "TRIP_NO_VISA_LINKED";
    case AlertKind.TRIP_VISA_EXPIRED:
      return "TRIP_VISA_EXPIRED";
    case AlertKind.TRIP_COUNTRY_NOT_COVERED:
      return "TRIP_COUNTRY_NOT_COVERED";
    case AlertKind.TRIP_EXCEEDS_SINGLE_TRIP_LIMIT:
      return "TRIP_EXCEEDS_SINGLE_TRIP_LIMIT";
    case AlertKind.TRIP_EXCEEDS_TOTAL_ALLOWANCE:
      return "TRIP_EXCEEDS_TOTAL_ALLOWANCE";
    case AlertKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT:
      return "TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT";
    case AlertKind.TRIP_EXCEEDS_ENTRY_LIMIT:
      return "TRIP_EXCEEDS_ENTRY_LIMIT";
    case AlertKind.VISA_EXPIRING_SOON:
      return "VISA_EXPIRING_SOON";
    case AlertKind.VISA_EXPIRING_WITH_UPCOMING_TRIPS:
      return "VISA_EXPIRING_WITH_UPCOMING_TRIPS";
    case AlertKind.VISA_APPROACHING_ALLOWANCE:
      return "VISA_APPROACHING_ALLOWANCE";
    case AlertKind.VISA_LAST_ENTRY_CONSUMED:
      return "VISA_LAST_ENTRY_CONSUMED";
    case AlertKind.ROLLING_WINDOW_RESETS_SOON:
      return "ROLLING_WINDOW_RESETS_SOON";
    case AlertKind.VISA_VALID_SOON:
      return "VISA_VALID_SOON";
    case AlertKind.LONG_GAP_SINCE_LAST_TRIP:
      return "LONG_GAP_SINCE_LAST_TRIP";
  }
};

export const copyForAlert = (t: Translator, alert: StructuredAlert) => {
  const visaLabel = alert.params.visaName ? `${alert.params.visaName}` : t("labels.visa");
  const tripLabel = alert.params.tripName ? `${alert.params.tripName}` : t("labels.trip");
  switch (alert.kind) {
    case AlertKind.VISA_OVER_LIMIT_NOW:
      return {
        title: t("alerts.VISA_OVER_LIMIT_NOW.title", { visaLabel }),
        detail: t("alerts.VISA_OVER_LIMIT_NOW.detail", {
          used: alert.params.used,
          limit: alert.params.limit,
        }),
      };
    case AlertKind.VISA_EXPIRED:
      return {
        title: t("alerts.VISA_EXPIRED.title", { visaLabel }),
        detail: t("alerts.VISA_EXPIRED.detail", {
          expires: alert.params.expires,
        }),
      };
    case AlertKind.VISA_WILL_EXCEED_ON_PLANNED_TRIP:
      return {
        title: t("alerts.VISA_WILL_EXCEED_ON_PLANNED_TRIP.title", {
          tripLabel,
        }),
        detail: t("alerts.VISA_WILL_EXCEED_ON_PLANNED_TRIP.detail", {
          visaLabel,
          tripStartDate: alert.params.tripStartDate,
        }),
      };
    case AlertKind.VISA_EXPIRES_DURING_TRIP:
      return {
        title: t("alerts.VISA_EXPIRES_DURING_TRIP.title", {
          visaLabel,
          tripLabel,
        }),
        detail: t("alerts.VISA_EXPIRES_DURING_TRIP.detail", {
          tripLabel,
          tripEndDate: alert.params.tripEndDate,
        }),
      };
    case AlertKind.VISA_NOT_YET_VALID_FOR_TRIP:
      return {
        title: t("alerts.VISA_NOT_YET_VALID_FOR_TRIP.title", {
          visaLabel,
          tripLabel,
        }),
        detail: t("alerts.VISA_NOT_YET_VALID_FOR_TRIP.detail", {
          validFrom: alert.params.validFrom,
        }),
      };
    case AlertKind.VISA_MUST_LEAVE_BEFORE_EXPIRY_BREACH:
      return {
        title: t("alerts.VISA_MUST_LEAVE_BEFORE_EXPIRY_BREACH.title", {
          visaLabel,
        }),
        detail: t("alerts.VISA_MUST_LEAVE_BEFORE_EXPIRY_BREACH.detail", {
          tripLabel,
          tripEndDate: alert.params.tripEndDate,
        }),
      };
    case AlertKind.VISA_EXPIRING_SOON:
      return {
        title: t("alerts.VISA_EXPIRING_SOON.title", { visaLabel }),
        detail: t("alerts.VISA_EXPIRING_SOON.detail", {
          daysUntilExpiry: alert.params.daysUntilExpiry,
        }),
      };
    case AlertKind.VISA_EXPIRING_WITH_UPCOMING_TRIPS:
      return {
        title: t("alerts.VISA_EXPIRING_WITH_UPCOMING_TRIPS.title", {
          visaLabel,
        }),
        detail: t("alerts.VISA_EXPIRING_WITH_UPCOMING_TRIPS.detail", {
          daysUntilExpiry: alert.params.daysUntilExpiry,
        }),
      };
    case AlertKind.VISA_APPROACHING_ALLOWANCE:
      return {
        title: t("alerts.VISA_APPROACHING_ALLOWANCE.title", { visaLabel }),
        detail: t("alerts.VISA_APPROACHING_ALLOWANCE.detail", {
          remaining: alert.params.remaining,
        }),
      };
    case AlertKind.VISA_LAST_ENTRY_CONSUMED:
      return {
        title: t("alerts.VISA_LAST_ENTRY_CONSUMED.title", { visaLabel }),
        detail: t("alerts.VISA_LAST_ENTRY_CONSUMED.detail"),
      };
    case AlertKind.ROLLING_WINDOW_RESETS_SOON:
      return {
        title: t("alerts.ROLLING_WINDOW_RESETS_SOON.title", { visaLabel }),
        detail: t("alerts.ROLLING_WINDOW_RESETS_SOON.detail", {
          nextResetDate: alert.params.nextResetDate,
        }),
      };
    case AlertKind.VISA_VALID_SOON:
      return {
        title: t("alerts.VISA_VALID_SOON.title", { visaLabel }),
        detail: t("alerts.VISA_VALID_SOON.detail", {
          daysUntilValid: alert.params.daysUntilValid,
        }),
      };
    case AlertKind.LONG_GAP_SINCE_LAST_TRIP:
      return {
        title: t("alerts.LONG_GAP_SINCE_LAST_TRIP.title", {
          visaLabel,
        }),
        detail: t("alerts.LONG_GAP_SINCE_LAST_TRIP.detail", {
          gapDays: alert.params.gapDays,
        }),
      };
    default:
      return {
        title: titleForTripIssue(t, alert.kind as TripIssueKind),
        detail: detailForTripIssue(t, alert.kind as TripIssueKind, alert.params),
      };
  }
};

export const alertSignatureForDisplay = (t: Translator, alert: StructuredAlert) => {
  const copy = copyForAlert(t, alert);
  return `${copy.title}::${copy.detail ?? ""}`;
};

export const uniqueAlertsForDisplay = (t: Translator, alerts: StructuredAlert[]) => {
  const seen = new Set<string>();
  return alerts.filter((alert) => {
    const signature = alertSignatureForDisplay(t, alert);
    if (seen.has(signature)) {
      return false;
    }
    seen.add(signature);
    return true;
  });
};

export const copyForCard = (t: Translator, card: DashboardCard) => {
  switch (card.kind) {
    case CardKind.CURRENTLY_TRAVELING:
      return {
        label: t("cards.CURRENTLY_TRAVELING.label"),
        sublabel:
          card.params.tripName?.toString() ||
          card.params.countryCode?.toString() ||
          "",
      };
    case CardKind.ROLLING_WINDOW_USAGE:
      return {
        label: card.visaName ?? t("cards.ROLLING_WINDOW_USAGE.label"),
        sublabel: t("cards.ROLLING_WINDOW_USAGE.sublabel", {
          windowDays: card.params.windowDays,
        }),
      };
    case CardKind.ALLOWANCE_REMAINING:
      return {
        label: t("cards.ALLOWANCE_REMAINING.label"),
        sublabel: t("cards.ALLOWANCE_REMAINING.sublabel", {
          remaining: card.params.remaining,
        }),
      };
    case CardKind.ENTRIES_REMAINING:
      return {
        label: t("cards.ENTRIES_REMAINING.label"),
        sublabel: t("cards.ENTRIES_REMAINING.sublabel", {
          remainingEntries: card.params.remainingEntries,
          maxEntries: card.params.maxEntries,
        }),
      };
    case CardKind.NEXT_EXPIRY:
      return {
        label: t("cards.NEXT_EXPIRY.label"),
        sublabel: t("cards.NEXT_EXPIRY.sublabel", {
          daysUntilExpiry: card.params.daysUntilExpiry,
        }),
      };
    case CardKind.NEXT_TRIP:
      return {
        label: t("cards.NEXT_TRIP.label"),
        sublabel: t("cards.NEXT_TRIP.sublabel", {
          daysUntilStart: card.params.daysUntilStart,
        }),
      };
  }
};
