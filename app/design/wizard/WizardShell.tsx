"use client";

import { PropsWithChildren } from "react";
import { useTranslations } from "next-intl";
import { cn } from "../cn";
import { IconBtn } from "../primitives/IconBtn";
import { Icon } from "../primitives/Icon";
import { Kicker } from "../primitives/Kicker";
import { Display } from "../primitives/Display";
import { Btn } from "../primitives/Btn";

export interface WizardShellProps extends PropsWithChildren {
  title: string;
  step: number;
  totalSteps: number;
  stepTitle: string;
  onClose: () => void;
  onBack?: (() => void) | null;
  primary: {
    label: string;
    onClick: () => void;
    enabled: boolean;
    variant?: "primary" | "accent" | "danger";
  };
}

export function WizardShell({
  title,
  step,
  totalSteps,
  stepTitle,
  onClose,
  onBack,
  primary,
  children,
}: WizardShellProps) {
  const t = useTranslations("common");
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <div className="border-b border-border/80 bg-bg/95 px-4 py-4 backdrop-blur md:px-6">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {onBack ? (
              <IconBtn onClick={onBack} title={t("back")}>
                <Icon name="chevron-left" size="sm" />
              </IconBtn>
            ) : (
              <div className="w-8" />
            )}
            <div className="min-w-0">
              <Kicker>
                {title} · {step + 1}/{totalSteps}
              </Kicker>
              <Display level={3} className="mt-1 truncate">
                {stepTitle}
              </Display>
            </div>
          </div>
          <IconBtn onClick={onClose} title={t("close")}>
            <Icon name="close" size="sm" />
          </IconBtn>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-2xl gap-1 px-4 pt-3 md:px-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= step ? "bg-fg" : "bg-border"
            )}
          />
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 md:px-6 md:py-8">
        {children}
      </div>

      <div className="sticky bottom-0 border-t border-border/80 bg-bg/95 px-4 py-4 backdrop-blur md:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 pb-[env(safe-area-inset-bottom)] sm:flex-row sm:items-center sm:justify-end">
          <Btn
            variant={primary.variant ?? "primary"}
            onClick={primary.onClick}
            disabled={!primary.enabled}
            className="w-full justify-center sm:w-auto sm:min-w-36"
          >
            {primary.label}
            <Icon name="arrow-right" size="sm" />
          </Btn>
          <Btn
            variant="ghost"
            onClick={onClose}
            className="w-full justify-center sm:w-auto sm:min-w-28"
          >
            {t("cancel")}
          </Btn>
        </div>
      </div>
    </div>
  );
}
