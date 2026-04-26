# Design Tokens & Theming

All visual values (colors, spacing, typography, radius) are **CSS variables** exposed to Tailwind via `@theme`. One place to change everything.

## Token Categories

### Colors (Editorial Theme)

**Surfaces:**

- `--color-bg`: Primary background (#f6f1e8 light, #14120e dark)
- `--color-bg-sunken`: Recessed surface (#ede6d8 light, #0d0b08 dark)
- `--color-bg-raised`: Elevated surface (#fcf9f3 light, #1e1b15 dark)

**Typography:**

- `--color-fg`: Foreground text (#1a1814 light, #f5efe2 dark)
- `--color-fg-muted`: Secondary text (#6b6558 light, #a89f8a dark)
- `--color-fg-faint`: Tertiary text (#a39e92 light, #6b6555 dark)

**Borders:**

- `--color-border`: Standard border (#e0d8c6 light, #2a2620 dark)
- `--color-border-strong`: Emphasized border (#c6bda8 light, #3d382d dark)

**Accent:**

- `--color-accent`: Warm amber (oklch(0.58 0.16 18) light, oklch(0.68 0.16 30) dark)
- `--color-accent-fg`: Text on accent (#fff)

**Status Tones:**

- `--color-ok`: Green (oklch(0.55 0.13 150) light, oklch(0.65 0.14 150) dark)
- `--color-warn`: Yellow (oklch(0.65 0.15 60) light, oklch(0.70 0.15 60) dark)
- `--color-danger`: Red (oklch(0.55 0.20 25) light, oklch(0.62 0.20 25) dark)

### Spacing (8px base)

```
--spacing-0: 0
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-5: 20px
--spacing-6: 24px
```

Used in Tailwind as `p-1`, `gap-2`, `mt-4`, etc.

### Typography

**Sizes:**

```
--font-size-xs:      11px
--font-size-sm:      13px
--font-size-base:    14px
--font-size-md:      15px
--font-size-lg:      18px
--font-size-xl:      20px
--font-size-2xl:     22px
--font-size-display: 28px
--font-size-hero:    38px
```

**Fonts:**

```
--font-display: "Instrument Serif", Georgia, serif    (headings)
--font-body:    "Inter", system fonts                 (body text)
--font-mono:    "JetBrains Mono", monospace            (labels, codes)
```

### Radius

```
--radius:    4px  (used in Tailwind as rounded-[var(--radius)])
--radius-lg: 8px
```

## Tailwind Integration

All tokens are exposed via Tailwind's `@theme` in `styles.css`:

```tsx
// These work directly:
<div className="bg-bg text-fg">...</div>
<div className="p-4 gap-3">...</div>
<div className="font-display text-display">...</div>
<button className="rounded-[var(--radius)]">...</button>
```

## Dark Mode

**Automatic (via `@media prefers-color-scheme`):**

```tsx
<AppShell theme="system">  {/* or 'light' or 'dark' */}
```

**Manual override:**

```tsx
<html data-theme="dark">  {/* or 'light', or remove for system */}
```

The CSS variables automatically flip:

```css
/* app/design/styles.css */
@theme {
  --color-fg: #1a1814; /* light default */
}

@dark {
  --color-fg: #f5efe2; /* dark override */
}
```

## Token Helpers

**TypeScript token types:**

```tsx
import { Tone, Size, Variant, Density } from "@/app/design";

type Tone = "ok" | "warn" | "danger" | "muted" | "accent";
type Size = "xs" | "sm" | "md" | "lg";
type Variant = "primary" | "accent" | "ghost" | "outline" | "danger";
type Density = "compact" | "comfortable";
```

**Color helper functions:**

```tsx
import { toneClasses, toneBgClasses, toneAlertClasses } from '@/app/design';

// text color for a tone
<span className={toneClasses('warn')}>Warning</span>  // class="text-warn"

// bg + text for a badge
<span className={toneBgClasses('ok')}>OK</span>  // class="ds-badge-ok"

// full alert styling
<div className={toneAlertClasses('danger')}>Alert</div>
```

## Custom Classes

A few patterns Tailwind can't express concisely live as custom classes:

```css
/* Status badges with color-mix tints */
.ds-badge-ok, .ds-badge-warn, .ds-badge-danger

/* Alert boxes with left-border coloring */
.ds-alert-ok, .ds-alert-warn, .ds-alert-danger

/* Focus ring utility */
.ds-focus-ring

/* Progress bar animation */
.ds-usage-fill
```

## Extending Tokens

To add a new token:

1. Add to `@theme` block in `app/design/styles.css`
2. Tailwind utilities auto-generate (e.g., `--space-7: 28px` → `p-7`, `gap-7`)
3. For custom classes, add to the CSS file
4. Update TypeScript types if needed (`tokens.ts`)

Example: adding a new spacing level:

```css
@theme {
  --spacing-7: 28px;
}
```

Now `p-7` and `gap-7` work throughout the app.

## Alternative Themes

The current design uses **Editorial** (warm ivory + serif display). Two other themes exist in the handoff but are not active:

- **Precision:** Clean sans-serif, cool grays, purple accent
- **Passport:** Deep navy, cream, burgundy accent

To add Passport (example):

```css
@theme {
  /* light mode vars */
}

@dark {
  /* dark mode vars */
}

[data-theme="passport"] {
  --color-bg: #fbf7f2;
  /* ... all palette overrides ... */
}
```

Then enable via `<AppShell theme="passport">` or `<html data-theme="passport">`.

## Related Files

- `app/design/styles.css` — Token definitions
- `app/design/tokens.ts` — TypeScript types and helpers
- `app/globals.css` — Imports design system styles, defines legacy compat vars
- `tailwind.config.ts` — Tailwind config (uses `@theme` from styles.css)
