import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../cn';

export interface IconBtnProps
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {}

export function IconBtn({
  className,
  disabled,
  children,
  ...rest
}: IconBtnProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={cn(
        'w-8 h-8 flex items-center justify-center flex-shrink-0',
        'rounded-[var(--radius)] border border-border',
        'bg-bg-raised text-fg-muted',
        'hover:text-fg transition-colors',
        'focus-visible:ds-focus-ring',
        disabled && 'opacity-40 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  );
}
