import { COUNTRIES_GEO } from "./countries-geo";
import type { AtlasStats } from "./computeAtlasStats";

interface AtlasMapProps {
  stats: AtlasStats;
}

const SVG_WIDTH = 360;
const SVG_HEIGHT = 220;

export function AtlasMap({ stats }: AtlasMapProps) {
  // Get visited countries and their bounds
  const visitedCountries = Object.keys(stats.mapCountryDays);
  const countryCoords = visitedCountries
    .map((code) => COUNTRIES_GEO[code])
    .filter((c) => c !== undefined);

  if (countryCoords.length === 0) {
    // No trips, show default Europe-centric view
    var minLon = -15,
      maxLon = 30,
      minLat = 35,
      maxLat = 65;
  } else {
    // Calculate bounds with margins
    const lons = countryCoords.map((c) => c.lon);
    const lats = countryCoords.map((c) => c.lat);

    minLon = Math.min(...lons) - 8;
    maxLon = Math.max(...lons) + 8;
    minLat = Math.min(...lats) - 5;
    maxLat = Math.max(...lats) + 5;

    // Enforce minimum extent
    let lonExtent = maxLon - minLon;
    let latExtent = maxLat - minLat;

    if (lonExtent < 30) {
      const centerLon = (minLon + maxLon) / 2;
      minLon = centerLon - 15;
      maxLon = centerLon + 15;
    }
    if (latExtent < 20) {
      const centerLat = (minLat + maxLat) / 2;
      minLat = centerLat - 10;
      maxLat = centerLat + 10;
    }
  }

  // Equirectangular projection: lon → x, lat → y
  const lonToX = (lon: number) => {
    return ((lon - minLon) / (maxLon - minLon)) * SVG_WIDTH;
  };
  const latToY = (lat: number) => {
    return ((maxLat - lat) / (maxLat - minLat)) * SVG_HEIGHT;
  };

  // All countries for reference
  const allCountryCodes = Object.keys(COUNTRIES_GEO);
  const maxDaysInCountry = Math.max(...Object.values(stats.mapCountryDays), 1);

  // Trip arcs — connect consecutive trips
  const tripArcs: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 1; i < stats.mapTrips.length; i++) {
    const from = COUNTRIES_GEO[stats.mapTrips[i - 1].countryCode];
    const to = COUNTRIES_GEO[stats.mapTrips[i].countryCode];

    if (from && to && from.lon !== to.lon && from.lat !== to.lat) {
      const x1 = lonToX(from.lon);
      const y1 = latToY(from.lat);
      const x2 = lonToX(to.lon);
      const y2 = latToY(to.lat);

      // Quadratic bezier curve with arc
      const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const controlShift = Math.min(dist * 0.25, 30);
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2 - controlShift;

      tripArcs.push({ x1, y1, x2, y2 });
    }
  }

  return (
    <div className="relative rounded-[--radius-lg] overflow-hidden bg-bg-sunken border border-border aspect-[360/280] mb-7">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        width="100%"
        height="100%"
        className="w-full h-full"
      >
        <defs>
          {/* Grid pattern */}
          <pattern
            id="atlas-grid"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0H0V20"
              stroke="var(--color-border)"
              strokeWidth="0.3"
              fill="none"
              opacity="0.6"
            />
          </pattern>

          {/* Radial glow for dots */}
          <radialGradient id="atlas-glow">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grid background */}
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#atlas-grid)" />

        {/* Lat/lon labels */}
        <text
          x="6"
          y="14"
          fontFamily="JetBrains Mono, monospace"
          fontSize="7"
          fill="var(--color-fg-faint)"
          letterSpacing="0.15em"
        >
          {Math.round(maxLat)}°N
        </text>
        <text
          x="6"
          y={SVG_HEIGHT - 4}
          fontFamily="JetBrains Mono, monospace"
          fontSize="7"
          fill="var(--color-fg-faint)"
          letterSpacing="0.15em"
        >
          {Math.round(minLat)}°N
        </text>
        <text
          x={SVG_WIDTH - 30}
          y={SVG_HEIGHT - 4}
          fontFamily="JetBrains Mono, monospace"
          fontSize="7"
          fill="var(--color-fg-faint)"
          letterSpacing="0.15em"
          textAnchor="start"
        >
          {Math.round(maxLon)}°E
        </text>

        {/* Unvisited country dots */}
        {allCountryCodes.map((code) => {
          const coord = COUNTRIES_GEO[code];
          if (
            !coord ||
            visitedCountries.includes(code) ||
            coord.lon < minLon ||
            coord.lon > maxLon ||
            coord.lat < minLat ||
            coord.lat > maxLat
          ) {
            return null;
          }
          const x = lonToX(coord.lon);
          const y = latToY(coord.lat);
          return (
            <circle
              key={`unvisited-${code}`}
              cx={x}
              cy={y}
              r="1.4"
              fill="var(--color-fg-faint)"
              opacity="0.4"
            />
          );
        })}

        {/* Trip arcs */}
        {tripArcs.map((arc, idx) => {
          const cx = (arc.x1 + arc.x2) / 2;
          const cy = (arc.y1 + arc.y2) / 2;
          const dist = Math.sqrt(
            (arc.x2 - arc.x1) ** 2 + (arc.y2 - arc.y1) ** 2
          );
          const controlShift = Math.min(dist * 0.25, 30);
          const controlY = cy - controlShift;

          return (
            <path
              key={`arc-${idx}`}
              d={`M${arc.x1},${arc.y1} Q${cx},${controlY} ${arc.x2},${arc.y2}`}
              stroke="var(--color-accent)"
              strokeWidth="0.6"
              strokeDasharray="2 2"
              fill="none"
              opacity="0.5"
            />
          );
        })}

        {/* Visited country dots with glow */}
        {visitedCountries.map((code) => {
          const coord = COUNTRIES_GEO[code];
          if (
            !coord ||
            coord.lon < minLon ||
            coord.lon > maxLon ||
            coord.lat < minLat ||
            coord.lat > maxLat
          ) {
            return null;
          }
          const x = lonToX(coord.lon);
          const y = latToY(coord.lat);
          const days = stats.mapCountryDays[code] || 0;
          const r = 2.5 + (days / maxDaysInCountry) * 6;

          return (
            <g key={`visited-${code}`}>
              {/* Glow */}
              <circle
                cx={x}
                cy={y}
                r={r * 2.5}
                fill="url(#atlas-glow)"
                opacity="0.6"
              />
              {/* Solid dot */}
              <circle
                cx={x}
                cy={y}
                r={r}
                fill="var(--color-accent)"
                stroke="var(--color-bg)"
                strokeWidth="1"
              />
              {/* Label */}
              <text
                x={x + 8}
                y={y + 2.5}
                fontFamily="var(--font-mono)"
                fontSize="6.5"
                fill="var(--color-fg)"
                letterSpacing="0.1em"
                fontWeight="600"
                textAnchor="start"
              >
                {code}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend strip (below SVG) */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 py-2 flex justify-between items-center text-[8px] font-mono text-fg-muted tracking-[0.18em] uppercase"
        style={{ background: "var(--color-bg)", borderTop: "1px solid var(--color-border)" }}
      >
        <div>
          {visitedCountries.length} countries · {stats.totalDays} days ·{" "}
          {stats.mapTrips.length} legs
        </div>
        <div className="text-fg-faint">EQUIRECTANGULAR · 1:N</div>
      </div>

      {/* "Atlas, no. 1" signature */}
      <div className="absolute bottom-1 left-5 font-display italic text-[14px] text-fg">
        Atlas, no. 1
      </div>
      <div className="absolute bottom-1 right-5 font-mono text-[7.5px] text-fg-faint tracking-[0.15em] uppercase">
        {new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
