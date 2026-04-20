"use client";

export function ColorSwatch({
  color,
  selected,
  onClick,
}: {
  color: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        backgroundColor: color,
        border: selected ? "3px solid var(--fg)" : "2px solid transparent",
        cursor: "pointer",
        transition: "border 0.15s",
        padding: 0,
        flexShrink: 0,
      }}
    />
  );
}
