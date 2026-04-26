import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSessionMock, prismaMock } = vi.hoisted(() => ({
  getServerSessionMock: vi.fn(),
  prismaMock: {
    trip: {
      findUniqueOrThrow: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    visa: {
      findMany: vi.fn(),
      findUniqueOrThrow: vi.fn(),
    },
    visaTrip: {
      deleteMany: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

vi.mock("next-auth", () => ({
  getServerSession: getServerSessionMock,
}));

vi.mock("@/app/constants-server", () => ({
  prisma: prismaMock,
}));

import {
  createTrip,
  getPossibleVisasForDraftTrip,
  getPossibleVisasForTrip,
  getTripDetailSummary,
  selectVisaForTrip,
  updateTrip,
} from "./server-actions";

const d = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

describe("trip structured actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServerSessionMock.mockResolvedValue({ user: { id: "user-1" } });
    prismaMock.visaTrip.findFirst.mockResolvedValue({ visaId: "visa-1" });
    prismaMock.trip.findUniqueOrThrow.mockResolvedValue({
      id: "trip-1",
      startDate: d("2024-06-20"),
      endDate: d("2024-06-25"),
      name: "Paris",
      colour: "1",
      countryCode: "FR",
      visaRequired: true,
    });
  });

  it("returns structured candidates with exact issue kinds", async () => {
    prismaMock.visa.findMany.mockResolvedValue([
      {
        id: "visa-1",
        type: "tourist",
        name: "Linked visa",
        validFrom: d("2024-01-01"),
        expires: d("2024-12-31"),
        visaNumber: "ABC123",
        countries: ["FR"],
        maxNumTrips: null,
        tripMaxLen: null,
        totalMaxLen: null,
        rollingPeriodLen: null,
        mustExitBeforeExpiry: true,
        includeEntryAndExitDates: true,
        VisaTrip: [
          {
            id: "link-1",
            trip: {
              id: "trip-1",
              startDate: d("2024-06-20"),
              endDate: d("2024-06-25"),
              name: "Paris",
              colour: "1",
              countryCode: "FR",
              visaRequired: true,
            },
          },
        ],
      },
      {
        id: "visa-2",
        type: "tourist",
        name: "Too early",
        validFrom: d("2024-07-01"),
        expires: d("2024-12-31"),
        visaNumber: null,
        countries: ["FR"],
        maxNumTrips: null,
        tripMaxLen: null,
        totalMaxLen: null,
        rollingPeriodLen: null,
        mustExitBeforeExpiry: true,
        includeEntryAndExitDates: true,
        VisaTrip: [],
      },
    ]);

    const candidates = await getPossibleVisasForTrip("trip-1");

    expect(candidates[0]).toEqual(
      expect.objectContaining({
        id: "visa-1",
        isSelected: true,
        status: "valid",
        issueKinds: [],
      })
    );
    expect(candidates[1]).toEqual(
      expect.objectContaining({
        id: "visa-2",
        isSelected: false,
        status: "invalid",
        issueKinds: ["TRIP_VISA_NOT_YET_VALID"],
      })
    );
  });

  it("lists matching draft visas with validity state and reasons", async () => {
    prismaMock.visa.findMany.mockResolvedValue([
      {
        id: "visa-1",
        type: "tourist",
        name: "Valid visa",
        validFrom: d("2024-01-01"),
        expires: d("2024-12-31"),
        visaNumber: null,
        countries: ["FR"],
        maxNumTrips: null,
        tripMaxLen: null,
        totalMaxLen: null,
        rollingPeriodLen: null,
        mustExitBeforeExpiry: true,
        includeEntryAndExitDates: true,
        VisaTrip: [],
      },
      {
        id: "visa-2",
        type: "tourist",
        name: "Not yet valid",
        validFrom: d("2024-07-01"),
        expires: d("2024-12-31"),
        visaNumber: null,
        countries: ["FR"],
        maxNumTrips: null,
        tripMaxLen: null,
        totalMaxLen: null,
        rollingPeriodLen: null,
        mustExitBeforeExpiry: true,
        includeEntryAndExitDates: true,
        VisaTrip: [],
      },
    ]);

    const candidates = await getPossibleVisasForDraftTrip({
      id: "__draft__",
      countryCode: "FR",
      startDate: "2024-06-20",
      endDate: "2024-06-25",
      name: "Paris",
      colour: "1",
      visaRequired: true,
    });

    expect(candidates[0]).toEqual(
      expect.objectContaining({
        id: "visa-1",
        status: "valid",
        issueKinds: [],
      })
    );
    expect(candidates[1]).toEqual(
      expect.objectContaining({
        id: "visa-2",
        status: "invalid",
        issueKinds: ["TRIP_VISA_NOT_YET_VALID"],
      })
    );
  });

  it("builds trip detail summary from the selected candidate path", async () => {
    prismaMock.visa.findMany.mockResolvedValue([
      {
        id: "visa-1",
        type: "tourist",
        name: "Wrong country",
        validFrom: d("2024-01-01"),
        expires: d("2024-12-31"),
        visaNumber: null,
        countries: ["DE"],
        maxNumTrips: null,
        tripMaxLen: null,
        totalMaxLen: null,
        rollingPeriodLen: null,
        mustExitBeforeExpiry: true,
        includeEntryAndExitDates: true,
        VisaTrip: [
          {
            id: "link-1",
            trip: {
              id: "trip-1",
              startDate: d("2024-06-20"),
              endDate: d("2024-06-25"),
              name: "Paris",
              colour: "1",
              countryCode: "FR",
              visaRequired: true,
            },
          },
        ],
      },
    ]);

    const summary = await getTripDetailSummary("trip-1");

    expect(summary.status).toBe("invalid");
    expect(summary.selectedCandidate?.issueKinds).toEqual([
      "TRIP_COUNTRY_NOT_COVERED",
    ]);
  });

  it("returns a structured refresh after selecting a visa", async () => {
    prismaMock.visa.findMany.mockResolvedValue([
      {
        id: "visa-1",
        type: "tourist",
        name: "Linked visa",
        validFrom: d("2024-01-01"),
        expires: d("2024-12-31"),
        visaNumber: null,
        countries: ["FR"],
        maxNumTrips: null,
        tripMaxLen: null,
        totalMaxLen: null,
        rollingPeriodLen: null,
        mustExitBeforeExpiry: true,
        includeEntryAndExitDates: true,
        VisaTrip: [
          {
            id: "link-1",
            trip: {
              id: "trip-1",
              startDate: d("2024-06-20"),
              endDate: d("2024-06-25"),
              name: "Paris",
              colour: "1",
              countryCode: "FR",
              visaRequired: true,
            },
          },
        ],
      },
    ]);

    const summary = await selectVisaForTrip("trip-1", "visa-1");

    expect(prismaMock.visaTrip.deleteMany).toHaveBeenCalledWith({
      where: { tripId: "trip-1" },
    });
    expect(prismaMock.visaTrip.create).toHaveBeenCalledWith({
      data: { tripId: "trip-1", visaId: "visa-1" },
    });
    expect(summary.selectedVisaId).toBe("visa-1");
  });

  it("links the selected visa when creating a trip", async () => {
    prismaMock.trip.create.mockResolvedValue({
      id: "trip-1",
      startDate: d("2024-06-20"),
      endDate: d("2024-06-25"),
      countryCode: "FR",
    });

    await createTrip("2024-06-20", "2024-06-25", "FR", true, "Paris", "visa-1");

    expect(prismaMock.visaTrip.create).toHaveBeenCalledWith({
      data: {
        tripId: "trip-1",
        visaId: "visa-1",
      },
    });
  });

  it("updates the selected visa when editing a trip", async () => {
    prismaMock.trip.findUnique.mockResolvedValue({
      countryCode: "FR",
    });
    prismaMock.trip.update.mockResolvedValue({
      id: "trip-1",
      startDate: d("2024-06-20"),
      endDate: d("2024-06-25"),
      countryCode: "FR",
      visaRequired: true,
    });

    await updateTrip(
      "trip-1",
      "2024-06-20",
      "2024-06-25",
      "FR",
      "1",
      true,
      "Paris",
      "visa-2"
    );

    expect(prismaMock.visaTrip.deleteMany).toHaveBeenCalledWith({
      where: { tripId: "trip-1" },
    });
    expect(prismaMock.visaTrip.create).toHaveBeenCalledWith({
      data: {
        tripId: "trip-1",
        visaId: "visa-2",
      },
    });
  });
});
