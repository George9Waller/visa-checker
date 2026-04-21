# Wizard Components

Multi-step form flows.

## WizardShell
Full-screen wizard with header, progress bar, body, and sticky footer.

```tsx
import { WizardShell } from '@/app/design';

<WizardShell
  title="New trip"
  step={0}
  totalSteps={3}
  stepTitle="Destination"
  onClose={handleCancel}
  onBack={step > 0 ? () => setStep(step - 1) : null}
  primary={{
    label: step === 2 ? 'Create trip' : 'Continue',
    onClick: handleNext,
    enabled: canAdvance(),
  }}
>
  <h2>Where are you going?</h2>
  {/* step-specific form fields */}
</WizardShell>
```

**Props:**
- `title`: wizard name (e.g., 'New trip', 'Edit visa')
- `step`: current step index (0-based)
- `totalSteps`: total number of steps
- `stepTitle`: heading for current step
- `onClose`: handler for cancel/close
- `onBack`: optional back button handler (or null to hide)
- `primary`: `{ label, onClick, enabled }`
  - `label`: button text (e.g., 'Continue', 'Create trip')
  - `onClick`: next/submit handler
  - `enabled`: button disabled state
- `children`: step content (form fields, etc)

**Styling notes:**
- Header: back button, step indicator, close button
- Progress bar: line per step, filled up to current
- Body: scrollable, max-width centered
- Footer: sticky, Cancel (ghost) + Primary button
