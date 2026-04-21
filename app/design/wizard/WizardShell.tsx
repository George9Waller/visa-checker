import { PropsWithChildren } from 'react';
import { cn } from '../cn';
import { IconBtn } from '../primitives/IconBtn';
import { Icon } from '../primitives/Icon';
import { Kicker } from '../primitives/Kicker';
import { Display } from '../primitives/Display';
import { Btn } from '../primitives/Btn';

export interface WizardShellProps extends PropsWithChildren {
  title: string;
  step: number;
  totalSteps: number;
  stepTitle: string;
  onClose: () => void;
  onBack?: (() => void) | null;
  primary: { label: string; onClick: () => void; enabled: boolean };
}

export function WizardShell({
  title,
  step,
  totalSteps,
  stepTitle,
  onClose,
  onBack,
  primary,
  children,
}: WizardShellProps) {
  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack ? (
            <IconBtn onClick={onBack} title="Back">
              <Icon name="chevron-left" size="sm" />
            </IconBtn>
          ) : (
            <div className="w-8" />
          )}
          <div className="flex-1">
            <Kicker>
              {title} · {step + 1}/{totalSteps}
            </Kicker>
            <Display level={3} className="mt-1">
              {stepTitle}
            </Display>
          </div>
        </div>
        <IconBtn onClick={onClose} title="Close">
          <Icon name="close" size="sm" />
        </IconBtn>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 px-5 pt-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-0.5 rounded-full transition-colors',
              i <= step ? 'bg-fg' : 'bg-border',
            )}
          />
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto px-5 py-6 max-w-md mx-auto w-full">
        {children}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3 bg-bg/90 backdrop-blur-sm flex justify-end gap-3">
        <Btn variant="ghost" onClick={onClose}>
          Cancel
        </Btn>
        <Btn variant={primary.label.includes('Create') ? 'accent' : 'primary'} onClick={primary.onClick} disabled={!primary.enabled}>
          {primary.label}
          <Icon name="arrow-right" size="sm" />
        </Btn>
      </div>
    </div>
  );
}
