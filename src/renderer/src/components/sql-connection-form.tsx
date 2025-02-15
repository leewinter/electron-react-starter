import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { type SqlConnection } from '../../../preload/index.d';

type SqlConnectionDialogProps = {
  open: boolean;
  initialData: SqlConnection | undefined;
  onClose: () => void;
  onSubmit: (data: SqlConnection) => void;
};

const SqlConnectionDialog: React.FC<SqlConnectionDialogProps> = ({
  open,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<SqlConnection | undefined>(initialData);
  const [errors, setErrors] = useState<{ [key in keyof SqlConnection]?: string }>({});

  useEffect(() => {
    if (initialData) {
      if (!formData) setFormData(initialData);
      else if (initialData.connectionId !== formData.connectionId) setFormData(initialData);
    }
  }, [initialData]);

  if (!initialData) return null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormData((prev: SqlConnection | undefined) => ({
      ...prev,
      connectionId: prev?.connectionId || '',
      connectionName: prev?.connectionName || '',
      connectionString: prev?.connectionString || '',
      [name]: value,
    }));
  };

  const validate = (): boolean => {
    const newErrors: { [key in keyof SqlConnection]?: string } = {};
    if (!formData?.connectionName?.trim()) newErrors.connectionName = 'Connection Name is required';
    if (!formData?.connectionString?.trim())
      newErrors.connectionString = 'Connection String is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (validate()) {
      if (formData) {
        onSubmit(formData);
      }
      onClose(); // Close dialog after submitting
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit SQL Connection</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
        >
          <TextField
            label="Connection ID"
            name="connectionId"
            value={formData.connectionId}
            disabled
            fullWidth
          />
          <TextField
            label="Connection Name"
            name="connectionName"
            value={formData.connectionName}
            onChange={handleChange}
            error={!!errors.connectionName}
            helperText={errors.connectionName}
            fullWidth
          />
          <TextField
            label="Connection String"
            name="connectionString"
            value={formData.connectionString}
            onChange={handleChange}
            error={!!errors.connectionString}
            helperText={errors.connectionString}
            fullWidth
            multiline
            rows={5}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SqlConnectionDialog;
