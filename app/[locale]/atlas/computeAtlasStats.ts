import type { AtlasTrip } from "./server-actions";

export type AtlasStats = {
  totalDays: number;
  totalCountries: number;
  totalTrips: number;
  years: number[];
  topCountries: { code: string; days: number; trips: number }[];
  ribbonYear: number;
  ribbonDays: { date: string; abroad: boolean; visaId: string | null }[];
  heatmapDays: { date: string; abroad: boolean }[];
  longestTrip: {
    days: number;
    name: string;
    countryCode: string;
    startDate: string;
  } | null;
  busiestMonth: { days: number; year: number; month: number } | null;
  longestStreakAbroad: number;
  currentStreak: number;
  avgTripLength: number;
  mapTrips: { countryCode: string; startDate: string }[];
  mapCountryDays: Record<string, number>;
  visaColors: Record<string, string>;
};

const VISA_COLOR_PALETTE = [
  "oklch(65% 0.15 50)",   // amber
  "oklch(60% 0.13 200)",  // teal
  "oklch(58% 0.12 280)",  // blue
  "oklch(62% 0.14 130)",  // green
  "oklch(55% 0.12 350)",  // pink
];

function getDayCount(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // inclusive of both start and end
}

function isDateInRange(date: string, startDate: string, endDate: string): boolean {
  return date >= startDate && date <= endDate;
}

function dateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  let current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function getPastNDays(n: number): { start: string; end: string } {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - n);
  return {
    start: start.toISOString().split("T")[0],
    end: today.toISOString().split("T")[0],
  };
}

