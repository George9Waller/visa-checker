import { cn } from "../cn";
import Link from "next/link";
import { Tone, toneAlertClasses } from "../tokens";
import { StatusPip } from "../primitives/StatusPip";
import { Text } from "../primitives/Text";

export interface AlertRowProps {
  tone?: Tone;
  title: string;
  detail?: string;
  action?: string;
  onClick?: () => void;
  href?: string;
}

export function AlertRow({
  tone = "warn",
  title,
  detail,
  action,
  onClick,
  href,
}: AlertRowProps) {
  const classes = cn(
    "w-full rounded-[var(--radius)] border border-l-4 p-4 text-left transition-all md:p-4",
    "flex items-start gap-3 hover:bg-bg-sunken focus-visible:ds-focus-ring",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    toneAlertClasses(tone)
  );

  const content = (
    <>
      <StatusPip tone={tone} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="font-body text-md font-bold text-fg leading-tight">
          {title}
        </div>
        {detail && <div className="mt-1 text-sm text-fg-muted">{detail}</div>}
      </div>
      {action && (
        <div className="font-mono text-xs text-fg-muted flex-shrink-0 whitespace-nowrap">
          {action} →
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
