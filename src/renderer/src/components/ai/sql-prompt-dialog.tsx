import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

type SqlPromptDialogProps = {
  open: boolean;
  sqlPrompt: string | null;
  onClose: () => void;
  onSubmit: (data: string) => void;
};

const SqlPromptDialog: React.FC<SqlPromptDialogProps> = ({
  open,
  sqlPrompt,
  onClose,
  onSubmit,
}) => {
  const [prompt, setPrompt] = useState(sqlPrompt || '');

  useEffect(() => {
    setPrompt(sqlPrompt || '');
  }, [sqlPrompt]);

  const handleSubmit = () => {
    onSubmit(prompt);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Modify SQL Prompt</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={5}
          variant="outlined"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Edit your SQL query here..."
          autoFocus
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Run
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SqlPromptDialog;
