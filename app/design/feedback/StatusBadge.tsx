import { PropsWithChildren } from 'react';
import { cn } from '../cn';
import { Tone, toneBgClasses } from '../tokens';
import { StatusPip } from '../primitives/StatusPip';

export interface StatusBadgeProps extends PropsWithChildren {
  tone?: Tone;
  size?: 'xs' | 'sm';
}

export function StatusBadge({ tone = 'ok', size = 'sm', children }: StatusBadgeProps) {
  const paddingClasses: Record<string, string> = {
    xs: 'px-2 py-1',
    sm: 'px-3 py-1.5',
  };

  const textClasses: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full whitespace-nowrap',
        'font-mono font-medium uppercase tracking-wider border border-transparent',
        paddingClasses[size],
        textClasses[size],
        toneBgClasses(tone),
      )}
    >
      <StatusPip tone={tone} size="xs" />
      {children}
    </span>
  );
}
