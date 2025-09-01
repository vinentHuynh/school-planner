import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Text,
  Stack,
  Box,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';

import { WeeklyGridView } from './WeeklyGridView';
import { DayView } from './DayView';
import { LessonPlanModal } from './LessonPlanModal';
import { DayOfWeek, LessonPlan, LessonPlanFormData } from '../types';

interface HomePageProps {
  lessonPlans: LessonPlan[];
  deleteLessonPlan: (id: string) => void;
  saveLessonPlan: (lessonPlan: LessonPlan, isEdit: boolean) => void;
  selectedLessonId: string | null;
  isModalOpen: boolean;
  formData: LessonPlanFormData;
  openEditModal: (lessonPlan: LessonPlan) => void;
  closeModal: () => void;
  updateFormData: (field: keyof LessonPlanFormData, value: any) => void;
  createLessonPlanFromForm: () => LessonPlan;
  validateForm: () => boolean;
  activeId: string | null;
  sensors: any;
  activeLessonPlan: LessonPlan | null;
  handleDragStart: (event: any) => void;
  handleDragOver: (event: any) => void;
  handleDragEnd: (event: any) => void;
  collisionDetection: any;
}

export function HomePage({
  lessonPlans,
  deleteLessonPlan,
  saveLessonPlan,
  selectedLessonId,
  isModalOpen,
  formData,
  openEditModal,
  closeModal,
  updateFormData,
  createLessonPlanFromForm,
  validateForm,
  activeId,
  sensors,
  activeLessonPlan,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  collisionDetection,
}: HomePageProps) {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const getLessonPlansForDay = (dayId: DayOfWeek) =>
    lessonPlans.filter((lessonPlan) => lessonPlan.day === dayId);

  const openDayView = (dayId: DayOfWeek) => {
    setSelectedDay(dayId);
    setIsFullScreen(true);
  };

  const closeDayView = () => {
    setIsFullScreen(false);
    setSelectedDay(null);
  };

  const handleSaveLessonPlan = () => {
    if (!validateForm()) {
      alert('Please fill in title and subject');
      return;
    }

    const lessonPlan = createLessonPlanFromForm();
    const isEdit = !!selectedLessonId;

    saveLessonPlan(lessonPlan, isEdit);
    closeModal();
  };

  const handleEditLessonPlan = (id: string) => {
    const lessonPlan = lessonPlans.find((lp) => lp.id === id);
    if (lessonPlan) {
      openEditModal(lessonPlan);
    }
  };

  const handleCreateNewLesson = () => {
    navigate('/create-lesson');
  };

  // Full screen day view
  if (isFullScreen && selectedDay) {
    const dayLessonPlans = getLessonPlansForDay(selectedDay);

    return (
      <DayView
        selectedDay={selectedDay}
        dayLessonPlans={dayLessonPlans}
        onClose={closeDayView}
        onCreateLesson={handleCreateNewLesson}
        onEditLesson={handleEditLessonPlan}
        onDeleteLesson={deleteLessonPlan}
        activeId={activeId}
        activeLessonPlan={activeLessonPlan}
        sensors={sensors}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDragEnd={handleDragEnd}
        collisionDetection={collisionDetection}
      />
    );
  }

  return (
    <Box p='md' style={{ minHeight: '100vh', width: '100vw' }}>
      <Stack gap='lg'>
        <WeeklyGridView
          lessonPlans={lessonPlans}
          onDayClick={openDayView}
          onDeleteLesson={deleteLessonPlan}
          activeId={activeId}
          activeLessonPlan={activeLessonPlan}
          sensors={sensors}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragEnd={handleDragEnd}
          collisionDetection={collisionDetection}
        />

        <Container size='xl'>
          <Box
            mt='lg'
            p='md'
            style={{ 
              backgroundColor: colorScheme === 'dark' 
                ? theme.colors.dark[6] 
                : theme.colors.gray[0], 
              borderRadius: '8px' 
            }}
          >
            <Text size='sm' c='dimmed' ta='center'>
              📚 Weekly lesson planner for educators! Organize your teaching
              schedule by dragging lesson plans between days.
              <br />
              Click a day to view details or use the "Create Lesson" tab to add new lesson plans.
            </Text>
          </Box>
        </Container>
      </Stack>

      <LessonPlanModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveLessonPlan}
        selectedLessonId={selectedLessonId}
        formData={formData}
        updateFormData={updateFormData}
      />
    </Box>
  );
}
