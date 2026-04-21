import { PropsWithChildren } from 'react';
import { cn } from '../cn';

export interface StickyBarProps extends PropsWithChildren {
  position?: 'top' | 'bottom';
  className?: string;
}

export function StickyBar({
  position = 'top',
  className,
  children,
}: StickyBarProps) {
  return (
    <div
      className={cn(
        `sticky ${position === 'top' ? 'top-0' : 'bottom-0'} z-40`,
        'border-b border-border',
        'bg-bg/90 backdrop-blur-md',
        className,
      )}
    >
      {children}
    </div>
  );
}
