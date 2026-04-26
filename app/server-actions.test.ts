import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSessionMock, visaInfoForDateMock, prismaMock } = vi.hoisted(
  () => ({
    getServerSessionMock: vi.fn(),
    visaInfoForDateMock: vi.fn(),
    prismaMock: {
      trip: {
        count: vi.fn(),
        findMany: vi.fn(),
      },
      visa: {
        findMany: vi.fn(),
      },
    },
  })
);

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("./constants-server", () => ({
  prisma: prismaMock,
}));

vi.mock("./visas/server-actions", () => ({
  visaInfoForDate: visaInfoForDateMock,
}));

import {
  getDashboardSummary,
  getCurrentTrip,
  getDateWithOffset,
  getDaysBetweenDates,
  getNextTrip,
  isVisaValidForTrip,
} from "./server-actions";

const d = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

describe("getDateWithOffset", () => {
  it("returns the same date when offset is zero (UTC)", async () => {
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(0);

    const date = new Date("2024-06-15T00:00:00.000Z");
    const result = await getDateWithOffset(date);
    expect(result.getTime()).toBe(date.getTime());
  });

  it("adjusts date forward for positive offset", async () => {
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(120);

    const date = new Date("2024-06-15T00:00:00.000Z");
    const expected = new Date("2024-06-15T02:00:00.000Z");
    const result = await getDateWithOffset(date);
    expect(result.getTime()).toBe(expected.getTime());
  });

  it("adjusts date backward for negative offset", async () => {
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-60);

    const date = new Date("2024-06-15T00:00:00.000Z");
    const expected = new Date("2024-06-14T23:00:00.000Z");
    const result = await getDateWithOffset(date);
    expect(result.getTime()).toBe(expected.getTime());
  });
});

describe("getDaysBetweenDates", () => {
  it("returns 0 for same-day dates", async () => {
    const sameDay = new Date("2024-01-01T00:00:00.000Z");
    expect(await getDaysBetweenDates(sameDay, sameDay)).toBe(0);
  });

  it("counts exclusive and inclusive boundaries", async () => {
    const start = new Date("2024-01-01T00:00:00.000Z");
    const end = new Date("2024-01-07T00:00:00.000Z");
    expect(await getDaysBetweenDates(start, end, false)).toBe(6);
    expect(await getDaysBetweenDates(start, end, true)).toBe(7);
  });

  it("returns absolute value regardless of argument order", async () => {
    const start = new Date("2024-01-01T00:00:00.000Z");
    const end = new Date("2024-01-10T00:00:00.000Z");
    expect(await getDaysBetweenDates(start, end)).toBe(
      await getDaysBetweenDates(end, start)
    );
  });
});

describe("isVisaValidForTrip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ user: { id: "user-1" } });
  });

  it("returns true only when the trip is valid and aggregates are valid", async () => {
    visaInfoForDateMock.mockResolvedValue({
      trips: [{ trip: { id: "trip-1" }, valid: true }],
      aggregatesValid: true,
    });

    await expect(
      isVisaValidForTrip("visa-1", "trip-1", d("2024-06-01"))
    ).resolves.toBe(true);
  });

  it("returns false when the linked trip is invalid for one reason", async () => {
    visaInfoForDateMock.mockResolvedValue({
      trips: [{ trip: { id: "trip-1" }, valid: false }],
      aggregatesValid: true,
    });

    await expect(
      isVisaValidForTrip("visa-1", "trip-1", d("2024-06-01"))
    ).resolves.toBe(false);
  });

  it("returns false when aggregate usage invalidates an otherwise valid trip", async () => {
    visaInfoForDateMock.mockResolvedValue({
      trips: [{ trip: { id: "trip-1" }, valid: true }],
      aggregatesValid: false,
    });

    await expect(
      isVisaValidForTrip("visa-1", "trip-1", d("2024-06-01"))
    ).resolves.toBe(false);
  });
});

describe("trip dashboard actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ user: { id: "user-1" } });
  });

  it("selects current trips using today's boundaries", async () => {
    vi.setSystemTime(new Date("2024-06-15T10:00:00.000Z"));
    prismaMock.trip.findMany.mockResolvedValue([
      {
        id: "current",
        startDate: d("2024-06-10"),
        endDate: d("2024-06-18"),
        name: "Current",
        colour: "1",
        countryCode: "FR",
        visaRequired: true,
        VisaTrip: [{ Visa: { id: "visa-1", name: "Schengen" } }],
      },
    ]);
    visaInfoForDateMock.mockResolvedValue({
      trips: [{ trip: { id: "current" }, valid: true }],
      aggregatesValid: true,
    });

    const trips = await getCurrentTrip();

    expect(prismaMock.trip.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          startDate: { lte: new Date("2024-06-15") },
          endDate: { gte: new Date("2024-06-15") },
        }),
      })
    );
    expect(trips[0]?.visaValid).toBe(true);
  });

  it("selects the next upcoming trip", async () => {
    vi.setSystemTime(new Date("2024-06-15T10:00:00.000Z"));
    prismaMock.trip.findMany.mockResolvedValue([
      {
        id: "next",
        startDate: d("2024-07-01"),
        endDate: d("2024-07-10"),
        name: "Next",
        colour: "1",
        countryCode: "FR",
        visaRequired: true,
        VisaTrip: [{ Visa: { id: "visa-1", name: "Schengen" } }],
      },
    ]);
    visaInfoForDateMock.mockResolvedValue({
      trips: [{ trip: { id: "next" }, valid: true }],
      aggregatesValid: true,
    });

    const trip = await getNextTrip();

    expect(trip?.id).toBe("next");
    expect(prismaMock.trip.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 1,
        where: expect.objectContaining({
          startDate: { gt: new Date("2024-06-15") },
        }),
      })
    );
  });

  it("returns structured dashboard alerts and cards", async () => {
    vi.setSystemTime(new Date("2024-06-15T10:00:00.000Z"));
    prismaMock.visa.findMany.mockResolvedValue([
      {
        id: "visa-1",
        name: "Schengen",
        type: "tourist",
        validFrom: d("2024-01-01"),
        expires: d("2024-12-31"),
        visaNumber: null,
        countries: ["FR"],
        maxNumTrips: null,
        tripMaxLen: 3,
        totalMaxLen: 90,
        rollingPeriodLen: 180,
        mustExitBeforeExpiry: true,
        includeEntryAndExitDates: true,
        VisaTrip: [
          {
            trip: {
              id: "trip-1",
              startDate: d("2024-06-20"),
              endDate: d("2024-06-25"),
              name: "Paris",
              colour: "1",
              countryCode: "DE",
              visaRequired: true,
            },
          },
        ],
      },
    ]);
    prismaMock.trip.findMany.mockResolvedValue([
      {
        id: "trip-1",
        startDate: d("2024-06-20"),
        endDate: d("2024-06-25"),
        name: "Paris",
        colour: "1",
        countryCode: "DE",
        visaRequired: true,
        VisaTrip: [{ visaId: "visa-1" }],
      },
    ]);

    const summary = await getDashboardSummary();

    expect(summary.alerts[0]?.kind).toBe("TRIP_COUNTRY_NOT_COVERED");
    expect(summary.cards.length).toBeGreaterThan(0);
    expect(summary.nextTrip?.trip.id).toBe("trip-1");
  });
});
