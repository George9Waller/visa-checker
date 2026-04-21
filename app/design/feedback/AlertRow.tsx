import { cn } from '../cn';
import { Tone, toneAlertClasses } from '../tokens';
import { StatusPip } from '../primitives/StatusPip';
import { Text } from '../primitives/Text';

export interface AlertRowProps {
  tone?: Tone;
  title: string;
  detail?: string;
  action?: string;
  onClick?: () => void;
}

export function AlertRow({
  tone = 'warn',
  title,
  detail,
  action,
  onClick,
}: AlertRowProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 rounded-sm p-3',
        'text-left border border-l-4',
        'hover:opacity-90 transition-opacity',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        toneAlertClasses(tone),
      )}
    >
      <StatusPip tone={tone} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="font-body text-md font-bold text-fg">{title}</div>
        {detail && <div className="text-sm text-fg-muted mt-1">{detail}</div>}
      </div>
      {action && (
        <div className="font-mono text-xs text-fg-muted flex-shrink-0 whitespace-nowrap">
          {action} →
        </div>
      )}
    </button>
  );
}
