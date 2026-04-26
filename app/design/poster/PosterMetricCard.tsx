import { cn } from "../cn";
import { Kicker } from "../primitives/Kicker";
import { Text } from "../primitives/Text";

export interface PosterMetricCardProps {
  index: string;
  title: string;
  detail: string;
  className?: string;
}

export function PosterMetricCard({
  index,
  title,
  detail,
  className,
}: PosterMetricCardProps) {
  return (
    <div
      className={cn(
        "border-t border-b border-fg/22 px-3 py-[14px] text-left",
        className
      )}
    >
      <Kicker tone="faint" className="mb-2 block">
        {index}
      </Kicker>
      <div className="font-display text-[28px] leading-none">{title}</div>
      <Text
        variant="small"
        tone="faint"
        className="mt-1 font-display italic text-[15px]"
      >
        {detail}
      </Text>
    </div>
  );
}
