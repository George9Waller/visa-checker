// Design system token types — single source of prop validation

export type Tone = 'ok' | 'warn' | 'danger' | 'muted' | 'accent';
export type Size = 'xs' | 'sm' | 'md' | 'lg';
export type Variant = 'primary' | 'accent' | 'ghost' | 'outline' | 'danger';
export type Density = 'compact' | 'comfortable';

export const toneClasses = (tone: Tone): string => {
  const map: Record<Tone, string> = {
    ok: 'text-ok',
    warn: 'text-warn',
    danger: 'text-danger',
    muted: 'text-fg-muted',
    accent: 'text-accent',
  };
  return map[tone];
};

export const toneBgClasses = (tone: Tone): string => {
  const map: Record<Tone, string> = {
    ok: 'ds-badge-ok',
    warn: 'ds-badge-warn',
    danger: 'ds-badge-danger',
    muted: 'bg-bg-sunken',
    accent: 'bg-accent text-accent-fg',
  };
  return map[tone];
};

export const toneAlertClasses = (tone: Tone): string => {
  const map: Record<Tone, string> = {
    ok: 'ds-alert-ok',
    warn: 'ds-alert-warn',
    danger: 'ds-alert-danger',
    muted: 'bg-bg-sunken border border-border',
    accent: 'bg-accent/10 border border-accent',
  };
  return map[tone];
};
