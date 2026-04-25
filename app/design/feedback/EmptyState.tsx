import { ReactNode } from "react";
import { cn } from "../cn";
import { Text } from "../primitives/Text";
import { Btn } from "../primitives/Btn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-[var(--radius)] border border-dashed border-border-strong",
        "bg-bg-raised px-6 py-10 text-center text-fg-muted shadow-sm",
        className
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg text-4xl text-fg">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="font-body text-lg font-bold text-fg">{title}</div>
        {message && <Text variant="small">{message}</Text>}
      </div>
      {action && (
        <Btn size="sm" variant="ghost" onClick={action.onClick}>
          {action.label}
        </Btn>
      )}
    </div>
  );
}
