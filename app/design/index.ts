// Design system barrel — single import surface for consumers
// @example: import { Btn, Field, PageHeader } from '@/app/design'

export type { Tone, Size, Variant, Density } from './tokens';
export { toneClasses, toneBgClasses, toneAlertClasses } from './tokens';
export { cn } from './cn';

// Primitives
export { Btn } from './primitives/Btn';
export { IconBtn } from './primitives/IconBtn';
export { Input } from './primitives/Input';
export { Textarea } from './primitives/Textarea';
export { Checkbox } from './primitives/Checkbox';
export { StatusPip } from './primitives/StatusPip';
export { Flag } from './primitives/Flag';
export { Kicker } from './primitives/Kicker';
export { Display } from './primitives/Display';
export { Text } from './primitives/Text';
export { Divider } from './primitives/Divider';
export { Icon } from './primitives/Icon';

// Layout
export { AppShell } from './layout/AppShell';
export { PageContainer } from './layout/PageContainer';
export { PageHeader } from './layout/PageHeader';
export { SectionHeader } from './layout/SectionHeader';
export { Stack } from './layout/Stack';
export { Row } from './layout/Row';
export { Grid } from './layout/Grid';
export { StickyBar } from './layout/StickyBar';

// Forms
export { Field } from './forms/Field';
export { DatePicker } from './forms/DatePicker';

// Feedback
export { StatusBadge } from './feedback/StatusBadge';
export { UsageBar } from './feedback/UsageBar';
export { AlertRow } from './feedback/AlertRow';
export { AlertBox } from './feedback/AlertBox';
export { EmptyState } from './feedback/EmptyState';

// Display
export { Fact } from './display/Fact';
export { FactGrid } from './display/FactGrid';
export { StatCard } from './display/StatCard';
export { TagPill } from './display/TagPill';
export { TimelineSectionHeader } from './display/TimelineSectionHeader';
export { YearGroup } from './display/YearGroup';

// Selection
export { OptionRow } from './selection/OptionRow';
export { OptionGrid } from './selection/OptionGrid';
export { OptionList } from './selection/OptionList';

// Wizard & FAB
export { WizardShell } from './wizard/WizardShell';
export { FAB } from './fab/FAB';

// Business blocks
export { DashboardHeader } from './blocks/DashboardHeader';
export { TripHeroCard } from './blocks/TripHeroCard';
export { TripTimelineRow } from './blocks/TripTimelineRow';
export { TripCard } from './blocks/TripCard';
export { VisaListRow } from './blocks/VisaListRow';
export { SchengenProjectionChart } from './blocks/SchengenProjectionChart';
export type { ProjectionPoint } from './blocks/SchengenProjectionChart';

// Icon names
export type { IconName } from './icons';
