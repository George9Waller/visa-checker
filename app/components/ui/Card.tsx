import React from "react";
import { Box, BoxProps } from "./layout/Box";

export const Card = React.forwardRef<HTMLElement, BoxProps>(
  ({ style, className, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        p="md"
        style={{ 
          background: "var(--bg-raised)", 
          border: "1px solid var(--border)", 
          borderRadius: "var(--r)",
          ...style 
        }}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
