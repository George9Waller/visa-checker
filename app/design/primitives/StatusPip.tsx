import { cn } from "../cn";
import { Tone } from "../tokens";

export interface StatusPipProps {
  tone?: Tone;
  size?: "xs" | "sm" | "md";
}

export function StatusPip({ tone = "muted", size = "sm" }: StatusPipProps) {
  const sizeClasses: Record<string, string> = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-3 h-3",
  };

  const toneClasses: Record<Tone, string> = {
    ok: "bg-ok",
    warn: "bg-warn",
    danger: "bg-danger",
    muted: "bg-fg-muted",
    accent: "bg-accent",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-full flex-shrink-0",
        sizeClasses[size],
        toneClasses[tone]
      )}
    />
  );
}
