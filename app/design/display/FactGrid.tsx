import { PropsWithChildren } from 'react';
import { cn } from '../cn';

export interface FactGridProps extends PropsWithChildren {
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export function FactGrid({
  cols = 3,
  className,
  children,
}: FactGridProps) {
  const colClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', colClasses[cols], className)}>
      {children}
    </div>
  );
}
