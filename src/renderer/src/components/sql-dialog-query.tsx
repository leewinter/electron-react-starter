import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import SqlQueryComponent from './sql-query-component';
import { SqlConnection } from '../../../shared/types/sql-connection'; // Adjust the import path as necessary

interface SqlDialogQueryProps {
  open: boolean; // Controls dialog visibility
  onClose: () => void; // Callback when dialog is closed
  query: string | null; // SQL query to display
  connection: SqlConnection | null;
}

const SqlDialogQuery: React.FC<SqlDialogQueryProps> = ({ open, onClose, query, connection }) => {
  // if (!connection?.connectionId) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>SQL Query</DialogTitle>
      <DialogContent dividers>
        <SqlQueryComponent query={query} connection={connection} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SqlDialogQuery;
