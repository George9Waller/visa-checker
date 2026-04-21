import { ReactNode } from 'react';
import { cn } from '../cn';
import { Flag } from '../primitives/Flag';

export interface TagPillProps {
  flag: ReactNode;
  label: string;
  className?: string;
}

export function TagPill({ flag, label, className }: TagPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full',
        'border border-border bg-bg-raised text-fg text-sm',
        className,
      )}
    >
      <Flag size="sm">{flag}</Flag>
      {label}
    </span>
  );
}
