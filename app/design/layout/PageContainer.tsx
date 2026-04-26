import { PropsWithChildren } from "react";
import { cn } from "../cn";
import { Density } from "../tokens";

export interface PageContainerProps extends PropsWithChildren {
  density?: Density;
  className?: string;
}

export function PageContainer({
  density = "comfortable",
  className,
  children,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-3xl w-full",
        density === "comfortable" ? "px-5 py-6" : "px-4 py-4",
        className
      )}
    >
      {children}
    </div>
  );
}
