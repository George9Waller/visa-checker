import { cn } from "../cn";
import { Kicker } from "../primitives/Kicker";
import { Text } from "../primitives/Text";

export interface PosterMastheadProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function PosterMasthead({
  title,
  subtitle,
  className,
}: PosterMastheadProps) {
  return (
    <header className={cn("flex flex-col gap-0", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <Kicker>{title}</Kicker>
        <Text variant="meta" tone="muted">
          {subtitle}
        </Text>
      </div>
      <div className="mt-[10px] h-px bg-fg opacity-85" />
      <div className="mt-[3px] h-px bg-fg opacity-18" />
    </header>
  );
}

