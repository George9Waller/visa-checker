# Selection Components

Lists and grids for selecting from options.

## OptionRow
Selectable row supporting list, grid, and type-selection layouts.

```tsx
import { OptionRow, OptionGrid, OptionList } from '@/app/design';

// List variant (default)
<OptionList>
  <OptionRow
    flag="🇫🇷"
    title="France"
    selected={selected === 'FR'}
    onClick={() => setSelected('FR')}
  />
  <OptionRow
    flag="🇪🇸"
    title="Spain"
    selected={selected === 'ES'}
    onClick={() => setSelected('ES')}
  />
</OptionList>

// Grid variant (2-col)
<OptionGrid cols={2}>
  <OptionRow variant="grid" flag="🇫🇷" title="France" selected {...} />
</OptionGrid>

// Type selection (full-width with invert-on-select)
<OptionRow
  variant="type"
  flag="🇪🇺"
  title="Schengen"
  subtitle="90 days in any 180-day period"
  selected={type === 'schengen'}
  onClick={() => setType('schengen')}
/>
```

**Props:**
- `flag`: optional emoji
- `title`: option label
- `subtitle`: optional secondary text
- `selected`: boolean
- `onClick`: handler
- `variant`: 'list' (default) | 'grid' | 'type'

## OptionGrid
2-column grid container for options.

```tsx
<OptionGrid cols={2}>
  <OptionRow variant="grid" ... />
</OptionGrid>
```

**Props:**
- `cols`: 1 | 2
- `children`: OptionRow components

## OptionList
Bordered list container (with optional max-height).

```tsx
<OptionList maxHeight="360px">
  <OptionRow ... />
</OptionList>
```

**Props:**
- `maxHeight`: max height with scroll (default: '360px')
- `children`: OptionRow components
