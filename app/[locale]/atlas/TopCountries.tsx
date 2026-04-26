import { useLocale, useTranslations } from "next-intl";
import { COUNTRY_EMOJIS, getCountryName } from "@/app/constants";

interface TopCountriesProps {
  countries: { code: string; days: number; trips: number }[];
}

export function TopCountries({ countries }: TopCountriesProps) {
  const locale = useLocale();
  const t = useTranslations("atlas");

  if (countries.length === 0) {
    return (
      <div className="border border-dashed border-border-strong rounded text-center p-5 text-[13px] text-fg-muted">
        {t("noHistory")}
      </div>
    );
  }

  const maxDays = Math.max(...countries.map((c) => c.days));

  return (
    <div className="flex flex-col">
      {countries.map((country, idx) => (
        <div
          key={country.code}
          className={`grid grid-cols-[20px_24px_1fr_auto] items-center gap-3 py-[10px] ${
            idx < countries.length - 1 ? "border-b border-border" : ""
          }`}
        >
          {/* Index */}
          <div className="font-mono text-[10px] text-fg-faint tracking-[0.1em]">
            {String(idx + 1).padStart(2, "0")}
          </div>

          {/* Flag */}
          <div className="text-[16px]">
            {COUNTRY_EMOJIS[country.code] ?? "✈"}
          </div>

          {/* Name + bar */}
          <div className="min-w-0">
            <div className="font-body text-[14px] font-medium">
              {getCountryName(country.code, locale)}
            </div>
            <div className="h-[2px] mt-[6px] bg-border relative overflow-hidden">
              <div
                className="h-full bg-fg absolute top-0 left-0"
                style={{ width: `${(country.days / maxDays) * 100}%` }}
              />
            </div>
          </div>

          {/* Days + trips */}
          <div className="text-right">
            <div className="font-display text-[18px] leading-none">
              {country.days}
            </div>
            <div className="font-mono text-[9px] text-fg-muted uppercase mt-1">
              {country.trips} {country.trips === 1 ? "trip" : "trips"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
