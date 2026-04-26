import { PropsWithChildren } from "react";
import { cn } from "../cn";

export interface KickerProps extends PropsWithChildren {
  tone?: "default" | "muted" | "faint";
  className?: string;
}

export function Kicker({ tone = "muted", className, children }: KickerProps) {
  const toneClasses: Record<string, string> = {
    default: "text-fg",
    muted: "text-fg-muted",
    faint: "text-fg-faint",
  };

  return (
    <span
      className={cn(
        "font-mono text-xs uppercase tracking-widest",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
