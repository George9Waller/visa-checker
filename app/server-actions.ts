"use server";

import { getServerSession } from "next-auth";
import { prisma } from "./constants-server";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { Visa } from "../generated/prisma/client";
import { convertDateToString } from "./utils";
import { visaInfoForDate } from "./visas/server-actions";
import {
  AlertSeverity,
  DashboardCard,
  EvaluationTrip,
  EvaluationVisa,
  ProjectionPoint,
  StructuredAlert,
  TripEvaluationResult,
  startOfUtcDay,
  evaluateVisaPortfolio,
} from "./visas/evaluation";

export type TimelineTrip = {
  id: string;
  startDate: string;
  endDate: string;
  name: string | null;
  colour: string;
  countryCode: string;
  visaRequired: boolean;
  visaValid: boolean;
  durationDays: number;
  visa: Pick<Visa, "id" | "name"> | null;
};

export const isVisaValidForTrip = async (
  visaId: string,
  tripId: string,
  tripEndDate: Date
) => {
  const dateWithOffset = await getDateWithOffset(tripEndDate);
  const visaInfo = await visaInfoForDate(visaId, dateWithOffset);

  const trip = visaInfo.trips?.find((trip) => trip.trip.id === tripId);
  return (trip && trip.valid && visaInfo.aggregatesValid) || false;
};

export const getDateWithOffset = async (date: Date) => {
  const offset = date.getTimezoneOffset();
  if (offset > 0) {
    return new Date(date.getTime() + offset * 60 * 1000);
  } else if (offset < 0) {
    return new Date(date.getTime() + offset * 60 * 1000);
  }
  return date;
};

export const getDaysBetweenDates = async (
  date1: Date,
  date2: Date,
  includeStartAndEnd = false
) => {
  const date1WithOffset = await getDateWithOffset(date1);
  const date2WithOffset = await getDateWithOffset(date2);
  const time = date2WithOffset.getTime() - date1WithOffset.getTime();
  const count = Math.abs(Math.floor(time / 1000 / 60 / 60 / 24));
  return includeStartAndEnd ? count + 1 : count;
};

async function enrichTrips(
  rawTrips: {
    id: string;
    startDate: Date;
    endDate: Date;
    name: string | null;
    colour: string;
    countryCode: string;
    visaRequired: boolean;
    VisaTrip: { Visa: { id: string; name: string } }[];
  }[]
): Promise<TimelineTrip[]> {
  const result: TimelineTrip[] = [];
  for (const trip of rawTrips) {
    const hasVisa = trip.VisaTrip.length > 0;
    const visa = hasVisa ? trip.VisaTrip[0].Visa : null;
    const visaValid =
      hasVisa &&
      (await isVisaValidForTrip(
        trip.VisaTrip[0].Visa.id,
        trip.id,
        trip.endDate
      ));
    const durationDays = await getDaysBetweenDates(
      trip.startDate,
      trip.endDate,
      true
    );
    result.push({
      id: trip.id,
      startDate: convertDateToString(trip.startDate),
      endDate: convertDateToString(trip.endDate),
      name: trip.name,
      colour: trip.colour,
      countryCode: trip.countryCode,
      visaRequired: trip.visaRequired,
      visa,
      visaValid,
      durationDays,
    });
  }
  return result;
}

const TRIP_SELECT = {
  id: true,
  startDate: true,
  endDate: true,
  name: true,
  colour: true,
  countryCode: true,
  visaRequired: true,
  VisaTrip: {
    select: { Visa: { select: { id: true, name: true } } },
  },
} as const;

// Fetch trips whose startDate < cursor, returning up to `limit` in ascending order.
export const getTripsBefore = async (
  cursor: string,
  limit: number
): Promise<{ trips: TimelineTrip[]; hasMore: boolean; count: number }> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Authentication required");

  const where = {
    user_id: (session.user as any).id,
    startDate: { lt: new Date(cursor) },
  };
  const count = await prisma.trip.count({ where });
  const raw = await prisma.trip.findMany({
    where,
    select: TRIP_SELECT,
    orderBy: { startDate: "desc" },
    take: limit + 1,
  });

  const hasMore = raw.length > limit;
  const page = raw.slice(0, limit);
  return { trips: await enrichTrips(page), hasMore, count };
};

// Fetch trips whose startDate >= cursor, returning up to `limit` in ascending order.
export const getTripsFrom = async (
  cursor: string,
  limit: number
): Promise<{ trips: TimelineTrip[]; hasMore: boolean; count: number }> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Authentication required");

  const where = {
    user_id: (session.user as any).id,
    startDate: { gte: new Date(cursor) },
  };
  const count = await prisma.trip.count({ where });
  const raw = await prisma.trip.findMany({
    where,
    select: TRIP_SELECT,
    orderBy: { startDate: "asc" },
    take: limit + 1,
  });

  const hasMore = raw.length > limit;
  const page = raw.slice(0, limit);
  return { trips: await enrichTrips(page), hasMore, count };
};

export const getCurrentTrip = async (): Promise<TimelineTrip[]> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Authentication required");

  const todayStr = new Date().toISOString().split("T")[0];
  return await prisma.trip
    .findMany({
      where: {
        user_id: (session.user as any).id,
        startDate: { lte: new Date(todayStr) },
        endDate: { gte: new Date(todayStr) },
      },
      select: TRIP_SELECT,
      orderBy: { startDate: "asc" },
    })
    .then(enrichTrips);
};

