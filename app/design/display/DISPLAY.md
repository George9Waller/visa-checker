# Display Components

Data presentation and visualization primitives.

## Fact
Label + value pair.

```tsx
import { Fact, FactGrid } from '@/app/design';

<Fact label="From" value="April 18" />
<Fact label="Status" value={<StatusBadge tone="ok">Valid</StatusBadge>} />
```

**Props:**
- `label`: uppercase mono label
- `value`: ReactNode (text, badge, icon, etc)

## FactGrid
Grid container for facts.

```tsx
<FactGrid cols={3}>
  <Fact label="From" value="April 18" />
  <Fact label="To" value="April 25" />
  <Fact label="Days" value="7" />
</FactGrid>
```

**Props:**
- `cols`: 2 | 3 | 4
- `children`: Fact components

## StatCard
Clickable stat card for dashboards.

```tsx
<StatCard
  label="Schengen"
  sublabel="Last 180 days"
  onClick={handleNavigate}
>
  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>90 / 180</div>
</StatCard>
```

**Props:**
- `label`: main label
- `sublabel`: optional secondary label
- `onClick`: optional click handler
- `children`: stat content (can be complex)

## TagPill
Country or item tag with emoji.

```tsx
<TagPill flag="🇪🇸" label="Spain" />
```

**Props:**
- `flag`: emoji or icon
- `label`: text

## TimelineSectionHeader
Timeline section heading with count.

```tsx
<TimelineSectionHeader label="Upcoming" count={5} />
```

**Props:**
- `label`: section name
- `count`: optional item count

## YearGroup
Year separator for timeline grouping.

```tsx
<YearGroup year={2026} muted={false}>
  {/* timeline rows */}
</YearGroup>
```

**Props:**
- `year`: year number
- `muted`: grayed out for past years (default: false)
- `children`: rows
