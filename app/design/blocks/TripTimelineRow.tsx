import { ReactNode } from 'react';
import { cn } from '../cn';
import { Density, Tone } from '../tokens';
import { StatusPip } from '../primitives/StatusPip';
import { Flag } from '../primitives/Flag';
import { Kicker } from '../primitives/Kicker';
import { Display } from '../primitives/Display';

export interface TripTimelineRowProps {
  date: Date;
  month: string;
  title: string;
  flag: ReactNode;
  meta: string;
  length: number;
  statusTone: Tone;
  statusLabel: string;
  density?: Density;
  isPast?: boolean;
  isLast?: boolean;
  onClick?: () => void;
}

export function TripTimelineRow({
  date,
  month,
  title,
  flag,
  meta,
  length,
  statusTone,
  statusLabel,
  density = 'comfortable',
  isPast,
  isLast,
  onClick,
}: TripTimelineRowProps) {
  const dateStr = String(date.getDate()).padStart(2, '0');

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left grid gap-4 items-center',
        'px-1 py-4 border-b border-border transition-opacity',
        isLast && 'border-b-0',
        isPast && 'opacity-55',
        density === 'compact' ? 'px-0 py-3' : 'px-1 py-4',
      )}
      style={{ gridTemplateColumns: '44px 1fr auto' }}
    >
      {/* Date tile */}
      <div className="flex flex-col items-center">
        <Display level={4} className="text-fg">
          {dateStr}
        </Display>
        <Kicker className="mt-0.5">{month.toUpperCase()}</Kicker>
      </div>

      {/* Title + meta */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 min-w-0 mb-1">
          <Flag size="sm">{flag}</Flag>
          <div className="font-semibold text-md text-fg truncate">{title}</div>
        </div>
        <Kicker tone="muted" className="text-xs truncate">
          {meta}
        </Kicker>
      </div>

      {/* Length + status */}
      <div className="flex flex-col items-end gap-1.5">
        <div className="flex flex-col items-center">
          <Display level={4} className="text-fg">
            {length}
          </Display>
          <Kicker className="text-xs mt-0.5">
            {length === 1 ? 'Day' : 'Days'}
          </Kicker>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusPip tone={statusTone} size="xs" />
          <Kicker className="text-xs uppercase">{statusLabel}</Kicker>
        </div>
      </div>
    </button>
  );
}
