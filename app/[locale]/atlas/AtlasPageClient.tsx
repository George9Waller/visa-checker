"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Btn, Icon, PageContainer, Stack, Text, Kicker } from "@/app/design";
import type { AtlasTrip } from "./server-actions";
import { computeAtlasStats } from "./computeAtlasStats";
import { AtlasMap } from "./AtlasMap";
import { YearScrubber } from "./YearScrubber";
import { YearRibbon } from "./YearRibbon";
import { TopCountries } from "./TopCountries";
import { CalendarHeatmap } from "./CalendarHeatmap";
import { Records } from "./Records";

interface AtlasPageClientProps {
  trips: AtlasTrip[];
}

export function AtlasPageClient({ trips }: AtlasPageClientProps) {
  const t = useTranslations("atlas");
  const [yearFilter, setYearFilter] = useState<"all" | number>("all");

  const stats = useMemo(
    () => computeAtlasStats(trips, yearFilter),
    [trips, yearFilter]
  );

  const hasHistory = trips.length > 0;

  return (
    <PageContainer className="pb-16 pt-6">
      {/* Header bar */}
      <div className="flex items-center gap-[10px] pb-5">
        <Btn
          as={Link}
          href="/"
          variant="outline"
          size="sm"
          className="rounded-full w-9 h-9 p-0 flex items-center justify-center"
        >
          <Icon name="chevron-left" size="sm" />
        </Btn>
        <span className="flex-1 font-mono text-[11px] tracking-[0.1em] uppercase text-fg-muted">
          {t("title")}
        </span>
        <Btn
          variant="primary"
          size="sm"
          className="rounded-full h-9 px-[14px] font-mono text-[11px] tracking-[0.1em] uppercase"
          disabled={!hasHistory}
        >
          {t("share")}
        </Btn>
      </div>

      {/* Map */}
      {hasHistory && <AtlasMap stats={stats} />}

      {/* Year scrubber */}
      {hasHistory && (
        <YearScrubber
          years={stats.years}
          selectedYear={yearFilter}
          onSelectYear={setYearFilter}
        />
      )}

      {/* Headlines */}
      <div className="grid grid-cols-3 border-t border-b border-border py-5 mb-9">
        <div>
          <div className="font-display text-[clamp(28px,9vw,44px)] leading-[0.95]">
            {stats.totalDays}
          </div>
          <div className="font-mono text-[10px] text-fg-muted tracking-[0.1em] uppercase">
            {t("days")}
          </div>
          <div className="text-[11px] text-fg-muted mt-0.5">
            {yearFilter === "all"
              ? t("daysAbroad")
              : t("daysAbroadInYear", { year: yearFilter })}
          </div>
        </div>
        <div className="border-l border-border pl-3">
          <div className="font-display text-[clamp(28px,9vw,44px)] leading-[0.95]">
            {stats.totalCountries}
          </div>
          <div className="font-mono text-[10px] text-fg-muted tracking-[0.1em] uppercase">
            {t("countries")}
          </div>
        </div>
        <div className="border-l border-border pl-3">
          <div className="font-display text-[clamp(28px,9vw,44px)] leading-[0.95]">
            {stats.totalTrips}
          </div>
          <div className="font-mono text-[10px] text-fg-muted tracking-[0.1em] uppercase">
            {t("trips")}
          </div>
        </div>
      </div>

      {/* Sections */}
      {hasHistory ? (
        <Stack className="gap-9">
          {/* Year ribbon */}
          <div>
            <div className="flex items-baseline gap-[10px] mb-[14px]">
              <span className="font-mono text-[10px] text-fg-faint tracking-[0.15em]">
                — 01
              </span>
              <h2 className="font-display text-[22px] leading-[1.05]">
                {t("section1")}
              </h2>
            </div>
            <YearRibbon
              year={stats.ribbonYear}
              ribbonDays={stats.ribbonDays}
              visaColors={stats.visaColors}
            />
          </div>

          {/* Top countries */}
          <div>
            <div className="flex items-baseline gap-[10px] mb-[14px]">
              <span className="font-mono text-[10px] text-fg-faint tracking-[0.15em]">
                — 02
              </span>
              <h2 className="font-display text-[22px] leading-[1.05]">
                {t("section2")}
              </h2>
            </div>
            <TopCountries countries={stats.topCountries} />
          </div>

          {/* Calendar heatmap */}
          <div>
            <div className="flex items-baseline gap-[10px] mb-[14px]">
              <span className="font-mono text-[10px] text-fg-faint tracking-[0.15em]">
                — 03
              </span>
              <h2 className="font-display text-[22px] leading-[1.05]">
                {t("section3")}
              </h2>
            </div>
            <CalendarHeatmap heatmapDays={stats.heatmapDays} t={t} />
          </div>

          {/* Records */}
          <div>
            <div className="flex items-baseline gap-[10px] mb-[14px]">
              <span className="font-mono text-[10px] text-fg-faint tracking-[0.15em]">
                — 04
              </span>
              <h2 className="font-display text-[22px] leading-[1.05]">
                {t("section4")}
              </h2>
            </div>
            <Records stats={stats} t={t} />
          </div>
        </Stack>
      ) : (
        <div className="border border-dashed border-border-strong rounded text-center p-5 text-[13px] text-fg-muted">
          {t("noHistory")}
        </div>
      )}
    </PageContainer>
  );
}
