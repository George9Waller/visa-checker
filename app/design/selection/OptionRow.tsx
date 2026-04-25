import { ReactNode } from "react";
import { cn } from "../cn";
import { StatusPip } from "../primitives/StatusPip";
import { Icon } from "../primitives/Icon";

export interface OptionRowProps {
  flag?: ReactNode;
  title: string;
  subtitle?: string;
  selected?: boolean;
  trailing?: ReactNode;
  onClick?: () => void;
  variant?: "list" | "grid" | "type";
}

export function OptionRow({
  flag,
  title,
  subtitle,
  selected,
  trailing,
  onClick,
  variant = "list",
}: OptionRowProps) {
  if (variant === "type") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "w-full text-left rounded-none px-4 py-4 sm:px-5",
          "flex items-start gap-4 transition-all",
          "focus-visible:ds-focus-ring",
          selected
            ? "bg-fg text-bg"
            : "bg-bg-raised text-fg hover:bg-bg-sunken"
        )}
      >
        {flag && (
          <span className="text-2xl flex-shrink-0 w-7 text-center">{flag}</span>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-md leading-tight">{title}</div>
          {subtitle && (
            <div
              className={cn(
                "mt-1 text-sm leading-relaxed max-w-[34rem]",
                selected ? "opacity-70" : "text-fg-muted"
              )}
            >
              {subtitle}
            </div>
          )}
        </div>
        {selected && trailing !== false && (
          <Icon name="check" size="sm" className="flex-shrink-0 mt-1" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3.5 transition-all sm:px-4",
        "flex items-center gap-3",
        "focus-visible:ds-focus-ring",
        selected
          ? "bg-bg-sunken"
          : "bg-bg-raised hover:bg-bg-sunken"
      )}
    >
      {flag && <span className="text-lg flex-shrink-0">{flag}</span>}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-md leading-tight">{title}</div>
        {subtitle && (
          <div className="text-xs text-fg-muted mt-1">{subtitle}</div>
        )}
      </div>
      {(trailing || selected) && (
        <div className="flex-shrink-0">
          {selected ? <StatusPip tone="ok" /> : trailing}
        </div>
      )}
    </button>
  );
}
