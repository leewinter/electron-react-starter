import React, { useState, useEffect } from "react";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import SqlConnectionForm from './sql-connection-form'
import SqlConnectionTable from './sql-connection-grid'
import { type SqlConnection } from '../../types/events';
import { useSqlConnections } from './hooks/use-sql-connections'


const SqlConnectionIcon: React.FC = () => {
  const [connections, setConnections] = useState<Array<SqlConnection>>([]);
  const [connectionToEdit, setConnectionToEdit] = useState<SqlConnection>();
  const [open, setOpen] = useState(false);

  const { getItem, setItem } = useSqlConnections();

  useEffect(() => {
    const dataLoad = async () => {
      const results = await getItem();
      setConnections(results || [])
    };
    dataLoad();
  }, [])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSaveConnection = (connection: SqlConnection) => {
    const updatedConnections = connections.map(n => n.connectionId === connection.connectionId ? connection : n);
    if (!updatedConnections.some(n => n.connectionId === connection.connectionId)) updatedConnections.push(connection)

    setItem(updatedConnections);
    setConnections(updatedConnections);
  }

  const handleDeleteConnection = (connection: SqlConnection) => {
    const updatedConnections = connections.filter(n => n.connectionId !== connection.connectionId);

    setItem(updatedConnections);
    setConnections(updatedConnections);
  }

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
          <SqlConnectionTable data={connections} onEdit={(row) => setConnectionToEdit(row)} onDelete={(row) => handleDeleteConnection(row)} onAdd={(row) => {
            setConnectionToEdit(row)
          }} />
          <SqlConnectionForm initialData={connectionToEdit}
            onSubmit={(val) => handleSaveConnection(val)}
            open={Boolean(connectionToEdit)}
            onClose={() => setConnectionToEdit(null)} /></DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SqlConnectionIcon;
