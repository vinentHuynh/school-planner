import { DayOfWeek, DayInfo } from '../types';

export const daysOfWeek: DayInfo[] = [
  { id: 'monday' as DayOfWeek, name: 'Monday', color: '#ff6b6b' },
  { id: 'tuesday' as DayOfWeek, name: 'Tuesday', color: '#4ecdc4' },
  { id: 'wednesday' as DayOfWeek, name: 'Wednesday', color: '#45b7d1' },
  { id: 'thursday' as DayOfWeek, name: 'Thursday', color: '#96ceb4' },
  { id: 'friday' as DayOfWeek, name: 'Friday', color: '#feca57' },
  { id: 'saturday' as DayOfWeek, name: 'Saturday', color: '#ff9ff3' },
  { id: 'sunday' as DayOfWeek, name: 'Sunday', color: '#54a0ff' },
];

export const getCurrentDate = (dayName: string) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDay = dayMap[dayName as keyof typeof dayMap];
  if (targetDay === undefined) return '';

  const diff = targetDay - currentDay;
  const resultDate = new Date(today);
  resultDate.setDate(today.getDate() + diff);

  return resultDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getCurrentDateDetailed = (dayName: string) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDay = dayMap[dayName as keyof typeof dayMap];
  if (targetDay === undefined) return '';

  const diff = targetDay - currentDay;
  const resultDate = new Date(today);
  resultDate.setDate(today.getDate() + diff);

  return resultDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
