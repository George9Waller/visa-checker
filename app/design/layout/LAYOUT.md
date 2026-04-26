# Layout Components

Page scaffolding and structural primitives.

## AppShell

Root container managing theme and FAB slot.

```tsx
import { AppShell, FAB } from '@/app/design';

<AppShell theme="system" fab={<FAB actions={[...]} />}>
  {/* page content */}
</AppShell>
```

**Props:**

- `theme`: 'light' | 'dark' | 'system'
- `fab`: optional FAB component or ReactNode

## PageContainer

Max-width wrapper with responsive padding.

```tsx
<PageContainer density="comfortable">{/* content */}</PageContainer>
```

**Props:**

- `density`: 'comfortable' (20px) | 'compact' (16px)

## PageHeader

Sticky header with back, kicker, title, trailing actions.

```tsx
<PageHeader
  kicker="Upcoming"
  title="Trip details"
  flag="🇫🇷"
  onBack={handleBack}
  actions={<button>Edit</button>}
/>
```

**Props:**

- `kicker`: optional secondary text
- `title`: main heading
- `flag`: optional emoji
- `onBack`: optional back button handler
- `actions`: trailing action components

## SectionHeader

Numbered section heading with optional count.

```tsx
<SectionHeader num="01" title="Upcoming" count={3} />
```

**Props:**

- `num`: optional step number (e.g., '01')
- `title`: section name
- `count`: optional item count (padded to 2 digits)

## Stack

Flex column with configurable gap.

```tsx
<Stack gap="lg">
  <Component1 />
  <Component2 />
  <Component3 />
</Stack>
```

**Props:**

- `gap`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'

## Row

Flex row with gap, alignment, and justification.

```tsx
<Row gap="md" align="center" justify="between">
  <div>Left</div>
  <div>Right</div>
</Row>
```

**Props:**

- `gap`: 'xs' | 'sm' | 'md' | 'lg'
- `align`: 'start' | 'center' | 'end'
- `justify`: 'start' | 'center' | 'end' | 'between'

## Grid

CSS grid with column count and gap.

```tsx
<Grid cols={2} gap="md">
  <Card />
  <Card />
</Grid>
```

**Props:**

- `cols`: 1 | 2 | 3 | 4
- `gap`: 'xs' | 'sm' | 'md' | 'lg'

## StickyBar

Sticky positioned bar with optional blur.

```tsx
<StickyBar position="bottom">
  <button>Action</button>
</StickyBar>
```

**Props:**

- `position`: 'top' | 'bottom'
