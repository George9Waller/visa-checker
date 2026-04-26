import { PropsWithChildren, ReactNode } from "react";

export interface AppShellProps extends PropsWithChildren {
  fab?: ReactNode;
  theme?: "light" | "dark" | "system";
}

export function AppShell({ children, fab, theme = "system" }: AppShellProps) {
  return (
    <div
      data-theme={theme === "system" ? undefined : theme}
      className="relative min-h-screen overflow-x-hidden bg-bg text-fg"
    >
      <div className="flex flex-col">{children}</div>
      {fab && (
        <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
          {fab}
        </div>
      )}
    </div>
  );
}
