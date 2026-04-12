import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock Prisma and Next-auth before importing the module under test
vi.mock("../constants", () => ({
  prisma: {
    visa: { findUnique: vi.fn() },
    visaTrip: { findMany: vi.fn(), create: vi.fn(), deleteMany: vi.fn() },
  },
}));
vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn(),
}));

import { prisma } from "../constants-server";
import { visaInfoForDate } from "./server-actions";

const mockFindUnique = prisma.visa.findUnique as ReturnType<typeof vi.fn>;

// ── Helpers ────────────────────────────────────────────────────────────────

const d = (iso: string) => new Date(iso + "T00:00:00.000Z");

/** Minimal valid visa stub; override fields per-test */
const baseVisa = () => ({
  validFrom: d("2024-01-01"),
  expires: null,
  countries: ["FR"],
  maxNumTrips: null,
  tripMaxLen: null,
  totalMaxLen: null,
  rollingPeriodLen: null,
  mustExitBeforeExpiry: false,
  includeEntryAndExitDates: false,
  VisaTrip: [] as { trip: Trip }[],
});

type Trip = {
  id: string;
  startDate: Date;
  endDate: Date;
  name: string | null;
  countryCode: string;
  colour: string;
  visaRequired: boolean;
  user_id: string;
};

const makeTrip = (overrides: Partial<Trip> = {}): Trip => ({
  id: "trip-1",
  startDate: d("2024-03-01"),
  endDate: d("2024-03-07"),
  name: null,
  countryCode: "FR",
  colour: "1",
  visaRequired: true,
  user_id: "user-1",
  ...overrides,
});

// ── Tests ──────────────────────────────────────────────────────────────────

describe("visaInfoForDate — early exits", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns error summary when visa is not found", async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await visaInfoForDate("non-existent", d("2024-06-01"));
    expect(result.summary?.valid).toBe(false);
    expect(result.summary?.items[0].title).toBe("Error");
  });

  it("returns invalid when date is before visa validFrom", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      validFrom: d("2025-01-01"),
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.summary?.valid).toBe(false);
    expect(result.summary?.items[0].title).toBe("Invalid");
  });

  it("returns expired when date is after visa expires", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      expires: d("2024-01-31"),
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.summary?.valid).toBe(false);
    expect(result.summary?.items[0].title).toBe("Expired");
  });

  it("returns valid with no trips message when VisaTrip is empty", async () => {
    mockFindUnique.mockResolvedValue(baseVisa());
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.summary?.valid).toBe(true);
  });
});

describe("visaInfoForDate — individual trip validation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("marks trip valid when country matches and dates are in range", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      VisaTrip: [{ trip: makeTrip() }],
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.valid).toBe(true);
    expect(result.trips?.[0].valid).toBe(true);
  });

  it("fails trip when country does not match visa countries", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      countries: ["DE"],
      VisaTrip: [{ trip: makeTrip({ countryCode: "FR" }) }],
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.trips?.[0].valid).toBe(false);
    const countryResult = result.trips?.[0].results.find(
      (r: { name: string }) => r.name === "Country"
    );
    expect(countryResult?.valid).toBe(false);
  });

  it("fails trip when start date is before visa validFrom", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      validFrom: d("2024-04-01"),
      VisaTrip: [
        {
          trip: makeTrip({
            startDate: d("2024-03-01"),
            endDate: d("2024-03-07"),
          }),
        },
      ],
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.trips?.[0].valid).toBe(false);
    const startDateResult = result.trips?.[0].results.find(
      (r: { name: string }) => r.name === "Start Date"
    );
    expect(startDateResult?.valid).toBe(false);
  });

  it("fails trip when single trip exceeds tripMaxLen", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      tripMaxLen: 5, // max 5 days
      VisaTrip: [
        {
          trip: makeTrip({
            startDate: d("2024-03-01"),
            endDate: d("2024-03-08"), // 7 days — exceeds limit
          }),
        },
      ],
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.trips?.[0].valid).toBe(false);
    const lengthResult = result.trips?.[0].results.find(
      (r: { name: string }) => r.name === "Maximum Single Trip Length"
    );
    expect(lengthResult?.valid).toBe(false);
  });

  it("passes trip when single trip is within tripMaxLen", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      tripMaxLen: 10,
      VisaTrip: [
        {
          trip: makeTrip({
            startDate: d("2024-03-01"),
            endDate: d("2024-03-07"), // 6 days — within limit
          }),
        },
      ],
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.trips?.[0].valid).toBe(true);
  });

  it("checks end date when mustExitBeforeExpiry is true", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      expires: d("2024-03-05"),
      mustExitBeforeExpiry: true,
      VisaTrip: [
        {
          trip: makeTrip({
            startDate: d("2024-03-01"),
            endDate: d("2024-03-10"), // ends after expiry
          }),
        },
      ],
    });
    const result = await visaInfoForDate("visa-1", d("2024-03-03"));
    expect(result.trips?.[0].valid).toBe(false);
    const endDateResult = result.trips?.[0].results.find(
      (r: { name: string }) => r.name === "End Date"
    );
    expect(endDateResult?.valid).toBe(false);
  });
});

