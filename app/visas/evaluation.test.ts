import { describe, expect, it } from "vitest";
import {
  AlertKind,
  CardKind,
  EvaluationTrip,
  EvaluationVisa,
  TripIssueKind,
  evaluateVisaPortfolio,
} from "./evaluation";

const d = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

const makeTrip = (overrides: Partial<EvaluationTrip> = {}): EvaluationTrip => ({
  id: "trip-1",
  startDate: d("2024-03-01"),
  endDate: d("2024-03-07"),
  name: "Paris",
  colour: "1",
  countryCode: "FR",
  visaRequired: true,
  linkedVisaId: "visa-1",
  ...overrides,
});

const makeVisa = (overrides: Partial<EvaluationVisa> = {}): EvaluationVisa => ({
  id: "visa-1",
  name: "Schengen",
  type: "tourist",
  validFrom: d("2024-01-01"),
  expires: d("2024-12-31"),
  visaNumber: null,
  countries: ["FR", "DE"],
  maxNumTrips: null,
  tripMaxLen: null,
  totalMaxLen: null,
  rollingPeriodLen: null,
  mustExitBeforeExpiry: true,
  includeEntryAndExitDates: true,
  linkedTrips: [],
  renewalSuccessorId: null,
  ...overrides,
});

describe("evaluateVisaPortfolio", () => {
  it("emits exact trip issue kinds for no linked visa and country mismatch", () => {
    const tripWithoutVisa = makeTrip({
      id: "trip-no-visa",
      linkedVisaId: null,
    });
    const tripWrongCountry = makeTrip({
      id: "trip-country",
      countryCode: "ES",
      linkedVisaId: "visa-1",
    });
    const visa = makeVisa({
      linkedTrips: [tripWrongCountry],
    });

    const result = evaluateVisaPortfolio({
      visas: [visa],
      trips: [tripWithoutVisa, tripWrongCountry],
      referenceDate: d("2024-02-01"),
    });

    expect(
      result.tripEvaluations.find((trip) => trip.trip.id === "trip-no-visa")?.issueKinds
    ).toEqual([TripIssueKind.TRIP_NO_VISA_LINKED]);
    expect(
      result.tripEvaluations.find((trip) => trip.trip.id === "trip-country")?.issueKinds
    ).toContain(TripIssueKind.TRIP_COUNTRY_NOT_COVERED);
  });

  it("distinguishes total allowance and rolling window breaches", () => {
    const earlyTrip = makeTrip({
      id: "early",
      startDate: d("2024-01-01"),
      endDate: d("2024-01-20"),
    });
    const plannedTrip = makeTrip({
      id: "planned",
      startDate: d("2024-03-01"),
      endDate: d("2024-03-20"),
    });
    const rollingVisa = makeVisa({
      totalMaxLen: 30,
      rollingPeriodLen: 90,
      linkedTrips: [earlyTrip, plannedTrip],
    });

    const result = evaluateVisaPortfolio({
      visas: [rollingVisa],
      trips: [earlyTrip, plannedTrip],
      referenceDate: d("2024-02-01"),
    });

    expect(
      result.tripEvaluations.find((trip) => trip.trip.id === "planned")?.issueKinds
    ).toContain(TripIssueKind.TRIP_EXCEEDS_ROLLING_WINDOW_LIMIT);
    expect(
      result.alerts.some(
        (alert) => alert.kind === AlertKind.VISA_WILL_EXCEED_ON_PLANNED_TRIP
      )
    ).toBe(true);
  });

  it("generates a 365-day rolling projection with breach and reset markers", () => {
    const tripA = makeTrip({
      id: "trip-a",
      startDate: d("2024-01-01"),
      endDate: d("2024-02-15"),
    });
    const tripB = makeTrip({
      id: "trip-b",
      startDate: d("2024-03-01"),
      endDate: d("2024-03-30"),
    });
    const visa = makeVisa({
      totalMaxLen: 60,
      rollingPeriodLen: 180,
      linkedTrips: [tripA, tripB],
    });

    const result = evaluateVisaPortfolio({
      visas: [visa],
      trips: [tripA, tripB],
      referenceDate: d("2024-04-01"),
    });

    const projection = result.projections[0];
    expect(projection.points).toHaveLength(365);
    expect(projection.minimumRemainingDate).toBeDefined();
    expect(projection.nextResetDate).toBeDefined();
    expect(projection.firstProjectedBreachDate).toBe("2024-04-01");
  });

  it("selects dashboard cards with currently traveling outranking others", () => {
    const currentTrip = makeTrip({
      id: "current",
      startDate: d("2024-04-01"),
      endDate: d("2024-04-20"),
    });
    const nextTrip = makeTrip({
      id: "next",
      startDate: d("2024-05-01"),
      endDate: d("2024-05-10"),
    });
    const visa = makeVisa({
      totalMaxLen: 90,
      rollingPeriodLen: 180,
      linkedTrips: [currentTrip, nextTrip],
    });

    const result = evaluateVisaPortfolio({
      visas: [visa],
      trips: [currentTrip, nextTrip],
      referenceDate: d("2024-04-10"),
    });

    expect(result.dashboardCards[0]?.kind).toBe(CardKind.CURRENTLY_TRAVELING);
    expect(result.dashboardCards).toHaveLength(3);
    expect(result.dashboardCards.map((card) => card.kind)).toContain(CardKind.NEXT_TRIP);
    expect(result.dashboardCards.map((card) => card.kind)).toContain(
      CardKind.ROLLING_WINDOW_USAGE
    );
  });

  it("emits informational nudges for soon-valid visas and long inactivity gaps", () => {
    const oldTrip = makeTrip({
      id: "old-trip",
      startDate: d("2024-01-01"),
      endDate: d("2024-01-10"),
    });
    const visa = makeVisa({
      validFrom: d("2024-07-01"),
      totalMaxLen: 90,
      rollingPeriodLen: 180,
      linkedTrips: [oldTrip],
    });

    const result = evaluateVisaPortfolio({
      visas: [visa],
      trips: [oldTrip],
      referenceDate: d("2024-06-10"),
    });

    expect(result.alerts.map((alert) => alert.kind)).toContain(AlertKind.VISA_VALID_SOON);
    expect(result.alerts.map((alert) => alert.kind)).toContain(
      AlertKind.LONG_GAP_SINCE_LAST_TRIP
    );
  });

  it("suppresses expiry alerts for visas that have been renewed", () => {
    const renewedVisa = makeVisa({
      expires: d("2024-02-01"),
      renewalSuccessorId: "visa-2",
    });

    const result = evaluateVisaPortfolio({
      visas: [renewedVisa],
      trips: [],
      referenceDate: d("2024-03-01"),
    });

    expect(
      result.alerts.some(
        (alert) =>
          alert.kind === AlertKind.VISA_EXPIRED ||
          alert.kind === AlertKind.VISA_EXPIRING_SOON ||
          alert.kind === AlertKind.VISA_EXPIRING_WITH_UPCOMING_TRIPS
      )
    ).toBe(false);
  });
});
