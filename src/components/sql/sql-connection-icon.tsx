import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Grid2,
  Tooltip,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import SqlConnectionForm from './sql-connection-form';
import SqlConnectionTable from './sql-connection-grid';
import { type SqlConnection } from '../../types/events';
import { useSqlConnections } from './hooks/use-sql-connections';

const truncateText = (text: string, maxLength = 100) =>
  text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

const SqlConnectionIcon: React.FC = () => {
  const [connections, setConnections] = useState<Array<SqlConnection>>([]);
  const [connectionToEdit, setConnectionToEdit] = useState<SqlConnection | null>(null);
  const [historyConnection, setHistoryConnection] = useState<SqlConnection | null>(null);
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const { getItem, setItem } = useSqlConnections();

  useEffect(() => {
    const dataLoad = async () => {
      const results = await getItem();
      setConnections(results || []);
    };
    dataLoad();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleHistoryOpen = (connection: SqlConnection) => {
    setHistoryConnection(connection);
    setHistoryOpen(true);
    console.log(connection);
  };

  const handleHistoryClose = () => {
    setHistoryConnection(null);
    setHistoryOpen(false);
  };

  const handleSaveConnection = (connection: SqlConnection) => {
    const updatedConnections = connections.map(n =>
      n.connectionId === connection.connectionId ? connection : n
    );
    if (!updatedConnections.some(n => n.connectionId === connection.connectionId))
      updatedConnections.push(connection);

    setItem(updatedConnections);
    setConnections(updatedConnections);
  };

  const handleDeleteConnection = (connection: SqlConnection) => {
    const updatedConnections = connections.filter(n => n.connectionId !== connection.connectionId);

    setItem(updatedConnections);
    setConnections(updatedConnections);
  };

  return (
    <>
      {/* SQL Connection Icon Button */}
      <IconButton color="primary" onClick={handleOpen}>
        <StorageIcon fontSize="large" />
      </IconButton>

      {/* Main SQL Connections Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>SQL Connections</DialogTitle>
        <DialogContent dividers>
          <SqlConnectionTable
            data={connections}
            onEdit={row => setConnectionToEdit(row)}
            onDelete={row => handleDeleteConnection(row)}
            onAdd={row => setConnectionToEdit(row)}
            onHistory={row => handleHistoryOpen(row)}
          />
          <SqlConnectionForm
            initialData={connectionToEdit}
            onSubmit={val => handleSaveConnection(val)}
            open={Boolean(connectionToEdit)}
            onClose={() => setConnectionToEdit(null)}
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
