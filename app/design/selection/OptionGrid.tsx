import { PropsWithChildren } from "react";
import { cn } from "../cn";

export interface OptionGridProps extends PropsWithChildren {
  cols?: 1 | 2;
  className?: string;
}

export function OptionGrid({ cols = 2, className, children }: OptionGridProps) {
  const colClasses: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
  };

  return (
    <div className={cn("grid gap-3", colClasses[cols], className)}>
      {children}
    </div>
  );
}
