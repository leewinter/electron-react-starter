import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useDeepSeekApiKey } from '../../hooks/use-deep-seek-api-key';

interface DeepSeekDialogProps {
  open: boolean;
  onClose: () => void;
}

const DeepSeekDialog: React.FC<DeepSeekDialogProps> = ({ open, onClose }) => {
  const [key, setKey] = useState<string>('');

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
          type="password"
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
