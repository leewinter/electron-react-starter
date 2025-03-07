import { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import SqlConnectionForm from './sql-connection-form';
import SqlConnectionTable from './sql-connection-grid';
import { type SqlConnection } from '../../../../shared/types/sql-connection';
import { useSqlConnections } from '../../hooks/use-sql-connections';
import SqlInspectDialog from '../sql-inspect-dialog';
import SqlQueryHistoryDialog from '../sql-query-history-dialog';

const SqlConnectionIcon: React.FC = () => {
  const [connectionToEdit, setConnectionToEdit] = useState<SqlConnection | undefined>(undefined);
  const [historyConnection, setHistoryConnection] = useState<SqlConnection | null>(null);
  const [schemaConnection, setSchemaConnection] = useState<SqlConnection | null>(null);
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
    setSchemaConnection(connection);
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

  const handleSchemaOpen = (connection: SqlConnection): void => {
    setSchemaConnection(connection);
  };

  const handleSchemaClose = (): void => {
    setSchemaConnection(null);
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
            onSchemaInspect={(row: SqlConnection) => handleSchemaOpen(row)}
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

      {historyConnection && (
        <SqlQueryHistoryDialog
          open={historyOpen}
          onClose={handleHistoryClose}
          connection={historyConnection}
        />
      )}

      <SqlInspectDialog
        open={Boolean(schemaConnection)}
        connection={schemaConnection}
        updateConnection={handleSaveConnection}
        onClose={handleSchemaClose}
      />
    </>
  );
};

export default SqlConnectionIcon;
