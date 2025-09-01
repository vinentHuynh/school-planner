import { Box, Container, SimpleGrid } from '@mantine/core';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Paper, Group, Text, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { DayColumn } from './DayColumn';
import { SortableItem } from './SortableItem';
import { LessonPlan, DayOfWeek } from '../types';
import { daysOfWeek } from '../utils/dateUtils';

interface WeeklyGridViewProps {
  lessonPlans: LessonPlan[];
  onDayClick: (dayId: DayOfWeek) => void;
  onDeleteLesson: (id: string) => void;
  activeId: string | null;
  activeLessonPlan: LessonPlan | null;
  sensors: any;
  handleDragStart: any;
  handleDragOver: any;
  handleDragEnd: any;
  collisionDetection: any;
}

export function WeeklyGridView({
  lessonPlans,
  onDayClick,
  onDeleteLesson,
  activeId,
  activeLessonPlan,
  sensors,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  collisionDetection,
}: WeeklyGridViewProps) {
  const getLessonPlansForDay = (dayId: DayOfWeek) =>
    lessonPlans.filter((lessonPlan) => lessonPlan.day === dayId);

  return (
    <Container size='xl'>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <SimpleGrid
            cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 7, xl: 7 }}
            spacing='md'
            style={{
              maxWidth: 'fit-content',
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
                  onClick={() => onDayClick(day.id)}
                >
                  <SortableContext
                    items={dayLessonPlans.map((lessonPlan) => lessonPlan.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {dayLessonPlans.map((lessonPlan) => (
                      <SortableItem
                        key={lessonPlan.id}
                        id={lessonPlan.id}
                        title={lessonPlan.title}
                        subject={lessonPlan.subject}
                        onDelete={onDeleteLesson}
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
              shadow='md'
              p='sm'
              withBorder
              style={{
                opacity: 0.9,
                borderLeft: `4px solid ${
                  daysOfWeek.find((d) => d.id === activeLessonPlan.day)?.color
                }`,
              }}
            >
              <Group justify='space-between' wrap='nowrap'>
                <Box>
                  <Text size='sm'>{activeLessonPlan.title}</Text>
                  <Text size='xs' c='dimmed'>
                    {activeLessonPlan.subject}
                  </Text>
                </Box>
                <ActionIcon
                  color='red'
                  variant='subtle'
                  size='sm'
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
  );
}
