import { type EventResponse } from '../types/events';
import { Outlet } from 'react-router';
import type { Navigation } from '@toolpad/core/AppProvider';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    dark: {
      palette: {
        background: {
          default: '#2A4364',
          paper: '#112E4D',
        },
      },
    },
    light: {
      palette: {
        background: {
          default: '#F9F9FE',
          paper: '#EEEEF9',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

declare global {
  interface Window {
    electron: {
      sendMessage: (channel: string, data: EventResponse) => void;
      onMessage: (channel: string, func: (data: EventResponse) => void) => void;
      removeListener: (channel: string) => void;
    };
  }
}

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'sql',
    title: 'SQL',
    icon: <StorageIcon />,
  },
];

const BRANDING = {
  title: 'Electron React Starter',
};

function App() {
  return (
    <ThemeProvider theme={customTheme} defaultMode="dark">
      <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING} theme={customTheme}>
        <Outlet />
      </ReactRouterAppProvider>
    </ThemeProvider>
  );
}

export default App;
