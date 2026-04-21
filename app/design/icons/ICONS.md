# Icon System

Complete SVG icon set (15 icons) with consistent sizing and dark mode support.

## Icon Component

```tsx
import { Icon } from '@/app/design';

<Icon name="chevron-left" size="md" />
<Icon name="calendar" size="lg" className="text-accent" />
```

**Props:**
- `name`: icon name (string, must match defined icon set below)
- `size`: 'xs' (12px) | 'sm' (16px) | 'md' (20px) | 'lg' (24px) — default: 'md'
- `className`: optional Tailwind classes (e.g., `text-accent`, `opacity-50`)

**Behavior:**
- Icon renders as an `<svg>` that inherits `currentColor`, so `text-{color}` classes work
- Returns `null` if icon name not found (fail-safe, no placeholder)
- Width/height auto-scale per `size` prop via `sizeClasses` map

## Icon Set

All icons are 16×16 viewBox unless noted.

| Name | Usage | Size | Notes |
|------|-------|------|-------|
| `chevron-left` | Back button (PageHeader, WizardShell) | 16×16 | Leftward chevron |
| `chevron-right` | Forward nav (DatePicker month nav) | 16×16 | Rightward chevron |
| `close` | Close/dismiss (WizardShell, modals) | 16×16 | X mark |
| `arrow-right` | Next/submit (WizardShell footer) | 14×14 | Rightward arrow with hook |
| `plus` | Add/create action (FAB center button) | 22×22 | Plus sign |
| `check` | Selected indicator (OptionRow list) | 16×16 | Checkmark |
| `check-small` | Checkbox tick (Checkbox component) | 12×12 | Small checkmark (internal use) |
| `calendar` | Date input trigger (DatePicker) | 14×14 | Calendar grid |
| `edit` | Edit action (PageHeader, detail pages) | 16×16 | Pencil icon |
| `trash` | Delete action (PageHeader, detail pages) | 16×16 | Trash bin |
| `visa-card` | Visas nav/section (Dashboard) | 16×16 | Credit card |
| `user` | User/profile avatar placeholder | 16×16 | Person icon |
| `search` | Search input (country search) | 16×16 | Magnifying glass |
| `sun` | Light mode toggle (theme button) | 16×16 | Sun rays |
| `moon` | Dark mode toggle (theme button) | 16×16 | Crescent moon |

## Adding a New Icon

1. Create `app/design/icons/{IconName}.tsx`:
   ```tsx
   export function IconName() {
     return (
       <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" aria-hidden="true">
         {/* SVG paths */}
       </svg>
     );
   }
   ```

2. Add to `app/design/icons/index.ts`:
   ```ts
   import { IconName } from './IconName';
   export const icons = {
     'icon-name': IconName,
     // ...
   };
   ```

3. Export from barrel `app/design/index.ts`:
   ```ts
   export type { IconName } from './icons';
   ```

4. Document in this file
5. Add to `/design-system` showcase

## Dark Mode

All icons inherit `currentColor`, so they automatically adapt to dark mode via `text-fg` / `text-fg-muted` classes. No special SVG styling needed.

```tsx
// In dark mode, these automatically flip colors via CSS vars
<Icon name="moon" className="text-fg-muted" />
```

## Icon Map

Complete name-to-component mapping lives in `app/design/icons/index.ts`:

```ts
export const icons: Record<string, ComponentType> = {
  'arrow-right': ArrowRight,
  'calendar': Calendar,
  'check': Check,
  'check-small': CheckSmall,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'close': Close,
  'edit': Edit,
  'moon': Moon,
  'plus': Plus,
  'search': Search,
  'sun': Sun,
  'trash': Trash,
  'user': User,
  'visa-card': VisaCard,
};
```

Invalid names return `null` (no error, no placeholder).

## Related Files

- `app/design/primitives/Icon.tsx` — Icon component wrapper
- `app/design/icons/index.ts` — Icon map and re-exports
- `app/design/icons/*.tsx` — Individual icon components
