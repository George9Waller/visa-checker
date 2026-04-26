import { describe, expect, it } from "vitest";
import { buildVisaChainGroups } from "./chains";

const d = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

describe("buildVisaChainGroups", () => {
  it("puts the newest visa in each chain first and nests predecessors beneath it", () => {
    const groups = buildVisaChainGroups([
      {
        id: "visa-old",
        name: "Schengen 2024",
        type: "tourist",
        countries: ["FR"],
        validFrom: d("2024-01-01"),
        expires: d("2024-06-01"),
        renewedFromId: null,
      },
      {
        id: "visa-new",
        name: "Schengen 2025",
        type: "tourist",
        countries: ["FR"],
        validFrom: d("2024-06-15"),
        expires: d("2025-06-15"),
        renewedFromId: "visa-old",
      },
      {
        id: "visa-alone",
        name: "Japan ETA",
        type: "visitor",
        countries: ["JP"],
        validFrom: d("2024-02-01"),
        expires: d("2024-12-01"),
        renewedFromId: null,
      },
    ]);

    expect(groups[0]?.primary.id).toBe("visa-new");
    expect(groups[0]?.history.map((visa) => visa.id)).toEqual(["visa-old"]);
    expect(groups[1]?.primary.id).toBe("visa-alone");
  });
});
