import { useState, useEffect, useCallback } from 'react';
import { Button, Container, Grid2 } from '@mui/material';

import SqlConnectionIcon from '../../sql/sql-connection-icon';
import SqlCodeEditor from '../../sql/sql-code-editor';
import SqlConnectionSelect from '../../sql/sql-connection-select';
import { EventRequest, SqlConnection } from '../../../types/events';
import { useSqlConnections } from '../../sql/hooks/use-sql-connections';
import { useEventChannel } from '../../../hooks/use-event-channel'
import { DataChannel } from '../../../electron/data-channels';

export default function SqlPage() {
  const [selectedConnection, setSelectedConnection] = useState<SqlConnection | undefined>(undefined);
  const [connections, setConnections] = useState<Array<SqlConnection>>([]);
  const [code, setCode] = useState<string>();
  const { getItem } = useSqlConnections();

  const { sendMessage, onMessage, removeListener } = useEventChannel({ channel: DataChannel.SQL_EXECUTE })

  useEffect(() => {
    const fetchData = async () => {
      const results = await getItem();
      setConnections(results || []);
    };
    fetchData();
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Grid2 container spacing={2}>

        <Grid2 size={10}>
          <SqlConnectionSelect
            onChange={(val) => {
              const selectedConnectionOption = connections.find((c) => c.connectionId === val);
              setSelectedConnection(selectedConnectionOption);
            }}
            selectedConnection={selectedConnection}
          />
        </Grid2>

        <Grid2 size={2}>
          <SqlConnectionIcon />
        </Grid2>

        <Grid2 size={12}>
          <SqlCodeEditor code={code} onChange={setCode} />
        </Grid2>

        <Grid2 size={12}>
          <Button disabled={!selectedConnection || !code} onClick={() => {
            sendMessage({ channel: DataChannel.SQL_EXECUTE, payload: { sql: code, selectedConnection } } as EventRequest)
            onMessage((response) => {
              console.log('SqlPage', response)
              removeListener();
            });
          }}>Execute</Button>
        </Grid2>

      </Grid2>
    </Container>
  );
}
