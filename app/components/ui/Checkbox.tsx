import React, { InputHTMLAttributes } from "react";
import { Text } from "./typography/Text";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, checked, onChange, onCheckedChange, style, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e);
      if (onCheckedChange) onCheckedChange(e.target.checked);
    };

    return (
      <label className={`flex items-start gap-3 cursor-pointer select-none ${className || ""}`} style={style}>
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={handleChange} 
          className="sr-only" 
          ref={ref} 
          {...props} 
        />
        <div
          className="flex items-center justify-center shrink-0 transition-all mt-[1px]"
          style={{
            width: 20,
            height: 20,
            border: `1.5px solid ${checked ? "var(--fg)" : "var(--border-strong)"}`,
            borderRadius: "calc(var(--r) / 1.5)",
            background: checked ? "var(--fg)" : "transparent",
          }}
        >
          {checked && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-6" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        {label && (
          <Text size={14} color="var(--fg)" lineHeight={1.4}>
            {label}
          </Text>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
