import { PropsWithChildren } from 'react';
import { cn } from '../cn';

export interface TextProps extends PropsWithChildren {
  variant?: 'body' | 'meta' | 'small';
  tone?: 'default' | 'muted' | 'faint';
  className?: string;
}

export function Text({
  variant = 'body',
  tone = 'default',
  className,
  children,
}: TextProps) {
  const variantClasses: Record<string, string> = {
    body: 'text-md leading-relaxed',
    meta: 'font-mono text-xs leading-relaxed',
    small: 'text-sm leading-relaxed',
  };

  const toneClasses: Record<string, string> = {
    default: 'text-fg',
    muted: 'text-fg-muted',
    faint: 'text-fg-faint',
  };

  return (
    <p className={cn('m-0', variantClasses[variant], toneClasses[tone], className)}>
      {children}
    </p>
  );
}
