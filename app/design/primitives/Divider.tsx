import { cn } from '../cn';

export interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  return (
    <div className={cn('flex items-center gap-3 text-fg-faint', className)}>
      {label && (
        <span className="font-mono text-xs uppercase tracking-widest text-fg-muted flex-shrink-0">
          {label}
        </span>
      )}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
