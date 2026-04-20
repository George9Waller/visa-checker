import React from "react";
import { Box, BoxProps } from "../layout/Box";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type IconColor = "default" | "muted" | "faint" | "inverse" | "danger" | "warn" | "ok" | "accent";

const SIZE_MAP: Record<IconSize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 24,
  xl: 32,
  "2xl": 48,
};

const COLOR_MAP: Record<IconColor, string> = {
  default: "var(--fg)",
  muted: "var(--fg-muted)",
  faint: "var(--fg-faint)",
  inverse: "var(--bg)",
  danger: "var(--danger)",
  warn: "var(--warn)",
  ok: "var(--ok)",
  accent: "var(--accent)",
};

export interface IconProps extends Omit<BoxProps, "color" | "size"> {
  name: string;
  size?: IconSize;
  color?: IconColor;
  fill?: boolean;
}

export const Icon = React.forwardRef<HTMLElement, IconProps>(
  ({ name, size = "md", color = "default", fill = false, style, ...props }, ref) => {
    return (
      <Box
        as="span"
        ref={ref}
        className="material-symbols-outlined"
        style={{
          fontSize: SIZE_MAP[size],
          color: COLOR_MAP[color],
          lineHeight: 1,
          userSelect: "none",
          fontVariationSettings: fill ? "'FILL' 1" : undefined,
          ...style,
        }}
        {...props}
      >
        {name}
      </Box>
    );
  }
);
Icon.displayName = "Icon";
