import React from "react";
import { Box, BoxProps, Spacing } from "./Box";

export interface GridProps extends Omit<BoxProps, "variant"> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: Spacing;
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch";
  justifyItems?: "flex-start" | "flex-end" | "center" | "stretch";
  templateColumns?: string;
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

export const Grid = React.forwardRef<HTMLElement, GridProps>(
  ({ columns, gap, templateColumns, alignItems, justifyItems, style, className, ...props }, ref) => {
    let gridStyle: React.CSSProperties = { display: "grid" };
    
    if (templateColumns) {
      gridStyle.gridTemplateColumns = templateColumns;
    } else if (columns) {
      gridStyle.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }

    if (gap) gridStyle.gap = SPACING_MAP[gap];
    if (alignItems) gridStyle.alignItems = alignItems;
    if (justifyItems) gridStyle.justifyItems = justifyItems;

    return (
      <Box
        ref={ref}
        style={{ ...gridStyle, ...style }}
        className={className}
        {...props}
      />
    );
  }
);
Grid.displayName = "Grid";
