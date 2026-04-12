import { vi, describe, it, expect } from "vitest";
 
// Mock all external dependencies so we can import pure functions in isolation
vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("./constants", () => ({ prisma: {} }));
vi.mock("@prisma/client", () => ({ PrismaClient: vi.fn() }));
vi.mock("./visas/server-actions", () => ({ visaInfoForDate: vi.fn() }));
 
import { getDaysBetweenDates, getDateWithOffset } from "./server-actions";
 
describe("getDateWithOffset", () => {
  it("returns the same date when offset is zero (UTC)", () => {
    // Mock getTimezoneOffset to return 0 for this test
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(0);

    const date = new Date("2024-06-15T00:00:00.000Z");
    const result = getDateWithOffset(date);
    expect(result.getTime()).toBe(date.getTime());
  });

  it("adjusts date forward for positive offset", () => {
    // Mock getTimezoneOffset to return 120 (UTC+2)
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(120);

    const date = new Date("2024-06-15T00:00:00.000Z");
    const expected = new Date("2024-06-15T02:00:00.000Z");
    const result = getDateWithOffset(date);
    expect(result.getTime()).toBe(expected.getTime());
  });

  it("adjusts date backward for negative offset", () => {
    // Mock getTimezoneOffset to return -60 (UTC-1)
    vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-60);

    const date = new Date("2024-06-15T00:00:00.000Z");
    const expected = new Date("2024-06-14T23:00:00.000Z");
    const result = getDateWithOffset(date);
    expect(result.getTime()).toBe(expected.getTime());
  });
});
 
describe("getDaysBetweenDates", () => {
  it("returns 0 for same-day dates", () => {
    const d = new Date("2024-01-01T00:00:00.000Z");
    expect(getDaysBetweenDates(d, d)).toBe(0);
  });
 
  it("counts 1 day for consecutive dates (exclusive)", () => {
    const start = new Date("2024-01-01T00:00:00.000Z");
    const end = new Date("2024-01-02T00:00:00.000Z");
    expect(getDaysBetweenDates(start, end)).toBe(1);
  });
 
  it("counts 7 days for a week (exclusive)", () => {
    const start = new Date("2024-01-01T00:00:00.000Z");
    const end = new Date("2024-01-08T00:00:00.000Z");
    expect(getDaysBetweenDates(start, end)).toBe(7);
  });
 
  it("adds 1 when includeStartAndEnd is true", () => {
    const start = new Date("2024-01-01T00:00:00.000Z");
    const end = new Date("2024-01-07T00:00:00.000Z");
    expect(getDaysBetweenDates(start, end, true)).toBe(7);
    expect(getDaysBetweenDates(start, end, false)).toBe(6);
  });
 
  it("returns absolute value regardless of argument order", () => {
    const start = new Date("2024-01-01T00:00:00.000Z");
    const end = new Date("2024-01-10T00:00:00.000Z");
    expect(getDaysBetweenDates(start, end)).toBe(
      getDaysBetweenDates(end, start)
    );
  });
 
  it("counts correctly across month boundaries", () => {
    const start = new Date("2024-01-28T00:00:00.000Z");
    const end = new Date("2024-02-03T00:00:00.000Z");
    expect(getDaysBetweenDates(start, end)).toBe(6);
  });
 
  it("counts correctly across year boundaries", () => {
    const start = new Date("2023-12-28T00:00:00.000Z");
    const end = new Date("2024-01-04T00:00:00.000Z");
    expect(getDaysBetweenDates(start, end)).toBe(7);
  });
 
  it("handles a 90-day Schengen-style period", () => {
    const start = new Date("2024-01-01T00:00:00.000Z");
    const end = new Date("2024-04-01T00:00:00.000Z");
    expect(getDaysBetweenDates(start, end)).toBe(91); // Jan(31) + Feb(29 leap) + Mar(31) = 91
  });
});
