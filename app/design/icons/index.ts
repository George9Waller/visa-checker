import type { ComponentType } from 'react';
import { ArrowRight } from './ArrowRight';
import { Calendar } from './Calendar';
import { Check } from './Check';
import { CheckSmall } from './CheckSmall';
import { ChevronLeft } from './ChevronLeft';
import { ChevronRight } from './ChevronRight';
import { Close } from './Close';
import { Edit } from './Edit';
import { Moon } from './Moon';
import { Plus } from './Plus';
import { Search } from './Search';
import { Sun } from './Sun';
import { Trash } from './Trash';
import { User } from './User';
import { VisaCard } from './VisaCard';

export const icons: Record<string, ComponentType> = {
  'arrow-right': ArrowRight,
  'calendar': Calendar,
  'check': Check,
  'check-small': CheckSmall,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'close': Close,
  'edit': Edit,
  'moon': Moon,
  'plus': Plus,
  'search': Search,
  'sun': Sun,
  'trash': Trash,
  'user': User,
  'visa-card': VisaCard,
};

export type IconName = keyof typeof icons;

export {
  ArrowRight, Calendar, Check, CheckSmall, ChevronLeft, ChevronRight,
  Close, Edit, Moon, Plus, Search, Sun, Trash, User, VisaCard,
};
