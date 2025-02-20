import { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip,
  Grid2,
  Paper,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import SqlConnectionForm from './sql-connection-form';
import SqlConnectionTable from './sql-connection-grid';
import { type SqlConnection } from '../../../shared/types/sql-connection';
import { useSqlConnections } from '../hooks/use-sql-connections';

const truncateText = (text: string, maxLength = 100): string =>
  text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

const SqlConnectionIcon: React.FC = () => {
  const [connectionToEdit, setConnectionToEdit] = useState<SqlConnection | undefined>(undefined);
  const [historyConnection, setHistoryConnection] = useState<SqlConnection | null>(null);
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const { connections, setConnections } = useSqlConnections();

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const handleSaveConnection = (connection: SqlConnection): void => {
    const updatedConnections = connections.map((n: SqlConnection) =>
      n.connectionId === connection.connectionId ? connection : n,
    );
    if (!updatedConnections.some((n: SqlConnection) => n.connectionId === connection.connectionId))
      updatedConnections.push(connection);

    setConnections(updatedConnections);
  };

  const handleDeleteConnection = (connection: SqlConnection): void => {
    const updatedConnections = connections.filter(
      (n: SqlConnection) => n.connectionId !== connection.connectionId,
    );

    setConnections(updatedConnections);
  };

  const handleHistoryOpen = (connection: SqlConnection): void => {
    setHistoryConnection(connection);
    setHistoryOpen(true);
  };

  const handleHistoryClose = (): void => {
    setHistoryConnection(null);
    setHistoryOpen(false);
  };

  return (
    <>
      {/* SQL Connection Icon Button */}
      <IconButton color="primary" onClick={handleOpen}>
        <StorageIcon fontSize="large" />
      </IconButton>

      {/* Modal/Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>SQL Connections</DialogTitle>
        <DialogContent dividers>
          <SqlConnectionTable
            data={connections}
            onEdit={(row: SqlConnection) => setConnectionToEdit(row)}
            onDelete={(row: SqlConnection) => handleDeleteConnection(row)}
            onAdd={(row: SqlConnection) => {
              setConnectionToEdit(row);
            }}
            onHistory={(row: SqlConnection) => handleHistoryOpen(row)}
          />
          <SqlConnectionForm
            initialData={connectionToEdit}
            onSubmit={(val: SqlConnection) => handleSaveConnection(val)}
            open={Boolean(connectionToEdit)}
            onClose={() => setConnectionToEdit(undefined)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyOpen} onClose={handleHistoryClose} maxWidth="md" fullWidth>
        <DialogTitle>Connection History</DialogTitle>
        <DialogContent dividers>
          {historyConnection ? (
            <>
              <Typography variant="subtitle1">
                Viewing history for: <strong>{historyConnection.connectionName}</strong>
              </Typography>
              {/* Check if queryHistory exists and has items */}
              {historyConnection.queryHistory && historyConnection.queryHistory.length > 0 ? (
                <Grid2 container spacing={2} sx={{ mt: 2 }}>
                  {historyConnection.queryHistory.map((query, index) => (
                    <Grid2 size={12} key={index}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="body1">
                          <strong>Query:</strong>{' '}
                          <Tooltip title={query.sql} arrow>
                            <span>{truncateText(query.sql, 100)}</span>
                          </Tooltip>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Rows Affected:</strong> {query.rowCountResult}
                        </Typography>
                      </Paper>
                    </Grid2>
                  ))}
                </Grid2>
              ) : (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  No query history available.
                </Typography>
              )}
            </>
          ) : (
            <Typography>No history available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHistoryClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SqlConnectionIcon;
