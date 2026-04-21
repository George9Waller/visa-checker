import { ReactNode } from 'react';
import { cn } from '../cn';
import { IconBtn } from '../primitives/IconBtn';
import { Icon } from '../primitives/Icon';
import { Kicker } from '../primitives/Kicker';
import { Display } from '../primitives/Display';

export interface PageHeaderProps {
  kicker?: string;
  title: string;
  flag?: ReactNode;
  onBack?: () => void;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  kicker,
  title,
  flag,
  onBack,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('border-b border-border px-5 py-4', className)}>
      <div className="flex items-center gap-3 mb-2">
        {onBack && (
          <IconBtn onClick={onBack} title="Back">
            <Icon name="chevron-left" size="sm" />
          </IconBtn>
        )}
        <div className="flex-1">
          {kicker && <Kicker>{kicker}</Kicker>}
          <div className="flex items-center gap-2 mt-1">
            {flag && <span className="text-lg">{flag}</span>}
            <Display level={3}>{title}</Display>
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
