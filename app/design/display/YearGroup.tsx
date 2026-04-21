import { PropsWithChildren } from 'react';
import { cn } from '../cn';
import { Kicker } from '../primitives/Kicker';

export interface YearGroupProps extends PropsWithChildren {
  year: number;
  muted?: boolean;
  className?: string;
}

export function YearGroup({
  year,
  muted,
  className,
  children,
}: YearGroupProps) {
  return (
    <div className={cn('mb-5', className)}>
      <Kicker tone={muted ? 'faint' : 'muted'} className="mb-2 pl-1">
        — {year}
      </Kicker>
      <div>{children}</div>
    </div>
  );
}
