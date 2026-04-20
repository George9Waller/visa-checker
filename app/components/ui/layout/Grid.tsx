import React from "react";
import { Box, BoxProps } from "./Box";

export interface GridProps extends BoxProps {
  columns?: string | number;
  rows?: string | number;
  gap?: string | number;
  templateColumns?: string;
  templateRows?: string;
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch";
  justifyItems?: "flex-start" | "flex-end" | "center" | "stretch";
}

export const Grid = React.forwardRef<HTMLElement, GridProps>(
  ({ columns, rows, gap, templateColumns, templateRows, alignItems, justifyItems, style, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        style={{
          display: "grid",
          gridTemplateColumns: templateColumns || (columns ? `repeat(${columns}, 1fr)` : undefined),
          gridTemplateRows: templateRows || (rows ? `repeat(${rows}, 1fr)` : undefined),
          gap,
          alignItems,
          justifyItems,
          ...style,
        }}
        {...props}
      />
    );
  }
);
Grid.displayName = "Grid";
