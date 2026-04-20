import { ReactNode } from "react";
import { Box } from "./layout/Box";
import { Flex } from "./layout/Flex";
import { Text } from "./typography/Text";

export function Field({
  label,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Flex variant="column" gap="xs" className={className}>
      <Text
        as="label"
        variant="mono"
        color="muted"
        style={{ fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.04em" }}
      >
        {label}
        {required && (
          <Box as="span" style={{ color: "var(--danger)", marginLeft: 3 }}>*</Box>
        )}
      </Text>
      {children}
      {hint && (
        <Text variant="caption" color="faint" as="p">
          {hint}
        </Text>
      )}
    </Flex>
  );
}

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <Box
      as="input"
      className={className}
      width="full"
      style={{
        padding: "10px 12px",
        fontSize: 15,
        fontFamily: "var(--font-body)",
        backgroundColor: "var(--bg-raised)",
        color: "var(--fg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-s)",
        outline: "none",
        transition: "border-color 0.15s",
      }}
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

export function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <Box
      as="textarea"
      className={className}
      width="full"
      style={{
        padding: "10px 12px",
        fontSize: 15,
        fontFamily: "var(--font-body)",
        backgroundColor: "var(--bg-raised)",
        color: "var(--fg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-s)",
        outline: "none",
        transition: "border-color 0.15s",
        resize: "none",
      }}
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
