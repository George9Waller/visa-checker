import { useRef, useEffect, useState } from 'react';
import { cn } from '../cn';
import { Icon } from '../primitives/Icon';
import { Btn } from '../primitives/Btn';

export interface FABAction {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export interface FABProps {
  actions: FABAction[];
}

export function FAB({ actions }: FABProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {open && (
        <div className="absolute bottom-full right-0 mb-3 w-56 bg-bg-raised border border-border rounded-lg overflow-hidden shadow-lg z-50">
          <div className="px-4 py-3 border-b border-border">
            <span className="font-mono text-xs uppercase tracking-wider text-fg-muted">
              New entry
            </span>
          </div>
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                setOpen(false);
                action.onClick();
              }}
              className="w-full text-left px-4 py-3 flex items-start gap-3 border-b border-border last:border-b-0 hover:bg-bg-sunken transition-colors"
            >
              <div className="text-lg flex-shrink-0">{action.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-md text-fg">{action.title}</div>
                <div className="text-xs text-fg-muted mt-0.5">{action.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-14 h-14 flex items-center justify-center rounded-full',
          'bg-fg text-bg hover:opacity-90',
          'shadow-lg transition-all duration-200',
          'focus-visible:ds-focus-ring',
          open && 'rotate-45',
        )}
        title={open ? 'Close' : 'Add'}
      >
        <Icon name="plus" size="lg" />
      </button>
    </div>
  );
}
