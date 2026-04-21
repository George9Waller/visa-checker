import { PropsWithChildren } from 'react';
import { cn } from '../cn';

export interface DisplayProps extends PropsWithChildren {
  level?: 1 | 2 | 3 | 4;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  className?: string;
}

export function Display({
  level = 3,
  as: As = 'div',
  className,
  children,
}: DisplayProps) {
  const levelClasses: Record<number, string> = {
    1: 'text-hero leading-tight font-display font-display tracking-tight',
    2: 'text-display leading-tight font-display font-display tracking-tight',
    3: 'text-2xl leading-tight font-display font-display tracking-tight',
    4: 'text-xl leading-snug font-display font-display tracking-tight',
  };

  return (
    <As className={cn(levelClasses[level], 'text-fg m-0', className)}>
      {children}
    </As>
  );
}
