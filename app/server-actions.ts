"use server";

import { getServerSession } from "next-auth";
import { prisma } from "./constants";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { Trip } from "@prisma/client";
import { convertDateToString } from "./utils";
import { visaInfoForDate } from "./visas/server-actions";

export type TripDay = Pick<
  Trip,
  "id" | "countryCode" | "colour" | "name" | "visaRequired"
> & {
  first: boolean;
  last: boolean;
  hasVisa: boolean;
  visaValid: boolean;
};

export type CalendarDay = {
  date: string;
  trips: TripDay[];
};

export const isVisaValidForTrip = async (
  visaId: string,
  tripId: string,
  tripEndDate: Date
) => {
  const visaInfo = await visaInfoForDate(
    visaId,
    getDateWithOffset(tripEndDate)
  );

  const trip = visaInfo.trips?.find((trip) => trip.trip.id === tripId);
  return (trip && trip.valid && visaInfo.aggregatesValid) || false;
};

export const getDateWithOffset = (date: Date) => {
  const offset = date.getTimezoneOffset();
  if (offset > 0) {
    return new Date(date.getTime() + offset * 60 * 1000);
  } else if (offset < 0) {
    return new Date(date.getTime() - offset * 60 * 1000);
  }
  return date;
};

export const getDaysBetweenDates = (
  date1: Date,
  date2: Date,
  includeStartAndEnd = false
) => {
  const time =
    getDateWithOffset(date2).getTime() - getDateWithOffset(date1).getTime();
  const count = Math.abs(Math.floor(time / 1000 / 60 / 60 / 24));
  return includeStartAndEnd ? count + 1 : count;
};

const getDayList = (year: number, month: number): CalendarDay[] => {
  const firstDayOfMonth = getDateWithOffset(new Date(year, month - 1, 1));
  const lastDayOfMonth = getDateWithOffset(new Date(year, month, 0));

  const calendarDates = [];
  let currentDate = new Date(firstDayOfMonth);

  if (currentDate.getDay() > 1 || currentDate.getDay() === 0) {
    currentDate = getDateWithOffset(new Date(year, month - 1, 0));
    while (currentDate.getDay() >= 1) {
      calendarDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() - 1);
    }
  }

  // Add dates from the current month
  currentDate = new Date(firstDayOfMonth);
  while (currentDate < lastDayOfMonth) {
    calendarDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Add dates from the next month to the last week
  while (currentDate.getDay() !== 0) {
    calendarDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  calendarDates.push(new Date(currentDate));

  return calendarDates
    .sort((a, b) => a.getTime() - b.getTime())
    .map((date) => ({ date: convertDateToString(date), trips: [] }));
};

export const getCalendarDates = async (year: number, month: number) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("Authentication required");
  }

  const dayList = getDayList(year, month);
  const firstDay = new Date(dayList[0].date);
  const lastDay = new Date(dayList[dayList.length - 1].date);

  const coveredTrips = await prisma.trip.findMany({
    where: {
      user_id: (session.user as any).id,
      OR: [
        {
          AND: [
            { startDate: { gt: firstDay } },
            { startDate: { lt: lastDay } },
          ],
        },
        {
          AND: [{ endDate: { gt: firstDay } }, { endDate: { lt: lastDay } }],
        },
      ],
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      countryCode: true,
      colour: true,
      name: true,
      visaRequired: true,
      VisaTrip: true,
    },
    orderBy: [{ startDate: "asc" }],
  });

  for await (const trip of coveredTrips) {
    let first = true;
    const hasVisa = trip.VisaTrip.length > 0;
    const visaValid =
      hasVisa &&
      (await isVisaValidForTrip(
        trip.VisaTrip[0].visaId,
        trip.id,
        trip.endDate
      ));
    dayList.forEach((day) => {
      const date = new Date(day.date);
      if (date >= trip.startDate && date <= trip.endDate) {
        day.trips.push({
          id: trip.id,
          countryCode: trip.countryCode,
          colour: trip.colour,
          name: trip.name,
          hasVisa,
          visaValid,
          visaRequired: trip.visaRequired,
          first,
          last: date.toLocaleDateString() == trip.endDate.toLocaleDateString(),
        });
        first = false;
      }
    });
  }
  return dayList;
};
