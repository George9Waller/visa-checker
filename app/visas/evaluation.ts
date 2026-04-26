import { Trip, Visa } from "../../generated/prisma/client";

export const AlertKind = {
  VISA_OVER_LIMIT_NOW: "VISA_OVER_LIMIT_NOW",
  VISA_EXPIRED: "VISA_EXPIRED",
  VISA_WILL_EXCEED_ON_PLANNED_TRIP: "VISA_WILL_EXCEED_ON_PLANNED_TRIP",
  VISA_EXPIRES_DURING_TRIP: "VISA_EXPIRES_DURING_TRIP",
  VISA_NOT_YET_VALID_FOR_TRIP: "VISA_NOT_YET_VALID_FOR_TRIP",
  VISA_MUST_LEAVE_BEFORE_EXPIRY_BREACH: "VISA_MUST_LEAVE_BEFORE_EXPIRY_BREACH",
  TRIP_NO_VISA_LINKED: "TRIP_NO_VISA_LINKED",
  TRIP_VISA_EXPIRED: "TRIP_VISA_EXPIRED",
  TRIP_COUNTRY_NOT_COVERED: "TRIP_COUNTRY_NOT_COVERED",
  TRIP_EXCEEDS_SINGLE_TRIP_LIMIT: "TRIP_EXCEEDS_SINGLE_TRIP_LIMIT",
  TRIP_EXCEEDS_TOTAL_ALLOWANCE: "TRIP_EXCEEDS_TOTAL_ALLOWANCE",
  TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT: "TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT",
  TRIP_EXCEEDS_ENTRY_LIMIT: "TRIP_EXCEEDS_ENTRY_LIMIT",
  VISA_EXPIRING_SOON: "VISA_EXPIRING_SOON",
  VISA_EXPIRING_WITH_UPCOMING_TRIPS: "VISA_EXPIRING_WITH_UPCOMING_TRIPS",
  VISA_APPROACHING_ALLOWANCE: "VISA_APPROACHING_ALLOWANCE",
  VISA_LAST_ENTRY_CONSUMED: "VISA_LAST_ENTRY_CONSUMED",
  ROLLING_WINDOW_RESETS_SOON: "ROLLING_WINDOW_RESETS_SOON",
  VISA_VALID_SOON: "VISA_VALID_SOON",
  LONG_GAP_SINCE_LAST_TRIP: "LONG_GAP_SINCE_LAST_TRIP",
} as const;

export const AlertSeverity = {
  DANGER: "danger",
  WARN: "warn",
  INFO: "info",
} as const;

export const AlertSubjectType = {
  VISA: "visa",
  TRIP: "trip",
} as const;

export const TripIssueKind = {
  TRIP_NO_VISA_LINKED: "TRIP_NO_VISA_LINKED",
  TRIP_VISA_EXPIRED: "TRIP_VISA_EXPIRED",
  TRIP_VISA_WILL_BE_EXPIRED: "TRIP_VISA_WILL_BE_EXPIRED",
  TRIP_VISA_NOT_YET_VALID: "TRIP_VISA_NOT_YET_VALID",
  TRIP_COUNTRY_NOT_COVERED: "TRIP_COUNTRY_NOT_COVERED",
  TRIP_EXCEEDS_SINGLE_TRIP_LIMIT: "TRIP_EXCEEDS_SINGLE_TRIP_LIMIT",
  TRIP_EXCEEDS_TOTAL_ALLOWANCE: "TRIP_EXCEEDS_TOTAL_ALLOWANCE",
  TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT: "TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT",
  TRIP_EXCEEDS_ENTRY_LIMIT: "TRIP_EXCEEDS_ENTRY_LIMIT",
  TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH: "TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH",
} as const;

export const VisaIssueKind = {
  VISA_NOT_YET_VALID: "VISA_NOT_YET_VALID",
  VISA_EXPIRED: "VISA_EXPIRED",
  VISA_OVER_LIMIT: "VISA_OVER_LIMIT",
} as const;

export const AggregateRuleKind = {
  MAX_TRIPS: "MAX_TRIPS",
  TOTAL_ALLOWANCE: "TOTAL_ALLOWANCE",
  ROLLING_WINDOW: "ROLLING_WINDOW",
} as const;

export const TripRuleKind = {
  COUNTRY: "COUNTRY",
  VALID_FROM: "VALID_FROM",
  EXPIRY: "EXPIRY",
  SINGLE_TRIP_LIMIT: "SINGLE_TRIP_LIMIT",
  MUST_EXIT_BEFORE_EXPIRY: "MUST_EXIT_BEFORE_EXPIRY",
} as const;

export const CardKind = {
  CURRENTLY_TRAVELING: "CURRENTLY_TRAVELING",
  NEXT_TRIP: "NEXT_TRIP",
  ROLLING_WINDOW_USAGE: "ROLLING_WINDOW_USAGE",
  ALLOWANCE_REMAINING: "ALLOWANCE_REMAINING",
  ENTRIES_REMAINING: "ENTRIES_REMAINING",
  NEXT_EXPIRY: "NEXT_EXPIRY",
} as const;

export const InfoKind = {
  ROLLING_WINDOW_RESETS_SOON: "ROLLING_WINDOW_RESETS_SOON",
  VISA_VALID_SOON: "VISA_VALID_SOON",
  LONG_GAP_SINCE_LAST_TRIP: "LONG_GAP_SINCE_LAST_TRIP",
} as const;

export type AlertKind = (typeof AlertKind)[keyof typeof AlertKind];
export type AlertSeverity = (typeof AlertSeverity)[keyof typeof AlertSeverity];
export type AlertSubjectType =
  (typeof AlertSubjectType)[keyof typeof AlertSubjectType];
export type TripIssueKind = (typeof TripIssueKind)[keyof typeof TripIssueKind];
export type VisaIssueKind = (typeof VisaIssueKind)[keyof typeof VisaIssueKind];
export type AggregateRuleKind =
  (typeof AggregateRuleKind)[keyof typeof AggregateRuleKind];
export type TripRuleKind = (typeof TripRuleKind)[keyof typeof TripRuleKind];
export type CardKind = (typeof CardKind)[keyof typeof CardKind];
export type InfoKind = (typeof InfoKind)[keyof typeof InfoKind];

export type EvaluationTrip = Pick<
  Trip,
  | "id"
  | "startDate"
  | "endDate"
  | "name"
  | "countryCode"
  | "colour"
  | "visaRequired"
