import { PropsWithChildren } from 'react';
import { cn } from '../cn';
import { Tone, toneAlertClasses } from '../tokens';
import { StatusPip } from '../primitives/StatusPip';

export interface AlertBoxProps extends PropsWithChildren {
  tone?: Tone;
  title?: string;
}

export function AlertBox({ tone = 'warn', title, children }: AlertBoxProps) {
  return (
    <div className={cn('rounded-sm p-4 border border-l-4', toneAlertClasses(tone))}>
      {title && (
        <div className="flex items-center gap-2 mb-2">
          <StatusPip tone={tone} size="sm" />
          <div className="font-body font-bold text-md">{title}</div>
        </div>
      )}
      {children}
    </div>
  );
}
