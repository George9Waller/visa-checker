import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "accent" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANT_STYLE: Record<Variant, { bg: string; color: string; border: string }> = {
  primary: {
    bg: "var(--fg)",
    color: "var(--bg)",
    border: "transparent",
  },
  accent: {
    bg: "var(--accent)",
    color: "var(--accent-fg)",
    border: "transparent",
  },
  ghost: {
    bg: "transparent",
    color: "var(--fg-muted)",
    border: "transparent",
  },
  outline: {
    bg: "transparent",
    color: "var(--fg)",
    border: "var(--border-strong)",
  },
  danger: {
    bg: "color-mix(in oklch, var(--danger) 12%, transparent)",
    color: "var(--danger)",
    border: "transparent",
  },
};

const SIZE_STYLE: Record<Size, { padding: string; fontSize: string; height: string }> = {
  sm: { padding: "0 12px", fontSize: "13px", height: "30px" },
  md: { padding: "0 16px", fontSize: "14px", height: "36px" },
  lg: { padding: "0 22px", fontSize: "15px", height: "44px" },
};

export function Btn({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  const v = VARIANT_STYLE[variant];
  const s = SIZE_STYLE[size];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--r-s)] cursor-pointer transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{
        height: s.height,
        padding: s.padding,
        fontSize: s.fontSize,
        fontFamily: "var(--font-body)",
        backgroundColor: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
