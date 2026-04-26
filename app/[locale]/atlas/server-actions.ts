"use server";

import { getServerSession } from "next-auth";
import { prisma } from "@/app/constants-server";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { convertDateToString } from "@/app/utils";

export type AtlasTrip = {
  id: string;
  countryCode: string;
  startDate: string;
  endDate: string;
  name: string | null;
  visaId: string | null;
  visaName: string | null;
};

export const getAtlasTrips = async (): Promise<AtlasTrip[]> => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Authentication required");

  const today = new Date();
  const trips = await prisma.trip.findMany({
    where: {
      user_id: (session.user as any).id,
      startDate: { lte: today },
    },
    select: {
      id: true,
      countryCode: true,
      startDate: true,
      endDate: true,
      name: true,
      VisaTrip: {
        select: {
          Visa: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: { startDate: "asc" },
  });

  return trips.map((trip) => ({
    id: trip.id,
    countryCode: trip.countryCode,
    startDate: convertDateToString(trip.startDate),
    endDate: convertDateToString(trip.endDate),
    name: trip.name,
    visaId: trip.VisaTrip[0]?.Visa.id ?? null,
    visaName: trip.VisaTrip[0]?.Visa.name ?? null,
  }));
};
