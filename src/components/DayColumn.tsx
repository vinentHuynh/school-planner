import { useDroppable } from '@dnd-kit/core';
import {
  Box,
  Group,
  Stack,
  Text,
  Paper,
  useMantineColorScheme,
  useMantineTheme,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconCalendar, IconChevronRight } from '@tabler/icons-react';
import { DayColumnProps } from '../types';
import { getCurrentDate } from '../utils/dateUtils';

export function DayColumn({
  dayId,
  dayName,
  children,
  count,
  color,
  onClick,
}: DayColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: dayId,
  });

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const style = {
    backgroundColor: isOver
      ? `${color}15`
      : colorScheme === 'dark'
      ? theme.colors.dark[6]
      : theme.colors.gray[0],
    borderColor: isOver
      ? color
      : colorScheme === 'dark'
      ? theme.colors.dark[3]
      : theme.colors.gray[3],
    borderWidth: '2px',
    borderStyle: isOver ? 'solid' : 'dashed',
    borderRadius: '12px',
    minHeight: '400px',
    padding: '12px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        // Only trigger onClick if not dragging and not clicking the expand button
        if (!e.defaultPrevented) {
          onClick();
        }
      }}
    >
      <Group mb='sm' justify='space-between' align='center'>
        <Stack gap={4}>
          <Text fw={600} size='sm' c={color}>
            {dayName}
          </Text>
          <Text size='xs' c='dimmed'>
            {dayName !== 'Inbox' ? getCurrentDate(dayName) : 'Unscheduled'}
          </Text>
        </Stack>
        <Tooltip
          label={`View ${count} lesson${count !== 1 ? 's' : ''}`}
          position='top'
        >
          <ActionIcon
            variant='subtle'
            color={color.replace('#', '')}
            size='sm'
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <IconChevronRight size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Stack gap='xs'>{children}</Stack>
      {count === 0 && (
        <Paper
          p='md'
          ta='center'
          c='dimmed'
          style={{ border: 'none', backgroundColor: 'transparent' }}
        >
          <IconCalendar
            size={24}
            style={{ opacity: 0.3, marginBottom: '8px' }}
          />
          <Text size='xs' c='dimmed'>
            Click to add lessons
          </Text>
        </Paper>
      )}
    </Box>
  );
}
