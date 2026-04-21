# Form Components

Form inputs and field wrappers.

## Field
Label + hint + optional indicator wrapper.

```tsx
import { Field, Input } from '@/app/design';

<Field label="Trip name" hint="Max 40 characters">
  <Input maxLength={40} />
</Field>

<Field label="Description" optional>
  <Textarea />
</Field>
```

**Props:**
- `label`: required label text
- `hint`: optional helper text below input
- `optional`: show "OPTIONAL" badge
- `children`: wrapped input component

## DatePicker
Themed popover calendar with month navigation, date grid, and quick actions.

```tsx
import { DatePicker } from '@/app/design';

<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  placeholder="Pick a date"
  minDate="2026-04-01"
  maxDate="2027-12-31"
/>
```

**Props:**
- `value`: ISO date string (`YYYY-MM-DD`), empty string if unset
- `onChange`: (date: string) => void — receives ISO string or empty string on clear
- `placeholder`: optional text shown when no date selected (default: "Pick a date")
- `minDate`: optional ISO date — disables earlier days (greyed out, unclickable)
- `maxDate`: optional ISO date — disables later days (greyed out, unclickable)

**Behavior:**
- Trigger button shows formatted date or placeholder, with calendar icon
- Click trigger to open/close popover above input
- Month nav: chevron buttons to shift months
- Day grid: 7 columns (M–S, Monday-first), 34px cells
  - Selected day: `bg-fg text-bg`, bold
  - Today (no selection): outline-1 border, bold
  - Disabled days (outside min/max): greyed out, unclickable
- Footer: TODAY button (set to current date), CLEAR button (if date is set)
- Click-outside closes popover (0ms setTimeout to avoid immediate close)
- Keyboard: Tab navigates, Enter/Space selects (native button behavior)
