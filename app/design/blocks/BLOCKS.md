# Business Blocks

Presentational composites aware of visa/trip domain concepts but still fully prop-driven (no data fetching, server actions, or logic).

## DashboardHeader

Dashboard header with date, weekday, and trailing actions.

```tsx
import { DashboardHeader } from "@/app/design";

<DashboardHeader
  date={new Date()}
  weekday="Wednesday"
  title="Trips"
  actions={<button>Visas</button>}
/>;
```

**Props:**

- `date`: Date object
- `weekday`: day name string
- `title`: main heading (default: 'Trips')
- `actions`: trailing ReactNode (avatar, nav buttons, etc)

## TripHeroCard

Large inverted hero card for current trip.

```tsx
<TripHeroCard
  flag="🇫🇷"
  title="Paris"
  kicker="Currently in"
  livePill={true}
  subtitle="Day 3 of 5 remaining"
  onClick={handleNavigate}
/>
```

**Props:**

- `flag`: emoji
- `title`: trip name
- `kicker`: label (default: 'Currently in')
- `livePill`: show LIVE badge (default: false)
- `subtitle`: optional secondary text
- `onClick`: handler

## TripTimelineRow

Trip in timeline layout (date tile | content | length + status).

```tsx
<TripTimelineRow
  date={new Date("2026-05-01")}
  month="May"
  title="Berlin"
  flag="🇩🇪"
  meta="May 01–08 · Schengen"
  length={7}
  statusTone="ok"
  statusLabel="Valid"
  density="comfortable"
  isPast={false}
  onClick={handleNavigate}
/>
```

**Props:**

- `date`: Date of trip start
- `month`: month abbreviation
- `title`: trip name
- `flag`: emoji
- `meta`: secondary info (dates, visa, etc)
- `length`: number of days
- `statusTone`: 'ok' | 'warn' | 'danger' | 'muted' | 'accent'
- `statusLabel`: status text
- `density`: 'compact' | 'comfortable'
- `isPast`: grayed out (default: false)
- `isLast`: hide bottom border if last (default: false)
- `onClick`: handler

## TripCard

Alternate card layout for trips.

```tsx
<TripCard
  flag="🇫🇷"
  title="Paris"
  dateRange="April 18–25"
  length={7}
  statusTone="ok"
  statusLabel="Valid"
  visaLabel="Schengen"
  isPast={false}
  onClick={handleNavigate}
/>
```

**Props:**

- `flag`: emoji
- `title`: trip name
- `dateRange`: date range string
- `length`: days
- `statusTone`: status tone
- `statusLabel`: status text
- `visaLabel`: optional visa name
- `isPast`: grayed out
- `onClick`: handler

## VisaListRow

Visa in list view.

```tsx
<VisaListRow
  flag="🇪🇺"
  title="Schengen"
  kicker="90 days in 180"
  countryCount={27}
  statusTone="ok"
  statusLabel="Valid"
  usage={{ used: 30, limit: 90 }}
  onClick={handleNavigate}
/>
```

**Props:**

- `flag`: emoji
- `title`: visa name
- `kicker`: optional visa type or rule
- `countryCount`: optional country count
- `statusTone`: status tone
- `statusLabel`: status text
- `usage`: optional `{ used, limit }` to show progress bar
- `onClick`: handler

## SchengenProjectionChart

Year-long SVG projection of rolling visa days remaining over the next 12 months.

```tsx
import { SchengenProjectionChart } from "@/app/design";

<SchengenProjectionChart
  points={projectionPoints} // computed array
  limit={90}
  windowDays={180}
  today={new Date()}
/>;
```

**Props:**

- `points`: array of `ProjectionPoint` — `{ date: Date, remaining: number }[]`. Pre-computed outside component (page logic). Each point represents remaining days at that date under the rolling window.
- `limit`: days limit (e.g., 90 for Schengen)
- `windowDays`: rolling window duration (e.g., 180 for Schengen 90/180)
- `today`: current date, used to mark TODAY line and compute default range

**SVG Chart Anatomy:**

- **Gridlines:** Horizontal lines at 0, limit/3, 2×limit/3, limit. Solid line at 0 and limit; dashed at intervals. Labels on left.
- **Danger zone:** Light red rect from y=0 to y=15 (remaining < 15 days)
- **Projection area:** Accent-colored fill under the projection line (opacity 0.12)
- **Projection line:** Accent-colored stroke (1.8px) connecting all points
- **TODAY marker:** Dashed vertical line at x(0) with "TODAY" label (top-right)
- **Min-remaining point:** Circle with danger-colored stroke at the lowest point, annotated "MIN {days}"
- **Month labels:** Bottom of SVG, month abbreviations in uppercase (font-mono, 9px)
- **Legend:** Below SVG — accent line + "DAYS REMAINING", danger swatch + "TIGHT ZONE"

**Color usage:**

- Accent line/area: `var(--color-accent)` and `var(--color-accent)` opacity 0.12
- Danger zone: `var(--color-danger)` opacity 0.05
- Min point: `var(--color-danger)` stroke
- Gridlines: `var(--color-border)`
- Labels: `var(--color-fg-muted)`

**Note:** Projection points should be computed by the parent page based on trip data and visa rolling window rules. The chart is purely presentational — it renders the data as-is.
