import { PropsWithChildren, ReactNode } from 'react';

export interface AppShellProps extends PropsWithChildren {
  fab?: ReactNode;
  theme?: 'light' | 'dark' | 'system';
}

export function AppShell({ children, fab, theme = 'system' }: AppShellProps) {
  return (
    <div
      data-theme={theme === 'system' ? undefined : theme}
      className="relative min-h-screen bg-bg text-fg"
    >
      <div className="flex flex-col">{children}</div>
      {fab && <div className="fixed bottom-6 right-6 z-50">{fab}</div>}
    </div>
  );
}
