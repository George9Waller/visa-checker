import React, { InputHTMLAttributes } from "react";
import { Box } from "./layout/Box";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ style, className, ...props }, ref) => {
    return (
      <Box
        as="input"
        ref={ref}
        width="full"
        style={{
          boxSizing: "border-box" as const,
          padding: "12px 14px",
          background: "var(--bg-raised)",
          color: "var(--fg)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r)",
          fontFamily: "var(--font-body)",
          fontSize: 15,
          letterSpacing: "var(--track-body)",
          outline: "none",
          transition: "border-color 0.15s",
          ...style,
        }}
        className={className}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--fg)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
        }}
        {...(props as any)}
      />
    );
  }
);
Input.displayName = "Input";