function dateToString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function computeAtlasStats(
  trips: AtlasTrip[],
  yearFilter: "all" | number
): AtlasStats {
  // Filter trips by year if needed
  const filteredTrips =
    yearFilter === "all"
      ? trips
      : trips.filter((t) => new Date(t.startDate).getFullYear() === yearFilter);

  // Headlines
  const totalDays = filteredTrips.reduce(
    (sum, trip) => sum + getDayCount(trip.startDate, trip.endDate),
    0
  );
  const countries = new Set(filteredTrips.map((t) => t.countryCode));
  const totalCountries = countries.size;
  const totalTrips = filteredTrips.length;

  // Years
  const allYears = new Set(trips.map((t) => new Date(t.startDate).getFullYear()));
  const years = Array.from(allYears).sort((a, b) => a - b);

  // Top countries
  const byCountry: Record<
    string,
    { code: string; days: number; trips: number }
  > = {};
  for (const trip of filteredTrips) {
    if (!byCountry[trip.countryCode]) {
      byCountry[trip.countryCode] = {
        code: trip.countryCode,
        days: 0,
        trips: 0,
      };
    }
    byCountry[trip.countryCode].days += getDayCount(
      trip.startDate,
      trip.endDate
    );
    byCountry[trip.countryCode].trips += 1;
  }
  const topCountries = Object.values(byCountry)
    .sort((a, b) => b.days - a.days)
    .slice(0, 8);

  // Ribbon year
  const ribbonYear =
    yearFilter === "all" ? new Date().getFullYear() : yearFilter;
  const ribbonStart = `${ribbonYear}-01-01`;
  const ribbonEnd = `${ribbonYear}-12-31`;
  const ribbonDates = dateRange(ribbonStart, ribbonEnd);
  const ribbonTripsForYear = trips.filter(
    (t) => new Date(t.startDate).getFullYear() === ribbonYear
  );
  const ribbonDays = ribbonDates.map((date) => {
    const trip = ribbonTripsForYear.find(
      (t) => isDateInRange(date, t.startDate, t.endDate)
    );
    return {
      date,
      abroad: !!trip,
      visaId: trip?.visaId ?? null,
    };
  });

  // Heatmap — past 365 days
  const heatmapRange = getPastNDays(365);
  const heatmapDates = dateRange(heatmapRange.start, heatmapRange.end);
  const heatmapDays = heatmapDates.map((date) => {
    const trip = trips.find(
      (t) => isDateInRange(date, t.startDate, t.endDate)
    );
    return {
      date,
      abroad: !!trip,
    };
  });

  // Records
  const tripsWithDays = filteredTrips.map((trip) => ({
    ...trip,
    days: getDayCount(trip.startDate, trip.endDate),
  }));

  const longestTrip =
    tripsWithDays.length > 0
      ? (() => {
          const longest = tripsWithDays.reduce((max, t) =>
            t.days > max.days ? t : max
          );
          return {
            days: longest.days,
            name: longest.name || longest.countryCode,
            countryCode: longest.countryCode,
            startDate: longest.startDate,
          };
        })()
      : null;

  // Busiest month — count days abroad per month
  const monthDays: Record<string, number> = {};
  for (const trip of filteredTrips) {
    for (const date of dateRange(trip.startDate, trip.endDate)) {
      const [year, month] = date.split("-");
      const key = `${year}-${month}`;
      monthDays[key] = (monthDays[key] || 0) + 1;
    }
  }
  const busiestMonth =
    Object.keys(monthDays).length > 0
      ? (() => {
          const [yearMonth, days] = Object.entries(monthDays).reduce((max, [k, v]) =>
            v > max[1] ? [k, v] : max
          );
          const [year, month] = yearMonth.split("-");
          return { days, year: parseInt(year), month: parseInt(month) };
        })()
      : null;

  // Streaks — longest consecutive days abroad
  const allDates = new Set(
    trips.flatMap((t) => dateRange(t.startDate, t.endDate))
  );
  const sortedDates = Array.from(allDates).sort();
  let longestStreakAbroad = 0;
  let currentStreak = 0;

  if (sortedDates.length > 0) {
    let streakStart = sortedDates[0];

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      prevDate.setDate(prevDate.getDate() + 1);

      if (dateToString(prevDate) !== sortedDates[i]) {
        // Gap found, end of streak
        const streakDays = getDayCount(streakStart, sortedDates[i - 1]);
        if (streakDays > longestStreakAbroad) {
          longestStreakAbroad = streakDays;
        }
        streakStart = sortedDates[i];
      }
    }

    // Handle last streak
    const finalStreakDays = getDayCount(
      streakStart,
      sortedDates[sortedDates.length - 1]
    );
    if (finalStreakDays > longestStreakAbroad) {
      longestStreakAbroad = finalStreakDays;
    }

    // Current streak — if the last abroad date is today or yesterday, count from start to today
    const today = dateToString(new Date());
    const lastAbroadDate = sortedDates[sortedDates.length - 1];
    const lastDate = new Date(lastAbroadDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0 || diffDays === 1) {
      // Still abroad or just returned today
      currentStreak = getDayCount(streakStart, today);
    } else {
      currentStreak = 0;
    }
  }

  // Average trip length
  const avgTripLength =
    tripsWithDays.length > 0
      ? Math.round(
          tripsWithDays.reduce((sum, t) => sum + t.days, 0) /
            tripsWithDays.length
        )
      : 0;

  // Map data
  const mapTrips = filteredTrips.map((t) => ({
    countryCode: t.countryCode,
    startDate: t.startDate,
  }));
  const mapCountryDays: Record<string, number> = {};
  for (const trip of filteredTrips) {
    const days = getDayCount(trip.startDate, trip.endDate);
    mapCountryDays[trip.countryCode] =
      (mapCountryDays[trip.countryCode] || 0) + days;
  }

  // Visa colors
  const visaIds = new Set<string>();
  for (const trip of trips) {
    if (trip.visaId) visaIds.add(trip.visaId);
  }
  const visaColors: Record<string, string> = {};
  Array.from(visaIds).forEach((visaId, index) => {
    visaColors[visaId] = VISA_COLOR_PALETTE[index % VISA_COLOR_PALETTE.length];
  });

  return {
    totalDays,
    totalCountries,
    totalTrips,
    years,
    topCountries,
    ribbonYear,
    ribbonDays,
    heatmapDays,
    longestTrip,
    busiestMonth,
    longestStreakAbroad,
    currentStreak,
    avgTripLength,
    mapTrips,
    mapCountryDays,
    visaColors,
  };
}
