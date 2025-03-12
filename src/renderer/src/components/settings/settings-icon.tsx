import { IconButton } from '@mui/material';
import SettingsDialog from './settings-dialog';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';

const SettingsLaunchIcon: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <IconButton onClick={() => setShowSettings(true)} color="inherit">
        <SettingsIcon />
      </IconButton>
      <SettingsDialog open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

export default SettingsLaunchIcon;
