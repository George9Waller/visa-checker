"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/app/constants-server";
import { Trip, Visa } from "../../generated/prisma/client";
import { getServerSession } from "next-auth";
import {
  AlertSeverity,
  EvaluationVisa,
  TripIssueKind,
  evaluateSingleVisa,
} from "../visas/evaluation";

export type TripVisaCandidate = Pick<
  Visa,
  "id" | "type" | "name" | "expires" | "visaNumber"
> & {
  isSelected: boolean;
  status: "valid" | "invalid";
  issueKinds: TripIssueKind[];
  issues: Array<{
    kind: TripIssueKind;
    severity: AlertSeverity;
    params?: Record<string, string | number | boolean | null>;
  }>;
  alertSeverity: AlertSeverity;
  linkId?: string;
};

type TripVisaInput = Pick<
  Trip,
  "id" | "countryCode" | "startDate" | "endDate" | "name" | "colour" | "visaRequired"
>;

export type TripCountrySuggestion = {
  code: string;
  lastVisited?: string;
  tripCount?: number;
};

export type TripCountrySuggestionGroups = {
  recent: TripCountrySuggestion[];
  popular: TripCountrySuggestion[];
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

const buildTripVisaCandidateList = async (
  userId: string,
  trip: TripVisaInput,
  includeLinkedVisa: boolean
) => {
  const visas = await prisma.visa.findMany({
    where: {
      user_id: userId,
      OR: [
        {
          countries: { has: trip.countryCode },
        },
        ...(includeLinkedVisa
          ? [
              {
                VisaTrip: {
                  some: {
                    tripId: trip.id,
                  },
                },
              },
            ]
          : []),
      ],
    },
    select: {
      id: true,
      type: true,
      name: true,
      expires: true,
      visaNumber: true,
      validFrom: true,
      countries: true,
      maxNumTrips: true,
      tripMaxLen: true,
      totalMaxLen: true,
      rollingPeriodLen: true,
      mustExitBeforeExpiry: true,
      includeEntryAndExitDates: true,
      VisaTrip: {
        select: {
          id: true,
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
  });

  const results: TripVisaCandidate[] = [];
  for (const visa of visas) {
    const link = visa.VisaTrip.find(
      ({ trip: linkedTrip }) => linkedTrip.id === trip.id
    );

    const linkedTrips = visa.VisaTrip.map(({ trip: linkedTrip }) => ({
      ...linkedTrip,
      linkedVisaId: visa.id,
    }));
    if (!link) {
      linkedTrips.push({
        id: trip.id,
        startDate: trip.startDate,
        endDate: trip.endDate,
        name: trip.name ?? null,
        colour: trip.colour,
        countryCode: trip.countryCode,
        visaRequired: trip.visaRequired,
        linkedVisaId: visa.id,
      });
    }

    const evaluationVisa: EvaluationVisa = {
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
      linkedTrips,
    };

    const evaluation = evaluateSingleVisa({
      visa: evaluationVisa,
      trips: linkedTrips,
      referenceDate: trip.endDate,
      projectionEndDate: trip.endDate,
    }).tripEvaluations.find(
      (tripEvaluation) => tripEvaluation.trip.id === trip.id
    );

    results.push({
      id: visa.id,
      type: visa.type,
      name: visa.name,
      expires: visa.expires,
      visaNumber: visa.visaNumber,
      isSelected: Boolean(link),
      status: evaluation?.status ?? "valid",
      issueKinds: evaluation?.issueKinds ?? [],
      issues:
        evaluation?.issues.map((issue) => ({
          kind: issue.kind as TripIssueKind,
          severity: issue.severity,
          params: {
            ...issue.params,
            tripName: trip.name ?? null,
            visaName: visa.name,
          },
        })) ?? [],
      alertSeverity:
        evaluation?.status === "invalid"
          ? AlertSeverity.DANGER
          : AlertSeverity.INFO,
      linkId: link?.id,
    });
  }

  return results.sort((a, b) => {
    if (a.isSelected && !b.isSelected) {
      return -1;
    }
    if (!a.isSelected && b.isSelected) {
      return 1;
    }
    if (a.status !== b.status) {
      return a.status === "valid" ? -1 : 1;
    }
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

export const getTripCountrySuggestions = async (): Promise<TripCountrySuggestionGroups> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication Required");
  }

  const userId = (session.user as any).id as string;
  const todayIso = new Date().toISOString().split("T")[0];
  const pastTripWhere = {
    user_id: userId,
    endDate: { lt: new Date(todayIso) },
  };

  const recentTrips = await prisma.trip.findMany({
    where: pastTripWhere,
    select: {
      countryCode: true,
      endDate: true,
    },
    orderBy: {
      endDate: "desc",
    },
    take: 24,
  });

  const recent: TripCountrySuggestion[] = [];
  const recentSeen = new Set<string>();
  for (const trip of recentTrips) {
    if (recentSeen.has(trip.countryCode)) {
      continue;
    }
    recentSeen.add(trip.countryCode);
    recent.push({
      code: trip.countryCode,
      lastVisited: trip.endDate.toISOString().split("T")[0],
    });
    if (recent.length === 2) {
      break;
    }
  }

  const popularTrips = await prisma.trip.groupBy({
    by: ["countryCode"],
    where: pastTripWhere,
    _count: {
      countryCode: true,
    },
    orderBy: {
      _count: {
        countryCode: "desc",
      },
    },
    take: 12,
  });

  const popular: TripCountrySuggestion[] = [];
  for (const trip of popularTrips) {
    if (recentSeen.has(trip.countryCode)) {
      continue;
    }
    popular.push({
      code: trip.countryCode,
      tripCount: trip._count.countryCode,
    });
    if (popular.length === 2) {
      break;
    }
  }

  return { recent, popular };
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
  name: string | null,
  visaId?: string | null
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

  if (visaId) {
    await prisma.visaTrip.create({
      data: {
        tripId: trip.id,
        visaId,
      },
    });
  } else {
    await linkVisaIfApplicable((session.user as any).id, trip);
  }

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

  const trip = await getTrip(tripId);
  return await buildTripVisaCandidateList((session.user as any).id, trip, true);
};

export const getPossibleVisasForDraftTrip = async (
  trip: {
    id: string;
    countryCode: string;
    startDate: string;
    endDate: string;
    name: string | null;
    colour: string;
    visaRequired: boolean;
  }
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Authentication Required");
  }

  const draftTrip: TripVisaInput = {
    id: "__draft__",
    countryCode: trip.countryCode,
    startDate: new Date(trip.startDate),
    endDate: new Date(trip.endDate),
    name: trip.name,
    colour: trip.colour,
    visaRequired: trip.visaRequired,
  };

  return await buildTripVisaCandidateList(
    (session.user as any).id,
    draftTrip,
    false
  );
};

export const getTripDetailSummary = async (tripId: string) => {
  const trip = await getTrip(tripId);
  const candidates = await getPossibleVisasForTrip(tripId);
  const selectedCandidate = candidates.find((candidate) => candidate.isSelected);
  const issueKinds = !trip.visaRequired
    ? []
    : selectedCandidate
    ? selectedCandidate.issueKinds
    : [TripIssueKind.TRIP_NO_VISA_LINKED];
  const status =
    !trip.visaRequired || issueKinds.length === 0 ? "valid" : "invalid";

  return {
    trip,
    status,
    issueKinds,
    selectedVisaId: selectedCandidate?.id ?? null,
    selectedCandidate: selectedCandidate ?? null,
    candidates,
  };
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
  return await getTripDetailSummary(tripId);
};
