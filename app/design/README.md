# Design System — app/design

Complete, token-driven component library for the visa-checker app. **Zero styling in page components.** All visual rules live here, keyed off CSS variables and Tailwind utilities.

## Quick Start

```tsx
import { Btn, PageContainer, PageHeader, Stack } from '@/app/design';

export default function Page() {
  return (
    <PageContainer>
      <PageHeader title="Example" onBack={() => {}} />
      <Stack gap="lg">
        <Btn variant="primary" onClick={() => alert('Hi!')}>Click me</Btn>
      </Stack>
    </PageContainer>
  );
}
```

## Architecture

```
app/design/
├── README.md                 (this file)
├── TOKENS.md                 (design tokens, CSS vars, theming)
│
├── tokens.ts                 (Tone, Size, Variant, Density types + helpers)
├── cn.ts                     (classname joiner utility)
├── styles.css                (Tailwind @theme + custom classes)
├── index.ts                  (barrel export)
│
├── primitives/               (atoms — no business logic)
│   ├── PRIMITIVES.md
│   ├── Btn.tsx
│   ├── IconBtn.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Checkbox.tsx
│   ├── StatusPip.tsx
│   ├── Flag.tsx
│   ├── Kicker.tsx
│   ├── Display.tsx
│   ├── Text.tsx
│   ├── Divider.tsx
│   └── Icon.tsx
│
├── layout/                   (page scaffolding)
│   ├── LAYOUT.md
│   ├── AppShell.tsx          (root + theme + FAB slot)
│   ├── PageContainer.tsx     (max-width, padding)
│   ├── PageHeader.tsx        (back, kicker, title, actions)
│   ├── SectionHeader.tsx     (num, title, count)
│   ├── Stack.tsx             (flex column + gap)
│   ├── Row.tsx               (flex row + gap + align + justify)
│   ├── Grid.tsx              (CSS grid with columns)
│   └── StickyBar.tsx         (sticky top/bottom with blur)
│
├── forms/                    (form inputs & fields)
│   ├── FORMS.md
│   ├── Field.tsx             (label + hint wrapper)
│   └── DatePicker.tsx        (popover calendar with month nav, date grid, TODAY/CLEAR)
│
├── feedback/                 (status, alerts, empty states)
│   ├── FEEDBACK.md
│   ├── StatusBadge.tsx       (pip + text pill)
│   ├── UsageBar.tsx          (progress bar with label)
│   ├── AlertRow.tsx          (interactive alert strip)
│   ├── AlertBox.tsx          (inline tone-tinted block)
│   └── EmptyState.tsx        (dashed box with icon + action)
│
├── display/                  (data display primitives)
│   ├── DISPLAY.md
│   ├── Fact.tsx              (label + value)
│   ├── FactGrid.tsx          (grid container for Facts)
│   ├── StatCard.tsx          (clickable stat card)
│   ├── TagPill.tsx           (flag + name tag)
│   ├── TimelineSectionHeader.tsx
│   └── YearGroup.tsx
│
├── selection/                (list/grid selection patterns)
│   ├── SELECTION.md
│   ├── OptionRow.tsx         (selectable row, variants: list|grid|type)
│   ├── OptionGrid.tsx        (2-col grid of options)
│   └── OptionList.tsx        (bordered container list)
│
├── wizard/                   (multi-step flows)
│   ├── WIZARD.md
│   └── WizardShell.tsx       (header + progress + body + footer)
│
├── fab/                      (floating action button)
│   └── FAB.tsx               (expanding menu)
│
├── icons/                    (15 SVG icon components)
│   ├── ICONS.md
│   ├── ChevronLeft.tsx, ChevronRight.tsx, Close.tsx, ArrowRight.tsx
│   ├── Plus.tsx, Check.tsx, CheckSmall.tsx, Calendar.tsx
│   ├── Edit.tsx, Trash.tsx, VisaCard.tsx, User.tsx
│   ├── Search.tsx, Sun.tsx, Moon.tsx
│   └── index.ts              (name → component map)
│
└── blocks/                   (business-aware presentational)
    ├── BLOCKS.md
    ├── DashboardHeader.tsx
    ├── TripHeroCard.tsx
    ├── TripTimelineRow.tsx
    ├── TripCard.tsx
    ├── VisaListRow.tsx
    └── SchengenProjectionChart.tsx
```

## Design Principles

