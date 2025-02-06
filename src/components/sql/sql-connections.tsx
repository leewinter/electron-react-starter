import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { useEventChannel } from '../../hooks/use-event-channel';
import { DataChannel, DataChannelMethod } from '../../electron/data-channels';
import { type EventRequest, type EventResponse } from '../../types/events';

export type SqlConnection = {
  connectionId: string,
  connectionName: string,
  connectionString: string
}

export default function SqlConnections() {
  const [connections, setConnections] = useState<Array<SqlConnection>>([]);
  const { sendMessage, onMessage } = useEventChannel({ channel: DataChannel.SQL_CONNECTIONS })

  const handleGetConnections = () => {
    sendMessage({
      channel: DataChannel.SQL_CONNECTIONS,
      payload: {},
      method: DataChannelMethod.GET
    } as EventRequest);
  }

  const handleSetConnections = () => {
    sendMessage({
      channel: DataChannel.SQL_CONNECTIONS,
      payload: {
        connectionId: crypto.randomUUID(),
        connectionName: 'New Connection',
        connectionString: 'abc123'
      } as SqlConnection
      ,
      method: DataChannelMethod.POST
    } as EventRequest);
  }

  useEffect(() => {
    onMessage((data: EventResponse) => {
      console.log("data", data)
      setConnections(data.payload.connections);
    });
    sendMessage({
      channel: DataChannel.SQL_CONNECTIONS,
      payload: {},
      method: DataChannelMethod.GET
    } as EventRequest);
  }, [])

  return <div>
    <button onClick={handleGetConnections}>Get Connections</button>
    <Typography>SQL Connections</Typography> {connections.length}
    <button onClick={handleSetConnections}>Set Connections</button>
  </div>;
}