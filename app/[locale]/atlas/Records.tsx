import { useLocale } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import type { AtlasStats } from "./computeAtlasStats";
import { COUNTRY_EMOJIS, getCountryName } from "@/app/constants";

interface RecordsProps {
  stats: AtlasStats;
  t: (key: string, values?: Record<string, any>) => string;
}

export function Records({ stats, t }: RecordsProps) {
  const locale = useLocale();

  const records: {
    kicker: string;
    value: number;
    unit: string;
    detail?: string;
    sub?: string;
  }[] = [];

  if (stats.longestTrip) {
    records.push({
      kicker: t("longestTrip"),
      value: stats.longestTrip.days,
      unit: "days",
      detail: `${COUNTRY_EMOJIS[stats.longestTrip.countryCode] ?? "✈"} ${stats.longestTrip.name}`,
      sub: new Date(stats.longestTrip.startDate).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    });
  }

  if (stats.busiestMonth) {
    const monthName = new Date(stats.busiestMonth.year, stats.busiestMonth.month - 1).toLocaleDateString(
      locale,
      { month: "short", year: "numeric" }
    );
    records.push({
      kicker: t("busiestMonth"),
      value: stats.busiestMonth.days,
      unit: t("daysAway"),
      detail: monthName,
    });
  }

  records.push({
    kicker: t("longestStreak"),
    value: stats.longestStreakAbroad,
    unit: t("consecutiveDays"),
  });

  if (stats.currentStreak > 0) {
    records.push({
      kicker: t("currentStreak"),
      value: stats.currentStreak,
      unit: t("daysRunning"),
      detail: "👀",
    });
  }

  records.push({
    kicker: t("avgTripLength"),
    value: stats.avgTripLength,
    unit: "days",
  });

  return (
    <div className="flex flex-col">
      {records.map((record, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-[1fr_auto] items-baseline gap-3 py-[14px] ${
            idx < records.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <div>
            <div className="font-mono text-[10px] text-fg-faint tracking-[0.1em] uppercase mb-[6px]">
              {record.kicker}
            </div>
            {record.detail && (
              <div className="font-body text-[14px]">{record.detail}</div>
            )}
            {record.sub && (
              <div className="font-mono text-[10px] text-fg-muted mt-0.5">
                {record.sub}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="font-display text-[32px] leading-none">
              {record.value}
            </div>
            <div className="font-mono text-[9px] text-fg-muted tracking-[0.1em] uppercase mt-1">
              {record.unit}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
