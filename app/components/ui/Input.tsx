import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ style, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 14px",
          background: "var(--bg-raised)",
          color: "var(--fg)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r)",
          fontFamily: "var(--font-body)",
          fontSize: 15,
          letterSpacing: "var(--track-body)",
          outline: "none",
          ...style,
        }}
        className={`focus:border-[var(--fg)] transition-colors ${className || ""}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
