"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { prisma } from "../constants-server";
import { getDaysBetweenDates } from "../server-actions";
import { buildVisaChainGroups } from "./chains";
import {
  AggregateRuleKind,
  AlertSeverity,
  EvaluationVisa,
  TripIssueKind,
  evaluateSingleVisa,
} from "./evaluation";

export const getVisas = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication required");
  }

  const visas = await prisma.visa.findMany({
    where: {
      user_id: (session.user as any).id,
    },
    select: {
      id: true,
      name: true,
      countries: true,
      expires: true,
      type: true,
      visaNumber: true,
      validFrom: true,
      renewedFromId: true,
    },
    orderBy: [
      {
        expires: "desc",
      },
    ],
  });

  return buildVisaChainGroups(visas);
};

export const getVisa = async (id: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication required");
  }

  return await prisma.visa.findUnique({
    where: {
      user_id: (session.user as any).id,
      id,
    },
  });
};

export const getVisaDetailSummary = async (
  id: string,
  referenceDate = new Date()
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication required");
  }

  const visa = await prisma.visa.findUnique({
    where: {
      user_id: (session.user as any).id,
      id,
    },
    select: {
      id: true,
      name: true,
      type: true,
      validFrom: true,
      expires: true,
      visaNumber: true,
      documentNumber: true,
      countries: true,
      maxNumTrips: true,
      tripMaxLen: true,
      totalMaxLen: true,
      rollingPeriodLen: true,
      mustExitBeforeExpiry: true,
      includeEntryAndExitDates: true,
      renewedFromId: true,
      renewedFrom: {
        select: {
          id: true,
          name: true,
        },
      },
      renewals: {
        select: {
          id: true,
          name: true,
        },
      },
      VisaTrip: {
        select: {
          trip: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              name: true,
              colour: true,
              countryCode: true,
              visaRequired: true,
            },
          },
        },
        orderBy: [
          {
            trip: {
              startDate: "asc",
            },
          },
        ],
      },
    },
  });

  if (!visa) {
    return null;
  }

  const evaluation = evaluateSingleVisa({
    visa: {
      id: visa.id,
      name: visa.name,
      type: visa.type,
      validFrom: visa.validFrom,
      expires: visa.expires,
      visaNumber: visa.visaNumber,
      countries: visa.countries,
      maxNumTrips: visa.maxNumTrips,
      tripMaxLen: visa.tripMaxLen,
      totalMaxLen: visa.totalMaxLen,
      rollingPeriodLen: visa.rollingPeriodLen,
      mustExitBeforeExpiry: visa.mustExitBeforeExpiry,
      includeEntryAndExitDates: visa.includeEntryAndExitDates,
      renewalSuccessorId: visa.renewals[0]?.id ?? null,
      linkedTrips: visa.VisaTrip.map(({ trip }) => ({
        ...trip,
        linkedVisaId: visa.id,
      })),
    },
    referenceDate,
  });

  const rollingSnapshot = evaluation.usageSnapshots.find(
    (snapshot) => snapshot.ruleKind === AggregateRuleKind.ROLLING_WINDOW
  );

  return {
    visa,
    referenceDate,
    status: evaluation.status,
    alerts: evaluation.alerts,
    usageSnapshots: evaluation.usageSnapshots,
    tripEvaluations: evaluation.tripEvaluations,
    projection: evaluation.projection,
    rollingWindowTripIds: rollingSnapshot?.relevantTripIds ?? [],
    rollingLimit: rollingSnapshot?.limit,
    rollingUsed: rollingSnapshot?.used,
    rollingWindow: visa.rollingPeriodLen,
  };
};

export const createVisa = async (
  name: string,
  type: string,
  validFrom: string,
  countries: string[],
  maxNumTrips?: number,
  tripMaxLen?: number,
  totalMaxLen?: number,
  rollingPeriodLen?: number,
  expires?: string,
  mustExitBeforeExpiry?: boolean,
  includeEntryAndExitDates?: boolean,
  visaNumber?: string,
  documentNumber?: string,
  renewedFromId?: string
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication required");
  }

  const visa = await prisma.visa.create({
    data: {
      user_id: (session.user as any).id,
      name,
      type,
      validFrom: new Date(validFrom),
      expires: expires ? new Date(expires) : undefined,
      visaNumber,
      documentNumber,
      countries,
      maxNumTrips,
      tripMaxLen,
      totalMaxLen,
      rollingPeriodLen,
      mustExitBeforeExpiry,
      includeEntryAndExitDates,
      renewedFromId,
    },
  });

  return visa;
};

