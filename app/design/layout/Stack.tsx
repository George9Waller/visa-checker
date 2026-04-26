import { PropsWithChildren } from "react";
import { cn } from "../cn";

export interface StackProps extends PropsWithChildren {
  gap?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Stack({ gap = "md", className, children }: StackProps) {
  const gapClasses: Record<string, string> = {
    xs: "gap-2",
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div className={cn("flex flex-col", gapClasses[gap], className)}>
      {children}
    </div>
  );
}
