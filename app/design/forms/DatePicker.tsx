'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '../cn';
import { Icon } from '../primitives/Icon';
import { IconBtn } from '../primitives/IconBtn';

function parseISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => (value ? parseISO(value) : new Date()));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handler);
    };
  }, [open]);

  const selected = value ? parseISO(value) : null;
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const changeMonth = (delta: number) => {
    const d = new Date(viewDate);
    d.setDate(1);
    d.setMonth(d.getMonth() + delta);
    setViewDate(d);
  };

  const pick = (day: number) => {
    onChange?.(toISO(new Date(year, month, day)));
    setOpen(false);
  };

  const isDisabled = (day: number): boolean => {
    const d = new Date(year, month, day);
    if (minDate && d < parseISO(minDate)) return true;
    if (maxDate && d > parseISO(maxDate)) return true;
    return false;
  };

  const cells: (number | null)[] = [
    ...Array<null>(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full px-3.5 py-3 rounded-[var(--radius)] bg-bg-raised text-fg font-body text-md',
          'flex items-center justify-between gap-2 transition-colors cursor-pointer',
          'border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          open ? 'border-fg' : 'border-border',
        )}
      >
        <span className={value ? 'text-fg' : 'text-fg-faint'}>
          {selected ? fmtDate(selected) : placeholder}
        </span>
        <Icon name="calendar" size="sm" className="text-fg-muted flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full min-w-[300px] bg-bg-raised border border-border rounded-lg shadow-xl p-3.5 z-50">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <IconBtn onClick={() => changeMonth(-1)} title="Previous month">
              <Icon name="chevron-left" size="sm" />
            </IconBtn>
            <div className="font-display font-semibold text-md text-fg">
              {viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </div>
            <IconBtn onClick={() => changeMonth(1)} title="Next month">
              <Icon name="chevron-right" size="sm" />
            </IconBtn>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-0.5 mb-1.5">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center font-mono text-[10px] text-fg-faint tracking-wide py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const cellDate = new Date(year, month, d);
              const selDate = selected ? new Date(selected.getFullYear(), selected.getMonth(), selected.getDate()) : null;
              const isSel = selDate && cellDate.getTime() === selDate.getTime();
              const isToday = cellDate.getTime() === today.getTime();
              const disabled = isDisabled(d);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => !disabled && pick(d)}
                  disabled={disabled}
                  className={cn(
                    'h-[34px] rounded-[var(--radius)] font-body text-[13px] transition-colors',
                    isSel && 'bg-fg text-bg font-semibold',
                    !isSel && isToday && 'outline outline-1 outline-border-strong font-semibold text-fg',
                    !isSel && !disabled && !isToday && 'text-fg hover:bg-bg-sunken',
                    disabled && 'text-fg-faint pointer-events-none opacity-40',
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-2.5 pt-2.5 border-t border-border flex justify-between items-center">
            <button
              type="button"
              onClick={() => { onChange?.(toISO(new Date())); setOpen(false); }}
              className="font-mono text-[11px] text-fg-muted tracking-wide bg-transparent border-none cursor-pointer hover:text-fg transition-colors"
            >
              TODAY
            </button>
            {value && (
              <button
                type="button"
                onClick={() => { onChange?.(''); setOpen(false); }}
                className="font-mono text-[11px] text-fg-muted tracking-wide bg-transparent border-none cursor-pointer hover:text-fg transition-colors"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
