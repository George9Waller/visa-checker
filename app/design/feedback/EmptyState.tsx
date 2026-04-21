import { ReactNode } from 'react';
import { cn } from '../cn';
import { Text } from '../primitives/Text';
import { Btn } from '../primitives/Btn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 py-12 px-6',
        'rounded-sm border border-dashed border-border-strong',
        'text-center text-fg-muted',
        className,
      )}
    >
      {icon && <div className="text-4xl">{icon}</div>}
      <div className="flex flex-col gap-2">
        <div className="font-body text-lg font-bold text-fg">{title}</div>
        {message && <Text variant="small">{message}</Text>}
      </div>
      {action && (
        <Btn size="sm" variant="ghost" onClick={action.onClick}>
          {action.label}
        </Btn>
      )}
    </div>
  );
}
