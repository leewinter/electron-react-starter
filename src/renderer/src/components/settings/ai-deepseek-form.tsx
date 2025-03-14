import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { SystemSettings } from '../../hooks/use-settings';

interface AiSettingsFormProps {
  settings: SystemSettings;
  onUpdate: (settings: SystemSettings) => void;
}

const AiSettingsForm: React.FC<AiSettingsFormProps> = ({ settings, onUpdate }) => {
  const [showKey, setShowKey] = useState<boolean>(false);

  const handleSelectChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
  ) => {
    onUpdate({
      ...settings,
      ai: { ...settings.ai, [field]: event.target.value },
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
      <TextField
        label="DeepSeek API Key"
        fullWidth
        variant="outlined"
        value={settings.ai.deepSeekApiKey}
        onChange={(e) => handleSelectChange(e, 'deepSeekApiKey')}
        margin="dense"
        type={showKey ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowKey((prev) => !prev)}>
                  {showKey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
};

export default AiSettingsForm;
