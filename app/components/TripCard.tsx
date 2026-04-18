import { TimelineTrip } from "@/app/server-actions";
import { COLOURS, COUNTRY_LABELS } from "@/app/constants";

type VisaStatus = "covered" | "no-visa" | "invalid" | "not-required";

function getVisaStatus(trip: TimelineTrip): VisaStatus {
  if (!trip.visaRequired) return "not-required";
  if (!trip.visa) return "no-visa";
  if (!trip.visaValid) return "invalid";
  return "covered";
}

// COUNTRY_LABELS format is "Country Name 🇫🇷" — flag is always the last token
function splitCountryLabel(label = "") {
  const lastSpace = label.lastIndexOf(" ");
  if (lastSpace === -1) return { flag: "", name: label };
  return { flag: label.slice(lastSpace + 1), name: label.slice(0, lastSpace) };
}

function formatDates(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const sDay = s.getDate();
  const eDay = e.getDate();
  const sMon = s.toLocaleDateString(undefined, { month: "short" });
  const eMon = e.toLocaleDateString(undefined, { month: "short" });
  const sYear = s.getFullYear();
  const eYear = e.getFullYear();

  if (sYear !== eYear)
    return `${sDay} ${sMon} ${sYear} – ${eDay} ${eMon} ${eYear}`;
  if (sMon !== eMon) return `${sDay} ${sMon} – ${eDay} ${eMon}`;
  return `${sDay} – ${eDay} ${eMon}`;
}

// Strip uses warning colours when there's a visa issue; trip colour otherwise
function getStripColor(trip: TimelineTrip, status: VisaStatus): string {
  if (status === "no-visa") return "#d97706";
  if (status === "invalid") return "#dc2626";
  return COLOURS[trip.colour];
}

const STATUS_CONFIG: Record<
  VisaStatus,
  { label: string; subLabel: string; dotClass: string; textClass: string }
> = {
  covered: {
    label: "Validated",
    subLabel: "Visa required",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-600",
  },
  "no-visa": {
    label: "No visa assigned",
    subLabel: "Visa required",
    dotClass: "bg-amber-500",
    textClass: "text-amber-600",
  },
  invalid: {
    label: "Visa invalid",
    subLabel: "Visa required",
    dotClass: "bg-red-500",
    textClass: "text-red-600",
  },
  "not-required": {
    label: "No visa needed",
    subLabel: "Visa not required",
    dotClass: "bg-slate-300",
    textClass: "text-slate-400",
  },
};

export function TripCard({
  trip,
  isPast,
  onClick,
}: {
  trip: TimelineTrip;
  isPast: boolean;
  onClick: () => void;
}) {
  const status = getVisaStatus(trip);
  const cfg = STATUS_CONFIG[status];
  const stripColor = getStripColor(trip, status);
  const { flag, name: countryName } = splitCountryLabel(
    COUNTRY_LABELS[trip.countryCode]
  );

  return (
    <div
      onClick={onClick}
      className={`
        relative flex rounded-[18px] bg-white border border-[#dde4ef]
        shadow-[0_2px_12px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.04)]
        hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] hover:border-[#c8d3e2]
        transition-all duration-150 cursor-pointer overflow-hidden
        ${isPast ? "opacity-50" : ""}
      `}
    >
      {/* Coloured left strip — visa status colour when there's an issue */}
      <div className="w-1 shrink-0" style={{ backgroundColor: stripColor }} />

      <div className="flex-1 min-w-0">
        {/* ── Top section: trip info ── */}
        <div className="flex items-start justify-between gap-4 px-5 pt-[18px] pb-4">
          <div className="flex-1 min-w-0">
            {/* Flag + country name */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl leading-none">{flag}</span>
              <span className="text-[19px] font-black tracking-tight text-[#0d1829] leading-tight truncate">
                {countryName}
              </span>
            </div>

            {/* Optional trip name */}
            {trip.name && (
              <div className="text-[11px] text-[#8899ae] italic mb-2 truncate">
                {trip.name}
              </div>
            )}

            {/* Date range */}
            <div className="text-[18px] font-black tracking-tight text-[#0d1829] leading-none mt-2">
              {formatDates(trip.startDate, trip.endDate)}
            </div>
          </div>

          {/* Duration circle */}
          <div className="shrink-0 flex flex-col items-center justify-center w-[52px] h-[52px] rounded-full bg-[#f3f6fa] border border-[#dde4ef]">
            <span className="text-[17px] font-black tracking-tight text-[#0d1829] leading-none">
              {trip.durationDays}
            </span>
            <span className="text-[9px] font-bold text-[#8899ae] uppercase tracking-wide mt-0.5">
              days
            </span>
          </div>
        </div>

        {/* ── Tear line ── */}
        <div
          className="relative h-px"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, #dde4ef 0, #dde4ef 6px, transparent 6px, transparent 14px)",
          }}
        >
          {/* Semicircle notches — clipped by parent overflow-hidden */}
          <div className="absolute -left-[10px] -top-[9px] w-5 h-5 rounded-full bg-[#e8edf5] border border-[#c8d3e2] z-10" />
          <div className="absolute -right-[10px] -top-[9px] w-5 h-5 rounded-full bg-[#e8edf5] border border-[#c8d3e2] z-10" />
        </div>

        {/* ── Footer: visa status ── */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex gap-0.5 items-center">
            {trip.visaRequired && (
              <>
                <span className="material-symbols-outlined text-[16px] leading-none">
                  passport
                </span>
                <span className="text-[12px] font-semibold text-[#4a5d75]">
                  {trip.visa?.name ?? cfg.subLabel}
                </span>
              </>
            )}
          </div>
          <span
            className={`flex items-center gap-1.5 text-[12px] font-bold ${cfg.textClass}`}
          >
            <span
              className={`w-[7px] h-[7px] rounded-full shrink-0 ${cfg.dotClass}`}
            />
            {cfg.label}
          </span>
        </div>
      </div>
    </div>
  );
}
