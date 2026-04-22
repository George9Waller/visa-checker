import { PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '../cn';
import { Kicker } from '../primitives/Kicker';
import { Display } from '../primitives/Display';

export interface StatCardProps extends PropsWithChildren {
  label: string;
  sublabel?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function StatCard({
  label,
  sublabel,
  onClick,
  href,
  className,
  children,
}: StatCardProps) {
  const classes = cn(
    'text-left p-4 rounded-lg border border-border',
    'bg-bg-raised hover:bg-bg-sunken transition-colors',
    'flex flex-col gap-3 min-w-0',
    className,
  );

  const content = (
    <>
      <div className="flex flex-col gap-0.5">
        <Kicker tone="muted">{label}</Kicker>
        {sublabel && <Kicker tone="faint">{sublabel}</Kicker>}
      </div>
      {children}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        classes,
      )}
    >
      {content}
    </button>
  );
}
