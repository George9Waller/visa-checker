import React from "react";
import { Box, BoxProps } from "../layout/Box";

export interface TextProps extends BoxProps {
  variant?: "body" | "mono";
  size?: number | string;
  weight?: "normal" | "medium" | "semibold" | "bold" | string | number;
  color?: string;
  letterSpacing?: string | number;
  lineHeight?: string | number;
  transform?: "uppercase" | "lowercase" | "capitalize" | "none";
  truncate?: boolean;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ as = "span", variant = "body", size, weight, color, letterSpacing, lineHeight, transform, truncate, style, ...props }, ref) => {
    const fontFamily = variant === "mono" ? "var(--font-mono)" : "var(--font-body)";
    
    return (
      <Box
        as={as}
        ref={ref}
        style={{
          fontFamily,
          fontSize: size,
          fontWeight: weight === "bold" ? "var(--w-bold)" : weight,
          color,
          letterSpacing,
          lineHeight,
          textTransform: transform,
          whiteSpace: truncate ? "nowrap" : undefined,
          overflow: truncate ? "hidden" : undefined,
          textOverflow: truncate ? "ellipsis" : undefined,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";
