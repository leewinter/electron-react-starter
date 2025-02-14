import { IconButton } from '@mui/material';
import { Brightness4 as MoonIcon, Brightness7 as SunIcon } from '@mui/icons-material';
import { useToggleTheme } from '../../contexts/theme-context';

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useToggleTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      color="inherit"
      title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  );
};

export default ThemeToggleButton;
