import { InputHTMLAttributes } from "react";
import { cn } from "../cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "error";
}

export function Input({ variant = "default", className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={cn(
        "w-full px-3.5 py-3 rounded-[var(--radius)]",
        "bg-bg-raised text-fg placeholder-fg-faint",
        "border border-border",
        "font-body text-md",
        "focus-visible:ds-focus-ring focus-visible:border-fg",
        "transition-colors duration-150",
        variant === "error" && "border-danger",
        className
      )}
    />
  );
}
