import { cn } from '../cn';
import { IconName, icons } from '../icons';

export interface IconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses: Record<string, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function Icon({ name, size = 'md', className }: IconProps) {
  const IconComponent = icons[name];
  if (!IconComponent) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center flex-shrink-0',
        sizeClasses[size],
        className,
      )}
    >
      <IconComponent />
    </span>
  );
}
