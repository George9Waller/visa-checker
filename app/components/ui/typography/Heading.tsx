import React from "react";
import { Box, BoxProps } from "../layout/Box";

export interface HeadingProps extends BoxProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: number | string;
  weight?: string | number;
  color?: string;
  letterSpacing?: string | number;
  lineHeight?: string | number;
}

export const Heading = React.forwardRef<HTMLElement, HeadingProps>(
  ({ level = 2, size, weight, color, letterSpacing, lineHeight, style, ...props }, ref) => {
    const Component = `h${level}` as React.ElementType;
    return (
      <Box
        as={Component}
        ref={ref}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: size,
          fontWeight: weight || "var(--w-display)",
          color: color || "var(--fg)",
          letterSpacing: letterSpacing || "var(--track-display)",
          lineHeight: lineHeight || 1.1,
          margin: 0,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";
