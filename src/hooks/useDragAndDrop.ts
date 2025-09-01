import { useState } from 'react';
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { LessonPlan, DayOfWeek } from '../types';
import { daysOfWeek } from '../utils/dateUtils';

export const useDragAndDrop = (
  lessonPlans: LessonPlan[],
  setLessonPlans: React.Dispatch<React.SetStateAction<LessonPlan[]>>,
  updateLessonPlanDay: (activeId: string, overId: DayOfWeek) => void,
) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropping over a day column
    if (daysOfWeek.some((day) => day.id === overId)) {
      const lessonPlan = lessonPlans.find((l) => l.id === activeId);
      if (lessonPlan && lessonPlan.day !== overId) {
        updateLessonPlanDay(activeId, overId as DayOfWeek);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle reordering within the same day
    if (activeId !== overId) {
      const activeLessonPlan = lessonPlans.find((l) => l.id === activeId);
      const overLessonPlan = lessonPlans.find((l) => l.id === overId);

      if (
        activeLessonPlan &&
        overLessonPlan &&
        activeLessonPlan.day === overLessonPlan.day
      ) {
        setLessonPlans((items) => {
          const oldIndex = items.findIndex((item) => item.id === activeId);
          const newIndex = items.findIndex((item) => item.id === overId);

          const newItems = [...items];
          const [movedItem] = newItems.splice(oldIndex, 1);
          newItems.splice(newIndex, 0, movedItem);

          return newItems;
        });
      }
    }
  };

  const activeLessonPlan = activeId
    ? lessonPlans.find((lessonPlan) => lessonPlan.id === activeId) ?? null
    : null;

  return {
    activeId,
    sensors,
    activeLessonPlan,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    collisionDetection: closestCenter,
  };
};