> & {
  linkedVisaId?: string | null;
};

export type EvaluationVisa = Pick<
  Visa,
  | "id"
  | "name"
  | "type"
  | "validFrom"
  | "expires"
  | "countries"
  | "maxNumTrips"
  | "tripMaxLen"
  | "totalMaxLen"
  | "rollingPeriodLen"
  | "mustExitBeforeExpiry"
  | "includeEntryAndExitDates"
  | "visaNumber"
> & {
  linkedTrips: EvaluationTrip[];
};

export type StructuredIssue = {
  kind: TripIssueKind | VisaIssueKind;
  severity: AlertSeverity;
  visaId?: string;
  tripId?: string;
  effectiveDate?: string;
  params?: Record<string, string | number | boolean | null>;
  ruleKinds?: Array<TripRuleKind | AggregateRuleKind>;
  projected: boolean;
};

export type UsageSnapshot = {
  ruleKind: AggregateRuleKind;
  limit: number;
  used: number;
  remaining: number;
  utilization: number;
  relevantTripIds: string[];
  windowStart?: string;
};

export type TripEvaluationResult = {
  trip: EvaluationTrip;
  linkedVisaId?: string | null;
  status: "valid" | "invalid";
  issueKinds: TripIssueKind[];
  issues: StructuredIssue[];
  projected: boolean;
};

export type StructuredAlert = {
  kind: AlertKind;
  severity: AlertSeverity;
  subjectType: AlertSubjectType;
  visaId?: string;
  tripId?: string;
  effectiveDate?: string;
  fingerprint: string;
  params: Record<string, string | number | boolean | null>;
  rankingScore: number;
};

export type DashboardCard = {
  kind: CardKind;
  tone: "danger" | "warn" | "ok" | "muted";
  visaId?: string;
  visaName?: string;
  tripId?: string;
  rankingScore: number;
  params: Record<string, string | number | boolean | null | ProjectionPoint[]>;
};

export type ProjectionPoint = {
  date: string;
  usedDays: number;
  remainingDays: number;
  limit: number;
  inDangerZone: boolean;
  triggeredTripIds?: string[];
};

export type RollingWindowProjection = {
  visaId: string;
  points: ProjectionPoint[];
  nextResetDate?: string;
  minimumRemaining: number;
  minimumRemainingDate: string;
  firstProjectedBreachDate?: string;
};

export type VisaEvaluationResult = {
  visa: EvaluationVisa;
  status: "valid" | "invalid";
  issues: StructuredIssue[];
  tripEvaluations: TripEvaluationResult[];
  usageSnapshots: UsageSnapshot[];
  alerts: StructuredAlert[];
  infoKinds: InfoKind[];
  projection?: RollingWindowProjection;
};

