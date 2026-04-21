import { ButtonHTMLAttributes, ElementType, PropsWithChildren } from 'react';
import { cn } from '../cn';
import { Variant, Size } from '../tokens';

export interface BtnProps
  extends PropsWithChildren<Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>> {
  variant?: Variant;
  size?: Size;
  as?: ElementType;
  type?: 'button' | 'submit' | 'reset';
}

export function Btn({
  variant = 'primary',
  size = 'md',
  as: As = 'button',
  type = 'button',
  className,
  disabled,
  ...rest
}: BtnProps) {
  const variantClasses: Record<Variant, string> = {
    primary: 'bg-fg text-bg hover:opacity-90',
    accent: 'bg-accent text-accent-fg hover:opacity-90',
    ghost: 'bg-transparent text-fg hover:bg-bg-sunken',
    outline: 'bg-transparent text-fg border border-border-strong hover:bg-bg-sunken',
    danger:
      'bg-[color-mix(in_oklch,var(--color-danger)_15%,var(--color-bg))] text-danger hover:opacity-90',
  };

  const sizeClasses: Record<Size, string> = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-md',
    lg: 'px-6 py-3.5 text-md',
  };

  return (
    <As
      type={type}
      {...rest}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 rounded-[var(--radius)]',
        'font-body font-bold tracking-body',
        'transition-all duration-150 cursor-pointer',
        'focus-visible:ds-focus-ring',
        disabled && 'opacity-40 cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    />
  );
}
