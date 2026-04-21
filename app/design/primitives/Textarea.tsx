import { TextareaHTMLAttributes } from 'react';
import { cn } from '../cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...rest }: TextareaProps) {
  return (
    <textarea
      {...rest}
      className={cn(
        'w-full px-3.5 py-3 rounded-[var(--radius)]',
        'bg-bg-raised text-fg placeholder-fg-faint',
        'border border-border',
        'font-body text-md',
        'focus-visible:ds-focus-ring focus-visible:border-fg',
        'transition-colors duration-150',
        'resize-vertical min-h-28',
        className,
      )}
    />
  );
}
