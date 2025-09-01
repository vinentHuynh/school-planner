import { useState } from 'react';
import { LessonPlan, LessonPlanFormData } from '../types';

export const useLessonPlanModal = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<LessonPlanFormData>({
    title: '',
    subject: '',
    description: '',
    duration: 60,
    objectives: '',
    materials: '',
    day: 'monday',
    timeSlot: '',
  });

  const openCreateModal = () => {
    setSelectedLessonId(null);
    setFormData({
      title: '',
      subject: '',
      description: '',
      duration: 60,
      objectives: '',
      materials: '',
      day: 'monday',
      timeSlot: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (lessonPlan: LessonPlan) => {
    setSelectedLessonId(lessonPlan.id);
    setFormData({
      title: lessonPlan.title,
      subject: lessonPlan.subject,
      description: lessonPlan.description,
      duration: lessonPlan.duration,
      objectives: lessonPlan.objectives,
      materials: lessonPlan.materials,
      day: lessonPlan.day,
      timeSlot: lessonPlan.timeSlot || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLessonId(null);
  };

  const updateFormData = (field: keyof LessonPlanFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const createLessonPlanFromForm = (): LessonPlan => {
    return {
      id: selectedLessonId || Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      description: formData.description,
      duration: formData.duration,
      objectives: formData.objectives,
      materials: formData.materials,
      day: formData.day,
      timeSlot: formData.timeSlot,
    };
  };

  const validateForm = (): boolean => {
    return !!(formData.title && formData.subject);
  };

  return {
    selectedLessonId,
    isModalOpen,
    formData,
    openCreateModal,
    openEditModal,
    closeModal,
    updateFormData,
    createLessonPlanFromForm,
    validateForm,
  };
};
