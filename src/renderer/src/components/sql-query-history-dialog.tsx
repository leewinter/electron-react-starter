import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import QueryHistoryTable from '../components/sql-query-history-table';
import { SqlConnection, QueryHistory } from '../../../shared/types/sql-connection';

interface QueryHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  connection: SqlConnection;
  queryHistoryFilter?: (query: QueryHistory) => boolean;
  filterTitle?: string;
}

const SqlQueryHistoryDialog: React.FC<QueryHistoryDialogProps> = ({
  open,
  onClose,
  connection,
  queryHistoryFilter,
  filterTitle,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>Connection History</DialogTitle>
      <DialogContent dividers>
        {connection ? (
          <>
            <Typography variant="subtitle1">
              Viewing history for:{' '}
              <strong>
                {connection.connectionName}
                {filterTitle && ` - ${filterTitle}`}
              </strong>
            </Typography>
            <QueryHistoryTable connection={connection} queryHistoryFilter={queryHistoryFilter} />
          </>
        ) : (
          <Typography>No history available.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SqlQueryHistoryDialog;
