import { ReactNode } from 'react';
import { cn } from '../cn';
import { Kicker } from '../primitives/Kicker';
import { Display } from '../primitives/Display';

export interface DashboardHeaderProps {
  date: Date;
  weekday: string;
  title?: string;
  actions?: ReactNode;
  className?: string;
}

export function DashboardHeader({
  date,
  weekday,
  title = 'Trips',
  actions,
  className,
}: DashboardHeaderProps) {
  const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div className={cn('flex items-end justify-between mb-6 gap-3', className)}>
      <div className="flex-1 min-w-0">
        <Kicker className="mb-1">
          {weekday} · {dateStr}
        </Kicker>
        <Display level={1}>{title}</Display>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}
