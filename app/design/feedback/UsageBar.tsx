import { cn } from '../cn';
import { Tone } from '../tokens';
import { Kicker } from '../primitives/Kicker';

export interface UsageBarProps {
  used: number;
  limit: number;
  tone?: Tone;
  showLabels?: boolean;
  compact?: boolean;
}

export function UsageBar({
  used,
  limit,
  tone = 'ok',
  showLabels = true,
  compact = false,
}: UsageBarProps) {
  const pct = Math.min(100, (used / limit) * 100);
  const barColor: Record<Tone, string> = {
    ok: 'bg-ok',
    warn: 'bg-warn',
    danger: 'bg-danger',
    muted: 'bg-fg-muted',
    accent: 'bg-accent',
  };

  return (
    <div>
      {showLabels && (
        <div className="flex justify-between items-baseline mb-2 text-xs text-fg-muted font-mono">
          <span className="text-fg font-semibold">
            {used}<span className="text-fg-faint"> / {limit}</span>
          </span>
          <span>{limit - used} left</span>
        </div>
      )}
      <div className="relative h-1.5 rounded-full bg-bg-sunken overflow-hidden">
        <div
          className={cn('absolute inset-y-0 left-0 ds-usage-fill', barColor[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
