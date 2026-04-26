import { ReactNode } from "react";
import { cn } from "../cn";
import { Kicker } from "../primitives/Kicker";
import { Display } from "../primitives/Display";

export interface DashboardHeaderProps {
  date: Date;
  weekday: string;
  title?: string;
  actions?: ReactNode;
  className?: string;
}

export function DashboardHeader({
  date,
  weekday,
  title = "Trips",
  actions,
  className,
}: DashboardHeaderProps) {
  const dateStr = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <div
      className={cn(
        "mb-6 flex gap-4 flex-row items-end justify-between",
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <Kicker className="mb-1">
          {weekday} · {dateStr}
        </Kicker>
        <Display level={1} as="h1">
          {title}
        </Display>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
