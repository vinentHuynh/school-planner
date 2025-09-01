import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { MantineColorScheme } from '@mantine/core';

interface ThemeContextType {
  colorScheme: MantineColorScheme;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = useState<MantineColorScheme>(() => {
    // Check if there's a saved preference in localStorage
    const saved = localStorage.getItem('mantine-color-scheme');
    return (saved as MantineColorScheme) || 'light';
  });

  const toggleColorScheme = () => {
    setColorScheme((current) => {
      const newScheme = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('mantine-color-scheme', newScheme);
      return newScheme;
    });
  };

  useEffect(() => {
    // Save to localStorage whenever colorScheme changes
    localStorage.setItem('mantine-color-scheme', colorScheme);
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