export const updateVisa = async (
  visaId: string,
  name: string,
  type: string,
  validFrom: string,
  countries: string[],
  maxNumTrips?: number,
  tripMaxLen?: number,
  totalMaxLen?: number,
  rollingPeriodLen?: number,
  expires?: string,
  mustExitBeforeExpiry?: boolean,
  includeEntryAndExitDates?: boolean,
  visaNumber?: string,
  documentNumber?: string
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication required");
  }

  await prisma.visa.update({
    where: {
      user_id: (session.user as any).id,
      id: visaId,
    },
    data: {
      user_id: (session.user as any).id,
      name,
      type,
      validFrom: new Date(validFrom),
      expires: expires ? new Date(expires) : undefined,
      visaNumber,
      documentNumber,
      countries,
      maxNumTrips,
      tripMaxLen,
      totalMaxLen,
      rollingPeriodLen,
      mustExitBeforeExpiry,
      includeEntryAndExitDates,
    },
  });
};

export const deleteVisa = async (visaId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication required");
  }

  await prisma.visaTrip.deleteMany({ where: { visaId } });

  await prisma.visa.delete({
    where: {
      user_id: (session.user as any).id,
      id: visaId,
    },
  });
};

export const visaInfoForDate = async (visaId: string, date: Date) => {
  date.setUTCHours(0);
  date.setUTCMinutes(0);
  const visa = await prisma.visa.findUnique({
    where: {
      id: visaId,
    },
    select: {
      validFrom: true,
      expires: true,
      countries: true,
      maxNumTrips: true,
      tripMaxLen: true,
      totalMaxLen: true,
      rollingPeriodLen: true,
      mustExitBeforeExpiry: true,
      includeEntryAndExitDates: true,
      VisaTrip: {
        where: {
          trip: {
            startDate: { lte: date },
          },
        },
        select: {
          trip: true,
        },
        orderBy: [
          {
            trip: {
              startDate: "asc",
            },
          },
        ],
      },
    },
  });

  if (!visa) {
    return {
      summary: {
        valid: false,
        items: [{ title: "Error", content: "Cannot find visa" }],
      },
    };
  }

  if (visa.validFrom > date) {
    return {
      summary: {
        valid: false,
        items: [
          {
            title: "Invalid",
            content: "This visa is not yet valid on this date",
          },
        ],
      },
    };
  }

  if (visa.expires && visa.expires < date) {
    return {
      summary: {
        valid: false,
        items: [
          {
            title: "Expired",
            content: "This visa has expired on this date",
          },
        ],
      },
    };
  }

  if (visa.VisaTrip.length === 0) {
    return {
      summary: {
        valid: true,
        items: [
          {
            title: "Valid",
            content:
              "This visa is in date, but there are no trips which have started by this date",
          },
        ],
      },
    };
  }
  const evaluationVisa: EvaluationVisa = {
    ...visa,
    id: visaId,
    name: "Compatibility Visa",
    type: "compatibility",
    visaNumber: null,
    linkedTrips: visa.VisaTrip.map(({ trip }) => ({
      id: trip.id,
      startDate: trip.startDate,
      endDate: trip.endDate,
      name: trip.name,
      countryCode: trip.countryCode,
      colour: trip.colour,
      visaRequired: trip.visaRequired,
      linkedVisaId: visaId,
    })),
  };

  const evaluation = evaluateSingleVisa({
    visa: evaluationVisa,
    referenceDate: date,
  });

  const trips = await Promise.all(
    evaluation.tripEvaluations.map(async (tripEvaluation) => {
      const tripLen = await getDaysBetweenDates(
        tripEvaluation.trip.startDate,
        tripEvaluation.trip.endDate,
        visa.includeEntryAndExitDates
      );
      const issueKinds = new Set(tripEvaluation.issueKinds);
      const results = [
        {
          name: "Country",
          valid: !issueKinds.has(TripIssueKind.TRIP_COUNTRY_NOT_COVERED),
          description: issueKinds.has(TripIssueKind.TRIP_COUNTRY_NOT_COVERED)
            ? "Country is invalid, this visa does not cover this country"
            : "Country is valid",
        },
        {
          name: "Start Date",
          valid:
            !issueKinds.has(TripIssueKind.TRIP_VISA_NOT_YET_VALID) &&
            !issueKinds.has(TripIssueKind.TRIP_VISA_EXPIRED),
          description:
            issueKinds.has(TripIssueKind.TRIP_VISA_NOT_YET_VALID) ||
            issueKinds.has(TripIssueKind.TRIP_VISA_EXPIRED)
              ? "Start date invalid, trips starts before or after visa validity"
              : "Valid start date",
        },
      ];

      if (visa.mustExitBeforeExpiry) {
        results.push({
          name: "End Date",
          valid:
            !issueKinds.has(TripIssueKind.TRIP_VISA_WILL_BE_EXPIRED) &&
            !issueKinds.has(TripIssueKind.TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH),
          description:
            issueKinds.has(TripIssueKind.TRIP_VISA_WILL_BE_EXPIRED) ||
            issueKinds.has(TripIssueKind.TRIP_MUST_LEAVE_BEFORE_EXPIRY_BREACH)
              ? "End date invalid, trip ends before or after visa validity"
              : "Valid end date",
        });
      }

      if (visa.tripMaxLen) {
        const valid = !issueKinds.has(TripIssueKind.TRIP_EXCEEDS_SINGLE_TRIP_LIMIT);
        results.push({
          name: "Maximum Single Trip Length",
          valid,
          description: valid
            ? `Maximum single trip length is valid: ${tripLen} days (max: ${visa.tripMaxLen} days)`
            : `Maximum single trip length invalid: ${tripLen} days (max: ${visa.tripMaxLen} days)`,
        });
      }

      return {
        valid: tripEvaluation.status === "valid",
        trip: {
          id: tripEvaluation.trip.id,
          startDate: tripEvaluation.trip.startDate,
          endDate: tripEvaluation.trip.endDate,
          name: tripEvaluation.trip.name,
          country: tripEvaluation.trip.countryCode,
          colour: tripEvaluation.trip.colour,
          tripLen,
        },
        results,
      };
    })
  );

  const aggregateValidation = evaluation.usageSnapshots.flatMap((snapshot) => {
    if (snapshot.ruleKind === AggregateRuleKind.ROLLING_WINDOW) {
      return [
        {
          name: "Rolling Period",
          valid: true,
          description: `${visa.rollingPeriodLen} days, starts from ${new Date(
            snapshot.windowStart!
          ).toLocaleDateString("en-GB")}`,
          data: snapshot.relevantTripIds.map((tripId) => ({
            tripId,
            count: "",
            descriptor: "",
          })),
        },
        {
          name: "Total max length",
          valid: snapshot.remaining >= 0,
          description:
            snapshot.remaining >= 0
              ? `Total trip length valid: ${snapshot.used} days (max ${snapshot.limit})`
              : `Total trip max length invalid: ${snapshot.used} days (max ${snapshot.limit})`,
          data: snapshot.relevantTripIds.map((tripId) => ({
            tripId,
            count: 0,
            descriptor: "days",
          })),
          remaining: Math.max(snapshot.remaining, 0),
        },
      ];
    }

    if (snapshot.ruleKind === AggregateRuleKind.MAX_TRIPS) {
      return [
        {
          name: "Maximum Number of Trips",
          valid: snapshot.remaining >= 0,
          description:
            snapshot.remaining >= 0
              ? `The maximum number of trips is valid: ${snapshot.used} trip(s) (max: ${snapshot.limit})`
              : `The maximum number of trips is invalid: ${snapshot.used} trip(s) (max ${snapshot.limit})`,
          data: snapshot.relevantTripIds.map((tripId) => ({
            tripId,
            count: 1,
            descriptor: "trip",
          })),
          remaining: Math.max(snapshot.remaining, 0),
        },
      ];
    }

    return [
      {
        name: "Total max length",
        valid: snapshot.remaining >= 0,
        description:
          snapshot.remaining >= 0
            ? `Total trip length valid: ${snapshot.used} days (max ${snapshot.limit})`
            : `Total trip max length invalid: ${snapshot.used} days (max ${snapshot.limit})`,
        data: snapshot.relevantTripIds.map((tripId) => ({
          tripId,
          count: 0,
          descriptor: "days",
        })),
        remaining: Math.max(snapshot.remaining, 0),
      },
    ];
  });

  const summaryAlerts = evaluation.alerts.filter(
    (alert) => alert.severity !== AlertSeverity.INFO
  );

  const summary =
    summaryAlerts.length > 0
      ? {
          valid: false,
          items: summaryAlerts.slice(0, 3).map((alert) => ({
            title:
              alert.kind === "VISA_EXPIRED"
                ? "Expired"
                : alert.kind === "VISA_NOT_YET_VALID_FOR_TRIP"
                ? "Invalid"
                : "Warning",
            content:
              alert.kind === "VISA_EXPIRED"
                ? "This visa has expired on this date"
                : alert.kind === "VISA_NOT_YET_VALID_FOR_TRIP"
                ? "This visa is not yet valid on this date"
                : "This visa has one or more linked trip issues on this date",
          })),
        }
      : undefined;

  const tripsValid = trips.every((trip) => trip.valid);
  const aggregatesValid = aggregateValidation.every((aggregate) => aggregate.valid);

  // This adapter preserves the old string-based shape until the UI consumes structured alerts directly.
  // Future hooks for alert dismissal, renewal suppression, passport expiry, and visa-free coverage belong above this boundary.
  return summary
    ? {
        summary,
        trips,
        aggregateValidation,
        tripsValid,
        aggregatesValid,
        valid: tripsValid && aggregatesValid,
        structuredAlerts: evaluation.alerts,
        infoKinds: evaluation.infoKinds,
      }
    : {
        trips,
        aggregateValidation,
        tripsValid,
        aggregatesValid,
        valid: tripsValid && aggregatesValid,
        structuredAlerts: evaluation.alerts,
        infoKinds: evaluation.infoKinds,
      };
};

// TODO: overhaul this to use constants rather than strings to describe errors
// TODO: properly design trip / visa warnings & errors with constants describing errors
// TODO: Also have more descriptive trip predictive warnings
// TODO: write system for visa cards