describe("visaInfoForDate — aggregate validation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fails when number of valid trips exceeds maxNumTrips", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      maxNumTrips: 2,
      VisaTrip: [
        {
          trip: makeTrip({
            id: "t1",
            startDate: d("2024-01-10"),
            endDate: d("2024-01-15"),
          }),
        },
        {
          trip: makeTrip({
            id: "t2",
            startDate: d("2024-02-10"),
            endDate: d("2024-02-15"),
          }),
        },
        {
          trip: makeTrip({
            id: "t3",
            startDate: d("2024-03-10"),
            endDate: d("2024-03-15"),
          }),
        },
      ],
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.aggregatesValid).toBe(false);
    const numTripsValidation = result.aggregateValidation?.find(
      (v: { name: string }) => v.name === "Maximum Number of Trips"
    );
    expect(numTripsValidation?.valid).toBe(false);
    expect(numTripsValidation?.remaining).toBe(0);
  });

  it("passes when number of trips is at the limit", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      maxNumTrips: 2,
      VisaTrip: [
        {
          trip: makeTrip({
            id: "t1",
            startDate: d("2024-01-10"),
            endDate: d("2024-01-15"),
          }),
        },
        {
          trip: makeTrip({
            id: "t2",
            startDate: d("2024-02-10"),
            endDate: d("2024-02-15"),
          }),
        },
      ],
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.aggregatesValid).toBe(true);
    const numTripsValidation = result.aggregateValidation?.find(
      (v: { name: string }) => v.name === "Maximum Number of Trips"
    );
    expect(numTripsValidation?.valid).toBe(true);
    expect(numTripsValidation?.remaining).toBe(0);
  });

  it("fails when total trip days exceed totalMaxLen", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      totalMaxLen: 10, // max 10 days
      VisaTrip: [
        {
          trip: makeTrip({
            id: "t1",
            startDate: d("2024-01-01"),
            endDate: d("2024-01-07"), // 6 days
          }),
        },
        {
          trip: makeTrip({
            id: "t2",
            startDate: d("2024-02-01"),
            endDate: d("2024-02-08"), // 7 days → total 13
          }),
        },
      ],
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.aggregatesValid).toBe(false);
    const totalLenValidation = result.aggregateValidation?.find(
      (v: { name: string }) => v.name === "Total max length"
    );
    expect(totalLenValidation?.valid).toBe(false);
  });

  it("passes when total trip days are within totalMaxLen", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      totalMaxLen: 20,
      VisaTrip: [
        {
          trip: makeTrip({
            id: "t1",
            startDate: d("2024-01-01"),
            endDate: d("2024-01-07"), // 6 days
          }),
        },
        {
          trip: makeTrip({
            id: "t2",
            startDate: d("2024-02-01"),
            endDate: d("2024-02-08"), // 7 days → total 13
          }),
        },
      ],
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    expect(result.aggregatesValid).toBe(true);
    const totalLenValidation = result.aggregateValidation?.find(
      (v: { name: string }) => v.name === "Total max length"
    );
    expect(totalLenValidation?.remaining).toBe(7);
  });

  it("excludes trips outside the rolling period window", async () => {
    // Rolling period of 180 days; query date is 2024-06-01
    // Cutoff = 2023-12-04; trip in Nov 2023 is outside the window
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      totalMaxLen: 10,
      rollingPeriodLen: 180,
      VisaTrip: [
        {
          // Trip OUTSIDE the rolling window — should not count
          trip: makeTrip({
            id: "t1",
            startDate: d("2023-11-01"),
            endDate: d("2023-11-10"), // 9 days, but before cutoff
          }),
        },
        {
          // Trip INSIDE the rolling window
          trip: makeTrip({
            id: "t2",
            startDate: d("2024-04-01"),
            endDate: d("2024-04-06"), // 5 days within limit
          }),
        },
      ],
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    // The old trip is excluded, so only 5 days counted — within limit of 10
    expect(result.aggregatesValid).toBe(true);
  });

  it("shows remaining days correctly when some days have been used", async () => {
    mockFindUnique.mockResolvedValue({
      ...baseVisa(),
      totalMaxLen: 90,
      VisaTrip: [
        {
          trip: makeTrip({
            startDate: d("2024-01-01"),
            endDate: d("2024-01-31"), // 30 days
          }),
        },
      ],
    });
    const result = await visaInfoForDate("visa-1", d("2024-06-01"));
    const totalLenValidation = result.aggregateValidation?.find(
      (v: { name: string }) => v.name === "Total max length"
    );
    expect(totalLenValidation?.remaining).toBe(60);
  });
});
