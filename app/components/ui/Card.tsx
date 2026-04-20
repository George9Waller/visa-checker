import React from "react";
import { Box, BoxProps } from "./layout/Box";

export const Card = React.forwardRef<HTMLElement, BoxProps>(
  ({ bg = "var(--bg-raised)", border = "1px solid var(--border)", borderRadius = "var(--r)", p = 16, style, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        bg={bg}
        border={border}
        borderRadius={borderRadius}
        p={p}
        style={style}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
