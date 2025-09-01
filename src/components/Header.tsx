import { useNavigate, useLocation } from 'react-router-dom';
import {
  Group,
  Title,
  Tabs,
  Container,
  Text,
  Stack,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core';
import { IconHome, IconPlus, IconSettings } from '@tabler/icons-react';

interface HeaderProps {
  isAmplifyReady: boolean;
}

export function Header({ isAmplifyReady }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  
  const activeTab = location.pathname === '/create-lesson' ? 'create' : 
                   location.pathname === '/settings' ? 'settings' : 'home';

  const handleTabChange = (value: string | null) => {
    if (value === 'home') {
      navigate('/');
    } else if (value === 'create') {
      navigate('/create-lesson');
    } else if (value === 'settings') {
      navigate('/settings');
    }
  };

  return (
    <Container size="xl" p="md">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Stack gap={4}>
            <Title order={1} c="blue">
              📚 School Planner - Lesson Plan Manager
            </Title>
            <Text size="sm" c="dimmed">
              Drag and drop lesson plans to organize your weekly teaching schedule
            </Text>
          </Stack>
        </Group>

        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="outline"
          radius="md"
        >
          <Tabs.List>
            <Tabs.Tab 
              value="home" 
              leftSection={<IconHome size={16} />}
            >
              Home
            </Tabs.Tab>
            <Tabs.Tab 
              value="create" 
              leftSection={<IconPlus size={16} />}
            >
              Create Lesson
            </Tabs.Tab>
            <Tabs.Tab 
              value="settings" 
              leftSection={<IconSettings size={16} />}
            >
              Settings
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {!isAmplifyReady && (
          <div>
            <Text size="sm" c="orange" p="sm" style={{ 
              backgroundColor: colorScheme === 'dark' 
                ? theme.colors.yellow[9] 
                : theme.colors.yellow[1], 
              border: `1px solid ${colorScheme === 'dark' 
                ? theme.colors.yellow[6] 
                : theme.colors.yellow[4]}`,
              borderRadius: '4px'
            }}>
              Running in demo mode - Amplify backend not connected
            </Text>
          </div>
        )}
      </Stack>
    </Container>
  );
}
