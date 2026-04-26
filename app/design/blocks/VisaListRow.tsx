"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { cn } from "../cn";
import { Tone } from "../tokens";
import { StatusBadge } from "../feedback/StatusBadge";
import { UsageBar } from "../feedback/UsageBar";
import { Flag } from "../primitives/Flag";
import { Display } from "../primitives/Display";
import { Kicker } from "../primitives/Kicker";

export interface VisaListRowProps {
  flag: ReactNode;
  title: string;
  kicker?: string;
  countryCount?: number;
  statusTone: Tone;
  statusLabel: string;
  usage?: { used: number; limit: number };
  onClick?: () => void;
  href?: string;
  muted?: boolean;
}

export function VisaListRow({
  flag,
  title,
  kicker,
  countryCount,
  statusTone,
  statusLabel,
  usage,
  onClick,
  href,
  muted,
}: VisaListRowProps) {
  const t = useTranslations("common");
  const countryLabel = t("countryCount", { count: countryCount ?? 0 });
  const classes = cn(
    "w-full rounded-[var(--radius)] border border-border bg-bg-raised p-4 text-left transition-all",
    "mb-3 flex flex-col gap-3 hover:border-fg/70 hover:bg-bg-sunken",
    muted && "border-dashed bg-bg-sunken/70 opacity-70"
  );

  return href ? (
    <Link href={href} className={classes}>
      <div className="flex items-start gap-3">
        <Flag size="lg">{flag}</Flag>
        <div className="min-w-0 flex-1">
          <Display level={4}>{title}</Display>
          {(kicker || countryCount !== undefined) && (
            <Kicker tone="muted" className="mt-1 block text-xs">
              {kicker && <span>{kicker}</span>}
              {kicker && countryCount !== undefined && <span> · </span>}
              {countryCount !== undefined && <span>{countryLabel}</span>}
            </Kicker>
          )}
        </div>
        <StatusBadge tone={statusTone} size="xs">
          {statusLabel}
        </StatusBadge>
      </div>
      {usage && (
        <UsageBar
          used={usage.used}
          limit={usage.limit}
          tone={statusTone}
          showLabels={false}
          compact
        />
      )}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={classes}>
      <div className="flex items-start gap-3">
        <Flag size="lg">{flag}</Flag>
        <div className="min-w-0 flex-1">
          <Display level={4}>{title}</Display>
          {(kicker || countryCount !== undefined) && (
            <Kicker tone="muted" className="mt-1 block text-xs">
              {kicker && <span>{kicker}</span>}
              {kicker && countryCount !== undefined && <span> · </span>}
              {countryCount !== undefined && <span>{countryLabel}</span>}
            </Kicker>
          )}
        </div>
        <StatusBadge tone={statusTone} size="xs">
          {statusLabel}
        </StatusBadge>
      </div>
      {usage && (
        <UsageBar
          used={usage.used}
          limit={usage.limit}
          tone={statusTone}
          showLabels={false}
          compact
        />
      )}
    </button>
  );
}
