import {
  Modal,
  Stack,
  Group,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Button,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconBook, IconDeviceFloppy } from '@tabler/icons-react';
import { Text } from '@mantine/core';
import { DayOfWeek, LessonPlanFormData } from '../types';
import { daysOfWeek } from '../utils/dateUtils';

interface LessonPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  selectedLessonId: string | null;
  formData: LessonPlanFormData;
  updateFormData: (field: keyof LessonPlanFormData, value: any) => void;
}

export function LessonPlanModal({
  isOpen,
  onClose,
  onSave,
  selectedLessonId,
  formData,
  updateFormData,
}: LessonPlanModalProps) {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  // Get theme-aware input styles
  const getInputStyles = () => ({
    input: {
      backgroundColor:
        colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      color:
        colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.dark[9],
      border: `1px solid ${
        colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]
      }`,
    },
    label: {
      color:
        colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.dark[9],
      fontWeight: 500,
    },
  });

  // Debug: log the form data to console
  console.log('Modal rendered with formData:', formData);
  console.log('Modal isOpen:', isOpen);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group>
          <IconBook size={20} />
          <Text fw={500}>
            {selectedLessonId ? 'Edit Lesson Plan' : 'Create New Lesson Plan'}
          </Text>
        </Group>
      }
      size='lg'
      centered
      styles={{
        body: {
          padding: '1rem',
        },
        header: {
          padding: '1rem',
        },
      }}
    >
      <Stack gap='md' style={{ minHeight: '400px' }}>
        <Group grow>
          <TextInput
            label='Lesson Title'
            placeholder='Enter lesson title'
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            required
            styles={getInputStyles()}
          />
          <TextInput
            label='Subject'
            placeholder='e.g., Mathematics, English, Science'
            value={formData.subject}
            onChange={(e) => updateFormData('subject', e.target.value)}
            required
            styles={getInputStyles()}
          />
        </Group>

        <Group grow>
          <Select
            label='Day of Week'
            value={formData.day}
            onChange={(value) => updateFormData('day', value as DayOfWeek)}
            data={daysOfWeek.map((day) => ({ value: day.id, label: day.name }))}
            styles={getInputStyles()}
          />
          <NumberInput
            label='Duration (minutes)'
            value={formData.duration}
            onChange={(value) =>
              updateFormData('duration', typeof value === 'number' ? value : 60)
            }
            min={15}
            max={240}
            step={15}
            styles={getInputStyles()}
          />
        </Group>

        <TextInput
          label='Time Slot'
          placeholder='e.g., 9:00 AM - 10:30 AM (optional)'
          value={formData.timeSlot}
          onChange={(e) => updateFormData('timeSlot', e.target.value)}
          styles={getInputStyles()}
        />

        <Textarea
          label='Description'
          placeholder='Brief description of the lesson'
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          rows={3}
          styles={getInputStyles()}
        />

        <Textarea
          label='Learning Objectives'
          placeholder='What will students learn or achieve in this lesson?'
          value={formData.objectives}
          onChange={(e) => updateFormData('objectives', e.target.value)}
          rows={3}
          styles={getInputStyles()}
        />

        <Textarea
          label='Materials Needed'
          placeholder='List materials, resources, and equipment needed'
          value={formData.materials}
          onChange={(e) => updateFormData('materials', e.target.value)}
          rows={3}
          styles={getInputStyles()}
        />

        <Group justify='flex-end' mt='md'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button leftSection={<IconDeviceFloppy size={16} />} onClick={onSave}>
            {selectedLessonId ? 'Save Changes' : 'Create Lesson Plan'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
