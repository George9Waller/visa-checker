import { ButtonHTMLAttributes, ReactNode } from "react";
import { Box } from "./layout/Box";

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

const SIZE_STYLE: Record<Size, { px: "md" | "lg" | "xl"; fontSize: number; height: number }> = {
  sm: { px: "md", fontSize: 13, height: 30 },
  md: { px: "lg", fontSize: 14, height: 36 },
  lg: { px: "xl", fontSize: 15, height: 44 },
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
    <Box
      as="button"
      className={className}
      px={s.px}
      style={{
        height: s.height,
        fontSize: s.fontSize,
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        backgroundColor: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: "var(--r-s)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "all 0.15s",
        ...props.disabled && { opacity: 0.4, cursor: "not-allowed" },
      }}
      {...(props as any)}
    >
      {children}
    </Box>
  );
}
