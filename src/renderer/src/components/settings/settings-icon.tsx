import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import DeepSeekDialog from './ai-deepseek-form';

const SettingsLaunchIcon: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <IconButton onClick={() => setShowSettings(true)} color="inherit">
        <SettingsIcon />
      </IconButton>
      <DeepSeekDialog open={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

export default SettingsLaunchIcon;
