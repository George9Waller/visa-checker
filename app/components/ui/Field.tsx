import { ReactNode } from "react";

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
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        className="font-mono font-bold uppercase tracking-wider"
        style={{ fontSize: 11, color: "var(--fg-muted)" }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--danger)", marginLeft: 3 }}>*</span>
        )}
      </label>
      {children}
      {hint && (
        <p style={{ fontSize: 12, color: "var(--fg-faint)", lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={`w-full rounded-[var(--r-s)] outline-none transition-colors ${className}`}
      style={{
        padding: "10px 12px",
        fontSize: 15,
        fontFamily: "var(--font-body)",
        backgroundColor: "var(--bg-raised)",
        color: "var(--fg)",
        border: "1px solid var(--border)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--fg)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
      }}
      {...props}
    />
  );
}

export function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <textarea
      className={`w-full rounded-[var(--r-s)] outline-none transition-colors resize-none ${className}`}
      style={{
        padding: "10px 12px",
        fontSize: 15,
        fontFamily: "var(--font-body)",
        backgroundColor: "var(--bg-raised)",
        color: "var(--fg)",
        border: "1px solid var(--border)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--fg)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
      }}
      {...props}
    />
  );
}
