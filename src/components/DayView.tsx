import {
  Box,
  Container,
  Stack,
  Group,
  Title,
  Text,
  Badge,
  Paper,
  ActionIcon,
  Button,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  IconArrowLeft,
  IconCalendar,
  IconBook,
  IconClock,
  IconEdit,
  IconTrash,
  IconPlus,
} from '@tabler/icons-react';
import { LessonPlan, DayOfWeek } from '../types';
import { daysOfWeek, getCurrentDateDetailed } from '../utils/dateUtils';

interface DayViewProps {
  selectedDay: DayOfWeek;
  dayLessonPlans: LessonPlan[];
  onClose: () => void;
  onCreateLesson: () => void;
  onEditLesson: (id: string) => void;
  onDeleteLesson: (id: string) => void;
  activeId: string | null;
  activeLessonPlan: LessonPlan | null;
  sensors: any;
  handleDragStart: any;
  handleDragOver: any;
  handleDragEnd: any;
  collisionDetection: any;
}

export function DayView({
  selectedDay,
  dayLessonPlans,
  onClose,
  onCreateLesson,
  onEditLesson,
  onDeleteLesson,
  activeId,
  activeLessonPlan,
  sensors,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  collisionDetection,
}: DayViewProps) {
  const selectedDayInfo = daysOfWeek.find((d) => d.id === selectedDay);
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        zIndex: 1000,
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      <Container size='xl' style={{ maxWidth: '90vw', width: '100%' }}>
        <Stack gap='lg'>
          <Group justify='space-between' align='center' mb='lg'>
            <Group>
              <ActionIcon
                variant='subtle'
                size='xl'
                onClick={onClose}
                style={{
                  borderRadius: '50%',
                }}
                styles={{
                  root: {
                    '&:hover': { 
                      backgroundColor: colorScheme === 'dark' 
                        ? theme.colors.dark[6] 
                        : theme.colors.gray[1] 
                    },
                  },
                }}
              >
                <IconArrowLeft size={24} />
              </ActionIcon>
              <Stack gap={6}>
                <Title order={1} c={selectedDayInfo?.color} size='2.5rem'>
                  {selectedDayInfo?.name}
                </Title>
                <Text size='md' c='dimmed'>
                  {selectedDayInfo?.name !== 'Inbox'
                    ? getCurrentDateDetailed(selectedDayInfo?.name || '')
                    : 'Unscheduled Tasks'}
                </Text>
              </Stack>
            </Group>
            <Badge
              color={selectedDayInfo?.color.replace('#', '')}
              size='xl'
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            >
              {dayLessonPlans.length}{' '}
              {dayLessonPlans.length === 1 ? 'lesson plan' : 'lesson plans'}
            </Badge>
          </Group>

          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={dayLessonPlans.map((lessonPlan) => lessonPlan.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack gap='xl'>
                {dayLessonPlans.map((lessonPlan) => (
                  <Paper
                    key={lessonPlan.id}
                    shadow='md'
                    p='xl'
                    withBorder
                    style={{
                      borderLeft: `8px solid ${selectedDayInfo?.color}`,
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Group justify='space-between' wrap='nowrap'>
                      <Box style={{ flex: 1 }}>
                        <Group
                          justify='space-between'
                          align='flex-start'
                          mb='md'
                        >
                          <Box>
                            <Text size='lg' fw={600} mb='xs'>
                              {lessonPlan.title}
                            </Text>
                            <Group gap='sm' mt={4}>
                              <Badge
                                variant='light'
                                leftSection={<IconBook size={14} />}
                                size='md'
                              >
                                {lessonPlan.subject}
                              </Badge>
                              <Badge
                                variant='outline'
                                leftSection={<IconClock size={14} />}
                                size='md'
                              >
                                {lessonPlan.duration} min
                              </Badge>
                              {lessonPlan.timeSlot && (
                                <Badge variant='outline' color='gray' size='md'>
                                  {lessonPlan.timeSlot}
                                </Badge>
                              )}
                            </Group>
                          </Box>
                        </Group>

                        {lessonPlan.description && (
                          <Text
                            size='sm'
                            c='dimmed'
                            mb='sm'
                            style={{ lineHeight: 1.6 }}
                          >
                            {lessonPlan.description}
                          </Text>
                        )}

                        {lessonPlan.objectives && (
                          <Text
                            size='sm'
                            c='dimmed'
                            mb='sm'
                            style={{ lineHeight: 1.6 }}
                          >
                            <strong>Objectives:</strong> {lessonPlan.objectives}
                          </Text>
                        )}

                        {lessonPlan.materials && (
                          <Text
                            size='sm'
                            c='dimmed'
                            style={{ lineHeight: 1.6 }}
                          >
                            <strong>Materials:</strong> {lessonPlan.materials}
                          </Text>
                        )}
                      </Box>

                      <Group gap='sm'>
                        <ActionIcon
                          color='blue'
                          variant='subtle'
                          size='lg'
                          onClick={() => onEditLesson(lessonPlan.id)}
                        >
                          <IconEdit size={20} />
                        </ActionIcon>
                        <ActionIcon
                          color='red'
                          variant='subtle'
                          size='lg'
                          onClick={() => onDeleteLesson(lessonPlan.id)}
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
                  shadow='md'
                  p='lg'
                  withBorder
                  style={{
                    opacity: 0.9,
                    borderLeft: `6px solid ${selectedDayInfo?.color}`,
                  }}
                >
                  <Group justify='space-between' wrap='nowrap'>
                    <Box>
                      <Text size='md' fw={500}>
                        {activeLessonPlan.title}
                      </Text>
                      <Text size='sm' c='dimmed'>
                        {activeLessonPlan.subject}
                      </Text>
                    </Box>
                    <ActionIcon
                      color='red'
                      variant='subtle'
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
            <Paper
              p='3xl'
              ta='center'
              c='dimmed'
              style={{ 
                backgroundColor: colorScheme === 'dark' 
                  ? theme.colors.dark[6] 
                  : theme.colors.gray[0], 
                borderRadius: '16px' 
              }}
            >
              <IconCalendar
                size={64}
                style={{ opacity: 0.3, marginBottom: '24px' }}
              />
              <Title order={2} c='dimmed' mb='lg'>
                No lesson plans scheduled
              </Title>
              <Text
                size='md'
                c='dimmed'
                style={{ lineHeight: 1.6, maxWidth: '400px', margin: '0 auto' }}
              >
                No lesson plans scheduled for {selectedDayInfo?.name}. Create
                new lesson plans to get started.
              </Text>
            </Paper>
          )}

          <Button
            leftSection={<IconPlus size={18} />}
            onClick={onCreateLesson}
            variant='filled'
            size='xl'
            fullWidth
            style={{
              height: '60px',
              fontSize: '1.1rem',
              borderRadius: '12px',
            }}
          >
            Add Lesson Plan for {selectedDayInfo?.name}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
