"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "../cn";
import { Tone } from "../tokens";
import { StatusBadge } from "../feedback/StatusBadge";
import { Flag } from "../primitives/Flag";
import { Display } from "../primitives/Display";
import { Kicker } from "../primitives/Kicker";

export interface TripCardProps {
  flag: ReactNode;
  title: string;
  dateRange: string;
  length: number;
  statusTone: Tone;
  statusLabel: string;
  visaLabel?: string;
  isPast?: boolean;
  onClick?: () => void;
  href?: string;
}

export function TripCard({
  flag,
  title,
  dateRange,
  length,
  statusTone,
  statusLabel,
  visaLabel,
  isPast,
  onClick,
  href,
}: TripCardProps) {
  const t = useTranslations("common");
  const classes = cn(
    "w-full rounded-[var(--radius)] border border-border bg-bg-raised p-4 text-left transition-all",
    "mb-3 flex flex-col gap-3 hover:border-fg/70 hover:bg-bg-sunken",
    isPast && "opacity-60"
  );

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Flag size="md">{flag}</Flag>
          <div className="flex-1 min-w-0">
            <Display level={4}>{title}</Display>
            <Kicker tone="muted" className="mt-1 block truncate text-xs">
              {dateRange} · {length}D
            </Kicker>
          </div>
        </div>
        <StatusBadge tone={statusTone} size="xs">
          {statusLabel}
        </StatusBadge>
      </div>
      {visaLabel && (
        <div className="text-xs font-mono text-fg-muted pt-2 border-t border-border">
          {t("visaPrefix")} · {visaLabel}
        </div>
      )}
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