export type PortfolioEvaluationResult = {
  visas: VisaEvaluationResult[];
  tripEvaluations: TripEvaluationResult[];
  alerts: StructuredAlert[];
  dashboardCards: DashboardCard[];
  projections: RollingWindowProjection[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

export const startOfUtcDay = (date: Date) => {
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  return result;
};

const addDays = (date: Date, days: number) =>
  new Date(startOfUtcDay(date).getTime() + days * DAY_MS);

const isoDate = (date: Date) => startOfUtcDay(date).toISOString().split("T")[0];

const diffDays = (
  start: Date,
  end: Date,
  includeEntryAndExitDates: boolean
) => {
  const startDay = startOfUtcDay(start);
  const endDay = startOfUtcDay(end);
  const count = Math.abs(
    Math.floor((endDay.getTime() - startDay.getTime()) / DAY_MS)
  );
  return includeEntryAndExitDates ? count + 1 : count;
};

const overlapDays = (
  start: Date,
  end: Date,
  rangeStart: Date,
  rangeEnd: Date,
  includeEntryAndExitDates: boolean
) => {
  const overlapStart = new Date(
    Math.max(
      startOfUtcDay(start).getTime(),
      startOfUtcDay(rangeStart).getTime()
    )
  );
  const overlapEnd = new Date(
    Math.min(startOfUtcDay(end).getTime(), startOfUtcDay(rangeEnd).getTime())
  );

  if (overlapEnd.getTime() < overlapStart.getTime()) {
    return 0;
  }

  return diffDays(overlapStart, overlapEnd, includeEntryAndExitDates);
};

const makeFingerprint = ({
  kind,
  visaId,
  tripId,
  effectiveDate,
}: {
  kind: string;
  visaId?: string;
  tripId?: string;
  effectiveDate?: string;
}) => `${kind}:${visaId ?? "-"}:${tripId ?? "-"}:${effectiveDate ?? "-"}`;

const sortTrips = (trips: EvaluationTrip[]) =>
  [...trips].sort(
    (a, b) =>
      startOfUtcDay(a.startDate).getTime() -
      startOfUtcDay(b.startDate).getTime()
  );

type AggregateAssessment = {
  issueKinds: TripIssueKind[];
  issues: StructuredIssue[];
  snapshots: UsageSnapshot[];
};

const assessAggregateRulesForDate = (
  visa: EvaluationVisa,
  date: Date,
  candidateTripId?: string
): AggregateAssessment => {
  const individuallyValidTrips = visa.linkedTrips.filter(
    (trip) => assessTripRuleIssues(visa, trip, date).length === 0
  );
  const evaluationDate = startOfUtcDay(date);
  const rollingCutoff = visa.rollingPeriodLen
    ? addDays(evaluationDate, -visa.rollingPeriodLen)
    : undefined;
  const relevantTrips = individuallyValidTrips.filter((trip) => {
    if (startOfUtcDay(trip.startDate).getTime() > evaluationDate.getTime()) {
      return false;
    }

    if (rollingCutoff) {
      return startOfUtcDay(trip.endDate).getTime() >= rollingCutoff.getTime();
    }

    return true;
  });

  const issueKinds: TripIssueKind[] = [];
  const issues: StructuredIssue[] = [];
  const snapshots: UsageSnapshot[] = [];

  if (visa.maxNumTrips) {
    const used = relevantTrips.length;
    const remaining = visa.maxNumTrips - used;
    snapshots.push({
      ruleKind: AggregateRuleKind.MAX_TRIPS,
      limit: visa.maxNumTrips,
      used,
      remaining,
      utilization: used / visa.maxNumTrips,
      relevantTripIds: relevantTrips.map((trip) => trip.id),
    });
    if (used > visa.maxNumTrips) {
      issueKinds.push(TripIssueKind.TRIP_EXCEEDS_ENTRY_LIMIT);
      issues.push({
        kind: TripIssueKind.TRIP_EXCEEDS_ENTRY_LIMIT,
        severity: AlertSeverity.DANGER,
        visaId: visa.id,
        tripId: candidateTripId,
        effectiveDate: isoDate(evaluationDate),
        params: { used, limit: visa.maxNumTrips, remaining },
        ruleKinds: [AggregateRuleKind.MAX_TRIPS],
        projected:
          evaluationDate.getTime() > startOfUtcDay(new Date()).getTime(),
      });
    }
  }

  if (visa.totalMaxLen) {
    const used = relevantTrips.reduce((sum, trip) => {
      const windowStart = rollingCutoff ?? trip.startDate;
      return (
        sum +
        overlapDays(
          trip.startDate,
          trip.endDate,
          windowStart,
          evaluationDate,
          Boolean(visa.includeEntryAndExitDates)
        )
      );
    }, 0);
    const remaining = visa.totalMaxLen - used;
    const ruleKind = visa.rollingPeriodLen
      ? AggregateRuleKind.ROLLING_WINDOW
      : AggregateRuleKind.TOTAL_ALLOWANCE;
    snapshots.push({
      ruleKind,
      limit: visa.totalMaxLen,
      used,
      remaining,
      utilization: used / visa.totalMaxLen,
      relevantTripIds: relevantTrips.map((trip) => trip.id),
      windowStart: rollingCutoff ? isoDate(rollingCutoff) : undefined,
    });
    if (used > visa.totalMaxLen) {
      const kind = visa.rollingPeriodLen
        ? TripIssueKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT
        : TripIssueKind.TRIP_EXCEEDS_TOTAL_ALLOWANCE;
      issueKinds.push(kind);
      issues.push({
        kind,
        severity: AlertSeverity.DANGER,
        visaId: visa.id,
        tripId: candidateTripId,
        effectiveDate: isoDate(evaluationDate),
        params: { used, limit: visa.totalMaxLen, remaining },
        ruleKinds: [ruleKind],
        projected:
          evaluationDate.getTime() > startOfUtcDay(new Date()).getTime(),
      });
    }
  }

  return { issueKinds, issues, snapshots };
};

const assessTripRuleIssues = (
  visa: EvaluationVisa,
  trip: EvaluationTrip,
  evaluationDate: Date
) => {
  const issues: StructuredIssue[] = [];
  const projected =
    startOfUtcDay(trip.endDate).getTime() >
    startOfUtcDay(evaluationDate).getTime();
  const tripLength = diffDays(
    trip.startDate,
    trip.endDate,
    Boolean(visa.includeEntryAndExitDates)
  );

  if (!visa.countries.includes(trip.countryCode)) {
    issues.push({
      kind: TripIssueKind.TRIP_COUNTRY_NOT_COVERED,
      severity: AlertSeverity.DANGER,
      visaId: visa.id,
      tripId: trip.id,
      effectiveDate: isoDate(trip.startDate),
      params: {
        countryCode: trip.countryCode,
        tripName: trip.name ?? null,
        visaName: visa.name,
      },
      ruleKinds: [TripRuleKind.COUNTRY],
      projected,
    });
  }

  if (
    startOfUtcDay(trip.startDate).getTime() <
    startOfUtcDay(visa.validFrom).getTime()
  ) {
    issues.push({
      kind: TripIssueKind.TRIP_VISA_NOT_YET_VALID,
      severity: AlertSeverity.DANGER,
      visaId: visa.id,
      tripId: trip.id,
      effectiveDate: isoDate(trip.startDate),
      params: {
        validFrom: isoDate(visa.validFrom),
        tripName: trip.name ?? null,
        visaName: visa.name,
      },
      ruleKinds: [TripRuleKind.VALID_FROM],
      projected,
    });
  }

  if (
    visa.expires &&
    startOfUtcDay(visa.expires).getTime() <
      startOfUtcDay(trip.startDate).getTime()
  ) {
    issues.push({
      kind: TripIssueKind.TRIP_VISA_EXPIRED,
      severity: AlertSeverity.DANGER,
      visaId: visa.id,
      tripId: trip.id,
      effectiveDate: isoDate(visa.expires),
      params: {
        expires: isoDate(visa.expires),
        tripName: trip.name ?? null,
        visaName: visa.name,
      },
      ruleKinds: [TripRuleKind.EXPIRY],
      projected,
    });
  }

  if (
    visa.expires &&
    startOfUtcDay(visa.expires).getTime() >=
      startOfUtcDay(trip.startDate).getTime() &&
    startOfUtcDay(visa.expires).getTime() <
      startOfUtcDay(trip.endDate).getTime()
  ) {
    issues.push({
      kind: TripIssueKind.TRIP_VISA_WILL_BE_EXPIRED,
      severity: AlertSeverity.DANGER,
      visaId: visa.id,
      tripId: trip.id,
      effectiveDate: isoDate(visa.expires),
      params: {
        expires: isoDate(visa.expires),
        tripName: trip.name ?? null,
        visaName: visa.name,
      },
      ruleKinds: [TripRuleKind.EXPIRY],
      projected,
    });
  }

  if (visa.tripMaxLen && tripLength >= visa.tripMaxLen) {
    issues.push({
      kind: TripIssueKind.TRIP_EXCEEDS_SINGLE_TRIP_LIMIT,
      severity: AlertSeverity.DANGER,
      visaId: visa.id,
      tripId: trip.id,
      effectiveDate: isoDate(trip.endDate),
      params: {
        tripLength,
        limit: visa.tripMaxLen,
        tripName: trip.name ?? null,
        visaName: visa.name,
      },
      ruleKinds: [TripRuleKind.SINGLE_TRIP_LIMIT],
      projected,
    });
  }

  if (
    visa.mustExitBeforeExpiry &&
    visa.expires &&
    startOfUtcDay(trip.endDate).getTime() >
      startOfUtcDay(visa.expires).getTime()
  ) {
    issues.push({
      kind: TripIssueKind.TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH,
      severity: AlertSeverity.DANGER,
      visaId: visa.id,
      tripId: trip.id,
      effectiveDate: isoDate(visa.expires),
      params: {
        expires: isoDate(visa.expires),
        tripEndDate: isoDate(trip.endDate),
        tripName: trip.name ?? null,
        visaName: visa.name,
      },
      ruleKinds: [TripRuleKind.MUST_EXIT_BEFORE_EXPIRY],
      projected,
    });
  }

  return issues;
};

const buildTripEvaluation = (
  trip: EvaluationTrip,
  visasById: Map<string, EvaluationVisa>,
  referenceDate: Date
): TripEvaluationResult => {
  if (trip.visaRequired && !trip.linkedVisaId) {
    return {
      trip,
      linkedVisaId: null,
      status: "invalid",
      issueKinds: [TripIssueKind.TRIP_NO_VISA_LINKED],
      issues: [
        {
          kind: TripIssueKind.TRIP_NO_VISA_LINKED,
          severity: AlertSeverity.DANGER,
          tripId: trip.id,
          effectiveDate: isoDate(trip.startDate),
          params: {},
          projected:
            startOfUtcDay(trip.startDate).getTime() >
            startOfUtcDay(referenceDate).getTime(),
        },
      ],
      projected:
        startOfUtcDay(trip.endDate).getTime() >
        startOfUtcDay(referenceDate).getTime(),
    };
  }

  const visa = trip.linkedVisaId ? visasById.get(trip.linkedVisaId) : undefined;

  if (!visa) {
    return {
      trip,
      linkedVisaId: trip.linkedVisaId ?? null,
      status: "valid",
      issueKinds: [],
      issues: [],
      projected:
        startOfUtcDay(trip.endDate).getTime() >
        startOfUtcDay(referenceDate).getTime(),
    };
  }

  const evaluationDate = startOfUtcDay(trip.endDate);
  const issues = [
    ...assessTripRuleIssues(visa, trip, referenceDate),
    ...assessAggregateRulesForDate(visa, evaluationDate, trip.id).issues.map(
      (issue) => ({
        ...issue,
        params: {
          ...issue.params,
          tripName: trip.name ?? null,
          visaName: visa.name,
        },
      })
    ),
  ];

  return {
    trip,
    linkedVisaId: visa.id,
    status: issues.length === 0 ? "valid" : "invalid",
    issueKinds: issues.map((issue) => issue.kind as TripIssueKind),
    issues,
    projected:
      startOfUtcDay(trip.endDate).getTime() >
      startOfUtcDay(referenceDate).getTime(),
  };
};

const buildProjection = (
  visa: EvaluationVisa,
  referenceDate: Date,
  projectionEndDate: Date
): RollingWindowProjection | undefined => {
  if (!visa.rollingPeriodLen || !visa.totalMaxLen) {
    return undefined;
  }

  const points: ProjectionPoint[] = [];
  const sortedTrips = sortTrips(visa.linkedTrips);
  let nextResetDate: string | undefined;
  let minimumRemaining = Number.POSITIVE_INFINITY;
  let minimumRemainingDate = isoDate(referenceDate);
  let firstProjectedBreachDate: string | undefined;
  let previousUsed: number | undefined;

  for (
    let cursor = startOfUtcDay(referenceDate);
    cursor.getTime() <= startOfUtcDay(projectionEndDate).getTime();
    cursor = addDays(cursor, 1)
  ) {
    const windowStart = addDays(cursor, -visa.rollingPeriodLen);
    const activeTrips = sortedTrips.filter(
      (trip) => startOfUtcDay(trip.startDate).getTime() <= cursor.getTime()
    );
    const usedDays = activeTrips.reduce(
      (sum, trip) =>
        sum +
        overlapDays(
          trip.startDate,
          trip.endDate,
          windowStart,
          cursor,
          Boolean(visa.includeEntryAndExitDates)
        ),
      0
    );
    const remainingDays = visa.totalMaxLen - usedDays;

    if (
      previousUsed !== undefined &&
      usedDays < previousUsed &&
      !nextResetDate
    ) {
      nextResetDate = isoDate(cursor);
    }
    previousUsed = usedDays;

    if (remainingDays < minimumRemaining) {
      minimumRemaining = remainingDays;
      minimumRemainingDate = isoDate(cursor);
    }
    if (remainingDays < 0 && !firstProjectedBreachDate) {
      firstProjectedBreachDate = isoDate(cursor);
    }

    points.push({
      date: isoDate(cursor),
      usedDays,
      remainingDays,
      limit: visa.totalMaxLen,
      inDangerZone: remainingDays < 15,
      triggeredTripIds: activeTrips
        .filter(
          (trip) =>
            startOfUtcDay(trip.endDate).getTime() >= windowStart.getTime()
        )
        .map((trip) => trip.id),
    });
  }

  return {
    visaId: visa.id,
    points,
    nextResetDate,
    minimumRemaining,
    minimumRemainingDate,
    firstProjectedBreachDate,
  };
};

const buildVisaAlerts = (
  visa: EvaluationVisa,
  tripEvaluations: TripEvaluationResult[],
  referenceDate: Date,
  projection?: RollingWindowProjection
) => {
  const alerts: StructuredAlert[] = [];
  const today = startOfUtcDay(referenceDate);
  const linkedTripEvaluations = tripEvaluations.filter(
    (tripEvaluation) => tripEvaluation.linkedVisaId === visa.id
  );
  const upcomingTrips = linkedTripEvaluations.filter(
    (tripEvaluation) =>
      startOfUtcDay(tripEvaluation.trip.endDate).getTime() >= today.getTime()
  );

  const currentAggregate = assessAggregateRulesForDate(visa, today);
  const aggregateSnapshot = currentAggregate.snapshots.find(
    (snapshot) =>
      snapshot.ruleKind === AggregateRuleKind.ROLLING_WINDOW ||
      snapshot.ruleKind === AggregateRuleKind.TOTAL_ALLOWANCE
  );
  const entrySnapshot = currentAggregate.snapshots.find(
    (snapshot) => snapshot.ruleKind === AggregateRuleKind.MAX_TRIPS
  );

  const relevant =
    upcomingTrips.length > 0 || !visa.expires || visa.expires >= today;
  if (!relevant) {
    return alerts;
  }

  // Future dismissal persistence and renewal-linked suppression should hook in here
  // once fingerprints can be matched against dismissed alerts and predecessor/successor visas.
  if (
    currentAggregate.issueKinds.includes(
      TripIssueKind.TRIP_EXCEEDS_TOTAL_ALLOWANCE
    ) ||
    currentAggregate.issueKinds.includes(
      TripIssueKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT
    ) ||
    currentAggregate.issueKinds.includes(TripIssueKind.TRIP_EXCEEDS_ENTRY_LIMIT)
  ) {
    alerts.push({
      kind: AlertKind.VISA_OVER_LIMIT_NOW,
      severity: AlertSeverity.DANGER,
      subjectType: AlertSubjectType.VISA,
      visaId: visa.id,
      effectiveDate: isoDate(today),
      fingerprint: makeFingerprint({
        kind: AlertKind.VISA_OVER_LIMIT_NOW,
        visaId: visa.id,
        effectiveDate: isoDate(today),
      }),
      params: {
        used: aggregateSnapshot?.used ?? entrySnapshot?.used ?? 0,
        limit: aggregateSnapshot?.limit ?? entrySnapshot?.limit ?? 0,
        visaName: visa.name,
      },
      rankingScore: 900,
    });
  }

  if (visa.expires && startOfUtcDay(visa.expires).getTime() < today.getTime()) {
    alerts.push({
      kind: AlertKind.VISA_EXPIRED,
      severity: AlertSeverity.DANGER,
      subjectType: AlertSubjectType.VISA,
      visaId: visa.id,
      effectiveDate: isoDate(visa.expires),
      fingerprint: makeFingerprint({
        kind: AlertKind.VISA_EXPIRED,
        visaId: visa.id,
        effectiveDate: isoDate(visa.expires),
      }),
      params: { expires: isoDate(visa.expires), visaName: visa.name },
      rankingScore: 890,
    });
  }

  for (const tripEvaluation of upcomingTrips) {
    if (
      tripEvaluation.issueKinds.includes(
        TripIssueKind.TRIP_EXCEEDS_TOTAL_ALLOWANCE
      ) ||
      tripEvaluation.issueKinds.includes(
        TripIssueKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT
      ) ||
      tripEvaluation.issueKinds.includes(TripIssueKind.TRIP_EXCEEDS_ENTRY_LIMIT)
    ) {
      alerts.push({
        kind: AlertKind.VISA_WILL_EXCEED_ON_PLANNED_TRIP,
        severity: AlertSeverity.DANGER,
        subjectType: AlertSubjectType.VISA,
        visaId: visa.id,
        tripId: tripEvaluation.trip.id,
        effectiveDate: isoDate(tripEvaluation.trip.endDate),
        fingerprint: makeFingerprint({
          kind: AlertKind.VISA_WILL_EXCEED_ON_PLANNED_TRIP,
          visaId: visa.id,
          tripId: tripEvaluation.trip.id,
          effectiveDate: isoDate(tripEvaluation.trip.endDate),
        }),
        params: {
          tripStartDate: isoDate(tripEvaluation.trip.startDate),
          tripName: tripEvaluation.trip.name ?? null,
          visaName: visa.name,
        },
        rankingScore: 880,
      });
    }

    if (
      tripEvaluation.issueKinds.includes(
        TripIssueKind.TRIP_VISA_WILL_BE_EXPIRED
      )
    ) {
      alerts.push({
        kind: AlertKind.VISA_EXPIRES_DURING_TRIP,
        severity: AlertSeverity.DANGER,
        subjectType: AlertSubjectType.VISA,
        visaId: visa.id,
        tripId: tripEvaluation.trip.id,
        effectiveDate: visa.expires
          ? isoDate(visa.expires)
          : isoDate(tripEvaluation.trip.endDate),
        fingerprint: makeFingerprint({
          kind: AlertKind.VISA_EXPIRES_DURING_TRIP,
          visaId: visa.id,
          tripId: tripEvaluation.trip.id,
          effectiveDate: visa.expires
            ? isoDate(visa.expires)
            : isoDate(tripEvaluation.trip.endDate),
        }),
        params: {
          tripEndDate: isoDate(tripEvaluation.trip.endDate),
          expires: visa.expires ? isoDate(visa.expires) : null,
          tripName: tripEvaluation.trip.name ?? null,
          visaName: visa.name,
        },
        rankingScore: 870,
      });
    }

    if (
      tripEvaluation.issueKinds.includes(TripIssueKind.TRIP_VISA_NOT_YET_VALID)
    ) {
      alerts.push({
        kind: AlertKind.VISA_NOT_YET_VALID_FOR_TRIP,
        severity: AlertSeverity.DANGER,
        subjectType: AlertSubjectType.VISA,
        visaId: visa.id,
        tripId: tripEvaluation.trip.id,
        effectiveDate: isoDate(tripEvaluation.trip.startDate),
        fingerprint: makeFingerprint({
          kind: AlertKind.VISA_NOT_YET_VALID_FOR_TRIP,
          visaId: visa.id,
          tripId: tripEvaluation.trip.id,
          effectiveDate: isoDate(tripEvaluation.trip.startDate),
        }),
        params: {
          validFrom: isoDate(visa.validFrom),
          tripName: tripEvaluation.trip.name ?? null,
          visaName: visa.name,
        },
        rankingScore: 860,
      });
    }

    if (
      tripEvaluation.issueKinds.includes(
        TripIssueKind.TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH
      )
    ) {
      alerts.push({
        kind: AlertKind.VISA_MUST_LEAVE_BEFORE_EXPIRY_BREACH,
        severity: AlertSeverity.DANGER,
        subjectType: AlertSubjectType.VISA,
        visaId: visa.id,
        tripId: tripEvaluation.trip.id,
        effectiveDate: visa.expires
          ? isoDate(visa.expires)
          : isoDate(tripEvaluation.trip.endDate),
        fingerprint: makeFingerprint({
          kind: AlertKind.VISA_MUST_LEAVE_BEFORE_EXPIRY_BREACH,
          visaId: visa.id,
          tripId: tripEvaluation.trip.id,
          effectiveDate: visa.expires
            ? isoDate(visa.expires)
            : isoDate(tripEvaluation.trip.endDate),
        }),
        params: {
          tripEndDate: isoDate(tripEvaluation.trip.endDate),
          tripName: tripEvaluation.trip.name ?? null,
          visaName: visa.name,
        },
        rankingScore: 850,
      });
    }
  }

  if (visa.expires) {
    const daysUntilExpiry = diffDays(today, visa.expires, false);
    if (
      startOfUtcDay(visa.expires).getTime() > today.getTime() &&
      daysUntilExpiry <= 30
    ) {
      alerts.push({
        kind: AlertKind.VISA_EXPIRING_SOON,
        severity: AlertSeverity.WARN,
        subjectType: AlertSubjectType.VISA,
        visaId: visa.id,
        effectiveDate: isoDate(visa.expires),
        fingerprint: makeFingerprint({
          kind: AlertKind.VISA_EXPIRING_SOON,
          visaId: visa.id,
          effectiveDate: isoDate(visa.expires),
        }),
        params: { daysUntilExpiry, visaName: visa.name },
        rankingScore: 500,
      });
    } else if (
      startOfUtcDay(visa.expires).getTime() > today.getTime() &&
      daysUntilExpiry <= 90 &&
      upcomingTrips.length > 0
    ) {
      alerts.push({
        kind: AlertKind.VISA_EXPIRING_WITH_UPCOMING_TRIPS,
        severity: AlertSeverity.WARN,
        subjectType: AlertSubjectType.VISA,
        visaId: visa.id,
        effectiveDate: isoDate(visa.expires),
        fingerprint: makeFingerprint({
          kind: AlertKind.VISA_EXPIRING_WITH_UPCOMING_TRIPS,
          visaId: visa.id,
          effectiveDate: isoDate(visa.expires),
        }),
        params: {
          daysUntilExpiry,
          upcomingTripCount: upcomingTrips.length,
          visaName: visa.name,
        },
        rankingScore: 490,
      });
    }
  }

  if (aggregateSnapshot && aggregateSnapshot.utilization >= 0.8) {
    alerts.push({
      kind: AlertKind.VISA_APPROACHING_ALLOWANCE,
      severity: AlertSeverity.WARN,
      subjectType: AlertSubjectType.VISA,
      visaId: visa.id,
      effectiveDate: isoDate(today),
      fingerprint: makeFingerprint({
        kind: AlertKind.VISA_APPROACHING_ALLOWANCE,
        visaId: visa.id,
        effectiveDate: isoDate(today),
      }),
      params: {
        used: aggregateSnapshot.used,
        limit: aggregateSnapshot.limit,
        remaining: aggregateSnapshot.remaining,
        visaName: visa.name,
      },
      rankingScore: 480,
    });
  }

  if (
    visa.maxNumTrips &&
    entrySnapshot &&
    entrySnapshot.remaining === 0 &&
    upcomingTrips.some((tripEvaluation) =>
      tripEvaluation.issueKinds.includes(TripIssueKind.TRIP_EXCEEDS_ENTRY_LIMIT)
    )
  ) {
    alerts.push({
      kind: AlertKind.VISA_LAST_ENTRY_CONSUMED,
      severity: AlertSeverity.WARN,
      subjectType: AlertSubjectType.VISA,
      visaId: visa.id,
      effectiveDate: isoDate(today),
      fingerprint: makeFingerprint({
        kind: AlertKind.VISA_LAST_ENTRY_CONSUMED,
        visaId: visa.id,
        effectiveDate: isoDate(today),
      }),
      params: {
        remainingEntries: entrySnapshot.remaining,
        visaName: visa.name,
      },
      rankingScore: 470,
    });
  }

  if (
    projection?.nextResetDate &&
    diffDays(today, new Date(projection.nextResetDate), false) <= 14
  ) {
    alerts.push({
      kind: AlertKind.ROLLING_WINDOW_RESETS_SOON,
      severity: AlertSeverity.INFO,
      subjectType: AlertSubjectType.VISA,
      visaId: visa.id,
      effectiveDate: projection.nextResetDate,
      fingerprint: makeFingerprint({
        kind: AlertKind.ROLLING_WINDOW_RESETS_SOON,
        visaId: visa.id,
        effectiveDate: projection.nextResetDate,
      }),
      params: { nextResetDate: projection.nextResetDate, visaName: visa.name },
      rankingScore: 200,
    });
  }

  const daysUntilValid =
    startOfUtcDay(visa.validFrom).getTime() > today.getTime()
      ? diffDays(today, visa.validFrom, false)
      : undefined;
  if (daysUntilValid !== undefined && daysUntilValid <= 30) {
    alerts.push({
      kind: AlertKind.VISA_VALID_SOON,
      severity: AlertSeverity.INFO,
      subjectType: AlertSubjectType.VISA,
      visaId: visa.id,
      effectiveDate: isoDate(visa.validFrom),
      fingerprint: makeFingerprint({
        kind: AlertKind.VISA_VALID_SOON,
        visaId: visa.id,
        effectiveDate: isoDate(visa.validFrom),
      }),
      params: { daysUntilValid, visaName: visa.name },
      rankingScore: 190,
    });
  }

  if (
    visa.rollingPeriodLen &&
    visa.linkedTrips.length > 0 &&
    upcomingTrips.length === 0
  ) {
    const lastTrip = sortTrips(visa.linkedTrips).at(-1);
    if (lastTrip) {
      const gap = diffDays(lastTrip.endDate, today, false);
      if (gap >= 90) {
        alerts.push({
          kind: AlertKind.LONG_GAP_SINCE_LAST_TRIP,
          severity: AlertSeverity.INFO,
          subjectType: AlertSubjectType.VISA,
          visaId: visa.id,
          effectiveDate: isoDate(today),
          fingerprint: makeFingerprint({
            kind: AlertKind.LONG_GAP_SINCE_LAST_TRIP,
            visaId: visa.id,
            effectiveDate: isoDate(today),
          }),
          params: { gapDays: gap, visaName: visa.name },
          rankingScore: 180,
        });
      }
    }
  }

  return alerts;
};

const buildDashboardCards = (
  trips: TripEvaluationResult[],
  visas: VisaEvaluationResult[],
  referenceDate: Date
) => {
  const cards: DashboardCard[] = [];
  const today = startOfUtcDay(referenceDate);

  const currentTrip = trips.find(
    (trip) =>
      startOfUtcDay(trip.trip.startDate).getTime() <= today.getTime() &&
      startOfUtcDay(trip.trip.endDate).getTime() >= today.getTime()
  );
  if (currentTrip) {
    cards.push({
      kind: CardKind.CURRENTLY_TRAVELING,
      tone: currentTrip.status === "invalid" ? "danger" : "ok",
      tripId: currentTrip.trip.id,
      visaId: currentTrip.linkedVisaId ?? undefined,
      rankingScore: 1000,
      params: {
        countryCode: currentTrip.trip.countryCode,
        tripName: currentTrip.trip.name,
      },
    });
  }

  const nextTrip = sortTrips(trips.map((trip) => trip.trip))
    .map(
      (trip) =>
        trips.find((tripEvaluation) => tripEvaluation.trip.id === trip.id)!
    )
    .find(
      (trip) => startOfUtcDay(trip.trip.startDate).getTime() > today.getTime()
    );
  if (nextTrip) {
    const daysUntilStart = diffDays(today, nextTrip.trip.startDate, false);
    cards.push({
      kind: CardKind.NEXT_TRIP,
      tone: nextTrip.status === "invalid" ? "warn" : "ok",
      tripId: nextTrip.trip.id,
      visaId: nextTrip.linkedVisaId ?? undefined,
      rankingScore: nextTrip.status === "invalid" ? 750 : 400,
      params: {
        tripName: nextTrip.trip.name,
        countryCode: nextTrip.trip.countryCode,
        daysUntilStart,
        statusSummary: nextTrip.status,
        startDate: isoDate(nextTrip.trip.startDate),
        endDate: isoDate(nextTrip.trip.endDate),
        durationDays: diffDays(
          nextTrip.trip.startDate,
          nextTrip.trip.endDate,
          true
        ),
      },
    });
  }

  const highestRolling = visas
    .flatMap((visa) =>
      visa.usageSnapshots
        .filter(
          (snapshot) => snapshot.ruleKind === AggregateRuleKind.ROLLING_WINDOW
        )
        .map((snapshot) => ({ visa, snapshot }))
    )
    .sort((a, b) => b.snapshot.utilization - a.snapshot.utilization)[0];
  if (highestRolling) {
    cards.push({
      kind: CardKind.ROLLING_WINDOW_USAGE,
      tone:
        highestRolling.snapshot.remaining < 0
          ? "danger"
          : highestRolling.snapshot.utilization >= 0.8
            ? "warn"
            : "ok",
      visaId: highestRolling.visa.visa.id,
      visaName: highestRolling.visa.visa.name,
      rankingScore:
        highestRolling.snapshot.remaining < 0
          ? 800
          : highestRolling.snapshot.utilization >= 0.8
            ? 600
            : 350,
      params: {
        used: highestRolling.snapshot.used,
        limit: highestRolling.snapshot.limit,
        remaining: highestRolling.snapshot.remaining,
        resetDate: highestRolling.visa.projection?.nextResetDate ?? null,
        windowDays: highestRolling.visa.visa.rollingPeriodLen ?? null,
      },
    });
  }

  const totalAllowance = visas
    .flatMap((visa) =>
      visa.usageSnapshots
        .filter(
          (snapshot) => snapshot.ruleKind === AggregateRuleKind.TOTAL_ALLOWANCE
        )
        .map((snapshot) => ({ visa, snapshot }))
    )
    .sort((a, b) => b.snapshot.utilization - a.snapshot.utilization)[0];
  if (totalAllowance && totalAllowance.snapshot.utilization >= 0.4) {
    cards.push({
      kind: CardKind.ALLOWANCE_REMAINING,
      tone:
        totalAllowance.snapshot.remaining < 0
          ? "danger"
          : totalAllowance.snapshot.utilization >= 0.8
            ? "warn"
            : "ok",
      visaId: totalAllowance.visa.visa.id,
      rankingScore: totalAllowance.snapshot.utilization >= 0.8 ? 590 : 340,
      params: {
        used: totalAllowance.snapshot.used,
        remaining: totalAllowance.snapshot.remaining,
        limit: totalAllowance.snapshot.limit,
      },
    });
  }

  const entriesRemaining = visas
    .flatMap((visa) =>
      visa.usageSnapshots
        .filter((snapshot) => snapshot.ruleKind === AggregateRuleKind.MAX_TRIPS)
        .map((snapshot) => ({ visa, snapshot }))
    )
    .sort((a, b) => a.snapshot.remaining - b.snapshot.remaining)[0];
  if (
    entriesRemaining &&
    entriesRemaining.snapshot.used > 0 &&
    entriesRemaining.snapshot.remaining / entriesRemaining.snapshot.limit <= 0.5
  ) {
    cards.push({
      kind: CardKind.ENTRIES_REMAINING,
      tone: entriesRemaining.snapshot.remaining < 0 ? "danger" : "warn",
      visaId: entriesRemaining.visa.visa.id,
      rankingScore: entriesRemaining.snapshot.remaining < 0 ? 780 : 580,
      params: {
        usedEntries: entriesRemaining.snapshot.used,
        maxEntries: entriesRemaining.snapshot.limit,
        remainingEntries: entriesRemaining.snapshot.remaining,
      },
    });
  }

  const nextExpiry = visas
    .filter(
      (visa) =>
        visa.visa.expires &&
        startOfUtcDay(visa.visa.expires).getTime() >= today.getTime()
    )
    .sort(
      (a, b) =>
        startOfUtcDay(a.visa.expires!).getTime() -
        startOfUtcDay(b.visa.expires!).getTime()
    )[0];
  if (nextExpiry?.visa.expires) {
    const daysUntilExpiry = diffDays(today, nextExpiry.visa.expires, false);
    if (daysUntilExpiry <= 180) {
      cards.push({
        kind: CardKind.NEXT_EXPIRY,
        tone: daysUntilExpiry <= 30 ? "warn" : "muted",
        visaId: nextExpiry.visa.id,
        rankingScore: daysUntilExpiry <= 30 ? 570 : 330,
        params: {
          daysUntilExpiry,
          expiryDate: isoDate(nextExpiry.visa.expires),
        },
      });
    }
  }

  return cards.sort((a, b) => b.rankingScore - a.rankingScore);
};

const alertKindForTripIssue = (issueKind: TripIssueKind): AlertKind => {
  switch (issueKind) {
    case TripIssueKind.TRIP_NO_VISA_LINKED:
      return AlertKind.TRIP_NO_VISA_LINKED;
    case TripIssueKind.TRIP_VISA_EXPIRED:
    case TripIssueKind.TRIP_VISA_WILL_BE_EXPIRED:
      return AlertKind.TRIP_VISA_EXPIRED;
    case TripIssueKind.TRIP_COUNTRY_NOT_COVERED:
      return AlertKind.TRIP_COUNTRY_NOT_COVERED;
    case TripIssueKind.TRIP_EXCEEDS_SINGLE_TRIP_LIMIT:
      return AlertKind.TRIP_EXCEEDS_SINGLE_TRIP_LIMIT;
    case TripIssueKind.TRIP_EXCEEDS_TOTAL_ALLOWANCE:
      return AlertKind.TRIP_EXCEEDS_TOTAL_ALLOWANCE;
    case TripIssueKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT:
      return AlertKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT;
    case TripIssueKind.TRIP_EXCEEDS_ENTRY_LIMIT:
      return AlertKind.TRIP_EXCEEDS_ENTRY_LIMIT;
    default:
      return AlertKind.VISA_MUST_LEAVE_BEFORE_EXPIRY_BREACH;
  }
};

const tripIssueRankingScore = (issueKind: TripIssueKind) => {
  switch (issueKind) {
    case TripIssueKind.TRIP_NO_VISA_LINKED:
      return 875;
    case TripIssueKind.TRIP_VISA_EXPIRED:
    case TripIssueKind.TRIP_VISA_WILL_BE_EXPIRED:
      return 865;
    case TripIssueKind.TRIP_COUNTRY_NOT_COVERED:
      return 855;
    case TripIssueKind.TRIP_EXCEEDS_SINGLE_TRIP_LIMIT:
      return 845;
    case TripIssueKind.TRIP_EXCEEDS_TOTAL_ALLOWANCE:
    case TripIssueKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT:
      return 835;
    case TripIssueKind.TRIP_EXCEEDS_ENTRY_LIMIT:
      return 825;
    case TripIssueKind.TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH:
      return 815;
    default:
      return 300;
  }
};

export const evaluateVisaPortfolio = ({
  visas,
  trips,
  referenceDate,
  projectionEndDate,
}: {
  visas: EvaluationVisa[];
  trips: EvaluationTrip[];
  referenceDate: Date;
  projectionEndDate?: Date;
}): PortfolioEvaluationResult => {
  const today = startOfUtcDay(referenceDate);
  const endDate = projectionEndDate
    ? startOfUtcDay(projectionEndDate)
    : addDays(today, 364);
  const visasById = new Map(visas.map((visa) => [visa.id, visa]));

  const tripEvaluations = sortTrips(trips).map((trip) =>
    buildTripEvaluation(trip, visasById, today)
  );

  const visaEvaluations = visas.map((visa) => {
    const usageSnapshots = assessAggregateRulesForDate(visa, today).snapshots;
    const linkedTripEvaluations = tripEvaluations.filter(
      (tripEvaluation) => tripEvaluation.linkedVisaId === visa.id
    );
    const projection = buildProjection(visa, today, endDate);
    const alerts = buildVisaAlerts(visa, tripEvaluations, today, projection);
    const issueKinds = new Set<VisaIssueKind>();

    if (startOfUtcDay(visa.validFrom).getTime() > today.getTime()) {
      issueKinds.add(VisaIssueKind.VISA_NOT_YET_VALID);
    }
    if (
      visa.expires &&
      startOfUtcDay(visa.expires).getTime() < today.getTime()
    ) {
      issueKinds.add(VisaIssueKind.VISA_EXPIRED);
    }
    if (usageSnapshots.some((snapshot) => snapshot.remaining < 0)) {
      issueKinds.add(VisaIssueKind.VISA_OVER_LIMIT);
    }

    const issues: StructuredIssue[] = [...issueKinds].map((kind) => ({
      kind,
      severity:
        kind === VisaIssueKind.VISA_NOT_YET_VALID
          ? AlertSeverity.WARN
          : AlertSeverity.DANGER,
      visaId: visa.id,
      effectiveDate:
        kind === VisaIssueKind.VISA_NOT_YET_VALID
          ? isoDate(visa.validFrom)
          : visa.expires
            ? isoDate(visa.expires)
            : isoDate(today),
      params: {},
      projected: false,
    }));

    return {
      visa,
      status: (issues.length === 0 &&
      linkedTripEvaluations.every(
        (tripEvaluation) => tripEvaluation.status === "valid"
      )
        ? "valid"
        : "invalid") as "valid" | "invalid",
      issues,
      tripEvaluations: linkedTripEvaluations,
      usageSnapshots,
      alerts,
      infoKinds: alerts
        .filter((alert) => alert.severity === AlertSeverity.INFO)
        .map((alert) => alert.kind as InfoKind),
      projection,
    };
  });

  const tripAlerts = tripEvaluations.flatMap((tripEvaluation) =>
    tripEvaluation.issues.map((issue) => ({
      kind: alertKindForTripIssue(issue.kind as TripIssueKind),
      severity: issue.severity,
      subjectType: AlertSubjectType.TRIP,
      visaId: issue.visaId,
      tripId: issue.tripId,
      effectiveDate: issue.effectiveDate,
      fingerprint: makeFingerprint({
        kind: issue.kind,
        visaId: issue.visaId,
        tripId: issue.tripId,
        effectiveDate: issue.effectiveDate,
      }),
      params: issue.params ?? {},
      rankingScore: tripIssueRankingScore(issue.kind as TripIssueKind),
    }))
  );

  const alerts = [
    ...visaEvaluations.flatMap((visa) => visa.alerts),
    ...tripAlerts,
  ].sort((a, b) => b.rankingScore - a.rankingScore);

  return {
    visas: visaEvaluations,
    tripEvaluations,
    alerts,
    dashboardCards: buildDashboardCards(
      tripEvaluations,
      visaEvaluations,
      today
    ),
    projections: visaEvaluations
      .map((visa) => visa.projection)
      .filter((projection): projection is RollingWindowProjection =>
        Boolean(projection)
      ),
  };
};

export const evaluateSingleVisa = ({
  visa,
  trips,
  referenceDate,
  projectionEndDate,
}: {
  visa: EvaluationVisa;
  trips?: EvaluationTrip[];
  referenceDate: Date;
  projectionEndDate?: Date;
}) =>
  evaluateVisaPortfolio({
    visas: [visa],
    trips:
      trips ??
      visa.linkedTrips.map((trip) => ({
        ...trip,
        linkedVisaId: visa.id,
      })),
    referenceDate,
    projectionEndDate,
  }).visas[0];