1. **Props-driven variants only** — Components accept `variant`, `size`, `tone`, `density`. Never `className`, `style`, or custom `padding`/`color` props.
2. **Token-first styling** — All colors, spacing, radius, fonts are CSS variables. Edit them once, affect the whole app.
3. **Composition, not custom styling** — Pages use DS components; never inline `style={{}}`.
4. **Presentational, not smart** — No `useTranslations`, `fetch`, or server actions inside DS. Data flows in as props.
5. **Focus on developer experience** — Zero cognitive overhead to build pages.

## Component Categories

### Primitives
Simple, reusable building blocks. See [PRIMITIVES.md](./primitives/PRIMITIVES.md).

- **Buttons:** Btn, IconBtn
- **Inputs:** Input, Textarea, Checkbox
- **Display:** Flag, Kicker, Divider, Icon (15-icon set), Display, Text
- **Status:** StatusPip

### Layout
Page structure and scaffolding. See [LAYOUT.md](./layout/LAYOUT.md).

- AppShell (root container + theme + FAB)
- PageContainer (max-width, responsive padding)
- PageHeader (back, title, actions)
- SectionHeader (num + title + count)
- Stack, Row, Grid (flex/grid layout)
- StickyBar (sticky top/bottom)

### Forms
Inputs and field wrappers. See [FORMS.md](./forms/FORMS.md).

- Field (label + hint wrapper)
- DatePicker (popover calendar with month nav, date grid, TODAY/CLEAR footer)

### Feedback
Status indicators, alerts, empty states. See [FEEDBACK.md](./feedback/FEEDBACK.md).

- StatusBadge (pip + text pill)
- UsageBar (progress visualization)
- AlertRow, AlertBox (alert patterns)
- EmptyState (fallback UI)

### Display
Data presentation. See [DISPLAY.md](./display/DISPLAY.md).

- Fact, FactGrid (label-value pairs)
- StatCard (clickable stat)
- TagPill (country tag)
- TimelineSectionHeader, YearGroup (timeline UI)

### Selection
List/grid selection patterns. See [SELECTION.md](./selection/SELECTION.md).

- OptionRow (selectable row, variant: list|grid|type)
- OptionGrid (2-col grid)
- OptionList (bordered list container)

### Wizard
Multi-step flows. See [WIZARD.md](./wizard/WIZARD.md).

- WizardShell (header + progress + body + sticky footer)

### Icons
SVG icon set (15 components). See [icons/ICONS.md](./icons/ICONS.md).

- `Icon` component with lookup, sizing, and dark mode support
- 15 icons: chevron-left/right, close, arrow-right, plus, check, check-small, calendar, edit, trash, visa-card, user, search, sun, moon

### Blocks
Business-aware presentational components. See [BLOCKS.md](./blocks/BLOCKS.md).

- DashboardHeader (date + title + actions)
- TripHeroCard (current trip hero)
- TripTimelineRow, TripCard (trip display variants)
- VisaListRow (visa in list)
- SchengenProjectionChart (full SVG year-long projection chart)

## Theming

See [TOKENS.md](./TOKENS.md) for complete token reference and dark mode setup.

- **Light mode:** default (`:root`)
- **Dark mode:** `@media (prefers-color-scheme: dark)` auto-apply, or force via `[data-theme="dark"]`
- **Controlled via `<html data-theme>`:** JavaScript can set `'light'`, `'dark'`, or `undefined` (system)

## Adding a New Component

1. Create the component file in the appropriate folder (e.g., `primitives/NewThing.tsx`)
2. Export from the barrel: add to `index.ts`
3. Document in the subfolder's `.md` file (e.g., `PRIMITIVES.md`)
4. Test in `/design-system` showcase route

## Updating an existing component

1. Consider variant & token bloat. This is meant to be a simple, predicable system.
2. Make the necessary updates
3. Ensure it is functional and present in the `/design-system` page
4. Update the necesary documentation in the subfolder and higher levels if necessary.

## Showcase

Run `npm run dev` and visit `http://localhost:3000/design-system` to see all components in every variant.

## Migration

Pages do not use the old `app/components/` — this DS is the new standard. Migrate pages one at a time:
- Import from `@/app/design`
- Remove all inline `style={{}}` from JSX
- Compose blocks + layout components
- Delete old component references

## FAQ

**Q: Can I customize a component beyond its props?**  
A: No by design. Add a new variant to the component, then import and use that variant. This ensures consistency.

**Q: Where do I put page-specific logic?**  
A: In the page file. DS components are purely presentational (accept props, render UI).

**Q: Can I use Tailwind utilities in pages?**  
A: No, you must use the design system to ensure consistency, predicatability and maintainability.

**Q: What if I need a component that isn't here?**  
A: Build it following the same patterns (props-driven, token-based styling, no business logic), add to DS, document it.
