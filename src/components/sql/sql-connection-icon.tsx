import React, { useState, useEffect } from "react";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import SqlConnectionForm from './sql-connection-form'
import SqlConnectionTable from './sql-connection-grid'
import { useEventChannel } from '../../hooks/use-event-channel';
import { DataChannel, DataChannelMethod } from '../../electron/data-channels';
import { type EventRequest, type EventResponse, type SqlConnection } from '../../types/events';



const SqlConnectionIcon: React.FC = () => {
  const [connections, setConnections] = useState<Array<SqlConnection>>([]);
  const [connectionToEdit, setConnectionToEdit] = useState<SqlConnection>();
  const [open, setOpen] = useState(false);

  const { sendMessage, onMessage } = useEventChannel({ channel: DataChannel.SQL_CONNECTIONS })

  useEffect(() => {
    onMessage((data: EventResponse) => {
      setConnections(data.payload.connections);
    });
    sendMessage({
      channel: DataChannel.SQL_CONNECTIONS,
      payload: {},
      method: DataChannelMethod.GET
    } as EventRequest);
  }, [])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSaveConnection = (connection: SqlConnection) => {
    sendMessage({
      channel: DataChannel.SQL_CONNECTIONS,
      payload: connection,
      method: DataChannelMethod.POST
    } as EventRequest);
  }

  const handleDeleteConnection = (connection: SqlConnection) => {
    sendMessage({
      channel: DataChannel.SQL_CONNECTIONS,
      payload: connection,
      method: DataChannelMethod.DELETE
    } as EventRequest);
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
        <DialogContent dividers><SqlConnectionTable data={connections} onEdit={(row) => setConnectionToEdit(row)} onDelete={(row) => handleDeleteConnection(row)} onAdd={(row) => {
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
