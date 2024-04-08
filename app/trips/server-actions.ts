"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/constants";
import { Trip, Visa, VisaTrip } from "@prisma/client";
import { getServerSession } from "next-auth";
import { isVisaValidForTrip } from "../server-actions";

export type VisaWithValid = Pick<
  Visa,
  "id" | "type" | "name" | "expires" | "visaNumber"
> & {
  validForTrip: boolean;
  VisaTrip: Pick<VisaTrip, "id">[];
};

const generateHash = (str: string) => {
  // Initialize the hash value
  let hash = 0;

  // Iterate over each character in the string
  for (let i = 0; i < str.length; i++) {
    // Update the hash with the ASCII value of the character
    hash = (hash << 5) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Ensure the hash is positive
  hash = Math.abs(hash);

  // Map the hash to the range 1-8
  return (hash % 8) + 1;
};

const linkVisaIfApplicable = async (
  userId: string,
  trip: Pick<Trip, "id" | "countryCode" | "startDate" | "endDate">
) => {
  const visasForCountry = await prisma.visa.findMany({
    where: {
      user_id: userId,
      countries: { has: trip.countryCode },
      validFrom: { lte: trip.startDate },
      OR: [
        {
          expires: null,
        },
        {
          expires: { gte: trip.startDate },
        },
      ],
    },
  });

  if (visasForCountry.length === 1) {
    await prisma.visaTrip.deleteMany({
      where: {
        tripId: trip.id,
      },
    });
    await prisma.visaTrip.create({
      data: {
        visaId: visasForCountry[0].id,
        tripId: trip.id,
      },
    });
  }
};

export const createTrip = async (
  startDate: string,
  endDate: string,
  country: string,
  visaRequired: boolean,
  name: string | null
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication Required");
  }

  const trip = await prisma.trip.create({
    data: {
      user_id: (session.user as any).id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      countryCode: country,
      visaRequired,
      colour: generateHash(country).toString(),
      name,
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      countryCode: true,
    },
  });

  await linkVisaIfApplicable((session.user as any).id, trip);

  return trip;
};

export const updateTrip = async (
  id: string,
  startDate: string,
  endDate: string,
  country: string,
  colour: string,
  visaRequired: boolean,
  name: string | null
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication Required");
  }

  const existingTrip = await prisma.trip.findUnique({
    where: {
      user_id: (session.user as any).id,
      id,
    },
    select: {
      countryCode: true,
    },
  });

  const trip = await prisma.trip.update({
    where: {
      user_id: (session.user as any).id,
      id,
    },
    data: {
      user_id: (session.user as any).id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      countryCode: country,
      visaRequired,
      colour,
      name,
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      countryCode: true,
      visaRequired: true,
    },
  });

  if (visaRequired && country !== existingTrip?.countryCode) {
    await linkVisaIfApplicable((session.user as any).id, trip);
  }
  if (!trip.visaRequired) {
    await prisma.visaTrip.deleteMany({ where: { tripId: trip.id } });
  }
  return trip;
};

export const getTrip = async (id: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication Required");
  }

  const trip = await prisma.trip.findUniqueOrThrow({
    where: {
      user_id: (session.user as any).id,
      id,
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      name: true,
      countryCode: true,
      colour: true,
      visaRequired: true,
    },
  });
  return trip;
};

export const deleteTrip = async (id: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication Required");
  }

  await prisma.visaTrip.deleteMany({
    where: {
      tripId: id,
    },
  });

  await prisma.trip.delete({
    where: {
      user_id: (session.user as any).id,
      id,
    },
  });
};

export const getPossibleVisasForTrip = async (tripId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication Required");
  }

  const results: VisaWithValid[] = [];

  const trip = await getTrip(tripId);
  const visas = await prisma.visa.findMany({
    where: {
      user_id: (session.user as any).id,
      countries: { has: trip.countryCode },
      OR: [{ expires: null }, { expires: { gte: trip.endDate } }],
    },
    select: {
      id: true,
      type: true,
      name: true,
      expires: true,
      visaNumber: true,
      VisaTrip: {
        where: {
          tripId: trip.id,
        },
        select: {
          id: true,
        },
      },
    },
  });

  for await (const visa of visas) {
    const visaAlreadyLinked =
      (
        await prisma.visaTrip.findMany({
          where: {
            tripId,
            visaId: visa.id,
          },
        })
      ).length > 0;
    let validForTrip = false;

    if (visaAlreadyLinked) {
      validForTrip = await isVisaValidForTrip(visa.id, tripId, trip.endDate);
    } else {
      const tempLink = await prisma.visaTrip.create({
        data: {
          tripId,
          visaId: visa.id,
        },
      });
      validForTrip = await isVisaValidForTrip(visa.id, tripId, trip.endDate);
      await prisma.visaTrip.delete({
        where: {
          id: tempLink.id,
        },
      });
    }
    results.push({ ...visa, validForTrip });
  }
  return results.sort((a, b) => {
    if (!a.expires && !b.expires) {
      return 0;
    }
    if (!a.expires) {
      return 1;
    }
    if (!b.expires) {
      return -1;
    }
    return a.expires.getTime() - b.expires.getTime();
  });
};

export const selectVisaForTrip = async (tripId: string, visaId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication Required");
  }

  await prisma.visaTrip.deleteMany({
    where: {
      tripId,
    },
  });
  await prisma.visaTrip.create({
    data: {
      tripId,
      visaId,
    },
  });
  return await getPossibleVisasForTrip(tripId);
};
