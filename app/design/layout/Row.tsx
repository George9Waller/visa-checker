import { PropsWithChildren } from "react";
import { cn } from "../cn";

export interface RowProps extends PropsWithChildren {
  gap?: "xs" | "sm" | "md" | "lg";
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "end" | "between";
  className?: string;
}

export function Row({
  gap = "md",
  align = "center",
  justify = "start",
  className,
  children,
}: RowProps) {
  const gapClasses: Record<string, string> = {
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  };

  const alignClasses: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  };

  const justifyClasses: Record<string, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      className={cn(
        "flex flex-row",
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
}
