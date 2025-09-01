export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: number; // in minutes
  objectives: string;
  materials: string;
  day: DayOfWeek;
  timeSlot?: string; // e.g., "9:00 AM - 10:30 AM"
}

export interface LessonPlanFormData {
  title: string;
  subject: string;
  description: string;
  duration: number;
  objectives: string;
  materials: string;
  day: DayOfWeek;
  timeSlot: string;
}

export interface SortableItemProps {
  id: string;
  title: string;
  subject: string;
  onDelete: (itemId: string) => void;
}

export interface DayColumnProps {
  dayId: DayOfWeek;
  dayName: string;
  children: React.ReactNode;
  count: number;
  color: string;
  onClick: () => void;
}

export interface DayInfo {
  id: DayOfWeek;
  name: string;
  color: string;
}
