interface YearRibbonProps {
  year: number;
  ribbonDays: { date: string; abroad: boolean; visaId: string | null }[];
  visaColors: Record<string, string>;
}

export function YearRibbon({
  year,
  ribbonDays,
  visaColors,
}: YearRibbonProps) {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const currentYear = today.getFullYear();
  const todayInRibbon =
    currentYear === year
      ? ribbonDays.findIndex((d) => d.date === todayString)
      : -1;

  // Calculate daysAbroad and daysHome
  const daysAbroad = ribbonDays.filter((d) => d.abroad).length;
  const daysHome = ribbonDays.length - daysAbroad;

  // Get unique visas in this ribbon
  const visasInRibbon = new Set<string>();
  for (const day of ribbonDays) {
    if (day.abroad && day.visaId) visasInRibbon.add(day.visaId);
  }

  const getMonthLabels = () => {
    const labels: { dayIndex: number; month: string }[] = [];
    let currentMonth = -1;

    for (let i = 0; i < ribbonDays.length; i++) {
      const date = new Date(ribbonDays[i].date);
      if (date.getMonth() !== currentMonth) {
        const monthName = date.toLocaleDateString("en-US", {
          month: "short",
        });
        labels.push({
          dayIndex: i,
          month: monthName.toUpperCase(),
        });
        currentMonth = date.getMonth();
      }
    }

    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-baseline mb-[10px]">
        <div className="font-display text-base italic">{year}</div>
        <div className="font-mono text-[10px] text-fg-muted">
          {daysAbroad}d abroad · {daysHome}d home
        </div>
      </div>

      {/* SVG Ribbon */}
      <div className="relative">
        <svg
          width="100%"
          height="36"
          viewBox={`0 0 ${ribbonDays.length} 36`}
          preserveAspectRatio="none"
          className="w-full"
        >
          {/* Base track */}
          <rect
            x="0"
            y="13"
            width={ribbonDays.length}
            height="10"
            fill="var(--color-bg-raised)"
            stroke="var(--color-border)"
            strokeWidth="0.3"
          />

          {/* Day rects */}
          {ribbonDays.map((day, idx) => {
            const color = day.abroad
              ? day.visaId && visaColors[day.visaId]
                ? visaColors[day.visaId]
                : "var(--color-fg)"
              : "transparent";

            return day.abroad ? (
              <rect
                key={idx}
                x={idx}
                y="13"
                width="1"
                height="10"
                fill={color}
              />
            ) : null;
          })}

          {/* Today marker */}
          {todayInRibbon >= 0 && (
            <line
              x1={todayInRibbon}
              y1="8"
              x2={todayInRibbon}
              y2="28"
              stroke="var(--color-fg)"
              strokeWidth="0.8"
            />
          )}
        </svg>

        {/* Month labels overlay */}
        <div className="absolute top-0 left-0 right-0 h-[36px] pointer-events-none">
          {monthLabels.map((label, idx) => (
            <div
              key={`month-${idx}`}
              className="absolute font-mono text-[8px] text-fg-faint tracking-[0.12em]"
              style={{
                left: `${(label.dayIndex / ribbonDays.length) * 100}%`,
                top: "0",
              }}
            >
              {label.month}
            </div>
          ))}
        </div>
      </div>

      {/* Visa legend */}
      {visasInRibbon.size > 0 && (
        <div className="flex flex-wrap gap-4 mt-[14px]">
          {Array.from(visasInRibbon).map((visaId) => (
            <div key={visaId} className="flex items-center gap-2">
              <div
                className="w-[10px] h-[10px] rounded-sm flex-shrink-0"
                style={{ background: visaColors[visaId] || "var(--color-fg)" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
