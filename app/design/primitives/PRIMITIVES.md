# Primitives

Simple, reusable atoms with no business logic. Build blocks for everything else.

## Buttons

### Btn
Primary interactive button with variants and sizes.

```tsx
import { Btn } from '@/app/design';

<Btn variant="primary" size="md" onClick={() => {}}>Click me</Btn>
<Btn variant="accent" size="lg">Create</Btn>
<Btn variant="ghost" size="sm">Cancel</Btn>
<Btn variant="outline">Secondary</Btn>
<Btn variant="danger">Delete</Btn>
<Btn disabled>Disabled</Btn>
```

**Props:**
- `variant`: 'primary' | 'accent' | 'ghost' | 'outline' | 'danger'
- `size`: 'xs' | 'sm' | 'md' | 'lg'
- `onClick`: handler
- `disabled`: boolean
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `as`: ElementType (default: 'button', can be 'a' or a Link component)

### IconBtn
Small square button for icons, typically in headers and toolbars.

```tsx
<IconBtn onClick={back} title="Back">
  <svg><!-- back arrow --></svg>
</IconBtn>
```

**Props:**
- Size fixed at 32px
- Children: icon SVG or ReactNode

## Inputs

### Input
Text, number, search input with focus states.

```tsx
<Input placeholder="Name" value={name} onChange={(v) => setName(v)} />
<Input type="email" placeholder="Email" />
<Input type="number" placeholder="Days" />
<Input variant="error" />
```

**Props:**
- `type`: 'text' | 'number' | 'email' | 'search' | etc
- `placeholder`: string
- `value`: string
- `onChange`: (value: string) => void
- `variant`: 'default' | 'error'

### Textarea
Multiline text input.

```tsx
<Textarea rows={4} placeholder="Description" />
```

**Props:**
- `rows`: number (default: auto)
- Standard textarea HTMLAttributes

### Checkbox
Custom styled checkbox with label.

```tsx
<Checkbox checked={agreed} onChange={setAgreed}>
  I agree to the terms
</Checkbox>
```

**Props:**
- `checked`: boolean
- `onChange`: (checked: boolean) => void
- `children`: label text or ReactNode

## Status Indicators

### StatusPip
Tiny colored dot, used in badges and alerts.

```tsx
<StatusPip tone="ok" size="sm" />
<StatusPip tone="warn" />
<StatusPip tone="danger" size="xs" />
```

**Props:**
- `tone`: 'ok' | 'warn' | 'danger' | 'muted' | 'accent'
- `size`: 'xs' | 'sm' | 'md' (default: 'sm')

## Display

### Flag
Emoji in a container with size control.

```tsx
<Flag size="sm">🇫🇷</Flag>
<Flag size="lg">🇪🇸</Flag>
```

**Props:**
- `size`: 'sm' | 'md' | 'lg'
- `children`: emoji string

### Kicker
Uppercase mono label for headers and metadata.

```tsx
<Kicker>Upcoming</Kicker>
<Kicker tone="muted">April 18, 2026</Kicker>
<Kicker tone="faint">Optional</Kicker>
```

**Props:**
- `tone`: 'default' | 'muted' | 'faint'
- `children`: text

### Display
Serif display heading with levels.

```tsx
<Display level={1}>Main title</Display>
<Display level={2}>Section heading</Display>
<Display level={3}>Subsection</Display>
<Display level={4}>Small display</Display>
<Display as="h2" level={2}>Semantic HTML</Display>
```

**Props:**
- `level`: 1 | 2 | 3 | 4 (affects font size)
- `as`: 'h1' | 'h2' | 'h3' | 'h4' | 'div' (default: 'div')
- `children`: text

### Text
Body, meta, or small text with optional tone.

```tsx
<Text variant="body" tone="default">Regular text</Text>
<Text variant="meta" tone="muted">Metadata label</Text>
<Text variant="small" tone="faint">Fine print</Text>
```

**Props:**
- `variant`: 'body' | 'meta' | 'small'
- `tone`: 'default' | 'muted' | 'faint'
- `children`: text

### Icon
SVG icon lookup and rendering. Complete set of 15 icons, auto-scaling per size.

```tsx
import { Icon } from '@/app/design';

<Icon name="chevron-left" size="md" />
<Icon name="calendar" size="lg" className="text-fg-muted" />
<Icon name="plus" size="sm" />
```

**Props:**
- `name`: icon name from icon set (e.g., 'chevron-left', 'calendar', 'plus')
- `size`: 'xs' (12px) | 'sm' (16px) | 'md' (20px) | 'lg' (24px) — default: 'md'
- `className`: optional Tailwind utilities (e.g., `text-accent`, `opacity-50`)

**Icon set:** See [ICONS.md](../icons/ICONS.md) for complete list and usage.

### Divider
Horizontal rule with optional label.

```tsx
<Divider />
<Divider label="Or" />
```

**Props:**
- `label`: optional text to center on the line
