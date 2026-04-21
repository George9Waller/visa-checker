import { PropsWithChildren } from 'react';

export interface FlagProps extends PropsWithChildren {
  size?: 'sm' | 'md' | 'lg';
}

export function Flag({ size = 'md', children }: FlagProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <span className={`inline-block leading-none flex-shrink-0 ${sizeClasses[size]}`}>
      {children}
    </span>
  );
}
