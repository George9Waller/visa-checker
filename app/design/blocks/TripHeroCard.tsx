import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "../cn";
import { Kicker } from "../primitives/Kicker";
import { Display } from "../primitives/Display";
import { Flag } from "../primitives/Flag";

export interface TripHeroCardProps {
  flag: ReactNode;
  title: string;
  kicker?: string;
  livePill?: boolean;
  subtitle?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function TripHeroCard({
  flag,
  title,
  kicker = "Currently in",
  livePill,
  subtitle,
  onClick,
  href,
  className,
}: TripHeroCardProps) {
  const classes = cn(
    "w-full overflow-hidden rounded-[calc(var(--radius)+2px)] border border-fg/10 text-left transition-all",
    "bg-fg text-bg shadow-sm hover:-translate-y-0.5 hover:shadow-md",
    "flex flex-col gap-5 p-5 md:p-6",
    className
  );

  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <Kicker>{kicker}</Kicker>
        {livePill && (
          <span className="rounded-full border border-current px-2 py-1 text-xs font-mono uppercase opacity-70">
            LIVE
          </span>
        )}
      </div>
      <div className="flex items-start gap-4">
        <Flag size="lg">{flag}</Flag>
        <div className="flex-1 min-w-0">
          <Display level={2} inverted>
            {title}
          </Display>
          {subtitle && (
            <div className="mt-1 text-sm leading-relaxed opacity-70">
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
