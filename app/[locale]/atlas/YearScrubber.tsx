interface YearScrubberProps {
  years: number[];
  selectedYear: "all" | number;
  onSelectYear: (year: "all" | number) => void;
}

export function YearScrubber({
  years,
  selectedYear,
  onSelectYear,
}: YearScrubberProps) {
  return (
    <div className="flex gap-[6px] overflow-x-auto pb-1 mb-6">
      <button
        onClick={() => onSelectYear("all")}
        className={`font-mono text-[11px] tracking-[0.05em] px-3 py-[6px] rounded-full border flex-shrink-0 whitespace-nowrap ${
          selectedYear === "all"
            ? "border-fg bg-fg text-bg"
            : "border-border bg-transparent text-fg"
        }`}
      >
        All years
      </button>
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onSelectYear(year)}
          className={`font-mono text-[11px] tracking-[0.05em] px-3 py-[6px] rounded-full border flex-shrink-0 whitespace-nowrap ${
            selectedYear === year
              ? "border-fg bg-fg text-bg"
              : "border-border bg-transparent text-fg"
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
