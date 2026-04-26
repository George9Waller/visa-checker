import { cn } from "../cn";
import { Kicker } from "../primitives/Kicker";
import { Text } from "../primitives/Text";

export interface PosterStep {
  roman: string;
  title: string;
  description: string;
}

export interface PosterStepListProps {
  steps: PosterStep[];
  className?: string;
}

export function PosterStepList({ steps, className }: PosterStepListProps) {
  return (
    <ol className={cn("m-0 list-none p-0", className)}>
      {steps.map((step, index) => (
        <li
          key={step.roman}
          className={cn(
            "grid grid-cols-[44px_1fr] gap-[14px] py-[14px]",
            "border-t border-fg/22",
            index === steps.length - 1 && "border-b"
          )}
        >
          <div className="font-display text-[32px] leading-none italic text-accent font-feature-settings-smcp">
            {step.roman}
          </div>
          <div>
            <div className="mb-1 font-display text-[22px] leading-[1.1] tracking-[-0.01em]">
              {step.title}
            </div>
            <Text variant="small" tone="muted">
              {step.description}
            </Text>
          </div>
        </li>
      ))}
    </ol>
  );
}

