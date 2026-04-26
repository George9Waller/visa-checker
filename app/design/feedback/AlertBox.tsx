import { PropsWithChildren } from "react";
import { cn } from "../cn";
import { Tone, toneAlertClasses } from "../tokens";
import { StatusPip } from "../primitives/StatusPip";

export interface AlertBoxProps extends PropsWithChildren {
  tone?: Tone;
  title?: string;
}

export function AlertBox({ tone = "warn", title, children }: AlertBoxProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-l-4 p-4 shadow-sm md:p-5",
        "overflow-hidden",
        toneAlertClasses(tone)
      )}
    >
      {title && (
        <div className="mb-2 flex items-center gap-2">
          <StatusPip tone={tone} size="sm" />
          <div className="font-body font-bold text-md leading-tight">
            {title}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
