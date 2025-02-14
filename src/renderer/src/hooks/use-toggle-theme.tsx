import { useState } from 'react';

export const useToggleTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = (): void => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };
  return { theme, toggleTheme };
};
