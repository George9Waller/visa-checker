# Feedback Components

Status indicators, alerts, empty states, and progress visualization.

## StatusBadge
Colored pill with status indicator.

```tsx
import { StatusBadge } from '@/app/design';

<StatusBadge tone="ok">Valid</StatusBadge>
<StatusBadge tone="warn" size="xs">Warning</StatusBadge>
<StatusBadge tone="danger">Expired</StatusBadge>
```

**Props:**
- `tone`: 'ok' | 'warn' | 'danger' | 'muted' | 'accent'
- `size`: 'xs' | 'sm'

## UsageBar
Horizontal progress bar with optional labels.

```tsx
<UsageBar used={90} limit={180} tone="warn" />
<UsageBar used={10} limit={30} showLabels={false} compact />
```

**Props:**
- `used`: number of units used
- `limit`: total limit
- `tone`: 'ok' | 'warn' | 'danger' | 'muted' | 'accent'
- `showLabels`: show "90 / 180" header (default: true)
- `compact`: smaller bar (default: false)

## AlertRow
Interactive alert strip for dashboard.

```tsx
<AlertRow
  tone="warn"
  title="Schengen expiry warning"
  detail="Only 15 days left in rolling window"
  action="Review"
  onClick={handleReview}
/>
```

**Props:**
- `tone`: 'ok' | 'warn' | 'danger' | 'muted' | 'accent'
- `title`: main alert text
- `detail`: optional secondary text
- `action`: optional trailing action text
- `onClick`: handler

## AlertBox
Inline tinted block with optional title.

```tsx
<AlertBox tone="danger" title="Trip requires visa">
  You have no visa linked for France.
</AlertBox>
```

**Props:**
- `tone`: 'ok' | 'warn' | 'danger' | 'muted' | 'accent'
- `title`: optional header
- `children`: content

## EmptyState
Centered empty state with icon, message, and action.

```tsx
<EmptyState
  icon="📭"
  title="No visas yet"
  message="Create your first visa to get started"
  action={{ label: 'Create visa', onClick: create }}
/>
```

**Props:**
- `icon`: emoji or ReactNode
- `title`: heading
- `message`: optional subtitle
- `action`: optional `{ label, onClick }`
