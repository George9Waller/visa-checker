import { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "../cn";
import { Text } from "../primitives/Text";
import { Btn } from "../primitives/Btn";
import { Icon } from "../primitives/Icon";
import { IconName } from "../icons";

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  message?: string;
  action?: { label: string; onClick?: () => void; href?: string };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-[var(--radius)] border border-dashed border-border-strong",
        "bg-bg-raised px-6 py-10 text-center text-fg-muted shadow-sm",
        "md:px-8 md:py-12",
        className
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-bg text-4xl text-fg shadow-sm">
          <Icon name={icon} size="lg" />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="font-body text-lg font-bold text-fg">{title}</div>
        {message && <Text variant="small">{message}</Text>}
      </div>
      {action &&
        (action.href ? (
          <Btn as={Link} href={action.href} size="sm" variant="ghost">
            {action.label}
          </Btn>
        ) : (
          <Btn size="sm" variant="ghost" onClick={action.onClick}>
            {action.label}
          </Btn>
        ))}
    </div>
  );

  return content;
}
