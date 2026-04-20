import React from "react";
import { Box, BoxProps } from "./Box";

export interface FlexProps extends BoxProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  justify?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: string | number;
}

export const Flex = React.forwardRef<HTMLElement, FlexProps>(
  ({ direction = "row", align, justify, wrap, gap, style, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        style={{
          display: "flex",
          flexDirection: direction,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap,
          gap,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Flex.displayName = "Flex";
