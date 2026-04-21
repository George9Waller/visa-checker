import { cn } from '../cn';
import { Kicker } from '../primitives/Kicker';
import { Display } from '../primitives/Display';

export interface SectionHeaderProps {
  num?: string;
  title: string;
  count?: number;
  className?: string;
}

export function SectionHeader({
  num,
  title,
  count,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-baseline gap-3 mb-4 flex-wrap min-w-0', className)}>
      {num && (
        <Kicker tone="faint" className="flex-shrink-0">
          {num}
        </Kicker>
      )}
      <Display level={3} className="flex-shrink-0">
        {title}
      </Display>
      {count !== undefined && (
        <Kicker tone="faint" className="ml-auto flex-shrink-0">
          {String(count).padStart(2, '0')}
        </Kicker>
      )}
    </div>
  );
}
