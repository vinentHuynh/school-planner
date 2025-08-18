import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Container,
  Title,
  Button,
  Paper,
  Group,
  Text,
  ActionIcon,
  Stack,
  Box,
  Badge,
  SimpleGrid,
  TextInput,
  Textarea,
  Select,
  Modal,
  NumberInput,
} from '@mantine/core';
import { IconTrash, IconPlus, IconCalendar, IconArrowLeft, IconEdit, IconBook, IconClock, IconDeviceFloppy } from '@tabler/icons-react';

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface LessonPlan {
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

interface SortableItemProps {
  id: string;
  title: string;
  subject: string;
  onDelete: (id: string) => void;
}

function SortableItem({ id, title, subject, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    backgroundColor: isDragging ? '#f8f9fa' : undefined,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={{
        ...style,
        borderLeft: `4px solid #e9ecef`,
      }}
      shadow="xs"
      p="sm"
      withBorder
      mb="xs"
      {...attributes}
      {...listeners}
    >
      <Group justify="space-between" wrap="nowrap">
        <Stack gap={2}>
          <Text size="sm" fw={500}>{title}</Text>
          <Text size="xs" c="dimmed">{subject}</Text>
        </Stack>
        <ActionIcon
          color="red"
          variant="subtle"
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag when clicking delete
            onDelete(id);
          }}
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag on mouse down
          onTouchStart={(e) => e.stopPropagation()} // Prevent drag on touch
        >
          <IconTrash size={14} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}

interface DayColumnProps {
  dayId: DayOfWeek;
  dayName: string;
  children: React.ReactNode;
  count: number;
  color: string;
  onClick: () => void;
}

function DayColumn({ dayId, dayName, children, count, color, onClick }: DayColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: dayId,
  });

  const style = {
    backgroundColor: isOver ? `${color}15` : '#f8f9fa',
    borderColor: isOver ? color : '#e9ecef',
    borderWidth: '2px',
    borderStyle: isOver ? 'solid' : 'dashed',
    borderRadius: '12px',
    minHeight: '400px',
    padding: '12px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  };

  const getCurrentDate = (dayName: string) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayMap = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    
    const targetDay = dayMap[dayName as keyof typeof dayMap];
    if (targetDay === undefined) return '';
    
    const diff = targetDay - currentDay;
    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + diff);
    
    return resultDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Box 
      ref={setNodeRef} 
      style={style}
      onClick={(e) => {
        // Only trigger onClick if not dragging
        if (!e.defaultPrevented) {
          onClick();
        }
      }}
    >
      <Group mb="sm" justify="space-between" align="center">
        <Stack gap={4}>
          <Text fw={600} size="sm" c={color}>
            {dayName}
          </Text>
          <Text size="xs" c="dimmed">
            {dayName !== 'Inbox' ? getCurrentDate(dayName) : 'Unscheduled'}
          </Text>
        </Stack>
        <Badge color={color.replace('#', '')} size="sm" variant="light">
          {count}
        </Badge>
      </Group>
      <Stack gap="xs">
        {children}
      </Stack>
      {count === 0 && (
        <Paper p="md" ta="center" c="dimmed" style={{ border: 'none', backgroundColor: 'transparent' }}>
          <IconCalendar size={24} style={{ opacity: 0.3, marginBottom: '8px' }} />
          <Text size="xs" c="dimmed">
            Drop tasks here
          </Text>
        </Paper>
      )}
    </Box>
  );
}

