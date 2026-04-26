import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "../cn";
import { IconBtn } from "../primitives/IconBtn";
import { Icon } from "../primitives/Icon";
import { Kicker } from "../primitives/Kicker";
import { Display } from "../primitives/Display";

export interface PageHeaderProps {
  kicker?: string;
  title: string;
  flag?: ReactNode;
  onBack?: () => void;
  backHref?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  kicker,
  title,
  flag,
  onBack,
  backHref,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl mx-auto border-b border-border px-5 py-3",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        {(onBack || backHref) && backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center justify-center w-8 h-8 border border-border rounded-[var(--radius)] bg-transparent hover:bg-bg-sunken transition-all"
          >
            <IconBtn>
              <Icon name="chevron-left" size="sm" />
            </IconBtn>
          </Link>
        ) : (
          (onBack || backHref) && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center w-8 h-8 border border-border rounded-[var(--radius)] bg-transparent hover:bg-bg-sunken transition-all"
              title="Back"
            >
              <IconBtn>
                <Icon name="chevron-left" size="sm" />
              </IconBtn>
            </button>
          )
        )}
        <div className="flex-1">
          {kicker && <Kicker>{kicker}</Kicker>}
          <div className="flex items-center gap-2 mt-1">
            {flag && <span className="text-lg">{flag}</span>}
            <Display level={4}>{title}</Display>
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}
