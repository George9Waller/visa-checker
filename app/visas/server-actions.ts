"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../constants";
import { getDateWithOffset, getDaysBetweenDates } from "../server-actions";

export const getVisas = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication required");
  }

  return await prisma.visa.findMany({
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
    },
    orderBy: [
      {
        expires: "desc",
      },
    ],
  });
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
  documentNumber?: string
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication required");
  }

  await prisma.visa.create({
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

  // Individual trip validation

  const dateIsValid = (tripStartDate: Date) =>
    tripStartDate >= visa.validFrom ||
    (visa.expires ? tripStartDate <= visa.expires : true);

  const countryIsValid = (tripCountryCode: string) =>
    visa.countries.includes(tripCountryCode);

  const singleTripMaxLenIsValid = (numDays: number) =>
    visa.tripMaxLen ? numDays < visa.tripMaxLen : true;

  const trips = visa.VisaTrip.map((visaTrip) => {
    const tripLen = getDaysBetweenDates(
      visaTrip.trip.startDate,
      visaTrip.trip.endDate,
      visa.includeEntryAndExitDates
    );
    const startDateValid = dateIsValid(visaTrip.trip.startDate);
    const endDateValid = dateIsValid(visaTrip.trip.endDate);
    const countryValid = countryIsValid(visaTrip.trip.countryCode);
    const singleTripMaxLenValid = singleTripMaxLenIsValid(tripLen);

    const results = [
      {
        name: "Country",
        valid: countryValid,
        description: countryValid
          ? "Country is valid"
          : "Country is invalid, this visa does not cover this country",
      },
      {
        name: "Start Date",
        valid: startDateValid,
        description: startDateValid
          ? "Valid start date"
          : "Start date invalid, trips starts before or after visa validity",
      },
    ];
    if (visa.mustExitBeforeExpiry) {
      results.push({
        name: "End Date",
        valid: endDateValid,
        description: endDateValid
          ? "Valid end date"
          : "End date invalid, trip ends before or after visa validity",
      });
    }
    if (visa.tripMaxLen) {
      results.push({
        name: "Maximum Single Trip Length",
        valid: singleTripMaxLenValid,
        description: singleTripMaxLenValid
          ? `Maximum single trip length is valid: ${tripLen} days (max: ${visa.tripMaxLen} days)`
          : `Maximum single trip length invalid: ${tripLen} days (max: ${visa.tripMaxLen} days)`,
      });
    }

    return {
      valid: results.map((result) => result.valid).every(Boolean),
      trip: {
        id: visaTrip.trip.id,
        startDate: visaTrip.trip.startDate,
        endDate: visaTrip.trip.endDate,
        name: visaTrip.trip.name,
        country: visaTrip.trip.countryCode,
        colour: visaTrip.trip.colour,
        tripLen: tripLen,
      },
      results,
    };
  });

  const rollingCutOff = visa.rollingPeriodLen
    ? new Date(
        getDateWithOffset(date).getTime() -
          visa.rollingPeriodLen * 24 * 60 * 60 * 1000
      )
    : undefined;

  // Aggregate trip validation
  const validTrips = trips
    .filter((trip) => trip.valid)
    .filter((trip) => {
      if (rollingCutOff) {
        return trip.trip.endDate >= rollingCutOff;
      } else {
        return true;
      }
    });

  const maxNumTripsValid = visa.maxNumTrips
    ? validTrips.length <= visa.maxNumTrips
    : true;

  const tripLengths = validTrips.map((trip) => {
    const start = rollingCutOff
      ? Math.max(
          getDateWithOffset(trip.trip.startDate).getTime(),
          rollingCutOff.getTime()
        )
      : getDateWithOffset(trip.trip.startDate).getTime();
    const end = Math.min(
      getDateWithOffset(trip.trip.endDate).getTime(),
      date.getTime()
    );
    return {
      tripId: trip.trip.id,
      count: getDaysBetweenDates(
        new Date(start),
        new Date(end),
        visa.includeEntryAndExitDates
      ),
      descriptor: "days",
    };
  });
  const totalTripLength = tripLengths
    .map((trip) => trip.count)
    .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  const totalTripLengthValid = visa.totalMaxLen
    ? totalTripLength <= visa.totalMaxLen
    : true;

  const aggregateValidation = [];

  if (rollingCutOff) {
    aggregateValidation.push({
      name: "Rolling Period",
      valid: true,
      description: `${
        visa.rollingPeriodLen
      } days, starts from ${rollingCutOff.toLocaleDateString()}`,
      data: validTrips.map((trip) => ({
        tripId: trip.trip.id,
        count: "",
        descriptor: "",
      })),
    });
  }

  if (visa.maxNumTrips) {
    aggregateValidation.push({
      name: "Maximum Number of Trips",
      valid: maxNumTripsValid,
      description: maxNumTripsValid
        ? `The maximum number of trips is valid: ${validTrips.length} trip(s) (max: ${visa.maxNumTrips})`
        : `The maximum number of trips is invalid: ${validTrips.length} trip(s) (max ${visa.maxNumTrips})`,
      data: validTrips.map((trip) => ({
        tripId: trip.trip.id,
        count: 1,
        descriptor: "trip",
      })),
      remaining: Math.max(visa.maxNumTrips - validTrips.length, 0),
    });
  }

  if (visa.totalMaxLen) {
    aggregateValidation.push({
      name: "Total max length",
      valid: totalTripLengthValid,
      description: totalTripLengthValid
        ? `Total trip length valid: ${totalTripLength} days (max ${visa.totalMaxLen})`
        : `Total trip max length invalid: ${totalTripLength} days (max ${visa.totalMaxLen})`,
      data: tripLengths,
      remaining: Math.max(visa.totalMaxLen - totalTripLength, 0),
    });
  }

  const tripsValid = trips.map((trip) => trip.valid).every(Boolean);
  const aggregatesValid = aggregateValidation
    .map((aggregate) => aggregate.valid)
    .every(Boolean);

  return {
    trips,
    aggregateValidation,
    tripsValid,
    aggregatesValid,
    valid: tripsValid && aggregatesValid,
  };
};
