import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mantine/core';

// Import refactored components and hooks
import { HomePage, CreateLessonPage, Header, SettingsPage } from './components';
import { useAmplifyClient } from './hooks/useAmplifyClient';
import { useLessonPlanModal } from './hooks/useLessonPlanModal';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useTheme } from './contexts';
import { LessonPlanFormData } from './types';

function App() {
  // Custom hooks
  const {
    isAmplifyReady,
    lessonPlans,
    updateLessonPlanDay,
    deleteLessonPlan,
    saveLessonPlan,
  } = useAmplifyClient();

  const {
    selectedLessonId,
    isModalOpen,
    formData,
    openEditModal,
    closeModal,
    updateFormData,
    createLessonPlanFromForm,
    validateForm,
  } = useLessonPlanModal();

  const {
    activeId,
    sensors,
    activeLessonPlan,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    collisionDetection,
  } = useDragAndDrop(lessonPlans, () => {}, updateLessonPlanDay);

  const { colorScheme, toggleColorScheme } = useTheme();

  // Handle saving lesson plan from the create page
  const handleSaveFromCreatePage = (formData: LessonPlanFormData) => {
    const lessonPlan = {
      id: Date.now().toString(),
      ...formData,
    };
    saveLessonPlan(lessonPlan, false);
  };

  // Handle logout (you can customize this based on your auth system)
  const handleLogout = () => {
    // Clear any stored data
    localStorage.clear();
    sessionStorage.clear();

    // You can add additional logout logic here, such as:
    // - Calling Amplify Auth.signOut()
    // - Redirecting to login page
    // - Clearing application state

    console.log('User logged out');
    alert('You have been signed out successfully');
  };

  return (
    <Router>
      <Box>
        <Header isAmplifyReady={isAmplifyReady} />
        <Routes>
          <Route
            path='/'
            element={
              <HomePage
                lessonPlans={lessonPlans}
                deleteLessonPlan={deleteLessonPlan}
                saveLessonPlan={saveLessonPlan}
                selectedLessonId={selectedLessonId}
                isModalOpen={isModalOpen}
                formData={formData}
                openEditModal={openEditModal}
                closeModal={closeModal}
                updateFormData={updateFormData}
                createLessonPlanFromForm={createLessonPlanFromForm}
                validateForm={validateForm}
                activeId={activeId}
                sensors={sensors}
                activeLessonPlan={activeLessonPlan}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
                handleDragEnd={handleDragEnd}
                collisionDetection={collisionDetection}
              />
            }
          />
          <Route
            path='/create-lesson'
            element={<CreateLessonPage onSave={handleSaveFromCreatePage} />}
          />
          <Route
            path='/settings'
            element={
              <SettingsPage
                darkMode={colorScheme === 'dark'}
                onToggleDarkMode={toggleColorScheme}
                onLogout={handleLogout}
                isAmplifyReady={isAmplifyReady}
              />
            }
          />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
