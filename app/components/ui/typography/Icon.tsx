import React from "react";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const SIZE_MAP: Record<IconSize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 24,
  xl: 40,
  "2xl": 48,
};

export function Icon({
  name,
  size = "md",
  color,
  className = "",
}: {
  name: string;
  size?: IconSize;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: SIZE_MAP[size], color, lineHeight: 1, userSelect: "none" }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
