"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export function DetailHeader({
  kicker,
  title,
  backHref,
  actions,
}: {
  kicker?: string;
  title: ReactNode;
  backHref?: string;
  actions?: ReactNode;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div
      className="flex items-start gap-3 px-5 py-4 sticky top-0 z-20"
      style={{
        backgroundColor: "var(--bg)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        onClick={handleBack}
        className="shrink-0 flex items-center justify-center rounded-[var(--r-s)] transition-colors"
        style={{
          width: 32,
          height: 32,
          color: "var(--fg-muted)",
          backgroundColor: "transparent",
          border: "1px solid var(--border)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--bg-sunken)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        aria-label="Go back"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          arrow_back
        </span>
      </button>

      <div className="flex-1 min-w-0">
        {kicker && (
          <p
            className="font-mono font-bold uppercase tracking-wider mb-0.5"
            style={{ fontSize: 10, color: "var(--fg-muted)" }}
          >
            {kicker}
          </p>
        )}
        <div
          className="font-display leading-tight truncate"
          style={{ fontSize: 22, color: "var(--fg)" }}
        >
          {title}
        </div>
      </div>

      {actions && (
        <div className="shrink-0 flex items-center gap-1.5">{actions}</div>
      )}
    </div>
  );
}

export function IconBtn({
  icon,
  label,
  danger,
  onClick,
}: {
  icon: string;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center rounded-[var(--r-s)] transition-colors"
      style={{
        width: 30,
        height: 30,
        color: danger ? "var(--danger)" : "var(--fg-muted)",
        backgroundColor: "transparent",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = danger
          ? "color-mix(in oklch, var(--danger) 10%, transparent)"
          : "var(--bg-sunken)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
        {icon}
      </span>
    </button>
  );
}
