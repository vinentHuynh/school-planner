import { useEffect, useState } from 'react';
import { LessonPlan, DayOfWeek } from '../types';
import { demoLessonPlans } from '../data/demoData';

export const useAmplifyClient = () => {
  const [client] = useState<any>(null);
  const [isAmplifyReady, setIsAmplifyReady] = useState(false);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        // For now, we'll use demo mode since Amplify setup is complex
        setIsAmplifyReady(false);
        setLessonPlans(demoLessonPlans);
      } catch (error) {
        console.log('Amplify not available, running in demo mode:', error);
        setIsAmplifyReady(false);
        setLessonPlans(demoLessonPlans);
      }
    };

    initializeClient();
  }, []);

  const updateLessonPlanDay = (id: string, newDay: DayOfWeek) => {
    if (client && isAmplifyReady) {
      // Note: You might need to update your Amplify schema to include day field
      client.models.Todo.update({ id, dayOfWeek: newDay });
    } else {
      // Demo mode - update local state
      setLessonPlans((prev) =>
        prev.map((lessonPlan) =>
          lessonPlan.id === id ? { ...lessonPlan, day: newDay } : lessonPlan,
        ),
      );
    }
  };

  const deleteLessonPlan = (id: string) => {
    if (client && isAmplifyReady) {
      client.models.Todo.delete({ id });
    } else {
      // Demo mode - remove from local state
      setLessonPlans((prev) =>
        prev.filter((lessonPlan) => lessonPlan.id !== id),
      );
    }
  };

  const saveLessonPlan = (lessonPlan: LessonPlan, isEdit: boolean) => {
    if (isEdit) {
      // Edit existing lesson plan
      setLessonPlans((prev) =>
        prev.map((lp) => (lp.id === lessonPlan.id ? lessonPlan : lp)),
      );
    } else {
      // Create new lesson plan
      setLessonPlans((prev) => [...prev, lessonPlan]);
    }
  };

  return {
    client,
    isAmplifyReady,
    lessonPlans,
    setLessonPlans,
    updateLessonPlanDay,
    deleteLessonPlan,
    saveLessonPlan,
  };
};
