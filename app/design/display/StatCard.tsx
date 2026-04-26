import { PropsWithChildren, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "../cn";
import { Kicker } from "../primitives/Kicker";
import { Display } from "../primitives/Display";

export interface StatCardProps extends PropsWithChildren {
  label?: string;
  sublabel?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function StatCard({
  label,
  sublabel,
  onClick,
  href,
  className,
  children,
}: StatCardProps) {
  const classes = cn(
    "min-w-0 rounded-[var(--radius)] border border-border bg-bg-raised p-4 text-left transition-all",
    "flex min-h-[120px] flex-col justify-between gap-3 hover:border-fg/70 hover:bg-bg-sunken",
    className
  );

  const content = (
    <>
      {(label || sublabel) && (
        <div className="flex flex-col gap-0.5">
          {label && <Kicker tone="muted">{label}</Kicker>}
          {sublabel && <Kicker tone="faint">{sublabel}</Kicker>}
        </div>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  return (
    <div className={classes}>{content}</div>
  );
}
