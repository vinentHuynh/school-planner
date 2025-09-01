import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Button,
  Paper,
  Group,
  Stack,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Box,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconDeviceFloppy, IconBook } from '@tabler/icons-react';
import { DayOfWeek, LessonPlanFormData } from '../types';
import { daysOfWeek } from '../utils/dateUtils';

interface CreateLessonPageProps {
  onSave: (formData: LessonPlanFormData) => void;
}

export function CreateLessonPage({ onSave }: CreateLessonPageProps) {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  
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

  // Get theme-aware input styles
  const getInputStyles = () => ({
    input: {
      backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      color: colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.dark[9],
      border: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]}`,
    },
    label: {
      color: colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.dark[9],
      fontWeight: 500,
    },
  });

  const updateFormData = (field: keyof LessonPlanFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    return formData.title.trim() !== '' && formData.subject.trim() !== '';
  };

  const handleSave = () => {
    if (!validateForm()) {
      alert('Please fill in title and subject');
      return;
    }
    
    onSave(formData);
    navigate('/'); // Navigate back to home page after saving
  };

  const handleCancel = () => {
    navigate('/'); // Navigate back to home page
  };

  return (
    <Box p="md" style={{ minHeight: '100vh', width: '100vw' }}>
      <Container size="lg">
        <Paper p="xl" withBorder radius="md" shadow="sm">
          <Stack gap="lg">
            <Group>
              <IconBook size={24} color={theme.colors.blue[6]} />
              <Title order={2} c="blue">
                Create New Lesson Plan
              </Title>
            </Group>

            <Stack gap="md">
              <Group grow>
                <TextInput
                  label="Lesson Title"
                  placeholder="Enter lesson title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  required
                  styles={getInputStyles()}
                />
                <TextInput
                  label="Subject"
                  placeholder="e.g., Mathematics, English, Science"
                  value={formData.subject}
                  onChange={(e) => updateFormData('subject', e.target.value)}
                  required
                  styles={getInputStyles()}
                />
              </Group>

              <Group grow>
                <Select
                  label="Day of Week"
                  value={formData.day}
                  onChange={(value) => updateFormData('day', value as DayOfWeek)}
                  data={daysOfWeek.map((day) => ({ value: day.id, label: day.name }))}
                  styles={getInputStyles()}
                />
                <NumberInput
                  label="Duration (minutes)"
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
                label="Time Slot"
                placeholder="e.g., 9:00 AM - 10:30 AM (optional)"
                value={formData.timeSlot}
                onChange={(e) => updateFormData('timeSlot', e.target.value)}
                styles={getInputStyles()}
              />

              <Textarea
                label="Description"
                placeholder="Brief description of the lesson"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={3}
                styles={getInputStyles()}
              />

              <Textarea
                label="Learning Objectives"
                placeholder="What will students learn or achieve in this lesson?"
                value={formData.objectives}
                onChange={(e) => updateFormData('objectives', e.target.value)}
                rows={3}
                styles={getInputStyles()}
              />

              <Textarea
                label="Materials Needed"
                placeholder="List materials, resources, and equipment needed"
                value={formData.materials}
                onChange={(e) => updateFormData('materials', e.target.value)}
                rows={3}
                styles={getInputStyles()}
              />

              <Group justify="flex-end" mt="lg">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  leftSection={<IconDeviceFloppy size={16} />} 
                  onClick={handleSave}
                  disabled={!validateForm()}
                >
                  Create Lesson Plan
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
