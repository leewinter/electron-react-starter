import { type EventResponse } from '../types/events'
import { Outlet } from 'react-router';
import type { Navigation } from '@toolpad/core/AppProvider';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';

declare global {
  interface Window {
    electron: {
      sendMessage: (channel: string, data: EventResponse) => void;
      onMessage: (channel: string, func: (data: EventResponse) => void) => void;
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
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}

export default App;