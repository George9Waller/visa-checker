import { cn } from "../cn";
import { Link } from "@/i18n/navigation";
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
    "w-full rounded-[var(--radius)] border border-l-4 px-3.5 py-2.5 text-left transition-all",
    "flex items-center gap-3 hover:bg-bg-sunken focus-visible:ds-focus-ring",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    toneAlertClasses(tone)
  );

  const content = (
    <>
      <StatusPip tone={tone} size="xs" />
      <div className="flex-1 min-w-0">
        <div className="font-body text-sm font-bold text-fg leading-tight">
          {title}
        </div>
        {detail && <div className="mt-0.5 text-xs text-fg-muted">{detail}</div>}
      </div>
      {action && (
        <div className="font-mono text-xs text-fg-muted flex-shrink-0 whitespace-nowrap tracking-wide">
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
