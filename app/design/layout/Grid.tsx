import { PropsWithChildren } from 'react';
import { cn } from '../cn';

export interface GridProps extends PropsWithChildren {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Grid({ cols = 1, gap = 'md', className, children }: GridProps) {
  const colClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  const gapClasses: Record<string, string> = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={cn('grid', colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}
