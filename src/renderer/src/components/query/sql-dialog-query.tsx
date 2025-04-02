import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { SqlConnection } from '../../../../shared/types/sql-connection';
import SqlQueryComponent from './sql-query-component';
import { useMemo } from 'react';

interface SqlDialogQueryProps {
  open: boolean;
  onClose: () => void;
  query: string | null;
  connection: SqlConnection | null;
}

const SqlDialogQuery: React.FC<SqlDialogQueryProps> = ({ open, onClose, query, connection }) => {
  // Reset initial state every time the dialog opens
  const initialState = useMemo(
    () => ({
      connection,
      query: query || '',
      sqlResults: undefined,
      isEditorExpanded: true,
      isResultsExpanded: false,
    }),
    [open, connection, query], // Regenerate state when dialog opens or props change
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>SQL Query</DialogTitle>
      <DialogContent dividers>
        <SqlQueryComponent initialState={initialState} onStateChange={() => {}} />
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
