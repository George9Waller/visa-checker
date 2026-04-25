import { prisma } from "@/app/constants-server";

type SeedIds = {
  currentTripId: string;
  upcomingTripId: string;
  uncoveredTripId: string;
  pastTripId: string;
  pastSpainTripId: string;
  pastFranceTripId: string;
  activeVisaId: string;
  expiringVisaId: string;
  expiredVisaId: string;
};

const userId = process.env.PLAYWRIGHT_AUTH_USER_ID ?? "user-1";

const startOfUtcDay = (date: Date) => {
  const result = new Date(date);
  result.setUTCHours(0, 0, 0, 0);
  return result;
};

const addDays = (date: Date, days: number) =>
  new Date(startOfUtcDay(date).getTime() + days * 24 * 60 * 60 * 1000);

const iso = (date: Date) => date.toISOString().split("T")[0];

export const seedDevLoginData = async () => {
  const today = startOfUtcDay(new Date());

  const ids: SeedIds = {
    currentTripId: "trip-current-barcelona",
    upcomingTripId: "trip-upcoming-tokyo",
    uncoveredTripId: "trip-upcoming-lisbon",
    pastTripId: "trip-past-toronto",
    pastSpainTripId: "trip-past-madrid",
    pastFranceTripId: "trip-past-paris",
    activeVisaId: "visa-active-schengen",
    expiringVisaId: "visa-expiring-japan",
    expiredVisaId: "visa-expired-canada",
  };

  await prisma.$transaction([
    prisma.visaTrip.deleteMany({
      where: { tripId: { in: Object.values(ids) } },
    }),
    prisma.visaTrip.deleteMany({
      where: { visaId: { in: Object.values(ids) } },
    }),
    prisma.trip.deleteMany({ where: { user_id: userId } }),
    prisma.visa.deleteMany({ where: { user_id: userId } }),
  ]);

  const activeVisaValidFrom = addDays(today, -120);
  const activeVisaExpires = addDays(today, 120);
  const expiringVisaValidFrom = addDays(today, -30);
  const expiringVisaExpires = addDays(today, 18);
  const expiredVisaValidFrom = addDays(today, -400);
  const expiredVisaExpires = addDays(today, -90);

  await prisma.visa.createMany({
    data: [
      {
        id: ids.activeVisaId,
        user_id: userId,
        name: "Schengen Explorer",
        type: "SCHENGEN",
        validFrom: activeVisaValidFrom,
        expires: activeVisaExpires,
        countries: ["FR", "DE", "ES", "IT", "NL"],
        totalMaxLen: 90,
        rollingPeriodLen: 180,
        mustExitBeforeExpiry: true,
        includeEntryAndExitDates: true,
        visaNumber: "SCH-2401",
        documentNumber: "P1234567",
      },
      {
        id: ids.expiringVisaId,
        user_id: userId,
        name: "Japan Fast Track",
        type: "ESTA",
        validFrom: expiringVisaValidFrom,
        expires: expiringVisaExpires,
        countries: ["JP"],
        tripMaxLen: 21,
        mustExitBeforeExpiry: true,
        includeEntryAndExitDates: true,
        visaNumber: "JP-ETA-7788",
      },
      {
        id: ids.expiredVisaId,
        user_id: userId,
        name: "Canada Visitor Archive",
        type: "OTHER",
        validFrom: expiredVisaValidFrom,
        expires: expiredVisaExpires,
        countries: ["CA"],
        tripMaxLen: 180,
        mustExitBeforeExpiry: true,
        includeEntryAndExitDates: true,
        visaNumber: "CA-OLD-1024",
        documentNumber: "TR-ARCHIVE",
      },
    ],
  });

  await prisma.trip.createMany({
    data: [
      {
        id: ids.currentTripId,
        user_id: userId,
        startDate: addDays(today, -2),
        endDate: addDays(today, 4),
        name: "Barcelona sprint",
        colour: "1",
        countryCode: "ES",
        visaRequired: true,
      },
      {
        id: ids.upcomingTripId,
        user_id: userId,
        startDate: addDays(today, 14),
        endDate: addDays(today, 23),
        name: "Tokyo cherry blossom",
        colour: "2",
        countryCode: "JP",
        visaRequired: true,
      },
      {
        id: ids.uncoveredTripId,
        user_id: userId,
        startDate: addDays(today, 38),
        endDate: addDays(today, 43),
        name: "Lisbon weekend",
        colour: "3",
        countryCode: "PT",
        visaRequired: true,
      },
      {
        id: ids.pastTripId,
        user_id: userId,
        startDate: addDays(today, -54),
        endDate: addDays(today, -47),
        name: "Toronto retrospective",
        colour: "4",
        countryCode: "CA",
        visaRequired: true,
      },
      {
        id: ids.pastSpainTripId,
        user_id: userId,
        startDate: addDays(today, -96),
        endDate: addDays(today, -90),
        name: "Madrid review",
        colour: "5",
        countryCode: "ES",
        visaRequired: true,
      },
      {
        id: ids.pastFranceTripId,
        user_id: userId,
        startDate: addDays(today, -130),
        endDate: addDays(today, -124),
        name: "Paris retrospective",
        colour: "6",
        countryCode: "FR",
        visaRequired: true,
      },
    ],
  });

  await prisma.visaTrip.createMany({
    data: [
      { tripId: ids.currentTripId, visaId: ids.activeVisaId },
      { tripId: ids.upcomingTripId, visaId: ids.expiringVisaId },
      { tripId: ids.pastTripId, visaId: ids.expiredVisaId },
      { tripId: ids.pastSpainTripId, visaId: ids.activeVisaId },
      { tripId: ids.pastFranceTripId, visaId: ids.activeVisaId },
    ],
  });

  return {
    currentDate: iso(today),
    ids,
  };
};
