"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { cn } from "../cn";
import { Icon } from "../primitives/Icon";

export interface FABAction {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  href?: string;
}

export interface FABProps {
  actions: FABAction[];
}

export function FAB({ actions }: FABProps) {
  const t = useTranslations("fab");
  const commonT = useTranslations("common");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {open && (
        <div className="absolute bottom-full right-0 mb-3 w-56 overflow-hidden rounded-lg border border-border bg-bg-raised shadow-lg z-50">
          <div className="border-b border-border px-4 py-3">
            <span className="font-mono text-xs uppercase tracking-wider text-fg-muted">
              {t("newEntry")}
            </span>
          </div>
          {actions.map((action, i) => (
            action.href ? (
              <Link
                key={i}
                href={action.href}
                onClick={() => setOpen(false)}
                className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-bg-sunken last:border-b-0"
              >
                <div className="text-lg flex-shrink-0">{action.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-md text-fg">
                    {action.title}
                  </div>
                  <div className="mt-0.5 text-xs text-fg-muted">
                    {action.description}
                  </div>
                </div>
              </Link>
            ) : (
              <button
                key={i}
                onClick={() => {
                  setOpen(false);
                  action.onClick?.();
                }}
                className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-bg-sunken last:border-b-0"
              >
                <div className="text-lg flex-shrink-0">{action.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-md text-fg">
                    {action.title}
                  </div>
                  <div className="mt-0.5 text-xs text-fg-muted">
                    {action.description}
                  </div>
                </div>
              </button>
            )
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-fg text-bg shadow-lg transition-all duration-200 hover:opacity-90 focus-visible:ds-focus-ring md:h-14 md:w-14",
          open && "rotate-45",
        )}
        title={open ? commonT("close") : t("newEntry")}
      >
        <Icon name="plus" size="lg" />
      </button>
    </div>
  );
}
