import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Group, Stack, Text, ActionIcon, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { SortableItemProps } from '../types';

export function SortableItem({
  id,
  title,
  subject,
  onDelete,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    backgroundColor: isDragging 
      ? (colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0])
      : undefined,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={{
        ...style,
        borderLeft: `4px solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      }}
      shadow='xs'
      p='sm'
      withBorder
      mb='xs'
      {...attributes}
      {...listeners}
    >
      <Group justify='space-between' wrap='nowrap'>
        <Stack gap={2}>
          <Text size='sm' fw={500}>
            {title}
          </Text>
          <Text size='xs' c='dimmed'>
            {subject}
          </Text>
        </Stack>
        <ActionIcon
          color='red'
          variant='subtle'
          size='sm'
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
