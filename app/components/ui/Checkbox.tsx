import React, { InputHTMLAttributes } from "react";
import { Text } from "./typography/Text";
import { Flex } from "./layout/Flex";

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
      <Flex 
        as="label" 
        variant="row" 
        gap="md" 
        style={{ alignItems: "flex-start", cursor: "pointer", userSelect: "none", ...style }}
      >
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={handleChange} 
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
          ref={ref} 
          {...props} 
        />
        <Flex
          variant="row-center"
          style={{
            width: 20,
            height: 20,
            flexShrink: 0,
            marginTop: 1,
            transition: "all 0.2s",
            justifyContent: "center",
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
        </Flex>
        {label && (
          <Text variant="body" style={{ fontSize: 14, lineHeight: 1.4 }}>
            {label}
          </Text>
        )}
      </Flex>
    );
  }
);
Checkbox.displayName = "Checkbox";
