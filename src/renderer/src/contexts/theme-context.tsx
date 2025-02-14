import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CssBaseline, useMediaQuery } from '@mui/material';

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
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => { },
});

export function ThemeProviderWrapper({ children }: { children: ReactNode }): JSX.Element {
  // Check system preference on initial load
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

  // Set theme based on localStorage or system preference
  const [theme, setTheme] = useState<'light' | 'dark'>(
    storedTheme || (prefersDarkMode ? 'dark' : 'light')
  );

  // Persist theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
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
export const useToggleTheme = () => useContext(ThemeContext);
