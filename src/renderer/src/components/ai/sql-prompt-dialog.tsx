import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import SqlEditor from '../editor/sql-code-editor';

type SqlPromptDialogProps = {
  open: boolean;
  sqlPrompt: string | null;
  onClose: () => void;
  onSubmit: (data: string) => void;
  additionalSuggestions?: any;
};

const SqlPromptDialog: React.FC<SqlPromptDialogProps> = ({
  open,
  sqlPrompt,
  onClose,
  onSubmit,
  additionalSuggestions,
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
        <SqlEditor
          code={prompt}
          onChange={setPrompt}
          additionalSuggestions={additionalSuggestions}
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
