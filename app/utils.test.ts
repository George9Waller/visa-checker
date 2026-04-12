import { describe, it, expect } from "vitest";
import { convertDateToString } from "./utils";
 
describe("convertDateToString", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(convertDateToString(new Date("2024-03-15T00:00:00.000Z"))).toBe(
      "2024-03-15"
    );
  });
 
  it("zero-pads month and day", () => {
    expect(convertDateToString(new Date("2024-01-05T00:00:00.000Z"))).toBe(
      "2024-01-05"
    );
  });
 
  it("handles year boundary correctly", () => {
    expect(convertDateToString(new Date("2024-12-31T00:00:00.000Z"))).toBe(
      "2024-12-31"
    );
  });
});
