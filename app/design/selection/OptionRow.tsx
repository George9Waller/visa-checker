import { ReactNode } from 'react';
import { cn } from '../cn';
import { StatusPip } from '../primitives/StatusPip';
import { Icon } from '../primitives/Icon';

export interface OptionRowProps {
  flag?: ReactNode;
  title: string;
  subtitle?: string;
  selected?: boolean;
  trailing?: ReactNode;
  onClick?: () => void;
  variant?: 'list' | 'grid' | 'type';
}

export function OptionRow({
  flag,
  title,
  subtitle,
  selected,
  trailing,
  onClick,
  variant = 'list',
}: OptionRowProps) {
  if (variant === 'type') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full text-left p-4 rounded-sm border',
          'flex items-start gap-4 transition-all',
          selected
            ? 'bg-fg text-bg border-fg'
            : 'bg-bg-raised text-fg border-border hover:border-fg',
        )}
      >
        {flag && <span className="text-2xl flex-shrink-0 w-7 text-center">{flag}</span>}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-md">{title}</div>
          {subtitle && (
            <div
              className={cn(
                'text-sm mt-1 leading-relaxed',
                selected ? 'opacity-60' : 'text-fg-muted',
              )}
            >
              {subtitle}
            </div>
          )}
        </div>
        {selected && trailing !== false && (
          <Icon name="check" size="sm" className="flex-shrink-0 mt-1" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-sm border transition-all',
        'flex items-center gap-3',
        selected
          ? 'bg-bg-sunken border-fg'
          : 'bg-bg-raised border-border hover:border-fg',
      )}
    >
      {flag && <span className="text-lg flex-shrink-0">{flag}</span>}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-md">{title}</div>
        {subtitle && <div className="text-xs text-fg-muted mt-1">{subtitle}</div>}
      </div>
      {(trailing || selected) && (
        <div className="flex-shrink-0">
          {selected ? <StatusPip tone="ok" /> : trailing}
        </div>
      )}
    </button>
  );
}
