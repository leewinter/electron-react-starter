import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CssBaseline, useMediaQuery } from '@mui/material';

export type ThemeType = 'light' | 'dark';

type ToggleThemeHookResponse = {
  theme: ThemeType;
  toggleTheme: () => void;
};

// Define Light & Dark Themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F9F9FE',
      paper: '#EEEEF9',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2A4364',
      paper: '#112E4D',
    },
  },
});

// Theme Context
const ThemeContext = createContext<ToggleThemeHookResponse>({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProviderWrapper({ children }: { children: ReactNode }): JSX.Element {
  // Check system preference on initial load
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const storedTheme = localStorage.getItem('theme') as ThemeType | null;

  // Set theme based on localStorage or system preference
  const [theme, setTheme] = useState<ThemeType>(
    storedTheme || (prefersDarkMode ? 'dark' : 'light'),
  );

  // Persist theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle Theme
  const toggleTheme = (): void => {
    setTheme((prev: ThemeType) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <CssBaseline /> {/* Ensures consistent background & text color */}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// Custom Hook for Theme Access
export const useToggleTheme = (): ToggleThemeHookResponse => useContext(ThemeContext);
