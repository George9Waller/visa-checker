import { PropsWithChildren } from 'react';
import { cn } from '../cn';

export interface OptionListProps extends PropsWithChildren {
  maxHeight?: string;
  className?: string;
}

export function OptionList({
  maxHeight = '360px',
  className,
  children,
}: OptionListProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-[var(--radius)] border border-border bg-bg-raised',
        'divide-y divide-border overflow-auto',
        className,
      )}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}
