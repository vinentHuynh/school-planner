import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { useTheme } from '../contexts';
import { ReactNode } from 'react';

interface AppThemeProviderProps {
  children: ReactNode;
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const { colorScheme } = useTheme();

  const theme = createTheme({
    // Add any theme customizations here
  });

  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme='light'
      forceColorScheme={colorScheme === 'auto' ? undefined : colorScheme}
    >
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
}
