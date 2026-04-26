"use client";

import { useLocale, useTranslations } from "next-intl";
import { ProjectionPoint } from "@/app/visas/evaluation";

export type { ProjectionPoint } from "@/app/visas/evaluation";

export interface SchengenProjectionChartProps {
  points: ProjectionPoint[];
  limit: number;
  today: Date;
}

export function SchengenProjectionChart({
  points,
  limit,
  today,
}: SchengenProjectionChartProps) {
  const locale = useLocale();
  const t = useTranslations("visa");
  if (!points.length) return null;

  const W = 600,
    H = 156,
    PL = 36,
    PR = 16,
    PT = 22,
    PB = 34;
  const plotW = W - PL - PR;
  const plotH = H - PT - PB;

  const x = (i: number) => PL + (i / (points.length - 1)) * plotW;
  const y = (v: number) => PT + (1 - v / limit) * plotH;

  const pathRemaining = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.remainingDays).toFixed(1)}`
    )
    .join(" ");

  const todayMs = today.getTime();
  const todayIdx = points.reduce((best, p, i) => {
    const date = new Date(p.date);
    const bestDate = new Date(points[best].date);
    return Math.abs(date.getTime() - todayMs) <
      Math.abs(bestDate.getTime() - todayMs)
      ? i
      : best;
  }, 0);

  const minIdx = points.reduce(
    (m, p, i) => (p.remainingDays < points[m].remainingDays ? i : m),
    0
  );
  const minPoint = points[minIdx];

  const monthLabels: { i: number; label: string }[] = [];
  let lastMonth = -1;
  for (let i = 0; i < points.length; i++) {
    const m = new Date(points[i].date).getMonth();
    if (m !== lastMonth) {
      monthLabels.push({
        i,
        label: new Date(points[i].date).toLocaleDateString(locale, {
          month: "short",
        }),
      });
      lastMonth = m;
    }
  }

  const gridLines =
    limit === 90
      ? [0, 30, 60, 90]
      : [0, Math.round(limit / 3), Math.round((2 * limit) / 3), limit];
  const endDate =
    points[points.length - 1]?.date ??
    new Date(today.getTime() + 365 * 86400000);

  type AreaSegment = { startIdx: number; endIdx: number; direction: "up" | "down" };
  const areaSegments: AreaSegment[] = [];

  let segStart = 0;
  let segDir: "up" | "down" | null = null;

  for (let i = 0; i < points.length - 1; i++) {
    const delta = points[i + 1].remainingDays - points[i].remainingDays;
    const pairDir: "up" | "down" | null =
      delta < 0 ? "down" : delta > 0 ? "up" : segDir;

    if (pairDir === null) {
      segStart = i + 1;
      continue;
    }

    if (segDir === null) {
      segDir = pairDir;
    }

    if (pairDir !== segDir) {
      areaSegments.push({ startIdx: segStart, endIdx: i, direction: segDir });
      segStart = i;
      segDir = pairDir;
    }
  }

  if (segDir !== null && segStart < points.length - 1) {
    areaSegments.push({
      startIdx: segStart,
      endIdx: points.length - 1,
      direction: segDir,
    });
  }

  const buildSegmentPath = (startIdx: number, endIdx: number): string => {
    const top = Array.from({ length: endIdx - startIdx + 1 }, (_, k) => {
      const i = startIdx + k;
      return `${i === startIdx ? "M" : "L"} ${x(i).toFixed(1)} ${y(points[i].remainingDays).toFixed(1)}`;
    }).join(" ");
    return `${top} L ${x(endIdx).toFixed(1)} ${y(0).toFixed(1)} L ${x(startIdx).toFixed(1)} ${y(0).toFixed(1)} Z`;
  };

  return (
    <div className="">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <div className="font-body font-semibold text-md text-fg">
          {t("projectionTitle")}
        </div>
        <div className="font-mono text-[10px] tracking-wide text-fg-faint">
          {today.toLocaleDateString(locale, { day: "numeric", month: "short" })} →{" "}
          {new Date(endDate).toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
          })}
        </div>
      </div>
      <div className="font-mono text-[11px] text-fg-muted tracking-[0.03em] mb-2.5">
        {t("projectionAssumption")}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        {/* Gridlines */}
        {gridLines.map((v) => (
          <g key={v}>
            <line
              x1={PL}
              x2={W - PR}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--color-border)"
              strokeWidth="0.5"
              strokeDasharray={v === 0 || v === limit ? "0" : "2,3"}
            />
            <text
              x={PL - 6}
              y={y(v) + 3}
              fontSize="9"
              textAnchor="end"
              fill="var(--color-fg-faint)"
              fontFamily="var(--font-mono)"
            >
              {v}
            </text>
          </g>
        ))}

        {/* Danger zone (remaining < 15) */}
        <rect
          x={PL}
          y={y(15)}
          width={plotW}
          height={y(0) - y(15)}
          fill="var(--color-danger)"
          opacity="0.05"
        />

        {/* Segmented area fill: red when decreasing, green when increasing */}
        {areaSegments.map((seg, i) => (
          <path
            key={i}
            d={buildSegmentPath(seg.startIdx, seg.endIdx)}
            fill={
              seg.direction === "down"
                ? "var(--color-danger)"
                : "var(--color-ok)"
            }
            opacity="0.15"
          />
        ))}

        {/* Projection line */}
        <path
          d={pathRemaining}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.8"
        />

        {/* TODAY marker */}
        <line
          x1={x(todayIdx)}
          y1={PT}
          x2={x(todayIdx)}
          y2={y(0)}
          stroke="var(--color-fg)"
          strokeWidth="0.8"
          strokeDasharray="2,2"
        />

        {/* Min remaining point */}
        <circle
          cx={x(minIdx)}
          cy={y(minPoint.remainingDays)}
          r="3.5"
          fill="var(--color-bg-raised)"
          stroke="var(--color-danger)"
          strokeWidth="1.5"
        />
        <text
          x={x(minIdx)}
          y={y(minPoint.remainingDays) - 8}
          fontSize="9"
          textAnchor="middle"
          fill="var(--color-danger)"
          fontFamily="var(--font-mono)"
          fontWeight="600"
        >
          {t("minRemaining", { remaining: minPoint.remainingDays })}
        </text>

        {/* Month labels */}
        {monthLabels.map((m, i) => (
          <text
            key={i}
            x={x(m.i)}
            y={H - 10}
            fontSize="9"
            fill="var(--color-fg-muted)"
            fontFamily="var(--font-mono)"
            letterSpacing="0.05em"
          >
            {m.label.toUpperCase()}
          </text>
        ))}
      </svg>

      <div className="flex gap-3.5 mt-2.5 flex-wrap font-mono text-[10px] text-fg-muted tracking-wide">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-3 h-0.5 bg-accent" />
          {t("daysRemainingLegend")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 bg-danger opacity-10" />
          {t("tightZoneLegend")}
        </span>
      </div>
    </div>
  );
}
