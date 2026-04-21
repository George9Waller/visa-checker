import { PropsWithChildren } from 'react';
import { cn } from '../cn';
import { Kicker } from '../primitives/Kicker';

export interface FieldProps extends PropsWithChildren {
  label: string;
  hint?: string;
  optional?: boolean;
  className?: string;
}

export function Field({
  label,
  hint,
  optional,
  className,
  children,
}: FieldProps) {
  return (
    <label className={cn('block', className)}>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <Kicker>{label}</Kicker>
        {optional && <Kicker tone="faint">Optional</Kicker>}
      </div>
      <div className="mb-2">{children}</div>
      {hint && <Kicker tone="muted" className="text-xs">{hint}</Kicker>}
    </label>
  );
}
