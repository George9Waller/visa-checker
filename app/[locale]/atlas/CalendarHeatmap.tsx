interface CalendarHeatmapProps {
  heatmapDays: { date: string; abroad: boolean }[];
  t: (key: string) => string;
}

const CELL_SIZE = 6;
const CELL_GAP = 2;

export function CalendarHeatmap({ heatmapDays, t }: CalendarHeatmapProps) {
  const COLS = 53; // 53 weeks
  const ROWS = 7; // Monday-Sunday
  const WIDTH = COLS * (CELL_SIZE + CELL_GAP);
  const HEIGHT = ROWS * (CELL_SIZE + CELL_GAP) + 18; // +18 for month labels

  const getMonthLabels = () => {
    const labels: { x: number; month: string }[] = [];
    let currentMonth = -1;
    let currentCol = 0;

    for (let i = 0; i < heatmapDays.length; i++) {
      const date = new Date(heatmapDays[i].date);
      if (date.getMonth() !== currentMonth) {
        const monthName = date.toLocaleDateString("en-US", {
          month: "short",
        });
        labels.push({
          x: currentCol * (CELL_SIZE + CELL_GAP),
          month: monthName,
        });
        currentMonth = date.getMonth();
      }
      if ((i + 1) % 7 === 0) currentCol++;
    }

    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="rounded-[--radius-lg] bg-bg-raised border border-border p-4 overflow-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        className="font-mono text-[7px]"
      >
        {/* Month labels */}
        {monthLabels.map((label, idx) => (
          <text
            key={`month-${idx}`}
            x={label.x + 2}
            y="10"
            fill="var(--color-fg-faint)"
            letterSpacing="0.1em"
            fontSize="7"
          >
            {label.month}
          </text>
        ))}

        {/* Cells */}
        {heatmapDays.map((day, idx) => {
          const week = Math.floor(idx / 7);
          const dow = idx % 7;
          const x = week * (CELL_SIZE + CELL_GAP);
          const y = 18 + dow * (CELL_SIZE + CELL_GAP);

          return (
            <rect
              key={`cell-${idx}`}
              x={x}
              y={y}
              width={CELL_SIZE}
              height={CELL_SIZE}
              rx="1.2"
              fill={day.abroad ? "var(--color-accent)" : "var(--color-border)"}
              opacity={day.abroad ? 1 : 0.4}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-[10px] font-mono text-[10px] text-fg-muted uppercase">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-sm"
            style={{ background: "var(--color-border)", opacity: 0.4 }}
          />
          <span>{t("home")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-sm"
            style={{ background: "var(--color-accent)" }}
          />
          <span>{t("abroad")}</span>
        </div>
        <div className="ml-auto text-fg-faint">{t("past365")}</div>
      </div>
    </div>
  );
}
