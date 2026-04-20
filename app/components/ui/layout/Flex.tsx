import React from "react";
import { Box, BoxProps, Spacing } from "./Box";

export interface FlexProps extends Omit<BoxProps, "variant"> {
  variant?: "row" | "column" | "row-center" | "column-center" | "row-between";
  gap?: Spacing;
}

const SPACING_MAP: Record<Spacing, string> = {
  none: "0",
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  section: "80px",
};

export const Flex = React.forwardRef<HTMLElement, FlexProps>(
  ({ variant = "row", gap, style, className, ...props }, ref) => {
    let variantStyle: React.CSSProperties = { display: "flex" };
    if (variant === "row") variantStyle.flexDirection = "row";
    else if (variant === "column") variantStyle.flexDirection = "column";
    else if (variant === "row-center") {
      variantStyle.flexDirection = "row";
      variantStyle.alignItems = "center";
    }
    else if (variant === "column-center") {
      variantStyle.flexDirection = "column";
      variantStyle.alignItems = "center";
      variantStyle.justifyContent = "center";
    }
    else if (variant === "row-between") {
      variantStyle.flexDirection = "row";
      variantStyle.alignItems = "center";
      variantStyle.justifyContent = "space-between";
    }

    if (gap) variantStyle.gap = SPACING_MAP[gap];

    return (
      <Box
        ref={ref}
        style={{ ...variantStyle, ...style }}
        className={className}
        {...props}
      />
    );
  }
);
Flex.displayName = "Flex";
