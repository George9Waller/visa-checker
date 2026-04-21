import { ReactNode } from 'react';
import { cn } from '../cn';
import { Kicker } from '../primitives/Kicker';
import { Display } from '../primitives/Display';
import { Flag } from '../primitives/Flag';

export interface TripHeroCardProps {
  flag: ReactNode;
  title: string;
  kicker?: string;
  livePill?: boolean;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

export function TripHeroCard({
  flag,
  title,
  kicker = 'Currently in',
  livePill,
  subtitle,
  onClick,
  className,
}: TripHeroCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left mb-6 p-5 rounded-lg',
        'bg-fg text-bg',
        'hover:opacity-90 transition-opacity',
        'flex flex-col gap-4',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Kicker className="opacity-60">{kicker}</Kicker>
        {livePill && (
          <span className="px-2 py-1 rounded-full border border-current text-xs font-mono uppercase opacity-70">
            LIVE
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Flag size="lg">{flag}</Flag>
        <div className="flex-1 min-w-0">
          <Display level={2} className="text-bg">{title}</Display>
          {subtitle && <div className="text-sm mt-1 opacity-70">{subtitle}</div>}
        </div>
      </div>
    </button>
  );
}
