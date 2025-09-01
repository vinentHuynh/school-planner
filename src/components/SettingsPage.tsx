import { useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Stack,
  Group,
  Switch,
  Button,
  Text,
  Divider,
  Box,
  useMantineTheme,
} from '@mantine/core';
import {
  IconMoon,
  IconSun,
  IconLogout,
  IconSettings,
} from '@tabler/icons-react';

interface SettingsPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  isAmplifyReady: boolean;
}

export function SettingsPage({
  darkMode,
  onToggleDarkMode,
  onLogout,
  isAmplifyReady,
}: SettingsPageProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const theme = useMantineTheme();

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <Box p='md' style={{ minHeight: '100vh', width: '100vw' }}>
      <Container size='md'>
        <Paper p='xl' withBorder radius='md' shadow='sm'>
          <Stack gap='lg'>
            <Group>
              <IconSettings size={24} color={theme.colors.blue[6]} />
              <Title order={2} c='blue'>
                Settings
              </Title>
            </Group>

            <Divider />

            {/* Appearance Settings */}
            <Stack gap='md'>
              <Title order={3} size='h4'>
                Appearance
              </Title>

              <Group justify='space-between'>
                <Group>
                  {darkMode ? <IconMoon size={20} /> : <IconSun size={20} />}
                  <Stack gap={0}>
                    <Text fw={500}>Dark Mode</Text>
                    <Text size='sm' c='dimmed'>
                      Toggle between light and dark theme
                    </Text>
                  </Stack>
                </Group>
                <Switch
                  checked={darkMode}
                  onChange={onToggleDarkMode}
                  size='lg'
                  color='blue'
                />
              </Group>
            </Stack>

            <Divider />

            {/* Account Settings */}
            <Stack gap='md'>
              <Title order={3} size='h4'>
                Account
              </Title>

              <Stack gap='sm'>
                <Text size='sm' c='dimmed'>
                  Connection Status:{' '}
                  {isAmplifyReady ? 'Connected to AWS Amplify' : 'Demo Mode'}
                </Text>

                {!showLogoutConfirm ? (
                  <Group>
                    <Button
                      leftSection={<IconLogout size={16} />}
                      variant='outline'
                      color='red'
                      onClick={handleLogoutClick}
                    >
                      Sign Out
                    </Button>
                  </Group>
                ) : (
                  <Paper p='md' withBorder bg='red.0'>
                    <Stack gap='md'>
                      <Text fw={500} c='red'>
                        Are you sure you want to sign out?
                      </Text>
                      <Group>
                        <Button
                          variant='filled'
                          color='red'
                          onClick={handleConfirmLogout}
                          size='sm'
                        >
                          Yes, Sign Out
                        </Button>
                        <Button
                          variant='outline'
                          onClick={handleCancelLogout}
                          size='sm'
                        >
                          Cancel
                        </Button>
                      </Group>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </Stack>

            <Divider />

            {/* App Information */}
            <Stack gap='md'>
              <Title order={3} size='h4'>
                About
              </Title>

              <Stack gap='xs'>
                <Text size='sm'>
                  <Text span fw={500}>
                    Version:
                  </Text>{' '}
                  1.0.0
                </Text>
                <Text size='sm'>
                  <Text span fw={500}>
                    Last Updated:
                  </Text>{' '}
                  August 2025
                </Text>
                <Text size='sm' c='dimmed'>
                  School Planner - A modern lesson planning application built
                  with React, Mantine, and AWS Amplify.
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
