import { PropsWithChildren, ReactNode } from 'react';
import { cn } from '../cn';
import { Kicker } from '../primitives/Kicker';
import { Display } from '../primitives/Display';

export interface StatCardProps extends PropsWithChildren {
  label: string;
  sublabel?: string;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  label,
  sublabel,
  onClick,
  className,
  children,
}: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-left p-4 rounded-lg border border-border',
        'bg-bg-raised hover:bg-bg-sunken transition-colors',
        'flex flex-col gap-3 min-w-0',
        className,
      )}
    >
      <div className="flex flex-col gap-0.5">
        <Kicker tone="muted">{label}</Kicker>
        {sublabel && <Kicker tone="faint">{sublabel}</Kicker>}
      </div>
      {children}
    </button>
  );
}
