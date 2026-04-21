"use server";

import { getServerSession } from "next-auth";
import { prisma } from "./constants-server";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { Visa } from "../generated/prisma/client";
import { convertDateToString } from "./utils";
import { visaInfoForDate } from "./visas/server-actions";

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

export const getWarnings = async (): Promise<Warning[]> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Authentication required");

  const upcomingTrips = await getTripsFrom(
    new Date().toISOString().split("T")[0],
    1000
  );
  const tripWarnings: Warning[] = upcomingTrips.trips
    .filter((trip) => trip.visaRequired && !trip.visaValid)
    .map((trip) => ({
      title: trip.name || "Unnamed trip",
      description: Boolean(trip.visa) ? "Visa invalid" : "Missing visa",
      action: Boolean(trip.visa) ? "Fix visa" : "Add visa",
      link: `/trips/${trip.id}`,
    }));

  // TODO: visa warnings

  return [...tripWarnings];
};