export const getNextTrip = async (): Promise<TimelineTrip | null> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Authentication required");
  
  const todayStr = new Date().toISOString().split("T")[0];
  const trips = await prisma.trip.findMany({
    where: {
      user_id: (session.user as any).id,
      startDate: { gt: new Date(todayStr) },
    },
    select: TRIP_SELECT,
    orderBy: { startDate: "asc" },
    take: 1,
  }).then(enrichTrips);

  return trips.length > 0 ? trips[0] : null;
}

export const getRollingWindowVisas = async (): Promise<Visa[]> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Authentication required");

  return await prisma.visa.findMany({
    where: {
      user_id: (session.user as any).id,
    },
  });
};

export type Warning = {
  title: string;
  description: string;
  action: string;
  link: string;
};

export const getEvaluationInputs = async (userId: string) => {
  const [visas, trips] = await Promise.all([
    prisma.visa.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        name: true,
        type: true,
        validFrom: true,
        expires: true,
        visaNumber: true,
        countries: true,
        maxNumTrips: true,
        tripMaxLen: true,
        totalMaxLen: true,
        rollingPeriodLen: true,
        mustExitBeforeExpiry: true,
        includeEntryAndExitDates: true,
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
        },
      },
    }),
    prisma.trip.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        name: true,
        colour: true,
        countryCode: true,
        visaRequired: true,
        VisaTrip: {
          select: {
            visaId: true,
          },
          take: 1,
        },
      },
    }),
  ]);

  const evaluationVisas: EvaluationVisa[] = visas.map((visa) => ({
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
    linkedTrips: visa.VisaTrip.map(({ trip }) => ({
      ...trip,
      linkedVisaId: visa.id,
    })),
  }));

  const evaluationTrips: EvaluationTrip[] = trips.map((trip) => ({
    id: trip.id,
    startDate: trip.startDate,
    endDate: trip.endDate,
    name: trip.name,
    colour: trip.colour,
    countryCode: trip.countryCode,
    visaRequired: trip.visaRequired,
    linkedVisaId: trip.VisaTrip[0]?.visaId ?? null,
  }));

  return { evaluationVisas, evaluationTrips };
};

export const getDashboardSummary = async (): Promise<{
  alerts: StructuredAlert[];
  warningOverflowCount: number;
  cards: DashboardCard[];
  currentTrip?: TripEvaluationResult;
  nextTrip?: TripEvaluationResult;
}> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Authentication required");

  const today = new Date();
  const todayDay = startOfUtcDay(today).getTime();
  const { evaluationTrips, evaluationVisas } = await getEvaluationInputs(
    (session.user as any).id
  );
  const result = evaluateVisaPortfolio({
    visas: evaluationVisas,
    trips: evaluationTrips,
    referenceDate: today,
  });

  const tripById = new Map(result.tripEvaluations.map((trip) => [trip.trip.id, trip]));
  const currentTrip = result.tripEvaluations.find(
    (trip) =>
      startOfUtcDay(trip.trip.startDate).getTime() <= todayDay &&
      startOfUtcDay(trip.trip.endDate).getTime() >= todayDay
  );
  const nextTrip = result.tripEvaluations.find(
    (trip) => startOfUtcDay(trip.trip.startDate).getTime() > todayDay
  );

  const dangerAlerts = result.alerts.filter(
    (alert) =>
      alert.severity === AlertSeverity.DANGER &&
      (!alert.tripId ||
        (tripById.get(alert.tripId) &&
          startOfUtcDay(tripById.get(alert.tripId)!.trip.endDate).getTime() >=
            todayDay))
  );
  const warningAlerts = result.alerts.filter(
    (alert) =>
      alert.severity === AlertSeverity.WARN &&
      (!alert.tripId ||
        (tripById.get(alert.tripId) &&
          startOfUtcDay(tripById.get(alert.tripId)!.trip.endDate).getTime() >=
            todayDay))
  );
  const infoAlerts = result.alerts.filter(
    (alert) => alert.severity === AlertSeverity.INFO
  );
  const cappedWarnings = warningAlerts.slice(0, 3);
  const warningOverflowCount = Math.max(warningAlerts.length - cappedWarnings.length, 0);
  return {
    alerts: [...dangerAlerts, ...cappedWarnings, ...infoAlerts],
    warningOverflowCount,
    cards: result.dashboardCards,
    currentTrip,
    nextTrip,
  };
};

export const getRollingWindowProjection = async (
  visaId: string
): Promise<{
  visaId: string;
  points: ProjectionPoint[];
  nextResetDate?: string;
  minimumRemaining: number;
  minimumRemainingDate: string;
  firstProjectedBreachDate?: string;
} | null> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Authentication required");

  const { evaluationTrips, evaluationVisas } = await getEvaluationInputs(
    (session.user as any).id
  );
  const result = evaluateVisaPortfolio({
    visas: evaluationVisas,
    trips: evaluationTrips,
    referenceDate: new Date(),
  });

  return result.projections.find((projection) => projection.visaId === visaId) ?? null;
};

export const getWarnings = async (): Promise<Warning[]> => {
  const summary = await getDashboardSummary();
  return summary.alerts
    .filter((alert) => alert.tripId)
    .map((alert) => ({
      title: alert.params.tripName?.toString() ?? alert.tripId ?? "Trip issue",
      description: alert.kind,
      action: "Review",
      link: `/trips/${alert.tripId}`,
    }));
};
