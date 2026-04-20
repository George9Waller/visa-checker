import React from "react";
import { Box, BoxProps } from "../layout/Box";
import { TextColor } from "./Text";

export interface HeadingProps extends Omit<BoxProps, "variant"> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "h1" | "h2" | "h3" | "h4";
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

export const Heading = React.forwardRef<HTMLElement, HeadingProps>(
  ({ level = 2, variant, color, truncate, style, className, ...props }, ref) => {
    const Component = `h${level}` as React.ElementType;
    
    const actualVariant = variant || `h${level}` as "h1" | "h2" | "h3" | "h4";
    
    let variantStyle: React.CSSProperties = {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--w-display)",
      color: "var(--fg)",
      letterSpacing: "var(--track-display)",
      margin: 0,
    };
    
    if (actualVariant === "h1") {
      variantStyle = { ...variantStyle, fontSize: 44, lineHeight: 1 };
    } else if (actualVariant === "h2") {
      variantStyle = { ...variantStyle, fontSize: 38, lineHeight: 1.02 };
    } else if (actualVariant === "h3") {
      variantStyle = { ...variantStyle, fontSize: 28, lineHeight: 1.05 };
    } else if (actualVariant === "h4") {
      variantStyle = { ...variantStyle, fontSize: 20, lineHeight: 1.1 };
    }

    if (color) {
      variantStyle.color = COLOR_MAP[color];
    }

    return (
      <Box
        as={Component}
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
Heading.displayName = "Heading";
