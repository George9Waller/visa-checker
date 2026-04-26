import { PropsWithChildren } from "react";
import { cn } from "../cn";

export interface CheckboxProps extends PropsWithChildren {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  checked = false,
  onChange,
  className,
  children,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 cursor-pointer select-none",
        className
      )}
    >
      <div
        onClick={() => onChange?.(!checked)}
        className={cn(
          "w-5 h-5 flex-shrink-0 rounded-sm mt-0.5",
          "border-[1.5px] transition-all duration-150",
          checked
            ? "bg-fg border-fg"
            : "bg-transparent border-[1.5px] border-fg hover:border-fg",
          "flex items-center justify-center"
        )}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="text-bg"
          >
            <path
              d="M2 6l3 3 5-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <div className="text-sm text-fg leading-relaxed">{children}</div>
    </label>
  );
}
