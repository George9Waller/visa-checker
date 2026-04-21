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
        'flex flex-col gap-0 rounded-sm',
        'border border-border bg-bg-raised',
        'overflow-auto',
        className,
      )}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}
