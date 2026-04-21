import { ReactNode } from 'react';
import { cn } from '../cn';
import { Tone } from '../tokens';
import { StatusBadge } from '../feedback/StatusBadge';
import { UsageBar } from '../feedback/UsageBar';
import { Flag } from '../primitives/Flag';
import { Display } from '../primitives/Display';
import { Kicker } from '../primitives/Kicker';

export interface VisaListRowProps {
  flag: ReactNode;
  title: string;
  kicker?: string;
  countryCount?: number;
  statusTone: Tone;
  statusLabel: string;
  usage?: { used: number; limit: number };
  onClick?: () => void;
}

export function VisaListRow({
  flag,
  title,
  kicker,
  countryCount,
  statusTone,
  statusLabel,
  usage,
  onClick,
}: VisaListRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left mb-3 p-4 rounded-lg border border-border',
        'bg-bg-raised hover:bg-bg-sunken transition-colors',
        'flex flex-col gap-3',
      )}
    >
      <div className="flex items-start gap-3">
        <Flag size="lg">{flag}</Flag>
        <div className="flex-1 min-w-0">
          <Display level={4}>{title}</Display>
          {(kicker || countryCount) && (
            <Kicker tone="muted" className="text-xs mt-1 block">
              {kicker && <span>{kicker}</span>}
              {kicker && countryCount && <span> · </span>}
              {countryCount && <span>{countryCount} countries</span>}
            </Kicker>
          )}
        </div>
        <StatusBadge tone={statusTone} size="xs">
          {statusLabel}
        </StatusBadge>
      </div>
      {usage && (
        <UsageBar
          used={usage.used}
          limit={usage.limit}
          tone={statusTone}
          showLabels={false}
          compact
        />
      )}
    </button>
  );
}
