"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "../cn";
import { Icon } from "../primitives/Icon";
import { IconBtn } from "../primitives/IconBtn";

function parseISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
  placeholder = "Pick a date",
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() =>
    value ? parseISO(value) : new Date()
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const id = setTimeout(
      () => document.addEventListener("mousedown", handler),
      0
    );
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", handler);
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
          "w-full rounded-[var(--radius)] border bg-bg-raised px-4 py-3 text-left",
          "flex items-center justify-between gap-3 font-body text-md transition-colors cursor-pointer",
          "focus-visible:ds-focus-ring",
          open ? "border-fg shadow-sm" : "border-border hover:border-fg/70"
        )}
      >
        <span className={value ? "text-fg" : "text-fg-faint"}>
          {selected ? fmtDate(selected) : placeholder}
        </span>
        <Icon
          name="calendar"
          size="sm"
          className="text-fg-muted flex-shrink-0"
        />
      </button>

      {open && (
        <div className="absolute left-1/2 top-[calc(100%+8px)] z-50 w-[calc(100vw-2rem)] -translate-x-1/2 rounded-[var(--radius)] border border-border bg-bg-raised p-4 shadow-xl sm:left-0 sm:w-full sm:min-w-[360px] sm:translate-x-0">
          <div className="mb-3 flex items-center justify-between">
            <IconBtn onClick={() => changeMonth(-1)} title="Previous month">
              <Icon name="chevron-left" size="sm" />
            </IconBtn>
            <div className="font-display font-semibold text-md text-fg">
              {viewDate.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <IconBtn onClick={() => changeMonth(1)} title="Next month">
              <Icon name="chevron-right" size="sm" />
            </IconBtn>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div
                key={i}
                className="py-1 text-center font-mono text-[10px] tracking-wide text-fg-faint"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const cellDate = new Date(year, month, d);
              const selDate = selected
                ? new Date(
                    selected.getFullYear(),
                    selected.getMonth(),
                    selected.getDate()
                  )
                : null;
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
                    "h-[36px] rounded-[var(--radius)] font-body text-[13px] transition-colors",
                    isSel && "bg-fg text-bg font-semibold",
                    !isSel &&
                      isToday &&
                      "outline outline-1 outline-border-strong font-semibold text-fg",
                    !isSel &&
                      !disabled &&
                      !isToday &&
                      "text-fg hover:bg-bg-sunken",
                    disabled && "pointer-events-none opacity-40 text-fg-faint"
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <button
              type="button"
              onClick={() => {
                onChange?.(toISO(new Date()));
                setOpen(false);
              }}
              className="cursor-pointer border-none bg-transparent font-mono text-[11px] tracking-wide text-fg-muted transition-colors hover:text-fg"
            >
              TODAY
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange?.("");
                  setOpen(false);
                }}
                className="cursor-pointer border-none bg-transparent font-mono text-[11px] tracking-wide text-fg-muted transition-colors hover:text-fg"
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
