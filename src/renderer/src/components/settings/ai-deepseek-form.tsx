import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDeepSeekApiKey } from '../../hooks/use-deep-seek-api-key';

interface DeepSeekDialogProps {
  open: boolean;
  onClose: () => void;
}

const DeepSeekDialog: React.FC<DeepSeekDialogProps> = ({ open, onClose }) => {
  const [key, setKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);

  const { apiKey, setApiKey } = useDeepSeekApiKey();

  useEffect(() => {
    if (key !== apiKey) setKey(apiKey || '');
  }, [apiKey]);

  const handleSave = () => {
    setApiKey(key);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit DeepSeek API Key</DialogTitle>
      <DialogContent>
        <TextField
          label="DeepSeek API Key"
          fullWidth
          variant="outlined"
          value={key}
          onChange={(e) => setKey(e.target.value)}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeepSeekDialog;
