import { cn } from "../cn";

export interface PosterBackdropProps {
  className?: string;
  patternId?: string;
}

export function PosterBackdrop({
  className,
  patternId = "poster-grid",
}: PosterBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 opacity-[0.55]",
        className
      )}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 400 800"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={patternId}
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M32 0H0V32"
              stroke="var(--color-fg)"
              strokeWidth="0.5"
              fill="none"
              opacity="0.07"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
