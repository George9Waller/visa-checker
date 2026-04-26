import { cn } from "../cn";
import { Display } from "../primitives/Display";
import { Kicker } from "../primitives/Kicker";

export interface TimelineSectionHeaderProps {
  label: string;
  count?: number;
  className?: string;
}

export function TimelineSectionHeader({
  label,
  count,
  className,
}: TimelineSectionHeaderProps) {
  return (
    <div className={cn("flex items-baseline gap-3 mb-3", className)}>
      <Display level={4}>{label}</Display>
      {count !== undefined && (
        <Kicker tone="faint">{String(count).padStart(2, "0")}</Kicker>
      )}
    </div>
  );
}
