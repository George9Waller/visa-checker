import React from "react";
import { Box, BoxProps } from "../layout/Box";

export type TextColor = "default" | "muted" | "faint" | "inverse" | "danger" | "warn" | "ok" | "accent";

export interface TextProps extends Omit<BoxProps, "variant"> {
  variant?: "body" | "caption" | "label" | "mono" | "mono-small";
  color?: TextColor;
  truncate?: boolean;
}

const COLOR_MAP: Record<TextColor, string> = {
  default: "var(--fg)",
  muted: "var(--fg-muted)",
  faint: "var(--fg-faint)",
  inverse: "var(--bg)",
  danger: "var(--danger)",
  warn: "var(--warn)",
  ok: "var(--ok)",
  accent: "var(--accent)",
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ as = "span", variant = "body", color, truncate, style, className, ...props }, ref) => {
    let variantStyle: React.CSSProperties = {};
    
    if (variant === "body") {
      variantStyle = { fontFamily: "var(--font-body)", fontSize: 14, color: "var(--fg)" };
    } else if (variant === "caption") {
      variantStyle = { fontFamily: "var(--font-body)", fontSize: 13, color: "var(--fg-muted)", opacity: 0.6 };
    } else if (variant === "label") {
      variantStyle = { fontFamily: "var(--font-body)", fontSize: 13, fontWeight: "var(--w-bold)", color: "var(--fg)" };
    } else if (variant === "mono") {
      variantStyle = { fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" };
    } else if (variant === "mono-small") {
      variantStyle = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.5 };
    }

    if (color) {
      variantStyle.color = COLOR_MAP[color];
    }

    return (
      <Box
        as={as}
        ref={ref}
        style={{
          ...variantStyle,
          whiteSpace: truncate ? "nowrap" : undefined,
          overflow: truncate ? "hidden" : undefined,
          textOverflow: truncate ? "ellipsis" : undefined,
          ...style,
        }}
        className={className}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";