function App() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [client, setClient] = useState<any>(null);
  const [isAmplifyReady, setIsAmplifyReady] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Modal and form state
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state for lesson plan editing
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    duration: 60,
    objectives: '',
    materials: '',
    day: 'monday' as DayOfWeek,
    timeSlot: '',
  });
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const daysOfWeek = [
    { id: 'monday' as DayOfWeek, name: 'Monday', color: '#ff6b6b' },
    { id: 'tuesday' as DayOfWeek, name: 'Tuesday', color: '#4ecdc4' },
    { id: 'wednesday' as DayOfWeek, name: 'Wednesday', color: '#45b7d1' },
    { id: 'thursday' as DayOfWeek, name: 'Thursday', color: '#96ceb4' },
    { id: 'friday' as DayOfWeek, name: 'Friday', color: '#feca57' },
    { id: 'saturday' as DayOfWeek, name: 'Saturday', color: '#ff9ff3' },
    { id: 'sunday' as DayOfWeek, name: 'Sunday', color: '#54a0ff' },
  ];

  useEffect(() => {
    // Wait a bit for Amplify to be configured, then create the client
    const initializeClient = async () => {
      try {
        // Small delay to ensure Amplify is configured
        await new Promise(resolve => setTimeout(resolve, 100));
        const amplifyClient = generateClient<Schema>();
        setClient(amplifyClient);
        setIsAmplifyReady(true);
        
        // Subscribe to lesson plans
        amplifyClient.models.Todo.observeQuery().subscribe({
          next: (data) => {
            const lessonPlansWithDay = data.items.map(todo => ({
              id: todo.id,
              title: todo.content || '',
              subject: 'General',
              description: '',
              day: 'monday' as DayOfWeek, // Default to monday
            })) as LessonPlan[];
            setLessonPlans(lessonPlansWithDay);
          },
        });
      } catch (error) {
        console.log('Amplify not available, running in demo mode:', error);
        setIsAmplifyReady(false);
        // Set some demo lesson plans for demonstration
        setLessonPlans([
          { 
            id: '1', 
            title: 'Introduction to Algebra', 
            subject: 'Mathematics', 
            description: 'Basic algebraic concepts and equations', 
            duration: 90,
            objectives: 'Students will understand variables, expressions, and basic equation solving',
            materials: 'Whiteboard, algebra textbooks, calculators, practice worksheets',
            day: 'monday',
            timeSlot: '9:00 AM - 10:30 AM'
          },
          { 
            id: '2', 
            title: 'Shakespearean Literature', 
            subject: 'English', 
            description: 'Analyzing themes in Romeo and Juliet', 
            duration: 60,
            objectives: 'Analyze character development and identify key themes in Act II',
            materials: 'Romeo and Juliet texts, discussion handouts, video clips',
            day: 'monday',
            timeSlot: '11:00 AM - 12:00 PM'
          },
          { 
            id: '3', 
            title: 'Cell Biology', 
            subject: 'Science', 
            description: 'Structure and function of plant and animal cells', 
            duration: 75,
            objectives: 'Compare and contrast plant and animal cell structures',
            materials: 'Microscopes, prepared slides, cell diagram worksheets',
            day: 'tuesday',
            timeSlot: '10:00 AM - 11:15 AM'
          },
          { 
            id: '4', 
            title: 'World War II', 
            subject: 'History', 
            description: 'Causes and consequences of WWII', 
            duration: 60,
            objectives: 'Understand the major causes and global impact of WWII',
            materials: 'Historical documents, maps, documentary clips',
            day: 'wednesday',
            timeSlot: '1:00 PM - 2:00 PM'
          },
          { 
            id: '5', 
            title: 'Geometry Proofs', 
            subject: 'Mathematics', 
            description: 'Introduction to geometric proof writing', 
            duration: 90,
            objectives: 'Write basic geometric proofs using postulates and theorems',
            materials: 'Geometry textbooks, rulers, protractors, proof worksheets',
            day: 'thursday',
            timeSlot: '9:00 AM - 10:30 AM'
          },
          { 
            id: '6', 
            title: 'Creative Writing', 
            subject: 'English', 
            description: 'Poetry and short story techniques', 
            duration: 60,
            objectives: 'Apply literary devices in original creative writing pieces',
            materials: 'Writing journals, poetry examples, peer review sheets',
            day: 'friday',
            timeSlot: '2:00 PM - 3:00 PM'
          },
          { 
            id: '7', 
            title: 'Physical Education', 
            subject: 'PE', 
            description: 'Basketball fundamentals and teamwork', 
            duration: 45,
            objectives: 'Develop basketball skills and teamwork strategies',
            materials: 'Basketballs, cones, scoreboard, team vests',
            day: 'saturday',
            timeSlot: '10:00 AM - 10:45 AM'
          },
          { 
            id: '8', 
            title: 'Music Theory', 
            subject: 'Music', 
            description: 'Basic scales and chord progressions', 
            duration: 60,
            objectives: 'Identify major scales and construct basic chord progressions',
            materials: 'Piano/keyboard, music sheets, chord charts',
            day: 'sunday',
            timeSlot: '11:00 AM - 12:00 PM'
          },
        ]);
      }
    };

    initializeClient();
  }, []);

  function createLessonPlan() {
    // Open the modal for creating a new lesson plan
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
  }

  function editLessonPlan(id: string) {
    const lessonPlan = lessonPlans.find(lp => lp.id === id);
    if (lessonPlan) {
      setSelectedLessonId(id);
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
    }
  }

  function saveLessonPlan() {
    if (!formData.title || !formData.subject) {
      alert('Please fill in title and subject');
      return;
    }

    const lessonPlan: LessonPlan = {
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

    if (selectedLessonId) {
      // Edit existing lesson plan
      setLessonPlans(prev => prev.map(lp => lp.id === selectedLessonId ? lessonPlan : lp));
    } else {
      // Create new lesson plan
      setLessonPlans(prev => [...prev, lessonPlan]);
    }

    setIsModalOpen(false);
    setSelectedLessonId(null);
  }

  function deleteLessonPlan(id: string) {
    if (client && isAmplifyReady) {
      client.models.Todo.delete({ id });
    } else {
      // Demo mode - remove from local state
      setLessonPlans(prev => prev.filter(lessonPlan => lessonPlan.id !== id));
    }
  }

  function updateLessonPlanDay(id: string, newDay: DayOfWeek) {
    if (client && isAmplifyReady) {
      // Note: You might need to update your Amplify schema to include day field
      client.models.Todo.update({ id, dayOfWeek: newDay });
    } else {
      // Demo mode - update local state
      setLessonPlans(prev => prev.map(lessonPlan => 
        lessonPlan.id === id ? { ...lessonPlan, day: newDay } : lessonPlan
      ));
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropping over a day column
    if (daysOfWeek.some(day => day.id === overId)) {
      const lessonPlan = lessonPlans.find(l => l.id === activeId);
      if (lessonPlan && lessonPlan.day !== overId) {
        updateLessonPlanDay(activeId, overId as DayOfWeek);
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle reordering within the same day
    if (activeId !== overId) {
      const activeLessonPlan = lessonPlans.find(l => l.id === activeId);
      const overLessonPlan = lessonPlans.find(l => l.id === overId);
      
      if (activeLessonPlan && overLessonPlan && activeLessonPlan.day === overLessonPlan.day) {
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
  }

  const getLessonPlansForDay = (dayId: DayOfWeek) => lessonPlans.filter(lessonPlan => lessonPlan.day === dayId);
  const activeLessonPlan = activeId ? lessonPlans.find(lessonPlan => lessonPlan.id === activeId) : null;

  const openDayView = (dayId: DayOfWeek) => {
    setSelectedDay(dayId);
    setIsFullScreen(true);
  };

  const closeDayView = () => {
    setIsFullScreen(false);
    setSelectedDay(null);
  };

  const getCurrentDate = (dayName: string) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayMap = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
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
      year: 'numeric'
    });
  };

  // Full screen day view
  if (isFullScreen && selectedDay) {
    const selectedDayInfo = daysOfWeek.find(d => d.id === selectedDay);
    const dayLessonPlans = getLessonPlansForDay(selectedDay);
    
    return (
      <Box 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 1000,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '2rem',
          paddingBottom: '2rem'
        }}
      >
        <Container size="xl" style={{ maxWidth: '90vw', width: '100%' }}>
          <Stack gap="lg">
            <Group justify="space-between" align="center" mb="lg">
            <Group>
              <ActionIcon
                variant="subtle"
                size="xl"
                onClick={closeDayView}
                style={{ 
                  borderRadius: '50%',
                  '&:hover': { backgroundColor: '#f8f9fa' }
                }}
              >
                <IconArrowLeft size={24} />
              </ActionIcon>
              <Stack gap={6}>
                <Title order={1} c={selectedDayInfo?.color} size="2.5rem">
                  {selectedDayInfo?.name}
                </Title>
                <Text size="md" c="dimmed">
                  {selectedDayInfo?.name !== 'Inbox' ? getCurrentDate(selectedDayInfo?.name || '') : 'Unscheduled Tasks'}
                </Text>
              </Stack>
            </Group>
            <Badge color={selectedDayInfo?.color.replace('#', '')} size="xl" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              {dayLessonPlans.length} {dayLessonPlans.length === 1 ? 'lesson plan' : 'lesson plans'}
            </Badge>
          </Group>          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={dayLessonPlans.map(lessonPlan => lessonPlan.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap="xl">
                {dayLessonPlans.map((lessonPlan) => (
                  <Paper
                    key={lessonPlan.id}
                    shadow="md"
                    p="xl"
                    withBorder
                    style={{
                      borderLeft: `8px solid ${selectedDayInfo?.color}`,
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Group justify="space-between" wrap="nowrap">
                      <Box style={{ flex: 1 }}>
                        <Group justify="space-between" align="flex-start" mb="md">
                          <Box>
                            <Text size="lg" fw={600} mb="xs">{lessonPlan.title}</Text>
                            <Group gap="sm" mt={4}>
                              <Badge variant="light" leftSection={<IconBook size={14} />} size="md">
                                {lessonPlan.subject}
                              </Badge>
                              <Badge variant="outline" leftSection={<IconClock size={14} />} size="md">
                                {lessonPlan.duration} min
                              </Badge>
                              {lessonPlan.timeSlot && (
                                <Badge variant="outline" color="gray" size="md">
                                  {lessonPlan.timeSlot}
                                </Badge>
                              )}
                            </Group>
                          </Box>
                        </Group>
                        
                        {lessonPlan.description && (
                          <Text size="sm" c="dimmed" mb="sm" style={{ lineHeight: 1.6 }}>{lessonPlan.description}</Text>
                        )}
                        
                        {lessonPlan.objectives && (
                          <Text size="sm" c="dimmed" mb="sm" style={{ lineHeight: 1.6 }}>
                            <strong>Objectives:</strong> {lessonPlan.objectives}
                          </Text>
                        )}
                        
                        {lessonPlan.materials && (
                          <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                            <strong>Materials:</strong> {lessonPlan.materials}
                          </Text>
                        )}
                      </Box>
                      
                      <Group gap="sm">
                        <ActionIcon
                          color="blue"
                          variant="subtle"
                          size="lg"
                          onClick={() => editLessonPlan(lessonPlan.id)}
                        >
                          <IconEdit size={20} />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          size="lg"
                          onClick={() => deleteLessonPlan(lessonPlan.id)}
                        >
                          <IconTrash size={20} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </SortableContext>

            <DragOverlay>
              {activeId && activeLessonPlan ? (
                <Paper
                  shadow="md"
                  p="lg"
                  withBorder
                  style={{ 
                    opacity: 0.9,
                    borderLeft: `6px solid ${selectedDayInfo?.color}`,
                  }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    <Box>
                      <Text size="md" fw={500}>{activeLessonPlan.title}</Text>
                      <Text size="sm" c="dimmed">{activeLessonPlan.subject}</Text>
                    </Box>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      style={{ pointerEvents: 'none' }}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Paper>
              ) : null}
            </DragOverlay>
          </DndContext>

          {dayLessonPlans.length === 0 && (
            <Paper p="3xl" ta="center" c="dimmed" style={{ backgroundColor: '#f8f9fa', borderRadius: '16px' }}>
              <IconCalendar size={64} style={{ opacity: 0.3, marginBottom: '24px' }} />
              <Title order={2} c="dimmed" mb="lg">No lesson plans scheduled</Title>
              <Text size="md" c="dimmed" style={{ lineHeight: 1.6, maxWidth: '400px', margin: '0 auto' }}>
                No lesson plans scheduled for {selectedDayInfo?.name}. Create new lesson plans to get started.
              </Text>
            </Paper>
          )}

          <Button
            leftSection={<IconPlus size={18} />}
            onClick={createLessonPlan}
            variant="filled"
            size="xl"
            fullWidth
            style={{ 
              height: '60px',
              fontSize: '1.1rem',
              borderRadius: '12px'
            }}
          >
            Add Lesson Plan for {selectedDayInfo?.name}
          </Button>
        </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box p="md" style={{ minHeight: '100vh', width: '100vw' }}>
      <Stack gap="lg">
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Stack gap={4}>
              <Title order={1} c="blue">
                � School Planner - Lesson Plan Manager
              </Title>
              <Text size="sm" c="dimmed">
                Drag and drop lesson plans to organize your weekly teaching schedule
              </Text>
            </Stack>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={createLessonPlan}
              variant="filled"
              size="md"
            >
              Create New Lesson Plan
            </Button>
          </Group>

          {!isAmplifyReady && (
            <Paper p="sm" bg="yellow.1" withBorder>
              <Text size="sm" c="orange">
                Running in demo mode - Amplify backend not connected
              </Text>
            </Paper>
          )}
        </Container>

        <Container size="xl">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <SimpleGrid 
                cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 7, xl: 7 }} 
                spacing="md"
                style={{ 
                  maxWidth: 'fit-content'
                }}
              >
              {daysOfWeek.map((day) => {
                const dayLessonPlans = getLessonPlansForDay(day.id);
                return (
                  <DayColumn
                    key={day.id}
                    dayId={day.id}
                    dayName={day.name}
                    color={day.color}
                    count={dayLessonPlans.length}
                    onClick={() => openDayView(day.id)}
                  >
                    <SortableContext
                      items={dayLessonPlans.map(lessonPlan => lessonPlan.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {dayLessonPlans.map((lessonPlan) => (
                        <SortableItem
                          key={lessonPlan.id}
                          id={lessonPlan.id}
                          title={lessonPlan.title}
                          subject={lessonPlan.subject}
                          onDelete={deleteLessonPlan}
                        />
                      ))}
                    </SortableContext>
                  </DayColumn>
                );
              })}
            </SimpleGrid>
            </Box>

            <DragOverlay>
              {activeId && activeLessonPlan ? (
                <Paper
                  shadow="md"
                  p="sm"
                  withBorder
                  style={{ 
                    opacity: 0.9,
                    borderLeft: `4px solid ${daysOfWeek.find(d => d.id === activeLessonPlan.day)?.color}`,
                  }}
                >
                  <Group justify="space-between" wrap="nowrap">
                    <Box>
                      <Text size="sm">{activeLessonPlan.title}</Text>
                      <Text size="xs" c="dimmed">{activeLessonPlan.subject}</Text>
                    </Box>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      size="sm"
                      style={{ pointerEvents: 'none' }}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Paper>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Container>

        <Container size="xl">
          <Box mt="lg" p="md" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <Text size="sm" c="dimmed" ta="center">
              📚 Weekly lesson planner for educators! Organize your teaching schedule by dragging lesson plans between days.
              <br />
              Click the "+" button to create detailed lesson plans with objectives, materials, and time allocations.
            </Text>
          </Box>
        </Container>
      </Stack>

      {/* Lesson Plan Edit Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <Group>
            <IconBook size={20} />
            <Text fw={500}>{selectedLessonId ? 'Edit Lesson Plan' : 'Create New Lesson Plan'}</Text>
          </Group>
        }
        size="lg"
      >
        <Stack gap="md">
          <Group grow>
            <TextInput
              label="Lesson Title"
              placeholder="Enter lesson title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <TextInput
              label="Subject"
              placeholder="e.g., Mathematics, English, Science"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              required
            />
          </Group>

          <Group grow>
            <Select
              label="Day of Week"
              value={formData.day}
              onChange={(value) => setFormData(prev => ({ ...prev, day: value as DayOfWeek }))}
              data={daysOfWeek.map(day => ({ value: day.id, label: day.name }))}
            />
            <NumberInput
              label="Duration (minutes)"
              value={formData.duration}
              onChange={(value) => setFormData(prev => ({ ...prev, duration: typeof value === 'number' ? value : 60 }))}
              min={15}
              max={240}
              step={15}
            />
          </Group>

          <TextInput
            label="Time Slot"
            placeholder="e.g., 9:00 AM - 10:30 AM (optional)"
            value={formData.timeSlot}
            onChange={(e) => setFormData(prev => ({ ...prev, timeSlot: e.target.value }))}
          />

          <Textarea
            label="Description"
            placeholder="Brief description of the lesson"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />

          <Textarea
            label="Learning Objectives"
            placeholder="What will students learn or achieve in this lesson?"
            value={formData.objectives}
            onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
            rows={3}
          />

          <Textarea
            label="Materials Needed"
            placeholder="List materials, resources, and equipment needed"
            value={formData.materials}
            onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
            rows={3}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button leftSection={<IconDeviceFloppy size={16} />} onClick={saveLessonPlan}>
              {selectedLessonId ? 'Save Changes' : 'Create Lesson Plan'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

export default App;
